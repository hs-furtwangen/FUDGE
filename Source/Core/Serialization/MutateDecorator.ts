namespace FudgeCore {

  /**
   * Maps wrapper types (`Number`, `String`, `Boolean`) to their primitive counterparts.
   */
  export type WrapperToPrimitve<T> =
    T extends String ? string :
    T extends Number ? number :
    T extends Boolean ? boolean :
    never;

  //#region @mutate
  /**
   * Decorator to mark properties of a class for nested mutation.
   * 
   * This allows the intended type of the property to be known by the editor (at runtime), making it:
   * - A valid drop target (e.g., for objects like {@link Node}, {@link Texture}, {@link Mesh}).
   * - Display the appropriate input element, even if the property has not been set (is `undefined`).
   *
   * - To mutate using a function type (typeof `_type`), use the {@link mutateFunction} decorator.
   * - To mutate using a {@link Node} or {@link SerializableResource} reference, use the {@link mutateReference} decorator.
   * - To establish a property order (in the editor), use the {@link order} decorator.
   * 
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // primitive type
  export function mutate<T extends String | Number | Boolean, P>(_type: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void) : never;
  // primitive type array
  export function mutate<T extends String | Number | Boolean, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void) : never;


  // object type
  export function mutate<T extends P, P>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // object type array
  export function mutate<T extends P, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void;

  // enum type
  export function mutate<E extends Record<keyof E, P>, P extends Number | String>(_type: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // enum type array
  export function mutate<E extends Record<keyof E, P>, P extends Number | String>(_collectionType: typeof Array, _valueType: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void;

  export function mutate(_typePrimary: General, _typeSecondary?: General): ((_value: unknown, _context: ClassPropertyDecoratorContext) => void) {
    return mutateFactory(_typePrimary, _typeSecondary, false);
  }

  /**
   * Decorator to mark function properties (typeof `_type`) of a class for mutation.
   * See {@link mutate} for additional information.
   *
   * If the given `_type` has an iterable property `subclasses`, a combo select containing the subclasses will be displayed in the editor.
   *
   * **Side effects:**
   * - Invokes the {@link select} decorator with default options.
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function mutateFunction<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T>) => void;
  export function mutateFunction<T extends Function>(_collectionType: typeof Array, _valueType: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T[]>) => void;

  export function mutateFunction(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return mutateFactory(_typePrimary, _typeSecondary, true);
  }

  /**
   * Decorator to mark properties of a class for reference-based mutation.
   * See {@link mutate} for additional information.
   * 
   * **Side effects:**
   * - Invokes the {@link select} decorator with default options.
   */
  export function mutateReference<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyDecoratorContext<T extends Node ? Node extends T ? Component : object : object, T>) => void;
  export function mutateReference<T, C extends abstract new (...args: General[]) => T>(_collectionType: typeof Array, _valueType: C): (_value: unknown, _context: ClassPropertyDecoratorContext<T extends Node ? Node extends T ? Component : object : object, T[]>) => void;

  export function mutateReference(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return mutateFactory(_typePrimary, _typeSecondary, false, true);
  }

  const mapTypeToCreate: WeakMap<WeakKey, () => unknown> = new WeakMap();
  mapTypeToCreate.set(Number, Number);
  mapTypeToCreate.set(Boolean, Boolean);
  mapTypeToCreate.set(String, String);

  /**
   * @internal
   */
  export function mutateFactory(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean, _reference?: boolean): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return (_value, _context) => {
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        return;

      const metadata: Metadata = _context.metadata;

      let descriptors: MetaPropertyDescriptors = getOwnProperty(metadata, "propertyDescriptors");
      if (!descriptors)
        metadata.propertyDescriptors = descriptors = Object.create(metadata.propertyDescriptors ?? null);

      descriptors[key] = createDescriptor(_typePrimary, _typeSecondary, _function, _reference);

      const keys: string[] = getOwnProperty(metadata, "mutatorKeys") ?? (metadata.mutatorKeys = metadata.mutatorKeys ? [...metadata.mutatorKeys] : []);
      keys.push(key);
    };
  }

  function createDescriptor(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean, _reference?: boolean): MetaPropertyDescriptor {
    const descriptor: MetaPropertyDescriptor = Object.create(null);
    descriptor.type = _typePrimary;

    if (_function && !_typeSecondary)
      descriptor.kind = "function";
    else if (_typePrimary === Array)
      descriptor.kind = "collection";
    else if (_typePrimary == Boolean || _typePrimary == Number || _typePrimary == String)
      descriptor.kind = "primitive";
    else if (typeof _typePrimary == "object")
      descriptor.kind = "enum";
    else
      descriptor.kind = "object";

    if (!_function) {
      let getCreateOptions: PropertyCreateOptionsGetter;
      if ((<General>_typePrimary).subclasses)
        getCreateOptions = getSubclassOptions;

      if (getCreateOptions)
        descriptor.getCreateOptions = getCreateOptions;
    }

    if (_reference || _function) {
      let getAssignOptions: PropertyAssignOptionsGetter | undefined;
      if (_function && (<General>_typePrimary).subclasses)
        getAssignOptions = getSubclassOptions;
      else if (_typePrimary === Node)
        getAssignOptions = getNodeOptions;
      else
        getAssignOptions = getResourceOptions;

      if (getAssignOptions)
        descriptor.getAssignOptions = getAssignOptions;
    }

    if (_typeSecondary)
      descriptor.valueDescriptor = createDescriptor(_typeSecondary, undefined, _function, _reference);

    return descriptor;
  }
  //#endregion

  //#region @order
  /**
   * Decorator to specify the property order in the {@link Mutator} of a class. Use to order the displayed properties within the editor. 
   * Properties with lower order values are displayed first. Properties without an order value are displayed after those with an order value, in the order they were decorated.
   * To take effect, the class needs to be decorated with the {@link orderFlat} decorator.
   * Needs to be used in conjunction with the {@link edit}, {@link mutate} or {@link mutate} decorators to take effect.
   *
   * @author Jonas Plotzky, HFU, 2025
   */
  export function order(_order: number): (_value: unknown, _context: ClassPropertyDecoratorContext<Mutable>) => void {
    return (_value, _context) => {
      if (_context.static || _context.private)
        throw new Error("@order decorator can only order public instance members.");

      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        throw new Error("@order decorator can't order symbol-named properties");

      const metadata: Metadata = _context.metadata;
      const order: Record<string, number> = getOwnProperty(metadata, "mutatorOrder") ?? (metadata.mutatorOrder = { ...metadata.mutatorOrder });
      order[key] = _order;
    };
  }

  /**
   * Decorator to sort properties in the {@link Mutator} of a class according to their specified order (via the {@link order} decorator). Use on the class to order its properties.
   *
   * @author Jonas Plotzky, HFU, 2025
   */
  export function orderFlat(_class: unknown, _context: ClassDecoratorContext): void {
    const metadata: Metadata = _context.metadata;
    const order: Record<string, number> = getOwnProperty(metadata, "mutatorOrder");
    if (!order)
      throw new Error("No mutator order specified. Use the @order decorator to specify an order for mutator keys.");

    const keys: string[] = getOwnProperty(metadata, "mutatorKeys");
    if (!keys)
      throw new Error("No mutator keys specified. Use the @mutate decorator to specify mutator keys.");

    keys.sort((_a, _b) => {
      const orderA: number = order[_a] ?? Number.POSITIVE_INFINITY;
      const orderB: number = order[_b] ?? Number.POSITIVE_INFINITY;
      return orderA - orderB;
    });
  }
  //#endregion

  //#region @select
  /**
   * Decorator to provide a list of select options for a property of a {@link Mutable}. Displays a combo select element in the editor.
   * The provided function will be executed to retrieve the select options.
   * 
   * The combo select displays properties via their `name` property or {@link toString}.
   * 
   * **Example**:
   * ```typescript
   * import f = FudgeCore;
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
   * function getOptions(this: MyScript, _key: string): Record<string, MyClass> { // create a select options getter
   *   return {
   *     [instanceA.name]: instanceA,
   *     [instanceB.name]: instanceB
   *   };
   * }
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   * 
   *   @f.select(getOptions) // display a combo select with the options returned by getOptions
   *   @f.mutate(MyClass) // no default select options for MyClass
   *   public myOption: MyClass;
   * }
   * ```
   *
   * @param _getOptions A function that returns a map of display names to values.
   * @author Jonas Plotzky, HFU, 2025
   */
  export function select<T, V>(_getOptions: PropertyAssignOptionsGetter<T, V>): (_value: unknown, _context: ClassPropertyDecoratorContext<T, V>) => void {
    return function (_value: unknown, _context: ClassPropertyDecoratorContext): void {
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        return;

      const metadata: Metadata = _context.metadata;
      const descriptors: MetaPropertyDescriptors = getOwnProperty(metadata, "propertyDescriptors") ?? (metadata.propertyDescriptors = { ...metadata.propertyDescriptors });
      const descriptor: MetaPropertyDescriptor = descriptors[key];
      if (descriptor.type == Array)
        descriptor.valueDescriptor.getAssignOptions = _getOptions;
      else
        descriptor.getAssignOptions = _getOptions;
    };
  }

  function getSubclassOptions(this: object, _key: string): Record<string, () => General> {
    const descriptor: MetaPropertyDescriptor = Metadata.getPropertyDescriptor(this, _key);
    const subclasses: Iterable<() => General> = (<{ readonly subclasses: Iterable<() => General> }>(descriptor.valueDescriptor?.type ?? descriptor.type)).subclasses;
    const options: Record<string, () => General> = {};
    for (const subclass of subclasses)
      options[subclass.name] = subclass;

    return options;
  }

  function getResourceOptions(this: object, _key: string): Record<string, SerializableResource> {
    const descriptor: MetaPropertyDescriptor = Metadata.getPropertyDescriptor(this, _key);
    const resources: SerializableResource[] = Project.getResourcesByType(<abstract new () => unknown>(descriptor.valueDescriptor?.type ?? descriptor.type));
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

  //#region @create
  /**
   * Decorator to provide a list of options for creating new instances of a property.
   * Similar to @select, but for creating new objects instead of selecting existing ones.
   *
   * @param _getOptions A function returning a map of display names to constructors or factory functions.
   */
  export function create<T, V>(_getOptions: PropertyCreateOptionsGetter<T, V>): (_value: unknown, _context: ClassPropertyDecoratorContext<T, V>) => void {
    return function (_value: unknown, _context: ClassPropertyDecoratorContext): void {
      const key: PropertyKey = _context.name;
      if (typeof key === "symbol") return;

      const metadata: Metadata = _context.metadata;
      const descriptors: MetaPropertyDescriptors = getOwnProperty(metadata, "propertyDescriptors") ?? (metadata.propertyDescriptors = { ...metadata.propertyDescriptors });
      const descriptor: MetaPropertyDescriptor = descriptors[key];
      if (descriptor.type == Array)
        descriptor.valueDescriptor.getCreateOptions = _getOptions;
      else
        descriptor.getCreateOptions = _getOptions;
    };
  }
  //#endregion

}