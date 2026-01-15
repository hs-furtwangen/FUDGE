namespace FudgeCore {
  /**
   * Holds data to feed into a {@link Shader} to describe the surface of {@link Mesh}.  
   * {@link Material}s reference {@link Coat} and {@link Shader}.
   */
  export class Coat extends Mutable implements Serializable { // TODO: refactor into composition based structure

    /**
     * Clipping threshold for alpha values, every pixel with alpha < alphaClip will be discarded.
     */
    @order(0)
    @edit(Number)
    public alphaClip: number = 0.01;

    /** @internal reroute to {@link RenderManagerCoat.resetRenderData} */
    @RenderManagerCoat.decorate
    public static resetRenderData(): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerCoat.updateRenderbuffer} */
    @RenderManagerCoat.decorate
    public static updateRenderbuffer(): void { /* injected */ };

    /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
    @RenderManagerCoat.decorate
    public updateRenderData(): void { /* injected */ };

    /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
    @RenderManagerCoat.decorate
    public useRenderData(): void { /* injected */ };

    public serialize(): Serialization {
      return serializeDecorations(this);
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      return deserializeDecorations(this, _serialization);
    }
  }
}