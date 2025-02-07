namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive an ambient occlusion effect.
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class ComponentOutline extends Component {
    public nodes: Node[];

    public constructor(_nodes: Node[] = []) {
      super();
      this.nodes = _nodes;
    }
  }
}