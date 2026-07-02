

namespace FudgeCore {
  /**
   * Decorator to mark properties of a class for decorations based serialization:
   * 
   * - Primitives and enums will be serialized as is. 
   * - {@link Serializable}s will be serialized nested (via {@link Serializable.serialize}/{@link Serializable.deserialize}).
   * - {@link SerializableResource}s will be serialized as references to their resource ID in the {@link Project}, if registered, otherwise nested (as {@link Serializable}).
   * - {@link Node}s will be serialized as paths relative to the {@link Component} they are a property of.
   * 
   * To serialize a function type (typeof `_type`), use the {@link serializeFunction} decorator.
   * 
   * Decorated properties are serialized by calling {@link serializeDecorations} / {@link deserializeDecorations} on an instance. 
   * For builtin classes like {@link Component}, this is done automatically when the {@link Serializable.serialize} / {@link Serializable.deserialize} method is called.
   * 
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   *
   * export class MyScript extends f.ComponentScript {
   *   @f.serialize(String) // serialize a string
   *   public info: string;
   *
   *   @f.serialize(f.Vector3) // serialize a vector
   *   public position: f.Vector3 = new f.Vector3(1, 2, 3);
   * 
   *   #size: number = 1;
   *
   *   @f.serialize(Number) // serialize a number
   *   public get size(): number {
   *     return this.#size;
   *   }
   * 
   *   public set size(_size: number) {
   *     this.#size = _size;
   *   }
   * }
   * ```
   * 
   * **Example Nested Resource:**
   * ```typescript
   * import f = FudgeCore;
   *
   * export class MyScript extends f.ComponentScript {
   *
   *   @f.serialize(f.Material) // serialize nested
   *   public nestedMaterial: f.Material;
   *
   *   public constructor() {
   *     super();
   *     this.nestedMaterial = new f.Material("NestedMaterial", f.ShaderPhong);
   *     
   *     // ⚠️ important: deregister the resource, to serialize it nested.
   *     f.Project.deregister(this.nestedMaterial);
   * 
   *     // remove properties that are not needed
   *     delete this.nestedMaterial.idResource;
   *     delete this.nestedMaterial.name;
   *   }
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // primitive type
  export function serialize<T extends String | Number | Boolean, P>(_type: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void) : never;
  // primitive type array
  export function serialize<T extends String | Number | Boolean, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, Array<P> | ArrayLike<P> | Iterable<P>>) => void) : never;

  // object type
  export function serialize<T extends P, P>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // object type array
  export function serialize<T extends P, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, Array<P> | ArrayLike<P> | Iterable<P>>) => void;

  // enum type
  export function serialize<E extends Record<keyof E, P>, P extends Number | String>(_type: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // enum type array
  export function serialize<E extends Record<keyof E, P>, P extends Number | String>(_collectionType: typeof Array, _valueType: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, Array<P> | ArrayLike<P> | Iterable<P>>) => void;

  export function serialize(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext<General, General>) => void {
    return serializeFactory(_typePrimary, _typeSecondary, false);
  }

  /**
   * Decorator to mark function properties (typeof `_type`) of a {@link Serializable} for serialization.
   * See {@link serialize} decorator for additional information.
   *
   * **Example**:
   * ```typescript
   * import f = FudgeCore;
   * import serializeFunction = f.serializeFunction;
   *
   * export class SomeClass { }
   *
   * export function someFunction(): void { }
   *
   * export class SomeScript extends f.ComponentScript {
   *   @serializeFunction(SomeClass)
   *   public someClass: typeof SomeClass;
   *
   *   @serializeFunction(someFunction)
   *   public someFunction: typeof someFunction;
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function serializeFunction<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T>) => void;
  export function serializeFunction<T extends Function>(_collectionType: typeof Array, _valueType: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T[]>) => void;

  export function serializeFunction(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return serializeFactory(_typePrimary, _typeSecondary, true);
  }

  /**
   * @internal
   */
  export function serializeFactory(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      if (_context.static || _context.private)
        throw new Error("@serialize decorator can only serialize public instance members.");

      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        throw new Error("@serialize decorator can't serialize symbol-named properties");

      const metadata: Metadata = _context.metadata;

      Metadata.setSerializable(metadata, key, _typePrimary, _typeSecondary, _function);
    };

  }

  /**
   * Serialize the {@link serialize decorated properties} of an instance into a {@link Serialization} object.
   */
  export function serializeDecorations(_instance: object, _serialization: Serialization = {}): Serialization {
    const metadata: Metadata = getMetadata(_instance);
    const keys: string[] = metadata.serializableKeys;
    const descriptors: MetaPropertyDescriptors = metadata.propertyDescriptors;

    for (const key of keys) {
      const value: unknown = Reflect.get(_instance, key);
      if (value == null)
        continue;

      let strategy: PropertySerializationStrategy = descriptors[key].serializationStrategy;
      switch (strategy) {
        case "primitive":
          _serialization[key] = value;
          break;
        case "resource":
          const idResource: string = (<SerializableResource>value).idResource;
          if (Project.hasResource(idResource)) {
            _serialization[key] = idResource;
            break;
          } 
        // if resource is not registered serialize nested
        case "serializable":
          if (value.constructor == descriptors[key].type) // compact serialization if non polymorphic
            _serialization[key] = (<Serializable>value).serialize();
          else {
            _serialization[key] = Serializer.serializeFlat(<Serializable>value);
          }
          break;
        case "node":
          _serialization[key] = Node.PATH_FROM_TO(<Component>_instance, <Node>value);
          break;
        case "function":
          _serialization[key] = Serializer.getFunctionPath(<Function>value);
          break;
        case "primitiveArray":
          _serialization[key] = Array.from(<unknown[]>value);
          break;
        case "serializableArray":
          _serialization[key] = Serializer.serializeArray(<Serializable[]>value, <abstract new () => Serializable>descriptors[key].valueDescriptor.type);
          break;
        case "resourceArray":
          _serialization[key] = Serializer.serializeResources(<SerializableResource[]>value);
          break;
        case "nodeArray":
          _serialization[key] = (<Node[]>value).map((_node: Node) => Node.PATH_FROM_TO(<Component>_instance, _node));
          break;
        case "functionArray":
          _serialization[key] = Serializer.serializeFunctions(<Function[]>value);
          break;
      }
    }

    return _serialization;
  };

  const nodeListeners: WeakSet<object> = new WeakSet();
  const graphListeners: WeakSet<object> = new WeakSet();

  /**
   * Deserialize the {@link serialize decorated properties} of an instance from a {@link Serialization} object.
   */
  export async function deserializeDecorations<T extends object>(_instance: T, _serialization: Serialization): Promise<T> {
    const metadata: Metadata = getMetadata(_instance);
    const keys: string[] = metadata.serializableKeys;
    const descriptors: MetaPropertyDescriptors = metadata.propertyDescriptors;

    let nodePaths: Serialization;
    for (const key of keys) {
      let value: General = _serialization[key];
      if (value == null)
        continue;

      let strategy: PropertySerializationStrategy = descriptors[key].serializationStrategy;
      switch (strategy) {
        case "primitive":
          Reflect.set(_instance, key, value);
          break;
        case "resource":
          if (typeof value == "string") {
            Reflect.set(_instance, key, Project.resources[value] ?? await Project.getResource(value)); // await is costly so first try to get resource directly
            break;
          }
        // if resource is not serialized as id go into nested deserialization
        case "serializable":
          let serializable: Promise<Serializable> | Serializable;
          if (typeof value == "object" && "@type" in value) {
            serializable = Serializer.deserializeFlat(value);
          } else {
            serializable = <Serializable>Reflect.get(_instance, key) ?? new (<new () => Serializable>descriptors[key].type)(); // try to get existing, otherwise create new
            serializable = serializable.deserialize(value);
          }

          Reflect.set(_instance, key, serializable instanceof Promise ? await serializable : serializable); // only await if necessary
          break;
        case "node":
        case "nodeArray":
          (nodePaths ??= {})[key] = value;
          break;
        case "function":
          Reflect.set(_instance, key, Serializer.getFunction(value));
          break;
        case "primitiveArray":
          Reflect.set(_instance, key, Array.from(value));
          break;
        case "serializableArray":
          Reflect.set(_instance, key, await Serializer.deserializeArray(value, <new () => Serializable>descriptors[key].valueDescriptor.type));
          break;
        case "resourceArray":
          Reflect.set(_instance, key, await Serializer.deserializeResources(value));
          break;
        case "functionArray":
          Reflect.set(_instance, key, Serializer.deserializeFunctions(value));
          break;
      }
    }

    if (nodePaths)
      deserializeNodes(<Component>_instance, nodePaths);

    return _instance;
  };

  function deserializeNodes(_component: Component, _paths: Serialization): void {
    if (nodeListeners.has(_component))
      return;

    nodeListeners.add(_component);

    const hndNodeDeserialized: EventListenerUnified = () => {
      const node: Node = _component.node;

      if (graphListeners.has(_component))
        return;

      graphListeners.add(_component);

      const hndGraphDeserialized: EventListenerUnified = (_event: Event) => {
        for (const key in _paths) {
          const pathOrPaths: string | string[] = _paths[key];
          if (typeof pathOrPaths == "string")
            Reflect.set(_component, key, Node.FIND(_component, pathOrPaths));
          else
            Reflect.set(_component, key, pathOrPaths.map((_path: string) => Node.FIND(_component, _path)));
        }

        node.removeEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
        node.removeEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);
        graphListeners.delete(_component);
      };

      node.addEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
      node.addEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);

      _component.removeEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
      nodeListeners.delete(_component);
    };

    _component.addEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
  }
}