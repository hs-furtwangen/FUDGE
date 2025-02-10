namespace FudgeCore {
  export abstract class UniformBufferManager<T extends WeakKey> {
    protected mapObjectToOffset: WeakMap<T, number> = new WeakMap<T, number>(); // Maps the objects to their respective byte offset in the gpu buffer

    /** The uniform block size (inside the shader) in bytes, includes layout std140 padding */
    protected blockSize: number;
    protected blockBinding: number;

    protected buffer: WebGLBuffer;
    /** The offset in bytes between the beginning of consecutive object block data, set to a multiple of {@link WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT} */
    protected spaceBuffer: number;

    protected data: Float32Array;
    /** The offset in elements between the beginning of consecutive object block data */
    protected spaceData: number;

    protected count: number = 0;

    protected crc3: WebGL2RenderingContext;

    protected constructor(_crc3: WebGL2RenderingContext, _blockBinding: number, _blockSize: number, _maxObjects: number) {
      this.crc3 = _crc3;
      this.blockSize = _blockSize;
      this.blockBinding = _blockBinding;

      const alignment: number = _crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
      this.spaceBuffer = Math.ceil(this.blockSize / alignment) * alignment; // round to multiple of alignment
      this.spaceData = this.spaceBuffer / Float32Array.BYTES_PER_ELEMENT;
      this.data = new Float32Array(this.spaceData * _maxObjects);

      this.buffer = _crc3.createBuffer();
      _crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      _crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    // public static get instance(): UniformBufferManager<WeakKey> {
    //   Object.defineProperty(this, "instancee", {
    //     //@ts-ignore
    //     value: new this()
    //   });

    //   return this.instance;
    // }

    // public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<General, M>): M {
    //   if (_context.static) { // reroute static calls it the singleton instance
    //     const method: M = Reflect.get(this.instance, _context.name);
    //     return method.bind(this.instance);
    //   }

    //   return Reflect.get(this, _context.name);
    // }

    public resetRenderData(): void {
      this.count = 0;
    }

    public updateRenderbuffer(): void {
      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
    }

    public useRenderData(_object: T): void {
      this.crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.mapObjectToOffset.get(_object), this.blockSize);
    }

    public store(_object: T): number {
      const offsetData: number = this.count * this.spaceData;
      this.mapObjectToOffset.set(_object, this.count * this.spaceBuffer); // offset in bytes
      this.count++;
      if (offsetData + this.spaceData > this.data.length)
        this.grow();

      return offsetData;
    }

    private grow(): void {
      const data: Float32Array = new Float32Array(this.data.length * 1.5);
      data.set(this.data);
      this.data = data;

      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    // public abstract updateRenderData(_object: T, ..._data: General[]): void;
  }
}