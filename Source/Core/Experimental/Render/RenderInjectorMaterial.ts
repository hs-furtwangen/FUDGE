namespace FudgeCore {

  export class WebGLMaterialUniformBuffer extends WebGLUniformBuffer {

    public constructor(_capacity: number) {
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super(UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, _capacity);
    }

    public write(_slot: number, _properties: Experimental.MaterialProperty[], _alphaClip: number): void {
      const floatView: Float32Array = this.floatView;
      const offset: number = _slot * this.elementStride;

      for (let i: number = 0; i < _properties.length; i++)
        _properties[i].updateRenderData(floatView, offset);

      floatView[offset + 8] = _alphaClip;
    }

  }

  const buffer: WebGLMaterialUniformBuffer = new WebGLMaterialUniformBuffer(128);

  /**
  * Manages {@link Experimental.Material} data to be transmitted during rendering.
  * @internal
  * @authors Jonas Plotzky, HFU, 2025
  */
  export abstract class RenderInjectorMaterial {

    /** @internal Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<General, M>): M {
      const method: M = Reflect.get(this, _context.name);
      return method;
    }

    public static resetRenderData(): void {
      buffer.reset();
    }

    public static updateRenderbuffer(): void {
      buffer.update();
    }

    protected static updateRenderData(this: Experimental.Material): void {
      buffer.write(buffer.assign(this), this.properties, this.alphaClip);
    }

    protected static useRenderData(this: Experimental.Material): void {
      buffer.use(buffer.get(this));

      const properties: Experimental.MaterialProperty[] = this.properties;
      for (let i: number = 0; i < properties.length; i++) 
        properties[i].useRenderData();
    }
  }
}