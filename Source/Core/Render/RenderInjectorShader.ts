namespace FudgeCore {

  /**
   * Gives WebGL Buffer the data from the {@link Shader}
   * @internal
   */
  export class RenderInjectorShader {
    /**
     * Injects the functionality of this class into the constructor of the given {@link Shader}-subclass
     */
    public static decorate(_constructor: typeof Shader, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor, _constructor.useProgram.name, {
        value: RenderInjectorShader.useProgram
      });
      Object.defineProperty(_constructor, _constructor.createProgram.name, {
        value: RenderInjectorShader.createProgram
      });
      Object.defineProperty(_constructor, _constructor.deleteProgram.name, {
        value: RenderInjectorShader.deleteProgram
      });
    }

    /**
     * Set this program to use as the active program in WebGL
     */
    public static useProgram(this: typeof Shader): void {
      if (!this.program)
        this.createProgram();

      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.useProgram(this.program);
    }

    /**
     * Deletes this program from WebGL, clearing the used memory on the GPU.
     */
    public static deleteProgram(this: typeof Shader): void {
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      if (this.program) {
        crc3.deleteProgram(this.program);
        delete this.uniforms;
        delete this.program;
      }
    }

    protected static createProgram(this: typeof Shader): void {
      Debug.fudge("Create shader program", this.name);
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      let program: WebGLProgram = crc3.createProgram();

      try {
        let shdVertex: WebGLShader = compileShader(this.getVertexShaderSource(), WebGL2RenderingContext.VERTEX_SHADER);
        let shdFragment: WebGLShader = compileShader(this.getFragmentShaderSource(), WebGL2RenderingContext.FRAGMENT_SHADER);

        crc3.attachShader(program, RenderWebGL.assert<WebGLShader>(shdVertex));
        crc3.attachShader(program, RenderWebGL.assert<WebGLShader>(shdFragment));
        crc3.linkProgram(program);

        let error: string = RenderWebGL.assert<string>(crc3.getProgramInfoLog(program));
        if (error !== "") {
          throw new Error("Error linking Shader: " + error);
        }

        this.program = program;
        this.uniforms = detectUniforms();

        bindUniformBlock(program, UNIFORM_BLOCK.LIGHTS.NAME, UNIFORM_BLOCK.LIGHTS.BINDING);
        bindUniformBlock(program, UNIFORM_BLOCK.CAMERA.NAME, UNIFORM_BLOCK.CAMERA.BINDING);
        bindUniformBlock(program, UNIFORM_BLOCK.MATERIAL.NAME, UNIFORM_BLOCK.MATERIAL.BINDING);
        bindUniformBlock(program, UNIFORM_BLOCK.NODE.NAME, UNIFORM_BLOCK.NODE.BINDING);
        bindUniformBlock(program, UNIFORM_BLOCK.SKIN.NAME, UNIFORM_BLOCK.SKIN.BINDING);
        bindUniformBlock(program, UNIFORM_BLOCK.FOG.NAME, UNIFORM_BLOCK.FOG.BINDING);

        crc3.useProgram(this.program);
        let uniform: WebGLUniformLocation = this.uniforms[TEXTURE_LOCATION.COLOR.UNIFORM];
        if (uniform)
          crc3.uniform1i(uniform, TEXTURE_LOCATION.COLOR.INDEX);

        uniform = this.uniforms[TEXTURE_LOCATION.NORMAL.UNIFORM];
        if (uniform)
          crc3.uniform1i(uniform, TEXTURE_LOCATION.NORMAL.INDEX);

        uniform = this.uniforms[TEXTURE_LOCATION.TOON.UNIFORM];
        if (uniform)
          crc3.uniform1i(uniform, TEXTURE_LOCATION.TOON.INDEX);

        uniform = this.uniforms[TEXTURE_LOCATION.PARTICLE.UNIFORM];
        if (uniform)
          crc3.uniform1i(uniform, TEXTURE_LOCATION.PARTICLE.INDEX);
      } catch (_error) {
        Debug.error(_error);
        debugger;
      }

      function compileShader(_shaderCode: string, _shaderType: GLenum): WebGLShader | null {
        let webGLShader: WebGLShader = crc3.createShader(_shaderType);
        crc3.shaderSource(webGLShader, _shaderCode);
        crc3.compileShader(webGLShader);
        let error: string = RenderWebGL.assert<string>(crc3.getShaderInfoLog(webGLShader));
        if (error !== "") {
          Debug.log(_shaderCode);

          throw new Error("Error compiling shader: " + error);
        }
        // Check for any compilation errors.
        if (!crc3.getShaderParameter(webGLShader, WebGL2RenderingContext.COMPILE_STATUS)) {
          alert(crc3.getShaderInfoLog(webGLShader));
          return null;
        }
        return webGLShader;
      }

      function detectUniforms(): { [name: string]: WebGLUniformLocation } {
        let detectedUniforms: { [name: string]: WebGLUniformLocation } = {};
        let uniformCount: number = crc3.getProgramParameter(program, WebGL2RenderingContext.ACTIVE_UNIFORMS);
        for (let i: number = 0; i < uniformCount; i++) {
          let info: WebGLActiveInfo = RenderWebGL.assert<WebGLActiveInfo>(crc3.getActiveUniform(program, i));
          if (!info) {
            break;
          }
          let location: WebGLUniformLocation = crc3.getUniformLocation(program, info.name);
          if (location)
            detectedUniforms[info.name] = RenderWebGL.assert<WebGLUniformLocation>(location);
        }
        return detectedUniforms;
      }

      function bindUniformBlock(_program: WebGLProgram, _uniformBlockName: string, _uniformBlockBinding: GLuint): void {
        let blockIndex: number = crc3.getUniformBlockIndex(_program, _uniformBlockName);
        if (blockIndex == WebGL2RenderingContext.INVALID_INDEX)
          return;

        let referencedByVertexShader: boolean = crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER);
        let referencedByFragmentShader: boolean = crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER);
        if (!referencedByVertexShader && !referencedByFragmentShader)
          return;

        crc3.uniformBlockBinding(_program, blockIndex, _uniformBlockBinding);
      }
    }
  }
}