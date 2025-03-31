namespace FudgeCore {
  export enum PICK {
    RADIUS = "radius",
    CAMERA = "camera",
    PHYSICS = "physics"
  }

  /**
   * Attaches picking functionality to the node
   * @authors Jirka Dell'Oro-Friedl, HFU, 2022
   */
  export class ComponentPick extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentPick);
    public pick: PICK = PICK.RADIUS;

    /**
     * Picks the node according to the given {@link Ray} and invokes events accordingly
     */
    public pickAndDispatch(_ray: Ray, _event: PointerEvent): void {
      let cmpMesh: ComponentMesh = this.node.getComponent(ComponentMesh);
      let position: Vector3 = cmpMesh ? cmpMesh.mtxWorld.translation : this.node.mtxWorld.translation;

      switch (this.pick) {
        case PICK.RADIUS:
          // TODO: should only be node.radius. Adjustment needed, if mesh was transformed...
          if (_ray.getDistance(position).magnitude < this.node.radius) {
            this.node.dispatchEvent(_event);
          }
          break;
        case PICK.PHYSICS:
          let hitInfo: RayHitInfo = Physics.raycast(_ray.origin, _ray.direction, Vector3.DIFFERENCE(position, _ray.origin).magnitudeSquared);
          if (hitInfo.hit)
            this.node.dispatchEvent(_event);
          break;
        //TODO: PICK.CAMERA
      }
    }

    public serialize(): Serialization {
      return this.getMutator();
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.mutate(_serialization);
      return this;
    }

    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = super.getMutatorAttributeTypes(_mutator);
      if (types.pick)
        types.pick = PICK;
      return types;
    }

    public drawGizmosSelected(_cmpCamera: ComponentCamera): void {
      if (this.pick != PICK.RADIUS)
        return;

      let translation: Vector3 = (this.node.getComponent(ComponentMesh)?.mtxWorld ?? this.node.mtxWorld).translation;

      let color: Color = Color.CSS("white", 0.5);
      let scaling: Vector3 = Recycler.get(Vector3).set(this.node.radius * 2, this.node.radius * 2, this.node.radius * 2);
      let mtxWorld: Matrix4x4 = Matrix4x4.COMPOSITION(translation, undefined, scaling);
      Gizmos.drawSphere(mtxWorld, color);

      Recycler.store(mtxWorld);
      Recycler.store(scaling);
      Recycler.store(color);
    }
  }
}