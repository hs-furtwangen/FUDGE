namespace FudgeCore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type General = any;

  /**
   * Holds information needed to recreate an object identical to the one it originated from. 
   * A serialization is used to create copies of existing objects at runtime or to store objects as strings or recreate them.
   * 
   * The optional `@type` property specifies the fully qualified {@link Serializer.getFunctionPath type path} used by {@link Serializer.deserializeFlat} to restore the correct constructor.
   */
  export interface Serialization {
    [type: string]: General;

    /** The fully qualified type path used to reconstruct the serialized object. The type can be restored from the path using {@link Serializer.getFunction} */
    ["@type"]?: string;
  }

  /**
   * Generic type for a {@link Serialization} of a specific {@link Serializable} object.
   */
  export type SerializationOf<T extends Serializable> = { [K in keyof T]?: General };

  export interface Serializable {
    /**
     * Returns a {@link Serialization} of this object.
     */
    serialize(): Serialization;
    /**
     * Recreates this instance of {@link Serializable} with the information from the given {@link Serialization}.
     */
    deserialize(_serialization: Serialization): Promise<Serializable> | Serializable;
  }

  export function isSerializable(_object: Object): _object is Serializable {
    return (_object && Reflect.has(_object, "serialize") && Reflect.has(_object, "deserialize"));
  }

  interface NamespaceRegister {
    [name: string]: {
      [name: string]: General;
    };
  }

  /**
   * Handles the external serialization and deserialization of {@link Serializable} objects. The internal process is handled by the objects themselves.  
   * A {@link Serialization} object can be created from a {@link Serializable} object and a JSON-String may be created from that.  
   * Vice versa, a JSON-String can be parsed to a {@link Serialization} which can be deserialized to a {@link Serializable} object.
   * ```text
   *  [Serializable] → (serialize) → [Serialization] → (stringify) → [String] → (save or send)
   *                                        ↓                            ↓                  ↓         
   *                [Serializable] ← (deserialize) ← [Serialization] ← (parse) ← (load) ← [Medium]
   * ```      
   * While the internal serialize/deserialize method1s of the objects care of the selection of information needed to recreate the object and its structure,  
   * the {@link Serializer} keeps track of the namespaces and classes in order to recreate {@link Serializable} objects. The general structure of a {@link Serialization} is as follows  
   * ```text
   * {
   *      namespaceName.className: {
   *          propertyName: propertyValue,
   *          ...,
   *          propertyNameOfReference: SerializationOfTheReferencedObject,
   *          ...,
   *          constructorNameOfSuperclass: SerializationOfSuperClass
   *      }
   * }
   * ```
   * Since the instance of the superclass is created automatically when an object is created, 
   * the SerializationOfSuperClass omits the the namespaceName.className key and consists only of its value. 
   * The constructorNameOfSuperclass is given instead as a property name in the serialization of the subclass.
   */
  export abstract class Serializer {
    /** In order for the Serializer to create class instances, it needs access to the appropriate namespaces */
    private static namespaces: NamespaceRegister = { "ƒ": FudgeCore };

    /**
     * Registers a namespace to the {@link Serializer}, to enable automatic instantiation of classes defined within.
     */
    public static registerNamespace(_namespace: Object): string {
      for (let name in Serializer.namespaces)
        if (Serializer.namespaces[name] == _namespace)
          return name;

      let name: string = Serializer.findNamespaceIn(_namespace, window);
      if (!name)
        for (let parentName in Serializer.namespaces) {
          name = Serializer.findNamespaceIn(_namespace, Serializer.namespaces[parentName]);
          if (name) {
            name = parentName + "." + name;
            break;
          }
        }

      if (!name)
        throw new Error("Namespace not found. Maybe parent namespace hasn't been registered before?");

      Serializer.namespaces[name] = _namespace;
      return name;
    }

    /**
     * Serializes a FUDGE-object into a nested {@link Serialization} format:
     *
     * ```
     * { "<typePath>": { ...object data... } }
     * ```
     *
     * This format includes all information required for full reconstruction,
     * including components, children, and inherited data.
     */
    public static serialize(_object: Serializable): Serialization {
      const path: string = this.getFunctionPath(_object);
      return { [path]: _object.serialize() };
    }

    /**
     * Serializes a FUDGE-object into a flat {@link Serialization} format:
     *
     * ```
     * { "@type": "<typePath>", ...object data... }
     * ```
     *
     * The object can later be reconstructed using {@link Serializer.deserializeFlat}.
     */
    public static serializeFlat(_object: Serializable): Serialization {
      return { "@type": this.getFunctionPath(_object), ..._object.serialize() };
    }

    /**
     * Reconstructs an object serialized using {@link Serializer.serialize}.
     * @param _onConstruct (optional) A callback executed immediately after the object instance is created, but *before* its {@link Serializable.deserialize} method is invoked.
     * @returns Either the reconstructed object directly, or a `Promise` if the object's `deserialize` method performs asynchronous work.
     */
    public static deserialize<T extends Serializable = Serializable>(_serialization: Serialization, _onConstruct?: (_reconstruct: T, _serialization: Serialization) => void): Promise<T> | T {
      let reconstruct: T;
      let path: string;
      try {
        // loop constructed solely to access type-property. Only one expected!
        for (path in _serialization) {
          const serialization: Serialization = _serialization[path];
          reconstruct = Serializer.reconstruct(path);

          if (_onConstruct)
            _onConstruct(reconstruct, serialization);

          return <T>reconstruct.deserialize(serialization);
        }
      } catch (_error) {
        let message: string = `Deserialization of ${path}, ${reconstruct ? Reflect.get(reconstruct, "idResource") : ""} failed: ` + _error;
        throw new Error(message);
      }
      return null;
    }

    /**
     * Reconstructs an object serialized using {@link Serializer.serializeFlat}.
     * @param _onConstruct (optional) A callback executed immediately after the object instance is created, but *before* its {@link Serializable.deserialize} method is invoked.
     * @returns Either the reconstructed object directly, or a `Promise` if the object's `deserialize` method performs asynchronous work.
     */
    public static deserializeFlat<T extends Serializable = Serializable>(_serialization: Serialization, _onConstruct?: (_reconstruct: T, _serialization: Serialization) => void): Promise<T> | T {
      let reconstruct: T;
      try {
        reconstruct = Serializer.reconstruct(_serialization["@type"]);

        if (_onConstruct)
          _onConstruct(reconstruct, _serialization);

        return <T>reconstruct.deserialize(_serialization);
      } catch (_error) {
        let message: string = `Deserialization of ${_serialization["@type"]}, ${reconstruct ? Reflect.get(reconstruct, "idResource") : ""} failed: ` + _error;
        throw new Error(message);
      }
    }

    /**
     * Serializes an array of {@link Serializable} objects.
     * 
     * If a constructor type is provided, objects whose constructor matches exactly
     * are serialized **without type information** (`@type` field is omitted).
     * 
     * Objects of a different type include type information (`@type`)
     * to enable polymorphic reconstruction.
     */
    public static serializeArray<T extends Serializable = Serializable>(_serializables: T[], _type?: abstract new () => T): Serialization[] {
      const serializations: Serialization[] = new Array(_serializables.length);
      for (let i: number = 0; i < _serializables.length; i++) {
        const value: Serializable = _serializables[i];
        if (!value)
          continue;

        if (value.constructor == _type)
          serializations[i] = value.serialize(); // compact serialization if non polymorphic
        else
          serializations[i] = Serializer.serializeFlat(value);
      }

      return serializations;
    }

    /**
     * Deserializes an array of {@link Serializable} objects from an array of {@link Serialization}s.
     *
     * If a constructor type is provided, it is used to reconstruct objects
     * whose serializations **do not contain type information** (`@type` field is missing).
     * 
     * Serializations that include type information (`@type`) are deserialized via {@link Serializer.deserializeFlat},
     * enabling polymorphic reconstruction of mixed or derived types within the same array.
     */
    public static async deserializeArray<T extends Serializable = Serializable>(_serializations: Serialization[], _type?: new () => T): Promise<T[]> {
      // legacy support for old serializations. TODO: remove in future versions 
      if (!Array.isArray(_serializations))
        return this.deserializeArrayLegacy<T>(_serializations);

      const serializables: (Promise<Serializable> | Serializable)[] = new Array(_serializations.length);
      for (let i: number = 0; i < _serializations.length; i++) {
        const value: Serialization = _serializations[i];
        if (!value)
          continue;

        let serializable: Promise<Serializable> | Serializable;
        if (typeof value == "object" && "@type" in value) {
          serializable = Serializer.deserializeFlat(value);
        } else {
          if (!_type)
            throw new Error(`${Serializer.deserializeArray.name}: missing "_type" argument. Serialization at index "${i}" contains no "@type" information`);

          serializable = new _type();
          serializable = (<Serializable>serializable).deserialize(value);
        }

        serializables[i] = serializable;
      }

      return <Promise<T[]>>Promise.all(serializables);
    }

    /**
     * @deprecated Use {@link Serializer.deserializeArray} instead.
     */
    public static async deserializeArrayLegacy<T extends Serializable = Serializable>(_serialization: Serialization): Promise<T[]> {
      let serializables: Serializable[] = [];
      let construct: new () => Serializable;
      let serializations: Serialization[] = [];
      try {
        // loop constructed solely to access type-property. Only one expected!
        for (let path in _serialization) {
          construct = Serializer.getFunction(path);
          serializations = _serialization[path];
          break;
        }
      } catch (_error) {
        throw new Error("Deserialization failed: " + _error);
      }

      for (let serialization of serializations) {
        let serializable: Serializable = new construct();
        await serializable.deserialize(serialization);
        serializables.push(serializable);
      }

      return <T[]>serializables;
    }

    /**
     * Returns an array of resource IDs representing the given resources.
     */
    public static serializeResources(_resources: SerializableResource[]): string[] {
      const serializations: string[] = new Array(_resources.length);
      for (let i: number = 0; i < _resources.length; i++)
        serializations[i] = _resources[i]?.idResource;

      return serializations;
    }

    /**
     * Returns an array of resources retrieved with the given resource IDs.
     */
    public static async deserializeResources<T extends SerializableResource = SerializableResource>(_resourceIds: string[]): Promise<T[]> {
      const resources: SerializableResource[] = new Array(_resourceIds.length);
      for (let i: number = 0; i < _resourceIds.length; i++)
        resources[i] = Project.resources[_resourceIds[i]] ?? await Project.getResource(_resourceIds[i]);

      return <T[]>resources;
    }

    /**
     * Returns an array of paths to the given functions (constructors), if found in the {@link Serializer.registerNamespace registered namespaces}.
     */
    public static serializeFunctions(_functions: Function[]): string[] {
      const paths: string[] = new Array(_functions.length);
      for (let i: number = 0; i < _functions.length; i++)
        paths[i] = Serializer.getFunctionPath(_functions[i]);
      return paths;
    }

    /**
     * Returns an array of functions (constructors) from the given paths to functions, if found in the {@link Serializer.registerNamespace registered namespaces}.
     */
    public static deserializeFunctions<T extends Function = Function>(_paths: string[]): T[] {
      const constructors: Function[] = new Array(_paths.length);
      for (let i: number = 0; i < _paths.length; i++)
        constructors[i] = Serializer.getFunction(_paths[i]);
      return <T[]>constructors;
    }

    //TODO: implement prettifier to make JSON-Stringification of serializations more readable, e.g. placing x, y and z in one line
    /**
     * Prettify a JSON-String, to make it more readable.
     * not implemented yet
     */
    public static prettify(_json: string): string {
      const compactTypes = [Serializer.getFunctionPath(Vector2), Serializer.getFunctionPath(Vector3)];
      for (const type of compactTypes) {
        const pattern: RegExp = new RegExp(`{[^{}]*"@type"\\s*:\\s*"${type}"[^{}]*}`, "g");
        _json = _json.replace(pattern, (_m) => _m.replace(/\s+/g, ' '));
      }

      return _json;
    }

    /**
     * Returns a formatted, human readable JSON-String, representing the given {@link Serialization} that may have been created by {@link Serializer}.serialize
     * @param _serialization
     */
    public static stringify(_serialization: Serialization): string {
      console.log("stringify");
      // adjustments to serialization can be made here before stringification, if desired
      let json: string = JSON.stringify(_serialization, null, 2);
      let pretty: string = Serializer.prettify(json);
      return pretty;
    }

    /**
     * Returns a {@link Serialization} created from the given JSON-String. Result may be passed to {@link Serializer.deserialize}
     * @param _json 
     */
    public static parse(_json: string): Serialization {
      return JSON.parse(_json);
    }

    /**
     * Creates an object of the class defined with the full path including the namespaceName(s) and the className seperated by dots(.) 
     * @param _path 
     */
    public static reconstruct<T extends Serializable = Serializable>(_path: string): T {
      let constructor: new () => Serializable = Serializer.getFunction(_path);
      let reconstruction: T = <T>new constructor();
      return reconstruction;
    }

    /**
     * Returns the function (constructor) from the given path to a function, if found in the {@link registerNamespace registered namespaces}.
     */
    public static getFunction<T extends Function>(_path: string): T {
      const typeName: string = _path.substring(_path.lastIndexOf(".") + 1);
      const namespace: Object = Serializer.getNamespace(_path);
      if (!namespace)
        throw new Error(`Constructor of serializable object of type ${_path} not found. Maybe the namespace hasn't been registered?`);
      return (<General>namespace)[typeName];
    }

    /**
     * Returns the full path to a function (constructor), if found in the {@link registerNamespace registered namespaces}.
     * e.g. "FudgeCore.ComponentScript" or "MyNameSpace.MyScript"
     */
    public static getFunctionPath(_to: Serializable | Function): string {
      if (!((typeof _to == "function")))
        _to = _to.constructor;

      const typeName: string = _to.name;
      const namespaces: NamespaceRegister = Serializer.namespaces;
      for (let namespaceName in namespaces) {
        let found: Function = namespaces[namespaceName][typeName];
        if (found && _to == found)
          return namespaceName + "." + typeName;
      }

      throw new Error(`Namespace of serializable object of type ${_to.name} not found. Maybe the namespace hasn't been registered or the class not exported?`);
    }

    /**
     * Returns the namespace-object defined within the full path, if registered
     * @param _path
     */
    private static getNamespace(_path: string): Object {
      let namespaceName: string = _path.substr(0, _path.lastIndexOf("."));
      return Serializer.namespaces[namespaceName] || FudgeCore;
    }

    /**
     * Finds the namespace-object in properties of the parent-object (e.g. window), if present
     * @param _namespace 
     * @param _parent 
     */
    private static findNamespaceIn(_namespace: Object, _parent: Object): string {
      for (let prop in _parent)
        if ((<General>_parent)[prop] == _namespace)
          return prop;
      return null;
    }
  }

  /**
   * Creates a new (abstract) class implementing {@link SerializableResourceExternal} from any class that implements {@link SerializableResource} by mixing in the functionality to load the resource from an external source.
   * @internal 
   * @authors Jonas Plotzky, HFU, 2024
   */
  export function mixinSerializableResourceExternal<TBase extends abstract new (...args: General[]) => SerializableResource>(_base: TBase): (abstract new (...args: General[]) => SerializableResourceExternal) & TBase {
    abstract class SerializableResourceExternalMixin extends _base {
      public url: RequestInfo;

      public status: RESOURCE_STATUS = RESOURCE_STATUS.PENDING;

      /**
       * Returns a {@link Serialization} of this resource. Only the data needed to load it from the external source is serialized ("url", "name", "idResource").
       */
      public serialize(): Serialization {
        const serialization: Serialization = {
          idResource: this.idResource,
          name: this.name,
          type: this.type,
          url: this.url.toString()
        };
        return serialization;
      }

      public async deserialize(_serialization: Serialization): Promise<Serializable> {
        this.url = _serialization.url;
        this.name = _serialization.name;
        return this.load();
      }

      public abstract load(): Promise<SerializableResourceExternal>;
    };

    if (_base.prototype instanceof Mutable) {
      /**
       * Mixin the {@link Mutable} functionality into the class 
       * @authors Jonas Plotzky, HFU, 2024
       */
      function mixinMutableSerializableResourceExternal<TBase extends (abstract new (...args: General[]) => SerializableResourceExternal & Mutable)>(_base: TBase) { // eslint-disable-line
        abstract class MutableSerializableResourceExternal extends _base {
          public async mutate(_mutator: Mutator, _dispatchMutate?: boolean): Promise<void> {
            await super.mutate(_mutator, _dispatchMutate);
            if (_mutator.url != undefined)
              this.url = _mutator.url;
            if (_mutator.url != undefined || _mutator.name != undefined)
              await this.load();
          }
        }

        return MutableSerializableResourceExternal;
      }

      return mixinMutableSerializableResourceExternal(<TBase & (abstract new (...args: General[]) => SerializableResourceExternal & Mutable)>SerializableResourceExternalMixin);
    }

    return SerializableResourceExternalMixin;
  }
}