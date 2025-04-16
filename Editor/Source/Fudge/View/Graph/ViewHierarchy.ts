namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * View the hierarchy of a graph as tree-control
   * @author Jirka Dell'Oro-Friedl, HFU, 2020  
   */
  export class ViewHierarchy extends View {
    private graph: ƒ.Graph;
    private tree: ƒui.Tree<ƒ.Node>;
    private selectionPrevious: ƒ.Node[] = [];

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);

      this.setGraph(null);

      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.CLOSE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.UPDATE, this.hndEvent);
      this.dom.addEventListener("keyup", this.hndKeyboardEvent);
      this.dom.tabIndex = 0;

      // a select event will be recived from the panel during reconstruction so we only need to prepare our storage here
      if (_state["graph"] && _state["expanded"] && !this.restoreExpanded(_state["graph"]))
        this.storeExpanded(_state["graph"], _state["expanded"]);
    }

    private get selection(): ƒ.Node[] {
      return this.tree.controller.selection;
    }

    public setGraph(_graph: ƒ.Graph): void {
      if (!_graph) {
        this.graph = undefined;
        this.dom.innerHTML = "";
        return;
      }

      if (this.graph && this.tree)
        this.dom.removeChild(this.tree);
      this.dom.innerHTML = "";

      if (this.graph) {
        this.storeExpanded(this.graph.idResource, this.getExpanded());
        this.graph.removeEventListener(ƒ.EVENT.CHILD_APPEND, this.hndEvent);
        this.graph.removeEventListener(ƒ.EVENT.CHILD_REMOVE, this.hndEvent);
      }

      this.graph = _graph;
      this.graph.addEventListener(ƒ.EVENT.CHILD_APPEND, this.hndEvent);
      this.graph.addEventListener(ƒ.EVENT.CHILD_REMOVE, this.hndEvent);
      // this.selectedNode = null;

      this.tree = new ƒui.Tree<ƒ.Node>(new ControllerTreeHierarchy(), this.graph);
      // this.tree.addEventListener(ƒui.EVENT.FOCUS_OUT, this.hndTreeEvent);
      this.tree.addEventListener(ƒui.EVENT.SELECT, this.hndTreeEvent);
      this.tree.addEventListener(ƒui.EVENT.DELETE, this.hndTreeEvent);
      this.tree.addEventListener(ƒui.EVENT.RENAME, this.hndTreeEvent);
      this.tree.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);
      this.dom.append(this.tree);
      this.dom.title = "● Right click on existing node to create child node.\n● Use Copy/Paste to duplicate nodes.";
      this.tree.title = "Select node to edit or duplicate.";

      let expanded: string[] = this.restoreExpanded(this.graph.idResource);
      if (expanded)
        this.expand(expanded);
    }

    //#region  ContextMenu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let item: Electron.MenuItem;

      item = new remote.MenuItem({ label: "Add Node", id: String(CONTEXTMENU.ADD_NODE), click: _callback, accelerator: "Insert" });
      menu.append(item);
      item = new remote.MenuItem({ label: "De- / Acvtivate", id: String(CONTEXTMENU.ACTIVATE_NODE), click: _callback, accelerator: "Backspace" });
      menu.append(item);
      item = new remote.MenuItem({ label: "Delete", id: String(CONTEXTMENU.DELETE_NODE), click: _callback, accelerator: "Delete" });
      menu.append(item);
      return menu;
    }

    protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
      ƒ.Debug.fudge(`MenuSelect: Item-id=${CONTEXTMENU[_item.id]}`);
      let focus: ƒ.Node = this.tree.getFocussed();
      if (!focus)
        return;

      switch (Number(_item.id)) {
        case CONTEXTMENU.ADD_NODE:
          let instance: ƒ.GraphInstance = inGraphInstance(focus, false);
          if (instance) {
            ƒui.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `To add nodes, edit the graph "${instance.name}", then save and reload the project<br>Press OK to continue`, "OK", "");
            return;
          }
          let child: ƒ.Node = new ƒ.Node("New Node");
          this.tree.addChildren([child], focus);
          this.tree.findVisible(child).focus();
          this.tree.selectInterval(child, child);
          break;
        case CONTEXTMENU.ACTIVATE_NODE:
          focus.activate(!focus.isActive);
          this.tree.findVisible(focus).refreshAttributes();
          this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
          break;
        case CONTEXTMENU.DELETE_NODE:
          // focus.addChild(child);
          this.tree.controller.delete([focus]).then(_deleted => {
            if (_deleted.length == 0)
              return;
            this.tree.delete([focus]);
            ƒ.Physics.activeInstance = Page.getPhysics(this.graph);
            ƒ.Physics.cleanup();
            this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
          });
          break;
      }
    }
    //#endregion

    protected getState(): ViewState {
      let state: ViewState = super.getState();
      state["expanded"] = this.getExpanded();
      return state;
    }

    //#region EventHandlers
    private hndTreeEvent = (_event: CustomEvent): void => {
      let node: ƒ.Node = _event.detail?.data;
      switch (_event.type) {
        case ƒui.EVENT.DELETE:
          this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
          break;
        case ƒui.EVENT.RENAME:
          if (_event.detail.data instanceof ƒ.Graph) {
            this.dispatch(EVENT_EDITOR.UPDATE, { bubbles: true });
          }
          break;
        case ƒui.EVENT.SELECT:
          //only dispatch the event to focus the node, if the node is in the current and the previous selection 
          if (this.selectionPrevious.includes(node) && this.selection.includes(node))
            this.dispatch(EVENT_EDITOR.FOCUS, { bubbles: true, detail: { node: node, view: this } });
          this.selectionPrevious = this.selection.slice(0);
          this.dispatchToParent(EVENT_EDITOR.SELECT, { detail: { node: node, view: this } });
          break;
      }
    };

    private hndKeyboardEvent = async (_event: KeyboardEvent): Promise<void> => {
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.A:
          if (_event.ctrlKey) {
            this.tree.clearSelection();
            this.tree.selectAll();
          }
          break;
        case ƒ.KEYBOARD_CODE.DELETE:
          // this.tree.delete(await this.tree.controller.delete(null));
          // this.contextMenu.getMenuItemById(String(CONTEXTMENU.DELETE_NODE)).click();
          break;
        case ƒ.KEYBOARD_CODE.INSERT:
          this.contextMenu.getMenuItemById(String(CONTEXTMENU.ADD_NODE)).click();
          break;
        case ƒ.KEYBOARD_CODE.BACKSPACE:
          this.contextMenu.getMenuItemById(String(CONTEXTMENU.ACTIVATE_NODE)).click();
          break;
      }
    };

    private hndEvent = (_event: EditorEvent): void => {
      switch (_event.type) {
        case ƒ.EVENT.CHILD_APPEND:
          History.save(HISTORY.ADD, (<ƒ.Node>_event.target).getParent(), _event.target);
          break;
        case ƒ.EVENT.CHILD_REMOVE:
          History.save(HISTORY.REMOVE, (<ƒ.Node>_event.target).getParent(), _event.target);
          break;
        case EVENT_EDITOR.SELECT:
          if (_event.detail.graph)
            this.setGraph(_event.detail.graph);
          if (_event.detail.node) {
            let path: ƒ.Node[] = _event.detail.node.getPath();
            path = path.slice(path.findIndex((_node => _node instanceof ƒ.Graph)));
            this.tree.show(path);
            this.tree.controller.selection = [_event.detail.node];
            this.tree.displaySelection(this.tree.controller.selection);
            this.selectionPrevious = this.selection.slice(0);
          }
          break;
        case EVENT_EDITOR.UPDATE:
          if (_event.detail.view instanceof ViewInternal || _event.detail.sender instanceof PanelGraph) {
            this.setGraph(this.graph);
            this.tree.controller.selection = this.selectionPrevious;
            this.tree.displaySelection(this.selectionPrevious);
          }
          break;
        case EVENT_EDITOR.CLOSE:
          if (this.graph)
            this.storeExpanded(this.graph.idResource, this.getExpanded());
      }
    };
    //#endregion

    private storeExpanded(_idGraph: string, _expanded: string[]): void {
      sessionStorage.setItem(`${this.id}_${_idGraph}`, JSON.stringify(_expanded));
    }

    private restoreExpanded(_idGraph: string): string[] {
      let stored: string = sessionStorage.getItem(`${this.id}_${_idGraph}`);
      return stored && JSON.parse(stored);
    }

    private getExpanded(): string[] {
      return this.tree?.getExpanded().map(_item => ƒ.Node.PATH_FROM_TO(this.graph, _item.data));
    }

    private expand(_paths: string[]): void {
      const paths: ƒ.Node[][] = _paths
        .map(_path => ƒ.Node.FIND<ƒ.Node>(this.graph, _path))
        .filter(_node => _node)
        .map(_node => _node.getPath());

      this.tree?.expand(paths);
    }
  }
}
