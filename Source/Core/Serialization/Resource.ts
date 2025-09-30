namespace FudgeCore {

  /**
   * A base class for resources. Extends {@link Mutable}, implements {@link SerializableResource}.
   */
  export class Resource extends Mutable implements SerializableResource {
    @edit(String)
    public name: string;

    @edit(String)
    public idResource: string;

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public deserialize(_serialization: Serialization): Promise<Serializable> | Serializable {
      if (Reflect.has(_serialization, "idResource"))
        Project.register(this, _serialization.idResource);
      
      return deserializeDecorations(this, _serialization);
    }

    protected reduceMutator(_mutator: Mutator): void {
      return;
    }
  }
}