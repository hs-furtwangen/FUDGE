// / <reference path="../Time/Loop.ts"/>
// / <reference path="../Animation/Animation.ts"/>

namespace FudgeCore {

  /**
   * Holds a reference to an {@link Animation} and controls it. Controls quantization and playmode as well as speed.
   * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2022
   */
  export class ComponentAnimator extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAnimator);
    //TODO: add functionality to blend from one animation to another.
    @type(Animation)
    public animation: Animation;
    public playmode: ANIMATION_PLAYMODE;
    public quantization: ANIMATION_QUANTIZATION;
    public scaleWithGameTime: boolean = true;
    public animateInEditor: boolean = false;

    #transitAnimation: Animation;
    #transitStart: number;
    #transitDuration: number;

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

    public set scale(_scale: number) {
      this.#scale = _scale;
      this.updateScale();
    }

    public get scale(): number {
      return this.#scale;
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
      this.#previous = undefined;
      return this.updateAnimationLoop(null, _time);
    }

    //#region transfer
    public serialize(): Serialization {
      let serialization: Serialization = {};
      serialization[super.constructor.name] = super.serialize();
      serialization.idAnimation = this.animation.idResource;
      serialization.playmode = this.playmode;
      serialization.quantization = this.quantization;
      serialization.scale = this.scale;
      serialization.scaleWithGameTime = this.scaleWithGameTime;
      serialization.animateInEditor = this.animateInEditor;

      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization[super.constructor.name]);
      this.animation = <Animation>await Project.getResource(_serialization.idAnimation);
      this.playmode = _serialization.playmode;
      this.quantization = _serialization.quantization;
      this.scale = _serialization.scale;
      this.scaleWithGameTime = _serialization.scaleWithGameTime;
      this.animateInEditor = _serialization.animateInEditor;

      return this;
    }

    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _selection, _dispatchMutate);
      if (typeof (_mutator.animateInEditor) !== "undefined") {
        this.updateAnimation(0);
        this.activateListeners(this.active);
      }
    }

    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = super.getMutatorAttributeTypes(_mutator);
      if (types.playmode)
        types.playmode = ANIMATION_PLAYMODE;
      if (types.quantization)
        types.quantization = ANIMATION_QUANTIZATION;
      return types;
    }
    //#endregion

    public transit(_to: Animation, _duration: number): void {
      if (_to == this.animation || _to == this.#transitAnimation)
        return;

      this.#transitStart = this.#timeLocal.get();
      this.#transitAnimation = _to;
      this.#transitDuration = _duration;
    }

    private activateListeners(_on: boolean): void {
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
     * Updates the animation and all running transitions.
     * Uses the built-in time unless a different time is specified.
     * May also be called from updateAnimation().
     */
    private updateAnimationLoop = (_e: Event, _time?: number): Mutator => {
      let time: number = _time || _time === 0 ? _time : this.#timeLocal.get();
      let mutator: Mutator = this.process(this.animation, time, this.#previous);

      if (!mutator)
        return null;

      if (this.#transitAnimation) {
        let transitTime: number = time - this.#transitStart;
        let transitPrevious: number = Math.max(this.#previous - this.#transitStart, 0);
        let transitMutator: Mutator = this.process(this.#transitAnimation, transitTime, transitPrevious);
        // console.log("time " + time + " previous " + this.#previous + "\ntransitTime " + transitTime + " transitPrevious " + transitPrevious);

        this.blendMutators(
          mutator,
          transitMutator,
          Math.min(transitTime / this.#transitDuration, 1)
        );

        if (transitTime >= this.#transitDuration) {
          this.animation = this.#transitAnimation;
          this.#timeLocal.set(transitTime);

          this.#transitAnimation = null;
          this.#transitStart = null;
          this.#transitDuration = null;
        }
      }

      this.#previous = time;

      if (this.node)
        this.node.applyAnimation(mutator);

      return mutator;
    };

    /** Process the given animation at the given time and previous time. Send events and return animation state. */
    private process(_animation: Animation, _time: number, _previousTime: number): Mutator {
      if (_animation.totalTime == 0 || _previousTime == _time)
        return null;

      if (this.quantization == ANIMATION_QUANTIZATION.FRAMES)
        _time = this.#previous + (1000 / _animation.fps);

      _time = _animation.getModalTime(_time, this.playmode, this.#timeLocal.getOffset());
      
      let direction: number = _animation.calculateDirection(_time, this.playmode);
      this.executeEvents(_animation.getEventsToFire(_previousTime, _time, this.quantization, direction));
      
      return _animation.getState(_time % _animation.totalTime, direction, this.quantization);
    }

    private blendMutators(_from: Mutator, _to: Mutator, _factor: number): void {
      for (let key in _to) {
        if (_from[key]) {
          if (typeof _from[key] == "object") {
            let from: Mutator = _from[key];
            let to: Mutator = _to[key];
            if (from.x != undefined && from.y != undefined && from.z != undefined && from.w != undefined && Quaternion.DOT(<Quaternion>from, <Quaternion>to) < 0)
              Quaternion.negate(<Quaternion>to);

            this.blendMutators(from, to, _factor);
          } else
            _from[key] = _from[key] * (1 - _factor) + _to[key] * _factor;
        } else {
          _from[key] = _to[key];
        }
      }
    }

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