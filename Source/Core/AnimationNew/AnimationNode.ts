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
     * Can be attached to a {@link Node} via {@link ComponentAnimationGraph}. 
     * @author Jonas Plotzky, HFU, 2024-2025
     */
    export abstract class AnimationNode {
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
      public abstract update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void;
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

      #previousTime: number;

      public constructor(_animation: Animation, _playmode: ANIMATION_PLAYMODE = ANIMATION_PLAYMODE.LOOP, _speed?: number, _offset: number = 0, _weight?: number, _blending?: ANIMATION_BLENDING) {
        super(_speed, _weight, _blending);

        this.animation = _animation;
        this.playmode = _playmode;
        this.time = 0;
        this.offset = _offset;
        this.#previousTime = 0;

        const channels: AnimationChannel[] = this.animation.channels;
        const nChannels: number = channels.length;
        const values: Map<string, Float32Array> = new Map();
        const interpolants: AnimationInterpolant[] = new Array(nChannels);

        for (let i: number = 0; i < nChannels; i++) {
          const channel: AnimationChannel = channels[i];
          const value: Float32Array = new Float32Array(channel.getElementSize());
          values.set(channel.targetPath, value);
          interpolants[i] = channel.createInterpolant(value);
        }

        this.values = values;
        this.interpolants = interpolants;
      }

      public override reset(): void {
        this.time = this.offset;
      }

      public override update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void {
        const animation: Animation = this.animation;
        const duration: number = animation.duration;
        const time: number = (this.time += _deltaTime * this.speed) % duration;
        const interpolants: AnimationInterpolant[] = this.interpolants;
        const length: number = interpolants.length;

        for (let i: number = 0; i < length; i++) 
          interpolants[i].evaluate(time);

        const eventTrack: AnimationEventTrack = animation.eventTrack;
        const eventTrackTimes: number[] = eventTrack.times;
        if (eventTrackTimes.length == 0)
          return;

        let min: number = this.#previousTime;
        let max: number = time;
        let minSection: number = Math.floor(min / duration);
        let maxSection: number = Math.floor(max / duration);
        min = min % duration;
        max = max % duration;

        const eventTrackEvents: string[][] = eventTrack.events;
        while (minSection <= maxSection) {
          for (let i: number = 0; i < eventTrackTimes.length; i++) {
            const time: number = eventTrackTimes[i];
            if (min <= time && time < max) {
              const events: string[] = eventTrackEvents[i];
              for (let j: number = 0; j < events.length; j++) {
                const event: RecyclableEvent = RecyclableEvent.get(events[j]);
                _dispatchEvent(event);
                RecyclableEvent.store(event);
              }
            }
          }

          if (minSection != maxSection)
            min = 0;

          minSection++;
        }

        this.#previousTime = time;
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

        const values: Map<string, Float32Array> = new Map<string, Float32Array>();
        for (const node of _nodes) {
          for (const path of node.values.keys()) {
            if (!values.has(path))
              values.set(path, new Float32Array(node.values.get(path).length));
          }
        }

        this.values = values;
      }

      public override reset(): void {
        for (const node of this.nodes)
          node.reset();
      }

      public override update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void {
        _deltaTime *= this.speed;

        const valuesBlended: Map<string, Float32Array> = this.values;
        for (const path of valuesBlended.keys()) {
          const valueOriginal: Float32Array = _valuesOriginal.get(path);
          const valueBlended: Float32Array = valuesBlended.get(path);
          valueBlended.set(valueOriginal);
        }

        for (let i: number = 0; i < this.nodes.length; i++) {
          const node: AnimationNode = this.nodes[i];
          node.update(_deltaTime, valuesBlended, _valuesOriginal, _dispatchEvent);

          const valuesNode: Map<string, Float32Array> = node.values;

          const t: number = node.weight;
          if (t == 0)
            continue;

          switch (node.blending) {
            // TODO: slerp for quaternion?
            case ANIMATION_BLENDING.ADDITIVE:
              for (const path of valuesNode.keys()) {
                const valueBlended: Float32Array = valuesBlended.get(path);
                const valueNode: Float32Array = valuesNode.get(path);

                for (let j: number = 0; j < valueBlended.length; j++)
                  valueBlended[j] += valueNode[j] * t;
              }
              break;
            case ANIMATION_BLENDING.OVERRIDE:
              for (const path of valuesNode.keys()) {
                const valueBlended: Float32Array = valuesBlended.get(path);
                const valueNode: Float32Array = valuesNode.get(path);

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

      public current: AnimationNode;
      public target: AnimationNode;

      public canceled: boolean;

      public transition: boolean;
      public duration: number;
      public time: number;

      #valuesCached: Map<string, Float32Array>;

      public constructor(_nodes: AnimationNode[], _animation: AnimationNode, _speed: number = 1, _weight: number = 1, _blending: ANIMATION_BLENDING = ANIMATION_BLENDING.OVERRIDE) {
        super(_speed, _weight, _blending);
        this.nodes = _nodes;
        this.current = _animation;

        const values: Map<string, Float32Array> = new Map<string, Float32Array>();
        const valuesCached: Map<string, Float32Array> = new Map<string, Float32Array>();
        for (const node of _nodes) {
          for (const path of node.values.keys()) {
            if (!values.has(path))
              values.set(path, new Float32Array(node.values.get(path).length));

            if (!valuesCached.has(path))
              valuesCached.set(path, new Float32Array(node.values.get(path).length));
          }
        }

        this.values = values;
        this.#valuesCached = valuesCached;
      }

      public override reset(): void {
        this.current.reset();
        this.target?.reset();
      }

      /** 
       * Transit to the given {@link AnimationNode} over the specified duration. The given node will be {@link reset}. 
       */
      public transit(_target: AnimationNode, _duration: number): void {
        _target?.reset();
        if (this.transition) {
          const valuesCurrent: Map<string, Float32Array> = this.values;
          const valuesCached: Map<string, Float32Array> = this.#valuesCached;
          for (const path of valuesCurrent.keys())
            valuesCached.get(path).set(valuesCurrent.get(path));

          this.canceled = true;
        }
        this.target = _target;
        this.duration = _duration;
        this.time = 0;
        this.transition = true;
      }

      public update(_deltaTime: number, _valuesCurrent: Map<string, Float32Array>, _valuesOriginal: Map<string, Float32Array>, _dispatchEvent: (_event: EventUnified) => boolean): void {
        _deltaTime *= this.speed;

        const current: AnimationNode = this.current;
        const target: AnimationNode = this.target;
        const valuesOut: Map<string, Float32Array> = this.values;

        let valuesFrom: Map<string, Float32Array>;
        let valuesTo: Map<string, Float32Array>;

        if (this.canceled) {
          valuesFrom = this.#valuesCached;
        } else if (current) {
          current.update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent);
          valuesFrom = current.values;
        } else {
          valuesFrom = _valuesCurrent;
        }

        if (target) {
          target.update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent);
          valuesTo = target.values;
        } else {
          valuesTo = _valuesCurrent;
        }

        if (!this.transition) {
          for (const path of valuesFrom.keys())
            valuesOut.get(path).set(valuesFrom.get(path));
          return;
        }

        this.time += _deltaTime;
        let progress: number = Math.min(this.time / this.duration, 1);
        for (const path of valuesTo.keys()) {
          const valueFrom: Float32Array = valuesFrom.get(path);
          const valueTo: Float32Array = valuesTo.get(path);
          const valueOut: Float32Array = valuesOut.get(path);
          // Debug.log(current.time, valueFrom);
          if (valueOut.length == 4) {
            Quaternion.SLERP_ARRAY(valueFrom, 0, valueTo, 0, progress, valueOut, 0);
            continue;
          }
          const t: number = progress;
          const s: number = 1 - t;
          for (let j: number = 0; j < valueFrom.length; j++)
            valueOut[j] = valueFrom[j] * s + valueTo[j] * t;
        }


        if (progress >= 1) {
          this.current = this.target;
          this.target = null;
          this.duration = null;
          this.time = null;
          this.canceled = false;
          this.transition = false;
        }
      }
    }

  }
}


