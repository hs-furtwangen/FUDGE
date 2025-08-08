namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * TODO:
   */
  export class CustomElementReference extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-reference", CustomElementReference);

    #mutable: ƒ.Mutable | ƒ.MutableArray<unknown>;
    #getOptions: (this: unknown, _key: keyof unknown) => Record<string, unknown>;

    public constructor(_attributes: CustomElementAttributes, _mutable: ƒ.Mutable | ƒ.MutableArray<unknown>, _getOptions: (this: unknown, _key: keyof unknown) => Record<string, unknown>) {
      super(_attributes);
      this.#mutable = _mutable;
      this.#getOptions = _getOptions;
    }

    /**
     * Creates the content of the element when connected the first time
     */
    public connectedCallback(): void {
      if (this.initialized)
        return;
      this.initialized = true;

      this.appendLabel();

      let datalist: HTMLDataListElement = document.createElement("datalist");
      datalist.id = CustomElement.nextId.toString();
      this.appendChild(datalist);

      let input: HTMLInputElement = document.createElement("input");
      input.setAttribute("list", datalist.id);
      input.placeholder = `${this.getAttribute("type")}...`;
      input.onfocus = this.hndFocus;
      input.spellcheck = false; 
      this.appendChild(input);

      let button: HTMLButtonElement = document.createElement("button");
      button.textContent = "X";
      button.onclick = this.hndClick;
      this.appendChild(button);

      this.setMutatorValue(Reflect.get(this.#mutable, this.getAttribute("key")));
    }

    public hndFocus = (_event: FocusEvent): void => {
      const datalist: HTMLDataListElement = this.querySelector("datalist");
      datalist.innerHTML = ""; // clear previous entries
      const options: Record<string, unknown> = this.getOptions();
      for (const key in options) {
        const entry: HTMLOptionElement = document.createElement("option");
        entry.value = key;
        datalist.appendChild(entry);
      }
    };

    public hndClick = (_event: MouseEvent): void => {
      let input: HTMLInputElement = this.querySelector("input");
      input.value = null;
      input.dispatchEvent(new Event(EVENT.INPUT, { bubbles: true }));
    };

    public getMutatorValue(): unknown {
      const input: HTMLInputElement = this.querySelector("input");
      const options: Record<string, unknown> = this.getOptions();
      return options[input.value];
    }

    public setMutatorValue(_value: ƒ.General): void {
      if (_value == null)
        return;

      this.querySelector("input").value = _value.name ?? _value.toString();
    }

    private getOptions(): Record<string, unknown> {
      const options: Record<string, unknown> = this.#getOptions?.call(this.#mutable, this.getAttribute("key"));
      if (!options)
        throw new Error(`${this.#mutable.constructor.name}: No selection options provided for property "${this.getAttribute("label")}".`);

      return options;
    }
  }
}