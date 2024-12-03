namespace FudgeCore {

  export enum ANIMATION_BLENDING {
    ADDITIVE = "Additive",
    OVERRIDE = "Override"
  }

  // export interface AnimationConfig {
  //   motion: Animation | AnimationConfig[];
  //   weight?: number;
  //   speed?: number;
  //   blending?: ANIMATION_BLENDING;
  //   playmode?: ANIMATION_PLAYMODE;
  // }

  /** A tree of weighted {@link Animation}s to blend between them. Can be used as a {@link ComponentAnimation}s animation */
  export type AnimationTree<T extends AnimationNode = AnimationNode> = Array<T>;

  /**
   * A node in an {@link AnimationTree} that manages a weighted {@link Animation} or {@link AnimationTree subtree}.
   * {@link update Updates} and provides access to the node's current state ({@link #time}, {@link mutator}, {@link events}).
   * @author Jonas Plotzky, HFU, 2024
   */
  export class AnimationNode {
    //TODO: split into AnimationNode and AnimationNodeState, AnimationNode gets configured and AnimationNodeState is the runtime object which wraps the AnimationNode
    public motion: Animation | AnimationTree;
    
    public weight: number;
    public blending: ANIMATION_BLENDING;

    public duration: number;

    public speed: number = 1;

    /** Override for playmode */
    public playmode: ANIMATION_PLAYMODE;

    #mutator: Mutator;
    #events: string[];
    #time: number;

    public constructor(_animation: Animation | AnimationTree, _weight: number, _blending: ANIMATION_BLENDING = ANIMATION_BLENDING.OVERRIDE, _playmode?: ANIMATION_PLAYMODE) {
      this.motion = _animation;
      this.weight = _weight;
      this.blending = _blending;
      this.playmode = _playmode;
      this.#time = 0;
    }

    /** The (blended) {@link Animation.getState animation mutator} at the state of the last {@link update}. */
    public get mutator(): Mutator {
      return this.#mutator;
    }

    /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
    public get events(): string[] {
      return this.#events;
    }

    /** The time after the last {@link update}. */
    public get time(): number {
      return this.#time;
    }

    public set time(_time: number) {
      this.#time = _time;

      if (this.motion instanceof Animation)
        return;

      for (const node of this.motion) 
        node.time = _time;
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

      let updatedTime: number = this.#time + _deltaTime;

      if (this.motion instanceof Animation) {
        if (this.motion.totalTime == 0 || this.#time == updatedTime)
          return;

        if (_quantization == ANIMATION_QUANTIZATION.FRAMES)
          updatedTime = this.#time + (1000 / this.motion.fps);

        updatedTime = this.motion.getModalTime(updatedTime, _playmode);

        let direction: number = this.motion.calculateDirection(updatedTime, _playmode);

        this.#events = this.motion.getEventsToFire(this.#time, updatedTime, _quantization, direction);
        this.#mutator = this.motion.getState(updatedTime % this.motion.totalTime, direction, _quantization);
        this.#time = updatedTime;

        return;
      }

      const length: number = this.getLength();
      for (const node of this.motion) {
        let deltaTimeNormalized: number = _deltaTime * node.getLength() / length;
        node.update(deltaTimeNormalized, _playmode, _quantization);
        console.log((node.#time % node.getLength()) / node.getLength());
      }

      this.#time = updatedTime;
      this.#events = this.motion.flatMap(_layer => _layer.events);
      this.#mutator = Animation.blend(this.motion);
    }
  }
}