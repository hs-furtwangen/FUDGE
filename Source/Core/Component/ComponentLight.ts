namespace FudgeCore {

  /**
   * Defines identifiers for the various types of light this component can provide.  
   */
  export enum LIGHT_TYPE {
    AMBIENT = "LightAmbient",
    DIRECTIONAL = "LightDirectional",
    POINT = "LightPoint",
    SPOT = "LightSpot"
  }
  /**
    * Attaches a light to the node.
    * The pivot matrix has different effects depending on the {@link LIGHT_TYPE}. See there for details.
    * @authors Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
    */
  export class ComponentLight extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentLight);

    @type(LIGHT_TYPE)
    public lightType: LIGHT_TYPE;
    public mtxPivot: Matrix4x4 = Matrix4x4.IDENTITY();
    public color: Color;
    public intensity: number;

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

    public serialize(): Serialization {
      let serialization: Serialization = {
        lightType: this.lightType,
        pivot: this.mtxPivot.serialize(),
        color: this.color.serialize(),
        intensity: this.intensity
      };
      serialization[super.constructor.name] = super.serialize();
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization[super.constructor.name]);
      if (_serialization.lightType != undefined)
        this.lightType = _serialization.lightType;
      await this.mtxPivot.deserialize(_serialization.pivot);
      if (_serialization.color != undefined)
        await this.color.deserialize(_serialization.color);
      if (_serialization.intensity != undefined)
        this.intensity = _serialization.intensity;

      // backwards compatibility, remove in future versions
      let light: Serialization = _serialization.light;
      if (light != undefined) {
        for (const path in light) {
          this.lightType = <LIGHT_TYPE>Serializer.getConstructor(path).name;
          light = light[path];
          if (light.color != undefined)
            await this.color.deserialize(light.color);
          if (light.intensity != undefined)
            this.intensity = light.intensity;
        }
      }

      return this;
    }

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