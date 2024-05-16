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
            let content = document.createElement("fieldset");
            let name = document.createElement("input");
            name.value = _entry.name;
            content.appendChild(name);
            return content;
        }
        async setValue(_entry, _id, _new) {
            try {
                _entry.name = _new;
            }
            catch (_error) {
                ƒ.Debug.warn(`Could not rename file '${_entry.name}' to '${_new}'.`, _error);
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
            let content = document.createElement("fieldset");
            let name = document.createElement("input");
            name.value = _object.name;
            content.appendChild(name);
            return content;
        }
        getAttributes(_node) {
            let attributes = [_node.isActive ? "active" : "inactive"];
            if (_node instanceof ƒ.GraphInstance)
                attributes.push("GraphInstance");
            return attributes.join(" ");
        }
        async setValue(_node, _id, _new) {
            let rename = _node.name != _new;
            if (rename) {
                _node.name = _new;
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
            let content = document.createElement("fieldset");
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
        async setValue(_data, _id, _new) {
            let inputAsNumber = Number.parseFloat(_new);
            if (_id == "name" /* ID.NAME */ && ƒ.ParticleData.isExpression(_data)) {
                let errors = [];
                if (this.data.variableNames.includes(_new))
                    errors.push(`variable "${_new}" already exists`);
                if (ƒ.ParticleData.PREDEFINED_VARIABLES[_new])
                    errors.push(`variable "${_new}" is a predefined variable and can not be redeclared. Predefined variables: [${Object.keys(ƒ.ParticleData.PREDEFINED_VARIABLES).join(", ")}]`);
                if (errors.length > 0) {
                    ƒui.Warning.display(errors, "Unable to rename", "Please resolve the errors and try again");
                    return false;
                }
                let index = this.data.variables.indexOf(_data);
                let name = this.data.variableNames[index];
                this.data.variableNames[index] = _new;
                this.renameVariable(name, _new);
                return true;
            }
            if (_id == "function" /* ID.FUNCTION */ && ƒ.ParticleData.isFunction(_data)) {
                _data.function = _new;
                return true;
            }
            if (_id == "transformation" /* ID.TRANSFORMATION */ && ƒ.ParticleData.isTransformation(_data)) {
                _data.transformation = _new;
                return true;
            }
            if (_id == "value" /* ID.VALUE */ && (ƒ.ParticleData.isVariable(_data) || ƒ.ParticleData.isConstant(_data))) {
                let input = Number.isNaN(inputAsNumber) ? _new : inputAsNumber;
                if (typeof input == "string" && !ƒ.ParticleData.PREDEFINED_VARIABLES[input] && this.data.variableNames && !this.data.variableNames.includes(input))
                    return false;
                _data.value = input;
                return true;
            }
            if (_id == "value" /* ID.VALUE */ && (ƒ.ParticleData.isCode(_data))) {
                _data.code = _new;
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
            let content = document.createElement("fieldset");
            let name = document.createElement("input");
            name.value = _object.name;
            content.appendChild(name);
            if (!(_object instanceof ResourceFolder)) {
                content.setAttribute("icon", _object.type);
                if (_object.status == ƒ.RESOURCE_STATUS.ERROR) {
                    content.classList.add("error");
                    content.title = "Failed to load resource from file. Check the console for details.";
                }
            }
            return content;
        }
        getAttributes(_object) {
            return "";
        }
        async setValue(_entry, _id, _new) {
            let rename = _entry.name != _new;
            if (rename) {
                _entry.name = _new;
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
            vctDelta.transform(ƒ.Matrix3x3.SCALING(ƒ.Matrix3x3.INVERSION(this.mtxWorldToScreen).scaling));
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
            vector.transform(ƒ.Matrix3x3.INVERSION(this.mtxWorldToScreen));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFnZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Qcm9qZWN0LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckRldGFpbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVJlc291cmNlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRhYmxlU2NyaXB0cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlRGlyZWN0b3J5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEdyYXBoLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsSGVscC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXdQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvQW5pbWF0aW9uL1ZpZXdBbmltYXRpb25TaGVldC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdDb21wb25lbnRzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvR3JhcGgvVmlld0hpZXJhcmNoeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdSZW5kZXIudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbFRhYmxlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3UHJldmlldy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1Byb3BlcnRpZXMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBaUNkO0FBakNELFdBQVUsS0FBSztJQUNiLG1DQUFtQztJQUNuQyx3QkFBd0I7SUFTeEIsTUFBYSxXQUFXO1FBQ2YsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFvQjtZQUNoRCxLQUFL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QUksRUFBRSxDQUFDLENBQUM7WUFDdEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM1RixJ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UUFDekMsQ0FBQztRQUVNLGtCQUFrQjtZQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDaEQsQ0FBQztRQUVELHVCQUF1QjtRQUN2Qiw0RUFBNEU7UUFDNUUsbURBQW1EO1FBQ25ELGlCQUFpQjtRQUNqQixJQUFJO1FBRUosMkhBQTJIO1FBQzNILG1GQUFtRjtRQUNuRixJQUFJO1FBQ0osWUFBWTtRQUVKLFFBQVEsR0FBRyxDQUFDLE1BQW1CLEVBQVEsRUFBRTtZQUMvQyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ3pCLEtBQUssTUFBQSxZQUFZLENBQUMsSUFBSTtvQkFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSTt3QkFDckIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNyQixNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUMsQ0FBQztLQUNIO0lBeERZLGdCQUFVLGFBd0R0QixDQUFBO0FBQ0gsQ0FBQyxFQWpFUyxLQUFLLEtBQUwsS0FBSyxRQWlFZCIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgLy8gaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgLy8gaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgdHlwZSBDb250ZXh0TWVudUNhbGxiYWNrID0gKG1lbnVJdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgYnJvd3NlcldpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgZXZlbnQ6IEVsZWN0cm9uLktleWJvYXJkRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gIHR5cGUgU3ViY2xhc3M8VD4gPSB7XHJcbiAgICBzdWJjbGFzc2VzOiBUW11cclxuICAgIG5hbWU6IHN0cmluZ1xyXG4gIH07XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250ZXh0TWVudSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFwcGVuZENvcHlQYXN0ZShfbWVudTogRWxlY3Ryb24uTWVudSk6IHZvaWQge1xyXG4gICAgICBfbWVudS5hcHBlbmQobmV3IHJlbW90ZS5NZW51SXRlbSh7IHJvbGU6IFwiY29weVwiIH0pKTtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcImN1dFwiIH0pKTtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcInBhc3RlXCIgfSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFN1YmNsYXNzTWVudTxUIGV4dGVuZHMgU3ViY2xhc3M8VD4+KF9pZDogQ09OVEVYVE1FTlUsIF9jbGFzczogVCwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChsZXQgaVN1YmNsYXNzIGluIF9jbGFzcy5zdWJjbGFzc2VzKSB7XHJcbiAgICAgICAgbGV0IHN1YmNsYXNzOiBUID0gX2NsYXNzLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgeyBsYWJlbDogc3ViY2xhc3MubmFtZSwgaWQ6IFN0cmluZyhfaWQpLCBjbGljazogX2NhbGxiYWNrIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGl0ZW0ub3ZlcnJpZGVQcm9wZXJ0eShcImlTdWJjbGFzc1wiLCBpU3ViY2xhc3MpO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgZXhwb3J0IGVudW0gQ09OVEVYVE1FTlUge1xyXG4gICAgLy8gU0tFVENIID0gVmlld1NrZXRjaCxcclxuICAgIEFERF9OT0RFLFxyXG4gICAgQUNUSVZBVEVfTk9ERSxcclxuICAgIERFTEVURV9OT0RFLFxyXG4gICAgQUREX0NPTVBPTkVOVCxcclxuICAgIERFTEVURV9DT01QT05FTlQsXHJcbiAgICBBRERfQ09NUE9ORU5UX1NDUklQVCxcclxuICAgIEVESVQsXHJcbiAgICBDUkVBVEVfRk9MREVSLFxyXG4gICAgQ1JFQVRFX01FU0gsXHJcbiAgICBDUkVBVEVfTUFURVJJQUwsXHJcbiAgICBDUkVBVEVfR1JBUEgsXHJcbiAgICBDUkVBVEVfQU5JTUFUSU9OLFxyXG4gICAgQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCxcclxuICAgIFNZTkNfSU5TVEFOQ0VTLFxyXG4gICAgUkVNT1ZFX0NPTVBPTkVOVCxcclxuICAgIEFERF9KT0lOVCxcclxuICAgIERFTEVURV9SRVNPVVJDRSxcclxuICAgIE9SVEhHUkFQSElDX0NBTUVSQSxcclxuICAgIFJFTkRFUl9DT05USU5VT1VTTFksXHJcbiAgICBBRERfUFJPUEVSVFksXHJcbiAgICBERUxFVEVfUFJPUEVSVFksXHJcbiAgICBDT05WRVJUX0FOSU1BVElPTixcclxuICAgIEFERF9QQVJUSUNMRV9QUk9QRVJUWSxcclxuICAgIEFERF9QQVJUSUNMRV9GVU5DVElPTixcclxuICAgIEFERF9QQVJUSUNMRV9DT05TVEFOVCxcclxuICAgIEFERF9QQVJUSUNMRV9DT0RFLFxyXG4gICAgQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OLFxyXG4gICAgREVMRVRFX1BBUlRJQ0xFX0RBVEFcclxuICB9XHJcblxyXG5cclxuICBleHBvcnQgZW51bSBNRU5VIHtcclxuICAgIFFVSVQgPSBcInF1aXRcIixcclxuICAgIFBST0pFQ1RfTkVXID0gXCJwcm9qZWN0TmV3XCIsXHJcbiAgICBQUk9KRUNUX1NBVkUgPSBcInByb2plY3RTYXZlXCIsXHJcbiAgICBQUk9KRUNUX0xPQUQgPSBcInByb2plY3RMb2FkXCIsXHJcbiAgICBERVZUT09MU19PUEVOID0gXCJkZXZ0b29sc09wZW5cIixcclxuICAgIFBBTkVMX0dSQVBIX09QRU4gPSBcInBhbmVsR3JhcGhPcGVuXCIsXHJcbiAgICBQQU5FTF9BTklNQVRJT05fT1BFTiA9IFwicGFuZWxBbmltYXRpb25PcGVuXCIsXHJcbiAgICBQQU5FTF9QUk9KRUNUX09QRU4gPSBcInBhbmVsUHJvamVjdE9wZW5cIixcclxuICAgIFBBTkVMX0hFTFBfT1BFTiA9IFwicGFuZWxIZWxwT3BlblwiLFxyXG4gICAgUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4gPSBcInBhbmVsUGFydGljbGVTeXN0ZW1PcGVuXCIsXHJcbiAgICBGVUxMU0NSRUVOID0gXCJmdWxsc2NyZWVuXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIFBBTkVMIHtcclxuICAgIEdSQVBIID0gXCJQYW5lbEdyYXBoXCIsXHJcbiAgICBQUk9KRUNUID0gXCJQYW5lbFByb2plY3RcIixcclxuICAgIEhFTFAgPSBcIlBhbmVsSGVscFwiLFxyXG4gICAgQU5JTUFUSU9OID0gXCJQYW5lbEFuaW1hdGlvblwiLFxyXG4gICAgUEFSVElDTEVfU1lTVEVNID0gXCJQYW5lbFBhcnRpY2xlU3lzdGVtXCJcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBWSUVXIHtcclxuICAgIEhJRVJBUkNIWSA9IFwiVmlld0hpZXJhcmNoeVwiLFxyXG4gICAgQU5JTUFUSU9OID0gXCJWaWV3QW5pbWF0aW9uXCIsXHJcbiAgICBBTklNQVRJT05fU0hFRVQgPSBcIlZpZXdBbmltYXRpb25TaGVldFwiLFxyXG4gICAgUkVOREVSID0gXCJWaWV3UmVuZGVyXCIsXHJcbiAgICBDT01QT05FTlRTID0gXCJWaWV3Q29tcG9uZW50c1wiLFxyXG4gICAgQ0FNRVJBID0gXCJWaWV3Q2FtZXJhXCIsXHJcbiAgICBJTlRFUk5BTF9UQUJMRSA9IFwiVmlld0ludGVybmFsVGFibGVcIixcclxuICAgIElOVEVSTkFMX0ZPTERFUiA9IFwiVmlld0ludGVybmFsRm9sZGVyXCIsXHJcbiAgICBFWFRFUk5BTCA9IFwiVmlld0V4dGVybmFsXCIsXHJcbiAgICBQUk9QRVJUSUVTID0gXCJWaWV3UHJvcGVydGllc1wiLFxyXG4gICAgUFJFVklFVyA9IFwiVmlld1ByZXZpZXdcIixcclxuICAgIFNDUklQVCA9IFwiVmlld1NjcmlwdFwiLFxyXG4gICAgUEFSVElDTEVfU1lTVEVNID0gXCJWaWV3UGFydGljbGVTeXN0ZW1cIlxyXG4gICAgLy8gU0tFVENIID0gVmlld1NrZXRjaCxcclxuICAgIC8vIE1FU0ggPSBWaWV3TWVzaCxcclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIFRSQU5TRk9STSB7XHJcbiAgICBUUkFOU0xBVEUgPSBcInRyYW5zbGF0ZVwiLFxyXG4gICAgUk9UQVRFID0gXCJyb3RhdGVcIixcclxuICAgIFNDQUxFID0gXCJzY2FsZVwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBHSVpNT1Mge1xyXG4gICAgVFJBTlNGT1JNID0gXCJUcmFuc2Zvcm1cIlxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcblxyXG4gIGV4cG9ydCBlbnVtIE1JTUUge1xyXG4gICAgVEVYVCA9IFwidGV4dFwiLFxyXG4gICAgQVVESU8gPSBcImF1ZGlvXCIsXHJcbiAgICBJTUFHRSA9IFwiaW1hZ2VcIixcclxuICAgIE1FU0ggPSBcIm1lc2hcIixcclxuICAgIEdMVEYgPSBcImdsdGZcIixcclxuICAgIFVOS05PV04gPSBcInVua25vd25cIlxyXG4gIH1cclxuXHJcbiAgbGV0IG1pbWU6IE1hcDxNSU1FLCBzdHJpbmdbXT4gPSBuZXcgTWFwKFtcclxuICAgIFtNSU1FLlRFWFQsIFtcInRzXCIsIFwianNvblwiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJjc3NcIiwgXCJqc1wiLCBcInR4dFwiXV0sXHJcbiAgICBbTUlNRS5NRVNILCBbXCJvYmpcIl1dLFxyXG4gICAgW01JTUUuQVVESU8sIFtcIm1wM1wiLCBcIndhdlwiLCBcIm9nZ1wiXV0sXHJcbiAgICBbTUlNRS5JTUFHRSwgW1wicG5nXCIsIFwianBnXCIsIFwianBlZ1wiLCBcInRpZlwiLCBcInRnYVwiLCBcImdpZlwiXV0sXHJcbiAgICBbTUlNRS5HTFRGLCBbXCJnbHRmXCIsIFwiZ2xiXCJdXVxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBmczogdHlwZW9mIGltcG9ydChcImZzXCIpID0gcmVxdWlyZShcImZzXCIpO1xyXG4gIGNvbnN0IHA6IHR5cGVvZiBpbXBvcnQoXCJwYXRoXCIpID0gcmVxdWlyZShcInBhdGhcIik7XHJcbiAgdHlwZSBEaXJlbnQgPSBpbXBvcnQoXCJmc1wiKS5EaXJlbnQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBEaXJlY3RvcnlFbnRyeSB7XHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhdGhSZWxhdGl2ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGRpcmVudDogRGlyZW50O1xyXG4gICAgcHVibGljIHN0YXRzOiBPYmplY3Q7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcsIF9wYXRoUmVsYXRpdmU6IHN0cmluZywgX2RpcmVudDogRGlyZW50LCBfc3RhdHM6IE9iamVjdCkge1xyXG4gICAgICB0aGlzLnBhdGggPSBwLm5vcm1hbGl6ZShfcGF0aCk7XHJcbiAgICAgIHRoaXMucGF0aFJlbGF0aXZlID0gcC5ub3JtYWxpemUoX3BhdGhSZWxhdGl2ZSk7XHJcbiAgICAgIHRoaXMuZGlyZW50ID0gX2RpcmVudDtcclxuICAgICAgdGhpcy5zdGF0cyA9IF9zdGF0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJvb3QoX3BhdGg6IHN0cmluZyk6IERpcmVjdG9yeUVudHJ5IHtcclxuICAgICAgbGV0IGRpcmVudDogRGlyZW50ID0gbmV3IGZzLkRpcmVudCgpO1xyXG4gICAgICBkaXJlbnQubmFtZSA9IHAuYmFzZW5hbWUoX3BhdGgpO1xyXG4gICAgICBkaXJlbnQuaXNEaXJlY3RvcnkgPSAoKSA9PiB0cnVlO1xyXG4gICAgICByZXR1cm4gbmV3IERpcmVjdG9yeUVudHJ5KF9wYXRoLCBcIlwiLCBkaXJlbnQsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlbnQubmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgbmFtZShfbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgIGxldCBuZXdQYXRoOiBzdHJpbmcgPSBwLmpvaW4ocC5kaXJuYW1lKHRoaXMucGF0aCksIF9uYW1lKTtcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobmV3UGF0aCkpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBhbHJlYWR5IGEgZmlsZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSAnJHtfbmFtZX0nLiBTcGVjaWZ5IGEgZGlmZmVyZW50IG5hbWUuYCk7XHJcbiAgICAgIGZzLnJlbmFtZVN5bmModGhpcy5wYXRoLCBuZXdQYXRoKTtcclxuICAgICAgdGhpcy5wYXRoID0gbmV3UGF0aDtcclxuICAgICAgdGhpcy5kaXJlbnQubmFtZSA9IF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXJlY3RvcnkoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVudC5pc0RpcmVjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0RpcmVjdG9yeSA/IFwiRGlyZWN0b3J5XCIgOiBcIkZpbGVcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICBmcy5ybVN5bmModGhpcy5wYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGlyZWN0b3J5Q29udGVudCgpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IGRpcmVudHM6IERpcmVudFtdID0gZnMucmVhZGRpclN5bmModGhpcy5wYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGRpcmVudCBvZiBkaXJlbnRzKSB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IHAuam9pbih0aGlzLnBhdGgsIGRpcmVudC5uYW1lKTtcclxuICAgICAgICBsZXQgcGF0aFJlbGF0aXZlOiBzdHJpbmcgPSBwLmpvaW4odGhpcy5wYXRoUmVsYXRpdmUsIGRpcmVudC5uYW1lKTtcclxuICAgICAgICBsZXQgc3RhdHM6IE9iamVjdCA9IGZzLnN0YXRTeW5jKHBhdGgpO1xyXG4gICAgICAgIGxldCBlbnRyeTogRGlyZWN0b3J5RW50cnkgPSBuZXcgRGlyZWN0b3J5RW50cnkocGF0aCwgcGF0aFJlbGF0aXZlLCBkaXJlbnQsIHN0YXRzKTtcclxuICAgICAgICBjb250ZW50LnB1c2goZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGaWxlQ29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgY29udGVudDogc3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aCwgXCJ1dGY4XCIpO1xyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRW50cnkoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IHZvaWQge1xyXG4gICAgICBmcy5jb3B5RmlsZVN5bmMoX2VudHJ5LnBhdGgsIHAuam9pbih0aGlzLnBhdGgsIF9lbnRyeS5uYW1lKSwgZnMuY29uc3RhbnRzLkNPUFlGSUxFX0VYQ0wpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNaW1lVHlwZSgpOiBNSU1FIHtcclxuICAgICAgbGV0IGV4dGVuc2lvbjogc3RyaW5nID0gdGhpcy5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKTtcclxuICAgICAgZm9yIChsZXQgdHlwZSBvZiBtaW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVbMV0uaW5kZXhPZihleHRlbnNpb24pID4gLTEpXHJcbiAgICAgICAgICByZXR1cm4gdHlwZVswXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTUlNRS5VTktOT1dOO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHBhdGggb2YgRGlyZWN0b3J5RW50cmllcyBzdGFydGluZyBhdCB0aGUgcm9vdCBhbmQgZW5kaW5nIGF0IHRoaXMgRGlyZWN0b3J5RW50cnkuIFxyXG4gICAgICogVGhlIGVudHJpZXMgaW4gdGhlIHJldHVybmVkIHBhdGggT05MWSBoYXZlIHRoZWlyIHJlbGF0aXZlIHBhdGggc2V0LiBUaGlzIGlzIHNvbGVseSB1c2VkIGZvciBkaXNwbGF5IHB1cnBvc2VzIGluIHtAbGluayBWaWV3RXh0ZXJuYWx9cyB0cmVlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UGF0aCgpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IHRyYWNlOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBjdXJyZW50UGF0aDogc3RyaW5nID0gdGhpcy5wYXRoUmVsYXRpdmU7XHJcbiAgICAgIHdoaWxlIChjdXJyZW50UGF0aCAhPSB0cmFjZVt0cmFjZS5sZW5ndGggLSAxXT8ucGF0aFJlbGF0aXZlKSB7XHJcbiAgICAgICAgdHJhY2UucHVzaChuZXcgRGlyZWN0b3J5RW50cnkoXCJcIiwgY3VycmVudFBhdGgsIG51bGwsIG51bGwpKTtcclxuICAgICAgICBjdXJyZW50UGF0aCA9IHAuZGlybmFtZShjdXJyZW50UGF0aCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRyYWNlLnJldmVyc2UoKTtcclxuICAgICAgcmV0dXJuIHRyYWNlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIFxyXG4gIGV4cG9ydCBlbnVtIEVWRU5UX0VESVRPUiB7XHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgY3JlYXRlZCwgaXMgbm90IGRpc3BhdGNoZWQgc28gZmFyICovXHJcbiAgICBDUkVBVEUgPSBcIkVESVRPUl9DUkVBVEVcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBzZWxlY3RlZCBhbmQgaXQgaXMgbmVjZXNzYXJ5IHRvIHN3aXRjaCBjb250ZW50cyBpbiB0aGUgdmlld3MgKi9cclxuICAgIFNFTEVDVCA9IFwiRURJVE9SX1NFTEVDVFwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIG1vZGlmaWVkIHN0cnVjdHVyYWxseSBhbmQgaXQgaXMgbmVjZXNzYXJ5IHRvIHVwZGF0ZSB2aWV3cyAqL1xyXG4gICAgTU9ESUZZID0gXCJFRElUT1JfTU9ESUZZXCIsXHJcbiAgICAvKiogVmFsdWVzIG9mIGFuIGVudGl0eSBjaGFuZ2UgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byB1cGRhdGUgdmlld3MgKi9cclxuICAgIFVQREFURSA9IFwiRURJVE9SX1VQREFURVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIGRlbGV0ZWQgKi9cclxuICAgIERFTEVURSA9IFwiRURJVE9SX0RFTEVURVwiLFxyXG4gICAgLyoqIEEgdmlldyBvciBwYW5lbCBjbG9zZXMgKi9cclxuICAgIENMT1NFID0gXCJFRElUT1JfQ0xPU0VcIixcclxuICAgIC8qKiBBIHZpZXcgb3IgcGFuZWwgb3BlbnMgKi9cclxuICAgIE9QRU4gPSBcIkVESVRPUl9PUEVOXCJcclxuICAgIC8qKiBBIHRyYW5zZm9ybSBtYXRyaXggZ2V0cyBhZGp1c3RlZCBpbnRlcmFjdGl2ZWx5ICovLFxyXG4gICAgVFJBTlNGT1JNID0gXCJFRElUT1JfVFJBTlNGT1JNXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IHJlY2lldmVzIGZvY3VzIGFuZCBjYW4gYmUgbWFuaXB1bGF0ZWQgdXNpbmcgdGhlIGtleWJvYXJkICovXHJcbiAgICBGT0NVUyA9IFwiRURJVE9SX0ZPQ1VTXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRXZlbnREZXRhaWwge1xyXG4gICAgdmlldz86IFZpZXc7XHJcbiAgICBzZW5kZXI/OiBQYW5lbCB8IFBhZ2U7XHJcbiAgICBub2RlPzogxpIuTm9kZTtcclxuICAgIGdyYXBoPzogxpIuR3JhcGg7XHJcbiAgICByZXNvdXJjZT86IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlO1xyXG4gICAgbXV0YWJsZT86IMaSLk11dGFibGU7XHJcbiAgICB0cmFuc2Zvcm0/OiBPYmplY3Q7XHJcbiAgICBkYXRhPzogxpIuR2VuZXJhbDtcclxuICAgIC8vIHBhdGg/OiBWaWV3W107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgQ3VzdG9tRXZlbnQgdGhhdCBzdXBwb3J0cyBhIGRldGFpbCBmaWVsZCB3aXRoIHRoZSB0eXBlIEV2ZW50RGV0YWlsXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEVkaXRvckV2ZW50IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8RXZlbnREZXRhaWw+IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGF0Y2goX3RhcmdldDogRXZlbnRUYXJnZXQsIF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF90YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBjb25zdCBmczogdHlwZW9mIGltcG9ydChcImZzXCIpID0gcmVxdWlyZShcImZzXCIpO1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBleHBvcnQgbGV0IHdhdGNoZXI6IGltcG9ydChcImZzXCIpLkZTV2F0Y2hlcjtcclxuXHJcbiAgaW50ZXJmYWNlIENvcHlMaXN0IHtcclxuICAgIFtzcmM6IHN0cmluZ106IHN0cmluZztcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBuZXdQcm9qZWN0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGZpbGVuYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHJlbW90ZS5kaWFsb2cuc2hvd09wZW5EaWFsb2dTeW5jKG51bGwsIHtcclxuICAgICAgcHJvcGVydGllczogW1wib3BlbkRpcmVjdG9yeVwiLCBcImNyZWF0ZURpcmVjdG9yeVwiXSwgdGl0bGU6IFwiU2VsZWN0L0NyZWF0ZSBhIGZvbGRlciB0byBzYXZlIHRoZSBwcm9qZWN0IHRvLiBUaGUgZm9sZGVybmFtZSBiZWNvbWVzIHRoZSBuYW1lIG9mIHlvdXIgcHJvamVjdFwiLCBidXR0b25MYWJlbDogXCJTYXZlIFByb2plY3RcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFmaWxlbmFtZSlcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBiYXNlOiBVUkwgPSBuZXcgVVJMKG5ldyBVUkwoXCJmaWxlOi8vXCIgKyBmaWxlbmFtZVswXSkudG9TdHJpbmcoKSArIFwiL1wiKTtcclxuICAgIGNvbnNvbGUubG9nKFwiUGF0aFwiLCBiYXNlLnRvU3RyaW5nKCkpO1xyXG4gICAgICBcclxuICAgIHByb2plY3QgPSBuZXcgUHJvamVjdChiYXNlKTtcclxuXHJcbiAgICBhd2FpdCBzYXZlUHJvamVjdCh0cnVlKTtcclxuXHJcbiAgICBsZXQgxpJQYXRoOiBVUkwgPSBuZXcgVVJMKFwiLi4vLi4vXCIsIGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgY29uc29sZS5sb2coxpJQYXRoKTtcclxuXHJcbiAgICBmcy5jb3B5RmlsZVN5bmMobmV3IFVSTChcIkVkaXRvci9Tb3VyY2UvVGVtcGxhdGUvLmdpdGlnbm9yZS50eHRcIiwgxpJQYXRoKSwgbmV3IFVSTChcIi5naXRpZ25vcmVcIiwgYmFzZSkpO1xyXG4gICAgZnMubWtkaXJTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZS9AdHlwZXNcIiwgYmFzZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgZnMubWtkaXJTeW5jKG5ldyBVUkwoXCJTY3JpcHQvQnVpbGRcIiwgYmFzZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG5cclxuICAgIGxldCBjb3B5VGVtcGxhdGVzOiBDb3B5TGlzdCA9IHtcclxuICAgICAgXCJDdXN0b21Db21wb25lbnRTY3JpcHQudHh0XCI6IFwiU291cmNlL0N1c3RvbUNvbXBvbmVudFNjcmlwdC50c1wiLFxyXG4gICAgICBcIk1haW4udHh0XCI6IFwiU291cmNlL01haW4udHNcIixcclxuICAgICAgXCJ0c2NvbmZpZy50eHRcIjogXCJTb3VyY2UvdHNjb25maWcuanNvblwiLFxyXG4gICAgICBcIlNjcmlwdC50eHRcIjogXCIgQnVpbGQvU2NyaXB0LmpzXCIsXHJcbiAgICAgIFwiQXV0b3ZpZXcuanNcIjogXCIuLi9BdXRvdmlldy5qc1wiXHJcbiAgICB9O1xyXG4gICAgY29weUZpbGVzKGNvcHlUZW1wbGF0ZXMsIG5ldyBVUkwoXCJFZGl0b3IvU291cmNlL1RlbXBsYXRlL1wiLCDGklBhdGgpLCBuZXcgVVJMKFwiU2NyaXB0L1wiLCBiYXNlKSk7XHJcblxyXG4gICAgbGV0IGRlZmluaXRpb246IFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2UvQHR5cGVzL0Z1ZGdlQ29yZS5kLnRzXCIsIGJhc2UpLCBhd2FpdCBkZWZpbml0aW9uLnRleHQoKSk7XHJcblxyXG4gICAgYXdhaXQgbG9hZFByb2plY3QobmV3IFVSTChwcm9qZWN0LmZpbGVJbmRleCwgcHJvamVjdC5iYXNlKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb3B5RmlsZXMoX2xpc3Q6IENvcHlMaXN0LCBfc3JjUGF0aDogVVJMLCBfZGVzdFBhdGg6IFVSTCk6IHZvaWQge1xyXG4gICAgZm9yIChsZXQgY29weSBpbiBfbGlzdCkge1xyXG4gICAgICBsZXQgc3JjOiBVUkwgPSBuZXcgVVJMKGNvcHksIF9zcmNQYXRoKTtcclxuICAgICAgbGV0IGRlc3Q6IFVSTCA9IG5ldyBVUkwoX2xpc3RbY29weV0sIF9kZXN0UGF0aCk7XHJcbiAgICAgIGZzLmNvcHlGaWxlU3luYyhzcmMsIGRlc3QpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVQcm9qZWN0KF9uZXc6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgaWYgKCFwcm9qZWN0KVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgaWYgKCFhd2FpdCBwcm9qZWN0Lm9wZW5EaWFsb2coKSlcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHVud2F0Y2hGb2xkZXIoKTtcclxuXHJcbiAgICBsZXQgYmFzZTogVVJMID0gcHJvamVjdC5iYXNlO1xyXG5cclxuICAgIGlmIChfbmV3KSB7XHJcbiAgICAgIGxldCBjc3NGaWxlTmFtZTogVVJMID0gbmV3IFVSTChwcm9qZWN0LmZpbGVTdHlsZXMsIGJhc2UpO1xyXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGNzc0ZpbGVOYW1lLCBwcm9qZWN0LmdldFByb2plY3RDU1MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWw6IHN0cmluZyA9IHByb2plY3QuZ2V0UHJvamVjdEhUTUwocHJvamVjdC5uYW1lKTtcclxuICAgIGxldCBodG1sRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlSW5kZXgsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhodG1sRmlsZU5hbWUsIGh0bWwpO1xyXG5cclxuICAgIGxldCBqc29uRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlSW50ZXJuYWwsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0UHJvamVjdEpTT04oKSk7XHJcblxyXG4gICAganNvbkZpbGVOYW1lID0gbmV3IFVSTChwcm9qZWN0LmZpbGVJbnRlcm5hbEZvbGRlciwgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25GaWxlTmFtZSwgcHJvamVjdC5nZXRSZXNvdXJjZUZvbGRlckpTT04oKSk7XHJcblxyXG4gICAganNvbkZpbGVOYW1lID0gbmV3IFVSTChwcm9qZWN0LmZpbGVTZXR0aW5ncywgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25GaWxlTmFtZSwgcHJvamVjdC5nZXRTZXR0aW5nc0pTT04oKSk7XHJcblxyXG4gICAgd2F0Y2hGb2xkZXIoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb21wdExvYWRQcm9qZWN0KCk6IFByb21pc2U8VVJMPiB7XHJcbiAgICBsZXQgZmlsZW5hbWVzOiBzdHJpbmdbXSA9IHJlbW90ZS5kaWFsb2cuc2hvd09wZW5EaWFsb2dTeW5jKG51bGwsIHtcclxuICAgICAgdGl0bGU6IFwiTG9hZCBQcm9qZWN0XCIsIGJ1dHRvbkxhYmVsOiBcIkxvYWQgUHJvamVjdFwiLCBwcm9wZXJ0aWVzOiBbXCJvcGVuRmlsZVwiXSxcclxuICAgICAgZmlsdGVyczogW3sgbmFtZTogXCJIVE1MLUZpbGVcIiwgZXh0ZW5zaW9uczogW1wiaHRtbFwiLCBcImh0bVwiXSB9XVxyXG4gICAgfSk7XHJcbiAgICBpZiAoIWZpbGVuYW1lcylcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFVSTChcImZpbGU6Ly9cIiArIGZpbGVuYW1lc1swXSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFByb2plY3QoX3VybDogVVJMKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgaHRtbENvbnRlbnQ6IHN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhfdXJsLCB7IGVuY29kaW5nOiBcInV0Zi04XCIgfSk7XHJcbiAgICDGki5EZWJ1Zy5ncm91cENvbGxhcHNlZChcIkZpbGUgY29udGVudFwiKTtcclxuICAgIMaSLkRlYnVnLmluZm8oaHRtbENvbnRlbnQpO1xyXG4gICAgxpIuRGVidWcuZ3JvdXBFbmQoKTtcclxuXHJcbiAgICB1bndhdGNoRm9sZGVyKCk7XHJcblxyXG4gICAgcHJvamVjdCA9IG5ldyBQcm9qZWN0KF91cmwpO1xyXG4gICAgYXdhaXQgcHJvamVjdC5sb2FkKGh0bWxDb250ZW50KTtcclxuXHJcbiAgICB3YXRjaEZvbGRlcigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gd2F0Y2hGb2xkZXIoKTogdm9pZCB7XHJcbiAgICBsZXQgZGlyOiBVUkwgPSBuZXcgVVJMKFwiLlwiLCBwcm9qZWN0LmJhc2UpO1xyXG4gICAgd2F0Y2hlciA9IGZzLndhdGNoKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSwgaG5kRmlsZUNoYW5nZSk7XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gaG5kRmlsZUNoYW5nZShfZXZlbnQ6IHN0cmluZywgX2ZpbGVuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVJbmRleCB8fCBfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlSW50ZXJuYWwgfHwgX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZVNjcmlwdCkge1xyXG4gICAgICAgIHVud2F0Y2hGb2xkZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdChudWxsLCBmYWxzZSwgXCJJbXBvcnRhbnQgZmlsZSBjaGFuZ2VcIiwgXCJSZWxvYWQgcHJvamVjdD9cIiwgXCJSZWxvYWRcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIGF3YWl0IGxvYWRQcm9qZWN0KHByb2plY3QuYmFzZSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICB3YXRjaGVyID0gZnMud2F0Y2goZGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LCBobmRGaWxlQ2hhbmdlKTtcclxuICAgICAgfVxyXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gdW53YXRjaEZvbGRlcigpOiB2b2lkIHtcclxuICAgIGlmICghd2F0Y2hlcilcclxuICAgICAgcmV0dXJuO1xyXG4gICAgd2F0Y2hlci51bnJlZigpO1xyXG4gICAgd2F0Y2hlci5jbG9zZSgpO1xyXG4gIH1cclxufVxyXG5cclxuIiwiLy8vPHJlZmVyZW5jZSB0eXBlcz1cIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi9FbGVjdHJvblwiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiRGVmaW5pdGlvbi50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8vIGltcG9ydCDGkmFpZCA9IEZ1ZGdlQWlkO1xyXG4gIC8vIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgY29uc3QgaXBjUmVuZGVyZXI6IEVsZWN0cm9uLklwY1JlbmRlcmVyID0gcmVxdWlyZShcImVsZWN0cm9uXCIpLmlwY1JlbmRlcmVyOyAvLyBSZXBsYWNlIHdpdGg6XHJcbiAgZXhwb3J0IGNvbnN0IHJlbW90ZTogdHlwZW9mIGltcG9ydChcIkBlbGVjdHJvbi9yZW1vdGVcIikgPSByZXF1aXJlKFwiQGVsZWN0cm9uL3JlbW90ZVwiKTtcclxuXHJcbiAgZXhwb3J0IGxldCBwcm9qZWN0OiBQcm9qZWN0OyAvLyA9IG5ldyBQcm9qZWN0KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB1cHBlcm1vc3QgY29udGFpbmVyIGZvciBhbGwgcGFuZWxzIGNvbnRyb2xsaW5nIGRhdGEgZmxvdyBiZXR3ZWVuLiBcclxuICAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFnZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdvbGRlbkxheW91dE1vZHVsZTogxpIuR2VuZXJhbCA9IChnbG9iYWxUaGlzIGFzIMaSLkdlbmVyYWwpLmdvbGRlbkxheW91dDsgIC8vIMaSLkdlbmVyYWwgaXMgc3lub255bSBmb3IgYW55Li4uIGhhY2sgdG8gZ2V0IEdvbGRlbkxheW91dCB0byB3b3JrXHJcbiAgICBwdWJsaWMgc3RhdGljIG1vZGVUcmFuc2Zvcm06IFRSQU5TRk9STSA9IFRSQU5TRk9STS5UUkFOU0xBVEU7XHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnb2xkZW5MYXlvdXQ6IEdvbGRlbkxheW91dDtcclxuICAgIHByaXZhdGUgc3RhdGljIHBhbmVsczogUGFuZWxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGh5c2ljczogeyBbaWRHcmFwaDogc3RyaW5nXTogxpIuUGh5c2ljcyB9ID0ge307XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXREZWZhdWx0UHJvamVjdCgpOiB2b2lkIHtcclxuICAgICAgY29uc29sZS5sb2coXCJTZXQgZGVmYXVsdCBwcm9qZWN0IGluIGxvY2FsIHN0b3JhZ2VcIiwgcHJvamVjdCk7XHJcbiAgICAgIGlmIChwcm9qZWN0KVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvamVjdFwiLCBwcm9qZWN0LmJhc2UudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRMYXlvdXQoKTogUmVzb2x2ZWRMYXlvdXRDb25maWcge1xyXG4gICAgICByZXR1cm4gUGFnZS5nb2xkZW5MYXlvdXQuc2F2ZUxheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZExheW91dChfbGF5b3V0PzogTGF5b3V0Q29uZmlnKTogdm9pZCB7XHJcbiAgICAgIF9sYXlvdXQgPz89IHtcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgIHBvcG91dDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJvb3Q6IHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBpc0Nsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgICAgIGNvbnRlbnQ6IFtdXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQubG9hZExheW91dChfbGF5b3V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFRyYW5zZm9ybShfbW9kZTogVFJBTlNGT1JNKTogdm9pZCB7XHJcbiAgICAgIFBhZ2UubW9kZVRyYW5zZm9ybSA9IF9tb2RlO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgVHJhbnNmb3JtIG1vZGU6ICR7X21vZGV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQaHlzaWNzKF9ncmFwaDogxpIuR3JhcGgpOiDGki5QaHlzaWNzIHtcclxuICAgICAgcmV0dXJuIFBhZ2UucGh5c2ljc1tfZ3JhcGguaWRSZXNvdXJjZV0gfHwgKFBhZ2UucGh5c2ljc1tfZ3JhcGguaWRSZXNvdXJjZV0gPSBuZXcgxpIuUGh5c2ljcygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxsZWQgYnkgd2luZG93cyBsb2FkLWxpc3RlbmVyXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgLy8gxpIuRGVidWcuc2V0RmlsdGVyKMaSLkRlYnVnQ29uc29sZSwgxpIuREVCVUdfRklMVEVSLkFMTCB8IMaSLkRFQlVHX0ZJTFRFUi5TT1VSQ0UpO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coXCJMb2NhbFN0b3JhZ2VcIiwgbG9jYWxTdG9yYWdlKTtcclxuXHJcbiAgICAgIFBhZ2Uuc2V0dXBHb2xkZW5MYXlvdXQoKTtcclxuICAgICAgxpIuUHJvamVjdC5tb2RlID0gxpIuTU9ERS5FRElUT1I7XHJcblxyXG4gICAgICBQYWdlLnNldHVwTWFpbkxpc3RlbmVycygpO1xyXG4gICAgICBQYWdlLnNldHVwUGFnZUxpc3RlbmVycygpO1xyXG4gICAgICAvLyBmb3IgdGVzdGluZzpcclxuICAgICAgLy8gaXBjUmVuZGVyZXIuZW1pdChNRU5VLlBBTkVMX1BST0pFQ1RfT1BFTik7XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QQU5FTF9HUkFQSF9PUEVOKTtcclxuICAgICAgLy8gaXBjUmVuZGVyZXIuZW1pdChNRU5VLlBST0pFQ1RfTE9BRCk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUFJPSkVDVF9TQVZFLCBvbjogZmFsc2UgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCBvbjogZmFsc2UgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0hFTFBfT1BFTiwgb246IHRydWUgfSk7XHJcblxyXG4gICAgICBpZiAobG9jYWxTdG9yYWdlLnByb2plY3QpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWQgcHJvamVjdCByZWZlcmVuY2VkIGluIGxvY2FsIHN0b3JhZ2VcIiwgbG9jYWxTdG9yYWdlLnByb2plY3QpO1xyXG4gICAgICAgIGF3YWl0IFBhZ2UubG9hZFByb2plY3QobmV3IFVSTChsb2NhbFN0b3JhZ2UucHJvamVjdCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBHb2xkZW5MYXlvdXQoKTogdm9pZCB7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0ID0gbmV3IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkdvbGRlbkxheW91dCgpOyAvLyBHb2xkZW5MYXlvdXQgMiBhcyBVTUQtTW9kdWxlXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0Lm9uKFwiaXRlbUNyZWF0ZWRcIiwgUGFnZS5obmRQYW5lbENyZWF0ZWQpO1xyXG5cclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5QUk9KRUNULCBQYW5lbFByb2plY3QpO1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLkdSQVBILCBQYW5lbEdyYXBoKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5IRUxQLCBQYW5lbEhlbHApO1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLkFOSU1BVElPTiwgUGFuZWxBbmltYXRpb24pO1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLlBBUlRJQ0xFX1NZU1RFTSwgUGFuZWxQYXJ0aWNsZVN5c3RlbSk7XHJcblxyXG4gICAgICBQYWdlLmxvYWRMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGQoX3BhbmVsOiB0eXBlb2YgUGFuZWwsIF9zdGF0ZT86IEpzb25WYWx1ZSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYW5lbENvbmZpZzogQ29tcG9uZW50SXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgIGNvbXBvbmVudFR5cGU6IF9wYW5lbC5uYW1lLFxyXG4gICAgICAgIGNvbXBvbmVudFN0YXRlOiBfc3RhdGUsXHJcbiAgICAgICAgdGl0bGU6IFwiUGFuZWxcIixcclxuICAgICAgICBpZDogUGFnZS5nZW5lcmF0ZUlEKF9wYW5lbC5uYW1lKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gaWYgKCFQYWdlLmdvbGRlbkxheW91dC5yb290SXRlbSkgIC8vIHdvcmthcm91bmQgYmVjYXVzZSBnb2xkZW4gTGF5b3V0IGxvc2VzIHJvb3RJdGVtLi4uXHJcbiAgICAgIC8vICAgUGFnZS5sb2FkTGF5b3V0KCk7IC8vIFRPRE86IHRoZXNlIHR3byBsaW5lcyBhcHBlYXIgdG8gYmUgb2Jzb2xldGUsIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldFxyXG5cclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQuYWRkSXRlbUF0TG9jYXRpb24ocGFuZWxDb25maWcsIFt7IHR5cGVJZDogTGF5b3V0TWFuYWdlci5Mb2NhdGlvblNlbGVjdG9yLlR5cGVJZC5Sb290IH1dKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBmaW5kKF90eXBlOiB0eXBlb2YgUGFuZWwpOiBQYW5lbFtdIHtcclxuICAgICAgbGV0IHJlc3VsdDogUGFuZWxbXSA9IFtdO1xyXG4gICAgICByZXN1bHQgPSBQYWdlLnBhbmVscy5maWx0ZXIoX3BhbmVsID0+IF9wYW5lbCBpbnN0YW5jZW9mIF90eXBlKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZUlEKF9uYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgaTogbnVtYmVyID0gMDtcclxuICAgICAgd2hpbGUgKHRoaXMuZ29sZGVuTGF5b3V0LmZpbmRGaXJzdENvbXBvbmVudEl0ZW1CeUlkKF9uYW1lICsgaSkpXHJcbiAgICAgICAgaSsrO1xyXG4gICAgICByZXR1cm4gX25hbWUgKyBpOyAvLyBfbmFtZSArIFBhZ2UuaWRDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIFBhZ2UtRXZlbnRzIGZyb20gRE9NXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR1cFBhZ2VMaXN0ZW5lcnMoKTogdm9pZCB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVFJBTlNGT1JNLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIFBhZ2UuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU2VuZCBjdXN0b20gY29waWVzIG9mIHRoZSBnaXZlbiBldmVudCB0byB0aGUgcGFuZWxzICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBicm9hZGNhc3QoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IF9ldmVudC5kZXRhaWwgfHwge307XHJcbiAgICAgIGxldCBzZW5kZXI6IFBhbmVsIHwgUGFnZSA9IGRldGFpbD8uc2VuZGVyO1xyXG4gICAgICBkZXRhaWwuc2VuZGVyID0gUGFnZTtcclxuICAgICAgZm9yIChsZXQgcGFuZWwgb2YgUGFnZS5wYW5lbHMpIHtcclxuICAgICAgICBpZiAocGFuZWwgIT0gc2VuZGVyKSAvLyBkb24ndCBzZW5kIGJhY2sgdG8gb3JpZ2luYWwgc2VuZGVyXHJcbiAgICAgICAgICBwYW5lbC5kaXNwYXRjaCg8RVZFTlRfRURJVE9SPl9ldmVudC50eXBlLCB7IGRldGFpbDogZGV0YWlsIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVDpcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKFRSQU5TRk9STS5UUkFOU0xBVEUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlI6XHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShUUkFOU0ZPUk0uUk9UQVRFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FOlxyXG4gICAgICAgICAgLy8gVE9ETzogZG9uJ3Qgc3dpdGNoIHRvIHNjYWxlIG1vZGUgd2hlbiB1c2luZyBmbHktY2FtZXJhIGFuZCBwcmVzc2luZyBFXHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShUUkFOU0ZPUk0uU0NBTEUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaG5kRXZlbnQoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBsZXQgdmlldzogVmlldyA9IF9ldmVudC5kZXRhaWwudmlldztcclxuICAgICAgICAgIGlmICh2aWV3IGluc3RhbmNlb2YgUGFuZWwpXHJcbiAgICAgICAgICAgIFBhZ2UucGFuZWxzLnNwbGljZShQYWdlLnBhbmVscy5pbmRleE9mKHZpZXcpLCAxKTtcclxuXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNsb3NlZFwiLCB2aWV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBQYWdlLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZFBhbmVsQ3JlYXRlZCA9IChfZXZlbnQ6IEV2ZW50RW1pdHRlci5CdWJibGluZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IENvbXBvbmVudEl0ZW0gPSBfZXZlbnQudGFyZ2V0IGFzIENvbXBvbmVudEl0ZW07XHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Db21wb25lbnRJdGVtKSB7XHJcbiAgICAgICAgUGFnZS5wYW5lbHMucHVzaCg8UGFuZWw+dGFyZ2V0LmNvbXBvbmVudCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgbG9hZFByb2plY3QoX3VybDogVVJMKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGF3YWl0IGxvYWRQcm9qZWN0KF91cmwpO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9HUkFQSF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9BTklNQVRJT05fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBNYWluLUV2ZW50cyBmcm9tIEVsZWN0cm9uXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR1cE1haW5MaXN0ZW5lcnMoKTogdm9pZCB7XHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUFJPSkVDVF9ORVcsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICDGki5Qcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgICAgYXdhaXQgbmV3UHJvamVjdCgpO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUFJPSkVDVF9TQVZFLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9HUkFQSF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0FOSU1BVElPTl9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfU0FWRSwgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIGlmIChhd2FpdCBzYXZlUHJvamVjdCgpKVxyXG4gICAgICAgICAgUGFnZS5zZXREZWZhdWx0UHJvamVjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUFJPSkVDVF9MT0FELCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgbGV0IHVybDogVVJMID0gYXdhaXQgcHJvbXB0TG9hZFByb2plY3QoKTtcclxuICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBhd2FpdCBQYWdlLmxvYWRQcm9qZWN0KHVybCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9HUkFQSF9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxHcmFwaCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbFByb2plY3QsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfSEVMUF9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxIZWxwLCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlFVSVQsIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLnNldERlZmF1bHRQcm9qZWN0KCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9BTklNQVRJT05fT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsQW5pbWF0aW9uLCBudWxsKTtcclxuICAgICAgICAvLyBsZXQgcGFuZWw6IFBhbmVsID0gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmNyZWF0ZVBhbmVsRnJvbVRlbXBsYXRlKG5ldyBWaWV3QW5pbWF0aW9uVGVtcGxhdGUoKSwgXCJBbmltYXRpb24gUGFuZWxcIik7XHJcbiAgICAgICAgLy8gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmFkZFBhbmVsKHBhbmVsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxQYXJ0aWNsZVN5c3RlbSwgbnVsbCk7XHJcbiAgICAgICAgLy8gbGV0IHBhbmVsOiBQYW5lbCA9IFBhbmVsTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVQYW5lbEZyb21UZW1wbGF0ZShuZXcgVmlld0FuaW1hdGlvblRlbXBsYXRlKCksIFwiQW5pbWF0aW9uIFBhbmVsXCIpO1xyXG4gICAgICAgIC8vIFBhbmVsTWFuYWdlci5pbnN0YW5jZS5hZGRQYW5lbChwYW5lbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnVuY3Rpb24gd2VsY29tZShjb250YWluZXI6IEdvbGRlbkxheW91dC5Db250YWluZXIsIHN0YXRlOiBPYmplY3QpOiB2b2lkIHtcclxuICAvLyAgIGNvbnRhaW5lci5nZXRFbGVtZW50KCkuaHRtbChcIjxkaXY+V2VsY29tZTwvZGl2PlwiKTtcclxuICAvLyB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgxpIuU2VyaWFsaXplci5yZWdpc3Rlck5hbWVzcGFjZShGdWRnZSk7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBQcm9qZWN0IGV4dGVuZHMgxpIuTXV0YWJsZSB7IC8vIFRPRE86IHJlcGxhY2Ugd2l0aCBzZXJpbGl6YWJsZVxyXG4gICAgLy8gcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIk5ld1Byb2plY3RcIjtcclxuICAgIHB1YmxpYyBiYXNlOiBVUkw7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBmaWxlSW5kZXg6IHN0cmluZyA9IFwiaW5kZXguaHRtbFwiO1xyXG4gICAgcHVibGljIGZpbGVJbnRlcm5hbDogc3RyaW5nID0gXCJJbnRlcm5hbC5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZUludGVybmFsRm9sZGVyOiBzdHJpbmcgPSBcIkludGVybmFsRm9sZGVyLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlU2NyaXB0OiBzdHJpbmcgPSBcIlNjcmlwdC9CdWlsZC9TY3JpcHQuanNcIjtcclxuICAgIHB1YmxpYyBmaWxlU2V0dGluZ3M6IHN0cmluZyA9IFwic2V0dGluZ3MuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVTdHlsZXM6IHN0cmluZyA9IFwic3R5bGVzLmNzc1wiO1xyXG5cclxuICAgIHByaXZhdGUgZ3JhcGhBdXRvVmlldzogc3RyaW5nID0gXCJcIjtcclxuICAgIC8vIHByaXZhdGUgaW5jbHVkZUF1dG9WaWV3U2NyaXB0OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAjcmVzb3VyY2VGb2xkZXI6IFJlc291cmNlRm9sZGVyO1xyXG4gICAgI2RvY3VtZW50OiBEb2N1bWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2Jhc2U6IFVSTCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmJhc2UgPSBfYmFzZTtcclxuICAgICAgdGhpcy5uYW1lID0gX2Jhc2UudG9TdHJpbmcoKS5zcGxpdChcIi9cIikuc2xpY2UoLTIsIC0xKVswXTtcclxuICAgICAgdGhpcy5maWxlSW5kZXggPSBfYmFzZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKS5wb3AoKSB8fCB0aGlzLmZpbGVJbmRleDtcclxuXHJcbiAgICAgIMaSLlByb2plY3QuY2xlYXIoKTtcclxuICAgICAgxpIuUHJvamVjdC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULkdSQVBIX01VVEFURUQsXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgKF9ldmVudDogRXZlbnQpID0+IFBhZ2UuYnJvYWRjYXN0KG5ldyBFZGl0b3JFdmVudChFVkVOVF9FRElUT1IuVVBEQVRFKSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlRm9sZGVyKCk6IFJlc291cmNlRm9sZGVyIHtcclxuICAgICAgaWYgKCF0aGlzLiNyZXNvdXJjZUZvbGRlcilcclxuICAgICAgICB0aGlzLiNyZXNvdXJjZUZvbGRlciA9IG5ldyBSZXNvdXJjZUZvbGRlcihcIlJlc291cmNlc1wiKTtcclxuICAgICAgcmV0dXJuIHRoaXMuI3Jlc291cmNlRm9sZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdChwcm9qZWN0LCBmYWxzZSwgXCJSZXZpZXcgcHJvamVjdCBzZXR0aW5nc1wiLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgIMaSdWkuRGlhbG9nLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUobXV0YXRvcik7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0gZWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaG5kQ2hhbmdlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLCDGknVpLkRpYWxvZy5kb20sIHRoaXMuZ2V0TXV0YXRvcigpKTtcclxuICAgICAgY29uc29sZS5sb2cobXV0YXRvciwgdGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBhc3luYyBsb2FkKF9odG1sQ29udGVudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBuZXcgxpIuUGh5c2ljcygpO1xyXG4gICAgICBjb25zdCBwYXJzZXI6IERPTVBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcclxuICAgICAgdGhpcy4jZG9jdW1lbnQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKF9odG1sQ29udGVudCwgXCJ0ZXh0L2h0bWxcIik7XHJcbiAgICAgIGNvbnN0IGhlYWQ6IEhUTUxIZWFkRWxlbWVudCA9IHRoaXMuI2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoZWFkXCIpO1xyXG5cclxuICAgICAgdGhpcy5sb2FkRm9udHMoaGVhZCk7XHJcblxyXG4gICAgICBjb25zdCBzY3JpcHRzOiBOb2RlTGlzdE9mPEhUTUxTY3JpcHRFbGVtZW50PiA9IGhlYWQucXVlcnlTZWxlY3RvckFsbChcInNjcmlwdFwiKTtcclxuICAgICAgZm9yIChsZXQgc2NyaXB0IG9mIHNjcmlwdHMpIHtcclxuICAgICAgICBpZiAoc2NyaXB0LmdldEF0dHJpYnV0ZShcImVkaXRvclwiKSA9PSBcInRydWVcIikge1xyXG4gICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcInNyY1wiKTtcclxuICAgICAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiTG9hZCBzY3JpcHQ6IFwiLCB1cmwpO1xyXG4gICAgICAgICAgYXdhaXQgxpIuUHJvamVjdC5sb2FkU2NyaXB0KG5ldyBVUkwodXJsLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJDb21wb25lbnRTY3JpcHRzXCIsIMaSLlByb2plY3QuZ2V0Q29tcG9uZW50U2NyaXB0cygpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2NyaXB0IE5hbWVzcGFjZXNcIiwgxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc291cmNlTGluazogSFRNTExpbmtFbGVtZW50ID0gaGVhZC5xdWVyeVNlbGVjdG9yKFwibGlua1t0eXBlPXJlc291cmNlc11cIik7XHJcbiAgICAgIGxldCByZXNvdXJjZUZpbGU6IHN0cmluZyA9IHJlc291cmNlTGluay5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XHJcbiAgICAgIHByb2plY3QuZmlsZUludGVybmFsID0gcmVzb3VyY2VGaWxlO1xyXG4gICAgICDGki5Qcm9qZWN0LmJhc2VVUkwgPSB0aGlzLmJhc2U7XHJcbiAgICAgIGxldCByZWNvbnN0cnVjdGlvbjogxpIuUmVzb3VyY2VzID0gYXdhaXQgxpIuUHJvamVjdC5sb2FkUmVzb3VyY2VzKG5ldyBVUkwocmVzb3VyY2VGaWxlLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgxpIuRGVidWcuZ3JvdXBDb2xsYXBzZWQoXCJEZXNlcmlhbGl6ZWRcIik7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8ocmVjb25zdHJ1Y3Rpb24pO1xyXG4gICAgICDGki5EZWJ1Zy5ncm91cEVuZCgpO1xyXG5cclxuICAgICAgxpIuUGh5c2ljcy5jbGVhbnVwKCk7IC8vIHJlbW92ZSBwb3RlbnRpYWwgcmlnaWRib2RpZXNcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzb3VyY2VGb2xkZXJDb250ZW50OiBzdHJpbmcgPSBhd2FpdCAoYXdhaXQgZmV0Y2gobmV3IFVSTCh0aGlzLmZpbGVJbnRlcm5hbEZvbGRlciwgdGhpcy5iYXNlKS50b1N0cmluZygpKSkudGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IHJlc291cmNlRm9sZGVyOiDGki5TZXJpYWxpemFibGUgPSBhd2FpdCDGki5TZXJpYWxpemVyLmRlc2VyaWFsaXplKMaSLlNlcmlhbGl6ZXIucGFyc2UocmVzb3VyY2VGb2xkZXJDb250ZW50KSk7XHJcbiAgICAgICAgaWYgKHJlc291cmNlRm9sZGVyIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgICB0aGlzLiNyZXNvdXJjZUZvbGRlciA9IHJlc291cmNlRm9sZGVyO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy53YXJuKGBGYWlsZWQgdG8gbG9hZCAnJHt0aGlzLmZpbGVJbnRlcm5hbEZvbGRlcn0nLiBBIG5ldyByZXNvdXJjZSBmb2xkZXIgd2FzIGNyZWF0ZWQgYW5kIHdpbGwgYmUgc2F2ZWQuYCwgX2Vycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHNldHRpbmdzOiBIVE1MTWV0YUVsZW1lbnQgPSBoZWFkLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3R5cGU9c2V0dGluZ3NdXCIpO1xyXG4gICAgICBsZXQgcHJvamVjdFNldHRpbmdzOiBzdHJpbmcgPSBzZXR0aW5ncz8uZ2V0QXR0cmlidXRlKFwicHJvamVjdFwiKTtcclxuICAgICAgcHJvamVjdFNldHRpbmdzID0gcHJvamVjdFNldHRpbmdzPy5yZXBsYWNlKC8nL2csIFwiXFxcIlwiKTtcclxuICAgICAgYXdhaXQgcHJvamVjdC5tdXRhdGUoSlNPTi5wYXJzZShwcm9qZWN0U2V0dGluZ3MgfHwgXCJ7fVwiKSk7XHJcblxyXG4gICAgICBsZXQgY29uZmlnOiBMYXlvdXRDb25maWc7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3NDb250ZW50OiBzdHJpbmcgPSBhd2FpdCAoYXdhaXQgZmV0Y2gobmV3IFVSTCh0aGlzLmZpbGVTZXR0aW5ncywgdGhpcy5iYXNlKS50b1N0cmluZygpKSkudGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IHBhbmVsU2V0dGluZ3M6IMaSLlNlcmlhbGl6YXRpb24gPSDGki5TZXJpYWxpemVyLnBhcnNlKHNldHRpbmdzQ29udGVudCk7XHJcbiAgICAgICAgY29uZmlnID0gUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuTGF5b3V0Q29uZmlnLmZyb21SZXNvbHZlZChwYW5lbFNldHRpbmdzLmxheW91dCk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLndhcm4oYEZhaWxlZCB0byBsb2FkICcke3RoaXMuZmlsZVNldHRpbmdzfScuIEEgbmV3IHNldHRpbmdzIGZpbGUgd2FzIGNyZWF0ZWQgYW5kIHdpbGwgYmUgc2F2ZWQuYCwgX2Vycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgUGFnZS5sb2FkTGF5b3V0KGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByb2plY3RKU09OKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQganNvbjogc3RyaW5nID0gxpIuU2VyaWFsaXplci5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbik7XHJcbiAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZUZvbGRlckpTT04oKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIMaSLlNlcmlhbGl6ZXIuc3RyaW5naWZ5KMaSLlNlcmlhbGl6ZXIuc2VyaWFsaXplKHRoaXMucmVzb3VyY2VGb2xkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2V0dGluZ3NKU09OKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBzZXR0aW5nczogxpIuU2VyaWFsaXphdGlvbiA9IHt9O1xyXG4gICAgICBzZXR0aW5ncy5sYXlvdXQgPSBQYWdlLmdldExheW91dCgpO1xyXG5cclxuICAgICAgcmV0dXJuIMaSLlNlcmlhbGl6ZXIuc3RyaW5naWZ5KHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvamVjdENTUygpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgIGNvbnRlbnQgKz0gXCJodG1sLCBib2R5IHtcXG4gIHBhZGRpbmc6IDBweDtcXG4gIG1hcmdpbjogMHB4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcblwiO1xyXG4gICAgICBjb250ZW50ICs9IFwiZGlhbG9nIHsgXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcbn1cXG5cXG5cIjtcclxuICAgICAgY29udGVudCArPSBcImNhbnZhcy5mdWxsc2NyZWVuIHsgXFxuICB3aWR0aDogMTAwdnc7IFxcbiAgaGVpZ2h0OiAxMDB2aDsgXFxufVwiO1xyXG5cclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByb2plY3RIVE1MKF90aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgaWYgKCF0aGlzLiNkb2N1bWVudClcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQcm9qZWN0SFRNTChfdGl0bGUpO1xyXG5cclxuICAgICAgdGhpcy4jZG9jdW1lbnQudGl0bGUgPSBfdGl0bGU7XHJcblxyXG4gICAgICBsZXQgc2V0dGluZ3M6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1ldGFcIik7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJzZXR0aW5nc1wiKTtcclxuICAgICAgc2V0dGluZ3Muc2V0QXR0cmlidXRlKFwiYXV0b3ZpZXdcIiwgdGhpcy5ncmFwaEF1dG9WaWV3KTtcclxuICAgICAgc2V0dGluZ3Muc2V0QXR0cmlidXRlKFwicHJvamVjdFwiLCB0aGlzLnNldHRpbmdzU3RyaW5naWZ5KCkpO1xyXG4gICAgICB0aGlzLiNkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3R5cGU9c2V0dGluZ3NdXCIpLnJlcGxhY2VXaXRoKHNldHRpbmdzKTtcclxuXHJcbiAgICAgIC8vIGxldCBhdXRvVmlld1NjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQgPSB0aGlzLiNkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic2NyaXB0W25hbWU9YXV0b1ZpZXddXCIpO1xyXG4gICAgICAvLyBpZiAodGhpcy5pbmNsdWRlQXV0b1ZpZXdTY3JpcHQpIHtcclxuICAgICAgLy8gICBpZiAoIWF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLmdldEF1dG9WaWV3U2NyaXB0KCkpO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vIGVsc2VcclxuICAgICAgLy8gICBpZiAoYXV0b1ZpZXdTY3JpcHQpXHJcbiAgICAgIC8vICAgICB0aGlzLiNkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGF1dG9WaWV3U2NyaXB0KTtcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeUhUTUwodGhpcy4jZG9jdW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMoX211dGF0b3I6IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMge1xyXG4gICAgICBsZXQgdHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IHN1cGVyLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhfbXV0YXRvcik7XHJcbiAgICAgIGlmICh0eXBlcy5ncmFwaEF1dG9WaWV3KVxyXG4gICAgICAgIHR5cGVzLmdyYXBoQXV0b1ZpZXcgPSB0aGlzLmdldEdyYXBocygpO1xyXG4gICAgICByZXR1cm4gdHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlZHVjZU11dGF0b3IoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmJhc2U7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlSW5kZXg7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlSW50ZXJuYWw7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlSW50ZXJuYWxGb2xkZXI7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlU2NyaXB0O1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZVNldHRpbmdzO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZVN0eWxlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEdyYXBocygpOiBPYmplY3Qge1xyXG4gICAgICBsZXQgZ3JhcGhzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gxpIuUHJvamVjdC5nZXRSZXNvdXJjZXNCeVR5cGUoxpIuR3JhcGgpO1xyXG4gICAgICBsZXQgcmVzdWx0OiBPYmplY3QgPSB7fTtcclxuICAgICAgZm9yIChsZXQgZ3JhcGggb2YgZ3JhcGhzKSB7XHJcbiAgICAgICAgcmVzdWx0W2dyYXBoLm5hbWVdID0gZ3JhcGguaWRSZXNvdXJjZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlUHJvamVjdEhUTUwoX3RpdGxlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgaHRtbDogRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoX3RpdGxlKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJtZXRhXCIsIHsgY2hhcnNldDogXCJ1dGYtOFwiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImxpbmtcIiwgeyByZWw6IFwic3R5bGVzaGVldFwiLCBocmVmOiB0aGlzLmZpbGVTdHlsZXMgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiRWRpdG9yIHNldHRpbmdzIG9mIHRoaXMgcHJvamVjdFwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJtZXRhXCIsIHtcclxuICAgICAgICB0eXBlOiBcInNldHRpbmdzXCIsIGF1dG92aWV3OiB0aGlzLmdyYXBoQXV0b1ZpZXcsIHByb2plY3Q6IHRoaXMuc2V0dGluZ3NTdHJpbmdpZnkoKVxyXG4gICAgICB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJBY3RpdmF0ZSB0aGUgZm9sbG93aW5nIGxpbmUgdG8gaW5jbHVkZSB0aGUgRlVER0UtdmVyc2lvbiBvZiBPaW1vLVBoeXNpY3MuIFlvdSBtYXkgd2FudCB0byBkb3dubG9hZCBhIGxvY2FsIGNvcHkgdG8gd29yayBvZmZsaW5lIGFuZCBiZSBpbmRlcGVuZGVudCBmcm9tIGZ1dHVyZSBjaGFuZ2VzIVwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoYDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL09pbW9QaHlzaWNzLmpzXCI+PC9zY3JpcHQ+YCkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBGVURHRS4gWW91IG1heSB3YW50IHRvIGRvd25sb2FkIGxvY2FsIGNvcGllcyB0byB3b3JrIG9mZmxpbmUgYW5kIGJlIGluZGVwZW5kZW50IGZyb20gZnV0dXJlIGNoYW5nZXMhIERldmVsb3BlcnMgd29ya2luZyBvbiBGVURHRSBpdHNlbGYgbWF5IHdhbnQgdG8gY3JlYXRlIHN5bWxpbmtzXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogXCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuanNcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VBaWQuanNcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMaW5rIGludGVybmFsIHJlc291cmNlcy4gVGhlIGVkaXRvciBvbmx5IGxvYWRzIHRoZSBmaXJzdCwgYnV0IGF0IHJ1bnRpbWUsIG11bHRpcGxlIGZpbGVzIGNhbiBjb250cmlidXRlXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImxpbmtcIiwgeyB0eXBlOiBcInJlc291cmNlc1wiLCBzcmM6IHRoaXMuZmlsZUludGVybmFsIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgY3VzdG9tIHNjcmlwdHNcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiB0aGlzLmZpbGVTY3JpcHQsIGVkaXRvcjogXCJ0cnVlXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICAvLyBpZiAodGhpcy5pbmNsdWRlQXV0b1ZpZXdTY3JpcHQpXHJcbiAgICAgIC8vICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuZ2V0QXV0b1ZpZXdTY3JpcHQoKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIEF1dG92aWV3IHNjcmlwdFwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IFwiQXV0b3ZpZXcuanNcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJEaWFsb2cgc2hvd24gYXQgc3RhcnR1cCBvbmx5XCIpKTtcclxuICAgICAgbGV0IGRpYWxvZzogSFRNTEVsZW1lbnQgPSBjcmVhdGVUYWcoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJwXCIsIHt9LCBcIkZVREdFIEF1dG92aWV3XCIpKTtcclxuICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImgxXCIsIHt9LCBcIlRpdGxlICh3aWxsIGJlIHJlcGxhY2VkIGJ5IEF1dG92aWV3KVwiKSk7XHJcbiAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJwXCIsIHt9LCBcImNsaWNrIHRvIHN0YXJ0XCIpKTtcclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGRpYWxvZyk7XHJcblxyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ2FudmFzIGZvciBGVURHRSB0byByZW5kZXIgdG9cIikpO1xyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwiY2FudmFzXCIsIHsgY2xhc3M6IFwiZnVsbHNjcmVlblwiIH0pKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRhZyhfdGFnOiBzdHJpbmcsIF9hdHRyaWJ1dGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge30sIF9jb250ZW50Pzogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoX3RhZyk7XHJcbiAgICAgICAgZm9yIChsZXQgYXR0cmlidXRlIGluIF9hdHRyaWJ1dGVzKVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBfYXR0cmlidXRlc1thdHRyaWJ1dGVdKTtcclxuICAgICAgICBpZiAoX2NvbnRlbnQpXHJcbiAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IF9jb250ZW50O1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlIVE1MKGh0bWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZ2V0QXV0b1ZpZXdTY3JpcHQoKTogSFRNTFNjcmlwdEVsZW1lbnQge1xyXG4gICAgLy8gICBsZXQgY29kZTogc3RyaW5nO1xyXG4gICAgLy8gICBjb2RlID0gKGZ1bmN0aW9uIChfZ3JhcGhJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyAgICAgLyoqXHJcbiAgICAvLyAgICAgICogQXV0b1ZpZXctU2NyaXB0XHJcbiAgICAvLyAgICAgICogTG9hZHMgYW5kIGRpc3BsYXlzIHRoZSBzZWxlY3RlZCBncmFwaCBhbmQgaW1wbGVtZW50cyBhIGJhc2ljIG9yYml0IGNhbWVyYVxyXG4gICAgLy8gICAgICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjFcclxuICAgIC8vICAgICAgKi9cclxuXHJcbiAgICAvLyAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGluaXQpO1xyXG5cclxuICAgIC8vICAgICAvLyBzaG93IGRpYWxvZyBmb3Igc3RhcnR1cFxyXG4gICAgLy8gICAgIGxldCBkaWFsb2c6IEhUTUxEaWFsb2dFbGVtZW50O1xyXG4gICAgLy8gICAgIGZ1bmN0aW9uIGluaXQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAgICAgZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpYWxvZ1wiKTtcclxuICAgIC8vICAgICAgIGRpYWxvZy5xdWVyeVNlbGVjdG9yKFwiaDFcIikudGV4dENvbnRlbnQgPSBkb2N1bWVudC50aXRsZTtcclxuICAgIC8vICAgICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgICAgICAgLy8gQHRzLWlnbiByZSB1bnRpbCBIVE1MRGlhbG9nIGlzIGltcGxlbWVudGVkIGJ5IGFsbCBicm93c2VycyBhbmQgYXZhaWxhYmxlIGluIGRvbS5kLnRzXHJcbiAgICAvLyAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xyXG4gICAgLy8gICAgICAgICBzdGFydEludGVyYWN0aXZlVmlld3BvcnQoKTtcclxuICAgIC8vICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAvLyAgICAgICBkaWFsb2cuc2hvd01vZGFsKCk7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICAvLyBzZXR1cCBhbmQgc3RhcnQgaW50ZXJhY3RpdmUgdmlld3BvcnRcclxuICAgIC8vICAgICBhc3luYyBmdW5jdGlvbiBzdGFydEludGVyYWN0aXZlVmlld3BvcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAvLyAgICAgICAvLyBsb2FkIHJlc291cmNlcyByZWZlcmVuY2VkIGluIHRoZSBsaW5rLXRhZ1xyXG4gICAgLy8gICAgICAgYXdhaXQgRnVkZ2VDb3JlLlByb2plY3QubG9hZFJlc291cmNlc0Zyb21IVE1MKCk7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiUHJvamVjdDpcIiwgRnVkZ2VDb3JlLlByb2plY3QucmVzb3VyY2VzKTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBwaWNrIHRoZSBncmFwaCB0byBzaG93XHJcbiAgICAvLyAgICAgICBsZXQgZ3JhcGg6IMaSLkdyYXBoID0gPMaSLkdyYXBoPkZ1ZGdlQ29yZS5Qcm9qZWN0LnJlc291cmNlc1tfZ3JhcGhJZF07XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiR3JhcGg6XCIsIGdyYXBoKTtcclxuICAgIC8vICAgICAgIGlmICghZ3JhcGgpIHtcclxuICAgIC8vICAgICAgICAgYWxlcnQoXCJOb3RoaW5nIHRvIHJlbmRlci4gQ3JlYXRlIGEgZ3JhcGggd2l0aCBhdCBsZWFzdCBhIG1lc2gsIG1hdGVyaWFsIGFuZCBwcm9iYWJseSBzb21lIGxpZ2h0XCIpO1xyXG4gICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgICB9XHJcblxyXG4gICAgLy8gICAgICAgLy8gc2V0dXAgdGhlIHZpZXdwb3J0XHJcbiAgICAvLyAgICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgRnVkZ2VDb3JlLkNvbXBvbmVudENhbWVyYSgpO1xyXG4gICAgLy8gICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiY2FudmFzXCIpO1xyXG4gICAgLy8gICAgICAgbGV0IHZpZXdwb3J0OiDGki5WaWV3cG9ydCA9IG5ldyBGdWRnZUNvcmUuVmlld3BvcnQoKTtcclxuICAgIC8vICAgICAgIHZpZXdwb3J0LmluaXRpYWxpemUoXCJJbnRlcmFjdGl2ZVZpZXdwb3J0XCIsIGdyYXBoLCBjbXBDYW1lcmEsIGNhbnZhcyk7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiVmlld3BvcnQ6XCIsIHZpZXdwb3J0KTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBoaWRlIHRoZSBjdXJzb3Igd2hlbiBpbnRlcmFjdGluZywgYWxzbyBzdXBwcmVzc2luZyByaWdodC1jbGljayBtZW51XHJcbiAgICAvLyAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKTtcclxuICAgIC8vICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbiAoKTogdm9pZCB7IGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpOyB9KTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBtYWtlIHRoZSBjYW1lcmEgaW50ZXJhY3RpdmUgKGNvbXBsZXggbWV0aG9kIGluIEZ1ZGdlQWlkKVxyXG4gICAgLy8gICAgICAgbGV0IGNhbWVyYU9yYml0OiBGdWRnZUFpZC5DYW1lcmFPcmJpdCA9IEZ1ZGdlQWlkLlZpZXdwb3J0LmV4cGFuZENhbWVyYVRvSW50ZXJhY3RpdmVPcmJpdCh2aWV3cG9ydCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gc2V0dXAgYXVkaW9cclxuICAgIC8vICAgICAgIGxldCBjbXBMaXN0ZW5lcjogxpIuQ29tcG9uZW50QXVkaW9MaXN0ZW5lciA9IG5ldyDGki5Db21wb25lbnRBdWRpb0xpc3RlbmVyKCk7XHJcbiAgICAvLyAgICAgICBjbXBDYW1lcmEubm9kZS5hZGRDb21wb25lbnQoY21wTGlzdGVuZXIpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkF1ZGlvTWFuYWdlci5kZWZhdWx0Lmxpc3RlbldpdGgoY21wTGlzdGVuZXIpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkF1ZGlvTWFuYWdlci5kZWZhdWx0Lmxpc3RlblRvKGdyYXBoKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJBdWRpbzpcIiwgRnVkZ2VDb3JlLkF1ZGlvTWFuYWdlci5kZWZhdWx0KTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBkcmF3IHZpZXdwb3J0IG9uY2UgZm9yIGltbWVkaWF0ZSBmZWVkYmFja1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLlJlbmRlci5wcmVwYXJlKGNhbWVyYU9yYml0KTtcclxuICAgIC8vICAgICAgIHZpZXdwb3J0LmRyYXcoKTtcclxuICAgIC8vICAgICAgIGNhbnZhcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImludGVyYWN0aXZlVmlld3BvcnRTdGFydGVkXCIsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB2aWV3cG9ydCB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICB9KS50b1N0cmluZygpO1xyXG5cclxuICAgIC8vICAgY29kZSA9IFwiKFwiICsgY29kZSArIGApKGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihcIm1ldGFbYXV0b1ZpZXddXCIpLmdldEF0dHJpYnV0ZShcImF1dG9WaWV3XCIpKTtcXG5gO1xyXG4gICAgLy8gICBsZXQgc2NyaXB0OiBIVE1MU2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgICAvLyAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiYXV0b1ZpZXdcIik7XHJcbiAgICAvLyAgIHNjcmlwdC50ZXh0Q29udGVudCA9IGNvZGU7XHJcbiAgICAvLyAgIHJldHVybiBzY3JpcHQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1N0cmluZ2lmeSgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHByb2plY3QuZ2V0TXV0YXRvcih0cnVlKTtcclxuICAgICAgbGV0IHNldHRpbmdzOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShtdXRhdG9yKTtcclxuICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncy5yZXBsYWNlKC9cIi9nLCBcIidcIik7XHJcbiAgICAgIHJldHVybiBzZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0cmluZ2lmeUhUTUwoX2h0bWw6IERvY3VtZW50KTogc3RyaW5nIHtcclxuICAgICAgbGV0IHJlc3VsdDogc3RyaW5nID0gKG5ldyBYTUxTZXJpYWxpemVyKCkpLnNlcmlhbGl6ZVRvU3RyaW5nKF9odG1sKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLz48L2csIFwiPlxcbjxcIik7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC88IS0tQ1JMRi0tPi9nLCBcIlwiKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1wiPlxcbjxcXC9zY3JpcHQvZywgYFwiPjwvc2NyaXB0YCk7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cXG4qPFxcL2JvZHk+L2csIFwiXFxuPFxcL2JvZHk+XCIpOyAvLyByZW1vdmUgbGluZSBicmVha3MgYWRkZWQgYnkgc2VyaWFsaXplVG9TdHJpbmcgYmVmb3JlIGNsb3NpbmcgYm9keS10YWdcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGxvYWRGb250cyhfaGVhZDogSFRNTEhlYWRFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIC8vIGNvbGxlY3QgYWxsIGZvbnRzIGZyb20gX2hlYWQgYW5kIGFkZCB0aGVtIHRvIHRoZSBoZWFkIG9mIHRoZSBlZGl0b3JzIGRvY3VtZW50IHNvIHRoYXQgdGhleSBhcmUgYXZhaWxhYmxlIGZvciBjb21wb25lbnQgdGV4dFxyXG4gICAgICBjb25zdCBmb250czogSFRNTFN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgIGNvbnN0IGNzc0xpbmtzOiBOb2RlTGlzdE9mPEhUTUxMaW5rRWxlbWVudD4gPSBfaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKTtcclxuICAgICAgY29uc3QgY3NzU3R5bGVzOiBOb2RlTGlzdE9mPEhUTUxTdHlsZUVsZW1lbnQ+ID0gX2hlYWQucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKTtcclxuICAgICAgY29uc3QgY3NzUnVsZXM6IENTU1J1bGVbXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgbGluayBvZiBjc3NMaW5rcykge1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IG5ldyBVUkwobGluay5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGNzc1RleHQ6IHN0cmluZyA9IGF3YWl0IChhd2FpdCBmZXRjaCh1cmwpKS50ZXh0KCk7IC8vIFRPRE86IHVzZSBGaWxlSU9cclxuICAgICAgICBjc3NSdWxlcy5wdXNoKC4uLmdldFJ1bGVzKGNzc1RleHQpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChsZXQgc3R5bGUgb2YgY3NzU3R5bGVzKVxyXG4gICAgICAgIGNzc1J1bGVzLnB1c2goLi4uZ2V0UnVsZXMoc3R5bGUuaW5uZXJIVE1MKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBydWxlIG9mIGNzc1J1bGVzKVxyXG4gICAgICAgIGlmIChydWxlIGluc3RhbmNlb2YgQ1NTRm9udEZhY2VSdWxlKVxyXG4gICAgICAgICAgZm9udHMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocnVsZS5jc3NUZXh0KSk7XHJcblxyXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGZvbnRzKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldFJ1bGVzKF90ZXh0OiBzdHJpbmcpOiBDU1NSdWxlTGlzdCB7XHJcbiAgICAgICAgbGV0IHN0eWxlU2hlZXQ6IENTU1N0eWxlU2hlZXQgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xyXG4gICAgICAgIHN0eWxlU2hlZXQucmVwbGFjZVN5bmMoX3RleHQpO1xyXG4gICAgICAgIHJldHVybiBzdHlsZVNoZWV0LmNzc1J1bGVzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJBbmltYXRpb24ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfQ09MT1JTOiBzdHJpbmdbXSA9IFtcclxuICAgICAgXCJSZWRcIixcclxuICAgICAgXCJMaW1lXCIsXHJcbiAgICAgIFwiQmx1ZVwiLFxyXG4gICAgICBcIkN5YW5cIixcclxuICAgICAgXCJNYWdlbnRhXCIsXHJcbiAgICAgIFwiWWVsbG93XCIsXHJcbiAgICAgIFwiU2FsbW9uXCIsXHJcbiAgICAgIFwiTGlnaHRHcmVlblwiLFxyXG4gICAgICBcIkNvcm5mbG93ZXJCbHVlXCJcclxuICAgIF07XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3QW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBzZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYW5pbWF0aW9uOiDGki5BbmltYXRpb24sIF9kb206IEhUTUxFbGVtZW50LCBfdmlldzogVmlld0FuaW1hdGlvbikge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgIHRoaXMuZG9tID0gX2RvbTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNMSUNLLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy52aWV3ID0gX3ZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShfbXV0YXRvcjogxpIuTXV0YXRvciwgX3RpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IGNvbG9ySW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgIGxldCBrZXlTZWxlY3RlZDogxpIuQW5pbWF0aW9uS2V5ID0gdGhpcy52aWV3LmtleVNlbGVjdGVkO1xyXG5cclxuICAgICAgdXBkYXRlUmVjdXJzaXZlKHRoaXMuZG9tLCBfbXV0YXRvciwgdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlLCBfdGltZSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVSZWN1cnNpdmUoX2RvbTogSFRNTEVsZW1lbnQsIF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfYW5pbWF0aW9uU3RydWN0dXJlOiDGki5BbmltYXRpb25TdHJ1Y3R1cmUsIF90aW1lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IMaSdWkuQ3VzdG9tRWxlbWVudCA9IDzGknVpLkN1c3RvbUVsZW1lbnQ+xpJ1aS5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICAgICAgbGV0IHN0cnVjdHVyZU9yU2VxdWVuY2U6IE9iamVjdCA9IF9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCAmJiBzdHJ1Y3R1cmVPclNlcXVlbmNlIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHN0cnVjdHVyZU9yU2VxdWVuY2UuZmluZEtleShfdGltZSk7XHJcbiAgICAgICAgICAgIGlmIChrZXkpIHsvLyBrZXkgZm91bmQgYXQgZXhhY3RseSB0aGUgZ2l2ZW4gdGltZSwgdGFrZSBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICB2YWx1ZSA9IGtleS52YWx1ZTtcclxuICAgICAgICAgICAgICBpZiAoa2V5ID09IGtleVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tY29sb3ItYW5pbWF0aW9uLXByb3BlcnR5XCIsIGdldE5leHRDb2xvcigpKTtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBSZWZsZWN0LnNldChlbGVtZW50LCBcImFuaW1hdGlvblNlcXVlbmNlXCIsIHN0cnVjdHVyZU9yU2VxdWVuY2UpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXBkYXRlUmVjdXJzaXZlKGVsZW1lbnQsIHZhbHVlLCA8xpIuQW5pbWF0aW9uU3RydWN0dXJlPnN0cnVjdHVyZU9yU2VxdWVuY2UsIF90aW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldE5leHRDb2xvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBjb2xvcjogc3RyaW5nID0gQ29udHJvbGxlckFuaW1hdGlvbi5QUk9QRVJUWV9DT0xPUlNbY29sb3JJbmRleF07XHJcbiAgICAgICAgY29sb3JJbmRleCA9IChjb2xvckluZGV4ICsgMSkgJSBDb250cm9sbGVyQW5pbWF0aW9uLlBST1BFUlRZX0NPTE9SUy5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbW9kaWZ5IG9yIGFkZCBrZXlcclxuICAgIHB1YmxpYyB1cGRhdGVTZXF1ZW5jZShfdGltZTogbnVtYmVyLCBfZWxlbWVudDogxpJ1aS5DdXN0b21FbGVtZW50LCBfYWRkOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IFJlZmxlY3QuZ2V0KF9lbGVtZW50LCBcImFuaW1hdGlvblNlcXVlbmNlXCIpO1xyXG4gICAgICBpZiAoIXNlcXVlbmNlKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSBzZXF1ZW5jZS5maW5kS2V5KF90aW1lKTtcclxuICAgICAgaWYgKCFrZXkpIHtcclxuICAgICAgICBpZiAoX2FkZCkge1xyXG4gICAgICAgICAga2V5ID0gbmV3IMaSLkFuaW1hdGlvbktleShfdGltZSwgPG51bWJlcj5fZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgICAgICBzZXF1ZW5jZS5hZGRLZXkoa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZVxyXG4gICAgICAgIHNlcXVlbmNlLm1vZGlmeUtleShrZXksIG51bGwsIDxudW1iZXI+X2VsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YToga2V5IH0gfSk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uLmNhbGN1bGF0ZVRvdGFsVGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0S2V5KF90aW1lOiBudW1iZXIsIF9kaXJlY3Rpb246IFwiZm9yd2FyZFwiIHwgXCJiYWNrd2FyZFwiKTogbnVtYmVyIHtcclxuICAgICAgbGV0IG5leHRLZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgLmZsYXRNYXAoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKSlcclxuICAgICAgICAuc29ydChfZGlyZWN0aW9uID09IFwiZm9yd2FyZFwiICYmICgoX2EsIF9iKSA9PiBfYS50aW1lIC0gX2IudGltZSkgfHwgX2RpcmVjdGlvbiA9PSBcImJhY2t3YXJkXCIgJiYgKChfYSwgX2IpID0+IF9iLnRpbWUgLSBfYS50aW1lKSlcclxuICAgICAgICAuZmluZChfa2V5ID0+IF9kaXJlY3Rpb24gPT0gXCJmb3J3YXJkXCIgJiYgX2tleS50aW1lID4gX3RpbWUgfHwgX2RpcmVjdGlvbiA9PSBcImJhY2t3YXJkXCIgJiYgX2tleS50aW1lIDwgX3RpbWUpO1xyXG4gICAgICBpZiAobmV4dEtleSlcclxuICAgICAgICByZXR1cm4gbmV4dEtleS50aW1lO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIF90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQcm9wZXJ0eShfcGF0aDogc3RyaW5nW10sIF9ub2RlOiDGki5Ob2RlLCBfdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblNlcXVlbmNlIHwgxpIuQW5pbWF0aW9uU3RydWN0dXJlID0gdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgX3BhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gX3BhdGhbaV07XHJcbiAgICAgICAgaWYgKCEoa2V5IGluIHN0cnVjdHVyZSkpXHJcbiAgICAgICAgICBzdHJ1Y3R1cmVba2V5XSA9IHt9O1xyXG4gICAgICAgIHN0cnVjdHVyZSA9IHN0cnVjdHVyZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSBuZXcgxpIuQW5pbWF0aW9uU2VxdWVuY2UoKTtcclxuICAgICAgc2VxdWVuY2UuYWRkS2V5KG5ldyDGki5BbmltYXRpb25LZXkoX3RpbWUsIDApKTtcclxuICAgICAgc3RydWN0dXJlW19wYXRoW19wYXRoLmxlbmd0aCAtIDFdXSA9IHNlcXVlbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVQcm9wZXJ0eShfZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLmRvbS5jb250YWlucyhfZWxlbWVudCkpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBfZWxlbWVudDtcclxuICAgICAgd2hpbGUgKGVsZW1lbnQgIT09IHRoaXMuZG9tKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgIHBhdGgudW5zaGlmdChlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kZWxldGVQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWRTZXF1ZW5jZXMoX3NlbGVjdGVkUHJvcGVydHk/OiBIVE1MRWxlbWVudCk6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdIHtcclxuICAgICAgbGV0IHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10gPSBbXTtcclxuICAgICAgY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKHRoaXMuZG9tLCB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUsIHNlcXVlbmNlcywgX3NlbGVjdGVkUHJvcGVydHkgPT0gbnVsbCk7XHJcbiAgICAgIHJldHVybiBzZXF1ZW5jZXM7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUoX2RvbTogSFRNTEVsZW1lbnQsIF9hbmltYXRpb25TdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblN0cnVjdHVyZSwgX3NlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10sIF9pc1NlbGVjdGVkRGVzY2VuZGFudDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9hbmltYXRpb25TdHJ1Y3R1cmUpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IMaSdWkuQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbSwga2V5KTtcclxuICAgICAgICAgIGxldCBpc1NlbGVjdGVkRGVzY2VuZGFudDogYm9vbGVhbiA9IF9pc1NlbGVjdGVkRGVzY2VuZGFudCB8fCBlbGVtZW50ID09IF9zZWxlY3RlZFByb3BlcnR5O1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHNlcXVlbmNlOiBPYmplY3QgPSBfYW5pbWF0aW9uU3RydWN0dXJlW2tleV07XHJcbiAgICAgICAgICBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSAmJiBpc1NlbGVjdGVkRGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBfc2VxdWVuY2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWFuaW1hdGlvbi1wcm9wZXJ0eVwiKSxcclxuICAgICAgICAgICAgICBkYXRhOiBzZXF1ZW5jZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZShlbGVtZW50LCA8xpIuQW5pbWF0aW9uU3RydWN0dXJlPl9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XSwgX3NlcXVlbmNlcywgaXNTZWxlY3RlZERlc2NlbmRhbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVsZXRlUGF0aChfcGF0aDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmU7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBfcGF0aC5sZW5ndGggLSAxOyBpKyspXHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVtfcGF0aFtpXV07XHJcbiAgICAgIGRlbGV0ZSB2YWx1ZVtfcGF0aFtfcGF0aC5sZW5ndGggLSAxXV07XHJcblxyXG4gICAgICBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKF9vYmplY3Q6IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX29iamVjdCkge1xyXG4gICAgICAgICAgaWYgKF9vYmplY3Rba2V5XSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUoX29iamVjdFtrZXldKTtcclxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgZGVsZXRlIF9vYmplY3Rba2V5XTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF9vYmplY3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIF9vYmplY3Q7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5DTElDSzpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICF0aGlzLmFuaW1hdGlvbiB8fCBfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGxldCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gX2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50IHx8IHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgICAgdGhpcy5zZXF1ZW5jZXMgPSB0aGlzLmdldFNlbGVjdGVkU2VxdWVuY2VzKHRhcmdldCk7XHJcbiAgICAgICAgICBlbHNlIGlmICh0YXJnZXQgPT0gdGhpcy5kb20pXHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gdGhpcy5nZXRTZWxlY3RlZFNlcXVlbmNlcygpO1xyXG5cclxuICAgICAgICAgIHRoaXMudmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnNlcXVlbmNlcyB9IH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB2aWV3J3Mgc3RhdGUuIER1cmluZyByZWNvbnN0cnVjdGlvbiwgdmlld3MgcmVjZWl2ZSBhIG1lcmdlZCBzdGF0ZSBvYmplY3QgdGhhdCBjb21iaW5lcyB0aGUgc3RhdGVzIG9mIGJvdGggdGhlaXIgcGFuZWwgYW5kIHRoZSB2aWV3IGl0c2VsZi5cclxuICAgKiBFbnN1cmUgdW5pcXVlIHByb3BlcnR5IG5hbWVzIHRvIGF2b2lkIGNvbmZsaWN0cy5cclxuICAgKi9cclxuICBleHBvcnQgdHlwZSBWaWV3U3RhdGUgPSDGki5TZXJpYWxpemF0aW9uO1xyXG5cclxuICB0eXBlIFZpZXdzID0geyBbaWQ6IHN0cmluZ106IFZpZXcgfTtcclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgW1tWaWV3XV1zIHRvIHN1cHBvcnQgZ2VuZXJpYyBmdW5jdGlvbmFsaXR5XHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdmlld3M6IFZpZXdzID0ge307XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51OiBFbGVjdHJvbi5NZW51O1xyXG4gICAgI2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyO1xyXG4gICAgI2lkOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgdGhpcy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgLy8gdGhpcy5kb20uc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIjtcclxuICAgICAgdGhpcy5kb20uc2V0QXR0cmlidXRlKFwidmlld1wiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG5cclxuICAgICAgLy9fY29udGFpbmVyLmdldEVsZW1lbnQoKS5hcHBlbmQodGhpcy5kb20pOyAvL29sZFxyXG4gICAgICB0aGlzLiNjb250YWluZXIgPSBfY29udGFpbmVyO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5zdGF0ZVJlcXVlc3RFdmVudCA9IHRoaXMuZ2V0U3RhdGUuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLm9uKFwiZGVzdHJveVwiLCAoKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIFZpZXcudmlld3NbdGhpcy4jaWRdO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNMT1NFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jb250ZXh0TWVudUNhbGxiYWNrKTtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRVRfUFJPSkVDVCwgdGhpcy5obmRFdmVudENvbW1vbik7XHJcblxyXG4gICAgICB0aGlzLiNpZCA9IFZpZXcucmVnaXN0ZXJWaWV3Rm9yRHJhZ0Ryb3AodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRWaWV3U291cmNlKF9ldmVudDogRHJhZ0V2ZW50KTogVmlldyB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGF0YVRyYW5zZmVyKVxyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2V2ZW50LmRhdGFUcmFuc2Zlci5pdGVtcylcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUuc3RhcnRzV2l0aChcInNvdXJjZXZpZXdcIikpXHJcbiAgICAgICAgICAgIHJldHVybiBWaWV3LnZpZXdzW2l0ZW0udHlwZS5zcGxpdChcIjpcIikucG9wKCldO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWdpc3RlclZpZXdGb3JEcmFnRHJvcChfdGhpczogVmlldyk6IG51bWJlciB7XHJcbiAgICAgIFZpZXcudmlld3NbVmlldy5pZENvdW50XSA9IF90aGlzO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcmFnIHN0YXJ0cywgYWRkIGlkZW50aWZpZXIgdG8gdGhlIGV2ZW50IGluIGEgd2F5IHRoYXQgYWxsb3dzIGRyYWdvdmVyIHRvIHByb2Nlc3MgdGhlIHNvdXJlXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19TVEFSVCwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcIlNvdXJjZVZpZXc6XCIgKyBfdGhpcy4jaWQudG9TdHJpbmcoKSwgXCJ0eXBlc0hhY2tcIik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcmFnZ2luZyBvdmVyIGEgdmlldywgZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgdmlldyBmb3IgZHJhZ2dpbmcgYW5kIGNhbGwgaG5kRHJhZ092ZXJcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX09WRVIsIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBsZXQgdmlld1NvdXJjZTogVmlldyA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpO1xyXG4gICAgICAgIF90aGlzLmhuZERyYWdPdmVyKF9ldmVudCwgdmlld1NvdXJjZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gZHJhZyBvdmVyIGR1cmluZyBjYXB0dXJlIHBoYXNlLCBhbGxvd3Mgdmlld3MgdG8gcHJldmVudCBldmVudCByZWFjaGluZyB0aGUgYWN0dWFsIHRhcmdldFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfT1ZFUiwgX2V2ZW50ID0+IF90aGlzLmhuZERyYWdPdmVyQ2FwdHVyZShfZXZlbnQsIFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpKSwgdHJ1ZSk7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyb3BwaW5nIGludG8gYSB2aWV3LCBnZXQgdGhlIG9yaWdpbmFsIHNvdXJjZSB2aWV3IGZvciBkcmFnZ2luZyBhbmQgY2FsbCBobmREcm9wXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIMaSdWkuRVZFTlQuRFJPUCxcclxuICAgICAgICAoX2V2ZW50OiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcbiAgICAgICAgICBfdGhpcy5obmREcm9wKF9ldmVudCwgdmlld1NvdXJjZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWxzZSk7XHJcblxyXG4gICAgICAvLyBkcm9wIGR1cmluZyBjYXB0dXJlIHBoYXNlLCBhbGxvd3Mgdmlld3MgbWFuaXB1bGF0ZSB0aGUgZHJvcCBkYXRhIGJlZm9yZSB0aGUgYWN0dWFsIHRhcmdldCBpcyByZWFjaGVkXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJPUCwgX2V2ZW50ID0+IF90aGlzLmhuZERyb3BDYXB0dXJlKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpLCB0cnVlKTtcclxuXHJcbiAgICAgIHJldHVybiBWaWV3LmlkQ291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGlkKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBgJHt0aGlzLiNpZH1fJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VGl0bGUoX3RpdGxlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLnNldFRpdGxlKF90aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBPYmplY3RbXSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGF0Y2goX3R5cGU6IEVWRU5UX0VESVRPUiwgX2luaXQ6IEN1c3RvbUV2ZW50SW5pdDxFdmVudERldGFpbD4pOiB2b2lkIHtcclxuICAgICAgX2luaXQuZGV0YWlsID0gX2luaXQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBfaW5pdC5kZXRhaWwudmlldyA9IF9pbml0LmRldGFpbC52aWV3IHx8IHRoaXM7XHJcbiAgICAgIHRoaXMuZG9tLmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwYXRjaFRvUGFyZW50KF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF9pbml0LmRldGFpbCA9IF9pbml0LmRldGFpbCB8fCB7fTtcclxuICAgICAgX2luaXQuYnViYmxlcyA9IHRydWU7XHJcbiAgICAgIF9pbml0LmRldGFpbC52aWV3ID0gX2luaXQuZGV0YWlsLnZpZXcgfHwgdGhpcztcclxuICAgICAgdGhpcy5kb20ucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFZGl0b3JFdmVudChfdHlwZSwgX2luaXQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgQ29udGV4dE1lbnU6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gRXZlbnRzXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9zb3VyY2UsIF9ldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50Q29tbW9uID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAvLyAgIGNhc2UgRVZFTlRfRURJVE9SLlNFVF9QUk9KRUNUOlxyXG4gICAgICAvLyAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vIH1cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIGV4dGVybmFsIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3RXh0ZXJuYWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgdHJlZTogxpJ1aS5DdXN0b21UcmVlPERpcmVjdG9yeUVudHJ5PjtcclxuXHJcbiAgICAjZXhwYW5kZWQ6IHN0cmluZ1tdOyAvLyBjYWNoZSBzdGF0ZSBmcm9tIGNvbnN0cnVjdG9yXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy4jZXhwYW5kZWQgPSBfc3RhdGVbXCJleHBhbmRlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UHJvamVjdCgpOiB2b2lkIHtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5ldyBVUkwoXCIuXCIsIMaSLlByb2plY3QuYmFzZVVSTCkucGF0aG5hbWU7XHJcbiAgICAgIGlmIChuYXZpZ2F0b3IucGxhdGZvcm0gPT0gXCJXaW4zMlwiIHx8IG5hdmlnYXRvci5wbGF0Zm9ybSA9PSBcIldpbjY0XCIpIHtcclxuICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7IC8vIHN0cmlwIGxlYWRpbmcgc2xhc2hcclxuICAgICAgfVxyXG4gICAgICBsZXQgcm9vdDogRGlyZWN0b3J5RW50cnkgPSBEaXJlY3RvcnlFbnRyeS5jcmVhdGVSb290KHBhdGgpO1xyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJ1aS5DdXN0b21UcmVlPERpcmVjdG9yeUVudHJ5PihuZXcgQ29udHJvbGxlclRyZWVEaXJlY3RvcnkoKSwgcm9vdCk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMudHJlZS5nZXRJdGVtcygpWzBdLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gYERyYWcgJiBkcm9wIGV4dGVybmFsIGltYWdlLCBhdWRpb2ZpbGUgZXRjLiB0byB0aGUgXCJJbnRlcm5hbFwiLCB0byBjcmVhdGUgYSBGVURHRS1yZXNvdXJjZWA7XHJcblxyXG4gICAgICBpZiAodGhpcy4jZXhwYW5kZWQpXHJcbiAgICAgICAgdGhpcy5leHBhbmQodGhpcy4jZXhwYW5kZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJleHBhbmRlZFwiXSA9IHRoaXMuZ2V0RXhwYW5kZWQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhKSAgLy8gVE9ETzogaW5zcGVjdCBpZiB0aGlzIGlzIGV2ZXIgdGhlIGNhc2U/XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBub3RoaW5nIGFjdHVhbGx5IHNlbGVjdGVkLi4uXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgICAgdGhpcy5zZXRQcm9qZWN0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnRyZWUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGNvbnN0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMudHJlZSkge1xyXG4gICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgZXhwYW5kZWQucHVzaChpdGVtLmRhdGEucGF0aFJlbGF0aXZlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZXhwYW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogRGlyZWN0b3J5RW50cnlbXVtdID0gX3BhdGhzLm1hcChfcGF0aCA9PiBuZXcgRGlyZWN0b3J5RW50cnkoXCJcIiwgX3BhdGgsIG51bGwsIG51bGwpLmdldFBhdGgoKSk7XHJcbiAgICAgIHRoaXMudHJlZS5leHBhbmQocGF0aHMpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlld0ludGVybmFsIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGdsdGZJbXBvcnRTZXR0aW5nczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7IC8vIFRPRE86IHNhdmUgdGhlc2Ugc2V0dGluZ3M/XHJcbiAgICAgIFvGki5HcmFwaC5uYW1lXTogdHJ1ZSxcclxuICAgICAgW8aSLkFuaW1hdGlvbi5uYW1lXTogdHJ1ZSxcclxuICAgICAgW8aSLk1hdGVyaWFsLm5hbWVdOiBmYWxzZSxcclxuICAgICAgW8aSLk1lc2gubmFtZV06IGZhbHNlXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFRPRE86IGVpdGhlciByZW1vdmUgVmlld0ludGVybmFsVGFibGUgb3IgdW5pZnkgY29tbW9uIGZ1bmN0aW9uYWxpdHkgd2l0aCBWaWV3SW50ZXJuYWxGb2xkZXIgaW50byBWaWV3SW50ZXJuYWwuLi5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXlzIHRoZSBpbnRlcm5hbCByZXNvdXJjZXMgYXMgYSBmb2xkZXIgdHJlZS5cclxuICAgKiBAYXV0aG9ycyBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyNCBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0ludGVybmFsRm9sZGVyIGV4dGVuZHMgVmlld0ludGVybmFsIHtcclxuICAgIHByaXZhdGUgdHJlZTogxpJ1aS5DdXN0b21UcmVlPFJlc291cmNlRW50cnk+O1xyXG5cclxuICAgICNleHBhbmRlZDogc3RyaW5nW107IC8vIGNhY2hlIHN0YXRlIGZyb20gY29uc3RydWN0b3JcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRPcGVuKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZFVwZGF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRDcmVhdGUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRGVsZXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmhuZEtleWJvYXJkRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy4jZXhwYW5kZWQgPSBfc3RhdGVbXCJleHBhbmRlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbnRyb2xsZXIoKTogQ29udHJvbGxlclRyZWVSZXNvdXJjZSB7XHJcbiAgICAgIHJldHVybiA8Q29udHJvbGxlclRyZWVSZXNvdXJjZT50aGlzLnRyZWUuY29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlRm9sZGVyKCk6IFJlc291cmNlRm9sZGVyIHtcclxuICAgICAgcmV0dXJuIHByb2plY3QucmVzb3VyY2VGb2xkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIDzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uZmlsdGVyKF9lbGVtZW50ID0+ICEoX2VsZW1lbnQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSB7XHJcbiAgICAgIHJldHVybiA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT50aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcy5maWx0ZXIoX3NvdXJjZSA9PiAhKF9zb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IHRoaXMgaXMgYSBwcmVwYXJhdGlvbiBmb3Igc3luY2luZyBhIGdyYXBoIHdpdGggaXRzIGluc3RhbmNlcyBhZnRlciBzdHJ1Y3R1cmFsIGNoYW5nZXNcclxuICAgIC8vIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgcm93OiBIVE1MVGFibGVSb3dFbGVtZW50ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoKF9lbGVtZW50KSA9PiAoPEhUTUxFbGVtZW50Pl9lbGVtZW50KS50YWdOYW1lID09IFwiVFJcIik7XHJcbiAgICAvLyAgIGlmIChyb3cpXHJcbiAgICAvLyAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSkuZW5hYmxlZCA9IChyb3cuZ2V0QXR0cmlidXRlKFwiaWNvblwiKSA9PSBcIkdyYXBoXCIpO1xyXG4gICAgLy8gICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJleHBhbmRlZFwiXSA9IHRoaXMuZ2V0RXhwYW5kZWQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDcmVhdGUgRm9sZGVyXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX0ZPTERFUiksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDcmVhdGUgR3JhcGhcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfR1JBUEgpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJHXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNZXNoXCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfTUVTSCksXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9NRVNILCDGki5NZXNoLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWF0ZXJpYWxcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCksXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCwgxpIuU2hhZGVyLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgQW5pbWF0aW9uXCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgxpIuQW5pbWF0aW9uLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfWAsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEZWxldGVcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAgIGxldCBpU3ViY2xhc3M6IG51bWJlciA9IF9pdGVtW1wiaVN1YmNsYXNzXCJdO1xyXG4gICAgICBpZiAoIWlTdWJjbGFzcyAmJiAoY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NRVNIIHx8IGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJGdW5reSBFbGVjdHJvbi1FcnJvci4uLiBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGZvY3VzOiBSZXNvdXJjZUVudHJ5ID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcblxyXG4gICAgICBpZiAoY2hvaWNlID09IENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSkge1xyXG4gICAgICAgIGlmICgoKGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW2ZvY3VzXSkpLmxlbmd0aCA+IDApKVxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShmb2N1cyBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcmVzb3VyY2U6IFJlc291cmNlRW50cnk7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0ZPTERFUjpcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IFJlc291cmNlRm9sZGVyKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NRVNIOlxyXG4gICAgICAgICAgbGV0IHR5cGVNZXNoOiB0eXBlb2YgxpIuTWVzaCA9IMaSLk1lc2guc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyB0eXBlTWVzaCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUw6XHJcbiAgICAgICAgICBsZXQgdHlwZVNoYWRlcjogdHlwZW9mIMaSLlNoYWRlciA9IMaSLlNoYWRlci5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyDGki5NYXRlcmlhbCh0eXBlU2hhZGVyLm5hbWUsIHR5cGVTaGFkZXIpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfR1JBUEg6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKG5ldyDGki5Ob2RlKFwiTmV3R3JhcGhcIikpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OOlxyXG4gICAgICAgICAgbGV0IHR5cGVBbmltYXRpb246IHR5cGVvZiDGki5BbmltYXRpb24gPSDGki5BbmltYXRpb24uc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgdHlwZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgxpIuUGFydGljbGVTeXN0ZW0oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICB0aGlzLnRyZWUuYWRkQ2hpbGRyZW4oW3Jlc291cmNlXSwgZm9jdXMpO1xyXG4gICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShyZXNvdXJjZSkuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgaXRlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgd2hpbGUgKGl0ZW0gIT0gdGhpcy5kb20gJiYgIShpdGVtIGluc3RhbmNlb2YgxpJ1aS5DdXN0b21UcmVlSXRlbSkpXHJcbiAgICAgICAgaXRlbSA9IGl0ZW0ucGFyZW50RWxlbWVudDtcclxuXHJcbiAgICAgIGlmIChpdGVtID09IHRoaXMuZG9tKSB7XHJcbiAgICAgICAgaXRlbSA9IHRoaXMudHJlZS5maW5kVmlzaWJsZSh0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgICBpdGVtLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiDGknVpLkN1c3RvbVRyZWVJdGVtKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IHRydWUpO1xyXG5cclxuICAgICAgaWYgKCEoaXRlbS5kYXRhIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKSB7XHJcbiAgICAgICAgY29uc3QgY3JlYXRlT3B0aW9uczogQ09OVEVYVE1FTlVbXSA9IFtDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSLCBDT05URVhUTUVOVS5DUkVBVEVfR1JBUEgsIENPTlRFWFRNRU5VLkNSRUFURV9NRVNILCBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04sIENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1RdO1xyXG4gICAgICAgIGNyZWF0ZU9wdGlvbnMuZm9yRWFjaChfaWQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKF9pZCkpLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW0uZGF0YSA9PSB0aGlzLnJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpKS52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdFeHRlcm5hbCkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgICAgaWYgKHNvdXJjZXMuc29tZShfc291cmNlID0+IFtNSU1FLkFVRElPLCBNSU1FLklNQUdFLCBNSU1FLk1FU0gsIE1JTUUuR0xURl0uaW5jbHVkZXMoX3NvdXJjZS5nZXRNaW1lVHlwZSgpKSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGhuZERyb3BDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcyB8fCBfZXZlbnQudGFyZ2V0ID09IHRoaXMudHJlZSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdFeHRlcm5hbCB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlc291cmNlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IFtdO1xyXG4gICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB7XHJcbiAgICAgICAgICByZXNvdXJjZXMucHVzaChhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChzb3VyY2UsIHRydWUpKTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChzb3VyY2UuZ2V0TWltZVR5cGUoKSkge1xyXG4gICAgICAgICAgY2FzZSBNSU1FLkFVRElPOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChuZXcgxpIuQXVkaW8oc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgTUlNRS5JTUFHRTpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2gobmV3IMaSLlRleHR1cmVJbWFnZShzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBNSU1FLk1FU0g6XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKGF3YWl0IG5ldyDGki5NZXNoT0JKKCkubG9hZChzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBNSU1FLkdMVEY6XHJcbiAgICAgICAgICAgIGxldCBsb2FkZXI6IMaSLkdMVEZMb2FkZXIgPSBhd2FpdCDGki5HTFRGTG9hZGVyLkxPQUQoc291cmNlLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgICAgICAgIGxldCBsb2FkOiBib29sZWFuID0gYXdhaXQgxpJ1aS5EaWFsb2cucHJvbXB0KFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3MsIGZhbHNlLCBgU2VsZWN0IHdoaWNoIHJlc291cmNlcyB0byBpbXBvcnQgZnJvbSAnJHtsb2FkZXIubmFtZX0nYCwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgICAgIGlmICghbG9hZClcclxuICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncykgaWYgKFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3NbdHlwZV0pXHJcbiAgICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2goLi4uYXdhaXQgbG9hZGVyLmxvYWRSZXNvdXJjZXM8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD4oxpJbdHlwZV0pKTtcclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSByZXNvdXJjZXM7XHJcbiAgICAgIHRoaXMudHJlZS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCjGknVpLkVWRU5ULkRST1AsIHsgYnViYmxlczogZmFsc2UgfSkpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5Ym9hcmRFdmVudCA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuRjIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmICghaW5wdXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRPcGVuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJ1aS5DdXN0b21UcmVlPFJlc291cmNlRW50cnk+KG5ldyBDb250cm9sbGVyVHJlZVJlc291cmNlKCksIHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwi4pePIFJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgcmVzb3VyY2UuXFxu4pePIFNlbGVjdCBvciBkcmFnIHJlc291cmNlLlwiO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSBcIuKXjyBTZWxlY3QgdG8gZWRpdCBpbiBcXFwiUHJvcGVydGllc1xcXCJcXG7il48gRHJhZyB0byBcXFwiUHJvcGVydGllc1xcXCIgb3IgXFxcIkNvbXBvbmVudHNcXFwiIHRvIHVzZSBpZiBhcHBsaWNhYmxlLlwiO1xyXG4gICAgICB0aGlzLmhuZENyZWF0ZSgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuI2V4cGFuZGVkKVxyXG4gICAgICAgIHRoaXMuZXhwYW5kKHRoaXMuI2V4cGFuZGVkKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDcmVhdGUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGFkZCBuZXcgcmVzb3VyY2VzIHRvIHJvb3QgZm9sZGVyXHJcbiAgICAgIGZvciAobGV0IGlkUmVzb3VyY2UgaW4gxpIuUHJvamVjdC5yZXNvdXJjZXMpIHtcclxuICAgICAgICBsZXQgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlID0gxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV07XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlc291cmNlRm9sZGVyLmNvbnRhaW5zKHJlc291cmNlKSlcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihbcmVzb3VyY2VdLCB0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmhuZFVwZGF0ZSgpO1xyXG4gICAgICBsZXQgcm9vdEl0ZW06IMaSdWkuQ3VzdG9tVHJlZUl0ZW08UmVzb3VyY2VFbnRyeT4gPSB0aGlzLnRyZWUuZmluZFZpc2libGUodGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIGlmICghcm9vdEl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgcm9vdEl0ZW0uZXhwYW5kKHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gcmVtb3ZlIHJlc291cmNlcyB0aGF0IGFyZSBubyBsb25nZXIgcmVnaXN0ZXJlZCBpbiB0aGUgcHJvamVjdFxyXG4gICAgICBmb3IgKGNvbnN0IGRlc2NlbmRhbnQgb2YgdGhpcy5yZXNvdXJjZUZvbGRlcilcclxuICAgICAgICBpZiAoIShkZXNjZW5kYW50IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpICYmICHGki5Qcm9qZWN0LnJlc291cmNlc1tkZXNjZW5kYW50LmlkUmVzb3VyY2VdKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlbW92ZShkZXNjZW5kYW50KTtcclxuXHJcbiAgICAgIHRoaXMuaG5kVXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kVXBkYXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLnRyZWUucmVmcmVzaCgpO1xyXG4gICAgICBPYmplY3QudmFsdWVzKMaSLlByb2plY3QucmVzb3VyY2VzKVxyXG4gICAgICAgIC5maWx0ZXIoX3Jlc291cmNlID0+ICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD5fcmVzb3VyY2UpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpXHJcbiAgICAgICAgLm1hcChfcmVzb3VyY2UgPT4gdGhpcy5jb250cm9sbGVyLmdldFBhdGgoX3Jlc291cmNlKSlcclxuICAgICAgICAuZm9yRWFjaChfcGF0aCA9PiB0aGlzLnRyZWUuc2hvdyhfcGF0aCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC5kZXRhaWw/LnNlbmRlcilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuTU9ESUZZLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVNT1ZFX0NISUxEOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5ERUxFVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU5BTUU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiBSZXNvdXJjZUVudHJ5W11bXSA9IF9wYXRoc1xyXG4gICAgICAgIC5tYXAoX3BhdGggPT4gX3BhdGhcclxuICAgICAgICAgIC5zcGxpdChcIi9cIilcclxuICAgICAgICAgIC5zbGljZSgxKSAvLyByZW1vdmUgcm9vdCBhcyBpdCBpcyBhZGRlZCBhcyBmaXJzdCBlbGVtZW50IGluIHJlZHVjZVxyXG4gICAgICAgICAgLnJlZHVjZTxSZXNvdXJjZUZvbGRlcltdPigoX3BhdGgsIF9pbmRleCkgPT4gWy4uLl9wYXRoLCBfcGF0aFtfcGF0aC5sZW5ndGggLSAxXT8uZW50cmllcz8uW19pbmRleF1dLCBbdGhpcy5yZXNvdXJjZUZvbGRlcl0pKVxyXG4gICAgICAgIC5maWx0ZXIoX3BhdGggPT4gIV9wYXRoLnNvbWUoX2VudHJ5ID0+ICFfZW50cnkpKTsgLy8gZmlsdGVyIG91dCBpbnZhbGlkIHBhdGhzXHJcbiAgICAgIHRoaXMudHJlZS5leHBhbmQocGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RXhwYW5kZWQoKTogc3RyaW5nW10ge1xyXG4gICAgICBjb25zdCBleHBhbmRlZDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnRyZWUpIHtcclxuICAgICAgICBpZiAoaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGV4cGFuZGVkLnB1c2godGhpcy5nZXRQYXRoKGl0ZW0uZGF0YSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBleHBhbmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFBhdGgoX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nZXRQYXRoKF9lbnRyeSkubWFwKF9lbnRyeSA9PiBfZW50cnkucmVzb3VyY2VQYXJlbnQ/LmVudHJpZXMuaW5kZXhPZihfZW50cnkpKS5qb2luKFwiL1wiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1ZpZXcudHNcIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL1ZpZXcvUHJvamVjdC9WaWV3RXh0ZXJuYWwudHNcIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL1ZpZXcvUHJvamVjdC9WaWV3SW50ZXJuYWxGb2xkZXIudHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgaW50ZXJmYWNlIERyYWdEcm9wRmlsdGVyIHtcclxuICAgIG9uS2V5QXR0cmlidXRlPzogc3RyaW5nO1xyXG4gICAgb25UeXBlQXR0cmlidXRlPzogc3RyaW5nO1xyXG4gICAgZnJvbVZpZXdzPzogKHR5cGVvZiBWaWV3KVtdO1xyXG4gICAgb25UeXBlPzogRnVuY3Rpb247XHJcbiAgICBvZlR5cGU/OiBGdW5jdGlvbjtcclxuICAgIGRyb3BFZmZlY3Q6IFwiY29weVwiIHwgXCJsaW5rXCIgfCBcIm1vdmVcIiB8IFwibm9uZVwiO1xyXG4gIH1cclxuXHJcbiAgbGV0IGZpbHRlcjogeyBbbmFtZTogc3RyaW5nXTogRHJhZ0Ryb3BGaWx0ZXIgfSA9IHtcclxuICAgIFVybE9uVGV4dHVyZTogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIlRleHR1cmVJbWFnZVwiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVXJsT25NZXNoT0JKOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiTWVzaE9CSlwiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVXJsT25BdWRpbzogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIkF1ZGlvXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBVcmxPbk1lc2hHTFRGOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiTWVzaEdMVEZcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIE1hdGVyaWFsT25Db21wb25lbnRNYXRlcmlhbDogeyBmcm9tVmlld3M6IFtWaWV3SW50ZXJuYWxdLCBvblR5cGU6IMaSLkNvbXBvbmVudE1hdGVyaWFsLCBvZlR5cGU6IMaSLk1hdGVyaWFsLCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgTWVzaE9uQ29tcG9uZW50TWVzaDogeyBmcm9tVmlld3M6IFtWaWV3SW50ZXJuYWxdLCBvblR5cGU6IMaSLkNvbXBvbmVudE1lc2gsIG9mVHlwZTogxpIuTWVzaCwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIEFuaW1hdGlvbk9uQ29tcG9uZW50QW5pbWF0b3I6IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5Db21wb25lbnRBbmltYXRvciwgb2ZUeXBlOiDGki5BbmltYXRpb24sIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBQYXJ0aWNsZVN5c3RlbU9uQ29tcG9uZW50UGFydGljbGVTeXN0ZW06IHsgZnJvbVZpZXdzOiBbVmlld0ludGVybmFsXSwgb25UeXBlOiDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSwgb2ZUeXBlOiDGki5QYXJ0aWNsZVN5c3RlbSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIC8vIE1lc2hPbk1lc2hMYWJlbDogeyBmcm9tVmlld3M6IFtWaWV3SW50ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJtZXNoXCIsIG9mVHlwZTogxpIuTWVzaCwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFRleHR1cmVPbk1hdGVyaWFsVGV4dHVyZTogeyBmcm9tVmlld3M6IFtWaWV3SW50ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ0ZXh0dXJlXCIsIG9uVHlwZTogxpIuTWF0ZXJpYWwsIG9mVHlwZTogxpIuVGV4dHVyZSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFRleHR1cmVPbk1hdGVyaWFsTm9ybWFsTWFwOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcIm5vcm1hbE1hcFwiLCBvblR5cGU6IMaSLk1hdGVyaWFsLCBvZlR5cGU6IMaSLlRleHR1cmUsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcblxyXG4gICAgVGV4dHVyZU9uQW5pbWF0aW9uU3ByaXRlOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uVHlwZTogxpIuQW5pbWF0aW9uU3ByaXRlLCBvZlR5cGU6IMaSLlRleHR1cmUsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBUZXh0dXJlT25NZXNoUmVsaWVmOiB7IGZyb21WaWV3czogW1ZpZXdJbnRlcm5hbF0sIG9uVHlwZTogxpIuTWVzaFJlbGllZiwgb2ZUeXBlOiDGki5UZXh0dXJlSW1hZ2UsIGRyb3BFZmZlY3Q6IFwibGlua1wiIH1cclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlckRldGFpbCBleHRlbmRzIMaSVWkuQ29udHJvbGxlciB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX211dGFibGU6IMaSLk11dGFibGUsIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICBzdXBlcihfbXV0YWJsZSwgX2RvbUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULklOUFVULCB0aGlzLm11dGF0ZU9uSW5wdXQsIHRydWUpOyAvLyB0aGlzIHNob3VsZCBiZSBvYnNvbGV0ZVxyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtdXRhdGVPbklucHV0ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgLy8gVE9ETzogbW92ZSB0aGlzIHRvIFVpLkNvbnRyb2xsZXIgYXMgYSBnZW5lcmFsIG9wdGltaXphdGlvbiB0byBvbmx5IG11dGF0ZSB3aGF0IGhhcyBiZWVuIGNoYW5nZWQuLi4hXHJcbiAgICAgIHRoaXMuZ2V0TXV0YXRvciA9IHN1cGVyLmdldE11dGF0b3I7XHJcblxyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIF9ldmVudC5jb21wb3NlZFBhdGgoKSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gZG9jdW1lbnQpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50PnRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChrZXkpXHJcbiAgICAgICAgICBwYXRoLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgICBwYXRoLnBvcCgpO1xyXG4gICAgICBwYXRoLnJldmVyc2UoKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGki5NdXRhYmxlLmdldE11dGF0b3JGcm9tUGF0aCh0aGlzLmdldE11dGF0b3IoKSwgcGF0aCk7XHJcbiAgICAgIHRoaXMuZ2V0TXV0YXRvciA9IChfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yID0+IHtcclxuICAgICAgICB0aGlzLmdldE11dGF0b3IgPSBzdXBlci5nZXRNdXRhdG9yOyAvLyByZXNldFxyXG4gICAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5zZXJ0ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgQ29udHJvbGxlckRldGFpbFwiKTtcclxuICAgICAgY29uc29sZS5sb2coX2V2ZW50LmRldGFpbCk7XHJcbiAgICAgIGxldCBtdXRhYmxlOiDGki5NdXRhYmxlID0gdGhpcy5tdXRhYmxlW19ldmVudC5kZXRhaWwuZ2V0QXR0cmlidXRlKFwia2V5XCIpXTtcclxuICAgICAgY29uc29sZS5sb2cobXV0YWJsZS50eXBlKTtcclxuICAgICAgaWYgKG11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgbXV0YWJsZS5wdXNoKG5ldyBtdXRhYmxlLnR5cGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KMaSVWkuRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHVybCBvbiB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgY2hlY2tNaW1lVHlwZShNSU1FLklNQUdFKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIG1lc2hvYmpcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoT0JKLCBjaGVja01pbWVUeXBlKE1JTUUuTUVTSCkpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBjaGVja01pbWVUeXBlKE1JTUUuQVVESU8pKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gbWVzaGdsdGZcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoR0xURiwgY2hlY2tNaW1lVHlwZShNSU1FLkdMVEYpKSkgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gTWF0ZXJpYWwgb24gQ29tcG9uZW50TWF0ZXJpYWxcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuTWF0ZXJpYWxPbkNvbXBvbmVudE1hdGVyaWFsKSkgcmV0dXJuO1xyXG4gICAgICAvLyBNZXNoIG9uIENvbXBvbmVudE1lc2hcclxuICAgICAgLy8gaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuTWVzaE9uQ29tcG9uZW50TWVzaCwgKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4ge1xyXG4gICAgICAvLyAgIGxldCBrZXk6IHN0cmluZyA9IHRoaXMuZ2V0QW5jZXN0b3JXaXRoVHlwZShfZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIC8vICAgcmV0dXJuIChrZXkgPT0gXCJtZXNoXCIpO1xyXG4gICAgICAvLyB9KSkgcmV0dXJuO1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NZXNoT25Db21wb25lbnRNZXNoKSkgcmV0dXJuO1xyXG4gICAgICAvLyBNZXNoIG9uIE1lc2hMYWJlbFxyXG4gICAgICAvLyBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NZXNoT25NZXNoTGFiZWwpKSByZXR1cm47XHJcbiAgICAgIC8vIFRleHR1cmUgb24gTWF0ZXJpYWwgdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5UZXh0dXJlT25NYXRlcmlhbFRleHR1cmUpKSByZXR1cm47XHJcbiAgICAgIC8vIFRleHR1cmUgb24gTWF0ZXJpYWwgbm9ybWFsIG1hcFxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5UZXh0dXJlT25NYXRlcmlhbE5vcm1hbE1hcCkpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBNZXNoUmVsaWVmXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlRleHR1cmVPbk1lc2hSZWxpZWYpKSByZXR1cm47XHJcbiAgICAgIC8vIFRleHR1cmUgb24gQW5pbWF0aW9uU3ByaXRlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlRleHR1cmVPbkFuaW1hdGlvblNwcml0ZSkpIHJldHVybjtcclxuICAgICAgLy8gQW5pbWF0aW9uIG9mIENvbXBvbmVudEFuaW1hdGlvblxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5BbmltYXRpb25PbkNvbXBvbmVudEFuaW1hdG9yKSkgcmV0dXJuO1xyXG4gICAgICAvLyBQYXJ0aWNsZVN5c3RlbSBvZiBDb21wb25lbnRQYXJ0aWNsZVN5c3RlbVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5QYXJ0aWNsZVN5c3RlbU9uQ29tcG9uZW50UGFydGljbGVTeXN0ZW0pKSByZXR1cm47XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tNaW1lVHlwZShfbWltZTogTUlNRSk6IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICAgcmV0dXJuIChzb3VyY2VzLmxlbmd0aCA9PSAxICYmIHNvdXJjZXNbMF0uZ2V0TWltZVR5cGUoKSA9PSBfbWltZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHNldEV4dGVybmFsTGluazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS52YWx1ZSA9IHNvdXJjZXNbMF0ucGF0aFJlbGF0aXZlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlT25JbnB1dChfZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc2V0UmVzb3VyY2U6IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4gPSAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgbGV0IGFuY2VzdG9yOiBIVE1MRWxlbWVudCA9IHRoaXMuZ2V0QW5jZXN0b3JXaXRoVHlwZShfZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBhbmNlc3Rvci5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKCF0aGlzLm11dGFibGVba2V5XSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtrZXldID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRNYXRlcmlhbDogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICB0aGlzLm11dGFibGVbXCJtYXRlcmlhbFwiXSA9IF9zb3VyY2VzWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc2V0TWVzaDogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICB0aGlzLm11dGFibGVbXCJtZXNoXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRUZXh0dXJlOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcImNvYXRcIl1bXCJ0ZXh0dXJlXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXROb3JtYWxNYXA6IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4gPSAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlW1wiY29hdFwiXVtcIm5vcm1hbE1hcFwiXSA9IF9zb3VyY2VzWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc2V0U3ByaXRlVGV4dHVyZTogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICB0aGlzLm11dGFibGVbXCJ0ZXh0dXJlXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlLm11dGF0ZSh7fSk7IC8vIGZvcmNlIHJlY3JlYXRpb24gdXNpbmcgbmV3IHRleHR1cmVcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldEhlaWdodE1hcDogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICAvLyB0aGlzLm11dGFibGVbXCJ0ZXh0dXJlXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB0aGlzLm11dGFibGUuZ2V0TXV0YXRvcigpO1xyXG4gICAgICAgIG11dGF0b3IudGV4dHVyZSA9IF9zb3VyY2VzWzBdO1xyXG4gICAgICAgIHRoaXMubXV0YWJsZS5tdXRhdGUobXV0YXRvcik7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzZXRBbmltYXRpb246IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4gPSAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlW1wiYW5pbWF0aW9uXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgLy8gdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNldFBhcnRpY2xlU3lzdGVtOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHRoaXMubXV0YWJsZVtcInBhcnRpY2xlU3lzdGVtXCJdID0gX3NvdXJjZXNbMF07XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaE9CSiwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBzZXRFeHRlcm5hbExpbmspKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBNYXRlcmlhbCBvbiBDb21wb25lbnRNYXRlcmlhbFxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5NYXRlcmlhbE9uQ29tcG9uZW50TWF0ZXJpYWwsIHNldE1hdGVyaWFsKSkgcmV0dXJuO1xyXG4gICAgICAvLyBNZXNoIG9uIENvbXBvbmVudE1lc2hcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuTWVzaE9uQ29tcG9uZW50TWVzaCwgc2V0TWVzaCkpIHJldHVybjtcclxuICAgICAgLy8gTWVzaCBvbiBNZXNoTGFiZWxcclxuICAgICAgLy8gaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuTWVzaE9uTWVzaExhYmVsLCBzZXRNZXNoKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1hdGVyaWFsIHRleHR1cmVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWF0ZXJpYWxUZXh0dXJlLCBzZXRUZXh0dXJlKSkgcmV0dXJuO1xyXG4gICAgICAvLyBUZXh0dXJlIG9uIE1hdGVyaWFsIG5vcm1hbCBtYXBcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uTWF0ZXJpYWxOb3JtYWxNYXAsIHNldE5vcm1hbE1hcCkpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBNZXNoUmVsaWVmXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlRleHR1cmVPbk1lc2hSZWxpZWYsIHNldEhlaWdodE1hcCkpIHJldHVybjtcclxuICAgICAgLy8gVGV4dHVyZSBvbiBBbmltYXRpb25TcHJpdGVcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVGV4dHVyZU9uQW5pbWF0aW9uU3ByaXRlLCBzZXRTcHJpdGVUZXh0dXJlKSkgcmV0dXJuO1xyXG4gICAgICAvLyBBbmltYXRpb24gb24gQ29tcG9uZW50QW5pbWF0b3JcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuQW5pbWF0aW9uT25Db21wb25lbnRBbmltYXRvciwgc2V0QW5pbWF0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAvLyBQYXJ0aWNsZVN5c3RlbSBvbiBDb21wb25lbnRQYXJ0aWNsZVN5c3RlbVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5QYXJ0aWNsZVN5c3RlbU9uQ29tcG9uZW50UGFydGljbGVTeXN0ZW0sIHNldFBhcnRpY2xlU3lzdGVtKSkgcmV0dXJuO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJEcmFnRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX2ZpbHRlcjogRHJhZ0Ryb3BGaWx0ZXIsIF9jYWxsYmFjazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9ICgpID0+IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IHR5cGVFbGVtZW50OiBzdHJpbmcgPSB0YXJnZXQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiBzdHJpbmcgPSB0aGlzLmdldEFuY2VzdG9yV2l0aFR5cGUodGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG5cclxuICAgICAgaWYgKF9maWx0ZXIub25LZXlBdHRyaWJ1dGUgJiYgdHlwZUVsZW1lbnQgIT0gX2ZpbHRlci5vbktleUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGVBdHRyaWJ1dGUgJiYgdHlwZUNvbXBvbmVudCAhPSBfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGUgJiYgISh0aGlzLm11dGFibGUgaW5zdGFuY2VvZiBfZmlsdGVyLm9uVHlwZSkpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcblxyXG4gICAgICBpZiAoIV9maWx0ZXIuZnJvbVZpZXdzPy5maW5kKChfdmlldykgPT4gdmlld1NvdXJjZSBpbnN0YW5jZW9mIF92aWV3KSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSB2aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBpZiAoIShzb3VyY2VzWzBdIGluc3RhbmNlb2YgX2ZpbHRlci5vZlR5cGUpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghX2NhbGxiYWNrKHNvdXJjZXMpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBbmNlc3RvcldpdGhUeXBlKF90YXJnZXQ6IEV2ZW50VGFyZ2V0KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X3RhcmdldDtcclxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgdHlwZTogc3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIGlmICh0eXBlKVxyXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFkOiDGknVpLlRBQkxFW10gPSBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiB0cnVlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJUeXBlXCIsIGtleTogXCJ0eXBlXCIsIHNvcnRhYmxlOiB0cnVlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIklkXCIsIGtleTogXCJpZFJlc291cmNlXCIsIHNvcnRhYmxlOiBmYWxzZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlUmVzb3VyY2UuaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TGFiZWwoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgcmVuYW1lKF9vYmplY3Q6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJDaGVjayByZW5hbWVcIiwgX29iamVjdC5uYW1lLCBfbmV3KTtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9vYmplY3QubmFtZSAhPSBfbmV3O1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX29iamVjdC5uYW1lID0gX25ldzsgLy8gbXVzdCByZW5hbWUgYmVmb3JlIGxvYWRpbmcsIFRPRE86IFdIWSBpcyBpdCB0aGF0IHRoZSByZW5hbWluZyBpcyBzdXBwb3NlZCB0byBiZSBoYW5kbGVkIGJ5IHRoZSBhY3R1YWwgdGFibGU/Pz9cclxuICAgICAgICBhd2FpdCAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X29iamVjdCkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvcHkoX29yaWdpbmFsczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSk6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9mb2N1c3NlZCwgdGhpcy5zZWxlY3Rpb24pO1xyXG4gICAgICAvLyB0aGlzLnNlbGVjdGlvbiA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kYWJsZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSB0aGlzLnNlbGVjdGlvbi5jb25jYXQoW10pOyAvL19mb2N1c3NlZCk7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uczogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25TdHJpbmdzOiBNYXA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCB1c2FnZXM6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBleHBlbmRhYmxlIG9mIGV4cGVuZGFibGVzKSB7XHJcbiAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBleHBlbmRhYmxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgIGlmIChzZXJpYWxpemF0aW9uU3RyaW5ncy5nZXQocmVzb3VyY2UpLmluZGV4T2YoZXhwZW5kYWJsZS5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhd2FpdCBvcGVuRGlhbG9nKCkpIHtcclxuICAgICAgICBsZXQgZGVsZXRlZDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHVzYWdlIGluIHVzYWdlcylcclxuICAgICAgICAgIGlmICh1c2FnZXNbdXNhZ2VdLmxlbmd0aCA9PSAwKSB7IC8vIGRlbGV0ZSBvbmx5IHVudXNlZFxyXG4gICAgICAgICAgICBkZWxldGVkLnB1c2goxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKMaSLlByb2plY3QucmVzb3VyY2VzW3VzYWdlXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQodXNhZ2VzLCB0cnVlLCBcIlJldmlldyByZWZlcmVuY2VzLCBkZWxldGUgZGVwZW5kZW5kIHJlc291cmNlcyBmaXJzdCBpZiBhcHBsaWNhYmxlXCIsIFwiVG8gZGVsZXRlIHVudXNlZCByZXNvdXJjZXMsIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgX2I6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBTY3JpcHRJbmZvIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3VwZXJDbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIHNjcmlwdDogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgaXNDb21wb25lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudFNjcmlwdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihfc2NyaXB0OiBGdW5jdGlvbiwgX25hbWVzcGFjZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuc2NyaXB0ID0gX3NjcmlwdDtcclxuICAgICAgdGhpcy5uYW1lID0gX3NjcmlwdC5uYW1lO1xyXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IF9uYW1lc3BhY2U7XHJcbiAgICAgIGxldCBjaGFpbjogRnVuY3Rpb24gPSBfc2NyaXB0W1wiX19wcm90b19fXCJdO1xyXG4gICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBjaGFpbi5uYW1lO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudCA9IHRoaXMuaXNDb21wb25lbnQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRcIik7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudFNjcmlwdCA9IHRoaXMuaXNDb21wb25lbnRTY3JpcHQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRTY3JpcHRcIik7XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbltcIl9fcHJvdG9fX1wiXTtcclxuICAgICAgfSB3aGlsZSAoY2hhaW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVNjcmlwdCBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPFNjcmlwdEluZm8+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVNjcmlwdC5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiU3VwZXJcIiwga2V5OiBcInN1cGVyQ2xhc3NcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZXNwYWNlXCIsIGtleTogXCJuYW1lc3BhY2VcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgcmV0dXJuIGhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlYWQoKTogxpJ1aS5UQUJMRVtdIHtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXJUYWJsZVNjcmlwdC5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiBTY3JpcHRJbmZvKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogU2NyaXB0SW5mbywgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGRlbGV0ZShfZm9jdXNzZWQ6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiBTY3JpcHRJbmZvW10pOiBQcm9taXNlPFNjcmlwdEluZm9bXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc29ydChfZGF0YTogU2NyaXB0SW5mb1tdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiBTY3JpcHRJbmZvLCBfYjogU2NyaXB0SW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIF9kaXJlY3Rpb24gKiAoX2FbX2tleV0gPT0gX2JbX2tleV0gPyAwIDogKF9hW19rZXldID4gX2JbX2tleV0gPyAxIDogLTEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2RhdGEuc29ydChjb21wYXJlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSBleHRlbmRzIMaSVWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8RGlyZWN0b3J5RW50cnk+IHtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEZpZWxkU2V0RWxlbWVudCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRmllbGRTZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICBsZXQgbmFtZTogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgbmFtZS52YWx1ZSA9IF9lbnRyeS5uYW1lO1xyXG4gICAgICBjb250ZW50LmFwcGVuZENoaWxkKG5hbWUpO1xyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSwgX2lkOiBzdHJpbmcsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX25ldztcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IHJlbmFtZSBmaWxlICcke19lbnRyeS5uYW1lfScgdG8gJyR7X25ld30nLmAsIF9lcnJvcik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBEaXJlY3RvcnlFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbihfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfZW50cnkuaXNEaXJlY3Rvcnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeS5nZXREaXJlY3RvcnlDb250ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVxdWFscyhfYTogRGlyZWN0b3J5RW50cnksIF9iOiBEaXJlY3RvcnlFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2EucGF0aFJlbGF0aXZlID09IF9iLnBhdGhSZWxhdGl2ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogRGlyZWN0b3J5RW50cnlbXSk6IFByb21pc2U8RGlyZWN0b3J5RW50cnlbXT4ge1xyXG4gICAgICAvLyBkZWxldGUgc2VsZWN0aW9uIGluZGVwZW5kZW5kIG9mIGZvY3Vzc2VkIGl0ZW1cclxuICAgICAgbGV0IGRlbGV0ZWQ6IERpcmVjdG9yeUVudHJ5W10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogRGlyZWN0b3J5RW50cnlbXSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA+IDAgPyB0aGlzLnNlbGVjdGlvbiA6IF9mb2N1c3NlZDtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5zZWxlY3Rpb24gfHwgZXhwZW5kKSB7XHJcbiAgICAgICAgZW50cnkuZGVsZXRlKCk7XHJcbiAgICAgICAgZGVsZXRlZC5wdXNoKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfZW50cmllczogRGlyZWN0b3J5RW50cnlbXSwgX3RhcmdldDogRGlyZWN0b3J5RW50cnkpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IG1vdmU6IERpcmVjdG9yeUVudHJ5W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2VudHJpZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgX3RhcmdldC5hZGRFbnRyeShlbnRyeSk7XHJcbiAgICAgICAgICBlbnRyeS5kZWxldGUoKTtcclxuICAgICAgICAgIG1vdmUucHVzaChlbnRyeSk7XHJcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy53YXJuKGBDb3VsZCBub3QgYWRkIGZpbGUgJyR7ZW50cnkubmFtZX0nIHRvICcke190YXJnZXQubmFtZX0nLmAsIF9lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IERpcmVjdG9yeUVudHJ5W10pOiBQcm9taXNlPERpcmVjdG9yeUVudHJ5W10+IHtcclxuICAgICAgLy8gY29waWVzIGNhbiBub3QgYmUgY3JlYXRlZCBhdCB0aGlzIHBvaW50LCBidXQgd2hlbiBjb3B5aW5nIHRoZSBmaWxlcy4gU2VlIGFkZENoaWxkcmVuXHJcbiAgICAgIHJldHVybiBfb3JpZ2luYWxzO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVIaWVyYXJjaHkgZXh0ZW5kcyDGklVpLkN1c3RvbVRyZWVDb250cm9sbGVyPMaSLk5vZGU+IHtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfb2JqZWN0OiDGki5Ob2RlKTogSFRNTEZpZWxkU2V0RWxlbWVudCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRmllbGRTZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICBsZXQgbmFtZTogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgbmFtZS52YWx1ZSA9IF9vYmplY3QubmFtZTtcclxuICAgICAgY29udGVudC5hcHBlbmRDaGlsZChuYW1lKTtcclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX25vZGU6IMaSLk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgYXR0cmlidXRlczogc3RyaW5nW10gPSBbX25vZGUuaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiXTtcclxuICAgICAgaWYgKF9ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJHcmFwaEluc3RhbmNlXCIpO1xyXG4gICAgICByZXR1cm4gYXR0cmlidXRlcy5qb2luKFwiIFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX25vZGU6IMaSLk5vZGUsIF9pZDogc3RyaW5nLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9ub2RlLm5hbWUgIT0gX25ldztcclxuICAgICAgaWYgKHJlbmFtZSkge1xyXG4gICAgICAgIF9ub2RlLm5hbWUgPSBfbmV3O1xyXG4gICAgICAgIGF3YWl0ICg8xpIuR3JhcGhHTFRGPl9ub2RlKS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX25vZGU6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9ub2RlLmdldENoaWxkcmVuKCkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX25vZGU6IMaSLk5vZGUpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gX25vZGUuZ2V0Q2hpbGRyZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogxpIuTm9kZVtdKTogUHJvbWlzZTzGki5Ob2RlW10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogxpIuTm9kZVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3Vzc2VkO1xyXG4gICAgICBmb3IgKGxldCBub2RlIG9mIGV4cGVuZClcclxuICAgICAgICBpZiAobm9kZS5nZXRQYXJlbnQoKSkge1xyXG4gICAgICAgICAgbm9kZS5nZXRQYXJlbnQoKS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlLCBfaW5kZXg/OiBudW1iZXIpOiDGki5Ob2RlW10ge1xyXG4gICAgICAvLyBkaXNhbGxvdyBkcm9wIGZvciBzb3VyY2VzIGJlaW5nIGFuY2VzdG9yIHRvIHRhcmdldFxyXG4gICAgICBsZXQgbW92ZTogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9jaGlsZHJlbilcclxuICAgICAgICBpZiAoIV90YXJnZXQuaXNEZXNjZW5kYW50T2YoY2hpbGQpKVxyXG4gICAgICAgICAgbW92ZS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgIG1vdmUuZm9yRWFjaCgoX25vZGUsIF9pTW92ZSkgPT4gX3RhcmdldC5hZGRDaGlsZChfbm9kZSwgX2luZGV4ID09IHVuZGVmaW5lZCA/IF9pbmRleCA6IF9pbmRleCArIF9pTW92ZSkpO1xyXG4gICAgICAvLyBmb3IgKGxldCBub2RlIG9mIG1vdmUpXHJcbiAgICAgIC8vICAgX3RhcmdldC5hZGRDaGlsZChub2RlLCBfaVRhcmdldCk7XHJcblxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5Ob2RlW10pOiBQcm9taXNlPMaSLk5vZGVbXT4ge1xyXG4gICAgICAvLyB0cnkgdG8gY3JlYXRlIGNvcGllcyBhbmQgcmV0dXJuIHRoZW0gZm9yIHBhc3RlIG9wZXJhdGlvblxyXG4gICAgICBsZXQgY29waWVzOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgb3JpZ2luYWwgb2YgX29yaWdpbmFscykge1xyXG4gICAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5zZXJpYWxpemUob3JpZ2luYWwpO1xyXG4gICAgICAgIGxldCBjb3B5OiDGki5Ob2RlID0gPMaSLk5vZGU+YXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZShzZXJpYWxpemF0aW9uKTtcclxuICAgICAgICBjb3BpZXMucHVzaChjb3B5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29waWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5BZGRDaGlsZHJlbihfc291cmNlczogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfc291cmNlcy5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gX3NvdXJjZXMuZXZlcnkoX3NvdXJjZSA9PiBjaGVja0dyYXBoRHJvcChfc291cmNlLCBfdGFyZ2V0KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja0dyYXBoRHJvcChfc291cmNlOiDGki5Ob2RlLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGlkU291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBub2RlIG9mIF9zb3VyY2UuZ2V0SXRlcmF0b3IoKSlcclxuICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICAgICAgaWRTb3VyY2VzLnB1c2gobm9kZS5pZFNvdXJjZSk7XHJcbiAgICAgICAgICBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlkU291cmNlcy5wdXNoKG5vZGUuaWRSZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGlmIChfdGFyZ2V0IGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlmIChpZFNvdXJjZXMuaW5kZXhPZihfdGFyZ2V0LmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgaWYgKF90YXJnZXQgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgICAgICBpZiAoaWRTb3VyY2VzLmluZGV4T2YoX3RhcmdldC5pZFNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgX3RhcmdldCA9IF90YXJnZXQuZ2V0UGFyZW50KCk7XHJcbiAgICAgICAgfSB3aGlsZSAoX3RhcmdldCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0IGVudW0gSUQge1xyXG4gICAgTkFNRSA9IFwibmFtZVwiLFxyXG4gICAgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCIsXHJcbiAgICBWQUxVRSA9IFwidmFsdWVcIixcclxuICAgIFRSQU5TRk9STUFUSU9OID0gXCJ0cmFuc2Zvcm1hdGlvblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIMaSdWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4ge1xyXG4gICAgcHVibGljIGNoaWxkVG9QYXJlbnQ6IE1hcDzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbTtcclxuICAgIHByaXZhdGUgdmlldzogVmlld1BhcnRpY2xlU3lzdGVtO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbSwgX3ZpZXc6IFZpZXdQYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy52aWV3ID0gX3ZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBIVE1MRmllbGRTZXRFbGVtZW50IHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxGaWVsZFNldEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XHJcbiAgICAgIGxldCBwYXJlbnREYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5jaGlsZFRvUGFyZW50LmdldChfZGF0YSk7XHJcbiAgICAgIGxldCBrZXk6IHN0cmluZyA9IHRoaXMuZ2V0S2V5KF9kYXRhKTtcclxuICAgICAgXHJcbiAgICAgIGlmICghxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkgJiYgIcaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGxldCBzcGFuTmFtZTogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3Bhbk5hbWUuaW5uZXJUZXh0ID0gcGFyZW50RGF0YSA/IGtleSA6IMaSLlBhcnRpY2xlU3lzdGVtLm5hbWU7XHJcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzcGFuTmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJlbnREYXRhICYmIHBhcmVudERhdGEgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcykge1xyXG4gICAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgLy8gaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNba2V5XTtcclxuICAgICAgICBpbnB1dC5pZCA9IElELk5BTUU7XHJcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgICAgIHNlbGVjdC5pZCA9IElELkZVTkNUSU9OO1xyXG4gICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBPYmplY3QudmFsdWVzKMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTikpIHtcclxuICAgICAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIGVudHJ5LnRleHQgPSBuYW1lO1xyXG4gICAgICAgICAgICBlbnRyeS52YWx1ZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIHNlbGVjdC5hZGQoZW50cnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VsZWN0LnZhbHVlID0gX2RhdGEuZnVuY3Rpb247XHJcbiAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICAgIC8vIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGlucHV0LmlkID0gSUQuVkFMVUU7XHJcbiAgICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpIHtcclxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBfZGF0YS5jb2RlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBfZGF0YS52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJsaXN0XCIsIFwidmFyaWFibGVzXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgfSBcclxuICAgICAgfSBlbHNlIGlmICjGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgc2VsZWN0LmlkID0gSUQuVFJBTlNGT1JNQVRJT047XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIFvGki5NYXRyaXg0eDQucHJvdG90eXBlLnRyYW5zbGF0ZS5uYW1lLCDGki5NYXRyaXg0eDQucHJvdG90eXBlLnJvdGF0ZS5uYW1lLCDGki5NYXRyaXg0eDQucHJvdG90eXBlLnNjYWxlLm5hbWVdKSB7XHJcbiAgICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgIGVudHJ5LnRleHQgPSBrZXk7XHJcbiAgICAgICAgICBlbnRyeS52YWx1ZSA9IGtleTtcclxuICAgICAgICAgIHNlbGVjdC5hZGQoZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3QudmFsdWUgPSBfZGF0YS50cmFuc2Zvcm1hdGlvbjtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgfHwgdGhpcy5jaGlsZFRvUGFyZW50LmdldChfZGF0YSkgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcykgXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwidmFyaWFibGVcIik7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKF9kYXRhLmZ1bmN0aW9uKTtcclxuICAgICAgaWYgKF9kYXRhID09IHRoaXMuZGF0YS5jb2xvcilcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJjb2xvclwiKTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSkgXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwidHJhbnNmb3JtYXRpb25cIik7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJjb2RlXCIpO1xyXG5cclxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSwgX2lkOiBzdHJpbmcsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICBsZXQgaW5wdXRBc051bWJlcjogbnVtYmVyID0gTnVtYmVyLnBhcnNlRmxvYXQoX25ldyk7XHJcblxyXG4gICAgICBpZiAoX2lkID09IElELk5BTUUgJiYgxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpIHtcclxuICAgICAgICBsZXQgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5pbmNsdWRlcyhfbmV3KSlcclxuICAgICAgICAgIGVycm9ycy5wdXNoKGB2YXJpYWJsZSBcIiR7X25ld31cIiBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVNbX25ld10pXHJcbiAgICAgICAgICBlcnJvcnMucHVzaChgdmFyaWFibGUgXCIke19uZXd9XCIgaXMgYSBwcmVkZWZpbmVkIHZhcmlhYmxlIGFuZCBjYW4gbm90IGJlIHJlZGVjbGFyZWQuIFByZWRlZmluZWQgdmFyaWFibGVzOiBbJHtPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpLmpvaW4oXCIsIFwiKX1dYCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICDGknVpLldhcm5pbmcuZGlzcGxheShlcnJvcnMsIFwiVW5hYmxlIHRvIHJlbmFtZVwiLCBcIlBsZWFzZSByZXNvbHZlIHRoZSBlcnJvcnMgYW5kIHRyeSBhZ2FpblwiICk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5kYXRhLnZhcmlhYmxlcy5pbmRleE9mKF9kYXRhKTtcclxuICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdO1xyXG4gICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2luZGV4XSA9IF9uZXc7XHJcbiAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShuYW1lLCBfbmV3KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9pZCA9PSBJRC5GVU5DVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS5mdW5jdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04+X25ldztcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9pZCA9PSBJRC5UUkFOU0ZPUk1BVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS50cmFuc2Zvcm1hdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXCJ0cmFuc2Zvcm1hdGlvblwiXT5fbmV3O1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2lkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpKSkge1xyXG4gICAgICAgIGxldCBpbnB1dDogc3RyaW5nIHwgbnVtYmVyID0gTnVtYmVyLmlzTmFOKGlucHV0QXNOdW1iZXIpID8gX25ldyA6IGlucHV0QXNOdW1iZXI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PSBcInN0cmluZ1wiICYmICHGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVNbaW5wdXRdICYmIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzICYmICF0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5pbmNsdWRlcyhpbnB1dCkpIFxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIF9kYXRhLnZhbHVlID0gaW5wdXQ7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2lkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkpIHtcclxuICAgICAgICBfZGF0YS5jb2RlID0gX25ldztcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbihfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldENoaWxkcmVuKF9kYXRhKS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSB7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb25zdGFudChfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpKVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGxldCBjaGlsZHJlbjogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdID0gW107XHJcbiAgICAgIGxldCBkYXRhOiBPYmplY3QgPSDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhO1xyXG4gICAgICBsZXQga2V5czogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhkYXRhKTtcclxuXHJcbiAgICAgIGlmIChkYXRhID09IHRoaXMuZGF0YSlcclxuICAgICAgICBrZXlzID0gVmlld1BhcnRpY2xlU3lzdGVtLlBST1BFUlRZX0tFWVMuZmlsdGVyKF9rZXkgPT4ga2V5cy5pbmNsdWRlcyhfa2V5KSk7XHJcblxyXG4gICAgICBrZXlzLmZvckVhY2goX2tleSA9PiB7XHJcbiAgICAgICAgbGV0IGNoaWxkOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gZGF0YVtfa2V5XTtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihjaGlsZCkgfHwgdHlwZW9mIGNoaWxkID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgdGhpcy5jaGlsZFRvUGFyZW50LnNldChkYXRhW19rZXldLCBfZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3VzZWQ6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdKTogUHJvbWlzZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA+IDAgPyB0aGlzLnNlbGVjdGlvbiA6IF9mb2N1c2VkO1xyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIGV4cGVuZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlbGV0ZURhdGEoZGF0YSkpXHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2NoaWxkcmVuOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10sIF90YXJnZXQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIF9hdD86IG51bWJlcik6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSB7XHJcbiAgICAgIGxldCBtb3ZlOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10gPSBbXTtcclxuICAgICAgbGV0IGNvbnRhaW5lcjogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdO1xyXG5cclxuICAgICAgaWYgKCjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfdGFyZ2V0KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfdGFyZ2V0KSkgJiYgX2NoaWxkcmVuLmV2ZXJ5KF9kYXRhID0+IMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSlcclxuICAgICAgICBjb250YWluZXIgPSBfdGFyZ2V0LnBhcmFtZXRlcnM7XHJcbiAgICAgIGVsc2UgaWYgKChfdGFyZ2V0ID09IHRoaXMuZGF0YS5tdHhMb2NhbCB8fCBfdGFyZ2V0ID09IHRoaXMuZGF0YS5tdHhXb3JsZCkgJiYgX2NoaWxkcmVuLmV2ZXJ5KF9kYXRhID0+IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSkpXHJcbiAgICAgICAgY29udGFpbmVyID0gPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltdPl90YXJnZXQ7XHJcbiAgICAgIGVsc2UgaWYgKChfdGFyZ2V0ID09IHRoaXMuZGF0YS52YXJpYWJsZXMgfHwgX3RhcmdldCA9PSB0aGlzLmRhdGEuY29sb3IpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkpXHJcbiAgICAgICAgY29udGFpbmVyID0gPMaSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uW10+X3RhcmdldDtcclxuXHJcbiAgICAgIGlmICghY29udGFpbmVyKSBcclxuICAgICAgICByZXR1cm4gbW92ZTtcclxuXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRhaW5lcikpXHJcbiAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBfY2hpbGRyZW4pIHtcclxuICAgICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gY29udGFpbmVyLmluZGV4T2YoZGF0YSk7IC8vIF9hdCBuZWVkcyB0byBiZSBjb3JyZWN0ZWQgaWYgd2UgYXJlIG1vdmluZyB3aXRoaW4gc2FtZSBwYXJlbnRcclxuICAgICAgICAgIGxldCBoYXNQYXJlbnQ6IGJvb2xlYW4gPSB0aGlzLmNoaWxkVG9QYXJlbnQuaGFzKGRhdGEpO1xyXG4gICAgICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzPy5baW5kZXhdO1xyXG5cclxuICAgICAgICAgIGlmIChoYXNQYXJlbnQgJiYgIXRoaXMuZGVsZXRlRGF0YShkYXRhKSkgXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGlmICghaGFzUGFyZW50KVxyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblxyXG4gICAgICAgICAgbW92ZS5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5jaGlsZFRvUGFyZW50LnNldChkYXRhLCBfdGFyZ2V0KTtcclxuICAgICAgICAgIGlmIChpbmRleCA+IC0xICYmIF9hdCA+IGluZGV4KVxyXG4gICAgICAgICAgICBfYXQgLT0gMTtcclxuXHJcbiAgICAgICAgICBpZiAoX2F0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5wdXNoKG5hbWUgfHwgdGhpcy5nZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5zcGxpY2UoX2F0ICsgX2NoaWxkcmVuLmluZGV4T2YoZGF0YSksIDAsIGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuc3BsaWNlKF9hdCArIF9jaGlsZHJlbi5pbmRleE9mKGRhdGEpLCAwLCBuYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSk6IFByb21pc2U8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdPiB7XHJcbiAgICAgIGxldCBjb3BpZXM6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdID0gW107XHJcbiAgICAgIGlmIChfb3JpZ2luYWxzLmV2ZXJ5KF9vcmlnaW5hbCA9PiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9vcmlnaW5hbCkpIHx8IF9vcmlnaW5hbHMuZXZlcnkoX29yaWdpbmFsID0+IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9vcmlnaW5hbCkpKVxyXG4gICAgICAgIF9vcmlnaW5hbHMuZm9yRWFjaChfb3JpZ2luYWwgPT4gY29waWVzLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShfb3JpZ2luYWwpKSkpO1xyXG5cclxuICAgICAgcmV0dXJuIGNvcGllcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3ZlcnJpZGUgZHJhZ2dhYmxlKF90YXJnZXQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX3RhcmdldCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdlbmVyYXRlTmV3VmFyaWFibGVOYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBcIm5ld1ZhcmlhYmxlXCI7XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMTtcclxuICAgICAgd2hpbGUgKHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLmluY2x1ZGVzKG5hbWUpKSB7XHJcbiAgICAgICAgbmFtZSA9IFwibmV3VmFyaWFibGVcIiArIGNvdW50O1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRLZXkoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBzdHJpbmcgeyBcclxuICAgICAgbGV0IHBhcmVudDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpIHx8IHt9O1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24ocGFyZW50KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihwYXJlbnQpKVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJhbWV0ZXJzO1xyXG5cclxuICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBhcmVudCkuZmluZChfZW50cnkgPT4gX2VudHJ5WzFdID09IF9kYXRhKT8uc2hpZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZURhdGEoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKF9kYXRhID09IHRoaXMuZGF0YSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICBsZXQgcGFyZW50OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5jaGlsZFRvUGFyZW50LmdldChfZGF0YSk7XHJcbiAgICAgIGxldCBrZXk6IHN0cmluZyA9IHRoaXMuZ2V0S2V5KF9kYXRhKTtcclxuXHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihwYXJlbnQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKHBhcmVudCkpXHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmFtZXRlcnM7XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnQpKSB7XHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBOdW1iZXIucGFyc2VJbnQoa2V5KTtcclxuICAgICAgICBwYXJlbnQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBpZiAocGFyZW50ID09IHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5jaGlsZFRvUGFyZW50LmRlbGV0ZShfZGF0YSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuYW1lVmFyaWFibGUoX25hbWU6IHN0cmluZywgX25ldzogc3RyaW5nLCBfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuZGF0YSk6IHZvaWQge1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpICYmIF9kYXRhLnZhbHVlID09IF9uYW1lKSB7XHJcbiAgICAgICAgX2RhdGEudmFsdWUgPSBfbmV3O1xyXG4gICAgICAgIHRoaXMudmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGRldGFpbDogeyBkYXRhOiBfZGF0YSB9IH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHN1YkRhdGEgb2YgT2JqZWN0LnZhbHVlcyhcInBhcmFtZXRlcnNcIiBpbiBfZGF0YSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YSkpXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdWJEYXRhID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICB0aGlzLnJlbmFtZVZhcmlhYmxlKF9uYW1lLCBfbmV3LCBzdWJEYXRhKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgUmVzb3VyY2VFbnRyeSA9IFJlc291cmNlRmlsZSB8IFJlc291cmNlRm9sZGVyO1xyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFJlc291cmNlRmlsZSBleHRlbmRzIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlIHtcclxuICAgIHJlc291cmNlUGFyZW50PzogUmVzb3VyY2VGb2xkZXI7IC8vIGRhbmdlcm91cyBhcyBhIFNlcmlhbGl6YWJsZVJlc291cmNlIG11c3Qgbm90IGhhdmUgYSBwcm9wZXJ0eSB3aXRoIHRoaXMgbmFtZSBpdHNlbGZcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBSZXNvdXJjZUZvbGRlciBpbXBsZW1lbnRzIMaSLlNlcmlhbGl6YWJsZSB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlc291cmNlUGFyZW50OiBSZXNvdXJjZUZvbGRlcjtcclxuICAgIHB1YmxpYyBlbnRyaWVzOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmcgPSBcIkZvbGRlclwiO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nID0gXCJOZXcgRm9sZGVyXCIpIHtcclxuICAgICAgdGhpcy5uYW1lID0gX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvciBhbnkgb2YgaXRzIGRlc2NlbmRhbnRzIGNvbnRhaW4gdGhlIGdpdmVuIHJlc291cmNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnMoX3Jlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSk6IGJvb2xlYW4ge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIFxyXG4gICAgICAgIGlmIChlbnRyeSA9PSBfcmVzb3VyY2UgfHwgZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciAmJiBlbnRyeS5jb250YWlucyhfcmVzb3VyY2UpKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSgpOiDGki5TZXJpYWxpemF0aW9uIHtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24gPSB7IG5hbWU6IHRoaXMubmFtZSwgZW50cmllczogW10gfTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5lbnRyaWVzKSB7XHJcbiAgICAgICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgICBzZXJpYWxpemF0aW9uLmVudHJpZXMucHVzaChlbnRyeS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgc2VyaWFsaXphdGlvbi5lbnRyaWVzLnB1c2goeyBpZFJlc291cmNlOiBlbnRyeS5pZFJlc291cmNlIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZXJpYWxpemF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZXNlcmlhbGl6ZShfc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbik6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9zZXJpYWxpemF0aW9uLm5hbWU7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5U2VyaWFsaXphdGlvbiBvZiBfc2VyaWFsaXphdGlvbi5lbnRyaWVzID8/IF9zZXJpYWxpemF0aW9uLmNoaWxkcmVuKSB7IC8vIHJlbW92ZSBcIj8/IF9zZXJpYWxpemF0aW9uLmNoaWxkcmVuXCIgYWZ0ZXIgYSB3aGlsZVxyXG4gICAgICAgIGxldCBlbnRyeTogUmVzb3VyY2VFbnRyeTtcclxuICAgICAgICBpZiAoXCJpZFJlc291cmNlXCIgaW4gZW50cnlTZXJpYWxpemF0aW9uKVxyXG4gICAgICAgICAgZW50cnkgPSBhd2FpdCDGki5Qcm9qZWN0LmdldFJlc291cmNlKGVudHJ5U2VyaWFsaXphdGlvbi5pZFJlc291cmNlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlbnRyeSA9IDxSZXNvdXJjZUZvbGRlcj5hd2FpdCBuZXcgUmVzb3VyY2VGb2xkZXIoKS5kZXNlcmlhbGl6ZShlbnRyeVNlcmlhbGl6YXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgIHRoaXMuZW50cmllcy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgIGVudHJ5LnJlc291cmNlUGFyZW50ID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFJlc291cmNlRW50cnk+IHtcclxuICAgICAgeWllbGQgdGhpcztcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5lbnRyaWVzKSB7XHJcbiAgICAgICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgICB5aWVsZCogZW50cnk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgeWllbGQgZW50cnk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZVJlc291cmNlIGV4dGVuZHMgxpJ1aS5DdXN0b21UcmVlQ29udHJvbGxlcjxSZXNvdXJjZUVudHJ5PiB7XHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfb2JqZWN0OiBSZXNvdXJjZUVudHJ5KTogSFRNTEZpZWxkU2V0RWxlbWVudCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRmllbGRTZXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICBsZXQgbmFtZTogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgIG5hbWUudmFsdWUgPSBfb2JqZWN0Lm5hbWU7XHJcbiAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQobmFtZSk7XHJcblxyXG5cclxuICAgICAgaWYgKCEoX29iamVjdCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSkge1xyXG4gICAgICAgIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBfb2JqZWN0LnR5cGUpO1xyXG5cclxuICAgICAgICBpZiAoKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9vYmplY3QpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xyXG4gICAgICAgICAgY29udGVudC50aXRsZSA9IFwiRmFpbGVkIHRvIGxvYWQgcmVzb3VyY2UgZnJvbSBmaWxlLiBDaGVjayB0aGUgY29uc29sZSBmb3IgZGV0YWlscy5cIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBSZXNvdXJjZUVudHJ5LCBfaWQ6IHN0cmluZywgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfZW50cnkubmFtZSAhPSBfbmV3O1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfbmV3O1xyXG4gICAgICAgIGF3YWl0ICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD5fZW50cnkpLmxvYWQ/LigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbihfZW50cnk6IFJlc291cmNlRW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyICYmIF9lbnRyeS5lbnRyaWVzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IFJlc291cmNlRW50cnlbXSB7XHJcbiAgICAgIHJldHVybiBfZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciA/IF9lbnRyeS5lbnRyaWVzIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9zb3VyY2VzOiBSZXNvdXJjZUVudHJ5W10sIF90YXJnZXQ6IFJlc291cmNlRW50cnksIF9pbmRleD86IG51bWJlcik6IFJlc291cmNlRW50cnlbXSB7XHJcbiAgICAgIGlmICghKF90YXJnZXQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgbGV0IG1vdmU6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgX3NvdXJjZXMpIHtcclxuICAgICAgICBsZXQgY3VycmVudEluZGV4OiBudW1iZXIgPSBfdGFyZ2V0LmVudHJpZXMuaW5kZXhPZihzb3VyY2UpOyAvLyBfaW5kZXggbmVlZHMgdG8gYmUgY29ycmVjdGVkIGlmIHdlIGFyZSBtb3Zpbmcgd2l0aGluIHNhbWUgcGFyZW50XHJcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xICYmIF9pbmRleCA+IGN1cnJlbnRJbmRleClcclxuICAgICAgICAgIF9pbmRleCAtPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZShzb3VyY2UpO1xyXG4gICAgICAgIHNvdXJjZS5yZXNvdXJjZVBhcmVudCA9IF90YXJnZXQ7XHJcbiAgICAgICAgbW92ZS5wdXNoKHNvdXJjZSk7XHJcblxyXG4gICAgICAgIGlmIChfaW5kZXggPT0gbnVsbClcclxuICAgICAgICAgIF90YXJnZXQuZW50cmllcy5wdXNoKHNvdXJjZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgX3RhcmdldC5lbnRyaWVzLnNwbGljZShfaW5kZXggKyBfc291cmNlcy5pbmRleE9mKHNvdXJjZSksIDAsIHNvdXJjZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IFJlc291cmNlRW50cnlbXSk6IFByb21pc2U8UmVzb3VyY2VFbnRyeVtdPiB7XHJcbiAgICAgIC8vIFRPRE86IGFkZCBkZWxldGUgc2VsZWN0aW9uIGlzbnRlYWQgb2YgX2ZvY3Vzc2VkPyBXaHkgZG9lc24ndCB0aGUgVHJlZSBjbGFzcyBoYW5kbGUgdGhpcz9cclxuICAgICAgbGV0IGlSb290OiBudW1iZXIgPSBfZm9jdXNzZWQuaW5kZXhPZihwcm9qZWN0LnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgaWYgKGlSb290ID4gLTEpXHJcbiAgICAgICAgX2ZvY3Vzc2VkLnNwbGljZShpUm9vdCwgMSk7XHJcblxyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbnM6IMaSLlNlcmlhbGl6YXRpb25PZlJlc291cmNlcyA9IMaSLlByb2plY3Quc2VyaWFsaXplKCk7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uU3RyaW5nczogTWFwPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xyXG4gICAgICBsZXQgdXNhZ2VzOiDGki5NdXRhdG9yID0ge307XHJcbiAgICAgIGZvciAobGV0IGlkUmVzb3VyY2UgaW4gc2VyaWFsaXphdGlvbnMpXHJcbiAgICAgICAgc2VyaWFsaXphdGlvblN0cmluZ3Muc2V0KMaSLlByb2plY3QucmVzb3VyY2VzW2lkUmVzb3VyY2VdLCBKU09OLnN0cmluZ2lmeShzZXJpYWxpemF0aW9uc1tpZFJlc291cmNlXSkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgZXhwZW5kYWJsZSBvZiBfZm9jdXNzZWQpIHtcclxuICAgICAgICBpZiAoZXhwZW5kYWJsZSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSB7XHJcbiAgICAgICAgICBsZXQgdXNhZ2U6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4cGVuZGFibGUuZW50cmllcylcclxuICAgICAgICAgICAgdXNhZ2UucHVzaChlbnRyeS5uYW1lKTtcclxuXHJcbiAgICAgICAgICB1c2FnZXNbX2ZvY3Vzc2VkLmluZGV4T2YoZXhwZW5kYWJsZSkgKyBcIiBcIiArIGV4cGVuZGFibGUubmFtZV0gPSB1c2FnZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0gPSBbXTtcclxuICAgICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHNlcmlhbGl6YXRpb25TdHJpbmdzLmtleXMoKSlcclxuICAgICAgICAgICAgaWYgKHJlc291cmNlLmlkUmVzb3VyY2UgIT0gZXhwZW5kYWJsZS5pZFJlc291cmNlKVxyXG4gICAgICAgICAgICAgIGlmIChzZXJpYWxpemF0aW9uU3RyaW5ncy5nZXQocmVzb3VyY2UpLmluZGV4T2YoZXhwZW5kYWJsZS5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0ucHVzaChyZXNvdXJjZS5uYW1lICsgXCIgXCIgKyByZXNvdXJjZS50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZm9jdXNzZWQubGVuZ3RoID4gMCAmJiBhd2FpdCBvcGVuRGlhbG9nKCkpIHtcclxuICAgICAgICBsZXQgZGVsZXRlZDogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0ZWQgb2YgX2ZvY3Vzc2VkKSB7XHJcbiAgICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBzZWxlY3RlZCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyID8gdGhpcy5zZWxlY3Rpb24uaW5kZXhPZihzZWxlY3RlZCkgKyBcIiBcIiArIHNlbGVjdGVkLm5hbWUgOiBzZWxlY3RlZC5pZFJlc291cmNlO1xyXG4gICAgICAgICAgaWYgKHVzYWdlc1trZXldLmxlbmd0aCA9PSAwKSAgLy8gZGVsZXRlIG9ubHkgdW51c2VkXHJcbiAgICAgICAgICAgIGRlbGV0ZWQucHVzaChzZWxlY3RlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBkZWxldGVkKSB7XHJcbiAgICAgICAgICBpZiAoIShyZXNvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSlcclxuICAgICAgICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKHJlc291cmNlKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZShyZXNvdXJjZSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UodGhpcy5zZWxlY3Rpb24uaW5kZXhPZihyZXNvdXJjZSksIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQodXNhZ2VzLCB0cnVlLCBcIlJldmlldyByZWZlcmVuY2VzLCBkZWxldGUgZGVwZW5kZW5kIHJlc291cmNlcyBmaXJzdCBpZiBhcHBsaWNhYmxlXCIsIFwiVG8gZGVsZXRlIHVudXNlZCByZXNvdXJjZXMsIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IFJlc291cmNlRW50cnlbXSk6IFByb21pc2U8UmVzb3VyY2VFbnRyeVtdPiB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGF0aChfcmVzb3VyY2U6IFJlc291cmNlRW50cnkpOiBSZXNvdXJjZUVudHJ5W10ge1xyXG4gICAgICBsZXQgcGF0aDogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBjdXJyZW50OiBSZXNvdXJjZUVudHJ5ID0gX3Jlc291cmNlO1xyXG4gICAgICB3aGlsZSAoY3VycmVudCkge1xyXG4gICAgICAgIHBhdGgucHVzaChjdXJyZW50KTtcclxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yZXNvdXJjZVBhcmVudDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShfcmVzb3VyY2U6IFJlc291cmNlRW50cnkpOiB2b2lkIHtcclxuICAgICAgbGV0IHBhcmVudDogUmVzb3VyY2VGb2xkZXIgPSBfcmVzb3VyY2UucmVzb3VyY2VQYXJlbnQ7XHJcbiAgICAgIGlmICghcGFyZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gcGFyZW50LmVudHJpZXMuaW5kZXhPZihfcmVzb3VyY2UpO1xyXG4gICAgICBwYXJlbnQuZW50cmllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL1ZpZXcvVmlldy50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBbW1BhbmVsXV1zIGFnZ3JlZ2F0aW5nIFtbVmlld11dc1xyXG4gICAqIFN1YmNsYXNzZXMgYXJlIHByZXNldHMgZm9yIGNvbW1vbiBwYW5lbHMuIEEgdXNlciBtaWdodCBhZGQgb3IgZGVsZXRlIFtbVmlld11dcyBhdCBydW50aW1lXHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwIHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDI0XHJcbiAgICovXHJcblxyXG4gIC8vIFRPRE86IGNsYXNzIG1pZ2h0IGJlY29tZSBhIGN1c3RvbWNvbXBvbmVudCBmb3IgSFRNTCEgPSB0aGlzLmRvbVxyXG5cclxuICAvLyBleHRlbmRzIHZpZXcgdm9ycsO8YmVyZ2VoZW5kIGVudGZlcm50XHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhbmVsIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcm90ZWN0ZWQgZ29sZGVuTGF5b3V0OiBHb2xkZW5MYXlvdXQ7XHJcbiAgICBwcm90ZWN0ZWQgdmlld3M6IFZpZXdbXSA9IFtdO1xyXG4gICAgLy9wdWJsaWMgZG9tOyAvLyBtdXNzIHZpZWxsZWljaHQgd2VnXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3BhbmVsU3RhdGU6IFZpZXdTdGF0ZSwgX3ZpZXdDb25zdHJ1Y3RvcnM/OiB7IFtuYW1lOiBzdHJpbmddOiBuZXcgKC4uLmFyZ3M6IMaSLkdlbmVyYWwpID0+IFZpZXcgfSwgX3Jvb3RJdGVtQ29uZmlnPzogUm93T3JDb2x1bW5JdGVtQ29uZmlnKSB7XHJcbiAgICAgIF9jb250YWluZXIub24oXCJkZXN0cm95XCIsICgpID0+IHRoaXMuZ29sZGVuTGF5b3V0LmRlc3Ryb3koKSk7IC8vIGRlc3Ryb3kgZnJvbSBpbnNpZGUgb3V0XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9wYW5lbFN0YXRlKTtcclxuICAgICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUub3ZlcmZsb3cgPSBcInZpc2libGVcIjtcclxuICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwidmlld1wiKTtcclxuICAgICAgdGhpcy5kb20uc2V0QXR0cmlidXRlKFwicGFuZWxcIiwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogTGF5b3V0Q29uZmlnID0ge1xyXG4gICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgcG9wb3V0OiBmYWxzZSxcclxuICAgICAgICAgIG1heGltaXNlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcm9vdDogX3Jvb3RJdGVtQ29uZmlnXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dCA9IG5ldyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Hb2xkZW5MYXlvdXQodGhpcy5kb20pO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gX3ZpZXdDb25zdHJ1Y3RvcnMpXHJcbiAgICAgICAgdGhpcy5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRGYWN0b3J5RnVuY3Rpb24oa2V5LCAoX2NvbnRhaW5lciwgX3ZpZXdTdGF0ZTogVmlld1N0YXRlKSA9PiBuZXcgX3ZpZXdDb25zdHJ1Y3RvcnNba2V5XShfY29udGFpbmVyLCB7IC4uLl9wYW5lbFN0YXRlLCAuLi5fdmlld1N0YXRlIH0pKTtcclxuXHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0Lm9uKFwic3RhdGVDaGFuZ2VkXCIsICgpID0+IHRoaXMuZ29sZGVuTGF5b3V0LnVwZGF0ZVJvb3RTaXplKCkpO1xyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dC5vbihcIml0ZW1DcmVhdGVkXCIsIHRoaXMuYWRkVmlld0NvbXBvbmVudCk7XHJcblxyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dC5sb2FkTGF5b3V0KF9wYW5lbFN0YXRlW1wibGF5b3V0XCJdID8gUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuTGF5b3V0Q29uZmlnLmZyb21SZXNvbHZlZChfcGFuZWxTdGF0ZVtcImxheW91dFwiXSkgOiBjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBTZW5kIGN1c3RvbSBjb3BpZXMgb2YgdGhlIGdpdmVuIGV2ZW50IHRvIHRoZSB2aWV3cyAqL1xyXG4gICAgcHVibGljIGJyb2FkY2FzdCA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBkZXRhaWw6IEV2ZW50RGV0YWlsID0gX2V2ZW50LmRldGFpbCB8fCB7fTtcclxuICAgICAgbGV0IHRhcmdldDogVmlldyA9IGRldGFpbC52aWV3O1xyXG4gICAgICBkZXRhaWwuc2VuZGVyID0gdGhpcztcclxuICAgICAgZm9yIChsZXQgdmlldyBvZiB0aGlzLnZpZXdzKVxyXG4gICAgICAgIGlmICh2aWV3ICE9IHRhcmdldCkgLy8gZG9uJ3Qgc2VuZCBiYWNrIHRvIG9yaWdpbmFsIHRhcmdldCB2aWV3XHJcbiAgICAgICAgICB2aWV3LmRpc3BhdGNoKDxFVkVOVF9FRElUT1I+X2V2ZW50LnR5cGUsIHsgZGV0YWlsOiBkZXRhaWwgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wibGF5b3V0XCJdID0gdGhpcy5nb2xkZW5MYXlvdXQuc2F2ZUxheW91dCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRWaWV3Q29tcG9uZW50ID0gKF9ldmVudDogRXZlbnRFbWl0dGVyLkJ1YmJsaW5nRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gYWRqdXN0bWVucyBmb3IgR29sZGVuTGF5b3V0IDJcclxuICAgICAgbGV0IHRhcmdldDogQ29tcG9uZW50SXRlbSA9IF9ldmVudC50YXJnZXQgYXMgQ29tcG9uZW50SXRlbTtcclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkNvbXBvbmVudEl0ZW0pIHtcclxuICAgICAgICB0aGlzLnZpZXdzLnB1c2goPFZpZXc+dGFyZ2V0LmNvbXBvbmVudCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRPRE86IGFkZFxyXG4gICAqIEBhdXRob3JzIEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbEFuaW1hdGlvbiBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cnVjdG9ycyA9IHsgLyogZXNsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gICAgICAgIFtWSUVXLkFOSU1BVElPTl06IFZpZXdBbmltYXRpb24sXHJcbiAgICAgICAgW1ZJRVcuQU5JTUFUSU9OX1NIRUVUXTogVmlld0FuaW1hdGlvblNoZWV0XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5BTklNQVRJT04sXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlByb3BlcnRpZXNcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5BTklNQVRJT05fU0hFRVRcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiQW5pbWF0aW9uIHwgXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgLy8gVE9ETzogaXRlcmF0ZSBvdmVyIHZpZXdzIGFuZCBjb2xsZWN0IHRoZWlyIHN0YXRlcyBmb3IgcmVjb25zdHJ1Y3Rpb25cclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IF9ldmVudC5kZXRhaWwubm9kZT8uZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudEFuaW1hdG9yKT8uYW5pbWF0aW9uPy5uYW1lO1xyXG4gICAgICAgICAgaWYgKG5hbWUpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGl0bGUoXCJBbmltYXRpb24gfCBcIiArIG5hbWUpO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICogU2hvd3MgYSBncmFwaCBhbmQgb2ZmZXJzIG1lYW5zIGZvciBtYW5pcHVsYXRpb25cclxuICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbEdyYXBoIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgI2dyYXBoOiDGki5HcmFwaDtcclxuICAgICNub2RlOiDGki5Ob2RlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cnVjdG9ycyA9IHsgLyogZXNsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gICAgICAgIFtWSUVXLlJFTkRFUl06IFZpZXdSZW5kZXIsXHJcbiAgICAgICAgW1ZJRVcuQ09NUE9ORU5UU106IFZpZXdDb21wb25lbnRzLFxyXG4gICAgICAgIFtWSUVXLkhJRVJBUkNIWV06IFZpZXdIaWVyYXJjaHlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlJFTkRFUixcclxuICAgICAgICAgIHRpdGxlOiBcIlJlbmRlclwiXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSElFUkFSQ0hZLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJIaWVyYXJjaHlcIlxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkNPTVBPTkVOVFMsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkNvbXBvbmVudHNcIlxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiR3JhcGhcIik7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5GT0NVUywgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMucmVzdG9yZUdyYXBoKCkudGhlbihfZ3JhcGggPT4ge1xyXG4gICAgICAgIGlmIChfZ3JhcGgpIHtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IF9ncmFwaCwgbm9kZTogdGhpcy5yZXN0b3JlTm9kZShfZ3JhcGgpIH0gfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgaWYgKF9zdGF0ZVtcImdyYXBoXCJdKSB7XHJcbiAgICAgICAgICDGki5Qcm9qZWN0LmdldFJlc291cmNlKF9zdGF0ZVtcImdyYXBoXCJdKS50aGVuKChfZ3JhcGg6IMaSLkdyYXBoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IMaSLk5vZGUgPSBfc3RhdGVbXCJub2RlXCJdICYmIMaSLk5vZGUuRklORChfZ3JhcGgsIF9zdGF0ZVtcIm5vZGVcIl0pO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBfZ3JhcGgsIG5vZGU6IG5vZGUgfSB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgaWYgKHRoaXMuI2dyYXBoKVxyXG4gICAgICAgIHN0YXRlW1wiZ3JhcGhcIl0gPSB0aGlzLiNncmFwaC5pZFJlc291cmNlO1xyXG4gICAgICBpZiAodGhpcy4jbm9kZSlcclxuICAgICAgICBzdGF0ZVtcIm5vZGVcIl0gPSDGki5Ob2RlLlBBVEhfRlJPTV9UTyh0aGlzLiNncmFwaCwgdGhpcy4jbm9kZSk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLnZpZXdzLmZpbmQoX3ZpZXcgPT4gX3ZpZXcgaW5zdGFuY2VvZiBWaWV3UmVuZGVyKS5kb20uY29udGFpbnMoPE5vZGU+X2V2ZW50LnRhcmdldCkpIC8vIGFjY2VwdCBkcm9wIG9ubHkgZnJvbSByZW5kZXIgdmlld1xyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogc291cmNlLCBub2RlOiB0aGlzLnJlc3RvcmVOb2RlKHNvdXJjZSkgfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgZGV0YWlsOiBFdmVudERldGFpbCA9IF9ldmVudC5kZXRhaWw7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6IC8vIFRPRE86IGluc3BlY3QgaWYgdGhlc2UgdHdvIHNob3VsZCBiZSBzdG9wcGVkIGFzd2VsbFxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGNvbnN0IGdyYXBoOiDGki5HcmFwaCA9IGRldGFpbC5ncmFwaDtcclxuICAgICAgICAgIGlmIChncmFwaCAmJiBncmFwaCAhPSB0aGlzLiNncmFwaCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlKGAke2dyYXBoLnR5cGV9IHwgJHtncmFwaC5uYW1lfWApO1xyXG4gICAgICAgICAgICB0aGlzLiNncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3Qgbm9kZTogxpIuTm9kZSA9IGRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgaWYgKG5vZGUgJiYgbm9kZSAhPSB0aGlzLiNub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKHRoaXMuI2dyYXBoLCBub2RlKTtcclxuICAgICAgICAgICAgdGhpcy4jbm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGlmIChkZXRhaWwudmlldyAhPSB0aGlzKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBpZiAodGhpcy4jZ3JhcGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVHcmFwaCh0aGlzLiNncmFwaCk7XHJcbiAgICAgICAgICBpZiAodGhpcy4jZ3JhcGggJiYgdGhpcy4jbm9kZSlcclxuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUodGhpcy4jZ3JhcGgsIHRoaXMuI25vZGUpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RvcmVOb2RlKF9ncmFwaDogxpIuR3JhcGgsIF9zZWxlY3RlZDogxpIuTm9kZSk6IHZvaWQge1xyXG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaWR9XyR7X2dyYXBoLmlkUmVzb3VyY2V9YCwgxpIuTm9kZS5QQVRIX0ZST01fVE8oX2dyYXBoLCBfc2VsZWN0ZWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc3RvcmVOb2RlKF9ncmFwaDogxpIuR3JhcGgpOiDGki5Ob2RlIHtcclxuICAgICAgbGV0IHNlbGVjdGVkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuaWR9XyR7X2dyYXBoLmlkUmVzb3VyY2V9YCk7XHJcbiAgICAgIHJldHVybiBzZWxlY3RlZCAmJiDGki5Ob2RlLkZJTkQoX2dyYXBoLCBzZWxlY3RlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZUdyYXBoKF9ncmFwaDogxpIuR3JhcGgpOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBfZ3JhcGguaWRSZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZXN0b3JlR3JhcGgoKTogUHJvbWlzZTzGki5HcmFwaD4ge1xyXG4gICAgICBsZXQgaWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5pZCk7XHJcbiAgICAgIHJldHVybiBpZCAmJiA8UHJvbWlzZTzGki5HcmFwaD4+xpIuUHJvamVjdC5nZXRSZXNvdXJjZShpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICogU2hvd3MgYSBoZWxwIGFuZCBkb2N1bWVudGF0aW9uXHJcbiAgKiBAYXV0aG9ycyBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMVxyXG4gICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsSGVscCBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJIZWxwXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmRvbSk7XHJcbiAgICAgIC8vIFRPRE86IGlmcmFtZSBzYW5kYm94IGRpc2FsbG93cyB1c2Ugb2Ygc2NyaXB0cywgcmVtb3ZlIG9yIHJlcGxhY2Ugd2l0aCBvYmplY3QgaWYgbmVjZXNzYXJ5XHJcbiAgICAgIC8vIHRoaXMuZG9tLmlubmVySFRNTCA9IGA8aWZyYW1lIHNyYz1cIkhlbHAuaHRtbFwiIHNhbmRib3g+PC9pZnJhbWU+YDtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gYDxvYmplY3QgZGF0YT1cIkhlbHAuaHRtbFwiPjwvb2JqZWN0PmA7XHJcblxyXG4gICAgICAvLyBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgLy8gICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAvLyAgIGlzQ2xvc2FibGU6IHRydWUsXHJcbiAgICAgIC8vICAgY29udGVudDogW1xyXG4gICAgICAvLyAgICAge1xyXG4gICAgICAvLyAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAvLyAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlJFTkRFUixcclxuICAgICAgLy8gICAgICAgY29tcG9uZW50U3RhdGU6IF9zdGF0ZSxcclxuICAgICAgLy8gICAgICAgdGl0bGU6IFwiUmVuZGVyXCJcclxuICAgICAgLy8gICAgIH1cclxuICAgICAgLy8gICBdXHJcbiAgICAgIC8vIH07XHJcblxyXG4gICAgICAvLyB0aGlzLmdvbGRlbkxheW91dC5hZGRJdGVtQXRMb2NhdGlvbihjb25maWcsIFt7IHR5cGVJZDogTGF5b3V0TWFuYWdlci5Mb2NhdGlvblNlbGVjdG9yLlR5cGVJZC5Sb290IH1dKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVE9ETzogYWRkXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsUGFydGljbGVTeXN0ZW0gZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5QQVJUSUNMRV9TWVNURU0sXHJcbiAgICAgICAgICB0aXRsZTogxpIuUGFydGljbGVTeXN0ZW0ubmFtZVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIHsgW1ZJRVcuUEFSVElDTEVfU1lTVEVNXTogVmlld1BhcnRpY2xlU3lzdGVtIH0sIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoxpIuUGFydGljbGVTeXN0ZW0ubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICAvLyBUT0RPOiBpdGVyYXRlIG92ZXIgdmlld3MgYW5kIGNvbGxlY3QgdGhlaXIgc3RhdGVzIGZvciByZWNvbnN0cnVjdGlvblxyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBEaXNwbGF5IHRoZSBwcm9qZWN0IHN0cnVjdHVyZSBhbmQgb2ZmZXIgZnVuY3Rpb25zIGZvciBjcmVhdGlvbiwgZGVsZXRpb24gYW5kIGFkanVzdG1lbnQgb2YgcmVzb3VyY2VzXHJcbiAgICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAtIDIwMjNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxQcm9qZWN0IGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uc3RydWN0b3JzID0geyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgICAgICAgW1ZJRVcuSU5URVJOQUxfVEFCTEVdOiBWaWV3SW50ZXJuYWxUYWJsZSxcclxuICAgICAgICBbVklFVy5JTlRFUk5BTF9GT0xERVJdOiBWaWV3SW50ZXJuYWxGb2xkZXIsXHJcbiAgICAgICAgW1ZJRVcuRVhURVJOQUxdOiBWaWV3RXh0ZXJuYWwsXHJcbiAgICAgICAgW1ZJRVcuUFJPUEVSVElFU106IFZpZXdQcm9wZXJ0aWVzLFxyXG4gICAgICAgIFtWSUVXLlBSRVZJRVddOiBWaWV3UHJldmlldyxcclxuICAgICAgICBbVklFVy5TQ1JJUFRdOiBWaWV3U2NyaXB0XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5QUk9QRVJUSUVTLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJQcm9wZXJ0aWVzXCJcclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5QUkVWSUVXLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJQcmV2aWV3XCJcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkVYVEVSTkFMLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkV4dGVybmFsXCJcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5TQ1JJUFQsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiU2NyaXB0XCJcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJzdGFja1wiLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5JTlRFUk5BTF9GT0xERVIsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiSW50ZXJuYWxcIlxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLklOVEVSTkFMX1RBQkxFLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIlRhYmxlXCJcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7IC8vIFRPRE86IGV4cGxhaW4gdXNlIG9mIGRvY3VtZW50IC8vIHJlbW92ZWQgYmVhY2F1c2UgdGhpcyBrZWVwcyB0aGUgcGFuZWxzIGFsaXZlIGV2ZW4gd2hlbiBjbG9zZWRcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiUHJvamVjdCB8IFwiICsgcHJvamVjdC5uYW1lKTtcclxuICAgICAgdGhpcy5icm9hZGNhc3QobmV3IEVkaXRvckV2ZW50KEVWRU5UX0VESVRPUi5PUEVOLCB7fSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLlVQREFURSAmJiBfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuQ1JFQVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5ERUxFVEUpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiUHJvamVjdCB8IFwiICsgcHJvamVjdC5uYW1lKTsgLy93aHkgaGVyZSBhbmQgZXZlcnl0aW1lP1xyXG4gICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5TRUxFQ1QpIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhIHBhcnRpY2xlIHN5c3RlbSBhdHRhY2hlZCB0byBhIG5vZGUuXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9LRVlTOiAoa2V5b2YgxpIuUGFydGljbGVEYXRhLlN5c3RlbSlbXSA9IFtcInZhcmlhYmxlc1wiLCBcIm10eExvY2FsXCIsIFwibXR4V29ybGRcIiwgXCJjb2xvclwiXTtcclxuXHJcbiAgICBwcml2YXRlIGNtcFBhcnRpY2xlU3lzdGVtOiDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHRvb2xiYXJJbnRlcnZhbElkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRpbWVTY2FsZVBsYXk6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPjtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgZXJyb3JzOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB2YXJpYWJsZXM6IEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0obnVsbCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGZvY3VzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgbGV0IHBvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSkpO1xyXG4gICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgaXRlbS5zdWJtZW51Lml0ZW1zLmZvckVhY2goX3N1Ykl0ZW0gPT4gX3N1Ykl0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgICBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZU1xyXG4gICAgICAgICAgLmZpbHRlcihfdmFsdWUgPT4gIU9iamVjdC5rZXlzKGZvY3VzKS5pbmNsdWRlcyhfdmFsdWUpKVxyXG4gICAgICAgICAgLmZvckVhY2goX2xhYmVsID0+IGl0ZW0uc3VibWVudS5pdGVtcy5maW5kKF9pdGVtID0+IF9pdGVtLmxhYmVsID09IF9sYWJlbCkudmlzaWJsZSA9IHRydWUpO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS52YXJpYWJsZXMgfHwgZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTikpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS5tdHhMb2NhbCB8fCBmb2N1cyA9PSB0aGlzLmRhdGEubXR4V29ybGQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgIT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9wdXApXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUztcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgUHJvcGVydHlcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSksXHJcbiAgICAgICAgc3VibWVudTogZ2VuZXJhdGVTdWJNZW51KG9wdGlvbnMsIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIFZhbHVlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIEZ1bmN0aW9uXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIENvZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBUcmFuc2Zvcm1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSxcclxuICAgICAgICBzdWJtZW51OiBnZW5lcmF0ZVN1Yk1lbnUoW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0sIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdWJNZW51KF9vcHRpb25zOiBzdHJpbmdbXSwgX2lkOiBzdHJpbmcsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIF9vcHRpb25zLmZvckVhY2goX29wdGlvbiA9PiB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBfb3B0aW9uLCBpZDogX2lkLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAgICAgc3VibWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdWJtZW51O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBmb2N1czogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZTtcclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFk6XHJcbiAgICAgICAgICBjaGlsZCA9IFtdO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IHZhbHVlOiAxIH07XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT046XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgZnVuY3Rpb246IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTi5BRERJVElPTiwgcGFyYW1ldGVyczogW10gfTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IGNvZGU6IFwiMVwiIH07XHJcblxyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpXHJcbiAgICAgICAgICAgIGZvY3VzLnBhcmFtZXRlcnMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvY3VzW19pdGVtLmxhYmVsXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICBpZiAoX2l0ZW0ubGFiZWwgPT0gXCJ2YXJpYWJsZXNcIilcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZXMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5wdXNoKHRoaXMuY29udHJvbGxlci5nZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuY29sb3IucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGlsZFRvUGFyZW50LnNldChjaGlsZCwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OOlxyXG4gICAgICAgICAgY2hpbGQgPSB7IHRyYW5zZm9ybWF0aW9uOiA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2l0ZW0ubGFiZWwsIHBhcmFtZXRlcnM6IFtdIH07XHJcbiAgICAgICAgICAoPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltdPmZvY3VzKS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hpbGRUb1BhcmVudC5zZXQoY2hpbGQsIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBOlxyXG4gICAgICAgICAgbGV0IHJlbW92ZTogxpIuU2VyaWFsaXphdGlvbltdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5kZWxldGUocmVtb3ZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSk/LnBhcnRpY2xlU3lzdGVtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtID0gPMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtPig8xpIuTm9kZT5fdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXSkuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtKTtcclxuICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGU7XHJcbiAgICAgIHRoaXMuc2V0VGltZSgwKTtcclxuICAgICAgdGhpcy5zZXRQYXJ0aWNsZVN5c3RlbSh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnBhcnRpY2xlU3lzdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnRvb2xiYXJJbnRlcnZhbElkKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgICAgICB0aGlzLmVuYWJsZVNhdmUodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMCAmJiBfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuUyAmJiBfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgxpJ1aS5XYXJuaW5nLmRpc3BsYXkodGhpcy5lcnJvcnMubWFwKChbX2RhdGEsIF9lcnJvcl0pID0+IF9lcnJvciksIFwiVW5hYmxlIHRvIHNhdmVcIiwgYFByb2plY3QgY2FuJ3QgYmUgc2F2ZWQgd2hpbGUgaGF2aW5nIHVucmVzb2x2ZWQgZXJyb3JzYCwgXCJPS1wiKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShfZXZlbnQuZGV0YWlsLmRhdGEpPy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ1JFQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkRST1A6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkNVVDogLy8gVE9ETzogY3VzdG9tcyB0cmVlcyBjdXQgaXMgYXN5bmMsIHRoaXMgc2hvdWxkIGhhcHBlbiBhZnRlciBjdXQgaXMgZmluaXNoZWRcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hWYXJpYWJsZXMoKTtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgICAgbGV0IGludmFsaWQ6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gdGhpcy52YWxpZGF0ZURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoX2Vycm9yID0+ICFpbnZhbGlkLmluY2x1ZGVzKF9lcnJvcikpXHJcbiAgICAgICAgICAgIC5tYXAoKFtfZGF0YV0pID0+IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSkpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKF9pdGVtID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIV9pdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgX2l0ZW0uY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIik7XHJcbiAgICAgICAgICAgICAgX2l0ZW0udGl0bGUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzID0gaW52YWxpZDtcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCAmJiBfZXZlbnQudHlwZSAhPSDGknVpLkVWRU5ULkVYUEFORCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLmRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpOyAvLyBvdXIgd29ya2luZyBjb3B5IHNob3VsZCBvbmx5IGJlIHVzZWQgaWYgaXQgaXMgdmFsaWQgXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5mb3JFYWNoKChbX2RhdGEsIF9lcnJvcl0pID0+IHtcclxuICAgICAgICAgICAgICBsZXQgaXRlbTogxpJ1aS5DdXN0b21UcmVlSXRlbTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSk7XHJcbiAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKTtcclxuICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gX2Vycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZW5hYmxlU2F2ZSh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiB0b29sYmFyXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRvb2xiYXIoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudG9vbGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMudG9vbGJhci5pZCA9IFwidG9vbGJhclwiO1xyXG4gICAgICB0aGlzLnRvb2xiYXIudGl0bGUgPSBcIuKXjyBDb250cm9sIHRoZSBwbGF5YmFjayBvZiB0aGUgc2VsZWN0ZWQgcGFydGljbGUgc3lzdGVtXFxu4pePIFJpZ2h0IGNsaWNrIHJlbmRlciB2aWV3IHRvIGFjdGl2YXRlIGNvbnRpbm91cyByZW5kZXJpbmdcIjtcclxuXHJcbiAgICAgIGxldCBidXR0b25zOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGJ1dHRvbnMuaWQgPSBcImJ1dHRvbnNcIjtcclxuICAgICAgW1wiYmFja3dhcmRcIiwgXCJwbGF5XCIsIFwiZm9yd2FyZFwiXVxyXG4gICAgICAgIC5tYXAoX2lkID0+IHtcclxuICAgICAgICAgIGxldCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5pZCA9IF9pZDtcclxuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uSWNvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGltZVNjYWxlOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZTtcclxuICAgICAgICAgICAgc3dpdGNoICgoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuaWQpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwiYmFja3dhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSAtPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlID0gdGhpcy50aW1lU2NhbGVQbGF5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSB0aW1lU2NhbGU7XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcImZvcndhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSArPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGUpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IGJ1dHRvbnMuYXBwZW5kQ2hpbGQoX2J1dHRvbikpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNjYWxlU3RlcHBlcjogxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlciA9IG5ldyDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKHsga2V5OiBcInRpbWVTY2FsZVwiLCBsYWJlbDogXCJ0aW1lU2NhbGVcIiB9KTtcclxuICAgICAgdGltZVNjYWxlU3RlcHBlci5pZCA9IFwidGltZXNjYWxlXCI7XHJcbiAgICAgIHRpbWVTY2FsZVN0ZXBwZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTY2FsZVN0ZXBwZXIpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTdGVwcGVyOiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyID0gbmV3IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIoeyBrZXk6IFwidGltZVwiLCBsYWJlbDogXCJ0aW1lXCIsIHZhbHVlOiBcIjBcIiB9KTtcclxuICAgICAgdGltZVN0ZXBwZXIuaWQgPSBcInRpbWVcIjtcclxuICAgICAgdGltZVN0ZXBwZXIudGl0bGUgPSBcIlRoZSB0aW1lIChpbiBzZWNvbmRzKSBvZiB0aGUgcGFydGljbGUgc3lzdGVtXCI7XHJcbiAgICAgIHRpbWVTdGVwcGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTdGVwcGVyKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU2xpZGVyU3RlcHM6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGltZVNsaWRlclN0ZXBzLmlkID0gXCJ0aW1lc2xpZGVyc3RlcHNcIjtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXJTdGVwcyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGltZVNsaWRlci5pZCA9IFwidGltZXNsaWRlclwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5tYXggPSBcIjFcIjtcclxuICAgICAgdGltZVNsaWRlci5zdGVwID0gXCJhbnlcIjtcclxuICAgICAgdGltZVNsaWRlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZShwYXJzZUZsb2F0KHRpbWVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXIpO1xyXG5cclxuICAgICAgdGhpcy50b29sYmFySW50ZXJ2YWxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY21wUGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICAgIGxldCB0aW1lSW5TZWNvbmRzOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWUgLyAxMDAwO1xyXG4gICAgICAgICAgdGltZVNjYWxlU3RlcHBlci5zZXRNdXRhdG9yVmFsdWUodGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGUpO1xyXG4gICAgICAgICAgdGltZVN0ZXBwZXIuc2V0TXV0YXRvclZhbHVlKHRpbWVJblNlY29uZHMpO1xyXG5cclxuICAgICAgICAgIGxldCBkdXJhdGlvbjogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS5kdXJhdGlvbiAvIDEwMDA7XHJcbiAgICAgICAgICBpZiAocGFyc2VGbG9hdCh0aW1lU2xpZGVyLm1heCkgIT0gZHVyYXRpb24gKiAxLjEpIHsgLy8gdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAgICAgICAgdGltZVNsaWRlci5tYXggPSAoZHVyYXRpb24gKiAxLjEpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRpbWVTbGlkZXJTdGVwcy5pbm5lckhUTUwgPSBbMCwgMC4yNSwgMC41LCAwLjc1LCAxXVxyXG4gICAgICAgICAgICAgIC5tYXAoX2ZhY3RvciA9PiBkdXJhdGlvbiAqIF9mYWN0b3IpXHJcbiAgICAgICAgICAgICAgLm1hcChfdmFsdWUgPT4gYDxzcGFuIGRhdGEtbGFiZWw9XCIke192YWx1ZS50b0ZpeGVkKDIpfVwiPjwvc3Bhbj5gKS5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGltZVNsaWRlci52YWx1ZSA9IHRpbWVJblNlY29uZHMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUaW1lKF90aW1lSW5TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZXRUaW1lU2NhbGUoMCk7XHJcbiAgICAgIHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZSA9IF90aW1lSW5TZWNvbmRzICogMTAwMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFRpbWVTY2FsZShfdGltZVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX3RpbWVTY2FsZSA9IHBhcnNlRmxvYXQoX3RpbWVTY2FsZS50b0ZpeGVkKDE1KSk7IC8vIHJvdW5kIHNvIGZvcndhcmQgYW5kIGJhY2t3YXJkIGJ1dHRvbiBkb24ndCBtaXNzIHplcm9cclxuICAgICAgaWYgKF90aW1lU2NhbGUgIT0gMClcclxuICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSBfdGltZVNjYWxlO1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZSA9IF90aW1lU2NhbGU7XHJcblxyXG4gICAgICBsZXQgcGxheUJ1dHRvbjogRWxlbWVudCA9IHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BsYXlcIikgfHwgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIik7XHJcbiAgICAgIHBsYXlCdXR0b24uaWQgPSBfdGltZVNjYWxlID09IDAgPyBcInBsYXlcIiA6IFwicGF1c2VcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHNldFBhcnRpY2xlU3lzdGVtKF9wYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0pOiB2b2lkIHtcclxuICAgICAgaWYgKCFfcGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMudHJlZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgcGFydGljbGUgc3lzdGVtIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IF9wYXJ0aWNsZVN5c3RlbTtcclxuICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShfcGFydGljbGVTeXN0ZW0uZGF0YSkpOyAvLyB3ZSB3aWxsIHdvcmsgd2l0aCBhIGNvcHlcclxuICAgICAgdGhpcy5zZXRUaXRsZSh0aGlzLnBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKTtcclxuICAgICAgdGhpcy52YXJpYWJsZXMuaWQgPSBcInZhcmlhYmxlc1wiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZhcmlhYmxlcyk7XHJcbiAgICAgIHRoaXMucmVmcmVzaFZhcmlhYmxlcygpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSh0aGlzLmRhdGEsIHRoaXMpO1xyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJ1aS5DdXN0b21UcmVlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+KHRoaXMuY29udHJvbGxlciwgdGhpcy5kYXRhKTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ1VULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5QQVNURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGDil48gUmlnaHQgY2xpY2sgb24gXCIke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9XCIgdG8gYWRkIHByb3BlcnRpZXMuXFxu4pePIFJpZ2h0IGNsaWNrIG9uIHByb3BlcnRpZXMgdG8gYWRkIHRyYW5zZm9ybWF0aW9ucy9leHByZXNzaW9ucy5cXG7il48gUmlnaHQgY2xpY2sgb24gdHJhbnNmb3JtYXRpb25zL2V4cHJlc3Npb25zIHRvIGFkZCBleHByZXNzaW9ucy5cXG7il48gVXNlIENvcHkvQ3V0L1Bhc3RlIHRvIGR1cGxpY2F0ZSBkYXRhLmA7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IHRoaXMuZG9tLnRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10ge1xyXG4gICAgICBsZXQgaW52YWxpZDogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10gPSBbXTtcclxuICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gaW52YWxpZDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVjdXJzaXZlKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfcGF0aDogc3RyaW5nW10gPSBbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICAgIGxldCBtaW5QYXJhbWV0ZXJzOiBudW1iZXIgPSDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT05fTUlOSU1VTV9QQVJBTUVURVJTW19kYXRhLmZ1bmN0aW9uXTtcclxuICAgICAgICAgIGlmIChfZGF0YS5wYXJhbWV0ZXJzLmxlbmd0aCA8IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTl9NSU5JTVVNX1BBUkFNRVRFUlNbX2RhdGEuZnVuY3Rpb25dKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvcjogc3RyaW5nID0gYFwiJHtfcGF0aC5qb2luKFwiL1wiKX0vJHtfZGF0YS5mdW5jdGlvbn1cIiBuZWVkcyBhdCBsZWFzdCAke21pblBhcmFtZXRlcnN9IHBhcmFtZXRlcnNgO1xyXG4gICAgICAgICAgICBpbnZhbGlkLnB1c2goW19kYXRhLCBlcnJvcl0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhKS5mb3JFYWNoKChbX2tleSwgX3ZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBfdmFsdWUgPT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX3ZhbHVlLCBfcGF0aC5jb25jYXQoX2tleSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVTYXZlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICByZW1vdGUuTWVudS5nZXRBcHBsaWNhdGlvbk1lbnUoKS5nZXRNZW51SXRlbUJ5SWQoTUVOVS5QUk9KRUNUX1NBVkUpLmVuYWJsZWQgPSBfb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWZyZXNoVmFyaWFibGVzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpO1xyXG4gICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICBvcHRpb25zLnB1c2goLi4udGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMpO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcy5pbm5lckhUTUwgPSBvcHRpb25zLm1hcChfbmFtZSA9PiBgPG9wdGlvbiB2YWx1ZT1cIiR7X25hbWV9XCI+YCkuam9pbihcIlwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCB0aGUgYW5pbWF0YWJsZSBwcm9wZXJ0aWVzIG9mIGEgbm9kZSB3aXRoIGFuIGF0dGFjaGVkIGNvbXBvbmVudCBhbmltYXRpb24uXHJcbiAgICogQGF1dGhvcnMgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjIgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwdWJsaWMga2V5U2VsZWN0ZWQ6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgY21wQW5pbWF0b3I6IMaSLkNvbXBvbmVudEFuaW1hdG9yO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlckFuaW1hdGlvbjtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBmcmFtZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgdGltZTogxpIuVGltZSA9IG5ldyDGki5UaW1lKCk7XHJcbiAgICBwcml2YXRlIGlkSW50ZXJ2YWw6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldEFuaW1hdGlvbihudWxsKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULklOUFVULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkZPQ1VTX0lOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogPMaSLk5vZGU+c291cmNlIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoaXMubm9kZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgICAgbGFiZWw6IFwiQWRkIFByb3BlcnR5XCIsXHJcbiAgICAgICAgICBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KHRoaXMubm9kZSwgcGF0aCwgX2NhbGxiYWNrKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZSBQcm9wZXJ0eVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QUk9QRVJUWSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDb252ZXJ0IHRvIEFuaW1hdGlvblwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNPTlZFUlRfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiQ1wiIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZOlxyXG4gICAgICAgICAgLy8gZGVmaW5lZCBpbiBnZXRNdXRhdG9yU3VibWVudSwgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSB3YXkgdG8ga2VlcCB0aGUgcGF0aCBhc3NvY2lhdGVkIHdpdGggdGhlIG1lbnUgaXRlbSwgYXR0YWNoaW5nIGFueXRoaW5nIHRvIGl0ZW1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX1BST1BFUlRZOlxyXG4gICAgICAgICAgaWYgKCEoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRlbGV0ZVByb3BlcnR5KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DT05WRVJUX0FOSU1BVElPTjpcclxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbi5jb252ZXJ0VG9BbmltYXRpb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYW5pbWF0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm9kZVN1Ym1lbnUoX25vZGU6IMaSLk5vZGUsIF9wYXRoOiBzdHJpbmdbXSwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChjb25zdCBjb21wb25lbnRDbGFzcyBvZiDGki5Db21wb25lbnQuc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIF9ub2RlLmdldENvbXBvbmVudHMoY29tcG9uZW50Q2xhc3MpLmZvckVhY2goKF9jb21wb25lbnQsIF9pbmRleCkgPT4geyAvLyB3ZSBuZWVkIHRvIGdldCB0aGUgYXR0YWNoZWQgY29tcG9ubmVudHMgYXMgYXJyYXkgc28gd2UgY2FuIHJlY29uc3R1Y3QgdGhlaXIgcGF0aFxyXG4gICAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICAgIHBhdGgucHVzaChfY29tcG9uZW50LnR5cGUpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKF9pbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX2NvbXBvbmVudC5nZXRNdXRhdG9yRm9yQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAobXV0YXRvciAmJiBPYmplY3Qua2V5cyhtdXRhdG9yKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgICAgeyBsYWJlbDogX2NvbXBvbmVudC50eXBlLCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KG11dGF0b3IsIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBfbm9kZS5nZXRDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChcImNoaWxkcmVuXCIpO1xyXG4gICAgICAgIHBhdGgucHVzaChjaGlsZC5uYW1lKTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICB7IGxhYmVsOiBjaGlsZC5uYW1lLCBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KGNoaWxkLCBwYXRoLCBfY2FsbGJhY2spIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfcGF0aDogc3RyaW5nW10sIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBfbXV0YXRvcltwcm9wZXJ0eV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgICB7IGxhYmVsOiBwcm9wZXJ0eSwgc3VibWVudTogdGhpcy5nZXRNdXRhdG9yU3VibWVudShfbXV0YXRvcltwcm9wZXJ0eV0sIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogcHJvcGVydHksIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZKSwgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hZGRQcm9wZXJ0eShwYXRoLCB0aGlzLm5vZGUsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVG9vbGJhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy50b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy50b29sYmFyLmlkID0gXCJ0b29sYmFyXCI7XHJcblxyXG4gICAgICBbXCJwcmV2aW91c1wiLCBcInBsYXlcIiwgXCJuZXh0XCJdXHJcbiAgICAgICAgLm1hcChfaWQgPT4ge1xyXG4gICAgICAgICAgbGV0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgYnV0dG9uLmlkID0gX2lkO1xyXG4gICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IFwiYnV0dG9uSWNvblwiO1xyXG4gICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSB0aGlzLmhuZFRvb2xiYXJDbGljaztcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZChfYnV0dG9uKSk7XHJcblxyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0Lm1pbiA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuaWQgPSBcImZyYW1laW5wdXRcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoX2V2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5mcmFtZUlucHV0LnZhbHVlKSAqIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGhpcy5mcmFtZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiDGki5BbmltYXRpb25LZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTZWxlY3RlZCA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNtcEFuaW1hdG9yID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbiAhPSB0aGlzLmFuaW1hdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbih0aGlzLmNtcEFuaW1hdG9yPy5hbmltYXRpb24pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubXV0YWJsZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEFuaW1hdG9yKSB7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaGVkIGFuaW1hdGlvbiBpbiBhIENvbXBvbmVudEFuaW1hdG9yXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgPT0gX2V2ZW50LmRldGFpbC5tdXRhYmxlLm5vZGUpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBub2RlOiBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSB9IH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uIHx8IF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uU2hlZXQpXHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLmZyYW1lSW5wdXQudmFsdWUgPSAoTWF0aC50cnVuYyh0aGlzLnBsYXliYWNrVGltZSAvIDEwMDAgKiB0aGlzLmFuaW1hdGlvbi5mcHMpKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5jbXBBbmltYXRvcj8udXBkYXRlQW5pbWF0aW9uKHRoaXMucGxheWJhY2tUaW1lKSB8fCB7fTtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlcj8udXBkYXRlKG5vZGVNdXRhdG9yLCB0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuSU5QVVQ6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkZPQ1VTX0lOOlxyXG4gICAgICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnREaWdpdClcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlU2VxdWVuY2UodGhpcy5wbGF5YmFja1RpbWUsIHRhcmdldCwgX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5JTlBVVCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0QW5pbWF0aW9uKF9hbmltYXRpb246IMaSLkFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICBpZiAoX2FuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgYW5pbWF0aW9uIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eUxpc3QoKTogdm9pZCB7XHJcbiAgICAgIGxldCBub2RlTXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMuYW5pbWF0aW9uLmdldFN0YXRlKHRoaXMucGxheWJhY2tUaW1lLCAwLCB0aGlzLmNtcEFuaW1hdG9yLnF1YW50aXphdGlvbikgfHwge307XHJcblxyXG4gICAgICBsZXQgbmV3UHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudCA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKG5vZGVNdXRhdG9yKTtcclxuICAgICAgaWYgKHRoaXMuZG9tLmNvbnRhaW5zKHRoaXMucHJvcGVydHlMaXN0KSlcclxuICAgICAgICB0aGlzLmRvbS5yZXBsYWNlQ2hpbGQobmV3UHJvcGVydHlMaXN0LCB0aGlzLnByb3BlcnR5TGlzdCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdQcm9wZXJ0eUxpc3QpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdCA9IG5ld1Byb3BlcnR5TGlzdDtcclxuICAgICAgdGhpcy5wcm9wZXJ0eUxpc3QuaWQgPSBcInByb3BlcnR5bGlzdFwiO1xyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJBbmltYXRpb24odGhpcy5hbmltYXRpb24sIHRoaXMucHJvcGVydHlMaXN0LCB0aGlzKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnVwZGF0ZShub2RlTXV0YXRvcik7XHJcbiAgICAgIC8vIMaSdWktRVZFTlQgbXVzdCBub3QgYmUgZGlzcGF0Y2hlZCFcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJ1aS5FVkVOVC5DTElDSykpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMucGxheWJhY2tUaW1lIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb29sYmFyQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKHRhcmdldC5pZCkge1xyXG4gICAgICAgIGNhc2UgXCJwcmV2aW91c1wiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJiYWNrd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXlcIjpcclxuICAgICAgICAgIGlmICh0aGlzLmlkSW50ZXJ2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0YXJnZXQuaWQgPSBcInBhdXNlXCI7XHJcbiAgICAgICAgICAgIHRoaXMudGltZS5zZXQodGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy50aW1lLmdldCgpICUgdGhpcy5hbmltYXRpb24udG90YWxUaW1lO1xyXG4gICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDAwIC8gdGhpcy5hbmltYXRpb24uZnBzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJwYXVzZVwiOlxyXG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm5leHRcIjpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5jb250cm9sbGVyLm5leHRLZXkodGhpcy5wbGF5YmFja1RpbWUsIFwiZm9yd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYXVzZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgIHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BhdXNlXCIpLmlkID0gXCJwbGF5XCI7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gU0hFRVRfTU9ERSB7XHJcbiAgICBET1BFID0gXCJEb3Blc2hlZXRcIixcclxuICAgIENVUlZFUyA9IFwiQ3VydmVzXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgVmlld0FuaW1hdGlvblNlcXVlbmNlIHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvblNlcXVlbmNlO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uS2V5IHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBwYXRoMkQ6IFBhdGgyRDtcclxuICAgIHR5cGU6IFwia2V5XCI7XHJcbiAgfVxyXG5cclxuICBpbnRlcmZhY2UgVmlld0FuaW1hdGlvbkV2ZW50IHsgLy8gbGFiZWxzIGFuZCBldmVudHMgYXJlIGltcGxlbWVudGVkIGFsbW9zdCB0aGUgc2FtZSB3YXlcclxuICAgIGRhdGE6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJldmVudFwiIHwgXCJsYWJlbFwiO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhbmltYXRpb24gc2VxdWVuY2VzLCBhbmltYXRpb24ga2V5cyBhbmQgY3VydmVzIGNvbm5lY3RpbmcgdGhlbS5cclxuICAgKiBAYXV0aG9ycyBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uU2hlZXQgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEtFWV9TSVpFOiBudW1iZXIgPSA2OyAvLyB3aWR0aCBhbmQgaGVpZ2h0IGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUSU1FTElORV9IRUlHSFQ6IG51bWJlciA9IDMwLjU7IC8vIGluIHB4LCBrZWVwIC41IGF0IGVuZCBmb3Igb2RkIGxpbmUgd2lkdGhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVWRU5UU19IRUlHSFQ6IG51bWJlciA9IDMwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU0NBTEVfV0lEVEg6IG51bWJlciA9IDQwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX01JTExJU0VDT05EOiBudW1iZXIgPSAxOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBJWEVMX1BFUl9WQUxVRTogbnVtYmVyID0gMTAwOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IE1JTklNVU1fUElYRUxfUEVSX1NURVA6IG51bWJlciA9IDYwOyAvLyBhdCBhbnkgc2NhbGluZywgZm9yIGJvdGggeCBhbmQgeVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU1RBTkRBUkRfQU5JTUFUSU9OX0xFTkdUSDogbnVtYmVyID0gMTAwMDsgLy8gaW4gbWlsaXNlY29uZHMsIHVzZWQgd2hlbiBhbmltYXRpb24gbGVuZ3RoIGlzIGZhbHN5XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICBwcml2YXRlIGNyYzI6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHByaXZhdGUgZXZlbnRJbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwcml2YXRlIHNjcm9sbEJvZHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgbXR4V29ybGRUb1NjcmVlbjogxpIuTWF0cml4M3gzID0gbmV3IMaSLk1hdHJpeDN4MygpO1xyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRLZXk6IFZpZXdBbmltYXRpb25LZXk7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudDtcclxuICAgIHByaXZhdGUga2V5czogVmlld0FuaW1hdGlvbktleVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10gPSBbXTtcclxuICAgIHByaXZhdGUgZXZlbnRzOiBWaWV3QW5pbWF0aW9uRXZlbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzbG9wZUhvb2tzOiBQYXRoMkRbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZG9jdW1lbnRTdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NQYW5TdGFydDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcbiAgICBwcml2YXRlIHBvc1JpZ2h0Q2xpY2s6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMigpO1xyXG5cclxuICAgICNtb2RlOiBTSEVFVF9NT0RFO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBtYXliZSB1c2UgdGhpcyBzb2x1dGlvbiBmb3IgYWxsIHZpZXdzP1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaW5zZXQgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUubWFyZ2luID0gXCIwLjVlbVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcblxyXG4gICAgICB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEU7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsICgpID0+IHRoaXMuZHJhdyh0cnVlKSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnVTaGVldCk7XHJcblxyXG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1ggPSBcInNjcm9sbFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiaW5zdGFudFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJkb3duID0gdGhpcy5obmRQb2ludGVyRG93bjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVydXAgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybGVhdmUgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub253aGVlbCA9IHRoaXMuaG5kV2hlZWw7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQ29udGFpbmVyKTtcclxuXHJcbiAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS5oZWlnaHQgPSBcIjFweFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbEJvZHkpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudElucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRJbnB1dC5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIpIHtcclxuICAgICAgICAgIGxldCB0aW1lOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5ldmVudHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uc2V0RXZlbnQodGhpcy5ldmVudElucHV0LnZhbHVlLCB0aW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLmV2ZW50SW5wdXQudmFsdWVdID0gdGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEgPSB0aGlzLmV2ZW50SW5wdXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZXZlbnRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgbW9kZSgpOiBTSEVFVF9NT0RFIHtcclxuICAgICAgcmV0dXJuIHRoaXMuI21vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgbW9kZShfbW9kZTogU0hFRVRfTU9ERSkge1xyXG4gICAgICB0aGlzLiNtb2RlID0gX21vZGU7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoX21vZGUpO1xyXG4gICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudVNoZWV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSBmYWxzZSk7XHJcbiAgICAgIGlmICh0aGlzLnBvc1JpZ2h0Q2xpY2sueSA+IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgJiYgdGhpcy5wb3NSaWdodENsaWNrLnkgPCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHsgLy8gY2xpY2sgb24gZXZlbnRzXHJcbiAgICAgICAgbGV0IGRlbGV0ZUV2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPVxyXG4gICAgICAgICAgdGhpcy5ldmVudHMuZmluZChfb2JqZWN0ID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9vYmplY3QucGF0aDJELCB0aGlzLnBvc1JpZ2h0Q2xpY2sueCwgdGhpcy5wb3NSaWdodENsaWNrLnkpKTtcclxuICAgICAgICBpZiAoZGVsZXRlRXZlbnQpIHtcclxuICAgICAgICAgIGlmIChkZWxldGVFdmVudC50eXBlID09IFwiZXZlbnRcIilcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiLCBkZWxldGVFdmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiQWRkIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIiwgdGhpcy5zY3JlZW5Ub1RpbWUodGhpcy5wb3NSaWdodENsaWNrLngpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IHRoaXMua2V5cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmICh0YXJnZXRLZXkpIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIEtleVwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIsIHRhcmdldEtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuRE9QRSkudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkRPUEU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTSEVFVF9NT0RFLkNVUlZFUykudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuXHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5ET1BFLCBsYWJlbDogU0hFRVRfTU9ERS5ET1BFLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5ET1BFIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5DVVJWRVMsIGxhYmVsOiBTSEVFVF9NT0RFLkNVUlZFUywgY2xpY2s6ICgpID0+IHRoaXMubW9kZSA9IFNIRUVUX01PREUuQ1VSVkVTIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgRXZlbnRcIiwgbGFiZWw6IFwiQWRkIEV2ZW50XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBFdmVudFwiLCBsYWJlbDogXCJEZWxldGUgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiQWRkIExhYmVsXCIsIGxhYmVsOiBcIkFkZCBMYWJlbFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJEZWxldGUgTGFiZWxcIiwgbGFiZWw6IFwiRGVsZXRlIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBLZXlcIiwgbGFiZWw6IFwiRGVsZXRlIEtleVwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgY2hvaWNlOiBzdHJpbmcgPSBfaXRlbS5pZDtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG5cclxuICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIpO1xyXG4gICAgICBsZXQgdGFyZ2V0RXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0RXZlbnRcIik7XHJcbiAgICAgIGxldCB0YXJnZXRUaW1lOiBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgXCJBZGQgRXZlbnRcIjpcclxuICAgICAgICAgIGxldCBldmVudE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9RXZlbnQke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudChldmVudE5hbWUsIHRhcmdldFRpbWUpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBldmVudE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJldmVudFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgRXZlbnRcIjpcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50KHRhcmdldEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQWRkIExhYmVsXCI6XHJcbiAgICAgICAgICBsZXQgbGFiZWxOYW1lOiBzdHJpbmcgPSBgJHt0aGlzLmFuaW1hdGlvbi5uYW1lfUxhYmVsJHtPYmplY3Qua2V5cyh0aGlzLmFuaW1hdGlvbi5ldmVudHMpLmxlbmd0aH1gO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsTmFtZV0gPSB0YXJnZXRUaW1lO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBsYWJlbE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJsYWJlbFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgTGFiZWxcIjpcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGFyZ2V0RXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgS2V5XCI6XHJcbiAgICAgICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gdGhpcy5zZXF1ZW5jZXMuZmluZChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpLmluY2x1ZGVzKHRhcmdldEtleS5kYXRhKSkuZGF0YTtcclxuICAgICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIMaSLkRlYnVnLndhcm4oXCJPbmx5IG9uZSBrZXkgbGVmdCBpbiBzZXF1ZW5jZS4gRGVsZXRlIHByb3BlcnR5IGluc3RlYWQuXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlcXVlbmNlLnJlbW92ZUtleSh0YXJnZXRLZXkuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZHJhd2luZ1xyXG4gICAgcHJpdmF0ZSBkcmF3KF9zY3JvbGw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuZG9tLmNsaWVudFdpZHRoO1xyXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRvbS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb247XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1pbihWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgsIHRyYW5zbGF0aW9uLngpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVLZXlzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGltZWxpbmUoKTtcclxuICAgICAgICB0aGlzLmRyYXdFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmRyYXdTY2FsZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnZlcygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0tleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdDdXJzb3IoKTtcclxuICAgICAgICB0aGlzLmRyYXdIaWdobGlnaHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9zY3JvbGwpIHtcclxuICAgICAgICBsZXQgbGVmdFdpZHRoOiBudW1iZXIgPSAtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEg7XHJcbiAgICAgICAgbGV0IHNjcmVlbldpZHRoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy53aWR0aCArIGxlZnRXaWR0aDtcclxuICAgICAgICBsZXQgYW5pbWF0aW9uV2lkdGg6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIICogMjtcclxuICAgICAgICB0aGlzLnNjcm9sbEJvZHkuc3R5bGUud2lkdGggPSBgJHtNYXRoLm1heChhbmltYXRpb25XaWR0aCwgc2NyZWVuV2lkdGgpfXB4YDtcclxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gbGVmdFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUtleXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMua2V5cyA9IHRoaXMuc2VxdWVuY2VzLmZsYXRNYXAoKF9zZXF1ZW5jZSwgX2lTZXF1ZW5jZSkgPT5cclxuICAgICAgICBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkubWFwKChfa2V5KSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld0tleTogVmlld0FuaW1hdGlvbktleSA9IHtcclxuICAgICAgICAgICAgZGF0YTogX2tleSxcclxuICAgICAgICAgICAgY29sb3I6IF9zZXF1ZW5jZS5jb2xvcixcclxuICAgICAgICAgICAgcGF0aDJEOiB0aGlzLmdlbmVyYXRlS2V5KFxyXG4gICAgICAgICAgICAgIHRoaXMud29ybGRUb1NjcmVlblBvaW50KF9rZXkudGltZSwgdGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTID8gX2tleS52YWx1ZSA6IF9pU2VxdWVuY2UgKiBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgKiA0KSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsXHJcbiAgICAgICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIHR5cGU6IFwia2V5XCJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gdmlld0tleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEtleSlcclxuICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEtleS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5KF9wb3NpdGlvbjogxpIuVmVjdG9yMiwgX3c6IG51bWJlciwgX2g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIHBhdGgubW92ZVRvKF9wb3NpdGlvbi54IC0gX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55ICsgX2gpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCArIF93LCBfcG9zaXRpb24ueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54LCBfcG9zaXRpb24ueSAtIF9oKTtcclxuICAgICAgcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3VGltZWxpbmUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgbGV0IGFuaW1hdGlvblN0YXJ0OiBudW1iZXIgPSBNYXRoLm1pbiguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgbGV0IGFuaW1hdGlvbkVuZDogbnVtYmVyID0gTWF0aC5tYXgoLi4udGhpcy5rZXlzLm1hcChfa2V5ID0+IF9rZXkuZGF0YS50aW1lKSkgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLng7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAxMDAsIDI1NSwgMC4yKVwiO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoYW5pbWF0aW9uU3RhcnQsIDAsIGFuaW1hdGlvbkVuZCAtIGFuaW1hdGlvblN0YXJ0LCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVUbyh0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IGZwczogbnVtYmVyID0gdGhpcy5hbmltYXRpb24uZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJGcmFtZTogbnVtYmVyID0gKDEwMDAgKiBWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX01JTExJU0VDT05EKSAvIGZwcztcclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJGcmFtZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLng7XHJcbiAgICAgIGxldCBmcmFtZXNQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgLy8gVE9ETzogZmluZCBhIHdheSB0byBkbyB0aGlzIHdpdGggTygxKTtcclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCAzLCAyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMjtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIGZyYW1lc1BlclN0ZXAgKj0gbXVsdGlwbGllcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBsZXQgaGlnaFN0ZXBzOiBudW1iZXIgPSAwOyAvLyBldmVyeSBudGggc3RlcCB3aWxsIGJlIGhpZ2hlclxyXG4gICAgICBpZiAoZnJhbWVzUGVyU3RlcCAhPSAxKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lc1BlclN0ZXAgPT0gNSkge1xyXG4gICAgICAgICAgc3ViU3RlcHMgPSA0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAyO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZ3JpZExpbmVzOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGxldCB0aW1lU3RlcHM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgICAgdGhpcy5jcmMyLmZvbnQgPSB0aGlzLmRvY3VtZW50U3R5bGUuZm9udDtcclxuXHJcbiAgICAgIGxldCBzdGVwczogbnVtYmVyID0gMSArIHRoaXMuY2FudmFzLndpZHRoIC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeFN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLmxpbmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuICAgICAgICBncmlkTGluZXMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICAgIGdyaWRMaW5lcy5saW5lVG8oeFN0ZXAsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IGlTdGVwICogZnJhbWVzUGVyU3RlcCAvIGZwcztcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFRleHQoXHJcbiAgICAgICAgICBgJHt0aW1lLnRvRml4ZWQoMil9YCxcclxuICAgICAgICAgIHhTdGVwICsgMyxcclxuICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAyMCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHhTdWJTdGVwOiBudW1iZXIgPSB4U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3ViU3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gKGlTdWJTdGVwICUgaGlnaFN0ZXBzID09IDAgPyAxMiA6IDgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGltZVN0ZXBzKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShncmlkTGluZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0V2ZW50cygpOiB2b2lkIHtcclxuICAgICAgbGV0IHRvdGFsSGVpZ2h0OiBudW1iZXIgPSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQ7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyAwLjUsIHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgdG90YWxIZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudHMgPSBbXTtcclxuICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbikgcmV0dXJuO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBsYWJlbCBpbiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsXSk7XHJcbiAgICAgICAgbGV0IHZpZXdMYWJlbDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBsYWJlbCwgcGF0aDJEOiBnZW5lcmF0ZUxhYmVsKHgpLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdMYWJlbCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3TGFiZWwucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBldmVudCBpbiB0aGlzLmFuaW1hdGlvbi5ldmVudHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24uZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgbGV0IHZpZXdFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBldmVudCwgcGF0aDJEOiBnZW5lcmF0ZUV2ZW50KHgpLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdFdmVudCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3RXZlbnQucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gdGhpcy5ldmVudHMuZmluZChfZXZlbnQgPT4gX2V2ZW50LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEV2ZW50Py5kYXRhKTtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRoaXMuc2VsZWN0ZWRFdmVudCA9PSBudWxsO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEV2ZW50LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiID8gdGhpcy5hbmltYXRpb24uZXZlbnRzIDogdGhpcy5hbmltYXRpb24ubGFiZWxzKVt0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyAxMn1weGA7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LmNsYXNzTmFtZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlO1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImxhYmVsXCIpXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVH1weGA7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgdGhpcy5ldmVudElucHV0LnN0eWxlLnRvcCA9IGAke1ZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCAvIDIgLSAyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQudmFsdWUgPSB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnNhdmUoKTtcclxuICAgICAgdGhpcy5jcmMyLnJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmNsaXAoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlRXZlbnQoX3g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQ7XHJcbiAgICAgICAgcGF0aC5tb3ZlVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMTYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVMYWJlbChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDIwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxNCk7XHJcbiAgICAgICAgLy8gcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIC8vIHBhdGguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdTY2FsZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUykgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNlbnRlcjogbnVtYmVyID0gdGhpcy5yb3VuZCh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgIGxldCBwaXhlbFBlclN0ZXA6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy55O1xyXG4gICAgICBsZXQgdmFsdWVQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMDtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIHZhbHVlUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdWJTdGVwczogbnVtYmVyID0gMDtcclxuICAgICAgc3dpdGNoIChpTXVsdGlwbGllcnMpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDE7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMuaGVpZ2h0IC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcigtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeVN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN0ZXApO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gLWlTdGVwICogdmFsdWVQZXJTdGVwO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIHZhbHVlUGVyU3RlcCA+PSAxID8gdmFsdWUudG9GaXhlZCgwKSA6IHZhbHVlLnRvRml4ZWQoMSksXHJcbiAgICAgICAgICAzMyxcclxuICAgICAgICAgIHlTdGVwKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHlTdWJTdGVwOiBudW1iZXIgPSB5U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubGluZVRvKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCAtIDUsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogYWRkIGNvcnJlY3QgZHJhd2luZyBmb3IgY29uc3RhbnQvc3RlcCBpbnRlcnBvbGF0ZWQga2V5c1xyXG4gICAgcHJpdmF0ZSBkcmF3Q3VydmVzKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHNlcXVlbmNlIG9mIHRoaXMuc2VxdWVuY2VzKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gc2VxdWVuY2UuY29sb3I7XHJcbiAgICAgICAgc2VxdWVuY2UuZGF0YS5nZXRLZXlzKClcclxuICAgICAgICAgIC5tYXAoKF9rZXksIF9pbmRleCwgX2tleXMpID0+IFtfa2V5LCBfa2V5c1tfaW5kZXggKyAxXV0pXHJcbiAgICAgICAgICAuZmlsdGVyKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gX2tleVN0YXJ0ICYmIF9rZXlFbmQpXHJcbiAgICAgICAgICAubWFwKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gZ2V0QmV6aWVyUG9pbnRzKF9rZXlTdGFydC5mdW5jdGlvbk91dCwgX2tleVN0YXJ0LCBfa2V5RW5kKSlcclxuICAgICAgICAgIC5mb3JFYWNoKChfYmV6aWVyUG9pbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gX3BvaW50LnRyYW5zZm9ybSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgICAgICAgbGV0IGN1cnZlOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgICAgICAgIGN1cnZlLm1vdmVUbyhfYmV6aWVyUG9pbnRzWzBdLngsIF9iZXppZXJQb2ludHNbMF0ueSk7XHJcbiAgICAgICAgICAgIGN1cnZlLmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1sxXS54LCBfYmV6aWVyUG9pbnRzWzFdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1syXS54LCBfYmV6aWVyUG9pbnRzWzJdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1szXS54LCBfYmV6aWVyUG9pbnRzWzNdLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gxpIuUmVjeWNsZXIuc3RvcmUoX3BvaW50KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0QmV6aWVyUG9pbnRzKF9hbmltYXRpb25GdW5jdGlvbjogxpIuQW5pbWF0aW9uRnVuY3Rpb24sIF9rZXlTdGFydDogxpIuQW5pbWF0aW9uS2V5LCBfa2V5RW5kOiDGki5BbmltYXRpb25LZXkpOiDGki5WZWN0b3IyW10ge1xyXG4gICAgICAgIGxldCBwYXJhbWV0ZXJzOiB7IGE6IG51bWJlcjsgYjogbnVtYmVyOyBjOiBudW1iZXI7IGQ6IG51bWJlciB9ID0gX2FuaW1hdGlvbkZ1bmN0aW9uLmdldFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjb25zdCBwb2xhckZvcm06ICh1OiBudW1iZXIsIHY6IG51bWJlciwgdzogbnVtYmVyKSA9PiBudW1iZXIgPSAoX3UsIF92LCBfdykgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5hICogX3UgKiBfdiAqIF93ICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5iICogKChfdiAqIF93ICsgX3cgKiBfdSArIF91ICogX3YpIC8gMykgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmMgKiAoKF91ICsgX3YgKyBfdykgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuZFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB4U3RhcnQ6IG51bWJlciA9IF9rZXlTdGFydC50aW1lO1xyXG4gICAgICAgIGxldCB4RW5kOiBudW1iZXIgPSBfa2V5RW5kLnRpbWU7XHJcbiAgICAgICAgbGV0IG9mZnNldFRpbWVFbmQ6IG51bWJlciA9IHhFbmQgLSB4U3RhcnQ7XHJcblxyXG4gICAgICAgIGxldCBwb2ludHM6IMaSLlZlY3RvcjJbXSA9IG5ldyBBcnJheSg0KS5maWxsKDApLm1hcCgoKSA9PiDGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMikpO1xyXG4gICAgICAgIHBvaW50c1swXS5zZXQoeFN0YXJ0LCBwb2xhckZvcm0oMCwgMCwgMCkpO1xyXG4gICAgICAgIHBvaW50c1sxXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDEgLyAzLCBwb2xhckZvcm0oMCwgMCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1syXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDIgLyAzLCBwb2xhckZvcm0oMCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1szXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCwgcG9sYXJGb3JtKG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0tleXMoKTogdm9pZCB7XHJcbiAgICAgIC8vIGRyYXcgdW5zZWxlY3RlZCBrZXlzXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSA0O1xyXG4gICAgICB0aGlzLmtleXMuZm9yRWFjaChfa2V5ID0+IHtcclxuICAgICAgICBpZiAoX2tleSA9PSB0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBfa2V5LmNvbG9yO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoX2tleS5wYXRoMkQpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsKF9rZXkucGF0aDJEKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNlbGVjdGVkIGtleVxyXG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLnNlbGVjdGVkS2V5LmNvbG9yO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHRoaXMuc2VsZWN0ZWRLZXkucGF0aDJEKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG5cclxuICAgICAgLy8gZHJhdyBzbG9wZSBob29rc1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmNyYzIuc3Ryb2tlU3R5bGU7XHJcblxyXG4gICAgICBsZXQgW2xlZnQsIHJpZ2h0XSA9IFvGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMiksIMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKV07XHJcbiAgICAgIGxlZnQuc2V0KC01MCwgMCk7XHJcbiAgICAgIHJpZ2h0LnNldCg1MCwgMCk7XHJcblxyXG4gICAgICBsZXQgYW5nbGVTbG9wZVNjcmVlbjogbnVtYmVyID0gTWF0aC5hdGFuKHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZUluICogKHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnkgLyB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54KSkgKiAoMTgwIC8gTWF0aC5QSSk7IC8vIGluIGRlZ3JlZVxyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnRyYW5zbGF0ZSh0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIG10eFRyYW5zZm9ybS5yb3RhdGUoYW5nbGVTbG9wZVNjcmVlbik7XHJcbiAgICAgIGxlZnQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcbiAgICAgIHJpZ2h0LnRyYW5zZm9ybShtdHhUcmFuc2Zvcm0pO1xyXG5cclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8obGVmdC54LCBsZWZ0LnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhyaWdodC54LCByaWdodC55KTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShwYXRoKTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzID0gW3RoaXMuZ2VuZXJhdGVLZXkobGVmdCwgNSwgNSksIHRoaXMuZ2VuZXJhdGVLZXkocmlnaHQsIDUsIDUpXTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzLmZvckVhY2goX2hvb2sgPT4gdGhpcy5jcmMyLmZpbGwoX2hvb2spKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKGxlZnQpO1xyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShyaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3Q3Vyc29yKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNyYzIucmVzdG9yZSgpO1xyXG4gICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICBsZXQgY3Vyc29yOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGN1cnNvci5tb3ZlVG8oeCwgMCk7XHJcbiAgICAgIGN1cnNvci5saW5lVG8oeCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoY3Vyc29yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdIaWdobGlnaHQoKTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHBvc1NjcmVlbjogxpIuVmVjdG9yMiA9IHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjY2XCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChwb3NTY3JlZW4ueCAtIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAvIDIsIDAsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjI2XCI7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgcG9zU2NyZWVuLngsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgPT0gdGhpcylcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubm9kZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2V2ZW50LmRldGFpbC5ub2RlPy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb247XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB0aGlzLnJlc2V0Vmlldyk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uPy5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7IHRoaXMuYW5pbWF0ZSgpOyB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gX2V2ZW50LmRldGFpbC5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJEb3duID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5mb2N1cygpO1xyXG4gICAgICBjb25zdCBmaW5kT2JqZWN0OiAoX29iamVjdDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCkgPT4gYm9vbGVhbiA9IF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmJ1dHRvbnMpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50Lm9mZnNldFkgPiAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmNsaWVudEhlaWdodCkgLy8gY2xpY2tlZCBvbiBzY3JvbGwgYmFyXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsID0gdGhpcy5obmRTY3JvbGw7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQub2Zmc2V0WSA8PSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG5kUG9pbnRlck1vdmVUaW1lbGluZShfZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNsb3BlSG9va3Muc29tZShfaG9vayA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfaG9vaywgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVTbG9wZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICAgICAgdGhpcy5rZXlzLmZpbmQoZmluZE9iamVjdCkgfHxcclxuICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKGZpbmRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBudWxsO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiBudWxsIH0gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBzd2l0Y2ggKHNlbGVjdGVkLnR5cGUpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwibGFiZWxcIjpcclxuICAgICAgICAgICAgICBjYXNlIFwiZXZlbnRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVEcmFnRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwia2V5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdLZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueCA9IF9ldmVudC5vZmZzZXRYO1xyXG4gICAgICAgICAgdGhpcy5wb3NSaWdodENsaWNrLnkgPSBfZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMucG9zUGFuU3RhcnQgPSB0aGlzLnNjcmVlblRvV29ybGRQb2ludChfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVQYW47XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlVGltZWxpbmUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZVNsb3BlID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdmN0RGVsdGE6IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UobmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSkpO1xyXG4gICAgICB2Y3REZWx0YS50cmFuc2Zvcm0oxpIuTWF0cml4M3gzLlNDQUxJTkcoxpIuTWF0cml4M3gzLklOVkVSU0lPTih0aGlzLm10eFdvcmxkVG9TY3JlZW4pLnNjYWxpbmcpKTtcclxuICAgICAgbGV0IHNsb3BlOiBudW1iZXIgPSB2Y3REZWx0YS55IC8gdmN0RGVsdGEueDtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gPSBzbG9wZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlT3V0ID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlUGFuID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UodGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy5wb3NQYW5TdGFydCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFKVxyXG4gICAgICAgIHRyYW5zbGF0aW9uLnkgPSAwO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0tleSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgbGV0IHBpeGVsUGVyRnJhbWU6IG51bWJlciA9IDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1heCgwLCB0cmFuc2xhdGlvbi54KTtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgucm91bmQodHJhbnNsYXRpb24ueCAvIHBpeGVsUGVyRnJhbWUpICogcGl4ZWxQZXJGcmFtZTtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YTtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IHRoaXMuc2VxdWVuY2VzLmZpbmQoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5pbmNsdWRlcyhrZXkpKS5kYXRhO1xyXG4gICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCB0cmFuc2xhdGlvbi54LCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFIHx8IF9ldmVudC5zaGlmdEtleSA/IG51bGwgOiB0cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0ga2V5LnRpbWU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0V2ZW50ID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhLCB0aW1lKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gPSB0aW1lO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwpXHJcbiAgICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMCkgcmV0dXJuO1xyXG4gICAgICBsZXQgem9vbUZhY3RvcjogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyAxLjA1IDogMC45NTtcclxuICAgICAgbGV0IHBvc0N1cnNvcldvcmxkOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSBfZXZlbnQuc2hpZnRLZXkgPyAxIDogem9vbUZhY3RvcjtcclxuICAgICAgbGV0IHk6IG51bWJlciA9IF9ldmVudC5jdHJsS2V5IHx8IHRoaXMubW9kZSA9PSBTSEVFVF9NT0RFLkRPUEUgPyAxIDogem9vbUZhY3RvcjtcclxuXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGUocG9zQ3Vyc29yV29ybGQpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGUobmV3IMaSLlZlY3RvcjIoeCwgeSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKMaSLlZlY3RvcjIuU0NBTEUocG9zQ3Vyc29yV29ybGQsIC0xKSk7XHJcblxyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kU2Nyb2xsID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IC10aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnBsYXliYWNrVGltZSB9IH0pO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldFZpZXcoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5yZXNldCgpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpOyAvLyBhcHBseSBzY2FsaW5nXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVgoKHRoaXMuY2FudmFzLndpZHRoIC0gMiAqIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCkgLyAoKHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgfHwgVmlld0FuaW1hdGlvblNoZWV0LlNUQU5EQVJEX0FOSU1BVElPTl9MRU5HVEgpKSk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVYKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVZKC0xKTsgLy8gZmxpcCB5XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWShWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG5cclxuICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgICAgLm1hcChfa2V5ID0+IF9rZXkudmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gdmFsdWVzLnJlZHVjZSgoX2EsIF9iKSA9PiBNYXRoLm1pbihfYSwgX2IpKTsgLy8gaW4gd29ybGQgc3BhY2VcclxuICAgICAgICAgIGxldCBtYXg6IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5tYXgoX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgdmlld0hlaWdodDogbnVtYmVyID0gKHRoaXMuY2FudmFzLmhlaWdodCAtIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7IC8vIGluIHB4XHJcbiAgICAgICAgICBpZiAobWluICE9IG1heClcclxuICAgICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSh2aWV3SGVpZ2h0IC8gKCgobWF4IC0gbWluKSAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfVkFMVUUpICogMS4yKSk7XHJcbiAgICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWSh2aWV3SGVpZ2h0IC0gbWluICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVZKFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1dvcmxkUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuSU5WRVJTSU9OKHRoaXMubXR4V29ybGRUb1NjcmVlbikpO1xyXG4gICAgICByZXR1cm4gdmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgd29ybGRUb1NjcmVlblBvaW50KF94OiBudW1iZXIsIF95OiBudW1iZXIpOiDGki5WZWN0b3IyIHtcclxuICAgICAgbGV0IHZlY3RvcjogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKF94LCBfeSk7XHJcbiAgICAgIHZlY3Rvci50cmFuc2Zvcm0odGhpcy5tdHhXb3JsZFRvU2NyZWVuKTtcclxuICAgICAgdmVjdG9yLnggPSB0aGlzLnJvdW5kKHZlY3Rvci54KTtcclxuICAgICAgdmVjdG9yLnkgPSB0aGlzLnJvdW5kKHZlY3Rvci55KTtcclxuICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjcmVlblRvVGltZShfeDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgbGV0IHBsYXliYWNrVGltZTogbnVtYmVyID0gTWF0aC5tYXgoMCwgKF94IC0gdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLngpIC8gdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueCk7XHJcbiAgICAgIHJldHVybiBwbGF5YmFja1RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lVG9TY3JlZW4oX3RpbWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdW5kKF90aW1lICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJvdW5kKF92YWx1ZTogbnVtYmVyKTogbnVtYmVyIHsgLy8gdGhpcyBpcyBuZWVkZWQgZm9yIGxpbmVzIHRvIGJlIGRpc3BsYXllZCBjcmlzcCBvbiB0aGUgY2FudmFzXHJcbiAgICAgIGlmIChNYXRoLnRydW5jKHRoaXMuY3JjMi5saW5lV2lkdGgpICUgMiA9PSAwKVxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKF92YWx1ZSk7IC8vIGV2ZW4gbGluZSB3aWR0aFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoX3ZhbHVlKSArIDAuNTsgLy8gb2RkIGxpbmUgd2lkdGhcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZW51bSBNRU5VIHtcclxuICAgIENPTVBPTkVOVE1FTlUgPSBcIkFkZCBDb21wb25lbnRzXCJcclxuICB9XHJcblxyXG4gIC8vIFRPRE86IGV4YW1pbiBwcm9ibGVtIHdpdGggxpIuTWF0ZXJpYWwgd2hlbiB1c2luZyBcInR5cGVvZiDGki5NdXRhYmxlXCIgYXMga2V5IHRvIHRoZSBtYXBcclxuICBsZXQgcmVzb3VyY2VUb0NvbXBvbmVudDogTWFwPEZ1bmN0aW9uLCB0eXBlb2YgxpIuQ29tcG9uZW50PiA9IG5ldyBNYXA8RnVuY3Rpb24sIHR5cGVvZiDGki5Db21wb25lbnQ+KFtcclxuICAgIFvGki5BdWRpbywgxpIuQ29tcG9uZW50QXVkaW9dLFxyXG4gICAgW8aSLk1hdGVyaWFsLCDGki5Db21wb25lbnRNYXRlcmlhbF0sXHJcbiAgICBbxpIuTWVzaCwgxpIuQ29tcG9uZW50TWVzaF0sXHJcbiAgICBbxpIuQW5pbWF0aW9uLCDGki5Db21wb25lbnRBbmltYXRvcl0sXHJcbiAgICBbxpIuUGFydGljbGVTeXN0ZW0sIMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtXVxyXG4gIF0pO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFsbCBjb21wb25lbnRzIGF0dGFjaGVkIHRvIGEgbm9kZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0NvbXBvbmVudHMgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgZXhwYW5kZWQ6IHsgW3R5cGU6IHN0cmluZ106IGJvb2xlYW4gfSA9IHsgQ29tcG9uZW50VHJhbnNmb3JtOiB0cnVlIH07XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkOiBzdHJpbmcgPSBcIkNvbXBvbmVudFRyYW5zZm9ybVwiO1xyXG4gICAgcHJpdmF0ZSBkcmFnOiDGki5Db21wb25lbnRDYW1lcmE7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVFJBTlNGT1JNLCB0aGlzLmhuZFRyYW5zZm9ybSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTExBUFNFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DTElDSywgdGhpcy5obmRFdmVudCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRFdmVudCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogxpIuQ29tcG9uZW50Q2FtZXJhW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kcmFnID8gW3RoaXMuZHJhZ10gOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQWRkIENvbXBvbmVudFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5BRERfQ09NUE9ORU5ULCDGki5Db21wb25lbnQsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQWRkIEpvaW50XCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkFERF9KT0lOVCwgxpIuSm9pbnQsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiRGVsZXRlIENvbXBvbmVudFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5BRERfSk9JTlQsIMaSLkpvaW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZSBDb21wb25lbnRcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfQ09NUE9ORU5UKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIENvbnRleHRNZW51LmFwcGVuZENvcHlQYXN0ZShtZW51KTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBpU3ViY2xhc3M6IG51bWJlciA9IF9pdGVtW1wiaVN1YmNsYXNzXCJdO1xyXG4gICAgICBsZXQgY29tcG9uZW50OiB0eXBlb2YgxpIuQ29tcG9uZW50O1xyXG5cclxuICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBzd2l0Y2ggKE51bWJlcihfaXRlbS5pZCkpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9DT01QT05FTlQ6XHJcbiAgICAgICAgICBjb21wb25lbnQgPSDGki5Db21wb25lbnQuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfSk9JTlQ6XHJcbiAgICAgICAgICBjb21wb25lbnQgPSDGki5Kb2ludC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9DT01QT05FTlQ6XHJcbiAgICAgICAgICBsZXQgZWxlbWVudDogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09IFwiQk9EWVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQudGFnTmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gUmVmbGVjdC5nZXQoZWxlbWVudCwgXCJjb250cm9sbGVyXCIpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09IFwiREVUQUlMU1wiICYmIGNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5ERUxFVEUsIHsgZGV0YWlsOiB7IG11dGFibGU6IDzGki5NdXRhYmxlPmNvbnRyb2xsZXIuZ2V0TXV0YWJsZSgpIH0gfSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIH0gd2hpbGUgKGVsZW1lbnQpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWNvbXBvbmVudCkgLy8gZXhwZXJpbWVudGFsIGZpeCBmb3IgdGhlIHNwb3JhZGljIFwiY29tcG9uZW50IGlzIG5vdCBhIGNvbnN0cnVjdG9yXCIgYnVnXHJcbiAgICAgICAgY29tcG9uZW50ID0gxpJbX2l0ZW0ubGFiZWxdO1xyXG5cclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCBjbXBOZXc6IMaSLkNvbXBvbmVudCA9IG5ldyBjb21wb25lbnQoKTtcclxuICAgICAgaWYgKChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRSaWdpZGJvZHkgfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50VlJEZXZpY2UgfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50V2Fsa2VyKSAmJiAhdGhpcy5ub2RlLmNtcFRyYW5zZm9ybSkge1xyXG4gICAgICAgIGFsZXJ0KGBUbyBhdHRhY2ggYSAke2NtcE5ldy50eXBlfSwgZmlyc3QgYXR0YWNoIGEgJHvGki5Db21wb25lbnRUcmFuc2Zvcm0ubmFtZX0uYCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRHcmFwaEZpbHRlciAmJiAhKHRoaXMubm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoIHx8IHRoaXMubm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpKSB7XHJcbiAgICAgICAgYWxlcnQoYEF0dGFjaCAke8aSLkNvbXBvbmVudEdyYXBoRmlsdGVyLm5hbWV9IG9ubHkgdG8gJHvGki5HcmFwaC5uYW1lfSBvciAke8aSLkdyYXBoSW5zdGFuY2UubmFtZX1zYCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5ub2RlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEZvZyB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRBbWJpZW50T2NjbHVzaW9uIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEJsb29tKSB7XHJcbiAgICAgICAgbGV0IGNhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRDYW1lcmEpID8/IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50VlJEZXZpY2UpO1xyXG4gICAgICAgIGlmICghY2FtZXJhKSB7XHJcbiAgICAgICAgICBhbGVydChgVG8gYXR0YWNoIGEgJHtjbXBOZXcudHlwZX0sIGZpcnN0IGF0dGFjaCBhICR7xpIuQ29tcG9uZW50Q2FtZXJhLm5hbWV9IG9yICR7xpIuQ29tcG9uZW50VlJEZXZpY2UubmFtZX0uYCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oY21wTmV3LnR5cGUsIGNtcE5ldyk7XHJcblxyXG4gICAgICB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KGNtcE5ldyk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAvLyB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMubm9kZSB9IH0pO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMubm9kZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGlmICh0aGlzLmRvbSAhPSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld1NjcmlwdCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZm9yIChsZXQgc291cmNlIG9mIF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpKSB7XHJcbiAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNjcmlwdEluZm8pIHtcclxuICAgICAgICAgIGlmICghc291cmNlLmlzQ29tcG9uZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5maW5kQ29tcG9uZW50VHlwZShzb3VyY2UpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiAodGhpcy5wcm90ZWN0R3JhcGhJbnN0YW5jZSgpKVxyXG4gICAgICAvLyAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5wcm90ZWN0R3JhcGhJbnN0YW5jZSgpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgZm9yIChsZXQgc291cmNlIG9mIF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpKSB7XHJcbiAgICAgICAgbGV0IGNtcE5ldzogxpIuQ29tcG9uZW50ID0gdGhpcy5jcmVhdGVDb21wb25lbnQoc291cmNlKTtcclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KGNtcE5ldyk7XHJcbiAgICAgICAgdGhpcy5leHBhbmRlZFtjbXBOZXcudHlwZV0gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvdGVjdEdyYXBoSW5zdGFuY2UoKTogYm9vbGVhbiB7XHJcbiAgICAgIC8vIGluaGliaXQgc3RydWN0dXJhbCBjaGFuZ2VzIHRvIGEgR3JhcGhJbnN0YW5jZVxyXG4gICAgICBsZXQgY2hlY2s6IMaSLk5vZGUgPSB0aGlzLm5vZGU7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICBpZiAoY2hlY2sgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKSB7XHJcbiAgICAgICAgICBhbGVydChgRWRpdCB0aGUgZ3JhcGggXCIke2NoZWNrLm5hbWV9XCIgdG8gbWFrZSBjaGFuZ2VzIHRvIGl0cyBzdHJ1Y3R1cmUgYW5kIHRoZW4gcmVsb2FkIHRoZSBwcm9qZWN0YCk7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hlY2sgPSBjaGVjay5nZXRQYXJlbnQoKTtcclxuICAgICAgfSB3aGlsZSAoY2hlY2spO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIGxldCBjbnRFbXB0eTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjbnRFbXB0eS50ZXh0Q29udGVudCA9IFwiRHJvcCBpbnRlcm5hbCByZXNvdXJjZXMgb3IgdXNlIHJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgY29tcG9uZW50c1wiO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwiRHJvcCBpbnRlcm5hbCByZXNvdXJjZXMgb3IgdXNlIHJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgY29tcG9uZW50c1wiO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLm5vZGUgfHwgISh0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5Ob2RlKSkgeyAgLy8gVE9ETzogZXhhbWluZSwgaWYgYW55dGhpbmcgb3RoZXIgdGhhbiBub2RlIGNhbiBhcHBlYXIgaGVyZS4uLlxyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJDb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCJTZWxlY3Qgbm9kZSB0byBlZGl0IGNvbXBvbmVudHNcIjtcclxuICAgICAgICBjbnRFbXB0eS50ZXh0Q29udGVudCA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBjb21wb25lbnRzXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGNudEVtcHR5KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJDb21wb25lbnRzIHwgXCIgKyB0aGlzLm5vZGUubmFtZSk7XHJcblxyXG4gICAgICBsZXQgY29tcG9uZW50czogxpIuQ29tcG9uZW50W10gPSB0aGlzLm5vZGUuZ2V0QWxsQ29tcG9uZW50cygpO1xyXG4gICAgICBpZiAoIWNvbXBvbmVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGNudEVtcHR5KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgbGV0IGRldGFpbHM6IMaSVWkuRGV0YWlscyA9IMaSVWkuR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShjb21wb25lbnQpO1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gbmV3IENvbnRyb2xsZXJEZXRhaWwoY29tcG9uZW50LCBkZXRhaWxzKTtcclxuICAgICAgICBSZWZsZWN0LnNldChkZXRhaWxzLCBcImNvbnRyb2xsZXJcIiwgY29udHJvbGxlcik7IC8vIGluc2VydCBhIGxpbmsgYmFjayB0byB0aGUgY29udHJvbGxlclxyXG4gICAgICAgIGRldGFpbHMuZXhwYW5kKHRoaXMuZXhwYW5kZWRbY29tcG9uZW50LnR5cGVdKTtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmQoZGV0YWlscyk7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudENhbWVyYSkge1xyXG4gICAgICAgICAgZGV0YWlscy5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgZGV0YWlscy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIChfZXZlbnQ6IEV2ZW50KSA9PiB7IHRoaXMuZHJhZyA9IDzGki5Db21wb25lbnRDYW1lcmE+Y29tcG9uZW50OyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFJpZ2lkYm9keSkge1xyXG4gICAgICAgICAgbGV0IHBpdm90OiBIVE1MRWxlbWVudCA9IGNvbnRyb2xsZXIuZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2tleT0nbXR4UGl2b3QnXCIpO1xyXG4gICAgICAgICAgbGV0IG9wYWNpdHk6IHN0cmluZyA9IHBpdm90LnN0eWxlLm9wYWNpdHk7XHJcbiAgICAgICAgICBzZXRQaXZvdE9wYWNpdHkobnVsbCk7XHJcbiAgICAgICAgICBjb250cm9sbGVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULk1VVEFURSwgc2V0UGl2b3RPcGFjaXR5KTtcclxuICAgICAgICAgIGZ1bmN0aW9uIHNldFBpdm90T3BhY2l0eShfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXphdGlvbjogxpIuQk9EWV9JTklUID0gY29udHJvbGxlci5nZXRNdXRhdG9yKHsgaW5pdGlhbGl6YXRpb246IDAgfSkuaW5pdGlhbGl6YXRpb247XHJcbiAgICAgICAgICAgIHBpdm90LnN0eWxlLm9wYWNpdHkgPSBpbml0aWFsaXphdGlvbiA9PSDGki5CT0RZX0lOSVQuVE9fUElWT1QgPyBvcGFjaXR5IDogXCIwLjNcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEZhY2VDYW1lcmEpIHtcclxuICAgICAgICAgIGxldCB1cDogSFRNTEVsZW1lbnQgPSBjb250cm9sbGVyLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltrZXk9J3VwJ1wiKTtcclxuICAgICAgICAgIGxldCBvcGFjaXR5OiBzdHJpbmcgPSB1cC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgICAgICAgc2V0VXBPcGFjaXR5KG51bGwpO1xyXG4gICAgICAgICAgY29udHJvbGxlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHNldFVwT3BhY2l0eSk7XHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRVcE9wYWNpdHkoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgdXBMb2NhbDogYm9vbGVhbiA9IGNvbnRyb2xsZXIuZ2V0TXV0YXRvcih7IHVwTG9jYWw6IHRydWUgfSkudXBMb2NhbDtcclxuICAgICAgICAgICAgdXAuc3R5bGUub3BhY2l0eSA9ICF1cExvY2FsID8gb3BhY2l0eSA6IFwiMC4zXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZXRhaWxzLmdldEF0dHJpYnV0ZShcImtleVwiKSA9PSB0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoZGV0YWlscywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICB0aGlzLm5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGUgfHwgX2V2ZW50LmRldGFpbC5ncmFwaDtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgbGV0IGNvbXBvbmVudDogxpIuQ29tcG9uZW50ID0gPMaSLkNvbXBvbmVudD5fZXZlbnQuZGV0YWlsLm11dGFibGU7XHJcbiAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5LRVlfRE9XTjpcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuQ0xJQ0s6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGxldCB0YXJnZXQ6IMaSVWkuRGV0YWlscyA9IDzGklVpLkRldGFpbHM+X2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PSBcIlNVTU1BUllcIilcclxuICAgICAgICAgICAgdGFyZ2V0ID0gPMaSVWkuRGV0YWlscz50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICghKF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRGV0YWlsc0VsZW1lbnQgfHwgKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KSkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9tLnJlcGxhY2VDaGlsZCh0YXJnZXQsIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCB8fCB0aGlzLmdldFNlbGVjdGVkKCkgIT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0KHRhcmdldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gY2F0Y2ggKF9lOiB1bmtub3duKSB7IC8qICovIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5FWFBBTkQ6XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkNPTExBUFNFOlxyXG4gICAgICAgICAgdGhpcy5leHBhbmRlZFsoPMaSVWkuRGV0YWlscz5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpXSA9IChfZXZlbnQudHlwZSA9PSDGklVpLkVWRU5ULkVYUEFORCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgbGV0IGNtcFJpZ2lkYm9keTogxpIuQ29tcG9uZW50UmlnaWRib2R5ID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRSaWdpZGJvZHkpO1xyXG4gICAgICAgICAgaWYgKGNtcFJpZ2lkYm9keSkgXHJcbiAgICAgICAgICAgIGNtcFJpZ2lkYm9keS5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IHRoaXMubm9kZSB9IH0pOyAvLyBUT0RPOiBjaGVjayBpZiB0aGlzIHdhcyBuZWNlc3NhcnksIEVWRU5UX0VESVRPUi5VUERBVEUgZ2V0cyBicm9hZGNhc3RlZCBieSBwcm9qZWN0IG9uIMaSLkVWRU5ULkdSQVBIX01VVEFURUQsIHNvIHRoaXMgd2FzIGNhdXNpbmcgYSBkb3VibGUgYnJvYWRjYXN0IG9mIEVWRU5UX0VESVRPUi5VUERBVEUgdG8gQUxMIHZpZXdzIG9uIGFueSBjaGFuZ2UgdG8gYW55IGNvbXBvbmVudFxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGklVpLkVWRU5ULlJFQVJSQU5HRV9BUlJBWTogLy8gbm8gbGlzdGVuZXIgZm9yIHRoaXMgZXZlbnRcclxuICAgICAgICAvLyAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFRyYW5zZm9ybSA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5nZXRTZWxlY3RlZCgpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gUmVmbGVjdC5nZXQodGhpcy5nZXRTZWxlY3RlZCgpLCBcImNvbnRyb2xsZXJcIik7XHJcbiAgICAgIGxldCBjb21wb25lbnQ6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+Y29udHJvbGxlci5nZXRNdXRhYmxlKCk7XHJcbiAgICAgIGxldCBtdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDR4NCA9IFJlZmxlY3QuZ2V0KGNvbXBvbmVudCwgXCJtdHhMb2NhbFwiKSB8fCBSZWZsZWN0LmdldChjb21wb25lbnQsIFwibXR4UGl2b3RcIik7XHJcbiAgICAgIGlmICghbXR4VHJhbnNmb3JtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBkdGw6IMaSLkdlbmVyYWwgPSBfZXZlbnQuZGV0YWlsLnRyYW5zZm9ybTtcclxuICAgICAgbGV0IG10eENhbWVyYTogxpIuTWF0cml4NHg0ID0gKDzGki5Db21wb25lbnRDYW1lcmE+ZHRsLmNhbWVyYSkubm9kZS5tdHhXb3JsZDtcclxuICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBtdHhDYW1lcmEuZ2V0VHJhbnNsYXRpb25Ubyh0aGlzLm5vZGUubXR4V29ybGQpLm1hZ25pdHVkZTtcclxuICAgICAgaWYgKGR0bC50cmFuc2Zvcm0gPT0gVFJBTlNGT1JNLlJPVEFURSlcclxuICAgICAgICBbZHRsLngsIGR0bC55XSA9IFtkdGwueSwgZHRsLnhdO1xyXG5cclxuICAgICAgbGV0IHZhbHVlOiDGki5WZWN0b3IzID0gbmV3IMaSLlZlY3RvcjMoKTtcclxuICAgICAgdmFsdWUueCA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ4XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/IGR0bC54IDogdW5kZWZpbmVkO1xyXG4gICAgICB2YWx1ZS55ID0gKGR0bC5yZXN0cmljdGlvbiA9PSBcInlcIiA/ICFkdGwuaW52ZXJ0ZWQgOiBkdGwuaW52ZXJ0ZWQpID8gLWR0bC55IDogdW5kZWZpbmVkO1xyXG4gICAgICB2YWx1ZS56ID0gKGR0bC5yZXN0cmljdGlvbiA9PSBcInpcIiA/ICFkdGwuaW52ZXJ0ZWQgOiBkdGwuaW52ZXJ0ZWQpID9cclxuICAgICAgICAoKHZhbHVlLnggPT0gdW5kZWZpbmVkKSA/IC1kdGwueSA6IGR0bC54KSA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoKF9jOiBudW1iZXIpID0+IF9jIHx8IDApO1xyXG5cclxuICAgICAgaWYgKG10eFRyYW5zZm9ybSBpbnN0YW5jZW9mIMaSLk1hdHJpeDR4NClcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybTMoZHRsLnRyYW5zZm9ybSwgdmFsdWUsIG10eFRyYW5zZm9ybSwgZGlzdGFuY2UpO1xyXG4gICAgICBpZiAobXR4VHJhbnNmb3JtIGluc3RhbmNlb2YgxpIuTWF0cml4M3gzKVxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtMihkdGwudHJhbnNmb3JtLCB2YWx1ZS50b1ZlY3RvcjIoKSwgbXR4VHJhbnNmb3JtLCAxKTtcclxuXHJcbiAgICAgIGNvbXBvbmVudC5tdXRhdGUoY29tcG9uZW50LmdldE11dGF0b3IoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtMyhfdHJhbnNmb3JtOiBUUkFOU0ZPUk0sIF92YWx1ZTogxpIuVmVjdG9yMywgX210eFRyYW5zZm9ybTogxpIuTWF0cml4NHg0LCBfZGlzdGFuY2U6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBzd2l0Y2ggKF90cmFuc2Zvcm0pIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclRyYW5zbGF0aW9uICogX2Rpc3RhbmNlKTtcclxuICAgICAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb247XHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JSb3RhdGlvbjogbnVtYmVyID0gMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JSb3RhdGlvbik7XHJcbiAgICAgICAgICBsZXQgcm90YXRpb246IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgcm90YXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5TQ0FMRTpcclxuICAgICAgICAgIGxldCBmYWN0b3JTY2FsaW5nOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JTY2FsaW5nKTtcclxuICAgICAgICAgIGxldCBzY2FsaW5nOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS5zY2FsaW5nO1xyXG4gICAgICAgICAgc2NhbGluZy5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0uc2NhbGluZyA9IHNjYWxpbmc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtMihfdHJhbnNmb3JtOiBUUkFOU0ZPUk0sIF92YWx1ZTogxpIuVmVjdG9yMiwgX210eFRyYW5zZm9ybTogxpIuTWF0cml4M3gzLCBfZGlzdGFuY2U6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBzd2l0Y2ggKF90cmFuc2Zvcm0pIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclRyYW5zbGF0aW9uICogX2Rpc3RhbmNlKTtcclxuICAgICAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb247XHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JSb3RhdGlvbjogbnVtYmVyID0gMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JSb3RhdGlvbik7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uICs9IF92YWx1ZS54O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yU2NhbGluZzogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yU2NhbGluZyk7XHJcbiAgICAgICAgICBsZXQgc2NhbGluZzogxpIuVmVjdG9yMiA9IF9tdHhUcmFuc2Zvcm0uc2NhbGluZztcclxuICAgICAgICAgIHNjYWxpbmcuYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdChfZGV0YWlsczogxpJVaS5EZXRhaWxzLCBfZm9jdXM6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZG9tLmNoaWxkcmVuKVxyXG4gICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgX2RldGFpbHMuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkID0gX2RldGFpbHMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBpZiAoX2ZvY3VzKVxyXG4gICAgICAgIF9kZXRhaWxzLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZCgpOiDGklVpLkRldGFpbHMge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmRvbS5jaGlsZHJlbilcclxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VsZWN0ZWRcIikpXHJcbiAgICAgICAgICByZXR1cm4gPMaSVWkuRGV0YWlscz5jaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudChfcmVzb3VyY2U6IE9iamVjdCk6IMaSLkNvbXBvbmVudCB7XHJcbiAgICAgIGlmIChfcmVzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKVxyXG4gICAgICAgIGlmIChfcmVzb3VyY2UuaXNDb21wb25lbnQpXHJcbiAgICAgICAgICByZXR1cm4gbmV3ICg8xpIuR2VuZXJhbD5fcmVzb3VyY2Uuc2NyaXB0KSgpO1xyXG5cclxuICAgICAgbGV0IHR5cGVDb21wb25lbnQ6IHR5cGVvZiDGki5Db21wb25lbnQgPSB0aGlzLmZpbmRDb21wb25lbnRUeXBlKF9yZXNvdXJjZSk7XHJcbiAgICAgIHJldHVybiBuZXcgKDzGki5HZW5lcmFsPnR5cGVDb21wb25lbnQpKF9yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kQ29tcG9uZW50VHlwZShfcmVzb3VyY2U6IE9iamVjdCk6IHR5cGVvZiDGki5Db21wb25lbnQge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiByZXNvdXJjZVRvQ29tcG9uZW50KVxyXG4gICAgICAgIGlmIChfcmVzb3VyY2UgaW5zdGFuY2VvZiBlbnRyeVswXSlcclxuICAgICAgICAgIHJldHVybiBlbnRyeVsxXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIHN0b3JlU2VsZWN0ZWQoKTogdm9pZCB7XHJcbiAgICAvLyAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIGhpZXJhcmNoeSBvZiBhIGdyYXBoIGFzIHRyZWUtY29udHJvbFxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SGllcmFyY2h5IGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIGdyYXBoOiDGki5HcmFwaDtcclxuICAgIHByaXZhdGUgdHJlZTogxpJVaS5DdXN0b21UcmVlPMaSLk5vZGU+O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3Rpb25QcmV2aW91czogxpIuTm9kZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0R3JhcGgobnVsbCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICAvLyBhIHNlbGVjdCBldmVudCB3aWxsIGJlIHJlY2l2ZWQgZnJvbSB0aGUgcGFuZWwgZHVyaW5nIHJlY29uc3RydWN0aW9uIHNvIHdlIG9ubHkgbmVlZCB0byBwcmVwYXJlIG91ciBzdG9yYWdlIGhlcmVcclxuICAgICAgaWYgKF9zdGF0ZVtcImdyYXBoXCJdICYmIF9zdGF0ZVtcImV4cGFuZGVkXCJdICYmICF0aGlzLnJlc3RvcmVFeHBhbmRlZChfc3RhdGVbXCJncmFwaFwiXSkpXHJcbiAgICAgICAgdGhpcy5zdG9yZUV4cGFuZGVkKF9zdGF0ZVtcImdyYXBoXCJdLCBfc3RhdGVbXCJleHBhbmRlZFwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgc2VsZWN0aW9uKCk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEdyYXBoKF9ncmFwaDogxpIuR3JhcGgpOiB2b2lkIHtcclxuICAgICAgaWYgKCFfZ3JhcGgpIHtcclxuICAgICAgICB0aGlzLmdyYXBoID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmFwaCAmJiB0aGlzLnRyZWUpXHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmdyYXBoKVxyXG4gICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZCh0aGlzLmdyYXBoLmlkUmVzb3VyY2UsIHRoaXMuZ2V0RXhwYW5kZWQoKSk7XHJcblxyXG4gICAgICB0aGlzLmdyYXBoID0gX2dyYXBoO1xyXG4gICAgICAvLyB0aGlzLnNlbGVjdGVkTm9kZSA9IG51bGw7XHJcblxyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJVaS5DdXN0b21UcmVlPMaSLk5vZGU+KG5ldyBDb250cm9sbGVyVHJlZUhpZXJhcmNoeSgpLCB0aGlzLmdyYXBoKTtcclxuICAgICAgLy8gdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5ERUxFVEUsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayBvbiBleGlzdGluZyBub2RlIHRvIGNyZWF0ZSBjaGlsZCBub2RlLlxcbuKXjyBVc2UgQ29weS9QYXN0ZSB0byBkdXBsaWNhdGUgbm9kZXMuXCI7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBvciBkdXBsaWNhdGUuXCI7XHJcblxyXG4gICAgICBsZXQgZXhwYW5kZWQ6IHN0cmluZ1tdID0gdGhpcy5yZXN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlKTtcclxuICAgICAgaWYgKGV4cGFuZGVkKVxyXG4gICAgICAgIHRoaXMuZXhwYW5kKGV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjsgLy8gY29udGludWUgd2l0aCBzdGFuZGFyZCB0cmVlIGJlaGF2aW91clxyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJlZSlcclxuICAgICAgICAgIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKS5maWx0ZXIoKF9zb3VyY2UpOiBfc291cmNlIGlzIMaSLkdyYXBoID0+IF9zb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMgfHwgX2V2ZW50LnRhcmdldCA9PSB0aGlzLnRyZWUpXHJcbiAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZSB3aXRoIHN0YW5kYXJkIHRyZWUgYmVoYXZpb3VyXHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpbnN0YW5jZXM6IMaSLkdyYXBoSW5zdGFuY2VbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBncmFwaCBvZiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzKVxyXG4gICAgICAgIGlmIChncmFwaCBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgaW5zdGFuY2VzLnB1c2goYXdhaXQgxpIuUHJvamVjdC5jcmVhdGVHcmFwaEluc3RhbmNlKGdyYXBoKSk7XHJcblxyXG4gICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gaW5zdGFuY2VzO1xyXG4gICAgICB0aGlzLnRyZWUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoxpJVaS5FVkVOVC5EUk9QLCB7IGJ1YmJsZXM6IGZhbHNlIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJBZGQgTm9kZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9OT0RFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiTlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZS0gLyBBY3Z0aXZhdGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BQ1RJVkFURV9OT0RFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiQVwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgZm9jdXM6IMaSLk5vZGUgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKF9pdGVtLmlkKSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX05PREU6XHJcbiAgICAgICAgICBsZXQgY2hpbGQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIk5ldyBOb2RlXCIpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmFkZENoaWxkcmVuKFtjaGlsZF0sIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShjaGlsZCkuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUNUSVZBVEVfTk9ERTpcclxuICAgICAgICAgIGZvY3VzLmFjdGl2YXRlKCFmb2N1cy5pc0FjdGl2ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoZm9jdXMpLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX05PREU6XHJcbiAgICAgICAgICAvLyBmb2N1cy5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZGVsZXRlKFtmb2N1c10pO1xyXG4gICAgICAgICAgZm9jdXMuZ2V0UGFyZW50KCkucmVtb3ZlQ2hpbGQoZm9jdXMpO1xyXG4gICAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLmdyYXBoKTtcclxuICAgICAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJleHBhbmRlZFwiXSA9IHRoaXMuZ2V0RXhwYW5kZWQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBFdmVudEhhbmRsZXJzXHJcbiAgICBwcml2YXRlIGhuZFRyZWVFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkdyYXBoKSB7XHJcbiAgICAgICAgICAgIC8vIF9ldmVudC5kZXRhaWwuZGF0YS5uYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5TRUxFQ1Q6XHJcbiAgICAgICAgICAvL29ubHkgZGlzcGF0Y2ggdGhlIGV2ZW50IHRvIGZvY3VzIHRoZSBub2RlLCBpZiB0aGUgbm9kZSBpcyBpbiB0aGUgY3VycmVudCBhbmQgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiAgXHJcbiAgICAgICAgICBsZXQgbm9kZTogxpIuTm9kZSA9IF9ldmVudC5kZXRhaWxbXCJkYXRhXCJdO1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJldmlvdXMuaW5jbHVkZXMobm9kZSkgJiYgdGhpcy5zZWxlY3Rpb24uaW5jbHVkZXMobm9kZSkpXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiBub2RlLCB2aWV3OiB0aGlzIH0gfSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblByZXZpb3VzID0gdGhpcy5zZWxlY3Rpb24uc2xpY2UoMCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgbm9kZTogbm9kZSwgdmlldzogdGhpcyB9IH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaChfZXZlbnQuZGV0YWlsLmdyYXBoKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLm5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy50cmVlLnNob3coX2V2ZW50LmRldGFpbC5ub2RlLmdldFBhdGgoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbiA9IFtfZXZlbnQuZGV0YWlsLm5vZGVdO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuZGlzcGxheVNlbGVjdGlvbih0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblByZXZpb3VzID0gdGhpcy5zZWxlY3Rpb24uc2xpY2UoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC52aWV3IGluc3RhbmNlb2YgVmlld0ludGVybmFsICYmIF9ldmVudC5kZXRhaWwuZGF0YSA9PSB0aGlzLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnRyZWUuZmluZEl0ZW0odGhpcy5ncmFwaCk/LnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGlmICh0aGlzLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcsIF9leHBhbmRlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19pZEdyYXBofWAsIEpTT04uc3RyaW5naWZ5KF9leHBhbmRlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGxldCBzdG9yZWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5pZH1fJHtfaWRHcmFwaH1gKTtcclxuICAgICAgcmV0dXJuIHN0b3JlZCAmJiBKU09OLnBhcnNlKHN0b3JlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWU/LmdldEV4cGFuZGVkKCkubWFwKF9pdGVtID0+IMaSLk5vZGUuUEFUSF9GUk9NX1RPKHRoaXMuZ3JhcGgsIF9pdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiDGki5Ob2RlW11bXSA9IF9wYXRoc1xyXG4gICAgICAgIC5tYXAoX3BhdGggPT4gxpIuTm9kZS5GSU5EPMaSLk5vZGU+KHRoaXMuZ3JhcGgsIF9wYXRoKSlcclxuICAgICAgICAuZmlsdGVyKF9ub2RlID0+IF9ub2RlKVxyXG4gICAgICAgIC5tYXAoX25vZGUgPT4gX25vZGUuZ2V0UGF0aCgpKTtcclxuXHJcbiAgICAgIHRoaXMudHJlZT8uZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHJlbmRlcmluZyBvZiBhIGdyYXBoIGluIGEgdmlld3BvcnQgd2l0aCBhbiBpbmRlcGVuZGVudCBjYW1lcmFcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdSZW5kZXIgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgY21yT3JiaXQ6IMaSQWlkLkNhbWVyYU9yYml0O1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGdyYXBoOiDGki5HcmFwaDtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgbm9kZUxpZ2h0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJJbGx1bWluYXRpb25cIik7IC8vIGtlZXBzIGxpZ2h0IGNvbXBvbmVudHMgZm9yIGRhcmsgZ3JhcGhzXHJcbiAgICBwcml2YXRlIHJlZHJhd0lkOiBudW1iZXI7XHJcbiAgICAjcG9pbnRlck1vdmVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlVXNlckludGVyZmFjZSgpO1xyXG5cclxuICAgICAgbGV0IHRpdGxlOiBzdHJpbmcgPSBcIuKXjyBEcm9wIGEgZ3JhcGggZnJvbSBcXFwiSW50ZXJuYWxcXFwiIGhlcmUuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIFVzZSBtb3VzZWJ1dHRvbnMgYW5kIGN0cmwtLCBzaGlmdC0gb3IgYWx0LWtleSB0byBuYXZpZ2F0ZSBlZGl0b3IgY2FtZXJhLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBEcm9wIGNhbWVyYSBjb21wb25lbnQgaGVyZSB0byBzZWUgdGhyb3VnaCB0aGF0IGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gTWFuaXB1bGF0ZSB0cmFuc2Zvcm1hdGlvbnMgaW4gdGhpcyB2aWV3OlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBDbGljayB0byBzZWxlY3Qgbm9kZSwgcmlnaHRjbGljayB0byBzZWxlY3QgdHJhbnNmb3JtYXRpb25zLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBTZWxlY3QgY29tcG9uZW50IHRvIG1hbmlwdWxhdGUgaW4gdmlldyBDb21wb25lbnRzLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBIb2xkIFgsIFkgb3IgWiBhbmQgbW92ZSBtb3VzZSB0byB0cmFuc2Zvcm0uIEFkZCBzaGlmdC1rZXkgdG8gaW52ZXJ0IHJlc3RyaWN0aW9uLlxcblwiO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICB0aGlzLmRvbS50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB0aGlzLiNwb2ludGVyTW92ZWQgPSBmYWxzZSk7IC8vIHJlc2V0IHBvaW50ZXIgbW92ZVxyXG5cclxuICAgICAgaWYgKF9zdGF0ZVtcImdpem1vc0ZpbHRlclwiXSkge1xyXG4gICAgICAgIGxldCBnaXptb3NGaWx0ZXI6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcChfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl0pO1xyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGdpem1vc0ZpbHRlcilcclxuICAgICAgICAgIGlmICh0aGlzLmdpem1vc0ZpbHRlci5oYXMoa2V5KSlcclxuICAgICAgICAgICAgdGhpcy5naXptb3NGaWx0ZXIuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgZ2l6bW9zRmlsdGVyKCk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+IHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld3BvcnQ/Lmdpem1vc0ZpbHRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJUcmFuc2xhdGVcIiwgaWQ6IFRSQU5TRk9STS5UUkFOU0xBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlRcIiA6IFwiVFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJSb3RhdGVcIiwgaWQ6IFRSQU5TRk9STS5ST1RBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlJcIiA6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTY2FsZVwiLCBpZDogVFJBTlNGT1JNLlNDQUxFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJFXCIgOiBcIkVcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJQaHlzaWNzIERlYnVnXCIsIHN1Ym1lbnU6IFtcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5vbmVcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVswXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVyc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzFdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29sbGlkZXJzIGFuZCBKb2ludHMgKERlZmF1bHQpXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMl0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJCb3VuZGluZyBCb3hlc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzNdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29udGFjdHNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs0XSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk9ubHkgUGh5c2ljc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzVdKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIk9ydGhvZ3JhcGhpYyBDYW1lcmFcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIk9cIiA6IFwiT1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUmVuZGVyIENvbnRpbnVvdXNseVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uUk9UQVRFOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oX2l0ZW0uaWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5OT05FXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTExJREVSU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkJPVU5ESU5HX0JPWEVTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTlRBQ1RTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLlBIWVNJQ19PQkpFQ1RTX09OTFldOlxyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREVbX2l0ZW0uaWRdO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSk6XHJcbiAgICAgICAgICB0aGlzLnNldENhbWVyYU9ydGhvZ3JhcGhpYyhfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpOlxyXG4gICAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZ2l6bW9zRmlsdGVyLmhhcyhfaXRlbS5pZCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZ2l6bW9zRmlsdGVyLnNldChfaXRlbS5pZCwgX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLiNwb2ludGVyTW92ZWQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IFtmaWx0ZXIsIGFjdGl2ZV0gb2YgdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChmaWx0ZXIpLmNoZWNrZWQgPSBhY3RpdmU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdDb21wb25lbnRzKSkgeyAvLyBhbGxvdyBkcm9wcGluZyBjYW1lcmFjb21wb25lbnQgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEgKGF0IHRoaXMgdGltZSwgdGhlIG9ubHkgZHJhZ2dhYmxlKVxyXG4gICAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsKSkgLy8gYWxsb3cgZHJvcHBpbmcgYSBncmFwaFxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudENhbWVyYSkge1xyXG4gICAgICAgIC8vIHRoaXMuc2V0Q2FtZXJhT3J0aG9ncmFwaGljKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKHRoaXMubm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgdGhpcy5jYW52YXMgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICBsZXQgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMHB4XCI7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy52aWV3cG9ydCA9IG5ldyDGki5WaWV3cG9ydCgpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAvLyBhZGQgZGVmYXVsdCB2YWx1ZXMgZm9yIHZpZXcgcmVuZGVyIGdpem1vc1xyXG4gICAgICB0aGlzLmdpem1vc0ZpbHRlci5zZXQoR0laTU9TLlRSQU5TRk9STSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlZpZXdOb2RlX1ZpZXdwb3J0XCIsIHRoaXMuZ3JhcGgsIGNtcENhbWVyYSwgdGhpcy5jYW52YXMpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHsgLyogdmlldyBzaG91bGQgbG9hZCBldmVuIGlmIHJlbmRlcmluZyBmYWlscy4uLiAqLyB9O1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfU1RBUlQsIHRoaXMuaG5kUHJlcGFyZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuYWN0aXZlVmlld3BvcnQpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicGlja1wiLCB0aGlzLmhuZFBpY2spO1xyXG5cclxuICAgICAgbGV0IHN1Ym1lbnU6IEVsZWN0cm9uLk1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zW10gPSBbXTtcclxuICAgICAgZm9yIChjb25zdCBbZmlsdGVyXSBvZiB0aGlzLmdpem1vc0ZpbHRlcilcclxuICAgICAgICBzdWJtZW51LnB1c2goeyBsYWJlbDogZmlsdGVyLCBpZDogZmlsdGVyLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSB9KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkdpem1vc1wiLCBzdWJtZW51OiBzdWJtZW51XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEdyYXBoKF9ub2RlOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBpZiAoIV9ub2RlKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBncmFwaCBoZXJlIHRvIGVkaXRcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLmdyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZ3JhcGggPSBfbm9kZTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpO1xyXG4gICAgICB0aGlzLmdyYXBoLmJyb2FkY2FzdEV2ZW50KG5ldyBFdmVudCjGki5FVkVOVC5ESVNDT05ORUNUX0pPSU5UKSk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnNldEJyYW5jaCh0aGlzLmdyYXBoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5ncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDYW1lcmFPcnRob2dyYXBoaWMoX29uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDIsIDEsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDEwLCAyMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5tYXhEaXN0YW5jZSA9IDEwMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgKj0gNTA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDAuMDEsIDEwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgLz0gNTA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSkpLmNoZWNrZWQgPSBfb247XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUHJlcGFyZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBzd2l0Y2hMaWdodDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJSRU5ERVJcIiA6IFwiUmVuZGVyXCJ9IHwgJHt0aGlzLmdyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgaWYgKCFsaWdodHNQcmVzZW50KVxyXG4gICAgICAgICAgxpIuUmVuZGVyLmFkZExpZ2h0cyh0aGlzLm5vZGVMaWdodC5nZXRDb21wb25lbnRzKMaSLkNvbXBvbmVudExpZ2h0KSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmdyYXBoLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfRU5ELCBzd2l0Y2hMaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IDxFdmVudERldGFpbD5fZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ncmFwaCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKGRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IGZhbHNlLCBkZXRhaWw6IHsgbm9kZTogZGV0YWlsLm5vZGUgfHwgdGhpcy5ncmFwaCB9IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IGRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gW3RoaXMubm9kZV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5GT0NVUzpcclxuICAgICAgICAgIHRoaXMuY21yT3JiaXQubXR4TG9jYWwudHJhbnNsYXRpb24gPSBkZXRhaWwubm9kZS5tdHhXb3JsZC50cmFuc2xhdGlvbjtcclxuICAgICAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmICghdGhpcy52aWV3cG9ydC5jYW1lcmEuaXNBY3RpdmUpXHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQaWNrID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBpY2tlZDogxpIuTm9kZSA9IF9ldmVudC5kZXRhaWwubm9kZTtcclxuXHJcbiAgICAgIC8vVE9ETzogd2F0Y2ggb3V0LCB0d28gc2VsZWN0c1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IHBpY2tlZCB9IH0pO1xyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGklVpLkVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogcGlja2VkIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFuaW1hdGUgPSAoX2U6IEV2ZW50KSA9PiB7XHJcbiAgICAvLyAgIHRoaXMudmlld3BvcnQuc2V0R3JhcGgodGhpcy5ncmFwaCk7XHJcbiAgICAvLyAgIGlmICh0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQgPiAwICYmIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoID4gMClcclxuICAgIC8vICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXIgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy4jcG9pbnRlck1vdmVkIHx8PSAoX2V2ZW50Lm1vdmVtZW50WCAhPSAwIHx8IF9ldmVudC5tb3ZlbWVudFkgIT0gMCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XHJcbiAgICAgIGxldCByZXN0cmljdGlvbjogc3RyaW5nO1xyXG4gICAgICBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlhdKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwieFwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWV0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ6XCI7XHJcbiAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5aXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInlcIjtcclxuXHJcbiAgICAgIGlmICghcmVzdHJpY3Rpb24pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgIGxldCBkYXRhOiBPYmplY3QgPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBQYWdlLm1vZGVUcmFuc2Zvcm0sIHJlc3RyaWN0aW9uOiByZXN0cmljdGlvbiwgeDogX2V2ZW50Lm1vdmVtZW50WCwgeTogX2V2ZW50Lm1vdmVtZW50WSwgY2FtZXJhOiB0aGlzLnZpZXdwb3J0LmNhbWVyYSwgaW52ZXJ0ZWQ6IF9ldmVudC5zaGlmdEtleVxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgdHJhbnNmb3JtOiBkYXRhIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYWN0aXZlVmlld3BvcnQgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIF9ldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuZHJhdygpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHtcclxuICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKF9lcnJvcik7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFJlbmRlckNvbnRpbm91c2x5KF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBpZiAoX29uKSB7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWRyYXdJZCk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpKS5jaGVja2VkID0gX29uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1RyYW5zbGF0aW9uID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMubm9kZSB8fCAhdGhpcy5naXptb3NGaWx0ZXIuZ2V0KEdJWk1PUy5UUkFOU0ZPUk0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHNjYWxpbmc6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLk9ORSjGki5WZWN0b3IzLkRJRkZFUkVOQ0UoxpIuR2l6bW9zLmNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5ub2RlLm10eFdvcmxkLnRyYW5zbGF0aW9uKS5tYWduaXR1ZGUgKiAwLjEpO1xyXG4gICAgICBjb25zdCBvcmlnaW46IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTtcclxuICAgICAgY29uc3QgdmN0WDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWCgxKTtcclxuICAgICAgY29uc3QgdmN0WTogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWSgxKTtcclxuICAgICAgY29uc3QgdmN0WjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWigxKTtcclxuICAgICAgbGV0IG10eFdvcmxkOiDGki5NYXRyaXg0eDQgPSB0aGlzLm5vZGUubXR4V29ybGQuY2xvbmU7XHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICBsZXQgY29sb3I6IMaSLkNvbG9yID0gxpIuQ29sb3IuQ1NTKFwicmVkXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFhdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJsaW1lXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFldLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJibHVlXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFpdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZSh2Y3RYLCB2Y3RZLCB2Y3RaLCBvcmlnaW4sIG10eFdvcmxkLCBjb2xvciwgc2NhbGluZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdID0gQXJyYXkuZnJvbSh0aGlzLmdpem1vc0ZpbHRlci5lbnRyaWVzKCkpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBsZXQgdHlwZXNPZlJlc291cmNlczogxpIuR2VuZXJhbFtdID0gW1xyXG4gICAgxpIuTWVzaFxyXG4gIF07XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIGludGVybmFsIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxUYWJsZSBleHRlbmRzIFZpZXdJbnRlcm5hbCB7XHJcbiAgICBwcml2YXRlIHRhYmxlOiDGknVpLlRhYmxlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5URVNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RSZXNvdXJjZXMoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMudGFibGUgPSBuZXcgxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT4obmV3IENvbnRyb2xsZXJUYWJsZVJlc291cmNlKCksIE9iamVjdC52YWx1ZXMoxpIuUHJvamVjdC5yZXNvdXJjZXMpLCBcInR5cGVcIik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwi4pePIFJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgcmVzb3VyY2UuXFxu4pePIFNlbGVjdCBvciBkcmFnIHJlc291cmNlLlwiO1xyXG4gICAgICB0aGlzLnRhYmxlLnRpdGxlID0gXCLil48gU2VsZWN0IHRvIGVkaXQgaW4gXFxcIlByb3BlcnRpZXNcXFwiXFxu4pePICBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCB0ciBvZiB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSkge1xyXG4gICAgICAgIGxldCB0ZHM6IE5vZGVMaXN0T2Y8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gdHIucXVlcnlTZWxlY3RvckFsbChcInRkXCIpO1xyXG4gICAgICAgIGlmICghdGRzLmxlbmd0aClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHRkc1sxXS5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcclxuICAgICAgICB0ZHNbMV0uc2V0QXR0cmlidXRlKFwiaWNvblwiLCAoPEhUTUxJbnB1dEVsZW1lbnQ+dGRzWzFdLmNoaWxkcmVuWzBdKS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRyIGluc3RhbmNlb2YgxpJ1aS5UYWJsZUl0ZW0gJiYgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPnRyLmRhdGEpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIHRyLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIHRyLnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUgY2hlY2sgdGhlIGNvbnNvbGUgZm9yIGRldGFpbHMuXCI7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIMaSLlNoYWRlciwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIEFuaW1hdGlvblwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb24ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb25TcHJpdGUubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfWAsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgUmVzb3VyY2VcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJSXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTeW5jIEluc3RhbmNlc1wiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiU1wiIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIC8vVE9ETzogZGlzcGF0Y2ggQ1JFQVRFIGluc3RlYWQgb2YgTU9ESUZZIVxyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIGxldCBtZXNoTmV3OiDGki5NZXNoID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobWVzaE5ldywgbWVzaE5ldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBtdHJOZXc6IMaSLk1hdGVyaWFsID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobXRyTmV3LCBtdHJOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfR1JBUEg6XHJcbiAgICAgICAgICBsZXQgZ3JhcGg6IMaSLkdyYXBoID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoZ3JhcGgsIGdyYXBoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTjpcclxuICAgICAgICAgIGxldCB0eXBlQW5pbWF0aW9uOiB0eXBlb2YgxpIuQW5pbWF0aW9uID0gxpIuQW5pbWF0aW9uLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBhbmltYXRpb246IMaSLkFuaW1hdGlvbiA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoYW5pbWF0aW9uLCBhbmltYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUOlxyXG4gICAgICAgICAgbGV0IHBhcnRpY2xlU3lzdGVtOiDGki5QYXJ0aWNsZVN5c3RlbSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKHBhcnRpY2xlU3lzdGVtLCBwYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRTpcclxuICAgICAgICAgIGF3YWl0IHRoaXMudGFibGUuY29udHJvbGxlci5kZWxldGUoW3RoaXMudGFibGUuZ2V0Rm9jdXNzZWQoKV0pO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgaWYgKHRoaXMuZG9tICE9IF9ldmVudC50YXJnZXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGlmIChzb3VyY2VzLnNvbWUoX3NvdXJjZSA9PiAhW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcylcclxuICAgICAgICAvLyAgIGlmIChzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLkFVRElPICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuSU1BR0UgJiYgc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5NRVNIKVxyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IMaSLk5vZGVbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChzb3VyY2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdFeHRlcm5hbCkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcclxuICAgICAgICAgIHN3aXRjaCAoc291cmNlLmdldE1pbWVUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBNSU1FLkFVRElPOlxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5JTUFHRTpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBNSU1FLk1FU0g6XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcubG9nKGF3YWl0IG5ldyDGki5NZXNoT0JKKCkubG9hZChzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2VcclxuICAgICAgICAgICAgICBNSU1FLkdMVEY6XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgICBsZXQgbG9hZDogYm9vbGVhbiA9IGF3YWl0IMaSdWkuRGlhbG9nLnByb21wdChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzLCBmYWxzZSwgYFNlbGVjdCB3aGF0IHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgICBpZiAoIWxvYWQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc291cmNlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IGF3YWl0IGxvYWRlci5sb2FkUmVzb3VyY2VzKMaSW3R5cGVdKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIcaSLlByb2plY3QucmVzb3VyY2VzW3Jlc291cmNlLmlkUmVzb3VyY2VdKVxyXG4gICAgICAgICAgICAgICAgICAgIMaSLlByb2plY3QucmVnaXN0ZXIocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleWJvYXJkRXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGxldCBjZWxsOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IHRoaXMudGFibGUucXVlcnlTZWxlY3RvcihcIi5zZWxlY3RlZFwiKTtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmICghaW5wdXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNSRUFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOiAvLyBUT0RPOiBpcyB0aGlzIHJlYWNoYWJsZT8gSXMgaXQgc3RpbGwgbmVlZGVkP1xyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFzeW5jIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblxyXG5cclxuICAgIC8vICAgLy8gxpJ1aS5EaWFsb2cuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAvLyAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAvLyAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcihzZXR0aW5ncywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgICAgdGhpcy5tdXRhdGUobXV0YXRvcik7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgIH0gZWxzZVxyXG4gICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgLy8gfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBpbXBvcnQgxpJBaWQgPSBGdWRnZUFpZDtcclxuXHJcbiAgLyoqXHJcbiAgICogUHJldmlldyBhIHJlc291cmNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQcmV2aWV3IGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoU3RhbmRhcmQ6IMaSLk1lc2ggPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1lc2goKTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlIHwgRGlyZWN0b3J5RW50cnkgfCBSZXNvdXJjZUZvbGRlciB8IEZ1bmN0aW9uO1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNtck9yYml0OiDGkkFpZC5DYW1lcmFPcmJpdDtcclxuICAgIHByaXZhdGUgcHJldmlld05vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG10eEltYWdlOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgIHByaXZhdGUgdGltZW91dERlZmVyOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIGNyZWF0ZSB2aWV3cG9ydCBmb3IgM0QtcmVzb3VyY2VzXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgLy8gY21wQ2FtZXJhLnBpdm90LnRyYW5zbGF0ZShuZXcgxpIuVmVjdG9yMygxLCAyLCAxKSk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC5sb29rQXQoxpIuVmVjdG9yMy5aRVJPKCkpO1xyXG4gICAgICBjbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUpO1xyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IMaSQWlkLkNhbnZhcy5jcmVhdGUodHJ1ZSwgxpJBaWQuSU1BR0VfUkVOREVSSU5HLlBJWEVMQVRFRCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5pbml0aWFsaXplKFwiUHJldmlld1wiLCBudWxsLCBjbXBDYW1lcmEsIGNhbnZhcyk7XHJcbiAgICAgIC8vIMaSLlJlbmRlcldlYkdMLnNldENhbnZhc1NpemUoMSwgMSk7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQgPSDGkkFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlID0gdGhpcy5jcmVhdGVTdGFuZGFyZEdyYXBoKCk7XHJcblxyXG4gICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk6IMaSLk1hdGVyaWFsIHtcclxuICAgICAgbGV0IG10clN0YW5kYXJkOiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbChcIlN0YW5kYXJkTWF0ZXJpYWxcIiwgxpIuU2hhZGVyRmxhdCwgbmV3IMaSLkNvYXRSZW1pc3NpdmUoxpIuQ29sb3IuQ1NTKFwid2hpdGVcIikpKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKG10clN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG10clN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZVN0YW5kYXJkTWVzaCgpOiDGki5NZXNoIHtcclxuICAgICAgbGV0IG1lc2hTdGFuZGFyZDogxpIuTWVzaFNwaGVyZSA9IG5ldyDGki5NZXNoU3BoZXJlKFwiU3BoZXJlXCIsIDIwLCAxMik7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtZXNoU3RhbmRhcmQpO1xyXG4gICAgICByZXR1cm4gbWVzaFN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJJbGx1bWluYXRlIEdyYXBoXCIsIGlkOiBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXSwgY2hlY2tlZDogdHJ1ZSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIC8vIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgLy8gY2FzZSBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXTpcclxuICAgICAgLy8gICB0aGlzLmlsbHVtaW5hdGVHcmFwaCgpO1xyXG4gICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGhuZE1vdXNlID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoXCJkaXYjaW1hZ2VcIik7XHJcbiAgICAgIGlmICghZGl2KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwibW91c2Vtb3ZlXCI6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKF9ldmVudC5tb3ZlbWVudFgpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKF9ldmVudC5tb3ZlbWVudFkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndoZWVsXCI6XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoXHJcbiAgICAgICAgICAgIF9ldmVudC5vZmZzZXRYIC0gdGhpcy5kb20uY2xpZW50V2lkdGgsIF9ldmVudC5vZmZzZXRZIC0gdGhpcy5kb20uY2xpZW50SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICBsZXQgem9vbTogbnVtYmVyID0gTWF0aC5leHAoLV9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG9mZnNldC50b1N0cmluZygpKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVYKHpvb20pO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5zY2FsZVkoem9vbSk7XHJcbiAgICAgICAgICBvZmZzZXQuc2NhbGUoem9vbSAtIDEpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKC1vZmZzZXQueCk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnRyYW5zbGF0ZVkoLW9mZnNldC55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0VHJhbnNmb3JtKF9kaXY6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB0cmFuc2Zvcm06IEZsb2F0MzJBcnJheSA9IHRoaXMubXR4SW1hZ2UuZ2V0KCk7XHJcbiAgICAgIHRyYW5zZm9ybSA9IHRyYW5zZm9ybS5jb3B5V2l0aGluKDUsIDYpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbigyLCAzKTtcclxuICAgICAgX2Rpdi5zdHlsZS50cmFuc2Zvcm0gPSBgbWF0cml4KCR7dHJhbnNmb3JtLnNsaWNlKDAsIDYpLmpvaW4oKX0pYDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBpZiAoIXRoaXMucmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlNlbGVjdCBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCByZXNvdXJjZSB0byBwcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByZXZpZXdcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGlnaHRzUHJlc2VudDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHRoaXMucmVzb3VyY2UudHlwZSB8fCBcIkZ1bmN0aW9uXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTWVzaClcclxuICAgICAgICB0eXBlID0gXCJNZXNoXCI7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgICAgbGV0IHByZXZpZXdPYmplY3Q6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdPYmplY3RcIik7XHJcbiAgICAgIGxldCBwcmV2aWV3OiBIVE1MRWxlbWVudDtcclxuICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIkZ1bmN0aW9uXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVTY3JpcHRQcmV2aWV3KDxGdW5jdGlvbj50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGlmIChwcmV2aWV3KVxyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChwcmV2aWV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJGaWxlXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVGaWxlUHJldmlldyg8RGlyZWN0b3J5RW50cnk+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiTWVzaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goPMaSLk1lc2g+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKFZpZXdQcmV2aWV3Lm10clN0YW5kYXJkKSk7XHJcbiAgICAgICAgICB0aGlzLnNldFZpZXdPYmplY3QocHJldmlld09iamVjdCk7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhKCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1hdGVyaWFsXCI6XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWVzaChWaWV3UHJldmlldy5tZXNoU3RhbmRhcmQpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbCg8xpIuTWF0ZXJpYWw+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJHcmFwaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hcHBlbmRDaGlsZCg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZSg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsaWdodHNQcmVzZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICB0aGlzLmlsbHVtaW5hdGUoIWxpZ2h0c1ByZXNlbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJQUkVWSUVXXCIgOiBcIlByZXZpZXdcIn0gfCAke3RoaXMucmVzb3VyY2UubmFtZX1gKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3MoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kZWZlcigoKSA9PiB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiVGV4dHVyZUltYWdlXCI6XHJcbiAgICAgICAgY2FzZSBcIkFuaW1hdGlvblNwcml0ZVwiOlxyXG4gICAgICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgZGl2LmlkID0gXCJpbWFnZVwiO1xyXG4gICAgICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICAgIGlmICh0eXBlID09IFwiVGV4dHVyZUltYWdlXCIpIHtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+dGhpcy5yZXNvdXJjZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvblNwcml0ZTogxpIuQW5pbWF0aW9uU3ByaXRlID0gPMaSLkFuaW1hdGlvblNwcml0ZT50aGlzLnJlc291cmNlO1xyXG4gICAgICAgICAgICBpbWcgPSAoPMaSLlRleHR1cmVJbWFnZT5hbmltYXRpb25TcHJpdGUudGV4dHVyZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25zOiDGki5WZWN0b3IyW10gPSBhbmltYXRpb25TcHJpdGUuZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gYW5pbWF0aW9uU3ByaXRlLmdldE11dGF0b3IoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcG9zaXRpb24gb2YgcG9zaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3Q6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgIHJlY3QuY2xhc3NOYW1lID0gXCJyZWN0U3ByaXRlXCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS5sZWZ0ID0gcG9zaXRpb24ueCArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS50b3AgPSBwb3NpdGlvbi55ICsgMSArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLndpZHRoID0gbXV0YXRvci5zaXplLnggLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUuaGVpZ2h0ID0gbXV0YXRvci5zaXplLnkgLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXVkaW9cIjpcclxuICAgICAgICAgIGxldCBlbnRyeTogRGlyZWN0b3J5RW50cnkgPSBuZXcgRGlyZWN0b3J5RW50cnkoKDzGki5BdWRpbz50aGlzLnJlc291cmNlKS5wYXRoLnRvU3RyaW5nKCksIFwiXCIsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBdWRpb1ByZXZpZXcoZW50cnkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKGBQcmV2aWV3IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGFuZGFyZEdyYXBoKCk6IMaSLk5vZGUge1xyXG4gICAgICBsZXQgZ3JhcGg6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdTY2VuZVwiKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2goZ3JhcGgpO1xyXG5cclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKTtcclxuICAgICAgZ3JhcGguYWRkQ2hpbGQobm9kZUxpZ2h0KTtcclxuICAgICAgxpJBaWQuYWRkU3RhbmRhcmRMaWdodENvbXBvbmVudHMobm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudmlld3BvcnQuY2FudmFzKTtcclxuXHJcbiAgICAgIGxldCBwcmV2aWV3Tm9kZTogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld05vZGVcIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKHByZXZpZXdOb2RlKTtcclxuICAgICAgcmV0dXJuIHByZXZpZXdOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Vmlld09iamVjdChfbm9kZTogxpIuTm9kZSwgX2dyYXBoSWxsdW1pbmF0aW9uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlLmFkZENoaWxkKF9ub2RlKTtcclxuICAgICAgdGhpcy5pbGx1bWluYXRlKHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbGx1bWluYXRlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgbm9kZUxpZ2h0OiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKT8uZ2V0Q2hpbGRyZW5CeU5hbWUoXCJQcmV2aWV3SWxsdW1pbmF0aW9uXCIpWzBdO1xyXG4gICAgICBub2RlTGlnaHQuYWN0aXZhdGUoX29uKTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUZpbGVQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBtaW1lOiBNSU1FID0gX2VudHJ5LmdldE1pbWVUeXBlKCk7XHJcbiAgICAgIHN3aXRjaCAobWltZSkge1xyXG4gICAgICAgIGNhc2UgTUlNRS5URVhUOiByZXR1cm4gdGhpcy5jcmVhdGVUZXh0UHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5BVURJTzogcmV0dXJuIHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgICAgY2FzZSBNSU1FLklNQUdFOiByZXR1cm4gdGhpcy5jcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRleHRQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gX2VudHJ5LmdldEZpbGVDb250ZW50KCk7XHJcbiAgICAgIHJldHVybiBwcmU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUltYWdlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgaW1nLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBpbWcuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgYmxhY2tcIjtcclxuICAgICAgcmV0dXJuIGltZztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBhdWRpbzogSFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgYXVkaW8uc3JjID0gX2VudHJ5LnBhdGg7XHJcbiAgICAgIGF1ZGlvLnBsYXkoKTtcclxuICAgICAgYXVkaW8uY29udHJvbHMgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gYXVkaW87XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVNjcmlwdFByZXZpZXcoX3NjcmlwdDogRnVuY3Rpb24pOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgbGV0IGNvZGU6IHN0cmluZyA9IF9zY3JpcHQudG9TdHJpbmcoKTtcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIiAgICBcIiwgXCIgXCIpO1xyXG4gICAgICBwcmUudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIC8vIGlmIChbxpIuQXVkaW8sIMaSLlRleHR1cmUsIMaSLkFuaW1hdGlvblNwcml0ZV0uc29tZSgoX3R5cGUpID0+IHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBfdHlwZSkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuQXVkaW8gfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLlRleHR1cmUgfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSlcclxuICAgICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5kZXRhaWwpXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gX2V2ZW50LmRldGFpbC5kYXRhLnNjcmlwdDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlc2V0Q2FtZXJhKCk6IHZvaWQge1xyXG4gICAgICBsZXQgYnJhbmNoOiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUoYnJhbmNoKTtcclxuICAgICAgbGV0IHI6IG51bWJlciA9IGJyYW5jaC5yYWRpdXM7XHJcblxyXG4gICAgICB0aGlzLmNtck9yYml0Lm10eExvY2FsLnRyYW5zbGF0aW9uID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLmNtck9yYml0LnJvdGF0aW9uWCA9IC0zMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblkgPSAzMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5kaXN0YW5jZSA9IHIgKiAzO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRlZmVyKF9mdW5jdGlvbjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMudGltZW91dERlZmVyKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgX2Z1bmN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHByb3BlcnRpZXMgb2YgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJvcGVydGllcyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRlbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByb3BlcnRpZXMgfCBcIiArIHRoaXMucmVzb3VyY2UubmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5NdXRhYmxlKSB7XHJcbiAgICAgICAgICBsZXQgZmllbGRzZXQ6IMaSdWkuRGV0YWlscyA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZSh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGxldCB1aU11dGFibGU6IENvbnRyb2xsZXJEZXRhaWwgPSBuZXcgQ29udHJvbGxlckRldGFpbCh0aGlzLnJlc291cmNlLCBmaWVsZHNldCk7XHJcbiAgICAgICAgICBjb250ZW50ID0gdWlNdXRhYmxlLmRvbUVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgRGlyZWN0b3J5RW50cnkgJiYgdGhpcy5yZXNvdXJjZS5zdGF0cykge1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJTaXplOiBcIiArICh0aGlzLnJlc291cmNlLnN0YXRzW1wic2l6ZVwiXSAvIDEwMjQpLnRvRml4ZWQoMikgKyBcIiBLaUI8YnIvPlwiO1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJDcmVhdGVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJiaXJ0aHRpbWVcIl0udG9Mb2NhbGVTdHJpbmcoKSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiTW9kaWZpZWQ6IFwiICsgdGhpcy5yZXNvdXJjZS5zdGF0c1tcImN0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5yZXNvdXJjZS50b0hpZXJhcmNoeVN0cmluZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIFNjcmlwdEluZm8pIHtcclxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnJlc291cmNlLnNjcmlwdCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSB0aGlzLnJlc291cmNlLnNjcmlwdFtrZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm5hbWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgIHZhbHVlID0gXCJBcnJheShcIiArIHZhbHVlLmxlbmd0aCArIFwiKVwiO1xyXG4gICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBrZXkgKyBcIjogXCIgKyB2YWx1ZSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgICAgbGV0IGVudHJpZXM6IHsgW25hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge30gO1xyXG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLnJlc291cmNlLmVudHJpZXMpIHtcclxuICAgICAgICAgICAgZW50cmllc1tlbnRyeS50eXBlXSA9IChlbnRyaWVzW2VudHJ5LnR5cGVdID8/IDApICsgMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gYEVudHJpZXM6ICR7dGhpcy5yZXNvdXJjZS5lbnRyaWVzLmxlbmd0aH08YnIvPmA7XHJcbiAgICAgICAgICBmb3IgKGxldCB0eXBlIGluIGVudHJpZXMpXHJcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IGAke3R5cGV9OiAke2VudHJpZXNbdHlwZV19PGJyLz5gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiUHJvcGVydGllc1wiKTtcclxuICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IFwiU2VsZWN0IGFuIGludGVybmFsIG9yIGV4dGVybmFsIHJlc291cmNlIHRvIGV4YW1pbmUgcHJvcGVydGllc1wiO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZChjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLnJlc291cmNlID0gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPihfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6IC8vIGxldCBtb2RpZnkgcGFzc1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIHNjcmlwdHMgbG9hZGVkXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMC0yM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3U2NyaXB0IGV4dGVuZHMgVmlldyB7XHJcbiAgICAvLyBUT0RPOiBjb25zaWRlciBzY3JpcHQgbmFtZXNwYWNlcyDGki5TY3JpcHROYW1lc3BhY2VzIHRvIGZpbmQgYWxsIHNjcmlwdHMgbm90IGp1c3QgQ29tcG9uZW50U2NyaXB0c1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTxTY3JpcHRJbmZvPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RTY3JpcHRzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGBEcmFnICYgZHJvcCBzY3JpcHRzIG9uIFwiQ29tcG9uZW50c1wiYDtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgbGV0IHNjcmlwdGluZm9zOiBTY3JpcHRJbmZvW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgbmFtZXNwYWNlIGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcykge1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4IGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdKSB7XHJcbiAgICAgICAgICBsZXQgc2NyaXB0OiBGdW5jdGlvbiA9IMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdW2luZGV4XTtcclxuICAgICAgICAgIGlmIChzY3JpcHQubmFtZSlcclxuICAgICAgICAgICAgc2NyaXB0aW5mb3MucHVzaChuZXcgU2NyaXB0SW5mbyhzY3JpcHQsIG5hbWVzcGFjZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8U2NyaXB0SW5mbz4obmV3IENvbnRyb2xsZXJUYWJsZVNjcmlwdCgpLCBzY3JpcHRpbmZvcyk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogU2NyaXB0SW5mb1tdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBTY3JpcHRJbmZvW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIC8vIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgIC8vICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgLy8gICByZXR1cm4gbWVudTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmRldGFpbC5kYXRhKVxyXG4gICAgICAgICAgICB0aGlzLmxpc3RTY3JpcHRzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iXX0=