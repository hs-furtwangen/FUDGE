namespace FudgeCore {
  export namespace AnimationSystem {

    /**
     * Stores the path and keyframe data to animate a single property within a node hierarchy.
     * The keyframes are stored in an input/output buffer pair: a set of scalar values representing the timestamps; and a set of elements (scalar, vector, quaternion etc.) representing the animated property.
     * Interpolation between keyframes is defined by the set {@link ANIMATION_INTERPOLATION}. When used with {@link ANIMATION_INTERPOLATION.CUBIC cubic} interpolation, for each timestamp there must be three associated keyframe elements: in-tangent, property value, and out-tangent.
     * 
     * **Example vector3-input-output:**
     * 
     * `input: [t0, t1, ...]`
     * 
     * `output: [e0x, e0y, e0z, e1x, e1y, e1z, ...]`
     * 
     * **Example vector2-input-cubic-output:** in and out tangents (`a`, `b`) and elements (`e`) must be grouped within keyframes.
     * 
     * `input: [t0, t1, ...]`
     * 
     * `output: [a0x, a0y, e0x, e0y, b0x, b0y, a1x, a1y, e1x, e1y, b1x, b1y, ...]`
     */
    export abstract class AnimationChannel implements Serializable {
      public path: string;
      public input: Float32Array;
      public output: Float32Array;
      public interpolation: ANIMATION_INTERPOLATION;

      public constructor(_path?: string, _input?: Float32Array, _output?: Float32Array, _interpolation?: ANIMATION_INTERPOLATION) {
        this.path = _path;
        this.input = _input;
        this.output = _output;
        this.interpolation = _interpolation;

        // switch (this.interpolation) {
        //   case ANIMATION_INTERPOLATION.CONSTANT:
        //     this.interpolate = this.interpolateConstant;
        //     break;
        //   case ANIMATION_INTERPOLATION.LINEAR:
        //     this.interpolate = this.interpolateLinear;
        //     break;
        //   case ANIMATION_INTERPOLATION.CUBIC:
        //     this.interpolate = this.interpolateCubic;
        //     break;
        // }
      }

      /**
       * Returns the size of a single element in the output buffer, which is the number of values per element. e.g. 3 for a vector3, 4 for a quaternion, 1 for a scalar.
       */
      public getElementSize(): number {
        let size: number = this.output.length / this.input.length;
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CUBIC:
            size /= 3;
            break;
        }

        return size;
      }

      // /**
      //  * Evaluates the interpolant at a given time.
      //  */
      // public evaluate(_time: number, _out: Float32Array): void {
      //   const times: Float32Array = this.input;
      //   let i1: number = 0;
      //   let iRight: number = times.length - 1;
      //   let iMid: number;

      //   // Binary search for the correct time interval
      //   while (i1 < iRight) {
      //     iMid = (i1 + iRight) >>> 1;
      //     if (_time < times[iMid])
      //       iRight = iMid;
      //     else
      //       i1 = iMid + 1;
      //   }

      //   const timeStart: number = times[i1 - 1];
      //   const timeEnd: number = times[i1];
      //   const t: number = (_time - timeStart) / (timeEnd - timeStart);

      //   return this.interpolate(i1, t, _out);
      // }

      public createInterpolant(): AnimationInterpolant {
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CONSTANT:
            return this.createInterpolantConstant();
          case ANIMATION_INTERPOLATION.LINEAR:
            return this.createInterpolantLinear();
          case ANIMATION_INTERPOLATION.CUBIC:
            return this.createInterpolantCubic();
          default:
            throw new Error("Unknown interpolation type: " + this.interpolation);
        }
      }

      public serialize(): SerializationOf<AnimationChannel> {
        const serialization: SerializationOf<AnimationChannel> = {
          path: this.path,
          input: Array.from(this.input),
          output: Array.from(this.output),
          interpolation: this.interpolation
        };

        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<AnimationChannel>): Promise<AnimationChannel> {
        this.path = _serialization.path;
        this.input = new Float32Array(_serialization.input);
        this.output = new Float32Array(_serialization.output);
        this.interpolation = _serialization.interpolation;

        return this;
      }

      /**
       * Interpolates between keyframe[i-1] and keyframe[i] using the given t value in the range [0, 1].
       */
      public interpolate(_i1: number, _t: number, _out: Float32Array): void {
        return null;
      }

      protected createInterpolantConstant(): AnimationInterpolant {
        return new AnimationInterpolantConstant(this.input, this.output, this.getElementSize());
      }

      protected createInterpolantLinear(): AnimationInterpolant {
        return new AnimationInterpolantLinear(this.input, this.output, this.getElementSize());
      }

      protected createInterpolantCubic(): AnimationInterpolant {
        return new AnimationInterpolantCubic(this.input, this.output, this.getElementSize());
      }

      // protected interpolateConstant(_i1: number, _t: number, _out: Float32Array): void {
      //   const stride: number = _out.length;
      //   const output: Float32Array = this.output;

      //   const offset0: number = (_i1 - 1) * stride;

      //   for (let i: number = 0; i < stride; i++)
      //     _out[i] = output[offset0 + i];
      // }

      // protected interpolateLinear(_i1: number, _t: number, _out: Float32Array): void {
      //   const stride: number = _out.length;
      //   const output: Float32Array = this.output;

      //   const offset1: number = _i1 * stride;
      //   const offset0: number = offset1 - stride;

      //   for (let i: number = 0; i < stride; i++) {
      //     const v0: number = output[offset0 + i];
      //     const v1: number = output[offset1 + i];
      //     _out[i] = v0 + (v1 - v0) * _t;
      //   }
      // }

      // protected interpolateCubic(_i1: number, _t: number, _out: Float32Array): void {
      //   const stride: number = _out.length;
      //   const elementStride: number = _out.length * 3;
      //   const output: Float32Array = this.output; // output is in format [inTangent0, value0, outTangent0, inTangent1, ...]

      //   const t2: number = _t * _t;
      //   const t3: number = t2 * _t;

      //   const h00: number = 2 * t3 - 3 * t2 + 1;
      //   const h10: number = t3 - 2 * t2 + _t;
      //   const h01: number = -2 * t3 + 3 * t2;
      //   const h11: number = t3 - t2;

      //   const offsetV1: number = _i1 * elementStride + stride;
      //   const offsetV0: number = offsetV1 - elementStride;
      //   const offsetM0: number = offsetV0 + stride;
      //   const offsetM1: number = offsetV1 - stride;

      //   for (let i: number = 0; i < stride; i++) {
      //     const v0: number = output[offsetV0 + i];
      //     const m0: number = output[offsetM0 + i];
      //     const v1: number = output[offsetV1 + i];
      //     const m1: number = output[offsetM1 + i];

      //     _out[i] = h00 * v0 + h10 * m0 + h01 * v1 + h11 * m1;
      //   }
      // }
    }

    export class AnimationChannelNumber extends AnimationChannel { }

    export class AnimationChannelVector extends AnimationChannel { }

    export class AnimationChannelColor extends AnimationChannel { }

    export class AnimationChannelQuaternion extends AnimationChannel {
      protected override createInterpolantLinear(): AnimationInterpolant {
        return new AnimationInterpolantQuaternionLinear(this.input, this.output, this.getElementSize());
      }

      protected override createInterpolantCubic(): AnimationInterpolant {
        return new AnimationInterpolantQuaternionCubic(this.input, this.output, this.getElementSize());
      }

      // protected override interpolateLinear(_i1: number, _t: number, _out: Float32Array): void {
      //   const stride: number = _out.length;
      //   const values: Float32Array = this.output;
      //   const offset1: number = _i1 * stride;
      //   const offset0: number = offset1 - stride;

      //   Quaternion.SLERP_ARRAY(values, offset0, values, offset1, _t, _out, 0);
      // }

      // protected override interpolateCubic(_i1: number, _t: number, _out: Float32Array): void { // TODO: take short path
      //   super.interpolateCubic(_i1, _t, _out);
      //   Quaternion.NORMALIZE_ARRAY(_out, 0, _out, 0);
      // }
    }
  }
}