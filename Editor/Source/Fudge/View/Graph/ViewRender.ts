namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  import ƒAid = FudgeAid;

  /**
   * View the rendering of a graph in a viewport with an independent camera
   * @author Jirka Dell'Oro-Friedl, HFU, 2020
   */
  export class ViewRender extends View {
    private cmrOrbit: ƒAid.CameraOrbit;
    private cmpOutline: ƒ.ComponentOutline;
    private viewport: ƒ.Viewport;
    private canvas: HTMLCanvasElement;
    private graph: ƒ.Graph;
    private node: ƒ.Node;
    private nodeLight: ƒ.Node = new ƒ.Node("Illumination"); // keeps light components for dark graphs
    private redrawId: number;
    private transformator: ƒAid.Transformator;

    readonly #selection: ƒ.Node[] = [];

    #canvasResizeObserver: ResizeObserver;
    #pointerMoved: boolean = false;

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);

      this.createUserInterface();

      let title: string = "● Drop a graph from \"Internal\" here.\n";
      title += "● Use mousebuttons and ctrl-, shift- or alt-key to navigate editor camera.\n";
      title += "● Drop camera component here to see through that camera.\n";
      title += "● Manipulate transformations in this view:\n";
      title += "  - Click to select node, rightclick to select transformations.\n";
      title += "  - Select component to manipulate in view Components.\n";
      title += "  - Hold X, Y or Z and move mouse to transform. Add shift-key to invert restriction.\n";
      this.dom.title = title;
      this.dom.tabIndex = 0;

      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.FOCUS, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.UPDATE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.CLOSE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.KEY_DOWN, this.hndKey);
      this.dom.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);

      this.dom.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOver);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDrop);

      this.dom.addEventListener("pointermove", this.hndPointer);
      this.dom.addEventListener("mousedown", () => this.#pointerMoved = false); // reset pointer move
      this.dom.addEventListener("startTransform", this.hndEvent); // hack to evaluate common undo system
      this.dom.addEventListener("endTransform", this.hndEvent); // hack to mutate transform component to sync graph instances

      if (_state["gizmosFilter"]) {
        let gizmosFilter: ƒ.Viewport["gizmosFilter"] = _state["gizmosFilter"];
        for (const gizmo in gizmosFilter) // validate the saved state
          if (gizmo in this.gizmosFilter)
            this.gizmosFilter[gizmo] = gizmosFilter[gizmo];
      }

      if (Reflect.has(_state, "renderContinuously"))
        this.setRenderContinously(_state["renderContinuously"]);

      if (Reflect.has(_state, "selectionOutline")) {
        this.contextMenu.getMenuItemById(String(CONTEXTMENU.SELECTION_OUTLINE)).checked = _state["selectionOutline"];
        this.cmpOutline.activate(_state["selectionOutline"]);
      }
    }

    private get gizmosFilter(): ƒ.Viewport["gizmosFilter"] {
      return this.viewport?.gizmosFilter;
    }

    //#region  ContextMenu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let item: Electron.MenuItem;

      item = new remote.MenuItem({
        label: "Transform", submenu: [
          { label: "None", id: TRANSFORM.NONE, type: "radio", click: _callback, accelerator: "Q" },
          { label: "Translate", id: TRANSFORM.TRANSLATE, type: "radio", click: _callback, accelerator: "W" },
          { label: "Rotate", id: TRANSFORM.ROTATE, type: "radio", click: _callback, accelerator: "E" },
          { label: "Scale", id: TRANSFORM.SCALE, type: "radio", click: _callback, accelerator: "R" },
          { type: "separator" },
          { label: "World", id: TRANSFORM.WORLD, type: "radio", click: _callback, accelerator: "G" },
          { label: "Local", id: TRANSFORM.LOCAL, type: "radio", click: _callback, accelerator: "G" }
        ]
      });
      menu.append(item);

      item = new remote.MenuItem({
        label: "Physics Debug", submenu: [
          { "label": "None", id: String(ƒ.PHYSICS_DEBUGMODE[0]), click: _callback },
          { "label": "Colliders", id: String(ƒ.PHYSICS_DEBUGMODE[1]), click: _callback },
          { "label": "Colliders and Joints (Default)", id: String(ƒ.PHYSICS_DEBUGMODE[2]), click: _callback },
          { "label": "Bounding Boxes", id: String(ƒ.PHYSICS_DEBUGMODE[3]), click: _callback },
          { "label": "Contacts", id: String(ƒ.PHYSICS_DEBUGMODE[4]), click: _callback },
          { "label": "Only Physics", id: String(ƒ.PHYSICS_DEBUGMODE[5]), click: _callback }
        ]
      });
      menu.append(item);

      item = new remote.MenuItem({ label: "Orthographic Camera", id: String(CONTEXTMENU.ORTHGRAPHIC_CAMERA), type: "checkbox", click: _callback, accelerator: process.platform == "darwin" ? "O" : "O" });
      menu.append(item);

      item = new remote.MenuItem({ label: "Render Continuously", id: String(CONTEXTMENU.RENDER_CONTINUOUSLY), type: "checkbox", click: _callback });
      menu.append(item);

      item = new remote.MenuItem({ label: "Selection Outline", id: String(CONTEXTMENU.SELECTION_OUTLINE), type: "checkbox", click: _callback, checked: true });
      menu.append(item);

      return menu;
    }

    protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
      ƒ.Debug.fudge(`MenuSelect: Item-id=${_item.id}`);

      switch (_item.id) {
        case TRANSFORM.NONE:
        case TRANSFORM.TRANSLATE:
        case TRANSFORM.ROTATE:
        case TRANSFORM.SCALE:
          Page.setTransform(_item.id);
          this.transformator.mode = _item.id;
          this.redraw();
          break;
        case TRANSFORM.WORLD:
        case TRANSFORM.LOCAL:
          this.transformator.space = _item.id;
          break;
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.NONE]:
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.COLLIDERS]:
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER]:
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.BOUNDING_BOXES]:
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.CONTACTS]:
        case ƒ.PHYSICS_DEBUGMODE[ƒ.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY]:
          this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE[_item.id];
          this.redraw();
          break;
        case String(CONTEXTMENU.ORTHGRAPHIC_CAMERA):
          this.setCameraOrthographic(_item.checked);
          break;
        case String(CONTEXTMENU.RENDER_CONTINUOUSLY):
          this.setRenderContinously(_item.checked);
          break;
        case String(CONTEXTMENU.SELECTION_OUTLINE):
          this.cmpOutline.activate(_item.checked);
          break;
        default:
          if (!(_item.id in this.gizmosFilter))
            break;

          this.gizmosFilter[_item.id] = _item.checked;
          this.redraw();
          break;
      }
    }

    protected openContextMenu = (_event: Event): void => {
      if (!this.#pointerMoved) {
        for (const gizmo in this.gizmosFilter)
          this.contextMenu.getMenuItemById(gizmo).checked = this.gizmosFilter[gizmo];
        this.contextMenu.popup();
      }
      this.#pointerMoved = false;
    };
    //#endregion

    protected hndDragOver = (_event: DragEvent): void => {
      _event.dataTransfer.dropEffect = "none";

      let source: Object = ƒui.Clipboard.dragDrop.get()[0];
      if (source instanceof ƒ.Graph || source instanceof ƒ.ComponentCamera) {
        _event.dataTransfer.dropEffect = "link";
        _event.preventDefault();
        _event.stopPropagation();
      }
    };

    protected hndDrop = (_event: DragEvent): void => {
      let source: Object = ƒui.Clipboard.dragDrop.get()[0];
      if (source instanceof ƒ.ComponentCamera) {
        // this.setCameraOrthographic(false);
        this.viewport.camera = source;
        this.redraw();
        _event.stopPropagation();
        return;
      }
    };

    protected getState(): ViewState {
      let state: ViewState = super.getState();
      state["gizmosFilter"] = this.gizmosFilter;
      state["renderContinuously"] = this.contextMenu.getMenuItemById(String(CONTEXTMENU.RENDER_CONTINUOUSLY)).checked;
      state["selectionOutline"] = this.contextMenu.getMenuItemById(String(CONTEXTMENU.SELECTION_OUTLINE)).checked;
      return state;
    }

    private createUserInterface(): void {
      ƒAid.addStandardLightComponents(this.nodeLight);

      let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
      this.canvas = ƒAid.Canvas.create(true, ƒAid.IMAGE_RENDERING.PIXELATED);

      let container: HTMLDivElement = document.createElement("div");
      container.style.borderWidth = "0px";
      document.body.appendChild(this.canvas);

      this.viewport = new ƒ.Viewport();
      this.viewport.gizmosEnabled = true;
      this.viewport.gizmosSelected = this.#selection;

      this.#canvasResizeObserver = new ResizeObserver(this.redraw);
      this.#canvasResizeObserver.observe(this.canvas);
      // add default values for view render gizmos
      this.viewport.initialize("ViewNode_Viewport", null, cmpCamera, this.canvas);
      const redraw = (): void => { if (this.redrawId == undefined && this.graph) this.redraw(); };
      const translateOnPick = (): boolean => this.transformator.selected == null;

      this.cmrOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(this.viewport, false, undefined, undefined, undefined, redraw, translateOnPick);
      this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
      this.viewport.addEventListener(ƒ.EVENT.RENDER_PREPARE_START, this.hndPrepare);

      this.cmpOutline = new ƒ.ComponentOutline([], ƒ.Color.CSS("DeepPink"), ƒ.Color.CSS("DeepPink", 0.3));
      this.cmpOutline.selection = this.#selection;
      cmpCamera.node.addComponent(this.cmpOutline);

      this.setGraph(null);

      this.transformator = new ƒAid.Transformator(this.viewport);
      this.canvas.addEventListener("pointerdown", this.hndPointerDown);
      this.canvas.addEventListener("pick", this.hndPick);

      let submenu: Electron.MenuItemConstructorOptions[] = [];
      for (const gizmo in this.gizmosFilter)
        submenu.push({ label: gizmo, id: gizmo, type: "checkbox", click: this.contextMenuCallback.bind(this) });

      this.contextMenu.append(new remote.MenuItem({
        label: "Gizmos", submenu: submenu
      }));
    }

    private setGraph(_node: ƒ.Graph): void {
      if (!_node) {
        this.graph = undefined;
        this.dom.innerHTML = "Drop a graph here to edit";
        return;
      }
      if (!this.graph) {
        this.dom.innerHTML = "";
        this.dom.appendChild(this.canvas);
      }

      this.graph = _node;
      ƒ.Physics.activeInstance = Page.getPhysics(this.graph);
      ƒ.Physics.cleanup();
      this.graph.broadcastEvent(new Event(ƒ.EVENT.DISCONNECT_JOINT));
      ƒ.Physics.connectJoints();
      this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
      this.viewport.setBranch(this.graph);
      this.viewport.camera = this.cmrOrbit.cmpCamera;
      this.transformator.mtxLocal = null;
      this.transformator.mtxWorld = null;
      ƒ.Render.prepare(this.graph);
    }

    private setCameraOrthographic(_on: boolean = false): void {
      this.viewport.camera = this.cmrOrbit.cmpCamera;
      if (_on) {
        this.cmrOrbit.cmpCamera.projectCentral(2, 1, ƒ.FIELD_OF_VIEW.DIAGONAL, 10, 20000);
        this.cmrOrbit.maxDistance = 10000;
        this.cmrOrbit.distance *= 50;
      } else {
        this.cmrOrbit.cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.01, 1000);
        this.cmrOrbit.maxDistance = 1000;
        this.cmrOrbit.distance /= 50;
      }
      this.contextMenu.getMenuItemById(String(CONTEXTMENU.ORTHGRAPHIC_CAMERA)).checked = _on;
      ƒ.Render.prepare(this.cmrOrbit);
      this.redraw();
    }

    private hndPrepare = (_event: Event): void => {
      let switchLight: EventListener = (_event: Event): void => {
        let lightsPresent: boolean = false;
        ƒ.Render.lights.forEach((_array: ƒ.RecycableArray<ƒ.ComponentLight>) => lightsPresent ||= _array.length > 0);
        this.setTitle(`${lightsPresent ? "RENDER" : "Render"} | ${this.graph.name}`);
        if (!lightsPresent)
          ƒ.Render.addLights(this.nodeLight.getComponents(ƒ.ComponentLight));
        this.graph.removeEventListener(ƒ.EVENT.RENDER_PREPARE_END, switchLight);
      };
      this.graph.addEventListener(ƒ.EVENT.RENDER_PREPARE_END, switchLight);
    };

    private hndEvent = (_event: EditorEvent): void => {
      let detail: EventDetail = <EventDetail>_event.detail;
      switch (_event.type) {
        case "startTransform":
          History.save(HISTORY.MUTATE, this.node.cmpTransform, this.node.cmpTransform.getMutator());
          break;
        case "endTransform":
          this.node.cmpTransform.mutate(this.node.cmpTransform.getMutator());
          break;
        case EVENT_EDITOR.SELECT:
          this.node = detail.node;
          if (detail.graph) {
            this.setGraph(detail.graph);
            this.dispatch(EVENT_EDITOR.FOCUS, { bubbles: false, detail: { node: detail.node || this.graph } });
          }
          break;
        case EVENT_EDITOR.FOCUS:
          this.cmrOrbit.mtxLocal.translation = detail.node.mtxWorld.translation;
          ƒ.Render.prepare(this.cmrOrbit);
          break;
        case EVENT_EDITOR.CLOSE:
          this.setRenderContinously(false);
          this.viewport.gizmosSelected = null;
          break;
        case EVENT_EDITOR.UPDATE:
          if (!this.viewport.camera.isActive)
            this.viewport.camera = this.cmrOrbit.cmpCamera;
          break;
        case EVENT_EDITOR.MODIFY:
          if (!this.node.getParent() && !(this.node instanceof ƒ.Graph))
            this.node = null;
          break;
      }

      this.#selection.length = 0;
      if (this.node)
        this.#selection[0] = this.node;
      this.transformator.mtxLocal = this.node?.mtxLocal;
      this.transformator.mtxWorld = this.node?.mtxWorld;
      this.redraw();
    };

    private hndKey = (_event: KeyboardEvent): void => {
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.Q:
          this.contextMenu.getMenuItemById(TRANSFORM.NONE).click();
          break;
        case ƒ.KEYBOARD_CODE.W:
          this.contextMenu.getMenuItemById(TRANSFORM.TRANSLATE).click();
          break;
        case ƒ.KEYBOARD_CODE.E:
          this.contextMenu.getMenuItemById(TRANSFORM.ROTATE).click();
          break;
        case ƒ.KEYBOARD_CODE.R:
          this.contextMenu.getMenuItemById(TRANSFORM.SCALE).click();
          break;
        case ƒ.KEYBOARD_CODE.G:
          this.contextMenu.getMenuItemById(this.transformator.space == TRANSFORM.LOCAL ? TRANSFORM.WORLD : TRANSFORM.LOCAL).click();
          break;
        // case ƒ.KEYBOARD_CODE.Y:
        //   if (_event.ctrlKey) {
        //     this.transformator.undo();
        //     this.redraw();
        //     break;
        //   }
      }
    };

    private hndPick = (_event: EditorEvent): void => {
      if (this.transformator.selected)
        return;

      let pick: ƒ.Pick = <ƒ.Pick>_event.detail;

      //TODO: watch out, two selects
      this.dispatch(EVENT_EDITOR.SELECT, { bubbles: true, detail: { node: pick.node } });
      // this.dom.dispatchEvent(new CustomEvent(ƒui.EVENT.SELECT, { bubbles: true, detail: { data: picked } }));
    };

    // private animate = (_e: Event) => {
    //   this.viewport.setGraph(this.graph);
    //   if (this.canvas.clientHeight > 0 && this.canvas.clientWidth > 0)
    //     this.viewport.draw();
    // }

    private hndPointer = (_event: PointerEvent): void => {
      this.#pointerMoved ||= (_event.movementX != 0 || _event.movementY != 0);

      this.dom.focus({ preventScroll: true });
      let restriction: string;

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]))
        restriction = null;
      else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.X]))
        restriction = "x";
      else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Y]))
        restriction = "z";
      else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Z]))
        restriction = "y";

      if (!restriction)
        return;

      this.canvas.requestPointerLock();
      let data: Object = {
        transform: Page.modeTransform, restriction: restriction, x: _event.movementX, y: _event.movementY, camera: this.viewport.camera, inverted: _event.shiftKey
      };
      this.dispatchToParent(EVENT_EDITOR.TRANSFORM, { bubbles: true, detail: { transform: data } });
      this.dispatchToParent(EVENT_EDITOR.UPDATE, {});
      this.redraw();
    };

    private hndPointerDown = (_event: MouseEvent): void => {
      ƒ.Physics.activeInstance = Page.getPhysics(this.graph);
      _event.stopPropagation();
    };

    private redraw = (): void => {
      if (this.viewport.rectClient.width == 0 || this.viewport.rectClient.height == 0 || !this.graph)
        return;

      try {
        ƒ.Physics.activeInstance = Page.getPhysics(this.graph);
        ƒ.Physics.connectJoints();
        this.viewport.draw();
      } catch (_error: unknown) {
        this.setRenderContinously(false);
        ƒ.Debug.error(_error);
        // console.error(_error);
        //nop
      }
    };

    private setRenderContinously(_on: boolean): void {
      if (_on) {
        this.redrawId = window.setInterval(() => {
          this.redraw();
        }, 1000 / 30);
      } else {
        window.clearInterval(this.redrawId);
        this.redrawId = null;
      }
      this.contextMenu.getMenuItemById(String(CONTEXTMENU.RENDER_CONTINUOUSLY)).checked = _on;
    }
  }
}