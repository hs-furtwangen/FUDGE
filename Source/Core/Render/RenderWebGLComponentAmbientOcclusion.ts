///<reference path="RenderWebGL.ts"/>

namespace FudgeCore {
  /**
   * Handles the ambient occlusion post-processing effect.
   */
  export class RenderWebGLComponentAmbientOcclusion {
    public static ssaoSupport: boolean; // TODO:

    public static fboOut: WebGLFramebuffer;
    public static texOut: WebGLTexture;
    public static texNoise: WebGLTexture; // stores random values for each pixel

    static #dataCamera: Float32Array = new Float32Array(3);

    /** Initialize SSAO resources: shaders, noise texture, FBO attachments */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLComponentAmbientOcclusion.texOut = _renderWebGL.texColor;
      RenderWebGLComponentAmbientOcclusion.texNoise = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      RenderWebGLComponentAmbientOcclusion.fboOut = _renderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentAmbientOcclusion.fboOut);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texOut, 0);
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /**
     * Execute the ambient occlusion pass.
     * @param _cmpCamera The camera component providing view parameters
     * @param _cmpAmbientOcclusion The ambient occlusion component with settings
     */
    public static draw(_cmpCamera: ComponentCamera, _cmpAmbientOcclusion: ComponentAmbientOcclusion): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      ShaderAmbientOcclusion.useProgram();

      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGL.texPosition, WebGL2RenderingContext.TEXTURE0, "u_texPosition");
      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGL.texNormal, WebGL2RenderingContext.TEXTURE1, "u_texNormal");
      RenderWebGL.bindTexture(ShaderAmbientOcclusion, RenderWebGLComponentAmbientOcclusion.texNoise, WebGL2RenderingContext.TEXTURE2, "u_texNoise");

      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fNear"], _cmpCamera.near);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fFar"], _cmpCamera.far);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fBias"], _cmpAmbientOcclusion.bias);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fSampleRadius"], _cmpAmbientOcclusion.sampleRadius);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationConstant"], _cmpAmbientOcclusion.attenuationConstant);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationLinear"], _cmpAmbientOcclusion.attenuationLinear);
      crc3.uniform1f(ShaderAmbientOcclusion.uniforms["u_fAttenuationQuadratic"], _cmpAmbientOcclusion.attenuationQuadratic);
      crc3.uniform2f(ShaderAmbientOcclusion.uniforms["u_vctResolution"], RenderWebGL.getCanvasRectangle().width, RenderWebGL.getCanvasRectangle().height);
      crc3.uniform3fv(ShaderAmbientOcclusion.uniforms["u_vctCamera"], _cmpCamera.mtxWorld.translation.toArray(RenderWebGLComponentAmbientOcclusion.#dataCamera));

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentAmbientOcclusion.fboOut);
      RenderWebGL.setBlendMode(BLEND.SUBTRACTIVE);
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
    }

    /** Adjust SSAO-related attachments on resize */
    public static resize(_renderWebGL: typeof RenderWebGL, _width: number, _height: number): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      const canvasWidth: number = _width || 1;
      const canvasHeight: number = _height || 1;

      crc3.activeTexture(crc3.TEXTURE0);

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texOut);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);

      const nValues: number = canvasWidth * canvasHeight * 4;
      const noiseData: Uint8Array = new Uint8Array(nValues);

      for (let i: number = 0; i < nValues; i += 4) {
        noiseData[i] = Math.floor(Math.random() * 256);
        noiseData[i + 1] = Math.floor(Math.random() * 256);
        noiseData[i + 2] = Math.floor(Math.random() * 256);
        noiseData[i + 3] = Math.floor(Math.random() * 256);
      }

      crc3.bindTexture(crc3.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texNoise);
      crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, canvasWidth, canvasHeight, 0, crc3.RGBA, crc3.UNSIGNED_BYTE, noiseData);
      crc3.bindTexture(crc3.TEXTURE_2D, null);
    }
  }
}
