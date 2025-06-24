namespace FudgeCore {

  /**
   * Handles the {@link ComponentOutline outline} post-processing effect.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderWebGLComponentOutline {
    public static ssaoSupport: boolean; // TODO:

    public static fboDepthPass: WebGLFramebuffer;
    public static texDepthStencil: WebGLTexture;

    public static fboOut: WebGLFramebuffer;
    public static texOut: WebGLTexture;

    static #dataColor: Float32Array;
    static #dataColorOccluded: Float32Array;

    /** 
     * Initialize framebuffers and render attachments.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLComponentOutline.#dataColor = new Float32Array(4);
      RenderWebGLComponentOutline.#dataColorOccluded = new Float32Array(4);

      RenderWebGLComponentOutline.texDepthStencil = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGLComponentOutline.fboDepthPass = _renderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboDepthPass);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texDepthStencil, 0);

      RenderWebGLComponentOutline.texOut = _renderWebGL.texColor;
      RenderWebGLComponentOutline.fboOut = _renderWebGL.assert<WebGLFramebuffer>(crc3.createFramebuffer());
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboOut);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texOut, 0);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /**
     * Draw the outline effect.
     */
    public static draw(_nodes: Iterable<Node>, _cmpCamera: ComponentCamera, _cmpOutline: ComponentOutline): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboDepthPass);

      RenderWebGL.clear();

      crc3.disable(WebGL2RenderingContext.BLEND);
      for (let selected of _nodes)
        for (const node of selected) {
          if (node.getComponent(ComponentMesh)?.isActive && node.getComponent(ComponentMaterial)?.isActive)
            RenderWebGL.drawNode(node, _cmpCamera);
        }
      crc3.enable(WebGL2RenderingContext.BLEND);

      ShaderOutline.useProgram();
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboOut);

      RenderWebGL.bindTexture(ShaderOutline, RenderWebGLComponentOutline.texDepthStencil, WebGL2RenderingContext.TEXTURE0, "u_texDepthOutline");
      RenderWebGL.bindTexture(ShaderOutline, RenderWebGL.texDepthStencil, WebGL2RenderingContext.TEXTURE1, "u_texDepthScene");

      crc3.uniform4fv(ShaderOutline.uniforms["u_vctColor"], _cmpOutline.color.toArray(RenderWebGLComponentOutline.#dataColor));
      crc3.uniform4fv(ShaderOutline.uniforms["u_vctColorOccluded"], _cmpOutline.colorOccluded.toArray(RenderWebGLComponentOutline.#dataColorOccluded));

      const rectCanvas: Rectangle = RenderWebGL.getCanvasRectangle();
      crc3.uniform2f(ShaderOutline.uniforms["u_vctTexel"], 1 / Math.round(rectCanvas.width), 1 / Math.round(rectCanvas.height)); // half texel size

      crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
    }

    /** 
     * Resize the render attachments.
     */
    public static resize(_renderWebGL: typeof RenderWebGL, _width: number, _height: number): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      const canvasWidth: number = _width || 1;
      const canvasHeight: number = _height || 1;

      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texDepthStencil);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);
    }
  }
}
