// / <reference path="../Time/Loop.ts"/>
// / <reference path="../Animation/Animation.ts"/>

namespace FudgeCore {



  /**
   * Holds a reference to an {@link Animation} and controls it. Controls quantization and playmode as well as speed.
   * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2022
   */
  @enumerate
  export class ComponentAnimation extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAnimation);

    public playmode: ANIMATION_PLAYMODE;
    public quantization: ANIMATION_QUANTIZATION;
    public scaleWithGameTime: boolean = true;
    public animateInEditor: boolean = false;

    /** 
     * A stack with the current animation at the bottom, the target transition at the top and canceled transitions inbetween.
     * {@link animation} getts/sets the current animation directly. {@link transit} initiates a transition.
     */
    #animations: AnimationTree<AnimationNode>;

    #scale: number = 1;
    #timeLocal: Time;
    // #previous: number = 0; // TODO: watch out for occurence of this variable

    // #timeFrame = 0;
    #timeFrameStart: number = 0;

    public constructor(_animation?: Animation | AnimationTree, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _quantization: ANIMATION_QUANTIZATION = ANIMATION_QUANTIZATION.CONTINOUS) {
      super();
      this.#animations = [];
      this.#timeLocal = new Time();

      this.playmode = _playmode;
      this.quantization = _quantization;
      this.animation = _animation;

      // this.animation?.calculateTotalTime();

      this.addEventListener(EVENT.COMPONENT_REMOVE, () => this.activate(false));
      this.addEventListener(EVENT.COMPONENT_ADD, () => {
        this.node.addEventListener(EVENT.CHILD_REMOVE, () => this.activate(false));
        this.activate(true);
      });
    }

    @type(Animation) @enumerate
    public get animation(): Animation | AnimationTree {
      return this.#animations[0]?.motion;
    }

    public set animation(_animation: Animation | AnimationTree) {
      if (!_animation)
        return;

      this.branch = new AnimationNode(_animation, 1, ANIMATION_BLENDING.OVERRIDE);
    }

    public get branch(): AnimationNode {
      return this.#animations[0];
    }

    public set branch(_branch: AnimationNode) {
      this.#animations.length = 0;
      this.#animations.push(_branch);
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
      return this.#timeLocal.get() % this.#animations[0].getLength();
    }

    public set time(_time: number) {
      this.jumpTo(_time);
    }

    public get transition(): Animation | AnimationTree {
      return this.#animations[this.#animations.length - 1]?.motion;
    }

    public isPlaying(_animation: Animation | AnimationTree): boolean {
      return this.animation == _animation || this.#animations[this.#animations.length - 1]?.motion == _animation;
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
      this.#animations[0].update(_time, this.playmode, this.quantization);
      this.node.applyAnimation(this.#animations[0].mutator);
    }

    /**
     * Jumps to a certain label in the animation if defined
     * ⚠️ Not supported for animation blend trees
     */
    public jumpToLabel(_label: string): void {
      if (!(this.animation instanceof Animation))
        return;

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
      this.#animations[0].time = undefined;
      return this.updateAnimationLoop(null, _time);
    }

    //#region transfer
    public serialize(): Serialization {
      let serialization: Serialization = {};
      serialization[super.constructor.name] = super.serialize();
      if (this.animation instanceof Animation)
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
      if (_serialization.idAnimation != undefined)
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

    public transit(_to: AnimationNode, _duration: number): void {
      let target: AnimationNode = this.#animations[this.#animations.length - 1];
      if (target == _to)
        return;

      _to.blending = ANIMATION_BLENDING.OVERRIDE;
      _to.duration = _duration;
      this.#animations.push(_to);
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
    private updateAnimationLoop = (_e: Event, _time: number = this.#timeLocal.get()): Mutator => {
      if (this.#animations.length == 0)
        return null;

      let timeFrame: number = _time - this.#timeFrameStart;
      this.#timeFrameStart = _time;

      this.#animations[0].update(timeFrame, this.playmode, this.quantization);
      this.executeEvents(this.#animations[0].events);
      let mutator: Mutator = this.#animations.length > 1 ? this.updateTransitions(timeFrame) : this.#animations[0].mutator;
      if (this.node)
        this.node.applyAnimation(mutator);

      return mutator;
    };

    private updateTransitions(_deltaTime: number): Mutator {
      let target: AnimationNode = this.#animations[this.#animations.length - 1];
      target.update(_deltaTime, this.playmode, this.quantization);
      target.weight = Math.min(target.time / target.duration, 1);

      if (target.weight == 1) {
        this.#timeLocal.set(target.time);
        this.#timeFrameStart = target.time;
        this.#animations.length = 0;
        this.#animations.push(target);
        return target.mutator;
      }

      // for (let i: number = this.#animations.length - 1; i > 1; i--) {
      //   const transition: AnimationTransition = this.#animations[i - 1];

      //   if (i < this.#animations.length - 2) { // fade out canceled transitions if there are more than 2
      //     const push: AnimationTransition = this.#animations[i + 2]; // the transition that pushed the current one over the threshold
      //     transition.weight *= 1 - Math.min(push.time / push.duration, 1); // fade out at progression of the transition that pushed the current one out
      //   }

      //   if (transition.weight == 0.0)
      //     this.#animations.splice(i - 1, 1);
      // }

      return Animation.blend(this.#animations);
    }

    /**
     * Fires all custom events the Animation should have fired between the last frame and the current frame.
     * @param _events a list of names of custom events to fire
     */
    private executeEvents(_events: string[]): void {
      for (const event of _events)
        this.dispatchEvent(new Event(event));
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