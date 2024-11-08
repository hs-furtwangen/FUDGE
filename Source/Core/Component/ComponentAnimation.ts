// / <reference path="../Time/Loop.ts"/>
// / <reference path="../Animation/Animation.ts"/>

namespace FudgeCore {

  interface AnimationBlend {
    animation: Animation;
    weight: number;

    time: number;
    start: number;
    mutator?: Mutator;
    events?: string[];
    duration?: number;
  }

  class AnimationBlendTree extends Array<AnimationBlend> {
    public update(_time: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      for (const blend of this) {
        if (blend.animation.totalTime == 0 || blend.time == _time)
          continue;

        let time: number = _time - blend.start;
        if (_quantization == ANIMATION_QUANTIZATION.FRAMES)
          time = blend.time + (1000 / blend.animation.fps);
        time = blend.animation.getModalTime(time, _playmode, blend.start);

        let direction: number = blend.animation.calculateDirection(time, _playmode);
        blend.events = blend.animation.getEventsToFire(blend.time, time, _quantization, direction);
        blend.mutator = blend.animation.getState(time % blend.animation.totalTime, direction, _quantization);
        blend.time = time;
      }
    }

    public blend(): Mutator {
      if (this.length == 0)
        return {};

      if (this.length == 1)
        return this[0].mutator;

      let mutator: Mutator = {};
      for (const blend of this)
        this.blendMutators(mutator, blend.mutator, 1, blend.weight);

      return mutator;
    }

    private blendMutators(_base: Mutator, _blend: Mutator, _weightBase: number, _weightBlend: number): void {
      for (let key in _blend) {
        if (typeof _blend[key] == "number") {
          _base[key] = (_base[key] ?? 0) * _weightBase + _blend[key] * _weightBlend;
          continue;
        }

        if (typeof _base[key] == "object") {
          let base: Mutator = _base[key];
          let blend: Mutator = _blend[key];
          if (base.x != undefined && base.y != undefined && base.z != undefined && base.w != undefined && Quaternion.DOT(<Quaternion>base, <Quaternion>blend) < 0)
            Quaternion.negate(<Quaternion>blend);
          this.blendMutators(base, blend, _weightBase, _weightBlend);

          continue;
        }

        if (typeof _blend[key] === "object") {
          _base[key] = {};
          this.blendMutators(_base[key], _blend[key], _weightBase, _weightBlend);

          continue;
        }
      }
    }
  }

  /**
   * Holds a reference to an {@link Animation} and controls it. Controls quantization and playmode as well as speed.
   * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2022
   */
  export class ComponentAnimation extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAnimation);
    //TODO: add functionality to blend from one animation to another.
    @type(Animation)
    public animation: Animation;
    public playmode: ANIMATION_PLAYMODE;
    public quantization: ANIMATION_QUANTIZATION;
    public scaleWithGameTime: boolean = true;
    public animateInEditor: boolean = false;

    #animations: AnimationBlendTree;

    #scale: number = 1;
    #timeLocal: Time;
    // #previous: number = 0; // TODO: watch out for occurence of this variable

    public constructor(_animation?: Animation, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _quantization: ANIMATION_QUANTIZATION = ANIMATION_QUANTIZATION.CONTINOUS) {
      super();
      this.playmode = _playmode;
      this.quantization = _quantization;
      this.animation = _animation;

      this.#animations = new AnimationBlendTree({ animation: _animation, weight: 1, time: 0, start: 0, mutator: null, events: null });
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
    public jumpTo(_time: number): void { // TODO: implement jumpTo with blending, TEST ALL USE CASES
      this.#timeLocal.set(_time);
      // this.#previous = _time;
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
      // this.#previous = undefined; // TODO: check what to do with blend tree? TEST ALL USE CASES
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

    public transit(_animation: Animation, _duration: number): void {
      if (this.#animations[this.#animations.length - 1]?.animation == _animation)
        return;

      this.#animations.push({ animation: _animation, weight: 0, time: 0, start: this.#timeLocal.get(), duration: _duration });
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
     */ // TODO: think about whether fireing events for current and target animation makes sense...
    private updateAnimationLoop = (_e: Event, _time?: number): Mutator => {
      if (this.#animations.length == 0)
        return null;

      _time ??= this.#timeLocal.get();

      this.#animations.update(_time, this.playmode, this.quantization);

      let mutator: Mutator = this.#animations[0].mutator;

      if (this.#animations.length > 1) {
        const top: AnimationBlend = this.#animations[this.#animations.length - 1];
        top.weight = Math.min(top.time / top.duration, 1);

        let total: number = top.weight;
        for (let i: number = this.#animations.length - 1; i > 1; i--) {
          const current: AnimationBlend = this.#animations[i - 1];
          const next: AnimationBlend = this.#animations[i];
          let cancelDuration: number = next.start - current.start; // elapsed time at point of cancelation
          let cancelWeight: number = cancelDuration / current.duration; // weight at point of cancelation

          current.weight = cancelWeight * (1 - total);

          if (i < this.#animations.length - 2) {
            const push: AnimationBlend = this.#animations[i + 2]; // the one that pushed us out
            let timePush: number = (current.time + current.start) - push.start; // elapsed time since push

            const fadeOut: number = 1 - Math.min(timePush / 100, 1); // fade out
            current.weight *= fadeOut;
          }

          total += current.weight;
        }

        const bottom: AnimationBlend = this.#animations[0];
        bottom.weight = Math.max(1 - total, 0);
        total += bottom.weight;

        console.log("sum", total);
        mutator = this.#animations.blend();

        for (let i: number = 0; i < this.#animations.length - 1; i++) {
          if (this.#animations[i].weight == 0.0) {
            this.#animations.splice(i, 1);
            i--;
          }
        }

        if (top.weight == 1) {
          top.duration = null;
          this.#animations = new AnimationBlendTree(top);
        }
      }

      // TODO: execute events for all animations in the blend tree
      this.executeEvents(this.#animations[0].events);

      if (this.node)
        this.node.applyAnimation(mutator);

      return mutator;
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