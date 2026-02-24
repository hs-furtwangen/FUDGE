namespace FudgeCore {

  /**
   * Manages {@link Coat} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderManagerCoat extends RenderbufferManager {
    public static override initialize(_renderWebGL: typeof RenderWebGL): void {
      const maxMaterials: number = 128;
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super.initialize(_renderWebGL, UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, maxMaterials);
    }

    protected static updateRenderData(this: Coat): void {
      const offset: number = RenderManagerCoat.store(this);

      const data: Float32Array = RenderManagerCoat.data;

      if (this instanceof CoatColored) {
        const color: Color = this.color;
        data[offset] = color.r;
        data[offset + 1] = color.g;
        data[offset + 2] = color.b;
        data[offset + 3] = color.a;
      }

      if (this instanceof CoatRemissive || this instanceof CoatRemissiveTextured) {
        data[offset + 4] = this.diffuse;
        data[offset + 5] = this.specular;
        data[offset + 6] = this.intensity;
        data[offset + 7] = this.metallic;
      }

      data[offset + 8] = this.alphaClip;
    }

    protected static useRenderData(this: Coat): void {
      RenderManagerCoat.useRenderbuffer(this);
    }
  }

  /**
   * @internal
   */
  export class RenderManagerCoatTextured extends RenderManagerCoat {
    protected static override useRenderData(this: CoatTextured): void {
      super.useRenderData();
      this.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
    }
  }

  /**
   * @internal
   */
  export class RenderManagerCoatRemissiveTexturedNormals extends RenderManagerCoatTextured {
    protected static override useRenderData(this: CoatRemissiveTexturedNormals): void {
      super.useRenderData();
      this.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);
    }
  }

  /**
   * @internal
   */
  export class RenderManagerCoatToon extends RenderManagerCoat {
    protected static override useRenderData(this: CoatToon): void {
      super.useRenderData();
      this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }

  /**
   * @internal
   * needed for correct injected super call to RenderManagerCoatTextured...
   */
  export class RenderManagerCoatToonTextured extends RenderManagerCoatTextured {
    protected static override useRenderData(this: CoatToonTextured): void {
      super.useRenderData();
      this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }
}