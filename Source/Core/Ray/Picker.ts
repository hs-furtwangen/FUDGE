namespace FudgeCore {
  /**
   * Provides static methods for picking using {@link Render}
   * @authors Jirka Dell'Oro-Friedl, HFU, 2021
   */
  export class Picker {
    /**
     * Takes a ray plus min and max values for the near and far planes to construct the picker-camera,
     * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
     */
    public static pickRay(_nodes: Node[], _ray: Ray, _min: number, _max: number): Pick[];
    public static pickRay(_gizmos: Gizmo[], _ray: Ray, _min: number, _max: number): Pick[];
    public static pickRay(_from: Node[] | Gizmo[], _ray: Ray, _min: number, _max: number): Pick[] {
      if (_from.length == 0)
        return [];

      let cmpCameraPick: ComponentCamera = new ComponentCamera();
      cmpCameraPick.mtxPivot.translation = _ray.origin;
      cmpCameraPick.mtxPivot.lookAt(Vector3.SUM(_ray.origin, _ray.direction));
      cmpCameraPick.projectCentral(1, 0.001, FIELD_OF_VIEW.DIAGONAL, _min, _max);

      if (_from[0] instanceof Node)
        return Render.pick(<Node[]>_from, cmpCameraPick);
      else
        return Gizmos.pick(<Gizmo[]>_from, cmpCameraPick);
    }

    /**
     * Takes a camera and a point on its virtual normed projection plane (distance 1) to construct the picker-camera,
     * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
     */
    public static pickCamera(_nodes: Node[], _cmpCamera: ComponentCamera, _posProjection: Vector2): Pick[];
    public static pickCamera(_nodes: Gizmo[], _cmpCamera: ComponentCamera, _posProjection: Vector2): Pick[];
    public static pickCamera(_from: Node[] | Gizmo[], _cmpCamera: ComponentCamera, _posProjection: Vector2): Pick[] {
      let ray: Ray = new Ray(new Vector3(-_posProjection.x, _posProjection.y, 1));
      let length: number = ray.direction.magnitude;

      if (_cmpCamera.node) {
        let mtxCamera: Matrix4x4 = Matrix4x4.PRODUCT(_cmpCamera.node.mtxWorld, _cmpCamera.mtxPivot);
        ray.transform(mtxCamera);
        Recycler.store(mtxCamera);
      } else
        ray.transform(_cmpCamera.mtxPivot);

      let picks: Pick[] = Picker.pickRay(<General>_from, ray, length * _cmpCamera.getNear(), length * _cmpCamera.getFar());
      return picks;
    }

    /**
     * Takes the camera of the given viewport and a point the client surface to construct the picker-camera,
     * then renders the pick-texture and returns an unsorted {@link Pick}-array with information about the hits of the ray.
     */
    public static pickViewport(_viewport: Viewport, _posClient: Vector2): Pick[] {
      let posProjection: Vector2 = _viewport.pointClientToProjection(_posClient);
      let nodes: Node[] = Array.from(_viewport.getBranch().getIterator(true));
      let picks: Pick[] = Picker.pickCamera(nodes, _viewport.camera, posProjection);
      if (_viewport.gizmosEnabled) 
        picks = picks.concat(Picker.pickCamera(_viewport.getGizmos(nodes), _viewport.camera, posProjection)); // this is kind of wasteful because we do the same calculations twice
      
      return picks;
    }

  }
}