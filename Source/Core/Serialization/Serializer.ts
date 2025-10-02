namespace FudgeCore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type General = any;

  /**
   * Holds information needed to recreate an object identical to the one it originated from. 
   * A serialization is used to create copies of existing objects at runtime or to store objects as strings or recreate them.
   */
  export interface Serialization {
    [type: string]: General;
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
     * Returns a javascript object representing the serializable FUDGE-object given,
     * including attached components, children, superclass-objects all information needed for reconstruction
     * @param _object An object to serialize, implementing the {@link Serializable} interface
     */
    public static serialize(_object: Serializable): Serialization {
      // TODO: save the namespace with the constructors name
      const path: string = this.getFunctionPath(_object);
      return { [path]: _object.serialize() };
    }

    /**
     * Returns a FUDGE-object reconstructed from the information in the {@link Serialization} given,
     * including attached components, children, superclass-objects
     */
    public static async deserialize<T extends Serializable = Serializable>(_serialization: Serialization): Promise<T> {
      let reconstruct: Serializable;
      let path: string;
      try {
        // loop constructed solely to access type-property. Only one expected!
        for (path in _serialization) {
          reconstruct = Serializer.reconstruct(path);
          reconstruct = await reconstruct.deserialize(_serialization[path]);

          return <T>reconstruct;
        }
      } catch (_error) {
        let message: string = `Deserialization of ${path}, ${reconstruct ? Reflect.get(reconstruct, "idResource") : ""} failed: ` + _error;
        throw new Error(message);
      }
      return null;
    }

    /**
    * Serializes an array of {@link Serializable} objects.
    * By default, the method creates an array of {@link Serialization}s, each with type information.
    * If all objects are of the same type, pass the constructor to create a more compact serialization.
    * @param _constructor If given, all objects are expected to be of this type.
    */
    public static serializeArray<T extends Serializable = Serializable>(_serializables: T[], _constructor?: new () => T): Serialization[] {
      const serializations: Serialization[] = new Array(_serializables.length);
      if (_constructor)
        for (let i: number = 0; i < _serializables.length; i++)
          serializations[i] = _serializables[i].serialize();
      else
        for (let i: number = 0; i < _serializables.length; i++)
          serializations[i] = Serializer.serialize(_serializables[i]);

      return serializations;
    }

    /**
     * Deserializes an array of {@link Serializable} objects from an array of {@link Serialization}s.
     * By default, the method expects an array of {@link Serialization}s, each with type information.
     * If all objects are of the same type and serialized without type information, pass the constructor to deserialize them.
     * @param _constructor If given, all objects are expected to be of this type and the serializations are expected to be without type information.
     */
    public static async deserializeArray<T extends Serializable = Serializable>(_serializations: Serialization[], _constructor?: new () => T): Promise<T[]> {
      const serializables: (Promise<Serializable> | Serializable)[] = new Array(_serializations.length);
      if (!Array.isArray(_serializations)) 
        return this.deserializeArrayLegacy<T>(_serializations); // legacy support for old serializations. TODO: remove in future versions 
      
      if (_constructor)
        for (let i: number = 0; i < _serializations.length; i++)
          serializables[i] = new _constructor().deserialize(_serializations[i]);
      else
        for (let i: number = 0; i < _serializations.length; i++)
          serializables[i] = Serializer.deserialize(_serializations[i]);

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
        serializations[i] = _resources[i].idResource;

      return serializations;
    }

    /**
     * Returns an array of resources retrieved with the given resource IDs.
     */
    public static async deserializeResources<T extends SerializableResource = SerializableResource>(_resourceIds: string[]): Promise<T[]> {
      const resources: (Promise<SerializableResource> | SerializableResource)[] = new Array(_resourceIds.length);
      for (let i: number = 0; i < _resourceIds.length; i++)
        resources[i] = Project.resources[_resourceIds[i]] ?? Project.getResource(_resourceIds[i]);

      return <Promise<T[]>>Promise.all(resources);
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
    public static prettify(_json: string): string { return _json; }

    /**
     * Returns a formatted, human readable JSON-String, representing the given {@link Serialization} that may have been created by {@link Serializer}.serialize
     * @param _serialization
     */
    public static stringify(_serialization: Serialization): string {
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
    public static reconstruct(_path: string): Serializable {
      let constructor: new () => Serializable = Serializer.getFunction(_path);
      let reconstruction: Serializable = new constructor();
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
        Project.register(this, _serialization.idResource);
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