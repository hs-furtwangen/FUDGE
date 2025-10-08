namespace FudgeCore {

  export interface IMutable {
    /**
     * Collect applicable attributes of the instance and copies of their values in a {@link Mutator}-object.
     * A mutator may be reduced by the descendants of {@link Mutable} to contain only the properties needed.
     */
    getMutator(_extendable?: boolean): Mutator;

    /**
     * Updates the attribute values of the instance according to the state of the given mutator.
     */
    mutate(_mutator: Mutator): void | Promise<void>;
  }

  export function isMutable(_object: Object): _object is IMutable {
    return typeof _object === "object" && _object != null && Reflect.has(_object, "getMutator") && Reflect.has(_object, "mutate");
  }

  /**
   * Base class for all types that are mutable using {@link Mutator}-objects, thus providing and using graphical interfaces created at runtime.
   * 
   * Mutables provide a {@link Mutator} built by collecting all their {@link mutate decorated properties}.
   * 
   * Subclasses can either reduce the standard {@link Mutator} built by this base class by deleting properties or implement an individual {@link Mutable.getMutator} method.
   * The provided properties of the {@link Mutator} must match public properties or getters/setters of the object.
   * Otherwise, they will be ignored unless handled by an override of the {@link Mutable.mutate} method in the subclass, and will throw errors in an automatically generated user interface for the object.
   */
  export abstract class Mutable extends EventTargetUnified implements IMutable {

    public static getMutableFromPath(_mutable: Mutable | MutableArray, _path: string[]): Mutable | MutableArray {
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
     * Uses {@link Mutator.fromDecorations}.
     */
    public getMutator(_extendable: boolean = false): Mutator {
      const mutator: Mutator = Mutator.fromDecorations(this);

      if (!_extendable)
        // mutator can be reduced but not extended!
        Object.preventExtensions(mutator);

      return mutator;
    }

    /**
     * Updates the attribute values of the instance according to the state of the mutator.
     * The the event dispatching may be suppressed.
     * Uses {@link Mutator.mutateDecorations}.
     */
    public mutate(_mutator: Mutator, _dispatchMutate?: boolean): void | Promise<void>; // allow sync or async overrides
    public async mutate(_mutator: Mutator, _dispatchMutate: boolean = true): Promise<void> {
      await Mutator.mutateDecorations(this, _mutator);

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
  }
}
