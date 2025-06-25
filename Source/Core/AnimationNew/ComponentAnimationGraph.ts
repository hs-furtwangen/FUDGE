namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Attaches a {@link AnimationNode} to a {@link Node} and updates the node's properties according to the animation graph.
     */
    export class ComponentAnimationGraph extends Component {
      public root: AnimationNode;

      #valuesOriginal: Map<string, Float32Array>;
      #propertyBindings: AnimationPropertyBinding[];
      #targetBindings: AnimationTargetBinding[];

      readonly #dispatchEvent: (_event: EventUnified) => boolean = this.dispatchEvent.bind(this);

      public constructor(_root?: AnimationNode) {
        super();
        this.root = _root;

        if (Project.mode == MODE.EDITOR)
          return;

        this.addEventListener(EVENT.COMPONENT_ADD, this.onComponentAdd);
        this.addEventListener(EVENT.COMPONENT_REMOVE, this.onComponentRemove);
      }

      public bind(): void {
        if (!this.node || !this.root)
          return;

        const valuesRoot: Map<string, Float32Array> = this.root.values;
        const valuesOriginal: Map<string, Float32Array> = new Map();
        const propertyBindings: AnimationPropertyBinding[] = [];
        const targetBindings: AnimationTargetBinding[] = [];

        const targetsGrouped: Map<Mutable, AnimationPropertyBinding[]> = new Map();

        for (const path of valuesRoot.keys()) {
          const valueRoot: Float32Array = valuesRoot.get(path);
          const binding: AnimationPropertyBinding = new AnimationPropertyBinding(this.node, path, valueRoot);
          binding.bind();
          propertyBindings.push(binding);

          const valueOriginal: Float32Array = new Float32Array(valueRoot.length);
          valuesOriginal.set(path, valueOriginal);
          binding.get(valueOriginal, 0);

          let bindings: AnimationPropertyBinding[] = targetsGrouped.get(binding.target);
          if (!bindings)
            targetsGrouped.set(binding.target, bindings = []);

          bindings.push(binding);
        }

        for (const [target, bindings] of targetsGrouped) {
          const targetBinding: AnimationTargetBinding = new AnimationTargetBinding(target, bindings);
          targetBindings.push(targetBinding);
        }

        this.#valuesOriginal = valuesOriginal;
        this.#propertyBindings = propertyBindings;
        this.#targetBindings = targetBindings;
      };

      public unbind(): void {
        const bindings: AnimationPropertyBinding[] = this.#propertyBindings;
        for (let i: number = 0; i < bindings.length; i++)
          bindings[i].unbind();

        this.#valuesOriginal = null;
        this.#propertyBindings = null;
        this.#targetBindings = null;
      }

      public update(_deltaTime: number): void {
        if (!this.root || !this.node || !this.active)
          return;

        const root: AnimationNode = this.root;
        root.update(Loop.timeFrameGame, this.#valuesOriginal, this.#valuesOriginal, this.#dispatchEvent);

        const targetBindings: AnimationTargetBinding[] = this.#targetBindings;
        for (let i: number = 0; i < targetBindings.length; i++)
          targetBindings[i].apply();
      }

      private hndRenderPrepare = (): void => {
        this.update(Loop.timeFrameGame);
      };

      private onComponentAdd = (): void => {
        this.node.addEventListener(EVENT.RENDER_PREPARE, this.hndRenderPrepare);
        this.bind();
      };

      private onComponentRemove = (): void => {
        this.node.removeEventListener(EVENT.RENDER_PREPARE, this.hndRenderPrepare);
        this.unbind();
      };
    }
  }
}