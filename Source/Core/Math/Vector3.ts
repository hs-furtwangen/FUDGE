namespace FudgeCore {
  /**
   * Stores and manipulates a threedimensional vector comprised of the components x, y and z
   * ```text
   *            +y
   *             |__ +x
   *            /
   *          +z   
   * ```
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019-2022 | Jonas Plotzky, HFU, 2023
   */
  export class Vector3 extends Mutable implements Serializable, Recycable {
    public x: number;
    public y: number;
    public z: number;

    public constructor(_x: number = 0, _y: number = 0, _z: number = 0) {
      super();
      this.set(_x, _y, _z);
    }

    //#region Static
    public static isFullVectorMutator(_mutator: Mutator): boolean {
      return _mutator && _mutator.x != undefined && _mutator.y != undefined && _mutator.z != undefined;
    }

    /**
     * Creates and returns a vector with the given length pointing in x-direction
     */
    public static X(_scale: number = 1): Vector3 {
      const vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(_scale, 0, 0);
      return vector;
    }

    /**
     * Creates and returns a vector with the given length pointing in y-direction
     */
    public static Y(_scale: number = 1): Vector3 {
      const vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(0, _scale, 0);
      return vector;
    }

    /**
     * Creates and returns a vector with the given length pointing in z-direction
     */
    public static Z(_scale: number = 1): Vector3 {
      const vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(0, 0, _scale);
      return vector;
    }

    /**
     * Creates and returns a vector with the value 0 on each axis
     */
    public static ZERO(): Vector3 {
      const vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(0, 0, 0); // should be set to 0 by recycler already?
      return vector;
    }

    /**
     * Creates and returns a vector of the given size on each of the three axis
     */
    public static ONE(_scale: number = 1): Vector3 {
      const vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(_scale, _scale, _scale);
      return vector;
    }

    /**
     * Creates and returns a vector through transformation of the given vector by the given matrix or rotation quaternion.
     */
    public static TRANSFORMATION(_vector: Vector3, _transform: Matrix4x4 | Quaternion, _includeTranslation: boolean = true): Vector3 {
      const result: Vector3 = Recycler.reuse(Vector3);

      if (_transform instanceof Matrix4x4) {
        let m: Float32Array = _transform.get();

        result.set(
          m[0] * _vector.x + m[4] * _vector.y + m[8] * _vector.z,
          m[1] * _vector.x + m[5] * _vector.y + m[9] * _vector.z,
          m[2] * _vector.x + m[6] * _vector.y + m[10] * _vector.z
        );

        if (_includeTranslation)
          result.add(_transform.translation);

      } else {
        // From: https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/index.htm
        // result = q * quaternion(vector.x, vector.y, vector.z, 0) * conj(q)

        // q * quaternion(vector.x, vector.y, vector.z, 0) ...
        const qx: number = _transform.w * _vector.x + _transform.y * _vector.z - _transform.z * _vector.y;
        const qy: number = _transform.w * _vector.y + _transform.z * _vector.x - _transform.x * _vector.z;
        const qz: number = _transform.w * _vector.z + _transform.x * _vector.y - _transform.y * _vector.x;
        const qw: number = -_transform.x * _vector.x - _transform.y * _vector.y - _transform.z * _vector.z;

        // ... * conj(q)
        result.set(
          qx * _transform.w + qw * - _transform.x + qy * - _transform.z - qz * - _transform.y,
          qy * _transform.w + qw * - _transform.y + qz * - _transform.x - qx * - _transform.z,
          qz * _transform.w + qw * - _transform.z + qx * - _transform.y - qy * - _transform.x
        );
      }

      return result;
    }

    /**
     * Creates and returns a vector which is a copy of the given vector scaled to the given length
     */
    public static NORMALIZATION(_vector: Vector3, _length: number = 1): Vector3 {
      let magnitudeSquared: number = _vector.magnitudeSquared;
      if (magnitudeSquared == 0)
        throw (new RangeError("Impossible normalization"));
      let vector: Vector3 = _vector.clone;
      vector.scale(_length / Math.sqrt(magnitudeSquared));
      return vector;
    }

    /**
     * Returns the resulting vector attained by addition of all given vectors.
     */
    public static SUM(..._vectors: Vector3[]): Vector3 {
      let result: Vector3 = Recycler.get(Vector3);
      for (let vector of _vectors)
        result.set(result.x + vector.x, result.y + vector.y, result.z + vector.z);
      return result;
    }

    /**
     * Returns the result of the subtraction of two vectors.
     */
    public static DIFFERENCE(_minuend: Vector3, _subtrahend: Vector3): Vector3 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y, _minuend.z - _subtrahend.z);
      return vector;
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor
     */
    public static SCALE(_vector: Vector3, _scaling: number): Vector3 {
      let scaled: Vector3 = Recycler.reuse(Vector3);
      scaled.set(_vector.x * _scaling, _vector.y * _scaling, _vector.z * _scaling);
      return scaled;
    }

    /**
     * Computes the crossproduct of 2 vectors.
     */
    public static CROSS(_a: Vector3, _b: Vector3): Vector3 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(
        _a.y * _b.z - _a.z * _b.y,
        _a.z * _b.x - _a.x * _b.z,
        _a.x * _b.y - _a.y * _b.x
      );
      return vector;
    }
    /**
     * Computes the dotproduct of 2 vectors.
     */
    public static DOT(_a: Vector3, _b: Vector3): number {
      return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z;;
    }

    /**
     * Calculates and returns the reflection of the incoming vector at the given normal vector. The length of normal should be 1.
     *     __________________
     *           /|\
     * incoming / | \ reflection
     *         /  |  \   
     *          normal
     * 
     */
    public static REFLECTION(_incoming: Vector3, _normal: Vector3): Vector3 {
      let dot: number = -Vector3.DOT(_incoming, _normal);
      let reflection: Vector3 = Vector3.SUM(_incoming, Vector3.SCALE(_normal, 2 * dot));
      return reflection;
    }

    /**
     * Divides the dividend by the divisor component by component and returns the result
     */
    public static RATIO(_dividend: Vector3, _divisor: Vector3): Vector3 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(_dividend.x / _divisor.x, _dividend.y / _divisor.y, _dividend.z / _divisor.z);
      return vector;
    }

    /**
     * Creates a cartesian vector from geographic coordinates
     */
    public static GEO(_longitude: number = 0, _latitude: number = 0, _magnitude: number = 1): Vector3 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      let geo: Geo3 = Recycler.reuse(Geo3);
      geo.set(_longitude, _latitude, _magnitude);
      vector.geo = geo;
      Recycler.store(geo);
      return vector;
    }

    /**
     * Return the angle in degrees between the two given vectors
     */
    public static ANGLE(_from: Vector3, _to: Vector3): number {
      let angle: number = Math.acos(Calc.clamp(Vector3.DOT(_from, _to) / (_from.magnitude * _to.magnitude), -1, 1)); // clamp because of floating point errors when from == to
      return angle * Calc.rad2deg;
    }

    /**
     * Return the projection of a onto b
     */
    public static PROJECTION(_a: Vector3, _b: Vector3): Vector3 {
      return _a.clone.project(_b);
    }

    /**
     * Returns the linear interpolation of two vectors. Clamps the factor between 0 and 1.
     */
    public static LERP(_a: Vector3, _b: Vector3, _factor: number): Vector3 {
      _factor = Calc.clamp(_factor, 0, 1);
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(
        _a.x + (_b.x - _a.x) * _factor,
        _a.y + (_b.y - _a.y) * _factor,
        _a.z + (_b.z - _a.z) * _factor
      );
      return vector;
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
     * @source from Andrew Kirmse, Game Programming Gems 4, Chapter 1.10
     */
    public static SMOOTHDAMP(_current: Vector3, _target: Vector3, _velocity: Vector3, _smoothTime: number, _timeFrame: number, _maxSpeed: number = Infinity): Vector3 {
      const omega: number = 2 / _smoothTime;
      const x: number = omega * _timeFrame;
      const exp: number = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x); // approximation of e ^ -omega * timeFrame
      const change: Vector3 = Vector3.DIFFERENCE(_current, _target); // c = from - to  | to = from - c
      
      const maxChange: number = _maxSpeed * _smoothTime;
      const magnitudeSquared: number = change.magnitudeSquared;
      if (magnitudeSquared > maxChange * maxChange) {
        change.scale(maxChange / Math.sqrt(magnitudeSquared));
        _target = Vector3.DIFFERENCE(_current, change);
      }
      
      // TODO: maybe optimize this...
      const scaleChange: Vector3 = Vector3.SCALE(change, omega);
      const sumVelocityScaleChange: Vector3 = Vector3.SUM(_velocity, scaleChange);
      const temp: Vector3 = Vector3.SCALE(sumVelocityScaleChange, _timeFrame);

      const scaleTemp: Vector3 = Vector3.SCALE(temp, omega);
      const differenceVelocityScaleTemp: Vector3 = Vector3.DIFFERENCE(_velocity, scaleTemp);
      const scaleDifferenceVelocityScaleTemp: Vector3 = Vector3.SCALE(differenceVelocityScaleTemp, exp);
      _velocity.copy(scaleDifferenceVelocityScaleTemp);

      const sumChangeTemp: Vector3 = Vector3.SUM(change, temp);
      const scaleSumChangeTempExp: Vector3 = Vector3.SCALE(sumChangeTemp, exp);
      const result: Vector3 = Vector3.SUM(_target, scaleSumChangeTempExp);

      // without recycling...
      // const temp: Vector3 = Vector3.SCALE(Vector3.SUM(_velocity, Vector3.SCALE(change, omega)), _timeFrame);
      // _velocity.copy(Vector3.SCALE(Vector3.DIFFERENCE(_velocity, Vector3.SCALE(temp, omega)), exp));
      // const result: Vector3 = Vector3.SUM(_target, Vector3.SCALE(Vector3.SUM(change, temp), exp));
      
      Recycler.storeMultiple(scaleChange, sumVelocityScaleChange, temp, scaleTemp, differenceVelocityScaleTemp, scaleDifferenceVelocityScaleTemp, sumChangeTemp, scaleSumChangeTempExp);
      return result;
    }
    //#endregion

    //#region Accessors
    /**
     * Returns the length of the vector
     */
    public get magnitude(): number {
      return Math.hypot(this.x, this.y, this.z);
    }

    /**
     * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
     */
    public get magnitudeSquared(): number {
      return Vector3.DOT(this, this);
    }

    /**
     * - get: returns a geographic representation of this vector  
     * - set: adjust the cartesian values of this vector to represent the given as geographic coordinates
     */
    public set geo(_geo: Geo3) {
      this.set(0, 0, _geo.magnitude);
      this.transform(Matrix4x4.ROTATION_X(-_geo.latitude));
      this.transform(Matrix4x4.ROTATION_Y(_geo.longitude));
    }
    public get geo(): Geo3 {
      let geo: Geo3 = Recycler.get(Geo3);
      geo.magnitude = this.magnitude;

      if (geo.magnitude === 0)
        return geo;

      geo.longitude = 180 * Math.atan2(this.x / geo.magnitude, this.z / geo.magnitude) / Math.PI;
      geo.latitude = 180 * Math.asin(this.y / geo.magnitude) / Math.PI;
      return geo;
    }

    /**
     * Creates and returns a clone of this vector.
     */
    public get clone(): Vector3 {
      return Recycler.reuse(Vector3).copy(this);
    }
    //#endregion

    /**
     * Copies the components of the given vector into this vector.
     */
    public copy(_original: Vector3): Vector3 {
      return this.set(_original.x, _original.y, _original.z);
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
     * Returns true if the position described by this is within a cube with the opposite corners 1 and 2
     */
    public isInsideCube(_corner1: Vector3, _corner2: Vector3): boolean {
      let diagonal: Vector3 = Vector3.DIFFERENCE(_corner2, _corner1);
      let relative: Vector3 = Vector3.DIFFERENCE(this, _corner1);
      let ratio: Vector3 = Vector3.RATIO(relative, diagonal);
      if (ratio.x > 1 || ratio.x < 0)
        return false;
      if (ratio.y > 1 || ratio.y < 0)
        return false;
      if (ratio.z > 1 || ratio.z < 0)
        return false;
      return true;
    }

    /**
     * Returns true if the position described by this is within a sphere with the given center and radius
     */
    public isInsideSphere(_center: Vector3, _radius: number): boolean {
      let difference: Vector3 = Vector3.DIFFERENCE(this, _center);
      return difference.magnitudeSquared < (_radius * _radius);
    }

    /**
     * Adds the given vector to this vector.
     */
    public add(_addend: Vector3): Vector3 {
      this.x += _addend.x;
      this.y += _addend.y;
      this.z += _addend.z;
      return this;
    }

    /**
     * Subtracts the given vector from this vector.
     */
    public subtract(_subtrahend: Vector3): Vector3 {
      this.x -= _subtrahend.x;
      this.y -= _subtrahend.y;
      this.z -= _subtrahend.z;
      return this;
    }

    /**
     * Scales this vector by the given scalar.
     */
    public scale(_scalar: number): Vector3 {
      this.x *= _scalar;
      this.y *= _scalar;
      this.z *= _scalar;
      return this;
    }

    /**
     * Normalizes this to the given length, 1 by default
     */
    public normalize(_length: number = 1): Vector3 {
      return this.copy(Vector3.NORMALIZATION(this, _length));
    }

    /**
     * Negates this vector by flipping the signs of its components
     */
    public negate(): Vector3 {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }

    /**
     * Projects this vector onto the given vector
     */
    public project(_on: Vector3): Vector3 {
      let scalar: number = Vector3.DOT(this, _on) / _on.magnitudeSquared;
      this.x = _on.x * scalar;
      this.y = _on.y * scalar;
      this.z = _on.z * scalar;
      return this;
    }

    /**
     * Sets the components of this vector and returns it.
     */
    public set(_x: number = 0, _y: number = 0, _z: number = 0): Vector3 {
      this.x = _x;
      this.y = _y;
      this.z = _z;
      return this;
    }

    /**
     * Returns an array of the components of this vector.
     */
    public get(): Float32Array { // TODO: eliminate allocation
      return new Float32Array([this.x, this.y, this.z]);
    }

    /**
     * Transforms this vector by the given matrix or rotation quaternion. 
     * Including or exluding the translation if a matrix is passed.
     * Including is the default, excluding will only rotate and scale this vector.
     */
    public transform(_transform: Matrix4x4 | Quaternion, _includeTranslation: boolean = true): Vector3 {
      let transformed: Vector3 = Vector3.TRANSFORMATION(this, _transform, _includeTranslation);
      this.copy(transformed);
      Recycler.store(transformed);
      return this;
    }

    /**
     * Drops the z-component and returns a Vector2 consisting of the x- and y-components
     */
    public toVector2(): Vector2 {
      return new Vector2(this.x, this.y);
    }

    /**
     * Reflects this vector at a given normal. See {@link Vector3.REFLECTION}
     */
    public reflect(_normal: Vector3): Vector3 {
      const reflected: Vector3 = Vector3.REFLECTION(this, _normal);
      this.set(reflected.x, reflected.y, reflected.z);
      Recycler.store(reflected);
      return this;
    }

    /**
     * Shuffles the components of this vector
     */
    public shuffle(): Vector3 {
      let a: number[] = [this.x, this.y, this.z];
      this.set(Random.default.splice(a), Random.default.splice(a), a[0]);
      return this;
    }

    /**
     * Returns the distance bewtween this vector and the given vector
     */
    public getDistance(_to: Vector3): number {
      let difference: Vector3 = Vector3.DIFFERENCE(this, _to);
      Recycler.store(difference);
      return difference.magnitude;
    }

    /**
     * For each dimension, moves the component to the minimum of this and the given vector
     */
    public min(_compare: Vector3): Vector3 {
      this.x = Math.min(this.x, _compare.x);
      this.y = Math.min(this.y, _compare.y);
      this.z = Math.min(this.z, _compare.z);
      return this;
    }

    /**
     * For each dimension, moves the component to the maximum of this and the given vector
     */
    public max(_compare: Vector3): Vector3 {
      this.x = Math.max(this.x, _compare.x);
      this.y = Math.max(this.y, _compare.y);
      this.z = Math.max(this.z, _compare.z);
      return this;
    }

    /**
     * Uses the standard array.map functionality to perform the given function on all components of this vector
     * and return a new vector with the results
     */
    public map(_function: (_value: number, _index: number, _array: ArrayLike<number>) => number): Vector3 {
      let copy: Vector3 = Recycler.get(Vector3);
      copy.set(...[this.x, this.y, this.z].map(_function));
      return copy;
    }

    /**
     * Applies the given function to all components of this vector (modifying it) and returns it.
     */
    public apply(_function: (_value: number, _index: number, _component: "x" | "y" | "z") => number): Vector3 {
      this.x = _function(this.x, 0, "x");
      this.y = _function(this.y, 1, "y");
      this.z = _function(this.z, 2, "z");
      return this;
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
    //#endregion Transfer
  }
}