namespace FudgeUserInterface {
  /**
   * A standard checkbox with a label to it
   */
  export class CustomElementBoolean extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-boolean", CustomElementBoolean, Boolean);

    public constructor(_attributes: CustomElementAttributes) {
      super(_attributes);
      if (!_attributes.label)
        this.setAttribute("label", _attributes.key);
      this.tabIndex = 0;
    }

    /**
     * Creates the content of the element when connected the first time
     */
    public connectedCallback(): void {
      if (this.initialized)
        return;
      this.initialized = true;

      // TODO: delete tabindex from checkbox and get space-key on this
      // this.tabIndex = 0;
      let label: HTMLLabelElement = this.appendLabel();
      let content: HTMLSpanElement = this.appendContent();

      let input: HTMLInputElement = document.createElement("input");
      input.type = "checkbox";
      input.id = CustomElement.nextId;
      input.checked = this.getAttribute("value") == "true";
      content.appendChild(input);

      let text: HTMLSpanElement = document.createElement("span");
      text.textContent = "On";
      content.appendChild(text);

      label.htmlFor = input.id;
    }

    /**
     * Retrieves the status of the checkbox as boolean value
     */
    public getMutatorValue(): boolean {
      return this.content.querySelector("input").checked;
    }
    /**
     * Sets the status of the checkbox
     */
    public setMutatorValue(_value: boolean): void {
      this.content.querySelector("input").checked = _value;
    }
  }
}