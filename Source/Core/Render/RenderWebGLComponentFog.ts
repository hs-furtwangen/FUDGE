namespace FudgeCore {
  export abstract class RenderWebGLComponentFog {
    static #buffer: WebGLBuffer;
    static #data: Float32Array;

    /** @internal Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<C extends typeof ComponentFog, M extends (this: C, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<C, M>): M {
      return Reflect.get(this, _context.name);
    }

    public static initialize(_renderWebGL: typeof RenderWebGL): void {
      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();

      RenderWebGLComponentFog.#buffer = _renderWebGL.assert(crc3.createBuffer());
      RenderWebGLComponentFog.#data = new Float32Array(8);

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
      crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, UNIFORM_BLOCK.FOG.BINDING, RenderWebGLComponentFog.#buffer);
    }

    /**
     * Buffer the fog parameters into the fog ubo.
     */
    public static useRenderbuffer(_cmpFog: ComponentFog): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const data: Float32Array = RenderWebGLComponentFog.#data;

      data[0] = _cmpFog?.isActive ? 1 : 0;
      if (_cmpFog) {
        data[1] = _cmpFog.near;
        data[2] = _cmpFog.far;
        data.set(_cmpFog.color.get(), 4);
      }

      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentFog.#data);
    }

  }
}