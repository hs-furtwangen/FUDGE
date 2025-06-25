namespace FudgeCore {

  /**
   * Calculates the values between {@link AnimationKey}s.
   * Represented internally by a cubic function (`f(x) = ax³ + bx² + cx + d`). 
   * Only needs to be recalculated when the keys change, so at runtime it should only be calculated once.
   * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2025
   */
  export abstract class AnimationFunction<T extends AnimationReturnType = AnimationReturnType> {
    protected a: T;
    protected b: T;
    protected c: T;
    protected d: T;

    // TODO: think about removing these as in most cases changes to any key entail a recalculation of the whole sequence i.e. all functions have to be recreated
    // or maybe merge function and key into one class?
    protected keyIn: AnimationKey<T>;
    protected keyOut: AnimationKey<T>;

    public constructor(_keyIn: AnimationKey<T>, _keyOut: AnimationKey<T> = null) {
      this.keyIn = _keyIn;
      this.keyOut = _keyOut;
      this.calculate();
    }

    /**
     * Returns the parameter values of this cubic function. `f(x) = ax³ + bx² + cx + d`
     * Used by editor.
     */
    public getParameters(): { a: T; b: T; c: T; d: T } {
      return { a: this.a, b: this.b, c: this.c, d: this.d };
    }

    /**
     * Calculates the value of the function at the given time.
     * @param _time the point in time at which to evaluate the function in milliseconds. Will be corrected for offset internally.
     * @returns the value at the given time
     */
    public abstract evaluate(_time: number, _mutatorOut: AnimationReturnType): T;

    /**
     * (Re-)Calculates the parameters of the cubic function.
     * See https://math.stackexchange.com/questions/3173469/calculate-cubic-equation-from-two-points-and-two-slopes-variably
     * and https://jirkadelloro.github.io/FUDGE/Documentation/Logs/190410_Notizen_LS
     */
    public abstract calculate(): void;
  }

  export class AnimationFunctionNumber extends AnimationFunction<number> {
    public evaluate(_time: number): number {
      _time -= this.keyIn.time;
      let time2: number = _time * _time;
      let time3: number = time2 * _time;
      return this.a * time3 + this.b * time2 + this.c * _time + this.d;
    }

    public calculate(): void {
      this.d = this.c = this.b = this.a = 0;

      if (!this.keyIn)
        return;

      this.d = this.keyIn.value;

      if (!this.keyOut || this.keyIn.interpolation == ANIMATION_INTERPOLATION.CONSTANT)
        return;

      let x1: number = this.keyOut.time - this.keyIn.time;

      if (this.keyIn.interpolation == ANIMATION_INTERPOLATION.LINEAR) {
        this.c = (this.keyOut.value - this.keyIn.value) / x1;
        return;
      }

      this.c = this.keyIn.slopeOut;
      this.a = (-x1 * (this.keyIn.slopeOut + this.keyOut.slopeIn) - 2 * this.keyIn.value + 2 * this.keyOut.value) / -Math.pow(x1, 3);
      this.b = (this.keyOut.slopeIn - this.keyIn.slopeOut - 3 * this.a * Math.pow(x1, 2)) / (2 * x1);
    }
  }

  export class AnimationFunctionVector3 extends AnimationFunction<MutatorVector3> {
    public override evaluate(_time: number, _out: MutatorVector3 = {}): MutatorVector3 {
      _time -= this.keyIn.time;
      let time2: number = _time * _time;
      let time3: number = time2 * _time;

      _out.x = this.a.x * time3 + this.b.x * time2 + this.c.x * _time + this.d.x;
      _out.y = this.a.y * time3 + this.b.y * time2 + this.c.y * _time + this.d.y;
      _out.z = this.a.z * time3 + this.b.z * time2 + this.c.z * _time + this.d.z;
      return _out;
    }

    public calculate(): void {
      this.a = { x: 0, y: 0, z: 0 };
      this.b = { x: 0, y: 0, z: 0 };
      this.c = { x: 0, y: 0, z: 0 };
      this.d = { x: 0, y: 0, z: 0 };

      if (!this.keyIn)
        return;

      Object.assign(this.d, this.keyIn.value);

      if (!this.keyOut || this.keyIn.interpolation == ANIMATION_INTERPOLATION.CONSTANT)
        return;

      let x1: number = this.keyOut.time - this.keyIn.time;

      if (this.keyIn.interpolation == ANIMATION_INTERPOLATION.LINEAR) {
        this.c.x = (this.keyOut.value.x - this.keyIn.value.x) / x1;
        this.c.y = (this.keyOut.value.y - this.keyIn.value.y) / x1;
        this.c.z = (this.keyOut.value.z - this.keyIn.value.z) / x1;

        return;
      }

      Object.assign(this.c, this.keyIn.slopeOut);

      this.a.x = (-x1 * (this.keyIn.slopeOut.x + this.keyOut.slopeIn.x) - 2 * this.keyIn.value.x + 2 * this.keyOut.value.x) / -Math.pow(x1, 3);
      this.a.y = (-x1 * (this.keyIn.slopeOut.y + this.keyOut.slopeIn.y) - 2 * this.keyIn.value.y + 2 * this.keyOut.value.y) / -Math.pow(x1, 3);
      this.a.z = (-x1 * (this.keyIn.slopeOut.z + this.keyOut.slopeIn.z) - 2 * this.keyIn.value.z + 2 * this.keyOut.value.z) / -Math.pow(x1, 3);

      this.b.x = (this.keyOut.slopeIn.x - this.keyIn.slopeOut.x - 3 * this.a.x * Math.pow(x1, 2)) / (2 * x1);
      this.b.y = (this.keyOut.slopeIn.y - this.keyIn.slopeOut.y - 3 * this.a.y * Math.pow(x1, 2)) / (2 * x1);
      this.b.z = (this.keyOut.slopeIn.z - this.keyIn.slopeOut.z - 3 * this.a.z * Math.pow(x1, 2)) / (2 * x1);
    }
  }

  export class AnimationFunctionQuaternion extends AnimationFunction<MutatorQuaternion> {
    public evaluate(_time: number, _out: MutatorQuaternion = <MutatorQuaternion>{}): MutatorQuaternion {
      const keyIn: AnimationKey<MutatorQuaternion> = this.keyIn;

      switch (keyIn.interpolation) {
        case ANIMATION_INTERPOLATION.CONSTANT:
          Object.assign(_out, keyIn.value);
          
          return _out;
        case ANIMATION_INTERPOLATION.LINEAR:
          const keyOut: AnimationKey<MutatorQuaternion> = this.keyOut;
          const timeStart: number = keyIn.time;
          _time = (_time - timeStart) / (keyOut.time - timeStart);

          return Quaternion.SLERP(keyIn.value, keyOut.value, _time, _out);
        case ANIMATION_INTERPOLATION.CUBIC:
          _time -= keyIn.time;
          const time2: number = _time * _time;
          const time3: number = time2 * _time;

          _out.x = this.a.x * time3 + this.b.x * time2 + this.c.x * _time + this.d.x;
          _out.y = this.a.y * time3 + this.b.y * time2 + this.c.y * _time + this.d.y;
          _out.z = this.a.z * time3 + this.b.z * time2 + this.c.z * _time + this.d.z;
          _out.w = this.a.w * time3 + this.b.w * time2 + this.c.w * _time + this.d.w;
          return _out;
      }
    }

    public calculate(): void {
      this.a = { x: 0, y: 0, z: 0, w: 0 };
      this.b = { x: 0, y: 0, z: 0, w: 0 };
      this.c = { x: 0, y: 0, z: 0, w: 0 };
      this.d = { x: 0, y: 0, z: 0, w: 0 };

      if (!this.keyIn)
        return;

      Object.assign(this.d, this.keyIn.value);

      if (!this.keyOut || this.keyIn.interpolation == ANIMATION_INTERPOLATION.CONSTANT)
        return;

      let x1: number = this.keyOut.time - this.keyIn.time;

      if (this.keyIn.interpolation == ANIMATION_INTERPOLATION.LINEAR) {
        this.c.x = (this.keyOut.value.x - this.keyIn.value.x) / x1;
        this.c.y = (this.keyOut.value.y - this.keyIn.value.y) / x1;
        this.c.z = (this.keyOut.value.z - this.keyIn.value.z) / x1;
        this.c.w = (this.keyOut.value.w - this.keyIn.value.w) / x1;

        return;
      }

      Object.assign(this.c, this.keyIn.slopeOut);

      this.a.x = (-x1 * (this.keyIn.slopeOut.x + this.keyOut.slopeIn.x) - 2 * this.keyIn.value.x + 2 * this.keyOut.value.x) / -Math.pow(x1, 3);
      this.a.y = (-x1 * (this.keyIn.slopeOut.y + this.keyOut.slopeIn.y) - 2 * this.keyIn.value.y + 2 * this.keyOut.value.y) / -Math.pow(x1, 3);
      this.a.z = (-x1 * (this.keyIn.slopeOut.z + this.keyOut.slopeIn.z) - 2 * this.keyIn.value.z + 2 * this.keyOut.value.z) / -Math.pow(x1, 3);
      this.a.w = (-x1 * (this.keyIn.slopeOut.w + this.keyOut.slopeIn.w) - 2 * this.keyIn.value.w + 2 * this.keyOut.value.w) / -Math.pow(x1, 3);

      this.b.x = (this.keyOut.slopeIn.x - this.keyIn.slopeOut.x - 3 * this.a.x * Math.pow(x1, 2)) / (2 * x1);
      this.b.y = (this.keyOut.slopeIn.y - this.keyIn.slopeOut.y - 3 * this.a.y * Math.pow(x1, 2)) / (2 * x1);
      this.b.z = (this.keyOut.slopeIn.z - this.keyIn.slopeOut.z - 3 * this.a.z * Math.pow(x1, 2)) / (2 * x1);
      this.b.w = (this.keyOut.slopeIn.w - this.keyIn.slopeOut.w - 3 * this.a.w * Math.pow(x1, 2)) / (2 * x1);
    }
  }
}