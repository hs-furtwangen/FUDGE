namespace FudgeCore {
  /**
   * Makes the node face the camera when rendering, respecting restrictions for rotation around specific axis
   * @authors Jirka Dell'Oro-Friedl, HFU, 2022
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
   */
  export class ComponentFaceCamera extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentFaceCamera);

    @edit(Boolean)
    public upLocal: boolean;

    @edit(Vector3)
    public up: Vector3;
    
    @edit(Boolean)
    public restrict: boolean;

    public constructor(_upLocal: boolean = true, _up: Vector3 = Vector3.Y(1), _restrict: boolean = false) {
      super();
      this.upLocal = _upLocal;
      this.up = _up;
      this.restrict = _restrict;
    }
  }
}