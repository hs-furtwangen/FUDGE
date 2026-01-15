namespace FudgeCore {
  /**
   * A {@link Coat} providing a color and parameters for the phong shading model.
   */
  @orderFlat
  export class CoatRemissive extends CoatColored {
    @order(2)
    @edit(Number)
    public diffuse: number;

    @order(3)
    @edit(Number)
    public specular: number;

    @order(4)
    @edit(Number)
    public intensity: number;

    #metallic: number;

    public constructor(_color: Color = new Color(), _diffuse: number = 1, _specular: number = 0.5, _intensity: number = 0.7, _metallic: number = 0.0) {
      super(_color);
      this.diffuse = _diffuse;
      this.specular = _specular;
      this.intensity = _intensity;
      this.metallic = _metallic;
    }

    @order(5)
    @edit(Number)
    public get metallic(): number {
      return this.#metallic;
    }

    public set metallic(_value: number) {
      this.#metallic = Calc.clamp(_value, 0, 1);
    }
  }
}