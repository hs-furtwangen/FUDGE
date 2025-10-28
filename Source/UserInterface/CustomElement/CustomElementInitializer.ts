namespace FudgeUserInterface {
  /**
   * A standard checkbox with a label to it
   */
  export class CustomElementInitializer extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-initializer", CustomElementInitializer);

    public btnCreate: HTMLButtonElement;
    public btnSelect: HTMLButtonElement;

    public options: Record<string, unknown>;
    public input: HTMLInputElement;
    public datalist: HTMLDataListElement;

    public constructor(_attributes: CustomElementAttributes, _createOptions?: Record<string, unknown>, _selectOptions?: Record<string, unknown>) {
      super(_attributes);
      if (!_attributes.label)
        this.setAttribute("label", _attributes.key);
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
      this.input.spellcheck = false;
      this.input.addEventListener(EVENT.FOCUS, this.hndFocus);
      this.input.addEventListener(EVENT.BLUR, this.hndBlur);
      this.input.addEventListener(EVENT.CHANGE, this.hndChange);
      this.input.addEventListener(EVENT.INPUT, this.hndInput);

      this.btnCreate = document.createElement("button");
      this.btnCreate.innerText = "<undefined>";
      this.btnCreate.addEventListener(EVENT.CLICK, this.hndClickCreate);
      this.btnCreate.title = `Create a new ${this.getAttribute("type")}`;
      this.btnCreate.classList.add("btn-subtle");
      this.appendChild(this.btnCreate);

      this.btnSelect = document.createElement("button");
      this.btnSelect.innerText = "📂︎"; // 🔍︎ ↪ ⤷ ⋮ ☍ ↗ ⟲ ⇄ 🔗︎ 📂︎ ⚠︎ ➕︎ ❌︎ // append the U+FE0E Variation Selector-15 for monochrome emoji
      this.btnSelect.title = `Select an existing ${this.getAttribute("type")}`;
      this.btnSelect.addEventListener(EVENT.CLICK, this.hndClickSelect);
      this.btnSelect.classList.add("btn-subtle");
      this.appendChild(this.btnSelect);
    }

    /**
     * Retrieves the status of the checkbox as boolean value
     */
    public getMutatorValue(): boolean {
      return null;
    }

    /**
     * Sets the status of the checkbox
     */
    public setMutatorValue(_value: null): void {
      //
    }

    private hndClickCreate = (_event: MouseEvent): void => {
      this.dispatchEvent(new CustomEvent(EVENT.REFRESH_OPTIONS, { bubbles: true, detail: { action: "create" } }));

      if (!this.options) {
        this.dispatchEvent(new Event(EVENT.INITIALIZE_VALUE, { bubbles: true }));
        return;
      }

      this.input.placeholder = `New ${this.getAttribute("type")}...`;
      this.btnCreate.replaceWith(this.input);
      this.input.focus();
    };

    private hndClickSelect = async (_event: MouseEvent): Promise<void> => {
      this.dispatchEvent(new CustomEvent(EVENT.REFRESH_OPTIONS, { bubbles: true, detail: { action: "assign" } }));
      if (!this.options)
        return;

      this.input.placeholder = `Select ${this.getAttribute("type")}...`;
      this.btnSelect.replaceWith(this.input);
      this.input.focus();
    };

    private hndFocus = (_event: FocusEvent): void => {
      this.datalist.innerHTML = ""; // clear previous entries
      for (const key in this.options) {
        const entry: HTMLOptionElement = document.createElement("option");
        entry.value = key;
        this.datalist.appendChild(entry);
      }
    };

    private hndBlur = (_event: Event): void => {
      if (!this.btnCreate.isConnected)
        this.input.replaceWith(this.btnCreate);
      else if (!this.btnSelect.isConnected)
        this.input.replaceWith(this.btnSelect);
    };

    private hndInput = (_event: Event): void => {
      _event.stopPropagation();
    };

    private hndChange = async (_event: Event): Promise<void> => {
      if (this.input.value != "" && !Reflect.has(this.options, this.input.value)) {
        this.input.value = "";
        return;
      }

      if (!this.btnCreate.isConnected) {
        const constructor: new () => unknown = <new () => unknown>this.options[this.input.value];
        this.dispatchEvent(new CustomEvent(EVENT.INITIALIZE_VALUE, { bubbles: true, detail: { type: constructor } }));
      } else if (!this.btnSelect.isConnected) {
        const value: unknown = this.options[this.input.value];
        this.dispatchEvent(new CustomEvent(EVENT.SET_VALUE, { bubbles: true, detail: { value: value } }));
      }
    };

  }
}