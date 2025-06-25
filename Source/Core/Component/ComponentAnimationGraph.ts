namespace FudgeCore {
  /**
   * Attaches an {@link AnimationNode animation graph} to a {@link Node} and animates it.
   * @author Jonas Plotzky, HFU, 2024-2025
   */
  export class ComponentAnimationGraph extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAnimationGraph);
    public root: AnimationNode;

    public constructor(_root?: AnimationNode) {
      super();
      this.root = _root;

      if (Project.mode == MODE.EDITOR)
        return;

      this.addEventListener(EVENT.COMPONENT_ADD, () => this.node.addEventListener(EVENT.RENDER_PREPARE, this.update));
      this.addEventListener(EVENT.COMPONENT_REMOVE, () => this.node.removeEventListener(EVENT.RENDER_PREPARE, this.update));
    }


    private update = (): void => {
      if (!this.root || !this.node || !this.active)
        return;

      this.root.update(Loop.timeFrameGame);
      this.root.events?.forEach(_event => this.dispatchEvent(new Event(_event)));
      this.node.applyAnimation(this.root.mutator);
    };
  }
}