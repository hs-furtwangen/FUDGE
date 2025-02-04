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
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this instanceof CoatTextured) 
        this.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
      
      if (this instanceof CoatRemissiveTexturedNormals) 
        this.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);
      
      if (this instanceof CoatToon) 
        this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);

      if (this.renderBuffer)
        crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.MATERIAL.BINDING, this.renderBuffer);
    }

    protected static updateRenderData(this: Coat): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const data: Float32Array = new Float32Array(4 + 1 + 1 + 1 + 1 + 1); // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      
      if (this instanceof CoatColored) 
        data.set(this.color.get(), 0);
      
      if (this instanceof CoatRemissive || this instanceof CoatRemissiveTextured) {
        data[4] = this.diffuse;
        data[5] = this.specular;
        data[6] = this.intensity;
        data[7] = this.metallic;
      }

      data[8] = this.alphaClip;

      if (this instanceof CoatTextured) 
        this.texture.useRenderData(TEXTURE_LOCATION.COLOR.UNIT);
      
      if (this instanceof CoatRemissiveTexturedNormals) 
        this.normalMap.useRenderData(TEXTURE_LOCATION.NORMAL.UNIT);
      
      if (this instanceof CoatToon) 
        this.texToon.useRenderData(TEXTURE_LOCATION.TOON.UNIT);

      // buffer data to bound buffer
      if (!this.renderBuffer) {
        this.renderBuffer ??= RenderWebGL.assert(crc3.createBuffer());
        crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
        crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      }

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, data);
    }

    protected static deleteRenderData(this: Coat): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this.renderBuffer)
        crc3.deleteBuffer(this.renderBuffer);
    }
  }
}