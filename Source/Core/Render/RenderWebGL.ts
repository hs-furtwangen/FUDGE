///<reference path="RenderInjectorShader.ts"/>
///<reference path="RenderInjectorMesh.ts"/>
///<reference path="RenderInjectorShaderParticleSystem.ts"/>
///<reference path="RenderInjectorComponentParticleSystem.ts"/>
///<reference path="../Math/Rectangle.ts"/>

namespace FudgeCore {
  // export declare let fudgeConfig: General;

  export type RenderTexture = WebGLTexture;

  export enum BLEND {
    OPAQUE, TRANSPARENT, ADDITIVE, SUBTRACTIVE, MODULATE
  }

  export enum DEPTH_FUNCTION {
    NEVER, LESS, EQUAL, LESS_EQUAL, GREATER, NOT_EQUAL, GREATER_EQUAL, ALWAYS
  }

  export enum SHADER_ATTRIBUTE { // keep in sync with shader source code
    POSITION,
    NORMAL,
    TEXCOORDS,
    COLOR,
    TANGENT,
    BONES,
    WEIGHTS
  }

  // we want type inference here so we can use vs code to search for references
  export const UNIFORM_BLOCK = { // eslint-disable-line
    LIGHTS: {
      NAME: "Lights",
      BINDING: 0
    },
    CAMERA: {
      NAME: "Camera",
      BINDING: 1
    },
    MATERIAL: {
      NAME: "Material",
      BINDING: 2
    },
    NODE: {
      NAME: "Node",
      BINDING: 3
    },
    SKIN: {
      NAME: "Skin",
      BINDING: 4
    },
    FOG: {
      NAME: "Fog",
      BINDING: 5
    }
  } as const;

  export const TEXTURE_LOCATION = { // eslint-disable-line
    COLOR: {
      UNIFORM: "u_texColor",
      UNIT: WebGL2RenderingContext.TEXTURE0,
      INDEX: 0 // could compute these by UNIT - WebGL2RenderingContext.TEXTURE0 
    },
    NORMAL: {
      UNIFORM: "u_texNormal",
      UNIT: WebGL2RenderingContext.TEXTURE1,
      INDEX: 1
    },
    PARTICLE: {
      UNIFORM: "u_particleSystemRandomNumbers",
      UNIT: WebGL2RenderingContext.TEXTURE2,
      INDEX: 2
    },
    TEXT: {
      UNIFORM: "u_texText", // TODO: add text uniform to shader...
      UNIT: WebGL2RenderingContext.TEXTURE3,
      INDEX: 3
    },
    TOON: {
      UNIFORM: "u_texToon",
      UNIT: WebGL2RenderingContext.TEXTURE4,
      INDEX: 4
    }
  } as const;

  /**
   * Base class for RenderManager, handling the connection to the rendering system, in this case WebGL.
   * Methods and attributes of this class should not be called directly, only through {@link Render}
   */
  export abstract class RenderWebGL extends EventTargetStatic {
    protected static crc3: WebGL2RenderingContext = RenderWebGL.initialize();

    private static rectRender: Rectangle = RenderWebGL.getCanvasRect();

    private static fboMain: WebGLFramebuffer; // used for forward rendering passes, e.g. opaque and transparent objects
    private static fboPost: WebGLFramebuffer; // used for post-processing effects, attachments get swapped for different effects
    private static fboTarget: WebGLFramebuffer; // used to render the final image to, usually "null" to render to the canvas default framebuffer. Used by XR to render to the XRWebGLLayer framebuffer.

    private static texColor: WebGLTexture; // stores the color of each pixel rendered
    private static texPosition: WebGLTexture; // stores the position of each pixel in world space
    private static texNormal: WebGLTexture; // stores the normal of each pixel in world space
    private static texNoise: WebGLTexture; // stores random values for each pixel, used for ambient occlusion
    private static texDepthStencil: WebGLTexture; // stores the depth of each pixel, currently unused
    private static texBloomSamples: WebGLTexture[]; // stores down and upsampled versions of the color texture, used for bloom

    private static texDepthStencilOutline: WebGLTexture;


    private static fboPick: WebGLBuffer;
    private static texPick: WebGLTexture;
    private static texDepthPick: WebGLTexture;

    private static uboCamera: WebGLBuffer; // TODO: technically we should have one buffer per camera, and switch between them, similar to how skeletons are handled. But having cameras outside of any scene proves to be a problem...
    private static uboLights: WebGLBuffer;
    private static uboLightsOffsets: { [_name: string]: number }; // Maps the names of the variables inside the Lights uniform block to their respective byte offset
    private static uboFog: WebGLBuffer;

    /**
     * Initializes offscreen-canvas, renderingcontext and hardware viewport. Call once before creating any resources like meshes or shaders
     */
    public static initialize(_antialias?: boolean, _alpha?: boolean): WebGL2RenderingContext {
      let fudgeConfig: General = Reflect.get(globalThis, "fudgeConfig") || {};
      const antialias: boolean = (_antialias != undefined) ? _antialias : fudgeConfig.antialias || false;
      if (antialias)
        Debug.error("The default antialiasing is not compatible with the current post-processing effects and will therefore be disabled.");
      let contextAttributes: WebGLContextAttributes = { // TODO: 
        alpha: (_alpha != undefined) ? _alpha : fudgeConfig.alpha || false,
        antialias: false,
        premultipliedAlpha: false,
        stencil: true
      };
      Debug.fudge("Initialize RenderWebGL", contextAttributes);
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      let crc3: WebGL2RenderingContext;
      crc3 = RenderWebGL.assert<WebGL2RenderingContext>(
        canvas.getContext("webgl2", contextAttributes),
        "WebGL-context couldn't be created"
      );
      RenderWebGL.crc3 = crc3;
      // Enable backface- and zBuffer-culling.
      crc3.enable(WebGL2RenderingContext.CULL_FACE);
      crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
      crc3.enable(WebGL2RenderingContext.BLEND);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
      RenderWebGL.rectRender = RenderWebGL.getCanvasRect();

      RenderWebGL.initializeAttachments();
      RenderWebGL.adjustAttachments();

      RenderWebGL.initializeCamera();
      RenderWebGL.initializeLights();
      RenderWebGL.initializeFog();

      return crc3;
    }

    /**
    * Checks the first parameter and throws an exception with the WebGL-errorcode if the value is null
    * @param _value  value to check against null
    * @param _message  optional, additional message for the exception
    */
    public static assert<T>(_value: T | null, _message: string = ""): T {
      if (_value === null)
        throw new Error(`Assertion failed. ${_message}, WebGL-Error: ${RenderWebGL.crc3 ? RenderWebGL.crc3.getError() : ""}`);
      return _value;
    }

    /**
     * Return a reference to the offscreen-canvas
     */
    public static getCanvas(): HTMLCanvasElement {
      return <HTMLCanvasElement>RenderWebGL.crc3.canvas; // TODO: enable OffscreenCanvas
    }

    /**
     * Return a reference to the rendering context
     */
    public static getRenderingContext(): WebGL2RenderingContext {
      return RenderWebGL.crc3;
    }

    /**
     * Return a rectangle describing the size of the offscreen-canvas. x,y are 0 at all times.
     */
    public static getCanvasRect(): Rectangle {
      let canvas: HTMLCanvasElement = <HTMLCanvasElement>RenderWebGL.crc3.canvas;
      return Rectangle.GET(0, 0, canvas.width, canvas.height);
    }

    /**
     * Set the size of the offscreen-canvas.
     */
    public static setCanvasSize(_width: number, _height: number): void {
      RenderWebGL.crc3.canvas.width = _width;
      RenderWebGL.crc3.canvas.height = _height;
    }

    /**
     * Set the area on the offscreen-canvas to render the camera image to.
     * @param _rect
     */
    public static setRenderRectangle(_rect: Rectangle): void {
      RenderWebGL.rectRender.setPositionAndSize(_rect.x, _rect.y, _rect.width, _rect.height);
      RenderWebGL.crc3.viewport(_rect.x, _rect.y, _rect.width, _rect.height);
    }

    /**
     * Clear the offscreen renderbuffer with the given {@link Color}
     */
    public static clear(_color?: Color, _colors: boolean = true, _depth: boolean = true, _stencil: boolean = true): void {
      RenderWebGL.crc3.clearColor(_color?.r ?? 0, _color?.g ?? 0, _color?.b ?? 0, _color?.a ?? 1);
      let mask: number = 0;
      if (_colors)
        mask |= WebGL2RenderingContext.COLOR_BUFFER_BIT;
      if (_depth)
        mask |= WebGL2RenderingContext.DEPTH_BUFFER_BIT;
      if (_stencil)
        mask |= WebGL2RenderingContext.STENCIL_BUFFER_BIT;
      RenderWebGL.crc3.clear(mask);
    }

    /**
     * Set the final framebuffer to render to. If null, the canvas default framebuffer is used.
     * Used by XR to render to the XRWebGLLayer framebuffer.
     */
    public static setFramebufferTarget(_buffer: WebGLFramebuffer): void {
      RenderWebGL.fboTarget = _buffer;
    }

    /**
     * Reset the framebuffer to the main color buffer.
     */
    public static resetFramebuffer(): void {
      RenderWebGL.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboMain);
    }

    /**
     * Retrieve the area on the offscreen-canvas the camera image gets rendered to.
     */
    public static getRenderRectangle(): Rectangle {
      return RenderWebGL.rectRender;
    }

    /**
     * Enable / Disable WebGLs depth test.
     */
    public static setDepthTest(_test: boolean): void {
      if (_test)
        RenderWebGL.crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
      else
        RenderWebGL.crc3.disable(WebGL2RenderingContext.DEPTH_TEST);
    }

    /**
     * Set the comparison operation used to test fragment depths against current depth buffer values.
     */
    public static setDepthFunction(_function: DEPTH_FUNCTION = DEPTH_FUNCTION.LESS): void {
      RenderWebGL.crc3.depthFunc(_function + WebGL2RenderingContext.NEVER);
    }

    /**
     * Enable / Disable WebGLs scissor test.
     */
    public static setScissorTest(_test: boolean, _x?: number, _y?: number, _width?: number, _height?: number): void {
      if (_test)
        RenderWebGL.crc3.enable(WebGL2RenderingContext.SCISSOR_TEST);
      else
        RenderWebGL.crc3.disable(WebGL2RenderingContext.SCISSOR_TEST);
      RenderWebGL.crc3.scissor(_x, _y, _width, _height);
    }

    /**
     * Set which color components to enable or to disable when rendering to a color buffer.
     */
    public static setColorWriteMask(_r: boolean, _g: boolean, _b: boolean, _a: boolean): void {
      RenderWebGL.crc3.colorMask(_r, _g, _b, _a);
    }

    /**
     * Set WebGLs viewport.
     */
    public static setViewport(_x: number, _y: number, _width: number, _height: number): void {
      RenderWebGL.crc3.viewport(_x, _y, _width, _height);
    }

    /**
     * Set the blend mode to render with
     */
    public static setBlendMode(_mode: BLEND): void {
      switch (_mode) {
        case BLEND.OPAQUE:
          RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
          RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ZERO);
          break;
        case BLEND.TRANSPARENT:
          RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
          // RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
          RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
          break;
        case BLEND.ADDITIVE:
          RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
          // RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ONE);
          RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE);
          break;
        case BLEND.SUBTRACTIVE:
          RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT);
          // RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ONE);
          RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE);
          break;
        case BLEND.MODULATE: // color gets multiplied, tried to copy unitys "Particle Shader: Blending Option: Rendering Mode: Modulate"
          RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
          RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.DST_COLOR, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
        default:
          break;
      }
    }

    /**
     * Read the (world) position from the pixel at the given point on the render-rectangle (origin top left).
     * ⚠️ CAUTION: Currently only works when ambient occlusion is active due to writing to the position texture being disabled otherwise.
     */
    public static pointRenderToWorld(_render: Vector2): Vector3 {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const data: Float32Array = new Float32Array(4);
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboMain);
      crc3.readBuffer(WebGL2RenderingContext.COLOR_ATTACHMENT1);
      crc3.readPixels(_render.x, RenderWebGL.rectRender.height - _render.y, 1, 1, crc3.RGBA, crc3.FLOAT, data);
      crc3.readBuffer(WebGL2RenderingContext.COLOR_ATTACHMENT0);
      let position: Vector3 = Recycler.get(Vector3);
      position.set(data[0], data[1], data[2]);
      return position;
    }

    /**
     * Initializes different framebuffers aswell as texture attachments to use as render targets
     */
    public static initializeAttachments(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.crc3;

      crc3.getExtension("EXT_color_buffer_float"); // TODO: disable ssao if not supported

      RenderWebGL.fboMain = RenderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      RenderWebGL.fboPost = RenderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      RenderWebGL.fboTarget = null;
      RenderWebGL.fboPick = RenderWebGL.assert(crc3.createFramebuffer());

      RenderWebGL.texColor = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texPosition = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texNormal = createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texDepthStencil = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texNoise = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texPick = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texDepthPick = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      RenderWebGL.texDepthStencilOutline = createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      RenderWebGL.texBloomSamples = new Array(6);
      for (let i: number = 0; i < RenderWebGL.texBloomSamples.length; i++)
        RenderWebGL.texBloomSamples[i] = createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboMain);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT2, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil, 0);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboPick);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPick, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthPick, 0);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);

      function createTexture(_filter: number, _wrap: number): WebGLTexture {
        const texture: WebGLTexture = RenderWebGL.assert<WebGLTexture>(crc3.createTexture());
        crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, _filter);
        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, _filter);
        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, _wrap);
        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, _wrap);
        crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
        return texture;
      }
    }

    /**
     * Adjusts the size of the different texture attachments (render targets) to the canvas size
     * ⚠️ CAUTION: Expensive operation, use only when canvas size changed
     */
    public static adjustAttachments(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const width: number = crc3.canvas.width || 1;
      const height: number = crc3.canvas.height || 1;

      crc3.activeTexture(crc3.TEXTURE0);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, width, height, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition);
      // In view space 16F would be precise enough... but we want to use world space for calculations
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32F, width, height, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA16F, width, height, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, width, height, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencilOutline);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, width, height, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);

      for (let i: number = 0, divisor: number = 1; i < RenderWebGL.texBloomSamples.length; i++, divisor *= 2) {
        let width: number = Math.max(Math.round(crc3.canvas.width / divisor), 1);
        let height: number = Math.max(Math.round(crc3.canvas.height / divisor), 1);
        crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texBloomSamples[i]);
        crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, width, height, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);
      }

      const nValues: number = width * height * 4;
      const noiseData: Uint8Array = new Uint8Array(nValues);

      for (let i: number = 0; i < nValues; i += 4) {
        noiseData[i] = Math.floor(Math.random() * 256);
        noiseData[i + 1] = Math.floor(Math.random() * 256);
        noiseData[i + 2] = Math.floor(Math.random() * 256);
        noiseData[i + 3] = Math.floor(Math.random() * 256);
      }

      crc3.bindTexture(crc3.TEXTURE_2D, RenderWebGL.texNoise);
      crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, width, height, 0, crc3.RGBA, crc3.UNSIGNED_BYTE, noiseData);
      crc3.bindTexture(crc3.TEXTURE_2D, null);
    }

    /**
     * Buffer the camera data into the camera ubo
     */
    public static bufferCamera(_cmpCamera: ComponentCamera): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const mtxView: Matrix4x4 = _cmpCamera.mtxCameraInverse;
      const mtxProjection: Matrix4x4 = _cmpCamera.mtxProjection;
      const mtxViewProjection: Matrix4x4 = _cmpCamera.mtxWorldToView;
      const vctPosition: Vector3 = _cmpCamera.mtxWorld.translation;

      const data: Float32Array = new Float32Array(16 + 16 + 16 + 3);
      data.set(mtxView.get(), 0);
      data.set(mtxProjection.get(), 16);
      data.set(mtxViewProjection.get(), 32);
      data.set(vctPosition.get(), 48);

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGL.uboCamera);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, data, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    public static useNodeUniforms(_shader: ShaderInterface, _mtxWorld: Matrix4x4, _mtxPivot: Matrix3x3, _color: Color, _id?: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.crc3;

      let uniform: WebGLUniformLocation = _shader.uniforms["u_mtxMeshToWorld"];
      if (uniform && _mtxWorld)
        crc3.uniformMatrix4fv(uniform, false, _mtxWorld.getData());

      uniform = _shader.uniforms["u_mtxPivot"];
      if (uniform && _mtxPivot)
        crc3.uniformMatrix3fv(_shader.uniforms["u_mtxPivot"], false, _mtxPivot.getData());

      uniform = _shader.uniforms["u_vctColorPrimary"];
      if (uniform && _color)
        crc3.uniform4fv(uniform, _color.get());

      uniform = _shader.uniforms["u_id"];
      if (uniform)
        RenderWebGL.crc3.uniform1i(uniform, _id);
    }

    //#region Picking
    /**
     * Used with a {@link Picker}-camera, this method renders one pixel with picking information 
     * for each pickable object in the line of sight and returns that as an unsorted array of {@link Pick}s.
     * The function to render the objects into the pick buffer must be provided by the caller.
     * @param _pick The function which renders objects into the pick buffer. Returns a {@link Pick} for each rendered object. 
     * **MUST** use {@link ShaderPick} or {@link ShaderPickTextured} to render objects.
     */
    public static pickFrom<T>(_from: T[], _cmpCamera: ComponentCamera, _pick: (_from: T[], _cmpCamera: ComponentCamera) => Pick[]): Pick[] { // TODO: see if third parameter _world?: Matrix4x4 would be usefull
      const size: number = Math.ceil(Math.sqrt(_from.length));
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      // adjust pick buffer size
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboPick);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPick);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32I, size, size, 0, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, null); // could use RBGA32F in the future e.g. WebGPU
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthPick);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH_COMPONENT24, size, size, 0, WebGL2RenderingContext.DEPTH_COMPONENT, WebGL2RenderingContext.UNSIGNED_INT, null);
      crc3.clear(WebGL2RenderingContext.DEPTH_BUFFER_BIT);

      RenderWebGL.bufferCamera(_cmpCamera);

      // buffer size into pick shaders
      ShaderPick.useProgram();
      crc3.uniform2fv(ShaderPick.uniforms["u_vctSize"], [size, size]);

      ShaderPickTextured.useProgram();
      crc3.uniform2fv(ShaderPickTextured.uniforms["u_vctSize"], [size, size]);

      // render picks into pick buffer
      RenderWebGL.setBlendMode(BLEND.OPAQUE);
      let picks: Pick[] = _pick(_from, _cmpCamera);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);

      // get/filter picks
      // evaluate texture by reading pixels and extract, convert and store the information about each mesh hit
      let data: Int32Array = new Int32Array(size * size * 4);
      Render.crc3.readPixels(0, 0, size, size, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, data);

      let picked: Pick[] = [];
      let mtxViewToWorld: Matrix4x4 = Matrix4x4.INVERSE(_cmpCamera.mtxWorldToView);
      for (let i: number = 0; i < picks.length; i++) {
        let zBuffer: number = data[4 * i + 0] + data[4 * i + 1] / 256;
        if (zBuffer == 0) // discard misses 
          continue;
        let pick: Pick = picks[i];
        pick.zBuffer = convertInt32toFloat32(data, 4 * i + 0) * 2 - 1;
        pick.color = convertInt32toColor(data, 4 * i + 1);
        pick.textureUV = Recycler.reuse(Vector2);
        pick.textureUV.set(convertInt32toFloat32(data, 4 * i + 2), convertInt32toFloat32(data, 4 * i + 3));
        pick.mtxViewToWorld = mtxViewToWorld;

        picked.push(pick);
      }

      RenderWebGL.resetFramebuffer();

      return picked;

      function convertInt32toFloat32(_int32Array: Int32Array, _index: number): number {
        let buffer: ArrayBuffer = new ArrayBuffer(4);
        let view: DataView = new DataView(buffer);
        view.setInt32(0, _int32Array[_index]);
        return view.getFloat32(0);
      }

      function convertInt32toColor(_int32Array: Int32Array, _index: number): Color {
        let buffer: ArrayBuffer = new ArrayBuffer(4);
        let view: DataView = new DataView(buffer);
        view.setInt32(0, _int32Array[_index]);
        let color: Color = Color.CSS(`rgb(${view.getUint8(0)}, ${view.getUint8(1)}, ${view.getUint8(2)})`, view.getUint8(3) / 255);
        return color;
      }
    }

    /**
     * The render function for picking nodes. 
     * A cameraprojection with extremely narrow focus is used, so each pixel of the buffer would hold the same information from the node,  
     * but the fragment shader renders only 1 pixel for each node into the render buffer, 1st node to 1st pixel, 2nd node to second pixel etc.
     */
    protected static pick(_nodes: Node[], _cmpCamera: ComponentCamera): Pick[] {
      let picks: Pick[] = [];

      for (const node of _nodes) {
        let cmpMesh: ComponentMesh = node.getComponent(ComponentMesh);
        let cmpMaterial: ComponentMaterial = node.getComponent(ComponentMaterial);
        if (!(cmpMesh && cmpMesh.isActive && cmpMaterial && cmpMaterial.isActive))
          continue;

        let coat: Coat = cmpMaterial.material.coat;
        let shader: ShaderInterface = coat instanceof CoatTextured ? ShaderPickTextured : ShaderPick;

        shader.useProgram();
        UniformBufferManagerMaterial.instance.useRenderData(coat);
        // coat.useRenderData();

        let mtxMeshToWorld: Matrix4x4 = RenderWebGL.faceCamera(node, cmpMesh.mtxWorld, _cmpCamera.mtxWorld);
        RenderWebGL.useNodeUniforms(shader, mtxMeshToWorld, cmpMaterial.mtxPivot, cmpMaterial.clrPrimary, picks.length);

        const renderBuffers: RenderBuffers = cmpMesh.mesh.useRenderBuffers();
        RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);

        picks.push(new Pick(node));
      }

      return picks;
    }
    //#endregion

    protected static initializeCamera(): void {
      RenderWebGL.uboCamera = RenderWebGL.assert(RenderWebGL.crc3.createBuffer());
      RenderWebGL.crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.CAMERA.BINDING, RenderWebGL.uboCamera);
    }

    protected static initializeFog(): void {
      RenderWebGL.uboFog = RenderWebGL.assert(RenderWebGL.crc3.createBuffer());
      RenderWebGL.crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.FOG.BINDING, RenderWebGL.uboFog);
    }

    /**
     * Buffer the fog parameters into the fog ubo
     */
    protected static bufferFog(_cmpFog: ComponentFog): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const data: Float32Array = new Float32Array(8);

      data[0] = _cmpFog?.isActive ? 1 : 0;
      if (_cmpFog) {
        data[1] = _cmpFog.near;
        data[2] = _cmpFog.far;
        data.set(_cmpFog.color.get(), 4);
      }

      // buffer data to bound buffer
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGL.uboFog);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, data, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    protected static initializeLights(): void {
      const MAX_LIGHTS_DIRECTIONAL: number = 15; // must match the define in the shader
      const MAX_LIGHTS_POINT: number = 100;
      const MAX_LIGHTS_SPOT: number = 100;
      const BYTES_PER_LIGHT: number = Float32Array.BYTES_PER_ELEMENT * (4 + 16 + 16); // vctColor + mtxShape + mtxShapeInverse as float32s in shader

      RenderWebGL.uboLightsOffsets = {};
      RenderWebGL.uboLightsOffsets["u_nLightsDirectional"] = Uint32Array.BYTES_PER_ELEMENT * 0;
      RenderWebGL.uboLightsOffsets["u_nLightsPoint"] = Uint32Array.BYTES_PER_ELEMENT * 1;
      RenderWebGL.uboLightsOffsets["u_nLightsSpot"] = Uint32Array.BYTES_PER_ELEMENT * 2;
      RenderWebGL.uboLightsOffsets["u_ambient"] = Uint32Array.BYTES_PER_ELEMENT * 4;
      RenderWebGL.uboLightsOffsets["u_directional"] = RenderWebGL.uboLightsOffsets["u_ambient"] + BYTES_PER_LIGHT * 1;
      RenderWebGL.uboLightsOffsets["u_point"] = RenderWebGL.uboLightsOffsets["u_directional"] + BYTES_PER_LIGHT * MAX_LIGHTS_DIRECTIONAL;
      RenderWebGL.uboLightsOffsets["u_spot"] = RenderWebGL.uboLightsOffsets["u_point"] + BYTES_PER_LIGHT * MAX_LIGHTS_POINT;

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      RenderWebGL.uboLights = RenderWebGL.assert(crc3.createBuffer());
      const blockSize: number = RenderWebGL.uboLightsOffsets["u_spot"] + BYTES_PER_LIGHT * MAX_LIGHTS_SPOT;

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGL.uboLights);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, blockSize, crc3.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGL.uboLights);
    }

    /**
     * Buffer the data from the lights in the scenegraph into the lights ubo
     */
    protected static bufferLights(_lights: MapLightTypeToLightList): void {
      if (!RenderWebGL.uboLights)
        return;

      RenderWebGL.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGL.uboLights);

      // fill the buffer with the ambient light color
      let cmpLights: RecycableArray<ComponentLight> = _lights.get(LightAmbient);
      if (cmpLights) {
        let clrSum: Color = new Color(0, 0, 0, 0);
        for (let cmpLight of cmpLights) {
          let clrLight: Color = Color.PRODUCT(cmpLight.light.color, cmpLight.light.intensity);
          clrSum.add(clrLight);
          Recycler.store(clrLight);
        }

        RenderWebGL.crc3.bufferSubData(
          RenderWebGL.crc3.UNIFORM_BUFFER,
          RenderWebGL.uboLightsOffsets["u_ambient"], // byte offset of the struct Light "u_ambient" inside the ubo
          new Float32Array(clrSum.get())
        );
      }

      // fill the buffer with the light data for each light type
      // we are currently doing a maximum of 4 crc3.bufferSubData() calls, but we could do this in one call
      bufferLightsOfType(LightDirectional, "u_nLightsDirectional", "u_directional");
      bufferLightsOfType(LightPoint, "u_nLightsPoint", "u_point");
      bufferLightsOfType(LightSpot, "u_nLightsSpot", "u_spot");

      function bufferLightsOfType(_type: TypeOfLight, _uniName: string, _uniStruct: string): void {
        const cmpLights: RecycableArray<ComponentLight> = _lights.get(_type);

        RenderWebGL.crc3.bufferSubData(
          RenderWebGL.crc3.UNIFORM_BUFFER,
          RenderWebGL.uboLightsOffsets[_uniName], // byte offset of the uint "u_nLightsDirectional" inside the ubo
          new Uint8Array([cmpLights?.length ?? 0])
        );

        if (!cmpLights)
          return;

        const lightDataSize: number = 4 + 16 + 16; // vctColor + mtxShape + mtxShapeInverse, as float32s
        const lightsData: Float32Array = new Float32Array(cmpLights.length * lightDataSize);

        let iLight: number = 0;
        for (let cmpLight of cmpLights) {
          const lightDataOffset: number = iLight * lightDataSize;

          // set vctColor
          let clrLight: Color = Color.PRODUCT(cmpLight.light.color, cmpLight.light.intensity);
          lightsData.set(clrLight.get(), lightDataOffset + 0);
          Recycler.store(clrLight);

          // set mtxShape
          let mtxTotal: Matrix4x4 = Matrix4x4.PRODUCT(cmpLight.node.mtxWorld, cmpLight.mtxPivot);
          if (_type == LightDirectional) {
            let zero: Vector3 = Vector3.ZERO();
            mtxTotal.translation = zero;
            Recycler.store(zero);
          }

          lightsData.set(mtxTotal.get(), lightDataOffset + 4); // offset + vctColor

          // set mtxShapeInverse
          if (_type != LightDirectional) {
            let mtxInverse: Matrix4x4 = Matrix4x4.INVERSE(mtxTotal);
            lightsData.set(mtxInverse.get(), lightDataOffset + 4 + 16); // offset + vctColor + mtxShape
            Recycler.store(mtxInverse);
          }

          Recycler.store(mtxTotal);
          iLight++;
        }

        RenderWebGL.crc3.bufferSubData(
          RenderWebGL.crc3.UNIFORM_BUFFER,
          RenderWebGL.uboLightsOffsets[_uniStruct], // byte offset of the struct Light array inside the ubo
          lightsData
        );
      }
    }

    /**
     * Draws the given nodes using the given camera and the post process components attached to the same node as the camera
     * The opaque nodes are drawn first, then ssao is applied, then bloom is applied, then nodes alpha (sortForAlpha) are drawn.
     */
    protected static drawNodes(_nodesOpaque: Iterable<Node>, _nodesAlpha: Iterable<Node>, _cmpCamera: ComponentCamera): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const cmpFog: ComponentFog = _cmpCamera.node?.getComponent(ComponentFog);
      const cmpAmbientOcclusion: ComponentAmbientOcclusion = _cmpCamera.node?.getComponent(ComponentAmbientOcclusion);
      const cmpBloom: ComponentBloom = _cmpCamera.node?.getComponent(ComponentBloom);
      const cmpOutline: ComponentOutline = _cmpCamera.node?.getComponent(ComponentOutline);

      RenderWebGL.bufferFog(cmpFog);
      RenderWebGL.bufferCamera(_cmpCamera);

      // opaque pass 
      // TODO: think about disabling blending for all opaque objects, this might improve performance 
      // as otherwise the 3 color attachments (color, position and normals) all need to be blended
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboMain);
      crc3.drawBuffers(cmpAmbientOcclusion?.isActive ? // only use position and normal textures if ambient occlusion is active
        [WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.COLOR_ATTACHMENT2] :
        [WebGL2RenderingContext.COLOR_ATTACHMENT0]
      );

      crc3.disable(WebGL2RenderingContext.BLEND);
      for (let node of _nodesOpaque)
        RenderWebGL.drawNode(node, _cmpCamera);
      crc3.enable(WebGL2RenderingContext.BLEND);

      // ambient occlusion pass
      if (cmpAmbientOcclusion?.isActive)
        RenderWebGL.drawAmbientOcclusion(_cmpCamera, cmpAmbientOcclusion);

      // transparent pass TODO: think about disabling depth write for all transparent objects -> this might make depth mask option in component particle system obsolete
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboMain);
      crc3.drawBuffers([WebGL2RenderingContext.COLOR_ATTACHMENT0]);

      // crc3.depthMask(false);
      for (let node of _nodesAlpha)
        RenderWebGL.drawNode(node, _cmpCamera);
      // crc3.depthMask(true);

      // bloom pass
      if (cmpBloom?.isActive)
        RenderWebGL.drawBloom(cmpBloom);

      if (cmpOutline?.isActive)
        RenderWebGL.drawOutline(cmpOutline.selection, _cmpCamera, cmpOutline);

      // copy framebuffer to canvas
      crc3.bindFramebuffer(WebGL2RenderingContext.READ_FRAMEBUFFER, RenderWebGL.fboMain);
      crc3.bindFramebuffer(WebGL2RenderingContext.DRAW_FRAMEBUFFER, RenderWebGL.fboTarget);
      crc3.blitFramebuffer(0, 0, crc3.canvas.width, crc3.canvas.height, 0, 0, crc3.canvas.width, crc3.canvas.height, WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT, WebGL2RenderingContext.NEAREST);
    }

    /**
     * Draws the occlusion over the color-buffer, using the given ambient-occlusion-component
     */
    @PerformanceMonitor.measure()
    protected static drawAmbientOcclusion(_cmpCamera: ComponentCamera, _cmpAmbientOcclusion: ComponentAmbientOcclusion): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      ShaderAmbientOcclusion.useProgram();

      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGL.texPosition, WebGL2RenderingContext.TEXTURE0, "u_texPosition");
      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGL.texNormal, WebGL2RenderingContext.TEXTURE1, "u_texNormal");
      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGL.texNoise, WebGL2RenderingContext.TEXTURE2, "u_texNoise");

      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fNear"], _cmpCamera.getNear());
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fFar"], _cmpCamera.getFar());
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fBias"], _cmpAmbientOcclusion.bias);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fSampleRadius"], _cmpAmbientOcclusion.sampleRadius);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationConstant"], _cmpAmbientOcclusion.attenuationConstant);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationLinear"], _cmpAmbientOcclusion.attenuationLinear);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationQuadratic"], _cmpAmbientOcclusion.attenuationQuadratic);
      crc3.uniform2f(ShaderAmbientOcclusion.uniforms["u_vctResolution"], RenderWebGL.getCanvas().width, RenderWebGL.getCanvas().height);
      crc3.uniform3fv(ShaderAmbientOcclusion.uniforms["u_vctCamera"], _cmpCamera.mtxWorld.translation.get());

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboPost);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
      RenderWebGL.setBlendMode(BLEND.SUBTRACTIVE);
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
    }

    /**
     * Draws the bloom-effect over the color-buffer, using the given bloom-component
     */
    @PerformanceMonitor.measure()
    protected static drawBloom(_cmpBloom: ComponentBloom): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      ShaderBloom.useProgram();

      // extract bright colors, could move this to main render pass so that individual objects can be exempt from bloom
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboPost);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texBloomSamples[0], 0);
      RenderWebGL.clear();

      RenderWebGL.bindTexture(ShaderBloom, RenderWebGL.texColor, WebGL2RenderingContext.TEXTURE0, "u_texSource");
      crc3.uniform1f(ShaderBloom.uniforms["u_fThreshold"], _cmpBloom.threshold);
      crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 0);
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);

      // downsample
      const iterations: number = RenderWebGL.texBloomSamples.length;
      for (let i: number = 1, divisor: number = 2; i < iterations; i++, divisor *= 2) {
        let width: number = Math.max(Math.round(crc3.canvas.width / divisor), 1);
        let height: number = Math.max(Math.round(crc3.canvas.height / divisor), 1);

        crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texBloomSamples[i], 0);
        crc3.viewport(0, 0, width, height);

        RenderWebGL.clear();

        RenderWebGL.bindTexture(ShaderBloom, RenderWebGL.texBloomSamples[i - 1], WebGL2RenderingContext.TEXTURE0, "u_texSource");
        crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 1);
        crc3.uniform2f(ShaderBloom.uniforms["u_vctTexel"], 0.5 / width, 0.5 / height); // half texel size
        // crc3.uniform2f(ShaderBloom.uniforms["u_vctResolution"], width, height);

        crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      }

      RenderWebGL.setBlendMode(BLEND.ADDITIVE);

      // upsample
      for (let i: number = iterations - 1, divisor: number = 2 ** (iterations - 2); i > 0; i--, divisor /= 2) {
        let width: number = Math.max(Math.round(crc3.canvas.width / divisor), 1);
        let height: number = Math.max(Math.round(crc3.canvas.height / divisor), 1);

        crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texBloomSamples[i - 1], 0);
        crc3.viewport(0, 0, Math.round(width), Math.round(height));

        RenderWebGL.bindTexture(ShaderBloom, RenderWebGL.texBloomSamples[i], WebGL2RenderingContext.TEXTURE0, "u_texSource");
        crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 2);
        crc3.uniform2f(ShaderBloom.uniforms["u_vctTexel"], 0.5 / width, 0.5 / height); // half texel size
        // crc3.uniform2f(ShaderBloom.uniforms["u_vctResolution"], width, height);

        crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      }

      crc3.viewport(0, 0, crc3.canvas.width, crc3.canvas.height);

      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
      RenderWebGL.bindTexture(ShaderBloom, RenderWebGL.texBloomSamples[0], WebGL2RenderingContext.TEXTURE0, "u_texSource");
      crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 3);
      crc3.uniform1f(ShaderBloom.uniforms["u_fIntensity"], _cmpBloom.intensity);
      crc3.uniform1f(ShaderBloom.uniforms["u_fHighlightDesaturation"], _cmpBloom.highlightDesaturation);
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);

      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
    }

    protected static drawOutline(_nodes: Iterable<Node>, _cmpCamera: ComponentCamera, _cmpOutline: ComponentOutline): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboPost);

      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, null, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencilOutline, 0);
      
      RenderWebGL.clear();

      crc3.disable(WebGL2RenderingContext.BLEND);
      for (let selected of _nodes)
        for (const node of selected) {
          if (node.getComponent(ComponentMesh)?.isActive && node.getComponent(ComponentMaterial)?.isActive)
            RenderWebGL.drawNode(node, _cmpCamera);
        }
      crc3.enable(WebGL2RenderingContext.BLEND);

      ShaderOutline.useProgram();
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, null, 0);
      
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT2, WebGL2RenderingContext.TEXTURE_2D, null, 0);
      crc3.drawBuffers([WebGL2RenderingContext.COLOR_ATTACHMENT0]);
      RenderWebGL.bindTexture(ShaderOutline, RenderWebGL.texDepthStencilOutline, WebGL2RenderingContext.TEXTURE0, "u_texDepthOutline");
      RenderWebGL.bindTexture(ShaderOutline, RenderWebGL.texDepthStencil, WebGL2RenderingContext.TEXTURE1, "u_texDepthScene");


      crc3.uniform4fv(ShaderOutline.uniforms["u_vctColor"], _cmpOutline.color.get());
      crc3.uniform4fv(ShaderOutline.uniforms["u_vctColorOccluded"], _cmpOutline.colorOccluded.get());

      crc3.uniform2f(ShaderOutline.uniforms["u_vctTexel"], 1 / Math.round(crc3.canvas.width), 1 / Math.round(crc3.canvas.height)); // half texel size
    
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
    }

    /**
     * Draw a mesh buffer using the given infos and the complete projection matrix
    */
    // @PerformanceMonitor.measure("Render.drawNode")
    protected static drawNode(_node: Node, _cmpCamera: ComponentCamera): void {
      // PerformanceMonitor.startMeasure("Render.drawNode get components");
      let cmpMesh: ComponentMesh = _node.getComponent(ComponentMesh);
      let cmpMaterial: ComponentMaterial = _node.getComponent(ComponentMaterial);
      let cmpText: ComponentText = _node.getComponent(ComponentText);
      let cmpFaceCamera: ComponentFaceCamera = _node.getComponent(ComponentFaceCamera);
      let cmpParticleSystem: ComponentParticleSystem = _node.getComponent(ComponentParticleSystem);
      let drawParticles: boolean = cmpParticleSystem && cmpParticleSystem.isActive;
      let shader: ShaderInterface = cmpMaterial.material.getShader();
      if (drawParticles)
        shader = cmpParticleSystem.particleSystem.getShaderFrom(shader);
      // PerformanceMonitor.endMeasure("Render.drawNode get components");

      // PerformanceMonitor.startMeasure("Render.drawNode useProgram");
      shader.useProgram();
      // PerformanceMonitor.endMeasure("Render.drawNode useProgram");

      // PerformanceMonitor.startMeasure("Render.drawNode useRenderData");
      UniformBufferManagerMaterial.instance.useRenderData(cmpMaterial.material.coat);

      // PerformanceMonitor.endMeasure("Render.drawNode useRenderData");

      if (cmpMesh.skeleton?.isActive)
        cmpMesh.skeleton.useRenderBuffer();

      // PerformanceMonitor.startMeasure("Render.drawNode other");

      let mtxWorldOverride: Matrix4x4;

      if (cmpText?.isActive)
        mtxWorldOverride = cmpText.useRenderData(cmpMesh.mtxWorld, _cmpCamera);

      if (cmpFaceCamera?.isActive && !cmpParticleSystem?.isActive)
        mtxWorldOverride = RenderWebGL.faceCamera(_node, mtxWorldOverride ?? cmpMesh.mtxWorld, _cmpCamera.mtxWorld);

      UniformBufferManagerNode.instance.useRenderData(_node, mtxWorldOverride);
      // PerformanceMonitor.endMeasure("Render.drawNode other");

      // PerformanceMonitor.startMeasure("Render.drawNode getRenderBuffers");
      const renderBuffers: RenderBuffers = cmpMesh.mesh.useRenderBuffers(); // TODO: find out why this gets slower the more different meshes are drawn???
      // PerformanceMonitor.endMeasure("Render.drawNode getRenderBuffers");

      // PerformanceMonitor.startMeasure("Render.drawNode drawElements");
      if (drawParticles)
        RenderWebGL.drawParticles(cmpParticleSystem, shader, renderBuffers.nIndices, _node.getComponent(ComponentFaceCamera));
      else
        RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
      // PerformanceMonitor.endMeasure("Render.drawNode drawElements");
    }

    protected static drawParticles(_cmpParticleSystem: ComponentParticleSystem, _shader: ShaderInterface, _nIndices: number, _cmpFaceCamera: ComponentFaceCamera): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      crc3.depthMask(_cmpParticleSystem.depthMask);
      RenderWebGL.setBlendMode(_cmpParticleSystem.blendMode);
      crc3.uniform1i(_shader.uniforms["u_iBlendMode"], _cmpParticleSystem.blendMode);
      _cmpParticleSystem.useRenderData();

      crc3.uniform1f(_shader.uniforms["u_fParticleSystemDuration"], _cmpParticleSystem.duration);
      crc3.uniform1f(_shader.uniforms["u_fParticleSystemSize"], _cmpParticleSystem.size);
      crc3.uniform1f(_shader.uniforms["u_fParticleSystemTime"], _cmpParticleSystem.time);
      crc3.uniform1i(_shader.uniforms[TEXTURE_LOCATION.PARTICLE.UNIFORM], TEXTURE_LOCATION.PARTICLE.INDEX);

      let faceCamera: boolean = _cmpFaceCamera && _cmpFaceCamera.isActive;
      crc3.uniform1i(_shader.uniforms["u_bParticleSystemFaceCamera"], faceCamera ? 1 : 0);
      crc3.uniform1i(_shader.uniforms["u_bParticleSystemRestrict"], faceCamera && _cmpFaceCamera.restrict ? 1 : 0);

      crc3.drawElementsInstanced(WebGL2RenderingContext.TRIANGLES, _nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0, _cmpParticleSystem.size);

      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
      crc3.depthMask(true);
    }

    private static faceCamera(_node: Node, _mtxMeshToWorld: Matrix4x4, _mtxCamera: Matrix4x4): Matrix4x4 {
      let cmpFaceCamera: ComponentFaceCamera = _node.getComponent(ComponentFaceCamera);
      if (cmpFaceCamera?.isActive)
        return _mtxMeshToWorld.clone.lookAt(_mtxCamera.translation, cmpFaceCamera.upLocal ? null : cmpFaceCamera.up, cmpFaceCamera.restrict);

      return _mtxMeshToWorld;
    }

    private static bindTexture(_shader: ShaderInterface, _texture: WebGLTexture, _unit: number, _uniform: string): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.activeTexture(_unit);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, _texture);
      crc3.uniform1i(_shader.uniforms[_uniform], _unit - WebGL2RenderingContext.TEXTURE0);
    }
  }

  export abstract class UniformBufferManager<T extends WeakKey> {
    protected mapObjectToOffset: WeakMap<T, number> = new WeakMap<T, number>(); // Maps the objects to their respective byte offset in the gpu buffer

    /** The uniform block size (inside the shader) in bytes, includes layout std140 padding */
    protected blockSize: number;
    protected blockBinding: number;

    protected buffer: WebGLBuffer;
    /** The offset in bytes between the beginning of consecutive object block data, set to a multiple of {@link WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT} */
    protected spaceBuffer: number;

    protected data: Float32Array;
    /** The offset in elements between the beginning of consecutive object block data */
    protected spaceData: number;

    protected count: number = 0;

    protected crc3: WebGL2RenderingContext;

    public constructor(_crc3: WebGL2RenderingContext, _blockBinding: number, _blockSize: number, _maxObjects: number) {
      this.crc3 = _crc3;
      this.blockSize = _blockSize;
      this.blockBinding = _blockBinding;

      const alignment: number = _crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
      this.spaceBuffer = Math.ceil(this.blockSize / alignment) * alignment; // round to multiple of alignment
      this.spaceData = this.spaceBuffer / Float32Array.BYTES_PER_ELEMENT;
      this.data = new Float32Array(this.spaceData * _maxObjects);

      this.buffer = _crc3.createBuffer();
      _crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      _crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    public reset(): void {
      this.count = 0;
    }

    public updateRenderbuffer(): void {
      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
    }

    public useRenderData(_object: T): void {
      this.crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.mapObjectToOffset.get(_object), this.blockSize);
    }

    public store(_object: T): number {
      const offsetData: number = this.count * this.spaceData;
      this.mapObjectToOffset.set(_object, this.count * this.spaceBuffer); // offset in bytes
      this.count++;
      if (offsetData + this.spaceData > this.data.length)
        this.grow();

      return offsetData;
    }

    private grow(): void {
      const data: Float32Array = new Float32Array(this.data.length * 1.5);
      data.set(this.data);
      this.data = data;

      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    public abstract updateRenderData(_object: T, ..._data: General[]): void;
  }

  export class UniformBufferManagerNode extends UniformBufferManager<Node> {
    public static readonly instance: UniformBufferManagerNode = new UniformBufferManagerNode();

    private constructor() {
      const maxNodes: number = 256;
      const blockSize: number = 32 * 4; // 32 floats, 4 bytes each
      super(RenderWebGL.getRenderingContext(), UNIFORM_BLOCK.NODE.BINDING, blockSize, maxNodes);
    }

    public useRenderData(_node: Node, _mtxWorldOverride?: Matrix4x4): void {
      let offset: number = this.mapObjectToOffset.get(_node);
      this.crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, offset, this.blockSize);

      if (_mtxWorldOverride) // this is relatively slow, but since prepare has no camera information, we may need to override the world matrix here
        this.crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, offset, _mtxWorldOverride.get());
    }

    public updateRenderData(_node: Node, _mtxWorld: Matrix4x4, _mtxPivot: Matrix3x3, _color: Color): void {
      const offset: number = this.store(_node);

      const data: Float32Array = this.data;
      // mtx world
      data.set(_mtxWorld.getData(), offset);

      // mtx pivot
      let dataPivot: Float32Array = _mtxPivot.get();
      data[offset + 16] = dataPivot[0];
      data[offset + 17] = dataPivot[1];
      data[offset + 18] = dataPivot[2];
      // data[offsetPivot + 19] = padding
      data[offset + 20] = dataPivot[3];
      data[offset + 21] = dataPivot[4];
      data[offset + 22] = dataPivot[5];
      // data[offsetPivot + 23] = padding
      data[offset + 24] = dataPivot[6];
      data[offset + 25] = dataPivot[7];
      data[offset + 26] = dataPivot[8];
      // data[offsetPivot + 27] = padding

      // color
      data[offset + 28] = _color.r;
      data[offset + 29] = _color.g;
      data[offset + 30] = _color.b;
      data[offset + 31] = _color.a;

      // if (_cmpFaceCamera) {
      //   data[offset + 32] = _cmpFaceCamera.isActive ? 1 : 0;
      //   data[offset + 33] = _cmpFaceCamera.restrict ? 1 : 0;
      // }
    }
  }

  export class UniformBufferManagerMaterial extends UniformBufferManager<Coat> {
    public static readonly instance: UniformBufferManagerMaterial = new UniformBufferManagerMaterial();

    private constructor() {
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super(RenderWebGL.getRenderingContext(), UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, 100);
    }

    public useRenderData(_coat: Coat): void {
      super.useRenderData(_coat);

      if (_coat instanceof CoatTextured)
        _coat.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);

      if (_coat instanceof CoatRemissiveTexturedNormals)
        _coat.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);

      if (_coat instanceof CoatToon)
        _coat.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }

    public updateRenderData(_coat: Coat): void {
      const offset: number = this.store(_coat);

      const data: Float32Array = this.data;

      if (_coat instanceof CoatColored)
        data.set(_coat.color.get(), offset);

      if (_coat instanceof CoatRemissive || _coat instanceof CoatRemissiveTextured) {
        data[offset + 4] = _coat.diffuse;
        data[offset + 5] = _coat.specular;
        data[offset + 6] = _coat.intensity;
        data[offset + 7] = _coat.metallic;
      }

      data[offset + 8] = _coat.alphaClip;
    }
  }
}