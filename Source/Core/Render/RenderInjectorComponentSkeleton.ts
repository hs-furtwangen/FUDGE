namespace FudgeCore {

  /**
   * Buffers the bone data from the {@link ComponentSkeleton} into a WebGL Buffer
   * @internal
   */
  export class RenderInjectorComponentSkeleton {
    public static decorate(_constructor: typeof ComponentSkeleton, _context: ClassDecoratorContext): void {
      Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderBuffer.name, {
        value: RenderInjectorComponentSkeleton.useRenderBuffer
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.updateRenderBuffer.name, {
        value: RenderInjectorComponentSkeleton.updateRenderBuffer
      });
      Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderBuffer.name, {
        value: RenderInjectorComponentSkeleton.deleteRenderBuffer
      });
    }

    protected static useRenderBuffer(this: ComponentSkeleton): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this.renderBuffer)
        crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.SKIN.BINDING, this.renderBuffer);
    }

    protected static updateRenderBuffer(this: ComponentSkeleton): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (!this.renderBuffer) {
        const bonesByteSize: number = 256 * 16 * 4; // CAUTION: this is dependent on the shader source code where 256 is the maximum number of bones

        this.renderBuffer = RenderWebGL.assert(crc3.createBuffer());
        crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
        crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, bonesByteSize, WebGL2RenderingContext.DYNAMIC_DRAW);
      }

      if (!this.mtxBonesData) {
        this.mtxBones = new Array(this.bones.length);
        this.mtxBonesData = new Float32Array(this.bones.length * 16);

        for (let i: number = 0; i < this.bones.length; i++)
          this.mtxBones[i] = new Matrix4x4(this.mtxBonesData.subarray(i * 16, i * 16 + 16));
      }

      for (let i: number = 0; i < this.bones.length; i++)
        Matrix4x4.PRODUCT(this.bones[i].mtxWorld, this.mtxBindInverses[i], this.mtxBones[i]);

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.mtxBonesData);
    }

    protected static deleteRenderBuffer(this: ComponentSkeleton): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this.renderBuffer)
        crc3.deleteBuffer(this.renderBuffer);
    }
  }
}