namespace FudgeCore {
  /**
   * Holds data to feed into a {@link Shader} to describe the surface of {@link Mesh}.  
   * {@link Material}s reference {@link Coat} and {@link Shader}.   
   * The method useRenderData will be injected by {@link RenderInjector} at runtime, extending the functionality of this class to deal with the renderer.
   */
  export class Coat extends Mutable implements Serializable { // TODO: refactor into composition based structure
    // public name: string = "Coat";
    /**
     * Clipping threshold for alpha values, every pixel with alpha < alphaClip will be discarded.
     */
    public alphaClip: number = 0.01;

    //#region Transfer
    public serialize(): Serialization {
      return {
        alphaClip: this.alphaClip
      };
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (_serialization.alphaClip !== undefined)
        this.alphaClip = _serialization.alphaClip;
      return this;
    }

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.renderData;
    }
    //#endregion
  }
}