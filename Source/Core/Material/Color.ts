namespace FudgeCore {
  /**
   * Defines a color as values in the range of 0 to 1 for the four channels red, green, blue and alpha (for opacity)
   */
  export class Color extends Mutable implements Serializable, Recycable {
    // crc2 only used for converting colors from strings predefined by CSS
    private static crc2: CanvasRenderingContext2D = (() => {
      const crc2: CanvasRenderingContext2D = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      crc2.globalCompositeOperation = "copy";
      return crc2;
    })();

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public constructor(_r: number = 1, _g: number = 1, _b: number = 1, _a: number = 1) {
      super();
      this.setClamped(_r, _g, _b, _a);
    }

    /**
     * Returns a {@link Uint8ClampedArray} with the 8-bit color channels in the order RGBA.
     */
    public static getBytesFromCSS(_keyword: string): Uint8ClampedArray {
      Color.crc2.fillStyle = _keyword;
      Color.crc2.fillRect(0, 0, 1, 1);
      return Color.crc2.getImageData(0, 0, 1, 1).data;
    }

    /**
     * Returns a new {@link Color} object created from the given css color keyword. 
     * Passing an _alpha value will override the alpha value specified in the keyword.
     */
    public static CSS(_keyword: string, _alpha?: number): Color {
      return Recycler.get(Color).setCSS(_keyword, _alpha);
    }

    /**
     * Computes and retruns the product of two colors. 
     */
    public static PRODUCT(_clrA: Color, _clrB: Color): Color;
    /**
     * Computes and retruns the product of a color with a scalar value. 
     */
    public static PRODUCT(_color: Color, _scalar: number): Color;
    public static PRODUCT(_multiplicant: Color, _multiplier: Color | number): Color {
      return _multiplicant.clone.multiply(<General>_multiplier);
    }

    /**
     * Creates and returns a clone of this color.
     */
    public get clone(): Color {
      return Recycler.reuse(Color).copy(this);
    }

    /**
     * Copies the color channels of the given color into this color and returns it.
     */
    public copy(_color: Color): Color {
      this.r = _color.r;
      this.g = _color.g;
      this.b = _color.b;
      this.a = _color.a;
      return this;
    }

    public recycle(): void {
      this.r = 1; this.g = 1; this.b = 1; this.a = 1;
    }

    /**
     * Sets this color from the given css color keyword. Optinally sets the alpha value to the given value.
     */
    public setCSS(_keyword: string, _alpha?: number): Color {
      const bytesRGBA: Uint8ClampedArray = Color.getBytesFromCSS(_keyword);
      this.setBytes(bytesRGBA[0], bytesRGBA[1], bytesRGBA[2], bytesRGBA[3]);
      this.a = _alpha ?? this.a;
      return this;
    }

    /**
     * Sets this color from the given 8-bit values for the color channels.
     */
    public setBytes(_r: number, _g: number, _b: number, _a: number): Color;
    /**
     * Sets this color from the given {@link Uint8ClampedArray}.
     */
    public setBytes(_rgba: Uint8ClampedArray): Color;
    public setBytes(_r: number | Uint8ClampedArray, _g?: number, _b?: number, _a?: number): Color {
      if (_r instanceof Uint8ClampedArray)
        this.setBytes(_r[0], _r[1], _r[2], _r[3]);
      else
        this.setClamped(_r / 255, _g / 255, _b / 255, _a / 255);
      return this;
    }

    /**
     * Sets the color channels of this color and clamps them between 0 and 1.
     */
    public setClamped(_r: number, _g: number, _b: number, _a: number): Color;
    /**
     * Sets this color from the given {@link Float32Array} while clamping the values between 0 and 1.
     */
    public setClamped(_rgba: Float32Array): Color;
    public setClamped(_r: number | Float32Array, _g?: number, _b?: number, _a?: number): Color {
      if (_r instanceof Float32Array)
        this.setClamped(_r[0], _r[1], _r[2], _r[3]);
      else
        this.set(
          Calc.clamp(_r, 0, 1),
          Calc.clamp(_g, 0, 1),
          Calc.clamp(_b, 0, 1),
          Calc.clamp(_a, 0, 1)
        );
      return this;
    }

    /**
     * Sets the color channels of this color.
     */
    public set(_r: number, _g: number, _b: number, _a: number): Color {
      this.r = _r; this.g = _g; this.b = _b; this.a = _a;
      return this;
    }

    /**
     * Returns an array of the color channels of this color.
     */
    public get(): Float32Array {
      return new Float32Array([this.r, this.g, this.b, this.a]);
    }

    /**
     * Returns a {@link Uint8ClampedArray} of the color channels of this color.
     */
    public getBytes(): Uint8ClampedArray {
      return new Uint8ClampedArray([this.r * 255, this.g * 255, this.b * 255, this.a * 255]);
    }

    /**
     * Returns the css color keyword representing this color.
     */
    public getCSS(): string {
      let bytes: Uint8ClampedArray = this.getBytes();
      return `RGBA(${bytes[0]}, ${bytes[1]}, ${bytes[2]}, ${this.a})`;
    }

    /**
     * Returns the hex string representation of this color.
     */
    public getHex(): string {
      let bytes: Uint8ClampedArray = this.getBytes();
      let hex: string = "";
      for (let byte of bytes)
        hex += byte.toString(16).padStart(2, "0");
      return hex;
    }

    /**
     * Sets this color from the given hex string color.
     */
    public setHex(_hex: string): Color {
      let bytes: Uint8ClampedArray = this.getBytes();
      let channel: number = 0;
      for (let byte in bytes)
        bytes[byte] = parseInt(_hex.substr(channel++ * 2, 2), 16);
      return this.setBytes(bytes);;
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
     * Multiplies this with the given color.
     */
    public multiply(_color: Color): Color;
    /**
     * Multiplies this with the given scalar.
     */
    public multiply(_scalar: number): Color;
    public multiply(_multiplier: Color | number): Color {
      if (_multiplier instanceof Color) {
        this.r *= _multiplier.r;
        this.g *= _multiplier.g;
        this.b *= _multiplier.b;
        this.a *= _multiplier.a;
      } else {
        this.r *= _multiplier;
        this.g *= _multiplier;
        this.b *= _multiplier;
        this.a *= _multiplier;
      }
      return this;
    }

    /**
     * Returns true if the channels of this and the given color are to be considered identical within the given tolerance
     */
    public equals(_compare: Color, _tolerance: number = Number.EPSILON): boolean {
      if (Math.abs(this.r - _compare.r) > _tolerance) return false;
      if (Math.abs(this.g - _compare.g) > _tolerance) return false;
      if (Math.abs(this.b - _compare.b) > _tolerance) return false;
      if (Math.abs(this.a - _compare.a) > _tolerance) return false;
      return true;
    }

    /**
     * Returns a formatted string representation of this color
     */
    public toString(): string {
      return `(r: ${this.r.toFixed(3)}, g: ${this.g.toFixed(3)}, b: ${this.b.toFixed(3)}, a: ${this.a.toFixed(3)})`;
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
  }
}