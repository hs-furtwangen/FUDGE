namespace FudgeCore {
  export abstract class ShaderGouraudSkin extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderGouraudSkin);

    public static define: string[] = [
      "GOURAUD",
      "SKIN"
    ];

    public static getCoat(): typeof Coat { return CoatRemissive; }
  }
}