namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive a fog-effect.
   * @authors Roland Heer, HFU, 2023
   */
  export class ComponentFog extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentFog);

    @edit(Color)
    public color: Color = new Color(1, 1, 1, 1);

    @edit(Number)
    public near: number = 1;

    @edit(Number)
    public far: number = 50;
  }
}