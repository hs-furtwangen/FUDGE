namespace FudgeCore {
  /**
   * Stores and manipulates a twodimensional vector comprised of the components x and y
   * ```text
   *            +y
   *             |__ +x
   * ```
   * @authors Lukas Scheuerle, Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
   */
  export class Vector2 extends Mutable implements Serializable, Recycable, ArrayConvertible {
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
      return Recycler.get(Vector2);
    }

    /** 
     * A shorthand for writing `new Vector2(_scale, _scale)`.
     * @param _scale the scale of the vector. Default: 1
     */
    public static ONE(_scale: number = 1): Vector2 {
      return Recycler.reuse(Vector2).set(_scale, _scale);
    }

    /** 
     * A shorthand for writing `new Vector2(x, 0)`.
     * @param _scale The number to write in the x coordinate. Default: 1
     * @returns A new vector with the values (_scale, 0)
     */
    public static X(_scale: number = 1): Vector2 {
      return Recycler.reuse(Vector2).set(_scale, 0);
    }

    /** 
     * A shorthand for writing `new Vector2(0, y)`.
     * @param _scale The number to write in the y coordinate. Default: 1
     * @returns A new vector with the values (0, _scale)
     */
    public static Y(_scale: number = 1): Vector2 {
      return Recycler.reuse(Vector2).set(0, _scale);
    }

    /**
     * Creates and returns a vector through transformation of the given vector by the given matrix
     * @param _out Optional vector to store the result in.
     */
    public static TRANSFORMATION(_vector: Vector2, _mtxTransform: Matrix3x3, _includeTranslation: boolean = true, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      let m: ArrayLike<number> = _mtxTransform.getArray();

      _out.set(
        m[0] * _vector.x + m[3] * _vector.y,
        m[1] * _vector.x + m[4] * _vector.y
      );

      if (_includeTranslation)
        _out.add(_mtxTransform.translation);

      return _out;
    }

    /**
     * Creates and returns a vector which is a copy of the given vector scaled to the given length.
     * @param _out Optional vector to store the result in.
     */
    public static NORMALIZATION(_vector: Vector2, _length: number = 1, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.copy(_vector).normalize(_length);
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor
     * @param _out Optional vector to store the result in.
     */
    public static SCALE(_vector: Vector2, _scale: number, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(_vector.x * _scale, _vector.y * _scale);
    }

    /**
     * Returns the result of the addition of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static SUM(_a: Vector2, _b: Vector2, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(_a.x + _b.x, _a.y + _b.y);
    }

    /**
     * Returns the result of the subtraction of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static DIFFERENCE(_minuend: Vector2, _subtrahend: Vector2, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y);
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor.
     * @param _out Optional vector to store the result in.
     */
    public static NEGATION(_vector: Vector2, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(-_vector.x, -_vector.y);
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
     * @param _out Optional vector to store the result in.
     * @returns A Vector that is orthogonal to and has the same magnitude as the given Vector.  
     */
    public static ORTHOGONAL(_vector: Vector2, _clockwise: boolean = false, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      if (_clockwise)
        return _out.set(_vector.y, -_vector.x);
      else
        return _out.set(-_vector.y, _vector.x);
    }

    /**
     * Creates a cartesian vector from polar coordinates.
     * @param _out Optional vector to store the result in.
     */
    public static GEO(_angle: number = 0, _magnitude: number = 1, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      const geo: Geo2 = Recycler.reuse(Geo2).set(_angle, _magnitude);
      _out.geo = geo;
      Recycler.store(geo);
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
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
     */
    public get magnitudeSquared(): number {
      return this.x * this.x + this.y * this.y;
    }

    /**
     * - get: Returns a polar representation of this vector
     * - set: Adjusts the cartesian values of this vector to represent the given as polar coordinates
     */
    public get geo(): Geo2 {
      let geo: Geo2 = Recycler.get(Geo2);
      geo.magnitude = this.magnitude;

      if (geo.magnitude === 0)
        return geo;

      geo.angle = 180 * Math.atan2(this.y / geo.magnitude, this.x / geo.magnitude) / Math.PI;
      return geo;
    }

    public set geo(_geo: Geo2) {
      this.set(_geo.magnitude, 0);
      const rotation: Matrix3x3 = Matrix3x3.ROTATION(_geo.angle);
      this.transform(rotation);
      Recycler.store(rotation);
    }

    /**
     * Creates and returns a clone of this vector.
     */
    public get clone(): Vector2 {
      return Recycler.reuse(Vector2).copy(this);
    }
    //#endregion

    //#region Instance
    /**
     * Copies the components of the given vector into this vector.
     * @returns A reference to this vector.
     */
    public copy(_original: Vector2): Vector2 {
      this.x = _original.x;
      this.y = _original.y;
      return this;
    }

    /**
     * Sets the components of this vector.
     * @returns A reference to this vector.
     */
    public set(_x: number = 0, _y: number = 0): Vector2 {
      this.x = _x;
      this.y = _y;
      return this;
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
     * Returns the distance bewtween this vector and the given vector.
     */
    public getDistance(_to: Vector2): number {
      let difference: Vector2 = Vector2.DIFFERENCE(this, _to);
      Recycler.store(difference);
      return difference.magnitude;
    }

    /**
     * Adds the given vector to this vector.
     * @returns A reference to this vector.
     */
    public add(_addend: Vector2): Vector2 {
      this.x += _addend.x;
      this.y += _addend.y;
      return this;
    }

    /**
     * Subtracts the given vector from this vector.
     * @returns A reference to this vector.
     */
    public subtract(_subtrahend: Vector2): Vector2 {
      this.x -= _subtrahend.x;
      this.y -= _subtrahend.y;
      return this;
    }

    /**
     * Scales the Vector by the given _scalar.
     * @returns A reference to this vector.
     */
    public scale(_scalar: number): Vector2 {
      this.x *= _scalar;
      this.y *= _scalar;
      return this;
    }

    /**
     * Negates this vector by flipping the signs of its components
     * @returns A reference to this vector.
     */
    public negate(): Vector2 {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }

    /**
     * Normalizes this to the given length, 1 by default
     * @returns A reference to this vector.
     */
    public normalize(_length: number = 1): Vector2 {
      let magnitudeSquared: number = this.magnitudeSquared;
      if (magnitudeSquared == 0)
        throw (new RangeError("Impossible normalization"));

      this.scale(_length / Math.sqrt(magnitudeSquared));
      return this;
    }

    /**
     * Transforms this vector by the given matrix, including or exluding the translation.
     * Including is the default, excluding will only rotate and scale this vector.
     * @returns A reference to this vector.
     */
    public transform(_mtxTransform: Matrix3x3, _includeTranslation: boolean = true): Vector2 {
      return Vector2.TRANSFORMATION(this, _mtxTransform, _includeTranslation, this);
    }

    /**
     * For each dimension, moves the component to the minimum of this and the given vector.
     * @returns A reference to this vector.
     */
    public min(_compare: Vector2): Vector2 {
      this.x = Math.min(this.x, _compare.x);
      this.y = Math.min(this.y, _compare.y);
      return this;
    }

    /**
     * For each dimension, moves the component to the maximum of this and the given vector.
     * @returns A reference to this vector.
     */
    public max(_compare: Vector2): Vector2 {
      this.x = Math.max(this.x, _compare.x);
      this.y = Math.max(this.y, _compare.y);
      return this;
    }

    /**
     * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
     * @param _out Optional vector to store the result in.
     */
    public map(_function: (_value: number, _index: number, _component: "x" | "y", _vector: Vector2) => number, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      _out.x = _function(this.x, 0, "x", this);
      _out.y = _function(this.y, 1, "y", this);
      return _out;
    }

    /**
     * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector2.map} but mutates this vector instead of creating a new one.
     * @returns A reference to this vector.
     */
    public apply(_function: (_value: number, _index: number, _component: "x" | "y", _vector: Vector2) => number): Vector2 {
      this.x = _function(this.x, 0, "x", this);
      this.y = _function(this.y, 1, "y", this);
      return this;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.x = _array[_offset];
      this.y = _array[_offset + 1];
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(2), _offset: number = 0): T {
      _out[_offset] = this.x;
      _out[_offset + 1] = this.y;
      return _out;
    }

    /**
     * Adds a z-component of the given magnitude (default=0) to the vector and returns a new Vector3.
     * @param _out Optional vector to store the result in.
     */
    public toVector3(_z: number = 0, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _out.set(this.x, this.y, _z);
    }

    /**
     * Returns a formatted string representation of this vector.
     */
    public toString(): string {
      let result: string = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)})`;
      return result;
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

    public override mutate(_mutator: Mutator): void {
      if (_mutator.x != undefined)
        this.x = _mutator.x;
      if (_mutator.y != undefined)
        this.y = _mutator.y;
    }

    protected reduceMutator(_mutator: Mutator): void {/** */ }
    //#endregion
    //#endregion
  }
}