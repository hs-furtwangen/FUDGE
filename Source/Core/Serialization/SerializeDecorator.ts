namespace FudgeCore {
  /**
     * Decorator to mark properties of a {@link Serializable} for automatic serialization and editor configuration.
     * 
     * **Editor Configuration:**
     * Specify the type of a property within a class's {@link Metadata | metadata}.
     * This allows the intended type of the property to be known by the editor (at runtime), making it:
     * - A valid drop target (e.g., for objects like {@link Node}, {@link Texture}, {@link Mesh}).
     * - Display the appropriate input element, even if the property has not been set (`undefined`).
     * 
     * **Serialization:**
     * Decorated properties are serialized by calling {@link serializeDecorations} / {@link deserializeDecorations} on an instance. 
     * For builtin classes like {@link ComponentScript}, the serialization occurs automatically after an instance's {@link Serializable.serialize} / {@link Serializable.deserialize} method was called.
     * - Primitives and enums will be serialized as is.
     * - {@link Serializable}s will be serialized nested. 
     * - {@link SerializableResource}s will be serialized via their resource id and fetched with it from the project when deserialized.
     * - {@link Node}s will be serialized as a path connecting them through the hierarchy, if found. During deserialization, the path will be unwound to find the instance in the current hierarchy. They will be available ***after*** {@link EVENT.GRAPH_DESERIALIZED} / {@link EVENT.GRAPH_INSTANTIATED} was broadcast through the hierarchy. Node references can only be serialized from a {@link Component}.
     * 
     * **Example:**
     * ```typescript
     * import ƒ = FudgeCore;
     *
     * @ƒ.serialize
     * export class MyScript extends ƒ.ComponentScript {
     *   #size: number = 1;
     * 
     *   @ƒ.serialize(String) // display a string in the editor
     *   public info: string;
     *
     *   @ƒ.serialize(ƒ.Vector3) // display a vector in the editor
     *   public position: ƒ.Vector3 = new ƒ.Vector3(1, 2, 3);
     *
     *   @ƒ.serialize(ƒ.Material) // drop a material inside the editor to reference it
     *   public resource: ƒ.Material;
     *
     *   @ƒ.serialize(ƒ.Node) // drop a node inside the editor to reference it
     *   public reference: ƒ.Node
     * 
     *   @ƒ.serialize(Number) // display a number in the editor
     *   public get size(): number {
     *     return this.#size;
     *   }
     * 
     *   // define a setter to allow writing to size, or omit it to leave the property read-only
     *   public set size(_size: number) {
     *     this.#size = _size;
     *   }
     * }
     * ```
     * 
     * **Side effects:**
     * * Attributes with a specified type will always be included in the {@link Mutator base-mutator} 
     * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects 
     * will be displayed via their {@link toString} method in the editor.
     * * Decorated getters will be made enumerable, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
     * 
     * @author Jonas Plotzky, HFU, 2024-2025
     */
  // primitive type
  export function serialize<T extends Number | String | Boolean>(_type: abstract new (...args: General[]) => T, _array: typeof Array): (_value: unknown, _context: ClassPropertyContext<Serializable, T[]>) => void;
  export function serialize<T extends Number | String | Boolean>(_type: (abstract new (...args: General[]) => T)): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;

  // object type
  export function serialize<T, C extends abstract new (...args: General[]) => T>(_type: C, _array: typeof Array): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T[]>) => void;
  export function serialize<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;

  // enum type
  export function serialize<T extends Number | String, E extends Record<keyof E, T>>(_type: E, _array: typeof Array): (_value: unknown, _context: ClassPropertyContext<Serializable, T[]>) => void;
  export function serialize<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;

  // function type
  export function serialize<T extends Function>(_type: T, _array: typeof Array, _function: typeof Function): (_value: unknown, _context: ClassPropertyContext<Serializable, T[]>) => void;
  export function serialize<T extends Function>(_type: T, _array: typeof Function): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;

  export function serialize(_type: Function | Record<string, unknown>, _flag0?: typeof Array | typeof Function, _flag1?: typeof Function): ((_value: unknown, _context: ClassPropertyContext<General, General>) => void) | void {
    return serializeFactory(_type, _flag0 === Array, _flag0 == Function || _flag1 === Function);
  }

  function serializeFactory(_type: Function | Record<string, unknown>, _array?: boolean, _function?: boolean): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      if (_context.static || _context.private)
        throw new Error("@serialize decorator can only serialize public instance members.");

      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        throw new Error("@serialize decorator can't serialize symbol-named properties");

      const metadata: Metadata = _context.metadata;

      // invoke type decorator
      type<General, General>(_type)(_value, _context);

      // determine serialization type
      let serializationStrategy: Metadata["serializables"][string];

      if (_function) {
        serializationStrategy = "function";
      } else if (_type == String || _type == Number || _type == Boolean || typeof _type == "object") { // primitive or enum 
        serializationStrategy = "primitive";
      } else if (_type == Node) {
        serializationStrategy = "node";
      } else if ((<SerializableResource>_type.prototype).isSerializableResource) {
        serializationStrategy = "resource";
      } else if ((<Serializable>_type.prototype).serialize && (<Serializable>_type.prototype).deserialize) {
        serializationStrategy = "serializable";
      }

      if (serializationStrategy == "node" || serializationStrategy == "resource" || serializationStrategy == "function") {
        reference(_value, <ClassPropertyContext<unknown, object>>_context); // invoke reference decorator
        select(_value, _context);
      }

      if (_array)
        serializationStrategy = <Metadata["serializables"][string]>(serializationStrategy + "Array");

      if (!serializationStrategy)
        return;

      // add serialization type to metadata
      const serializables: Metadata["serializables"] = getOwnProperty(metadata, "serializables") ?? (metadata.serializables = { ...metadata.serializables });
      serializables[key] = serializationStrategy;
    };

  }

  /**
   * Serialize the {@link serialize decorated properties} of an instance into a {@link Serialization} object.
   */
  export function serializeDecorations(_instance: object, _serialization: Serialization = {}): Serialization {
    const serializables: Metadata["serializables"] = getMetadata(_instance).serializables;
    for (const key in serializables) {
      const value: General = Reflect.get(_instance, key);
      if (value == null)
        continue;

      switch (serializables[key]) {
        case "primitive":
          _serialization[key] = value;
          break;
        case "serializable":
          _serialization[key] = value.serialize();
          break;
        case "resource":
          _serialization[key] = value.idResource;
          break;
        case "node":
          _serialization[key] = Node.PATH_FROM_TO(<Component>_instance, value);
          break;
        case "function":
          _serialization[key] = Serializer.getFunctionPath(value);
          break;
        case "primitiveArray":
          _serialization[key] = Array.from(value);
          break;
        case "serializableArray":
          _serialization[key] = Serializer.serializeArray(value);
          break;
        case "resourceArray":
          _serialization[key] = Serializer.serializeResources(value);
          break;
        case "nodeArray":
          _serialization[key] = value.map((_node: Node) => Node.PATH_FROM_TO(<Component>_instance, _node));
          break;
        case "functionArray":
          _serialization[key] = Serializer.serializeFunctions(value);
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
    const serializables: Metadata["serializables"] = getMetadata(_instance).serializables;

    let nodePaths: Serialization;
    for (const key in serializables) {
      let value: General = _serialization[key];
      if (value == null)
        continue;

      switch (serializables[key]) {
        case "primitive":
          Reflect.set(_instance, key, value);
          break;
        case "serializable":
          const promise: Promise<Serializable> | Serializable = (<Serializable>Reflect.get(_instance, key)).deserialize(value);
          if (promise instanceof Promise)
            await promise;
          break;
        case "resource":
          Reflect.set(_instance, key, Project.resources[value] ?? await Project.getResource(value)); // await is costly so first try to get resource directly
          break;
        case "node":
          (nodePaths ??= {})[key] = value;
          break;
        case "function":
          Reflect.set(_instance, key, Serializer.getFunction(value));
          break;
        case "primitiveArray":
          Reflect.set(_instance, key, Array.from(value));
          break;
        case "serializableArray":
          Reflect.set(_instance, key, await Serializer.deserializeArray(value));
          break;
        case "resourceArray":
          Reflect.set(_instance, key, await Serializer.deserializeResources(value));
          break;
        case "nodeArray":
          (nodePaths ??= {})[key] = value;
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