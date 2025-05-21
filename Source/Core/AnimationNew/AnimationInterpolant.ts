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
        this.result ??= new Float32Array(this.valueSize);
      }

      /**
       * Evaluates the interpolant at a given time.
       */
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

      /**
       * Interpolates between keyframe[i-1] and keyframe[i] using the given t value in the range [0, 1].
       */
      public abstract interpolate(_i: number, _t: number): Float32Array;
    }

    export class AnimationInterpolantConstant extends AnimationInterpolant {
      public override interpolate(_i: number, _t: number): Float32Array {
        const stride: number = this.valueSize;
        const values: Float32Array = this.values;
        const result: Float32Array = this.result;

        const offset0: number = _i * stride - stride;

        for (let i: number = 0; i < stride; i++)
          result[i] = values[offset0 + i];

        return result;
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

        return result;
      }
    }

    export class AnimationInterpolantQuaternionLinear extends AnimationInterpolant {
      public override interpolate(_i: number, _t: number): Float32Array {
        const stride: number = this.valueSize;
        const values: Float32Array = this.values;
        const result: Float32Array = this.result;
        const offset1: number = _i * stride;
        const offset0: number = offset1 - stride;

        return Quaternion.SLERP_ARRAY(values, offset0, values, offset1, _t, result, 0);
      }
    }

    export class AnimationInterpolantCubic extends AnimationInterpolant {
      #a: Float32Array;
      #b: Float32Array;
      #c: Float32Array;
      #d: Float32Array;

      // values are in format [inTangent0, value0, outTangent0, inTangent1, ...]
      public constructor(_times: Float32Array, _values: Float32Array, _sampleSize: number) {
        super(_times, _values, _sampleSize);

        const length: number = _times.length;
        this.#a = new Float32Array(length * _sampleSize);
        this.#b = new Float32Array(length * _sampleSize);
        this.#c = new Float32Array(length * _sampleSize);
        this.#d = new Float32Array(length * _sampleSize);

        for (let iTime: number = 0; iTime < length - 1; iTime++) {
          const iValue: number = iTime * _sampleSize + _sampleSize;
          const iOutTangent: number = iValue + _sampleSize;
          const iInTangentNext: number = iOutTangent + _sampleSize;
          const iValueNext: number = iInTangentNext + _sampleSize;

          const time: number = _times[iTime];
          const timeNext: number = _times[iTime + 1];
          const x1: number = (timeNext - time) / timeNext;

          for (let i: number = 0; i < _sampleSize; i++) {
            const v0: number = _values[iValue + i];
            const v1: number = _values[iOutTangent + i];
            const v2: number = _values[iInTangentNext + i];
            const v3: number = _values[iValueNext + i];

            const a: number = (-x1 * (v1 + v2) - 2 * v0 + 2 * v3) / -Math.pow(x1, 3);
            const b: number = (v2 - v1 - 3 * a * Math.pow(x1, 2)) / (2 * x1);
            const c: number = v1;
            const d: number = v0;

            const iCoefficient: number = iTime * _sampleSize + i;
            this.#a[iCoefficient] = a;
            this.#b[iCoefficient] = b;
            this.#c[iCoefficient] = c;
            this.#d[iCoefficient] = d;
          }
        }

        // set last keyframe
        const iCoefficient: number = (length - 1) * _sampleSize;
        const iValueLast: number = iCoefficient + _sampleSize * 3;
        for (let i: number = 0; i < _sampleSize; i++)
          this.#d[iCoefficient + i] = _values[iValueLast + i];
      }

      public override interpolate(_i: number, _t: number): Float32Array {
        const stride: number = this.valueSize;
        const result: Float32Array = this.result;
        const offset0: number = _i * stride - stride;

        const t2: number = _t * _t;
        const t3: number = t2 * _t;

        const a: Float32Array = this.#a;
        const b: Float32Array = this.#b;
        const c: Float32Array = this.#c;
        const d: Float32Array = this.#d;

        for (let i: number = 0; i < stride; i++) {
          const offset: number = offset0 + i;
          result[i] = a[offset] * t3 + b[offset] * t2 + c[offset] * _t + d[offset];
        }

        return result;
      }
    }

    export class AnimationInterpolantQuaternionCubic extends AnimationInterpolantCubic {
      public override interpolate(_i: number, _t: number): Float32Array {
        const result: Float32Array = super.interpolate(_i, _t);
        return Quaternion.NORMALIZE_ARRAY(result, 0, result, 0);
      }
    }
  }
}