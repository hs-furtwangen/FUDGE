namespace FudgeCore {
  function getConnectOptions(this: Joint): Record<string, Node> {
    const options: Record<string, Node> = {};
    for (const child of this.node.getChildren())
      if (child.getComponent(ComponentRigidbody))
        options[child.name] = child;

    return options;
  }

  /**
   * Acts as the physical representation of a connection between two {@link Node}'s.
   * The type of conncetion is defined by the subclasses like prismatic joint, cylinder joint etc.
   * A Rigidbody on the {@link Node} that this component is added to is needed. Setting the connectedRigidbody and
   * initializing the connection creates a physical connection between them. This differs from a connection through hierarchy
   * in the node structure of fudge. Joints can have different DOF's (Degrees Of Freedom), 1 Axis that can either twist or swing is a degree of freedom.
   * A joint typically consists of a motor that limits movement/rotation or is activly trying to move to a limit. And a spring which defines the rigidity.
   * @author Marko Fehrenbach, HFU 2020 | Jonas Plotzky, HFU, 2025
   */
  @orderFlat
  export abstract class Joint extends Component {
    /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    public static readonly baseClass: typeof Joint = Joint;
    /** list of all the subclasses derived from this class, if they registered properly*/
    public static readonly subclasses: typeof Joint[] = [];

    protected singleton: boolean = false; //Multiple joints can be attached to one Node

    #bodyAnchor: ComponentRigidbody;
    #bodyTied: ComponentRigidbody;

    #connected: boolean = false;
    #anchor: Vector3;
    #internalCollision: boolean = false;

    #breakForce: number = 0;
    #breakTorque: number = 0;

    // TODO: property exists solely for backwards compatibility, remove in future versions
    #nameChildToConnect: string = "";

    #connectedChild: Node;

    protected abstract joint: OIMO.Joint;
    protected abstract config: OIMO.JointConfig;

    /** Create a joint connection between the two given RigidbodyComponents. */
    public constructor(_bodyAnchor: ComponentRigidbody = null, _bodyTied: ComponentRigidbody = null) {
      super();
      this.bodyAnchor = _bodyAnchor;
      this.bodyTied = _bodyTied;

      /*
        Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
        actual constraint ain't existent until the game starts
      */
      this.addEventListener(EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    protected static registerSubclass(_subclass: typeof Joint): number { return Joint.subclasses.push(_subclass) - 1; }

    /** Check if connection is dirty, so when either rb is changed disconnect and reconnect. Internally used no user interaction needed. */
    public get isConnected(): boolean {
      return this.#connected;
    }

    /** Get/Set the first ComponentRigidbody of this connection. It should always be the one that this component is attached too in the sceneTree. */
    public get bodyAnchor(): ComponentRigidbody {
      return this.#bodyAnchor;
    }

    public set bodyAnchor(_cmpRB: ComponentRigidbody) {
      this.#bodyAnchor = _cmpRB;
      this.disconnect();
      this.dirtyStatus();
    }

    /** Get/Set the second ComponentRigidbody of this connection. */
    public get bodyTied(): ComponentRigidbody {
      return this.#bodyTied;
    }

    public set bodyTied(_cmpRB: ComponentRigidbody) {
      this.#bodyTied = _cmpRB;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
     * The exact position where the two {@link Node}s are connected. When changed after initialization the joint needs to be reconnected.
     */
    @order(3)
    @edit(Vector3)
    public get anchor(): Vector3 {
      return this.#anchor;
    }

    public set anchor(_value: Vector3) {
      this.#anchor = _value;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
     * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default) 
     */
    @order(4)
    @edit(Number)
    public get breakTorque(): number {
      return this.#breakTorque;
    }

    public set breakTorque(_value: number) {
      this.#breakTorque = _value;
      this.joint?.setBreakTorque(this.#breakTorque);
    }

    /**
     * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default) 
     */
    @order(5)
    @edit(Number)
    public get breakForce(): number {
      return this.#breakForce;
    }

    public set breakForce(_value: number) {
      this.#breakForce = _value;
      this.joint?.setBreakForce(this.#breakForce);
    }

    /**
     * If the two connected RigidBodies collide with eath other. (Default = false)
     * On a welding joint the connected bodies should not be colliding with each other,
     * for best results
     */
    @order(1)
    @edit(Boolean)
    public get internalCollision(): boolean {
      return this.#internalCollision;
    }

    public set internalCollision(_value: boolean) {
      this.#internalCollision = _value;
      this.joint?.setAllowCollision(this.#internalCollision);
    }

    @order(2)
    @assign(getConnectOptions)
    @edit(Node)
    protected get connectedChild(): Node {
      return this.#connectedChild;
    }

    protected set connectedChild(_node: Node) {
      if (_node == null) {
        this.#bodyAnchor = null;
        this.#bodyTied = null;
        this.disconnect();
        this.dirtyStatus();
        this.#connectedChild = _node;
      }

      if (this.connectNode(_node)) {
        this.#connectedChild = _node;
        return;
      }
    }

    /**
     * Connect a child node with the given name to the joint.
     */
    public connectChild(_name: string): void {
      if (!this.node)
        return;

      let child: Node = this.node.getChildByName(_name);
      if (child)
        this.connectNode(child);
      else
        Debug.warn(`${this.constructor.name} at ${this.node.name} fails to connect child with non existent or ambigous name ${_name}`);
    }

    /**
     * Connect the given node to the joint. Tieing its rigidbody to the nodes rigidbody this component is attached to.
     */
    public connectNode(_node: Node): boolean {
      if (!this.node || !_node)
        return false;

      Debug.fudge(`${this.constructor.name} connected ${this.node.name} and ${_node.name}`);

      let connectBody: ComponentRigidbody = _node.getComponent(ComponentRigidbody);
      let thisBody: ComponentRigidbody = this.node.getComponent(ComponentRigidbody);

      if (!connectBody || !thisBody) {
        Debug.warn(`${this.constructor.name}: Connecting node "${this.node.name}" to node "${_node.name}" failed. ${!connectBody ? `"${_node.name}" has no rigidbody attached.` : ""} ${!thisBody ? `"${this.node.name}" has no rigidbody attached.` : ""}`);
        return false;
      }

      this.bodyAnchor = thisBody;
      this.bodyTied = connectBody;
      return true;
    }

    /**
     * Initializing and connecting the two rigidbodies with the configured joint properties
     * is automatically called by the physics system. No user interaction needed.
     */
    public connect(): void {
      if (this.#connected == false) {
        if (!this.#bodyAnchor || !this.#bodyTied) {

          // TODO: backwards compatibility, remove in future versions
          if (this.#nameChildToConnect && !this.#connectedChild)
            this.#connectedChild = this.node.getChildByName(this.#nameChildToConnect);

          if (this.#connectedChild)
            this.connectNode(this.#connectedChild);

          return;
        }

        this.constructJoint();
        this.#connected = true;
        this.addJoint();
      }
    }

    /**
     * Disconnecting the two rigidbodies and removing them from the physics system,
     * is automatically called by the physics system. No user interaction needed.
     */
    public disconnect(): void {
      if (this.#connected == true) {
        this.removeJoint();
        this.#connected = false;
      }
    }

    /**
     * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
     * Only to be used when functionality that is not added within FUDGE is needed.
    */
    public getOimoJoint(): OIMO.Joint {
      return this.joint;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);

      // TODO: backwards compatibility, remove in future versions
      if (_serialization.nameChildToConnect != undefined) 
        this.#nameChildToConnect = _serialization.nameChildToConnect;

      return this;
    }

    public async mutate(_mutator: Mutator, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _dispatchMutate);
      if (_mutator.anchor)
        this.anchor = this.anchor;
    }

    /** Tell the FudgePhysics system that this joint needs to be handled in the next frame. */
    protected dirtyStatus(): void {
      Physics.changeJointStatus(this);
    }

    protected addJoint(): void {
      Physics.addJoint(this);
    }

    protected removeJoint(): void {
      Physics.removeJoint(this);
    }

    protected constructJoint(..._configParams: Object[]): void {
      let posBodyAnchor: Vector3 = this.bodyAnchor.node.mtxWorld.translation; //Setting the anchor position locally from the first rigidbody
      let worldAnchor: OIMO.Vec3 = new OIMO.Vec3(posBodyAnchor.x + this.#anchor.x, posBodyAnchor.y + this.#anchor.y, posBodyAnchor.z + this.#anchor.z);

      // @ts-ignore    // unfortunately, method init is not a member of the base class OIMO.JointConfig
      this.config.init(this.#bodyAnchor.getOimoRigidbody(), this.#bodyTied.getOimoRigidbody(), worldAnchor, ..._configParams);
    }

    protected configureJoint(): void {
      this.joint.setBreakForce(this.breakForce);
      this.joint.setBreakTorque(this.breakTorque);
      this.joint.setAllowCollision(this.#internalCollision);
    }

    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case EVENT.COMPONENT_ADD:
          this.node.addEventListener(EVENT.DISCONNECT_JOINT, () => { this.disconnect(); this.dirtyStatus(); }, true);
          this.dirtyStatus();
          break;
        case EVENT.COMPONENT_REMOVE:
          this.node.removeEventListener(EVENT.DISCONNECT_JOINT, () => { this.disconnect(); this.dirtyStatus(); }, true);
          this.removeJoint();
          break;
      }
    };
  }
}