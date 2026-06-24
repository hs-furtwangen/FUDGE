namespace FudgeCore {

  /**
   * An object that can be compared to objects of the same type.
   */
  export interface Comparable {
    /**
     * Returns true if this and _compare are considered identical. False otherwise.
     */
    equals(_compare: this): boolean;
  }

  export function isComparable(_object: General): _object is Comparable {
    return (_object != null && typeof _object === "object" && typeof _object.equals == "function");
  }

  /**
   * Returns true if _a and _b are considered identical.
   * The comparison strategy depends on the value type:
   *
   * - All values: strict equality (`_a === _b`)
   * - {@link Comparable}: via {@link Comparable.equals}
   * - {@link Array}: deep recursive equality of elements
   */
  export function equals(_a: General, _b: General): boolean {
    if (_a === _b)
      return true;

    if (_a == null || _b == null)
      return false;

    if (typeof _a !== typeof _b)
      return false;

    if (typeof _a !== "object")
      return false;

    if (isComparable(_a) && isComparable(_b) && _a.equals == _b.equals) // check if they have the identical equals method.
      return _a.equals(_b);

    if (Array.isArray(_a) && Array.isArray(_b) && _a.length == _b.length) {
      for (const i of _a.keys())
        if (!equals(_a[i], _b[i]))
          return false;

      return true;
    }

    return false;
  }

  equals(Object.create(null), Object.create(null))
}