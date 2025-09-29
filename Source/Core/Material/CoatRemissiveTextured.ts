///<reference path="CoatTextured.ts"/>

namespace FudgeCore {
  /**
   * A {@link Coat} providing a texture and additional data for texturing
   */
  @orderFlat
  export class CoatRemissiveTextured extends CoatTextured {
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

    public constructor(_color: Color = new Color(), _texture: Texture = TextureDefault.color, _diffuse: number = 1, _specular: number = 0.5, _intensity: number = 0.7, _metallic: number = 0.0) {
      super(_color, _texture);
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