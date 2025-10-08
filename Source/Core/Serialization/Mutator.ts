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

  /*
   * Interfaces dedicated for each purpose. Extra attribute necessary for compiletime type checking, not existent at runtime
   */
  export interface MutatorForAnimation extends Mutator { readonly forAnimation: null }
  export interface MutatorForUserInterface extends Mutator { readonly forUserInterface: null }

  export namespace Mutator {
    // export const SET: unique symbol = Symbol("SET");
    // export const MUTATE: unique symbol = Symbol("MUTATE");

    const emptyKeys: readonly string[] = Object.freeze([] as string[]);
    /**
     * Returns an iterable of keys for the given source:
     * 
     * - Returns the {@link FudgeCore.mutate decorated keys} that will be included in the {@link Mutator} of the given instance or class, if available. 
     * - Returns {@link Array.keys()} for arrays.
     * - Returns an empty iterable otherwise.
     */
    export function keys<T extends Object, K extends Extract<keyof T, string>>(_from: T): Iterable<K> {
      const mutatorKeys: string[] = getMetadata(_from).mutatorKeys;
      if (mutatorKeys)
        return <Iterable<K>>mutatorKeys;

      if (Array.isArray(_from))
        return <Iterable<K>>_from.keys();

      return <Iterable<K>>emptyKeys;
    }

    export function iterator<T extends Object, K extends Extract<keyof T, string>>(_from: T): Iterable<K> {
      const mutatorKeys: string[] = getMetadata(_from).mutatorKeys;
      if (mutatorKeys)
        return <Iterable<K>>mutatorKeys;

      if (Array.isArray(_from))
        return <Iterable<K>>_from.keys();

      return <Iterable<K>>emptyKeys;
    }

    const emptyTypes: MutatorTypes = Object.freeze({});
    /**
     * Returns the decorated {@link Metadata.mutatorTypes types} of the {@link Mutator} of the given instance or class. Returns an empty object if no types are decorated.
     */
    export function types(_from: Object): Readonly<MutatorTypes> {
      return getMetadata(_from).mutatorTypes ?? emptyTypes;
    }

    const emptyReferences: ReadonlySet<string> = Object.freeze(new Set<string>());
    /**
     * Returns the decorated {@link Metadata.mutatorReferences references} of the {@link Mutator} of the given instance or class. Returns an empty set if no references are decorated.
     */
    export function references<T extends Object, K extends Extract<keyof T, string>>(_from: T): ReadonlySet<K> {
      return <ReadonlySet<K>>(getMetadata(_from).mutatorReferences ?? emptyReferences);
    }

    const emptyOptions: Readonly<MutatorOptions> = Object.freeze({});
    /**
     * Returns the decorated {@link Metadata.mutatorOptions select options} of the {@link Mutator} of the given instance or class. Returns an empty object if no select options are decorated.
     */
    export function options(_from: Object): Readonly<MutatorOptions> {
      return getMetadata(_from).mutatorOptions ?? emptyOptions;
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
     * Copy the {@link mutate decorated properties} of the given instance into a {@link Mutator} object.
     * @param _mutable The instance to copy the decorated properties from.
     * @param _mutator - (optional) the receiving mutator.
     * @returns `_out` or a new mutator if none is provided.
     */
    export function fromDecorations(_mutable: object, _mutator: Mutator = {}): Mutator {
      for (const key of Mutator.keys(_mutable)) {
        if (!Reflect.has(_mutable, key))
          continue;

        const value: unknown = _mutable[key];
        if (isMutable(value))
          _mutator[key] = value.getMutator(_mutator[key]);
        else if (Array.isArray(value))
          _mutator[key] = fromDecorations(value);
        else
          _mutator[key] = value;
      }

      return _mutator;
    }

    // TODO: This function assumes that keyof mutator == keyof mutable. Sub classes of mutable might override getMutator() and mutate() in a way so that the mutator contains keys that are not keys of the mutable...
    /**
     * Updates the values of the given {@link Mutator} according to the current state of the given instance.
     * @param _mutable The instance to update from.
     * @param _mutator The mutator to update.
     * @returns `_mutator`.
     */
    export function update(_mutable: object, _mutator: Mutator): Mutator {
      for (const key in _mutator) {
        const value: Object = Reflect.get(_mutable, key);
        if (isMutable(value))
          Mutator.update(value, _mutator[key]);
        else if (Array.isArray(value))
          Mutator.update(value, _mutator[key]);
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
    export async function mutateDecorations<T extends object>(_mutable: T, _mutator: Mutator): Promise<T> {
      for (const key of Mutator.keys(_mutable)) {
        if (!Reflect.has(_mutable, key) || !Reflect.has(_mutator, key))
          continue;

        const mutant: unknown = Reflect.get(_mutable, key);
        const value: unknown = _mutator[key];

        if (value != null && isMutable(mutant))
          await mutant.mutate(value);
        else if (Array.isArray(mutant))
          await mutateDecorations(mutant, value);
        else
          Reflect.set(_mutable, key, value);
      }

      return _mutable;
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

    /**
     * Returns an associative array with the same properties as the given mutator, but with the corresponding types as constructor functions.
     * Does not recurse into objects! This will return the {@link Mutator.types decorated types} instead of the inferred runtime-types of the object, if available.
     */
    export function getTypes(_instance: object, _mutator: Mutator): MutatorTypes {
      const out: MutatorTypes = {};
      const types: MutatorTypes = Mutator.types(_instance);
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
  }
};