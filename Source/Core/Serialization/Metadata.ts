namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /** A record of property keys and property descriptors of an object. */
  export interface MetaPropertyDescriptors { [key: string]: MetaPropertyDescriptor }

  /** An object describing the configuration of a specific property. */
  export interface MetaPropertyDescriptor {
    /** The type of the property. */
    type?: Function | Record<string, unknown>;

    /** The kind of the property. */
    kind: "primitive" | "collection" | "object" | "enum" | "function";

    /** Descriptor for a collection's key type (only relevant for `type` {@link Map}). */
    keyDescriptor?: MetaPropertyDescriptor;

    /** Descriptor for a collection's value type (only relevant for `type` {@link Array}, {@link Set} or {@link Map}). */
    valueDescriptor?: MetaPropertyDescriptor;

    /** Options for assignment (selectable values/instances). Use the {@link select} decorator to add assign options. */
    getAssignOptions?: PropertyAssignOptionsGetter;

    /** Options for creation (constructors/factory functions). Use the {@link create} decorator to add create options. */
    getCreateOptions?: PropertyCreateOptionsGetter;
  }

  /**
   * A function that returns a record of available creation options for a property.
   * Each entry maps an option name to either a constructor or a factory function that can be used to create a value for the property.
   * @param this The instance that owns the property.
   * @param _key The property key for which creation options are requested.
   */
  export type PropertyCreateOptionsGetter<T = General, V = General> = (this: T, _key: string) => Record<string, (new () => V) | (() => V)>;

  /**
   * A function that returns a record of available assignment options for a property.
   * Each entry maps an option name to a value that can be assigned to the property.
   * @param this The instance that owns the property.
   * @param _key The property key for which assignment options are requested.
   */
  export type PropertyAssignOptionsGetter<T = General, V = General> = (this: T, _key: string) => Record<string, V>;

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

    propertyDescriptors?: MetaPropertyDescriptors;

    /**
     * A map from property keys to their specified order in the class's {@link Mutator}.
     * Use the {@link order} decorator to add to this map.
     */
    mutatorOrder?: Record<string, number>;

    /**
     * A map of property keys to their serialization strategy.
     * Use the {@link serialize} decorator to add to this map.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "reconstruct" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray" | "reconstructArray">;
  }

  export namespace Metadata {
    const emptyKeys: readonly string[] = Object.freeze([] as string[]);

    /**
     * Returns the decorated {@link Metadata.mutatorKeys property keys} that will be included in the {@link Mutator} of the given instance or class. Returns an empty set if no keys are decorated.
     */
    export function mutatorKeys<T extends Object, K extends Extract<keyof T, string>>(_from: T): readonly K[] {
      return <readonly K[]>(getMetadata(_from).mutatorKeys ?? emptyKeys);
    }

    /**
     * Returns an object describing the meta configuration of a specific property on a given object.
     */
    export function getPropertyDescriptor(_object: Object, _key: string): MetaPropertyDescriptor {
      return getPropertyDescriptors(_object)?.[_key];
    }

    /**
     * Returns all meta property descriptors of a given object.
     */
    export function getPropertyDescriptors(_from: Object): MetaPropertyDescriptors {
      return getMetadata(_from).propertyDescriptors;
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
  export type ClassPropertyDecoratorContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;
}