namespace FudgeCore {
  /**
   * Attaches a {@link Material} to the node
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019 - 2021 | Jonas Plotzky, HFU, 2025
   */
  export class ComponentMaterial extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentMaterial);

    @edit(Material)
    public material: Material;

    @edit(Color)
    public color: Color;

    @edit(Matrix3x3)
    public mtxPivot: Matrix3x3 = Matrix3x3.IDENTITY();

    /** Support sorting of objects with transparency when rendering, render objects in the back first. When this component is used as a part of a {@link ParticleSystem}, try enabling this when disabling {@link ComponentParticleSystem.depthMask} */
    @edit(Boolean)
    public sortForAlpha: boolean; // TODO: maybe make this a property of the material?

    public constructor(_material: Material = null, _color: Color = Color.CSS("white"), _sortForAlpha: boolean = false) {
      super();
      this.material = _material;
      this.color = _color;
      this.sortForAlpha = _sortForAlpha;
    }

    // TODO: backwards compatibility, remove in future versions
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);

      if (_serialization.idMaterial != undefined)
        this.material = <Material>await Project.getResource(_serialization.idMaterial);

      if (_serialization.clrPrimary != undefined)
        this.color.deserialize(_serialization.clrPrimary);

      if (_serialization.pivot != undefined)
        this.mtxPivot.deserialize(_serialization.pivot);

      return this;
    }
  }
}