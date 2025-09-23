namespace FudgeCore {
  /**
     * A physical connection between two bodies with a defined axe of rotation. Also known as HINGE joint.
     * Two RigidBodies need to be defined to use it. A motor can be defined to rotate the connected along the defined axis.
     * 
     * ```text        
     *                  rotation axis, 1st Degree of freedom
     *                    ↑
     *               ┌───┐│┌────┐     
     *               │   │││    │  
     *               │   │││    │ 
     *               │   │││    │ 
     *               └───┘│└────┘
     *                    │   
     *      bodyAnchor         bodyTied
     *   (e.g. Doorhinge)       (e.g. Door)
     * ```
     * @author Marko Fehrenbach, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2021
     */
  export class JointRevolute extends JointAxial {
    public static readonly iSubclass: number = Joint.registerSubclass(JointRevolute);

    protected joint: OIMO.RevoluteJoint;
    protected config: OIMO.RevoluteJointConfig = new OIMO.RevoluteJointConfig();

    #motorTorque: number = 0;
    #rotor: OIMO.RotationalLimitMotor;

    public constructor(_bodyAnchor: ComponentRigidbody = null, _bodyTied: ComponentRigidbody = null, _axis: Vector3 = new Vector3(0, 1, 0), _localAnchor: Vector3 = new Vector3(0, 0, 0)) {
      super(_bodyAnchor, _bodyTied, _axis, _localAnchor);

      this.maxMotor = 360;
      this.minMotor = 0;
    }

    /**
      * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
     */
    public override get maxMotor(): number {
      return super.maxMotor;
    }
    public override set maxMotor(_value: number) {
      super.maxMotor = _value;
      _value *= Calc.deg2rad;
      if (this.joint)
        this.joint.getLimitMotor().upperLimit = _value;
    }
    /**
      * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
     */
    public override get minMotor(): number {
      return super.minMotor;
    }
    public override set minMotor(_value: number) {
      super.minMotor = _value;
      if (this.joint)
        this.joint.getLimitMotor().lowerLimit = _value * Calc.deg2rad;
    }

    /**
      * The maximum motor force in newton meters. force <= 0 equals disabled. 
     */
    @mutate(Number)
    public get motorTorque(): number {
      return this.#motorTorque;
    }
    public set motorTorque(_value: number) {
      this.#motorTorque = _value;
      if (this.joint != null) this.joint.getLimitMotor().motorTorque = _value;
    }

    //#endregion

    protected constructJoint(): void {
      this.#rotor = new OIMO.RotationalLimitMotor().setLimits(super.minMotor * Calc.deg2rad, super.maxMotor * Calc.deg2rad);
      this.#rotor.setMotor(this.motorSpeed, this.motorTorque);

      this.config = new OIMO.RevoluteJointConfig();
      super.constructJoint();

      this.config.springDamper = this.springDamper;
      this.config.limitMotor = this.#rotor;

      this.joint = new OIMO.RevoluteJoint(this.config);
      this.configureJoint();
    }
  }
}