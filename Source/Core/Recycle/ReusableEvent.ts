namespace FudgeCore {
  /**
   * A subclass of {@link Event} that can be reused. TODO:
   * Exposes readonly properties of the event class as writable properties.
   * @author Jonas Plotzky, HFU, 2025
   */
  export class ReusableEvent extends Event {
    static #depot: { [type: string]: RecycableArray<ReusableEvent> } = {};
    static #init: EventInit = {};

    public readonly path: EventTarget[] = []; // for now use array, if constant resizing becomes a mermory problem find a better solution

    #target: EventTarget;
    #currentTarget: EventTarget;
    #eventPhase: Event["eventPhase"];

    private constructor(_type?: string, _init?: EventInit) {
      super(_type, _init);
      this.#reset();
    }

    public static get(_type: string, _bubbles: boolean = false, _cancelable: boolean = false): ReusableEvent {
      let event: ReusableEvent = ReusableEvent.#depot[`${_type}${_bubbles}${_cancelable}`]?.pop();
      if (event)
        return event.#reset();

      ReusableEvent.#init.bubbles = _bubbles;
      ReusableEvent.#init.cancelable = _cancelable;
      return new ReusableEvent(_type, ReusableEvent.#init);
    }

    public static store(_event: ReusableEvent): void {
      (ReusableEvent.#depot[`${_event.type}${_event.bubbles}${_event.cancelable}`] ??= new RecycableArray<ReusableEvent>()).push(_event);
    }

    public static dump(_type: string): void {
      ReusableEvent.#depot[_type] = new RecycableArray<ReusableEvent>();
    }

    public static dumpAll(): void {
      ReusableEvent.#depot = {};
    }

    public static [Symbol.hasInstance](_instance: unknown): boolean { // much faster than default instanceof
      return (<ReusableEvent>_instance).isReusableEvent;
    }

    /**
     * Flag for fast type checking.
     */
    public get isReusableEvent(): boolean {
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
     * @internal
     */
    public setTarget(_target: EventTarget): ReusableEvent {
      this.#target = _target;
      return this;
    }

    /**
     * Set the current target of the event. Used by the event system.
     * @returns A reference to this event.
     * @internal
     */
    public setCurrentTarget(_currentTarget: EventTarget): ReusableEvent {
      this.#currentTarget = _currentTarget;
      return this;
    }

    /**
     * Set the event phase of the event. Used by the event system.
     * @returns A reference to this event.
     * @internal
     */
    public setEventPhase(_eventPhase: Event["NONE"] | Event["CAPTURING_PHASE"] | Event["AT_TARGET"] | Event["BUBBLING_PHASE"]): ReusableEvent {
      this.#eventPhase = _eventPhase;
      return this;
    }

    #reset(): ReusableEvent {
      this.#target = null;
      this.#currentTarget = null;
      this.#eventPhase = Event.NONE;
      this.path.length = 0;
      return this;
    }
  }


}