namespace FudgeCore {
  /**
   * Interface describing the datatypes of the attributes a mutator as strings 
   */
  export interface MutatorAttributeTypes {
    [attribute: string]: string | Object;
  }
  /**
   * Interface describing a mutator, which is an associative array with names of attributes and their corresponding values
   */
  export interface Mutator {
    [attribute: string]: General;
  }

  /*
   * Interfaces dedicated for each purpose. Extra attribute necessary for compiletime type checking, not existent at runtime
   */
  export interface MutatorForAnimation extends Mutator { readonly forAnimation: null }
  export interface MutatorForUserInterface extends Mutator { readonly forUserInterface: null }
  // export interface MutatorForComponent extends Mutator { readonly forUserComponent: null; }

  /**
   * Collect applicable attributes of the instance and copies of their values in a Mutator-object
   */
  export function getMutatorOfArbitrary(_object: Object): Mutator {
    let mutator: Mutator = {};
    let attributes: (string | number | symbol)[] = Reflect.ownKeys(Reflect.getPrototypeOf(_object));
    for (let attribute of attributes) {
      let value: Object = Reflect.get(_object, attribute);
      if (value instanceof Function)
        continue;
      // if (value instanceof Object && !(value instanceof Mutable))
      //   continue;
      mutator[attribute.toString()] = value;
    }
    return mutator;
  }

  // @ts-ignore - as of now we need to polyfill the symbol to make decorator metadata work, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata
  Symbol.metadata ??= Symbol("Symbol.metadata");

  /**
   * Association of an attribute with its specified type (constructor).
   * @see {@link Metadata}.
   */
  export type MetaAttributeTypes = Record<string | symbol, Function>;

  /**
   * Metadata for classes extending {@link Mutable}. Metadata needs to be explicitly specified using decorators.
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#decorator-metadata | type script 5.2 feature "decorator metadata"} for additional information.
   */
  export interface Metadata extends DecoratorMetadataObject {
    /**
     * The specified types of the attributes of a class. Use the {@link type} decorator to add type information to the metadata of a class.
     */
    attributeTypes?: MetaAttributeTypes;
    enumerableKeys?: string[];

    /**
     * Map of property names to the type of serialization that should be used for that property.
     */
    serializables?: { [key: string]: "primitve" | "serializable" | "resource" | "node" };
    implements?: Set<Function>;
  }

  /**
   * Decorator to specify a type (constructor) for an attribute within a class's {@link Metadata | metadata}.
   * This allows the intended type of an attribute to be known at runtime, making it a valid drop target in the editor.
   *
   * **Note:** Attributes with a specified meta-type will always be included in the {@link Mutator base-mutator} 
   * (via {@link Mutable.getMutator}), regardless of their own type. Non-{@link Mutable mutable} objects 
   * will be displayed via their {@link toString} method in the editor.
   */
  export function type<T>(_constructor: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassFieldDecoratorContext<unknown, T> | ClassGetterDecoratorContext<unknown, T> | ClassAccessorDecoratorContext<unknown, T>) => void {
    return (_value, _context) => { // could cache the decorator function for each class
      let meta: Metadata = _context.metadata;
      if (!Object.hasOwn(meta, "attributeTypes"))
        meta.attributeTypes = { ...meta.attributeTypes };
      meta.attributeTypes[_context.name] = _constructor;
    };
  }

  /**
   * Decorator for making getters in a {@link Mutable} class enumerable. This ensures that the getters are included in mutators and are subsequently displayed in the editor.
   * 
   * **Usage:** Apply this decorator to both the getter method and the class to make it effective.
  */
  export function enumerable(_value: unknown, _context: ClassDecoratorContext | ClassGetterDecoratorContext | ClassAccessorDecoratorContext): void {
    // _context.addInitializer(function (this: unknown) { // this is run per instance... ideally we would want to run this once per class
    //   const prototype: unknown = Object.getPrototypeOf(this);
    //   const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(prototype, _context.name);
    //   if (descriptor && descriptor.enumerable == false)
    //     Object.defineProperty(prototype, _context.name, { enumerable: true });
    // });

    let metadata: Metadata = _context.metadata;
    if (_context.kind == "getter" || _context.kind == "accessor") {
      if (typeof _context.name != "string")
        return;

      if (!Object.hasOwn(metadata, "enumerableKeys"))
        metadata.enumerableKeys = [];

      metadata.enumerableKeys.push(_context.name.toString());
      return;
    }

    if (_context.kind == "class") {
      if (metadata.enumerableKeys)
        for (const key of metadata.enumerableKeys)
          Object.defineProperty((<Function>_value).prototype, key, { enumerable: true });
      return;
    }
  }

  /**
   * Base class for all types that are mutable using {@link Mutator}-objects, thus providing and using interfaces created at runtime.
   * 
   * Mutables provide a {@link Mutator} built by collecting all their applicable enumerable properties. By default, this includes only primitive types and nested mutable objects.
   * Using the {@link type}-decorator can also include non-mutable objects, which will be displayed via their {@link toString} method in the editor.
   * 
   * Subclasses can either reduce the standard {@link Mutator} built by this base class by deleting properties or implement an individual getMutator method.
   * The provided properties of the {@link Mutator} must match public properties or getters/setters of the object.
   * Otherwise, they will be ignored unless handled by an override of the mutate method in the subclass, and will throw errors in an automatically generated user interface for the object.
   */
  export abstract class Mutable extends EventTargetUnified {
    /**
     * Decorator allows to attach {@link Mutable} functionality to existing classes. 
     */
    // public static decorate(_constructor: Function): void {
    //   Object.defineProperty(_constructor.prototype, "useRenderData", {
    //     value: function getMutator(this: MutableForUserInterface): Mutator {
    //       return getMutatorOfArbitrary(this);
    //     }
    //   });
    // }

    public static getMutatorFromPath(_mutator: Mutator, _path: string[]): Mutator {
      let key: string = _path[0];
      let mutator: Mutator = {};
      if (_mutator[key] == undefined) // if the path deviates from mutator structure, return the mutator
        return _mutator;
      mutator[key] = _mutator[key];
      if (_path.length > 1)
        mutator[key] = Mutable.getMutatorFromPath(mutator[key], _path.slice(1, _path.length));
      return mutator;
    }

    /**
     * Retrieves the type of this mutable subclass as the name of the runtime class
     * @returns The type of the mutable
     */
    public get type(): string {
      return this.constructor.name;
    }

    /**
     * Collect applicable attributes of the instance and copies of their values in a Mutator-object.
     * By default, a mutator cannot be extended, since extensions are not available in the object the mutator belongs to.
     * A mutator may be reduced by the descendants of {@link Mutable} to contain only the properties needed.
     */
    public getMutator(_extendable: boolean = false): Mutator {
      let mutator: Mutator = {};

      // collect primitive and mutable attributes
      for (let attribute in this) {
        let value: Object = this[attribute];
        if (value instanceof Function)
          continue;
        if (value instanceof Object && !(value instanceof Mutable) && !(value instanceof MutableArray) && !(value.hasOwnProperty("idResource")) && this.getMetaAttributeTypes()[attribute] == undefined)
          continue;
        mutator[attribute] = value;
      }

      if (!_extendable)
        // mutator can be reduced but not extended!
        Object.preventExtensions(mutator);
      // delete unwanted attributes
      this.reduceMutator(mutator);

      // replace references to mutable objects with references to mutators
      for (let attribute in mutator) {
        let value: Object = mutator[attribute];
        if (value instanceof Mutable)
          mutator[attribute] = value.getMutator();
        if (value instanceof MutableArray)
          mutator[attribute] = value.map((_value) => _value.getMutator());
      }

      return mutator;
    }

    /**
     * Collect the attributes of the instance and their values applicable for animation.
     * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
     */
    public getMutatorForAnimation(_extendable: boolean = false): MutatorForAnimation {
      return <MutatorForAnimation>this.getMutator(_extendable);
    }

    /**
     * Collect the attributes of the instance and their values applicable for the user interface.
     * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
     */
    public getMutatorForUserInterface(_extendable: boolean = false): MutatorForUserInterface {
      return <MutatorForUserInterface>this.getMutator(_extendable);  // TODO: both of these (this and getMutatorForAnimation) don't really work as they don't recursively call getMutatorForUserInterface on sub-mutable objects, maybe instead implement a reduceMutatorForUserInterface???
    }

    /**
     * Collect the attributes of the instance and their values applicable for indiviualization by the component.
     * Basic functionality is identical to {@link getMutator}, returned mutator should then be reduced by the subclassed instance
     */
    // public getMutatorForComponent(): MutatorForComponent {
    //     return <MutatorForComponent>this.getMutator();
    // }
    /**
     * Returns an associative array with the same attributes as the given mutator, but with the corresponding types as string-values.
     * Does not recurse into objects! This will return the decorated {@link Metadata meta-type} instead of the runtime-type of the object, if available.
     */
    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = {};
      let metaTypes: MetaAttributeTypes = this.getMetaAttributeTypes();
      for (let attribute in _mutator) {
        let type: string = metaTypes[attribute]?.name;
        let value: number | boolean | string | object | Function = _mutator[attribute];

        if (value != undefined && type == undefined)
          if (typeof value == "object")
            type = (<General>this)[attribute].constructor.name;
          else if (typeof value == "function")
            type = value.name;
          else
            type = value.constructor.name;

        types[attribute] = type;
      }
      return types;
    }

    /**
     * Retrieves the specified {@link Metadata.attributeTypes | attribute types} from the {@link Metadata | metadata} of this instance's class.
     */
    public getMetaAttributeTypes(): MetaAttributeTypes {
      return this.getMetadata().attributeTypes ??= {};
    }

    /** 
     * Retrieves the {@link Metadata | metadata} of this instance's class.
     */
    public getMetadata(): Metadata {
      return this.constructor[Symbol.metadata] ??= {};
    }

    /**
     * Updates the values of the given mutator according to the current state of the instance
     * @param _mutator 
     */
    public updateMutator(_mutator: Mutator): void {
      for (let attribute in _mutator) {
        let value: Object = Reflect.get(this, attribute);
        if (value instanceof Mutable)
          value.updateMutator(_mutator[attribute]);
        else
          _mutator[attribute] = value;
      }
    }
    /**
     * Updates the attribute values of the instance according to the state of the mutator.
     * The mutation may be restricted to a subset of the mutator and the event dispatching suppressed.
     * Uses mutateBase, but can be overwritten in subclasses
     */
    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await this.mutateBase(_mutator, _selection);
      if (_dispatchMutate)
        this.dispatchEvent(new CustomEvent(EVENT.MUTATE, { bubbles: true, detail: { mutator: _mutator } }));
    }

    /**
     * Base method for mutation, always available to subclasses. Do not overwrite in subclasses!
     */
    protected async mutateBase(_mutator: Mutator, _selection?: string[]): Promise<void> {
      let mutator: Mutator = _mutator;

      if (_selection) { // TODO: this doesn't work as it does not recurse into objects
        mutator = {};
        for (let attribute of _selection) // reduce the mutator to the selection
          if (typeof (_mutator[attribute]) !== "undefined")
            mutator[attribute] = _mutator[attribute];
      }

      for (let attribute in mutator) {
        if (!Reflect.has(this, attribute))
          continue;
        let mutant: Object = Reflect.get(this, attribute);
        let value: Mutator = <Mutator>mutator[attribute];
        if (mutant instanceof MutableArray || mutant instanceof Mutable)
          await mutant.mutate(value, null, false);
        else
          Reflect.set(this, attribute, value);
      }
    }
    /**
     * Reduces the attributes of the general mutator according to desired options for mutation. To be implemented in subclasses
     * @param _mutator 
     */
    protected abstract reduceMutator(_mutator: Mutator): void;
  }
}
