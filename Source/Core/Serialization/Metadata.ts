namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Association of an attribute with its specified type, either a constructor or a map of possible options (for enums).
   * @see {@link Metadata}.
   */
  export type MetaPropertyTypes = Record<PropertyKey, Function | Record<PropertyKey, General>>;

  /**
   * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadata {
    /**
     * A list of property keys to be included in a {@link Mutator} ({@link getMutator}) of this class. Use the {@link mutate}, {@link type} or {@link serialize} decorator to add keys to this list.
     */
    propertyKeys?: string[];

    /**
     * The specified types of the properties of a class. Use the {@link type} or {@link serialize} decorator to add type information to the metadata of a class.
     */
    propertyTypes?: MetaPropertyTypes;

    /**
     * List of property keys that will be made enumerable. Use the {@link enumerate} decorator to add keys to this list.
     */
    enumerables?: PropertyKey[];

    /**
     * Map of property keys to the serialization strategy for the property, as determined by the {@link serialize} decorator.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray">;
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;

  const emptyMetaPropertyKeys: readonly string[] = Object.freeze([]);
  export function getMetaPropertyKeys<T extends Object, K extends Extract<keyof T, string>>(_from: T): K[] {
    return <K[]>(getMetadata(_from).propertyKeys ?? emptyMetaPropertyKeys);
  }

  const emptyMetaPropertyTypes: MetaPropertyTypes = Object.freeze({});
  export function getMetaPropertyTypes(_from: Object): MetaPropertyTypes {
    return getMetadata(_from).propertyTypes ?? emptyMetaPropertyTypes;
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

  //#region Mutate
  /**
   * Decorator to include properties of a {@link Mutable} in its {@link Mutator} (via {@link Mutable.getMutator}). Use on getters to include them in the mutator and display them in the editor.
   *
   * **Usage**: Apply this decorator to a property.
   *
   * **Example**:
   * ```typescript
   * export class SomeScript extends ƒ.ComponentScript {
   *   #size: number = 1;
   * 
   *   @ƒ.mutate // apply the decorator to the getter
   *   public get size(): number {
   *     return this.#size;
   *   }
   * 
   *   // define a setter to allow writing, or omit it to leave the property read-only
   *   public set size(_size: number) {
   *     this.#size = _size;
   *   }
   * }
   * ```
   * @author Jonas Plotzky, HFU, 2025
   */
  export function mutate(_value: unknown, _context: ClassPropertyContext): void {
    const key: PropertyKey = _context.name;
    if (typeof key === "symbol")
      return;

    const metadata: Metadata = _context.metadata;
    const propertyKeys: Metadata["propertyKeys"] = getOwnProperty(metadata, "propertyKeys") ?? (metadata.propertyKeys = metadata.propertyKeys ? [...metadata.propertyKeys] : []);
    propertyKeys.push(key);
  }
  //#endregion

  //#region Type
  /**
   * Decorator to specify a type for a property within a class's {@link Metadata | metadata}.
   * This allows the intended type of a property to be known at runtime, making it a valid drop target in the editor.
   *
   * **Note:** Properties with a specified meta-type will always be included in the {@link Mutator base-mutator} 
   * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects 
   * will be displayed via their {@link toString} method in the editor.
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // runtime-type from object property/method
  // export function type<C, K extends keyof C, T>(_propertyKey: K): C[K] extends (() => Record<string, T>) | Record<string, T> ? (_value: unknown, _context: ClassPropertyContext<C, T>) => void : never;

  // object type
  export function type<T, C extends abstract new (...args: General[]) => T>(_constructor: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;

  // primitive type
  export function type<T extends Boolean | Number | String>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;

  // enum type
  export function type<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;

  export function type(_type: Function | Object): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        return;

      const metadata: Metadata = _context.metadata;

      const propertyTypes: Metadata["propertyTypes"] = getOwnProperty(metadata, "propertyTypes") ?? (metadata.propertyTypes = { ...metadata.propertyTypes });
      propertyTypes[key] = _type;

      mutate(_value, _context);
    };
  }
  //#endregion
}