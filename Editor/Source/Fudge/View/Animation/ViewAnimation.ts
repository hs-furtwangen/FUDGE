namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * View and edit the animatable properties of a node with an attached component animation.
   * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022 | Jirka Dell'Oro-Friedl, HFU, 2023
   */
  export class ViewAnimation extends View {
    public keySelected: ƒ.AnimationKey<number>;
    private node: ƒ.Node;
    private cmpAnimation: ƒ.ComponentAnimation;
    private animation: ƒ.Animation;
    private playbackTime: number = 0;

    private propertyList: HTMLDivElement;
    private controller: ControllerAnimation;

    private toolbar: HTMLDivElement;
    private frameInput: HTMLInputElement;

    private time: ƒ.Time = new ƒ.Time();
    private idInterval: number;

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);
      this.setAnimation(null);
      this.createToolbar();

      let title: string = "● Rightclick to add a property to animate\n";
      title += "● Choose a time in the animation sheet\n";
      title += "● Manipulate a property to add a keyframe\n";
      this.dom.title = title;

      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.DELETE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.CONTEXTMENU, this.openContextMenu);
      this.dom.addEventListener(ƒui.EVENT.INPUT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.FOCUS_IN, this.hndEvent);
      
      this.dom.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOver);
      this.dom.addEventListener(ƒui.EVENT.DROP, this.hndDrop);
    }

    protected hndDragOver = (_event: DragEvent): void =>  {
      _event.dataTransfer.dropEffect = "none";

      let source: Object = ƒui.Clipboard.dragDrop.get()[0];
      if (!(source instanceof ƒ.Node && source.getComponent(ƒ.ComponentAnimation)?.animation))
        return;

      _event.dataTransfer.dropEffect = "link";
      _event.preventDefault();
      _event.stopPropagation();
    };

    protected hndDrop = (_event: DragEvent): void => {
      let source: Object = ƒui.Clipboard.dragDrop.get()[0];
      this.dispatch(EVENT_EDITOR.SELECT, { bubbles: true, detail: { node: <ƒ.Node>source } });
    };

    //#region context menu
    protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      let path: string[] = [];

      if (this.node != undefined) {
        let item: Electron.MenuItem;
        item = new remote.MenuItem({
          label: "Add Property",
          submenu: this.getNodeSubmenu(this.node, path, _callback)
        });
        menu.append(item);

        item = new remote.MenuItem({ label: "Delete Property", id: String(CONTEXTMENU.DELETE_PROPERTY), click: _callback, accelerator: "D" });
        menu.append(item);

        item = new remote.MenuItem({ label: "Convert to Animation", id: String(CONTEXTMENU.CONVERT_ANIMATION), click: _callback, accelerator: "C" });
        menu.append(item);
      }

      return menu;
    }

    protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
      let choice: CONTEXTMENU = Number(_item.id);
      ƒ.Debug.fudge(`MenuSelect | id: ${CONTEXTMENU[_item.id]} | event: ${_event}`);

      switch (choice) {
        case CONTEXTMENU.ADD_PROPERTY:
          // defined in getMutatorSubmenu, this seems to be the only way to keep the path associated with the menu item, attaching anything to item
          break;
        case CONTEXTMENU.DELETE_PROPERTY:
          if (!(document.activeElement instanceof HTMLElement)) return;
          this.controller.deleteProperty(document.activeElement);
          this.createPropertyList();
          this.animate();
          break;
        case CONTEXTMENU.CONVERT_ANIMATION:
          if (this.animation instanceof ƒ.AnimationSprite) {
            let animation: ƒ.Animation = this.animation.convertToAnimation();
            ƒ.Debug.log(animation);
          }
      }
    }

    private getNodeSubmenu(_node: ƒ.Node, _path: string[], _callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      for (const componentClass of ƒ.Component.subclasses) {
        //@ts-ignore
        _node.getComponents(componentClass).forEach((_component, _index) => { // we need to get the attached componnents as array so we can reconstuct their path
          let path: string[] = Object.assign([], _path);
          path.push("components");
          path.push(_component.type);
          path.push(_index.toString());
          let mutator: ƒ.Mutator = _component.getMutatorForAnimation();
          if (mutator && Object.keys(mutator).length > 0) {
            let item: Electron.MenuItem;
            item = new remote.MenuItem(
              { label: _component.type, submenu: this.getMutatorSubmenu(mutator, path, _callback) }
            );
            menu.append(item);
          }
        });
      }

      for (const child of _node.getChildren()) {
        let path: string[] = Object.assign([], _path);
        path.push("children");
        path.push(child.name);
        let item: Electron.MenuItem;
        item = new remote.MenuItem(
          { label: child.name, submenu: this.getNodeSubmenu(child, path, _callback) }
        );
        menu.append(item);
      }

      return menu;
    }

    private getMutatorSubmenu(_mutator: ƒ.Mutator, _path: string[], _callback: ContextMenuCallback): Electron.Menu {
      const menu: Electron.Menu = new remote.Menu();
      for (const property in _mutator) {
        let item: Electron.MenuItem;
        let path: string[] = Object.assign([], _path);
        path.push(property);
        if (_mutator[property]?.constructor === Object) {
          item = new remote.MenuItem(
            { label: property, submenu: this.getMutatorSubmenu(_mutator[property], path, _callback) }
          );
        } else {
          item = new remote.MenuItem(
            {
              label: property, id: String(CONTEXTMENU.ADD_PROPERTY), click: () => {
                this.controller.addProperty(path, this.node, this.playbackTime);
                this.createPropertyList();
                this.animate();
              }
            }
          );
        }
        menu.append(item);
      }

      return menu;
    }
    //#endregion

    private createToolbar(): void {
      this.toolbar = document.createElement("div");
      this.toolbar.id = "toolbar";

      ["previous", "play", "next"]
        .map(_id => {
          let button: HTMLButtonElement = document.createElement("button");
          button.id = _id;
          button.className = "buttonIcon";
          button.onclick = this.hndToolbarClick;
          return button;
        })
        .forEach(_button => this.toolbar.appendChild(_button));

      this.frameInput = document.createElement("input");
      this.frameInput.type = "number";
      this.frameInput.min = "0";
      this.frameInput.id = "frameinput";
      this.frameInput.addEventListener("input", (_event: InputEvent) => {
        this.playbackTime = Number.parseInt(this.frameInput.value) * 1000 / this.animation.fps;
        this.animate();
      });
      this.toolbar.appendChild(this.frameInput);
    }

    private hndEvent = (_event: EditorEvent): void => {
      switch (_event.type) {
        case EVENT_EDITOR.SELECT:
          if (_event.detail.data instanceof ƒ.AnimationKey) {
            this.keySelected = _event.detail.data;
            break;
          }
          if (_event.detail.node != null) {
            this.node = _event.detail.node;
            this.cmpAnimation = this.node.getComponent(ƒ.ComponentAnimation);
            this.contextMenu = this.getContextMenu(this.contextMenuCallback.bind(this));
            if (this.cmpAnimation?.animation != this.animation)
              this.setAnimation(<ƒ.Animation>this.cmpAnimation?.animation);
            else
              _event.stopPropagation();
          }
          break;
        case EVENT_EDITOR.MODIFY:
          if (_event.detail.mutable instanceof ƒ.ComponentAnimation) {
            // switched animation in a ComponentAnimation
            if (this.node == _event.detail.mutable.node)
              this.dispatch(EVENT_EDITOR.SELECT, { detail: { node: _event.detail.mutable.node } });
            break;
          }

          if (!(_event.detail.view instanceof ViewAnimation || _event.detail.view instanceof ViewAnimationSheet))
            break;

          if (_event.detail.view instanceof ViewAnimationSheet)
            this.pause();

          this.playbackTime = _event.detail.data;

          if (!this.animation)
            break;

          this.frameInput.value = (Math.trunc(this.playbackTime / 1000 * this.animation.fps)).toString();
          this.animation.clearCache();
          let nodeMutator: ƒ.Mutator = this.cmpAnimation?.updateAnimation(this.playbackTime) || {};
          this.controller?.update(nodeMutator, this.playbackTime);
          this.propertyList.dispatchEvent(new CustomEvent(EVENT_EDITOR.MODIFY));
          break;
        case ƒui.EVENT.INPUT:
        case ƒui.EVENT.FOCUS_IN:
          let target: HTMLElement = <HTMLElement>_event.target;
          if (target instanceof ƒui.CustomElementDigit)
            target = target.parentElement;
          if (target instanceof ƒui.CustomElementStepper) {
            this.controller.updateSequence(this.playbackTime, target, _event.type == ƒui.EVENT.INPUT);
          }
          this.animate();
          break;
      }
    };

    private setAnimation(_animation: ƒ.Animation): void {
      if (_animation) {
        this.dom.innerHTML = "";
        this.dom.appendChild(this.toolbar);
        this.animation = _animation;
        this.createPropertyList();
        this.animate();
      } else {
        this.animation = undefined;
        this.dom.innerHTML = "Drop a node with an attached animation here to edit";
      }
    }

    private createPropertyList(): void {
      let nodeMutator: ƒ.Mutator = this.animation.getState(this.playbackTime, 0, this.cmpAnimation.quantization) || {};

      let newPropertyList: HTMLDivElement = ƒui.Generator.createInterfaceFromMutator(nodeMutator);
      if (this.dom.contains(this.propertyList))
        this.dom.replaceChild(newPropertyList, this.propertyList);
      else
        this.dom.appendChild(newPropertyList);
      this.propertyList = newPropertyList;
      this.propertyList.id = "propertylist";

      this.controller = new ControllerAnimation(this.animation, this.propertyList, this);
      this.controller.update(nodeMutator);
      // ƒui-EVENT must not be dispatched!
      // this.dom.dispatchEvent(new CustomEvent(ƒui.EVENT.CLICK));
      this.propertyList.dispatchEvent(new CustomEvent(EVENT_EDITOR.MODIFY));
    }

    private animate(): void {
      this.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true, detail: { data: this.playbackTime } });
    }

    private hndToolbarClick = (_event: MouseEvent): void => {
      let target: HTMLInputElement = <HTMLInputElement>_event.target;
      switch (target.id) {
        case "previous":
          this.playbackTime = this.controller.nextKey(this.playbackTime, "backward");
          this.animate();
          break;
        case "play":
          if (this.idInterval == null) {
            target.id = "pause";
            this.time.set(this.playbackTime);
            this.idInterval = window.setInterval(() => {
              this.playbackTime = this.time.get() % this.animation.totalTime;
              this.animate();
            }, 1000 / this.animation.fps);
          }
          break;
        case "pause":
          this.pause();
          break;
        case "next":
          this.playbackTime = this.controller.nextKey(this.playbackTime, "forward");
          this.animate();
          break;
      }
    };

    private pause(): void {
      if (this.idInterval == null) return;
      this.toolbar.querySelector("#pause").id = "play";
      window.clearInterval(this.idInterval);
      this.idInterval = null;
    }
  }
}