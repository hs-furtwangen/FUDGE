namespace FudgeCore {

  export enum ANIMATION_BLENDING {
    ADDITIVE = "Additive",
    OVERRIDE = "Override"
  }

  export abstract class AnimationNode {
    /** The (blended) {@link Animation.getState animation mutator} at the state of the last {@link update}. */
    public mutator: Mutator;
    /** The {@link Animation.events events} that occured between the nodes last two {@link update}s. */
    public events: string[];

    /** The playback speed */
    public speed: number;

    public weight?: number;
    public blending?: ANIMATION_BLENDING;

    public constructor(_options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      this.speed = _options?.speed ?? 1;
      this.weight = _options?.weight;
      this.blending = _options?.blending;
    }

    public abstract setTime(_time: number): void;

    /** Returns the {@link Animation.totalTime length} of this nodes animation or the length of the first node in the subtree */
    public abstract getLength(): number;

    /** Updates the {@link mutator} and {@link events} according the given delta time, direction and quantization. */
    public abstract update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION, _pose?: Mutator): void;
  }

  export class AnimationNodeAnimation extends AnimationNode {
    public animation: Animation;
    public playmode: ANIMATION_PLAYMODE;

    /** The time after the last {@link update}. */
    public time: number;

    public constructor(_animation: Animation, _options?: { speed?: number; playmode?: ANIMATION_PLAYMODE; weight?: number; blending?: ANIMATION_BLENDING });
    public constructor();
    public constructor(_mutator: Mutator);
    public constructor(_animation?: Animation | Mutator, _options?: { speed?: number; playmode?: ANIMATION_PLAYMODE; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);

      if (!_animation)
        return;

      if (!(_animation instanceof Animation)) {
        this.mutator = _animation;
        return;
      }

      this.animation = _animation;
      this.playmode = _options?.playmode;
      this.time = 0;
    }

    public setTime(_time: number): void {
      this.time = _time * this.speed;
    }

    public getLength(): number {
      return this.animation.totalTime;
    }

    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      if (!this.animation)
        return;

      _playmode = this.playmode ?? _playmode;
      _deltaTime *= this.speed;

      let updatedTime: number = this.time + _deltaTime;

      if (this.animation.totalTime == 0)
        return;

      if (_quantization == ANIMATION_QUANTIZATION.FRAMES)
        updatedTime = this.time + (1000 / this.animation.fps);

      updatedTime = this.animation.getModalTime(updatedTime, _playmode);

      let direction: number = this.animation.calculateDirection(updatedTime, _playmode);

      this.events = this.animation.getEventsToFire(this.time, updatedTime, _quantization, direction);
      this.mutator = this.animation.getState(updatedTime % this.animation.totalTime, direction, _quantization);
      this.time = updatedTime;

      return;
    }
  }

  export class AnimationNodeBlend extends AnimationNode {
    public nodes: AnimationNode[];

    public constructor(_nodes: AnimationNode[], _options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);
      this.nodes = _nodes;
    }

    public setTime(_time: number): void {
      for (const node of this.nodes)
        node.setTime(_time);
    }

    public getLength(): number {
      return this.nodes[0].getLength();
    }

    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION): void {
      if (this.nodes.length == 0) {
        this.mutator = null;
        this.events = [];
        return;
      }

      _deltaTime *= this.speed;

      this.nodes[0].update(_deltaTime, _playmode, _quantization, {});
      let mutator: Mutator = this.nodes[0].mutator ?? {};
      let events: string[] = this.nodes[0].events ?? [];
      for (let i: number = 1; i < this.nodes.length; i++) {
        const node: AnimationNode = this.nodes[i];
        node.update(_deltaTime, _playmode, _quantization, mutator);

        if (Reflect.get(this, "test")) {
          let n0: AnimationNodeAnimation = <AnimationNodeAnimation>this.nodes[i - 1];
          let n1: AnimationNodeAnimation = <AnimationNodeAnimation>this.nodes[i];
          let t0: number = n0.time;
          let t1: number = n1.time;

          let t0Norm: number = (t0 % n0.animation.totalTime) / n0.animation.totalTime;
          let t1Norm: number = (t1 % n1.animation.totalTime) / n1.animation.totalTime;

          if (t0Norm - t1Norm > 0.005) {
            console.log(t0Norm, t1Norm);
          }
        }

        if (!node.mutator)
          continue;

        switch (node.blending ?? ANIMATION_BLENDING.OVERRIDE) {
          case ANIMATION_BLENDING.ADDITIVE:
            mutator = Animation.blendAdditive(mutator, node.mutator, node.weight ?? 1);
            break;
          case ANIMATION_BLENDING.OVERRIDE:
            mutator = Animation.blendOverride(mutator, node.mutator, node.weight ?? 1);
            break;
        }

        events = events.concat(node.events);
      }

      this.mutator = mutator;
      this.events = events;
    }
  }

  export class AnimationNodeTransition extends AnimationNode {
    public from: AnimationNode;
    public to: AnimationNode;

    public duration: number;
    public time: number;

    public constructor(_animation: AnimationNode, _options?: { speed?: number; weight?: number; blending?: ANIMATION_BLENDING }) {
      super(_options);
      this.from = _animation;
    }

    public setTime(_time: number): void {
      this.time = _time;
    }

    public getLength(): number {
      return this.duration;
    }

    public transit(_to: AnimationNode, _duration: number, _offset: number = 0): void {
      _to.setTime(_offset);
      if (this.to)
        this.from = new AnimationNodeAnimation(this.mutator);
      this.to = _to;
      this.duration = _duration;
      this.time = 0;
    }

    public update(_deltaTime: number, _playmode: ANIMATION_PLAYMODE, _quantization: ANIMATION_QUANTIZATION, _pose: Mutator): void {
      _deltaTime *= this.speed;

      this.time += _deltaTime;

      this.from.update(_deltaTime, _playmode, _quantization);

      if (!this.to) {
        this.mutator = this.from.mutator;
        this.events = this.from.events;
        return;
      }

      this.to.update(_deltaTime, _playmode, _quantization);

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