namespace FudgeCore {
  export abstract class ShaderOutline extends Shader {
    public static define: string[] = [];

    public static getVertexShaderSource(): string {
      return this.insertDefines(shaderSources["ShaderScreen.vert"], this.define);
    }

    public static getFragmentShaderSource(): string {
      return this.insertDefines(shaderSources["ShaderOutline.frag"], this.define);
    }
  }
}