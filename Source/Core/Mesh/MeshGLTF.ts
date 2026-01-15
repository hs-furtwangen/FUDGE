namespace FudgeCore {

  /**
   * A {@link Mesh} loaded from a glTF-File.
   * @authors Jonas Plotzky, HFU, 2024
   */
  export class MeshGLTF extends mixinSerializableResourceExternal(Mesh) {
    @edit(Number)
    public iPrimitive: number; // most likely will not stay consistent with the glTF file...

    public async load(_url: RequestInfo = this.url, _name: string = this.name, _iPrimitive: number = this.iPrimitive): Promise<MeshGLTF> {
      this.url = _url;
      this.name = _name;
      this.iPrimitive = _iPrimitive;
      return GLTFLoader.loadResource(this);
    }
  }
}