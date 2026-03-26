///<reference path="WebGLUniformBuffer.ts"/>

namespace FudgeCore {
  export class WebGLObjectUniformBuffer extends WebGLUniformBuffer {
    public constructor(_capacity: number) {
      const blockSize: number = (16 + 12 + 4 + 1 + 1 + 1 + 1 + 1 + 1) * 4; // mat4 mtxWorld, mat3 mtxPivot, vec4 color, float blendMode, float duration, float size, float time, bool faceCameraActive, bool faceCameraRestrict, 
      super(UNIFORM_BLOCK.OBJECT.BINDING, blockSize, _capacity);
    }

    public write(_slot: number, _mtxModel?: Matrix4x4, _mtxPivot?: Matrix3x3, _color?: Color, _blendMode?: number, _particleSystemDuration?: number, _particleSystemSize?: number, _particleSystemTime?: number, _faceCameraActive?: boolean, _faceCameraRestrict?: boolean): void {
      const floatView: Float32Array = this.floatView;
      const offset: number = _slot * this.elementStride;

      _mtxModel?.toArray(floatView, offset);

      if (_mtxPivot) {
        const mtxPivot: ArrayLike<number> = _mtxPivot.getArray();
        floatView[offset + 16] = mtxPivot[0];
        floatView[offset + 17] = mtxPivot[1];
        floatView[offset + 18] = mtxPivot[2];

        floatView[offset + 20] = mtxPivot[3];
        floatView[offset + 21] = mtxPivot[4];
        floatView[offset + 22] = mtxPivot[5];

        floatView[offset + 24] = mtxPivot[6];
        floatView[offset + 25] = mtxPivot[7];
        floatView[offset + 26] = mtxPivot[8];
      }

      _color?.toArray(floatView, offset + 28);

      // TODO: maybe create a second buffer for particle system data?
      if (_blendMode !== undefined || _particleSystemDuration !== undefined || _particleSystemSize !== undefined || _particleSystemTime !== undefined || _faceCameraActive !== undefined || _faceCameraRestrict !== undefined) {
        const uintView: Uint32Array = this.uintView;
        uintView[offset + 32] = _blendMode ?? 0;
        floatView[offset + 33] = _particleSystemDuration ?? 0;
        floatView[offset + 34] = _particleSystemSize ?? 0;
        floatView[offset + 35] = _particleSystemTime ?? 0;
        uintView[offset + 36] = _faceCameraActive ? 1 : 0;
        uintView[offset + 37] = _faceCameraRestrict ? 1 : 0;
      }
    }
  }
}