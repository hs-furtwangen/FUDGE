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

      let output: HTMLOutputElement = document.createElement("output");
      output.id = CustomElement.nextId;
      this.appendChild(output);
      this.setMutatorValue(this.getAttribute("value"));
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
    public setMutatorValue(_value: FudgeCore.General): void {
      let output: HTMLOutputElement = this.querySelector("output");
      output.value = _value ?? this.getAttribute("placeholder");
      if (_value)
        output.classList.remove("placeholder");
      else
        output.classList.add("placeholder");

      // this.querySelector("output").value = _value ?? this.getAttribute("placeholder");
    }
  }
}