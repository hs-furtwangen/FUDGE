namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes all nodes in {@link selection} to be drawn with a 1px outline.
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class ComponentOutline extends Component {
    public color: Color;
    public colorOccluded: Color;
    public selection: Iterable<Node>;

    public constructor(_selection: Node[] = [], _color: Color = new Color(0, 0, 0, 1), _colorOccluded: Color = new Color(0, 0, 0, 0)) {
      super();
      this.selection = _selection;
      this.color = _color;
      this.colorOccluded = _colorOccluded;
    }
  }
}