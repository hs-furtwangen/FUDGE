namespace FudgeCore {

  /**
   * Manages {@link ComponentLight} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentLight {
    static #FLOATS_PER_LIGHT: number;

    static #buffer: WebGLBuffer;
    static #data: Float32Array;
    static #dataUint: Uint32Array;
    static #offsets: { [key in LIGHT_TYPE]: number };

    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const MAX_LIGHTS_DIRECTIONAL: number = 15; // must match the define in the shader
      const MAX_LIGHTS_POINT: number = 100;
      const MAX_LIGHTS_SPOT: number = 100;
      const FLOATS_PER_LIGHT: number = RenderWebGLComponentLight.#FLOATS_PER_LIGHT = 4 + 16 + 16;
      const HEADER_UINTS: number = 4; // 1 for each light type + 1 for ambient light

      RenderWebGLComponentLight.#data = new Float32Array(HEADER_UINTS + (1 + MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT + MAX_LIGHTS_SPOT) * FLOATS_PER_LIGHT);
      RenderWebGLComponentLight.#dataUint = new Uint32Array(RenderWebGLComponentLight.#data.buffer);
      RenderWebGLComponentLight.#offsets = {
        LightAmbient: HEADER_UINTS,
        LightDirectional: HEADER_UINTS + FLOATS_PER_LIGHT,
        LightPoint: HEADER_UINTS + FLOATS_PER_LIGHT * (1 + MAX_LIGHTS_DIRECTIONAL),
        LightSpot: HEADER_UINTS + FLOATS_PER_LIGHT * (1 + MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT)
      };

      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      RenderWebGLComponentLight.#buffer = _renderWebGL.assert(crc3.createBuffer());

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGLComponentLight.#buffer);
    }

    /** @internal Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<M extends (this: typeof ComponentLight, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<typeof ComponentLight, M>): M {
      return Reflect.get(this, _context.name);
    }

    /**
     * Buffer the data from the lights in the scenegraph into the lights buffer.
     */
    public static updateRenderbuffer(this: typeof ComponentLight, _lights: MapLightTypeToLightList): void {
      // fill the buffer with the ambient light color
      let cmpLights: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.AMBIENT);
      if (cmpLights?.length > 0) {
        let clrSum: Color = Recycler.get(Color).set(0, 0, 0, 0);
        let clrLight: Color = Recycler.get(Color);
        for (let cmpLight of cmpLights)
          clrSum.add(Color.SCALE(cmpLight.color, cmpLight.intensity, clrLight));
        Recycler.store(clrSum);
        Recycler.store(clrLight);
        clrSum.toArray(RenderWebGLComponentLight.#data, RenderWebGLComponentLight.#offsets[LIGHT_TYPE.AMBIENT]);
      }

      const color: Color = Recycler.get(Color);
      const mtxShape: Matrix4x4 = Matrix4x4.IDENTITY();

      RenderWebGLComponentLight.bufferLights(_lights.get(LIGHT_TYPE.DIRECTIONAL), RenderWebGLComponentLight.#offsets[LIGHT_TYPE.DIRECTIONAL], 0, color, mtxShape);
      RenderWebGLComponentLight.bufferLights(_lights.get(LIGHT_TYPE.POINT), RenderWebGLComponentLight.#offsets[LIGHT_TYPE.POINT], 1, color, mtxShape);
      RenderWebGLComponentLight.bufferLights(_lights.get(LIGHT_TYPE.SPOT), RenderWebGLComponentLight.#offsets[LIGHT_TYPE.SPOT], 2, color, mtxShape);

      Recycler.store(color);
      Recycler.store(mtxShape);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#data);
    }

    private static bufferLights(_cmpLights: RecycableArray<ComponentLight>, _offset: number, _iHeader: number, _color: Color, _mtxShape: Matrix4x4): void {
      if (!_cmpLights) {
        RenderWebGLComponentLight.#dataUint[_iHeader] = 0;
        return;
      }

      RenderWebGLComponentLight.#dataUint[_iHeader] = _cmpLights.length;

      if (_cmpLights.length == 0)
        return;

      for (let cmpLight of _cmpLights) {
        // set vctColor
        Color.SCALE(cmpLight.color, cmpLight.intensity, _color).toArray(RenderWebGLComponentLight.#data, _offset);

        // set mtxShape
        Matrix4x4.PRODUCT(cmpLight.node.mtxWorld, cmpLight.mtxPivot, _mtxShape);
        if (cmpLight.lightType == LIGHT_TYPE.DIRECTIONAL)
          _mtxShape.translation = _mtxShape.translation.set(0, 0, 0);
        _mtxShape.toArray(RenderWebGLComponentLight.#data, _offset + 4); // offset + vctColor

        // set mtxShapeInverse
        if (cmpLight.lightType != LIGHT_TYPE.DIRECTIONAL)
          Matrix4x4.INVERSE(_mtxShape, _mtxShape).toArray(RenderWebGLComponentLight.#data, _offset + 4 + 16); // offset + vctColor + mtxShape

        _offset += RenderWebGLComponentLight.#FLOATS_PER_LIGHT;
      }

      return;
    }

  }
}