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
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.VIEW.BINDING, RenderWebGLComponentCamera.#buffer);
    }

    /**
     * Buffer the camera data to the uniform buffer.
     */
    public static useRenderbuffer(_cmpCamera: ComponentCamera): void {
      const mtxView: Matrix4x4 = _cmpCamera.mtxCameraInverse;
      const mtxProjection: Matrix4x4 = _cmpCamera.mtxProjection;
      const mtxViewProjection: Matrix4x4 = _cmpCamera.mtxWorldToView;
      const vctPosition: Vector3 = _cmpCamera.mtxWorld.translation;

      RenderWebGLComponentCamera.updateViewBuffer(mtxView, mtxProjection, mtxViewProjection, vctPosition);
    }

    public static updateViewBuffer(_mtxView: Matrix4x4, _mtxProjection: Matrix4x4, _mtxViewProjection: Matrix4x4, _vctPosition: Vector3): void {
      const data: Float32Array = RenderWebGLComponentCamera.#data;

      _mtxView.toArray(data, 0);
      _mtxProjection.toArray(data, 16);
      _mtxViewProjection.toArray(data, 32);
      _vctPosition.toArray(data, 64);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentCamera.#data);
    }
  }
}