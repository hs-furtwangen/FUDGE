namespace FudgeCore {
  export interface ArrayConvertible {
    readonly isArrayConvertible: true;

    /**
     * Set the values of this object from the given array starting at the given offset.
     * @param _array - The array to read the values from.
     * @param _offset - (optional) The offset to start reading from.
     * @returns A reference to this instance.
     */
    fromArray(_array: ArrayLike<number>, _offset?: number): this;

    /**
     * Copy the values of this object into the given array starting at the given offset. Creates a new array if none is provided.
     * @param _out - (optional) The receiving array.
     * @param _offset - (optional) The offset to start writing to.
     * @returns `_out` or a new array if none is provided.
     */
    toArray<T extends { [n: number]: number } = number[]>(_out?: T, _offset?: number): T;
  }
}