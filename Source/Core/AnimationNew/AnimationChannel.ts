namespace FudgeCore {
  export namespace AnimationSystem {
    export enum ANIMATION_PROPERTY_TYPE {
      BOOLEAN = "boolean",
      NUMBER = "number",
      STRING = "string",
      VECTOR = "vector",
      QUATERNION = "quaternion",
      COLOR = "color"
    }

    /**
     * Stores the path and data to animate a single property within a node hierarchy.
     */
    export class AnimationChannel implements Serializable {
      public path: string;
      public times: Float32Array;
      public values: Float32Array; // TODO: could use an array of arrays for simplicity e.g. [[x, y, z], [x, y, z], ...] instead of [x, y, z, x, y, z, ...], but flat array is faster...
      public type: ANIMATION_PROPERTY_TYPE;
      public interpolation: ANIMATION_INTERPOLATION;

      public constructor(_path?: string, _times?: Float32Array, _values?: Float32Array, _type?: ANIMATION_PROPERTY_TYPE, _interpolation?: ANIMATION_INTERPOLATION) {
        this.path = _path;
        this.times = _times;
        this.values = _values;
        this.type = _type;
        this.interpolation = _interpolation;
      }

      public getValueSize(): number {
        let size: number = this.values.length / this.times.length;
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CUBIC:
            size /= 3; 
            break;
        }

        return size;
      }

      public createInterpolant(): AnimationInterpolant {
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CONSTANT:
            return new AnimationInterpolantConstant(this.times, this.values, this.getValueSize());
          case ANIMATION_INTERPOLATION.LINEAR:
            if (this.type === ANIMATION_PROPERTY_TYPE.QUATERNION)
              return new AnimationInterpolantQuaternionLinear(this.times, this.values, this.getValueSize());
            else
              return new AnimationInterpolantLinear(this.times, this.values, this.getValueSize());
          case ANIMATION_INTERPOLATION.CUBIC:
            if (this.type === ANIMATION_PROPERTY_TYPE.QUATERNION)
              return new AnimationInterpolantQuaternionCubic(this.times, this.values, this.getValueSize());
            else
              return new AnimationInterpolantCubic(this.times, this.values, this.getValueSize());
          default:
            throw new Error(`${AnimationChannel.name}: Interpolation ${this.interpolation} not supported`);
        }
      }

      public serialize(): SerializationOf<AnimationChannel> {
        const serialization: SerializationOf<AnimationChannel> = {
          path: this.path,
          times: Array.from(this.times),
          values: Array.from(this.values),
          type: this.type,
          interpolation: this.interpolation
        };

        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<AnimationChannel>): Promise<AnimationChannel> {
        this.path = _serialization.path;
        this.times = new Float32Array(_serialization.times);
        this.values = new Float32Array(_serialization.values);
        this.type = _serialization.type;
        this.interpolation = _serialization.interpolation;

        return this;
      }
    }
  }
}