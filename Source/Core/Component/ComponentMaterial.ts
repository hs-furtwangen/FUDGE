namespace FudgeCore {
  /**
   * Attaches a {@link Material} to the node
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019 - 2021
   */
  export class ComponentMaterial extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentMaterial);

    public clrPrimary: Color = Color.CSS("white");
    public clrSecondary: Color = Color.CSS("white");
    public mtxPivot: Matrix3x3 = Matrix3x3.IDENTITY();

    @type(Material)
    public material: Material;

    /** Support sorting of objects with transparency when rendering, render objects in the back first. When this component is used as a part of a {@link ParticleSystem}, try enabling this when disabling {@link ComponentParticleSystem.depthMask} */
    public sortForAlpha: boolean = false; // TODO: maybe make this a property of the material?

    public constructor(_material: Material = null) {
      super();
      this.material = _material;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = {
        sortForAlpha: this.sortForAlpha,
        clrPrimary: this.clrPrimary.serialize(),
        clrSecondary: this.clrSecondary.serialize(),
        pivot: this.mtxPivot.serialize(),
        [super.constructor.name]: super.serialize(),
        idMaterial: this.material.idResource
      };

      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.material = <Material>await Project.getResource(_serialization.idMaterial);
      this.clrPrimary.deserialize(_serialization.clrPrimary);
      this.clrSecondary.deserialize(_serialization.clrSecondary);
      this.sortForAlpha = _serialization.sortForAlpha;
      this.mtxPivot.deserialize(_serialization.pivot);
      await super.deserialize(_serialization[super.constructor.name]);
      return this;
    }
    //#endregion
  }
}