namespace FudgeCore {


  const mtxTextureSpaceConversion: Matrix4x4 = new Matrix4x4().set(
    0.5, 0.0, 0.0, 0.0,
    0.0, 0.5, 0.0, 0.0,
    0.0, 0.0, 0.5, 0.0,
    0.5, 0.5, 0.5, 1.0
  );

  const directions: Vector3[] = [
    new Vector3(1, 0, 0), new Vector3(-1, 0, 0),
    new Vector3(0, 1, 0), new Vector3(0, -1, 0),
    new Vector3(0, 0, 1), new Vector3(0, 0, -1)
  ];

  const ups: Vector3[] = [
    new Vector3(0, -1, 0), new Vector3(0, -1, 0),
    new Vector3(0, 0, 1), new Vector3(0, 0, -1),
    new Vector3(0, -1, 0), new Vector3(0, -1, 0)
  ];

  /**
   * Manages {@link ComponentLight} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentLight {
    public static readonly SHADOW_MAP_SIZE: number = 1024; // TODO: make configurable
    public static readonly SHADOW_MAP_TEXEL_SIZE: number = 1 / RenderWebGLComponentLight.SHADOW_MAP_SIZE;
    public static readonly MAX_SHADOW_SLOTS: number = 20; // dir/spot = 1 slot, point = 6 slots
    public static fboShadowMap: WebGLFramebuffer;
    public static texShadowMap: WebGLTexture;

    static #shadowLights: RecycableArray<ComponentLight> = new RecycableArray();

    static #buffer: WebGLBuffer;
    static #data: Float32Array;

    static #dataHeader: Uint32Array;
    static #dataAmbient: Float32Array;
    static #dataDirectional: Float32Array;
    static #dataPoint: Float32Array;
    static #dataSpot: Float32Array;

    static #bufferShadows: WebGLBuffer;
    static #dataShadows: Float32Array;
    static #dataShadowHeader: Float32Array;
    static #dataShadowMatrices: Float32Array;
    static #dataShadowParameters: Float32Array;

    static #shadowMaterial: Material;

    static {
      this.initialize();
    }

    /**
     * Initialize the light uniform buffer.
     */
    public static initialize(): void {
      const MAX_LIGHTS_DIRECTIONAL: number = 15;
      const MAX_LIGHTS_POINT: number = 100;
      const MAX_LIGHTS_SPOT: number = 100;

      const HEADER_UINTS: number = 4;
      const COLOR_FLOATS: number = 4;
      const MATRIX_FLOATS: number = 16;
      const SHADOW_FLOATS: number = 4;
      const LIGHT_FLOATS: number = COLOR_FLOATS + MATRIX_FLOATS + MATRIX_FLOATS + SHADOW_FLOATS;

      let blockSize: number = (HEADER_UINTS + COLOR_FLOATS + (MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT + MAX_LIGHTS_SPOT) * LIGHT_FLOATS) * 4;
      blockSize = Math.ceil(blockSize / 16) * 16; // std140 alignment

      RenderWebGLComponentLight.#data = new Float32Array(new ArrayBuffer(blockSize));

      RenderWebGLComponentLight.#dataHeader = new Uint32Array(RenderWebGLComponentLight.#data.buffer, 0, HEADER_UINTS);
      RenderWebGLComponentLight.#dataAmbient = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataHeader.byteOffset + RenderWebGLComponentLight.#dataHeader.byteLength, COLOR_FLOATS); // ambient light color
      RenderWebGLComponentLight.#dataDirectional = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataAmbient.byteOffset + RenderWebGLComponentLight.#dataAmbient.byteLength, MAX_LIGHTS_DIRECTIONAL * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataPoint = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataDirectional.byteOffset + RenderWebGLComponentLight.#dataDirectional.byteLength, MAX_LIGHTS_POINT * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataSpot = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataPoint.byteOffset + RenderWebGLComponentLight.#dataPoint.byteLength, MAX_LIGHTS_SPOT * LIGHT_FLOATS);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      RenderWebGLComponentLight.#buffer = RenderWebGL.assert(crc3.createBuffer());

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGLComponentLight.#buffer);

      const VEC4_FLOATS: number = 4;
      let blockSizeShadows: number = (4 + RenderWebGLComponentLight.MAX_SHADOW_SLOTS * MATRIX_FLOATS + RenderWebGLComponentLight.MAX_SHADOW_SLOTS * VEC4_FLOATS) * 4;
      blockSizeShadows = Math.ceil(blockSizeShadows / 16) * 16; // std140 alignment

      RenderWebGLComponentLight.#dataShadows = new Float32Array(new ArrayBuffer(blockSizeShadows));
      RenderWebGLComponentLight.#dataShadowHeader = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, 0, 4); // x fTexelSize, y unused, z unused, w unused
      RenderWebGLComponentLight.#dataShadowMatrices = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, RenderWebGLComponentLight.#dataShadowHeader.byteOffset + RenderWebGLComponentLight.#dataShadowHeader.byteLength, RenderWebGLComponentLight.MAX_SHADOW_SLOTS * MATRIX_FLOATS);
      RenderWebGLComponentLight.#dataShadowParameters = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, RenderWebGLComponentLight.#dataShadowMatrices.byteOffset + RenderWebGLComponentLight.#dataShadowMatrices.byteLength, RenderWebGLComponentLight.MAX_SHADOW_SLOTS * VEC4_FLOATS);

      RenderWebGLComponentLight.#bufferShadows = RenderWebGL.assert(crc3.createBuffer());
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferShadows);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, blockSizeShadows, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.SHADOWS.BINDING, RenderWebGLComponentLight.#bufferShadows);

      // create a depth storage 2d array texture for shadow mapping
      RenderWebGLComponentLight.texShadowMap = RenderWebGL.assert(crc3.createTexture());
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D_ARRAY, RenderWebGLComponentLight.texShadowMap);
      crc3.texStorage3D(WebGL2RenderingContext.TEXTURE_2D_ARRAY, 1, WebGL2RenderingContext.DEPTH_COMPONENT24, RenderWebGLComponentLight.SHADOW_MAP_SIZE, RenderWebGLComponentLight.SHADOW_MAP_SIZE, RenderWebGLComponentLight.MAX_SHADOW_SLOTS);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_COMPARE_MODE, WebGL2RenderingContext.COMPARE_REF_TO_TEXTURE);
      // crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_COMPARE_FUNC, WebGL2RenderingContext.LEQUAL);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE);

      // create framebuffer for shadow mapping
      RenderWebGLComponentLight.fboShadowMap = RenderWebGL.assert(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.framebufferTextureLayer(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, RenderWebGLComponentLight.texShadowMap, 0, 0);
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /** Replaces the decorated method with the injector's implementation of the same name. */
    public static decorate<M extends (this: typeof ComponentLight, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext): M {
      return Reflect.get(this, _context.name);
    }

    public static processLighting(_nodes: Iterable<Node>, _lights: MapLightTypeToLightList): void {
      const cmpLightsAmbient: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.AMBIENT);
      RenderWebGLComponentLight.processAmbient(cmpLightsAmbient);

      const cmpLightsDirectional: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.DIRECTIONAL);
      const cmpLightsPoint: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.POINT);
      const cmpLightsSpot: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.SPOT);

      const nDirectional: number = cmpLightsDirectional?.length ?? 0;
      const nPoint: number = cmpLightsPoint?.length ?? 0;
      const nSpot: number = cmpLightsSpot?.length ?? 0;

      RenderWebGLComponentLight.#dataHeader[0] = nDirectional;
      RenderWebGLComponentLight.#dataHeader[1] = nPoint;
      RenderWebGLComponentLight.#dataHeader[2] = nSpot;

      const cmpShadowLights: RecycableArray<ComponentLight> = RenderWebGLComponentLight.#shadowLights;
      cmpShadowLights.recycle();
      
      RenderWebGLComponentLight.#dataShadowHeader[0] = RenderWebGLComponentLight.SHADOW_MAP_TEXEL_SIZE;

      let nShadowLayers: number = 0;
      nShadowLayers = RenderWebGLComponentLight.processLights(cmpLightsDirectional, RenderWebGLComponentLight.#dataDirectional, cmpShadowLights, nShadowLayers);
      nShadowLayers = RenderWebGLComponentLight.processLights(cmpLightsPoint, RenderWebGLComponentLight.#dataPoint, cmpShadowLights, nShadowLayers);
      nShadowLayers = RenderWebGLComponentLight.processLights(cmpLightsSpot, RenderWebGLComponentLight.#dataSpot, cmpShadowLights, nShadowLayers);

      RenderWebGLComponentLight.processShadows(_nodes, cmpShadowLights);

      RenderWebGLComponentLight.updateRenderbuffer(nDirectional, nPoint, nSpot, nShadowLayers);
    }

    private static processAmbient(_cmpLights: RecycableArray<ComponentLight>): void {
      const clrOut: Color = Recycler.get(Color).set(0, 0, 0, 0);

      if (_cmpLights?.length > 0) {
        const clrCurrent: Color = Recycler.get(Color);
        for (let cmpLight of _cmpLights)
          Color.SUM(clrOut, Color.SCALE(cmpLight.color, cmpLight.intensity, clrCurrent), clrOut);
        Recycler.store(clrCurrent);
      }

      clrOut.toArray(RenderWebGLComponentLight.#dataAmbient);

      Recycler.store(clrOut);
    }

    private static processLights(_cmpLights: RecycableArray<ComponentLight>, _data: Float32Array, _cmpShadowLights: RecycableArray<ComponentLight>, _shadowLayerStart: number): number {
      if (!_cmpLights)
        return _shadowLayerStart;

      const clrOut: Color = Recycler.get(Color);
      const mtxOut: Matrix4x4 = Recycler.get(Matrix4x4);

      let iLight: number = 0;
      let shadowLayer: number = _shadowLayerStart;
      for (let cmpLight of _cmpLights) {
        // set vctColor
        Color.SCALE(cmpLight.color, cmpLight.intensity, clrOut).toArray(_data, iLight);

        // set mtxShape
        mtxOut.copy(cmpLight.mtxWorld);
        if (cmpLight.lightType == LIGHT_TYPE.DIRECTIONAL)
          mtxOut.translation = mtxOut.translation.set(0, 0, 0);
        mtxOut.toArray(_data, iLight + 4);

        // set mtxShapeInverse
        if (cmpLight.lightType != LIGHT_TYPE.DIRECTIONAL)
          Matrix4x4.INVERSE(mtxOut, mtxOut).toArray(_data, iLight + 20);

        // set shadow data
        const nShadowLayersRequired: number = RenderWebGLComponentLight.getLayerCount(cmpLight.lightType);
        if (cmpLight.shadowEnabled && shadowLayer + nShadowLayersRequired <= RenderWebGLComponentLight.MAX_SHADOW_SLOTS) {
          _cmpShadowLights.push(cmpLight); // collect shadow casting lights for shadow rendering pass

          const iShadowParameter: number = shadowLayer * 4;
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 0] = cmpLight.shadowBias;
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 1] = cmpLight.shadowNormalBias * RenderWebGLComponentLight.SHADOW_MAP_TEXEL_SIZE; // convert to texel size for shader
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 2] = cmpLight.shadowBlur;
          // RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 3] = cmpLight.pcfRadius;

          _data[iLight + 36] = shadowLayer;

          shadowLayer += nShadowLayersRequired;
        } else {
          _data[iLight + 36] = -1;
        }

        iLight += 40;
      }

      Recycler.store(clrOut);
      Recycler.store(mtxOut);

      return shadowLayer;
    }

    private static processShadows(_nodes: Iterable<Node>, _cmpLights: RecycableArray<ComponentLight>): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const mtxView: Matrix4x4 = Recycler.get(Matrix4x4);;
      const mtxProjection: Matrix4x4 = Recycler.get(Matrix4x4);
      const mtxViewProjection: Matrix4x4 = Recycler.get(Matrix4x4);
      const mtxShadowViewProjection: Matrix4x4 = Recycler.get(Matrix4x4);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.viewport(0, 0, RenderWebGLComponentLight.SHADOW_MAP_SIZE, RenderWebGLComponentLight.SHADOW_MAP_SIZE);

      let shadowLayerBase: number = 0;
      for (const cmpLight of _cmpLights) {
        switch (cmpLight.lightType) {
          case LIGHT_TYPE.DIRECTIONAL:
            Matrix4x4.INVERSE(cmpLight.mtxWorld, mtxView);

            Matrix4x4.PROJECTION_ORTHOGRAPHIC(-5, 5, -5, 5, 0, 100, mtxProjection);
            RenderWebGLComponentLight.drawShadowLayer(_nodes, cmpLight, mtxView, mtxProjection, mtxViewProjection, mtxShadowViewProjection, shadowLayerBase);
            break;
          case LIGHT_TYPE.SPOT:
            Matrix4x4.INVERSE(cmpLight.mtxWorld, mtxView);

            const scaling: Vector3 = cmpLight.mtxWorld.scaling;
            const spreadX: number = Math.abs(scaling.x);
            const spreadY: number = Math.abs(scaling.y);
            const range: number = Math.abs(scaling.z);

            const EPSILON: number = 0.001;
            const aspect: number = spreadX / Math.max(spreadY, EPSILON);
            const fovVerticalInDegrees: number = 2 * Math.atan(spreadY / Math.max(range, EPSILON)) * Calc.rad2deg;
            const near: number = Math.min(Math.max(0.001, range * 0.001), Math.max(range - EPSILON, EPSILON));
            const far: number = Math.max(range, near + EPSILON);

            Matrix4x4.PROJECTION_CENTRAL(aspect, fovVerticalInDegrees, near, far, FIELD_OF_VIEW.VERTICAL, mtxProjection);
            RenderWebGLComponentLight.drawShadowLayer(_nodes, cmpLight, mtxView, mtxProjection, mtxViewProjection, mtxShadowViewProjection, shadowLayerBase);
            break;
          case LIGHT_TYPE.POINT:
            const pointScaling: Vector3 = cmpLight.mtxWorld.scaling;
            const rangePoint: number = Math.max(Math.abs(pointScaling.x), Math.abs(pointScaling.y), Math.abs(pointScaling.z));
            const epsilonPoint: number = 0.001;
            const nearPoint: number = Math.min(Math.max(0.001, rangePoint * 0.001), Math.max(rangePoint - epsilonPoint, epsilonPoint));
            const farPoint: number = Math.max(rangePoint, nearPoint + epsilonPoint);

            Matrix4x4.PROJECTION_CENTRAL(1, 90, nearPoint, farPoint, FIELD_OF_VIEW.VERTICAL, mtxProjection);

            for (let iFace: number = 0; iFace < 6; iFace++) {
              // let iFace: number = 0;
              const shadowLayer: number = shadowLayerBase + iFace;
              Matrix4x4.LOOK_IN(directions[iFace], ups[iFace], false, cmpLight.mtxWorld.translation, undefined, mtxView);
              Matrix4x4.INVERSE(mtxView, mtxView);
              RenderWebGLComponentLight.drawShadowLayer(_nodes, cmpLight, mtxView, mtxProjection, mtxViewProjection, mtxShadowViewProjection, shadowLayer);
            }

            break;
        }

        shadowLayerBase += RenderWebGLComponentLight.getLayerCount(cmpLight.lightType);
      }

      Recycler.store(mtxView);
      Recycler.store(mtxProjection);
      Recycler.store(mtxViewProjection);
      Recycler.store(mtxShadowViewProjection);

      const rectViewport: Rectangle = Render.getViewportRectangle();
      crc3.viewport(rectViewport.x, rectViewport.y, rectViewport.width, rectViewport.height);
    }

    private static drawShadowLayer(_nodes: Iterable<Node>, _cmpLight: ComponentLight, _mtxView: Matrix4x4, _mtxProjection: Matrix4x4, _mtxViewProjection: Matrix4x4, _mtxShadowViewProjection: Matrix4x4, _shadowLayer: number): void {
      Matrix4x4.PRODUCT(_mtxProjection, _mtxView, _mtxViewProjection);
      Matrix4x4.PRODUCT(mtxTextureSpaceConversion, _mtxViewProjection, _mtxShadowViewProjection);

      // upload to data
      _mtxShadowViewProjection.toArray(RenderWebGLComponentLight.#dataShadowMatrices, _shadowLayer * 16);

      RenderWebGLComponentCamera.updateViewBuffer(_mtxView, _mtxProjection, _mtxViewProjection, _cmpLight.mtxWorld.translation);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.framebufferTextureLayer(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, RenderWebGLComponentLight.texShadowMap, 0, _shadowLayer);
      crc3.clear(WebGL2RenderingContext.DEPTH_BUFFER_BIT);
      // RenderWebGL.clear();

      if (!this.#shadowMaterial) {
        this.#shadowMaterial = new Material("MaterialShadow", ShaderLit, new CoatColored(Color.CSS("white")));
        Project.deregister(this.#shadowMaterial);
      }

      const shadowMaterial: Material = this.#shadowMaterial;
      shadowMaterial.getShader().useProgram();
      shadowMaterial.coat.useRenderData();

      for (let node of _nodes)
        RenderWebGL.drawNode(node, null, shadowMaterial);
    }

    private static updateRenderbuffer(_nDirectional: number, _nPoint: number, _nSpot: number, _nShadow: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const FLOATS_PER_LIGHT: number = 40; // 4 (color) + 16 (mtxShape) + 16 (mtxShapeInverse) + 4 (shadow data)
      const FLOATS_PER_MATRIX: number = 16;
      const FLOATS_PER_VEC4: number = 4;
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#data, 0, RenderWebGLComponentLight.#dataHeader.length + RenderWebGLComponentLight.#dataAmbient.length); // header + ambient color

      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataDirectional.byteOffset, RenderWebGLComponentLight.#dataDirectional, 0, _nDirectional * FLOATS_PER_LIGHT);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataPoint.byteOffset, RenderWebGLComponentLight.#dataPoint, 0, _nPoint * FLOATS_PER_LIGHT);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataSpot.byteOffset, RenderWebGLComponentLight.#dataSpot, 0, _nSpot * FLOATS_PER_LIGHT);

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferShadows);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#dataShadowHeader, 0, RenderWebGLComponentLight.#dataShadowHeader.length);

      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataShadowMatrices.byteOffset, RenderWebGLComponentLight.#dataShadowMatrices, 0, _nShadow * FLOATS_PER_MATRIX);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataShadowParameters.byteOffset, RenderWebGLComponentLight.#dataShadowParameters, 0, _nShadow * FLOATS_PER_VEC4);
    }

    private static getLayerCount(_lightType: LIGHT_TYPE): number {
      switch (_lightType) {
        case LIGHT_TYPE.DIRECTIONAL:
          return 1;
        case LIGHT_TYPE.POINT:
          return 6;
        case LIGHT_TYPE.SPOT:
          return 1;
        default:
          return 0;
      }
    }
  }
}