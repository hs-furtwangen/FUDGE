namespace FudgeCore {

  /**
   * A base class for resources. Extends {@link Mutable}, implements {@link SerializableResource}.
   * @author Jonas Plotzky, HFU, 2025
   */
  @orderFlat
  export abstract class Resource extends Mutable implements SerializableResource {
    @order(0)
    @edit(String)
    public name: string;

    @order(1)
    @edit(String)
    public idResource: string;

    public constructor(_name: string = Resource.name, _register: boolean = true) {
      super();
      this.name = _name;
      if (_register)
        Project.register(this);
    }

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public deserialize(_serialization: Serialization): Promise<Serializable> | Serializable {
      if (Reflect.has(_serialization, "idResource"))
        Project.register(this, _serialization.idResource);

      return deserializeDecorations(this, _serialization);
    }
  }
}