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
var Fudge;
(function (Fudge) {
    var ƒ = FudgeCore;
    function inGraphInstance(_node, _excludeNode = true) {
        let path = _node.getPath().reverse();
        if (_excludeNode)
            path.shift();
        for (let ancestor of path)
            if (ancestor instanceof ƒ.GraphInstance) {
                return ancestor;
            }
        return null;
    }
    Fudge.inGraphInstance = inGraphInstance;
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
            if (_viewSource instanceof Fudge.ViewHierarchy)
                // //@ts-ignore
                _viewSource.dispatch(Fudge.EVENT_EDITOR.UPDATE, { detail: { view: this /* , data: _viewSource.graph */ } });
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
        UrlOnMeshGLTF: { fromViews: [Fudge.ViewExternal], onKeyAttribute: "url", onTypeAttribute: "MeshGLTF", ofType: Fudge.DirectoryEntry, dropEffect: "link" }
    };
    class ControllerDetail extends ƒUi.Controller {
        #view;
        constructor(_mutable, _domElement, _view) {
            super(_mutable, _domElement);
            this.#view = _view;
            this.domElement.addEventListener("dragover" /* ƒUi.EVENT.DRAG_OVER */, this.hndDragOver);
            this.domElement.addEventListener("dragenter" /* ƒUi.EVENT.DRAG_ENTER */, this.hndDragOver);
            this.domElement.addEventListener("drop" /* ƒUi.EVENT.DROP */, this.hndDrop);
            this.domElement.addEventListener("keydown" /* ƒUi.EVENT.KEY_DOWN */, this.hndKey);
            this.domElement.addEventListener("insert" /* ƒUi.EVENT.INSERT */, this.hndInsert);
        }
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
            let { mutable, key } = this.getTargetMutableAndKey(_event);
            let metaTypes = mutable.getMetaAttributeTypes?.() ?? {};
            let metaType = metaTypes[key];
            // console.log(key, metaTypes, metaType);
            let sources = Fudge.View.getViewSource(_event).getDragDropSources();
            if (!metaType || (metaType && typeof metaType == "function" && !(sources[0] instanceof metaType)))
                return;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
            _event.stopPropagation();
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
            // texture
            if (this.filterDragDrop(_event, filter.UrlOnTexture, setExternalLink))
                return;
            // texture
            if (this.filterDragDrop(_event, filter.UrlOnMeshOBJ, setExternalLink))
                return;
            // audio
            if (this.filterDragDrop(_event, filter.UrlOnAudio, setExternalLink))
                return;
            _event.preventDefault();
            _event.stopPropagation();
            let { mutable, key } = this.getTargetMutableAndKey(_event);
            if (this.#view != Fudge.View.getViewSource(_event)) {
                let sources = Fudge.View.getViewSource(_event).getDragDropSources();
                mutable[key] = sources[0];
            }
            this.#view.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
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
        getTargetMutableAndKey(_event) {
            let path = _event.composedPath();
            path = path.slice(0, path.indexOf(this.domElement));
            path = path.filter(_element => _element instanceof HTMLElement && (_element.getAttribute("type")));
            path.reverse();
            let mutable = this.mutable;
            let keys = path.map(_element => _element.getAttribute("key"));
            for (let i = 0; i < keys.length - 1; i++)
                mutable = mutable[keys[i]];
            return { mutable, key: keys[keys.length - 1] };
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
            if (_object instanceof ƒ.GraphInstance)
                ƒ.Project.getResource(_object.idSource).then(_graph => {
                    _object.name = _graph.name;
                    input.value = _graph.name;
                    input.disabled = true;
                    input.readOnly = true;
                });
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
                let instance = Fudge.inGraphInstance(_node);
                if (instance) {
                    ƒUi.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `Edit the graph "${instance.name}" to rename nodes, save and reload the project<br>Press OK to continue`, "OK", "");
                    return false;
                }
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
            for (let node of expend) {
                let instance = Fudge.inGraphInstance(node);
                if (instance) {
                    ƒUi.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `Edit the graph "${instance.name}" to delete "${node.name}", save and reload the project<br>Press OK to continue`, "OK", "");
                    return [];
                }
            }
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
            if (_event.type != Fudge.EVENT_EDITOR.UPDATE && _event.type != Fudge.EVENT_EDITOR.CREATE && _event.type != Fudge.EVENT_EDITOR.DELETE && _event.type != Fudge.EVENT_EDITOR.MODIFY)
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
                if (_mutator[property]?.constructor === Object) {
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
                ƒUi.Dialog.prompt(null, true, "ComponentTransform mandatory", `To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentTransform.name}.`, "OK", "");
                return;
            }
            if (cmpNew instanceof ƒ.ComponentGraphFilter && !(this.node instanceof ƒ.Graph)) {
                ƒUi.Dialog.prompt(null, true, "Root node only", `Attach ${ƒ.ComponentGraphFilter.name} to the root node of a graph`, "OK", "");
                // console.log(this.node);
                return;
            }
            if (cmpNew instanceof ƒ.ComponentFog || cmpNew instanceof ƒ.ComponentAmbientOcclusion || cmpNew instanceof ƒ.ComponentBloom) {
                let camera = this.node.getComponent(ƒ.ComponentCamera) ?? this.node.getComponent(ƒ.ComponentVRDevice);
                if (!camera) {
                    ƒUi.Dialog.prompt(null, true, "Post-Process effect", `To attach a ${cmpNew.type}, first attach a ${ƒ.ComponentCamera.name} or ${ƒ.ComponentVRDevice.name}.`, "OK", "");
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
                    ƒUi.Dialog.prompt(null, true, "Structural change on instance", `Edit the original graph "${check.name}" to make changes to its structure, then save and reload the project`, "OK", "");
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
                let controller = new Fudge.ControllerDetail(component, details, this);
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
                    let controller = Reflect.get(_event.target, "controller");
                    let mutable = controller.getMutable();
                    if (mutable instanceof ƒ.ComponentRigidbody) {
                        mutable.initialize();
                        this.dispatch(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true, detail: { node: this.node } }); // TODO: check if this was necessary, EVENT_EDITOR.UPDATE gets broadcasted by project on ƒ.EVENT.GRAPH_MUTATED, so this was causing a double broadcast of EVENT_EDITOR.UPDATE to ALL views on any change to any component
                    }
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
                    let instance = Fudge.inGraphInstance(focus, false);
                    if (instance) {
                        ƒUi.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `To add nodes, edit the graph "${instance.name}", then save and reload the project<br>Press OK to continue`, "OK", "");
                        return;
                    }
                    let child = new ƒ.Node("New Node");
                    this.tree.addChildren([child], focus);
                    this.tree.findVisible(child).focus();
                    this.tree.selectInterval(child, child);
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
                    // this.tree.delete([focus]);
                    this.tree.controller.delete([focus]).then(_deleted => {
                        if (_deleted.length == 0)
                            return;
                        focus.getParent().removeChild(focus);
                        ƒ.Physics.activeInstance = Fudge.Page.getPhysics(this.graph);
                        ƒ.Physics.cleanup();
                        this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    });
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
            let node = _event.detail?.data;
            switch (_event.type) {
                case "delete" /* ƒUi.EVENT.DELETE */:
                    this.dispatch(Fudge.EVENT_EDITOR.MODIFY, { bubbles: true });
                    break;
                case "rename" /* ƒUi.EVENT.RENAME */:
                    if (_event.detail.data instanceof ƒ.Graph) {
                        this.dispatch(Fudge.EVENT_EDITOR.UPDATE, { bubbles: true });
                    }
                    break;
                case "itemselect" /* ƒUi.EVENT.SELECT */:
                    //only dispatch the event to focus the node, if the node is in the current and the previous selection 
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
                        let path = _event.detail.node.getPath();
                        path = path.slice(path.findIndex((_node => _node instanceof ƒ.Graph)));
                        this.tree.show(path);
                        this.tree.controller.selection = [_event.detail.node];
                        this.tree.displaySelection(this.tree.controller.selection);
                        this.selectionPrevious = this.selection.slice(0);
                    }
                    break;
                case Fudge.EVENT_EDITOR.UPDATE:
                    if (_event.detail.view instanceof Fudge.ViewInternal)
                        this.setGraph(this.graph);
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
            this.dom.addEventListener(Fudge.EVENT_EDITOR.MODIFY, this.hndEvent);
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
            if (_viewSource instanceof Fudge.ViewHierarchy)
                // //@ts-ignore
                _viewSource.dispatch(Fudge.EVENT_EDITOR.UPDATE, { detail: { view: this /* , data: _viewSource.graph */ } });
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
                    let uiMutable = new Fudge.ControllerDetail(this.resource, fieldset, this);
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
                case Fudge.EVENT_EDITOR.MODIFY:
                    this.fillContent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvR2xvYmFsLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhZ2UudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJBbmltYXRpb24udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9WaWV3LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3RXh0ZXJuYWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbEZvbGRlci50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJEZXRhaWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVGFibGVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVNjcmlwdHMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZURpcmVjdG9yeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlSGllcmFyY2h5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlUmVzb3VyY2UudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxBbmltYXRpb24udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxHcmFwaC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEhlbHAudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFByb2plY3QudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9WaWV3UGFydGljbGVTeXN0ZW0udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9BbmltYXRpb24vVmlld0FuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uU2hlZXQudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9HcmFwaC9WaWV3Q29tcG9uZW50cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9HcmFwaC9WaWV3UmVuZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3SW50ZXJuYWxUYWJsZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1ByZXZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdQcm9wZXJ0aWVzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3U2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsS0FBSyxDQWlDZDtBQWpDRCxXQUFVLEtBQUs7SUFDYixtQ0FBbUM7SUFDbkMsd0JBQXdCO0lBU3hCLE1BQWEsV0FBVztRQUNmLE1BQU0s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QkFBaUI7UUFDakIsSUFBSTtRQUVKLDJIQUEySDtRQUMzSCxtRkFBbUY7UUFDbkYsSUFBSTtRQUNKLFlBQVk7UUFFSixRQUFRLEdBQUcsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDL0MsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUN6QixLQUFLLE1BQUEsWUFBWSxDQUFDLElBQUk7b0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUk7d0JBQ3JCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDckIsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDLENBQUM7S0FDSDtJQXhEWSxnQkFBVSxhQXdEdEIsQ0FBQTtBQUNILENBQUMsRUFqRVMsS0FBSyxLQUFMLEtBQUssUUFpRWQiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIC8vIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIC8vIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgQ29udGV4dE1lbnVDYWxsYmFjayA9IChtZW51SXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIGJyb3dzZXJXaW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIGV2ZW50OiBFbGVjdHJvbi5LZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICB0eXBlIFN1YmNsYXNzPFQ+ID0ge1xyXG4gICAgc3ViY2xhc3NlczogVFtdXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRDb3B5UGFzdGUoX21lbnU6IEVsZWN0cm9uLk1lbnUpOiB2b2lkIHtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcImNvcHlcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJjdXRcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJwYXN0ZVwiIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTdWJjbGFzc01lbnU8VCBleHRlbmRzIFN1YmNsYXNzPFQ+PihfaWQ6IENPTlRFWFRNRU5VLCBfY2xhc3M6IFQsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAobGV0IGlTdWJjbGFzcyBpbiBfY2xhc3Muc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIGxldCBzdWJjbGFzczogVCA9IF9jbGFzcy5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgIHsgbGFiZWw6IHN1YmNsYXNzLm5hbWUsIGlkOiBTdHJpbmcoX2lkKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpdGVtLm92ZXJyaWRlUHJvcGVydHkoXCJpU3ViY2xhc3NcIiwgaVN1YmNsYXNzKTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGV4cG9ydCBlbnVtIENPTlRFWFRNRU5VIHtcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICBBRERfTk9ERSxcclxuICAgIEFDVElWQVRFX05PREUsXHJcbiAgICBERUxFVEVfTk9ERSxcclxuICAgIEFERF9DT01QT05FTlQsXHJcbiAgICBERUxFVEVfQ09NUE9ORU5ULFxyXG4gICAgQUREX0NPTVBPTkVOVF9TQ1JJUFQsXHJcbiAgICBFRElULFxyXG4gICAgQ1JFQVRFX0ZPTERFUixcclxuICAgIENSRUFURV9NRVNILFxyXG4gICAgQ1JFQVRFX01BVEVSSUFMLFxyXG4gICAgQ1JFQVRFX0dSQVBILFxyXG4gICAgQ1JFQVRFX0FOSU1BVElPTixcclxuICAgIENSRUFURV9QQVJUSUNMRV9FRkZFQ1QsXHJcbiAgICBTWU5DX0lOU1RBTkNFUyxcclxuICAgIFJFTU9WRV9DT01QT05FTlQsXHJcbiAgICBBRERfSk9JTlQsXHJcbiAgICBERUxFVEVfUkVTT1VSQ0UsXHJcbiAgICBPUlRIR1JBUEhJQ19DQU1FUkEsXHJcbiAgICBSRU5ERVJfQ09OVElOVU9VU0xZLFxyXG4gICAgQUREX1BST1BFUlRZLFxyXG4gICAgREVMRVRFX1BST1BFUlRZLFxyXG4gICAgQ09OVkVSVF9BTklNQVRJT04sXHJcbiAgICBBRERfUEFSVElDTEVfUFJPUEVSVFksXHJcbiAgICBBRERfUEFSVElDTEVfRlVOQ1RJT04sXHJcbiAgICBBRERfUEFSVElDTEVfQ09OU1RBTlQsXHJcbiAgICBBRERfUEFSVElDTEVfQ09ERSxcclxuICAgIEFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTixcclxuICAgIERFTEVURV9QQVJUSUNMRV9EQVRBXHJcbiAgfVxyXG5cclxuXHJcbiAgZXhwb3J0IGVudW0gTUVOVSB7XHJcbiAgICBRVUlUID0gXCJxdWl0XCIsXHJcbiAgICBQUk9KRUNUX05FVyA9IFwicHJvamVjdE5ld1wiLFxyXG4gICAgUFJPSkVDVF9TQVZFID0gXCJwcm9qZWN0U2F2ZVwiLFxyXG4gICAgUFJPSkVDVF9MT0FEID0gXCJwcm9qZWN0TG9hZFwiLFxyXG4gICAgREVWVE9PTFNfT1BFTiA9IFwiZGV2dG9vbHNPcGVuXCIsXHJcbiAgICBQQU5FTF9HUkFQSF9PUEVOID0gXCJwYW5lbEdyYXBoT3BlblwiLFxyXG4gICAgUEFORUxfQU5JTUFUSU9OX09QRU4gPSBcInBhbmVsQW5pbWF0aW9uT3BlblwiLFxyXG4gICAgUEFORUxfUFJPSkVDVF9PUEVOID0gXCJwYW5lbFByb2plY3RPcGVuXCIsXHJcbiAgICBQQU5FTF9IRUxQX09QRU4gPSBcInBhbmVsSGVscE9wZW5cIixcclxuICAgIFBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOID0gXCJwYW5lbFBhcnRpY2xlU3lzdGVtT3BlblwiLFxyXG4gICAgRlVMTFNDUkVFTiA9IFwiZnVsbHNjcmVlblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBQQU5FTCB7XHJcbiAgICBHUkFQSCA9IFwiUGFuZWxHcmFwaFwiLFxyXG4gICAgUFJPSkVDVCA9IFwiUGFuZWxQcm9qZWN0XCIsXHJcbiAgICBIRUxQID0gXCJQYW5lbEhlbHBcIixcclxuICAgIEFOSU1BVElPTiA9IFwiUGFuZWxBbmltYXRpb25cIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiUGFuZWxQYXJ0aWNsZVN5c3RlbVwiXHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gVklFVyB7XHJcbiAgICBISUVSQVJDSFkgPSBcIlZpZXdIaWVyYXJjaHlcIixcclxuICAgIEFOSU1BVElPTiA9IFwiVmlld0FuaW1hdGlvblwiLFxyXG4gICAgQU5JTUFUSU9OX1NIRUVUID0gXCJWaWV3QW5pbWF0aW9uU2hlZXRcIixcclxuICAgIFJFTkRFUiA9IFwiVmlld1JlbmRlclwiLFxyXG4gICAgQ09NUE9ORU5UUyA9IFwiVmlld0NvbXBvbmVudHNcIixcclxuICAgIENBTUVSQSA9IFwiVmlld0NhbWVyYVwiLFxyXG4gICAgSU5URVJOQUxfVEFCTEUgPSBcIlZpZXdJbnRlcm5hbFRhYmxlXCIsXHJcbiAgICBJTlRFUk5BTF9GT0xERVIgPSBcIlZpZXdJbnRlcm5hbEZvbGRlclwiLFxyXG4gICAgRVhURVJOQUwgPSBcIlZpZXdFeHRlcm5hbFwiLFxyXG4gICAgUFJPUEVSVElFUyA9IFwiVmlld1Byb3BlcnRpZXNcIixcclxuICAgIFBSRVZJRVcgPSBcIlZpZXdQcmV2aWV3XCIsXHJcbiAgICBTQ1JJUFQgPSBcIlZpZXdTY3JpcHRcIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiVmlld1BhcnRpY2xlU3lzdGVtXCJcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICAvLyBNRVNIID0gVmlld01lc2gsXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBUUkFOU0ZPUk0ge1xyXG4gICAgVFJBTlNMQVRFID0gXCJ0cmFuc2xhdGVcIixcclxuICAgIFJPVEFURSA9IFwicm90YXRlXCIsXHJcbiAgICBTQ0FMRSA9IFwic2NhbGVcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gR0laTU9TIHtcclxuICAgIFRSQU5TRk9STSA9IFwiVHJhbnNmb3JtXCJcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBleHBvcnQgZW51bSBNSU1FIHtcclxuICAgIFRFWFQgPSBcInRleHRcIixcclxuICAgIEFVRElPID0gXCJhdWRpb1wiLFxyXG4gICAgSU1BR0UgPSBcImltYWdlXCIsXHJcbiAgICBNRVNIID0gXCJtZXNoXCIsXHJcbiAgICBHTFRGID0gXCJnbHRmXCIsXHJcbiAgICBVTktOT1dOID0gXCJ1bmtub3duXCJcclxuICB9XHJcblxyXG4gIGxldCBtaW1lOiBNYXA8TUlNRSwgc3RyaW5nW10+ID0gbmV3IE1hcChbXHJcbiAgICBbTUlNRS5URVhULCBbXCJ0c1wiLCBcImpzb25cIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCIsIFwianNcIiwgXCJ0eHRcIl1dLFxyXG4gICAgW01JTUUuTUVTSCwgW1wib2JqXCJdXSxcclxuICAgIFtNSU1FLkFVRElPLCBbXCJtcDNcIiwgXCJ3YXZcIiwgXCJvZ2dcIl1dLFxyXG4gICAgW01JTUUuSU1BR0UsIFtcInBuZ1wiLCBcImpwZ1wiLCBcImpwZWdcIiwgXCJ0aWZcIiwgXCJ0Z2FcIiwgXCJnaWZcIl1dLFxyXG4gICAgW01JTUUuR0xURiwgW1wiZ2x0ZlwiLCBcImdsYlwiXV1cclxuICBdKTtcclxuXHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBjb25zdCBwOiB0eXBlb2YgaW1wb3J0KFwicGF0aFwiKSA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG4gIHR5cGUgRGlyZW50ID0gaW1wb3J0KFwiZnNcIikuRGlyZW50O1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGlyZWN0b3J5RW50cnkge1xyXG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXRoUmVsYXRpdmU6IHN0cmluZztcclxuICAgIHB1YmxpYyBkaXJlbnQ6IERpcmVudDtcclxuICAgIHB1YmxpYyBzdGF0czogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nLCBfcGF0aFJlbGF0aXZlOiBzdHJpbmcsIF9kaXJlbnQ6IERpcmVudCwgX3N0YXRzOiBPYmplY3QpIHtcclxuICAgICAgdGhpcy5wYXRoID0gcC5ub3JtYWxpemUoX3BhdGgpO1xyXG4gICAgICB0aGlzLnBhdGhSZWxhdGl2ZSA9IHAubm9ybWFsaXplKF9wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB0aGlzLmRpcmVudCA9IF9kaXJlbnQ7XHJcbiAgICAgIHRoaXMuc3RhdHMgPSBfc3RhdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVSb290KF9wYXRoOiBzdHJpbmcpOiBEaXJlY3RvcnlFbnRyeSB7XHJcbiAgICAgIGxldCBkaXJlbnQ6IERpcmVudCA9IG5ldyBmcy5EaXJlbnQoKTtcclxuICAgICAgZGlyZW50Lm5hbWUgPSBwLmJhc2VuYW1lKF9wYXRoKTtcclxuICAgICAgZGlyZW50LmlzRGlyZWN0b3J5ID0gKCkgPT4gdHJ1ZTtcclxuICAgICAgcmV0dXJuIG5ldyBEaXJlY3RvcnlFbnRyeShfcGF0aCwgXCJcIiwgZGlyZW50LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZW50Lm5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IG5hbWUoX25hbWU6IHN0cmluZykge1xyXG4gICAgICBsZXQgbmV3UGF0aDogc3RyaW5nID0gcC5qb2luKHAuZGlybmFtZSh0aGlzLnBhdGgpLCBfbmFtZSk7XHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKG5ld1BhdGgpKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgYWxyZWFkeSBhIGZpbGUgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgJyR7X25hbWV9Jy4gU3BlY2lmeSBhIGRpZmZlcmVudCBuYW1lLmApO1xyXG4gICAgICBmcy5yZW5hbWVTeW5jKHRoaXMucGF0aCwgbmV3UGF0aCk7XHJcbiAgICAgIHRoaXMucGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgIHRoaXMuZGlyZW50Lm5hbWUgPSBfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRGlyZWN0b3J5KCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlbnQuaXNEaXJlY3RvcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJlY3RvcnkgPyBcIkRpcmVjdG9yeVwiIDogXCJGaWxlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgZnMucm1TeW5jKHRoaXMucGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERpcmVjdG9yeUNvbnRlbnQoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCBkaXJlbnRzOiBEaXJlbnRbXSA9IGZzLnJlYWRkaXJTeW5jKHRoaXMucGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgY29udGVudDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBkaXJlbnQgb2YgZGlyZW50cykge1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBwLmpvaW4odGhpcy5wYXRoLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHBhdGhSZWxhdGl2ZTogc3RyaW5nID0gcC5qb2luKHRoaXMucGF0aFJlbGF0aXZlLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHN0YXRzOiBPYmplY3QgPSBmcy5zdGF0U3luYyhwYXRoKTtcclxuICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KHBhdGgsIHBhdGhSZWxhdGl2ZSwgZGlyZW50LCBzdGF0cyk7XHJcbiAgICAgICAgY29udGVudC5wdXNoKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RmlsZUNvbnRlbnQoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLnBhdGgsIFwidXRmOFwiKTtcclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEVudHJ5KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiB2b2lkIHtcclxuICAgICAgZnMuY29weUZpbGVTeW5jKF9lbnRyeS5wYXRoLCBwLmpvaW4odGhpcy5wYXRoLCBfZW50cnkubmFtZSksIGZzLmNvbnN0YW50cy5DT1BZRklMRV9FWENMKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TWltZVR5cGUoKTogTUlNRSB7XHJcbiAgICAgIGxldCBleHRlbnNpb246IHN0cmluZyA9IHRoaXMubmFtZS5zcGxpdChcIi5cIikucG9wKCk7XHJcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgbWltZSkge1xyXG4gICAgICAgIGlmICh0eXBlWzFdLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xKVxyXG4gICAgICAgICAgcmV0dXJuIHR5cGVbMF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1JTUUuVU5LTk9XTjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBwYXRoIG9mIERpcmVjdG9yeUVudHJpZXMgc3RhcnRpbmcgYXQgdGhlIHJvb3QgYW5kIGVuZGluZyBhdCB0aGlzIERpcmVjdG9yeUVudHJ5LiBcclxuICAgICAqIFRoZSBlbnRyaWVzIGluIHRoZSByZXR1cm5lZCBwYXRoIE9OTFkgaGF2ZSB0aGVpciByZWxhdGl2ZSBwYXRoIHNldC4gVGhpcyBpcyBzb2xlbHkgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3NlcyBpbiB7QGxpbmsgVmlld0V4dGVybmFsfXMgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFBhdGgoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCB0cmFjZTogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudFBhdGg6IHN0cmluZyA9IHRoaXMucGF0aFJlbGF0aXZlO1xyXG4gICAgICB3aGlsZSAoY3VycmVudFBhdGggIT0gdHJhY2VbdHJhY2UubGVuZ3RoIC0gMV0/LnBhdGhSZWxhdGl2ZSkge1xyXG4gICAgICAgIHRyYWNlLnB1c2gobmV3IERpcmVjdG9yeUVudHJ5KFwiXCIsIGN1cnJlbnRQYXRoLCBudWxsLCBudWxsKSk7XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBwLmRpcm5hbWUoY3VycmVudFBhdGgpO1xyXG4gICAgICB9O1xyXG4gICAgICB0cmFjZS5yZXZlcnNlKCk7XHJcbiAgICAgIHJldHVybiB0cmFjZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgZW51bSBFVkVOVF9FRElUT1Ige1xyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIGNyZWF0ZWQsIGlzIG5vdCBkaXNwYXRjaGVkIHNvIGZhciAqL1xyXG4gICAgQ1JFQVRFID0gXCJFRElUT1JfQ1JFQVRFXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgc2VsZWN0ZWQgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byBzd2l0Y2ggY29udGVudHMgaW4gdGhlIHZpZXdzICovXHJcbiAgICBTRUxFQ1QgPSBcIkVESVRPUl9TRUxFQ1RcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBtb2RpZmllZCBzdHJ1Y3R1cmFsbHkgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byB1cGRhdGUgdmlld3MgKi9cclxuICAgIE1PRElGWSA9IFwiRURJVE9SX01PRElGWVwiLFxyXG4gICAgLyoqIFZhbHVlcyBvZiBhbiBlbnRpdHkgY2hhbmdlIGFuZCBpdCBpcyBuZWNlc3NhcnkgdG8gdXBkYXRlIHZpZXdzICovXHJcbiAgICBVUERBVEUgPSBcIkVESVRPUl9VUERBVEVcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBkZWxldGVkICovXHJcbiAgICBERUxFVEUgPSBcIkVESVRPUl9ERUxFVEVcIixcclxuICAgIC8qKiBBIHZpZXcgb3IgcGFuZWwgY2xvc2VzICovXHJcbiAgICBDTE9TRSA9IFwiRURJVE9SX0NMT1NFXCIsXHJcbiAgICAvKiogQSB2aWV3IG9yIHBhbmVsIG9wZW5zICovXHJcbiAgICBPUEVOID0gXCJFRElUT1JfT1BFTlwiXHJcbiAgICAvKiogQSB0cmFuc2Zvcm0gbWF0cml4IGdldHMgYWRqdXN0ZWQgaW50ZXJhY3RpdmVseSAqLyxcclxuICAgIFRSQU5TRk9STSA9IFwiRURJVE9SX1RSQU5TRk9STVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSByZWNpZXZlcyBmb2N1cyBhbmQgY2FuIGJlIG1hbmlwdWxhdGVkIHVzaW5nIHRoZSBrZXlib2FyZCAqL1xyXG4gICAgRk9DVVMgPSBcIkVESVRPUl9GT0NVU1wiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIEV2ZW50RGV0YWlsIHtcclxuICAgIHZpZXc/OiBWaWV3O1xyXG4gICAgc2VuZGVyPzogUGFuZWwgfCBQYWdlO1xyXG4gICAgbm9kZT86IMaSLk5vZGU7XHJcbiAgICBncmFwaD86IMaSLkdyYXBoO1xyXG4gICAgcmVzb3VyY2U/OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZTtcclxuICAgIG11dGFibGU/OiDGki5NdXRhYmxlO1xyXG4gICAgdHJhbnNmb3JtPzogT2JqZWN0O1xyXG4gICAgZGF0YT86IMaSLkdlbmVyYWw7XHJcbiAgICAvLyBwYXRoPzogVmlld1tdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIEN1c3RvbUV2ZW50IHRoYXQgc3VwcG9ydHMgYSBkZXRhaWwgZmllbGQgd2l0aCB0aGUgdHlwZSBFdmVudERldGFpbFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBFZGl0b3JFdmVudCBleHRlbmRzIEN1c3RvbUV2ZW50PEV2ZW50RGV0YWlsPiB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BhdGNoKF90YXJnZXQ6IEV2ZW50VGFyZ2V0LCBfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgZXhwb3J0IGxldCB3YXRjaGVyOiBpbXBvcnQoXCJmc1wiKS5GU1dhdGNoZXI7XHJcblxyXG4gIGludGVyZmFjZSBDb3B5TGlzdCB7XHJcbiAgICBbc3JjOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbmV3UHJvamVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBmaWxlbmFtZTogc3RyaW5nIHwgc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHByb3BlcnRpZXM6IFtcIm9wZW5EaXJlY3RvcnlcIiwgXCJjcmVhdGVEaXJlY3RvcnlcIl0sIHRpdGxlOiBcIlNlbGVjdC9DcmVhdGUgYSBmb2xkZXIgdG8gc2F2ZSB0aGUgcHJvamVjdCB0by4gVGhlIGZvbGRlcm5hbWUgYmVjb21lcyB0aGUgbmFtZSBvZiB5b3VyIHByb2plY3RcIiwgYnV0dG9uTGFiZWw6IFwiU2F2ZSBQcm9qZWN0XCJcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghZmlsZW5hbWUpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBsZXQgYmFzZTogVVJMID0gbmV3IFVSTChuZXcgVVJMKFwiZmlsZTovL1wiICsgZmlsZW5hbWVbMF0pLnRvU3RyaW5nKCkgKyBcIi9cIik7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBhdGhcIiwgYmFzZS50b1N0cmluZygpKTtcclxuICAgICAgXHJcbiAgICBwcm9qZWN0ID0gbmV3IFByb2plY3QoYmFzZSk7XHJcblxyXG4gICAgYXdhaXQgc2F2ZVByb2plY3QodHJ1ZSk7XHJcblxyXG4gICAgbGV0IMaSUGF0aDogVVJMID0gbmV3IFVSTChcIi4uLy4uL1wiLCBsb2NhdGlvbi5ocmVmKTtcclxuICAgIGNvbnNvbGUubG9nKMaSUGF0aCk7XHJcblxyXG4gICAgZnMuY29weUZpbGVTeW5jKG5ldyBVUkwoXCJFZGl0b3IvU291cmNlL1RlbXBsYXRlLy5naXRpZ25vcmUudHh0XCIsIMaSUGF0aCksIG5ldyBVUkwoXCIuZ2l0aWdub3JlXCIsIGJhc2UpKTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZVwiLCBiYXNlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICBmcy5ta2RpclN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2UvQHR5cGVzXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L0J1aWxkXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBsZXQgY29weVRlbXBsYXRlczogQ29weUxpc3QgPSB7XHJcbiAgICAgIFwiQ3VzdG9tQ29tcG9uZW50U2NyaXB0LnR4dFwiOiBcIlNvdXJjZS9DdXN0b21Db21wb25lbnRTY3JpcHQudHNcIixcclxuICAgICAgXCJNYWluLnR4dFwiOiBcIlNvdXJjZS9NYWluLnRzXCIsXHJcbiAgICAgIFwidHNjb25maWcudHh0XCI6IFwiU291cmNlL3RzY29uZmlnLmpzb25cIixcclxuICAgICAgXCJTY3JpcHQudHh0XCI6IFwiIEJ1aWxkL1NjcmlwdC5qc1wiLFxyXG4gICAgICBcIkF1dG92aWV3LmpzXCI6IFwiLi4vQXV0b3ZpZXcuanNcIlxyXG4gICAgfTtcclxuICAgIGNvcHlGaWxlcyhjb3B5VGVtcGxhdGVzLCBuZXcgVVJMKFwiRWRpdG9yL1NvdXJjZS9UZW1wbGF0ZS9cIiwgxpJQYXRoKSwgbmV3IFVSTChcIlNjcmlwdC9cIiwgYmFzZSkpO1xyXG5cclxuICAgIGxldCBkZWZpbml0aW9uOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIik7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlL0B0eXBlcy9GdWRnZUNvcmUuZC50c1wiLCBiYXNlKSwgYXdhaXQgZGVmaW5pdGlvbi50ZXh0KCkpO1xyXG5cclxuICAgIGF3YWl0IGxvYWRQcm9qZWN0KG5ldyBVUkwocHJvamVjdC5maWxlSW5kZXgsIHByb2plY3QuYmFzZSkpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29weUZpbGVzKF9saXN0OiBDb3B5TGlzdCwgX3NyY1BhdGg6IFVSTCwgX2Rlc3RQYXRoOiBVUkwpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IGNvcHkgaW4gX2xpc3QpIHtcclxuICAgICAgbGV0IHNyYzogVVJMID0gbmV3IFVSTChjb3B5LCBfc3JjUGF0aCk7XHJcbiAgICAgIGxldCBkZXN0OiBVUkwgPSBuZXcgVVJMKF9saXN0W2NvcHldLCBfZGVzdFBhdGgpO1xyXG4gICAgICBmcy5jb3B5RmlsZVN5bmMoc3JjLCBkZXN0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlUHJvamVjdChfbmV3OiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGlmICghcHJvamVjdClcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIGlmICghYXdhaXQgcHJvamVjdC5vcGVuRGlhbG9nKCkpXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB1bndhdGNoRm9sZGVyKCk7XHJcblxyXG4gICAgbGV0IGJhc2U6IFVSTCA9IHByb2plY3QuYmFzZTtcclxuXHJcbiAgICBpZiAoX25ldykge1xyXG4gICAgICBsZXQgY3NzRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlU3R5bGVzLCBiYXNlKTtcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhjc3NGaWxlTmFtZSwgcHJvamVjdC5nZXRQcm9qZWN0Q1NTKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sOiBzdHJpbmcgPSBwcm9qZWN0LmdldFByb2plY3RIVE1MKHByb2plY3QubmFtZSk7XHJcbiAgICBsZXQgaHRtbEZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUluZGV4LCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoaHRtbEZpbGVOYW1lLCBodG1sKTtcclxuXHJcbiAgICBsZXQganNvbkZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUludGVybmFsLCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoanNvbkZpbGVOYW1lLCBwcm9qZWN0LmdldFByb2plY3RKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlSW50ZXJuYWxGb2xkZXIsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlU2V0dGluZ3MsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0U2V0dGluZ3NKU09OKCkpO1xyXG5cclxuICAgIHdhdGNoRm9sZGVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9tcHRMb2FkUHJvamVjdCgpOiBQcm9taXNlPFVSTD4ge1xyXG4gICAgbGV0IGZpbGVuYW1lczogc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHRpdGxlOiBcIkxvYWQgUHJvamVjdFwiLCBidXR0b25MYWJlbDogXCJMb2FkIFByb2plY3RcIiwgcHJvcGVydGllczogW1wib3BlbkZpbGVcIl0sXHJcbiAgICAgIGZpbHRlcnM6IFt7IG5hbWU6IFwiSFRNTC1GaWxlXCIsIGV4dGVuc2lvbnM6IFtcImh0bWxcIiwgXCJodG1cIl0gfV1cclxuICAgIH0pO1xyXG4gICAgaWYgKCFmaWxlbmFtZXMpXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBVUkwoXCJmaWxlOi8vXCIgKyBmaWxlbmFtZXNbMF0pO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGh0bWxDb250ZW50OiBzdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoX3VybCwgeyBlbmNvZGluZzogXCJ1dGYtOFwiIH0pO1xyXG4gICAgxpIuRGVidWcuZ3JvdXBDb2xsYXBzZWQoXCJGaWxlIGNvbnRlbnRcIik7XHJcbiAgICDGki5EZWJ1Zy5pbmZvKGh0bWxDb250ZW50KTtcclxuICAgIMaSLkRlYnVnLmdyb3VwRW5kKCk7XHJcblxyXG4gICAgdW53YXRjaEZvbGRlcigpO1xyXG5cclxuICAgIHByb2plY3QgPSBuZXcgUHJvamVjdChfdXJsKTtcclxuICAgIGF3YWl0IHByb2plY3QubG9hZChodG1sQ29udGVudCk7XHJcblxyXG4gICAgd2F0Y2hGb2xkZXIoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHdhdGNoRm9sZGVyKCk6IHZvaWQge1xyXG4gICAgbGV0IGRpcjogVVJMID0gbmV3IFVSTChcIi5cIiwgcHJvamVjdC5iYXNlKTtcclxuICAgIHdhdGNoZXIgPSBmcy53YXRjaChkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0sIGhuZEZpbGVDaGFuZ2UpO1xyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGhuZEZpbGVDaGFuZ2UoX2V2ZW50OiBzdHJpbmcsIF9maWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlSW5kZXggfHwgX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZUludGVybmFsIHx8IF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVTY3JpcHQpIHtcclxuICAgICAgICB1bndhdGNoRm9sZGVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQobnVsbCwgZmFsc2UsIFwiSW1wb3J0YW50IGZpbGUgY2hhbmdlXCIsIFwiUmVsb2FkIHByb2plY3Q/XCIsIFwiUmVsb2FkXCIsIFwiQ2FuY2VsXCIpO1xyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICBhd2FpdCBsb2FkUHJvamVjdChwcm9qZWN0LmJhc2UpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgd2F0Y2hlciA9IGZzLndhdGNoKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSwgaG5kRmlsZUNoYW5nZSk7XHJcbiAgICAgIH1cclxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVud2F0Y2hGb2xkZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXdhdGNoZXIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHdhdGNoZXIudW5yZWYoKTtcclxuICAgIHdhdGNoZXIuY2xvc2UoKTtcclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gaW5HcmFwaEluc3RhbmNlKF9ub2RlOiDGki5Ob2RlLCBfZXhjbHVkZU5vZGU6IGJvb2xlYW4gPSB0cnVlKTogxpIuR3JhcGhJbnN0YW5jZSB7XHJcbiAgICBsZXQgcGF0aDogxpIuTm9kZVtdID0gX25vZGUuZ2V0UGF0aCgpLnJldmVyc2UoKTtcclxuICAgIGlmIChfZXhjbHVkZU5vZGUpXHJcbiAgICAgIHBhdGguc2hpZnQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBhbmNlc3RvciBvZiBwYXRoKVxyXG4gICAgICBpZiAoYW5jZXN0b3IgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuY2VzdG9yO1xyXG4gICAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHR5cGVzPVwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uL0VsZWN0cm9uXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCJEZWZpbml0aW9uLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLy8gaW1wb3J0IMaSYWlkID0gRnVkZ2VBaWQ7XHJcbiAgLy8gaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjb25zdCBpcGNSZW5kZXJlcjogRWxlY3Ryb24uSXBjUmVuZGVyZXIgPSByZXF1aXJlKFwiZWxlY3Ryb25cIikuaXBjUmVuZGVyZXI7IC8vIFJlcGxhY2Ugd2l0aDpcclxuICBleHBvcnQgY29uc3QgcmVtb3RlOiB0eXBlb2YgaW1wb3J0KFwiQGVsZWN0cm9uL3JlbW90ZVwiKSA9IHJlcXVpcmUoXCJAZWxlY3Ryb24vcmVtb3RlXCIpO1xyXG5cclxuICBleHBvcnQgbGV0IHByb2plY3Q6IFByb2plY3Q7IC8vID0gbmV3IFByb2plY3QoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHVwcGVybW9zdCBjb250YWluZXIgZm9yIGFsbCBwYW5lbHMgY29udHJvbGxpbmcgZGF0YSBmbG93IGJldHdlZW4uIFxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYWdlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ29sZGVuTGF5b3V0TW9kdWxlOiDGki5HZW5lcmFsID0gKGdsb2JhbFRoaXMgYXMgxpIuR2VuZXJhbCkuZ29sZGVuTGF5b3V0OyAgLy8gxpIuR2VuZXJhbCBpcyBzeW5vbnltIGZvciBhbnkuLi4gaGFjayB0byBnZXQgR29sZGVuTGF5b3V0IHRvIHdvcmtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW9kZVRyYW5zZm9ybTogVFJBTlNGT1JNID0gVFJBTlNGT1JNLlRSQU5TTEFURTtcclxuICAgIC8vIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIGdvbGRlbkxheW91dDogR29sZGVuTGF5b3V0O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFuZWxzOiBQYW5lbFtdID0gW107XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwaHlzaWNzOiB7IFtpZEdyYXBoOiBzdHJpbmddOiDGki5QaHlzaWNzIH0gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldERlZmF1bHRQcm9qZWN0KCk6IHZvaWQge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlNldCBkZWZhdWx0IHByb2plY3QgaW4gbG9jYWwgc3RvcmFnZVwiLCBwcm9qZWN0KTtcclxuICAgICAgaWYgKHByb2plY3QpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm9qZWN0XCIsIHByb2plY3QuYmFzZS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldExheW91dCgpOiBSZXNvbHZlZExheW91dENvbmZpZyB7XHJcbiAgICAgIHJldHVybiBQYWdlLmdvbGRlbkxheW91dC5zYXZlTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTGF5b3V0KF9sYXlvdXQ/OiBMYXlvdXRDb25maWcpOiB2b2lkIHtcclxuICAgICAgX2xheW91dCA/Pz0ge1xyXG4gICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgcG9wb3V0OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcm9vdDoge1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGlzQ2xvc2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgY29udGVudDogW11cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5sb2FkTGF5b3V0KF9sYXlvdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0VHJhbnNmb3JtKF9tb2RlOiBUUkFOU0ZPUk0pOiB2b2lkIHtcclxuICAgICAgUGFnZS5tb2RlVHJhbnNmb3JtID0gX21vZGU7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBUcmFuc2Zvcm0gbW9kZTogJHtfbW9kZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFBoeXNpY3MoX2dyYXBoOiDGki5HcmFwaCk6IMaSLlBoeXNpY3Mge1xyXG4gICAgICByZXR1cm4gUGFnZS5waHlzaWNzW19ncmFwaC5pZFJlc291cmNlXSB8fCAoUGFnZS5waHlzaWNzW19ncmFwaC5pZFJlc291cmNlXSA9IG5ldyDGki5QaHlzaWNzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBieSB3aW5kb3dzIGxvYWQtbGlzdGVuZXJcclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAvLyDGki5EZWJ1Zy5zZXRGaWx0ZXIoxpIuRGVidWdDb25zb2xlLCDGki5ERUJVR19GSUxURVIuQUxMIHwgxpIuREVCVUdfRklMVEVSLlNPVVJDRSk7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcIkxvY2FsU3RvcmFnZVwiLCBsb2NhbFN0b3JhZ2UpO1xyXG5cclxuICAgICAgUGFnZS5zZXR1cEdvbGRlbkxheW91dCgpO1xyXG4gICAgICDGki5Qcm9qZWN0Lm1vZGUgPSDGki5NT0RFLkVESVRPUjtcclxuXHJcbiAgICAgIFBhZ2Uuc2V0dXBNYWluTGlzdGVuZXJzKCk7XHJcbiAgICAgIFBhZ2Uuc2V0dXBQYWdlTGlzdGVuZXJzKCk7XHJcbiAgICAgIC8vIGZvciB0ZXN0aW5nOlxyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUEFORUxfUFJPSkVDVF9PUEVOKTtcclxuICAgICAgLy8gaXBjUmVuZGVyZXIuZW1pdChNRU5VLlBBTkVMX0dSQVBIX09QRU4pO1xyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUFJPSkVDVF9MT0FEKTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9HUkFQSF9PUEVOLCBvbjogZmFsc2UgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfSEVMUF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuXHJcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UucHJvamVjdCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZCBwcm9qZWN0IHJlZmVyZW5jZWQgaW4gbG9jYWwgc3RvcmFnZVwiLCBsb2NhbFN0b3JhZ2UucHJvamVjdCk7XHJcbiAgICAgICAgYXdhaXQgUGFnZS5sb2FkUHJvamVjdChuZXcgVVJMKGxvY2FsU3RvcmFnZS5wcm9qZWN0KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR1cEdvbGRlbkxheW91dCgpOiB2b2lkIHtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQgPSBuZXcgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuR29sZGVuTGF5b3V0KCk7IC8vIEdvbGRlbkxheW91dCAyIGFzIFVNRC1Nb2R1bGVcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQub24oXCJpdGVtQ3JlYXRlZFwiLCBQYWdlLmhuZFBhbmVsQ3JlYXRlZCk7XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLlBST0pFQ1QsIFBhbmVsUHJvamVjdCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuR1JBUEgsIFBhbmVsR3JhcGgpO1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLkhFTFAsIFBhbmVsSGVscCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuQU5JTUFUSU9OLCBQYW5lbEFuaW1hdGlvbik7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuUEFSVElDTEVfU1lTVEVNLCBQYW5lbFBhcnRpY2xlU3lzdGVtKTtcclxuXHJcbiAgICAgIFBhZ2UubG9hZExheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFkZChfcGFuZWw6IHR5cGVvZiBQYW5lbCwgX3N0YXRlPzogSnNvblZhbHVlKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhbmVsQ29uZmlnOiBDb21wb25lbnRJdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgY29tcG9uZW50VHlwZTogX3BhbmVsLm5hbWUsXHJcbiAgICAgICAgY29tcG9uZW50U3RhdGU6IF9zdGF0ZSxcclxuICAgICAgICB0aXRsZTogXCJQYW5lbFwiLFxyXG4gICAgICAgIGlkOiBQYWdlLmdlbmVyYXRlSUQoX3BhbmVsLm5hbWUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBpZiAoIVBhZ2UuZ29sZGVuTGF5b3V0LnJvb3RJdGVtKSAgLy8gd29ya2Fyb3VuZCBiZWNhdXNlIGdvbGRlbiBMYXlvdXQgbG9zZXMgcm9vdEl0ZW0uLi5cclxuICAgICAgLy8gICBQYWdlLmxvYWRMYXlvdXQoKTsgLy8gVE9ETzogdGhlc2UgdHdvIGxpbmVzIGFwcGVhciB0byBiZSBvYnNvbGV0ZSwgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5hZGRJdGVtQXRMb2NhdGlvbihwYW5lbENvbmZpZywgW3sgdHlwZUlkOiBMYXlvdXRNYW5hZ2VyLkxvY2F0aW9uU2VsZWN0b3IuVHlwZUlkLlJvb3QgfV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGZpbmQoX3R5cGU6IHR5cGVvZiBQYW5lbCk6IFBhbmVsW10ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBQYW5lbFtdID0gW107XHJcbiAgICAgIHJlc3VsdCA9IFBhZ2UucGFuZWxzLmZpbHRlcihfcGFuZWwgPT4gX3BhbmVsIGluc3RhbmNlb2YgX3R5cGUpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlSUQoX25hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xyXG4gICAgICB3aGlsZSAodGhpcy5nb2xkZW5MYXlvdXQuZmluZEZpcnN0Q29tcG9uZW50SXRlbUJ5SWQoX25hbWUgKyBpKSlcclxuICAgICAgICBpKys7XHJcbiAgICAgIHJldHVybiBfbmFtZSArIGk7IC8vIF9uYW1lICsgUGFnZS5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gUGFnZS1FdmVudHMgZnJvbSBET01cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwUGFnZUxpc3RlbmVycygpOiB2b2lkIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgUGFnZS5obmRLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBTZW5kIGN1c3RvbSBjb3BpZXMgb2YgdGhlIGdpdmVuIGV2ZW50IHRvIHRoZSBwYW5lbHMgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGJyb2FkY2FzdChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBkZXRhaWw6IEV2ZW50RGV0YWlsID0gX2V2ZW50LmRldGFpbCB8fCB7fTtcclxuICAgICAgbGV0IHNlbmRlcjogUGFuZWwgfCBQYWdlID0gZGV0YWlsPy5zZW5kZXI7XHJcbiAgICAgIGRldGFpbC5zZW5kZXIgPSBQYWdlO1xyXG4gICAgICBmb3IgKGxldCBwYW5lbCBvZiBQYWdlLnBhbmVscykge1xyXG4gICAgICAgIGlmIChwYW5lbCAhPSBzZW5kZXIpIC8vIGRvbid0IHNlbmQgYmFjayB0byBvcmlnaW5hbCBzZW5kZXJcclxuICAgICAgICAgIHBhbmVsLmRpc3BhdGNoKDxFVkVOVF9FRElUT1I+X2V2ZW50LnR5cGUsIHsgZGV0YWlsOiBkZXRhaWwgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5UOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlRSQU5TTEFURSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuUjpcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKFRSQU5TRk9STS5ST1RBVEUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkU6XHJcbiAgICAgICAgICAvLyBUT0RPOiBkb24ndCBzd2l0Y2ggdG8gc2NhbGUgbW9kZSB3aGVuIHVzaW5nIGZseS1jYW1lcmEgYW5kIHByZXNzaW5nIEVcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKFRSQU5TRk9STS5TQ0FMRSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRFdmVudChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGxldCB2aWV3OiBWaWV3ID0gX2V2ZW50LmRldGFpbC52aWV3O1xyXG4gICAgICAgICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBQYW5lbClcclxuICAgICAgICAgICAgUGFnZS5wYW5lbHMuc3BsaWNlKFBhZ2UucGFuZWxzLmluZGV4T2YodmlldyksIDEpO1xyXG5cclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIsIHZpZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIFBhZ2UuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaG5kUGFuZWxDcmVhdGVkID0gKF9ldmVudDogRXZlbnRFbWl0dGVyLkJ1YmJsaW5nRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogQ29tcG9uZW50SXRlbSA9IF9ldmVudC50YXJnZXQgYXMgQ29tcG9uZW50SXRlbTtcclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkNvbXBvbmVudEl0ZW0pIHtcclxuICAgICAgICBQYWdlLnBhbmVscy5wdXNoKDxQYW5lbD50YXJnZXQuY29tcG9uZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBsb2FkUHJvamVjdChfdXJsOiBVUkwpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgYXdhaXQgbG9hZFByb2plY3QoX3VybCk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUFJPSkVDVF9TQVZFLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0FOSU1BVElPTl9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIE1haW4tRXZlbnRzIGZyb20gRWxlY3Ryb25cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwTWFpbkxpc3RlbmVycygpOiB2b2lkIHtcclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX05FVywgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIMaSLlByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICBhd2FpdCBuZXdQcm9qZWN0KCk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUFJPSkVDVF9TQVZFLCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgaWYgKGF3YWl0IHNhdmVQcm9qZWN0KCkpXHJcbiAgICAgICAgICBQYWdlLnNldERlZmF1bHRQcm9qZWN0KCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX0xPQUQsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBsZXQgdXJsOiBVUkwgPSBhd2FpdCBwcm9tcHRMb2FkUHJvamVjdCgpO1xyXG4gICAgICAgIGlmICghdXJsKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGF3YWl0IFBhZ2UubG9hZFByb2plY3QodXJsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0dSQVBIX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEdyYXBoLCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsUHJvamVjdCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9IRUxQX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEhlbHAsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUVVJVCwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2Uuc2V0RGVmYXVsdFByb2plY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0FOSU1BVElPTl9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxBbmltYXRpb24sIG51bGwpO1xyXG4gICAgICAgIC8vIGxldCBwYW5lbDogUGFuZWwgPSBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlUGFuZWxGcm9tVGVtcGxhdGUobmV3IFZpZXdBbmltYXRpb25UZW1wbGF0ZSgpLCBcIkFuaW1hdGlvbiBQYW5lbFwiKTtcclxuICAgICAgICAvLyBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuYWRkUGFuZWwocGFuZWwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbFBhcnRpY2xlU3lzdGVtLCBudWxsKTtcclxuICAgICAgICAvLyBsZXQgcGFuZWw6IFBhbmVsID0gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmNyZWF0ZVBhbmVsRnJvbVRlbXBsYXRlKG5ldyBWaWV3QW5pbWF0aW9uVGVtcGxhdGUoKSwgXCJBbmltYXRpb24gUGFuZWxcIik7XHJcbiAgICAgICAgLy8gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmFkZFBhbmVsKHBhbmVsKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmdW5jdGlvbiB3ZWxjb21lKGNvbnRhaW5lcjogR29sZGVuTGF5b3V0LkNvbnRhaW5lciwgc3RhdGU6IE9iamVjdCk6IHZvaWQge1xyXG4gIC8vICAgY29udGFpbmVyLmdldEVsZW1lbnQoKS5odG1sKFwiPGRpdj5XZWxjb21lPC9kaXY+XCIpO1xyXG4gIC8vIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICDGki5TZXJpYWxpemVyLnJlZ2lzdGVyTmFtZXNwYWNlKEZ1ZGdlKTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFByb2plY3QgZXh0ZW5kcyDGki5NdXRhYmxlIHsgLy8gVE9ETzogcmVwbGFjZSB3aXRoIHNlcmlsaXphYmxlXHJcbiAgICAvLyBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiTmV3UHJvamVjdFwiO1xyXG4gICAgcHVibGljIGJhc2U6IFVSTDtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGZpbGVJbmRleDogc3RyaW5nID0gXCJpbmRleC5odG1sXCI7XHJcbiAgICBwdWJsaWMgZmlsZUludGVybmFsOiBzdHJpbmcgPSBcIkludGVybmFsLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlSW50ZXJuYWxGb2xkZXI6IHN0cmluZyA9IFwiSW50ZXJuYWxGb2xkZXIuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVTY3JpcHQ6IHN0cmluZyA9IFwiU2NyaXB0L0J1aWxkL1NjcmlwdC5qc1wiO1xyXG4gICAgcHVibGljIGZpbGVTZXR0aW5nczogc3RyaW5nID0gXCJzZXR0aW5ncy5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZVN0eWxlczogc3RyaW5nID0gXCJzdHlsZXMuY3NzXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBncmFwaEF1dG9WaWV3OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLy8gcHJpdmF0ZSBpbmNsdWRlQXV0b1ZpZXdTY3JpcHQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICNyZXNvdXJjZUZvbGRlcjogUmVzb3VyY2VGb2xkZXI7XHJcbiAgICAjZG9jdW1lbnQ6IERvY3VtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYmFzZTogVVJMKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuYmFzZSA9IF9iYXNlO1xyXG4gICAgICB0aGlzLm5hbWUgPSBfYmFzZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKS5zbGljZSgtMiwgLTEpWzBdO1xyXG4gICAgICB0aGlzLmZpbGVJbmRleCA9IF9iYXNlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpLnBvcCgpIHx8IHRoaXMuZmlsZUluZGV4O1xyXG5cclxuICAgICAgxpIuUHJvamVjdC5jbGVhcigpO1xyXG4gICAgICDGki5Qcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuR1JBUEhfTVVUQVRFRCxcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gUGFnZS5icm9hZGNhc3QobmV3IEVkaXRvckV2ZW50KEVWRU5UX0VESVRPUi5VUERBVEUpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VGb2xkZXIoKTogUmVzb3VyY2VGb2xkZXIge1xyXG4gICAgICBpZiAoIXRoaXMuI3Jlc291cmNlRm9sZGVyKVxyXG4gICAgICAgIHRoaXMuI3Jlc291cmNlRm9sZGVyID0gbmV3IFJlc291cmNlRm9sZGVyKFwiUmVzb3VyY2VzXCIpO1xyXG4gICAgICByZXR1cm4gdGhpcy4jcmVzb3VyY2VGb2xkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gxpJ1aS5EaWFsb2cucHJvbXB0KHByb2plY3QsIGZhbHNlLCBcIlJldmlldyBwcm9qZWN0IHNldHRpbmdzXCIsIFwiQWRqdXN0IHNldHRpbmdzIGFuZCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG5cclxuICAgICAgxpJ1aS5EaWFsb2cuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLCDGknVpLkRpYWxvZy5kb20sIHRoaXMuZ2V0TXV0YXRvcigpKTtcclxuICAgICAgICB0aGlzLm11dGF0ZShtdXRhdG9yKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgICBjb25zb2xlLmxvZyhtdXRhdG9yLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGxvYWQoX2h0bWxDb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IG5ldyDGki5QaHlzaWNzKCk7XHJcbiAgICAgIGNvbnN0IHBhcnNlcjogRE9NUGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgICB0aGlzLiNkb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoX2h0bWxDb250ZW50LCBcInRleHQvaHRtbFwiKTtcclxuICAgICAgY29uc3QgaGVhZDogSFRNTEhlYWRFbGVtZW50ID0gdGhpcy4jZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIik7XHJcblxyXG4gICAgICB0aGlzLmxvYWRGb250cyhoZWFkKTtcclxuXHJcbiAgICAgIGNvbnN0IHNjcmlwdHM6IE5vZGVMaXN0T2Y8SFRNTFNjcmlwdEVsZW1lbnQ+ID0gaGVhZC5xdWVyeVNlbGVjdG9yQWxsKFwic2NyaXB0XCIpO1xyXG4gICAgICBmb3IgKGxldCBzY3JpcHQgb2Ygc2NyaXB0cykge1xyXG4gICAgICAgIGlmIChzY3JpcHQuZ2V0QXR0cmlidXRlKFwiZWRpdG9yXCIpID09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xyXG4gICAgICAgICAgxpIuRGVidWcuZnVkZ2UoXCJMb2FkIHNjcmlwdDogXCIsIHVybCk7XHJcbiAgICAgICAgICBhd2FpdCDGki5Qcm9qZWN0LmxvYWRTY3JpcHQobmV3IFVSTCh1cmwsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXBvbmVudFNjcmlwdHNcIiwgxpIuUHJvamVjdC5nZXRDb21wb25lbnRTY3JpcHRzKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJTY3JpcHQgTmFtZXNwYWNlc1wiLCDGki5Qcm9qZWN0LnNjcmlwdE5hbWVzcGFjZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzb3VyY2VMaW5rOiBIVE1MTGlua0VsZW1lbnQgPSBoZWFkLnF1ZXJ5U2VsZWN0b3IoXCJsaW5rW3R5cGU9cmVzb3VyY2VzXVwiKTtcclxuICAgICAgbGV0IHJlc291cmNlRmlsZTogc3RyaW5nID0gcmVzb3VyY2VMaW5rLmdldEF0dHJpYnV0ZShcInNyY1wiKTtcclxuICAgICAgcHJvamVjdC5maWxlSW50ZXJuYWwgPSByZXNvdXJjZUZpbGU7XHJcbiAgICAgIMaSLlByb2plY3QuYmFzZVVSTCA9IHRoaXMuYmFzZTtcclxuICAgICAgbGV0IHJlY29uc3RydWN0aW9uOiDGki5SZXNvdXJjZXMgPSBhd2FpdCDGki5Qcm9qZWN0LmxvYWRSZXNvdXJjZXMobmV3IFVSTChyZXNvdXJjZUZpbGUsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICDGki5EZWJ1Zy5ncm91cENvbGxhcHNlZChcIkRlc2VyaWFsaXplZFwiKTtcclxuICAgICAgxpIuRGVidWcuaW5mbyhyZWNvbnN0cnVjdGlvbik7XHJcbiAgICAgIMaSLkRlYnVnLmdyb3VwRW5kKCk7XHJcblxyXG4gICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTsgLy8gcmVtb3ZlIHBvdGVudGlhbCByaWdpZGJvZGllc1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNvdXJjZUZvbGRlckNvbnRlbnQ6IHN0cmluZyA9IGF3YWl0IChhd2FpdCBmZXRjaChuZXcgVVJMKHRoaXMuZmlsZUludGVybmFsRm9sZGVyLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpKS50ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgcmVzb3VyY2VGb2xkZXI6IMaSLlNlcmlhbGl6YWJsZSA9IGF3YWl0IMaSLlNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoxpIuU2VyaWFsaXplci5wYXJzZShyZXNvdXJjZUZvbGRlckNvbnRlbnQpKTtcclxuICAgICAgICBpZiAocmVzb3VyY2VGb2xkZXIgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHRoaXMuI3Jlc291cmNlRm9sZGVyID0gcmVzb3VyY2VGb2xkZXI7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLndhcm4oYEZhaWxlZCB0byBsb2FkICcke3RoaXMuZmlsZUludGVybmFsRm9sZGVyfScuIEEgbmV3IHJlc291cmNlIGZvbGRlciB3YXMgY3JlYXRlZCBhbmQgd2lsbCBiZSBzYXZlZC5gLCBfZXJyb3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc2V0dGluZ3M6IEhUTUxNZXRhRWxlbWVudCA9IGhlYWQucXVlcnlTZWxlY3RvcihcIm1ldGFbdHlwZT1zZXR0aW5nc11cIik7XHJcbiAgICAgIGxldCBwcm9qZWN0U2V0dGluZ3M6IHN0cmluZyA9IHNldHRpbmdzPy5nZXRBdHRyaWJ1dGUoXCJwcm9qZWN0XCIpO1xyXG4gICAgICBwcm9qZWN0U2V0dGluZ3MgPSBwcm9qZWN0U2V0dGluZ3M/LnJlcGxhY2UoLycvZywgXCJcXFwiXCIpO1xyXG4gICAgICBhd2FpdCBwcm9qZWN0Lm11dGF0ZShKU09OLnBhcnNlKHByb2plY3RTZXR0aW5ncyB8fCBcInt9XCIpKTtcclxuXHJcbiAgICAgIGxldCBjb25maWc6IExheW91dENvbmZpZztcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzZXR0aW5nc0NvbnRlbnQ6IHN0cmluZyA9IGF3YWl0IChhd2FpdCBmZXRjaChuZXcgVVJMKHRoaXMuZmlsZVNldHRpbmdzLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpKS50ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgcGFuZWxTZXR0aW5nczogxpIuU2VyaWFsaXphdGlvbiA9IMaSLlNlcmlhbGl6ZXIucGFyc2Uoc2V0dGluZ3NDb250ZW50KTtcclxuICAgICAgICBjb25maWcgPSBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5MYXlvdXRDb25maWcuZnJvbVJlc29sdmVkKHBhbmVsU2V0dGluZ3MubGF5b3V0KTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgRmFpbGVkIHRvIGxvYWQgJyR7dGhpcy5maWxlU2V0dGluZ3N9Jy4gQSBuZXcgc2V0dGluZ3MgZmlsZSB3YXMgY3JlYXRlZCBhbmQgd2lsbCBiZSBzYXZlZC5gLCBfZXJyb3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBQYWdlLmxvYWRMYXlvdXQoY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvamVjdEpTT04oKTogc3RyaW5nIHtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb25PZlJlc291cmNlcyA9IMaSLlByb2plY3Quc2VyaWFsaXplKCk7XHJcbiAgICAgIGxldCBqc29uOiBzdHJpbmcgPSDGki5TZXJpYWxpemVyLnN0cmluZ2lmeShzZXJpYWxpemF0aW9uKTtcclxuICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJlc291cmNlRm9sZGVySlNPTigpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gxpIuU2VyaWFsaXplci5zdHJpbmdpZnkoxpIuU2VyaWFsaXplci5zZXJpYWxpemUodGhpcy5yZXNvdXJjZUZvbGRlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZXR0aW5nc0pTT04oKTogc3RyaW5nIHtcclxuICAgICAgbGV0IHNldHRpbmdzOiDGki5TZXJpYWxpemF0aW9uID0ge307XHJcbiAgICAgIHNldHRpbmdzLmxheW91dCA9IFBhZ2UuZ2V0TGF5b3V0KCk7XHJcblxyXG4gICAgICByZXR1cm4gxpIuU2VyaWFsaXplci5zdHJpbmdpZnkoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0Q1NTKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgY29udGVudCArPSBcImh0bWwsIGJvZHkge1xcbiAgcGFkZGluZzogMHB4O1xcbiAgbWFyZ2luOiAwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuXCI7XHJcbiAgICAgIGNvbnRlbnQgKz0gXCJkaWFsb2cgeyBcXG4gIHRleHQtYWxpZ246IGNlbnRlcjsgXFxufVxcblxcblwiO1xyXG4gICAgICBjb250ZW50ICs9IFwiY2FudmFzLmZ1bGxzY3JlZW4geyBcXG4gIHdpZHRoOiAxMDB2dzsgXFxuICBoZWlnaHQ6IDEwMHZoOyBcXG59XCI7XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvamVjdEhUTUwoX3RpdGxlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICBpZiAoIXRoaXMuI2RvY3VtZW50KVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVByb2plY3RIVE1MKF90aXRsZSk7XHJcblxyXG4gICAgICB0aGlzLiNkb2N1bWVudC50aXRsZSA9IF90aXRsZTtcclxuXHJcbiAgICAgIGxldCBzZXR0aW5nczogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWV0YVwiKTtcclxuICAgICAgc2V0dGluZ3Muc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInNldHRpbmdzXCIpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJhdXRvdmlld1wiLCB0aGlzLmdyYXBoQXV0b1ZpZXcpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJwcm9qZWN0XCIsIHRoaXMuc2V0dGluZ3NTdHJpbmdpZnkoKSk7XHJcbiAgICAgIHRoaXMuI2RvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihcIm1ldGFbdHlwZT1zZXR0aW5nc11cIikucmVwbGFjZVdpdGgoc2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gbGV0IGF1dG9WaWV3U2NyaXB0OiBIVE1MU2NyaXB0RWxlbWVudCA9IHRoaXMuI2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRbbmFtZT1hdXRvVmlld11cIik7XHJcbiAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVBdXRvVmlld1NjcmlwdCkge1xyXG4gICAgICAvLyAgIGlmICghYXV0b1ZpZXdTY3JpcHQpXHJcbiAgICAgIC8vICAgICB0aGlzLiNkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuZ2V0QXV0b1ZpZXdTY3JpcHQoKSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gZWxzZVxyXG4gICAgICAvLyAgIGlmIChhdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICAgIHRoaXMuI2RvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoYXV0b1ZpZXdTY3JpcHQpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5SFRNTCh0aGlzLiNkb2N1bWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhfbXV0YXRvcjogxpIuTXV0YXRvcik6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyB7XHJcbiAgICAgIGxldCB0eXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gc3VwZXIuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKF9tdXRhdG9yKTtcclxuICAgICAgaWYgKHR5cGVzLmdyYXBoQXV0b1ZpZXcpXHJcbiAgICAgICAgdHlwZXMuZ3JhcGhBdXRvVmlldyA9IHRoaXMuZ2V0R3JhcGhzKCk7XHJcbiAgICAgIHJldHVybiB0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVkdWNlTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuYmFzZTtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbmRleDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbnRlcm5hbDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbnRlcm5hbEZvbGRlcjtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTY3JpcHQ7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlU2V0dGluZ3M7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlU3R5bGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0R3JhcGhzKCk6IE9iamVjdCB7XHJcbiAgICAgIGxldCBncmFwaHM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSDGki5Qcm9qZWN0LmdldFJlc291cmNlc0J5VHlwZSjGki5HcmFwaCk7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBncmFwaCBvZiBncmFwaHMpIHtcclxuICAgICAgICByZXN1bHRbZ3JhcGgubmFtZV0gPSBncmFwaC5pZFJlc291cmNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9qZWN0SFRNTChfdGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBodG1sOiBEb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChfdGl0bGUpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcIm1ldGFcIiwgeyBjaGFyc2V0OiBcInV0Zi04XCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibGlua1wiLCB7IHJlbDogXCJzdHlsZXNoZWV0XCIsIGhyZWY6IHRoaXMuZmlsZVN0eWxlcyB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJFZGl0b3Igc2V0dGluZ3Mgb2YgdGhpcyBwcm9qZWN0XCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcIm1ldGFcIiwge1xyXG4gICAgICAgIHR5cGU6IFwic2V0dGluZ3NcIiwgYXV0b3ZpZXc6IHRoaXMuZ3JhcGhBdXRvVmlldywgcHJvamVjdDogdGhpcy5zZXR0aW5nc1N0cmluZ2lmeSgpXHJcbiAgICAgIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkFjdGl2YXRlIHRoZSBmb2xsb3dpbmcgbGluZSB0byBpbmNsdWRlIHRoZSBGVURHRS12ZXJzaW9uIG9mIE9pbW8tUGh5c2ljcy4gWW91IG1heSB3YW50IHRvIGRvd25sb2FkIGEgbG9jYWwgY29weSB0byB3b3JrIG9mZmxpbmUgYW5kIGJlIGluZGVwZW5kZW50IGZyb20gZnV0dXJlIGNoYW5nZXMhXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vT2ltb1BoeXNpY3MuanNcIj48L3NjcmlwdD5gKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIEZVREdFLiBZb3UgbWF5IHdhbnQgdG8gZG93bmxvYWQgbG9jYWwgY29waWVzIHRvIHdvcmsgb2ZmbGluZSBhbmQgYmUgaW5kZXBlbmRlbnQgZnJvbSBmdXR1cmUgY2hhbmdlcyEgRGV2ZWxvcGVycyB3b3JraW5nIG9uIEZVREdFIGl0c2VsZiBtYXkgd2FudCB0byBjcmVhdGUgc3ltbGlua3NcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogXCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9GdWRnZUFpZC5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxpbmsgaW50ZXJuYWwgcmVzb3VyY2VzLiBUaGUgZWRpdG9yIG9ubHkgbG9hZHMgdGhlIGZpcnN0LCBidXQgYXQgcnVudGltZSwgbXVsdGlwbGUgZmlsZXMgY2FuIGNvbnRyaWJ1dGVcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibGlua1wiLCB7IHR5cGU6IFwicmVzb3VyY2VzXCIsIHNyYzogdGhpcy5maWxlSW50ZXJuYWwgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBjdXN0b20gc2NyaXB0c1wiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IHRoaXMuZmlsZVNjcmlwdCwgZWRpdG9yOiBcInRydWVcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVBdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5nZXRBdXRvVmlld1NjcmlwdCgpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgQXV0b3ZpZXcgc2NyaXB0XCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogXCJBdXRvdmlldy5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkRpYWxvZyBzaG93biBhdCBzdGFydHVwIG9ubHlcIikpO1xyXG4gICAgICBsZXQgZGlhbG9nOiBIVE1MRWxlbWVudCA9IGNyZWF0ZVRhZyhcImRpYWxvZ1wiKTtcclxuICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInBcIiwge30sIFwiRlVER0UgQXV0b3ZpZXdcIikpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwiaDFcIiwge30sIFwiVGl0bGUgKHdpbGwgYmUgcmVwbGFjZWQgYnkgQXV0b3ZpZXcpXCIpKTtcclxuICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInBcIiwge30sIFwiY2xpY2sgdG8gc3RhcnRcIikpO1xyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcclxuXHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDYW52YXMgZm9yIEZVREdFIHRvIHJlbmRlciB0b1wiKSk7XHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJjYW52YXNcIiwgeyBjbGFzczogXCJmdWxsc2NyZWVuXCIgfSkpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlVGFnKF90YWc6IHN0cmluZywgX2F0dHJpYnV0ZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fSwgX2NvbnRlbnQ/OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChfdGFnKTtcclxuICAgICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gX2F0dHJpYnV0ZXMpXHJcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIF9hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pO1xyXG4gICAgICAgIGlmIChfY29udGVudClcclxuICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gX2NvbnRlbnQ7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeUhUTUwoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBnZXRBdXRvVmlld1NjcmlwdCgpOiBIVE1MU2NyaXB0RWxlbWVudCB7XHJcbiAgICAvLyAgIGxldCBjb2RlOiBzdHJpbmc7XHJcbiAgICAvLyAgIGNvZGUgPSAoZnVuY3Rpb24gKF9ncmFwaElkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vICAgICAvKipcclxuICAgIC8vICAgICAgKiBBdXRvVmlldy1TY3JpcHRcclxuICAgIC8vICAgICAgKiBMb2FkcyBhbmQgZGlzcGxheXMgdGhlIHNlbGVjdGVkIGdyYXBoIGFuZCBpbXBsZW1lbnRzIGEgYmFzaWMgb3JiaXQgY2FtZXJhXHJcbiAgICAvLyAgICAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMVxyXG4gICAgLy8gICAgICAqL1xyXG5cclxuICAgIC8vICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgaW5pdCk7XHJcblxyXG4gICAgLy8gICAgIC8vIHNob3cgZGlhbG9nIGZvciBzdGFydHVwXHJcbiAgICAvLyAgICAgbGV0IGRpYWxvZzogSFRNTERpYWxvZ0VsZW1lbnQ7XHJcbiAgICAvLyAgICAgZnVuY3Rpb24gaW5pdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgICAgICBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGlhbG9nXCIpO1xyXG4gICAgLy8gICAgICAgZGlhbG9nLnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKS50ZXh0Q29udGVudCA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgLy8gICAgICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAgICAgICAvLyBAdHMtaWduIHJlIHVudGlsIEhUTUxEaWFsb2cgaXMgaW1wbGVtZW50ZWQgYnkgYWxsIGJyb3dzZXJzIGFuZCBhdmFpbGFibGUgaW4gZG9tLmQudHNcclxuICAgIC8vICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAvLyAgICAgICAgIHN0YXJ0SW50ZXJhY3RpdmVWaWV3cG9ydCgpO1xyXG4gICAgLy8gICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgIC8vICAgICAgIGRpYWxvZy5zaG93TW9kYWwoKTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIC8vIHNldHVwIGFuZCBzdGFydCBpbnRlcmFjdGl2ZSB2aWV3cG9ydFxyXG4gICAgLy8gICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0SW50ZXJhY3RpdmVWaWV3cG9ydCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vICAgICAgIC8vIGxvYWQgcmVzb3VyY2VzIHJlZmVyZW5jZWQgaW4gdGhlIGxpbmstdGFnXHJcbiAgICAvLyAgICAgICBhd2FpdCBGdWRnZUNvcmUuUHJvamVjdC5sb2FkUmVzb3VyY2VzRnJvbUhUTUwoKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJQcm9qZWN0OlwiLCBGdWRnZUNvcmUuUHJvamVjdC5yZXNvdXJjZXMpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIHBpY2sgdGhlIGdyYXBoIHRvIHNob3dcclxuICAgIC8vICAgICAgIGxldCBncmFwaDogxpIuR3JhcGggPSA8xpIuR3JhcGg+RnVkZ2VDb3JlLlByb2plY3QucmVzb3VyY2VzW19ncmFwaElkXTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJHcmFwaDpcIiwgZ3JhcGgpO1xyXG4gICAgLy8gICAgICAgaWYgKCFncmFwaCkge1xyXG4gICAgLy8gICAgICAgICBhbGVydChcIk5vdGhpbmcgdG8gcmVuZGVyLiBDcmVhdGUgYSBncmFwaCB3aXRoIGF0IGxlYXN0IGEgbWVzaCwgbWF0ZXJpYWwgYW5kIHByb2JhYmx5IHNvbWUgbGlnaHRcIik7XHJcbiAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgIC8vICAgICAgIH1cclxuXHJcbiAgICAvLyAgICAgICAvLyBzZXR1cCB0aGUgdmlld3BvcnRcclxuICAgIC8vICAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyBGdWRnZUNvcmUuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAvLyAgICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIik7XHJcbiAgICAvLyAgICAgICBsZXQgdmlld3BvcnQ6IMaSLlZpZXdwb3J0ID0gbmV3IEZ1ZGdlQ29yZS5WaWV3cG9ydCgpO1xyXG4gICAgLy8gICAgICAgdmlld3BvcnQuaW5pdGlhbGl6ZShcIkludGVyYWN0aXZlVmlld3BvcnRcIiwgZ3JhcGgsIGNtcENhbWVyYSwgY2FudmFzKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJWaWV3cG9ydDpcIiwgdmlld3BvcnQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIGhpZGUgdGhlIGN1cnNvciB3aGVuIGludGVyYWN0aW5nLCBhbHNvIHN1cHByZXNzaW5nIHJpZ2h0LWNsaWNrIG1lbnVcclxuICAgIC8vICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNhbnZhcy5yZXF1ZXN0UG9pbnRlckxvY2spO1xyXG4gICAgLy8gICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uICgpOiB2b2lkIHsgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7IH0pO1xyXG5cclxuICAgIC8vICAgICAgIC8vIG1ha2UgdGhlIGNhbWVyYSBpbnRlcmFjdGl2ZSAoY29tcGxleCBtZXRob2QgaW4gRnVkZ2VBaWQpXHJcbiAgICAvLyAgICAgICBsZXQgY2FtZXJhT3JiaXQ6IEZ1ZGdlQWlkLkNhbWVyYU9yYml0ID0gRnVkZ2VBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHZpZXdwb3J0KTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBzZXR1cCBhdWRpb1xyXG4gICAgLy8gICAgICAgbGV0IGNtcExpc3RlbmVyOiDGki5Db21wb25lbnRBdWRpb0xpc3RlbmVyID0gbmV3IMaSLkNvbXBvbmVudEF1ZGlvTGlzdGVuZXIoKTtcclxuICAgIC8vICAgICAgIGNtcENhbWVyYS5ub2RlLmFkZENvbXBvbmVudChjbXBMaXN0ZW5lcik7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQubGlzdGVuV2l0aChjbXBMaXN0ZW5lcik7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQubGlzdGVuVG8oZ3JhcGgpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIkF1ZGlvOlwiLCBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIGRyYXcgdmlld3BvcnQgb25jZSBmb3IgaW1tZWRpYXRlIGZlZWRiYWNrXHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuUmVuZGVyLnByZXBhcmUoY2FtZXJhT3JiaXQpO1xyXG4gICAgLy8gICAgICAgdmlld3BvcnQuZHJhdygpO1xyXG4gICAgLy8gICAgICAgY2FudmFzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiaW50ZXJhY3RpdmVWaWV3cG9ydFN0YXJ0ZWRcIiwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHZpZXdwb3J0IH0pKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgIH0pLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgLy8gICBjb2RlID0gXCIoXCIgKyBjb2RlICsgYCkoZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVthdXRvVmlld11cIikuZ2V0QXR0cmlidXRlKFwiYXV0b1ZpZXdcIikpO1xcbmA7XHJcbiAgICAvLyAgIGxldCBzY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgIC8vICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJhdXRvVmlld1wiKTtcclxuICAgIC8vICAgc2NyaXB0LnRleHRDb250ZW50ID0gY29kZTtcclxuICAgIC8vICAgcmV0dXJuIHNjcmlwdDtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHRpbmdzU3RyaW5naWZ5KCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gcHJvamVjdC5nZXRNdXRhdG9yKHRydWUpO1xyXG4gICAgICBsZXQgc2V0dGluZ3M6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG11dGF0b3IpO1xyXG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLnJlcGxhY2UoL1wiL2csIFwiJ1wiKTtcclxuICAgICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RyaW5naWZ5SFRNTChfaHRtbDogRG9jdW1lbnQpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgcmVzdWx0OiBzdHJpbmcgPSAobmV3IFhNTFNlcmlhbGl6ZXIoKSkuc2VyaWFsaXplVG9TdHJpbmcoX2h0bWwpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvPjwvZywgXCI+XFxuPFwiKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLzwhLS1DUkxGLS0+L2csIFwiXCIpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXCI+XFxuPFxcL3NjcmlwdC9nLCBgXCI+PC9zY3JpcHRgKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1xcbio8XFwvYm9keT4vZywgXCJcXG48XFwvYm9keT5cIik7IC8vIHJlbW92ZSBsaW5lIGJyZWFrcyBhZGRlZCBieSBzZXJpYWxpemVUb1N0cmluZyBiZWZvcmUgY2xvc2luZyBib2R5LXRhZ1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgbG9hZEZvbnRzKF9oZWFkOiBIVE1MSGVhZEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgLy8gY29sbGVjdCBhbGwgZm9udHMgZnJvbSBfaGVhZCBhbmQgYWRkIHRoZW0gdG8gdGhlIGhlYWQgb2YgdGhlIGVkaXRvcnMgZG9jdW1lbnQgc28gdGhhdCB0aGV5IGFyZSBhdmFpbGFibGUgZm9yIGNvbXBvbmVudCB0ZXh0XHJcbiAgICAgIGNvbnN0IGZvbnRzOiBIVE1MU3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgY29uc3QgY3NzTGlua3M6IE5vZGVMaXN0T2Y8SFRNTExpbmtFbGVtZW50PiA9IF9oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpO1xyXG4gICAgICBjb25zdCBjc3NTdHlsZXM6IE5vZGVMaXN0T2Y8SFRNTFN0eWxlRWxlbWVudD4gPSBfaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpO1xyXG4gICAgICBjb25zdCBjc3NSdWxlczogQ1NTUnVsZVtdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBsaW5rIG9mIGNzc0xpbmtzKSB7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gbmV3IFVSTChsaW5rLmdldEF0dHJpYnV0ZShcImhyZWZcIiksIHRoaXMuYmFzZSkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgY3NzVGV4dDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKHVybCkpLnRleHQoKTsgLy8gVE9ETzogdXNlIEZpbGVJT1xyXG4gICAgICAgIGNzc1J1bGVzLnB1c2goLi4uZ2V0UnVsZXMoY3NzVGV4dCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBzdHlsZSBvZiBjc3NTdHlsZXMpXHJcbiAgICAgICAgY3NzUnVsZXMucHVzaCguLi5nZXRSdWxlcyhzdHlsZS5pbm5lckhUTUwpKTtcclxuXHJcbiAgICAgIGZvciAobGV0IHJ1bGUgb2YgY3NzUnVsZXMpXHJcbiAgICAgICAgaWYgKHJ1bGUgaW5zdGFuY2VvZiBDU1NGb250RmFjZVJ1bGUpXHJcbiAgICAgICAgICBmb250cy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlLmNzc1RleHQpKTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZm9udHMpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0UnVsZXMoX3RleHQ6IHN0cmluZyk6IENTU1J1bGVMaXN0IHtcclxuICAgICAgICBsZXQgc3R5bGVTaGVldDogQ1NTU3R5bGVTaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XHJcbiAgICAgICAgc3R5bGVTaGVldC5yZXBsYWNlU3luYyhfdGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlU2hlZXQuY3NzUnVsZXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlckFuaW1hdGlvbiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9DT0xPUlM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcIlJlZFwiLFxyXG4gICAgICBcIkxpbWVcIixcclxuICAgICAgXCJCbHVlXCIsXHJcbiAgICAgIFwiQ3lhblwiLFxyXG4gICAgICBcIk1hZ2VudGFcIixcclxuICAgICAgXCJZZWxsb3dcIixcclxuICAgICAgXCJTYWxtb25cIixcclxuICAgICAgXCJMaWdodEdyZWVuXCIsXHJcbiAgICAgIFwiQ29ybmZsb3dlckJsdWVcIlxyXG4gICAgXTtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiDGki5BbmltYXRpb247XHJcbiAgICBwcml2YXRlIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHZpZXc6IFZpZXdBbmltYXRpb247XHJcbiAgICBwcml2YXRlIHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW107XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hbmltYXRpb246IMaSLkFuaW1hdGlvbiwgX2RvbTogSFRNTEVsZW1lbnQsIF92aWV3OiBWaWV3QW5pbWF0aW9uKSB7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgdGhpcy5kb20gPSBfZG9tO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnZpZXcgPSBfdmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgY29sb3JJbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgbGV0IGtleVNlbGVjdGVkOiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnZpZXcua2V5U2VsZWN0ZWQ7XHJcblxyXG4gICAgICB1cGRhdGVSZWN1cnNpdmUodGhpcy5kb20sIF9tdXRhdG9yLCB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUsIF90aW1lKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVJlY3Vyc2l2ZShfZG9tOiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IsIF9hbmltYXRpb25TdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblN0cnVjdHVyZSwgX3RpbWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudDogxpJ1aS5DdXN0b21FbGVtZW50ID0gPMaSdWkuQ3VzdG9tRWxlbWVudD7GknVpLkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb20sIGtleSk7XHJcbiAgICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCB2YWx1ZTogxpIuR2VuZXJhbCA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgICAgICBsZXQgc3RydWN0dXJlT3JTZXF1ZW5jZTogT2JqZWN0ID0gX2FuaW1hdGlvblN0cnVjdHVyZVtrZXldO1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50ICYmIHN0cnVjdHVyZU9yU2VxdWVuY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgbGV0IGtleTogxpIuQW5pbWF0aW9uS2V5ID0gc3RydWN0dXJlT3JTZXF1ZW5jZS5maW5kS2V5KF90aW1lKTtcclxuICAgICAgICAgICAgaWYgKGtleSkgey8vIGtleSBmb3VuZCBhdCBleGFjdGx5IHRoZSBnaXZlbiB0aW1lLCB0YWtlIGl0cyB2YWx1ZVxyXG4gICAgICAgICAgICAgIHZhbHVlID0ga2V5LnZhbHVlO1xyXG4gICAgICAgICAgICAgIGlmIChrZXkgPT0ga2V5U2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwiLS1jb2xvci1hbmltYXRpb24tcHJvcGVydHlcIiwgZ2V0TmV4dENvbG9yKCkpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwiYW5pbWF0aW9uU2VxdWVuY2VcIiwgc3RydWN0dXJlT3JTZXF1ZW5jZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1cGRhdGVSZWN1cnNpdmUoZWxlbWVudCwgdmFsdWUsIDzGki5BbmltYXRpb25TdHJ1Y3R1cmU+c3RydWN0dXJlT3JTZXF1ZW5jZSwgX3RpbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0TmV4dENvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbG9yOiBzdHJpbmcgPSBDb250cm9sbGVyQW5pbWF0aW9uLlBST1BFUlRZX0NPTE9SU1tjb2xvckluZGV4XTtcclxuICAgICAgICBjb2xvckluZGV4ID0gKGNvbG9ySW5kZXggKyAxKSAlIENvbnRyb2xsZXJBbmltYXRpb24uUFJPUEVSVFlfQ09MT1JTLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBtb2RpZnkgb3IgYWRkIGtleVxyXG4gICAgcHVibGljIHVwZGF0ZVNlcXVlbmNlKF90aW1lOiBudW1iZXIsIF9lbGVtZW50OiDGknVpLkN1c3RvbUVsZW1lbnQsIF9hZGQ6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gUmVmbGVjdC5nZXQoX2VsZW1lbnQsIFwiYW5pbWF0aW9uU2VxdWVuY2VcIik7XHJcbiAgICAgIGlmICghc2VxdWVuY2UpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHNlcXVlbmNlLmZpbmRLZXkoX3RpbWUpO1xyXG4gICAgICBpZiAoIWtleSkge1xyXG4gICAgICAgIGlmIChfYWRkKSB7XHJcbiAgICAgICAgICBrZXkgPSBuZXcgxpIuQW5pbWF0aW9uS2V5KF90aW1lLCA8bnVtYmVyPl9lbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgICAgIHNlcXVlbmNlLmFkZEtleShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlXHJcbiAgICAgICAgc2VxdWVuY2UubW9kaWZ5S2V5KGtleSwgbnVsbCwgPG51bWJlcj5fZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIHRoaXMudmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiBrZXkgfSB9KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5leHRLZXkoX3RpbWU6IG51bWJlciwgX2RpcmVjdGlvbjogXCJmb3J3YXJkXCIgfCBcImJhY2t3YXJkXCIpOiBudW1iZXIge1xyXG4gICAgICBsZXQgbmV4dEtleTogxpIuQW5pbWF0aW9uS2V5ID0gdGhpcy5zZXF1ZW5jZXNcclxuICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgIC5zb3J0KF9kaXJlY3Rpb24gPT0gXCJmb3J3YXJkXCIgJiYgKChfYSwgX2IpID0+IF9hLnRpbWUgLSBfYi50aW1lKSB8fCBfZGlyZWN0aW9uID09IFwiYmFja3dhcmRcIiAmJiAoKF9hLCBfYikgPT4gX2IudGltZSAtIF9hLnRpbWUpKVxyXG4gICAgICAgIC5maW5kKF9rZXkgPT4gX2RpcmVjdGlvbiA9PSBcImZvcndhcmRcIiAmJiBfa2V5LnRpbWUgPiBfdGltZSB8fCBfZGlyZWN0aW9uID09IFwiYmFja3dhcmRcIiAmJiBfa2V5LnRpbWUgPCBfdGltZSk7XHJcbiAgICAgIGlmIChuZXh0S2V5KVxyXG4gICAgICAgIHJldHVybiBuZXh0S2V5LnRpbWU7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFByb3BlcnR5KF9wYXRoOiBzdHJpbmdbXSwgX25vZGU6IMaSLk5vZGUsIF90aW1lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgfCDGki5BbmltYXRpb25TdHJ1Y3R1cmUgPSB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmU7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBfcGF0aC5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBfcGF0aFtpXTtcclxuICAgICAgICBpZiAoIShrZXkgaW4gc3RydWN0dXJlKSlcclxuICAgICAgICAgIHN0cnVjdHVyZVtrZXldID0ge307XHJcbiAgICAgICAgc3RydWN0dXJlID0gc3RydWN0dXJlW2tleV07XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IG5ldyDGki5BbmltYXRpb25TZXF1ZW5jZSgpO1xyXG4gICAgICBzZXF1ZW5jZS5hZGRLZXkobmV3IMaSLkFuaW1hdGlvbktleShfdGltZSwgMCkpO1xyXG4gICAgICBzdHJ1Y3R1cmVbX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV1dID0gc2VxdWVuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVByb3BlcnR5KF9lbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMuZG9tLmNvbnRhaW5zKF9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IF9lbGVtZW50O1xyXG4gICAgICB3aGlsZSAoZWxlbWVudCAhPT0gdGhpcy5kb20pIHtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCB8fCBlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgcGF0aC51bnNoaWZ0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRlbGV0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFNlcXVlbmNlcyhfc2VsZWN0ZWRQcm9wZXJ0eT86IEhUTUxFbGVtZW50KTogVmlld0FuaW1hdGlvblNlcXVlbmNlW10ge1xyXG4gICAgICBsZXQgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSA9IFtdO1xyXG4gICAgICBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUodGhpcy5kb20sIHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSwgc2VxdWVuY2VzLCBfc2VsZWN0ZWRQcm9wZXJ0eSA9PSBudWxsKTtcclxuICAgICAgcmV0dXJuIHNlcXVlbmNlcztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZShfZG9tOiBIVE1MRWxlbWVudCwgX2FuaW1hdGlvblN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU3RydWN0dXJlLCBfc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSwgX2lzU2VsZWN0ZWREZXNjZW5kYW50OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX2FuaW1hdGlvblN0cnVjdHVyZSkge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gxpJ1aS5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tLCBrZXkpO1xyXG4gICAgICAgICAgbGV0IGlzU2VsZWN0ZWREZXNjZW5kYW50OiBib29sZWFuID0gX2lzU2VsZWN0ZWREZXNjZW5kYW50IHx8IGVsZW1lbnQgPT0gX3NlbGVjdGVkUHJvcGVydHk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgc2VxdWVuY2U6IE9iamVjdCA9IF9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XTtcclxuICAgICAgICAgIGlmIChzZXF1ZW5jZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlICYmIGlzU2VsZWN0ZWREZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIF9zZXF1ZW5jZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgY29sb3I6IGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYW5pbWF0aW9uLXByb3BlcnR5XCIpLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHNlcXVlbmNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKGVsZW1lbnQsIDzGki5BbmltYXRpb25TdHJ1Y3R1cmU+X2FuaW1hdGlvblN0cnVjdHVyZVtrZXldLCBfc2VxdWVuY2VzLCBpc1NlbGVjdGVkRGVzY2VuZGFudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVQYXRoKF9wYXRoOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IF9wYXRoLmxlbmd0aCAtIDE7IGkrKylcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlW19wYXRoW2ldXTtcclxuICAgICAgZGVsZXRlIHZhbHVlW19wYXRoW19wYXRoLmxlbmd0aCAtIDFdXTtcclxuXHJcbiAgICAgIGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUodGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUoX29iamVjdDogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfb2JqZWN0KSB7XHJcbiAgICAgICAgICBpZiAoX29iamVjdFtrZXldIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZShfb2JqZWN0W2tleV0pO1xyXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBkZWxldGUgX29iamVjdFtrZXldO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX29iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX29iamVjdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkNMSUNLOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIGlmICghKF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgfHwgIXRoaXMuYW5pbWF0aW9uIHx8IF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSBfZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgfHwgdGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRTZXF1ZW5jZXModGFyZ2V0KTtcclxuICAgICAgICAgIGVsc2UgaWYgKHRhcmdldCA9PSB0aGlzLmRvbSlcclxuICAgICAgICAgICAgdGhpcy5zZXF1ZW5jZXMgPSB0aGlzLmdldFNlbGVjdGVkU2VxdWVuY2VzKCk7XHJcblxyXG4gICAgICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuc2VxdWVuY2VzIH0gfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHZpZXcncyBzdGF0ZS4gRHVyaW5nIHJlY29uc3RydWN0aW9uLCB2aWV3cyByZWNlaXZlIGEgbWVyZ2VkIHN0YXRlIG9iamVjdCB0aGF0IGNvbWJpbmVzIHRoZSBzdGF0ZXMgb2YgYm90aCB0aGVpciBwYW5lbCBhbmQgdGhlIHZpZXcgaXRzZWxmLlxyXG4gICAqIEVuc3VyZSB1bmlxdWUgcHJvcGVydHkgbmFtZXMgdG8gYXZvaWQgY29uZmxpY3RzLlxyXG4gICAqL1xyXG4gIGV4cG9ydCB0eXBlIFZpZXdTdGF0ZSA9IMaSLlNlcmlhbGl6YXRpb247XHJcblxyXG4gIHR5cGUgVmlld3MgPSB7IFtpZDogc3RyaW5nXTogVmlldyB9O1xyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBbW1ZpZXddXXMgdG8gc3VwcG9ydCBnZW5lcmljIGZ1bmN0aW9uYWxpdHlcclxuICAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlldyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB2aWV3czogVmlld3MgPSB7fTtcclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnU6IEVsZWN0cm9uLk1lbnU7XHJcbiAgICAjY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXI7XHJcbiAgICAjaWQ6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICB0aGlzLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICAvLyB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiO1xyXG4gICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJ2aWV3XCIsIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XHJcblxyXG4gICAgICAvL19jb250YWluZXIuZ2V0RWxlbWVudCgpLmFwcGVuZCh0aGlzLmRvbSk7IC8vb2xkXHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lciA9IF9jb250YWluZXI7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLnN0YXRlUmVxdWVzdEV2ZW50ID0gdGhpcy5nZXRTdGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIub24oXCJkZXN0cm95XCIsICgpID0+IHtcclxuICAgICAgICBkZWxldGUgVmlldy52aWV3c1t0aGlzLiNpZF07XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ0xPU0UsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2spO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51ID0gdGhpcy5nZXRDb250ZXh0TWVudSh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFVF9QUk9KRUNULCB0aGlzLmhuZEV2ZW50Q29tbW9uKTtcclxuXHJcbiAgICAgIHRoaXMuI2lkID0gVmlldy5yZWdpc3RlclZpZXdGb3JEcmFnRHJvcCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFZpZXdTb3VyY2UoX2V2ZW50OiBEcmFnRXZlbnQpOiBWaWV3IHtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIpXHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKVxyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZS5zdGFydHNXaXRoKFwic291cmNldmlld1wiKSlcclxuICAgICAgICAgICAgcmV0dXJuIFZpZXcudmlld3NbaXRlbS50eXBlLnNwbGl0KFwiOlwiKS5wb3AoKV07XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyVmlld0ZvckRyYWdEcm9wKF90aGlzOiBWaWV3KTogbnVtYmVyIHtcclxuICAgICAgVmlldy52aWV3c1tWaWV3LmlkQ291bnRdID0gX3RoaXM7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyYWcgc3RhcnRzLCBhZGQgaWRlbnRpZmllciB0byB0aGUgZXZlbnQgaW4gYSB3YXkgdGhhdCBhbGxvd3MgZHJhZ292ZXIgdG8gcHJvY2VzcyB0aGUgc291cmVcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX1NUQVJULCAoX2V2ZW50OiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiU291cmNlVmlldzpcIiArIF90aGlzLiNpZC50b1N0cmluZygpLCBcInR5cGVzSGFja1wiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyYWdnaW5nIG92ZXIgYSB2aWV3LCBnZXQgdGhlIG9yaWdpbmFsIHNvdXJjZSB2aWV3IGZvciBkcmFnZ2luZyBhbmQgY2FsbCBobmREcmFnT3ZlclxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfT1ZFUiwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcbiAgICAgICAgX3RoaXMuaG5kRHJhZ092ZXIoX2V2ZW50LCB2aWV3U291cmNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBkcmFnIG92ZXIgZHVyaW5nIGNhcHR1cmUgcGhhc2UsIGFsbG93cyB2aWV3cyB0byBwcmV2ZW50IGV2ZW50IHJlYWNoaW5nIHRoZSBhY3R1YWwgdGFyZ2V0XHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19PVkVSLCBfZXZlbnQgPT4gX3RoaXMuaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpLCB0cnVlKTtcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJvcHBpbmcgaW50byBhIHZpZXcsIGdldCB0aGUgb3JpZ2luYWwgc291cmNlIHZpZXcgZm9yIGRyYWdnaW5nIGFuZCBjYWxsIGhuZERyb3BcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgxpJ1aS5FVkVOVC5EUk9QLFxyXG4gICAgICAgIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuICAgICAgICAgIF90aGlzLmhuZERyb3AoX2V2ZW50LCB2aWV3U291cmNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhbHNlKTtcclxuXHJcbiAgICAgIC8vIGRyb3AgZHVyaW5nIGNhcHR1cmUgcGhhc2UsIGFsbG93cyB2aWV3cyBtYW5pcHVsYXRlIHRoZSBkcm9wIGRhdGEgYmVmb3JlIHRoZSBhY3R1YWwgdGFyZ2V0IGlzIHJlYWNoZWRcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUk9QLCBfZXZlbnQgPT4gX3RoaXMuaG5kRHJvcENhcHR1cmUoX2V2ZW50LCBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSksIHRydWUpO1xyXG5cclxuICAgICAgcmV0dXJuIFZpZXcuaWRDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgaWQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIGAke3RoaXMuI2lkfV8ke3RoaXMuY29uc3RydWN0b3IubmFtZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUaXRsZShfdGl0bGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuc2V0VGl0bGUoX3RpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IE9iamVjdFtdIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwYXRjaChfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfaW5pdC5kZXRhaWwgPSBfaW5pdC5kZXRhaWwgfHwge307XHJcbiAgICAgIF9pbml0LmRldGFpbC52aWV3ID0gX2luaXQuZGV0YWlsLnZpZXcgfHwgdGhpcztcclxuICAgICAgdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BhdGNoVG9QYXJlbnQoX3R5cGU6IEVWRU5UX0VESVRPUiwgX2luaXQ6IEN1c3RvbUV2ZW50SW5pdDxFdmVudERldGFpbD4pOiB2b2lkIHtcclxuICAgICAgX2luaXQuZGV0YWlsID0gX2luaXQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBfaW5pdC5idWJibGVzID0gdHJ1ZTtcclxuICAgICAgX2luaXQuZGV0YWlsLnZpZXcgPSBfaW5pdC5kZXRhaWwudmlldyB8fCB0aGlzO1xyXG4gICAgICB0aGlzLmRvbS5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBDb250ZXh0TWVudTogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBFdmVudHNcclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3BDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX3NvdXJjZSwgX2V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnRDb21tb24gPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgIC8vICAgY2FzZSBFVkVOVF9FRElUT1IuU0VUX1BST0pFQ1Q6XHJcbiAgICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51ID0gdGhpcy5nZXRDb250ZXh0TWVudSh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCB0aGUgZXh0ZXJuYWwgcmVzb3VyY2VzXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdFeHRlcm5hbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLkN1c3RvbVRyZWU8RGlyZWN0b3J5RW50cnk+O1xyXG5cclxuICAgICNleHBhbmRlZDogc3RyaW5nW107IC8vIGNhY2hlIHN0YXRlIGZyb20gY29uc3RydWN0b3JcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQcm9qZWN0KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nID0gbmV3IFVSTChcIi5cIiwgxpIuUHJvamVjdC5iYXNlVVJMKS5wYXRobmFtZTtcclxuICAgICAgaWYgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PSBcIldpbjMyXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09IFwiV2luNjRcIikge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTsgLy8gc3RyaXAgbGVhZGluZyBzbGFzaFxyXG4gICAgICB9XHJcbiAgICAgIGxldCByb290OiBEaXJlY3RvcnlFbnRyeSA9IERpcmVjdG9yeUVudHJ5LmNyZWF0ZVJvb3QocGF0aCk7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLkN1c3RvbVRyZWU8RGlyZWN0b3J5RW50cnk+KG5ldyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSgpLCByb290KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy50cmVlLmdldEl0ZW1zKClbMF0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBgRHJhZyAmIGRyb3AgZXh0ZXJuYWwgaW1hZ2UsIGF1ZGlvZmlsZSBldGMuIHRvIHRoZSBcIkludGVybmFsXCIsIHRvIGNyZWF0ZSBhIEZVREdFLXJlc291cmNlYDtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZCh0aGlzLiNleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEpICAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoaXMgaXMgZXZlciB0aGUgY2FzZT9cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIC8vIG5vdGhpbmcgYWN0dWFsbHkgc2VsZWN0ZWQuLi5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk9QRU46XHJcbiAgICAgICAgICB0aGlzLnNldFByb2plY3QoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKGl0ZW0uZGF0YS5wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBleHBhbmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiBEaXJlY3RvcnlFbnRyeVtdW10gPSBfcGF0aHMubWFwKF9wYXRoID0+IG5ldyBEaXJlY3RvcnlFbnRyeShcIlwiLCBfcGF0aCwgbnVsbCwgbnVsbCkuZ2V0UGF0aCgpKTtcclxuICAgICAgdGhpcy50cmVlLmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3SW50ZXJuYWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgZ2x0ZkltcG9ydFNldHRpbmdzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHsgLy8gVE9ETzogc2F2ZSB0aGVzZSBzZXR0aW5ncz9cclxuICAgICAgW8aSLkdyYXBoLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuQW5pbWF0aW9uLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuTWF0ZXJpYWwubmFtZV06IGZhbHNlLFxyXG4gICAgICBbxpIuTWVzaC5uYW1lXTogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgLy8gVE9ETzogZWl0aGVyIHJlbW92ZSBWaWV3SW50ZXJuYWxUYWJsZSBvciB1bmlmeSBjb21tb24gZnVuY3Rpb25hbGl0eSB3aXRoIFZpZXdJbnRlcm5hbEZvbGRlciBpbnRvIFZpZXdJbnRlcm5hbC4uLlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheXMgdGhlIGludGVybmFsIHJlc291cmNlcyBhcyBhIGZvbGRlciB0cmVlLlxyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwIHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDI0IFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxGb2xkZXIgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLkN1c3RvbVRyZWU8UmVzb3VyY2VFbnRyeT47XHJcblxyXG4gICAgI2V4cGFuZGVkOiBzdHJpbmdbXTsgLy8gY2FjaGUgc3RhdGUgZnJvbSBjb25zdHJ1Y3RvclxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZE9wZW4pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZENyZWF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29udHJvbGxlcigpOiBDb250cm9sbGVyVHJlZVJlc291cmNlIHtcclxuICAgICAgcmV0dXJuIDxDb250cm9sbGVyVHJlZVJlc291cmNlPnRoaXMudHJlZS5jb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VGb2xkZXIoKTogUmVzb3VyY2VGb2xkZXIge1xyXG4gICAgICByZXR1cm4gcHJvamVjdC5yZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5maWx0ZXIoX2VsZW1lbnQgPT4gIShfZWxlbWVudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIDzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPnRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLmZpbHRlcihfc291cmNlID0+ICEoX3NvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBGb2xkZXJcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9NRVNIKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogYENyZWF0ZSAke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRlbGV0ZVwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IFJlc291cmNlRW50cnkgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuXHJcbiAgICAgIGlmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSB7XHJcbiAgICAgICAgaWYgKCgoYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKSkubGVuZ3RoID4gMCkpXHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKGZvY3VzIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCByZXNvdXJjZTogUmVzb3VyY2VFbnRyeTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2VGb2xkZXIoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSDpcclxuICAgICAgICAgIHJlc291cmNlID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1Q6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbcmVzb3VyY2VdLCBmb2N1cyk7XHJcbiAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKHJlc291cmNlKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoaXRlbSAhPSB0aGlzLmRvbSAmJiAhKGl0ZW0gaW5zdGFuY2VvZiDGknVpLkN1c3RvbVRyZWVJdGVtKSlcclxuICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgaWYgKGl0ZW0gPT0gdGhpcy5kb20pIHtcclxuICAgICAgICBpdGVtID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICAgIGl0ZW0uZm9jdXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tVHJlZUl0ZW0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuaXRlbXMuZm9yRWFjaChfaXRlbSA9PiBfaXRlbS52aXNpYmxlID0gdHJ1ZSk7XHJcblxyXG4gICAgICBpZiAoIShpdGVtLmRhdGEgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVPcHRpb25zOiBDT05URVhUTUVOVVtdID0gW0NPTlRFWFRNRU5VLkNSRUFURV9GT0xERVIsIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCwgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCwgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVF07XHJcbiAgICAgICAgY3JlYXRlT3B0aW9ucy5mb3JFYWNoKF9pZCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoX2lkKSkudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS5kYXRhID09IHRoaXMucmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSkpLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcyB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgIGZvciAoY29uc3Qgc291cmNlIG9mIF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpKSB7XHJcbiAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLk5vZGUpIHtcclxuICAgICAgICAgIHJlc291cmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKHNvdXJjZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuQVVESU86XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBNSU1FLklNQUdFOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuTUVTSDpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2goYXdhaXQgbmV3IMaSLk1lc2hPQkooKS5sb2FkKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuR0xURjpcclxuICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hpY2ggcmVzb3VyY2VzIHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSlcclxuICAgICAgICAgICAgICByZXNvdXJjZXMucHVzaCguLi5hd2FpdCBsb2FkZXIubG9hZFJlc291cmNlczzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPijGklt0eXBlXSkpO1xyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHJlc291cmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSdWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpXHJcbiAgICAgICAgLy8gLy9AdHMtaWdub3JlXHJcbiAgICAgICAgX3ZpZXdTb3VyY2UuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlVQREFURSwgeyBkZXRhaWw6IHsgdmlldzogdGhpcyAvKiAsIGRhdGE6IF92aWV3U291cmNlLmdyYXBoICovIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKCFpbnB1dClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZE9wZW4gPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLkN1c3RvbVRyZWU8UmVzb3VyY2VFbnRyeT4obmV3IENvbnRyb2xsZXJUcmVlUmVzb3VyY2UoKSwgdGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgdG8gY3JlYXRlIG5ldyByZXNvdXJjZS5cXG7il48gU2VsZWN0IG9yIGRyYWcgcmVzb3VyY2UuXCI7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcbiAgICAgIHRoaXMuaG5kQ3JlYXRlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy4jZXhwYW5kZWQpXHJcbiAgICAgICAgdGhpcy5leHBhbmQodGhpcy4jZXhwYW5kZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENyZWF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gYWRkIG5ldyByZXNvdXJjZXMgdG8gcm9vdCBmb2xkZXJcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiDGki5Qcm9qZWN0LnJlc291cmNlcykge1xyXG4gICAgICAgIGxldCByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UgPSDGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXTtcclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VGb2xkZXIuY29udGFpbnMocmVzb3VyY2UpKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKFtyZXNvdXJjZV0sIHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaG5kVXBkYXRlKCk7XHJcbiAgICAgIGxldCByb290SXRlbTogxpJ1aS5DdXN0b21UcmVlSXRlbTxSZXNvdXJjZUVudHJ5PiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZSh0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgaWYgKCFyb290SXRlbS5leHBhbmRlZClcclxuICAgICAgICByb290SXRlbS5leHBhbmQodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyByZW1vdmUgcmVzb3VyY2VzIHRoYXQgYXJlIG5vIGxvbmdlciByZWdpc3RlcmVkIGluIHRoZSBwcm9qZWN0XHJcbiAgICAgIGZvciAoY29uc3QgZGVzY2VuZGFudCBvZiB0aGlzLnJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgIGlmICghKGRlc2NlbmRhbnQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikgJiYgIcaSLlByb2plY3QucmVzb3VyY2VzW2Rlc2NlbmRhbnQuaWRSZXNvdXJjZV0pXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIucmVtb3ZlKGRlc2NlbmRhbnQpO1xyXG5cclxuICAgICAgdGhpcy5obmRVcGRhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRVcGRhdGUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudHJlZS5yZWZyZXNoKCk7XHJcbiAgICAgIE9iamVjdC52YWx1ZXMoxpIuUHJvamVjdC5yZXNvdXJjZXMpXHJcbiAgICAgICAgLmZpbHRlcihfcmVzb3VyY2UgPT4gKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9yZXNvdXJjZSkuc3RhdHVzID09IMaSLlJFU09VUkNFX1NUQVRVUy5FUlJPUilcclxuICAgICAgICAubWFwKF9yZXNvdXJjZSA9PiB0aGlzLmNvbnRyb2xsZXIuZ2V0UGF0aChfcmVzb3VyY2UpKVxyXG4gICAgICAgIC5mb3JFYWNoKF9wYXRoID0+IHRoaXMudHJlZS5zaG93KF9wYXRoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbD8uc2VuZGVyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogX2V2ZW50LmRldGFpbCB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kKF9wYXRoczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGF0aHM6IFJlc291cmNlRW50cnlbXVtdID0gX3BhdGhzXHJcbiAgICAgICAgLm1hcChfcGF0aCA9PiBfcGF0aFxyXG4gICAgICAgICAgLnNwbGl0KFwiL1wiKVxyXG4gICAgICAgICAgLnNsaWNlKDEpIC8vIHJlbW92ZSByb290IGFzIGl0IGlzIGFkZGVkIGFzIGZpcnN0IGVsZW1lbnQgaW4gcmVkdWNlXHJcbiAgICAgICAgICAucmVkdWNlPFJlc291cmNlRm9sZGVyW10+KChfcGF0aCwgX2luZGV4KSA9PiBbLi4uX3BhdGgsIF9wYXRoW19wYXRoLmxlbmd0aCAtIDFdPy5lbnRyaWVzPy5bX2luZGV4XV0sIFt0aGlzLnJlc291cmNlRm9sZGVyXSkpXHJcbiAgICAgICAgLmZpbHRlcihfcGF0aCA9PiAhX3BhdGguc29tZShfZW50cnkgPT4gIV9lbnRyeSkpOyAvLyBmaWx0ZXIgb3V0IGludmFsaWQgcGF0aHNcclxuICAgICAgdGhpcy50cmVlLmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGNvbnN0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMudHJlZSkge1xyXG4gICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgZXhwYW5kZWQucHVzaCh0aGlzLmdldFBhdGgoaXRlbS5kYXRhKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGV4cGFuZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UGF0aChfZW50cnk6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmdldFBhdGgoX2VudHJ5KS5tYXAoX2VudHJ5ID0+IF9lbnRyeS5yZXNvdXJjZVBhcmVudD8uZW50cmllcy5pbmRleE9mKF9lbnRyeSkpLmpvaW4oXCIvXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL1ZpZXcvVmlldy50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbEZvbGRlci50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBpbnRlcmZhY2UgRHJhZ0Ryb3BGaWx0ZXIge1xyXG4gICAgb25LZXlBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcbiAgICBvblR5cGVBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcbiAgICBmcm9tVmlld3M/OiAodHlwZW9mIFZpZXcpW107XHJcbiAgICBvblR5cGU/OiBGdW5jdGlvbjtcclxuICAgIG9mVHlwZT86IEZ1bmN0aW9uO1xyXG4gICAgZHJvcEVmZmVjdDogXCJjb3B5XCIgfCBcImxpbmtcIiB8IFwibW92ZVwiIHwgXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBsZXQgZmlsdGVyOiB7IFtuYW1lOiBzdHJpbmddOiBEcmFnRHJvcEZpbHRlciB9ID0ge1xyXG4gICAgVXJsT25UZXh0dXJlOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiVGV4dHVyZUltYWdlXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBVcmxPbk1lc2hPQko6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJNZXNoT0JKXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBVcmxPbkF1ZGlvOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiQXVkaW9cIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uTWVzaEdMVEY6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJNZXNoR0xURlwiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9XHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJEZXRhaWwgZXh0ZW5kcyDGklVpLkNvbnRyb2xsZXIge1xyXG4gICAgI3ZpZXc6IFZpZXc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlLCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF92aWV3OiBWaWV3KSB7XHJcbiAgICAgIHN1cGVyKF9tdXRhYmxlLCBfZG9tRWxlbWVudCk7XHJcbiAgICAgIHRoaXMuI3ZpZXcgPSBfdmlldztcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5JTlNFUlQsIHRoaXMuaG5kSW5zZXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiSU5TRVJUIGF0IENvbnRyb2xsZXJEZXRhaWxcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9ldmVudC5kZXRhaWwpO1xyXG4gICAgICBsZXQgbXV0YWJsZTogxpIuTXV0YWJsZSA9IHRoaXMubXV0YWJsZVtfZXZlbnQuZGV0YWlsLmdldEF0dHJpYnV0ZShcImtleVwiKV07XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGFibGUudHlwZSk7XHJcbiAgICAgIGlmIChtdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5KVxyXG4gICAgICAgIG11dGFibGUucHVzaChuZXcgbXV0YWJsZS50eXBlKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGklVpLkVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHRoaXMgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB1cmwgb24gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPblRleHR1cmUsIGNoZWNrTWltZVR5cGUoTUlNRS5JTUFHRSkpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBtZXNob2JqXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaE9CSiwgY2hlY2tNaW1lVHlwZShNSU1FLk1FU0gpKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gYXVkaW9cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25BdWRpbywgY2hlY2tNaW1lVHlwZShNSU1FLkFVRElPKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIG1lc2hnbHRmXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaEdMVEYsIGNoZWNrTWltZVR5cGUoTUlNRS5HTFRGKSkpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCB7IG11dGFibGUsIGtleSB9ID0gdGhpcy5nZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudCk7XHJcbiAgICAgIGxldCBtZXRhVHlwZXM6IMaSLk1ldGFBdHRyaWJ1dGVUeXBlcyA9ICg8xpIuTXV0YWJsZT5tdXRhYmxlKS5nZXRNZXRhQXR0cmlidXRlVHlwZXM/LigpID8/IHt9O1xyXG4gICAgICBsZXQgbWV0YVR5cGU6IEZ1bmN0aW9uID0gbWV0YVR5cGVzW2tleV07XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGtleSwgbWV0YVR5cGVzLCBtZXRhVHlwZSk7XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgaWYgKCFtZXRhVHlwZSB8fCAobWV0YVR5cGUgJiYgdHlwZW9mIG1ldGFUeXBlID09IFwiZnVuY3Rpb25cIiAmJiAhKHNvdXJjZXNbMF0gaW5zdGFuY2VvZiBtZXRhVHlwZSkpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tNaW1lVHlwZShfbWltZTogTUlNRSk6IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICAgcmV0dXJuIChzb3VyY2VzLmxlbmd0aCA9PSAxICYmIHNvdXJjZXNbMF0uZ2V0TWltZVR5cGUoKSA9PSBfbWltZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHNldEV4dGVybmFsTGluazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS52YWx1ZSA9IHNvdXJjZXNbMF0ucGF0aFJlbGF0aXZlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlT25JbnB1dChfZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPblRleHR1cmUsIHNldEV4dGVybmFsTGluaykpIHJldHVybjtcclxuICAgICAgLy8gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbk1lc2hPQkosIHNldEV4dGVybmFsTGluaykpIHJldHVybjtcclxuICAgICAgLy8gYXVkaW9cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25BdWRpbywgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGxldCB7IG11dGFibGUsIGtleSB9ID0gdGhpcy5nZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudCk7XHJcblxyXG4gICAgICBpZiAodGhpcy4jdmlldyAhPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIG11dGFibGVba2V5XSA9IHNvdXJjZXNbMF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuI3ZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJEcmFnRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX2ZpbHRlcjogRHJhZ0Ryb3BGaWx0ZXIsIF9jYWxsYmFjazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9ICgpID0+IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IHR5cGVFbGVtZW50OiBzdHJpbmcgPSB0YXJnZXQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiBzdHJpbmcgPSB0aGlzLmdldEFuY2VzdG9yV2l0aFR5cGUodGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG5cclxuICAgICAgaWYgKF9maWx0ZXIub25LZXlBdHRyaWJ1dGUgJiYgdHlwZUVsZW1lbnQgIT0gX2ZpbHRlci5vbktleUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGVBdHRyaWJ1dGUgJiYgdHlwZUNvbXBvbmVudCAhPSBfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGUgJiYgISh0aGlzLm11dGFibGUgaW5zdGFuY2VvZiBfZmlsdGVyLm9uVHlwZSkpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcblxyXG4gICAgICBpZiAoIV9maWx0ZXIuZnJvbVZpZXdzPy5maW5kKChfdmlldykgPT4gdmlld1NvdXJjZSBpbnN0YW5jZW9mIF92aWV3KSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSB2aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBpZiAoIShzb3VyY2VzWzBdIGluc3RhbmNlb2YgX2ZpbHRlci5vZlR5cGUpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghX2NhbGxiYWNrKHNvdXJjZXMpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBbmNlc3RvcldpdGhUeXBlKF90YXJnZXQ6IEV2ZW50VGFyZ2V0KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X3RhcmdldDtcclxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgdHlwZTogc3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIGlmICh0eXBlKVxyXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudDogRXZlbnQpOiB7IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47IGtleTogc3RyaW5nIH0ge1xyXG4gICAgICBsZXQgcGF0aDogxpIuR2VuZXJhbFtdID0gX2V2ZW50LmNvbXBvc2VkUGF0aCgpO1xyXG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBwYXRoLmluZGV4T2YodGhpcy5kb21FbGVtZW50KSk7XHJcbiAgICAgIHBhdGggPSBwYXRoLmZpbHRlcihfZWxlbWVudCA9PiBfZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIChfZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKSk7XHJcbiAgICAgIHBhdGgucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4gPSB0aGlzLm11dGFibGU7XHJcbiAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IHBhdGgubWFwKF9lbGVtZW50ID0+IF9lbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7IGkrKylcclxuICAgICAgICBtdXRhYmxlID0gbXV0YWJsZVtrZXlzW2ldXTtcclxuXHJcbiAgICAgIHJldHVybiB7IG11dGFibGUsIGtleToga2V5c1trZXlzLmxlbmd0aCAtIDFdIH07XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFkOiDGknVpLlRBQkxFW10gPSBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiB0cnVlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJUeXBlXCIsIGtleTogXCJ0eXBlXCIsIHNvcnRhYmxlOiB0cnVlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIklkXCIsIGtleTogXCJpZFJlc291cmNlXCIsIHNvcnRhYmxlOiBmYWxzZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlUmVzb3VyY2UuaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TGFiZWwoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgcmVuYW1lKF9vYmplY3Q6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJDaGVjayByZW5hbWVcIiwgX29iamVjdC5uYW1lLCBfbmV3KTtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9vYmplY3QubmFtZSAhPSBfbmV3O1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX29iamVjdC5uYW1lID0gX25ldzsgLy8gbXVzdCByZW5hbWUgYmVmb3JlIGxvYWRpbmcsIFRPRE86IFdIWSBpcyBpdCB0aGF0IHRoZSByZW5hbWluZyBpcyBzdXBwb3NlZCB0byBiZSBoYW5kbGVkIGJ5IHRoZSBhY3R1YWwgdGFibGU/Pz9cclxuICAgICAgICBhd2FpdCAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X29iamVjdCkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvcHkoX29yaWdpbmFsczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSk6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9mb2N1c3NlZCwgdGhpcy5zZWxlY3Rpb24pO1xyXG4gICAgICAvLyB0aGlzLnNlbGVjdGlvbiA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kYWJsZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSB0aGlzLnNlbGVjdGlvbi5jb25jYXQoW10pOyAvL19mb2N1c3NlZCk7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uczogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25TdHJpbmdzOiBNYXA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCB1c2FnZXM6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBleHBlbmRhYmxlIG9mIGV4cGVuZGFibGVzKSB7XHJcbiAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBleHBlbmRhYmxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgIGlmIChzZXJpYWxpemF0aW9uU3RyaW5ncy5nZXQocmVzb3VyY2UpLmluZGV4T2YoZXhwZW5kYWJsZS5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhd2FpdCBvcGVuRGlhbG9nKCkpIHtcclxuICAgICAgICBsZXQgZGVsZXRlZDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHVzYWdlIGluIHVzYWdlcylcclxuICAgICAgICAgIGlmICh1c2FnZXNbdXNhZ2VdLmxlbmd0aCA9PSAwKSB7IC8vIGRlbGV0ZSBvbmx5IHVudXNlZFxyXG4gICAgICAgICAgICBkZWxldGVkLnB1c2goxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKMaSLlByb2plY3QucmVzb3VyY2VzW3VzYWdlXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQodXNhZ2VzLCB0cnVlLCBcIlJldmlldyByZWZlcmVuY2VzLCBkZWxldGUgZGVwZW5kZW5kIHJlc291cmNlcyBmaXJzdCBpZiBhcHBsaWNhYmxlXCIsIFwiVG8gZGVsZXRlIHVudXNlZCByZXNvdXJjZXMsIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgX2I6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBTY3JpcHRJbmZvIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3VwZXJDbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIHNjcmlwdDogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgaXNDb21wb25lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudFNjcmlwdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihfc2NyaXB0OiBGdW5jdGlvbiwgX25hbWVzcGFjZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuc2NyaXB0ID0gX3NjcmlwdDtcclxuICAgICAgdGhpcy5uYW1lID0gX3NjcmlwdC5uYW1lO1xyXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IF9uYW1lc3BhY2U7XHJcbiAgICAgIGxldCBjaGFpbjogRnVuY3Rpb24gPSBfc2NyaXB0W1wiX19wcm90b19fXCJdO1xyXG4gICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBjaGFpbi5uYW1lO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudCA9IHRoaXMuaXNDb21wb25lbnQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRcIik7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudFNjcmlwdCA9IHRoaXMuaXNDb21wb25lbnRTY3JpcHQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRTY3JpcHRcIik7XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbltcIl9fcHJvdG9fX1wiXTtcclxuICAgICAgfSB3aGlsZSAoY2hhaW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVNjcmlwdCBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPFNjcmlwdEluZm8+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVNjcmlwdC5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiU3VwZXJcIiwga2V5OiBcInN1cGVyQ2xhc3NcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZXNwYWNlXCIsIGtleTogXCJuYW1lc3BhY2VcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgcmV0dXJuIGhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlYWQoKTogxpJ1aS5UQUJMRVtdIHtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXJUYWJsZVNjcmlwdC5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiBTY3JpcHRJbmZvKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogU2NyaXB0SW5mbywgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGRlbGV0ZShfZm9jdXNzZWQ6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiBTY3JpcHRJbmZvW10pOiBQcm9taXNlPFNjcmlwdEluZm9bXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc29ydChfZGF0YTogU2NyaXB0SW5mb1tdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiBTY3JpcHRJbmZvLCBfYjogU2NyaXB0SW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIF9kaXJlY3Rpb24gKiAoX2FbX2tleV0gPT0gX2JbX2tleV0gPyAwIDogKF9hW19rZXldID4gX2JbX2tleV0gPyAxIDogLTEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2RhdGEuc29ydChjb21wYXJlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSBleHRlbmRzIMaSVWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8RGlyZWN0b3J5RW50cnk+IHtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gX2VudHJ5Lm5hbWU7XHJcbiAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSwgX2VsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLndhcm4oYENvdWxkIG5vdCByZW5hbWUgZmlsZSAnJHtfZW50cnkubmFtZX0nIHRvICcke19lbGVtZW50LnZhbHVlfScuYCwgX2Vycm9yKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IERpcmVjdG9yeUVudHJ5KTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeS5pc0RpcmVjdG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5LmdldERpcmVjdG9yeUNvbnRlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKF9hOiBEaXJlY3RvcnlFbnRyeSwgX2I6IERpcmVjdG9yeUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfYS5wYXRoUmVsYXRpdmUgPT0gX2IucGF0aFJlbGF0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBEaXJlY3RvcnlFbnRyeVtdKTogUHJvbWlzZTxEaXJlY3RvcnlFbnRyeVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kOiBEaXJlY3RvcnlFbnRyeVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3Vzc2VkO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLnNlbGVjdGlvbiB8fCBleHBlbmQpIHtcclxuICAgICAgICBlbnRyeS5kZWxldGUoKTtcclxuICAgICAgICBkZWxldGVkLnB1c2goZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9lbnRyaWVzOiBEaXJlY3RvcnlFbnRyeVtdLCBfdGFyZ2V0OiBEaXJlY3RvcnlFbnRyeSk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICBsZXQgbW92ZTogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfZW50cmllcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBfdGFyZ2V0LmFkZEVudHJ5KGVudHJ5KTtcclxuICAgICAgICAgIGVudHJ5LmRlbGV0ZSgpO1xyXG4gICAgICAgICAgbW92ZS5wdXNoKGVudHJ5KTtcclxuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICAgIMaSLkRlYnVnLndhcm4oYENvdWxkIG5vdCBhZGQgZmlsZSAnJHtlbnRyeS5uYW1lfScgdG8gJyR7X3RhcmdldC5uYW1lfScuYCwgX2Vycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogRGlyZWN0b3J5RW50cnlbXSk6IFByb21pc2U8RGlyZWN0b3J5RW50cnlbXT4ge1xyXG4gICAgICAvLyBjb3BpZXMgY2FuIG5vdCBiZSBjcmVhdGVkIGF0IHRoaXMgcG9pbnQsIGJ1dCB3aGVuIGNvcHlpbmcgdGhlIGZpbGVzLiBTZWUgYWRkQ2hpbGRyZW5cclxuICAgICAgcmV0dXJuIF9vcmlnaW5hbHM7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZUhpZXJhcmNoeSBleHRlbmRzIMaSVWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8xpIuTm9kZT4ge1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9vYmplY3Q6IMaSLk5vZGUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKF9vYmplY3QgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgIMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoX29iamVjdC5pZFNvdXJjZSkudGhlbihfZ3JhcGggPT4ge1xyXG4gICAgICAgICAgX29iamVjdC5uYW1lID0gX2dyYXBoLm5hbWU7XHJcbiAgICAgICAgICBpbnB1dC52YWx1ZSA9IF9ncmFwaC5uYW1lO1xyXG4gICAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IF9vYmplY3QubmFtZTtcclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9ub2RlOiDGki5Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW19ub2RlLmlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIl07XHJcbiAgICAgIGlmIChfbm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiR3JhcGhJbnN0YW5jZVwiKTtcclxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIHNldFZhbHVlKF9ub2RlOiDGki5Ob2RlLCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfbm9kZS5uYW1lICE9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlOiDGki5HcmFwaEluc3RhbmNlID0gaW5HcmFwaEluc3RhbmNlKF9ub2RlKTtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgIMaSVWkuRGlhbG9nLnByb21wdChudWxsLCB0cnVlLCBgQSA8aT5ncmFwaCBpbnN0YW5jZTwvaT4gZ2V0cyByZWNyZWF0ZWQgZnJvbSB0aGUgb3JpZ2luYWwgZ3JhcGhgLCBgRWRpdCB0aGUgZ3JhcGggXCIke2luc3RhbmNlLm5hbWV9XCIgdG8gcmVuYW1lIG5vZGVzLCBzYXZlIGFuZCByZWxvYWQgdGhlIHByb2plY3Q8YnI+UHJlc3MgT0sgdG8gY29udGludWVgLCBcIk9LXCIsIFwiXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfbm9kZS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgYXdhaXQgKDzGki5HcmFwaEdMVEY+X25vZGUpLmxvYWQ/LigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbihfbm9kZTogxpIuTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX25vZGUuZ2V0Q2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfbm9kZTogxpIuTm9kZSk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiBfbm9kZS5nZXRDaGlsZHJlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiDGki5Ob2RlW10pOiBQcm9taXNlPMaSLk5vZGVbXT4ge1xyXG4gICAgICAvLyBkZWxldGUgc2VsZWN0aW9uIGluZGVwZW5kZW5kIG9mIGZvY3Vzc2VkIGl0ZW1cclxuICAgICAgbGV0IGRlbGV0ZWQ6IMaSLk5vZGVbXSA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kOiDGki5Ob2RlW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNzZWQ7XHJcblxyXG4gICAgICBmb3IgKGxldCBub2RlIG9mIGV4cGVuZCkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZTogxpIuR3JhcGhJbnN0YW5jZSA9IGluR3JhcGhJbnN0YW5jZShub2RlKTtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgIMaSVWkuRGlhbG9nLnByb21wdChudWxsLCB0cnVlLCBgQSA8aT5ncmFwaCBpbnN0YW5jZTwvaT4gZ2V0cyByZWNyZWF0ZWQgZnJvbSB0aGUgb3JpZ2luYWwgZ3JhcGhgLCBgRWRpdCB0aGUgZ3JhcGggXCIke2luc3RhbmNlLm5hbWV9XCIgdG8gZGVsZXRlIFwiJHtub2RlLm5hbWV9XCIsIHNhdmUgYW5kIHJlbG9hZCB0aGUgcHJvamVjdDxicj5QcmVzcyBPSyB0byBjb250aW51ZWAsIFwiT0tcIiwgXCJcIik7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IG5vZGUgb2YgZXhwZW5kKVxyXG4gICAgICAgIGlmIChub2RlLmdldFBhcmVudCgpKSB7XHJcbiAgICAgICAgICBub2RlLmdldFBhcmVudCgpLnJlbW92ZUNoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlLCBfaW5kZXg/OiBudW1iZXIpOiDGki5Ob2RlW10ge1xyXG4gICAgICAvLyBkaXNhbGxvdyBkcm9wIGZvciBzb3VyY2VzIGJlaW5nIGFuY2VzdG9yIHRvIHRhcmdldFxyXG4gICAgICBsZXQgbW92ZTogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9jaGlsZHJlbilcclxuICAgICAgICBpZiAoIV90YXJnZXQuaXNEZXNjZW5kYW50T2YoY2hpbGQpKVxyXG4gICAgICAgICAgbW92ZS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgIG1vdmUuZm9yRWFjaCgoX25vZGUsIF9pTW92ZSkgPT4gX3RhcmdldC5hZGRDaGlsZChfbm9kZSwgX2luZGV4ID09IHVuZGVmaW5lZCA/IF9pbmRleCA6IF9pbmRleCArIF9pTW92ZSkpO1xyXG4gICAgICAvLyBmb3IgKGxldCBub2RlIG9mIG1vdmUpXHJcbiAgICAgIC8vICAgX3RhcmdldC5hZGRDaGlsZChub2RlLCBfaVRhcmdldCk7XHJcblxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5Ob2RlW10pOiBQcm9taXNlPMaSLk5vZGVbXT4ge1xyXG4gICAgICAvLyB0cnkgdG8gY3JlYXRlIGNvcGllcyBhbmQgcmV0dXJuIHRoZW0gZm9yIHBhc3RlIG9wZXJhdGlvblxyXG4gICAgICBsZXQgY29waWVzOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgb3JpZ2luYWwgb2YgX29yaWdpbmFscykge1xyXG4gICAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5zZXJpYWxpemUob3JpZ2luYWwpO1xyXG4gICAgICAgIGxldCBjb3B5OiDGki5Ob2RlID0gPMaSLk5vZGU+YXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZShzZXJpYWxpemF0aW9uKTtcclxuICAgICAgICBjb3BpZXMucHVzaChjb3B5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29waWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5BZGRDaGlsZHJlbihfc291cmNlczogxpIuTm9kZVtdLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfc291cmNlcy5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gX3NvdXJjZXMuZXZlcnkoX3NvdXJjZSA9PiBjaGVja0dyYXBoRHJvcChfc291cmNlLCBfdGFyZ2V0KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja0dyYXBoRHJvcChfc291cmNlOiDGki5Ob2RlLCBfdGFyZ2V0OiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGlkU291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBub2RlIG9mIF9zb3VyY2UuZ2V0SXRlcmF0b3IoKSlcclxuICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICAgICAgaWRTb3VyY2VzLnB1c2gobm9kZS5pZFNvdXJjZSk7XHJcbiAgICAgICAgICBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlkU291cmNlcy5wdXNoKG5vZGUuaWRSZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGlmIChfdGFyZ2V0IGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICAgIGlmIChpZFNvdXJjZXMuaW5kZXhPZihfdGFyZ2V0LmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgaWYgKF90YXJnZXQgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgICAgICBpZiAoaWRTb3VyY2VzLmluZGV4T2YoX3RhcmdldC5pZFNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgX3RhcmdldCA9IF90YXJnZXQuZ2V0UGFyZW50KCk7XHJcbiAgICAgICAgfSB3aGlsZSAoX3RhcmdldCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0IGVudW0gSUQge1xyXG4gICAgTkFNRSA9IFwibmFtZVwiLFxyXG4gICAgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCIsXHJcbiAgICBWQUxVRSA9IFwidmFsdWVcIixcclxuICAgIFRSQU5TRk9STUFUSU9OID0gXCJ0cmFuc2Zvcm1hdGlvblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIMaSdWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4ge1xyXG4gICAgcHVibGljIGNoaWxkVG9QYXJlbnQ6IE1hcDzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbTtcclxuICAgIHByaXZhdGUgdmlldzogVmlld1BhcnRpY2xlU3lzdGVtO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbSwgX3ZpZXc6IFZpZXdQYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy52aWV3ID0gX3ZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgbGV0IHBhcmVudERhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZXRLZXkoX2RhdGEpO1xyXG4gICAgICBcclxuICAgICAgaWYgKCHGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSAmJiAhxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IHNwYW5OYW1lOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuTmFtZS5pbm5lclRleHQgPSBwYXJlbnREYXRhID8ga2V5IDogxpIuUGFydGljbGVTeXN0ZW0ubmFtZTtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHNwYW5OYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmVudERhdGEgJiYgcGFyZW50RGF0YSA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICAvLyBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lc1trZXldO1xyXG4gICAgICAgIGlucHV0LmlkID0gSUQuTkFNRTtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSB7XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgICAgc2VsZWN0LmlkID0gSUQuRlVOQ1RJT047XHJcbiAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIE9iamVjdC52YWx1ZXMoxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OKSkge1xyXG4gICAgICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgZW50cnkudGV4dCA9IG5hbWU7XHJcbiAgICAgICAgICAgIGVudHJ5LnZhbHVlID0gbmFtZTtcclxuICAgICAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzZWxlY3QudmFsdWUgPSBfZGF0YS5mdW5jdGlvbjtcclxuICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgICAgLy8gaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaW5wdXQuaWQgPSBJRC5WQUxVRTtcclxuICAgICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkge1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IF9kYXRhLmNvZGU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IF9kYXRhLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImxpc3RcIiwgXCJ2YXJpYWJsZXNcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB9IFxyXG4gICAgICB9IGVsc2UgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgICBzZWxlY3QuaWQgPSBJRC5UUkFOU0ZPUk1BVElPTjtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0pIHtcclxuICAgICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgZW50cnkudGV4dCA9IGtleTtcclxuICAgICAgICAgIGVudHJ5LnZhbHVlID0ga2V5O1xyXG4gICAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdC52YWx1ZSA9IF9kYXRhLnRyYW5zZm9ybWF0aW9uO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgYXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSB8fCB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKSA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSBcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJ2YXJpYWJsZVwiKTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goX2RhdGEuZnVuY3Rpb24pO1xyXG4gICAgICBpZiAoX2RhdGEgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcImNvbG9yXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSBcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJ0cmFuc2Zvcm1hdGlvblwiKTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvZGUoX2RhdGEpKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcImNvZGVcIik7XHJcblxyXG4gICAgICByZXR1cm4gYXR0cmlidXRlcy5qb2luKFwiIFwiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGFzeW5jIHNldFZhbHVlKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCBpbnB1dEFzTnVtYmVyOiBudW1iZXIgPSBOdW1iZXIucGFyc2VGbG9hdChfZWxlbWVudC52YWx1ZSk7XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuTkFNRSAmJiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkge1xyXG4gICAgICAgIGxldCBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLmluY2x1ZGVzKF9lbGVtZW50LnZhbHVlKSlcclxuICAgICAgICAgIGVycm9ycy5wdXNoKGB2YXJpYWJsZSBcIiR7X2VsZW1lbnR9XCIgYWxyZWFkeSBleGlzdHNgKTtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTW19lbGVtZW50LnZhbHVlXSlcclxuICAgICAgICAgIGVycm9ycy5wdXNoKGB2YXJpYWJsZSBcIiR7X2VsZW1lbnR9XCIgaXMgYSBwcmVkZWZpbmVkIHZhcmlhYmxlIGFuZCBjYW4gbm90IGJlIHJlZGVjbGFyZWQuIFByZWRlZmluZWQgdmFyaWFibGVzOiBbJHtPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpLmpvaW4oXCIsIFwiKX1dYCk7XHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICDGknVpLldhcm5pbmcuZGlzcGxheShlcnJvcnMsIFwiVW5hYmxlIHRvIHJlbmFtZVwiLCBcIlBsZWFzZSByZXNvbHZlIHRoZSBlcnJvcnMgYW5kIHRyeSBhZ2FpblwiICk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5kYXRhLnZhcmlhYmxlcy5pbmRleE9mKF9kYXRhKTtcclxuICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdO1xyXG4gICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2luZGV4XSA9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuYW1lVmFyaWFibGUobmFtZSwgX2VsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuRlVOQ1RJT04gJiYgxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgX2RhdGEuZnVuY3Rpb24gPSA8xpIuUGFydGljbGVEYXRhLkZVTkNUSU9OPl9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2VsZW1lbnQuaWQgPT0gSUQuVFJBTlNGT1JNQVRJT04gJiYgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgX2RhdGEudHJhbnNmb3JtYXRpb24gPSA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5WQUxVRSAmJiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSkpIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IHN0cmluZyB8IG51bWJlciA9IE51bWJlci5pc05hTihpbnB1dEFzTnVtYmVyKSA/IF9lbGVtZW50LnZhbHVlIDogaW5wdXRBc051bWJlcjtcclxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIgJiYgIcaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFU1tpbnB1dF0gJiYgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMgJiYgIXRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLmluY2x1ZGVzKGlucHV0KSkgXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgX2RhdGEudmFsdWUgPSBpbnB1dDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5WQUxVRSAmJiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpKSB7XHJcbiAgICAgICAgX2RhdGEuY29kZSA9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNDb25zdGFudChfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRyZW4oX2RhdGEpLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgbGV0IGNoaWxkcmVuOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10gPSBbXTtcclxuICAgICAgbGV0IGRhdGE6IE9iamVjdCA9IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGE7XHJcbiAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRhdGEgPT0gdGhpcy5kYXRhKVxyXG4gICAgICAgIGtleXMgPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUy5maWx0ZXIoX2tleSA9PiBrZXlzLmluY2x1ZGVzKF9rZXkpKTtcclxuXHJcbiAgICAgIGtleXMuZm9yRWFjaChfa2V5ID0+IHtcclxuICAgICAgICBsZXQgY2hpbGQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSBkYXRhW19rZXldO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKGNoaWxkKSB8fCB0eXBlb2YgY2hpbGQgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuc2V0KGRhdGFbX2tleV0sIF9kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNlZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10pOiBQcm9taXNlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXT4ge1xyXG4gICAgICAvLyBkZWxldGUgc2VsZWN0aW9uIGluZGVwZW5kZW5kIG9mIGZvY3Vzc2VkIGl0ZW1cclxuICAgICAgbGV0IGRlbGV0ZWQ6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6ICjGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3VzZWQ7XHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgZXhwZW5kKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVsZXRlRGF0YShkYXRhKSlcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSwgX3RhcmdldDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSwgX2F0PzogbnVtYmVyKTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdIHtcclxuICAgICAgbGV0IG1vdmU6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSA9IFtdO1xyXG4gICAgICBsZXQgY29udGFpbmVyOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW107XHJcblxyXG4gICAgICBpZiAoKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF90YXJnZXQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF90YXJnZXQpKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IF90YXJnZXQucGFyYW1ldGVycztcclxuICAgICAgZWxzZSBpZiAoKF90YXJnZXQgPT0gdGhpcy5kYXRhLm10eExvY2FsIHx8IF90YXJnZXQgPT0gdGhpcy5kYXRhLm10eFdvcmxkKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSlcclxuICAgICAgICBjb250YWluZXIgPSA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW10+X3RhcmdldDtcclxuICAgICAgZWxzZSBpZiAoKF90YXJnZXQgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcyB8fCBfdGFyZ2V0ID09IHRoaXMuZGF0YS5jb2xvcikgJiYgX2NoaWxkcmVuLmV2ZXJ5KF9kYXRhID0+IMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSlcclxuICAgICAgICBjb250YWluZXIgPSA8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb25bXT5fdGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKCFjb250YWluZXIpIFxyXG4gICAgICAgIHJldHVybiBtb3ZlO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGFpbmVyKSlcclxuICAgICAgICBmb3IgKGxldCBkYXRhIG9mIF9jaGlsZHJlbikge1xyXG4gICAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBjb250YWluZXIuaW5kZXhPZihkYXRhKTsgLy8gX2F0IG5lZWRzIHRvIGJlIGNvcnJlY3RlZCBpZiB3ZSBhcmUgbW92aW5nIHdpdGhpbiBzYW1lIHBhcmVudFxyXG4gICAgICAgICAgbGV0IGhhc1BhcmVudDogYm9vbGVhbiA9IHRoaXMuY2hpbGRUb1BhcmVudC5oYXMoZGF0YSk7XHJcbiAgICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXM/LltpbmRleF07XHJcblxyXG4gICAgICAgICAgaWYgKGhhc1BhcmVudCAmJiAhdGhpcy5kZWxldGVEYXRhKGRhdGEpKSBcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgaWYgKCFoYXNQYXJlbnQpXHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHJcbiAgICAgICAgICBtb3ZlLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuc2V0KGRhdGEsIF90YXJnZXQpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID4gLTEgJiYgX2F0ID4gaW5kZXgpXHJcbiAgICAgICAgICAgIF9hdCAtPSAxO1xyXG5cclxuICAgICAgICAgIGlmIChfYXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnB1c2gobmFtZSB8fCB0aGlzLmdlbmVyYXRlTmV3VmFyaWFibGVOYW1lKCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLnNwbGljZShfYXQgKyBfY2hpbGRyZW4uaW5kZXhPZihkYXRhKSwgMCwgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5zcGxpY2UoX2F0ICsgX2NoaWxkcmVuLmluZGV4T2YoZGF0YSksIDAsIG5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdKTogUHJvbWlzZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10+IHtcclxuICAgICAgbGV0IGNvcGllczogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSBbXTtcclxuICAgICAgaWYgKF9vcmlnaW5hbHMuZXZlcnkoX29yaWdpbmFsID0+IMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX29yaWdpbmFsKSkgfHwgX29yaWdpbmFscy5ldmVyeShfb3JpZ2luYWwgPT4gxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX29yaWdpbmFsKSkpXHJcbiAgICAgICAgX29yaWdpbmFscy5mb3JFYWNoKF9vcmlnaW5hbCA9PiBjb3BpZXMucHVzaChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KF9vcmlnaW5hbCkpKSk7XHJcblxyXG4gICAgICByZXR1cm4gY29waWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvdmVycmlkZSBkcmFnZ2FibGUoX3RhcmdldDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfdGFyZ2V0KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IFwibmV3VmFyaWFibGVcIjtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAxO1xyXG4gICAgICB3aGlsZSAodGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcclxuICAgICAgICBuYW1lID0gXCJuZXdWYXJpYWJsZVwiICsgY291bnQ7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEtleShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IHN0cmluZyB7IFxyXG4gICAgICBsZXQgcGFyZW50OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5jaGlsZFRvUGFyZW50LmdldChfZGF0YSkgfHwge307XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihwYXJlbnQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKHBhcmVudCkpXHJcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmFtZXRlcnM7XHJcblxyXG4gICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocGFyZW50KS5maW5kKF9lbnRyeSA9PiBfZW50cnlbMV0gPT0gX2RhdGEpPy5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVsZXRlRGF0YShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAoX2RhdGEgPT0gdGhpcy5kYXRhKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBwYXJlbnQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gdGhpcy5nZXRLZXkoX2RhdGEpO1xyXG5cclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKHBhcmVudCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24ocGFyZW50KSlcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyYW1ldGVycztcclxuXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudCkpIHtcclxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IE51bWJlci5wYXJzZUludChrZXkpO1xyXG4gICAgICAgIHBhcmVudC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmIChwYXJlbnQgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVsZXRlIHBhcmVudFtrZXldO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmNoaWxkVG9QYXJlbnQuZGVsZXRlKF9kYXRhKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5hbWVWYXJpYWJsZShfbmFtZTogc3RyaW5nLCBfbmV3OiBzdHJpbmcsIF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy5kYXRhKTogdm9pZCB7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgJiYgX2RhdGEudmFsdWUgPT0gX25hbWUpIHtcclxuICAgICAgICBfZGF0YS52YWx1ZSA9IF9uZXc7XHJcbiAgICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgZGV0YWlsOiB7IGRhdGE6IF9kYXRhIH0gfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoY29uc3Qgc3ViRGF0YSBvZiBPYmplY3QudmFsdWVzKFwicGFyYW1ldGVyc1wiIGluIF9kYXRhID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhKSlcclxuICAgICAgICBpZiAodHlwZW9mIHN1YkRhdGEgPT0gXCJvYmplY3RcIilcclxuICAgICAgICAgIHRoaXMucmVuYW1lVmFyaWFibGUoX25hbWUsIF9uZXcsIHN1YkRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgdHlwZSBSZXNvdXJjZUVudHJ5ID0gUmVzb3VyY2VGaWxlIHwgUmVzb3VyY2VGb2xkZXI7XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VGaWxlIGV4dGVuZHMgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2Uge1xyXG4gICAgcmVzb3VyY2VQYXJlbnQ/OiBSZXNvdXJjZUZvbGRlcjsgLy8gZGFuZ2Vyb3VzIGFzIGEgU2VyaWFsaXphYmxlUmVzb3VyY2UgbXVzdCBub3QgaGF2ZSBhIHByb3BlcnR5IHdpdGggdGhpcyBuYW1lIGl0c2VsZlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIFJlc291cmNlRm9sZGVyIGltcGxlbWVudHMgxpIuU2VyaWFsaXphYmxlIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVzb3VyY2VQYXJlbnQ6IFJlc291cmNlRm9sZGVyO1xyXG4gICAgcHVibGljIGVudHJpZXM6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZyA9IFwiRm9sZGVyXCI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcgPSBcIk5ldyBGb2xkZXJcIikge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9yIGFueSBvZiBpdHMgZGVzY2VuZGFudHMgY29udGFpbiB0aGUgZ2l2ZW4gcmVzb3VyY2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhfcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlKTogYm9vbGVhbiB7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykgXHJcbiAgICAgICAgaWYgKGVudHJ5ID09IF9yZXNvdXJjZSB8fCBlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyICYmIGVudHJ5LmNvbnRhaW5zKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplKCk6IMaSLlNlcmlhbGl6YXRpb24ge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbiA9IHsgbmFtZTogdGhpcy5uYW1lLCBlbnRyaWVzOiBbXSB9O1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uZW50cmllcy5wdXNoKGVudHJ5LnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzZXJpYWxpemF0aW9uLmVudHJpZXMucHVzaCh7IGlkUmVzb3VyY2U6IGVudHJ5LmlkUmVzb3VyY2UgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlcmlhbGl6YXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGU+IHtcclxuICAgICAgdGhpcy5uYW1lID0gX3NlcmlhbGl6YXRpb24ubmFtZTtcclxuICAgICAgZm9yIChsZXQgZW50cnlTZXJpYWxpemF0aW9uIG9mIF9zZXJpYWxpemF0aW9uLmVudHJpZXMgPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW4pIHsgLy8gcmVtb3ZlIFwiPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW5cIiBhZnRlciBhIHdoaWxlXHJcbiAgICAgICAgbGV0IGVudHJ5OiBSZXNvdXJjZUVudHJ5O1xyXG4gICAgICAgIGlmIChcImlkUmVzb3VyY2VcIiBpbiBlbnRyeVNlcmlhbGl6YXRpb24pXHJcbiAgICAgICAgICBlbnRyeSA9IGF3YWl0IMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoZW50cnlTZXJpYWxpemF0aW9uLmlkUmVzb3VyY2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVudHJ5ID0gPFJlc291cmNlRm9sZGVyPmF3YWl0IG5ldyBSZXNvdXJjZUZvbGRlcigpLmRlc2VyaWFsaXplKGVudHJ5U2VyaWFsaXphdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgZW50cnkucmVzb3VyY2VQYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8UmVzb3VyY2VFbnRyeT4ge1xyXG4gICAgICB5aWVsZCB0aGlzO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHlpZWxkKiBlbnRyeTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB5aWVsZCBlbnRyeTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlUmVzb3VyY2UgZXh0ZW5kcyDGknVpLkN1c3RvbVRyZWVDb250cm9sbGVyPFJlc291cmNlRW50cnk+IHtcclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfb2JqZWN0Lm5hbWU7XHJcblxyXG4gICAgICBpZiAoIShfb2JqZWN0IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKSB7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBfb2JqZWN0LnR5cGUpO1xyXG5cclxuICAgICAgICBpZiAoKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9vYmplY3QpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIGlucHV0LnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUuIENoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBSZXNvdXJjZUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfZW50cnkubmFtZSAhPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgaWYgKHJlbmFtZSkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgYXdhaXQgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9lbnRyeSkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgJiYgX2VudHJ5LmVudHJpZXMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyID8gX2VudHJ5LmVudHJpZXMgOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFJlc291cmNlRW50cnlbXSwgX3RhcmdldDogUmVzb3VyY2VFbnRyeSwgX2luZGV4PzogbnVtYmVyKTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgaWYgKCEoX3RhcmdldCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgbW92ZTogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfc291cmNlcykge1xyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXg6IG51bWJlciA9IF90YXJnZXQuZW50cmllcy5pbmRleE9mKHNvdXJjZSk7IC8vIF9pbmRleCBuZWVkcyB0byBiZSBjb3JyZWN0ZWQgaWYgd2UgYXJlIG1vdmluZyB3aXRoaW4gc2FtZSBwYXJlbnRcclxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEgJiYgX2luZGV4ID4gY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgX2luZGV4IC09IDE7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKHNvdXJjZSk7XHJcbiAgICAgICAgc291cmNlLnJlc291cmNlUGFyZW50ID0gX3RhcmdldDtcclxuICAgICAgICBtb3ZlLnB1c2goc291cmNlKTtcclxuXHJcbiAgICAgICAgaWYgKF9pbmRleCA9PSBudWxsKVxyXG4gICAgICAgICAgX3RhcmdldC5lbnRyaWVzLnB1c2goc291cmNlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBfdGFyZ2V0LmVudHJpZXMuc3BsaWNlKF9pbmRleCArIF9zb3VyY2VzLmluZGV4T2Yoc291cmNlKSwgMCwgc291cmNlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogUmVzb3VyY2VFbnRyeVtdKTogUHJvbWlzZTxSZXNvdXJjZUVudHJ5W10+IHtcclxuICAgICAgLy8gVE9ETzogYWRkIGRlbGV0ZSBzZWxlY3Rpb24gaXNudGVhZCBvZiBfZm9jdXNzZWQ/IFdoeSBkb2Vzbid0IHRoZSBUcmVlIGNsYXNzIGhhbmRsZSB0aGlzP1xyXG4gICAgICBsZXQgaVJvb3Q6IG51bWJlciA9IF9mb2N1c3NlZC5pbmRleE9mKHByb2plY3QucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICBpZiAoaVJvb3QgPiAtMSlcclxuICAgICAgICBfZm9jdXNzZWQuc3BsaWNlKGlSb290LCAxKTtcclxuXHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uczogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25TdHJpbmdzOiBNYXA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCB1c2FnZXM6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBleHBlbmRhYmxlIG9mIF9mb2N1c3NlZCkge1xyXG4gICAgICAgIGlmIChleHBlbmRhYmxlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpIHtcclxuICAgICAgICAgIGxldCB1c2FnZTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZXhwZW5kYWJsZS5lbnRyaWVzKVxyXG4gICAgICAgICAgICB1c2FnZS5wdXNoKGVudHJ5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgIHVzYWdlc1tfZm9jdXNzZWQuaW5kZXhPZihleHBlbmRhYmxlKSArIFwiIFwiICsgZXhwZW5kYWJsZS5uYW1lXSA9IHVzYWdlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChsZXQgcmVzb3VyY2Ugb2Ygc2VyaWFsaXphdGlvblN0cmluZ3Mua2V5cygpKVxyXG4gICAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBleHBlbmRhYmxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgICAgaWYgKHNlcmlhbGl6YXRpb25TdHJpbmdzLmdldChyZXNvdXJjZSkuaW5kZXhPZihleHBlbmRhYmxlLmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXS5wdXNoKHJlc291cmNlLm5hbWUgKyBcIiBcIiArIHJlc291cmNlLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9mb2N1c3NlZC5sZW5ndGggPiAwICYmIGF3YWl0IG9wZW5EaWFsb2coKSkge1xyXG4gICAgICAgIGxldCBkZWxldGVkOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiBfZm9jdXNzZWQpIHtcclxuICAgICAgICAgIGxldCBrZXk6IHN0cmluZyA9IHNlbGVjdGVkIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgPyB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKHNlbGVjdGVkKSArIFwiIFwiICsgc2VsZWN0ZWQubmFtZSA6IHNlbGVjdGVkLmlkUmVzb3VyY2U7XHJcbiAgICAgICAgICBpZiAodXNhZ2VzW2tleV0ubGVuZ3RoID09IDApICAvLyBkZWxldGUgb25seSB1bnVzZWRcclxuICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHNlbGVjdGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIGRlbGV0ZWQpIHtcclxuICAgICAgICAgIGlmICghKHJlc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIocmVzb3VyY2UpO1xyXG5cclxuICAgICAgICAgIHRoaXMucmVtb3ZlKHJlc291cmNlKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSh0aGlzLnNlbGVjdGlvbi5pbmRleE9mKHJlc291cmNlKSwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgYXN5bmMgZnVuY3Rpb24gb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdCh1c2FnZXMsIHRydWUsIFwiUmV2aWV3IHJlZmVyZW5jZXMsIGRlbGV0ZSBkZXBlbmRlbmQgcmVzb3VyY2VzIGZpcnN0IGlmIGFwcGxpY2FibGVcIiwgXCJUbyBkZWxldGUgdW51c2VkIHJlc291cmNlcywgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogUmVzb3VyY2VFbnRyeVtdKTogUHJvbWlzZTxSZXNvdXJjZUVudHJ5W10+IHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYXRoKF9yZXNvdXJjZTogUmVzb3VyY2VFbnRyeSk6IFJlc291cmNlRW50cnlbXSB7XHJcbiAgICAgIGxldCBwYXRoOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgICAgbGV0IGN1cnJlbnQ6IFJlc291cmNlRW50cnkgPSBfcmVzb3VyY2U7XHJcbiAgICAgIHdoaWxlIChjdXJyZW50KSB7XHJcbiAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJlc291cmNlUGFyZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlKF9yZXNvdXJjZTogUmVzb3VyY2VFbnRyeSk6IHZvaWQge1xyXG4gICAgICBsZXQgcGFyZW50OiBSZXNvdXJjZUZvbGRlciA9IF9yZXNvdXJjZS5yZXNvdXJjZVBhcmVudDtcclxuICAgICAgaWYgKCFwYXJlbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBwYXJlbnQuZW50cmllcy5pbmRleE9mKF9yZXNvdXJjZSk7XHJcbiAgICAgIHBhcmVudC5lbnRyaWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9WaWV3LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyBmb3IgYWxsIFtbUGFuZWxdXXMgYWdncmVnYXRpbmcgW1tWaWV3XV1zXHJcbiAgICogU3ViY2xhc3NlcyBhcmUgcHJlc2V0cyBmb3IgY29tbW9uIHBhbmVscy4gQSB1c2VyIG1pZ2h0IGFkZCBvciBkZWxldGUgW1tWaWV3XV1zIGF0IHJ1bnRpbWVcclxuICAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjRcclxuICAgKi9cclxuXHJcbiAgLy8gVE9ETzogY2xhc3MgbWlnaHQgYmVjb21lIGEgY3VzdG9tY29tcG9uZW50IGZvciBIVE1MISA9IHRoaXMuZG9tXHJcblxyXG4gIC8vIGV4dGVuZHMgdmlldyB2b3Jyw7xiZXJnZWhlbmQgZW50ZmVybnRcclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgUGFuZWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByb3RlY3RlZCBnb2xkZW5MYXlvdXQ6IEdvbGRlbkxheW91dDtcclxuICAgIHByb3RlY3RlZCB2aWV3czogVmlld1tdID0gW107XHJcbiAgICAvL3B1YmxpYyBkb207IC8vIG11c3MgdmllbGxlaWNodCB3ZWdcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfcGFuZWxTdGF0ZTogVmlld1N0YXRlLCBfdmlld0NvbnN0cnVjdG9ycz86IHsgW25hbWU6IHN0cmluZ106IG5ldyAoLi4uYXJnczogxpIuR2VuZXJhbCkgPT4gVmlldyB9LCBfcm9vdEl0ZW1Db25maWc/OiBSb3dPckNvbHVtbkl0ZW1Db25maWcpIHtcclxuICAgICAgX2NvbnRhaW5lci5vbihcImRlc3Ryb3lcIiwgKCkgPT4gdGhpcy5nb2xkZW5MYXlvdXQuZGVzdHJveSgpKTsgLy8gZGVzdHJveSBmcm9tIGluc2lkZSBvdXRcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3BhbmVsU3RhdGUpO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xyXG4gICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJ2aWV3XCIpO1xyXG4gICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJwYW5lbFwiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBMYXlvdXRDb25maWcgPSB7XHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICBwb3BvdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWF4aW1pc2U6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290OiBfcm9vdEl0ZW1Db25maWdcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0ID0gbmV3IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkdvbGRlbkxheW91dCh0aGlzLmRvbSk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBfdmlld0NvbnN0cnVjdG9ycylcclxuICAgICAgICB0aGlzLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudEZhY3RvcnlGdW5jdGlvbihrZXksIChfY29udGFpbmVyLCBfdmlld1N0YXRlOiBWaWV3U3RhdGUpID0+IG5ldyBfdmlld0NvbnN0cnVjdG9yc1trZXldKF9jb250YWluZXIsIHsgLi4uX3BhbmVsU3RhdGUsIC4uLl92aWV3U3RhdGUgfSkpO1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQub24oXCJzdGF0ZUNoYW5nZWRcIiwgKCkgPT4gdGhpcy5nb2xkZW5MYXlvdXQudXBkYXRlUm9vdFNpemUoKSk7XHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0Lm9uKFwiaXRlbUNyZWF0ZWRcIiwgdGhpcy5hZGRWaWV3Q29tcG9uZW50KTtcclxuXHJcbiAgICAgIHRoaXMuZ29sZGVuTGF5b3V0LmxvYWRMYXlvdXQoX3BhbmVsU3RhdGVbXCJsYXlvdXRcIl0gPyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5MYXlvdXRDb25maWcuZnJvbVJlc29sdmVkKF9wYW5lbFN0YXRlW1wibGF5b3V0XCJdKSA6IGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmQgY3VzdG9tIGNvcGllcyBvZiB0aGUgZ2l2ZW4gZXZlbnQgdG8gdGhlIHZpZXdzICovXHJcbiAgICBwdWJsaWMgYnJvYWRjYXN0ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBsZXQgdGFyZ2V0OiBWaWV3ID0gZGV0YWlsLnZpZXc7XHJcbiAgICAgIGRldGFpbC5zZW5kZXIgPSB0aGlzO1xyXG4gICAgICBmb3IgKGxldCB2aWV3IG9mIHRoaXMudmlld3MpXHJcbiAgICAgICAgaWYgKHZpZXcgIT0gdGFyZ2V0KSAvLyBkb24ndCBzZW5kIGJhY2sgdG8gb3JpZ2luYWwgdGFyZ2V0IHZpZXdcclxuICAgICAgICAgIHZpZXcuZGlzcGF0Y2goPEVWRU5UX0VESVRPUj5fZXZlbnQudHlwZSwgeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJsYXlvdXRcIl0gPSB0aGlzLmdvbGRlbkxheW91dC5zYXZlTGF5b3V0KCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFZpZXdDb21wb25lbnQgPSAoX2V2ZW50OiBFdmVudEVtaXR0ZXIuQnViYmxpbmdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBhZGp1c3RtZW5zIGZvciBHb2xkZW5MYXlvdXQgMlxyXG4gICAgICBsZXQgdGFyZ2V0OiBDb21wb25lbnRJdGVtID0gX2V2ZW50LnRhcmdldCBhcyBDb21wb25lbnRJdGVtO1xyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuQ29tcG9uZW50SXRlbSkge1xyXG4gICAgICAgIHRoaXMudmlld3MucHVzaCg8Vmlldz50YXJnZXQuY29tcG9uZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVE9ETzogYWRkXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsQW5pbWF0aW9uIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uc3RydWN0b3JzID0geyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgICAgICAgW1ZJRVcuQU5JTUFUSU9OXTogVmlld0FuaW1hdGlvbixcclxuICAgICAgICBbVklFVy5BTklNQVRJT05fU0hFRVRdOiBWaWV3QW5pbWF0aW9uU2hlZXRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkFOSU1BVElPTixcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkFOSU1BVElPTl9TSEVFVFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJBbmltYXRpb24gfCBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICAvLyBUT0RPOiBpdGVyYXRlIG92ZXIgdmlld3MgYW5kIGNvbGxlY3QgdGhlaXIgc3RhdGVzIGZvciByZWNvbnN0cnVjdGlvblxyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBsZXQgbmFtZTogc3RyaW5nID0gX2V2ZW50LmRldGFpbC5ub2RlPy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb24/Lm5hbWU7XHJcbiAgICAgICAgICBpZiAobmFtZSlcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShcIkFuaW1hdGlvbiB8IFwiICsgbmFtZSk7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgKiBTaG93cyBhIGdyYXBoIGFuZCBvZmZlcnMgbWVhbnMgZm9yIG1hbmlwdWxhdGlvblxyXG4gICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsR3JhcGggZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICAjZ3JhcGg6IMaSLkdyYXBoO1xyXG4gICAgI25vZGU6IMaSLk5vZGU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uc3RydWN0b3JzID0geyAvKiBlc2xpbnQtZGlzYWJsZS1saW5lICovXHJcbiAgICAgICAgW1ZJRVcuUkVOREVSXTogVmlld1JlbmRlcixcclxuICAgICAgICBbVklFVy5DT01QT05FTlRTXTogVmlld0NvbXBvbmVudHMsXHJcbiAgICAgICAgW1ZJRVcuSElFUkFSQ0hZXTogVmlld0hpZXJhcmNoeVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUkVOREVSLFxyXG4gICAgICAgICAgdGl0bGU6IFwiUmVuZGVyXCJcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5ISUVSQVJDSFksXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkhpZXJhcmNoeVwiXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQ09NUE9ORU5UUyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiQ29tcG9uZW50c1wiXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJHcmFwaFwiKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkZPQ1VTLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVFJBTlNGT1JNLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy5yZXN0b3JlR3JhcGgoKS50aGVuKF9ncmFwaCA9PiB7XHJcbiAgICAgICAgaWYgKF9ncmFwaCkge1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogX2dyYXBoLCBub2RlOiB0aGlzLnJlc3RvcmVOb2RlKF9ncmFwaCkgfSB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBpZiAoX3N0YXRlW1wiZ3JhcGhcIl0pIHtcclxuICAgICAgICAgIMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoX3N0YXRlW1wiZ3JhcGhcIl0pLnRoZW4oKF9ncmFwaDogxpIuR3JhcGgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZTogxpIuTm9kZSA9IF9zdGF0ZVtcIm5vZGVcIl0gJiYgxpIuTm9kZS5GSU5EKF9ncmFwaCwgX3N0YXRlW1wibm9kZVwiXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IF9ncmFwaCwgbm9kZTogbm9kZSB9IH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBpZiAodGhpcy4jZ3JhcGgpXHJcbiAgICAgICAgc3RhdGVbXCJncmFwaFwiXSA9IHRoaXMuI2dyYXBoLmlkUmVzb3VyY2U7XHJcbiAgICAgIGlmICh0aGlzLiNub2RlKVxyXG4gICAgICAgIHN0YXRlW1wibm9kZVwiXSA9IMaSLk5vZGUuUEFUSF9GUk9NX1RPKHRoaXMuI2dyYXBoLCB0aGlzLiNub2RlKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMudmlld3MuZmluZChfdmlldyA9PiBfdmlldyBpbnN0YW5jZW9mIFZpZXdSZW5kZXIpLmRvbS5jb250YWlucyg8Tm9kZT5fZXZlbnQudGFyZ2V0KSkgLy8gYWNjZXB0IGRyb3Agb25seSBmcm9tIHJlbmRlciB2aWV3XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBzb3VyY2UsIG5vZGU6IHRoaXMucmVzdG9yZU5vZGUoc291cmNlKSB9IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBkZXRhaWw6IEV2ZW50RGV0YWlsID0gX2V2ZW50LmRldGFpbDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTogLy8gVE9ETzogaW5zcGVjdCBpZiB0aGVzZSB0d28gc2hvdWxkIGJlIHN0b3BwZWQgYXN3ZWxsXHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgY29uc3QgZ3JhcGg6IMaSLkdyYXBoID0gZGV0YWlsLmdyYXBoO1xyXG4gICAgICAgICAgaWYgKGdyYXBoICYmIGdyYXBoICE9IHRoaXMuI2dyYXBoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVHcmFwaChncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7Z3JhcGgudHlwZX0gfCAke2dyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgICAgIHRoaXMuI2dyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBub2RlOiDGki5Ob2RlID0gZGV0YWlsLm5vZGU7XHJcbiAgICAgICAgICBpZiAobm9kZSAmJiBub2RlICE9IHRoaXMuI25vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUodGhpcy4jZ3JhcGgsIG5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLiNub2RlID0gbm9kZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC52aWV3ICE9IHRoaXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGlmICh0aGlzLiNncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUdyYXBoKHRoaXMuI2dyYXBoKTtcclxuICAgICAgICAgIGlmICh0aGlzLiNncmFwaCAmJiB0aGlzLiNub2RlKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0aGlzLiNncmFwaCwgdGhpcy4jbm9kZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZU5vZGUoX2dyYXBoOiDGki5HcmFwaCwgX3NlbGVjdGVkOiDGki5Ob2RlKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5pZH1fJHtfZ3JhcGguaWRSZXNvdXJjZX1gLCDGki5Ob2RlLlBBVEhfRlJPTV9UTyhfZ3JhcGgsIF9zZWxlY3RlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZU5vZGUoX2dyYXBoOiDGki5HcmFwaCk6IMaSLk5vZGUge1xyXG4gICAgICBsZXQgc2VsZWN0ZWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5pZH1fJHtfZ3JhcGguaWRSZXNvdXJjZX1gKTtcclxuICAgICAgcmV0dXJuIHNlbGVjdGVkICYmIMaSLk5vZGUuRklORChfZ3JhcGgsIHNlbGVjdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JlR3JhcGgoX2dyYXBoOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIF9ncmFwaC5pZFJlc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlc3RvcmVHcmFwaCgpOiBQcm9taXNlPMaSLkdyYXBoPiB7XHJcbiAgICAgIGxldCBpZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmlkKTtcclxuICAgICAgcmV0dXJuIGlkICYmIDxQcm9taXNlPMaSLkdyYXBoPj7Gki5Qcm9qZWN0LmdldFJlc291cmNlKGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgKiBTaG93cyBhIGhlbHAgYW5kIGRvY3VtZW50YXRpb25cclxuICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIxXHJcbiAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxIZWxwIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkhlbHBcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZG9tKTtcclxuICAgICAgLy8gVE9ETzogaWZyYW1lIHNhbmRib3ggZGlzYWxsb3dzIHVzZSBvZiBzY3JpcHRzLCByZW1vdmUgb3IgcmVwbGFjZSB3aXRoIG9iamVjdCBpZiBuZWNlc3NhcnlcclxuICAgICAgLy8gdGhpcy5kb20uaW5uZXJIVE1MID0gYDxpZnJhbWUgc3JjPVwiSGVscC5odG1sXCIgc2FuZGJveD48L2lmcmFtZT5gO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBgPG9iamVjdCBkYXRhPVwiSGVscC5odG1sXCI+PC9vYmplY3Q+YDtcclxuXHJcbiAgICAgIC8vIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAvLyAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgIC8vICAgaXNDbG9zYWJsZTogdHJ1ZSxcclxuICAgICAgLy8gICBjb250ZW50OiBbXHJcbiAgICAgIC8vICAgICB7XHJcbiAgICAgIC8vICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgIC8vICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUkVOREVSLFxyXG4gICAgICAvLyAgICAgICBjb21wb25lbnRTdGF0ZTogX3N0YXRlLFxyXG4gICAgICAvLyAgICAgICB0aXRsZTogXCJSZW5kZXJcIlxyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIF1cclxuICAgICAgLy8gfTtcclxuXHJcbiAgICAgIC8vIHRoaXMuZ29sZGVuTGF5b3V0LmFkZEl0ZW1BdExvY2F0aW9uKGNvbmZpZywgW3sgdHlwZUlkOiBMYXlvdXRNYW5hZ2VyLkxvY2F0aW9uU2VsZWN0b3IuVHlwZUlkLlJvb3QgfV0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUT0RPOiBhZGRcclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBBUlRJQ0xFX1NZU1RFTSxcclxuICAgICAgICAgIHRpdGxlOiDGki5QYXJ0aWNsZVN5c3RlbS5uYW1lXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgeyBbVklFVy5QQVJUSUNMRV9TWVNURU1dOiBWaWV3UGFydGljbGVTeXN0ZW0gfSwgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5zZXRUaXRsZSjGki5QYXJ0aWNsZVN5c3RlbS5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGl0ZXJhdGUgb3ZlciB2aWV3cyBhbmQgY29sbGVjdCB0aGVpciBzdGF0ZXMgZm9yIHJlY29uc3RydWN0aW9uXHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXkgdGhlIHByb2plY3Qgc3RydWN0dXJlIGFuZCBvZmZlciBmdW5jdGlvbnMgZm9yIGNyZWF0aW9uLCBkZWxldGlvbiBhbmQgYWRqdXN0bWVudCBvZiByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9ycyBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMC0gMjAyM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbFByb2plY3QgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5JTlRFUk5BTF9UQUJMRV06IFZpZXdJbnRlcm5hbFRhYmxlLFxyXG4gICAgICAgIFtWSUVXLklOVEVSTkFMX0ZPTERFUl06IFZpZXdJbnRlcm5hbEZvbGRlcixcclxuICAgICAgICBbVklFVy5FWFRFUk5BTF06IFZpZXdFeHRlcm5hbCxcclxuICAgICAgICBbVklFVy5QUk9QRVJUSUVTXTogVmlld1Byb3BlcnRpZXMsXHJcbiAgICAgICAgW1ZJRVcuUFJFVklFV106IFZpZXdQcmV2aWV3LFxyXG4gICAgICAgIFtWSUVXLlNDUklQVF06IFZpZXdTY3JpcHRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbmZpZzogUm93T3JDb2x1bW5JdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29sdW1uXCIsXHJcbiAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBST1BFUlRJRVMsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlByb3BlcnRpZXNcIlxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlBSRVZJRVcsXHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlByZXZpZXdcIlxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuRVhURVJOQUwsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiRXh0ZXJuYWxcIlxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLlNDUklQVCxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJTY3JpcHRcIlxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiBcInN0YWNrXCIsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLklOVEVSTkFMX0ZPTERFUixcclxuICAgICAgICAgICAgICB0aXRsZTogXCJJbnRlcm5hbFwiXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSU5URVJOQUxfVEFCTEUsXHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiVGFibGVcIlxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZEV2ZW50KTsgLy8gVE9ETzogZXhwbGFpbiB1c2Ugb2YgZG9jdW1lbnQgLy8gcmVtb3ZlZCBiZWFjYXVzZSB0aGlzIGtlZXBzIHRoZSBwYW5lbHMgYWxpdmUgZXZlbiB3aGVuIGNsb3NlZFxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9qZWN0IHwgXCIgKyBwcm9qZWN0Lm5hbWUpO1xyXG4gICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLk9QRU4sIHt9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuVVBEQVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5DUkVBVEUgJiYgX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLkRFTEVURSAmJiBfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuTU9ESUZZKVxyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShcIlByb2plY3QgfCBcIiArIHByb2plY3QubmFtZSk7IC8vd2h5IGhlcmUgYW5kIGV2ZXJ5dGltZT9cclxuICAgICAgaWYgKF9ldmVudC50eXBlID09IMaSdWkuRVZFTlQuU0VMRUNUKSB7XHJcbiAgICAgICAgdGhpcy5icm9hZGNhc3QobmV3IEVkaXRvckV2ZW50KEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgYW5kIGVkaXQgYSBwYXJ0aWNsZSBzeXN0ZW0gYXR0YWNoZWQgdG8gYSBub2RlLlxyXG4gICAqIEBhdXRob3JzIEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UGFydGljbGVTeXN0ZW0gZXh0ZW5kcyBWaWV3IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfS0VZUzogKGtleW9mIMaSLlBhcnRpY2xlRGF0YS5TeXN0ZW0pW10gPSBbXCJ2YXJpYWJsZXNcIiwgXCJtdHhMb2NhbFwiLCBcIm10eFdvcmxkXCIsIFwiY29sb3JcIl07XHJcblxyXG4gICAgcHJpdmF0ZSBjbXBQYXJ0aWNsZVN5c3RlbTogxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW07XHJcbiAgICBwcml2YXRlIHBhcnRpY2xlU3lzdGVtOiDGki5QYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgZGF0YTogxpIuUGFydGljbGVEYXRhLlN5c3RlbTtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB0b29sYmFySW50ZXJ2YWxJZDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB0aW1lU2NhbGVQbGF5OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLkN1c3RvbVRyZWU8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT47XHJcbiAgICBwcml2YXRlIGNvbnRyb2xsZXI6IENvbnRyb2xsZXJUcmVlUGFydGljbGVTeXN0ZW07XHJcbiAgICBwcml2YXRlIGVycm9yczogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10gPSBbXTtcclxuICAgIHByaXZhdGUgdmFyaWFibGVzOiBIVE1MRGF0YUxpc3RFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuY3JlYXRlVG9vbGJhcigpO1xyXG4gICAgICB0aGlzLnNldFBhcnRpY2xlU3lzdGVtKG51bGwpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBmb2N1czogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSBmYWxzZSk7XHJcbiAgICAgIGxldCBwb3B1cDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YSkge1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbSA9IHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpKTtcclxuICAgICAgICBpdGVtLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGl0ZW0uc3VibWVudS5pdGVtcy5mb3JFYWNoKF9zdWJJdGVtID0+IF9zdWJJdGVtLnZpc2libGUgPSBmYWxzZSk7XHJcbiAgICAgICAgVmlld1BhcnRpY2xlU3lzdGVtLlBST1BFUlRZX0tFWVNcclxuICAgICAgICAgIC5maWx0ZXIoX3ZhbHVlID0+ICFPYmplY3Qua2V5cyhmb2N1cykuaW5jbHVkZXMoX3ZhbHVlKSlcclxuICAgICAgICAgIC5mb3JFYWNoKF9sYWJlbCA9PiBpdGVtLnN1Ym1lbnUuaXRlbXMuZmluZChfaXRlbSA9PiBfaXRlbS5sYWJlbCA9PSBfbGFiZWwpLnZpc2libGUgPSB0cnVlKTtcclxuICAgICAgICBwb3B1cCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEudmFyaWFibGVzIHx8IGZvY3VzID09IHRoaXMuZGF0YS5jb2xvciB8fCDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihmb2N1cykgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oZm9jdXMpKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT05TVEFOVCkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT04pKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPREUpKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBwb3B1cCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEubXR4TG9jYWwgfHwgZm9jdXMgPT0gdGhpcy5kYXRhLm10eFdvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTikpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzICE9IHRoaXMuZGF0YSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUEFSVElDTEVfREFUQSkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBvcHVwKVxyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgbGV0IG9wdGlvbnM6IHN0cmluZ1tdID0gVmlld1BhcnRpY2xlU3lzdGVtLlBST1BFUlRZX0tFWVM7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQWRkIFByb3BlcnR5XCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpLFxyXG4gICAgICAgIHN1Ym1lbnU6IGdlbmVyYXRlU3ViTWVudShvcHRpb25zLCBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1BST1BFUlRZKSwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkFkZCBWYWx1ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT05TVEFOVCksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkFkZCBGdW5jdGlvblwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTiksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkFkZCBDb2RlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPREUpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgVHJhbnNmb3JtYXRpb25cIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTiksXHJcbiAgICAgICAgc3VibWVudTogZ2VuZXJhdGVTdWJNZW51KFvGki5NYXRyaXg0eDQucHJvdG90eXBlLnRyYW5zbGF0ZS5uYW1lLCDGki5NYXRyaXg0eDQucHJvdG90eXBlLnJvdGF0ZS5uYW1lLCDGki5NYXRyaXg0eDQucHJvdG90eXBlLnNjYWxlLm5hbWVdLCBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUEFSVElDTEVfREFUQSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3ViTWVudShfb3B0aW9uczogc3RyaW5nW10sIF9pZDogc3RyaW5nLCBfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgICBsZXQgc3VibWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICBfb3B0aW9ucy5mb3JFYWNoKF9vcHRpb24gPT4ge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogX29wdGlvbiwgaWQ6IF9pZCwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgICAgIHN1Ym1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VibWVudTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgZm9jdXM6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgaWYgKCFmb2N1cylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY2hpbGQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU7XHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKF9pdGVtLmlkKSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1BST1BFUlRZOlxyXG4gICAgICAgICAgY2hpbGQgPSBbXTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT05TVEFOVDpcclxuICAgICAgICAgIGlmICghY2hpbGQpXHJcbiAgICAgICAgICAgIGNoaWxkID0geyB2YWx1ZTogMSB9O1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IGZ1bmN0aW9uOiDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04uQURESVRJT04sIHBhcmFtZXRlcnM6IFtdIH07XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERTpcclxuICAgICAgICAgIGlmICghY2hpbGQpXHJcbiAgICAgICAgICAgIGNoaWxkID0geyBjb2RlOiBcIjFcIiB9O1xyXG5cclxuICAgICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihmb2N1cykgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oZm9jdXMpKVxyXG4gICAgICAgICAgICBmb2N1cy5wYXJhbWV0ZXJzLnB1c2goPMaSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uPmNoaWxkKTtcclxuICAgICAgICAgIGVsc2UgaWYgKGZvY3VzID09IHRoaXMuZGF0YSkge1xyXG4gICAgICAgICAgICBmb2N1c1tfaXRlbS5sYWJlbF0gPSBjaGlsZDtcclxuICAgICAgICAgICAgaWYgKF9pdGVtLmxhYmVsID09IFwidmFyaWFibGVzXCIpXHJcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMgPSBbXTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLnZhcmlhYmxlcykge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVzLnB1c2goPMaSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uPmNoaWxkKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMucHVzaCh0aGlzLmNvbnRyb2xsZXIuZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZvY3VzID09IHRoaXMuZGF0YS5jb2xvcilcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmNvbG9yLnB1c2goPMaSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uPmNoaWxkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hpbGRUb1BhcmVudC5zZXQoY2hpbGQsIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTjpcclxuICAgICAgICAgIGNoaWxkID0geyB0cmFuc2Zvcm1hdGlvbjogPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltcInRyYW5zZm9ybWF0aW9uXCJdPl9pdGVtLmxhYmVsLCBwYXJhbWV0ZXJzOiBbXSB9O1xyXG4gICAgICAgICAgKDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXT5mb2N1cykucHVzaChjaGlsZCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoaWxkVG9QYXJlbnQuc2V0KGNoaWxkLCBmb2N1cyk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoZm9jdXMpLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShjaGlsZCkuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfUEFSVElDTEVfREFUQTpcclxuICAgICAgICAgIGxldCByZW1vdmU6IMaSLlNlcmlhbGl6YXRpb25bXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW2ZvY3VzXSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBldmVudCBoYW5kbGluZ1xyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpIHx8ICEoc291cmNlIGluc3RhbmNlb2YgxpIuTm9kZSkgfHwgIXNvdXJjZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW0pPy5wYXJ0aWNsZVN5c3RlbSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbSA9IDzGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbT4oPMaSLk5vZGU+X3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF0pLmdldENvbXBvbmVudCjGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICAgIHRoaXMudGltZVNjYWxlUGxheSA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlO1xyXG4gICAgICB0aGlzLnNldFRpbWUoMCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0odGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS5wYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy50b29sYmFySW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbmFibGVTYXZlKHRydWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULktFWV9ET1dOOlxyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDAgJiYgX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSA9PSDGki5LRVlCT0FSRF9DT0RFLlMgJiYgX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgICAgIMaSdWkuV2FybmluZy5kaXNwbGF5KHRoaXMuZXJyb3JzLm1hcCgoW19kYXRhLCBfZXJyb3JdKSA9PiBfZXJyb3IpLCBcIlVuYWJsZSB0byBzYXZlXCIsIGBQcm9qZWN0IGNhbid0IGJlIHNhdmVkIHdoaWxlIGhhdmluZyB1bnJlc29sdmVkIGVycm9yc2AsIFwiT0tcIik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoX2V2ZW50LmRldGFpbC5kYXRhKT8ucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNSRUFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5ERUxFVEU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5EUk9QOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5DVVQ6IC8vIFRPRE86IGN1c3RvbXMgdHJlZXMgY3V0IGlzIGFzeW5jLCB0aGlzIHNob3VsZCBoYXBwZW4gYWZ0ZXIgY3V0IGlzIGZpbmlzaGVkXHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoVmFyaWFibGVzKCk7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkVYUEFORDpcclxuICAgICAgICAgIGxldCBpbnZhbGlkOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IHRoaXMudmFsaWRhdGVEYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmVycm9yc1xyXG4gICAgICAgICAgICAuZmlsdGVyKF9lcnJvciA9PiAhaW52YWxpZC5pbmNsdWRlcyhfZXJyb3IpKVxyXG4gICAgICAgICAgICAubWFwKChbX2RhdGFdKSA9PiB0aGlzLnRyZWUuZmluZFZpc2libGUoX2RhdGEpKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChfaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFfaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIF9pdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YXJuaW5nXCIpO1xyXG4gICAgICAgICAgICAgIF9pdGVtLnRpdGxlID0gXCJcIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycyA9IGludmFsaWQ7XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDAgJiYgX2V2ZW50LnR5cGUgIT0gxpJ1aS5FVkVOVC5FWFBBTkQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS5kYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTsgLy8gb3VyIHdvcmtpbmcgY29weSBzaG91bGQgb25seSBiZSB1c2VkIGlmIGl0IGlzIHZhbGlkIFxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMuZm9yRWFjaCgoW19kYXRhLCBfZXJyb3JdKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGl0ZW06IMaSdWkuQ3VzdG9tVHJlZUl0ZW08xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4gPSB0aGlzLnRyZWUuZmluZFZpc2libGUoX2RhdGEpO1xyXG4gICAgICAgICAgICAgIGlmICghaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIik7XHJcbiAgICAgICAgICAgICAgaXRlbS50aXRsZSA9IF9lcnJvcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmVuYWJsZVNhdmUodGhpcy5lcnJvcnMubGVuZ3RoID09IDApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gdG9vbGJhclxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUb29sYmFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRvb2xiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuaWQgPSBcInRvb2xiYXJcIjtcclxuICAgICAgdGhpcy50b29sYmFyLnRpdGxlID0gXCLil48gQ29udHJvbCB0aGUgcGxheWJhY2sgb2YgdGhlIHNlbGVjdGVkIHBhcnRpY2xlIHN5c3RlbVxcbuKXjyBSaWdodCBjbGljayByZW5kZXIgdmlldyB0byBhY3RpdmF0ZSBjb250aW5vdXMgcmVuZGVyaW5nXCI7XHJcblxyXG4gICAgICBsZXQgYnV0dG9uczogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBidXR0b25zLmlkID0gXCJidXR0b25zXCI7XHJcbiAgICAgIFtcImJhY2t3YXJkXCIsIFwicGxheVwiLCBcImZvcndhcmRcIl1cclxuICAgICAgICAubWFwKF9pZCA9PiB7XHJcbiAgICAgICAgICBsZXQgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICBidXR0b24uaWQgPSBfaWQ7XHJcbiAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImJ1dHRvbkljb25cIik7XHJcbiAgICAgICAgICBidXR0b24ub25jbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRpbWVTY2FsZTogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLmlkKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSBcImJhY2t3YXJkXCI6XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgLT0gMC4yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcInBsYXlcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSA9IHRoaXMudGltZVNjYWxlUGxheTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJwYXVzZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gdGltZVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJmb3J3YXJkXCI6XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgKz0gMC4yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRUaW1lU2NhbGUodGltZVNjYWxlKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZvckVhY2goX2J1dHRvbiA9PiBidXR0b25zLmFwcGVuZENoaWxkKF9idXR0b24pKTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKGJ1dHRvbnMpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTY2FsZVN0ZXBwZXI6IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIgPSBuZXcgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcih7IGtleTogXCJ0aW1lU2NhbGVcIiwgbGFiZWw6IFwidGltZVNjYWxlXCIgfSk7XHJcbiAgICAgIHRpbWVTY2FsZVN0ZXBwZXIuaWQgPSBcInRpbWVzY2FsZVwiO1xyXG4gICAgICB0aW1lU2NhbGVTdGVwcGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lU2NhbGUodGltZVNjYWxlU3RlcHBlci5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2NhbGVTdGVwcGVyKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU3RlcHBlcjogxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlciA9IG5ldyDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKHsga2V5OiBcInRpbWVcIiwgbGFiZWw6IFwidGltZVwiLCB2YWx1ZTogXCIwXCIgfSk7XHJcbiAgICAgIHRpbWVTdGVwcGVyLmlkID0gXCJ0aW1lXCI7XHJcbiAgICAgIHRpbWVTdGVwcGVyLnRpdGxlID0gXCJUaGUgdGltZSAoaW4gc2Vjb25kcykgb2YgdGhlIHBhcnRpY2xlIHN5c3RlbVwiO1xyXG4gICAgICB0aW1lU3RlcHBlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZSh0aW1lU3RlcHBlci5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU3RlcHBlcik7XHJcblxyXG4gICAgICBsZXQgdGltZVNsaWRlclN0ZXBzOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRpbWVTbGlkZXJTdGVwcy5pZCA9IFwidGltZXNsaWRlcnN0ZXBzXCI7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2xpZGVyU3RlcHMpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRpbWVTbGlkZXIuaWQgPSBcInRpbWVzbGlkZXJcIjtcclxuICAgICAgdGltZVNsaWRlci50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnZhbHVlID0gXCIwXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIuc3RlcCA9IFwiYW55XCI7XHJcbiAgICAgIHRpbWVTbGlkZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWUocGFyc2VGbG9hdCh0aW1lU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2xpZGVyKTtcclxuXHJcbiAgICAgIHRoaXMudG9vbGJhckludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgICBsZXQgdGltZUluU2Vjb25kczogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lIC8gMTAwMDtcclxuICAgICAgICAgIHRpbWVTY2FsZVN0ZXBwZXIuc2V0TXV0YXRvclZhbHVlKHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlKTtcclxuICAgICAgICAgIHRpbWVTdGVwcGVyLnNldE11dGF0b3JWYWx1ZSh0aW1lSW5TZWNvbmRzKTtcclxuXHJcbiAgICAgICAgICBsZXQgZHVyYXRpb246IG51bWJlciA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0uZHVyYXRpb24gLyAxMDAwO1xyXG4gICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGltZVNsaWRlci5tYXgpICE9IGR1cmF0aW9uICogMS4xKSB7IC8vIHZhbHVlIGhhcyBjaGFuZ2VkXHJcbiAgICAgICAgICAgIHRpbWVTbGlkZXIubWF4ID0gKGR1cmF0aW9uICogMS4xKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB0aW1lU2xpZGVyU3RlcHMuaW5uZXJIVE1MID0gWzAsIDAuMjUsIDAuNSwgMC43NSwgMV1cclxuICAgICAgICAgICAgICAubWFwKF9mYWN0b3IgPT4gZHVyYXRpb24gKiBfZmFjdG9yKVxyXG4gICAgICAgICAgICAgIC5tYXAoX3ZhbHVlID0+IGA8c3BhbiBkYXRhLWxhYmVsPVwiJHtfdmFsdWUudG9GaXhlZCgyKX1cIj48L3NwYW4+YCkuam9pbihcIlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRpbWVTbGlkZXIudmFsdWUgPSB0aW1lSW5TZWNvbmRzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwIC8gMzApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VGltZShfdGltZUluU2Vjb25kczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0VGltZVNjYWxlKDApO1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWUgPSBfdGltZUluU2Vjb25kcyAqIDEwMDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUaW1lU2NhbGUoX3RpbWVTY2FsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIF90aW1lU2NhbGUgPSBwYXJzZUZsb2F0KF90aW1lU2NhbGUudG9GaXhlZCgxNSkpOyAvLyByb3VuZCBzbyBmb3J3YXJkIGFuZCBiYWNrd2FyZCBidXR0b24gZG9uJ3QgbWlzcyB6ZXJvXHJcbiAgICAgIGlmIChfdGltZVNjYWxlICE9IDApXHJcbiAgICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gX3RpbWVTY2FsZTtcclxuICAgICAgdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGUgPSBfdGltZVNjYWxlO1xyXG5cclxuICAgICAgbGV0IHBsYXlCdXR0b246IEVsZW1lbnQgPSB0aGlzLnRvb2xiYXIucXVlcnlTZWxlY3RvcihcIiNwbGF5XCIpIHx8IHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BhdXNlXCIpO1xyXG4gICAgICBwbGF5QnV0dG9uLmlkID0gX3RpbWVTY2FsZSA9PSAwID8gXCJwbGF5XCIgOiBcInBhdXNlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzZXRQYXJ0aWNsZVN5c3RlbShfcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtKTogdm9pZCB7XHJcbiAgICAgIGlmICghX3BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnRyZWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJEcm9wIGEgbm9kZSB3aXRoIGFuIGF0dGFjaGVkIHBhcnRpY2xlIHN5c3RlbSBoZXJlIHRvIGVkaXRcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBfcGFydGljbGVTeXN0ZW07XHJcbiAgICAgIHRoaXMuZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX3BhcnRpY2xlU3lzdGVtLmRhdGEpKTsgLy8gd2Ugd2lsbCB3b3JrIHdpdGggYSBjb3B5XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUodGhpcy5wYXJ0aWNsZVN5c3RlbS5uYW1lKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy52YXJpYWJsZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGF0YWxpc3RcIik7XHJcbiAgICAgIHRoaXMudmFyaWFibGVzLmlkID0gXCJ2YXJpYWJsZXNcIjtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy52YXJpYWJsZXMpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hWYXJpYWJsZXMoKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50b29sYmFyKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJUcmVlUGFydGljbGVTeXN0ZW0odGhpcy5kYXRhLCB0aGlzKTtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuQ3VzdG9tVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPih0aGlzLmNvbnRyb2xsZXIsIHRoaXMuZGF0YSk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUk9QLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNVVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUEFTVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkVYUEFORCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBg4pePIFJpZ2h0IGNsaWNrIG9uIFwiJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfVwiIHRvIGFkZCBwcm9wZXJ0aWVzLlxcbuKXjyBSaWdodCBjbGljayBvbiBwcm9wZXJ0aWVzIHRvIGFkZCB0cmFuc2Zvcm1hdGlvbnMvZXhwcmVzc2lvbnMuXFxu4pePIFJpZ2h0IGNsaWNrIG9uIHRyYW5zZm9ybWF0aW9ucy9leHByZXNzaW9ucyB0byBhZGQgZXhwcmVzc2lvbnMuXFxu4pePIFVzZSBDb3B5L0N1dC9QYXN0ZSB0byBkdXBsaWNhdGUgZGF0YS5gO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSB0aGlzLmRvbS50aXRsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlRGF0YShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdIHtcclxuICAgICAgbGV0IGludmFsaWQ6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gW107XHJcbiAgICAgIHZhbGlkYXRlUmVjdXJzaXZlKF9kYXRhKTtcclxuICAgICAgcmV0dXJuIGludmFsaWQ7XHJcblxyXG4gICAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlY3Vyc2l2ZShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSwgX3BhdGg6IHN0cmluZ1tdID0gW10pOiB2b2lkIHtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgICBsZXQgbWluUGFyYW1ldGVyczogbnVtYmVyID0gxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OX01JTklNVU1fUEFSQU1FVEVSU1tfZGF0YS5mdW5jdGlvbl07XHJcbiAgICAgICAgICBpZiAoX2RhdGEucGFyYW1ldGVycy5sZW5ndGggPCDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT05fTUlOSU1VTV9QQVJBTUVURVJTW19kYXRhLmZ1bmN0aW9uXSkge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3I6IHN0cmluZyA9IGBcIiR7X3BhdGguam9pbihcIi9cIil9LyR7X2RhdGEuZnVuY3Rpb259XCIgbmVlZHMgYXQgbGVhc3QgJHttaW5QYXJhbWV0ZXJzfSBwYXJhbWV0ZXJzYDtcclxuICAgICAgICAgICAgaW52YWxpZC5wdXNoKFtfZGF0YSwgZXJyb3JdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YSkuZm9yRWFjaCgoW19rZXksIF92YWx1ZV0pID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgX3ZhbHVlID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIHZhbGlkYXRlUmVjdXJzaXZlKF92YWx1ZSwgX3BhdGguY29uY2F0KF9rZXkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW5hYmxlU2F2ZShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgcmVtb3RlLk1lbnUuZ2V0QXBwbGljYXRpb25NZW51KCkuZ2V0TWVudUl0ZW1CeUlkKE1FTlUuUFJPSkVDVF9TQVZFKS5lbmFibGVkID0gX29uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaFZhcmlhYmxlcygpOiB2b2lkIHtcclxuICAgICAgbGV0IG9wdGlvbnM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTKTtcclxuICAgICAgaWYgKHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgb3B0aW9ucy5wdXNoKC4uLnRoaXMuZGF0YS52YXJpYWJsZU5hbWVzKTtcclxuICAgICAgdGhpcy52YXJpYWJsZXMuaW5uZXJIVE1MID0gb3B0aW9ucy5tYXAoX25hbWUgPT4gYDxvcHRpb24gdmFsdWU9XCIke19uYW1lfVwiPmApLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgYW5kIGVkaXQgdGhlIGFuaW1hdGFibGUgcHJvcGVydGllcyBvZiBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBjb21wb25lbnQgYW5pbWF0aW9uLlxyXG4gICAqIEBhdXRob3JzIEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyIHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0FuaW1hdGlvbiBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIGtleVNlbGVjdGVkOiDGki5BbmltYXRpb25LZXk7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIGNtcEFuaW1hdG9yOiDGki5Db21wb25lbnRBbmltYXRvcjtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiDGki5BbmltYXRpb247XHJcbiAgICBwcml2YXRlIHBsYXliYWNrVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHByb3BlcnR5TGlzdDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNvbnRyb2xsZXI6IENvbnRyb2xsZXJBbmltYXRpb247XHJcblxyXG4gICAgcHJpdmF0ZSB0b29sYmFyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgZnJhbWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHRpbWU6IMaSLlRpbWUgPSBuZXcgxpIuVGltZSgpO1xyXG4gICAgcHJpdmF0ZSBpZEludGVydmFsOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5zZXRBbmltYXRpb24obnVsbCk7XHJcbiAgICAgIHRoaXMuY3JlYXRlVG9vbGJhcigpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5JTlBVVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5GT0NVU19JTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpIHx8ICEoc291cmNlIGluc3RhbmNlb2YgxpIuTm9kZSkgfHwgIXNvdXJjZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb24pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IDzGki5Ob2RlPnNvdXJjZSB9IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBjb250ZXh0IG1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm5vZGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICAgIGxhYmVsOiBcIkFkZCBQcm9wZXJ0eVwiLFxyXG4gICAgICAgICAgc3VibWVudTogdGhpcy5nZXROb2RlU3VibWVudSh0aGlzLm5vZGUsIHBhdGgsIF9jYWxsYmFjaylcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgUHJvcGVydHlcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUFJPUEVSVFkpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ29udmVydCB0byBBbmltYXRpb25cIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DT05WRVJUX0FOSU1BVElPTiksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkNcIiB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBjaG9pY2U6IENPTlRFWFRNRU5VID0gTnVtYmVyKF9pdGVtLmlkKTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QUk9QRVJUWTpcclxuICAgICAgICAgIC8vIGRlZmluZWQgaW4gZ2V0TXV0YXRvclN1Ym1lbnUsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG9ubHkgd2F5IHRvIGtlZXAgdGhlIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoZSBtZW51IGl0ZW0sIGF0dGFjaGluZyBhbnl0aGluZyB0byBpdGVtXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QUk9QRVJUWTpcclxuICAgICAgICAgIGlmICghKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHJldHVybjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kZWxldGVQcm9wZXJ0eShkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaXN0KCk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ09OVkVSVF9BTklNQVRJT046XHJcbiAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gaW5zdGFuY2VvZiDGki5BbmltYXRpb25TcHJpdGUpIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb24uY29udmVydFRvQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuaW1hdGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE5vZGVTdWJtZW51KF9ub2RlOiDGki5Ob2RlLCBfcGF0aDogc3RyaW5nW10sIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAoY29uc3QgY29tcG9uZW50Q2xhc3Mgb2YgxpIuQ29tcG9uZW50LnN1YmNsYXNzZXMpIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBfbm9kZS5nZXRDb21wb25lbnRzKGNvbXBvbmVudENsYXNzKS5mb3JFYWNoKChfY29tcG9uZW50LCBfaW5kZXgpID0+IHsgLy8gd2UgbmVlZCB0byBnZXQgdGhlIGF0dGFjaGVkIGNvbXBvbm5lbnRzIGFzIGFycmF5IHNvIHdlIGNhbiByZWNvbnN0dWN0IHRoZWlyIHBhdGhcclxuICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICAgIHBhdGgucHVzaChcImNvbXBvbmVudHNcIik7XHJcbiAgICAgICAgICBwYXRoLnB1c2goX2NvbXBvbmVudC50eXBlKTtcclxuICAgICAgICAgIHBhdGgucHVzaChfaW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9jb21wb25lbnQuZ2V0TXV0YXRvckZvckFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgaWYgKG11dGF0b3IgJiYgT2JqZWN0LmtleXMobXV0YXRvcikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgICAgIHsgbGFiZWw6IF9jb21wb25lbnQudHlwZSwgc3VibWVudTogdGhpcy5nZXRNdXRhdG9yU3VibWVudShtdXRhdG9yLCBwYXRoLCBfY2FsbGJhY2spIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgX25vZGUuZ2V0Q2hpbGRyZW4oKSkge1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICBwYXRoLnB1c2goXCJjaGlsZHJlblwiKTtcclxuICAgICAgICBwYXRoLnB1c2goY2hpbGQubmFtZSk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgeyBsYWJlbDogY2hpbGQubmFtZSwgc3VibWVudTogdGhpcy5nZXROb2RlU3VibWVudShjaGlsZCwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRNdXRhdG9yU3VibWVudShfbXV0YXRvcjogxpIuTXV0YXRvciwgX3BhdGg6IHN0cmluZ1tdLCBfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICBwYXRoLnB1c2gocHJvcGVydHkpO1xyXG4gICAgICAgIGlmIChfbXV0YXRvcltwcm9wZXJ0eV0/LmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcclxuICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgICB7IGxhYmVsOiBwcm9wZXJ0eSwgc3VibWVudTogdGhpcy5nZXRNdXRhdG9yU3VibWVudShfbXV0YXRvcltwcm9wZXJ0eV0sIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogcHJvcGVydHksIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZKSwgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hZGRQcm9wZXJ0eShwYXRoLCB0aGlzLm5vZGUsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVG9vbGJhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy50b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy50b29sYmFyLmlkID0gXCJ0b29sYmFyXCI7XHJcblxyXG4gICAgICBbXCJwcmV2aW91c1wiLCBcInBsYXlcIiwgXCJuZXh0XCJdXHJcbiAgICAgICAgLm1hcChfaWQgPT4ge1xyXG4gICAgICAgICAgbGV0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgYnV0dG9uLmlkID0gX2lkO1xyXG4gICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IFwiYnV0dG9uSWNvblwiO1xyXG4gICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSB0aGlzLmhuZFRvb2xiYXJDbGljaztcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZChfYnV0dG9uKSk7XHJcblxyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0Lm1pbiA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuaWQgPSBcImZyYW1laW5wdXRcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoX2V2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5mcmFtZUlucHV0LnZhbHVlKSAqIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGhpcy5mcmFtZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiDGki5BbmltYXRpb25LZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTZWxlY3RlZCA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNtcEFuaW1hdG9yID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbiAhPSB0aGlzLmFuaW1hdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbih0aGlzLmNtcEFuaW1hdG9yPy5hbmltYXRpb24pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubXV0YWJsZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEFuaW1hdG9yKSB7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaGVkIGFuaW1hdGlvbiBpbiBhIENvbXBvbmVudEFuaW1hdG9yXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgPT0gX2V2ZW50LmRldGFpbC5tdXRhYmxlLm5vZGUpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBub2RlOiBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSB9IH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uIHx8IF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uU2hlZXQpXHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLmZyYW1lSW5wdXQudmFsdWUgPSAoTWF0aC50cnVuYyh0aGlzLnBsYXliYWNrVGltZSAvIDEwMDAgKiB0aGlzLmFuaW1hdGlvbi5mcHMpKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5jbXBBbmltYXRvcj8udXBkYXRlQW5pbWF0aW9uKHRoaXMucGxheWJhY2tUaW1lKSB8fCB7fTtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlcj8udXBkYXRlKG5vZGVNdXRhdG9yLCB0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuSU5QVVQ6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkZPQ1VTX0lOOlxyXG4gICAgICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnREaWdpdClcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlU2VxdWVuY2UodGhpcy5wbGF5YmFja1RpbWUsIHRhcmdldCwgX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5JTlBVVCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0QW5pbWF0aW9uKF9hbmltYXRpb246IMaSLkFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICBpZiAoX2FuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgYW5pbWF0aW9uIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eUxpc3QoKTogdm9pZCB7XHJcbiAgICAgIGxldCBub2RlTXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMuYW5pbWF0aW9uLmdldFN0YXRlKHRoaXMucGxheWJhY2tUaW1lLCAwLCB0aGlzLmNtcEFuaW1hdG9yLnF1YW50aXphdGlvbikgfHwge307XHJcblxyXG4gICAgICBsZXQgbmV3UHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudCA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKG5vZGVNdXRhdG9yKTtcclxuICAgICAgaWYgKHRoaXMuZG9tLmNvbnRhaW5zKHRoaXMucHJvcGVydHlMaXN0KSlcclxuICAgICAgICB0aGlzLmRvbS5yZXBsYWNlQ2hpbGQobmV3UHJvcGVydHlMaXN0LCB0aGlzLnByb3BlcnR5TGlzdCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdQcm9wZXJ0eUxpc3QpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdCA9IG5ld1Byb3BlcnR5TGlzdDtcclxuICAgICAgdGhpcy5wcm9wZXJ0eUxpc3QuaWQgPSBcInByb3BlcnR5bGlzdFwiO1xyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJBbmltYXRpb24odGhpcy5hbmltYXRpb24sIHRoaXMucHJvcGVydHlMaXN0LCB0aGlzKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnVwZGF0ZShub2RlTXV0YXRvcik7XHJcbiAgICAgIC8vIMaSdWktRVZFTlQgbXVzdCBub3QgYmUgZGlzcGF0Y2hlZCFcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJ1aS5FVkVOVC5DTElDSykpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMucGxheWJhY2tUaW1lIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb29sYmFyQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKHRhcmdldC5pZCkge1xyXG4gICAgICAgIGNhc2UgXCJwcmV2aW91c1wiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJiYWNrd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXlcIjpcclxuICAgICAgICAgIGlmICh0aGlzLmlkSW50ZXJ2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0YXJnZXQuaWQgPSBcInBhdXNlXCI7XHJcbiAgICAgICAgICAgIHRoaXMudGltZS5zZXQodGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy50aW1lLmdldCgpICUgdGhpcy5hbmltYXRpb24udG90YWxUaW1lO1xyXG4gICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDAwIC8gdGhpcy5hbmltYXRpb24uZnBzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJwYXVzZVwiOlxyXG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm5leHRcIjpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5jb250cm9sbGVyLm5leHRLZXkodGhpcy5wbGF5YmFja1RpbWUsIFwiZm9yd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYXVzZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgIHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BhdXNlXCIpLmlkID0gXCJwbGF5XCI7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gU0hFRVRfTU9ERSB7XHJcbiAgICBET1BFID0gXCJEb3Blc2hlZXRcIixcclxuICAgIENVUlZFUyA9IFwiQ3VydmVzXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgVmlld0FuaW1hdGlvblNlcXVlbmNlIHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvblNlcXVlbmNlO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uS2V5IHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBwYXRoMkQ6IFBhdGgyRDtcclxuICAgIHR5cGU6IFwia2V5XCI7XHJcbiAgfVxyXG5cclxuICBpbnRlcmZhY2UgVmlld0FuaW1hdGlvbkV2ZW50IHsgLy8gbGFiZWxzIGFuZCBldmVudHMgYXJlIGltcGxlbWVudGVkIGFsbW9zdCB0aGUgc2FtZSB3YXlcclxuICAgIGRhdGE6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJldmVudFwiIHwgXCJsYWJlbFwiO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhbmltYXRpb24gc2VxdWVuY2VzLCBhbmltYXRpb24ga2V5cyBhbmQgY3VydmVzIGNvbm5lY3RpbmcgdGhlbS5cclxuICAgKiBAYXV0aG9ycyBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uU2hlZXQgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEtFWV9TSVpFOiBudW1iZXIgPSA2OyAvLyB3aWR0aCBhbmQgaGVpZ2h0IGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUSU1FTElORV9IRUlHSFQ6IG51bWJlciA9IDMwLjU7IC8vIGluIHB4LCBrZWVwIC41IGF0IGVuZCBmb3Igb2RkIGxpbmUgd2lkdGhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVWRU5UU19IRUlHSFQ6IG51bWJlciA9IDMwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU0NBTEVfV0lEVEg6IG51bWJlciA9IDQwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX01JTExJU0VDT05EOiBudW1iZXIgPSAxOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBJWEVMX1BFUl9WQUxVRTogbnVtYmVyID0gMTAwOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IE1JTklNVU1fUElYRUxfUEVSX1NURVA6IG51bWJlciA9IDYwOyAvLyBhdCBhbnkgc2NhbGluZywgZm9yIGJvdGggeCBhbmQgeVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU1RBTkRBUkRfQU5JTUFUSU9OX0xFTkdUSDogbnVtYmVyID0gMTAwMDsgLy8gaW4gbWlsaXNlY29uZHMsIHVzZWQgd2hlbiBhbmltYXRpb24gbGVuZ3RoIGlzIGZhbHN5XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICBwcml2YXRlIGNyYzI6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHByaXZhdGUgZXZlbnRJbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwcml2YXRlIHNjcm9sbEJvZHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgbXR4V29ybGRUb1NjcmVlbjogxpIuTWF0cml4M3gzID0gbmV3IMaSLk1hdHJpeDN4MygpO1xyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRLZXk6IFZpZXdBbmltYXRpb25LZXk7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudDtcclxuICAgIHByaXZhdGUga2V5czogVmlld0FuaW1hdGlvbktleVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10gPSBbXTtcclxuICAgIHByaXZhdGUgZXZlbnRzOiBWaWV3QW5pbWF0aW9uRXZlbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzbG9wZUhvb2tzOiBQYXRoMkRbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZG9jdW1lbnRTdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NQYW5TdGFydDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcbiAgICBwcml2YXRlIHBvc1JpZ2h0Q2xpY2s6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMigpO1xyXG5cclxuICAgICNtb2RlOiBTSEVFVF9NT0RFO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBtYXliZSB1c2UgdGhpcyBzb2x1dGlvbiBmb3IgYWxsIHZpZXdzP1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaW5zZXQgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUubWFyZ2luID0gXCIwLjVlbVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcblxyXG4gICAgICB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEU7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsICgpID0+IHRoaXMuZHJhdyh0cnVlKSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnVTaGVldCk7XHJcblxyXG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1ggPSBcInNjcm9sbFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiaW5zdGFudFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJkb3duID0gdGhpcy5obmRQb2ludGVyRG93bjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVydXAgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybGVhdmUgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub253aGVlbCA9IHRoaXMuaG5kV2hlZWw7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQ29udGFpbmVyKTtcclxuXHJcbiAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS5oZWlnaHQgPSBcIjFweFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbEJvZHkpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudElucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRJbnB1dC5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIpIHtcclxuICAgICAgICAgIGxldCB0aW1lOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5ldmVudHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uc2V0RXZlbnQodGhpcy5ldmVudElucHV0LnZhbHVlLCB0aW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLmV2ZW50SW5wdXQudmFsdWVdID0gdGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEgPSB0aGlzLmV2ZW50SW5wdXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZXZlbnRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgbW9kZSgpOiBTSEVFVF9NT0RFIHtcclxuICAgICAgcmV0dXJuIHRoaXMuI21vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgbW9kZShfbW9kZTogU0hFRVRfTU9ERSkge1xyXG4gICAgICB0aGlzLiNtb2RlID0gX21vZGU7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoX21vZGUpO1xyXG4gICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudVNoZWV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSBmYWxzZSk7XHJcbiAgICAgIGlmICh0aGlzLnBvc1JpZ2h0Q2xpY2sueSA+IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgJiYgdGhpcy5wb3NSaWdodENsaWNrLnkgPCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHsgLy8gY2xpY2sgb24gZXZlbnRzXHJcbiAgICAgICAgbGV0IGRlbGV0ZUV2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPVxyXG4gICAgICAgICAgdGhpcy5ldmVudHMuZmluZChfb2JqZWN0ID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9vYmplY3QucGF0aDJELCB0aGlzLnBvc1JpZ2h0Q2xpY2sueCwgdGhpcy5wb3NSaWdodENsaWNrLnkpKTtcclxuICAgICAgICBpZiAoZGVsZXRlRXZlbnQpIHtcclxuICAgICAgICAgIGlmIChkZWxldGVFdmVudC50eXBlID09IFwiZXZlbnRcIilcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiLCBkZWxldGVFdmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiQWRkIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIiwgdGhpcy5zY3JlZW5Ub1RpbWUodGhpcy5wb3NSaWdodENsaWNrLngpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IHRoaXMua2V5cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmICh0YXJnZXRLZXkpIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIEtleVwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIsIHRhcmdldEtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuRE9QRSkudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkRPUEU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTSEVFVF9NT0RFLkNVUlZFUykudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuXHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5ET1BFLCBsYWJlbDogU0hFRVRfTU9ERS5ET1BFLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5ET1BFIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5DVVJWRVMsIGxhYmVsOiBTSEVFVF9NT0RFLkNVUlZFUywgY2xpY2s6ICgpID0+IHRoaXMubW9kZSA9IFNIRUVUX01PREUuQ1VSVkVTIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgRXZlbnRcIiwgbGFiZWw6IFwiQWRkIEV2ZW50XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBFdmVudFwiLCBsYWJlbDogXCJEZWxldGUgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiQWRkIExhYmVsXCIsIGxhYmVsOiBcIkFkZCBMYWJlbFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJEZWxldGUgTGFiZWxcIiwgbGFiZWw6IFwiRGVsZXRlIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBLZXlcIiwgbGFiZWw6IFwiRGVsZXRlIEtleVwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgY2hvaWNlOiBzdHJpbmcgPSBfaXRlbS5pZDtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG5cclxuICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIpO1xyXG4gICAgICBsZXQgdGFyZ2V0RXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0RXZlbnRcIik7XHJcbiAgICAgIGxldCB0YXJnZXRUaW1lOiBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgXCJBZGQgRXZlbnRcIjpcclxuICAgICAgICAgIGxldCBldmVudE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9RXZlbnQke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudChldmVudE5hbWUsIHRhcmdldFRpbWUpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBldmVudE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJldmVudFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgRXZlbnRcIjpcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50KHRhcmdldEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQWRkIExhYmVsXCI6XHJcbiAgICAgICAgICBsZXQgbGFiZWxOYW1lOiBzdHJpbmcgPSBgJHt0aGlzLmFuaW1hdGlvbi5uYW1lfUxhYmVsJHtPYmplY3Qua2V5cyh0aGlzLmFuaW1hdGlvbi5ldmVudHMpLmxlbmd0aH1gO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsTmFtZV0gPSB0YXJnZXRUaW1lO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBsYWJlbE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJsYWJlbFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgTGFiZWxcIjpcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGFyZ2V0RXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgS2V5XCI6XHJcbiAgICAgICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gdGhpcy5zZXF1ZW5jZXMuZmluZChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpLmluY2x1ZGVzKHRhcmdldEtleS5kYXRhKSkuZGF0YTtcclxuICAgICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIMaSLkRlYnVnLndhcm4oXCJPbmx5IG9uZSBrZXkgbGVmdCBpbiBzZXF1ZW5jZS4gRGVsZXRlIHByb3BlcnR5IGluc3RlYWQuXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlcXVlbmNlLnJlbW92ZUtleSh0YXJnZXRLZXkuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZHJhd2luZ1xyXG4gICAgcHJpdmF0ZSBkcmF3KF9zY3JvbGw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuZG9tLmNsaWVudFdpZHRoO1xyXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRvbS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb247XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1pbihWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgsIHRyYW5zbGF0aW9uLngpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVLZXlzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGltZWxpbmUoKTtcclxuICAgICAgICB0aGlzLmRyYXdFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmRyYXdTY2FsZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnZlcygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0tleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdDdXJzb3IoKTtcclxuICAgICAgICB0aGlzLmRyYXdIaWdobGlnaHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9zY3JvbGwpIHtcclxuICAgICAgICBsZXQgbGVmdFdpZHRoOiBudW1iZXIgPSAtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEg7XHJcbiAgICAgICAgbGV0IHNjcmVlbldpZHRoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy53aWR0aCArIGxlZnRXaWR0aDtcclxuICAgICAgICBsZXQgYW5pbWF0aW9uV2lkdGg6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIICogMjtcclxuICAgICAgICB0aGlzLnNjcm9sbEJvZHkuc3R5bGUud2lkdGggPSBgJHtNYXRoLm1heChhbmltYXRpb25XaWR0aCwgc2NyZWVuV2lkdGgpfXB4YDtcclxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gbGVmdFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUtleXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMua2V5cyA9IHRoaXMuc2VxdWVuY2VzLmZsYXRNYXAoKF9zZXF1ZW5jZSwgX2lTZXF1ZW5jZSkgPT5cclxuICAgICAgICBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkubWFwKChfa2V5KSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld0tleTogVmlld0FuaW1hdGlvbktleSA9IHtcclxuICAgICAgICAgICAgZGF0YTogX2tleSxcclxuICAgICAgICAgICAgY29sb3I6IF9zZXF1ZW5jZS5jb2xvcixcclxuICAgICAgICAgICAgcGF0aDJEOiB0aGlzLmdlbmVyYXRlS2V5KFxyXG4gICAgICAgICAgICAgIHRoaXMud29ybGRUb1NjcmVlblBvaW50KF9rZXkudGltZSwgdGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTID8gX2tleS52YWx1ZSA6IF9pU2VxdWVuY2UgKiBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgKiA0KSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsXHJcbiAgICAgICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIHR5cGU6IFwia2V5XCJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gdmlld0tleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEtleSlcclxuICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEtleS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5KF9wb3NpdGlvbjogxpIuVmVjdG9yMiwgX3c6IG51bWJlciwgX2g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIHBhdGgubW92ZVRvKF9wb3NpdGlvbi54IC0gX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55ICsgX2gpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCArIF93LCBfcG9zaXRpb24ueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54LCBfcG9zaXRpb24ueSAtIF9oKTtcclxuICAgICAgcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3VGltZWxpbmUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgbGV0IGFuaW1hdGlvblN0YXJ0OiBudW1iZXIgPSBNYXRoLm1pbiguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgbGV0IGFuaW1hdGlvbkVuZDogbnVtYmVyID0gTWF0aC5tYXgoLi4udGhpcy5rZXlzLm1hcChfa2V5ID0+IF9rZXkuZGF0YS50aW1lKSkgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLng7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAxMDAsIDI1NSwgMC4yKVwiO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoYW5pbWF0aW9uU3RhcnQsIDAsIGFuaW1hdGlvbkVuZCAtIGFuaW1hdGlvblN0YXJ0LCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVUbyh0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IGZwczogbnVtYmVyID0gdGhpcy5hbmltYXRpb24uZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJGcmFtZTogbnVtYmVyID0gKDEwMDAgKiBWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX01JTExJU0VDT05EKSAvIGZwcztcclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJGcmFtZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLng7XHJcbiAgICAgIGxldCBmcmFtZXNQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgLy8gVE9ETzogZmluZCBhIHdheSB0byBkbyB0aGlzIHdpdGggTygxKTtcclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCAzLCAyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMjtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIGZyYW1lc1BlclN0ZXAgKj0gbXVsdGlwbGllcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBsZXQgaGlnaFN0ZXBzOiBudW1iZXIgPSAwOyAvLyBldmVyeSBudGggc3RlcCB3aWxsIGJlIGhpZ2hlclxyXG4gICAgICBpZiAoZnJhbWVzUGVyU3RlcCAhPSAxKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lc1BlclN0ZXAgPT0gNSkge1xyXG4gICAgICAgICAgc3ViU3RlcHMgPSA0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAyO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZ3JpZExpbmVzOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGxldCB0aW1lU3RlcHM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgICAgdGhpcy5jcmMyLmZvbnQgPSB0aGlzLmRvY3VtZW50U3R5bGUuZm9udDtcclxuXHJcbiAgICAgIGxldCBzdGVwczogbnVtYmVyID0gMSArIHRoaXMuY2FudmFzLndpZHRoIC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeFN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLmxpbmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuICAgICAgICBncmlkTGluZXMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICAgIGdyaWRMaW5lcy5saW5lVG8oeFN0ZXAsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IGlTdGVwICogZnJhbWVzUGVyU3RlcCAvIGZwcztcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFRleHQoXHJcbiAgICAgICAgICBgJHt0aW1lLnRvRml4ZWQoMil9YCxcclxuICAgICAgICAgIHhTdGVwICsgMyxcclxuICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAyMCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHhTdWJTdGVwOiBudW1iZXIgPSB4U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3ViU3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gKGlTdWJTdGVwICUgaGlnaFN0ZXBzID09IDAgPyAxMiA6IDgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGltZVN0ZXBzKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShncmlkTGluZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0V2ZW50cygpOiB2b2lkIHtcclxuICAgICAgbGV0IHRvdGFsSGVpZ2h0OiBudW1iZXIgPSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQ7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyAwLjUsIHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgdG90YWxIZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudHMgPSBbXTtcclxuICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbikgcmV0dXJuO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBsYWJlbCBpbiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsXSk7XHJcbiAgICAgICAgbGV0IHZpZXdMYWJlbDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBsYWJlbCwgcGF0aDJEOiBnZW5lcmF0ZUxhYmVsKHgpLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdMYWJlbCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3TGFiZWwucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBldmVudCBpbiB0aGlzLmFuaW1hdGlvbi5ldmVudHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24uZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgbGV0IHZpZXdFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBldmVudCwgcGF0aDJEOiBnZW5lcmF0ZUV2ZW50KHgpLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdFdmVudCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3RXZlbnQucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gdGhpcy5ldmVudHMuZmluZChfZXZlbnQgPT4gX2V2ZW50LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEV2ZW50Py5kYXRhKTtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRoaXMuc2VsZWN0ZWRFdmVudCA9PSBudWxsO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEV2ZW50LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiID8gdGhpcy5hbmltYXRpb24uZXZlbnRzIDogdGhpcy5hbmltYXRpb24ubGFiZWxzKVt0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyAxMn1weGA7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LmNsYXNzTmFtZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlO1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImxhYmVsXCIpXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVH1weGA7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgdGhpcy5ldmVudElucHV0LnN0eWxlLnRvcCA9IGAke1ZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCAvIDIgLSAyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQudmFsdWUgPSB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnNhdmUoKTtcclxuICAgICAgdGhpcy5jcmMyLnJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmNsaXAoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlRXZlbnQoX3g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQ7XHJcbiAgICAgICAgcGF0aC5tb3ZlVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMTYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVMYWJlbChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDIwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxNCk7XHJcbiAgICAgICAgLy8gcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIC8vIHBhdGguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdTY2FsZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUykgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNlbnRlcjogbnVtYmVyID0gdGhpcy5yb3VuZCh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgIGxldCBwaXhlbFBlclN0ZXA6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy55O1xyXG4gICAgICBsZXQgdmFsdWVQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMDtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIHZhbHVlUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdWJTdGVwczogbnVtYmVyID0gMDtcclxuICAgICAgc3dpdGNoIChpTXVsdGlwbGllcnMpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDE7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMuaGVpZ2h0IC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcigtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeVN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN0ZXApO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gLWlTdGVwICogdmFsdWVQZXJTdGVwO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIHZhbHVlUGVyU3RlcCA+PSAxID8gdmFsdWUudG9GaXhlZCgwKSA6IHZhbHVlLnRvRml4ZWQoMSksXHJcbiAgICAgICAgICAzMyxcclxuICAgICAgICAgIHlTdGVwKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHlTdWJTdGVwOiBudW1iZXIgPSB5U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubGluZVRvKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCAtIDUsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogYWRkIGNvcnJlY3QgZHJhd2luZyBmb3IgY29uc3RhbnQvc3RlcCBpbnRlcnBvbGF0ZWQga2V5c1xyXG4gICAgcHJpdmF0ZSBkcmF3Q3VydmVzKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHNlcXVlbmNlIG9mIHRoaXMuc2VxdWVuY2VzKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gc2VxdWVuY2UuY29sb3I7XHJcbiAgICAgICAgc2VxdWVuY2UuZGF0YS5nZXRLZXlzKClcclxuICAgICAgICAgIC5tYXAoKF9rZXksIF9pbmRleCwgX2tleXMpID0+IFtfa2V5LCBfa2V5c1tfaW5kZXggKyAxXV0pXHJcbiAgICAgICAgICAuZmlsdGVyKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gX2tleVN0YXJ0ICYmIF9rZXlFbmQpXHJcbiAgICAgICAgICAubWFwKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gZ2V0QmV6aWVyUG9pbnRzKF9rZXlTdGFydC5mdW5jdGlvbk91dCwgX2tleVN0YXJ0LCBfa2V5RW5kKSlcclxuICAgICAgICAgIC5mb3JFYWNoKChfYmV6aWVyUG9pbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gX3BvaW50LnRyYW5zZm9ybSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgICAgICAgbGV0IGN1cnZlOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgICAgICAgIGN1cnZlLm1vdmVUbyhfYmV6aWVyUG9pbnRzWzBdLngsIF9iZXppZXJQb2ludHNbMF0ueSk7XHJcbiAgICAgICAgICAgIGN1cnZlLmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1sxXS54LCBfYmV6aWVyUG9pbnRzWzFdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1syXS54LCBfYmV6aWVyUG9pbnRzWzJdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1szXS54LCBfYmV6aWVyUG9pbnRzWzNdLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gxpIuUmVjeWNsZXIuc3RvcmUoX3BvaW50KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0QmV6aWVyUG9pbnRzKF9hbmltYXRpb25GdW5jdGlvbjogxpIuQW5pbWF0aW9uRnVuY3Rpb24sIF9rZXlTdGFydDogxpIuQW5pbWF0aW9uS2V5LCBfa2V5RW5kOiDGki5BbmltYXRpb25LZXkpOiDGki5WZWN0b3IyW10ge1xyXG4gICAgICAgIGxldCBwYXJhbWV0ZXJzOiB7IGE6IG51bWJlcjsgYjogbnVtYmVyOyBjOiBudW1iZXI7IGQ6IG51bWJlciB9ID0gX2FuaW1hdGlvbkZ1bmN0aW9uLmdldFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjb25zdCBwb2xhckZvcm06ICh1OiBudW1iZXIsIHY6IG51bWJlciwgdzogbnVtYmVyKSA9PiBudW1iZXIgPSAoX3UsIF92LCBfdykgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5hICogX3UgKiBfdiAqIF93ICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5iICogKChfdiAqIF93ICsgX3cgKiBfdSArIF91ICogX3YpIC8gMykgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmMgKiAoKF91ICsgX3YgKyBfdykgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuZFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB4U3RhcnQ6IG51bWJlciA9IF9rZXlTdGFydC50aW1lO1xyXG4gICAgICAgIGxldCB4RW5kOiBudW1iZXIgPSBfa2V5RW5kLnRpbWU7XHJcbiAgICAgICAgbGV0IG9mZnNldFRpbWVFbmQ6IG51bWJlciA9IHhFbmQgLSB4U3RhcnQ7XHJcblxyXG4gICAgICAgIGxldCBwb2ludHM6IMaSLlZlY3RvcjJbXSA9IG5ldyBBcnJheSg0KS5maWxsKDApLm1hcCgoKSA9PiDGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMikpO1xyXG4gICAgICAgIHBvaW50c1swXS5zZXQoeFN0YXJ0LCBwb2xhckZvcm0oMCwgMCwgMCkpO1xyXG4gICAgICAgIHBvaW50c1sxXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDEgLyAzLCBwb2xhckZvcm0oMCwgMCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1syXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDIgLyAzLCBwb2xhckZvcm0oMCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1szXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCwgcG9sYXJGb3JtKG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0tleXMoKTogdm9pZCB7XHJcbiAgICAgIC8vIGRyYXcgdW5zZWxlY3RlZCBrZXlzXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSA0O1xyXG4gICAgICB0aGlzLmtleXMuZm9yRWFjaChfa2V5ID0+IHtcclxuICAgICAgICBpZiAoX2tleSA9PSB0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBfa2V5LmNvbG9yO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoX2tleS5wYXRoMkQpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsKF9rZXkucGF0aDJEKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNlbGVjdGVkIGtleVxyXG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLnNlbGVjdGVkS2V5LmNvbG9yO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHRoaXMuc2VsZWN0ZWRLZXkucGF0aDJEKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG5cclxuICAgICAgLy8gZHJhdyBzbG9wZSBob29rc1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmNyYzIuc3Ryb2tlU3R5bGU7XHJcblxyXG4gICAgICBsZXQgW2xlZnQsIHJpZ2h0XSA9IFvGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMiksIMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKV07XHJcbiAgICAgIGxlZnQuc2V0KC01MCwgMCk7XHJcbiAgICAgIHJpZ2h0LnNldCg1MCwgMCk7XHJcblxyXG4gICAgICBsZXQgYW5nbGVTbG9wZVNjcmVlbjogbnVtYmVyID0gTWF0aC5hdGFuKHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZUluICogKHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnkgLyB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54KSkgKiAoMTgwIC8gTWF0aC5QSSk7IC8vIGluIGRlZ3JlZVxyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnRyYW5zbGF0ZSh0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIG10eFRyYW5zZm9ybS5yb3RhdGUoYW5nbGVTbG9wZVNjcmVlbik7XHJcbiAgICAgIGxlZnQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcbiAgICAgIHJpZ2h0LnRyYW5zZm9ybShtdHhUcmFuc2Zvcm0pO1xyXG5cclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8obGVmdC54LCBsZWZ0LnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhyaWdodC54LCByaWdodC55KTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShwYXRoKTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzID0gW3RoaXMuZ2VuZXJhdGVLZXkobGVmdCwgNSwgNSksIHRoaXMuZ2VuZXJhdGVLZXkocmlnaHQsIDUsIDUpXTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzLmZvckVhY2goX2hvb2sgPT4gdGhpcy5jcmMyLmZpbGwoX2hvb2spKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKGxlZnQpO1xyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShyaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3Q3Vyc29yKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNyYzIucmVzdG9yZSgpO1xyXG4gICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICBsZXQgY3Vyc29yOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGN1cnNvci5tb3ZlVG8oeCwgMCk7XHJcbiAgICAgIGN1cnNvci5saW5lVG8oeCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoY3Vyc29yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdIaWdobGlnaHQoKTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHBvc1NjcmVlbjogxpIuVmVjdG9yMiA9IHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjY2XCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChwb3NTY3JlZW4ueCAtIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAvIDIsIDAsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjI2XCI7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgcG9zU2NyZWVuLngsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgPT0gdGhpcylcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubm9kZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2V2ZW50LmRldGFpbC5ub2RlPy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb247XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB0aGlzLnJlc2V0Vmlldyk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uPy5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7IHRoaXMuYW5pbWF0ZSgpOyB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gX2V2ZW50LmRldGFpbC5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJEb3duID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5mb2N1cygpO1xyXG4gICAgICBjb25zdCBmaW5kT2JqZWN0OiAoX29iamVjdDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCkgPT4gYm9vbGVhbiA9IF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmJ1dHRvbnMpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50Lm9mZnNldFkgPiAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmNsaWVudEhlaWdodCkgLy8gY2xpY2tlZCBvbiBzY3JvbGwgYmFyXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsID0gdGhpcy5obmRTY3JvbGw7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQub2Zmc2V0WSA8PSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG5kUG9pbnRlck1vdmVUaW1lbGluZShfZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNsb3BlSG9va3Muc29tZShfaG9vayA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfaG9vaywgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVTbG9wZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICAgICAgdGhpcy5rZXlzLmZpbmQoZmluZE9iamVjdCkgfHxcclxuICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKGZpbmRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBudWxsO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiBudWxsIH0gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBzd2l0Y2ggKHNlbGVjdGVkLnR5cGUpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwibGFiZWxcIjpcclxuICAgICAgICAgICAgICBjYXNlIFwiZXZlbnRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVEcmFnRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwia2V5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdLZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueCA9IF9ldmVudC5vZmZzZXRYO1xyXG4gICAgICAgICAgdGhpcy5wb3NSaWdodENsaWNrLnkgPSBfZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMucG9zUGFuU3RhcnQgPSB0aGlzLnNjcmVlblRvV29ybGRQb2ludChfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVQYW47XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlVGltZWxpbmUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZVNsb3BlID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdmN0RGVsdGE6IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UobmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSkpO1xyXG4gICAgICB2Y3REZWx0YS50cmFuc2Zvcm0oxpIuTWF0cml4M3gzLlNDQUxJTkcoxpIuTWF0cml4M3gzLklOVkVSU0UodGhpcy5tdHhXb3JsZFRvU2NyZWVuKS5zY2FsaW5nKSk7XHJcbiAgICAgIGxldCBzbG9wZTogbnVtYmVyID0gdmN0RGVsdGEueSAvIHZjdERlbHRhLng7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZUluID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZU91dCA9IHNsb3BlO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZVBhbiA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gxpIuVmVjdG9yMi5ESUZGRVJFTkNFKHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSksIHRoaXMucG9zUGFuU3RhcnQpO1xyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuRE9QRSlcclxuICAgICAgICB0cmFuc2xhdGlvbi55ID0gMDtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZSh0cmFuc2xhdGlvbik7XHJcbiAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZURyYWdLZXkgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIGxldCBwaXhlbFBlckZyYW1lOiBudW1iZXIgPSAxMDAwIC8gdGhpcy5hbmltYXRpb24uZnBzO1xyXG4gICAgICB0cmFuc2xhdGlvbi54ID0gTWF0aC5tYXgoMCwgdHJhbnNsYXRpb24ueCk7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLnJvdW5kKHRyYW5zbGF0aW9uLnggLyBwaXhlbFBlckZyYW1lKSAqIHBpeGVsUGVyRnJhbWU7XHJcblxyXG4gICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnNlbGVjdGVkS2V5LmRhdGE7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSB0aGlzLnNlcXVlbmNlcy5maW5kKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkuaW5jbHVkZXMoa2V5KSkuZGF0YTtcclxuICAgICAgc2VxdWVuY2UubW9kaWZ5S2V5KGtleSwgdHJhbnNsYXRpb24ueCwgdGhpcy5tb2RlID09IFNIRUVUX01PREUuRE9QRSB8fCBfZXZlbnQuc2hpZnRLZXkgPyBudWxsIDogdHJhbnNsYXRpb24ueSk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uLmNhbGN1bGF0ZVRvdGFsVGltZSgpO1xyXG4gICAgICB0aGlzLnBsYXliYWNrVGltZSA9IGtleS50aW1lO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZURyYWdFdmVudCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuc2NyZWVuVG9UaW1lKF9ldmVudC5vZmZzZXRYKTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwiZXZlbnRcIilcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudCh0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSwgdGltZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdID0gdGltZTtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsKVxyXG4gICAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFdoZWVsID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKF9ldmVudC5idXR0b25zICE9IDApIHJldHVybjtcclxuICAgICAgbGV0IHpvb21GYWN0b3I6IG51bWJlciA9IF9ldmVudC5kZWx0YVkgPCAwID8gMS4wNSA6IDAuOTU7XHJcbiAgICAgIGxldCBwb3NDdXJzb3JXb3JsZDogxpIuVmVjdG9yMiA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcblxyXG4gICAgICBsZXQgeDogbnVtYmVyID0gX2V2ZW50LnNoaWZ0S2V5ID8gMSA6IHpvb21GYWN0b3I7XHJcbiAgICAgIGxldCB5OiBudW1iZXIgPSBfZXZlbnQuY3RybEtleSB8fCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFID8gMSA6IHpvb21GYWN0b3I7XHJcblxyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHBvc0N1cnNvcldvcmxkKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlKG5ldyDGki5WZWN0b3IyKHgsIHkpKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZSjGki5WZWN0b3IyLlNDQUxFKHBvc0N1cnNvcldvcmxkLCAtMSkpO1xyXG5cclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFNjcm9sbCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb247XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSAtdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCArIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSDtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5wbGF5YmFja1RpbWUgfSB9KTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcmVzZXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4ucmVzZXQoKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWChWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX01JTExJU0VDT05EKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKCh0aGlzLmNhbnZhcy53aWR0aCAtIDIgKiBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgpIC8gKCh0aGlzLmFuaW1hdGlvbj8udG90YWxUaW1lIHx8IFZpZXdBbmltYXRpb25TaGVldC5TVEFOREFSRF9BTklNQVRJT05fTEVOR1RIKSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWChWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgpO1xyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTKSB7XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSgtMSk7IC8vIGZsaXAgeVxyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVkoVmlld0FuaW1hdGlvblNoZWV0LlBJWEVMX1BFUl9WQUxVRSk7IC8vIGFwcGx5IHNjYWxpbmdcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlczogbnVtYmVyW10gPSB0aGlzLnNlcXVlbmNlc1xyXG4gICAgICAgICAgLmZsYXRNYXAoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKSlcclxuICAgICAgICAgIC5tYXAoX2tleSA9PiBfa2V5LnZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgIGxldCBtaW46IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5taW4oX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgbWF4OiBudW1iZXIgPSB2YWx1ZXMucmVkdWNlKChfYSwgX2IpID0+IE1hdGgubWF4KF9hLCBfYikpOyAvLyBpbiB3b3JsZCBzcGFjZVxyXG4gICAgICAgICAgbGV0IHZpZXdIZWlnaHQ6IG51bWJlciA9ICh0aGlzLmNhbnZhcy5oZWlnaHQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpOyAvLyBpbiBweFxyXG4gICAgICAgICAgaWYgKG1pbiAhPSBtYXgpXHJcbiAgICAgICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVkodmlld0hlaWdodCAvICgoKG1heCAtIG1pbikgKiBWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKSAqIDEuMikpO1xyXG4gICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZVkodmlld0hlaWdodCAtIG1pbiAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWShWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgKiAyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NyZWVuVG9Xb3JsZFBvaW50KF94OiBudW1iZXIsIF95OiBudW1iZXIpOiDGki5WZWN0b3IyIHtcclxuICAgICAgbGV0IHZlY3RvcjogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKF94LCBfeSk7XHJcbiAgICAgIHZlY3Rvci50cmFuc2Zvcm0oxpIuTWF0cml4M3gzLklOVkVSU0UodGhpcy5tdHhXb3JsZFRvU2NyZWVuKSk7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB3b3JsZFRvU2NyZWVuUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pO1xyXG4gICAgICB2ZWN0b3IueCA9IHRoaXMucm91bmQodmVjdG9yLngpO1xyXG4gICAgICB2ZWN0b3IueSA9IHRoaXMucm91bmQodmVjdG9yLnkpO1xyXG4gICAgICByZXR1cm4gdmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NyZWVuVG9UaW1lKF94OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICBsZXQgcGxheWJhY2tUaW1lOiBudW1iZXIgPSBNYXRoLm1heCgwLCAoX3ggLSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCkgLyB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54KTtcclxuICAgICAgcmV0dXJuIHBsYXliYWNrVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRpbWVUb1NjcmVlbihfdGltZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm91bmQoX3RpbWUgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcm91bmQoX3ZhbHVlOiBudW1iZXIpOiBudW1iZXIgeyAvLyB0aGlzIGlzIG5lZWRlZCBmb3IgbGluZXMgdG8gYmUgZGlzcGxheWVkIGNyaXNwIG9uIHRoZSBjYW52YXNcclxuICAgICAgaWYgKE1hdGgudHJ1bmModGhpcy5jcmMyLmxpbmVXaWR0aCkgJSAyID09IDApXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoX3ZhbHVlKTsgLy8gZXZlbiBsaW5lIHdpZHRoXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpICsgMC41OyAvLyBvZGQgbGluZSB3aWR0aFxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBlbnVtIE1FTlUge1xyXG4gICAgQ09NUE9ORU5UTUVOVSA9IFwiQWRkIENvbXBvbmVudHNcIlxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogZXhhbWluIHByb2JsZW0gd2l0aCDGki5NYXRlcmlhbCB3aGVuIHVzaW5nIFwidHlwZW9mIMaSLk11dGFibGVcIiBhcyBrZXkgdG8gdGhlIG1hcFxyXG4gIGxldCByZXNvdXJjZVRvQ29tcG9uZW50OiBNYXA8RnVuY3Rpb24sIHR5cGVvZiDGki5Db21wb25lbnQ+ID0gbmV3IE1hcDxGdW5jdGlvbiwgdHlwZW9mIMaSLkNvbXBvbmVudD4oW1xyXG4gICAgW8aSLkF1ZGlvLCDGki5Db21wb25lbnRBdWRpb10sXHJcbiAgICBbxpIuTWF0ZXJpYWwsIMaSLkNvbXBvbmVudE1hdGVyaWFsXSxcclxuICAgIFvGki5NZXNoLCDGki5Db21wb25lbnRNZXNoXSxcclxuICAgIFvGki5BbmltYXRpb24sIMaSLkNvbXBvbmVudEFuaW1hdG9yXSxcclxuICAgIFvGki5QYXJ0aWNsZVN5c3RlbSwgxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW1dXHJcbiAgXSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgYWxsIGNvbXBvbmVudHMgYXR0YWNoZWQgdG8gYSBub2RlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3Q29tcG9uZW50cyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBub2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBleHBhbmRlZDogeyBbdHlwZTogc3RyaW5nXTogYm9vbGVhbiB9ID0geyBDb21wb25lbnRUcmFuc2Zvcm06IHRydWUgfTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWQ6IHN0cmluZyA9IFwiQ29tcG9uZW50VHJhbnNmb3JtXCI7XHJcbiAgICBwcml2YXRlIGRyYWc6IMaSLkNvbXBvbmVudENhbWVyYTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHRoaXMuaG5kVHJhbnNmb3JtKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09MTEFQU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNMSUNLLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5Db21wb25lbnRDYW1lcmFbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRyYWcgPyBbdGhpcy5kcmFnXSA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgQ29tcG9uZW50XCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkFERF9DT01QT05FTlQsIMaSLkNvbXBvbmVudCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgSm9pbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0pPSU5ULCDGki5Kb2ludCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJEZWxldGUgQ29tcG9uZW50XCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkFERF9KT0lOVCwgxpIuSm9pbnQsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIENvbXBvbmVudFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9DT01QT05FTlQpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGxldCBjb21wb25lbnQ6IHR5cGVvZiDGki5Db21wb25lbnQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5wcm90ZWN0R3JhcGhJbnN0YW5jZSgpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKF9pdGVtLmlkKSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX0NPTVBPTkVOVDpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IMaSLkNvbXBvbmVudC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9KT0lOVDpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IMaSLkpvaW50LnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX0NPTVBPTkVOVDpcclxuICAgICAgICAgIGxldCBlbGVtZW50OiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gXCJCT0RZXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudC50YWdOYW1lKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXJEZXRhaWwgPSBSZWZsZWN0LmdldChlbGVtZW50LCBcImNvbnRyb2xsZXJcIik7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gXCJERVRBSUxTXCIgJiYgY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBkZXRhaWw6IHsgbXV0YWJsZTogPMaSLk11dGFibGU+Y29udHJvbGxlci5nZXRNdXRhYmxlKCkgfSB9KTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgfSB3aGlsZSAoZWxlbWVudCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY29tcG9uZW50KSAvLyBleHBlcmltZW50YWwgZml4IGZvciB0aGUgc3BvcmFkaWMgXCJjb21wb25lbnQgaXMgbm90IGEgY29uc3RydWN0b3JcIiBidWdcclxuICAgICAgICBjb21wb25lbnQgPSDGkltfaXRlbS5sYWJlbF07XHJcblxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IGNtcE5ldzogxpIuQ29tcG9uZW50ID0gbmV3IGNvbXBvbmVudCgpO1xyXG4gICAgICBpZiAoKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFJpZ2lkYm9keSB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRWUkRldmljZSB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRXYWxrZXIpICYmICF0aGlzLm5vZGUuY21wVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIFwiQ29tcG9uZW50VHJhbnNmb3JtIG1hbmRhdG9yeVwiLCBgVG8gYXR0YWNoIGEgJHtjbXBOZXcudHlwZX0sIGZpcnN0IGF0dGFjaCBhICR7xpIuQ29tcG9uZW50VHJhbnNmb3JtLm5hbWV9LmAsIFwiT0tcIiwgXCJcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRHcmFwaEZpbHRlciAmJiAhKHRoaXMubm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSkge1xyXG4gICAgICAgIMaSVWkuRGlhbG9nLnByb21wdChudWxsLCB0cnVlLCBcIlJvb3Qgbm9kZSBvbmx5XCIsIGBBdHRhY2ggJHvGki5Db21wb25lbnRHcmFwaEZpbHRlci5uYW1lfSB0byB0aGUgcm9vdCBub2RlIG9mIGEgZ3JhcGhgLCBcIk9LXCIsIFwiXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGb2cgfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW1iaWVudE9jY2x1c2lvbiB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRCbG9vbSkge1xyXG4gICAgICAgIGxldCBjYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50Q2FtZXJhKSA/PyB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFZSRGV2aWNlKTtcclxuICAgICAgICBpZiAoIWNhbWVyYSkge1xyXG4gICAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIFwiUG9zdC1Qcm9jZXNzIGVmZmVjdFwiLCBgVG8gYXR0YWNoIGEgJHtjbXBOZXcudHlwZX0sIGZpcnN0IGF0dGFjaCBhICR7xpIuQ29tcG9uZW50Q2FtZXJhLm5hbWV9IG9yICR7xpIuQ29tcG9uZW50VlJEZXZpY2UubmFtZX0uYCwgXCJPS1wiLCBcIlwiKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgxpIuRGVidWcuaW5mbyhjbXBOZXcudHlwZSwgY21wTmV3KTtcclxuXHJcbiAgICAgIHRoaXMubm9kZS5hZGRDb21wb25lbnQoY21wTmV3KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5ub2RlIH0gfSk7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5ub2RlKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgaWYgKHRoaXMuZG9tICE9IF9ldmVudC50YXJnZXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3U2NyaXB0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2NyaXB0SW5mbykge1xyXG4gICAgICAgICAgaWYgKCFzb3VyY2UuaXNDb21wb25lbnQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmZpbmRDb21wb25lbnRUeXBlKHNvdXJjZSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBsZXQgY21wTmV3OiDGki5Db21wb25lbnQgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudChzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDb21wb25lbnQoY21wTmV3KTtcclxuICAgICAgICB0aGlzLmV4cGFuZGVkW2NtcE5ldy50eXBlXSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm90ZWN0R3JhcGhJbnN0YW5jZSgpOiBib29sZWFuIHtcclxuICAgICAgLy8gaW5oaWJpdCBzdHJ1Y3R1cmFsIGNoYW5nZXMgdG8gYSBHcmFwaEluc3RhbmNlXHJcbiAgICAgIGxldCBjaGVjazogxpIuTm9kZSA9IHRoaXMubm9kZTtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIGlmIChjaGVjayBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpIHtcclxuICAgICAgICAgIMaSVWkuRGlhbG9nLnByb21wdChudWxsLCB0cnVlLCBcIlN0cnVjdHVyYWwgY2hhbmdlIG9uIGluc3RhbmNlXCIsIGBFZGl0IHRoZSBvcmlnaW5hbCBncmFwaCBcIiR7Y2hlY2submFtZX1cIiB0byBtYWtlIGNoYW5nZXMgdG8gaXRzIHN0cnVjdHVyZSwgdGhlbiBzYXZlIGFuZCByZWxvYWQgdGhlIHByb2plY3RgLCBcIk9LXCIsIFwiXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoZWNrID0gY2hlY2suZ2V0UGFyZW50KCk7XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgY250RW1wdHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5ub2RlIHx8ICEodGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuTm9kZSkpIHsgIC8vIFRPRE86IGV4YW1pbmUsIGlmIGFueXRoaW5nIG90aGVyIHRoYW4gbm9kZSBjYW4gYXBwZWFyIGhlcmUuLi5cclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLmRvbS50aXRsZSA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBjb21wb25lbnRzXCI7XHJcbiAgICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgY29tcG9uZW50c1wiO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50cyB8IFwiICsgdGhpcy5ub2RlLm5hbWUpO1xyXG5cclxuICAgICAgbGV0IGNvbXBvbmVudHM6IMaSLkNvbXBvbmVudFtdID0gdGhpcy5ub2RlLmdldEFsbENvbXBvbmVudHMoKTtcclxuICAgICAgaWYgKCFjb21wb25lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgY29tcG9uZW50cykge1xyXG4gICAgICAgIGxldCBkZXRhaWxzOiDGklVpLkRldGFpbHMgPSDGklVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoY29tcG9uZW50KTtcclxuICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IG5ldyBDb250cm9sbGVyRGV0YWlsKGNvbXBvbmVudCwgZGV0YWlscywgdGhpcyk7XHJcbiAgICAgICAgUmVmbGVjdC5zZXQoZGV0YWlscywgXCJjb250cm9sbGVyXCIsIGNvbnRyb2xsZXIpOyAvLyBpbnNlcnQgYSBsaW5rIGJhY2sgdG8gdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICBkZXRhaWxzLmV4cGFuZCh0aGlzLmV4cGFuZGVkW2NvbXBvbmVudC50eXBlXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGRldGFpbHMpO1xyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRDYW1lcmEpIHtcclxuICAgICAgICAgIGRldGFpbHMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGRldGFpbHMuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoX2V2ZW50OiBFdmVudCkgPT4geyB0aGlzLmRyYWcgPSA8xpIuQ29tcG9uZW50Q2FtZXJhPmNvbXBvbmVudDsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRSaWdpZGJvZHkpIHtcclxuICAgICAgICAgIGxldCBwaXZvdDogSFRNTEVsZW1lbnQgPSBjb250cm9sbGVyLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltrZXk9J210eFBpdm90J1wiKTtcclxuICAgICAgICAgIGxldCBvcGFjaXR5OiBzdHJpbmcgPSBwaXZvdC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgICAgICAgc2V0UGl2b3RPcGFjaXR5KG51bGwpO1xyXG4gICAgICAgICAgY29udHJvbGxlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHNldFBpdm90T3BhY2l0eSk7XHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRQaXZvdE9wYWNpdHkoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb246IMaSLkJPRFlfSU5JVCA9IGNvbnRyb2xsZXIuZ2V0TXV0YXRvcih7IGluaXRpYWxpemF0aW9uOiAwIH0pLmluaXRpYWxpemF0aW9uO1xyXG4gICAgICAgICAgICBwaXZvdC5zdHlsZS5vcGFjaXR5ID0gaW5pdGlhbGl6YXRpb24gPT0gxpIuQk9EWV9JTklULlRPX1BJVk9UID8gb3BhY2l0eSA6IFwiMC4zXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGYWNlQ2FtZXJhKSB7XHJcbiAgICAgICAgICBsZXQgdXA6IEhUTUxFbGVtZW50ID0gY29udHJvbGxlci5kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJba2V5PSd1cCdcIik7XHJcbiAgICAgICAgICBsZXQgb3BhY2l0eTogc3RyaW5nID0gdXAuc3R5bGUub3BhY2l0eTtcclxuICAgICAgICAgIHNldFVwT3BhY2l0eShudWxsKTtcclxuICAgICAgICAgIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCBzZXRVcE9wYWNpdHkpO1xyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0VXBPcGFjaXR5KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IHVwTG9jYWw6IGJvb2xlYW4gPSBjb250cm9sbGVyLmdldE11dGF0b3IoeyB1cExvY2FsOiB0cnVlIH0pLnVwTG9jYWw7XHJcbiAgICAgICAgICAgIHVwLnN0eWxlLm9wYWNpdHkgPSAhdXBMb2NhbCA/IG9wYWNpdHkgOiBcIjAuM1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGV0YWlscy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgPT0gdGhpcy5zZWxlY3RlZClcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KGRldGFpbHMsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlIHx8IF9ldmVudC5kZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGxldCBjb21wb25lbnQ6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+X2V2ZW50LmRldGFpbC5tdXRhYmxlO1xyXG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkNMSUNLOlxyXG4gICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5TUEFDRSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiDGklVpLkRldGFpbHMgPSA8xpJVaS5EZXRhaWxzPl9ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT0gXCJTVU1NQVJZXCIpXHJcbiAgICAgICAgICAgIHRhcmdldCA9IDzGklVpLkRldGFpbHM+dGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTERldGFpbHNFbGVtZW50IHx8ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbS5yZXBsYWNlQ2hpbGQodGFyZ2V0LCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgfHwgdGhpcy5nZXRTZWxlY3RlZCgpICE9IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChfZTogdW5rbm93bikgeyAvKiAqLyB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5DT0xMQVBTRTpcclxuICAgICAgICAgIHRoaXMuZXhwYW5kZWRbKDzGklVpLkRldGFpbHM+X2V2ZW50LnRhcmdldCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKV0gPSAoX2V2ZW50LnR5cGUgPT0gxpJVaS5FVkVOVC5FWFBBTkQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gUmVmbGVjdC5nZXQoX2V2ZW50LnRhcmdldCwgXCJjb250cm9sbGVyXCIpO1xyXG4gICAgICAgICAgbGV0IG11dGFibGU6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+Y29udHJvbGxlci5nZXRNdXRhYmxlKCk7XHJcbiAgICAgICAgICBpZiAobXV0YWJsZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFJpZ2lkYm9keSkge1xyXG4gICAgICAgICAgICBtdXRhYmxlLmluaXRpYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiB0aGlzLm5vZGUgfSB9KTsgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyB3YXMgbmVjZXNzYXJ5LCBFVkVOVF9FRElUT1IuVVBEQVRFIGdldHMgYnJvYWRjYXN0ZWQgYnkgcHJvamVjdCBvbiDGki5FVkVOVC5HUkFQSF9NVVRBVEVELCBzbyB0aGlzIHdhcyBjYXVzaW5nIGEgZG91YmxlIGJyb2FkY2FzdCBvZiBFVkVOVF9FRElUT1IuVVBEQVRFIHRvIEFMTCB2aWV3cyBvbiBhbnkgY2hhbmdlIHRvIGFueSBjb21wb25lbnRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpJVaS5FVkVOVC5SRUFSUkFOR0VfQVJSQVk6IC8vIG5vIGxpc3RlbmVyIGZvciB0aGlzIGV2ZW50XHJcbiAgICAgICAgLy8gICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUcmFuc2Zvcm0gPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZ2V0U2VsZWN0ZWQoKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZ2V0U2VsZWN0ZWQoKSwgXCJjb250cm9sbGVyXCIpO1xyXG4gICAgICBsZXQgY29tcG9uZW50OiDGki5Db21wb25lbnQgPSA8xpIuQ29tcG9uZW50PmNvbnRyb2xsZXIuZ2V0TXV0YWJsZSgpO1xyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXg0eDQgPSBSZWZsZWN0LmdldChjb21wb25lbnQsIFwibXR4TG9jYWxcIikgfHwgUmVmbGVjdC5nZXQoY29tcG9uZW50LCBcIm10eFBpdm90XCIpO1xyXG4gICAgICBpZiAoIW10eFRyYW5zZm9ybSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZHRsOiDGki5HZW5lcmFsID0gX2V2ZW50LmRldGFpbC50cmFuc2Zvcm07XHJcbiAgICAgIGxldCBtdHhDYW1lcmE6IMaSLk1hdHJpeDR4NCA9ICg8xpIuQ29tcG9uZW50Q2FtZXJhPmR0bC5jYW1lcmEpLm5vZGUubXR4V29ybGQ7XHJcbiAgICAgIGxldCBkaXN0YW5jZTogbnVtYmVyID0gbXR4Q2FtZXJhLmdldFRyYW5zbGF0aW9uVG8odGhpcy5ub2RlLm10eFdvcmxkKS5tYWduaXR1ZGU7XHJcbiAgICAgIGlmIChkdGwudHJhbnNmb3JtID09IFRSQU5TRk9STS5ST1RBVEUpXHJcbiAgICAgICAgW2R0bC54LCBkdGwueV0gPSBbZHRsLnksIGR0bC54XTtcclxuXHJcbiAgICAgIGxldCB2YWx1ZTogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKCk7XHJcbiAgICAgIHZhbHVlLnggPSAoZHRsLnJlc3RyaWN0aW9uID09IFwieFwiID8gIWR0bC5pbnZlcnRlZCA6IGR0bC5pbnZlcnRlZCkgPyBkdGwueCA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueSA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ5XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/IC1kdGwueSA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueiA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ6XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/XHJcbiAgICAgICAgKCh2YWx1ZS54ID09IHVuZGVmaW5lZCkgPyAtZHRsLnkgOiBkdGwueCkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUubWFwKChfYzogbnVtYmVyKSA9PiBfYyB8fCAwKTtcclxuXHJcbiAgICAgIGlmIChtdHhUcmFuc2Zvcm0gaW5zdGFuY2VvZiDGki5NYXRyaXg0eDQpXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0zKGR0bC50cmFuc2Zvcm0sIHZhbHVlLCBtdHhUcmFuc2Zvcm0sIGRpc3RhbmNlKTtcclxuICAgICAgaWYgKG10eFRyYW5zZm9ybSBpbnN0YW5jZW9mIMaSLk1hdHJpeDN4MylcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybTIoZHRsLnRyYW5zZm9ybSwgdmFsdWUudG9WZWN0b3IyKCksIG10eFRyYW5zZm9ybSwgMSk7XHJcblxyXG4gICAgICBjb21wb25lbnQubXV0YXRlKGNvbXBvbmVudC5nZXRNdXRhdG9yKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTMoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjMsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDR4NCwgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgbGV0IHJvdGF0aW9uOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgIHJvdGF0aW9uLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yU2NhbGluZzogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yU2NhbGluZyk7XHJcbiAgICAgICAgICBsZXQgc2NhbGluZzogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0uc2NhbGluZztcclxuICAgICAgICAgIHNjYWxpbmcuYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTIoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjIsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MywgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiArPSBfdmFsdWUueDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclNjYWxpbmc6IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclNjYWxpbmcpO1xyXG4gICAgICAgICAgbGV0IHNjYWxpbmc6IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnNjYWxpbmc7XHJcbiAgICAgICAgICBzY2FsaW5nLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3QoX2RldGFpbHM6IMaSVWkuRGV0YWlscywgX2ZvY3VzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmRvbS5jaGlsZHJlbilcclxuICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIF9kZXRhaWxzLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZCA9IF9kZXRhaWxzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgaWYgKF9mb2N1cylcclxuICAgICAgICBfZGV0YWlscy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWQoKTogxpJVaS5EZXRhaWxzIHtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5kb20uY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpKVxyXG4gICAgICAgICAgcmV0dXJuIDzGklVpLkRldGFpbHM+Y2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnQoX3Jlc291cmNlOiBPYmplY3QpOiDGki5Db21wb25lbnQge1xyXG4gICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICBpZiAoX3Jlc291cmNlLmlzQ29tcG9uZW50KVxyXG4gICAgICAgICAgcmV0dXJuIG5ldyAoPMaSLkdlbmVyYWw+X3Jlc291cmNlLnNjcmlwdCkoKTtcclxuXHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiB0eXBlb2YgxpIuQ29tcG9uZW50ID0gdGhpcy5maW5kQ29tcG9uZW50VHlwZShfcmVzb3VyY2UpO1xyXG4gICAgICByZXR1cm4gbmV3ICg8xpIuR2VuZXJhbD50eXBlQ29tcG9uZW50KShfcmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmluZENvbXBvbmVudFR5cGUoX3Jlc291cmNlOiBPYmplY3QpOiB0eXBlb2YgxpIuQ29tcG9uZW50IHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgcmVzb3VyY2VUb0NvbXBvbmVudClcclxuICAgICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgZW50cnlbMF0pXHJcbiAgICAgICAgICByZXR1cm4gZW50cnlbMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzdG9yZVNlbGVjdGVkKCk6IHZvaWQge1xyXG4gICAgLy8gICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBoaWVyYXJjaHkgb2YgYSBncmFwaCBhcyB0cmVlLWNvbnRyb2xcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0hpZXJhcmNoeSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBncmFwaDogxpIuR3JhcGg7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPjtcclxuICAgIHByaXZhdGUgc2VsZWN0aW9uUHJldmlvdXM6IMaSLk5vZGVbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gYSBzZWxlY3QgZXZlbnQgd2lsbCBiZSByZWNpdmVkIGZyb20gdGhlIHBhbmVsIGR1cmluZyByZWNvbnN0cnVjdGlvbiBzbyB3ZSBvbmx5IG5lZWQgdG8gcHJlcGFyZSBvdXIgc3RvcmFnZSBoZXJlXHJcbiAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSAmJiBfc3RhdGVbXCJleHBhbmRlZFwiXSAmJiAhdGhpcy5yZXN0b3JlRXhwYW5kZWQoX3N0YXRlW1wiZ3JhcGhcIl0pKVxyXG4gICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZChfc3RhdGVbXCJncmFwaFwiXSwgX3N0YXRlW1wiZXhwYW5kZWRcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IHNlbGVjdGlvbigpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIGlmICghX2dyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JhcGggJiYgdGhpcy50cmVlKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmFwaClcclxuICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG5cclxuICAgICAgdGhpcy5ncmFwaCA9IF9ncmFwaDtcclxuICAgICAgLy8gdGhpcy5zZWxlY3RlZE5vZGUgPSBudWxsO1xyXG5cclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPihuZXcgQ29udHJvbGxlclRyZWVIaWVyYXJjaHkoKSwgdGhpcy5ncmFwaCk7XHJcbiAgICAgIC8vIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgb24gZXhpc3Rpbmcgbm9kZSB0byBjcmVhdGUgY2hpbGQgbm9kZS5cXG7il48gVXNlIENvcHkvUGFzdGUgdG8gZHVwbGljYXRlIG5vZGVzLlwiO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgb3IgZHVwbGljYXRlLlwiO1xyXG5cclxuICAgICAgbGV0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IHRoaXMucmVzdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSk7XHJcbiAgICAgIGlmIChleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZChleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47IC8vIGNvbnRpbnVlIHdpdGggc3RhbmRhcmQgdHJlZSBiZWhhdmlvdXJcclxuXHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRyZWUpXHJcbiAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkuZmlsdGVyKChfc291cmNlKTogX3NvdXJjZSBpcyDGki5HcmFwaCA9PiBfc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjsgLy8gY29udGludWUgd2l0aCBzdGFuZGFyZCB0cmVlIGJlaGF2aW91clxyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaW5zdGFuY2VzOiDGki5HcmFwaEluc3RhbmNlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZ3JhcGggb2YgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcylcclxuICAgICAgICBpZiAoZ3JhcGggaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIGluc3RhbmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QuY3JlYXRlR3JhcGhJbnN0YW5jZShncmFwaCkpO1xyXG5cclxuICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IGluc3RhbmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSVWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIE5vZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIk5cIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGUtIC8gQWN2dGl2YXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUNUSVZBVEVfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkFcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX05PREUpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGZvY3VzOiDGki5Ob2RlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKE51bWJlcihfaXRlbS5pZCkpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9OT0RFOlxyXG4gICAgICAgICAgbGV0IGluc3RhbmNlOiDGki5HcmFwaEluc3RhbmNlID0gaW5HcmFwaEluc3RhbmNlKGZvY3VzLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIGBBIDxpPmdyYXBoIGluc3RhbmNlPC9pPiBnZXRzIHJlY3JlYXRlZCBmcm9tIHRoZSBvcmlnaW5hbCBncmFwaGAsYFRvIGFkZCBub2RlcywgZWRpdCB0aGUgZ3JhcGggXCIke2luc3RhbmNlLm5hbWV9XCIsIHRoZW4gc2F2ZSBhbmQgcmVsb2FkIHRoZSBwcm9qZWN0PGJyPlByZXNzIE9LIHRvIGNvbnRpbnVlYCwgXCJPS1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGNoaWxkOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJOZXcgTm9kZVwiKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbY2hpbGRdLCBmb2N1cyk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuc2VsZWN0SW50ZXJ2YWwoY2hpbGQsIGNoaWxkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUNUSVZBVEVfTk9ERTpcclxuICAgICAgICAgIGZvY3VzLmFjdGl2YXRlKCFmb2N1cy5pc0FjdGl2ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoZm9jdXMpLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX05PREU6XHJcbiAgICAgICAgICAvLyBmb2N1cy5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAvLyB0aGlzLnRyZWUuZGVsZXRlKFtmb2N1c10pO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuZGVsZXRlKFtmb2N1c10pLnRoZW4oX2RlbGV0ZWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoX2RlbGV0ZWQubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb2N1cy5nZXRQYXJlbnQoKS5yZW1vdmVDaGlsZChmb2N1cyk7XHJcbiAgICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgICAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gRXZlbnRIYW5kbGVyc1xyXG4gICAgcHJpdmF0ZSBobmRUcmVlRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgbm9kZTogxpIuTm9kZSA9IF9ldmVudC5kZXRhaWw/LmRhdGE7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkdyYXBoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULlNFTEVDVDpcclxuICAgICAgICAgIC8vb25seSBkaXNwYXRjaCB0aGUgZXZlbnQgdG8gZm9jdXMgdGhlIG5vZGUsIGlmIHRoZSBub2RlIGlzIGluIHRoZSBjdXJyZW50IGFuZCB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIFxyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJldmlvdXMuaW5jbHVkZXMobm9kZSkgJiYgdGhpcy5zZWxlY3Rpb24uaW5jbHVkZXMobm9kZSkpXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiBub2RlLCB2aWV3OiB0aGlzIH0gfSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblByZXZpb3VzID0gdGhpcy5zZWxlY3Rpb24uc2xpY2UoMCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgbm9kZTogbm9kZSwgdmlldzogdGhpcyB9IH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaChfZXZlbnQuZGV0YWlsLmdyYXBoKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLm5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IHBhdGg6IMaSLk5vZGVbXSA9IF9ldmVudC5kZXRhaWwubm9kZS5nZXRQYXRoKCk7XHJcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnNsaWNlKHBhdGguZmluZEluZGV4KChfbm9kZSA9PiBfbm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSkpO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuc2hvdyhwYXRoKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uID0gW19ldmVudC5kZXRhaWwubm9kZV07XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5kaXNwbGF5U2VsZWN0aW9uKHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUHJldmlvdXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGgodGhpcy5ncmFwaCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGlmICh0aGlzLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcsIF9leHBhbmRlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19pZEdyYXBofWAsIEpTT04uc3RyaW5naWZ5KF9leHBhbmRlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGxldCBzdG9yZWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5pZH1fJHtfaWRHcmFwaH1gKTtcclxuICAgICAgcmV0dXJuIHN0b3JlZCAmJiBKU09OLnBhcnNlKHN0b3JlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWU/LmdldEV4cGFuZGVkKCkubWFwKF9pdGVtID0+IMaSLk5vZGUuUEFUSF9GUk9NX1RPKHRoaXMuZ3JhcGgsIF9pdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiDGki5Ob2RlW11bXSA9IF9wYXRoc1xyXG4gICAgICAgIC5tYXAoX3BhdGggPT4gxpIuTm9kZS5GSU5EPMaSLk5vZGU+KHRoaXMuZ3JhcGgsIF9wYXRoKSlcclxuICAgICAgICAuZmlsdGVyKF9ub2RlID0+IF9ub2RlKVxyXG4gICAgICAgIC5tYXAoX25vZGUgPT4gX25vZGUuZ2V0UGF0aCgpKTtcclxuXHJcbiAgICAgIHRoaXMudHJlZT8uZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHJlbmRlcmluZyBvZiBhIGdyYXBoIGluIGEgdmlld3BvcnQgd2l0aCBhbiBpbmRlcGVuZGVudCBjYW1lcmFcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdSZW5kZXIgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgY21yT3JiaXQ6IMaSQWlkLkNhbWVyYU9yYml0O1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGdyYXBoOiDGki5HcmFwaDtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgbm9kZUxpZ2h0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJJbGx1bWluYXRpb25cIik7IC8vIGtlZXBzIGxpZ2h0IGNvbXBvbmVudHMgZm9yIGRhcmsgZ3JhcGhzXHJcbiAgICBwcml2YXRlIHJlZHJhd0lkOiBudW1iZXI7XHJcbiAgICAjcG9pbnRlck1vdmVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlVXNlckludGVyZmFjZSgpO1xyXG5cclxuICAgICAgbGV0IHRpdGxlOiBzdHJpbmcgPSBcIuKXjyBEcm9wIGEgZ3JhcGggZnJvbSBcXFwiSW50ZXJuYWxcXFwiIGhlcmUuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIFVzZSBtb3VzZWJ1dHRvbnMgYW5kIGN0cmwtLCBzaGlmdC0gb3IgYWx0LWtleSB0byBuYXZpZ2F0ZSBlZGl0b3IgY2FtZXJhLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBEcm9wIGNhbWVyYSBjb21wb25lbnQgaGVyZSB0byBzZWUgdGhyb3VnaCB0aGF0IGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gTWFuaXB1bGF0ZSB0cmFuc2Zvcm1hdGlvbnMgaW4gdGhpcyB2aWV3OlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBDbGljayB0byBzZWxlY3Qgbm9kZSwgcmlnaHRjbGljayB0byBzZWxlY3QgdHJhbnNmb3JtYXRpb25zLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBTZWxlY3QgY29tcG9uZW50IHRvIG1hbmlwdWxhdGUgaW4gdmlldyBDb21wb25lbnRzLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBIb2xkIFgsIFkgb3IgWiBhbmQgbW92ZSBtb3VzZSB0byB0cmFuc2Zvcm0uIEFkZCBzaGlmdC1rZXkgdG8gaW52ZXJ0IHJlc3RyaWN0aW9uLlxcblwiO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICB0aGlzLmRvbS50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB0aGlzLiNwb2ludGVyTW92ZWQgPSBmYWxzZSk7IC8vIHJlc2V0IHBvaW50ZXIgbW92ZVxyXG5cclxuICAgICAgaWYgKF9zdGF0ZVtcImdpem1vc0ZpbHRlclwiXSkge1xyXG4gICAgICAgIGxldCBnaXptb3NGaWx0ZXI6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcChfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl0pO1xyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGdpem1vc0ZpbHRlcilcclxuICAgICAgICAgIGlmICh0aGlzLmdpem1vc0ZpbHRlci5oYXMoa2V5KSlcclxuICAgICAgICAgICAgdGhpcy5naXptb3NGaWx0ZXIuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgZ2l6bW9zRmlsdGVyKCk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+IHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld3BvcnQ/Lmdpem1vc0ZpbHRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJUcmFuc2xhdGVcIiwgaWQ6IFRSQU5TRk9STS5UUkFOU0xBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlRcIiA6IFwiVFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJSb3RhdGVcIiwgaWQ6IFRSQU5TRk9STS5ST1RBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlJcIiA6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTY2FsZVwiLCBpZDogVFJBTlNGT1JNLlNDQUxFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJFXCIgOiBcIkVcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJQaHlzaWNzIERlYnVnXCIsIHN1Ym1lbnU6IFtcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5vbmVcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVswXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVyc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzFdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29sbGlkZXJzIGFuZCBKb2ludHMgKERlZmF1bHQpXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMl0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJCb3VuZGluZyBCb3hlc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzNdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29udGFjdHNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs0XSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk9ubHkgUGh5c2ljc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzVdKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIk9ydGhvZ3JhcGhpYyBDYW1lcmFcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIk9cIiA6IFwiT1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUmVuZGVyIENvbnRpbnVvdXNseVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uUk9UQVRFOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oX2l0ZW0uaWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5OT05FXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTExJREVSU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkJPVU5ESU5HX0JPWEVTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTlRBQ1RTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLlBIWVNJQ19PQkpFQ1RTX09OTFldOlxyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREVbX2l0ZW0uaWRdO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSk6XHJcbiAgICAgICAgICB0aGlzLnNldENhbWVyYU9ydGhvZ3JhcGhpYyhfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpOlxyXG4gICAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZ2l6bW9zRmlsdGVyLmhhcyhfaXRlbS5pZCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZ2l6bW9zRmlsdGVyLnNldChfaXRlbS5pZCwgX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLiNwb2ludGVyTW92ZWQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IFtmaWx0ZXIsIGFjdGl2ZV0gb2YgdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChmaWx0ZXIpLmNoZWNrZWQgPSBhY3RpdmU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdDb21wb25lbnRzKSkgeyAvLyBhbGxvdyBkcm9wcGluZyBjYW1lcmFjb21wb25lbnQgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEgKGF0IHRoaXMgdGltZSwgdGhlIG9ubHkgZHJhZ2dhYmxlKVxyXG4gICAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsKSkgLy8gYWxsb3cgZHJvcHBpbmcgYSBncmFwaFxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudENhbWVyYSkge1xyXG4gICAgICAgIC8vIHRoaXMuc2V0Q2FtZXJhT3J0aG9ncmFwaGljKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKHRoaXMubm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgdGhpcy5jYW52YXMgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICBsZXQgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMHB4XCI7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy52aWV3cG9ydCA9IG5ldyDGki5WaWV3cG9ydCgpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAvLyBhZGQgZGVmYXVsdCB2YWx1ZXMgZm9yIHZpZXcgcmVuZGVyIGdpem1vc1xyXG4gICAgICB0aGlzLmdpem1vc0ZpbHRlci5zZXQoR0laTU9TLlRSQU5TRk9STSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlZpZXdOb2RlX1ZpZXdwb3J0XCIsIHRoaXMuZ3JhcGgsIGNtcENhbWVyYSwgdGhpcy5jYW52YXMpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHsgLyogdmlldyBzaG91bGQgbG9hZCBldmVuIGlmIHJlbmRlcmluZyBmYWlscy4uLiAqLyB9O1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfU1RBUlQsIHRoaXMuaG5kUHJlcGFyZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuYWN0aXZlVmlld3BvcnQpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicGlja1wiLCB0aGlzLmhuZFBpY2spO1xyXG5cclxuICAgICAgbGV0IHN1Ym1lbnU6IEVsZWN0cm9uLk1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zW10gPSBbXTtcclxuICAgICAgZm9yIChjb25zdCBbZmlsdGVyXSBvZiB0aGlzLmdpem1vc0ZpbHRlcilcclxuICAgICAgICBzdWJtZW51LnB1c2goeyBsYWJlbDogZmlsdGVyLCBpZDogZmlsdGVyLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSB9KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkdpem1vc1wiLCBzdWJtZW51OiBzdWJtZW51XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEdyYXBoKF9ub2RlOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBpZiAoIV9ub2RlKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBncmFwaCBoZXJlIHRvIGVkaXRcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLmdyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZ3JhcGggPSBfbm9kZTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpO1xyXG4gICAgICB0aGlzLmdyYXBoLmJyb2FkY2FzdEV2ZW50KG5ldyBFdmVudCjGki5FVkVOVC5ESVNDT05ORUNUX0pPSU5UKSk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnNldEJyYW5jaCh0aGlzLmdyYXBoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5ncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDYW1lcmFPcnRob2dyYXBoaWMoX29uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDIsIDEsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDEwLCAyMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5tYXhEaXN0YW5jZSA9IDEwMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgKj0gNTA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDAuMDEsIDEwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgLz0gNTA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSkpLmNoZWNrZWQgPSBfb247XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUHJlcGFyZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBzd2l0Y2hMaWdodDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJSRU5ERVJcIiA6IFwiUmVuZGVyXCJ9IHwgJHt0aGlzLmdyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgaWYgKCFsaWdodHNQcmVzZW50KVxyXG4gICAgICAgICAgxpIuUmVuZGVyLmFkZExpZ2h0cyh0aGlzLm5vZGVMaWdodC5nZXRDb21wb25lbnRzKMaSLkNvbXBvbmVudExpZ2h0KSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmdyYXBoLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfRU5ELCBzd2l0Y2hMaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IDxFdmVudERldGFpbD5fZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ncmFwaCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKGRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IGZhbHNlLCBkZXRhaWw6IHsgbm9kZTogZGV0YWlsLm5vZGUgfHwgdGhpcy5ncmFwaCB9IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IGRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gW3RoaXMubm9kZV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5GT0NVUzpcclxuICAgICAgICAgIHRoaXMuY21yT3JiaXQubXR4TG9jYWwudHJhbnNsYXRpb24gPSBkZXRhaWwubm9kZS5tdHhXb3JsZC50cmFuc2xhdGlvbjtcclxuICAgICAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmICghdGhpcy52aWV3cG9ydC5jYW1lcmEuaXNBY3RpdmUpXHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQaWNrID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBpY2tlZDogxpIuTm9kZSA9IF9ldmVudC5kZXRhaWwubm9kZTtcclxuXHJcbiAgICAgIC8vVE9ETzogd2F0Y2ggb3V0LCB0d28gc2VsZWN0c1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IHBpY2tlZCB9IH0pO1xyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGklVpLkVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogcGlja2VkIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFuaW1hdGUgPSAoX2U6IEV2ZW50KSA9PiB7XHJcbiAgICAvLyAgIHRoaXMudmlld3BvcnQuc2V0R3JhcGgodGhpcy5ncmFwaCk7XHJcbiAgICAvLyAgIGlmICh0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQgPiAwICYmIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoID4gMClcclxuICAgIC8vICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXIgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy4jcG9pbnRlck1vdmVkIHx8PSAoX2V2ZW50Lm1vdmVtZW50WCAhPSAwIHx8IF9ldmVudC5tb3ZlbWVudFkgIT0gMCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XHJcbiAgICAgIGxldCByZXN0cmljdGlvbjogc3RyaW5nO1xyXG4gICAgICBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlhdKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwieFwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWV0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ6XCI7XHJcbiAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5aXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInlcIjtcclxuXHJcbiAgICAgIGlmICghcmVzdHJpY3Rpb24pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgIGxldCBkYXRhOiBPYmplY3QgPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBQYWdlLm1vZGVUcmFuc2Zvcm0sIHJlc3RyaWN0aW9uOiByZXN0cmljdGlvbiwgeDogX2V2ZW50Lm1vdmVtZW50WCwgeTogX2V2ZW50Lm1vdmVtZW50WSwgY2FtZXJhOiB0aGlzLnZpZXdwb3J0LmNhbWVyYSwgaW52ZXJ0ZWQ6IF9ldmVudC5zaGlmdEtleVxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgdHJhbnNmb3JtOiBkYXRhIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYWN0aXZlVmlld3BvcnQgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIF9ldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuZHJhdygpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHtcclxuICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKF9lcnJvcik7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFJlbmRlckNvbnRpbm91c2x5KF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBpZiAoX29uKSB7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWRyYXdJZCk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpKS5jaGVja2VkID0gX29uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1RyYW5zbGF0aW9uID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMubm9kZSB8fCAhdGhpcy5naXptb3NGaWx0ZXIuZ2V0KEdJWk1PUy5UUkFOU0ZPUk0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHNjYWxpbmc6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLk9ORSjGki5WZWN0b3IzLkRJRkZFUkVOQ0UoxpIuR2l6bW9zLmNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5ub2RlLm10eFdvcmxkLnRyYW5zbGF0aW9uKS5tYWduaXR1ZGUgKiAwLjEpO1xyXG4gICAgICBjb25zdCBvcmlnaW46IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTtcclxuICAgICAgY29uc3QgdmN0WDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWCgxKTtcclxuICAgICAgY29uc3QgdmN0WTogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWSgxKTtcclxuICAgICAgY29uc3QgdmN0WjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWigxKTtcclxuICAgICAgbGV0IG10eFdvcmxkOiDGki5NYXRyaXg0eDQgPSB0aGlzLm5vZGUubXR4V29ybGQuY2xvbmU7XHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICBsZXQgY29sb3I6IMaSLkNvbG9yID0gxpIuQ29sb3IuQ1NTKFwicmVkXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFhdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJsaW1lXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFldLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJibHVlXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFpdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZSh2Y3RYLCB2Y3RZLCB2Y3RaLCBvcmlnaW4sIG10eFdvcmxkLCBjb2xvciwgc2NhbGluZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdID0gQXJyYXkuZnJvbSh0aGlzLmdpem1vc0ZpbHRlci5lbnRyaWVzKCkpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBsZXQgdHlwZXNPZlJlc291cmNlczogxpIuR2VuZXJhbFtdID0gW1xyXG4gICAgxpIuTWVzaFxyXG4gIF07XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIGludGVybmFsIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxUYWJsZSBleHRlbmRzIFZpZXdJbnRlcm5hbCB7XHJcbiAgICBwcml2YXRlIHRhYmxlOiDGknVpLlRhYmxlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5URVNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RSZXNvdXJjZXMoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMudGFibGUgPSBuZXcgxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT4obmV3IENvbnRyb2xsZXJUYWJsZVJlc291cmNlKCksIE9iamVjdC52YWx1ZXMoxpIuUHJvamVjdC5yZXNvdXJjZXMpLCBcInR5cGVcIik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwi4pePIFJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgcmVzb3VyY2UuXFxu4pePIFNlbGVjdCBvciBkcmFnIHJlc291cmNlLlwiO1xyXG4gICAgICB0aGlzLnRhYmxlLnRpdGxlID0gXCLil48gU2VsZWN0IHRvIGVkaXQgaW4gXFxcIlByb3BlcnRpZXNcXFwiXFxu4pePICBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCB0ciBvZiB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSkge1xyXG4gICAgICAgIGxldCB0ZHM6IE5vZGVMaXN0T2Y8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gdHIucXVlcnlTZWxlY3RvckFsbChcInRkXCIpO1xyXG4gICAgICAgIGlmICghdGRzLmxlbmd0aClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHRkc1sxXS5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcclxuICAgICAgICB0ZHNbMV0uc2V0QXR0cmlidXRlKFwiaWNvblwiLCAoPEhUTUxJbnB1dEVsZW1lbnQ+dGRzWzFdLmNoaWxkcmVuWzBdKS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRyIGluc3RhbmNlb2YgxpJ1aS5UYWJsZUl0ZW0gJiYgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPnRyLmRhdGEpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIHRyLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIHRyLnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUgY2hlY2sgdGhlIGNvbnNvbGUgZm9yIGRldGFpbHMuXCI7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIMaSLlNoYWRlciwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIEFuaW1hdGlvblwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb24ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb25TcHJpdGUubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfWAsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgUmVzb3VyY2VcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJSXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTeW5jIEluc3RhbmNlc1wiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiU1wiIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIC8vVE9ETzogZGlzcGF0Y2ggQ1JFQVRFIGluc3RlYWQgb2YgTU9ESUZZIVxyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIGxldCBtZXNoTmV3OiDGki5NZXNoID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobWVzaE5ldywgbWVzaE5ldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBtdHJOZXc6IMaSLk1hdGVyaWFsID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobXRyTmV3LCBtdHJOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfR1JBUEg6XHJcbiAgICAgICAgICBsZXQgZ3JhcGg6IMaSLkdyYXBoID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoZ3JhcGgsIGdyYXBoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTjpcclxuICAgICAgICAgIGxldCB0eXBlQW5pbWF0aW9uOiB0eXBlb2YgxpIuQW5pbWF0aW9uID0gxpIuQW5pbWF0aW9uLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBhbmltYXRpb246IMaSLkFuaW1hdGlvbiA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoYW5pbWF0aW9uLCBhbmltYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUOlxyXG4gICAgICAgICAgbGV0IHBhcnRpY2xlU3lzdGVtOiDGki5QYXJ0aWNsZVN5c3RlbSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKHBhcnRpY2xlU3lzdGVtLCBwYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRTpcclxuICAgICAgICAgIGF3YWl0IHRoaXMudGFibGUuY29udHJvbGxlci5kZWxldGUoW3RoaXMudGFibGUuZ2V0Rm9jdXNzZWQoKV0pO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgaWYgKHRoaXMuZG9tICE9IF9ldmVudC50YXJnZXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGlmIChzb3VyY2VzLnNvbWUoX3NvdXJjZSA9PiAhW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcylcclxuICAgICAgICAvLyAgIGlmIChzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLkFVRElPICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuSU1BR0UgJiYgc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5NRVNIKVxyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IMaSLk5vZGVbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChzb3VyY2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdFeHRlcm5hbCkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcclxuICAgICAgICAgIHN3aXRjaCAoc291cmNlLmdldE1pbWVUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBNSU1FLkFVRElPOlxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5JTUFHRTpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBNSU1FLk1FU0g6XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcubG9nKGF3YWl0IG5ldyDGki5NZXNoT0JKKCkubG9hZChzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2VcclxuICAgICAgICAgICAgICBNSU1FLkdMVEY6XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgICBsZXQgbG9hZDogYm9vbGVhbiA9IGF3YWl0IMaSdWkuRGlhbG9nLnByb21wdChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzLCBmYWxzZSwgYFNlbGVjdCB3aGF0IHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgICBpZiAoIWxvYWQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc291cmNlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IGF3YWl0IGxvYWRlci5sb2FkUmVzb3VyY2VzKMaSW3R5cGVdKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIcaSLlByb2plY3QucmVzb3VyY2VzW3Jlc291cmNlLmlkUmVzb3VyY2VdKVxyXG4gICAgICAgICAgICAgICAgICAgIMaSLlByb2plY3QucmVnaXN0ZXIocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSlcclxuICAgICAgICAvLyAvL0B0cy1pZ25vcmVcclxuICAgICAgICBfdmlld1NvdXJjZS5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGRldGFpbDogeyB2aWV3OiB0aGlzIC8qICwgZGF0YTogX3ZpZXdTb3VyY2UuZ3JhcGggKi8gfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleWJvYXJkRXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGxldCBjZWxsOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IHRoaXMudGFibGUucXVlcnlTZWxlY3RvcihcIi5zZWxlY3RlZFwiKTtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmICghaW5wdXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNSRUFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOiAvLyBUT0RPOiBpcyB0aGlzIHJlYWNoYWJsZT8gSXMgaXQgc3RpbGwgbmVlZGVkP1xyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFzeW5jIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblxyXG5cclxuICAgIC8vICAgLy8gxpJ1aS5EaWFsb2cuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAvLyAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAvLyAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcihzZXR0aW5ncywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgICAgdGhpcy5tdXRhdGUobXV0YXRvcik7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgIH0gZWxzZVxyXG4gICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgLy8gfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBpbXBvcnQgxpJBaWQgPSBGdWRnZUFpZDtcclxuXHJcbiAgLyoqXHJcbiAgICogUHJldmlldyBhIHJlc291cmNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQcmV2aWV3IGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoU3RhbmRhcmQ6IMaSLk1lc2ggPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1lc2goKTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlIHwgRGlyZWN0b3J5RW50cnkgfCBSZXNvdXJjZUZvbGRlciB8IEZ1bmN0aW9uO1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNtck9yYml0OiDGkkFpZC5DYW1lcmFPcmJpdDtcclxuICAgIHByaXZhdGUgcHJldmlld05vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG10eEltYWdlOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgIHByaXZhdGUgdGltZW91dERlZmVyOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIGNyZWF0ZSB2aWV3cG9ydCBmb3IgM0QtcmVzb3VyY2VzXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgLy8gY21wQ2FtZXJhLnBpdm90LnRyYW5zbGF0ZShuZXcgxpIuVmVjdG9yMygxLCAyLCAxKSk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC5sb29rQXQoxpIuVmVjdG9yMy5aRVJPKCkpO1xyXG4gICAgICBjbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUpO1xyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IMaSQWlkLkNhbnZhcy5jcmVhdGUodHJ1ZSwgxpJBaWQuSU1BR0VfUkVOREVSSU5HLlBJWEVMQVRFRCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5pbml0aWFsaXplKFwiUHJldmlld1wiLCBudWxsLCBjbXBDYW1lcmEsIGNhbnZhcyk7XHJcbiAgICAgIC8vIMaSLlJlbmRlcldlYkdMLnNldENhbnZhc1NpemUoMSwgMSk7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQgPSDGkkFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlID0gdGhpcy5jcmVhdGVTdGFuZGFyZEdyYXBoKCk7XHJcblxyXG4gICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk6IMaSLk1hdGVyaWFsIHtcclxuICAgICAgbGV0IG10clN0YW5kYXJkOiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbChcIlN0YW5kYXJkTWF0ZXJpYWxcIiwgxpIuU2hhZGVyRmxhdCwgbmV3IMaSLkNvYXRSZW1pc3NpdmUoxpIuQ29sb3IuQ1NTKFwid2hpdGVcIikpKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKG10clN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG10clN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZVN0YW5kYXJkTWVzaCgpOiDGki5NZXNoIHtcclxuICAgICAgbGV0IG1lc2hTdGFuZGFyZDogxpIuTWVzaFNwaGVyZSA9IG5ldyDGki5NZXNoU3BoZXJlKFwiU3BoZXJlXCIsIDIwLCAxMik7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtZXNoU3RhbmRhcmQpO1xyXG4gICAgICByZXR1cm4gbWVzaFN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJJbGx1bWluYXRlIEdyYXBoXCIsIGlkOiBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXSwgY2hlY2tlZDogdHJ1ZSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIC8vIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgLy8gY2FzZSBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXTpcclxuICAgICAgLy8gICB0aGlzLmlsbHVtaW5hdGVHcmFwaCgpO1xyXG4gICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGhuZE1vdXNlID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoXCJkaXYjaW1hZ2VcIik7XHJcbiAgICAgIGlmICghZGl2KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwibW91c2Vtb3ZlXCI6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKF9ldmVudC5tb3ZlbWVudFgpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKF9ldmVudC5tb3ZlbWVudFkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndoZWVsXCI6XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoXHJcbiAgICAgICAgICAgIF9ldmVudC5vZmZzZXRYIC0gdGhpcy5kb20uY2xpZW50V2lkdGgsIF9ldmVudC5vZmZzZXRZIC0gdGhpcy5kb20uY2xpZW50SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICBsZXQgem9vbTogbnVtYmVyID0gTWF0aC5leHAoLV9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG9mZnNldC50b1N0cmluZygpKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVYKHpvb20pO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5zY2FsZVkoem9vbSk7XHJcbiAgICAgICAgICBvZmZzZXQuc2NhbGUoem9vbSAtIDEpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKC1vZmZzZXQueCk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnRyYW5zbGF0ZVkoLW9mZnNldC55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0VHJhbnNmb3JtKF9kaXY6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB0cmFuc2Zvcm06IEZsb2F0MzJBcnJheSA9IHRoaXMubXR4SW1hZ2UuZ2V0KCk7XHJcbiAgICAgIHRyYW5zZm9ybSA9IHRyYW5zZm9ybS5jb3B5V2l0aGluKDUsIDYpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbigyLCAzKTtcclxuICAgICAgX2Rpdi5zdHlsZS50cmFuc2Zvcm0gPSBgbWF0cml4KCR7dHJhbnNmb3JtLnNsaWNlKDAsIDYpLmpvaW4oKX0pYDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBpZiAoIXRoaXMucmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlNlbGVjdCBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCByZXNvdXJjZSB0byBwcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByZXZpZXdcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGlnaHRzUHJlc2VudDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHRoaXMucmVzb3VyY2UudHlwZSB8fCBcIkZ1bmN0aW9uXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTWVzaClcclxuICAgICAgICB0eXBlID0gXCJNZXNoXCI7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgICAgbGV0IHByZXZpZXdPYmplY3Q6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdPYmplY3RcIik7XHJcbiAgICAgIGxldCBwcmV2aWV3OiBIVE1MRWxlbWVudDtcclxuICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIkZ1bmN0aW9uXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVTY3JpcHRQcmV2aWV3KDxGdW5jdGlvbj50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGlmIChwcmV2aWV3KVxyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChwcmV2aWV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJGaWxlXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVGaWxlUHJldmlldyg8RGlyZWN0b3J5RW50cnk+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiTWVzaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goPMaSLk1lc2g+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKFZpZXdQcmV2aWV3Lm10clN0YW5kYXJkKSk7XHJcbiAgICAgICAgICB0aGlzLnNldFZpZXdPYmplY3QocHJldmlld09iamVjdCk7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhKCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1hdGVyaWFsXCI6XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWVzaChWaWV3UHJldmlldy5tZXNoU3RhbmRhcmQpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbCg8xpIuTWF0ZXJpYWw+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJHcmFwaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hcHBlbmRDaGlsZCg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZSg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsaWdodHNQcmVzZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICB0aGlzLmlsbHVtaW5hdGUoIWxpZ2h0c1ByZXNlbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJQUkVWSUVXXCIgOiBcIlByZXZpZXdcIn0gfCAke3RoaXMucmVzb3VyY2UubmFtZX1gKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3MoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kZWZlcigoKSA9PiB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiVGV4dHVyZUltYWdlXCI6XHJcbiAgICAgICAgY2FzZSBcIkFuaW1hdGlvblNwcml0ZVwiOlxyXG4gICAgICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgZGl2LmlkID0gXCJpbWFnZVwiO1xyXG4gICAgICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICAgIGlmICh0eXBlID09IFwiVGV4dHVyZUltYWdlXCIpIHtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+dGhpcy5yZXNvdXJjZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvblNwcml0ZTogxpIuQW5pbWF0aW9uU3ByaXRlID0gPMaSLkFuaW1hdGlvblNwcml0ZT50aGlzLnJlc291cmNlO1xyXG4gICAgICAgICAgICBpbWcgPSAoPMaSLlRleHR1cmVJbWFnZT5hbmltYXRpb25TcHJpdGUudGV4dHVyZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25zOiDGki5WZWN0b3IyW10gPSBhbmltYXRpb25TcHJpdGUuZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gYW5pbWF0aW9uU3ByaXRlLmdldE11dGF0b3IoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcG9zaXRpb24gb2YgcG9zaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3Q6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgIHJlY3QuY2xhc3NOYW1lID0gXCJyZWN0U3ByaXRlXCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS5sZWZ0ID0gcG9zaXRpb24ueCArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS50b3AgPSBwb3NpdGlvbi55ICsgMSArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLndpZHRoID0gbXV0YXRvci5zaXplLnggLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUuaGVpZ2h0ID0gbXV0YXRvci5zaXplLnkgLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXVkaW9cIjpcclxuICAgICAgICAgIGxldCBlbnRyeTogRGlyZWN0b3J5RW50cnkgPSBuZXcgRGlyZWN0b3J5RW50cnkoKDzGki5BdWRpbz50aGlzLnJlc291cmNlKS5wYXRoLnRvU3RyaW5nKCksIFwiXCIsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBdWRpb1ByZXZpZXcoZW50cnkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKGBQcmV2aWV3IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGFuZGFyZEdyYXBoKCk6IMaSLk5vZGUge1xyXG4gICAgICBsZXQgZ3JhcGg6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdTY2VuZVwiKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2goZ3JhcGgpO1xyXG5cclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKTtcclxuICAgICAgZ3JhcGguYWRkQ2hpbGQobm9kZUxpZ2h0KTtcclxuICAgICAgxpJBaWQuYWRkU3RhbmRhcmRMaWdodENvbXBvbmVudHMobm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudmlld3BvcnQuY2FudmFzKTtcclxuXHJcbiAgICAgIGxldCBwcmV2aWV3Tm9kZTogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld05vZGVcIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKHByZXZpZXdOb2RlKTtcclxuICAgICAgcmV0dXJuIHByZXZpZXdOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Vmlld09iamVjdChfbm9kZTogxpIuTm9kZSwgX2dyYXBoSWxsdW1pbmF0aW9uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlLmFkZENoaWxkKF9ub2RlKTtcclxuICAgICAgdGhpcy5pbGx1bWluYXRlKHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbGx1bWluYXRlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgbm9kZUxpZ2h0OiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKT8uZ2V0Q2hpbGRyZW5CeU5hbWUoXCJQcmV2aWV3SWxsdW1pbmF0aW9uXCIpWzBdO1xyXG4gICAgICBub2RlTGlnaHQuYWN0aXZhdGUoX29uKTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUZpbGVQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBtaW1lOiBNSU1FID0gX2VudHJ5LmdldE1pbWVUeXBlKCk7XHJcbiAgICAgIHN3aXRjaCAobWltZSkge1xyXG4gICAgICAgIGNhc2UgTUlNRS5URVhUOiByZXR1cm4gdGhpcy5jcmVhdGVUZXh0UHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5BVURJTzogcmV0dXJuIHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgICAgY2FzZSBNSU1FLklNQUdFOiByZXR1cm4gdGhpcy5jcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRleHRQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gX2VudHJ5LmdldEZpbGVDb250ZW50KCk7XHJcbiAgICAgIHJldHVybiBwcmU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUltYWdlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgaW1nLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBpbWcuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgYmxhY2tcIjtcclxuICAgICAgcmV0dXJuIGltZztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBhdWRpbzogSFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgYXVkaW8uc3JjID0gX2VudHJ5LnBhdGg7XHJcbiAgICAgIGF1ZGlvLnBsYXkoKTtcclxuICAgICAgYXVkaW8uY29udHJvbHMgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gYXVkaW87XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVNjcmlwdFByZXZpZXcoX3NjcmlwdDogRnVuY3Rpb24pOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgbGV0IGNvZGU6IHN0cmluZyA9IF9zY3JpcHQudG9TdHJpbmcoKTtcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIiAgICBcIiwgXCIgXCIpO1xyXG4gICAgICBwcmUudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIC8vIGlmIChbxpIuQXVkaW8sIMaSLlRleHR1cmUsIMaSLkFuaW1hdGlvblNwcml0ZV0uc29tZSgoX3R5cGUpID0+IHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBfdHlwZSkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuQXVkaW8gfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLlRleHR1cmUgfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSlcclxuICAgICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5kZXRhaWwpXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gX2V2ZW50LmRldGFpbC5kYXRhLnNjcmlwdDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlc2V0Q2FtZXJhKCk6IHZvaWQge1xyXG4gICAgICBsZXQgYnJhbmNoOiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUoYnJhbmNoKTtcclxuICAgICAgbGV0IHI6IG51bWJlciA9IGJyYW5jaC5yYWRpdXM7XHJcblxyXG4gICAgICB0aGlzLmNtck9yYml0Lm10eExvY2FsLnRyYW5zbGF0aW9uID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLmNtck9yYml0LnJvdGF0aW9uWCA9IC0zMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblkgPSAzMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5kaXN0YW5jZSA9IHIgKiAzO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRlZmVyKF9mdW5jdGlvbjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMudGltZW91dERlZmVyKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgX2Z1bmN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHByb3BlcnRpZXMgb2YgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJvcGVydGllcyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRlbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByb3BlcnRpZXMgfCBcIiArIHRoaXMucmVzb3VyY2UubmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5NdXRhYmxlKSB7XHJcbiAgICAgICAgICBsZXQgZmllbGRzZXQ6IMaSdWkuRGV0YWlscyA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZSh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGxldCB1aU11dGFibGU6IENvbnRyb2xsZXJEZXRhaWwgPSBuZXcgQ29udHJvbGxlckRldGFpbCh0aGlzLnJlc291cmNlLCBmaWVsZHNldCwgdGhpcyk7XHJcbiAgICAgICAgICBjb250ZW50ID0gdWlNdXRhYmxlLmRvbUVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgRGlyZWN0b3J5RW50cnkgJiYgdGhpcy5yZXNvdXJjZS5zdGF0cykge1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJTaXplOiBcIiArICh0aGlzLnJlc291cmNlLnN0YXRzW1wic2l6ZVwiXSAvIDEwMjQpLnRvRml4ZWQoMikgKyBcIiBLaUI8YnIvPlwiO1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJDcmVhdGVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJiaXJ0aHRpbWVcIl0udG9Mb2NhbGVTdHJpbmcoKSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiTW9kaWZpZWQ6IFwiICsgdGhpcy5yZXNvdXJjZS5zdGF0c1tcImN0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5yZXNvdXJjZS50b0hpZXJhcmNoeVN0cmluZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIFNjcmlwdEluZm8pIHtcclxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnJlc291cmNlLnNjcmlwdCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSB0aGlzLnJlc291cmNlLnNjcmlwdFtrZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm5hbWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgIHZhbHVlID0gXCJBcnJheShcIiArIHZhbHVlLmxlbmd0aCArIFwiKVwiO1xyXG4gICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBrZXkgKyBcIjogXCIgKyB2YWx1ZSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgICAgbGV0IGVudHJpZXM6IHsgW25hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMucmVzb3VyY2UuZW50cmllcykge1xyXG4gICAgICAgICAgICBlbnRyaWVzW2VudHJ5LnR5cGVdID0gKGVudHJpZXNbZW50cnkudHlwZV0gPz8gMCkgKyAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgPSBgRW50cmllczogJHt0aGlzLnJlc291cmNlLmVudHJpZXMubGVuZ3RofTxici8+YDtcclxuICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gZW50cmllcylcclxuICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gYCR7dHlwZX06ICR7ZW50cmllc1t0eXBlXX08YnIvPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gXCJTZWxlY3QgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgcmVzb3VyY2UgdG8gZXhhbWluZSBwcm9wZXJ0aWVzXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kb20uYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+KF9ldmVudC5kZXRhaWwuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCB0aGUgc2NyaXB0cyBsb2FkZWRcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwLTIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdTY3JpcHQgZXh0ZW5kcyBWaWV3IHtcclxuICAgIC8vIFRPRE86IGNvbnNpZGVyIHNjcmlwdCBuYW1lc3BhY2VzIMaSLlNjcmlwdE5hbWVzcGFjZXMgdG8gZmluZCBhbGwgc2NyaXB0cyBub3QganVzdCBDb21wb25lbnRTY3JpcHRzXHJcbiAgICBwcml2YXRlIHRhYmxlOiDGknVpLlRhYmxlPFNjcmlwdEluZm8+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGlzdFNjcmlwdHMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gYERyYWcgJiBkcm9wIHNjcmlwdHMgb24gXCJDb21wb25lbnRzXCJgO1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgc2NyaXB0aW5mb3M6IFNjcmlwdEluZm9bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBuYW1lc3BhY2UgaW4gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzW25hbWVzcGFjZV0pIHtcclxuICAgICAgICAgIGxldCBzY3JpcHQ6IEZ1bmN0aW9uID0gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzW25hbWVzcGFjZV1baW5kZXhdO1xyXG4gICAgICAgICAgaWYgKHNjcmlwdC5uYW1lKVxyXG4gICAgICAgICAgICBzY3JpcHRpbmZvcy5wdXNoKG5ldyBTY3JpcHRJbmZvKHNjcmlwdCwgbmFtZXNwYWNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGFibGUgPSBuZXcgxpJ1aS5UYWJsZTxTY3JpcHRJbmZvPihuZXcgQ29udHJvbGxlclRhYmxlU2NyaXB0KCksIHNjcmlwdGluZm9zKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50YWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiBTY3JpcHRJbmZvW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IFNjcmlwdEluZm9bXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgLy8gcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgLy8gICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAvLyAgIHJldHVybiBtZW51O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuZGV0YWlsLmRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMubGlzdFNjcmlwdHMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSJdfQ==