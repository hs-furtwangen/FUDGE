namespace FudgeUserInterface {
  /**
   * A dropdown menu to display enums
   */
  export class CustomElementSelect extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-select", CustomElementSelect, Object);
    public options: Object;

    public constructor(_attributes: CustomElementAttributes, _options: Object = {}) {
      super(_attributes);
      if (!_attributes.label)
        this.setAttribute("label", _attributes.key);
      this.options = _options;
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

      let select: HTMLSelectElement = document.createElement("select");
      for (let key in this.options) {
        let value: string | number = Reflect.get(this.options, key);
        if (Reflect.has(this.options, value) && Reflect.get(this.options, value) !== key) // filter number keys out of simple enum 
          continue;
        let entry: HTMLOptionElement = document.createElement("option");
        entry.text = key;
        entry.setAttribute("type", typeof value);
        entry.value = value.toString();
        // console.log(this.getAttribute("value"));
        if (entry.value == this.getAttribute("value")) {
          entry.selected = true;
        }
        select.add(entry);
      }
      select.tabIndex = 0;
      content.appendChild(select);
    }

    /**
     * Retrieves the status of the checkbox as boolean value
     */
    public getMutatorValue(): string | number {
      let select: HTMLSelectElement = this.content.querySelector("select");
      let type: string = select.options[select.selectedIndex]?.getAttribute("type") || "string";
      return type == "number" ? parseFloat(select.value) : select.value;
    }
    /**
     * Sets the status of the checkbox
     */
    public setMutatorValue(_value: string): void {
      this.content.querySelector("select").value = _value;
      // this.value = _value;
    }
  }
}