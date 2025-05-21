namespace FudgeCore {
  export namespace AnimationSystem {
    export enum ANIMATION_TRACK_TYPE {
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
    export class AnimationTrack {
      public path: string;
      public values: Float32Array; // TODO: could use an array of arrays for simplicity e.g. [[x, y, z], [x, y, z], ...] instead of [x, y, z, x, y, z, ...], but flat array is faster...
      public times: Float32Array;
      public type: ANIMATION_TRACK_TYPE;
      public interpolation: ANIMATION_INTERPOLATION;

      public constructor(_path: string, _times: Float32Array, _values: Float32Array, _type: ANIMATION_TRACK_TYPE, _interpolation: ANIMATION_INTERPOLATION) {
        this.path = _path;
        this.values = _values;
        this.times = _times;
        this.type = _type;
        this.interpolation = _interpolation;
      }

      public getValueSize(): number {
        return this.values.length / this.times.length;
      }

      public createInterpolant(): AnimationInterpolant {
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.CONSTANT:
            return new AnimationInterpolantConstant(this.times, this.values, this.getValueSize());
          case ANIMATION_INTERPOLATION.LINEAR:
            if (this.type === ANIMATION_TRACK_TYPE.QUATERNION)
              return new AnimationInterpolantQuaternionLinear(this.times, this.values, this.getValueSize());
            else
              return new AnimationInterpolantLinear(this.times, this.values, this.getValueSize());
          case ANIMATION_INTERPOLATION.CUBIC:
            if (this.type === ANIMATION_TRACK_TYPE.QUATERNION)
              return new AnimationInterpolantQuaternionCubic(this.times, this.values, this.getValueSize() / 3);
            else
              return new AnimationInterpolantCubic(this.times, this.values, this.getValueSize() / 3);
          default:
            throw new Error(`${AnimationTrack.name}: Interpolation ${this.interpolation} not supported`);
        }

      }
    }
  }
}