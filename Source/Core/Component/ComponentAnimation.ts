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

    #mutator: Mutator;
    #cancel: Mutator;
    
    #branch: AnimationNode;
    #transition: AnimationNode;

    #transitionTime: number;
    #transitionDuration: number;

    #scale: number = 1;
    #timeLocal: Time;
    // #previous: number = 0; // TODO: watch out for occurence of this variable

    #timeFrameStart: number = 0;

    public constructor(_animation?: Animation, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _quantization: ANIMATION_QUANTIZATION = ANIMATION_QUANTIZATION.CONTINOUS) {
      super();
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
    public get animation(): Animation {
      let motion: Animation | AnimationNode[] = this.branch?.motion;
      if (motion instanceof Animation)
        return motion;

      return null;
    }

    public set animation(_animation: Animation) {
      if (!_animation)
        return;

      this.branch = new AnimationNode(_animation, { weight: 1 });
    }

    public get branch(): AnimationNode {
      return this.#branch;
    }

    public set branch(_branch: AnimationNode) {
      this.#branch = _branch;
      this.#transition = null;
      this.#cancel = null;
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
      return this.#timeLocal.get() % this.branch.getLength();
    }

    public set time(_time: number) {
      this.jumpTo(_time);
    }

    public isPlaying(_branch: AnimationNode): boolean {
      return this.#branch == _branch || this.#transition == _branch;
    }

    public isTransitioning(_to: AnimationNode): boolean {
      return this.#transition == _to;
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
      // this.#branch.update(_time, this.playmode, this.quantization);
      // this.node.applyAnimation(this.#animations[0].mutator);
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
      // this.#animations[0].time = undefined;
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

    public transit(_to: AnimationNode, _duration: number, _offset: number = 0): void {
      _to.setTime(_offset);
      this.#transitionTime = 0;
      this.#transitionDuration = _duration;

      if (this.#transition) 
        this.#cancel = this.#mutator;
      
      this.#transition = _to;
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
      let timeFrame: number = _time - this.#timeFrameStart;
      this.#timeFrameStart = _time;

      let branch: AnimationNode = this.#branch;
      let transition: AnimationNode = this.#transition;

      if (!this.#cancel) {
        branch.update(timeFrame, this.playmode, this.quantization);
        this.executeEvents(branch.events);
        this.#mutator = branch.mutator;
      }

      if (transition) {
        transition.update(timeFrame, this.playmode, this.quantization);
        this.executeEvents(transition.events);

        let progress: number = Math.min((this.#transitionTime += timeFrame) / this.#transitionDuration, 1);

        if (this.#cancel) {
          this.#mutator = {};
          Animation.blendRecursive(this.#mutator, this.#cancel, 1, 1);
        }

        Animation.blendRecursive(this.#mutator, transition.mutator, 1 - progress, progress);

        if (progress == 1) 
          this.branch = transition;
      }

      
      if (this.node)
        this.node.applyAnimation(this.#mutator);

      return this.#mutator;
    };

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