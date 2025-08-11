namespace FudgeUserInterface {
  /**
   * TODO:
   */
  export class CustomElementReference extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-reference", CustomElementReference);

    // set by controller on request via EVENT.REQUEST_OPTIONS
    #options: Record<string, unknown> = {};

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
      this.appendChild(input);

      let button: HTMLButtonElement = document.createElement("button");
      button.onclick = this.hndClick;
      button.hidden = true;
      this.appendChild(button);
    }

    // Set by controller
    public setOptions(_options: Record<string, unknown>): void {
      this.#options = _options;
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
      input.dispatchEvent(new Event(EVENT.INPUT, { bubbles: true }));
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
    };

    // Requests options from controller
    private getOptions(): Record<string, unknown> {
      this.dispatchEvent(new Event(EVENT.REQUEST_OPTIONS, { bubbles: true }));
      return this.#options;
    }
  }
}