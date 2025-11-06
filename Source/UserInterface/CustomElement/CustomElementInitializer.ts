namespace FudgeUserInterface {
  /**
   * A standard checkbox with a label to it
   */
  export class CustomElementInitializer extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-initializer", CustomElementInitializer);

    #descriptor: FudgeCore.MetaPropertyDescriptor;

    public constructor(_attributes: CustomElementAttributes, _descriptor: FudgeCore.MetaPropertyDescriptor) {
      super(_attributes);
      if (!_attributes.label)
        this.setAttribute("label", _attributes.key);
      this.#descriptor = _descriptor;
      this.tabIndex = 0;
    }

    /**
     * Creates the content of the element when connected the first time
     */
    public connectedCallback(): void {
      if (this.initialized)
        return;

      this.initialized = true;

      this.appendLabel();

      let content: HTMLSpanElement = this.appendContent();

      const createOptions: boolean = !!this.#descriptor.getCreateOptions;
      const assignOptions: boolean = !!this.#descriptor.getAssignOptions;
      const creatable: boolean = this.#descriptor.kind != "function";

      if (createOptions || assignOptions) {
        let menu: Menu = Generator.createInterfaceElementMenu(this.getAttribute("type"), createOptions, assignOptions, false, false, false);
        content.appendChild(menu);
      } else if (creatable) {
        const btnCreate: HTMLButtonElement = document.createElement("button");
        btnCreate.classList.add("btn-subtle", "icon", "actions", "before");
        btnCreate.title = `Create a new ${this.getAttribute("type")}`;

        btnCreate.addEventListener(EVENT.CLICK, _event => {
          btnCreate.dispatchEvent(new Event(EVENT.CREATE, { bubbles: true }));
        });

        content.appendChild(btnCreate);
      }
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
  }
}