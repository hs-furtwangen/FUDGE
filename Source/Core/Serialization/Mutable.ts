namespace FudgeCore {

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

    public static getMutableFromPath(_mutable: Mutable | MutableArray<unknown>, _path: string[]): Mutable | MutableArray<unknown> {
      for (let i: number = 0; i < _path.length; i++)
        _mutable = Reflect.get(_mutable, _path[i]);

      return _mutable;
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
      const mutator: Mutator = {};
      // opt-in for decorated properties. Maybe this should be the default behavior instead of the old opt-out solution?
      for (const key of Mutator.keys(this))
        mutator[key] = this[key];

      // collect primitive and mutable attributes
      for (let attribute in this) {
        const value: Object = this[attribute];
        if (value instanceof Function)
          continue;
        if (value instanceof Object && !(value instanceof Mutable) && !(value instanceof MutableArray) && !(value.hasOwnProperty("idResource")))
          continue;

        mutator[attribute] = value;
      }

      if (!_extendable)
        // mutator can be reduced but not extended!
        Object.preventExtensions(mutator);
      // delete unwanted attributes
      this.reduceMutator(mutator);

      const references: ReadonlySet<string> = Mutator.references(this);
      // replace references to mutable objects with references to mutators
      for (let attribute in mutator) {
        let value: Object = mutator[attribute];
        if (references.has(attribute))
          continue; // do not replace references
        if (value instanceof Mutable || value instanceof MutableArray)
          mutator[attribute] = value.getMutator();
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
     * Returns an associative array with the same properties as the given mutator, but with the corresponding types as either string-values or map objects.
     * Does not recurse into objects! This will return the decorated {@link Metadata meta-types} instead of the inferred runtime-types of the object, if available.
     */
    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      const out: MutatorAttributeTypes = {};
      const metaTypes: MutatorTypes = Mutator.types(this);
      for (const key in _mutator) {
        const metaType: Function | Record<string, unknown> = metaTypes[key];
        let type: string | object;
        switch (typeof metaType) {
          case "function":
            type = metaType.name;
            break;
          case "object":
            type = metaType;
            break;
          case "undefined":
            let value: number | boolean | string | object | Function = _mutator[key];
            if (value != undefined)
              if (typeof value == "object")
                type = (<General>this)[key].constructor.name;
              else if (typeof value == "function")
                type = value.name;
              else
                type = value.constructor.name;
            break;
        }

        out[key] = type;
      }

      return out;
    }

    /**
     * Updates the values of the given mutator according to the current state of the instance
     * @deprecated Use {@link updateMutator} instead.
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

    //TODO: remove the _selection parameter, seems to be unused and adds a lot of boilerplate...
    /**
     * Updates the attribute values of the instance according to the state of the mutator.
     * The mutation may be restricted to a subset of the mutator and the event dispatching suppressed.
     * Uses mutateBase, but can be overwritten in subclasses
     */
    public mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): void | Promise<void>; // allow sync or async overrides
    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await this.mutateBase(_mutator, _selection);
      if (_dispatchMutate)
        this.dispatchEvent(new CustomEvent(EVENT.MUTATE, { bubbles: true, detail: { mutator: _mutator } }));
    }

    /**
     * Updates the property values of the instance according to the state of the animation mutator. Override to implement custom animation behavior.
     */
    public animate(_mutator: AnimationMutator): void {
      for (let key in _mutator) { // AnimationPropertyBindings have already checked the existence of the keys
        const valueArray: Float32Array = _mutator[key];
        if (valueArray.length == 1)
          (<General>this)[key] = valueArray[0];
        else
          (<General>this)[key].setArray(valueArray);
      }
    }

    /**
     * Synchronous implementation of {@link mutate}.
     * Override {@link mutate} with a sync implementation and call this method from it to mutate synchronously.
     */
    protected mutateSync(_mutator: Mutator, _dispatchMutate: boolean = true): void {
      let mutator: Mutator = _mutator;

      for (let attribute in mutator) {
        let mutant: Object = Reflect.get(this, attribute);
        if (mutant instanceof MutableArray || mutant instanceof Mutable)
          mutant.mutate(mutator[attribute], null, false);
        else
          Reflect.set(this, attribute, mutator[attribute]);
      }

      if (_dispatchMutate)
        this.dispatchEvent(new CustomEvent(EVENT.MUTATE, { bubbles: true, detail: { mutator: _mutator } }));
    };

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

      const references: ReadonlySet<string> = Mutator.references(this);
      for (let attribute in mutator) {
        if (!Reflect.has(this, attribute))
          continue;
        let mutant: Object = Reflect.get(this, attribute);
        let value: Mutator = <Mutator>mutator[attribute];


        if (value != null && !references.has(attribute) && (mutant instanceof MutableArray || mutant instanceof Mutable))
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
