///<reference path="TreeList.ts"/>
namespace FudgeUserInterface {
  import ƒ = FudgeCore;
  
  export enum CSS_CLASS {
    SELECTED = "selected",
    INACTIVE = "inactive"
  }

  /**
   * Extension of {@link TreeList} that represents the root of a tree control  
   * ```text
   * tree <ul>
   * ├ treeItem <li>
   * ├ treeItem <li>
   * │ └ treeList <ul>
   * │   ├ treeItem <li>
   * │   └ treeItem <li>
   * └ treeItem <li>
   * ```
   */
  export class Tree<T> extends TreeList<T> {

    public constructor(_controller: TreeController<T>, _root: T) {
      super(_controller, []);
      let root: TreeItem<T> = new TreeItem<T>(this.controller, _root);
      this.appendChild(root);

      this.addEventListener(EVENT.EXPAND, this.hndExpand);
      this.addEventListener(EVENT.SELECT, this.hndSelect);
      this.addEventListener(EVENT.DELETE, this.hndDelete);
      this.addEventListener(EVENT.ESCAPE, this.hndEscape);

      this.addEventListener(EVENT.COPY, this.hndCopyPaste);
      this.addEventListener(EVENT.PASTE, this.hndCopyPaste);
      this.addEventListener(EVENT.CUT, this.hndCopyPaste);

      this.addEventListener(EVENT.DROP, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_LEAVE, this.hndDragLeave);
      this.addEventListener(EVENT.DRAG_START, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragDrop);

      // @ts-ignore
      this.addEventListener(EVENT.FOCUS_NEXT, this.hndFocus);
      // @ts-ignore
      this.addEventListener(EVENT.FOCUS_PREVIOUS, this.hndFocus);
    }

    /**
     * Clear the current selection
     */
    public clearSelection(): void {
      this.controller.selection.splice(0);
      this.displaySelection(<T[]>this.controller.selection);
    }

    /**
     * Return the object in focus or null if none is focussed
     */
    public getFocussed(): T {
      let items: TreeItem<T>[] = <TreeItem<T>[]>Array.from(this.querySelectorAll("li"));
      let found: number = items.indexOf(<TreeItem<T>>document.activeElement);
      if (found > -1)
        return items[found].data;

      return null;
    }

    /**
     * Refresh the whole tree to synchronize with the data the tree is based on
     */
    public refresh(): void {
      for (const item of this) {
        if (!item.expanded)
          continue;

        let branch: TreeList<T> = this.createBranch(this.controller.getChildren(item.data));
        item.getBranch().restructure(branch);
        if (!this.controller.hasChildren(item.data))
          item.expand(false);
      }
    }

    /**
     * Adds the given children to the given target at the given index. If no index is given, the children are appended at the end of the list.
     */
    public addChildren(_children: T[], _target: T, _index?: number): void {
      // if drop target included in children -> refuse
      if (_children.indexOf(_target) > -1)
        return;

      // add only the objects the addChildren-method of the controller returns
      let move: T[] = this.controller.addChildren(_children, _target, _index);
      if (!move || move.length == 0)
        return;

      let focus: T = this.getFocussed();
      // TODO: don't, when copying or coming from another source
      this.delete(move);

      let targetData: T = <T>_target;
      let targetItem: TreeItem<T> = this.findVisible(targetData);

      let branch: TreeList<T> = this.createBranch(this.controller.getChildren(targetData));
      let old: TreeList<T> = targetItem.getBranch();
      targetItem.hasChildren = true;
      if (old)
        old.restructure(branch);
      else
        targetItem.expand(true);

      this.findVisible(focus)?.focus();
    }

    private hndExpand(_event: Event): void {
      let item: TreeItem<T> = <TreeItem<T>>_event.target;
      let children: readonly T[] = this.controller.getChildren(item.data);
      if (!children || children.length == 0)
        return;

      let branch: TreeList<T> = this.createBranch(children);
      item.setBranch(branch);
      this.displaySelection(this.controller.selection);
    }

    private createBranch(_data: readonly T[]): TreeList<T> {
      let branch: TreeList<T> = new TreeList<T>(this.controller, []);
      for (let child of _data) {
        branch.addItems([new TreeItem(this.controller, child)]);
      }
      return branch;
    }

    // Callback / Eventhandler in Tree
    private hndSelect(_event: Event): void {
      // _event.stopPropagation();
      let detail: { data: Object; interval: boolean; additive: boolean } = (<CustomEvent>_event).detail;
      let index: number = this.controller.selection.indexOf(<T>detail.data);

      if (detail.interval) {
        let dataStart: T = <T>this.controller.selection[0];
        let dataEnd: T = <T>detail.data;
        this.clearSelection();
        this.selectInterval(dataStart, dataEnd);
        return;
      }

      if (index >= 0 && detail.additive)
        this.controller.selection.splice(index, 1);
      else {
        if (!detail.additive)
          this.clearSelection();
        this.controller.selection.push(<T>detail.data);
      }

      this.displaySelection(<T[]>this.controller.selection);
    }

    private hndDragDrop = async (_event: DragEvent): Promise<void> => {
      let item: TreeItem<T> = <TreeItem<T>>Reflect.get(_event, "item");
      // _event.dataTransfer.dropEffect = "none";

      switch (_event.type) {
        case EVENT.DRAG_START:
          _event.dataTransfer.effectAllowed = "all";
          this.controller.dragStart(item.data);
          break;
        case EVENT.DRAG_OVER:
          _event.dataTransfer.dropEffect = this.controller.dragOver(_event);
          // _event.preventDefault();
          break;
        case EVENT.DROP:
          let objects: T[] = await this.controller.drop(_event);
          let index: number = Reflect.get(_event, "index");
          let parent: T = Reflect.get(_event, "parent");
          this.addChildren(objects, index == null ? item.data : parent, index);
          this.controller.dragDropIndicator.remove();
          break;
      }
    };

    private hndDragLeave = (_event: DragEvent): void => {
      let relatedTarget: EventTarget = _event.relatedTarget;
      if (relatedTarget instanceof HTMLElement && !this.contains(relatedTarget) && !this.contains(relatedTarget.offsetParent)) // offset parent is for weird (invisible) divs which are placed over input elements and trigger leave events... 
        this.controller.dragDropIndicator.remove();
    };

    private hndDelete = async (_event: Event): Promise<void> => {
      let target: TreeItem<T> = <TreeItem<T>>_event.target;
      _event.stopPropagation();
      let remove: T[] = await this.controller.delete([target.data]);
      this.delete(remove);
    };

    private hndEscape = (_event: Event): void => {
      this.clearSelection();
    };

    private hndCopyPaste = async (_event: Event): Promise<void> => {
      ƒ.Debug.fudge(_event);
      // _event.stopPropagation();
      let target: TreeItem<T> = <TreeItem<T>>_event.target;
      switch (_event.type) {
        case EVENT.COPY:
          this.controller.copy(this.getFocussed(), _event.type);
          break;
        case EVENT.CUT:
          let cut: T[] = await this.controller.cut(this.getFocussed(), _event.type);
          // let cut: T[] = await this.controller.delete(this.controller.selection);
          this.delete(cut);
          break;
        case EVENT.PASTE:
          _event.stopPropagation();
          let objects: T[] = await this.controller.paste();
          if (this.controller.canAddChildren(objects, target.data)) {
            this.addChildren(objects, target.data);
            this.parentElement.dispatchEvent(new Event(EVENT.PASTE, { bubbles: true }));
          }
          break;
      }
    };

    private hndFocus = (_event: KeyboardEvent): void => {
      _event.stopPropagation();
      let items: TreeItem<T>[] = <TreeItem<T>[]>Array.from(this.querySelectorAll("li"));
      let target: TreeItem<T> = <TreeItem<T>>_event.target;
      let index: number = items.indexOf(target);
      if (index < 0)
        return;

      if (_event.shiftKey && this.controller.selection.length == 0)
        target.select(true);

      switch (_event.type) {
        case EVENT.FOCUS_NEXT:
          if (++index < items.length)
            items[index].focus();
          break;
        case EVENT.FOCUS_PREVIOUS:
          if (--index >= 0)
            items[index].focus();
          break;
        default:
          break;
      }

      if (_event.shiftKey)
        (<TreeItem<T>>document.activeElement).select(true);
      else if (!_event.ctrlKey)
        this.clearSelection();
    };
  }

  customElements.define("ul-tree", Tree, { extends: "ul" });
}
