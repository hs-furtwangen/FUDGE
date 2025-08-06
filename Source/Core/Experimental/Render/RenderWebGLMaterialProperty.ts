namespace FudgeCore {
  export abstract class RenderWebGLMaterialProperty {
    public static decorate(_constructor: typeof Experimental.MaterialProperty, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor.prototype, _constructor.prototype.updateRenderData.name, { value: this.updateRenderData });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderData.name, { value: this.useRenderData });
    }

    public static updateRenderData(this: Experimental.MaterialProperty, _data: Float32Array, _offset: number): void {
      return; // overridden by subclasses // TODO: inspect if optional method would be faster?
    }

    public static useRenderData(this: Experimental.MaterialProperty): void {
      return; // overridden by subclasses // TODO: inspect if optional method would be faster?
    }
  }

  export abstract class RenderWebGLMaterialPropertyColor extends RenderWebGLMaterialProperty {
    public static updateRenderData(this: Experimental.MaterialPropertyColor, _data: Float32Array, _offset: number): void {
      this.color.toArray(_data, _offset);
    }
  }

  export abstract class RenderWebGLMaterialPropertyRemissive extends RenderWebGLMaterialProperty {
    public static updateRenderData(this: Experimental.MaterialPropertyRemissive, _data: Float32Array, _offset: number): void {
      _data[_offset + 4] = this.diffuse;
      _data[_offset + 5] = this.specular;
      _data[_offset + 6] = this.intensity;
      _data[_offset + 7] = this.metallic;
    }
  }

  export abstract class RenderWebGLMaterialPropertyTextureColor extends RenderWebGLMaterialProperty {
    public static useRenderData(this: Experimental.MaterialPropertyTextureColor): void {
      this.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
    }
  }

  export abstract class RenderWebGLMaterialPropertyTextureNormal extends RenderWebGLMaterialProperty {
    public static useRenderData(this: Experimental.MaterialPropertyTextureNormal): void {
      this.texture.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);
    }
  }

  export abstract class RenderWebGLMaterialPropertyTextureToon extends RenderWebGLMaterialProperty {
    public static useRenderData(this: Experimental.MaterialPropertyTextureToon): void {
      this.texture.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }
}