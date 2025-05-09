namespace FudgeCore {

  /**
   * Handles picking.
   * @internal
   */
  export class RenderWebGLPicking {
    public static fboPick: WebGLBuffer;
    public static texPick: WebGLTexture;
    public static texDepth: WebGLTexture;

    static #sizeMax: number; // the dimension of the square pick texture
    static #data: Int32Array;
    static #dataClearColor: number[] = [0, 0, 0, 0];

    /** 
     * Initialize framebuffers and render attachments.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLPicking.fboPick = _renderWebGL.assert(crc3.createFramebuffer());
      RenderWebGLPicking.texPick = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGLPicking.texDepth = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepth, 0);

      RenderWebGLPicking.resize(_renderWebGL, 10); // initial size

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /**
     * Used with a {@link Picker}-camera, this method renders one pixel with picking information 
     * for each pickable object in the line of sight and returns that as an unsorted array of {@link Pick}s.
     * The function to render the objects into the pick buffer must be provided by the caller.
     * @param _pick The function which renders objects into the pick buffer. Returns a {@link Pick} for each rendered object. 
     * **MUST** use {@link ShaderPick} or {@link ShaderPickTextured} to render objects.
     */
    public static pickFrom<T>(_from: readonly T[], _cmpCamera: ComponentCamera, _pick: (_from: readonly T[], _cmpCamera: ComponentCamera) => Pick[]): Pick[] { // TODO: see if third parameter _world?: Matrix4x4 would be usefull
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      // adjust buffer size
      const size: number = Math.ceil(Math.sqrt(_from.length));
      if (size > RenderWebGLPicking.#sizeMax)
        RenderWebGLPicking.resize(RenderWebGL, size);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
      crc3.viewport(0, 0, size, size);

      // clear buffer
      crc3.clearBufferiv(WebGL2RenderingContext.COLOR, 0, RenderWebGLPicking.#dataClearColor);
      crc3.clearBufferfi(WebGL2RenderingContext.DEPTH_STENCIL, 0, 1, 0);

      RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);

      // buffer size into pick shaders
      ShaderPick.useProgram();
      crc3.uniform1i(ShaderPick.uniforms["u_size"], size);

      ShaderPickTextured.useProgram();
      crc3.uniform1i(ShaderPickTextured.uniforms["u_size"], size);

      // render picks into pick buffer
      RenderWebGL.setBlendMode(BLEND.OPAQUE);
      const picks: Pick[] = _pick(_from, _cmpCamera);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);

      // get/filter picks
      // evaluate texture by reading pixels and extract, convert and store the information about each mesh hit
      const data: Int32Array = RenderWebGLPicking.#data;
      crc3.readPixels(0, 0, size, size, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, data);

      const picked: Pick[] = [];
      const mtxViewToWorld: Matrix4x4 = Matrix4x4.INVERSE(_cmpCamera.mtxWorldToView);
      for (let i: number = 0; i < picks.length; i++) {
        let zBuffer: number = data[4 * i + 0] + data[4 * i + 1] / 256;
        if (zBuffer == 0) // discard misses 
          continue;
        let pick: Pick = picks[i];
        pick.zBuffer = RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 0) * 2 - 1;
        pick.color = RenderWebGLPicking.convertInt32toColor(data, 4 * i + 1);
        pick.textureUV = Recycler.reuse(Vector2);
        pick.textureUV.set(RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 2), RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 3));
        pick.mtxViewToWorld = mtxViewToWorld;

        picked.push(pick);
      }
      Recycler.store(mtxViewToWorld);

      // reset
      RenderWebGL.resetFramebuffer();
      const canvasRectangle: Rectangle = RenderWebGL.getCanvasRectangle();
      crc3.viewport(0, 0, canvasRectangle.width, canvasRectangle.height);

      return picked;
    }

    private static convertInt32toFloat32(_int32Array: Int32Array, _index: number): number {
      let buffer: ArrayBuffer = new ArrayBuffer(4);
      let view: DataView = new DataView(buffer);
      view.setInt32(0, _int32Array[_index]);
      return view.getFloat32(0);
    }

    private static convertInt32toColor(_int32Array: Int32Array, _index: number): Color {
      let buffer: ArrayBuffer = new ArrayBuffer(4);
      let view: DataView = new DataView(buffer);
      view.setInt32(0, _int32Array[_index]);
      let color: Color = Color.CSS(`rgb(${view.getUint8(0)}, ${view.getUint8(1)}, ${view.getUint8(2)})`, view.getUint8(3) / 255);
      return color;
    }

    private static resize(_renderWebGL: typeof RenderWebGL, _size: number): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLPicking.#sizeMax = _size;
      RenderWebGLPicking.#data = new Int32Array(_size * _size * 4);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32I, _size, _size, 0, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, null); // could use RBGA32F in the future e.g. WebGPU
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepth);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH_COMPONENT24, _size, _size, 0, WebGL2RenderingContext.DEPTH_COMPONENT, WebGL2RenderingContext.UNSIGNED_INT, null);
    }
  }
}
