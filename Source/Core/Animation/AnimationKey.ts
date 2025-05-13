namespace FudgeCore {
  export enum ANIMATION_INTERPOLATION {
    CONSTANT,
    LINEAR,
    CUBIC
  }

  /**
   * Holds information about continous points in time their accompanying values as well as their slopes. 
   * Also holds a reference to the {@link AnimationFunction}s that come in and out of the sides. 
   * The {@link AnimationFunction}s are handled by the {@link AnimationSequence}s.
   * If the property constant is true, the value does not change and wil not be interpolated between this and the next key in a sequence
   * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2025
   */
  export class AnimationKey<T extends AnimationReturnType = AnimationReturnType> extends Mutable implements Serializable {
    /**Don't modify this unless you know what you're doing.*/
    public functionOut: AnimationFunction<T>;

    #interpolation: ANIMATION_INTERPOLATION;
    #time: number;
    #value: T;
    #slopeIn: T;
    #slopeOut: T;

    public constructor(_time: number = 0, _value?: T, _interpolation: ANIMATION_INTERPOLATION = ANIMATION_INTERPOLATION.CUBIC, _slopeIn?: T, _slopeOut?: T) {
      super();
      this.#time = _time;
      this.#value = _value;
      this.#interpolation = _interpolation;
      this.#slopeIn = _slopeIn;
      this.#slopeOut = _slopeOut;
      if (typeof this.#value == "object") {
        this.#slopeIn ??= <T>{};
        this.#slopeOut ??= <T>{};
        for (const key of Object.keys(this.#value)) {
          Reflect.set(<object>this.#slopeIn, key, 0);
          Reflect.set(<object>this.#slopeOut, key, 0);
        }
      } else if (typeof this.#value == "number") {
        this.#slopeIn ??= <T>0;
        this.#slopeOut ??= <T>0;
      }
    }

    /**
     * Static comparation function to use in an array sort function to sort the keys by their time.
     * @param _a the animation key to check
     * @param _b the animation key to check against
     * @returns >0 if a>b, 0 if a=b, <0 if a<b
     */
    public static compare<T extends AnimationReturnType, K extends AnimationKey<T>>(_a: K, _b: K): number {
      return _a.time - _b.time;
    }

    public get time(): number {
      return this.#time;
    }

    public set time(_time: number) {
      this.#time = _time;
      this.functionOut.calculate();
    }

    public get value(): T {
      return this.#value;
    }

    public set value(_value: T) {
      this.#value = _value;
      this.functionOut.calculate();
    }

    public get interpolation(): ANIMATION_INTERPOLATION {
      return this.#interpolation;
    }

    public set interpolation(_interpolation: ANIMATION_INTERPOLATION) {
      this.#interpolation = _interpolation;
      this.functionOut.calculate();
    }

    public get slopeIn(): T {
      return this.#slopeIn;
    }

    public set slopeIn(_slope: T) {
      this.#slopeIn = _slope;
    }

    public get slopeOut(): T {
      return this.#slopeOut;
    }

    public set slopeOut(_slope: T) {
      this.#slopeOut = _slope;
      this.functionOut.calculate();
    }

    //#region transfer
    public serialize(): Serialization {
      let serialization: Serialization = {};
      serialization.time = this.#time;
      serialization.value = this.#value;
      serialization.interpolation = this.#interpolation;
      serialization.slopeIn = this.#slopeIn;
      serialization.slopeOut = this.#slopeOut;
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.#time = _serialization.time;
      this.#value = _serialization.value;
      this.#interpolation = _serialization.interpolation;
      this.#slopeIn = _serialization.slopeIn;
      this.#slopeOut = _serialization.slopeOut;

      return this;
    }

    public getMutator(): Mutator {
      return this.serialize();
    }

    protected reduceMutator(_mutator: Mutator): void {
      //
    }
    //#endregion
  }
}