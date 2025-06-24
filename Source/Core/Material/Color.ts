namespace FudgeCore {
  /**
   * Defines a color as values in the range of 0 to 1 for the four channels red, green, blue and alpha (for opacity)
   */
  export class Color extends Mutable implements Serializable, Recycable, ArrayConvertible {
    // crc2 only used for converting colors from strings predefined by CSS
    public static crc2: CanvasRenderingContext2D = (() => {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const crc2: CanvasRenderingContext2D = canvas.getContext("2d", { willReadFrequently: true });
      crc2.globalCompositeOperation = "copy";
      return crc2;
    })();

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public constructor(_r: number = 1, _g: number = 1, _b: number = 1, _a: number = 1) {
      super();
      this.set(_r, _g, _b, _a);
    }

    //#region Static
    /**
     * Converts the given HSL values to RGB and returns the result in the given object.
     * @param _hue Hue as an angle in degrees in range [0, 360].
     * @param _saturation Saturation in range [0, 1]
     * @param _lightness Lightness in range [0, 1]
     * @param _out Optional color to store the result in.
     * @returns The RGB values in range [0, 1].
     * @source https://www.w3.org/TR/css-color-4/#hsl-to-rgb
     */
    public static hsl2rgb<T extends { r: number; g: number; b: number } = { r: number; g: number; b: number }>(_hue: number, _saturation: number, _lightness: number, _out: T): T {
      _hue = _hue % 360;

      if (_hue < 0)
        _hue += 360;

      _out.r = Color.#f(0, _hue, _saturation, _lightness);
      _out.g = Color.#f(8, _hue, _saturation, _lightness);
      _out.b = Color.#f(4, _hue, _saturation, _lightness);

      return _out;
    }

    /**
     * @param _red Red value  [0, 1]
     * @param _green Green component [0, 1]
     * @param _blue Blue component [0, 1]
     * @param _out Optional color to store the result in.
     * @returns The HSL values. Hue as an angle in degrees in range [0, 360]. Saturation and lightness in range [0, 1].
     * @source https://www.w3.org/TR/css-color-4/#rgb-to-hsl
     */
    public static rgb2hsl<T extends { h: number; s: number; l: number } = { h: number; s: number; l: number }>(_red: number, _green: number, _blue: number, _out: T): T {
      let max: number = Math.max(_red, _green, _blue);
      let min: number = Math.min(_red, _green, _blue);
      let hue: number = NaN;
      let saturation: number = 0;
      let lightness: number = (min + max) / 2;

      let d: number = max - min;

      if (d !== 0) {
        saturation = (lightness === 0 || lightness === 1)
          ? 0
          : (max - lightness) / Math.min(lightness, 1 - lightness);

        switch (max) {
          case _red: hue = (_green - _blue) / d + (_green < _blue ? 6 : 0); break;
          case _green: hue = (_blue - _red) / d + 2; break;
          case _blue: hue = (_red - _green) / d + 4;
        }

        hue = hue * 60;
      }

      if (saturation < 0) {
        hue += 180;
        saturation = Math.abs(saturation);
      }

      if (hue >= 360)
        hue -= 360;

      _out.h = hue;
      _out.s = saturation;
      _out.l = lightness;

      return _out;
    }

    /**
     * Returns a new {@link Color} object created from the given css color keyword. 
     * Passing an _alpha value will override the alpha value specified in the keyword.
     * Supported color formats are:
     * - named colors (e.g. "red", "blue", "green")
     * - hex colors (e.g. "#f00" "#ff0000", "#ff0000ff")
     * - srgb colors (e.g. "rgb(255 0 0 / 1)", "rgb(255, 0, 0)", "rgba(0, 0, 255, 1))
     * - hsl colors (e.g. "hsl(90deg 100% 50% / 1)", "hsl(90, 100%, 50%)", hsla(90, 100%, 50%, 1))
     * 
     * **Note:** If possibile try to avoid invoking this method frequently, as it might cause major garbage collection depending on the keyword and browser.
     * @param _out Optional color to store the result in.
     */
    public static CSS(_keyword: string, _alpha?: number, _out: Color = Recycler.reuse(Color)): Color {
      Color.crc2.fillStyle = _keyword; // THIS still causes major garbage collection depending on the keyword (tested in Chrome)
      const value: string = <string>Color.crc2.fillStyle;

      if (value.startsWith("#")) { // value = "#rrggbb"
        return _out.set(
          parseInt(value.slice(1, 3), 16) / 255,
          parseInt(value.slice(3, 5), 16) / 255,
          parseInt(value.slice(5, 7), 16) / 255,
          _alpha ?? 1
        );
      }

      if (value.startsWith("rgba")) { // value = "rgba(r, g, b, a)""
        const iOpenParenthesis: number = value.indexOf("(");
        const iComma0: number = value.indexOf(",", iOpenParenthesis);
        const iComma1: number = value.indexOf(",", iComma0 + 1);
        const iComma2: number = value.indexOf(",", iComma1 + 1);
        const iCloseParenthesis: number = value.indexOf(")", iOpenParenthesis);

        return _out.set(
          parseFloat(value.slice(iOpenParenthesis + 1, iComma0)) / 255,
          parseFloat(value.slice(iComma0 + 2, iComma1)) / 255,
          parseFloat(value.slice(iComma1 + 2, iComma2)) / 255,
          _alpha ?? parseFloat(value.slice(iComma2 + 2, iCloseParenthesis))
        );
      }

      if (value.startsWith("color(srgb")) { // value = "color(srgb r g b / a)"
        const iOpenParenthesis: number = value.indexOf("(");
        const iSpace0: number = value.indexOf(" ", iOpenParenthesis);
        const iSpace1: number = value.indexOf(" ", iSpace0 + 1);
        const iSpace2: number = value.indexOf(" ", iSpace1 + 1);
        const iSpace3: number = value.indexOf(" ", iSpace2 + 1);
        const iCloseParenthesis: number = value.indexOf(")", iOpenParenthesis);
        const hasAlpha: boolean = iSpace3 != -1;

        return _out.set(
          parseFloat(value.slice(iSpace0 + 1, iSpace1)),
          parseFloat(value.slice(iSpace1 + 1, iSpace2)),
          parseFloat(value.slice(iSpace2 + 1, hasAlpha ? iSpace3 : iCloseParenthesis)),
          _alpha ?? (hasAlpha ? parseFloat(value.slice(iSpace3 + 3, iCloseParenthesis)) : 1)
        );
      }

      throw new Error(`${Color.name}.${Color.CSS.name}: Unrecognized color format: "${_keyword}"`);
      // Color.crc2.fillRect(0, 0, 1, 1);
      // let data: Uint8ClampedArray = Color.crc2.getImageData(0, 0, 1, 1).data;
      // return _out.set(
      //   data[0] / 255,
      //   data[1] / 255,
      //   data[2] / 255,
      //   _alpha ?? data[3] / 255
      // );
    }

    /**
     * Computes and returns the sum of two colors.
     * @param _out Optional color to store the result in.
     */
    public static SUM(_clrA: Color, _clrB: Color, _out: Color = Recycler.reuse(Color)): Color {
      return _out.set(_clrA.r + _clrB.r, _clrA.g + _clrB.g, _clrA.b + _clrB.b, _clrA.a + _clrB.a);
    }

    /**
     * Computes and returns the sum of two colors.
     * @param _out Optional color to store the result in.
     */
    public static DIFFERENCE(_clrA: Color, _clrB: Color, _out: Color = Recycler.reuse(Color)): Color {
      return _out.set(Math.max(0, _clrA.r - _clrB.r), Math.max(0, _clrA.g - _clrB.g), Math.max(0, _clrA.b - _clrB.b), Math.max(0, _clrA.a - _clrB.a));
    }

    /**
     * Computes and returns the product of two colors.
     * @param _out Optional color to store the result in.
     */
    public static PRODUCT(_clrA: Color, _clrB: Color, _out: Color = Recycler.reuse(Color)): Color {
      return _out.set(_clrA.r * _clrB.r, _clrA.g * _clrB.g, _clrA.b * _clrB.b, _clrA.a * _clrB.a);
    }

    /**
     * Returns a new color representing the given color scaled by the given scaling factor.
     * @param _out Optional color to store the result in.
     */
    public static SCALE(_vector: Color, _scaling: number, _out: Color = Recycler.reuse(Color)): Color {
      return _out.set(_vector.r * _scaling, _vector.g * _scaling, _vector.b * _scaling, _vector.a * _scaling);
    }

    static #f(_n: number, _hue: number, _saturation: number, _light: number): number {
      let k: number = (_n + _hue / 30) % 12;
      let a: number = _saturation * Math.min(_light, 1 - _light);
      return _light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }
    //#endregion

    //#region Accessors
    public get isArrayConvertible(): true {
      return true;
    }

    /**
     * Creates and returns a clone of this color.
     */
    public get clone(): Color {
      return Recycler.reuse(Color).copy(this);
    }
    //#endregion

    //#region Instance
    /**
     * Copies the color channels of the given color into this color and returns it.
     * @returns A reference to this color.
     */
    public copy(_color: Color): Color {
      this.r = _color.r;
      this.g = _color.g;
      this.b = _color.b;
      this.a = _color.a;
      return this;
    }

    /**
     * Sets the color channels of this color.
     * @returns A reference to this color.
     */
    public set(_r: number, _g: number, _b: number, _a: number): Color {
      this.r = _r; this.g = _g; this.b = _b; this.a = _a;
      return this;
    }

    public recycle(): void {
      this.r = 1; this.g = 1; this.b = 1; this.a = 1;
    }

    /**
     * Returns true if this vector is equal to the given vector within the given tolerance.
     */
    public equals(_compare: Color, _tolerance: number = Number.EPSILON): boolean {
      return Math.abs(this.r - _compare.r) <= _tolerance &&
        Math.abs(this.g - _compare.g) <= _tolerance &&
        Math.abs(this.b - _compare.b) <= _tolerance &&
        Math.abs(this.a - _compare.a) <= _tolerance;
    }

    /**
     * Sets this color from the given css color keyword. Optinally sets the alpha value to the given value.
     * @returns A reference to this color.
     */
    public setCSS(_keyword: string, _alpha?: number): Color {
      return Color.CSS(_keyword, _alpha ?? this.a, this);
    }

    /**
     * Sets the color channels of this color and clamps them between 0 and 1.
     * @returns A reference to this color.
     */
    public setClamped(_r: number, _g: number, _b: number, _a: number): Color {
      return this.set(Calc.clamp(_r, 0, 1), Calc.clamp(_g, 0, 1), Calc.clamp(_b, 0, 1), Calc.clamp(_a, 0, 1));;
    }

    /**
     * Sets this color from the given hsl values.
     */
    public setHSL(_hue: number, _saturation: number, _lightness: number, _alpha?: number): Color {
      if (_alpha != undefined)
        this.a = _alpha;

      return Color.hsl2rgb(_hue, _saturation, _lightness, this);
    }

    /**
     * Sets this color from the given 8-bit values for the color channels.
     * @returns A reference to this color.
     */
    public setBytes(_r: number, _g: number, _b: number, _a: number): Color {
      return this.set(_r / 255, _g / 255, _b / 255, _a / 255);
    }

    /**
     * Sets this color from the given hex string color.
     * @returns A reference to this color.
     */
    public setHex(_hex: string): Color {
      if (_hex.startsWith("#"))
        _hex = _hex.slice(1);

      this.r = parseInt(_hex.slice(0, 2), 16) / 255;
      this.g = parseInt(_hex.slice(2, 4), 16) / 255;
      this.b = parseInt(_hex.slice(4, 6), 16) / 255;

      if (_hex.length >= 8)
        this.a = parseInt(_hex.slice(6, 8), 16) / 255;

      return this;
    }

    /**
     * Returns the css color keyword representing this color.
     * @deprecated Use {@link toCSS} instead.
     */
    public getCSS(): string {
      return this.toCSS();
    }

    /**
     * Returns the hex string representation of this color.
     * @deprecated Use {@link toHex} instead.
     */
    public getHex(): string {
      return this.toHex();
    }

    /**
     * Adds the given color to this.
     */
    public add(_color: Color): Color {
      this.r += _color.r;
      this.g += _color.g;
      this.b += _color.b;
      this.a += _color.a;
      return this;
    }

    /**
     * Adds the given color to this.
     */
    public subtract(_color: Color): Color {
      this.r = Math.max(0, this.r - _color.r);
      this.g = Math.max(0, this.g - _color.g);
      this.b = Math.max(0, this.b - _color.b);
      this.a = Math.max(0, this.a - _color.a);
      return this;
    }

    /**
     * Multiplies this with the given color.
     */
    public multiply(_color: Color): Color {
      this.r *= _color.r;
      this.g *= _color.g;
      this.b *= _color.b;
      this.a *= _color.a;
      return this;
    }

    /**
     * Scales this color by the given factor.
     */
    public scale(_scaling: number): Color {
      this.r *= _scaling;
      this.g *= _scaling;
      this.b *= _scaling;
      this.a *= _scaling;
      return this;
    }

    /**
     * Calls a defined callback function on each channel of the color, and returns a new color that contains the results. Similar to {@link Array.map}.
     * @param _out Optional color to store the result in.
     */
    public map(_function: (_value: number, _index: number, _channel: "r" | "g" | "b" | "a", _color: Color) => number, _out: Color = Recycler.reuse(Color)): Color {
      _out.r = _function(this.r, 0, "r", this);
      _out.g = _function(this.g, 1, "g", this);
      _out.b = _function(this.b, 2, "b", this);
      _out.a = _function(this.a, 3, "a", this);
      return _out;
    }

    /**
     * Calls a defined callback function on each channel of the color and assigns the result to the channel. Similar to {@link Color.map} but mutates this color instead of creating a new one.
     * @returns A reference to this color.
     */
    public apply(_function: (_value: number, _index: number, _channel: "r" | "g" | "b" | "a", _color: Color) => number): Color {
      this.r = _function(this.r, 0, "r", this);
      this.g = _function(this.g, 1, "g", this);
      this.b = _function(this.b, 2, "b", this);
      this.a = _function(this.a, 3, "a", this);
      return this;
    }

    public fromArray(_array: ArrayLike<number>, _offset: number = 0): this {
      this.r = _array[_offset];
      this.g = _array[_offset + 1];
      this.b = _array[_offset + 2];
      this.a = _array[_offset + 3];
      return this;
    }

    public toArray<T extends { [n: number]: number } = number[]>(_out: T = <T><unknown>new Array(4), _offset: number = 0): T {
      _out[_offset] = this.r;
      _out[_offset + 1] = this.g;
      _out[_offset + 2] = this.b;
      _out[_offset + 3] = this.a;
      return _out;
    }

    /**
     * Returns a formatted string representation of this color
     */
    public toString(): string {
      return `(r: ${this.r.toFixed(3)}, g: ${this.g.toFixed(3)}, b: ${this.b.toFixed(3)}, a: ${this.a.toFixed(3)})`;
    }

    /**
     * Returns the hex string representation of this color. // TODO: maybe this should return a number instead of a string?
     */
    public toHex(): string {
      return `${(this.r * 255).toString(16).padStart(2, "0")}${(this.g * 255).toString(16).padStart(2, "0")}${(this.b * 255).toString(16).padStart(2, "0")}${(this.a * 255).toString(16).padStart(2, "0")}`;
    }

    /**
     * Returns the css color keyword representing this color.
     */
    public toCSS(): string {
      return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }

    //#region Transfer
    public serialize(): Serialization {
      let serialization: Serialization = this.getMutator(true);
      // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
      serialization.toJSON = () => { return `[${this.r}, ${this.g}, ${this.b}, ${this.a}]`; };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      if (typeof (_serialization) == "string") {
        [this.r, this.g, this.b, this.a] = JSON.parse(<string><unknown>_serialization);
      } else
        this.mutate(_serialization);
      return this;
    }

    public override mutate(_mutator: Mutator): void {
      if (_mutator.r != undefined)
        this.r = _mutator.r;
      if (_mutator.g != undefined)
        this.g = _mutator.g;
      if (_mutator.b != undefined)
        this.b = _mutator.b;
      if (_mutator.a != undefined)
        this.a = _mutator.a;
    }

    protected reduceMutator(_mutator: Mutator): void {/** */ }
    //#endregion
    //#endregion
  }
}