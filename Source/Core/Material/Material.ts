namespace FudgeCore {

  /**
   * Baseclass for materials. Combines a {@link Shader} with a compatible {@link Coat}
   * @author Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
   */
  @orderFlat
  export class Material extends Mutable implements SerializableResource {
    public timestampUpdate: number = 0;

    @order(0)
    @edit(String)
    public name: string;

    @order(1)
    @edit(String)
    public idResource: string;

    @serializeFunction(Shader)
    private shader: typeof Shader; // The shader program used by this BaseMaterial
    #coat: Coat;

    public constructor(_name: string = Material.name, _shader?: typeof Shader, _coat?: Coat) {
      super();
      this.name = _name;
      this.shader = _shader;
      if (_shader) {
        if (_coat)
          this.coat = _coat;
        else
          this.coat = this.createCoatMatchingShader();
      }

      Project.register(this);
    }

    /**
     * Returns the currently referenced {@link Coat} instance
     */
    @order(2)
    @editReconstruct(Coat)
    public get coat(): Coat {
      return this.#coat;
    }
    /**
     * Makes this material reference the given {@link Coat} if it is compatible with the referenced {@link Shader}
     */
    public set coat(_coat: Coat) {
      if (this.shader)
        if (_coat.constructor != this.shader.getCoat())
          if (_coat instanceof this.shader.getCoat())
            Debug.fudge("Coat is extension of Coat required by shader");
          else
            throw (new Error("Shader and coat don't match"));
      this.#coat = _coat;
    }

    public get isResource(): true {
      return true;
    }

    /**
     * Creates a new {@link Coat} instance that is valid for the {@link Shader} referenced by this material
     */
    public createCoatMatchingShader(): Coat {
      let coat: Coat = new (this.shader.getCoat())();
      return coat;
    }

    /**
     * Changes the materials reference to the given {@link Shader}, creates and references a new {@link Coat} instance  
     * and mutates the new coat to preserve matching properties.
     */
    public setShader(_shader: typeof Shader): void {
      this.shader = _shader;
      let coat: Coat = this.createCoatMatchingShader();
      coat.mutate(this.#coat?.getMutator());
      this.coat = coat;
    }

    /**
     * Returns the {@link Shader} referenced by this material
     */
    public getShader(): typeof Shader {
      return this.shader;
    }

    public serialize(): Serialization {
      return serializeDecorations(this);
    }

    public deserialize(_serialization: Serialization): Promise<Serializable> {
      return deserializeDecorations(this, _serialization);
    }
  }
}