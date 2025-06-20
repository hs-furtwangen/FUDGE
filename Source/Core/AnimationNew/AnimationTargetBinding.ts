namespace FudgeCore {
  export namespace AnimationSystem {

    /**
     * Binds a specific {@link Mutable} animation target within a node graph and allows {@link Mutable.animate animation} of it.
     */
    export class AnimationTargetBinding {
      public target: Mutable;
      public animationMutator: AnimationMutator;
      public mutator: AnimationMutator;

      public propertyBindings: AnimationPropertyBinding[];

      public constructor(_target: Mutable, _propertyBindings: AnimationPropertyBinding[]) {
        this.target = _target;
        this.propertyBindings = _propertyBindings;

        const animationMutator: AnimationMutator = {};
        for (const binding of _propertyBindings)
          animationMutator[binding.key] = binding.output;
        this.animationMutator = animationMutator;
      }

      public apply(): void {
        this.target.animate(this.animationMutator);
      }
    }
  }
}