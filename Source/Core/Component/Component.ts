// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
namespace FudgeCore {
  /** 
   * Superclass for all {@link Component}s that can be attached to {@link Node}s.
   * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jascha Karagöl, HFU, 2019 | Jonas Plotzky, HFU, 2025
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

    #active: boolean = true;
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

    /**
     * @deprecated use {@link active} instead.
     */
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
    @order(0)
    @edit(Boolean) 
    public get active(): boolean {
      return this.#active;
    }

    public set active(_on: boolean) {
      this.activate(_on);
    }

    /**
     * De- / Activate this component. Inactive components will not be processed by the renderer.
     */
    public activate(_on: boolean): void {
      this.#active = _on;
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
     * Override this to draw visual aids for this component inside the editors render view. Use {@link Gizmos} inside the override to draw stuff.
     */
    public drawGizmos?(_cmpCamera?: ComponentCamera): void;

    /**
     * See {@link drawGizmos}. Only displayed while the corresponding node is selected.
     */
    public drawGizmosSelected?(_cmpCamera?: ComponentCamera): void;

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public deserialize(_serialization: Serialization): Promise<Serializable> {
      return deserializeDecorations(this, _serialization);
    }
  }
}