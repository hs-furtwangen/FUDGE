namespace FudgeUserInterface {
  /**
   * Subclass this to create a broker between your data and a {@link Tree} to display and manipulate it.
   * The {@link Tree} doesn't know how your data is structured and how to handle it, the controller implements the methods needed
   */
  export abstract class TreeController<T> {
    /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
    public selection: T[] = [];
    /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
    public dragDrop: { sources: T[]; target: T; at?: number } = { sources: [], target: null };
    /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
    public copyPaste: { sources: T[]; target: T } = { sources: [], target: null };

    /** Used by the tree to indicate the drop position while dragging */
    public dragDropIndicator: HTMLHRElement = document.createElement("hr");

    /** Override to enable tree items to be sortable by the user via drag-and-drop. Default is true. */
    public sortable: boolean = true;

    /**
     * Override if some objects should not be draggable
     */
    public draggable(_object: T): boolean {
      return true;
    }

    /**
     * Checks if two objects of are equal. Default is _a == _b. Override for more complex comparisons. 
     * Useful when the underlying data is volatile and changes identity while staying the same.
     */
    public equals(_a: T, _b: T): boolean {
      return _a == _b;
    }

    /**
     * Override if some objects should not be addable to others
     */
    public canAddChildren(_sources: T[], _target: T): boolean {
      return true;
    }

    /** 
     * Remove the objects to be deleted, e.g. the current selection, from the data structure the table refers to and 
     * return a list of those objects in order for the according {@link TreeItems} to be deleted also   
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
      Clipboard.copyPaste.set(items, _operation);
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
    public async paste(): Promise<T[]> {
      let objects: T[] = Clipboard.copyPaste.get(); // possible to filter for only objects of specific type
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
    public async drop(): Promise<T[]> {
      let objects: T[] = Clipboard.dragDrop.get(); // possible to filter for only objects of specific type
      return objects;
    }

    /** Create an HTMLElement for the tree item representing the object. e.g. an HTMLInputElement */
    public abstract createContent(_object: T): HTMLElement;

    /** Retrieve a space separated string of attributes to add to the list item representing the object for further styling  */
    public abstract getAttributes(_object: T): string;

    /** Process the proposed new value. The id of the html element on which the change occured is passed */
    public abstract setValue(_object: T, _element: HTMLInputElement | HTMLSelectElement): Promise<boolean>;

    /** Return true if the object has children that must be shown when unfolding the tree item */
    public abstract hasChildren(_object: T): boolean;

    /** Return the object's children to show when unfolding the tree item */
    public abstract getChildren(_object: T): T[];

    /** 
     * Process the list of source objects to be addedAsChildren when dropping or pasting onto the target item/object, 
     * return the list of objects that should visibly become the children of the target item/object 
     * @param _children A list of objects the tree tries to add to the _target
     * @param _target The object referenced by the item the drop occurs on
     */
    public abstract addChildren(_sources: T[], _target: T, _index?: number): T[];
  }
}
