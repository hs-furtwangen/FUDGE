namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * The view's state. During reconstruction, views receive a merged state object that combines the states of both their panel and the view itself.
   * Ensure unique property names to avoid conflicts.
   */
  export type ViewState = ƒ.Serialization;

  type Views = { [id: string]: View };
  /**
   * Base class for all [[View]]s to support generic functionality
   * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020-24
   */
  export abstract class View {
    private static views: Views = {};
    private static idCount: number = 0;

    public dom: HTMLElement;
    protected contextMenu: Electron.Menu;
    #container: ComponentContainer;
    #id: number;

    public constructor(_container: ComponentContainer, _state: ViewState) {
      this.dom = document.createElement("div");
      this.dom.style.height = "100%";
      this.dom.setAttribute("view", this.constructor.name);

      this.#container = _container;
      this.#container.element.appendChild(this.dom);
      this.#container.stateRequestEvent = this.getState.bind(this);
      this.#container.on("destroy", () => {
        delete View.views[this.#id];
        this.dispatch(EVENT_EDITOR.CLOSE, { bubbles: true });
      });

      this.contextMenu = this.getContextMenu(this.contextMenuCallback.bind(this));
      this.#id = View.registerViewForDragDrop(this);
    }

    // get the source view of a drag and drop event
    public static getViewSource(_event: DragEvent): View {
      if (_event.dataTransfer)
        for (let item of _event.dataTransfer.items)
          if (item.type.startsWith("sourceview"))
            return View.views[item.type.split(":").pop()];
      return null;
    }

    // register the view as a source for drag and drop events to later allow or disallow drop
    private static registerViewForDragDrop(_this: View): number {
      View.views[View.idCount] = _this;

      // when drag starts, add identifier to the event in a way that allows dragover to process the source
      _this.dom.addEventListener(ƒui.EVENT.DRAG_START, (_event: DragEvent) => {
        _event.stopPropagation();
        _event.dataTransfer.setData("SourceView:" + _this.#id.toString(), "typesHack");
      });

      return View.idCount++;
    }

    protected get id(): string {
      return `${this.#id}_${this.constructor.name}`;
    }

    public setTitle(_title: string): void {
      this.#container.setTitle(_title);
    }

    /**
     * Dispatch an event to the dom of this view and add a reference to this view in detail if not yet existend in _init
     */
    public dispatch(_type: EVENT_EDITOR, _init: CustomEventInit<EventDetail>): void {
      _init.detail = _init.detail || {};
      _init.detail.view = _init.detail.view || this;
      this.dom.dispatchEvent(new EditorEvent(_type, _init));
    }

    /**
     * Like {@link dispatch}, but to the parent element of this view's dom and enable bubbling
     */
    public dispatchToParent(_type: EVENT_EDITOR, _init: CustomEventInit<EventDetail>): void {
      _init.detail = _init.detail || {};
      _init.bubbles = true;
      _init.detail.view = _init.detail.view || this;
      this.dom.parentElement.dispatchEvent(new EditorEvent(_type, _init));
    }

    //#region  ContextMenu
    protected openContextMenu = (_event: Event): void => {
      this.contextMenu.popup();
    };

    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      // ContextMenu.appendCopyPaste(menu);
      return menu;
    }

    protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
      ƒ.Debug.info(`ContextMenu: Item-id=${CONTEXTMENU[_item.id]}`);
    }
    //#endregion

    //#region Events
    protected getState(): ViewState {
      return {};
    }

    //#endregion

  }
}