namespace FudgeCore {
  type Writable<T, K extends keyof T> = Omit<T, K> & { -readonly [P in K]: T[P] };
  type WritableEvent = Writable<Event, "type" | "target" | "currentTarget" | "eventPhase" | "bubbles" | "cancelable">;

  /**
   * A subclass of {@link Event} that can be reused via the {@link Recycler} to reduce the number of event objects created.
   * Exposes readonly properties of the event class as writable properties.
   * @author Jonas Plotzky, HFU, 2025
   */
  export class RecyclableEvent extends Event implements Recycable {
    static readonly #descriptor: PropertyDescriptor = { writable: true };

    public constructor(_type?: string, _init?: EventInit) {
      super(_type, _init);
      this.#makeWritable("bubbles");
      this.#makeWritable("cancelable");
      this.#makeWritable("currentTarget");
      this.#makeWritable("eventPhase");
      this.#makeWritable("target");
      this.#makeWritable("type");
    }

    /**
     * Returns a event of the specified type with the specified options from the {@link Recycler}. See {@link Event} constructor for details on the parameters.
     */
    public static GET(_type: string, _bubbles: boolean = false, _cancelable: boolean = false): RecyclableEvent {
      return Recycler.get(RecyclableEvent).set(_type, _bubbles, _cancelable);
    }

    /**
     * Flag for fast type checking.
     */
    public get isRecyclableEvent(): boolean {
      return true;
    }

    public recycle(this: WritableEvent): void {
      this.type = null;
      this.target = null;
      this.currentTarget = null;
      this.bubbles = false;
      this.eventPhase = 0;
    }

    /**
     * Set the type and options of the event. See {@link Event} constructor for details.
     * @returns A reference to this event.
     */
    public set(this: WritableEvent, _type: string, _bubbles: boolean = false, _cancelable: boolean = false): RecyclableEvent {
      this.type = _type;
      this.bubbles = _bubbles;
      this.cancelable = _cancelable;
      return <RecyclableEvent>this;
    }

    /**
     * Set the target of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setTarget(this: WritableEvent, _target: EventTarget): RecyclableEvent {
      this.target = _target;
      return <RecyclableEvent>this;
    }

    /**
     * Set the current target of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setCurrentTarget(this: WritableEvent, _currentTarget: EventTarget): RecyclableEvent {
      this.currentTarget = _currentTarget;
      return <RecyclableEvent>this;
    }

    /**
     * Set the event phase of the event. Used by the event system.
     * @returns A reference to this event.
     */
    public setEventPhase(this: WritableEvent, _eventPhase: Event["NONE"] | Event["CAPTURING_PHASE"] | Event["AT_TARGET"] | Event["BUBBLING_PHASE"]): RecyclableEvent {
      this.eventPhase = _eventPhase;
      return <RecyclableEvent>this;
    }

    #makeWritable(_key: keyof this): void {
      RecyclableEvent.#descriptor.value = this[_key];
      Object.defineProperty(this, _key, RecyclableEvent.#descriptor);
    }
  }
}