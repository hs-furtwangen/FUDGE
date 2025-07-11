namespace FudgeCore {
  /**
  * Manages {@link Coat} data to be transmitted during rendering.
  * @internal
  * @authors Jonas Plotzky, HFU, 2025
  */
  export class RenderManagerMaterial extends RenderbufferManager {
    public static override initialize(_renderWebGL: typeof RenderWebGL): void {
      const maxMaterials: number = 128;
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super.initialize(_renderWebGL, UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, maxMaterials);
    }

    protected static updateRenderData(this: MaterialUniversal): void {
      const offset: number = RenderManagerMaterial.store(this);
      const data: Float32Array = RenderManagerMaterial.data;

      const coatlets: Coatlet[] = this.coatlets;
      for (let i: number = 0; i < coatlets.length; i++) 
        coatlets[i].updateRenderData(data, offset);

      data[offset + 8] = this.alphaClip;
    }

    protected static useRenderData(this: MaterialUniversal): void {
      RenderManagerMaterial.useRenderbuffer(this);
      
      const coatlets: Coatlet[] = this.coatlets;
      for (let i: number = 0; i < coatlets.length; i++) 
        coatlets[i].useRenderData();
    }
  }
}