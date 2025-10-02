namespace FudgeCore {
  /**
   * Defines automatic adjustment of the collider
   */
  export enum BODY_INIT {
    /** Collider uses the pivot of the mesh for initilialization */
    TO_MESH,
    /** Collider uses the transform of the node for initilialization */
    TO_NODE,
    /** Collider uses its own pivot for initilialization */
    TO_PIVOT
  }

  /**
   * Acts as the physical representation of the {@link Node} it's attached to.
   * It's the connection between the FUDGE rendered world and the Physics world.
   * For the physics to correctly get the transformations rotations need to be applied with from left = true.
   * Or rotations need to happen before scaling.
   * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2025
   */
  @orderFlat
  export class ComponentRigidbody extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentRigidbody);
    private static mapBodyType: { [type: number]: number } = (typeof OIMO == "undefined") ?
      {
        [BODY_TYPE.DYNAMIC]: BODY_TYPE.DYNAMIC, [BODY_TYPE.STATIC]: BODY_TYPE.STATIC, [BODY_TYPE.KINEMATIC]: BODY_TYPE.KINEMATIC
      } : {
        [BODY_TYPE.DYNAMIC]: OIMO.RigidBodyType.DYNAMIC, [BODY_TYPE.STATIC]: OIMO.RigidBodyType.STATIC, [BODY_TYPE.KINEMATIC]: OIMO.RigidBodyType.KINEMATIC
      };

    /** Transformation of the collider relative to the node's transform. Once set mostly remains constant. 
     * If altered, {@link isInitialized} must be reset to false to recreate the collider in the next {@link Render.prepare}
     */
    @order(4)
    @edit(Matrix4x4)
    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();

    /** 
     * Vertices that build a convex mesh (form that is in itself closed). Needs to set in the construction of the rb if none of the standard colliders is used. 
     * Untested and not yet fully supported by serialization and mutation.
     */
    public convexMesh: Float32Array = null;

    /** Collisions with rigidbodies happening to this body, can be used to build a custom onCollisionStay functionality. */
    public collisions: ComponentRigidbody[] = new Array();
    /** Triggers that are currently triggering this body */
    public triggerings: ComponentRigidbody[] = new Array();

    /** 
     * The groups this object collides with. Groups must be writen in form of
     *  e.g. collisionMask = {@link COLLISION_GROUP.DEFAULT} | {@link COLLISION_GROUP}.... and so on to collide with multiple groups. 
     */
    @order(6)
    @edit(Number)
    public collisionMask: number;

    /** 
     * Automatic adjustment of the pivot when {@link Render.prepare} is called according to {@link BODY_INIT}
     */
    @order(3)
    @edit(BODY_INIT)
    public initialization: BODY_INIT = BODY_INIT.TO_PIVOT;
    /** Marks if collider was initialized. Reset to false to initialize again e.g. after manipulation of mtxPivot */
    public isInitialized: boolean = false;

    //Private informations - Mostly OimoPhysics variables that should not be exposed to the FUDGE User and manipulated by them
    #collider: OIMO.Shape;
    #colliderInfo: OIMO.ShapeConfig;
    #collisionGroup: COLLISION_GROUP = COLLISION_GROUP.DEFAULT;
    #typeCollider: COLLIDER_TYPE = COLLIDER_TYPE.CUBE;

    #rigidbody: OIMO.RigidBody;
    #rigidbodyInfo: OIMO.RigidBodyConfig = new OIMO.RigidBodyConfig();
    #typeBody: BODY_TYPE = BODY_TYPE.DYNAMIC;

    #massData: OIMO.MassData = new OIMO.MassData();
    #restitution: number;
    #friction: number;
    #dampingLinear: number = 0.1;
    #dampingAngular: number = 0.1;
    #effectRotation: Vector3 = Vector3.ONE();
    #effectGravity: number = 1;
    #isTrigger: boolean = false;
    #mtxPivotUnscaled: Matrix4x4 = Matrix4x4.IDENTITY();
    #mtxPivotInverse: Matrix4x4 = Matrix4x4.IDENTITY();

    #callbacks: OIMO.ContactCallback; //Callback Methods when within the oimoSystem a event is happening

    // #physics: Physics; //TODO: keep a pointer to the physics instance used by this component

    /** Creating a new rigidbody with a weight in kg, a physics type (default = dynamic), a collider type what physical form has the collider, to what group does it belong, is there a transform Matrix that should be used, and is the collider defined as a group of points that represent a convex mesh. */
    public constructor(_mass: number = 1, _type: BODY_TYPE = BODY_TYPE.DYNAMIC, _colliderType: COLLIDER_TYPE = COLLIDER_TYPE.CUBE, _group: COLLISION_GROUP = Physics.settings.defaultCollisionGroup, _mtxTransform: Matrix4x4 = null, _convexMesh: Float32Array = null) {
      super();
      this.create(_mass, _type, _colliderType, _group, _mtxTransform, _convexMesh);

      this.addEventListener(EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(EVENT.COMPONENT_REMOVE, this.hndEvent);
      // this.addEventListener(EVENT.NODE_DESERIALIZED, this.hndEvent);
    }



    //#region Accessors

    /** Used for calculation of the geometrical relationship of node and collider by {@link Render}*/
    public get mtxPivotInverse(): Matrix4x4 {
      return this.#mtxPivotInverse;
    }
    /** Used for calculation of the geometrical relationship of node and collider by {@link Render}*/
    public get mtxPivotUnscaled(): Matrix4x4 {
      return this.#mtxPivotUnscaled;
    }

    /** Retrieve the body type. See {@link BODY_TYPE} */
    @order(1)
    @edit(BODY_TYPE)
    public get typeBody(): BODY_TYPE {
      return this.#typeBody;
    }

    /** Set the body type. See {@link BODY_TYPE} */
    public set typeBody(_value: BODY_TYPE) {
      this.#typeBody = _value;
      this.#rigidbody.setType(ComponentRigidbody.mapBodyType[this.#typeBody]);
      this.#rigidbody.setMassData(this.#massData); //have to reset mass after changing the type, since Oimo is handling mass internally wrong when switching types
    }

    /** The shape that represents the {@link Node} in the physical world. Default is a Cube. */
    @order(2)
    @edit(COLLIDER_TYPE)
    public get typeCollider(): COLLIDER_TYPE {
      return this.#typeCollider;
    }

    public set typeCollider(_value: COLLIDER_TYPE) {
      if (_value != this.#typeCollider && this.#rigidbody != null) {
        this.#typeCollider = _value;
        this.initialize();
      }
    }

    /** The collision group this {@link Node} belongs to it's the default group normally which means it physically collides with every group besides trigger. */
    @order(5)
    @edit(COLLISION_GROUP)
    public get collisionGroup(): COLLISION_GROUP {
      return this.#collisionGroup;
    }

    public set collisionGroup(_value: COLLISION_GROUP) {
      this.#collisionGroup = _value;
      if (this.#rigidbody != null)
        this.#rigidbody.getShapeList().setCollisionGroup(this.#collisionGroup);
    }

    /**
     * The physical weight of the body in kg.
     */
    @edit(Number)
    public get mass(): number {
      return this.#rigidbody.getMass();
    }

    public set mass(_value: number) {
      this.#massData.mass = _value;
      if (this.node != null)
        if (this.#rigidbody != null)
          this.#rigidbody.setMassData(this.#massData);
    }

    /** Drag of linear movement. A Body does slow down even on a surface without friction. */
    @edit(Number)
    public get dampTranslation(): number {
      return this.#rigidbody.getLinearDamping();
    }

    public set dampTranslation(_value: number) {
      this.#dampingLinear = _value;
      this.#rigidbody.setLinearDamping(_value);
    }

    /** Drag of rotation. */
    @edit(Number)
    public get dampRotation(): number {
      return this.#rigidbody.getAngularDamping();
    }

    public set dampRotation(_value: number) {
      this.#dampingAngular = _value;
      this.#rigidbody.setAngularDamping(_value);
    }

    /** The factor this rigidbody reacts rotations that happen in the physical world. 0 to lock rotation this axis. */
    @edit(Vector3)
    public get effectRotation(): Vector3 {
      return this.#effectRotation;
    }

    public set effectRotation(_effect: Vector3) {
      this.#effectRotation = _effect;
      this.#rigidbody.setRotationFactor(new OIMO.Vec3(this.#effectRotation.x, this.#effectRotation.y, this.#effectRotation.z));
    }

    /** The factor this rigidbody reacts to world gravity. Default = 1 e.g. 1*9.81 m/s. */
    @edit(Number)
    public get effectGravity(): number {
      return this.#effectGravity;
    }

    public set effectGravity(_effect: number) {
      this.#effectGravity = _effect;
      if (this.#rigidbody != null) this.#rigidbody.setGravityScale(this.#effectGravity);
    }

    /**
     * The friction of the rigidbody, which is the factor of sliding resistance of this rigidbody on surfaces.
     */
    @edit(Number)
    public get friction(): number {
      return this.#friction;
    }

    public set friction(_friction: number) {
      this.#friction = _friction;
      if (this.#rigidbody.getShapeList() != null)
        this.#rigidbody.getShapeList().setFriction(this.#friction);
    }

    /**
     * The restitution of the rigidbody, which is the factor of bounciness of this rigidbody on surfaces
     */
    @edit(Number)
    public get restitution(): number {
      return this.#restitution;
    }

    public set restitution(_restitution: number) {
      this.#restitution = _restitution;
      if (this.#rigidbody.getShapeList() != null)
        this.#rigidbody.getShapeList().setRestitution(this.#restitution);
    }

    /** Marking the Body as a trigger therefore not influencing the collision system but only sending triggerEvents */
    @order(0)
    @edit(Boolean)
    public get isTrigger(): boolean {
      return this.#isTrigger;
    }

    public set isTrigger(_value: boolean) {
      this.#isTrigger = _value;
      if (this.getOimoRigidbody() != null) {
        this.getOimoRigidbody()._isTrigger = this.#isTrigger;
      }
    }
    //#endregion

    //#region Transformation
    /**
     * Returns the rigidbody in the form the physics engine is using it, should not be used unless a functionality
     * is not provided through the FUDGE Integration.
     */
    public getOimoRigidbody(): OIMO.RigidBody {
      return this.#rigidbody;
    }

    /** Rotating the rigidbody therefore changing it's rotation over time directly in physics. This way physics is changing instead of transform. 
     *  But you are able to incremental changing it instead of a direct rotation.  Although it's always prefered to use forces in physics.
     */
    public rotateBody(_rotationChange: Vector3): void {
      this.#rigidbody.rotateXyz(new OIMO.Vec3(_rotationChange.x * Calc.deg2rad, _rotationChange.y * Calc.deg2rad, _rotationChange.z * Calc.deg2rad));
    }

    /** Translating the rigidbody therefore changing it's place over time directly in physics. This way physics is changing instead of transform. 
     *  But you are able to incrementally changing it instead of a direct position. Although it's always prefered to use forces in physics. 
     */
    public translateBody(_translationChange: Vector3): void {
      this.#rigidbody.translate(new OIMO.Vec3(_translationChange.x, _translationChange.y, _translationChange.z));
    }

    /**
     * Get the current POSITION of the {@link Node} in the physical space
     */
    public getPosition(): Vector3 {
      let tmpPos: OIMO.Vec3 = this.#rigidbody.getPosition();
      return new Vector3(tmpPos.x, tmpPos.y, tmpPos.z);
    }

    /**
     * Sets the current POSITION of the {@link Node} in the physical space
     */
    public setPosition(_value: Vector3): void {
      this.#rigidbody.setPosition(new OIMO.Vec3(_value.x, _value.y, _value.z));
    }

    /**
     * Get the current ROTATION of the {@link Node} in the physical space. Note this range from -pi to pi, so -90 to 90.
     */
    public getRotation(): Vector3 {
      let orientation: OIMO.Quat = this.#rigidbody.getOrientation();
      let tmpQuat: Quaternion = Recycler.get(Quaternion);
      tmpQuat.set(orientation.x, orientation.y, orientation.z, orientation.w);
      let eulerAngles: Vector3 = tmpQuat.eulerAngles.clone;
      Recycler.store(tmpQuat);
      return eulerAngles;
    }

    /**
     * Sets the current ROTATION of the {@link Node} in the physical space, in degree.
     */
    public setRotation(_value: Vector3 | Quaternion): void {
      let quaternion: Quaternion = _value instanceof Vector3 ? Quaternion.ROTATION(_value) : _value;
      let quat: OIMO.Quat = new OIMO.Quat(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      if (_value instanceof Vector3)
        Recycler.store(quaternion);
      this.#rigidbody.setOrientation(quat);
    }

    /** Get the current SCALING in the physical space. */
    public getScaling(): Vector3 {
      let scaling: Vector3 = this.node.mtxWorld.scaling.clone;
      scaling.x *= this.mtxPivot.scaling.x;
      scaling.y *= this.mtxPivot.scaling.y;
      scaling.z *= this.mtxPivot.scaling.z;
      return scaling;
    }

    /** Scaling requires the collider to be completely recreated anew */
    public setScaling(_value: Vector3): void {
      // let scaling: Vector3 = _value.clone;   
      this.createCollider(new OIMO.Vec3(_value.x / 2, _value.y / 2, _value.z / 2), this.#typeCollider); //recreate the collider
      this.#collider = new OIMO.Shape(this.#colliderInfo);
      let oldCollider: OIMO.Shape = this.#rigidbody.getShapeList();
      this.#rigidbody.addShape(this.#collider); //add new collider, before removing the old, so the rb is never active with 0 colliders
      this.#rigidbody.removeShape(oldCollider); //remove the old collider
      this.#collider.userData = this; //reset the extra information so that this collider knows to which FUDGE Component it's connected
      this.#collider.setCollisionGroup(this.collisionGroup);
      this.#collider.setCollisionMask(this.collisionMask);

      this.#collider.setRestitution(this.#restitution);
      this.#collider.setFriction(this.#friction);
      this.#collider.setContactCallback(this.#callbacks);
    }

    /**
     * Initializes the rigidbody according to its initialization setting to match the mesh, the node or its own pivot matrix
     */
    public initialize(): void {
      if (!this.node) // delay initialization until this rigidbody is attached to a node
        return;
      switch (Number(this.initialization)) {
        case BODY_INIT.TO_NODE:
          this.mtxPivot = Matrix4x4.IDENTITY();
          break;
        case BODY_INIT.TO_MESH:
          let cmpMesh: ComponentMesh = this.node.getComponent(ComponentMesh);
          if (cmpMesh)
            this.mtxPivot = cmpMesh.mtxPivot.clone;
          break;
        case BODY_INIT.TO_PIVOT:
          break;
      }
      let mtxWorld: Matrix4x4 = Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);

      let position: Vector3 = mtxWorld.translation; //Adding the offsets from the pivot
      let rotation: Vector3 = mtxWorld.rotation;
      let scaling: Vector3 = mtxWorld.scaling;
      //scaling requires collider to be recreated
      this.setScaling(scaling);

      this.#rigidbody.setMassData(this.#massData);
      this.setPosition(position); //set the actual new rotation/position for this Rb again since it's now updated
      this.setRotation(rotation);

      let scalingInverse: Vector3 = this.node.mtxWorld.scaling.map(_i => 1 / _i);
      this.#mtxPivotUnscaled = Matrix4x4.COMPOSITION(this.mtxPivot.translation, this.mtxPivot.rotation, scalingInverse);
      this.#mtxPivotInverse = Matrix4x4.INVERSE(this.#mtxPivotUnscaled);

      this.addRigidbodyToWorld();
      this.isInitialized = true;
    }
    //#endregion

    //#region Velocity and Forces
    /**
    * Get the current VELOCITY of the {@link Node}
    */
    public getVelocity(): Vector3 {
      let velocity: OIMO.Vec3 = this.#rigidbody.getLinearVelocity();
      return new Vector3(velocity.x, velocity.y, velocity.z);
    }


    /**
     * Sets the current VELOCITY of the {@link Node}
     */
    public setVelocity(_value: Vector3): void {
      let velocity: OIMO.Vec3 = new OIMO.Vec3(_value.x, _value.y, _value.z);
      this.#rigidbody.setLinearVelocity(velocity);
    }

    /**
     * Get the current ANGULAR - VELOCITY of the {@link Node}
     */
    public getAngularVelocity(): Vector3 {
      let velocity: OIMO.Vec3 = this.#rigidbody.getAngularVelocity();
      return new Vector3(velocity.x, velocity.y, velocity.z);
    }


    /**
     * Sets the current ANGULAR - VELOCITY of the {@link Node}
     */
    public setAngularVelocity(_value: Vector3): void {
      let velocity: OIMO.Vec3 = new OIMO.Vec3(_value.x, _value.y, _value.z);
      this.#rigidbody.setAngularVelocity(velocity);
    }


    /**
    * Applies a continous FORCE at the center of the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS.
    * The force is measured in newton, 1kg needs about 10 Newton to fight against gravity.
    */
    public applyForce(_force: Vector3): void {
      this.#rigidbody.applyForceToCenter(new OIMO.Vec3(_force.x, _force.y, _force.z));
    }

    /**
    * Applies a continous FORCE at a specific point in the world to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
    */
    public applyForceAtPoint(_force: Vector3, _worldPoint: Vector3): void {
      this.#rigidbody.applyForce(new OIMO.Vec3(_force.x, _force.y, _force.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
    }

    /**
    * Applies a continous ROTATIONAL FORCE (Torque) to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
    */
    public applyTorque(_rotationalForce: Vector3): void {
      this.#rigidbody.applyTorque(new OIMO.Vec3(_rotationalForce.x, _rotationalForce.y, _rotationalForce.z));
    }

    /**
    * Applies a instant FORCE at a point/rigidbodycenter to the RIGIDBODY in the three dimensions. Considering the rigidbod's MASS
    * Influencing the angular speed and the linear speed. 
    */
    public applyImpulseAtPoint(_impulse: Vector3, _worldPoint: Vector3 = null): void {
      _worldPoint = _worldPoint != null ? _worldPoint : this.getPosition();
      this.#rigidbody.applyImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
    }

    /**
    * Applies a instant FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
    * Only influencing it's speed not rotation.
    */
    public applyLinearImpulse(_impulse: Vector3): void {
      this.#rigidbody.applyLinearImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z));
    }

    /**
     * Applies a instant ROTATIONAL-FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
     * Only influencing it's rotation.
     */
    public applyAngularImpulse(_rotationalImpulse: Vector3): void {
      this.#rigidbody.applyAngularImpulse(new OIMO.Vec3(_rotationalImpulse.x, _rotationalImpulse.y, _rotationalImpulse.z));
    }

    /**
     * Changing the VELOCITY of the RIGIDBODY. Only influencing the linear speed not angular
     */
    public addVelocity(_value: Vector3): void {
      this.#rigidbody.addLinearVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
    }

    /**
     * Changing the VELOCITY of the RIGIDBODY. Only influencing the angular speed not the linear
     */
    public addAngularVelocity(_value: Vector3): void {
      this.#rigidbody.addAngularVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
    }

    /**
     * De- / Activate the rigidbodies auto-sleeping function.
     * If activated the rigidbody will automatically sleep when needed, increasing performance.
     * If deactivated the rigidbody gets stopped from sleeping when movement is too minimal. Decreasing performance, for rarely more precise physics results 
     */
    public activateAutoSleep(_on: boolean): void {
      this.#rigidbody.setAutoSleep(_on);
    }
    //#endregion

    //#region Collision
    // /**
    //  * Checking for Collision with other Colliders and dispatches a custom event with information about the collider.
    //  * Automatically called in the RenderManager, no interaction needed.
    //  */
    // public checkCollisionEvents(): void {
    //   if (!this.isInitialized) // check collisions only if initialization completed
    //     return;

    //   let contactLink: OIMO.ContactLink = this.#rigidbody.getContactLinkList(); // all physical contacts between colliding bodies on this rb
    //   while (contactLink != null) {
    //     let other: ComponentRigidbody = contactLink.getOther().userData; // get the other component rigidbody involved in the collision
    //     if (!other.isInitialized) {
    //       contactLink = contactLink.getNext();
    //       continue;
    //     }

    //     let contact: OIMO.Contact = contactLink.getContact();
    //     let wasTouching: boolean = this.collisions.includes(other);
    //     let isTouching: boolean = contact.isTouching();

    //     if (!wasTouching && isTouching) { // ENTER
    //       let manifold: OIMO.Manifold = contact.getManifold();
    //       let points: OIMO.ManifoldPoint[] = manifold.getPoints(); // All points in the collision where the two bodies are touching, used to calculate the full impact
    //       let normalImpulse: number = 0;
    //       let binormalImpulse: number = 0;
    //       let tangentImpulse: number = 0;
    //       for (let manifoldPoint of points) { // The impact of the collision involving all touching points
    //         normalImpulse += manifoldPoint.getNormalImpulse();
    //         binormalImpulse += manifoldPoint.getBinormalImpulse();
    //         tangentImpulse += manifoldPoint.getTangentImpulse();
    //       }
    //       let normal: OIMO.Vec3 = manifold.getNormal();
    //       let collisionNormal: Vector3 = new Vector3(normal.x, normal.y, normal.z);
    //       let collisionCenterPoint: Vector3 = this.collisionCenterPoint(points, manifold.getNumPoints());
    //       this.collisions.push(other);
    //       this.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_ENTER, other, normalImpulse, tangentImpulse, binormalImpulse, collisionCenterPoint, collisionNormal)); // Sending the given event
    //     } else if (wasTouching && !isTouching) { // EXIT
    //       this.collisions.splice(this.collisions.indexOf(other), 1);
    //       this.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_EXIT, other, 0, 0, 0));
    //     }

    //     contactLink = contactLink.getNext(); // Start the same routine with the next collision in the list
    //   }
    // }

    /**
     * Sends a ray through this specific body ignoring the rest of the world and checks if this body was hit by the ray,
     * returning info about the hit. Provides the same functionality and information a regular raycast does but the ray is only testing against this specific body.
     */
    public raycastThisBody(_origin: Vector3, _direction: Vector3, _length: number, _debugDraw: boolean = false): RayHitInfo {
      let hitInfo: RayHitInfo = new RayHitInfo();
      let geometry: OIMO.Geometry = this.#rigidbody.getShapeList().getGeometry();
      let transform: OIMO.Transform = this.#rigidbody.getTransform();
      let scaledDirection: Vector3 = _direction.clone;
      scaledDirection.scale(_length);
      let endpoint: Vector3 = Vector3.SUM(scaledDirection, _origin.clone);
      let oimoRay: OIMO.RayCastHit = new OIMO.RayCastHit();
      let hit: boolean = geometry.rayCast(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(endpoint.x, endpoint.y, endpoint.z), transform, oimoRay); //the actual OimoPhysics Raycast
      if (hit) {  //If hit return a bunch of informations about the hit
        hitInfo.hit = true;
        hitInfo.hitPoint = new Vector3(oimoRay.position.x, oimoRay.position.y, oimoRay.position.z);
        hitInfo.hitNormal = new Vector3(oimoRay.normal.x, oimoRay.normal.y, oimoRay.normal.z);
        let dx: number = _origin.x - hitInfo.hitPoint.x;  //calculate hit distance
        let dy: number = _origin.y - hitInfo.hitPoint.y;
        let dz: number = _origin.z - hitInfo.hitPoint.z;
        hitInfo.hitDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        hitInfo.rigidbodyComponent = this;
        hitInfo.rayOrigin = _origin;
        hitInfo.rayEnd = endpoint;
      } else { //Only tell the origin, and the hit point is the end of the ray.
        hitInfo.rayOrigin = _origin;
        hitInfo.hitPoint = new Vector3(endpoint.x, endpoint.y, endpoint.z);
      }
      if (_debugDraw) {
        Physics.debugDraw.debugRay(hitInfo.rayOrigin, hitInfo.hitPoint, new Color(0, 1, 0, 1));
      }
      return hitInfo;
    }
    //#endregion


    //#region Saving/Loading - Some properties might be missing, e.g. convexMesh (Float32Array)
    // TODO: backwards compatibility, remove in future versions
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);

      if (_serialization.pivot != undefined)
        this.mtxPivot.deserialize(_serialization.pivot);

      if (typeof _serialization.initialization == "string")
        this.initialization = <number>(<General>BODY_INIT)[_serialization.initialization];

      if (typeof _serialization.typeBody == "string")
        this.typeBody = <number>(<General>BODY_TYPE)[_serialization.typeBody];

      if (typeof _serialization.typeCollider == "string")
        this.typeCollider = <number>(<General>COLLIDER_TYPE)[_serialization.typeCollider];

      // this.create(this.mass, this.#typeBody, this.#typeCollider, this.collisionGroup, null, this.convexMesh);
      return this;
    }

    /** Change properties by an associative array */
    public async mutate(_mutator: Mutator, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _dispatchMutate);
      if (_mutator.initialization != undefined && this.active)
        this.initialize();
      // TODO: see if this alternative should be, at least partially, done with mutateSelection
      // let callIfExist: Function = (_key: string, _setter: Function) => {
      //   if (_mutator[_key])
      //     _setter(_mutator[_key]);
      // };

      // this.dispatchEvent(new Event(EVENT.MUTATE));
    }
    //#endregion

    // Activate the functions of this component as response to events
    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case EVENT.COMPONENT_ADD:
          // this.addEventListener(EVENT.COMPONENT_ACTIVATE, this.addRigidbodyToWorld);
          this.addEventListener(EVENT.COMPONENT_DEACTIVATE, this.removeRigidbodyFromWorld);
          // this.node.addEventListener(EVENT.NODE_ACTIVATE, this.addRigidbodyToWorld, true); // use capture to react to broadcast!
          this.node.addEventListener(EVENT.NODE_DEACTIVATE, this.hndNodeDeactivate, true);
          if (!this.node.cmpTransform)
            Debug.warn("ComponentRigidbody attached to node missing ComponentTransform", this.node);
          break;
        case EVENT.COMPONENT_REMOVE:
          // this.removeEventListener(EVENT.COMPONENT_ADD, this.addRigidbodyToWorld);
          this.removeEventListener(EVENT.COMPONENT_REMOVE, this.removeRigidbodyFromWorld);
          // this.node.removeEventListener(EVENT.NODE_ACTIVATE, this.addRigidbodyToWorld, true); // use capture to react to broadcast!
          this.node.removeEventListener(EVENT.NODE_DEACTIVATE, this.hndNodeDeactivate, true);
          this.removeRigidbodyFromWorld();
          break;
        case EVENT.NODE_DESERIALIZED:
          if (!this.node.cmpTransform)
            Debug.error("ComponentRigidbody attached to node missing ComponentTransform", this.node);
          break;
      }
    };

    //#region Creation
    private create(_mass: number = 1, _type: BODY_TYPE = BODY_TYPE.DYNAMIC, _colliderType: COLLIDER_TYPE = COLLIDER_TYPE.CUBE, _group: COLLISION_GROUP = Physics.settings.defaultCollisionGroup, _mtxTransform: Matrix4x4 = null, _convexMesh: Float32Array = null): void {
      //Setting up all incoming values to be internal values
      this.convexMesh = _convexMesh;
      this.#typeBody = _type;
      this.#collisionGroup = _group;
      this.#typeCollider = _colliderType;
      this.mass = _mass;
      this.#restitution = Physics.settings.defaultRestitution;
      this.#friction = Physics.settings.defaultFriction;
      this.collisionMask = Physics.settings.defaultCollisionMask;
      //Create the actual rigidbody in the OimoPhysics Space
      this.createRigidbody(_mass, _type, this.#typeCollider, _mtxTransform, this.#collisionGroup);

      // Event Callbacks directly from OIMO Physics
      this.#callbacks = new OIMO.ContactCallback(); //fehm
      this.#callbacks.beginTriggerContact = this.triggerEnter;
      this.#callbacks.endTriggerContact = this.triggerExit;
      this.#callbacks.postSolve = this.collisionEnter; // use postSolve for collisionEnter to get the impulse
      this.#callbacks.endContact = this.collisionExit;
    }

    /** Creates the actual OimoPhysics Rigidbody out of informations the FUDGE Component has. */
    private createRigidbody(_mass: number, _type: BODY_TYPE, _colliderType: COLLIDER_TYPE, _mtxTransform: Matrix4x4, _collisionGroup: COLLISION_GROUP = COLLISION_GROUP.DEFAULT): void {
      let oimoType: number; //Need the conversion from simple enum to number because if enum is defined as Oimo.RigidyBodyType you have to include Oimo to use FUDGE at all
      switch (_type) {
        case BODY_TYPE.DYNAMIC:
          oimoType = OIMO.RigidBodyType.DYNAMIC;
          break;
        case BODY_TYPE.STATIC:
          oimoType = OIMO.RigidBodyType.STATIC;
          break;
        case BODY_TYPE.KINEMATIC:
          oimoType = OIMO.RigidBodyType.KINEMATIC;
          break;
        default:
          oimoType = OIMO.RigidBodyType.DYNAMIC;
          break;
      }

      // remove all previous shapes from world. Necessary?
      // while (this.#rigidbody && this.#rigidbody.getShapeList() != null)
      //   this.#rigidbody.removeShape(this.#rigidbody.getShapeList());

      let tmpTransform: Matrix4x4 = _mtxTransform == null ? super.node != null ? super.node.mtxWorld : Matrix4x4.IDENTITY() : _mtxTransform; //Get transform informations from the world, since physics does not care about hierarchy
      //Convert informations from FUDGE to OimoPhysics and creating a collider with it, while also adding a pivot to derivate from the transform informations if needed
      let scale: OIMO.Vec3 = new OIMO.Vec3((tmpTransform.scaling.x * this.mtxPivot.scaling.x) / 2, (tmpTransform.scaling.y * this.mtxPivot.scaling.y) / 2, (tmpTransform.scaling.z * this.mtxPivot.scaling.z) / 2);
      let position: OIMO.Vec3 = new OIMO.Vec3(tmpTransform.translation.x + this.mtxPivot.translation.x, tmpTransform.translation.y + this.mtxPivot.translation.y, tmpTransform.translation.z + this.mtxPivot.translation.z);
      let rotation: OIMO.Vec3 = new OIMO.Vec3(tmpTransform.rotation.x + this.mtxPivot.rotation.x, tmpTransform.rotation.y + this.mtxPivot.rotation.y, tmpTransform.rotation.z + this.mtxPivot.rotation.z);
      this.createCollider(scale, _colliderType);
      //Setting informations about mass, position/rotation and physical reaction type
      this.#massData.mass = _mass; //_type != PHYSICS_TYPE.STATIC ? _mass : 0; //If a object is static it acts as if it has no mass
      this.#rigidbodyInfo.type = oimoType;
      this.#rigidbodyInfo.position = position;
      this.#rigidbodyInfo.rotation.fromEulerXyz(new OIMO.Vec3(rotation.x, rotation.y, rotation.z)); //Convert eulerAngles in degree to the internally used quaternions
      //Creating the actual rigidbody and it's collider
      this.#rigidbody = new OIMO.RigidBody(this.#rigidbodyInfo);
      this.#collider = new OIMO.Shape(this.#colliderInfo);
      //Filling the additional settings and informations the rigidbody needs. Who is colliding, how is the collision handled (damping, influence factors)
      this.#collider.userData = this;
      this.#collider.setCollisionGroup(_collisionGroup);
      this.#collider.setCollisionMask(this.collisionMask);
      this.#rigidbody.addShape(this.#collider);
      this.#rigidbody.setMassData(this.#massData);
      this.#rigidbody.getShapeList().setRestitution(this.#restitution);
      this.#rigidbody.getShapeList().setFriction(this.#friction);
      this.#rigidbody.getShapeList().setContactCallback(this.#callbacks);
      this.#rigidbody.setLinearDamping(this.#dampingLinear);
      this.#rigidbody.setAngularDamping(this.#dampingAngular);
      this.#rigidbody.setGravityScale(this.#effectGravity);
      this.#rigidbody.setRotationFactor(new OIMO.Vec3(this.#effectRotation.x, this.#effectRotation.y, this.#effectRotation.z));
    }

    /** Creates a collider a shape that represents the object in the physical world.  */
    private createCollider(_scale: OIMO.Vec3, _colliderType: COLLIDER_TYPE): void {
      let shapeConf: OIMO.ShapeConfig = new OIMO.ShapeConfig(); //Collider with geometry and infos like friction/restitution and more
      let geometry: OIMO.Geometry;
      if (this.typeCollider != _colliderType) //If the collider type was changed set the internal one new, else don't so there is not infinite set calls
        this.typeCollider = _colliderType;
      switch (_colliderType) {  //Create a different OimoPhysics geometry based on the given type. That is only the mathematical shape of the collider
        case COLLIDER_TYPE.CUBE:
          geometry = new OIMO.BoxGeometry(_scale);
          break;
        case COLLIDER_TYPE.SPHERE:
          geometry = new OIMO.SphereGeometry(_scale.x);
          break;
        case COLLIDER_TYPE.CAPSULE:
          geometry = new OIMO.CapsuleGeometry(_scale.x, _scale.y);
          break;
        case COLLIDER_TYPE.CYLINDER:
          geometry = new OIMO.CylinderGeometry(_scale.x, _scale.y);
          break;
        case COLLIDER_TYPE.CONE:
          geometry = new OIMO.ConeGeometry(_scale.x, _scale.y);
          break;
        case COLLIDER_TYPE.PYRAMID:
          geometry = this.createConvexGeometryCollider(this.createPyramidVertices(), _scale);
          break;
        case COLLIDER_TYPE.CONVEX:
          geometry = this.createConvexGeometryCollider(this.convexMesh, _scale);
          break;
      }
      shapeConf.geometry = geometry;
      this.#colliderInfo = shapeConf; //the configuration informations that are used to add an actual collider to the rigidbody in createRigidbody
    }

    /** Creating a shape that represents a in itself closed form, out of the given vertices. */
    private createConvexGeometryCollider(_vertices: Float32Array, _scale: OIMO.Vec3): OIMO.ConvexHullGeometry {
      let verticesAsVec3: OIMO.Vec3[] = new Array(); //Convert FUDGE Vector3 to OimoVec3
      for (let i: number = 0; i < _vertices.length; i += 3) { //3 Values for one point
        verticesAsVec3.push(new OIMO.Vec3(_vertices[i] * _scale.x, _vertices[i + 1] * _scale.y, _vertices[i + 2] * _scale.z));
      }
      return new OIMO.ConvexHullGeometry(verticesAsVec3); //Tell OimoPhysics to create a hull that involves all points but close it of. A convex shape can not have a hole in it.
    }

    /** Internal implementation of vertices that construct a pyramid. The vertices of the implemented pyramid mesh can be used too. But they are halfed and double sided, so it's more performant to use this. */
    private createPyramidVertices(): Float32Array {
      let vertices: Float32Array = new Float32Array([
        /*0*/-1, 0, 1, /*1*/ 1, 0, 1,  /*2*/ 1, 0, -1, /*3*/ -1, 0, -1,
        /*4*/ 0, 2, 0
      ]);
      return vertices;
    }

    /** Adding this ComponentRigidbody to the Physiscs.world giving the oimoPhysics system the information needed */
    private addRigidbodyToWorld = (): void => {
      if (!this.#rigidbody._world)
        Physics.addRigidbody(this);
    };

    /** Capture only events that are broadcast to this node from an ancestor. Don't capture events that get send to descendants. */
    private hndNodeDeactivate = (_event: Event): void => {
      let path: Node[] = this.node.getPath();
      if (!path.includes(<Node>_event.target))
        return;

      this.removeRigidbodyFromWorld();
    };

    /** Removing this ComponentRigidbody from the Physiscs.world taking the informations from the oimoPhysics system */
    private removeRigidbodyFromWorld = (): void => {
      Physics.removeRigidbody(this);
      this.isInitialized = false;
    };

    //#region private EVENT functions
    //Calculating the center of a collision as a singular point - in case there is more than one point - by getting the geometrical center of all colliding points
    private collisionCenterPoint(_colPoints: OIMO.ManifoldPoint[], _numPoints: number): Vector3 {
      let totalPoints: number = 0;
      let totalX: number = 0;
      let totalY: number = 0;
      let totalZ: number = 0;
      _colPoints.forEach((_value: OIMO.ManifoldPoint): void => {
        if (totalPoints < _numPoints) {
          totalPoints++;
          totalX += _value.getPosition2().x;
          totalY += _value.getPosition2().y;
          totalZ += _value.getPosition2().z;
        }
      });
      return new Vector3(totalX / _numPoints, totalY / _numPoints, totalZ / _numPoints);;
    }
    //#endregion

    private collisionEnter(_contact: OIMO.Contact): void {
      let bodyA: ComponentRigidbody = _contact.getShape1()?.userData;
      let bodyB: ComponentRigidbody = _contact.getShape2()?.userData;

      if (!bodyA || !bodyB || bodyA.collisions.includes(bodyB)) // already entered
        return;

      bodyA.collisions.push(bodyB);
      bodyB.collisions.push(bodyA);

      // TODO: maybe rather expose the manifold to the event or something
      let manifold: OIMO.Manifold = _contact.getManifold();
      let points: OIMO.ManifoldPoint[] = manifold.getPoints(); // All points in the collision where the two bodies are touching, used to calculate the full impact
      let normalImpulse: number = 0;
      let tangentImpulse: number = 0;
      let binormalImpulse: number = 0;
      for (let manifoldPoint of points) { // The impact of the collision involving all touching points
        normalImpulse += manifoldPoint.getNormalImpulse();
        tangentImpulse += manifoldPoint.getTangentImpulse();
        binormalImpulse += manifoldPoint.getBinormalImpulse();
      }
      let normal: OIMO.Vec3 = manifold.getNormal();
      let collisionNormal: Vector3 = new Vector3(normal.x, normal.y, normal.z);
      let collisionCenterPoint: Vector3 = bodyA.collisionCenterPoint(points, manifold.getNumPoints());
      bodyA.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_ENTER, bodyB, normalImpulse, tangentImpulse, binormalImpulse, collisionCenterPoint, collisionNormal));
      bodyB.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_ENTER, bodyA, normalImpulse, tangentImpulse, binormalImpulse, collisionCenterPoint, collisionNormal));
    }

    private collisionExit(_contact: OIMO.Contact): void {
      let bodyA: ComponentRigidbody = _contact.getShape1()?.userData;
      let bodyB: ComponentRigidbody = _contact.getShape2()?.userData;

      if (!bodyA || !bodyB || !bodyA.collisions.includes(bodyB)) // already exited
        return;

      bodyA.collisions.splice(bodyA.collisions.indexOf(bodyB), 1);
      bodyB.collisions.splice(bodyB.collisions.indexOf(bodyA), 1);

      bodyA.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_EXIT, bodyB, 0, 0, 0));
      bodyB.dispatchEvent(new EventPhysics(EVENT_PHYSICS.COLLISION_EXIT, bodyA, 0, 0, 0));
    }

    /**
    * Trigger EnteringEvent Callback, automatically called by OIMO Physics within their calculations.
    * Since the event does not know which body is the trigger iniator, the event can be listened to
    * on either the trigger or the triggered. (This is only possible with the FUDGE OIMO Fork!)
    */
    private triggerEnter(_contact: OIMO.Contact): void {
      let bodyA: ComponentRigidbody = _contact.getShape1()?.userData;
      let bodyB: ComponentRigidbody = _contact.getShape2()?.userData;

      if (!bodyA || !bodyB || bodyA.triggerings.includes(bodyB)) // already entered
        return;

      bodyA.triggerings.push(bodyB);
      bodyB.triggerings.push(bodyA);

      let manifold: OIMO.Manifold = _contact.getManifold();
      let points: OIMO.ManifoldPoint[] = manifold.getPoints();
      let normal: OIMO.Vec3 = manifold.getNormal();
      let collisionNormal: Vector3 = new Vector3(normal.x, normal.y, normal.z);
      let collisionCenterPoint: Vector3 = bodyA.collisionCenterPoint(points, manifold.getNumPoints());

      bodyA.dispatchEvent(new EventPhysics(EVENT_PHYSICS.TRIGGER_ENTER, bodyB, 0, 0, 0, collisionCenterPoint, collisionNormal));
      bodyB.dispatchEvent(new EventPhysics(EVENT_PHYSICS.TRIGGER_ENTER, bodyA, 0, 0, 0, collisionCenterPoint, collisionNormal));
    }

    /**
    * Trigger LeavingEvent Callback, automatically called by OIMO Physics within their calculations.
    * Since the event does not know which body is the trigger iniator, the event can be listened to
    * on either the trigger or the triggered. (This is only possible with the FUDGE OIMO Fork!)
    */
    private triggerExit(_contact: OIMO.Contact): void {
      let bodyA: ComponentRigidbody = _contact.getShape1()?.userData;
      let bodyB: ComponentRigidbody = _contact.getShape2()?.userData;

      if (!bodyA || !bodyB || !bodyA.triggerings.includes(bodyB)) // already exited
        return;

      bodyA.triggerings.splice(bodyA.collisions.indexOf(bodyB), 1);
      bodyB.triggerings.splice(bodyB.collisions.indexOf(bodyA), 1);

      bodyA.dispatchEvent(new EventPhysics(EVENT_PHYSICS.TRIGGER_EXIT, bodyB, 0, 0, 0));
      bodyB.dispatchEvent(new EventPhysics(EVENT_PHYSICS.TRIGGER_EXIT, bodyA, 0, 0, 0));
    }
    //#endregion
  }
}
