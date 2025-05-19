// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
namespace FudgeCore {
  /** 
   * Superclass for all {@link Component}s that can be attached to {@link Node}s.
   * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jascha Karagöl, HFU, 2019  
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
   */
  export abstract class Component extends Mutable implements Serializable, Gizmo {
    /** subclasses get a iSubclass number for identification */
    public static readonly iSubclass: number;
    /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    public static readonly baseClass: typeof Component = Component;
    /** list of all the subclasses derived from this class, if they registered properly*/
    public static readonly subclasses: typeof Component[] = [];

    protected singleton: boolean = true;
    protected active: boolean = true;
    #node: Node | null = null;

    public constructor() {
      super();
      this.addEventListener(EVENT.MUTATE, (_event: CustomEvent) => {
        if (this.#node) {
          // TODO: find the number of the component in the array if not singleton
          _event.detail.component = this;
          //@ts-ignore
          _event.detail.componentIndex = this.node.getComponents(this.constructor).indexOf(this);
          this.#node.dispatchEvent(_event);
        }
      });
    }

    protected static registerSubclass(_subclass: typeof Component): number { return Component.subclasses.push(_subclass) - 1; }

    public get isActive(): boolean {
      return this.active;
    }

    /**
     * Is true, when only one instance of the component class can be attached to a node
     */
    public get isSingleton(): boolean {
      return this.singleton;
    }

    /**
     * Retrieves the node, this component is currently attached to
     */
    public get node(): Node | null {
      return this.#node;
    }

    /**
     * De- / Activate this component. Inactive components will not be processed by the renderer.
     */
    public activate(_on: boolean): void {
      this.active = _on;
      const event: RecyclableEvent = RecyclableEvent.get(_on ? EVENT.COMPONENT_ACTIVATE : EVENT.COMPONENT_DEACTIVATE);
      this.dispatchEvent(event);
      RecyclableEvent.store(event);
    }

    /**
     * Tries to attach the component to the given node, removing it from the node it was attached to if applicable
     */
    public attachToNode(_container: Node | null): void {
      if (this.#node == _container)
        return;
      let previousContainer: Node = this.#node;
      try {
        if (previousContainer)
          previousContainer.removeComponent(this);
        this.#node = _container;
        if (this.#node)
          this.#node.addComponent(this);
      } catch (_error) {
        this.#node = previousContainer;
      }
    }

    /**
     * Called by a {@link AnimationSystem.ComponentAnimation} after animating this components properties. Override to implement custom animation behavior.
     */
    public onAnimate?(): void;

    /**
     * Override this to draw visual aids for this component inside the editors render view. Use {@link Gizmos} inside the override to draw stuff.
     */
    public drawGizmos?(_cmpCamera?: ComponentCamera): void;

    /**
     * See {@link drawGizmos}. Only displayed while the corresponding node is selected.
     */
    public drawGizmosSelected?(_cmpCamera?: ComponentCamera): void;

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = {
        active: this.active
      };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.activate(_serialization.active);
      return this;
    }

    public mutate(_mutator: Mutator, _selection?: string[], _dispatchMutate?: boolean): void | Promise<void>; // allow sync or async overrides
    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _selection, _dispatchMutate);
      if (_mutator.active != undefined)
        this.activate(_mutator.active);
    }

    protected mutateSync(_mutator: Mutator, _dispatchMutate: boolean = true): void {
      super.mutateSync(_mutator, _dispatchMutate);
      if (_mutator.active != undefined)
        this.activate(_mutator.active);
    }

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.singleton;
      delete _mutator.mtxWorld;
    }

    //#endregion
  }
}