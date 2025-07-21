namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Association of an attribute with its specified type (constructor).
   * @see {@link Metadata}.
   */
  export type MetaAttributeTypes = Record<PropertyKey, Function | Object>;

  /**
   * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadata {
    /**
     * The specified types of the attributes of a class. Use the {@link type} or {@link serialize} decorator to add type information to the metadata of a class.
     */
    attributeTypes?: MetaAttributeTypes;

    /**
     * List of property keys that will be made enumerable. Use the {@link enumerate} decorator to add keys to this list.
     */
    enumerables?: PropertyKey[];

    /**
     * Map of property keys to the serialization strategy for the property, as determined by the {@link serialize} decorator.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializableSync" | "serializableAsync" | "resource" | "node">;
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;


  /**
   * Retrieves the {@link Metadata} of a class instance or constructor.
   */
  export function getMetadata(_instance: Object): Metadata;
  export function getMetadata(_constructor: Function): Metadata;
  export function getMetadata(_in: Function | Object): Metadata {
    switch (typeof _in) {
      case "function":
        return _in[Symbol.metadata] ??= {};
      case "object":
        return getMetadata(_in.constructor);
    }
  }

  /**
   * @internal Return the value of the own property of an object. If the property is inherited, or does not exist, return undefined. See {@link Object.hasOwn} for details.
   */
  export function getOwnProperty<T extends object, K extends keyof T>(_object: T, _ownKey: K): T[K] | undefined {
    if (Object.hasOwn(_object, _ownKey))
      return _object[_ownKey];

    return undefined;
  }

  /**
   * @internal Appends the metadata property while preserving inheritance.
   */
  export function appendMetadata<Key extends keyof Metadata>(_metadata: Metadata, _metadataKey: Key): Metadata[Key] {
    if (!Object.hasOwn(_metadata, _metadataKey))
      _metadata[_metadataKey] = { ...<General>_metadata[_metadataKey] };
    return _metadata[_metadataKey];
  }


  //#region Type
  /**
   * Decorator to specify a type (constructor) for an attribute within a class's {@link Metadata | metadata}.
   * This allows the intended type of an attribute to be known at runtime, making it a valid drop target in the editor.
   *
   * **Note:** Attributes with a specified meta-type will always be included in the {@link Mutator base-mutator} 
   * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects 
   * will be displayed via their {@link toString} method in the editor.
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // TODO: add support for arrays and maybe other collections?
  // object type
  export function type<T, C extends abstract new (...args: General[]) => T>(_constructor: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;
  // primitive type
  export function type<T extends Boolean | Number | String>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  // enum type
  export function type<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  export function type(_type: Function | Object): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      const metadata: Metadata = _context.metadata;
      const attributeTypes: Metadata["attributeTypes"] = getOwnProperty(metadata, "attributeTypes") ?? (metadata.attributeTypes = { ...metadata.attributeTypes });
      attributeTypes[_context.name] = _type;
    };
  }
  //#endregion

  //#region Enumerate
  /**
   * Decorator for making getters in a {@link Mutable} class enumerable. This ensures that the getters are included in mutators and are subsequently displayed in the editor.
   * 
   * **Usage**: Apply this decorator to both the getter method and the class to make it effective.
   * 
   * **Example**:
   * ```typescript
   * @ƒ.enumerate // apply the decorator to the class.
   * export class SomeScript extends ƒ.ComponentScript {
   *   #size: number = 1;
   * 
   *   @ƒ.enumerate // apply the decorator to the getter
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
   */
  export function enumerate(_value: Function, _context: ClassDecoratorContext<new (...args: General[]) => Mutable>): void;
  export function enumerate(_value: Function, _context: ClassGetterDecoratorContext<Mutable> | ClassAccessorDecoratorContext<Mutable>): void;
  export function enumerate(_value: Function, _context: ClassDecoratorContext | ClassGetterDecoratorContext | ClassAccessorDecoratorContext): void {
    const metadata: Metadata = _context.metadata;
    if (_context.kind == "getter" || _context.kind == "accessor") {
      const metadata: Metadata = _context.metadata;
      const enumerables: Metadata["enumerables"] = getOwnProperty(metadata, "enumerables") ?? (metadata.enumerables = []);
      enumerables.push(_context.name);
      return;
    }

    if (_context.kind == "class") {
      const enumerables: Metadata["enumerables"] = metadata.enumerables;
      const prototype: Object = _value.prototype;
      if (enumerables) {
        const descriptor: PropertyDescriptor = { enumerable: true };
        for (const key of enumerables)
          Object.defineProperty(prototype, key, descriptor);
      }
      return;
    }
  }
  //#endregion
}