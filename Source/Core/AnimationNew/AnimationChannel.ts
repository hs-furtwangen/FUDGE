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
      public targetPath: string;
      public input: Float32Array;
      public output: Float32Array;
      public interpolation: ANIMATION_INTERPOLATION;

      public constructor(_targetPath?: string, _input?: Float32Array, _output?: Float32Array, _interpolation?: ANIMATION_INTERPOLATION) {
        this.targetPath = _targetPath;
        this.input = _input;
        this.output = _output;
        this.interpolation = _interpolation;
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

      public createInterpolant(_result?: Float32Array): AnimationInterpolant {
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CONSTANT:
            return this.createInterpolantConstant(_result);
          case ANIMATION_INTERPOLATION.LINEAR:
            return this.createInterpolantLinear(_result);
          case ANIMATION_INTERPOLATION.CUBIC:
            return this.createInterpolantCubic(_result);
          default:
            throw new Error("Unknown interpolation type: " + this.interpolation);
        }
      }

      public serialize(): SerializationOf<AnimationChannel> {
        const serialization: SerializationOf<AnimationChannel> = {
          targetPath: this.targetPath,
          input: Array.from(this.input),
          output: Array.from(this.output),
          interpolation: this.interpolation
        };

        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<AnimationChannel>): Promise<AnimationChannel> {
        this.targetPath = _serialization.targetPath;
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

      protected createInterpolantConstant(_result?: Float32Array): AnimationInterpolant {
        return new AnimationInterpolantConstant(this.input, this.output, this.getElementSize(), _result);
      }

      protected createInterpolantLinear(_result?: Float32Array): AnimationInterpolant {
        return new AnimationInterpolantLinear(this.input, this.output, this.getElementSize(), _result);
      }

      protected createInterpolantCubic(_result?: Float32Array): AnimationInterpolant {
        return new AnimationInterpolantCubic(this.input, this.output, this.getElementSize(), _result);
      }
    }

    export class AnimationChannelNumber extends AnimationChannel { }

    export class AnimationChannelVector extends AnimationChannel { }

    export class AnimationChannelColor extends AnimationChannel { }

    export class AnimationChannelQuaternion extends AnimationChannel {
      protected override createInterpolantLinear(_result?: Float32Array): AnimationInterpolant {
        return new AnimationInterpolantQuaternionLinear(this.input, this.output, this.getElementSize(), _result);
      }

      protected override createInterpolantCubic(_result?: Float32Array): AnimationInterpolant {
        return new AnimationInterpolantQuaternionCubic(this.input, this.output, this.getElementSize(), _result);
      }
    }
  }
}