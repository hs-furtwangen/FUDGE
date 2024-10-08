// /<reference types="../../../node_modules/electron/Electron"/>
///<reference path="Definition.ts"/>

namespace Fudge {
  import ƒ = FudgeCore;
  // import ƒaid = FudgeAid;
  import ƒui = FudgeUserInterface;

  export const ipcRenderer: Electron.IpcRenderer = require("electron").ipcRenderer; // Replace with:
  export const remote: typeof import("@electron/remote") = require("@electron/remote");

  export let project: Project; // = new Project();

  /**
   * The uppermost container for all panels controlling data flow between. 
   * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
   */
  export class Page {
    public static goldenLayoutModule: ƒ.General = (globalThis as ƒ.General).goldenLayout;  // ƒ.General is synonym for any... hack to get GoldenLayout to work
    public static modeTransform: TRANSFORM = TRANSFORM.TRANSLATE;
    // private static idCounter: number = 0;
    private static goldenLayout: GoldenLayout;
    private static panels: Panel[] = [];
    private static physics: { [idGraph: string]: ƒ.Physics } = {};

    public static setDefaultProject(): void {
      ƒ.Debug.log("Set default project in local storage", project);
      if (project)
        localStorage.setItem("project", project.base.toString());
    }

    public static getLayout(): ResolvedLayoutConfig {
      return Page.goldenLayout.saveLayout();
    }

    public static loadLayout(_layout?: LayoutConfig): void {
      _layout ??= {
        header: {
          popout: false
        },
        root: {
          type: "row",
          isClosable: false,
          content: []
        }
      };

      Page.goldenLayout.loadLayout(_layout);
    }

    public static setTransform(_mode: TRANSFORM): void {
      Page.modeTransform = _mode;
      ƒ.Debug.fudge(`Transform mode: ${_mode}`);
    }

    public static getPhysics(_graph: ƒ.Graph): ƒ.Physics {
      return Page.physics[_graph.idResource] || (Page.physics[_graph.idResource] = new ƒ.Physics());
    }

    // called by windows load-listener
    private static async start(): Promise<void> {
      // ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL | ƒ.DEBUG_FILTER.SOURCE);

      ƒ.Debug.log("LocalStorage", localStorage);

      Page.setupGoldenLayout();
      ƒ.Project.mode = ƒ.MODE.EDITOR;

      Page.setupMainListeners();
      Page.setupPageListeners();
      // for testing:
      // ipcRenderer.emit(MENU.PANEL_PROJECT_OPEN);
      // ipcRenderer.emit(MENU.PANEL_GRAPH_OPEN);
      // ipcRenderer.emit(MENU.PROJECT_LOAD);
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: false });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: false });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: false });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_HELP_OPEN, on: true });

      if (localStorage.project) {
        ƒ.Debug.log("Load project referenced in local storage", localStorage.project);
        await Page.loadProject(new URL(localStorage.project));
      }
    }

    private static setupGoldenLayout(): void {
      Page.goldenLayout = new Page.goldenLayoutModule.GoldenLayout(); // GoldenLayout 2 as UMD-Module
      Page.goldenLayout.on("itemCreated", Page.hndPanelCreated);

      Page.goldenLayout.registerComponentConstructor(PANEL.PROJECT, PanelProject);
      Page.goldenLayout.registerComponentConstructor(PANEL.GRAPH, PanelGraph);
      Page.goldenLayout.registerComponentConstructor(PANEL.HELP, PanelHelp);
      Page.goldenLayout.registerComponentConstructor(PANEL.ANIMATION, PanelAnimation);
      Page.goldenLayout.registerComponentConstructor(PANEL.PARTICLE_SYSTEM, PanelParticleSystem);

      Page.loadLayout();
    }

    private static add(_panel: typeof Panel, _state?: JsonValue): void {
      const panelConfig: ComponentItemConfig = {
        type: "component",
        componentType: _panel.name,
        componentState: _state,
        title: "Panel",
        id: Page.generateID(_panel.name)
      };

      // if (!Page.goldenLayout.rootItem)  // workaround because golden Layout loses rootItem...
      //   Page.loadLayout(); // TODO: these two lines appear to be obsolete, the condition is not met

      Page.goldenLayout.addItemAtLocation(panelConfig, [{ typeId: LayoutManager.LocationSelector.TypeId.Root }]);
    }

    private static find(_type: typeof Panel): Panel[] {
      let result: Panel[] = [];
      result = Page.panels.filter(_panel => _panel instanceof _type);
      return result;
    }

    private static generateID(_name: string): string {
      let i: number = 0;
      while (this.goldenLayout.findFirstComponentItemById(_name + i))
        i++;
      return _name + i; // _name + Page.idCounter++;
    }

    //#region Page-Events from DOM
    private static setupPageListeners(): void {
      document.addEventListener(EVENT_EDITOR.SELECT, Page.hndEvent);
      document.addEventListener(EVENT_EDITOR.MODIFY, Page.hndEvent);
      document.addEventListener(EVENT_EDITOR.UPDATE, Page.hndEvent);
      document.addEventListener(EVENT_EDITOR.CLOSE, Page.hndEvent);
      document.addEventListener(EVENT_EDITOR.CREATE, Page.hndEvent);
      document.addEventListener(ƒui.EVENT.SAVE_HISTORY, Page.hndEvent);
      document.addEventListener(EVENT_EDITOR.DELETE, Page.hndEvent);
      // document.addEventListener(EVENT_EDITOR.TRANSFORM, Page.hndEvent);
      document.addEventListener("keyup", Page.hndKey);
    }

    /** Send custom copies of the given event to the panels */
    private static broadcast(_event: EditorEvent): void {
      let detail: EventDetail = _event.detail || {};
      let sender: Panel | Page = detail?.sender;
      detail.sender = Page;
      for (let panel of Page.panels) {
        if (panel != sender) // don't send back to original sender
          panel.dispatch(<EVENT_EDITOR>_event.type, { detail: detail });
      }
    }

    private static hndKey = async (_event: KeyboardEvent): Promise<void> => {
      document.exitPointerLock();

      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.T:
          Page.setTransform(TRANSFORM.TRANSLATE);
          break;
        case ƒ.KEYBOARD_CODE.R:
          Page.setTransform(TRANSFORM.ROTATE);
          break;
        case ƒ.KEYBOARD_CODE.E:
          // TODO: don't switch to scale mode when using fly-camera and pressing E
          Page.setTransform(TRANSFORM.SCALE);
          break;
        case ƒ.KEYBOARD_CODE.Z:
          if (!_event.ctrlKey)
            return;

          if (_event.shiftKey)
            await History.redo();
          else
            await History.undo();

          Page.broadcast(new EditorEvent(EVENT_EDITOR.UPDATE, {}));
          break;
      }
    };

    private static hndEvent = async (_event: EditorEvent): Promise<void> => {
      switch (_event.type) {
        case ƒui.EVENT.SAVE_HISTORY:
          await History.save(HISTORY.MUTATE, _event.detail["mutable"], _event.detail["mutator"]);
          break;
        case EVENT_EDITOR.CLOSE:
          let view: View = _event.detail.view;
          if (view instanceof Panel)
            Page.panels.splice(Page.panels.indexOf(view), 1);
          break;
        case EVENT_EDITOR.DELETE:
          if (_event.detail.sender != History)
            return;
        default:
          Page.broadcast(_event);
          break;
      }
    };
    //#endregion

    private static hndPanelCreated = (_event: EventEmitter.BubblingEvent): void => {
      let target: ComponentItem = _event.target as ComponentItem;
      if (target instanceof Page.goldenLayoutModule.ComponentItem) {
        Page.panels.push(<Panel>target.component);
      }
    };

    private static async loadProject(_url: URL): Promise<void> {
      await loadProject(_url);
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: true });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: true });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: true });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_ANIMATION_OPEN, on: true });
      ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PARTICLE_SYSTEM_OPEN, on: true });
    }

    //#region Main-Events from Electron
    private static setupMainListeners(): void {
      ipcRenderer.on(MENU.PROJECT_NEW, async (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        ƒ.Project.clear();
        await newProject();
        ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: true });
        ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: true });
        ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: true });
        ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_ANIMATION_OPEN, on: true });
        ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PARTICLE_SYSTEM_OPEN, on: true });
      });

      ipcRenderer.on(MENU.PROJECT_SAVE, async (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        if (await saveProject())
          Page.setDefaultProject();
      });

      ipcRenderer.on(MENU.PROJECT_LOAD, async (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        let url: URL = await promptLoadProject();
        if (!url)
          return;
        await Page.loadProject(url);
      });

      ipcRenderer.on(MENU.PANEL_GRAPH_OPEN, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.add(PanelGraph, null);
      });

      ipcRenderer.on(MENU.PANEL_PROJECT_OPEN, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.add(PanelProject, null);
      });

      ipcRenderer.on(MENU.PANEL_HELP_OPEN, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.add(PanelHelp, null);
      });

      ipcRenderer.on(MENU.QUIT, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.setDefaultProject();
      });

      ipcRenderer.on(MENU.PANEL_ANIMATION_OPEN, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.add(PanelAnimation, null);
        // let panel: Panel = PanelManager.instance.createPanelFromTemplate(new ViewAnimationTemplate(), "Animation Panel");
        // PanelManager.instance.addPanel(panel);
      });

      ipcRenderer.on(MENU.PANEL_PARTICLE_SYSTEM_OPEN, (_event: Electron.IpcRendererEvent, _args: unknown[]) => {
        Page.add(PanelParticleSystem, null);
        // let panel: Panel = PanelManager.instance.createPanelFromTemplate(new ViewAnimationTemplate(), "Animation Panel");
        // PanelManager.instance.addPanel(panel);
      });
    }
  }

  // function welcome(container: GoldenLayout.Container, state: Object): void {
  //   container.getElement().html("<div>Welcome</div>");
  // }
}