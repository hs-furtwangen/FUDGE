namespace FudgeCore {
  export interface Vector3Like {
    x: number;
    y: number;
    z: number;
  }

  /**
   * Stores and manipulates a threedimensional vector comprised of the components x, y and z
   * ```text
   *            +y
   *             |__ +x
   *            /
   *          +z   
   * ```
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019-2022 | Jonas Plotzky, HFU, 2023-2025
   */
  export class Vector3 extends Mutable implements Serializable, Recycable, ArrayConvertible {
    /** 
     * Array of the keys of a vector. Allows to translate an index (0, 1, 2) to a key ("x", "y", "z") or to iterate over a vector.
     */
    public static readonly keys: readonly ["x", "y", "z"] = ["x", "y", "z"];

    public x: number;
    public y: number;
    public z: number;

    public constructor(_x: number = 0, _y: number = 0, _z: number = 0) {
      super();
      this.set(_x, _y, _z);
    }

    //#region Static

    /**
     * Creates and returns a vector with the given length pointing in x-direction
     */
    public static X(_scale: number = 1): Vector3 {
      return Recycler.reuse(Vector3).set(_scale, 0, 0);
    }

    /**
     * Creates and returns a vector with the given length pointing in y-direction
     */
    public static Y(_scale: number = 1): Vector3 {
      return Recycler.reuse(Vector3).set(0, _scale, 0);
    }

    /**
     * Creates and returns a vector with the given length pointing in z-direction
     */
    public static Z(_scale: number = 1): Vector3 {
      return Recycler.reuse(Vector3).set(0, 0, _scale);
    }

    /**
     * Creates and returns a vector with the value 0 on each axis
     */
    public static ZERO(): Vector3 {
      return Recycler.get(Vector3);
    }

    /**
     * Creates and returns a vector of the given size on each of the three axis
     */
    public static ONE(_scale: number = 1): Vector3 {
      return Recycler.reuse(Vector3).set(_scale, _scale, _scale);
    }

    /**
     * Creates and returns a vector through transformation of the given vector by the given matrix or rotation quaternion.
     * @param _out Optional vector to store the result in.
     */
    public static TRANSFORMATION(_vector: Vector3, _transform: Matrix4x4 | Quaternion, _includeTranslation: boolean = true, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      if (_transform instanceof Matrix4x4) {
        const m: ArrayLike<number> = _transform.getArray();

        _out.set(
          m[0] * _vector.x + m[4] * _vector.y + m[8] * _vector.z,
          m[1] * _vector.x + m[5] * _vector.y + m[9] * _vector.z,
          m[2] * _vector.x + m[6] * _vector.y + m[10] * _vector.z
        );

        if (_includeTranslation)
          _out.add(_transform.translation);

        return _out;
      }

      // From: https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/index.htm
      // out = q * quaternion(vector.x, vector.y, vector.z, 0) * conj(q)

      // q * quaternion(vector.x, vector.y, vector.z, 0) ...
      const qx: number = _transform.w * _vector.x + _transform.y * _vector.z - _transform.z * _vector.y;
      const qy: number = _transform.w * _vector.y + _transform.z * _vector.x - _transform.x * _vector.z;
      const qz: number = _transform.w * _vector.z + _transform.x * _vector.y - _transform.y * _vector.x;
      const qw: number = -_transform.x * _vector.x - _transform.y * _vector.y - _transform.z * _vector.z;

      // ... * conj(q)
      return _out.set(
        qx * _transform.w + qw * - _transform.x + qy * - _transform.z - qz * - _transform.y,
        qy * _transform.w + qw * - _transform.y + qz * - _transform.x - qx * - _transform.z,
        qz * _transform.w + qw * - _transform.z + qx * - _transform.y - qy * - _transform.x
      );
    }

    /**
     * Creates and returns a vector which is a copy of the given vector scaled to the given length.
     * @param _out Optional vector to store the result in.
     */
    public static NORMALIZATION(_vector: Vector3, _length: number = 1, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _out.copy(_vector).normalize(_length);
    }

    /**
     * Returns the result of the addition of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static SUM(_a: Vector3, _b: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = _a.x + _b.x;
      _out.y = _a.y + _b.y;
      _out.z = _a.z + _b.z;
      return _out;
    }

    /**
     * Returns the result of the subtraction of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static DIFFERENCE(_minuend: Vector3, _subtrahend: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = _minuend.x - _subtrahend.x;
      _out.y = _minuend.y - _subtrahend.y;
      _out.z = _minuend.z - _subtrahend.z;
      return _out;
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor.
     * @param _out Optional vector to store the result in.
     */
    public static SCALE(_vector: Vector3, _scaling: number, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = _vector.x * _scaling;
      _out.y = _vector.y * _scaling;
      _out.z = _vector.z * _scaling;
      return _out;
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor.
     * @param _out Optional vector to store the result in.
     */
    public static NEGATION(_vector: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = -_vector.x;
      _out.y = -_vector.y;
      _out.z = -_vector.z;
      return _out;
    }

    /**
     * Divides the dividend by the divisor component by component and returns the result.
     * @param _out Optional vector to store the result in.
     */
    public static RATIO(_dividend: Vector3, _divisor: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = _dividend.x / _divisor.x;
      _out.y = _dividend.y / _divisor.y;
      _out.z = _dividend.z / _divisor.z;
      return _out;
    }

    /**
     * Computes the crossproduct of 2 vectors. 
     * @param _out Optional vector to store the result in.
     */
    public static CROSS(_a: Vector3, _b: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      const ax: number = _a.x;
      const ay: number = _a.y;
      const az: number = _a.z;
      const bx: number = _b.x;
      const by: number = _b.y;
      const bz: number = _b.z;

      _out.x = ay * bz - az * by;
      _out.y = az * bx - ax * bz;
      _out.z = ax * by - ay * bx;
      return _out;
    }

    /**
     * Computes the dotproduct of 2 vectors.
     */
    public static DOT(_a: Readonly<Vector3Like>, _b: Readonly<Vector3Like>): number {
      return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z;
    }

    /**
     * Calculates and returns the reflection of the incoming vector at the given normal vector. The length of normal should be 1.
     * ```text
     * _________________________
     *           /|\
     * incoming / | \ reflection
     *         /  |  \   
     *          normal
     * ```
     * @param _out Optional vector to store the result in.
     */
    public static REFLECTION(_incoming: Vector3, _normal: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      if (_out == _incoming) // clone _incoming to allow reading from it
        Recycler.store(_incoming = _incoming.clone); // dangerous, this only works because sup-method calls don't fetch from recycler

      return Vector3.SUM(_incoming, Vector3.SCALE(_normal, 2 * -Vector3.DOT(_incoming, _normal), _out), _out);
    }

    /**
     * Creates a cartesian vector from geographic coordinates.
     * @param _out Optional vector to store the result in.
     */
    public static GEO(_longitude: number = 0, _latitude: number = 0, _magnitude: number = 1, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      const geo: Geo3 = Recycler.reuse(Geo3).set(_longitude, _latitude, _magnitude);
      _out.geo = geo;
      Recycler.store(geo);
      return _out;
    }

    /**
     * Return the angle in degrees between the two given vectors.
     */
    public static ANGLE(_from: Vector3, _to: Vector3): number {
      const ax: number = _from.x;
      const ay: number = _from.y;
      const az: number = _from.z;
      const bx: number = _to.x;
      const by: number = _to.y;
      const bz: number = _to.z;
      const mag: number = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
      const cosine: number = mag && Vector3.DOT(_from, _to) / mag;
      return Math.acos(Math.min(Math.max(cosine, -1), 1)) * Calc.rad2deg;
    }

    /**
     * Return the projection of a onto b.
     * @param _out Optional vector to store the result in.
     */
    public static PROJECTION(_a: Vector3, _b: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _out.copy(_a).project(_b);
    }


    /**
     * Performs a linear interpolation between between two vectors. When t is 0 the result is a, when t is 1 the result is b.
     * @param _a - the first operand.
     * @param _b - the second operand.
     * @param _t - interpolation amount, in the range [0-1], between the two inputs.
     * @param _out - (optional) the receiving vector.
     * @returns `_out` or a new vector if none is provided.
     * @source https://github.com/toji/gl-matrix
     */
    public static LERP(_a: Readonly<Vector3>, _b: Readonly<Vector3>, _t: number, _out?: Vector3): Vector3;
    public static LERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
    public static LERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T = <T><unknown>Recycler.reuse(Vector3)): T {
      const ax: number = _a.x;
      const ay: number = _a.y;
      const az: number = _a.z;
      _out.x = ax + _t * (_b.x - ax);
      _out.y = ay + _t * (_b.y - ay);
      _out.z = az + _t * (_b.z - az);
      return _out;
    }

    /**
     * Performs a spherical linear interpolation between two vectors.
     * @param _a - the first operand.
     * @param _b - the second operand.
     * @param _t - interpolation amount, in the range [0-1], between the two inputs.
     * @param _out - (optional) the receiving vector.
     * @returns `_out` or a new vector if none is provided.
     * @source https://github.com/toji/gl-matrix
     */
    public static SLERP(_a: Readonly<Vector3>, _b: Readonly<Vector3>, _t: number, _out?: Vector3): Vector3;
    public static SLERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T): T;
    public static SLERP<T extends Vector3Like>(_a: Readonly<T>, _b: Readonly<T>, _t: number, _out: T = <T><unknown>Recycler.reuse(Vector3)): T {
      const angle: number = Math.acos(Math.min(Math.max(Vector3.DOT(_a, _b), -1), 1));
      const sinTotal: number = Math.sin(angle);

      const ratioA: number = Math.sin((1 - _t) * angle) / sinTotal;
      const ratioB: number = Math.sin(_t * angle) / sinTotal;
      _out.x = ratioA * _a.x + ratioB * _b.x;
      _out.y = ratioA * _a.y + ratioB * _b.y;
      _out.z = ratioA * _a.z + ratioB * _b.z;

      return _out;
    }

    /**
     * Smoothly interpolates between two vectors based on a critically damped spring model. 
     * Allows to smooth toward a moving target with an ease-in/ease-out motion maintaining a continuous velocity.
     * Does not overshoot.
     * @param _current - The current value.
     * @param _target - The target value.
     * @param _velocity - The velocity at which the value is moving. This value is **modified** by the function and must be maintained in the outside context.
     * @param _smoothTime - The time it would take for the value to reach the target if it were moving at maximum velocity for the entire duration. When following a moving target the smooth time equals the lag time allowing to calculate the `lag distance = target velocity * smooth time`.
     * @param _timeFrame - The elapsed time since the last call to the function.
     * @param _maxSpeed - An optional maximum speed that limits the velocity of the value. Defaults to Infinity.
     * @param _out Optional vector to store the result in.
     * @source from Andrew Kirmse, Game Programming Gems 4, Chapter 1.10
     */
    public static SMOOTHDAMP(_current: Vector3, _target: Vector3, _velocity: Vector3, _smoothTime: number, _timeFrame: number, _maxSpeed: number = Infinity, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      const omega: number = 2 / _smoothTime;
      const x: number = omega * _timeFrame;
      const exp: number = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x); // approximation of e ^ -omega * timeFrame

      let changeX: number = _current.x - _target.x;
      let changeY: number = _current.y - _target.y;
      let changeZ: number = _current.z - _target.z;

      const maxChange: number = _maxSpeed * _smoothTime;
      const magnitudeSquared: number = changeX * changeX + changeY * changeY + changeZ * changeZ;

      let targetX: number;
      let targetY: number;
      let targetZ: number;
      if (magnitudeSquared > maxChange * maxChange) {
        let scalar: number = maxChange / Math.sqrt(magnitudeSquared); // normalize to maxChange
        changeX *= scalar;
        changeY *= scalar;
        changeZ *= scalar;

        // change = current - target  ==  target = current - change
        targetX = _current.x - changeX;
        targetY = _current.y - changeY;
        targetZ = _current.z - changeZ;
      } else {
        targetX = _target.x;
        targetY = _target.y;
        targetZ = _target.z;
      }

      let tempX: number = (_velocity.x + omega * changeX) * _timeFrame;
      let tempY: number = (_velocity.y + omega * changeY) * _timeFrame;
      let tempZ: number = (_velocity.z + omega * changeZ) * _timeFrame;

      _velocity.x = (_velocity.x - omega * tempX) * exp;
      _velocity.y = (_velocity.y - omega * tempY) * exp;
      _velocity.z = (_velocity.z - omega * tempZ) * exp;

      _out.x = targetX + (changeX + tempX) * exp;
      _out.y = targetY + (changeY + tempY) * exp;
      _out.z = targetZ + (changeZ + tempZ) * exp;

      return _out;
    }
    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
    }

    /**
     * Returns the length of the vector
     */
    public get magnitude(): number {
      const x: number = this.x;
      const y: number = this.y;
      const z: number = this.z;
      return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
     */
    public get magnitudeSquared(): number {
      const x: number = this.x;
      const y: number = this.y;
      const z: number = this.z;
      return x * x + y * y + z * z;
    }

    /**
     * - get: Returns a geographic representation of this vector  
     * - set: Adjusts the cartesian values of this vector to represent the given as geographic coordinates
     */
    public get geo(): Geo3 {
      let geo: Geo3 = Recycler.get(Geo3);
      geo.magnitude = this.magnitude;

      if (geo.magnitude === 0)
        return geo;

      geo.longitude = 180 * Math.atan2(this.x / geo.magnitude, this.z / geo.magnitude) / Math.PI;
      geo.latitude = 180 * Math.asin(this.y / geo.magnitude) / Math.PI;
      return geo;
    }

    public set geo(_geo: Geo3) {
      this.set(0, 0, _geo.magnitude);
      const mtxRotationX: Matrix4x4 = Matrix4x4.ROTATION_X(_geo.latitude);
      const mtxRotationY: Matrix4x4 = Matrix4x4.ROTATION_Y(_geo.longitude);
      this.transform(mtxRotationX);
      this.transform(mtxRotationY);
      Recycler.store(mtxRotationX);
      Recycler.store(mtxRotationY);
    }

    /**
     * Creates and returns a clone of this vector.
     */
    public get clone(): Vector3 {
      return Recycler.reuse(Vector3).copy(this);
    }
    //#endregion

    //#region Instance
    /**
     * Copies the components of the given vector into this vector.
     * @returns A reference to this vector.
     */
    public copy(_original: Vector3): Vector3 {
      this.x = _original.x;
      this.y = _original.y;
      this.z = _original.z;
      return this;
    }

    /**
     * Sets the components of this vector and returns it.
     * @returns A reference to this vector.
     */
    public set(_x: number = 0, _y: number = 0, _z: number = 0): Vector3 {
      this.x = _x;
      this.y = _y;
      this.z = _z;
      return this;
    }



    public recycle(): void {
      this.set(0, 0, 0);
    }

    /**
     * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
     * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
     */
    public equals(_compare: Vector3, _tolerance: number = Number.EPSILON): boolean {
      if (Math.abs(this.x - _compare.x) > _tolerance) return false;
      if (Math.abs(this.y - _compare.y) > _tolerance) return false;
      if (Math.abs(this.z - _compare.z) > _tolerance) return false;
      return true;
    }

    /**
     * Returns true if the position described by this is within a cube with the opposite corners 1 and 2.
     */
    public isInsideCube(_corner1: Vector3, _corner2: Vector3): boolean {
      const diagonal: Vector3 = Vector3.DIFFERENCE(_corner2, _corner1);
      const relative: Vector3 = Vector3.DIFFERENCE(this, _corner1);
      const ratio: Vector3 = Vector3.RATIO(relative, diagonal);
      Recycler.store(diagonal);
      Recycler.store(relative);
      Recycler.store(ratio);
      if (ratio.x > 1 || ratio.x < 0)
        return false;
      if (ratio.y > 1 || ratio.y < 0)
        return false;
      if (ratio.z > 1 || ratio.z < 0)
        return false;
      return true;
    }

    /**
     * Returns true if the position described by this is within a sphere with the given center and radius.
     */
    public isInsideSphere(_center: Vector3, _radius: number): boolean {
      const difference: Vector3 = Vector3.DIFFERENCE(this, _center);
      Recycler.store(difference);
      return difference.magnitudeSquared < (_radius * _radius);
    }

    /**
     * Returns the distance bewtween this vector and the given vector.
     */
    public getDistance(_to: Vector3): number {
      const x: number = _to.x - this.x;
      const y: number = _to.y - this.y;
      const z: number = _to.z - this.z;
      return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Adds the given vector to this vector.
     * @returns A reference to this vector.
     */
    public add(_addend: Vector3): Vector3 {
      this.x += _addend.x;
      this.y += _addend.y;
      this.z += _addend.z;
      return this;
    }

    /**
     * Subtracts the given vector from this vector.
     * @returns A reference to this vector.
     */
    public subtract(_subtrahend: Vector3): Vector3 {
      this.x -= _subtrahend.x;
      this.y -= _subtrahend.y;
      this.z -= _subtrahend.z;
      return this;
    }

    /**
     * Scales this vector by the given scalar.
     * @returns A reference to this vector.
     */
    public scale(_scalar: number): Vector3 {
      this.x *= _scalar;
      this.y *= _scalar;
      this.z *= _scalar;
      return this;
    }

    /**
     * Negates this vector by flipping the signs of its components
     * @returns A reference to this vector.
     */
    public negate(): Vector3 {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }

    /**
     * Normalizes this to the given length, 1 by default
     * @returns A reference to this vector.
     */
    public normalize(_length: number = 1): Vector3 {
      let magnitudeSquared: number = this.magnitudeSquared;
      if (magnitudeSquared == 0)
        throw (new RangeError("Impossible normalization"));

      this.scale(_length / Math.sqrt(magnitudeSquared));
      return this;
    }

    /**
     * Reflects this vector at a given normal. See {@link Vector3.REFLECTION}.
     * @returns A reference to this vector.
     */
    public reflect(_normal: Vector3): Vector3 {
      return Vector3.REFLECTION(this, _normal, this);
    }

    /**
     * Projects this vector onto the given vector.
     * @returns A reference to this vector.
     */
    public project(_on: Vector3): Vector3 {
      let scalar: number = Vector3.DOT(this, _on) / _on.magnitudeSquared;
      this.x = _on.x * scalar;
      this.y = _on.y * scalar;
      this.z = _on.z * scalar;
      return this;
    }

    /**
     * Transforms this vector by the given matrix or rotation quaternion. 
     * Including or exluding the translation if a matrix is passed.
     * Including is the default, excluding will only rotate and scale this vector.
     * @returns A reference to this vector.
     */
    public transform(_transform: Matrix4x4 | Quaternion, _includeTranslation: boolean = true): Vector3 {
      return Vector3.TRANSFORMATION(this, _transform, _includeTranslation, this);
    }

    /**
     * Shuffles the components of this vector.
     * @returns A reference to this vector.
     */
    public shuffle(): Vector3 {
      // Durstenfeld shuffle
      for (let i: number = Vector3.keys.length - 1, j: number; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1)); // Random.default.getRangeFloored(0, i + 1);
        const temp: number = this[Vector3.keys[i]];
        this[Vector3.keys[i]] = this[Vector3.keys[j]];
        this[Vector3.keys[j]] = temp;
      }

      return this;
    }

    /**
     * For each dimension, moves the component to the minimum of this and the given vector.
     * @returns A reference to this vector.
     */
    public min(_compare: Vector3): Vector3 {
      this.x = Math.min(this.x, _compare.x);
      this.y = Math.min(this.y, _compare.y);
      this.z = Math.min(this.z, _compare.z);
      return this;
    }

    /**
     * For each dimension, moves the component to the maximum of this and the given vector.
     * @returns A reference to this vector.
     */
    public max(_compare: Vector3): Vector3 {
      this.x = Math.max(this.x, _compare.x);
      this.y = Math.max(this.y, _compare.y);
      this.z = Math.max(this.z, _compare.z);
      return this;
    }

    /**
     * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
     * @param _out - (optional) the receiving vector.
     * @returns `_out` or a new vector if none is provided.
     */
    public map(_function: (_value: number, _index: number, _component: "x" | "y" | "z", _vector: Vector3) => number, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      _out.x = _function(this.x, 0, "x", this);
      _out.y = _function(this.y, 1, "y", this);
      _out.z = _function(this.z, 2, "z", this);
      return _out;
    }

    /**
     * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector3.map} but mutates this vector instead of creating a new one.
     * @returns A reference to this vector.
     */
    public apply(_function: (_value: number, _index: number, _component: "x" | "y" | "z", _vector: Vector3) => number): Vector3 {
      this.x = _function(this.x, 0, "x", this);
      this.y = _function(this.y, 1, "y", this);
      this.z = _function(this.z, 2, "z", this);
      return this;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.x = _array[_offset];
      this.y = _array[_offset + 1];
      this.z = _array[_offset + 2];
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(3), _offset: number = 0): T {
      _out[_offset] = this.x;
      _out[_offset + 1] = this.y;
      _out[_offset + 2] = this.z;
      return _out;
    }

    /**
     * Drops the z-component and returns a Vector2 consisting of the x- and y-components.
     * @param _out Optional vector to store the result in.
     */
    public toVector2(_out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(this.x, this.y);
    }

    /**
     * Returns a formatted string representation of this vector
     */
    public toString(): string {
      let result: string = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)}, ${this.z.toPrecision(5)})`;
      return result;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = this.getMutator();
      // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
      serialization.toJSON = () => { return `[${this.x}, ${this.y}, ${this.z}]`; };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Vector3> {
      if (typeof (_serialization) == "string") {
        [this.x, this.y, this.z] = JSON.parse(<string><unknown>_serialization);
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
    }

    public getMutator(): Mutator {
      let mutator: Mutator = { x: this.x, y: this.y, z: this.z };
      return mutator;
    }

    protected reduceMutator(_mutator: Mutator): void {/** */ }
    //#endregion
    //#endregion
  }
}