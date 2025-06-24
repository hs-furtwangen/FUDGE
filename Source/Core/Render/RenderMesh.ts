namespace FudgeCore {

  export interface RenderBuffers {
    vao?: WebGLVertexArrayObject;
    indices?: WebGLBuffer;
    positions?: WebGLBuffer;
    normals?: WebGLBuffer;
    textureUVs?: WebGLBuffer;
    colors?: WebGLBuffer;
    tangents?: WebGLBuffer;
    bones?: WebGLBuffer;
    weights?: WebGLBuffer;
    nIndices?: number;
  }

  /**
   * Inserted into a {@link Mesh}, an instance of this class calculates and represents the mesh data in the form needed by the render engine
   */
  export class RenderMesh {
    public buffers: RenderBuffers;
    public mesh: Mesh;

    // TODO: technically the CPU buffers could be released after the mesh has been buffered to the GPU to free memory? Currently three copys of the same data are stored: in the mesh as vertex objects, in the render mesh as cpu buffers and in the GPU as gpu buffers.
    /** indices to create faces from the vertices, rotation determines direction of face-normal */
    #indices: Uint16Array;
    /** vertices of the actual point cloud, some points might be in the same location in order to refer to different texels */
    #positions: Float32Array;
    /** vertex normals for smooth shading, interpolated between vertices during rendering */
    #normals: Float32Array;
    /** texture coordinates associated with the vertices by the position in the array */
    #textureUVs: Float32Array;
    /* colors */
    #colors: Float32Array;
    /** vertex tangents for normal mapping, based on the vertex normals and the UV coordinates */
    #tangents: Float32Array;

    #bones: Uint8Array;
    #weights: Float32Array;

    public constructor(_mesh: Mesh) {
      this.mesh = _mesh;
    }

    public get positions(): Float32Array {
      if (this.#positions == null) {
        const vertices: Vertices = this.mesh.vertices;
        const positions: Float32Array = new Float32Array(vertices.length * 3);
        for (let i: number = 0; i < vertices.length; i++)
          vertices.position(i).toArray(positions, i * 3);

        this.#positions = positions;
      }

      return this.#positions;
    }
    public set positions(_vertices: Float32Array) {
      this.#positions = _vertices;
    }

    public get indices(): Uint16Array {
      return this.#indices || ( // return cache or ...
        // ... flatten all indices from the faces into a typed array
        this.#indices = new Uint16Array(this.mesh.faces.flatMap((_face: Face) => _face.indices)
        ));
    }
    public set indices(_indices: Uint16Array) {
      this.#indices = _indices;
    }

    public get normals(): Float32Array {
      if (this.#normals == null) {
        const vertices: Vertices = this.mesh.vertices;

        // TODO: implement a check similiar to the one for tangents below, to see if normals are already present in the vertices

        // sum up all unscaled normals of faces connected to one vertex, weighted by the angle between the two neighbour vertices...
        vertices.forEach(_vertex => _vertex.normal.set(0, 0, 0));

        for (let face of this.mesh.faces)
          face.indices.forEach((_iVertex, _iFaceVertex) => {
            vertices.normal(_iVertex).add(Vector3.SCALE(face.normalUnscaled, face.angles[_iFaceVertex]));
          });
        // ... and normalize them
        vertices.forEach(_vertex => {
          // some vertices might be unused and yield a zero-normal...
          if (_vertex.normal.magnitudeSquared > 0)
            _vertex.normal.normalize();
        });

        // this.ƒnormalsVertex = new Float32Array(normalsVertex.flatMap((_normal: Vector3) => [..._normal.get()]));
        const normals: Float32Array = new Float32Array(vertices.length * 3);
        for (let i: number = 0; i < vertices.length; i++)
          vertices.normal(i).toArray(normals, i * 3);
        this.#normals = normals;
      }

      return this.#normals;
    }
    public set normals(_normals: Float32Array) {
      this.#normals = _normals;
    }

    public get tangents(): Float32Array {
      const vertices: Vertices = this.mesh.vertices;

      if (this.#tangents == null) {

        if (vertices.some(_vertex => !_vertex.uv)) { // assume all vertices have texture coordinates or none
          this.#tangents = new Float32Array(); // no texture coordinates, no tangents
          return this.#tangents;
        }

        if (vertices.some(_vertex => !_vertex.tangent)) { // assume all vertices have tangents or none
          const tangents: Vector3[] = new Array(vertices.length);
          const bitangents: Vector3[] = new Array(vertices.length);
          for (let i: number = 0; i < tangents.length; i++) {
            tangents[i] = Vector3.ZERO();
            bitangents[i] = Vector3.ZERO();
          }

          for (let face of this.mesh.faces) {
            let i0: number = face.indices[0];
            let i1: number = face.indices[1];
            let i2: number = face.indices[2];

            //vertices surrounding one triangle
            let v0: Vector3 = vertices.position(i0);
            let v1: Vector3 = vertices.position(i1);
            let v2: Vector3 = vertices.position(i2);

            //their UVs
            let uv0: Vector2 = vertices.uv(i0);
            let uv1: Vector2 = vertices.uv(i1);
            let uv2: Vector2 = vertices.uv(i2);

            //We compute the edges of the triangle...
            let deltaPos0: Vector3 = Vector3.DIFFERENCE(v1, v0);
            let deltaPos1: Vector3 = Vector3.DIFFERENCE(v2, v0);

            //...and the edges of the triangles in UV space...
            let deltaUV0: Vector2 = Vector2.DIFFERENCE(uv1, uv0);
            let deltaUV1: Vector2 = Vector2.DIFFERENCE(uv2, uv0);

            //...and compute the tangent
            let r: number = 1 / Vector2.CROSS(deltaUV0, deltaUV1);
            let faceTangent: Vector3 = Vector3.SCALE(Vector3.DIFFERENCE(Vector3.SCALE(deltaPos0, deltaUV1.y), Vector3.SCALE(deltaPos1, deltaUV0.y)), r);
            let faceBitangent: Vector3 = Vector3.SCALE(Vector3.DIFFERENCE(Vector3.SCALE(deltaPos1, -deltaUV0.x), Vector3.SCALE(deltaPos0, -deltaUV1.x)), r); // for winding order counter clockwise

            tangents[i0].add(Vector3.SCALE(faceTangent, face.angles[0]));
            tangents[i1].add(Vector3.SCALE(faceTangent, face.angles[1]));
            tangents[i2].add(Vector3.SCALE(faceTangent, face.angles[2]));

            bitangents[i0].add(Vector3.SCALE(faceBitangent, face.angles[0]));
            bitangents[i1].add(Vector3.SCALE(faceBitangent, face.angles[1]));
            bitangents[i2].add(Vector3.SCALE(faceBitangent, face.angles[2]));
          }

          vertices.forEach((_vertex, _index) => {
            let normal: Vector3 = vertices.normal(_index);
            let tangent: Vector3 = tangents[_index];
            let bitangent: Vector3 = bitangents[_index];

            // reorthogonalize
            tangent.add(Vector3.SCALE(normal, - Vector3.DOT(normal, tangent)));
            if (tangent.magnitudeSquared > 0) // some vertices might be unused and yield a zero-tangent...
              tangent.normalize();

            let handedness: number = (Vector3.DOT(Vector3.CROSS(normal, tangent), bitangent) < 0) ? -1 : 1;

            _vertex.tangent = new Vector4(tangent.x, tangent.y, tangent.z, handedness);
          });
        }

        const tangents: Float32Array = new Float32Array(vertices.length * 4);
        for (let i: number = 0; i < vertices.length; i++)
          vertices.tangent(i).toArray(tangents, i * 4);
        this.#tangents = tangents;
      }

      return this.#tangents;
    }
    public set tangents(_tangents: Float32Array) {
      this.#tangents = _tangents;
    }

    public get textureUVs(): Float32Array {
      if (this.#textureUVs == null) {
        const vertices: Vertices = this.mesh.vertices;

        if (vertices.some(_vertex => !_vertex.uv)) { // assume all vertices have texture coordinates or none
          this.#textureUVs = new Float32Array();
          return this.#textureUVs;
        }

        const textureUVs: Float32Array = new Float32Array(vertices.length * 2);
        for (let i: number = 0; i < vertices.length; i++)
          vertices.uv(i).toArray(textureUVs, i * 2);

        this.#textureUVs = textureUVs;
      }

      return this.#textureUVs;
    }
    public set textureUVs(_textureUVs: Float32Array) {
      this.#textureUVs = _textureUVs;
    }

    public get colors(): Float32Array {
      if (this.#colors == null) {
        const vertices: Vertices = this.mesh.vertices;
        const colors: Float32Array = new Float32Array(vertices.length * 4);

        if (vertices.some(_vertex => !_vertex.color))  // assume all vertices have colors or none
          colors.fill(1); // no colors, fill with opaque white
        else for (let i: number = 0; i < vertices.length; i++)
          vertices.color(i).toArray(colors, i * 4);

        this.#colors = colors;
      }

      return this.#colors;
    }
    public set colors(_colors: Float32Array) {
      this.#colors = _colors;
    }

    public get bones(): Uint8Array {
      return this.#bones || ( // return cache or ...
        this.#bones = this.mesh.vertices.some(_vertex => _vertex.bones) ?
          new Uint8Array(this.mesh.vertices.flatMap((_vertex: Vertex, _index: number) => {
            const bones: Bone[] = this.mesh.vertices.bones(_index);
            return [bones?.[0]?.index || 0, bones?.[1]?.index || 0, bones?.[2]?.index || 0, bones?.[3]?.index || 0];
          })) :
          undefined
      );
    }
    public set bones(_iBones: Uint8Array) {
      this.#bones = _iBones;
    }

    public get weights(): Float32Array {
      return this.#weights || ( // return cache or ...
        this.#weights = this.mesh.vertices.some(_vertex => _vertex.bones) ?
          new Float32Array(this.mesh.vertices.flatMap((_vertex: Vertex, _index: number) => {
            const bones: Bone[] = this.mesh.vertices.bones(_index);
            return [bones?.[0]?.weight || 0, bones?.[1]?.weight || 0, bones?.[2]?.weight || 0, bones?.[3]?.weight || 0];
          })) :
          undefined
      );
    }
    public set weights(_weights: Float32Array) {
      this.#weights = _weights;
    }

    /**
     * Clears this render mesh and all its buffers
     */
    public clear(): void {
      this.#positions = null;
      this.#indices = null;
      this.#textureUVs = null;
      this.#normals = null;
      this.#colors = null;
      this.#tangents = null;

      this.#bones = null;
      this.#weights = null;
    }
  }
}