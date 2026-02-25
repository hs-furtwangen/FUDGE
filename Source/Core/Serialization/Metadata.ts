namespace FudgeCore {
  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /** A record of property keys and property descriptors of an object. */
  export interface MetaPropertyDescriptors { [key: string]: MetaPropertyDescriptor }

  /** An object describing the configuration of a specific property. */
  export interface MetaPropertyDescriptor {
    /** The type of the property. */
    type: Function | Record<string, unknown>;

    /** The kind of the property. */
    kind: "primitive" | "collection" | "object" | "enum" | "function";

    /** Whether the property can be set to `undefined` via the editor */
    clearable?: boolean;

    /** Descriptor for a collection's key type (only relevant for `type` {@link Map}). */
    keyDescriptor?: MetaPropertyDescriptor;

    /** Descriptor for a collection's value type (only relevant for `type` {@link Array}, {@link Set} or {@link Map}). */
    valueDescriptor?: MetaPropertyDescriptor;

    /** Options for creation (constructors/factory functions). Use the {@link create} decorator to add create options. */
    getCreateOptions?: PropertyCreateOptionsGetter;

    /** Options for assignment (selectable values/instances). Use the {@link assign} decorator to add assign options. */
    getAssignOptions?: PropertyAssignOptionsGetter;
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
    serializables?: Record<PropertyKey, "primitive" | "serializable" | "resource" | "node" | "function" | "primitiveArray" | "serializableArray" | "resourceArray" | "nodeArray" | "functionArray">;
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

  /** {@link ClassFieldDecoratorContext} or {@link ClassGetterDecoratorContext} or {@link ClassAccessorDecoratorContext} */
  export type ClassPropertyDecoratorContext<This = unknown, Value = unknown> = ClassFieldDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value> | ClassAccessorDecoratorContext<This, Value>;

  /**
   * @internal Return the value of the own property of an object. If the property is inherited, or does not exist, return undefined. See {@link Object.hasOwn} for details.
   */
  export function getOwnProperty<T extends object, K extends keyof T>(_object: T, _ownKey: K): T[K] | undefined {
    if (Object.hasOwn(_object, _ownKey))
      return _object[_ownKey];

    return undefined;
  }

  /**
   * @internal Return the meta property descriptors of a metadata object.
   */
  export function getMetaPropertyDescriptors(_metadata: Metadata): MetaPropertyDescriptors {
    let descriptors: MetaPropertyDescriptors = getOwnProperty(_metadata, "propertyDescriptors");
    if (!descriptors)
      _metadata.propertyDescriptors = descriptors = Object.create(_metadata.propertyDescriptors ?? null);

    return descriptors;
  }

  /**
   * @internal Return a new meta property descriptor.
   */
  export function createMetaPropertyDescriptor(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): MetaPropertyDescriptor {
    const descriptor: MetaPropertyDescriptor = Object.create(null);
    descriptor.type = _typePrimary;

    switch (_typePrimary) {
      case Boolean: case Number: case String:
        descriptor.kind = "primitive";
        break;
      case Array: case Set: case Map:
        descriptor.kind = "collection";
        break;
      default:
        if (_function && !_typeSecondary)
          descriptor.kind = "function";
        else if (typeof _typePrimary == "object")
          descriptor.kind = "enum";
        else
          descriptor.kind = "object";
        break;
    }

    if (!_function) {
      let getCreateOptions: PropertyCreateOptionsGetter;
      if ((<General>_typePrimary).subclasses)
        getCreateOptions = getSubclassOptions;

      if (getCreateOptions)
        descriptor.getCreateOptions = getCreateOptions;
    }

    let getAssignOptions: PropertyAssignOptionsGetter | undefined;
    if (_function && (<General>_typePrimary).subclasses)
      getAssignOptions = getSubclassOptions;
    else if (_typePrimary === Node)
      getAssignOptions = getNodeOptions;
    else if (isSerializableResource(_typePrimary.prototype))
      getAssignOptions = getResourceOptions;

    if (getAssignOptions)
      descriptor.getAssignOptions = getAssignOptions;


    if (_typeSecondary)
      descriptor.valueDescriptor = createMetaPropertyDescriptor(_typeSecondary, undefined, _function);

    return descriptor;
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
    let descriptor: MetaPropertyDescriptor = Metadata.getPropertyDescriptor(this, _key);
    if (descriptor.valueDescriptor)
      descriptor = descriptor.valueDescriptor;

    const resources: SerializableResource[] = Project.getResourcesByType(<abstract new () => unknown>(descriptor.type));
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
}