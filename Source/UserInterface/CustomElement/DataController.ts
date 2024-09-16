namespace FudgeUserInterface {
  /**
   * Baseclass for complex ui-controllers handling data in tables, trees or other structures   
   */
  export class DataController<T> {
    /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of table */
    public selection: T[] = [];
    
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
     * @param _focus The item has the focus and that will be copied if the selection is empty,
     * otherwise the current selection is referred
     */
    public copy(_focus: T, _operation: ClipOperation): T[] {
      let items: T[] = this.selection.length ? this.selection : [_focus];
      Clipboard.copyPaste.set(items, _operation);
      return items;
    }

    /** 
     * Refer objects to the clipboard for copy & paste and delete them from this controller   
     * @param _focus The item that has the focus and that will be cut if the selection is empty,
     * otherwise the whole selection gets referred and deleted
     */
    public async cut(_focus: T, _operation: ClipOperation): Promise<T[]> {
      let items: T[] = this.copy(_focus, _operation);
      items = await this.delete(items);
      return items;
    }

    /** 
     * Retrieve objects from the clipboard, process and return them to add to the table   
     * Standard behaviour: if the copyPaste clipboard was filled using copy, return an array of clones,
     * otherwise the content of the clipboard
     */
    public async paste(): Promise<T[]> {
      let objects: T[] = Clipboard.copyPaste.get();
      if (Clipboard.copyPaste.operation == "copy")
        return await this.clone(objects);
      else
        return objects;
    }

    /** 
     * Refer objects to the clipboard for drag & drop   
     * @param _focus The item that has the focus and that will be dragged if the selection is empty,
     * otherwise the current selection is referred
     */
    public dragStart(_focus: T): void {
      // if the focussed item is in the selection, drag the whole selection
      let items: T[] = this.selection.indexOf(_focus) < 0 ? [_focus] : this.selection;
      Clipboard.dragDrop.set(items);
    }

    /** 
     * Return allowed dragDrop-effect  
     * Standard behaviour: check the ctrlKey for "copy" and shiftKey for "link", otherwise return "move"  
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
     * Retrieve objects from the clipboard, process and return them to add to the tree.
     * Standard behaviour: if {@link: dragOver} yields "copy", return an array of clones of the objects in,
     * otherwise the content of the dragDrop-clipboard.
     */
    public async drop(_event: DragEvent): Promise<T[]> {
      let objects: T[] = Clipboard.dragDrop.get();
      if (this.dragOver(_event) == "copy")
        return await this.clone(objects);
      else
        return objects;
    }

    /** 
     * Clone objects and return an array with references to the clones
     * Standard behaviour: use Object.create to clone the objects
     */
    public async clone(_objects: T[]): Promise<T[]> {
      return _objects.map(_object => Object.create(<Object>_object));
    }
  }
}
