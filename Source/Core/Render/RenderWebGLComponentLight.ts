namespace FudgeCore {
  /**
   * Manages {@link ComponentLight} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentLight {
    static #buffer: WebGLBuffer;
    static #data: Float32Array;

    static #dataHeader: Uint32Array;
    static #dataAmbient: Float32Array;
    static #dataPoint: Float32Array;
    static #dataSpot: Float32Array;
    static #dataDirectional: Float32Array;

    /**
     * Initialize the light uniform buffer.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const MAX_LIGHTS_DIRECTIONAL: number = 15;
      const MAX_LIGHTS_POINT: number = 100;
      const MAX_LIGHTS_SPOT: number = 100;

      const HEADER_UINTS: number = 4;
      const COLOR_FLOATS: number = 4;
      const MATRIX_FLOATS: number = 16;
      const LIGHT_FLOATS: number = COLOR_FLOATS + MATRIX_FLOATS + MATRIX_FLOATS;

      let blockSize: number = (HEADER_UINTS + COLOR_FLOATS + (MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT + MAX_LIGHTS_SPOT) * LIGHT_FLOATS) * 4;
      blockSize = Math.ceil(blockSize / 16) * 16; // std140 alignment

      RenderWebGLComponentLight.#data = new Float32Array(new ArrayBuffer(blockSize));

      RenderWebGLComponentLight.#dataHeader = new Uint32Array(RenderWebGLComponentLight.#data.buffer, 0, HEADER_UINTS);
      RenderWebGLComponentLight.#dataAmbient = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataHeader.byteOffset + RenderWebGLComponentLight.#dataHeader.byteLength, COLOR_FLOATS); // ambient light color
      RenderWebGLComponentLight.#dataDirectional = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataAmbient.byteOffset + RenderWebGLComponentLight.#dataAmbient.byteLength, MAX_LIGHTS_DIRECTIONAL * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataPoint = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataDirectional.byteOffset + RenderWebGLComponentLight.#dataDirectional.byteLength, MAX_LIGHTS_POINT * LIGHT_FLOATS);
      RenderWebGLComponentLight.#dataSpot = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataPoint.byteOffset + RenderWebGLComponentLight.#dataPoint.byteLength, MAX_LIGHTS_SPOT * LIGHT_FLOATS);

      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      RenderWebGLComponentLight.#buffer = _renderWebGL.assert(crc3.createBuffer());

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGLComponentLight.#buffer);
    }

    /** Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<M extends (this: typeof ComponentLight, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<typeof ComponentLight, M>): M {
      return Reflect.get(this, _context.name);
    }

    /**
     * Buffer the light data to the uniform buffer.
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
        clrSum.toArray(RenderWebGLComponentLight.#dataAmbient);
      }

      const cmpLightsDirectional: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.DIRECTIONAL);
      const cmpLightsPoint: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.POINT);
      const cmpLightsSpot: RecycableArray<ComponentLight> = _lights.get(LIGHT_TYPE.SPOT);

      RenderWebGLComponentLight.#dataHeader[0] = cmpLightsDirectional?.length ?? 0;
      RenderWebGLComponentLight.#dataHeader[1] = cmpLightsPoint?.length ?? 0;
      RenderWebGLComponentLight.#dataHeader[2] = cmpLightsSpot?.length ?? 0;

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#data, 0, RenderWebGLComponentLight.#dataHeader.length + RenderWebGLComponentLight.#dataAmbient.length); // header + ambient color

      const clrOut: Color = Recycler.get(Color); // stores intermediate color
      const mtxOut: Matrix4x4 = Matrix4x4.IDENTITY(); // stores intermediate matrix
      RenderWebGLComponentLight.bufferLights(crc3, cmpLightsDirectional, RenderWebGLComponentLight.#dataDirectional, clrOut, mtxOut);
      RenderWebGLComponentLight.bufferLights(crc3, cmpLightsPoint, RenderWebGLComponentLight.#dataPoint, clrOut, mtxOut);
      RenderWebGLComponentLight.bufferLights(crc3, cmpLightsSpot, RenderWebGLComponentLight.#dataSpot, clrOut, mtxOut);
      Recycler.store(clrOut);
      Recycler.store(mtxOut);
    }

    private static bufferLights(_crc3: WebGL2RenderingContext, _cmpLights: RecycableArray<ComponentLight>, _data: Float32Array, _clrOut: Color, _mtxOut: Matrix4x4): void {
      if (!_cmpLights)
        return;

      let iLight: number = 0;
      for (let cmpLight of _cmpLights) {
        // set vctColor
        Color.SCALE(cmpLight.color, cmpLight.intensity, _clrOut).toArray(_data, iLight);

        // set mtxShape
        Matrix4x4.PRODUCT(cmpLight.node.mtxWorld, cmpLight.mtxPivot, _mtxOut);
        if (cmpLight.lightType == LIGHT_TYPE.DIRECTIONAL)
          _mtxOut.translation = _mtxOut.translation.set(0, 0, 0);
        _mtxOut.toArray(_data, iLight + 4);

        // set mtxShapeInverse
        if (cmpLight.lightType != LIGHT_TYPE.DIRECTIONAL)
          Matrix4x4.INVERSE(_mtxOut, _mtxOut).toArray(_data, iLight + 20);

        iLight += 36;
      }

      _crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, _data.byteOffset, _data, 0, iLight);
    }
  }
}