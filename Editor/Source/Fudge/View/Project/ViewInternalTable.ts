namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export let typesOfResources: ƒ.General[] = [
    ƒ.Mesh
  ];

  /**
   * List the internal resources
   * @author Jirka Dell'Oro-Friedl, HFU, 2020  
   */
  export class ViewInternalTable extends ViewInternal {
    private table: ƒui.Table<ƒ.SerializableResource>;

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);

      this.dom.addEventListener(EVENT_EDITOR.OPEN, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.CREATE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.UPDATE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.DELETE, this.hndEvent);

      this.dom.addEventListener(ƒui.EVENT.MUTATE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.SELECT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.REMOVE_CHILD, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.RENAME, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);

      this.dom.addEventListener(ƒui.EVENT.CUT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.PASTE, this.hndEvent);

      this.dom.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOver);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDrop);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndEvent);

      this.dom.addEventListener("keyup", this.hndKeyboardEvent);
      this.dom.tabIndex = 0;
    }

    public listResources(): void {
      while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild));
      this.table = new ƒui.Table<ƒ.SerializableResource>(new ControllerTableResource(), Object.values(ƒ.Project.resources), "type");
      this.dom.appendChild(this.table);
      this.dom.title = "● Right click to create new resource.\n● Select or drag resource.";
      this.table.title = "● Select to edit in \"Properties\"\n●  Drag to \"Properties\" or \"Components\" to use if applicable.";

      for (let tr of this.table.querySelectorAll("tr")) {
        let tds: NodeListOf<HTMLTableCellElement> = tr.querySelectorAll("td");
        if (!tds.length)
          continue;
        tds[1].classList.add("icon");
        tds[1].setAttribute("icon", (<HTMLInputElement>tds[1].children[0]).value);
        if (tr instanceof ƒui.TableItem && (<ƒ.SerializableResourceExternal>tr.data).status == ƒ.RESOURCE_STATUS.ERROR) {
          tr.classList.add("error");
          tr.title = "Failed to load resource from file check the console for details.";
          break;
        }
      }
    }

    // TODO: this is a preparation for syncing a graph with its instances after structural changes
    // protected openContextMenu = (_event: Event): void => {
    //   let row: HTMLTableRowElement = <HTMLTableRowElement>_event.composedPath().find((_element) => (<HTMLElement>_element).tagName == "TR");
    //   if (row)
    //     this.contextMenu.getMenuItemById(String(CONTEXTMENU.SYNC_INSTANCES)).enabled = (row.getAttribute("icon") == "Graph");
    //   this.contextMenu.popup();
    // }

    // #region  ContextMenu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let item: Electron.MenuItem;


      item = new remote.MenuItem({ label: "Create Graph", id: String(CONTEXTMENU.CREATE_GRAPH), click: _callback, accelerator: "G" });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Mesh",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_MESH, ƒ.Mesh, _callback)
      });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Material",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_MATERIAL, ƒ.Shader, _callback)
      });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Animation",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_ANIMATION, ƒ.Animation, _callback)
      });
      menu.append(item);


      // item = new remote.MenuItem({ label: `Create ${ƒ.Animation.name}`, id: String(CONTEXTMENU.CREATE_ANIMATION), click: _callback });
      // menu.append(item);

      // item = new remote.MenuItem({ label: `Create ${ƒ.AnimationSprite.name}`, id: String(CONTEXTMENU.CREATE_ANIMATION), click: _callback });
      // menu.append(item);

      item = new remote.MenuItem({ label: `Create ${ƒ.ParticleSystem.name}`, id: String(CONTEXTMENU.CREATE_PARTICLE_EFFECT), click: _callback });
      menu.append(item);

      item = new remote.MenuItem({ label: "Delete Resource", id: String(CONTEXTMENU.DELETE_RESOURCE), click: _callback, accelerator: "Delete" });
      menu.append(item);

      // item = new remote.MenuItem({ label: "Sync Instances", id: String(CONTEXTMENU.SYNC_INSTANCES), click: _callback, accelerator: "S" });
      // menu.append(item);

      item = new remote.MenuItem({ label: "Clone", id: String(CONTEXTMENU.CLONE_RESOURCE), click: _callback, accelerator: "Insert" });
      menu.append(item);

      // ContextMenu.appendCopyPaste(menu);
      return menu;
    }

    protected async contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): Promise<void> {
      let choice: CONTEXTMENU = Number(_item.id);
      ƒ.Debug.fudge(`MenuSelect | id: ${CONTEXTMENU[_item.id]} | event: ${_event}`);
      let iSubclass: number = _item["iSubclass"];
      if (!iSubclass && (choice == CONTEXTMENU.CREATE_MESH || choice == CONTEXTMENU.CREATE_MATERIAL)) {
        alert("Funky Electron-Error... please try again");
        return;
      }

      let newResource: ƒ.SerializableResource = null;
      switch (choice) {
        case CONTEXTMENU.DELETE_RESOURCE:
          await this.table.controller.delete([this.table.getFocussed()]);
          this.dispatch(EVENT_EDITOR.DELETE, { bubbles: true });
          return;
        case CONTEXTMENU.CLONE_RESOURCE:
          let clone: ƒ.SerializableResource = await ƒ.Project.cloneResource(this.table.getFocussed());
          History.save(HISTORY.ADD, ƒ.Project, clone);
          this.dispatch(EVENT_EDITOR.CREATE, { bubbles: true });
          return;
        //TODO: dispatch CREATE instead of MODIFY!
        case CONTEXTMENU.CREATE_MESH:
          let typeMesh: typeof ƒ.Mesh = ƒ.Mesh.subclasses[iSubclass];
          //@ts-ignore
          newResource = new typeMesh();
          break;
        case CONTEXTMENU.CREATE_MATERIAL:
          let typeShader: typeof ƒ.Shader = ƒ.Shader.subclasses[iSubclass];
          newResource = new ƒ.Material(typeShader.name, typeShader);
          break;
        case CONTEXTMENU.CREATE_GRAPH:
          newResource = await ƒ.Project.registerAsGraph(new ƒ.Node("NewGraph"));
          break;
        case CONTEXTMENU.CREATE_ANIMATION:
          let typeAnimation: typeof ƒ.Animation = ƒ.Animation.subclasses[iSubclass];
          newResource = new typeAnimation();
          break;
        case CONTEXTMENU.CREATE_PARTICLE_EFFECT:
          newResource = new ƒ.ParticleSystem();
          break;
      }

      History.save(HISTORY.ADD, ƒ.Project, newResource);
      this.dispatch(EVENT_EDITOR.CREATE, { bubbles: true });
      this.table.selectInterval(newResource, newResource);
    }
    //#endregion

    protected hndDragOver = (_event: DragEvent): void => {
      let viewSource: View = View.getViewSource(_event);

      if (this.dom != _event.target) {
        _event.dataTransfer.dropEffect = "none";
        return;
      }

      if (viewSource instanceof ViewInternal) {
        _event.dataTransfer.dropEffect = this.table.controller.dragOver(_event);

      } else if (viewSource instanceof ViewExternal) {
        let sources: DirectoryEntry[] = ƒui.Clipboard.dragDrop.get();
        if (sources.some(_source => ![MIME.AUDIO, MIME.IMAGE, MIME.MESH, MIME.GLTF].includes(_source.getMimeType())))
          return;
        _event.dataTransfer.dropEffect = "link";

      } else if (viewSource instanceof ViewHierarchy) {
        let items: ƒ.Node[] = ƒui.Clipboard.dragDrop.get();
        if (items.find(_item => _item instanceof ƒ.GraphInstance))
          return;
        _event.dataTransfer.dropEffect = "link";

      } else {
        _event.dataTransfer.dropEffect = "none";
        return;
      }

      _event.preventDefault();
      _event.stopPropagation();
    };

    protected hndDrop = async (_event: DragEvent): Promise<void> => {
      let viewSource: View = View.getViewSource(_event);

      let newResources: ƒ.SerializableResource[] = [];

      if (viewSource instanceof ViewInternal) {
        let dropEffect: ƒui.DROPEFFECT = this.table.controller.dragOver(_event);
        if (dropEffect == "copy") {
          newResources = await this.table.controller.clone(ƒui.Clipboard.dragDrop.get());
        }
      }
      if (viewSource instanceof ViewHierarchy) {
        let sources: ƒ.Node[] = ƒui.Clipboard.dragDrop.get();
        for (let source of sources) {
          if (!(source instanceof ƒ.GraphInstance)) {
            let newResource: ƒ.Graph = await ƒ.Project.registerAsGraph(source, true);
            History.save(HISTORY.ADD, ƒ.Project, newResource);
            History.swap();
          }
        }
      } else if (viewSource instanceof ViewExternal) {
        let sources: DirectoryEntry[] = ƒui.Clipboard.dragDrop.get();
        for (let source of sources) {
          let newResource: ƒ.SerializableResource;
          switch (source.getMimeType()) {
            case MIME.AUDIO:
              newResource = new ƒ.Audio(source.pathRelative);
              break;
            case MIME.IMAGE:
              newResource = new ƒ.TextureImage(source.pathRelative);
              break;
            case MIME.MESH:
              newResource = await new ƒ.MeshOBJ().load(source.pathRelative);
              break;
            case
              MIME.GLTF:
              let loader: ƒ.GLTFLoader = await ƒ.GLTFLoader.LOAD(source.pathRelative);
              let load: boolean = await ƒui.Dialog.prompt(ViewInternal.gltfImportSettings, false, `Select what to import from '${loader.name}'`, "Adjust settings and press OK", "OK", "Cancel");
              if (!load)
                break;

              for (let type in ViewInternal.gltfImportSettings) if (ViewInternal.gltfImportSettings[type]) {
                let resources: ƒ.SerializableResource[] = await loader.loadResources(ƒ[type]);
                for (let resource of resources) {
                  if (!ƒ.Project.resources[resource.idResource]) {
                    ƒ.Project.register(resource);
                    newResource = resource;
                  }
                }
              }

              break;
          }
          newResources.push(newResource);
        }
      }
      newResources.forEach(_resource => History.save(HISTORY.ADD, ƒ.Project, _resource));


      this.dispatch(EVENT_EDITOR.CREATE, { bubbles: true });
      if (viewSource instanceof ViewHierarchy)
        // //@ts-ignore
        viewSource.dispatch(EVENT_EDITOR.UPDATE, { detail: { view: this } });
    };

    private hndKeyboardEvent = async (_event: KeyboardEvent): Promise<void> => {
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.INSERT:
          let clone: ƒ.SerializableResource = await ƒ.Project.cloneResource(this.table.getFocussed());
          History.save(HISTORY.ADD, ƒ.Project, clone);
          this.dispatch(EVENT_EDITOR.CREATE, { bubbles: true });
          break;
        case ƒ.KEYBOARD_CODE.F2:
          let input: HTMLInputElement = document.activeElement.querySelector("input");
          if (!input)
            return;
          input.readOnly = false;
          input.focus();
          break;
        case ƒ.KEYBOARD_CODE.A:
          if (_event.ctrlKey) {
            this.table.clearSelection();
            this.table.selectAll();
          }
          break;
        case ƒ.KEYBOARD_CODE.DELETE:
          // await this.table.controller.delete(null);
          // this.dom.dispatchEvent(new Event(ƒui.EVENT.REMOVE_CHILD, { bubbles: true }));
          break;
        case ƒ.KEYBOARD_CODE.G:
          if (!_event.ctrlKey && !(_event.target instanceof HTMLInputElement))
            this.contextMenu.getMenuItemById(String(CONTEXTMENU.CREATE_GRAPH)).click();
          break;
      }
    };

    private hndEvent = (_event: CustomEvent): void => {
      switch (_event.type) {
        case EVENT_EDITOR.OPEN:
        case EVENT_EDITOR.CREATE:
        case EVENT_EDITOR.UPDATE:
        case EVENT_EDITOR.DELETE:
          this.listResources();
      }

      if (_event.detail?.sender)
        return;

      switch (_event.type) {
        case ƒui.EVENT.MUTATE:
          _event.stopPropagation();
          this.dispatchToParent(EVENT_EDITOR.MODIFY, {});
          break;
        case ƒui.EVENT.REMOVE_CHILD:
          _event.stopPropagation();
          this.dispatchToParent(EVENT_EDITOR.DELETE, {});
        case EVENT_EDITOR.SELECT: // TODO: is this reachable? Is it still needed?
          this.listResources();
          break;
        case ƒui.EVENT.RENAME:
        case ƒui.EVENT.CUT:
        case ƒui.EVENT.PASTE:
        case ƒui.EVENT.DROP:
          this.listResources();
          this.dispatchToParent(EVENT_EDITOR.UPDATE, { bubbles: true, detail: _event.detail });
          break;
      }
    };

    // private async openDialog(): Promise<boolean> {


    //   // ƒui.Dialog.dom.addEventListener(ƒui.EVENT.CHANGE, this.hndChange);

    //   if (await promise) {
    //     let mutator: ƒ.Mutator = ƒui.Controller.getMutator(settings, ƒui.Dialog.dom, this.getMutator());
    //     this.mutate(mutator);
    //     return true;
    //   } else
    //     return false;
    // }

    // private hndChange = (_event: Event): void => {
    //   let mutator: ƒ.Mutator = ƒui.Controller.getMutator(this, ƒui.Dialog.dom, this.getMutator());
    //   console.log(mutator, this);
    // };
  }
}