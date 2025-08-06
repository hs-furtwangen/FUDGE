/// <reference path="../Render/RenderWebGLMaterialProperty.ts"/>
/// <reference path="../../Material/Color.ts"/>

namespace FudgeCore {
  export namespace Experimental {
    /**
     * A material property is a part of a {@link Material} and provides data to render a specific {@link ShaderFeature}.
     */
    export abstract class MaterialProperty extends Mutable implements Serializable {
      /** subclasses get a iSubclass number for identification */
      public static readonly iSubclass: number;
      /** list of all the subclasses derived from this class, if they registered properly */
      public static readonly subclasses: typeof MaterialProperty[] = [];

      protected static registerSubclass(_subclass: typeof MaterialProperty): number { return MaterialProperty.subclasses.push(_subclass) - 1; }

      /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
      public updateRenderData(..._args: unknown[]): void { return; }

      /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
      public useRenderData(): void { return; }

      public serialize(): Serialization {
        return serializeDecorations(this);
      };

      public async deserialize(_serialization: Serialization): Promise<Serializable> {
        return deserializeDecorations(this, _serialization);
      };

      protected reduceMutator(_mutator: Mutator): void { return; }
    }

    @RenderWebGLMaterialPropertyColor.decorate
    export class MaterialPropertyColor extends MaterialProperty {
      public static readonly iSubclass: number = MaterialProperty.registerSubclass(MaterialPropertyColor);

      @serialize(Color)
      public color: Color;

      public constructor(_color: Color = new Color(1, 1, 1, 1)) {
        super();
        this.color = _color;
      }
    }

    @RenderWebGLMaterialPropertyRemissive.decorate
    export class MaterialPropertyRemissive extends MaterialProperty {
      public static readonly iSubclass: number = MaterialProperty.registerSubclass(MaterialPropertyRemissive);

      @serialize(Number)
      public diffuse: number;

      @serialize(Number)
      public specular: number;

      @serialize(Number)
      public intensity: number;

      @serialize(Number)
      public metallic: number;

      public constructor(_diffuse: number = 1, _specular: number = 0.5, _intensity: number = 0.7, _metallic: number = 0.0) {
        super();
        this.diffuse = _diffuse;
        this.specular = _specular;
        this.intensity = _intensity;
        this.metallic = _metallic;
      }
    }

    export abstract class MaterialPropertyTexture extends MaterialProperty {
      @serialize(Texture)
      public texture: Texture;

      public constructor(_texture?: Texture) {
        super();
        this.texture = _texture;
      }
    }

    @RenderWebGLMaterialPropertyTextureColor.decorate
    export class MaterialPropertyTextureColor extends MaterialPropertyTexture {
      public static readonly iSubclass: number = MaterialProperty.registerSubclass(MaterialPropertyTextureColor);

      public constructor(_texture: Texture = TextureDefault.color) {
        super(_texture);
      }
    }

    @RenderWebGLMaterialPropertyTextureNormal.decorate
    export class MaterialPropertyTextureNormal extends MaterialPropertyTexture {
      public static readonly iSubclass: number = MaterialProperty.registerSubclass(MaterialPropertyTextureNormal);

      public constructor(_texture: Texture = TextureDefault.normal) {
        super(_texture);
      }
    }

    @RenderWebGLMaterialPropertyTextureToon.decorate
    export class MaterialPropertyTextureToon extends MaterialPropertyTexture {
      public static readonly iSubclass: number = MaterialProperty.registerSubclass(MaterialPropertyTextureToon);

      public constructor(_texture: Texture = TextureDefault.toon) {
        super(_texture);
      }
    }
  }
}