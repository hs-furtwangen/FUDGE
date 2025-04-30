namespace FudgeCore {


  /**
   * Manages {@link Node} data (data that is unique for each node, i.e. {@link Component} data) to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderManagerNode extends RenderBufferManager {
    public static override initialize(_renderWebGL: typeof RenderWebGL): void {
      const maxNodes: number = 256;
      const blockSize: number = (16 + 12 + 4 + 1 + 1 + 1 + 1 + 1 + 1) * 4; // mat4 mtxWorld, mat3 mtxPivot, vec4 color, float blendMode, float duration, float size, float time, bool faceCameraActive, bool faceCameraRestrict, 
      super.initialize(_renderWebGL, UNIFORM_BLOCK.NODE.BINDING, blockSize, maxNodes);
    }

    protected static override updateRenderData(_node: Node, _cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial, _cmpFaceCamera?: ComponentFaceCamera, _cmpParticleSystem?: ComponentParticleSystem): void {
      const offset: number = this.store(_node);

      const data: Float32Array = this.data;
      // mtx world
      data.set(_cmpMesh.mtxWorld.getArray(), offset);

      // mtx pivot
      let dataPivot: ArrayLike<number> = _cmpMaterial.mtxPivot.getArray();
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
      let color: Color = _cmpMaterial.clrPrimary;
      data[offset + 28] = color.r;
      data[offset + 29] = color.g;
      data[offset + 30] = color.b;
      data[offset + 31] = color.a;

      if (_cmpParticleSystem) {
        const dataUint: Uint32Array = this.dataUInt;
        dataUint[offset + 32] = _cmpParticleSystem.blendMode;
        data[offset + 33] = _cmpParticleSystem.duration;
        data[offset + 34] = _cmpParticleSystem.size;
        data[offset + 35] = _cmpParticleSystem.time;
        dataUint[offset + 36] = _cmpFaceCamera?.isActive ? 1 : 0;
        dataUint[offset + 37] = _cmpFaceCamera?.restrict ? 1 : 0;
      }
    }

    protected static override useRenderData(_node: Node, _mtxWorldOverride?: Matrix4x4): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      let offset: number = this.mapObjectToOffset.get(_node);
      crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, offset, this.blockSize);

      if (_mtxWorldOverride) // this is relatively slow, but since prepare has no camera information, we may need to override the world matrix here
        crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, offset, _mtxWorldOverride.getArray());
    }
  }
}