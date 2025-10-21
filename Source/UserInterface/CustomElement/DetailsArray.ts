namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  export class DetailsArray extends Details {
    public input: CustomElementNumber;
    public button: HTMLButtonElement;

    private drag: HTMLElement;
    private dragDropIndicator: HTMLHRElement;

    public constructor(_legend: string) {
      super(_legend, "Array");

      this.input = new CustomElementNumber({ key: "length", label: "length", value: "0", min: "0", step: "1" });
      this.input.addEventListener(EVENT.CHANGE, this.hndChangeInput);
      this.querySelector("summary").after(this.input);

      this.dragDropIndicator = document.createElement("hr");
      this.dragDropIndicator.addEventListener(EVENT.DRAG_ENTER, this.hndDragOver);
      this.dragDropIndicator.addEventListener(EVENT.DRAG_OVER, this.hndDragOver);
      this.dragDropIndicator.addEventListener(EVENT.DROP, this.hndDrop);

      this.addEventListener(EVENT.DRAG_LEAVE, this.hndDragLeave);
    }

    public setContent(_content: HTMLDivElement): void {
      super.setContent(_content);
      for (let child of this.content.children as HTMLCollectionOf<HTMLElement>)
        this.addEventListeners(child);

      if (this.input.isInitialized)
        this.input.setMutatorValue(this.content.children.length);
      else
        this.input.setAttribute("value", this.content.children.length.toString());
    }

    private addEventListeners(_child: HTMLElement): void {
      _child.draggable = true;
      _child.addEventListener(EVENT.DRAG_START, this.hndDragStart);
      _child.addEventListener(EVENT.DRAG_END, this.hndDragEnd);
      _child.addEventListener(EVENT.DRAG_ENTER, this.hndDragOver);
      _child.addEventListener(EVENT.DRAG_OVER, this.hndDragOver);
      _child.addEventListener(EVENT.DROP, this.hndDrop);
      _child.addEventListener(EVENT.KEY_DOWN, this.hndKeySpecial);
      _child.tabIndex = 0;
    }

    private rearrange(_focus: number = undefined): void {
      const sequence: number[] = new Array(this.content.children.length);
      for (let i: number = 0; i < sequence.length; i++) {
        const index: number = parseInt(this.content.children.item(i).getAttribute("key"));
        sequence[i] = isNaN(index) ? undefined : index;
      }

      this.setFocus(_focus);
      this.dispatchEvent(new CustomEvent(EVENT.REARRANGE_ARRAY, { bubbles: true, detail: { sequence: sequence } }));

      let count: number = 0;
      for (let child of this.content.children as HTMLCollectionOf<CustomElement>) {
        child.setAttribute("label", count.toString());
        child.setAttribute("key", count.toString());
        if (child.setLabel)
          child.setLabel(count.toString());
        ƒ.Debug.fudge(child.tabIndex);
        count++;
      }

      this.dispatchEvent(new Event(EVENT.MUTATE, { bubbles: true }));
    }

    private setFocus(_focus: number = undefined): void {
      if (_focus == undefined)
        return;

      _focus = ƒ.Calc.clamp(_focus, 0, this.content.children.length - 1);

      let child: HTMLElement = <HTMLElement>this.content.children[_focus];
      child?.focus();
    }

    private hndDragStart = (_event: DragEvent): void => {
      this.drag = <HTMLElement>_event.target;
    };

    private hndDragEnd = (_event: DragEvent): void => {
      this.drag = null;
      this.dragDropIndicator.remove();
    };

    private hndDragOver = (_event: DragEvent): void => {
      if (!this.drag)
        return;

      if (this.drag.parentElement != (<HTMLElement>_event.currentTarget).parentElement)
        return;

      let over: HTMLElement = <HTMLElement>_event.currentTarget;

      if (over != this.dragDropIndicator) {
        let rect: DOMRect = over.getBoundingClientRect();
        let addBefore: boolean = _event.clientY < rect.top + rect.height / 2;
        let sibling: Element = addBefore ? over.previousElementSibling : over.nextElementSibling;
        if (sibling != this.dragDropIndicator)
          if (addBefore)
            over.before(this.dragDropIndicator);
          else
            over.after(this.dragDropIndicator);
      }

      _event.preventDefault();
      _event.dataTransfer.dropEffect = "move";
      if (_event.ctrlKey)
        _event.dataTransfer.dropEffect = "copy";
    };

    private hndDrop = (_event: DragEvent): void => {
      if (!this.drag)
        return;

      if (this.drag.parentElement != (<HTMLElement>_event.currentTarget).parentElement)
        return;

      _event.stopPropagation();

      let drag: HTMLElement;
      if (_event.ctrlKey) {
        this.dragDropIndicator.after(drag = <HTMLElement>this.drag.cloneNode(true));
        drag.setAttribute("key", "-" + drag.getAttribute("key"));
      } else if (this.drag.previousSibling != this.dragDropIndicator && this.drag.nextSibling != this.dragDropIndicator) {
        this.dragDropIndicator.after(drag = this.drag);
      }

      this.dragDropIndicator.remove();

      if (drag) {
        this.rearrange();
        drag.focus();
      }
    };

    private hndDragLeave = (_event: DragEvent): void => {
      if (this.content.contains(<Node>_event.relatedTarget))
        return;

      this.dragDropIndicator.remove();
    };

    private hndChangeInput = (_event: Event): void => {
      const children: HTMLElement[] = <HTMLElement[]>Array.from(this.content.children);
      const sequence: number[] = children.map((_value, _index) => _index);

      const length: number = this.input.value;
      sequence.length = length;
      for (let i: number = children.length; i < length; i++)
        sequence[i] = null;

      this.dispatchEvent(new CustomEvent(EVENT.REARRANGE_ARRAY, { bubbles: true, detail: { sequence: sequence } }));
    };

    private hndKeySpecial = (_event: KeyboardEvent): void => {
      let item: HTMLElement = <HTMLElement>_event.currentTarget;

      // only work on items of list, not their children
      if ((<HTMLElement>_event.target) != item && _event.code != ƒ.KEYBOARD_CODE.DELETE)
        return;

      let focus: number = parseInt(item.getAttribute("label"));
      let sibling: HTMLElement;
      let insert: HTMLElement = item;

      let stopEvent: boolean = true;

      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.INSERT:
          insert = <HTMLElement>item.cloneNode(true);
          insert.setAttribute("key", "-" + insert.getAttribute("key"));

          item.after(insert);
          this.rearrange(++focus);
          break;
        case ƒ.KEYBOARD_CODE.DELETE:
          item.remove();
          this.rearrange(focus);
          break;
        case ƒ.KEYBOARD_CODE.ARROW_UP:
          if (!_event.altKey) {
            this.setFocus(--focus);
            break;
          }

          if (_event.shiftKey) {
            insert = <HTMLElement>item.cloneNode(true);
            insert.setAttribute("key", "-" + insert.getAttribute("key"));
            sibling = item;
          } else {
            sibling = <HTMLElement>item.previousSibling;
            focus--;
          }

          if (sibling) {
            sibling.before(insert);
            this.rearrange(focus);
          }

          break;
        case ƒ.KEYBOARD_CODE.ARROW_DOWN:
          if (!_event.altKey) {
            this.setFocus(++focus);
            break;
          }

          if (_event.shiftKey) {
            insert = <HTMLElement>item.cloneNode(true);
            insert.setAttribute("key", "-" + insert.getAttribute("key"));
            sibling = item;
          } else {
            sibling = <HTMLElement>item.nextSibling;
          }

          if (sibling) {
            sibling.after(insert);
            this.rearrange(++focus);
          }

          break;
        default:
          stopEvent = false;
      }

      if (stopEvent)
        _event.stopPropagation();

    };
  }

  customElements.define("ui-list", DetailsArray, { extends: "details" });
}