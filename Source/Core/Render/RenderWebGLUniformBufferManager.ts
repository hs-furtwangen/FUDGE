namespace FudgeCore {
  
  abstract class UniformBufferManager<T extends WeakKey> {
    protected offsets: WeakMap<T, number> = new WeakMap<T, number>(); // Maps the nodes to their respective byte offset in the uboNodes buffer

    /** The uniform block size (inside the shader) in bytes, may include layout std140 padding */
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

    public constructor(_crc3: WebGL2RenderingContext, _blockBinding: number, _blockSize: number, _maxObjects: number) {
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

    public grow(): void {
      const data: Float32Array = new Float32Array(this.data.length * 1.5);
      data.set(this.data);
      this.data = data;

      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
    }

    public reset(): void {
      this.count = 0;
    }

    public updateRenderbuffer(): void {
      this.crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
      this.crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
    }

    public useRenderData(_object: T): void {
      this.crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.offsets.get(_object), this.blockSize);
    }

    public abstract updateRenderData(..._args: General[]): void;
  }

  export class UniformBufferManagerNode extends UniformBufferManager<Node> {
    public useRenderData(_node: Node, _mtxWorldOverride?: Matrix4x4): void {
      let offset: number = this.offsets.get(_node);
      this.crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, offset, this.blockSize);

      if (_mtxWorldOverride) // this is relatively slow, but since prepare has no camera information, we have to override the world matrix here
        this.crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, offset, _mtxWorldOverride.get());
    }

    public updateRenderData(_node: Node, _mtxWorld: Matrix4x4, _mtxPivot: Matrix3x3, _color: Color): void {
      const offset: number = this.count * this.spaceData;
      if (offset + this.spaceData > this.data.length)
        this.grow();
      
      const data: Float32Array = this.data;
      // mtx world
      data.set(_mtxWorld.getData(), offset);

      // mtx pivot
      let dataPivot: Float32Array = _mtxPivot.get();
      let offsetPivot: number = offset + 16;

      data[offsetPivot] = dataPivot[0];
      data[offsetPivot + 1] = dataPivot[1];
      data[offsetPivot + 2] = dataPivot[2];
      // data[offsetPivot + 3] = padding
      data[offsetPivot + 4] = dataPivot[3];
      data[offsetPivot + 5] = dataPivot[4];
      data[offsetPivot + 6] = dataPivot[5];
      // data[offsetPivot + 7] = padding
      data[offsetPivot + 8] = dataPivot[6];
      data[offsetPivot + 9] = dataPivot[7];
      data[offsetPivot + 10] = dataPivot[8];

      // color
      let offsetColor: number = offset + 28;
      data[offsetColor] = _color.r;
      data[offsetColor + 1] = _color.g;
      data[offsetColor + 2] = _color.b;
      data[offsetColor + 3] = _color.a;

      // if (_cmpFaceCamera) {
      //   data[offset + 32] = _cmpFaceCamera.isActive ? 1 : 0;
      //   data[offset + 33] = _cmpFaceCamera.restrict ? 1 : 0;
      // }

      this.offsets.set(_node, this.count * this.spaceBuffer);
      this.count++;
    }
  }

  // export class UniformBufferManagerMaterial extends UniformBufferManager<Coat> {


  //   public updateRenderData(_coat: Coat): void {
  //     const data: Float32Array = this.data;
  //     const offset: number = this.count * this.spaceData;


  //     this.offsets.set(_coat, this.count * this.spaceBuffer);
  //     this.count++;
  //   }
  // }
}