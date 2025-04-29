namespace FudgeCore {

  /**
   * Manages {@link ComponentLight} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderManagerComponentLight {
    public static readonly MAX_LIGHTS_DIRECTIONAL: number = 15; // must match the define in the shader
    public static readonly MAX_LIGHTS_POINT: number = 100;
    public static readonly MAX_LIGHTS_SPOT: number = 100;
    public static readonly FLOATS_PER_LIGHT: number = 4 + 16 + 16;
    public static readonly HEADER_UINTS: number = 4; // 1 for each light type + 1 for ambient light

    public static buffer: WebGLBuffer;
    public static data: Float32Array;
    public static dataHeader: Uint32Array;
    public static offsets: { [key in LIGHT_TYPE]: number };

    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const MAX_LIGHTS_DIRECTIONAL: number = 15; // must match the define in the shader
      const MAX_LIGHTS_POINT: number = 100;
      const MAX_LIGHTS_SPOT: number = 100;
      const FLOATS_PER_LIGHT: number = 4 + 16 + 16;
      const HEADER_UINTS: number = 4; // 1 for each light type + 1 for ambient light

      RenderManagerComponentLight.data = new Float32Array(HEADER_UINTS + (1 + MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT + MAX_LIGHTS_SPOT) * FLOATS_PER_LIGHT);
      RenderManagerComponentLight.dataHeader = new Uint32Array(RenderManagerComponentLight.data.buffer);
      RenderManagerComponentLight.offsets = {
        LightAmbient: HEADER_UINTS,
        LightDirectional: HEADER_UINTS + FLOATS_PER_LIGHT,
        LightPoint: HEADER_UINTS + FLOATS_PER_LIGHT * (1 + MAX_LIGHTS_DIRECTIONAL),
        LightSpot: HEADER_UINTS + FLOATS_PER_LIGHT * (1 + MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT)
      };

      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      RenderManagerComponentLight.buffer = _renderWebGL.assert(crc3.createBuffer());

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderManagerComponentLight.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderManagerComponentLight.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderManagerComponentLight.buffer);
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
        clrSum.toArray(RenderManagerComponentLight.data, RenderManagerComponentLight.offsets[LIGHT_TYPE.AMBIENT]);
      }

      const color: Color = Recycler.get(Color);
      const mtxShape: Matrix4x4 = Matrix4x4.IDENTITY();

      RenderManagerComponentLight.bufferLights(_lights.get(LIGHT_TYPE.DIRECTIONAL), RenderManagerComponentLight.offsets[LIGHT_TYPE.DIRECTIONAL], 0, color, mtxShape);
      RenderManagerComponentLight.bufferLights(_lights.get(LIGHT_TYPE.POINT), RenderManagerComponentLight.offsets[LIGHT_TYPE.POINT], 1, color, mtxShape);
      RenderManagerComponentLight.bufferLights(_lights.get(LIGHT_TYPE.SPOT), RenderManagerComponentLight.offsets[LIGHT_TYPE.SPOT], 2, color, mtxShape);

      Recycler.store(color);
      Recycler.store(mtxShape);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderManagerComponentLight.buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderManagerComponentLight.data);
    }

    private static bufferLights(_cmpLights: RecycableArray<ComponentLight>, _offset: number, _iHeader: number, _color: Color, _mtxShape: Matrix4x4): void {
      if (!_cmpLights) {
        RenderManagerComponentLight.dataHeader[_iHeader] = 0;
        return;
      }

      RenderManagerComponentLight.dataHeader[_iHeader] = _cmpLights.length;

      if (_cmpLights.length == 0)
        return;

      for (let cmpLight of _cmpLights) {
        // set vctColor
        Color.SCALE(cmpLight.color, cmpLight.intensity, _color).toArray(RenderManagerComponentLight.data, _offset);

        // set mtxShape
        Matrix4x4.PRODUCT(cmpLight.node.mtxWorld, cmpLight.mtxPivot, _mtxShape);
        if (cmpLight.lightType == LIGHT_TYPE.DIRECTIONAL)
          _mtxShape.translation = _mtxShape.translation.set(0, 0, 0);
        _mtxShape.toArray(RenderManagerComponentLight.data, _offset + 4); // offset + vctColor

        // set mtxShapeInverse
        if (cmpLight.lightType != LIGHT_TYPE.DIRECTIONAL)
          Matrix4x4.INVERSE(_mtxShape, _mtxShape).toArray(RenderManagerComponentLight.data, _offset + 4 + 16); // offset + vctColor + mtxShape

        _offset += RenderManagerComponentLight.FLOATS_PER_LIGHT;
      }

      return;
    }

  }
}