namespace FudgeCore {
  /**
   * Makes the node face the camera when rendering, respecting restrictions for rotation around specific axis
   * @authors Jirka Dell'Oro-Friedl, HFU, 2022
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
   */
  export class ComponentFaceCamera extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentFaceCamera);

    @edit(Boolean)
    public upLocal: boolean = true;

    @edit(Vector3)
    public up: Vector3 = Vector3.Y(1);
    
    @edit(Boolean)
    public restrict: boolean = false;
  }
}