namespace FudgeCore {

  /**
   * Handles the {@link ComponentBloom bloom} post-processing effect.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderWebGLComponentBloom {
    public static ssaoSupport: boolean; // TODO:

    public static fboOut: WebGLFramebuffer;
    public static texOut: WebGLTexture;

    public static fbos: WebGLFramebuffer[]; // stores downsampled FBOs for each bloom level

    private static textures: WebGLTexture[]; // stores down and upsampled versions of the color texture, used for bloom
    private static textureWidths: number[]; // widths of the bloom textures
    private static textureHeights: number[]; // heights of the bloom textures

    /** 
     * Initialize framebuffers and render attachments.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLComponentBloom.textures = new Array(6);
      RenderWebGLComponentBloom.fbos = new Array(6);
      RenderWebGLComponentBloom.textureWidths = new Array(6);
      RenderWebGLComponentBloom.textureHeights = new Array(6);

      for (let i: number = 0; i < RenderWebGLComponentBloom.textures.length; i++) {
        RenderWebGLComponentBloom.textures[i] = _renderWebGL.createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);
        RenderWebGLComponentBloom.fbos[i] = _renderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
        crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i]);
        crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentBloom.textures[i], 0);
      }

      RenderWebGLComponentBloom.fboOut = _renderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fboOut);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, _renderWebGL.texColor, 0);
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /**
     * Draw the bloom effect.
     */
    public static draw(_cmpBloom: ComponentBloom): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      ShaderBloom.useProgram();

      // extract bright colors, could move this to main render pass so that individual objects can be exempt from bloom
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[0]);
      // crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentBloom.textures[0], 0);
      RenderWebGL.clear();

      const rectViewport: Rectangle = RenderWebGL.getViewportRectangle();
      const renderWidth: number = rectViewport.width;
      const renderHeight: number = rectViewport.height;
      const renderX: number = rectViewport.x;
      const renderY: number = rectViewport.y;

      RenderWebGL.bindTexture(ShaderBloom, RenderWebGL.texColor, WebGL2RenderingContext.TEXTURE0, "u_texSource");
      crc3.uniform1f(ShaderBloom.uniforms["u_fThreshold"], _cmpBloom.threshold);
      crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 0);
      crc3.uniform2f(ShaderBloom.uniforms["u_vctFramebufferSize"], crc3.drawingBufferWidth, crc3.drawingBufferHeight);
      crc3.uniform4f(ShaderBloom.uniforms["u_vctViewport"], renderX, renderY, renderWidth, renderHeight);

      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);

      // downsample
      const iterations: number = RenderWebGLComponentBloom.textures.length;
      for (let i: number = 1, divisor: number = 2; i < iterations; i++, divisor *= 2) {
        const viewportX: number = Math.floor(renderX / divisor);
        const viewportY: number = Math.floor(renderY / divisor);
        const viewportWidth: number = Math.max(Math.floor(renderWidth / divisor), 1);
        const viewportHeight: number = Math.max(Math.floor(renderHeight / divisor), 1);

        const textureWidth: number = RenderWebGLComponentBloom.textureWidths[i];
        const textureHeight: number = RenderWebGLComponentBloom.textureHeights[i];

        crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i]);
        crc3.viewport(viewportX, viewportY, viewportWidth, viewportHeight);

        RenderWebGL.clear();

        RenderWebGL.bindTexture(ShaderBloom, RenderWebGLComponentBloom.textures[i - 1], WebGL2RenderingContext.TEXTURE0, "u_texSource");
        crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 1);
        crc3.uniform2f(ShaderBloom.uniforms["u_vctHalfTexel"], 0.5 / textureWidth, 0.5 / textureHeight); // half texel size
        crc3.uniform2f(ShaderBloom.uniforms["u_vctFramebufferSize"], textureWidth, textureHeight);
        crc3.uniform4f(ShaderBloom.uniforms["u_vctViewport"], viewportX, viewportY, viewportWidth, viewportHeight);

        crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      }

      RenderWebGL.setBlendMode(BLEND.ADDITIVE);

      // upsample
      for (let i: number = iterations - 1, divisor: number = 2 ** (iterations - 2); i > 0; i--, divisor /= 2) {
        const viewportX: number = Math.floor(renderX / divisor);
        const viewportY: number = Math.floor(renderY / divisor);
        const viewportWidth: number = Math.max(Math.floor(renderWidth / divisor), 1);
        const viewportHeight: number = Math.max(Math.floor(renderHeight / divisor), 1);

        const textureWidth: number = RenderWebGLComponentBloom.textureWidths[i - 1];
        const textureHeight: number = RenderWebGLComponentBloom.textureHeights[i - 1];

        crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i - 1]);
        crc3.viewport(viewportX, viewportY, viewportWidth, viewportHeight);

        RenderWebGL.bindTexture(ShaderBloom, RenderWebGLComponentBloom.textures[i], WebGL2RenderingContext.TEXTURE0, "u_texSource");
        crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 2);
        crc3.uniform2f(ShaderBloom.uniforms["u_vctHalfTexel"], 0.5 / textureWidth, 0.5 / textureHeight); // half texel size
        crc3.uniform2f(ShaderBloom.uniforms["u_vctFramebufferSize"], textureWidth, textureHeight);
        crc3.uniform4f(ShaderBloom.uniforms["u_vctViewport"], viewportX, viewportY, viewportWidth, viewportHeight);
        crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
      }

      crc3.viewport(renderX, renderY, renderWidth, renderHeight);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fboOut);
      RenderWebGL.bindTexture(ShaderBloom, RenderWebGLComponentBloom.textures[0], WebGL2RenderingContext.TEXTURE0, "u_texSource");
      crc3.uniform1i(ShaderBloom.uniforms["u_iMode"], 3);
      crc3.uniform1f(ShaderBloom.uniforms["u_fIntensity"], _cmpBloom.intensity);
      crc3.uniform1f(ShaderBloom.uniforms["u_fHighlightDesaturation"], _cmpBloom.highlightDesaturation);
      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);

      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
    }

    /** 
     * Resize the render attachments.
     */
    public static resize(_renderWebGL: typeof RenderWebGL, _width: number, _height: number): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      const canvasWidth: number = _width || 1;
      const canvasHeight: number = _height || 1;

      for (let i: number = 0, divisor: number = 1; i < RenderWebGLComponentBloom.textures.length; i++, divisor *= 2) {
        const textureWidth: number = Math.max(Math.floor(canvasWidth / divisor), 1);
        const textureHeight: number = Math.max(Math.floor(canvasHeight / divisor), 1);
        crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentBloom.textures[i]);
        crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, textureWidth, textureHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);
        RenderWebGLComponentBloom.textureWidths[i] = textureWidth;
        RenderWebGLComponentBloom.textureHeights[i] = textureHeight;
      }

      crc3.bindTexture(crc3.TEXTURE_2D, null);
    }
  }
}
