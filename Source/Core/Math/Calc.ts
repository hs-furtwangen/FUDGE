namespace FudgeCore {
  /**
   * Abstract class supporting various arithmetical helper functions
   */
  export abstract class Calc {
    /** factor multiplied with angle in degrees yields the angle in radian */
    public static readonly deg2rad: number = Math.PI / 180;
    /** factor multiplied with angle in radian yields the angle in degrees */
    public static readonly rad2deg: number = 1 / Calc.deg2rad;

    /**
     * Returns one of the values passed in, either _value if within _min and _max or the boundary being exceeded by _value
     */
    public static clamp<T>(_value: T, _min: T, _max: T, _isSmaller: (_value1: T, _value2: T) => boolean = (_value1: T, _value2: T) => { return _value1 < _value2; }): T {
      if (_isSmaller(_value, _min)) return _min;
      if (_isSmaller(_max, _value)) return _max;
      return _value;
    }

    /**
     * Returns the linear interpolation between two values (_a, _b) for the given interpolation factor (_f). f is clamped between 0 and 1.
     */
    public static lerp(_a: number, _b: number, _f: number): number {
      return _a + (_b - _a) * Calc.clamp(_f, 0, 1);
    }

    /**
     * Rounds the given value to the nearest multiple of the given increment using the given rounding function. 
     * Default rounding function is {@link Math.round}, use {@link Math.floor} or {@link Math.ceil} to round down or up.
     */
    public static snap(_value: number, _increment: number, _round: (_value: number) => number = Math.round): number {
      return _round(_value / _increment) * _increment;
    }
  }
}