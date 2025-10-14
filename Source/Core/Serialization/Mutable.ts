namespace FudgeCore {

  /**
   * Interface describing a mutator, which is an associative array with names of attributes and their corresponding values.
   */
  export interface Mutator {
    [attribute: string]: General;
  }

  /**
   * Interface describing an animation target mutator, which is an associative array with names of attributes and their corresponding values.
   * Numeric values are stored as Float32Arrays, which allows for efficient interpolation and blending in the animation system.
   */
  export interface AnimationMutator {
    [attribute: string]: Float32Array;
  }

  /**
   * A property path and value.
   */
  export interface AtomicMutator<T = unknown> {
    path: string[];
    value: T;
  }

  const emptyKeys: readonly string[] = Object.freeze([] as string[]);

  export interface IMutable {
    type: string;

    /**
     * Collect applicable attributes of the instance and copies of their values in a {@link Mutator}-object.
     * A mutator may be reduced by the descendants of {@link Mutable} to contain only the properties needed.
     */
    getMutator(_extendable?: boolean): Mutator;

    /**
     * Updates the attribute values of the instance according to the state of the given mutator.
     */
    mutate(_mutator: Mutator): void | Promise<void>;
  }

  export function isMutable(_object: Object): _object is IMutable {
    return typeof _object === "object" && _object != null && Reflect.has(_object, "getMutator") && Reflect.has(_object, "mutate");
  }

  /**
   * Base class for all types that are mutable using {@link Mutator}-objects, thus providing and using graphical interfaces created at runtime.
   * 
   * Mutables provide a {@link Mutator} built by collecting all their {@link mutate decorated properties}.
   * 
   * Subclasses can either reduce the standard {@link Mutator} built by this base class by deleting properties or implement an individual {@link Mutable.getMutator} method.
   * The provided properties of the {@link Mutator} must match public properties or getters/setters of the object.
   * Otherwise, they will be ignored unless handled by an override of the {@link Mutable.mutate} method in the subclass, and will throw errors in an automatically generated user interface for the object.
   */
  export abstract class Mutable extends EventTargetUnified implements IMutable {

    /**
     * Get the value from the given mutation path.
     */
    public static getValue<T = unknown>(_root: Record<string, General>, _path: string[]): T {
      let object: Record<string, General> = _root;
      for (let i: number = 0; i < _path.length - 1; i++)
        object = object[_path[i]];

      return object[_path[_path.length - 1]];
    }

    /**
     * Set the value at the given mutation path.
     */
    public static setValue(_root: Record<string, General>, _path: string[], _value: unknown): void {
      let object: Record<string, General> = _root;
      for (let i: number = 0; i < _path.length - 1; i++)
        object = object[_path[i]];

      object[_path[_path.length - 1]] = _value;
    }

    /**
     * Collect applicable properties of the given object and copies of their values in a {@link Mutator}-object.
     */
    public static getMutator(_object: object): Mutator {
      if (isMutable(_object))
        return _object.getMutator();
      else
        return Mutable.getMutatorBase(_object);
    }

    /**
     * Updates the property values of the given object according to the state of the given mutator.
     */
    public static mutate(_object: object, _mutator: Mutator): void | Promise<void> {
      if (isMutable(_object))
        return _object.mutate(_mutator);
      else
        return <Promise<void>><unknown>Mutable.mutateBase(_object, _mutator);
    }

    /**
     * Copy the {@link mutate decorated properties} of the given instance into a {@link Mutator} object.
     * @param _mutable The instance to copy the decorated properties from.
     * @param _mutator - (optional) the receiving mutator.
     * @returns `_out` or a new mutator if none is provided.
     */
    public static getMutatorBase(_mutable: object, _mutator: Mutator = {}): Mutator {
      for (const key of Mutable.getKeys(_mutable)) {
        if (!Reflect.has(_mutable, key))
          continue;

        const value: unknown = _mutable[key];
        if (isMutable(value))
          _mutator[key] = value.getMutator(_mutator[key]);
        else if (Array.isArray(value))
          _mutator[key] = Mutable.getMutatorBase(value);
        else
          _mutator[key] = value;
      }

      return _mutator;
    }

    /**
     * 
     * Update the {@link mutate decorated properties} of the given instance according to the state of the given {@link Mutator}.
     * @param _mutable The instance to update.
     * @param _mutator The mutator to update from.
     * @returns `_instance`.
     */
    public static async mutateBase<T extends object>(_mutable: T, _mutator: Mutator): Promise<T> {
      for (const key of Mutable.getKeys(_mutable)) {
        if (!Reflect.has(_mutable, key) || !Reflect.has(_mutator, key))
          continue;

        const mutant: unknown = Reflect.get(_mutable, key);
        const value: unknown = _mutator[key];

        if (value != null && isMutable(mutant))
          await mutant.mutate(value);
        else if (Array.isArray(mutant))
          await Mutable.mutateBase(mutant, value);
        else
          Reflect.set(_mutable, key, value);
      }

      return _mutable;
    }

    /**
     * Collect applicable attributes of the given instance and copies of their values in a mutator.
     */
    public static getMutatorOfArbitrary(_object: object): Mutator {
      let mutator: Mutator = {};
      let attributes: (string | number | symbol)[] = Reflect.ownKeys(Reflect.getPrototypeOf(_object));
      for (let attribute of attributes) {
        let value: Object = Reflect.get(_object, attribute);
        if (value instanceof Function)
          continue;

        mutator[attribute.toString()] = value;
      }

      return mutator;
    }

    // TODO: This function assumes that keyof mutator == keyof mutable. Sub classes of mutable might override getMutator() and mutate() in a way so that the mutator contains keys that are not keys of the mutable...
    /**
     * Updates the values of the given {@link Mutator} according to the current state of the given instance.
     * @param _mutable The instance to update from.
     * @param _mutator The mutator to update.
     * @returns `_mutator`.
     */
    public static updateMutator(_mutable: object, _mutator: Mutator): Mutator {
      for (const key in _mutator) {
        const value: Object = Reflect.get(_mutable, key);
        if (isMutable(value) || Array.isArray(value))
          Mutable.updateMutator(value, _mutator[key]);
        else
          _mutator[key] = value;
      }

      return _mutator;
    }

    /**
     * Returns an associative array with the same properties as the given mutator, but with the corresponding types as constructor functions.
     * Does not recurse into objects! This will return the {@link Metadata.types decorated types} instead of the inferred runtime-types of the object, if available.
     */
    public static getTypes(_instance: object, _mutator: Mutator): MutatorTypes {
      const out: MutatorTypes = {};
      const types: MutatorTypes = Metadata.types(_instance);
      for (const key in _mutator) {
        const metaType: Function | Record<string, unknown> = types[key];
        let type: Function | Record<string, unknown>;
        switch (typeof metaType) {
          case "function":
            type = metaType;
            break;
          case "object":
            type = metaType;
            break;
          case "undefined":
            let value: unknown = _mutator[key];
            if (value != undefined)
              if (typeof value == "object")
                type = Reflect.get(_instance, key).constructor;
              else if (typeof value == "function")
                type = value;
              else
                type = value.constructor;
            break;
        }

        out[key] = type;
      }

      return out;
    }

    /**
     * Returns an iterable of keys for the given source:
     * 
     * - Returns the {@link FudgeCore.mutate decorated keys} that will be included in the {@link Mutator} of the given instance or class, if available. 
     * - Returns {@link Array.keys()} for arrays.
     * - Returns an empty iterable otherwise.
     */
    public static getKeys<T extends Object, K extends Extract<keyof T, string>>(_from: T): Iterable<K> {
      const mutatorKeys: string[] = getMetadata(_from).mutatorKeys;
      if (mutatorKeys)
        return <Iterable<K>>mutatorKeys;

      if (Array.isArray(_from))
        return <Iterable<K>>_from.keys();

      return <Iterable<K>>emptyKeys;
    }

    /**
     * Clones the given mutator at the given path. See {@link Mutator.clone} for restrictions.
     */
    public static cloneMutatorFromPath(_mutator: Mutator, _path: string[], _index: number = 0): Mutator {
      const key: string = _path[_index];
      if (!(key in _mutator)) // if the path deviates from mutator, return the mutator
        return _mutator;

      const clone: Mutator = Mutable.createMutator(_mutator);
      if (!clone) // if the mutator is not a plain object or array, return it
        return _mutator;

      if (_index < _path.length - 1)
        clone[key] = Mutable.cloneMutatorFromPath(_mutator[key], _path, _index + 1); // recursively clone the next part of the path
      else
        clone[key] = _mutator[key];

      return clone;
    }

    /**
     * Clones the given mutator. Only works for plain objects and arrays, i.e. created through the {@link Object} or {@link Array} constructors.
     * @param _mutator The mutator to clone. Must be a plain object or array.
     * @returns A clone of `_mutator` or null if it is not a plain object or array.
     */
    public static cloneMutator(_mutator: Mutator): Mutator | null {
      const out: Mutator | null = Mutable.createMutator(_mutator);
      if (out)
        for (const key in _mutator)
          out[key] = Mutable.cloneMutator(_mutator[key]) ?? _mutator[key];

      return out;
    };

    /**
     * Creates and returns an empty mutator for the given value.
     * @returns An empty plain object or array if the given value is a plain object or array, respectively. Null for everything else.
     */
    private static createMutator(_mutator: Mutator): Mutator | null {
      const prototype: object = _mutator != null ? Object.getPrototypeOf(_mutator) : null;
      if (prototype === Object.prototype)
        return {};

      if (prototype === Array.prototype)
        return [];

      return null;
    }

    /**
     * Retrieves the type of this mutable subclass as the name of the runtime class
     * @returns The type of the mutable
     */
    public get type(): string {
      return this.constructor.name;
    }

    /**
     * Collect applicable attributes of the instance and copies of their values in a Mutator-object.
     * By default, a mutator cannot be extended, since extensions are not available in the object the mutator belongs to.
     * A mutator may be reduced by the descendants of {@link Mutable} to contain only the properties needed.
     * Uses {@link Mutator.fromDecorations}.
     */
    public getMutator(_extendable: boolean = false): Mutator {
      const mutator: Mutator = Mutable.getMutatorBase(this);

      if (!_extendable)
        // mutator can be reduced but not extended!
        Object.preventExtensions(mutator);

      return mutator;
    }

    /**
     * Updates the attribute values of the instance according to the state of the mutator.
     * The the event dispatching may be suppressed.
     * Uses {@link Mutator.mutateDecorations}.
     */
    public mutate(_mutator: Mutator, _dispatchMutate?: boolean): void | Promise<void>; // allow sync or async overrides
    public async mutate(_mutator: Mutator, _dispatchMutate: boolean = true): Promise<void> {
      await Mutable.mutateBase(this, _mutator);

      if (_dispatchMutate)
        this.dispatchEvent(new CustomEvent(EVENT.MUTATE, { bubbles: true, detail: { mutator: _mutator } }));
    }

    /**
     * Updates the property values of the instance according to the state of the animation mutator. Override to implement custom animation behavior.
     */
    public animate(_mutator: AnimationMutator): void {
      for (let key in _mutator) { // AnimationPropertyBindings have already checked the existence of the keys
        const valueArray: Float32Array = _mutator[key];
        if (valueArray.length == 1)
          (<General>this)[key] = valueArray[0];
        else
          (<General>this)[key].setArray(valueArray);
      }
    }
  }
}
