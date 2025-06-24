namespace FudgeCore {
  /**
   * Stores and manipulates a fourdimensional vector comprised of the components x, y, z and w.
   * @authors Jonas Plotzky, HFU, 2023
   */
  export class Vector4 extends Mutable implements Serializable, Recycable, ArrayConvertible {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public constructor(_x: number = 0, _y: number = 0, _z: number = 0, _w: number = 0) {
      super();
      this.set(_x, _y, _z, _w);
    }

    //#region Static
    /**
     * Creates and returns a vector which is a copy of the given vector scaled to the given length.
     * @param _out Optional vector to store the result in.
     */
    public static NORMALIZATION(_vector: Vector4, _length: number = 1, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      return _out.copy(_vector).normalize(_length);
    }

    /**
     * Returns the result of the addition of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static SUM(_a: Vector4, _b: Vector4, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      return _out.set(_a.x + _b.x, _a.y + _b.y, _a.z + _b.z, _a.w + _b.w);
    }

    /**
     * Returns the result of the subtraction of two vectors.
     * @param _out Optional vector to store the result in.
     */
    public static DIFFERENCE(_minuend: Vector4, _subtrahend: Vector4, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      return _out.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y, _minuend.z - _subtrahend.z, _minuend.w - _subtrahend.w);
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor.
     * @param _out Optional vector to store the result in.
     */
    public static SCALE(_vector: Vector4, _scaling: number, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      return _out.set(_vector.x * _scaling, _vector.y * _scaling, _vector.z * _scaling, _vector.w * _scaling);
    }

    /**
     * Returns a new vector representing the given vector scaled by the given scaling factor.
     * @param _out Optional vector to store the result in.
     */
    public static NEGATION(_vector: Vector4, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      return _out.set(-_vector.x, -_vector.y, -_vector.z, -_vector.w);
    }

    /**
     * Computes the dotproduct of 2 vectors.
     */
    public static DOT(_a: Vector4, _b: Vector4): number {
      return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z + _a.w * _b.w;
    }
    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
    }

    /**
     * The magnitude (length) of the vector.
     */
    public get magnitude(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    /**
     * The squared magnitude (length) of the vector. Faster for simple proximity evaluation.
     */
    public get magnitudeSquared(): number {
      return Vector4.DOT(this, this);
    }

    /**
     * Creates and returns a clone of this vector.
     */
    public get clone(): Vector4 {
      return Recycler.reuse(Vector4).copy(this);
    }
    //#endregion

    //#region Instance
    /**
     * Copies the components of the given vector into this vector.
     * @returns A reference to this vector.
     */
    public copy(_original: Vector4): Vector4 {
      this.x = _original.x;
      this.y = _original.y;
      this.z = _original.z;
      this.w = _original.w;
      return this;
    }

    /**
     * Sets the components of this vector and returns it.
     * @returns A reference to this vector.
     */
    public set(_x: number, _y: number, _z: number, _w: number): Vector4 {
      this.x = _x;
      this.y = _y;
      this.z = _z;
      this.w = _w;
      return this;
    }

    public recycle(): void {
      this.set(0, 0, 0, 0);
    }

    /**
     * Returns true if this vector is equal to the given vector within the given tolerance.
     */
    public equals(_compare: Vector4, _tolerance: number = Number.EPSILON): boolean {
      return Math.abs(this.x - _compare.x) <= _tolerance &&
        Math.abs(this.y - _compare.y) <= _tolerance &&
        Math.abs(this.z - _compare.z) <= _tolerance &&
        Math.abs(this.w - _compare.w) <= _tolerance;
    }

    /**
     * Adds the given vector to this vector.
     * @returns A reference to this vector.
     */
    public add(_addend: Vector4): Vector4 {
      this.x += _addend.x;
      this.y += _addend.y;
      this.z += _addend.z;
      this.w += _addend.w;
      return this;
    }

    /**
     * Subtracts the given vector from this vector.
     * @returns A reference to this vector.
     */
    public subtract(_subtrahend: Vector4): Vector4 {
      this.x -= _subtrahend.x;
      this.y -= _subtrahend.y;
      this.z -= _subtrahend.z;
      this.w -= _subtrahend.w;
      return this;
    }

    /**
     * Scales this vector by the given scalar.
     * @returns A reference to this vector.
     */
    public scale(_scalar: number): Vector4 {
      this.x *= _scalar;
      this.y *= _scalar;
      this.z *= _scalar;
      this.w *= _scalar;
      return this;
    }

    /**
     * Negates this vector by flipping the signs of its components
     * @returns A reference to this vector.
     */
    public negate(): Vector4 {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.w = -this.w;
      return this;
    }

    /**
     * Normalizes this vector to the given length, 1 by default.
     * @returns A reference to this vector.
     */
    public normalize(_length: number = 1): Vector4 {
      let magnitudeSquared: number = this.magnitudeSquared;
      if (magnitudeSquared == 0)
        throw (new RangeError("Impossible normalization"));

      this.scale(_length / Math.sqrt(magnitudeSquared));
      return this;
    }

    /**
     * For each dimension, moves the component to the minimum of this and the given vector.
     * @returns A reference to this vector.
     */
    public min(_compare: Vector4): Vector4 {
      this.x = Math.min(this.x, _compare.x);
      this.y = Math.min(this.y, _compare.y);
      this.z = Math.min(this.z, _compare.z);
      this.w = Math.min(this.w, _compare.w);
      return this;
    }

    /**
     * For each dimension, moves the component to the maximum of this and the given vector.
     * @returns A reference to this vector.
     */
    public max(_compare: Vector4): Vector4 {
      this.x = Math.max(this.x, _compare.x);
      this.y = Math.max(this.y, _compare.y);
      this.z = Math.max(this.z, _compare.z);
      this.w = Math.max(this.w, _compare.w);
      return this;
    }

    /**
     * Calls a defined callback function on each component of the vector, and returns a new vector that contains the results. Similar to {@link Array.map}.
     * @param _out Optional vector to store the result in.
     */
    public map(_function: (_value: number, _index: number, _component: "x" | "y" | "z" | "w", _vector: Vector4) => number, _out: Vector4 = Recycler.reuse(Vector4)): Vector4 {
      _out.x = _function(this.x, 0, "x", this);
      _out.y = _function(this.y, 1, "y", this);
      _out.z = _function(this.z, 2, "z", this);
      _out.w = _function(this.w, 3, "w", this);
      return _out;
    }

    /**
     * Calls a defined callback function on each component of the vector and assigns the result to the component. Similar to {@link Vector4.map} but mutates this vector instead of creating a new one.
     * @returns A reference to this vector.
     */
    public apply(_function: (_value: number, _index: number, _component: "x" | "y" | "z" | "w", _vector: Vector4) => number): Vector4 {
      this.x = _function(this.x, 0, "x", this);
      this.y = _function(this.y, 1, "y", this);
      this.z = _function(this.z, 2, "z", this);
      this.w = _function(this.w, 3, "w", this);
      return this;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.x = _array[_offset];
      this.y = _array[_offset + 1];
      this.z = _array[_offset + 2];
      this.w = _array[_offset + 3];
      return this;
    }

    public toArray<T extends { [n: number]: number }>(_out: T = <T><unknown>new Array(4), _offset: number = 0): T {
      _out[_offset] = this.x;
      _out[_offset + 1] = this.y;
      _out[_offset + 2] = this.z;
      _out[_offset + 3] = this.w;
      return _out;
    }

    /**
     * Drops the z-component and w-component and returns a Vector2 consisting of the x- and y-components.
     * @param _out Optional vector to store the result in.
     */
    public toVector2(_out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      return _out.set(this.x, this.y);
    }

    /**
     * Drops the w-component and returns a Vector3 consisting of the x-, y- and z-components.
     * @param _out Optional vector to store the result in.
     */
    public toVector3(_out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _out.set(this.x, this.y, this.z);
    }

    /**
     * Returns a formatted string representation of this vector.
     */
    public toString(): string {
      let result: string = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)}, ${this.z.toPrecision(5)}, ${this.w.toPrecision(5)})`;
      return result;
    }

    public serialize(): Serialization {
      return { toJSON: () => `[${this.x}, ${this.y}, ${this.z}, ${this.w}]` };
    }

    public async deserialize(_serialization: Serialization): Promise<Vector4> {
      [this.x, this.y, this.z, this.w] = JSON.parse(<string><unknown>_serialization);
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
    }

    protected reduceMutator(_mutator: Mutator): void { /** */ };
    //#endregion
  }
}