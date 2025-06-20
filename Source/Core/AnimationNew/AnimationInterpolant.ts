namespace FudgeCore {
  export namespace AnimationSystem {

    /**
     * Handles evaluation and interpolation of animation keyframe data. 
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
      public evaluate(_t: number): Float32Array {
        const input: Float32Array = this.input;
        let i1: number = 0;
        let iRight: number = input.length - 1;
        let iMid: number;

        while (i1 < iRight) {
          iMid = (i1 + iRight) >>> 1;
          if (_t < input[iMid])
            iRight = iMid;
          else
            i1 = iMid + 1;
        }

        return this.interpolate(i1, input[i1 - 1], _t, input[i1]);
      }

      /**
       * Interpolates between the input/output buffer segment `[_i1 - 1, _i1]`.
       * @param _i1 - The index of the right-hand keyframe.
       * @param _t0 - The left-hand input value. input[_i1 - 1]
       * @param _t - The value to interpolate at. Between _t0 and _t1.
       * @param _t1 - The right-hand input value. input[_i1]
       */
      public abstract interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array;
    }

    export class AnimationInterpolantConstant extends AnimationInterpolant {
      public override interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array {
        const stride: number = this.elementSize;
        const output: Float32Array = this.output;
        const result: Float32Array = this.result;

        const offset0: number = (_i1 - 1) * stride;

        for (let i: number = 0; i < stride; i++)
          result[i] = output[offset0 + i];

        return result;
      }
    }

    export class AnimationInterpolantLinear extends AnimationInterpolant {
      public override interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array {
        const stride: number = this.elementSize;
        const output: Float32Array = this.output;
        const result: Float32Array = this.result;

        const offset1: number = _i1 * stride;
        const offset0: number = offset1 - stride;

        const weight1: number = (_t - _t0) / (_t1 - _t0);
        const weight0: number = 1 - weight1;

        for (let i: number = 0; i < stride; i++)
          result[i] = output[offset0 + i] * weight0 + output[offset1 + i] * weight1;

        return result;
      }
    }

    export class AnimationInterpolantQuaternionLinear extends AnimationInterpolant {
      public override interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array {
        const stride: number = this.elementSize;
        const output: Float32Array = this.output;
        const result: Float32Array = this.result;
        const offset1: number = _i1 * stride;
        const offset0: number = offset1 - stride;

        return Quaternion.SLERP_ARRAY(output, offset0, output, offset1, (_t - _t0) / (_t1 - _t0), result, 0);
      }
    }

    export class AnimationInterpolantCubic extends AnimationInterpolant {
      /**
       * The stride of the elements in the output array, which is the size of one element multiplied by 3 (inTangent, element, outTangent).
       */
      public elementStride: number;

      public constructor(_times: Float32Array, _output: Float32Array, _elementSize: number, _result?: Float32Array) {
        super(_times, _output, _elementSize, _result);
        this.elementStride = _elementSize * 3;
      }

      public override interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array {
        const elementStride: number = this.elementStride;
        const stride: number = this.elementSize;
        const output: Float32Array = this.output; // output is in format [inTangent0, element0, outTangent0, inTangent1, ...]
        const result: Float32Array = this.result;

        const t: number = (_t - _t0) / (_t1 - _t0);
        const t2: number = t * t;
        const t3: number = t2 * t;

        const h00: number = 2 * t3 - 3 * t2 + 1;
        const h10: number = t3 - 2 * t2 + t;
        const h01: number = -2 * t3 + 3 * t2;
        const h11: number = t3 - t2;

        const offsetV1: number = _i1 * elementStride + stride;
        const offsetV0: number = offsetV1 - elementStride;
        const offsetM0: number = offsetV0 + stride;
        const offsetM1: number = offsetV1 - stride;

        for (let i: number = 0; i < stride; i++) {
          const v0: number = output[offsetV0 + i];
          const m0: number = output[offsetM0 + i];
          const v1: number = output[offsetV1 + i];
          const m1: number = output[offsetM1 + i];

          result[i] = h00 * v0 + h10 * m0 + h01 * v1 + h11 * m1;
        }

        return result;
      }
    }

    export class AnimationInterpolantQuaternionCubic extends AnimationInterpolantCubic {
      public override interpolate(_i1: number, _t0: number, _t: number, _t1: number): Float32Array { // TODO: take short path
        const result: Float32Array = super.interpolate(_i1, _t0, _t, _t1);
        return Quaternion.NORMALIZE_ARRAY(result, 0, result, 0);
      }
    }
  }
}