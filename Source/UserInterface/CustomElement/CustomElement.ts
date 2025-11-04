namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Structure for the attributes to set in a CustomElement.
   * key (maybe rename to `name`) is mandatory and must match the key of a mutator if used in conjunction
   * label is recommended for labelled elements, key is used if not given.
   */
  export interface CustomElementAttributes {
    [name: string]: string;
    key: string;
    label?: string;
  }

  /**
   * Handles the mapping of CustomElements to their HTML-Tags via customElement.define
   * and to the data types and [[FudgeCore.Mutable]]s they render an interface for. 
   */
  export abstract class CustomElement extends HTMLElement {
    public static tag: string;
    private static mapTypeToCustomElement: Map<Function, typeof CustomElement> = new Map();

    private static idCounter: number = 0;

    public content: HTMLSpanElement;

    #initialized: boolean = false;

    public constructor(_attributes?: CustomElementAttributes, ..._args: unknown[]) {
      super();
      if (_attributes)
        for (let name in _attributes) {
          if (_attributes[name] != undefined)
            this.setAttribute(name, _attributes[name]);
        }
      this.classList.add("fudge-element");
    }

    /**
     * Retrieve an id to use for children of this element, needed e.g. for standard interaction with the label
     */
    protected static get nextId(): string {
      return "ƒ" + CustomElement.idCounter++;
    }



    /**
     * Register map the given element type to the given tag and the given type of data
     */
    public static register(_tag: string, _typeCustomElement: typeof CustomElement, _typeObject?: typeof Object): void {
      // console.log(_tag, _class);
      _typeCustomElement.tag = _tag;
      // @ts-ignore
      customElements.define(_tag, _typeCustomElement);

      if (_typeObject)
        CustomElement.map(_typeObject, _typeCustomElement);
    }

    /**
     * Retrieve the element representing the given data type (if registered)
     */
    public static get(_type: Function): typeof CustomElement & (new (..._args: ConstructorParameters<typeof CustomElement>) => CustomElement) {
      let element: string | typeof CustomElement | CustomElementConstructor = CustomElement.mapTypeToCustomElement.get(_type);
      return <typeof CustomElement & (new (..._args: ConstructorParameters<typeof CustomElement>) => CustomElement)>element;
    }

    private static map(_type: Function, _typeCustomElement: typeof CustomElement): void {
      ƒ.Debug.fudge("Map", _type, _typeCustomElement.name);
      CustomElement.mapTypeToCustomElement.set(_type, _typeCustomElement);
    }

    /**
     * Return the key (name) of the attribute this element represents
     */
    public get key(): string {
      return this.getAttribute("key");
    }

    public get initialized(): boolean {
      return this.#initialized;
    }

    protected set initialized(_value: boolean) {
      this.#initialized = _value;
    }

    /**
     * Add a label-element as child to this element
     */
    public appendLabel(): HTMLLabelElement {
      let text: string = this.getAttribute("label");
      if (!text)
        return null;

      let label: HTMLLabelElement = document.createElement("label");
      label.textContent = text;
      label.classList.add("label");
      this.appendChild(label);

      return label;
    }

    public setLabel(_label: string): void {
      let label: HTMLLabelElement = this.querySelector("label");
      if (label)
        label.textContent = _label;
    }

    /**
     * Add a label-element as child to this element
     */
    public appendContent(): HTMLSpanElement {
      this.content = document.createElement("span");
      this.content.classList.add("content");
      this.appendChild(this.content);

      return this.content;
    }

    /**
     * Set the value of this element using a format compatible with [[FudgeCore.Mutator]]
     */
    public setMutatorValue(_value: Object): void {
      Reflect.set(this, "value", _value);
    }

    /** Workaround reconnection of clone */
    public cloneNode(_deep: boolean): Node {
      let label: string = this.getAttribute("label");
      //@ts-ignore
      let clone: CustomElement = new this.constructor(label ? { label: label } : null);
      document.body.appendChild(clone);
      clone.setMutatorValue(this.getMutatorValue());
      for (let attribute of this.attributes)
        clone.setAttribute(attribute.name, attribute.value);
      return clone;
    }

    /**
     * Get the value of this element in a format compatible with [[FudgeCore.Mutator]]
     */
    public abstract getMutatorValue(): Object;
  }
}