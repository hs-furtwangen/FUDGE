///<reference path="RenderBufferManager.ts"/>
///<reference path="RenderManagerCoat.ts"/>
///<reference path="RenderManagerNode.ts"/>
///<reference path="RenderWebGLPicking.ts"/>
///<reference path="RenderWebGLComponentLight.ts"/>
///<reference path="RenderWebGLComponentFog.ts"/>
///<reference path="RenderWebGLComponentCamera.ts"/>
///<reference path="RenderWebGLComponentAmbientOcclusion.ts"/>
///<reference path="RenderWebGLComponentBloom.ts"/>
///<reference path="RenderWebGLComponentOutline.ts"/>

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
    // TODO: render attachments can't be static as different viewport might have different resolutions each viewport needs its own attachments
    public static texColor: WebGLTexture; // stores the color of each pixel rendered
    public static texPosition: WebGLTexture; // stores the position of each pixel in world space
    public static texNormal: WebGLTexture; // stores the normal of each pixel in world space
    public static texDepthStencil: WebGLTexture; // stores the depth of each pixel

    private static crc3: WebGL2RenderingContext = RenderWebGL.initialize();

    /** The area of the offscreen-canvas in CSS pixels. */
    private static rectCanvas: Rectangle;
    /** The area on the offscreen-canvas to render to. */
    private static rectRender: Rectangle;

    private static fboScene: WebGLFramebuffer; // used for forward rendering passes, e.g. opaque and transparent objects
    private static fboOut: WebGLFramebuffer; // used to render the final image to, usually "null" to render to the canvas default framebuffer. Used by XR to render to the XRWebGLLayer framebuffer.

    private static readonly attachmentsColorPositionNormal = [WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.COLOR_ATTACHMENT2] as const; // eslint-disable-line
    private static readonly attachmentsColor = [WebGL2RenderingContext.COLOR_ATTACHMENT0] as const; // eslint-disable-line

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
      // let canvas: OffscreenCanvas = new OffscreenCanvas(1, 1); // TODO: inspect using a real OffscreenCanvas
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
      RenderWebGL.rectCanvas = Rectangle.GET(0, 0, RenderWebGL.crc3.canvas.width, RenderWebGL.crc3.canvas.height);
      RenderWebGL.rectRender = RenderWebGL.getCanvasRectangle().clone;

      RenderWebGL.initializeAttachments();
      RenderWebGL.adjustAttachments();

      RenderWebGLComponentCamera.initialize(RenderWebGL);
      RenderWebGLComponentFog.initialize(RenderWebGL);
      RenderWebGLComponentLight.initialize(RenderWebGL);
      RenderManagerNode.initialize(RenderWebGL);
      RenderManagerCoat.initialize(RenderWebGL);

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
     * Return a reference to the offscreen-canvas.
     * 
     * - Do not read or modify the canvas dimensions directly.
     * - Use {@link getCanvasRectangle} to retrieve the size of the offscreen-canvas.
     * - Use {@link setCanvasSize} to set the size of the offscreen-canvas.
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
     * Returns a reference to the rectangle describing the size of the offscreen-canvas. x,y are 0 at all times.
     * 
     * Do not modify the rectangle directly, use {@link setCanvasSize} instead.
     */
    public static getCanvasRectangle(): Rectangle {
      return RenderWebGL.rectCanvas;
    }

    /**
     * Set the size of the offscreen-canvas.
     * 
     * ⚠️ CAUTION: If size changes invokes {@link adjustAttachments} which is an expensive operation.
     */
    public static setCanvasSize(_width: number, _height: number): void {
      let sizeChanged: boolean = false;

      if (RenderWebGL.rectCanvas.width != _width) {
        RenderWebGL.rectCanvas.width = _width;
        RenderWebGL.crc3.canvas.width = _width;
        sizeChanged = true;
      }

      if (RenderWebGL.rectCanvas.height != _height) {
        RenderWebGL.rectCanvas.height = _height;
        RenderWebGL.crc3.canvas.height = _height;
        sizeChanged = true;
      }

      if (sizeChanged)
        RenderWebGL.adjustAttachments();
    }

    /**
     * Retrieve the area on the offscreen-canvas the camera image gets rendered to.
     * 
     * Do not modify the rectangle directly, use {@link setRenderRectangle} instead.
     */
    public static getRenderRectangle(): Rectangle {
      return RenderWebGL.rectRender;
    }

    /**
     * Set the area on the offscreen-canvas to render the camera image to.
     */
    public static setRenderRectangle(_rect: Rectangle): void {
      if (RenderWebGL.rectRender.equals(_rect))
        return;

      RenderWebGL.rectRender.copy(_rect);
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
      RenderWebGL.fboOut = _buffer;
    }

    /**
     * Reset the framebuffer to the main color buffer.
     */
    public static resetFramebuffer(): void {
      RenderWebGL.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
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
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
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

      RenderWebGL.fboScene = RenderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      RenderWebGL.fboOut = null;

      RenderWebGL.texColor = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texPosition = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texNormal = RenderWebGL.createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGL.texDepthStencil = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT2, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil, 0);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);

      RenderWebGLComponentAmbientOcclusion.initialize(RenderWebGL);
      RenderWebGLComponentBloom.initialize(RenderWebGL);
      RenderWebGLComponentOutline.initialize(RenderWebGL);
      RenderWebGLPicking.initialize(RenderWebGL);
    }

    /**
     * Adjusts the size of the different texture attachments (render targets) to the canvas size.
     * 
     * ⚠️ CAUTION: Expensive operation, use only when canvas size changed.
     */
    public static adjustAttachments(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const canvasWidth: number = RenderWebGL.rectCanvas.width || 1;
      const canvasHeight: number = RenderWebGL.rectCanvas.height || 1;

      crc3.activeTexture(crc3.TEXTURE0);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition);
      // In view space 16F would be precise enough... but we want to use world space for calculations
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32F, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA16F, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);

      crc3.bindTexture(crc3.TEXTURE_2D, null);

      RenderWebGLComponentAmbientOcclusion.resize(RenderWebGL, canvasWidth, canvasHeight);
      RenderWebGLComponentBloom.resize(RenderWebGL, canvasWidth, canvasHeight);
      RenderWebGLComponentOutline.resize(RenderWebGL, canvasWidth, canvasHeight);
    }

    public static createTexture(_filter: number, _wrap: number): WebGLTexture {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const texture: WebGLTexture = RenderWebGL.assert<WebGLTexture>(crc3.createTexture());
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, _filter);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, _filter);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, _wrap);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, _wrap);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
      return texture;
    }

    public static bindTexture(_shader: ShaderInterface, _texture: WebGLTexture, _unit: number, _uniform: string): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.activeTexture(_unit);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, _texture);
      crc3.uniform1i(_shader.uniforms[_uniform], _unit - WebGL2RenderingContext.TEXTURE0);
    }

    public static useNodeUniforms(_shader: ShaderInterface, _mtxWorld: Matrix4x4, _mtxPivot: Matrix3x3, _color: Color, _id?: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.crc3;

      let uniform: WebGLUniformLocation = _shader.uniforms["u_mtxMeshToWorld"];
      if (uniform && _mtxWorld)
        crc3.uniformMatrix4fv(uniform, false, _mtxWorld.getArray());

      uniform = _shader.uniforms["u_mtxPivot"];
      if (uniform && _mtxPivot)
        crc3.uniformMatrix3fv(_shader.uniforms["u_mtxPivot"], false, _mtxPivot.getArray());

      uniform = _shader.uniforms["u_vctColor"];
      if (uniform && _color)
        crc3.uniform4fv(uniform, _color.toArray(new Float32Array(4)));

      uniform = _shader.uniforms["u_id"];
      if (uniform)
        RenderWebGL.crc3.uniform1i(uniform, _id);
    }

    /**
     * Draw a mesh buffer using the given infos and the complete projection matrix
    */
    public static drawNode(_node: Node, _cmpCamera: ComponentCamera): void {
      const cmpMesh: ComponentMesh = _node.getComponent(ComponentMesh);
      const cmpMaterial: ComponentMaterial = _node.getComponent(ComponentMaterial);
      const cmpParticleSystem: ComponentParticleSystem = _node.getComponent(ComponentParticleSystem);
      if (cmpParticleSystem?.isActive) {
        RenderWebGL.drawParticles(_node, cmpParticleSystem, cmpMesh, cmpMaterial);
        return;
      }

      const cmpText: ComponentText = _node.getComponent(ComponentText);
      const cmpFaceCamera: ComponentFaceCamera = _node.getComponent(ComponentFaceCamera);

      const material: Material = cmpMaterial.material;
      material.getShader().useProgram();
      material.coat.useRenderData();

      const cmpSkeleton: ComponentSkeleton = cmpMesh.skeleton;
      if (cmpSkeleton?.isActive)
        cmpSkeleton.useRenderBuffer();

      let mtxWorldOverride: Matrix4x4;

      if (cmpText?.isActive)
        mtxWorldOverride = cmpText.useRenderData(cmpMesh.mtxWorld, _cmpCamera);

      if (cmpFaceCamera?.isActive)
        mtxWorldOverride = RenderWebGL.faceCamera(_node, mtxWorldOverride ?? cmpMesh.mtxWorld, _cmpCamera.mtxWorld);

      _node.useRenderData(mtxWorldOverride);

      const renderBuffers: RenderBuffers = cmpMesh.mesh.useRenderBuffers(); // TODO: find out why this gets slower the more different meshes are drawn???
      RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
    }

    /**
     * Used with a {@link Picker}-camera, this method renders one pixel with picking information 
     * for each node in the line of sight and return that as an unsorted {@link Pick}-array
     */
    public static pick(_nodes: readonly Node[], _cmpCamera: ComponentCamera): Pick[] { // TODO: see if third parameter _world?: Matrix4x4 would be usefull
      return RenderWebGLPicking.pickFrom(_nodes, _cmpCamera, RenderWebGL.pickNodes);
    }

    /**
     * The render function for picking nodes. 
     * A cameraprojection with extremely narrow focus is used, so each pixel of the buffer would hold the same information from the node,  
     * but the fragment shader renders only 1 pixel for each node into the render buffer, 1st node to 1st pixel, 2nd node to second pixel etc.
     */
    protected static pickNodes(_nodes: readonly Node[], _cmpCamera: ComponentCamera): Pick[] {
      let picks: Pick[] = [];

      for (const node of _nodes) {
        let cmpMesh: ComponentMesh = node.getComponent(ComponentMesh);
        let cmpMaterial: ComponentMaterial = node.getComponent(ComponentMaterial);
        if (!(cmpMesh && cmpMesh.isActive && cmpMaterial && cmpMaterial.isActive))
          continue;

        let coat: Coat = cmpMaterial.material.coat;
        let shader: ShaderInterface = coat instanceof CoatTextured ? ShaderPickTextured : ShaderPick;

        shader.useProgram();
        coat.useRenderData();

        let mtxMeshToWorld: Matrix4x4 = RenderWebGL.faceCamera(node, cmpMesh.mtxWorld, _cmpCamera.mtxWorld);
        RenderWebGL.useNodeUniforms(shader, mtxMeshToWorld, cmpMaterial.mtxPivot, cmpMaterial.clrPrimary, picks.length);

        const renderBuffers: RenderBuffers = cmpMesh.mesh.useRenderBuffers();
        RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);

        picks.push(new Pick(node));
      }

      return picks;
    }

    /**
     * Draws the given nodes using the given camera and the post process components attached to the same node as the camera
     * The opaque nodes are drawn first, then ssao is applied, then bloom is applied, then nodes alpha (sortForAlpha) are drawn.
     */
    protected static drawNodes(_nodesOpaque: Iterable<Node>, _nodesAlpha: Iterable<Node>, _cmpCamera: ComponentCamera): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const node: Node = _cmpCamera.node;
      const cmpFog: ComponentFog = node?.getComponent(ComponentFog);
      const cmpAmbientOcclusion: ComponentAmbientOcclusion = node?.getComponent(ComponentAmbientOcclusion);
      const cmpBloom: ComponentBloom = node?.getComponent(ComponentBloom);
      const cmpOutline: ComponentOutline = node?.getComponent(ComponentOutline);

      RenderWebGLComponentFog.useRenderbuffer(cmpFog);
      RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);

      // opaque pass 
      // TODO: think about disabling blending for all opaque objects, this might improve performance 
      // as otherwise the 3 color attachments (color, position and normals) all need to be blended
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
      crc3.drawBuffers(cmpAmbientOcclusion?.isActive ? RenderWebGL.attachmentsColorPositionNormal : RenderWebGL.attachmentsColor);

      crc3.disable(WebGL2RenderingContext.BLEND);
      for (let node of _nodesOpaque)
        RenderWebGL.drawNode(node, _cmpCamera);
      crc3.enable(WebGL2RenderingContext.BLEND);

      // ambient occlusion pass
      if (cmpAmbientOcclusion?.isActive)
        RenderWebGLComponentAmbientOcclusion.draw(_cmpCamera, cmpAmbientOcclusion);

      // transparent pass TODO: think about disabling depth write for all transparent objects -> this might make depth mask option in component particle system obsolete
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
      crc3.drawBuffers(RenderWebGL.attachmentsColor);

      // crc3.depthMask(false);
      for (let node of _nodesAlpha)
        RenderWebGL.drawNode(node, _cmpCamera);
      // crc3.depthMask(true);

      // bloom pass
      if (cmpBloom?.isActive)
        RenderWebGLComponentBloom.draw(cmpBloom);

      if (cmpOutline?.isActive && cmpOutline.selection)
        RenderWebGLComponentOutline.draw(cmpOutline.selection, _cmpCamera, cmpOutline);

      // copy framebuffer to canvas
      crc3.bindFramebuffer(WebGL2RenderingContext.READ_FRAMEBUFFER, RenderWebGL.fboScene);
      crc3.bindFramebuffer(WebGL2RenderingContext.DRAW_FRAMEBUFFER, RenderWebGL.fboOut);
      crc3.blitFramebuffer(0, 0, RenderWebGL.rectCanvas.width, RenderWebGL.rectCanvas.height, 0, 0, RenderWebGL.rectCanvas.width, RenderWebGL.rectCanvas.height, WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT, WebGL2RenderingContext.NEAREST);
    }

    private static drawParticles(_node: Node, _cmpParticleSystem: ComponentParticleSystem, _cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const renderBuffers: RenderBuffers = _cmpMesh.mesh.useRenderBuffers();
      const material: Material = _cmpMaterial.material;
      material.coat.useRenderData();
      _cmpParticleSystem.particleSystem.getShaderFrom(material.getShader()).useProgram();
      _cmpParticleSystem.useRenderData();
      _node.useRenderData();

      crc3.depthMask(_cmpParticleSystem.depthMask);
      RenderWebGL.setBlendMode(_cmpParticleSystem.blendMode);
      crc3.drawElementsInstanced(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0, _cmpParticleSystem.size);
      crc3.depthMask(true);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
    }

    private static faceCamera(_node: Node, _mtxMeshToWorld: Matrix4x4, _mtxCamera: Matrix4x4): Matrix4x4 {
      let cmpFaceCamera: ComponentFaceCamera = _node.getComponent(ComponentFaceCamera);
      if (cmpFaceCamera?.isActive)
        return _mtxMeshToWorld.clone.lookAt(_mtxCamera.translation, cmpFaceCamera.upLocal ? null : cmpFaceCamera.up, cmpFaceCamera.restrict);

      return _mtxMeshToWorld;
    }
  }
}