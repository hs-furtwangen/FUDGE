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
    private mutator: Mutator = null; // prepared for optimization, keep mutator to reduce redundant calculation and for comparison. Set to null when data changes!

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
      const result: Quaternion = Recycler.get(Quaternion);
      return result;
    }

    /**
     * Returns a quaternion which is a copy of the given quaternion scaled to length 1.
     */
    public static NORMALIZATION(_q: Quaternion): Quaternion {
      return _q.clone.normalize();
    }

    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the angles given.
     * Rotation occurs around the axis in the order Z-Y-X.
     */
    public static ROTATION(_eulerAngles: Vector3): Quaternion;
    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the axis and angle given.
     * Axis must be normalized. Angle is in degrees.
     */
    public static ROTATION(_axis: Vector3, _angle: number): Quaternion;
    /**
     * Returns a quaternion that rotates coordinates when multiplied by, using the forward and up direction given.
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
        matrix.set([
          right.x, right.y, right.z, 0,
          _angleOrUp.x, _angleOrUp.y, _angleOrUp.z, 0,
          _vector.x, _vector.y, _vector.z, 0,
          0, 0, 0, 1
        ]);

        result.copy(matrix.quaternion);
        Recycler.storeMultiple(right, matrix);
      }

      return result;
    }

    /**
     * Computes and returns the product of two passed quaternions.
     */
    public static PRODUCT(_qLeft: Quaternion, _qRight: Quaternion): Quaternion {
      return _qLeft.clone.multiply(_qRight);
    }

    /**
     * Computes and returns the inverse of a passed quaternion.
     */
    public static INVERSE(_q: Quaternion): Quaternion {
      return _q.clone.invert();
    }

    /**
     * Computes and returns the conjugate of a passed quaternion.
     */
    public static CONJUGATION(_q: Quaternion): Quaternion {
      return _q.clone.conjugate();
    }

    /**
     * Returns the dot product of two quaternions.
     */
    public static DOT(_q1: Quaternion, _q2: Quaternion): number {
      return _q1.x * _q2.x + _q1.y * _q2.y + _q1.z * _q2.z + _q1.w * _q2.w;
    }

    /**
     * Returns the normalized linear interpolation between two quaternions based on the given _factor. When _factor is 0 the result is _from, when _factor is 1 the result is _to.
     */
    public static LERP(_from: Quaternion, _to: Quaternion, _factor: number): Quaternion {
      let result: Quaternion = Recycler.get(Quaternion);
      result.set(
        (_from.x * (1 - _factor) + _to.x * _factor),
        (_from.y * (1 - _factor) + _to.y * _factor),
        (_from.z * (1 - _factor) + _to.z * _factor),
        (_from.w * (1 - _factor) + _to.w * _factor)
      );
      result.normalize();
      return result;
    }

    /**
     * Returns the spherical linear interpolation between two quaternions based on the given _factor. When _factor is 0 the result is _from, when _factor is 1 the result is _to. 
     */
    public static SLERP(_from: Quaternion, _to: Quaternion, _factor: number): Quaternion {
      // From: https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
      const result: Quaternion = Recycler.reuse(Quaternion);
      let cosHalfTheta: number = _from.w * _to.w + _from.x * _to.x + _from.y * _to.y + _from.z * _to.z;
      if (Math.abs(cosHalfTheta) >= 1) 
        return result.copy(_from);
      
      let halfTheta: number = Math.acos(cosHalfTheta);
      let sinHalfTheta: number = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
      if (Math.abs(sinHalfTheta) < 0.001) {
        result.set(
          (_from.x * 0.5 + _to.x * 0.5),
          (_from.y * 0.5 + _to.y * 0.5),
          (_from.z * 0.5 + _to.z * 0.5),
          (_from.w * 0.5 + _to.w * 0.5)
        );
        return result;
      }
      
      let ratioA: number = Math.sin((1 - _factor) * halfTheta) / sinHalfTheta;
      let ratioB: number = Math.sin(_factor * halfTheta) / sinHalfTheta;
      result.set(
        (_from.x * ratioA + _to.x * ratioB),
        (_from.y * ratioA + _to.y * ratioB),
        (_from.z * ratioA + _to.z * ratioB),
        (_from.w * ratioA + _to.w * ratioB)
      );

      return result;
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
      let result: Quaternion = Recycler.reuse(Quaternion);
      result.copy(this);
      return result;
    }

    /**
     * - get: return the euler angle representation of the rotation in degrees. 
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: set the euler angle representation of the rotation in degrees.
     */
    public get eulerAngles(): Vector3 {
      if (this.#eulerAnglesDirty) {
        this.#eulerAnglesDirty = false;

        if (this.x == 0 && this.y == 0 && this.z == 0 && this.w == 1) {
          this.#eulerAngles.set(0, 0, 0);
          return this.#eulerAngles;
        }

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
      const halfAnglesInRadians: Vector3 = Vector3.SCALE(_eulerAngles, Calc.deg2rad / 2);
      const cosX: number = Math.cos(halfAnglesInRadians.x);
      const cosY: number = Math.cos(halfAnglesInRadians.y);
      const cosZ: number = Math.cos(halfAnglesInRadians.z);
      const sinX: number = Math.sin(halfAnglesInRadians.x);
      const sinY: number = Math.sin(halfAnglesInRadians.y);
      const sinZ: number = Math.sin(halfAnglesInRadians.z);

      this.set(
        sinX * cosY * cosZ - cosX * sinY * sinZ,
        cosX * sinY * cosZ + sinX * cosY * sinZ,
        cosX * cosY * sinZ - sinX * sinY * cosZ,
        cosX * cosY * cosZ + sinX * sinY * sinZ
      );

      this.#eulerAngles.copy(_eulerAngles);
      this.#eulerAnglesDirty = false;
      Recycler.store(halfAnglesInRadians);
    }

    /**
     * Normalizes this quaternion to a length of 1 (a unit quaternion) making it a valid rotation representation
     */
    public normalize(): Quaternion {
      let length: number = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
      this.x /= length;
      this.y /= length;
      this.z /= length;
      this.w /= length;
      this.resetCache();
      return this;
    }

    /**
     * Negate this quaternion and returns it
     */
    public negate(): Quaternion {
      this.x *= -1;
      this.y *= -1;
      this.z *= -1;
      this.w *= -1;
      this.resetCache();
      return this;
    }

    /**
     * Resets the quaternion to the identity-quaternion and clears cache. Used by the recycler to reset.
     */
    public recycle(): void {
      this.set(0, 0, 0, 1);
    }

    /**
     * Invert this quaternion.
     */
    public invert(): Quaternion {
      // quaternion is assumed to have unit length
      return this.conjugate();
    }

    /**
     * Conjugates this quaternion and returns it.
     */
    public conjugate(): Quaternion {
      this.x *= -1;
      this.y *= -1;
      this.z *= -1;
      this.resetCache();
      return this;
    }

    /**
     * Rotates this quaternion around the given axis by the given angle.
     * The rotation is appended to already applied rotations, thus multiplied from the right. Set _fromLeft to true to switch and put it in front.
     */
    public rotate(_axis: Vector3, _angle: number, _fromLeft: boolean = false): Quaternion {
      const rotation: Quaternion = Quaternion.ROTATION(_axis, _angle);
      this.multiply(rotation, _fromLeft);
      Recycler.store(rotation);
      return this;
    }

    /**
     * Multiply this quaternion with the given quaternion
     */
    public multiply(_other: Quaternion, _fromLeft: boolean = false): Quaternion {
      const a: Quaternion = _fromLeft ? _other : this;
      const b: Quaternion = _fromLeft ? this : _other;
      // from: http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
      const ax: number = a.x;
      const ay: number = a.y;
      const az: number = a.z;
      const aw: number = a.w;
      const bx: number = b.x;
      const by: number = b.y;
      const bz: number = b.z;
      const bw: number = b.w;

      this.set(
        ax * bw + ay * bz - az * by + aw * bx,
        -ax * bz + ay * bw + az * bx + aw * by,
        ax * by - ay * bx + az * bw + aw * bz,
        -ax * bx - ay * by - az * bz + aw * bw
      );

      return this;
    }

    /**
     * Sets the components of this quaternion.
     */
    public set(_x: number, _y: number, _z: number, _w: number): Quaternion {
      this.x = _x; this.y = _y; this.z = _z; this.w = _w;
      this.resetCache();
      return this;
    }

    /**
     * Copies the state of the given quaternion into this quaternion.
     */
    public copy(_original: Quaternion): Quaternion {
      this.x = _original.x; this.y = _original.y; this.z = _original.z; this.w = _original.w;
      this.#eulerAnglesDirty = _original.#eulerAnglesDirty;
      if (!this.#eulerAnglesDirty)
        this.#eulerAngles.copy(_original.#eulerAngles);
      this.mutator = null;
      return this;
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

    public getMutator(): Mutator {
      if (!this.mutator)
        this.mutator = { x: this.x, y: this.y, z: this.z, w: this.w };
      return this.mutator;
    }

    public async mutate(_mutator: Mutator): Promise<void> {
      this.x = _mutator.x ?? this.x;
      this.y = _mutator.y ?? this.y;
      this.z = _mutator.z ?? this.z;
      this.w = _mutator.w ?? this.w;
      this.resetCache();
    }

    protected reduceMutator(_mutator: Mutator): void {/** */ }

    private resetCache(): void {
      this.#eulerAnglesDirty = true;
      this.mutator = null;
    }
  }
}