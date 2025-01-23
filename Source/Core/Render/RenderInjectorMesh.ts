namespace FudgeCore {

  /**
   * Buffers the data from the {@link Mesh} into a WebGL Buffer
   * @internal
   */
  export class RenderInjectorMesh {

    /**
     * Injects the functionality of this class into the constructor of the given {@link Mesh}-subclass
     */
    public static decorate(_constructor: Function, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor.prototype, "useRenderBuffers", {
        value: RenderInjectorMesh.useRenderBuffers
      });
      Object.defineProperty(_constructor.prototype, "getRenderBuffers", {
        value: RenderInjectorMesh.getRenderBuffers
      });
      Object.defineProperty(_constructor.prototype, "deleteRenderBuffers", {
        value: RenderInjectorMesh.deleteRenderBuffers
      });
    }

    protected static getRenderBuffers(this: Mesh): RenderBuffers {
      if (this.renderMesh.buffers == null) {
        this.renderMesh.buffers = {
          vertices: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.vertices),
          indices: createBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.renderMesh.indices),
          normals: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.normals),
          textureUVs: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.textureUVs),
          colors: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.colors),
          tangents: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.tangents),
          nIndices: this.renderMesh.indices.length
        };

        if (this.renderMesh.bones)
          this.renderMesh.buffers.bones = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.bones);

        if (this.renderMesh.weights)
          this.renderMesh.buffers.weights = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.weights);
      }
      // if (!this.renderMesh.vertexBuffer) {
      //   // create a single buffer for all vertex data interleaved
      //   this.renderMesh.indicesBuffer = createBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.renderMesh.indices);
      //   this.renderMesh.nIndices = this.renderMesh.indices.length;

      //   const stride: number = 3 + 3 + 2 + 4 + 4; // position, normal, uv, color, tangent
      //   const vertexCount: number = this.renderMesh.vertices.length / 3;
      //   const vertexData: Float32Array = new Float32Array(vertexCount * stride);

      //   for (let i: number = 0; i < vertexCount; i++) {
      //     let offset: number = i * stride;
      //     // position
      //     vertexData[offset + 0] = this.renderMesh.vertices[i * 3 + 0];
      //     vertexData[offset + 1] = this.renderMesh.vertices[i * 3 + 1];
      //     vertexData[offset + 2] = this.renderMesh.vertices[i * 3 + 2];
      //     // normal
      //     vertexData[offset + 3] = this.renderMesh.normals[i * 3 + 0];
      //     vertexData[offset + 4] = this.renderMesh.normals[i * 3 + 1];
      //     vertexData[offset + 5] = this.renderMesh.normals[i * 3 + 2];
      //     // uv
      //     vertexData[offset + 6] = this.renderMesh.textureUVs[i * 2 + 0];
      //     vertexData[offset + 7] = this.renderMesh.textureUVs[i * 2 + 1];
      //     // color
      //     vertexData[offset + 8] = this.renderMesh.colors[i * 4 + 0];
      //     vertexData[offset + 9] = this.renderMesh.colors[i * 4 + 1];
      //     vertexData[offset + 10] = this.renderMesh.colors[i * 4 + 2];
      //     vertexData[offset + 11] = this.renderMesh.colors[i * 4 + 3];
      //     // tangent
      //     vertexData[offset + 12] = this.renderMesh.tangents[i * 4 + 0];
      //     vertexData[offset + 13] = this.renderMesh.tangents[i * 4 + 1];
      //     vertexData[offset + 14] = this.renderMesh.tangents[i * 4 + 2];
      //     vertexData[offset + 15] = this.renderMesh.tangents[i * 4 + 3];
      //   }

      //   this.renderMesh.vertexBuffer = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, vertexData);
      //   this.renderMesh.stride = stride * Float32Array.BYTES_PER_ELEMENT;
      // }

      return this.renderMesh.buffers;
    }

    protected static useRenderBuffers(this: Mesh, _shader: typeof Shader, _mtxMeshToWorld: Matrix4x4, _id?: number): number {
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      let renderBuffers: RenderBuffers = this.getRenderBuffers();

      let uniform: WebGLUniformLocation;

      uniform = _shader.uniforms["u_mtxMeshToWorld"];
      if (uniform)
        crc3.uniformMatrix4fv(uniform, false, _mtxMeshToWorld.get());

      // feed in an id of the node if shader accepts u_id. Used for picking
      uniform = _shader.uniforms["u_id"];
      if (uniform)
        crc3.uniform1i(uniform, _id);

      setAttributeBuffer("a_vctPosition", renderBuffers.vertices, 3);
      setAttributeBuffer("a_vctColor", renderBuffers.colors, 4);
      setAttributeBuffer("a_vctTexture", renderBuffers.textureUVs, 2);
      setAttributeBuffer("a_vctNormal", renderBuffers.normals, 3);
      setAttributeBuffer("a_vctTangent", renderBuffers.tangents, 4);
      // crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.vertexBuffer);
      // for (const name in _shader.attributes) {
      //   const attribute: number = _shader.attributes[name];
      //   if (attribute == undefined)
      //     continue;
      //   crc3.enableVertexAttribArray(attribute);
      //   crc3.vertexAttribPointer(attribute, _size, WebGL2RenderingContext.FLOAT, false, 0, 0);
      // } 


      const aBone: number = _shader.attributes["a_vctBones"];
      if (aBone) {
        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, renderBuffers.bones);
        crc3.enableVertexAttribArray(aBone);
        crc3.vertexAttribIPointer(aBone, 4, WebGL2RenderingContext.UNSIGNED_BYTE, 0, 0);
      }
      setAttributeBuffer("a_vctWeights", renderBuffers.weights, 4);

      crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, renderBuffers.indices);

      return renderBuffers.nIndices;

      function setAttributeBuffer(_name: string, _buffer: WebGLBuffer, _size: number): void {
        let attribute: number = _shader.attributes[_name];
        if (attribute == undefined)
          return;
        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, _buffer);
        crc3.enableVertexAttribArray(attribute);
        crc3.vertexAttribPointer(attribute, _size, WebGL2RenderingContext.FLOAT, false, 0, 0);
      }
    }

    protected static deleteRenderBuffers(_renderBuffers: RenderBuffers): void {
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      if (_renderBuffers) {
        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
        crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
        Object.values(_renderBuffers).filter(_buffer => _buffer instanceof WebGLBuffer).forEach((_buffer, _index) => {
          crc3.deleteBuffer(_buffer);
          crc3.disableVertexAttribArray(_index);
        });
      }
    }
  }

  function createBuffer(_type: GLenum, _array: Float32Array | Uint16Array | Uint8Array): WebGLBuffer {
    const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
    let buffer: WebGLBuffer = RenderWebGL.assert<WebGLBuffer>(crc3.createBuffer());
    crc3.bindBuffer(_type, buffer);
    crc3.bufferData(_type, _array, WebGL2RenderingContext.STATIC_DRAW);
    return buffer;
  }
}