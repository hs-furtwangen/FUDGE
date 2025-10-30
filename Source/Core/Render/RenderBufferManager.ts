namespace FudgeCore {
  /**
   * Manages uniform data to be transmitted during rendering. All data is collected in one contiguous buffer and sent to the GPU in a single operation.
   * @internal
   * @authors Jonas Plotzky, HFU, 2025
   */
  export abstract class RenderBufferManager {
    protected static mapObjectToOffset: WeakMap<WeakKey, number> = new WeakMap<WeakKey, number>(); // Maps the objects to their respective byte offset in the gpu buffer

    /** The uniform block size (inside the shader) in bytes, includes layout std140 padding */
    protected static blockSize: number;
    protected static blockBinding: number;

    protected static buffer: WebGLBuffer;
    /** The offset in bytes between the beginning of consecutive object block data, set to a multiple of {@link WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT} */
    protected static spaceBuffer: number;

    protected static data: Float32Array;
    protected static dataUInt: Uint32Array;

    /** The offset in elements between the beginning of consecutive object block data */
    protected static spaceData: number;

    protected static count: number;

    /** @internal Replaces the decorated method with the manager’s implementation of the same name. */
    public static decorate<M extends (this: General, ...args: General) => General>(_method: M, _context: ClassMethodDecoratorContext<abstract new (...args: General[]) => General, M>): M {
      return Reflect.get(this, _context.name).bind(this);
    }

    protected static initialize(_renderWebGL: typeof RenderWebGL, _blockBinding: number, _blockSize: number, _maxObjects: number): void {
      this.blockSize = _blockSize;
      this.blockBinding = _blockBinding;

      this.blockSize = Math.ceil(this.blockSize / 16) * 16; // Round up to 16 bytes for std140 alignment. Actual shader-reported block size may differ across platforms; could query UNIFORM_BLOCK_DATA_SIZE from the shader program after compilation.

      const crc3: WebGL2RenderingContext = _renderWebGL.getRenderingContext();
      const alignment: number = crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);

      this.spaceBuffer = Math.ceil(this.blockSize / alignment) * alignment; // round to multiple of alignment
      this.spaceData = this.spaceBuffer / Float32Array.BYTES_PER_ELEMENT;
      const buffer: ArrayBuffer = new ArrayBuffer(this.spaceBuffer * _maxObjects);
      this.data = new Float32Array(buffer);
      this.dataUInt = new Uint32Array(buffer);
      this.count = 0;

      this.buffer = _renderWebGL.assert<WebGLBuffer>(crc3.createBuffer());
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, buffer.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    protected static resetRenderData(): void {
      this.count = 0;
    }

    protected static updateRenderbuffer(): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
    }

    protected static useRenderData(_object: WeakKey): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.mapObjectToOffset.get(_object), this.blockSize);
    }

    protected static store(_object: WeakKey): number {
      const offsetData: number = this.count * this.spaceData;
      this.mapObjectToOffset.set(_object, this.count * this.spaceBuffer); // offset in bytes
      this.count++;
      if (offsetData + this.spaceData > this.data.length)
        this.grow();

      return offsetData;
    }

    protected static updateRenderData(_object: WeakKey, ..._data: General[]): void {
      /** overriden in subclasses */
    };

    private static grow(): void {
      const data: Float32Array = new Float32Array(this.data.length * 1.5);
      data.set(this.data);
      this.data = data;
      this.dataUInt = new Uint32Array(this.data.buffer);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }
  }
}