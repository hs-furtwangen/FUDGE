namespace FudgeCore {

  export enum ANIMATION_BLENDING {
    ADDITIVE = "Additive",
    OVERRIDE = "Override"
  }



  /**
   * A node in an {@link AnimationTree} that manages a weighted {@link Animation} or {@link AnimationTree subtree}.
   * {@link update Updates} and provides access to the node's current state ({@link #time}, {@link mutator}, {@link events}).
   * @author Jonas Plotzky, HFU, 2024
   */
  export class AnimationNode {
    public motion: Animation | AnimationNode[];

    public weight: number;
    public speed: number = 1;
    public blending: ANIMATION_BLENDING;
    public playmode: ANIMATION_PLAYMODE;

    protected ƒmutator: Mutator;
    protected ƒevents: string[];
    protected ƒtime: number;

    public constructor(_motion: Animation | AnimationNode[], _options?: { weight?: number; speed?: number; blending?: ANIMATION_BLENDING; playmode?: ANIMATION_PLAYMODE }) {
      this.motion = _motion;

      if (_options) {
        this.weight = _options.weight;
        this.blending = _options.blending;
        this.playmode = _options.playmode;
        this.speed = _options.speed;
      }

      this.speed ??= 1;
      this.blending ??= ANIMATION_BLENDING.OVERRIDE;

      this.ƒtime = 0;
    }

    /** The (blended) {@link Animation.getState animation mutator} at the state of the last {@link update}. */
    public get mutator(): Mutator {
      return this.ƒmutator;
    }

    /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
    public get events(): string[] {
      return this.ƒevents;
    }

    /** The time after the last {@link update}. */
    public get time(): number {
      return this.ƒtime;
    }

    public setTime(_time: number): void {
      this.ƒtime = _time;

      if (this.motion instanceof Animation)
        return;

      const length: number = this.getLength();
      for (const node of this.motion)
        node.setTime(_time * node.getLength() / length);
    }

    public reset(): void {
      this.ƒtime = 0;

      if (this.motion instanceof Animation)
        return;

      for (const node of this.motion)
        node.reset();
    }


    /** Returns the {@link Animation.totalTime length} of this nodes animation or the longest animation length in the subtree */
    public getLength(): number {
      if (this.motion instanceof Animation)
        return this.motion.totalTime;

      return this.motion[0].getLength();
    }

    /**
     * Updates the {@link updatedTime}, {@link mutator} and {@link events} according the given time, direction and quantization.
     */
    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      _playmode = this.playmode ?? _playmode; // override playmode
      _deltaTime = this.speed * _deltaTime;

      let updatedTime: number = this.ƒtime + _deltaTime;

      if (this.motion instanceof Animation) {
        if (this.motion.totalTime == 0 || this.ƒtime == updatedTime)
          return;

        if (_quantization == ANIMATION_QUANTIZATION.FRAMES)
          updatedTime = this.ƒtime + (1000 / this.motion.fps);

        updatedTime = this.motion.getModalTime(updatedTime, _playmode);

        let direction: number = this.motion.calculateDirection(updatedTime, _playmode);

        this.ƒevents = this.motion.getEventsToFire(this.ƒtime, updatedTime, _quantization, direction);
        this.ƒmutator = this.motion.getState(updatedTime % this.motion.totalTime, direction, _quantization);
        this.ƒtime = updatedTime;

        return;
      }

      const length: number = this.getLength();
      for (const node of this.motion)
        node.update(_deltaTime * node.getLength() / length, _playmode, _quantization);

      this.ƒtime = updatedTime;
      this.ƒevents = this.motion.flatMap(_layer => _layer.events);
      this.ƒmutator = Animation.blend(this.motion);
    }
  }

  // export class AnimationLayers extends AnimationNode {
  //   public motion: AnimationLayer[] = [];
  
  // }

  // export class AnimationLayer extends AnimationNode {
  //   public motion: [AnimationNode, AnimationNode] = [null, null];
    
  //   #cancel: Mutator;
  //   #transitionTime: number;
  //   #transitionDuration: number;

  //   public transit(_to: AnimationNode, _duration: number, _offset: number = 0): void {
  //     _to.setTime(_offset);
  //     this.#transitionTime = 0;
  //     this.#transitionDuration = _duration;

  //     if (this.motion[1]) 
  //       this.#cancel = this.mutator;
      
  //     this.motion[1] = _to;
  //   }

  //   public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
  //     let branch: AnimationNode = this.motion[0];
  //     let transition: AnimationNode = this.motion[1];

  //     if (!this.#cancel) {
  //       branch.update(_deltaTime, _playmode, _quantization);
  //       this.ƒmutator = branch.mutator;
  //     }

  //     if (transition) {
  //       transition.update(_deltaTime, _playmode, _quantization);

  //       let progress: number = Math.min((this.#transitionTime += _deltaTime) / this.#transitionDuration, 1);

  //       if (this.#cancel) {
  //         this.ƒmutator = {};
  //         Animation.blendRecursive(this.mutator, this.#cancel, 1, 1);
  //       }

  //       Animation.blendRecursive(this.mutator, transition.mutator, 1 - progress, progress);

  //       if (progress == 1) {
  //         this.motion[0] = transition;
  //         this.motion[1] = null;
  //       }
  //     }
  //   }
  // }
}