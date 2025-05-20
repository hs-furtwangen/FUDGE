namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Attaches a {@link AnimationNode} to a {@link Node} and updates the node's properties according to the animation graph.
     */
    export class ComponentAnimation extends Component {
      public root: AnimationNode;

      readonly #valuesOriginal: Map<string, Float32Array>;
      readonly #bindings: Map<string, AnimationPropertyBinding>;
      readonly #components: Set<Component>;

      public constructor(_root?: AnimationNode) {
        super();
        this.root = _root;
        this.#valuesOriginal = new Map<string, Float32Array>();
        this.#bindings = new Map<string, AnimationPropertyBinding>();
        this.#components = new Set<Component>();

        if (Project.mode == MODE.EDITOR)
          return;

        this.addEventListener(EVENT.COMPONENT_ADD, this.onComponentAdd);
        this.addEventListener(EVENT.COMPONENT_REMOVE, this.onComponentRemove);

        if (!this.root)
          return;

        const valuesRoot: Map<string, Float32Array> = this.root.values;
        for (const path of valuesRoot.keys()) {
          this.#bindings.set(path, new AnimationPropertyBinding(null, path));
          this.#valuesOriginal.set(path, new Float32Array(valuesRoot.get(path).length));
        }
      }

      public bind(): void {
        const bindings: Map<string, AnimationPropertyBinding> = this.#bindings;
        const valuesOriginal: Map<string, Float32Array> = this.#valuesOriginal;
        const components: Set<Component> = this.#components;
        for (const path of this.#bindings.keys()) {
          const binding: AnimationPropertyBinding = bindings.get(path);
          binding.root = this.node;
          binding.bind();
          binding.get(valuesOriginal.get(path), 0);

          if (binding.component.onAnimate)
            components.add(binding.component);
        }
      };

      public unbind(): void {
        const bindings: Map<string, AnimationPropertyBinding> = this.#bindings;
        for (const path of this.#bindings.keys()) {
          const binding: AnimationPropertyBinding = bindings.get(path);
          binding.unbind();
        }
        this.#valuesOriginal.clear();
        this.#bindings.clear();
        this.#components.clear();
      }

      private update = (): void => {
        if (!this.root || !this.node || !this.active)
          return;

        const root: AnimationNode = this.root;
        root.update(Loop.timeFrameGame, this.#valuesOriginal);

        const values: Map<string, Float32Array> = root.values;
        const bindings: Map<string, AnimationPropertyBinding> = this.#bindings;

        for (const path of values.keys()) {
          const binding: AnimationPropertyBinding = bindings.get(path);
          const value: Float32Array = values.get(path);
          binding.set(value, 0);
        }

        for (const component of this.#components) 
          component.onAnimate();
      };

      private onComponentAdd = (): void => {
        this.node.addEventListener(EVENT.RENDER_PREPARE, this.update);
        this.bind();
      };

      private onComponentRemove = (): void => {
        this.node.removeEventListener(EVENT.RENDER_PREPARE, this.update);
        this.unbind();
        this.#valuesOriginal.clear();
        this.#bindings.clear();
      };
    }
  }
}