namespace FudgeCore {
  /**
   * Wraps a regular Javascript Array and offers very limited functionality geared solely towards avoiding garbage colletion.
   * @author Jirka Dell'Oro-Friedl, HFU, 2021
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Recycler
   */
  export class RecycableArray<T> { // TODO: fix spelling Recycable -> Recyclable
    #length: number = 0;
    #array: Array<T> = new Array<T>();
    // #type: new () => T;

    // //tslint:disable-next-line:no-any
    // constructor(_type: new (...args: any[]) => T) {
    //   this.#type = _type;
    // }

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
     * Returns a copy of the array sorted according to the given compare function
     */
    public getSorted(_sort: (a: T, b: T) => number): T[] {
      let sorted: T[] = this.#array.slice(0, this.#length);
      sorted.sort(_sort);
      return sorted;
    }
  }
}