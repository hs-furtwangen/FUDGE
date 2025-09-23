namespace FudgeCore {
  /**
     * Base class for joints operating with exactly one axis
     * @author Jirka Dell'Oro-Friedl, HFU, 2021
   */
  export abstract class JointAxial extends Joint {
    protected springDamper: OIMO.SpringDamper;

    //Internal Variables
    #maxMotor: number = 10;
    #minMotor: number = -10;
    #motorSpeed: number = 0;
    #axis: Vector3;
    #springFrequency: number = 0;
    #springDamping: number = 0;

    /** Creating a cylindrical joint between two ComponentRigidbodies moving on one axis and rotating around another bound on a local anchorpoint. */
    public constructor(_bodyAnchor: ComponentRigidbody = null, _bodyTied: ComponentRigidbody = null, _axis: Vector3 = new Vector3(0, 1, 0), _localAnchor: Vector3 = new Vector3(0, 0, 0)) {
      super(_bodyAnchor, _bodyTied);
      this.axis = _axis;
      this.anchor = _localAnchor;
      this.minMotor = -10;
      this.maxMotor = 10;
    }

    //#region Get/Set transfor of fudge properties to the physics engine
    /**
     * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
     *  When changed after initialization the joint needs to be reconnected.
     */
    @mutate(Vector3)
    public get axis(): Vector3 {
      return this.#axis;
    }
    public set axis(_value: Vector3) {
      this.#axis = _value;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
      * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. 
     */
    @mutate(Number)
    public get maxMotor(): number {
      return this.#maxMotor;
    }

    public set maxMotor(_value: number) {
      this.#maxMotor = _value;
      if ((<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint)?.getLimitMotor)
        (<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint).getLimitMotor().upperLimit = _value;
    }

    /**
      * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
     */
    @mutate(Number)
    public get minMotor(): number {
      return this.#minMotor;
    }
    public set minMotor(_value: number) {
      this.#minMotor = _value;
      if ((<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint)?.getLimitMotor)
        (<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint).getLimitMotor().lowerLimit = _value;
    }

    /**
     * The target speed of the motor in m/s.
     */
    @mutate(Number)
    public get motorSpeed(): number {
      return this.#motorSpeed;
    }

    public set motorSpeed(_value: number) {
      this.#motorSpeed = _value;
      if ((<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint)?.getLimitMotor)
        (<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint).getLimitMotor().motorSpeed = _value;
    }

    /**
     * The damping of the spring. 1 equals completly damped.
     */
    @mutate(Number)
    public get springDamping(): number {
      return this.#springDamping;
    }
    public set springDamping(_value: number) {
      this.#springDamping = _value;
      if ((<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint)?.getSpringDamper)
        (<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint).getSpringDamper().dampingRatio = _value;
    }

    /**
     * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
    */
    @mutate(Number)
    public get springFrequency(): number {
      return this.#springFrequency;
    }
    public set springFrequency(_value: number) {
      this.#springFrequency = _value;
      if ((<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint)?.getSpringDamper)
        (<OIMO.PrismaticJoint | OIMO.RevoluteJoint>this.joint).getSpringDamper().frequency = _value;
    }
    //#endregion

    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _selection, _dispatchMutate);
      if (_mutator.axis)
        this.axis = this.axis;
    }

    protected constructJoint(): void {
      this.springDamper = new OIMO.SpringDamper().setSpring(this.#springFrequency, this.#springDamping);
      const worldAxis: OIMO.Vec3 = new OIMO.Vec3(this.#axis.x, this.#axis.y, this.#axis.z);
      super.constructJoint(worldAxis);
    }
  }
}