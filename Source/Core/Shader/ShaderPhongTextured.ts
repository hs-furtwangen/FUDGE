namespace FudgeCore {
  export abstract class ShaderPhongTextured extends Shader {
    public static readonly iSubclass: number = Shader.registerSubclass(ShaderPhongTextured);

    public static define: string[] = [
      "PHONG",
      "TEXTURE",
      "SHADOW"
    ];

    public static getCoat(): typeof Coat { return CoatRemissiveTextured; }
  }
}