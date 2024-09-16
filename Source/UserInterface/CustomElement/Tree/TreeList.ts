namespace FudgeUserInterface {

  /**
   * Extension of ul-element that keeps a list of {@link TreeItem}s to represent a branch in a tree
   */
  export class TreeList<T> extends HTMLUListElement {
    public controller: TreeController<T>;

    public constructor(_controller: TreeController<T>, _items: TreeItem<T>[] = []) {
      super();
      this.controller = _controller;
      this.addItems(_items);
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragOver);
      this.addEventListener(EVENT.DROP, this.hndDrop);
      this.className = "tree";
    }

    /**
     * Expands the tree along the given paths to show the objects the paths include.
     */
    public expand(_paths: T[][]): void {
      for (let path of _paths)
        this.show(path);
    }

    /**
     * Expands the tree along the given path to show the objects the path includes.
     */
    public show(_path: T[]): void {
      let currentTree: TreeList<T> = this;

      for (let data of _path) {
        let item: TreeItem<T> = currentTree.findItem(data);
        if (!item)
          break;

        if (!item.expanded)
          item.expand(true);

        currentTree = item.getBranch();
      }
    }

    /**
     * Restructures the list to sync with the given list. 
     * {@link TreeItem}s referencing the same object remain in the list, new items get added in the order of appearance, obsolete ones are deleted.
     * @param _tree A list to sync this with
     */
    public restructure(_tree: TreeList<T>): void {
      let items: TreeItem<T>[] = [];
      for (let item of _tree.getItems()) {
        let found: TreeItem<T> = this.findItem(item.data);
        if (found) {
          found.refreshContent();
          found.hasChildren = item.hasChildren;
          if (!found.hasChildren)
            found.expand(false);
          items.push(found);
        } else
          items.push(item);
      }

      this.innerHTML = "";
      this.addItems(items);
      this.displaySelection(this.controller.selection);
    }

    /**
     * Returns the {@link TreeItem} of this list referencing the given object or null, if not found
     */
    public findItem(_data: T): TreeItem<T> {
      for (let item of this.children)
        if (this.controller.equals((<TreeItem<T>>item).data, _data))
          return <TreeItem<T>>item;

      return null;
    }

    /**
     * Adds the given {@link TreeItem}s at the end of this list
     */
    public addItems(_items: TreeItem<T>[]): void {
      for (let item of _items) {
        this.appendChild(item);
      }
    }

    /**
     * Returns the content of this list as array of {@link TreeItem}s
     */
    public getItems(): TreeItem<T>[] {
      return <TreeItem<T>[]>Array.from(this.children).filter(_child => _child instanceof TreeItem);
    }

    public displaySelection(_data: T[]): void {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      for (let item of items)
        item.selected = (_data != null && _data.indexOf(item.data) > -1);
    }

    public selectInterval(_dataStart: T, _dataEnd: T): void {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      let selecting: boolean = false;
      let end: T = null;
      for (let item of items) {
        if (!selecting) {
          selecting = true;
          if (this.controller.equals(item.data, _dataStart))
            end = _dataEnd;
          else if (this.controller.equals(item.data, _dataEnd))
            end = _dataStart;
          else
            selecting = false;
        }
        if (selecting) {
          item.select(true, false);
          if (this.controller.equals(item.data, end))
            break;
        }
      }
    }
    public selectAll(): void {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      this.selectInterval(items[0].data, items[items.length - 1].data);
    }

    public delete(_data: T[]): TreeItem<T>[] {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      let deleted: TreeItem<T>[] = [];

      for (let item of items)
        if (_data.indexOf(item.data) > -1) {
          item.dispatchEvent(new Event(EVENT.REMOVE_CHILD, { bubbles: true }));
          deleted.push(item.parentNode.removeChild(item));
        }

      return deleted;
    }

    public findVisible(_data: T): TreeItem<T> {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      for (let item of items)
        if (this.controller.equals(_data, item.data))
          return item;
      return null;
    }

    /**
     * Returns all expanded {@link TreeItem}s that are a descendant of this list.
     */
    public getExpanded(): TreeItem<T>[] {
      return [...this].filter(_item => _item.expanded);
    }

    public *[Symbol.iterator](): Iterator<TreeItem<T>> {
      let items: NodeListOf<TreeItem<T>> = <NodeListOf<TreeItem<T>>>this.querySelectorAll("li");
      for (let i: number = 0; i < items.length; i++)
        yield items[i];
    }

    private hndDrop = (_event: DragEvent): void => {
      if (Reflect.has(_event, "index"))
        return;

      let target: T = (<TreeItem<T>>this.parentElement).data;
      Reflect.set(_event, "index", this.controller.dragDropIndicator.isConnected ?
        Array.from(this.children).indexOf(this.controller.dragDropIndicator) :
        null);
      Reflect.set(_event, "parent", target);
    };

    private hndDragOver = (_event: DragEvent): void => {
      if (Reflect.get(_event, "dragProcessed"))
        return;

      Reflect.set(_event, "dragProcessed", true);

      let target: T = (<TreeItem<T>>this.parentElement).data;
      if (target == null || !this.controller.canAddChildren(Clipboard.dragDrop.get(), target))
        return;

      _event.preventDefault();
      _event.dataTransfer.dropEffect = "move";

      if (_event.target == this)
        this.controller.dragDropIndicator.remove();
      else {
        let targetItem: TreeItem<T> = <TreeItem<T>>_event.composedPath().find(_target => _target instanceof TreeItem);
        if (this.getItems().includes(targetItem)) {
          let rect: DOMRect = targetItem.content.getBoundingClientRect();
          let addBefore: boolean = _event.clientY < rect.top + rect.height / 2;
          let sibling: Element = addBefore ? targetItem.previousElementSibling : targetItem.nextElementSibling;
          if (sibling != this.controller.dragDropIndicator)
            if (addBefore)
              targetItem.before(this.controller.dragDropIndicator);
            else
              targetItem.after(this.controller.dragDropIndicator);
        }
      }
    };
  }

  customElements.define("ul-tree-list", TreeList, { extends: "ul" });
}