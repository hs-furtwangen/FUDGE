namespace FudgeCore {

  /**
   * A {@link Coat} providing a color and parameters for the toon shading model.
   */
  export class CoatToon extends mixinCoatToon(CoatRemissive) {
    public constructor(_color: Color = new Color(), _texToon: Texture = TextureDefault.toon, _diffuse?: number, _specular: number = 1.2, _intensity?: number, _metallic?: number) {
      super(_color, _diffuse, _specular, _intensity, _metallic);
      this.texToon = _texToon;
    }
  }

  /**
   * A {@link Coat} providing a texture, a color and parameters for the toon shading model.
   */
  export class CoatToonTextured extends mixinCoatToon(CoatRemissiveTextured) {
    public constructor(_color: Color = new Color(), _texture: Texture = TextureDefault.color, _texToon: Texture = TextureDefault.toon, _diffuse?: number, _specular: number = 1.2, _intensity?: number, _metallic?: number) {
      super(_color, _texture, _diffuse, _specular, _intensity, _metallic);
      this.texToon = _texToon;
    }
  }

  function mixinCoatToon<TBase extends new (...args: General[]) => Serializable & Mutable>(_base: TBase): (abstract new (...args: General[]) => { texToon: Texture }) & TBase {
    abstract class CoatToon extends _base {

      @type(Texture)
      public texToon: Texture;

      public serialize(): Serialization {
        let serialization: Serialization = super.serialize();
        serialization.idTexToon = this.texToon.idResource;
        return serialization;
      }

      public async deserialize(_serialization: Serialization): Promise<Serializable> {
        await super.deserialize(_serialization);
        if (_serialization.idTexToon)
          this.texToon = <Texture>await Project.getResource(_serialization.idTexToon);
        return this;
      }
    }

    return CoatToon;
  }
}



