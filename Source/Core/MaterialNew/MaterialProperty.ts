namespace FudgeCore {
  export namespace MaterialSystem {
    /**
     * A material property is a part of a {@link Material} and provides data to render a specific {@link ShaderFeature}.
     */
    export abstract class MaterialProperty extends Mutable implements Serializable {

      /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
      public updateRenderData(..._args: unknown[]): void { return; }

      /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
      public useRenderData(): void { return; }

      protected reduceMutator(_mutator: Mutator): void { return; }

      public abstract serialize(): Serialization;
      public abstract deserialize(_serialization: Serialization): Promise<Serializable>;
    }

    @RenderWebGLMaterialPropertyColor.decorate
    export class MaterialPropertyColor extends MaterialProperty {
      public color: Color;

      public constructor(_color: Color = new Color(1, 1, 1, 1)) {
        super();
        this.color = _color;
      }

      public serialize(): Serialization {
        const serialization: SerializationOf<MaterialPropertyColor> = {};
        serialization.color = this.color.serialize();
        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<MaterialPropertyColor>): Promise<Serializable> {
        await this.color.deserialize(_serialization.color);
        return this;
      }
    }

    @RenderWebGLMaterialPropertyRemissive.decorate
    export class MaterialPropertyRemissive extends MaterialProperty {
      public diffuse: number;
      public specular: number;
      public intensity: number;
      public metallic: number;

      public constructor(_diffuse: number = 1, _specular: number = 0.5, _intensity: number = 0.7, _metallic: number = 0.0) {
        super();
        this.diffuse = _diffuse;
        this.specular = _specular;
        this.intensity = _intensity;
        this.metallic = _metallic;
      }

      public serialize(): Serialization {
        const serialization: SerializationOf<MaterialPropertyRemissive> = {
          diffuse: this.diffuse,
          specular: this.specular,
          intensity: this.intensity,
          metallic: this.metallic
        };
        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<MaterialPropertyRemissive>): Promise<Serializable> {
        this.diffuse = _serialization.diffuse;
        this.specular = _serialization.specular;
        this.intensity = _serialization.intensity;
        this.metallic = _serialization.metallic;
        return this;
      }
    }

    export abstract class MaterialPropertyTexture extends MaterialProperty {
      public texture: Texture;

      public constructor(_texture?: Texture) {
        super();
        this.texture = _texture;
      }

      public serialize(): Serialization {
        const serialization: SerializationOf<MaterialPropertyTexture> = {};
        if (this.texture)
          serialization.texture = this.texture.idResource;
        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<MaterialPropertyTexture>): Promise<Serializable> {
        if (_serialization.texture)
          this.texture = <Texture>await Project.getResource(_serialization.texture);
        return this;
      }
    }

    @RenderWebGLMaterialPropertyTextureColor.decorate
    export class MaterialPropertyTextureColor extends MaterialPropertyTexture {
      public constructor(_texture: Texture = TextureDefault.color) {
        super(_texture);
      }
    }

    @RenderWebGLMaterialPropertyTextureNormal.decorate
    export class MaterialPropertyTextureNormal extends MaterialPropertyTexture {
      public constructor(_texture: Texture = TextureDefault.normal) {
        super(_texture);
      }
    }

    @RenderWebGLMaterialPropertyTextureToon.decorate
    export class MaterialPropertyTextureToon extends MaterialPropertyTexture {
      public constructor(_texture: Texture = TextureDefault.toon) {
        super(_texture);
      }
    }
  }
}