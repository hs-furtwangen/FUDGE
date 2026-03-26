///<reference path="WebGLCoatUniformBuffer.ts"/>

namespace FudgeCore {
  
  const buffer: WebGLCoatUniformBuffer = new WebGLCoatUniformBuffer(128);

  /**
   * Manages {@link Coat} data to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export class RenderInjectorCoat {
    /** @internal Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<General, M>): M {
      const method: M = Reflect.get(this, _context.name);
      return method;
    }

    protected static resetRenderData(): void {
      buffer.reset();
    }

    protected static updateRenderbuffer(): void {
      buffer.update();
    }

    protected static updateRenderData(this: Coat & CoatColored & CoatRemissive): void {
      buffer.write(buffer.assign(this), this.color, this.diffuse, this.specular, this.intensity, this.metallic, this.alphaClip);
    }

    protected static useRenderData(this: Coat): void {
      buffer.use(buffer.get(this));
    }
  }

  /**
   * @internal
   */
  export class RenderInjectorCoatTextured extends RenderInjectorCoat {
    protected static override useRenderData(this: CoatTextured): void {
      super.useRenderData();
      this.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
    }
  }

  /**
   * @internal
   */
  export class RenderInjectorCoatRemissiveTexturedNormals extends RenderInjectorCoatTextured {
    protected static override useRenderData(this: CoatRemissiveTexturedNormals): void {
      super.useRenderData();
      this.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);
    }
  }

  /**
   * @internal
   */
  export class RenderInjectorCoatToon extends RenderInjectorCoat {
    protected static override useRenderData(this: CoatToon): void {
      super.useRenderData();
      this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }

  /**
   * @internal
   * needed for correct injected super call to RenderManagerCoatTextured...
   */
  export class RenderInjectorCoatToonTextured extends RenderInjectorCoatTextured {
    protected static override useRenderData(this: CoatToonTextured): void {
      super.useRenderData();
      this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);
    }
  }
}