namespace FudgeCore {
  /**
   * Buffers the random number data for the particle system ({@link ComponentParticleSystem}) into a WebGL Texture
   * @authors Jonas Plotzky, HFU, 2022
   * @internal
   */
  export class RenderInjectorComponentParticleSystem {
    /**
     * Replaces the decorated method with the static method of the same name of class. Used in {@link ComponentParticleSystem}
     */
    public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<ComponentParticleSystem, M>): M {
      return Reflect.get(this, _context.name);
    }

    protected static useRenderData(this: ComponentParticleSystem): void {
      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      if (this.renderData) {
        crc3.activeTexture(TEXTURE_LOCATION.PARTICLE.UNIT); // ATTENTION!: changing this id requires changing of corresponding id in particle render method, use ctrl + shift + f search!
        crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData);
        return;
      }

      const texture: WebGLTexture = Render.assert<WebGLTexture>(crc3.createTexture());
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);

      let textureSize: number = Math.ceil(Math.sqrt(this.size));
      textureSize = Math.min(textureSize, crc3.getParameter(crc3.MAX_TEXTURE_SIZE));

      // TODO: use internal random number generator, additionally maybe use a seed to make it possible to recreate the same random numbers
      let randomNumbers: number[] = [];
      for (let i: number = 0; i < textureSize * textureSize; i++)
        randomNumbers.push(Math.random());

      try {
        crc3.texImage2D(
          WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.R32F, textureSize, textureSize, 0, WebGL2RenderingContext.RED, WebGL2RenderingContext.FLOAT,
          Float32Array.from(randomNumbers)
        );
      } catch (_error) {
        Debug.error(_error);
      }

      crc3.texParameteri(crc3.TEXTURE_2D, crc3.TEXTURE_MIN_FILTER, crc3.NEAREST);
      crc3.texParameteri(crc3.TEXTURE_2D, crc3.TEXTURE_MAG_FILTER, crc3.NEAREST);

      this.renderData = texture;

      this.useRenderData();
    }

    protected static deleteRenderData(this: ComponentParticleSystem): void {
      if (!this.renderData) return;

      let crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
      crc3.deleteTexture(this.renderData);
      delete this.renderData;
    }
  }
}