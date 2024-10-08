namespace FudgeUserInterface {
  import ƒ = FudgeCore;
  /**
   * Extension of tr-element that represents an object in a [[Table]]
   */
  export class TableItem<T extends Object> extends HTMLTableRowElement {
    public data: T = null;
    public controller: TableController<T>;

    public constructor(_controller: TableController<T>, _data: T, _attIcon: string) {
      super();
      this.controller = _controller;
      this.data = _data;
      // this.display = this.controller.getLabel(_data);
      // TODO: handle cssClasses
      this.create(this.controller.getHead(), _attIcon);
      this.className = "table";

      this.addEventListener(EVENT.POINTER_UP, this.hndPointerUp);
      this.addEventListener(EVENT.KEY_DOWN, this.hndKey);
      this.addEventListener(EVENT.CHANGE, this.hndChange);

      this.draggable = true;
      this.addEventListener(EVENT.DRAG_START, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragDrop);
      this.addEventListener(EVENT.DROP, this.hndDragDrop);

      // this.addEventListener(EVENT.UPDATE, this.hndUpdate);
    }

    /**
     * Returns attaches or detaches the [[CSS_CLASS.SELECTED]] to this item
     */
    public set selected(_on: boolean) {
      if (_on)
        this.classList.add(CSS_CLASS.SELECTED);
      else
        this.classList.remove(CSS_CLASS.SELECTED);
    }

    /**
     * Returns true if the [[TREE_CLASSES.SELECTED]] is attached to this item
     */
    public get selected(): boolean {
      return this.classList.contains(CSS_CLASS.SELECTED);
    }

    /**
     * Dispatches the [[EVENT.SELECT]] event
     * @param _additive For multiple selection (+Ctrl) 
     * @param _interval For selection over interval (+Shift)
     */
    public select(_additive: boolean, _interval: boolean = false): void {
      let event: CustomEvent = new CustomEvent(EVENT.SELECT, { bubbles: true, detail: { data: this.data, additive: _additive, interval: _interval } });
      this.dispatchEvent(event);
    }

    private create(_filter: TABLE[], _attIcon: string): void {
      for (let entry of _filter) {
        let value: string = <string>Reflect.get(this.data, entry.key);
        let icon: string = <string>Reflect.get(this.data, _attIcon);
        let td: HTMLTableCellElement = document.createElement("td");
        let input: HTMLInputElement = document.createElement("input");
        input.type = "text";
        input.disabled = !entry.editable;
        input.readOnly = true;
        input.value = value;
        input.setAttribute("key", entry.key);

        input.addEventListener(EVENT.KEY_DOWN, this.hndInputEvent);
        input.addEventListener(EVENT.DOUBLE_CLICK, this.hndInputEvent);
        input.addEventListener(EVENT.FOCUS_OUT, this.hndChange);

        td.appendChild(input);
        this.appendChild(td);
        if (icon)
          this.setAttribute("icon", icon);
      }
      this.tabIndex = 0;
    }

    private hndInputEvent = (_event: KeyboardEvent | MouseEvent): void => {
      if (_event instanceof KeyboardEvent && _event.code != ƒ.KEYBOARD_CODE.F2)
        return;

      let input: HTMLInputElement = <HTMLInputElement>_event.target;
      input.readOnly = false;
      input.focus();
    };

    private hndChange = async (_event: Event): Promise<void> => {
      this.focus();
      let target: HTMLInputElement = <HTMLInputElement>_event.target;
      target.readOnly = true;
      // let key: string = target.getAttribute("key");
      // let previousValue: ƒ.General = Reflect.get(this.data, key);

      if (await this.controller.rename(this.data, target.value)) {
        // Reflect.set(this.data, key, target.value); // why shouldn't the controller do this?
        // console.log("Dispatch Rename");
        this.parentElement.dispatchEvent(new CustomEvent(EVENT.RENAME, { bubbles: true, detail: { data: this.data } }));
      }
      return;
    };

    private hndKey = (_event: KeyboardEvent): void => {
      _event.stopPropagation();
      if (_event.target != this)
        return;

      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.ARROW_DOWN:
          this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.ARROW_UP:
          this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_PREVIOUS, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.SPACE:
          this.select(_event.ctrlKey, _event.shiftKey);
          break;
        case ƒ.KEYBOARD_CODE.ESC:
          this.dispatchEvent(new Event(EVENT.ESCAPE, { bubbles: true }));
          break;
        case ƒ.KEYBOARD_CODE.DELETE:
          this.dispatchEvent(new Event(EVENT.DELETE, { bubbles: true }));
          break;
        case ƒ.KEYBOARD_CODE.C:
          if (_event.ctrlKey || _event.metaKey) {
            _event.preventDefault();
            this.dispatchEvent(new Event(EVENT.COPY, { bubbles: true }));
          }
          break;
        case ƒ.KEYBOARD_CODE.V:
          if (_event.ctrlKey || _event.metaKey) {
            _event.preventDefault();
            this.dispatchEvent(new Event(EVENT.PASTE, { bubbles: true }));
          }
          break;
        case ƒ.KEYBOARD_CODE.X:
          if (_event.ctrlKey || _event.metaKey) {
            _event.preventDefault();
            this.dispatchEvent(new Event(EVENT.CUT, { bubbles: true }));
          }
          break;
      }
    };

    private hndDragDrop = (_event: DragEvent): void => {
      // store the dragged item in the event for further processing in table
      Reflect.set(_event, "item", this);
    };

    private hndPointerUp = (_event: PointerEvent): void => {
      _event.stopPropagation();
      this.focus();
      this.select(_event.ctrlKey, _event.shiftKey);
    };
  }
  customElements.define("table-item", <CustomElementConstructor><unknown>TableItem, { extends: "tr" });
}