namespace FudgeCore {
  /**
 * A node in an {@link AnimationBlendTree} that manages a weighted {@link Animation} or {@link AnimationBlendTree subtree}.
 * {@link update Updates} and provides access to the node's current state ({@link time}, {@link mutator}, {@link events}).
 * @author Jonas Plotzky, HFU, 2024
 */
  export class AnimationBlendNode {
    public animation: Animation | AnimationBlendTree;
    public weight: number;
    public time: number;

    #mutator: Mutator;
    #events: string[];

    public constructor(_animation: Animation | AnimationBlendTree, _weight: number) {
      this.animation = _animation;
      this.weight = _weight;
      this.time = 0;
    }

    /** The (blended) {@link Animation.getState animation mutator} at the state of the last {@link update}. */
    public get mutator(): Mutator {
      return this.#mutator;
    }

    /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
    public get events(): string[] {
      return this.#events;
    }

    // /** The time after the last {@link update}. */
    // public get time(): number {
    //   return this.#time;
    // }

    /** Returns the {@link Animation.totalTime length} of this nodes animation or the longest animation length in the subtree */
    public getLength(): number {
      if (this.animation instanceof Animation)
        return this.animation.totalTime;

      return this.animation.reduce((_max: number, _layer: AnimationBlendNode) => Math.max(_max, _layer.getLength()), 0);
    }

    /**
     * Updates the {@link time}, {@link mutator} and {@link events} according the given time, direction and quantization.
     */
    public update(_time: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      if (this.animation instanceof Animation) {
        if (this.animation.totalTime == 0 || this.time == _time)
          return;

        if (_quantization == ANIMATION_QUANTIZATION.FRAMES)
          _time = this.time + (1000 / this.animation.fps);

        _time = this.animation.getModalTime(_time, _playmode);

        let direction: number = this.animation.calculateDirection(_time, _playmode);

        this.#events = this.animation.getEventsToFire(this.time, _time, _quantization, direction);
        this.#mutator = this.animation.getState(_time % this.animation.totalTime, direction, _quantization);
        this.time = _time;

        return;
      }

      const length: number = this.getLength();
      const normalizedTime: number = (_time / length);

      for (const layer of this.animation) {
        let time: number = layer.getLength() * normalizedTime;
        layer.update(time, _playmode, _quantization);
      }

      this.time = _time;
      this.#events = this.animation.flatMap(_layer => _layer.events);
      this.#mutator = Animation.blend(this.animation);
    }
  }

  export class AnimationTransitionNode extends AnimationBlendNode {
    public start: number;
    public duration: number;

    public constructor(_animation: Animation | AnimationBlendTree, _weight: number, _start: number, _duration: number) {
      super(_animation, _weight);
      this.start = _start;
      this.duration = _duration;
    }

    public update(_time: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      super.update(_time - this.start, _playmode, _quantization);
    }
  }

  /** A tree of weighted {@link Animation}s to blend between them. Can be used as a {@link ComponentAnimation}s animation */
  export type AnimationBlendTree<T extends AnimationBlendNode = AnimationBlendNode> = Array<T>;
}