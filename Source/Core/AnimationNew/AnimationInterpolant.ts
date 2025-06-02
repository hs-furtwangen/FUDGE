namespace FudgeCore {
  export namespace AnimationSystem {

    /**
     * Handles evaluation and interpolation of animation values between keyframes.
     */
    export abstract class AnimationInterpolant {
      public input: Float32Array;
      public output: Float32Array;
      public result: Float32Array;
      public elementSize: number;

      public constructor(_input: Float32Array, _output: Float32Array, _elementSize: number, _result?: Float32Array) {
        this.input = _input;
        this.output = _output;
        this.elementSize = _elementSize;
        this.result = _result ?? new Float32Array(this.elementSize);
      }

      /**
       * Evaluates the interpolant at a given time.
       */
      public evaluate(_time: number): Float32Array {
        const times: Float32Array = this.input;
        let i1: number = 0;
        let iRight: number = times.length - 1;
        let iMid: number;

        // Binary search for the correct time interval
        while (i1 < iRight) {
          iMid = (i1 + iRight) >>> 1;
          if (_time < times[iMid])
            iRight = iMid;
          else
            i1 = iMid + 1;
        }

        const timeStart: number = times[i1 - 1];
        const timeEnd: number = times[i1];
        const t: number = (_time - timeStart) / (timeEnd - timeStart);

        return this.interpolate(i1, t);
      }

      /**
       * Interpolates between keyframe[i-1] and keyframe[i] using the given t value in the range [0, 1].
       */
      public abstract interpolate(_i1: number, _t: number): Float32Array;
    }

    export class AnimationInterpolantConstant extends AnimationInterpolant {
      public override interpolate(_i1: number, _t: number): Float32Array {
        const stride: number = this.elementSize;
        const values: Float32Array = this.output;
        const result: Float32Array = this.result;

        const offset0: number = (_i1 - 1) * stride;

        for (let i: number = 0; i < stride; i++)
          result[i] = values[offset0 + i];

        return result;
      }
    }

    export class AnimationInterpolantLinear extends AnimationInterpolant {
      public override interpolate(_i1: number, _t: number): Float32Array {
        const stride: number = this.elementSize;
        const values: Float32Array = this.output;
        const result: Float32Array = this.result;

        const offset1: number = _i1 * stride;
        const offset0: number = offset1 - stride;

        for (let i: number = 0; i < stride; i++) {
          const v0: number = values[offset0 + i];
          const v1: number = values[offset1 + i];
          result[i] = v0 + (v1 - v0) * _t;
        }

        return result;
      }
    }

    export class AnimationInterpolantQuaternionLinear extends AnimationInterpolant {
      public override interpolate(_i1: number, _t: number): Float32Array {
        const stride: number = this.elementSize;
        const values: Float32Array = this.output;
        const result: Float32Array = this.result;
        const offset1: number = _i1 * stride;
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
      public constructor(_times: Float32Array, _values: Float32Array, _elementSize: number) {
        super(_times, _values, _elementSize);

        const nKeyframes: number = _times.length;
        this.#a = new Float32Array(nKeyframes * _elementSize);
        this.#b = new Float32Array(nKeyframes * _elementSize);
        this.#c = new Float32Array(nKeyframes * _elementSize);
        this.#d = new Float32Array(nKeyframes * _elementSize);

        const segmentSize: number = _elementSize * 3;

        for (let iTime: number = 0; iTime < nKeyframes - 1; iTime++) {
          const iValue0: number = iTime * segmentSize + _elementSize;
          const iTangent0: number = iValue0 + _elementSize;
          const iTangent1: number = iTangent0 + _elementSize;
          const iValue1: number = iTangent1 + _elementSize;

          for (let iComponent: number = 0; iComponent < _elementSize; iComponent++) {
            const v0: number = _values[iValue0 + iComponent];
            const v1: number = _values[iValue1 + iComponent];
            const m0: number = _values[iTangent0 + iComponent];
            const m1: number = _values[iTangent1 + iComponent];

            // Hermite interpolation coefficients
            const iCoefficient: number = iTime * _elementSize + iComponent;
            this.#a[iCoefficient] = 2 * v0 - 2 * v1 + m0 + m1;
            this.#b[iCoefficient] = -3 * v0 + 3 * v1 - 2 * m0 - m1;
            this.#c[iCoefficient] = m0;
            this.#d[iCoefficient] = v0;
          }
        }

        // Set last keyframe (constant extrapolation)
        const iCoefficient: number = (nKeyframes - 1) * _elementSize;
        const iValue: number = (nKeyframes - 1) * segmentSize + _elementSize;
        for (let i: number = 0; i < _elementSize; i++)
          this.#d[iCoefficient + i] = _values[iValue + i];
      }

      public override interpolate(_i1: number, _t: number): Float32Array {
        const stride: number = this.elementSize;
        const result: Float32Array = this.result;

        const t2: number = _t * _t;
        const t3: number = t2 * _t;

        for (let iResult: number = 0, iCoefficient: number = (_i1 - 1) * stride; iResult < stride; iResult++, iCoefficient++)
          result[iResult] = this.#a[iCoefficient] * t3 + this.#b[iCoefficient] * t2 + this.#c[iCoefficient] * _t + this.#d[iCoefficient];

        return result;
      }
    }

    export class AnimationInterpolantQuaternionCubic extends AnimationInterpolantCubic {
      public override interpolate(_i1: number, _t: number): Float32Array { // TODO: take short path
        const result: Float32Array = super.interpolate(_i1, _t);
        return Quaternion.NORMALIZE_ARRAY(result, 0, result, 0);
      }
    }
  }
}