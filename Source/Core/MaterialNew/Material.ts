namespace FudgeCore {
  export namespace MaterialSystem {
    Serializer.registerNamespace(MaterialSystem);

    /**
     * A material is a collection of {@link ShaderFeature}s and {@link MaterialProperty}s. 
     * Shader features compose the {@link Shader} used by the material, while material properties provide the shader with the necessary data for rendering.
     * Attach the material to a {@link Node} via a {@link ComponentMaterial}.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019 | Jonas Plotzky, HFU, 2025
     */
    @enumerate
    export class Material extends Mutable implements SerializableResource {
      public name: string;
      public idResource: string = undefined;

      public timestampUpdate: number = 0;

      /**
       * Clipping threshold for alpha values, every pixel with alpha < alphaClip will be discarded.
       */
      public alphaClip: number = 0.01;

      #features: typeof ShaderFeature[];
      #properties: MaterialProperty[];

      #shader: Shader;

      public constructor(_name: string = Material.name, _features: typeof ShaderFeature[] = [], _properties?: MaterialProperty[]) {
        super();
        this.name = _name;
        this.#features = _features;
        this.#shader = Shader.get(_features);
        if (_features && !_properties)
          this.#properties = this.#shader.createProperties();
        else
          this.properties = _properties;
        Project.register(this);
      }

      public get isSerializableResource(): true {
        return true;
      }

      @enumerate
      public get properties(): MaterialProperty[] {
        return this.#properties;
      }

      public set properties(_properties: MaterialProperty[]) {
        if (!this.#shader.matchProperties(_properties))
          throw new Error("Shader features and material properties don't match");

        this.#properties = _properties;
      }

      public get features(): typeof ShaderFeature[] {
        return this.#features;
      }

      public set features(_features: typeof ShaderFeature[]) {
        this.#features = _features;
        this.#shader = Shader.get(_features);
        this.#properties = this.#shader.createProperties();
      }

      public get shader(): Shader {
        return this.#shader;
      }

      /**
       * Returns the {@link MaterialProperty} of the given class, if it exists in the material's properties.
       */
      public getProperty<T extends MaterialProperty>(_class: new () => T): T | null {
        for (let property of this.#properties) {
          if (property instanceof _class)
            return <T>property;
        }

        return null;
      }

      /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
      @RenderManagerMaterial.decorate
      public updateRenderData(..._args: unknown[]): void { return; };

      /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
      @RenderManagerMaterial.decorate
      public useRenderData(..._args: unknown[]): void { return; };

      public serialize(): Serialization {
        const serialization: SerializationOf<Material> = {
          name: this.name,
          idResource: this.idResource,
          // features: Serializer.serializeFunctions(this.#features), TODO: implement serialization 
          // properties: Serializer.serializeObjects(this.#properties),
          alphaClip: this.alphaClip
        };
        return serialization;
      }

      public async deserialize(_serialization: SerializationOf<Material>): Promise<Serializable> {
        Project.register(this, _serialization.idResource);
        this.name = _serialization.name;
        // this.#features = Serializer.deserializeFunctions(_serialization.features);
        // this.#properties = await Serializer.deserializeObjects(_serialization.properties);
        this.#shader = Shader.get(this.#features);
        this.alphaClip = _serialization.alphaClip;
        return this;
      }

      protected reduceMutator(_mutator: Mutator): void {
        delete _mutator.timestampUpdate;
      }
    }
  }
}