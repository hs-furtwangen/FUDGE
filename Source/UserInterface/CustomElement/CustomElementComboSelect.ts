namespace FudgeUserInterface {

  export class CustomElementComboSelect extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-comboselect", CustomElementComboSelect);

    public options: Record<string, unknown>;
    public input: HTMLInputElement;
    public datalist: HTMLDataListElement;
    public button: HTMLButtonElement;
    public value: unknown;

    public constructor(_attributes: CustomElementAttributes & { action: "create" | "assign" }, _value?: unknown, _options?: Record<string, unknown>) {
      super(_attributes);
      this.options = _options;
      this.value = _value;
    }

    /**
     * Creates the content of the element when connected the first time
     */
    public connectedCallback(): void {
      if (this.initialized)
        return;
      this.initialized = true;

      this.appendLabel();

      this.datalist = document.createElement("datalist");
      this.datalist.id = CustomElement.nextId.toString();
      this.appendChild(this.datalist);

      this.input = document.createElement("input");
      this.input.setAttribute("list", this.datalist.id);
      this.input.placeholder = this.getAttribute("placeholder") ?? `${this.getAttribute("type")}...`;
      this.input.spellcheck = false;
      this.input.addEventListener(EVENT.FOCUS, this.hndFocus);
      this.input.addEventListener(EVENT.INPUT, this.hndInput);
      this.input.addEventListener(EVENT.KEY_UP, this.hndKey);
      this.input.addEventListener(EVENT.CHANGE, this.hndChange);
      this.appendChild(this.input);

      this.button = document.createElement("button");
      this.button.addEventListener(EVENT.CLICK, this.hndClick);
      this.button.style.visibility = "hidden";

      this.button.classList.add("btn-subtle", "icon", "clear", "before");
      this.appendChild(this.button);

      if (this.value)
        this.setValue(this.value);
    }

    public getMutatorValue(): unknown {
      const options: Record<string, unknown> = this.getOptions();
      return options[this.input.value];
    }

    public setMutatorValue(_value: { name?: string }): void {
      if (this.input == document.activeElement)
        return;

      this.setValue(_value);
    }

    public setValue(_value: { name?: string } | string): void {
      let value: string;
      if (typeof _value == "string")
        value = _value;
      else if (!_value)
        value = "";
      else
        value = _value.name ?? _value.toString();

      this.button.style.visibility = value ? "visible" : "hidden";
      this.input.value = value;
    }

    private hndClick = (_event: MouseEvent): void => {
      this.input.value = "";
      this.button.style.visibility = "hidden";
      this.input.dispatchEvent(new Event(EVENT.CHANGE, { bubbles: true }));
    };

    private hndFocus = (_event: FocusEvent): void => {
      this.datalist.innerHTML = ""; // clear previous entries
      const options: Record<string, unknown> = this.getOptions();
      for (const key in options) {
        const entry: HTMLOptionElement = document.createElement("option");
        entry.value = key;
        this.datalist.appendChild(entry);
      }
    };

    private hndInput = (_event: Event): void => {
      this.button.style.visibility = (_event.target as HTMLInputElement).value ? "visible" : "hidden";
      _event.stopPropagation();
    };

    private hndKey(_event: KeyboardEvent): void {
      _event.stopPropagation();
    };

    private hndChange = async (_event: Event): Promise<void> => {
      const options: Record<string, unknown> = this.getOptions();

      if (this.input.value != "" && (!options || !Reflect.has(options, this.input.value))) {
        this.setValue(this.value);
        return;
      }

      this.value = options[this.input.value];
      switch (this.getAttribute("action")) {
        case "create":
          this.dispatchEvent(new CustomEvent(EVENT.CREATE_VALUE, { bubbles: true, detail: { type: this.value } }));
          break;
        case "assign":
          this.dispatchEvent(new CustomEvent(EVENT.SET_VALUE, { bubbles: true, detail: { value: this.value } }));
          break;
      }
    };

    private getOptions(): Record<string, unknown> {
      this.dispatchEvent(new CustomEvent(EVENT.REFRESH_OPTIONS, { bubbles: true, detail: { action: this.getAttribute("action") } }));
      return this.options;
    }
  }
}