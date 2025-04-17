namespace FudgeCore {
  /**
   * A subclass of {@link Event} that can be (re)used via {@link RecyclableEvent.get} and {@link RecyclableEvent.store} to avoid garbage collection.
   * If dispatched repeatedly without recycling through get/store, call {@link recycle} manually before each dispatch.
   * Exposes some readonly properties of the event class as writable properties for the event system.
   * 
   * **Example get/store**:
   * ```typescript
   * import f = FudgeCore;
   * const node: f.Node = new f.Node("Node");
   * const event: f.RecyclableEvent = f.RecyclableEvent.get("myevent", true); // get event from depot
   * node.dispatchEvent(event);
   * f.RecyclableEvent.store(event); // store event in depot for reuse
   * ```
   * 
   * **Example manual recycle**:
   * ```typescript
   * import f = FudgeCore;
   * const node: f.Node = new f.Node("Node");
   * const event: f.RecyclableEvent = f.RecyclableEvent.get("myevent", true); // get event and cache it
   *
   * // called repeatedly, e.g. in a loop
   * function update(): void {
   *   node.dispatchEvent(event.recycle()); // recycle the event before each dispatch
   * }
   * ```
   * @author Jonas Plotzky, HFU, 2025
   */
  export class RecyclableEvent extends Event {
    static #depot: { [type: string]: RecycableArray<RecyclableEvent> } = {};
    static #init: EventInit = {};

    public readonly path: EventTarget[] = []; // for now use array, if constant resizing becomes a mermory problem find a better solution

    #target: EventTarget;
    #currentTarget: EventTarget;
    #eventPhase: Event["eventPhase"];

    public constructor(_type: string, _bubbles: boolean = false, _cancelable: boolean = false) {
      RecyclableEvent.#init.bubbles = _bubbles;
      RecyclableEvent.#init.cancelable = _cancelable;
      super(_type, RecyclableEvent.#init);
    }

    /**
     * Fetches an event of the requested type and initialization from the depot. If the depot for the requested type is empty it returns a new instance.
     * Use {@link RecyclableEvent.store} after dispatching the event to store it for reuse.
     */
    public static get(_type: string, _bubbles: boolean = false, _cancelable: boolean = false): RecyclableEvent {
      return RecyclableEvent.#depot[`${_type}${_bubbles}${_cancelable}`]?.pop()?.recycle() ?? new RecyclableEvent(_type, _bubbles, _cancelable);
    }

    /**
     * Stores the event in the depot for later reuse.
     */
    public static store(_event: RecyclableEvent): void {
      (RecyclableEvent.#depot[`${_event.type}${_event.bubbles}${_event.cancelable}`] ??= new RecycableArray<RecyclableEvent>()).push(_event);
    }

    /**
     * Emptys the depot of a given type, leaving the events for the garbage collector.
     */
    public static dump(_type: string, _bubbles: boolean = false, _cancelable: boolean = false): void {
      delete RecyclableEvent.#depot[`${_type}${_bubbles}${_cancelable}`];
    }

    /**
     * Emptys all depots, leaving all events to the garbage collector.
     */
    public static dumpAll(): void {
      RecyclableEvent.#depot = {};
    }

    public static [Symbol.hasInstance](_instance: unknown): boolean { // much faster than default instanceof
      return (<RecyclableEvent>_instance).isRecyclableEvent;
    }

    /**
     * Flag for fast type checking.
     */
    public get isRecyclableEvent(): boolean {
      return true;
    }

    public get target(): EventTarget {
      return this.#target ?? super.target;
    }

    public get currentTarget(): EventTarget {
      return this.#currentTarget ?? super.currentTarget;
    }

    public get eventPhase(): Event["eventPhase"] {
      return this.#eventPhase ?? super.eventPhase;
    }

    /**
     * Set the target of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setTarget(_target: EventTarget): RecyclableEvent {
      this.#target = _target;
      return this;
    }

    /**
     * Set the current target of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setCurrentTarget(_currentTarget: EventTarget): RecyclableEvent {
      this.#currentTarget = _currentTarget;
      return this;
    }

    /**
     * Set the event phase of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setEventPhase(_eventPhase: Event["NONE"] | Event["CAPTURING_PHASE"] | Event["AT_TARGET"] | Event["BUBBLING_PHASE"]): RecyclableEvent {
      this.#eventPhase = _eventPhase;
      return this;
    }

    /**
     * Reset the event to default values. Used by the event system.
     * @returns A reference to this event.
     */
    public recycle(): RecyclableEvent {
      this.#target = null;
      this.#currentTarget = null;
      this.#eventPhase = null;
      this.path.length = 0;
      return this;
    }
  }
}