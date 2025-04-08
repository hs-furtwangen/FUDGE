namespace FudgeCore {

  /**
   * Manages {@link Coat} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderManagerCoat extends RenderBufferManager {
    protected static override readonly instance: RenderManagerCoat; // lazy initialized in base class

    private constructor() {
      const maxMaterials: number = 128;
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super(UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, maxMaterials);
    }

    public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<typeof Coat, M>): M {
      return super.decorate(_method, _context);
    }

    protected override updateRenderData(_coat: Coat): void {
      const offset: number = this.store(_coat);

      const data: Float32Array = this.data;

      if (_coat instanceof CoatColored) {
        const color: Color = _coat.color;
        data[offset] = color.r;
        data[offset + 1] = color.g;
        data[offset + 2] = color.b;
        data[offset + 3] = color.a;
      }

      if (_coat instanceof CoatRemissive || _coat instanceof CoatRemissiveTextured) {
        data[offset + 4] = _coat.diffuse;
        data[offset + 5] = _coat.specular;
        data[offset + 6] = _coat.intensity;
        data[offset + 7] = _coat.metallic;
      }

      data[offset + 8] = _coat.alphaClip;
    }

    protected override useRenderData(_coat: Coat): void {
      super.useRenderData(_coat);

      if (_coat instanceof CoatTextured)
        _coat.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);

      if (_coat instanceof CoatRemissiveTexturedNormals)
        _coat.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);

      if (_coat instanceof CoatToon)
        _coat.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }
}