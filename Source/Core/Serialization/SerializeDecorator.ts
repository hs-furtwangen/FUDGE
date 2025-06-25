namespace FudgeCore {
  /**
     * Decorator to mark properties of a {@link Serializable} for automatic serialization and editor configuration.
     * 
     * **Editor Configuration:**
     * Specify a type (constructor) for an attribute within a class's {@link Metadata | metadata}.
     * This allows the intended type of an attribute to be known by the editor (at runtime), making it:
     * - A valid drop target (e.g., for objects like {@link Node}, {@link Texture}, {@link Mesh}).
     * - Display the appropriate input element, even if the attribute has not been set (`undefined`).
     * 
     * **Serialization:**
     * The automatic serialization occurs after an instance's {@link Serializable.serialize} / {@link Serializable.deserialize} method was called.
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
  export function serialize<T extends Number | String | Boolean>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  // enum type
  export function serialize<T, E extends Record<keyof E, T>>(_enum: E): (_value: unknown, _context: ClassPropertyContext<Serializable, T>) => void;
  export function serialize(_constructor: Function | Object, _context?: ClassDecoratorContext): ((_value: unknown, _context: ClassPropertyContext) => void) | void {
    // decorate class
    if (_context) {
      let meta: Metadata = _context.metadata;

      const prototype: Serializable = (<Function>_constructor).prototype;

      // make getters enumerable
      if (meta.enumerateKeys) {
        const descriptor: PropertyDescriptor = { enumerable: true };
        for (const key of meta.enumerateKeys)
          Object.defineProperty(prototype, key, descriptor);
      }

      // override serialize and deserialize methods
      const originalSerialize: Serializable["serialize"] = prototype.serialize;
      const originalDeserialize: Serializable["deserialize"] = prototype.deserialize;
      const serializables: Metadata["serializables"] = meta.serializables;

      prototype.serialize = function (this: Serializable): Serialization {
        const serialization: Serialization = originalSerialize?.call(this) ?? {};

        for (const key in serializables) {
          let value: General = Reflect.get(this, key);
          if (value == null)
            continue;

          // TODO: use a functional approach similiar to AnimationPropertyBindings?
          switch (serializables[key]) {
            case "primitive":
              serialization[key] = value;
              break;
            case "serializable":
              serialization[key] = value.serialize();
              break;
            case "resource":
              serialization[key] = value.idResource;
              break;
            case "node":
              serialization[key] = Node.PATH_FROM_TO(<Component>this, value);
              break;
          }
        }

        return serialization;
      };

      prototype.deserialize = async function (this: Serializable, _serialization: Serialization): Promise<Serializable> {
        if (originalDeserialize)
          await originalDeserialize.call(this, _serialization);

        for (const key in serializables) {
          let value: General = _serialization[key];
          if (value == null)
            continue;

          switch (serializables[key]) {
            case "primitive":
              Reflect.set(this, key, value);
              break;
            case "serializable":
              await Reflect.get(this, key).deserialize(value);
              break;
            case "resource":
              Reflect.set(this, key, Project.resources[value] ?? await Project.getResource(value)); // await is costly so first try to get resource directly
              break;
            case "node":
              let instance: Component = <Component>this;
              const hndNodeDeserialized: EventListenerUnified = () => {
                const hndGraphDeserialized: EventListenerUnified = (_event: Event) => {
                  Reflect.set(this, key, Node.FIND(instance, value));
                  instance.node.removeEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
                  instance.node.removeEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);
                  instance.removeEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
                };
                instance.node.addEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
                instance.node.addEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);
              };
              instance.addEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
          }
        }

        return this;
      };

      return;
    }

    // decorate property
    return (_value, _context) => { // could cache the decorator function for each class
      if (typeof _context.name != "string")
        return;

      let meta: Metadata = _context.metadata;

      // add attribute type to metadata
      if (!Object.hasOwn(meta, "attributeTypes"))
        meta.attributeTypes = { ...meta.attributeTypes };
      meta.attributeTypes[_context.name] = _constructor;

      // determine serialization type and add to metadata
      let type: Metadata["serializables"][string];

      if (_constructor == String || _constructor == Number || _constructor == Boolean || typeof _constructor == "object") // primitive or enum
        type = "primitive";
      else if (_constructor == Node)
        type = "node";
      else if ((<SerializableResource>_constructor.prototype).isSerializableResource)
        type = "resource";
      else if ((<Function>_constructor).prototype.serialize && (<Function>_constructor).prototype.deserialize)
        type = "serializable";

      if (!type)
        return;

      if (!Object.hasOwn(meta, "serializables"))
        meta.serializables = { ...meta.serializables };
      meta.serializables[_context.name] = type;

      if (_context.kind != "getter")
        return;

      // mark getter to be made enumerable
      if (!Object.hasOwn(meta, "enumerateKeys"))
        meta.enumerateKeys = [];

      meta.enumerateKeys.push(_context.name);
    };
  }
}