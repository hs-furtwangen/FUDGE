namespace FudgeCore {

  export type AnimationValueType<T extends number | Vector3 | Quaternion> =
    T extends number ? NumberConstructor :
      T extends Vector3 ? typeof Vector3 :
        T extends Quaternion ? typeof Quaternion :
          never;

  /**
   * A sequence of {@link AnimationKey}s that is mapped to an attribute of a {@link Node} or its {@link Component}s inside the {@link Animation}.
   * Provides functions to modify said keys
   * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022
   */
  export class AnimationSequence<T extends number | Vector3 | Quaternion> extends Mutable implements Serializable {
    protected keys: AnimationKey<T>[];

    #valueType: AnimationValueType<T>;

    public constructor(_keys: AnimationKey<T>[] = [], _valueType: AnimationValueType<T>) {
      super();
      this.keys = _keys;
      this.keys.sort(AnimationKey.compare);
      this.valueType = _valueType;
      this.regenerateFunctions();
    }

    public get length(): number {
      return this.keys.length;
    }

    public get valueType(): AnimationValueType<T> {
      return this.#valueType;
    }

    private set valueType(_type: AnimationValueType<T>) {
      this.#valueType = _type;
    }

    /**
     * Evaluates the sequence at the given point in time.
     * @param _time the point in time at which to evaluate the sequence in milliseconds.
     * @returns the value of the sequence at the given time. undefined if there are no keys.
     */
    public evaluate(_time: number, _frame?: number): T {
      let iLeft: number = 0, iRight: number = this.keys.length - 1, iMid: number;
      while (iLeft <= iRight) {
        iMid = Math.floor((iLeft + iRight) / 2);
        if (this.keys[iMid].time < _time)
          iLeft = iMid + 1;
        else
          iRight = iMid - 1;
      }
      const key: AnimationKey<T> = this.keys[iRight] ?? this.keys[iLeft];
      return key?.functionOut.evaluate(_time);


      // if (this.keys.length == 0)
      //   return undefined; //TODO: shouldn't return 0 but something indicating no change, like null. probably needs to be changed in Node as well to ignore non-numeric values in the applyAnimation function
      // if (this.keys.length == 1 || this.keys[0].time >= _time)
      //   return this.keys[0].value;


      // for (let i: number = 0; i < this.keys.length - 1; i++) {
      //   if (this.keys[i].time <= _time && _time < this.keys[i + 1].time) {
      //     return this.keys[i].functionOut.evaluate(_time);
      //   }
      //   // if (this.keys[i].time == _time)
      //   //   return this.keys[i].value;
      // }
      // return this.keys[this.keys.length - 1].value;
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
        keyType: this.valueType.name,
        animationSequence: true
      };
      for (let i: number = 0; i < this.keys.length; i++) {
        s.keys[i] = this.keys[i].serialize();
      }
      return s;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (_serialization.keyType != null)
        this.valueType = <AnimationValueType<T>>Reflect.get(FudgeCore, _serialization.keyType);

      this.valueType ??= <AnimationValueType<T>>Number;

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

      if (!this.valueType)
        throw new Error(`${this.constructor.name}: No key type specified. Cannot generate animation functions.`);

      const functionType: new (..._args: General[]) => AnimationFunction<T> = Reflect.get(FudgeCore, AnimationFunction.name + this.valueType.name);

      for (let i: number = 0; i < _keys.length; i++) {
        const key: AnimationKey<T> = _keys[i];
        const keyNext: AnimationKey<T> = _keys[i + 1];
        key.functionOut = new functionType(key, keyNext);
      }
    }

    protected reduceMutator(_mutator: Mutator): void { /* */ }
  }



  /**
   * A sequence of {@link AnimationKeyNumber}s sampled from an original sequence. In a sampled sequence, the keys are stored at indices corresponding to discrete frames in accordance with the {@link Animation}'s frames per second.
   * Keys from the original sequence may be referenced repeated times in a sampled sequence. Sampled sequences allow O(1) access to keys based on the desired frame. 
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class AnimationSequenceSampled<T extends number | Vector3 | Quaternion> extends AnimationSequence<T> {

    /** Evaluates the sequence at the given frame and time. */
    public override evaluate(_time: number, _frame?: number): T {
      return this.keys[_frame]?.functionOut.evaluate(_time);
    }

    protected override regenerateFunctions(_keys: AnimationKey<T>[] = this.keys): void {
      super.regenerateFunctions([...new Set(_keys)]); // remove duplicates, as sampled sequences may contain the same key repeated times
    }
  }
}