namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Map from each property of a mutator to its specified type, either a constructor or a map of possible options (for enums).
   * @see {@link Metadata}.
   */
  export type MutatorTypes = Record<PropertyKey, Function | Record<PropertyKey, General>>;

  /**
   * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadata {
    /**
     * Keys of properties to be included in the class's {@link Mutator}.
     * Use the {@link mutate}, {@link type} or {@link serialize} decorator to add keys to this list.
     */
    mutatorKeys?: string[];

    /**
     * A map from property keys to their specified types for the class's {@link Mutator}.
     * Use the {@link type} or {@link serialize} decorator to add type information to this map.
     */
    mutatorTypes?: MutatorTypes;

    /**
     * A map of property keys to their serialization strategy.
     * Use the {@link serialize} decorator to add to this map.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray">;
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;

  const emptyKeys: readonly string[] = Object.freeze([]);
  /**
   * Returns the decorated {@link Metadata.mutatorKeys keys} of the {@link Mutator} of the given instance or class. Returns an empty array if no keys are decorated.
   */
  export function getMutatorKeys<T extends Object, K extends Extract<keyof T, string>>(_from: T): readonly K[] {
    return <K[]>(getMetadata(_from).mutatorKeys ?? emptyKeys);
  }

  const emptyTypes: MutatorTypes = Object.freeze({});
  /**
   * Returns the decorated {@link Metadata.mutatorTypes types} of the {@link Mutator} of the given instance or class. Returns an empty object if no types are decorated.
   */
  export function getMutatorTypes(_from: Object): Readonly<MutatorTypes> {
    return getMetadata(_from).mutatorTypes ?? emptyTypes;
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
    const keys: Metadata["mutatorKeys"] = getOwnProperty(metadata, "mutatorKeys") ?? (metadata.mutatorKeys = metadata.mutatorKeys ? [...metadata.mutatorKeys] : []);
    keys.push(key);
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

      const types: Metadata["mutatorTypes"] = getOwnProperty(metadata, "mutatorTypes") ?? (metadata.mutatorTypes = { ...metadata.mutatorTypes });
      types[key] = _type;

      mutate(_value, _context);
    };
  }
  //#endregion
}