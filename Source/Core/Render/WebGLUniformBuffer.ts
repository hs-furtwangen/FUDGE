namespace FudgeCore {

  const SLOT: unique symbol = Symbol("WebGLUniformBufferSlot");

  export class WebGLUniformBuffer {
    public readonly blockBinding: number;
    public readonly blockSize: number;
    public readonly byteStride: number;
    public readonly elementStride: number;

    protected arrayBuffer: ArrayBuffer;
    protected floatView: Float32Array;
    protected uintView: Uint32Array;

    private buffer: WebGLBuffer;

    private capacity: number;
    private assignments: number;

    public constructor(_blockBinding: number, _blockSize: number, _capacity: number) {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();

      this.blockBinding = _blockBinding;
      this.blockSize = Math.ceil(_blockSize / 16) * 16; // Round up to 16 bytes for std140 alignment. Actual shader-reported block size may differ across platforms; could query UNIFORM_BLOCK_DATA_SIZE from the shader program after compilation.
      this.capacity = _capacity;
      this.assignments = 0;

      const alignment: number = crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
      this.byteStride = Math.ceil(this.blockSize / alignment) * alignment; // round to multiple of alignment
      this.elementStride = this.byteStride / Float32Array.BYTES_PER_ELEMENT;

      this.arrayBuffer = new ArrayBuffer(this.byteStride * _capacity);
      this.floatView = new Float32Array(this.arrayBuffer);
      this.uintView = new Uint32Array(this.arrayBuffer);

      this.buffer = RenderWebGL.assert<WebGLBuffer>(crc3.createBuffer());
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.arrayBuffer.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    public use(_slot: number): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, _slot * this.byteStride, this.blockSize);
    }

    public update(_length: number = this.assignments): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.floatView, 0, _length * this.elementStride);
    }

    public updateSlot(_slot: number, _offset: number = 0, _length: number = this.blockSize): void {
      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, _slot * this.byteStride + _offset * Float32Array.BYTES_PER_ELEMENT, this.floatView, _slot * this.elementStride + _offset, _length);
    }

    public reset(): void {
      this.assignments = 0;
    }

    public assign(_handle: General): number {
      if (this.assignments >= this.capacity)
        this.grow();

      return _handle[SLOT] = this.assignments++;
    }

    public get(_handle: General): number {
      return _handle[SLOT];
    }

    public grow(_factor: number = 1.5): void {
      this.capacity = Math.ceil(this.capacity * _factor);

      this.arrayBuffer = this.arrayBuffer.transfer(this.byteStride * this.capacity);
      this.floatView = new Float32Array(this.arrayBuffer);
      this.uintView = new Uint32Array(this.arrayBuffer);

      const crc3: WebGL2RenderingContext = RenderWebGL.getRenderingContext();
      crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.arrayBuffer.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }
  }
}