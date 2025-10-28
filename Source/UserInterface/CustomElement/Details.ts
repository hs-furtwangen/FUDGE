namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  export class Details extends HTMLDetailsElement {
    public content: HTMLDivElement;

    public constructor(_legend: string = "", _type: string) {
      super();
      // TODO: check if this should be removed after changing animation structure to look more like a mutator
      this.setAttribute("key", _legend);
      this.setAttribute("label", _legend);
      this.setAttribute("type", _type);
      this.open = true;
      let lblSummary: HTMLElement = document.createElement("summary");
      lblSummary.textContent = _legend;
      this.appendChild(lblSummary);

      this.content = document.createElement("div");
      this.appendChild(this.content);

      this.tabIndex = 0;
      this.addEventListener(EVENT.KEY_DOWN, this.hndKey);
      this.addEventListener(EVENT.FOCUS_NEXT, this.hndFocus);
      this.addEventListener(EVENT.FOCUS_PREVIOUS, this.hndFocus);
      this.addEventListener(EVENT.FOCUS_SET, this.hndFocus);
      this.addEventListener(EVENT.TOGGLE, this.hndToggle);
    }

    public get isExpanded(): boolean {
      // return this.expander.checked;
      return this.open;
    }

    public setContent(_content: HTMLDivElement): void {
      for (let child of _content.children as HTMLCollectionOf<HTMLElement>)
        this.addPropertyMenu(child);

      this.replaceChild(_content, this.content);
      this.content = _content;
    }

    public expand(_expand: boolean): void {
      // this.expander.checked = _expand;
      this.open = _expand;
      this.hndToggle(null);
    }

    private hndToggle = (_event: Event): void => {
      if (_event)
        _event.stopPropagation();
      this.dispatchEvent(new Event(this.isExpanded ? EVENT.EXPAND : EVENT.COLLAPSE, { bubbles: true }));
    };

    private hndFocus = (_event: Event): void => {
      switch (_event.type) {
        case EVENT.FOCUS_NEXT:
          let next: HTMLElement = <HTMLElement>this.nextElementSibling;
          if (next && next.tabIndex > -1) {
            next.focus();
            _event.stopPropagation();
          }
          break;
        case EVENT.FOCUS_PREVIOUS:
          let previous: HTMLElement = <HTMLElement>this.previousElementSibling;
          if (previous && previous.tabIndex > -1) {
            let sets: NodeListOf<HTMLDetailsElement> = previous.querySelectorAll("details");
            let i: number = sets.length;
            if (i)
              do { // focus the last visible set
                sets[--i].focus();
              } while (!sets[i].offsetParent);
            else
              previous.focus();


            _event.stopPropagation();
          }
          break;
        case EVENT.FOCUS_SET:
          if (_event.target != this) {
            this.focus();
            _event.stopPropagation();
          }
          break;
      }
    };

    private hndKey = (_event: KeyboardEvent): void => {
      let passEvent: boolean = false;
      // let target: HTMLElement = <HTMLElement>_event.target;

      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.DELETE:
          passEvent = true;
          break;
        case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
          if (!this.isExpanded) {
            this.expand(true);
            break;
          }
        case ƒ.KEYBOARD_CODE.ARROW_DOWN:
          let next: HTMLElement = this;
          if (this.isExpanded)
            next = this.querySelector("details");
          else
            do {
              next = <HTMLElement>next.nextElementSibling;
            } while (next && next.tabIndex > -1);

          if (next)
            next.focus();
          // next.dispatchEvent(new KeyboardEvent(EVENT_TREE.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          else
            this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
        case ƒ.KEYBOARD_CODE.ARROW_LEFT:
          if (this.isExpanded) {
            this.expand(false);
            break;
          }
        case ƒ.KEYBOARD_CODE.ARROW_UP:
          let previous: HTMLElement = this;
          do {
            previous = <HTMLElement>previous.previousElementSibling;
          } while (previous && !(previous instanceof Details));

          if (previous)
            if ((<Details>previous).isExpanded)
              this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_PREVIOUS, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
            else
              previous.focus();
          else
            this.parentElement.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_SET, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
          break;
      }

      if (!passEvent)
        _event.stopPropagation();
    };

    private addPropertyMenu(_item: HTMLElement): void {
      const type: string = _item.getAttribute("type");

      const btnCreate: HTMLButtonElement = document.createElement("button");
      btnCreate.classList.add("menu-item", "icon", "construct", "before");
      btnCreate.innerText = "New...";
      btnCreate.title = `Create a new ${type}`;

      const menuCreate: Menu = new Menu("New...");
      menuCreate.btnToggle.classList.add("menu-item", "icon", "construct", "before");
      menuCreate.btnToggle.title = `Create a new ${type}`;

      const menuAssign: Menu = new Menu("Assign...")
      menuAssign.btnToggle.classList.add("menu-item", "icon", "assign", "before");
      menuAssign.btnToggle.title = `Assign an existing ${type}`;
      menuAssign.hidden = !_item.hasAttribute("assignable");

      const btnClear: HTMLButtonElement = document.createElement("button");
      btnClear.classList.add("menu-item", "icon", "clear", "before");
      btnClear.innerText = "Clear";
      btnClear.title = `Set to <undefined>`;

      const menu: Menu = new Menu("", _item.hasAttribute("creatable") ? menuCreate : btnCreate, menuAssign, btnClear);
      menu.classList.add("property-menu");
      menu.btnToggle.classList.add("btn-subtle", "icon", "actions", "before");

      _item.prepend(menu);
      _item.classList.add("property", "property-anchor");

      const selectCreate: CustomElementComboSelect = new CustomElementComboSelect({ key: "", type: type, action: "create", placeholder: `🔍︎ Select type...` });
      selectCreate.removeAttribute("key");
      menuCreate.addItem(selectCreate);

      const selectAssign: CustomElementComboSelect = new CustomElementComboSelect({ key: "", type: type, action: "assign", placeholder: `🔍︎ Select instance...` });
      selectAssign.removeAttribute("key");
      menuAssign.addItem(selectAssign);

      btnClear.addEventListener(EVENT.CLICK, _event => {
        _item.dispatchEvent(new CustomEvent(EVENT.SET_VALUE, { bubbles: true, detail: { value: undefined } }));
        menu.close();
      });

      btnCreate.addEventListener(EVENT.CLICK, _event => {
        _item.dispatchEvent(new Event(EVENT.INITIALIZE_VALUE, { bubbles: true }));
        menu.close();
      });

    }
  }

  customElements.define("ui-details", Details, { extends: "details" });
}
