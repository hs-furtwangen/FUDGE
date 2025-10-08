namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Map from each property of a mutator to its specified type, either a constructor or a map of possible options (for enums).
   * @see {@link Metadata}.
   */
  export type MutatorTypes = { [key: string]: Function | Record<string, unknown> };

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
     * A map from property keys to their specified order in the class's {@link Mutator}.
     * Use the {@link order} decorator to add to this map.
     */
    mutatorOrder?: Record<string, number>;

    /**
     * A map from property keys to functions that return a map of possible options for the property.
     * Use the {@link select} decorator to add to this map.
     */
    mutatorOptions?: MutatorOptions;

    /**
     * A map of property keys to their serialization strategy.
     * Use the {@link serialize} decorator to add to this map.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "reconstruct" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray">;
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