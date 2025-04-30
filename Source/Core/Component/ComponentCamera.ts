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
  @enumerate
  export class ComponentCamera extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentCamera);

    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();
    public readonly mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY();

    public clrBackground: Color = new Color(0, 0, 0, 1); // The color of the background the camera will render.
    //private orthographic: boolean = false; // Determines whether the image will be rendered with perspective or orthographic projection.
    #projection: PROJECTION = PROJECTION.CENTRAL;
    #fieldOfView: number = 45; // The camera's sensorangle.
    #aspectRatio: number = 1.0;
    #direction: FIELD_OF_VIEW = FIELD_OF_VIEW.DIAGONAL;
    #near: number = 1;
    #far: number = 2000;
    #backgroundEnabled: boolean = true; // Determines whether or not the background of this camera will be rendered. // TODO: seems to be unused, remove?
    // TODO: examine, if background should be an attribute of Camera or Viewport

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
     * Returns the inversion of this cameras worldtransformation
     */
    public get mtxCameraInverse(): Matrix4x4 {
      if (this.mtxWorld.modified) {
        Matrix4x4.INVERSE(this.mtxWorld, this.#mtxCameraInverse);
        this.mtxWorld.modified = false;
      }

      return this.#mtxCameraInverse;
    }

    /**
     * Returns the projectionmatrix of this camera.
     */
    public get mtxProjection(): Matrix4x4 {
      return this.#mtxProjection;
    }

    /**
     * Returns true if the background of the camera should be rendered, false if not.
     */
    @enumerate
    public get backgroundEnabled(): boolean {
      return this.#backgroundEnabled;
    }

    /**
     * Returns the cameras {@link PROJECTION} mode.
     */
    @enumerate
    @type(PROJECTION)
    public get projection(): PROJECTION {
      return this.#projection;
    }

    /**
     * Returns the cameras aspect ratio.
     */
    @enumerate
    public get aspectRatio(): number {
      return this.#aspectRatio;
    }

    /**
     * Returns the cameras field of view in degrees.
     */
    @enumerate
    public get fieldOfView(): number {
      return this.#fieldOfView;
    }

    /**
     * Returns the cameras direction i.e. the plane on which the fieldOfView-Angle is given.
     */
    @enumerate
    @type(FIELD_OF_VIEW)
    public get direction(): FIELD_OF_VIEW {
      return this.#direction;
    }

    /**
     * Returns the cameras near value i.e. the minimum distance to render objects at.
     */
    @enumerate
    public get near(): number {
      return this.#near;
    }

    /**
     * Returns the cameras far value i.e. the maximum distance to render objects at.
     */
    @enumerate
    public get far(): number {
      return this.#far;
    }

    /**
     * Returns the cameras {@link PROJECTION} mode.
     * @deprecated Use {@link projection} instead.
     */
    public getProjection(): PROJECTION {
      return this.#projection;
    }

    /**
     * Returns true if the background of the camera should be rendered, false if not.
     * @deprecated Use {@link backgroundEnabled} instead.
     */
    public getBackgroundEnabled(): boolean {
      return this.#backgroundEnabled;
    }

    /**
     * Returns the cameras aspect ratio.
     * @deprecated Use {@link aspectRatio} instead.
     */
    public getAspect(): number {
      return this.#aspectRatio;
    }

    /**
     * Returns the cameras field of view in degrees.
     * @deprecated Use {@link fieldOfView} instead.
     */
    public getFieldOfView(): number {
      return this.#fieldOfView;
    }

    /**
     * Returns the cameras direction i.e. the plane on which the fieldOfView-Angle is given.
     * @deprecated Use {@link direction} instead.
     */
    public getDirection(): FIELD_OF_VIEW {
      return this.#direction;
    }

    /**
     * Returns the cameras near value i.e. the minimum distance to render objects at.
     * @deprecated Use {@link near} instead.
     */
    public getNear(): number {
      return this.#near;
    }

    /**
     * Returns the cameras far value i.e. the maximum distance to render objects at.
     * @deprecated Use {@link far} instead.
     */
    public getFar(): number {
      return this.#far;
    }

    /**
     * Set the camera to perspective projection. The world origin is in the center of the canvaselement.
     * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
     * @param _fieldOfView The field of view in Degrees. (Default = 45)
     * @param _direction The plane on which the fieldOfView-Angle is given 
     */
    public projectCentral(_aspect: number = this.#aspectRatio, _fieldOfView: number = this.#fieldOfView, _direction: FIELD_OF_VIEW = this.#direction, _near: number = this.#near, _far: number = this.#far): void {
      this.#aspectRatio = _aspect;
      this.#fieldOfView = _fieldOfView;
      this.#direction = _direction;
      this.#projection = PROJECTION.CENTRAL;
      this.#near = _near;
      this.#far = _far;
      Matrix4x4.PROJECTION_CENTRAL(_aspect, this.#fieldOfView, _near, _far, this.#direction, this.#mtxProjection);
    }

    /**
     * Set the camera to orthographic projection. Default values are derived the canvas client dimensions
     * @param _left The positionvalue of the projectionspace's left border.    
     * @param _right The positionvalue of the projectionspace's right border.  
     * @param _bottom The positionvalue of the projectionspace's bottom border.
     * @param _top The positionvalue of the projectionspace's top border.      
     */
    public projectOrthographic(_left?: number, _right?: number, _bottom?: number, _top?: number): void {
      const rectCanvas: Rectangle = Render.getCanvasRectangle();
      const width: number = rectCanvas.width;
      const height: number = rectCanvas.height;
      _left = -width / 2;
      _right = width / 2;
      _bottom = height / 2;
      _top = -height / 2;

      this.#projection = PROJECTION.ORTHOGRAPHIC;
      Matrix4x4.PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, 400, -400, this.#mtxProjection); // TODO: examine magic numbers!
    }

    /**
     * Returns a (recycled) rectangle of the calculated dimension of a projection surface in the hypothetical distance of 1 to the camera.
     * @param _out Optional rectangle to store the result in.
     */
    public getProjectionRectangle(_out: Rectangle = Recycler.reuse(Rectangle)): Rectangle {
      let tanFov: number = Math.tan(Math.PI * this.#fieldOfView / 360); // Half of the angle, to calculate dimension from the center -> right angle
      let tanHorizontal: number = 0;
      let tanVertical: number = 0;

      if (this.#direction == FIELD_OF_VIEW.DIAGONAL) {
        let aspect: number = Math.sqrt(this.#aspectRatio);
        tanHorizontal = tanFov * aspect;
        tanVertical = tanFov / aspect;
      } else if (this.#direction == FIELD_OF_VIEW.VERTICAL) {
        tanVertical = tanFov;
        tanHorizontal = tanVertical * this.#aspectRatio;
      } else {//FOV_DIRECTION.HORIZONTAL
        tanHorizontal = tanFov;
        tanVertical = tanHorizontal / this.#aspectRatio;
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
     * scales an object at that position so that one unit equals one (logical) pixel on the screen 
     * when seen through this camera.
     * e.g., after setting the scaling, 1 unit in the world equals one (logical) pixel on the screen.
     */
    public getWorldToPixelScale(_posWorld: Vector3): number {
      let distance: number = this.mtxWorld.translation.getDistance(_posWorld);
      let scale: number;
      let rect: Rectangle = Render.getRenderRectangle();
      switch (this.#direction) {
        case FIELD_OF_VIEW.VERTICAL:
          scale = 1 / rect.height * window.devicePixelRatio;
          break;
        case FIELD_OF_VIEW.HORIZONTAL:
          scale = 1 / rect.width * window.devicePixelRatio;
          break;
        case FIELD_OF_VIEW.DIAGONAL:
          scale = 1 / Math.sqrt((rect.width * rect.height) * window.devicePixelRatio);
          break;
      }

      return scale * distance;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = {
        backgroundColor: this.clrBackground,
        backgroundEnabled: this.#backgroundEnabled,
        projection: this.#projection,
        fieldOfView: this.#fieldOfView,
        direction: this.#direction,
        near: this.#near,
        far: this.#far,
        aspect: this.#aspectRatio,
        pivot: this.mtxPivot.serialize(),
        [super.constructor.name]: super.serialize()
      };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await this.clrBackground.deserialize(_serialization.backgroundColor);
      this.#backgroundEnabled = _serialization.backgroundEnabled;
      this.#projection = _serialization.projection;
      this.#fieldOfView = _serialization.fieldOfView;
      this.#aspectRatio = _serialization.aspect;
      this.#direction = _serialization.direction;
      this.#near = _serialization.near ?? this.#near;
      this.#far = _serialization.far ?? this.#far;
      await this.mtxPivot.deserialize(_serialization.pivot);
      await super.deserialize(_serialization[super.constructor.name]);
      switch (this.#projection) {
        case PROJECTION.ORTHOGRAPHIC:
          this.projectOrthographic(); // TODO: serialize and deserialize parameters
          break;
        case PROJECTION.CENTRAL:
          this.projectCentral();
          break;
      }
      return this;
    }

    public async mutate(_mutator: Mutator, _selection: string[] = null, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _selection, _dispatchMutate);

      switch (this.#projection) {
        case PROJECTION.CENTRAL:
          this.projectCentral(this.#aspectRatio, this.#fieldOfView, this.#direction, this.#near, this.#far);
          break;
      }
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
      Gizmos.drawWireFrustum(this.#aspectRatio, this.#fieldOfView, this.#near, this.#far, this.#direction, this.mtxWorld, Color.CSS("lightgrey"));
    };

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.transform;
      super.reduceMutator(_mutator);
    }
    //#endregion
  }
}