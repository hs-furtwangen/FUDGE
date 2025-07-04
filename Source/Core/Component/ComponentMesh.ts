namespace FudgeCore {
  /**
   * Attaches a {@link Mesh} to the node
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019
   */
  @enumerate
  export class ComponentMesh extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentMesh);
    public readonly mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY();

    @type(Mesh)
    public mesh: Mesh;
    public skeleton: ComponentSkeleton;

    #mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();

    public constructor(_mesh?: Mesh, _skeleton?: ComponentSkeleton) {
      super();
      this.mesh = _mesh;
      this.skeleton = _skeleton;
    }

    @enumerate
    public get mtxPivot(): Matrix4x4 {
      return this.#mtxPivot;
    }

    public set mtxPivot(_mtx: Matrix4x4) {
      this.#mtxPivot = _mtx;
      this.#mtxPivot.modified = true;
    }

    public get radius(): number {
      let scaling: Vector3 = this.mtxWorld.scaling;
      let scale: number = Math.max(Math.abs(scaling.x), Math.abs(scaling.y), Math.abs(scaling.z));
      return this.mesh.radius * scale;
    }

    // /**
    //  * Calculates the position of a vertex transformed by the skeleton
    //  * @param _index index of the vertex
    //  */
    // public getVertexPosition(_index: number): Vector3 {
    //   // extract the vertex data (vertices: 3D vectors, bone indices & weights: 4D vectors)
    //   const iVertex: number = _index * 3;
    //   const iBoneInfluence: number = _index * 4;

    //   const vertex: Vector3 = new Vector3(...Reflect.get(this.mesh, "renderMesh").vertices.slice(iVertex, iVertex + 3));
    //   if (!(this.mesh instanceof MeshSkin)) return vertex;

    //   const iBones: Uint8Array = this.mesh.iBones.slice(iBoneInfluence, iBoneInfluence + 4);
    //   const weights: Float32Array = this.mesh.weights.slice(iBoneInfluence, iBoneInfluence + 4);

    //   // get bone matrices
    //   const mtxBones: Array<Matrix4x4> = this.skeleton.mtxBones;

    //   // skin matrix S = sum_i=1^m{w_i * B_i}
    //   const skinMatrix: Matrix4x4 = new Matrix4x4();
    //   skinMatrix.set(Array
    //     .from(iBones)
    //     .map((iBone, iWeight) => mtxBones[iBone].get().map(value => value * weights[iWeight])) // apply weight on each matrix
    //     .reduce((mtxSum, mtxBone) => mtxSum.map((value, index) => value + mtxBone[index])) // sum up the matrices
    //   );

    //   // transform vertex
    //   vertex.transform(skinMatrix);

    //   return vertex;
    // }

    // TODO: remove or think if the transformed bounding box is of value or can be made to be
    // public get boundingBox(): Box {
    //   let box: Box = Recycler.get(Box);
    //   box.set(
    //     Vector3.TRANSFORMATION(this.mesh.boundingBox.min, this.mtxWorld, true),
    //     Vector3.TRANSFORMATION(this.mesh.boundingBox.max, this.mtxWorld, true)
    //   );
    //   return box;
    // }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization;
      /* at this point of time, serialization as resource and as inline object is possible. TODO: check if inline becomes obsolete */
      let idMesh: string = this.mesh.idResource;
      if (idMesh)
        serialization = { idMesh: idMesh };
      else
        serialization = { mesh: Serializer.serialize(this.mesh) };

      if (this.skeleton)
        serialization.skeleton = Node.PATH_FROM_TO(this, this.skeleton);

      serialization.pivot = this.mtxPivot.serialize();
      serialization[super.constructor.name] = super.serialize();
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      let mesh: Mesh;
      if (_serialization.idMesh)
        mesh = <Mesh>await Project.getResource(_serialization.idMesh);
      else
        mesh = <Mesh>await Serializer.deserialize(_serialization.mesh);
      this.mesh = mesh;

      if (_serialization.skeleton) {
        const hndNodeDeserialized: EventListenerUnified = () => {
          const hndGraphDeserialized: EventListenerUnified = () => {
            this.skeleton = Node.FIND(this, _serialization.skeleton);
            this.node.removeEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
            this.removeEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
          };
          this.node.addEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
        };
        this.addEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
      }

      await this.mtxPivot.deserialize(_serialization.pivot);
      await super.deserialize(_serialization[super.constructor.name]);
      return this;
    }

    //#endregion

    public drawGizmosSelected(): void {
      if (!this.mesh)
        return;
      let color: Color = Color.CSS("salmon");
      Gizmos.drawWireMesh(this.mesh, this.mtxWorld, color, 0.1);
      Recycler.store(color);
    }
  }

}
