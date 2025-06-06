namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Attaches a {@link AnimationNode} to a {@link Node} and updates the node's properties according to the animation graph.
     */
    export class ComponentAnimation extends Component {
      public root: AnimationNode;

      readonly #valuesOriginal: Map<string, Float32Array>;
      readonly #bindings: AnimationPropertyBinding[];
      readonly #targets: Set<Mutable>;

      readonly #dispatchEvent: (_event: EventUnified) => boolean = this.dispatchEvent.bind(this);

      public constructor(_root?: AnimationNode) {
        super();
        this.root = _root;
        this.#valuesOriginal = new Map<string, Float32Array>();
        this.#bindings = [];
        this.#targets = new Set<Component>();

        if (Project.mode == MODE.EDITOR)
          return;

        this.addEventListener(EVENT.COMPONENT_ADD, this.onComponentAdd);
        this.addEventListener(EVENT.COMPONENT_REMOVE, this.onComponentRemove);
      }

      public bind(): void {
        if (!this.node || !this.root)
          return;

        const valuesRoot: Map<string, Float32Array> = this.root.values;
        const valuesOriginal: Map<string, Float32Array> = this.#valuesOriginal;
        const propertyBindings: AnimationPropertyBinding[] = this.#bindings;
        const targets: Set<Mutable> = this.#targets;

        for (const path of valuesRoot.keys()) {
          const binding: AnimationPropertyBinding = new AnimationPropertyBinding(this.node, path, valuesRoot.get(path));
          binding.bind();
          propertyBindings.push(binding);
          valuesOriginal.set(path, new Float32Array(valuesRoot.get(path).length));

          if (binding.target.onAnimate)
            targets.add(binding.target);
        }
      };

      public unbind(): void {
        const bindings: AnimationPropertyBinding[] = this.#bindings;
        for (let i: number = 0; i < bindings.length; i++)
          bindings[i].unbind();

        this.#valuesOriginal.clear();
        this.#bindings.length = 0;
        this.#targets.clear();
      }

      public update(_deltaTime: number): void {
        if (!this.root || !this.node || !this.active)
          return;

        const root: AnimationNode = this.root;
        root.update(Loop.timeFrameGame, this.#valuesOriginal, this.#valuesOriginal, this.#dispatchEvent);

        const propertyBindings: AnimationPropertyBinding[] = this.#bindings;
        for (let i: number = 0; i < propertyBindings.length; i++)
          propertyBindings[i].apply();

        for (const target of this.#targets)
          target.onAnimate();
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
        this.#valuesOriginal.clear();
        this.#bindings.length = 0;
      };
    }
  }
}