namespace FudgeCore {
  /**
   * Gives WebGL Buffer the data from the {@link Coat}
   * @internal
   */
  export class RenderInjectorCoat {
    public static decorate(_constructor: typeof Coat, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderData.name, {
        value: RenderInjectorCoat.useRenderData
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.updateRenderData.name, {
        value: RenderInjectorCoat.updateRenderData
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderData.name, {
        value: RenderInjectorCoat.deleteRenderData
      });
    }

    protected static useRenderData(this: Coat): void {
      UniformBufferManagerMaterial.instance.useRenderData(this);
    }

    protected static updateRenderData(this: Coat): void {
      UniformBufferManagerMaterial.instance.updateRenderData(this);
    }

    protected static deleteRenderData(this: Coat): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this.renderBuffer)
        crc3.deleteBuffer(this.renderBuffer);
    }
  }
}