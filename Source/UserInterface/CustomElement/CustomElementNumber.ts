namespace FudgeUserInterface {

  /**
   * An interactive number stepper with exponential display and complex handling using keyboard and mouse
   */
  export class CustomElementNumber extends CustomElement {
    // @ts-ignore
    private static customElement: void = CustomElement.register("fudge-number", CustomElementNumber);
    public value: number = 0;

    private input: HTMLInputElement;

    private dragging: boolean;
    private startValue: number = 0;
    private startDecimals: number = 0;
    private delta: number = 0;
    private pixels: number = 0;
    private speed: number = 0.01;

    public constructor(_attributes?: CustomElementAttributes) {
      super(_attributes);
      if (_attributes && _attributes["value"])
        this.value = parseFloat(_attributes["value"]);
    }

    public get min(): number {
      return this.input.min == "" ? undefined : parseFloat(this.input.min);
    }

    public get max(): number {
      return this.input.max == "" ? undefined : parseFloat(this.input.max);
    }

    public get step(): number {
      return this.input.step == "" ? undefined : parseFloat(this.input.step);
    }

    /**
     * Creates the content of the element when connected the first time
     */
    public connectedCallback(): void {
      if (this.initialized)
        return;
      this.initialized = true;

      this.appendLabel();

      this.input = document.createElement("input");
      this.input.type = "text"; // use text to enforce decimal point notation
      this.input.min = this.getAttribute("min") ?? "";
      this.input.max = this.getAttribute("max") ?? "";
      this.input.step = this.getAttribute("step") ?? "";
      this.input.inputMode = "decimal";

      this.input.onchange = this.hndChange;
      this.input.oninput = this.hndInput;
      this.input.onkeydown = this.hndKey;
      this.input.onkeyup = this.hndKey;
      this.input.onfocus = this.hndFocus;
      this.input.onpointerdown = this.hndPointerdownInput;
      this.input.onpointerup = this.hndPointerupInput;

      this.appendChild(this.input);

      this.setMutatorValue(this.value);
    }

    public disconnectedCallback(): void {
      this.hndPointerupWindow();
    }

    public getMutatorValue(): number {
      return this.value;
    }

    public setMutatorValue(_value: number): void {
      if (_value == undefined || isNaN(_value)) {
        this.input.value = this.value.toString();
        return;
      }

      const min: number = this.min;
      if (min != null)
        _value = Math.max(_value, min);

      const max: number = this.max;
      if (max != null)
        _value = Math.min(_value, max);

      const step: number = this.step;
      if (step != null) {
        const decimals: number = this.decimals(step);
        _value = FudgeCore.Calc.snap(_value, step);
        _value = parseFloat(_value.toFixed(decimals));
        this.input.value = _value.toFixed(decimals);
      } else if (this.dragging) {
        this.input.value = _value.toFixed(Math.max(this.startDecimals, this.decimals(this.speed)));
      } else {
        this.input.value = _value.toString();
      }

      this.value = _value;
    }

    private hndPointerdownInput = (_event: PointerEvent): void => {
      if (document.activeElement == this.input)
        return;

      window.addEventListener("pointermove", this.hndPointermoveWindow);
      window.addEventListener("pointerup", this.hndPointerupWindow);

      _event.preventDefault();
    };

    private hndPointermoveWindow = (_event: MouseEvent): void => {
      this.speed = this.step ?? 0.01;
      if (_event.ctrlKey)
        this.speed *= 0.1;
      else if (_event.shiftKey)
        this.speed *= 10;

      this.pixels += _event.movementX;

      const move: number = Math.trunc(this.pixels / 2);

      if (move != 0) {
        if (!this.dragging) {
          this.dragging = true;
          this.delta = 0;
          this.startValue = this.value;
          this.startDecimals = this.decimals(this.input.value);

          this.input.requestPointerLock();
          this.input.classList.add("hide-carret");
          this.input.focus();
          return;
        }

        this.pixels -= move * 2;
        this.delta += move * this.speed;

        let value: number = this.startValue + this.delta;
        this.setMutatorValue(value);
      }

      _event.preventDefault();
    };

    private hndPointerupWindow = (): void => {
      if (this.dragging) {
        this.dragging = false;
        this.input.blur();
        this.input.classList.remove("hide-carret");

        if (this.startValue != this.value)
          this.input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (document.pointerLockElement == this.input)
        document.exitPointerLock();

      window.removeEventListener("pointermove", this.hndPointermoveWindow);
      window.removeEventListener("pointerup", this.hndPointerupWindow);
    };

    private hndPointerupInput = (): void => {
      if (!this.dragging)
        this.input.focus();
    };

    private hndFocus = (): void => {
      if (!this.dragging)
        this.input.select();
    };

    private hndChange = (_event: Event): void => {
      this.setMutatorValue(parseFloat(this.input.value));
    };

    private hndInput = (_event: Event): void => {
      _event.stopPropagation(); // prevent bubbling of input event to controller;
    };

    private hndKey = (_event: KeyboardEvent): void => {
      _event.stopPropagation();
    };

    private decimals(_number: number | string): number {
      const parts: string[] = _number.toString().toLowerCase().split('e');
      const mantissa: string = parts[0];
      const exp: number = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      const frac: string = mantissa.split('.')[1] || '';
      const decimals: number = Math.max(0, frac.length - exp);
      return decimals;
    };
  }
}
