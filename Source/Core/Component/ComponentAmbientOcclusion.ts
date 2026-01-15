namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive an ambient occlusion effect.
   * @authors Roland Heer, HFU, 2023 | Jonas Plotzky, HFU, 2023
   */
  export class ComponentAmbientOcclusion extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentAmbientOcclusion);

    @edit(Number)
    public sampleRadius: number;

    @edit(Number)
    public bias: number;

    @edit(Number)
    public attenuationConstant: number;

    @edit(Number)
    public attenuationLinear: number;
    
    @edit(Number)
    public attenuationQuadratic: number;

    public constructor(_sampleRadius: number = 16, _bias: number = 0.07, _attenuationConstant: number = 2.5, _attenuationLinear: number = 1, _attenuationQuadratic: number = 1) {
      super();
      this.sampleRadius = _sampleRadius;
      this.bias = _bias;
      this.attenuationConstant = _attenuationConstant;
      this.attenuationLinear = _attenuationLinear;
      this.attenuationQuadratic = _attenuationQuadratic;
    }
  }
}