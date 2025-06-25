namespace FudgeCore {
  /**
   * Holds data to feed into a {@link Shader} to describe the surface of {@link Mesh}.  
   * {@link Material}s reference {@link Coat} and {@link Shader}.
   */
  export class Coat extends Mutable implements Serializable { // TODO: refactor into composition based structure
    // public name: string = "Coat";
    /**
     * Clipping threshold for alpha values, every pixel with alpha < alphaClip will be discarded.
     */
    public alphaClip: number = 0.01;

    /** @internal reroute to {@link RenderManagerCoat.resetRenderData} */
    @RenderManagerCoat.decorate
    public static resetRenderData(): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerCoat.updateRenderbuffer} */
    @RenderManagerCoat.decorate
    public static updateRenderbuffer(): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerCoat.updateRenderData} */
    @RenderManagerCoat.decorate
    protected static updateRenderData(_coat: Coat): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerCoat.useRenderData} */
    @RenderManagerCoat.decorate
    protected static useRenderData(_coat: Coat): void { /* injected */ };

    /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
    public updateRenderData(): void {
      Coat.updateRenderData(this);
    };

    /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
    public useRenderData(): void {
      Coat.useRenderData(this);
    };

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