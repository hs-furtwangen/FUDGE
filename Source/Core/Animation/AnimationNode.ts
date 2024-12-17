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
        if (this.motion.totalTime == 0) // || this.ƒtime == updatedTime
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

  export class AnimationLayers {
    public layers: AnimationLayer[];
    public mutator: Mutator;
    public events: string[];

    public constructor(_layers: AnimationLayer[]) {
      this.layers = _layers;
    }

    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      let mutator: Mutator = {};

      for (const layer of this.layers) {
        layer.update(_deltaTime, _playmode, _quantization, mutator);

        const weight: number = layer.weight;
        switch (layer.blending) {
          case ANIMATION_BLENDING.ADDITIVE:
            Animation.blendRecursive(mutator, layer.mutator, 1, weight);
            break;
          case ANIMATION_BLENDING.OVERRIDE:
            Animation.blendRecursive(mutator, layer.mutator, 1 - weight, weight);
            break;
        }
      }

      this.mutator = mutator;
      this.events = this.layers.flatMap(_layer => _layer.events);
    }
  }

  export class AnimationLayer {
    public motion: AnimationNode | null;
    
    public weight: number;
    public blending: ANIMATION_BLENDING;
    public mutator: Mutator;
    public events: string[];
    
    #poseCancel: Mutator;
    
    #transitionTarget: AnimationNode | null;
    #transitionTime: number;
    #transitionDuration: number;

    public constructor(_branch: AnimationNode, _options?: { weight?: number; blending?: ANIMATION_BLENDING }) {
      this.motion = _branch;
      this.weight = _options?.weight ?? 1;
      this.blending = _options?.blending ?? ANIMATION_BLENDING.OVERRIDE;
    }

    public isPlaying(_branch: AnimationNode): boolean {
      return this.motion == _branch || this.#transitionTarget == _branch;
    }

    public isTransitioning(_to: AnimationNode): boolean {
      return this.#transitionTarget == _to;
    }

    public transit(_to: AnimationNode | null, _duration: number, _offset: number = 0): void {
      _to?.setTime(_offset);
      this.#transitionTime = 0;
      this.#transitionDuration = _duration;

      if (this.#transitionTarget)
        this.#poseCancel = this.mutator;

      this.#transitionTarget = _to;
    }

    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION, _pose: Mutator): void {
      this.motion?.update(_deltaTime, _playmode, _quantization);
      this.mutator = this.motion?.mutator;

      if (this.#transitionTime != null) {
        this.#transitionTarget?.update(_deltaTime, _playmode, _quantization);

        let from: Mutator = this.motion?.mutator;
        let to: Mutator = this.#transitionTarget?.mutator;

        if (this.#poseCancel) // copy cancel mutator
          Animation.blendOverride(from = {}, this.#poseCancel, 1);

        let progress: number = Math.min((this.#transitionTime += _deltaTime) / this.#transitionDuration, 1);

        if (to) {
          if (!from)
            Animation.blendOverride(from = {}, _pose, 1); // copy pose mutator
          Animation.blendOverride(this.mutator = from, to, progress);
        } else {
          Animation.blendOverride(to = {}, _pose, 1); // copy pose mutator
          Animation.blendOverride(this.mutator = to, from, 1 - progress);
        }

        if (progress == 1) {
          this.motion = this.#transitionTarget;
          this.#transitionTarget = null;
          this.#poseCancel = null;
          this.#transitionTime = null;
          this.#transitionDuration = null;
        }
      }
    }
  }
}


