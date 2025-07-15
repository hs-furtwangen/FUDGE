namespace FudgeCore {
  export namespace MaterialSystem {
    /**
     * A shader is a collection of {@link ShaderFeature}s that define how a material is rendered.
     */
    export class Shader {
      public static readonly shaders: Map<string, Shader> = new Map();

      public program: unknown;
      public uniforms: { [name: string]: unknown };

      #source: typeof ShaderSourceFeature;
      #features: typeof ShaderFeature[];
      #properties: (new () => MaterialProperty)[];

      private constructor(_features: readonly typeof ShaderFeature[]) {
        const featuresSorted: typeof ShaderFeature[] = _features.toSorted(sortByName);
        this.#features = featuresSorted;
        this.#source = <typeof ShaderSourceFeature>featuresSorted.find(_feature => _feature.prototype instanceof ShaderSourceFeature);
        this.#properties = featuresSorted.flatMap(_feature => _feature.properties);
      }

      public static get(_features: readonly typeof ShaderFeature[]): Shader {
        const key: string = _features
          .map(_feature => _feature.name)
          .sort()
          .join("")
          .replaceAll(ShaderFeature.name, "");
        const shaders: Map<string, Shader> = Shader.shaders;
        let shader: Shader = shaders.get(key);
        if (!shader)
          shaders.set(key, shader = new Shader(_features));
        
        return shader;
      }

      /**
       * Returns the {@link MaterialProperty} instances that are needed to supply the shader with the necessary data.
       */
      public createProperties(): MaterialProperty[] {
        return this.#properties.map(_property => new _property());
      }

      /**
       * Returns true if the given material properties match the shader's requirements, false otherwise.
       */
      public matchProperties(_properties: MaterialProperty[]): boolean {
        const types: (new () => MaterialProperty)[] = this.#properties;
        if (_properties.length !== types.length)
          return false;

        for (let type of types) {
          let found: boolean = false;
          for (let property of _properties) {
            if (property instanceof type) {
              found = true;
              break;
            }
          }
          if (!found)
            return false;
        }
        return true;
      }

      /** Returns the vertex shader source code for the render system */
      public getVertexShaderSource(): string {
        return this.insertDefines(this.#source.vertexShaderSource);
      }

      /** Returns the fragment shader source code for the render system */
      public getFragmentShaderSource(): string {
        return this.insertDefines(this.#source.fragmentShaderSource);
      }

      /** Compile the shader program from the vertex and fragment shader source code. */
      @RenderWebGLShader.decorate
      public createProgram(): void { return; }

      /** Use the shader program for rendering. */
      @RenderWebGLShader.decorate
      public useProgram(): void { return; }

      /** Delete the shader program clearing the used memory on the GPU. */
      @RenderWebGLShader.decorate
      public deleteProgram(): void { return; }

      protected insertDefines(_shader: string): string {
        let code: string = "#version 300 es\n";
        for (let feature of this.#features) {
          for (let define of feature.define)
            code += `#define ${define}\n`;
        }

        return _shader.replace("#version 300 es", code);
      }
    }

    function sortByName<T extends { name: string }>(_a: T, _b: T): number {
      return _a.name.localeCompare(_b.name);
    }
  }
}