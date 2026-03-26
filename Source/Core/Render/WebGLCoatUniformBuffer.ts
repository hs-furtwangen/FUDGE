///<reference path="WebGLUniformBuffer.ts"/>

namespace FudgeCore {
  export class WebGLCoatUniformBuffer extends WebGLUniformBuffer {
    public constructor(_capacity: number) {
      const blockSize: number = (4 + 1 + 1 + 1 + 1 + 1) * 4; // vct4 color, float diffuse, float specular, float intensity, float metallic, float alphaClip
      super(UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, _capacity);
    }

    public write(_slot: number, _color?: Color, _diffuse?: number, _specular?: number, _intensity?: number, _metallic?: number, _alphaClip?: number): void {
      const floatView: Float32Array = this.floatView;
      const offset: number = _slot * this.elementStride;

      const color: Color = _color;
      floatView[offset] = color.r;
      floatView[offset + 1] = color.g;
      floatView[offset + 2] = color.b;
      floatView[offset + 3] = color.a;

      if (_diffuse !== undefined || _specular !== undefined || _intensity !== undefined || _metallic !== undefined) {
        floatView[offset + 4] = _diffuse;
        floatView[offset + 5] = _specular;
        floatView[offset + 6] = _intensity;
        floatView[offset + 7] = _metallic;
      }

      floatView[offset + 8] = _alphaClip;
    }
  }
}