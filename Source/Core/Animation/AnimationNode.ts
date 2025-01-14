namespace FudgeCore {

  /** Blending modes used in {@link AnimationNodeBlend}. */
  export enum ANIMATION_BLENDING {
    /** Adds this animation to the previous animations. */
    ADDITIVE = "Additive",
    /** Overrides the previous animations using linear interpolation. */
    OVERRIDE = "Override"
  }

  /** 
   * Base class for all animation nodes. Animation nodes form an animation graph enabling hierachical animation blending and animation transitions. 
   * Can be attached to a {@link Node} via {@link ComponentAnimationGraph}. 
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  export abstract class AnimationNode {
    /** The (blended) {@link Animation.getState animation mutator} at the state of the last call to {@link update}. */
    public mutator: Mutator;
    /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
    public events: string[];

    /** The playback speed */
    public speed: number;

    /** The weight used for blending this node with others in an {@link AnimationNodeBlend}. Default: 1.*/
    public weight: number;
    /** The mode used for blending this node with others in an {@link AnimationNodeBlend}. Default: {@link ANIMATION_BLENDING.OVERRIDE}. */
    public blending: ANIMATION_BLENDING;

    public constructor(_options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      this.speed = _options?.speed ?? 1;
      this.weight = _options?.weight ?? 1;
      this.blending = _options?.blending ?? ANIMATION_BLENDING.OVERRIDE;
    }

    /** Resets the time. */
    public abstract reset(): void;

    /** Updates the {@link mutator} and {@link events} according the given delta time */
    public abstract update(_deltaTime: number, _pose?: Mutator): void;
  }

  /** 
   * Evaluates a single {@link Animation} providing a {@link mutator} and {@link events}. 
   * Used as an input for other {@link AnimationNode}s. 
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  export class AnimationNodeAnimation extends AnimationNode {
    public animation: Animation;
    public playmode: ANIMATION_PLAYMODE;

    /** The time after the last call to {@link update}. */
    public time: number;

    /** The time offset from which the animation starts when reset. */
    public offset?: number;

    public constructor(_animation: Animation, _options?: { speed?: number; offset?: number; playmode?: ANIMATION_PLAYMODE; weight?: number; blending?: ANIMATION_BLENDING });
    public constructor();
    public constructor(_mutator: Mutator);
    public constructor(_animation?: Animation | Mutator, _options?: { speed?: number; offset?: number; playmode?: ANIMATION_PLAYMODE; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);

      if (!_animation)
        return;

      if (!(_animation instanceof Animation)) {
        this.mutator = _animation;
        return;
      }

      this.animation = _animation;
      this.offset = _options?.offset ?? 0;
      this.playmode = _options?.playmode;
      this.time = 0;
    }

    /** Resets this node to its {@link offset} time. */
    public reset(): void {
      this.time = this.offset;
    }

    public update(_deltaTime: number): void {
      if (!this.animation)
        return;

      _deltaTime *= this.speed;

      let updatedTime: number = this.time + _deltaTime;

      if (this.animation.totalTime == 0)
        return;

      updatedTime = this.animation.getModalTime(updatedTime, this.playmode);

      let direction: number = this.animation.calculateDirection(updatedTime, this.playmode);

      this.events = this.animation.getEventsToFire(this.time, updatedTime, ANIMATION_QUANTIZATION.CONTINOUS, direction);
      this.mutator = this.animation.getState(updatedTime % this.animation.totalTime, direction, ANIMATION_QUANTIZATION.CONTINOUS);
      this.time = updatedTime;

      return;
    }
  }

  /** 
   * Blends multiple input {@link AnimationNode}s providing a blended {@link mutator} and the {@link events} from all nodes. 
   * Each child node must specify its own blend {@link weight} and {@link blending}. Processes nodes sequentially, each node blends with the accumulated result.
   * When combined with {@link AnimationNodeTransition}s as children, transitions from/into an empty state will blend from/into the accumulated result of this node.
   * @author Jonas Plotzky, HFU, 2024-2025
   * 
   * **Example walk-run-blend:**
   * ```typescript
   * import ƒ = FudgeCore;
   * // initialization
   * const walk: ƒ.Animation = new ƒ.Animation();
   * const run: ƒ.Animation = new ƒ.Animation();
   * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
   * const nodeRun: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(run, { speed: run.totalTime / walk.totalTime }) // slow down the playback speed of run to synchronize the motion with walk.
   * const nodeMove: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWalk, nodeRun]);
   * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
   * cmpAnimationGraph.root = nodeMove;
   * 
   * // during the game
   * nodeRun.weight = 0.5; // adjust the weight: 0 is walking, 1 is running.
   * nodeMove.speed = 1 + nodeRun.weight * nodeRun.speed; // adjust the playback speed of the blend to account for the slowed down run animation.
   * ```
   * **Example transition-empty-state:**
   * ```typescript
   * import ƒ = FudgeCore;
   * // initialization
   * const idle: ƒ.Animation = new ƒ.Animation();
   * const walk: ƒ.Animation = new ƒ.Animation();
   * const draw: ƒ.Animation = new ƒ.Animation();
   * const sheathe: ƒ.Animation = new ƒ.Animation();
   * 
   * const nodeEmpty: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation();
   * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
   * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
   * const nodeDraw: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(draw, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
   * const nodeSheathe: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(sheathe, { playmode: ƒ.ANIMATION_PLAYMODE.PLAY_ONCE });
   * 
   * const nodeWholeBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
   * const nodeUpperBody: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeEmpty);
   * const nodeRoot: ƒ.AnimationNodeBlend = new ƒ.AnimationNodeBlend([nodeWholeBody, nodeUpperBody]);
   * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
   * cmpAnimationGraph.root = nodeRoot;
   * 
   * // during the game
   * nodeWholeBody.transit(nodeWalk, 300); // transit whole body into walk.
   * // in parallel to the whole body, the upper body can transit from empty to draw/sheath and back to empty.
   * nodeUpperBody.transit(nodeDraw, 300); // transit upper body from empty into draw.
   * nodeUpperBody.transit(nodeSheathe, 300); // transit upper body from draw into sheathe.
   * nodeUpperBody.transit(nodeEmpty, 300); // transit upper body from sheathe into empty.
   * ```
   */
  export class AnimationNodeBlend extends AnimationNode {
    public nodes: AnimationNode[];

    public constructor(_nodes: AnimationNode[], _options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);
      this.nodes = _nodes;
    }

    public reset(): void {
      for (const node of this.nodes)
        node.reset();
    }

    public update(_deltaTime: number): void {
      if (this.nodes.length == 0) {
        this.mutator = null;
        this.events = [];
        return;
      }

      _deltaTime *= this.speed;

      this.nodes[0].update(_deltaTime, {}); // TODO: add base pose snapshot to blend from
      let mutator: Mutator = this.nodes[0].mutator ?? {};
      let events: string[] = this.nodes[0].events ?? [];
      for (let i: number = 1; i < this.nodes.length; i++) {
        const node: AnimationNode = this.nodes[i];
        node.update(_deltaTime, mutator);

        if (!node.mutator)
          continue;

        switch (node.blending) {
          case ANIMATION_BLENDING.ADDITIVE:
            mutator = Animation.blendAdditive(mutator, node.mutator, node.weight);
            break;
          case ANIMATION_BLENDING.OVERRIDE:
            mutator = Animation.blendOverride(mutator, node.mutator, node.weight);
            break;
        }

        events = events.concat(node.events);
      }

      this.mutator = mutator;
      this.events = events;
    }
  }

  /** 
   * Allows to transition from one {@link AnimationNode} to another over a specified time. 
   * If nested inside an {@link AnimationNodeBlend}, transit from/into an empty state to blend from/into the accumulated result of the container blend node.
   * @author Jonas Plotzky, HFU, 2024-2025
   * 
   * **Example:**
   * ```typescript
   * import ƒ = FudgeCore;
   * // initialization
   * const idle: ƒ.Animation = new ƒ.Animation();
   * const walk: ƒ.Animation = new ƒ.Animation();
   * const nodeIdle: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(idle);
   * const nodeWalk: ƒ.AnimationNodeAnimation = new ƒ.AnimationNodeAnimation(walk);
   * const nodeTransition: ƒ.AnimationNodeTransition = new ƒ.AnimationNodeTransition(nodeIdle);
   * const cmpAnimationGraph: ƒ.ComponentAnimationGraph = new ƒ.ComponentAnimationGraph(); // get the animation component
   * cmpAnimationGraph.root = nodeTransition;
   * 
   * // during the game
   * nodeTransition.transit(nodeWalk, 300); // transit to the walk animation in 300ms.
   * nodeTransition.transit(nodeIdle, 300); // transit back to the idle animation.
   * ```
   */
  export class AnimationNodeTransition extends AnimationNode {
    public from: AnimationNode;
    public to: AnimationNode;

    public duration: number;
    public time: number;

    public constructor(_animation: AnimationNode, _options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);
      this.from = _animation;
    }

    public reset(): void {
      this.from.reset();
      this.to?.reset();
    }

    /** Transit to the given {@link AnimationNode} over the specified duration. The given node will be {@link reset}. */
    public transit(_to: AnimationNode, _duration: number): void {
      _to.reset();
      if (this.to)
        this.from = new AnimationNodeAnimation(this.mutator);
      this.to = _to;
      this.duration = _duration;
      this.time = 0;
    }

    public update(_deltaTime: number, _pose: Mutator): void {
      _deltaTime *= this.speed;

      this.time += _deltaTime;

      this.from.update(_deltaTime);

      if (!this.to) {
        this.mutator = this.from.mutator;
        this.events = this.from.events;
        return;
      }

      this.to.update(_deltaTime);

      let progress: number = Math.min(this.time / this.duration, 1);

      let from: Mutator = this.from.mutator ?? _pose;
      let to: Mutator = this.to.mutator ?? _pose;

      if (from == to) {
        this.mutator = null;
        return;
      }

      this.mutator = Animation.blendOverride(from, to, progress, from == _pose || to == _pose);
      this.events = this.to.events;

      if (progress >= 1) {
        this.from = this.to;
        this.to = null;
        this.duration = null;
        this.time = null;
      }
    }
  }
}