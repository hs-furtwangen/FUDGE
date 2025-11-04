namespace FudgeUserInterface {
  /**
   * A standard text input field with a label to it.
   */
  export class CustomElementOutput extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-output", CustomElementOutput);

    public constructor(_attributes: CustomElementAttributes) {
      super(_attributes);
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

      let output: HTMLOutputElement = document.createElement("output");
      output.id = CustomElement.nextId;
      content.appendChild(output);
    }

    /**
     * Retrieves the content of the input element
     */
    public getMutatorValue(): string {
      return null;
    }

    /**
     * Sets the content of the input element
     */
    public setMutatorValue(_value: Object): void {
      let output: HTMLOutputElement = this.content.querySelector("output");
      if ("name" in _value && typeof _value.name == "string")
        output.value = _value.name;
      else
        output.value = _value.toString();
    }
  }
}