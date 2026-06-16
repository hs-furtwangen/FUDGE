namespace FudgeCore {

  const SHADOW_INDEX: unique symbol = Symbol("shadowIndex");

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

  const frustumCorners: Vector3[] = new Array(8).fill(null).map(() => Recycler.get(Vector3));

  /**
   * Manages {@link ComponentLight} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentLight {
    public static fboShadowMap: WebGLFramebuffer;
    public static texShadowMap: WebGLTexture;

    static readonly #MAX_SHADOW_COUNT: number = 20; // dir/spot = 1 slot, point = 6 slots
    static readonly #MAX_SHADOW_FILTER_SAMPLE_COUNT: number = 32;

    static #SHADOW_SIZE: number;
    static #SHADOW_FILTER_QUALITY: SHADOW_FILTER_QUALITY;
    static #SHADOW_FILTER_SAMPLE_COUNT: number;

    static #bufferLights: WebGLBuffer;
    static #dataLights: Float32Array;

    static #dataLightsHeader: Uint32Array;
    static #dataLightsAmbient: Float32Array;
    static #dataLightsDirectional: Float32Array;
    static #dataLightsSpot: Float32Array;
    static #dataLightsPoint: Float32Array;

    static #shadowLightsDirectional: RecycableArray<ComponentLight> = new RecycableArray();
    static #shadowLightsSpot: RecycableArray<ComponentLight> = new RecycableArray();
    static #shadowLightsPoint: RecycableArray<ComponentLight> = new RecycableArray();

    static #bufferShadows: WebGLBuffer;
    static #dataShadows: Float32Array;

    static #dataShadowHeader: DataView;
    static #dataShadowKernel: Float32Array;
    static #dataShadowMatrices: Float32Array;
    static #dataShadowParameters: Float32Array;

    static #shadowMaterial: Material;
    static #shadowMaterialSkin: Material;

    static {
      this.initialize();
    }

    public static get SHADOW_TEXEL_SIZE(): number {
      return 1 / RenderWebGLComponentLight.#SHADOW_SIZE;
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

      RenderWebGLComponentLight.#dataLights = new Float32Array(new ArrayBuffer(blockSize));

      RenderWebGLComponentLight.#dataLightsHeader = new Uint32Array(RenderWebGLComponentLight.#dataLights.buffer, 0, HEADER_UINTS);
      RenderWebGLComponentLight.#dataLightsAmbient = new Float32Array(RenderWebGLComponentLight.#dataLights.buffer, RenderWebGLComponentLight.#dataLightsHeader.byteOffset + RenderWebGLComponentLight.#dataLightsHeader.byteLength, COLOR_FLOATS); // ambient light color
      RenderWebGLComponentLight.#dataLightsDirectional = new Float32Array(RenderWebGLComponentLight.#dataLights.buffer, RenderWebGLComponentLight.#dataLightsAmbient.byteOffset + RenderWebGLComponentLight.#dataLightsAmbient.byteLength, MAX_LIGHTS_DIRECTIONAL * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataLightsPoint = new Float32Array(RenderWebGLComponentLight.#dataLights.buffer, RenderWebGLComponentLight.#dataLightsDirectional.byteOffset + RenderWebGLComponentLight.#dataLightsDirectional.byteLength, MAX_LIGHTS_POINT * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataLightsSpot = new Float32Array(RenderWebGLComponentLight.#dataLights.buffer, RenderWebGLComponentLight.#dataLightsPoint.byteOffset + RenderWebGLComponentLight.#dataLightsPoint.byteLength, MAX_LIGHTS_SPOT * LIGHT_FLOATS);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      RenderWebGLComponentLight.#bufferLights = RenderWebGL.assert(crc3.createBuffer());

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferLights);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataLights.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGLComponentLight.#bufferLights);

      const VEC4_FLOATS: number = 4;
      const SHADOW_HEADER_FLOATS: number = 4; // float shadowTexelSize, float shadowFilterSampleCount, z+w padding,
      let blockSizeShadows: number = (SHADOW_HEADER_FLOATS + RenderWebGLComponentLight.#MAX_SHADOW_FILTER_SAMPLE_COUNT * VEC4_FLOATS + RenderWebGLComponentLight.#MAX_SHADOW_COUNT * MATRIX_FLOATS + RenderWebGLComponentLight.#MAX_SHADOW_COUNT * VEC4_FLOATS) * 4;
      blockSizeShadows = Math.ceil(blockSizeShadows / 16) * 16; // std140 alignment

      RenderWebGLComponentLight.#dataShadows = new Float32Array(new ArrayBuffer(blockSizeShadows));
      RenderWebGLComponentLight.#dataShadowHeader = new DataView(RenderWebGLComponentLight.#dataShadows.buffer, 0, SHADOW_HEADER_FLOATS * 4);
      RenderWebGLComponentLight.#dataShadowKernel = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, RenderWebGLComponentLight.#dataShadowHeader.byteOffset + RenderWebGLComponentLight.#dataShadowHeader.byteLength, RenderWebGLComponentLight.#MAX_SHADOW_FILTER_SAMPLE_COUNT * VEC4_FLOATS);
      RenderWebGLComponentLight.#dataShadowMatrices = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, RenderWebGLComponentLight.#dataShadowKernel.byteOffset + RenderWebGLComponentLight.#dataShadowKernel.byteLength, RenderWebGLComponentLight.#MAX_SHADOW_COUNT * MATRIX_FLOATS);
      RenderWebGLComponentLight.#dataShadowParameters = new Float32Array(RenderWebGLComponentLight.#dataShadows.buffer, RenderWebGLComponentLight.#dataShadowMatrices.byteOffset + RenderWebGLComponentLight.#dataShadowMatrices.byteLength, RenderWebGLComponentLight.#MAX_SHADOW_COUNT * VEC4_FLOATS);

      RenderWebGLComponentLight.#bufferShadows = RenderWebGL.assert(crc3.createBuffer());
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferShadows);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, blockSizeShadows, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.SHADOWS.BINDING, RenderWebGLComponentLight.#bufferShadows);

      const shadowSize: number = ProjectSettings.get("rendering/lightsAndShadows/shadowSize");
      RenderWebGLComponentLight.setShadowSize(shadowSize);

      // create framebuffer for shadow mapping
      RenderWebGLComponentLight.fboShadowMap = RenderWebGL.assert(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.framebufferTextureLayer(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, RenderWebGLComponentLight.texShadowMap, 0, 0);
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);

      const shadowFilterQuality: SHADOW_FILTER_QUALITY = ProjectSettings.get("rendering/lightsAndShadows/shadowFilterQuality");
      RenderWebGLComponentLight.setShadowFilterQuality(shadowFilterQuality);

      ProjectSettings.addEventListener(EVENT.SETTINGS_CHANGED, this.hndEvent);
    }

    /** Replaces the decorated method with the injector's implementation of the same name. */
    public static decorate<M extends (this: typeof ComponentLight, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext): M {
      return Reflect.get(this, _context.name);
    }

    public static setShadowSize(_size: number): void {
      if (_size == RenderWebGLComponentLight.#SHADOW_SIZE)
        return;

      RenderWebGLComponentLight.#SHADOW_SIZE = _size;

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (RenderWebGLComponentLight.texShadowMap) 
        crc3.deleteTexture(RenderWebGLComponentLight.texShadowMap);
      
      RenderWebGLComponentLight.texShadowMap = RenderWebGL.assert(crc3.createTexture());
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D_ARRAY, RenderWebGLComponentLight.texShadowMap);
      crc3.texStorage3D(WebGL2RenderingContext.TEXTURE_2D_ARRAY, 1, WebGL2RenderingContext.DEPTH_COMPONENT24, _size, _size, RenderWebGLComponentLight.#MAX_SHADOW_COUNT);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_COMPARE_MODE, WebGL2RenderingContext.COMPARE_REF_TO_TEXTURE);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE);
      crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D_ARRAY, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE);

      RenderWebGLComponentLight.#dataShadowHeader.setFloat32(0, RenderWebGLComponentLight.SHADOW_TEXEL_SIZE, true);
    }

    public static setShadowFilterQuality(_quality: SHADOW_FILTER_QUALITY): void {
      if (_quality == RenderWebGLComponentLight.#SHADOW_FILTER_QUALITY)
        return;

      RenderWebGLComponentLight.#SHADOW_FILTER_QUALITY = _quality;

      switch (_quality) {
        case SHADOW_FILTER_QUALITY.OFF:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 0;
          break;
        case SHADOW_FILTER_QUALITY.MINIMAL:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 2;
          break;
        case SHADOW_FILTER_QUALITY.LOW:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 4;
          break;
        case SHADOW_FILTER_QUALITY.MEDIUM:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 8;
          break;
        case SHADOW_FILTER_QUALITY.HIGH:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 16;
          break;
        case SHADOW_FILTER_QUALITY.MAXIMAL:
          RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT = 32;
          break;
      }

      this.getVogelDisk(RenderWebGLComponentLight.#dataShadowKernel, RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT);
      RenderWebGLComponentLight.#dataShadowHeader.setUint32(4, RenderWebGLComponentLight.#SHADOW_FILTER_SAMPLE_COUNT, true);
    }

    public static processLights(_lights: MapLightTypeToLightList): void {
      const cmpLightsAmbient: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.AMBIENT);
      RenderWebGLComponentLight.prepareAmbient(cmpLightsAmbient);

      const cmpLightsDirectional: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.DIRECTIONAL);
      const cmpLightsPoint: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.POINT);
      const cmpLightsSpot: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.SPOT);

      const nDirectional: number = cmpLightsDirectional?.length ?? 0;
      const nPoint: number = cmpLightsPoint?.length ?? 0;
      const nSpot: number = cmpLightsSpot?.length ?? 0;

      RenderWebGLComponentLight.#dataLightsHeader[0] = nDirectional;
      RenderWebGLComponentLight.#dataLightsHeader[1] = nPoint;
      RenderWebGLComponentLight.#dataLightsHeader[2] = nSpot;

      RenderWebGLComponentLight.#shadowLightsDirectional.recycle();
      RenderWebGLComponentLight.#shadowLightsPoint.recycle();
      RenderWebGLComponentLight.#shadowLightsSpot.recycle();

      let nShadows: number = 0;
      nShadows = RenderWebGLComponentLight.prepareLights(cmpLightsDirectional, RenderWebGLComponentLight.#dataLightsDirectional, RenderWebGLComponentLight.#shadowLightsDirectional, nShadows);
      nShadows = RenderWebGLComponentLight.prepareLights(cmpLightsSpot, RenderWebGLComponentLight.#dataLightsSpot, RenderWebGLComponentLight.#shadowLightsSpot, nShadows);
      nShadows = RenderWebGLComponentLight.prepareLights(cmpLightsPoint, RenderWebGLComponentLight.#dataLightsPoint, RenderWebGLComponentLight.#shadowLightsPoint, nShadows);

      RenderWebGLComponentLight.bindLightBuffer();
      RenderWebGLComponentLight.uploadLightHeader();
      RenderWebGLComponentLight.uploadLights(RenderWebGLComponentLight.#dataLightsDirectional, nDirectional);
      RenderWebGLComponentLight.uploadLights(RenderWebGLComponentLight.#dataLightsPoint, nPoint);
      RenderWebGLComponentLight.uploadLights(RenderWebGLComponentLight.#dataLightsSpot, nSpot);

      RenderWebGLComponentLight.bindShadowBuffer();
      RenderWebGLComponentLight.uploadShadowHeader();
      RenderWebGLComponentLight.uploadShadowParameters(0, nShadows); // TODO: Maybe only spot and point light parameters need to be updated here, as directional shadow parameters are adjusted in the shadow rendering pass based on the shadow casters bounding volumes
    }

    public static processShadowsDirectional(_nodes: Iterable<Node>, _cmpCamera: ComponentCamera): void { // TODO: fix for orthographic camera
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.viewport(0, 0, RenderWebGLComponentLight.#SHADOW_SIZE, RenderWebGLComponentLight.#SHADOW_SIZE);

      const mtxView: Matrix4x4 = Recycler.get(Matrix4x4);
      const mtxProjection: Matrix4x4 = Recycler.get(Matrix4x4);

      for (const cmpLight of RenderWebGLComponentLight.#shadowLightsDirectional) {
        // adjusted from godot
        let maxDistance: number = _cmpCamera.projection == PROJECTION.CENTRAL ?
          Math.min(_cmpCamera.far, Math.max(cmpLight.shadowMaxDistance, 0)) : // max distance only for perspective cameras
          _cmpCamera.far;

        maxDistance = Math.max(maxDistance, _cmpCamera.near + 1e-3);

        let minDistance: number = Math.min(_cmpCamera.near, maxDistance);

        const mtxProjection: Matrix4x4 = Recycler.get(Matrix4x4);

        switch (_cmpCamera.projection) {
          case PROJECTION.CENTRAL:
            Matrix4x4.PROJECTION_CENTRAL(_cmpCamera.aspectRatio, _cmpCamera.fieldOfView, minDistance, maxDistance, _cmpCamera.direction, mtxProjection);
            break;
          case PROJECTION.ORTHOGRAPHIC:
            Matrix4x4.PROJECTION_ORTHOGRAPHIC(_cmpCamera.left, _cmpCamera.right, _cmpCamera.bottom, _cmpCamera.top, minDistance, maxDistance, mtxProjection);
            break;
        }

        Matrix4x4.FRUSTUM_CORNERS(mtxProjection.invert(), _cmpCamera.mtxWorld, frustumCorners);

        const center: Vector3 = Recycler.get(Vector3);
        for (const corner of frustumCorners)
          center.add(corner);
        center.scale(1 / frustumCorners.length);

        let radius: number = 0;
        for (const corner of frustumCorners)
          radius = Math.max(radius, center.getDistance(corner));

        radius *= RenderWebGLComponentLight.#SHADOW_SIZE / (RenderWebGLComponentLight.#SHADOW_SIZE - 2); // add a texel by each side

        const xAxis: Vector3 = cmpLight.mtxWorld.getRight();
        const yAxis: Vector3 = cmpLight.mtxWorld.getUp();
        const zAxis: Vector3 = cmpLight.mtxWorld.getForward();

        const xCenter: number = Vector3.DOT(xAxis, center);
        const yCenter: number = Vector3.DOT(yAxis, center);
        const zCenter: number = Vector3.DOT(zAxis, center);

        const unit: number = radius * 4 / RenderWebGLComponentLight.#SHADOW_SIZE;
        const xMin: number = Calc.snap(xCenter - radius, unit);
        const xMax: number = Calc.snap(xCenter + radius, unit);
        const yMin: number = Calc.snap(yCenter - radius, unit);
        const yMax: number = Calc.snap(yCenter + radius, unit);
        const zMin: number = zCenter - radius;
        const zMax: number = zCenter + radius;

        const halfX: number = (xMax - xMin) * 0.5;
        const halfY: number = (yMax - yMin) * 0.5;

        Matrix4x4.PROJECTION_ORTHOGRAPHIC(-halfX, halfX, -halfY, halfY, 0, zMax - zMin, mtxProjection);
        mtxView.copy(cmpLight.mtxWorld);

        const translation: Vector3 = mtxView.translation.set(0, 0, 0);
        translation.add(Vector3.SCALE(xAxis, xMin + halfX, xAxis));
        translation.add(Vector3.SCALE(yAxis, yMin + halfY, yAxis));
        translation.add(Vector3.SCALE(zAxis, zMin, zAxis)); // use zMin as FUDGE directional lights shine in positive z direction
        mtxView.translation = translation;
        mtxView.invert();

        Recycler.store(mtxProjection);
        Recycler.store(center);
        Recycler.store(xAxis);
        Recycler.store(yAxis);
        Recycler.store(zAxis);

        // adjust normal bias by world space texel size
        const shadowTexelSizeWorld: number = radius * 2 / RenderWebGLComponentLight.#SHADOW_SIZE;
        const iShadowParameter: number = (<General>cmpLight)[SHADOW_INDEX] * 4;
        RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 1] = cmpLight.shadowNormalBias * shadowTexelSizeWorld;

        RenderWebGLComponentLight.processShadows(_nodes, cmpLight, mtxView, mtxProjection, (<General>cmpLight)[SHADOW_INDEX]);
      }

      Recycler.store(mtxView);
      Recycler.store(mtxProjection);

      const rectViewport: Rectangle = Render.getViewportRectangle();
      crc3.viewport(rectViewport.x, rectViewport.y, rectViewport.width, rectViewport.height);

      RenderWebGLComponentLight.bindShadowBuffer();
      RenderWebGLComponentLight.uploadShadowMatrices(0, RenderWebGLComponentLight.#shadowLightsDirectional.length);
      RenderWebGLComponentLight.uploadShadowParameters(0, RenderWebGLComponentLight.#shadowLightsDirectional.length);
    }

    public static processShadowsSpot(_nodes: Iterable<Node>): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.viewport(0, 0, RenderWebGLComponentLight.#SHADOW_SIZE, RenderWebGLComponentLight.#SHADOW_SIZE);

      const mtxView: Matrix4x4 = Recycler.get(Matrix4x4);
      const mtxProjection: Matrix4x4 = Recycler.get(Matrix4x4);

      for (const cmpLight of RenderWebGLComponentLight.#shadowLightsSpot) {
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

        RenderWebGLComponentLight.processShadows(_nodes, cmpLight, mtxView, mtxProjection, (<General>cmpLight)[SHADOW_INDEX]);
      }

      Recycler.store(mtxView);
      Recycler.store(mtxProjection);

      const rectViewport: Rectangle = Render.getViewportRectangle();
      crc3.viewport(rectViewport.x, rectViewport.y, rectViewport.width, rectViewport.height);

      RenderWebGLComponentLight.bindShadowBuffer();
      RenderWebGLComponentLight.uploadShadowMatrices(RenderWebGLComponentLight.#shadowLightsDirectional.length, RenderWebGLComponentLight.#shadowLightsSpot.length);
    }

    public static processShadowsPoint(_nodes: Iterable<Node>): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentLight.fboShadowMap);
      crc3.viewport(0, 0, RenderWebGLComponentLight.#SHADOW_SIZE, RenderWebGLComponentLight.#SHADOW_SIZE);

      const mtxView: Matrix4x4 = Recycler.get(Matrix4x4);
      const mtxProjection: Matrix4x4 = Recycler.get(Matrix4x4);

      for (const cmpLight of RenderWebGLComponentLight.#shadowLightsPoint) {
        const pointScaling: Vector3 = cmpLight.mtxWorld.scaling;
        const rangePoint: number = Math.max(Math.abs(pointScaling.x), Math.abs(pointScaling.y), Math.abs(pointScaling.z));
        const epsilonPoint: number = 0.001;
        const nearPoint: number = Math.min(Math.max(0.001, rangePoint * 0.001), Math.max(rangePoint - epsilonPoint, epsilonPoint));
        const farPoint: number = Math.max(rangePoint, nearPoint + epsilonPoint);

        Matrix4x4.PROJECTION_CENTRAL(1, 90, nearPoint, farPoint, FIELD_OF_VIEW.VERTICAL, mtxProjection);

        const iShadowBase: number = (<General>cmpLight)[SHADOW_INDEX];
        for (let iFace: number = 0; iFace < 6; iFace++) {
          const iShadow: number = iShadowBase + iFace;
          Matrix4x4.LOOK_IN(directions[iFace], ups[iFace], false, cmpLight.mtxWorld.translation, undefined, mtxView);
          Matrix4x4.INVERSE(mtxView, mtxView);
          RenderWebGLComponentLight.processShadows(_nodes, cmpLight, mtxView, mtxProjection, iShadow);
        }
      }

      Recycler.store(mtxView);
      Recycler.store(mtxProjection);

      const rectViewport: Rectangle = Render.getViewportRectangle();
      crc3.viewport(rectViewport.x, rectViewport.y, rectViewport.width, rectViewport.height);

      RenderWebGLComponentLight.bindShadowBuffer();
      RenderWebGLComponentLight.uploadShadowMatrices(RenderWebGLComponentLight.#shadowLightsDirectional.length + RenderWebGLComponentLight.#shadowLightsSpot.length, RenderWebGLComponentLight.#shadowLightsPoint.length * RenderWebGLComponentLight.getLayerCount(LIGHT_TYPE.POINT));
    }

    private static prepareAmbient(_cmpLights: RecycableArray<ComponentLight>): void {
      const clrOut: Color = Recycler.get(Color).set(0, 0, 0, 0);

      if (_cmpLights?.length > 0) {
        const clrCurrent: Color = Recycler.get(Color);
        for (let cmpLight of _cmpLights)
          Color.SUM(clrOut, Color.SCALE(cmpLight.color, cmpLight.intensity, clrCurrent), clrOut);
        Recycler.store(clrCurrent);
      }

      clrOut.toArray(RenderWebGLComponentLight.#dataLightsAmbient);

      Recycler.store(clrOut);
    }

    private static prepareLights(_lights: RecycableArray<ComponentLight>, _data: Float32Array, _shadowLights: RecycableArray<ComponentLight>, _nShadows: number): number {
      if (!_lights)
        return _nShadows;

      const clrOut: Color = Recycler.get(Color);
      const mtxOut: Matrix4x4 = Recycler.get(Matrix4x4);

      let iLight: number = 0;

      for (let cmpLight of _lights) {
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
        if (cmpLight.shadowEnabled) {
          const nShadowLayersRequired: number = RenderWebGLComponentLight.getLayerCount(cmpLight.lightType);
          if (_nShadows + nShadowLayersRequired > RenderWebGLComponentLight.#MAX_SHADOW_COUNT)
            continue;

          _shadowLights.push(cmpLight); // collect shadow casting lights for shadow rendering pass

          const iShadowParameter: number = _nShadows * 4;
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 0] = cmpLight.shadowBias;
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 1] = cmpLight.shadowNormalBias * RenderWebGLComponentLight.SHADOW_TEXEL_SIZE; // TODO: inspect this scaling
          RenderWebGLComponentLight.#dataShadowParameters[iShadowParameter + 2] = cmpLight.shadowBlur;

          _data[iLight + 36] = (<General>cmpLight)[SHADOW_INDEX] = _nShadows;

          _nShadows += nShadowLayersRequired;
        } else {
          _data[iLight + 36] = -1;
        }

        iLight += 40;
      }

      Recycler.store(clrOut);
      Recycler.store(mtxOut);

      return _nShadows;
    }

    private static processShadows(_nodes: Iterable<Node>, _cmpLight: ComponentLight, _mtxView: Matrix4x4, _mtxProjection: Matrix4x4, _iShadow: number): void {
      const mtxViewProjection: Matrix4x4 = Matrix4x4.PRODUCT(_mtxProjection, _mtxView);
      RenderWebGLComponentCamera.updateViewBuffer(_mtxView, _mtxProjection, mtxViewProjection, _cmpLight.mtxWorld.translation);

      const mtxShadow: Matrix4x4 = Matrix4x4.PRODUCT(mtxTextureSpaceConversion, mtxViewProjection);
      mtxShadow.toArray(RenderWebGLComponentLight.#dataShadowMatrices, _iShadow * 16);

      Recycler.store(mtxViewProjection);
      Recycler.store(mtxShadow);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.framebufferTextureLayer(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, RenderWebGLComponentLight.texShadowMap, 0, _iShadow);
      crc3.clear(WebGL2RenderingContext.DEPTH_BUFFER_BIT);

      if (!this.#shadowMaterial) {
        this.#shadowMaterial = new Material("MaterialShadow", ShaderLit, new CoatColored(Color.CSS("white")));
        Project.deregister(this.#shadowMaterial);
      }

      if (!this.#shadowMaterialSkin) {
        this.#shadowMaterialSkin = new Material("MaterialShadowSkin", ShaderLitSkin, new CoatColored(Color.CSS("white")));
        Project.deregister(this.#shadowMaterialSkin);
      }

      for (let node of _nodes) {
        const cmpMesh: ComponentMesh = node.getComponent(ComponentMesh);
        const shadowMaterial: Material = cmpMesh?.skeleton?.active ? this.#shadowMaterialSkin : this.#shadowMaterial;
        RenderWebGL.drawNode(node, null, shadowMaterial);
      }
    }

    private static bindLightBuffer(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferLights);
    }

    private static uploadLightHeader(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#dataLights, 0, RenderWebGLComponentLight.#dataLightsHeader.length + RenderWebGLComponentLight.#dataLightsAmbient.length); // header + ambient color
    }

    private static uploadLights(_data: Float32Array, _length: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const FLOATS_PER_LIGHT: number = 40;
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, _data.byteOffset, _data, 0, _length * FLOATS_PER_LIGHT);
    }

    private static bindShadowBuffer(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#bufferShadows);
    }

    private static uploadShadowHeader(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#dataShadowHeader);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataShadowKernel.byteOffset, RenderWebGLComponentLight.#dataShadowKernel);
    }

    private static uploadShadowMatrices(_offset: number, _length: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const FLOATS_PER_MATRIX: number = 16;
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataShadowMatrices.byteOffset + _offset * FLOATS_PER_MATRIX * RenderWebGLComponentLight.#dataShadowMatrices.BYTES_PER_ELEMENT, RenderWebGLComponentLight.#dataShadowMatrices, _offset * FLOATS_PER_MATRIX, _length * FLOATS_PER_MATRIX);
    }

    private static uploadShadowParameters(_offset: number, _length: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const FLOATS_PER_VECTOR: number = 4;
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#dataShadowParameters.byteOffset + _offset * FLOATS_PER_VECTOR * RenderWebGLComponentLight.#dataShadowParameters.BYTES_PER_ELEMENT, RenderWebGLComponentLight.#dataShadowParameters, _offset * FLOATS_PER_VECTOR, _length * FLOATS_PER_VECTOR);
    }

    private static getVogelDisk(_kernel: { [index: number]: number }, _sampleCount: number): void {
      const goldenAngle: number = 2.4;

      for (let i: number = 0; i < _sampleCount; i++) {
        const r: number = Math.sqrt(i + 0.5) / Math.sqrt(_sampleCount);
        const theta: number = i * goldenAngle;

        _kernel[i * 4] = Math.cos(theta) * r;
        _kernel[i * 4 + 1] = Math.sin(theta) * r;
      }
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

    private static hndEvent(_event: Event): void {
      const shadowSize: number = ProjectSettings.get("rendering/lightsAndShadows/shadowSize");
      RenderWebGLComponentLight.setShadowSize(shadowSize);

      const shadowFilterQuality: SHADOW_FILTER_QUALITY = ProjectSettings.get("rendering/lightsAndShadows/shadowFilterQuality");
      RenderWebGLComponentLight.setShadowFilterQuality(shadowFilterQuality);
    };
  }
}