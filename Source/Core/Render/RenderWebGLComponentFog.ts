namespace FudgeCore {

  /**
   * Manages {@link ComponentFog} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentFog {
    static #buffer: WebGLBuffer;
    static #data: Float32Array;

    /**
     * Initialize the fog uniform buffer.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      let blockSize: number = (1 + 1 + 1 + 1 + 4) * 4; // bool u_bFogActive, float u_fFogNear, float u_fFogFar, float padding, vec4 u_vctFogColor
      blockSize = Math.ceil(blockSize / 16) * 16; // std140 alignment

      RenderWebGLComponentFog.#buffer = _renderWebGL.assert(crc3.createBuffer());
      RenderWebGLComponentFog.#data = new Float32Array(new ArrayBuffer(blockSize));

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.FOG.BINDING, RenderWebGLComponentFog.#buffer);
    }

    /**
     * Buffer the fog data to the uniform buffer.
     */
    public static useRenderbuffer(_cmpFog: ComponentFog): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const data: Float32Array = RenderWebGLComponentFog.#data;

      data[0] = _cmpFog?.isActive ? 1 : 0;
      if (_cmpFog) {
        data[1] = _cmpFog.near;
        data[2] = _cmpFog.far;
        _cmpFog.color.toArray(data, 4);
      }

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentFog.#data);
    }

  }
}