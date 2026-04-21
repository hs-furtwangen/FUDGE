// / <reference path="Component.ts"/>
namespace FudgeCore {
  export enum FIELD_OF_VIEW {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
    DIAGONAL = "diagonal"
  }

  /**
   * Defines identifiers for the various projections a camera can provide.  
   * TODO: change back to number enum if strings not needed
   */
  export enum PROJECTION {
    CENTRAL = "central",
    ORTHOGRAPHIC = "orthographic",
    DIMETRIC = "dimetric",
    STEREO = "stereo"
  }

  /**
   * The camera component holds the projection-matrix and other data needed to render a scene from the perspective of the node it is attached to.
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
   */
  @orderFlat
  export class ComponentCamera extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentCamera);

    @order(9)
    @edit(Matrix4x4)
    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();

    public readonly mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY();

    @order(2)
    @edit(Color)
    public clrBackground: Color = new Color(0, 0, 0, 1); // The color of the background the camera will render.

    @order(1)
    @edit(Boolean)
    public backgroundEnabled: boolean = true; // Determines whether or not the background of this camera will be rendered. // TODO: seems to be unused, remove?
    // TODO: examine, if background should be an attribute of Camera or Viewport

    //private orthographic: boolean = false; // Determines whether the image will be rendered with perspective or orthographic projection.
    #projection: PROJECTION = PROJECTION.CENTRAL;
    #fieldOfView: number = 45; // The camera's sensorangle.
    #aspectRatio: number = 1.0;
    #direction: FIELD_OF_VIEW = FIELD_OF_VIEW.DIAGONAL;
    #near: number = 0.01;
    #far: number = 1000;

    #left: number = -1;
    #right: number = 1;
    #bottom: number = -1;
    #top: number = 1;

    #projectionDirty: boolean = true;

    readonly #mtxWorldToView: Matrix4x4 = Matrix4x4.IDENTITY();
    readonly #mtxCameraInverse: Matrix4x4 = Matrix4x4.IDENTITY();
    readonly #mtxProjection: Matrix4x4 = Matrix4x4.IDENTITY();

    /**
     * Returns {@link mtxProjection} * {@link mtxCameraInverse}
     * yielding the worldspace to viewspace matrix
     */
    public get mtxWorldToView(): Matrix4x4 {
      if (this.#mtxProjection.modified || this.mtxCameraInverse.modified) {
        Matrix4x4.PRODUCT(this.#mtxProjection, this.mtxCameraInverse, this.#mtxWorldToView);
        this.#mtxProjection.modified = false;
        this.mtxCameraInverse.modified = false;
      }

      return this.#mtxWorldToView;
    }

    /**
     * Returns the inversion of this cameras worldtransformation.
     */
    public get mtxCameraInverse(): Matrix4x4 {
      if (this.mtxWorld.modified) {
        Matrix4x4.INVERSE(this.mtxWorld, this.#mtxCameraInverse);
        this.mtxWorld.modified = false;
      }

      return this.#mtxCameraInverse;
    }

    /**
     * Returns the projection matrix of this camera.
     */
    public get mtxProjection(): Matrix4x4 {
      if (this.#projectionDirty) {
        switch (this.#projection) {
          case PROJECTION.ORTHOGRAPHIC:
            this.projectOrthographic(); // TODO: serialize and deserialize parameters
            break;
          case PROJECTION.CENTRAL:
            this.projectCentral();
            break;
        }
        this.#projectionDirty = false;
      }

      return this.#mtxProjection;
    }

    /** the projection mode */
    @order(3)
    @edit(PROJECTION)
    public get projection(): PROJECTION {
      return this.#projection;
    }

    public set projection(_value: PROJECTION) {
      this.#projection = _value;
      this.#projectionDirty = true;
    }

    /** the aspect ratio between width and height of projection space */
    @order(4)
    @edit(Number)
    public get aspectRatio(): number {
      return this.#aspectRatio;
    }

    public set aspectRatio(_value: number) {
      this.#aspectRatio = _value;
      this.#projectionDirty = true;
    }

    /** the plane on which the field of view angle is applied */
    @order(5)
    @edit(FIELD_OF_VIEW)
    public get direction(): FIELD_OF_VIEW {
      return this.#direction;
    }

    public set direction(_value: FIELD_OF_VIEW) {
      this.#direction = _value;
      this.#projectionDirty = true;
    }

    /** the field of view angle in degrees */
    @order(6)
    @edit(Number)
    public get fieldOfView(): number {
      return this.#fieldOfView;
    }

    public set fieldOfView(_value: number) {
      this.#fieldOfView = _value;
      this.#projectionDirty = true;
    }

    /** the minimum distance to render objects at */
    @order(7)
    @edit(Number)
    public get near(): number {
      return this.#near;
    }

    public set near(_value: number) {
      this.#near = _value;
      this.#projectionDirty = true;
    }

    /** the maximum distance to render objects at */
    @order(8)
    @edit(Number)
    public get far(): number {
      return this.#far;
    }

    public set far(_value: number) {
      this.#far = _value;
      this.#projectionDirty = true;
    }

    @order(9)
    @edit(Number)
    public get left(): number {
      return this.#left;
    }

    public set left(_value: number) {
      this.#left = _value;
      this.#projectionDirty = true;
    }

    @order(10)
    @edit(Number)
    public get right(): number {
      return this.#right;
    }

    public set right(_value: number) {
      this.#right = _value;
      this.#projectionDirty = true;
    }

    @order(11)
    @edit(Number)
    public get bottom(): number {
      return this.#bottom;
    }

    public set bottom(_value: number) {
      this.#bottom = _value;
      this.#projectionDirty = true;
    }

    @order(12)
    @edit(Number)
    public get top(): number {
      return this.#top;
    }

    public set top(_value: number) {
      this.#top = _value;
      this.#projectionDirty = true;
    }

    /**
     * Set the camera to perspective projection. The world origin is in the center of the canvaselement.
     * @param _aspect The aspect ratio between width and height of the projection space.
     * @param _fieldOfView The field of view agnle in degrees.
     * @param _direction The plane on which the field of view angle is applied.
     * @param _near The minimum distance to render objects at.
     * @param _far The maximum distance to render objects at.
     */
    public projectCentral(_aspect: number = this.#aspectRatio, _fieldOfView: number = this.#fieldOfView, _direction: FIELD_OF_VIEW = this.#direction, _near: number = this.#near, _far: number = this.#far): void {
      this.#projection = PROJECTION.CENTRAL;
      this.#aspectRatio = _aspect;
      this.#fieldOfView = _fieldOfView;
      this.#direction = _direction;
      this.#near = _near;
      this.#far = _far;
      Matrix4x4.PROJECTION_CENTRAL(_aspect, _fieldOfView, _near, _far, _direction, this.#mtxProjection);
    }

    /**
     * Set the camera to orthographic projection. Default values are derived the canvas client dimensions
     * @param _left The position value of the projectionspace's left border.    
     * @param _right The position value of the projectionspace's right border.  
     * @param _bottom The position value of the projectionspace's bottom border.
     * @param _top The position value of the projectionspace's top border.      
     */
    public projectOrthographic(_left: number = this.#left, _right: number = this.#right, _bottom: number = this.#bottom, _top: number = this.#top, _near: number = this.#near, _far: number = this.#far): void {
      this.#projection = PROJECTION.ORTHOGRAPHIC;
      this.#left = _left;
      this.#right = _right;
      this.#bottom = _bottom;
      this.#top = _top;
      this.#near = _near;
      this.#far = _far;
      Matrix4x4.PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, _near, _far, this.#mtxProjection);
    }

    /**
     * Returns a (recycled) rectangle of the calculated dimension of a projection surface in the hypothetical distance of 1 to the camera.
     * @param _out Optional rectangle to store the result in.
     */
    public getProjectionRectangle(_out: Rectangle = Recycler.reuse(Rectangle)): Rectangle {
      let tanFov: number = Math.tan(Math.PI * this.#fieldOfView / 360); // Half of the angle, to calculate dimension from the center -> right angle
      let tanHorizontal: number = 0;
      let tanVertical: number = 0;

      switch (this.#direction) {
        case FIELD_OF_VIEW.DIAGONAL:
          let aspect: number = Math.sqrt(this.#aspectRatio);
          tanHorizontal = tanFov * aspect;
          tanVertical = tanFov / aspect;
          break;
        case FIELD_OF_VIEW.VERTICAL:
          tanVertical = tanFov;
          tanHorizontal = tanVertical * this.#aspectRatio;
          break;
        case FIELD_OF_VIEW.HORIZONTAL:
          tanHorizontal = tanFov;
          tanVertical = tanHorizontal / this.#aspectRatio;
          break;
      }

      return _out.set(0, 0, tanHorizontal * 2, tanVertical * 2);
    }

    /**
     * Transforms the given point from world space to clip space.
     * @param _out Optional vector to store the result in.
     */
    public pointWorldToClip(_pointInWorldSpace: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      const m: ArrayLike<number> = this.mtxWorldToView.getArray();
      const w: number = m[3] * _pointInWorldSpace.x + m[7] * _pointInWorldSpace.y + m[11] * _pointInWorldSpace.z + m[15];

      return Vector3.TRANSFORMATION(_pointInWorldSpace, this.mtxWorldToView, true, _out).scale(1 / w);
    }

    /**
     * Transforms the given point from clip space to world space.
     * @param _out Optional vector to store the result in.
     */
    public pointClipToWorld(_pointInClipSpace: Vector3, _out: Vector3 = Recycler.reuse(Vector3)): Vector3 {
      const mtxViewToWorld: Matrix4x4 = Matrix4x4.INVERSE(this.mtxWorldToView);
      const m: ArrayLike<number> = mtxViewToWorld.getArray();
      const w: number = m[3] * _pointInClipSpace.x + m[7] * _pointInClipSpace.y + m[11] * _pointInClipSpace.z + m[15];
      Recycler.store(mtxViewToWorld);
      return Vector3.TRANSFORMATION(_pointInClipSpace, mtxViewToWorld, true, _out).scale(1 / w);
    }

    /**
     * Returns a scaling factor that, given a position in world space, 
     * scales an object at that position so that one unit equals one (physical) pixel on the screen 
     * when seen through this camera.
     * e.g., after setting the scaling, 1 unit in the world equals one (physical) pixel on the screen.
     */
    public getWorldToPixelScale(_posWorld: Vector3): number {
      const rectViewport: Rectangle = Render.getViewportRectangle();
      const width: number = rectViewport.width;
      const height: number = rectViewport.height;

      switch (this.#projection) {
        case PROJECTION.ORTHOGRAPHIC:
          switch (this.#direction) {
            case FIELD_OF_VIEW.VERTICAL:
              return (this.#top - this.#bottom) / height;
            case FIELD_OF_VIEW.HORIZONTAL:
              return (this.#right - this.#left) / width;
            case FIELD_OF_VIEW.DIAGONAL:
              return Calc.hypot(this.#right - this.#left, this.#top - this.#bottom) / Calc.hypot(width, height);
          }
        case PROJECTION.CENTRAL:
          const posCamera: Vector3 = Vector3.TRANSFORMATION(_posWorld, this.mtxCameraInverse, true);
          const depth: number = Math.abs(posCamera.z);
          const rectProjection: Rectangle = this.getProjectionRectangle();

          let scale: number; // the world to pixel scale at a distance of 1 to the camera

          switch (this.#direction) {
            case FIELD_OF_VIEW.VERTICAL:
              scale = rectProjection.height / height;
              break;
            case FIELD_OF_VIEW.HORIZONTAL:
              scale = rectProjection.width / width;
              break;
            case FIELD_OF_VIEW.DIAGONAL:
              scale = Calc.hypot(rectProjection.width, rectProjection.height) / Calc.hypot(width, height);
              break;
          }

          Recycler.store(posCamera);
          Recycler.store(rectProjection);

          return scale * depth;
        default:
          throw new Error(`World to pixel scale not implemented for projection type ${this.#projection}`);
      }
    }

    /**
     * Returns the corners of the cameras frustum in local space. 
     * The order of the corners is near top left, near top right, near bottom right, near bottom left, far top left, far top right, far bottom right, far bottom left.
     * 
     * @param _out Optional array to store the result in.
     * @param _mtxTransform Optional transformation to apply to each corners.
     */
    public getFrustumCorners(_out: Vector3[] = [Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO(), Vector3.ZERO()], _mtxTransform?: Matrix4x4): Vector3[] {
      switch (this.#projection) {
        case PROJECTION.CENTRAL:
          const f: number = Math.tan(Calc.deg2rad * this.#fieldOfView / 2);

          let scaleX: number = f;
          let scaleY: number = f;

          switch (this.#direction) {
            case FIELD_OF_VIEW.HORIZONTAL:
              scaleY = f / this.#aspectRatio;
              break;
            case FIELD_OF_VIEW.VERTICAL:
              scaleX = f * this.#aspectRatio;
              break;
            case FIELD_OF_VIEW.DIAGONAL:
              const diagonalAspect: number = Math.sqrt(this.#aspectRatio);
              scaleX = f * diagonalAspect;
              scaleY = f / diagonalAspect;
              break;
          }

          const nearX: number = this.near * scaleX;
          const nearY: number = this.near * scaleY;
          const farX: number = this.far * scaleX;
          const farY: number = this.far * scaleY;

          _out[0].set(-nearX, nearY, this.near);
          _out[1].set(nearX, nearY, this.near);
          _out[2].set(nearX, -nearY, this.near);
          _out[3].set(-nearX, -nearY, this.near);

          _out[4].set(-farX, farY, this.far);
          _out[5].set(farX, farY, this.far);
          _out[6].set(farX, -farY, this.far);
          _out[7].set(-farX, -farY, this.far);
          break;
        case PROJECTION.ORTHOGRAPHIC:
          _out[0].set(this.#left, this.#bottom, this.#near);
          _out[1].set(this.#right, this.#bottom, this.#near);
          _out[2].set(this.#right, this.#top, this.#near);
          _out[3].set(this.#left, this.#top, this.#near);
          _out[4].set(this.#left, this.#bottom, this.#far);
          _out[5].set(this.#right, this.#bottom, this.#far);
          _out[6].set(this.#right, this.#top, this.#far);
          _out[7].set(this.#left, this.#top, this.#far);
          break;
        default:
          throw new Error(`Frustum corners not implemented for projection type ${this.#projection}`);
      }

      if (_mtxTransform)
        for (let corner of _out)
          corner.transform(_mtxTransform);

      return _out;
    }

    public drawGizmos(): void {
      const mtxWorld: Matrix4x4 = this.mtxWorld.clone;
      mtxWorld.scaling = mtxWorld.scaling.set(0.5, 0.5, 0.5);
      const color: Color = Color.CSS("lightgrey");
      Gizmos.drawIcon(TextureDefault.iconCamera, mtxWorld, color);
      Recycler.store(mtxWorld);
      Recycler.store(color);
    }

    public drawGizmosSelected(): void {
      const color: Color = Color.CSS("lightgrey");
      switch (this.#projection) {
        case PROJECTION.CENTRAL:
          Gizmos.drawWireFrustum(this.#aspectRatio, this.#fieldOfView, this.#near, this.#far, this.#direction, this.mtxWorld, color);
          break;
        case PROJECTION.ORTHOGRAPHIC:
          const width: number = this.#right - this.#left;
          const height: number = this.#top - this.#bottom;
          const depth: number = this.#far - this.#near;

          const center: Vector3 = Recycler.reuse(Vector3).set(
            (this.#left + this.#right) / 2,
            (this.#bottom + this.#top) / 2,
            (this.#near + this.#far) / 2
          );
          const scaling: Vector3 = Recycler.reuse(Vector3).set(width, height, depth);

          const mtxWorld: Matrix4x4 = this.mtxWorld.clone;
          mtxWorld.translate(center);
          mtxWorld.scale(scaling);

          Gizmos.drawWireCube(mtxWorld, color);

          Recycler.store(center);
          Recycler.store(scaling);
          Recycler.store(mtxWorld);
          break;
      }
      Recycler.store(color);
    }
  }
}