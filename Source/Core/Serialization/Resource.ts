namespace FudgeCore {

  // const REGISTERED_RESOURCE_CLASSES: Set<abstract new () => SerializableResource> = new Set();

  // export function registerResourceClass(_class: abstract new () => SerializableResource): void {
  //   REGISTERED_RESOURCE_CLASSES.add(_class);
  // }

  // export function isResourceClass(_class: General): _class is new () => SerializableResource {
  //   return REGISTERED_RESOURCE_CLASSES.has(_class);
  // }

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

    public constructor(_name: string = Resource.name, _register: boolean = false) {
      super();
      this.name = _name;
      if (_register)
        Project.register(this);
    }

    public get isResource(): true {
      return true;
    }

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public deserialize(_serialization: Serialization): Promise<Serializable> | Serializable {
      return deserializeDecorations(this, _serialization);
    }
  }
}