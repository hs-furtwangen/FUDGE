/// <reference path="../Light/Light.ts"/>
/// <reference path="../Render/RenderWebGLComponentLight.ts"/>

namespace FudgeCore {

  /**
    * Attaches a light to the node.
    * The pivot matrix has different effects depending on the {@link LIGHT_TYPE}. See there for details.
    * @authors Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
    */
  export class ComponentLight extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentLight);

    private static gizmoLines: Vector3[];

    @edit(Matrix4x4)
    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();

    @edit(Light)
    public light: Light;

    public readonly mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY();

    public constructor(_light: Light = null) {
      super();
      this.singleton = false;
      this.light = _light;
    }

    /** @internal reroute to {@link RenderWebGLComponentLight} */
    @RenderWebGLComponentLight.decorate
    public static processLights(_lights: MapLightTypeToLightList): void { /* injected */ };

    /** @internal reroute to {@link RenderWebGLComponentLight} */
    @RenderWebGLComponentLight.decorate
    public static processShadowsDirectional(_nodes: Iterable<Node>, _cmpCamera: ComponentCamera): void { /* injected */ };

    /** @internal reroute to {@link RenderWebGLComponentLight} */
    @RenderWebGLComponentLight.decorate
    public static processShadowsSpot(_nodes: Iterable<Node>): void { /* injected */ };

    /** @internal reroute to {@link RenderWebGLComponentLight} */
    @RenderWebGLComponentLight.decorate
    public static processShadowsPoint(_nodes: Iterable<Node>): void { /* injected */ };

    public drawGizmos(_cmpCamera: ComponentCamera): void {
      let mtxShape: Matrix4x4 = Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
      mtxShape.scaling = new Vector3(0.5, 0.5, 0.5);
      Gizmos.drawIcon(TextureDefault.iconLight, mtxShape, this.light.color);
      Recycler.store(mtxShape);
    };

    public drawGizmosSelected(): void {
      let mtxShape: Matrix4x4 = Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
      let color: Color = Color.CSS("yellow");

      switch (this.light.getType()) {
        case LightDirectional:
          const radius: number = 0.5;
          Gizmos.drawWireCircle(mtxShape, color);
          const lines: Vector3[] = ComponentLight.gizmoLines ??= new Array(10).fill(null).map(() => Recycler.get(Vector3));
          lines[0].set(0, 0, 0); lines[1].set(0, 0, 1);
          lines[2].set(0, radius, 0); lines[3].set(0, radius, 1);
          lines[6].set(0, -radius, 0); lines[7].set(0, -radius, 1);
          lines[4].set(radius, 0, 0); lines[5].set(radius, 0, 1);
          lines[8].set(-radius, 0, 0); lines[9].set(-radius, 0, 1);
          Gizmos.drawLines(lines, mtxShape, color);
          break;
        case LightPoint:
          mtxShape.scale(new Vector3(2, 2, 2));
          Gizmos.drawWireSphere(mtxShape, color);
          break;
        case LightSpot:
          Gizmos.drawWireCone(mtxShape, color);
          break;
      }

      Recycler.store(mtxShape);
      Recycler.store(color);
    }
  }
}