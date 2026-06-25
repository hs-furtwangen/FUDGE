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

    /** Whether the property can be set to `undefined` via the editor. */
    clearable?: boolean;

    /** The default value to which the property can be reset to. */
    defaultValue?: MetaDefaultValue;

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
   * Default values must be {@link CloneableValue}s.
   * Object values can implement {@link Comparable} to customize how the editor compares assigned values to default values.
   */
  export type MetaDefaultValue = CloneableValue;

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
   * Metadata for classes or objects. Class metadata needs to be explicitly specified using decorators (e.g. {@link edit}).
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata {
    /**
     * Keys of properties to be included in the objects {@link Mutator}.
     * Use the {@link edit} or {@link mutate} decorator to add keys to this list.
     */
    mutatorKeys?: string[];

    propertyDescriptors?: MetaPropertyDescriptors;

    /**
     * A map from property keys to their specified order in the objects {@link Mutator}.
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

    /**
     * Define metadata on an object/instance. The metadata of the object inherits from the metadata of its class/constructor.
     * Allows 
     */
    export function defineMetadata<T extends object>(_object: T extends Function ? never : T): void {
      if (Object.hasOwn(_object, Symbol.metadata))
        throw new Error(`Metadata already defined on object ${_object}`);

      const superMetadata: Metadata = _object.constructor[Symbol.metadata] ?? null;
      const metadata: Metadata = Object.create(superMetadata);
      Object.defineProperty(_object, Symbol.metadata, { value: metadata, configurable: true });
    }

    /**
     * Define a property of an object as mutable within its metadata.
     */
    export function setMutable(_metadata: Metadata, _key: string, _typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): void {
      // add meta property descriptor to metadata
      const descriptors: MetaPropertyDescriptors = ensurePropertyDescriptors(_metadata);
      descriptors[_key] ??= createPropertyDescriptor(_typePrimary, _typeSecondary, _function);

      const keys: string[] = getOwnProperty(_metadata, "mutatorKeys") ?? (_metadata.mutatorKeys = _metadata.mutatorKeys ? [..._metadata.mutatorKeys] : []);
      keys.push(_key);
    }

    /**
     * Define a property of an object as serializable within its metadata.
     */
    export function setSerializable(_metadata: Metadata, _key: string, _typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): void {
      // add meta property descriptor to metadata
      const descriptors: MetaPropertyDescriptors = ensurePropertyDescriptors(_metadata);
      descriptors[_key] ??= createPropertyDescriptor(_typePrimary, _typeSecondary, _function);

      // determine serialization type
      let strategy: Metadata["serializables"][string];

      const type: Function | Record<string, unknown> = _typeSecondary ?? _typePrimary;
      switch (type) {
        case Boolean: case Number: case String: case Object:
          strategy = "primitive";
          break;
        case Node:
          strategy = "node";
          break;
        default:
          if (_function)
            strategy = "function";
          else if (isSerializableResource(type.prototype))
            strategy = "resource";
          else if (isSerializable(type.prototype))
            strategy = "serializable";
          else if (typeof type == "object")
            strategy = "primitive";
          break;
      }

      if (_typeSecondary)
        strategy += _typePrimary.name;

      if (!strategy)
        return;

      // add serialization type to metadata
      const serializables: Metadata["serializables"] = getOwnProperty(_metadata, "serializables") ?? (_metadata.serializables = { ..._metadata.serializables });
      serializables[_key] = strategy;
    }

    /**
     * Define a property of an object as mutable and serializable, and add meta configuration for it.
     */
    export function setEditable(_metadata: Metadata, _key: string, _typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): void {
      setMutable(_metadata, _key, _typePrimary, _typeSecondary, _function);
      setSerializable(_metadata, _key, _typePrimary, _typeSecondary, _function);
    }

    /**
     * Set a mutable property of an object as clearable, and add meta configuration for it.
     */
    export function setClearable(_metadata: Metadata, _key: string, _value: boolean): void {
      const descriptors: MetaPropertyDescriptors = Metadata.ensurePropertyDescriptors(_metadata);
      const descriptor: MetaPropertyDescriptor = descriptors[_key];
      if (!descriptor)
        throw new Error(`@clearable requires an existing meta property descriptor for property '${_key}'. Add @mutate/@edit before @clearable.`);

      descriptor.clearable = _value;
    }

    /**
     * Set the default value of a mutable property of an object, and add meta configuration for it.
     */
    export function setDefaultValue(_metadata: Metadata, _key: string, _value: MetaDefaultValue): void {
      const descriptors: MetaPropertyDescriptors = Metadata.ensurePropertyDescriptors(_metadata);
      const descriptor: MetaPropertyDescriptor = descriptors[_key];
      if (!descriptor)
        throw new Error(`@reset requires an existing meta property descriptor for property '${_key}'. Add @mutate/@edit before @reset.`);

      descriptor.defaultValue = clone(_value);
    };

    /**
     * @internal Return the own meta property descriptors of a metadata object. Initializes them if unavailable.
     */
    export function ensurePropertyDescriptors(_metadata: Metadata): Readonly<MetaPropertyDescriptors> {
      let descriptors: MetaPropertyDescriptors = getOwnProperty(_metadata, "propertyDescriptors");
      if (!descriptors)
        _metadata.propertyDescriptors = descriptors = Object.create(_metadata.propertyDescriptors ?? null);

      return descriptors;
    }

    /**
     * Return a new meta property descriptor.
     */
    export function createPropertyDescriptor(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): MetaPropertyDescriptor {
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
        descriptor.valueDescriptor = createPropertyDescriptor(_typeSecondary, undefined, _function);

      return descriptor;
    }
  }

  const emptyMetadata: Metadata = Object.freeze(Object.create(null));
  /**
   * Retrieves the {@link Metadata} of an instance or class. Instance metadata takes precedence over class metadata.
   * If none is found, empty metadata is returned.
   */
  export function getMetadata(_from: Object): Readonly<Metadata> {
    if (_from == null)
      return emptyMetadata;

    return (<Function>_from)[Symbol.metadata] ?? _from.constructor?.[Symbol.metadata] ?? emptyMetadata;
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