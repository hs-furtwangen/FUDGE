namespace FudgeCore {
  /**
    * Storing and manipulating rotations in the form of quaternions.
    * Constructed out of the 4 components: (x, y, z, w). Mathematical notation: w + xi + yj + zk.
    * A Quaternion can be described with an axis and angle: (x, y, z) = sin(angle/2)*axis; w = cos(angle/2).
    * roll: x, pitch: y, yaw: z. Note that operations are adapted to work with vectors where y is up and z is forward.
    * @authors Matthias Roming, HFU, 2023 | Marko Fehrenbach, HFU, 2020 | Jonas Plotzky, HFU, 2023
    */
  export class Quaternion extends Mutable implements Serializable, Recycable {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    readonly #eulerAngles: Vector3 = Vector3.ZERO(); // euler angle representation of this quaternion in degrees.
    #eulerAnglesDirty: boolean;

    public constructor(_x: number = 0, _y: number = 0, _z: number = 0, _w: number = 1) {
      super();
      this.set(_x, _y, _z, _w);
    }

    /**
     * Retrieve a new identity quaternion
     */
    public static IDENTITY(): Quaternion {
      return Recycler.get(Quaternion);
    }

    /**
     * Returns a copy of the given quaternion scaled to length 1 (a unit quaternion) making it a valid rotation representation.
     * @param _out Optional quaternion to store the result in.
     */
    public static NORMALIZATION(_quaternion: Quaternion, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      return _out.copy(_quaternion).normalize();
    }

    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the angles given.
     * Rotation occurs around the axis in the order Z-Y-X.
     * @param _out Optional quaternion to store the result in.
     */
    public static ROTATION_EULER_ANGLES(_eulerAngles: Vector3, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      _out.eulerAngles = _eulerAngles;
      return _out;
    }

    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the axis and angle given.
     * Axis must be normalized. Angle is in degrees.
     * @param _out Optional quaternion to store the result in.
     */
    public static ROTATION_AXIS_ANGLE(_axis: Vector3, _angle: number, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      const halfAngle: number = _angle * Calc.deg2rad / 2;
      const sinHalfAngle: number = Math.sin(halfAngle);
      return _out.set(
        _axis.x * sinHalfAngle,
        _axis.y * sinHalfAngle,
        _axis.z * sinHalfAngle,
        Math.cos(halfAngle)
      );
    }

    /**
     * Returns a quaternion with the given forward and up direction.
     * @param _forward A unit vector indicating the desired forward-direction.
     * @param _up A unit vector indicating the up-direction.
     * @param _out Optional quaternion to store the result in.
     */
    public static ROTATION_LOOK_IN(_forward: Vector3, _up: Vector3, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      const right: Vector3 = Vector3.CROSS(_up, _forward);
      const matrix: Matrix4x4 = Recycler.reuse(Matrix4x4);
      matrix.set(
        right.x, right.y, right.z, 0,
        _up.x, _up.y, _up.z, 0,
        _forward.x, _forward.y, _forward.z, 0,
        0, 0, 0, 1
      );
      _out.copy(matrix.quaternion);
      Recycler.store(right);
      Recycler.store(matrix);
      return _out;
    }

    /**
     * Returns a quaternion that will rotate one vector to align with another.
     * @param _from The normalized direction vector to rotate from.
     * @param _to The normalized direction vector to rotate to.
     * @param _out Optional quaternion to store the result in.
     */
    public static ROTATION_FROM_TO(_from: Vector3, _to: Vector3, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      const angle: number = Math.acos(Vector3.DOT(_from, _to)) * Calc.rad2deg;
      const axis: Vector3 = Vector3.CROSS(_from, _to).normalize();
      Quaternion.ROTATION_AXIS_ANGLE(axis, angle, _out);
      Recycler.store(axis);
      return _out;
    }

    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the angles given.
     * Rotation occurs around the axis in the order Z-Y-X.
     * @deprecated Use {@link ROTATION_EULER_ANGLES} instead.
     */
    public static ROTATION(_eulerAngles: Vector3): Quaternion;
    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the axis and angle given.
     * Axis must be normalized. Angle is in degrees.
     * @deprecated Use {@link ROTATION_AXIS_ANGLE} instead.
     */
    public static ROTATION(_axis: Vector3, _angle: number): Quaternion;
    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the forward and up direction given.
     * @deprecated Use {@link ROTATION_LOOK_IN} instead.
     */
    public static ROTATION(_forward: Vector3, _up: Vector3): Quaternion;
    public static ROTATION(_vector: Vector3, _angleOrUp?: number | Vector3): Quaternion {
      const result: Quaternion = Recycler.get(Quaternion);
      if (_angleOrUp == undefined) {
        result.eulerAngles = _vector;
      } else if (typeof _angleOrUp == "number") {
        let halfAngle: number = _angleOrUp * Calc.deg2rad / 2;
        let sinHalfAngle: number = Math.sin(halfAngle);

        result.set(
          _vector.x * sinHalfAngle,
          _vector.y * sinHalfAngle,
          _vector.z * sinHalfAngle,
          Math.cos(halfAngle)
        );
      } else {
        const right: Vector3 = Vector3.CROSS(_angleOrUp, _vector);
        const matrix: Matrix4x4 = Recycler.reuse(Matrix4x4);
        matrix.set(
          right.x, right.y, right.z, 0,
          _angleOrUp.x, _angleOrUp.y, _angleOrUp.z, 0,
          _vector.x, _vector.y, _vector.z, 0,
          0, 0, 0, 1
        );

        result.copy(matrix.quaternion);
        Recycler.store(right);
        Recycler.store(matrix);
      }

      return result;
    }

    /**
     * Computes and returns the product of two passed quaternions.
     * @param _out Optional quaternion to store the result in.
     */
    public static PRODUCT(_left: Quaternion, _right: Quaternion, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      // from: http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
      const ax: number = _left.x;
      const ay: number = _left.y;
      const az: number = _left.z;
      const aw: number = _left.w;
      const bx: number = _right.x;
      const by: number = _right.y;
      const bz: number = _right.z;
      const bw: number = _right.w;

      _out.set(
        ax * bw + ay * bz - az * by + aw * bx,
        -ax * bz + ay * bw + az * bx + aw * by,
        ax * by - ay * bx + az * bw + aw * bz,
        -ax * bx - ay * by - az * bz + aw * bw
      );

      return _out;
    }

    /**
     * Computes and returns the inverse of a passed quaternion.
     * Quaternion is assumed to be normalized.
     * @param _out Optional quaternion to store the result in.
     */
    public static INVERSE(_quaternion: Quaternion, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      return Quaternion.CONJUGATE(_quaternion, _out); // q⁻¹ = q* / |q|² => |q|² = 1 => q⁻¹ = q*
    }

    /**
     * Computes and returns the conjugate of a passed quaternion.
     * @param _out Optional quaternion to store the result in.
     */
    public static CONJUGATE(_quaternion: Quaternion, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      return _out.set(-_quaternion.x, -_quaternion.y, -_quaternion.z, _quaternion.w);
    }

    /**
     * Returns the dot product of two quaternions.
     */
    public static DOT(_a: Quaternion, _b: Quaternion): number {
      return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z + _a.w * _b.w;
    }

    /**
     * Returns the normalized linear interpolation between two quaternions. When t is 0 the result is a, when t is 1 the result is b. Clamps t between 0 and 1.
     * @param _out Optional quaternion to store the result in.
     */
    public static LERP(_a: Quaternion, _b: Quaternion, _t: number, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      _t = Calc.clamp(_t, 0, 1);
      return _out.set(
        (_a.x + _t * (_b.x - _a.x)),
        (_a.y + _t * (_b.y - _a.y)),
        (_a.z + _t * (_b.z - _a.z)),
        (_a.w + _t * (_b.w - _a.w))
      ).normalize();
    }

    /**
     * Returns the spherical linear interpolation between two quaternions. When t is 0 the result is a, when t is 1 the result is b. 
     * @param _out Optional quaternion to store the result in.
     */
    public static SLERP(_a: Quaternion, _b: Quaternion, _t: number, _out: Quaternion = Recycler.reuse(Quaternion)): Quaternion {
      // From: https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
      let cosHalfTheta: number = _a.w * _b.w + _a.x * _b.x + _a.y * _b.y + _a.z * _b.z;
      if (Math.abs(cosHalfTheta) >= 1)
        return _out.copy(_a);

      let halfTheta: number = Math.acos(cosHalfTheta);
      let sinHalfTheta: number = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
      if (Math.abs(sinHalfTheta) < 1e-3) {
        return _out.set(
          (_a.x * 0.5 + _b.x * 0.5),
          (_a.y * 0.5 + _b.y * 0.5),
          (_a.z * 0.5 + _b.z * 0.5),
          (_a.w * 0.5 + _b.w * 0.5)
        );
      }

      let ratioA: number = Math.sin((1 - _t) * halfTheta) / sinHalfTheta;
      let ratioB: number = Math.sin(_t * halfTheta) / sinHalfTheta;
      return _out.set(
        (_a.x * ratioA + _b.x * ratioB),
        (_a.y * ratioA + _b.y * ratioB),
        (_a.z * ratioA + _b.z * ratioB),
        (_a.w * ratioA + _b.w * ratioB)
      );
    }

    /**
     * Return the angle in degrees between the two given quaternions.
     */
    public static ANGLE(_from: Quaternion, _to: Quaternion): number {
      return 2 * Math.acos(Math.abs(Calc.clamp(Quaternion.DOT(_from, _to), -1, 1))) * Calc.rad2deg;
    }

    /**
     * Negates the given quaternion.
     */
    public static negate(_q: Quaternion): void {
      _q.x = -_q.x;
      _q.y = -_q.y;
      _q.z = -_q.z;
      _q.w = -_q.w;
    }

    /**
     * Creates and returns a clone of this quaternion.
     */
    public get clone(): Quaternion {
      return Recycler.reuse(Quaternion).copy(this);
    }

    /**
     * - get: return the euler angle representation of the rotation in degrees. 
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: set the euler angle representation of the rotation in degrees.
     */
    public get eulerAngles(): Vector3 {
      if (this.#eulerAnglesDirty) {
        this.#eulerAnglesDirty = false;

        // roll (x-axis rotation)
        let sinrcosp: number = 2 * (this.w * this.x + this.y * this.z);
        let cosrcosp: number = 1 - 2 * (this.x * this.x + this.y * this.y);
        this.#eulerAngles.x = Math.atan2(sinrcosp, cosrcosp);

        // pitch (y-axis rotation)
        let sinp: number = 2 * (this.w * this.y - this.z * this.x);
        if (Math.abs(sinp) >= 1)
          this.#eulerAngles.y = sinp < 0 ? -Math.abs(Math.PI / 2) : Math.abs(Math.PI / 2); // use 90 degrees if out of range
        else
          this.#eulerAngles.y = Math.asin(sinp);

        // yaw (z-axis rotation)
        let sinycosp: number = 2 * (this.w * this.z + this.x * this.y);
        let cosycosp: number = 1 - 2 * (this.y * this.y + this.z * this.z);
        this.#eulerAngles.z = Math.atan2(sinycosp, cosycosp);

        this.#eulerAngles.scale(Calc.rad2deg);
      }

      return this.#eulerAngles;
    }

    public set eulerAngles(_eulerAngles: Vector3) {
      const halfdeg2rad: number = Calc.deg2rad / 2;
      const x: number = _eulerAngles.x * halfdeg2rad, y: number = _eulerAngles.y * halfdeg2rad, z: number = _eulerAngles.z * halfdeg2rad;

      const cosX: number = Math.cos(x);
      const cosY: number = Math.cos(y);
      const cosZ: number = Math.cos(z);
      const sinX: number = Math.sin(x);
      const sinY: number = Math.sin(y);
      const sinZ: number = Math.sin(z);

      this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
      this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
      this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
      this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;

      // this.set(
      //   sinX * cosY * cosZ - cosX * sinY * sinZ,
      //   cosX * sinY * cosZ + sinX * cosY * sinZ,
      //   cosX * cosY * sinZ - sinX * sinY * cosZ,
      //   cosX * cosY * cosZ + sinX * sinY * sinZ
      // );

      this.#eulerAngles.copy(_eulerAngles);
      this.#eulerAnglesDirty = false;
    }

    /**
     * Copies the given quaternion.
     * @returns A reference to this quaternion.
     */
    public copy(_original: Quaternion): Quaternion {
      this.x = _original.x;
      this.y = _original.y;
      this.z = _original.z;
      this.w = _original.w;
      this.#eulerAnglesDirty = _original.#eulerAnglesDirty;
      if (!this.#eulerAnglesDirty)
        this.#eulerAngles.copy(_original.#eulerAngles);
      // this.mutator = null;
      return this;
    }

    /**
     * Resets the quaternion to the identity-quaternion and clears cache. Used by the recycler to reset.
     */
    public recycle(): void {
      this.set(0, 0, 0, 1);
    }

    /**
     * Sets the components of this quaternion.
     * @returns A reference to this quaternion.
     */
    public set(_x: number, _y: number, _z: number, _w: number): Quaternion {
      this.x = _x;
      this.y = _y;
      this.z = _z;
      this.w = _w;
      this.resetCache();
      return this;
    }

    /**
     * Returns true if this quaternion is equal to the given quaternion within the given tolerance.
     */
    public equals(_compare: Quaternion, _tolerance: number = Number.EPSILON): boolean {
      return Math.abs(this.x - _compare.x) <= _tolerance &&
        Math.abs(this.y - _compare.y) <= _tolerance &&
        Math.abs(this.z - _compare.z) <= _tolerance &&
        Math.abs(this.w - _compare.w) <= _tolerance;
    }

    /**
     * Normalizes this quaternion to a length of 1 (a unit quaternion) making it a valid rotation representation.
     * @returns A reference to this quaternion.
     */
    public normalize(): Quaternion {
      let length: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
      if (length === 0) {
        this.set(0, 0, 0, 1);
      } else {
        length = 1 / length;
        this.x *= length;
        this.y *= length;
        this.z *= length;
        this.w *= length;
      }

      this.resetCache();
      return this;
    }

    /**
     * Negates this quaternion.
     * @returns A reference to this quaternion.
     */
    public negate(): Quaternion {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.w = -this.w;
      this.resetCache();
      return this;
    }

    /**
     * Invert this quaternion.
     * Quaternion is assumed to be normalized.
     * @returns A reference to this quaternion.
     */
    public invert(): Quaternion {
      return this.conjugate();
    }

    /**
     * Conjugates this quaternion and returns it.
     * @returns A reference to this quaternion.
     */
    public conjugate(): Quaternion {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.resetCache();
      return this;
    }

    /**
     * Multiply this quaternion with the given quaternion.
     * @returns A reference to this quaternion.
     */
    public multiply(_quaternion: Quaternion, _fromLeft: boolean = false): Quaternion {
      return Quaternion.PRODUCT(this, _quaternion, this);
    }

    /**
     * Premultiply this quaternion with the given quaternion.
     * @returns A reference to this quaternion.
     */
    public premultiply(_quaternion: Quaternion): Quaternion {
      return Quaternion.PRODUCT(_quaternion, this, this);
    }

    /**
     * Returns a formatted string representation of this quaternion
     */
    public toString(): string {
      return `ƒ.Quaternion(x: ${this.x}, y: ${this.y}, z: ${this.z}, w: ${this.w})`;
    }

    // currently quaternions are never serialized, so this is not needed. But maybe it will be in the future.
    public serialize(): Serialization {
      let serialization: Serialization = this.getMutator();
      serialization.toJSON = () => { return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`; };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Quaternion> {
      if (typeof (_serialization) == "string") {
        [this.x, this.y, this.z, this.w] = JSON.parse(<string><unknown>_serialization);
      } else
        this.mutate(_serialization);
      return this;
    }

    public override mutate(_mutator: Mutator): void {
      if (_mutator.x != undefined)
        this.x = _mutator.x;
      if (_mutator.y != undefined)
        this.y = _mutator.y;
      if (_mutator.z != undefined)
        this.z = _mutator.z;
      if (_mutator.w != undefined)
        this.w = _mutator.w;
      this.resetCache();
    }

    protected reduceMutator(_mutator: Mutator): void {/** */ }

    private resetCache(): void {
      this.#eulerAnglesDirty = true;
    }
  }
}