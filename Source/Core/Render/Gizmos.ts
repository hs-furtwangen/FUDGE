namespace FudgeCore {

  /**
   * The interface to render visual aids in the editor. Implemented by {@link Component}s. Can be used on its own to draw and pick visual aids independent of a scene graph.
   */
  export interface Gizmo {
    node?: Node;
    /**
     * Implement this to draw visual aids inside the editors render view. Use {@link Gizmos} inside the override to draw stuff.
     */
    drawGizmos?(_cmpCamera?: ComponentCamera, _picking?: boolean): void;

    /**
     * See {@link drawGizmos}. Only displayed while the corresponding node is selected.
     */
    drawGizmosSelected?(_cmpCamera?: ComponentCamera): void;
  }

  /**
   * The gizmos drawing interface. {@link Component}s can use this to draw visual aids inside {@link Component.drawGizmos} and {@link Component.drawGizmosSelected}.
   */
  export abstract class Gizmos {
    /** 
     * The default opacity of occluded gizmo parts. Use this to control the visibility of gizmos behind objects.
     * Set to 0 to make occluded gizmo parts disappear. Set to 1 to make occluded gizmo parts fully visible.
     */
    private static alphaOccluded: number = 0.3; // currently gizmos can always be picked even if this is set to 0...

    private static readonly arrayBuffer: WebGLBuffer = RenderWebGL.assert(RenderWebGL.getRenderingContext().createBuffer());

    private static pickId: number;
    private static readonly posIcons: Set<string> = new Set(); // cache the positions of icons to avoid drawing them within each other

    static #camera: ComponentCamera;

    static #meshes: { [key: string]: Mesh } = {};
    static #mapMeshToWireBuffers: WeakMap<Mesh, RenderBuffers> = new WeakMap();

    static #colorData: Float32Array = new Float32Array(4);

    // TODO: think about drawing these on the fly instead of caching them. Then we could accept a position, radius etc. parameter and draw them independent from the mtxWorld
    private static get wireCircle(): Vector3[] {
      const radius: number = 0.5;
      const segments: number = 45;
      const circle: Vector3[] = new Array(segments).fill(null).map(() => Recycler.get(Vector3));
      for (let i: number = 0; i < segments; i++) {
        const angle: number = (i / segments) * 2 * Math.PI;
        const x: number = radius * Math.cos(angle);
        const y: number = radius * Math.sin(angle);
        circle[i].set(x, y, 0);
      }

      const lines: Vector3[] = [];
      for (let i: number = 0; i < segments; i++)
        lines.push(circle[i], circle[(i + 1) % segments]);

      Reflect.defineProperty(Gizmos, "wireCircle", { value: lines });
      return Gizmos.wireCircle;
    }

    private static get wireSphere(): Vector3[] {
      let lines: Vector3[] = Gizmos.wireCircle.concat();
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_X(90);
      lines.push(...Gizmos.wireCircle.map((_point: Vector3) => Vector3.TRANSFORMATION(_point, mtxRotation)));
      mtxRotation.rotateY(90);
      lines.push(...Gizmos.wireCircle.map((_point: Vector3) => Vector3.TRANSFORMATION(_point, mtxRotation)));

      Reflect.defineProperty(Gizmos, "wireSphere", { value: lines });
      return Gizmos.wireSphere;
    }

    private static get wireCone(): Vector3[] {
      const radius: number = 0.5;
      const height: number = 1;
      const apex: Vector3 = Vector3.ZERO();
      const quad: Vector3[] = [
        new Vector3(radius, 0, height),
        new Vector3(-radius, 0, height),
        new Vector3(0, radius, height),
        new Vector3(0, -radius, height)
      ];

      let lines: Vector3[] = Gizmos.wireCircle.map((_point: Vector3) => Vector3.TRANSFORMATION(_point, Matrix4x4.TRANSLATION(Vector3.Z(1))));

      lines.push(...[apex, quad[0], apex, quad[1], apex, quad[2], apex, quad[3]]);

      Reflect.defineProperty(Gizmos, "wireCone", { value: lines });
      return Gizmos.wireCone;
    }

    private static get wireCube(): Vector3[] {
      const halfSize: number = 0.5;
      const cube: Vector3[] = [
        new Vector3(halfSize, halfSize, halfSize), new Vector3(-halfSize, halfSize, halfSize),
        new Vector3(-halfSize, -halfSize, halfSize), new Vector3(halfSize, -halfSize, halfSize),
        new Vector3(halfSize, halfSize, -halfSize), new Vector3(-halfSize, halfSize, -halfSize),
        new Vector3(-halfSize, -halfSize, -halfSize), new Vector3(halfSize, -halfSize, -halfSize)
      ];

      const lines: Vector3[] = [
        cube[0], cube[1], cube[1], cube[2], cube[2], cube[3], cube[3], cube[0],
        cube[4], cube[5], cube[5], cube[6], cube[6], cube[7], cube[7], cube[4],
        cube[0], cube[4], cube[1], cube[5], cube[2], cube[6], cube[3], cube[7]
      ];

      Reflect.defineProperty(Gizmos, "wireCube", { value: lines });
      return Gizmos.wireCube;
    }

    /**
     * Are we currently rendering for picking?
     */
    static get #picking(): boolean {
      return this.pickId != null;
    }

    /**
     * Draws the given gizmos from the point of view of the given camera.
     */
    public static draw(_gizmos: Gizmo[], _cmpCamera: ComponentCamera, _selected?: Node[]): void {
      for (const gizmo of _gizmos)
        if (gizmo.node)
          Reflect.set(gizmo.node, "zCamera", _cmpCamera.pointWorldToClip(gizmo.node.mtxWorld.translation).z);

      _gizmos = _gizmos.sort((_a, _b) =>
        (_b.node ? Reflect.get(_b.node, "zCamera") : 2) -
        (_a.node ? Reflect.get(_a.node, "zCamera") : 2)
      );

      Gizmos.#camera = _cmpCamera;
      Gizmos.posIcons.clear();

      RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);

      for (const gizmo of _gizmos) {
        gizmo.drawGizmos?.(_cmpCamera, Gizmos.#picking);
        if (_selected?.includes(gizmo.node))
          gizmo.drawGizmosSelected?.(_cmpCamera);
      }
    }

    /**
     * Picks all gizmos in the line of sight and returns an unsorted array of {@link Pick}s each associated with the gizmo the pick ray hit.
     */
    public static pick(_gizmos: readonly Gizmos[], _cmpCamera: ComponentCamera): Pick[] {
      return RenderWebGLPicking.pickFrom(_gizmos, _cmpCamera, Gizmos.pickGizmos);
    }

    /**
     * Draws a camera frustum for the given parameters. The frustum is oriented along the z-axis, with the tip of the truncated pyramid at the origin.
     */
    public static drawWireFrustum(_aspect: number, _fov: number, _near: number, _far: number, _direction: FIELD_OF_VIEW, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const f: number = Math.tan(Calc.deg2rad * _fov / 2);

      let scaleX: number = f;
      let scaleY: number = f;

      switch (_direction) {
        case FIELD_OF_VIEW.HORIZONTAL:
          scaleY = f / _aspect;
          break;
        case FIELD_OF_VIEW.VERTICAL:
          scaleX = f * _aspect;
          break;
        case FIELD_OF_VIEW.DIAGONAL:
          const diagonalAspect: number = Math.sqrt(_aspect);
          scaleX = f * diagonalAspect;
          scaleY = f / diagonalAspect;
          break;
      }

      const nearX: number = _near * scaleX;
      const nearY: number = _near * scaleY;
      const farX: number = _far * scaleX;
      const farY: number = _far * scaleY;

      const frustum: Vector3[] = new Array(8).fill(null).map(() => Recycler.get(Vector3));

      frustum[0].set(-nearX, nearY, _near);
      frustum[1].set(nearX, nearY, _near);
      frustum[2].set(nearX, -nearY, _near);
      frustum[3].set(-nearX, -nearY, _near);

      frustum[4].set(-farX, farY, _far);
      frustum[5].set(farX, farY, _far);
      frustum[6].set(farX, -farY, _far);
      frustum[7].set(-farX, -farY, _far);

      Gizmos.drawLines([
        frustum[0], frustum[1], frustum[1], frustum[2], frustum[2], frustum[3], frustum[3], frustum[0], // near plane
        frustum[4], frustum[5], frustum[5], frustum[6], frustum[6], frustum[7], frustum[7], frustum[4], // far plane
        frustum[0], frustum[4], frustum[1], frustum[5], frustum[2], frustum[6], frustum[3], frustum[7]  // sides
      ], _mtxWorld, _color, _alphaOccluded);

      Recycler.store(frustum);
    }

    /**
     * Draws a wireframe cube. The cube has a side-length of 1 and is centered around the origin.
     */
    public static drawWireCube(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawLines(Gizmos.wireCube, _mtxWorld, _color, _alphaOccluded);
    }


    /**
     * Draws a wireframe sphere. The sphere has a diameter of 1 and is centered around the origin.
     */
    public static drawWireSphere(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      let mtxWorld: Matrix4x4 = _mtxWorld.clone;

      Gizmos.drawLines(Gizmos.wireSphere, mtxWorld, _color, _alphaOccluded);
      mtxWorld.lookAt(Gizmos.#camera.mtxWorld.translation);
      Gizmos.drawWireCircle(mtxWorld, _color, _alphaOccluded);

      Recycler.store(mtxWorld);
    }

    /**
     * Draws a cone with a height and diameter of 1. The cone is oriented along the z-axis with the tip at the origin.
     */
    public static drawWireCone(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawLines(Gizmos.wireCone, _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a circle with a diameter of 1. The circle lies in the x-y plane, with its center at the origin.
     */
    public static drawWireCircle(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawLines(Gizmos.wireCircle, _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws lines between each pair of the given vertices. 
     * Vertices are paired sequentially, so for example, lines will be drawn between vertices 0 and 1, 2 and 3, 4 and 5, etc.
     */
    public static drawLines(_vertices: Vector3[], _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const shader: ShaderInterface = Gizmos.#picking ? ShaderPick : ShaderGizmo;
      shader.useProgram();

      // TODO: cache linedata somehow, so we don't have to create a new Float32Array every time
      const lineData: Float32Array = new Float32Array(_vertices.length * 3);
      for (let i: number = 0; i < _vertices.length; i++) {
        const point: Vector3 = _vertices[i];
        point.toArray(lineData, i * 3);
      }

      crc3.bindVertexArray(null);
      crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, Gizmos.arrayBuffer);
      crc3.enableVertexAttribArray(SHADER_ATTRIBUTE.POSITION);
      crc3.vertexAttribPointer(SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT, false, 0, 0);

      Gizmos.bufferMatrix(shader, _mtxWorld);
      crc3.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, lineData, WebGL2RenderingContext.DYNAMIC_DRAW);

      Gizmos.drawGizmos(shader, Gizmos.drawArrays, _vertices.length, _color, _alphaOccluded);
    }

    /**
     * Draws a wireframe mesh.
     */
    public static drawWireMesh(_mesh: Mesh, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const shader: ShaderInterface = Gizmos.#picking ? ShaderPick : ShaderGizmo;
      shader.useProgram();

      const wireBuffers: RenderBuffers = Gizmos.#mapMeshToWireBuffers.get(_mesh) ?? {};

      if (!Gizmos.#mapMeshToWireBuffers.has(_mesh)) {
        const indices: number[] = [];
        const renderBuffers: RenderBuffers = _mesh.getRenderBuffers();
        const renderMesh: RenderMesh = _mesh.renderMesh;
        for (let i: number = 0; i < renderMesh.indices.length; i += 3) { // TODO: think about caching this in the mesh
          const a: number = renderMesh.indices[i];
          const b: number = renderMesh.indices[i + 1];
          const c: number = renderMesh.indices[i + 2];
  
          // Add the line segments for the triangle to the line indices
          indices.push(a, b, b, c, c, a);
        }

        // set up vertex attribute object
        wireBuffers.vao = RenderWebGL.assert<WebGLVertexArrayObject>(crc3.createVertexArray());
        wireBuffers.indices = RenderWebGL.assert(RenderWebGL.getRenderingContext().createBuffer());
        wireBuffers.positions = renderBuffers.positions;
        wireBuffers.nIndices = indices.length;

        Gizmos.#mapMeshToWireBuffers.set(_mesh, wireBuffers);

        crc3.bindVertexArray(wireBuffers.vao);
        crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, wireBuffers.indices);
        crc3.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), WebGL2RenderingContext.STATIC_DRAW);

        crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, renderBuffers.positions);
        crc3.enableVertexAttribArray(SHADER_ATTRIBUTE.POSITION);
        crc3.vertexAttribPointer(SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT, false, 0, 0);
      }

      Gizmos.bufferMatrix(shader, _mtxWorld);
      crc3.bindVertexArray(wireBuffers.vao);
      Gizmos.drawGizmos(shader, Gizmos.drawElementsLines, wireBuffers.nIndices, _color, _alphaOccluded);
    }

    /**
     * Draws an arrow at the given world position, facing in the given forward-direction with the given length and width. 
     * Size refers to the size of the arrow head: the height of the pyramid; the size of the cube; the diameter of the sphere.
     * @param _forward A unit vector indicating the desired forward-direction.
     * @param _up A unit vector indicating the up-direction.
     */
    public static drawArrow(_position: Vector3, _color: Color, _forward: Vector3, _up: Vector3, _length: number, _width: number, _size: number, _head: typeof MeshCube | typeof MeshPyramid | typeof MeshSphere | null = MeshPyramid, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const scaling: Vector3 = Recycler.reuse(Vector3).set(_width, _width, _length - _size);
      const mtxWorld: Matrix4x4 = Matrix4x4.COMPOSITION(_position);
      mtxWorld.scaling = scaling;
      mtxWorld.lookIn(_forward, _up);
      mtxWorld.translateZ(0.5);
      Gizmos.drawCube(mtxWorld, _color, _alphaOccluded);
      mtxWorld.translateZ(0.5);

      if (_head == MeshPyramid) {
        const widthHead: number = _size / 2;
        mtxWorld.scaling = scaling.set(widthHead, widthHead, _size);
        mtxWorld.rotateX(90); // rotate the pyramid so it points in the right direction
      } else {
        mtxWorld.scaling = scaling.set(_size, _size, _size);
        mtxWorld.translateZ(0.5); // translate cube/sphere so it sits on top of the arrow
      }

      Gizmos.drawMesh(Gizmos.getMesh(_head), mtxWorld, _color, _alphaOccluded);

      Recycler.store(mtxWorld);
      Recycler.store(scaling);
    }

    /**
     * Draws a solid cube.
     */
    public static drawCube(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawMesh(Gizmos.getMesh(MeshCube), _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a solid sphere.
     */
    public static drawSphere(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawMesh(Gizmos.getMesh(MeshSphere), _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a solid quad.
     */
    public static drawQuad(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawMesh(Gizmos.getMesh(MeshQuad), _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a solid double sided quad.
     */
    public static drawSprite(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawMesh(Gizmos.getMesh(MeshSprite), _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a solid pyramid.
     */
    public static drawPyramid(_mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      Gizmos.drawMesh(Gizmos.getMesh(MeshPyramid), _mtxWorld, _color, _alphaOccluded);
    }

    /**
     * Draws a solid mesh.
     */
    public static drawMesh(_mesh: Mesh, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const shader: ShaderInterface = Gizmos.#picking ? ShaderPick : ShaderGizmo;
      shader.useProgram();
      
      RenderWebGL.useNodeUniforms(shader, _mtxWorld, null, null, Gizmos.pickId);
      
      const renderBuffers: RenderBuffers = _mesh.useRenderBuffers();
      Gizmos.drawGizmos(shader, Gizmos.drawElementsTrianlges, renderBuffers.nIndices, _color, _alphaOccluded);
    }

    /**
     * Draws an icon from a {@link Texture} on a {@link MeshQuad}. The icon is affected by the given transform and color.
     */
    public static drawIcon(_texture: Texture, _mtxWorld: Matrix4x4, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      let position: string = _mtxWorld.translation.toString();
      if (Gizmos.posIcons.has(position))
        return;
      Gizmos.posIcons.add(position);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      const shader: ShaderInterface = Gizmos.#picking ? ShaderPickTextured : ShaderGizmoTextured;
      shader.useProgram();

      let mtxWorld: Matrix4x4 = _mtxWorld.clone;
      let color: Color = _color.clone;

      let back: Vector3 = Gizmos.#camera.mtxWorld.getForward().negate();
      let up: Vector3 = Gizmos.#camera.mtxWorld.getUp();
      mtxWorld.lookIn(back, up);

      let distance: number = Vector3.DIFFERENCE(Gizmos.#camera.mtxWorld.translation, mtxWorld.translation).magnitude;
      let fadeFar: number = 4;
      let fadeNear: number = 1.5;
      if (distance > 0 && distance < fadeFar) {
        distance = (distance - fadeNear) / (fadeFar - fadeNear);
        color.a = Calc.lerp(0, color.a, distance);
      }

      _texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
      crc3.uniform1i(shader.uniforms[TEXTURE_LOCATION.COLOR.UNIFORM], TEXTURE_LOCATION.COLOR.INDEX);

      RenderWebGL.useNodeUniforms(shader, mtxWorld, null, null, Gizmos.pickId);
      
      const renderBuffers: RenderBuffers = Gizmos.getMesh(MeshQuad).useRenderBuffers();
      Gizmos.drawGizmos(shader, Gizmos.drawElementsTrianlges, renderBuffers.nIndices, color, _alphaOccluded);

      Recycler.store(mtxWorld);
      Recycler.store(back);
      Recycler.store(up);
      Recycler.store(color);
    }

    private static bufferColor(_shader: ShaderInterface, _color: Color): void {
      RenderWebGL.getRenderingContext().uniform4fv(_shader.uniforms["u_vctColor"], _color.toArray(Gizmos.#colorData));
    }

    private static bufferMatrix(_shader: ShaderInterface, _mtxWorld: Matrix4x4): void {
      RenderWebGL.getRenderingContext().uniformMatrix4fv(_shader.uniforms["u_mtxMeshToWorld"], false, _mtxWorld.getArray());
    }

    private static drawGizmos(_shader: ShaderInterface, _draw: Function, _count: number, _color: Color, _alphaOccluded: number = Gizmos.alphaOccluded): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (_alphaOccluded > 0) {
        let color: Color = _color.clone;
        color.a *= _alphaOccluded;

        // draw occluded parts where the depth test failed (by inverting the depth test + no depth write)
        crc3.depthFunc(WebGL2RenderingContext.GEQUAL);
        crc3.depthMask(false);
        Gizmos.bufferColor(_shader, color);
        _draw(_count);
        crc3.depthFunc(WebGL2RenderingContext.LESS);
        crc3.depthMask(true);
        Recycler.store(color);
      }

      Gizmos.bufferColor(_shader, _color);
      _draw(_count);
    }

    private static drawElementsTrianlges(_count: number): void {
      RenderWebGL.getRenderingContext().drawElements(WebGL2RenderingContext.TRIANGLES, _count, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
    }

    private static drawElementsLines(_count: number): void {
      RenderWebGL.getRenderingContext().drawElements(WebGL2RenderingContext.LINES, _count, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
    }

    private static drawArrays(_count: number): void {
      RenderWebGL.getRenderingContext().drawArrays(WebGL2RenderingContext.LINES, 0, _count);
    }

    private static getMesh(_constructor: new (_name: string) => Mesh): Mesh {
      let key: string = _constructor.name;
      let mesh: Mesh = Gizmos.#meshes[key];
      if (mesh)
        return mesh;

      mesh = new _constructor(key);
      Project.deregister(mesh);
      Gizmos.#meshes[key] = mesh;
      return mesh;
    }

    private static pickGizmos(_gizmos: readonly Gizmo[], _cmpCamera: ComponentCamera): Pick[] {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.uniformMatrix3fv(ShaderPickTextured.uniforms["u_mtxPivot"], false, Matrix3x3.IDENTITY().getArray()); // only needed for textured pick shader, but gizmos have no pivot

      Gizmos.#camera = _cmpCamera;
      Gizmos.posIcons.clear();

      let picks: Pick[] = [];
      for (let gizmo of _gizmos) {
        if (!gizmo.drawGizmos)
          continue;

        Gizmos.pickId = picks.length;
        gizmo.drawGizmos(_cmpCamera, Gizmos.#picking);
        let pick: Pick = new Pick(gizmo.node);
        pick.gizmo = gizmo;
        picks.push(pick);
      }

      Gizmos.pickId = null;

      return picks;
    }
  }
}