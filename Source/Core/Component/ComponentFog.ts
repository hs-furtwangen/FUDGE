namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive a fog-effect.
   * @authors Roland Heer, HFU, 2023 | Jonas Plotzky, HFU, 2025
   */
  export class ComponentFog extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentFog);

    @edit(Color)
    public color: Color;

    @edit(Number)
    public near: number;

    @edit(Number)
    public far: number;

    public constructor(_color: Color = new Color(1, 1, 1, 1), _near: number = 1, _far: number = 50) {
      super();
      this.color = _color;
      this.near = _near;
      this.far = _far;
    }
  }
}