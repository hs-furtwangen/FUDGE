namespace FudgeCore {

  /**
   * Handles picking.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderWebGLPicking {
    private static fboPick: WebGLBuffer;
    private static texPick: WebGLTexture;
    private static texDepthPick: WebGLTexture;

    /** 
     * Initialize framebuffers and render attachments.
     */
    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLPicking.fboPick = _renderWebGL.assert(crc3.createFramebuffer());
      RenderWebGLPicking.texPick = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
      RenderWebGLPicking.texDepthPick = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick, 0);
      crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepthPick, 0);

      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
    }

    /**
     * Used with a {@link Picker}-camera, this method renders one pixel with picking information 
     * for each pickable object in the line of sight and returns that as an unsorted array of {@link Pick}s.
     * The function to render the objects into the pick buffer must be provided by the caller.
     * @param _pick The function which renders objects into the pick buffer. Returns a {@link Pick} for each rendered object. 
     * **MUST** use {@link ShaderPick} or {@link ShaderPickTextured} to render objects.
     */
    public static pickFrom<T>(_from: readonly T[], _cmpCamera: ComponentCamera, _pick: (_from: readonly T[], _cmpCamera: ComponentCamera) => Pick[]): Pick[] { // TODO: see if third parameter _world?: Matrix4x4 would be usefull
      const size: number = Math.ceil(Math.sqrt(_from.length));
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      // adjust pick buffer size
      crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32I, size, size, 0, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, null); // could use RBGA32F in the future e.g. WebGPU
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepthPick);
      crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH_COMPONENT24, size, size, 0, WebGL2RenderingContext.DEPTH_COMPONENT, WebGL2RenderingContext.UNSIGNED_INT, null);
      crc3.clear(WebGL2RenderingContext.DEPTH_BUFFER_BIT);

      RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);

      // buffer size into pick shaders
      ShaderPick.useProgram();
      crc3.uniform2fv(ShaderPick.uniforms["u_vctSize"], [size, size]);

      ShaderPickTextured.useProgram();
      crc3.uniform2fv(ShaderPickTextured.uniforms["u_vctSize"], [size, size]);

      // render picks into pick buffer
      RenderWebGL.setBlendMode(BLEND.OPAQUE);
      let picks: Pick[] = _pick(_from, _cmpCamera);
      RenderWebGL.setBlendMode(BLEND.TRANSPARENT);

      // get/filter picks
      // evaluate texture by reading pixels and extract, convert and store the information about each mesh hit
      let data: Int32Array = new Int32Array(size * size * 4);
      crc3.readPixels(0, 0, size, size, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, data);

      let picked: Pick[] = [];
      let mtxViewToWorld: Matrix4x4 = Matrix4x4.INVERSE(_cmpCamera.mtxWorldToView);
      for (let i: number = 0; i < picks.length; i++) {
        let zBuffer: number = data[4 * i + 0] + data[4 * i + 1] / 256;
        if (zBuffer == 0) // discard misses 
          continue;
        let pick: Pick = picks[i];
        pick.zBuffer = RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 0) * 2 - 1;
        pick.color = RenderWebGLPicking.convertInt32toColor(data, 4 * i + 1);
        pick.textureUV = Recycler.reuse(Vector2);
        pick.textureUV.set(RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 2), RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 3));
        pick.mtxViewToWorld = mtxViewToWorld;

        picked.push(pick);
      }

      RenderWebGL.resetFramebuffer();

      return picked;
    }

    private static convertInt32toFloat32(_int32Array: Int32Array, _index: number): number {
      let buffer: ArrayBuffer = new ArrayBuffer(4);
      let view: DataView = new DataView(buffer);
      view.setInt32(0, _int32Array[_index]);
      return view.getFloat32(0);
    }

    private static convertInt32toColor(_int32Array: Int32Array, _index: number): Color {
      let buffer: ArrayBuffer = new ArrayBuffer(4);
      let view: DataView = new DataView(buffer);
      view.setInt32(0, _int32Array[_index]);
      let color: Color = Color.CSS(`rgb(${view.getUint8(0)}, ${view.getUint8(1)}, ${view.getUint8(2)})`, view.getUint8(3) / 255);
      return color;
    }

    // /** 
    //  * Resize the render attachments.
    //  */
    // public static resize(_renderWebGL: typeof RenderWebGL, _width: number, _height: number): void {
    //   const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
    //   const canvasWidth: number = _width || 1;
    //   const canvasHeight: number = _height || 1;

    //   crc3.activeTexture(crc3.TEXTURE0);

    //   crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texOut);
    //   crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);

    //   const nValues: number = canvasWidth * canvasHeight * 4;
    //   const noiseData: Uint8Array = new Uint8Array(nValues);

    //   for (let i: number = 0; i < nValues; i += 4) {
    //     noiseData[i] = Math.floor(Math.random() * 256);
    //     noiseData[i + 1] = Math.floor(Math.random() * 256);
    //     noiseData[i + 2] = Math.floor(Math.random() * 256);
    //     noiseData[i + 3] = Math.floor(Math.random() * 256);
    //   }

    //   crc3.bindTexture(crc3.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texNoise);
    //   crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, canvasWidth, canvasHeight, 0, crc3.RGBA, crc3.UNSIGNED_BYTE, noiseData);
    //   crc3.bindTexture(crc3.TEXTURE_2D, null);
    // }
  }
}
