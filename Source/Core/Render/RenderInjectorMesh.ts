namespace FudgeCore {

  /**
   * Buffers the data from the {@link Mesh} into a WebGL Buffer
   * @internal
   */
  export class RenderInjectorMesh {

    /**
     * Injects the functionality of this class into the constructor of the given {@link Mesh}-subclass
     */
    public static decorate(_constructor: typeof Mesh, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderBuffers.name, {
        value: RenderInjectorMesh.useRenderBuffers
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.getRenderBuffers.name, {
        value: RenderInjectorMesh.getRenderBuffers
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderBuffers.name, {
        value: RenderInjectorMesh.deleteRenderBuffers
      });
    }

    protected static getRenderBuffers(this: Mesh): RenderBuffers {
      if (this.renderMesh.buffers)
        return this.renderMesh.buffers;

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const buffers: RenderBuffers = {
        indices: createBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.renderMesh.indices),
        positions: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.positions),
        normals: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.normals),
        textureUVs: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.textureUVs),
        colors: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.colors),
        tangents: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.tangents),
        nIndices: this.renderMesh.indices.length
      };

      if (this.renderMesh.bones)
        buffers.bones = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.bones);

      if (this.renderMesh.weights)
        buffers.weights = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.weights);

      // set up vertex array object
      buffers.vao = RenderWebGL.assert<WebGLVertexArrayObject>(crc3.createVertexArray());
      crc3.bindVertexArray(buffers.vao);
      crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, buffers.indices);

      setAttributeBuffer(buffers.positions, SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT);
      setAttributeBuffer(buffers.normals, SHADER_ATTRIBUTE.NORMAL, 3, WebGL2RenderingContext.FLOAT);
      setAttributeBuffer(buffers.textureUVs, SHADER_ATTRIBUTE.TEXCOORDS, 2, WebGL2RenderingContext.FLOAT);
      setAttributeBuffer(buffers.colors, SHADER_ATTRIBUTE.COLOR, 4, WebGL2RenderingContext.FLOAT);
      setAttributeBuffer(buffers.tangents, SHADER_ATTRIBUTE.TANGENT, 4, WebGL2RenderingContext.FLOAT);
      if (buffers.bones)
        setAttributeBuffer(buffers.bones, SHADER_ATTRIBUTE.BONES, 4, WebGL2RenderingContext.UNSIGNED_BYTE);
      if (buffers.weights)
        setAttributeBuffer(buffers.weights, SHADER_ATTRIBUTE.WEIGHTS, 4, WebGL2RenderingContext.FLOAT);

      crc3.bindVertexArray(null);
      crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
      crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);

      return this.renderMesh.buffers = buffers;

      function createBuffer(_type: GLenum, _array: Float32Array | Uint16Array | Uint8Array): WebGLBuffer {
        let buffer: WebGLBuffer = RenderWebGL.assert<WebGLBuffer>(crc3.createBuffer());
        crc3.bindBuffer(_type, buffer);
        crc3.bufferData(_type, _array, WebGL2RenderingContext.STATIC_DRAW);
        crc3.bindBuffer(_type, null);
        return buffer;
      }

      function setAttributeBuffer(_buffer: WebGLBuffer, _location: number, _size: number, _type: GLenum): void {
        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, _buffer);
        crc3.enableVertexAttribArray(_location);
        if (_type == WebGL2RenderingContext.FLOAT)
          crc3.vertexAttribPointer(_location, _size, _type, false, 0, 0);
        if (_type == WebGL2RenderingContext.UNSIGNED_BYTE)
          crc3.vertexAttribIPointer(_location, _size, _type, 0, 0);
      }
    }

    // TODO: rename this!
    protected static useRenderBuffers(this: Mesh, _shader: typeof Shader, _mtxMeshToWorld: Matrix4x4, _id?: number): RenderBuffers {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      // PerformanceMonitor.startMeasure("buffer u_mtxMeshToWorld");
      let uniform: WebGLUniformLocation; // TODO: move this somewhere else
      uniform = _shader.uniforms["u_mtxMeshToWorld"];
      if (uniform)
        crc3.uniformMatrix4fv(uniform, false, _mtxMeshToWorld.get());
      // PerformanceMonitor.endMeasure("buffer u_mtxMeshToWorld");

      // feed in an id of the node if shader accepts u_id. Used for picking // TODO: move this somewhere else
      uniform = _shader.uniforms["u_id"];
      if (uniform)
        crc3.uniform1i(uniform, _id);

      return this.getRenderBuffers();
    }

    protected static deleteRenderBuffers(_renderBuffers: RenderBuffers): void {
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      if (_renderBuffers) {
        crc3.deleteVertexArray(_renderBuffers.vao);
        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
        crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
        Object.values(_renderBuffers)
          .filter(_value => _value instanceof WebGLBuffer)
          .forEach(_buffer => crc3.deleteBuffer(_buffer));
      }
    }
  }


}