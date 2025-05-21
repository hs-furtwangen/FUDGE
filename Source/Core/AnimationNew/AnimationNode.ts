namespace FudgeCore {
  export namespace AnimationSystem {
    /** Blending modes used in {@link AnimationNodeBlend}. */
    export enum ANIMATION_BLENDING {
      /** Adds this animation to the previous animations. */
      ADDITIVE = "Additive",
      /** Overrides the previous animations using linear interpolation. */
      OVERRIDE = "Override"
    }

    /** 
     * Base class for all animation nodes. Animation nodes form an animation graph enabling hierachical animation blending and animation transitions. 
     * Can be attached to a {@link Node} via {@link ComponentAnimation}. 
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    export abstract class AnimationNode {
      public paths: Set<string>;
      public values: Map<string, Float32Array>;

      /** The playback speed */
      public speed: number;

      /** The weight used for blending this node with others in an {@link AnimationNodeBlend}. Default: 1.*/
      public weight: number;

      /** The mode used for blending this node with others in an {@link AnimationNodeBlend}. Default: {@link ANIMATION_BLENDING.OVERRIDE}. */
      public blending: ANIMATION_BLENDING;

      public constructor(_speed: number = 1, _weight: number = 1, _blending: ANIMATION_BLENDING = ANIMATION_BLENDING.OVERRIDE) {
        this.speed = _speed;
        this.weight = _weight;
        this.blending = _blending;
      }

      /** Resets the time. */
      public abstract reset(): void;

      /** Updates the animation according the given delta time */
      public abstract update(_deltaTime: number, _values: Map<string, Float32Array>): void;
    }

    /** 
     * Evaluates a single {@link Animation}. 
     * Used as an input for other {@link AnimationNode}s. 
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    export class AnimationNodeAnimation extends AnimationNode {
      public animation: Animation;
      public playmode: ANIMATION_PLAYMODE;
      public interpolants: AnimationInterpolant[];

      public time: number;
      public offset: number;

      public constructor(_animation: Animation, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _speed?: number, _offset: number = 0, _weight?: number, _blending?: ANIMATION_BLENDING) {
        super(_speed, _weight, _blending);

        this.animation = _animation;
        this.playmode = _playmode;
        this.time = 0;
        this.offset = _offset;

        this.paths = new Set(_animation.tracks.map((_track: AnimationTrack) => _track.path));

        const tracks: AnimationTrack[] = this.animation.tracks;
        const nTracks: number = tracks.length;
        this.interpolants = new Array(nTracks);
        this.values = new Map<string, Float32Array>();
        for (let i: number = 0; i < nTracks; i++) {
          this.interpolants[i] = tracks[i].createInterpolant();
          this.values.set(tracks[i].path, this.interpolants[i].result);
        }
      }

      public reset(): void {
        this.time = this.offset;
      }

      public update(_deltaTime: number): void {
        this.time = (this.time += _deltaTime) % this.animation.duration;

        const interpolants: AnimationInterpolant[] = this.interpolants;
        for (let i: number = 0; i < interpolants.length; i++) 
          interpolants[i].evaluate(this.time);
      }
    }

    /** 
     * Blends multiple input {@link AnimationNode}s. 
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

      public constructor(_nodes: AnimationNode[], _speed: number = 1, _weight: number = 1, _blending: ANIMATION_BLENDING = ANIMATION_BLENDING.OVERRIDE) {
        super(_speed, _weight, _blending);
        this.nodes = _nodes;

        const paths: Set<string> = new Set<string>();
        const values: Map<string, Float32Array> = new Map<string, Float32Array>();
        for (const node of _nodes) {
          for (const path of node.values.keys()) {
            if (!values.has(path))
              values.set(path, new Float32Array(node.values.get(path).length));
            paths.add(path);
          }
        }

        this.paths = paths;
        this.values = values;
      }

      public reset(): void {
        for (const node of this.nodes)
          node.reset();
      }

      public update(_deltaTime: number, _values: Map<string, Float32Array>): void {
        if (this.weight == 0 || this.nodes.length == 0)
          return;

        _deltaTime *= this.speed;

        const valuesBlended: Map<string, Float32Array> = this.values;
        for (const path of valuesBlended.keys()) {
          const valueIn: Float32Array = _values.get(path);
          const valueBlended: Float32Array = valuesBlended.get(path);
          valueBlended.set(valueIn);
        }

        for (let i: number = 0; i < this.nodes.length; i++) {
          const node: AnimationNode = this.nodes[i];
          node.update(_deltaTime, valuesBlended);
          
          const valuesNode: Map<string, Float32Array> = node.values;

          switch (node.blending) {
            // TODO: slerp for quaternion?
            case ANIMATION_BLENDING.ADDITIVE:
              for (const path of valuesNode.keys()) {
                const valueBlended: Float32Array = valuesBlended.get(path);
                const valueNode: Float32Array = valuesNode.get(path);
                const t: number = node.weight;
                for (let j: number = 0; j < valueBlended.length; j++)
                  valueBlended[j] += valueNode[j] * t;
              }
              break;
            case ANIMATION_BLENDING.OVERRIDE:
              for (const path of valuesNode.keys()) {
                const valueBlended: Float32Array = valuesBlended.get(path);
                const valueNode: Float32Array = valuesNode.get(path);
                const t: number = node.weight;
                const s: number = 1 - t;
                for (let j: number = 0; j < valueBlended.length; j++)
                  valueBlended[j] = valueBlended[j] * s + valueNode[j] * t;
              }
              break;
          };

        }
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
      /**
       * All nodes that can be transitioned to/from.
       */
      public nodes: AnimationNode[];

      public from: AnimationNode;
      public to: AnimationNode;

      public duration: number;
      public time: number;

      public constructor(_nodes: AnimationNode[], _animation: AnimationNode, _speed: number = 1, _weight: number = 1, _blending: ANIMATION_BLENDING = ANIMATION_BLENDING.OVERRIDE) {
        super(_speed, _weight, _blending);
        this.nodes = _nodes;
        this.from = _animation;

        const paths: Set<string> = new Set<string>();
        const values: Map<string, Float32Array> = new Map<string, Float32Array>();
        for (const node of _nodes) {
          for (const path of node.values.keys()) {
            if (!values.has(path))
              values.set(path, new Float32Array(node.values.get(path).length));
            paths.add(path);
          }
        }

        this.paths = paths;
        this.values = values;
      }

      public reset(): void {
        this.from.reset();
        this.to?.reset();
      }

      /** Transit to the given {@link AnimationNode} over the specified duration. The given node will be {@link reset}. */
      public transit(_to: AnimationNode, _duration: number): void {
        _to.reset();
        this.from.weight = 1;
        // if (this.to)
        //   this.from = new AnimationNodeAnimation(this.mutator);
        this.to = _to;
        this.duration = _duration;
        this.time = 0;
      }

      public update(_deltaTime: number, _values: Map<string, Float32Array>): void {
        _deltaTime *= this.speed;

        this.time += _deltaTime;

        this.from.update(_deltaTime, _values);

        let progress: number = Math.min(this.time / this.duration, 1);

        if (this.to) {
          this.to.weight = 1 - progress;
          this.to.update(_deltaTime, _values);
        }

        if (progress >= 1 && this.to) {
          this.from = this.to;
          this.to = null;
          this.duration = null;
          this.time = null;
        }
      }
    }

  }
}


