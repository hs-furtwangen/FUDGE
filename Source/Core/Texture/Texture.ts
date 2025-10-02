/// <reference path="../Render/RenderInjectorTexture.ts"/>

namespace FudgeCore {
  /** {@link TexImageSource} is a union type which as of now includes {@link VideoFrame}. All other parts of this union have a .width and .height property but VideoFrame does not. And since we only ever use {@link HTMLImageElement} and {@link OffscreenCanvas} currently VideoFrame can be excluded for convenience of accessing .width and .height */
  type ImageSource = Exclude<TexImageSource, VideoFrame>;

  /**
   * - CRISP: no mipmapping, mag filter nearest, min filter nearest
   * - MEDIUM: mipmapping, mag filter nearest, min filter nearest_mipmap_linear
   * - BLURRY: mipmapping, mag filter linear, min filter linear_mipmap_linear
   * - SMOOTH: no mipmapping, mag filter linear, min filter linear
   */
  export enum MIPMAP {
    CRISP, MEDIUM, BLURRY, SMOOTH
  }

  export enum WRAP {
    REPEAT, CLAMP, MIRROR
  }

  /**
   * Baseclass for different kinds of textures. 
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019
   */
  @RenderInjectorTexture.decorate
  @orderFlat
  export abstract class Texture extends Mutable implements SerializableResource {
    @order(0)
    @edit(String)
    public name: string;

    @order(1)
    @edit(String)
    public idResource: string;

    protected renderData: unknown;

    protected textureDirty: boolean = true;
    protected mipmapDirty: boolean = true;
    protected wrapDirty: boolean = true;

    #mipmap: MIPMAP = MIPMAP.CRISP;
    #wrap: WRAP = WRAP.REPEAT;

    public constructor(_name: string = "Texture") {
      super();
      this.name = _name;
    }

    @order(2)
    @edit(MIPMAP)
    public get mipmap(): MIPMAP {
      return this.#mipmap;
    }

    public set mipmap(_mipmap: MIPMAP) {
      this.#mipmap = _mipmap;
      this.mipmapDirty = true;
    }

    @order(3)
    @edit(WRAP)
    public get wrap(): WRAP {
      return this.#wrap;
    }

    public set wrap(_wrap: WRAP) {
      this.#wrap = _wrap;
      this.wrapDirty = true;
    }

    /**
     * Returns the image source of this texture.
     */
    public abstract get texImageSource(): ImageSource;

    /**
     * Generates and binds the texture in WebGL from the {@link texImageSource}. 
     * Injected by {@link RenderInjectorTexture}. Used by the render system.
     * @internal
     */
    public useRenderData(_textureUnit: number = 0): void {/* injected by RenderInjector*/ }

    /**
     * Deletes the texture in WebGL freeing the allocated gpu memory.
     * Injected by {@link RenderInjectorTexture}.
     * @internal
     */
    public deleteRenderData(): void {/* injected by RenderInjector*/ }

    /**
     * Refreshes the image data in the render engine.
     */
    public refresh(): void {
      this.textureDirty = true;
    }

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      Project.register(this, _serialization.idResource);
      await deserializeDecorations(this, _serialization);

      // TODO: Backward compatibility, remove in future version
      if (typeof _serialization.mipmap == "string")
        this.#mipmap = <number><unknown>MIPMAP[<General>_serialization.mipmap];

      // TODO: Backward compatibility, remove in future version
      if (typeof _serialization.wrap == "string")
        this.#wrap = <number><unknown>WRAP[<General>_serialization.wrap];

      return this;
    }

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.idResource;
      delete _mutator.renderData;
      delete _mutator.textureDirty;
      delete _mutator.mipmapDirty;
      delete _mutator.mipmapGenerated;
      delete _mutator.wrapDirty;
    }
  }

  /**
   * Texture created from an existing image
   */
  @orderFlat
  export class TextureImage extends Texture {
    public image: HTMLImageElement = null;

    @order(4)
    @edit(String)
    public url: RequestInfo;

    public constructor(_url?: RequestInfo) {
      super();
      if (_url) {
        this.load(_url);
        this.name = _url.toString().split("/").pop();
      }

      Project.register(this);
    }

    public get texImageSource(): ImageSource {
      return this.image;
    }

    /**
     * Asynchronously loads the image from the given url
     */
    public async load(_url: RequestInfo): Promise<void> {
      this.url = _url;
      this.image = new Image();


      // const response: Response = await window.fetch(this.url);
      // const blob: Blob = await response.blob();
      // let objectURL: string = URL.createObjectURL(blob);
      // this.image.src = objectURL;

      return new Promise((_resolve, _reject) => {
        this.image.addEventListener("load", () => {
          this.renderData = null; // refresh render data on next draw call
          _resolve();
        });
        this.image.addEventListener("error", () => _reject());
        this.image.src = new URL(this.url.toString(), Project.baseURL).toString();
      });
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (_serialization[super.constructor.name] != undefined)
        await super.deserialize(_serialization[super.constructor.name]);
      await super.deserialize(_serialization);
      await this.load(_serialization.url);
      return this;
    }

    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      if (_mutator.url && _mutator.url != this.url.toString())
        await this.load(_mutator.url);
      // except url from mutator for further processing
      // delete (_mutator.url);
      return super.mutate(_mutator, _selection, _dispatchMutate);
      // TODO: examine necessity to reconstruct, if mutator is kept by caller
      // _mutator.url = this.url; 
    }
  }

  /**
   * Texture created from a canvas
   */
  export class TextureBase64 extends Texture {
    public image: HTMLImageElement = new Image();

    public constructor(_name: string, _base64: string, _mipmap: MIPMAP = MIPMAP.CRISP, _wrap: WRAP = WRAP.REPEAT, _width?: number, _height?: number) {
      super(_name);
      this.image.src = _base64;
      this.mipmap = _mipmap;
      this.wrap = _wrap;
      if (_width)
        this.image.width = _width;
      if (_height)
        this.image.height = _height;
    }

    public get texImageSource(): ImageSource {
      return this.image;
    }
  }
  /**
   * Texture created from a canvas
   */
  export class TextureCanvas extends Texture {
    public crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

    public constructor(_name: string, _crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
      super(_name);
      this.crc2 = _crc2;
    }
    public get texImageSource(): ImageSource {
      return this.crc2.canvas;
    }
  }

  /**
   * Texture created from a text. Texture upates when the text or font changes. The texture is resized to fit the text.
   * @authors Jonas Plotzky, HFU, 2024
   */
  @orderFlat
  export class TextureText extends Texture {
    protected crc2: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    #text: string;
    #font: string;

    public constructor(_name: string = TextureText.name, _text: string = "Text", _font: string = "20px monospace") {
      super(_name);
      this.crc2 = document.createElement("canvas").getContext("2d");
      this.text = _text;
      this.font = _font;
    }

    @order(4)
    @edit(String)
    public get text(): string {
      return this.#text;
    }

    public set text(_text: string) {
      this.#text = _text;
      this.textureDirty = true;
    }

    @order(5)
    @edit(String)
    public get font(): string {
      return this.#font;
    }

    public set font(_font: string) {
      this.#font = _font;
      document.fonts.load(this.#font)
        .catch((_error) => Debug.error(`${TextureText.name}: ${_error}`))
        .finally(() => this.textureDirty = true);
    }

    public get texImageSource(): ImageSource {
      return this.canvas;
    }

    public get width(): number {
      return this.canvas.width;
    }

    public get height(): number {
      return this.canvas.height;
    }

    public get hasTransparency(): boolean {
      return true;
    }

    private get canvas(): HTMLCanvasElement | OffscreenCanvas {
      return this.crc2.canvas;
    }

    public useRenderData(_textureUnit?: number): void {
      if (this.textureDirty) {
        this.crc2.font = this.font;

        let metrics: TextMetrics = this.crc2.measureText(this.text);
        let width: number = metrics.width;
        let height: number = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

        this.canvas.width = width + this.crc2.measureText("  ").width;
        this.canvas.height = height * 1.1; // padding, otherwise on some glyphs might get cut off
        if (this.canvas.width == 0)
          return;

        this.crc2.font = this.font; // TODO: wait for font to be loaded using document.fonts
        this.crc2.textAlign = "center";
        this.crc2.textBaseline = "middle";
        this.crc2.fillStyle = "white";
        this.crc2.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.crc2.fillText(this.#text, this.canvas.width / 2, this.canvas.height / 2);
      }

      super.useRenderData(_textureUnit);
    }

    // TODO: backward compatibility, remove in future version
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (_serialization[super.constructor.name] != undefined)
        await super.deserialize(_serialization[super.constructor.name]);
      await super.deserialize(_serialization);
      return this;
    }
  }

  /**
   * Texture created from a FUDGE-Sketch
   */
  export class TextureSketch extends TextureCanvas {
    public get texImageSource(): ImageSource {
      return null;
    }
  }
  /**
   * Texture created from an HTML-page
   */
  export class TextureHTML extends TextureCanvas {
    public get texImageSource(): ImageSource {
      return null;
    }
  }
}