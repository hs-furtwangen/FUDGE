namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  // TODO: duplicated code in Table and Tree, may be optimized...

  export interface TABLE {
    label: string;
    key: string;
    editable: boolean;
    sortable: boolean;
  }

  /**
   * Manages a sortable table of data given as simple array of flat objects   
   * ```text
   * Key0  Key1 Key2
   * ```
   */
  export class Table<T extends Object> extends HTMLTableElement {
    public controller: TableController<T>;
    public data: T[];
    public attIcon: string;

    public constructor(_controller: TableController<T>, _data: T[], _attIcon?: string) {
      super();
      this.controller = _controller;
      this.data = _data;
      this.attIcon = _attIcon;
      this.create();
      this.className = "sortable";

      this.addEventListener(EVENT.SORT, <EventListener>this.hndSort);
      this.addEventListener(EVENT.SELECT, this.hndSelect);
      this.addEventListener(EVENT.SELECT_ALL, this.selectAll);
      this.addEventListener(EVENT.FOCUS_NEXT, <EventListener>this.hndFocus);
      this.addEventListener(EVENT.FOCUS_PREVIOUS, <EventListener>this.hndFocus);
      this.addEventListener(EVENT.ESCAPE, this.hndEscape);
      this.addEventListener(EVENT.DELETE, this.hndDelete);

      this.addEventListener(EVENT.COPY, this.hndCopyPaste);
      this.addEventListener(EVENT.CUT, this.hndCopyPaste);
      this.addEventListener(EVENT.PASTE, this.hndCopyPaste);

      this.addEventListener(EVENT.DRAG_START, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragDrop);
      this.addEventListener(EVENT.DROP, this.hndDragDrop);
    }

    /**
     * Create the table
     */
    public create(): void {
      this.innerHTML = "";
      let head: TABLE[] = this.controller.getHead();

      this.appendChild(this.createHead(head));

      for (let data of this.data) {
        let item: TableItem<T> = new TableItem<T>(this.controller, data, this.attIcon);
        this.appendChild(item);
      }
    }

    /**
     * Clear the current selection
     */
    public clearSelection(): void {
      this.controller.selection.splice(0);
      this.displaySelection(<T[]>this.controller.selection);
    }

    /**
     * Return the object in focus
     */
    public getFocussed(): T {
      let items: TableItem<T>[] = <TableItem<T>[]>Array.from(this.querySelectorAll("tr"));
      let found: number = items.indexOf(<TableItem<T>>document.activeElement);
      if (found > -1)
        return items[found].data;

      return null;
    }

    public selectAll(): void {
      this.selectInterval(this.data[0], this.data[this.data.length-1]);
    }

    public selectInterval(_dataStart: T, _dataEnd: T): void {
      let items: NodeListOf<TableItem<T>> = <NodeListOf<TableItem<T>>>this.querySelectorAll("tr");
      let selecting: boolean = false;
      let end: T = null;
      for (let item of items) {
        if (!selecting) {
          selecting = true;
          if (item.data == _dataStart)
            end = _dataEnd;
          else if (item.data == _dataEnd)
            end = _dataStart;
          else
            selecting = false;
        }
        if (selecting) {
          item.select(true, false);
          if (item.data == end)
            break;
        }
      }
    }

    public displaySelection(_data: T[]): void {
      // console.log(_data);
      let items: NodeListOf<TableItem<T>> = <NodeListOf<TableItem<T>>>this.querySelectorAll("tr");
      for (let item of items)
        item.selected = (_data != null && _data.indexOf(item.data) > -1);
    }

    private createHead(_headInfo: TABLE[]): HTMLTableRowElement {
      let tr: HTMLTableRowElement = document.createElement("tr");
      for (let entry of _headInfo) {
        let th: HTMLTableCellElement = document.createElement("th");
        th.textContent = entry.label;
        th.setAttribute("key", entry.key);

        if (entry.sortable) {
          th.appendChild(this.getSortButtons());
          th.addEventListener(
            EVENT.CHANGE,
            (_event: Event) => th.dispatchEvent(new CustomEvent(EVENT.SORT, { detail: _event.target, bubbles: true }))
          );
        }
        tr.appendChild(th);
      }
      return tr;
    }

    private getSortButtons(): HTMLElement {
      let result: HTMLElement = document.createElement("span");
      for (let direction of ["up", "down"]) {
        let button: HTMLInputElement = document.createElement("input");
        button.type = "radio";
        button.name = "sort";
        button.value = direction;
        result.appendChild(button);
      }
      return result;
    }

    private hndSort(_event: CustomEvent): void {
      let value: string = (<HTMLInputElement>_event.detail).value;
      let key: string = (<HTMLElement>_event.target).getAttribute("key");
      let direction: number = (value == "up") ? 1 : -1;
      this.controller.sort(this.data, key, direction);
      this.create();
    }

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

    private hndDelete = async (_event: Event): Promise<void> => {
      let target: TableItem<T> = <TableItem<T>>_event.target;
      _event.stopPropagation();
      let deleted: T[] = await this.controller.delete([target.data]);
      if (deleted.length)
        this.dispatchEvent(new Event(EVENT.REMOVE_CHILD, { bubbles: true }));
    };

    private hndEscape = (_event: Event): void => {
      this.clearSelection();
    };

    private hndCopyPaste = async (_event: ClipboardEvent): Promise<void> => {
      ƒ.Debug.fudge(_event);
      // _event.stopPropagation();

      switch (_event.type) {
        case EVENT.COPY:
          this.controller.copy(this.getFocussed(), _event.type);
          break;
        case EVENT.CUT:
          _event.stopPropagation();
          let cut: T[] = await this.controller.cut(this.getFocussed(), _event.type);
          if (cut.length)
            this.dispatchEvent(new Event(EVENT.REMOVE_CHILD, { bubbles: true }));
          break;
        case EVENT.PASTE:
          _event.stopPropagation();
          let objects: T[] = await this.controller.paste();
          for (let object of objects) {
            let item: TableItem<T> = new TableItem<T>(this.controller, object, this.attIcon);
            this.appendChild(item);
            this.parentElement.dispatchEvent(new Event(EVENT.PASTE, { bubbles: true }));
          }
          break;
      }
    };

    private hndDragDrop = async (_event: DragEvent): Promise<void> => {
      let item: TreeItem<T> = <TreeItem<T>>Reflect.get(_event, "item");
      _event.dataTransfer.dropEffect = "none";

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
          for (let object of objects) {
            let item: TableItem<T> = new TableItem<T>(this.controller, object, this.attIcon);
            this.appendChild(item);
          }
          break;
      }
    };

    private hndFocus = (_event: KeyboardEvent): void => {
      _event.stopPropagation();
      let items: TableItem<T>[] = <TableItem<T>[]>Array.from(this.querySelectorAll("tr"));
      let target: TableItem<T> = <TableItem<T>>_event.target;
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

  customElements.define("table-sortable", Table, { extends: "table" });
}
