namespace FudgeCore {
  /**
   * Injects a {@link Shader} with the necessary functionality to render it in WebGL.
   */
  export class RenderWebGLShader {
    /** Replaces the decorated method with the injectors’s implementation of the same name. */
    public static decorate<M extends (...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<General, M>): M {
      return Reflect.get(this, _context.name);
    }

    protected static createProgram(this: Experimental.Shader): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const program: WebGLProgram = RenderWebGL.assert<WebGLProgram>(crc3.createProgram());

      try {
        const shdVertex: WebGLShader = RenderWebGLShader.compileShader(crc3, this.getVertexShaderSource(), WebGL2RenderingContext.VERTEX_SHADER);
        const shdFragment: WebGLShader = RenderWebGLShader.compileShader(crc3, this.getFragmentShaderSource(), WebGL2RenderingContext.FRAGMENT_SHADER);

        crc3.attachShader(program, RenderWebGL.assert<WebGLShader>(shdVertex));
        crc3.attachShader(program, RenderWebGL.assert<WebGLShader>(shdFragment));
        crc3.linkProgram(program);

        const error: string = RenderWebGL.assert<string>(crc3.getProgramInfoLog(program));
        if (error !== "")
          throw new Error("Error linking Shader: " + error);

        this.program = program;
        this.uniforms = RenderWebGLShader.detectUniforms(crc3, program);

        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.LIGHTS.NAME, UNIFORM_BLOCK.LIGHTS.BINDING);
        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.CAMERA.NAME, UNIFORM_BLOCK.CAMERA.BINDING);
        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.MATERIAL.NAME, UNIFORM_BLOCK.MATERIAL.BINDING);
        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.NODE.NAME, UNIFORM_BLOCK.NODE.BINDING);
        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.SKIN.NAME, UNIFORM_BLOCK.SKIN.BINDING);
        RenderWebGLShader.bindUniformBlock(crc3, program, UNIFORM_BLOCK.FOG.NAME, UNIFORM_BLOCK.FOG.BINDING);

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
    }


    protected static useProgram(this: Experimental.Shader): void {
      const program: WebGLProgram = this.program;
      if (!program)
        this.createProgram();

      RenderWebGL.getRenderingContext().useProgram(program);
    }


    protected static deleteProgram(this: Experimental.Shader): void {
      const program: WebGLProgram = this.program;
      RenderWebGL.getRenderingContext().deleteProgram(program);
      delete this.uniforms;
      delete this.program;
    }

    private static detectUniforms(_crc3: WebGL2RenderingContext, _program: WebGLProgram): { [name: string]: WebGLUniformLocation } {
      const detectedUniforms: { [name: string]: WebGLUniformLocation } = {};
      const uniformCount: number = _crc3.getProgramParameter(_program, WebGL2RenderingContext.ACTIVE_UNIFORMS);
      for (let i: number = 0; i < uniformCount; i++) {
        const info: WebGLActiveInfo = RenderWebGL.assert<WebGLActiveInfo>(_crc3.getActiveUniform(_program, i));
        if (!info)
          break;

        const location: WebGLUniformLocation = _crc3.getUniformLocation(_program, info.name);
        if (location)
          detectedUniforms[info.name] = RenderWebGL.assert<WebGLUniformLocation>(location);
      }
      return detectedUniforms;
    }

    private static compileShader(_crc3: WebGL2RenderingContext, _shaderCode: string, _shaderType: GLenum): WebGLShader | null {
      const webGLShader: WebGLShader = _crc3.createShader(_shaderType);
      _crc3.shaderSource(webGLShader, _shaderCode);
      _crc3.compileShader(webGLShader);
      let error: string = RenderWebGL.assert<string>(_crc3.getShaderInfoLog(webGLShader));
      if (error !== "") {
        Debug.log(_shaderCode);
        throw new Error("Error compiling shader: " + error);
      }

      // Check for any compilation errors.
      if (!_crc3.getShaderParameter(webGLShader, WebGL2RenderingContext.COMPILE_STATUS)) {
        alert(_crc3.getShaderInfoLog(webGLShader));
        return null;
      }

      return webGLShader;
    }

    private static bindUniformBlock(_crc3: WebGL2RenderingContext, _program: WebGLProgram, _uniformBlockName: string, _uniformBlockBinding: GLuint): void {
      const blockIndex: number = _crc3.getUniformBlockIndex(_program, _uniformBlockName);
      if (blockIndex == WebGL2RenderingContext.INVALID_INDEX)
        return;

      const referencedByVertexShader: boolean = _crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER);
      const referencedByFragmentShader: boolean = _crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER);
      if (!referencedByVertexShader && !referencedByFragmentShader)
        return;

      _crc3.uniformBlockBinding(_program, blockIndex, _uniformBlockBinding);
    }
  }
}