namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Extension of li-element that represents an object in a {@link TreeList} with a checkbox and user defined input elements as content.
   * Additionally, may hold an instance of {@link TreeList} as branch to display children of the corresponding object.
   */
  export class TreeItem<T> extends HTMLLIElement {
    public classes: CSS_CLASS[] = [];
    public data: T = null;
    public controller: TreeController<T>;

    private checkbox: HTMLInputElement;
    #content: HTMLFieldSetElement;

    public constructor(_controller: TreeController<T>, _data: T) {
      super();
      this.controller = _controller;
      this.data = _data;
      // TODO: handle cssClasses
      this.create();
      this.hasChildren = this.controller.hasChildren(_data);

      this.addEventListener(EVENT.CHANGE, this.hndChange);
      this.addEventListener(EVENT.DOUBLE_CLICK, this.hndDblClick);
      this.addEventListener(EVENT.FOCUS_OUT, this.hndFocus);
      this.addEventListener(EVENT.KEY_DOWN, this.hndKey);
      // this.addEventListener(EVENT_TREE.FOCUS_NEXT, this.hndFocus);
      // this.addEventListener(EVENT_TREE.FOCUS_PREVIOUS, this.hndFocus);

      this.draggable = this.controller.draggable(_data);
      // this.addEventListener(EVENT.DRAG_START, this.hndDragStart);
      this.addEventListener(EVENT.DRAG_START, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_ENTER, this.hndDragOver); // this prevents cursor from flickering
      this.addEventListener(EVENT.DRAG_ENTER, this.hndDragDrop); // this prevents cursor from flickering
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragDrop);
      this.addEventListener(EVENT.DRAG_OVER, this.hndDragOver);

      this.addEventListener(EVENT.DROP, this.hndDragDrop);

      this.addEventListener(EVENT.POINTER_UP, this.hndPointerUp);
      this.addEventListener(EVENT.REMOVE_CHILD, this.hndRemove);
    }

    /**
     * Returns true, when this item has a visible checkbox in front to expand the subsequent branch 
     */
    public get hasChildren(): boolean {
      return this.checkbox.style.visibility != "hidden";
    }

    /**
     * Shows or hides the checkbox for expanding the subsequent branch
     */
    public set hasChildren(_has: boolean) {
      this.checkbox.style.visibility = _has ? "visible" : "hidden";
    }

    /**
     * Returns true if the {@link CSS_CLASS.SELECTED} is attached to this item
     */
    public get selected(): boolean {
      return this.classList.contains(CSS_CLASS.SELECTED);
    }

    /**
     * Attaches or detaches the {@link CSS_CLASS.SELECTED} to this item
     */
    public set selected(_on: boolean) {
      if (_on)
        this.classList.add(CSS_CLASS.SELECTED);
      else
        this.classList.remove(CSS_CLASS.SELECTED);
    }

    /**
     * Returns the content representing the attached {@link data}
     */
    public get content(): HTMLFieldSetElement {
      return this.#content;
    }

    /**
     * Returns whether this item is expanded, showing it's children, or closed
     */
    public get expanded(): boolean {
      return this.getBranch() && this.checkbox.checked;
    }

    public refreshAttributes(): void {
      this.setAttribute("attributes", this.controller.getAttributes(this.data));
    }

    public refreshContent(): void {
      this.#content.innerHTML = "";
      this.#content.appendChild(this.controller.createContent(this.data));
      this.#content.disabled = true;
      for (const descendant of <NodeListOf<HTMLElement>>this.#content.querySelectorAll("[title]")) 
        this.title += descendant.title + "\n";
    }

    /**
     * Tries to expanding the {@link TreeList} of children, by dispatching {@link EVENT.EXPAND}.
     * The user of the tree needs to add an event listener to the tree 
     * in order to create that {@link TreeList} and add it as branch to this item
     */
    public expand(_expand: boolean): void {
      this.removeBranch();

      if (_expand)
        this.dispatchEvent(new Event(EVENT.EXPAND, { bubbles: true }));

      this.checkbox.checked = _expand;
      this.hasChildren = this.controller.hasChildren(this.data);
      // (<HTMLInputElement>this.querySelector("input[type='checkbox']")).checked = _expand;
    }

    /**
     * Returns a list of all data referenced by the items succeeding this
     */
    public getVisibleData(): T[] {
      let list: NodeListOf<HTMLLIElement> = this.querySelectorAll("li");
      let data: T[] = [];
      for (let item of list)
        data.push((<TreeItem<T>>item).data);
      return data;
    }

    /**
     * Sets the branch of children of this item. The branch must be a previously compiled {@link TreeList}
     */
    public setBranch(_branch: TreeList<T>): void {
      this.removeBranch();
      if (_branch)
        this.appendChild(_branch);
    }

    /**
     * Returns the branch of children of this item.
     */
    public getBranch(): TreeList<T> {
      return <TreeList<T>>this.querySelector("ul");
    }


    /**
     * Dispatches the {@link EVENT.SELECT} event
     * @param _additive For multiple selection (+Ctrl) 
     * @param _interval For selection over interval (+Shift)
     */
    public select(_additive: boolean, _interval: boolean = false): void {
      let event: CustomEvent = new CustomEvent(EVENT.SELECT, { bubbles: true, detail: { data: this.data, additive: _additive, interval: _interval } });
      this.dispatchEvent(event);
    }

    /**
     * Removes the branch of children from this item
     */
    private removeBranch(): void {
      let branch: TreeList<T> = this.getBranch();
      if (!branch)
        return;
      this.removeChild(branch);
    }

    private create(): void {
      this.checkbox = document.createElement("input");
      this.checkbox.type = "checkbox";
      this.appendChild(this.checkbox);
      this.#content = document.createElement("fieldset");
      this.appendChild(this.#content);
      this.refreshContent();
      this.refreshAttributes();
      this.tabIndex = 0;
    }

    private hndFocus = (_event: FocusEvent): void => {
      _event.stopPropagation();

      if (_event.target == this.checkbox)
        return;

      if (_event.target == this)
        return;

      this.#content.disabled = true;
    };

    private hndKey = (_event: KeyboardEvent): void => {
      _event.stopPropagation();

      if (!this.#content.disabled) {
        if (_event.code == ƒ.KEYBOARD_CODE.ESC || _event.code == ƒ.KEYBOARD_CODE.ENTER)
          this.focus();

        return;
      }

      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
          if (this.hasChildren && !this.expanded)
            this.expand(true);
          else
            this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.ARROW_LEFT:
          if (this.expanded)
            this.expand(false);
          else
            this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_PREVIOUS, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.ARROW_DOWN:
          this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.ARROW_UP:
          this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_PREVIOUS, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.F2:
          const element: HTMLElement = <HTMLElement>this.#content.elements.item(0);
          if (!element)
            break;

          this.#content.disabled = false;
          element.focus();
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

    private hndDblClick = (_event: MouseEvent): void => {
      _event.stopPropagation();
      if (_event.target == this.checkbox)
        return;

      this.#content.disabled = false;
      const element: HTMLElement = <HTMLElement>document.elementFromPoint(_event.pageX, _event.pageY); // disabled elements don't dispatch click events, get the element manually
      if (!element)
        return;

      element.focus();
    };

    private hndChange = async (_event: Event): Promise<void> => {
      let target: HTMLInputElement | HTMLSelectElement = <HTMLInputElement | HTMLSelectElement>_event.target;
      _event.stopPropagation();

      if (target instanceof HTMLInputElement && target.type == "checkbox") {
        this.expand(target.checked);
        return;
      }

      let renamed: boolean = await this.controller.setValue(this.data, target);

      this.refreshContent();
      this.refreshAttributes();

      if (renamed)
        this.dispatchEvent(new CustomEvent(EVENT.RENAME, { bubbles: true, detail: { data: this.data } }));
    };

    private hndDragDrop = (_event: DragEvent): void => {
      // if (_event.type == EVENT.DROP)
      //   debugger;
      if (Reflect.get(_event, "item"))
        return;
      // store the dragged item in the event for further processing in table
      Reflect.set(_event, "item", this);
    };

    private hndDragOver = (_event: DragEvent): void => {
      if (Reflect.get(_event, "dragProcessed"))
        return;

      let rect: DOMRect = this.#content.getBoundingClientRect();
      let upper: number = rect.top + rect.height * (1 / 4);
      let lower: number = rect.top + rect.height * (3 / 4);
      let offset: number = _event.clientY;
      if (this.parentElement instanceof Tree || (offset > upper && (offset < lower || this.checkbox.checked)) || !this.controller.sortable) {
        Reflect.set(_event, "dragProcessed", true);
        if (_event.type == EVENT.DRAG_OVER)
          this.controller.dragDropIndicator.remove();
        if (this.controller.canAddChildren(Clipboard.dragDrop.get(), this.data)) {
          _event.preventDefault();
          _event.dataTransfer.dropEffect = "move";
        }
      }
    };

    private hndPointerUp = (_event: PointerEvent): void => {
      _event.stopPropagation();
      if (_event.target == this.checkbox)
        return;
      this.select(_event.ctrlKey, _event.shiftKey);
    };

    private hndRemove = (_event: Event): void => {
      // the views might need to know about this event
      // if (_event.currentTarget == _event.target)
      //   return;
      // _event.stopPropagation();
      this.hasChildren = this.controller.hasChildren(this.data);
    };
  }

  customElements.define("li-tree-item", TreeItem, { extends: "li" });
}