namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Map from each property of a mutator to its specified type, either a constructor or a map of possible options (for enums).
   * @see {@link Metadata}.
   */
  export type MutatorTypes = { [key: string]: Function | Record<string, unknown> };

  /**
   * Map from each property of a mutator to its specified collcetion type, for now only {@link Array}.
   * @see {@link Metadata}.
   */
  export type MutatorCollectionTypes = { [key: string]: typeof Array };

  /**
   * Map from each property of a mutator to a function that returns a map of possible options for the property.
   */
  export type MutatorOptions = { [key: string]: MutatorOptionsGetter };

  /**
   * A function that returns a map of possible select options for a mutator property.
   * @param this The instance containing the property.
   * @param _key The key of the property for which options are requested.
   */
  export type MutatorOptionsGetter<T = General, V = General> = (this: T, _key: string) => Record<string, V>;

  /**
   * Metadata for classes. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadata {
    /**
     * Keys of properties to be included in the class's {@link Mutator}.
     * Use the {@link edit} or {@link mutate} decorator to add keys to this list.
     */
    mutatorKeys?: string[];

    /**
     * A map from property keys to their specified types for the class's {@link Mutator}.
     * Use the {@link edit} or {@link mutate} decorator to add type information to this map.
     */
    mutatorTypes?: MutatorTypes;

    /**
     * Keys of properties of the class's {@link Mutator} that are references to other objects.
     */
    mutatorReferences?: Set<string>;

    /**
     * A map from property keys to their specified collection types for the class's {@link Mutator}.
     * Use the {@link edit} or {@link mutate} decorator to add collcetion type information to this map.
     */
    mutatorCollectionTypes?: MutatorCollectionTypes;

    /**
     * A map from property keys to their specified order in the class's {@link Mutator}.
     * Use the {@link order} decorator to add to this map.
     */
    mutatorOrder?: Record<string, number>;

    /**
     * A map from property keys to functions that return a map of possible select options for the property.
     * Use the {@link select} decorator to add to this map.
     */
    mutatorSelectOptions?: MutatorOptions;

    /**
     * A map from property keys to functions that return a map of possible create options for the property.
     * Use the {@link create} decorator to add to this map.
     */
    mutatorCreateOptions?: MutatorOptions;

    /**
     * A map of property keys to their serialization strategy.
     * Use the {@link serialize} decorator to add to this map.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "reconstruct" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray" | "reconstructArray">;
  }

  export namespace Metadata {
    const emptyKeys: readonly string[] = Object.freeze([] as string[]);
    const emptyObject: object = Object.freeze({});
    const emptySet: ReadonlySet<string> = Object.freeze(new Set<string>());

    /**
     * Returns the decorated {@link Metadata.mutatorKeys property keys} that will be included in the {@link Mutator} of the given instance or class. Returns an empty set if no keys are decorated.
     */
    export function keys<T extends Object, K extends Extract<keyof T, string>>(_from: T): readonly K[] {
      return <readonly K[]>(getMetadata(_from).mutatorKeys ?? emptyKeys);
    }

    /**
     * Returns the decorated {@link Metadata.mutatorTypes types} of the {@link Mutator} of the given instance or class. Returns an empty object if no types are decorated.
     */
    export function types(_from: Object): Readonly<MutatorTypes> {
      return getMetadata(_from).mutatorTypes ?? <Readonly<MutatorTypes>>emptyObject;
    }

    /**
     * Returns the decorated {@link Metadata.mutatorCollectionTypes collection types} of the {@link Mutator} of the given instance or class. Returns an empty object if no types are decorated.
     */
    export function collectionTypes(_from: Object): Readonly<MutatorCollectionTypes> {
      return getMetadata(_from).mutatorCollectionTypes ?? <Readonly<MutatorCollectionTypes>>emptyObject;
    }

    /**
     * Returns the decorated {@link Metadata.mutatorReferences references} of the {@link Mutator} of the given instance or class. Returns an empty set if no references are decorated.
     */
    export function references(_from: object): ReadonlySet<string> {
      return <ReadonlySet<string>>(getMetadata(_from).mutatorReferences ?? emptySet);
    }

    /**
     * Returns the decorated {@link Metadata.mutatorSelectOptions select options} of the {@link Mutator} of the given instance or class. Returns an empty object if no select options are decorated.
     */
    export function selectOptions(_from: Object): Readonly<MutatorOptions> {
      return getMetadata(_from).mutatorSelectOptions ?? <Readonly<MutatorOptions>>emptyObject;
    }

    /**
     * Returns the decorated {@link Metadata.mutatorSelectOptions select options} of the {@link Mutator} of the given instance or class. Returns an empty object if no select options are decorated.
     */
    export function createOptions(_from: Object): Readonly<MutatorOptions> {
      return getMetadata(_from).mutatorCreateOptions ?? <Readonly<MutatorOptions>>emptyObject;
    }
  }

  const emptyMetadata: Metadata = Object.freeze({});
  /**
   * Retrieves the {@link Metadata} of an instance or constructor. For primitives, plain objects or null, empty metadata is returned.
   */
  export function getMetadata(_from: Object): Readonly<Metadata> {
    if (_from == null)
      return emptyMetadata;

    if (typeof _from != "function")
      _from = _from.constructor;

    return (<Function>_from)[Symbol.metadata] ?? emptyMetadata;
  }

  /**
   * @internal Return the value of the own property of an object. If the property is inherited, or does not exist, return undefined. See {@link Object.hasOwn} for details.
   */
  export function getOwnProperty<T extends object, K extends keyof T>(_object: T, _ownKey: K): T[K] | undefined {
    if (Object.hasOwn(_object, _ownKey))
      return _object[_ownKey];

    return undefined;
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;
}