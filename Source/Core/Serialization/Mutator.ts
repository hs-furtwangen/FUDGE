namespace FudgeCore {

  /**
   * Interface describing the datatypes of the attributes a mutator as strings 
   */
  export interface MutatorAttributeTypes {
    [attribute: string]: string | object;
  }

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

  /*
   * Interfaces dedicated for each purpose. Extra attribute necessary for compiletime type checking, not existent at runtime
   */
  export interface MutatorForAnimation extends Mutator { readonly forAnimation: null }
  export interface MutatorForUserInterface extends Mutator { readonly forUserInterface: null }

  export namespace Mutator {
    const emptyKeys: readonly string[] = Object.freeze([] as string[]);
    /**
     * Returns the decorated {@link Metadata.mutatorKeys property keys} that will be included in the {@link Mutator} of the given instance or class. Returns an empty set if no keys are decorated.
     */
    export function keys<T extends Object, K extends Extract<keyof T, string>>(_from: T): readonly K[] {
      return <readonly K[]>(getMetadata(_from).mutatorKeys ?? emptyKeys);
    }

    const emptyRefs: ReadonlySet<string> = Object.freeze(new Set<string>());
    /**
     * Returns the decorated {@link Metadata.mutatorReferences references} of the {@link Mutator} of the given instance or class. Returns an empty set if no references are decorated.
     */
    export function references<T extends Object, K extends Extract<keyof T, string>>(_from: T): ReadonlySet<K> {
      return <ReadonlySet<K>>(getMetadata(_from).mutatorReferences ?? emptyRefs);
    }

    const emptyTypes: MutatorTypes = Object.freeze({});
    /**
     * Returns the decorated {@link Metadata.mutatorTypes types} of the {@link Mutator} of the given instance or class. Returns an empty object if no types are decorated.
     */
    export function types(_from: Object): Readonly<MutatorTypes> {
      return getMetadata(_from).mutatorTypes ?? emptyTypes;
    }

    const emptyReferences: Readonly<MutatorOptions> = Object.freeze({});
    /**
     * Returns the decorated {@link Metadata.mutatorOptions references} of the {@link Mutator} of the given instance or class. Returns an empty object if no references are decorated.
     */
    export function options(_from: Object): Readonly<MutatorOptions> {
      return getMetadata(_from).mutatorOptions ?? emptyReferences;
    }

    /**
     * Clones the given mutator. Only works for plain objects and arrays, i.e. created through the {@link Object} or {@link Array} constructors.
     * @param _mutator The mutator to clone. Must be a plain object or array.
     * @returns A clone of `_mutator` or null if it is not a plain object or array.
     */
    export function clone(_mutator: Mutator): Mutator | null {
      const out: Mutator | null = Mutator.create(_mutator);
      if (out)
        for (const key in _mutator)
          out[key] = Mutator.clone(_mutator[key]) ?? _mutator[key];

      return out;
    };

    /**
     * Clones the given mutator at the given path. See {@link Mutator.clone} for restrictions.
     */
    export function fromPath(_mutator: Mutator, _path: string[], _index: number = 0): Mutator {
      const key: string = _path[_index];
      if (!(key in _mutator)) // if the path deviates from mutator, return the mutator
        return _mutator;

      const clone: Mutator = Mutator.create(_mutator);
      if (!clone) // if the mutator is not a plain object or array, return it
        return _mutator;

      if (_index < _path.length - 1)
        clone[key] = Mutator.fromPath(_mutator[key], _path, _index + 1); // recursively clone the next part of the path
      else
        clone[key] = _mutator[key];

      return clone;
    }

    /**
     * Collect applicable attributes of the given instance and copies of their values in a mutator.
     */
    export function from(_object: object): Mutator {
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

    /**
     * **WIP** TODO: add array support
     * 
     * Copy the {@link mutate decorated properties} of the given instance into a {@link Mutator} object.
     * @param _instance The instance to copy the decorated properties from.
     * @param _out - (optional) the receiving mutator.
     * @returns `_out` or a new mutator if none is provided.
     */
    export function fromDecorations(_instance: object, _out: Mutator = {}): Mutator {
      const references: ReadonlySet<string> = Mutator.references(_instance);
      for (const key of Mutator.keys(_instance)) {
        if (!Reflect.has(_instance, key))
          continue;

        const isReference: boolean = references.has(key);
        const value: unknown = _instance[key];
        if (!isReference && isMutable(value))
          _out[key] = value.getMutator(_out[key]);
        else if (Array.isArray(value))
          _out[key] = Mutator.fromArray(value, isReference);
        else
          _out[key] = value;
      }

      return _out;
    }

    export function fromArray(_array: General[], _reference?: boolean): Mutator {
      const mutator: Mutator = new Array(_array.length);
      for (let i: number = 0; i < _array.length; i++) {
        const value: unknown = _array[i];
        if (!_reference && isMutable(value))
          mutator[i] = value.getMutator();
        else if (Array.isArray(value))
          mutator[i] = Mutator.fromArray(value, _reference);
        else
          mutator[i] = value;
      }

      return mutator;
    }

    // TODO: This function assumes that keyof mutator == keyof mutable. Sub classes of mutable might override getMutator() and mutate() in a way so that the mutator contains keys that are not keys of the mutable...
    /**
     * Updates the values of the given {@link Mutator} according to the current state of the given instance.
     * @param _instance The instance to update from.
     * @param _mutator The mutator to update.
     * @returns `_mutator`.
     */
    export function update(_instance: object, _mutator: Mutator): Mutator {
      const references: ReadonlySet<string> = Mutator.references(_instance);
      for (const key in _mutator) {
        const value: Object = Reflect.get(_instance, key);
        if (!references.has(key) && isMutable(value))
          Mutator.update(value, _mutator[key]);
        else
          _mutator[key] = value;
      }

      return _mutator;
    }

    /**
     * **WIP** TODO: add array support
     * 
     * Update the {@link mutate decorated properties} of the given instance according to the state of the given {@link Mutator}.
     * @param _instance The instance to update.
     * @param _mutator The mutator to update from.
     * @returns `_instance`.
     */
    export async function mutateDecorations<T extends object>(_instance: T, _mutator: Mutator): Promise<T> {
      const references: ReadonlySet<string> = Mutator.references(_instance);
      for (const key of Mutator.keys(_instance)) {
        if (!Reflect.has(_instance, key) || !Reflect.has(_mutator, key))
          continue;

        const isReference: boolean = references.has(key);
        const mutant: unknown = Reflect.get(_instance, key);
        const value: unknown = _mutator[key];

        if (value != null && !isReference && isMutable(mutant))
          await mutant.mutate(value);
        else if (Array.isArray(mutant))
          await mutateArray(mutant, value, isReference);
        else
          Reflect.set(_instance, key, value);
      }

      return _instance;
    }

    export async function mutateArray<T extends General[]>(_instance: T, _mutator: Mutator, _reference?: boolean): Promise<T> {
      for (let key: number = 0; key < _mutator.length; key++) {
        const mutant: unknown = Reflect.get(_instance, key);
        const value: unknown = _mutator[key];
        if (value != null && !_reference && isMutable(mutant))
          await mutant.mutate(value);
        else if (Array.isArray(mutant))
          await mutateArray(mutant, value, _reference);
        else
          Reflect.set(_instance, key, value);

      }

      return _instance;
    }


    /**
     * Creates and returns an empty mutator for the given value.
     * @returns An empty plain object or array if the given value is a plain object or array, respectively. Null for everything else.
     */
    export function create(_mutator: Mutator): Mutator | null {
      const prototype: object = _mutator != null ? Object.getPrototypeOf(_mutator) : null;
      if (prototype === Object.prototype)
        return {};

      if (prototype === Array.prototype)
        return [];

      return null;
    }
  }
};