namespace FudgeCore {

  /**
   * Holds a reference to an {@link Animation} and controls it. Controls quantization and playmode as well as speed.
   * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2022-2025
   */
  @orderFlat
  export class ComponentAnimation extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAnimation);

    @order(1)
    @editReference(Animation)
    public animation: Animation;

    @order(2)
    @edit(ANIMATION_PLAYMODE)
    public playmode: ANIMATION_PLAYMODE;

    @order(3)
    @edit(ANIMATION_QUANTIZATION)
    public quantization: ANIMATION_QUANTIZATION;

    @order(5)
    @edit(Boolean)
    public scaleWithGameTime: boolean = true;

    #animateInEditor: boolean = false;

    #scale: number = 1;
    #timeLocal: Time;
    #previous: number = 0;

    public constructor(_animation?: Animation, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _quantization: ANIMATION_QUANTIZATION = ANIMATION_QUANTIZATION.CONTINOUS) {
      super();
      this.playmode = _playmode;
      this.quantization = _quantization;

      this.animation = _animation;
      this.#timeLocal = new Time();

      //TODO: update animation total time when loading a different animation?
      this.animation?.calculateTotalTime();

      this.addEventListener(EVENT.COMPONENT_REMOVE, () => this.activate(false));
      this.addEventListener(EVENT.COMPONENT_ADD, () => {
        this.node.addEventListener(EVENT.CHILD_REMOVE, () => this.activate(false));
        this.activate(true);
      });
    }

    @order(4)
    @edit(Number)
    public get scale(): number {
      return this.#scale;
    }

    public set scale(_scale: number) {
      this.#scale = _scale;
      this.updateScale();
    }

    /** 
     * - get: return the current sample time of the animation  
     * - set: jump to a certain sample time in the animation
     */
    public get time(): number {
      return this.#timeLocal.get() % this.animation.totalTime;
    }

    public set time(_time: number) {
      this.jumpTo(_time);
    }

    @order(6)
    @edit(Boolean)
    public get animateInEditor(): boolean {
      return this.#animateInEditor;
    }

    public set animateInEditor(_on: boolean) {
      this.#animateInEditor = _on;

      this.updateAnimation(0);
      this.activateListeners(this.active);
    }

    public activate(_on: boolean): void {
      super.activate(_on);
      if (!this.node)
        return;

      this.activateListeners(_on);
    }

    /**
     * Jumps to a certain time in the animation to play from there.
     */
    public jumpTo(_time: number): void {
      this.#timeLocal.set(_time);
      this.#previous = _time;
      _time = _time % this.animation.totalTime;
      let mutator: Mutator = this.animation.getState(_time, this.animation.calculateDirection(_time, this.playmode), this.quantization);
      this.node.applyAnimation(mutator);
    }

    /**
     * Jumps to a certain label in the animation if defined
     */
    public jumpToLabel(_label: string): void {
      let time: number = this.animation.labels[_label];
      if (time)
        this.jumpTo(time);
    }

    /**
     * Forces an update of the animation from outside. Used in the ViewAnimation. Shouldn't be used during the game.
     * @param _time the (unscaled) time to update the animation with.
     * @returns the Mutator for Animation. 
     */
    public updateAnimation(_time: number): Mutator {
      if (!this.animation)
        return null;

      this.#previous = undefined;
      return this.updateAnimationLoop(null, _time);
    }

    // TODO: backwards compatibility, remove in future versions
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);

      if (_serialization.idAnimation != undefined)
        this.animation = <Animation>await Project.getResource(_serialization.idAnimation);

      return this;
    }

    private activateListeners(_on: boolean): void {
      if (!this.node)
        return;

      if (_on && (Project.mode != MODE.EDITOR || Project.mode == MODE.EDITOR && this.animateInEditor)) {
        Time.game.addEventListener(EVENT.TIME_SCALED, this.updateScale);
        this.node.addEventListener(EVENT.RENDER_PREPARE, this.updateAnimationLoop);
      } else {
        Time.game.removeEventListener(EVENT.TIME_SCALED, this.updateScale);
        this.node.removeEventListener(EVENT.RENDER_PREPARE, this.updateAnimationLoop);
      }
    }

    //#region updateAnimation
    /**
     * Updates the Animation.
     * Uses the built-in time unless a different time is specified.
     * May also be called from updateAnimation().
     */
    private updateAnimationLoop = (_e: Event, _time?: number): Mutator => {

      if (this.animation.totalTime == 0)
        return null;

      let time: number = _time || _time === 0 ? _time : this.#timeLocal.get();
      if (this.quantization == ANIMATION_QUANTIZATION.FRAMES) {
        time = this.#previous + (1000 / this.animation.fps);
      }

      let direction: number = this.animation.calculateDirection(time, this.playmode);
      time = this.animation.getModalTime(time, this.playmode, this.#timeLocal.getOffset());

      this.executeEvents(this.animation.getEventsToFire(this.#previous, time, this.quantization, direction));

      if (this.#previous != time) {
        this.#previous = time;
        time = time % this.animation.totalTime;

        const mutator: Mutator = this.animation.getState(time, direction, this.quantization);

        if (this.node)
          this.node.applyAnimation(mutator);

        return mutator;
      }
      return null;
    };

    /**
     * Fires all custom events the Animation should have fired between the last frame and the current frame.
     * @param _events a list of names of custom events to fire
     */
    private executeEvents(_events: string[]): void {
      for (let i: number = 0; i < _events.length; i++) {
        this.dispatchEvent(new Event(_events[i]));
      }
    }

    /**
     * Updates the scale of the animation if the user changes it or if the global game timer changed its scale.
     */
    private updateScale = (): void => {
      let newScale: number = this.#scale;
      if (this.scaleWithGameTime)
        newScale *= Time.game.getScale();
      this.#timeLocal.setScale(newScale);
    };
    //#endregion
  }
}