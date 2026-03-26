///<reference path="WebGLObjectUniformBuffer.ts"/>

namespace FudgeCore {

  const buffer: WebGLObjectUniformBuffer = new WebGLObjectUniformBuffer(256);

  /**
   * Manages {@link Node} data (data that is unique for each node, i.e. {@link Component} data) to be transmitted during rendering.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderInjectorNode {

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

    protected static updateRenderData(this: Node, _cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial, _cmpFaceCamera?: ComponentFaceCamera, _cmpParticleSystem?: ComponentParticleSystem): void {
      buffer.write(buffer.assign(this), _cmpMesh.mtxWorld, _cmpMaterial.mtxPivot, _cmpMaterial.color, _cmpParticleSystem?.blendMode, _cmpParticleSystem?.duration, _cmpParticleSystem?.size, _cmpParticleSystem?.time, _cmpFaceCamera?.isActive, _cmpFaceCamera?.restrict);
    }

    protected static useRenderData(this: Node, _mtxWorldOverride?: Matrix4x4): void {
      const slot: number = buffer.get(this);
      buffer.use(slot);

      if (_mtxWorldOverride) {// this is relatively slow, but since prepare has no camera information, we may need to override the world matrix here
        buffer.write(slot, _mtxWorldOverride);
        buffer.updateSlot(slot, 0, 16);
      }
    }
  }
}