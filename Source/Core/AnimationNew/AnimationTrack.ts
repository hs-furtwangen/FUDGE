namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Stores the path and data to animate a single property within a node hierarchy.
     */
    export class AnimationTrack {
      public path: string;
      public values: Float32Array;
      public times: Float32Array;
      public interpolation: ANIMATION_INTERPOLATION;

      public constructor(_path: string, _times: Float32Array, _values: Float32Array, _interpolation: ANIMATION_INTERPOLATION) {
        this.path = _path;
        this.values = _values;
        this.times = _times;
        this.interpolation = _interpolation;
      }

      public getValueSize(): number {
        return this.values.length / this.times.length;
      }

      public createInterpolant(): AnimationInterpolant {
        switch (this.interpolation) {
          case ANIMATION_INTERPOLATION.LINEAR:
            return new AnimationInterpolantLinear(this.times, this.values, this.getValueSize());
        }

        throw new Error(`${AnimationTrack.name}: Interpolation ${this.interpolation} not supported`);
      }
    }
  }
}