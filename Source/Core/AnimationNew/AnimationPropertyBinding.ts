namespace FudgeCore {
  export namespace AnimationSystem {
    /**
     * Binds a specific property within a node hierarchy (via a path) and allows direct access to it.
     */
    export class AnimationPropertyBinding {
      static #regex: RegExp = /^((?:[^/]*?\/)*)?components\/([^/]+)\/(\d+)(?:\/)(.*)$/;

      public root: Node;

      public path: string;
      public pathParsed: { nodePath: string[]; componentType: string; componentIndex: string; targetPath: string[] };

      public node: Node;
      public component: Component;
      public target: Mutable;
      public key: string;
      public property: unknown | ArrayConvertible;

      /** The animated value to be applied to the property */
      public output: Float32Array;

      public constructor(_root: Node, _path: string, _output: Float32Array) {
        this.root = _root;
        this.path = _path;
        this.output = _output;
        this.pathParsed = AnimationPropertyBinding.parsePath(_path);
      }

      /**
       * @example "childName/childName/childName/components/ComponentTransform/0/mtxLocal/translation"
       * @example "components/ComponentTransform/0"
       */
      public static parsePath(_path: string): AnimationPropertyBinding["pathParsed"] {
        const match: RegExpMatchArray = AnimationPropertyBinding.#regex.exec(_path);
        if (!match)
          throw new Error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.parsePath.name}: Invalid path: ${_path}`);

        const nodePath: string[] = match[1]?.slice(0, -1).split("/");
        const componentType: string = match[2];
        const componentIndex: string = match[3];
        const targetPath: string[] = match[4].split("/");

        return { nodePath, componentType, componentIndex, targetPath };
      }

      public static findNode(_rootNode: Node, _parsedPath: string[]): Node {
        let node: Node = _rootNode;

        if (_parsedPath)
          for (let i: number = 0; i < _parsedPath.length; i++) {
            node = node.getChildByName(_parsedPath[i]);
          }

        return node;
      }

      public static findTarget(_component: Component, _parsedPath: string[]): Mutable {
        let target: Mutable = _component;

        if (_parsedPath)
          for (let i: number = 0; i < _parsedPath.length - 1; i++)
            target = Reflect.get(target, _parsedPath[i]);

        return target;
      }

      public bind(): void {
        this.get = this.#getUnbound;
        this.set = this.#setUnbound;

        this.node = AnimationPropertyBinding.findNode(this.root, this.pathParsed.nodePath);
        if (!this.node)
          Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Node not found: ${this.pathParsed.nodePath}`)

        this.component = Reflect.get(this.node, "components")[this.pathParsed.componentType]?.[this.pathParsed.componentIndex];
        if (!this.component)
          Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Component not found: ${this.pathParsed.componentType} at index ${this.pathParsed.componentIndex}`);

        this.target = AnimationPropertyBinding.findTarget(this.component, this.pathParsed.targetPath);
        if (!this.target)
          Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Target not found: ${this.pathParsed.targetPath}`);

        this.key = this.pathParsed.targetPath[this.pathParsed.targetPath.length - 1];
        if (!(this.key in this.target))
          Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Key not found: ${this.key}`);

        this.property = Reflect.get(this.target, this.key);
        if (this.property == undefined)
          Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Property is undefined: ${this.key}`);

        if (typeof this.property == "string" || typeof this.property == "number" || typeof this.property == "boolean") {
          this.get = this.#getDirect;
          this.set = this.#setDirect;
        } else if (((<ArrayConvertible>this.property).isArrayConvertible)) {
          this.get = this.#getToArray;
          this.set = this.#setFromArray;
        }
      }

      public unbind(): void {
        this.root = null;
        this.path = null;
        this.pathParsed = null;
        this.node = null;
        this.component = null;
        this.target = null;
        this.key = null;
        this.property = null;
        this.output = null;
      }

      public apply(): void {
        this.set(this.output, 0);
      }

      public set(_source: Float32Array, _offset: number): void { /** */ }

      public get(_target: Float32Array, _offset: number): void { /** */ }

      #getUnbound(_target: Float32Array, _offset: number): void { /** */ }

      #setUnbound(_source: Float32Array, _offset: number): void { /** */ }

      #getDirect(_target: Float32Array, _offset: number): void {
        _target[_offset] = Reflect.get(this.target, this.key);
      }

      #setDirect(_source: Float32Array, _offset: number): void {
        Reflect.set(this.target, this.key, _source[_offset]);
      }

      #getToArray(_target: Float32Array, _offset: number): void {
        (<ArrayConvertible>this.property).toArray(_target, _offset);
      }

      #setFromArray(_source: Float32Array, _offset: number): void {
        (<ArrayConvertible>this.property).fromArray(_source, _offset);
      }

    }
  }
}