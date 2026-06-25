namespace FudgeCore {

  /**
   * Values that can participate in a {@link clone} operation. Objects types must implement {@link Cloneable}.
   */
  export type CloneableValue = String | Number | Boolean | Cloneable | Array<CloneableValue> | Set<CloneableValue> | Map<CloneableValue, CloneableValue> | null | undefined;

  /**
   * An object that can create clones of itself.
   */
  export interface Cloneable {
    /**
     * Returns a clone of this object.
     */
    get clone(): Cloneable;
  }

  export function isCloneable(_object: Object): _object is Cloneable {
    return (_object && typeof _object == "object" && "clone" in _object);
  }

  /**
   * Creates a clone of the given value. This performs different operations depending on the type of the value:
   * 
   * - Primitive: returned as-is.
   * - {@link Cloneable}: cloned via its {@link Cloneable.clone | clone} getter.
   * - {@link Array}, {@link Set}, {@link Map}: a deep clone is created recursively, invoking clone on each element.
   */
  export function clone<T extends CloneableValue>(_value: T): T {
    if (typeof _value != "object" || _value == null)
      return <T>_value;

    if (isCloneable(_value))
      return <T>_value.clone;

    let out: Array<CloneableValue> | Set<CloneableValue> | Map<CloneableValue, CloneableValue>;

    if (Array.isArray(_value)) {
      out = new Array(_value.length);

      for (const i of _value.keys())
        out[i] = clone(_value[i]);
    }

    if (_value instanceof Set) {
      out = new Set();

      for (const value of _value.values())
        out.add(clone(value));
    }

    if (_value instanceof Map) {
      out = new Map();
      for (const key of _value.keys())
        out.set(clone(key), clone(_value.get(key)));
    }

    return <T>out;
  }
}