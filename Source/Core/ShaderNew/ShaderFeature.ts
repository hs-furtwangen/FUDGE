namespace FudgeCore {
  export namespace MaterialSystem {
    /**
     * A modular building block used to compose a {@link Shader}. Add shader features to a {@link Material} to enable a specific shading capability.
     */
    export abstract class ShaderFeature {
      public static readonly properties: (new () => MaterialProperty)[] = [];
      public static readonly define: string[] = [];
    }

    /**
     * A shader source feature is a shader feature that also provides source code.
     * Only one source feature may be be used per {@link Shader}.
     */
    export abstract class ShaderSourceFeature extends ShaderFeature {
      public static readonly vertexShaderSource: string;
      public static readonly fragmentShaderSource: string;
    }

    /**
     * A base class for the defining shader features that use the universal shader source code.
     */
    export abstract class ShaderFeatureUniversal extends ShaderSourceFeature {
      public static override readonly vertexShaderSource: string = shaderSources["ShaderUniversal.vert"];
      public static override readonly fragmentShaderSource: string = shaderSources["ShaderUniversal.frag"];
    }

    /**
     * Provides the basic functionality for lit materials. 
     */
    export abstract class ShaderFeatureLit extends ShaderFeatureUniversal {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyColor];
    }

    /**
     * Provides the basic functionality for flat materials. 
     */
    export abstract class ShaderFeatureFlat extends ShaderFeatureUniversal {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyColor];
      public static override readonly define: string[] = ["FLAT"];
    }

    /**
     * Provides the basic functionality for gouraud materials. 
     */
    export abstract class ShaderFeatureGouraud extends ShaderFeatureUniversal {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyColor, MaterialPropertyRemissive];
      public static override readonly define: string[] = ["GOURAUD"];
    }

    /**
     * Provides the basic functionality for phong materials. 
     */
    export abstract class ShaderFeaturePhong extends ShaderFeatureUniversal {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyColor, MaterialPropertyRemissive];
      public static override readonly define: string[] = ["PHONG"];
    }

    /**
     * Provides the basic functionality for matcap materials. 
     */
    export abstract class ShaderFeatureMatCap extends ShaderFeatureUniversal {
      public static override readonly define: string[] = ["MATCAP"];
    }

    /**
     * Provides the basic functionality for skinning materials.
     */
    export abstract class ShaderFeatureSkin extends ShaderFeature {
      public static override readonly define: string[] = ["SKIN"];
    }

    /**
     * Adds color texture support to the material.
     */
    export abstract class ShaderFeatureTextureColor extends ShaderFeature {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyTextureColor];
      public static override readonly define: string[] = ["TEXTURE"];
    }

    /**
     * Adds normal texture support to the material.
     */
    export abstract class ShaderFeatureTextureNormal extends ShaderFeature {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyTextureNormal];
      public static override readonly define: string[] = ["NORMALMAP"];
    }

    /**
     * Provides a toon texture to the material.
     */
    export abstract class ShaderFeatureTextureToon extends ShaderFeature {
      public static override readonly properties: (new () => MaterialProperty)[] = [MaterialPropertyTextureToon];
      public static override readonly define: string[] = ["TOON"];
    }
  }
}