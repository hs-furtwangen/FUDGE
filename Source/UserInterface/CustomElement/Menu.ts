namespace FudgeUserInterface {

  let idCounter: number = 0;

  export class Menu extends HTMLDivElement {
    public btnToggle: HTMLButtonElement;
    public list: HTMLMenuElement;

    public constructor(_title: string, ..._items: HTMLElement[]) {
      super();
      this.classList.add("menu-container");

      this.btnToggle = document.createElement("button");
      this.btnToggle.classList.add("menu-toggle");
      this.btnToggle.innerText = _title;

      this.list = document.createElement("menu");
      this.list.classList.add("menu-list");
      this.list.setAttribute("popover", "auto");
      this.list.id = `menu-list-${idCounter++}`;

      this.btnToggle.setAttribute("popovertarget", this.list.id);

      if (_items.length > 0)
        this.setItems(..._items);

      this.append(this.btnToggle, this.list);
    }

    public get items(): HTMLCollection {
      return this.list.children;
    }

    public setItems(..._items: HTMLElement[]): void {
      this.list.innerHTML = "";

      for (const item of _items) 
        this.addItem(item);
    }

    public addItem(_item: HTMLElement): void {
      // _item.classList.add("menu-item");
      this.list.appendChild(_item);
    }

    public close(): void {
      this.list.hidePopover();
    }
  }

  customElements.define("ui-menu", Menu, { extends: "div" });
}
