namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes all nodes in {@link selection} to be drawn with a 1px outline.
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class ComponentOutline extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentOutline);

    @edit(Color)
    public color: Color;

    @edit(Color)
    public colorOccluded: Color;

    @edit(Array, Node)
    public selection: Iterable<Node>;

    public constructor(_selection: Node[] = [], _color: Color = new Color(), _colorOccluded: Color = new Color(1, 1, 1, 0.3)) {
      super();
      this.selection = _selection;
      this.color = _color;
      this.colorOccluded = _colorOccluded;
    }
  }
}