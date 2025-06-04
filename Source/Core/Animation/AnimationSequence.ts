namespace FudgeCore {

  export interface MutatorVector3 {
    x?: number;
    y?: number;
    z?: number;
  }

  export interface MutatorQuaternion {
    x: number;
    y: number;
    z: number;
    w: number;
  }

  export type AnimationReturnType = number | MutatorVector3 | MutatorQuaternion;

  export type AnimationClassType<T extends AnimationReturnType = AnimationReturnType> =
    T extends number ? NumberConstructor :
    T extends MutatorQuaternion ? typeof Quaternion :
    T extends MutatorVector3 ? typeof Vector3 :
    never;

  /**
   * A sequence of {@link AnimationKey}s that is mapped to an attribute of a {@link Node} or its {@link Component}s inside the {@link Animation}.
   * Provides functions to modify said keys
   * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022-2025
   */
  export class AnimationSequence<T extends AnimationReturnType = AnimationReturnType, C extends AnimationClassType<T> = AnimationClassType<T>> extends Mutable implements Serializable {
    protected keys: AnimationKey<T>[];

    #classType: C;

    public constructor(_keys: AnimationKey<T>[] = [], _valueType: C) {
      super();
      this.keys = _keys;
      this.keys.sort(AnimationKey.compare);
      this.classType = _valueType;
      this.regenerateFunctions();
    }

    public get length(): number {
      return this.keys.length;
    }

    public get classType(): C {
      return this.#classType;
    }

    private set classType(_type: C) {
      this.#classType = _type;
    }

    /**
     * Evaluates the sequence at the given point in time.
     * @param _time the point in time at which to evaluate the sequence in milliseconds.
     * @returns the value of the sequence at the given time. undefined if there are no keys.
     */
    public evaluate<T extends AnimationReturnType>(_time: number, _out?: T): T {
      const keys: AnimationKey[] = this.keys;

      // if (this.keys.length == 0)
      //   return undefined; //TODO: shouldn't return 0 but something indicating no change, like null. probably needs to be changed in Node as well to ignore non-numeric values in the applyAnimation function
      // if (this.keys.length == 1 || this.keys[0].time >= _time)
      //   return this.keys[0].value;

      if (keys.length == 1)
        return <T>keys[0].functionOut.evaluate(_time, _out);

      // Binary search
      let iNext: number = 0, iRight: number = keys.length - 1, iMid: number;

      while (iNext < iRight) {
        iMid = (iNext + iRight) >>> 1;
        if (_time < keys[iMid].time)
          iRight = iMid;
        else
          iNext = iMid + 1;
      }

      const key: AnimationKey = keys[iNext - 1];
      return <T>key.functionOut.evaluate(_time, _out);
    }

    /**
     * Adds a new key to the sequence.
     * @param _key the key to add
     */
    public addKey(_key: AnimationKey<T>): void {
      this.keys.push(_key);
      this.keys.sort(AnimationKey.compare);
      this.regenerateFunctions();
    }

    /**
     * Modifys a given key in the sequence.
     * @param _key the key to add
     */
    public modifyKey(_key: AnimationKey<T>, _time?: number, _value?: T): void {
      if (_time != null)
        _key.time = _time;
      if (_value != null)
        _key.value = _value;
      this.keys.sort(AnimationKey.compare);
      this.regenerateFunctions();
    }

    /**
     * Removes a given key from the sequence.
     * @param _key the key to remove
     */
    public removeKey(_key: AnimationKey<T>): void {
      for (let i: number = 0; i < this.keys.length; i++) {
        if (this.keys[i] == _key) {
          this.keys.splice(i, 1);
          this.regenerateFunctions();
          return;
        }
      }
    }

    /**
     * Find a key in the sequence exactly matching the given time.
     */
    public findKey(_time: number): AnimationKey<T> {
      for (let key of this.keys)
        if (key.time == _time)
          return key;
      return null;
    }

    /**
     * Removes the Animation Key at the given index from the keys.
     * @param _index the zero-based index at which to remove the key
     * @returns the removed AnimationKey if successful, null otherwise.
     */
    public removeKeyAtIndex(_index: number): AnimationKey<T> {
      if (_index < 0 || _index >= this.keys.length) {
        return null;
      }
      let ak: AnimationKey<T> = this.keys[_index];
      this.keys.splice(_index, 1);
      this.regenerateFunctions();
      return ak;
    }

    /**
     * Gets a key from the sequence at the desired index.
     * @param _index the zero-based index at which to get the key
     * @returns the AnimationKey at the index if it exists, null otherwise.
     */
    public getKey(_index: number): AnimationKey<T> {
      if (_index < 0 || _index >= this.keys.length)
        return null;
      return this.keys[_index];
    }

    /**
     * Returns this sequence's keys. This is not a copy, but the actual array used internally. Handle with care!
     * Used by Editor.
     */
    public getKeys(): AnimationKey<T>[] {
      return this.keys;
    }

    public serialize(): Serialization {
      let s: Serialization = {
        keys: [],
        classType: this.classType.name,
        animationSequence: true
      };
      for (let i: number = 0; i < this.keys.length; i++) {
        s.keys[i] = this.keys[i].serialize();
      }
      return s;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (_serialization.classType != null)
        this.classType = <C>Reflect.get(FudgeCore, _serialization.classType);

      this.classType ??= <C><unknown>Number;
      for (let i: number = 0; i < _serialization.keys.length; i++) {
        // this.keys.push(<AnimationKey>Serializer.deserialize(_serialization.keys[i]));
        let k: AnimationKey<General> = new AnimationKey();
        await k.deserialize(_serialization.keys[i]);
        this.keys[i] = k;
      }

      this.regenerateFunctions();
      return this;
    }

    /**
     * Utility function that (re-)generates all functions in the sequence.
     */
    protected regenerateFunctions(_keys: AnimationKey<T>[] = this.keys): void {
      if (_keys.length == 0)
        return;

      if (!this.classType)
        throw new Error(`${this.constructor.name}: No key type specified. Cannot generate animation functions.`);

      const functionType: new (..._args: ConstructorParameters<typeof AnimationFunction>) => AnimationFunction<T> = Reflect.get(FudgeCore, AnimationFunction.name + this.classType.name);

      for (let i: number = 0; i < _keys.length; i++) {
        const key: AnimationKey<T> = _keys[i];
        const keyNext: AnimationKey<T> = _keys[i + 1];
        key.functionOut = new functionType(key, keyNext);
      }
    }

    protected reduceMutator(_mutator: Mutator): void { /* */ }
  }
}