namespace FudgeCore {
  /**
   * Generate a torus with a given ring radius, tube radius and the number of major- and minor segments
   * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2020
   */
  export class MeshTorus extends MeshRotation {
    public static readonly iSubclass: number = Mesh.registerSubclass(MeshTorus);

    @edit(Number)
    private latitudes: number = 12;

    @edit(Number)
    private radiusRing: number = 0.5 - 0.125;

    @edit(Number)
    private radiusTube: number = 0.125;

    public constructor(_name: string = "MeshTorus", _radiusRing: number = 0.5 - 0.125, _radiusTube: number = 0.125, _longitudes: number = 8, _latitudes: number = 6) {
      super(_name, MeshTorus.getShape(_radiusRing, _radiusTube, Math.max(3, _latitudes)), _longitudes);
      this.radiusTube = _radiusTube;
      this.radiusRing = _radiusRing;
      this.longitudes = _longitudes;
      this.latitudes = Math.max(3, _latitudes);
    }

    private static getShape(_radiusRing: number, _radiusTube: number, _latitudes: number): Vector2[] {
      let shape: Vector2[] = [];
      let center: Vector2 = new Vector2(_radiusRing, 0);
      for (let latitude: number = 0; latitude <= _latitudes; latitude++) {
        let angle: number = 2 * Math.PI * latitude / _latitudes;
        shape.push(Vector2.SUM(center, new Vector2(_radiusTube * -Math.cos(angle), _radiusTube * Math.sin(angle))));
      }
      return shape;
    }

    /**
     * Create this torus from the given parameters
     */
    public create(_radiusRing: number = 0.5 - 0.125, _radiusTube: number = 0.125, _longitudes: number = 8, _latitudes: number = 6): void {
      this.radiusTube = _radiusTube;
      this.latitudes = Math.max(3, Math.round(_latitudes));
      this.radiusRing = _radiusRing;
      super.rotate(MeshTorus.getShape(_radiusRing, _radiusTube, _latitudes), _longitudes);
    }


    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = super.serialize();
      delete serialization.shape;
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);
      this.create(_serialization.radiusRing, _serialization.radiusTube, _serialization.longitudes, _serialization.latitudes);
      return this;
    }

    public async mutate(_mutator: Mutator, _dispatchMutate: boolean = true): Promise<void> {
      await super.mutate(_mutator, _dispatchMutate);
      this.create(this.radiusRing, this.radiusTube, this.longitudes, this.latitudes);
    }

    public getMutator(_extendable?: boolean): Mutator {
      let mutator: Mutator = super.getMutator(_extendable);
      delete mutator.shape;
      return mutator;
    }
    //#endregion
  }
}