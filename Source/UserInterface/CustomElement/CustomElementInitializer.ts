namespace FudgeUserInterface {
  /**
   * A standard checkbox with a label to it
   */
  export class CustomElementInitializer extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-initializer", CustomElementInitializer);

    public button: HTMLButtonElement;
    // public output: HTMLOutputElement;

    public constructor(_attributes: CustomElementAttributes) {
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

      // this.output = document.createElement("output");
      // this.output.value = "<undefined>";
      // this.appendChild(this.output);

      this.button = document.createElement("button");
      this.button.innerText = "<undefined>";
      this.button.addEventListener(EVENT.CLICK, this.hndClick);
      this.appendChild(this.button);
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

    private hndClick = (_event: MouseEvent): void => {
      this.dispatchEvent(new Event(EVENT.INITIALIZE_VALUE, { bubbles: true }));
    };
  }
}