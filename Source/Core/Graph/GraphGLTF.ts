namespace FudgeCore {

  /**
   * A {@link Graph} loaded from a glTF-File.
   * @authors Jonas Plotzky, HFU, 2024
   */
  export class GraphGLTF extends mixinSerializableResourceExternal(Graph) {
    public async load(_url: RequestInfo = this.url, _name: string = this.name): Promise<GraphGLTF> {
      this.url = _url;
      this.name = _name;
      return GLTFLoader.loadResource(this);
    }

    public serialize(): Serialization {
      const serializationExternal: Serialization = super.serialize();
      const serializationNode: Serialization = Node.prototype.serialize.call(this); // this is wasteful as we only need the components deserialized
      delete serializationNode.components[ComponentSkeleton.name];
      delete serializationNode.children;
      return { ...serializationNode, ...serializationExternal };
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);
      await Graph.prototype.deserialize.call(this, _serialization);
      return this;
    }
  }
}