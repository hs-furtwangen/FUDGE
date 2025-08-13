namespace FudgeUserInterface {

  export class CustomElementComboSelect extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-comboselect", CustomElementComboSelect);

    // this breaches the separation of concerns of view and controller, but it is very handy if the custom element reference can get its options by itself.
    #mutable: object;
    #getOptions: (this: object, _key: string) => Record<string, unknown>;

    public constructor(_attributes: CustomElementAttributes, _mutable: object, _get: (this: object, _key: string) => Record<string, unknown>) {
      super(_attributes);
      this.#mutable = _mutable;
      this.#getOptions = _get;
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
      input.spellcheck = false;
      input.onfocus = this.hndFocus;
      input.oninput = this.hndInput;
      input.onkeyup = this.hndKey;
      this.appendChild(input);

      let button: HTMLButtonElement = document.createElement("button");
      button.onclick = this.hndClick;
      button.hidden = true;
      this.appendChild(button);

      this.setMutatorValue(Reflect.get(this.#mutable, this.getAttribute("key")));
    }

    public getMutatorValue(): unknown {
      const input: HTMLInputElement = this.querySelector("input");
      const options: Record<string, unknown> = this.getOptions();
      return options[input.value];
    }

    public setMutatorValue(_value: { name?: string }): void {
      const input: HTMLInputElement = this.querySelector("input");
      if (input == document.activeElement)
        return;

      const value: string = _value ? _value.name ?? _value.toString() : "";

      const button: HTMLButtonElement = this.querySelector("button");
      button.hidden = !value;

      input.value = value;
    }

    private hndClick = (_event: MouseEvent): void => {
      const input: HTMLInputElement = this.querySelector("input");
      input.value = "";
      const button: HTMLButtonElement = this.querySelector("button");
      button.hidden = true;
      this.dispatchEvent(new Event(EVENT.CHANGE, { bubbles: true }));
    };

    private hndFocus = (_event: FocusEvent): void => {
      const datalist: HTMLDataListElement = this.querySelector("datalist");
      datalist.innerHTML = ""; // clear previous entries
      const options: Record<string, unknown> = this.getOptions();
      for (const key in options) {
        const entry: HTMLOptionElement = document.createElement("option");
        entry.value = key;
        datalist.appendChild(entry);
      }
    };

    private hndInput = (_event: Event): void => {
      const button: HTMLButtonElement = this.querySelector("button");
      button.hidden = !(_event.target as HTMLInputElement).value;
      _event.stopPropagation(); // prevent bubbling of input event to controller
    };

    private hndKey(_event: KeyboardEvent): void {
      _event.stopPropagation();
    };

    private getOptions(): Record<string, unknown> {
      return this.#getOptions.call(this.#mutable, this.getAttribute("key"));
    }
  }
}