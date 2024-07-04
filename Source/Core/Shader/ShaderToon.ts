namespace FudgeCore {
  export abstract class ShaderToon extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderToon);

    public static define: string[] = [
      "PHONG",
      "TOON"
    ];

    public static getCoat(): typeof Coat { return CoatToon; }
  }

  export abstract class ShaderToonSkin extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderToonSkin);

    public static define: string[] = [
      "PHONG",
      "TOON",
      "SKIN"
    ];

    public static getCoat(): typeof Coat { return CoatToon; }
  }

  export abstract class ShaderToonTextured extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderToonTextured);

    public static define: string[] = [
      "PHONG",
      "TOON",
      "TEXTURE"
    ];

    public static getCoat(): typeof Coat { return CoatToonTextured; }
  }

  export abstract class ShaderToonTexturedSkin extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderToonTexturedSkin);

    public static define: string[] = [
      "PHONG",
      "TOON",
      "TEXTURE",
      "SKIN"
    ];

    public static getCoat(): typeof Coat { return CoatToonTextured; }
  }
}