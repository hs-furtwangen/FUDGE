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
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2023
   */
  export class Matrix4x4 extends Mutable implements Serializable, Recycable {
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

    public constructor() {
      super();
      this.recycle();
    }

    //#region STATICS
    /**
     * Retrieve a new identity matrix
     */
    public static IDENTITY(): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.get(Matrix4x4);
      return mtxResult;
    }

    /**
     * Composes a new matrix according to the given translation, rotation and scaling.
     */
    public static COMPOSITION(_translation?: Vector3, _rotation?: Vector3 | Quaternion, _scaling?: Vector3): Matrix4x4 {
      let result: Matrix4x4 = Matrix4x4.IDENTITY();
      result.mutate({ "translation": _translation, "rotation": _rotation, "scaling": _scaling });
      return result;
    }

    /**
     * Computes and returns the product of two passed matrices.
     */
    public static PRODUCT(_mtxLeft: Matrix4x4, _mtxRight: Matrix4x4): Matrix4x4 {
      let a: Float32Array = _mtxLeft.data;
      let b: Float32Array = _mtxRight.data;
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      let a00: number = a[0 * 4 + 0];
      let a01: number = a[0 * 4 + 1];
      let a02: number = a[0 * 4 + 2];
      let a03: number = a[0 * 4 + 3];
      let a10: number = a[1 * 4 + 0];
      let a11: number = a[1 * 4 + 1];
      let a12: number = a[1 * 4 + 2];
      let a13: number = a[1 * 4 + 3];
      let a20: number = a[2 * 4 + 0];
      let a21: number = a[2 * 4 + 1];
      let a22: number = a[2 * 4 + 2];
      let a23: number = a[2 * 4 + 3];
      let a30: number = a[3 * 4 + 0];
      let a31: number = a[3 * 4 + 1];
      let a32: number = a[3 * 4 + 2];
      let a33: number = a[3 * 4 + 3];
      let b00: number = b[0 * 4 + 0];
      let b01: number = b[0 * 4 + 1];
      let b02: number = b[0 * 4 + 2];
      let b03: number = b[0 * 4 + 3];
      let b10: number = b[1 * 4 + 0];
      let b11: number = b[1 * 4 + 1];
      let b12: number = b[1 * 4 + 2];
      let b13: number = b[1 * 4 + 3];
      let b20: number = b[2 * 4 + 0];
      let b21: number = b[2 * 4 + 1];
      let b22: number = b[2 * 4 + 2];
      let b23: number = b[2 * 4 + 3];
      let b30: number = b[3 * 4 + 0];
      let b31: number = b[3 * 4 + 1];
      let b32: number = b[3 * 4 + 2];
      let b33: number = b[3 * 4 + 3];
      mtxResult.set([
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
      ]);
      return mtxResult;
    }

    /**
     * Computes and returns the transpose of a passed matrix.
     */
    public static TRANSPOSE(_mtx: Matrix4x4): Matrix4x4 {
      return _mtx.clone.transpose();
    }

    /**
     * Computes and returns the inverse of a passed matrix.
     * @param _mtx The matrix to compute the inverse of.
     */
    public static INVERSE(_mtx: Matrix4x4): Matrix4x4 {
      return _mtx.clone.invert();
    }

    /**
     * Computes and returns a matrix with the given translation, its z-axis pointing directly at the given target,
     * and a minimal angle between its y-axis and the given up-{@link Vector3}, respetively calculating yaw and pitch.
     * The pitch may be restricted to the up-vector to only calculate yaw.
     */
    public static LOOK_AT(_translation: Vector3, _target: Vector3, _up: Vector3 = Vector3.Y(), _restrict: boolean = false): Matrix4x4 {
      let zAxis: Vector3 = Vector3.DIFFERENCE(_target, _translation);
      zAxis.normalize();
      let vctCross: Vector3 = Vector3.CROSS(_up, zAxis);
      if (vctCross.magnitudeSquared == 0) // experimental workaround: if z and up is parallel, there is no up to remain...
        vctCross.x = 0.001; // so tilt a little
      let xAxis: Vector3 = Vector3.NORMALIZATION(vctCross);
      let yAxis: Vector3 = _restrict ? _up : Vector3.NORMALIZATION(Vector3.CROSS(zAxis, xAxis));
      zAxis = _restrict ? Vector3.NORMALIZATION(Vector3.CROSS(xAxis, _up)) : zAxis;
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        _translation.x,
        _translation.y,
        _translation.z,
        1
      ]);
      Recycler.storeMultiple(zAxis, xAxis, vctCross); // don't store yAxis, it might be _up
      return mtxResult;
    }

    /**
     * Computes and returns a matrix with the given translation, its z-axis pointing directly in the given direction,
     * and a minimal angle between its y-axis and the given up-{@link Vector3}. Ideally up should be perpendicular to the given direction.
     */
    public static LOOK_IN(_translation: Vector3, _direction: Vector3, _up: Vector3 = Vector3.Y()): Matrix4x4 {
      let zAxis: Vector3 = Vector3.NORMALIZATION(_direction);
      let xAxis: Vector3 = Vector3.NORMALIZATION(Vector3.CROSS(_up, zAxis));
      let yAxis: Vector3 = Vector3.NORMALIZATION(Vector3.CROSS(zAxis, xAxis));
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        _translation.x, _translation.y, _translation.z, 1
      ]);
      Recycler.storeMultiple(zAxis, xAxis, yAxis);
      return mtxResult;
    }

    /**
     * Computes and returns a matrix with the given translation, its y-axis matching the given up-{@link Vector3}
     * and its z-axis facing towards the given target at a minimal angle, respetively calculating yaw only.
     */
    // public static SHOW_TO(_translation: Vector3, _target: Vector3, _up: Vector3 = Vector3.Y()): Matrix4x4 {
    //   const mtxResult: Matrix4x4 = Recycler.get(Matrix4x4);
    //   let zAxis: Vector3 = Vector3.DIFFERENCE(_target, _translation);
    //   zAxis.normalize();
    //   let xAxis: Vector3 = Vector3.NORMALIZATION(Vector3.CROSS(_up, zAxis));
    //   // let yAxis: Vector3 = Vector3.NORMALIZATION(Vector3.CROSS(zAxis, xAxis));
    //   zAxis = Vector3.NORMALIZATION(Vector3.CROSS(xAxis, _up));
    //   mtxResult.data.set(
    //     [
    //       xAxis.x, xAxis.y, xAxis.z, 0,
    //       _up.x, _up.y, _up.z, 0,
    //       zAxis.x, zAxis.y, zAxis.z, 0,
    //       _translation.x,
    //       _translation.y,
    //       _translation.z,
    //       1
    //     ]);
    //   return mtxResult;
    // }

    /**
     * Returns a matrix that translates coordinates along the x-, y- and z-axis according to the given {@link Vector3}.
     */
    public static TRANSLATION(_translate: Vector3): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        _translate.x, _translate.y, _translate.z, 1
      ]);
      return mtxResult;
    }

    /**
     * Returns a matrix that rotates coordinates on the x-axis when multiplied by.
     */
    public static ROTATION_X(_angleInDegrees: number): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      mtxResult.set([
        1, 0, 0, 0,
        0, cos, sin, 0,
        0, -sin, cos, 0,
        0, 0, 0, 1
      ]);
      return mtxResult;
    }

    /**
     * Returns a matrix that rotates coordinates on the y-axis when multiplied by.
     */
    public static ROTATION_Y(_angleInDegrees: number): Matrix4x4 {
      let mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      mtxResult.set([
        cos, 0, -sin, 0,
        0, 1, 0, 0,
        sin, 0, cos, 0,
        0, 0, 0, 1
      ]);
      return mtxResult;
    }

    /**
     * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
     */
    public static ROTATION_Z(_angleInDegrees: number): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      let angleInRadians: number = _angleInDegrees * Calc.deg2rad;
      let sin: number = Math.sin(angleInRadians);
      let cos: number = Math.cos(angleInRadians);
      mtxResult.set([
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
      return mtxResult;
    }

    /**
     * Returns a matrix that rotates coordinates when multiplied by, using the rotation euler angles or unit quaternion given.
     * Rotation occurs around the axis in the order Z-Y-X.
     */
    public static ROTATION(_rotation: Vector3 | Quaternion): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.get(Matrix4x4);
      Matrix4x4.setRotation(mtxResult.data, _rotation);
      return mtxResult;
    }

    /**
     * Returns a matrix that scales coordinates along the x-, y- and z-axis according to the given {@link Vector3}
     */
    public static SCALING(_scalar: Vector3): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        _scalar.x, 0, 0, 0,
        0, _scalar.y, 0, 0,
        0, 0, _scalar.z, 0,
        0, 0, 0, 1
      ]);
      return mtxResult;
    }

    /**
     * Returns a representation of the given matrix relative to the given base.
     * If known, pass the inverse of the base to avoid unneccesary calculation 
     */
    public static RELATIVE(_mtx: Matrix4x4, _mtxBase: Matrix4x4, _mtxInverse?: Matrix4x4): Matrix4x4 {
      if (_mtxInverse)
        return Matrix4x4.PRODUCT(_mtxInverse, _mtx);

      let mtxInverse: Matrix4x4 = Matrix4x4.INVERSE(_mtxBase);
      let mtxResult: Matrix4x4 = Matrix4x4.PRODUCT(mtxInverse, _mtx);
      Recycler.store(mtxInverse);
      return mtxResult;
    }
    //#endregion

    //#region PROJECTIONS
    /**
     * Computes and returns a matrix that applies perspective to an object, if its transform is multiplied by it.
     * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
     * @param _fieldOfViewInDegrees The field of view in Degrees. (Default = 45)
     * @param _near The near clipspace border on the z-axis.
     * @param _far The far clipspace border on the z-axis.
     * @param _direction The plane on which the fieldOfView-Angle is given 
     */
    public static PROJECTION_CENTRAL(_aspect: number, _fieldOfViewInDegrees: number, _near: number, _far: number, _direction: FIELD_OF_VIEW): Matrix4x4 {
      //TODO: camera looks down negative z-direction, should be positive
      let fieldOfViewInRadians: number = _fieldOfViewInDegrees * Calc.deg2rad;
      let f: number = Math.tan(0.5 * (Math.PI - fieldOfViewInRadians));
      let rangeInv: number = 1.0 / (_near - _far);
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        f, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (_near + _far) * rangeInv, -1,
        0, 0, _near * _far * rangeInv * 2, 0
      ]);

      if (_direction == FIELD_OF_VIEW.DIAGONAL) {
        _aspect = Math.sqrt(_aspect);
        mtxResult.data[0] = f / _aspect;
        mtxResult.data[5] = f * _aspect;
      } else if (_direction == FIELD_OF_VIEW.VERTICAL)
        mtxResult.data[0] = f / _aspect;
      else //FOV_DIRECTION.HORIZONTAL
        mtxResult.data[5] = f * _aspect;

      // HACK: matrix should look in positive z-direction, preferably the matrix should be calculated like that right away
      mtxResult.rotateY(180);

      return mtxResult;
    }

    /**
     * Computes and returns a matrix that applies orthographic projection to an object, if its transform is multiplied by it.
     * @param _left The positionvalue of the projectionspace's left border.
     * @param _right The positionvalue of the projectionspace's right border.
     * @param _bottom The positionvalue of the projectionspace's bottom border.
     * @param _top The positionvalue of the projectionspace's top border.
     * @param _near The positionvalue of the projectionspace's near border.
     * @param _far The positionvalue of the projectionspace's far border
     */
    public static PROJECTION_ORTHOGRAPHIC(_left: number, _right: number, _bottom: number, _top: number, _near: number = -400, _far: number = 400): Matrix4x4 {
      const mtxResult: Matrix4x4 = Recycler.reuse(Matrix4x4);
      mtxResult.set([
        2 / (_right - _left), 0, 0, 0,
        0, -2 / (_top - _bottom), 0, 0,
        0, 0, 2 / (_far - _near), 0,
        (_left + _right) / (_left - _right),
        (_bottom + _top) / (_bottom - _top),
        (_near + _far) / (_near - _far),
        1
      ]);
      return mtxResult;
    }

    /**
     * Set the rotation part of the given matrixes data array to the given rotation.
     */
    private static setRotation(_m: Float32Array, _rotation: Vector3 | Quaternion): void {
      if (_rotation instanceof Vector3) {
        const anglesRad: Vector3 = Vector3.SCALE(_rotation, Calc.deg2rad);
        const sinX: number = Math.sin(anglesRad.x);
        const cosX: number = Math.cos(anglesRad.x);
        const sinY: number = Math.sin(anglesRad.y);
        const cosY: number = Math.cos(anglesRad.y);
        const sinZ: number = Math.sin(anglesRad.z);
        const cosZ: number = Math.cos(anglesRad.z);
        Recycler.store(anglesRad);

        _m[0] = cosZ * cosY; /**/                 _m[1] = sinZ * cosY; /**/                 _m[2] = -sinY;
        _m[4] = cosZ * sinY * sinX - sinZ * cosX; _m[5] = sinZ * sinY * sinX + cosZ * cosX; _m[6] = cosY * sinX;
        _m[8] = cosZ * sinY * cosX + sinZ * sinX; _m[9] = sinZ * sinY * cosX - cosZ * sinX; _m[10] = cosY * cosX;
      } else {
        // const rotationNormalized: Quaternion = Quaternion.NORMALIZATION(_rotation);
        const x: number = _rotation.x, y: number = _rotation.y, z: number = _rotation.z, w: number = _rotation.w;
        const xx: number = x * x, xy: number = x * y, xz: number = x * z, xw: number = x * w;
        const yy: number = y * y, yz: number = y * z, yw: number = y * w;
        const zz: number = z * z, zw: number = z * w;
        const ww: number = w * w;

        _m[0] = ww + xx - yy - zz; _m[1] = 2 * (xy + zw);/**/ _m[2] = 2 * (xz - yw);
        _m[4] = 2 * (xy - zw);/**/ _m[5] = ww - xx + yy - zz; _m[6] = 2 * (yz + xw);
        _m[8] = 2 * (xz + yw);/**/ _m[9] = 2 * (yz - xw);/**/ _m[10] = ww - xx - yy + zz;

        // _m[0] = 1 - 2 * (yy + zz); _m[1] = 2 * (xy + zw);/**/ _m[2] = 2 * (xz - yw);
        // _m[4] = 2 * (xy - zw);/**/ _m[5] = 1 - 2 * (xx + zz); _m[6] = 2 * (yz + xw);
        // _m[8] = 2 * (xz + yw);/**/ _m[9] = 2 * (yz - xw);/**/ _m[10] = 1 - 2 * (xx + yy);
        // Recycler.store(rotationNormalized);
      }
    }
    //#endregion

    //#region  Accessors
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
      this.mutate({ "translation": _translation });
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

        let sy: number = Math.hypot(s0, s1); // probably 2. param should be this.data[4] / scaling.y

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
      this.mutate({ "rotation": _rotation });
    }

    /** 
     * - get: return a vector representation of the scaling {@link Vector3}.  
     * **Caution!** Use immediately and readonly, since the vector is going to be reused internally. Create a clone to keep longer and manipulate. 
     * - set: effect the matrix
     */
    public get scaling(): Vector3 {
      if (this.#scalingDirty) {
        this.#scaling.set(
          Math.hypot(this.data[0], this.data[1], this.data[2]), //* (this.data[0] < 0 ? -1 : 1),
          Math.hypot(this.data[4], this.data[5], this.data[6]), //* (this.data[5] < 0 ? -1 : 1),
          Math.hypot(this.data[8], this.data[9], this.data[10]) // * (this.data[10] < 0 ? -1 : 1)
        );

        // if (this.determinant < 0) // ⚠️EXPERMINETAL from three js: if determinant is negative, invert one scale
        //   this.#scaling.x = -this.#scaling.x;

        this.#scalingDirty = false;
      }
      return this.#scaling;
    }
    public set scaling(_scaling: Vector3) {
      this.mutate({ "scaling": _scaling });
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
      }

      return this.#quaternion;
    }
    public set quaternion(_quaternion: Quaternion) {
      this.mutate({ "rotation": _quaternion });
    }

    /**
     * Returns the determinant of this matrix. Computational heavy operation, not cached so use with care.
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
     */
    public get right(): Vector3 {
      let right: Vector3 = this.getX();
      right.normalize();
      return right;
    }

    /**
     * Returns the normalized cardinal y-axis.
     */
    public get up(): Vector3 {
      let up: Vector3 = this.getY();
      up.normalize();
      return up;
    }

    /**
     * Returns the normalized cardinal z-axis.
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

    /**
     * Resets the matrix to the identity-matrix and clears cache. Used by the recycler to reset.
     */
    public recycle(): void {
      this.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
    }

    /**
     * Resets the matrix to the identity-matrix and clears cache.
     */
    public reset(): void {
      this.recycle();
    }

    /**
     * Transpose this matrix
     */
    public transpose(): Matrix4x4 {
      let m: Float32Array = this.data;
      this.set([
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      ]);
      return this;
    }

    /**
     * Invert this matrix
     */
    public invert(): Matrix4x4 {
      let m: Float32Array = this.data;
      let m00: number = m[0 * 4 + 0];
      let m01: number = m[0 * 4 + 1];
      let m02: number = m[0 * 4 + 2];
      let m03: number = m[0 * 4 + 3];
      let m10: number = m[1 * 4 + 0];
      let m11: number = m[1 * 4 + 1];
      let m12: number = m[1 * 4 + 2];
      let m13: number = m[1 * 4 + 3];
      let m20: number = m[2 * 4 + 0];
      let m21: number = m[2 * 4 + 1];
      let m22: number = m[2 * 4 + 2];
      let m23: number = m[2 * 4 + 3];
      let m30: number = m[3 * 4 + 0];
      let m31: number = m[3 * 4 + 1];
      let m32: number = m[3 * 4 + 2];
      let m33: number = m[3 * 4 + 3];
      let tmp0: number = m22 * m33;
      let tmp1: number = m32 * m23;
      let tmp2: number = m12 * m33;
      let tmp3: number = m32 * m13;
      let tmp4: number = m12 * m23;
      let tmp5: number = m22 * m13;
      let tmp6: number = m02 * m33;
      let tmp7: number = m32 * m03;
      let tmp8: number = m02 * m23;
      let tmp9: number = m22 * m03;
      let tmp10: number = m02 * m13;
      let tmp11: number = m12 * m03;
      let tmp12: number = m20 * m31;
      let tmp13: number = m30 * m21;
      let tmp14: number = m10 * m31;
      let tmp15: number = m30 * m11;
      let tmp16: number = m10 * m21;
      let tmp17: number = m20 * m11;
      let tmp18: number = m00 * m31;
      let tmp19: number = m30 * m01;
      let tmp20: number = m00 * m21;
      let tmp21: number = m20 * m01;
      let tmp22: number = m00 * m11;
      let tmp23: number = m10 * m01;

      let t0: number = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
        (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);

      let t1: number = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
        (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
      let t2: number = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
        (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
      let t3: number = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
        (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);

      let d: number = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

      this.set([
        d * t0, // [0]
        d * t1, // [1]
        d * t2, // [2]
        d * t3, // [3]
        d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),        // [4]
        d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),        // [5]
        d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),      // [6]
        d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),      // [7]
        d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)),  // [8]
        d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)),  // [9]
        d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)),  // [10]
        d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)),  // [11]
        d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)),  // [12]
        d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)),  // [13]
        d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)),  // [14]
        d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02))  // [15]
      ]);
      return this;
    }

    //#region Translation
    /**
     * Adds a translation by the given {@link Vector3} to this matrix.
     * If _local is true, the translation occurs according to the current rotation and scaling of this matrix,
     * otherwise, it occurs according to the parent.
     */
    public translate(_by: Vector3, _local: boolean = true): Matrix4x4 {
      if (_local) {
        let mtxTranslation: Matrix4x4 = Matrix4x4.TRANSLATION(_by);
        let rotationDirty: boolean = this.#rotationDirty; // preserve dirty flags for rotation and scaling as they are not affected by translation
        let scalingDirty: boolean = this.#scalingDirty;
        this.multiply(mtxTranslation);
        this.#rotationDirty = rotationDirty;
        this.#scalingDirty = scalingDirty;
        Recycler.store(mtxTranslation);
      } else {
        this.data[12] += _by.x;
        this.data[13] += _by.y;
        this.data[14] += _by.z;
        this.mutator = null;
        this.#translationDirty = true;
      }

      // const matrix: Matrix4x4 = Matrix4x4.MULTIPLICATION(this, Matrix4x4.TRANSLATION(_by));
      // // TODO: possible optimization, translation may alter mutator instead of deleting it.
      // this.set(matrix);
      // Recycler.store(matrix);
      return this;
    }

    /**
     * Adds a translation along the x-axis to this matrix.
     */
    public translateX(_x: number, _local: boolean = true): Matrix4x4 {
      let translation: Vector3 = Vector3.X(_x);
      this.translate(translation, _local);
      Recycler.store(translation);
      return this;
    }

    /**
     * Adds a translation along the y-axis to this matrix.
     */
    public translateY(_y: number, _local: boolean = true): Matrix4x4 {
      let translation: Vector3 = Vector3.Y(_y);
      this.translate(translation, _local);
      Recycler.store(translation);
      return this;
    }

    /**
     * Adds a translation along the z-axis to this matrix.
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
     */
    public rotate(_by: Vector3 | Quaternion, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION(_by);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the x-axis to this matrix.
     */
    public rotateX(_angleInDegrees: number, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_X(_angleInDegrees);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the y-axis to this matrix.
     */
    public rotateY(_angleInDegrees: number, _fromLeft: boolean = false): Matrix4x4 {
      let mtxRotation: Matrix4x4 = Matrix4x4.ROTATION_Y(_angleInDegrees);
      this.multiply(mtxRotation, _fromLeft);
      Recycler.store(mtxRotation);
      return this;
    }

    /**
     * Adds a rotation around the z-axis to this matrix.
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
     */
    public lookAt(_target: Vector3, _up?: Vector3, _restrict: boolean = false): Matrix4x4 {
      _up = _up ? Vector3.NORMALIZATION(_up) : this.up;

      const mtxResult: Matrix4x4 = Matrix4x4.LOOK_AT(this.translation, _target, _up, _restrict);
      mtxResult.scale(this.scaling);
      this.set(mtxResult.data);
      Recycler.store(mtxResult);
      return this;
    }

    /**
     * Adjusts the rotation of this matrix to align the z-axis with the given direction and tilts it to accord with the given up-{@link Vector3}.
     * Up should be perpendicular to the given direction. If no up-vector is provided, {@link up} is used.
     */
    public lookIn(_direction: Vector3, _up: Vector3 = this.up): Matrix4x4 {
      const mtxResult: Matrix4x4 = Matrix4x4.LOOK_IN(this.translation, _direction, _up);
      mtxResult.scale(this.scaling);
      this.set(mtxResult.data);
      Recycler.store(mtxResult);
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
     */
    public scale(_by: Vector3, _fromLeft: boolean = false): Matrix4x4 {
      const mtxScaling: Matrix4x4 = Matrix4x4.SCALING(_by);
      this.multiply(mtxScaling, _fromLeft);
      Recycler.store(mtxScaling);
      return this;
    }

    /**
     * Adds a scaling along the x-axis to this matrix.
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
     */
    public multiply(_matrix: Matrix4x4, _fromLeft: boolean = false): Matrix4x4 {
      const mtxResult: Matrix4x4 = _fromLeft ? Matrix4x4.PRODUCT(_matrix, this) : Matrix4x4.PRODUCT(this, _matrix);
      this.set(mtxResult.data);
      Recycler.store(mtxResult);
      return this;
    }
    //#endregion

    //#region Transfer
    // public getEulerAnglesNew(): Vector3 {
    //   let scaling: Vector3 = this.scaling;

    //   let thetaX: number, thetaY: number, thetaZ: number;
    //   let r02: number = this.data[2] / scaling.z;
    //   let r11: number = this.data[5] / scaling.y;

    //   if (r02 < 1) {
    //     if (r02 > -1) {
    //       thetaY = Math.asin(-r02);
    //       thetaZ = Math.atan2(this.data[1] / scaling.y, this.data[0] / scaling.x);
    //       thetaX = Math.atan2(this.data[9] / scaling.z, this.data[10] / scaling.z);
    //     }
    //     else {
    //       thetaY = Math.PI / 2;
    //       thetaZ = -Math.atan2(this.data[6] / scaling.y, r11);
    //       thetaX = 0;
    //     }
    //   }
    //   else {
    //     thetaY = -Math.PI / 2;
    //     thetaZ = Math.atan2(-this.data[6] / scaling.y, r11);
    //     thetaX = 0;
    //   }
    //   this.#eulerAngles.set(-thetaX, thetaY, thetaZ);
    //   this.#eulerAngles.scale(Mathematic.rad2deg);

    //   return this.#eulerAngles;
    // }

    /**
     * Sets the elements of this matrix to the given array.
     */
    public set(_array: ArrayLike<number>): Matrix4x4 {
      this.data.set(_array);
      this.resetCache();
      return this;
    }

    /**
     * Copies the state of the given matrix into this matrix.
     */
    public copy(_original: Matrix4x4): Matrix4x4 {
      this.data.set(_original.data);
      this.mutator = null;
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

    /**
     * Returns an array of the elements of this matrix.
     */
    public get(): Float32Array {
      // TODO: optimization, it shouldn't always return a copy, since this bloats memory
      return new Float32Array(this.data);
    }

    /**
     * Return cardinal x-axis
     */
    public getX(): Vector3 {
      let result: Vector3 = Recycler.get(Vector3);
      result.set(this.data[0], this.data[1], this.data[2]);
      return result;
    }
    /**
     * Return cardinal y-axis
     */
    public getY(): Vector3 {
      let result: Vector3 = Recycler.get(Vector3);
      result.set(this.data[4], this.data[5], this.data[6]);
      return result;
    }
    /**
     * Return cardinal z-axis
     */
    public getZ(): Vector3 {
      let result: Vector3 = Recycler.get(Vector3);
      result.set(this.data[8], this.data[9], this.data[10]);
      return result;
    }

    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapXY(): void {
      let temp: number[] = [this.data[0], this.data[1], this.data[2]]; // store x-axis
      this.data.set([this.data[4], this.data[5], this.data[6]], 0); // overwrite x-axis with y-axis
      this.data.set(temp, 4); // overwrite Y with temp
      this.data.set([-this.data[8], -this.data[9], -this.data[10]], 8); // reverse z-axis
      this.resetCache();
    }
    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapXZ(): void {
      let temp: number[] = [this.data[0], this.data[1], this.data[2]]; // store x-axis
      this.data.set([this.data[8], this.data[9], this.data[10]], 0); // overwrite x-axis with z-axis
      this.data.set(temp, 8); // overwrite Z with temp
      this.data.set([-this.data[4], -this.data[5], -this.data[6]], 4); // reverse y-axis
      this.resetCache();
    }
    /**
     * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
     */
    public swapYZ(): void {
      let temp: number[] = [this.data[4], this.data[5], this.data[6]]; // store y-axis
      this.data.set([this.data[8], this.data[9], this.data[10]], 4); // overwrite y-axis with z-axis
      this.data.set(temp, 8); // overwrite Z with temp
      this.data.set([-this.data[0], -this.data[1], -this.data[2]], 0); // reverse x-axis
      this.resetCache();
    }

    /**
     * Returns the tranlation from this matrix to the target matrix
     */
    public getTranslationTo(_mtxTarget: Matrix4x4): Vector3 {
      let difference: Vector3 = Recycler.get(Vector3);
      difference.set(_mtxTarget.data[12] - this.data[12], _mtxTarget.data[13] - this.data[13], _mtxTarget.data[14] - this.data[14]);
      return difference;
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

    public async mutate(_mutator: Mutator): Promise<void> {
      const m: Float32Array = this.data;

      if (_mutator.translation) {
        let translation: Vector3 = this.translation;
        translation.mutate(_mutator.translation);
        m[12] = translation.x; m[13] = translation.y; m[14] = translation.z;
        this.#translationDirty = false;
      }

      if (_mutator.rotation || _mutator.scaling) {
        // TODO: make full vector and quaternion mutators mandatory?

        let rotation: Vector3 | Quaternion = _mutator.rotation?.w != undefined ?
          this.#quaternion : // using this.#quaternion assumes we get a full quaternion mutator with x, y, z and w set so we never need to recalculate the quaternion here. This might cause trouble if we ever want to mutate only a part of a quaternion...
          isFullVectorMutator(_mutator.rotation) ? this.#rotation : this.rotation; // hack to avoid unnecessary recalculation of rotation and scaling. This recalculation is unnecessary when we get a full mutator i.e. with x, y and z set

        let scaling: Vector3 = isFullVectorMutator(_mutator.scaling) ? this.#scaling : this.scaling;
        
        const isQuaternion: boolean = rotation instanceof Quaternion;
        
        if (_mutator.rotation) {
          rotation.mutate(_mutator.rotation);
          if (isQuaternion)
            rotation.normalize();
        }

        if (_mutator.scaling)
          scaling.mutate(_mutator.scaling);
        
        Matrix4x4.setRotation(m, rotation);
        this.#rotationDirty = isQuaternion;
        this.#quaternionDirty = !isQuaternion;
        
        const sx: number = scaling.x, sy: number = scaling.y, sz: number = scaling.z;
        m[0] *= sx; m[1] *= sx; m[2] *= sx;
        m[4] *= sy; m[5] *= sy; m[6] *= sy;
        m[8] *= sz; m[9] *= sz; m[10] *= sz;
        this.#scalingDirty = false;
      }

      this.mutator = null;

      function isFullVectorMutator(_mutator: Mutator): boolean {
        return _mutator && _mutator.x != undefined && _mutator.y != undefined && _mutator.z != undefined;
      }
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
      this.mutator = null;
    }
  }
  //#endregion
}
