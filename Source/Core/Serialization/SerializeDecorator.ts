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
  // class decorator
  export function serialize(_value: abstract new (...args: General[]) => Serializable, _context: ClassDecoratorContext): void;
  // object type, check if the actual type is assignable to the given type
  export function serialize<T, C extends abstract new (...args: General[]) => T>(_constructor: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : Serializable : Serializable, T>) => void;
  // primitive type, check if the given type (a primitive constructor) is assignable to the actual type (primitive).
  export function serialize<T extends Number | String | Boolean>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  // enum type
  export function serialize<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  export function serialize(_constructorOrType: Function | Object, _context?: ClassDecoratorContext): ((_value: unknown, _context: ClassPropertyContext) => void) | void {
    if (_context)
      return decorateClass(<Function>_constructorOrType, _context);
    else
      return decorateProperty(_constructorOrType);
  }

  function decorateClass(_constructor: Function, _context?: ClassDecoratorContext): void {
    const metadata: Metadata = _context.metadata;
    const enumerables: Metadata["enumerables"] = metadata.enumerables;
    const prototype: Serializable = _constructor.prototype;
    if (enumerables) {  // make getters enumerable
      const descriptor: PropertyDescriptor = { enumerable: true };
      for (const key of enumerables)
        if (Object.hasOwn(prototype, key))
          Object.defineProperty(prototype, key, descriptor);
    }
  }

  function decorateProperty(_type: Function | Object): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      if (_context.static || _context.private)
        throw new Error("@serialize decorator can only serialize public instance members.");

      const key: PropertyKey = _context.name;
      if (typeof key === "symbol")
        throw new Error("@serialize decorator can't serialize symbol-named properties");

      const metadata: Metadata = _context.metadata;

      // add type to metadata
      const attributeTypes: Metadata["attributeTypes"] = getOwnProperty(metadata, "attributeTypes") ?? (metadata.attributeTypes = { ...metadata.attributeTypes });
      attributeTypes[key] = _type;

      // determine serialization type
      let serializationStrategy: Metadata["serializables"][string];

      if (_type == String || _type == Number || _type == Boolean || typeof _type == "object") { // primitive or enum 
        serializationStrategy = "primitive";
      } else if (_type == Node) {
        serializationStrategy = "node";
      } else if ((<SerializableResource>_type.prototype).isSerializableResource) {
        serializationStrategy = "resource";
      } else if ((<Serializable>_type.prototype).serialize && (<Serializable>_type.prototype).deserialize) {
        if ((<Serializable>_type.prototype).deserialize.constructor.name == "AsyncFunction") {
          serializationStrategy = "serializableAsync";
        } else {
          serializationStrategy = "serializableSync";
        }
      }

      if (!serializationStrategy)
        return;

      // add serialization type to metadata
      const serializables: Metadata["serializables"] = getOwnProperty(metadata, "serializables") ?? (metadata.serializables = { ...metadata.serializables });
      serializables[key] = serializationStrategy;

      if (_context.kind != "getter")
        return;

      // mark getter to be made enumerable
      const enumerables: Metadata["enumerables"] = getOwnProperty(metadata, "enumerables") ?? (metadata.enumerables = []);
      enumerables.push(key);
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
        case "serializableSync":
        case "serializableAsync":
          _serialization[key] = value.serialize();
          break;
        case "resource":
          _serialization[key] = value.idResource;
          break;
        case "node":
          _serialization[key] = Node.PATH_FROM_TO(<Component>_instance, value);
          break;
      }
    }

    return _serialization;
  };

  const nodeListeners: WeakSet<Component> = new WeakSet();
  const graphListeners: WeakSet<Component> = new WeakSet();

  /**
   * Deserialize the {@link serialize decorated properties} of an instance from a {@link Serialization} object.
   */
  export async function deserializeDecorations<T extends object>(_instance: T, _serialization: Serialization): Promise<T> {
    const serializables: Metadata["serializables"] = getMetadata(_instance).serializables;
    for (const key in serializables) {
      let value: General = Reflect.get(_serialization, key);
      if (value == null)
        continue;

      switch (serializables[key]) {
        case "primitive":
          Reflect.set(_instance, key, value);
          break;
        case "serializableSync":
          (<Serializable>Reflect.get(_instance, key)).deserialize(value);
          break;
        case "serializableAsync":
          await (<Serializable>Reflect.get(_instance, key)).deserialize(value);
          break;
        case "resource":
          Reflect.set(_instance, key, Project.resources[value] ?? await Project.getResource(value)); // await is costly so first try to get resource directly
          break;
        case "node":
          const componentInstance: Component = <Component>_instance;

          if (nodeListeners.has(componentInstance))
            break;

          nodeListeners.add(componentInstance);

          const hndNodeDeserialized: EventListenerUnified = () => {
            const node: Node = componentInstance.node;

            if (graphListeners.has(componentInstance))
              return;

            graphListeners.add(componentInstance);

            const hndGraphDeserialized: EventListenerUnified = (_event: Event) => {
              Reflect.set(componentInstance, key, Node.FIND(componentInstance, value));

              node.removeEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
              node.removeEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);
              graphListeners.delete(componentInstance);
            };

            node.addEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
            node.addEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);

            componentInstance.removeEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
            nodeListeners.delete(componentInstance);
          };

          componentInstance.addEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
      }
    }

    return _instance;
  };
}