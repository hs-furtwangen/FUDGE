namespace FudgeUserInterface {
  /**
   * Subclass this to create a broker between your data and a [[Table]] to display and manipulate it.
   * The [[Table]] doesn't know how your data is structured and how to handle it, the controller implements the methods needed
   */
  export abstract class TableController<T> {
    /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of table */
    public selection: T[] = [];

    //#region Replace with Clipboard
    /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
    public dragDrop: { sources: T[]; target: T } = { sources: [], target: null };
    /** Stores references to objects being copied or cut, and objects to paste to. Override with references in outer scope, if copy&paste should operate outside of tree */
    public copyPaste: { sources: T[]; target: T } = { sources: [], target: null };
    //#endregion

    /** 
     * Remove the objects to be deleted, e.g. the current selection, from the data structure the table refers to and 
     * return a list of those objects in order for the according {@link TableItems} to be deleted also   
     * @param _expendables The expendable objects 
     */
    public async delete(_expendables: T[]): Promise<T[]> {
      return _expendables;
    }

    /** 
     * Refer items to the clipboard for copy & paste   
     * @param _focus The that has the focus and that will be copied if the selection is empty
     */
    public copy(_focus: T, _operation: ClipOperation): T[] {
      let items: T[] = this.selection.length ? this.selection : [_focus];
      Clipboard.copyPaste.set(items, _operation, null);
      return items;
    }
    /** 
     * Refer objects to the clipboard for copy & paste and delete them from this controller   
     * @param _focus The item that has the focus and that will be cut if the selection is empty
     */
    public async cut(_focus: T, _operation: ClipOperation): Promise<T[]> {
      let items: T[] = this.copy(_focus, _operation);
      items = await this.delete(items);
      return items;
    }

    /** 
     * Retrieve objects from the clipboard, process and return them to add to the table   
     */
    public async paste(_class: new () => T = null): Promise<T[]> {
      let objects: T[] = Clipboard.copyPaste.get(_class, true); // possible to filter for only objects of specific type
      return objects;
    }

    /** 
     * Refer objects to the clipboard for drag & drop   
     * @param _focus The item that has the focus and that will be dragged if the selection is empty
     */
    public dragStart(_focus: T): void {
      // if the focussed item is in the selection, drag the whole selection
      let items: T[] = this.selection.indexOf(_focus) < 0 ? [_focus] : this.selection;
      Clipboard.dragDrop.set(items);
    }

    /** 
     * Return allowed dragDrop-effect   
     */
    public dragOver(_event: DragEvent): DROPEFFECT {
      let dropEffect: DROPEFFECT = "move";
      if (_event.ctrlKey)
        dropEffect = "copy";
      if (_event.shiftKey)
        dropEffect = "link";
      return dropEffect;
    }

    /** 
     * Retrieve objects from the clipboard, and process and return them to add to the table   
     */
    public async drop(_class: new () => T = null): Promise<T[]> {
      let objects: T[] = Clipboard.dragDrop.get(_class, true); // possible to filter for only objects of specific type
      return objects;
    }

    /** Retrieve a string to create a label for the table item representing the object (appears not to be called yet)  */
    public abstract getLabel(_object: T): string;

    /** Return false if renaming of object is not possibile, or true if the object was renamed */
    public abstract rename(_object: T, _new: string): Promise<boolean>;


    /** 
     * Return a list of clones of the objects given for copy & paste or drag & drop
     * @param _originals The objects to clone
     */
    public abstract /* async */ clone(_originals: T[]): Promise<T[]>;

    /** 
     * Return a list of TABLE-objects describing the head-titles and according properties
     */
    public abstract getHead(): TABLE[];

    /**
     * Sort data by given key and direction
     */
    public abstract sort(_data: T[], _key: string, _direction: number): void;
  }
}
