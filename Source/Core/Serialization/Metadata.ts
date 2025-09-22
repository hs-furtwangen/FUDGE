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

  // primitive type
  export function edit<T extends Number | String | Boolean>(_type: (abstract new (...args: General[]) => T)): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;
  // object type
  export function edit<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Mutable : Mutable, T | T[]>) => void;
  // enum type
  export function edit<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;
  // function type
  export function edit<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;

  export function edit(_type: Function | Record<string, unknown>): ((_value: unknown, _context: ClassPropertyContext<General, General>) => void) {
    return editFactory(_type, false);
  }

  export function editF(_type: Function | Record<string, unknown>): ((_value: unknown, _context: ClassPropertyContext<General, General>) => void) {
    return editFactory(_type, true);
  }

  function editFactory(_type: Function | Record<string, unknown>, _function?: boolean): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => {
      serializeFactory(_type, _function)(_value, _context);
      typeFactory(_type, _function)(_value, _context);
    };
  }

  //#region Mutate
  /**
   * Decorator to include properties of a {@link Mutable} in its {@link Mutator} (via {@link Mutable.getMutator}). Use on getters to include them in the mutator and display them in the editor.
   *
   * @author Jonas Plotzky, HFU, 2025
   */
  export function mutate(_value: unknown, _context: ClassPropertyContext<Mutable>): void {
    const key: PropertyKey = _context.name;
    if (typeof key === "symbol")
      return;

    const metadata: Metadata = _context.metadata;
    const keys: Set<string> = getOwnProperty(metadata, "mutatorKeys") ?? (metadata.mutatorKeys = new Set<string>(metadata.mutatorKeys));
    keys.add(key);
  }
  //#endregion

  //#region Type
  /**
   * Decorator to specify a type for a property of a {@link Mutable}.
   * 
   * This allows the intended type of the property to be known by the editor (at runtime), making it:
   * - A valid drop target (e.g., for objects like {@link Node}, {@link Texture}, {@link Mesh}).
   * - Display the appropriate input element, even if the property has not been set (is `undefined`).
   *
   * To specify a function type (typeof `_type`) use the {@link typeF} decorator.
   *
   * **Side effects:**
   * - Invokes the {@link mutate} decorator.
   * - Invokes the {@link reference} decorator for `_type` {@link SerializableResource} or {@link Node}.
   * - Invokes the {@link select} decorator with default options for `_type` {@link SerializableResource}, {@link Node}.
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // primitive type
  export function type<T extends Number | String | Boolean>(_type: (abstract new (...args: General[]) => T)): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;
  // object type
  export function type<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Mutable : Mutable, T | T[]>) => void;
  // enum type
  export function type<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;
  // function type
  export function type<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void;

  export function type(_type: Function | Record<string, unknown>): ((_value: unknown, _context: ClassPropertyContext<General, General>) => void) {
    return typeFactory(_type, false);
  }

  /**
   * Decorator to specify a function type (typeof `_type`) for a property of a {@link Mutable}.
   * See {@link type} decorator for more information.
   *
   * If the given `_type` has an iterable property `subclasses`, a combo select containing the subclasses will be displayed in the editor.
   * 
   * **Example**:
   * ```typescript
   * import ƒ = FudgeCore;
   * 
   * export class MyClass {
   *   public static subclasses: typeof MyClass[] = [];
   * }
   * 
   * export class MySubClassA extends MyClass {}
   * export class MySubClassB extends MyClass {}
   * MyClass.subclasses.push(MySubClassA, MySubClassB); // add subclasses
   * 
   * export class MyScript extends ƒ.ComponentScript {
   *   @ƒ.typeF(MyClass) // display a combo select with the subclasses of MyClass in the editor
   *   public myClass: typeof MyClass;
   * }
   * ```
   *
   * **Side effects:**
   * - Invokes the {@link mutate} decorator.
   * - Invokes the {@link reference} decorator.
   * - Invokes the {@link select} decorator with default options.
   * @author Jonas Plotzky, HFU, 2025
   */
  export function typeF<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyContext<Mutable, T | T[]>) => void {
    return typeFactory(_type, true);
  }

  /**
   * @internal
   */
  export function typeFactory(_type: Function | Record<string, unknown>, _function?: boolean): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => {
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        return;

      const metadata: Metadata = _context.metadata;

      const types: Metadata["mutatorTypes"] = getOwnProperty(metadata, "mutatorTypes") ?? (metadata.mutatorTypes = { ...metadata.mutatorTypes });
      types[key] = _type;

      const isFunction: boolean = _function;
      const isConstructor: boolean = typeof _type === "function";
      const isNode: boolean = isConstructor && _type === Node;
      const isResource: boolean = isConstructor && (<SerializableResource>(_type).prototype).isSerializableResource;

      mutate(_value, _context);

      if (isFunction || isNode || isResource) {
        reference(_value, <ClassPropertyContext<Mutable, object>>_context);
        let get: MutatorOptionsGetter | undefined;
        if (isFunction && (<General>_type).subclasses)
          get = getSubclassOptions;
        else if (isResource)
          get = getResourceOptions;
        else if (isNode)
          get = getNodeOptions;

        if (get)
          select(get)(_value, _context);
      }
    };
  }
  //#endregion

  //#region Reference
  /**
   * Decorator to mark properties of a {@link Mutable} as references. Reference properties are included in the {@link Mutator} (via {@link Mutable.getMutator}) as direct references to other objects regardless of their own type. 
   * {@link Mutable.mutate} simply sets references similarly to how primitive values are set.
   *
   * @author Jonas Plotzky, HFU, 2025
   */
  export function reference<T extends object>(_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Mutable : Mutable, T>): void {
    const key: PropertyKey = _context.name;
    if (typeof key === "symbol")
      return;

    const metadata: Metadata = _context.metadata;
    const keys: Set<string> = getOwnProperty(metadata, "mutatorReferences") ?? (metadata.mutatorReferences = new Set<string>(metadata.mutatorReferences));
    keys.add(key);
  }
  //#endregion

  //#region Select
  /**
   * Decorator to provide a list of select options for a property of a {@link Mutable}. Displays a combo select element in the editor.
   * The provided function will be executed to retrieve the options.
   * 
   * The combo select displays properties via their `name` property or {@link toString}.
   * 
   * **Example**:
   * ```typescript
   * import ƒ = FudgeCore;
   *
   * export class MyClass {
   *   public name: string; // MyClass instances will be displayed using their name
   *
   *   public constructor(_name: string) {
   *     this.name = _name;
   *   }
   * }
   *
   * const instanceA: MyClass = new MyClass("Instance A");
   * const instanceB: MyClass = new MyClass("Instance B");
   *
   * function getOptions(this: MyScript, _key: string): Record<string, MyClass> { // create an select options getter
   *   return {
   *     [instanceA.name]: instanceA,
   *     [instanceB.name]: instanceB
   *   };
   * }
   *
   * export class MyScript extends ƒ.ComponentScript {
   *   @ƒ.select(getOptions) // display a combo select with the options returned by getOptions
   *   @ƒ.type(MyClass) // no default select options for MyClass
   *   public myOption: MyClass;
   * }
   * ```
   *
   * @param _getOptions A function that returns a map of display names to values.
   * @author Jonas Plotzky, HFU, 2025
   */
  export function select<T, V>(_getOptions: MutatorOptionsGetter<T, V>): (_value: unknown, _context: ClassPropertyContext<T, V>) => void {
    const getOptions: MutatorOptionsGetter = <MutatorOptionsGetter>_getOptions;

    return function (_value: unknown, _context: ClassPropertyContext): void {
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        return;

      const metadata: Metadata = _context.metadata;
      const options: MutatorOptions = getOwnProperty(metadata, "mutatorOptions") ?? (metadata.mutatorOptions = { ...metadata.mutatorOptions });
      options[key as string] = getOptions;
    };

  }

  function getSubclassOptions(this: object, _key: string): Record<string, Function> {
    const subclasses: Iterable<Function> = (<{ readonly subclasses: Iterable<Function> }>Mutator.types(this)[_key]).subclasses;
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