namespace FudgeCore {
  /**
   * Stores and manipulates a twodimensional vector comprised of the components x and y
   * ```text
   *            +y
   *             |__ +x
   * ```
   * @authors Lukas Scheuerle, Jirka Dell'Oro-Friedl, HFU, 2019
   */
  export class Vector2 extends Mutable implements Serializable, Recycable {
    public x: number;
    public y: number;

    public constructor(_x: number = 0, _y: number = 0) {
      super();
      this.set(_x, _y);
    }

    //#region Static
    /** 
     * A shorthand for writing `new Vector2(0, 0)`.
     * @returns A new vector with the values (0, 0)
     */
    public static ZERO(): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(0, 0);
      return vector;
    }

    /** 
     * A shorthand for writing `new Vector2(_scale, _scale)`.
     * @param _scale the scale of the vector. Default: 1
     */
    public static ONE(_scale: number = 1): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(_scale, _scale);
      return vector;
    }

    /** 
     * A shorthand for writing `new Vector2(x, 0)`.
     * @param _scale The number to write in the x coordinate. Default: 1
     * @returns A new vector with the values (_scale, 0)
     */
    public static X(_scale: number = 1): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(_scale, 0);
      return vector;
    }

    /** 
     * A shorthand for writing `new Vector2(0, y)`.
     * @param _scale The number to write in the y coordinate. Default: 1
     * @returns A new vector with the values (0, _scale)
     */
    public static Y(_scale: number = 1): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(0, _scale);
      return vector;
    }

    /**
     * Creates and returns a vector through transformation of the given vector by the given matrix
     */
    public static TRANSFORMATION(_vector: Vector2, _mtxTransform: Matrix3x3, _includeTranslation: boolean = true): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      let m: Float32Array = _mtxTransform.get();
      vector.set(
        m[0] * _vector.x + m[3] * _vector.y,
        m[1] * _vector.x + m[4] * _vector.y
      );

      if (_includeTranslation)
        vector.add(_mtxTransform.translation);

      return vector;
    }

    /**
     * Creates and returns a vector which is a copy of the given vector scaled to the given length.
     */
    public static NORMALIZATION(_vector: Vector2, _length: number = 1): Vector2 {
      let magnitudeSquared: number = _vector.magnitudeSquared;
      if (magnitudeSquared == 0)
        throw (new RangeError("Impossible normalization"));
      let vector: Vector2 = _vector.clone;
      vector.scale(_length / Math.sqrt(magnitudeSquared));
      return vector;
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor
     */
    public static SCALE(_vector: Vector2, _scale: number): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(_vector.x * _scale, _vector.y * _scale);
      return vector;
    }

    /**
     * Returns the resulting vector attained by addition of all given vectors.
     */
    public static SUM(..._vectors: Vector2[]): Vector2 {
      const result: Vector2 = Recycler.get(Vector2);
      for (let vector of _vectors)
        result.set(result.x + vector.x, result.y + vector.y);
      return result;
    }

    /**
     * Returns the result of the subtraction of two vectors.
     */
    public static DIFFERENCE(_minuend: Vector2, _subtrahend: Vector2): Vector2 {
      const vector: Vector2 = Recycler.reuse(Vector2);
      vector.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y);
      return vector;
    }

    /**
     * Calculates the cross product of two Vectors. Due to them being only 2 Dimensional, the result is a single number,
     * which implicitly is on the Z axis. It is also the signed magnitude of the result.
     */
    public static CROSS(_a: Vector2, _b: Vector2): number {
      return _a.x * _b.y - _a.y * _b.x;
    }

    /**
     * Computes the dotproduct of 2 vectors.
     */
    public static DOT(_a: Vector2, _b: Vector2): number {
      return _a.x * _b.x + _a.y * _b.y;
    }

    /**
     * Calculates the orthogonal vector to the given vector. Rotates counterclockwise by default.
     * ```text
     * ↑ => ← => ↓ => → => ↑
     * ```
     * @param _vector Vector to get the orthogonal equivalent of
     * @param _clockwise Should the rotation be clockwise instead of the default counterclockwise? default: false
     * @returns A Vector that is orthogonal to and has the same magnitude as the given Vector.  
     */
    public static ORTHOGONAL(_vector: Vector2, _clockwise: boolean = false): Vector2 {
      let result: Vector2 = Recycler.reuse(Vector2);
      if (_clockwise)
        result.set(_vector.y, -_vector.x);
      else
        result.set(-_vector.y, _vector.x);
      return result;
    }

    /**
     * Creates a cartesian vector from polar coordinates
     */
    public static GEO(_angle: number = 0, _magnitude: number = 1): Vector2 {
      let vector: Vector2 = Recycler.reuse(Vector2);
      let geo: Geo2 = Recycler.reuse(Geo2);
      geo.set(_angle, _magnitude);
      vector.geo = geo;
      Recycler.store(geo);
      return vector;
    }
    //#endregion

    //#region Accessors
    /**
     * Returns the length of the vector
     */
    public get magnitude(): number {
      return Math.hypot(this.x, this.y);
    }

    /**
     * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
     */
    public get magnitudeSquared(): number {
      return Vector2.DOT(this, this);
    }

    /**
     * Returns a polar representation of this vector
     */
    public get geo(): Geo2 {
      let geo: Geo2 = Recycler.get(Geo2);
      geo.magnitude = this.magnitude;

      if (geo.magnitude === 0)
        return geo;

      geo.angle = 180 * Math.atan2(this.y / geo.magnitude, this.x / geo.magnitude) / Math.PI;
      return geo;
    }

    /**
     * Adjust the cartesian values of this vector to represent the given as polar coordinates
     */
    public set geo(_geo: Geo2) {
      this.set(_geo.magnitude, 0);
      this.transform(Matrix3x3.ROTATION(_geo.angle));
    }

    /**
     * Creates and returns a clone of this vector.
     */
    public get clone(): Vector2 {
      return Recycler.reuse(Vector2).copy(this);
    }
    //#endregion

    /**
     * Copies the components of the given vector into this vector.
     */
    public copy(_original: Vector2): Vector2 {
      return this.set(_original.x, _original.y);
    }

    public recycle(): void {
      this.set(0, 0);
    }

    /**
     * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
     * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
     */
    public equals(_compare: Vector2, _tolerance: number = Number.EPSILON): boolean {
      if (Math.abs(this.x - _compare.x) > _tolerance) return false;
      if (Math.abs(this.y - _compare.y) > _tolerance) return false;
      return true;
    }

    /**
     * Adds the given vector to the executing vector, changing the executor.
     * @param _addend The vector to add.
     */
    public add(_addend: Vector2): Vector2 {
      this.x += _addend.x;
      this.y += _addend.y;
      return this;
    }

    /**
     * Subtracts the given vector from the executing vector, changing the executor.
     * @param _subtrahend The vector to subtract.
     */
    public subtract(_subtrahend: Vector2): Vector2 {
      this.x -= _subtrahend.x;
      this.y -= _subtrahend.y;
      return this;
    }

    /**
     * Scales the Vector by the given _scalar.
     */
    public scale(_scalar: number): Vector2 {
      this.x *= _scalar;
      this.y *= _scalar;
      return this;
    }

    /**
     * Normalizes this to the given length, 1 by default
     */
    public normalize(_length: number = 1): Vector2 {
      return this.copy(Vector2.NORMALIZATION(this, _length));
    }

    /**
     * Sets the components of this vector.
     */
    public set(_x: number = 0, _y: number = 0): Vector2 {
      this.x = _x;
      this.y = _y;
      return this;
    }

    /**
     * Returns an array of the components of this vector.
     */
    public get(): Float32Array {
      return new Float32Array([this.x, this.y]);
    }

    /**
     * Transforms this vector by the given matrix, including or exluding the translation.
     * Including is the default, excluding will only rotate and scale this vector.
     */
    public transform(_mtxTransform: Matrix3x3, _includeTranslation: boolean = true): Vector2 {
      let transformed: Vector2 = Vector2.TRANSFORMATION(this, _mtxTransform, _includeTranslation);
      this.copy(transformed);
      Recycler.store(transformed);
      return this;
    }

    /**
     * For each dimension, moves the component to the minimum of this and the given vector
     */
    public min(_compare: Vector2): Vector2 {
      this.x = Math.min(this.x, _compare.x);
      this.y = Math.min(this.y, _compare.y);
      return this;
    }
    /**
     * For each dimension, moves the component to the maximum of this and the given vector
     */
    public max(_compare: Vector2): Vector2 {
      this.x = Math.max(this.x, _compare.x);
      this.y = Math.max(this.y, _compare.y);
      return this;
    }

    /**
     * Adds a z-component of the given magnitude (default=0) to the vector and returns a new Vector3
     */
    public toVector3(_z: number = 0): Vector3 {
      return new Vector3(this.x, this.y, _z);
    }

    /**
     * Returns a formatted string representation of this vector
     */
    public toString(): string {
      let result: string = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)})`;
      return result;
    }

    /**
     * Uses the standard array.map functionality to perform the given function on all components of this vector
     * and return a new vector with the results
     */
    public map(_function: (value: number, index: number, array: ArrayLike<number>) => number): Vector2 {
      let copy: Vector2 = Recycler.get(Vector2);
      copy.set(...[this.x, this.y].map(_function));
      return copy;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = this.getMutator();
      // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
      serialization.toJSON = () => { return `[${this.x}, ${this.y}]`; };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Vector2> {
      if (typeof (_serialization) == "string") {
        [this.x, this.y] = JSON.parse(<string><unknown>_serialization);
      } else
        this.mutate(_serialization);
      return this;
    }

    public getMutator(): Mutator {
      let mutator: Mutator = {
        x: this.x, y: this.y
      };
      return mutator;
    }
    protected reduceMutator(_mutator: Mutator): void {/** */ }
    //#endregion
  }
}