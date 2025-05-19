namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Handles evaluation and interpolation of animation values between keyframes.
     */
    export abstract class AnimationInterpolant {
      public times: Float32Array;
      public values: Float32Array;
      public valueSize: number;
      public result: Float32Array;

      public constructor(_times: Float32Array, _values: Float32Array, _valueSize: number) {
        this.times = _times;
        this.values = _values;
        this.valueSize = _valueSize;
        this.result = new Float32Array(this.valueSize);
      }

      public evaluate(_t: number): Float32Array {
        let i: number = 0, iRight: number = this.times.length - 1, iMid: number;

        const times: Float32Array = this.times;
        while (i < iRight) {
          iMid = (i + iRight) >>> 1;
          if (_t < times[iMid])
            iRight = iMid;
          else
            i = iMid + 1;
        }

        const t0: number = times[i - 1];
        const t1: number = times[i];
        const t: number = (_t - t0) / (t1 - t0);

        return this.interpolate(i, t);
      }

      public abstract interpolate(_iValueStart: number, _t: number): Float32Array;
    }

    export class AnimationInterpolantConstant extends AnimationInterpolant {
      public override interpolate(_i: number, _t: number): Float32Array {
        const stride: number = this.valueSize;
        const values: Float32Array = this.values;
        const result: Float32Array = this.result;

        const offset: number = _i * stride;

        for (let i: number = 0; i < stride; i++) 
          result[i] = values[offset + i];

        return this.result;
      }
    }

    export class AnimationInterpolantLinear extends AnimationInterpolant {
      public override interpolate(_i: number, _t: number): Float32Array {
        const stride: number = this.valueSize;
        const values: Float32Array = this.values;
        const result: Float32Array = this.result;

        const offset1: number = _i * stride;
        const offset0: number = offset1 - stride;

        for (let i: number = 0; i < stride; i++) {
          const vStart: number = values[offset0 + i];
          const vEnd: number = values[offset1 + i];
          result[i] = vStart + (vEnd - vStart) * _t;
        }

        return this.result;
      }
    }
  }
}
