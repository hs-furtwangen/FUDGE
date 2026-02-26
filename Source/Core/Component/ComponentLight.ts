namespace FudgeCore {

  /**
   * The different types of lights.
   */
  export enum LIGHT_TYPE {
    /**
     * Ambient light, coming from all directions, illuminating everything with its color independent of position and orientation (like a foggy day or in the shades)  
     * Attached to a node by {@link ComponentLight}, the pivot matrix is ignored.
     * ```text
     * ~ ~ ~  
     *  ~ ~ ~  
     * ```
     */
    AMBIENT = "LightAmbient",
    /**
     * Directional light, illuminating everything from a specified direction with its color (like standing in bright sunlight)  
     * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the direction of the light only.
     * ```text
     * --->  
     * --->  
     * --->  
     * ```
     */
    DIRECTIONAL = "LightDirectional",
    /**
     * Omnidirectional light emitting from its position, illuminating objects depending on their position and distance with its color (like a colored light bulb)  
     * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the position of the light, it's shape and rotation. 
     * So with uneven scaling, other shapes than a perfect sphere, such as an oval or a disc, are possible, which creates a visible effect of the rotation too. 
     * The intensity of the light drops linearly from 1 in the center to 0 at the perimeter of the shape.
     * ```text
     *         .\|/.
     *        -- o --
     *         ´/|\`
     * ```
     */
    POINT = "LightPoint",
    /**
     * Spot light emitting within a specified angle from its position, illuminating objects depending on their position and distance with its color  
     * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the position of the light, the direction and the size and angles of the cone.
     * The intensity of the light drops linearly from 1 in the center to 0 at the outer limits of the cone.
     * ```text
     *          o  
     *         /|\  
     *        / | \ 
     * ```   
     */
    SPOT = "LightSpot"
  }

  /**
    * Attaches a light to the node.
    * The pivot matrix has different effects depending on the {@link LIGHT_TYPE}. See there for details.
    * @authors Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
    */
  export class ComponentLight extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentLight);

    @edit(LIGHT_TYPE)
    public lightType: LIGHT_TYPE;

    @edit(Color)
    public color: Color;

    @edit(Number)
    public intensity: number;

    @edit(Matrix4x4)
    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();

    public constructor(_lightType: LIGHT_TYPE = LIGHT_TYPE.AMBIENT, _color: Color = new Color(1, 1, 1, 1), _intensity: number = 1) {
      super();
      this.singleton = false;
      this.lightType = _lightType;
      this.color = _color;
      this.intensity = _intensity;
    }

    /** @internal reroute to {@link RenderWebGLComponentLight.updateRenderbuffer} */
    @RenderWebGLComponentLight.decorate
    public static updateRenderbuffer(_lights: MapLightTypeToLightList): void { /* injected */ };

    public drawGizmos(): void {
      let mtxShape: Matrix4x4 = Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
      mtxShape.scaling = new Vector3(0.5, 0.5, 0.5);
      Gizmos.drawIcon(TextureDefault.iconLight, mtxShape, this.color);
      Recycler.store(mtxShape);
    };

    public drawGizmosSelected(): void {
      let mtxShape: Matrix4x4 = Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
      let color: Color = Color.CSS("yellow");

      switch (this.lightType) {
        case LIGHT_TYPE.DIRECTIONAL:
          const radius: number = 0.5;
          Gizmos.drawWireCircle(mtxShape, color);
          const lines: Vector3[] = new Array(10).fill(null).map(() => Recycler.get(Vector3));
          lines[0].set(0, 0, 0); lines[1].set(0, 0, 1);
          lines[2].set(0, radius, 0); lines[3].set(0, radius, 1);
          lines[6].set(0, -radius, 0); lines[7].set(0, -radius, 1);
          lines[4].set(radius, 0, 0); lines[5].set(radius, 0, 1);
          lines[8].set(-radius, 0, 0); lines[9].set(-radius, 0, 1);
          Gizmos.drawLines(lines, mtxShape, color);
          Recycler.store(lines);
          break;
        case LIGHT_TYPE.POINT:
          mtxShape.scale(new Vector3(2, 2, 2));
          Gizmos.drawWireSphere(mtxShape, color);
          break;
        case LIGHT_TYPE.SPOT:
          Gizmos.drawWireCone(mtxShape, color);
          break;
      }

      Recycler.store(mtxShape);
      Recycler.store(color);
    }
  }
}