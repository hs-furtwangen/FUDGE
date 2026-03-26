namespace FudgeCore {

  /**
   * A {@link Coat} providing a color and parameters for the toon shading model.
   */
  export class CoatToon extends mixinCoatToon(CoatRemissive) {
    public constructor(_color: Color = new Color(), _texToon: Texture = TextureDefault.toon, _diffuse?: number, _specular: number = 1.2, _intensity?: number, _metallic?: number) {
      super(_color, _diffuse, _specular, _intensity, _metallic);
      this.texToon = _texToon;
    }

    @RenderInjectorCoatToon.decorate
    public useRenderData(): void { /* injected */ };
  }

  /**
   * A {@link Coat} providing a texture, a color and parameters for the toon shading model.
   */
  export class CoatToonTextured extends mixinCoatToon(CoatRemissiveTextured) {
    public constructor(_color: Color = new Color(), _texture: Texture = TextureDefault.color, _texToon: Texture = TextureDefault.toon, _diffuse?: number, _specular: number = 1.2, _intensity?: number, _metallic?: number) {
      super(_color, _texture, _diffuse, _specular, _intensity, _metallic);
      this.texToon = _texToon;
    }

    @RenderInjectorCoatToonTextured.decorate
    public useRenderData(): void { /* injected */ };
  }

  function mixinCoatToon<TBase extends new (...args: General[]) => Serializable & Mutable>(_base: TBase): (abstract new (...args: General[]) => { texToon: Texture }) & TBase {
    abstract class CoatToon extends _base {

      @edit(Texture)
      public texToon: Texture;
    }

    return CoatToon;
  }
}



