namespace FudgeCore {
  /**
   * Attached to a {@link Node} with an attached {@link ComponentCamera} this causes the rendered image to receive a bloom-effect.
   * @authors Roland Heer, HFU, 2023
   */
  export class ComponentBloom extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentBloom);
    
    #threshold: number;
    #intensity: number;
    #highlightDesaturation: number;

    public constructor(_threshold: number = 0.95, _intensity: number = 1.0, _desaturateHighlights: number = 0.5) {
      super();
      this.#threshold = _threshold;
      this.#intensity = _intensity;
      this.#highlightDesaturation = _desaturateHighlights;
    }

    @edit(Number)
    public get threshold(): number {
      return this.#threshold;
    }

    public set threshold(_value: number) {
      this.#threshold = Calc.clamp(_value, 0, 1);
    }

    @edit(Number)
    public get intensity(): number {
      return this.#intensity;
    }

    public set intensity(_value: number) {
      this.#intensity = Math.max(0, _value);
    }

    @edit(Number)
    public get highlightDesaturation(): number {
      return this.#highlightDesaturation;
    }

    public set highlightDesaturation(_value: number) {
      this.#highlightDesaturation = Calc.clamp(_value, 0, 1);
    }

    public getMutator(_extendable?: boolean): Mutator {
      return super.getMutator(_extendable);
    }
  }
}