namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export abstract class ViewInternal extends View {
    public static readonly gltfImportSettings: Record<string, boolean> = { // TODO: save these settings?
      [ƒ.Graph.name]: true,
      [ƒ.Animation.name]: true,
      [ƒ.Material.name]: false,
      [ƒ.Mesh.name]: false
    };

    // TODO: either remove ViewInternalTable or unify common functionality with ViewInternalFolder into ViewInternal...
  }

  /**
   * Displays the internal resources as a folder tree.
   * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jonas Plotzky, HFU, 2024 
   */
  export class ViewInternalFolder extends ViewInternal {
    private tree: ƒui.Tree<ResourceEntry>;

    #expanded: string[]; // cache state from constructor

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);

      this.dom.addEventListener(EVENT_EDITOR.OPEN, this.hndOpen);
      this.dom.addEventListener(EVENT_EDITOR.UPDATE, this.hndUpdate);
      this.dom.addEventListener(EVENT_EDITOR.CREATE, this.hndCreate);
      this.dom.addEventListener(EVENT_EDITOR.DELETE, this.hndDelete);

      this.dom.addEventListener(ƒui.EVENT.MUTATE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.REMOVE_CHILD, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.RENAME, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.SELECT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.CUT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.PASTE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);

      this.dom.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOverCapture, true);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDropCapture, true);

      this.dom.addEventListener("keyup", this.hndKeyboardEvent);
      this.dom.tabIndex = 0;

      this.#expanded = _state["expanded"];
    }

    public get controller(): ControllerTreeResource {
      return <ControllerTreeResource>this.tree.controller;
    }

    public get resourceFolder(): ResourceFolder {
      return project.resourceFolder;
    }

    // public getSelection(): ƒ.SerializableResource[] {
    //   return <ƒ.SerializableResource[]>this.controller.selection.filter(_element => !(_element instanceof ResourceFolder));
    // }

    // public getDragDropSources(): ƒ.SerializableResource[] {
    //   return ƒui.Clipboard.dragDrop.get<ƒ.SerializableResource>().filter(_source => !(_source instanceof ResourceFolder));
    // }

    // TODO: this is a preparation for syncing a graph with its instances after structural changes
    // protected openContextMenu = (_event: Event): void => {
    //   let row: HTMLTableRowElement = <HTMLTableRowElement>_event.composedPath().find((_element) => (<HTMLElement>_element).tagName == "TR");
    //   if (row)
    //     this.contextMenu.getMenuItemById(String(CONTEXTMENU.SYNC_INSTANCES)).enabled = (row.getAttribute("icon") == "Graph");
    //   this.contextMenu.popup();
    // }

    protected getState(): ViewState {
      let state: ViewState = super.getState();
      state["expanded"] = this.getExpanded();
      return state;
    }

    // #region  ContextMenu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let item: Electron.MenuItem;

      item = new remote.MenuItem({ label: "Create Folder", id: String(CONTEXTMENU.CREATE_FOLDER), click: _callback, accelerator: "F" });
      menu.append(item);

      item = new remote.MenuItem({ label: "Create Graph", id: String(CONTEXTMENU.CREATE_GRAPH), click: _callback, accelerator: "G" });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Mesh",
        id: String(CONTEXTMENU.CREATE_MESH),
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_MESH, ƒ.Mesh, _callback)
      });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Material",
        id: String(CONTEXTMENU.CREATE_MATERIAL),
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_MATERIAL, ƒ.Shader, _callback)
      });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Create Animation",
        id: String(CONTEXTMENU.CREATE_ANIMATION),
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.CREATE_ANIMATION, ƒ.Animation, _callback)
      });
      menu.append(item);

      item = new remote.MenuItem({ label: `Create ${ƒ.ParticleSystem.name}`, id: String(CONTEXTMENU.CREATE_PARTICLE_EFFECT), click: _callback });
      menu.append(item);

      item = new remote.MenuItem({ label: "Delete", id: String(CONTEXTMENU.DELETE_RESOURCE), click: _callback, accelerator: "Delete" });
      menu.append(item);

      item = new remote.MenuItem({ label: "Clone", id: String(CONTEXTMENU.CLONE_RESOURCE), click: _callback, accelerator: "Insert" });
      menu.append(item);

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

      let focus: ResourceEntry = this.tree.getFocussed();
      let resource: ResourceEntry;

      if (choice == CONTEXTMENU.DELETE_RESOURCE) {
        if (((await this.controller.delete([focus])).length > 0))
          this.dispatch(EVENT_EDITOR.DELETE, { bubbles: true });
        return;
      }
      if (choice == CONTEXTMENU.CLONE_RESOURCE) {
        resource = await ƒ.Project.cloneResource(<ƒ.SerializableResource>focus);
        focus = this.controller.getParent(focus);
      }

      ƒ.Debug.fudge(focus.name);
      if (!(focus instanceof ResourceFolder))
        return;


      switch (choice) {
        case CONTEXTMENU.CREATE_FOLDER:
          resource = new ResourceFolder();
          break;
        case CONTEXTMENU.CREATE_MESH:
          let typeMesh: typeof ƒ.Mesh = ƒ.Mesh.subclasses[iSubclass];
          //@ts-ignore
          resource = new typeMesh();
          break;
        case CONTEXTMENU.CREATE_MATERIAL:
          let typeShader: typeof ƒ.Shader = ƒ.Shader.subclasses[iSubclass];
          resource = new ƒ.Material(typeShader.name, typeShader);
          break;
        case CONTEXTMENU.CREATE_GRAPH:
          resource = await ƒ.Project.registerAsGraph(new ƒ.Node("NewGraph"));
          break;
        case CONTEXTMENU.CREATE_ANIMATION:
          let typeAnimation: typeof ƒ.Animation = ƒ.Animation.subclasses[iSubclass];
          resource = new typeAnimation();
          break;
        case CONTEXTMENU.CREATE_PARTICLE_EFFECT:
          resource = new ƒ.ParticleSystem();
          break;

      }

      if (resource) {
        this.dispatchToParent(EVENT_EDITOR.CREATE, {});
        this.tree.addChildren([resource], focus);
        this.tree.findVisible(resource).focus();
        History.save(HISTORY.ADD, ƒ.Project, resource);
      }
    }

    protected openContextMenu = (_event: Event): void => {
      let item: HTMLElement = <HTMLElement>_event.target;
      while (item != this.dom && !(item instanceof ƒui.TreeItem))
        item = item.parentElement;

      if (item == this.dom) {
        item = this.tree.findVisible(this.resourceFolder);
        item.focus();
      }

      if (!(item instanceof ƒui.TreeItem))
        return;

      this.contextMenu.items.forEach(_item => _item.visible = true);

      if (!(item.data instanceof ResourceFolder)) {
        const createOptions: CONTEXTMENU[] = [CONTEXTMENU.CREATE_FOLDER, CONTEXTMENU.CREATE_GRAPH, CONTEXTMENU.CREATE_MESH, CONTEXTMENU.CREATE_MATERIAL, CONTEXTMENU.CREATE_ANIMATION, CONTEXTMENU.CREATE_PARTICLE_EFFECT];
        createOptions.forEach(_id => {
          this.contextMenu.getMenuItemById(String(_id)).visible = false;
        });
      }

      if (item.data == this.resourceFolder)
        this.contextMenu.getMenuItemById(String(CONTEXTMENU.DELETE_RESOURCE)).visible = false;
      if (item.data instanceof ResourceFolder)
        this.contextMenu.getMenuItemById(String(CONTEXTMENU.CLONE_RESOURCE)).visible = false;

      this.contextMenu.popup();
    };
    //#endregion

    protected hndDragOverCapture = (_event: DragEvent): void => {
      let viewSource: View = View.getViewSource(_event);
      if (viewSource == this || viewSource instanceof ViewHierarchy)
        return;

      if (viewSource instanceof ViewExternal) {
        let sources: DirectoryEntry[] = ƒui.Clipboard.dragDrop.get();
        if (sources.some(_source => [MIME.AUDIO, MIME.IMAGE, MIME.MESH, MIME.GLTF].includes(_source.getMimeType())))
          return;
      }

      _event.dataTransfer.dropEffect = "none";
      _event.stopPropagation();
    };

    protected hndDropCapture = async (_event: DragEvent): Promise<void> => {
      let viewSource: View = View.getViewSource(_event);
      if (viewSource == this || _event.target == this.tree)
        return;

      if (!(viewSource instanceof ViewExternal || viewSource instanceof ViewHierarchy))
        return;

      _event.stopPropagation(); // stop the event during capture because we need to process async loading 

      let resources: ƒ.SerializableResource[] = [];
      for (const source of <DirectoryEntry[] | ƒ.Node[]>ƒui.Clipboard.dragDrop.get()) {
        if (source instanceof ƒ.Node) {
          resources.push(await ƒ.Project.registerAsGraph(source, true));
          continue;
        }

        switch (source.getMimeType()) {
          case MIME.AUDIO:
            resources.push(new ƒ.Audio(source.pathRelative));
            break;
          case MIME.IMAGE:
            resources.push(new ƒ.TextureImage(source.pathRelative));
            break;
          case MIME.MESH:
            resources.push(await new ƒ.MeshOBJ().load(source.pathRelative));
            break;
          case MIME.GLTF:
            let loader: ƒ.GLTFLoader = await ƒ.GLTFLoader.LOAD(source.pathRelative);
            let load: boolean = await ƒui.Dialog.prompt(ViewInternal.gltfImportSettings, false, `Select which resources to import from '${loader.name}'`, "Adjust settings and press OK", "OK", "Cancel");
            if (!load)
              break;

            for (let type in ViewInternal.gltfImportSettings) if (ViewInternal.gltfImportSettings[type])
              resources.push(...await loader.loadResources<ƒ.SerializableResourceExternal>(ƒ[type]));

            break;
        }
      }

      ƒui.Clipboard.dragDrop.set(resources);

      // redispatch event without capture
      this.dom.removeEventListener(ƒui.EVENT.DROP, this.hndDropCapture, true);
      _event.target.dispatchEvent(new DragEvent(_event.type, _event));
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDropCapture, true);

      resources.forEach(_resource => {
        History.save(HISTORY.ADD, ƒ.Project, _resource);
        if (_resource instanceof ƒ.Graph) // why is this necessary?
          History.swap();
      });
      this.dispatchToParent(EVENT_EDITOR.CREATE, {});

      if (viewSource instanceof ViewHierarchy)
        // //@ts-ignore
        viewSource.dispatch(EVENT_EDITOR.UPDATE, { detail: { view: this } });
    };

    private hndKeyboardEvent = async (_event: KeyboardEvent): Promise<void> => {
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.INSERT:
          let focus: ResourceEntry = this.tree.getFocussed();
          if (focus instanceof ResourceFolder)
            return;
          let clone: ResourceEntry = await ƒ.Project.cloneResource(<ƒ.SerializableResource>focus);
          this.tree.addChildren([clone], this.controller.getParent(focus));
          this.tree.findVisible(clone).focus();
          this.tree.findVisible(clone).focus();
          this.dispatchToParent(EVENT_EDITOR.CREATE, { bubbles: true });
          History.save(HISTORY.ADD, ƒ.Project, clone);
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
            this.tree.clearSelection();
            this.tree.selectAll();
          }
          break;
        case ƒ.KEYBOARD_CODE.DELETE:
          // this.tree.delete(await this.tree.controller.delete(null));
          break;
        case ƒ.KEYBOARD_CODE.G:
          if (!_event.ctrlKey)
            this.contextMenu.getMenuItemById(String(CONTEXTMENU.CREATE_GRAPH)).click();
          break;
        case ƒ.KEYBOARD_CODE.F:
          if (!_event.ctrlKey)
            this.contextMenu.getMenuItemById(String(CONTEXTMENU.CREATE_FOLDER)).click();
          break;
      }
    };

    private hndOpen = (): void => {
      // while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild));
      this.dom.innerHTML = "";
      this.tree = new ƒui.Tree<ResourceEntry>(new ControllerTreeResource(), this.resourceFolder);
      this.dom.appendChild(this.tree);
      this.dom.title = "● Right click to create new resource.\n● Select or drag resource.";
      this.tree.title = "● Select to edit in \"Properties\"\n● Drag to \"Properties\" or \"Components\" to use if applicable.";
      this.hndCreate();

      if (this.#expanded)
        this.expand(this.#expanded);
    };

    private hndCreate = (): void => {
      // add new resources to root folder
      for (let idResource in ƒ.Project.resources) {
        let resource: ResourceEntry = ƒ.Project.resources[idResource];
        if (!this.resourceFolder.contains(resource))
          this.controller.addChildren([resource], this.resourceFolder);
      }
      this.hndUpdate();
      let rootItem: ƒui.TreeItem<ResourceEntry> = this.tree.findVisible(this.resourceFolder);
      if (!rootItem.expanded)
        rootItem.expand(true);
    };

    private hndDelete = (): void => {
      const files: ƒ.SerializableResource[] = []; // collect files that are no longer registered in the project
      for (const descendant of this.resourceFolder)
        if (!(descendant instanceof ResourceFolder) && !ƒ.Project.resources[descendant.idResource])
          files.push(descendant);

      for (const file of files) // remove them 
        this.controller.remove(file);

      this.hndUpdate();
    };

    private hndUpdate = (): void => {
      this.tree.refresh();
      Object.values(ƒ.Project.resources)
        .filter(_resource => (<ƒ.SerializableResourceExternal>_resource).status == ƒ.RESOURCE_STATUS.ERROR)
        .map(_resource => this.controller.getPath(_resource))
        .forEach(_path => this.tree.show(_path));
    };

    private hndEvent = (_event: CustomEvent): void => {
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
        // break;
        case ƒui.EVENT.RENAME:
        case ƒui.EVENT.CUT:
        case ƒui.EVENT.PASTE:
          this.dispatchToParent(EVENT_EDITOR.UPDATE, { bubbles: true, detail: _event.detail });
          break;
      }
    };

    private expand(_paths: string[]): void {
      const paths: ResourceEntry[][] = _paths
        .map(_path => _path
          .split("/")
          .slice(1) // remove root as it is added as first element in reduce
          .reduce<ResourceFolder[]>((_path, _index) => [..._path, _path[_path.length - 1]?.entries?.[_index]], [this.resourceFolder]))
        .filter(_path => !_path.some(_entry => !_entry)); // filter out invalid paths
      this.tree.expand(paths);
    }

    private getExpanded(): string[] {
      const expanded: string[] = [];
      for (let item of this.tree) {
        if (item.expanded)
          expanded.push(this.getPath(item.data));
      }
      return expanded;
    }

    private getPath(_entry: ResourceEntry): string {
      return this.controller.getPath(_entry)
        .map((_entry, _index, _array) => {
          let parent: ResourceFolder = <ResourceFolder>_array[_index - 1];
          return parent?.entries.indexOf(_entry);
        })
        .join("/");
    }
  }
}