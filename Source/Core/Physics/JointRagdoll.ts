namespace FudgeCore {
  /**
    * A physical connection between two bodies, designed to simulate behaviour within a real body. It has two axis, a swing and twist axis, and also the perpendicular axis, 
    * similar to a Spherical joint, but more restrictive in it's angles and only two degrees of freedom. Two RigidBodies need to be defined to use it. Mostly used to create humanlike joints that behave like a 
    * lifeless body.
    * ```text        
    *                  
    *                      anchor - it can twist on one axis and swing on another
    *                            │
    *         z            ┌───┐ │ ┌───┐
    *         ↑            │   │ ↓ │   │        e.g. z = TwistAxis, it can rotate in-itself around this axis 
    *    -x ←─┼─→ x        │   │ x │   │        e.g. x = SwingAxis, it can rotate anchored around the base on this axis   
    *         ↓            │   │   │   │           
    *        -z            └───┘   └───┘         e.g. you can twist the leg in-itself to a certain degree,
    *                                                     but also rotate it forward/backward/left/right to a certain degree
    *                bodyAnchor          bodyTied
    *              (e.g. pelvis)         (e.g. upper-leg)
    * 
    * ```
    * Twist equals a rotation around a point without moving on an axis.
    * Swing equals a rotation on a point with a moving local axis.
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
    */
  export class JointRagdoll extends Joint {
    public static readonly iSubclass: number = Joint.registerSubclass(JointRagdoll);

    protected joint: OIMO.RagdollJoint;
    protected config: OIMO.RagdollJointConfig = new OIMO.RagdollJointConfig();

    #springDampingTwist: number = 0;
    #springFrequencyTwist: number = 0;

    #springDampingSwing: number = 0;
    #springFrequencySwing: number = 0;

    #maxMotorTwist: number = 360 * Calc.deg2rad;
    #minMotorTwist: number = 0;
    #motorTorqueTwist: number = 0;
    #motorSpeedTwist: number = 0;

    #motorTwist: OIMO.RotationalLimitMotor;
    #springDamperTwist: OIMO.SpringDamper;
    #springDamperSwing: OIMO.SpringDamper;
    #axisFirst: Vector3;
    #axisSecond: Vector3;

    #maxAngleFirst: number = 0;
    #maxAngleSecond: number = 0;

    public constructor(_bodyAnchor: ComponentRigidbody = null, _bodyTied: ComponentRigidbody = null, _axisFirst: Vector3 = new Vector3(1, 0, 0), _axisSecond: Vector3 = new Vector3(0, 0, 1), _localAnchor: Vector3 = new Vector3(0, 0, 0)) {
      super(_bodyAnchor, _bodyTied);
      this.axisFirst = _axisFirst;
      this.axisSecond = _axisSecond;
      this.anchor = _localAnchor;
    }

    //#region Get/Set transfor of fudge properties to the physics engine
    /**
     * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
     *  When changed after initialization the joint needs to be reconnected.
     */
    @type(Vector3)
    public get axisFirst(): Vector3 {
      return this.#axisFirst;
    }
    public set axisFirst(_value: Vector3) {
      this.#axisFirst = _value;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
    * The axis connecting the the two {@link Node}s e.g. Vector3(0,1,0) to have a upward connection.
    *  When changed after initialization the joint needs to be reconnected.
    */
    @type(Vector3)
    public get axisSecond(): Vector3 {
      return this.#axisSecond;
    }
    public set axisSecond(_value: Vector3) {
      this.#axisSecond = _value;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
     * The maximum angle of rotation along the first axis. Value needs to be positive. Changes do rebuild the joint
     */
    @type(Number)
    public get maxAngleFirstAxis(): number {
      return this.#maxAngleFirst * Calc.rad2deg;
    }
    public set maxAngleFirstAxis(_value: number) {
      this.#maxAngleFirst = _value * Calc.deg2rad;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
     * The maximum angle of rotation along the second axis. Value needs to be positive. Changes do rebuild the joint
     */
    @type(Number)
    public get maxAngleSecondAxis(): number {
      return this.#maxAngleSecond * Calc.rad2deg;
    }
    public set maxAngleSecondAxis(_value: number) {
      this.#maxAngleSecond = _value * Calc.deg2rad;
      this.disconnect();
      this.dirtyStatus();
    }

    /**
     * The damping of the spring. 1 equals completly damped.
     */
    @type(Number)
    public get springDampingTwist(): number {
      return this.#springDampingTwist;
    }
    public set springDampingTwist(_value: number) {
      this.#springDampingTwist = _value;
      if (this.joint != null) this.joint.getTwistSpringDamper().dampingRatio = _value;
    }

    /**
     * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
    */
    @type(Number)
    public get springFrequencyTwist(): number {
      return this.#springFrequencyTwist;
    }
    public set springFrequencyTwist(_value: number) {
      this.#springFrequencyTwist = _value;
      if (this.joint != null) this.joint.getTwistSpringDamper().frequency = _value;
    }

    /**
     * The damping of the spring. 1 equals completly damped.
     */
    @type(Number)
    public get springDampingSwing(): number {
      return this.#springDampingSwing;
    }
    public set springDampingSwing(_value: number) {
      this.#springDampingSwing = _value;
      if (this.joint != null) this.joint.getSwingSpringDamper().dampingRatio = _value;
    }

    /**
     * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
    */
    @type(Number)
    public get springFrequencySwing(): number {
      return this.#springFrequencySwing;
    }
    public set springFrequencySwing(_value: number) {
      this.#springFrequencySwing = _value;
      if (this.joint != null) this.joint.getSwingSpringDamper().frequency = _value;
    }

    /**
      * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
     */
    @type(Number)
    public get maxMotorTwist(): number {
      return this.#maxMotorTwist * Calc.rad2deg;
    }
    public set maxMotorTwist(_value: number) {
      _value *= Calc.deg2rad;
      this.#maxMotorTwist = _value;
      if (this.joint != null) this.joint.getTwistLimitMotor().upperLimit = _value;
    }

    /**
     * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
     */
    @type(Number)
    public get minMotorTwist(): number {
      return this.#minMotorTwist * Calc.rad2deg;
    }
    public set minMotorTwist(_value: number) {
      _value *= Calc.deg2rad;
      this.#minMotorTwist = _value;
      if (this.joint != null) this.joint.getTwistLimitMotor().lowerLimit = _value;
    }

    /**
      * The target rotational speed of the motor in m/s. 
     */
    @type(Number)
    public get motorSpeedTwist(): number {
      return this.#motorSpeedTwist;
    }
    public set motorSpeedTwist(_value: number) {
      this.#motorSpeedTwist = _value;
      if (this.joint != null) this.joint.getTwistLimitMotor().motorSpeed = _value;
    }

    /**
      * The maximum motor torque in Newton. force <= 0 equals disabled. 
     */
    @type(Number)
    public get motorTorqueTwist(): number {
      return this.#motorTorqueTwist;
    }
    public set motorTorqueTwist(_value: number) {
      this.#motorTorqueTwist = _value;
      if (this.joint != null) this.joint.getTwistLimitMotor().motorTorque = _value;
    }

    //#endregion

    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _selection, _dispatchMutate);
      if (_mutator.axisFirst)
        this.axisFirst = this.axisFirst;
      if (_mutator.axisSecond)
        this.axisSecond = this.axisSecond;
    }

    protected constructJoint(): void {
      this.#springDamperTwist = new OIMO.SpringDamper().setSpring(this.#springFrequencyTwist, this.#springDampingTwist);
      this.#springDamperSwing = new OIMO.SpringDamper().setSpring(this.#springFrequencySwing, this.#springDampingSwing);

      this.#motorTwist = new OIMO.RotationalLimitMotor().setLimits(this.#minMotorTwist, this.#maxMotorTwist);
      this.#motorTwist.setMotor(this.#motorSpeedTwist, this.#motorTorqueTwist);

      this.config = new OIMO.RagdollJointConfig();
      const axisFirst: OIMO.Vec3 = new OIMO.Vec3(this.#axisFirst.x, this.#axisFirst.y, this.#axisFirst.z);
      const axisSecond: OIMO.Vec3 = new OIMO.Vec3(this.#axisSecond.x, this.#axisSecond.y, this.#axisSecond.z);
      super.constructJoint(axisFirst, axisSecond);
      this.config.swingSpringDamper = this.#springDamperSwing;
      this.config.twistSpringDamper = this.#springDamperTwist;
      this.config.twistLimitMotor = this.#motorTwist;
      this.config.maxSwingAngle1 = this.#maxAngleFirst;
      this.config.maxSwingAngle2 = this.#maxAngleSecond;

      this.joint = new OIMO.RagdollJoint(this.config);
      super.configureJoint();
    }
  }
}