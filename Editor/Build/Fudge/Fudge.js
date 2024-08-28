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
            let sources = Fudge.View.getViewSource(_event).getDragDropSources();
            mutable[key] = sources[0];
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
                        this.tree.show(_event.detail.node.getPath());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvR2xvYmFsLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhZ2UudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJBbmltYXRpb24udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9WaWV3LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3RXh0ZXJuYWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbEZvbGRlci50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJEZXRhaWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVGFibGVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVNjcmlwdHMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZURpcmVjdG9yeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlSGllcmFyY2h5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlUmVzb3VyY2UudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWwudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxBbmltYXRpb24udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxHcmFwaC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEhlbHAudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFuZWwvUGFuZWxQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFByb2plY3QudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9WaWV3UGFydGljbGVTeXN0ZW0udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9BbmltYXRpb24vVmlld0FuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uU2hlZXQudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9HcmFwaC9WaWV3Q29tcG9uZW50cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9HcmFwaC9WaWV3UmVuZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3SW50ZXJuYWxUYWJsZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1ByZXZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdQcm9wZXJ0aWVzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3U2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsS0FBSyxDQWlDZDtBQWpDRCxXQUFVLEtBQUs7SUFDYixtQ0FBbUM7SUFDbkMsd0JBQXdCO0lBU3hCLE1BQWEsV0FBVztRQUNmLE1BQU0s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QkFDckIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNyQixNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUMsQ0FBQztLQUNIO0lBeERZLGdCQUFVLGFBd0R0QixDQUFBO0FBQ0gsQ0FBQyxFQWpFUyxLQUFLLEtBQUwsS0FBSyxRQWlFZCIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgLy8gaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgLy8gaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgdHlwZSBDb250ZXh0TWVudUNhbGxiYWNrID0gKG1lbnVJdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgYnJvd3NlcldpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgZXZlbnQ6IEVsZWN0cm9uLktleWJvYXJkRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gIHR5cGUgU3ViY2xhc3M8VD4gPSB7XHJcbiAgICBzdWJjbGFzc2VzOiBUW11cclxuICAgIG5hbWU6IHN0cmluZ1xyXG4gIH07XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250ZXh0TWVudSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFwcGVuZENvcHlQYXN0ZShfbWVudTogRWxlY3Ryb24uTWVudSk6IHZvaWQge1xyXG4gICAgICBfbWVudS5hcHBlbmQobmV3IHJlbW90ZS5NZW51SXRlbSh7IHJvbGU6IFwiY29weVwiIH0pKTtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcImN1dFwiIH0pKTtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcInBhc3RlXCIgfSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFN1YmNsYXNzTWVudTxUIGV4dGVuZHMgU3ViY2xhc3M8VD4+KF9pZDogQ09OVEVYVE1FTlUsIF9jbGFzczogVCwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChsZXQgaVN1YmNsYXNzIGluIF9jbGFzcy5zdWJjbGFzc2VzKSB7XHJcbiAgICAgICAgbGV0IHN1YmNsYXNzOiBUID0gX2NsYXNzLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgeyBsYWJlbDogc3ViY2xhc3MubmFtZSwgaWQ6IFN0cmluZyhfaWQpLCBjbGljazogX2NhbGxiYWNrIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGl0ZW0ub3ZlcnJpZGVQcm9wZXJ0eShcImlTdWJjbGFzc1wiLCBpU3ViY2xhc3MpO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgZXhwb3J0IGVudW0gQ09OVEVYVE1FTlUge1xyXG4gICAgLy8gU0tFVENIID0gVmlld1NrZXRjaCxcclxuICAgIEFERF9OT0RFLFxyXG4gICAgQUNUSVZBVEVfTk9ERSxcclxuICAgIERFTEVURV9OT0RFLFxyXG4gICAgQUREX0NPTVBPTkVOVCxcclxuICAgIERFTEVURV9DT01QT05FTlQsXHJcbiAgICBBRERfQ09NUE9ORU5UX1NDUklQVCxcclxuICAgIEVESVQsXHJcbiAgICBDUkVBVEVfRk9MREVSLFxyXG4gICAgQ1JFQVRFX01FU0gsXHJcbiAgICBDUkVBVEVfTUFURVJJQUwsXHJcbiAgICBDUkVBVEVfR1JBUEgsXHJcbiAgICBDUkVBVEVfQU5JTUFUSU9OLFxyXG4gICAgQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCxcclxuICAgIFNZTkNfSU5TVEFOQ0VTLFxyXG4gICAgUkVNT1ZFX0NPTVBPTkVOVCxcclxuICAgIEFERF9KT0lOVCxcclxuICAgIERFTEVURV9SRVNPVVJDRSxcclxuICAgIE9SVEhHUkFQSElDX0NBTUVSQSxcclxuICAgIFJFTkRFUl9DT05USU5VT1VTTFksXHJcbiAgICBBRERfUFJPUEVSVFksXHJcbiAgICBERUxFVEVfUFJPUEVSVFksXHJcbiAgICBDT05WRVJUX0FOSU1BVElPTixcclxuICAgIEFERF9QQVJUSUNMRV9QUk9QRVJUWSxcclxuICAgIEFERF9QQVJUSUNMRV9GVU5DVElPTixcclxuICAgIEFERF9QQVJUSUNMRV9DT05TVEFOVCxcclxuICAgIEFERF9QQVJUSUNMRV9DT0RFLFxyXG4gICAgQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OLFxyXG4gICAgREVMRVRFX1BBUlRJQ0xFX0RBVEFcclxuICB9XHJcblxyXG5cclxuICBleHBvcnQgZW51bSBNRU5VIHtcclxuICAgIFFVSVQgPSBcInF1aXRcIixcclxuICAgIFBST0pFQ1RfTkVXID0gXCJwcm9qZWN0TmV3XCIsXHJcbiAgICBQUk9KRUNUX1NBVkUgPSBcInByb2plY3RTYXZlXCIsXHJcbiAgICBQUk9KRUNUX0xPQUQgPSBcInByb2plY3RMb2FkXCIsXHJcbiAgICBERVZUT09MU19PUEVOID0gXCJkZXZ0b29sc09wZW5cIixcclxuICAgIFBBTkVMX0dSQVBIX09QRU4gPSBcInBhbmVsR3JhcGhPcGVuXCIsXHJcbiAgICBQQU5FTF9BTklNQVRJT05fT1BFTiA9IFwicGFuZWxBbmltYXRpb25PcGVuXCIsXHJcbiAgICBQQU5FTF9QUk9KRUNUX09QRU4gPSBcInBhbmVsUHJvamVjdE9wZW5cIixcclxuICAgIFBBTkVMX0hFTFBfT1BFTiA9IFwicGFuZWxIZWxwT3BlblwiLFxyXG4gICAgUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4gPSBcInBhbmVsUGFydGljbGVTeXN0ZW1PcGVuXCIsXHJcbiAgICBGVUxMU0NSRUVOID0gXCJmdWxsc2NyZWVuXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIFBBTkVMIHtcclxuICAgIEdSQVBIID0gXCJQYW5lbEdyYXBoXCIsXHJcbiAgICBQUk9KRUNUID0gXCJQYW5lbFByb2plY3RcIixcclxuICAgIEhFTFAgPSBcIlBhbmVsSGVscFwiLFxyXG4gICAgQU5JTUFUSU9OID0gXCJQYW5lbEFuaW1hdGlvblwiLFxyXG4gICAgUEFSVElDTEVfU1lTVEVNID0gXCJQYW5lbFBhcnRpY2xlU3lzdGVtXCJcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBWSUVXIHtcclxuICAgIEhJRVJBUkNIWSA9IFwiVmlld0hpZXJhcmNoeVwiLFxyXG4gICAgQU5JTUFUSU9OID0gXCJWaWV3QW5pbWF0aW9uXCIsXHJcbiAgICBBTklNQVRJT05fU0hFRVQgPSBcIlZpZXdBbmltYXRpb25TaGVldFwiLFxyXG4gICAgUkVOREVSID0gXCJWaWV3UmVuZGVyXCIsXHJcbiAgICBDT01QT05FTlRTID0gXCJWaWV3Q29tcG9uZW50c1wiLFxyXG4gICAgQ0FNRVJBID0gXCJWaWV3Q2FtZXJhXCIsXHJcbiAgICBJTlRFUk5BTF9UQUJMRSA9IFwiVmlld0ludGVybmFsVGFibGVcIixcclxuICAgIElOVEVSTkFMX0ZPTERFUiA9IFwiVmlld0ludGVybmFsRm9sZGVyXCIsXHJcbiAgICBFWFRFUk5BTCA9IFwiVmlld0V4dGVybmFsXCIsXHJcbiAgICBQUk9QRVJUSUVTID0gXCJWaWV3UHJvcGVydGllc1wiLFxyXG4gICAgUFJFVklFVyA9IFwiVmlld1ByZXZpZXdcIixcclxuICAgIFNDUklQVCA9IFwiVmlld1NjcmlwdFwiLFxyXG4gICAgUEFSVElDTEVfU1lTVEVNID0gXCJWaWV3UGFydGljbGVTeXN0ZW1cIlxyXG4gICAgLy8gU0tFVENIID0gVmlld1NrZXRjaCxcclxuICAgIC8vIE1FU0ggPSBWaWV3TWVzaCxcclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIFRSQU5TRk9STSB7XHJcbiAgICBUUkFOU0xBVEUgPSBcInRyYW5zbGF0ZVwiLFxyXG4gICAgUk9UQVRFID0gXCJyb3RhdGVcIixcclxuICAgIFNDQUxFID0gXCJzY2FsZVwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBHSVpNT1Mge1xyXG4gICAgVFJBTlNGT1JNID0gXCJUcmFuc2Zvcm1cIlxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcblxyXG4gIGV4cG9ydCBlbnVtIE1JTUUge1xyXG4gICAgVEVYVCA9IFwidGV4dFwiLFxyXG4gICAgQVVESU8gPSBcImF1ZGlvXCIsXHJcbiAgICBJTUFHRSA9IFwiaW1hZ2VcIixcclxuICAgIE1FU0ggPSBcIm1lc2hcIixcclxuICAgIEdMVEYgPSBcImdsdGZcIixcclxuICAgIFVOS05PV04gPSBcInVua25vd25cIlxyXG4gIH1cclxuXHJcbiAgbGV0IG1pbWU6IE1hcDxNSU1FLCBzdHJpbmdbXT4gPSBuZXcgTWFwKFtcclxuICAgIFtNSU1FLlRFWFQsIFtcInRzXCIsIFwianNvblwiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJjc3NcIiwgXCJqc1wiLCBcInR4dFwiXV0sXHJcbiAgICBbTUlNRS5NRVNILCBbXCJvYmpcIl1dLFxyXG4gICAgW01JTUUuQVVESU8sIFtcIm1wM1wiLCBcIndhdlwiLCBcIm9nZ1wiXV0sXHJcbiAgICBbTUlNRS5JTUFHRSwgW1wicG5nXCIsIFwianBnXCIsIFwianBlZ1wiLCBcInRpZlwiLCBcInRnYVwiLCBcImdpZlwiXV0sXHJcbiAgICBbTUlNRS5HTFRGLCBbXCJnbHRmXCIsIFwiZ2xiXCJdXVxyXG4gIF0pO1xyXG5cclxuICBjb25zdCBmczogdHlwZW9mIGltcG9ydChcImZzXCIpID0gcmVxdWlyZShcImZzXCIpO1xyXG4gIGNvbnN0IHA6IHR5cGVvZiBpbXBvcnQoXCJwYXRoXCIpID0gcmVxdWlyZShcInBhdGhcIik7XHJcbiAgdHlwZSBEaXJlbnQgPSBpbXBvcnQoXCJmc1wiKS5EaXJlbnQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBEaXJlY3RvcnlFbnRyeSB7XHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhdGhSZWxhdGl2ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGRpcmVudDogRGlyZW50O1xyXG4gICAgcHVibGljIHN0YXRzOiBPYmplY3Q7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9wYXRoOiBzdHJpbmcsIF9wYXRoUmVsYXRpdmU6IHN0cmluZywgX2RpcmVudDogRGlyZW50LCBfc3RhdHM6IE9iamVjdCkge1xyXG4gICAgICB0aGlzLnBhdGggPSBwLm5vcm1hbGl6ZShfcGF0aCk7XHJcbiAgICAgIHRoaXMucGF0aFJlbGF0aXZlID0gcC5ub3JtYWxpemUoX3BhdGhSZWxhdGl2ZSk7XHJcbiAgICAgIHRoaXMuZGlyZW50ID0gX2RpcmVudDtcclxuICAgICAgdGhpcy5zdGF0cyA9IF9zdGF0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJvb3QoX3BhdGg6IHN0cmluZyk6IERpcmVjdG9yeUVudHJ5IHtcclxuICAgICAgbGV0IGRpcmVudDogRGlyZW50ID0gbmV3IGZzLkRpcmVudCgpO1xyXG4gICAgICBkaXJlbnQubmFtZSA9IHAuYmFzZW5hbWUoX3BhdGgpO1xyXG4gICAgICBkaXJlbnQuaXNEaXJlY3RvcnkgPSAoKSA9PiB0cnVlO1xyXG4gICAgICByZXR1cm4gbmV3IERpcmVjdG9yeUVudHJ5KF9wYXRoLCBcIlwiLCBkaXJlbnQsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlbnQubmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgbmFtZShfbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgIGxldCBuZXdQYXRoOiBzdHJpbmcgPSBwLmpvaW4ocC5kaXJuYW1lKHRoaXMucGF0aCksIF9uYW1lKTtcclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobmV3UGF0aCkpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBhbHJlYWR5IGEgZmlsZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSAnJHtfbmFtZX0nLiBTcGVjaWZ5IGEgZGlmZmVyZW50IG5hbWUuYCk7XHJcbiAgICAgIGZzLnJlbmFtZVN5bmModGhpcy5wYXRoLCBuZXdQYXRoKTtcclxuICAgICAgdGhpcy5wYXRoID0gbmV3UGF0aDtcclxuICAgICAgdGhpcy5kaXJlbnQubmFtZSA9IF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXJlY3RvcnkoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVudC5pc0RpcmVjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0RpcmVjdG9yeSA/IFwiRGlyZWN0b3J5XCIgOiBcIkZpbGVcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICBmcy5ybVN5bmModGhpcy5wYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGlyZWN0b3J5Q29udGVudCgpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IGRpcmVudHM6IERpcmVudFtdID0gZnMucmVhZGRpclN5bmModGhpcy5wYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGRpcmVudCBvZiBkaXJlbnRzKSB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IHAuam9pbih0aGlzLnBhdGgsIGRpcmVudC5uYW1lKTtcclxuICAgICAgICBsZXQgcGF0aFJlbGF0aXZlOiBzdHJpbmcgPSBwLmpvaW4odGhpcy5wYXRoUmVsYXRpdmUsIGRpcmVudC5uYW1lKTtcclxuICAgICAgICBsZXQgc3RhdHM6IE9iamVjdCA9IGZzLnN0YXRTeW5jKHBhdGgpO1xyXG4gICAgICAgIGxldCBlbnRyeTogRGlyZWN0b3J5RW50cnkgPSBuZXcgRGlyZWN0b3J5RW50cnkocGF0aCwgcGF0aFJlbGF0aXZlLCBkaXJlbnQsIHN0YXRzKTtcclxuICAgICAgICBjb250ZW50LnB1c2goZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGaWxlQ29udGVudCgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgY29udGVudDogc3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aCwgXCJ1dGY4XCIpO1xyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRW50cnkoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IHZvaWQge1xyXG4gICAgICBmcy5jb3B5RmlsZVN5bmMoX2VudHJ5LnBhdGgsIHAuam9pbih0aGlzLnBhdGgsIF9lbnRyeS5uYW1lKSwgZnMuY29uc3RhbnRzLkNPUFlGSUxFX0VYQ0wpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNaW1lVHlwZSgpOiBNSU1FIHtcclxuICAgICAgbGV0IGV4dGVuc2lvbjogc3RyaW5nID0gdGhpcy5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKTtcclxuICAgICAgZm9yIChsZXQgdHlwZSBvZiBtaW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVbMV0uaW5kZXhPZihleHRlbnNpb24pID4gLTEpXHJcbiAgICAgICAgICByZXR1cm4gdHlwZVswXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTUlNRS5VTktOT1dOO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHBhdGggb2YgRGlyZWN0b3J5RW50cmllcyBzdGFydGluZyBhdCB0aGUgcm9vdCBhbmQgZW5kaW5nIGF0IHRoaXMgRGlyZWN0b3J5RW50cnkuIFxyXG4gICAgICogVGhlIGVudHJpZXMgaW4gdGhlIHJldHVybmVkIHBhdGggT05MWSBoYXZlIHRoZWlyIHJlbGF0aXZlIHBhdGggc2V0LiBUaGlzIGlzIHNvbGVseSB1c2VkIGZvciBkaXNwbGF5IHB1cnBvc2VzIGluIHtAbGluayBWaWV3RXh0ZXJuYWx9cyB0cmVlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UGF0aCgpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IHRyYWNlOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBjdXJyZW50UGF0aDogc3RyaW5nID0gdGhpcy5wYXRoUmVsYXRpdmU7XHJcbiAgICAgIHdoaWxlIChjdXJyZW50UGF0aCAhPSB0cmFjZVt0cmFjZS5sZW5ndGggLSAxXT8ucGF0aFJlbGF0aXZlKSB7XHJcbiAgICAgICAgdHJhY2UucHVzaChuZXcgRGlyZWN0b3J5RW50cnkoXCJcIiwgY3VycmVudFBhdGgsIG51bGwsIG51bGwpKTtcclxuICAgICAgICBjdXJyZW50UGF0aCA9IHAuZGlybmFtZShjdXJyZW50UGF0aCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRyYWNlLnJldmVyc2UoKTtcclxuICAgICAgcmV0dXJuIHRyYWNlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIFxyXG4gIGV4cG9ydCBlbnVtIEVWRU5UX0VESVRPUiB7XHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgY3JlYXRlZCwgaXMgbm90IGRpc3BhdGNoZWQgc28gZmFyICovXHJcbiAgICBDUkVBVEUgPSBcIkVESVRPUl9DUkVBVEVcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBzZWxlY3RlZCBhbmQgaXQgaXMgbmVjZXNzYXJ5IHRvIHN3aXRjaCBjb250ZW50cyBpbiB0aGUgdmlld3MgKi9cclxuICAgIFNFTEVDVCA9IFwiRURJVE9SX1NFTEVDVFwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIG1vZGlmaWVkIHN0cnVjdHVyYWxseSBhbmQgaXQgaXMgbmVjZXNzYXJ5IHRvIHVwZGF0ZSB2aWV3cyAqL1xyXG4gICAgTU9ESUZZID0gXCJFRElUT1JfTU9ESUZZXCIsXHJcbiAgICAvKiogVmFsdWVzIG9mIGFuIGVudGl0eSBjaGFuZ2UgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byB1cGRhdGUgdmlld3MgKi9cclxuICAgIFVQREFURSA9IFwiRURJVE9SX1VQREFURVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIGRlbGV0ZWQgKi9cclxuICAgIERFTEVURSA9IFwiRURJVE9SX0RFTEVURVwiLFxyXG4gICAgLyoqIEEgdmlldyBvciBwYW5lbCBjbG9zZXMgKi9cclxuICAgIENMT1NFID0gXCJFRElUT1JfQ0xPU0VcIixcclxuICAgIC8qKiBBIHZpZXcgb3IgcGFuZWwgb3BlbnMgKi9cclxuICAgIE9QRU4gPSBcIkVESVRPUl9PUEVOXCJcclxuICAgIC8qKiBBIHRyYW5zZm9ybSBtYXRyaXggZ2V0cyBhZGp1c3RlZCBpbnRlcmFjdGl2ZWx5ICovLFxyXG4gICAgVFJBTlNGT1JNID0gXCJFRElUT1JfVFJBTlNGT1JNXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IHJlY2lldmVzIGZvY3VzIGFuZCBjYW4gYmUgbWFuaXB1bGF0ZWQgdXNpbmcgdGhlIGtleWJvYXJkICovXHJcbiAgICBGT0NVUyA9IFwiRURJVE9SX0ZPQ1VTXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRXZlbnREZXRhaWwge1xyXG4gICAgdmlldz86IFZpZXc7XHJcbiAgICBzZW5kZXI/OiBQYW5lbCB8IFBhZ2U7XHJcbiAgICBub2RlPzogxpIuTm9kZTtcclxuICAgIGdyYXBoPzogxpIuR3JhcGg7XHJcbiAgICByZXNvdXJjZT86IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlO1xyXG4gICAgbXV0YWJsZT86IMaSLk11dGFibGU7XHJcbiAgICB0cmFuc2Zvcm0/OiBPYmplY3Q7XHJcbiAgICBkYXRhPzogxpIuR2VuZXJhbDtcclxuICAgIC8vIHBhdGg/OiBWaWV3W107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgQ3VzdG9tRXZlbnQgdGhhdCBzdXBwb3J0cyBhIGRldGFpbCBmaWVsZCB3aXRoIHRoZSB0eXBlIEV2ZW50RGV0YWlsXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEVkaXRvckV2ZW50IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8RXZlbnREZXRhaWw+IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGF0Y2goX3RhcmdldDogRXZlbnRUYXJnZXQsIF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF90YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBjb25zdCBmczogdHlwZW9mIGltcG9ydChcImZzXCIpID0gcmVxdWlyZShcImZzXCIpO1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBleHBvcnQgbGV0IHdhdGNoZXI6IGltcG9ydChcImZzXCIpLkZTV2F0Y2hlcjtcclxuXHJcbiAgaW50ZXJmYWNlIENvcHlMaXN0IHtcclxuICAgIFtzcmM6IHN0cmluZ106IHN0cmluZztcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBuZXdQcm9qZWN0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGZpbGVuYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHJlbW90ZS5kaWFsb2cuc2hvd09wZW5EaWFsb2dTeW5jKG51bGwsIHtcclxuICAgICAgcHJvcGVydGllczogW1wib3BlbkRpcmVjdG9yeVwiLCBcImNyZWF0ZURpcmVjdG9yeVwiXSwgdGl0bGU6IFwiU2VsZWN0L0NyZWF0ZSBhIGZvbGRlciB0byBzYXZlIHRoZSBwcm9qZWN0IHRvLiBUaGUgZm9sZGVybmFtZSBiZWNvbWVzIHRoZSBuYW1lIG9mIHlvdXIgcHJvamVjdFwiLCBidXR0b25MYWJlbDogXCJTYXZlIFByb2plY3RcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFmaWxlbmFtZSlcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGxldCBiYXNlOiBVUkwgPSBuZXcgVVJMKG5ldyBVUkwoXCJmaWxlOi8vXCIgKyBmaWxlbmFtZVswXSkudG9TdHJpbmcoKSArIFwiL1wiKTtcclxuICAgIGNvbnNvbGUubG9nKFwiUGF0aFwiLCBiYXNlLnRvU3RyaW5nKCkpO1xyXG4gICAgICBcclxuICAgIHByb2plY3QgPSBuZXcgUHJvamVjdChiYXNlKTtcclxuXHJcbiAgICBhd2FpdCBzYXZlUHJvamVjdCh0cnVlKTtcclxuXHJcbiAgICBsZXQgxpJQYXRoOiBVUkwgPSBuZXcgVVJMKFwiLi4vLi4vXCIsIGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgY29uc29sZS5sb2coxpJQYXRoKTtcclxuXHJcbiAgICBmcy5jb3B5RmlsZVN5bmMobmV3IFVSTChcIkVkaXRvci9Tb3VyY2UvVGVtcGxhdGUvLmdpdGlnbm9yZS50eHRcIiwgxpJQYXRoKSwgbmV3IFVSTChcIi5naXRpZ25vcmVcIiwgYmFzZSkpO1xyXG4gICAgZnMubWtkaXJTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZS9AdHlwZXNcIiwgYmFzZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgZnMubWtkaXJTeW5jKG5ldyBVUkwoXCJTY3JpcHQvQnVpbGRcIiwgYmFzZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG5cclxuICAgIGxldCBjb3B5VGVtcGxhdGVzOiBDb3B5TGlzdCA9IHtcclxuICAgICAgXCJDdXN0b21Db21wb25lbnRTY3JpcHQudHh0XCI6IFwiU291cmNlL0N1c3RvbUNvbXBvbmVudFNjcmlwdC50c1wiLFxyXG4gICAgICBcIk1haW4udHh0XCI6IFwiU291cmNlL01haW4udHNcIixcclxuICAgICAgXCJ0c2NvbmZpZy50eHRcIjogXCJTb3VyY2UvdHNjb25maWcuanNvblwiLFxyXG4gICAgICBcIlNjcmlwdC50eHRcIjogXCIgQnVpbGQvU2NyaXB0LmpzXCIsXHJcbiAgICAgIFwiQXV0b3ZpZXcuanNcIjogXCIuLi9BdXRvdmlldy5qc1wiXHJcbiAgICB9O1xyXG4gICAgY29weUZpbGVzKGNvcHlUZW1wbGF0ZXMsIG5ldyBVUkwoXCJFZGl0b3IvU291cmNlL1RlbXBsYXRlL1wiLCDGklBhdGgpLCBuZXcgVVJMKFwiU2NyaXB0L1wiLCBiYXNlKSk7XHJcblxyXG4gICAgbGV0IGRlZmluaXRpb246IFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2UvQHR5cGVzL0Z1ZGdlQ29yZS5kLnRzXCIsIGJhc2UpLCBhd2FpdCBkZWZpbml0aW9uLnRleHQoKSk7XHJcblxyXG4gICAgYXdhaXQgbG9hZFByb2plY3QobmV3IFVSTChwcm9qZWN0LmZpbGVJbmRleCwgcHJvamVjdC5iYXNlKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb3B5RmlsZXMoX2xpc3Q6IENvcHlMaXN0LCBfc3JjUGF0aDogVVJMLCBfZGVzdFBhdGg6IFVSTCk6IHZvaWQge1xyXG4gICAgZm9yIChsZXQgY29weSBpbiBfbGlzdCkge1xyXG4gICAgICBsZXQgc3JjOiBVUkwgPSBuZXcgVVJMKGNvcHksIF9zcmNQYXRoKTtcclxuICAgICAgbGV0IGRlc3Q6IFVSTCA9IG5ldyBVUkwoX2xpc3RbY29weV0sIF9kZXN0UGF0aCk7XHJcbiAgICAgIGZzLmNvcHlGaWxlU3luYyhzcmMsIGRlc3QpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVQcm9qZWN0KF9uZXc6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgaWYgKCFwcm9qZWN0KVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgaWYgKCFhd2FpdCBwcm9qZWN0Lm9wZW5EaWFsb2coKSlcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHVud2F0Y2hGb2xkZXIoKTtcclxuXHJcbiAgICBsZXQgYmFzZTogVVJMID0gcHJvamVjdC5iYXNlO1xyXG5cclxuICAgIGlmIChfbmV3KSB7XHJcbiAgICAgIGxldCBjc3NGaWxlTmFtZTogVVJMID0gbmV3IFVSTChwcm9qZWN0LmZpbGVTdHlsZXMsIGJhc2UpO1xyXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGNzc0ZpbGVOYW1lLCBwcm9qZWN0LmdldFByb2plY3RDU1MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWw6IHN0cmluZyA9IHByb2plY3QuZ2V0UHJvamVjdEhUTUwocHJvamVjdC5uYW1lKTtcclxuICAgIGxldCBodG1sRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlSW5kZXgsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhodG1sRmlsZU5hbWUsIGh0bWwpO1xyXG5cclxuICAgIGxldCBqc29uRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlSW50ZXJuYWwsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0UHJvamVjdEpTT04oKSk7XHJcblxyXG4gICAganNvbkZpbGVOYW1lID0gbmV3IFVSTChwcm9qZWN0LmZpbGVJbnRlcm5hbEZvbGRlciwgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25GaWxlTmFtZSwgcHJvamVjdC5nZXRSZXNvdXJjZUZvbGRlckpTT04oKSk7XHJcblxyXG4gICAganNvbkZpbGVOYW1lID0gbmV3IFVSTChwcm9qZWN0LmZpbGVTZXR0aW5ncywgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25GaWxlTmFtZSwgcHJvamVjdC5nZXRTZXR0aW5nc0pTT04oKSk7XHJcblxyXG4gICAgd2F0Y2hGb2xkZXIoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb21wdExvYWRQcm9qZWN0KCk6IFByb21pc2U8VVJMPiB7XHJcbiAgICBsZXQgZmlsZW5hbWVzOiBzdHJpbmdbXSA9IHJlbW90ZS5kaWFsb2cuc2hvd09wZW5EaWFsb2dTeW5jKG51bGwsIHtcclxuICAgICAgdGl0bGU6IFwiTG9hZCBQcm9qZWN0XCIsIGJ1dHRvbkxhYmVsOiBcIkxvYWQgUHJvamVjdFwiLCBwcm9wZXJ0aWVzOiBbXCJvcGVuRmlsZVwiXSxcclxuICAgICAgZmlsdGVyczogW3sgbmFtZTogXCJIVE1MLUZpbGVcIiwgZXh0ZW5zaW9uczogW1wiaHRtbFwiLCBcImh0bVwiXSB9XVxyXG4gICAgfSk7XHJcbiAgICBpZiAoIWZpbGVuYW1lcylcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFVSTChcImZpbGU6Ly9cIiArIGZpbGVuYW1lc1swXSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFByb2plY3QoX3VybDogVVJMKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgaHRtbENvbnRlbnQ6IHN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhfdXJsLCB7IGVuY29kaW5nOiBcInV0Zi04XCIgfSk7XHJcbiAgICDGki5EZWJ1Zy5ncm91cENvbGxhcHNlZChcIkZpbGUgY29udGVudFwiKTtcclxuICAgIMaSLkRlYnVnLmluZm8oaHRtbENvbnRlbnQpO1xyXG4gICAgxpIuRGVidWcuZ3JvdXBFbmQoKTtcclxuXHJcbiAgICB1bndhdGNoRm9sZGVyKCk7XHJcblxyXG4gICAgcHJvamVjdCA9IG5ldyBQcm9qZWN0KF91cmwpO1xyXG4gICAgYXdhaXQgcHJvamVjdC5sb2FkKGh0bWxDb250ZW50KTtcclxuXHJcbiAgICB3YXRjaEZvbGRlcigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gd2F0Y2hGb2xkZXIoKTogdm9pZCB7XHJcbiAgICBsZXQgZGlyOiBVUkwgPSBuZXcgVVJMKFwiLlwiLCBwcm9qZWN0LmJhc2UpO1xyXG4gICAgd2F0Y2hlciA9IGZzLndhdGNoKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSwgaG5kRmlsZUNoYW5nZSk7XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gaG5kRmlsZUNoYW5nZShfZXZlbnQ6IHN0cmluZywgX2ZpbGVuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVJbmRleCB8fCBfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlSW50ZXJuYWwgfHwgX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZVNjcmlwdCkge1xyXG4gICAgICAgIHVud2F0Y2hGb2xkZXIoKTtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdChudWxsLCBmYWxzZSwgXCJJbXBvcnRhbnQgZmlsZSBjaGFuZ2VcIiwgXCJSZWxvYWQgcHJvamVjdD9cIiwgXCJSZWxvYWRcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIGF3YWl0IGxvYWRQcm9qZWN0KHByb2plY3QuYmFzZSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICB3YXRjaGVyID0gZnMud2F0Y2goZGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LCBobmRGaWxlQ2hhbmdlKTtcclxuICAgICAgfVxyXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gdW53YXRjaEZvbGRlcigpOiB2b2lkIHtcclxuICAgIGlmICghd2F0Y2hlcilcclxuICAgICAgcmV0dXJuO1xyXG4gICAgd2F0Y2hlci51bnJlZigpO1xyXG4gICAgd2F0Y2hlci5jbG9zZSgpO1xyXG4gIH1cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBmdW5jdGlvbiBpbkdyYXBoSW5zdGFuY2UoX25vZGU6IMaSLk5vZGUsIF9leGNsdWRlTm9kZTogYm9vbGVhbiA9IHRydWUpOiDGki5HcmFwaEluc3RhbmNlIHtcclxuICAgIGxldCBwYXRoOiDGki5Ob2RlW10gPSBfbm9kZS5nZXRQYXRoKCkucmV2ZXJzZSgpO1xyXG4gICAgaWYgKF9leGNsdWRlTm9kZSlcclxuICAgICAgcGF0aC5zaGlmdCgpO1xyXG5cclxuICAgIGZvciAobGV0IGFuY2VzdG9yIG9mIHBhdGgpXHJcbiAgICAgIGlmIChhbmNlc3RvciBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gYW5jZXN0b3I7XHJcbiAgICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgdHlwZXM9XCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24vRWxlY3Ryb25cIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIkRlZmluaXRpb24udHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvLyBpbXBvcnQgxpJhaWQgPSBGdWRnZUFpZDtcclxuICAvLyBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGlwY1JlbmRlcmVyOiBFbGVjdHJvbi5JcGNSZW5kZXJlciA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKS5pcGNSZW5kZXJlcjsgLy8gUmVwbGFjZSB3aXRoOlxyXG4gIGV4cG9ydCBjb25zdCByZW1vdGU6IHR5cGVvZiBpbXBvcnQoXCJAZWxlY3Ryb24vcmVtb3RlXCIpID0gcmVxdWlyZShcIkBlbGVjdHJvbi9yZW1vdGVcIik7XHJcblxyXG4gIGV4cG9ydCBsZXQgcHJvamVjdDogUHJvamVjdDsgLy8gPSBuZXcgUHJvamVjdCgpO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdXBwZXJtb3N0IGNvbnRhaW5lciBmb3IgYWxsIHBhbmVscyBjb250cm9sbGluZyBkYXRhIGZsb3cgYmV0d2Vlbi4gXHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhZ2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBnb2xkZW5MYXlvdXRNb2R1bGU6IMaSLkdlbmVyYWwgPSAoZ2xvYmFsVGhpcyBhcyDGki5HZW5lcmFsKS5nb2xkZW5MYXlvdXQ7ICAvLyDGki5HZW5lcmFsIGlzIHN5bm9ueW0gZm9yIGFueS4uLiBoYWNrIHRvIGdldCBHb2xkZW5MYXlvdXQgdG8gd29ya1xyXG4gICAgcHVibGljIHN0YXRpYyBtb2RlVHJhbnNmb3JtOiBUUkFOU0ZPUk0gPSBUUkFOU0ZPUk0uVFJBTlNMQVRFO1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ29sZGVuTGF5b3V0OiBHb2xkZW5MYXlvdXQ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwYW5lbHM6IFBhbmVsW10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhdGljIHBoeXNpY3M6IHsgW2lkR3JhcGg6IHN0cmluZ106IMaSLlBoeXNpY3MgfSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdFByb2plY3QoKTogdm9pZCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU2V0IGRlZmF1bHQgcHJvamVjdCBpbiBsb2NhbCBzdG9yYWdlXCIsIHByb2plY3QpO1xyXG4gICAgICBpZiAocHJvamVjdClcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2plY3RcIiwgcHJvamVjdC5iYXNlLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TGF5b3V0KCk6IFJlc29sdmVkTGF5b3V0Q29uZmlnIHtcclxuICAgICAgcmV0dXJuIFBhZ2UuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRMYXlvdXQoX2xheW91dD86IExheW91dENvbmZpZyk6IHZvaWQge1xyXG4gICAgICBfbGF5b3V0ID8/PSB7XHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICBwb3BvdXQ6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290OiB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgaXNDbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICBjb250ZW50OiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmxvYWRMYXlvdXQoX2xheW91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRUcmFuc2Zvcm0oX21vZGU6IFRSQU5TRk9STSk6IHZvaWQge1xyXG4gICAgICBQYWdlLm1vZGVUcmFuc2Zvcm0gPSBfbW9kZTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYFRyYW5zZm9ybSBtb2RlOiAke19tb2RlfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGh5c2ljcyhfZ3JhcGg6IMaSLkdyYXBoKTogxpIuUGh5c2ljcyB7XHJcbiAgICAgIHJldHVybiBQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdIHx8IChQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdID0gbmV3IMaSLlBoeXNpY3MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsbGVkIGJ5IHdpbmRvd3MgbG9hZC1saXN0ZW5lclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIC8vIMaSLkRlYnVnLnNldEZpbHRlcijGki5EZWJ1Z0NvbnNvbGUsIMaSLkRFQlVHX0ZJTFRFUi5BTEwgfCDGki5ERUJVR19GSUxURVIuU09VUkNFKTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWxTdG9yYWdlXCIsIGxvY2FsU3RvcmFnZSk7XHJcblxyXG4gICAgICBQYWdlLnNldHVwR29sZGVuTGF5b3V0KCk7XHJcbiAgICAgIMaSLlByb2plY3QubW9kZSA9IMaSLk1PREUuRURJVE9SO1xyXG5cclxuICAgICAgUGFnZS5zZXR1cE1haW5MaXN0ZW5lcnMoKTtcclxuICAgICAgUGFnZS5zZXR1cFBhZ2VMaXN0ZW5lcnMoKTtcclxuICAgICAgLy8gZm9yIHRlc3Rpbmc6XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4pO1xyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUEFORUxfR1JBUEhfT1BFTik7XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QUk9KRUNUX0xPQUQpO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9IRUxQX09QRU4sIG9uOiB0cnVlIH0pO1xyXG5cclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5wcm9qZWN0KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkIHByb2plY3QgcmVmZXJlbmNlZCBpbiBsb2NhbCBzdG9yYWdlXCIsIGxvY2FsU3RvcmFnZS5wcm9qZWN0KTtcclxuICAgICAgICBhd2FpdCBQYWdlLmxvYWRQcm9qZWN0KG5ldyBVUkwobG9jYWxTdG9yYWdlLnByb2plY3QpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwR29sZGVuTGF5b3V0KCk6IHZvaWQge1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dCA9IG5ldyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Hb2xkZW5MYXlvdXQoKTsgLy8gR29sZGVuTGF5b3V0IDIgYXMgVU1ELU1vZHVsZVxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5vbihcIml0ZW1DcmVhdGVkXCIsIFBhZ2UuaG5kUGFuZWxDcmVhdGVkKTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuUFJPSkVDVCwgUGFuZWxQcm9qZWN0KTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5HUkFQSCwgUGFuZWxHcmFwaCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuSEVMUCwgUGFuZWxIZWxwKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5BTklNQVRJT04sIFBhbmVsQW5pbWF0aW9uKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5QQVJUSUNMRV9TWVNURU0sIFBhbmVsUGFydGljbGVTeXN0ZW0pO1xyXG5cclxuICAgICAgUGFnZS5sb2FkTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkKF9wYW5lbDogdHlwZW9mIFBhbmVsLCBfc3RhdGU/OiBKc29uVmFsdWUpOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGFuZWxDb25maWc6IENvbXBvbmVudEl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICBjb21wb25lbnRUeXBlOiBfcGFuZWwubmFtZSxcclxuICAgICAgICBjb21wb25lbnRTdGF0ZTogX3N0YXRlLFxyXG4gICAgICAgIHRpdGxlOiBcIlBhbmVsXCIsXHJcbiAgICAgICAgaWQ6IFBhZ2UuZ2VuZXJhdGVJRChfcGFuZWwubmFtZSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIGlmICghUGFnZS5nb2xkZW5MYXlvdXQucm9vdEl0ZW0pICAvLyB3b3JrYXJvdW5kIGJlY2F1c2UgZ29sZGVuIExheW91dCBsb3NlcyByb290SXRlbS4uLlxyXG4gICAgICAvLyAgIFBhZ2UubG9hZExheW91dCgpOyAvLyBUT0RPOiB0aGVzZSB0d28gbGluZXMgYXBwZWFyIHRvIGJlIG9ic29sZXRlLCB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXRcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmFkZEl0ZW1BdExvY2F0aW9uKHBhbmVsQ29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmluZChfdHlwZTogdHlwZW9mIFBhbmVsKTogUGFuZWxbXSB7XHJcbiAgICAgIGxldCByZXN1bHQ6IFBhbmVsW10gPSBbXTtcclxuICAgICAgcmVzdWx0ID0gUGFnZS5wYW5lbHMuZmlsdGVyKF9wYW5lbCA9PiBfcGFuZWwgaW5zdGFuY2VvZiBfdHlwZSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVJRChfbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgIHdoaWxlICh0aGlzLmdvbGRlbkxheW91dC5maW5kRmlyc3RDb21wb25lbnRJdGVtQnlJZChfbmFtZSArIGkpKVxyXG4gICAgICAgIGkrKztcclxuICAgICAgcmV0dXJuIF9uYW1lICsgaTsgLy8gX25hbWUgKyBQYWdlLmlkQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQYWdlLUV2ZW50cyBmcm9tIERPTVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBQYWdlTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBQYWdlLmhuZEtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmQgY3VzdG9tIGNvcGllcyBvZiB0aGUgZ2l2ZW4gZXZlbnQgdG8gdGhlIHBhbmVscyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJvYWRjYXN0KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBsZXQgc2VuZGVyOiBQYW5lbCB8IFBhZ2UgPSBkZXRhaWw/LnNlbmRlcjtcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IFBhZ2U7XHJcbiAgICAgIGZvciAobGV0IHBhbmVsIG9mIFBhZ2UucGFuZWxzKSB7XHJcbiAgICAgICAgaWYgKHBhbmVsICE9IHNlbmRlcikgLy8gZG9uJ3Qgc2VuZCBiYWNrIHRvIG9yaWdpbmFsIHNlbmRlclxyXG4gICAgICAgICAgcGFuZWwuZGlzcGF0Y2goPEVWRU5UX0VESVRPUj5fZXZlbnQudHlwZSwgeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlQ6XHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShUUkFOU0ZPUk0uVFJBTlNMQVRFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5SOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlJPVEFURSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRTpcclxuICAgICAgICAgIC8vIFRPRE86IGRvbid0IHN3aXRjaCB0byBzY2FsZSBtb2RlIHdoZW4gdXNpbmcgZmx5LWNhbWVyYSBhbmQgcHJlc3NpbmcgRVxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlNDQUxFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEV2ZW50KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgbGV0IHZpZXc6IFZpZXcgPSBfZXZlbnQuZGV0YWlsLnZpZXc7XHJcbiAgICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIFBhbmVsKVxyXG4gICAgICAgICAgICBQYWdlLnBhbmVscy5zcGxpY2UoUGFnZS5wYW5lbHMuaW5kZXhPZih2aWV3KSwgMSk7XHJcblxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbG9zZWRcIiwgdmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgUGFnZS5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRQYW5lbENyZWF0ZWQgPSAoX2V2ZW50OiBFdmVudEVtaXR0ZXIuQnViYmxpbmdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDb21wb25lbnRJdGVtID0gX2V2ZW50LnRhcmdldCBhcyBDb21wb25lbnRJdGVtO1xyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuQ29tcG9uZW50SXRlbSkge1xyXG4gICAgICAgIFBhZ2UucGFuZWxzLnB1c2goPFBhbmVsPnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBhd2FpdCBsb2FkUHJvamVjdChfdXJsKTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gTWFpbi1FdmVudHMgZnJvbSBFbGVjdHJvblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBNYWluTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTkVXLCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgxpIuUHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgIGF3YWl0IG5ld1Byb2plY3QoKTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9BTklNQVRJT05fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX1NBVkUsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBpZiAoYXdhaXQgc2F2ZVByb2plY3QoKSlcclxuICAgICAgICAgIFBhZ2Uuc2V0RGVmYXVsdFByb2plY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTE9BRCwgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIGxldCB1cmw6IFVSTCA9IGF3YWl0IHByb21wdExvYWRQcm9qZWN0KCk7XHJcbiAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgYXdhaXQgUGFnZS5sb2FkUHJvamVjdCh1cmwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfR1JBUEhfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsR3JhcGgsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxQcm9qZWN0LCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0hFTFBfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsSGVscCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5RVUlULCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5zZXREZWZhdWx0UHJvamVjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEFuaW1hdGlvbiwgbnVsbCk7XHJcbiAgICAgICAgLy8gbGV0IHBhbmVsOiBQYW5lbCA9IFBhbmVsTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVQYW5lbEZyb21UZW1wbGF0ZShuZXcgVmlld0FuaW1hdGlvblRlbXBsYXRlKCksIFwiQW5pbWF0aW9uIFBhbmVsXCIpO1xyXG4gICAgICAgIC8vIFBhbmVsTWFuYWdlci5pbnN0YW5jZS5hZGRQYW5lbChwYW5lbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsUGFydGljbGVTeXN0ZW0sIG51bGwpO1xyXG4gICAgICAgIC8vIGxldCBwYW5lbDogUGFuZWwgPSBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlUGFuZWxGcm9tVGVtcGxhdGUobmV3IFZpZXdBbmltYXRpb25UZW1wbGF0ZSgpLCBcIkFuaW1hdGlvbiBQYW5lbFwiKTtcclxuICAgICAgICAvLyBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuYWRkUGFuZWwocGFuZWwpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZ1bmN0aW9uIHdlbGNvbWUoY29udGFpbmVyOiBHb2xkZW5MYXlvdXQuQ29udGFpbmVyLCBzdGF0ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgLy8gICBjb250YWluZXIuZ2V0RWxlbWVudCgpLmh0bWwoXCI8ZGl2PldlbGNvbWU8L2Rpdj5cIik7XHJcbiAgLy8gfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIMaSLlNlcmlhbGl6ZXIucmVnaXN0ZXJOYW1lc3BhY2UoRnVkZ2UpO1xyXG5cclxuICBleHBvcnQgY2xhc3MgUHJvamVjdCBleHRlbmRzIMaSLk11dGFibGUgeyAvLyBUT0RPOiByZXBsYWNlIHdpdGggc2VyaWxpemFibGVcclxuICAgIC8vIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJOZXdQcm9qZWN0XCI7XHJcbiAgICBwdWJsaWMgYmFzZTogVVJMO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgZmlsZUluZGV4OiBzdHJpbmcgPSBcImluZGV4Lmh0bWxcIjtcclxuICAgIHB1YmxpYyBmaWxlSW50ZXJuYWw6IHN0cmluZyA9IFwiSW50ZXJuYWwuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVJbnRlcm5hbEZvbGRlcjogc3RyaW5nID0gXCJJbnRlcm5hbEZvbGRlci5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNjcmlwdDogc3RyaW5nID0gXCJTY3JpcHQvQnVpbGQvU2NyaXB0LmpzXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNldHRpbmdzOiBzdHJpbmcgPSBcInNldHRpbmdzLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlU3R5bGVzOiBzdHJpbmcgPSBcInN0eWxlcy5jc3NcIjtcclxuXHJcbiAgICBwcml2YXRlIGdyYXBoQXV0b1ZpZXc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyBwcml2YXRlIGluY2x1ZGVBdXRvVmlld1NjcmlwdDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgI3Jlc291cmNlRm9sZGVyOiBSZXNvdXJjZUZvbGRlcjtcclxuICAgICNkb2N1bWVudDogRG9jdW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9iYXNlOiBVUkwpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5iYXNlID0gX2Jhc2U7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9iYXNlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpLnNsaWNlKC0yLCAtMSlbMF07XHJcbiAgICAgIHRoaXMuZmlsZUluZGV4ID0gX2Jhc2UudG9TdHJpbmcoKS5zcGxpdChcIi9cIikucG9wKCkgfHwgdGhpcy5maWxlSW5kZXg7XHJcblxyXG4gICAgICDGki5Qcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgIMaSLlByb2plY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5HUkFQSF9NVVRBVEVELFxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIChfZXZlbnQ6IEV2ZW50KSA9PiBQYWdlLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlVQREFURSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZXNvdXJjZUZvbGRlcigpOiBSZXNvdXJjZUZvbGRlciB7XHJcbiAgICAgIGlmICghdGhpcy4jcmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSBuZXcgUmVzb3VyY2VGb2xkZXIoXCJSZXNvdXJjZXNcIik7XHJcbiAgICAgIHJldHVybiB0aGlzLiNyZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQocHJvamVjdCwgZmFsc2UsIFwiUmV2aWV3IHByb2plY3Qgc2V0dGluZ3NcIiwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICDGknVpLkRpYWxvZy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgbG9hZChfaHRtbENvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gbmV3IMaSLlBoeXNpY3MoKTtcclxuICAgICAgY29uc3QgcGFyc2VyOiBET01QYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgIHRoaXMuI2RvY3VtZW50ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhfaHRtbENvbnRlbnQsIFwidGV4dC9odG1sXCIpO1xyXG4gICAgICBjb25zdCBoZWFkOiBIVE1MSGVhZEVsZW1lbnQgPSB0aGlzLiNkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKTtcclxuXHJcbiAgICAgIHRoaXMubG9hZEZvbnRzKGhlYWQpO1xyXG5cclxuICAgICAgY29uc3Qgc2NyaXB0czogTm9kZUxpc3RPZjxIVE1MU2NyaXB0RWxlbWVudD4gPSBoZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzY3JpcHRcIik7XHJcbiAgICAgIGZvciAobGV0IHNjcmlwdCBvZiBzY3JpcHRzKSB7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJlZGl0b3JcIikgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIkxvYWQgc2NyaXB0OiBcIiwgdXJsKTtcclxuICAgICAgICAgIGF3YWl0IMaSLlByb2plY3QubG9hZFNjcmlwdChuZXcgVVJMKHVybCwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcG9uZW50U2NyaXB0c1wiLCDGki5Qcm9qZWN0LmdldENvbXBvbmVudFNjcmlwdHMoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjcmlwdCBOYW1lc3BhY2VzXCIsIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXNvdXJjZUxpbms6IEhUTUxMaW5rRWxlbWVudCA9IGhlYWQucXVlcnlTZWxlY3RvcihcImxpbmtbdHlwZT1yZXNvdXJjZXNdXCIpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VGaWxlOiBzdHJpbmcgPSByZXNvdXJjZUxpbmsuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xyXG4gICAgICBwcm9qZWN0LmZpbGVJbnRlcm5hbCA9IHJlc291cmNlRmlsZTtcclxuICAgICAgxpIuUHJvamVjdC5iYXNlVVJMID0gdGhpcy5iYXNlO1xyXG4gICAgICBsZXQgcmVjb25zdHJ1Y3Rpb246IMaSLlJlc291cmNlcyA9IGF3YWl0IMaSLlByb2plY3QubG9hZFJlc291cmNlcyhuZXcgVVJMKHJlc291cmNlRmlsZSwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIMaSLkRlYnVnLmdyb3VwQ29sbGFwc2VkKFwiRGVzZXJpYWxpemVkXCIpO1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKHJlY29uc3RydWN0aW9uKTtcclxuICAgICAgxpIuRGVidWcuZ3JvdXBFbmQoKTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpOyAvLyByZW1vdmUgcG90ZW50aWFsIHJpZ2lkYm9kaWVzXHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc291cmNlRm9sZGVyQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlSW50ZXJuYWxGb2xkZXIsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCByZXNvdXJjZUZvbGRlcjogxpIuU2VyaWFsaXphYmxlID0gYXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZSjGki5TZXJpYWxpemVyLnBhcnNlKHJlc291cmNlRm9sZGVyQ29udGVudCkpO1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUZvbGRlciBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSByZXNvdXJjZUZvbGRlcjtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgRmFpbGVkIHRvIGxvYWQgJyR7dGhpcy5maWxlSW50ZXJuYWxGb2xkZXJ9Jy4gQSBuZXcgcmVzb3VyY2UgZm9sZGVyIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBzZXR0aW5nczogSFRNTE1ldGFFbGVtZW50ID0gaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKTtcclxuICAgICAgbGV0IHByb2plY3RTZXR0aW5nczogc3RyaW5nID0gc2V0dGluZ3M/LmdldEF0dHJpYnV0ZShcInByb2plY3RcIik7XHJcbiAgICAgIHByb2plY3RTZXR0aW5ncyA9IHByb2plY3RTZXR0aW5ncz8ucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XHJcbiAgICAgIGF3YWl0IHByb2plY3QubXV0YXRlKEpTT04ucGFyc2UocHJvamVjdFNldHRpbmdzIHx8IFwie31cIikpO1xyXG5cclxuICAgICAgbGV0IGNvbmZpZzogTGF5b3V0Q29uZmlnO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlU2V0dGluZ3MsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCBwYW5lbFNldHRpbmdzOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5wYXJzZShzZXR0aW5nc0NvbnRlbnQpO1xyXG4gICAgICAgIGNvbmZpZyA9IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQocGFuZWxTZXR0aW5ncy5sYXlvdXQpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy53YXJuKGBGYWlsZWQgdG8gbG9hZCAnJHt0aGlzLmZpbGVTZXR0aW5nc30nLiBBIG5ldyBzZXR0aW5ncyBmaWxlIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFBhZ2UubG9hZExheW91dChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IGpzb246IHN0cmluZyA9IMaSLlNlcmlhbGl6ZXIuc3RyaW5naWZ5KHNlcmlhbGl6YXRpb24pO1xyXG4gICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeSjGki5TZXJpYWxpemVyLnNlcmlhbGl6ZSh0aGlzLnJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNldHRpbmdzSlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2V0dGluZ3M6IMaSLlNlcmlhbGl6YXRpb24gPSB7fTtcclxuICAgICAgc2V0dGluZ3MubGF5b3V0ID0gUGFnZS5nZXRMYXlvdXQoKTtcclxuXHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeShzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByb2plY3RDU1MoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICBjb250ZW50ICs9IFwiaHRtbCwgYm9keSB7XFxuICBwYWRkaW5nOiAwcHg7XFxuICBtYXJnaW46IDBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG5cIjtcclxuICAgICAgY29udGVudCArPSBcImRpYWxvZyB7IFxcbiAgdGV4dC1hbGlnbjogY2VudGVyOyBcXG59XFxuXFxuXCI7XHJcbiAgICAgIGNvbnRlbnQgKz0gXCJjYW52YXMuZnVsbHNjcmVlbiB7IFxcbiAgd2lkdGg6IDEwMHZ3OyBcXG4gIGhlaWdodDogMTAwdmg7IFxcbn1cIjtcclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SFRNTChfdGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGlmICghdGhpcy4jZG9jdW1lbnQpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvamVjdEhUTUwoX3RpdGxlKTtcclxuXHJcbiAgICAgIHRoaXMuI2RvY3VtZW50LnRpdGxlID0gX3RpdGxlO1xyXG5cclxuICAgICAgbGV0IHNldHRpbmdzOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwic2V0dGluZ3NcIik7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcImF1dG92aWV3XCIsIHRoaXMuZ3JhcGhBdXRvVmlldyk7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcInByb2plY3RcIiwgdGhpcy5zZXR0aW5nc1N0cmluZ2lmeSgpKTtcclxuICAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKS5yZXBsYWNlV2l0aChzZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBsZXQgYXV0b1ZpZXdTY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gdGhpcy4jZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNjcmlwdFtuYW1lPWF1dG9WaWV3XVwiKTtcclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KSB7XHJcbiAgICAgIC8vICAgaWYgKCFhdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICAgIHRoaXMuI2RvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5nZXRBdXRvVmlld1NjcmlwdCgpKTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBlbHNlXHJcbiAgICAgIC8vICAgaWYgKGF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChhdXRvVmlld1NjcmlwdCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlIVE1MKHRoaXMuI2RvY3VtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzIHtcclxuICAgICAgbGV0IHR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBzdXBlci5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMoX211dGF0b3IpO1xyXG4gICAgICBpZiAodHlwZXMuZ3JhcGhBdXRvVmlldylcclxuICAgICAgICB0eXBlcy5ncmFwaEF1dG9WaWV3ID0gdGhpcy5nZXRHcmFwaHMoKTtcclxuICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWR1Y2VNdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5iYXNlO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUluZGV4O1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsRm9sZGVyO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZVNjcmlwdDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTZXR0aW5ncztcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTdHlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRHcmFwaHMoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IGdyYXBoczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IMaSLlByb2plY3QuZ2V0UmVzb3VyY2VzQnlUeXBlKMaSLkdyYXBoKTtcclxuICAgICAgbGV0IHJlc3VsdDogT2JqZWN0ID0ge307XHJcbiAgICAgIGZvciAobGV0IGdyYXBoIG9mIGdyYXBocykge1xyXG4gICAgICAgIHJlc3VsdFtncmFwaC5uYW1lXSA9IGdyYXBoLmlkUmVzb3VyY2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb2plY3RIVE1MKF90aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGh0bWw6IERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KF90aXRsZSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7IGNoYXJzZXQ6IFwidXRmLThcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgcmVsOiBcInN0eWxlc2hlZXRcIiwgaHJlZjogdGhpcy5maWxlU3R5bGVzIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkVkaXRvciBzZXR0aW5ncyBvZiB0aGlzIHByb2plY3RcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7XHJcbiAgICAgICAgdHlwZTogXCJzZXR0aW5nc1wiLCBhdXRvdmlldzogdGhpcy5ncmFwaEF1dG9WaWV3LCBwcm9qZWN0OiB0aGlzLnNldHRpbmdzU3RyaW5naWZ5KClcclxuICAgICAgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQWN0aXZhdGUgdGhlIGZvbGxvd2luZyBsaW5lIHRvIGluY2x1ZGUgdGhlIEZVREdFLXZlcnNpb24gb2YgT2ltby1QaHlzaWNzLiBZb3UgbWF5IHdhbnQgdG8gZG93bmxvYWQgYSBsb2NhbCBjb3B5IHRvIHdvcmsgb2ZmbGluZSBhbmQgYmUgaW5kZXBlbmRlbnQgZnJvbSBmdXR1cmUgY2hhbmdlcyFcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KGA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9PaW1vUGh5c2ljcy5qc1wiPjwvc2NyaXB0PmApKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgRlVER0UuIFlvdSBtYXkgd2FudCB0byBkb3dubG9hZCBsb2NhbCBjb3BpZXMgdG8gd29yayBvZmZsaW5lIGFuZCBiZSBpbmRlcGVuZGVudCBmcm9tIGZ1dHVyZSBjaGFuZ2VzISBEZXZlbG9wZXJzIHdvcmtpbmcgb24gRlVER0UgaXRzZWxmIG1heSB3YW50IHRvIGNyZWF0ZSBzeW1saW5rc1wiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQWlkLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTGluayBpbnRlcm5hbCByZXNvdXJjZXMuIFRoZSBlZGl0b3Igb25seSBsb2FkcyB0aGUgZmlyc3QsIGJ1dCBhdCBydW50aW1lLCBtdWx0aXBsZSBmaWxlcyBjYW4gY29udHJpYnV0ZVwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgdHlwZTogXCJyZXNvdXJjZXNcIiwgc3JjOiB0aGlzLmZpbGVJbnRlcm5hbCB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIGN1c3RvbSBzY3JpcHRzXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogdGhpcy5maWxlU2NyaXB0LCBlZGl0b3I6IFwidHJ1ZVwiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLmdldEF1dG9WaWV3U2NyaXB0KCkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBBdXRvdmlldyBzY3JpcHRcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcIkF1dG92aWV3LmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiRGlhbG9nIHNob3duIGF0IHN0YXJ0dXAgb25seVwiKSk7XHJcbiAgICAgIGxldCBkaWFsb2c6IEhUTUxFbGVtZW50ID0gY3JlYXRlVGFnKFwiZGlhbG9nXCIpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJGVURHRSBBdXRvdmlld1wiKSk7XHJcbiAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJoMVwiLCB7fSwgXCJUaXRsZSAod2lsbCBiZSByZXBsYWNlZCBieSBBdXRvdmlldylcIikpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJjbGljayB0byBzdGFydFwiKSk7XHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChkaWFsb2cpO1xyXG5cclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNhbnZhcyBmb3IgRlVER0UgdG8gcmVuZGVyIHRvXCIpKTtcclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImNhbnZhc1wiLCB7IGNsYXNzOiBcImZ1bGxzY3JlZW5cIiB9KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVUYWcoX3RhZzogc3RyaW5nLCBfYXR0cmlidXRlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9LCBfY29udGVudD86IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KF90YWcpO1xyXG4gICAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBpbiBfYXR0cmlidXRlcylcclxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgX2F0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XHJcbiAgICAgICAgaWYgKF9jb250ZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBfY29udGVudDtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5SFRNTChodG1sKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGdldEF1dG9WaWV3U2NyaXB0KCk6IEhUTUxTY3JpcHRFbGVtZW50IHtcclxuICAgIC8vICAgbGV0IGNvZGU6IHN0cmluZztcclxuICAgIC8vICAgY29kZSA9IChmdW5jdGlvbiAoX2dyYXBoSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gICAgIC8qKlxyXG4gICAgLy8gICAgICAqIEF1dG9WaWV3LVNjcmlwdFxyXG4gICAgLy8gICAgICAqIExvYWRzIGFuZCBkaXNwbGF5cyB0aGUgc2VsZWN0ZWQgZ3JhcGggYW5kIGltcGxlbWVudHMgYSBiYXNpYyBvcmJpdCBjYW1lcmFcclxuICAgIC8vICAgICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIxXHJcbiAgICAvLyAgICAgICovXHJcblxyXG4gICAgLy8gICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBpbml0KTtcclxuXHJcbiAgICAvLyAgICAgLy8gc2hvdyBkaWFsb2cgZm9yIHN0YXJ0dXBcclxuICAgIC8vICAgICBsZXQgZGlhbG9nOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8vICAgICBmdW5jdGlvbiBpbml0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgICAgIGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaWFsb2dcIik7XHJcbiAgICAvLyAgICAgICBkaWFsb2cucXVlcnlTZWxlY3RvcihcImgxXCIpLnRleHRDb250ZW50ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAvLyAgICAgICBkaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgICAgICAgIC8vIEB0cy1pZ24gcmUgdW50aWwgSFRNTERpYWxvZyBpcyBpbXBsZW1lbnRlZCBieSBhbGwgYnJvd3NlcnMgYW5kIGF2YWlsYWJsZSBpbiBkb20uZC50c1xyXG4gICAgLy8gICAgICAgICBkaWFsb2cuY2xvc2UoKTtcclxuICAgIC8vICAgICAgICAgc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB9KTtcclxuICAgIC8vICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgLy8gICAgICAgZGlhbG9nLnNob3dNb2RhbCgpO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IGludGVyYWN0aXZlIHZpZXdwb3J0XHJcbiAgICAvLyAgICAgYXN5bmMgZnVuY3Rpb24gc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gICAgICAgLy8gbG9hZCByZXNvdXJjZXMgcmVmZXJlbmNlZCBpbiB0aGUgbGluay10YWdcclxuICAgIC8vICAgICAgIGF3YWl0IEZ1ZGdlQ29yZS5Qcm9qZWN0LmxvYWRSZXNvdXJjZXNGcm9tSFRNTCgpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlByb2plY3Q6XCIsIEZ1ZGdlQ29yZS5Qcm9qZWN0LnJlc291cmNlcyk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gcGljayB0aGUgZ3JhcGggdG8gc2hvd1xyXG4gICAgLy8gICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IDzGki5HcmFwaD5GdWRnZUNvcmUuUHJvamVjdC5yZXNvdXJjZXNbX2dyYXBoSWRdO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIkdyYXBoOlwiLCBncmFwaCk7XHJcbiAgICAvLyAgICAgICBpZiAoIWdyYXBoKSB7XHJcbiAgICAvLyAgICAgICAgIGFsZXJ0KFwiTm90aGluZyB0byByZW5kZXIuIENyZWF0ZSBhIGdyYXBoIHdpdGggYXQgbGVhc3QgYSBtZXNoLCBtYXRlcmlhbCBhbmQgcHJvYmFibHkgc29tZSBsaWdodFwiKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIHRoZSB2aWV3cG9ydFxyXG4gICAgLy8gICAgICAgbGV0IGNtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gbmV3IEZ1ZGdlQ29yZS5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgIC8vICAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImNhbnZhc1wiKTtcclxuICAgIC8vICAgICAgIGxldCB2aWV3cG9ydDogxpIuVmlld3BvcnQgPSBuZXcgRnVkZ2VDb3JlLlZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5pbml0aWFsaXplKFwiSW50ZXJhY3RpdmVWaWV3cG9ydFwiLCBncmFwaCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlZpZXdwb3J0OlwiLCB2aWV3cG9ydCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gaGlkZSB0aGUgY3Vyc29yIHdoZW4gaW50ZXJhY3RpbmcsIGFsc28gc3VwcHJlc3NpbmcgcmlnaHQtY2xpY2sgbWVudVxyXG4gICAgLy8gICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jayk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24gKCk6IHZvaWQgeyBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTsgfSk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gbWFrZSB0aGUgY2FtZXJhIGludGVyYWN0aXZlIChjb21wbGV4IG1ldGhvZCBpbiBGdWRnZUFpZClcclxuICAgIC8vICAgICAgIGxldCBjYW1lcmFPcmJpdDogRnVkZ2VBaWQuQ2FtZXJhT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodmlld3BvcnQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIGF1ZGlvXHJcbiAgICAvLyAgICAgICBsZXQgY21wTGlzdGVuZXI6IMaSLkNvbXBvbmVudEF1ZGlvTGlzdGVuZXIgPSBuZXcgxpIuQ29tcG9uZW50QXVkaW9MaXN0ZW5lcigpO1xyXG4gICAgLy8gICAgICAgY21wQ2FtZXJhLm5vZGUuYWRkQ29tcG9uZW50KGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5XaXRoKGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5UbyhncmFwaCk7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiQXVkaW86XCIsIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gZHJhdyB2aWV3cG9ydCBvbmNlIGZvciBpbW1lZGlhdGUgZmVlZGJhY2tcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5SZW5kZXIucHJlcGFyZShjYW1lcmFPcmJpdCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJpbnRlcmFjdGl2ZVZpZXdwb3J0U3RhcnRlZFwiLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdmlld3BvcnQgfSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfSkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAvLyAgIGNvZGUgPSBcIihcIiArIGNvZGUgKyBgKShkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW2F1dG9WaWV3XVwiKS5nZXRBdHRyaWJ1dGUoXCJhdXRvVmlld1wiKSk7XFxuYDtcclxuICAgIC8vICAgbGV0IHNjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgLy8gICBzY3JpcHQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImF1dG9WaWV3XCIpO1xyXG4gICAgLy8gICBzY3JpcHQudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgLy8gICByZXR1cm4gc2NyaXB0O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dGluZ3NTdHJpbmdpZnkoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBwcm9qZWN0LmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICAgIGxldCBzZXR0aW5nczogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobXV0YXRvcik7XHJcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MucmVwbGFjZSgvXCIvZywgXCInXCIpO1xyXG4gICAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHJpbmdpZnlIVE1MKF9odG1sOiBEb2N1bWVudCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9IChuZXcgWE1MU2VyaWFsaXplcigpKS5zZXJpYWxpemVUb1N0cmluZyhfaHRtbCk7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8+PC9nLCBcIj5cXG48XCIpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvPCEtLUNSTEYtLT4vZywgXCJcIik7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cIj5cXG48XFwvc2NyaXB0L2csIGBcIj48L3NjcmlwdGApO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFxuKjxcXC9ib2R5Pi9nLCBcIlxcbjxcXC9ib2R5PlwiKTsgLy8gcmVtb3ZlIGxpbmUgYnJlYWtzIGFkZGVkIGJ5IHNlcmlhbGl6ZVRvU3RyaW5nIGJlZm9yZSBjbG9zaW5nIGJvZHktdGFnXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkRm9udHMoX2hlYWQ6IEhUTUxIZWFkRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAvLyBjb2xsZWN0IGFsbCBmb250cyBmcm9tIF9oZWFkIGFuZCBhZGQgdGhlbSB0byB0aGUgaGVhZCBvZiB0aGUgZWRpdG9ycyBkb2N1bWVudCBzbyB0aGF0IHRoZXkgYXJlIGF2YWlsYWJsZSBmb3IgY29tcG9uZW50IHRleHRcclxuICAgICAgY29uc3QgZm9udHM6IEhUTUxTdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICBjb25zdCBjc3NMaW5rczogTm9kZUxpc3RPZjxIVE1MTGlua0VsZW1lbnQ+ID0gX2hlYWQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyk7XHJcbiAgICAgIGNvbnN0IGNzc1N0eWxlczogTm9kZUxpc3RPZjxIVE1MU3R5bGVFbGVtZW50PiA9IF9oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJyk7XHJcbiAgICAgIGNvbnN0IGNzc1J1bGVzOiBDU1NSdWxlW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGxpbmsgb2YgY3NzTGlua3MpIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBuZXcgVVJMKGxpbmsuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSwgdGhpcy5iYXNlKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBjc3NUZXh0OiBzdHJpbmcgPSBhd2FpdCAoYXdhaXQgZmV0Y2godXJsKSkudGV4dCgpOyAvLyBUT0RPOiB1c2UgRmlsZUlPXHJcbiAgICAgICAgY3NzUnVsZXMucHVzaCguLi5nZXRSdWxlcyhjc3NUZXh0KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IHN0eWxlIG9mIGNzc1N0eWxlcylcclxuICAgICAgICBjc3NSdWxlcy5wdXNoKC4uLmdldFJ1bGVzKHN0eWxlLmlubmVySFRNTCkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgcnVsZSBvZiBjc3NSdWxlcylcclxuICAgICAgICBpZiAocnVsZSBpbnN0YW5jZW9mIENTU0ZvbnRGYWNlUnVsZSlcclxuICAgICAgICAgIGZvbnRzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUuY3NzVGV4dCkpO1xyXG5cclxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChmb250cyk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRSdWxlcyhfdGV4dDogc3RyaW5nKTogQ1NTUnVsZUxpc3Qge1xyXG4gICAgICAgIGxldCBzdHlsZVNoZWV0OiBDU1NTdHlsZVNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcclxuICAgICAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKF90ZXh0KTtcclxuICAgICAgICByZXR1cm4gc3R5bGVTaGVldC5jc3NSdWxlcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyQW5pbWF0aW9uIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBST1BFUlRZX0NPTE9SUzogc3RyaW5nW10gPSBbXHJcbiAgICAgIFwiUmVkXCIsXHJcbiAgICAgIFwiTGltZVwiLFxyXG4gICAgICBcIkJsdWVcIixcclxuICAgICAgXCJDeWFuXCIsXHJcbiAgICAgIFwiTWFnZW50YVwiLFxyXG4gICAgICBcIlllbGxvd1wiLFxyXG4gICAgICBcIlNhbG1vblwiLFxyXG4gICAgICBcIkxpZ2h0R3JlZW5cIixcclxuICAgICAgXCJDb3JuZmxvd2VyQmx1ZVwiXHJcbiAgICBdO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgdmlldzogVmlld0FuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2FuaW1hdGlvbjogxpIuQW5pbWF0aW9uLCBfZG9tOiBIVE1MRWxlbWVudCwgX3ZpZXc6IFZpZXdBbmltYXRpb24pIHtcclxuICAgICAgdGhpcy5hbmltYXRpb24gPSBfYW5pbWF0aW9uO1xyXG4gICAgICB0aGlzLmRvbSA9IF9kb207XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DTElDSywgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudmlldyA9IF92aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoX211dGF0b3I6IMaSLk11dGF0b3IsIF90aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb2xvckluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgICBsZXQga2V5U2VsZWN0ZWQ6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMudmlldy5rZXlTZWxlY3RlZDtcclxuXHJcbiAgICAgIHVwZGF0ZVJlY3Vyc2l2ZSh0aGlzLmRvbSwgX211dGF0b3IsIHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSwgX3RpbWUpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlUmVjdXJzaXZlKF9kb206IEhUTUxFbGVtZW50LCBfbXV0YXRvcjogxpIuTXV0YXRvciwgX2FuaW1hdGlvblN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU3RydWN0dXJlLCBfdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50OiDGknVpLkN1c3RvbUVsZW1lbnQgPSA8xpJ1aS5DdXN0b21FbGVtZW50PsaSdWkuQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbSwga2V5KTtcclxuICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gX211dGF0b3Jba2V5XTtcclxuICAgICAgICAgIGxldCBzdHJ1Y3R1cmVPclNlcXVlbmNlOiBPYmplY3QgPSBfYW5pbWF0aW9uU3RydWN0dXJlW2tleV07XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgJiYgc3RydWN0dXJlT3JTZXF1ZW5jZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSBzdHJ1Y3R1cmVPclNlcXVlbmNlLmZpbmRLZXkoX3RpbWUpO1xyXG4gICAgICAgICAgICBpZiAoa2V5KSB7Ly8ga2V5IGZvdW5kIGF0IGV4YWN0bHkgdGhlIGdpdmVuIHRpbWUsIHRha2UgaXRzIHZhbHVlXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBrZXkudmFsdWU7XHJcbiAgICAgICAgICAgICAgaWYgKGtleSA9PSBrZXlTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWNvbG9yLWFuaW1hdGlvbi1wcm9wZXJ0eVwiLCBnZXROZXh0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgUmVmbGVjdC5zZXQoZWxlbWVudCwgXCJhbmltYXRpb25TZXF1ZW5jZVwiLCBzdHJ1Y3R1cmVPclNlcXVlbmNlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVJlY3Vyc2l2ZShlbGVtZW50LCB2YWx1ZSwgPMaSLkFuaW1hdGlvblN0cnVjdHVyZT5zdHJ1Y3R1cmVPclNlcXVlbmNlLCBfdGltZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXROZXh0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgY29sb3I6IHN0cmluZyA9IENvbnRyb2xsZXJBbmltYXRpb24uUFJPUEVSVFlfQ09MT1JTW2NvbG9ySW5kZXhdO1xyXG4gICAgICAgIGNvbG9ySW5kZXggPSAoY29sb3JJbmRleCArIDEpICUgQ29udHJvbGxlckFuaW1hdGlvbi5QUk9QRVJUWV9DT0xPUlMubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG1vZGlmeSBvciBhZGQga2V5XHJcbiAgICBwdWJsaWMgdXBkYXRlU2VxdWVuY2UoX3RpbWU6IG51bWJlciwgX2VsZW1lbnQ6IMaSdWkuQ3VzdG9tRWxlbWVudCwgX2FkZDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSBSZWZsZWN0LmdldChfZWxlbWVudCwgXCJhbmltYXRpb25TZXF1ZW5jZVwiKTtcclxuICAgICAgaWYgKCFzZXF1ZW5jZSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGtleTogxpIuQW5pbWF0aW9uS2V5ID0gc2VxdWVuY2UuZmluZEtleShfdGltZSk7XHJcbiAgICAgIGlmICgha2V5KSB7XHJcbiAgICAgICAgaWYgKF9hZGQpIHtcclxuICAgICAgICAgIGtleSA9IG5ldyDGki5BbmltYXRpb25LZXkoX3RpbWUsIDxudW1iZXI+X2VsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICAgICAgc2VxdWVuY2UuYWRkS2V5KGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2VcclxuICAgICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCBudWxsLCA8bnVtYmVyPl9lbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IGtleSB9IH0pO1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbi5jYWxjdWxhdGVUb3RhbFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmV4dEtleShfdGltZTogbnVtYmVyLCBfZGlyZWN0aW9uOiBcImZvcndhcmRcIiB8IFwiYmFja3dhcmRcIik6IG51bWJlciB7XHJcbiAgICAgIGxldCBuZXh0S2V5OiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnNlcXVlbmNlc1xyXG4gICAgICAgIC5mbGF0TWFwKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkpXHJcbiAgICAgICAgLnNvcnQoX2RpcmVjdGlvbiA9PSBcImZvcndhcmRcIiAmJiAoKF9hLCBfYikgPT4gX2EudGltZSAtIF9iLnRpbWUpIHx8IF9kaXJlY3Rpb24gPT0gXCJiYWNrd2FyZFwiICYmICgoX2EsIF9iKSA9PiBfYi50aW1lIC0gX2EudGltZSkpXHJcbiAgICAgICAgLmZpbmQoX2tleSA9PiBfZGlyZWN0aW9uID09IFwiZm9yd2FyZFwiICYmIF9rZXkudGltZSA+IF90aW1lIHx8IF9kaXJlY3Rpb24gPT0gXCJiYWNrd2FyZFwiICYmIF9rZXkudGltZSA8IF90aW1lKTtcclxuICAgICAgaWYgKG5leHRLZXkpXHJcbiAgICAgICAgcmV0dXJuIG5leHRLZXkudGltZTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBfdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUHJvcGVydHkoX3BhdGg6IHN0cmluZ1tdLCBfbm9kZTogxpIuTm9kZSwgX3RpbWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RydWN0dXJlOiDGki5BbmltYXRpb25TZXF1ZW5jZSB8IMaSLkFuaW1hdGlvblN0cnVjdHVyZSA9IHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IF9wYXRoLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IF9wYXRoW2ldO1xyXG4gICAgICAgIGlmICghKGtleSBpbiBzdHJ1Y3R1cmUpKVxyXG4gICAgICAgICAgc3RydWN0dXJlW2tleV0gPSB7fTtcclxuICAgICAgICBzdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmVba2V5XTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gbmV3IMaSLkFuaW1hdGlvblNlcXVlbmNlKCk7XHJcbiAgICAgIHNlcXVlbmNlLmFkZEtleShuZXcgxpIuQW5pbWF0aW9uS2V5KF90aW1lLCAwKSk7XHJcbiAgICAgIHN0cnVjdHVyZVtfcGF0aFtfcGF0aC5sZW5ndGggLSAxXV0gPSBzZXF1ZW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUHJvcGVydHkoX2VsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5kb20uY29udGFpbnMoX2VsZW1lbnQpKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gX2VsZW1lbnQ7XHJcbiAgICAgIHdoaWxlIChlbGVtZW50ICE9PSB0aGlzLmRvbSkge1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICBwYXRoLnVuc2hpZnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG5cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGVsZXRlUGF0aChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdGVkU2VxdWVuY2VzKF9zZWxlY3RlZFByb3BlcnR5PzogSFRNTEVsZW1lbnQpOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdID0gW107XHJcbiAgICAgIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZSh0aGlzLmRvbSwgdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlLCBzZXF1ZW5jZXMsIF9zZWxlY3RlZFByb3BlcnR5ID09IG51bGwpO1xyXG4gICAgICByZXR1cm4gc2VxdWVuY2VzO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKF9kb206IEhUTUxFbGVtZW50LCBfYW5pbWF0aW9uU3RydWN0dXJlOiDGki5BbmltYXRpb25TdHJ1Y3R1cmUsIF9zZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdLCBfaXNTZWxlY3RlZERlc2NlbmRhbnQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfYW5pbWF0aW9uU3RydWN0dXJlKSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSDGknVpLkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb20sIGtleSk7XHJcbiAgICAgICAgICBsZXQgaXNTZWxlY3RlZERlc2NlbmRhbnQ6IGJvb2xlYW4gPSBfaXNTZWxlY3RlZERlc2NlbmRhbnQgfHwgZWxlbWVudCA9PSBfc2VsZWN0ZWRQcm9wZXJ0eTtcclxuICAgICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCBzZXF1ZW5jZTogT2JqZWN0ID0gX2FuaW1hdGlvblN0cnVjdHVyZVtrZXldO1xyXG4gICAgICAgICAgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UgJiYgaXNTZWxlY3RlZERlc2NlbmRhbnQpIHtcclxuICAgICAgICAgICAgX3NlcXVlbmNlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBjb2xvcjogZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1hbmltYXRpb24tcHJvcGVydHlcIiksXHJcbiAgICAgICAgICAgICAgZGF0YTogc2VxdWVuY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUoZWxlbWVudCwgPMaSLkFuaW1hdGlvblN0cnVjdHVyZT5fYW5pbWF0aW9uU3RydWN0dXJlW2tleV0sIF9zZXF1ZW5jZXMsIGlzU2VsZWN0ZWREZXNjZW5kYW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZVBhdGgoX3BhdGg6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgX3BhdGgubGVuZ3RoIC0gMTsgaSsrKVxyXG4gICAgICAgIHZhbHVlID0gdmFsdWVbX3BhdGhbaV1dO1xyXG4gICAgICBkZWxldGUgdmFsdWVbX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV1dO1xyXG5cclxuICAgICAgZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZSh0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZShfb2JqZWN0OiBPYmplY3QpOiBPYmplY3Qge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9vYmplY3QpIHtcclxuICAgICAgICAgIGlmIChfb2JqZWN0W2tleV0gaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKF9vYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBfb2JqZWN0W2tleV07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfb2JqZWN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBfb2JqZWN0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuQ0xJQ0s6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgaWYgKCEoX2V2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fCAhdGhpcy5hbmltYXRpb24gfHwgX2V2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSBicmVhaztcclxuXHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IF9ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCB8fCB0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkRldGFpbHMpXHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gdGhpcy5nZXRTZWxlY3RlZFNlcXVlbmNlcyh0YXJnZXQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGFyZ2V0ID09IHRoaXMuZG9tKVxyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRTZXF1ZW5jZXMoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5zZXF1ZW5jZXMgfSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdmlldydzIHN0YXRlLiBEdXJpbmcgcmVjb25zdHJ1Y3Rpb24sIHZpZXdzIHJlY2VpdmUgYSBtZXJnZWQgc3RhdGUgb2JqZWN0IHRoYXQgY29tYmluZXMgdGhlIHN0YXRlcyBvZiBib3RoIHRoZWlyIHBhbmVsIGFuZCB0aGUgdmlldyBpdHNlbGYuXHJcbiAgICogRW5zdXJlIHVuaXF1ZSBwcm9wZXJ0eSBuYW1lcyB0byBhdm9pZCBjb25mbGljdHMuXHJcbiAgICovXHJcbiAgZXhwb3J0IHR5cGUgVmlld1N0YXRlID0gxpIuU2VyaWFsaXphdGlvbjtcclxuXHJcbiAgdHlwZSBWaWV3cyA9IHsgW2lkOiBzdHJpbmddOiBWaWV3IH07XHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyBmb3IgYWxsIFtbVmlld11dcyB0byBzdXBwb3J0IGdlbmVyaWMgZnVuY3Rpb25hbGl0eVxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHZpZXdzOiBWaWV3cyA9IHt9O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudTogRWxlY3Ryb24uTWVudTtcclxuICAgICNjb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lcjtcclxuICAgICNpZDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHRoaXMuZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIC8vIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCI7XHJcbiAgICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZShcInZpZXdcIiwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuXHJcbiAgICAgIC8vX2NvbnRhaW5lci5nZXRFbGVtZW50KCkuYXBwZW5kKHRoaXMuZG9tKTsgLy9vbGRcclxuICAgICAgdGhpcy4jY29udGFpbmVyID0gX2NvbnRhaW5lcjtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuc3RhdGVSZXF1ZXN0RXZlbnQgPSB0aGlzLmdldFN0YXRlLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5vbihcImRlc3Ryb3lcIiwgKCkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBWaWV3LnZpZXdzW3RoaXMuI2lkXTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DTE9TRSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29udGV4dE1lbnVDYWxsYmFjayk7XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VUX1BST0pFQ1QsIHRoaXMuaG5kRXZlbnRDb21tb24pO1xyXG5cclxuICAgICAgdGhpcy4jaWQgPSBWaWV3LnJlZ2lzdGVyVmlld0ZvckRyYWdEcm9wKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Vmlld1NvdXJjZShfZXZlbnQ6IERyYWdFdmVudCk6IFZpZXcge1xyXG4gICAgICBpZiAoX2V2ZW50LmRhdGFUcmFuc2ZlcilcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIF9ldmVudC5kYXRhVHJhbnNmZXIuaXRlbXMpXHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlLnN0YXJ0c1dpdGgoXCJzb3VyY2V2aWV3XCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gVmlldy52aWV3c1tpdGVtLnR5cGUuc3BsaXQoXCI6XCIpLnBvcCgpXTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXJWaWV3Rm9yRHJhZ0Ryb3AoX3RoaXM6IFZpZXcpOiBudW1iZXIge1xyXG4gICAgICBWaWV3LnZpZXdzW1ZpZXcuaWRDb3VudF0gPSBfdGhpcztcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJhZyBzdGFydHMsIGFkZCBpZGVudGlmaWVyIHRvIHRoZSBldmVudCBpbiBhIHdheSB0aGF0IGFsbG93cyBkcmFnb3ZlciB0byBwcm9jZXNzIHRoZSBzb3VyZVxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfU1RBUlQsIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJTb3VyY2VWaWV3OlwiICsgX3RoaXMuI2lkLnRvU3RyaW5nKCksIFwidHlwZXNIYWNrXCIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJhZ2dpbmcgb3ZlciBhIHZpZXcsIGdldCB0aGUgb3JpZ2luYWwgc291cmNlIHZpZXcgZm9yIGRyYWdnaW5nIGFuZCBjYWxsIGhuZERyYWdPdmVyXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19PVkVSLCAoX2V2ZW50OiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuICAgICAgICBfdGhpcy5obmREcmFnT3ZlcihfZXZlbnQsIHZpZXdTb3VyY2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYWcgb3ZlciBkdXJpbmcgY2FwdHVyZSBwaGFzZSwgYWxsb3dzIHZpZXdzIHRvIHByZXZlbnQgZXZlbnQgcmVhY2hpbmcgdGhlIGFjdHVhbCB0YXJnZXRcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX09WRVIsIF9ldmVudCA9PiBfdGhpcy5obmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50LCBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSksIHRydWUpO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcm9wcGluZyBpbnRvIGEgdmlldywgZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgdmlldyBmb3IgZHJhZ2dpbmcgYW5kIGNhbGwgaG5kRHJvcFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICDGknVpLkVWRU5ULkRST1AsXHJcbiAgICAgICAgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgdmlld1NvdXJjZTogVmlldyA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpO1xyXG4gICAgICAgICAgX3RoaXMuaG5kRHJvcChfZXZlbnQsIHZpZXdTb3VyY2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFsc2UpO1xyXG5cclxuICAgICAgLy8gZHJvcCBkdXJpbmcgY2FwdHVyZSBwaGFzZSwgYWxsb3dzIHZpZXdzIG1hbmlwdWxhdGUgdGhlIGRyb3AgZGF0YSBiZWZvcmUgdGhlIGFjdHVhbCB0YXJnZXQgaXMgcmVhY2hlZFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIF9ldmVudCA9PiBfdGhpcy5obmREcm9wQ2FwdHVyZShfZXZlbnQsIFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpKSwgdHJ1ZSk7XHJcblxyXG4gICAgICByZXR1cm4gVmlldy5pZENvdW50Kys7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBpZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gYCR7dGhpcy4jaWR9XyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFRpdGxlKF90aXRsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5zZXRUaXRsZShfdGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogT2JqZWN0W10ge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BhdGNoKF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF9pbml0LmRldGFpbCA9IF9pbml0LmRldGFpbCB8fCB7fTtcclxuICAgICAgX2luaXQuZGV0YWlsLnZpZXcgPSBfaW5pdC5kZXRhaWwudmlldyB8fCB0aGlzO1xyXG4gICAgICB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBFZGl0b3JFdmVudChfdHlwZSwgX2luaXQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGF0Y2hUb1BhcmVudChfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfaW5pdC5kZXRhaWwgPSBfaW5pdC5kZXRhaWwgfHwge307XHJcbiAgICAgIF9pbml0LmJ1YmJsZXMgPSB0cnVlO1xyXG4gICAgICBfaW5pdC5kZXRhaWwudmlldyA9IF9pbml0LmRldGFpbC52aWV3IHx8IHRoaXM7XHJcbiAgICAgIHRoaXMuZG9tLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIC8vIENvbnRleHRNZW51LmFwcGVuZENvcHlQYXN0ZShtZW51KTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYENvbnRleHRNZW51OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIEV2ZW50c1xyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfc291cmNlLCBfZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudENvbW1vbiA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgLy8gICBjYXNlIEVWRU5UX0VESVRPUi5TRVRfUFJPSkVDVDpcclxuICAgICAgLy8gICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBleHRlcm5hbCByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0V4dGVybmFsIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTxEaXJlY3RvcnlFbnRyeT47XHJcblxyXG4gICAgI2V4cGFuZGVkOiBzdHJpbmdbXTsgLy8gY2FjaGUgc3RhdGUgZnJvbSBjb25zdHJ1Y3RvclxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuI2V4cGFuZGVkID0gX3N0YXRlW1wiZXhwYW5kZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFByb2plY3QoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBuZXcgVVJMKFwiLlwiLCDGki5Qcm9qZWN0LmJhc2VVUkwpLnBhdGhuYW1lO1xyXG4gICAgICBpZiAobmF2aWdhdG9yLnBsYXRmb3JtID09IFwiV2luMzJcIiB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT0gXCJXaW42NFwiKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpOyAvLyBzdHJpcCBsZWFkaW5nIHNsYXNoXHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJvb3Q6IERpcmVjdG9yeUVudHJ5ID0gRGlyZWN0b3J5RW50cnkuY3JlYXRlUm9vdChwYXRoKTtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuQ3VzdG9tVHJlZTxEaXJlY3RvcnlFbnRyeT4obmV3IENvbnRyb2xsZXJUcmVlRGlyZWN0b3J5KCksIHJvb3QpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLnRyZWUuZ2V0SXRlbXMoKVswXS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGBEcmFnICYgZHJvcCBleHRlcm5hbCBpbWFnZSwgYXVkaW9maWxlIGV0Yy4gdG8gdGhlIFwiSW50ZXJuYWxcIiwgdG8gY3JlYXRlIGEgRlVER0UtcmVzb3VyY2VgO1xyXG5cclxuICAgICAgaWYgKHRoaXMuI2V4cGFuZGVkKVxyXG4gICAgICAgIHRoaXMuZXhwYW5kKHRoaXMuI2V4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSkgIC8vIFRPRE86IGluc3BlY3QgaWYgdGhpcyBpcyBldmVyIHRoZSBjYXNlP1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgLy8gbm90aGluZyBhY3R1YWxseSBzZWxlY3RlZC4uLlxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICAgIHRoaXMuc2V0UHJvamVjdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy50cmVlLnJlZnJlc2goKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0RXhwYW5kZWQoKTogc3RyaW5nW10ge1xyXG4gICAgICBjb25zdCBleHBhbmRlZDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLnRyZWUpIHtcclxuICAgICAgICBpZiAoaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGV4cGFuZGVkLnB1c2goaXRlbS5kYXRhLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGV4cGFuZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kKF9wYXRoczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGF0aHM6IERpcmVjdG9yeUVudHJ5W11bXSA9IF9wYXRocy5tYXAoX3BhdGggPT4gbmV3IERpcmVjdG9yeUVudHJ5KFwiXCIsIF9wYXRoLCBudWxsLCBudWxsKS5nZXRQYXRoKCkpO1xyXG4gICAgICB0aGlzLnRyZWUuZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdJbnRlcm5hbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBnbHRmSW1wb3J0U2V0dGluZ3M6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0geyAvLyBUT0RPOiBzYXZlIHRoZXNlIHNldHRpbmdzP1xyXG4gICAgICBbxpIuR3JhcGgubmFtZV06IHRydWUsXHJcbiAgICAgIFvGki5BbmltYXRpb24ubmFtZV06IHRydWUsXHJcbiAgICAgIFvGki5NYXRlcmlhbC5uYW1lXTogZmFsc2UsXHJcbiAgICAgIFvGki5NZXNoLm5hbWVdOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBUT0RPOiBlaXRoZXIgcmVtb3ZlIFZpZXdJbnRlcm5hbFRhYmxlIG9yIHVuaWZ5IGNvbW1vbiBmdW5jdGlvbmFsaXR5IHdpdGggVmlld0ludGVybmFsRm9sZGVyIGludG8gVmlld0ludGVybmFsLi4uXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXNwbGF5cyB0aGUgaW50ZXJuYWwgcmVzb3VyY2VzIGFzIGEgZm9sZGVyIHRyZWUuXHJcbiAgICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjQgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdJbnRlcm5hbEZvbGRlciBleHRlbmRzIFZpZXdJbnRlcm5hbCB7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTxSZXNvdXJjZUVudHJ5PjtcclxuXHJcbiAgICAjZXhwYW5kZWQ6IHN0cmluZ1tdOyAvLyBjYWNoZSBzdGF0ZSBmcm9tIGNvbnN0cnVjdG9yXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kT3Blbik7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRVcGRhdGUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kQ3JlYXRlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuTVVUQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5obmRLZXlib2FyZEV2ZW50KTtcclxuXHJcbiAgICAgIHRoaXMuI2V4cGFuZGVkID0gX3N0YXRlW1wiZXhwYW5kZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb250cm9sbGVyKCk6IENvbnRyb2xsZXJUcmVlUmVzb3VyY2Uge1xyXG4gICAgICByZXR1cm4gPENvbnRyb2xsZXJUcmVlUmVzb3VyY2U+dGhpcy50cmVlLmNvbnRyb2xsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZXNvdXJjZUZvbGRlcigpOiBSZXNvdXJjZUZvbGRlciB7XHJcbiAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlRm9sZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSB7XHJcbiAgICAgIHJldHVybiA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmZpbHRlcihfZWxlbWVudCA9PiAhKF9lbGVtZW50IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+dGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMuZmlsdGVyKF9zb3VyY2UgPT4gIShfc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiB0aGlzIGlzIGEgcHJlcGFyYXRpb24gZm9yIHN5bmNpbmcgYSBncmFwaCB3aXRoIGl0cyBpbnN0YW5jZXMgYWZ0ZXIgc3RydWN0dXJhbCBjaGFuZ2VzXHJcbiAgICAvLyBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgIC8vICAgbGV0IHJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IDxIVE1MVGFibGVSb3dFbGVtZW50Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKChfZWxlbWVudCkgPT4gKDxIVE1MRWxlbWVudD5fZWxlbWVudCkudGFnTmFtZSA9PSBcIlRSXCIpO1xyXG4gICAgLy8gICBpZiAocm93KVxyXG4gICAgLy8gICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5TWU5DX0lOU1RBTkNFUykpLmVuYWJsZWQgPSAocm93LmdldEF0dHJpYnV0ZShcImljb25cIikgPT0gXCJHcmFwaFwiKTtcclxuICAgIC8vICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ3JlYXRlIEZvbGRlclwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9GT0xERVIpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ3JlYXRlIEdyYXBoXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiR1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWVzaFwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gpLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUVTSCwgxpIuTWVzaCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1hdGVyaWFsXCIsXHJcbiAgICAgICAgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIMaSLlNoYWRlciwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIEFuaW1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiksXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04sIMaSLkFuaW1hdGlvbiwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1QpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRGVsZXRlXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGxldCBjaG9pY2U6IENPTlRFWFRNRU5VID0gTnVtYmVyKF9pdGVtLmlkKTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG4gICAgICBsZXQgaVN1YmNsYXNzOiBudW1iZXIgPSBfaXRlbVtcImlTdWJjbGFzc1wiXTtcclxuICAgICAgaWYgKCFpU3ViY2xhc3MgJiYgKGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUVTSCB8fCBjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMKSkge1xyXG4gICAgICAgIGFsZXJ0KFwiRnVua3kgRWxlY3Ryb24tRXJyb3IuLi4gcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBmb2N1czogUmVzb3VyY2VFbnRyeSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG5cclxuICAgICAgaWYgKGNob2ljZSA9PSBDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpIHtcclxuICAgICAgICBpZiAoKChhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFtmb2N1c10pKS5sZW5ndGggPiAwKSlcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoZm9jdXMgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHJlc291cmNlOiBSZXNvdXJjZUVudHJ5O1xyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9GT0xERVI6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZUZvbGRlcigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUVTSDpcclxuICAgICAgICAgIGxldCB0eXBlTWVzaDogdHlwZW9mIMaSLk1lc2ggPSDGki5NZXNoLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgdHlwZU1lc2goKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMOlxyXG4gICAgICAgICAgbGV0IHR5cGVTaGFkZXI6IHR5cGVvZiDGki5TaGFkZXIgPSDGki5TaGFkZXIuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgxpIuTWF0ZXJpYWwodHlwZVNoYWRlci5uYW1lLCB0eXBlU2hhZGVyKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChuZXcgxpIuTm9kZShcIk5ld0dyYXBoXCIpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTjpcclxuICAgICAgICAgIGxldCB0eXBlQW5pbWF0aW9uOiB0eXBlb2YgxpIuQW5pbWF0aW9uID0gxpIuQW5pbWF0aW9uLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IHR5cGVBbmltYXRpb24oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVDpcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IMaSLlBhcnRpY2xlU3lzdGVtKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgdGhpcy50cmVlLmFkZENoaWxkcmVuKFtyZXNvdXJjZV0sIGZvY3VzKTtcclxuICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUocmVzb3VyY2UpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHdoaWxlIChpdGVtICE9IHRoaXMuZG9tICYmICEoaXRlbSBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tVHJlZUl0ZW0pKVxyXG4gICAgICAgIGl0ZW0gPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoaXRlbSA9PSB0aGlzLmRvbSkge1xyXG4gICAgICAgIGl0ZW0gPSB0aGlzLnRyZWUuZmluZFZpc2libGUodGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgICAgaXRlbS5mb2N1cygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgxpJ1aS5DdXN0b21UcmVlSXRlbSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSB0cnVlKTtcclxuXHJcbiAgICAgIGlmICghKGl0ZW0uZGF0YSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSkge1xyXG4gICAgICAgIGNvbnN0IGNyZWF0ZU9wdGlvbnM6IENPTlRFWFRNRU5VW10gPSBbQ09OVEVYVE1FTlUuQ1JFQVRFX0ZPTERFUiwgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBILCBDT05URVhUTUVOVS5DUkVBVEVfTUVTSCwgQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCBDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUXTtcclxuICAgICAgICBjcmVhdGVPcHRpb25zLmZvckVhY2goX2lkID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhfaWQpKS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtLmRhdGEgPT0gdGhpcy5yZXNvdXJjZUZvbGRlcilcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSkudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGlmIChzb3VyY2VzLnNvbWUoX3NvdXJjZSA9PiBbTUlNRS5BVURJTywgTUlNRS5JTUFHRSwgTUlNRS5NRVNILCBNSU1FLkdMVEZdLmluY2x1ZGVzKF9zb3VyY2UuZ2V0TWltZVR5cGUoKSkpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMgfHwgX2V2ZW50LnRhcmdldCA9PSB0aGlzLnRyZWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCByZXNvdXJjZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSBbXTtcclxuICAgICAgZm9yIChjb25zdCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgxpIuTm9kZSkge1xyXG4gICAgICAgICAgcmVzb3VyY2VzLnB1c2goYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgoc291cmNlLCB0cnVlKSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoc291cmNlLmdldE1pbWVUeXBlKCkpIHtcclxuICAgICAgICAgIGNhc2UgTUlNRS5BVURJTzpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2gobmV3IMaSLkF1ZGlvKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuSU1BR0U6XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKG5ldyDGki5UZXh0dXJlSW1hZ2Uoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgTUlNRS5NRVNIOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChhd2FpdCBuZXcgxpIuTWVzaE9CSigpLmxvYWQoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgTUlNRS5HTFRGOlxyXG4gICAgICAgICAgICBsZXQgbG9hZGVyOiDGki5HTFRGTG9hZGVyID0gYXdhaXQgxpIuR0xURkxvYWRlci5MT0FEKHNvdXJjZS5wYXRoUmVsYXRpdmUpO1xyXG4gICAgICAgICAgICBsZXQgbG9hZDogYm9vbGVhbiA9IGF3YWl0IMaSdWkuRGlhbG9nLnByb21wdChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzLCBmYWxzZSwgYFNlbGVjdCB3aGljaCByZXNvdXJjZXMgdG8gaW1wb3J0IGZyb20gJyR7bG9hZGVyLm5hbWV9J2AsIFwiQWRqdXN0IHNldHRpbmdzIGFuZCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG4gICAgICAgICAgICBpZiAoIWxvYWQpXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB0eXBlIGluIFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3MpIGlmIChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzW3R5cGVdKVxyXG4gICAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKC4uLmF3YWl0IGxvYWRlci5sb2FkUmVzb3VyY2VzPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+KMaSW3R5cGVdKSk7XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gcmVzb3VyY2VzO1xyXG4gICAgICB0aGlzLnRyZWUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoxpJ1aS5FVkVOVC5EUk9QLCB7IGJ1YmJsZXM6IGZhbHNlIH0pKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSlcclxuICAgICAgICAvLyAvL0B0cy1pZ25vcmVcclxuICAgICAgICBfdmlld1NvdXJjZS5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGRldGFpbDogeyB2aWV3OiB0aGlzIC8qICwgZGF0YTogX3ZpZXdTb3VyY2UuZ3JhcGggKi8gfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleWJvYXJkRXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoIWlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kT3BlbiA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuQ3VzdG9tVHJlZTxSZXNvdXJjZUVudHJ5PihuZXcgQ29udHJvbGxlclRyZWVSZXNvdXJjZSgpLCB0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayB0byBjcmVhdGUgbmV3IHJlc291cmNlLlxcbuKXjyBTZWxlY3Qgb3IgZHJhZyByZXNvdXJjZS5cIjtcclxuICAgICAgdGhpcy50cmVlLnRpdGxlID0gXCLil48gU2VsZWN0IHRvIGVkaXQgaW4gXFxcIlByb3BlcnRpZXNcXFwiXFxu4pePIERyYWcgdG8gXFxcIlByb3BlcnRpZXNcXFwiIG9yIFxcXCJDb21wb25lbnRzXFxcIiB0byB1c2UgaWYgYXBwbGljYWJsZS5cIjtcclxuICAgICAgdGhpcy5obmRDcmVhdGUoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZCh0aGlzLiNleHBhbmRlZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ3JlYXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBhZGQgbmV3IHJlc291cmNlcyB0byByb290IGZvbGRlclxyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIMaSLlByb2plY3QucmVzb3VyY2VzKSB7XHJcbiAgICAgICAgbGV0IHJlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSA9IMaSLlByb2plY3QucmVzb3VyY2VzW2lkUmVzb3VyY2VdO1xyXG4gICAgICAgIGlmICghdGhpcy5yZXNvdXJjZUZvbGRlci5jb250YWlucyhyZXNvdXJjZSkpXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuYWRkQ2hpbGRyZW4oW3Jlc291cmNlXSwgdGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5obmRVcGRhdGUoKTtcclxuICAgICAgbGV0IHJvb3RJdGVtOiDGknVpLkN1c3RvbVRyZWVJdGVtPFJlc291cmNlRW50cnk+ID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICBpZiAoIXJvb3RJdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgIHJvb3RJdGVtLmV4cGFuZCh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHJlbW92ZSByZXNvdXJjZXMgdGhhdCBhcmUgbm8gbG9uZ2VyIHJlZ2lzdGVyZWQgaW4gdGhlIHByb2plY3RcclxuICAgICAgZm9yIChjb25zdCBkZXNjZW5kYW50IG9mIHRoaXMucmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgaWYgKCEoZGVzY2VuZGFudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSAmJiAhxpIuUHJvamVjdC5yZXNvdXJjZXNbZGVzY2VuZGFudC5pZFJlc291cmNlXSlcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZW1vdmUoZGVzY2VuZGFudCk7XHJcblxyXG4gICAgICB0aGlzLmhuZFVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFVwZGF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy50cmVlLnJlZnJlc2goKTtcclxuICAgICAgT2JqZWN0LnZhbHVlcyjGki5Qcm9qZWN0LnJlc291cmNlcylcclxuICAgICAgICAuZmlsdGVyKF9yZXNvdXJjZSA9PiAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X3Jlc291cmNlKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKVxyXG4gICAgICAgIC5tYXAoX3Jlc291cmNlID0+IHRoaXMuY29udHJvbGxlci5nZXRQYXRoKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgLmZvckVhY2goX3BhdGggPT4gdGhpcy50cmVlLnNob3coX3BhdGgpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogUmVzb3VyY2VFbnRyeVtdW10gPSBfcGF0aHNcclxuICAgICAgICAubWFwKF9wYXRoID0+IF9wYXRoXHJcbiAgICAgICAgICAuc3BsaXQoXCIvXCIpXHJcbiAgICAgICAgICAuc2xpY2UoMSkgLy8gcmVtb3ZlIHJvb3QgYXMgaXQgaXMgYWRkZWQgYXMgZmlyc3QgZWxlbWVudCBpbiByZWR1Y2VcclxuICAgICAgICAgIC5yZWR1Y2U8UmVzb3VyY2VGb2xkZXJbXT4oKF9wYXRoLCBfaW5kZXgpID0+IFsuLi5fcGF0aCwgX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV0/LmVudHJpZXM/LltfaW5kZXhdXSwgW3RoaXMucmVzb3VyY2VGb2xkZXJdKSlcclxuICAgICAgICAuZmlsdGVyKF9wYXRoID0+ICFfcGF0aC5zb21lKF9lbnRyeSA9PiAhX2VudHJ5KSk7IC8vIGZpbHRlciBvdXQgaW52YWxpZCBwYXRoc1xyXG4gICAgICB0aGlzLnRyZWUuZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKHRoaXMuZ2V0UGF0aChpdGVtLmRhdGEpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZXhwYW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQYXRoKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuZ2V0UGF0aChfZW50cnkpLm1hcChfZW50cnkgPT4gX2VudHJ5LnJlc291cmNlUGFyZW50Py5lbnRyaWVzLmluZGV4T2YoX2VudHJ5KSkuam9pbihcIi9cIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9WaWV3LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0V4dGVybmFsLnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGludGVyZmFjZSBEcmFnRHJvcEZpbHRlciB7XHJcbiAgICBvbktleUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIG9uVHlwZUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIGZyb21WaWV3cz86ICh0eXBlb2YgVmlldylbXTtcclxuICAgIG9uVHlwZT86IEZ1bmN0aW9uO1xyXG4gICAgb2ZUeXBlPzogRnVuY3Rpb247XHJcbiAgICBkcm9wRWZmZWN0OiBcImNvcHlcIiB8IFwibGlua1wiIHwgXCJtb3ZlXCIgfCBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGxldCBmaWx0ZXI6IHsgW25hbWU6IHN0cmluZ106IERyYWdEcm9wRmlsdGVyIH0gPSB7XHJcbiAgICBVcmxPblRleHR1cmU6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJUZXh0dXJlSW1hZ2VcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uTWVzaE9CSjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hPQkpcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uQXVkaW86IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJBdWRpb1wiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVXJsT25NZXNoR0xURjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hHTFRGXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH1cclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlckRldGFpbCBleHRlbmRzIMaSVWkuQ29udHJvbGxlciB7XHJcbiAgICAjdmlldzogVmlldztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX211dGFibGU6IMaSLk11dGFibGUsIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX3ZpZXc6IFZpZXcpIHtcclxuICAgICAgc3VwZXIoX211dGFibGUsIF9kb21FbGVtZW50KTtcclxuICAgICAgdGhpcy4jdmlldyA9IF92aWV3O1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5zZXJ0ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgQ29udHJvbGxlckRldGFpbFwiKTtcclxuICAgICAgY29uc29sZS5sb2coX2V2ZW50LmRldGFpbCk7XHJcbiAgICAgIGxldCBtdXRhYmxlOiDGki5NdXRhYmxlID0gdGhpcy5tdXRhYmxlW19ldmVudC5kZXRhaWwuZ2V0QXR0cmlidXRlKFwia2V5XCIpXTtcclxuICAgICAgY29uc29sZS5sb2cobXV0YWJsZS50eXBlKTtcclxuICAgICAgaWYgKG11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgbXV0YWJsZS5wdXNoKG5ldyBtdXRhYmxlLnR5cGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KMaSVWkuRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHVybCBvbiB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgY2hlY2tNaW1lVHlwZShNSU1FLklNQUdFKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIG1lc2hvYmpcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoT0JKLCBjaGVja01pbWVUeXBlKE1JTUUuTUVTSCkpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBjaGVja01pbWVUeXBlKE1JTUUuQVVESU8pKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gbWVzaGdsdGZcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoR0xURiwgY2hlY2tNaW1lVHlwZShNSU1FLkdMVEYpKSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHsgbXV0YWJsZSwga2V5IH0gPSB0aGlzLmdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50KTtcclxuICAgICAgbGV0IG1ldGFUeXBlczogxpIuTWV0YUF0dHJpYnV0ZVR5cGVzID0gKDzGki5NdXRhYmxlPm11dGFibGUpLmdldE1ldGFBdHRyaWJ1dGVUeXBlcz8uKCkgPz8ge307XHJcbiAgICAgIGxldCBtZXRhVHlwZTogRnVuY3Rpb24gPSBtZXRhVHlwZXNba2V5XTtcclxuICAgICAgLy8gY29uc29sZS5sb2coa2V5LCBtZXRhVHlwZXMsIG1ldGFUeXBlKTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBpZiAoIW1ldGFUeXBlIHx8IChtZXRhVHlwZSAmJiB0eXBlb2YgbWV0YVR5cGUgPT0gXCJmdW5jdGlvblwiICYmICEoc291cmNlc1swXSBpbnN0YW5jZW9mIG1ldGFUeXBlKSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja01pbWVUeXBlKF9taW1lOiBNSU1FKTogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgICByZXR1cm4gKHNvdXJjZXMubGVuZ3RoID09IDEgJiYgc291cmNlc1swXS5nZXRNaW1lVHlwZSgpID09IF9taW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc2V0RXh0ZXJuYWxMaW5rOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLnZhbHVlID0gc291cmNlc1swXS5wYXRoUmVsYXRpdmU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGVPbklucHV0KF9ldmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaE9CSiwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBzZXRFeHRlcm5hbExpbmspKSByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgbGV0IHsgbXV0YWJsZSwga2V5IH0gPSB0aGlzLmdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50KTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBtdXRhYmxlW2tleV0gPSBzb3VyY2VzWzBdO1xyXG5cclxuICAgICAgdGhpcy4jdmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGZpbHRlckRyYWdEcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfZmlsdGVyOiBEcmFnRHJvcEZpbHRlciwgX2NhbGxiYWNrOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKCkgPT4gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgdHlwZUVsZW1lbnQ6IHN0cmluZyA9IHRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IHR5cGVDb21wb25lbnQ6IHN0cmluZyA9IHRoaXMuZ2V0QW5jZXN0b3JXaXRoVHlwZSh0YXJnZXQpLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcblxyXG4gICAgICBpZiAoX2ZpbHRlci5vbktleUF0dHJpYnV0ZSAmJiB0eXBlRWxlbWVudCAhPSBfZmlsdGVyLm9uS2V5QXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSAmJiB0eXBlQ29tcG9uZW50ICE9IF9maWx0ZXIub25UeXBlQXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZSAmJiAhKHRoaXMubXV0YWJsZSBpbnN0YW5jZW9mIF9maWx0ZXIub25UeXBlKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuXHJcbiAgICAgIGlmICghX2ZpbHRlci5mcm9tVmlld3M/LmZpbmQoKF92aWV3KSA9PiB2aWV3U291cmNlIGluc3RhbmNlb2YgX3ZpZXcpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IHZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgIGlmICghKHNvdXJjZXNbMF0gaW5zdGFuY2VvZiBfZmlsdGVyLm9mVHlwZSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgaWYgKCFfY2FsbGJhY2soc291cmNlcykpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEFuY2VzdG9yV2l0aFR5cGUoX3RhcmdldDogRXZlbnRUYXJnZXQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fdGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgaWYgKHR5cGUpXHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50OiBFdmVudCk6IHsgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjsga2V5OiBzdHJpbmcgfSB7XHJcbiAgICAgIGxldCBwYXRoOiDGki5HZW5lcmFsW10gPSBfZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcbiAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIHBhdGguaW5kZXhPZih0aGlzLmRvbUVsZW1lbnQpKTtcclxuICAgICAgcGF0aCA9IHBhdGguZmlsdGVyKF9lbGVtZW50ID0+IF9lbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgKF9lbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikpKTtcclxuICAgICAgcGF0aC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICBsZXQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IHRoaXMubXV0YWJsZTtcclxuICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gcGF0aC5tYXAoX2VsZW1lbnQgPT4gX2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGtleXMubGVuZ3RoIC0gMTsgaSsrKVxyXG4gICAgICAgIG11dGFibGUgPSBtdXRhYmxlW2tleXNbaV1dO1xyXG5cclxuICAgICAgcmV0dXJuIHsgbXV0YWJsZSwga2V5OiBrZXlzW2tleXMubGVuZ3RoIC0gMV0gfTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVJlc291cmNlIGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVJlc291cmNlLmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IHRydWUgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIlR5cGVcIiwga2V5OiBcInR5cGVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiSWRcIiwga2V5OiBcImlkUmVzb3VyY2VcIiwgc29ydGFibGU6IGZhbHNlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIHJldHVybiBoZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNrIHJlbmFtZVwiLCBfb2JqZWN0Lm5hbWUsIF9uZXcpO1xyXG4gICAgICBsZXQgcmVuYW1lOiBib29sZWFuID0gX29iamVjdC5uYW1lICE9IF9uZXc7XHJcbiAgICAgIGlmIChyZW5hbWUpIHtcclxuICAgICAgICBfb2JqZWN0Lm5hbWUgPSBfbmV3OyAvLyBtdXN0IHJlbmFtZSBiZWZvcmUgbG9hZGluZywgVE9ETzogV0hZIGlzIGl0IHRoYXQgdGhlIHJlbmFtaW5nIGlzIHN1cHBvc2VkIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGFjdHVhbCB0YWJsZT8/P1xyXG4gICAgICAgIGF3YWl0ICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD5fb2JqZWN0KS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+IHtcclxuICAgICAgY29uc29sZS5sb2coX2ZvY3Vzc2VkLCB0aGlzLnNlbGVjdGlvbik7XHJcbiAgICAgIC8vIHRoaXMuc2VsZWN0aW9uID0gW107XHJcbiAgICAgIGxldCBleHBlbmRhYmxlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IHRoaXMuc2VsZWN0aW9uLmNvbmNhdChbXSk7IC8vX2ZvY3Vzc2VkKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIHNlcmlhbGl6YXRpb25zKVxyXG4gICAgICAgIHNlcmlhbGl6YXRpb25TdHJpbmdzLnNldCjGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXSwgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbnNbaWRSZXNvdXJjZV0pKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgZXhwZW5kYWJsZXMpIHtcclxuICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHNlcmlhbGl6YXRpb25TdHJpbmdzLmtleXMoKSlcclxuICAgICAgICAgIGlmIChyZXNvdXJjZS5pZFJlc291cmNlICE9IGV4cGVuZGFibGUuaWRSZXNvdXJjZSlcclxuICAgICAgICAgICAgaWYgKHNlcmlhbGl6YXRpb25TdHJpbmdzLmdldChyZXNvdXJjZSkuaW5kZXhPZihleHBlbmRhYmxlLmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0ucHVzaChyZXNvdXJjZS5uYW1lICsgXCIgXCIgKyByZXNvdXJjZS50eXBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGF3YWl0IG9wZW5EaWFsb2coKSkge1xyXG4gICAgICAgIGxldCBkZWxldGVkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgdXNhZ2UgaW4gdXNhZ2VzKVxyXG4gICAgICAgICAgaWYgKHVzYWdlc1t1c2FnZV0ubGVuZ3RoID09IDApIHsgLy8gZGVsZXRlIG9ubHkgdW51c2VkXHJcbiAgICAgICAgICAgIGRlbGV0ZWQucHVzaCjGki5Qcm9qZWN0LnJlc291cmNlc1t1c2FnZV0pO1xyXG4gICAgICAgICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIoxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXN5bmMgZnVuY3Rpb24gb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdCh1c2FnZXMsIHRydWUsIFwiUmV2aWV3IHJlZmVyZW5jZXMsIGRlbGV0ZSBkZXBlbmRlbmQgcmVzb3VyY2VzIGZpcnN0IGlmIGFwcGxpY2FibGVcIiwgXCJUbyBkZWxldGUgdW51c2VkIHJlc291cmNlcywgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHNvcnQoX2RhdGE6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfYjogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBfZGlyZWN0aW9uICogKF9hW19rZXldID09IF9iW19rZXldID8gMCA6IChfYVtfa2V5XSA+IF9iW19rZXldID8gMSA6IC0xKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9kYXRhLnNvcnQoY29tcGFyZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFNjcmlwdEluZm8ge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBuYW1lc3BhY2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdXBlckNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2NyaXB0OiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ29tcG9uZW50U2NyaXB0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9zY3JpcHQ6IEZ1bmN0aW9uLCBfbmFtZXNwYWNlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5zY3JpcHQgPSBfc2NyaXB0O1xyXG4gICAgICB0aGlzLm5hbWUgPSBfc2NyaXB0Lm5hbWU7XHJcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gX25hbWVzcGFjZTtcclxuICAgICAgbGV0IGNoYWluOiBGdW5jdGlvbiA9IF9zY3JpcHRbXCJfX3Byb3RvX19cIl07XHJcbiAgICAgIHRoaXMuc3VwZXJDbGFzcyA9IGNoYWluLm5hbWU7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50ID0gdGhpcy5pc0NvbXBvbmVudCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFwiKTtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50U2NyaXB0ID0gdGhpcy5pc0NvbXBvbmVudFNjcmlwdCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFNjcmlwdFwiKTtcclxuICAgICAgICBjaGFpbiA9IGNoYWluW1wiX19wcm90b19fXCJdO1xyXG4gICAgICB9IHdoaWxlIChjaGFpbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRhYmxlU2NyaXB0IGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8U2NyaXB0SW5mbz4ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhZDogxpJ1aS5UQUJMRVtdID0gQ29udHJvbGxlclRhYmxlU2NyaXB0LmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJTdXBlclwiLCBrZXk6IFwic3VwZXJDbGFzc1wiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJOYW1lc3BhY2VcIiwga2V5OiBcIm5hbWVzcGFjZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlU2NyaXB0LmhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExhYmVsKF9vYmplY3Q6IFNjcmlwdEluZm8pOiBzdHJpbmcgeyByZXR1cm4gXCJcIjsgfVxyXG4gICAgcHVibGljIGFzeW5jIHJlbmFtZShfb2JqZWN0OiBTY3JpcHRJbmZvLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZGVsZXRlKF9mb2N1c3NlZDogU2NyaXB0SW5mb1tdKTogUHJvbWlzZTxTY3JpcHRJbmZvW10+IHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHB1YmxpYyBjb3B5KF9vcmlnaW5hbHM6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiBTY3JpcHRJbmZvW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IFNjcmlwdEluZm8sIF9iOiBTY3JpcHRJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcblxyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlRGlyZWN0b3J5IGV4dGVuZHMgxpJVaS5DdXN0b21UcmVlQ29udHJvbGxlcjxEaXJlY3RvcnlFbnRyeT4ge1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfZW50cnkubmFtZTtcclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZW50cnk6IERpcmVjdG9yeUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IHJlbmFtZSBmaWxlICcke19lbnRyeS5uYW1lfScgdG8gJyR7X2VsZW1lbnQudmFsdWV9Jy5gLCBfZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX29iamVjdDogRGlyZWN0b3J5RW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5LmlzRGlyZWN0b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiBfZW50cnkuZ2V0RGlyZWN0b3J5Q29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHMoX2E6IERpcmVjdG9yeUVudHJ5LCBfYjogRGlyZWN0b3J5RW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hLnBhdGhSZWxhdGl2ZSA9PSBfYi5wYXRoUmVsYXRpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IERpcmVjdG9yeUVudHJ5W10pOiBQcm9taXNlPERpcmVjdG9yeUVudHJ5W10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6IERpcmVjdG9yeUVudHJ5W10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNzZWQ7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuc2VsZWN0aW9uIHx8IGV4cGVuZCkge1xyXG4gICAgICAgIGVudHJ5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGRlbGV0ZWQucHVzaChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2VudHJpZXM6IERpcmVjdG9yeUVudHJ5W10sIF90YXJnZXQ6IERpcmVjdG9yeUVudHJ5KTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCBtb3ZlOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9lbnRyaWVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIF90YXJnZXQuYWRkRW50cnkoZW50cnkpO1xyXG4gICAgICAgICAgZW50cnkuZGVsZXRlKCk7XHJcbiAgICAgICAgICBtb3ZlLnB1c2goZW50cnkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IGFkZCBmaWxlICcke2VudHJ5Lm5hbWV9JyB0byAnJHtfdGFyZ2V0Lm5hbWV9Jy5gLCBfZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiBEaXJlY3RvcnlFbnRyeVtdKTogUHJvbWlzZTxEaXJlY3RvcnlFbnRyeVtdPiB7XHJcbiAgICAgIC8vIGNvcGllcyBjYW4gbm90IGJlIGNyZWF0ZWQgYXQgdGhpcyBwb2ludCwgYnV0IHdoZW4gY29weWluZyB0aGUgZmlsZXMuIFNlZSBhZGRDaGlsZHJlblxyXG4gICAgICByZXR1cm4gX29yaWdpbmFscztcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlSGllcmFyY2h5IGV4dGVuZHMgxpJVaS5DdXN0b21UcmVlQ29udHJvbGxlcjzGki5Ob2RlPiB7XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX29iamVjdDogxpIuTm9kZSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpZiAoX29iamVjdCBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShfb2JqZWN0LmlkU291cmNlKS50aGVuKF9ncmFwaCA9PiB7XHJcbiAgICAgICAgICBfb2JqZWN0Lm5hbWUgPSBfZ3JhcGgubmFtZTtcclxuICAgICAgICAgIGlucHV0LnZhbHVlID0gX2dyYXBoLm5hbWU7XHJcbiAgICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpbnB1dC5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gX29iamVjdC5uYW1lO1xyXG4gICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX25vZGU6IMaSLk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgYXR0cmlidXRlczogc3RyaW5nW10gPSBbX25vZGUuaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiXTtcclxuICAgICAgaWYgKF9ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJHcmFwaEluc3RhbmNlXCIpO1xyXG4gICAgICByZXR1cm4gYXR0cmlidXRlcy5qb2luKFwiIFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX25vZGU6IMaSLk5vZGUsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9ub2RlLm5hbWUgIT0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgIGlmIChyZW5hbWUpIHtcclxuICAgICAgICBsZXQgaW5zdGFuY2U6IMaSLkdyYXBoSW5zdGFuY2UgPSBpbkdyYXBoSW5zdGFuY2UoX25vZGUpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIGBBIDxpPmdyYXBoIGluc3RhbmNlPC9pPiBnZXRzIHJlY3JlYXRlZCBmcm9tIHRoZSBvcmlnaW5hbCBncmFwaGAsIGBFZGl0IHRoZSBncmFwaCBcIiR7aW5zdGFuY2UubmFtZX1cIiB0byByZW5hbWUgbm9kZXMsIHNhdmUgYW5kIHJlbG9hZCB0aGUgcHJvamVjdDxicj5QcmVzcyBPSyB0byBjb250aW51ZWAsIFwiT0tcIiwgXCJcIik7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9ub2RlLm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgICBhd2FpdCAoPMaSLkdyYXBoR0xURj5fbm9kZSkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9ub2RlOiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfbm9kZS5nZXRDaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9ub2RlOiDGki5Ob2RlKTogxpIuTm9kZVtdIHtcclxuICAgICAgcmV0dXJuIF9ub2RlLmdldENoaWxkcmVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IMaSLk5vZGVbXSk6IFByb21pc2U8xpIuTm9kZVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6IMaSLk5vZGVbXSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA+IDAgPyB0aGlzLnNlbGVjdGlvbiA6IF9mb2N1c3NlZDtcclxuXHJcbiAgICAgIGZvciAobGV0IG5vZGUgb2YgZXhwZW5kKSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlOiDGki5HcmFwaEluc3RhbmNlID0gaW5HcmFwaEluc3RhbmNlKG5vZGUpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIGBBIDxpPmdyYXBoIGluc3RhbmNlPC9pPiBnZXRzIHJlY3JlYXRlZCBmcm9tIHRoZSBvcmlnaW5hbCBncmFwaGAsIGBFZGl0IHRoZSBncmFwaCBcIiR7aW5zdGFuY2UubmFtZX1cIiB0byBkZWxldGUgXCIke25vZGUubmFtZX1cIiwgc2F2ZSBhbmQgcmVsb2FkIHRoZSBwcm9qZWN0PGJyPlByZXNzIE9LIHRvIGNvbnRpbnVlYCwgXCJPS1wiLCBcIlwiKTtcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBleHBlbmQpXHJcbiAgICAgICAgaWYgKG5vZGUuZ2V0UGFyZW50KCkpIHtcclxuICAgICAgICAgIG5vZGUuZ2V0UGFyZW50KCkucmVtb3ZlQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2NoaWxkcmVuOiDGki5Ob2RlW10sIF90YXJnZXQ6IMaSLk5vZGUsIF9pbmRleD86IG51bWJlcik6IMaSLk5vZGVbXSB7XHJcbiAgICAgIC8vIGRpc2FsbG93IGRyb3AgZm9yIHNvdXJjZXMgYmVpbmcgYW5jZXN0b3IgdG8gdGFyZ2V0XHJcbiAgICAgIGxldCBtb3ZlOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgX2NoaWxkcmVuKVxyXG4gICAgICAgIGlmICghX3RhcmdldC5pc0Rlc2NlbmRhbnRPZihjaGlsZCkpXHJcbiAgICAgICAgICBtb3ZlLnB1c2goY2hpbGQpO1xyXG5cclxuICAgICAgbW92ZS5mb3JFYWNoKChfbm9kZSwgX2lNb3ZlKSA9PiBfdGFyZ2V0LmFkZENoaWxkKF9ub2RlLCBfaW5kZXggPT0gdW5kZWZpbmVkID8gX2luZGV4IDogX2luZGV4ICsgX2lNb3ZlKSk7XHJcbiAgICAgIC8vIGZvciAobGV0IG5vZGUgb2YgbW92ZSlcclxuICAgICAgLy8gICBfdGFyZ2V0LmFkZENoaWxkKG5vZGUsIF9pVGFyZ2V0KTtcclxuXHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IMaSLk5vZGVbXSk6IFByb21pc2U8xpIuTm9kZVtdPiB7XHJcbiAgICAgIC8vIHRyeSB0byBjcmVhdGUgY29waWVzIGFuZCByZXR1cm4gdGhlbSBmb3IgcGFzdGUgb3BlcmF0aW9uXHJcbiAgICAgIGxldCBjb3BpZXM6IMaSLk5vZGVbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBvcmlnaW5hbCBvZiBfb3JpZ2luYWxzKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24gPSDGki5TZXJpYWxpemVyLnNlcmlhbGl6ZShvcmlnaW5hbCk7XHJcbiAgICAgICAgbGV0IGNvcHk6IMaSLk5vZGUgPSA8xpIuTm9kZT5hd2FpdCDGki5TZXJpYWxpemVyLmRlc2VyaWFsaXplKHNlcmlhbGl6YXRpb24pO1xyXG4gICAgICAgIGNvcGllcy5wdXNoKGNvcHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb3BpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiDGki5Ob2RlW10sIF90YXJnZXQ6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKF9zb3VyY2VzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBfc291cmNlcy5ldmVyeShfc291cmNlID0+IGNoZWNrR3JhcGhEcm9wKF9zb3VyY2UsIF90YXJnZXQpKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrR3JhcGhEcm9wKF9zb3VyY2U6IMaSLk5vZGUsIF90YXJnZXQ6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgaWRTb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IG5vZGUgb2YgX3NvdXJjZS5nZXRJdGVyYXRvcigpKVxyXG4gICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgICAgICBpZFNvdXJjZXMucHVzaChub2RlLmlkU291cmNlKTtcclxuICAgICAgICAgIGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgICAgaWRTb3VyY2VzLnB1c2gobm9kZS5pZFJlc291cmNlKTtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgaWYgKF90YXJnZXQgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgICAgaWYgKGlkU291cmNlcy5pbmRleE9mKF90YXJnZXQuaWRSZXNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoX3RhcmdldCBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgICAgIGlmIChpZFNvdXJjZXMuaW5kZXhPZihfdGFyZ2V0LmlkU291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICBfdGFyZ2V0ID0gX3RhcmdldC5nZXRQYXJlbnQoKTtcclxuICAgICAgICB9IHdoaWxlIChfdGFyZ2V0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgY29uc3QgZW51bSBJRCB7XHJcbiAgICBOQU1FID0gXCJuYW1lXCIsXHJcbiAgICBGVU5DVElPTiA9IFwiZnVuY3Rpb25cIixcclxuICAgIFZBTFVFID0gXCJ2YWx1ZVwiLFxyXG4gICAgVFJBTlNGT1JNQVRJT04gPSBcInRyYW5zZm9ybWF0aW9uXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgxpJ1aS5DdXN0b21UcmVlQ29udHJvbGxlcjzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiB7XHJcbiAgICBwdWJsaWMgY2hpbGRUb1BhcmVudDogTWFwPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3UGFydGljbGVTeXN0ZW07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtLCBfdmlldzogVmlld1BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLnZpZXcgPSBfdmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBsZXQgcGFyZW50RGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIcaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpICYmICHGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBsZXQgc3Bhbk5hbWU6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5OYW1lLmlubmVyVGV4dCA9IHBhcmVudERhdGEgPyBrZXkgOiDGki5QYXJ0aWNsZVN5c3RlbS5uYW1lO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbk5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyZW50RGF0YSAmJiBwYXJlbnREYXRhID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIC8vIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2tleV07XHJcbiAgICAgICAgaW5wdXQuaWQgPSBJRC5OQU1FO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpIHtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgICBzZWxlY3QuaWQgPSBJRC5GVU5DVElPTjtcclxuICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgT2JqZWN0LnZhbHVlcyjGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04pKSB7XHJcbiAgICAgICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBlbnRyeS50ZXh0ID0gbmFtZTtcclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IF9kYXRhLmZ1bmN0aW9uO1xyXG4gICAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgICAvLyBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpbnB1dC5pZCA9IElELlZBTFVFO1xyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvZGUoX2RhdGEpKSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEuY29kZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibGlzdFwiLCBcInZhcmlhYmxlc1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIH0gZWxzZSBpZiAoxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgIHNlbGVjdC5pZCA9IElELlRSQU5TRk9STUFUSU9OO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBbxpIuTWF0cml4NHg0LnByb3RvdHlwZS50cmFuc2xhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5yb3RhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5zY2FsZS5uYW1lXSkge1xyXG4gICAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgICAgZW50cnkudmFsdWUgPSBrZXk7XHJcbiAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gX2RhdGEudHJhbnNmb3JtYXRpb247XHJcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cmlidXRlcyhfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBhdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpIHx8IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInZhcmlhYmxlXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChfZGF0YS5mdW5jdGlvbik7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEuY29sb3IpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29sb3JcIik7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInRyYW5zZm9ybWF0aW9uXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29kZVwiKTtcclxuXHJcbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IGlucHV0QXNOdW1iZXI6IG51bWJlciA9IE51bWJlci5wYXJzZUZsb2F0KF9lbGVtZW50LnZhbHVlKTtcclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5OQU1FICYmIMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoX2VsZW1lbnQudmFsdWUpKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVNbX2VsZW1lbnQudmFsdWVdKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBpcyBhIHByZWRlZmluZWQgdmFyaWFibGUgYW5kIGNhbiBub3QgYmUgcmVkZWNsYXJlZC4gUHJlZGVmaW5lZCB2YXJpYWJsZXM6IFske09iamVjdC5rZXlzKMaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFUykuam9pbihcIiwgXCIpfV1gKTtcclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIMaSdWkuV2FybmluZy5kaXNwbGF5KGVycm9ycywgXCJVbmFibGUgdG8gcmVuYW1lXCIsIFwiUGxlYXNlIHJlc29sdmUgdGhlIGVycm9ycyBhbmQgdHJ5IGFnYWluXCIgKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmRhdGEudmFyaWFibGVzLmluZGV4T2YoX2RhdGEpO1xyXG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lc1tpbmRleF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShuYW1lLCBfZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5GVU5DVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS5mdW5jdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04+X2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5UUkFOU0ZPUk1BVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS50cmFuc2Zvcm1hdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXCJ0cmFuc2Zvcm1hdGlvblwiXT5fZWxlbWVudC52YWx1ZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpKSkge1xyXG4gICAgICAgIGxldCBpbnB1dDogc3RyaW5nIHwgbnVtYmVyID0gTnVtYmVyLmlzTmFOKGlucHV0QXNOdW1iZXIpID8gX2VsZW1lbnQudmFsdWUgOiBpbnB1dEFzTnVtYmVyO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIiAmJiAhxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTW2lucHV0XSAmJiB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyAmJiAhdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoaW5wdXQpKSBcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBfZGF0YS52YWx1ZSA9IGlucHV0O1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkpIHtcclxuICAgICAgICBfZGF0YS5jb2RlID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbihfZGF0YSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgY2hpbGRyZW46IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSA9IFtdO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0gxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YTtcclxuICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAga2V5cyA9IFZpZXdQYXJ0aWNsZVN5c3RlbS5QUk9QRVJUWV9LRVlTLmZpbHRlcihfa2V5ID0+IGtleXMuaW5jbHVkZXMoX2tleSkpO1xyXG5cclxuICAgICAga2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IGRhdGFbX2tleV07XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oY2hpbGQpIHx8IHR5cGVvZiBjaGlsZCA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YVtfa2V5XSwgX2RhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIHJldHVybiBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c2VkOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSk6IFByb21pc2U8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNlZDtcclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBleHBlbmQpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWxldGVEYXRhKGRhdGEpKVxyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdLCBfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfYXQ/OiBudW1iZXIpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBsZXQgbW92ZTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdID0gW107XHJcbiAgICAgIGxldCBjb250YWluZXI6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXTtcclxuXHJcbiAgICAgIGlmICgoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX3RhcmdldCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX3RhcmdldCkpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkpXHJcbiAgICAgICAgY29udGFpbmVyID0gX3RhcmdldC5wYXJhbWV0ZXJzO1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4TG9jYWwgfHwgX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4V29ybGQpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXT5fdGFyZ2V0O1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEudmFyaWFibGVzIHx8IF90YXJnZXQgPT0gdGhpcy5kYXRhLmNvbG9yKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbltdPl90YXJnZXQ7XHJcblxyXG4gICAgICBpZiAoIWNvbnRhaW5lcikgXHJcbiAgICAgICAgcmV0dXJuIG1vdmU7XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250YWluZXIpKVxyXG4gICAgICAgIGZvciAobGV0IGRhdGEgb2YgX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGNvbnRhaW5lci5pbmRleE9mKGRhdGEpOyAvLyBfYXQgbmVlZHMgdG8gYmUgY29ycmVjdGVkIGlmIHdlIGFyZSBtb3Zpbmcgd2l0aGluIHNhbWUgcGFyZW50XHJcbiAgICAgICAgICBsZXQgaGFzUGFyZW50OiBib29sZWFuID0gdGhpcy5jaGlsZFRvUGFyZW50LmhhcyhkYXRhKTtcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lcz8uW2luZGV4XTtcclxuXHJcbiAgICAgICAgICBpZiAoaGFzUGFyZW50ICYmICF0aGlzLmRlbGV0ZURhdGEoZGF0YSkpIFxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBpZiAoIWhhc1BhcmVudClcclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cclxuICAgICAgICAgIG1vdmUucHVzaChkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YSwgX3RhcmdldCk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSAmJiBfYXQgPiBpbmRleClcclxuICAgICAgICAgICAgX2F0IC09IDE7XHJcblxyXG4gICAgICAgICAgaWYgKF9hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMucHVzaChuYW1lIHx8IHRoaXMuZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250YWluZXIuc3BsaWNlKF9hdCArIF9jaGlsZHJlbi5pbmRleE9mKGRhdGEpLCAwLCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnNwbGljZShfYXQgKyBfY2hpbGRyZW4uaW5kZXhPZihkYXRhKSwgMCwgbmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10pOiBQcm9taXNlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXT4ge1xyXG4gICAgICBsZXQgY29waWVzOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSA9IFtdO1xyXG4gICAgICBpZiAoX29yaWdpbmFscy5ldmVyeShfb3JpZ2luYWwgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfb3JpZ2luYWwpKSB8fCBfb3JpZ2luYWxzLmV2ZXJ5KF9vcmlnaW5hbCA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfb3JpZ2luYWwpKSlcclxuICAgICAgICBfb3JpZ2luYWxzLmZvckVhY2goX29yaWdpbmFsID0+IGNvcGllcy5wdXNoKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX29yaWdpbmFsKSkpKTtcclxuXHJcbiAgICAgIHJldHVybiBjb3BpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG92ZXJyaWRlIGRyYWdnYWJsZShfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF90YXJnZXQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gXCJuZXdWYXJpYWJsZVwiO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDE7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xyXG4gICAgICAgIG5hbWUgPSBcIm5ld1ZhcmlhYmxlXCIgKyBjb3VudDtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0S2V5KF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogc3RyaW5nIHsgXHJcbiAgICAgIGxldCBwYXJlbnQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKSB8fCB7fTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKHBhcmVudCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24ocGFyZW50KSlcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyYW1ldGVycztcclxuXHJcbiAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJlbnQpLmZpbmQoX2VudHJ5ID0+IF9lbnRyeVsxXSA9PSBfZGF0YSk/LnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHBhcmVudDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24ocGFyZW50KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihwYXJlbnQpKVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJhbWV0ZXJzO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50KSkge1xyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KGtleSk7XHJcbiAgICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWxldGUgcGFyZW50W2tleV07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5kZWxldGUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmFtZVZhcmlhYmxlKF9uYW1lOiBzdHJpbmcsIF9uZXc6IHN0cmluZywgX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmRhdGEpOiB2b2lkIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSAmJiBfZGF0YS52YWx1ZSA9PSBfbmFtZSkge1xyXG4gICAgICAgIF9kYXRhLnZhbHVlID0gX25ldztcclxuICAgICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBkZXRhaWw6IHsgZGF0YTogX2RhdGEgfSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBzdWJEYXRhIG9mIE9iamVjdC52YWx1ZXMoXCJwYXJhbWV0ZXJzXCIgaW4gX2RhdGEgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGEpKVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViRGF0YSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShfbmFtZSwgX25ldywgc3ViRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCB0eXBlIFJlc291cmNlRW50cnkgPSBSZXNvdXJjZUZpbGUgfCBSZXNvdXJjZUZvbGRlcjtcclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZUZpbGUgZXh0ZW5kcyDGki5TZXJpYWxpemFibGVSZXNvdXJjZSB7XHJcbiAgICByZXNvdXJjZVBhcmVudD86IFJlc291cmNlRm9sZGVyOyAvLyBkYW5nZXJvdXMgYXMgYSBTZXJpYWxpemFibGVSZXNvdXJjZSBtdXN0IG5vdCBoYXZlIGEgcHJvcGVydHkgd2l0aCB0aGlzIG5hbWUgaXRzZWxmXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgUmVzb3VyY2VGb2xkZXIgaW1wbGVtZW50cyDGki5TZXJpYWxpemFibGUge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyByZXNvdXJjZVBhcmVudDogUmVzb3VyY2VGb2xkZXI7XHJcbiAgICBwdWJsaWMgZW50cmllczogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nID0gXCJGb2xkZXJcIjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZyA9IFwiTmV3IEZvbGRlclwiKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb3IgYW55IG9mIGl0cyBkZXNjZW5kYW50cyBjb250YWluIHRoZSBnaXZlbiByZXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zKF9yZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBib29sZWFuIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5lbnRyaWVzKSBcclxuICAgICAgICBpZiAoZW50cnkgPT0gX3Jlc291cmNlIHx8IGVudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgJiYgZW50cnkuY29udGFpbnMoX3Jlc291cmNlKSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXJpYWxpemUoKTogxpIuU2VyaWFsaXphdGlvbiB7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uID0geyBuYW1lOiB0aGlzLm5hbWUsIGVudHJpZXM6IFtdIH07XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykge1xyXG4gICAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgc2VyaWFsaXphdGlvbi5lbnRyaWVzLnB1c2goZW50cnkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uZW50cmllcy5wdXNoKHsgaWRSZXNvdXJjZTogZW50cnkuaWRSZXNvdXJjZSB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VyaWFsaXphdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVzZXJpYWxpemUoX3NlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfc2VyaWFsaXphdGlvbi5uYW1lO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeVNlcmlhbGl6YXRpb24gb2YgX3NlcmlhbGl6YXRpb24uZW50cmllcyA/PyBfc2VyaWFsaXphdGlvbi5jaGlsZHJlbikgeyAvLyByZW1vdmUgXCI/PyBfc2VyaWFsaXphdGlvbi5jaGlsZHJlblwiIGFmdGVyIGEgd2hpbGVcclxuICAgICAgICBsZXQgZW50cnk6IFJlc291cmNlRW50cnk7XHJcbiAgICAgICAgaWYgKFwiaWRSZXNvdXJjZVwiIGluIGVudHJ5U2VyaWFsaXphdGlvbilcclxuICAgICAgICAgIGVudHJ5ID0gYXdhaXQgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShlbnRyeVNlcmlhbGl6YXRpb24uaWRSZXNvdXJjZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZW50cnkgPSA8UmVzb3VyY2VGb2xkZXI+YXdhaXQgbmV3IFJlc291cmNlRm9sZGVyKCkuZGVzZXJpYWxpemUoZW50cnlTZXJpYWxpemF0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICB0aGlzLmVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICBlbnRyeS5yZXNvdXJjZVBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxSZXNvdXJjZUVudHJ5PiB7XHJcbiAgICAgIHlpZWxkIHRoaXM7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykge1xyXG4gICAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgeWllbGQqIGVudHJ5O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHlpZWxkIGVudHJ5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVSZXNvdXJjZSBleHRlbmRzIMaSdWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8UmVzb3VyY2VFbnRyeT4ge1xyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX29iamVjdDogUmVzb3VyY2VFbnRyeSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IF9vYmplY3QubmFtZTtcclxuXHJcbiAgICAgIGlmICghKF9vYmplY3QgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJpY29uXCIsIF9vYmplY3QudHlwZSk7XHJcblxyXG4gICAgICAgIGlmICgoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X29iamVjdCkuc3RhdHVzID09IMaSLlJFU09VUkNFX1NUQVRVUy5FUlJPUikge1xyXG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xyXG4gICAgICAgICAgaW5wdXQudGl0bGUgPSBcIkZhaWxlZCB0byBsb2FkIHJlc291cmNlIGZyb20gZmlsZS4gQ2hlY2sgdGhlIGNvbnNvbGUgZm9yIGRldGFpbHMuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX29iamVjdDogUmVzb3VyY2VFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZW50cnk6IFJlc291cmNlRW50cnksIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9lbnRyeS5uYW1lICE9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgICBhd2FpdCAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X2VudHJ5KS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciAmJiBfZW50cnkuZW50cmllcy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZW50cnk6IFJlc291cmNlRW50cnkpOiBSZXNvdXJjZUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgPyBfZW50cnkuZW50cmllcyA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfc291cmNlczogUmVzb3VyY2VFbnRyeVtdLCBfdGFyZ2V0OiBSZXNvdXJjZUVudHJ5LCBfaW5kZXg/OiBudW1iZXIpOiBSZXNvdXJjZUVudHJ5W10ge1xyXG4gICAgICBpZiAoIShfdGFyZ2V0IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGxldCBtb3ZlOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgc291cmNlIG9mIF9zb3VyY2VzKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleDogbnVtYmVyID0gX3RhcmdldC5lbnRyaWVzLmluZGV4T2Yoc291cmNlKTsgLy8gX2luZGV4IG5lZWRzIHRvIGJlIGNvcnJlY3RlZCBpZiB3ZSBhcmUgbW92aW5nIHdpdGhpbiBzYW1lIHBhcmVudFxyXG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAtMSAmJiBfaW5kZXggPiBjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgICBfaW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoc291cmNlKTtcclxuICAgICAgICBzb3VyY2UucmVzb3VyY2VQYXJlbnQgPSBfdGFyZ2V0O1xyXG4gICAgICAgIG1vdmUucHVzaChzb3VyY2UpO1xyXG5cclxuICAgICAgICBpZiAoX2luZGV4ID09IG51bGwpXHJcbiAgICAgICAgICBfdGFyZ2V0LmVudHJpZXMucHVzaChzb3VyY2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF90YXJnZXQuZW50cmllcy5zcGxpY2UoX2luZGV4ICsgX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpLCAwLCBzb3VyY2UpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBSZXNvdXJjZUVudHJ5W10pOiBQcm9taXNlPFJlc291cmNlRW50cnlbXT4ge1xyXG4gICAgICAvLyBUT0RPOiBhZGQgZGVsZXRlIHNlbGVjdGlvbiBpc250ZWFkIG9mIF9mb2N1c3NlZD8gV2h5IGRvZXNuJ3QgdGhlIFRyZWUgY2xhc3MgaGFuZGxlIHRoaXM/XHJcbiAgICAgIGxldCBpUm9vdDogbnVtYmVyID0gX2ZvY3Vzc2VkLmluZGV4T2YocHJvamVjdC5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIGlmIChpUm9vdCA+IC0xKVxyXG4gICAgICAgIF9mb2N1c3NlZC5zcGxpY2UoaVJvb3QsIDEpO1xyXG5cclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIHNlcmlhbGl6YXRpb25zKVxyXG4gICAgICAgIHNlcmlhbGl6YXRpb25TdHJpbmdzLnNldCjGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXSwgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbnNbaWRSZXNvdXJjZV0pKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgX2ZvY3Vzc2VkKSB7XHJcbiAgICAgICAgaWYgKGV4cGVuZGFibGUgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgICAgbGV0IHVzYWdlOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleHBlbmRhYmxlLmVudHJpZXMpXHJcbiAgICAgICAgICAgIHVzYWdlLnB1c2goZW50cnkubmFtZSk7XHJcblxyXG4gICAgICAgICAgdXNhZ2VzW19mb2N1c3NlZC5pbmRleE9mKGV4cGVuZGFibGUpICsgXCIgXCIgKyBleHBlbmRhYmxlLm5hbWVdID0gdXNhZ2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZS5pZFJlc291cmNlICE9IGV4cGVuZGFibGUuaWRSZXNvdXJjZSlcclxuICAgICAgICAgICAgICBpZiAoc2VyaWFsaXphdGlvblN0cmluZ3MuZ2V0KHJlc291cmNlKS5pbmRleE9mKGV4cGVuZGFibGUuaWRSZXNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2ZvY3Vzc2VkLmxlbmd0aCA+IDAgJiYgYXdhaXQgb3BlbkRpYWxvZygpKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZWQ6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIF9mb2N1c3NlZCkge1xyXG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nID0gc2VsZWN0ZWQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciA/IHRoaXMuc2VsZWN0aW9uLmluZGV4T2Yoc2VsZWN0ZWQpICsgXCIgXCIgKyBzZWxlY3RlZC5uYW1lIDogc2VsZWN0ZWQuaWRSZXNvdXJjZTtcclxuICAgICAgICAgIGlmICh1c2FnZXNba2V5XS5sZW5ndGggPT0gMCkgIC8vIGRlbGV0ZSBvbmx5IHVudXNlZFxyXG4gICAgICAgICAgICBkZWxldGVkLnB1c2goc2VsZWN0ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcmVzb3VyY2Ugb2YgZGVsZXRlZCkge1xyXG4gICAgICAgICAgaWYgKCEocmVzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpXHJcbiAgICAgICAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5yZW1vdmUocmVzb3VyY2UpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKHRoaXMuc2VsZWN0aW9uLmluZGV4T2YocmVzb3VyY2UpLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBhc3luYyBmdW5jdGlvbiBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gxpJ1aS5EaWFsb2cucHJvbXB0KHVzYWdlcywgdHJ1ZSwgXCJSZXZpZXcgcmVmZXJlbmNlcywgZGVsZXRlIGRlcGVuZGVuZCByZXNvdXJjZXMgZmlyc3QgaWYgYXBwbGljYWJsZVwiLCBcIlRvIGRlbGV0ZSB1bnVzZWQgcmVzb3VyY2VzLCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG5cclxuICAgICAgICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiBSZXNvdXJjZUVudHJ5W10pOiBQcm9taXNlPFJlc291cmNlRW50cnlbXT4ge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhdGgoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgbGV0IHBhdGg6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudDogUmVzb3VyY2VFbnRyeSA9IF9yZXNvdXJjZTtcclxuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcclxuICAgICAgICBwYXRoLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmVzb3VyY2VQYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogdm9pZCB7XHJcbiAgICAgIGxldCBwYXJlbnQ6IFJlc291cmNlRm9sZGVyID0gX3Jlc291cmNlLnJlc291cmNlUGFyZW50O1xyXG4gICAgICBpZiAoIXBhcmVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHBhcmVudC5lbnRyaWVzLmluZGV4T2YoX3Jlc291cmNlKTtcclxuICAgICAgcGFyZW50LmVudHJpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1ZpZXcudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgW1tQYW5lbF1dcyBhZ2dyZWdhdGluZyBbW1ZpZXddXXNcclxuICAgKiBTdWJjbGFzc2VzIGFyZSBwcmVzZXRzIGZvciBjb21tb24gcGFuZWxzLiBBIHVzZXIgbWlnaHQgYWRkIG9yIGRlbGV0ZSBbW1ZpZXddXXMgYXQgcnVudGltZVxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICAvLyBUT0RPOiBjbGFzcyBtaWdodCBiZWNvbWUgYSBjdXN0b21jb21wb25lbnQgZm9yIEhUTUwhID0gdGhpcy5kb21cclxuXHJcbiAgLy8gZXh0ZW5kcyB2aWV3IHZvcnLDvGJlcmdlaGVuZCBlbnRmZXJudFxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYW5lbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJvdGVjdGVkIGdvbGRlbkxheW91dDogR29sZGVuTGF5b3V0O1xyXG4gICAgcHJvdGVjdGVkIHZpZXdzOiBWaWV3W10gPSBbXTtcclxuICAgIC8vcHVibGljIGRvbTsgLy8gbXVzcyB2aWVsbGVpY2h0IHdlZ1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9wYW5lbFN0YXRlOiBWaWV3U3RhdGUsIF92aWV3Q29uc3RydWN0b3JzPzogeyBbbmFtZTogc3RyaW5nXTogbmV3ICguLi5hcmdzOiDGki5HZW5lcmFsKSA9PiBWaWV3IH0sIF9yb290SXRlbUNvbmZpZz86IFJvd09yQ29sdW1uSXRlbUNvbmZpZykge1xyXG4gICAgICBfY29udGFpbmVyLm9uKFwiZGVzdHJveVwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC5kZXN0cm95KCkpOyAvLyBkZXN0cm95IGZyb20gaW5zaWRlIG91dFxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfcGFuZWxTdGF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcInZpZXdcIik7XHJcbiAgICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZShcInBhbmVsXCIsIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IExheW91dENvbmZpZyA9IHtcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgIHBvcG91dDogZmFsc2UsXHJcbiAgICAgICAgICBtYXhpbWlzZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJvb3Q6IF9yb290SXRlbUNvbmZpZ1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQgPSBuZXcgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuR29sZGVuTGF5b3V0KHRoaXMuZG9tKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIF92aWV3Q29uc3RydWN0b3JzKVxyXG4gICAgICAgIHRoaXMuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50RmFjdG9yeUZ1bmN0aW9uKGtleSwgKF9jb250YWluZXIsIF92aWV3U3RhdGU6IFZpZXdTdGF0ZSkgPT4gbmV3IF92aWV3Q29uc3RydWN0b3JzW2tleV0oX2NvbnRhaW5lciwgeyAuLi5fcGFuZWxTdGF0ZSwgLi4uX3ZpZXdTdGF0ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dC5vbihcInN0YXRlQ2hhbmdlZFwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC51cGRhdGVSb290U2l6ZSgpKTtcclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQub24oXCJpdGVtQ3JlYXRlZFwiLCB0aGlzLmFkZFZpZXdDb21wb25lbnQpO1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQubG9hZExheW91dChfcGFuZWxTdGF0ZVtcImxheW91dFwiXSA/IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQoX3BhbmVsU3RhdGVbXCJsYXlvdXRcIl0pIDogY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU2VuZCBjdXN0b20gY29waWVzIG9mIHRoZSBnaXZlbiBldmVudCB0byB0aGUgdmlld3MgKi9cclxuICAgIHB1YmxpYyBicm9hZGNhc3QgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IF9ldmVudC5kZXRhaWwgfHwge307XHJcbiAgICAgIGxldCB0YXJnZXQ6IFZpZXcgPSBkZXRhaWwudmlldztcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IHRoaXM7XHJcbiAgICAgIGZvciAobGV0IHZpZXcgb2YgdGhpcy52aWV3cylcclxuICAgICAgICBpZiAodmlldyAhPSB0YXJnZXQpIC8vIGRvbid0IHNlbmQgYmFjayB0byBvcmlnaW5hbCB0YXJnZXQgdmlld1xyXG4gICAgICAgICAgdmlldy5kaXNwYXRjaCg8RVZFTlRfRURJVE9SPl9ldmVudC50eXBlLCB7IGRldGFpbDogZGV0YWlsIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImxheW91dFwiXSA9IHRoaXMuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkVmlld0NvbXBvbmVudCA9IChfZXZlbnQ6IEV2ZW50RW1pdHRlci5CdWJibGluZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGFkanVzdG1lbnMgZm9yIEdvbGRlbkxheW91dCAyXHJcbiAgICAgIGxldCB0YXJnZXQ6IENvbXBvbmVudEl0ZW0gPSBfZXZlbnQudGFyZ2V0IGFzIENvbXBvbmVudEl0ZW07XHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Db21wb25lbnRJdGVtKSB7XHJcbiAgICAgICAgdGhpcy52aWV3cy5wdXNoKDxWaWV3PnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUT0RPOiBhZGRcclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxBbmltYXRpb24gZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5BTklNQVRJT05dOiBWaWV3QW5pbWF0aW9uLFxyXG4gICAgICAgIFtWSUVXLkFOSU1BVElPTl9TSEVFVF06IFZpZXdBbmltYXRpb25TaGVldFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJQcm9wZXJ0aWVzXCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OX1NIRUVUXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkFuaW1hdGlvbiB8IFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGl0ZXJhdGUgb3ZlciB2aWV3cyBhbmQgY29sbGVjdCB0aGVpciBzdGF0ZXMgZm9yIHJlY29uc3RydWN0aW9uXHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbj8ubmFtZTtcclxuICAgICAgICAgIGlmIChuYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlKFwiQW5pbWF0aW9uIHwgXCIgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgZ3JhcGggYW5kIG9mZmVycyBtZWFucyBmb3IgbWFuaXB1bGF0aW9uXHJcbiAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxHcmFwaCBleHRlbmRzIFBhbmVsIHtcclxuICAgICNncmFwaDogxpIuR3JhcGg7XHJcbiAgICAjbm9kZTogxpIuTm9kZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5SRU5ERVJdOiBWaWV3UmVuZGVyLFxyXG4gICAgICAgIFtWSUVXLkNPTVBPTkVOVFNdOiBWaWV3Q29tcG9uZW50cyxcclxuICAgICAgICBbVklFVy5ISUVSQVJDSFldOiBWaWV3SGllcmFyY2h5XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgICAgICB0aXRsZTogXCJSZW5kZXJcIlxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkhJRVJBUkNIWSxcclxuICAgICAgICAgICAgdGl0bGU6IFwiSGllcmFyY2h5XCJcclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5DT01QT05FTlRTLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJDb21wb25lbnRzXCJcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkdyYXBoXCIpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLnJlc3RvcmVHcmFwaCgpLnRoZW4oX2dyYXBoID0+IHtcclxuICAgICAgICBpZiAoX2dyYXBoKSB7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBfZ3JhcGgsIG5vZGU6IHRoaXMucmVzdG9yZU5vZGUoX2dyYXBoKSB9IH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSkge1xyXG4gICAgICAgICAgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShfc3RhdGVbXCJncmFwaFwiXSkudGhlbigoX2dyYXBoOiDGki5HcmFwaCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlOiDGki5Ob2RlID0gX3N0YXRlW1wibm9kZVwiXSAmJiDGki5Ob2RlLkZJTkQoX2dyYXBoLCBfc3RhdGVbXCJub2RlXCJdKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogX2dyYXBoLCBub2RlOiBub2RlIH0gfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIGlmICh0aGlzLiNncmFwaClcclxuICAgICAgICBzdGF0ZVtcImdyYXBoXCJdID0gdGhpcy4jZ3JhcGguaWRSZXNvdXJjZTtcclxuICAgICAgaWYgKHRoaXMuI25vZGUpXHJcbiAgICAgICAgc3RhdGVbXCJub2RlXCJdID0gxpIuTm9kZS5QQVRIX0ZST01fVE8odGhpcy4jZ3JhcGgsIHRoaXMuI25vZGUpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy52aWV3cy5maW5kKF92aWV3ID0+IF92aWV3IGluc3RhbmNlb2YgVmlld1JlbmRlcikuZG9tLmNvbnRhaW5zKDxOb2RlPl9ldmVudC50YXJnZXQpKSAvLyBhY2NlcHQgZHJvcCBvbmx5IGZyb20gcmVuZGVyIHZpZXdcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IHNvdXJjZSwgbm9kZTogdGhpcy5yZXN0b3JlTm9kZShzb3VyY2UpIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOiAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoZXNlIHR3byBzaG91bGQgYmUgc3RvcHBlZCBhc3dlbGxcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBjb25zdCBncmFwaDogxpIuR3JhcGggPSBkZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgICBpZiAoZ3JhcGggJiYgZ3JhcGggIT0gdGhpcy4jZ3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUdyYXBoKGdyYXBoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtncmFwaC50eXBlfSB8ICR7Z3JhcGgubmFtZX1gKTtcclxuICAgICAgICAgICAgdGhpcy4jZ3JhcGggPSBncmFwaDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IG5vZGU6IMaSLk5vZGUgPSBkZXRhaWwubm9kZTtcclxuICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgIT0gdGhpcy4jbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0aGlzLiNncmFwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuI25vZGUgPSBub2RlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBpZiAoZGV0YWlsLnZpZXcgIT0gdGhpcylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlR3JhcGgodGhpcy4jZ3JhcGgpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoICYmIHRoaXMuI25vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKHRoaXMuI2dyYXBoLCB0aGlzLiNub2RlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoLCBfc2VsZWN0ZWQ6IMaSLk5vZGUpOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWAsIMaSLk5vZGUuUEFUSF9GUk9NX1RPKF9ncmFwaCwgX3NlbGVjdGVkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoKTogxpIuTm9kZSB7XHJcbiAgICAgIGxldCBzZWxlY3RlZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWApO1xyXG4gICAgICByZXR1cm4gc2VsZWN0ZWQgJiYgxpIuTm9kZS5GSU5EKF9ncmFwaCwgc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmVHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgX2dyYXBoLmlkUmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVzdG9yZUdyYXBoKCk6IFByb21pc2U8xpIuR3JhcGg+IHtcclxuICAgICAgbGV0IGlkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuaWQpO1xyXG4gICAgICByZXR1cm4gaWQgJiYgPFByb21pc2U8xpIuR3JhcGg+PsaSLlByb2plY3QuZ2V0UmVzb3VyY2UoaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgaGVscCBhbmQgZG9jdW1lbnRhdGlvblxyXG4gICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjFcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbEhlbHAgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiSGVscFwiKTtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5kb20pO1xyXG4gICAgICAvLyBUT0RPOiBpZnJhbWUgc2FuZGJveCBkaXNhbGxvd3MgdXNlIG9mIHNjcmlwdHMsIHJlbW92ZSBvciByZXBsYWNlIHdpdGggb2JqZWN0IGlmIG5lY2Vzc2FyeVxyXG4gICAgICAvLyB0aGlzLmRvbS5pbm5lckhUTUwgPSBgPGlmcmFtZSBzcmM9XCJIZWxwLmh0bWxcIiBzYW5kYm94PjwvaWZyYW1lPmA7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IGA8b2JqZWN0IGRhdGE9XCJIZWxwLmh0bWxcIj48L29iamVjdD5gO1xyXG5cclxuICAgICAgLy8gY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgIC8vICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgLy8gICBpc0Nsb3NhYmxlOiB0cnVlLFxyXG4gICAgICAvLyAgIGNvbnRlbnQ6IFtcclxuICAgICAgLy8gICAgIHtcclxuICAgICAgLy8gICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgLy8gICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgIC8vICAgICAgIGNvbXBvbmVudFN0YXRlOiBfc3RhdGUsXHJcbiAgICAgIC8vICAgICAgIHRpdGxlOiBcIlJlbmRlclwiXHJcbiAgICAgIC8vICAgICB9XHJcbiAgICAgIC8vICAgXVxyXG4gICAgICAvLyB9O1xyXG5cclxuICAgICAgLy8gdGhpcy5nb2xkZW5MYXlvdXQuYWRkSXRlbUF0TG9jYXRpb24oY29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRPRE86IGFkZFxyXG4gICAqIEBhdXRob3JzIEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbFBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUEFSVElDTEVfU1lTVEVNLFxyXG4gICAgICAgICAgdGl0bGU6IMaSLlBhcnRpY2xlU3lzdGVtLm5hbWVcclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCB7IFtWSUVXLlBBUlRJQ0xFX1NZU1RFTV06IFZpZXdQYXJ0aWNsZVN5c3RlbSB9LCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKMaSLlBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgLy8gVE9ETzogaXRlcmF0ZSBvdmVyIHZpZXdzIGFuZCBjb2xsZWN0IHRoZWlyIHN0YXRlcyBmb3IgcmVjb25zdHJ1Y3Rpb25cclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheSB0aGUgcHJvamVjdCBzdHJ1Y3R1cmUgYW5kIG9mZmVyIGZ1bmN0aW9ucyBmb3IgY3JlYXRpb24sIGRlbGV0aW9uIGFuZCBhZGp1c3RtZW50IG9mIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwLSAyMDIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsUHJvamVjdCBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cnVjdG9ycyA9IHsgLyogZXNsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gICAgICAgIFtWSUVXLklOVEVSTkFMX1RBQkxFXTogVmlld0ludGVybmFsVGFibGUsXHJcbiAgICAgICAgW1ZJRVcuSU5URVJOQUxfRk9MREVSXTogVmlld0ludGVybmFsRm9sZGVyLFxyXG4gICAgICAgIFtWSUVXLkVYVEVSTkFMXTogVmlld0V4dGVybmFsLFxyXG4gICAgICAgIFtWSUVXLlBST1BFUlRJRVNdOiBWaWV3UHJvcGVydGllcyxcclxuICAgICAgICBbVklFVy5QUkVWSUVXXTogVmlld1ByZXZpZXcsXHJcbiAgICAgICAgW1ZJRVcuU0NSSVBUXTogVmlld1NjcmlwdFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJPUEVSVElFUyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJFVklFVyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJldmlld1wiXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5FWFRFUk5BTCxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJFeHRlcm5hbFwiXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuU0NSSVBULFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIlNjcmlwdFwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RhY2tcIixcclxuICAgICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSU5URVJOQUxfRk9MREVSLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmFsXCJcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5JTlRFUk5BTF9UQUJMRSxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJUYWJsZVwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpOyAvLyBUT0RPOiBleHBsYWluIHVzZSBvZiBkb2N1bWVudCAvLyByZW1vdmVkIGJlYWNhdXNlIHRoaXMga2VlcHMgdGhlIHBhbmVscyBhbGl2ZSBldmVuIHdoZW4gY2xvc2VkXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIlByb2plY3QgfCBcIiArIHByb2plY3QubmFtZSk7XHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KG5ldyBFZGl0b3JFdmVudChFVkVOVF9FRElUT1IuT1BFTiwge30pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5VUERBVEUgJiYgX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLkNSRUFURSAmJiBfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuREVMRVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5NT0RJRlkpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiUHJvamVjdCB8IFwiICsgcHJvamVjdC5uYW1lKTsgLy93aHkgaGVyZSBhbmQgZXZlcnl0aW1lP1xyXG4gICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5TRUxFQ1QpIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhIHBhcnRpY2xlIHN5c3RlbSBhdHRhY2hlZCB0byBhIG5vZGUuXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9LRVlTOiAoa2V5b2YgxpIuUGFydGljbGVEYXRhLlN5c3RlbSlbXSA9IFtcInZhcmlhYmxlc1wiLCBcIm10eExvY2FsXCIsIFwibXR4V29ybGRcIiwgXCJjb2xvclwiXTtcclxuXHJcbiAgICBwcml2YXRlIGNtcFBhcnRpY2xlU3lzdGVtOiDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHRvb2xiYXJJbnRlcnZhbElkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRpbWVTY2FsZVBsYXk6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPjtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgZXJyb3JzOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB2YXJpYWJsZXM6IEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0obnVsbCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGZvY3VzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgbGV0IHBvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSkpO1xyXG4gICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgaXRlbS5zdWJtZW51Lml0ZW1zLmZvckVhY2goX3N1Ykl0ZW0gPT4gX3N1Ykl0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgICBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZU1xyXG4gICAgICAgICAgLmZpbHRlcihfdmFsdWUgPT4gIU9iamVjdC5rZXlzKGZvY3VzKS5pbmNsdWRlcyhfdmFsdWUpKVxyXG4gICAgICAgICAgLmZvckVhY2goX2xhYmVsID0+IGl0ZW0uc3VibWVudS5pdGVtcy5maW5kKF9pdGVtID0+IF9pdGVtLmxhYmVsID09IF9sYWJlbCkudmlzaWJsZSA9IHRydWUpO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS52YXJpYWJsZXMgfHwgZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTikpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS5tdHhMb2NhbCB8fCBmb2N1cyA9PSB0aGlzLmRhdGEubXR4V29ybGQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgIT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9wdXApXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUztcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgUHJvcGVydHlcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSksXHJcbiAgICAgICAgc3VibWVudTogZ2VuZXJhdGVTdWJNZW51KG9wdGlvbnMsIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIFZhbHVlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIEZ1bmN0aW9uXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIENvZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBUcmFuc2Zvcm1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSxcclxuICAgICAgICBzdWJtZW51OiBnZW5lcmF0ZVN1Yk1lbnUoW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0sIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdWJNZW51KF9vcHRpb25zOiBzdHJpbmdbXSwgX2lkOiBzdHJpbmcsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIF9vcHRpb25zLmZvckVhY2goX29wdGlvbiA9PiB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBfb3B0aW9uLCBpZDogX2lkLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAgICAgc3VibWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdWJtZW51O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBmb2N1czogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZTtcclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFk6XHJcbiAgICAgICAgICBjaGlsZCA9IFtdO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IHZhbHVlOiAxIH07XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT046XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgZnVuY3Rpb246IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTi5BRERJVElPTiwgcGFyYW1ldGVyczogW10gfTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IGNvZGU6IFwiMVwiIH07XHJcblxyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpXHJcbiAgICAgICAgICAgIGZvY3VzLnBhcmFtZXRlcnMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvY3VzW19pdGVtLmxhYmVsXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICBpZiAoX2l0ZW0ubGFiZWwgPT0gXCJ2YXJpYWJsZXNcIilcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZXMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5wdXNoKHRoaXMuY29udHJvbGxlci5nZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuY29sb3IucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGlsZFRvUGFyZW50LnNldChjaGlsZCwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OOlxyXG4gICAgICAgICAgY2hpbGQgPSB7IHRyYW5zZm9ybWF0aW9uOiA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2l0ZW0ubGFiZWwsIHBhcmFtZXRlcnM6IFtdIH07XHJcbiAgICAgICAgICAoPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltdPmZvY3VzKS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hpbGRUb1BhcmVudC5zZXQoY2hpbGQsIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBOlxyXG4gICAgICAgICAgbGV0IHJlbW92ZTogxpIuU2VyaWFsaXphdGlvbltdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5kZWxldGUocmVtb3ZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSk/LnBhcnRpY2xlU3lzdGVtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtID0gPMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtPig8xpIuTm9kZT5fdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXSkuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtKTtcclxuICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGU7XHJcbiAgICAgIHRoaXMuc2V0VGltZSgwKTtcclxuICAgICAgdGhpcy5zZXRQYXJ0aWNsZVN5c3RlbSh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnBhcnRpY2xlU3lzdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnRvb2xiYXJJbnRlcnZhbElkKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgICAgICB0aGlzLmVuYWJsZVNhdmUodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMCAmJiBfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuUyAmJiBfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgxpJ1aS5XYXJuaW5nLmRpc3BsYXkodGhpcy5lcnJvcnMubWFwKChbX2RhdGEsIF9lcnJvcl0pID0+IF9lcnJvciksIFwiVW5hYmxlIHRvIHNhdmVcIiwgYFByb2plY3QgY2FuJ3QgYmUgc2F2ZWQgd2hpbGUgaGF2aW5nIHVucmVzb2x2ZWQgZXJyb3JzYCwgXCJPS1wiKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShfZXZlbnQuZGV0YWlsLmRhdGEpPy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ1JFQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkRST1A6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkNVVDogLy8gVE9ETzogY3VzdG9tcyB0cmVlcyBjdXQgaXMgYXN5bmMsIHRoaXMgc2hvdWxkIGhhcHBlbiBhZnRlciBjdXQgaXMgZmluaXNoZWRcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hWYXJpYWJsZXMoKTtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgICAgbGV0IGludmFsaWQ6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gdGhpcy52YWxpZGF0ZURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoX2Vycm9yID0+ICFpbnZhbGlkLmluY2x1ZGVzKF9lcnJvcikpXHJcbiAgICAgICAgICAgIC5tYXAoKFtfZGF0YV0pID0+IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSkpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKF9pdGVtID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIV9pdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgX2l0ZW0uY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIik7XHJcbiAgICAgICAgICAgICAgX2l0ZW0udGl0bGUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzID0gaW52YWxpZDtcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCAmJiBfZXZlbnQudHlwZSAhPSDGknVpLkVWRU5ULkVYUEFORCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLmRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpOyAvLyBvdXIgd29ya2luZyBjb3B5IHNob3VsZCBvbmx5IGJlIHVzZWQgaWYgaXQgaXMgdmFsaWQgXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5mb3JFYWNoKChbX2RhdGEsIF9lcnJvcl0pID0+IHtcclxuICAgICAgICAgICAgICBsZXQgaXRlbTogxpJ1aS5DdXN0b21UcmVlSXRlbTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSk7XHJcbiAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKTtcclxuICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gX2Vycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZW5hYmxlU2F2ZSh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiB0b29sYmFyXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRvb2xiYXIoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudG9vbGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMudG9vbGJhci5pZCA9IFwidG9vbGJhclwiO1xyXG4gICAgICB0aGlzLnRvb2xiYXIudGl0bGUgPSBcIuKXjyBDb250cm9sIHRoZSBwbGF5YmFjayBvZiB0aGUgc2VsZWN0ZWQgcGFydGljbGUgc3lzdGVtXFxu4pePIFJpZ2h0IGNsaWNrIHJlbmRlciB2aWV3IHRvIGFjdGl2YXRlIGNvbnRpbm91cyByZW5kZXJpbmdcIjtcclxuXHJcbiAgICAgIGxldCBidXR0b25zOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGJ1dHRvbnMuaWQgPSBcImJ1dHRvbnNcIjtcclxuICAgICAgW1wiYmFja3dhcmRcIiwgXCJwbGF5XCIsIFwiZm9yd2FyZFwiXVxyXG4gICAgICAgIC5tYXAoX2lkID0+IHtcclxuICAgICAgICAgIGxldCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5pZCA9IF9pZDtcclxuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uSWNvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGltZVNjYWxlOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZTtcclxuICAgICAgICAgICAgc3dpdGNoICgoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuaWQpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwiYmFja3dhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSAtPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlID0gdGhpcy50aW1lU2NhbGVQbGF5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSB0aW1lU2NhbGU7XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcImZvcndhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSArPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGUpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IGJ1dHRvbnMuYXBwZW5kQ2hpbGQoX2J1dHRvbikpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNjYWxlU3RlcHBlcjogxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlciA9IG5ldyDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKHsga2V5OiBcInRpbWVTY2FsZVwiLCBsYWJlbDogXCJ0aW1lU2NhbGVcIiB9KTtcclxuICAgICAgdGltZVNjYWxlU3RlcHBlci5pZCA9IFwidGltZXNjYWxlXCI7XHJcbiAgICAgIHRpbWVTY2FsZVN0ZXBwZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTY2FsZVN0ZXBwZXIpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTdGVwcGVyOiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyID0gbmV3IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIoeyBrZXk6IFwidGltZVwiLCBsYWJlbDogXCJ0aW1lXCIsIHZhbHVlOiBcIjBcIiB9KTtcclxuICAgICAgdGltZVN0ZXBwZXIuaWQgPSBcInRpbWVcIjtcclxuICAgICAgdGltZVN0ZXBwZXIudGl0bGUgPSBcIlRoZSB0aW1lIChpbiBzZWNvbmRzKSBvZiB0aGUgcGFydGljbGUgc3lzdGVtXCI7XHJcbiAgICAgIHRpbWVTdGVwcGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTdGVwcGVyKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU2xpZGVyU3RlcHM6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGltZVNsaWRlclN0ZXBzLmlkID0gXCJ0aW1lc2xpZGVyc3RlcHNcIjtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXJTdGVwcyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGltZVNsaWRlci5pZCA9IFwidGltZXNsaWRlclwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5tYXggPSBcIjFcIjtcclxuICAgICAgdGltZVNsaWRlci5zdGVwID0gXCJhbnlcIjtcclxuICAgICAgdGltZVNsaWRlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZShwYXJzZUZsb2F0KHRpbWVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXIpO1xyXG5cclxuICAgICAgdGhpcy50b29sYmFySW50ZXJ2YWxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY21wUGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICAgIGxldCB0aW1lSW5TZWNvbmRzOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWUgLyAxMDAwO1xyXG4gICAgICAgICAgdGltZVNjYWxlU3RlcHBlci5zZXRNdXRhdG9yVmFsdWUodGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGUpO1xyXG4gICAgICAgICAgdGltZVN0ZXBwZXIuc2V0TXV0YXRvclZhbHVlKHRpbWVJblNlY29uZHMpO1xyXG5cclxuICAgICAgICAgIGxldCBkdXJhdGlvbjogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS5kdXJhdGlvbiAvIDEwMDA7XHJcbiAgICAgICAgICBpZiAocGFyc2VGbG9hdCh0aW1lU2xpZGVyLm1heCkgIT0gZHVyYXRpb24gKiAxLjEpIHsgLy8gdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAgICAgICAgdGltZVNsaWRlci5tYXggPSAoZHVyYXRpb24gKiAxLjEpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRpbWVTbGlkZXJTdGVwcy5pbm5lckhUTUwgPSBbMCwgMC4yNSwgMC41LCAwLjc1LCAxXVxyXG4gICAgICAgICAgICAgIC5tYXAoX2ZhY3RvciA9PiBkdXJhdGlvbiAqIF9mYWN0b3IpXHJcbiAgICAgICAgICAgICAgLm1hcChfdmFsdWUgPT4gYDxzcGFuIGRhdGEtbGFiZWw9XCIke192YWx1ZS50b0ZpeGVkKDIpfVwiPjwvc3Bhbj5gKS5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGltZVNsaWRlci52YWx1ZSA9IHRpbWVJblNlY29uZHMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUaW1lKF90aW1lSW5TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZXRUaW1lU2NhbGUoMCk7XHJcbiAgICAgIHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZSA9IF90aW1lSW5TZWNvbmRzICogMTAwMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFRpbWVTY2FsZShfdGltZVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX3RpbWVTY2FsZSA9IHBhcnNlRmxvYXQoX3RpbWVTY2FsZS50b0ZpeGVkKDE1KSk7IC8vIHJvdW5kIHNvIGZvcndhcmQgYW5kIGJhY2t3YXJkIGJ1dHRvbiBkb24ndCBtaXNzIHplcm9cclxuICAgICAgaWYgKF90aW1lU2NhbGUgIT0gMClcclxuICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSBfdGltZVNjYWxlO1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZSA9IF90aW1lU2NhbGU7XHJcblxyXG4gICAgICBsZXQgcGxheUJ1dHRvbjogRWxlbWVudCA9IHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BsYXlcIikgfHwgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIik7XHJcbiAgICAgIHBsYXlCdXR0b24uaWQgPSBfdGltZVNjYWxlID09IDAgPyBcInBsYXlcIiA6IFwicGF1c2VcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHNldFBhcnRpY2xlU3lzdGVtKF9wYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0pOiB2b2lkIHtcclxuICAgICAgaWYgKCFfcGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMudHJlZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgcGFydGljbGUgc3lzdGVtIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IF9wYXJ0aWNsZVN5c3RlbTtcclxuICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShfcGFydGljbGVTeXN0ZW0uZGF0YSkpOyAvLyB3ZSB3aWxsIHdvcmsgd2l0aCBhIGNvcHlcclxuICAgICAgdGhpcy5zZXRUaXRsZSh0aGlzLnBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKTtcclxuICAgICAgdGhpcy52YXJpYWJsZXMuaWQgPSBcInZhcmlhYmxlc1wiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZhcmlhYmxlcyk7XHJcbiAgICAgIHRoaXMucmVmcmVzaFZhcmlhYmxlcygpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSh0aGlzLmRhdGEsIHRoaXMpO1xyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJ1aS5DdXN0b21UcmVlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+KHRoaXMuY29udHJvbGxlciwgdGhpcy5kYXRhKTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ1VULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5QQVNURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGDil48gUmlnaHQgY2xpY2sgb24gXCIke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9XCIgdG8gYWRkIHByb3BlcnRpZXMuXFxu4pePIFJpZ2h0IGNsaWNrIG9uIHByb3BlcnRpZXMgdG8gYWRkIHRyYW5zZm9ybWF0aW9ucy9leHByZXNzaW9ucy5cXG7il48gUmlnaHQgY2xpY2sgb24gdHJhbnNmb3JtYXRpb25zL2V4cHJlc3Npb25zIHRvIGFkZCBleHByZXNzaW9ucy5cXG7il48gVXNlIENvcHkvQ3V0L1Bhc3RlIHRvIGR1cGxpY2F0ZSBkYXRhLmA7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IHRoaXMuZG9tLnRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10ge1xyXG4gICAgICBsZXQgaW52YWxpZDogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10gPSBbXTtcclxuICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gaW52YWxpZDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVjdXJzaXZlKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfcGF0aDogc3RyaW5nW10gPSBbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICAgIGxldCBtaW5QYXJhbWV0ZXJzOiBudW1iZXIgPSDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT05fTUlOSU1VTV9QQVJBTUVURVJTW19kYXRhLmZ1bmN0aW9uXTtcclxuICAgICAgICAgIGlmIChfZGF0YS5wYXJhbWV0ZXJzLmxlbmd0aCA8IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTl9NSU5JTVVNX1BBUkFNRVRFUlNbX2RhdGEuZnVuY3Rpb25dKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvcjogc3RyaW5nID0gYFwiJHtfcGF0aC5qb2luKFwiL1wiKX0vJHtfZGF0YS5mdW5jdGlvbn1cIiBuZWVkcyBhdCBsZWFzdCAke21pblBhcmFtZXRlcnN9IHBhcmFtZXRlcnNgO1xyXG4gICAgICAgICAgICBpbnZhbGlkLnB1c2goW19kYXRhLCBlcnJvcl0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhKS5mb3JFYWNoKChbX2tleSwgX3ZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBfdmFsdWUgPT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX3ZhbHVlLCBfcGF0aC5jb25jYXQoX2tleSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVTYXZlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICByZW1vdGUuTWVudS5nZXRBcHBsaWNhdGlvbk1lbnUoKS5nZXRNZW51SXRlbUJ5SWQoTUVOVS5QUk9KRUNUX1NBVkUpLmVuYWJsZWQgPSBfb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWZyZXNoVmFyaWFibGVzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpO1xyXG4gICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICBvcHRpb25zLnB1c2goLi4udGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMpO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcy5pbm5lckhUTUwgPSBvcHRpb25zLm1hcChfbmFtZSA9PiBgPG9wdGlvbiB2YWx1ZT1cIiR7X25hbWV9XCI+YCkuam9pbihcIlwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCB0aGUgYW5pbWF0YWJsZSBwcm9wZXJ0aWVzIG9mIGEgbm9kZSB3aXRoIGFuIGF0dGFjaGVkIGNvbXBvbmVudCBhbmltYXRpb24uXHJcbiAgICogQGF1dGhvcnMgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjIgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwdWJsaWMga2V5U2VsZWN0ZWQ6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgY21wQW5pbWF0b3I6IMaSLkNvbXBvbmVudEFuaW1hdG9yO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlckFuaW1hdGlvbjtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBmcmFtZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgdGltZTogxpIuVGltZSA9IG5ldyDGki5UaW1lKCk7XHJcbiAgICBwcml2YXRlIGlkSW50ZXJ2YWw6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldEFuaW1hdGlvbihudWxsKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULklOUFVULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkZPQ1VTX0lOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogPMaSLk5vZGU+c291cmNlIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoaXMubm9kZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgICAgbGFiZWw6IFwiQWRkIFByb3BlcnR5XCIsXHJcbiAgICAgICAgICBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KHRoaXMubm9kZSwgcGF0aCwgX2NhbGxiYWNrKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZSBQcm9wZXJ0eVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QUk9QRVJUWSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDb252ZXJ0IHRvIEFuaW1hdGlvblwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNPTlZFUlRfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiQ1wiIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZOlxyXG4gICAgICAgICAgLy8gZGVmaW5lZCBpbiBnZXRNdXRhdG9yU3VibWVudSwgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSB3YXkgdG8ga2VlcCB0aGUgcGF0aCBhc3NvY2lhdGVkIHdpdGggdGhlIG1lbnUgaXRlbSwgYXR0YWNoaW5nIGFueXRoaW5nIHRvIGl0ZW1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX1BST1BFUlRZOlxyXG4gICAgICAgICAgaWYgKCEoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRlbGV0ZVByb3BlcnR5KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DT05WRVJUX0FOSU1BVElPTjpcclxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbi5jb252ZXJ0VG9BbmltYXRpb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYW5pbWF0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm9kZVN1Ym1lbnUoX25vZGU6IMaSLk5vZGUsIF9wYXRoOiBzdHJpbmdbXSwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChjb25zdCBjb21wb25lbnRDbGFzcyBvZiDGki5Db21wb25lbnQuc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIF9ub2RlLmdldENvbXBvbmVudHMoY29tcG9uZW50Q2xhc3MpLmZvckVhY2goKF9jb21wb25lbnQsIF9pbmRleCkgPT4geyAvLyB3ZSBuZWVkIHRvIGdldCB0aGUgYXR0YWNoZWQgY29tcG9ubmVudHMgYXMgYXJyYXkgc28gd2UgY2FuIHJlY29uc3R1Y3QgdGhlaXIgcGF0aFxyXG4gICAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICAgIHBhdGgucHVzaChfY29tcG9uZW50LnR5cGUpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKF9pbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX2NvbXBvbmVudC5nZXRNdXRhdG9yRm9yQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAobXV0YXRvciAmJiBPYmplY3Qua2V5cyhtdXRhdG9yKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgICAgeyBsYWJlbDogX2NvbXBvbmVudC50eXBlLCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KG11dGF0b3IsIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBfbm9kZS5nZXRDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChcImNoaWxkcmVuXCIpO1xyXG4gICAgICAgIHBhdGgucHVzaChjaGlsZC5uYW1lKTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICB7IGxhYmVsOiBjaGlsZC5uYW1lLCBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KGNoaWxkLCBwYXRoLCBfY2FsbGJhY2spIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfcGF0aDogc3RyaW5nW10sIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKF9tdXRhdG9yW3Byb3BlcnR5XT8uY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHsgbGFiZWw6IHByb3BlcnR5LCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yW3Byb3BlcnR5XSwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiBwcm9wZXJ0eSwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUFJPUEVSVFkpLCBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZFByb3BlcnR5KHBhdGgsIHRoaXMubm9kZSwgdGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUb29sYmFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRvb2xiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuaWQgPSBcInRvb2xiYXJcIjtcclxuXHJcbiAgICAgIFtcInByZXZpb3VzXCIsIFwicGxheVwiLCBcIm5leHRcIl1cclxuICAgICAgICAubWFwKF9pZCA9PiB7XHJcbiAgICAgICAgICBsZXQgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICBidXR0b24uaWQgPSBfaWQ7XHJcbiAgICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidXR0b25JY29uXCI7XHJcbiAgICAgICAgICBidXR0b24ub25jbGljayA9IHRoaXMuaG5kVG9vbGJhckNsaWNrO1xyXG4gICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKF9idXR0b24gPT4gdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKF9idXR0b24pKTtcclxuXHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQubWluID0gXCIwXCI7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC5pZCA9IFwiZnJhbWVpbnB1dFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChfZXZlbnQ6IElucHV0RXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IE51bWJlci5wYXJzZUludCh0aGlzLmZyYW1lSW5wdXQudmFsdWUpICogMTAwMCAvIHRoaXMuYW5pbWF0aW9uLmZwcztcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aGlzLmZyYW1lSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVNlbGVjdGVkID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLm5vZGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuY21wQW5pbWF0b3IgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudEFuaW1hdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbXBBbmltYXRvcj8uYW5pbWF0aW9uICE9IHRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5tdXRhYmxlIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW5pbWF0b3IpIHtcclxuICAgICAgICAgICAgLy8gc3dpdGNoZWQgYW5pbWF0aW9uIGluIGEgQ29tcG9uZW50QW5pbWF0b3JcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSA9PSBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSlcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IG5vZGU6IF9ldmVudC5kZXRhaWwubXV0YWJsZS5ub2RlIH0gfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb24gfHwgX2V2ZW50LmRldGFpbC52aWV3IGluc3RhbmNlb2YgVmlld0FuaW1hdGlvblNoZWV0KSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldClcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG5cclxuICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZnJhbWVJbnB1dC52YWx1ZSA9IChNYXRoLnRydW5jKHRoaXMucGxheWJhY2tUaW1lIC8gMTAwMCAqIHRoaXMuYW5pbWF0aW9uLmZwcykpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICBsZXQgbm9kZU11dGF0b3I6IMaSLk11dGF0b3IgPSB0aGlzLmNtcEFuaW1hdG9yPy51cGRhdGVBbmltYXRpb24odGhpcy5wbGF5YmFja1RpbWUpIHx8IHt9O1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyPy51cGRhdGUobm9kZU11dGF0b3IsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5JTlBVVDpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRk9DVVNfSU46XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudERpZ2l0KVxyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci51cGRhdGVTZXF1ZW5jZSh0aGlzLnBsYXliYWNrVGltZSwgdGFyZ2V0LCBfZXZlbnQudHlwZSA9PSDGknVpLkVWRU5ULklOUFVUKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRBbmltYXRpb24oX2FuaW1hdGlvbjogxpIuQW5pbWF0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmIChfYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5TGlzdCgpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiRHJvcCBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBhbmltYXRpb24gaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnR5TGlzdCgpOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5hbmltYXRpb24uZ2V0U3RhdGUodGhpcy5wbGF5YmFja1RpbWUsIDAsIHRoaXMuY21wQW5pbWF0b3IucXVhbnRpemF0aW9uKSB8fCB7fTtcclxuXHJcbiAgICAgIGxldCBuZXdQcm9wZXJ0eUxpc3Q6IEhUTUxEaXZFbGVtZW50ID0gxpJ1aS5HZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3Iobm9kZU11dGF0b3IpO1xyXG4gICAgICBpZiAodGhpcy5kb20uY29udGFpbnModGhpcy5wcm9wZXJ0eUxpc3QpKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlcGxhY2VDaGlsZChuZXdQcm9wZXJ0eUxpc3QsIHRoaXMucHJvcGVydHlMaXN0KTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld1Byb3BlcnR5TGlzdCk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0ID0gbmV3UHJvcGVydHlMaXN0O1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5pZCA9IFwicHJvcGVydHlsaXN0XCI7XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlckFuaW1hdGlvbih0aGlzLmFuaW1hdGlvbiwgdGhpcy5wcm9wZXJ0eUxpc3QsIHRoaXMpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlKG5vZGVNdXRhdG9yKTtcclxuICAgICAgLy8gxpJ1aS1FVkVOVCBtdXN0IG5vdCBiZSBkaXNwYXRjaGVkIVxyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGknVpLkVWRU5ULkNMSUNLKSk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5wbGF5YmFja1RpbWUgfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvb2xiYXJDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAodGFyZ2V0LmlkKSB7XHJcbiAgICAgICAgY2FzZSBcInByZXZpb3VzXCI6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuY29udHJvbGxlci5uZXh0S2V5KHRoaXMucGxheWJhY2tUaW1lLCBcImJhY2t3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5pZCA9IFwicGF1c2VcIjtcclxuICAgICAgICAgICAgdGhpcy50aW1lLnNldCh0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnRpbWUuZ2V0KCkgJSB0aGlzLmFuaW1hdGlvbi50b3RhbFRpbWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibmV4dFwiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJmb3J3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhdXNlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pZEludGVydmFsID09IG51bGwpIHJldHVybjtcclxuICAgICAgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIikuaWQgPSBcInBsYXlcIjtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZW51bSBTSEVFVF9NT0RFIHtcclxuICAgIERPUEUgPSBcIkRvcGVzaGVldFwiLFxyXG4gICAgQ1VSVkVTID0gXCJDdXJ2ZXNcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBWaWV3QW5pbWF0aW9uU2VxdWVuY2Uge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uU2VxdWVuY2U7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgaW50ZXJmYWNlIFZpZXdBbmltYXRpb25LZXkge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uS2V5O1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJrZXlcIjtcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uRXZlbnQgeyAvLyBsYWJlbHMgYW5kIGV2ZW50cyBhcmUgaW1wbGVtZW50ZWQgYWxtb3N0IHRoZSBzYW1lIHdheVxyXG4gICAgZGF0YTogc3RyaW5nO1xyXG4gICAgcGF0aDJEOiBQYXRoMkQ7XHJcbiAgICB0eXBlOiBcImV2ZW50XCIgfCBcImxhYmVsXCI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFuZCBlZGl0IGFuaW1hdGlvbiBzZXF1ZW5jZXMsIGFuaW1hdGlvbiBrZXlzIGFuZCBjdXJ2ZXMgY29ubmVjdGluZyB0aGVtLlxyXG4gICAqIEBhdXRob3JzIEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdBbmltYXRpb25TaGVldCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgS0VZX1NJWkU6IG51bWJlciA9IDY7IC8vIHdpZHRoIGFuZCBoZWlnaHQgaW4gcHhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRJTUVMSU5FX0hFSUdIVDogbnVtYmVyID0gMzAuNTsgLy8gaW4gcHgsIGtlZXAgLjUgYXQgZW5kIGZvciBvZGQgbGluZSB3aWR0aFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVZFTlRTX0hFSUdIVDogbnVtYmVyID0gMzA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTQ0FMRV9XSURUSDogbnVtYmVyID0gNDA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQSVhFTF9QRVJfTUlMTElTRUNPTkQ6IG51bWJlciA9IDE7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX1ZBTFVFOiBudW1iZXIgPSAxMDA7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTUlOSU1VTV9QSVhFTF9QRVJfU1RFUDogbnVtYmVyID0gNjA7IC8vIGF0IGFueSBzY2FsaW5nLCBmb3IgYm90aCB4IGFuZCB5XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF9BTklNQVRJT05fTEVOR1RIOiBudW1iZXIgPSAxMDAwOyAvLyBpbiBtaWxpc2Vjb25kcywgdXNlZCB3aGVuIGFuaW1hdGlvbiBsZW5ndGggaXMgZmFsc3lcclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBwbGF5YmFja1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHByaXZhdGUgY3JjMjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgcHJpdmF0ZSBldmVudElucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcHJpdmF0ZSBzY3JvbGxDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQm9keTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcHJpdmF0ZSBtdHhXb3JsZFRvU2NyZWVuOiDGki5NYXRyaXgzeDMgPSBuZXcgxpIuTWF0cml4M3gzKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZEtleTogVmlld0FuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50O1xyXG4gICAgcHJpdmF0ZSBrZXlzOiBWaWV3QW5pbWF0aW9uS2V5W10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBldmVudHM6IFZpZXdBbmltYXRpb25FdmVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHNsb3BlSG9va3M6IFBhdGgyRFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBkb2N1bWVudFN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcclxuXHJcbiAgICBwcml2YXRlIHBvc1BhblN0YXJ0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoKTtcclxuICAgIHByaXZhdGUgcG9zUmlnaHRDbGljazogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcblxyXG4gICAgI21vZGU6IFNIRUVUX01PREU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIG1heWJlIHVzZSB0aGlzIHNvbHV0aW9uIGZvciBhbGwgdmlld3M/XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5pbnNldCA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUucGFkZGluZyA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5tYXJnaW4gPSBcIjAuNWVtXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuXHJcbiAgICAgIHRoaXMubW9kZSA9IFNIRUVUX01PREUuRE9QRTtcclxuXHJcbiAgICAgIF9jb250YWluZXIub24oXCJyZXNpemVcIiwgKCkgPT4gdGhpcy5kcmF3KHRydWUpKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudVNoZWV0KTtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcblxyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLm92ZXJmbG93WCA9IFwic2Nyb2xsXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJpbnN0YW50XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcmRvd24gPSB0aGlzLmhuZFBvaW50ZXJEb3duO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJ1cCA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJsZWF2ZSA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbndoZWVsID0gdGhpcy5obmRXaGVlbDtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxDb250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxCb2R5LnN0eWxlLmhlaWdodCA9IFwiMXB4XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQm9keSk7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5ldmVudElucHV0Lm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwiZXZlbnRcIikge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmV2ZW50c1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5yZW1vdmVFdmVudCh0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudCh0aGlzLmV2ZW50SW5wdXQudmFsdWUsIHRpbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuZXZlbnRJbnB1dC52YWx1ZV0gPSB0aW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSA9IHRoaXMuZXZlbnRJbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5ldmVudElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBtb2RlKCk6IFNIRUVUX01PREUge1xyXG4gICAgICByZXR1cm4gdGhpcy4jbW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBtb2RlKF9tb2RlOiBTSEVFVF9NT0RFKSB7XHJcbiAgICAgIHRoaXMuI21vZGUgPSBfbW9kZTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShfbW9kZSk7XHJcbiAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51U2hlZXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAmJiB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA8IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCkgeyAvLyBjbGljayBvbiBldmVudHNcclxuICAgICAgICBsZXQgZGVsZXRlRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmIChkZWxldGVFdmVudCkge1xyXG4gICAgICAgICAgaWYgKGRlbGV0ZUV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkRlbGV0ZSBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldEV2ZW50XCIsIGRlbGV0ZUV2ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkFkZCBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiLCB0aGlzLnNjcmVlblRvVGltZSh0aGlzLnBvc1JpZ2h0Q2xpY2sueCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wb3NSaWdodENsaWNrLnkgPiBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gdGhpcy5rZXlzLmZpbmQoX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgdGhpcy5wb3NSaWdodENsaWNrLngsIHRoaXMucG9zUmlnaHRDbGljay55KSk7XHJcbiAgICAgICAgaWYgKHRhcmdldEtleSkge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgS2V5XCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIiwgdGFyZ2V0S2V5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU0hFRVRfTU9ERS5ET1BFKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuRE9QRTtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuQ1VSVkVTKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG5cclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkRPUEUsIGxhYmVsOiBTSEVFVF9NT0RFLkRPUEUsIGNsaWNrOiAoKSA9PiB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEUgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkNVUlZFUywgbGFiZWw6IFNIRUVUX01PREUuQ1VSVkVTLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5DVVJWRVMgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkFkZCBFdmVudFwiLCBsYWJlbDogXCJBZGQgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEV2ZW50XCIsIGxhYmVsOiBcIkRlbGV0ZSBFdmVudFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgTGFiZWxcIiwgbGFiZWw6IFwiQWRkIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBMYWJlbFwiLCBsYWJlbDogXCJEZWxldGUgTGFiZWxcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEtleVwiLCBsYWJlbDogXCJEZWxldGUgS2V5XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBjaG9pY2U6IHN0cmluZyA9IF9pdGVtLmlkO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIik7XHJcbiAgICAgIGxldCB0YXJnZXRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiKTtcclxuICAgICAgbGV0IHRhcmdldFRpbWU6IG51bWJlciA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBcIkFkZCBFdmVudFwiOlxyXG4gICAgICAgICAgbGV0IGV2ZW50TmFtZTogc3RyaW5nID0gYCR7dGhpcy5hbmltYXRpb24ubmFtZX1FdmVudCR7T2JqZWN0LmtleXModGhpcy5hbmltYXRpb24uZXZlbnRzKS5sZW5ndGh9YDtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KGV2ZW50TmFtZSwgdGFyZ2V0VGltZSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGV2ZW50TmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBFdmVudFwiOlxyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGFyZ2V0RXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBZGQgTGFiZWxcIjpcclxuICAgICAgICAgIGxldCBsYWJlbE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9TGFiZWwke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxOYW1lXSA9IHRhcmdldFRpbWU7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGxhYmVsTmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBMYWJlbFwiOlxyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0YXJnZXRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBLZXlcIjpcclxuICAgICAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSB0aGlzLnNlcXVlbmNlcy5maW5kKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkuaW5jbHVkZXModGFyZ2V0S2V5LmRhdGEpKS5kYXRhO1xyXG4gICAgICAgICAgaWYgKHNlcXVlbmNlLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgxpIuRGVidWcud2FybihcIk9ubHkgb25lIGtleSBsZWZ0IGluIHNlcXVlbmNlLiBEZWxldGUgcHJvcGVydHkgaW5zdGVhZC5cIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VxdWVuY2UucmVtb3ZlS2V5KHRhcmdldEtleS5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBkcmF3aW5nXHJcbiAgICBwcml2YXRlIGRyYXcoX3Njcm9sbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kb20uY2xpZW50V2lkdGg7XHJcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuZG9tLmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgubWluKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCwgdHJhbnNsYXRpb24ueCk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uO1xyXG5cclxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUtleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaW1lbGluZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0V2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd1NjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Q3VydmVzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3S2V5cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd0hpZ2hsaWdodCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX3Njcm9sbCkge1xyXG4gICAgICAgIGxldCBsZWZ0V2lkdGg6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSDtcclxuICAgICAgICBsZXQgc2NyZWVuV2lkdGg6IG51bWJlciA9IHRoaXMuY2FudmFzLndpZHRoICsgbGVmdFdpZHRoO1xyXG4gICAgICAgIGxldCBhbmltYXRpb25XaWR0aDogbnVtYmVyID0gdGhpcy5hbmltYXRpb24/LnRvdGFsVGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggKiAyO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS53aWR0aCA9IGAke01hdGgubWF4KGFuaW1hdGlvbldpZHRoLCBzY3JlZW5XaWR0aCl9cHhgO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbExlZnQgPSBsZWZ0V2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5cygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5rZXlzID0gdGhpcy5zZXF1ZW5jZXMuZmxhdE1hcCgoX3NlcXVlbmNlLCBfaVNlcXVlbmNlKSA9PlxyXG4gICAgICAgIF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5tYXAoKF9rZXkpID0+IHtcclxuICAgICAgICAgIGxldCB2aWV3S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBfa2V5LFxyXG4gICAgICAgICAgICBjb2xvcjogX3NlcXVlbmNlLmNvbG9yLFxyXG4gICAgICAgICAgICBwYXRoMkQ6IHRoaXMuZ2VuZXJhdGVLZXkoXHJcbiAgICAgICAgICAgICAgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQoX2tleS50aW1lLCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMgPyBfa2V5LnZhbHVlIDogX2lTZXF1ZW5jZSAqIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDQpLFxyXG4gICAgICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkVcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgdHlwZTogXCJrZXlcIlxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiB2aWV3S2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICApKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkS2V5KVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVLZXkoX3Bvc2l0aW9uOiDGki5WZWN0b3IyLCBfdzogbnVtYmVyLCBfaDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8oX3Bvc2l0aW9uLnggLSBfdywgX3Bvc2l0aW9uLnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCwgX3Bvc2l0aW9uLnkgKyBfaCk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54ICsgX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55IC0gX2gpO1xyXG4gICAgICBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdUaW1lbGluZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBsZXQgYW5pbWF0aW9uU3RhcnQ6IG51bWJlciA9IE1hdGgubWluKC4uLnRoaXMua2V5cy5tYXAoX2tleSA9PiBfa2V5LmRhdGEudGltZSkpICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54O1xyXG4gICAgICBsZXQgYW5pbWF0aW9uRW5kOiBudW1iZXIgPSBNYXRoLm1heCguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjIpXCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChhbmltYXRpb25TdGFydCwgMCwgYW5pbWF0aW9uRW5kIC0gYW5pbWF0aW9uU3RhcnQsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICBsZXQgZnBzOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIGxldCBwaXhlbFBlckZyYW1lOiBudW1iZXIgPSAoMTAwMCAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpIC8gZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJTdGVwOiBudW1iZXIgPSBwaXhlbFBlckZyYW1lICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueDtcclxuICAgICAgbGV0IGZyYW1lc1BlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIGRvIHRoaXMgd2l0aCBPKDEpO1xyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDMsIDIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAyO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgZnJhbWVzUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc3ViU3RlcHM6IG51bWJlciA9IDA7XHJcbiAgICAgIGxldCBoaWdoU3RlcHM6IG51bWJlciA9IDA7IC8vIGV2ZXJ5IG50aCBzdGVwIHdpbGwgYmUgaGlnaGVyXHJcbiAgICAgIGlmIChmcmFtZXNQZXJTdGVwICE9IDEpIHtcclxuICAgICAgICBpZiAoZnJhbWVzUGVyU3RlcCA9PSA1KSB7XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXRjaCAoaU11bHRpcGxpZXJzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAzO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA1O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMjtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBncmlkTGluZXM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgbGV0IHRpbWVTdGVwczogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgdGhpcy5jcmMyLnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICB0aGlzLmNyYzIuZm9udCA9IHRoaXMuZG9jdW1lbnRTdHlsZS5mb250O1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMud2lkdGggLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB4U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KTtcclxuICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gMjApO1xyXG4gICAgICAgIGdyaWRMaW5lcy5tb3ZlVG8oeFN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcbiAgICAgICAgZ3JpZExpbmVzLmxpbmVUbyh4U3RlcCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gaVN0ZXAgKiBmcmFtZXNQZXJTdGVwIC8gZnBzO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIGAke3RpbWUudG9GaXhlZCgyKX1gLFxyXG4gICAgICAgICAgeFN0ZXAgKyAzLFxyXG4gICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeFN1YlN0ZXA6IG51bWJlciA9IHhTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICAgIHRpbWVTdGVwcy5saW5lVG8oeFN1YlN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAoaVN1YlN0ZXAgJSBoaWdoU3RlcHMgPT0gMCA/IDEyIDogOCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSh0aW1lU3RlcHMpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKGdyaWRMaW5lcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3RXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgdG90YWxIZWlnaHQ6IG51bWJlciA9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVDtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIDAuNSwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIHRvdGFsSGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdO1xyXG4gICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGxhYmVsIGluIHRoaXMuYW5pbWF0aW9uLmxhYmVscykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxdKTtcclxuICAgICAgICBsZXQgdmlld0xhYmVsOiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGxhYmVsLCBwYXRoMkQ6IGdlbmVyYXRlTGFiZWwoeCksIHR5cGU6IFwibGFiZWxcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0xhYmVsKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdMYWJlbC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IGluIHRoaXMuYW5pbWF0aW9uLmV2ZW50cykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5ldmVudHNbZXZlbnRdKTtcclxuICAgICAgICBsZXQgdmlld0V2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGV2ZW50LCBwYXRoMkQ6IGdlbmVyYXRlRXZlbnQoeCksIHR5cGU6IFwiZXZlbnRcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0V2ZW50KTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdFdmVudC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB0aGlzLmV2ZW50cy5maW5kKF9ldmVudCA9PiBfZXZlbnQuZGF0YSA9PSB0aGlzLnNlbGVjdGVkRXZlbnQ/LmRhdGEpO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdGhpcy5zZWxlY3RlZEV2ZW50ID09IG51bGw7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkRXZlbnQucGF0aDJEKTtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUubGVmdCA9IGAkeyh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIgPyB0aGlzLmFuaW1hdGlvbi5ldmVudHMgOiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIDEyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuY2xhc3NOYW1lID0gdGhpcy5zZWxlY3RlZEV2ZW50LnR5cGU7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwibGFiZWxcIilcclxuICAgICAgICAvLyAgIHRoaXMuZXZlbnRJbnB1dC5zdHlsZS50b3AgPSBgJHtWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUfXB4YDtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUIC8gMiAtIDJ9cHhgO1xyXG4gICAgICAgIHRoaXMuZXZlbnRJbnB1dC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuc2F2ZSgpO1xyXG4gICAgICB0aGlzLmNyYzIucmVjdCgwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIuY2xpcCgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVFdmVudChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMTApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSAxNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICAvLyBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZUxhYmVsKF94OiBudW1iZXIpOiBQYXRoMkQge1xyXG4gICAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEO1xyXG4gICAgICAgIHBhdGgubW92ZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDI2KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMjApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDE0KTtcclxuICAgICAgICAvLyBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1NjYWxlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY2VudGVyOiBudW1iZXIgPSB0aGlzLnJvdW5kKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gLXRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnk7XHJcbiAgICAgIGxldCB2YWx1ZVBlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAwO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgdmFsdWVQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gNDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcblxyXG4gICAgICBsZXQgc3RlcHM6IG51bWJlciA9IDEgKyB0aGlzLmNhbnZhcy5oZWlnaHQgLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB5U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3RlcCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmxpbmVUbyhWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggLSA1LCB5U3RlcCk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSAtaVN0ZXAgKiB2YWx1ZVBlclN0ZXA7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxUZXh0KFxyXG4gICAgICAgICAgdmFsdWVQZXJTdGVwID49IDEgPyB2YWx1ZS50b0ZpeGVkKDApIDogdmFsdWUudG9GaXhlZCgxKSxcclxuICAgICAgICAgIDMzLFxyXG4gICAgICAgICAgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeVN1YlN0ZXA6IG51bWJlciA9IHlTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBhZGQgY29ycmVjdCBkcmF3aW5nIGZvciBjb25zdGFudC9zdGVwIGludGVycG9sYXRlZCBrZXlzXHJcbiAgICBwcml2YXRlIGRyYXdDdXJ2ZXMoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qgc2VxdWVuY2Ugb2YgdGhpcy5zZXF1ZW5jZXMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSBzZXF1ZW5jZS5jb2xvcjtcclxuICAgICAgICBzZXF1ZW5jZS5kYXRhLmdldEtleXMoKVxyXG4gICAgICAgICAgLm1hcCgoX2tleSwgX2luZGV4LCBfa2V5cykgPT4gW19rZXksIF9rZXlzW19pbmRleCArIDFdXSlcclxuICAgICAgICAgIC5maWx0ZXIoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBfa2V5U3RhcnQgJiYgX2tleUVuZClcclxuICAgICAgICAgIC5tYXAoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBnZXRCZXppZXJQb2ludHMoX2tleVN0YXJ0LmZ1bmN0aW9uT3V0LCBfa2V5U3RhcnQsIF9rZXlFbmQpKVxyXG4gICAgICAgICAgLmZvckVhY2goKF9iZXppZXJQb2ludHMpID0+IHtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiBfcG9pbnQudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbikpO1xyXG4gICAgICAgICAgICBsZXQgY3VydmU6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgICAgICAgY3VydmUubW92ZVRvKF9iZXppZXJQb2ludHNbMF0ueCwgX2JlemllclBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgY3VydmUuYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzFdLngsIF9iZXppZXJQb2ludHNbMV0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzJdLngsIF9iZXppZXJQb2ludHNbMl0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzNdLngsIF9iZXppZXJQb2ludHNbM10ueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKGN1cnZlKTtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiDGki5SZWN5Y2xlci5zdG9yZShfcG9pbnQpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRCZXppZXJQb2ludHMoX2FuaW1hdGlvbkZ1bmN0aW9uOiDGki5BbmltYXRpb25GdW5jdGlvbiwgX2tleVN0YXJ0OiDGki5BbmltYXRpb25LZXksIF9rZXlFbmQ6IMaSLkFuaW1hdGlvbktleSk6IMaSLlZlY3RvcjJbXSB7XHJcbiAgICAgICAgbGV0IHBhcmFtZXRlcnM6IHsgYTogbnVtYmVyOyBiOiBudW1iZXI7IGM6IG51bWJlcjsgZDogbnVtYmVyIH0gPSBfYW5pbWF0aW9uRnVuY3Rpb24uZ2V0UGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNvbnN0IHBvbGFyRm9ybTogKHU6IG51bWJlciwgdjogbnVtYmVyLCB3OiBudW1iZXIpID0+IG51bWJlciA9IChfdSwgX3YsIF93KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmEgKiBfdSAqIF92ICogX3cgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmIgKiAoKF92ICogX3cgKyBfdyAqIF91ICsgX3UgKiBfdikgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuYyAqICgoX3UgKyBfdiArIF93KSAvIDMpICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5kXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHhTdGFydDogbnVtYmVyID0gX2tleVN0YXJ0LnRpbWU7XHJcbiAgICAgICAgbGV0IHhFbmQ6IG51bWJlciA9IF9rZXlFbmQudGltZTtcclxuICAgICAgICBsZXQgb2Zmc2V0VGltZUVuZDogbnVtYmVyID0geEVuZCAtIHhTdGFydDtcclxuXHJcbiAgICAgICAgbGV0IHBvaW50czogxpIuVmVjdG9yMltdID0gbmV3IEFycmF5KDQpLmZpbGwoMCkubWFwKCgpID0+IMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSk7XHJcbiAgICAgICAgcG9pbnRzWzBdLnNldCh4U3RhcnQsIHBvbGFyRm9ybSgwLCAwLCAwKSk7XHJcbiAgICAgICAgcG9pbnRzWzFdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMSAvIDMsIHBvbGFyRm9ybSgwLCAwLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzJdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMiAvIDMsIHBvbGFyRm9ybSgwLCBvZmZzZXRUaW1lRW5kLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzNdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kLCBwb2xhckZvcm0ob2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3S2V5cygpOiB2b2lkIHtcclxuICAgICAgLy8gZHJhdyB1bnNlbGVjdGVkIGtleXNcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDQ7XHJcbiAgICAgIHRoaXMua2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGlmIChfa2V5ID09IHRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IF9rZXkuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShfa2V5LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwoX2tleS5wYXRoMkQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYXcgc2VsZWN0ZWQga2V5XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuc2VsZWN0ZWRLZXkuY29sb3I7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkS2V5LnBhdGgyRCk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNsb3BlIGhvb2tzXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuY3JjMi5zdHJva2VTdHlsZTtcclxuXHJcbiAgICAgIGxldCBbbGVmdCwgcmlnaHRdID0gW8aSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSwgxpIuUmVjeWNsZXIuZ2V0KMaSLlZlY3RvcjIpXTtcclxuICAgICAgbGVmdC5zZXQoLTUwLCAwKTtcclxuICAgICAgcmlnaHQuc2V0KDUwLCAwKTtcclxuXHJcbiAgICAgIGxldCBhbmdsZVNsb3BlU2NyZWVuOiBudW1iZXIgPSBNYXRoLmF0YW4odGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gKiAodGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpKSAqICgxODAgLyBNYXRoLlBJKTsgLy8gaW4gZGVncmVlXHJcbiAgICAgIGxldCBtdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MyA9IMaSLk1hdHJpeDN4My5JREVOVElUWSgpO1xyXG4gICAgICBtdHhUcmFuc2Zvcm0udHJhbnNsYXRlKHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnJvdGF0ZShhbmdsZVNsb3BlU2NyZWVuKTtcclxuICAgICAgbGVmdC50cmFuc2Zvcm0obXR4VHJhbnNmb3JtKTtcclxuICAgICAgcmlnaHQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcblxyXG4gICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG4gICAgICBwYXRoLm1vdmVUbyhsZWZ0LngsIGxlZnQueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKHJpZ2h0LngsIHJpZ2h0LnkpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHBhdGgpO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MgPSBbdGhpcy5nZW5lcmF0ZUtleShsZWZ0LCA1LCA1KSwgdGhpcy5nZW5lcmF0ZUtleShyaWdodCwgNSwgNSldO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MuZm9yRWFjaChfaG9vayA9PiB0aGlzLmNyYzIuZmlsbChfaG9vaykpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobGVmdCk7XHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHJpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdDdXJzb3IoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5yZXN0b3JlKCk7XHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgIGxldCBjdXJzb3I6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgY3Vyc29yLm1vdmVUbyh4LCAwKTtcclxuICAgICAgY3Vyc29yLmxpbmVUbyh4LCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0hpZ2hsaWdodCgpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcG9zU2NyZWVuOiDGki5WZWN0b3IyID0gdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSk7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItaGlnaGxpZ2h0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiNjZcIjtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgMCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiMjZcIjtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBwb3NTY3JlZW4ueCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QocG9zU2NyZWVuLnggLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZXZlbnQgaGFuZGxpbmdcclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyA9PSB0aGlzKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbjtcclxuICAgICAgICAgICAgLy8gdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsICgpID0+IHRoaXMucmVzZXRWaWV3KTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFZpZXcoKTsgdGhpcy5hbmltYXRlKCk7IHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSBfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IGZpbmRPYmplY3Q6IChfb2JqZWN0OiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50KSA9PiBib29sZWFuID0gX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQuYnV0dG9ucykge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIGlmIChfZXZlbnQub2Zmc2V0WSA+ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuY2xpZW50SGVpZ2h0KSAvLyBjbGlja2VkIG9uIHNjcm9sbCBiYXJcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB0aGlzLmhuZFNjcm9sbDtcclxuICAgICAgICAgIGVsc2UgaWYgKF9ldmVudC5vZmZzZXRZIDw9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpIHtcclxuICAgICAgICAgICAgdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lKF9ldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlVGltZWxpbmU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2xvcGVIb29rcy5zb21lKF9ob29rID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9ob29rLCBfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVNsb3BlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50ID1cclxuICAgICAgICAgICAgICB0aGlzLmtleXMuZmluZChmaW5kT2JqZWN0KSB8fFxyXG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmZpbmQoZmluZE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEtleSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IG51bGwgfSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHN3aXRjaCAoc2VsZWN0ZWQudHlwZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJsYWJlbFwiOlxyXG4gICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdFdmVudDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJrZXlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlRHJhZ0tleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5zZWxlY3RlZEtleS5kYXRhIH0gfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMucG9zUmlnaHRDbGljay54ID0gX2V2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA9IF9ldmVudC5vZmZzZXRZO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgdGhpcy5wb3NQYW5TdGFydCA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVBhbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlck1vdmVUaW1lbGluZSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNjcmVlblRvVGltZShfZXZlbnQub2Zmc2V0WCk7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlU2xvcGUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB2Y3REZWx0YTogxpIuVmVjdG9yMiA9IMaSLlZlY3RvcjIuRElGRkVSRU5DRShuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpLCB0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIHZjdERlbHRhLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuU0NBTElORyjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pLnNjYWxpbmcpKTtcclxuICAgICAgbGV0IHNsb3BlOiBudW1iZXIgPSB2Y3REZWx0YS55IC8gdmN0RGVsdGEueDtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gPSBzbG9wZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlT3V0ID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlUGFuID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UodGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy5wb3NQYW5TdGFydCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFKVxyXG4gICAgICAgIHRyYW5zbGF0aW9uLnkgPSAwO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0tleSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgbGV0IHBpeGVsUGVyRnJhbWU6IG51bWJlciA9IDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1heCgwLCB0cmFuc2xhdGlvbi54KTtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgucm91bmQodHJhbnNsYXRpb24ueCAvIHBpeGVsUGVyRnJhbWUpICogcGl4ZWxQZXJGcmFtZTtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YTtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IHRoaXMuc2VxdWVuY2VzLmZpbmQoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5pbmNsdWRlcyhrZXkpKS5kYXRhO1xyXG4gICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCB0cmFuc2xhdGlvbi54LCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFIHx8IF9ldmVudC5zaGlmdEtleSA/IG51bGwgOiB0cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0ga2V5LnRpbWU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0V2ZW50ID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhLCB0aW1lKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gPSB0aW1lO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwpXHJcbiAgICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMCkgcmV0dXJuO1xyXG4gICAgICBsZXQgem9vbUZhY3RvcjogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyAxLjA1IDogMC45NTtcclxuICAgICAgbGV0IHBvc0N1cnNvcldvcmxkOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSBfZXZlbnQuc2hpZnRLZXkgPyAxIDogem9vbUZhY3RvcjtcclxuICAgICAgbGV0IHk6IG51bWJlciA9IF9ldmVudC5jdHJsS2V5IHx8IHRoaXMubW9kZSA9PSBTSEVFVF9NT0RFLkRPUEUgPyAxIDogem9vbUZhY3RvcjtcclxuXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGUocG9zQ3Vyc29yV29ybGQpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGUobmV3IMaSLlZlY3RvcjIoeCwgeSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKMaSLlZlY3RvcjIuU0NBTEUocG9zQ3Vyc29yV29ybGQsIC0xKSk7XHJcblxyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kU2Nyb2xsID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IC10aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnBsYXliYWNrVGltZSB9IH0pO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldFZpZXcoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5yZXNldCgpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpOyAvLyBhcHBseSBzY2FsaW5nXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVgoKHRoaXMuY2FudmFzLndpZHRoIC0gMiAqIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCkgLyAoKHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgfHwgVmlld0FuaW1hdGlvblNoZWV0LlNUQU5EQVJEX0FOSU1BVElPTl9MRU5HVEgpKSk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVYKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVZKC0xKTsgLy8gZmxpcCB5XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWShWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG5cclxuICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgICAgLm1hcChfa2V5ID0+IF9rZXkudmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gdmFsdWVzLnJlZHVjZSgoX2EsIF9iKSA9PiBNYXRoLm1pbihfYSwgX2IpKTsgLy8gaW4gd29ybGQgc3BhY2VcclxuICAgICAgICAgIGxldCBtYXg6IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5tYXgoX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgdmlld0hlaWdodDogbnVtYmVyID0gKHRoaXMuY2FudmFzLmhlaWdodCAtIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7IC8vIGluIHB4XHJcbiAgICAgICAgICBpZiAobWluICE9IG1heClcclxuICAgICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSh2aWV3SGVpZ2h0IC8gKCgobWF4IC0gbWluKSAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfVkFMVUUpICogMS4yKSk7XHJcbiAgICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWSh2aWV3SGVpZ2h0IC0gbWluICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVZKFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1dvcmxkUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHdvcmxkVG9TY3JlZW5Qb2ludChfeDogbnVtYmVyLCBfeTogbnVtYmVyKTogxpIuVmVjdG9yMiB7XHJcbiAgICAgIGxldCB2ZWN0b3I6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfeCwgX3kpO1xyXG4gICAgICB2ZWN0b3IudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbik7XHJcbiAgICAgIHZlY3Rvci54ID0gdGhpcy5yb3VuZCh2ZWN0b3IueCk7XHJcbiAgICAgIHZlY3Rvci55ID0gdGhpcy5yb3VuZCh2ZWN0b3IueSk7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1RpbWUoX3g6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIGxldCBwbGF5YmFja1RpbWU6IG51bWJlciA9IE1hdGgubWF4KDAsIChfeCAtIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpO1xyXG4gICAgICByZXR1cm4gcGxheWJhY2tUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZVRvU2NyZWVuKF90aW1lOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3VuZChfdGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByb3VuZChfdmFsdWU6IG51bWJlcik6IG51bWJlciB7IC8vIHRoaXMgaXMgbmVlZGVkIGZvciBsaW5lcyB0byBiZSBkaXNwbGF5ZWQgY3Jpc3Agb24gdGhlIGNhbnZhc1xyXG4gICAgICBpZiAoTWF0aC50cnVuYyh0aGlzLmNyYzIubGluZVdpZHRoKSAlIDIgPT0gMClcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpOyAvLyBldmVuIGxpbmUgd2lkdGhcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKF92YWx1ZSkgKyAwLjU7IC8vIG9kZCBsaW5lIHdpZHRoXHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gTUVOVSB7XHJcbiAgICBDT01QT05FTlRNRU5VID0gXCJBZGQgQ29tcG9uZW50c1wiXHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBleGFtaW4gcHJvYmxlbSB3aXRoIMaSLk1hdGVyaWFsIHdoZW4gdXNpbmcgXCJ0eXBlb2YgxpIuTXV0YWJsZVwiIGFzIGtleSB0byB0aGUgbWFwXHJcbiAgbGV0IHJlc291cmNlVG9Db21wb25lbnQ6IE1hcDxGdW5jdGlvbiwgdHlwZW9mIMaSLkNvbXBvbmVudD4gPSBuZXcgTWFwPEZ1bmN0aW9uLCB0eXBlb2YgxpIuQ29tcG9uZW50PihbXHJcbiAgICBbxpIuQXVkaW8sIMaSLkNvbXBvbmVudEF1ZGlvXSxcclxuICAgIFvGki5NYXRlcmlhbCwgxpIuQ29tcG9uZW50TWF0ZXJpYWxdLFxyXG4gICAgW8aSLk1lc2gsIMaSLkNvbXBvbmVudE1lc2hdLFxyXG4gICAgW8aSLkFuaW1hdGlvbiwgxpIuQ29tcG9uZW50QW5pbWF0b3JdLFxyXG4gICAgW8aSLlBhcnRpY2xlU3lzdGVtLCDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbV1cclxuICBdKTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbGwgY29tcG9uZW50cyBhdHRhY2hlZCB0byBhIG5vZGVcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdDb21wb25lbnRzIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIGV4cGFuZGVkOiB7IFt0eXBlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7IENvbXBvbmVudFRyYW5zZm9ybTogdHJ1ZSB9O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZDogc3RyaW5nID0gXCJDb21wb25lbnRUcmFuc2Zvcm1cIjtcclxuICAgIHByaXZhdGUgZHJhZzogxpIuQ29tcG9uZW50Q2FtZXJhO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgdGhpcy5obmRUcmFuc2Zvcm0pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkVYUEFORCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT0xMQVBTRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLkNvbXBvbmVudENhbWVyYVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZHJhZyA/IFt0aGlzLmRyYWddIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0NPTVBPTkVOVCwgxpIuQ29tcG9uZW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBKb2ludFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5BRERfSk9JTlQsIMaSLkpvaW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0pPSU5ULCDGki5Kb2ludCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgQ29tcG9uZW50XCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX0NPTVBPTkVOVCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgaVN1YmNsYXNzOiBudW1iZXIgPSBfaXRlbVtcImlTdWJjbGFzc1wiXTtcclxuICAgICAgbGV0IGNvbXBvbmVudDogdHlwZW9mIMaSLkNvbXBvbmVudDtcclxuXHJcbiAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuQ29tcG9uZW50LnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX0pPSU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuSm9pbnQuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkJPRFlcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50LnRhZ05hbWUpO1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KGVsZW1lbnQsIFwiY29udHJvbGxlclwiKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkRFVEFJTFNcIiAmJiBjb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGRldGFpbDogeyBtdXRhYmxlOiA8xpIuTXV0YWJsZT5jb250cm9sbGVyLmdldE11dGFibGUoKSB9IH0pO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjb21wb25lbnQpIC8vIGV4cGVyaW1lbnRhbCBmaXggZm9yIHRoZSBzcG9yYWRpYyBcImNvbXBvbmVudCBpcyBub3QgYSBjb25zdHJ1Y3RvclwiIGJ1Z1xyXG4gICAgICAgIGNvbXBvbmVudCA9IMaSW19pdGVtLmxhYmVsXTtcclxuXHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICBsZXQgY21wTmV3OiDGki5Db21wb25lbnQgPSBuZXcgY29tcG9uZW50KCk7XHJcbiAgICAgIGlmICgoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5IHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFZSRGV2aWNlIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFdhbGtlcikgJiYgIXRoaXMubm9kZS5jbXBUcmFuc2Zvcm0pIHtcclxuICAgICAgICDGklVpLkRpYWxvZy5wcm9tcHQobnVsbCwgdHJ1ZSwgXCJDb21wb25lbnRUcmFuc2Zvcm0gbWFuZGF0b3J5XCIsIGBUbyBhdHRhY2ggYSAke2NtcE5ldy50eXBlfSwgZmlyc3QgYXR0YWNoIGEgJHvGki5Db21wb25lbnRUcmFuc2Zvcm0ubmFtZX0uYCwgXCJPS1wiLCBcIlwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEdyYXBoRmlsdGVyICYmICEodGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGgpKSB7XHJcbiAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIFwiUm9vdCBub2RlIG9ubHlcIiwgYEF0dGFjaCAke8aSLkNvbXBvbmVudEdyYXBoRmlsdGVyLm5hbWV9IHRvIHRoZSByb290IG5vZGUgb2YgYSBncmFwaGAsIFwiT0tcIiwgXCJcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5ub2RlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEZvZyB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRBbWJpZW50T2NjbHVzaW9uIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEJsb29tKSB7XHJcbiAgICAgICAgbGV0IGNhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRDYW1lcmEpID8/IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50VlJEZXZpY2UpO1xyXG4gICAgICAgIGlmICghY2FtZXJhKSB7XHJcbiAgICAgICAgICDGklVpLkRpYWxvZy5wcm9tcHQobnVsbCwgdHJ1ZSwgXCJQb3N0LVByb2Nlc3MgZWZmZWN0XCIsIGBUbyBhdHRhY2ggYSAke2NtcE5ldy50eXBlfSwgZmlyc3QgYXR0YWNoIGEgJHvGki5Db21wb25lbnRDYW1lcmEubmFtZX0gb3IgJHvGki5Db21wb25lbnRWUkRldmljZS5uYW1lfS5gLCBcIk9LXCIsIFwiXCIpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGNtcE5ldy50eXBlLCBjbXBOZXcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLm5vZGUgfSB9KTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLm5vZGUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBpZiAodGhpcy5kb20gIT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdTY3JpcHQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBpZiAoIXNvdXJjZS5pc0NvbXBvbmVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZmluZENvbXBvbmVudFR5cGUoc291cmNlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgLy8gICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGxldCBjbXBOZXc6IMaSLkNvbXBvbmVudCA9IHRoaXMuY3JlYXRlQ29tcG9uZW50KHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICAgIHRoaXMuZXhwYW5kZWRbY21wTmV3LnR5cGVdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByb3RlY3RHcmFwaEluc3RhbmNlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAvLyBpbmhpYml0IHN0cnVjdHVyYWwgY2hhbmdlcyB0byBhIEdyYXBoSW5zdGFuY2VcclxuICAgICAgbGV0IGNoZWNrOiDGki5Ob2RlID0gdGhpcy5ub2RlO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgaWYgKGNoZWNrIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSkge1xyXG4gICAgICAgICAgxpJVaS5EaWFsb2cucHJvbXB0KG51bGwsIHRydWUsIFwiU3RydWN0dXJhbCBjaGFuZ2Ugb24gaW5zdGFuY2VcIiwgYEVkaXQgdGhlIG9yaWdpbmFsIGdyYXBoIFwiJHtjaGVjay5uYW1lfVwiIHRvIG1ha2UgY2hhbmdlcyB0byBpdHMgc3RydWN0dXJlLCB0aGVuIHNhdmUgYW5kIHJlbG9hZCB0aGUgcHJvamVjdGAsIFwiT0tcIiwgXCJcIik7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hlY2sgPSBjaGVjay5nZXRQYXJlbnQoKTtcclxuICAgICAgfSB3aGlsZSAoY2hlY2spO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIGxldCBjbnRFbXB0eTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjbnRFbXB0eS50ZXh0Q29udGVudCA9IFwiRHJvcCBpbnRlcm5hbCByZXNvdXJjZXMgb3IgdXNlIHJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgY29tcG9uZW50c1wiO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwiRHJvcCBpbnRlcm5hbCByZXNvdXJjZXMgb3IgdXNlIHJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgY29tcG9uZW50c1wiO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLm5vZGUgfHwgISh0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5Ob2RlKSkgeyAgLy8gVE9ETzogZXhhbWluZSwgaWYgYW55dGhpbmcgb3RoZXIgdGhhbiBub2RlIGNhbiBhcHBlYXIgaGVyZS4uLlxyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJDb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCJTZWxlY3Qgbm9kZSB0byBlZGl0IGNvbXBvbmVudHNcIjtcclxuICAgICAgICBjbnRFbXB0eS50ZXh0Q29udGVudCA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBjb21wb25lbnRzXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGNudEVtcHR5KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoXCJDb21wb25lbnRzIHwgXCIgKyB0aGlzLm5vZGUubmFtZSk7XHJcblxyXG4gICAgICBsZXQgY29tcG9uZW50czogxpIuQ29tcG9uZW50W10gPSB0aGlzLm5vZGUuZ2V0QWxsQ29tcG9uZW50cygpO1xyXG4gICAgICBpZiAoIWNvbXBvbmVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGNudEVtcHR5KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgbGV0IGRldGFpbHM6IMaSVWkuRGV0YWlscyA9IMaSVWkuR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShjb21wb25lbnQpO1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gbmV3IENvbnRyb2xsZXJEZXRhaWwoY29tcG9uZW50LCBkZXRhaWxzLCB0aGlzKTtcclxuICAgICAgICBSZWZsZWN0LnNldChkZXRhaWxzLCBcImNvbnRyb2xsZXJcIiwgY29udHJvbGxlcik7IC8vIGluc2VydCBhIGxpbmsgYmFjayB0byB0aGUgY29udHJvbGxlclxyXG4gICAgICAgIGRldGFpbHMuZXhwYW5kKHRoaXMuZXhwYW5kZWRbY29tcG9uZW50LnR5cGVdKTtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmQoZGV0YWlscyk7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudENhbWVyYSkge1xyXG4gICAgICAgICAgZGV0YWlscy5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgZGV0YWlscy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIChfZXZlbnQ6IEV2ZW50KSA9PiB7IHRoaXMuZHJhZyA9IDzGki5Db21wb25lbnRDYW1lcmE+Y29tcG9uZW50OyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFJpZ2lkYm9keSkge1xyXG4gICAgICAgICAgbGV0IHBpdm90OiBIVE1MRWxlbWVudCA9IGNvbnRyb2xsZXIuZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2tleT0nbXR4UGl2b3QnXCIpO1xyXG4gICAgICAgICAgbGV0IG9wYWNpdHk6IHN0cmluZyA9IHBpdm90LnN0eWxlLm9wYWNpdHk7XHJcbiAgICAgICAgICBzZXRQaXZvdE9wYWNpdHkobnVsbCk7XHJcbiAgICAgICAgICBjb250cm9sbGVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULk1VVEFURSwgc2V0UGl2b3RPcGFjaXR5KTtcclxuICAgICAgICAgIGZ1bmN0aW9uIHNldFBpdm90T3BhY2l0eShfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXphdGlvbjogxpIuQk9EWV9JTklUID0gY29udHJvbGxlci5nZXRNdXRhdG9yKHsgaW5pdGlhbGl6YXRpb246IDAgfSkuaW5pdGlhbGl6YXRpb247XHJcbiAgICAgICAgICAgIHBpdm90LnN0eWxlLm9wYWNpdHkgPSBpbml0aWFsaXphdGlvbiA9PSDGki5CT0RZX0lOSVQuVE9fUElWT1QgPyBvcGFjaXR5IDogXCIwLjNcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEZhY2VDYW1lcmEpIHtcclxuICAgICAgICAgIGxldCB1cDogSFRNTEVsZW1lbnQgPSBjb250cm9sbGVyLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltrZXk9J3VwJ1wiKTtcclxuICAgICAgICAgIGxldCBvcGFjaXR5OiBzdHJpbmcgPSB1cC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgICAgICAgc2V0VXBPcGFjaXR5KG51bGwpO1xyXG4gICAgICAgICAgY29udHJvbGxlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHNldFVwT3BhY2l0eSk7XHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRVcE9wYWNpdHkoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgdXBMb2NhbDogYm9vbGVhbiA9IGNvbnRyb2xsZXIuZ2V0TXV0YXRvcih7IHVwTG9jYWw6IHRydWUgfSkudXBMb2NhbDtcclxuICAgICAgICAgICAgdXAuc3R5bGUub3BhY2l0eSA9ICF1cExvY2FsID8gb3BhY2l0eSA6IFwiMC4zXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZXRhaWxzLmdldEF0dHJpYnV0ZShcImtleVwiKSA9PSB0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoZGV0YWlscywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICB0aGlzLm5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGUgfHwgX2V2ZW50LmRldGFpbC5ncmFwaDtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgbGV0IGNvbXBvbmVudDogxpIuQ29tcG9uZW50ID0gPMaSLkNvbXBvbmVudD5fZXZlbnQuZGV0YWlsLm11dGFibGU7XHJcbiAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5LRVlfRE9XTjpcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuQ0xJQ0s6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGxldCB0YXJnZXQ6IMaSVWkuRGV0YWlscyA9IDzGklVpLkRldGFpbHM+X2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PSBcIlNVTU1BUllcIilcclxuICAgICAgICAgICAgdGFyZ2V0ID0gPMaSVWkuRGV0YWlscz50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICghKF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRGV0YWlsc0VsZW1lbnQgfHwgKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KSkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9tLnJlcGxhY2VDaGlsZCh0YXJnZXQsIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCB8fCB0aGlzLmdldFNlbGVjdGVkKCkgIT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0KHRhcmdldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gY2F0Y2ggKF9lOiB1bmtub3duKSB7IC8qICovIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5FWFBBTkQ6XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkNPTExBUFNFOlxyXG4gICAgICAgICAgdGhpcy5leHBhbmRlZFsoPMaSVWkuRGV0YWlscz5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpXSA9IChfZXZlbnQudHlwZSA9PSDGklVpLkVWRU5ULkVYUEFORCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXJEZXRhaWwgPSBSZWZsZWN0LmdldChfZXZlbnQudGFyZ2V0LCBcImNvbnRyb2xsZXJcIik7XHJcbiAgICAgICAgICBsZXQgbXV0YWJsZTogxpIuQ29tcG9uZW50ID0gPMaSLkNvbXBvbmVudD5jb250cm9sbGVyLmdldE11dGFibGUoKTtcclxuICAgICAgICAgIGlmIChtdXRhYmxlIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5KSB7XHJcbiAgICAgICAgICAgIG11dGFibGUuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IHRoaXMubm9kZSB9IH0pOyAvLyBUT0RPOiBjaGVjayBpZiB0aGlzIHdhcyBuZWNlc3NhcnksIEVWRU5UX0VESVRPUi5VUERBVEUgZ2V0cyBicm9hZGNhc3RlZCBieSBwcm9qZWN0IG9uIMaSLkVWRU5ULkdSQVBIX01VVEFURUQsIHNvIHRoaXMgd2FzIGNhdXNpbmcgYSBkb3VibGUgYnJvYWRjYXN0IG9mIEVWRU5UX0VESVRPUi5VUERBVEUgdG8gQUxMIHZpZXdzIG9uIGFueSBjaGFuZ2UgdG8gYW55IGNvbXBvbmVudFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGklVpLkVWRU5ULlJFQVJSQU5HRV9BUlJBWTogLy8gbm8gbGlzdGVuZXIgZm9yIHRoaXMgZXZlbnRcclxuICAgICAgICAvLyAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFRyYW5zZm9ybSA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5nZXRTZWxlY3RlZCgpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyRGV0YWlsID0gUmVmbGVjdC5nZXQodGhpcy5nZXRTZWxlY3RlZCgpLCBcImNvbnRyb2xsZXJcIik7XHJcbiAgICAgIGxldCBjb21wb25lbnQ6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+Y29udHJvbGxlci5nZXRNdXRhYmxlKCk7XHJcbiAgICAgIGxldCBtdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDR4NCA9IFJlZmxlY3QuZ2V0KGNvbXBvbmVudCwgXCJtdHhMb2NhbFwiKSB8fCBSZWZsZWN0LmdldChjb21wb25lbnQsIFwibXR4UGl2b3RcIik7XHJcbiAgICAgIGlmICghbXR4VHJhbnNmb3JtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBkdGw6IMaSLkdlbmVyYWwgPSBfZXZlbnQuZGV0YWlsLnRyYW5zZm9ybTtcclxuICAgICAgbGV0IG10eENhbWVyYTogxpIuTWF0cml4NHg0ID0gKDzGki5Db21wb25lbnRDYW1lcmE+ZHRsLmNhbWVyYSkubm9kZS5tdHhXb3JsZDtcclxuICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBtdHhDYW1lcmEuZ2V0VHJhbnNsYXRpb25Ubyh0aGlzLm5vZGUubXR4V29ybGQpLm1hZ25pdHVkZTtcclxuICAgICAgaWYgKGR0bC50cmFuc2Zvcm0gPT0gVFJBTlNGT1JNLlJPVEFURSlcclxuICAgICAgICBbZHRsLngsIGR0bC55XSA9IFtkdGwueSwgZHRsLnhdO1xyXG5cclxuICAgICAgbGV0IHZhbHVlOiDGki5WZWN0b3IzID0gbmV3IMaSLlZlY3RvcjMoKTtcclxuICAgICAgdmFsdWUueCA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ4XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/IGR0bC54IDogdW5kZWZpbmVkO1xyXG4gICAgICB2YWx1ZS55ID0gKGR0bC5yZXN0cmljdGlvbiA9PSBcInlcIiA/ICFkdGwuaW52ZXJ0ZWQgOiBkdGwuaW52ZXJ0ZWQpID8gLWR0bC55IDogdW5kZWZpbmVkO1xyXG4gICAgICB2YWx1ZS56ID0gKGR0bC5yZXN0cmljdGlvbiA9PSBcInpcIiA/ICFkdGwuaW52ZXJ0ZWQgOiBkdGwuaW52ZXJ0ZWQpID9cclxuICAgICAgICAoKHZhbHVlLnggPT0gdW5kZWZpbmVkKSA/IC1kdGwueSA6IGR0bC54KSA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoKF9jOiBudW1iZXIpID0+IF9jIHx8IDApO1xyXG5cclxuICAgICAgaWYgKG10eFRyYW5zZm9ybSBpbnN0YW5jZW9mIMaSLk1hdHJpeDR4NClcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybTMoZHRsLnRyYW5zZm9ybSwgdmFsdWUsIG10eFRyYW5zZm9ybSwgZGlzdGFuY2UpO1xyXG4gICAgICBpZiAobXR4VHJhbnNmb3JtIGluc3RhbmNlb2YgxpIuTWF0cml4M3gzKVxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtMihkdGwudHJhbnNmb3JtLCB2YWx1ZS50b1ZlY3RvcjIoKSwgbXR4VHJhbnNmb3JtLCAxKTtcclxuXHJcbiAgICAgIGNvbXBvbmVudC5tdXRhdGUoY29tcG9uZW50LmdldE11dGF0b3IoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtMyhfdHJhbnNmb3JtOiBUUkFOU0ZPUk0sIF92YWx1ZTogxpIuVmVjdG9yMywgX210eFRyYW5zZm9ybTogxpIuTWF0cml4NHg0LCBfZGlzdGFuY2U6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBzd2l0Y2ggKF90cmFuc2Zvcm0pIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclRyYW5zbGF0aW9uICogX2Rpc3RhbmNlKTtcclxuICAgICAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb247XHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JSb3RhdGlvbjogbnVtYmVyID0gMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JSb3RhdGlvbik7XHJcbiAgICAgICAgICBsZXQgcm90YXRpb246IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgcm90YXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5TQ0FMRTpcclxuICAgICAgICAgIGxldCBmYWN0b3JTY2FsaW5nOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JTY2FsaW5nKTtcclxuICAgICAgICAgIGxldCBzY2FsaW5nOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS5zY2FsaW5nO1xyXG4gICAgICAgICAgc2NhbGluZy5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0uc2NhbGluZyA9IHNjYWxpbmc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtMihfdHJhbnNmb3JtOiBUUkFOU0ZPUk0sIF92YWx1ZTogxpIuVmVjdG9yMiwgX210eFRyYW5zZm9ybTogxpIuTWF0cml4M3gzLCBfZGlzdGFuY2U6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBzd2l0Y2ggKF90cmFuc2Zvcm0pIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclRyYW5zbGF0aW9uICogX2Rpc3RhbmNlKTtcclxuICAgICAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb247XHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JSb3RhdGlvbjogbnVtYmVyID0gMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JSb3RhdGlvbik7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnJvdGF0aW9uICs9IF92YWx1ZS54O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yU2NhbGluZzogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yU2NhbGluZyk7XHJcbiAgICAgICAgICBsZXQgc2NhbGluZzogxpIuVmVjdG9yMiA9IF9tdHhUcmFuc2Zvcm0uc2NhbGluZztcclxuICAgICAgICAgIHNjYWxpbmcuYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdChfZGV0YWlsczogxpJVaS5EZXRhaWxzLCBfZm9jdXM6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZG9tLmNoaWxkcmVuKVxyXG4gICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgX2RldGFpbHMuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkID0gX2RldGFpbHMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBpZiAoX2ZvY3VzKVxyXG4gICAgICAgIF9kZXRhaWxzLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZCgpOiDGklVpLkRldGFpbHMge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmRvbS5jaGlsZHJlbilcclxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VsZWN0ZWRcIikpXHJcbiAgICAgICAgICByZXR1cm4gPMaSVWkuRGV0YWlscz5jaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudChfcmVzb3VyY2U6IE9iamVjdCk6IMaSLkNvbXBvbmVudCB7XHJcbiAgICAgIGlmIChfcmVzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKVxyXG4gICAgICAgIGlmIChfcmVzb3VyY2UuaXNDb21wb25lbnQpXHJcbiAgICAgICAgICByZXR1cm4gbmV3ICg8xpIuR2VuZXJhbD5fcmVzb3VyY2Uuc2NyaXB0KSgpO1xyXG5cclxuICAgICAgbGV0IHR5cGVDb21wb25lbnQ6IHR5cGVvZiDGki5Db21wb25lbnQgPSB0aGlzLmZpbmRDb21wb25lbnRUeXBlKF9yZXNvdXJjZSk7XHJcbiAgICAgIHJldHVybiBuZXcgKDzGki5HZW5lcmFsPnR5cGVDb21wb25lbnQpKF9yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kQ29tcG9uZW50VHlwZShfcmVzb3VyY2U6IE9iamVjdCk6IHR5cGVvZiDGki5Db21wb25lbnQge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiByZXNvdXJjZVRvQ29tcG9uZW50KVxyXG4gICAgICAgIGlmIChfcmVzb3VyY2UgaW5zdGFuY2VvZiBlbnRyeVswXSlcclxuICAgICAgICAgIHJldHVybiBlbnRyeVsxXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIHN0b3JlU2VsZWN0ZWQoKTogdm9pZCB7XHJcbiAgICAvLyAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIGhpZXJhcmNoeSBvZiBhIGdyYXBoIGFzIHRyZWUtY29udHJvbFxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SGllcmFyY2h5IGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIGdyYXBoOiDGki5HcmFwaDtcclxuICAgIHByaXZhdGUgdHJlZTogxpJVaS5DdXN0b21UcmVlPMaSLk5vZGU+O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3Rpb25QcmV2aW91czogxpIuTm9kZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0R3JhcGgobnVsbCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICAvLyBhIHNlbGVjdCBldmVudCB3aWxsIGJlIHJlY2l2ZWQgZnJvbSB0aGUgcGFuZWwgZHVyaW5nIHJlY29uc3RydWN0aW9uIHNvIHdlIG9ubHkgbmVlZCB0byBwcmVwYXJlIG91ciBzdG9yYWdlIGhlcmVcclxuICAgICAgaWYgKF9zdGF0ZVtcImdyYXBoXCJdICYmIF9zdGF0ZVtcImV4cGFuZGVkXCJdICYmICF0aGlzLnJlc3RvcmVFeHBhbmRlZChfc3RhdGVbXCJncmFwaFwiXSkpXHJcbiAgICAgICAgdGhpcy5zdG9yZUV4cGFuZGVkKF9zdGF0ZVtcImdyYXBoXCJdLCBfc3RhdGVbXCJleHBhbmRlZFwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgc2VsZWN0aW9uKCk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEdyYXBoKF9ncmFwaDogxpIuR3JhcGgpOiB2b2lkIHtcclxuICAgICAgaWYgKCFfZ3JhcGgpIHtcclxuICAgICAgICB0aGlzLmdyYXBoID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmFwaCAmJiB0aGlzLnRyZWUpXHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmdyYXBoKVxyXG4gICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZCh0aGlzLmdyYXBoLmlkUmVzb3VyY2UsIHRoaXMuZ2V0RXhwYW5kZWQoKSk7XHJcblxyXG4gICAgICB0aGlzLmdyYXBoID0gX2dyYXBoO1xyXG4gICAgICAvLyB0aGlzLnNlbGVjdGVkTm9kZSA9IG51bGw7XHJcblxyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJVaS5DdXN0b21UcmVlPMaSLk5vZGU+KG5ldyBDb250cm9sbGVyVHJlZUhpZXJhcmNoeSgpLCB0aGlzLmdyYXBoKTtcclxuICAgICAgLy8gdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5ERUxFVEUsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kVHJlZUV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayBvbiBleGlzdGluZyBub2RlIHRvIGNyZWF0ZSBjaGlsZCBub2RlLlxcbuKXjyBVc2UgQ29weS9QYXN0ZSB0byBkdXBsaWNhdGUgbm9kZXMuXCI7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBvciBkdXBsaWNhdGUuXCI7XHJcblxyXG4gICAgICBsZXQgZXhwYW5kZWQ6IHN0cmluZ1tdID0gdGhpcy5yZXN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlKTtcclxuICAgICAgaWYgKGV4cGFuZGVkKVxyXG4gICAgICAgIHRoaXMuZXhwYW5kKGV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjsgLy8gY29udGludWUgd2l0aCBzdGFuZGFyZCB0cmVlIGJlaGF2aW91clxyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJlZSlcclxuICAgICAgICAgIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKS5maWx0ZXIoKF9zb3VyY2UpOiBfc291cmNlIGlzIMaSLkdyYXBoID0+IF9zb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMgfHwgX2V2ZW50LnRhcmdldCA9PSB0aGlzLnRyZWUpXHJcbiAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZSB3aXRoIHN0YW5kYXJkIHRyZWUgYmVoYXZpb3VyXHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpbnN0YW5jZXM6IMaSLkdyYXBoSW5zdGFuY2VbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBncmFwaCBvZiB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzKVxyXG4gICAgICAgIGlmIChncmFwaCBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgaW5zdGFuY2VzLnB1c2goYXdhaXQgxpIuUHJvamVjdC5jcmVhdGVHcmFwaEluc3RhbmNlKGdyYXBoKSk7XHJcblxyXG4gICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gaW5zdGFuY2VzO1xyXG4gICAgICB0aGlzLnRyZWUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoxpJVaS5FVkVOVC5EUk9QLCB7IGJ1YmJsZXM6IGZhbHNlIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJBZGQgTm9kZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9OT0RFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiTlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZS0gLyBBY3Z0aXZhdGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BQ1RJVkFURV9OT0RFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiQVwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgZm9jdXM6IMaSLk5vZGUgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKF9pdGVtLmlkKSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX05PREU6XHJcbiAgICAgICAgICBsZXQgaW5zdGFuY2U6IMaSLkdyYXBoSW5zdGFuY2UgPSBpbkdyYXBoSW5zdGFuY2UoZm9jdXMsIGZhbHNlKTtcclxuICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICDGklVpLkRpYWxvZy5wcm9tcHQobnVsbCwgdHJ1ZSwgYEEgPGk+Z3JhcGggaW5zdGFuY2U8L2k+IGdldHMgcmVjcmVhdGVkIGZyb20gdGhlIG9yaWdpbmFsIGdyYXBoYCxgVG8gYWRkIG5vZGVzLCBlZGl0IHRoZSBncmFwaCBcIiR7aW5zdGFuY2UubmFtZX1cIiwgdGhlbiBzYXZlIGFuZCByZWxvYWQgdGhlIHByb2plY3Q8YnI+UHJlc3MgT0sgdG8gY29udGludWVgLCBcIk9LXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgY2hpbGQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIk5ldyBOb2RlXCIpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmFkZENoaWxkcmVuKFtjaGlsZF0sIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShjaGlsZCkuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5zZWxlY3RJbnRlcnZhbChjaGlsZCwgY2hpbGQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BQ1RJVkFURV9OT0RFOlxyXG4gICAgICAgICAgZm9jdXMuYWN0aXZhdGUoIWZvY3VzLmlzQWN0aXZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfTk9ERTpcclxuICAgICAgICAgIC8vIGZvY3VzLmFkZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIC8vIHRoaXMudHJlZS5kZWxldGUoW2ZvY3VzXSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kZWxldGUoW2ZvY3VzXSkudGhlbihfZGVsZXRlZCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfZGVsZXRlZC5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGZvY3VzLmdldFBhcmVudCgpLnJlbW92ZUNoaWxkKGZvY3VzKTtcclxuICAgICAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLmdyYXBoKTtcclxuICAgICAgICAgICAgxpIuUGh5c2ljcy5jbGVhbnVwKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCk6IFZpZXdTdGF0ZSB7XHJcbiAgICAgIGxldCBzdGF0ZTogVmlld1N0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcclxuICAgICAgc3RhdGVbXCJleHBhbmRlZFwiXSA9IHRoaXMuZ2V0RXhwYW5kZWQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBFdmVudEhhbmRsZXJzXHJcbiAgICBwcml2YXRlIGhuZFRyZWVFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBub2RlOiDGki5Ob2RlID0gX2V2ZW50LmRldGFpbD8uZGF0YTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5SRU5BTUU6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgxpIuR3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuU0VMRUNUOlxyXG4gICAgICAgICAgLy9vbmx5IGRpc3BhdGNoIHRoZSBldmVudCB0byBmb2N1cyB0aGUgbm9kZSwgaWYgdGhlIG5vZGUgaXMgaW4gdGhlIGN1cnJlbnQgYW5kIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gXHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25QcmV2aW91cy5pbmNsdWRlcyhub2RlKSAmJiB0aGlzLnNlbGVjdGlvbi5pbmNsdWRlcyhub2RlKSlcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuRk9DVVMsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IG5vZGUsIHZpZXc6IHRoaXMgfSB9KTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUHJldmlvdXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBub2RlOiBub2RlLCB2aWV3OiB0aGlzIH0gfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKF9ldmVudC5kZXRhaWwuZ3JhcGgpO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuc2hvdyhfZXZlbnQuZGV0YWlsLm5vZGUuZ2V0UGF0aCgpKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uID0gW19ldmVudC5kZXRhaWwubm9kZV07XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5kaXNwbGF5U2VsZWN0aW9uKHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUHJldmlvdXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGgodGhpcy5ncmFwaCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGlmICh0aGlzLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcsIF9leHBhbmRlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19pZEdyYXBofWAsIEpTT04uc3RyaW5naWZ5KF9leHBhbmRlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZUV4cGFuZGVkKF9pZEdyYXBoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGxldCBzdG9yZWQ6IHN0cmluZyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5pZH1fJHtfaWRHcmFwaH1gKTtcclxuICAgICAgcmV0dXJuIHN0b3JlZCAmJiBKU09OLnBhcnNlKHN0b3JlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWU/LmdldEV4cGFuZGVkKCkubWFwKF9pdGVtID0+IMaSLk5vZGUuUEFUSF9GUk9NX1RPKHRoaXMuZ3JhcGgsIF9pdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiDGki5Ob2RlW11bXSA9IF9wYXRoc1xyXG4gICAgICAgIC5tYXAoX3BhdGggPT4gxpIuTm9kZS5GSU5EPMaSLk5vZGU+KHRoaXMuZ3JhcGgsIF9wYXRoKSlcclxuICAgICAgICAuZmlsdGVyKF9ub2RlID0+IF9ub2RlKVxyXG4gICAgICAgIC5tYXAoX25vZGUgPT4gX25vZGUuZ2V0UGF0aCgpKTtcclxuXHJcbiAgICAgIHRoaXMudHJlZT8uZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHJlbmRlcmluZyBvZiBhIGdyYXBoIGluIGEgdmlld3BvcnQgd2l0aCBhbiBpbmRlcGVuZGVudCBjYW1lcmFcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdSZW5kZXIgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgY21yT3JiaXQ6IMaSQWlkLkNhbWVyYU9yYml0O1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGdyYXBoOiDGki5HcmFwaDtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgbm9kZUxpZ2h0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJJbGx1bWluYXRpb25cIik7IC8vIGtlZXBzIGxpZ2h0IGNvbXBvbmVudHMgZm9yIGRhcmsgZ3JhcGhzXHJcbiAgICBwcml2YXRlIHJlZHJhd0lkOiBudW1iZXI7XHJcbiAgICAjcG9pbnRlck1vdmVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlVXNlckludGVyZmFjZSgpO1xyXG5cclxuICAgICAgbGV0IHRpdGxlOiBzdHJpbmcgPSBcIuKXjyBEcm9wIGEgZ3JhcGggZnJvbSBcXFwiSW50ZXJuYWxcXFwiIGhlcmUuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIFVzZSBtb3VzZWJ1dHRvbnMgYW5kIGN0cmwtLCBzaGlmdC0gb3IgYWx0LWtleSB0byBuYXZpZ2F0ZSBlZGl0b3IgY2FtZXJhLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBEcm9wIGNhbWVyYSBjb21wb25lbnQgaGVyZSB0byBzZWUgdGhyb3VnaCB0aGF0IGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gTWFuaXB1bGF0ZSB0cmFuc2Zvcm1hdGlvbnMgaW4gdGhpcyB2aWV3OlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBDbGljayB0byBzZWxlY3Qgbm9kZSwgcmlnaHRjbGljayB0byBzZWxlY3QgdHJhbnNmb3JtYXRpb25zLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBTZWxlY3QgY29tcG9uZW50IHRvIG1hbmlwdWxhdGUgaW4gdmlldyBDb21wb25lbnRzLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIiAgLSBIb2xkIFgsIFkgb3IgWiBhbmQgbW92ZSBtb3VzZSB0byB0cmFuc2Zvcm0uIEFkZCBzaGlmdC1rZXkgdG8gaW52ZXJ0IHJlc3RyaWN0aW9uLlxcblwiO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICB0aGlzLmRvbS50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB0aGlzLiNwb2ludGVyTW92ZWQgPSBmYWxzZSk7IC8vIHJlc2V0IHBvaW50ZXIgbW92ZVxyXG5cclxuICAgICAgaWYgKF9zdGF0ZVtcImdpem1vc0ZpbHRlclwiXSkge1xyXG4gICAgICAgIGxldCBnaXptb3NGaWx0ZXI6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcChfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl0pO1xyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGdpem1vc0ZpbHRlcilcclxuICAgICAgICAgIGlmICh0aGlzLmdpem1vc0ZpbHRlci5oYXMoa2V5KSlcclxuICAgICAgICAgICAgdGhpcy5naXptb3NGaWx0ZXIuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgZ2l6bW9zRmlsdGVyKCk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+IHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld3BvcnQ/Lmdpem1vc0ZpbHRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJUcmFuc2xhdGVcIiwgaWQ6IFRSQU5TRk9STS5UUkFOU0xBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlRcIiA6IFwiVFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJSb3RhdGVcIiwgaWQ6IFRSQU5TRk9STS5ST1RBVEUsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIlJcIiA6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTY2FsZVwiLCBpZDogVFJBTlNGT1JNLlNDQUxFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJFXCIgOiBcIkVcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJQaHlzaWNzIERlYnVnXCIsIHN1Ym1lbnU6IFtcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5vbmVcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVswXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVyc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzFdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29sbGlkZXJzIGFuZCBKb2ludHMgKERlZmF1bHQpXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMl0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJCb3VuZGluZyBCb3hlc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzNdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29udGFjdHNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs0XSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk9ubHkgUGh5c2ljc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzVdKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIk9ydGhvZ3JhcGhpYyBDYW1lcmFcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIk9cIiA6IFwiT1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUmVuZGVyIENvbnRpbnVvdXNseVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5UUkFOU0xBVEU6XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uUk9UQVRFOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oX2l0ZW0uaWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5OT05FXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTExJREVSU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkJPVU5ESU5HX0JPWEVTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkNPTlRBQ1RTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLlBIWVNJQ19PQkpFQ1RTX09OTFldOlxyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREVbX2l0ZW0uaWRdO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSk6XHJcbiAgICAgICAgICB0aGlzLnNldENhbWVyYU9ydGhvZ3JhcGhpYyhfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpOlxyXG4gICAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShfaXRlbS5jaGVja2VkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZ2l6bW9zRmlsdGVyLmhhcyhfaXRlbS5pZCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZ2l6bW9zRmlsdGVyLnNldChfaXRlbS5pZCwgX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLiNwb2ludGVyTW92ZWQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IFtmaWx0ZXIsIGFjdGl2ZV0gb2YgdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChmaWx0ZXIpLmNoZWNrZWQgPSBhY3RpdmU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdDb21wb25lbnRzKSkgeyAvLyBhbGxvdyBkcm9wcGluZyBjYW1lcmFjb21wb25lbnQgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEgKGF0IHRoaXMgdGltZSwgdGhlIG9ubHkgZHJhZ2dhYmxlKVxyXG4gICAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0ludGVybmFsKSkgLy8gYWxsb3cgZHJvcHBpbmcgYSBncmFwaFxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudENhbWVyYSkge1xyXG4gICAgICAgIC8vIHRoaXMuc2V0Q2FtZXJhT3J0aG9ncmFwaGljKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKHRoaXMubm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgdGhpcy5jYW52YXMgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICBsZXQgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMHB4XCI7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy52aWV3cG9ydCA9IG5ldyDGki5WaWV3cG9ydCgpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAvLyBhZGQgZGVmYXVsdCB2YWx1ZXMgZm9yIHZpZXcgcmVuZGVyIGdpem1vc1xyXG4gICAgICB0aGlzLmdpem1vc0ZpbHRlci5zZXQoR0laTU9TLlRSQU5TRk9STSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlZpZXdOb2RlX1ZpZXdwb3J0XCIsIHRoaXMuZ3JhcGgsIGNtcENhbWVyYSwgdGhpcy5jYW52YXMpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHsgLyogdmlldyBzaG91bGQgbG9hZCBldmVuIGlmIHJlbmRlcmluZyBmYWlscy4uLiAqLyB9O1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfU1RBUlQsIHRoaXMuaG5kUHJlcGFyZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuYWN0aXZlVmlld3BvcnQpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicGlja1wiLCB0aGlzLmhuZFBpY2spO1xyXG5cclxuICAgICAgbGV0IHN1Ym1lbnU6IEVsZWN0cm9uLk1lbnVJdGVtQ29uc3RydWN0b3JPcHRpb25zW10gPSBbXTtcclxuICAgICAgZm9yIChjb25zdCBbZmlsdGVyXSBvZiB0aGlzLmdpem1vc0ZpbHRlcilcclxuICAgICAgICBzdWJtZW51LnB1c2goeyBsYWJlbDogZmlsdGVyLCBpZDogZmlsdGVyLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiB0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSB9KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkdpem1vc1wiLCBzdWJtZW51OiBzdWJtZW51XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEdyYXBoKF9ub2RlOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBpZiAoIV9ub2RlKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBncmFwaCBoZXJlIHRvIGVkaXRcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLmdyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZ3JhcGggPSBfbm9kZTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpO1xyXG4gICAgICB0aGlzLmdyYXBoLmJyb2FkY2FzdEV2ZW50KG5ldyBFdmVudCjGki5FVkVOVC5ESVNDT05ORUNUX0pPSU5UKSk7XHJcbiAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnNldEJyYW5jaCh0aGlzLmdyYXBoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5ncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDYW1lcmFPcnRob2dyYXBoaWMoX29uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDIsIDEsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDEwLCAyMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5tYXhEaXN0YW5jZSA9IDEwMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgKj0gNTA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDAuMDEsIDEwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgLz0gNTA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSkpLmNoZWNrZWQgPSBfb247XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUHJlcGFyZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBzd2l0Y2hMaWdodDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJSRU5ERVJcIiA6IFwiUmVuZGVyXCJ9IHwgJHt0aGlzLmdyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgaWYgKCFsaWdodHNQcmVzZW50KVxyXG4gICAgICAgICAgxpIuUmVuZGVyLmFkZExpZ2h0cyh0aGlzLm5vZGVMaWdodC5nZXRDb21wb25lbnRzKMaSLkNvbXBvbmVudExpZ2h0KSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmdyYXBoLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfRU5ELCBzd2l0Y2hMaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IDxFdmVudERldGFpbD5fZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ncmFwaCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKGRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IGZhbHNlLCBkZXRhaWw6IHsgbm9kZTogZGV0YWlsLm5vZGUgfHwgdGhpcy5ncmFwaCB9IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IGRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gW3RoaXMubm9kZV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5GT0NVUzpcclxuICAgICAgICAgIHRoaXMuY21yT3JiaXQubXR4TG9jYWwudHJhbnNsYXRpb24gPSBkZXRhaWwubm9kZS5tdHhXb3JsZC50cmFuc2xhdGlvbjtcclxuICAgICAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfRU5ELCB0aGlzLmRyYXdUcmFuc2xhdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0Lmdpem1vc1NlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmICghdGhpcy52aWV3cG9ydC5jYW1lcmEuaXNBY3RpdmUpXHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQaWNrID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBpY2tlZDogxpIuTm9kZSA9IF9ldmVudC5kZXRhaWwubm9kZTtcclxuXHJcbiAgICAgIC8vVE9ETzogd2F0Y2ggb3V0LCB0d28gc2VsZWN0c1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IHBpY2tlZCB9IH0pO1xyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGklVpLkVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogcGlja2VkIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFuaW1hdGUgPSAoX2U6IEV2ZW50KSA9PiB7XHJcbiAgICAvLyAgIHRoaXMudmlld3BvcnQuc2V0R3JhcGgodGhpcy5ncmFwaCk7XHJcbiAgICAvLyAgIGlmICh0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQgPiAwICYmIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoID4gMClcclxuICAgIC8vICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXIgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy4jcG9pbnRlck1vdmVkIHx8PSAoX2V2ZW50Lm1vdmVtZW50WCAhPSAwIHx8IF9ldmVudC5tb3ZlbWVudFkgIT0gMCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XHJcbiAgICAgIGxldCByZXN0cmljdGlvbjogc3RyaW5nO1xyXG4gICAgICBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlhdKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwieFwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWV0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ6XCI7XHJcbiAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5aXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInlcIjtcclxuXHJcbiAgICAgIGlmICghcmVzdHJpY3Rpb24pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jYW52YXMucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgIGxldCBkYXRhOiBPYmplY3QgPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBQYWdlLm1vZGVUcmFuc2Zvcm0sIHJlc3RyaWN0aW9uOiByZXN0cmljdGlvbiwgeDogX2V2ZW50Lm1vdmVtZW50WCwgeTogX2V2ZW50Lm1vdmVtZW50WSwgY2FtZXJhOiB0aGlzLnZpZXdwb3J0LmNhbWVyYSwgaW52ZXJ0ZWQ6IF9ldmVudC5zaGlmdEtleVxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgdHJhbnNmb3JtOiBkYXRhIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYWN0aXZlVmlld3BvcnQgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgIF9ldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICAgIMaSLlBoeXNpY3MuY29ubmVjdEpvaW50cygpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuZHJhdygpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3I6IHVua25vd24pIHtcclxuICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KGZhbHNlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKF9lcnJvcik7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFJlbmRlckNvbnRpbm91c2x5KF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBpZiAoX29uKSB7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWRyYXdJZCk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpKS5jaGVja2VkID0gX29uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1RyYW5zbGF0aW9uID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMubm9kZSB8fCAhdGhpcy5naXptb3NGaWx0ZXIuZ2V0KEdJWk1PUy5UUkFOU0ZPUk0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHNjYWxpbmc6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLk9ORSjGki5WZWN0b3IzLkRJRkZFUkVOQ0UoxpIuR2l6bW9zLmNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5ub2RlLm10eFdvcmxkLnRyYW5zbGF0aW9uKS5tYWduaXR1ZGUgKiAwLjEpO1xyXG4gICAgICBjb25zdCBvcmlnaW46IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTtcclxuICAgICAgY29uc3QgdmN0WDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWCgxKTtcclxuICAgICAgY29uc3QgdmN0WTogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWSgxKTtcclxuICAgICAgY29uc3QgdmN0WjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWigxKTtcclxuICAgICAgbGV0IG10eFdvcmxkOiDGki5NYXRyaXg0eDQgPSB0aGlzLm5vZGUubXR4V29ybGQuY2xvbmU7XHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICBsZXQgY29sb3I6IMaSLkNvbG9yID0gxpIuQ29sb3IuQ1NTKFwicmVkXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFhdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJsaW1lXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFldLCBtdHhXb3JsZCwgY29sb3IpO1xyXG4gICAgICBjb2xvci5zZXRDU1MoXCJibHVlXCIpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd0xpbmVzKFtvcmlnaW4sIHZjdFpdLCBtdHhXb3JsZCwgY29sb3IpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZSh2Y3RYLCB2Y3RZLCB2Y3RaLCBvcmlnaW4sIG10eFdvcmxkLCBjb2xvciwgc2NhbGluZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdID0gQXJyYXkuZnJvbSh0aGlzLmdpem1vc0ZpbHRlci5lbnRyaWVzKCkpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBsZXQgdHlwZXNPZlJlc291cmNlczogxpIuR2VuZXJhbFtdID0gW1xyXG4gICAgxpIuTWVzaFxyXG4gIF07XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIGludGVybmFsIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxUYWJsZSBleHRlbmRzIFZpZXdJbnRlcm5hbCB7XHJcbiAgICBwcml2YXRlIHRhYmxlOiDGknVpLlRhYmxlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5URVNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RSZXNvdXJjZXMoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMudGFibGUgPSBuZXcgxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT4obmV3IENvbnRyb2xsZXJUYWJsZVJlc291cmNlKCksIE9iamVjdC52YWx1ZXMoxpIuUHJvamVjdC5yZXNvdXJjZXMpLCBcInR5cGVcIik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwi4pePIFJpZ2h0IGNsaWNrIHRvIGNyZWF0ZSBuZXcgcmVzb3VyY2UuXFxu4pePIFNlbGVjdCBvciBkcmFnIHJlc291cmNlLlwiO1xyXG4gICAgICB0aGlzLnRhYmxlLnRpdGxlID0gXCLil48gU2VsZWN0IHRvIGVkaXQgaW4gXFxcIlByb3BlcnRpZXNcXFwiXFxu4pePICBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCB0ciBvZiB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSkge1xyXG4gICAgICAgIGxldCB0ZHM6IE5vZGVMaXN0T2Y8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gdHIucXVlcnlTZWxlY3RvckFsbChcInRkXCIpO1xyXG4gICAgICAgIGlmICghdGRzLmxlbmd0aClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHRkc1sxXS5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcclxuICAgICAgICB0ZHNbMV0uc2V0QXR0cmlidXRlKFwiaWNvblwiLCAoPEhUTUxJbnB1dEVsZW1lbnQ+dGRzWzFdLmNoaWxkcmVuWzBdKS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRyIGluc3RhbmNlb2YgxpJ1aS5UYWJsZUl0ZW0gJiYgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPnRyLmRhdGEpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIHRyLmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIHRyLnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUgY2hlY2sgdGhlIGNvbnNvbGUgZm9yIGRldGFpbHMuXCI7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwsIMaSLlNoYWRlciwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIEFuaW1hdGlvblwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb24ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5BbmltYXRpb25TcHJpdGUubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IGBDcmVhdGUgJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfWAsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVCksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgUmVzb3VyY2VcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0UpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJSXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJTeW5jIEluc3RhbmNlc1wiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiU1wiIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIC8vVE9ETzogZGlzcGF0Y2ggQ1JFQVRFIGluc3RlYWQgb2YgTU9ESUZZIVxyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIGxldCBtZXNoTmV3OiDGki5NZXNoID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobWVzaE5ldywgbWVzaE5ldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBtdHJOZXc6IMaSLk1hdGVyaWFsID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwobXRyTmV3LCBtdHJOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfR1JBUEg6XHJcbiAgICAgICAgICBsZXQgZ3JhcGg6IMaSLkdyYXBoID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoZ3JhcGgsIGdyYXBoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTjpcclxuICAgICAgICAgIGxldCB0eXBlQW5pbWF0aW9uOiB0eXBlb2YgxpIuQW5pbWF0aW9uID0gxpIuQW5pbWF0aW9uLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGxldCBhbmltYXRpb246IMaSLkFuaW1hdGlvbiA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0SW50ZXJ2YWwoYW5pbWF0aW9uLCBhbmltYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUOlxyXG4gICAgICAgICAgbGV0IHBhcnRpY2xlU3lzdGVtOiDGki5QYXJ0aWNsZVN5c3RlbSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKHBhcnRpY2xlU3lzdGVtLCBwYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRTpcclxuICAgICAgICAgIGF3YWl0IHRoaXMudGFibGUuY29udHJvbGxlci5kZWxldGUoW3RoaXMudGFibGUuZ2V0Rm9jdXNzZWQoKV0pO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgaWYgKHRoaXMuZG9tICE9IF9ldmVudC50YXJnZXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGlmIChzb3VyY2VzLnNvbWUoX3NvdXJjZSA9PiAhW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcylcclxuICAgICAgICAvLyAgIGlmIChzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLkFVRElPICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuSU1BR0UgJiYgc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5NRVNIKVxyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SGllcmFyY2h5KSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IMaSLk5vZGVbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBhd2FpdCDGki5Qcm9qZWN0LnJlZ2lzdGVyQXNHcmFwaChzb3VyY2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdFeHRlcm5hbCkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcclxuICAgICAgICAgIHN3aXRjaCAoc291cmNlLmdldE1pbWVUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBNSU1FLkFVRElPOlxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5JTUFHRTpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBNSU1FLk1FU0g6XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcubG9nKGF3YWl0IG5ldyDGki5NZXNoT0JKKCkubG9hZChzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2VcclxuICAgICAgICAgICAgICBNSU1FLkdMVEY6XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgICBsZXQgbG9hZDogYm9vbGVhbiA9IGF3YWl0IMaSdWkuRGlhbG9nLnByb21wdChWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzLCBmYWxzZSwgYFNlbGVjdCB3aGF0IHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgICBpZiAoIWxvYWQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc291cmNlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IGF3YWl0IGxvYWRlci5sb2FkUmVzb3VyY2VzKMaSW3R5cGVdKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIcaSLlByb2plY3QucmVzb3VyY2VzW3Jlc291cmNlLmlkUmVzb3VyY2VdKVxyXG4gICAgICAgICAgICAgICAgICAgIMaSLlByb2plY3QucmVnaXN0ZXIocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSlcclxuICAgICAgICAvLyAvL0B0cy1pZ25vcmVcclxuICAgICAgICBfdmlld1NvdXJjZS5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGRldGFpbDogeyB2aWV3OiB0aGlzIC8qICwgZGF0YTogX3ZpZXdTb3VyY2UuZ3JhcGggKi8gfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleWJvYXJkRXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGxldCBjZWxsOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IHRoaXMudGFibGUucXVlcnlTZWxlY3RvcihcIi5zZWxlY3RlZFwiKTtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmICghaW5wdXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNSRUFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOiAvLyBUT0RPOiBpcyB0aGlzIHJlYWNoYWJsZT8gSXMgaXQgc3RpbGwgbmVlZGVkP1xyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5saXN0UmVzb3VyY2VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGFzeW5jIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblxyXG5cclxuICAgIC8vICAgLy8gxpJ1aS5EaWFsb2cuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAvLyAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAvLyAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcihzZXR0aW5ncywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgICAgdGhpcy5tdXRhdGUobXV0YXRvcik7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgIH0gZWxzZVxyXG4gICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgLy8gfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBpbXBvcnQgxpJBaWQgPSBGdWRnZUFpZDtcclxuXHJcbiAgLyoqXHJcbiAgICogUHJldmlldyBhIHJlc291cmNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQcmV2aWV3IGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoU3RhbmRhcmQ6IMaSLk1lc2ggPSBWaWV3UHJldmlldy5jcmVhdGVTdGFuZGFyZE1lc2goKTtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlIHwgRGlyZWN0b3J5RW50cnkgfCBSZXNvdXJjZUZvbGRlciB8IEZ1bmN0aW9uO1xyXG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcbiAgICBwcml2YXRlIGNtck9yYml0OiDGkkFpZC5DYW1lcmFPcmJpdDtcclxuICAgIHByaXZhdGUgcHJldmlld05vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG10eEltYWdlOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgIHByaXZhdGUgdGltZW91dERlZmVyOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIGNyZWF0ZSB2aWV3cG9ydCBmb3IgM0QtcmVzb3VyY2VzXHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgLy8gY21wQ2FtZXJhLnBpdm90LnRyYW5zbGF0ZShuZXcgxpIuVmVjdG9yMygxLCAyLCAxKSk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC5sb29rQXQoxpIuVmVjdG9yMy5aRVJPKCkpO1xyXG4gICAgICBjbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUpO1xyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IMaSQWlkLkNhbnZhcy5jcmVhdGUodHJ1ZSwgxpJBaWQuSU1BR0VfUkVOREVSSU5HLlBJWEVMQVRFRCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5pbml0aWFsaXplKFwiUHJldmlld1wiLCBudWxsLCBjbXBDYW1lcmEsIGNhbnZhcyk7XHJcbiAgICAgIC8vIMaSLlJlbmRlcldlYkdMLnNldENhbnZhc1NpemUoMSwgMSk7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQgPSDGkkFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodGhpcy52aWV3cG9ydCwgZmFsc2UpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlID0gdGhpcy5jcmVhdGVTdGFuZGFyZEdyYXBoKCk7XHJcblxyXG4gICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsIHRoaXMucmVkcmF3KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhuZE1vdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1hdGVyaWFsKCk6IMaSLk1hdGVyaWFsIHtcclxuICAgICAgbGV0IG10clN0YW5kYXJkOiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbChcIlN0YW5kYXJkTWF0ZXJpYWxcIiwgxpIuU2hhZGVyRmxhdCwgbmV3IMaSLkNvYXRSZW1pc3NpdmUoxpIuQ29sb3IuQ1NTKFwid2hpdGVcIikpKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKG10clN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG10clN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZVN0YW5kYXJkTWVzaCgpOiDGki5NZXNoIHtcclxuICAgICAgbGV0IG1lc2hTdGFuZGFyZDogxpIuTWVzaFNwaGVyZSA9IG5ldyDGki5NZXNoU3BoZXJlKFwiU3BoZXJlXCIsIDIwLCAxMik7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtZXNoU3RhbmRhcmQpO1xyXG4gICAgICByZXR1cm4gbWVzaFN0YW5kYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG5cclxuICAgICAgLy8gaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJJbGx1bWluYXRlIEdyYXBoXCIsIGlkOiBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXSwgY2hlY2tlZDogdHJ1ZSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAvLyBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIC8vIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgLy8gY2FzZSBDT05URVhUTUVOVVtDT05URVhUTUVOVS5JTExVTUlOQVRFXTpcclxuICAgICAgLy8gICB0aGlzLmlsbHVtaW5hdGVHcmFwaCgpO1xyXG4gICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGhuZE1vdXNlID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoXCJkaXYjaW1hZ2VcIik7XHJcbiAgICAgIGlmICghZGl2KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwibW91c2Vtb3ZlXCI6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKF9ldmVudC5tb3ZlbWVudFgpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKF9ldmVudC5tb3ZlbWVudFkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndoZWVsXCI6XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoXHJcbiAgICAgICAgICAgIF9ldmVudC5vZmZzZXRYIC0gdGhpcy5kb20uY2xpZW50V2lkdGgsIF9ldmVudC5vZmZzZXRZIC0gdGhpcy5kb20uY2xpZW50SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICBsZXQgem9vbTogbnVtYmVyID0gTWF0aC5leHAoLV9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG9mZnNldC50b1N0cmluZygpKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVYKHpvb20pO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5zY2FsZVkoem9vbSk7XHJcbiAgICAgICAgICBvZmZzZXQuc2NhbGUoem9vbSAtIDEpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVYKC1vZmZzZXQueCk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnRyYW5zbGF0ZVkoLW9mZnNldC55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0VHJhbnNmb3JtKF9kaXY6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB0cmFuc2Zvcm06IEZsb2F0MzJBcnJheSA9IHRoaXMubXR4SW1hZ2UuZ2V0KCk7XHJcbiAgICAgIHRyYW5zZm9ybSA9IHRyYW5zZm9ybS5jb3B5V2l0aGluKDUsIDYpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbigyLCAzKTtcclxuICAgICAgX2Rpdi5zdHlsZS50cmFuc2Zvcm0gPSBgbWF0cml4KCR7dHJhbnNmb3JtLnNsaWNlKDAsIDYpLmpvaW4oKX0pYDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBpZiAoIXRoaXMucmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlNlbGVjdCBhbiBpbnRlcm5hbCBvciBleHRlcm5hbCByZXNvdXJjZSB0byBwcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByZXZpZXdcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGlnaHRzUHJlc2VudDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHRoaXMucmVzb3VyY2UudHlwZSB8fCBcIkZ1bmN0aW9uXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTWVzaClcclxuICAgICAgICB0eXBlID0gXCJNZXNoXCI7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgICAgbGV0IHByZXZpZXdPYmplY3Q6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdPYmplY3RcIik7XHJcbiAgICAgIGxldCBwcmV2aWV3OiBIVE1MRWxlbWVudDtcclxuICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIkZ1bmN0aW9uXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVTY3JpcHRQcmV2aWV3KDxGdW5jdGlvbj50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGlmIChwcmV2aWV3KVxyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChwcmV2aWV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJGaWxlXCI6XHJcbiAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5jcmVhdGVGaWxlUHJldmlldyg8RGlyZWN0b3J5RW50cnk+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiTWVzaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goPMaSLk1lc2g+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKFZpZXdQcmV2aWV3Lm10clN0YW5kYXJkKSk7XHJcbiAgICAgICAgICB0aGlzLnNldFZpZXdPYmplY3QocHJldmlld09iamVjdCk7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0Q2FtZXJhKCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1hdGVyaWFsXCI6XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWVzaChWaWV3UHJldmlldy5tZXNoU3RhbmRhcmQpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbCg8xpIuTWF0ZXJpYWw+dGhpcy5yZXNvdXJjZSkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJHcmFwaFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hcHBlbmRDaGlsZCg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZSg8xpIuR3JhcGg+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsaWdodHNQcmVzZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICB0aGlzLmlsbHVtaW5hdGUoIWxpZ2h0c1ByZXNlbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJQUkVWSUVXXCIgOiBcIlByZXZpZXdcIn0gfCAke3RoaXMucmVzb3VyY2UubmFtZX1gKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3MoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kZWZlcigoKSA9PiB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiVGV4dHVyZUltYWdlXCI6XHJcbiAgICAgICAgY2FzZSBcIkFuaW1hdGlvblNwcml0ZVwiOlxyXG4gICAgICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgZGl2LmlkID0gXCJpbWFnZVwiO1xyXG4gICAgICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICAgIGlmICh0eXBlID09IFwiVGV4dHVyZUltYWdlXCIpIHtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+dGhpcy5yZXNvdXJjZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvblNwcml0ZTogxpIuQW5pbWF0aW9uU3ByaXRlID0gPMaSLkFuaW1hdGlvblNwcml0ZT50aGlzLnJlc291cmNlO1xyXG4gICAgICAgICAgICBpbWcgPSAoPMaSLlRleHR1cmVJbWFnZT5hbmltYXRpb25TcHJpdGUudGV4dHVyZSkuaW1hZ2U7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25zOiDGki5WZWN0b3IyW10gPSBhbmltYXRpb25TcHJpdGUuZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gYW5pbWF0aW9uU3ByaXRlLmdldE11dGF0b3IoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcG9zaXRpb24gb2YgcG9zaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3Q6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgIHJlY3QuY2xhc3NOYW1lID0gXCJyZWN0U3ByaXRlXCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS5sZWZ0ID0gcG9zaXRpb24ueCArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS50b3AgPSBwb3NpdGlvbi55ICsgMSArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLndpZHRoID0gbXV0YXRvci5zaXplLnggLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUuaGVpZ2h0ID0gbXV0YXRvci5zaXplLnkgLSAyICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKGRpdik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXVkaW9cIjpcclxuICAgICAgICAgIGxldCBlbnRyeTogRGlyZWN0b3J5RW50cnkgPSBuZXcgRGlyZWN0b3J5RW50cnkoKDzGki5BdWRpbz50aGlzLnJlc291cmNlKS5wYXRoLnRvU3RyaW5nKCksIFwiXCIsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBdWRpb1ByZXZpZXcoZW50cnkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKGBQcmV2aWV3IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGFuZGFyZEdyYXBoKCk6IMaSLk5vZGUge1xyXG4gICAgICBsZXQgZ3JhcGg6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdTY2VuZVwiKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2goZ3JhcGgpO1xyXG5cclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKTtcclxuICAgICAgZ3JhcGguYWRkQ2hpbGQobm9kZUxpZ2h0KTtcclxuICAgICAgxpJBaWQuYWRkU3RhbmRhcmRMaWdodENvbXBvbmVudHMobm9kZUxpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudmlld3BvcnQuY2FudmFzKTtcclxuXHJcbiAgICAgIGxldCBwcmV2aWV3Tm9kZTogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiUHJldmlld05vZGVcIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKHByZXZpZXdOb2RlKTtcclxuICAgICAgcmV0dXJuIHByZXZpZXdOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Vmlld09iamVjdChfbm9kZTogxpIuTm9kZSwgX2dyYXBoSWxsdW1pbmF0aW9uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICB0aGlzLnByZXZpZXdOb2RlLmFkZENoaWxkKF9ub2RlKTtcclxuICAgICAgdGhpcy5pbGx1bWluYXRlKHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbGx1bWluYXRlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgbm9kZUxpZ2h0OiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKT8uZ2V0Q2hpbGRyZW5CeU5hbWUoXCJQcmV2aWV3SWxsdW1pbmF0aW9uXCIpWzBdO1xyXG4gICAgICBub2RlTGlnaHQuYWN0aXZhdGUoX29uKTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUZpbGVQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBtaW1lOiBNSU1FID0gX2VudHJ5LmdldE1pbWVUeXBlKCk7XHJcbiAgICAgIHN3aXRjaCAobWltZSkge1xyXG4gICAgICAgIGNhc2UgTUlNRS5URVhUOiByZXR1cm4gdGhpcy5jcmVhdGVUZXh0UHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5BVURJTzogcmV0dXJuIHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgICAgY2FzZSBNSU1FLklNQUdFOiByZXR1cm4gdGhpcy5jcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRleHRQcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gX2VudHJ5LmdldEZpbGVDb250ZW50KCk7XHJcbiAgICAgIHJldHVybiBwcmU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUltYWdlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgaW1nLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBpbWcuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgYmxhY2tcIjtcclxuICAgICAgcmV0dXJuIGltZztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQXVkaW9QcmV2aWV3KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBhdWRpbzogSFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgYXVkaW8uc3JjID0gX2VudHJ5LnBhdGg7XHJcbiAgICAgIGF1ZGlvLnBsYXkoKTtcclxuICAgICAgYXVkaW8uY29udHJvbHMgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gYXVkaW87XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVNjcmlwdFByZXZpZXcoX3NjcmlwdDogRnVuY3Rpb24pOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBwcmU6IEhUTUxQcmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgbGV0IGNvZGU6IHN0cmluZyA9IF9zY3JpcHQudG9TdHJpbmcoKTtcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIiAgICBcIiwgXCIgXCIpO1xyXG4gICAgICBwcmUudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIC8vIGlmIChbxpIuQXVkaW8sIMaSLlRleHR1cmUsIMaSLkFuaW1hdGlvblNwcml0ZV0uc29tZSgoX3R5cGUpID0+IHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBfdHlwZSkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuQXVkaW8gfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLlRleHR1cmUgfHxcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSlcclxuICAgICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5kZXRhaWwpXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gX2V2ZW50LmRldGFpbC5kYXRhLnNjcmlwdDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHJlc2V0Q2FtZXJhKCk6IHZvaWQge1xyXG4gICAgICBsZXQgYnJhbmNoOiDGki5Ob2RlID0gdGhpcy52aWV3cG9ydC5nZXRCcmFuY2goKTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUoYnJhbmNoKTtcclxuICAgICAgbGV0IHI6IG51bWJlciA9IGJyYW5jaC5yYWRpdXM7XHJcblxyXG4gICAgICB0aGlzLmNtck9yYml0Lm10eExvY2FsLnRyYW5zbGF0aW9uID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLmNtck9yYml0LnJvdGF0aW9uWCA9IC0zMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblkgPSAzMDtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5kaXN0YW5jZSA9IHIgKiAzO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHJhdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwIHx8IHRoaXMudmlld3BvcnQuY2FudmFzLmNsaWVudEhlaWdodCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRlZmVyKF9mdW5jdGlvbjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMudGltZW91dERlZmVyKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgX2Z1bmN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy50aW1lb3V0RGVmZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgdGhlIHByb3BlcnRpZXMgb2YgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJvcGVydGllcyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRlbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XHJcbiAgICAgIGlmICh0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlByb3BlcnRpZXMgfCBcIiArIHRoaXMucmVzb3VyY2UubmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5NdXRhYmxlKSB7XHJcbiAgICAgICAgICBsZXQgZmllbGRzZXQ6IMaSdWkuRGV0YWlscyA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZSh0aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIGxldCB1aU11dGFibGU6IENvbnRyb2xsZXJEZXRhaWwgPSBuZXcgQ29udHJvbGxlckRldGFpbCh0aGlzLnJlc291cmNlLCBmaWVsZHNldCwgdGhpcyk7XHJcbiAgICAgICAgICBjb250ZW50ID0gdWlNdXRhYmxlLmRvbUVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgRGlyZWN0b3J5RW50cnkgJiYgdGhpcy5yZXNvdXJjZS5zdGF0cykge1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJTaXplOiBcIiArICh0aGlzLnJlc291cmNlLnN0YXRzW1wic2l6ZVwiXSAvIDEwMjQpLnRvRml4ZWQoMikgKyBcIiBLaUI8YnIvPlwiO1xyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gXCJDcmVhdGVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJiaXJ0aHRpbWVcIl0udG9Mb2NhbGVTdHJpbmcoKSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiTW9kaWZpZWQ6IFwiICsgdGhpcy5yZXNvdXJjZS5zdGF0c1tcImN0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5yZXNvdXJjZS50b0hpZXJhcmNoeVN0cmluZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIFNjcmlwdEluZm8pIHtcclxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnJlc291cmNlLnNjcmlwdCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSB0aGlzLnJlc291cmNlLnNjcmlwdFtrZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbilcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm5hbWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICAgICAgICAgIHZhbHVlID0gXCJBcnJheShcIiArIHZhbHVlLmxlbmd0aCArIFwiKVwiO1xyXG4gICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBrZXkgKyBcIjogXCIgKyB2YWx1ZSArIFwiPGJyLz5cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgICAgbGV0IGVudHJpZXM6IHsgW25hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMucmVzb3VyY2UuZW50cmllcykge1xyXG4gICAgICAgICAgICBlbnRyaWVzW2VudHJ5LnR5cGVdID0gKGVudHJpZXNbZW50cnkudHlwZV0gPz8gMCkgKyAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29udGVudC5pbm5lckhUTUwgPSBgRW50cmllczogJHt0aGlzLnJlc291cmNlLmVudHJpZXMubGVuZ3RofTxici8+YDtcclxuICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gZW50cmllcylcclxuICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gYCR7dHlwZX06ICR7ZW50cmllc1t0eXBlXX08YnIvPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gXCJTZWxlY3QgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgcmVzb3VyY2UgdG8gZXhhbWluZSBwcm9wZXJ0aWVzXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kb20uYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+KF9ldmVudC5kZXRhaWwuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCB0aGUgc2NyaXB0cyBsb2FkZWRcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwLTIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdTY3JpcHQgZXh0ZW5kcyBWaWV3IHtcclxuICAgIC8vIFRPRE86IGNvbnNpZGVyIHNjcmlwdCBuYW1lc3BhY2VzIMaSLlNjcmlwdE5hbWVzcGFjZXMgdG8gZmluZCBhbGwgc2NyaXB0cyBub3QganVzdCBDb21wb25lbnRTY3JpcHRzXHJcbiAgICBwcml2YXRlIHRhYmxlOiDGknVpLlRhYmxlPFNjcmlwdEluZm8+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGlzdFNjcmlwdHMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gYERyYWcgJiBkcm9wIHNjcmlwdHMgb24gXCJDb21wb25lbnRzXCJgO1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgc2NyaXB0aW5mb3M6IFNjcmlwdEluZm9bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBuYW1lc3BhY2UgaW4gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzW25hbWVzcGFjZV0pIHtcclxuICAgICAgICAgIGxldCBzY3JpcHQ6IEZ1bmN0aW9uID0gxpIuUHJvamVjdC5zY3JpcHROYW1lc3BhY2VzW25hbWVzcGFjZV1baW5kZXhdO1xyXG4gICAgICAgICAgaWYgKHNjcmlwdC5uYW1lKVxyXG4gICAgICAgICAgICBzY3JpcHRpbmZvcy5wdXNoKG5ldyBTY3JpcHRJbmZvKHNjcmlwdCwgbmFtZXNwYWNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGFibGUgPSBuZXcgxpJ1aS5UYWJsZTxTY3JpcHRJbmZvPihuZXcgQ29udHJvbGxlclRhYmxlU2NyaXB0KCksIHNjcmlwdGluZm9zKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50YWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiBTY3JpcHRJbmZvW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IFNjcmlwdEluZm9bXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgLy8gcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgLy8gICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAvLyAgIHJldHVybiBtZW51O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5PUEVOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuZGV0YWlsLmRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMubGlzdFNjcmlwdHMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSJdfQ==