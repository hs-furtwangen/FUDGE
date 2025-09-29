

namespace FudgeCore {
  /**
   * Decorator to mark properties of a {@link Serializable} for automatic serialization.
   * 
   * To specify a function type (typeof `_type`) use the {@link serializeF} decorator.
   * 
   * Decorated properties are serialized by calling {@link serializeDecorations} / {@link deserializeDecorations} on an instance. 
   * For builtin classes like {@link Component}, this is done automatically when the {@link Serializable.serialize} / {@link Serializable.deserialize} method is called.
   * - Primitives and enums will be serialized as is.
   * - {@link Serializable}s will be serialized nested. 
   * - {@link SerializableResource}s will be serialized via their resource id and fetched from the project when deserialized. To serialize nested, use the {@link serializeNested} decorator.
   * - {@link Node}s will be serialized as a path connecting them through the hierarchy, if found. During deserialization, the path will be unwound to find the instance in the current hierarchy. They will be available ***after*** {@link EVENT.GRAPH_DESERIALIZED} / {@link EVENT.GRAPH_INSTANTIATED} was broadcast through the hierarchy. Node references can only be serialized from a {@link Component}.
   * 
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import serialize = f.serialize;
   *
   * export class MyScript extends f.ComponentScript {
   *   @serialize(String) // serialize a string
   *   public info: string;
   *
   *   @serialize(f.Vector3) // serialize a vector
   *   public position: f.Vector3 = new f.Vector3(1, 2, 3);
   *
   *   @serialize(f.Material) // serialize a material by referencing it in the project
   *   public resource: f.Material;
   *
   *   @serialize(f.Node) // serialize a node by its path in the hierarchy
   *   public reference: f.Node;
   * 
   *   #size: number = 1;
   *
   *   @serialize(Number) // serialize a number
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
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  // primitive type
  export function serialize<T extends Number | String | Boolean>(_type: (abstract new (...args: General[]) => T)): (_value: unknown, _context: ClassPropertyContext<Serializable, T | T[]>) => void;
  // object type
  export function serialize<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T | T[]>) => void;
  // enum type
  export function serialize<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T | T[]>) => void;

  export function serialize(_type: Function | Record<string, unknown>): ((_value: unknown, _context: ClassPropertyContext<General, General>) => void) | void {
    return serializeFactory(_type, false);
  }

  /**
   * Decorator to mark function properties (typeof `_type`) of a {@link Serializable} for automatic serialization and editor configuration.
   * See {@link serialize} decorator for more information.
   *
   * **Example**:
   * ```typescript
   * import f = FudgeCore;
   * import serializeF = f.serializeF;
   *
   * export class SomeClass { }
   *
   * export function someFunction(): void { }
   *
   * export class SomeScript extends f.ComponentScript {
   *   @serializeF(SomeClass)
   *   public someClass: typeof SomeClass;
   *
   *   @serializeF(someFunction)
   *   public someFunction: typeof someFunction;
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function serializeF<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyContext<Serializable, T | T[]>) => void {
    return serializeFactory(_type, true);
  }

  /**
   * Decorator to mark {@link SerializableResource resource} properties of a {@link Serializable} for nested serialization.
   * The resource will be serialized nested within the containing object rather than stored separately in the project.
   *
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import serialize = f.serialize;
   * import serializeNested = f.serializeNested;
   *
   * export class MyScript extends f.ComponentScript {
   *   @serialize(f.Material) // serialize by reference (resource ID)
   *   public material: f.Material;
   *
   *   @serializeNested(f.Material) // serialize nested
   *   public nestedMaterial: f.Material;
   *
   *   public constructor() {
   *     super();
   *     this.nestedMaterial = new f.Material("NestedMaterial", f.ShaderPhong);
   *     
   *     // ⚠️ important: deregister nested resource, otherwise it will double duty as resource!
   *     f.Project.deregister(this.nestedMaterial);
   * 
   *     // remove properties that are not needed
   *     delete this.nestedMaterial.idResource;
   *     delete this.nestedMaterial.name;
   *   }
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function serializeNested<T extends SerializableResource>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T | T[]>) => void {
    return serializeFactory(_type, false, true, false);
  }

  /**
   * Decorator to mark {@link Serializable} properties for full reconstruction during serialization.
   * The object will be serialized with type information and reconstructed from scratch during deserialization.
   * 
   * **⚠️ Warning:** Do not use with {@link SerializableResource}s unless you manually deregister them from the project.
   * Resources reconstructed this way will automatically register themselves, potentially causing ID conflicts.
   *
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import serializeReconstruct = f.serializeReconstruct;
   *
   * export class MySpecialScriptA extends f.ComponentScript {}
   * export class MySpecialScriptB extends f.ComponentScript {}
   *
   * export class MyScript extends f.ComponentScript {
   *   @serializeReconstruct(f.ComponentScript) // serialize with type information
   *   public myReconstruct: f.ComponentScript;
   * }
   *
   * // Usage:
   * let myScript: Test.MyScript = new Test.MyScript();
   * myScript.myReconstruct = new Test.MySpecialScriptA(); // or new Test.MySpecialScriptB();
   * let serialization: f.Serialization = f.Serializer.serialize(myScript);
   * let deserialization: Test.MyScript = await f.Serializer.deserialize(serialization); // myScript.myReconstruct is now an instance of MySpecialScriptA
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function serializeReconstruct<T extends Serializable>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T | T[]>) => void {
    return serializeFactory(_type, false, false, true);
  }

  /**
   * @internal
   */
  export function serializeFactory(_type: Function | Record<string, unknown>, _function?: boolean, _nested?: boolean, _reconstruct?: boolean): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      if (_context.static || _context.private)
        throw new Error("@serialize decorator can only serialize public instance members.");

      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        throw new Error("@serialize decorator can't serialize symbol-named properties");

      const metadata: Metadata = _context.metadata;

      // determine serialization type
      let strategy: Metadata["serializables"][string];

      if (_function) {
        strategy = "function";
      } else if (_type == String || _type == Number || _type == Boolean || typeof _type == "object") { // primitive or enum 
        strategy = "primitive";
      } else if (_type == Node) {
        strategy = "node";
      } else if (_reconstruct) {
        strategy = "reconstruct";
      } else if (isSerializableResource(<SerializableResource>_type.prototype) && !_nested) {
        strategy = "resource";
      } else if (isSerializable(_type.prototype)) {
        strategy = "serializable";
      }

      if (!strategy)
        return;

      // add serialization type to metadata
      const serializables: Metadata["serializables"] = getOwnProperty(metadata, "serializables") ?? (metadata.serializables = { ...metadata.serializables });
      serializables[key] = strategy;
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

      let strategy: Metadata["serializables"][string] = serializables[key];
      if (Array.isArray(value))
        strategy += "Array";

      switch (strategy) {
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
        case "reconstruct":
          _serialization[key] = Serializer.serialize(value);
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

      let strategy: Metadata["serializables"][string] = serializables[key];
      if (Array.isArray(value))
        strategy += "Array";

      switch (strategy) {
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
        case "nodeArray":
          (nodePaths ??= {})[key] = value;
          break;
        case "function":
          Reflect.set(_instance, key, Serializer.getFunction(value));
          break;
        case "reconstruct":
          Reflect.set(_instance, key, await Serializer.deserialize(value));
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