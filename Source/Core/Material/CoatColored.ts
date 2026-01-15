namespace FudgeCore {
  /**
   * The simplest {@link Coat} providing just a color
   */
  export class CoatColored extends Coat {
    @order(1)
    @edit(Color)
    public color: Color;

    public constructor(_color: Color = new Color()) {
      super();
      this.color = _color;
    }
  }
}