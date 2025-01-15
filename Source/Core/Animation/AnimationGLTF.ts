namespace FudgeCore {
  /**
   * An {@link Animation} loaded from a glTF-File.
   * @authors Jonas Plotzky
   */
  export class AnimationGLTF extends mixinSerializableResourceExternal(Animation) {
    public async load(_url: RequestInfo = this.url, _name: string = this.name): Promise<AnimationGLTF> {
      this.url = _url;
      this.name = _name;
      return GLTFLoader.loadResource(this);
    }

    public serialize(): Serialization {
      const serialization: Serialization = super.serialize();
      serialization.events = { ...this.events };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);
      this.events = { ..._serialization.events };
      return this;
    }
  }
}