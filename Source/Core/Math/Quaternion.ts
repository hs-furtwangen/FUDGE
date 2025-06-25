namespace FudgeCore {
  export interface QuaternionLike {
    x: number;
    y: number;
    z: number;
    w: number;
  }

  /**
    * Storing and manipulating rotations in the form of quaternions.
    * Constructed out of the 4 components: (x, y, z, w). Mathematical notation: w + xi + yj + zk.
    * A Quaternion can be described with an axis and angle: (x, y, z) = sin(angle/2)*axis; w = cos(angle/2).
    * roll: x, pitch: y, yaw: z. Note that operations are adapted to work with vectors where y is up and z is forward.
    * @authors Matthias Roming, HFU, 2023 | Marko Fehrenbach, HFU, 2020 | Jonas Plotzky, HFU, 2023
    */
  export class Quaternion extends Mutable implements Serializable, Recycable, ArrayConvertible {
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

    //#region Static
    /**
     * Retrieve a new identity quaternion
     */
    public static IDENTITY(): Quaternion {
      return Recycler.get(Quaternion);
    }

    /**
     * Normalize a quaternion making it a valid rotation representation.
     * @param _q - quaternion to normalize
     * @param _out - (optional) the receiving quaternion.
     * @returns `_out` or a new quaternion if none is provided.
     */
    public static NORMALIZATION(_q: Readonly<Quaternion>, _out?: Quaternion): Quaternion;
    public static NORMALIZATION<T extends QuaternionLike>(_q: Readonly<T>, _out: T): T;
    public static NORMALIZATION<T extends QuaternionLike>(_q: Readonly<T>, _out: T = <T><unknown>Recycler.reuse(Quaternion)): T {
      const x: number = _q.x;
      const y: number = _q.y;
      const z: number = _q.z;
      const w: number = _q.w;
      let length: number = x * x + y * y + z * z + w * w;
      if (length > 0)
        length = 1 / Math.sqrt(length);

      _out.x = x * length;
      _out.y = y * length;
      _out.z = z * length;
      _out.w = w * length;
      return _out;
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
     * Performs a linear interpolation between two quaternions. Result should be normalized afterwards to represent a valid rotation.
     * @param _a - the first operand.
     * @param _b - the second operand.
     * @param _t - interpolation amount, in the range [0-1], between the two inputs.
     * @param _out - (optional) the receiving quaternion.
     * @returns `_out` or a new quaternion if none is provided.
     * @source https://github.com/toji/gl-matrix
     */
    public static LERP(_a: Readonly<Quaternion>, _b: Readonly<Quaternion>, _t: number, _out?: Quaternion): Quaternion;
    public static LERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
    public static LERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T = <T><unknown>Recycler.reuse(Quaternion)): T {
      const ax: number = _a.x;
      const ay: number = _a.y;
      const az: number = _a.z;
      const aw: number = _a.w;
      _out.x = ax + _t * (_b.x - ax);
      _out.y = ay + _t * (_b.y - ay);
      _out.z = az + _t * (_b.z - az);
      _out.w = aw + _t * (_b.w - aw);
      return _out;
    }

    /**
     * Performs a spherical linear interpolation between two quaternions.
     * @param _a - the first operand.
     * @param _b - the second operand.
     * @param _t - interpolation amount, in the range [0-1], between the two inputs.
     * @param _out - (optional) the receiving quaternion.
     * @returns `_out` or a new quaternion if none is provided.
     * @source https://github.com/toji/gl-matrix
     */
    public static SLERP(_a: Readonly<Quaternion>, _b: Readonly<Quaternion>, _t: number, _out?: Quaternion): Quaternion;
    public static SLERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
    public static SLERP<T extends QuaternionLike>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T = <T><unknown>Recycler.reuse(Quaternion)): T {
      const ax: number = _a.x,
        ay: number = _a.y,
        az: number = _a.z,
        aw: number = _a.w;
      let bx: number = _b.x,
        by: number = _b.y,
        bz: number = _b.z,
        bw: number = _b.w;

      let scale0: number;
      let scale1: number;

      // calc cosine
      let cosom: number = ax * bx + ay * by + az * bz + aw * bw;
      // adjust signs (if necessary)
      if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      }
      // calculate coefficients
      if (1.0 - cosom > Number.EPSILON) {
        // standard case (slerp)
        const omega: number = Math.acos(cosom);
        const sinom: number = Math.sin(omega);
        scale0 = Math.sin((1.0 - _t) * omega) / sinom;
        scale1 = Math.sin(_t * omega) / sinom;
      } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - _t;
        scale1 = _t;
      }
      // calculate final values
      _out.x = scale0 * ax + scale1 * bx;
      _out.y = scale0 * ay + scale1 * by;
      _out.z = scale0 * az + scale1 * bz;
      _out.w = scale0 * aw + scale1 * bw;

      return _out;
    }

    /**
     * Return the angle in degrees between the two given quaternions.
     */
    public static ANGLE(_from: Quaternion, _to: Quaternion): number {
      return 2 * Math.acos(Math.abs(Calc.clamp(Quaternion.DOT(_from, _to), -1, 1))) * Calc.rad2deg;
    }

    /**
     * Performs a spherical linear interpolation between two quaternion arrays.
     * @param _a - the first operand.
     * @param _aOffset - the offset into the first operand.
     * @param _b - the second operand.
     * @param _bOffset - the offset into the second operand.
     * @param _t - interpolation amount, in the range [0-1], between the two inputs.
     * @param _out - the receiving quaternion array.
     * @param _outOffset - the offset into the receiving quaternion array.
     * @returns `out`
     * @source https://github.com/toji/gl-matrix
     */
    public static SLERP_ARRAY<T extends { [n: number]: number }>(_a: Readonly<T>, _aOffset: number, _b: Readonly<T>, _bOffset: number, _t: number, _out: T, _outOffset: number): T {
      const ax: number = _a[0],
        ay: number = _a[_aOffset + 1],
        az: number = _a[_aOffset + 2],
        aw: number = _a[_aOffset + 3];
      let bx: number = _b[0],
        by: number = _b[_bOffset + 1],
        bz: number = _b[_bOffset + 2],
        bw: number = _b[_bOffset + 3];

      let scale0: number;
      let scale1: number;

      // calc cosine
      let cosom: number = ax * bx + ay * by + az * bz + aw * bw;
      // adjust signs (if necessary)
      if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      }
      // calculate coefficients
      if (1.0 - cosom > Number.EPSILON) {
        // standard case (slerp)
        const omega: number = Math.acos(cosom);
        const sinom: number = Math.sin(omega);
        scale0 = Math.sin((1.0 - _t) * omega) / sinom;
        scale1 = Math.sin(_t * omega) / sinom;
      } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - _t;
        scale1 = _t;
      }
      // calculate final values
      _out[0] = scale0 * ax + scale1 * bx;
      _out[_outOffset + 1] = scale0 * ay + scale1 * by;
      _out[_outOffset + 2] = scale0 * az + scale1 * bz;
      _out[_outOffset + 3] = scale0 * aw + scale1 * bw;

      return _out;
    }

    /**
     * Normalize a quaternion array.
     * @param _a - quaternion array to normalize.
     * @param _aOffset - the offset into the quaternion array.
     * @param _out - the receiving quaternion array.
     * @param _outOffset - the offset into the receiving quaternion array.
     * @returns `out`
     * @source https://github.com/toji/gl-matrix
     */
    public static NORMALIZE_ARRAY<T extends { [n: number]: number }>(_a: Readonly<T>, _aOffset: number, _out: T, _outOffset: number): T {
      const x: number = _a[0];
      const y: number = _a[_aOffset + 1];
      const z: number = _a[_aOffset + 2];
      const w: number = _a[_aOffset + 3];
      let len: number = x * x + y * y + z * z + w * w;
      if (len > 0)
        len = 1 / Math.sqrt(len);
      _out[0] = x * len;
      _out[_outOffset + 1] = y * len;
      _out[_outOffset + 2] = z * len;
      _out[_outOffset + 3] = w * len;
      return _out;
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
    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
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
    //#endregion

    //#region Instance
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

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.x = _array[_offset];
      this.y = _array[_offset + 1];
      this.z = _array[_offset + 2];
      this.w = _array[_offset + 3];
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(4), _offset: number = 0): T {
      _out[_offset] = this.x;
      _out[_offset + 1] = this.y;
      _out[_offset + 2] = this.z;
      _out[_offset + 3] = this.w;
      return _out;
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
    //#endregion
  }
}