namespace FudgeCore {
  /**
   * Simple class for 3x3 matrix operations
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020 | Jonas Plotzky, HFU, 2025
   */
  export class Matrix3x3 extends Mutable implements Serializable, Recycable, ArrayConvertible {
    private data: Float32Array = new Float32Array(9); // The data of the matrix.
    private mutator: Mutator = null; // prepared for optimization, keep mutator to reduce redundant calculation and for comparison. Set to null when data changes!

    readonly #translation: Vector2 = Vector2.ZERO();
    readonly #scaling: Vector2 = Vector2.ONE();
    #rotation: number = 0;

    #translationDirty: boolean = false;
    #rotationDirty: boolean = false;
    #scalingDirty: boolean = false;

    public constructor() {
      super();
      this.recycle();
    }

    //#region Static
    //TODO: figure out what this is used for
    /** TODO: describe! */
    public static PROJECTION(_width: number, _height: number, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      return _mtxOut.set(
        2 / _width, 0, 0,
        0, -2 / _height, 0,
        -1, 1, 1
      );
    }

    /**
     * Retrieve a new identity matrix.
     */
    public static IDENTITY(): Matrix3x3 {
      return Recycler.get(Matrix3x3);
    }

    /**
     * Composes a new matrix according to the given translation, rotation and scaling.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static COMPOSITION(_translation?: Vector2, _rotation?: number, _scaling?: Vector2, _mtxOut: Matrix3x3 = Recycler.get(Matrix3x3)): Matrix3x3 {
      return _mtxOut.compose(_translation, _rotation, _scaling);
    }

    /**
     * Returns a matrix that translates coordinates along the x- and y-axis according to the given {@link Vector2}.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static TRANSLATION(_translate: Vector2, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      return _mtxOut.set(
        1, 0, 0,
        0, 1, 0,
        _translate.x, _translate.y, 1
      );
    }

    /**
     * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
     * @param _angleInDegrees The value of the rotation.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION(_angleInDegrees: number, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      return _mtxOut.set(
        cos, sin, 0,
        -sin, cos, 0,
        0, 0, 1
      );
    }

    /**
     * Returns a matrix that scales coordinates along the x- and y-axis according to the given {@link Vector2}.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static SCALING(_scalar: Vector2, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      return _mtxOut.set(
        _scalar.x, 0, 0,
        0, _scalar.y, 0,
        0, 0, 1
      );
    }
    //#endregion

    /**
     * Computes and returns the product of two passed matrices.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static PRODUCT(_mtxLeft: Matrix3x3, _mtxRight: Matrix3x3, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      const left: Float32Array = _mtxLeft.data;
      const right: Float32Array = _mtxRight.data;

      const a00: number = left[0], a01: number = left[1], a02: number = left[2];
      const a10: number = left[3], a11: number = left[4], a12: number = left[5];
      const a20: number = left[6], a21: number = left[7], a22: number = left[8];

      const b00: number = right[0], b01: number = right[1], b02: number = right[2];
      const b10: number = right[3], b11: number = right[4], b12: number = right[5];
      const b20: number = right[6], b21: number = right[7], b22: number = right[8];

      return _mtxOut.set(
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22
      );
    }

    /**
     * Computes and returns the inverse of a passed matrix.
     * @param _mtx The matrix to compute the inverse of.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static INVERSE(_mtx: Matrix3x3, _mtxOut: Matrix3x3 = Recycler.reuse(Matrix3x3)): Matrix3x3 {
      const m: Float32Array = _mtx.data;
      const m00: number = m[0], m01: number = m[1], m02: number = m[2];
      const m10: number = m[3], m11: number = m[4], m12: number = m[5];
      const m20: number = m[6], m21: number = m[7], m22: number = m[8];

      let d: number = 1 /
        (m00 * (m11 * m22 - m21 * m12) -
          m01 * (m10 * m22 - m12 * m20) +
          m02 * (m10 * m21 - m11 * m20));

      return _mtxOut.set(
        d * (m11 * m22 - m21 * m12),
        d * (m02 * m21 - m01 * m22),
        d * (m01 * m12 - m02 * m11),
        d * (m12 * m20 - m10 * m22),
        d * (m00 * m22 - m02 * m20),
        d * (m10 * m02 - m00 * m12),
        d * (m10 * m21 - m20 * m11),
        d * (m20 * m01 - m00 * m21),
        d * (m00 * m11 - m10 * m01)
      );
    }
    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
    }

    /** 
     * - get: return a vector representation of the translation {@link Vector2}.  
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix ignoring its rotation and scaling
     */
    public get translation(): Vector2 {
      if (this.#translationDirty) {
        this.#translationDirty = false;
        this.#translation.set(this.data[6], this.data[7]);
      }
      return this.#translation;
    }
    public set translation(_translation: Vector2) {
      this.compose(_translation, undefined, undefined);
    }

    /** 
     * - get: a copy of the calculated rotation {@link Vector2}   
     * - set: effect the matrix
     */
    public get rotation(): number {
      if (this.#rotationDirty) {
        let scaling: Vector2 = this.scaling;

        let s0: number = this.data[0] / scaling.x;
        let s1: number = this.data[1] / scaling.x;
        let s3: number = this.data[3] / scaling.y;
        let s4: number = this.data[4] / scaling.y;

        let xSkew: number = Math.atan2(-s3, s4);
        let ySkew: number = Math.atan2(s0, s1);

        let sy: number = Math.sqrt(s0 * s0 + s1 * s1); // probably 2. param should be this.data[4] / scaling.y
        let rotation: number;

        if (!(sy > 1e-6))
          rotation = ySkew;
        else
          rotation = xSkew;

        rotation *= Calc.rad2deg;

        this.#rotation = rotation;
        this.#rotationDirty = false;
      }
      return this.#rotation;
    }
    public set rotation(_rotation: number) {
      this.compose(undefined, _rotation, undefined);
    }

    /** 
     * - get: return a vector representation of the scale {@link Vector3}.  
     * **Caution!** Do not manipulate result, instead create a clone!    
     * - set: effect the matrix
     */
    public get scaling(): Vector2 {
      if (this.#scalingDirty) {
        this.#scaling.set(
          Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1]) * (this.data[0] < 0 ? -1 : 1),
          Math.sqrt(this.data[3] * this.data[3] + this.data[4] * this.data[4]) * (this.data[4] < 0 ? -1 : 1)
        );
        this.#scalingDirty = false;
      }
      return this.#scaling;
    }
    public set scaling(_scaling: Vector2) {
      this.compose(undefined, undefined, _scaling);
    }

    /**
     * Creates and returns a clone of this matrix.
     */
    public get clone(): Matrix3x3 {
      return Recycler.reuse(Matrix3x3).copy(this);
    }
    //#endregion

    /**
     * Resets the matrix to the identity-matrix and clears cache. Used by the recycler to reset.
     */
    public recycle(): void {
      this.set(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      );
    }

    /**
     * Resets the matrix to the identity-matrix and clears cache.
     */
    public reset(): void {
      this.recycle();
    }
    //#region Instance
    //#region Translation
    /**
     * Adds a translation by the given {@link Vector2} to this matrix.
     * @returns A reference to this matrix.
     */
    public translate(_by: Vector2): Matrix3x3 {
      const mtxTranslation: Matrix3x3 = Matrix3x3.TRANSLATION(_by);
      Matrix3x3.PRODUCT(this, mtxTranslation, this);
      Recycler.store(mtxTranslation);
      return this;
    }

    /**
     * Adds a translation along the x-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public translateX(_by: number): Matrix3x3 {
      const translation: Vector2 = Recycler.reuse(Vector2).set(_by, 0);
      this.translate(translation);
      Recycler.store(translation);
      return this;
    }

    /**
     * Adds a translation along the y-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public translateY(_by: number): Matrix3x3 {
      const translation: Vector2 = Recycler.reuse(Vector2).set(0, _by);
      this.translate(translation);
      Recycler.store(translation);
      return this;
    }
    //#endregion

    //#region Rotation
    /**
     * Adds a rotation around the z-Axis to this matrix
     * @returns A reference to this matrix.
     */
    public rotate(_angleInDegrees: number): Matrix3x3 {
      const mtxRotation: Matrix3x3 = Matrix3x3.ROTATION(_angleInDegrees);
      Matrix3x3.PRODUCT(this, mtxRotation, this);
      Recycler.store(mtxRotation);
      return this;
    }
    //#endregion

    //#region Scaling
    /**
     * Adds a scaling by the given {@link Vector2} to this matrix.
     * @returns A reference to this matrix.
     */
    public scale(_by: Vector2): Matrix3x3 {
      const mtxScaling: Matrix3x3 = Matrix3x3.SCALING(_by);
      Matrix3x3.PRODUCT(this, mtxScaling, this);
      Recycler.store(mtxScaling);
      return this;
    }

    /**
     * Adds a scaling along the x-Axis to this matrix.
     * @returns A reference to this matrix.
     */
    public scaleX(_by: number): Matrix3x3 {
      const scaling: Vector2 = Recycler.reuse(Vector2).set(_by, 1);
      this.scale(scaling);
      Recycler.store(scaling);
      return this;
    }

    /**
     * Adds a scaling along the y-Axis to this matrix.
     * @returns A reference to this matrix.
     */
    public scaleY(_by: number): Matrix3x3 {
      const scaling: Vector2 = Recycler.reuse(Vector2).set(1, _by);
      this.scale(scaling);
      Recycler.store(scaling);
      return this;
    }
    //#endregion

    //#region Transformation
    /**
     * Multiply this matrix with the given matrix.
     * @returns A reference to this matrix.
     */
    public multiply(_mtxRight: Matrix3x3): Matrix3x3 {
      return Matrix3x3.PRODUCT(this, _mtxRight, this);
    }

    /**
     * Premultiply this matrix with the given matrix.
     * @returns A reference to this matrix.
     */
    public premultiply(_mtxLeft: Matrix3x3): Matrix3x3 {
      return Matrix3x3.PRODUCT(_mtxLeft, this, this);
    }
    //#endregion

    //#region Transfer
    /**
     * (Re-)Compose this matrix from the given translation, rotation and scaling. 
     * Missing values will be decompsed from the current matrix state if necessary.
     * @returns A reference to this matrix.
     */
    public compose(_translation?: Partial<Vector2>, _rotation?: number, _scaling?: Partial<Vector2>): Matrix3x3 {
      const m: Float32Array = this.data;

      if (_translation) {
        const translation: Vector2 = this.translation;
        translation.mutate(_translation);
        m[6] = translation.x;
        m[7] = translation.y;
        this.#translationDirty = false;
      }

      if (_rotation || _scaling) {
        const rotation: number = _rotation ?? this.rotation;
        if (_rotation != undefined)
          this.#rotation = rotation;

        const scaling: Vector2 = this.scaling;
        if (_scaling)
          scaling.mutate(_scaling);

        const angleInRadians: number = rotation * Calc.deg2rad;
        const sin: number = Math.sin(angleInRadians);
        const cos: number = Math.cos(angleInRadians);

        m[0] = cos * scaling.x;
        m[1] = sin * scaling.x;

        m[3] = -sin * scaling.y;
        m[4] = cos * scaling.y;

        this.#rotationDirty = false;
        this.#scalingDirty = false;
      }

      this.mutator = null;

      return this;
    }

    /**
     * Sets the elements of this matrix to the given values.
     * @returns A reference to this matrix.
     */
    public set(_m00: number, _m01: number, _m02: number, _m10: number, _m11: number, _m12: number, _m20: number, _m21: number, _m22: number): Matrix3x3 {
      const m: Float32Array = this.data;

      m[0] = _m00; m[1] = _m01; m[2] = _m02;
      m[3] = _m10; m[4] = _m11; m[5] = _m12;
      m[6] = _m20; m[7] = _m21; m[8] = _m22;

      this.resetCache();
      return this;
    }

    /**
     * Copies the elements of the given matrix into this matrix.
     * @returns A reference to this matrix.
     */
    public copy(_original: Matrix3x3): Matrix3x3 {
      this.data.set(_original.data);
      this.mutator = null;
      this.#translationDirty = _original.#translationDirty;
      this.#rotationDirty = _original.#rotationDirty;
      this.#scalingDirty = _original.#scalingDirty;
      if (!this.#translationDirty)
        this.#translation.copy(_original.#translation);
      if (!this.#rotationDirty)
        this.#rotation = _original.#rotation;
      if (!this.#scalingDirty)
        this.#scaling.copy(_original.#scaling);
      return this;
    }

    /**
     * Returns a formatted string representation of this matrix
     */
    public toString(): string {
      return `ƒ.Matrix3x3(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.data.set(_array, _offset);
      this.resetCache();
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(9), _offset: number = 0): T {
      const m: Float32Array = this.data;
      _out[_offset + 0] = m[0]; _out[_offset + 1] = m[1]; _out[_offset + 2] = m[2];
      _out[_offset + 3] = m[3]; _out[_offset + 4] = m[4]; _out[_offset + 5] = m[5];
      _out[_offset + 6] = m[6]; _out[_offset + 7] = m[7]; _out[_offset + 8] = m[8];

      return _out;
    }

    /**
     * Returns the array of the elements of this matrix.
     * @returns A readonly view of the internal array.
     */
    public getArray(): ArrayLike<number> & Iterable<number> & ArrayBufferView {
      return this.data;
    }

    public serialize(): Serialization {
      // this.getMutator();
      let serialization: Serialization = {
        translation: this.translation.serialize(),
        rotation: this.rotation,
        scaling: this.scaling.serialize()
      };
      return serialization;
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      let mutator: Mutator = {
        translation: await this.translation.deserialize(_serialization.translation),
        rotation: _serialization.rotation,
        scaling: await this.scaling.deserialize(_serialization.scaling)
      };
      this.mutate(mutator);
      return this;
    }

    public getMutator(): Mutator {
      if (this.mutator)
        return this.mutator;

      let mutator: Mutator = {
        translation: this.translation.getMutator(),
        rotation: this.rotation,
        scaling: this.scaling.getMutator()
      };

      // cache mutator
      this.mutator = mutator;
      return mutator;
    }

    // Optimized mutate method to directly update matrix values
    public mutate(_mutator: Mutator): void {
      this.compose(_mutator.translation, _mutator.rotation, _mutator.scaling);
    }

    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = {};
      if (_mutator.translation) types.translation = "Vector2";
      if (_mutator.rotation != undefined) types.rotation = "number";
      if (_mutator.scaling) types.scaling = "Vector2";
      return types;
    }
    protected reduceMutator(_mutator: Mutator): void {/** */ }

    private resetCache(): void {
      this.#translationDirty = true;
      this.#rotationDirty = true;
      this.#scalingDirty = true;
      this.mutator = null;
    }
    //#endregion
    //#endregion
  }
}