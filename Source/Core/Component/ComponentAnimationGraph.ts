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
      PerformanceMonitor.startMeasure("ComponentAnimationGraph.update");
      if (!this.root || !this.node || !this.active)
        return;

      PerformanceMonitor.startMeasure("ComponentAnimationGraph.update compute");
      this.root.update(Loop.timeFrameGame);
      this.root.events?.forEach(_event => this.dispatchEvent(new Event(_event)));
      PerformanceMonitor.endMeasure("ComponentAnimationGraph.update compute");


      PerformanceMonitor.startMeasure("ComponentAnimationGraph.update apply");
      this.node.applyAnimation(this.root.mutator);
      PerformanceMonitor.endMeasure("ComponentAnimationGraph.update apply");

      PerformanceMonitor.endMeasure("ComponentAnimationGraph.update");
    };
  }
}