namespace FudgeCore {
  /**
   * Stores a 4x4 transformation matrix and provides operations for it.
   * ```text
   * [ 0, 1, 2, 3 ] ← row vector x
   * [ 4, 5, 6, 7 ] ← row vector y
   * [ 8, 9,10,11 ] ← row vector z
   * [12,13,14,15 ] ← translation
   *            ↑  homogeneous column
   * ```
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2023-2025
   */
  export class Matrix4x4 extends Mutable implements Serializable, Recycable, ArrayConvertible {
    /** @internal Indicates whether this matrix was modified since the last call to {@link Render.prepare}. */
    public modified: boolean;

    private data: Float32Array = new Float32Array(16); // The data of the matrix.
    private mutator: Mutator = null; // prepared for optimization, keep mutator to reduce redundant calculation and for comparison. Set to null when data changes!

    readonly #translation: Vector3 = Vector3.ZERO();
    readonly #scaling: Vector3 = Vector3.ZERO();
    readonly #rotation: Vector3 = Vector3.ONE();
    readonly #quaternion: Quaternion = Quaternion.IDENTITY();

    #translationDirty: boolean;
    #scalingDirty: boolean;
    #rotationDirty: boolean;
    #quaternionDirty: boolean;

    public constructor(_data?: Float32Array) {
      super();
      if (!_data) {
        this.recycle();
        return;
      }

      this.data = _data;
      this.resetCache();
    }

    //#region Static
    /**
     * Retrieve a new identity matrix
     */
    public static IDENTITY(): Matrix4x4 {
      return Recycler.get(Matrix4x4);
    }

    /**
     * Composes a new matrix according to the given translation, rotation and scaling.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static COMPOSITION(_translation?: Vector3, _rotation?: Vector3 | Quaternion, _scaling?: Vector3, _mtxOut: Matrix4x4 = Recycler.get(Matrix4x4)): Matrix4x4 {
      return _mtxOut.compose(_translation, _rotation, _scaling);
    }

    /**
     * Multiplies two matrices.
     * @param _a - the first operand.
     * @param _b - the second operand.
     * @param _out - (optional) the receiving matrix.
     * @returns `_out` or a new matrix if none is provided.
     * @source https://github.com/toji/gl-matrix
     */
    public static PRODUCT(_a: Matrix4x4, _b: Matrix4x4, _out: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      const a: Float32Array = _a.data;
      const b: Float32Array = _b.data;
      const out: Float32Array = _out.data;

      const a00: number = a[0], a01: number = a[1], a02: number = a[2], a03: number = a[3];
      const a10: number = a[4], a11: number = a[5], a12: number = a[6], a13: number = a[7];
      const a20: number = a[8], a21: number = a[9], a22: number = a[10], a23: number = a[11];
      const a30: number = a[12], a31: number = a[13], a32: number = a[14], a33: number = a[15];

      // Cache only the current line of the second matrix
      let b0: number = b[0];
      let b1: number = b[1];
      let b2: number = b[2];
      let b3: number = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      _out.resetCache();

      return _out;
    }

    /**
     * Computes and returns the transpose of a passed matrix.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static TRANSPOSE(_mtx: Matrix4x4, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      const m: Float32Array = _mtx.data;
      return _mtxOut.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      );;
    }

    /**
     * Computes and returns the inverse of a passed matrix.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static INVERSE(_mtx: Matrix4x4, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      const m: Float32Array = _mtx.data;
      const m00: number = m[0], m01: number = m[1], m02: number = m[2], m03: number = m[3];
      const m10: number = m[4], m11: number = m[5], m12: number = m[6], m13: number = m[7];
      const m20: number = m[8], m21: number = m[9], m22: number = m[10], m23: number = m[11];
      const m30: number = m[12], m31: number = m[13], m32: number = m[14], m33: number = m[15];
      const tmp0: number = m22 * m33;
      const tmp1: number = m32 * m23;
      const tmp2: number = m12 * m33;
      const tmp3: number = m32 * m13;
      const tmp4: number = m12 * m23;
      const tmp5: number = m22 * m13;
      const tmp6: number = m02 * m33;
      const tmp7: number = m32 * m03;
      const tmp8: number = m02 * m23;
      const tmp9: number = m22 * m03;
      const tmp10: number = m02 * m13;
      const tmp11: number = m12 * m03;
      const tmp12: number = m20 * m31;
      const tmp13: number = m30 * m21;
      const tmp14: number = m10 * m31;
      const tmp15: number = m30 * m11;
      const tmp16: number = m10 * m21;
      const tmp17: number = m20 * m11;
      const tmp18: number = m00 * m31;
      const tmp19: number = m30 * m01;
      const tmp20: number = m00 * m21;
      const tmp21: number = m20 * m01;
      const tmp22: number = m00 * m11;
      const tmp23: number = m10 * m01;

      const t0: number = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
        (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);

      const t1: number = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
        (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
      const t2: number = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
        (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
      const t3: number = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
        (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);

      const d: number = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

      return _mtxOut.set(
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),
        d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),
        d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),
        d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),
        d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)),
        d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)),
        d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)),
        d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)),
        d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)),
        d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)),
        d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)),
        d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02))
      );
    }

    /**
     * Computes and returns a matrix with the given translation, its z-axis pointing directly at the given target,
     * and a minimal angle between its y-axis and the given up-{@link Vector3}, respetively calculating yaw and pitch.
     * The pitch may be restricted to the up-vector to only calculate yaw. Optionally pass a desired scaling.
     * @param _up A unit vector indicating the up-direction.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static LOOK_AT(_translation: Vector3, _target: Vector3, _up?: Vector3, _restrict: boolean = false, _scaling?: Vector3, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      const forward: Vector3 = Vector3.DIFFERENCE(_target, _translation);
      forward.normalize();

      Matrix4x4.LOOK_IN(forward, _up, _restrict, _translation, _scaling, _mtxOut);

      Recycler.store(forward);

      return _mtxOut;
    }

    /**
     * Computes and returns a matrix with its z-axis pointing directly in the given forward direction,
     * and a minimal angle between its y-axis and the given up direction. The pitch may be restricted to the up-vector to only calculate yaw.
     * Optionally pass a desired translation and/or scaling.
     * @param _forward A unit vector indicating the desired forward-direction.
     * @param _up A unit vector indicating the up-direction.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static LOOK_IN(_forward: Vector3, _up?: Vector3, _restrict: boolean = false, _translation?: Vector3, _scaling?: Vector3, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      const zAxis: Vector3 = _forward.clone;
      const yAxis: Vector3 = _up ? _up.clone : Vector3.Y();
      const xAxis: Vector3 = Vector3.CROSS(yAxis, zAxis);

      // if z and up is parallel, there is no up to remain...
      if (xAxis.magnitudeSquared == 0) { // from three.js 
        if (Math.abs(yAxis.z) === 1)
          zAxis.x += 0.0001;
        else
          zAxis.z += 0.0001;

        zAxis.normalize();
        Vector3.CROSS(yAxis, zAxis, xAxis);
      }

      xAxis.normalize();

      if (_restrict)
        Vector3.CROSS(xAxis, yAxis, zAxis);
      else
        Vector3.CROSS(zAxis, xAxis, yAxis);

      const scaling: Vector3 = _mtxOut.#scaling;
      if (_scaling) {
        scaling.copy(_scaling);
        xAxis.scale(scaling.x);
        yAxis.scale(scaling.y);
        zAxis.scale(scaling.z);
      } else {
        scaling.set(1, 1, 1);
      }

      const translation: Vector3 = _mtxOut.#translation;
      if (_translation)
        translation.copy(_translation);
      else
        translation.set(0, 0, 0);

      _mtxOut.set(
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        translation.x, translation.y, translation.z, 1
      );

      Recycler.store(xAxis);
      Recycler.store(yAxis);
      Recycler.store(zAxis);

      _mtxOut.#translationDirty = false;
      _mtxOut.#scalingDirty = false;

      return _mtxOut;
    }

    /**
     * Returns a matrix that translates coordinates along the x-, y- and z-axis according to the given {@link Vector3}.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static TRANSLATION(_translate: Vector3, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      return _mtxOut.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        _translate.x, _translate.y, _translate.z, 1
      );
    }

    /**
     * Returns a matrix that rotates coordinates on the x-axis when multiplied by.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION_X(_angleInDegrees: number, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      return _mtxOut.set(
        1, 0, 0, 0,
        0, cos, sin, 0,
        0, -sin, cos, 0,
        0, 0, 0, 1
      );
    }

    /**
     * Returns a matrix that rotates coordinates on the y-axis when multiplied by.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION_Y(_angleInDegrees: number, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      return _mtxOut.set(
        cos, 0, -sin, 0,
        0, 1, 0, 0,
        sin, 0, cos, 0,
        0, 0, 0, 1
      );
    }

    /**
     * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION_Z(_angleInDegrees: number, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      return _mtxOut.set(
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }

    /**
     * Returns a matrix that rotates coordinates when multiplied by, using the rotation euler angles or unit quaternion given.
     * Rotation occurs around the axis in the order Z-Y-X. 
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION(_rotation: Vector3 | Quaternion, _mtxOut: Matrix4x4 = Recycler.get(Matrix4x4)): Matrix4x4 {
      // avoid decompostion of rotation and scaling in compose...
      _mtxOut.#scaling.set(1, 1, 1);
      _mtxOut.#scalingDirty = false;
      if (_rotation instanceof Quaternion) {
        _mtxOut.#quaternion.copy(_rotation);
        _mtxOut.#quaternionDirty = false;
        _mtxOut.#rotationDirty = true;
      } else {
        _mtxOut.#rotation.copy(_rotation);
        _mtxOut.#rotationDirty = false;
        _mtxOut.#quaternionDirty = true;
      }

      _mtxOut.rotation = _rotation;
      return _mtxOut;
    }

    /**
     * Returns a matrix that rotates coordinates around an arbitrary axis when multiplied by.
     * @param _axis The axis to rotate around as a unit vector.
     * @param _angle The angle in degrees.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static ROTATION_AXIS_ANGLE(_axis: Vector3, _angle: number, _mtxOut: Matrix4x4 = Recycler.get(Matrix4x4)): Matrix4x4 {
      // from three.js, adjusted for FUDGE row vector * row-major matrix transformation convention
      _angle *= Calc.deg2rad;
      const c: number = Math.cos(_angle);
      const s: number = Math.sin(_angle);
      const t: number = 1 - c;
      const x: number = _axis.x, y: number = _axis.y, z: number = _axis.z;
      const tx: number = t * x, ty: number = t * y;

      _mtxOut.set(
        tx * x + c, tx * y + s * z, tx * z - s * y, 0,
        tx * y - s * z, ty * y + c, ty * z + s * x, 0,
        tx * z + s * y, ty * z - s * x, t * z * z + c, 0,
        0, 0, 0, 1
      );

      return _mtxOut;
    }

    /**
     * Returns a matrix that scales coordinates along the x-, y- and z-axis according to the given {@link Vector3}.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static SCALING(_scalar: Vector3, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      return _mtxOut.set(
        _scalar.x, 0, 0, 0,
        0, _scalar.y, 0, 0,
        0, 0, _scalar.z, 0,
        0, 0, 0, 1
      );
    }

    /**
     * Returns a representation of the given matrix relative to the given base.
     * If known, pass the inverse of the base to avoid unneccesary calculation.
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static RELATIVE(_mtx: Matrix4x4, _mtxBase: Matrix4x4, _mtxInverse?: Matrix4x4, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      if (_mtxInverse)
        return Matrix4x4.PRODUCT(_mtxInverse, _mtx, _mtxOut);

      let mtxInverse: Matrix4x4 = Matrix4x4.INVERSE(_mtxBase);
      Matrix4x4.PRODUCT(mtxInverse, _mtx, _mtxOut);
      Recycler.store(mtxInverse);
      return _mtxOut;
    }
    //#endregion

    //#region Projection
    /**
     * Computes and returns a matrix that applies perspective to an object, if its transform is multiplied by it.
     * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
     * @param _fieldOfViewInDegrees The field of view in Degrees. (Default = 45)
     * @param _near The near clipspace border on the z-axis.
     * @param _far The far clipspace border on the z-axis.
     * @param _direction The plane on which the fieldOfView-Angle is given 
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static PROJECTION_CENTRAL(_aspect: number, _fieldOfViewInDegrees: number, _near: number, _far: number, _direction: FIELD_OF_VIEW, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      //TODO: camera looks down negative z-direction, should be positive
      let fieldOfViewInRadians: number = _fieldOfViewInDegrees * Calc.deg2rad;
      let f: number = Math.tan(0.5 * (Math.PI - fieldOfViewInRadians));
      let rangeInv: number = 1.0 / (_near - _far);

      _mtxOut.set(
        f, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (_near + _far) * rangeInv, -1,
        0, 0, _near * _far * rangeInv * 2, 0
      );

      if (_direction == FIELD_OF_VIEW.DIAGONAL) {
        _aspect = Math.sqrt(_aspect);
        _mtxOut.data[0] = f / _aspect;
        _mtxOut.data[5] = f * _aspect;
      } else if (_direction == FIELD_OF_VIEW.VERTICAL)
        _mtxOut.data[0] = f / _aspect;
      else //FOV_DIRECTION.HORIZONTAL
        _mtxOut.data[5] = f * _aspect;

      // HACK: matrix should look in positive z-direction, preferably the matrix should be calculated like that right away
      _mtxOut.rotateY(180);

      return _mtxOut;
    }

    /**
     * Computes and returns a matrix that applies orthographic projection to an object, if its transform is multiplied by it.
     * @param _left The positionvalue of the projectionspace's left border.
     * @param _right The positionvalue of the projectionspace's right border.
     * @param _bottom The positionvalue of the projectionspace's bottom border.
     * @param _top The positionvalue of the projectionspace's top border.
     * @param _near The positionvalue of the projectionspace's near border.
     * @param _far The positionvalue of the projectionspace's far border
     * @param _mtxOut Optional matrix to store the result in.
     */
    public static PROJECTION_ORTHOGRAPHIC(_left: number, _right: number, _bottom: number, _top: number, _near: number = -400, _far: number = 400, _mtxOut: Matrix4x4 = Recycler.reuse(Matrix4x4)): Matrix4x4 {
      _mtxOut.set(
        2 / (_right - _left), 0, 0, 0,
        0, -2 / (_top - _bottom), 0, 0,
        0, 0, 2 / (_far - _near), 0,
        (_left + _right) / (_left - _right),
        (_bottom + _top) / (_bottom - _top),
        (_near + _far) / (_near - _far),
        1
      );
      return _mtxOut;
    }

    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
    }

    /** 
     * - get: return a vector representation of the translation {@link Vector3}.  
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix ignoring its rotation and scaling
     */
    public get translation(): Vector3 {
      if (this.#translationDirty) {
        this.#translation.set(this.data[12], this.data[13], this.data[14]);
        this.#translationDirty = false;
      }
      return this.#translation;
    }
    public set translation(_translation: Vector3) {
      this.compose(_translation);
    }

    /** 
     * - get: return a vector representation of the rotation {@link Vector3}.  
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix
     */
    public get rotation(): Vector3 {
      if (this.#rotationDirty) {
        let scaling: Vector3 = this.scaling;

        let s0: number = this.data[0] / scaling.x;
        let s1: number = this.data[1] / scaling.x;
        let s2: number = this.data[2] / scaling.x;
        let s6: number = this.data[6] / scaling.y;
        let s10: number = this.data[10] / scaling.z;

        let sy: number = Math.sqrt(s0 * s0 + s1 * s1); // probably 2. param should be this.data[4] / scaling.y

        let singular: boolean = sy < 1e-6; // If

        let x1: number, y1: number, z1: number;
        let x2: number, y2: number, z2: number;

        if (!singular) {
          x1 = Math.atan2(s6, s10);
          y1 = Math.atan2(-s2, sy);
          z1 = Math.atan2(s1, s0);

          x2 = Math.atan2(-s6, -s10);
          y2 = Math.atan2(-s2, -sy);
          z2 = Math.atan2(-s1, -s0);

          if (Math.abs(x2) + Math.abs(y2) + Math.abs(z2) < Math.abs(x1) + Math.abs(y1) + Math.abs(z1)) {
            x1 = x2;
            y1 = y2;
            z1 = z2;
          }
        } else {
          x1 = Math.atan2(-this.data[9] / scaling.z, this.data[5] / scaling.y);
          y1 = Math.atan2(-this.data[2] / scaling.x, sy);
          z1 = 0;
        }

        this.#rotation.set(x1, y1, z1);
        this.#rotation.scale(Calc.rad2deg);
        this.#rotationDirty = false;
      }

      return this.#rotation;
    }
    public set rotation(_rotation: Quaternion | Vector3) {
      this.compose(undefined, _rotation);
    }

    /** 
     * - get: return a vector representation of the scaling {@link Vector3}.  
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix
     */
    public get scaling(): Vector3 {
      if (this.#scalingDirty) {
        this.#scaling.set(
          Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1] + this.data[2] * this.data[2]), //* (this.data[0] < 0 ? -1 : 1),
          Math.sqrt(this.data[4] * this.data[4] + this.data[5] * this.data[5] + this.data[6] * this.data[6]), //* (this.data[5] < 0 ? -1 : 1),
          Math.sqrt(this.data[8] * this.data[8] + this.data[9] * this.data[9] + this.data[10] * this.data[10]) // * (this.data[10] < 0 ? -1 : 1)
        );

        // if (this.determinant < 0) // ⚠️EXPERMINETAL from three js: if determinant is negative, invert one scale
        //   this.#scaling.x = -this.#scaling.x;

        this.#scalingDirty = false;
      }
      return this.#scaling;
    }
    public set scaling(_scaling: Vector3) {
      this.compose(undefined, undefined, _scaling);
    }

    /** 
     * - get: return a unit quaternion representing the rotation of this matrix.
     * **Caution!** Use immediately and readonly, since the quaternion is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix
     */
    public get quaternion(): Quaternion {
      if (this.#quaternionDirty) {
        this.#quaternion.eulerAngles = this.rotation;
        this.#quaternionDirty = false;

        // alternative quaternion calculation, faster than euler angles, but produces different results for matrices with determinant < 0 than euler angles...
        // from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm, adjusted for FUDGE row vector * row-major matrix transformation convention
        // requires a pure (unscaled) rotation matrix
        // const scaling: Vector3 = this.scaling;
        // const invScalingX: number =  (this.getDeterminant() < 0 ? -1 : 1) / scaling.x;
        // const invScalingY: number = 1 / scaling.y;
        // const invScalingZ: number = 1 / scaling.z;

        // const m00: number = this.data[0] * invScalingX;
        // const m01: number = this.data[1] * invScalingX;
        // const m02: number = this.data[2] * invScalingX;

        // const m10: number = this.data[4] * invScalingY;
        // const m11: number = this.data[5] * invScalingY;
        // const m12: number = this.data[6] * invScalingY;

        // const m20: number = this.data[8] * invScalingZ;
        // const m21: number = this.data[9] * invScalingZ;
        // const m22: number = this.data[10] * invScalingZ;

        // const trace: number = m00 + m11 + m22;

        // if (trace > 0) {
        //   const s: number = 0.5 / Math.sqrt(trace + 1);
        //   this.#quaternion.set(
        //     (m12 - m21) * s, 
        //     (m20 - m02) * s, 
        //     (m01 - m10) * s, 
        //     0.25 / s);
        // } else if (m00 > m11 && m00 > m22) {
        //   const s: number = 2 * Math.sqrt(1 + m00 - m11 - m22);
        //   this.#quaternion.set(
        //     0.25 * s,
        //     (m10 + m01) / s,
        //     (m20 + m02) / s,
        //     (m12 - m21) / s
        //   );
        // } else if (m11 > m22) {
        //   const s: number = 2 * Math.sqrt(1 + m11 - m00 - m22);
        //   this.#quaternion.set(
        //     (m10 + m01) / s,
        //     0.25 * s,
        //     (m21 + m12) / s,
        //     (m20 - m02) / s
        //   );
        // } else {
        //   const s: number = 2 * Math.sqrt(1 + m22 - m00 - m11);
        //   this.#quaternion.set(
        //     (m20 + m02) / s,
        //     (m21 + m12) / s,
        //     0.25 * s,
        //     (m01 - m10) / s
        //   );
        // }
        // this.#quaternionDirty = false;
      }

      return this.#quaternion;
    }
    public set quaternion(_quaternion: Quaternion) {
      this.compose(undefined, _quaternion);
    }

    /**
     * Returns the determinant of this matrix. Computational heavy operation, not cached so use with care.
     * @deprecated Use {@link Matrix4x4.getDeterminant} instead.
     */
    public get determinant(): number {
      const m: Float32Array = this.data;

      const det00: number = m[10] * m[15] - m[11] * m[14];
      const det01: number = m[9] * m[15] - m[11] * m[13];
      const det02: number = m[9] * m[14] - m[10] * m[13];
      const det03: number = m[8] * m[15] - m[11] * m[12];
      const det04: number = m[8] * m[14] - m[10] * m[12];
      const det05: number = m[8] * m[13] - m[9] * m[12];

      const det: number =
        m[0] * (m[5] * det00 - m[6] * det01 + m[7] * det02) -
        m[1] * (m[4] * det00 - m[6] * det03 + m[7] * det04) +
        m[2] * (m[4] * det01 - m[5] * det03 + m[7] * det05) -
        m[3] * (m[4] * det02 - m[5] * det04 + m[6] * det05);

      return det;
    }

    /**
     * Returns the normalized cardinal x-axis.
     * @deprecated use {@link getRight} instead.
     */
    public get right(): Vector3 {
      let right: Vector3 = this.getX();
      right.normalize();
      return right;
    }

    /**
     * Returns the normalized cardinal y-axis.
     * @deprecated use {@link getUp} instead.
     */
    public get up(): Vector3 {
      let up: Vector3 = this.getY();
      up.normalize();
      return up;
    }

    /**
     * Returns the normalized cardinal z-axis.
     * @deprecated use {@link getForward} instead.
     */
    public get forward(): Vector3 {
      let forward: Vector3 = this.getZ();
      forward.normalize();
      return forward;
    }

    /**
     * Creates and returns a clone of this matrix.
     */
    public get clone(): Matrix4x4 {
      return Recycler.reuse(Matrix4x4).copy(this);
    }
    //#endregion

    //#region Instance
    /**
     * Resets the matrix to the identity-matrix and clears cache. Used by the recycler to reset.
     */
    public recycle(): void {
      this.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
      // TODO: think about this: should the cache be initialized as well? This would come in handy for when setting only rotation or scaling...
      // this.#translation.set(0, 0, 0);
      // this.#rotation.set(0, 0, 0);
      // this.#scaling.set(1, 1, 1);
      // this.#quaternion.set(0, 0, 0, 1);
      // this.#translationDirty = false;
      // this.#rotationDirty = false;
      // this.#scalingDirty = false;
      // this.#quaternionDirty = false;
    }

    /**
     * Resets the matrix to the identity-matrix and clears cache.
     * @returns A reference to this matrix.
     */
    public reset(): Matrix4x4 {
      this.recycle();
      return this;
    }

    /**
     * Transpose this matrix.
     * @returns A reference to this matrix.
     */
    public transpose(): Matrix4x4 {
      return Matrix4x4.TRANSPOSE(this, this);
    }

    /**
     * Invert this matrix.
     * @returns A reference to this matrix.
     */
    public invert(): Matrix4x4 {
      return Matrix4x4.INVERSE(this, this);
    }

    //#region Translation
    /**
     * Adds a translation by the given {@link Vector3} to this matrix.
     * If _local is true, the translation occurs according to the current rotation and scaling of this matrix,
     * otherwise, it occurs according to the parent.
     * @returns A reference to this matrix.
     */
    public translate(_by: Vector3, _local: boolean = true): Matrix4x4 {
      if (_local) {
        let mtxTranslation: Matrix4x4 = Matrix4x4.TRANSLATION(_by);
        this.multiply(mtxTranslation);
        Recycler.store(mtxTranslation);
      } else {
        this.data[12] += _by.x;
        this.data[13] += _by.y;
        this.data[14] += _by.z;
        this.mutator = null;
        this.#translationDirty = true;
        this.modified = true;
      }

      // const matrix: Matrix4x4 = Matrix4x4.MULTIPLICATION(this, Matrix4x4.TRANSLATION(_by));
      // // TODO: possible optimization, translation may alter mutator instead of deleting it.
      // this.set(matrix);
      // Recycler.store(matrix);
      return this;
    }

    /**
     * Adds a translation along the x-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public translateX(_x: number, _local: boolean = true): Matrix4x4 {
      let translation: Vector3 = Vector3.X(_x);
      this.translate(translation, _local);
      Recycler.store(translation);
      return this;
    }

    /**
     * Adds a translation along the y-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public translateY(_y: number, _local: boolean = true): Matrix4x4 {
      let translation: Vector3 = Vector3.Y(_y);
      this.translate(translation, _local);
      Recycler.store(translation);
      return this;
    }

    /**
     * Adds a translation along the z-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public translateZ(_z: number, _local: boolean = true): Matrix4x4 {
      let translation: Vector3 = Vector3.Z(_z);
      this.translate(translation, _local);
      Recycler.store(translation);
      return this;
    }
    //#endregion

    //#region Rotation
    /**
     * Rotates this matrix by given {@link Vector3} in the order Z, Y, X. Right hand rotation is used, thumb points in axis direction, fingers curling indicate rotation
     * The rotation is appended to already applied transforms, thus multiplied from the right. Set _fromLeft to true to switch and put it in front.
     * @returns A reference to this matrix.
     */
    public rotate(_by: Vector3 | Quaternion, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION(_by);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the x-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public rotateX(_angleInDegrees: number, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_X(_angleInDegrees);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the y-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public rotateY(_angleInDegrees: number, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_Y(_angleInDegrees);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the z-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public rotateZ(_angleInDegrees: number, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_Z(_angleInDegrees);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adjusts the rotation of this matrix to point the z-axis directly at the given target and tilts it to accord with the given up-{@link Vector3},
     * respectively calculating yaw and pitch. If no up-{@link Vector3} is given, the previous up-{@link Vector3} is used. 
     * The pitch may be restricted to the up-vector to only calculate yaw.
     * @param _up A unit vector indicating the up-direction.
     * @returns A reference to this matrix.
     */ // TODO: maybe passing up should be mandatory, default up (local up) and default restrict (false) form a feedback loop, as the local up gets modified each call...
    public lookAt(_target: Vector3, _up?: Vector3, _restrict: boolean = false): Matrix4x4 {
      const up: Vector3 = _up ? _up : this.getUp();
      Matrix4x4.LOOK_AT(this.translation, _target, up, _restrict, this.scaling, this);
      if (!_up)
        Recycler.store(up);
      return this;
    }

    /**
     * Adjusts the rotation of this matrix to align the z-axis with the given forward-direction and tilts it to accord with the given up-{@link Vector3}.
     * If no up-vector is provided, the local {@link Matrix4x4.getUp} is used.
     * The pitch may be restricted to the up-vector to only calculate yaw.
     * @param _forward A unit vector indicating the desired forward-direction.
     * @param _up A unit vector indicating the up-direction.
     * @returns A reference to this matrix.
     */ // TODO: maybe passing up should be mandatory, default up (local up) and default restrict (false) form a feedback loop, as the local up gets modified each call...
    public lookIn(_forward: Vector3, _up?: Vector3, _restrict: boolean = false): Matrix4x4 {
      const up: Vector3 = _up ? _up : this.getUp();
      Matrix4x4.LOOK_IN(_forward, up, _restrict, this.translation, this.scaling, this);
      if (!_up)
        Recycler.store(up);
      return this;
    }

    /**
     * Same as {@link Matrix4x4.lookAt}, but optimized and needs testing
     */
    // TODO: testing lookat that really just rotates the matrix rather than creating a new one
    // public lookAtRotate(_target: Vector3, _up?: Vector3, _preserveScaling: boolean = true): void {
    //   if (!_up)
    //     _up = this.getY();

    //   let scaling: Vector3 = this.scaling;
    //   let difference: Vector3 = Vector3.DIFFERENCE(_target, this.translation);
    //   difference.normalize();
    //   let cos: number = Vector3.DOT(Vector3.NORMALIZATION(this.getZ()), difference);
    //   let sin: number = Vector3.DOT(Vector3.NORMALIZATION(this.getX()), difference);
    //   // console.log(sin, cos);
    //   let mtxRotation: Matrix4x4 = Recycler.get(Matrix4x4);
    //   mtxRotation.data.set([
    //     cos, 0, -sin, 0,
    //     0, 1, 0, 0,
    //     sin, 0, cos, 0,
    //     0, 0, 0, 1
    //   ]);
    //   this.multiply(mtxRotation, false);

    //   cos = Vector3.DOT(Vector3.NORMALIZATION(this.getZ()), difference);
    //   sin = -Vector3.DOT(Vector3.NORMALIZATION(this.getY()), difference);
    //   // console.log(sin, cos);
    //   mtxRotation.data.set([
    //     1, 0, 0, 0,
    //     0, cos, sin, 0,
    //     0, -sin, cos, 0,
    //     0, 0, 0, 1
    //   ]);
    //   this.multiply(mtxRotation, false);
    //   this.scaling = scaling;
    //   Recycler.store(mtxRotation);
    // }
    //#endregion

    //#region Scaling
    /**
     * Adds a scaling by the given {@link Vector3} to this matrix.
     * @returns A reference to this matrix.
     */
    public scale(_by: Vector3, _fromLeft: boolean = false): Matrix4x4 {
      const mtxScaling: Matrix4x4 = Matrix4x4.SCALING(_by);
      this.multiply(mtxScaling, _fromLeft);
      Recycler.store(mtxScaling);
      return this;
    }

    /**
     * Adds a scaling along the x-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public scaleX(_by: number): Matrix4x4 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(_by, 1, 1);
      this.scale(vector);
      Recycler.store(vector);
      return this;
    }

    /**
     * Adds a scaling along the y-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public scaleY(_by: number): Matrix4x4 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(1, _by, 1);
      this.scale(vector);
      Recycler.store(vector);
      return this;
    }

    /**
     * Adds a scaling along the z-axis to this matrix.
     * @returns A reference to this matrix.
     */
    public scaleZ(_by: number): Matrix4x4 {
      let vector: Vector3 = Recycler.reuse(Vector3);
      vector.set(1, 1, _by);
      this.scale(vector);
      Recycler.store(vector);
      return this;
    }
    //#endregion

    //#region Transformation
    /**
     * Multiply this matrix by the given matrix.
     * @returns A reference to this matrix.
     */
    public multiply(_matrix: Matrix4x4, _fromLeft: boolean = false): Matrix4x4 {
      if (_fromLeft)
        return Matrix4x4.PRODUCT(_matrix, this, this);
      else
        return Matrix4x4.PRODUCT(this, _matrix, this);
    }

    /**
     * Premultiply this matrix with the given matrix.
     * @returns A reference to this matrix.
     */
    public premultiply(_mtxLeft: Matrix4x4): Matrix4x4 {
      return Matrix4x4.PRODUCT(_mtxLeft, this, this);
    }
    //#endregion

    //#region Transfer
    /**
     * (Re-)Compose this matrix from the given translation, rotation and scaling. 
     * Missing values will be decompsed from the current matrix state if necessary.
     * @returns A reference to this matrix.
     */
    public compose(_translation?: Partial<Vector3>, _rotation?: Partial<Vector3> | Partial<Quaternion>, _scaling?: Partial<Vector3>): Matrix4x4 {
      const m: Float32Array = this.data;

      if (_translation) {
        const translation: Vector3 = this.translation;
        translation.mutate(_translation);
        m[12] = translation.x;
        m[13] = translation.y;
        m[14] = translation.z;
        this.#translationDirty = false;
      }

      if (_rotation || _scaling) {
        const isQuaternion: boolean = (<Quaternion>_rotation)?.w != undefined;

        const rotation: Vector3 | Quaternion = isQuaternion ? this.quaternion : this.rotation;
        if (_rotation) {
          rotation.mutate(_rotation);
          if (isQuaternion)
            rotation.normalize();
        }

        const scaling: Vector3 = this.scaling;
        if (_scaling)
          scaling.mutate(_scaling);

        const sx: number = scaling.x, sy: number = scaling.y, sz: number = scaling.z;
        if (isQuaternion) {
          // fast algorithm from three.js
          const x: number = (<Quaternion>rotation).x, y: number = (<Quaternion>rotation).y, z: number = (<Quaternion>rotation).z, w: number = (<Quaternion>rotation).w;
          const x2: number = x + x, y2: number = y + y, z2: number = z + z;
          const xx: number = x * x2, xy: number = x * y2, xz: number = x * z2;
          const yy: number = y * y2, yz: number = y * z2, zz: number = z * z2;
          const wx: number = w * x2, wy: number = w * y2, wz: number = w * z2;

          m[0] = (1 - (yy + zz)) * sx;
          m[1] = (xy + wz) * sx;
          m[2] = (xz - wy) * sx;

          m[4] = (xy - wz) * sy;
          m[5] = (1 - (xx + zz)) * sy;
          m[6] = (yz + wx) * sy;

          m[8] = (xz + wy) * sz;
          m[9] = (yz - wx) * sz;
          m[10] = (1 - (xx + yy)) * sz;
        } else {
          const radX: number = rotation.x * Calc.deg2rad;
          const radY: number = rotation.y * Calc.deg2rad;
          const radZ: number = rotation.z * Calc.deg2rad;

          const sinX: number = Math.sin(radX);
          const cosX: number = Math.cos(radX);
          const sinY: number = Math.sin(radY);
          const cosY: number = Math.cos(radY);
          const sinZ: number = Math.sin(radZ);
          const cosZ: number = Math.cos(radZ);

          m[0] = (cosZ * cosY) * sx;
          m[1] = (sinZ * cosY) * sx;
          m[2] = -sinY * sx;

          m[4] = (cosZ * sinY * sinX - sinZ * cosX) * sy;
          m[5] = (sinZ * sinY * sinX + cosZ * cosX) * sy;
          m[6] = (cosY * sinX) * sy;

          m[8] = (cosZ * sinY * cosX + sinZ * sinX) * sz;
          m[9] = (sinZ * sinY * cosX - cosZ * sinX) * sz;
          m[10] = (cosY * cosX) * sz;
        }

        this.#rotationDirty = isQuaternion;
        this.#quaternionDirty = !isQuaternion;
        this.#scalingDirty = false;
      }

      this.mutator = null;
      this.modified = true;

      return this;
    }

    public override animate(_mutator: { translation?: Float32Array; rotation?: Float32Array; quaternion?: Float32Array; scaling?: Float32Array }): Matrix4x4 {
      // TODO: this is almost a copy of mutate + compose, maybe refactor to a common method, cool soultion would be to have Vector3 and Quaternion to extend Float32Array 🤩
      const m: Float32Array = this.data;
      const translationArray: Float32Array = _mutator.translation;
      const rotationArray: Float32Array = _mutator.quaternion ?? _mutator.rotation;
      const scalingArray: Float32Array = _mutator.scaling;

      if (translationArray) {
        const translation: Vector3 = this.translation;
        translation.fromArray(translationArray);
        m[12] = translation.x;
        m[13] = translation.y;
        m[14] = translation.z;
        this.#translationDirty = false;
      }

      if (rotationArray || scalingArray) {
        const isQuaternion: boolean = rotationArray?.length == 4;

        const rotation: Quaternion | Vector3 = isQuaternion ? this.quaternion : this.rotation;
        if (rotationArray)
          rotation.fromArray(rotationArray);

        const scaling: Vector3 = this.scaling;
        if (scalingArray)
          scaling.fromArray(scalingArray);

        const sx: number = scaling.x, sy: number = scaling.y, sz: number = scaling.z;
        if (isQuaternion) {
          // fast algorithm from three.js
          const x: number = rotation.x, y: number = rotation.y, z: number = rotation.z, w: number = (<Quaternion>rotation).w;
          const x2: number = x + x, y2: number = y + y, z2: number = z + z;
          const xx: number = x * x2, xy: number = x * y2, xz: number = x * z2;
          const yy: number = y * y2, yz: number = y * z2, zz: number = z * z2;
          const wx: number = w * x2, wy: number = w * y2, wz: number = w * z2;

          m[0] = (1 - (yy + zz)) * sx;
          m[1] = (xy + wz) * sx;
          m[2] = (xz - wy) * sx;

          m[4] = (xy - wz) * sy;
          m[5] = (1 - (xx + zz)) * sy;
          m[6] = (yz + wx) * sy;

          m[8] = (xz + wy) * sz;
          m[9] = (yz - wx) * sz;
          m[10] = (1 - (xx + yy)) * sz;
        } else {
          const radX: number = rotation.x * Calc.deg2rad;
          const radY: number = rotation.y * Calc.deg2rad;
          const radZ: number = rotation.z * Calc.deg2rad;

          const sinX: number = Math.sin(radX);
          const cosX: number = Math.cos(radX);
          const sinY: number = Math.sin(radY);
          const cosY: number = Math.cos(radY);
          const sinZ: number = Math.sin(radZ);
          const cosZ: number = Math.cos(radZ);

          m[0] = (cosZ * cosY) * sx;
          m[1] = (sinZ * cosY) * sx;
          m[2] = -sinY * sx;

          m[4] = (cosZ * sinY * sinX - sinZ * cosX) * sy;
          m[5] = (sinZ * sinY * sinX + cosZ * cosX) * sy;
          m[6] = (cosY * sinX) * sy;

          m[8] = (cosZ * sinY * cosX + sinZ * sinX) * sz;
          m[9] = (sinZ * sinY * cosX - cosZ * sinX) * sz;
          m[10] = (cosY * cosX) * sz;
        }

        this.#rotationDirty = isQuaternion;
        this.#quaternionDirty = !isQuaternion;
        this.#scalingDirty = false;
      }

      this.mutator = null;
      this.modified = true;

      return this;
    }

    /**
     * Sets the elements of this matrix to the given values.
     * @returns A reference to this matrix.
     */
    public set(_m00: number, _m01: number, _m02: number, _m03: number, _m10: number, _m11: number, _m12: number, _m13: number, _m20: number, _m21: number, _m22: number, _m23: number, _m30: number, _m31: number, _m32: number, _m33: number): Matrix4x4 {
      const m: Float32Array = this.data;

      m[0] = _m00; m[1] = _m01; m[2] = _m02; m[3] = _m03;
      m[4] = _m10; m[5] = _m11; m[6] = _m12; m[7] = _m13;
      m[8] = _m20; m[9] = _m21; m[10] = _m22; m[11] = _m23;
      m[12] = _m30; m[13] = _m31; m[14] = _m32; m[15] = _m33;

      this.resetCache();
      return this;
    }

    /**
     * Copies the state of the given matrix into this matrix.
     * @returns A reference to this matrix.
     */
    public copy(_original: Matrix4x4): Matrix4x4 {
      this.data.set(_original.data);
      this.mutator = null;
      this.modified = true;
      this.#translationDirty = _original.#translationDirty;
      this.#rotationDirty = _original.#rotationDirty;
      this.#scalingDirty = _original.#scalingDirty;
      this.#quaternionDirty = _original.#quaternionDirty;
      if (!this.#translationDirty)
        this.#translation.copy(_original.#translation);
      if (!this.#rotationDirty)
        this.#rotation.copy(_original.#rotation);
      if (!this.#scalingDirty)
        this.#scaling.copy(_original.#scaling);
      if (!this.#quaternionDirty)
        this.#quaternion.copy(_original.#quaternion);
      return this;
    }

    /**
     * Returns a formatted string representation of this matrix
     */
    public toString(): string {
      return `ƒ.Matrix4x4(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.data.set(_array, _offset);
      this.resetCache();
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(16), _offset: number = 0): T {
      const m: Float32Array = this.data;
      _out[_offset + 0] = m[0]; _out[_offset + 1] = m[1]; _out[_offset + 2] = m[2]; _out[_offset + 3] = m[3];
      _out[_offset + 4] = m[4]; _out[_offset + 5] = m[5]; _out[_offset + 6] = m[6]; _out[_offset + 7] = m[7];
      _out[_offset + 8] = m[8]; _out[_offset + 9] = m[9]; _out[_offset + 10] = m[10]; _out[_offset + 11] = m[11];
      _out[_offset + 12] = m[12]; _out[_offset + 13] = m[13]; _out[_offset + 14] = m[14]; _out[_offset + 15] = m[15];

      return _out;
    }

    /**
     * Returns the array of the elements of this matrix.
     * @returns A readonly view of the internal array.
     */
    public getArray(): ArrayLike<number> & Iterable<number> & ArrayBufferView {
      return this.data;
    }

    /**
      * Returns the determinant of this matrix.
      */
    public getDeterminant(): number {
      const m: Float32Array = this.data;

      const det00: number = m[10] * m[15] - m[11] * m[14];
      const det01: number = m[9] * m[15] - m[11] * m[13];
      const det02: number = m[9] * m[14] - m[10] * m[13];
      const det03: number = m[8] * m[15] - m[11] * m[12];
      const det04: number = m[8] * m[14] - m[10] * m[12];
      const det05: number = m[8] * m[13] - m[9] * m[12];

      const det: number =
        m[0] * (m[5] * det00 - m[6] * det01 + m[7] * det02) -
        m[1] * (m[4] * det00 - m[6] * det03 + m[7] * det04) +
        m[2] * (m[4] * det01 - m[5] * det03 + m[7] * det05) -
        m[3] * (m[4] * det02 - m[5] * det04 + m[6] * det05);

      return det;
    }

    /**
     * Return cardinal x-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getX(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[0], this.data[1], this.data[2]);;
    }
    /**
     * Return cardinal y-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getY(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[4], this.data[5], this.data[6]);
    }
    /**
     * Return cardinal z-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getZ(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[8], this.data[9], this.data[10]);
    }

    /**
     * Returns the normalized cardinal x-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getRight(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[0], this.data[1], this.data[2]).normalize();
    }

    /**
     * Returns the normalized cardinal y-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getUp(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[4], this.data[5], this.data[6]).normalize();
    }

    /**
     * Returns the normalized cardinal z-axis.
     * @param _vctOut Optional vector to store the result in.
     */
    public getForward(_vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(this.data[8], this.data[9], this.data[10]).normalize();
    }

    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapXY(): void {
      const m: Float32Array = this.data;
      const xAxis: Vector3 = this.getX(); // store x-axis
      m[4] = xAxis.x; m[5] = xAxis.y; m[6] = xAxis.z; // overwrite y-axis with x-axis
      m[0] = m[4]; m[1] = m[5]; m[2] = m[6]; // overwrite x-axis with y-axis
      m[8] = -m[8]; m[9] = -m[9]; m[10] = -m[10]; // reverse z-axis
      Recycler.store(xAxis);
      this.resetCache();
    }

    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapXZ(): void {
      const m: Float32Array = this.data;
      const xAxis: Vector3 = this.getX(); // store x-axis
      m[4] = -m[4]; m[5] = -m[5]; m[6] = -m[6]; // reverse y-axis
      m[0] = m[8]; m[1] = m[9]; m[2] = m[10]; // overwrite x-axis with z-axis
      m[8] = xAxis.x; m[9] = xAxis.y; m[10] = xAxis.z; // overwrite z-axis with x-axis
      Recycler.store(xAxis);
      this.resetCache();
    }

    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapYZ(): void {
      const m: Float32Array = this.data;
      const yAxis: Vector3 = this.getY(); // store y-axis
      m[0] = -m[0]; m[1] = -m[1]; m[2] = -m[2]; // reverse x-axis
      m[4] = m[8]; m[5] = m[9]; m[6] = m[10]; // overwrite y-axis with z-axis
      m[8] = yAxis.x; m[9] = yAxis.y; m[10] = yAxis.z; // overwrite z-axis with y-axis
      Recycler.store(yAxis);
      this.resetCache();
    }

    /**
     * Returns the tranlation from this matrix to the target matrix.
     * @param _vctOut Optional vector to store the result in.
     */
    public getTranslationTo(_mtxTarget: Matrix4x4, _vctOut: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      return _vctOut.set(_mtxTarget.data[12] - this.data[12], _mtxTarget.data[13] - this.data[13], _mtxTarget.data[14] - this.data[14]);;
    }

    public serialize(): Serialization {
      // this.getMutator();
      let serialization: Serialization = {
        translation: this.translation.serialize(),
        rotation: this.rotation.serialize(),
        scaling: this.scaling.serialize()
      };
      return serialization;
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      let mutator: Mutator = {
        translation: await this.translation.deserialize(_serialization.translation),
        rotation: await this.rotation.deserialize(_serialization.rotation),
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
        rotation: this.rotation.getMutator(),
        scaling: this.scaling.getMutator()
      };

      // cache mutator
      this.mutator = mutator;
      return mutator;
    }

    public override mutate(_mutator: Mutator): void {
      this.compose(_mutator.translation, _mutator.rotation ?? _mutator.quaternion, _mutator.scaling);
    }

    public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
      let types: MutatorAttributeTypes = {};
      if (_mutator.translation) types.translation = "Vector3";
      if (_mutator.rotation) types.rotation = "Vector3";
      if (_mutator.scaling) types.scaling = "Vector3";
      return types;
    }
    protected reduceMutator(_mutator: Mutator): void {/** */ }

    private resetCache(): void {
      this.#translationDirty = true;
      this.#rotationDirty = true;
      this.#quaternionDirty = true;
      this.#scalingDirty = true;
      this.modified = true;
      this.mutator = null;
    }
    //#endregion
    //#endregion
  }
}
