namespace FudgeCore {
  /**
   * A {@link Coat} providing a texture and additional data for texturing
   */
  export class CoatTextured extends CoatColored {

    @type(Texture)
    public texture: Texture;

    public constructor(_color: Color = new Color(), _texture: Texture = TextureDefault.color) {
      super(_color);
      this.texture = _texture;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = super.serialize();
      serialization.idTexture = this.texture.idResource;
      return serialization;
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);
      if (_serialization.idTexture)
        this.texture = <Texture>await Project.getResource(_serialization.idTexture);
      return this;
    }
    //#endregion
  }
}