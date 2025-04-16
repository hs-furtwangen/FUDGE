namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  enum MENU {
    COMPONENTMENU = "Add Components"
  }

  // TODO: examin problem with ƒ.Material when using "typeof ƒ.Mutable" as key to the map
  let resourceToComponent: Map<Function, typeof ƒ.Component> = new Map<Function, typeof ƒ.Component>([
    [ƒ.Audio, ƒ.ComponentAudio],
    [ƒ.Material, ƒ.ComponentMaterial],
    [ƒ.Mesh, ƒ.ComponentMesh],
    [ƒ.Animation, ƒ.ComponentAnimation],
    [ƒ.ParticleSystem, ƒ.ComponentParticleSystem]
  ]);

  /**
   * View all components attached to a node
   * @author Jirka Dell'Oro-Friedl, HFU, 2020
   */
  export class ViewComponents extends View {
    private node: ƒ.Node;
    private expanded: { [type: string]: boolean } = { ComponentTransform: true };
    private selected: string = "ComponentTransform";
    private historySave: boolean = true;
    private historyTime: number = performance.now();

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);
      this.fillContent();

      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.TRANSFORM, this.hndTransform);
      this.dom.addEventListener(EVENT_EDITOR.DELETE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.DELETE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.EXPAND, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.COLLAPSE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);
      this.dom.addEventListener(ƒui.EVENT.MUTATE, this.hndEvent, true);

      this.dom.addEventListener(ƒui.EVENT.CLICK, this.hndEvent, true);
      this.dom.addEventListener(ƒui.EVENT.KEY_DOWN, this.hndEvent, true);
      this.dom.addEventListener(ƒui.EVENT.KEY_DOWN, this.hndKeyboard);

      this.dom.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOver);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDrop);
      this.dom.addEventListener(ƒui.EVENT.PASTE, this.hndPaste);

      this.dom.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.dom.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);

      this.dom.tabIndex = 0;
    }

    //#region  ContextMenu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let item: Electron.MenuItem;
      item = new remote.MenuItem({
        label: "Add Component",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.ADD_COMPONENT, ƒ.Component, _callback)
      });
      menu.append(item);
      item = new remote.MenuItem({
        label: "Add Joint",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.ADD_JOINT, ƒ.Joint, _callback)
      });
      menu.append(item);
      item = new remote.MenuItem({
        label: "Delete Component",
        submenu: ContextMenu.getSubclassMenu(CONTEXTMENU.ADD_JOINT, ƒ.Joint, _callback)
      });
      item = new remote.MenuItem({ label: "Delete Component", id: String(CONTEXTMENU.DELETE_COMPONENT), click: _callback, accelerator: "Delete" });
      menu.append(item);

      // ContextMenu.appendCopyPaste(menu);
      return menu;
    }

    protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
      ƒ.Debug.fudge(`MenuSelect: Item-id=${CONTEXTMENU[_item.id]}`);
      let iSubclass: number = _item["iSubclass"];
      let component: typeof ƒ.Component;

      if (this.protectGraphInstance())
        return;

      switch (Number(_item.id)) {
        case CONTEXTMENU.ADD_COMPONENT:
          component = ƒ.Component.subclasses[iSubclass];
          break;
        case CONTEXTMENU.ADD_JOINT:
          component = ƒ.Joint.subclasses[iSubclass];
          break;
        case CONTEXTMENU.DELETE_COMPONENT:
          let element: Element = document.activeElement;
          if (element.tagName == "BODY")
            return;
          do {
            ƒ.Debug.fudge(element.tagName);
            let controller: ControllerDetail = Reflect.get(element, "controller");
            if (element.tagName == "DETAILS" && controller) {
              this.dispatch(EVENT_EDITOR.DELETE, { detail: { mutable: <ƒ.Mutable>controller.getMutable() } });
              break;
            }
            element = element.parentElement;
          } while (element);
          return;
      }

      if (!component) // experimental fix for the sporadic "component is not a constructor" bug
        component = ƒ[_item.label];

      //@ts-ignore
      let cmpNew: ƒ.Component = new component();
      if ((cmpNew instanceof ƒ.ComponentRigidbody || cmpNew instanceof ƒ.ComponentVRDevice || cmpNew instanceof ƒ.ComponentWalker) && !this.node.cmpTransform) {
        ƒui.Dialog.prompt(null, true, "ComponentTransform mandatory", `To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentTransform.name}.`, "OK", "");
        return;
      }
      if (cmpNew instanceof ƒ.ComponentGraphFilter && !(this.node instanceof ƒ.Graph)) {
        ƒui.Dialog.prompt(null, true, "Root node only", `Attach ${ƒ.ComponentGraphFilter.name} to the root node of a graph`, "OK", "");
        // console.log(this.node);
        return;
      }
      if (cmpNew instanceof ƒ.ComponentFog || cmpNew instanceof ƒ.ComponentAmbientOcclusion || cmpNew instanceof ƒ.ComponentBloom) {
        let camera: ƒ.ComponentCamera = this.node.getComponent(ƒ.ComponentCamera) ?? this.node.getComponent(ƒ.ComponentVRDevice);
        if (!camera) {
          ƒui.Dialog.prompt(null, true, "Post-Process effect", `To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentCamera.name} or ${ƒ.ComponentVRDevice.name}.`, "OK", "");
          return;
        }
      }
      ƒ.Debug.info(cmpNew.type, cmpNew);

      this.node.addComponent(cmpNew);
      History.save(HISTORY.ADD, this.node, cmpNew);
      this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
    }
    //#endregion

    protected hndDragOver = (_event: DragEvent): void => {
      if (!this.node)
        return;
      if (this.dom != _event.target)
        return;

      for (let source of ƒui.Clipboard.dragDrop.get()) {
        if (source instanceof ScriptInfo) {
          if (!source.isComponent)
            return;
        } else if (!this.findComponentType(source))
          return;
      }

      // if (this.protectGraphInstance())
      //   return;

      _event.dataTransfer.dropEffect = "link";
      _event.preventDefault();
      _event.stopPropagation();
    };

    protected hndDrop = (_event: DragEvent): void => {
      this.addComponentsFromResources(ƒui.Clipboard.dragDrop.get());
    };

    protected hndPaste = (): void => {
      this.addComponentsFromResources(ƒui.Clipboard.copyPaste.get());
    };

    private addComponentsFromResources(_resources: ƒ.SerializableResource[]): void {
      if (this.protectGraphInstance())
        return;
      for (let source of _resources as ƒ.SerializableResource[]) {
        this.addComponentFromResources(source);
        this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
      }
    }
    private addComponentFromResources(_resource: ƒ.SerializableResource): void {
      let cmpNew: ƒ.Component = this.createComponent(_resource);
      this.node.addComponent(cmpNew);
      this.expanded[cmpNew.type] = true;
      History.save(HISTORY.ADD, this.node, cmpNew);
    }

    private protectGraphInstance(): boolean {
      // inhibit structural changes to a GraphInstance
      let check: ƒ.Node = this.node;
      do {
        if (check instanceof ƒ.GraphInstance) {
          ƒui.Dialog.prompt(null, true, "Structural change on instance", `Edit the original graph "${check.name}" to make changes to its structure, then save and reload the project`, "OK", "");
          return true;
        }
        check = check.getParent();
      } while (check);

      return false;
    }

    private fillContent(): void {
      while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild));
      let cntEmpty: HTMLDivElement = document.createElement("div");
      cntEmpty.textContent = "Drop internal resources or use right click to create new components";
      this.dom.title = "Drop internal resources or use right click to create new components";

      if (!this.node || !(this.node instanceof ƒ.Node)) {  // TODO: examine, if anything other than node can appear here...
        this.setTitle("Components");
        this.dom.title = "Select node to edit components";
        cntEmpty.textContent = "Select node to edit components";
        this.dom.append(cntEmpty);
        return;
      }

      this.setTitle("Components | " + this.node.name);

      let components: ƒ.Component[] = this.node.getAllComponents();
      if (!components.length) {
        this.dom.append(cntEmpty);
        return;
      }

      for (let component of components) {
        let details: ƒui.Details = ƒui.Generator.createDetailsFromMutable(component);
        let controller: ControllerDetail = new ControllerDetail(component, details, this);
        Reflect.set(details, "controller", controller); // insert a link back to the controller
        details.expand(this.expanded[component.type]);
        this.dom.append(details);
        if (component instanceof ƒ.ComponentCamera) {
          details.draggable = true;
          details.addEventListener("dragstart", () => ƒui.Clipboard.dragDrop.set([component]));
        }
        if (component instanceof ƒ.ComponentRigidbody) {
          let pivot: HTMLElement = controller.domElement.querySelector("[key='mtxPivot'");
          let opacity: string = pivot.style.opacity;
          setPivotOpacity(null);
          controller.domElement.addEventListener(ƒui.EVENT.MUTATE, setPivotOpacity);
          function setPivotOpacity(_event: Event): void {
            let initialization: ƒ.BODY_INIT = controller.getMutator({ initialization: 0 }).initialization;
            pivot.style.opacity = initialization == ƒ.BODY_INIT.TO_PIVOT ? opacity : "0.3";
          }
        }
        if (component instanceof ƒ.ComponentFaceCamera) {
          let up: HTMLElement = controller.domElement.querySelector("[key='up'");
          let opacity: string = up.style.opacity;
          setUpOpacity(null);
          controller.domElement.addEventListener(ƒui.EVENT.MUTATE, setUpOpacity);
          function setUpOpacity(_event: Event): void {
            let upLocal: boolean = controller.getMutator({ upLocal: true }).upLocal;
            up.style.opacity = !upLocal ? opacity : "0.3";
          }
        }
        if (details.getAttribute("key") == this.selected)
          this.select(details, false);
      }
    }

    private hndEvent = (_event: EditorEvent): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          History.save(HISTORY.ADD, (<ƒ.Node>_event.target).getParent(), _event.target);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          History.save(HISTORY.REMOVE, (<ƒ.Node>_event.target).getParent(), _event.target);
          break;
        case EVENT_EDITOR.SELECT:
          this.node = _event.detail.node || _event.detail.graph;
        case EVENT_EDITOR.MODIFY:
          if (!this.node.getParent() && !(this.node instanceof ƒ.Graph)) 
            this.node = null;
          
          // console.log(_event);
          this.fillContent();
          break;
        case ƒui.EVENT.DELETE:
        case EVENT_EDITOR.DELETE:
          let component: ƒ.Component = <ƒ.Component>_event.detail.mutable;
          if (this.protectGraphInstance() || !component)
            return;
          History.save(HISTORY.REMOVE, this.node, component);
          this.node.removeComponent(component);
          this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
          break;
        case ƒui.EVENT.KEY_DOWN:
        case ƒui.EVENT.CLICK:
          if (_event instanceof KeyboardEvent && _event.code != ƒ.KEYBOARD_CODE.SPACE)
            break;
          let target: ƒui.Details = <ƒui.Details>_event.target;
          if (target.tagName == "SUMMARY")
            target = <ƒui.Details>target.parentElement;
          if (!(_event.target instanceof HTMLDetailsElement || (<HTMLElement>_event.target)))
            break;
          try {
            if (this.dom.replaceChild(target, target)) {
              if (_event instanceof KeyboardEvent || this.getSelected() != target) {
                target.expand(true);
                _event.preventDefault();
              }
              this.select(target);
            }
          } catch (_e: unknown) { /* */ }
          break;
        case ƒui.EVENT.EXPAND:
        case ƒui.EVENT.COLLAPSE:
          this.expanded[(<ƒui.Details>_event.target).getAttribute("type")] = (_event.type == ƒui.EVENT.EXPAND);
          break;
        case ƒui.EVENT.MUTATE:
          let controller: ControllerDetail = Reflect.get(_event.target, "controller");
          let mutable: ƒ.Component = <ƒ.Component>controller.getMutable();
          if (mutable instanceof ƒ.ComponentRigidbody) {
            // mutable.initialize(); 
            mutable.isInitialized = false;
            this.dispatch(EVENT_EDITOR.UPDATE, { bubbles: true, detail: { node: this.node } }); // TODO: check if this was necessary, EVENT_EDITOR.UPDATE gets broadcasted by project on ƒ.EVENT.GRAPH_MUTATED, so this was causing a double broadcast of EVENT_EDITOR.UPDATE to ALL views on any change to any component
          }
          break;
        // case ƒui.EVENT.REARRANGE_ARRAY: // no listener for this event
        //   this.fillContent();
        //   break;
        default:
          break;
      }
    };


    private hndKeyboard = (_event: KeyboardEvent): void => {
      if (_event.code == ƒ.KEYBOARD_CODE.V && _event.ctrlKey)
        this.hndPaste();
    };


    private hndTransform = (_event: EditorEvent): void => {
      if (!this.getSelected())
        return;

      let controller: ControllerDetail = Reflect.get(this.getSelected(), "controller");
      let component: ƒ.Component = <ƒ.Component>controller.getMutable();
      let mtxTransform: ƒ.Matrix4x4 = Reflect.get(component, "mtxLocal") || Reflect.get(component, "mtxPivot");
      if (!mtxTransform)
        return;


      if (this.historySave) {
        this.historySave = false;
        if (performance.now() > this.historyTime)
          History.save(HISTORY.MUTATE, component, component.getMutator());
        setTimeout(() => {
          History.save(HISTORY.MUTATE, component, component.getMutator());
          component.mutate(component.getMutator());
          this.historySave = true;
          this.historyTime = performance.now() + 300;
        }, 200);
      }

      let dtl: ƒ.General = _event.detail.transform;
      let mtxCamera: ƒ.Matrix4x4 = (<ƒ.ComponentCamera>dtl.camera).node.mtxWorld;
      let distance: number = mtxCamera.getTranslationTo(this.node.mtxWorld).magnitude;
      if (dtl.transform == TRANSFORM.ROTATE)
        [dtl.x, dtl.y] = [dtl.y, dtl.x];

      let value: ƒ.Vector3 = new ƒ.Vector3();
      value.x = (dtl.restriction == "x" ? !dtl.inverted : dtl.inverted) ? dtl.x : undefined;
      value.y = (dtl.restriction == "y" ? !dtl.inverted : dtl.inverted) ? -dtl.y : undefined;
      value.z = (dtl.restriction == "z" ? !dtl.inverted : dtl.inverted) ?
        ((value.y == undefined) ? -dtl.y : dtl.x) : undefined;
      value = value.map((_c: number) => _c || 0);

      if (mtxTransform instanceof ƒ.Matrix4x4)
        this.transform3(dtl.transform, value, mtxTransform, distance);
      if (mtxTransform instanceof ƒ.Matrix3x3)
        this.transform2(dtl.transform, value.toVector2(), mtxTransform, 1);

      // component.mutate(component.getMutator());
    };

    private transform3(_transform: TRANSFORM, _value: ƒ.Vector3, _mtxTransform: ƒ.Matrix4x4, _distance: number): void {
      switch (_transform) {
        case TRANSFORM.TRANSLATE:
          let factorTranslation: number = 0.001; // TODO: eliminate magic numbers
          _value.scale(factorTranslation * _distance);
          let translation: ƒ.Vector3 = _mtxTransform.translation;
          translation.add(_value);
          _mtxTransform.translation = translation;
          break;
        case TRANSFORM.ROTATE:
          let factorRotation: number = 1; // TODO: eliminate magic numbers
          _value.scale(factorRotation);
          let rotation: ƒ.Vector3 = _mtxTransform.rotation;
          rotation.add(_value);
          _mtxTransform.rotation = rotation;
          break;
        case TRANSFORM.SCALE:
          let factorScaling: number = 0.001; // TODO: eliminate magic numbers
          _value.scale(factorScaling);
          let scaling: ƒ.Vector3 = _mtxTransform.scaling;
          scaling.add(_value);
          _mtxTransform.scaling = scaling;
          break;
      }
    }

    private transform2(_transform: TRANSFORM, _value: ƒ.Vector2, _mtxTransform: ƒ.Matrix3x3, _distance: number): void {
      switch (_transform) {
        case TRANSFORM.TRANSLATE:
          let factorTranslation: number = 0.001; // TODO: eliminate magic numbers
          _value.scale(factorTranslation * _distance);
          let translation: ƒ.Vector2 = _mtxTransform.translation;
          translation.add(_value);
          _mtxTransform.translation = translation;
          break;
        case TRANSFORM.ROTATE:
          let factorRotation: number = 1; // TODO: eliminate magic numbers
          _value.scale(factorRotation);
          _mtxTransform.rotation += _value.x;
          break;
        case TRANSFORM.SCALE:
          let factorScaling: number = 0.001; // TODO: eliminate magic numbers
          _value.scale(factorScaling);
          let scaling: ƒ.Vector2 = _mtxTransform.scaling;
          scaling.add(_value);
          _mtxTransform.scaling = scaling;
          break;
      }
    }

    private select(_details: ƒui.Details, _focus: boolean = true): void {
      for (let child of this.dom.children)
        child.classList.remove("selected");
      _details.classList.add("selected");
      this.selected = _details.getAttribute("key");
      if (_focus)
        _details.focus();
    }

    private getSelected(): ƒui.Details {
      for (let child of this.dom.children)
        if (child.classList.contains("selected"))
          return <ƒui.Details>child;
    }

    private createComponent(_resource: Object): ƒ.Component {
      if (_resource instanceof ScriptInfo)
        if (_resource.isComponent)
          return new (<ƒ.General>_resource.script)();

      let typeComponent: typeof ƒ.Component = this.findComponentType(_resource);
      return new (<ƒ.General>typeComponent)(_resource);
    }

    private findComponentType(_resource: Object): typeof ƒ.Component {
      for (let entry of resourceToComponent)
        if (_resource instanceof entry[0])
          return entry[1];
    }

    // private storeSelected(): void {
    //   sessionStorage.setItem(this.id, this.selected);
    // }
  }
}