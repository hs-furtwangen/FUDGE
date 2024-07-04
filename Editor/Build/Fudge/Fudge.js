var Fudge;
(function (Fudge) {
    // import ƒui = FudgeUserInterface;
    // import ƒ = FudgeCore;
    class ContextMenu {
        static appendCopyPaste(_menu) {
            _menu.append(new Fudge.remote.MenuItem({ role: "copy" }));
            _menu.append(new Fudge.remote.MenuItem({ role: "cut" }));
            _menu.append(new Fudge.remote.MenuItem({ role: "paste" }));
        }
        static getSubclassMenu(_id, _class, _callback) {
            const menu = new Fudge.remote.Menu();
            for (let iSubclass in _class.subclasses) {
                let subclass = _class.subclasses[iSubclass];
                let item = new Fudge.remote.MenuItem({ label: subclass.name, id: String(_id), click: _callback });
                //@ts-ignore
                item.overrideProperty("iSubclass", iSubclass);
                menu.append(item);
            }
            return menu;
        }
    }
    Fudge.ContextMenu = ContextMenu;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    let CONTEXTMENU;
    (function (CONTEXTMENU) {
        // SKETCH = ViewSketch,
        CONTEXTMENU[CONTEXTMENU["ADD_NODE"] = 0] = "ADD_NODE";
        CONTEXTMENU[CONTEXTMENU["ACTIVATE_NODE"] = 1] = "ACTIVATE_NODE";
        CONTEXTMENU[CONTEXTMENU["DELETE_NODE"] = 2] = "DELETE_NODE";
        CONTEXTMENU[CONTEXTMENU["ADD_COMPONENT"] = 3] = "ADD_COMPONENT";
        CONTEXTMENU[CONTEXTMENU["DELETE_COMPONENT"] = 4] = "DELETE_COMPONENT";
        CONTEXTMENU[CONTEXTMENU["ADD_COMPONENT_SCRIPT"] = 5] = "ADD_COMPONENT_SCRIPT";
        CONTEXTMENU[CONTEXTMENU["EDIT"] = 6] = "EDIT";
        CONTEXTMENU[CONTEXTMENU["CREATE_FOLDER"] = 7] = "CREATE_FOLDER";
        CONTEXTMENU[CONTEXTMENU["CREATE_MESH"] = 8] = "CREATE_MESH";
        CONTEXTMENU[CONTEXTMENU["CREATE_MATERIAL"] = 9] = "CREATE_MATERIAL";
        CONTEXTMENU[CONTEXTMENU["CREATE_GRAPH"] = 10] = "CREATE_GRAPH";
        CONTEXTMENU[CONTEXTMENU["CREATE_ANIMATION"] = 11] = "CREATE_ANIMATION";
        CONTEXTMENU[CONTEXTMENU["CREATE_PARTICLE_EFFECT"] = 12] = "CREATE_PARTICLE_EFFECT";
        CONTEXTMENU[CONTEXTMENU["SYNC_INSTANCES"] = 13] = "SYNC_INSTANCES";
        CONTEXTMENU[CONTEXTMENU["REMOVE_COMPONENT"] = 14] = "REMOVE_COMPONENT";
        CONTEXTMENU[CONTEXTMENU["ADD_JOINT"] = 15] = "ADD_JOINT";
        CONTEXTMENU[CONTEXTMENU["DELETE_RESOURCE"] = 16] = "DELETE_RESOURCE";
        CONTEXTMENU[CONTEXTMENU["ORTHGRAPHIC_CAMERA"] = 17] = "ORTHGRAPHIC_CAMERA";
        CONTEXTMENU[CONTEXTMENU["RENDER_CONTINUOUSLY"] = 18] = "RENDER_CONTINUOUSLY";
        CONTEXTMENU[CONTEXTMENU["ADD_PROPERTY"] = 19] = "ADD_PROPERTY";
        CONTEXTMENU[CONTEXTMENU["DELETE_PROPERTY"] = 20] = "DELETE_PROPERTY";
        CONTEXTMENU[CONTEXTMENU["CONVERT_ANIMATION"] = 21] = "CONVERT_ANIMATION";
        CONTEXTMENU[CONTEXTMENU["ADD_PARTICLE_PROPERTY"] = 22] = "ADD_PARTICLE_PROPERTY";
        CONTEXTMENU[CONTEXTMENU["ADD_PARTICLE_FUNCTION"] = 23] = "ADD_PARTICLE_FUNCTION";
        CONTEXTMENU[CONTEXTMENU["ADD_PARTICLE_CONSTANT"] = 24] = "ADD_PARTICLE_CONSTANT";
        CONTEXTMENU[CONTEXTMENU["ADD_PARTICLE_CODE"] = 25] = "ADD_PARTICLE_CODE";
        CONTEXTMENU[CONTEXTMENU["ADD_PARTICLE_TRANSFORMATION"] = 26] = "ADD_PARTICLE_TRANSFORMATION";
        CONTEXTMENU[CONTEXTMENU["DELETE_PARTICLE_DATA"] = 27] = "DELETE_PARTICLE_DATA";
    })(CONTEXTMENU = Fudge.CONTEXTMENU || (Fudge.CONTEXTMENU = {}));
    let MENU;
    (function (MENU) {
        MENU["QUIT"] = "quit";
        MENU["PROJECT_NEW"] = "projectNew";
        MENU["PROJECT_SAVE"] = "projectSave";
        MENU["PROJECT_LOAD"] = "projectLoad";
        MENU["DEVTOOLS_OPEN"] = "devtoolsOpen";
        MENU["PANEL_GRAPH_OPEN"] = "panelGraphOpen";
        MENU["PANEL_ANIMATION_OPEN"] = "panelAnimationOpen";
        MENU["PANEL_PROJECT_OPEN"] = "panelProjectOpen";
        MENU["PANEL_HELP_OPEN"] = "panelHelpOpen";
        MENU["PANEL_PARTICLE_SYSTEM_OPEN"] = "panelParticleSystemOpen";
        MENU["FULLSCREEN"] = "fullscreen";
    })(MENU = Fudge.MENU || (Fudge.MENU = {}));
    let PANEL;
    (function (PANEL) {
        PANEL["GRAPH"] = "PanelGraph";
        PANEL["PROJECT"] = "PanelProject";
        PANEL["HELP"] = "PanelHelp";
        PANEL["ANIMATION"] = "PanelAnimation";
        PANEL["PARTICLE_SYSTEM"] = "PanelParticleSystem";
    })(PANEL = Fudge.PANEL || (Fudge.PANEL = {}));
    let VIEW;
    (function (VIEW) {
        VIEW["HIERARCHY"] = "ViewHierarchy";
        VIEW["ANIMATION"] = "ViewAnimation";
        VIEW["ANIMATION_SHEET"] = "ViewAnimationSheet";
        VIEW["RENDER"] = "ViewRender";
        VIEW["COMPONENTS"] = "ViewComponents";
        VIEW["CAMERA"] = "ViewCamera";
        VIEW["INTERNAL_TABLE"] = "ViewInternalTable";
        VIEW["INTERNAL_FOLDER"] = "ViewInternalFolder";
        VIEW["EXTERNAL"] = "ViewExternal";
        VIEW["PROPERTIES"] = "ViewProperties";
        VIEW["PREVIEW"] = "ViewPreview";
        VIEW["SCRIPT"] = "ViewScript";
        VIEW["PARTICLE_SYSTEM"] = "ViewParticleSystem";
        // SKETCH = ViewSketch,
        // MESH = ViewMesh,
    })(VIEW = Fudge.VIEW || (Fudge.VIEW = {}));
    let TRANSFORM;
    (function (TRANSFORM) {
        TRANSFORM["TRANSLATE"] = "translate";
        TRANSFORM["ROTATE"] = "rotate";
        TRANSFORM["SCALE"] = "scale";
    })(TRANSFORM = Fudge.TRANSFORM || (Fudge.TRANSFORM = {}));
    let GIZMOS;
    (function (GIZMOS) {
        GIZMOS["TRANSFORM"] = "Transform";
    })(GIZMOS = Fudge.GIZMOS || (Fudge.GIZMOS = {}));
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    let MIME;
    (function (MIME) {
        MIME["TEXT"] = "text";
        MIME["AUDIO"] = "audio";
        MIME["IMAGE"] = "image";
        MIME["MESH"] = "mesh";
        MIME["GLTF"] = "gltf";
        MIME["UNKNOWN"] = "unknown";
    })(MIME = Fudge.MIME || (Fudge.MIME = {}));
    let mime = new Map([
        [MIME.TEXT, ["ts", "json", "html", "htm", "css", "js", "txt"]],
        [MIME.MESH, ["obj"]],
        [MIME.AUDIO, ["mp3", "wav", "ogg"]],
        [MIME.IMAGE, ["png", "jpg", "jpeg", "tif", "tga", "gif"]],
        [MIME.GLTF, ["gltf", "glb"]]
    ]);
    const fs = require("fs");
    const p = require("path");
    class DirectoryEntry {
        path;
        pathRelative;
        dirent;
        stats;
        constructor(_path, _pathRelative, _dirent, _stats) {
            this.path = p.normalize(_path);
            this.pathRelative = p.normalize(_pathRelative);
            this.dirent = _dirent;
            this.stats = _stats;
        }
        static createRoot(_path) {
            let dirent = new fs.Dirent();
            dirent.name = p.basename(_path);
            dirent.isDirectory = () => true;
            return new DirectoryEntry(_path, "", dirent, null);
        }
        get name() {
            return this.dirent.name;
        }
        set name(_name) {
            let newPath = p.join(p.dirname(this.path), _name);
            if (fs.existsSync(newPath))
                throw new Error(`There is already a file with the specified name '${_name}'. Specify a different name.`);
            fs.renameSync(this.path, newPath);
            this.path = newPath;
            this.dirent.name = _name;
        }
        get isDirectory() {
            return this.dirent.isDirectory();
        }
        get type() {
            return this.isDirectory ? "Directory" : "File";
        }
        delete() {
            fs.rmSync(this.path, { recursive: true });
        }
        getDirectoryContent() {
            let dirents = fs.readdirSync(this.path, { withFileTypes: true });
            let content = [];
            for (let dirent of dirents) {
                let path = p.join(this.path, dirent.name);
                let pathRelative = p.join(this.pathRelative, dirent.name);
                let stats = fs.statSync(path);
                let entry = new DirectoryEntry(path, pathRelative, dirent, stats);
                content.push(entry);
            }
            return content;
        }
        getFileContent() {
            let content = fs.readFileSync(this.path, "utf8");
            return content;
        }
        addEntry(_entry) {
            fs.copyFileSync(_entry.path, p.join(this.path, _entry.name), fs.constants.COPYFILE_EXCL);
        }
        getMimeType() {
            let extension = this.name.split(".").pop();
            for (let type of mime) {
                if (type[1].indexOf(extension) > -1)
                    return type[0];
            }
            return MIME.UNKNOWN;
        }
        /**
         * Returns a path of DirectoryEntries starting at the root and ending at this DirectoryEntry.
         * The entries in the returned path ONLY have their relative path set. This is solely used for display purposes in {@link ViewExternal}s tree.
         */
        getPath() {
            let trace = [];
            let currentPath = this.pathRelative;
            while (currentPath != trace[trace.length - 1]?.pathRelative) {
                trace.push(new DirectoryEntry("", currentPath, null, null));
                currentPath = p.dirname(currentPath);
            }
            ;
            trace.reverse();
            return trace;
        }
    }
    Fudge.DirectoryEntry = DirectoryEntry;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    let EVENT_EDITOR;
    (function (EVENT_EDITOR) {
        /** An entity gets created, is not dispatched so far */
        EVENT_EDITOR["CREATE"] = "EDITOR_CREATE";
        /** An entity gets selected and it is necessary to switch contents in the views */
        EVENT_EDITOR["SELECT"] = "EDITOR_SELECT";
        /** An entity gets modified structurally and it is necessary to update views */
        EVENT_EDITOR["MODIFY"] = "EDITOR_MODIFY";
        /** Values of an entity change and it is necessary to update views */
        EVENT_EDITOR["UPDATE"] = "EDITOR_UPDATE";
        /** An entity gets deleted */
        EVENT_EDITOR["DELETE"] = "EDITOR_DELETE";
        /** A view or panel closes */
        EVENT_EDITOR["CLOSE"] = "EDITOR_CLOSE";
        /** A view or panel opens */
        EVENT_EDITOR["OPEN"] = "EDITOR_OPEN";
        EVENT_EDITOR["TRANSFORM"] = "EDITOR_TRANSFORM";
        /** An entity recieves focus and can be manipulated using the keyboard */
        EVENT_EDITOR["FOCUS"] = "EDITOR_FOCUS";
    })(EVENT_EDITOR = Fudge.EVENT_EDITOR || (Fudge.EVENT_EDITOR = {}));
    /**
     * Extension of CustomEvent that supports a detail field with the type EventDetail
     */
    class EditorEvent extends CustomEvent {
        static dispatch(_target, _type, _init) {
            _target.dispatchEvent(new EditorEvent(_type, _init));
        }
    }
    Fudge.EditorEvent = EditorEvent;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    const fs = require("fs");
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    async function newProject() {
        let filename = Fudge.remote.dialog.showOpenDialogSync(null, {
            properties: ["openDirectory", "createDirectory"], title: "Select/Create a folder to save the project to. The foldername becomes the name of your project", buttonLabel: "Save Project"
        });
        if (!filename)
            return;
        let base = new URL(new URL("file://" + filename[0]).toString() + "/");
        console.log("Path", base.toString());
        Fudge.project = new Fudge.Project(base);
        await saveProject(true);
        let ƒPath = new URL("../../", location.href);
        console.log(ƒPath);
        fs.copyFileSync(new URL("Editor/Source/Template/.gitignore.txt", ƒPath), new URL(".gitignore", base));
        fs.mkdirSync(new URL("Script/Source", base), { recursive: true });
        fs.mkdirSync(new URL("Script/Source/@types", base), { recursive: true });
        fs.mkdirSync(new URL("Script/Build", base), { recursive: true });
        let copyTemplates = {
            "CustomComponentScript.txt": "Source/CustomComponentScript.ts",
            "Main.txt": "Source/Main.ts",
            "tsconfig.txt": "Source/tsconfig.json",
            "Script.txt": " Build/Script.js",
            "Autoview.js": "../Autoview.js"
        };
        copyFiles(copyTemplates, new URL("Editor/Source/Template/", ƒPath), new URL("Script/", base));
        let definition = await fetch("https://hs-furtwangen.github.io/FUDGE/Distribution/FudgeCore.d.ts");
        fs.writeFileSync(new URL("Script/Source/@types/FudgeCore.d.ts", base), await definition.text());
        await loadProject(new URL(Fudge.project.fileIndex, Fudge.project.base));
    }
    Fudge.newProject = newProject;
    function copyFiles(_list, _srcPath, _destPath) {
        for (let copy in _list) {
            let src = new URL(copy, _srcPath);
            let dest = new URL(_list[copy], _destPath);
            fs.copyFileSync(src, dest);
        }
    }
    async function saveProject(_new = false) {
        if (!Fudge.project)
            return false;
        if (!await Fudge.project.openDialog())
            return false;
        unwatchFolder();
        let base = Fudge.project.base;
        if (_new) {
            let cssFileName = new URL(Fudge.project.fileStyles, base);
            fs.writeFileSync(cssFileName, Fudge.project.getProjectCSS());
        }
        let html = Fudge.project.getProjectHTML(Fudge.project.name);
        let htmlFileName = new URL(Fudge.project.fileIndex, base);
        fs.writeFileSync(htmlFileName, html);
        let jsonFileName = new URL(Fudge.project.fileInternal, base);
        fs.writeFileSync(jsonFileName, Fudge.project.getProjectJSON());
        jsonFileName = new URL(Fudge.project.fileInternalFolder, base);
        fs.writeFileSync(jsonFileName, Fudge.project.getResourceFolderJSON());
        jsonFileName = new URL(Fudge.project.fileSettings, base);
        fs.writeFileSync(jsonFileName, Fudge.project.getSettingsJSON());
        watchFolder();
        return true;
    }
    Fudge.saveProject = saveProject;
    async function promptLoadProject() {
        let filenames = Fudge.remote.dialog.showOpenDialogSync(null, {
            title: "Load Project", buttonLabel: "Load Project", properties: ["openFile"],
            filters: [{ name: "HTML-File", extensions: ["html", "htm"] }]
        });
        if (!filenames)
            return null;
        return new URL("file://" + filenames[0]);
    }
    Fudge.promptLoadProject = promptLoadProject;
    async function loadProject(_url) {
        let htmlContent = fs.readFileSync(_url, { encoding: "utf-8" });
        ƒ.Debug.groupCollapsed("File content");
        ƒ.Debug.info(htmlContent);
        ƒ.Debug.groupEnd();
        unwatchFolder();
        Fudge.project = new Fudge.Project(_url);
        await Fudge.project.load(htmlContent);
        watchFolder();
    }
    Fudge.loadProject = loadProject;
    function watchFolder() {
        let dir = new URL(".", Fudge.project.base);
        Fudge.watcher = fs.watch(dir, { recursive: true }, hndFileChange);
        async function hndFileChange(_event, _filename) {
            if (_filename == Fudge.project.fileIndex || _filename == Fudge.project.fileInternal || _filename == Fudge.project.fileScript) {
                unwatchFolder();
                let promise = ƒui.Dialog.prompt(null, false, "Important file change", "Reload project?", "Reload", "Cancel");
                if (await promise) {
                    await loadProject(Fudge.project.base);
                }
                else
                    Fudge.watcher = fs.watch(dir, { recursive: true }, hndFileChange);
            }
            document.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY));
        }
    }
    function unwatchFolder() {
        if (!Fudge.watcher)
            return;
        Fudge.watcher.unref();
        Fudge.watcher.close();
    }
})(Fudge || (Fudge = {}));
///<reference types="../../../node_modules/electron/Electron"/>
///<reference path="Definition.ts"/>
var Fudge;
///<reference types="../../../node_modules/electron/Electron"/>
///<reference path="Definition.ts"/>
(function (Fudge) {
    var ƒ = FudgeCore;
    // import ƒaid = FudgeAid;
    // import ƒui = FudgeUserInterface;
    Fudge.ipcRenderer = require("electron").ipcRenderer; // Replace with:
    Fudge.remote = require("@electron/remote");
    /**
     * The uppermost container for all panels controlling data flow between.
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class Page {
        static goldenLayoutModule = globalThis.goldenLayout; // ƒ.General is synonym for any... hack to get GoldenLayout to work
        static modeTransform = Fudge.TRANSFORM.TRANSLATE;
        // private static idCounter: number = 0;
        static goldenLayout;
        static panels = [];
        static physics = {};
        static setDefaultProject() {
            console.log("Set default project in local storage", Fudge.project);
            if (Fudge.project)
                localStorage.setItem("project", Fudge.project.base.toString());
        }
        static getLayout() {
            return Page.goldenLayout.saveLayout();
        }
        static loadLayout(_layout) {
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
        static setTransform(_mode) {
            Page.modeTransform = _mode;
            ƒ.Debug.fudge(`Transform mode: ${_mode}`);
        }
        static getPhysics(_graph) {
            return Page.physics[_graph.idResource] || (Page.physics[_graph.idResource] = new ƒ.Physics());
        }
        // called by windows load-listener
        static async start() {
            // ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL | ƒ.DEBUG_FILTER.SOURCE);
            console.log("LocalStorage", localStorage);
            Page.setupGoldenLayout();
            ƒ.Project.mode = ƒ.MODE.EDITOR;
            Page.setupMainListeners();
            Page.setupPageListeners();
            // for testing:
            // ipcRenderer.emit(MENU.PANEL_PROJECT_OPEN);
            // ipcRenderer.emit(MENU.PANEL_GRAPH_OPEN);
            // ipcRenderer.emit(MENU.PROJECT_LOAD);
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: false });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: false });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: false });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_HELP_OPEN, on: true });
            if (localStorage.project) {
                console.log("Load project referenced in local storage", localStorage.project);
                await Page.loadProject(new URL(localStorage.project));
            }
        }
        static setupGoldenLayout() {
            Page.goldenLayout = new Page.goldenLayoutModule.GoldenLayout(); // GoldenLayout 2 as UMD-Module
            Page.goldenLayout.on("itemCreated", Page.hndPanelCreated);
            Page.goldenLayout.registerComponentConstructor(Fudge.PANEL.PROJECT, Fudge.PanelProject);
            Page.goldenLayout.registerComponentConstructor(Fudge.PANEL.GRAPH, Fudge.PanelGraph);
            Page.goldenLayout.registerComponentConstructor(Fudge.PANEL.HELP, Fudge.PanelHelp);
            Page.goldenLayout.registerComponentConstructor(Fudge.PANEL.ANIMATION, Fudge.PanelAnimation);
            Page.goldenLayout.registerComponentConstructor(Fudge.PANEL.PARTICLE_SYSTEM, Fudge.PanelParticleSystem);
            Page.loadLayout();
        }
        static add(_panel, _state) {
            const panelConfig = {
                type: "component",
                componentType: _panel.name,
                componentState: _state,
                title: "Panel",
                id: Page.generateID(_panel.name)
            };
            // if (!Page.goldenLayout.rootItem)  // workaround because golden Layout loses rootItem...
            //   Page.loadLayout(); // TODO: these two lines appear to be obsolete, the condition is not met
            Page.goldenLayout.addItemAtLocation(panelConfig, [{ typeId: 7 /* LayoutManager.LocationSelector.TypeId.Root */ }]);
        }
        static find(_type) {
            let result = [];
            result = Page.panels.filter(_panel => _panel instanceof _type);
            return result;
        }
        static generateID(_name) {
            let i = 0;
            while (this.goldenLayout.findFirstComponentItemById(_name + i))
                i++;
            return _name + i; // _name + Page.idCounter++;
        }
        //#region Page-Events from DOM
        static setupPageListeners() {
            document.addEventListener(Fudge.EVENT_EDITOR.SELECT, Page.hndEvent);
            document.addEventListener(Fudge.EVENT_EDITOR.MODIFY, Page.hndEvent);
            document.addEventListener(Fudge.EVENT_EDITOR.UPDATE, Page.hndEvent);
            document.addEventListener(Fudge.EVENT_EDITOR.CLOSE, Page.hndEvent);
            document.addEventListener(Fudge.EVENT_EDITOR.CREATE, Page.hndEvent);
            // document.addEventListener(EVENT_EDITOR.TRANSFORM, Page.hndEvent);
            document.addEventListener("keyup", Page.hndKey);
        }
        /** Send custom copies of the given event to the panels */
        static broadcast(_event) {
            let detail = _event.detail || {};
            let sender = detail?.sender;
            detail.sender = Page;
            for (let panel of Page.panels) {
                if (panel != sender) // don't send back to original sender
                    panel.dispatch(_event.type, { detail: detail });
            }
        }
        static hndKey = (_event) => {
            document.exitPointerLock();
            switch (_event.code) {
                case ƒ.KEYBOARD_CODE.T:
                    Page.setTransform(Fudge.TRANSFORM.TRANSLATE);
                    break;
                case ƒ.KEYBOARD_CODE.R:
                    Page.setTransform(Fudge.TRANSFORM.ROTATE);
                    break;
                case ƒ.KEYBOARD_CODE.E:
                    // TODO: don't switch to scale mode when using fly-camera and pressing E
                    Page.setTransform(Fudge.TRANSFORM.SCALE);
                    break;
            }
        };
        static hndEvent(_event) {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.CLOSE:
                    let view = _event.detail.view;
                    if (view instanceof Fudge.Panel)
                        Page.panels.splice(Page.panels.indexOf(view), 1);
                    // console.log("Closed", view);
                    break;
                default:
                    Page.broadcast(_event);
                    break;
            }
        }
        //#endregion
        static hndPanelCreated = (_event) => {
            let target = _event.target;
            if (target instanceof Page.goldenLayoutModule.ComponentItem) {
                Page.panels.push(target.component);
            }
        };
        static async loadProject(_url) {
            await Fudge.loadProject(_url);
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: true });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: true });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: true });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_ANIMATION_OPEN, on: true });
            Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PARTICLE_SYSTEM_OPEN, on: true });
        }
        //#region Main-Events from Electron
        static setupMainListeners() {
            Fudge.ipcRenderer.on(Fudge.MENU.PROJECT_NEW, async (_event, _args) => {
                ƒ.Project.clear();
                await Fudge.newProject();
                Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PROJECT_SAVE, on: true });
                Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PROJECT_OPEN, on: true });
                Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_GRAPH_OPEN, on: true });
                Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_ANIMATION_OPEN, on: true });
                Fudge.ipcRenderer.send("enableMenuItem", { item: Fudge.MENU.PANEL_PARTICLE_SYSTEM_OPEN, on: true });
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PROJECT_SAVE, async (_event, _args) => {
                if (await Fudge.saveProject())
                    Page.setDefaultProject();
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PROJECT_LOAD, async (_event, _args) => {
                let url = await Fudge.promptLoadProject();
                if (!url)
                    return;
                await Page.loadProject(url);
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PANEL_GRAPH_OPEN, (_event, _args) => {
                Page.add(Fudge.PanelGraph, null);
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PANEL_PROJECT_OPEN, (_event, _args) => {
                Page.add(Fudge.PanelProject, null);
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PANEL_HELP_OPEN, (_event, _args) => {
                Page.add(Fudge.PanelHelp, null);
            });
            Fudge.ipcRenderer.on(Fudge.MENU.QUIT, (_event, _args) => {
                Page.setDefaultProject();
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PANEL_ANIMATION_OPEN, (_event, _args) => {
                Page.add(Fudge.PanelAnimation, null);
                // let panel: Panel = PanelManager.instance.createPanelFromTemplate(new ViewAnimationTemplate(), "Animation Panel");
                // PanelManager.instance.addPanel(panel);
            });
            Fudge.ipcRenderer.on(Fudge.MENU.PANEL_PARTICLE_SYSTEM_OPEN, (_event, _args) => {
                Page.add(Fudge.PanelParticleSystem, null);
                // let panel: Panel = PanelManager.instance.createPanelFromTemplate(new ViewAnimationTemplate(), "Animation Panel");
                // PanelManager.instance.addPanel(panel);
            });
        }
    }
    Fudge.Page = Page;
    // function welcome(container: GoldenLayout.Container, state: Object): void {
    //   container.getElement().html("<div>Welcome</div>");
    // }
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    ƒ.Serializer.registerNamespace(Fudge);
    class Project extends ƒ.Mutable {
        // public title: string = "NewProject";
        base;
        name;
        fileIndex = "index.html";
        fileInternal = "Internal.json";
        fileInternalFolder = "InternalFolder.json";
        fileScript = "Script/Build/Script.js";
        fileSettings = "settings.json";
        fileStyles = "styles.css";
        graphAutoView = "";
        // private includeAutoViewScript: boolean = true;
        #resourceFolder;
        #document;
        constructor(_base) {
            super();
            this.base = _base;
            this.name = _base.toString().split("/").slice(-2, -1)[0];
            this.fileIndex = _base.toString().split("/").pop() || this.fileIndex;
            ƒ.Project.clear();
            ƒ.Project.addEventListener("graphMutated" /* ƒ.EVENT.GRAPH_MUTATED */, 
            //@ts-ignore
            (_event) => Fudge.Page.broadcast(new Fudge.EditorEvent(Fudge.EVENT_EDITOR.UPDATE)));
        }
        get resourceFolder() {
            if (!this.#resourceFolder)
                this.#resourceFolder = new Fudge.ResourceFolder("Resources");
            return this.#resourceFolder;
        }
        async openDialog() {
            let promise = ƒui.Dialog.prompt(Fudge.project, false, "Review project settings", "Adjust settings and press OK", "OK", "Cancel");
            ƒui.Dialog.dom.addEventListener("change" /* ƒui.EVENT.CHANGE */, this.hndChange);
            if (await promise) {
                let mutator = ƒui.Controller.getMutator(this, ƒui.Dialog.dom, this.getMutator());
                this.mutate(mutator);
                return true;
            }
            else
                return false;
        }
        hndChange = (_event) => {
            let mutator = ƒui.Controller.getMutator(this, ƒui.Dialog.dom, this.getMutator());
            console.log(mutator, this);
        };
        async load(_htmlContent) {
            ƒ.Physics.activeInstance = new ƒ.Physics();
            const parser = new DOMParser();
            this.#document = parser.parseFromString(_htmlContent, "text/html");
            const head = this.#document.querySelector("head");
            this.loadFonts(head);
            const scripts = head.querySelectorAll("script");
            for (let script of scripts) {
                if (script.getAttribute("editor") == "true") {
                    let url = script.getAttribute("src");
                    ƒ.Debug.fudge("Load script: ", url);
                    await ƒ.Project.loadScript(new URL(url, this.base).toString());
                    console.log("ComponentScripts", ƒ.Project.getComponentScripts());
                    console.log("Script Namespaces", ƒ.Project.scriptNamespaces);
                }
            }
            const resourceLink = head.querySelector("link[type=resources]");
            let resourceFile = resourceLink.getAttribute("src");
            Fudge.project.fileInternal = resourceFile;
            ƒ.Project.baseURL = this.base;
            let reconstruction = await ƒ.Project.loadResources(new URL(resourceFile, this.base).toString());
            ƒ.Debug.groupCollapsed("Deserialized");
            ƒ.Debug.info(reconstruction);
            ƒ.Debug.groupEnd();
            ƒ.Physics.cleanup(); // remove potential rigidbodies
            try {
                const resourceFolderContent = await (await fetch(new URL(this.fileInternalFolder, this.base).toString())).text();
                const resourceFolder = await ƒ.Serializer.deserialize(ƒ.Serializer.parse(resourceFolderContent));
                if (resourceFolder instanceof Fudge.ResourceFolder)
                    this.#resourceFolder = resourceFolder;
            }
            catch (_error) {
                ƒ.Debug.warn(`Failed to load '${this.fileInternalFolder}'. A new resource folder was created and will be saved.`, _error);
            }
            let settings = head.querySelector("meta[type=settings]");
            let projectSettings = settings?.getAttribute("project");
            projectSettings = projectSettings?.replace(/'/g, "\"");
            await Fudge.project.mutate(JSON.parse(projectSettings || "{}"));
            let config;
            try {
                const settingsContent = await (await fetch(new URL(this.fileSettings, this.base).toString())).text();
                const panelSettings = ƒ.Serializer.parse(settingsContent);
                config = Fudge.Page.goldenLayoutModule.LayoutConfig.fromResolved(panelSettings.layout);
            }
            catch (_error) {
                ƒ.Debug.warn(`Failed to load '${this.fileSettings}'. A new settings file was created and will be saved.`, _error);
            }
            Fudge.Page.loadLayout(config);
        }
        getProjectJSON() {
            let serialization = ƒ.Project.serialize();
            let json = ƒ.Serializer.stringify(serialization);
            return json;
        }
        getResourceFolderJSON() {
            return ƒ.Serializer.stringify(ƒ.Serializer.serialize(this.resourceFolder));
        }
        getSettingsJSON() {
            let settings = {};
            settings.layout = Fudge.Page.getLayout();
            return ƒ.Serializer.stringify(settings);
        }
        getProjectCSS() {
            let content = "";
            content += "html, body {\n  padding: 0px;\n  margin: 0px;\n  width: 100%;\n  height: 100%;\n overflow: hidden;\n}\n\n";
            content += "dialog { \n  text-align: center; \n}\n\n";
            content += "canvas.fullscreen { \n  width: 100vw; \n  height: 100vh; \n}";
            return content;
        }
        getProjectHTML(_title) {
            if (!this.#document)
                return this.createProjectHTML(_title);
            this.#document.title = _title;
            let settings = document.createElement("meta");
            settings.setAttribute("type", "settings");
            settings.setAttribute("autoview", this.graphAutoView);
            settings.setAttribute("project", this.settingsStringify());
            this.#document.head.querySelector("meta[type=settings]").replaceWith(settings);
            // let autoViewScript: HTMLScriptElement = this.#document.querySelector("script[name=autoView]");
            // if (this.includeAutoViewScript) {
            //   if (!autoViewScript)
            //     this.#document.head.appendChild(this.getAutoViewScript());
            // }
            // else
            //   if (autoViewScript)
            //     this.#document.head.removeChild(autoViewScript);
            return this.stringifyHTML(this.#document);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            if (types.graphAutoView)
                types.graphAutoView = this.getGraphs();
            return types;
        }
        reduceMutator(_mutator) {
            delete _mutator.base;
            delete _mutator.fileIndex;
            delete _mutator.fileInternal;
            delete _mutator.fileInternalFolder;
            delete _mutator.fileScript;
            delete _mutator.fileSettings;
            delete _mutator.fileStyles;
        }
        getGraphs() {
            let graphs = ƒ.Project.getResourcesByType(ƒ.Graph);
            let result = {};
            for (let graph of graphs) {
                result[graph.name] = graph.idResource;
            }
            return result;
        }
        createProjectHTML(_title) {
            let html = document.implementation.createHTMLDocument(_title);
            html.head.appendChild(createTag("meta", { charset: "utf-8" }));
            html.head.appendChild(createTag("link", { rel: "stylesheet", href: this.fileStyles }));
            html.head.appendChild(html.createComment("CRLF"));
            html.head.appendChild(html.createComment("Editor settings of this project"));
            html.head.appendChild(createTag("meta", {
                type: "settings", autoview: this.graphAutoView, project: this.settingsStringify()
            }));
            html.head.appendChild(html.createComment("CRLF"));
            html.head.appendChild(html.createComment("Activate the following line to include the FUDGE-version of Oimo-Physics. You may want to download a local copy to work offline and be independent from future changes!"));
            html.head.appendChild(html.createComment(`<script type="text/javascript" src="https://hs-furtwangen.github.io/FUDGE/Distribution/OimoPhysics.js"></script>`));
            html.head.appendChild(html.createComment("CRLF"));
            html.head.appendChild(html.createComment("Load FUDGE. You may want to download local copies to work offline and be independent from future changes! Developers working on FUDGE itself may want to create symlinks"));
            html.head.appendChild(createTag("script", { type: "text/javascript", src: "https://hs-furtwangen.github.io/FUDGE/Distribution/FudgeCore.js" }));
            html.head.appendChild(createTag("script", { type: "text/javascript", src: "https://hs-furtwangen.github.io/FUDGE/Distribution/FudgeAid.js" }));
            html.head.appendChild(html.createComment("CRLF"));
            html.head.appendChild(html.createComment("Link internal resources. The editor only loads the first, but at runtime, multiple files can contribute"));
            html.head.appendChild(createTag("link", { type: "resources", src: this.fileInternal }));
            html.head.appendChild(html.createComment("CRLF"));
            html.head.appendChild(html.createComment("Load custom scripts"));
            html.head.appendChild(createTag("script", { type: "text/javascript", src: this.fileScript, editor: "true" }));
            html.head.appendChild(html.createComment("CRLF"));
            // if (this.includeAutoViewScript)
            //   html.head.appendChild(this.getAutoViewScript());
            html.head.appendChild(html.createComment("Load Autoview script"));
            html.head.appendChild(createTag("script", { type: "text/javascript", src: "Autoview.js" }));
            html.head.appendChild(html.createComment("CRLF"));
            html.body.appendChild(html.createComment("Dialog shown at startup only"));
            let dialog = createTag("dialog");
            dialog.appendChild(createTag("p", {}, "FUDGE Autoview"));
            dialog.appendChild(createTag("h1", {}, "Title (will be replaced by Autoview)"));
            dialog.appendChild(createTag("p", {}, "click to start"));
            html.body.appendChild(dialog);
            html.body.appendChild(html.createComment("Canvas for FUDGE to render to"));
            html.body.appendChild(createTag("canvas", { class: "fullscreen" }));
            function createTag(_tag, _attributes = {}, _content) {
                let element = document.createElement(_tag);
                for (let attribute in _attributes)
                    element.setAttribute(attribute, _attributes[attribute]);
                if (_content)
                    element.innerHTML = _content;
                return element;
            }
            return this.stringifyHTML(html);
        }
        // private getAutoViewScript(): HTMLScriptElement {
        //   let code: string;
        //   code = (function (_graphId: string): void {
        //     /**
        //      * AutoView-Script
        //      * Loads and displays the selected graph and implements a basic orbit camera
        //      * @author Jirka Dell'Oro-Friedl, HFU, 2021
        //      */
        //     window.addEventListener("load", init);
        //     // show dialog for startup
        //     let dialog: HTMLDialogElement;
        //     function init(_event: Event): void {
        //       dialog = document.querySelector("dialog");
        //       dialog.querySelector("h1").textContent = document.title;
        //       dialog.addEventListener("click", function (_event: Event): void {
        //         // @ts-ign re until HTMLDialog is implemented by all browsers and available in dom.d.ts
        //         dialog.close();
        //         startInteractiveViewport();
        //       });
        //       //@ts-ignore
        //       dialog.showModal();
        //     }
        //     // setup and start interactive viewport
        //     async function startInteractiveViewport(): Promise<void> {
        //       // load resources referenced in the link-tag
        //       await FudgeCore.Project.loadResourcesFromHTML();
        //       FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        //       // pick the graph to show
        //       let graph: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources[_graphId];
        //       FudgeCore.Debug.log("Graph:", graph);
        //       if (!graph) {
        //         alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
        //         return;
        //       }
        //       // setup the viewport
        //       let cmpCamera: ƒ.ComponentCamera = new FudgeCore.ComponentCamera();
        //       let canvas: HTMLCanvasElement = document.querySelector("canvas");
        //       let viewport: ƒ.Viewport = new FudgeCore.Viewport();
        //       viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        //       FudgeCore.Debug.log("Viewport:", viewport);
        //       // hide the cursor when interacting, also suppressing right-click menu
        //       canvas.addEventListener("mousedown", canvas.requestPointerLock);
        //       canvas.addEventListener("mouseup", function (): void { document.exitPointerLock(); });
        //       // make the camera interactive (complex method in FudgeAid)
        //       let cameraOrbit: FudgeAid.CameraOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        //       // setup audio
        //       let cmpListener: ƒ.ComponentAudioListener = new ƒ.ComponentAudioListener();
        //       cmpCamera.node.addComponent(cmpListener);
        //       FudgeCore.AudioManager.default.listenWith(cmpListener);
        //       FudgeCore.AudioManager.default.listenTo(graph);
        //       FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
        //       // draw viewport once for immediate feedback
        //       FudgeCore.Render.prepare(cameraOrbit);
        //       viewport.draw();
        //       canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
        //     }
        //   }).toString();
        //   code = "(" + code + `)(document.head.querySelector("meta[autoView]").getAttribute("autoView"));\n`;
        //   let script: HTMLScriptElement = document.createElement("script");
        //   script.setAttribute("name", "autoView");
        //   script.textContent = code;
        //   return script;
        // }
        settingsStringify() {
            let mutator = Fudge.project.getMutator(true);
            let settings = JSON.stringify(mutator);
            settings = settings.replace(/"/g, "'");
            return settings;
        }
        stringifyHTML(_html) {
            let result = (new XMLSerializer()).serializeToString(_html);
            result = result.replace(/></g, ">\n<");
            result = result.replace(/<!--CRLF-->/g, "");
            result = result.replace(/">\n<\/script/g, `"></script`);
            result = result.replace(/\n*<\/body>/g, "\n<\/body>"); // remove line breaks added by serializeToString before closing body-tag
            return result;
        }
        async loadFonts(_head) {
            // collect all fonts from _head and add them to the head of the editors document so that they are available for component text
            const fonts = document.createElement('style');
            const cssLinks = _head.querySelectorAll('link[rel="stylesheet"]');
            const cssStyles = _head.querySelectorAll('style');
            const cssRules = [];
            for (let link of cssLinks) {
                let url = new URL(link.getAttribute("href"), this.base).toString();
                let cssText = await (await fetch(url)).text(); // TODO: use FileIO
                cssRules.push(...getRules(cssText));
            }
            for (let style of cssStyles)
                cssRules.push(...getRules(style.innerHTML));
            for (let rule of cssRules)
                if (rule instanceof CSSFontFaceRule)
                    fonts.appendChild(document.createTextNode(rule.cssText));
            document.head.appendChild(fonts);
            function getRules(_text) {
                let styleSheet = new CSSStyleSheet();
                styleSheet.replaceSync(_text);
                return styleSheet.cssRules;
            }
        }
    }
    Fudge.Project = Project;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class ControllerAnimation {
        static PROPERTY_COLORS = [
            "Red",
            "Lime",
            "Blue",
            "Cyan",
            "Magenta",
            "Yellow",
            "Salmon",
            "LightGreen",
            "CornflowerBlue"
        ];
        animation;
        dom;
        view;
        sequences;
        constructor(_animation, _dom, _view) {
            this.animation = _animation;
            this.dom = _dom;
            this.dom.addEventListener("click" /* ƒui.EVENT.CLICK */, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.view = _view;
        }
        update(_mutator, _time) {
            let colorIndex = 0;
            let keySelected = this.view.keySelected;
            updateRecursive(this.dom, _mutator, this.animation.animationStructure, _time);
            function updateRecursive(_dom, _mutator, _animationStructure, _time) {
                for (const key in _mutator) {
                    let element = ƒui.Controller.findChildElementByKey(_dom, key);
                    if (!element)
                        continue;
                    let value = _mutator[key];
                    let structureOrSequence = _animationStructure[key];
                    if (element instanceof ƒui.CustomElement && structureOrSequence instanceof ƒ.AnimationSequence) {
                        element.classList.remove("selected");
                        let key = structureOrSequence.findKey(_time);
                        if (key) { // key found at exactly the given time, take its value
                            value = key.value;
                            if (key == keySelected)
                                element.classList.add("selected");
                        }
                        element.style.setProperty("--color-animation-property", getNextColor());
                        element.setMutatorValue(value);
                        Reflect.set(element, "animationSequence", structureOrSequence);
                    }
                    else {
                        updateRecursive(element, value, structureOrSequence, _time);
                    }
                }
            }
            function getNextColor() {
                let color = ControllerAnimation.PROPERTY_COLORS[colorIndex];
                colorIndex = (colorIndex + 1) % ControllerAnimation.PROPERTY_COLORS.length;
                return color;
            }
        }
        // modify or add key
        updateSequence(_time, _element, _add = false) {
            let sequence = Reflect.get(_element, "animationSequence");
            if (!sequence)
                return;
            let key = sequence.findKey(_time);
            if (!key) {
                if (_add) {
                    key = new ƒ.AnimationKey(_time, _element.getMutatorValue());
                    sequence.addKey(key);
                }
            }
            else
                sequence.modifyKey(key, null, _element.getMutatorValue());
            this.view.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { data: key } });
            this.animation.calculateTotalTime();
        }
        nextKey(_time, _direction) {
            let nextKey = this.sequences
                .flatMap(_sequence => _sequence.data.getKeys())
                .sort(_direction == "forward" && ((_a, _b) => _a.time - _b.time) || _direction == "backward" && ((_a, _b) => _b.time - _a.time))
                .find(_key => _direction == "forward" && _key.time > _time || _direction == "backward" && _key.time < _time);
            if (nextKey)
                return nextKey.time;
            else
                return _time;
        }
        addProperty(_path, _node, _time) {
            let structure = this.animation.animationStructure;
            for (let i = 0; i < _path.length - 1; i++) {
                let key = _path[i];
                if (!(key in structure))
                    structure[key] = {};
                structure = structure[key];
            }
            let sequence = new ƒ.AnimationSequence();
            sequence.addKey(new ƒ.AnimationKey(_time, 0));
            structure[_path[_path.length - 1]] = sequence;
        }
        deleteProperty(_element) {
            if (!this.dom.contains(_element))
                return;
            let path = [];
            let element = _element;
            while (element !== this.dom) {
                if (element instanceof ƒui.CustomElement || element instanceof ƒui.Details)
                    path.unshift(element.getAttribute("key"));
                element = element.parentElement;
            }
            this.deletePath(path);
        }
        getSelectedSequences(_selectedProperty) {
            let sequences = [];
            collectSelectedSequencesRecursive(this.dom, this.animation.animationStructure, sequences, _selectedProperty == null);
            return sequences;
            function collectSelectedSequencesRecursive(_dom, _animationStructure, _sequences, _isSelectedDescendant) {
                for (const key in _animationStructure) {
                    let element = ƒui.Controller.findChildElementByKey(_dom, key);
                    let isSelectedDescendant = _isSelectedDescendant || element == _selectedProperty;
                    if (element == null)
                        continue;
                    let sequence = _animationStructure[key];
                    if (sequence instanceof ƒ.AnimationSequence && isSelectedDescendant) {
                        _sequences.push({
                            color: element.style.getPropertyValue("--color-animation-property"),
                            data: sequence
                        });
                    }
                    else {
                        collectSelectedSequencesRecursive(element, _animationStructure[key], _sequences, isSelectedDescendant);
                    }
                }
            }
        }
        deletePath(_path) {
            let value = this.animation.animationStructure;
            for (let i = 0; i < _path.length - 1; i++)
                value = value[_path[i]];
            delete value[_path[_path.length - 1]];
            deleteEmptyPathsRecursive(this.animation.animationStructure);
            function deleteEmptyPathsRecursive(_object) {
                for (const key in _object) {
                    if (_object[key] instanceof ƒ.AnimationSequence)
                        continue;
                    let value = deleteEmptyPathsRecursive(_object[key]);
                    if (Object.keys(value).length == 0) {
                        delete _object[key];
                    }
                    else {
                        _object[key] = value;
                    }
                }
                return _object;
            }
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "click" /* ƒui.EVENT.CLICK */:
                case Fudge.EVENT_EDITOR.MODIFY:
                    if (!(_event.target instanceof HTMLElement) || !this.animation || _event.target instanceof HTMLButtonElement)
                        break;
                    let target = _event.target;
                    if (target.parentElement instanceof ƒui.Details)
                        target = target.parentElement;
                    if (target instanceof ƒui.CustomElement || target instanceof ƒui.Details)
                        this.sequences = this.getSelectedSequences(target);
                    else if (target == this.dom)
                        this.sequences = this.getSelectedSequences();
                    this.view.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { data: this.sequences } });
                    break;
            }
        };
    }
    Fudge.ControllerAnimation = ControllerAnimation;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    /**
     * Base class for all [[View]]s to support generic functionality
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class View {
        static views = {};
        static idCount = 0;
        dom;
        contextMenu;
        #container;
        #id;
        constructor(_container, _state) {
            this.dom = document.createElement("div");
            this.dom.style.height = "100%";
            // this.dom.style.overflow = "auto";
            this.dom.setAttribute("view", this.constructor.name);
            //_container.getElement().append(this.dom); //old
            this.#container = _container;
            this.#container.element.appendChild(this.dom);
            this.#container.stateRequestEvent = this.getState.bind(this);
            this.#container.on("destroy", () => {
                delete View.views[this.#id];
                this.dispatch(Fudge.EVENT_EDITOR.CLOSE, { bubbles: true });
            });
            // console.log(this.contextMenuCallback);
            this.contextMenu = this.getContextMenu(this.contextMenuCallback.bind(this));
            // this.dom.addEventListener(EVENT_EDITOR.SET_PROJECT, this.hndEventCommon);
            this.#id = View.registerViewForDragDrop(this);
        }
        static getViewSource(_event) {
            if (_event.dataTransfer)
                for (let item of _event.dataTransfer.items)
                    if (item.type.startsWith("sourceview"))
                        return View.views[item.type.split(":").pop()];
            return null;
        }
        static registerViewForDragDrop(_this) {
            View.views[View.idCount] = _this;
            // when drag starts, add identifier to the event in a way that allows dragover to process the soure
            _this.dom.addEventListener("dragstart" /* ƒui.EVENT.DRAG_START */, (_event) => {
                _event.stopPropagation();
                _event.dataTransfer.setData("SourceView:" + _this.#id.toString(), "typesHack");
            });
            // when dragging over a view, get the original source view for dragging and call hndDragOver
            _this.dom.addEventListener("dragover" /* ƒui.EVENT.DRAG_OVER */, (_event) => {
                _event.stopPropagation();
                let viewSource = View.getViewSource(_event);
                _this.hndDragOver(_event, viewSource);
            });
            // drag over during capture phase, allows views to prevent event reaching the actual target
            _this.dom.addEventListener("dragover" /* ƒui.EVENT.DRAG_OVER */, _event => _this.hndDragOverCapture(_event, View.getViewSource(_event)), true);
            // when dropping into a view, get the original source view for dragging and call hndDrop
            _this.dom.addEventListener("drop" /* ƒui.EVENT.DROP */, (_event) => {
                // _event.stopPropagation();
                let viewSource = View.getViewSource(_event);
                _this.hndDrop(_event, viewSource);
            }, false);
            // drop during capture phase, allows views manipulate the drop data before the actual target is reached
            _this.dom.addEventListener("drop" /* ƒui.EVENT.DROP */, _event => _this.hndDropCapture(_event, View.getViewSource(_event)), true);
            return View.idCount++;
        }
        get id() {
            return `${this.#id}_${this.constructor.name}`;
        }
        setTitle(_title) {
            this.#container.setTitle(_title);
        }
        getDragDropSources() {
            return [];
        }
        dispatch(_type, _init) {
            _init.detail = _init.detail || {};
            _init.detail.view = _init.detail.view || this;
            this.dom.dispatchEvent(new Fudge.EditorEvent(_type, _init));
        }
        dispatchToParent(_type, _init) {
            _init.detail = _init.detail || {};
            _init.bubbles = true;
            _init.detail.view = _init.detail.view || this;
            this.dom.parentElement.dispatchEvent(new Fudge.EditorEvent(_type, _init));
        }
        //#region  ContextMenu
        openContextMenu = (_event) => {
            this.contextMenu.popup();
        };
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            // ContextMenu.appendCopyPaste(menu);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`ContextMenu: Item-id=${Fudge.CONTEXTMENU[_item.id]}`);
        }
        //#endregion
        //#region Events
        getState() {
            return {};
        }
        hndDropCapture(_event, _source) {
            //
        }
        hndDrop(_event, _source) {
            // console.log(_source, _event);
        }
        hndDragOverCapture(_event, _source) {
            //
        }
        hndDragOver(_event, _source) {
            // _event.dataTransfer.dropEffect = "link";
        }
        hndEventCommon = (_event) => {
            // switch (_event.type) {
            //   case EVENT_EDITOR.SET_PROJECT:
            //     this.contextMenu = this.getContextMenu(this.contextMenuCallback.bind(this));
            //     break;
            // }
        };
    }
    Fudge.View = View;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    /**
     * List the external resources
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewExternal extends Fudge.View {
        tree;
        #expanded; // cache state from constructor
        constructor(_container, _state) {
            super(_container, _state);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.OPEN, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.#expanded = _state["expanded"];
        }
        setProject() {
            while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild))
                ;
            let path = new URL(".", ƒ.Project.baseURL).pathname;
            if (navigator.platform == "Win32" || navigator.platform == "Win64") {
                path = path.substr(1); // strip leading slash
            }
            let root = Fudge.DirectoryEntry.createRoot(path);
            this.tree = new ƒui.CustomTree(new Fudge.ControllerTreeDirectory(), root);
            this.dom.appendChild(this.tree);
            this.tree.getItems()[0].expand(true);
            this.dom.title = `Drag & drop external image, audiofile etc. to the "Internal", to create a FUDGE-resource`;
            if (this.#expanded)
                this.expand(this.#expanded);
        }
        getSelection() {
            return this.tree.controller.selection;
        }
        getDragDropSources() {
            return this.tree.controller.dragDrop.sources;
        }
        getState() {
            let state = super.getState();
            state["expanded"] = this.getExpanded();
            return state;
        }
        hndEvent = (_event) => {
            if (_event.detail.data) // TODO: inspect if this is ever the case?
                return;
            // nothing actually selected...
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.OPEN:
                    this.setProject();
                    break;
                case Fudge.EVENT_EDITOR.MODIFY:
                    this.tree.refresh();
                    break;
            }
        };
        getExpanded() {
            const expanded = [];
            for (let item of this.tree) {
                if (item.expanded)
                    expanded.push(item.data.pathRelative);
            }
            return expanded;
        }
        expand(_paths) {
            const paths = _paths.map(_path => new Fudge.DirectoryEntry("", _path, null, null).getPath());
            this.tree.expand(paths);
        }
    }
    Fudge.ViewExternal = ViewExternal;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class ViewInternal extends Fudge.View {
        static gltfImportSettings = {
            [ƒ.Graph.name]: true,
            [ƒ.Animation.name]: true,
            [ƒ.Material.name]: false,
            [ƒ.Mesh.name]: false
        };
    }
    Fudge.ViewInternal = ViewInternal;
    /**
     * Displays the internal resources as a folder tree.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jonas Plotzky, HFU, 2024
     */
    class ViewInternalFolder extends ViewInternal {
        tree;
        #expanded; // cache state from constructor
        constructor(_container, _state) {
            super(_container, _state);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.OPEN, this.hndOpen);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndUpdate);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CREATE, this.hndCreate);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndDelete);
            this.dom.addEventListener("mutate" /* ƒui.EVENT.MUTATE */, this.hndEvent);
            this.dom.addEventListener("removeChild" /* ƒui.EVENT.REMOVE_CHILD */, this.hndEvent);
            this.dom.addEventListener("rename" /* ƒui.EVENT.RENAME */, this.hndEvent);
            this.dom.addEventListener("itemselect" /* ƒui.EVENT.SELECT */, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒui.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("keyup", this.hndKeyboardEvent);
            this.#expanded = _state["expanded"];
        }
        get controller() {
            return this.tree.controller;
        }
        get resourceFolder() {
            return Fudge.project.resourceFolder;
        }
        getSelection() {
            return this.controller.selection.filter(_element => !(_element instanceof Fudge.ResourceFolder));
        }
        getDragDropSources() {
            return this.controller.dragDrop.sources.filter(_source => !(_source instanceof Fudge.ResourceFolder));
        }
        // TODO: this is a preparation for syncing a graph with its instances after structural changes
        // protected openContextMenu = (_event: Event): void => {
        //   let row: HTMLTableRowElement = <HTMLTableRowElement>_event.composedPath().find((_element) => (<HTMLElement>_element).tagName == "TR");
        //   if (row)
        //     this.contextMenu.getMenuItemById(String(CONTEXTMENU.SYNC_INSTANCES)).enabled = (row.getAttribute("icon") == "Graph");
        //   this.contextMenu.popup();
        // }
        getState() {
            let state = super.getState();
            state["expanded"] = this.getExpanded();
            return state;
        }
        // #region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({ label: "Create Folder", id: String(Fudge.CONTEXTMENU.CREATE_FOLDER), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Create Graph", id: String(Fudge.CONTEXTMENU.CREATE_GRAPH), click: _callback, accelerator: "G" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Mesh",
                id: String(Fudge.CONTEXTMENU.CREATE_MESH),
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_MESH, ƒ.Mesh, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Material",
                id: String(Fudge.CONTEXTMENU.CREATE_MATERIAL),
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_MATERIAL, ƒ.Shader, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Animation",
                id: String(Fudge.CONTEXTMENU.CREATE_ANIMATION),
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_ANIMATION, ƒ.Animation, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: `Create ${ƒ.ParticleSystem.name}`, id: String(Fudge.CONTEXTMENU.CREATE_PARTICLE_EFFECT), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Delete", id: String(Fudge.CONTEXTMENU.DELETE_RESOURCE), click: _callback, accelerator: "Delete" });
            menu.append(item);
            return menu;
        }
        async contextMenuCallback(_item, _window, _event) {
            let choice = Number(_item.id);
            ƒ.Debug.fudge(`MenuSelect | id: ${Fudge.CONTEXTMENU[_item.id]} | event: ${_event}`);
            let iSubclass = _item["iSubclass"];
            if (!iSubclass && (choice == Fudge.CONTEXTMENU.CREATE_MESH || choice == Fudge.CONTEXTMENU.CREATE_MATERIAL)) {
                alert("Funky Electron-Error... please try again");
                return;
            }
            let focus = this.tree.getFocussed();
            if (choice == Fudge.CONTEXTMENU.DELETE_RESOURCE) {
                if (((await this.controller.delete([focus])).length > 0))
                    this.dispatch(Fudge.EVENT_EDITOR.DELETE, { bubbles: true });
                return;
            }
            if (!(focus instanceof Fudge.ResourceFolder))
                return;
            let resource;
            switch (choice) {
                case Fudge.CONTEXTMENU.CREATE_FOLDER:
                    resource = new Fudge.ResourceFolder();
                    break;
                case Fudge.CONTEXTMENU.CREATE_MESH:
                    let typeMesh = ƒ.Mesh.subclasses[iSubclass];
                    //@ts-ignore
                    resource = new typeMesh();
                    break;
                case Fudge.CONTEXTMENU.CREATE_MATERIAL:
                    let typeShader = ƒ.Shader.subclasses[iSubclass];
                    resource = new ƒ.Material(typeShader.name, typeShader);
                    break;
                case Fudge.CONTEXTMENU.CREATE_GRAPH:
                    resource = await ƒ.Project.registerAsGraph(new ƒ.Node("NewGraph"));
                    break;
                case Fudge.CONTEXTMENU.CREATE_ANIMATION:
                    let typeAnimation = ƒ.Animation.subclasses[iSubclass];
                    resource = new typeAnimation();
                    break;
                case Fudge.CONTEXTMENU.CREATE_PARTICLE_EFFECT:
                    resource = new ƒ.ParticleSystem();
                    break;
            }
            if (resource) {
                this.dispatchToParent(Fudge.EVENT_EDITOR.CREATE, {});
                this.tree.addChildren([resource], focus);
                this.tree.findVisible(resource).focus();
            }
        }
        openContextMenu = (_event) => {
            let item = _event.target;
            while (item != this.dom && !(item instanceof ƒui.CustomTreeItem))
                item = item.parentElement;
            if (item == this.dom) {
                item = this.tree.findVisible(this.resourceFolder);
                item.focus();
            }
            if (!(item instanceof ƒui.CustomTreeItem))
                return;
            this.contextMenu.items.forEach(_item => _item.visible = true);
            if (!(item.data instanceof Fudge.ResourceFolder)) {
                const createOptions = [Fudge.CONTEXTMENU.CREATE_FOLDER, Fudge.CONTEXTMENU.CREATE_GRAPH, Fudge.CONTEXTMENU.CREATE_MESH, Fudge.CONTEXTMENU.CREATE_MATERIAL, Fudge.CONTEXTMENU.CREATE_ANIMATION, Fudge.CONTEXTMENU.CREATE_PARTICLE_EFFECT];
                createOptions.forEach(_id => {
                    this.contextMenu.getMenuItemById(String(_id)).visible = false;
                });
            }
            if (item.data == this.resourceFolder)
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.DELETE_RESOURCE)).visible = false;
            this.contextMenu.popup();
        };
        //#endregion
        hndDragOverCapture(_event, _viewSource) {
            if (_viewSource == this || _viewSource instanceof Fudge.ViewHierarchy)
                return;
            if (_viewSource instanceof Fudge.ViewExternal) {
                let sources = _viewSource.getDragDropSources();
                if (sources.some(_source => [Fudge.MIME.AUDIO, Fudge.MIME.IMAGE, Fudge.MIME.MESH, Fudge.MIME.GLTF].includes(_source.getMimeType())))
                    return;
            }
            _event.dataTransfer.dropEffect = "none";
            _event.stopPropagation();
        }
        async hndDropCapture(_event, _viewSource) {
            if (_viewSource == this || _event.target == this.tree)
                return;
            if (!(_viewSource instanceof Fudge.ViewExternal || _viewSource instanceof Fudge.ViewHierarchy))
                return;
            _event.stopPropagation();
            let resources = [];
            for (const source of _viewSource.getDragDropSources()) {
                if (source instanceof ƒ.Node) {
                    resources.push(await ƒ.Project.registerAsGraph(source, true));
                    continue;
                }
                switch (source.getMimeType()) {
                    case Fudge.MIME.AUDIO:
                        resources.push(new ƒ.Audio(source.pathRelative));
                        break;
                    case Fudge.MIME.IMAGE:
                        resources.push(new ƒ.TextureImage(source.pathRelative));
                        break;
                    case Fudge.MIME.MESH:
                        resources.push(await new ƒ.MeshOBJ().load(source.pathRelative));
                        break;
                    case Fudge.MIME.GLTF:
                        let loader = await ƒ.GLTFLoader.LOAD(source.pathRelative);
                        let load = await ƒui.Dialog.prompt(ViewInternal.gltfImportSettings, false, `Select which resources to import from '${loader.name}'`, "Adjust settings and press OK", "OK", "Cancel");
                        if (!load)
                            break;
                        for (let type in ViewInternal.gltfImportSettings)
                            if (ViewInternal.gltfImportSettings[type])
                                resources.push(...await loader.loadResources(ƒ[type]));
                        break;
                }
            }
            this.controller.dragDrop.sources = resources;
            this.tree.dispatchEvent(new Event("drop" /* ƒui.EVENT.DROP */, { bubbles: false }));
            this.dispatchToParent(Fudge.EVENT_EDITOR.CREATE, {});
        }
        hndKeyboardEvent = (_event) => {
            if (_event.code != ƒ.KEYBOARD_CODE.F2)
                return;
            let input = document.activeElement.querySelector("input");
            if (!input)
                return;
            input.readOnly = false;
            input.focus();
        };
        hndOpen = () => {
            // while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild));
            this.dom.innerHTML = "";
            this.tree = new ƒui.CustomTree(new Fudge.ControllerTreeResource(), this.resourceFolder);
            this.dom.appendChild(this.tree);
            this.dom.title = "● Right click to create new resource.\n● Select or drag resource.";
            this.tree.title = "● Select to edit in \"Properties\"\n● Drag to \"Properties\" or \"Components\" to use if applicable.";
            this.hndCreate();
            if (this.#expanded)
                this.expand(this.#expanded);
        };
        hndCreate = () => {
            // add new resources to root folder
            for (let idResource in ƒ.Project.resources) {
                let resource = ƒ.Project.resources[idResource];
                if (!this.resourceFolder.contains(resource))
                    this.controller.addChildren([resource], this.resourceFolder);
            }
            this.hndUpdate();
            let rootItem = this.tree.findVisible(this.resourceFolder);
            if (!rootItem.expanded)
                rootItem.expand(true);
        };
        hndDelete = () => {
            // remove resources that are no longer registered in the project
            for (const descendant of this.resourceFolder)
                if (!(descendant instanceof Fudge.ResourceFolder) && !ƒ.Project.resources[descendant.idResource])
                    this.controller.remove(descendant);
            this.hndUpdate();
        };
        hndUpdate = () => {
            this.tree.refresh();
            Object.values(ƒ.Project.resources)
                .filter(_resource => _resource.status == ƒ.RESOURCE_STATUS.ERROR)
                .map(_resource => this.controller.getPath(_resource))
                .forEach(_path => this.tree.show(_path));
        };
        hndEvent = (_event) => {
            if (_event.detail?.sender)
                return;
            switch (_event.type) {
                case "mutate" /* ƒui.EVENT.MUTATE */:
                    _event.stopPropagation();
                    this.dispatchToParent(Fudge.EVENT_EDITOR.MODIFY, {});
                    break;
                case "removeChild" /* ƒui.EVENT.REMOVE_CHILD */:
                    _event.stopPropagation();
                    this.dispatchToParent(Fudge.EVENT_EDITOR.DELETE, {});
                    break;
                case "rename" /* ƒui.EVENT.RENAME */:
                    this.dispatchToParent(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true, detail: _event.detail });
                    break;
            }
        };
        expand(_paths) {
            const paths = _paths
                .map(_path => _path
                .split("/")
                .slice(1) // remove root as it is added as first element in reduce
                .reduce((_path, _index) => [..._path, _path[_path.length - 1]?.entries?.[_index]], [this.resourceFolder]))
                .filter(_path => !_path.some(_entry => !_entry)); // filter out invalid paths
            this.tree.expand(paths);
        }
        getExpanded() {
            const expanded = [];
            for (let item of this.tree) {
                if (item.expanded)
                    expanded.push(this.getPath(item.data));
            }
            return expanded;
        }
        getPath(_entry) {
            return this.controller.getPath(_entry).map(_entry => _entry.resourceParent?.entries.indexOf(_entry)).join("/");
        }
    }
    Fudge.ViewInternalFolder = ViewInternalFolder;
})(Fudge || (Fudge = {}));
///<reference path="../View/View.ts"/>
///<reference path="../View/Project/ViewExternal.ts"/>
///<reference path="../View/Project/ViewInternalFolder.ts"/>
var Fudge;
///<reference path="../View/View.ts"/>
///<reference path="../View/Project/ViewExternal.ts"/>
///<reference path="../View/Project/ViewInternalFolder.ts"/>
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    let filter = {
        UrlOnTexture: { fromViews: [Fudge.ViewExternal], onKeyAttribute: "url", onTypeAttribute: "TextureImage", ofType: Fudge.DirectoryEntry, dropEffect: "link" },
        UrlOnMeshOBJ: { fromViews: [Fudge.ViewExternal], onKeyAttribute: "url", onTypeAttribute: "MeshOBJ", ofType: Fudge.DirectoryEntry, dropEffect: "link" },
        UrlOnAudio: { fromViews: [Fudge.ViewExternal], onKeyAttribute: "url", onTypeAttribute: "Audio", ofType: Fudge.DirectoryEntry, dropEffect: "link" },
        UrlOnMeshGLTF: { fromViews: [Fudge.ViewExternal], onKeyAttribute: "url", onTypeAttribute: "MeshGLTF", ofType: Fudge.DirectoryEntry, dropEffect: "link" },
        MaterialOnComponentMaterial: { fromViews: [Fudge.ViewInternal], onType: ƒ.ComponentMaterial, ofType: ƒ.Material, dropEffect: "link" },
        MeshOnComponentMesh: { fromViews: [Fudge.ViewInternal], onType: ƒ.ComponentMesh, ofType: ƒ.Mesh, dropEffect: "link" },
        AnimationOnComponentAnimator: { fromViews: [Fudge.ViewInternal], onType: ƒ.ComponentAnimator, ofType: ƒ.Animation, dropEffect: "link" },
        ParticleSystemOnComponentParticleSystem: { fromViews: [Fudge.ViewInternal], onType: ƒ.ComponentParticleSystem, ofType: ƒ.ParticleSystem, dropEffect: "link" },
        // MeshOnMeshLabel: { fromViews: [ViewInternal], onKeyAttribute: "mesh", ofType: ƒ.Mesh, dropEffect: "link" },
        TextureOnMaterialTexture: { fromViews: [Fudge.ViewInternal], onKeyAttribute: "texture", onType: ƒ.Material, ofType: ƒ.Texture, dropEffect: "link" },
        TextureOnMaterialNormalMap: { fromViews: [Fudge.ViewInternal], onKeyAttribute: "normalMap", onType: ƒ.Material, ofType: ƒ.Texture, dropEffect: "link" },
        TextureOnMaterialTexToon: { fromViews: [Fudge.ViewInternal], onKeyAttribute: "texToon", onType: ƒ.Material, ofType: ƒ.Texture, dropEffect: "link" },
        TextureOnAnimationSprite: { fromViews: [Fudge.ViewInternal], onType: ƒ.AnimationSprite, ofType: ƒ.Texture, dropEffect: "link" },
        TextureOnMeshRelief: { fromViews: [Fudge.ViewInternal], onType: ƒ.MeshRelief, ofType: ƒ.TextureImage, dropEffect: "link" }
    };
    class ControllerDetail extends ƒUi.Controller {
        constructor(_mutable, _domElement) {
            super(_mutable, _domElement);
            this.domElement.addEventListener("input" /* ƒUi.EVENT.INPUT */, this.mutateOnInput, true); // this should be obsolete
            this.domElement.addEventListener("dragover" /* ƒUi.EVENT.DRAG_OVER */, this.hndDragOver);
            this.domElement.addEventListener("drop" /* ƒUi.EVENT.DROP */, this.hndDrop);
            this.domElement.addEventListener("keydown" /* ƒUi.EVENT.KEY_DOWN */, this.hndKey);
            this.domElement.addEventListener("insert" /* ƒUi.EVENT.INSERT */, this.hndInsert);
        }
        mutateOnInput = async (_event) => {
            // TODO: move this to Ui.Controller as a general optimization to only mutate what has been changed...!
            this.getMutator = super.getMutator;
            let path = [];
            for (let target of _event.composedPath()) {
                if (target == document)
                    break;
                let key = target.getAttribute("key");
                if (key)
                    path.push(key);
            }
            path.pop();
            path.reverse();
            let mutator = ƒ.Mutable.getMutatorFromPath(this.getMutator(), path);
            this.getMutator = (_mutator, _types) => {
                this.getMutator = super.getMutator; // reset
                return mutator;
            };
        };
        //#endregion
        hndInsert = (_event) => {
            console.log("INSERT at ControllerDetail");
            console.log(_event.detail);
            let mutable = this.mutable[_event.detail.getAttribute("key")];
            console.log(mutable.type);
            if (mutable instanceof ƒ.MutableArray)
                mutable.push(new mutable.type());
        };
        hndKey = (_event) => {
            _event.stopPropagation();
            switch (_event.code) {
                case ƒ.KEYBOARD_CODE.DELETE:
                    this.domElement.dispatchEvent(new CustomEvent("delete" /* ƒUi.EVENT.DELETE */, { bubbles: true, detail: this }));
                    break;
            }
        };
        hndDragOver = (_event) => {
            // url on texture
            if (this.filterDragDrop(_event, filter.UrlOnTexture, checkMimeType(Fudge.MIME.IMAGE)))
                return;
            // url on meshobj
            if (this.filterDragDrop(_event, filter.UrlOnMeshOBJ, checkMimeType(Fudge.MIME.MESH)))
                return;
            // url on audio
            if (this.filterDragDrop(_event, filter.UrlOnAudio, checkMimeType(Fudge.MIME.AUDIO)))
                return;
            // url on meshgltf
            if (this.filterDragDrop(_event, filter.UrlOnMeshGLTF, checkMimeType(Fudge.MIME.GLTF)))
                return;
            // Material on ComponentMaterial
            if (this.filterDragDrop(_event, filter.MaterialOnComponentMaterial))
                return;
            // Mesh on ComponentMesh
            // if (this.filterDragDrop(_event, filter.MeshOnComponentMesh, (_sources: Object[]) => {
            //   let key: string = this.getAncestorWithType(_event.target).getAttribute("key");
            //   return (key == "mesh");
            // })) return;
            if (this.filterDragDrop(_event, filter.MeshOnComponentMesh))
                return;
            // Mesh on MeshLabel
            // if (this.filterDragDrop(_event, filter.MeshOnMeshLabel)) return;
            // Texture on Material texture
            if (this.filterDragDrop(_event, filter.TextureOnMaterialTexture))
                return;
            // Texture on Material normal map
            if (this.filterDragDrop(_event, filter.TextureOnMaterialNormalMap))
                return;
            // Texture on Material texToon
            if (this.filterDragDrop(_event, filter.TextureOnMaterialTexToon))
                return;
            // Texture on MeshRelief
            if (this.filterDragDrop(_event, filter.TextureOnMeshRelief))
                return;
            // Texture on AnimationSprite
            if (this.filterDragDrop(_event, filter.TextureOnAnimationSprite))
                return;
            // Animation of ComponentAnimation
            if (this.filterDragDrop(_event, filter.AnimationOnComponentAnimator))
                return;
            // ParticleSystem of ComponentParticleSystem
            if (this.filterDragDrop(_event, filter.ParticleSystemOnComponentParticleSystem))
                return;
            function checkMimeType(_mime) {
                return (_sources) => {
                    let sources = _sources;
                    return (sources.length == 1 && sources[0].getMimeType() == _mime);
                };
            }
        };
        hndDrop = (_event) => {
            let setExternalLink = (_sources) => {
                let sources = _sources;
                _event.target.value = sources[0].pathRelative;
                this.mutateOnInput(_event);
                return true;
            };
            let setResource = (_sources) => {
                let ancestor = this.getAncestorWithType(_event.target);
                let key = ancestor.getAttribute("key");
                if (!this.mutable[key])
                    return false;
                this.mutable[key] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setMaterial = (_sources) => {
                this.mutable["material"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setMesh = (_sources) => {
                this.mutable["mesh"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setTexture = (_sources) => {
                this.mutable["coat"]["texture"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setNormalMap = (_sources) => {
                this.mutable["coat"]["normalMap"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setTexToon = (_sources) => {
                this.mutable["coat"]["texToon"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setSpriteTexture = (_sources) => {
                this.mutable["texture"] = _sources[0];
                this.mutable.mutate({}); // force recreation using new texture
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setHeightMap = (_sources) => {
                // this.mutable["texture"] = _sources[0];
                let mutator = this.mutable.getMutator();
                mutator.texture = _sources[0];
                this.mutable.mutate(mutator);
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            let setAnimation = (_sources) => {
                this.mutable["animation"] = _sources[0];
                // this.domElement.dispatchEvent(new Event(EVENT_EDITOR.MODIFY, { bubbles: true }));
                this.domElement.dispatchEvent(new CustomEvent(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true, detail: this }));
                return true;
            };
            let setParticleSystem = (_sources) => {
                this.mutable["particleSystem"] = _sources[0];
                this.domElement.dispatchEvent(new Event(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true }));
                return true;
            };
            // texture
            if (this.filterDragDrop(_event, filter.UrlOnTexture, setExternalLink))
                return;
            // texture
            if (this.filterDragDrop(_event, filter.UrlOnMeshOBJ, setExternalLink))
                return;
            // audio
            if (this.filterDragDrop(_event, filter.UrlOnAudio, setExternalLink))
                return;
            // Material on ComponentMaterial
            if (this.filterDragDrop(_event, filter.MaterialOnComponentMaterial, setMaterial))
                return;
            // Mesh on ComponentMesh
            if (this.filterDragDrop(_event, filter.MeshOnComponentMesh, setMesh))
                return;
            // Mesh on MeshLabel
            // if (this.filterDragDrop(_event, filter.MeshOnMeshLabel, setMesh)) return;
            // Texture on Material texture
            if (this.filterDragDrop(_event, filter.TextureOnMaterialTexture, setTexture))
                return;
            // Texture on Material normal map
            if (this.filterDragDrop(_event, filter.TextureOnMaterialNormalMap, setNormalMap))
                return;
            // Texture on Material texToon
            if (this.filterDragDrop(_event, filter.TextureOnMaterialTexToon, setTexToon))
                return;
            // Texture on MeshRelief
            if (this.filterDragDrop(_event, filter.TextureOnMeshRelief, setHeightMap))
                return;
            // Texture on AnimationSprite
            if (this.filterDragDrop(_event, filter.TextureOnAnimationSprite, setSpriteTexture))
                return;
            // Animation on ComponentAnimator
            if (this.filterDragDrop(_event, filter.AnimationOnComponentAnimator, setAnimation))
                return;
            // ParticleSystem on ComponentParticleSystem
            if (this.filterDragDrop(_event, filter.ParticleSystemOnComponentParticleSystem, setParticleSystem))
                return;
        };
        filterDragDrop(_event, _filter, _callback = () => true) {
            let target = _event.target;
            let typeElement = target.parentElement.getAttribute("key");
            let typeComponent = this.getAncestorWithType(target).getAttribute("type");
            if (_filter.onKeyAttribute && typeElement != _filter.onKeyAttribute)
                return false;
            if (_filter.onTypeAttribute && typeComponent != _filter.onTypeAttribute)
                return false;
            if (_filter.onType && !(this.mutable instanceof _filter.onType))
                return false;
            let viewSource = Fudge.View.getViewSource(_event);
            if (!_filter.fromViews?.find((_view) => viewSource instanceof _view))
                return false;
            let sources = viewSource.getDragDropSources();
            if (!(sources[0] instanceof _filter.ofType))
                return false;
            if (!_callback(sources))
                return false;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
            return true;
        }
        getAncestorWithType(_target) {
            let element = _target;
            while (element) {
                let type = element.getAttribute("type");
                if (type)
                    return element;
                element = element.parentElement;
            }
            return null;
        }
    }
    Fudge.ControllerDetail = ControllerDetail;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class ControllerTableResource extends ƒui.TableController {
        static head = ControllerTableResource.getHead();
        static getHead() {
            let head = [];
            head.push({ label: "Name", key: "name", sortable: true, editable: true });
            head.push({ label: "Type", key: "type", sortable: true, editable: false });
            head.push({ label: "Id", key: "idResource", sortable: false, editable: false });
            return head;
        }
        getHead() {
            return ControllerTableResource.head;
        }
        getLabel(_object) {
            return "";
        }
        async rename(_object, _new) {
            // console.log("Check rename", _object.name, _new);
            let rename = _object.name != _new;
            if (rename) {
                _object.name = _new; // must rename before loading, TODO: WHY is it that the renaming is supposed to be handled by the actual table???
                await _object.load?.();
            }
            return rename;
        }
        copy(_originals) { return null; }
        async delete(_focussed) {
            console.log(_focussed, this.selection);
            // this.selection = [];
            let expendables = this.selection.concat([]); //_focussed);
            let serializations = ƒ.Project.serialize();
            let serializationStrings = new Map();
            let usages = {};
            for (let idResource in serializations)
                serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));
            for (let expendable of expendables) {
                usages[expendable.idResource] = [];
                for (let resource of serializationStrings.keys())
                    if (resource.idResource != expendable.idResource)
                        if (serializationStrings.get(resource).indexOf(expendable.idResource) > -1)
                            usages[expendable.idResource].push(resource.name + " " + resource.type);
            }
            if (await openDialog()) {
                let deleted = [];
                for (let usage in usages)
                    if (usages[usage].length == 0) { // delete only unused
                        deleted.push(ƒ.Project.resources[usage]);
                        ƒ.Project.deregister(ƒ.Project.resources[usage]);
                    }
                return deleted;
            }
            async function openDialog() {
                let promise = ƒui.Dialog.prompt(usages, true, "Review references, delete dependend resources first if applicable", "To delete unused resources, press OK", "OK", "Cancel");
                if (await promise) {
                    return true;
                }
                else
                    return false;
            }
            return [];
        }
        sort(_data, _key, _direction) {
            function compare(_a, _b) {
                return _direction * (_a[_key] == _b[_key] ? 0 : (_a[_key] > _b[_key] ? 1 : -1));
            }
            _data.sort(compare);
        }
    }
    Fudge.ControllerTableResource = ControllerTableResource;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒui = FudgeUserInterface;
    class ScriptInfo {
        name;
        namespace;
        superClass;
        script;
        isComponent = false;
        isComponentScript = false;
        constructor(_script, _namespace) {
            this.script = _script;
            this.name = _script.name;
            this.namespace = _namespace;
            let chain = _script["__proto__"];
            this.superClass = chain.name;
            do {
                this.isComponent = this.isComponent || (chain.name == "Component");
                this.isComponentScript = this.isComponentScript || (chain.name == "ComponentScript");
                chain = chain["__proto__"];
            } while (chain);
        }
    }
    Fudge.ScriptInfo = ScriptInfo;
    class ControllerTableScript extends ƒui.TableController {
        static head = ControllerTableScript.getHead();
        static getHead() {
            let head = [];
            head.push({ label: "Name", key: "name", sortable: true, editable: false });
            head.push({ label: "Super", key: "superClass", sortable: true, editable: false });
            head.push({ label: "Namespace", key: "namespace", sortable: true, editable: false });
            return head;
        }
        getHead() {
            return ControllerTableScript.head;
        }
        getLabel(_object) { return ""; }
        async rename(_object, _new) { return false; }
        delete(_focussed) { return null; }
        copy(_originals) { return null; }
        sort(_data, _key, _direction) {
            function compare(_a, _b) {
                return _direction * (_a[_key] == _b[_key] ? 0 : (_a[_key] > _b[_key] ? 1 : -1));
            }
            _data.sort(compare);
        }
    }
    Fudge.ControllerTableScript = ControllerTableScript;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class ControllerTreeDirectory extends ƒUi.CustomTreeController {
        createContent(_entry) {
            let input = document.createElement("input");
            input.value = _entry.name;
            return input;
        }
        async setValue(_entry, _element) {
            try {
                _entry.name = _element.value;
            }
            catch (_error) {
                ƒ.Debug.warn(`Could not rename file '${_entry.name}' to '${_element.value}'.`, _error);
                return false;
            }
            return true;
        }
        getAttributes(_object) {
            return "";
        }
        hasChildren(_entry) {
            return _entry.isDirectory;
        }
        getChildren(_entry) {
            return _entry.getDirectoryContent();
        }
        equals(_a, _b) {
            return _a.pathRelative == _b.pathRelative;
        }
        async delete(_focussed) {
            // delete selection independend of focussed item
            let deleted = [];
            let expend = this.selection.length > 0 ? this.selection : _focussed;
            for (let entry of this.selection || expend) {
                entry.delete();
                deleted.push(entry);
            }
            this.selection.splice(0);
            return deleted;
        }
        addChildren(_entries, _target) {
            let move = [];
            for (let entry of _entries) {
                try {
                    _target.addEntry(entry);
                    entry.delete();
                    move.push(entry);
                }
                catch (_error) {
                    ƒ.Debug.warn(`Could not add file '${entry.name}' to '${_target.name}'.`, _error);
                }
            }
            return move;
        }
        async copy(_originals) {
            // copies can not be created at this point, but when copying the files. See addChildren
            return _originals;
        }
    }
    Fudge.ControllerTreeDirectory = ControllerTreeDirectory;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class ControllerTreeHierarchy extends ƒUi.CustomTreeController {
        createContent(_object) {
            let input = document.createElement("input");
            input.value = _object.name;
            return input;
        }
        getAttributes(_node) {
            let attributes = [_node.isActive ? "active" : "inactive"];
            if (_node instanceof ƒ.GraphInstance)
                attributes.push("GraphInstance");
            return attributes.join(" ");
        }
        async setValue(_node, _element) {
            let rename = _node.name != _element.value;
            if (rename) {
                _node.name = _element.value;
                await _node.load?.();
            }
            return rename;
        }
        hasChildren(_node) {
            return _node.getChildren().length > 0;
        }
        getChildren(_node) {
            return _node.getChildren();
        }
        async delete(_focussed) {
            // delete selection independend of focussed item
            let deleted = [];
            let expend = this.selection.length > 0 ? this.selection : _focussed;
            for (let node of expend)
                if (node.getParent()) {
                    node.getParent().removeChild(node);
                    deleted.push(node);
                }
            this.selection.splice(0);
            return deleted;
        }
        addChildren(_children, _target, _index) {
            // disallow drop for sources being ancestor to target
            let move = [];
            for (let child of _children)
                if (!_target.isDescendantOf(child))
                    move.push(child);
            move.forEach((_node, _iMove) => _target.addChild(_node, _index == undefined ? _index : _index + _iMove));
            // for (let node of move)
            //   _target.addChild(node, _iTarget);
            return move;
        }
        async copy(_originals) {
            // try to create copies and return them for paste operation
            let copies = [];
            for (let original of _originals) {
                let serialization = ƒ.Serializer.serialize(original);
                let copy = await ƒ.Serializer.deserialize(serialization);
                copies.push(copy);
            }
            return copies;
        }
        canAddChildren(_sources, _target) {
            if (_sources.length == 0)
                return false;
            return _sources.every(_source => checkGraphDrop(_source, _target));
            function checkGraphDrop(_source, _target) {
                let idSources = [];
                for (let node of _source.getIterator())
                    if (node instanceof ƒ.GraphInstance)
                        idSources.push(node.idSource);
                    else if (node instanceof ƒ.Graph)
                        idSources.push(node.idResource);
                do {
                    if (_target instanceof ƒ.Graph)
                        if (idSources.indexOf(_target.idResource) > -1)
                            return false;
                    if (_target instanceof ƒ.GraphInstance)
                        if (idSources.indexOf(_target.idSource) > -1)
                            return false;
                    _target = _target.getParent();
                } while (_target);
                return true;
            }
        }
    }
    Fudge.ControllerTreeHierarchy = ControllerTreeHierarchy;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class ControllerTreeParticleSystem extends ƒui.CustomTreeController {
        childToParent = new Map();
        data;
        view;
        constructor(_data, _view) {
            super();
            this.data = _data;
            this.view = _view;
        }
        createContent(_data) {
            let content = document.createElement("span");
            let parentData = this.childToParent.get(_data);
            let key = this.getKey(_data);
            if (!ƒ.ParticleData.isExpression(_data) && !ƒ.ParticleData.isTransformation(_data)) {
                let spanName = document.createElement("span");
                spanName.innerText = parentData ? key : ƒ.ParticleSystem.name;
                content.appendChild(spanName);
            }
            if (parentData && parentData == this.data.variables) {
                let input = document.createElement("input");
                input.type = "text";
                // input.disabled = true;
                input.value = this.data.variableNames[key];
                input.id = "name" /* ID.NAME */;
                content.appendChild(input);
            }
            if (ƒ.ParticleData.isExpression(_data)) {
                if (ƒ.ParticleData.isFunction(_data)) {
                    let select = document.createElement("select");
                    select.id = "function" /* ID.FUNCTION */;
                    for (let name of Object.values(ƒ.ParticleData.FUNCTION)) {
                        let entry = document.createElement("option");
                        entry.text = name;
                        entry.value = name;
                        select.add(entry);
                    }
                    select.value = _data.function;
                    content.appendChild(select);
                }
                else {
                    let input = document.createElement("input");
                    input.type = "text";
                    // input.disabled = true;
                    input.id = "value" /* ID.VALUE */;
                    if (ƒ.ParticleData.isCode(_data)) {
                        input.value = _data.code;
                    }
                    else {
                        input.value = _data.value.toString();
                        input.setAttribute("list", "variables");
                    }
                    content.appendChild(input);
                }
            }
            else if (ƒ.ParticleData.isTransformation(_data)) {
                let select = document.createElement("select");
                select.id = "transformation" /* ID.TRANSFORMATION */;
                for (let key of [ƒ.Matrix4x4.prototype.translate.name, ƒ.Matrix4x4.prototype.rotate.name, ƒ.Matrix4x4.prototype.scale.name]) {
                    let entry = document.createElement("option");
                    entry.text = key;
                    entry.value = key;
                    select.add(entry);
                }
                select.value = _data.transformation;
                content.appendChild(select);
            }
            return content;
        }
        getAttributes(_data) {
            let attributes = [];
            if (ƒ.ParticleData.isVariable(_data) || this.childToParent.get(_data) == this.data.variables)
                attributes.push("variable");
            if (ƒ.ParticleData.isFunction(_data))
                attributes.push(_data.function);
            if (_data == this.data.color)
                attributes.push("color");
            if (ƒ.ParticleData.isTransformation(_data))
                attributes.push("transformation");
            if (ƒ.ParticleData.isCode(_data))
                attributes.push("code");
            return attributes.join(" ");
        }
        async setValue(_data, _element) {
            let inputAsNumber = Number.parseFloat(_element.value);
            if (_element.id == "name" /* ID.NAME */ && ƒ.ParticleData.isExpression(_data)) {
                let errors = [];
                if (this.data.variableNames.includes(_element.value))
                    errors.push(`variable "${_element}" already exists`);
                if (ƒ.ParticleData.PREDEFINED_VARIABLES[_element.value])
                    errors.push(`variable "${_element}" is a predefined variable and can not be redeclared. Predefined variables: [${Object.keys(ƒ.ParticleData.PREDEFINED_VARIABLES).join(", ")}]`);
                if (errors.length > 0) {
                    ƒui.Warning.display(errors, "Unable to rename", "Please resolve the errors and try again");
                    return false;
                }
                let index = this.data.variables.indexOf(_data);
                let name = this.data.variableNames[index];
                this.data.variableNames[index] = _element.value;
                this.renameVariable(name, _element.value);
                return true;
            }
            if (_element.id == "function" /* ID.FUNCTION */ && ƒ.ParticleData.isFunction(_data)) {
                _data.function = _element.value;
                return true;
            }
            if (_element.id == "transformation" /* ID.TRANSFORMATION */ && ƒ.ParticleData.isTransformation(_data)) {
                _data.transformation = _element.value;
                return true;
            }
            if (_element.id == "value" /* ID.VALUE */ && (ƒ.ParticleData.isVariable(_data) || ƒ.ParticleData.isConstant(_data))) {
                let input = Number.isNaN(inputAsNumber) ? _element.value : inputAsNumber;
                if (typeof input == "string" && !ƒ.ParticleData.PREDEFINED_VARIABLES[input] && this.data.variableNames && !this.data.variableNames.includes(input))
                    return false;
                _data.value = input;
                return true;
            }
            if (_element.id == "value" /* ID.VALUE */ && (ƒ.ParticleData.isCode(_data))) {
                _data.code = _element.value;
                return true;
            }
        }
        hasChildren(_data) {
            if (ƒ.ParticleData.isConstant(_data) || ƒ.ParticleData.isVariable(_data))
                return false;
            return this.getChildren(_data).length > 0;
        }
        getChildren(_data) {
            if (ƒ.ParticleData.isConstant(_data) || ƒ.ParticleData.isVariable(_data))
                return [];
            let children = [];
            let data = ƒ.ParticleData.isFunction(_data) || ƒ.ParticleData.isTransformation(_data) ? _data.parameters : _data;
            let keys = Object.keys(data);
            if (data == this.data)
                keys = Fudge.ViewParticleSystem.PROPERTY_KEYS.filter(_key => keys.includes(_key));
            keys.forEach(_key => {
                let child = data[_key];
                if (ƒ.ParticleData.isExpression(child) || typeof child == "object") {
                    children.push(child);
                    this.childToParent.set(data[_key], _data);
                }
            });
            return children;
        }
        async delete(_focused) {
            // delete selection independend of focussed item
            let deleted = [];
            let expend = this.selection.length > 0 ? this.selection : _focused;
            for (let data of expend) {
                if (this.deleteData(data))
                    deleted.push(data);
            }
            this.selection.splice(0);
            return deleted;
        }
        addChildren(_children, _target, _at) {
            let move = [];
            let container;
            if ((ƒ.ParticleData.isFunction(_target) || ƒ.ParticleData.isTransformation(_target)) && _children.every(_data => ƒ.ParticleData.isExpression(_data)))
                container = _target.parameters;
            else if ((_target == this.data.mtxLocal || _target == this.data.mtxWorld) && _children.every(_data => ƒ.ParticleData.isTransformation(_data)))
                container = _target;
            else if ((_target == this.data.variables || _target == this.data.color) && _children.every(_data => ƒ.ParticleData.isExpression(_data)))
                container = _target;
            if (!container)
                return move;
            if (Array.isArray(container))
                for (let data of _children) {
                    let index = container.indexOf(data); // _at needs to be corrected if we are moving within same parent
                    let hasParent = this.childToParent.has(data);
                    let name = this.data.variableNames?.[index];
                    if (hasParent && !this.deleteData(data))
                        continue;
                    if (!hasParent)
                        data = JSON.parse(JSON.stringify(data));
                    move.push(data);
                    this.childToParent.set(data, _target);
                    if (index > -1 && _at > index)
                        _at -= 1;
                    if (_at == null) {
                        container.push(data);
                        if (container == this.data.variables)
                            this.data.variableNames.push(name || this.generateNewVariableName());
                    }
                    else {
                        container.splice(_at + _children.indexOf(data), 0, data);
                        if (container == this.data.variables)
                            this.data.variableNames.splice(_at + _children.indexOf(data), 0, name);
                    }
                }
            return move;
        }
        async copy(_originals) {
            let copies = [];
            if (_originals.every(_original => ƒ.ParticleData.isExpression(_original)) || _originals.every(_original => ƒ.ParticleData.isTransformation(_original)))
                _originals.forEach(_original => copies.push(JSON.parse(JSON.stringify(_original))));
            return copies;
        }
        draggable(_target) {
            return ƒ.ParticleData.isExpression(_target) || ƒ.ParticleData.isTransformation(_target);
        }
        generateNewVariableName() {
            let name = "newVariable";
            let count = 1;
            while (this.data.variableNames.includes(name)) {
                name = "newVariable" + count;
                count++;
            }
            return name;
        }
        getKey(_data) {
            let parent = this.childToParent.get(_data) || {};
            if (ƒ.ParticleData.isFunction(parent) || ƒ.ParticleData.isTransformation(parent))
                parent = parent.parameters;
            return Object.entries(parent).find(_entry => _entry[1] == _data)?.shift();
        }
        deleteData(_data) {
            if (_data == this.data)
                return false;
            let parent = this.childToParent.get(_data);
            let key = this.getKey(_data);
            if (ƒ.ParticleData.isFunction(parent) || ƒ.ParticleData.isTransformation(parent))
                parent = parent.parameters;
            if (Array.isArray(parent)) {
                let index = Number.parseInt(key);
                parent.splice(index, 1);
                if (parent == this.data.variables)
                    this.data.variableNames.splice(index, 1);
            }
            else {
                delete parent[key];
            }
            this.childToParent.delete(_data);
            return true;
        }
        renameVariable(_name, _new, _data = this.data) {
            if (ƒ.ParticleData.isVariable(_data) && _data.value == _name) {
                _data.value = _new;
                this.view.dispatch(Fudge.EVENT_EDITOR.MODIFY, { detail: { data: _data } });
            }
            for (const subData of Object.values("parameters" in _data ? _data.parameters : _data))
                if (typeof subData == "object")
                    this.renameVariable(_name, _new, subData);
        }
    }
    Fudge.ControllerTreeParticleSystem = ControllerTreeParticleSystem;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class ResourceFolder {
        name;
        resourceParent;
        entries = [];
        type = "Folder";
        constructor(_name = "New Folder") {
            this.name = _name;
        }
        /**
         * Returns true if this or any of its descendants contain the given resource.
         */
        contains(_resource) {
            for (let entry of this.entries)
                if (entry == _resource || entry instanceof ResourceFolder && entry.contains(_resource))
                    return true;
            return false;
        }
        serialize() {
            let serialization = { name: this.name, entries: [] };
            for (let entry of this.entries) {
                if (entry instanceof ResourceFolder)
                    serialization.entries.push(entry.serialize());
                else
                    serialization.entries.push({ idResource: entry.idResource });
            }
            return serialization;
        }
        async deserialize(_serialization) {
            this.name = _serialization.name;
            for (let entrySerialization of _serialization.entries ?? _serialization.children) { // remove "?? _serialization.children" after a while
                let entry;
                if ("idResource" in entrySerialization)
                    entry = await ƒ.Project.getResource(entrySerialization.idResource);
                else
                    entry = await new ResourceFolder().deserialize(entrySerialization);
                if (entry) {
                    this.entries.push(entry);
                    entry.resourceParent = this;
                }
            }
            return this;
        }
        *[Symbol.iterator]() {
            yield this;
            for (let entry of this.entries) {
                if (entry instanceof ResourceFolder)
                    yield* entry;
                else
                    yield entry;
            }
        }
    }
    Fudge.ResourceFolder = ResourceFolder;
    class ControllerTreeResource extends ƒui.CustomTreeController {
        createContent(_object) {
            let input = document.createElement("input");
            input.value = _object.name;
            if (!(_object instanceof ResourceFolder)) {
                input.setAttribute("icon", _object.type);
                if (_object.status == ƒ.RESOURCE_STATUS.ERROR) {
                    input.classList.add("error");
                    input.title = "Failed to load resource from file. Check the console for details.";
                }
            }
            return input;
        }
        getAttributes(_object) {
            return "";
        }
        async setValue(_entry, _element) {
            let rename = _entry.name != _element.value;
            if (rename) {
                _entry.name = _element.value;
                await _entry.load?.();
            }
            return rename;
        }
        hasChildren(_entry) {
            return _entry instanceof ResourceFolder && _entry.entries.length > 0;
        }
        getChildren(_entry) {
            return _entry instanceof ResourceFolder ? _entry.entries : [];
        }
        addChildren(_sources, _target, _index) {
            if (!(_target instanceof ResourceFolder))
                return [];
            let move = [];
            for (let source of _sources) {
                let currentIndex = _target.entries.indexOf(source); // _index needs to be corrected if we are moving within same parent
                if (currentIndex > -1 && _index > currentIndex)
                    _index -= 1;
                this.remove(source);
                source.resourceParent = _target;
                move.push(source);
                if (_index == null)
                    _target.entries.push(source);
                else
                    _target.entries.splice(_index + _sources.indexOf(source), 0, source);
            }
            return move;
        }
        async delete(_focussed) {
            // TODO: add delete selection isntead of _focussed? Why doesn't the Tree class handle this?
            let iRoot = _focussed.indexOf(Fudge.project.resourceFolder);
            if (iRoot > -1)
                _focussed.splice(iRoot, 1);
            let serializations = ƒ.Project.serialize();
            let serializationStrings = new Map();
            let usages = {};
            for (let idResource in serializations)
                serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));
            for (let expendable of _focussed) {
                if (expendable instanceof ResourceFolder) {
                    let usage = [];
                    for (const entry of expendable.entries)
                        usage.push(entry.name);
                    usages[_focussed.indexOf(expendable) + " " + expendable.name] = usage;
                }
                else {
                    usages[expendable.idResource] = [];
                    for (let resource of serializationStrings.keys())
                        if (resource.idResource != expendable.idResource)
                            if (serializationStrings.get(resource).indexOf(expendable.idResource) > -1)
                                usages[expendable.idResource].push(resource.name + " " + resource.type);
                }
            }
            if (_focussed.length > 0 && await openDialog()) {
                let deleted = [];
                for (const selected of _focussed) {
                    let key = selected instanceof ResourceFolder ? this.selection.indexOf(selected) + " " + selected.name : selected.idResource;
                    if (usages[key].length == 0) // delete only unused
                        deleted.push(selected);
                }
                for (let resource of deleted) {
                    if (!(resource instanceof ResourceFolder))
                        ƒ.Project.deregister(resource);
                    this.remove(resource);
                    this.selection.splice(this.selection.indexOf(resource), 1);
                }
                return deleted;
            }
            return [];
            async function openDialog() {
                let promise = ƒui.Dialog.prompt(usages, true, "Review references, delete dependend resources first if applicable", "To delete unused resources, press OK", "OK", "Cancel");
                if (await promise) {
                    return true;
                }
                else
                    return false;
            }
        }
        async copy(_originals) {
            return [];
        }
        getPath(_resource) {
            let path = [];
            let current = _resource;
            while (current) {
                path.push(current);
                current = current.resourceParent;
            }
            return path.reverse();
        }
        remove(_resource) {
            let parent = _resource.resourceParent;
            if (!parent)
                return;
            let index = parent.entries.indexOf(_resource);
            parent.entries.splice(index, 1);
        }
    }
    Fudge.ControllerTreeResource = ControllerTreeResource;
})(Fudge || (Fudge = {}));
///<reference path="../View/View.ts"/>
var Fudge;
///<reference path="../View/View.ts"/>
(function (Fudge) {
    /**
     * Base class for all [[Panel]]s aggregating [[View]]s
     * Subclasses are presets for common panels. A user might add or delete [[View]]s at runtime
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020 | Jonas Plotzky, HFU, 2024
     */
    // TODO: class might become a customcomponent for HTML! = this.dom
    // extends view vorrübergehend entfernt
    class Panel extends Fudge.View {
        goldenLayout;
        views = [];
        //public dom; // muss vielleicht weg
        constructor(_container, _panelState, _viewConstructors, _rootItemConfig) {
            _container.on("destroy", () => this.goldenLayout.destroy()); // destroy from inside out
            super(_container, _panelState);
            this.dom.style.width = "100%";
            this.dom.style.overflow = "visible";
            this.dom.removeAttribute("view");
            this.dom.setAttribute("panel", this.constructor.name);
            const config = {
                header: {
                    popout: false,
                    maximise: false
                },
                root: _rootItemConfig
            };
            this.goldenLayout = new Fudge.Page.goldenLayoutModule.GoldenLayout(this.dom);
            for (const key in _viewConstructors)
                this.goldenLayout.registerComponentFactoryFunction(key, (_container, _viewState) => new _viewConstructors[key](_container, { ..._panelState, ..._viewState }));
            this.goldenLayout.on("stateChanged", () => this.goldenLayout.updateRootSize());
            this.goldenLayout.on("itemCreated", this.addViewComponent);
            this.goldenLayout.loadLayout(_panelState["layout"] ? Fudge.Page.goldenLayoutModule.LayoutConfig.fromResolved(_panelState["layout"]) : config);
        }
        /** Send custom copies of the given event to the views */
        broadcast = (_event) => {
            let detail = _event.detail || {};
            let target = detail.view;
            detail.sender = this;
            for (let view of this.views)
                if (view != target) // don't send back to original target view
                    view.dispatch(_event.type, { detail: detail });
        };
        getState() {
            let state = super.getState();
            state["layout"] = this.goldenLayout.saveLayout();
            return state;
        }
        addViewComponent = (_event) => {
            // adjustmens for GoldenLayout 2
            let target = _event.target;
            if (target instanceof Fudge.Page.goldenLayoutModule.ComponentItem) {
                this.views.push(target.component);
            }
        };
    }
    Fudge.Panel = Panel;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    /**
     * TODO: add
     * @authors Jonas Plotzky, HFU, 2022
     */
    class PanelAnimation extends Fudge.Panel {
        constructor(_container, _state) {
            const constructors = {
                [Fudge.VIEW.ANIMATION]: Fudge.ViewAnimation,
                [Fudge.VIEW.ANIMATION_SHEET]: Fudge.ViewAnimationSheet
            };
            const config = {
                type: "row",
                content: [
                    {
                        type: "component",
                        componentType: Fudge.VIEW.ANIMATION,
                        title: "Properties"
                    },
                    {
                        type: "component",
                        componentType: Fudge.VIEW.ANIMATION_SHEET
                    }
                ]
            };
            super(_container, _state, constructors, config);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.setTitle("Animation | ");
        }
        // public getState(): { [key: string]: string } {
        //   // TODO: iterate over views and collect their states for reconstruction
        //   return {};
        // }
        hndEvent = async (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    let name = _event.detail.node?.getComponent(ƒ.ComponentAnimator)?.animation?.name;
                    if (name)
                        this.setTitle("Animation | " + name);
                    break;
            }
            this.broadcast(_event);
            _event.stopPropagation();
        };
    }
    Fudge.PanelAnimation = PanelAnimation;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    /**
    * Shows a graph and offers means for manipulation
    * @authors Monika Galkewitsch, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
    */
    class PanelGraph extends Fudge.Panel {
        #graph;
        #node;
        constructor(_container, _state) {
            const constructors = {
                [Fudge.VIEW.RENDER]: Fudge.ViewRender,
                [Fudge.VIEW.COMPONENTS]: Fudge.ViewComponents,
                [Fudge.VIEW.HIERARCHY]: Fudge.ViewHierarchy
            };
            const config = {
                type: "column",
                content: [{
                        type: "component",
                        componentType: Fudge.VIEW.RENDER,
                        title: "Render"
                    }, {
                        type: "row",
                        content: [{
                                type: "component",
                                componentType: Fudge.VIEW.HIERARCHY,
                                title: "Hierarchy"
                            }, {
                                type: "component",
                                componentType: Fudge.VIEW.COMPONENTS,
                                title: "Components"
                            }]
                    }]
            };
            super(_container, _state, constructors, config);
            this.setTitle("Graph");
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.FOCUS, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.TRANSFORM, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CLOSE, this.hndEvent);
            this.restoreGraph().then(_graph => {
                if (_graph) {
                    this.dispatch(Fudge.EVENT_EDITOR.SELECT, { detail: { graph: _graph, node: this.restoreNode(_graph) } });
                    return;
                }
                if (_state["graph"]) {
                    ƒ.Project.getResource(_state["graph"]).then((_graph) => {
                        const node = _state["node"] && ƒ.Node.FIND(_graph, _state["node"]);
                        this.dispatch(Fudge.EVENT_EDITOR.SELECT, { detail: { graph: _graph, node: node } });
                    });
                }
            });
        }
        getState() {
            let state = super.getState();
            if (this.#graph)
                state["graph"] = this.#graph.idResource;
            if (this.#node)
                state["node"] = ƒ.Node.PATH_FROM_TO(this.#graph, this.#node);
            return state;
        }
        hndDrop(_event, _viewSource) {
            if (!this.views.find(_view => _view instanceof Fudge.ViewRender).dom.contains(_event.target)) // accept drop only from render view
                return;
            let source = _viewSource.getDragDropSources()[0];
            if (source instanceof ƒ.Graph)
                this.dispatch(Fudge.EVENT_EDITOR.SELECT, { detail: { graph: source, node: this.restoreNode(source) } });
        }
        hndEvent = async (_event) => {
            const detail = _event.detail;
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.UPDATE: // TODO: inspect if these two should be stopped aswell
                case Fudge.EVENT_EDITOR.MODIFY:
                    break;
                case Fudge.EVENT_EDITOR.SELECT:
                    _event.stopPropagation();
                    const graph = detail.graph;
                    if (graph && graph != this.#graph) {
                        this.storeGraph(graph);
                        this.setTitle(`${graph.type} | ${graph.name}`);
                        this.#graph = graph;
                    }
                    const node = detail.node;
                    if (node && node != this.#node) {
                        this.storeNode(this.#graph, node);
                        this.#node = node;
                    }
                    break;
                case Fudge.EVENT_EDITOR.CLOSE:
                    if (detail.view != this)
                        return;
                    if (this.#graph)
                        this.storeGraph(this.#graph);
                    if (this.#graph && this.#node)
                        this.storeNode(this.#graph, this.#node);
                    return;
                default:
                    _event.stopPropagation();
            }
            this.broadcast(_event);
        };
        storeNode(_graph, _selected) {
            sessionStorage.setItem(`${this.id}_${_graph.idResource}`, ƒ.Node.PATH_FROM_TO(_graph, _selected));
        }
        restoreNode(_graph) {
            let selected = sessionStorage.getItem(`${this.id}_${_graph.idResource}`);
            return selected && ƒ.Node.FIND(_graph, selected);
        }
        storeGraph(_graph) {
            sessionStorage.setItem(this.id, _graph.idResource);
        }
        async restoreGraph() {
            let id = sessionStorage.getItem(this.id);
            return id && ƒ.Project.getResource(id);
        }
    }
    Fudge.PanelGraph = PanelGraph;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    /**
    * Shows a help and documentation
    * @authors Jirka Dell'Oro-Friedl, HFU, 2021
    */
    class PanelHelp extends Fudge.Panel {
        constructor(_container, _state) {
            super(_container, _state);
            this.setTitle("Help");
            console.log(this.dom);
            // TODO: iframe sandbox disallows use of scripts, remove or replace with object if necessary
            // this.dom.innerHTML = `<iframe src="Help.html" sandbox></iframe>`;
            this.dom.innerHTML = `<object data="Help.html"></object>`;
            // const config: RowOrColumnItemConfig = {
            //   type: "column",
            //   isClosable: true,
            //   content: [
            //     {
            //       type: "component",
            //       componentType: VIEW.RENDER,
            //       componentState: _state,
            //       title: "Render"
            //     }
            //   ]
            // };
            // this.goldenLayout.addItemAtLocation(config, [{ typeId: LayoutManager.LocationSelector.TypeId.Root }]);
        }
    }
    Fudge.PanelHelp = PanelHelp;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    /**
     * TODO: add
     * @authors Jonas Plotzky, HFU, 2022
     */
    class PanelParticleSystem extends Fudge.Panel {
        constructor(_container, _state) {
            const config = {
                type: "column",
                content: [{
                        type: "component",
                        componentType: Fudge.VIEW.PARTICLE_SYSTEM,
                        title: ƒ.ParticleSystem.name
                    }]
            };
            super(_container, _state, { [Fudge.VIEW.PARTICLE_SYSTEM]: Fudge.ViewParticleSystem }, config);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CLOSE, this.hndEvent);
            this.setTitle(ƒ.ParticleSystem.name);
        }
        // public getState(): { [key: string]: string } {
        //   // TODO: iterate over views and collect their states for reconstruction
        //   return {};
        // }
        hndEvent = async (_event) => {
            this.broadcast(_event);
            // _event.stopPropagation();
        };
    }
    Fudge.PanelParticleSystem = PanelParticleSystem;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    /**
     * Display the project structure and offer functions for creation, deletion and adjustment of resources
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020- 2023
     */
    class PanelProject extends Fudge.Panel {
        constructor(_container, _state) {
            const constructors = {
                [Fudge.VIEW.INTERNAL_TABLE]: Fudge.ViewInternalTable,
                [Fudge.VIEW.INTERNAL_FOLDER]: Fudge.ViewInternalFolder,
                [Fudge.VIEW.EXTERNAL]: Fudge.ViewExternal,
                [Fudge.VIEW.PROPERTIES]: Fudge.ViewProperties,
                [Fudge.VIEW.PREVIEW]: Fudge.ViewPreview,
                [Fudge.VIEW.SCRIPT]: Fudge.ViewScript
            };
            const config = {
                type: "column",
                content: [{
                        type: "row",
                        content: [{
                                type: "component",
                                componentType: Fudge.VIEW.PROPERTIES,
                                title: "Properties"
                            }, {
                                type: "component",
                                componentType: Fudge.VIEW.PREVIEW,
                                title: "Preview"
                            }]
                    }, {
                        type: "row",
                        content: [{
                                type: "column",
                                content: [{
                                        type: "component",
                                        componentType: Fudge.VIEW.EXTERNAL,
                                        title: "External"
                                    }, {
                                        type: "component",
                                        componentType: Fudge.VIEW.SCRIPT,
                                        title: "Script"
                                    }]
                            }, {
                                type: "stack",
                                content: [{
                                        type: "component",
                                        componentType: Fudge.VIEW.INTERNAL_FOLDER,
                                        title: "Internal"
                                    }, {
                                        type: "component",
                                        componentType: Fudge.VIEW.INTERNAL_TABLE,
                                        title: "Table"
                                    }]
                            }]
                    }]
            };
            super(_container, _state, constructors, config);
            this.dom.addEventListener("itemselect" /* ƒui.EVENT.SELECT */, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            // document.addEventListener(EVENT_EDITOR.CREATE, this.hndEvent); // TODO: explain use of document // removed beacause this keeps the panels alive even when closed
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CREATE, this.hndEvent);
            this.setTitle("Project | " + Fudge.project.name);
            this.broadcast(new Fudge.EditorEvent(Fudge.EVENT_EDITOR.OPEN, {}));
        }
        hndEvent = (_event) => {
            if (_event.type != Fudge.EVENT_EDITOR.UPDATE && _event.type != Fudge.EVENT_EDITOR.CREATE && _event.type != Fudge.EVENT_EDITOR.DELETE)
                _event.stopPropagation();
            this.setTitle("Project | " + Fudge.project.name); //why here and everytime?
            if (_event.type == "itemselect" /* ƒui.EVENT.SELECT */) {
                this.broadcast(new Fudge.EditorEvent(Fudge.EVENT_EDITOR.SELECT, { detail: _event.detail }));
            }
            else
                this.broadcast(_event);
        };
    }
    Fudge.PanelProject = PanelProject;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    /**
     * View and edit a particle system attached to a node.
     * @authors Jonas Plotzky, HFU, 2022
     */
    class ViewParticleSystem extends Fudge.View {
        static PROPERTY_KEYS = ["variables", "mtxLocal", "mtxWorld", "color"];
        cmpParticleSystem;
        particleSystem;
        data;
        toolbar;
        toolbarIntervalId;
        timeScalePlay;
        tree;
        controller;
        errors = [];
        variables;
        constructor(_container, _state) {
            super(_container, _state);
            this.createToolbar();
            this.setParticleSystem(null);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CREATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CLOSE, this.hndEvent);
            document.addEventListener("keydown" /* ƒui.EVENT.KEY_DOWN */, this.hndEvent);
        }
        //#region context menu
        openContextMenu = (_event) => {
            let focus = this.tree.getFocussed();
            if (!focus)
                return;
            this.contextMenu.items.forEach(_item => _item.visible = false);
            let popup = false;
            if (focus == this.data) {
                let item = this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ADD_PARTICLE_PROPERTY));
                item.visible = true;
                item.submenu.items.forEach(_subItem => _subItem.visible = false);
                ViewParticleSystem.PROPERTY_KEYS
                    .filter(_value => !Object.keys(focus).includes(_value))
                    .forEach(_label => item.submenu.items.find(_item => _item.label == _label).visible = true);
                popup = true;
            }
            if (focus == this.data.variables || focus == this.data.color || ƒ.ParticleData.isFunction(focus) || ƒ.ParticleData.isTransformation(focus)) {
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ADD_PARTICLE_CONSTANT)).visible = true;
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ADD_PARTICLE_FUNCTION)).visible = true;
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ADD_PARTICLE_CODE)).visible = true;
                popup = true;
            }
            if (focus == this.data.mtxLocal || focus == this.data.mtxWorld) {
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ADD_PARTICLE_TRANSFORMATION)).visible = true;
                popup = true;
            }
            if (focus != this.data) {
                this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.DELETE_PARTICLE_DATA)).visible = true;
                popup = true;
            }
            if (popup)
                this.contextMenu.popup();
        };
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            let options = ViewParticleSystem.PROPERTY_KEYS;
            item = new Fudge.remote.MenuItem({
                label: "Add Property",
                id: String(Fudge.CONTEXTMENU.ADD_PARTICLE_PROPERTY),
                submenu: generateSubMenu(options, String(Fudge.CONTEXTMENU.ADD_PARTICLE_PROPERTY), _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Add Value", id: String(Fudge.CONTEXTMENU.ADD_PARTICLE_CONSTANT), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Add Function", id: String(Fudge.CONTEXTMENU.ADD_PARTICLE_FUNCTION), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Add Code", id: String(Fudge.CONTEXTMENU.ADD_PARTICLE_CODE), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Add Transformation",
                id: String(Fudge.CONTEXTMENU.ADD_PARTICLE_TRANSFORMATION),
                submenu: generateSubMenu([ƒ.Matrix4x4.prototype.translate.name, ƒ.Matrix4x4.prototype.rotate.name, ƒ.Matrix4x4.prototype.scale.name], String(Fudge.CONTEXTMENU.ADD_PARTICLE_TRANSFORMATION), _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Delete", id: String(Fudge.CONTEXTMENU.DELETE_PARTICLE_DATA), click: _callback, accelerator: "D" });
            menu.append(item);
            return menu;
            function generateSubMenu(_options, _id, _callback) {
                let submenu = new Fudge.remote.Menu();
                let item;
                _options.forEach(_option => {
                    item = new Fudge.remote.MenuItem({ label: _option, id: _id, click: _callback });
                    submenu.append(item);
                });
                return submenu;
            }
        }
        async contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`MenuSelect: Item-id=${Fudge.CONTEXTMENU[_item.id]}`);
            let focus = this.tree.getFocussed();
            if (!focus)
                return;
            let child;
            switch (Number(_item.id)) {
                case Fudge.CONTEXTMENU.ADD_PARTICLE_PROPERTY:
                    child = [];
                case Fudge.CONTEXTMENU.ADD_PARTICLE_CONSTANT:
                    if (!child)
                        child = { value: 1 };
                case Fudge.CONTEXTMENU.ADD_PARTICLE_FUNCTION:
                    if (!child)
                        child = { function: ƒ.ParticleData.FUNCTION.ADDITION, parameters: [] };
                case Fudge.CONTEXTMENU.ADD_PARTICLE_CODE:
                    if (!child)
                        child = { code: "1" };
                    if (ƒ.ParticleData.isFunction(focus) || ƒ.ParticleData.isTransformation(focus))
                        focus.parameters.push(child);
                    else if (focus == this.data) {
                        focus[_item.label] = child;
                        if (_item.label == "variables")
                            this.data.variableNames = [];
                    }
                    else if (focus == this.data.variables) {
                        this.data.variables.push(child);
                        this.data.variableNames.push(this.controller.generateNewVariableName());
                    }
                    else if (focus == this.data.color)
                        this.data.color.push(child);
                    this.controller.childToParent.set(child, focus);
                    this.tree.findVisible(focus).expand(true);
                    this.tree.findVisible(child).focus();
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, {});
                    break;
                case Fudge.CONTEXTMENU.ADD_PARTICLE_TRANSFORMATION:
                    child = { transformation: _item.label, parameters: [] };
                    focus.push(child);
                    this.controller.childToParent.set(child, focus);
                    this.tree.findVisible(focus).expand(true);
                    this.tree.findVisible(child).focus();
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, {});
                    break;
                case Fudge.CONTEXTMENU.DELETE_PARTICLE_DATA:
                    let remove = await this.controller.delete([focus]);
                    this.tree.delete(remove);
                    this.tree.clearSelection();
                    this.dispatch(Fudge.EVENT_EDITOR.DELETE, {});
                    break;
            }
        }
        //#endregion
        //#region event handling
        hndDragOver(_event, _viewSource) {
            _event.dataTransfer.dropEffect = "none";
            let source = _viewSource.getDragDropSources()[0];
            if (!(_viewSource instanceof Fudge.ViewHierarchy) || !(source instanceof ƒ.Node) || !source.getComponent(ƒ.ComponentParticleSystem)?.particleSystem)
                return;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
        }
        hndDrop(_event, _viewSource) {
            this.cmpParticleSystem = _viewSource.getDragDropSources()[0].getComponent(ƒ.ComponentParticleSystem);
            this.timeScalePlay = this.cmpParticleSystem.timeScale;
            this.setTime(0);
            this.setParticleSystem(this.cmpParticleSystem.particleSystem);
        }
        hndEvent = async (_event) => {
            _event.stopPropagation();
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.CLOSE:
                    window.clearInterval(this.toolbarIntervalId);
                    document.removeEventListener("keydown" /* ƒui.EVENT.KEY_DOWN */, this.hndEvent);
                    this.enableSave(true);
                    break;
                case "keydown" /* ƒui.EVENT.KEY_DOWN */:
                    if (this.errors.length > 0 && _event instanceof KeyboardEvent && _event.code == ƒ.KEYBOARD_CODE.S && _event.ctrlKey)
                        ƒui.Warning.display(this.errors.map(([_data, _error]) => _error), "Unable to save", `Project can't be saved while having unresolved errors`, "OK");
                    break;
                case Fudge.EVENT_EDITOR.MODIFY:
                    this.tree.findVisible(_event.detail.data)?.refreshContent();
                    break;
                case Fudge.EVENT_EDITOR.CREATE:
                case Fudge.EVENT_EDITOR.DELETE:
                case "rename" /* ƒui.EVENT.RENAME */:
                case "delete" /* ƒui.EVENT.DELETE */:
                case "drop" /* ƒui.EVENT.DROP */:
                case "cut" /* ƒui.EVENT.CUT */: // TODO: customs trees cut is async, this should happen after cut is finished
                case "paste" /* ƒui.EVENT.PASTE */:
                    this.refreshVariables();
                case "expand" /* ƒui.EVENT.EXPAND */:
                    let invalid = this.validateData(this.data);
                    this.errors
                        .filter(_error => !invalid.includes(_error))
                        .map(([_data]) => this.tree.findVisible(_data))
                        .forEach(_item => {
                        if (!_item)
                            return;
                        _item.classList.remove("warning");
                        _item.title = "";
                    });
                    this.errors = invalid;
                    if (this.errors.length == 0 && _event.type != "expand" /* ƒui.EVENT.EXPAND */) {
                        this.particleSystem.data = JSON.parse(JSON.stringify(this.data)); // our working copy should only be used if it is valid 
                    }
                    else {
                        this.errors.forEach(([_data, _error]) => {
                            let item = this.tree.findVisible(_data);
                            if (!item)
                                return;
                            item.classList.add("warning");
                            item.title = _error;
                        });
                    }
                    this.enableSave(this.errors.length == 0);
                    break;
            }
        };
        //#endregion
        //#region toolbar
        createToolbar() {
            this.toolbar = document.createElement("div");
            this.toolbar.id = "toolbar";
            this.toolbar.title = "● Control the playback of the selected particle system\n● Right click render view to activate continous rendering";
            let buttons = document.createElement("div");
            buttons.id = "buttons";
            ["backward", "play", "forward"]
                .map(_id => {
                let button = document.createElement("button");
                button.id = _id;
                button.classList.add("buttonIcon");
                button.onclick = (_event) => {
                    let timeScale = this.cmpParticleSystem.timeScale;
                    switch (_event.target.id) {
                        case "backward":
                            timeScale -= 0.2;
                            break;
                        case "play":
                            timeScale = this.timeScalePlay;
                            break;
                        case "pause":
                            this.timeScalePlay = timeScale;
                            timeScale = 0;
                            break;
                        case "forward":
                            timeScale += 0.2;
                            break;
                    }
                    this.setTimeScale(timeScale);
                };
                return button;
            })
                .forEach(_button => buttons.appendChild(_button));
            this.toolbar.appendChild(buttons);
            let timeScaleStepper = new ƒui.CustomElementStepper({ key: "timeScale", label: "timeScale" });
            timeScaleStepper.id = "timescale";
            timeScaleStepper.oninput = () => {
                this.setTimeScale(timeScaleStepper.getMutatorValue());
            };
            this.toolbar.appendChild(timeScaleStepper);
            let timeStepper = new ƒui.CustomElementStepper({ key: "time", label: "time", value: "0" });
            timeStepper.id = "time";
            timeStepper.title = "The time (in seconds) of the particle system";
            timeStepper.oninput = () => {
                this.setTime(timeStepper.getMutatorValue());
            };
            this.toolbar.appendChild(timeStepper);
            let timeSliderSteps = document.createElement("div");
            timeSliderSteps.id = "timeslidersteps";
            this.toolbar.appendChild(timeSliderSteps);
            let timeSlider = document.createElement("input");
            timeSlider.id = "timeslider";
            timeSlider.type = "range";
            timeSlider.value = "0";
            timeSlider.min = "0";
            timeSlider.max = "1";
            timeSlider.step = "any";
            timeSlider.oninput = () => {
                this.setTime(parseFloat(timeSlider.value));
            };
            this.toolbar.appendChild(timeSlider);
            this.toolbarIntervalId = window.setInterval(() => {
                if (this.cmpParticleSystem) {
                    let timeInSeconds = this.cmpParticleSystem.time / 1000;
                    timeScaleStepper.setMutatorValue(this.cmpParticleSystem.timeScale);
                    timeStepper.setMutatorValue(timeInSeconds);
                    let duration = this.cmpParticleSystem.duration / 1000;
                    if (parseFloat(timeSlider.max) != duration * 1.1) { // value has changed
                        timeSlider.max = (duration * 1.1).toString();
                        timeSliderSteps.innerHTML = [0, 0.25, 0.5, 0.75, 1]
                            .map(_factor => duration * _factor)
                            .map(_value => `<span data-label="${_value.toFixed(2)}"></span>`).join("");
                    }
                    timeSlider.value = timeInSeconds.toString();
                }
            }, 1000 / 30);
        }
        setTime(_timeInSeconds) {
            this.setTimeScale(0);
            this.cmpParticleSystem.time = _timeInSeconds * 1000;
        }
        setTimeScale(_timeScale) {
            _timeScale = parseFloat(_timeScale.toFixed(15)); // round so forward and backward button don't miss zero
            if (_timeScale != 0)
                this.timeScalePlay = _timeScale;
            this.cmpParticleSystem.timeScale = _timeScale;
            let playButton = this.toolbar.querySelector("#play") || this.toolbar.querySelector("#pause");
            playButton.id = _timeScale == 0 ? "play" : "pause";
        }
        //#endregion
        setParticleSystem(_particleSystem) {
            if (!_particleSystem) {
                this.particleSystem = undefined;
                this.tree = undefined;
                this.dom.innerHTML = "Drop a node with an attached particle system here to edit";
                return;
            }
            this.particleSystem = _particleSystem;
            this.data = JSON.parse(JSON.stringify(_particleSystem.data)); // we will work with a copy
            this.setTitle(this.particleSystem.name);
            this.dom.innerHTML = "";
            this.variables = document.createElement("datalist");
            this.variables.id = "variables";
            this.dom.appendChild(this.variables);
            this.refreshVariables();
            this.dom.appendChild(this.toolbar);
            this.controller = new Fudge.ControllerTreeParticleSystem(this.data, this);
            this.tree = new ƒui.CustomTree(this.controller, this.data);
            this.tree.addEventListener("rename" /* ƒui.EVENT.RENAME */, this.hndEvent);
            this.tree.addEventListener("drop" /* ƒui.EVENT.DROP */, this.hndEvent);
            this.tree.addEventListener("delete" /* ƒui.EVENT.DELETE */, this.hndEvent);
            this.tree.addEventListener("cut" /* ƒui.EVENT.CUT */, this.hndEvent);
            this.tree.addEventListener("paste" /* ƒui.EVENT.PASTE */, this.hndEvent);
            this.tree.addEventListener("expand" /* ƒui.EVENT.EXPAND */, this.hndEvent);
            this.tree.addEventListener("contextmenu" /* ƒui.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.appendChild(this.tree);
            this.dom.title = `● Right click on "${ƒ.ParticleSystem.name}" to add properties.\n● Right click on properties to add transformations/expressions.\n● Right click on transformations/expressions to add expressions.\n● Use Copy/Cut/Paste to duplicate data.`;
            this.tree.title = this.dom.title;
        }
        validateData(_data) {
            let invalid = [];
            validateRecursive(_data);
            return invalid;
            function validateRecursive(_data, _path = []) {
                if (ƒ.ParticleData.isFunction(_data)) {
                    let minParameters = ƒ.ParticleData.FUNCTION_MINIMUM_PARAMETERS[_data.function];
                    if (_data.parameters.length < ƒ.ParticleData.FUNCTION_MINIMUM_PARAMETERS[_data.function]) {
                        let error = `"${_path.join("/")}/${_data.function}" needs at least ${minParameters} parameters`;
                        invalid.push([_data, error]);
                    }
                }
                Object.entries(ƒ.ParticleData.isFunction(_data) ? _data.parameters : _data).forEach(([_key, _value]) => {
                    if (typeof _value == "object")
                        validateRecursive(_value, _path.concat(_key));
                });
            }
        }
        enableSave(_on) {
            Fudge.remote.Menu.getApplicationMenu().getMenuItemById(Fudge.MENU.PROJECT_SAVE).enabled = _on;
        }
        refreshVariables() {
            let options = Object.keys(ƒ.ParticleData.PREDEFINED_VARIABLES);
            if (this.data.variables)
                options.push(...this.data.variableNames);
            this.variables.innerHTML = options.map(_name => `<option value="${_name}">`).join("");
        }
    }
    Fudge.ViewParticleSystem = ViewParticleSystem;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    /**
     * View and edit the animatable properties of a node with an attached component animation.
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022 | Jirka Dell'Oro-Friedl, HFU, 2023
     */
    class ViewAnimation extends Fudge.View {
        keySelected;
        node;
        cmpAnimator;
        animation;
        playbackTime = 0;
        propertyList;
        controller;
        toolbar;
        frameInput;
        time = new ƒ.Time();
        idInterval;
        constructor(_container, _state) {
            super(_container, _state);
            this.setAnimation(null);
            this.createToolbar();
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒui.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("input" /* ƒui.EVENT.INPUT */, this.hndEvent);
            this.dom.addEventListener("focusin" /* ƒui.EVENT.FOCUS_IN */, this.hndEvent);
        }
        hndDragOver(_event, _viewSource) {
            _event.dataTransfer.dropEffect = "none";
            let source = _viewSource.getDragDropSources()[0];
            if (!(_viewSource instanceof Fudge.ViewHierarchy) || !(source instanceof ƒ.Node) || !source.getComponent(ƒ.ComponentAnimator)?.animation)
                return;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
        }
        hndDrop(_event, _viewSource) {
            let source = _viewSource.getDragDropSources()[0];
            this.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { node: source } });
        }
        //#region context menu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let path = [];
            if (this.node != undefined) {
                let item;
                item = new Fudge.remote.MenuItem({
                    label: "Add Property",
                    submenu: this.getNodeSubmenu(this.node, path, _callback)
                });
                menu.append(item);
                item = new Fudge.remote.MenuItem({ label: "Delete Property", id: String(Fudge.CONTEXTMENU.DELETE_PROPERTY), click: _callback, accelerator: "D" });
                menu.append(item);
                item = new Fudge.remote.MenuItem({ label: "Convert to Animation", id: String(Fudge.CONTEXTMENU.CONVERT_ANIMATION), click: _callback, accelerator: "C" });
                menu.append(item);
            }
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            let choice = Number(_item.id);
            ƒ.Debug.fudge(`MenuSelect | id: ${Fudge.CONTEXTMENU[_item.id]} | event: ${_event}`);
            switch (choice) {
                case Fudge.CONTEXTMENU.ADD_PROPERTY:
                    // defined in getMutatorSubmenu, this seems to be the only way to keep the path associated with the menu item, attaching anything to item
                    break;
                case Fudge.CONTEXTMENU.DELETE_PROPERTY:
                    if (!(document.activeElement instanceof HTMLElement))
                        return;
                    this.controller.deleteProperty(document.activeElement);
                    this.createPropertyList();
                    this.animate();
                    break;
                case Fudge.CONTEXTMENU.CONVERT_ANIMATION:
                    if (this.animation instanceof ƒ.AnimationSprite) {
                        let animation = this.animation.convertToAnimation();
                        console.log(animation);
                    }
            }
        }
        getNodeSubmenu(_node, _path, _callback) {
            const menu = new Fudge.remote.Menu();
            for (const componentClass of ƒ.Component.subclasses) {
                //@ts-ignore
                _node.getComponents(componentClass).forEach((_component, _index) => {
                    let path = Object.assign([], _path);
                    path.push("components");
                    path.push(_component.type);
                    path.push(_index.toString());
                    let mutator = _component.getMutatorForAnimation();
                    if (mutator && Object.keys(mutator).length > 0) {
                        let item;
                        item = new Fudge.remote.MenuItem({ label: _component.type, submenu: this.getMutatorSubmenu(mutator, path, _callback) });
                        menu.append(item);
                    }
                });
            }
            for (const child of _node.getChildren()) {
                let path = Object.assign([], _path);
                path.push("children");
                path.push(child.name);
                let item;
                item = new Fudge.remote.MenuItem({ label: child.name, submenu: this.getNodeSubmenu(child, path, _callback) });
                menu.append(item);
            }
            return menu;
        }
        getMutatorSubmenu(_mutator, _path, _callback) {
            const menu = new Fudge.remote.Menu();
            for (const property in _mutator) {
                let item;
                let path = Object.assign([], _path);
                path.push(property);
                if (typeof _mutator[property] === "object") {
                    item = new Fudge.remote.MenuItem({ label: property, submenu: this.getMutatorSubmenu(_mutator[property], path, _callback) });
                }
                else {
                    item = new Fudge.remote.MenuItem({
                        label: property, id: String(Fudge.CONTEXTMENU.ADD_PROPERTY), click: () => {
                            this.controller.addProperty(path, this.node, this.playbackTime);
                            this.createPropertyList();
                            this.animate();
                        }
                    });
                }
                menu.append(item);
            }
            return menu;
        }
        //#endregion
        createToolbar() {
            this.toolbar = document.createElement("div");
            this.toolbar.id = "toolbar";
            ["previous", "play", "next"]
                .map(_id => {
                let button = document.createElement("button");
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
            this.frameInput.addEventListener("input", (_event) => {
                this.playbackTime = Number.parseInt(this.frameInput.value) * 1000 / this.animation.fps;
                this.animate();
            });
            this.toolbar.appendChild(this.frameInput);
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    if (_event.detail.data instanceof ƒ.AnimationKey) {
                        this.keySelected = _event.detail.data;
                        break;
                    }
                    if (_event.detail.node != null) {
                        this.node = _event.detail.node;
                        this.cmpAnimator = this.node.getComponent(ƒ.ComponentAnimator);
                        this.contextMenu = this.getContextMenu(this.contextMenuCallback.bind(this));
                        if (this.cmpAnimator?.animation != this.animation)
                            this.setAnimation(this.cmpAnimator?.animation);
                        else
                            _event.stopPropagation();
                    }
                    break;
                case Fudge.EVENT_EDITOR.MODIFY:
                    if (_event.detail.mutable instanceof ƒ.ComponentAnimator) {
                        // switched animation in a ComponentAnimator
                        if (this.node == _event.detail.mutable.node)
                            this.dispatch(Fudge.EVENT_EDITOR.SELECT, { detail: { node: _event.detail.mutable.node } });
                        break;
                    }
                    if (!(_event.detail.view instanceof ViewAnimation || _event.detail.view instanceof Fudge.ViewAnimationSheet))
                        break;
                    if (_event.detail.view instanceof Fudge.ViewAnimationSheet)
                        this.pause();
                    this.playbackTime = _event.detail.data;
                    if (!this.animation)
                        break;
                    this.frameInput.value = (Math.trunc(this.playbackTime / 1000 * this.animation.fps)).toString();
                    this.animation.clearCache();
                    let nodeMutator = this.cmpAnimator?.updateAnimation(this.playbackTime) || {};
                    this.controller?.update(nodeMutator, this.playbackTime);
                    this.propertyList.dispatchEvent(new CustomEvent(Fudge.EVENT_EDITOR.MODIFY));
                    break;
                case "input" /* ƒui.EVENT.INPUT */:
                case "focusin" /* ƒui.EVENT.FOCUS_IN */:
                    let target = _event.target;
                    if (target instanceof ƒui.CustomElementDigit)
                        target = target.parentElement;
                    if (target instanceof ƒui.CustomElementStepper) {
                        this.controller.updateSequence(this.playbackTime, target, _event.type == "input" /* ƒui.EVENT.INPUT */);
                    }
                    this.animate();
                    break;
            }
        };
        setAnimation(_animation) {
            if (_animation) {
                this.dom.innerHTML = "";
                this.dom.appendChild(this.toolbar);
                this.animation = _animation;
                this.createPropertyList();
                this.animate();
            }
            else {
                this.animation = undefined;
                this.dom.innerHTML = "Drop a node with an attached animation here to edit";
            }
        }
        createPropertyList() {
            let nodeMutator = this.animation.getState(this.playbackTime, 0, this.cmpAnimator.quantization) || {};
            let newPropertyList = ƒui.Generator.createInterfaceFromMutator(nodeMutator);
            if (this.dom.contains(this.propertyList))
                this.dom.replaceChild(newPropertyList, this.propertyList);
            else
                this.dom.appendChild(newPropertyList);
            this.propertyList = newPropertyList;
            this.propertyList.id = "propertylist";
            this.controller = new Fudge.ControllerAnimation(this.animation, this.propertyList, this);
            this.controller.update(nodeMutator);
            // ƒui-EVENT must not be dispatched!
            // this.dom.dispatchEvent(new CustomEvent(ƒui.EVENT.CLICK));
            this.propertyList.dispatchEvent(new CustomEvent(Fudge.EVENT_EDITOR.MODIFY));
        }
        animate() {
            this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true, detail: { data: this.playbackTime } });
        }
        hndToolbarClick = (_event) => {
            let target = _event.target;
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
        pause() {
            if (this.idInterval == null)
                return;
            this.toolbar.querySelector("#pause").id = "play";
            window.clearInterval(this.idInterval);
            this.idInterval = null;
        }
    }
    Fudge.ViewAnimation = ViewAnimation;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    let SHEET_MODE;
    (function (SHEET_MODE) {
        SHEET_MODE["DOPE"] = "Dopesheet";
        SHEET_MODE["CURVES"] = "Curves";
    })(SHEET_MODE || (SHEET_MODE = {}));
    /**
     * View and edit animation sequences, animation keys and curves connecting them.
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022
     */
    class ViewAnimationSheet extends Fudge.View {
        static KEY_SIZE = 6; // width and height in px
        static TIMELINE_HEIGHT = 30.5; // in px, keep .5 at end for odd line width
        static EVENTS_HEIGHT = 30; // in px
        static SCALE_WIDTH = 40; // in px
        static PIXEL_PER_MILLISECOND = 1; // at scaling 1
        static PIXEL_PER_VALUE = 100; // at scaling 1
        static MINIMUM_PIXEL_PER_STEP = 60; // at any scaling, for both x and y
        static STANDARD_ANIMATION_LENGTH = 1000; // in miliseconds, used when animation length is falsy
        animation;
        playbackTime = 0;
        canvas = document.createElement("canvas");
        crc2 = this.canvas.getContext("2d");
        eventInput = document.createElement("input");
        scrollContainer = document.createElement("div");
        scrollBody = document.createElement("div");
        mtxWorldToScreen = new ƒ.Matrix3x3();
        selectedKey;
        selectedEvent;
        keys = [];
        sequences = [];
        events = [];
        slopeHooks = [];
        documentStyle = window.getComputedStyle(document.documentElement);
        posPanStart = new ƒ.Vector2();
        posRightClick = new ƒ.Vector2();
        #mode;
        constructor(_container, _state) {
            super(_container, _state);
            // maybe use this solution for all views?
            this.dom.style.position = "absolute";
            this.dom.style.inset = "0";
            this.dom.style.display = "block";
            this.dom.style.height = "auto";
            this.dom.style.padding = "0";
            this.dom.style.margin = "0.5em";
            this.dom.style.overflow = "hidden";
            this.mode = SHEET_MODE.DOPE;
            _container.on("resize", () => this.draw(true));
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒui.EVENT.CONTEXTMENU */, this.openContextMenuSheet);
            this.canvas.style.position = "absolute";
            this.dom.appendChild(this.canvas);
            this.scrollContainer.style.position = "relative";
            this.scrollContainer.style.height = "100%";
            this.scrollContainer.style.overflowX = "scroll";
            this.scrollContainer.style.scrollBehavior = "instant";
            this.scrollContainer.onpointerdown = this.hndPointerDown;
            this.scrollContainer.onpointerup = this.hndPointerUp;
            this.scrollContainer.onpointerleave = this.hndPointerUp;
            this.scrollContainer.onwheel = this.hndWheel;
            this.dom.appendChild(this.scrollContainer);
            this.scrollBody.style.height = "1px";
            this.scrollContainer.appendChild(this.scrollBody);
            this.eventInput.type = "text";
            this.eventInput.hidden = true;
            this.eventInput.oninput = () => {
                if (this.selectedEvent.type == "event") {
                    let time = this.animation.events[this.selectedEvent.data];
                    this.animation.removeEvent(this.selectedEvent.data);
                    this.animation.setEvent(this.eventInput.value, time);
                }
                else {
                    let time = this.animation.labels[this.selectedEvent.data];
                    delete this.animation.labels[this.selectedEvent.data];
                    this.animation.labels[this.eventInput.value] = time;
                }
                this.selectedEvent.data = this.eventInput.value;
                this.draw();
            };
            this.dom.appendChild(this.eventInput);
        }
        get mode() {
            return this.#mode;
        }
        set mode(_mode) {
            this.#mode = _mode;
            this.setTitle(_mode);
            this.resetView();
            this.draw(true);
        }
        //#region context menu
        openContextMenuSheet = (_event) => {
            this.contextMenu.items.forEach(_item => _item.visible = false);
            if (this.posRightClick.y > ViewAnimationSheet.TIMELINE_HEIGHT && this.posRightClick.y < ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT) { // click on events
                let deleteEvent = this.events.find(_object => this.crc2.isPointInPath(_object.path2D, this.posRightClick.x, this.posRightClick.y));
                if (deleteEvent) {
                    if (deleteEvent.type == "event")
                        this.contextMenu.getMenuItemById("Delete Event").visible = true;
                    else
                        this.contextMenu.getMenuItemById("Delete Label").visible = true;
                    Reflect.set(this.contextMenu, "targetEvent", deleteEvent);
                }
                else {
                    this.contextMenu.getMenuItemById("Add Label").visible = true;
                    this.contextMenu.getMenuItemById("Add Event").visible = true;
                    Reflect.set(this.contextMenu, "targetTime", this.screenToTime(this.posRightClick.x));
                }
                this.openContextMenu(_event);
            }
            if (this.posRightClick.y > ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT) {
                let targetKey = this.keys.find(_object => this.crc2.isPointInPath(_object.path2D, this.posRightClick.x, this.posRightClick.y));
                if (targetKey) {
                    this.contextMenu.getMenuItemById("Delete Key").visible = true;
                    Reflect.set(this.contextMenu, "targetKey", targetKey);
                }
                else {
                    this.contextMenu.getMenuItemById(SHEET_MODE.DOPE).visible = this.mode != SHEET_MODE.DOPE;
                    this.contextMenu.getMenuItemById(SHEET_MODE.CURVES).visible = this.mode != SHEET_MODE.CURVES;
                }
                this.openContextMenu(_event);
            }
        };
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({ id: SHEET_MODE.DOPE, label: SHEET_MODE.DOPE, click: () => this.mode = SHEET_MODE.DOPE });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: SHEET_MODE.CURVES, label: SHEET_MODE.CURVES, click: () => this.mode = SHEET_MODE.CURVES });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: "Add Event", label: "Add Event", click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: "Delete Event", label: "Delete Event", click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: "Add Label", label: "Add Label", click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: "Delete Label", label: "Delete Label", click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ id: "Delete Key", label: "Delete Key", click: _callback });
            menu.append(item);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            let choice = _item.id;
            ƒ.Debug.fudge(`MenuSelect | id: ${Fudge.CONTEXTMENU[_item.id]} | event: ${_event}`);
            let targetKey = Reflect.get(this.contextMenu, "targetKey");
            let targetEvent = Reflect.get(this.contextMenu, "targetEvent");
            let targetTime = Reflect.get(this.contextMenu, "targetTime");
            switch (choice) {
                case "Add Event":
                    let eventName = `${this.animation.name}Event${Object.keys(this.animation.events).length}`;
                    this.animation.setEvent(eventName, targetTime);
                    this.selectedEvent = { data: eventName, path2D: null, type: "event" };
                    this.draw();
                    break;
                case "Delete Event":
                    this.animation.removeEvent(targetEvent.data);
                    this.draw();
                    break;
                case "Add Label":
                    let labelName = `${this.animation.name}Label${Object.keys(this.animation.events).length}`;
                    this.animation.labels[labelName] = targetTime;
                    this.selectedEvent = { data: labelName, path2D: null, type: "label" };
                    this.draw();
                    break;
                case "Delete Label":
                    delete this.animation.labels[targetEvent.data];
                    this.draw();
                    break;
                case "Delete Key":
                    let sequence = this.sequences.find(_sequence => _sequence.data.getKeys().includes(targetKey.data)).data;
                    if (sequence.length < 2) {
                        ƒ.Debug.warn("Only one key left in sequence. Delete property instead.");
                        break;
                    }
                    sequence.removeKey(targetKey.data);
                    this.animate();
                    break;
            }
        }
        //#endregion
        //#region drawing
        draw(_scroll = false) {
            this.canvas.width = this.dom.clientWidth;
            this.canvas.height = this.dom.clientHeight;
            let translation = this.mtxWorldToScreen.translation;
            translation.x = Math.min(ViewAnimationSheet.SCALE_WIDTH, translation.x);
            this.mtxWorldToScreen.translation = translation;
            if (this.animation) {
                this.generateKeys();
                this.drawTimeline();
                this.drawEvents();
                this.drawScale();
                this.drawCurves();
                this.drawKeys();
                this.drawCursor();
                this.drawHighlight();
            }
            if (_scroll) {
                let leftWidth = -this.mtxWorldToScreen.translation.x + ViewAnimationSheet.SCALE_WIDTH;
                let screenWidth = this.canvas.width + leftWidth;
                let animationWidth = this.animation?.totalTime * this.mtxWorldToScreen.scaling.x + ViewAnimationSheet.SCALE_WIDTH * 2;
                this.scrollBody.style.width = `${Math.max(animationWidth, screenWidth)}px`;
                this.scrollContainer.scrollLeft = leftWidth;
            }
        }
        generateKeys() {
            this.keys = this.sequences.flatMap((_sequence, _iSequence) => _sequence.data.getKeys().map((_key) => {
                let viewKey = {
                    data: _key,
                    color: _sequence.color,
                    path2D: this.generateKey(this.worldToScreenPoint(_key.time, this.mode == SHEET_MODE.CURVES ? _key.value : _iSequence * ViewAnimationSheet.KEY_SIZE * 4), ViewAnimationSheet.KEY_SIZE, ViewAnimationSheet.KEY_SIZE),
                    type: "key"
                };
                return viewKey;
            }));
            if (this.selectedKey)
                this.selectedKey = this.keys.find(_key => _key.data == this.selectedKey.data);
        }
        generateKey(_position, _w, _h) {
            let path = new Path2D();
            path.moveTo(_position.x - _w, _position.y);
            path.lineTo(_position.x, _position.y + _h);
            path.lineTo(_position.x + _w, _position.y);
            path.lineTo(_position.x, _position.y - _h);
            path.closePath();
            return path;
        }
        drawTimeline() {
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-background-main");
            this.crc2.fillRect(0, 0, this.canvas.width, ViewAnimationSheet.TIMELINE_HEIGHT);
            let animationStart = Math.min(...this.keys.map(_key => _key.data.time)) * this.mtxWorldToScreen.scaling.x + this.mtxWorldToScreen.translation.x;
            let animationEnd = Math.max(...this.keys.map(_key => _key.data.time)) * this.mtxWorldToScreen.scaling.x + this.mtxWorldToScreen.translation.x;
            this.crc2.fillStyle = "rgba(100, 100, 255, 0.2)";
            this.crc2.fillRect(animationStart, 0, animationEnd - animationStart, ViewAnimationSheet.TIMELINE_HEIGHT);
            this.crc2.beginPath();
            this.crc2.moveTo(0, ViewAnimationSheet.TIMELINE_HEIGHT);
            this.crc2.lineTo(this.canvas.width, ViewAnimationSheet.TIMELINE_HEIGHT);
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
            this.crc2.stroke();
            let fps = this.animation.fps;
            let pixelPerFrame = (1000 * ViewAnimationSheet.PIXEL_PER_MILLISECOND) / fps;
            let pixelPerStep = pixelPerFrame * this.mtxWorldToScreen.scaling.x;
            let framesPerStep = 1;
            // TODO: find a way to do this with O(1);
            let multipliers = [2, 3, 2, 5];
            let iMultipliers = 2;
            while (pixelPerStep < ViewAnimationSheet.MINIMUM_PIXEL_PER_STEP) {
                iMultipliers = (iMultipliers + 1) % multipliers.length;
                let multiplier = multipliers[iMultipliers];
                pixelPerStep *= multiplier;
                framesPerStep *= multiplier;
            }
            let subSteps = 0;
            let highSteps = 0; // every nth step will be higher
            if (framesPerStep != 1) {
                if (framesPerStep == 5) {
                    subSteps = 4;
                }
                else {
                    switch (iMultipliers) {
                        case 0:
                            subSteps = 9;
                            highSteps = 5;
                            break;
                        case 2:
                            subSteps = 5;
                            highSteps = 3;
                            break;
                        case 1:
                            subSteps = 5;
                            highSteps = 2;
                            break;
                        case 3:
                            subSteps = 9;
                            highSteps = 2;
                            break;
                    }
                }
            }
            let gridLines = new Path2D();
            let timeSteps = new Path2D();
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-text");
            this.crc2.textBaseline = "middle";
            this.crc2.textAlign = "left";
            this.crc2.font = this.documentStyle.font;
            let steps = 1 + this.canvas.width / pixelPerStep;
            let stepOffset = Math.floor(Math.abs(this.mtxWorldToScreen.translation.x) / pixelPerStep);
            for (let iStep = stepOffset; iStep < steps + stepOffset; iStep++) {
                let xStep = this.round(iStep * pixelPerStep + this.mtxWorldToScreen.translation.x);
                timeSteps.moveTo(xStep, ViewAnimationSheet.TIMELINE_HEIGHT);
                timeSteps.lineTo(xStep, ViewAnimationSheet.TIMELINE_HEIGHT - 20);
                gridLines.moveTo(xStep, ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT);
                gridLines.lineTo(xStep, this.canvas.height);
                let time = iStep * framesPerStep / fps;
                this.crc2.fillText(`${time.toFixed(2)}`, xStep + 3, ViewAnimationSheet.TIMELINE_HEIGHT - 20);
                let pixelPerSubStep = pixelPerStep / (subSteps + 1);
                for (let iSubStep = 1; iSubStep < subSteps + 1; iSubStep++) {
                    let xSubStep = xStep + Math.round(iSubStep * pixelPerSubStep);
                    timeSteps.moveTo(xSubStep, ViewAnimationSheet.TIMELINE_HEIGHT);
                    timeSteps.lineTo(xSubStep, ViewAnimationSheet.TIMELINE_HEIGHT - (iSubStep % highSteps == 0 ? 12 : 8));
                }
            }
            this.crc2.stroke(timeSteps);
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-background-main");
            this.crc2.stroke(gridLines);
        }
        drawEvents() {
            let totalHeight = ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT;
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-background-main");
            this.crc2.fillRect(0, ViewAnimationSheet.TIMELINE_HEIGHT + 0.5, this.canvas.width, ViewAnimationSheet.EVENTS_HEIGHT);
            this.crc2.beginPath();
            this.crc2.moveTo(0, totalHeight);
            this.crc2.lineTo(this.canvas.width, totalHeight);
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
            this.crc2.stroke();
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-text");
            this.events = [];
            if (!this.animation)
                return;
            for (const label in this.animation.labels) {
                let x = this.timeToScreen(this.animation.labels[label]);
                let viewLabel = { data: label, path2D: generateLabel(x), type: "label" };
                this.events.push(viewLabel);
                this.crc2.stroke(viewLabel.path2D);
            }
            for (const event in this.animation.events) {
                let x = this.timeToScreen(this.animation.events[event]);
                let viewEvent = { data: event, path2D: generateEvent(x), type: "event" };
                this.events.push(viewEvent);
                this.crc2.stroke(viewEvent.path2D);
            }
            this.selectedEvent = this.events.find(_event => _event.data == this.selectedEvent?.data);
            this.eventInput.hidden = this.selectedEvent == null;
            if (this.selectedEvent) {
                this.crc2.fill(this.selectedEvent.path2D);
                this.eventInput.style.left = `${(this.selectedEvent.type == "event" ? this.animation.events : this.animation.labels)[this.selectedEvent.data] * this.mtxWorldToScreen.scaling.x + this.mtxWorldToScreen.translation.x + 12}px`;
                this.eventInput.className = this.selectedEvent.type;
                // if (this.selectedEvent.type == "label")
                //   this.eventInput.style.top = `${ViewAnimationSheet.TIMELINE_HEIGHT}px`;
                // else
                //   this.eventInput.style.top = `${ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT / 2 - 2}px`;
                this.eventInput.value = this.selectedEvent.data;
            }
            this.crc2.save();
            this.crc2.rect(0, ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT, this.canvas.width, this.canvas.height);
            this.crc2.clip();
            function generateEvent(_x) {
                let path = new Path2D;
                path.moveTo(_x, totalHeight - 26);
                path.lineTo(_x, totalHeight - 4);
                path.lineTo(_x, totalHeight - 10);
                path.lineTo(_x + 8, totalHeight - 16);
                path.lineTo(_x + 8, totalHeight - 4);
                path.lineTo(_x, totalHeight - 10);
                // path.closePath();
                return path;
            }
            function generateLabel(_x) {
                let path = new Path2D;
                path.moveTo(_x, totalHeight - 4);
                path.lineTo(_x, totalHeight - 26);
                path.lineTo(_x + 8, totalHeight - 20);
                path.lineTo(_x, totalHeight - 14);
                // path.lineTo(_x, totalHeight - 26);
                // path.closePath();
                return path;
            }
        }
        drawScale() {
            if (this.mode != SHEET_MODE.CURVES)
                return;
            let center = this.round(this.mtxWorldToScreen.translation.y);
            this.crc2.beginPath();
            this.crc2.moveTo(0, center);
            this.crc2.lineTo(this.canvas.width, center);
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
            this.crc2.stroke();
            let pixelPerStep = -this.mtxWorldToScreen.scaling.y;
            let valuePerStep = 1;
            let multipliers = [2, 5];
            let iMultipliers = 0;
            while (pixelPerStep < ViewAnimationSheet.MINIMUM_PIXEL_PER_STEP) {
                iMultipliers = (iMultipliers + 1) % multipliers.length;
                let multiplier = multipliers[iMultipliers];
                pixelPerStep *= multiplier;
                valuePerStep *= multiplier;
            }
            let subSteps = 0;
            switch (iMultipliers) {
                case 0:
                    subSteps = 1;
                    break;
                case 1:
                    subSteps = 4;
                    break;
            }
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-highlight");
            this.crc2.textBaseline = "bottom";
            this.crc2.textAlign = "right";
            let steps = 1 + this.canvas.height / pixelPerStep;
            let stepOffset = Math.floor(-this.mtxWorldToScreen.translation.y / pixelPerStep);
            for (let iStep = stepOffset; iStep < steps + stepOffset; iStep++) {
                let yStep = this.round(iStep * pixelPerStep + this.mtxWorldToScreen.translation.y);
                this.crc2.beginPath();
                this.crc2.moveTo(0, yStep);
                this.crc2.lineTo(ViewAnimationSheet.SCALE_WIDTH - 5, yStep);
                let value = -iStep * valuePerStep;
                this.crc2.fillText(valuePerStep >= 1 ? value.toFixed(0) : value.toFixed(1), 33, yStep);
                this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
                this.crc2.stroke();
                let pixelPerSubStep = pixelPerStep / (subSteps + 1);
                for (let iSubStep = 1; iSubStep < subSteps + 1; iSubStep++) {
                    let ySubStep = yStep + Math.round(iSubStep * pixelPerSubStep);
                    this.crc2.beginPath();
                    this.crc2.moveTo(0, ySubStep);
                    this.crc2.lineTo(ViewAnimationSheet.SCALE_WIDTH - 5, ySubStep);
                    this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-background-main");
                    this.crc2.stroke();
                }
            }
        }
        // TODO: add correct drawing for constant/step interpolated keys
        drawCurves() {
            if (this.mode != SHEET_MODE.CURVES)
                return;
            for (const sequence of this.sequences) {
                this.crc2.strokeStyle = sequence.color;
                sequence.data.getKeys()
                    .map((_key, _index, _keys) => [_key, _keys[_index + 1]])
                    .filter(([_keyStart, _keyEnd]) => _keyStart && _keyEnd)
                    .map(([_keyStart, _keyEnd]) => getBezierPoints(_keyStart.functionOut, _keyStart, _keyEnd))
                    .forEach((_bezierPoints) => {
                    _bezierPoints.forEach(_point => _point.transform(this.mtxWorldToScreen));
                    let curve = new Path2D();
                    curve.moveTo(_bezierPoints[0].x, _bezierPoints[0].y);
                    curve.bezierCurveTo(_bezierPoints[1].x, _bezierPoints[1].y, _bezierPoints[2].x, _bezierPoints[2].y, _bezierPoints[3].x, _bezierPoints[3].y);
                    this.crc2.stroke(curve);
                    _bezierPoints.forEach(_point => ƒ.Recycler.store(_point));
                });
            }
            function getBezierPoints(_animationFunction, _keyStart, _keyEnd) {
                let parameters = _animationFunction.getParameters();
                const polarForm = (_u, _v, _w) => {
                    return (parameters.a * _u * _v * _w +
                        parameters.b * ((_v * _w + _w * _u + _u * _v) / 3) +
                        parameters.c * ((_u + _v + _w) / 3) +
                        parameters.d);
                };
                let xStart = _keyStart.time;
                let xEnd = _keyEnd.time;
                let offsetTimeEnd = xEnd - xStart;
                let points = new Array(4).fill(0).map(() => ƒ.Recycler.get(ƒ.Vector2));
                points[0].set(xStart, polarForm(0, 0, 0));
                points[1].set(xStart + offsetTimeEnd * 1 / 3, polarForm(0, 0, offsetTimeEnd));
                points[2].set(xStart + offsetTimeEnd * 2 / 3, polarForm(0, offsetTimeEnd, offsetTimeEnd));
                points[3].set(xStart + offsetTimeEnd, polarForm(offsetTimeEnd, offsetTimeEnd, offsetTimeEnd));
                return points;
            }
        }
        drawKeys() {
            // draw unselected keys
            this.crc2.lineWidth = 4;
            this.keys.forEach(_key => {
                if (_key == this.selectedKey)
                    return;
                this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
                this.crc2.fillStyle = _key.color;
                this.crc2.stroke(_key.path2D);
                this.crc2.fill(_key.path2D);
            });
            // draw selected key
            if (!this.selectedKey)
                return;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-signal");
            this.crc2.fillStyle = this.selectedKey.color;
            this.crc2.stroke(this.selectedKey.path2D);
            this.crc2.fill(this.selectedKey.path2D);
            // draw slope hooks
            if (this.mode != SHEET_MODE.CURVES)
                return;
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-text");
            this.crc2.fillStyle = this.crc2.strokeStyle;
            let [left, right] = [ƒ.Recycler.get(ƒ.Vector2), ƒ.Recycler.get(ƒ.Vector2)];
            left.set(-50, 0);
            right.set(50, 0);
            let angleSlopeScreen = Math.atan(this.selectedKey.data.slopeIn * (this.mtxWorldToScreen.scaling.y / this.mtxWorldToScreen.scaling.x)) * (180 / Math.PI); // in degree
            let mtxTransform = ƒ.Matrix3x3.IDENTITY();
            mtxTransform.translate(this.worldToScreenPoint(this.selectedKey.data.time, this.selectedKey.data.value));
            mtxTransform.rotate(angleSlopeScreen);
            left.transform(mtxTransform);
            right.transform(mtxTransform);
            let path = new Path2D();
            path.moveTo(left.x, left.y);
            path.lineTo(right.x, right.y);
            this.crc2.stroke(path);
            this.slopeHooks = [this.generateKey(left, 5, 5), this.generateKey(right, 5, 5)];
            this.slopeHooks.forEach(_hook => this.crc2.fill(_hook));
            ƒ.Recycler.store(left);
            ƒ.Recycler.store(right);
        }
        drawCursor() {
            this.crc2.restore();
            let x = this.timeToScreen(this.playbackTime);
            let cursor = new Path2D();
            cursor.moveTo(x, 0);
            cursor.lineTo(x, this.canvas.height);
            this.crc2.lineWidth = 1;
            this.crc2.strokeStyle = this.documentStyle.getPropertyValue("--color-signal");
            this.crc2.stroke(cursor);
        }
        drawHighlight() {
            if (!this.selectedKey)
                return;
            let posScreen = this.worldToScreenPoint(this.selectedKey.data.time, this.selectedKey.data.value);
            this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-highlight");
            this.crc2.fillStyle += "66";
            this.crc2.fillRect(posScreen.x - ViewAnimationSheet.KEY_SIZE / 2, 0, ViewAnimationSheet.KEY_SIZE, ViewAnimationSheet.TIMELINE_HEIGHT);
            if (this.mode == SHEET_MODE.CURVES) {
                this.crc2.fillStyle = this.documentStyle.getPropertyValue("--color-highlight");
                this.crc2.fillStyle += "26";
                this.crc2.fillRect(0, posScreen.y - ViewAnimationSheet.KEY_SIZE / 2, posScreen.x, ViewAnimationSheet.KEY_SIZE);
                this.crc2.fillRect(posScreen.x - ViewAnimationSheet.KEY_SIZE / 2, ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT, ViewAnimationSheet.KEY_SIZE, posScreen.y - ViewAnimationSheet.TIMELINE_HEIGHT - ViewAnimationSheet.EVENTS_HEIGHT);
            }
        }
        //#endregion
        //#region event handling
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    if (_event.detail.view == this)
                        break;
                    if (_event.detail.node != null) {
                        this.animation = _event.detail.node?.getComponent(ƒ.ComponentAnimator)?.animation;
                        // this.animation.removeEventListener(ƒ.EVENT.MUTATE, () => this.resetView);
                        this.animation?.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, () => {
                            this.resetView();
                            this.animate();
                            this.draw(true);
                        });
                        this.resetView();
                        this.draw(true);
                    }
                    if (_event.detail.data instanceof ƒ.AnimationKey) {
                        this.selectedKey = this.keys.find(_key => _key.data == _event.detail.data);
                        this.draw();
                        break;
                    }
                    if (_event.detail.data != null) {
                        this.sequences = _event.detail.data;
                        this.draw();
                    }
                    break;
                case Fudge.EVENT_EDITOR.MODIFY:
                    this.playbackTime = _event.detail.data;
                    this.draw();
                    this.dispatch(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true });
                    break;
            }
        };
        hndPointerDown = (_event) => {
            _event.preventDefault();
            this.canvas.focus();
            const findObject = _object => this.crc2.isPointInPath(_object.path2D, _event.offsetX, _event.offsetY);
            switch (_event.buttons) {
                case 1:
                    if (_event.offsetY > _event.target.clientHeight) // clicked on scroll bar
                        this.scrollContainer.onscroll = this.hndScroll;
                    else if (_event.offsetY <= ViewAnimationSheet.TIMELINE_HEIGHT) {
                        this.hndPointerMoveTimeline(_event);
                        this.scrollContainer.onpointermove = this.hndPointerMoveTimeline;
                    }
                    else if (this.slopeHooks.some(_hook => this.crc2.isPointInPath(_hook, _event.offsetX, _event.offsetY))) {
                        this.scrollContainer.onpointermove = this.hndPointerMoveSlope;
                    }
                    else {
                        let selected = this.keys.find(findObject) ||
                            this.events.find(findObject);
                        if (!selected) {
                            this.selectedKey = null;
                            this.selectedEvent = null;
                            this.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { data: null } });
                        }
                        else
                            switch (selected.type) {
                                case "label":
                                case "event":
                                    this.selectedEvent = selected;
                                    this.scrollContainer.onpointermove = this.hndPointerMoveDragEvent;
                                    break;
                                case "key":
                                    this.selectedKey = selected;
                                    this.scrollContainer.onpointermove = this.hndPointerMoveDragKey;
                                    this.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { data: this.selectedKey.data } });
                                    this.playbackTime = this.selectedKey.data.time;
                                    this.animate();
                                    break;
                            }
                        this.draw();
                    }
                    break;
                case 2:
                    this.posRightClick.x = _event.offsetX;
                    this.posRightClick.y = _event.offsetY;
                    break;
                case 4:
                    this.posPanStart = this.screenToWorldPoint(_event.offsetX, _event.offsetY);
                    this.scrollContainer.onpointermove = this.hndPointerMovePan;
                    break;
            }
        };
        hndPointerMoveTimeline = (_event) => {
            _event.preventDefault();
            this.playbackTime = this.screenToTime(_event.offsetX);
            this.animate();
        };
        hndPointerMoveSlope = (_event) => {
            _event.preventDefault();
            let vctDelta = ƒ.Vector2.DIFFERENCE(new ƒ.Vector2(_event.offsetX, _event.offsetY), this.worldToScreenPoint(this.selectedKey.data.time, this.selectedKey.data.value));
            vctDelta.transform(ƒ.Matrix3x3.SCALING(ƒ.Matrix3x3.INVERSE(this.mtxWorldToScreen).scaling));
            let slope = vctDelta.y / vctDelta.x;
            this.selectedKey.data.slopeIn = slope;
            this.selectedKey.data.slopeOut = slope;
            this.animate();
        };
        hndPointerMovePan = (_event) => {
            _event.preventDefault();
            let translation = ƒ.Vector2.DIFFERENCE(this.screenToWorldPoint(_event.offsetX, _event.offsetY), this.posPanStart);
            if (this.mode == SHEET_MODE.DOPE)
                translation.y = 0;
            this.mtxWorldToScreen.translate(translation);
            this.draw(true);
        };
        hndPointerMoveDragKey = (_event) => {
            _event.preventDefault();
            let translation = this.screenToWorldPoint(_event.offsetX, _event.offsetY);
            let pixelPerFrame = 1000 / this.animation.fps;
            translation.x = Math.max(0, translation.x);
            translation.x = Math.round(translation.x / pixelPerFrame) * pixelPerFrame;
            let key = this.selectedKey.data;
            let sequence = this.sequences.find(_sequence => _sequence.data.getKeys().includes(key)).data;
            sequence.modifyKey(key, translation.x, this.mode == SHEET_MODE.DOPE || _event.shiftKey ? null : translation.y);
            this.animation.calculateTotalTime();
            this.playbackTime = key.time;
            this.animate();
        };
        hndPointerMoveDragEvent = (_event) => {
            _event.preventDefault();
            let time = this.screenToTime(_event.offsetX);
            if (this.selectedEvent.type == "event")
                this.animation.setEvent(this.selectedEvent.data, time);
            else
                this.animation.labels[this.selectedEvent.data] = time;
            this.draw();
        };
        hndPointerUp = (_event) => {
            _event.preventDefault();
            if (this.scrollContainer.onscroll)
                this.draw(true);
            this.scrollContainer.onscroll = undefined;
            this.scrollContainer.onpointermove = undefined;
        };
        hndWheel = (_event) => {
            _event.preventDefault();
            if (_event.buttons != 0)
                return;
            let zoomFactor = _event.deltaY < 0 ? 1.05 : 0.95;
            let posCursorWorld = this.screenToWorldPoint(_event.offsetX, _event.offsetY);
            let x = _event.shiftKey ? 1 : zoomFactor;
            let y = _event.ctrlKey || this.mode == SHEET_MODE.DOPE ? 1 : zoomFactor;
            this.mtxWorldToScreen.translate(posCursorWorld);
            this.mtxWorldToScreen.scale(new ƒ.Vector2(x, y));
            this.mtxWorldToScreen.translate(ƒ.Vector2.SCALE(posCursorWorld, -1));
            this.draw(true);
        };
        hndScroll = (_event) => {
            _event.preventDefault();
            let translation = this.mtxWorldToScreen.translation;
            translation.x = -this.scrollContainer.scrollLeft + ViewAnimationSheet.SCALE_WIDTH;
            this.mtxWorldToScreen.translation = translation;
            this.draw();
        };
        animate() {
            this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true, detail: { data: this.playbackTime } });
        }
        //#endregion
        resetView() {
            this.mtxWorldToScreen.reset();
            this.mtxWorldToScreen.scaleX(ViewAnimationSheet.PIXEL_PER_MILLISECOND); // apply scaling
            this.mtxWorldToScreen.scaleX((this.canvas.width - 2 * ViewAnimationSheet.SCALE_WIDTH) / ((this.animation?.totalTime || ViewAnimationSheet.STANDARD_ANIMATION_LENGTH)));
            this.mtxWorldToScreen.translateX(ViewAnimationSheet.SCALE_WIDTH);
            if (this.mode == SHEET_MODE.CURVES) {
                this.mtxWorldToScreen.scaleY(-1); // flip y
                this.mtxWorldToScreen.scaleY(ViewAnimationSheet.PIXEL_PER_VALUE); // apply scaling
                let values = this.sequences
                    .flatMap(_sequence => _sequence.data.getKeys())
                    .map(_key => _key.value);
                if (values.length > 1) {
                    let min = values.reduce((_a, _b) => Math.min(_a, _b)); // in world space
                    let max = values.reduce((_a, _b) => Math.max(_a, _b)); // in world space
                    let viewHeight = (this.canvas.height - ViewAnimationSheet.TIMELINE_HEIGHT - ViewAnimationSheet.EVENTS_HEIGHT); // in px
                    if (min != max)
                        this.mtxWorldToScreen.scaleY(viewHeight / (((max - min) * ViewAnimationSheet.PIXEL_PER_VALUE) * 1.2));
                    this.mtxWorldToScreen.translateY(viewHeight - min * this.mtxWorldToScreen.scaling.y);
                }
            }
            else {
                this.mtxWorldToScreen.translateY(ViewAnimationSheet.TIMELINE_HEIGHT + ViewAnimationSheet.EVENTS_HEIGHT + ViewAnimationSheet.KEY_SIZE * 2);
            }
        }
        screenToWorldPoint(_x, _y) {
            let vector = new ƒ.Vector2(_x, _y);
            vector.transform(ƒ.Matrix3x3.INVERSE(this.mtxWorldToScreen));
            return vector;
        }
        worldToScreenPoint(_x, _y) {
            let vector = new ƒ.Vector2(_x, _y);
            vector.transform(this.mtxWorldToScreen);
            vector.x = this.round(vector.x);
            vector.y = this.round(vector.y);
            return vector;
        }
        screenToTime(_x) {
            let playbackTime = Math.max(0, (_x - this.mtxWorldToScreen.translation.x) / this.mtxWorldToScreen.scaling.x);
            return playbackTime;
        }
        timeToScreen(_time) {
            return this.round(_time * this.mtxWorldToScreen.scaling.x + this.mtxWorldToScreen.translation.x);
        }
        round(_value) {
            if (Math.trunc(this.crc2.lineWidth) % 2 == 0)
                return Math.round(_value); // even line width
            else
                return Math.round(_value) + 0.5; // odd line width
        }
    }
    Fudge.ViewAnimationSheet = ViewAnimationSheet;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    let MENU;
    (function (MENU) {
        MENU["COMPONENTMENU"] = "Add Components";
    })(MENU || (MENU = {}));
    // TODO: examin problem with ƒ.Material when using "typeof ƒ.Mutable" as key to the map
    let resourceToComponent = new Map([
        [ƒ.Audio, ƒ.ComponentAudio],
        [ƒ.Material, ƒ.ComponentMaterial],
        [ƒ.Mesh, ƒ.ComponentMesh],
        [ƒ.Animation, ƒ.ComponentAnimator],
        [ƒ.ParticleSystem, ƒ.ComponentParticleSystem]
    ]);
    /**
     * View all components attached to a node
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewComponents extends Fudge.View {
        node;
        expanded = { ComponentTransform: true };
        selected = "ComponentTransform";
        drag;
        constructor(_container, _state) {
            super(_container, _state);
            this.fillContent();
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.TRANSFORM, this.hndTransform);
            this.dom.addEventListener("delete" /* ƒUi.EVENT.DELETE */, this.hndEvent);
            this.dom.addEventListener("expand" /* ƒUi.EVENT.EXPAND */, this.hndEvent);
            this.dom.addEventListener("collapse" /* ƒUi.EVENT.COLLAPSE */, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒUi.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("click" /* ƒUi.EVENT.CLICK */, this.hndEvent, true);
            this.dom.addEventListener("keydown" /* ƒUi.EVENT.KEY_DOWN */, this.hndEvent, true);
            this.dom.addEventListener("mutate" /* ƒUi.EVENT.MUTATE */, this.hndEvent, true);
        }
        getDragDropSources() {
            return this.drag ? [this.drag] : [];
        }
        //#region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({
                label: "Add Component",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.ADD_COMPONENT, ƒ.Component, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Add Joint",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.ADD_JOINT, ƒ.Joint, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Delete Component",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.ADD_JOINT, ƒ.Joint, _callback)
            });
            item = new Fudge.remote.MenuItem({ label: "Delete Component", id: String(Fudge.CONTEXTMENU.DELETE_COMPONENT), click: _callback, accelerator: "D" });
            menu.append(item);
            // ContextMenu.appendCopyPaste(menu);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`MenuSelect: Item-id=${Fudge.CONTEXTMENU[_item.id]}`);
            let iSubclass = _item["iSubclass"];
            let component;
            if (this.protectGraphInstance())
                return;
            switch (Number(_item.id)) {
                case Fudge.CONTEXTMENU.ADD_COMPONENT:
                    component = ƒ.Component.subclasses[iSubclass];
                    break;
                case Fudge.CONTEXTMENU.ADD_JOINT:
                    component = ƒ.Joint.subclasses[iSubclass];
                    break;
                case Fudge.CONTEXTMENU.DELETE_COMPONENT:
                    let element = document.activeElement;
                    if (element.tagName == "BODY")
                        return;
                    do {
                        console.log(element.tagName);
                        let controller = Reflect.get(element, "controller");
                        if (element.tagName == "DETAILS" && controller) {
                            this.dispatch(Fudge.EVENT_EDITOR.DELETE, { detail: { mutable: controller.getMutable() } });
                            break;
                        }
                        element = element.parentElement;
                    } while (element);
                    return;
            }
            if (!component) // experimental fix for the sporadic "component is not a constructor" bug
                component = ƒ[_item.label];
            //@ts-ignore
            let cmpNew = new component();
            if ((cmpNew instanceof ƒ.ComponentRigidbody || cmpNew instanceof ƒ.ComponentVRDevice || cmpNew instanceof ƒ.ComponentWalker) && !this.node.cmpTransform) {
                alert(`To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentTransform.name}.`);
                return;
            }
            if (cmpNew instanceof ƒ.ComponentGraphFilter && !(this.node instanceof ƒ.Graph || this.node instanceof ƒ.GraphInstance)) {
                alert(`Attach ${ƒ.ComponentGraphFilter.name} only to ${ƒ.Graph.name} or ${ƒ.GraphInstance.name}s`);
                // console.log(this.node);
                return;
            }
            if (cmpNew instanceof ƒ.ComponentFog || cmpNew instanceof ƒ.ComponentAmbientOcclusion || cmpNew instanceof ƒ.ComponentBloom) {
                let camera = this.node.getComponent(ƒ.ComponentCamera) ?? this.node.getComponent(ƒ.ComponentVRDevice);
                if (!camera) {
                    alert(`To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentCamera.name} or ${ƒ.ComponentVRDevice.name}.`);
                    return;
                }
            }
            ƒ.Debug.info(cmpNew.type, cmpNew);
            this.node.addComponent(cmpNew);
            this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
            // this.dispatch(EVENT_EDITOR.SELECT, { bubbles: true, detail: { data: this.node } });
        }
        //#endregion
        hndDragOver(_event, _viewSource) {
            if (!this.node)
                return;
            if (this.dom != _event.target)
                return;
            if (!(_viewSource instanceof Fudge.ViewInternal || _viewSource instanceof Fudge.ViewScript))
                return;
            for (let source of _viewSource.getDragDropSources()) {
                if (source instanceof Fudge.ScriptInfo) {
                    if (!source.isComponent)
                        return;
                }
                else if (!this.findComponentType(source))
                    return;
            }
            // if (this.protectGraphInstance())
            //   return;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
        }
        hndDrop(_event, _viewSource) {
            if (this.protectGraphInstance())
                return;
            for (let source of _viewSource.getDragDropSources()) {
                let cmpNew = this.createComponent(source);
                this.node.addComponent(cmpNew);
                this.expanded[cmpNew.type] = true;
            }
            this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
        }
        protectGraphInstance() {
            // inhibit structural changes to a GraphInstance
            let check = this.node;
            do {
                if (check instanceof ƒ.GraphInstance) {
                    alert(`Edit the graph "${check.name}" to make changes to its structure and then reload the project`);
                    return true;
                }
                check = check.getParent();
            } while (check);
            return false;
        }
        fillContent() {
            while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild))
                ;
            let cntEmpty = document.createElement("div");
            cntEmpty.textContent = "Drop internal resources or use right click to create new components";
            this.dom.title = "Drop internal resources or use right click to create new components";
            if (!this.node || !(this.node instanceof ƒ.Node)) { // TODO: examine, if anything other than node can appear here...
                this.setTitle("Components");
                this.dom.title = "Select node to edit components";
                cntEmpty.textContent = "Select node to edit components";
                this.dom.append(cntEmpty);
                return;
            }
            this.setTitle("Components | " + this.node.name);
            let components = this.node.getAllComponents();
            if (!components.length) {
                this.dom.append(cntEmpty);
                return;
            }
            for (let component of components) {
                let details = ƒUi.Generator.createDetailsFromMutable(component);
                let controller = new Fudge.ControllerDetail(component, details);
                Reflect.set(details, "controller", controller); // insert a link back to the controller
                details.expand(this.expanded[component.type]);
                this.dom.append(details);
                if (component instanceof ƒ.ComponentCamera) {
                    details.draggable = true;
                    details.addEventListener("dragstart", (_event) => { this.drag = component; });
                }
                if (component instanceof ƒ.ComponentRigidbody) {
                    let pivot = controller.domElement.querySelector("[key='mtxPivot'");
                    let opacity = pivot.style.opacity;
                    setPivotOpacity(null);
                    controller.domElement.addEventListener("mutate" /* ƒUi.EVENT.MUTATE */, setPivotOpacity);
                    function setPivotOpacity(_event) {
                        let initialization = controller.getMutator({ initialization: 0 }).initialization;
                        pivot.style.opacity = initialization == ƒ.BODY_INIT.TO_PIVOT ? opacity : "0.3";
                    }
                }
                if (component instanceof ƒ.ComponentFaceCamera) {
                    let up = controller.domElement.querySelector("[key='up'");
                    let opacity = up.style.opacity;
                    setUpOpacity(null);
                    controller.domElement.addEventListener("mutate" /* ƒUi.EVENT.MUTATE */, setUpOpacity);
                    function setUpOpacity(_event) {
                        let upLocal = controller.getMutator({ upLocal: true }).upLocal;
                        up.style.opacity = !upLocal ? opacity : "0.3";
                    }
                }
                if (details.getAttribute("key") == this.selected)
                    this.select(details, false);
            }
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    this.node = _event.detail.node || _event.detail.graph;
                case Fudge.EVENT_EDITOR.MODIFY:
                    this.fillContent();
                    break;
                case "delete" /* ƒUi.EVENT.DELETE */:
                    if (this.protectGraphInstance())
                        return;
                    let component = _event.detail.mutable;
                    this.node.removeComponent(component);
                    this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    break;
                case "keydown" /* ƒUi.EVENT.KEY_DOWN */:
                case "click" /* ƒUi.EVENT.CLICK */:
                    if (_event instanceof KeyboardEvent && _event.code != ƒ.KEYBOARD_CODE.SPACE)
                        break;
                    let target = _event.target;
                    if (target.tagName == "SUMMARY")
                        target = target.parentElement;
                    if (!(_event.target instanceof HTMLDetailsElement || _event.target))
                        break;
                    try {
                        if (this.dom.replaceChild(target, target)) {
                            if (_event instanceof KeyboardEvent || this.getSelected() != target) {
                                target.expand(true);
                                _event.preventDefault();
                            }
                            this.select(target);
                        }
                    }
                    catch (_e) { /* */ }
                    break;
                case "expand" /* ƒUi.EVENT.EXPAND */:
                case "collapse" /* ƒUi.EVENT.COLLAPSE */:
                    this.expanded[_event.target.getAttribute("type")] = (_event.type == "expand" /* ƒUi.EVENT.EXPAND */);
                    break;
                case "mutate" /* ƒUi.EVENT.MUTATE */:
                    let cmpRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    if (cmpRigidbody)
                        cmpRigidbody.initialize();
                    // this.dispatch(EVENT_EDITOR.UPDATE, { bubbles: true, detail: { node: this.node } }); // TODO: check if this was necessary, EVENT_EDITOR.UPDATE gets broadcasted by project on ƒ.EVENT.GRAPH_MUTATED, so this was causing a double broadcast of EVENT_EDITOR.UPDATE to ALL views on any change to any component
                    break;
                // case ƒUi.EVENT.REARRANGE_ARRAY: // no listener for this event
                //   this.fillContent();
                //   break;
                default:
                    break;
            }
        };
        hndTransform = (_event) => {
            if (!this.getSelected())
                return;
            let controller = Reflect.get(this.getSelected(), "controller");
            let component = controller.getMutable();
            let mtxTransform = Reflect.get(component, "mtxLocal") || Reflect.get(component, "mtxPivot");
            if (!mtxTransform)
                return;
            let dtl = _event.detail.transform;
            let mtxCamera = dtl.camera.node.mtxWorld;
            let distance = mtxCamera.getTranslationTo(this.node.mtxWorld).magnitude;
            if (dtl.transform == Fudge.TRANSFORM.ROTATE)
                [dtl.x, dtl.y] = [dtl.y, dtl.x];
            let value = new ƒ.Vector3();
            value.x = (dtl.restriction == "x" ? !dtl.inverted : dtl.inverted) ? dtl.x : undefined;
            value.y = (dtl.restriction == "y" ? !dtl.inverted : dtl.inverted) ? -dtl.y : undefined;
            value.z = (dtl.restriction == "z" ? !dtl.inverted : dtl.inverted) ?
                ((value.x == undefined) ? -dtl.y : dtl.x) : undefined;
            value = value.map((_c) => _c || 0);
            if (mtxTransform instanceof ƒ.Matrix4x4)
                this.transform3(dtl.transform, value, mtxTransform, distance);
            if (mtxTransform instanceof ƒ.Matrix3x3)
                this.transform2(dtl.transform, value.toVector2(), mtxTransform, 1);
            component.mutate(component.getMutator());
        };
        transform3(_transform, _value, _mtxTransform, _distance) {
            switch (_transform) {
                case Fudge.TRANSFORM.TRANSLATE:
                    let factorTranslation = 0.001; // TODO: eliminate magic numbers
                    _value.scale(factorTranslation * _distance);
                    let translation = _mtxTransform.translation;
                    translation.add(_value);
                    _mtxTransform.translation = translation;
                    break;
                case Fudge.TRANSFORM.ROTATE:
                    let factorRotation = 1; // TODO: eliminate magic numbers
                    _value.scale(factorRotation);
                    let rotation = _mtxTransform.rotation;
                    rotation.add(_value);
                    _mtxTransform.rotation = rotation;
                    break;
                case Fudge.TRANSFORM.SCALE:
                    let factorScaling = 0.001; // TODO: eliminate magic numbers
                    _value.scale(factorScaling);
                    let scaling = _mtxTransform.scaling;
                    scaling.add(_value);
                    _mtxTransform.scaling = scaling;
                    break;
            }
        }
        transform2(_transform, _value, _mtxTransform, _distance) {
            switch (_transform) {
                case Fudge.TRANSFORM.TRANSLATE:
                    let factorTranslation = 0.001; // TODO: eliminate magic numbers
                    _value.scale(factorTranslation * _distance);
                    let translation = _mtxTransform.translation;
                    translation.add(_value);
                    _mtxTransform.translation = translation;
                    break;
                case Fudge.TRANSFORM.ROTATE:
                    let factorRotation = 1; // TODO: eliminate magic numbers
                    _value.scale(factorRotation);
                    _mtxTransform.rotation += _value.x;
                    break;
                case Fudge.TRANSFORM.SCALE:
                    let factorScaling = 0.001; // TODO: eliminate magic numbers
                    _value.scale(factorScaling);
                    let scaling = _mtxTransform.scaling;
                    scaling.add(_value);
                    _mtxTransform.scaling = scaling;
                    break;
            }
        }
        select(_details, _focus = true) {
            for (let child of this.dom.children)
                child.classList.remove("selected");
            _details.classList.add("selected");
            this.selected = _details.getAttribute("key");
            if (_focus)
                _details.focus();
        }
        getSelected() {
            for (let child of this.dom.children)
                if (child.classList.contains("selected"))
                    return child;
        }
        createComponent(_resource) {
            if (_resource instanceof Fudge.ScriptInfo)
                if (_resource.isComponent)
                    return new _resource.script();
            let typeComponent = this.findComponentType(_resource);
            return new typeComponent(_resource);
        }
        findComponentType(_resource) {
            for (let entry of resourceToComponent)
                if (_resource instanceof entry[0])
                    return entry[1];
        }
    }
    Fudge.ViewComponents = ViewComponents;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    /**
     * View the hierarchy of a graph as tree-control
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewHierarchy extends Fudge.View {
        graph;
        tree;
        selectionPrevious = [];
        constructor(_container, _state) {
            super(_container, _state);
            this.setGraph(null);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CLOSE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            // a select event will be recived from the panel during reconstruction so we only need to prepare our storage here
            if (_state["graph"] && _state["expanded"] && !this.restoreExpanded(_state["graph"]))
                this.storeExpanded(_state["graph"], _state["expanded"]);
        }
        get selection() {
            return this.tree.controller.selection;
        }
        setGraph(_graph) {
            if (!_graph) {
                this.graph = undefined;
                this.dom.innerHTML = "";
                return;
            }
            if (this.graph && this.tree)
                this.dom.removeChild(this.tree);
            this.dom.innerHTML = "";
            if (this.graph)
                this.storeExpanded(this.graph.idResource, this.getExpanded());
            this.graph = _graph;
            // this.selectedNode = null;
            this.tree = new ƒUi.CustomTree(new Fudge.ControllerTreeHierarchy(), this.graph);
            // this.tree.addEventListener(ƒUi.EVENT.FOCUS_OUT, this.hndTreeEvent);
            this.tree.addEventListener("itemselect" /* ƒUi.EVENT.SELECT */, this.hndTreeEvent);
            this.tree.addEventListener("delete" /* ƒUi.EVENT.DELETE */, this.hndTreeEvent);
            this.tree.addEventListener("rename" /* ƒUi.EVENT.RENAME */, this.hndTreeEvent);
            this.tree.addEventListener("contextmenu" /* ƒUi.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.append(this.tree);
            this.dom.title = "● Right click on existing node to create child node.\n● Use Copy/Paste to duplicate nodes.";
            this.tree.title = "Select node to edit or duplicate.";
            let expanded = this.restoreExpanded(this.graph.idResource);
            if (expanded)
                this.expand(expanded);
        }
        getDragDropSources() {
            return this.tree.controller.dragDrop.sources;
        }
        hndDragOverCapture(_event, _viewSource) {
            if (_viewSource == this)
                return; // continue with standard tree behaviour
            if (_viewSource instanceof Fudge.ViewInternal) {
                if (this.tree)
                    this.tree.controller.dragDrop.sources = _viewSource.getDragDropSources().filter((_source) => _source instanceof ƒ.Graph);
                return;
            }
            _event.dataTransfer.dropEffect = "none";
            _event.stopPropagation();
        }
        async hndDropCapture(_event, _viewSource) {
            if (_viewSource == this || _event.target == this.tree)
                return; // continue with standard tree behaviour
            _event.stopPropagation();
            let instances = [];
            for (let graph of this.tree.controller.dragDrop.sources)
                if (graph instanceof ƒ.Graph)
                    instances.push(await ƒ.Project.createGraphInstance(graph));
            this.tree.controller.dragDrop.sources = instances;
            this.tree.dispatchEvent(new Event("drop" /* ƒUi.EVENT.DROP */, { bubbles: false }));
        }
        //#region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({ label: "Add Node", id: String(Fudge.CONTEXTMENU.ADD_NODE), click: _callback, accelerator: "N" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "De- / Acvtivate", id: String(Fudge.CONTEXTMENU.ACTIVATE_NODE), click: _callback, accelerator: "A" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Delete", id: String(Fudge.CONTEXTMENU.DELETE_NODE), click: _callback, accelerator: "D" });
            menu.append(item);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`MenuSelect: Item-id=${Fudge.CONTEXTMENU[_item.id]}`);
            let focus = this.tree.getFocussed();
            switch (Number(_item.id)) {
                case Fudge.CONTEXTMENU.ADD_NODE:
                    let child = new ƒ.Node("New Node");
                    this.tree.addChildren([child], focus);
                    this.tree.findVisible(child).focus();
                    break;
                case Fudge.CONTEXTMENU.ACTIVATE_NODE:
                    focus.activate(!focus.isActive);
                    this.tree.findVisible(focus).refreshAttributes();
                    this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    break;
                case Fudge.CONTEXTMENU.DELETE_NODE:
                    // focus.addChild(child);
                    if (!focus)
                        return;
                    this.tree.delete([focus]);
                    focus.getParent().removeChild(focus);
                    ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.graph);
                    ƒ.Physics.cleanup();
                    this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    break;
            }
        }
        //#endregion
        getState() {
            let state = super.getState();
            state["expanded"] = this.getExpanded();
            return state;
        }
        //#region EventHandlers
        hndTreeEvent = (_event) => {
            switch (_event.type) {
                case "delete" /* ƒUi.EVENT.DELETE */:
                    this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    break;
                case "rename" /* ƒUi.EVENT.RENAME */:
                    if (_event.detail.data instanceof ƒ.Graph) {
                        // _event.detail.data.name = (<HTMLInputElement>_event.target).value;
                        this.dispatch(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true });
                    }
                    break;
                case "itemselect" /* ƒUi.EVENT.SELECT */:
                    //only dispatch the event to focus the node, if the node is in the current and the previous selection  
                    let node = _event.detail["data"];
                    if (this.selectionPrevious.includes(node) && this.selection.includes(node))
                        this.dispatch(Fudge.EVENT_EDITOR.FOCUS, { bubbles: true, detail: { node: node, view: this } });
                    this.selectionPrevious = this.selection.slice(0);
                    this.dispatchToParent(Fudge.EVENT_EDITOR.SELECT, { detail: { node: node, view: this } });
                    break;
            }
        };
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    if (_event.detail.graph)
                        this.setGraph(_event.detail.graph);
                    if (_event.detail.node) {
                        this.tree.show(_event.detail.node.getPath());
                        this.tree.controller.selection = [_event.detail.node];
                        this.tree.displaySelection(this.tree.controller.selection);
                        this.selectionPrevious = this.selection.slice(0);
                    }
                    break;
                case Fudge.EVENT_EDITOR.UPDATE:
                    if (_event.detail.view instanceof Fudge.ViewInternal && _event.detail.data == this.graph)
                        this.tree.findItem(this.graph)?.refreshContent();
                    break;
                case Fudge.EVENT_EDITOR.CLOSE:
                    if (this.graph)
                        this.storeExpanded(this.graph.idResource, this.getExpanded());
            }
        };
        //#endregion
        storeExpanded(_idGraph, _expanded) {
            sessionStorage.setItem(`${this.id}_${_idGraph}`, JSON.stringify(_expanded));
        }
        restoreExpanded(_idGraph) {
            let stored = sessionStorage.getItem(`${this.id}_${_idGraph}`);
            return stored && JSON.parse(stored);
        }
        getExpanded() {
            return this.tree?.getExpanded().map(_item => ƒ.Node.PATH_FROM_TO(this.graph, _item.data));
        }
        expand(_paths) {
            const paths = _paths
                .map(_path => ƒ.Node.FIND(this.graph, _path))
                .filter(_node => _node)
                .map(_node => _node.getPath());
            this.tree?.expand(paths);
        }
    }
    Fudge.ViewHierarchy = ViewHierarchy;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    /**
     * View the rendering of a graph in a viewport with an independent camera
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewRender extends Fudge.View {
        cmrOrbit;
        viewport;
        canvas;
        graph;
        node;
        nodeLight = new ƒ.Node("Illumination"); // keeps light components for dark graphs
        redrawId;
        #pointerMoved = false;
        constructor(_container, _state) {
            super(_container, _state);
            this.createUserInterface();
            let title = "● Drop a graph from \"Internal\" here.\n";
            title += "● Use mousebuttons and ctrl-, shift- or alt-key to navigate editor camera.\n";
            title += "● Drop camera component here to see through that camera.\n";
            title += "● Manipulate transformations in this view:\n";
            title += "  - Click to select node, rightclick to select transformations.\n";
            title += "  - Select component to manipulate in view Components.\n";
            title += "  - Hold X, Y or Z and move mouse to transform. Add shift-key to invert restriction.\n";
            this.dom.title = title;
            this.dom.tabIndex = 0;
            _container.on("resize", this.redraw);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.FOCUS, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CLOSE, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒUi.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("pointermove", this.hndPointer);
            this.dom.addEventListener("mousedown", () => this.#pointerMoved = false); // reset pointer move
            if (_state["gizmosFilter"]) {
                let gizmosFilter = new Map(_state["gizmosFilter"]);
                for (const [key, value] of gizmosFilter)
                    if (this.gizmosFilter.has(key))
                        this.gizmosFilter.set(key, value);
            }
        }
        get gizmosFilter() {
            return this.viewport?.gizmosFilter;
        }
        //#region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({ label: "Translate", id: Fudge.TRANSFORM.TRANSLATE, click: _callback, accelerator: process.platform == "darwin" ? "T" : "T" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Rotate", id: Fudge.TRANSFORM.ROTATE, click: _callback, accelerator: process.platform == "darwin" ? "R" : "R" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Scale", id: Fudge.TRANSFORM.SCALE, click: _callback, accelerator: process.platform == "darwin" ? "E" : "E" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
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
            item = new Fudge.remote.MenuItem({ label: "Orthographic Camera", id: String(Fudge.CONTEXTMENU.ORTHGRAPHIC_CAMERA), type: "checkbox", click: _callback, accelerator: process.platform == "darwin" ? "O" : "O" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Render Continuously", id: String(Fudge.CONTEXTMENU.RENDER_CONTINUOUSLY), type: "checkbox", click: _callback });
            menu.append(item);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`MenuSelect: Item-id=${_item.id}`);
            switch (_item.id) {
                case Fudge.TRANSFORM.TRANSLATE:
                case Fudge.TRANSFORM.ROTATE:
                case Fudge.TRANSFORM.SCALE:
                    Fudge.Page.setTransform(_item.id);
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
                case String(Fudge.CONTEXTMENU.ORTHGRAPHIC_CAMERA):
                    this.setCameraOrthographic(_item.checked);
                    break;
                case String(Fudge.CONTEXTMENU.RENDER_CONTINUOUSLY):
                    this.setRenderContinously(_item.checked);
                    break;
                default:
                    if (!this.gizmosFilter.has(_item.id))
                        break;
                    this.gizmosFilter.set(_item.id, _item.checked);
                    this.redraw();
                    break;
            }
        }
        openContextMenu = (_event) => {
            if (!this.#pointerMoved) {
                for (const [filter, active] of this.gizmosFilter)
                    this.contextMenu.getMenuItemById(filter).checked = active;
                this.contextMenu.popup();
            }
            this.#pointerMoved = false;
        };
        //#endregion
        hndDragOver(_event, _viewSource) {
            _event.dataTransfer.dropEffect = "none";
            if (!(_viewSource instanceof Fudge.ViewComponents)) { // allow dropping cameracomponent to see through that camera (at this time, the only draggable)
                if (!(_viewSource instanceof Fudge.ViewInternal)) // allow dropping a graph
                    return;
                let source = _viewSource.getDragDropSources()[0];
                if (!(source instanceof ƒ.Graph))
                    return;
            }
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
        }
        hndDrop(_event, _viewSource) {
            let source = _viewSource.getDragDropSources()[0];
            if (source instanceof ƒ.ComponentCamera) {
                // this.setCameraOrthographic(false);
                this.viewport.camera = source;
                this.redraw();
                _event.stopPropagation();
                return;
            }
        }
        createUserInterface() {
            ƒAid.addStandardLightComponents(this.nodeLight);
            let cmpCamera = new ƒ.ComponentCamera();
            this.canvas = ƒAid.Canvas.create(true, ƒAid.IMAGE_RENDERING.PIXELATED);
            let container = document.createElement("div");
            container.style.borderWidth = "0px";
            document.body.appendChild(this.canvas);
            this.viewport = new ƒ.Viewport();
            this.viewport.gizmosEnabled = true;
            // add default values for view render gizmos
            this.gizmosFilter.set(Fudge.GIZMOS.TRANSFORM, true);
            this.viewport.initialize("ViewNode_Viewport", this.graph, cmpCamera, this.canvas);
            try {
                this.cmrOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(this.viewport, false);
            }
            catch (_error) { /* view should load even if rendering fails... */ }
            ;
            this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
            this.viewport.addEventListener("renderPrepareStart" /* ƒ.EVENT.RENDER_PREPARE_START */, this.hndPrepare);
            this.viewport.addEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.drawTranslation);
            this.setGraph(null);
            this.canvas.addEventListener("pointerdown", this.activeViewport);
            this.canvas.addEventListener("pick", this.hndPick);
            let submenu = [];
            for (const [filter] of this.gizmosFilter)
                submenu.push({ label: filter, id: filter, type: "checkbox", click: this.contextMenuCallback.bind(this) });
            this.contextMenu.append(new Fudge.remote.MenuItem({
                label: "Gizmos", submenu: submenu
            }));
        }
        setGraph(_node) {
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
            ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.graph);
            ƒ.Physics.cleanup();
            this.graph.broadcastEvent(new Event("disconnectJoint" /* ƒ.EVENT.DISCONNECT_JOINT */));
            ƒ.Physics.connectJoints();
            this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
            this.viewport.setBranch(this.graph);
            this.viewport.camera = this.cmrOrbit.cmpCamera;
            ƒ.Render.prepare(this.graph);
        }
        setCameraOrthographic(_on = false) {
            this.viewport.camera = this.cmrOrbit.cmpCamera;
            if (_on) {
                this.cmrOrbit.cmpCamera.projectCentral(2, 1, ƒ.FIELD_OF_VIEW.DIAGONAL, 10, 20000);
                this.cmrOrbit.maxDistance = 10000;
                this.cmrOrbit.distance *= 50;
            }
            else {
                this.cmrOrbit.cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.01, 1000);
                this.cmrOrbit.maxDistance = 1000;
                this.cmrOrbit.distance /= 50;
            }
            this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.ORTHGRAPHIC_CAMERA)).checked = _on;
            ƒ.Render.prepare(this.cmrOrbit);
            this.redraw();
        }
        hndPrepare = (_event) => {
            let switchLight = (_event) => {
                let lightsPresent = false;
                ƒ.Render.lights.forEach((_array) => lightsPresent ||= _array.length > 0);
                this.setTitle(`${lightsPresent ? "RENDER" : "Render"} | ${this.graph.name}`);
                if (!lightsPresent)
                    ƒ.Render.addLights(this.nodeLight.getComponents(ƒ.ComponentLight));
                this.graph.removeEventListener("renderPrepareEnd" /* ƒ.EVENT.RENDER_PREPARE_END */, switchLight);
            };
            this.graph.addEventListener("renderPrepareEnd" /* ƒ.EVENT.RENDER_PREPARE_END */, switchLight);
        };
        hndEvent = (_event) => {
            let detail = _event.detail;
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                    if (detail.graph) {
                        this.setGraph(detail.graph);
                        this.dispatch(Fudge.EVENT_EDITOR.FOCUS, { bubbles: false, detail: { node: detail.node || this.graph } });
                    }
                    if (detail.node) {
                        this.node = detail.node;
                        this.viewport.gizmosSelected = [this.node];
                    }
                    break;
                case Fudge.EVENT_EDITOR.FOCUS:
                    this.cmrOrbit.mtxLocal.translation = detail.node.mtxWorld.translation;
                    ƒ.Render.prepare(this.cmrOrbit);
                    break;
                case Fudge.EVENT_EDITOR.CLOSE:
                    this.setRenderContinously(false);
                    this.viewport.removeEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.drawTranslation);
                    this.viewport.gizmosSelected = null;
                    break;
                case Fudge.EVENT_EDITOR.UPDATE:
                    if (!this.viewport.camera.isActive)
                        this.viewport.camera = this.cmrOrbit.cmpCamera;
            }
            this.redraw();
        };
        hndPick = (_event) => {
            let picked = _event.detail.node;
            //TODO: watch out, two selects
            this.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { node: picked } });
            // this.dom.dispatchEvent(new CustomEvent(ƒUi.EVENT.SELECT, { bubbles: true, detail: { data: picked } }));
        };
        // private animate = (_e: Event) => {
        //   this.viewport.setGraph(this.graph);
        //   if (this.canvas.clientHeight > 0 && this.canvas.clientWidth > 0)
        //     this.viewport.draw();
        // }
        hndPointer = (_event) => {
            this.#pointerMoved ||= (_event.movementX != 0 || _event.movementY != 0);
            this.dom.focus({ preventScroll: true });
            let restriction;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.X]))
                restriction = "x";
            else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Y]))
                restriction = "z";
            else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Z]))
                restriction = "y";
            if (!restriction)
                return;
            this.canvas.requestPointerLock();
            let data = {
                transform: Fudge.Page.modeTransform, restriction: restriction, x: _event.movementX, y: _event.movementY, camera: this.viewport.camera, inverted: _event.shiftKey
            };
            this.dispatchToParent(Fudge.EVENT_EDITOR.TRANSFORM, { bubbles: true, detail: { transform: data } });
            this.dispatchToParent(Fudge.EVENT_EDITOR.UPDATE, {});
            this.redraw();
        };
        activeViewport = (_event) => {
            ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.graph);
            _event.cancelBubble = true;
        };
        redraw = () => {
            if (this.viewport.canvas.clientHeight == 0 || this.viewport.canvas.clientHeight == 0)
                return;
            try {
                ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.graph);
                ƒ.Physics.connectJoints();
                this.viewport.draw();
            }
            catch (_error) {
                this.setRenderContinously(false);
                // console.error(_error);
                //nop
            }
        };
        setRenderContinously(_on) {
            if (_on) {
                this.redrawId = window.setInterval(() => {
                    this.redraw();
                }, 1000 / 30);
            }
            else {
                window.clearInterval(this.redrawId);
                this.redrawId = null;
            }
            this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.RENDER_CONTINUOUSLY)).checked = _on;
        }
        drawTranslation = () => {
            if (!this.node || !this.gizmosFilter.get(Fudge.GIZMOS.TRANSFORM))
                return;
            const scaling = ƒ.Vector3.ONE(ƒ.Vector3.DIFFERENCE(ƒ.Gizmos.camera.mtxWorld.translation, this.node.mtxWorld.translation).magnitude * 0.1);
            const origin = ƒ.Vector3.ZERO();
            const vctX = ƒ.Vector3.X(1);
            const vctY = ƒ.Vector3.Y(1);
            const vctZ = ƒ.Vector3.Z(1);
            let mtxWorld = this.node.mtxWorld.clone;
            mtxWorld.scaling = scaling;
            let color = ƒ.Color.CSS("red");
            ƒ.Gizmos.drawLines([origin, vctX], mtxWorld, color);
            color.setCSS("lime");
            ƒ.Gizmos.drawLines([origin, vctY], mtxWorld, color);
            color.setCSS("blue");
            ƒ.Gizmos.drawLines([origin, vctZ], mtxWorld, color);
            ƒ.Recycler.storeMultiple(vctX, vctY, vctZ, origin, mtxWorld, color, scaling);
        };
        getState() {
            let state = super.getState();
            state["gizmosFilter"] = Array.from(this.gizmosFilter.entries());
            return state;
        }
    }
    Fudge.ViewRender = ViewRender;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    Fudge.typesOfResources = [
        ƒ.Mesh
    ];
    /**
     * List the internal resources
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewInternalTable extends Fudge.ViewInternal {
        table;
        constructor(_container, _state) {
            super(_container, _state);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.OPEN, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.CREATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            // this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
            // this.dom.addEventListener(EVENT_EDITOR.TEST, this.hndEvent);
            this.dom.addEventListener("mutate" /* ƒui.EVENT.MUTATE */, this.hndEvent);
            this.dom.addEventListener("itemselect" /* ƒui.EVENT.SELECT */, this.hndEvent);
            this.dom.addEventListener("removeChild" /* ƒui.EVENT.REMOVE_CHILD */, this.hndEvent);
            this.dom.addEventListener("rename" /* ƒui.EVENT.RENAME */, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒui.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("keyup", this.hndKeyboardEvent);
        }
        listResources() {
            while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild))
                ;
            this.table = new ƒui.Table(new Fudge.ControllerTableResource(), Object.values(ƒ.Project.resources), "type");
            this.dom.appendChild(this.table);
            this.dom.title = "● Right click to create new resource.\n● Select or drag resource.";
            this.table.title = "● Select to edit in \"Properties\"\n●  Drag to \"Properties\" or \"Components\" to use if applicable.";
            for (let tr of this.table.querySelectorAll("tr")) {
                let tds = tr.querySelectorAll("td");
                if (!tds.length)
                    continue;
                tds[1].classList.add("icon");
                tds[1].setAttribute("icon", tds[1].children[0].value);
                if (tr instanceof ƒui.TableItem && tr.data.status == ƒ.RESOURCE_STATUS.ERROR) {
                    tr.classList.add("error");
                    tr.title = "Failed to load resource from file check the console for details.";
                    break;
                }
            }
        }
        getSelection() {
            return this.table.controller.selection;
        }
        getDragDropSources() {
            return this.table.controller.dragDrop.sources;
        }
        // TODO: this is a preparation for syncing a graph with its instances after structural changes
        // protected openContextMenu = (_event: Event): void => {
        //   let row: HTMLTableRowElement = <HTMLTableRowElement>_event.composedPath().find((_element) => (<HTMLElement>_element).tagName == "TR");
        //   if (row)
        //     this.contextMenu.getMenuItemById(String(CONTEXTMENU.SYNC_INSTANCES)).enabled = (row.getAttribute("icon") == "Graph");
        //   this.contextMenu.popup();
        // }
        // #region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({ label: "Create Graph", id: String(Fudge.CONTEXTMENU.CREATE_GRAPH), click: _callback, accelerator: "G" });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Mesh",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_MESH, ƒ.Mesh, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Material",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_MATERIAL, ƒ.Shader, _callback)
            });
            menu.append(item);
            item = new Fudge.remote.MenuItem({
                label: "Create Animation",
                submenu: Fudge.ContextMenu.getSubclassMenu(Fudge.CONTEXTMENU.CREATE_ANIMATION, ƒ.Animation, _callback)
            });
            menu.append(item);
            // item = new remote.MenuItem({ label: `Create ${ƒ.Animation.name}`, id: String(CONTEXTMENU.CREATE_ANIMATION), click: _callback });
            // menu.append(item);
            // item = new remote.MenuItem({ label: `Create ${ƒ.AnimationSprite.name}`, id: String(CONTEXTMENU.CREATE_ANIMATION), click: _callback });
            // menu.append(item);
            item = new Fudge.remote.MenuItem({ label: `Create ${ƒ.ParticleSystem.name}`, id: String(Fudge.CONTEXTMENU.CREATE_PARTICLE_EFFECT), click: _callback });
            menu.append(item);
            item = new Fudge.remote.MenuItem({ label: "Delete Resource", id: String(Fudge.CONTEXTMENU.DELETE_RESOURCE), click: _callback, accelerator: "R" });
            menu.append(item);
            // item = new remote.MenuItem({ label: "Sync Instances", id: String(CONTEXTMENU.SYNC_INSTANCES), click: _callback, accelerator: "S" });
            // menu.append(item);
            // ContextMenu.appendCopyPaste(menu);
            return menu;
        }
        async contextMenuCallback(_item, _window, _event) {
            let choice = Number(_item.id);
            ƒ.Debug.fudge(`MenuSelect | id: ${Fudge.CONTEXTMENU[_item.id]} | event: ${_event}`);
            let iSubclass = _item["iSubclass"];
            if (!iSubclass && (choice == Fudge.CONTEXTMENU.CREATE_MESH || choice == Fudge.CONTEXTMENU.CREATE_MATERIAL)) {
                alert("Funky Electron-Error... please try again");
                return;
            }
            switch (choice) {
                //TODO: dispatch CREATE instead of MODIFY!
                case Fudge.CONTEXTMENU.CREATE_MESH:
                    let typeMesh = ƒ.Mesh.subclasses[iSubclass];
                    //@ts-ignore
                    let meshNew = new typeMesh();
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
                    this.table.selectInterval(meshNew, meshNew);
                    break;
                case Fudge.CONTEXTMENU.CREATE_MATERIAL:
                    let typeShader = ƒ.Shader.subclasses[iSubclass];
                    let mtrNew = new ƒ.Material(typeShader.name, typeShader);
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
                    this.table.selectInterval(mtrNew, mtrNew);
                    break;
                case Fudge.CONTEXTMENU.CREATE_GRAPH:
                    let graph = await ƒ.Project.registerAsGraph(new ƒ.Node("NewGraph"));
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
                    this.table.selectInterval(graph, graph);
                    break;
                case Fudge.CONTEXTMENU.CREATE_ANIMATION:
                    let typeAnimation = ƒ.Animation.subclasses[iSubclass];
                    let animation = new typeAnimation();
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
                    this.table.selectInterval(animation, animation);
                    break;
                case Fudge.CONTEXTMENU.CREATE_PARTICLE_EFFECT:
                    let particleSystem = new ƒ.ParticleSystem();
                    this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
                    this.table.selectInterval(particleSystem, particleSystem);
                    break;
                case Fudge.CONTEXTMENU.DELETE_RESOURCE:
                    await this.table.controller.delete([this.table.getFocussed()]);
                    this.dispatch(Fudge.EVENT_EDITOR.DELETE, { bubbles: true });
                    break;
            }
        }
        //#endregion
        hndDragOver(_event, _viewSource) {
            _event.dataTransfer.dropEffect = "none";
            if (this.dom != _event.target)
                return;
            if (!(_viewSource instanceof Fudge.ViewExternal || _viewSource instanceof Fudge.ViewHierarchy))
                return;
            if (_viewSource instanceof Fudge.ViewExternal) {
                let sources = _viewSource.getDragDropSources();
                if (sources.some(_source => ![Fudge.MIME.AUDIO, Fudge.MIME.IMAGE, Fudge.MIME.MESH, Fudge.MIME.GLTF].includes(_source.getMimeType())))
                    return;
                // for (let source of sources)
                //   if (source.getMimeType() != MIME.AUDIO && source.getMimeType() != MIME.IMAGE && source.getMimeType() != MIME.MESH)
                //     return;
            }
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
        }
        async hndDrop(_event, _viewSource) {
            if (_viewSource instanceof Fudge.ViewHierarchy) {
                let sources = _viewSource.getDragDropSources();
                for (let source of sources) {
                    await ƒ.Project.registerAsGraph(source, true);
                }
            }
            else if (_viewSource instanceof Fudge.ViewExternal) {
                let sources = _viewSource.getDragDropSources();
                for (let source of sources) {
                    switch (source.getMimeType()) {
                        case Fudge.MIME.AUDIO:
                            console.log(new ƒ.Audio(source.pathRelative));
                            break;
                        case Fudge.MIME.IMAGE:
                            console.log(new ƒ.TextureImage(source.pathRelative));
                            break;
                        case Fudge.MIME.MESH:
                            ƒ.Debug.log(await new ƒ.MeshOBJ().load(source.pathRelative));
                            break;
                        case Fudge.MIME.GLTF:
                            let loader = await ƒ.GLTFLoader.LOAD(source.pathRelative);
                            let load = await ƒui.Dialog.prompt(Fudge.ViewInternal.gltfImportSettings, false, `Select what to import from '${loader.name}'`, "Adjust settings and press OK", "OK", "Cancel");
                            if (!load)
                                break;
                            for (let type in Fudge.ViewInternal.gltfImportSettings)
                                if (Fudge.ViewInternal.gltfImportSettings[type]) {
                                    let resources = await loader.loadResources(ƒ[type]);
                                    for (let resource of resources) {
                                        if (!ƒ.Project.resources[resource.idResource])
                                            ƒ.Project.register(resource);
                                    }
                                }
                            break;
                    }
                }
            }
            this.dispatch(Fudge.EVENT_EDITOR.CREATE, { bubbles: true });
        }
        hndKeyboardEvent = (_event) => {
            if (_event.code != ƒ.KEYBOARD_CODE.F2)
                return;
            // let cell: HTMLTableCellElement = this.table.querySelector(".selected");
            let input = document.activeElement.querySelector("input");
            if (!input)
                return;
            input.readOnly = false;
            input.focus();
        };
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.OPEN:
                case Fudge.EVENT_EDITOR.CREATE:
                case Fudge.EVENT_EDITOR.UPDATE:
                case Fudge.EVENT_EDITOR.DELETE:
                    this.listResources();
            }
            if (_event.detail?.sender)
                return;
            switch (_event.type) {
                case "mutate" /* ƒui.EVENT.MUTATE */:
                    _event.stopPropagation();
                    this.dispatchToParent(Fudge.EVENT_EDITOR.MODIFY, {});
                    break;
                case "removeChild" /* ƒui.EVENT.REMOVE_CHILD */:
                    _event.stopPropagation();
                    this.dispatchToParent(Fudge.EVENT_EDITOR.DELETE, {});
                case Fudge.EVENT_EDITOR.SELECT: // TODO: is this reachable? Is it still needed?
                    this.listResources();
                    break;
                case "rename" /* ƒui.EVENT.RENAME */:
                    this.listResources();
                    this.dispatchToParent(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true, detail: _event.detail });
                    break;
            }
        };
    }
    Fudge.ViewInternalTable = ViewInternalTable;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    /**
     * Preview a resource
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewPreview extends Fudge.View {
        static mtrStandard = ViewPreview.createStandardMaterial();
        static meshStandard = ViewPreview.createStandardMesh();
        resource;
        viewport;
        cmrOrbit;
        previewNode;
        mtxImage = ƒ.Matrix3x3.IDENTITY();
        timeoutDefer;
        constructor(_container, _state) {
            super(_container, _state);
            // create viewport for 3D-resources
            let cmpCamera = new ƒ.ComponentCamera();
            // cmpCamera.pivot.translate(new ƒ.Vector3(1, 2, 1));
            // cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
            cmpCamera.projectCentral(1, 45);
            let canvas = ƒAid.Canvas.create(true, ƒAid.IMAGE_RENDERING.PIXELATED);
            this.viewport = new ƒ.Viewport();
            this.viewport.initialize("Preview", null, cmpCamera, canvas);
            // ƒ.RenderWebGL.setCanvasSize(1, 1);
            this.cmrOrbit = ƒAid.Viewport.expandCameraToInteractiveOrbit(this.viewport, false);
            this.previewNode = this.createStandardGraph();
            this.fillContent();
            _container.on("resize", this.redraw);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener("contextmenu" /* ƒUi.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("wheel", this.hndMouse);
            this.dom.addEventListener("mousemove", this.hndMouse);
        }
        static createStandardMaterial() {
            let mtrStandard = new ƒ.Material("StandardMaterial", ƒ.ShaderFlat, new ƒ.CoatRemissive(ƒ.Color.CSS("white")));
            ƒ.Project.deregister(mtrStandard);
            return mtrStandard;
        }
        static createStandardMesh() {
            let meshStandard = new ƒ.MeshSphere("Sphere", 20, 12);
            ƒ.Project.deregister(meshStandard);
            return meshStandard;
        }
        // #region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            // item = new remote.MenuItem({ label: "Illuminate Graph", id: CONTEXTMENU[CONTEXTMENU.ILLUMINATE], checked: true, type: "checkbox", click: _callback });
            // menu.append(item);
            return menu;
        }
        contextMenuCallback(_item, _window, _event) {
            ƒ.Debug.info(`MenuSelect: Item-id=${_item.id}`);
            // switch (_item.id) {
            // case CONTEXTMENU[CONTEXTMENU.ILLUMINATE]:
            //   this.illuminateGraph();
            //   break;
            // }
        }
        //#endregion
        hndMouse = (_event) => {
            let div = this.dom.querySelector("div#image");
            if (!div)
                return;
            _event.preventDefault();
            switch (_event.type) {
                case "mousemove":
                    if (_event.buttons != 2)
                        return;
                    this.mtxImage.translateX(_event.movementX);
                    this.mtxImage.translateY(_event.movementY);
                    break;
                case "wheel":
                    let offset = new ƒ.Vector2(_event.offsetX - this.dom.clientWidth, _event.offsetY - this.dom.clientHeight / 2);
                    let zoom = Math.exp(-_event.deltaY / 1000);
                    // console.log(offset.toString());
                    this.mtxImage.scaleX(zoom);
                    this.mtxImage.scaleY(zoom);
                    offset.scale(zoom - 1);
                    this.mtxImage.translateX(-offset.x);
                    this.mtxImage.translateY(-offset.y);
                    break;
            }
            this.setTransform(div);
        };
        setTransform(_div) {
            let transform = this.mtxImage.get();
            transform = transform.copyWithin(5, 6);
            transform = transform.copyWithin(2, 3);
            _div.style.transform = `matrix(${transform.slice(0, 6).join()})`;
        }
        fillContent() {
            this.dom.innerHTML = "";
            if (!this.resource) {
                this.dom.innerHTML = "Select an internal or external resource to preview";
                this.setTitle("Preview");
                return;
            }
            let lightsPresent = true;
            //@ts-ignore
            let type = this.resource.type || "Function";
            if (this.resource instanceof ƒ.Mesh)
                type = "Mesh";
            // console.log(type);
            let previewObject = new ƒ.Node("PreviewObject");
            let preview;
            switch (type) {
                case "Function":
                    preview = this.createScriptPreview(this.resource);
                    if (preview)
                        this.dom.appendChild(preview);
                    break;
                case "File":
                    preview = this.createFilePreview(this.resource);
                    if (preview)
                        this.dom.appendChild(preview);
                    break;
                case "Mesh":
                    previewObject.addComponent(new ƒ.ComponentMesh(this.resource));
                    previewObject.addComponent(new ƒ.ComponentMaterial(ViewPreview.mtrStandard));
                    this.setViewObject(previewObject);
                    this.resetCamera();
                    this.redraw();
                    break;
                case "Material":
                    previewObject.addComponent(new ƒ.ComponentMesh(ViewPreview.meshStandard));
                    previewObject.addComponent(new ƒ.ComponentMaterial(this.resource));
                    this.setViewObject(previewObject);
                    this.resetCamera();
                    this.redraw();
                    break;
                case "Graph":
                    previewObject.appendChild(this.resource);
                    ƒ.Render.prepare(this.resource);
                    lightsPresent = false;
                    ƒ.Render.lights.forEach((_array) => lightsPresent ||= _array.length > 0);
                    this.illuminate(!lightsPresent);
                    this.setTitle(`${lightsPresent ? "PREVIEW" : "Preview"} | ${this.resource.name}`);
                    this.redraw();
                    ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.resource);
                    this.setViewObject(previewObject);
                    previewObject.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, (_event) => {
                        this.defer(() => this.dispatch(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true }));
                    });
                    this.redraw();
                    break;
                case "TextureImage":
                case "AnimationSprite":
                    let div = document.createElement("div");
                    div.id = "image";
                    let img;
                    if (type == "TextureImage") {
                        img = this.resource.image;
                        div.appendChild(img);
                    }
                    else {
                        let animationSprite = this.resource;
                        img = animationSprite.texture.image;
                        div.appendChild(img);
                        let positions = animationSprite.getPositions();
                        let mutator = animationSprite.getMutator();
                        for (let position of positions) {
                            let rect = document.createElement("span");
                            rect.className = "rectSprite";
                            rect.style.left = position.x + 1 + "px";
                            rect.style.top = position.y + 1 + "px";
                            rect.style.width = mutator.size.x - 2 + "px";
                            rect.style.height = mutator.size.y - 2 + "px";
                            div.appendChild(rect);
                        }
                    }
                    this.dom.appendChild(div);
                    this.setTransform(div);
                    break;
                case "Audio":
                    let entry = new Fudge.DirectoryEntry(this.resource.path.toString(), "", null, null);
                    this.dom.appendChild(this.createAudioPreview(entry));
                    break;
                default: break;
            }
            this.setTitle(`Preview | ${this.resource.name}`);
        }
        createStandardGraph() {
            let graph = new ƒ.Node("PreviewScene");
            this.viewport.setBranch(graph);
            let nodeLight = new ƒ.Node("PreviewIllumination");
            graph.addChild(nodeLight);
            ƒAid.addStandardLightComponents(nodeLight);
            this.dom.appendChild(this.viewport.canvas);
            let previewNode = new ƒ.Node("PreviewNode");
            graph.addChild(previewNode);
            return previewNode;
        }
        setViewObject(_node, _graphIllumination = false) {
            this.previewNode.removeAllChildren();
            this.previewNode.addChild(_node);
            this.illuminate(true);
            this.dom.appendChild(this.viewport.canvas);
        }
        illuminate(_on) {
            let nodeLight = this.viewport.getBranch()?.getChildrenByName("PreviewIllumination")[0];
            nodeLight.activate(_on);
            this.redraw();
        }
        createFilePreview(_entry) {
            let mime = _entry.getMimeType();
            switch (mime) {
                case Fudge.MIME.TEXT: return this.createTextPreview(_entry);
                case Fudge.MIME.AUDIO: return this.createAudioPreview(_entry);
                case Fudge.MIME.IMAGE: return this.createImagePreview(_entry);
            }
            return null;
        }
        createTextPreview(_entry) {
            let pre = document.createElement("pre");
            pre.textContent = _entry.getFileContent();
            return pre;
        }
        createImagePreview(_entry) {
            let img = document.createElement("img");
            img.src = _entry.path;
            img.style.border = "1px solid black";
            return img;
        }
        createAudioPreview(_entry) {
            let audio = document.createElement("audio");
            audio.src = _entry.path;
            audio.play();
            audio.controls = true;
            return audio;
        }
        createScriptPreview(_script) {
            let pre = document.createElement("pre");
            let code = _script.toString();
            code = code.replaceAll("    ", " ");
            pre.textContent = code;
            return pre;
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.MODIFY:
                case Fudge.EVENT_EDITOR.UPDATE:
                    // if ([ƒ.Audio, ƒ.Texture, ƒ.AnimationSprite].some((_type) => this.resource instanceof _type)) {
                    if (this.resource instanceof ƒ.Audio ||
                        this.resource instanceof ƒ.Texture ||
                        this.resource instanceof ƒ.AnimationSprite)
                        this.fillContent();
                    this.redraw();
                    break;
                default:
                    if (!_event.detail)
                        this.resource = undefined;
                    else if (_event.detail.data instanceof Fudge.ScriptInfo)
                        this.resource = _event.detail.data.script;
                    else
                        this.resource = _event.detail.data;
                    this.mtxImage.reset();
                    this.fillContent();
                    break;
            }
        };
        resetCamera() {
            let branch = this.viewport.getBranch();
            ƒ.Render.prepare(branch);
            let r = branch.radius;
            this.cmrOrbit.mtxLocal.translation = ƒ.Vector3.ZERO();
            ƒ.Render.prepare(this.cmrOrbit);
            this.cmrOrbit.rotationX = -30;
            this.cmrOrbit.rotationY = 30;
            this.cmrOrbit.distance = r * 3;
            ƒ.Render.prepare(this.cmrOrbit);
        }
        redraw = () => {
            if (this.viewport.canvas.clientHeight == 0 || this.viewport.canvas.clientHeight == 0)
                return;
            try {
                if (this.resource instanceof ƒ.Graph)
                    ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.resource);
                this.viewport.draw();
            }
            catch (_error) {
                //nop
            }
        };
        defer(_function) {
            if (this.timeoutDefer)
                return;
            this.timeoutDefer = window.setTimeout(() => {
                _function();
                this.timeoutDefer = undefined;
            }, 100);
        }
    }
    Fudge.ViewPreview = ViewPreview;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    /**
     * View the properties of a resource
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewProperties extends Fudge.View {
        resource;
        constructor(_container, _state) {
            super(_container, _state);
            this.fillContent();
            this.dom.addEventListener("mutate" /* ƒui.EVENT.MUTATE */, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.SELECT, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.DELETE, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
        }
        fillContent() {
            while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild))
                ;
            // console.log(this.resource);
            let content = document.createElement("div");
            content.style.whiteSpace = "nowrap";
            if (this.resource) {
                this.setTitle("Properties | " + this.resource.name);
                if (this.resource instanceof ƒ.Mutable) {
                    let fieldset = ƒui.Generator.createDetailsFromMutable(this.resource);
                    let uiMutable = new Fudge.ControllerDetail(this.resource, fieldset);
                    content = uiMutable.domElement;
                }
                else if (this.resource instanceof Fudge.DirectoryEntry && this.resource.stats) {
                    content.innerHTML += "Size: " + (this.resource.stats["size"] / 1024).toFixed(2) + " KiB<br/>";
                    content.innerHTML += "Created: " + this.resource.stats["birthtime"].toLocaleString() + "<br/>";
                    content.innerHTML += "Modified: " + this.resource.stats["ctime"].toLocaleString() + "<br/>";
                }
                else if (this.resource instanceof ƒ.Graph) {
                    content.innerHTML = this.resource.toHierarchyString();
                }
                else if (this.resource instanceof Fudge.ScriptInfo) {
                    for (let key in this.resource.script) {
                        let value = this.resource.script[key];
                        if (value instanceof Function)
                            value = value.name;
                        if (value instanceof Array)
                            value = "Array(" + value.length + ")";
                        content.innerHTML += key + ": " + value + "<br/>";
                    }
                }
                else if (this.resource instanceof Fudge.ResourceFolder) {
                    let entries = {};
                    for (const entry of this.resource.entries) {
                        entries[entry.type] = (entries[entry.type] ?? 0) + 1;
                    }
                    content.innerHTML = `Entries: ${this.resource.entries.length}<br/>`;
                    for (let type in entries)
                        content.innerHTML += `${type}: ${entries[type]}<br/>`;
                }
            }
            else {
                this.setTitle("Properties");
                content.innerHTML = "Select an internal or external resource to examine properties";
            }
            this.dom.append(content);
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.SELECT:
                case Fudge.EVENT_EDITOR.DELETE:
                    this.resource = (_event.detail.data);
                    this.fillContent();
                    break;
                case Fudge.EVENT_EDITOR.UPDATE:
                    this.fillContent();
                    break;
                case "mutate" /* ƒui.EVENT.MUTATE */:
                    this.dispatchToParent(Fudge.EVENT_EDITOR.UPDATE, {});
                    break;
                case Fudge.EVENT_EDITOR.MODIFY: // let modify pass
                    return;
                default:
                    break;
            }
            _event.stopPropagation();
        };
    }
    Fudge.ViewProperties = ViewProperties;
})(Fudge || (Fudge = {}));
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    /**
     * List the scripts loaded
     * @author Jirka Dell'Oro-Friedl, HFU, 2020-23
     */
    class ViewScript extends Fudge.View {
        // TODO: consider script namespaces ƒ.ScriptNamespaces to find all scripts not just ComponentScripts
        table;
        constructor(_container, _state) {
            super(_container, _state);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.OPEN, this.hndEvent);
            this.dom.addEventListener(Fudge.EVENT_EDITOR.UPDATE, this.hndEvent);
            // this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
            // this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
        }
        listScripts() {
            this.dom.title = `Drag & drop scripts on "Components"`;
            while (this.dom.lastChild && this.dom.removeChild(this.dom.lastChild))
                ;
            let scriptinfos = [];
            for (let namespace in ƒ.Project.scriptNamespaces) {
                for (let index in ƒ.Project.scriptNamespaces[namespace]) {
                    let script = ƒ.Project.scriptNamespaces[namespace][index];
                    if (script.name)
                        scriptinfos.push(new Fudge.ScriptInfo(script, namespace));
                }
            }
            this.table = new ƒui.Table(new Fudge.ControllerTableScript(), scriptinfos);
            this.dom.appendChild(this.table);
        }
        getSelection() {
            return this.table.controller.selection;
        }
        getDragDropSources() {
            return this.table.controller.dragDrop.sources;
        }
        // #region  ContextMenu
        // protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu {
        //   const menu: Electron.Menu = new remote.Menu();
        //   return menu;
        // }
        // protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void {
        //   ƒ.Debug.fudge(`MenuSelect | id: ${CONTEXTMENU[_item.id]} | event: ${_event}`);
        // }
        //#endregion
        hndEvent = (_event) => {
            switch (_event.type) {
                case Fudge.EVENT_EDITOR.UPDATE:
                case Fudge.EVENT_EDITOR.OPEN:
                    if (!_event.detail.data)
                        this.listScripts();
                    break;
            }
        };
    }
    Fudge.ViewScript = ViewScript;
})(Fudge || (Fudge = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFnZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Qcm9qZWN0LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckRldGFpbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVJlc291cmNlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRhYmxlU2NyaXB0cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlRGlyZWN0b3J5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEdyYXBoLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsSGVscC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXdQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvQW5pbWF0aW9uL1ZpZXdBbmltYXRpb25TaGVldC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdDb21wb25lbnRzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvR3JhcGgvVmlld0hpZXJhcmNoeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdSZW5kZXIudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbFRhYmxlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3UHJldmlldy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1Byb3BlcnRpZXMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBaUNkO0FBakNELFdBQVUsS0FBSztJQUNiLG1DQUFtQztJQUNuQyx3QkFBd0I7SUFTeEIsTUFBYSxXQUFXO1FBQ2YsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFvQjtZQUNoRCxLQUFL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QUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDaEYsSUFBSSxHQUFHLENBQUMsU0FBUyxJQUFJLE1BQUEsU0FBUyxDQUFDLE1BQU07Z0JBQ25DLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJLEtBQUssR0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2QyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDdEYsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDdkYsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUN4RCxL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QztvQkFDckIsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDLENBQUM7S0FDSDtJQXhEWSxnQkFBVSxhQXdEdEIsQ0FBQTtBQUNILENBQUMsRUFqRVMsS0FBSyxLQUFMLEtBQUssUUFpRWQiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIC8vIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIC8vIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgQ29udGV4dE1lbnVDYWxsYmFjayA9IChtZW51SXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIGJyb3dzZXJXaW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIGV2ZW50OiBFbGVjdHJvbi5LZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICB0eXBlIFN1YmNsYXNzPFQ+ID0ge1xyXG4gICAgc3ViY2xhc3NlczogVFtdXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRDb3B5UGFzdGUoX21lbnU6IEVsZWN0cm9uLk1lbnUpOiB2b2lkIHtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcImNvcHlcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJjdXRcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJwYXN0ZVwiIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTdWJjbGFzc01lbnU8VCBleHRlbmRzIFN1YmNsYXNzPFQ+PihfaWQ6IENPTlRFWFRNRU5VLCBfY2xhc3M6IFQsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAobGV0IGlTdWJjbGFzcyBpbiBfY2xhc3Muc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIGxldCBzdWJjbGFzczogVCA9IF9jbGFzcy5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgIHsgbGFiZWw6IHN1YmNsYXNzLm5hbWUsIGlkOiBTdHJpbmcoX2lkKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpdGVtLm92ZXJyaWRlUHJvcGVydHkoXCJpU3ViY2xhc3NcIiwgaVN1YmNsYXNzKTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGV4cG9ydCBlbnVtIENPTlRFWFRNRU5VIHtcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICBBRERfTk9ERSxcclxuICAgIEFDVElWQVRFX05PREUsXHJcbiAgICBERUxFVEVfTk9ERSxcclxuICAgIEFERF9DT01QT05FTlQsXHJcbiAgICBERUxFVEVfQ09NUE9ORU5ULFxyXG4gICAgQUREX0NPTVBPTkVOVF9TQ1JJUFQsXHJcbiAgICBFRElULFxyXG4gICAgQ1JFQVRFX0ZPTERFUixcclxuICAgIENSRUFURV9NRVNILFxyXG4gICAgQ1JFQVRFX01BVEVSSUFMLFxyXG4gICAgQ1JFQVRFX0dSQVBILFxyXG4gICAgQ1JFQVRFX0FOSU1BVElPTixcclxuICAgIENSRUFURV9QQVJUSUNMRV9FRkZFQ1QsXHJcbiAgICBTWU5DX0lOU1RBTkNFUyxcclxuICAgIFJFTU9WRV9DT01QT05FTlQsXHJcbiAgICBBRERfSk9JTlQsXHJcbiAgICBERUxFVEVfUkVTT1VSQ0UsXHJcbiAgICBPUlRIR1JBUEhJQ19DQU1FUkEsXHJcbiAgICBSRU5ERVJfQ09OVElOVU9VU0xZLFxyXG4gICAgQUREX1BST1BFUlRZLFxyXG4gICAgREVMRVRFX1BST1BFUlRZLFxyXG4gICAgQ09OVkVSVF9BTklNQVRJT04sXHJcbiAgICBBRERfUEFSVElDTEVfUFJPUEVSVFksXHJcbiAgICBBRERfUEFSVElDTEVfRlVOQ1RJT04sXHJcbiAgICBBRERfUEFSVElDTEVfQ09OU1RBTlQsXHJcbiAgICBBRERfUEFSVElDTEVfQ09ERSxcclxuICAgIEFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTixcclxuICAgIERFTEVURV9QQVJUSUNMRV9EQVRBXHJcbiAgfVxyXG5cclxuXHJcbiAgZXhwb3J0IGVudW0gTUVOVSB7XHJcbiAgICBRVUlUID0gXCJxdWl0XCIsXHJcbiAgICBQUk9KRUNUX05FVyA9IFwicHJvamVjdE5ld1wiLFxyXG4gICAgUFJPSkVDVF9TQVZFID0gXCJwcm9qZWN0U2F2ZVwiLFxyXG4gICAgUFJPSkVDVF9MT0FEID0gXCJwcm9qZWN0TG9hZFwiLFxyXG4gICAgREVWVE9PTFNfT1BFTiA9IFwiZGV2dG9vbHNPcGVuXCIsXHJcbiAgICBQQU5FTF9HUkFQSF9PUEVOID0gXCJwYW5lbEdyYXBoT3BlblwiLFxyXG4gICAgUEFORUxfQU5JTUFUSU9OX09QRU4gPSBcInBhbmVsQW5pbWF0aW9uT3BlblwiLFxyXG4gICAgUEFORUxfUFJPSkVDVF9PUEVOID0gXCJwYW5lbFByb2plY3RPcGVuXCIsXHJcbiAgICBQQU5FTF9IRUxQX09QRU4gPSBcInBhbmVsSGVscE9wZW5cIixcclxuICAgIFBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOID0gXCJwYW5lbFBhcnRpY2xlU3lzdGVtT3BlblwiLFxyXG4gICAgRlVMTFNDUkVFTiA9IFwiZnVsbHNjcmVlblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBQQU5FTCB7XHJcbiAgICBHUkFQSCA9IFwiUGFuZWxHcmFwaFwiLFxyXG4gICAgUFJPSkVDVCA9IFwiUGFuZWxQcm9qZWN0XCIsXHJcbiAgICBIRUxQID0gXCJQYW5lbEhlbHBcIixcclxuICAgIEFOSU1BVElPTiA9IFwiUGFuZWxBbmltYXRpb25cIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiUGFuZWxQYXJ0aWNsZVN5c3RlbVwiXHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gVklFVyB7XHJcbiAgICBISUVSQVJDSFkgPSBcIlZpZXdIaWVyYXJjaHlcIixcclxuICAgIEFOSU1BVElPTiA9IFwiVmlld0FuaW1hdGlvblwiLFxyXG4gICAgQU5JTUFUSU9OX1NIRUVUID0gXCJWaWV3QW5pbWF0aW9uU2hlZXRcIixcclxuICAgIFJFTkRFUiA9IFwiVmlld1JlbmRlclwiLFxyXG4gICAgQ09NUE9ORU5UUyA9IFwiVmlld0NvbXBvbmVudHNcIixcclxuICAgIENBTUVSQSA9IFwiVmlld0NhbWVyYVwiLFxyXG4gICAgSU5URVJOQUxfVEFCTEUgPSBcIlZpZXdJbnRlcm5hbFRhYmxlXCIsXHJcbiAgICBJTlRFUk5BTF9GT0xERVIgPSBcIlZpZXdJbnRlcm5hbEZvbGRlclwiLFxyXG4gICAgRVhURVJOQUwgPSBcIlZpZXdFeHRlcm5hbFwiLFxyXG4gICAgUFJPUEVSVElFUyA9IFwiVmlld1Byb3BlcnRpZXNcIixcclxuICAgIFBSRVZJRVcgPSBcIlZpZXdQcmV2aWV3XCIsXHJcbiAgICBTQ1JJUFQgPSBcIlZpZXdTY3JpcHRcIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiVmlld1BhcnRpY2xlU3lzdGVtXCJcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICAvLyBNRVNIID0gVmlld01lc2gsXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBUUkFOU0ZPUk0ge1xyXG4gICAgVFJBTlNMQVRFID0gXCJ0cmFuc2xhdGVcIixcclxuICAgIFJPVEFURSA9IFwicm90YXRlXCIsXHJcbiAgICBTQ0FMRSA9IFwic2NhbGVcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gR0laTU9TIHtcclxuICAgIFRSQU5TRk9STSA9IFwiVHJhbnNmb3JtXCJcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBleHBvcnQgZW51bSBNSU1FIHtcclxuICAgIFRFWFQgPSBcInRleHRcIixcclxuICAgIEFVRElPID0gXCJhdWRpb1wiLFxyXG4gICAgSU1BR0UgPSBcImltYWdlXCIsXHJcbiAgICBNRVNIID0gXCJtZXNoXCIsXHJcbiAgICBHTFRGID0gXCJnbHRmXCIsXHJcbiAgICBVTktOT1dOID0gXCJ1bmtub3duXCJcclxuICB9XHJcblxyXG4gIGxldCBtaW1lOiBNYXA8TUlNRSwgc3RyaW5nW10+ID0gbmV3IE1hcChbXHJcbiAgICBbTUlNRS5URVhULCBbXCJ0c1wiLCBcImpzb25cIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCIsIFwianNcIiwgXCJ0eHRcIl1dLFxyXG4gICAgW01JTUUuTUVTSCwgW1wib2JqXCJdXSxcclxuICAgIFtNSU1FLkFVRElPLCBbXCJtcDNcIiwgXCJ3YXZcIiwgXCJvZ2dcIl1dLFxyXG4gICAgW01JTUUuSU1BR0UsIFtcInBuZ1wiLCBcImpwZ1wiLCBcImpwZWdcIiwgXCJ0aWZcIiwgXCJ0Z2FcIiwgXCJnaWZcIl1dLFxyXG4gICAgW01JTUUuR0xURiwgW1wiZ2x0ZlwiLCBcImdsYlwiXV1cclxuICBdKTtcclxuXHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBjb25zdCBwOiB0eXBlb2YgaW1wb3J0KFwicGF0aFwiKSA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG4gIHR5cGUgRGlyZW50ID0gaW1wb3J0KFwiZnNcIikuRGlyZW50O1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGlyZWN0b3J5RW50cnkge1xyXG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXRoUmVsYXRpdmU6IHN0cmluZztcclxuICAgIHB1YmxpYyBkaXJlbnQ6IERpcmVudDtcclxuICAgIHB1YmxpYyBzdGF0czogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nLCBfcGF0aFJlbGF0aXZlOiBzdHJpbmcsIF9kaXJlbnQ6IERpcmVudCwgX3N0YXRzOiBPYmplY3QpIHtcclxuICAgICAgdGhpcy5wYXRoID0gcC5ub3JtYWxpemUoX3BhdGgpO1xyXG4gICAgICB0aGlzLnBhdGhSZWxhdGl2ZSA9IHAubm9ybWFsaXplKF9wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB0aGlzLmRpcmVudCA9IF9kaXJlbnQ7XHJcbiAgICAgIHRoaXMuc3RhdHMgPSBfc3RhdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVSb290KF9wYXRoOiBzdHJpbmcpOiBEaXJlY3RvcnlFbnRyeSB7XHJcbiAgICAgIGxldCBkaXJlbnQ6IERpcmVudCA9IG5ldyBmcy5EaXJlbnQoKTtcclxuICAgICAgZGlyZW50Lm5hbWUgPSBwLmJhc2VuYW1lKF9wYXRoKTtcclxuICAgICAgZGlyZW50LmlzRGlyZWN0b3J5ID0gKCkgPT4gdHJ1ZTtcclxuICAgICAgcmV0dXJuIG5ldyBEaXJlY3RvcnlFbnRyeShfcGF0aCwgXCJcIiwgZGlyZW50LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZW50Lm5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IG5hbWUoX25hbWU6IHN0cmluZykge1xyXG4gICAgICBsZXQgbmV3UGF0aDogc3RyaW5nID0gcC5qb2luKHAuZGlybmFtZSh0aGlzLnBhdGgpLCBfbmFtZSk7XHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKG5ld1BhdGgpKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgYWxyZWFkeSBhIGZpbGUgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgJyR7X25hbWV9Jy4gU3BlY2lmeSBhIGRpZmZlcmVudCBuYW1lLmApO1xyXG4gICAgICBmcy5yZW5hbWVTeW5jKHRoaXMucGF0aCwgbmV3UGF0aCk7XHJcbiAgICAgIHRoaXMucGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgIHRoaXMuZGlyZW50Lm5hbWUgPSBfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRGlyZWN0b3J5KCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlbnQuaXNEaXJlY3RvcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJlY3RvcnkgPyBcIkRpcmVjdG9yeVwiIDogXCJGaWxlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgZnMucm1TeW5jKHRoaXMucGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERpcmVjdG9yeUNvbnRlbnQoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCBkaXJlbnRzOiBEaXJlbnRbXSA9IGZzLnJlYWRkaXJTeW5jKHRoaXMucGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgY29udGVudDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBkaXJlbnQgb2YgZGlyZW50cykge1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBwLmpvaW4odGhpcy5wYXRoLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHBhdGhSZWxhdGl2ZTogc3RyaW5nID0gcC5qb2luKHRoaXMucGF0aFJlbGF0aXZlLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHN0YXRzOiBPYmplY3QgPSBmcy5zdGF0U3luYyhwYXRoKTtcclxuICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KHBhdGgsIHBhdGhSZWxhdGl2ZSwgZGlyZW50LCBzdGF0cyk7XHJcbiAgICAgICAgY29udGVudC5wdXNoKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RmlsZUNvbnRlbnQoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLnBhdGgsIFwidXRmOFwiKTtcclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEVudHJ5KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiB2b2lkIHtcclxuICAgICAgZnMuY29weUZpbGVTeW5jKF9lbnRyeS5wYXRoLCBwLmpvaW4odGhpcy5wYXRoLCBfZW50cnkubmFtZSksIGZzLmNvbnN0YW50cy5DT1BZRklMRV9FWENMKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TWltZVR5cGUoKTogTUlNRSB7XHJcbiAgICAgIGxldCBleHRlbnNpb246IHN0cmluZyA9IHRoaXMubmFtZS5zcGxpdChcIi5cIikucG9wKCk7XHJcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgbWltZSkge1xyXG4gICAgICAgIGlmICh0eXBlWzFdLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xKVxyXG4gICAgICAgICAgcmV0dXJuIHR5cGVbMF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1JTUUuVU5LTk9XTjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBwYXRoIG9mIERpcmVjdG9yeUVudHJpZXMgc3RhcnRpbmcgYXQgdGhlIHJvb3QgYW5kIGVuZGluZyBhdCB0aGlzIERpcmVjdG9yeUVudHJ5LiBcclxuICAgICAqIFRoZSBlbnRyaWVzIGluIHRoZSByZXR1cm5lZCBwYXRoIE9OTFkgaGF2ZSB0aGVpciByZWxhdGl2ZSBwYXRoIHNldC4gVGhpcyBpcyBzb2xlbHkgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3NlcyBpbiB7QGxpbmsgVmlld0V4dGVybmFsfXMgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFBhdGgoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCB0cmFjZTogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudFBhdGg6IHN0cmluZyA9IHRoaXMucGF0aFJlbGF0aXZlO1xyXG4gICAgICB3aGlsZSAoY3VycmVudFBhdGggIT0gdHJhY2VbdHJhY2UubGVuZ3RoIC0gMV0/LnBhdGhSZWxhdGl2ZSkge1xyXG4gICAgICAgIHRyYWNlLnB1c2gobmV3IERpcmVjdG9yeUVudHJ5KFwiXCIsIGN1cnJlbnRQYXRoLCBudWxsLCBudWxsKSk7XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBwLmRpcm5hbWUoY3VycmVudFBhdGgpO1xyXG4gICAgICB9O1xyXG4gICAgICB0cmFjZS5yZXZlcnNlKCk7XHJcbiAgICAgIHJldHVybiB0cmFjZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgZW51bSBFVkVOVF9FRElUT1Ige1xyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIGNyZWF0ZWQsIGlzIG5vdCBkaXNwYXRjaGVkIHNvIGZhciAqL1xyXG4gICAgQ1JFQVRFID0gXCJFRElUT1JfQ1JFQVRFXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgc2VsZWN0ZWQgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byBzd2l0Y2ggY29udGVudHMgaW4gdGhlIHZpZXdzICovXHJcbiAgICBTRUxFQ1QgPSBcIkVESVRPUl9TRUxFQ1RcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBtb2RpZmllZCBzdHJ1Y3R1cmFsbHkgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byB1cGRhdGUgdmlld3MgKi9cclxuICAgIE1PRElGWSA9IFwiRURJVE9SX01PRElGWVwiLFxyXG4gICAgLyoqIFZhbHVlcyBvZiBhbiBlbnRpdHkgY2hhbmdlIGFuZCBpdCBpcyBuZWNlc3NhcnkgdG8gdXBkYXRlIHZpZXdzICovXHJcbiAgICBVUERBVEUgPSBcIkVESVRPUl9VUERBVEVcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBkZWxldGVkICovXHJcbiAgICBERUxFVEUgPSBcIkVESVRPUl9ERUxFVEVcIixcclxuICAgIC8qKiBBIHZpZXcgb3IgcGFuZWwgY2xvc2VzICovXHJcbiAgICBDTE9TRSA9IFwiRURJVE9SX0NMT1NFXCIsXHJcbiAgICAvKiogQSB2aWV3IG9yIHBhbmVsIG9wZW5zICovXHJcbiAgICBPUEVOID0gXCJFRElUT1JfT1BFTlwiXHJcbiAgICAvKiogQSB0cmFuc2Zvcm0gbWF0cml4IGdldHMgYWRqdXN0ZWQgaW50ZXJhY3RpdmVseSAqLyxcclxuICAgIFRSQU5TRk9STSA9IFwiRURJVE9SX1RSQU5TRk9STVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSByZWNpZXZlcyBmb2N1cyBhbmQgY2FuIGJlIG1hbmlwdWxhdGVkIHVzaW5nIHRoZSBrZXlib2FyZCAqL1xyXG4gICAgRk9DVVMgPSBcIkVESVRPUl9GT0NVU1wiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIEV2ZW50RGV0YWlsIHtcclxuICAgIHZpZXc/OiBWaWV3O1xyXG4gICAgc2VuZGVyPzogUGFuZWwgfCBQYWdlO1xyXG4gICAgbm9kZT86IMaSLk5vZGU7XHJcbiAgICBncmFwaD86IMaSLkdyYXBoO1xyXG4gICAgcmVzb3VyY2U/OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZTtcclxuICAgIG11dGFibGU/OiDGki5NdXRhYmxlO1xyXG4gICAgdHJhbnNmb3JtPzogT2JqZWN0O1xyXG4gICAgZGF0YT86IMaSLkdlbmVyYWw7XHJcbiAgICAvLyBwYXRoPzogVmlld1tdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIEN1c3RvbUV2ZW50IHRoYXQgc3VwcG9ydHMgYSBkZXRhaWwgZmllbGQgd2l0aCB0aGUgdHlwZSBFdmVudERldGFpbFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBFZGl0b3JFdmVudCBleHRlbmRzIEN1c3RvbUV2ZW50PEV2ZW50RGV0YWlsPiB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BhdGNoKF90YXJnZXQ6IEV2ZW50VGFyZ2V0LCBfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgZXhwb3J0IGxldCB3YXRjaGVyOiBpbXBvcnQoXCJmc1wiKS5GU1dhdGNoZXI7XHJcblxyXG4gIGludGVyZmFjZSBDb3B5TGlzdCB7XHJcbiAgICBbc3JjOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbmV3UHJvamVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBmaWxlbmFtZTogc3RyaW5nIHwgc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHByb3BlcnRpZXM6IFtcIm9wZW5EaXJlY3RvcnlcIiwgXCJjcmVhdGVEaXJlY3RvcnlcIl0sIHRpdGxlOiBcIlNlbGVjdC9DcmVhdGUgYSBmb2xkZXIgdG8gc2F2ZSB0aGUgcHJvamVjdCB0by4gVGhlIGZvbGRlcm5hbWUgYmVjb21lcyB0aGUgbmFtZSBvZiB5b3VyIHByb2plY3RcIiwgYnV0dG9uTGFiZWw6IFwiU2F2ZSBQcm9qZWN0XCJcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghZmlsZW5hbWUpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBsZXQgYmFzZTogVVJMID0gbmV3IFVSTChuZXcgVVJMKFwiZmlsZTovL1wiICsgZmlsZW5hbWVbMF0pLnRvU3RyaW5nKCkgKyBcIi9cIik7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBhdGhcIiwgYmFzZS50b1N0cmluZygpKTtcclxuICAgICAgXHJcbiAgICBwcm9qZWN0ID0gbmV3IFByb2plY3QoYmFzZSk7XHJcblxyXG4gICAgYXdhaXQgc2F2ZVByb2plY3QodHJ1ZSk7XHJcblxyXG4gICAgbGV0IMaSUGF0aDogVVJMID0gbmV3IFVSTChcIi4uLy4uL1wiLCBsb2NhdGlvbi5ocmVmKTtcclxuICAgIGNvbnNvbGUubG9nKMaSUGF0aCk7XHJcblxyXG4gICAgZnMuY29weUZpbGVTeW5jKG5ldyBVUkwoXCJFZGl0b3IvU291cmNlL1RlbXBsYXRlLy5naXRpZ25vcmUudHh0XCIsIMaSUGF0aCksIG5ldyBVUkwoXCIuZ2l0aWdub3JlXCIsIGJhc2UpKTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZVwiLCBiYXNlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICBmcy5ta2RpclN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2UvQHR5cGVzXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L0J1aWxkXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBsZXQgY29weVRlbXBsYXRlczogQ29weUxpc3QgPSB7XHJcbiAgICAgIFwiQ3VzdG9tQ29tcG9uZW50U2NyaXB0LnR4dFwiOiBcIlNvdXJjZS9DdXN0b21Db21wb25lbnRTY3JpcHQudHNcIixcclxuICAgICAgXCJNYWluLnR4dFwiOiBcIlNvdXJjZS9NYWluLnRzXCIsXHJcbiAgICAgIFwidHNjb25maWcudHh0XCI6IFwiU291cmNlL3RzY29uZmlnLmpzb25cIixcclxuICAgICAgXCJTY3JpcHQudHh0XCI6IFwiIEJ1aWxkL1NjcmlwdC5qc1wiLFxyXG4gICAgICBcIkF1dG92aWV3LmpzXCI6IFwiLi4vQXV0b3ZpZXcuanNcIlxyXG4gICAgfTtcclxuICAgIGNvcHlGaWxlcyhjb3B5VGVtcGxhdGVzLCBuZXcgVVJMKFwiRWRpdG9yL1NvdXJjZS9UZW1wbGF0ZS9cIiwgxpJQYXRoKSwgbmV3IFVSTChcIlNjcmlwdC9cIiwgYmFzZSkpO1xyXG5cclxuICAgIGxldCBkZWZpbml0aW9uOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIik7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlL0B0eXBlcy9GdWRnZUNvcmUuZC50c1wiLCBiYXNlKSwgYXdhaXQgZGVmaW5pdGlvbi50ZXh0KCkpO1xyXG5cclxuICAgIGF3YWl0IGxvYWRQcm9qZWN0KG5ldyBVUkwocHJvamVjdC5maWxlSW5kZXgsIHByb2plY3QuYmFzZSkpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29weUZpbGVzKF9saXN0OiBDb3B5TGlzdCwgX3NyY1BhdGg6IFVSTCwgX2Rlc3RQYXRoOiBVUkwpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IGNvcHkgaW4gX2xpc3QpIHtcclxuICAgICAgbGV0IHNyYzogVVJMID0gbmV3IFVSTChjb3B5LCBfc3JjUGF0aCk7XHJcbiAgICAgIGxldCBkZXN0OiBVUkwgPSBuZXcgVVJMKF9saXN0W2NvcHldLCBfZGVzdFBhdGgpO1xyXG4gICAgICBmcy5jb3B5RmlsZVN5bmMoc3JjLCBkZXN0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlUHJvamVjdChfbmV3OiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGlmICghcHJvamVjdClcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIGlmICghYXdhaXQgcHJvamVjdC5vcGVuRGlhbG9nKCkpXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB1bndhdGNoRm9sZGVyKCk7XHJcblxyXG4gICAgbGV0IGJhc2U6IFVSTCA9IHByb2plY3QuYmFzZTtcclxuXHJcbiAgICBpZiAoX25ldykge1xyXG4gICAgICBsZXQgY3NzRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlU3R5bGVzLCBiYXNlKTtcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhjc3NGaWxlTmFtZSwgcHJvamVjdC5nZXRQcm9qZWN0Q1NTKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sOiBzdHJpbmcgPSBwcm9qZWN0LmdldFByb2plY3RIVE1MKHByb2plY3QubmFtZSk7XHJcbiAgICBsZXQgaHRtbEZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUluZGV4LCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoaHRtbEZpbGVOYW1lLCBodG1sKTtcclxuXHJcbiAgICBsZXQganNvbkZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUludGVybmFsLCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoanNvbkZpbGVOYW1lLCBwcm9qZWN0LmdldFByb2plY3RKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlSW50ZXJuYWxGb2xkZXIsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlU2V0dGluZ3MsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0U2V0dGluZ3NKU09OKCkpO1xyXG5cclxuICAgIHdhdGNoRm9sZGVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9tcHRMb2FkUHJvamVjdCgpOiBQcm9taXNlPFVSTD4ge1xyXG4gICAgbGV0IGZpbGVuYW1lczogc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHRpdGxlOiBcIkxvYWQgUHJvamVjdFwiLCBidXR0b25MYWJlbDogXCJMb2FkIFByb2plY3RcIiwgcHJvcGVydGllczogW1wib3BlbkZpbGVcIl0sXHJcbiAgICAgIGZpbHRlcnM6IFt7IG5hbWU6IFwiSFRNTC1GaWxlXCIsIGV4dGVuc2lvbnM6IFtcImh0bWxcIiwgXCJodG1cIl0gfV1cclxuICAgIH0pO1xyXG4gICAgaWYgKCFmaWxlbmFtZXMpXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBVUkwoXCJmaWxlOi8vXCIgKyBmaWxlbmFtZXNbMF0pO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGh0bWxDb250ZW50OiBzdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoX3VybCwgeyBlbmNvZGluZzogXCJ1dGYtOFwiIH0pO1xyXG4gICAgxpIuRGVidWcuZ3JvdXBDb2xsYXBzZWQoXCJGaWxlIGNvbnRlbnRcIik7XHJcbiAgICDGki5EZWJ1Zy5pbmZvKGh0bWxDb250ZW50KTtcclxuICAgIMaSLkRlYnVnLmdyb3VwRW5kKCk7XHJcblxyXG4gICAgdW53YXRjaEZvbGRlcigpO1xyXG5cclxuICAgIHByb2plY3QgPSBuZXcgUHJvamVjdChfdXJsKTtcclxuICAgIGF3YWl0IHByb2plY3QubG9hZChodG1sQ29udGVudCk7XHJcblxyXG4gICAgd2F0Y2hGb2xkZXIoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHdhdGNoRm9sZGVyKCk6IHZvaWQge1xyXG4gICAgbGV0IGRpcjogVVJMID0gbmV3IFVSTChcIi5cIiwgcHJvamVjdC5iYXNlKTtcclxuICAgIHdhdGNoZXIgPSBmcy53YXRjaChkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0sIGhuZEZpbGVDaGFuZ2UpO1xyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGhuZEZpbGVDaGFuZ2UoX2V2ZW50OiBzdHJpbmcsIF9maWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlSW5kZXggfHwgX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZUludGVybmFsIHx8IF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVTY3JpcHQpIHtcclxuICAgICAgICB1bndhdGNoRm9sZGVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQobnVsbCwgZmFsc2UsIFwiSW1wb3J0YW50IGZpbGUgY2hhbmdlXCIsIFwiUmVsb2FkIHByb2plY3Q/XCIsIFwiUmVsb2FkXCIsIFwiQ2FuY2VsXCIpO1xyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICBhd2FpdCBsb2FkUHJvamVjdChwcm9qZWN0LmJhc2UpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgd2F0Y2hlciA9IGZzLndhdGNoKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSwgaG5kRmlsZUNoYW5nZSk7XHJcbiAgICAgIH1cclxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVud2F0Y2hGb2xkZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXdhdGNoZXIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHdhdGNoZXIudW5yZWYoKTtcclxuICAgIHdhdGNoZXIuY2xvc2UoKTtcclxuICB9XHJcbn1cclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgdHlwZXM9XCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24vRWxlY3Ryb25cIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIkRlZmluaXRpb24udHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvLyBpbXBvcnQgxpJhaWQgPSBGdWRnZUFpZDtcclxuICAvLyBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGlwY1JlbmRlcmVyOiBFbGVjdHJvbi5JcGNSZW5kZXJlciA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKS5pcGNSZW5kZXJlcjsgLy8gUmVwbGFjZSB3aXRoOlxyXG4gIGV4cG9ydCBjb25zdCByZW1vdGU6IHR5cGVvZiBpbXBvcnQoXCJAZWxlY3Ryb24vcmVtb3RlXCIpID0gcmVxdWlyZShcIkBlbGVjdHJvbi9yZW1vdGVcIik7XHJcblxyXG4gIGV4cG9ydCBsZXQgcHJvamVjdDogUHJvamVjdDsgLy8gPSBuZXcgUHJvamVjdCgpO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdXBwZXJtb3N0IGNvbnRhaW5lciBmb3IgYWxsIHBhbmVscyBjb250cm9sbGluZyBkYXRhIGZsb3cgYmV0d2Vlbi4gXHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhZ2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBnb2xkZW5MYXlvdXRNb2R1bGU6IMaSLkdlbmVyYWwgPSAoZ2xvYmFsVGhpcyBhcyDGki5HZW5lcmFsKS5nb2xkZW5MYXlvdXQ7ICAvLyDGki5HZW5lcmFsIGlzIHN5bm9ueW0gZm9yIGFueS4uLiBoYWNrIHRvIGdldCBHb2xkZW5MYXlvdXQgdG8gd29ya1xyXG4gICAgcHVibGljIHN0YXRpYyBtb2RlVHJhbnNmb3JtOiBUUkFOU0ZPUk0gPSBUUkFOU0ZPUk0uVFJBTlNMQVRFO1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ29sZGVuTGF5b3V0OiBHb2xkZW5MYXlvdXQ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwYW5lbHM6IFBhbmVsW10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhdGljIHBoeXNpY3M6IHsgW2lkR3JhcGg6IHN0cmluZ106IMaSLlBoeXNpY3MgfSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdFByb2plY3QoKTogdm9pZCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU2V0IGRlZmF1bHQgcHJvamVjdCBpbiBsb2NhbCBzdG9yYWdlXCIsIHByb2plY3QpO1xyXG4gICAgICBpZiAocHJvamVjdClcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2plY3RcIiwgcHJvamVjdC5iYXNlLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TGF5b3V0KCk6IFJlc29sdmVkTGF5b3V0Q29uZmlnIHtcclxuICAgICAgcmV0dXJuIFBhZ2UuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRMYXlvdXQoX2xheW91dD86IExheW91dENvbmZpZyk6IHZvaWQge1xyXG4gICAgICBfbGF5b3V0ID8/PSB7XHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICBwb3BvdXQ6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290OiB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgaXNDbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICBjb250ZW50OiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmxvYWRMYXlvdXQoX2xheW91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRUcmFuc2Zvcm0oX21vZGU6IFRSQU5TRk9STSk6IHZvaWQge1xyXG4gICAgICBQYWdlLm1vZGVUcmFuc2Zvcm0gPSBfbW9kZTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYFRyYW5zZm9ybSBtb2RlOiAke19tb2RlfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGh5c2ljcyhfZ3JhcGg6IMaSLkdyYXBoKTogxpIuUGh5c2ljcyB7XHJcbiAgICAgIHJldHVybiBQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdIHx8IChQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdID0gbmV3IMaSLlBoeXNpY3MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsbGVkIGJ5IHdpbmRvd3MgbG9hZC1saXN0ZW5lclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIC8vIMaSLkRlYnVnLnNldEZpbHRlcijGki5EZWJ1Z0NvbnNvbGUsIMaSLkRFQlVHX0ZJTFRFUi5BTEwgfCDGki5ERUJVR19GSUxURVIuU09VUkNFKTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWxTdG9yYWdlXCIsIGxvY2FsU3RvcmFnZSk7XHJcblxyXG4gICAgICBQYWdlLnNldHVwR29sZGVuTGF5b3V0KCk7XHJcbiAgICAgIMaSLlByb2plY3QubW9kZSA9IMaSLk1PREUuRURJVE9SO1xyXG5cclxuICAgICAgUGFnZS5zZXR1cE1haW5MaXN0ZW5lcnMoKTtcclxuICAgICAgUGFnZS5zZXR1cFBhZ2VMaXN0ZW5lcnMoKTtcclxuICAgICAgLy8gZm9yIHRlc3Rpbmc6XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4pO1xyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUEFORUxfR1JBUEhfT1BFTik7XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QUk9KRUNUX0xPQUQpO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9IRUxQX09QRU4sIG9uOiB0cnVlIH0pO1xyXG5cclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5wcm9qZWN0KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkIHByb2plY3QgcmVmZXJlbmNlZCBpbiBsb2NhbCBzdG9yYWdlXCIsIGxvY2FsU3RvcmFnZS5wcm9qZWN0KTtcclxuICAgICAgICBhd2FpdCBQYWdlLmxvYWRQcm9qZWN0KG5ldyBVUkwobG9jYWxTdG9yYWdlLnByb2plY3QpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwR29sZGVuTGF5b3V0KCk6IHZvaWQge1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dCA9IG5ldyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Hb2xkZW5MYXlvdXQoKTsgLy8gR29sZGVuTGF5b3V0IDIgYXMgVU1ELU1vZHVsZVxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5vbihcIml0ZW1DcmVhdGVkXCIsIFBhZ2UuaG5kUGFuZWxDcmVhdGVkKTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuUFJPSkVDVCwgUGFuZWxQcm9qZWN0KTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5HUkFQSCwgUGFuZWxHcmFwaCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuSEVMUCwgUGFuZWxIZWxwKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5BTklNQVRJT04sIFBhbmVsQW5pbWF0aW9uKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5QQVJUSUNMRV9TWVNURU0sIFBhbmVsUGFydGljbGVTeXN0ZW0pO1xyXG5cclxuICAgICAgUGFnZS5sb2FkTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkKF9wYW5lbDogdHlwZW9mIFBhbmVsLCBfc3RhdGU/OiBKc29uVmFsdWUpOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGFuZWxDb25maWc6IENvbXBvbmVudEl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICBjb21wb25lbnRUeXBlOiBfcGFuZWwubmFtZSxcclxuICAgICAgICBjb21wb25lbnRTdGF0ZTogX3N0YXRlLFxyXG4gICAgICAgIHRpdGxlOiBcIlBhbmVsXCIsXHJcbiAgICAgICAgaWQ6IFBhZ2UuZ2VuZXJhdGVJRChfcGFuZWwubmFtZSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIGlmICghUGFnZS5nb2xkZW5MYXlvdXQucm9vdEl0ZW0pICAvLyB3b3JrYXJvdW5kIGJlY2F1c2UgZ29sZGVuIExheW91dCBsb3NlcyByb290SXRlbS4uLlxyXG4gICAgICAvLyAgIFBhZ2UubG9hZExheW91dCgpOyAvLyBUT0RPOiB0aGVzZSB0d28gbGluZXMgYXBwZWFyIHRvIGJlIG9ic29sZXRlLCB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXRcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmFkZEl0ZW1BdExvY2F0aW9uKHBhbmVsQ29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmluZChfdHlwZTogdHlwZW9mIFBhbmVsKTogUGFuZWxbXSB7XHJcbiAgICAgIGxldCByZXN1bHQ6IFBhbmVsW10gPSBbXTtcclxuICAgICAgcmVzdWx0ID0gUGFnZS5wYW5lbHMuZmlsdGVyKF9wYW5lbCA9PiBfcGFuZWwgaW5zdGFuY2VvZiBfdHlwZSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVJRChfbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgIHdoaWxlICh0aGlzLmdvbGRlbkxheW91dC5maW5kRmlyc3RDb21wb25lbnRJdGVtQnlJZChfbmFtZSArIGkpKVxyXG4gICAgICAgIGkrKztcclxuICAgICAgcmV0dXJuIF9uYW1lICsgaTsgLy8gX25hbWUgKyBQYWdlLmlkQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQYWdlLUV2ZW50cyBmcm9tIERPTVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBQYWdlTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBQYWdlLmhuZEtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmQgY3VzdG9tIGNvcGllcyBvZiB0aGUgZ2l2ZW4gZXZlbnQgdG8gdGhlIHBhbmVscyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJvYWRjYXN0KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBsZXQgc2VuZGVyOiBQYW5lbCB8IFBhZ2UgPSBkZXRhaWw/LnNlbmRlcjtcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IFBhZ2U7XHJcbiAgICAgIGZvciAobGV0IHBhbmVsIG9mIFBhZ2UucGFuZWxzKSB7XHJcbiAgICAgICAgaWYgKHBhbmVsICE9IHNlbmRlcikgLy8gZG9uJ3Qgc2VuZCBiYWNrIHRvIG9yaWdpbmFsIHNlbmRlclxyXG4gICAgICAgICAgcGFuZWwuZGlzcGF0Y2goPEVWRU5UX0VESVRPUj5fZXZlbnQudHlwZSwgeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlQ6XHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShUUkFOU0ZPUk0uVFJBTlNMQVRFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5SOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlJPVEFURSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRTpcclxuICAgICAgICAgIC8vIFRPRE86IGRvbid0IHN3aXRjaCB0byBzY2FsZSBtb2RlIHdoZW4gdXNpbmcgZmx5LWNhbWVyYSBhbmQgcHJlc3NpbmcgRVxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlNDQUxFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEV2ZW50KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgbGV0IHZpZXc6IFZpZXcgPSBfZXZlbnQuZGV0YWlsLnZpZXc7XHJcbiAgICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIFBhbmVsKVxyXG4gICAgICAgICAgICBQYWdlLnBhbmVscy5zcGxpY2UoUGFnZS5wYW5lbHMuaW5kZXhPZih2aWV3KSwgMSk7XHJcblxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbG9zZWRcIiwgdmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgUGFnZS5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRQYW5lbENyZWF0ZWQgPSAoX2V2ZW50OiBFdmVudEVtaXR0ZXIuQnViYmxpbmdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDb21wb25lbnRJdGVtID0gX2V2ZW50LnRhcmdldCBhcyBDb21wb25lbnRJdGVtO1xyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuQ29tcG9uZW50SXRlbSkge1xyXG4gICAgICAgIFBhZ2UucGFuZWxzLnB1c2goPFBhbmVsPnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBhd2FpdCBsb2FkUHJvamVjdChfdXJsKTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gTWFpbi1FdmVudHMgZnJvbSBFbGVjdHJvblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBNYWluTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTkVXLCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgxpIuUHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgIGF3YWl0IG5ld1Byb2plY3QoKTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9BTklNQVRJT05fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX1NBVkUsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBpZiAoYXdhaXQgc2F2ZVByb2plY3QoKSlcclxuICAgICAgICAgIFBhZ2Uuc2V0RGVmYXVsdFByb2plY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTE9BRCwgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIGxldCB1cmw6IFVSTCA9IGF3YWl0IHByb21wdExvYWRQcm9qZWN0KCk7XHJcbiAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgYXdhaXQgUGFnZS5sb2FkUHJvamVjdCh1cmwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfR1JBUEhfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsR3JhcGgsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxQcm9qZWN0LCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0hFTFBfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsSGVscCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5RVUlULCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5zZXREZWZhdWx0UHJvamVjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEFuaW1hdGlvbiwgbnVsbCk7XHJcbiAgICAgICAgLy8gbGV0IHBhbmVsOiBQYW5lbCA9IFBhbmVsTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVQYW5lbEZyb21UZW1wbGF0ZShuZXcgVmlld0FuaW1hdGlvblRlbXBsYXRlKCksIFwiQW5pbWF0aW9uIFBhbmVsXCIpO1xyXG4gICAgICAgIC8vIFBhbmVsTWFuYWdlci5pbnN0YW5jZS5hZGRQYW5lbChwYW5lbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsUGFydGljbGVTeXN0ZW0sIG51bGwpO1xyXG4gICAgICAgIC8vIGxldCBwYW5lbDogUGFuZWwgPSBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlUGFuZWxGcm9tVGVtcGxhdGUobmV3IFZpZXdBbmltYXRpb25UZW1wbGF0ZSgpLCBcIkFuaW1hdGlvbiBQYW5lbFwiKTtcclxuICAgICAgICAvLyBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuYWRkUGFuZWwocGFuZWwpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZ1bmN0aW9uIHdlbGNvbWUoY29udGFpbmVyOiBHb2xkZW5MYXlvdXQuQ29udGFpbmVyLCBzdGF0ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgLy8gICBjb250YWluZXIuZ2V0RWxlbWVudCgpLmh0bWwoXCI8ZGl2PldlbGNvbWU8L2Rpdj5cIik7XHJcbiAgLy8gfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIMaSLlNlcmlhbGl6ZXIucmVnaXN0ZXJOYW1lc3BhY2UoRnVkZ2UpO1xyXG5cclxuICBleHBvcnQgY2xhc3MgUHJvamVjdCBleHRlbmRzIMaSLk11dGFibGUgeyAvLyBUT0RPOiByZXBsYWNlIHdpdGggc2VyaWxpemFibGVcclxuICAgIC8vIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJOZXdQcm9qZWN0XCI7XHJcbiAgICBwdWJsaWMgYmFzZTogVVJMO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgZmlsZUluZGV4OiBzdHJpbmcgPSBcImluZGV4Lmh0bWxcIjtcclxuICAgIHB1YmxpYyBmaWxlSW50ZXJuYWw6IHN0cmluZyA9IFwiSW50ZXJuYWwuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVJbnRlcm5hbEZvbGRlcjogc3RyaW5nID0gXCJJbnRlcm5hbEZvbGRlci5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNjcmlwdDogc3RyaW5nID0gXCJTY3JpcHQvQnVpbGQvU2NyaXB0LmpzXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNldHRpbmdzOiBzdHJpbmcgPSBcInNldHRpbmdzLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlU3R5bGVzOiBzdHJpbmcgPSBcInN0eWxlcy5jc3NcIjtcclxuXHJcbiAgICBwcml2YXRlIGdyYXBoQXV0b1ZpZXc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyBwcml2YXRlIGluY2x1ZGVBdXRvVmlld1NjcmlwdDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgI3Jlc291cmNlRm9sZGVyOiBSZXNvdXJjZUZvbGRlcjtcclxuICAgICNkb2N1bWVudDogRG9jdW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9iYXNlOiBVUkwpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5iYXNlID0gX2Jhc2U7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9iYXNlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpLnNsaWNlKC0yLCAtMSlbMF07XHJcbiAgICAgIHRoaXMuZmlsZUluZGV4ID0gX2Jhc2UudG9TdHJpbmcoKS5zcGxpdChcIi9cIikucG9wKCkgfHwgdGhpcy5maWxlSW5kZXg7XHJcblxyXG4gICAgICDGki5Qcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgIMaSLlByb2plY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5HUkFQSF9NVVRBVEVELFxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIChfZXZlbnQ6IEV2ZW50KSA9PiBQYWdlLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlVQREFURSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZXNvdXJjZUZvbGRlcigpOiBSZXNvdXJjZUZvbGRlciB7XHJcbiAgICAgIGlmICghdGhpcy4jcmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSBuZXcgUmVzb3VyY2VGb2xkZXIoXCJSZXNvdXJjZXNcIik7XHJcbiAgICAgIHJldHVybiB0aGlzLiNyZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQocHJvamVjdCwgZmFsc2UsIFwiUmV2aWV3IHByb2plY3Qgc2V0dGluZ3NcIiwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICDGknVpLkRpYWxvZy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgbG9hZChfaHRtbENvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gbmV3IMaSLlBoeXNpY3MoKTtcclxuICAgICAgY29uc3QgcGFyc2VyOiBET01QYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgIHRoaXMuI2RvY3VtZW50ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhfaHRtbENvbnRlbnQsIFwidGV4dC9odG1sXCIpO1xyXG4gICAgICBjb25zdCBoZWFkOiBIVE1MSGVhZEVsZW1lbnQgPSB0aGlzLiNkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKTtcclxuXHJcbiAgICAgIHRoaXMubG9hZEZvbnRzKGhlYWQpO1xyXG5cclxuICAgICAgY29uc3Qgc2NyaXB0czogTm9kZUxpc3RPZjxIVE1MU2NyaXB0RWxlbWVudD4gPSBoZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzY3JpcHRcIik7XHJcbiAgICAgIGZvciAobGV0IHNjcmlwdCBvZiBzY3JpcHRzKSB7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJlZGl0b3JcIikgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIkxvYWQgc2NyaXB0OiBcIiwgdXJsKTtcclxuICAgICAgICAgIGF3YWl0IMaSLlByb2plY3QubG9hZFNjcmlwdChuZXcgVVJMKHVybCwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcG9uZW50U2NyaXB0c1wiLCDGki5Qcm9qZWN0LmdldENvbXBvbmVudFNjcmlwdHMoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjcmlwdCBOYW1lc3BhY2VzXCIsIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXNvdXJjZUxpbms6IEhUTUxMaW5rRWxlbWVudCA9IGhlYWQucXVlcnlTZWxlY3RvcihcImxpbmtbdHlwZT1yZXNvdXJjZXNdXCIpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VGaWxlOiBzdHJpbmcgPSByZXNvdXJjZUxpbmsuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xyXG4gICAgICBwcm9qZWN0LmZpbGVJbnRlcm5hbCA9IHJlc291cmNlRmlsZTtcclxuICAgICAgxpIuUHJvamVjdC5iYXNlVVJMID0gdGhpcy5iYXNlO1xyXG4gICAgICBsZXQgcmVjb25zdHJ1Y3Rpb246IMaSLlJlc291cmNlcyA9IGF3YWl0IMaSLlByb2plY3QubG9hZFJlc291cmNlcyhuZXcgVVJMKHJlc291cmNlRmlsZSwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIMaSLkRlYnVnLmdyb3VwQ29sbGFwc2VkKFwiRGVzZXJpYWxpemVkXCIpO1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKHJlY29uc3RydWN0aW9uKTtcclxuICAgICAgxpIuRGVidWcuZ3JvdXBFbmQoKTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpOyAvLyByZW1vdmUgcG90ZW50aWFsIHJpZ2lkYm9kaWVzXHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc291cmNlRm9sZGVyQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlSW50ZXJuYWxGb2xkZXIsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCByZXNvdXJjZUZvbGRlcjogxpIuU2VyaWFsaXphYmxlID0gYXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZSjGki5TZXJpYWxpemVyLnBhcnNlKHJlc291cmNlRm9sZGVyQ29udGVudCkpO1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUZvbGRlciBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSByZXNvdXJjZUZvbGRlcjtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgRmFpbGVkIHRvIGxvYWQgJyR7dGhpcy5maWxlSW50ZXJuYWxGb2xkZXJ9Jy4gQSBuZXcgcmVzb3VyY2UgZm9sZGVyIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBzZXR0aW5nczogSFRNTE1ldGFFbGVtZW50ID0gaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKTtcclxuICAgICAgbGV0IHByb2plY3RTZXR0aW5nczogc3RyaW5nID0gc2V0dGluZ3M/LmdldEF0dHJpYnV0ZShcInByb2plY3RcIik7XHJcbiAgICAgIHByb2plY3RTZXR0aW5ncyA9IHByb2plY3RTZXR0aW5ncz8ucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XHJcbiAgICAgIGF3YWl0IHByb2plY3QubXV0YXRlKEpTT04ucGFyc2UocHJvamVjdFNldHRpbmdzIHx8IFwie31cIikpO1xyXG5cclxuICAgICAgbGV0IGNvbmZpZzogTGF5b3V0Q29uZmlnO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlU2V0dGluZ3MsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCBwYW5lbFNldHRpbmdzOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5wYXJzZShzZXR0aW5nc0NvbnRlbnQpO1xyXG4gICAgICAgIGNvbmZpZyA9IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQocGFuZWxTZXR0aW5ncy5sYXlvdXQpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy53YXJuKGBGYWlsZWQgdG8gbG9hZCAnJHt0aGlzLmZpbGVTZXR0aW5nc30nLiBBIG5ldyBzZXR0aW5ncyBmaWxlIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFBhZ2UubG9hZExheW91dChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IGpzb246IHN0cmluZyA9IMaSLlNlcmlhbGl6ZXIuc3RyaW5naWZ5KHNlcmlhbGl6YXRpb24pO1xyXG4gICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeSjGki5TZXJpYWxpemVyLnNlcmlhbGl6ZSh0aGlzLnJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNldHRpbmdzSlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2V0dGluZ3M6IMaSLlNlcmlhbGl6YXRpb24gPSB7fTtcclxuICAgICAgc2V0dGluZ3MubGF5b3V0ID0gUGFnZS5nZXRMYXlvdXQoKTtcclxuXHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeShzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByb2plY3RDU1MoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICBjb250ZW50ICs9IFwiaHRtbCwgYm9keSB7XFxuICBwYWRkaW5nOiAwcHg7XFxuICBtYXJnaW46IDBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG5cIjtcclxuICAgICAgY29udGVudCArPSBcImRpYWxvZyB7IFxcbiAgdGV4dC1hbGlnbjogY2VudGVyOyBcXG59XFxuXFxuXCI7XHJcbiAgICAgIGNvbnRlbnQgKz0gXCJjYW52YXMuZnVsbHNjcmVlbiB7IFxcbiAgd2lkdGg6IDEwMHZ3OyBcXG4gIGhlaWdodDogMTAwdmg7IFxcbn1cIjtcclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SFRNTChfdGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGlmICghdGhpcy4jZG9jdW1lbnQpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvamVjdEhUTUwoX3RpdGxlKTtcclxuXHJcbiAgICAgIHRoaXMuI2RvY3VtZW50LnRpdGxlID0gX3RpdGxlO1xyXG5cclxuICAgICAgbGV0IHNldHRpbmdzOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwic2V0dGluZ3NcIik7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcImF1dG92aWV3XCIsIHRoaXMuZ3JhcGhBdXRvVmlldyk7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcInByb2plY3RcIiwgdGhpcy5zZXR0aW5nc1N0cmluZ2lmeSgpKTtcclxuICAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKS5yZXBsYWNlV2l0aChzZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBsZXQgYXV0b1ZpZXdTY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gdGhpcy4jZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNjcmlwdFtuYW1lPWF1dG9WaWV3XVwiKTtcclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KSB7XHJcbiAgICAgIC8vICAgaWYgKCFhdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICAgIHRoaXMuI2RvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5nZXRBdXRvVmlld1NjcmlwdCgpKTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBlbHNlXHJcbiAgICAgIC8vICAgaWYgKGF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChhdXRvVmlld1NjcmlwdCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlIVE1MKHRoaXMuI2RvY3VtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzIHtcclxuICAgICAgbGV0IHR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBzdXBlci5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMoX211dGF0b3IpO1xyXG4gICAgICBpZiAodHlwZXMuZ3JhcGhBdXRvVmlldylcclxuICAgICAgICB0eXBlcy5ncmFwaEF1dG9WaWV3ID0gdGhpcy5nZXRHcmFwaHMoKTtcclxuICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWR1Y2VNdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5iYXNlO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUluZGV4O1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsRm9sZGVyO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZVNjcmlwdDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTZXR0aW5ncztcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTdHlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRHcmFwaHMoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IGdyYXBoczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IMaSLlByb2plY3QuZ2V0UmVzb3VyY2VzQnlUeXBlKMaSLkdyYXBoKTtcclxuICAgICAgbGV0IHJlc3VsdDogT2JqZWN0ID0ge307XHJcbiAgICAgIGZvciAobGV0IGdyYXBoIG9mIGdyYXBocykge1xyXG4gICAgICAgIHJlc3VsdFtncmFwaC5uYW1lXSA9IGdyYXBoLmlkUmVzb3VyY2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb2plY3RIVE1MKF90aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGh0bWw6IERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KF90aXRsZSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7IGNoYXJzZXQ6IFwidXRmLThcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgcmVsOiBcInN0eWxlc2hlZXRcIiwgaHJlZjogdGhpcy5maWxlU3R5bGVzIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkVkaXRvciBzZXR0aW5ncyBvZiB0aGlzIHByb2plY3RcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7XHJcbiAgICAgICAgdHlwZTogXCJzZXR0aW5nc1wiLCBhdXRvdmlldzogdGhpcy5ncmFwaEF1dG9WaWV3LCBwcm9qZWN0OiB0aGlzLnNldHRpbmdzU3RyaW5naWZ5KClcclxuICAgICAgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQWN0aXZhdGUgdGhlIGZvbGxvd2luZyBsaW5lIHRvIGluY2x1ZGUgdGhlIEZVREdFLXZlcnNpb24gb2YgT2ltby1QaHlzaWNzLiBZb3UgbWF5IHdhbnQgdG8gZG93bmxvYWQgYSBsb2NhbCBjb3B5IHRvIHdvcmsgb2ZmbGluZSBhbmQgYmUgaW5kZXBlbmRlbnQgZnJvbSBmdXR1cmUgY2hhbmdlcyFcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KGA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9PaW1vUGh5c2ljcy5qc1wiPjwvc2NyaXB0PmApKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgRlVER0UuIFlvdSBtYXkgd2FudCB0byBkb3dubG9hZCBsb2NhbCBjb3BpZXMgdG8gd29yayBvZmZsaW5lIGFuZCBiZSBpbmRlcGVuZGVudCBmcm9tIGZ1dHVyZSBjaGFuZ2VzISBEZXZlbG9wZXJzIHdvcmtpbmcgb24gRlVER0UgaXRzZWxmIG1heSB3YW50IHRvIGNyZWF0ZSBzeW1saW5rc1wiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQWlkLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTGluayBpbnRlcm5hbCByZXNvdXJjZXMuIFRoZSBlZGl0b3Igb25seSBsb2FkcyB0aGUgZmlyc3QsIGJ1dCBhdCBydW50aW1lLCBtdWx0aXBsZSBmaWxlcyBjYW4gY29udHJpYnV0ZVwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgdHlwZTogXCJyZXNvdXJjZXNcIiwgc3JjOiB0aGlzLmZpbGVJbnRlcm5hbCB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIGN1c3RvbSBzY3JpcHRzXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogdGhpcy5maWxlU2NyaXB0LCBlZGl0b3I6IFwidHJ1ZVwiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLmdldEF1dG9WaWV3U2NyaXB0KCkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBBdXRvdmlldyBzY3JpcHRcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcIkF1dG92aWV3LmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiRGlhbG9nIHNob3duIGF0IHN0YXJ0dXAgb25seVwiKSk7XHJcbiAgICAgIGxldCBkaWFsb2c6IEhUTUxFbGVtZW50ID0gY3JlYXRlVGFnKFwiZGlhbG9nXCIpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJGVURHRSBBdXRvdmlld1wiKSk7XHJcbiAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJoMVwiLCB7fSwgXCJUaXRsZSAod2lsbCBiZSByZXBsYWNlZCBieSBBdXRvdmlldylcIikpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJjbGljayB0byBzdGFydFwiKSk7XHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChkaWFsb2cpO1xyXG5cclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNhbnZhcyBmb3IgRlVER0UgdG8gcmVuZGVyIHRvXCIpKTtcclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImNhbnZhc1wiLCB7IGNsYXNzOiBcImZ1bGxzY3JlZW5cIiB9KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVUYWcoX3RhZzogc3RyaW5nLCBfYXR0cmlidXRlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9LCBfY29udGVudD86IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KF90YWcpO1xyXG4gICAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBpbiBfYXR0cmlidXRlcylcclxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgX2F0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XHJcbiAgICAgICAgaWYgKF9jb250ZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBfY29udGVudDtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5SFRNTChodG1sKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGdldEF1dG9WaWV3U2NyaXB0KCk6IEhUTUxTY3JpcHRFbGVtZW50IHtcclxuICAgIC8vICAgbGV0IGNvZGU6IHN0cmluZztcclxuICAgIC8vICAgY29kZSA9IChmdW5jdGlvbiAoX2dyYXBoSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gICAgIC8qKlxyXG4gICAgLy8gICAgICAqIEF1dG9WaWV3LVNjcmlwdFxyXG4gICAgLy8gICAgICAqIExvYWRzIGFuZCBkaXNwbGF5cyB0aGUgc2VsZWN0ZWQgZ3JhcGggYW5kIGltcGxlbWVudHMgYSBiYXNpYyBvcmJpdCBjYW1lcmFcclxuICAgIC8vICAgICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIxXHJcbiAgICAvLyAgICAgICovXHJcblxyXG4gICAgLy8gICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBpbml0KTtcclxuXHJcbiAgICAvLyAgICAgLy8gc2hvdyBkaWFsb2cgZm9yIHN0YXJ0dXBcclxuICAgIC8vICAgICBsZXQgZGlhbG9nOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8vICAgICBmdW5jdGlvbiBpbml0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgICAgIGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaWFsb2dcIik7XHJcbiAgICAvLyAgICAgICBkaWFsb2cucXVlcnlTZWxlY3RvcihcImgxXCIpLnRleHRDb250ZW50ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAvLyAgICAgICBkaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgICAgICAgIC8vIEB0cy1pZ24gcmUgdW50aWwgSFRNTERpYWxvZyBpcyBpbXBsZW1lbnRlZCBieSBhbGwgYnJvd3NlcnMgYW5kIGF2YWlsYWJsZSBpbiBkb20uZC50c1xyXG4gICAgLy8gICAgICAgICBkaWFsb2cuY2xvc2UoKTtcclxuICAgIC8vICAgICAgICAgc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB9KTtcclxuICAgIC8vICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgLy8gICAgICAgZGlhbG9nLnNob3dNb2RhbCgpO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IGludGVyYWN0aXZlIHZpZXdwb3J0XHJcbiAgICAvLyAgICAgYXN5bmMgZnVuY3Rpb24gc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gICAgICAgLy8gbG9hZCByZXNvdXJjZXMgcmVmZXJlbmNlZCBpbiB0aGUgbGluay10YWdcclxuICAgIC8vICAgICAgIGF3YWl0IEZ1ZGdlQ29yZS5Qcm9qZWN0LmxvYWRSZXNvdXJjZXNGcm9tSFRNTCgpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlByb2plY3Q6XCIsIEZ1ZGdlQ29yZS5Qcm9qZWN0LnJlc291cmNlcyk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gcGljayB0aGUgZ3JhcGggdG8gc2hvd1xyXG4gICAgLy8gICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IDzGki5HcmFwaD5GdWRnZUNvcmUuUHJvamVjdC5yZXNvdXJjZXNbX2dyYXBoSWRdO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIkdyYXBoOlwiLCBncmFwaCk7XHJcbiAgICAvLyAgICAgICBpZiAoIWdyYXBoKSB7XHJcbiAgICAvLyAgICAgICAgIGFsZXJ0KFwiTm90aGluZyB0byByZW5kZXIuIENyZWF0ZSBhIGdyYXBoIHdpdGggYXQgbGVhc3QgYSBtZXNoLCBtYXRlcmlhbCBhbmQgcHJvYmFibHkgc29tZSBsaWdodFwiKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIHRoZSB2aWV3cG9ydFxyXG4gICAgLy8gICAgICAgbGV0IGNtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gbmV3IEZ1ZGdlQ29yZS5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgIC8vICAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImNhbnZhc1wiKTtcclxuICAgIC8vICAgICAgIGxldCB2aWV3cG9ydDogxpIuVmlld3BvcnQgPSBuZXcgRnVkZ2VDb3JlLlZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5pbml0aWFsaXplKFwiSW50ZXJhY3RpdmVWaWV3cG9ydFwiLCBncmFwaCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlZpZXdwb3J0OlwiLCB2aWV3cG9ydCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gaGlkZSB0aGUgY3Vyc29yIHdoZW4gaW50ZXJhY3RpbmcsIGFsc28gc3VwcHJlc3NpbmcgcmlnaHQtY2xpY2sgbWVudVxyXG4gICAgLy8gICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jayk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24gKCk6IHZvaWQgeyBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTsgfSk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gbWFrZSB0aGUgY2FtZXJhIGludGVyYWN0aXZlIChjb21wbGV4IG1ldGhvZCBpbiBGdWRnZUFpZClcclxuICAgIC8vICAgICAgIGxldCBjYW1lcmFPcmJpdDogRnVkZ2VBaWQuQ2FtZXJhT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodmlld3BvcnQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIGF1ZGlvXHJcbiAgICAvLyAgICAgICBsZXQgY21wTGlzdGVuZXI6IMaSLkNvbXBvbmVudEF1ZGlvTGlzdGVuZXIgPSBuZXcgxpIuQ29tcG9uZW50QXVkaW9MaXN0ZW5lcigpO1xyXG4gICAgLy8gICAgICAgY21wQ2FtZXJhLm5vZGUuYWRkQ29tcG9uZW50KGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5XaXRoKGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5UbyhncmFwaCk7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiQXVkaW86XCIsIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gZHJhdyB2aWV3cG9ydCBvbmNlIGZvciBpbW1lZGlhdGUgZmVlZGJhY2tcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5SZW5kZXIucHJlcGFyZShjYW1lcmFPcmJpdCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJpbnRlcmFjdGl2ZVZpZXdwb3J0U3RhcnRlZFwiLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdmlld3BvcnQgfSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfSkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAvLyAgIGNvZGUgPSBcIihcIiArIGNvZGUgKyBgKShkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW2F1dG9WaWV3XVwiKS5nZXRBdHRyaWJ1dGUoXCJhdXRvVmlld1wiKSk7XFxuYDtcclxuICAgIC8vICAgbGV0IHNjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgLy8gICBzY3JpcHQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImF1dG9WaWV3XCIpO1xyXG4gICAgLy8gICBzY3JpcHQudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgLy8gICByZXR1cm4gc2NyaXB0O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dGluZ3NTdHJpbmdpZnkoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBwcm9qZWN0LmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICAgIGxldCBzZXR0aW5nczogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobXV0YXRvcik7XHJcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MucmVwbGFjZSgvXCIvZywgXCInXCIpO1xyXG4gICAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHJpbmdpZnlIVE1MKF9odG1sOiBEb2N1bWVudCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9IChuZXcgWE1MU2VyaWFsaXplcigpKS5zZXJpYWxpemVUb1N0cmluZyhfaHRtbCk7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8+PC9nLCBcIj5cXG48XCIpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvPCEtLUNSTEYtLT4vZywgXCJcIik7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cIj5cXG48XFwvc2NyaXB0L2csIGBcIj48L3NjcmlwdGApO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFxuKjxcXC9ib2R5Pi9nLCBcIlxcbjxcXC9ib2R5PlwiKTsgLy8gcmVtb3ZlIGxpbmUgYnJlYWtzIGFkZGVkIGJ5IHNlcmlhbGl6ZVRvU3RyaW5nIGJlZm9yZSBjbG9zaW5nIGJvZHktdGFnXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkRm9udHMoX2hlYWQ6IEhUTUxIZWFkRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAvLyBjb2xsZWN0IGFsbCBmb250cyBmcm9tIF9oZWFkIGFuZCBhZGQgdGhlbSB0byB0aGUgaGVhZCBvZiB0aGUgZWRpdG9ycyBkb2N1bWVudCBzbyB0aGF0IHRoZXkgYXJlIGF2YWlsYWJsZSBmb3IgY29tcG9uZW50IHRleHRcclxuICAgICAgY29uc3QgZm9udHM6IEhUTUxTdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICBjb25zdCBjc3NMaW5rczogTm9kZUxpc3RPZjxIVE1MTGlua0VsZW1lbnQ+ID0gX2hlYWQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyk7XHJcbiAgICAgIGNvbnN0IGNzc1N0eWxlczogTm9kZUxpc3RPZjxIVE1MU3R5bGVFbGVtZW50PiA9IF9oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJyk7XHJcbiAgICAgIGNvbnN0IGNzc1J1bGVzOiBDU1NSdWxlW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGxpbmsgb2YgY3NzTGlua3MpIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBuZXcgVVJMKGxpbmsuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSwgdGhpcy5iYXNlKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBjc3NUZXh0OiBzdHJpbmcgPSBhd2FpdCAoYXdhaXQgZmV0Y2godXJsKSkudGV4dCgpOyAvLyBUT0RPOiB1c2UgRmlsZUlPXHJcbiAgICAgICAgY3NzUnVsZXMucHVzaCguLi5nZXRSdWxlcyhjc3NUZXh0KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IHN0eWxlIG9mIGNzc1N0eWxlcylcclxuICAgICAgICBjc3NSdWxlcy5wdXNoKC4uLmdldFJ1bGVzKHN0eWxlLmlubmVySFRNTCkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgcnVsZSBvZiBjc3NSdWxlcylcclxuICAgICAgICBpZiAocnVsZSBpbnN0YW5jZW9mIENTU0ZvbnRGYWNlUnVsZSlcclxuICAgICAgICAgIGZvbnRzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUuY3NzVGV4dCkpO1xyXG5cclxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChmb250cyk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRSdWxlcyhfdGV4dDogc3RyaW5nKTogQ1NTUnVsZUxpc3Qge1xyXG4gICAgICAgIGxldCBzdHlsZVNoZWV0OiBDU1NTdHlsZVNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcclxuICAgICAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKF90ZXh0KTtcclxuICAgICAgICByZXR1cm4gc3R5bGVTaGVldC5jc3NSdWxlcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyQW5pbWF0aW9uIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBST1BFUlRZX0NPTE9SUzogc3RyaW5nW10gPSBbXHJcbiAgICAgIFwiUmVkXCIsXHJcbiAgICAgIFwiTGltZVwiLFxyXG4gICAgICBcIkJsdWVcIixcclxuICAgICAgXCJDeWFuXCIsXHJcbiAgICAgIFwiTWFnZW50YVwiLFxyXG4gICAgICBcIlllbGxvd1wiLFxyXG4gICAgICBcIlNhbG1vblwiLFxyXG4gICAgICBcIkxpZ2h0R3JlZW5cIixcclxuICAgICAgXCJDb3JuZmxvd2VyQmx1ZVwiXHJcbiAgICBdO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgdmlldzogVmlld0FuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2FuaW1hdGlvbjogxpIuQW5pbWF0aW9uLCBfZG9tOiBIVE1MRWxlbWVudCwgX3ZpZXc6IFZpZXdBbmltYXRpb24pIHtcclxuICAgICAgdGhpcy5hbmltYXRpb24gPSBfYW5pbWF0aW9uO1xyXG4gICAgICB0aGlzLmRvbSA9IF9kb207XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DTElDSywgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudmlldyA9IF92aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoX211dGF0b3I6IMaSLk11dGF0b3IsIF90aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb2xvckluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgICBsZXQga2V5U2VsZWN0ZWQ6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMudmlldy5rZXlTZWxlY3RlZDtcclxuXHJcbiAgICAgIHVwZGF0ZVJlY3Vyc2l2ZSh0aGlzLmRvbSwgX211dGF0b3IsIHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSwgX3RpbWUpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlUmVjdXJzaXZlKF9kb206IEhUTUxFbGVtZW50LCBfbXV0YXRvcjogxpIuTXV0YXRvciwgX2FuaW1hdGlvblN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU3RydWN0dXJlLCBfdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50OiDGknVpLkN1c3RvbUVsZW1lbnQgPSA8xpJ1aS5DdXN0b21FbGVtZW50PsaSdWkuQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbSwga2V5KTtcclxuICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gX211dGF0b3Jba2V5XTtcclxuICAgICAgICAgIGxldCBzdHJ1Y3R1cmVPclNlcXVlbmNlOiBPYmplY3QgPSBfYW5pbWF0aW9uU3RydWN0dXJlW2tleV07XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgJiYgc3RydWN0dXJlT3JTZXF1ZW5jZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSBzdHJ1Y3R1cmVPclNlcXVlbmNlLmZpbmRLZXkoX3RpbWUpO1xyXG4gICAgICAgICAgICBpZiAoa2V5KSB7Ly8ga2V5IGZvdW5kIGF0IGV4YWN0bHkgdGhlIGdpdmVuIHRpbWUsIHRha2UgaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBrZXkudmFsdWU7XHJcbiAgICAgICAgICAgICAgaWYgKGtleSA9PSBrZXlTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWNvbG9yLWFuaW1hdGlvbi1wcm9wZXJ0eVwiLCBnZXROZXh0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgUmVmbGVjdC5zZXQoZWxlbWVudCwgXCJhbmltYXRpb25TZXF1ZW5jZVwiLCBzdHJ1Y3R1cmVPclNlcXVlbmNlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVJlY3Vyc2l2ZShlbGVtZW50LCB2YWx1ZSwgPMaSLkFuaW1hdGlvblN0cnVjdHVyZT5zdHJ1Y3R1cmVPclNlcXVlbmNlLCBfdGltZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXROZXh0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgY29sb3I6IHN0cmluZyA9IENvbnRyb2xsZXJBbmltYXRpb24uUFJPUEVSVFlfQ09MT1JTW2NvbG9ySW5kZXhdO1xyXG4gICAgICAgIGNvbG9ySW5kZXggPSAoY29sb3JJbmRleCArIDEpICUgQ29udHJvbGxlckFuaW1hdGlvbi5QUk9QRVJUWV9DT0xPUlMubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG1vZGlmeSBvciBhZGQga2V5XHJcbiAgICBwdWJsaWMgdXBkYXRlU2VxdWVuY2UoX3RpbWU6IG51bWJlciwgX2VsZW1lbnQ6IMaSdWkuQ3VzdG9tRWxlbWVudCwgX2FkZDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSBSZWZsZWN0LmdldChfZWxlbWVudCwgXCJhbmltYXRpb25TZXF1ZW5jZVwiKTtcclxuICAgICAgaWYgKCFzZXF1ZW5jZSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGtleTogxpIuQW5pbWF0aW9uS2V5ID0gc2VxdWVuY2UuZmluZEtleShfdGltZSk7XHJcbiAgICAgIGlmICgha2V5KSB7XHJcbiAgICAgICAgaWYgKF9hZGQpIHtcclxuICAgICAgICAgIGtleSA9IG5ldyDGki5BbmltYXRpb25LZXkoX3RpbWUsIDxudW1iZXI+X2VsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICAgICAgc2VxdWVuY2UuYWRkS2V5KGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2VcclxuICAgICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCBudWxsLCA8bnVtYmVyPl9lbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IGtleSB9IH0pO1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbi5jYWxjdWxhdGVUb3RhbFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmV4dEtleShfdGltZTogbnVtYmVyLCBfZGlyZWN0aW9uOiBcImZvcndhcmRcIiB8IFwiYmFja3dhcmRcIik6IG51bWJlciB7XHJcbiAgICAgIGxldCBuZXh0S2V5OiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnNlcXVlbmNlc1xyXG4gICAgICAgIC5mbGF0TWFwKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkpXHJcbiAgICAgICAgLnNvcnQoX2RpcmVjdGlvbiA9PSBcImZvcndhcmRcIiAmJiAoKF9hLCBfYikgPT4gX2EudGltZSAtIF9iLnRpbWUpIHx8IF9kaXJlY3Rpb24gPT0gXCJiYWNrd2FyZFwiICYmICgoX2EsIF9iKSA9PiBfYi50aW1lIC0gX2EudGltZSkpXHJcbiAgICAgICAgLmZpbmQoX2tleSA9PiBfZGlyZWN0aW9uID09IFwiZm9yd2FyZFwiICYmIF9rZXkudGltZSA+IF90aW1lIHx8IF9kaXJlY3Rpb24gPT0gXCJiYWNrd2FyZFwiICYmIF9rZXkudGltZSA8IF90aW1lKTtcclxuICAgICAgaWYgKG5leHRLZXkpXHJcbiAgICAgICAgcmV0dXJuIG5leHRLZXkudGltZTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBfdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUHJvcGVydHkoX3BhdGg6IHN0cmluZ1tdLCBfbm9kZTogxpIuTm9kZSwgX3RpbWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RydWN0dXJlOiDGki5BbmltYXRpb25TZXF1ZW5jZSB8IMaSLkFuaW1hdGlvblN0cnVjdHVyZSA9IHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IF9wYXRoLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IF9wYXRoW2ldO1xyXG4gICAgICAgIGlmICghKGtleSBpbiBzdHJ1Y3R1cmUpKVxyXG4gICAgICAgICAgc3RydWN0dXJlW2tleV0gPSB7fTtcclxuICAgICAgICBzdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmVba2V5XTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gbmV3IMaSLkFuaW1hdGlvblNlcXVlbmNlKCk7XHJcbiAgICAgIHNlcXVlbmNlLmFkZEtleShuZXcgxpIuQW5pbWF0aW9uS2V5KF90aW1lLCAwKSk7XHJcbiAgICAgIHN0cnVjdHVyZVtfcGF0aFtfcGF0aC5sZW5ndGggLSAxXV0gPSBzZXF1ZW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUHJvcGVydHkoX2VsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5kb20uY29udGFpbnMoX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gX2VsZW1lbnQ7XHJcbiAgICAgIHdoaWxlIChlbGVtZW50ICE9PSB0aGlzLmRvbSkge1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICBwYXRoLnVuc2hpZnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG5cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGVsZXRlUGF0aChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdGVkU2VxdWVuY2VzKF9zZWxlY3RlZFByb3BlcnR5PzogSFRNTEVsZW1lbnQpOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdID0gW107XHJcbiAgICAgIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZSh0aGlzLmRvbSwgdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlLCBzZXF1ZW5jZXMsIF9zZWxlY3RlZFByb3BlcnR5ID09IG51bGwpO1xyXG4gICAgICByZXR1cm4gc2VxdWVuY2VzO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKF9kb206IEhUTUxFbGVtZW50LCBfYW5pbWF0aW9uU3RydWN0dXJlOiDGki5BbmltYXRpb25TdHJ1Y3R1cmUsIF9zZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdLCBfaXNTZWxlY3RlZERlc2NlbmRhbnQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfYW5pbWF0aW9uU3RydWN0dXJlKSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSDGknVpLkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb20sIGtleSk7XHJcbiAgICAgICAgICBsZXQgaXNTZWxlY3RlZERlc2NlbmRhbnQ6IGJvb2xlYW4gPSBfaXNTZWxlY3RlZERlc2NlbmRhbnQgfHwgZWxlbWVudCA9PSBfc2VsZWN0ZWRQcm9wZXJ0eTtcclxuICAgICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCBzZXF1ZW5jZTogT2JqZWN0ID0gX2FuaW1hdGlvblN0cnVjdHVyZVtrZXldO1xyXG4gICAgICAgICAgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UgJiYgaXNTZWxlY3RlZERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgX3NlcXVlbmNlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBjb2xvcjogZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1hbmltYXRpb24tcHJvcGVydHlcIiksXHJcbiAgICAgICAgICAgICAgZGF0YTogc2VxdWVuY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUoZWxlbWVudCwgPMaSLkFuaW1hdGlvblN0cnVjdHVyZT5fYW5pbWF0aW9uU3RydWN0dXJlW2tleV0sIF9zZXF1ZW5jZXMsIGlzU2VsZWN0ZWREZXNjZW5kYW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZVBhdGgoX3BhdGg6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgX3BhdGgubGVuZ3RoIC0gMTsgaSsrKVxyXG4gICAgICAgIHZhbHVlID0gdmFsdWVbX3BhdGhbaV1dO1xyXG4gICAgICBkZWxldGUgdmFsdWVbX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV1dO1xyXG5cclxuICAgICAgZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZSh0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZShfb2JqZWN0OiBPYmplY3QpOiBPYmplY3Qge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9vYmplY3QpIHtcclxuICAgICAgICAgIGlmIChfb2JqZWN0W2tleV0gaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKF9vYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBfb2JqZWN0W2tleV07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfb2JqZWN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfb2JqZWN0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuQ0xJQ0s6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgaWYgKCEoX2V2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fCAhdGhpcy5hbmltYXRpb24gfHwgX2V2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSBicmVhaztcclxuXHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IF9ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCB8fCB0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gdGhpcy5nZXRTZWxlY3RlZFNlcXVlbmNlcyh0YXJnZXQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGFyZ2V0ID09IHRoaXMuZG9tKVxyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRTZXF1ZW5jZXMoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5zZXF1ZW5jZXMgfSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdmlldydzIHN0YXRlLiBEdXJpbmcgcmVjb25zdHJ1Y3Rpb24sIHZpZXdzIHJlY2VpdmUgYSBtZXJnZWQgc3RhdGUgb2JqZWN0IHRoYXQgY29tYmluZXMgdGhlIHN0YXRlcyBvZiBib3RoIHRoZWlyIHBhbmVsIGFuZCB0aGUgdmlldyBpdHNlbGYuXHJcbiAgICogRW5zdXJlIHVuaXF1ZSBwcm9wZXJ0eSBuYW1lcyB0byBhdm9pZCBjb25mbGljdHMuXHJcbiAgICovXHJcbiAgZXhwb3J0IHR5cGUgVmlld1N0YXRlID0gxpIuU2VyaWFsaXphdGlvbjtcclxuXHJcbiAgdHlwZSBWaWV3cyA9IHsgW2lkOiBzdHJpbmddOiBWaWV3IH07XHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyBmb3IgYWxsIFtbVmlld11dcyB0byBzdXBwb3J0IGdlbmVyaWMgZnVuY3Rpb25hbGl0eVxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHZpZXdzOiBWaWV3cyA9IHt9O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudTogRWxlY3Ryb24uTWVudTtcclxuICAgICNjb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lcjtcclxuICAgICNpZDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHRoaXMuZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIC8vIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCI7XHJcbiAgICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZShcInZpZXdcIiwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuXHJcbiAgICAgIC8vX2NvbnRhaW5lci5nZXRFbGVtZW50KCkuYXBwZW5kKHRoaXMuZG9tKTsgLy9vbGRcclxuICAgICAgdGhpcy4jY29udGFpbmVyID0gX2NvbnRhaW5lcjtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuc3RhdGVSZXF1ZXN0RXZlbnQgPSB0aGlzLmdldFN0YXRlLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5vbihcImRlc3Ryb3lcIiwgKCkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBWaWV3LnZpZXdzW3RoaXMuI2lkXTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DTE9TRSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29udGV4dE1lbnVDYWxsYmFjayk7XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VUX1BST0pFQ1QsIHRoaXMuaG5kRXZlbnRDb21tb24pO1xyXG5cclxuICAgICAgdGhpcy4jaWQgPSBWaWV3LnJlZ2lzdGVyVmlld0ZvckRyYWdEcm9wKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Vmlld1NvdXJjZShfZXZlbnQ6IERyYWdFdmVudCk6IFZpZXcge1xyXG4gICAgICBpZiAoX2V2ZW50LmRhdGFUcmFuc2ZlcilcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9ldmVudC5kYXRhVHJhbnNmZXIuaXRlbXMpXHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlLnN0YXJ0c1dpdGgoXCJzb3VyY2V2aWV3XCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gVmlldy52aWV3c1tpdGVtLnR5cGUuc3BsaXQoXCI6XCIpLnBvcCgpXTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXJWaWV3Rm9yRHJhZ0Ryb3AoX3RoaXM6IFZpZXcpOiBudW1iZXIge1xyXG4gICAgICBWaWV3LnZpZXdzW1ZpZXcuaWRDb3VudF0gPSBfdGhpcztcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJhZyBzdGFydHMsIGFkZCBpZGVudGlmaWVyIHRvIHRoZSBldmVudCBpbiBhIHdheSB0aGF0IGFsbG93cyBkcmFnb3ZlciB0byBwcm9jZXNzIHRoZSBzb3VyZVxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfU1RBUlQsIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJTb3VyY2VWaWV3OlwiICsgX3RoaXMuI2lkLnRvU3RyaW5nKCksIFwidHlwZXNIYWNrXCIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJhZ2dpbmcgb3ZlciBhIHZpZXcsIGdldCB0aGUgb3JpZ2luYWwgc291cmNlIHZpZXcgZm9yIGRyYWdnaW5nIGFuZCBjYWxsIGhuZERyYWdPdmVyXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19PVkVSLCAoX2V2ZW50OiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuICAgICAgICBfdGhpcy5obmREcmFnT3ZlcihfZXZlbnQsIHZpZXdTb3VyY2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYWcgb3ZlciBkdXJpbmcgY2FwdHVyZSBwaGFzZSwgYWxsb3dzIHZpZXdzIHRvIHByZXZlbnQgZXZlbnQgcmVhY2hpbmcgdGhlIGFjdHVhbCB0YXJnZXRcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX09WRVIsIF9ldmVudCA9PiBfdGhpcy5obmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50LCBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSksIHRydWUpO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcm9wcGluZyBpbnRvIGEgdmlldywgZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgdmlldyBmb3IgZHJhZ2dpbmcgYW5kIGNhbGwgaG5kRHJvcFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICDGknVpLkVWRU5ULkRST1AsXHJcbiAgICAgICAgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgdmlld1NvdXJjZTogVmlldyA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpO1xyXG4gICAgICAgICAgX3RoaXMuaG5kRHJvcChfZXZlbnQsIHZpZXdTb3VyY2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFsc2UpO1xyXG5cclxuICAgICAgLy8gZHJvcCBkdXJpbmcgY2FwdHVyZSBwaGFzZSwgYWxsb3dzIHZpZXdzIG1hbmlwdWxhdGUgdGhlIGRyb3AgZGF0YSBiZWZvcmUgdGhlIGFjdHVhbCB0YXJnZXQgaXMgcmVhY2hlZFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIF9ldmVudCA9PiBfdGhpcy5obmREcm9wQ2FwdHVyZShfZXZlbnQsIFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpKSwgdHJ1ZSk7XHJcblxyXG4gICAgICByZXR1cm4gVmlldy5pZENvdW50Kys7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBpZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy4jaWR9XyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFRpdGxlKF90aXRsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5zZXRUaXRsZShfdGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogT2JqZWN0W10ge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BhdGNoKF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF9pbml0LmRldGFpbCA9IF9pbml0LmRldGFpbCB8fCB7fTtcclxuICAgICAgX2luaXQuZGV0YWlsLnZpZXcgPSBfaW5pdC5kZXRhaWwudmlldyB8fCB0aGlzO1xyXG4gICAgICB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBFZGl0b3JFdmVudChfdHlwZSwgX2luaXQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGF0Y2hUb1BhcmVudChfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfaW5pdC5kZXRhaWwgPSBfaW5pdC5kZXRhaWwgfHwge307XHJcbiAgICAgIF9pbml0LmJ1YmJsZXMgPSB0cnVlO1xyXG4gICAgICBfaW5pdC5kZXRhaWwudmlldyA9IF9pbml0LmRldGFpbC52aWV3IHx8IHRoaXM7XHJcbiAgICAgIHRoaXMuZG9tLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIC8vIENvbnRleHRNZW51LmFwcGVuZENvcHlQYXN0ZShtZW51KTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYENvbnRleHRNZW51OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIEV2ZW50c1xyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfc291cmNlLCBfZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudENvbW1vbiA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgLy8gICBjYXNlIEVWRU5UX0VESVRPUi5TRVRfUFJPSkVDVDpcclxuICAgICAgLy8gICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBleHRlcm5hbCByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0V4dGVybmFsIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTxEaXJlY3RvcnlFbnRyeT47XHJcblxyXG4gICAgI2V4cGFuZGVkOiBzdHJpbmdbXTsgLy8gY2FjaGUgc3RhdGUgZnJvbSBjb25zdHJ1Y3RvclxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuI2V4cGFuZGVkID0gX3N0YXRlW1wiZXhwYW5kZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFByb2plY3QoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBuZXcgVVJMKFwiLlwiLCDGki5Qcm9qZWN0LmJhc2VVUkwpLnBhdGhuYW1lO1xyXG4gICAgICBpZiAobmF2aWdhdG9yLnBsYXRmb3JtID09IFwiV2luMzJcIiB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT0gXCJXaW42NFwiKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpOyAvLyBzdHJpcCBsZWFkaW5nIHNsYXNoXHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJvb3Q6IERpcmVjdG9yeUVudHJ5ID0gRGlyZWN0b3J5RW50cnkuY3JlYXRlUm9vdChwYXRoKTtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuQ3VzdG9tVHJlZTxEaXJlY3RvcnlFbnRyeT4obmV3IENvbnRyb2xsZXJUcmVlRGlyZWN0b3J5KCksIHJvb3QpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLnRyZWUuZ2V0SXRlbXMoKVswXS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGBEcmFnICYgZHJvcCBleHRlcm5hbCBpbWFnZSwgYXVkaW9maWxlIGV0Yy4gdG8gdGhlIFwiSW50ZXJuYWxcIiwgdG8gY3JlYXRlIGEgRlVER0UtcmVzb3VyY2VgO1xyXG5cclxuICAgICAgaWYgKHRoaXMuI2V4cGFuZGVkKVxyXG4gICAgICAgIHRoaXMuZXhwYW5kKHRoaXMuI2V4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSkgIC8vIFRPRE86IGluc3BlY3QgaWYgdGhpcyBpcyBldmVyIHRoZSBjYXNlP1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgLy8gbm90aGluZyBhY3R1YWxseSBzZWxlY3RlZC4uLlxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICAgIHRoaXMuc2V0UHJvamVjdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy50cmVlLnJlZnJlc2goKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0RXhwYW5kZWQoKTogc3RyaW5nW10ge1xyXG4gICAgICBjb25zdCBleHBhbmRlZDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnRyZWUpIHtcclxuICAgICAgICBpZiAoaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGV4cGFuZGVkLnB1c2goaXRlbS5kYXRhLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGV4cGFuZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kKF9wYXRoczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGF0aHM6IERpcmVjdG9yeUVudHJ5W11bXSA9IF9wYXRocy5tYXAoX3BhdGggPT4gbmV3IERpcmVjdG9yeUVudHJ5KFwiXCIsIF9wYXRoLCBudWxsLCBudWxsKS5nZXRQYXRoKCkpO1xyXG4gICAgICB0aGlzLnRyZWUuZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdJbnRlcm5hbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBnbHRmSW1wb3J0U2V0dGluZ3M6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0geyAvLyBUT0RPOiBzYXZlIHRoZXNlIHNldHRpbmdzP1xyXG4gICAgICBbxpIuR3JhcGgubmFtZV06IHRydWUsXHJcbiAgICAgIFvGki5BbmltYXRpb24ubmFtZV06IHRydWUsXHJcbiAgICAgIFvGki5NYXRlcmlhbC5uYW1lXTogZmFsc2UsXHJcbiAgICAgIFvGki5NZXNoLm5hbWVdOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBUT0RPOiBlaXRoZXIgcmVtb3ZlIFZpZXdJbnRlcm5hbFRhYmxlIG9yIHVuaWZ5IGNvbW1vbiBmdW5jdGlvbmFsaXR5IHdpdGggVmlld0ludGVybmFsRm9sZGVyIGludG8gVmlld0ludGVybmFsLi4uXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXNwbGF5cyB0aGUgaW50ZXJuYWwgcmVzb3VyY2VzIGFzIGEgZm9sZGVyIHRyZWUuXHJcbiAgICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjQgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdJbnRlcm5hbEZvbGRlciBleHRlbmRzIFZpZXdJbnRlcm5hbCB7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTxSZXNvdXJjZUVudHJ5PjtcclxuXHJcbiAgICAjZXhwYW5kZWQ6IHN0cmluZ1tdOyAvLyBjYWNoZSBzdGF0ZSBmcm9tIGNvbnN0cnVjdG9yXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kT3Blbik7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRVcGRhdGUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kQ3JlYXRlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuTVVUQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5obmRLZXlib2FyZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuI2V4cGFuZGVkID0gX3N0YXRlW1wiZXhwYW5kZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb250cm9sbGVyKCk6IENvbnRyb2xsZXJUcmVlUmVzb3VyY2Uge1xyXG4gICAgICByZXR1cm4gPENvbnRyb2xsZXJUcmVlUmVzb3VyY2U+dGhpcy50cmVlLmNvbnRyb2xsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZXNvdXJjZUZvbGRlcigpOiBSZXNvdXJjZUZvbGRlciB7XHJcbiAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlRm9sZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSB7XHJcbiAgICAgIHJldHVybiA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmZpbHRlcihfZWxlbWVudCA9PiAhKF9lbGVtZW50IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+dGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMuZmlsdGVyKF9zb3VyY2UgPT4gIShfc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiB0aGlzIGlzIGEgcHJlcGFyYXRpb24gZm9yIHN5bmNpbmcgYSBncmFwaCB3aXRoIGl0cyBpbnN0YW5jZXMgYWZ0ZXIgc3RydWN0dXJhbCBjaGFuZ2VzXHJcbiAgICAvLyBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgIC8vICAgbGV0IHJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IDxIVE1MVGFibGVSb3dFbGVtZW50Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKChfZWxlbWVudCkgPT4gKDxIVE1MRWxlbWVudD5fZWxlbWVudCkudGFnTmFtZSA9PSBcIlRSXCIpO1xyXG4gICAgLy8gICBpZiAocm93KVxyXG4gICAgLy8gICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5TWU5DX0lOU1RBTkNFUykpLmVuYWJsZWQgPSAocm93LmdldEF0dHJpYnV0ZShcImljb25cIikgPT0gXCJHcmFwaFwiKTtcclxuICAgIC8vICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ3JlYXRlIEZvbGRlclwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9GT0xERVIpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ3JlYXRlIEdyYXBoXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiR1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWVzaFwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gpLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUVTSCwgxpIuTWVzaCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1hdGVyaWFsXCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIMaSLlNoYWRlciwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIEFuaW1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiksXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04sIMaSLkFuaW1hdGlvbiwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1QpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRGVsZXRlXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGxldCBjaG9pY2U6IENPTlRFWFRNRU5VID0gTnVtYmVyKF9pdGVtLmlkKTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG4gICAgICBsZXQgaVN1YmNsYXNzOiBudW1iZXIgPSBfaXRlbVtcImlTdWJjbGFzc1wiXTtcclxuICAgICAgaWYgKCFpU3ViY2xhc3MgJiYgKGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUVTSCB8fCBjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMKSkge1xyXG4gICAgICAgIGFsZXJ0KFwiRnVua3kgRWxlY3Ryb24tRXJyb3IuLi4gcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBmb2N1czogUmVzb3VyY2VFbnRyeSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG5cclxuICAgICAgaWYgKGNob2ljZSA9PSBDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpIHtcclxuICAgICAgICBpZiAoKChhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFtmb2N1c10pKS5sZW5ndGggPiAwKSlcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoZm9jdXMgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHJlc291cmNlOiBSZXNvdXJjZUVudHJ5O1xyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9GT0xERVI6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZUZvbGRlcigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUVTSDpcclxuICAgICAgICAgIGxldCB0eXBlTWVzaDogdHlwZW9mIMaSLk1lc2ggPSDGki5NZXNoLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgdHlwZU1lc2goKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMOlxyXG4gICAgICAgICAgbGV0IHR5cGVTaGFkZXI6IHR5cGVvZiDGki5TaGFkZXIgPSDGki5TaGFkZXIuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgxpIuTWF0ZXJpYWwodHlwZVNoYWRlci5uYW1lLCB0eXBlU2hhZGVyKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChuZXcgxpIuTm9kZShcIk5ld0dyYXBoXCIpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTjpcclxuICAgICAgICAgIGxldCB0eXBlQW5pbWF0aW9uOiB0eXBlb2YgxpIuQW5pbWF0aW9uID0gxpIuQW5pbWF0aW9uLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IHR5cGVBbmltYXRpb24oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVDpcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IMaSLlBhcnRpY2xlU3lzdGVtKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgdGhpcy50cmVlLmFkZENoaWxkcmVuKFtyZXNvdXJjZV0sIGZvY3VzKTtcclxuICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUocmVzb3VyY2UpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHdoaWxlIChpdGVtICE9IHRoaXMuZG9tICYmICEoaXRlbSBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tVHJlZUl0ZW0pKVxyXG4gICAgICAgIGl0ZW0gPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoaXRlbSA9PSB0aGlzLmRvbSkge1xyXG4gICAgICAgIGl0ZW0gPSB0aGlzLnRyZWUuZmluZFZpc2libGUodGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgICAgaXRlbS5mb2N1cygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgxpJ1aS5DdXN0b21UcmVlSXRlbSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSB0cnVlKTtcclxuXHJcbiAgICAgIGlmICghKGl0ZW0uZGF0YSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSkge1xyXG4gICAgICAgIGNvbnN0IGNyZWF0ZU9wdGlvbnM6IENPTlRFWFRNRU5VW10gPSBbQ09OVEVYVE1FTlUuQ1JFQVRFX0ZPTERFUiwgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBILCBDT05URVhUTUVOVS5DUkVBVEVfTUVTSCwgQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCBDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUXTtcclxuICAgICAgICBjcmVhdGVPcHRpb25zLmZvckVhY2goX2lkID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhfaWQpKS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtLmRhdGEgPT0gdGhpcy5yZXNvdXJjZUZvbGRlcilcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSkudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGlmIChzb3VyY2VzLnNvbWUoX3NvdXJjZSA9PiBbTUlNRS5BVURJTywgTUlNRS5JTUFHRSwgTUlNRS5NRVNILCBNSU1FLkdMVEZdLmluY2x1ZGVzKF9zb3VyY2UuZ2V0TWltZVR5cGUoKSkpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMgfHwgX2V2ZW50LnRhcmdldCA9PSB0aGlzLnRyZWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCByZXNvdXJjZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSBbXTtcclxuICAgICAgZm9yIChjb25zdCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgxpIuTm9kZSkge1xyXG4gICAgICAgICAgcmVzb3VyY2VzLnB1c2goYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgoc291cmNlLCB0cnVlKSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoc291cmNlLmdldE1pbWVUeXBlKCkpIHtcclxuICAgICAgICAgIGNhc2UgTUlNRS5BVURJTzpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2gobmV3IMaSLkF1ZGlvKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuSU1BR0U6XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKG5ldyDGki5UZXh0dXJlSW1hZ2Uoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgTUlNRS5NRVNIOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChhd2FpdCBuZXcgxpIuTWVzaE9CSigpLmxvYWQoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgTUlNRS5HTFRGOlxyXG4gICAgICAgICAgICBsZXQgbG9hZGVyOiDGki5HTFRGTG9hZGVyID0gYXdhaXQgxpIuR0xURkxvYWRlci5MT0FEKHNvdXJjZS5wYXRoUmVsYXRpdmUpO1xyXG4gICAgICAgICAgICBsZXQgbG9hZDogYm9vbGVhbiA9IGF3YWl0IMaSdWkuRGlhbG9nLnByb21wdChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzLCBmYWxzZSwgYFNlbGVjdCB3aGljaCByZXNvdXJjZXMgdG8gaW1wb3J0IGZyb20gJyR7bG9hZGVyLm5hbWV9J2AsIFwiQWRqdXN0IHNldHRpbmdzIGFuZCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG4gICAgICAgICAgICBpZiAoIWxvYWQpXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB0eXBlIGluIFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3MpIGlmIChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzW3R5cGVdKVxyXG4gICAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKC4uLmF3YWl0IGxvYWRlci5sb2FkUmVzb3VyY2VzPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+KMaSW3R5cGVdKSk7XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gcmVzb3VyY2VzO1xyXG4gICAgICB0aGlzLnRyZWUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoxpJ1aS5FVkVOVC5EUk9QLCB7IGJ1YmJsZXM6IGZhbHNlIH0pKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleWJvYXJkRXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoIWlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kT3BlbiA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuQ3VzdG9tVHJlZTxSZXNvdXJjZUVudHJ5PihuZXcgQ29udHJvbGxlclRyZWVSZXNvdXJjZSgpLCB0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayB0byBjcmVhdGUgbmV3IHJlc291cmNlLlxcbuKXjyBTZWxlY3Qgb3IgZHJhZyByZXNvdXJjZS5cIjtcclxuICAgICAgdGhpcy50cmVlLnRpdGxlID0gXCLil48gU2VsZWN0IHRvIGVkaXQgaW4gXFxcIlByb3BlcnRpZXNcXFwiXFxu4pePIERyYWcgdG8gXFxcIlByb3BlcnRpZXNcXFwiIG9yIFxcXCJDb21wb25lbnRzXFxcIiB0byB1c2UgaWYgYXBwbGljYWJsZS5cIjtcclxuICAgICAgdGhpcy5obmRDcmVhdGUoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZCh0aGlzLiNleHBhbmRlZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ3JlYXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBhZGQgbmV3IHJlc291cmNlcyB0byByb290IGZvbGRlclxyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIMaSLlByb2plY3QucmVzb3VyY2VzKSB7XHJcbiAgICAgICAgbGV0IHJlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSA9IMaSLlByb2plY3QucmVzb3VyY2VzW2lkUmVzb3VyY2VdO1xyXG4gICAgICAgIGlmICghdGhpcy5yZXNvdXJjZUZvbGRlci5jb250YWlucyhyZXNvdXJjZSkpXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuYWRkQ2hpbGRyZW4oW3Jlc291cmNlXSwgdGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5obmRVcGRhdGUoKTtcclxuICAgICAgbGV0IHJvb3RJdGVtOiDGknVpLkN1c3RvbVRyZWVJdGVtPFJlc291cmNlRW50cnk+ID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICBpZiAoIXJvb3RJdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgIHJvb3RJdGVtLmV4cGFuZCh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHJlbW92ZSByZXNvdXJjZXMgdGhhdCBhcmUgbm8gbG9uZ2VyIHJlZ2lzdGVyZWQgaW4gdGhlIHByb2plY3RcclxuICAgICAgZm9yIChjb25zdCBkZXNjZW5kYW50IG9mIHRoaXMucmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgaWYgKCEoZGVzY2VuZGFudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSAmJiAhxpIuUHJvamVjdC5yZXNvdXJjZXNbZGVzY2VuZGFudC5pZFJlc291cmNlXSlcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZW1vdmUoZGVzY2VuZGFudCk7XHJcblxyXG4gICAgICB0aGlzLmhuZFVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFVwZGF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy50cmVlLnJlZnJlc2goKTtcclxuICAgICAgT2JqZWN0LnZhbHVlcyjGki5Qcm9qZWN0LnJlc291cmNlcylcclxuICAgICAgICAuZmlsdGVyKF9yZXNvdXJjZSA9PiAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X3Jlc291cmNlKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKVxyXG4gICAgICAgIC5tYXAoX3Jlc291cmNlID0+IHRoaXMuY29udHJvbGxlci5nZXRQYXRoKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgLmZvckVhY2goX3BhdGggPT4gdGhpcy50cmVlLnNob3coX3BhdGgpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogUmVzb3VyY2VFbnRyeVtdW10gPSBfcGF0aHNcclxuICAgICAgICAubWFwKF9wYXRoID0+IF9wYXRoXHJcbiAgICAgICAgICAuc3BsaXQoXCIvXCIpXHJcbiAgICAgICAgICAuc2xpY2UoMSkgLy8gcmVtb3ZlIHJvb3QgYXMgaXQgaXMgYWRkZWQgYXMgZmlyc3QgZWxlbWVudCBpbiByZWR1Y2VcclxuICAgICAgICAgIC5yZWR1Y2U8UmVzb3VyY2VGb2xkZXJbXT4oKF9wYXRoLCBfaW5kZXgpID0+IFsuLi5fcGF0aCwgX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV0/LmVudHJpZXM/LltfaW5kZXhdXSwgW3RoaXMucmVzb3VyY2VGb2xkZXJdKSlcclxuICAgICAgICAuZmlsdGVyKF9wYXRoID0+ICFfcGF0aC5zb21lKF9lbnRyeSA9PiAhX2VudHJ5KSk7IC8vIGZpbHRlciBvdXQgaW52YWxpZCBwYXRoc1xyXG4gICAgICB0aGlzLnRyZWUuZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKHRoaXMuZ2V0UGF0aChpdGVtLmRhdGEpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZXhwYW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQYXRoKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuZ2V0UGF0aChfZW50cnkpLm1hcChfZW50cnkgPT4gX2VudHJ5LnJlc291cmNlUGFyZW50Py5lbnRyaWVzLmluZGV4T2YoX2VudHJ5KSkuam9pbihcIi9cIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9WaWV3LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0V4dGVybmFsLnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGludGVyZmFjZSBEcmFnRHJvcEZpbHRlciB7XHJcbiAgICBvbktleUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIG9uVHlwZUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIGZyb21WaWV3cz86ICh0eXBlb2YgVmlldylbXTtcclxuICAgIG9uVHlwZT86IEZ1bmN0aW9uO1xyXG4gICAgb2ZUeXBlPzogRnVuY3Rpb247XHJcbiAgICBkcm9wRWZmZWN0OiBcImNvcHlcIiB8IFwibGlua1wiIHwgXCJtb3ZlXCIgfCBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGxldCBmaWx0ZXI6IHsgW25hbWU6IHN0cmluZ106IERyYWdEcm9wRmlsdGVyIH0gPSB7XHJcbiAgICBVcmxPblRleHR1cmU6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJUZXh0dXJlSW1hZ2VcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uTWVzaE9CSjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hPQkpcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uQXVkaW86IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJBdWRpb1wiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVXJsT25NZXNoR0xURjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hHTFRGXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBNYXRlcmlhbE9uQ29tcG9uZW50TWF0ZXJpYWw6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5Db21wb25lbnRNYXRlcmlhbCwgb2ZUeXBlOiDGki5NYXRlcmlhbCwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIE1lc2hPbkNvbXBvbmVudE1lc2g6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5Db21wb25lbnRNZXNoLCBvZlR5cGU6IMaSLk1lc2gsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBBbmltYXRpb25PbkNvbXBvbmVudEFuaW1hdG9yOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uVHlwZTogxpIuQ29tcG9uZW50QW5pbWF0b3IsIG9mVHlwZTogxpIuQW5pbWF0aW9uLCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgUGFydGljbGVTeXN0ZW1PbkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uVHlwZTogxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW0sIG9mVHlwZTogxpIuUGFydGljbGVTeXN0ZW0sIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICAvLyBNZXNoT25NZXNoTGFiZWw6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwibWVzaFwiLCBvZlR5cGU6IMaSLk1lc2gsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBUZXh0dXJlT25NYXRlcmlhbFRleHR1cmU6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidGV4dHVyZVwiLCBvblR5cGU6IMaSLk1hdGVyaWFsLCBvZlR5cGU6IMaSLlRleHR1cmUsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBUZXh0dXJlT25NYXRlcmlhbE5vcm1hbE1hcDogeyBmcm9tVmlld3M6IFtWaWV3SW50ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJub3JtYWxNYXBcIiwgb25UeXBlOiDGki5NYXRlcmlhbCwgb2ZUeXBlOiDGki5UZXh0dXJlLCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVGV4dHVyZU9uTWF0ZXJpYWxUZXhUb29uOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInRleFRvb25cIiwgb25UeXBlOiDGki5NYXRlcmlhbCwgb2ZUeXBlOiDGki5UZXh0dXJlLCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG5cclxuXHJcbiAgICBUZXh0dXJlT25BbmltYXRpb25TcHJpdGU6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5BbmltYXRpb25TcHJpdGUsIG9mVHlwZTogxpIuVGV4dHVyZSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFRleHR1cmVPbk1lc2hSZWxpZWY6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5NZXNoUmVsaWVmLCBvZlR5cGU6IMaSLlRleHR1cmVJbWFnZSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfVxyXG4gIH07XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyRGV0YWlsIGV4dGVuZHMgxpJVaS5Db250cm9sbGVyIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbXV0YWJsZTogxpIuTXV0YWJsZSwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgIHN1cGVyKF9tdXRhYmxlLCBfZG9tRWxlbWVudCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuSU5QVVQsIHRoaXMubXV0YXRlT25JbnB1dCwgdHJ1ZSk7IC8vIHRoaXMgc2hvdWxkIGJlIG9ic29sZXRlXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5EUk9QLCB0aGlzLmhuZERyb3ApO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuSU5TRVJULCB0aGlzLmhuZEluc2VydCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG11dGF0ZU9uSW5wdXQgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICAvLyBUT0RPOiBtb3ZlIHRoaXMgdG8gVWkuQ29udHJvbGxlciBhcyBhIGdlbmVyYWwgb3B0aW1pemF0aW9uIHRvIG9ubHkgbXV0YXRlIHdoYXQgaGFzIGJlZW4gY2hhbmdlZC4uLiFcclxuICAgICAgdGhpcy5nZXRNdXRhdG9yID0gc3VwZXIuZ2V0TXV0YXRvcjtcclxuXHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgX2V2ZW50LmNvbXBvc2VkUGF0aCgpKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBkb2N1bWVudClcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+dGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGtleSlcclxuICAgICAgICAgIHBhdGgucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIHBhdGgucG9wKCk7XHJcbiAgICAgIHBhdGgucmV2ZXJzZSgpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSLk11dGFibGUuZ2V0TXV0YXRvckZyb21QYXRoKHRoaXMuZ2V0TXV0YXRvcigpLCBwYXRoKTtcclxuICAgICAgdGhpcy5nZXRNdXRhdG9yID0gKF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3IgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0TXV0YXRvciA9IHN1cGVyLmdldE11dGF0b3I7IC8vIHJlc2V0XHJcbiAgICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnNlcnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBDb250cm9sbGVyRGV0YWlsXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhfZXZlbnQuZGV0YWlsKTtcclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgPSB0aGlzLm11dGFibGVbX2V2ZW50LmRldGFpbC5nZXRBdHRyaWJ1dGUoXCJrZXlcIildO1xyXG4gICAgICBjb25zb2xlLmxvZyhtdXRhYmxlLnR5cGUpO1xyXG4gICAgICBpZiAobXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSlcclxuICAgICAgICBtdXRhYmxlLnB1c2gobmV3IG11dGFibGUudHlwZSgpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJVaS5FVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdXJsIG9uIHRleHR1cmVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25UZXh0dXJlLCBjaGVja01pbWVUeXBlKE1JTUUuSU1BR0UpKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gbWVzaG9ialxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbk1lc2hPQkosIGNoZWNrTWltZVR5cGUoTUlNRS5NRVNIKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIGF1ZGlvXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uQXVkaW8sIGNoZWNrTWltZVR5cGUoTUlNRS5BVURJTykpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBtZXNoZ2x0ZlxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbk1lc2hHTFRGLCBjaGVja01pbWVUeXBlKE1JTUUuR0xURikpKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBNYXRlcmlhbCBvbiBDb21wb25lbnRNYXRlcmlhbFxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NYXRlcmlhbE9uQ29tcG9uZW50TWF0ZXJpYWwpKSByZXR1cm47XHJcbiAgICAgIC8vIE1lc2ggb24gQ29tcG9uZW50TWVzaFxyXG4gICAgICAvLyBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NZXNoT25Db21wb25lbnRNZXNoLCAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiB7XHJcbiAgICAgIC8vICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZXRBbmNlc3RvcldpdGhUeXBlKF9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgLy8gICByZXR1cm4gKGtleSA9PSBcIm1lc2hcIik7XHJcbiAgICAgIC8vIH0pKSByZXR1cm47XHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLk1lc2hPbkNvbXBvbmVudE1lc2gpKSByZXR1cm47XHJcbiAgICAgIC8vIE1lc2ggb24gTWVzaExhYmVsXHJcbiAgICAgIC8vIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLk1lc2hPbk1lc2hMYWJlbCkpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBNYXRlcmlhbCB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlRleHR1cmVPbk1hdGVyaWFsVGV4dHVyZSkpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBNYXRlcmlhbCBub3JtYWwgbWFwXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlRleHR1cmVPbk1hdGVyaWFsTm9ybWFsTWFwKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1hdGVyaWFsIHRleFRvb25cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWF0ZXJpYWxUZXhUb29uKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1lc2hSZWxpZWZcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWVzaFJlbGllZikpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBBbmltYXRpb25TcHJpdGVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uQW5pbWF0aW9uU3ByaXRlKSkgcmV0dXJuO1xyXG4gICAgICAvLyBBbmltYXRpb24gb2YgQ29tcG9uZW50QW5pbWF0aW9uXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLkFuaW1hdGlvbk9uQ29tcG9uZW50QW5pbWF0b3IpKSByZXR1cm47XHJcbiAgICAgIC8vIFBhcnRpY2xlU3lzdGVtIG9mIENvbXBvbmVudFBhcnRpY2xlU3lzdGVtXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlBhcnRpY2xlU3lzdGVtT25Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSkpIHJldHVybjtcclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja01pbWVUeXBlKF9taW1lOiBNSU1FKTogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgICByZXR1cm4gKHNvdXJjZXMubGVuZ3RoID09IDEgJiYgc291cmNlc1swXS5nZXRNaW1lVHlwZSgpID09IF9taW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc2V0RXh0ZXJuYWxMaW5rOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLnZhbHVlID0gc291cmNlc1swXS5wYXRoUmVsYXRpdmU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGVPbklucHV0KF9ldmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRSZXNvdXJjZTogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICBsZXQgYW5jZXN0b3I6IEhUTUxFbGVtZW50ID0gdGhpcy5nZXRBbmNlc3RvcldpdGhUeXBlKF9ldmVudC50YXJnZXQpO1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IGFuY2VzdG9yLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoIXRoaXMubXV0YWJsZVtrZXldKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlW2tleV0gPSBfc291cmNlc1swXTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldE1hdGVyaWFsOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcIm1hdGVyaWFsXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRNZXNoOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcIm1lc2hcIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldFRleHR1cmUgPSAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlW1wiY29hdFwiXVtcInRleHR1cmVcIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldE5vcm1hbE1hcCA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICB0aGlzLm11dGFibGVbXCJjb2F0XCJdW1wibm9ybWFsTWFwXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRUZXhUb29uID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcImNvYXRcIl1bXCJ0ZXhUb29uXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRTcHJpdGVUZXh0dXJlOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcInRleHR1cmVcIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICB0aGlzLm11dGFibGUubXV0YXRlKHt9KTsgLy8gZm9yY2UgcmVjcmVhdGlvbiB1c2luZyBuZXcgdGV4dHVyZVxyXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc2V0SGVpZ2h0TWFwOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIC8vIHRoaXMubXV0YWJsZVtcInRleHR1cmVcIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMubXV0YWJsZS5nZXRNdXRhdG9yKCk7XHJcbiAgICAgICAgbXV0YXRvci50ZXh0dXJlID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlLm11dGF0ZShtdXRhdG9yKTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldEFuaW1hdGlvbjogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICB0aGlzLm11dGFibGVbXCJhbmltYXRpb25cIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICAvLyB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHRoaXMgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc2V0UGFydGljbGVTeXN0ZW06IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4gPSAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlW1wicGFydGljbGVTeXN0ZW1cIl0gPSBfc291cmNlc1swXTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIHRleHR1cmVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25UZXh0dXJlLCBzZXRFeHRlcm5hbExpbmspKSByZXR1cm47XHJcbiAgICAgIC8vIHRleHR1cmVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoT0JKLCBzZXRFeHRlcm5hbExpbmspKSByZXR1cm47XHJcbiAgICAgIC8vIGF1ZGlvXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uQXVkaW8sIHNldEV4dGVybmFsTGluaykpIHJldHVybjtcclxuXHJcbiAgICAgIC8vIE1hdGVyaWFsIG9uIENvbXBvbmVudE1hdGVyaWFsXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLk1hdGVyaWFsT25Db21wb25lbnRNYXRlcmlhbCwgc2V0TWF0ZXJpYWwpKSByZXR1cm47XHJcbiAgICAgIC8vIE1lc2ggb24gQ29tcG9uZW50TWVzaFxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NZXNoT25Db21wb25lbnRNZXNoLCBzZXRNZXNoKSkgcmV0dXJuO1xyXG4gICAgICAvLyBNZXNoIG9uIE1lc2hMYWJlbFxyXG4gICAgICAvLyBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NZXNoT25NZXNoTGFiZWwsIHNldE1lc2gpKSByZXR1cm47XHJcbiAgICAgIC8vIFRleHR1cmUgb24gTWF0ZXJpYWwgdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5UZXh0dXJlT25NYXRlcmlhbFRleHR1cmUsIHNldFRleHR1cmUpKSByZXR1cm47XHJcbiAgICAgIC8vIFRleHR1cmUgb24gTWF0ZXJpYWwgbm9ybWFsIG1hcFxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5UZXh0dXJlT25NYXRlcmlhbE5vcm1hbE1hcCwgc2V0Tm9ybWFsTWFwKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1hdGVyaWFsIHRleFRvb25cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWF0ZXJpYWxUZXhUb29uLCBzZXRUZXhUb29uKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1lc2hSZWxpZWZcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWVzaFJlbGllZiwgc2V0SGVpZ2h0TWFwKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIEFuaW1hdGlvblNwcml0ZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5UZXh0dXJlT25BbmltYXRpb25TcHJpdGUsIHNldFNwcml0ZVRleHR1cmUpKSByZXR1cm47XHJcbiAgICAgIC8vIEFuaW1hdGlvbiBvbiBDb21wb25lbnRBbmltYXRvclxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5BbmltYXRpb25PbkNvbXBvbmVudEFuaW1hdG9yLCBzZXRBbmltYXRpb24pKSByZXR1cm47XHJcbiAgICAgIC8vIFBhcnRpY2xlU3lzdGVtIG9uIENvbXBvbmVudFBhcnRpY2xlU3lzdGVtXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlBhcnRpY2xlU3lzdGVtT25Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSwgc2V0UGFydGljbGVTeXN0ZW0pKSByZXR1cm47XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGZpbHRlckRyYWdEcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfZmlsdGVyOiBEcmFnRHJvcEZpbHRlciwgX2NhbGxiYWNrOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKCkgPT4gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgdHlwZUVsZW1lbnQ6IHN0cmluZyA9IHRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IHR5cGVDb21wb25lbnQ6IHN0cmluZyA9IHRoaXMuZ2V0QW5jZXN0b3JXaXRoVHlwZSh0YXJnZXQpLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcblxyXG4gICAgICBpZiAoX2ZpbHRlci5vbktleUF0dHJpYnV0ZSAmJiB0eXBlRWxlbWVudCAhPSBfZmlsdGVyLm9uS2V5QXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSAmJiB0eXBlQ29tcG9uZW50ICE9IF9maWx0ZXIub25UeXBlQXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZSAmJiAhKHRoaXMubXV0YWJsZSBpbnN0YW5jZW9mIF9maWx0ZXIub25UeXBlKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuXHJcbiAgICAgIGlmICghX2ZpbHRlci5mcm9tVmlld3M/LmZpbmQoKF92aWV3KSA9PiB2aWV3U291cmNlIGluc3RhbmNlb2YgX3ZpZXcpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IHZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgIGlmICghKHNvdXJjZXNbMF0gaW5zdGFuY2VvZiBfZmlsdGVyLm9mVHlwZSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgaWYgKCFfY2FsbGJhY2soc291cmNlcykpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEFuY2VzdG9yV2l0aFR5cGUoX3RhcmdldDogRXZlbnRUYXJnZXQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fdGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgaWYgKHR5cGUpXHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVJlc291cmNlIGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVJlc291cmNlLmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IHRydWUgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIlR5cGVcIiwga2V5OiBcInR5cGVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiSWRcIiwga2V5OiBcImlkUmVzb3VyY2VcIiwgc29ydGFibGU6IGZhbHNlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIHJldHVybiBoZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNrIHJlbmFtZVwiLCBfb2JqZWN0Lm5hbWUsIF9uZXcpO1xyXG4gICAgICBsZXQgcmVuYW1lOiBib29sZWFuID0gX29iamVjdC5uYW1lICE9IF9uZXc7XHJcbiAgICAgIGlmIChyZW5hbWUpIHtcclxuICAgICAgICBfb2JqZWN0Lm5hbWUgPSBfbmV3OyAvLyBtdXN0IHJlbmFtZSBiZWZvcmUgbG9hZGluZywgVE9ETzogV0hZIGlzIGl0IHRoYXQgdGhlIHJlbmFtaW5nIGlzIHN1cHBvc2VkIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGFjdHVhbCB0YWJsZT8/P1xyXG4gICAgICAgIGF3YWl0ICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD5fb2JqZWN0KS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+IHtcclxuICAgICAgY29uc29sZS5sb2coX2ZvY3Vzc2VkLCB0aGlzLnNlbGVjdGlvbik7XHJcbiAgICAgIC8vIHRoaXMuc2VsZWN0aW9uID0gW107XHJcbiAgICAgIGxldCBleHBlbmRhYmxlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IHRoaXMuc2VsZWN0aW9uLmNvbmNhdChbXSk7IC8vX2ZvY3Vzc2VkKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIHNlcmlhbGl6YXRpb25zKVxyXG4gICAgICAgIHNlcmlhbGl6YXRpb25TdHJpbmdzLnNldCjGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXSwgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbnNbaWRSZXNvdXJjZV0pKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgZXhwZW5kYWJsZXMpIHtcclxuICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHNlcmlhbGl6YXRpb25TdHJpbmdzLmtleXMoKSlcclxuICAgICAgICAgIGlmIChyZXNvdXJjZS5pZFJlc291cmNlICE9IGV4cGVuZGFibGUuaWRSZXNvdXJjZSlcclxuICAgICAgICAgICAgaWYgKHNlcmlhbGl6YXRpb25TdHJpbmdzLmdldChyZXNvdXJjZSkuaW5kZXhPZihleHBlbmRhYmxlLmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0ucHVzaChyZXNvdXJjZS5uYW1lICsgXCIgXCIgKyByZXNvdXJjZS50eXBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGF3YWl0IG9wZW5EaWFsb2coKSkge1xyXG4gICAgICAgIGxldCBkZWxldGVkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgdXNhZ2UgaW4gdXNhZ2VzKVxyXG4gICAgICAgICAgaWYgKHVzYWdlc1t1c2FnZV0ubGVuZ3RoID09IDApIHsgLy8gZGVsZXRlIG9ubHkgdW51c2VkXHJcbiAgICAgICAgICAgIGRlbGV0ZWQucHVzaCjGki5Qcm9qZWN0LnJlc291cmNlc1t1c2FnZV0pO1xyXG4gICAgICAgICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIoxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXN5bmMgZnVuY3Rpb24gb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdCh1c2FnZXMsIHRydWUsIFwiUmV2aWV3IHJlZmVyZW5jZXMsIGRlbGV0ZSBkZXBlbmRlbmQgcmVzb3VyY2VzIGZpcnN0IGlmIGFwcGxpY2FibGVcIiwgXCJUbyBkZWxldGUgdW51c2VkIHJlc291cmNlcywgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHNvcnQoX2RhdGE6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfYjogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBfZGlyZWN0aW9uICogKF9hW19rZXldID09IF9iW19rZXldID8gMCA6IChfYVtfa2V5XSA+IF9iW19rZXldID8gMSA6IC0xKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9kYXRhLnNvcnQoY29tcGFyZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFNjcmlwdEluZm8ge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBuYW1lc3BhY2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdXBlckNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2NyaXB0OiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ29tcG9uZW50U2NyaXB0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9zY3JpcHQ6IEZ1bmN0aW9uLCBfbmFtZXNwYWNlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5zY3JpcHQgPSBfc2NyaXB0O1xyXG4gICAgICB0aGlzLm5hbWUgPSBfc2NyaXB0Lm5hbWU7XHJcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gX25hbWVzcGFjZTtcclxuICAgICAgbGV0IGNoYWluOiBGdW5jdGlvbiA9IF9zY3JpcHRbXCJfX3Byb3RvX19cIl07XHJcbiAgICAgIHRoaXMuc3VwZXJDbGFzcyA9IGNoYWluLm5hbWU7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50ID0gdGhpcy5pc0NvbXBvbmVudCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFwiKTtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50U2NyaXB0ID0gdGhpcy5pc0NvbXBvbmVudFNjcmlwdCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFNjcmlwdFwiKTtcclxuICAgICAgICBjaGFpbiA9IGNoYWluW1wiX19wcm90b19fXCJdO1xyXG4gICAgICB9IHdoaWxlIChjaGFpbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRhYmxlU2NyaXB0IGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8U2NyaXB0SW5mbz4ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhZDogxpJ1aS5UQUJMRVtdID0gQ29udHJvbGxlclRhYmxlU2NyaXB0LmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJTdXBlclwiLCBrZXk6IFwic3VwZXJDbGFzc1wiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJOYW1lc3BhY2VcIiwga2V5OiBcIm5hbWVzcGFjZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlU2NyaXB0LmhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExhYmVsKF9vYmplY3Q6IFNjcmlwdEluZm8pOiBzdHJpbmcgeyByZXR1cm4gXCJcIjsgfVxyXG4gICAgcHVibGljIGFzeW5jIHJlbmFtZShfb2JqZWN0OiBTY3JpcHRJbmZvLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZGVsZXRlKF9mb2N1c3NlZDogU2NyaXB0SW5mb1tdKTogUHJvbWlzZTxTY3JpcHRJbmZvW10+IHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHB1YmxpYyBjb3B5KF9vcmlnaW5hbHM6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiBTY3JpcHRJbmZvW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IFNjcmlwdEluZm8sIF9iOiBTY3JpcHRJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcblxyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlRGlyZWN0b3J5IGV4dGVuZHMgxpJVaS5DdXN0b21UcmVlQ29udHJvbGxlcjxEaXJlY3RvcnlFbnRyeT4ge1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfZW50cnkubmFtZTtcclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZW50cnk6IERpcmVjdG9yeUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IHJlbmFtZSBmaWxlICcke19lbnRyeS5uYW1lfScgdG8gJyR7X2VsZW1lbnQudmFsdWV9Jy5gLCBfZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX29iamVjdDogRGlyZWN0b3J5RW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5LmlzRGlyZWN0b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiBfZW50cnkuZ2V0RGlyZWN0b3J5Q29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHMoX2E6IERpcmVjdG9yeUVudHJ5LCBfYjogRGlyZWN0b3J5RW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hLnBhdGhSZWxhdGl2ZSA9PSBfYi5wYXRoUmVsYXRpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IERpcmVjdG9yeUVudHJ5W10pOiBQcm9taXNlPERpcmVjdG9yeUVudHJ5W10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6IERpcmVjdG9yeUVudHJ5W10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNzZWQ7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuc2VsZWN0aW9uIHx8IGV4cGVuZCkge1xyXG4gICAgICAgIGVudHJ5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGRlbGV0ZWQucHVzaChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2VudHJpZXM6IERpcmVjdG9yeUVudHJ5W10sIF90YXJnZXQ6IERpcmVjdG9yeUVudHJ5KTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCBtb3ZlOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9lbnRyaWVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIF90YXJnZXQuYWRkRW50cnkoZW50cnkpO1xyXG4gICAgICAgICAgZW50cnkuZGVsZXRlKCk7XHJcbiAgICAgICAgICBtb3ZlLnB1c2goZW50cnkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IGFkZCBmaWxlICcke2VudHJ5Lm5hbWV9JyB0byAnJHtfdGFyZ2V0Lm5hbWV9Jy5gLCBfZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiBEaXJlY3RvcnlFbnRyeVtdKTogUHJvbWlzZTxEaXJlY3RvcnlFbnRyeVtdPiB7XHJcbiAgICAgIC8vIGNvcGllcyBjYW4gbm90IGJlIGNyZWF0ZWQgYXQgdGhpcyBwb2ludCwgYnV0IHdoZW4gY29weWluZyB0aGUgZmlsZXMuIFNlZSBhZGRDaGlsZHJlblxyXG4gICAgICByZXR1cm4gX29yaWdpbmFscztcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlSGllcmFyY2h5IGV4dGVuZHMgxpJVaS5DdXN0b21UcmVlQ29udHJvbGxlcjzGki5Ob2RlPiB7XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX29iamVjdDogxpIuTm9kZSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IF9vYmplY3QubmFtZTtcclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9ub2RlOiDGki5Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW19ub2RlLmlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIl07XHJcbiAgICAgIGlmIChfbm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiR3JhcGhJbnN0YW5jZVwiKTtcclxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIHNldFZhbHVlKF9ub2RlOiDGki5Ob2RlLCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfbm9kZS5uYW1lICE9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX25vZGUubmFtZSA9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIGF3YWl0ICg8xpIuR3JhcGhHTFRGPl9ub2RlKS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX25vZGU6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9ub2RlLmdldENoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX25vZGU6IMaSLk5vZGUpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gX25vZGUuZ2V0Q2hpbGRyZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogxpIuTm9kZVtdKTogUHJvbWlzZTzGki5Ob2RlW10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogxpIuTm9kZVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3Vzc2VkO1xyXG4gICAgICBmb3IgKGxldCBub2RlIG9mIGV4cGVuZClcclxuICAgICAgICBpZiAobm9kZS5nZXRQYXJlbnQoKSkge1xyXG4gICAgICAgICAgbm9kZS5nZXRQYXJlbnQoKS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlLCBfaW5kZXg/OiBudW1iZXIpOiDGki5Ob2RlW10ge1xyXG4gICAgICAvLyBkaXNhbGxvdyBkcm9wIGZvciBzb3VyY2VzIGJlaW5nIGFuY2VzdG9yIHRvIHRhcmdldFxyXG4gICAgICBsZXQgbW92ZTogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9jaGlsZHJlbilcclxuICAgICAgICBpZiAoIV90YXJnZXQuaXNEZXNjZW5kYW50T2YoY2hpbGQpKVxyXG4gICAgICAgICAgbW92ZS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgIG1vdmUuZm9yRWFjaCgoX25vZGUsIF9pTW92ZSkgPT4gX3RhcmdldC5hZGRDaGlsZChfbm9kZSwgX2luZGV4ID09IHVuZGVmaW5lZCA/IF9pbmRleCA6IF9pbmRleCArIF9pTW92ZSkpO1xyXG4gICAgICAvLyBmb3IgKGxldCBub2RlIG9mIG1vdmUpXHJcbiAgICAgIC8vICAgX3RhcmdldC5hZGRDaGlsZChub2RlLCBfaVRhcmdldCk7XHJcblxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5Ob2RlW10pOiBQcm9taXNlPMaSLk5vZGVbXT4ge1xyXG4gICAgICAvLyB0cnkgdG8gY3JlYXRlIGNvcGllcyBhbmQgcmV0dXJuIHRoZW0gZm9yIHBhc3RlIG9wZXJhdGlvblxyXG4gICAgICBsZXQgY29waWVzOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgb3JpZ2luYWwgb2YgX29yaWdpbmFscykge1xyXG4gICAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5zZXJpYWxpemUob3JpZ2luYWwpO1xyXG4gICAgICAgIGxldCBjb3B5OiDGki5Ob2RlID0gPMaSLk5vZGU+YXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZShzZXJpYWxpemF0aW9uKTtcclxuICAgICAgICBjb3BpZXMucHVzaChjb3B5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29waWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5BZGRDaGlsZHJlbihfc291cmNlczogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfc291cmNlcy5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gX3NvdXJjZXMuZXZlcnkoX3NvdXJjZSA9PiBjaGVja0dyYXBoRHJvcChfc291cmNlLCBfdGFyZ2V0KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja0dyYXBoRHJvcChfc291cmNlOiDGki5Ob2RlLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGlkU291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBub2RlIG9mIF9zb3VyY2UuZ2V0SXRlcmF0b3IoKSlcclxuICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICAgICAgaWRTb3VyY2VzLnB1c2gobm9kZS5pZFNvdXJjZSk7XHJcbiAgICAgICAgICBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlkU291cmNlcy5wdXNoKG5vZGUuaWRSZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGlmIChfdGFyZ2V0IGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlmIChpZFNvdXJjZXMuaW5kZXhPZihfdGFyZ2V0LmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgaWYgKF90YXJnZXQgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgICAgICBpZiAoaWRTb3VyY2VzLmluZGV4T2YoX3RhcmdldC5pZFNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgX3RhcmdldCA9IF90YXJnZXQuZ2V0UGFyZW50KCk7XHJcbiAgICAgICAgfSB3aGlsZSAoX3RhcmdldCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0IGVudW0gSUQge1xyXG4gICAgTkFNRSA9IFwibmFtZVwiLFxyXG4gICAgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCIsXHJcbiAgICBWQUxVRSA9IFwidmFsdWVcIixcclxuICAgIFRSQU5TRk9STUFUSU9OID0gXCJ0cmFuc2Zvcm1hdGlvblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIMaSdWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4ge1xyXG4gICAgcHVibGljIGNoaWxkVG9QYXJlbnQ6IE1hcDzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbTtcclxuICAgIHByaXZhdGUgdmlldzogVmlld1BhcnRpY2xlU3lzdGVtO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbSwgX3ZpZXc6IFZpZXdQYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy52aWV3ID0gX3ZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgbGV0IHBhcmVudERhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZXRLZXkoX2RhdGEpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCHGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSAmJiAhxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IHNwYW5OYW1lOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuTmFtZS5pbm5lclRleHQgPSBwYXJlbnREYXRhID8ga2V5IDogxpIuUGFydGljbGVTeXN0ZW0ubmFtZTtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHNwYW5OYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmVudERhdGEgJiYgcGFyZW50RGF0YSA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICAvLyBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lc1trZXldO1xyXG4gICAgICAgIGlucHV0LmlkID0gSUQuTkFNRTtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSB7XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgICAgc2VsZWN0LmlkID0gSUQuRlVOQ1RJT047XHJcbiAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIE9iamVjdC52YWx1ZXMoxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OKSkge1xyXG4gICAgICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgZW50cnkudGV4dCA9IG5hbWU7XHJcbiAgICAgICAgICAgIGVudHJ5LnZhbHVlID0gbmFtZTtcclxuICAgICAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzZWxlY3QudmFsdWUgPSBfZGF0YS5mdW5jdGlvbjtcclxuICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgICAgLy8gaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaW5wdXQuaWQgPSBJRC5WQUxVRTtcclxuICAgICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkge1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IF9kYXRhLmNvZGU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IF9kYXRhLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImxpc3RcIiwgXCJ2YXJpYWJsZXNcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB9IFxyXG4gICAgICB9IGVsc2UgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgICBzZWxlY3QuaWQgPSBJRC5UUkFOU0ZPUk1BVElPTjtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0pIHtcclxuICAgICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgZW50cnkudGV4dCA9IGtleTtcclxuICAgICAgICAgIGVudHJ5LnZhbHVlID0ga2V5O1xyXG4gICAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdC52YWx1ZSA9IF9kYXRhLnRyYW5zZm9ybWF0aW9uO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgYXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSB8fCB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKSA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSBcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJ2YXJpYWJsZVwiKTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goX2RhdGEuZnVuY3Rpb24pO1xyXG4gICAgICBpZiAoX2RhdGEgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcImNvbG9yXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSBcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJ0cmFuc2Zvcm1hdGlvblwiKTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvZGUoX2RhdGEpKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcImNvZGVcIik7XHJcblxyXG4gICAgICByZXR1cm4gYXR0cmlidXRlcy5qb2luKFwiIFwiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGFzeW5jIHNldFZhbHVlKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCBpbnB1dEFzTnVtYmVyOiBudW1iZXIgPSBOdW1iZXIucGFyc2VGbG9hdChfZWxlbWVudC52YWx1ZSk7XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuTkFNRSAmJiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGxldCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLmluY2x1ZGVzKF9lbGVtZW50LnZhbHVlKSlcclxuICAgICAgICAgIGVycm9ycy5wdXNoKGB2YXJpYWJsZSBcIiR7X2VsZW1lbnR9XCIgYWxyZWFkeSBleGlzdHNgKTtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTW19lbGVtZW50LnZhbHVlXSlcclxuICAgICAgICAgIGVycm9ycy5wdXNoKGB2YXJpYWJsZSBcIiR7X2VsZW1lbnR9XCIgaXMgYSBwcmVkZWZpbmVkIHZhcmlhYmxlIGFuZCBjYW4gbm90IGJlIHJlZGVjbGFyZWQuIFByZWRlZmluZWQgdmFyaWFibGVzOiBbJHtPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpLmpvaW4oXCIsIFwiKX1dYCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICDGknVpLldhcm5pbmcuZGlzcGxheShlcnJvcnMsIFwiVW5hYmxlIHRvIHJlbmFtZVwiLCBcIlBsZWFzZSByZXNvbHZlIHRoZSBlcnJvcnMgYW5kIHRyeSBhZ2FpblwiICk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5kYXRhLnZhcmlhYmxlcy5pbmRleE9mKF9kYXRhKTtcclxuICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdO1xyXG4gICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2luZGV4XSA9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuYW1lVmFyaWFibGUobmFtZSwgX2VsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuRlVOQ1RJT04gJiYgxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgX2RhdGEuZnVuY3Rpb24gPSA8xpIuUGFydGljbGVEYXRhLkZVTkNUSU9OPl9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuVFJBTlNGT1JNQVRJT04gJiYgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgX2RhdGEudHJhbnNmb3JtYXRpb24gPSA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5WQUxVRSAmJiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSkpIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IHN0cmluZyB8IG51bWJlciA9IE51bWJlci5pc05hTihpbnB1dEFzTnVtYmVyKSA/IF9lbGVtZW50LnZhbHVlIDogaW5wdXRBc051bWJlcjtcclxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIgJiYgIcaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFU1tpbnB1dF0gJiYgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMgJiYgIXRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLmluY2x1ZGVzKGlucHV0KSkgXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgX2RhdGEudmFsdWUgPSBpbnB1dDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5WQUxVRSAmJiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpKSB7XHJcbiAgICAgICAgX2RhdGEuY29kZSA9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb25zdGFudChfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oX2RhdGEpLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgbGV0IGNoaWxkcmVuOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10gPSBbXTtcclxuICAgICAgbGV0IGRhdGE6IE9iamVjdCA9IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGE7XHJcbiAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRhdGEgPT0gdGhpcy5kYXRhKVxyXG4gICAgICAgIGtleXMgPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUy5maWx0ZXIoX2tleSA9PiBrZXlzLmluY2x1ZGVzKF9rZXkpKTtcclxuXHJcbiAgICAgIGtleXMuZm9yRWFjaChfa2V5ID0+IHtcclxuICAgICAgICBsZXQgY2hpbGQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSBkYXRhW19rZXldO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKGNoaWxkKSB8fCB0eXBlb2YgY2hpbGQgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuc2V0KGRhdGFbX2tleV0sIF9kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNlZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10pOiBQcm9taXNlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXT4ge1xyXG4gICAgICAvLyBkZWxldGUgc2VsZWN0aW9uIGluZGVwZW5kZW5kIG9mIGZvY3Vzc2VkIGl0ZW1cclxuICAgICAgbGV0IGRlbGV0ZWQ6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3VzZWQ7XHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgZXhwZW5kKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVsZXRlRGF0YShkYXRhKSlcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSwgX3RhcmdldDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSwgX2F0PzogbnVtYmVyKTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdIHtcclxuICAgICAgbGV0IG1vdmU6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSA9IFtdO1xyXG4gICAgICBsZXQgY29udGFpbmVyOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW107XHJcblxyXG4gICAgICBpZiAoKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF90YXJnZXQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF90YXJnZXQpKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IF90YXJnZXQucGFyYW1ldGVycztcclxuICAgICAgZWxzZSBpZiAoKF90YXJnZXQgPT0gdGhpcy5kYXRhLm10eExvY2FsIHx8IF90YXJnZXQgPT0gdGhpcy5kYXRhLm10eFdvcmxkKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSlcclxuICAgICAgICBjb250YWluZXIgPSA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW10+X3RhcmdldDtcclxuICAgICAgZWxzZSBpZiAoKF90YXJnZXQgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcyB8fCBfdGFyZ2V0ID09IHRoaXMuZGF0YS5jb2xvcikgJiYgX2NoaWxkcmVuLmV2ZXJ5KF9kYXRhID0+IMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSlcclxuICAgICAgICBjb250YWluZXIgPSA8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb25bXT5fdGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKCFjb250YWluZXIpIFxyXG4gICAgICAgIHJldHVybiBtb3ZlO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGFpbmVyKSlcclxuICAgICAgICBmb3IgKGxldCBkYXRhIG9mIF9jaGlsZHJlbikge1xyXG4gICAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBjb250YWluZXIuaW5kZXhPZihkYXRhKTsgLy8gX2F0IG5lZWRzIHRvIGJlIGNvcnJlY3RlZCBpZiB3ZSBhcmUgbW92aW5nIHdpdGhpbiBzYW1lIHBhcmVudFxyXG4gICAgICAgICAgbGV0IGhhc1BhcmVudDogYm9vbGVhbiA9IHRoaXMuY2hpbGRUb1BhcmVudC5oYXMoZGF0YSk7XHJcbiAgICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXM/LltpbmRleF07XHJcblxyXG4gICAgICAgICAgaWYgKGhhc1BhcmVudCAmJiAhdGhpcy5kZWxldGVEYXRhKGRhdGEpKSBcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgaWYgKCFoYXNQYXJlbnQpXHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHJcbiAgICAgICAgICBtb3ZlLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuc2V0KGRhdGEsIF90YXJnZXQpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID4gLTEgJiYgX2F0ID4gaW5kZXgpXHJcbiAgICAgICAgICAgIF9hdCAtPSAxO1xyXG5cclxuICAgICAgICAgIGlmIChfYXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnB1c2gobmFtZSB8fCB0aGlzLmdlbmVyYXRlTmV3VmFyaWFibGVOYW1lKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLnNwbGljZShfYXQgKyBfY2hpbGRyZW4uaW5kZXhPZihkYXRhKSwgMCwgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5zcGxpY2UoX2F0ICsgX2NoaWxkcmVuLmluZGV4T2YoZGF0YSksIDAsIG5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdKTogUHJvbWlzZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10+IHtcclxuICAgICAgbGV0IGNvcGllczogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSBbXTtcclxuICAgICAgaWYgKF9vcmlnaW5hbHMuZXZlcnkoX29yaWdpbmFsID0+IMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX29yaWdpbmFsKSkgfHwgX29yaWdpbmFscy5ldmVyeShfb3JpZ2luYWwgPT4gxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX29yaWdpbmFsKSkpXHJcbiAgICAgICAgX29yaWdpbmFscy5mb3JFYWNoKF9vcmlnaW5hbCA9PiBjb3BpZXMucHVzaChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KF9vcmlnaW5hbCkpKSk7XHJcblxyXG4gICAgICByZXR1cm4gY29waWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvdmVycmlkZSBkcmFnZ2FibGUoX3RhcmdldDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfdGFyZ2V0KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IFwibmV3VmFyaWFibGVcIjtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAxO1xyXG4gICAgICB3aGlsZSAodGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcclxuICAgICAgICBuYW1lID0gXCJuZXdWYXJpYWJsZVwiICsgY291bnQ7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEtleShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IHN0cmluZyB7IFxyXG4gICAgICBsZXQgcGFyZW50OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5jaGlsZFRvUGFyZW50LmdldChfZGF0YSkgfHwge307XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihwYXJlbnQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKHBhcmVudCkpXHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmFtZXRlcnM7XHJcblxyXG4gICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocGFyZW50KS5maW5kKF9lbnRyeSA9PiBfZW50cnlbMV0gPT0gX2RhdGEpPy5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVsZXRlRGF0YShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAoX2RhdGEgPT0gdGhpcy5kYXRhKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBwYXJlbnQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZXRLZXkoX2RhdGEpO1xyXG5cclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKHBhcmVudCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24ocGFyZW50KSlcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyYW1ldGVycztcclxuXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudCkpIHtcclxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IE51bWJlci5wYXJzZUludChrZXkpO1xyXG4gICAgICAgIHBhcmVudC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmIChwYXJlbnQgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVsZXRlIHBhcmVudFtrZXldO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuZGVsZXRlKF9kYXRhKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5hbWVWYXJpYWJsZShfbmFtZTogc3RyaW5nLCBfbmV3OiBzdHJpbmcsIF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5kYXRhKTogdm9pZCB7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgJiYgX2RhdGEudmFsdWUgPT0gX25hbWUpIHtcclxuICAgICAgICBfZGF0YS52YWx1ZSA9IF9uZXc7XHJcbiAgICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgZGV0YWlsOiB7IGRhdGE6IF9kYXRhIH0gfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoY29uc3Qgc3ViRGF0YSBvZiBPYmplY3QudmFsdWVzKFwicGFyYW1ldGVyc1wiIGluIF9kYXRhID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhKSlcclxuICAgICAgICBpZiAodHlwZW9mIHN1YkRhdGEgPT0gXCJvYmplY3RcIilcclxuICAgICAgICAgIHRoaXMucmVuYW1lVmFyaWFibGUoX25hbWUsIF9uZXcsIHN1YkRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgdHlwZSBSZXNvdXJjZUVudHJ5ID0gUmVzb3VyY2VGaWxlIHwgUmVzb3VyY2VGb2xkZXI7XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VGaWxlIGV4dGVuZHMgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2Uge1xyXG4gICAgcmVzb3VyY2VQYXJlbnQ/OiBSZXNvdXJjZUZvbGRlcjsgLy8gZGFuZ2Vyb3VzIGFzIGEgU2VyaWFsaXphYmxlUmVzb3VyY2UgbXVzdCBub3QgaGF2ZSBhIHByb3BlcnR5IHdpdGggdGhpcyBuYW1lIGl0c2VsZlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIFJlc291cmNlRm9sZGVyIGltcGxlbWVudHMgxpIuU2VyaWFsaXphYmxlIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVzb3VyY2VQYXJlbnQ6IFJlc291cmNlRm9sZGVyO1xyXG4gICAgcHVibGljIGVudHJpZXM6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZyA9IFwiRm9sZGVyXCI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcgPSBcIk5ldyBGb2xkZXJcIikge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9yIGFueSBvZiBpdHMgZGVzY2VuZGFudHMgY29udGFpbiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhfcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlKTogYm9vbGVhbiB7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykgXHJcbiAgICAgICAgaWYgKGVudHJ5ID09IF9yZXNvdXJjZSB8fCBlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyICYmIGVudHJ5LmNvbnRhaW5zKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplKCk6IMaSLlNlcmlhbGl6YXRpb24ge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbiA9IHsgbmFtZTogdGhpcy5uYW1lLCBlbnRyaWVzOiBbXSB9O1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uZW50cmllcy5wdXNoKGVudHJ5LnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzZXJpYWxpemF0aW9uLmVudHJpZXMucHVzaCh7IGlkUmVzb3VyY2U6IGVudHJ5LmlkUmVzb3VyY2UgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlcmlhbGl6YXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGU+IHtcclxuICAgICAgdGhpcy5uYW1lID0gX3NlcmlhbGl6YXRpb24ubmFtZTtcclxuICAgICAgZm9yIChsZXQgZW50cnlTZXJpYWxpemF0aW9uIG9mIF9zZXJpYWxpemF0aW9uLmVudHJpZXMgPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW4pIHsgLy8gcmVtb3ZlIFwiPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW5cIiBhZnRlciBhIHdoaWxlXHJcbiAgICAgICAgbGV0IGVudHJ5OiBSZXNvdXJjZUVudHJ5O1xyXG4gICAgICAgIGlmIChcImlkUmVzb3VyY2VcIiBpbiBlbnRyeVNlcmlhbGl6YXRpb24pXHJcbiAgICAgICAgICBlbnRyeSA9IGF3YWl0IMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoZW50cnlTZXJpYWxpemF0aW9uLmlkUmVzb3VyY2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVudHJ5ID0gPFJlc291cmNlRm9sZGVyPmF3YWl0IG5ldyBSZXNvdXJjZUZvbGRlcigpLmRlc2VyaWFsaXplKGVudHJ5U2VyaWFsaXphdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgZW50cnkucmVzb3VyY2VQYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8UmVzb3VyY2VFbnRyeT4ge1xyXG4gICAgICB5aWVsZCB0aGlzO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHlpZWxkKiBlbnRyeTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB5aWVsZCBlbnRyeTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlUmVzb3VyY2UgZXh0ZW5kcyDGknVpLkN1c3RvbVRyZWVDb250cm9sbGVyPFJlc291cmNlRW50cnk+IHtcclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfb2JqZWN0Lm5hbWU7XHJcblxyXG4gICAgICBpZiAoIShfb2JqZWN0IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKSB7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBfb2JqZWN0LnR5cGUpO1xyXG5cclxuICAgICAgICBpZiAoKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9vYmplY3QpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIGlucHV0LnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUuIENoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBSZXNvdXJjZUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfZW50cnkubmFtZSAhPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgaWYgKHJlbmFtZSkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgYXdhaXQgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9lbnRyeSkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgJiYgX2VudHJ5LmVudHJpZXMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyID8gX2VudHJ5LmVudHJpZXMgOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFJlc291cmNlRW50cnlbXSwgX3RhcmdldDogUmVzb3VyY2VFbnRyeSwgX2luZGV4PzogbnVtYmVyKTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgaWYgKCEoX3RhcmdldCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgbW92ZTogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfc291cmNlcykge1xyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXg6IG51bWJlciA9IF90YXJnZXQuZW50cmllcy5pbmRleE9mKHNvdXJjZSk7IC8vIF9pbmRleCBuZWVkcyB0byBiZSBjb3JyZWN0ZWQgaWYgd2UgYXJlIG1vdmluZyB3aXRoaW4gc2FtZSBwYXJlbnRcclxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEgJiYgX2luZGV4ID4gY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgX2luZGV4IC09IDE7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKHNvdXJjZSk7XHJcbiAgICAgICAgc291cmNlLnJlc291cmNlUGFyZW50ID0gX3RhcmdldDtcclxuICAgICAgICBtb3ZlLnB1c2goc291cmNlKTtcclxuXHJcbiAgICAgICAgaWYgKF9pbmRleCA9PSBudWxsKVxyXG4gICAgICAgICAgX3RhcmdldC5lbnRyaWVzLnB1c2goc291cmNlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBfdGFyZ2V0LmVudHJpZXMuc3BsaWNlKF9pbmRleCArIF9zb3VyY2VzLmluZGV4T2Yoc291cmNlKSwgMCwgc291cmNlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogUmVzb3VyY2VFbnRyeVtdKTogUHJvbWlzZTxSZXNvdXJjZUVudHJ5W10+IHtcclxuICAgICAgLy8gVE9ETzogYWRkIGRlbGV0ZSBzZWxlY3Rpb24gaXNudGVhZCBvZiBfZm9jdXNzZWQ/IFdoeSBkb2Vzbid0IHRoZSBUcmVlIGNsYXNzIGhhbmRsZSB0aGlzP1xyXG4gICAgICBsZXQgaVJvb3Q6IG51bWJlciA9IF9mb2N1c3NlZC5pbmRleE9mKHByb2plY3QucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICBpZiAoaVJvb3QgPiAtMSlcclxuICAgICAgICBfZm9jdXNzZWQuc3BsaWNlKGlSb290LCAxKTtcclxuXHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uczogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25TdHJpbmdzOiBNYXA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCB1c2FnZXM6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBleHBlbmRhYmxlIG9mIF9mb2N1c3NlZCkge1xyXG4gICAgICAgIGlmIChleHBlbmRhYmxlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpIHtcclxuICAgICAgICAgIGxldCB1c2FnZTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZXhwZW5kYWJsZS5lbnRyaWVzKVxyXG4gICAgICAgICAgICB1c2FnZS5wdXNoKGVudHJ5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgIHVzYWdlc1tfZm9jdXNzZWQuaW5kZXhPZihleHBlbmRhYmxlKSArIFwiIFwiICsgZXhwZW5kYWJsZS5uYW1lXSA9IHVzYWdlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChsZXQgcmVzb3VyY2Ugb2Ygc2VyaWFsaXphdGlvblN0cmluZ3Mua2V5cygpKVxyXG4gICAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBleHBlbmRhYmxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgICAgaWYgKHNlcmlhbGl6YXRpb25TdHJpbmdzLmdldChyZXNvdXJjZSkuaW5kZXhPZihleHBlbmRhYmxlLmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXS5wdXNoKHJlc291cmNlLm5hbWUgKyBcIiBcIiArIHJlc291cmNlLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9mb2N1c3NlZC5sZW5ndGggPiAwICYmIGF3YWl0IG9wZW5EaWFsb2coKSkge1xyXG4gICAgICAgIGxldCBkZWxldGVkOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiBfZm9jdXNzZWQpIHtcclxuICAgICAgICAgIGxldCBrZXk6IHN0cmluZyA9IHNlbGVjdGVkIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgPyB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKHNlbGVjdGVkKSArIFwiIFwiICsgc2VsZWN0ZWQubmFtZSA6IHNlbGVjdGVkLmlkUmVzb3VyY2U7XHJcbiAgICAgICAgICBpZiAodXNhZ2VzW2tleV0ubGVuZ3RoID09IDApICAvLyBkZWxldGUgb25seSB1bnVzZWRcclxuICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHNlbGVjdGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIGRlbGV0ZWQpIHtcclxuICAgICAgICAgIGlmICghKHJlc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIocmVzb3VyY2UpO1xyXG5cclxuICAgICAgICAgIHRoaXMucmVtb3ZlKHJlc291cmNlKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSh0aGlzLnNlbGVjdGlvbi5pbmRleE9mKHJlc291cmNlKSwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgYXN5bmMgZnVuY3Rpb24gb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdCh1c2FnZXMsIHRydWUsIFwiUmV2aWV3IHJlZmVyZW5jZXMsIGRlbGV0ZSBkZXBlbmRlbmQgcmVzb3VyY2VzIGZpcnN0IGlmIGFwcGxpY2FibGVcIiwgXCJUbyBkZWxldGUgdW51c2VkIHJlc291cmNlcywgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogUmVzb3VyY2VFbnRyeVtdKTogUHJvbWlzZTxSZXNvdXJjZUVudHJ5W10+IHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYXRoKF9yZXNvdXJjZTogUmVzb3VyY2VFbnRyeSk6IFJlc291cmNlRW50cnlbXSB7XHJcbiAgICAgIGxldCBwYXRoOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgICAgbGV0IGN1cnJlbnQ6IFJlc291cmNlRW50cnkgPSBfcmVzb3VyY2U7XHJcbiAgICAgIHdoaWxlIChjdXJyZW50KSB7XHJcbiAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJlc291cmNlUGFyZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKF9yZXNvdXJjZTogUmVzb3VyY2VFbnRyeSk6IHZvaWQge1xyXG4gICAgICBsZXQgcGFyZW50OiBSZXNvdXJjZUZvbGRlciA9IF9yZXNvdXJjZS5yZXNvdXJjZVBhcmVudDtcclxuICAgICAgaWYgKCFwYXJlbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBwYXJlbnQuZW50cmllcy5pbmRleE9mKF9yZXNvdXJjZSk7XHJcbiAgICAgIHBhcmVudC5lbnRyaWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9WaWV3LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyBmb3IgYWxsIFtbUGFuZWxdXXMgYWdncmVnYXRpbmcgW1tWaWV3XV1zXHJcbiAgICogU3ViY2xhc3NlcyBhcmUgcHJlc2V0cyBmb3IgY29tbW9uIHBhbmVscy4gQSB1c2VyIG1pZ2h0IGFkZCBvciBkZWxldGUgW1tWaWV3XV1zIGF0IHJ1bnRpbWVcclxuICAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjRcclxuICAgKi9cclxuXHJcbiAgLy8gVE9ETzogY2xhc3MgbWlnaHQgYmVjb21lIGEgY3VzdG9tY29tcG9uZW50IGZvciBIVE1MISA9IHRoaXMuZG9tXHJcblxyXG4gIC8vIGV4dGVuZHMgdmlldyB2b3Jyw7xiZXJnZWhlbmQgZW50ZmVybnRcclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgUGFuZWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByb3RlY3RlZCBnb2xkZW5MYXlvdXQ6IEdvbGRlbkxheW91dDtcclxuICAgIHByb3RlY3RlZCB2aWV3czogVmlld1tdID0gW107XHJcbiAgICAvL3B1YmxpYyBkb207IC8vIG11c3MgdmllbGxlaWNodCB3ZWdcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfcGFuZWxTdGF0ZTogVmlld1N0YXRlLCBfdmlld0NvbnN0cnVjdG9ycz86IHsgW25hbWU6IHN0cmluZ106IG5ldyAoLi4uYXJnczogxpIuR2VuZXJhbCkgPT4gVmlldyB9LCBfcm9vdEl0ZW1Db25maWc/OiBSb3dPckNvbHVtbkl0ZW1Db25maWcpIHtcclxuICAgICAgX2NvbnRhaW5lci5vbihcImRlc3Ryb3lcIiwgKCkgPT4gdGhpcy5nb2xkZW5MYXlvdXQuZGVzdHJveSgpKTsgLy8gZGVzdHJveSBmcm9tIGluc2lkZSBvdXRcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3BhbmVsU3RhdGUpO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xyXG4gICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJ2aWV3XCIpO1xyXG4gICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJwYW5lbFwiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBMYXlvdXRDb25maWcgPSB7XHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICBwb3BvdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWF4aW1pc2U6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290OiBfcm9vdEl0ZW1Db25maWdcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0ID0gbmV3IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkdvbGRlbkxheW91dCh0aGlzLmRvbSk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBfdmlld0NvbnN0cnVjdG9ycylcclxuICAgICAgICB0aGlzLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudEZhY3RvcnlGdW5jdGlvbihrZXksIChfY29udGFpbmVyLCBfdmlld1N0YXRlOiBWaWV3U3RhdGUpID0+IG5ldyBfdmlld0NvbnN0cnVjdG9yc1trZXldKF9jb250YWluZXIsIHsgLi4uX3BhbmVsU3RhdGUsIC4uLl92aWV3U3RhdGUgfSkpO1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQub24oXCJzdGF0ZUNoYW5nZWRcIiwgKCkgPT4gdGhpcy5nb2xkZW5MYXlvdXQudXBkYXRlUm9vdFNpemUoKSk7XHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0Lm9uKFwiaXRlbUNyZWF0ZWRcIiwgdGhpcy5hZGRWaWV3Q29tcG9uZW50KTtcclxuXHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0LmxvYWRMYXlvdXQoX3BhbmVsU3RhdGVbXCJsYXlvdXRcIl0gPyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5MYXlvdXRDb25maWcuZnJvbVJlc29sdmVkKF9wYW5lbFN0YXRlW1wibGF5b3V0XCJdKSA6IGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmQgY3VzdG9tIGNvcGllcyBvZiB0aGUgZ2l2ZW4gZXZlbnQgdG8gdGhlIHZpZXdzICovXHJcbiAgICBwdWJsaWMgYnJvYWRjYXN0ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBsZXQgdGFyZ2V0OiBWaWV3ID0gZGV0YWlsLnZpZXc7XHJcbiAgICAgIGRldGFpbC5zZW5kZXIgPSB0aGlzO1xyXG4gICAgICBmb3IgKGxldCB2aWV3IG9mIHRoaXMudmlld3MpXHJcbiAgICAgICAgaWYgKHZpZXcgIT0gdGFyZ2V0KSAvLyBkb24ndCBzZW5kIGJhY2sgdG8gb3JpZ2luYWwgdGFyZ2V0IHZpZXdcclxuICAgICAgICAgIHZpZXcuZGlzcGF0Y2goPEVWRU5UX0VESVRPUj5fZXZlbnQudHlwZSwgeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJsYXlvdXRcIl0gPSB0aGlzLmdvbGRlbkxheW91dC5zYXZlTGF5b3V0KCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFZpZXdDb21wb25lbnQgPSAoX2V2ZW50OiBFdmVudEVtaXR0ZXIuQnViYmxpbmdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBhZGp1c3RtZW5zIGZvciBHb2xkZW5MYXlvdXQgMlxyXG4gICAgICBsZXQgdGFyZ2V0OiBDb21wb25lbnRJdGVtID0gX2V2ZW50LnRhcmdldCBhcyBDb21wb25lbnRJdGVtO1xyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuQ29tcG9uZW50SXRlbSkge1xyXG4gICAgICAgIHRoaXMudmlld3MucHVzaCg8Vmlldz50YXJnZXQuY29tcG9uZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVE9ETzogYWRkXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsQW5pbWF0aW9uIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uc3RydWN0b3JzID0geyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgICAgICAgW1ZJRVcuQU5JTUFUSU9OXTogVmlld0FuaW1hdGlvbixcclxuICAgICAgICBbVklFVy5BTklNQVRJT05fU0hFRVRdOiBWaWV3QW5pbWF0aW9uU2hlZXRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkFOSU1BVElPTixcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkFOSU1BVElPTl9TSEVFVFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJBbmltYXRpb24gfCBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICAvLyBUT0RPOiBpdGVyYXRlIG92ZXIgdmlld3MgYW5kIGNvbGxlY3QgdGhlaXIgc3RhdGVzIGZvciByZWNvbnN0cnVjdGlvblxyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gX2V2ZW50LmRldGFpbC5ub2RlPy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb24/Lm5hbWU7XHJcbiAgICAgICAgICBpZiAobmFtZSlcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShcIkFuaW1hdGlvbiB8IFwiICsgbmFtZSk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgKiBTaG93cyBhIGdyYXBoIGFuZCBvZmZlcnMgbWVhbnMgZm9yIG1hbmlwdWxhdGlvblxyXG4gICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsR3JhcGggZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICAjZ3JhcGg6IMaSLkdyYXBoO1xyXG4gICAgI25vZGU6IMaSLk5vZGU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uc3RydWN0b3JzID0geyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgICAgICAgW1ZJRVcuUkVOREVSXTogVmlld1JlbmRlcixcclxuICAgICAgICBbVklFVy5DT01QT05FTlRTXTogVmlld0NvbXBvbmVudHMsXHJcbiAgICAgICAgW1ZJRVcuSElFUkFSQ0hZXTogVmlld0hpZXJhcmNoeVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUkVOREVSLFxyXG4gICAgICAgICAgdGl0bGU6IFwiUmVuZGVyXCJcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5ISUVSQVJDSFksXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkhpZXJhcmNoeVwiXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQ09NUE9ORU5UUyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiQ29tcG9uZW50c1wiXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJHcmFwaFwiKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkZPQ1VTLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVFJBTlNGT1JNLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy5yZXN0b3JlR3JhcGgoKS50aGVuKF9ncmFwaCA9PiB7XHJcbiAgICAgICAgaWYgKF9ncmFwaCkge1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogX2dyYXBoLCBub2RlOiB0aGlzLnJlc3RvcmVOb2RlKF9ncmFwaCkgfSB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBpZiAoX3N0YXRlW1wiZ3JhcGhcIl0pIHtcclxuICAgICAgICAgIMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoX3N0YXRlW1wiZ3JhcGhcIl0pLnRoZW4oKF9ncmFwaDogxpIuR3JhcGgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZTogxpIuTm9kZSA9IF9zdGF0ZVtcIm5vZGVcIl0gJiYgxpIuTm9kZS5GSU5EKF9ncmFwaCwgX3N0YXRlW1wibm9kZVwiXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IF9ncmFwaCwgbm9kZTogbm9kZSB9IH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBpZiAodGhpcy4jZ3JhcGgpXHJcbiAgICAgICAgc3RhdGVbXCJncmFwaFwiXSA9IHRoaXMuI2dyYXBoLmlkUmVzb3VyY2U7XHJcbiAgICAgIGlmICh0aGlzLiNub2RlKVxyXG4gICAgICAgIHN0YXRlW1wibm9kZVwiXSA9IMaSLk5vZGUuUEFUSF9GUk9NX1RPKHRoaXMuI2dyYXBoLCB0aGlzLiNub2RlKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMudmlld3MuZmluZChfdmlldyA9PiBfdmlldyBpbnN0YW5jZW9mIFZpZXdSZW5kZXIpLmRvbS5jb250YWlucyg8Tm9kZT5fZXZlbnQudGFyZ2V0KSkgLy8gYWNjZXB0IGRyb3Agb25seSBmcm9tIHJlbmRlciB2aWV3XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBzb3VyY2UsIG5vZGU6IHRoaXMucmVzdG9yZU5vZGUoc291cmNlKSB9IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBkZXRhaWw6IEV2ZW50RGV0YWlsID0gX2V2ZW50LmRldGFpbDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTogLy8gVE9ETzogaW5zcGVjdCBpZiB0aGVzZSB0d28gc2hvdWxkIGJlIHN0b3BwZWQgYXN3ZWxsXHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgY29uc3QgZ3JhcGg6IMaSLkdyYXBoID0gZGV0YWlsLmdyYXBoO1xyXG4gICAgICAgICAgaWYgKGdyYXBoICYmIGdyYXBoICE9IHRoaXMuI2dyYXBoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVHcmFwaChncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7Z3JhcGgudHlwZX0gfCAke2dyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgICAgIHRoaXMuI2dyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBub2RlOiDGki5Ob2RlID0gZGV0YWlsLm5vZGU7XHJcbiAgICAgICAgICBpZiAobm9kZSAmJiBub2RlICE9IHRoaXMuI25vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUodGhpcy4jZ3JhcGgsIG5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLiNub2RlID0gbm9kZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC52aWV3ICE9IHRoaXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGlmICh0aGlzLiNncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUdyYXBoKHRoaXMuI2dyYXBoKTtcclxuICAgICAgICAgIGlmICh0aGlzLiNncmFwaCAmJiB0aGlzLiNub2RlKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0aGlzLiNncmFwaCwgdGhpcy4jbm9kZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZU5vZGUoX2dyYXBoOiDGki5HcmFwaCwgX3NlbGVjdGVkOiDGki5Ob2RlKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5pZH1fJHtfZ3JhcGguaWRSZXNvdXJjZX1gLCDGki5Ob2RlLlBBVEhfRlJPTV9UTyhfZ3JhcGgsIF9zZWxlY3RlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZU5vZGUoX2dyYXBoOiDGki5HcmFwaCk6IMaSLk5vZGUge1xyXG4gICAgICBsZXQgc2VsZWN0ZWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5pZH1fJHtfZ3JhcGguaWRSZXNvdXJjZX1gKTtcclxuICAgICAgcmV0dXJuIHNlbGVjdGVkICYmIMaSLk5vZGUuRklORChfZ3JhcGgsIHNlbGVjdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JlR3JhcGgoX2dyYXBoOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIF9ncmFwaC5pZFJlc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlc3RvcmVHcmFwaCgpOiBQcm9taXNlPMaSLkdyYXBoPiB7XHJcbiAgICAgIGxldCBpZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmlkKTtcclxuICAgICAgcmV0dXJuIGlkICYmIDxQcm9taXNlPMaSLkdyYXBoPj7Gki5Qcm9qZWN0LmdldFJlc291cmNlKGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgKiBTaG93cyBhIGhlbHAgYW5kIGRvY3VtZW50YXRpb25cclxuICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIxXHJcbiAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxIZWxwIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkhlbHBcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZG9tKTtcclxuICAgICAgLy8gVE9ETzogaWZyYW1lIHNhbmRib3ggZGlzYWxsb3dzIHVzZSBvZiBzY3JpcHRzLCByZW1vdmUgb3IgcmVwbGFjZSB3aXRoIG9iamVjdCBpZiBuZWNlc3NhcnlcclxuICAgICAgLy8gdGhpcy5kb20uaW5uZXJIVE1MID0gYDxpZnJhbWUgc3JjPVwiSGVscC5odG1sXCIgc2FuZGJveD48L2lmcmFtZT5gO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBgPG9iamVjdCBkYXRhPVwiSGVscC5odG1sXCI+PC9vYmplY3Q+YDtcclxuXHJcbiAgICAgIC8vIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAvLyAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgIC8vICAgaXNDbG9zYWJsZTogdHJ1ZSxcclxuICAgICAgLy8gICBjb250ZW50OiBbXHJcbiAgICAgIC8vICAgICB7XHJcbiAgICAgIC8vICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgIC8vICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUkVOREVSLFxyXG4gICAgICAvLyAgICAgICBjb21wb25lbnRTdGF0ZTogX3N0YXRlLFxyXG4gICAgICAvLyAgICAgICB0aXRsZTogXCJSZW5kZXJcIlxyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIF1cclxuICAgICAgLy8gfTtcclxuXHJcbiAgICAgIC8vIHRoaXMuZ29sZGVuTGF5b3V0LmFkZEl0ZW1BdExvY2F0aW9uKGNvbmZpZywgW3sgdHlwZUlkOiBMYXlvdXRNYW5hZ2VyLkxvY2F0aW9uU2VsZWN0b3IuVHlwZUlkLlJvb3QgfV0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUT0RPOiBhZGRcclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBBUlRJQ0xFX1NZU1RFTSxcclxuICAgICAgICAgIHRpdGxlOiDGki5QYXJ0aWNsZVN5c3RlbS5uYW1lXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgeyBbVklFVy5QQVJUSUNMRV9TWVNURU1dOiBWaWV3UGFydGljbGVTeXN0ZW0gfSwgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5zZXRUaXRsZSjGki5QYXJ0aWNsZVN5c3RlbS5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGl0ZXJhdGUgb3ZlciB2aWV3cyBhbmQgY29sbGVjdCB0aGVpciBzdGF0ZXMgZm9yIHJlY29uc3RydWN0aW9uXHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXkgdGhlIHByb2plY3Qgc3RydWN0dXJlIGFuZCBvZmZlciBmdW5jdGlvbnMgZm9yIGNyZWF0aW9uLCBkZWxldGlvbiBhbmQgYWRqdXN0bWVudCBvZiByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9ycyBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMC0gMjAyM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbFByb2plY3QgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5JTlRFUk5BTF9UQUJMRV06IFZpZXdJbnRlcm5hbFRhYmxlLFxyXG4gICAgICAgIFtWSUVXLklOVEVSTkFMX0ZPTERFUl06IFZpZXdJbnRlcm5hbEZvbGRlcixcclxuICAgICAgICBbVklFVy5FWFRFUk5BTF06IFZpZXdFeHRlcm5hbCxcclxuICAgICAgICBbVklFVy5QUk9QRVJUSUVTXTogVmlld1Byb3BlcnRpZXMsXHJcbiAgICAgICAgW1ZJRVcuUFJFVklFV106IFZpZXdQcmV2aWV3LFxyXG4gICAgICAgIFtWSUVXLlNDUklQVF06IFZpZXdTY3JpcHRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBST1BFUlRJRVMsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlByb3BlcnRpZXNcIlxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBSRVZJRVcsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlByZXZpZXdcIlxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuRVhURVJOQUwsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiRXh0ZXJuYWxcIlxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlNDUklQVCxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJTY3JpcHRcIlxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcInN0YWNrXCIsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLklOVEVSTkFMX0ZPTERFUixcclxuICAgICAgICAgICAgICB0aXRsZTogXCJJbnRlcm5hbFwiXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSU5URVJOQUxfVEFCTEUsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiVGFibGVcIlxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZEV2ZW50KTsgLy8gVE9ETzogZXhwbGFpbiB1c2Ugb2YgZG9jdW1lbnQgLy8gcmVtb3ZlZCBiZWFjYXVzZSB0aGlzIGtlZXBzIHRoZSBwYW5lbHMgYWxpdmUgZXZlbiB3aGVuIGNsb3NlZFxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9qZWN0IHwgXCIgKyBwcm9qZWN0Lm5hbWUpO1xyXG4gICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLk9QRU4sIHt9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuVVBEQVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5DUkVBVEUgJiYgX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLkRFTEVURSlcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9qZWN0IHwgXCIgKyBwcm9qZWN0Lm5hbWUpOyAvL3doeSBoZXJlIGFuZCBldmVyeXRpbWU/XHJcbiAgICAgIGlmIChfZXZlbnQudHlwZSA9PSDGknVpLkVWRU5ULlNFTEVDVCkge1xyXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KG5ldyBFZGl0b3JFdmVudChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogX2V2ZW50LmRldGFpbCB9KSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFuZCBlZGl0IGEgcGFydGljbGUgc3lzdGVtIGF0dGFjaGVkIHRvIGEgbm9kZS5cclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1BhcnRpY2xlU3lzdGVtIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1BFUlRZX0tFWVM6IChrZXlvZiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtKVtdID0gW1widmFyaWFibGVzXCIsIFwibXR4TG9jYWxcIiwgXCJtdHhXb3JsZFwiLCBcImNvbG9yXCJdO1xyXG5cclxuICAgIHByaXZhdGUgY21wUGFydGljbGVTeXN0ZW06IMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBwYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW07XHJcbiAgICBwcml2YXRlIGRhdGE6IMaSLlBhcnRpY2xlRGF0YS5TeXN0ZW07XHJcblxyXG4gICAgcHJpdmF0ZSB0b29sYmFyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgdG9vbGJhckludGVydmFsSWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgdGltZVNjYWxlUGxheTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgdHJlZTogxpJ1aS5DdXN0b21UcmVlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+O1xyXG4gICAgcHJpdmF0ZSBjb250cm9sbGVyOiBDb250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBlcnJvcnM6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gW107XHJcbiAgICBwcml2YXRlIHZhcmlhYmxlczogSFRNTERhdGFMaXN0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLmNyZWF0ZVRvb2xiYXIoKTtcclxuICAgICAgdGhpcy5zZXRQYXJ0aWNsZVN5c3RlbShudWxsKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBjb250ZXh0IG1lbnVcclxuICAgIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZm9jdXM6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgaWYgKCFmb2N1cylcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuaXRlbXMuZm9yRWFjaChfaXRlbSA9PiBfaXRlbS52aXNpYmxlID0gZmFsc2UpO1xyXG4gICAgICBsZXQgcG9wdXA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0gPSB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1BST1BFUlRZKSk7XHJcbiAgICAgICAgaXRlbS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBpdGVtLnN1Ym1lbnUuaXRlbXMuZm9yRWFjaChfc3ViSXRlbSA9PiBfc3ViSXRlbS52aXNpYmxlID0gZmFsc2UpO1xyXG4gICAgICAgIFZpZXdQYXJ0aWNsZVN5c3RlbS5QUk9QRVJUWV9LRVlTXHJcbiAgICAgICAgICAuZmlsdGVyKF92YWx1ZSA9PiAhT2JqZWN0LmtleXMoZm9jdXMpLmluY2x1ZGVzKF92YWx1ZSkpXHJcbiAgICAgICAgICAuZm9yRWFjaChfbGFiZWwgPT4gaXRlbS5zdWJtZW51Lml0ZW1zLmZpbmQoX2l0ZW0gPT4gX2l0ZW0ubGFiZWwgPT0gX2xhYmVsKS52aXNpYmxlID0gdHJ1ZSk7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcyB8fCBmb2N1cyA9PSB0aGlzLmRhdGEuY29sb3IgfHwgxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oZm9jdXMpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKGZvY3VzKSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09OU1RBTlQpKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLm10eExvY2FsIHx8IGZvY3VzID09IHRoaXMuZGF0YS5tdHhXb3JsZCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBwb3B1cCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmb2N1cyAhPSB0aGlzLmRhdGEpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1BBUlRJQ0xFX0RBVEEpKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBwb3B1cCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwb3B1cClcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgIGxldCBvcHRpb25zOiBzdHJpbmdbXSA9IFZpZXdQYXJ0aWNsZVN5c3RlbS5QUk9QRVJUWV9LRVlTO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBQcm9wZXJ0eVwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1BST1BFUlRZKSxcclxuICAgICAgICBzdWJtZW51OiBnZW5lcmF0ZVN1Yk1lbnUob3B0aW9ucywgU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSksIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJBZGQgVmFsdWVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09OU1RBTlQpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJBZGQgRnVuY3Rpb25cIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJBZGQgQ29kZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQWRkIFRyYW5zZm9ybWF0aW9uXCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pLFxyXG4gICAgICAgIHN1Ym1lbnU6IGdlbmVyYXRlU3ViTWVudShbxpIuTWF0cml4NHg0LnByb3RvdHlwZS50cmFuc2xhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5yb3RhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5zY2FsZS5uYW1lXSwgU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTiksIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1BBUlRJQ0xFX0RBVEEpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZVN1Yk1lbnUoX29wdGlvbnM6IHN0cmluZ1tdLCBfaWQ6IHN0cmluZywgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgICAgbGV0IHN1Ym1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgX29wdGlvbnMuZm9yRWFjaChfb3B0aW9uID0+IHtcclxuICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IF9vcHRpb24sIGlkOiBfaWQsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgICAgICBzdWJtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1Ym1lbnU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGZvY3VzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNoaWxkOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlO1xyXG4gICAgICBzd2l0Y2ggKE51bWJlcihfaXRlbS5pZCkpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWTpcclxuICAgICAgICAgIGNoaWxkID0gW107XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09OU1RBTlQ6XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgdmFsdWU6IDEgfTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTjpcclxuICAgICAgICAgIGlmICghY2hpbGQpXHJcbiAgICAgICAgICAgIGNoaWxkID0geyBmdW5jdGlvbjogxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OLkFERElUSU9OLCBwYXJhbWV0ZXJzOiBbXSB9O1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPREU6XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgY29kZTogXCIxXCIgfTtcclxuXHJcbiAgICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oZm9jdXMpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKGZvY3VzKSlcclxuICAgICAgICAgICAgZm9jdXMucGFyYW1ldGVycy5wdXNoKDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbj5jaGlsZCk7XHJcbiAgICAgICAgICBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgZm9jdXNbX2l0ZW0ubGFiZWxdID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGlmIChfaXRlbS5sYWJlbCA9PSBcInZhcmlhYmxlc1wiKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzID0gW107XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZvY3VzID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlcy5wdXNoKDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbj5jaGlsZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnB1c2godGhpcy5jb250cm9sbGVyLmdlbmVyYXRlTmV3VmFyaWFibGVOYW1lKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEuY29sb3IpXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5jb2xvci5wdXNoKDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbj5jaGlsZCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoaWxkVG9QYXJlbnQuc2V0KGNoaWxkLCBmb2N1cyk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoZm9jdXMpLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShjaGlsZCkuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT046XHJcbiAgICAgICAgICBjaGlsZCA9IHsgdHJhbnNmb3JtYXRpb246IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXCJ0cmFuc2Zvcm1hdGlvblwiXT5faXRlbS5sYWJlbCwgcGFyYW1ldGVyczogW10gfTtcclxuICAgICAgICAgICg8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW10+Zm9jdXMpLnB1c2goY2hpbGQpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGlsZFRvUGFyZW50LnNldChjaGlsZCwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX1BBUlRJQ0xFX0RBVEE6XHJcbiAgICAgICAgICBsZXQgcmVtb3ZlOiDGki5TZXJpYWxpemF0aW9uW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFtmb2N1c10pO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmRlbGV0ZShyZW1vdmUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5ERUxFVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZXZlbnQgaGFuZGxpbmdcclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSB8fCAhKHNvdXJjZSBpbnN0YW5jZW9mIMaSLk5vZGUpIHx8ICFzb3VyY2UuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtKT8ucGFydGljbGVTeXN0ZW0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY21wUGFydGljbGVTeXN0ZW0gPSA8xpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW0+KDzGki5Ob2RlPl92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdKS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW0pO1xyXG4gICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZTtcclxuICAgICAgdGhpcy5zZXRUaW1lKDApO1xyXG4gICAgICB0aGlzLnNldFBhcnRpY2xlU3lzdGVtKHRoaXMuY21wUGFydGljbGVTeXN0ZW0ucGFydGljbGVTeXN0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMudG9vbGJhckludGVydmFsSWQpO1xyXG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgICAgIHRoaXMuZW5hYmxlU2F2ZSh0cnVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5LRVlfRE9XTjpcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAwICYmIF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgPT0gxpIuS0VZQk9BUkRfQ09ERS5TICYmIF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgICAgICDGknVpLldhcm5pbmcuZGlzcGxheSh0aGlzLmVycm9ycy5tYXAoKFtfZGF0YSwgX2Vycm9yXSkgPT4gX2Vycm9yKSwgXCJVbmFibGUgdG8gc2F2ZVwiLCBgUHJvamVjdCBjYW4ndCBiZSBzYXZlZCB3aGlsZSBoYXZpbmcgdW5yZXNvbHZlZCBlcnJvcnNgLCBcIk9LXCIpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKF9ldmVudC5kZXRhaWwuZGF0YSk/LnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DUkVBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuREVMRVRFOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU5BTUU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRFJPUDpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuQ1VUOiAvLyBUT0RPOiBjdXN0b21zIHRyZWVzIGN1dCBpcyBhc3luYywgdGhpcyBzaG91bGQgaGFwcGVuIGFmdGVyIGN1dCBpcyBmaW5pc2hlZFxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5QQVNURTpcclxuICAgICAgICAgIHRoaXMucmVmcmVzaFZhcmlhYmxlcygpO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5FWFBBTkQ6XHJcbiAgICAgICAgICBsZXQgaW52YWxpZDogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10gPSB0aGlzLnZhbGlkYXRlRGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnNcclxuICAgICAgICAgICAgLmZpbHRlcihfZXJyb3IgPT4gIWludmFsaWQuaW5jbHVkZXMoX2Vycm9yKSlcclxuICAgICAgICAgICAgLm1hcCgoW19kYXRhXSkgPT4gdGhpcy50cmVlLmZpbmRWaXNpYmxlKF9kYXRhKSlcclxuICAgICAgICAgICAgLmZvckVhY2goX2l0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghX2l0ZW0pIHJldHVybjtcclxuICAgICAgICAgICAgICBfaXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwid2FybmluZ1wiKTtcclxuICAgICAgICAgICAgICBfaXRlbS50aXRsZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMgPSBpbnZhbGlkO1xyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwICYmIF9ldmVudC50eXBlICE9IMaSdWkuRVZFTlQuRVhQQU5EKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0uZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKSk7IC8vIG91ciB3b3JraW5nIGNvcHkgc2hvdWxkIG9ubHkgYmUgdXNlZCBpZiBpdCBpcyB2YWxpZCBcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLmZvckVhY2goKFtfZGF0YSwgX2Vycm9yXSkgPT4ge1xyXG4gICAgICAgICAgICAgIGxldCBpdGVtOiDGknVpLkN1c3RvbVRyZWVJdGVtPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+ID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKF9kYXRhKTtcclxuICAgICAgICAgICAgICBpZiAoIWl0ZW0pIHJldHVybjtcclxuICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoXCJ3YXJuaW5nXCIpO1xyXG4gICAgICAgICAgICAgIGl0ZW0udGl0bGUgPSBfZXJyb3I7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5lbmFibGVTYXZlKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIHRvb2xiYXJcclxuICAgIHByaXZhdGUgY3JlYXRlVG9vbGJhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy50b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy50b29sYmFyLmlkID0gXCJ0b29sYmFyXCI7XHJcbiAgICAgIHRoaXMudG9vbGJhci50aXRsZSA9IFwi4pePIENvbnRyb2wgdGhlIHBsYXliYWNrIG9mIHRoZSBzZWxlY3RlZCBwYXJ0aWNsZSBzeXN0ZW1cXG7il48gUmlnaHQgY2xpY2sgcmVuZGVyIHZpZXcgdG8gYWN0aXZhdGUgY29udGlub3VzIHJlbmRlcmluZ1wiO1xyXG5cclxuICAgICAgbGV0IGJ1dHRvbnM6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgYnV0dG9ucy5pZCA9IFwiYnV0dG9uc1wiO1xyXG4gICAgICBbXCJiYWNrd2FyZFwiLCBcInBsYXlcIiwgXCJmb3J3YXJkXCJdXHJcbiAgICAgICAgLm1hcChfaWQgPT4ge1xyXG4gICAgICAgICAgbGV0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgYnV0dG9uLmlkID0gX2lkO1xyXG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidXR0b25JY29uXCIpO1xyXG4gICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0aW1lU2NhbGU6IG51bWJlciA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKCg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS5pZCkge1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJiYWNrd2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlIC09IDAuMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJwbGF5XCI6XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgPSB0aGlzLnRpbWVTY2FsZVBsYXk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwicGF1c2VcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZVNjYWxlUGxheSA9IHRpbWVTY2FsZTtcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwiZm9yd2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlICs9IDAuMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZVNjYWxlKHRpbWVTY2FsZSk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKF9idXR0b24gPT4gYnV0dG9ucy5hcHBlbmRDaGlsZChfYnV0dG9uKSk7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZChidXR0b25zKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU2NhbGVTdGVwcGVyOiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyID0gbmV3IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIoeyBrZXk6IFwidGltZVNjYWxlXCIsIGxhYmVsOiBcInRpbWVTY2FsZVwiIH0pO1xyXG4gICAgICB0aW1lU2NhbGVTdGVwcGVyLmlkID0gXCJ0aW1lc2NhbGVcIjtcclxuICAgICAgdGltZVNjYWxlU3RlcHBlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZVNjYWxlKHRpbWVTY2FsZVN0ZXBwZXIuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGltZVNjYWxlU3RlcHBlcik7XHJcblxyXG4gICAgICBsZXQgdGltZVN0ZXBwZXI6IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIgPSBuZXcgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcih7IGtleTogXCJ0aW1lXCIsIGxhYmVsOiBcInRpbWVcIiwgdmFsdWU6IFwiMFwiIH0pO1xyXG4gICAgICB0aW1lU3RlcHBlci5pZCA9IFwidGltZVwiO1xyXG4gICAgICB0aW1lU3RlcHBlci50aXRsZSA9IFwiVGhlIHRpbWUgKGluIHNlY29uZHMpIG9mIHRoZSBwYXJ0aWNsZSBzeXN0ZW1cIjtcclxuICAgICAgdGltZVN0ZXBwZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWUodGltZVN0ZXBwZXIuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGltZVN0ZXBwZXIpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTbGlkZXJTdGVwczogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aW1lU2xpZGVyU3RlcHMuaWQgPSBcInRpbWVzbGlkZXJzdGVwc1wiO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGltZVNsaWRlclN0ZXBzKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICB0aW1lU2xpZGVyLmlkID0gXCJ0aW1lc2xpZGVyXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgdGltZVNsaWRlci52YWx1ZSA9IFwiMFwiO1xyXG4gICAgICB0aW1lU2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICB0aW1lU2xpZGVyLm1heCA9IFwiMVwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnN0ZXAgPSBcImFueVwiO1xyXG4gICAgICB0aW1lU2xpZGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lKHBhcnNlRmxvYXQodGltZVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGltZVNsaWRlcik7XHJcblxyXG4gICAgICB0aGlzLnRvb2xiYXJJbnRlcnZhbElkID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jbXBQYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgbGV0IHRpbWVJblNlY29uZHM6IG51bWJlciA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZSAvIDEwMDA7XHJcbiAgICAgICAgICB0aW1lU2NhbGVTdGVwcGVyLnNldE11dGF0b3JWYWx1ZSh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZSk7XHJcbiAgICAgICAgICB0aW1lU3RlcHBlci5zZXRNdXRhdG9yVmFsdWUodGltZUluU2Vjb25kcyk7XHJcblxyXG4gICAgICAgICAgbGV0IGR1cmF0aW9uOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLmR1cmF0aW9uIC8gMTAwMDtcclxuICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHRpbWVTbGlkZXIubWF4KSAhPSBkdXJhdGlvbiAqIDEuMSkgeyAvLyB2YWx1ZSBoYXMgY2hhbmdlZFxyXG4gICAgICAgICAgICB0aW1lU2xpZGVyLm1heCA9IChkdXJhdGlvbiAqIDEuMSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdGltZVNsaWRlclN0ZXBzLmlubmVySFRNTCA9IFswLCAwLjI1LCAwLjUsIDAuNzUsIDFdXHJcbiAgICAgICAgICAgICAgLm1hcChfZmFjdG9yID0+IGR1cmF0aW9uICogX2ZhY3RvcilcclxuICAgICAgICAgICAgICAubWFwKF92YWx1ZSA9PiBgPHNwYW4gZGF0YS1sYWJlbD1cIiR7X3ZhbHVlLnRvRml4ZWQoMil9XCI+PC9zcGFuPmApLmpvaW4oXCJcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aW1lU2xpZGVyLnZhbHVlID0gdGltZUluU2Vjb25kcy50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTAwMCAvIDMwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFRpbWUoX3RpbWVJblNlY29uZHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLnNldFRpbWVTY2FsZSgwKTtcclxuICAgICAgdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lID0gX3RpbWVJblNlY29uZHMgKiAxMDAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VGltZVNjYWxlKF90aW1lU2NhbGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBfdGltZVNjYWxlID0gcGFyc2VGbG9hdChfdGltZVNjYWxlLnRvRml4ZWQoMTUpKTsgLy8gcm91bmQgc28gZm9yd2FyZCBhbmQgYmFja3dhcmQgYnV0dG9uIGRvbid0IG1pc3MgemVyb1xyXG4gICAgICBpZiAoX3RpbWVTY2FsZSAhPSAwKVxyXG4gICAgICAgIHRoaXMudGltZVNjYWxlUGxheSA9IF90aW1lU2NhbGU7XHJcbiAgICAgIHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlID0gX3RpbWVTY2FsZTtcclxuXHJcbiAgICAgIGxldCBwbGF5QnV0dG9uOiBFbGVtZW50ID0gdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGxheVwiKSB8fCB0aGlzLnRvb2xiYXIucXVlcnlTZWxlY3RvcihcIiNwYXVzZVwiKTtcclxuICAgICAgcGxheUJ1dHRvbi5pZCA9IF90aW1lU2NhbGUgPT0gMCA/IFwicGxheVwiIDogXCJwYXVzZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgc2V0UGFydGljbGVTeXN0ZW0oX3BhcnRpY2xlU3lzdGVtOiDGki5QYXJ0aWNsZVN5c3RlbSk6IHZvaWQge1xyXG4gICAgICBpZiAoIV9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy50cmVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiRHJvcCBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBwYXJ0aWNsZSBzeXN0ZW0gaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gX3BhcnRpY2xlU3lzdGVtO1xyXG4gICAgICB0aGlzLmRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KF9wYXJ0aWNsZVN5c3RlbS5kYXRhKSk7IC8vIHdlIHdpbGwgd29yayB3aXRoIGEgY29weVxyXG4gICAgICB0aGlzLnNldFRpdGxlKHRoaXMucGFydGljbGVTeXN0ZW0ubmFtZSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMudmFyaWFibGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRhdGFsaXN0XCIpO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcy5pZCA9IFwidmFyaWFibGVzXCI7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudmFyaWFibGVzKTtcclxuICAgICAgdGhpcy5yZWZyZXNoVmFyaWFibGVzKCk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudG9vbGJhcik7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtKHRoaXMuZGF0YSwgdGhpcyk7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLkN1c3RvbVRyZWU8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4odGhpcy5jb250cm9sbGVyLCB0aGlzLmRhdGEpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJPUCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DVVQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlBBU1RFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gYOKXjyBSaWdodCBjbGljayBvbiBcIiR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1cIiB0byBhZGQgcHJvcGVydGllcy5cXG7il48gUmlnaHQgY2xpY2sgb24gcHJvcGVydGllcyB0byBhZGQgdHJhbnNmb3JtYXRpb25zL2V4cHJlc3Npb25zLlxcbuKXjyBSaWdodCBjbGljayBvbiB0cmFuc2Zvcm1hdGlvbnMvZXhwcmVzc2lvbnMgdG8gYWRkIGV4cHJlc3Npb25zLlxcbuKXjyBVc2UgQ29weS9DdXQvUGFzdGUgdG8gZHVwbGljYXRlIGRhdGEuYDtcclxuICAgICAgdGhpcy50cmVlLnRpdGxlID0gdGhpcy5kb20udGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZURhdGEoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSB7XHJcbiAgICAgIGxldCBpbnZhbGlkOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgICB2YWxpZGF0ZVJlY3Vyc2l2ZShfZGF0YSk7XHJcbiAgICAgIHJldHVybiBpbnZhbGlkO1xyXG5cclxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGVSZWN1cnNpdmUoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIF9wYXRoOiBzdHJpbmdbXSA9IFtdKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgICAgbGV0IG1pblBhcmFtZXRlcnM6IG51bWJlciA9IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTl9NSU5JTVVNX1BBUkFNRVRFUlNbX2RhdGEuZnVuY3Rpb25dO1xyXG4gICAgICAgICAgaWYgKF9kYXRhLnBhcmFtZXRlcnMubGVuZ3RoIDwgxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OX01JTklNVU1fUEFSQU1FVEVSU1tfZGF0YS5mdW5jdGlvbl0pIHtcclxuICAgICAgICAgICAgbGV0IGVycm9yOiBzdHJpbmcgPSBgXCIke19wYXRoLmpvaW4oXCIvXCIpfS8ke19kYXRhLmZ1bmN0aW9ufVwiIG5lZWRzIGF0IGxlYXN0ICR7bWluUGFyYW1ldGVyc30gcGFyYW1ldGVyc2A7XHJcbiAgICAgICAgICAgIGludmFsaWQucHVzaChbX2RhdGEsIGVycm9yXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuZW50cmllcyjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGEpLmZvckVhY2goKFtfa2V5LCBfdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIF92YWx1ZSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICB2YWxpZGF0ZVJlY3Vyc2l2ZShfdmFsdWUsIF9wYXRoLmNvbmNhdChfa2V5KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGVuYWJsZVNhdmUoX29uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHJlbW90ZS5NZW51LmdldEFwcGxpY2F0aW9uTWVudSgpLmdldE1lbnVJdGVtQnlJZChNRU5VLlBST0pFQ1RfU0FWRSkuZW5hYmxlZCA9IF9vbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZnJlc2hWYXJpYWJsZXMoKTogdm9pZCB7XHJcbiAgICAgIGxldCBvcHRpb25zOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKMaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFUyk7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgIG9wdGlvbnMucHVzaCguLi50aGlzLmRhdGEudmFyaWFibGVOYW1lcyk7XHJcbiAgICAgIHRoaXMudmFyaWFibGVzLmlubmVySFRNTCA9IG9wdGlvbnMubWFwKF9uYW1lID0+IGA8b3B0aW9uIHZhbHVlPVwiJHtfbmFtZX1cIj5gKS5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFuZCBlZGl0IHRoZSBhbmltYXRhYmxlIHByb3BlcnRpZXMgb2YgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgY29tcG9uZW50IGFuaW1hdGlvbi5cclxuICAgKiBAYXV0aG9ycyBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMiB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdBbmltYXRpb24gZXh0ZW5kcyBWaWV3IHtcclxuICAgIHB1YmxpYyBrZXlTZWxlY3RlZDogxpIuQW5pbWF0aW9uS2V5O1xyXG4gICAgcHJpdmF0ZSBub2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBjbXBBbmltYXRvcjogxpIuQ29tcG9uZW50QW5pbWF0b3I7XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBwbGF5YmFja1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9wZXJ0eUxpc3Q6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjb250cm9sbGVyOiBDb250cm9sbGVyQW5pbWF0aW9uO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGZyYW1lSW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lOiDGki5UaW1lID0gbmV3IMaSLlRpbWUoKTtcclxuICAgIHByaXZhdGUgaWRJbnRlcnZhbDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKG51bGwpO1xyXG4gICAgICB0aGlzLmNyZWF0ZVRvb2xiYXIoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuSU5QVVQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRk9DVVNfSU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSB8fCAhKHNvdXJjZSBpbnN0YW5jZW9mIMaSLk5vZGUpIHx8ICFzb3VyY2UuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudEFuaW1hdG9yKT8uYW5pbWF0aW9uKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiA8xpIuTm9kZT5zb3VyY2UgfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICBpZiAodGhpcy5ub2RlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgICBsYWJlbDogXCJBZGQgUHJvcGVydHlcIixcclxuICAgICAgICAgIHN1Ym1lbnU6IHRoaXMuZ2V0Tm9kZVN1Ym1lbnUodGhpcy5ub2RlLCBwYXRoLCBfY2FsbGJhY2spXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIFByb3BlcnR5XCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1BST1BFUlRZKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNvbnZlcnQgdG8gQW5pbWF0aW9uXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ09OVkVSVF9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJDXCIgfSk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUFJPUEVSVFk6XHJcbiAgICAgICAgICAvLyBkZWZpbmVkIGluIGdldE11dGF0b3JTdWJtZW51LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBvbmx5IHdheSB0byBrZWVwIHRoZSBwYXRoIGFzc29jaWF0ZWQgd2l0aCB0aGUgbWVudSBpdGVtLCBhdHRhY2hpbmcgYW55dGhpbmcgdG8gaXRlbVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfUFJPUEVSVFk6XHJcbiAgICAgICAgICBpZiAoIShkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSByZXR1cm47XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlUHJvcGVydHkoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5TGlzdCgpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNPTlZFUlRfQU5JTUFUSU9OOlxyXG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU3ByaXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb246IMaSLkFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0aW9uLmNvbnZlcnRUb0FuaW1hdGlvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhbmltYXRpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXROb2RlU3VibWVudShfbm9kZTogxpIuTm9kZSwgX3BhdGg6IHN0cmluZ1tdLCBfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudENsYXNzIG9mIMaSLkNvbXBvbmVudC5zdWJjbGFzc2VzKSB7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgX25vZGUuZ2V0Q29tcG9uZW50cyhjb21wb25lbnRDbGFzcykuZm9yRWFjaCgoX2NvbXBvbmVudCwgX2luZGV4KSA9PiB7IC8vIHdlIG5lZWQgdG8gZ2V0IHRoZSBhdHRhY2hlZCBjb21wb25uZW50cyBhcyBhcnJheSBzbyB3ZSBjYW4gcmVjb25zdHVjdCB0aGVpciBwYXRoXHJcbiAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBPYmplY3QuYXNzaWduKFtdLCBfcGF0aCk7XHJcbiAgICAgICAgICBwYXRoLnB1c2goXCJjb21wb25lbnRzXCIpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKF9jb21wb25lbnQudHlwZSk7XHJcbiAgICAgICAgICBwYXRoLnB1c2goX2luZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfY29tcG9uZW50LmdldE11dGF0b3JGb3JBbmltYXRpb24oKTtcclxuICAgICAgICAgIGlmIChtdXRhdG9yICYmIE9iamVjdC5rZXlzKG11dGF0b3IpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgICAgICB7IGxhYmVsOiBfY29tcG9uZW50LnR5cGUsIHN1Ym1lbnU6IHRoaXMuZ2V0TXV0YXRvclN1Ym1lbnUobXV0YXRvciwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIF9ub2RlLmdldENoaWxkcmVuKCkpIHtcclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBPYmplY3QuYXNzaWduKFtdLCBfcGF0aCk7XHJcbiAgICAgICAgcGF0aC5wdXNoKFwiY2hpbGRyZW5cIik7XHJcbiAgICAgICAgcGF0aC5wdXNoKGNoaWxkLm5hbWUpO1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgIHsgbGFiZWw6IGNoaWxkLm5hbWUsIHN1Ym1lbnU6IHRoaXMuZ2V0Tm9kZVN1Ym1lbnUoY2hpbGQsIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0TXV0YXRvclN1Ym1lbnUoX211dGF0b3I6IMaSLk11dGF0b3IsIF9wYXRoOiBzdHJpbmdbXSwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBPYmplY3QuYXNzaWduKFtdLCBfcGF0aCk7XHJcbiAgICAgICAgcGF0aC5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgICBpZiAodHlwZW9mIF9tdXRhdG9yW3Byb3BlcnR5XSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHsgbGFiZWw6IHByb3BlcnR5LCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yW3Byb3BlcnR5XSwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiBwcm9wZXJ0eSwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUFJPUEVSVFkpLCBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZFByb3BlcnR5KHBhdGgsIHRoaXMubm9kZSwgdGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUb29sYmFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRvb2xiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuaWQgPSBcInRvb2xiYXJcIjtcclxuXHJcbiAgICAgIFtcInByZXZpb3VzXCIsIFwicGxheVwiLCBcIm5leHRcIl1cclxuICAgICAgICAubWFwKF9pZCA9PiB7XHJcbiAgICAgICAgICBsZXQgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICBidXR0b24uaWQgPSBfaWQ7XHJcbiAgICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidXR0b25JY29uXCI7XHJcbiAgICAgICAgICBidXR0b24ub25jbGljayA9IHRoaXMuaG5kVG9vbGJhckNsaWNrO1xyXG4gICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKF9idXR0b24gPT4gdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKF9idXR0b24pKTtcclxuXHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQubWluID0gXCIwXCI7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC5pZCA9IFwiZnJhbWVpbnB1dFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChfZXZlbnQ6IElucHV0RXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IE51bWJlci5wYXJzZUludCh0aGlzLmZyYW1lSW5wdXQudmFsdWUpICogMTAwMCAvIHRoaXMuYW5pbWF0aW9uLmZwcztcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aGlzLmZyYW1lSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVNlbGVjdGVkID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLm5vZGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuY21wQW5pbWF0b3IgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudEFuaW1hdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbXBBbmltYXRvcj8uYW5pbWF0aW9uICE9IHRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5tdXRhYmxlIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW5pbWF0b3IpIHtcclxuICAgICAgICAgICAgLy8gc3dpdGNoZWQgYW5pbWF0aW9uIGluIGEgQ29tcG9uZW50QW5pbWF0b3JcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSA9PSBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSlcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IG5vZGU6IF9ldmVudC5kZXRhaWwubXV0YWJsZS5ub2RlIH0gfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb24gfHwgX2V2ZW50LmRldGFpbC52aWV3IGluc3RhbmNlb2YgVmlld0FuaW1hdGlvblNoZWV0KSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldClcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG5cclxuICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZnJhbWVJbnB1dC52YWx1ZSA9IChNYXRoLnRydW5jKHRoaXMucGxheWJhY2tUaW1lIC8gMTAwMCAqIHRoaXMuYW5pbWF0aW9uLmZwcykpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICBsZXQgbm9kZU11dGF0b3I6IMaSLk11dGF0b3IgPSB0aGlzLmNtcEFuaW1hdG9yPy51cGRhdGVBbmltYXRpb24odGhpcy5wbGF5YmFja1RpbWUpIHx8IHt9O1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyPy51cGRhdGUobm9kZU11dGF0b3IsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5JTlBVVDpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRk9DVVNfSU46XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudERpZ2l0KVxyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci51cGRhdGVTZXF1ZW5jZSh0aGlzLnBsYXliYWNrVGltZSwgdGFyZ2V0LCBfZXZlbnQudHlwZSA9PSDGknVpLkVWRU5ULklOUFVUKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRBbmltYXRpb24oX2FuaW1hdGlvbjogxpIuQW5pbWF0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmIChfYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5TGlzdCgpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiRHJvcCBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBhbmltYXRpb24gaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnR5TGlzdCgpOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5hbmltYXRpb24uZ2V0U3RhdGUodGhpcy5wbGF5YmFja1RpbWUsIDAsIHRoaXMuY21wQW5pbWF0b3IucXVhbnRpemF0aW9uKSB8fCB7fTtcclxuXHJcbiAgICAgIGxldCBuZXdQcm9wZXJ0eUxpc3Q6IEhUTUxEaXZFbGVtZW50ID0gxpJ1aS5HZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3Iobm9kZU11dGF0b3IpO1xyXG4gICAgICBpZiAodGhpcy5kb20uY29udGFpbnModGhpcy5wcm9wZXJ0eUxpc3QpKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlcGxhY2VDaGlsZChuZXdQcm9wZXJ0eUxpc3QsIHRoaXMucHJvcGVydHlMaXN0KTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld1Byb3BlcnR5TGlzdCk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0ID0gbmV3UHJvcGVydHlMaXN0O1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5pZCA9IFwicHJvcGVydHlsaXN0XCI7XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlckFuaW1hdGlvbih0aGlzLmFuaW1hdGlvbiwgdGhpcy5wcm9wZXJ0eUxpc3QsIHRoaXMpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlKG5vZGVNdXRhdG9yKTtcclxuICAgICAgLy8gxpJ1aS1FVkVOVCBtdXN0IG5vdCBiZSBkaXNwYXRjaGVkIVxyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGknVpLkVWRU5ULkNMSUNLKSk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5wbGF5YmFja1RpbWUgfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvb2xiYXJDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAodGFyZ2V0LmlkKSB7XHJcbiAgICAgICAgY2FzZSBcInByZXZpb3VzXCI6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuY29udHJvbGxlci5uZXh0S2V5KHRoaXMucGxheWJhY2tUaW1lLCBcImJhY2t3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5pZCA9IFwicGF1c2VcIjtcclxuICAgICAgICAgICAgdGhpcy50aW1lLnNldCh0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnRpbWUuZ2V0KCkgJSB0aGlzLmFuaW1hdGlvbi50b3RhbFRpbWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibmV4dFwiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJmb3J3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhdXNlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pZEludGVydmFsID09IG51bGwpIHJldHVybjtcclxuICAgICAgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIikuaWQgPSBcInBsYXlcIjtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZW51bSBTSEVFVF9NT0RFIHtcclxuICAgIERPUEUgPSBcIkRvcGVzaGVldFwiLFxyXG4gICAgQ1VSVkVTID0gXCJDdXJ2ZXNcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBWaWV3QW5pbWF0aW9uU2VxdWVuY2Uge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uU2VxdWVuY2U7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgaW50ZXJmYWNlIFZpZXdBbmltYXRpb25LZXkge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uS2V5O1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJrZXlcIjtcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uRXZlbnQgeyAvLyBsYWJlbHMgYW5kIGV2ZW50cyBhcmUgaW1wbGVtZW50ZWQgYWxtb3N0IHRoZSBzYW1lIHdheVxyXG4gICAgZGF0YTogc3RyaW5nO1xyXG4gICAgcGF0aDJEOiBQYXRoMkQ7XHJcbiAgICB0eXBlOiBcImV2ZW50XCIgfCBcImxhYmVsXCI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFuZCBlZGl0IGFuaW1hdGlvbiBzZXF1ZW5jZXMsIGFuaW1hdGlvbiBrZXlzIGFuZCBjdXJ2ZXMgY29ubmVjdGluZyB0aGVtLlxyXG4gICAqIEBhdXRob3JzIEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdBbmltYXRpb25TaGVldCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgS0VZX1NJWkU6IG51bWJlciA9IDY7IC8vIHdpZHRoIGFuZCBoZWlnaHQgaW4gcHhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRJTUVMSU5FX0hFSUdIVDogbnVtYmVyID0gMzAuNTsgLy8gaW4gcHgsIGtlZXAgLjUgYXQgZW5kIGZvciBvZGQgbGluZSB3aWR0aFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVZFTlRTX0hFSUdIVDogbnVtYmVyID0gMzA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTQ0FMRV9XSURUSDogbnVtYmVyID0gNDA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQSVhFTF9QRVJfTUlMTElTRUNPTkQ6IG51bWJlciA9IDE7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX1ZBTFVFOiBudW1iZXIgPSAxMDA7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTUlOSU1VTV9QSVhFTF9QRVJfU1RFUDogbnVtYmVyID0gNjA7IC8vIGF0IGFueSBzY2FsaW5nLCBmb3IgYm90aCB4IGFuZCB5XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF9BTklNQVRJT05fTEVOR1RIOiBudW1iZXIgPSAxMDAwOyAvLyBpbiBtaWxpc2Vjb25kcywgdXNlZCB3aGVuIGFuaW1hdGlvbiBsZW5ndGggaXMgZmFsc3lcclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBwbGF5YmFja1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHByaXZhdGUgY3JjMjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgcHJpdmF0ZSBldmVudElucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcHJpdmF0ZSBzY3JvbGxDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQm9keTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcHJpdmF0ZSBtdHhXb3JsZFRvU2NyZWVuOiDGki5NYXRyaXgzeDMgPSBuZXcgxpIuTWF0cml4M3gzKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZEtleTogVmlld0FuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50O1xyXG4gICAgcHJpdmF0ZSBrZXlzOiBWaWV3QW5pbWF0aW9uS2V5W10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBldmVudHM6IFZpZXdBbmltYXRpb25FdmVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHNsb3BlSG9va3M6IFBhdGgyRFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBkb2N1bWVudFN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcclxuXHJcbiAgICBwcml2YXRlIHBvc1BhblN0YXJ0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoKTtcclxuICAgIHByaXZhdGUgcG9zUmlnaHRDbGljazogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcblxyXG4gICAgI21vZGU6IFNIRUVUX01PREU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIG1heWJlIHVzZSB0aGlzIHNvbHV0aW9uIGZvciBhbGwgdmlld3M/XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5pbnNldCA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUucGFkZGluZyA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5tYXJnaW4gPSBcIjAuNWVtXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuXHJcbiAgICAgIHRoaXMubW9kZSA9IFNIRUVUX01PREUuRE9QRTtcclxuXHJcbiAgICAgIF9jb250YWluZXIub24oXCJyZXNpemVcIiwgKCkgPT4gdGhpcy5kcmF3KHRydWUpKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudVNoZWV0KTtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcblxyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLm92ZXJmbG93WCA9IFwic2Nyb2xsXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJpbnN0YW50XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcmRvd24gPSB0aGlzLmhuZFBvaW50ZXJEb3duO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJ1cCA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJsZWF2ZSA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbndoZWVsID0gdGhpcy5obmRXaGVlbDtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxDb250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxCb2R5LnN0eWxlLmhlaWdodCA9IFwiMXB4XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQm9keSk7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5ldmVudElucHV0Lm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwiZXZlbnRcIikge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmV2ZW50c1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5yZW1vdmVFdmVudCh0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudCh0aGlzLmV2ZW50SW5wdXQudmFsdWUsIHRpbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuZXZlbnRJbnB1dC52YWx1ZV0gPSB0aW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSA9IHRoaXMuZXZlbnRJbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5ldmVudElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBtb2RlKCk6IFNIRUVUX01PREUge1xyXG4gICAgICByZXR1cm4gdGhpcy4jbW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBtb2RlKF9tb2RlOiBTSEVFVF9NT0RFKSB7XHJcbiAgICAgIHRoaXMuI21vZGUgPSBfbW9kZTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShfbW9kZSk7XHJcbiAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51U2hlZXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAmJiB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA8IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCkgeyAvLyBjbGljayBvbiBldmVudHNcclxuICAgICAgICBsZXQgZGVsZXRlRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmIChkZWxldGVFdmVudCkge1xyXG4gICAgICAgICAgaWYgKGRlbGV0ZUV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkRlbGV0ZSBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldEV2ZW50XCIsIGRlbGV0ZUV2ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkFkZCBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiLCB0aGlzLnNjcmVlblRvVGltZSh0aGlzLnBvc1JpZ2h0Q2xpY2sueCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wb3NSaWdodENsaWNrLnkgPiBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gdGhpcy5rZXlzLmZpbmQoX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgdGhpcy5wb3NSaWdodENsaWNrLngsIHRoaXMucG9zUmlnaHRDbGljay55KSk7XHJcbiAgICAgICAgaWYgKHRhcmdldEtleSkge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgS2V5XCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIiwgdGFyZ2V0S2V5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU0hFRVRfTU9ERS5ET1BFKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuRE9QRTtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuQ1VSVkVTKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG5cclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkRPUEUsIGxhYmVsOiBTSEVFVF9NT0RFLkRPUEUsIGNsaWNrOiAoKSA9PiB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEUgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkNVUlZFUywgbGFiZWw6IFNIRUVUX01PREUuQ1VSVkVTLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5DVVJWRVMgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkFkZCBFdmVudFwiLCBsYWJlbDogXCJBZGQgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEV2ZW50XCIsIGxhYmVsOiBcIkRlbGV0ZSBFdmVudFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgTGFiZWxcIiwgbGFiZWw6IFwiQWRkIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBMYWJlbFwiLCBsYWJlbDogXCJEZWxldGUgTGFiZWxcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEtleVwiLCBsYWJlbDogXCJEZWxldGUgS2V5XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBjaG9pY2U6IHN0cmluZyA9IF9pdGVtLmlkO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIik7XHJcbiAgICAgIGxldCB0YXJnZXRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiKTtcclxuICAgICAgbGV0IHRhcmdldFRpbWU6IG51bWJlciA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBcIkFkZCBFdmVudFwiOlxyXG4gICAgICAgICAgbGV0IGV2ZW50TmFtZTogc3RyaW5nID0gYCR7dGhpcy5hbmltYXRpb24ubmFtZX1FdmVudCR7T2JqZWN0LmtleXModGhpcy5hbmltYXRpb24uZXZlbnRzKS5sZW5ndGh9YDtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KGV2ZW50TmFtZSwgdGFyZ2V0VGltZSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGV2ZW50TmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBFdmVudFwiOlxyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGFyZ2V0RXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBZGQgTGFiZWxcIjpcclxuICAgICAgICAgIGxldCBsYWJlbE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9TGFiZWwke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxOYW1lXSA9IHRhcmdldFRpbWU7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGxhYmVsTmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBMYWJlbFwiOlxyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0YXJnZXRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBLZXlcIjpcclxuICAgICAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSB0aGlzLnNlcXVlbmNlcy5maW5kKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkuaW5jbHVkZXModGFyZ2V0S2V5LmRhdGEpKS5kYXRhO1xyXG4gICAgICAgICAgaWYgKHNlcXVlbmNlLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgxpIuRGVidWcud2FybihcIk9ubHkgb25lIGtleSBsZWZ0IGluIHNlcXVlbmNlLiBEZWxldGUgcHJvcGVydHkgaW5zdGVhZC5cIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VxdWVuY2UucmVtb3ZlS2V5KHRhcmdldEtleS5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBkcmF3aW5nXHJcbiAgICBwcml2YXRlIGRyYXcoX3Njcm9sbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kb20uY2xpZW50V2lkdGg7XHJcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuZG9tLmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgubWluKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCwgdHJhbnNsYXRpb24ueCk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uO1xyXG5cclxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUtleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaW1lbGluZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0V2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd1NjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Q3VydmVzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3S2V5cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd0hpZ2hsaWdodCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX3Njcm9sbCkge1xyXG4gICAgICAgIGxldCBsZWZ0V2lkdGg6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSDtcclxuICAgICAgICBsZXQgc2NyZWVuV2lkdGg6IG51bWJlciA9IHRoaXMuY2FudmFzLndpZHRoICsgbGVmdFdpZHRoO1xyXG4gICAgICAgIGxldCBhbmltYXRpb25XaWR0aDogbnVtYmVyID0gdGhpcy5hbmltYXRpb24/LnRvdGFsVGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggKiAyO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS53aWR0aCA9IGAke01hdGgubWF4KGFuaW1hdGlvbldpZHRoLCBzY3JlZW5XaWR0aCl9cHhgO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbExlZnQgPSBsZWZ0V2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5cygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5rZXlzID0gdGhpcy5zZXF1ZW5jZXMuZmxhdE1hcCgoX3NlcXVlbmNlLCBfaVNlcXVlbmNlKSA9PlxyXG4gICAgICAgIF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5tYXAoKF9rZXkpID0+IHtcclxuICAgICAgICAgIGxldCB2aWV3S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBfa2V5LFxyXG4gICAgICAgICAgICBjb2xvcjogX3NlcXVlbmNlLmNvbG9yLFxyXG4gICAgICAgICAgICBwYXRoMkQ6IHRoaXMuZ2VuZXJhdGVLZXkoXHJcbiAgICAgICAgICAgICAgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQoX2tleS50aW1lLCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMgPyBfa2V5LnZhbHVlIDogX2lTZXF1ZW5jZSAqIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDQpLFxyXG4gICAgICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkVcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgdHlwZTogXCJrZXlcIlxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiB2aWV3S2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICApKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkS2V5KVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVLZXkoX3Bvc2l0aW9uOiDGki5WZWN0b3IyLCBfdzogbnVtYmVyLCBfaDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8oX3Bvc2l0aW9uLnggLSBfdywgX3Bvc2l0aW9uLnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCwgX3Bvc2l0aW9uLnkgKyBfaCk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54ICsgX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55IC0gX2gpO1xyXG4gICAgICBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdUaW1lbGluZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBsZXQgYW5pbWF0aW9uU3RhcnQ6IG51bWJlciA9IE1hdGgubWluKC4uLnRoaXMua2V5cy5tYXAoX2tleSA9PiBfa2V5LmRhdGEudGltZSkpICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54O1xyXG4gICAgICBsZXQgYW5pbWF0aW9uRW5kOiBudW1iZXIgPSBNYXRoLm1heCguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjIpXCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChhbmltYXRpb25TdGFydCwgMCwgYW5pbWF0aW9uRW5kIC0gYW5pbWF0aW9uU3RhcnQsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICBsZXQgZnBzOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIGxldCBwaXhlbFBlckZyYW1lOiBudW1iZXIgPSAoMTAwMCAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpIC8gZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJTdGVwOiBudW1iZXIgPSBwaXhlbFBlckZyYW1lICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueDtcclxuICAgICAgbGV0IGZyYW1lc1BlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIGRvIHRoaXMgd2l0aCBPKDEpO1xyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDMsIDIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAyO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgZnJhbWVzUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc3ViU3RlcHM6IG51bWJlciA9IDA7XHJcbiAgICAgIGxldCBoaWdoU3RlcHM6IG51bWJlciA9IDA7IC8vIGV2ZXJ5IG50aCBzdGVwIHdpbGwgYmUgaGlnaGVyXHJcbiAgICAgIGlmIChmcmFtZXNQZXJTdGVwICE9IDEpIHtcclxuICAgICAgICBpZiAoZnJhbWVzUGVyU3RlcCA9PSA1KSB7XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXRjaCAoaU11bHRpcGxpZXJzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAzO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA1O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMjtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBncmlkTGluZXM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgbGV0IHRpbWVTdGVwczogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgdGhpcy5jcmMyLnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICB0aGlzLmNyYzIuZm9udCA9IHRoaXMuZG9jdW1lbnRTdHlsZS5mb250O1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMud2lkdGggLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB4U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KTtcclxuICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gMjApO1xyXG4gICAgICAgIGdyaWRMaW5lcy5tb3ZlVG8oeFN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcbiAgICAgICAgZ3JpZExpbmVzLmxpbmVUbyh4U3RlcCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gaVN0ZXAgKiBmcmFtZXNQZXJTdGVwIC8gZnBzO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIGAke3RpbWUudG9GaXhlZCgyKX1gLFxyXG4gICAgICAgICAgeFN0ZXAgKyAzLFxyXG4gICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeFN1YlN0ZXA6IG51bWJlciA9IHhTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICAgIHRpbWVTdGVwcy5saW5lVG8oeFN1YlN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAoaVN1YlN0ZXAgJSBoaWdoU3RlcHMgPT0gMCA/IDEyIDogOCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSh0aW1lU3RlcHMpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKGdyaWRMaW5lcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3RXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgdG90YWxIZWlnaHQ6IG51bWJlciA9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVDtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIDAuNSwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIHRvdGFsSGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdO1xyXG4gICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGxhYmVsIGluIHRoaXMuYW5pbWF0aW9uLmxhYmVscykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxdKTtcclxuICAgICAgICBsZXQgdmlld0xhYmVsOiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGxhYmVsLCBwYXRoMkQ6IGdlbmVyYXRlTGFiZWwoeCksIHR5cGU6IFwibGFiZWxcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0xhYmVsKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdMYWJlbC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IGluIHRoaXMuYW5pbWF0aW9uLmV2ZW50cykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5ldmVudHNbZXZlbnRdKTtcclxuICAgICAgICBsZXQgdmlld0V2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGV2ZW50LCBwYXRoMkQ6IGdlbmVyYXRlRXZlbnQoeCksIHR5cGU6IFwiZXZlbnRcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0V2ZW50KTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdFdmVudC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB0aGlzLmV2ZW50cy5maW5kKF9ldmVudCA9PiBfZXZlbnQuZGF0YSA9PSB0aGlzLnNlbGVjdGVkRXZlbnQ/LmRhdGEpO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdGhpcy5zZWxlY3RlZEV2ZW50ID09IG51bGw7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkRXZlbnQucGF0aDJEKTtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUubGVmdCA9IGAkeyh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIgPyB0aGlzLmFuaW1hdGlvbi5ldmVudHMgOiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIDEyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuY2xhc3NOYW1lID0gdGhpcy5zZWxlY3RlZEV2ZW50LnR5cGU7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwibGFiZWxcIilcclxuICAgICAgICAvLyAgIHRoaXMuZXZlbnRJbnB1dC5zdHlsZS50b3AgPSBgJHtWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUfXB4YDtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUIC8gMiAtIDJ9cHhgO1xyXG4gICAgICAgIHRoaXMuZXZlbnRJbnB1dC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuc2F2ZSgpO1xyXG4gICAgICB0aGlzLmNyYzIucmVjdCgwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIuY2xpcCgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVFdmVudChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMTApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSAxNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICAvLyBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZUxhYmVsKF94OiBudW1iZXIpOiBQYXRoMkQge1xyXG4gICAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEO1xyXG4gICAgICAgIHBhdGgubW92ZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDI2KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMjApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDE0KTtcclxuICAgICAgICAvLyBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1NjYWxlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY2VudGVyOiBudW1iZXIgPSB0aGlzLnJvdW5kKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gLXRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnk7XHJcbiAgICAgIGxldCB2YWx1ZVBlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAwO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgdmFsdWVQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gNDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcblxyXG4gICAgICBsZXQgc3RlcHM6IG51bWJlciA9IDEgKyB0aGlzLmNhbnZhcy5oZWlnaHQgLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB5U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3RlcCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmxpbmVUbyhWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggLSA1LCB5U3RlcCk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSAtaVN0ZXAgKiB2YWx1ZVBlclN0ZXA7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxUZXh0KFxyXG4gICAgICAgICAgdmFsdWVQZXJTdGVwID49IDEgPyB2YWx1ZS50b0ZpeGVkKDApIDogdmFsdWUudG9GaXhlZCgxKSxcclxuICAgICAgICAgIDMzLFxyXG4gICAgICAgICAgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeVN1YlN0ZXA6IG51bWJlciA9IHlTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBhZGQgY29ycmVjdCBkcmF3aW5nIGZvciBjb25zdGFudC9zdGVwIGludGVycG9sYXRlZCBrZXlzXHJcbiAgICBwcml2YXRlIGRyYXdDdXJ2ZXMoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qgc2VxdWVuY2Ugb2YgdGhpcy5zZXF1ZW5jZXMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSBzZXF1ZW5jZS5jb2xvcjtcclxuICAgICAgICBzZXF1ZW5jZS5kYXRhLmdldEtleXMoKVxyXG4gICAgICAgICAgLm1hcCgoX2tleSwgX2luZGV4LCBfa2V5cykgPT4gW19rZXksIF9rZXlzW19pbmRleCArIDFdXSlcclxuICAgICAgICAgIC5maWx0ZXIoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBfa2V5U3RhcnQgJiYgX2tleUVuZClcclxuICAgICAgICAgIC5tYXAoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBnZXRCZXppZXJQb2ludHMoX2tleVN0YXJ0LmZ1bmN0aW9uT3V0LCBfa2V5U3RhcnQsIF9rZXlFbmQpKVxyXG4gICAgICAgICAgLmZvckVhY2goKF9iZXppZXJQb2ludHMpID0+IHtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiBfcG9pbnQudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbikpO1xyXG4gICAgICAgICAgICBsZXQgY3VydmU6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgICAgICAgY3VydmUubW92ZVRvKF9iZXppZXJQb2ludHNbMF0ueCwgX2JlemllclBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgY3VydmUuYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzFdLngsIF9iZXppZXJQb2ludHNbMV0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzJdLngsIF9iZXppZXJQb2ludHNbMl0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzNdLngsIF9iZXppZXJQb2ludHNbM10ueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKGN1cnZlKTtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiDGki5SZWN5Y2xlci5zdG9yZShfcG9pbnQpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRCZXppZXJQb2ludHMoX2FuaW1hdGlvbkZ1bmN0aW9uOiDGki5BbmltYXRpb25GdW5jdGlvbiwgX2tleVN0YXJ0OiDGki5BbmltYXRpb25LZXksIF9rZXlFbmQ6IMaSLkFuaW1hdGlvbktleSk6IMaSLlZlY3RvcjJbXSB7XHJcbiAgICAgICAgbGV0IHBhcmFtZXRlcnM6IHsgYTogbnVtYmVyOyBiOiBudW1iZXI7IGM6IG51bWJlcjsgZDogbnVtYmVyIH0gPSBfYW5pbWF0aW9uRnVuY3Rpb24uZ2V0UGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNvbnN0IHBvbGFyRm9ybTogKHU6IG51bWJlciwgdjogbnVtYmVyLCB3OiBudW1iZXIpID0+IG51bWJlciA9IChfdSwgX3YsIF93KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmEgKiBfdSAqIF92ICogX3cgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmIgKiAoKF92ICogX3cgKyBfdyAqIF91ICsgX3UgKiBfdikgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuYyAqICgoX3UgKyBfdiArIF93KSAvIDMpICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5kXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHhTdGFydDogbnVtYmVyID0gX2tleVN0YXJ0LnRpbWU7XHJcbiAgICAgICAgbGV0IHhFbmQ6IG51bWJlciA9IF9rZXlFbmQudGltZTtcclxuICAgICAgICBsZXQgb2Zmc2V0VGltZUVuZDogbnVtYmVyID0geEVuZCAtIHhTdGFydDtcclxuXHJcbiAgICAgICAgbGV0IHBvaW50czogxpIuVmVjdG9yMltdID0gbmV3IEFycmF5KDQpLmZpbGwoMCkubWFwKCgpID0+IMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSk7XHJcbiAgICAgICAgcG9pbnRzWzBdLnNldCh4U3RhcnQsIHBvbGFyRm9ybSgwLCAwLCAwKSk7XHJcbiAgICAgICAgcG9pbnRzWzFdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMSAvIDMsIHBvbGFyRm9ybSgwLCAwLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzJdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMiAvIDMsIHBvbGFyRm9ybSgwLCBvZmZzZXRUaW1lRW5kLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzNdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kLCBwb2xhckZvcm0ob2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3S2V5cygpOiB2b2lkIHtcclxuICAgICAgLy8gZHJhdyB1bnNlbGVjdGVkIGtleXNcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDQ7XHJcbiAgICAgIHRoaXMua2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGlmIChfa2V5ID09IHRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IF9rZXkuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShfa2V5LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwoX2tleS5wYXRoMkQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYXcgc2VsZWN0ZWQga2V5XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuc2VsZWN0ZWRLZXkuY29sb3I7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkS2V5LnBhdGgyRCk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNsb3BlIGhvb2tzXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuY3JjMi5zdHJva2VTdHlsZTtcclxuXHJcbiAgICAgIGxldCBbbGVmdCwgcmlnaHRdID0gW8aSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSwgxpIuUmVjeWNsZXIuZ2V0KMaSLlZlY3RvcjIpXTtcclxuICAgICAgbGVmdC5zZXQoLTUwLCAwKTtcclxuICAgICAgcmlnaHQuc2V0KDUwLCAwKTtcclxuXHJcbiAgICAgIGxldCBhbmdsZVNsb3BlU2NyZWVuOiBudW1iZXIgPSBNYXRoLmF0YW4odGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gKiAodGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpKSAqICgxODAgLyBNYXRoLlBJKTsgLy8gaW4gZGVncmVlXHJcbiAgICAgIGxldCBtdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MyA9IMaSLk1hdHJpeDN4My5JREVOVElUWSgpO1xyXG4gICAgICBtdHhUcmFuc2Zvcm0udHJhbnNsYXRlKHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnJvdGF0ZShhbmdsZVNsb3BlU2NyZWVuKTtcclxuICAgICAgbGVmdC50cmFuc2Zvcm0obXR4VHJhbnNmb3JtKTtcclxuICAgICAgcmlnaHQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcblxyXG4gICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG4gICAgICBwYXRoLm1vdmVUbyhsZWZ0LngsIGxlZnQueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKHJpZ2h0LngsIHJpZ2h0LnkpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHBhdGgpO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MgPSBbdGhpcy5nZW5lcmF0ZUtleShsZWZ0LCA1LCA1KSwgdGhpcy5nZW5lcmF0ZUtleShyaWdodCwgNSwgNSldO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MuZm9yRWFjaChfaG9vayA9PiB0aGlzLmNyYzIuZmlsbChfaG9vaykpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobGVmdCk7XHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHJpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdDdXJzb3IoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5yZXN0b3JlKCk7XHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgIGxldCBjdXJzb3I6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgY3Vyc29yLm1vdmVUbyh4LCAwKTtcclxuICAgICAgY3Vyc29yLmxpbmVUbyh4LCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0hpZ2hsaWdodCgpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcG9zU2NyZWVuOiDGki5WZWN0b3IyID0gdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSk7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItaGlnaGxpZ2h0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiNjZcIjtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgMCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiMjZcIjtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBwb3NTY3JlZW4ueCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QocG9zU2NyZWVuLnggLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZXZlbnQgaGFuZGxpbmdcclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyA9PSB0aGlzKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbjtcclxuICAgICAgICAgICAgLy8gdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsICgpID0+IHRoaXMucmVzZXRWaWV3KTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFZpZXcoKTsgdGhpcy5hbmltYXRlKCk7IHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSBfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IGZpbmRPYmplY3Q6IChfb2JqZWN0OiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50KSA9PiBib29sZWFuID0gX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQuYnV0dG9ucykge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIGlmIChfZXZlbnQub2Zmc2V0WSA+ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuY2xpZW50SGVpZ2h0KSAvLyBjbGlja2VkIG9uIHNjcm9sbCBiYXJcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB0aGlzLmhuZFNjcm9sbDtcclxuICAgICAgICAgIGVsc2UgaWYgKF9ldmVudC5vZmZzZXRZIDw9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpIHtcclxuICAgICAgICAgICAgdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lKF9ldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlVGltZWxpbmU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2xvcGVIb29rcy5zb21lKF9ob29rID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9ob29rLCBfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVNsb3BlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50ID1cclxuICAgICAgICAgICAgICB0aGlzLmtleXMuZmluZChmaW5kT2JqZWN0KSB8fFxyXG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmZpbmQoZmluZE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEtleSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IG51bGwgfSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHN3aXRjaCAoc2VsZWN0ZWQudHlwZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJsYWJlbFwiOlxyXG4gICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdFdmVudDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJrZXlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlRHJhZ0tleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5zZWxlY3RlZEtleS5kYXRhIH0gfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMucG9zUmlnaHRDbGljay54ID0gX2V2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA9IF9ldmVudC5vZmZzZXRZO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgdGhpcy5wb3NQYW5TdGFydCA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVBhbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlck1vdmVUaW1lbGluZSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNjcmVlblRvVGltZShfZXZlbnQub2Zmc2V0WCk7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlU2xvcGUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB2Y3REZWx0YTogxpIuVmVjdG9yMiA9IMaSLlZlY3RvcjIuRElGRkVSRU5DRShuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpLCB0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIHZjdERlbHRhLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuU0NBTElORyjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pLnNjYWxpbmcpKTtcclxuICAgICAgbGV0IHNsb3BlOiBudW1iZXIgPSB2Y3REZWx0YS55IC8gdmN0RGVsdGEueDtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gPSBzbG9wZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlT3V0ID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlUGFuID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UodGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy5wb3NQYW5TdGFydCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFKVxyXG4gICAgICAgIHRyYW5zbGF0aW9uLnkgPSAwO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0tleSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgbGV0IHBpeGVsUGVyRnJhbWU6IG51bWJlciA9IDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1heCgwLCB0cmFuc2xhdGlvbi54KTtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgucm91bmQodHJhbnNsYXRpb24ueCAvIHBpeGVsUGVyRnJhbWUpICogcGl4ZWxQZXJGcmFtZTtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YTtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IHRoaXMuc2VxdWVuY2VzLmZpbmQoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5pbmNsdWRlcyhrZXkpKS5kYXRhO1xyXG4gICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCB0cmFuc2xhdGlvbi54LCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFIHx8IF9ldmVudC5zaGlmdEtleSA/IG51bGwgOiB0cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0ga2V5LnRpbWU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0V2ZW50ID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhLCB0aW1lKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gPSB0aW1lO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwpXHJcbiAgICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMCkgcmV0dXJuO1xyXG4gICAgICBsZXQgem9vbUZhY3RvcjogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyAxLjA1IDogMC45NTtcclxuICAgICAgbGV0IHBvc0N1cnNvcldvcmxkOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSBfZXZlbnQuc2hpZnRLZXkgPyAxIDogem9vbUZhY3RvcjtcclxuICAgICAgbGV0IHk6IG51bWJlciA9IF9ldmVudC5jdHJsS2V5IHx8IHRoaXMubW9kZSA9PSBTSEVFVF9NT0RFLkRPUEUgPyAxIDogem9vbUZhY3RvcjtcclxuXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGUocG9zQ3Vyc29yV29ybGQpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGUobmV3IMaSLlZlY3RvcjIoeCwgeSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKMaSLlZlY3RvcjIuU0NBTEUocG9zQ3Vyc29yV29ybGQsIC0xKSk7XHJcblxyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kU2Nyb2xsID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IC10aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnBsYXliYWNrVGltZSB9IH0pO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldFZpZXcoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5yZXNldCgpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpOyAvLyBhcHBseSBzY2FsaW5nXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVgoKHRoaXMuY2FudmFzLndpZHRoIC0gMiAqIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCkgLyAoKHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgfHwgVmlld0FuaW1hdGlvblNoZWV0LlNUQU5EQVJEX0FOSU1BVElPTl9MRU5HVEgpKSk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVYKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVZKC0xKTsgLy8gZmxpcCB5XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWShWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG5cclxuICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgICAgLm1hcChfa2V5ID0+IF9rZXkudmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gdmFsdWVzLnJlZHVjZSgoX2EsIF9iKSA9PiBNYXRoLm1pbihfYSwgX2IpKTsgLy8gaW4gd29ybGQgc3BhY2VcclxuICAgICAgICAgIGxldCBtYXg6IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5tYXgoX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgdmlld0hlaWdodDogbnVtYmVyID0gKHRoaXMuY2FudmFzLmhlaWdodCAtIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7IC8vIGluIHB4XHJcbiAgICAgICAgICBpZiAobWluICE9IG1heClcclxuICAgICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSh2aWV3SGVpZ2h0IC8gKCgobWF4IC0gbWluKSAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfVkFMVUUpICogMS4yKSk7XHJcbiAgICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWSh2aWV3SGVpZ2h0IC0gbWluICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVZKFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1dvcmxkUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHdvcmxkVG9TY3JlZW5Qb2ludChfeDogbnVtYmVyLCBfeTogbnVtYmVyKTogxpIuVmVjdG9yMiB7XHJcbiAgICAgIGxldCB2ZWN0b3I6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfeCwgX3kpO1xyXG4gICAgICB2ZWN0b3IudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbik7XHJcbiAgICAgIHZlY3Rvci54ID0gdGhpcy5yb3VuZCh2ZWN0b3IueCk7XHJcbiAgICAgIHZlY3Rvci55ID0gdGhpcy5yb3VuZCh2ZWN0b3IueSk7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1RpbWUoX3g6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIGxldCBwbGF5YmFja1RpbWU6IG51bWJlciA9IE1hdGgubWF4KDAsIChfeCAtIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpO1xyXG4gICAgICByZXR1cm4gcGxheWJhY2tUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZVRvU2NyZWVuKF90aW1lOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3VuZChfdGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByb3VuZChfdmFsdWU6IG51bWJlcik6IG51bWJlciB7IC8vIHRoaXMgaXMgbmVlZGVkIGZvciBsaW5lcyB0byBiZSBkaXNwbGF5ZWQgY3Jpc3Agb24gdGhlIGNhbnZhc1xyXG4gICAgICBpZiAoTWF0aC50cnVuYyh0aGlzLmNyYzIubGluZVdpZHRoKSAlIDIgPT0gMClcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpOyAvLyBldmVuIGxpbmUgd2lkdGhcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKF92YWx1ZSkgKyAwLjU7IC8vIG9kZCBsaW5lIHdpZHRoXHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gTUVOVSB7XHJcbiAgICBDT01QT05FTlRNRU5VID0gXCJBZGQgQ29tcG9uZW50c1wiXHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBleGFtaW4gcHJvYmxlbSB3aXRoIMaSLk1hdGVyaWFsIHdoZW4gdXNpbmcgXCJ0eXBlb2YgxpIuTXV0YWJsZVwiIGFzIGtleSB0byB0aGUgbWFwXHJcbiAgbGV0IHJlc291cmNlVG9Db21wb25lbnQ6IE1hcDxGdW5jdGlvbiwgdHlwZW9mIMaSLkNvbXBvbmVudD4gPSBuZXcgTWFwPEZ1bmN0aW9uLCB0eXBlb2YgxpIuQ29tcG9uZW50PihbXHJcbiAgICBbxpIuQXVkaW8sIMaSLkNvbXBvbmVudEF1ZGlvXSxcclxuICAgIFvGki5NYXRlcmlhbCwgxpIuQ29tcG9uZW50TWF0ZXJpYWxdLFxyXG4gICAgW8aSLk1lc2gsIMaSLkNvbXBvbmVudE1lc2hdLFxyXG4gICAgW8aSLkFuaW1hdGlvbiwgxpIuQ29tcG9uZW50QW5pbWF0b3JdLFxyXG4gICAgW8aSLlBhcnRpY2xlU3lzdGVtLCDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbV1cclxuICBdKTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbGwgY29tcG9uZW50cyBhdHRhY2hlZCB0byBhIG5vZGVcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdDb21wb25lbnRzIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIGV4cGFuZGVkOiB7IFt0eXBlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7IENvbXBvbmVudFRyYW5zZm9ybTogdHJ1ZSB9O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZDogc3RyaW5nID0gXCJDb21wb25lbnRUcmFuc2Zvcm1cIjtcclxuICAgIHByaXZhdGUgZHJhZzogxpIuQ29tcG9uZW50Q2FtZXJhO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgdGhpcy5obmRUcmFuc2Zvcm0pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkVYUEFORCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT0xMQVBTRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLkNvbXBvbmVudENhbWVyYVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZHJhZyA/IFt0aGlzLmRyYWddIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0NPTVBPTkVOVCwgxpIuQ29tcG9uZW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBKb2ludFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5BRERfSk9JTlQsIMaSLkpvaW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0pPSU5ULCDGki5Kb2ludCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgQ29tcG9uZW50XCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX0NPTVBPTkVOVCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgaVN1YmNsYXNzOiBudW1iZXIgPSBfaXRlbVtcImlTdWJjbGFzc1wiXTtcclxuICAgICAgbGV0IGNvbXBvbmVudDogdHlwZW9mIMaSLkNvbXBvbmVudDtcclxuXHJcbiAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuQ29tcG9uZW50LnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX0pPSU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuSm9pbnQuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkJPRFlcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50LnRhZ05hbWUpO1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KGVsZW1lbnQsIFwiY29udHJvbGxlclwiKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkRFVEFJTFNcIiAmJiBjb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGRldGFpbDogeyBtdXRhYmxlOiA8xpIuTXV0YWJsZT5jb250cm9sbGVyLmdldE11dGFibGUoKSB9IH0pO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjb21wb25lbnQpIC8vIGV4cGVyaW1lbnRhbCBmaXggZm9yIHRoZSBzcG9yYWRpYyBcImNvbXBvbmVudCBpcyBub3QgYSBjb25zdHJ1Y3RvclwiIGJ1Z1xyXG4gICAgICAgIGNvbXBvbmVudCA9IMaSW19pdGVtLmxhYmVsXTtcclxuXHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICBsZXQgY21wTmV3OiDGki5Db21wb25lbnQgPSBuZXcgY29tcG9uZW50KCk7XHJcbiAgICAgIGlmICgoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5IHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFZSRGV2aWNlIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFdhbGtlcikgJiYgIXRoaXMubm9kZS5jbXBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBhbGVydChgVG8gYXR0YWNoIGEgJHtjbXBOZXcudHlwZX0sIGZpcnN0IGF0dGFjaCBhICR7xpIuQ29tcG9uZW50VHJhbnNmb3JtLm5hbWV9LmApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50R3JhcGhGaWx0ZXIgJiYgISh0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaCB8fCB0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKSkge1xyXG4gICAgICAgIGFsZXJ0KGBBdHRhY2ggJHvGki5Db21wb25lbnRHcmFwaEZpbHRlci5uYW1lfSBvbmx5IHRvICR7xpIuR3JhcGgubmFtZX0gb3IgJHvGki5HcmFwaEluc3RhbmNlLm5hbWV9c2ApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGb2cgfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW1iaWVudE9jY2x1c2lvbiB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRCbG9vbSkge1xyXG4gICAgICAgIGxldCBjYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50Q2FtZXJhKSA/PyB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFZSRGV2aWNlKTtcclxuICAgICAgICBpZiAoIWNhbWVyYSkge1xyXG4gICAgICAgICAgYWxlcnQoYFRvIGF0dGFjaCBhICR7Y21wTmV3LnR5cGV9LCBmaXJzdCBhdHRhY2ggYSAke8aSLkNvbXBvbmVudENhbWVyYS5uYW1lfSBvciAke8aSLkNvbXBvbmVudFZSRGV2aWNlLm5hbWV9LmApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGNtcE5ldy50eXBlLCBjbXBOZXcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLm5vZGUgfSB9KTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLm5vZGUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBpZiAodGhpcy5kb20gIT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdTY3JpcHQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBpZiAoIXNvdXJjZS5pc0NvbXBvbmVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZmluZENvbXBvbmVudFR5cGUoc291cmNlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgLy8gICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGxldCBjbXBOZXc6IMaSLkNvbXBvbmVudCA9IHRoaXMuY3JlYXRlQ29tcG9uZW50KHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICAgIHRoaXMuZXhwYW5kZWRbY21wTmV3LnR5cGVdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByb3RlY3RHcmFwaEluc3RhbmNlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAvLyBpbmhpYml0IHN0cnVjdHVyYWwgY2hhbmdlcyB0byBhIEdyYXBoSW5zdGFuY2VcclxuICAgICAgbGV0IGNoZWNrOiDGki5Ob2RlID0gdGhpcy5ub2RlO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgaWYgKGNoZWNrIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSkge1xyXG4gICAgICAgICAgYWxlcnQoYEVkaXQgdGhlIGdyYXBoIFwiJHtjaGVjay5uYW1lfVwiIHRvIG1ha2UgY2hhbmdlcyB0byBpdHMgc3RydWN0dXJlIGFuZCB0aGVuIHJlbG9hZCB0aGUgcHJvamVjdGApO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoZWNrID0gY2hlY2suZ2V0UGFyZW50KCk7XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgY250RW1wdHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5ub2RlIHx8ICEodGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuTm9kZSkpIHsgIC8vIFRPRE86IGV4YW1pbmUsIGlmIGFueXRoaW5nIG90aGVyIHRoYW4gbm9kZSBjYW4gYXBwZWFyIGhlcmUuLi5cclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLmRvbS50aXRsZSA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBjb21wb25lbnRzXCI7XHJcbiAgICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgY29tcG9uZW50c1wiO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50cyB8IFwiICsgdGhpcy5ub2RlLm5hbWUpO1xyXG5cclxuICAgICAgbGV0IGNvbXBvbmVudHM6IMaSLkNvbXBvbmVudFtdID0gdGhpcy5ub2RlLmdldEFsbENvbXBvbmVudHMoKTtcclxuICAgICAgaWYgKCFjb21wb25lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgY29tcG9uZW50cykge1xyXG4gICAgICAgIGxldCBkZXRhaWxzOiDGklVpLkRldGFpbHMgPSDGklVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoY29tcG9uZW50KTtcclxuICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IG5ldyBDb250cm9sbGVyRGV0YWlsKGNvbXBvbmVudCwgZGV0YWlscyk7XHJcbiAgICAgICAgUmVmbGVjdC5zZXQoZGV0YWlscywgXCJjb250cm9sbGVyXCIsIGNvbnRyb2xsZXIpOyAvLyBpbnNlcnQgYSBsaW5rIGJhY2sgdG8gdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICBkZXRhaWxzLmV4cGFuZCh0aGlzLmV4cGFuZGVkW2NvbXBvbmVudC50eXBlXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGRldGFpbHMpO1xyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRDYW1lcmEpIHtcclxuICAgICAgICAgIGRldGFpbHMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGRldGFpbHMuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoX2V2ZW50OiBFdmVudCkgPT4geyB0aGlzLmRyYWcgPSA8xpIuQ29tcG9uZW50Q2FtZXJhPmNvbXBvbmVudDsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRSaWdpZGJvZHkpIHtcclxuICAgICAgICAgIGxldCBwaXZvdDogSFRNTEVsZW1lbnQgPSBjb250cm9sbGVyLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltrZXk9J210eFBpdm90J1wiKTtcclxuICAgICAgICAgIGxldCBvcGFjaXR5OiBzdHJpbmcgPSBwaXZvdC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgICAgICAgc2V0UGl2b3RPcGFjaXR5KG51bGwpO1xyXG4gICAgICAgICAgY29udHJvbGxlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHNldFBpdm90T3BhY2l0eSk7XHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRQaXZvdE9wYWNpdHkoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb246IMaSLkJPRFlfSU5JVCA9IGNvbnRyb2xsZXIuZ2V0TXV0YXRvcih7IGluaXRpYWxpemF0aW9uOiAwIH0pLmluaXRpYWxpemF0aW9uO1xyXG4gICAgICAgICAgICBwaXZvdC5zdHlsZS5vcGFjaXR5ID0gaW5pdGlhbGl6YXRpb24gPT0gxpIuQk9EWV9JTklULlRPX1BJVk9UID8gb3BhY2l0eSA6IFwiMC4zXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGYWNlQ2FtZXJhKSB7XHJcbiAgICAgICAgICBsZXQgdXA6IEhUTUxFbGVtZW50ID0gY29udHJvbGxlci5kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJba2V5PSd1cCdcIik7XHJcbiAgICAgICAgICBsZXQgb3BhY2l0eTogc3RyaW5nID0gdXAuc3R5bGUub3BhY2l0eTtcclxuICAgICAgICAgIHNldFVwT3BhY2l0eShudWxsKTtcclxuICAgICAgICAgIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCBzZXRVcE9wYWNpdHkpO1xyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0VXBPcGFjaXR5KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IHVwTG9jYWw6IGJvb2xlYW4gPSBjb250cm9sbGVyLmdldE11dGF0b3IoeyB1cExvY2FsOiB0cnVlIH0pLnVwTG9jYWw7XHJcbiAgICAgICAgICAgIHVwLnN0eWxlLm9wYWNpdHkgPSAhdXBMb2NhbCA/IG9wYWNpdHkgOiBcIjAuM1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGV0YWlscy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgPT0gdGhpcy5zZWxlY3RlZClcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KGRldGFpbHMsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlIHx8IF9ldmVudC5kZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGxldCBjb21wb25lbnQ6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+X2V2ZW50LmRldGFpbC5tdXRhYmxlO1xyXG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkNMSUNLOlxyXG4gICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5TUEFDRSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiDGklVpLkRldGFpbHMgPSA8xpJVaS5EZXRhaWxzPl9ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT0gXCJTVU1NQVJZXCIpXHJcbiAgICAgICAgICAgIHRhcmdldCA9IDzGklVpLkRldGFpbHM+dGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTERldGFpbHNFbGVtZW50IHx8ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbS5yZXBsYWNlQ2hpbGQodGFyZ2V0LCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgfHwgdGhpcy5nZXRTZWxlY3RlZCgpICE9IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChfZTogdW5rbm93bikgeyAvKiAqLyB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5DT0xMQVBTRTpcclxuICAgICAgICAgIHRoaXMuZXhwYW5kZWRbKDzGklVpLkRldGFpbHM+X2V2ZW50LnRhcmdldCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKV0gPSAoX2V2ZW50LnR5cGUgPT0gxpJVaS5FVkVOVC5FWFBBTkQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIGxldCBjbXBSaWdpZGJvZHk6IMaSLkNvbXBvbmVudFJpZ2lkYm9keSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50UmlnaWRib2R5KTtcclxuICAgICAgICAgIGlmIChjbXBSaWdpZGJvZHkpIFxyXG4gICAgICAgICAgICBjbXBSaWdpZGJvZHkuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgLy8gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiB0aGlzLm5vZGUgfSB9KTsgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyB3YXMgbmVjZXNzYXJ5LCBFVkVOVF9FRElUT1IuVVBEQVRFIGdldHMgYnJvYWRjYXN0ZWQgYnkgcHJvamVjdCBvbiDGki5FVkVOVC5HUkFQSF9NVVRBVEVELCBzbyB0aGlzIHdhcyBjYXVzaW5nIGEgZG91YmxlIGJyb2FkY2FzdCBvZiBFVkVOVF9FRElUT1IuVVBEQVRFIHRvIEFMTCB2aWV3cyBvbiBhbnkgY2hhbmdlIHRvIGFueSBjb21wb25lbnRcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpJVaS5FVkVOVC5SRUFSUkFOR0VfQVJSQVk6IC8vIG5vIGxpc3RlbmVyIGZvciB0aGlzIGV2ZW50XHJcbiAgICAgICAgLy8gICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUcmFuc2Zvcm0gPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZ2V0U2VsZWN0ZWQoKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZ2V0U2VsZWN0ZWQoKSwgXCJjb250cm9sbGVyXCIpO1xyXG4gICAgICBsZXQgY29tcG9uZW50OiDGki5Db21wb25lbnQgPSA8xpIuQ29tcG9uZW50PmNvbnRyb2xsZXIuZ2V0TXV0YWJsZSgpO1xyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXg0eDQgPSBSZWZsZWN0LmdldChjb21wb25lbnQsIFwibXR4TG9jYWxcIikgfHwgUmVmbGVjdC5nZXQoY29tcG9uZW50LCBcIm10eFBpdm90XCIpO1xyXG4gICAgICBpZiAoIW10eFRyYW5zZm9ybSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZHRsOiDGki5HZW5lcmFsID0gX2V2ZW50LmRldGFpbC50cmFuc2Zvcm07XHJcbiAgICAgIGxldCBtdHhDYW1lcmE6IMaSLk1hdHJpeDR4NCA9ICg8xpIuQ29tcG9uZW50Q2FtZXJhPmR0bC5jYW1lcmEpLm5vZGUubXR4V29ybGQ7XHJcbiAgICAgIGxldCBkaXN0YW5jZTogbnVtYmVyID0gbXR4Q2FtZXJhLmdldFRyYW5zbGF0aW9uVG8odGhpcy5ub2RlLm10eFdvcmxkKS5tYWduaXR1ZGU7XHJcbiAgICAgIGlmIChkdGwudHJhbnNmb3JtID09IFRSQU5TRk9STS5ST1RBVEUpXHJcbiAgICAgICAgW2R0bC54LCBkdGwueV0gPSBbZHRsLnksIGR0bC54XTtcclxuXHJcbiAgICAgIGxldCB2YWx1ZTogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKCk7XHJcbiAgICAgIHZhbHVlLnggPSAoZHRsLnJlc3RyaWN0aW9uID09IFwieFwiID8gIWR0bC5pbnZlcnRlZCA6IGR0bC5pbnZlcnRlZCkgPyBkdGwueCA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueSA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ5XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/IC1kdGwueSA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueiA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ6XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/XHJcbiAgICAgICAgKCh2YWx1ZS54ID09IHVuZGVmaW5lZCkgPyAtZHRsLnkgOiBkdGwueCkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUubWFwKChfYzogbnVtYmVyKSA9PiBfYyB8fCAwKTtcclxuXHJcbiAgICAgIGlmIChtdHhUcmFuc2Zvcm0gaW5zdGFuY2VvZiDGki5NYXRyaXg0eDQpXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0zKGR0bC50cmFuc2Zvcm0sIHZhbHVlLCBtdHhUcmFuc2Zvcm0sIGRpc3RhbmNlKTtcclxuICAgICAgaWYgKG10eFRyYW5zZm9ybSBpbnN0YW5jZW9mIMaSLk1hdHJpeDN4MylcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybTIoZHRsLnRyYW5zZm9ybSwgdmFsdWUudG9WZWN0b3IyKCksIG10eFRyYW5zZm9ybSwgMSk7XHJcblxyXG4gICAgICBjb21wb25lbnQubXV0YXRlKGNvbXBvbmVudC5nZXRNdXRhdG9yKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTMoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjMsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDR4NCwgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgbGV0IHJvdGF0aW9uOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgIHJvdGF0aW9uLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yU2NhbGluZzogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yU2NhbGluZyk7XHJcbiAgICAgICAgICBsZXQgc2NhbGluZzogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0uc2NhbGluZztcclxuICAgICAgICAgIHNjYWxpbmcuYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTIoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjIsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MywgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiArPSBfdmFsdWUueDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclNjYWxpbmc6IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclNjYWxpbmcpO1xyXG4gICAgICAgICAgbGV0IHNjYWxpbmc6IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnNjYWxpbmc7XHJcbiAgICAgICAgICBzY2FsaW5nLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3QoX2RldGFpbHM6IMaSVWkuRGV0YWlscywgX2ZvY3VzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmRvbS5jaGlsZHJlbilcclxuICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIF9kZXRhaWxzLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZCA9IF9kZXRhaWxzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgaWYgKF9mb2N1cylcclxuICAgICAgICBfZGV0YWlscy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWQoKTogxpJVaS5EZXRhaWxzIHtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5kb20uY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpKVxyXG4gICAgICAgICAgcmV0dXJuIDzGklVpLkRldGFpbHM+Y2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnQoX3Jlc291cmNlOiBPYmplY3QpOiDGki5Db21wb25lbnQge1xyXG4gICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICBpZiAoX3Jlc291cmNlLmlzQ29tcG9uZW50KVxyXG4gICAgICAgICAgcmV0dXJuIG5ldyAoPMaSLkdlbmVyYWw+X3Jlc291cmNlLnNjcmlwdCkoKTtcclxuXHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiB0eXBlb2YgxpIuQ29tcG9uZW50ID0gdGhpcy5maW5kQ29tcG9uZW50VHlwZShfcmVzb3VyY2UpO1xyXG4gICAgICByZXR1cm4gbmV3ICg8xpIuR2VuZXJhbD50eXBlQ29tcG9uZW50KShfcmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmluZENvbXBvbmVudFR5cGUoX3Jlc291cmNlOiBPYmplY3QpOiB0eXBlb2YgxpIuQ29tcG9uZW50IHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgcmVzb3VyY2VUb0NvbXBvbmVudClcclxuICAgICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgZW50cnlbMF0pXHJcbiAgICAgICAgICByZXR1cm4gZW50cnlbMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzdG9yZVNlbGVjdGVkKCk6IHZvaWQge1xyXG4gICAgLy8gICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBoaWVyYXJjaHkgb2YgYSBncmFwaCBhcyB0cmVlLWNvbnRyb2xcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0hpZXJhcmNoeSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBncmFwaDogxpIuR3JhcGg7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPjtcclxuICAgIHByaXZhdGUgc2VsZWN0aW9uUHJldmlvdXM6IMaSLk5vZGVbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gYSBzZWxlY3QgZXZlbnQgd2lsbCBiZSByZWNpdmVkIGZyb20gdGhlIHBhbmVsIGR1cmluZyByZWNvbnN0cnVjdGlvbiBzbyB3ZSBvbmx5IG5lZWQgdG8gcHJlcGFyZSBvdXIgc3RvcmFnZSBoZXJlXHJcbiAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSAmJiBfc3RhdGVbXCJleHBhbmRlZFwiXSAmJiAhdGhpcy5yZXN0b3JlRXhwYW5kZWQoX3N0YXRlW1wiZ3JhcGhcIl0pKVxyXG4gICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZChfc3RhdGVbXCJncmFwaFwiXSwgX3N0YXRlW1wiZXhwYW5kZWRcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IHNlbGVjdGlvbigpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIGlmICghX2dyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JhcGggJiYgdGhpcy50cmVlKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmFwaClcclxuICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG5cclxuICAgICAgdGhpcy5ncmFwaCA9IF9ncmFwaDtcclxuICAgICAgLy8gdGhpcy5zZWxlY3RlZE5vZGUgPSBudWxsO1xyXG5cclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPihuZXcgQ29udHJvbGxlclRyZWVIaWVyYXJjaHkoKSwgdGhpcy5ncmFwaCk7XHJcbiAgICAgIC8vIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgb24gZXhpc3Rpbmcgbm9kZSB0byBjcmVhdGUgY2hpbGQgbm9kZS5cXG7il48gVXNlIENvcHkvUGFzdGUgdG8gZHVwbGljYXRlIG5vZGVzLlwiO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgb3IgZHVwbGljYXRlLlwiO1xyXG5cclxuICAgICAgbGV0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IHRoaXMucmVzdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSk7XHJcbiAgICAgIGlmIChleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZChleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47IC8vIGNvbnRpbnVlIHdpdGggc3RhbmRhcmQgdHJlZSBiZWhhdmlvdXJcclxuXHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRyZWUpXHJcbiAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkuZmlsdGVyKChfc291cmNlKTogX3NvdXJjZSBpcyDGki5HcmFwaCA9PiBfc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjsgLy8gY29udGludWUgd2l0aCBzdGFuZGFyZCB0cmVlIGJlaGF2aW91clxyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaW5zdGFuY2VzOiDGki5HcmFwaEluc3RhbmNlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZ3JhcGggb2YgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcylcclxuICAgICAgICBpZiAoZ3JhcGggaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIGluc3RhbmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QuY3JlYXRlR3JhcGhJbnN0YW5jZShncmFwaCkpO1xyXG5cclxuICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IGluc3RhbmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSVWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIE5vZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIk5cIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGUtIC8gQWN2dGl2YXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUNUSVZBVEVfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkFcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX05PREUpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGZvY3VzOiDGki5Ob2RlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKE51bWJlcihfaXRlbS5pZCkpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9OT0RFOlxyXG4gICAgICAgICAgbGV0IGNoaWxkOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJOZXcgTm9kZVwiKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbY2hpbGRdLCBmb2N1cyk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFDVElWQVRFX05PREU6XHJcbiAgICAgICAgICBmb2N1cy5hY3RpdmF0ZSghZm9jdXMuaXNBY3RpdmUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9OT0RFOlxyXG4gICAgICAgICAgLy8gZm9jdXMuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgaWYgKCFmb2N1cylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIGZvY3VzLmdldFBhcmVudCgpLnJlbW92ZUNoaWxkKGZvY3VzKTtcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gRXZlbnRIYW5kbGVyc1xyXG4gICAgcHJpdmF0ZSBobmRUcmVlRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiDGki5HcmFwaCkge1xyXG4gICAgICAgICAgICAvLyBfZXZlbnQuZGV0YWlsLmRhdGEubmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuU0VMRUNUOlxyXG4gICAgICAgICAgLy9vbmx5IGRpc3BhdGNoIHRoZSBldmVudCB0byBmb2N1cyB0aGUgbm9kZSwgaWYgdGhlIG5vZGUgaXMgaW4gdGhlIGN1cnJlbnQgYW5kIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gIFxyXG4gICAgICAgICAgbGV0IG5vZGU6IMaSLk5vZGUgPSBfZXZlbnQuZGV0YWlsW1wiZGF0YVwiXTtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByZXZpb3VzLmluY2x1ZGVzKG5vZGUpICYmIHRoaXMuc2VsZWN0aW9uLmluY2x1ZGVzKG5vZGUpKVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5GT0NVUywgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogbm9kZSwgdmlldzogdGhpcyB9IH0pO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25QcmV2aW91cyA9IHRoaXMuc2VsZWN0aW9uLnNsaWNlKDApO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IG5vZGU6IG5vZGUsIHZpZXc6IHRoaXMgfSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZ3JhcGgpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGgoX2V2ZW50LmRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5zaG93KF9ldmVudC5kZXRhaWwubm9kZS5nZXRQYXRoKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb24gPSBbX2V2ZW50LmRldGFpbC5ub2RlXTtcclxuICAgICAgICAgICAgdGhpcy50cmVlLmRpc3BsYXlTZWxlY3Rpb24odGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25QcmV2aW91cyA9IHRoaXMuc2VsZWN0aW9uLnNsaWNlKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCAmJiBfZXZlbnQuZGV0YWlsLmRhdGEgPT0gdGhpcy5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy50cmVlLmZpbmRJdGVtKHRoaXMuZ3JhcGgpPy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBpZiAodGhpcy5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSwgdGhpcy5nZXRFeHBhbmRlZCgpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgc3RvcmVFeHBhbmRlZChfaWRHcmFwaDogc3RyaW5nLCBfZXhwYW5kZWQ6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5pZH1fJHtfaWRHcmFwaH1gLCBKU09OLnN0cmluZ2lmeShfZXhwYW5kZWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc3RvcmVFeHBhbmRlZChfaWRHcmFwaDogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICBsZXQgc3RvcmVkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuaWR9XyR7X2lkR3JhcGh9YCk7XHJcbiAgICAgIHJldHVybiBzdG9yZWQgJiYgSlNPTi5wYXJzZShzdG9yZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RXhwYW5kZWQoKTogc3RyaW5nW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlPy5nZXRFeHBhbmRlZCgpLm1hcChfaXRlbSA9PiDGki5Ob2RlLlBBVEhfRlJPTV9UTyh0aGlzLmdyYXBoLCBfaXRlbS5kYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogxpIuTm9kZVtdW10gPSBfcGF0aHNcclxuICAgICAgICAubWFwKF9wYXRoID0+IMaSLk5vZGUuRklORDzGki5Ob2RlPih0aGlzLmdyYXBoLCBfcGF0aCkpXHJcbiAgICAgICAgLmZpbHRlcihfbm9kZSA9PiBfbm9kZSlcclxuICAgICAgICAubWFwKF9ub2RlID0+IF9ub2RlLmdldFBhdGgoKSk7XHJcblxyXG4gICAgICB0aGlzLnRyZWU/LmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIGltcG9ydCDGkkFpZCA9IEZ1ZGdlQWlkO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSByZW5kZXJpbmcgb2YgYSBncmFwaCBpbiBhIHZpZXdwb3J0IHdpdGggYW4gaW5kZXBlbmRlbnQgY2FtZXJhXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UmVuZGVyIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIGNtck9yYml0OiDGkkFpZC5DYW1lcmFPcmJpdDtcclxuICAgIHByaXZhdGUgdmlld3BvcnQ6IMaSLlZpZXdwb3J0O1xyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBncmFwaDogxpIuR3JhcGg7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG5vZGVMaWdodDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiSWxsdW1pbmF0aW9uXCIpOyAvLyBrZWVwcyBsaWdodCBjb21wb25lbnRzIGZvciBkYXJrIGdyYXBoc1xyXG4gICAgcHJpdmF0ZSByZWRyYXdJZDogbnVtYmVyO1xyXG4gICAgI3BvaW50ZXJNb3ZlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuXHJcbiAgICAgIGxldCB0aXRsZTogc3RyaW5nID0gXCLil48gRHJvcCBhIGdyYXBoIGZyb20gXFxcIkludGVybmFsXFxcIiBoZXJlLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBVc2UgbW91c2VidXR0b25zIGFuZCBjdHJsLSwgc2hpZnQtIG9yIGFsdC1rZXkgdG8gbmF2aWdhdGUgZWRpdG9yIGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gRHJvcCBjYW1lcmEgY29tcG9uZW50IGhlcmUgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIE1hbmlwdWxhdGUgdHJhbnNmb3JtYXRpb25zIGluIHRoaXMgdmlldzpcXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gQ2xpY2sgdG8gc2VsZWN0IG5vZGUsIHJpZ2h0Y2xpY2sgdG8gc2VsZWN0IHRyYW5zZm9ybWF0aW9ucy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gU2VsZWN0IGNvbXBvbmVudCB0byBtYW5pcHVsYXRlIGluIHZpZXcgQ29tcG9uZW50cy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gSG9sZCBYLCBZIG9yIFogYW5kIG1vdmUgbW91c2UgdG8gdHJhbnNmb3JtLiBBZGQgc2hpZnQta2V5IHRvIGludmVydCByZXN0cmljdGlvbi5cXG5cIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSB0aXRsZTtcclxuICAgICAgdGhpcy5kb20udGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkZPQ1VTLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlcik7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4gdGhpcy4jcG9pbnRlck1vdmVkID0gZmFsc2UpOyAvLyByZXNldCBwb2ludGVyIG1vdmVcclxuXHJcbiAgICAgIGlmIChfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl0pIHtcclxuICAgICAgICBsZXQgZ2l6bW9zRmlsdGVyOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoX3N0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdKTtcclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBnaXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICBpZiAodGhpcy5naXptb3NGaWx0ZXIuaGFzKGtleSkpXHJcbiAgICAgICAgICAgIHRoaXMuZ2l6bW9zRmlsdGVyLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IGdpem1vc0ZpbHRlcigpOiBNYXA8c3RyaW5nLCBib29sZWFuPiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdwb3J0Py5naXptb3NGaWx0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiVHJhbnNsYXRlXCIsIGlkOiBUUkFOU0ZPUk0uVFJBTlNMQVRFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJUXCIgOiBcIlRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUm90YXRlXCIsIGlkOiBUUkFOU0ZPUk0uUk9UQVRFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJSXCIgOiBcIlJcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiU2NhbGVcIiwgaWQ6IFRSQU5TRk9STS5TQ0FMRSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IHByb2Nlc3MucGxhdGZvcm0gPT0gXCJkYXJ3aW5cIiA/IFwiRVwiIDogXCJFXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiUGh5c2ljcyBEZWJ1Z1wiLCBzdWJtZW51OiBbXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJOb25lXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMF0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJDb2xsaWRlcnNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVsxXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVycyBhbmQgSm9pbnRzIChEZWZhdWx0KVwiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzJdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQm91bmRpbmcgQm94ZXNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVszXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbnRhY3RzXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbNF0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJPbmx5IFBoeXNpY3NcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs1XSksIGNsaWNrOiBfY2FsbGJhY2sgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJPcnRob2dyYXBoaWMgQ2FtZXJhXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuT1JUSEdSQVBISUNfQ0FNRVJBKSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJPXCIgOiBcIk9cIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIlJlbmRlciBDb250aW51b3VzbHlcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7X2l0ZW0uaWR9YCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9pdGVtLmlkKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5TQ0FMRTpcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKF9pdGVtLmlkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuTk9ORV06XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5DT0xMSURFUlNdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUl06XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5CT1VORElOR19CT1hFU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5DT05UQUNUU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5QSFlTSUNfT0JKRUNUU19PTkxZXTpcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQucGh5c2ljc0RlYnVnTW9kZSA9IMaSLlBIWVNJQ1NfREVCVUdNT0RFW19pdGVtLmlkXTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpOlxyXG4gICAgICAgICAgdGhpcy5zZXRDYW1lcmFPcnRob2dyYXBoaWMoX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKTpcclxuICAgICAgICAgIHRoaXMuc2V0UmVuZGVyQ29udGlub3VzbHkoX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmdpem1vc0ZpbHRlci5oYXMoX2l0ZW0uaWQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLmdpem1vc0ZpbHRlci5zZXQoX2l0ZW0uaWQsIF9pdGVtLmNoZWNrZWQpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICghdGhpcy4jcG9pbnRlck1vdmVkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBbZmlsdGVyLCBhY3RpdmVdIG9mIHRoaXMuZ2l6bW9zRmlsdGVyKVxyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoZmlsdGVyKS5jaGVja2VkID0gYWN0aXZlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiNwb2ludGVyTW92ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3Q29tcG9uZW50cykpIHsgLy8gYWxsb3cgZHJvcHBpbmcgY2FtZXJhY29tcG9uZW50IHRvIHNlZSB0aHJvdWdoIHRoYXQgY2FtZXJhIChhdCB0aGlzIHRpbWUsIHRoZSBvbmx5IGRyYWdnYWJsZSlcclxuICAgICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCkpIC8vIGFsbG93IGRyb3BwaW5nIGEgZ3JhcGhcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgICAgaWYgKCEoc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiDGki5Db21wb25lbnRDYW1lcmEpIHtcclxuICAgICAgICAvLyB0aGlzLnNldENhbWVyYU9ydGhvZ3JhcGhpYyhmYWxzZSk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICDGkkFpZC5hZGRTdGFuZGFyZExpZ2h0Q29tcG9uZW50cyh0aGlzLm5vZGVMaWdodCk7XHJcblxyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIHRoaXMuY2FudmFzID0gxpJBaWQuQ2FudmFzLmNyZWF0ZSh0cnVlLCDGkkFpZC5JTUFHRV9SRU5ERVJJTkcuUElYRUxBVEVEKTtcclxuICAgICAgbGV0IGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSBcIjBweFwiO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuXHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgLy8gYWRkIGRlZmF1bHQgdmFsdWVzIGZvciB2aWV3IHJlbmRlciBnaXptb3NcclxuICAgICAgdGhpcy5naXptb3NGaWx0ZXIuc2V0KEdJWk1PUy5UUkFOU0ZPUk0sIHRydWUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmluaXRpYWxpemUoXCJWaWV3Tm9kZV9WaWV3cG9ydFwiLCB0aGlzLmdyYXBoLCBjbXBDYW1lcmEsIHRoaXMuY2FudmFzKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLmNtck9yYml0ID0gRnVkZ2VBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHRoaXMudmlld3BvcnQsIGZhbHNlKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7IC8qIHZpZXcgc2hvdWxkIGxvYWQgZXZlbiBpZiByZW5kZXJpbmcgZmFpbHMuLi4gKi8gfTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUjtcclxuICAgICAgdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX1NUQVJULCB0aGlzLmhuZFByZXBhcmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5kcmF3VHJhbnNsYXRpb24pO1xyXG5cclxuICAgICAgdGhpcy5zZXRHcmFwaChudWxsKTtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmFjdGl2ZVZpZXdwb3J0KTtcclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBpY2tcIiwgdGhpcy5obmRQaWNrKTtcclxuXHJcbiAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9uc1tdID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgW2ZpbHRlcl0gb2YgdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgc3VibWVudS5wdXNoKHsgbGFiZWw6IGZpbHRlciwgaWQ6IGZpbHRlciwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykgfSk7XHJcblxyXG4gICAgICB0aGlzLmNvbnRleHRNZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJHaXptb3NcIiwgc3VibWVudTogc3VibWVudVxyXG4gICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRHcmFwaChfbm9kZTogxpIuR3JhcGgpOiB2b2lkIHtcclxuICAgICAgaWYgKCFfbm9kZSkge1xyXG4gICAgICAgIHRoaXMuZ3JhcGggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJEcm9wIGEgZ3JhcGggaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5ncmFwaCkge1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmdyYXBoID0gX25vZGU7XHJcblxyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTtcclxuICAgICAgdGhpcy5ncmFwaC5icm9hZGNhc3RFdmVudChuZXcgRXZlbnQoxpIuRVZFTlQuRElTQ09OTkVDVF9KT0lOVCkpO1xyXG4gICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUjtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2godGhpcy5ncmFwaCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuZ3JhcGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Q2FtZXJhT3J0aG9ncmFwaGljKF9vbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIGlmIChfb24pIHtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmNtcENhbWVyYS5wcm9qZWN0Q2VudHJhbCgyLCAxLCDGki5GSUVMRF9PRl9WSUVXLkRJQUdPTkFMLCAxMCwgMjAwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwMDtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmRpc3RhbmNlICo9IDUwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDEsIDQ1LCDGki5GSUVMRF9PRl9WSUVXLkRJQUdPTkFMLCAwLjAxLCAxMDAwKTtcclxuICAgICAgICB0aGlzLmNtck9yYml0Lm1heERpc3RhbmNlID0gMTAwMDtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmRpc3RhbmNlIC89IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpKS5jaGVja2VkID0gX29uO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFByZXBhcmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc3dpdGNoTGlnaHQ6IEV2ZW50TGlzdGVuZXIgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCBsaWdodHNQcmVzZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgxpIuUmVuZGVyLmxpZ2h0cy5mb3JFYWNoKChfYXJyYXk6IMaSLlJlY3ljYWJsZUFycmF5PMaSLkNvbXBvbmVudExpZ2h0PikgPT4gbGlnaHRzUHJlc2VudCB8fD0gX2FycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7bGlnaHRzUHJlc2VudCA/IFwiUkVOREVSXCIgOiBcIlJlbmRlclwifSB8ICR7dGhpcy5ncmFwaC5uYW1lfWApO1xyXG4gICAgICAgIGlmICghbGlnaHRzUHJlc2VudClcclxuICAgICAgICAgIMaSLlJlbmRlci5hZGRMaWdodHModGhpcy5ub2RlTGlnaHQuZ2V0Q29tcG9uZW50cyjGki5Db21wb25lbnRMaWdodCkpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGgucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfUFJFUEFSRV9FTkQsIHN3aXRjaExpZ2h0KTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5ncmFwaC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSA8RXZlbnREZXRhaWw+X2V2ZW50LmRldGFpbDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChkZXRhaWwuZ3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaChkZXRhaWwuZ3JhcGgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5GT0NVUywgeyBidWJibGVzOiBmYWxzZSwgZGV0YWlsOiB7IG5vZGU6IGRldGFpbC5ub2RlIHx8IHRoaXMuZ3JhcGggfSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChkZXRhaWwubm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBkZXRhaWwubm9kZTtcclxuICAgICAgICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NTZWxlY3RlZCA9IFt0aGlzLm5vZGVdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuRk9DVVM6XHJcbiAgICAgICAgICB0aGlzLmNtck9yYml0Lm10eExvY2FsLnRyYW5zbGF0aW9uID0gZGV0YWlsLm5vZGUubXR4V29ybGQudHJhbnNsYXRpb247XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5kcmF3VHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICBpZiAoIXRoaXMudmlld3BvcnQuY2FtZXJhLmlzQWN0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUGljayA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBwaWNrZWQ6IMaSLk5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGU7XHJcblxyXG4gICAgICAvL1RPRE86IHdhdGNoIG91dCwgdHdvIHNlbGVjdHNcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiBwaWNrZWQgfSB9KTtcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJVaS5FVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHBpY2tlZCB9IH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhbmltYXRlID0gKF9lOiBFdmVudCkgPT4ge1xyXG4gICAgLy8gICB0aGlzLnZpZXdwb3J0LnNldEdyYXBoKHRoaXMuZ3JhcGgpO1xyXG4gICAgLy8gICBpZiAodGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0ID4gMCAmJiB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCA+IDApXHJcbiAgICAvLyAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCB8fD0gKF9ldmVudC5tb3ZlbWVudFggIT0gMCB8fCBfZXZlbnQubW92ZW1lbnRZICE9IDApO1xyXG5cclxuICAgICAgdGhpcy5kb20uZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgcmVzdHJpY3Rpb246IHN0cmluZztcclxuICAgICAgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5YXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInhcIjtcclxuICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlldKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwielwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWl0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ5XCI7XHJcblxyXG4gICAgICBpZiAoIXJlc3RyaWN0aW9uKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogUGFnZS5tb2RlVHJhbnNmb3JtLCByZXN0cmljdGlvbjogcmVzdHJpY3Rpb24sIHg6IF9ldmVudC5tb3ZlbWVudFgsIHk6IF9ldmVudC5tb3ZlbWVudFksIGNhbWVyYTogdGhpcy52aWV3cG9ydC5jYW1lcmEsIGludmVydGVkOiBfZXZlbnQuc2hpZnRLZXlcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IHRyYW5zZm9ybTogZGF0YSB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwge30pO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGFjdGl2ZVZpZXdwb3J0ID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICBfZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLmdyYXBoKTtcclxuICAgICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShmYWxzZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcihfZXJyb3IpO1xyXG4gICAgICAgIC8vbm9wXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRSZW5kZXJDb250aW5vdXNseShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMucmVkcmF3SWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICB9LCAxMDAwIC8gMzApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMucmVkcmF3SWQpO1xyXG4gICAgICAgIHRoaXMucmVkcmF3SWQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKSkuY2hlY2tlZCA9IF9vbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdUcmFuc2xhdGlvbiA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLm5vZGUgfHwgIXRoaXMuZ2l6bW9zRmlsdGVyLmdldChHSVpNT1MuVFJBTlNGT1JNKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBzY2FsaW5nOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5PTkUoxpIuVmVjdG9yMy5ESUZGRVJFTkNFKMaSLkdpem1vcy5jYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMubm9kZS5tdHhXb3JsZC50cmFuc2xhdGlvbikubWFnbml0dWRlICogMC4xKTtcclxuICAgICAgY29uc3Qgb3JpZ2luOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAgIGNvbnN0IHZjdFg6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlgoMSk7XHJcbiAgICAgIGNvbnN0IHZjdFk6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlkoMSk7XHJcbiAgICAgIGNvbnN0IHZjdFo6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlooMSk7XHJcbiAgICAgIGxldCBtdHhXb3JsZDogxpIuTWF0cml4NHg0ID0gdGhpcy5ub2RlLm10eFdvcmxkLmNsb25lO1xyXG4gICAgICBtdHhXb3JsZC5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgbGV0IGNvbG9yOiDGki5Db2xvciA9IMaSLkNvbG9yLkNTUyhcInJlZFwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RYXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuICAgICAgY29sb3Iuc2V0Q1NTKFwibGltZVwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RZXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuICAgICAgY29sb3Iuc2V0Q1NTKFwiYmx1ZVwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RaXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlTXVsdGlwbGUodmN0WCwgdmN0WSwgdmN0Wiwgb3JpZ2luLCBtdHhXb3JsZCwgY29sb3IsIHNjYWxpbmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImdpem1vc0ZpbHRlclwiXSA9IEFycmF5LmZyb20odGhpcy5naXptb3NGaWx0ZXIuZW50cmllcygpKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgbGV0IHR5cGVzT2ZSZXNvdXJjZXM6IMaSLkdlbmVyYWxbXSA9IFtcclxuICAgIMaSLk1lc2hcclxuICBdO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBpbnRlcm5hbCByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0ludGVybmFsVGFibGUgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVEVTVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmhuZEtleWJvYXJkRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsaXN0UmVzb3VyY2VzKCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+KG5ldyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSgpLCBPYmplY3QudmFsdWVzKMaSLlByb2plY3QucmVzb3VyY2VzKSwgXCJ0eXBlXCIpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayB0byBjcmVhdGUgbmV3IHJlc291cmNlLlxcbuKXjyBTZWxlY3Qgb3IgZHJhZyByZXNvdXJjZS5cIjtcclxuICAgICAgdGhpcy50YWJsZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyAgRHJhZyB0byBcXFwiUHJvcGVydGllc1xcXCIgb3IgXFxcIkNvbXBvbmVudHNcXFwiIHRvIHVzZSBpZiBhcHBsaWNhYmxlLlwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgdHIgb2YgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpIHtcclxuICAgICAgICBsZXQgdGRzOiBOb2RlTGlzdE9mPEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IHRyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZFwiKTtcclxuICAgICAgICBpZiAoIXRkcy5sZW5ndGgpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB0ZHNbMV0uY2xhc3NMaXN0LmFkZChcImljb25cIik7XHJcbiAgICAgICAgdGRzWzFdLnNldEF0dHJpYnV0ZShcImljb25cIiwgKDxIVE1MSW5wdXRFbGVtZW50PnRkc1sxXS5jaGlsZHJlblswXSkudmFsdWUpO1xyXG4gICAgICAgIGlmICh0ciBpbnN0YW5jZW9mIMaSdWkuVGFibGVJdGVtICYmICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD50ci5kYXRhKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKSB7XHJcbiAgICAgICAgICB0ci5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB0ci50aXRsZSA9IFwiRmFpbGVkIHRvIGxvYWQgcmVzb3VyY2UgZnJvbSBmaWxlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IHRoaXMgaXMgYSBwcmVwYXJhdGlvbiBmb3Igc3luY2luZyBhIGdyYXBoIHdpdGggaXRzIGluc3RhbmNlcyBhZnRlciBzdHJ1Y3R1cmFsIGNoYW5nZXNcclxuICAgIC8vIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgcm93OiBIVE1MVGFibGVSb3dFbGVtZW50ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoKF9lbGVtZW50KSA9PiAoPEhUTUxFbGVtZW50Pl9lbGVtZW50KS50YWdOYW1lID09IFwiVFJcIik7XHJcbiAgICAvLyAgIGlmIChyb3cpXHJcbiAgICAvLyAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSkuZW5hYmxlZCA9IChyb3cuZ2V0QXR0cmlidXRlKFwiaWNvblwiKSA9PSBcIkdyYXBoXCIpO1xyXG4gICAgLy8gICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDcmVhdGUgR3JhcGhcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfR1JBUEgpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJHXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNZXNoXCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9NRVNILCDGki5NZXNoLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWF0ZXJpYWxcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgxpIuQW5pbWF0aW9uLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uU3ByaXRlLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1QpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIFJlc291cmNlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiU3luYyBJbnN0YW5jZXNcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5TWU5DX0lOU1RBTkNFUyksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIlNcIiB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG5cclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAgIGxldCBpU3ViY2xhc3M6IG51bWJlciA9IF9pdGVtW1wiaVN1YmNsYXNzXCJdO1xyXG4gICAgICBpZiAoIWlTdWJjbGFzcyAmJiAoY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NRVNIIHx8IGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJGdW5reSBFbGVjdHJvbi1FcnJvci4uLiBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICAvL1RPRE86IGRpc3BhdGNoIENSRUFURSBpbnN0ZWFkIG9mIE1PRElGWSFcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NRVNIOlxyXG4gICAgICAgICAgbGV0IHR5cGVNZXNoOiB0eXBlb2YgxpIuTWVzaCA9IMaSLk1lc2guc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBsZXQgbWVzaE5ldzogxpIuTWVzaCA9IG5ldyB0eXBlTWVzaCgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG1lc2hOZXcsIG1lc2hOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUw6XHJcbiAgICAgICAgICBsZXQgdHlwZVNoYWRlcjogdHlwZW9mIMaSLlNoYWRlciA9IMaSLlNoYWRlci5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgbXRyTmV3OiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbCh0eXBlU2hhZGVyLm5hbWUsIHR5cGVTaGFkZXIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG10ck5ldywgbXRyTmV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIOlxyXG4gICAgICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKG5ldyDGki5Ob2RlKFwiTmV3R3JhcGhcIikpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGdyYXBoLCBncmFwaCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSBuZXcgdHlwZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGFuaW1hdGlvbiwgYW5pbWF0aW9uKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVDpcclxuICAgICAgICAgIGxldCBwYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0gPSBuZXcgxpIuUGFydGljbGVTeXN0ZW0oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNSRUFURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgdGhpcy50YWJsZS5zZWxlY3RJbnRlcnZhbChwYXJ0aWNsZVN5c3RlbSwgcGFydGljbGVTeXN0ZW0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0U6XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuZGVsZXRlKFt0aGlzLnRhYmxlLmdldEZvY3Vzc2VkKCldKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIGlmICh0aGlzLmRvbSAhPSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gIVtNSU1FLkFVRElPLCBNSU1FLklNQUdFLCBNSU1FLk1FU0gsIE1JTUUuR0xURl0uaW5jbHVkZXMoX3NvdXJjZS5nZXRNaW1lVHlwZSgpKSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpXHJcbiAgICAgICAgLy8gICBpZiAoc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5BVURJTyAmJiBzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLklNQUdFICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuTUVTSClcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiDGki5Ob2RlW10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcykge1xyXG4gICAgICAgICAgYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgoc291cmNlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5BVURJTzpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuQXVkaW8oc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1JTUUuSU1BR0U6XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cobmV3IMaSLlRleHR1cmVJbWFnZShzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5NRVNIOlxyXG4gICAgICAgICAgICAgIMaSLkRlYnVnLmxvZyhhd2FpdCBuZXcgxpIuTWVzaE9CSigpLmxvYWQoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlXHJcbiAgICAgICAgICAgICAgTUlNRS5HTFRGOlxyXG4gICAgICAgICAgICAgIGxldCBsb2FkZXI6IMaSLkdMVEZMb2FkZXIgPSBhd2FpdCDGki5HTFRGTG9hZGVyLkxPQUQoc291cmNlLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hhdCB0byBpbXBvcnQgZnJvbSAnJHtsb2FkZXIubmFtZX0nYCwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncykgaWYgKFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3NbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXNvdXJjZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSBhd2FpdCBsb2FkZXIubG9hZFJlc291cmNlcyjGklt0eXBlXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiByZXNvdXJjZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCHGki5Qcm9qZWN0LnJlc291cmNlc1tyZXNvdXJjZS5pZFJlc291cmNlXSlcclxuICAgICAgICAgICAgICAgICAgICDGki5Qcm9qZWN0LnJlZ2lzdGVyKHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBsZXQgY2VsbDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCIuc2VsZWN0ZWRcIik7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoIWlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DUkVBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbD8uc2VuZGVyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDogLy8gVE9ETzogaXMgdGhpcyByZWFjaGFibGU/IElzIGl0IHN0aWxsIG5lZWRlZD9cclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhc3luYyBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cclxuXHJcbiAgICAvLyAgIC8vIMaSdWkuRGlhbG9nLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgLy8gICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgLy8gICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3Ioc2V0dGluZ3MsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgLy8gICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICB9IGVsc2VcclxuICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhtdXRhdG9yLCB0aGlzKTtcclxuICAgIC8vIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByZXZpZXcgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJldmlldyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXRyU3RhbmRhcmQ6IMaSLk1hdGVyaWFsID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVzaFN0YW5kYXJkOiDGki5NZXNoID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNZXNoKCk7XHJcbiAgICBwcml2YXRlIHJlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSB8IERpcmVjdG9yeUVudHJ5IHwgUmVzb3VyY2VGb2xkZXIgfCBGdW5jdGlvbjtcclxuICAgIHByaXZhdGUgdmlld3BvcnQ6IMaSLlZpZXdwb3J0O1xyXG4gICAgcHJpdmF0ZSBjbXJPcmJpdDogxpJBaWQuQ2FtZXJhT3JiaXQ7XHJcbiAgICBwcml2YXRlIHByZXZpZXdOb2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBtdHhJbWFnZTogxpIuTWF0cml4M3gzID0gxpIuTWF0cml4M3gzLklERU5USVRZKCk7XHJcbiAgICBwcml2YXRlIHRpbWVvdXREZWZlcjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBjcmVhdGUgdmlld3BvcnQgZm9yIDNELXJlc291cmNlc1xyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC50cmFuc2xhdGUobmV3IMaSLlZlY3RvcjMoMSwgMiwgMSkpO1xyXG4gICAgICAvLyBjbXBDYW1lcmEucGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuICAgICAgY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDEsIDQ1KTtcclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gbmV3IMaSLlZpZXdwb3J0KCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlByZXZpZXdcIiwgbnVsbCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgICAvLyDGki5SZW5kZXJXZWJHTC5zZXRDYW52YXNTaXplKDEsIDEpO1xyXG4gICAgICB0aGlzLmNtck9yYml0ID0gxpJBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHRoaXMudmlld3BvcnQsIGZhbHNlKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZSA9IHRoaXMuY3JlYXRlU3RhbmRhcmRHcmFwaCgpO1xyXG5cclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpOiDGki5NYXRlcmlhbCB7XHJcbiAgICAgIGxldCBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBuZXcgxpIuTWF0ZXJpYWwoXCJTdGFuZGFyZE1hdGVyaWFsXCIsIMaSLlNoYWRlckZsYXQsIG5ldyDGki5Db2F0UmVtaXNzaXZlKMaSLkNvbG9yLkNTUyhcIndoaXRlXCIpKSk7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtdHJTdGFuZGFyZCk7XHJcbiAgICAgIHJldHVybiBtdHJTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1lc2goKTogxpIuTWVzaCB7XHJcbiAgICAgIGxldCBtZXNoU3RhbmRhcmQ6IMaSLk1lc2hTcGhlcmUgPSBuZXcgxpIuTWVzaFNwaGVyZShcIlNwaGVyZVwiLCAyMCwgMTIpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIobWVzaFN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG1lc2hTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiSWxsdW1pbmF0ZSBHcmFwaFwiLCBpZDogQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV0sIGNoZWNrZWQ6IHRydWUsIHR5cGU6IFwiY2hlY2tib3hcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7X2l0ZW0uaWR9YCk7XHJcblxyXG4gICAgICAvLyBzd2l0Y2ggKF9pdGVtLmlkKSB7XHJcbiAgICAgIC8vIGNhc2UgQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV06XHJcbiAgICAgIC8vICAgdGhpcy5pbGx1bWluYXRlR3JhcGgoKTtcclxuICAgICAgLy8gICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRNb3VzZSA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKFwiZGl2I2ltYWdlXCIpO1xyXG4gICAgICBpZiAoIWRpdilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5idXR0b25zICE9IDIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWChfZXZlbnQubW92ZW1lbnRYKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWShfZXZlbnQubW92ZW1lbnRZKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ3aGVlbFwiOlxyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKFxyXG4gICAgICAgICAgICBfZXZlbnQub2Zmc2V0WCAtIHRoaXMuZG9tLmNsaWVudFdpZHRoLCBfZXZlbnQub2Zmc2V0WSAtIHRoaXMuZG9tLmNsaWVudEhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgbGV0IHpvb206IG51bWJlciA9IE1hdGguZXhwKC1fZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvZmZzZXQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnNjYWxlWCh6b29tKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVZKHpvb20pO1xyXG4gICAgICAgICAgb2Zmc2V0LnNjYWxlKHpvb20gLSAxKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWCgtb2Zmc2V0LngpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKC1vZmZzZXQueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFRyYW5zZm9ybShfZGl2OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdHJhbnNmb3JtOiBGbG9hdDMyQXJyYXkgPSB0aGlzLm10eEltYWdlLmdldCgpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbig1LCA2KTtcclxuICAgICAgdHJhbnNmb3JtID0gdHJhbnNmb3JtLmNvcHlXaXRoaW4oMiwgMyk7XHJcbiAgICAgIF9kaXYuc3R5bGUudHJhbnNmb3JtID0gYG1hdHJpeCgke3RyYW5zZm9ybS5zbGljZSgwLCA2KS5qb2luKCl9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgaWYgKCF0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJTZWxlY3QgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgcmVzb3VyY2UgdG8gcHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcmV2aWV3XCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSB0aGlzLnJlc291cmNlLnR5cGUgfHwgXCJGdW5jdGlvblwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLk1lc2gpXHJcbiAgICAgICAgdHlwZSA9IFwiTWVzaFwiO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgIGxldCBwcmV2aWV3T2JqZWN0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3T2JqZWN0XCIpO1xyXG4gICAgICBsZXQgcHJldmlldzogSFRNTEVsZW1lbnQ7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJGdW5jdGlvblwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlU2NyaXB0UHJldmlldyg8RnVuY3Rpb24+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRmlsZVwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlRmlsZVByZXZpZXcoPERpcmVjdG9yeUVudHJ5PnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgaWYgKHByZXZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHByZXZpZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1lc2hcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNZXNoKDzGki5NZXNoPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbChWaWV3UHJldmlldy5tdHJTdGFuZGFyZCkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNYXRlcmlhbFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goVmlld1ByZXZpZXcubWVzaFN0YW5kYXJkKSk7XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwoPMaSLk1hdGVyaWFsPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHRoaXMucmVzZXRDYW1lcmEoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiR3JhcGhcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYXBwZW5kQ2hpbGQoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgbGlnaHRzUHJlc2VudCA9IGZhbHNlO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLmxpZ2h0cy5mb3JFYWNoKChfYXJyYXk6IMaSLlJlY3ljYWJsZUFycmF5PMaSLkNvbXBvbmVudExpZ2h0PikgPT4gbGlnaHRzUHJlc2VudCB8fD0gX2FycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgdGhpcy5pbGx1bWluYXRlKCFsaWdodHNQcmVzZW50KTtcclxuICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7bGlnaHRzUHJlc2VudCA/IFwiUFJFVklFV1wiIDogXCJQcmV2aWV3XCJ9IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKDzGki5HcmFwaD50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsIChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmZXIoKCkgPT4gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRleHR1cmVJbWFnZVwiOlxyXG4gICAgICAgIGNhc2UgXCJBbmltYXRpb25TcHJpdGVcIjpcclxuICAgICAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGRpdi5pZCA9IFwiaW1hZ2VcIjtcclxuICAgICAgICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodHlwZSA9PSBcIlRleHR1cmVJbWFnZVwiKSB7XHJcbiAgICAgICAgICAgIGltZyA9ICg8xpIuVGV4dHVyZUltYWdlPnRoaXMucmVzb3VyY2UpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25TcHJpdGU6IMaSLkFuaW1hdGlvblNwcml0ZSA9IDzGki5BbmltYXRpb25TcHJpdGU+dGhpcy5yZXNvdXJjZTtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+YW5pbWF0aW9uU3ByaXRlLnRleHR1cmUpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uczogxpIuVmVjdG9yMltdID0gYW5pbWF0aW9uU3ByaXRlLmdldFBvc2l0aW9ucygpO1xyXG4gICAgICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IGFuaW1hdGlvblNwcml0ZS5nZXRNdXRhdG9yKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBvc2l0aW9uIG9mIHBvc2l0aW9ucykge1xyXG4gICAgICAgICAgICAgIGxldCByZWN0OiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgICByZWN0LmNsYXNzTmFtZSA9IFwicmVjdFNwcml0ZVwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUubGVmdCA9IHBvc2l0aW9uLnggKyAxICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUudG9wID0gcG9zaXRpb24ueSArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS53aWR0aCA9IG11dGF0b3Iuc2l6ZS54IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLmhlaWdodCA9IG11dGF0b3Iuc2l6ZS55IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkF1ZGlvXCI6XHJcbiAgICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KCg8xpIuQXVkaW8+dGhpcy5yZXNvdXJjZSkucGF0aC50b1N0cmluZygpLCBcIlwiLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KGVudHJ5KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OiBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShgUHJldmlldyB8ICR7dGhpcy5yZXNvdXJjZS5uYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhbmRhcmRHcmFwaCgpOiDGki5Ob2RlIHtcclxuICAgICAgbGV0IGdyYXBoOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3U2NlbmVcIik7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuc2V0QnJhbmNoKGdyYXBoKTtcclxuXHJcbiAgICAgIGxldCBub2RlTGlnaHQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdJbGx1bWluYXRpb25cIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKG5vZGVMaWdodCk7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKG5vZGVMaWdodCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcblxyXG4gICAgICBsZXQgcHJldmlld05vZGU6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdOb2RlXCIpO1xyXG4gICAgICBncmFwaC5hZGRDaGlsZChwcmV2aWV3Tm9kZSk7XHJcbiAgICAgIHJldHVybiBwcmV2aWV3Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFZpZXdPYmplY3QoX25vZGU6IMaSLk5vZGUsIF9ncmFwaElsbHVtaW5hdGlvbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5hZGRDaGlsZChfbm9kZSk7XHJcbiAgICAgIHRoaXMuaWxsdW1pbmF0ZSh0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy52aWV3cG9ydC5jYW52YXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaWxsdW1pbmF0ZShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk/LmdldENoaWxkcmVuQnlOYW1lKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKVswXTtcclxuICAgICAgbm9kZUxpZ2h0LmFjdGl2YXRlKF9vbik7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVGaWxlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgbWltZTogTUlNRSA9IF9lbnRyeS5nZXRNaW1lVHlwZSgpO1xyXG4gICAgICBzd2l0Y2ggKG1pbWUpIHtcclxuICAgICAgICBjYXNlIE1JTUUuVEVYVDogcmV0dXJuIHRoaXMuY3JlYXRlVGV4dFByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgICBjYXNlIE1JTUUuQVVESU86IHJldHVybiB0aGlzLmNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5JTUFHRTogcmV0dXJuIHRoaXMuY3JlYXRlSW1hZ2VQcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0UHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIHByZS50ZXh0Q29udGVudCA9IF9lbnRyeS5nZXRGaWxlQ29udGVudCgpO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgIGltZy5zcmMgPSBfZW50cnkucGF0aDtcclxuICAgICAgaW1nLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIGJsYWNrXCI7XHJcbiAgICAgIHJldHVybiBpbWc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgYXVkaW86IEhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgIGF1ZGlvLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgIGF1ZGlvLmNvbnRyb2xzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGF1ZGlvO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY3JpcHRQcmV2aWV3KF9zY3JpcHQ6IEZ1bmN0aW9uKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIGxldCBjb2RlOiBzdHJpbmcgPSBfc2NyaXB0LnRvU3RyaW5nKCk7XHJcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoXCIgICAgXCIsIFwiIFwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gY29kZTtcclxuICAgICAgcmV0dXJuIHByZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICAvLyBpZiAoW8aSLkF1ZGlvLCDGki5UZXh0dXJlLCDGki5BbmltYXRpb25TcHJpdGVdLnNvbWUoKF90eXBlKSA9PiB0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgX3R5cGUpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkF1ZGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5UZXh0dXJlIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TcHJpdGUpXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuZGV0YWlsKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgZWxzZSBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YS5zY3JpcHQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSBfZXZlbnQuZGV0YWlsLmRhdGE7XHJcblxyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5yZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldENhbWVyYSgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKGJyYW5jaCk7XHJcbiAgICAgIGxldCByOiBudW1iZXIgPSBicmFuY2gucmFkaXVzO1xyXG5cclxuICAgICAgdGhpcy5jbXJPcmJpdC5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IMaSLlZlY3RvcjMuWkVSTygpO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblggPSAtMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQucm90YXRpb25ZID0gMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgPSByICogMztcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5jbXJPcmJpdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcjogdW5rbm93bikge1xyXG4gICAgICAgIC8vbm9wXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBkZWZlcihfZnVuY3Rpb246IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVvdXREZWZlcilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMudGltZW91dERlZmVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIF9mdW5jdGlvbigpO1xyXG4gICAgICAgIHRoaXMudGltZW91dERlZmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBwcm9wZXJ0aWVzIG9mIGEgcmVzb3VyY2VcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1Byb3BlcnRpZXMgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzb3VyY2UpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250ZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9wZXJ0aWVzIHwgXCIgKyB0aGlzLnJlc291cmNlLm5hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSkge1xyXG4gICAgICAgICAgbGV0IGZpZWxkc2V0OiDGknVpLkRldGFpbHMgPSDGknVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUodGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsZXQgdWlNdXRhYmxlOiBDb250cm9sbGVyRGV0YWlsID0gbmV3IENvbnRyb2xsZXJEZXRhaWwodGhpcy5yZXNvdXJjZSwgZmllbGRzZXQpO1xyXG4gICAgICAgICAgY29udGVudCA9IHVpTXV0YWJsZS5kb21FbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIERpcmVjdG9yeUVudHJ5ICYmIHRoaXMucmVzb3VyY2Uuc3RhdHMpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiU2l6ZTogXCIgKyAodGhpcy5yZXNvdXJjZS5zdGF0c1tcInNpemVcIl0gLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS2lCPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiQ3JlYXRlZDogXCIgKyB0aGlzLnJlc291cmNlLnN0YXRzW1wiYmlydGh0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBcIk1vZGlmaWVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJjdGltZVwiXS50b0xvY2FsZVN0cmluZygpICsgXCI8YnIvPlwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSB7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IHRoaXMucmVzb3VyY2UudG9IaWVyYXJjaHlTdHJpbmcoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5yZXNvdXJjZS5zY3JpcHQpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gdGhpcy5yZXNvdXJjZS5zY3JpcHRba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICB2YWx1ZSA9IFwiQXJyYXkoXCIgKyB2YWx1ZS5sZW5ndGggKyBcIilcIjtcclxuICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0ga2V5ICsgXCI6IFwiICsgdmFsdWUgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpIHtcclxuICAgICAgICAgIGxldCBlbnRyaWVzOiB7IFtuYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9IDtcclxuICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5yZXNvdXJjZS5lbnRyaWVzKSB7XHJcbiAgICAgICAgICAgIGVudHJpZXNbZW50cnkudHlwZV0gPSAoZW50cmllc1tlbnRyeS50eXBlXSA/PyAwKSArIDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IGBFbnRyaWVzOiAke3RoaXMucmVzb3VyY2UuZW50cmllcy5sZW5ndGh9PGJyLz5gO1xyXG4gICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBlbnRyaWVzKVxyXG4gICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBgJHt0eXBlfTogJHtlbnRyaWVzW3R5cGVdfTxici8+YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByb3BlcnRpZXNcIik7XHJcbiAgICAgICAgY29udGVudC5pbm5lckhUTUwgPSBcIlNlbGVjdCBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCByZXNvdXJjZSB0byBleGFtaW5lIHByb3BlcnRpZXNcIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRvbS5hcHBlbmQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IDzGki5TZXJpYWxpemFibGVSZXNvdXJjZT4oX2V2ZW50LmRldGFpbC5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOiAvLyBsZXQgbW9kaWZ5IHBhc3NcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBzY3JpcHRzIGxvYWRlZFxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAtMjNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1NjcmlwdCBleHRlbmRzIFZpZXcge1xyXG4gICAgLy8gVE9ETzogY29uc2lkZXIgc2NyaXB0IG5hbWVzcGFjZXMgxpIuU2NyaXB0TmFtZXNwYWNlcyB0byBmaW5kIGFsbCBzY3JpcHRzIG5vdCBqdXN0IENvbXBvbmVudFNjcmlwdHNcclxuICAgIHByaXZhdGUgdGFibGU6IMaSdWkuVGFibGU8U2NyaXB0SW5mbz47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsaXN0U2NyaXB0cygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBgRHJhZyAmIGRyb3Agc2NyaXB0cyBvbiBcIkNvbXBvbmVudHNcImA7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIGxldCBzY3JpcHRpbmZvczogU2NyaXB0SW5mb1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IG5hbWVzcGFjZSBpbiDGki5Qcm9qZWN0LnNjcmlwdE5hbWVzcGFjZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCBpbiDGki5Qcm9qZWN0LnNjcmlwdE5hbWVzcGFjZXNbbmFtZXNwYWNlXSkge1xyXG4gICAgICAgICAgbGV0IHNjcmlwdDogRnVuY3Rpb24gPSDGki5Qcm9qZWN0LnNjcmlwdE5hbWVzcGFjZXNbbmFtZXNwYWNlXVtpbmRleF07XHJcbiAgICAgICAgICBpZiAoc2NyaXB0Lm5hbWUpXHJcbiAgICAgICAgICAgIHNjcmlwdGluZm9zLnB1c2gobmV3IFNjcmlwdEluZm8oc2NyaXB0LCBuYW1lc3BhY2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50YWJsZSA9IG5ldyDGknVpLlRhYmxlPFNjcmlwdEluZm8+KG5ldyBDb250cm9sbGVyVGFibGVTY3JpcHQoKSwgc2NyaXB0aW5mb3MpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IFNjcmlwdEluZm9bXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogU2NyaXB0SW5mb1tdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICAvLyBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAvLyAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgIC8vICAgcmV0dXJuIG1lbnU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgIC8vIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk9QRU46XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5kZXRhaWwuZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5saXN0U2NyaXB0cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59Il19