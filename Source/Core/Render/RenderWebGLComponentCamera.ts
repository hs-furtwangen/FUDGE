namespace FudgeCore {

  /**
   * Manages {@link ComponentCamera} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderWebGLComponentCamera {
    static #buffer: WebGLBuffer;
    static #data: Float32Array;

    /**
     * Initialize the camera uniform buffer.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      let blockSize: number = (16 + 16 + 16 + 3) * 4; // mat4 mtxView, mat4 mtxProjection, mat4 mtxViewProjection, vec3 vctCameraPosition
      blockSize = Math.ceil(blockSize / 16) * 16; // std140 alignment

      RenderWebGLComponentCamera.#buffer = _renderWebGL.assert(crc3.createBuffer());
      RenderWebGLComponentCamera.#data = new Float32Array(new ArrayBuffer(blockSize));

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.CAMERA.BINDING, RenderWebGLComponentCamera.#buffer);
    }

    /**
     * Buffer the camera data to the uniform buffer.
     */
    public static useRenderbuffer(_cmpCamera: ComponentCamera): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const data: Float32Array = RenderWebGLComponentCamera.#data;

      const mtxView: Matrix4x4 = _cmpCamera.mtxCameraInverse;
      const mtxProjection: Matrix4x4 = _cmpCamera.mtxProjection;
      const mtxViewProjection: Matrix4x4 = _cmpCamera.mtxWorldToView;
      const vctPosition: Vector3 = _cmpCamera.mtxWorld.translation;

      data.set(mtxView.getArray(), 0);
      data.set(mtxProjection.getArray(), 16);
      data.set(mtxViewProjection.getArray(), 32);
      vctPosition.toArray(data, 48);

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentCamera.#data);
    }
  }
}