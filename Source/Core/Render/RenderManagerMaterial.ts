namespace FudgeCore {
  /**
  * Manages {@link MaterialSystem.Material} data to be transmitted during rendering.
  * @internal
  * @authors Jonas Plotzky, HFU, 2025
  */
  export abstract class RenderManagerMaterial extends RenderbufferManager {
    public static override initialize(_renderWebGL: typeof RenderWebGL): void {
      const maxMaterials: number = 128;
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super.initialize(_renderWebGL, UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, maxMaterials);
    }

    protected static override updateRenderData(this: MaterialSystem.Material): void {
      const offset: number = RenderManagerMaterial.store(this);
      const data: Float32Array = RenderManagerMaterial.data;

      const properties: MaterialSystem.MaterialProperty[] = this.properties;
      for (let i: number = 0; i < properties.length; i++) 
        properties[i].updateRenderData(data, offset);

      data[offset + 8] = this.alphaClip;
    }

    protected static override useRenderData(this: MaterialSystem.Material): void {
      RenderManagerMaterial.useRenderbuffer(this);
      
      const properties: MaterialSystem.MaterialProperty[] = this.properties;
      for (let i: number = 0; i < properties.length; i++) 
        properties[i].useRenderData();
    }
  }
}