namespace FudgeCore {
  /**
   * Manages uniform data to be transmitted during rendering. All data is collected in one contiguous buffer and sent to the GPU in a single operation.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderBufferManager {
    protected mapObjectToOffset: WeakMap<WeakKey, number> = new WeakMap<WeakKey, number>(); // Maps the objects to their respective byte offset in the gpu buffer

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
    
    protected constructor(_blockBinding: number, _blockSize: number, _maxObjects: number) {
      this.blockSize = _blockSize;
      this.blockBinding = _blockBinding;

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      const alignment: number = crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
      this.spaceBuffer = Math.ceil(this.blockSize / alignment) * alignment; // round to multiple of alignment
      this.spaceData = this.spaceBuffer / Float32Array.BYTES_PER_ELEMENT;
      this.data = new Float32Array(this.spaceData * _maxObjects);

      this.buffer = RenderWebGL.assert<WebGLBuffer>(crc3.createBuffer());
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    protected static get instance(): RenderBufferManager {
      Object.defineProperty(this, "instance", {
        //@ts-ignore
        value: new this()
      });

      return this.instance;
    }

    /** @internal Reroutes the decorated static method to the instance method of the **same name** of this manager’s singleton instance */
    protected static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<abstract new (...args: General[]) => General, M>): M {
      const method: M = Reflect.get(this.instance, _context.name); 
      return method.bind(this.instance);
    }

    protected resetRenderData(): void {
      this.count = 0;
    }

    protected updateRenderbuffer(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
    }

    protected useRenderData(_object: WeakKey): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.mapObjectToOffset.get(_object), this.blockSize);
    }

    protected store(_object: WeakKey): number {
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

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    protected abstract updateRenderData(_object: WeakKey, ..._data: General[]): void;
  }
}