namespace FudgeCore {
  /**
   * A {@link Coat} providing a texture and additional data for texturing
   */
  export class CoatTextured extends CoatColored {

    @editReference(Texture)
    public texture: Texture;

    public constructor(_color: Color = new Color(), _texture: Texture = TextureDefault.color) {
      super(_color);
      this.texture = _texture;
    }
  }
}