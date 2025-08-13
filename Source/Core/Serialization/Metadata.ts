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
  export type MutatorOptionsGetter = (this: unknown, _key: string) => Record<string, unknown>;


  // export type MutatorInfo = { [key: string]: { type?: Function | Record<string, unknown>; isArray?: boolean; isFunction?: boolean; getOptions?: (this: unknown, _key: string) => Record<string, unknown> } };

  /**
   * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadata {
    /**
     * Keys of properties to be included in the class's {@link Mutator}.
     * Use the {@link mutate}, {@link type} or {@link serialize} decorator to add keys to this list.
     */
    mutatorKeys?: Set<string>;

    /**
     * Keys of properties of the class's {@link Mutator} that are references to other objects.
     */
    mutatorReferences?: Set<string>;

    /**
     * A map from property keys to their specified types for the class's {@link Mutator}.
     * Use the {@link type} or {@link serialize} decorator to add type information to this map.
     */
    mutatorTypes?: MutatorTypes;

    /**
     * A map from property keys to functions that return a map of possible options for the property.
     * Use the {@link serialize} or the {@link type} and {@link reference} decorator to add to this map.
     */
    mutatorOptions?: MutatorOptions;

    // mutatorInfo?: Record<string, { type: Function | Record<string, unknown>; getOptions: (this: unknown, _key: string) => Record<string, unknown> }>;

    /**
     * A map of property keys to their serialization strategy.
     * Use the {@link serialize} decorator to add to this map.
     */
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray">;
  }

  export namespace Mutator {

    const emptyKeys: ReadonlySet<string> = Object.freeze(new Set<string>());
    /**
     * Returns the decorated {@link Metadata.mutatorKeys property keys} that will be included in the {@link Mutator} of the given instance or class. Returns an empty set if no keys are decorated.
     */
    export function keys<T extends Object, K extends Extract<keyof T, string>>(_from: T): ReadonlySet<K> {
      return <ReadonlySet<K>>(getMetadata(_from).mutatorKeys ?? emptyKeys);
    }

    export function references<T extends Object, K extends Extract<keyof T, string>>(_from: T): ReadonlySet<K> {
      return <ReadonlySet<K>>(getMetadata(_from).mutatorReferences ?? emptyKeys);
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
  }

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;

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
    const keys: Set<string> = getOwnProperty(metadata, "mutatorKeys") ?? (metadata.mutatorKeys = new Set<string>(metadata.mutatorKeys));
    keys.add(key);
  }
  //#endregion

  //#region Reference
  export function reference(_value: unknown, _context: ClassPropertyContext<unknown, object>): void {
    const key: PropertyKey = _context.name;
    if (typeof key === "symbol")
      return;

    const metadata: Metadata = _context.metadata;
    const keys: Set<string> = getOwnProperty(metadata, "mutatorReferences") ?? (metadata.mutatorReferences = new Set<string>(metadata.mutatorReferences));
    keys.add(key);
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
  export function type<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Mutable : Mutable, T>) => void;

  // primitive type
  export function type<T extends Boolean | Number | String>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Mutable, T>) => void;

  // enum type
  export function type<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<Mutable, T>) => void;

  export function type(_type: Function | Record<string, unknown>): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => {
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

  //#region Select
  /**
   * Decorator to provide a list of options for a property to be displayed in the editor.
   * The provided function will be executed to retrieve the options.
   *
   * **Usage**: Apply this decorator to a property and pass a function that returns a `Record<string, unknown>`.
   * The record's keys are displayed as labels in the UI, and its values are assigned to the property upon selection.
   *
   * **Example**:
   * ```typescript
   * class MyComponent extends ƒ.Component {
   *   @ƒ.reference(() => ({ "Option A": "Value A", "Option B": "Value B" }))
   *   public myChoice: string = "Value A";
   *
   *   @ƒ.type(ƒ.Mesh) // You can still specify a type for drag&drop
   *   @ƒ.reference(function() { return ƒ.Project.getResourcesByType(ƒ.Mesh); })
   *   public myMesh: ƒ.Mesh;
   * }
   * ```
   * @param _getOptions A function that returns a record of display names to values.
   * @author Jonas Plotzky, HFU, 2025
   */
  export function select(_value: unknown, _context: ClassPropertyContext): void;
  export function select(_getOptions: MutatorOptionsGetter): (_value: unknown, _context: ClassPropertyContext) => void;
  export function select(_param0: unknown | MutatorOptionsGetter, _context?: ClassPropertyContext): void | ((_value: unknown, _context: ClassPropertyContext) => void) {
    // // option provided
    // if (typeof _param0 === "function") {
    //   const getOptions: MutatorGetOptions = <MutatorGetOptions>_param0;

    //   return function (_value: unknown, _context: ClassPropertyContext): void {
    //     const key: PropertyKey = _context.name;
    //     if (typeof key === "symbol")
    //       return;

    //     const metadata: Metadata = _context.metadata;
    //     const references: MutatorOptions = getOwnProperty(metadata, "mutatorOptions") ?? (metadata.mutatorOptions = { ...metadata.mutatorOptions });
    //     references[key] = getOptions;

    //     mutate(_value, _context);
    //   };
    // }

    const key: PropertyKey = _context.name;
    if (typeof key === "symbol")
      return;

    const metadata: Metadata = _context.metadata;
    const type: Function | Record<string, unknown> = metadata.mutatorTypes?.[key];
    if (typeof type !== "function")
      return;

    const prototype: unknown = type.prototype;

    let get: (this: General, _key: General) => Record<string, unknown>;
    if ((<SerializableResource>prototype).isSerializableResource)
      get = getResourceOptions;
    else if (type === Node)
      get = getNodeOptions;
    else if ((<General>type).subclasses)
      get = getSubclassOptions;

    if (!get)
      return;

    const references: MutatorOptions = getOwnProperty(metadata, "mutatorOptions") ?? (metadata.mutatorOptions = { ...metadata.mutatorOptions });
    references[key] = get;
  }



  function getSubclassOptions(this: object & { constructor: Function & { readonly subclasses: Function[] } }): Record<string, Function> {
    const subclasses: Function[] = this.constructor.subclasses;
    const options: Record<string, Function> = {};
    for (const subclass of subclasses)
      options[subclass.name] = subclass;

    return options;
  }

  function getResourceOptions(this: object, _key: string): Record<string, SerializableResource> {
    const resources: SerializableResource[] = Project.getResourcesByType(<abstract new () => unknown>Mutator.types(this)[_key]);
    const options: Record<string, SerializableResource> = {};
    for (const resource of resources)
      options[resource.name] = resource;

    return options;
  }

  function getNodeOptions(this: Component): Record<string, Node> {
    const root: Node = this.node.getAncestor();
    const options: Record<string, Node> = {};
    for (const node of root)
      options[node.name] = node;

    return options;
  }
  //#endregion
}