namespace FudgeCore {
  /**
   * Wraps a regular Javascript Array and offers very limited functionality geared solely towards avoiding garbage colletion.
   * @author Jirka Dell'Oro-Friedl, HFU, 2021
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Recycler
   */
  export class RecycableArray<T> { // TODO: fix spelling Recycable -> Recyclable
    #length: number = 0;
    #array: Array<T> = new Array<T>();

    public get length(): number {
      return this.#length;
    }

    /**
     * Sets the virtual length of the array to zero but keeps the entries beyond.
     */
    public reset(): void {
      this.#length = 0;
    }

    /**
     * Recycle this array
     */
    public recycle(): void {
      this.reset();
    }

    /**
     * Appends a new entry to the end of the array, and returns the new length of the array.
     */
    public push(_entry: T): number {
      this.#array[this.#length] = _entry;
      this.#length++;
      return this.#length;
    }

    /**
     * Removes the last entry from the array and returns it.
     */
    public pop(): T {
      if (this.#length == 0)
        return undefined;

      this.#length--;
      return this.#array[this.#length];
    }

    /**
     * Recycles the object following the last in the array and increases the array length
     * It must be assured, that none of the objects in the array is still in any use of any kind!
     */
    // public recycle(): T {
    //   if (this.#length < this.#array.length) {
    //     this.#length++;
    //     return this.#array[this.#length++];
    //   }
    //   this.#array.push(Recycler.get(this.#type));
    //   return this.#array[this.#length++];
    // }

    public *[Symbol.iterator](): IterableIterator<T> {
      for (let i: number = 0; i < this.#length; i++)
        yield this.#array[i];
    }

    /**
     * Sorts the array in place according to the provided compare function. The sorting algorithm is not guaranteed to be stable.
     * See {@link Array.prototype.sort} for details.
     */
    public sort(_compareFn: (a: T, b: T) => number): void {
      if (this.#length < 2)
        return;

      this.sortRange(_compareFn, 0, this.#length - 1);
    }

    private sortRange(_compareFn: (a: T, b: T) => number, _left: number, _right: number): void {
      let i: number = _left;
      let j: number = _right;
      const pivot: T = this.#array[(_left + _right) >> 1];

      while (i <= j) {
        while (_compareFn(this.#array[i], pivot) < 0)
          i++;

        while (_compareFn(this.#array[j], pivot) > 0)
          j--;

        if (i <= j) {
          if (i != j) {
            const temp: T = this.#array[i];
            this.#array[i] = this.#array[j];
            this.#array[j] = temp;
          }

          i++;
          j--;
        }
      }

      if (_left < j)
        this.sortRange(_compareFn, _left, j);

      if (i < _right)
        this.sortRange(_compareFn, i, _right);
    }
  }
}