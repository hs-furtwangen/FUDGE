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
  export interface Metadata extends DecoratorMetadataObject {
    /**
     * The specified types of the attributes of a class. Use the {@link type} decorator to add type information to the metadata of a class.
     */
    attributeTypes?: MetaAttributeTypes;
    enumerateKeys?: PropertyKey[];

    /**
     * Map of property names to the type of serialization that should be used for that property.
     */
    serializables?: { [key: string]: "primitive" | "serializable" | "resource" | "node" };
    implements?: Set<Function>;
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;
  
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
  export function type(_constructor: Function | Object): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      let meta: Metadata = _context.metadata;
      if (!Object.hasOwn(meta, "attributeTypes"))
        meta.attributeTypes = { ...meta.attributeTypes };
      meta.attributeTypes[_context.name] = _constructor;
    };
  }

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
  export function enumerate(_value: unknown, _context: ClassDecoratorContext<new (...args: General[]) => Mutable>): void;
  export function enumerate(_value: unknown, _context: ClassGetterDecoratorContext<Mutable> | ClassAccessorDecoratorContext<Mutable>): void;
  export function enumerate(_value: unknown, _context: ClassDecoratorContext | ClassGetterDecoratorContext | ClassAccessorDecoratorContext): void {
    // _context.addInitializer(function (this: unknown) { // this is run per instance... ideally we would want to run this once per class
    //   const prototype: unknown = Object.getPrototypeOf(this);
    //   const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(prototype, _context.name);
    //   if (descriptor && descriptor.enumerable == false)
    //     Object.defineProperty(prototype, _context.name, { enumerable: true });
    // });

    let metadata: Metadata = _context.metadata;
    if (_context.kind == "getter" || _context.kind == "accessor") {
      if (typeof _context.name != "string")
        return;

      if (!Object.hasOwn(metadata, "enumerateKeys"))
        metadata.enumerateKeys = [];

      metadata.enumerateKeys.push(_context.name);
      return;
    }

    if (_context.kind == "class") {
      if (metadata.enumerateKeys) {
        const descriptor: PropertyDescriptor = { enumerable: true };
        for (const key of metadata.enumerateKeys)
          Object.defineProperty((<Function>_value).prototype, key, descriptor);
      }
      return;
    }
  }
}