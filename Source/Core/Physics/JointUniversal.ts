namespace FudgeCore {
  /**
     * A physical connection between two bodies with two defined axis (normally e.g. (0,0,1) and rotation(1,0,0)), they share the same anchor and have free rotation, but transfer the twist.
     * In reality used in cars to transfer the more stable stationary force on the velocity axis to the bumping, damped moving wheel. Two RigidBodies need to be defined to use it.
     * The two motors can be defined for the two rotation axis, along with springs. 
     * ```text        
     *                  
     *                      anchor - twist is transfered between bodies
     *         z                   |
     *         ↑            -----  |  ------------
     *         |           |     | ↓ |            | 
     *  -x <---|---> x     |     | x |            |           e.g. wheel can still turn up/down, 
     *         |           |     |   |            |           left right but transfering it's rotation on to the wheel-axis.
     *         ↓            -----     ------------
     *        -z    
     *                 attachedRB          connectedRB
     *                (e.g. wheel)       (e.g. wheel-axis)
     * ```
   * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
     */
  export class JointUniversal extends Joint {
    public static readonly iSubclass: number = Joint.registerSubclass(JointUniversal);

    protected joint: OIMO.UniversalJoint;
    protected config: OIMO.UniversalJointConfig = new OIMO.UniversalJointConfig();

    #springDampingFirst: number = 0;
    #springFrequencyFirst: number = 0;

    #springDampingSecond: number = 0;
    #springFrequencySecond: number = 0;

    #maxRotorFirst: number = 360;
    #minRotorFirst: number = 0;
    #rotorTorqueFirst: number = 0;
    #rotorSpeedFirst: number = 0;

    #maxRotorSecond: number = 360;
    #minRotorSecond: number = 0;
    #rotorTorqueSecond: number = 0;
    #rotorSpeedSecond: number = 0;

    #motorFirst: OIMO.RotationalLimitMotor;
    #motorSecond: OIMO.RotationalLimitMotor;
    #axisSpringDamperFirst: OIMO.SpringDamper;
    #axisSpringDamperSecond: OIMO.SpringDamper;
    #axisFirst: Vector3;
    #axisSecond: Vector3;

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
     * The damping of the spring. 1 equals completly damped.
     */
    @type(Number)
    public get springDampingFirst(): number {
      return this.#springDampingFirst;
    }
    public set springDampingFirst(_value: number) {
      this.#springDampingFirst = _value;
      if (this.joint != null) this.joint.getSpringDamper1().dampingRatio = _value;
    }

    /**
     * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
    */
    @type(Number)
    public get springFrequencyFirst(): number {
      return this.#springFrequencyFirst;
    }
    public set springFrequencyFirst(_value: number) {
      this.#springFrequencyFirst = _value;
      if (this.joint != null) this.joint.getSpringDamper1().frequency = _value;
    }

    /**
     * The damping of the spring. 1 equals completly damped.
     */
    @type(Number)
    public get springDampingSecond(): number {
      return this.#springDampingSecond;
    }
    public set springDampingSecond(_value: number) {
      this.#springDampingSecond = _value;
      if (this.joint != null) this.joint.getSpringDamper2().dampingRatio = _value;
    }

    /**
     * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
    */
    @type(Number)
    public get springFrequencySecond(): number {
      return this.#springFrequencySecond;
    }
    public set springFrequencySecond(_value: number) {
      this.#springFrequencySecond = _value;
      if (this.joint != null) this.joint.getSpringDamper2().frequency = _value;
    }

    /**
      * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
     */
    @type(Number)
    public get maxRotorFirst(): number {
      return this.#maxRotorFirst;
    }
    public set maxRotorFirst(_value: number) {
      this.#maxRotorFirst = _value;
      if (this.joint != null) this.joint.getLimitMotor1().upperLimit = _value * Calc.deg2rad;
    }

    /**
      * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
     */
    @type(Number)
    public get minRotorFirst(): number {
      return this.#minRotorFirst;
    }
    public set minRotorFirst(_value: number) {
      this.#minRotorFirst = _value;
      if (this.joint != null) this.joint.getLimitMotor1().lowerLimit = _value * Calc.deg2rad;
    }

    /**
      * The target rotational speed of the motor in m/s. 
     */
    @type(Number)
    public get rotorSpeedFirst(): number {
      return this.#rotorSpeedFirst;
    }
    public set rotorSpeedFirst(_value: number) {
      this.#rotorSpeedFirst = _value;
      if (this.joint != null) this.joint.getLimitMotor1().motorSpeed = _value;
    }

    /**
     * The maximum motor torque in Newton. force <= 0 equals disabled. 
     */
    @type(Number)
    public get rotorTorqueFirst(): number {
      return this.#rotorTorqueFirst;
    }
    public set rotorTorqueFirst(_value: number) {
      this.#rotorTorqueFirst = _value;
      if (this.joint != null) this.joint.getLimitMotor1().motorTorque = _value;
    }

    /**
     * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
     */
    @type(Number)
    public get maxRotorSecond(): number {
      return this.#maxRotorSecond;
    }
    public set maxRotorSecond(_value: number) {
      this.#maxRotorSecond = _value;
      if (this.joint != null) this.joint.getLimitMotor2().upperLimit = _value * Calc.deg2rad;
    }

    /**
      * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
     */
    @type(Number)
    public get minRotorSecond(): number {
      return this.#minRotorSecond;
    }
    public set minRotorSecond(_value: number) {
      this.#minRotorSecond = _value;
      if (this.joint != null) this.joint.getLimitMotor2().lowerLimit = _value * Calc.deg2rad;
    }

    /**
      * The target rotational speed of the motor in m/s. 
     */
    @type(Number)
    public get rotorSpeedSecond(): number {
      return this.#rotorSpeedSecond;
    }
    public set rotorSpeedSecond(_value: number) {
      this.#rotorSpeedSecond = _value;
      if (this.joint != null) this.joint.getLimitMotor2().motorSpeed = _value;
    }

    /**
      * The maximum motor torque in Newton. force <= 0 equals disabled. 
     */
    @type(Number)
    public get rotorTorqueSecond(): number {
      return this.#rotorTorqueSecond;
    }
    public set rotorTorqueSecond(_value: number) {
      this.#rotorTorqueSecond = _value;
      if (this.joint != null) this.joint.getLimitMotor2().motorTorque = _value;
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
      this.#axisSpringDamperFirst = new OIMO.SpringDamper().setSpring(this.#springFrequencyFirst, this.#springDampingFirst);
      this.#axisSpringDamperSecond = new OIMO.SpringDamper().setSpring(this.#springFrequencySecond, this.#springDampingSecond);

      this.#motorFirst = new OIMO.RotationalLimitMotor().setLimits(this.#minRotorFirst * Calc.deg2rad, this.#maxRotorFirst * Calc.deg2rad);
      this.#motorFirst.setMotor(this.#rotorSpeedFirst, this.#rotorTorqueFirst);
      this.#motorSecond = new OIMO.RotationalLimitMotor().setLimits(this.#minRotorFirst * Calc.deg2rad, this.#maxRotorFirst * Calc.deg2rad);
      this.#motorSecond.setMotor(this.#rotorSpeedFirst, this.#rotorTorqueFirst);

      this.config = new OIMO.UniversalJointConfig();
      const axisFirst: OIMO.Vec3 = new OIMO.Vec3(this.axisFirst.x, this.axisFirst.y, this.axisFirst.z);
      const axisSecond: OIMO.Vec3 = new OIMO.Vec3(this.axisSecond.x, this.axisSecond.y, this.axisSecond.z);
      super.constructJoint(axisFirst, axisSecond);
      this.config.limitMotor1 = this.#motorFirst;
      this.config.limitMotor2 = this.#motorSecond;
      this.config.springDamper1 = this.#axisSpringDamperFirst;
      this.config.springDamper2 = this.#axisSpringDamperSecond;

      this.joint = new OIMO.UniversalJoint(this.config);
      super.configureJoint();
    }
  }
}