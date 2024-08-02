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
        static copyPaste = { sources: [], target: null };
        childToParent = new Map();
        data;
        view;
        constructor(_data, _view) {
            super();
            this.data = _data;
            this.view = _view;
            this.copyPaste = ControllerTreeParticleSystem.copyPaste;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFnZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Qcm9qZWN0LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckRldGFpbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVJlc291cmNlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRhYmxlU2NyaXB0cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlRGlyZWN0b3J5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEdyYXBoLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsSGVscC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXdQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvQW5pbWF0aW9uL1ZpZXdBbmltYXRpb25TaGVldC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdDb21wb25lbnRzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvR3JhcGgvVmlld0hpZXJhcmNoeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdSZW5kZXIudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbFRhYmxlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3UHJldmlldy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1Byb3BlcnRpZXMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBaUNkO0FBakNELFdBQVUsS0FBSztJQUNiLG1DQUFtQztJQUNuQyx3QkFBd0I7SUFTeEIsTUFBYSxXQUFXO1FBQ2YsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFvQjtZQUNoRCxLQUFL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LElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFR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SUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNoRCxDQUFDO1FBRUQsdUJBQXVCO1FBQ3ZCLDRFQUE0RTtRQUM1RSxtREFBbUQ7UUFDbkQsaUJBQWlCO1FBQ2pCLElBQUk7UUFFSiwySEFBMkg7UUFDM0gsbUZBQW1GO1FBQ25GLElBQUk7UUFDSixZQUFZO1FBRUosUUFBUSxHQUFHLENBQUMsTUFBbUIsRUFBUSxFQUFFO1lBQy9DLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwQixLQUFLLE1BQUEsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDekIsS0FBSyxNQUFBLFlBQVksQ0FBQyxJQUFJO29CQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJO3dCQUNyQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3JCLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDO0tBQ0g7SUF4RFksZ0JBQVUsYUF3RHRCLENBQUE7QUFDSCxDQUFDLEVBakVTLEtBQUssS0FBTCxLQUFLLFFBaUVkIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICAvLyBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICAvLyBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCB0eXBlIENvbnRleHRNZW51Q2FsbGJhY2sgPSAobWVudUl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBicm93c2VyV2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBldmVudDogRWxlY3Ryb24uS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgdHlwZSBTdWJjbGFzczxUPiA9IHtcclxuICAgIHN1YmNsYXNzZXM6IFRbXVxyXG4gICAgbmFtZTogc3RyaW5nXHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRleHRNZW51IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXBwZW5kQ29weVBhc3RlKF9tZW51OiBFbGVjdHJvbi5NZW51KTogdm9pZCB7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJjb3B5XCIgfSkpO1xyXG4gICAgICBfbWVudS5hcHBlbmQobmV3IHJlbW90ZS5NZW51SXRlbSh7IHJvbGU6IFwiY3V0XCIgfSkpO1xyXG4gICAgICBfbWVudS5hcHBlbmQobmV3IHJlbW90ZS5NZW51SXRlbSh7IHJvbGU6IFwicGFzdGVcIiB9KSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U3ViY2xhc3NNZW51PFQgZXh0ZW5kcyBTdWJjbGFzczxUPj4oX2lkOiBDT05URVhUTUVOVSwgX2NsYXNzOiBULCBfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBmb3IgKGxldCBpU3ViY2xhc3MgaW4gX2NsYXNzLnN1YmNsYXNzZXMpIHtcclxuICAgICAgICBsZXQgc3ViY2xhc3M6IFQgPSBfY2xhc3Muc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICB7IGxhYmVsOiBzdWJjbGFzcy5uYW1lLCBpZDogU3RyaW5nKF9pZCksIGNsaWNrOiBfY2FsbGJhY2sgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgaXRlbS5vdmVycmlkZVByb3BlcnR5KFwiaVN1YmNsYXNzXCIsIGlTdWJjbGFzcyk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBleHBvcnQgZW51bSBDT05URVhUTUVOVSB7XHJcbiAgICAvLyBTS0VUQ0ggPSBWaWV3U2tldGNoLFxyXG4gICAgQUREX05PREUsXHJcbiAgICBBQ1RJVkFURV9OT0RFLFxyXG4gICAgREVMRVRFX05PREUsXHJcbiAgICBBRERfQ09NUE9ORU5ULFxyXG4gICAgREVMRVRFX0NPTVBPTkVOVCxcclxuICAgIEFERF9DT01QT05FTlRfU0NSSVBULFxyXG4gICAgRURJVCxcclxuICAgIENSRUFURV9GT0xERVIsXHJcbiAgICBDUkVBVEVfTUVTSCxcclxuICAgIENSRUFURV9NQVRFUklBTCxcclxuICAgIENSRUFURV9HUkFQSCxcclxuICAgIENSRUFURV9BTklNQVRJT04sXHJcbiAgICBDUkVBVEVfUEFSVElDTEVfRUZGRUNULFxyXG4gICAgU1lOQ19JTlNUQU5DRVMsXHJcbiAgICBSRU1PVkVfQ09NUE9ORU5ULFxyXG4gICAgQUREX0pPSU5ULFxyXG4gICAgREVMRVRFX1JFU09VUkNFLFxyXG4gICAgT1JUSEdSQVBISUNfQ0FNRVJBLFxyXG4gICAgUkVOREVSX0NPTlRJTlVPVVNMWSxcclxuICAgIEFERF9QUk9QRVJUWSxcclxuICAgIERFTEVURV9QUk9QRVJUWSxcclxuICAgIENPTlZFUlRfQU5JTUFUSU9OLFxyXG4gICAgQUREX1BBUlRJQ0xFX1BST1BFUlRZLFxyXG4gICAgQUREX1BBUlRJQ0xFX0ZVTkNUSU9OLFxyXG4gICAgQUREX1BBUlRJQ0xFX0NPTlNUQU5ULFxyXG4gICAgQUREX1BBUlRJQ0xFX0NPREUsXHJcbiAgICBBRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04sXHJcbiAgICBERUxFVEVfUEFSVElDTEVfREFUQVxyXG4gIH1cclxuXHJcblxyXG4gIGV4cG9ydCBlbnVtIE1FTlUge1xyXG4gICAgUVVJVCA9IFwicXVpdFwiLFxyXG4gICAgUFJPSkVDVF9ORVcgPSBcInByb2plY3ROZXdcIixcclxuICAgIFBST0pFQ1RfU0FWRSA9IFwicHJvamVjdFNhdmVcIixcclxuICAgIFBST0pFQ1RfTE9BRCA9IFwicHJvamVjdExvYWRcIixcclxuICAgIERFVlRPT0xTX09QRU4gPSBcImRldnRvb2xzT3BlblwiLFxyXG4gICAgUEFORUxfR1JBUEhfT1BFTiA9IFwicGFuZWxHcmFwaE9wZW5cIixcclxuICAgIFBBTkVMX0FOSU1BVElPTl9PUEVOID0gXCJwYW5lbEFuaW1hdGlvbk9wZW5cIixcclxuICAgIFBBTkVMX1BST0pFQ1RfT1BFTiA9IFwicGFuZWxQcm9qZWN0T3BlblwiLFxyXG4gICAgUEFORUxfSEVMUF9PUEVOID0gXCJwYW5lbEhlbHBPcGVuXCIsXHJcbiAgICBQQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiA9IFwicGFuZWxQYXJ0aWNsZVN5c3RlbU9wZW5cIixcclxuICAgIEZVTExTQ1JFRU4gPSBcImZ1bGxzY3JlZW5cIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gUEFORUwge1xyXG4gICAgR1JBUEggPSBcIlBhbmVsR3JhcGhcIixcclxuICAgIFBST0pFQ1QgPSBcIlBhbmVsUHJvamVjdFwiLFxyXG4gICAgSEVMUCA9IFwiUGFuZWxIZWxwXCIsXHJcbiAgICBBTklNQVRJT04gPSBcIlBhbmVsQW5pbWF0aW9uXCIsXHJcbiAgICBQQVJUSUNMRV9TWVNURU0gPSBcIlBhbmVsUGFydGljbGVTeXN0ZW1cIlxyXG5cclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIFZJRVcge1xyXG4gICAgSElFUkFSQ0hZID0gXCJWaWV3SGllcmFyY2h5XCIsXHJcbiAgICBBTklNQVRJT04gPSBcIlZpZXdBbmltYXRpb25cIixcclxuICAgIEFOSU1BVElPTl9TSEVFVCA9IFwiVmlld0FuaW1hdGlvblNoZWV0XCIsXHJcbiAgICBSRU5ERVIgPSBcIlZpZXdSZW5kZXJcIixcclxuICAgIENPTVBPTkVOVFMgPSBcIlZpZXdDb21wb25lbnRzXCIsXHJcbiAgICBDQU1FUkEgPSBcIlZpZXdDYW1lcmFcIixcclxuICAgIElOVEVSTkFMX1RBQkxFID0gXCJWaWV3SW50ZXJuYWxUYWJsZVwiLFxyXG4gICAgSU5URVJOQUxfRk9MREVSID0gXCJWaWV3SW50ZXJuYWxGb2xkZXJcIixcclxuICAgIEVYVEVSTkFMID0gXCJWaWV3RXh0ZXJuYWxcIixcclxuICAgIFBST1BFUlRJRVMgPSBcIlZpZXdQcm9wZXJ0aWVzXCIsXHJcbiAgICBQUkVWSUVXID0gXCJWaWV3UHJldmlld1wiLFxyXG4gICAgU0NSSVBUID0gXCJWaWV3U2NyaXB0XCIsXHJcbiAgICBQQVJUSUNMRV9TWVNURU0gPSBcIlZpZXdQYXJ0aWNsZVN5c3RlbVwiXHJcbiAgICAvLyBTS0VUQ0ggPSBWaWV3U2tldGNoLFxyXG4gICAgLy8gTUVTSCA9IFZpZXdNZXNoLFxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gVFJBTlNGT1JNIHtcclxuICAgIFRSQU5TTEFURSA9IFwidHJhbnNsYXRlXCIsXHJcbiAgICBST1RBVEUgPSBcInJvdGF0ZVwiLFxyXG4gICAgU0NBTEUgPSBcInNjYWxlXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBlbnVtIEdJWk1PUyB7XHJcbiAgICBUUkFOU0ZPUk0gPSBcIlRyYW5zZm9ybVwiXHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuXHJcbiAgZXhwb3J0IGVudW0gTUlNRSB7XHJcbiAgICBURVhUID0gXCJ0ZXh0XCIsXHJcbiAgICBBVURJTyA9IFwiYXVkaW9cIixcclxuICAgIElNQUdFID0gXCJpbWFnZVwiLFxyXG4gICAgTUVTSCA9IFwibWVzaFwiLFxyXG4gICAgR0xURiA9IFwiZ2x0ZlwiLFxyXG4gICAgVU5LTk9XTiA9IFwidW5rbm93blwiXHJcbiAgfVxyXG5cclxuICBsZXQgbWltZTogTWFwPE1JTUUsIHN0cmluZ1tdPiA9IG5ldyBNYXAoW1xyXG4gICAgW01JTUUuVEVYVCwgW1widHNcIiwgXCJqc29uXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiLCBcImpzXCIsIFwidHh0XCJdXSxcclxuICAgIFtNSU1FLk1FU0gsIFtcIm9ialwiXV0sXHJcbiAgICBbTUlNRS5BVURJTywgW1wibXAzXCIsIFwid2F2XCIsIFwib2dnXCJdXSxcclxuICAgIFtNSU1FLklNQUdFLCBbXCJwbmdcIiwgXCJqcGdcIiwgXCJqcGVnXCIsIFwidGlmXCIsIFwidGdhXCIsIFwiZ2lmXCJdXSxcclxuICAgIFtNSU1FLkdMVEYsIFtcImdsdGZcIiwgXCJnbGJcIl1dXHJcbiAgXSk7XHJcblxyXG4gIGNvbnN0IGZzOiB0eXBlb2YgaW1wb3J0KFwiZnNcIikgPSByZXF1aXJlKFwiZnNcIik7XHJcbiAgY29uc3QgcDogdHlwZW9mIGltcG9ydChcInBhdGhcIikgPSByZXF1aXJlKFwicGF0aFwiKTtcclxuICB0eXBlIERpcmVudCA9IGltcG9ydChcImZzXCIpLkRpcmVudDtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERpcmVjdG9yeUVudHJ5IHtcclxuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcGF0aFJlbGF0aXZlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgZGlyZW50OiBEaXJlbnQ7XHJcbiAgICBwdWJsaWMgc3RhdHM6IE9iamVjdDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX3BhdGg6IHN0cmluZywgX3BhdGhSZWxhdGl2ZTogc3RyaW5nLCBfZGlyZW50OiBEaXJlbnQsIF9zdGF0czogT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMucGF0aCA9IHAubm9ybWFsaXplKF9wYXRoKTtcclxuICAgICAgdGhpcy5wYXRoUmVsYXRpdmUgPSBwLm5vcm1hbGl6ZShfcGF0aFJlbGF0aXZlKTtcclxuICAgICAgdGhpcy5kaXJlbnQgPSBfZGlyZW50O1xyXG4gICAgICB0aGlzLnN0YXRzID0gX3N0YXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUm9vdChfcGF0aDogc3RyaW5nKTogRGlyZWN0b3J5RW50cnkge1xyXG4gICAgICBsZXQgZGlyZW50OiBEaXJlbnQgPSBuZXcgZnMuRGlyZW50KCk7XHJcbiAgICAgIGRpcmVudC5uYW1lID0gcC5iYXNlbmFtZShfcGF0aCk7XHJcbiAgICAgIGRpcmVudC5pc0RpcmVjdG9yeSA9ICgpID0+IHRydWU7XHJcbiAgICAgIHJldHVybiBuZXcgRGlyZWN0b3J5RW50cnkoX3BhdGgsIFwiXCIsIGRpcmVudCwgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVudC5uYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBuYW1lKF9uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgbGV0IG5ld1BhdGg6IHN0cmluZyA9IHAuam9pbihwLmRpcm5hbWUodGhpcy5wYXRoKSwgX25hbWUpO1xyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhuZXdQYXRoKSlcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIGFscmVhZHkgYSBmaWxlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lICcke19uYW1lfScuIFNwZWNpZnkgYSBkaWZmZXJlbnQgbmFtZS5gKTtcclxuICAgICAgZnMucmVuYW1lU3luYyh0aGlzLnBhdGgsIG5ld1BhdGgpO1xyXG4gICAgICB0aGlzLnBhdGggPSBuZXdQYXRoO1xyXG4gICAgICB0aGlzLmRpcmVudC5uYW1lID0gX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpc0RpcmVjdG9yeSgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZW50LmlzRGlyZWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzRGlyZWN0b3J5ID8gXCJEaXJlY3RvcnlcIiA6IFwiRmlsZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgIGZzLnJtU3luYyh0aGlzLnBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREaXJlY3RvcnlDb250ZW50KCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICBsZXQgZGlyZW50czogRGlyZW50W10gPSBmcy5yZWFkZGlyU3luYyh0aGlzLnBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcclxuICAgICAgbGV0IGNvbnRlbnQ6IERpcmVjdG9yeUVudHJ5W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZGlyZW50IG9mIGRpcmVudHMpIHtcclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gcC5qb2luKHRoaXMucGF0aCwgZGlyZW50Lm5hbWUpO1xyXG4gICAgICAgIGxldCBwYXRoUmVsYXRpdmU6IHN0cmluZyA9IHAuam9pbih0aGlzLnBhdGhSZWxhdGl2ZSwgZGlyZW50Lm5hbWUpO1xyXG4gICAgICAgIGxldCBzdGF0czogT2JqZWN0ID0gZnMuc3RhdFN5bmMocGF0aCk7XHJcbiAgICAgICAgbGV0IGVudHJ5OiBEaXJlY3RvcnlFbnRyeSA9IG5ldyBEaXJlY3RvcnlFbnRyeShwYXRoLCBwYXRoUmVsYXRpdmUsIGRpcmVudCwgc3RhdHMpO1xyXG4gICAgICAgIGNvbnRlbnQucHVzaChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZpbGVDb250ZW50KCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCBcInV0ZjhcIik7XHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRFbnRyeShfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogdm9pZCB7XHJcbiAgICAgIGZzLmNvcHlGaWxlU3luYyhfZW50cnkucGF0aCwgcC5qb2luKHRoaXMucGF0aCwgX2VudHJ5Lm5hbWUpLCBmcy5jb25zdGFudHMuQ09QWUZJTEVfRVhDTCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE1pbWVUeXBlKCk6IE1JTUUge1xyXG4gICAgICBsZXQgZXh0ZW5zaW9uOiBzdHJpbmcgPSB0aGlzLm5hbWUuc3BsaXQoXCIuXCIpLnBvcCgpO1xyXG4gICAgICBmb3IgKGxldCB0eXBlIG9mIG1pbWUpIHtcclxuICAgICAgICBpZiAodHlwZVsxXS5pbmRleE9mKGV4dGVuc2lvbikgPiAtMSlcclxuICAgICAgICAgIHJldHVybiB0eXBlWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBNSU1FLlVOS05PV047XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcGF0aCBvZiBEaXJlY3RvcnlFbnRyaWVzIHN0YXJ0aW5nIGF0IHRoZSByb290IGFuZCBlbmRpbmcgYXQgdGhpcyBEaXJlY3RvcnlFbnRyeS4gXHJcbiAgICAgKiBUaGUgZW50cmllcyBpbiB0aGUgcmV0dXJuZWQgcGF0aCBPTkxZIGhhdmUgdGhlaXIgcmVsYXRpdmUgcGF0aCBzZXQuIFRoaXMgaXMgc29sZWx5IHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMgaW4ge0BsaW5rIFZpZXdFeHRlcm5hbH1zIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQYXRoKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICBsZXQgdHJhY2U6IERpcmVjdG9yeUVudHJ5W10gPSBbXTtcclxuICAgICAgbGV0IGN1cnJlbnRQYXRoOiBzdHJpbmcgPSB0aGlzLnBhdGhSZWxhdGl2ZTtcclxuICAgICAgd2hpbGUgKGN1cnJlbnRQYXRoICE9IHRyYWNlW3RyYWNlLmxlbmd0aCAtIDFdPy5wYXRoUmVsYXRpdmUpIHtcclxuICAgICAgICB0cmFjZS5wdXNoKG5ldyBEaXJlY3RvcnlFbnRyeShcIlwiLCBjdXJyZW50UGF0aCwgbnVsbCwgbnVsbCkpO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoID0gcC5kaXJuYW1lKGN1cnJlbnRQYXRoKTtcclxuICAgICAgfTtcclxuICAgICAgdHJhY2UucmV2ZXJzZSgpO1xyXG4gICAgICByZXR1cm4gdHJhY2U7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgXHJcbiAgZXhwb3J0IGVudW0gRVZFTlRfRURJVE9SIHtcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBjcmVhdGVkLCBpcyBub3QgZGlzcGF0Y2hlZCBzbyBmYXIgKi9cclxuICAgIENSRUFURSA9IFwiRURJVE9SX0NSRUFURVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIHNlbGVjdGVkIGFuZCBpdCBpcyBuZWNlc3NhcnkgdG8gc3dpdGNoIGNvbnRlbnRzIGluIHRoZSB2aWV3cyAqL1xyXG4gICAgU0VMRUNUID0gXCJFRElUT1JfU0VMRUNUXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgbW9kaWZpZWQgc3RydWN0dXJhbGx5IGFuZCBpdCBpcyBuZWNlc3NhcnkgdG8gdXBkYXRlIHZpZXdzICovXHJcbiAgICBNT0RJRlkgPSBcIkVESVRPUl9NT0RJRllcIixcclxuICAgIC8qKiBWYWx1ZXMgb2YgYW4gZW50aXR5IGNoYW5nZSBhbmQgaXQgaXMgbmVjZXNzYXJ5IHRvIHVwZGF0ZSB2aWV3cyAqL1xyXG4gICAgVVBEQVRFID0gXCJFRElUT1JfVVBEQVRFXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgZGVsZXRlZCAqL1xyXG4gICAgREVMRVRFID0gXCJFRElUT1JfREVMRVRFXCIsXHJcbiAgICAvKiogQSB2aWV3IG9yIHBhbmVsIGNsb3NlcyAqL1xyXG4gICAgQ0xPU0UgPSBcIkVESVRPUl9DTE9TRVwiLFxyXG4gICAgLyoqIEEgdmlldyBvciBwYW5lbCBvcGVucyAqL1xyXG4gICAgT1BFTiA9IFwiRURJVE9SX09QRU5cIlxyXG4gICAgLyoqIEEgdHJhbnNmb3JtIG1hdHJpeCBnZXRzIGFkanVzdGVkIGludGVyYWN0aXZlbHkgKi8sXHJcbiAgICBUUkFOU0ZPUk0gPSBcIkVESVRPUl9UUkFOU0ZPUk1cIixcclxuICAgIC8qKiBBbiBlbnRpdHkgcmVjaWV2ZXMgZm9jdXMgYW5kIGNhbiBiZSBtYW5pcHVsYXRlZCB1c2luZyB0aGUga2V5Ym9hcmQgKi9cclxuICAgIEZPQ1VTID0gXCJFRElUT1JfRk9DVVNcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBFdmVudERldGFpbCB7XHJcbiAgICB2aWV3PzogVmlldztcclxuICAgIHNlbmRlcj86IFBhbmVsIHwgUGFnZTtcclxuICAgIG5vZGU/OiDGki5Ob2RlO1xyXG4gICAgZ3JhcGg/OiDGki5HcmFwaDtcclxuICAgIHJlc291cmNlPzogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U7XHJcbiAgICBtdXRhYmxlPzogxpIuTXV0YWJsZTtcclxuICAgIHRyYW5zZm9ybT86IE9iamVjdDtcclxuICAgIGRhdGE/OiDGki5HZW5lcmFsO1xyXG4gICAgLy8gcGF0aD86IFZpZXdbXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiBDdXN0b21FdmVudCB0aGF0IHN1cHBvcnRzIGEgZGV0YWlsIGZpZWxkIHdpdGggdGhlIHR5cGUgRXZlbnREZXRhaWxcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRWRpdG9yRXZlbnQgZXh0ZW5kcyBDdXN0b21FdmVudDxFdmVudERldGFpbD4ge1xyXG4gICAgcHVibGljIHN0YXRpYyBkaXNwYXRjaChfdGFyZ2V0OiBFdmVudFRhcmdldCwgX3R5cGU6IEVWRU5UX0VESVRPUiwgX2luaXQ6IEN1c3RvbUV2ZW50SW5pdDxFdmVudERldGFpbD4pOiB2b2lkIHtcclxuICAgICAgX3RhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFZGl0b3JFdmVudChfdHlwZSwgX2luaXQpKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGNvbnN0IGZzOiB0eXBlb2YgaW1wb3J0KFwiZnNcIikgPSByZXF1aXJlKFwiZnNcIik7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIGV4cG9ydCBsZXQgd2F0Y2hlcjogaW1wb3J0KFwiZnNcIikuRlNXYXRjaGVyO1xyXG5cclxuICBpbnRlcmZhY2UgQ29weUxpc3Qge1xyXG4gICAgW3NyYzogc3RyaW5nXTogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5ld1Byb2plY3QoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgZmlsZW5hbWU6IHN0cmluZyB8IHN0cmluZ1tdID0gcmVtb3RlLmRpYWxvZy5zaG93T3BlbkRpYWxvZ1N5bmMobnVsbCwge1xyXG4gICAgICBwcm9wZXJ0aWVzOiBbXCJvcGVuRGlyZWN0b3J5XCIsIFwiY3JlYXRlRGlyZWN0b3J5XCJdLCB0aXRsZTogXCJTZWxlY3QvQ3JlYXRlIGEgZm9sZGVyIHRvIHNhdmUgdGhlIHByb2plY3QgdG8uIFRoZSBmb2xkZXJuYW1lIGJlY29tZXMgdGhlIG5hbWUgb2YgeW91ciBwcm9qZWN0XCIsIGJ1dHRvbkxhYmVsOiBcIlNhdmUgUHJvamVjdFwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIWZpbGVuYW1lKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgbGV0IGJhc2U6IFVSTCA9IG5ldyBVUkwobmV3IFVSTChcImZpbGU6Ly9cIiArIGZpbGVuYW1lWzBdKS50b1N0cmluZygpICsgXCIvXCIpO1xyXG4gICAgY29uc29sZS5sb2coXCJQYXRoXCIsIGJhc2UudG9TdHJpbmcoKSk7XHJcbiAgICAgIFxyXG4gICAgcHJvamVjdCA9IG5ldyBQcm9qZWN0KGJhc2UpO1xyXG5cclxuICAgIGF3YWl0IHNhdmVQcm9qZWN0KHRydWUpO1xyXG5cclxuICAgIGxldCDGklBhdGg6IFVSTCA9IG5ldyBVUkwoXCIuLi8uLi9cIiwgbG9jYXRpb24uaHJlZik7XHJcbiAgICBjb25zb2xlLmxvZyjGklBhdGgpO1xyXG5cclxuICAgIGZzLmNvcHlGaWxlU3luYyhuZXcgVVJMKFwiRWRpdG9yL1NvdXJjZS9UZW1wbGF0ZS8uZ2l0aWdub3JlLnR4dFwiLCDGklBhdGgpLCBuZXcgVVJMKFwiLmdpdGlnbm9yZVwiLCBiYXNlKSk7XHJcbiAgICBmcy5ta2RpclN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2VcIiwgYmFzZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgZnMubWtkaXJTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlL0B0eXBlc1wiLCBiYXNlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICBmcy5ta2RpclN5bmMobmV3IFVSTChcIlNjcmlwdC9CdWlsZFwiLCBiYXNlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcblxyXG4gICAgbGV0IGNvcHlUZW1wbGF0ZXM6IENvcHlMaXN0ID0ge1xyXG4gICAgICBcIkN1c3RvbUNvbXBvbmVudFNjcmlwdC50eHRcIjogXCJTb3VyY2UvQ3VzdG9tQ29tcG9uZW50U2NyaXB0LnRzXCIsXHJcbiAgICAgIFwiTWFpbi50eHRcIjogXCJTb3VyY2UvTWFpbi50c1wiLFxyXG4gICAgICBcInRzY29uZmlnLnR4dFwiOiBcIlNvdXJjZS90c2NvbmZpZy5qc29uXCIsXHJcbiAgICAgIFwiU2NyaXB0LnR4dFwiOiBcIiBCdWlsZC9TY3JpcHQuanNcIixcclxuICAgICAgXCJBdXRvdmlldy5qc1wiOiBcIi4uL0F1dG92aWV3LmpzXCJcclxuICAgIH07XHJcbiAgICBjb3B5RmlsZXMoY29weVRlbXBsYXRlcywgbmV3IFVSTChcIkVkaXRvci9Tb3VyY2UvVGVtcGxhdGUvXCIsIMaSUGF0aCksIG5ldyBVUkwoXCJTY3JpcHQvXCIsIGJhc2UpKTtcclxuXHJcbiAgICBsZXQgZGVmaW5pdGlvbjogUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5kLnRzXCIpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZS9AdHlwZXMvRnVkZ2VDb3JlLmQudHNcIiwgYmFzZSksIGF3YWl0IGRlZmluaXRpb24udGV4dCgpKTtcclxuXHJcbiAgICBhd2FpdCBsb2FkUHJvamVjdChuZXcgVVJMKHByb2plY3QuZmlsZUluZGV4LCBwcm9qZWN0LmJhc2UpKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNvcHlGaWxlcyhfbGlzdDogQ29weUxpc3QsIF9zcmNQYXRoOiBVUkwsIF9kZXN0UGF0aDogVVJMKTogdm9pZCB7XHJcbiAgICBmb3IgKGxldCBjb3B5IGluIF9saXN0KSB7XHJcbiAgICAgIGxldCBzcmM6IFVSTCA9IG5ldyBVUkwoY29weSwgX3NyY1BhdGgpO1xyXG4gICAgICBsZXQgZGVzdDogVVJMID0gbmV3IFVSTChfbGlzdFtjb3B5XSwgX2Rlc3RQYXRoKTtcclxuICAgICAgZnMuY29weUZpbGVTeW5jKHNyYywgZGVzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZVByb2plY3QoX25ldzogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBpZiAoIXByb2plY3QpXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICBpZiAoIWF3YWl0IHByb2plY3Qub3BlbkRpYWxvZygpKVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgdW53YXRjaEZvbGRlcigpO1xyXG5cclxuICAgIGxldCBiYXNlOiBVUkwgPSBwcm9qZWN0LmJhc2U7XHJcblxyXG4gICAgaWYgKF9uZXcpIHtcclxuICAgICAgbGV0IGNzc0ZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZVN0eWxlcywgYmFzZSk7XHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoY3NzRmlsZU5hbWUsIHByb2plY3QuZ2V0UHJvamVjdENTUygpKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaHRtbDogc3RyaW5nID0gcHJvamVjdC5nZXRQcm9qZWN0SFRNTChwcm9qZWN0Lm5hbWUpO1xyXG4gICAgbGV0IGh0bWxGaWxlTmFtZTogVVJMID0gbmV3IFVSTChwcm9qZWN0LmZpbGVJbmRleCwgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGh0bWxGaWxlTmFtZSwgaHRtbCk7XHJcblxyXG4gICAgbGV0IGpzb25GaWxlTmFtZTogVVJMID0gbmV3IFVSTChwcm9qZWN0LmZpbGVJbnRlcm5hbCwgYmFzZSk7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25GaWxlTmFtZSwgcHJvamVjdC5nZXRQcm9qZWN0SlNPTigpKTtcclxuXHJcbiAgICBqc29uRmlsZU5hbWUgPSBuZXcgVVJMKHByb2plY3QuZmlsZUludGVybmFsRm9sZGVyLCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoanNvbkZpbGVOYW1lLCBwcm9qZWN0LmdldFJlc291cmNlRm9sZGVySlNPTigpKTtcclxuXHJcbiAgICBqc29uRmlsZU5hbWUgPSBuZXcgVVJMKHByb2plY3QuZmlsZVNldHRpbmdzLCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoanNvbkZpbGVOYW1lLCBwcm9qZWN0LmdldFNldHRpbmdzSlNPTigpKTtcclxuXHJcbiAgICB3YXRjaEZvbGRlcigpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvbXB0TG9hZFByb2plY3QoKTogUHJvbWlzZTxVUkw+IHtcclxuICAgIGxldCBmaWxlbmFtZXM6IHN0cmluZ1tdID0gcmVtb3RlLmRpYWxvZy5zaG93T3BlbkRpYWxvZ1N5bmMobnVsbCwge1xyXG4gICAgICB0aXRsZTogXCJMb2FkIFByb2plY3RcIiwgYnV0dG9uTGFiZWw6IFwiTG9hZCBQcm9qZWN0XCIsIHByb3BlcnRpZXM6IFtcIm9wZW5GaWxlXCJdLFxyXG4gICAgICBmaWx0ZXJzOiBbeyBuYW1lOiBcIkhUTUwtRmlsZVwiLCBleHRlbnNpb25zOiBbXCJodG1sXCIsIFwiaHRtXCJdIH1dXHJcbiAgICB9KTtcclxuICAgIGlmICghZmlsZW5hbWVzKVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgVVJMKFwiZmlsZTovL1wiICsgZmlsZW5hbWVzWzBdKTtcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUHJvamVjdChfdXJsOiBVUkwpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBodG1sQ29udGVudDogc3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKF91cmwsIHsgZW5jb2Rpbmc6IFwidXRmLThcIiB9KTtcclxuICAgIMaSLkRlYnVnLmdyb3VwQ29sbGFwc2VkKFwiRmlsZSBjb250ZW50XCIpO1xyXG4gICAgxpIuRGVidWcuaW5mbyhodG1sQ29udGVudCk7XHJcbiAgICDGki5EZWJ1Zy5ncm91cEVuZCgpO1xyXG5cclxuICAgIHVud2F0Y2hGb2xkZXIoKTtcclxuXHJcbiAgICBwcm9qZWN0ID0gbmV3IFByb2plY3QoX3VybCk7XHJcbiAgICBhd2FpdCBwcm9qZWN0LmxvYWQoaHRtbENvbnRlbnQpO1xyXG5cclxuICAgIHdhdGNoRm9sZGVyKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB3YXRjaEZvbGRlcigpOiB2b2lkIHtcclxuICAgIGxldCBkaXI6IFVSTCA9IG5ldyBVUkwoXCIuXCIsIHByb2plY3QuYmFzZSk7XHJcbiAgICB3YXRjaGVyID0gZnMud2F0Y2goZGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LCBobmRGaWxlQ2hhbmdlKTtcclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBobmRGaWxlQ2hhbmdlKF9ldmVudDogc3RyaW5nLCBfZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZUluZGV4IHx8IF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVJbnRlcm5hbCB8fCBfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlU2NyaXB0KSB7XHJcbiAgICAgICAgdW53YXRjaEZvbGRlcigpO1xyXG4gICAgICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gxpJ1aS5EaWFsb2cucHJvbXB0KG51bGwsIGZhbHNlLCBcIkltcG9ydGFudCBmaWxlIGNoYW5nZVwiLCBcIlJlbG9hZCBwcm9qZWN0P1wiLCBcIlJlbG9hZFwiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgICAgICAgYXdhaXQgbG9hZFByb2plY3QocHJvamVjdC5iYXNlKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHdhdGNoZXIgPSBmcy53YXRjaChkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0sIGhuZEZpbGVDaGFuZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiB1bndhdGNoRm9sZGVyKCk6IHZvaWQge1xyXG4gICAgaWYgKCF3YXRjaGVyKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB3YXRjaGVyLnVucmVmKCk7XHJcbiAgICB3YXRjaGVyLmNsb3NlKCk7XHJcbiAgfVxyXG59XHJcblxyXG4iLCIvLy88cmVmZXJlbmNlIHR5cGVzPVwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uL0VsZWN0cm9uXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCJEZWZpbml0aW9uLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLy8gaW1wb3J0IMaSYWlkID0gRnVkZ2VBaWQ7XHJcbiAgLy8gaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjb25zdCBpcGNSZW5kZXJlcjogRWxlY3Ryb24uSXBjUmVuZGVyZXIgPSByZXF1aXJlKFwiZWxlY3Ryb25cIikuaXBjUmVuZGVyZXI7IC8vIFJlcGxhY2Ugd2l0aDpcclxuICBleHBvcnQgY29uc3QgcmVtb3RlOiB0eXBlb2YgaW1wb3J0KFwiQGVsZWN0cm9uL3JlbW90ZVwiKSA9IHJlcXVpcmUoXCJAZWxlY3Ryb24vcmVtb3RlXCIpO1xyXG5cclxuICBleHBvcnQgbGV0IHByb2plY3Q6IFByb2plY3Q7IC8vID0gbmV3IFByb2plY3QoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHVwcGVybW9zdCBjb250YWluZXIgZm9yIGFsbCBwYW5lbHMgY29udHJvbGxpbmcgZGF0YSBmbG93IGJldHdlZW4uIFxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYWdlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ29sZGVuTGF5b3V0TW9kdWxlOiDGki5HZW5lcmFsID0gKGdsb2JhbFRoaXMgYXMgxpIuR2VuZXJhbCkuZ29sZGVuTGF5b3V0OyAgLy8gxpIuR2VuZXJhbCBpcyBzeW5vbnltIGZvciBhbnkuLi4gaGFjayB0byBnZXQgR29sZGVuTGF5b3V0IHRvIHdvcmtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW9kZVRyYW5zZm9ybTogVFJBTlNGT1JNID0gVFJBTlNGT1JNLlRSQU5TTEFURTtcclxuICAgIC8vIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhdGljIGdvbGRlbkxheW91dDogR29sZGVuTGF5b3V0O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFuZWxzOiBQYW5lbFtdID0gW107XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwaHlzaWNzOiB7IFtpZEdyYXBoOiBzdHJpbmddOiDGki5QaHlzaWNzIH0gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldERlZmF1bHRQcm9qZWN0KCk6IHZvaWQge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlNldCBkZWZhdWx0IHByb2plY3QgaW4gbG9jYWwgc3RvcmFnZVwiLCBwcm9qZWN0KTtcclxuICAgICAgaWYgKHByb2plY3QpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm9qZWN0XCIsIHByb2plY3QuYmFzZS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldExheW91dCgpOiBSZXNvbHZlZExheW91dENvbmZpZyB7XHJcbiAgICAgIHJldHVybiBQYWdlLmdvbGRlbkxheW91dC5zYXZlTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTGF5b3V0KF9sYXlvdXQ/OiBMYXlvdXRDb25maWcpOiB2b2lkIHtcclxuICAgICAgX2xheW91dCA/Pz0ge1xyXG4gICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgcG9wb3V0OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcm9vdDoge1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGlzQ2xvc2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgY29udGVudDogW11cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5sb2FkTGF5b3V0KF9sYXlvdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0VHJhbnNmb3JtKF9tb2RlOiBUUkFOU0ZPUk0pOiB2b2lkIHtcclxuICAgICAgUGFnZS5tb2RlVHJhbnNmb3JtID0gX21vZGU7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBUcmFuc2Zvcm0gbW9kZTogJHtfbW9kZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFBoeXNpY3MoX2dyYXBoOiDGki5HcmFwaCk6IMaSLlBoeXNpY3Mge1xyXG4gICAgICByZXR1cm4gUGFnZS5waHlzaWNzW19ncmFwaC5pZFJlc291cmNlXSB8fCAoUGFnZS5waHlzaWNzW19ncmFwaC5pZFJlc291cmNlXSA9IG5ldyDGki5QaHlzaWNzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBieSB3aW5kb3dzIGxvYWQtbGlzdGVuZXJcclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAvLyDGki5EZWJ1Zy5zZXRGaWx0ZXIoxpIuRGVidWdDb25zb2xlLCDGki5ERUJVR19GSUxURVIuQUxMIHwgxpIuREVCVUdfRklMVEVSLlNPVVJDRSk7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcIkxvY2FsU3RvcmFnZVwiLCBsb2NhbFN0b3JhZ2UpO1xyXG5cclxuICAgICAgUGFnZS5zZXR1cEdvbGRlbkxheW91dCgpO1xyXG4gICAgICDGki5Qcm9qZWN0Lm1vZGUgPSDGki5NT0RFLkVESVRPUjtcclxuXHJcbiAgICAgIFBhZ2Uuc2V0dXBNYWluTGlzdGVuZXJzKCk7XHJcbiAgICAgIFBhZ2Uuc2V0dXBQYWdlTGlzdGVuZXJzKCk7XHJcbiAgICAgIC8vIGZvciB0ZXN0aW5nOlxyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUEFORUxfUFJPSkVDVF9PUEVOKTtcclxuICAgICAgLy8gaXBjUmVuZGVyZXIuZW1pdChNRU5VLlBBTkVMX0dSQVBIX09QRU4pO1xyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUFJPSkVDVF9MT0FEKTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9HUkFQSF9PUEVOLCBvbjogZmFsc2UgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfSEVMUF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuXHJcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UucHJvamVjdCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZCBwcm9qZWN0IHJlZmVyZW5jZWQgaW4gbG9jYWwgc3RvcmFnZVwiLCBsb2NhbFN0b3JhZ2UucHJvamVjdCk7XHJcbiAgICAgICAgYXdhaXQgUGFnZS5sb2FkUHJvamVjdChuZXcgVVJMKGxvY2FsU3RvcmFnZS5wcm9qZWN0KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzZXR1cEdvbGRlbkxheW91dCgpOiB2b2lkIHtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQgPSBuZXcgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuR29sZGVuTGF5b3V0KCk7IC8vIEdvbGRlbkxheW91dCAyIGFzIFVNRC1Nb2R1bGVcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQub24oXCJpdGVtQ3JlYXRlZFwiLCBQYWdlLmhuZFBhbmVsQ3JlYXRlZCk7XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLlBST0pFQ1QsIFBhbmVsUHJvamVjdCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuR1JBUEgsIFBhbmVsR3JhcGgpO1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5yZWdpc3RlckNvbXBvbmVudENvbnN0cnVjdG9yKFBBTkVMLkhFTFAsIFBhbmVsSGVscCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuQU5JTUFUSU9OLCBQYW5lbEFuaW1hdGlvbik7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuUEFSVElDTEVfU1lTVEVNLCBQYW5lbFBhcnRpY2xlU3lzdGVtKTtcclxuXHJcbiAgICAgIFBhZ2UubG9hZExheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFkZChfcGFuZWw6IHR5cGVvZiBQYW5lbCwgX3N0YXRlPzogSnNvblZhbHVlKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhbmVsQ29uZmlnOiBDb21wb25lbnRJdGVtQ29uZmlnID0ge1xyXG4gICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgY29tcG9uZW50VHlwZTogX3BhbmVsLm5hbWUsXHJcbiAgICAgICAgY29tcG9uZW50U3RhdGU6IF9zdGF0ZSxcclxuICAgICAgICB0aXRsZTogXCJQYW5lbFwiLFxyXG4gICAgICAgIGlkOiBQYWdlLmdlbmVyYXRlSUQoX3BhbmVsLm5hbWUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBpZiAoIVBhZ2UuZ29sZGVuTGF5b3V0LnJvb3RJdGVtKSAgLy8gd29ya2Fyb3VuZCBiZWNhdXNlIGdvbGRlbiBMYXlvdXQgbG9zZXMgcm9vdEl0ZW0uLi5cclxuICAgICAgLy8gICBQYWdlLmxvYWRMYXlvdXQoKTsgLy8gVE9ETzogdGhlc2UgdHdvIGxpbmVzIGFwcGVhciB0byBiZSBvYnNvbGV0ZSwgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0XHJcblxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5hZGRJdGVtQXRMb2NhdGlvbihwYW5lbENvbmZpZywgW3sgdHlwZUlkOiBMYXlvdXRNYW5hZ2VyLkxvY2F0aW9uU2VsZWN0b3IuVHlwZUlkLlJvb3QgfV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGZpbmQoX3R5cGU6IHR5cGVvZiBQYW5lbCk6IFBhbmVsW10ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBQYW5lbFtdID0gW107XHJcbiAgICAgIHJlc3VsdCA9IFBhZ2UucGFuZWxzLmZpbHRlcihfcGFuZWwgPT4gX3BhbmVsIGluc3RhbmNlb2YgX3R5cGUpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlSUQoX25hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xyXG4gICAgICB3aGlsZSAodGhpcy5nb2xkZW5MYXlvdXQuZmluZEZpcnN0Q29tcG9uZW50SXRlbUJ5SWQoX25hbWUgKyBpKSlcclxuICAgICAgICBpKys7XHJcbiAgICAgIHJldHVybiBfbmFtZSArIGk7IC8vIF9uYW1lICsgUGFnZS5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gUGFnZS1FdmVudHMgZnJvbSBET01cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwUGFnZUxpc3RlbmVycygpOiB2b2lkIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCBQYWdlLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgUGFnZS5obmRLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBTZW5kIGN1c3RvbSBjb3BpZXMgb2YgdGhlIGdpdmVuIGV2ZW50IHRvIHRoZSBwYW5lbHMgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGJyb2FkY2FzdChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBkZXRhaWw6IEV2ZW50RGV0YWlsID0gX2V2ZW50LmRldGFpbCB8fCB7fTtcclxuICAgICAgbGV0IHNlbmRlcjogUGFuZWwgfCBQYWdlID0gZGV0YWlsPy5zZW5kZXI7XHJcbiAgICAgIGRldGFpbC5zZW5kZXIgPSBQYWdlO1xyXG4gICAgICBmb3IgKGxldCBwYW5lbCBvZiBQYWdlLnBhbmVscykge1xyXG4gICAgICAgIGlmIChwYW5lbCAhPSBzZW5kZXIpIC8vIGRvbid0IHNlbmQgYmFjayB0byBvcmlnaW5hbCBzZW5kZXJcclxuICAgICAgICAgIHBhbmVsLmRpc3BhdGNoKDxFVkVOVF9FRElUT1I+X2V2ZW50LnR5cGUsIHsgZGV0YWlsOiBkZXRhaWwgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5UOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlRSQU5TTEFURSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuUjpcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKFRSQU5TRk9STS5ST1RBVEUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkU6XHJcbiAgICAgICAgICAvLyBUT0RPOiBkb24ndCBzd2l0Y2ggdG8gc2NhbGUgbW9kZSB3aGVuIHVzaW5nIGZseS1jYW1lcmEgYW5kIHByZXNzaW5nIEVcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKFRSQU5TRk9STS5TQ0FMRSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRFdmVudChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIGxldCB2aWV3OiBWaWV3ID0gX2V2ZW50LmRldGFpbC52aWV3O1xyXG4gICAgICAgICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBQYW5lbClcclxuICAgICAgICAgICAgUGFnZS5wYW5lbHMuc3BsaWNlKFBhZ2UucGFuZWxzLmluZGV4T2YodmlldyksIDEpO1xyXG5cclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2xvc2VkXCIsIHZpZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIFBhZ2UuYnJvYWRjYXN0KF9ldmVudCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaG5kUGFuZWxDcmVhdGVkID0gKF9ldmVudDogRXZlbnRFbWl0dGVyLkJ1YmJsaW5nRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogQ29tcG9uZW50SXRlbSA9IF9ldmVudC50YXJnZXQgYXMgQ29tcG9uZW50SXRlbTtcclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkNvbXBvbmVudEl0ZW0pIHtcclxuICAgICAgICBQYWdlLnBhbmVscy5wdXNoKDxQYW5lbD50YXJnZXQuY29tcG9uZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBsb2FkUHJvamVjdChfdXJsOiBVUkwpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgYXdhaXQgbG9hZFByb2plY3QoX3VybCk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUFJPSkVDVF9TQVZFLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0FOSU1BVElPTl9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIE1haW4tRXZlbnRzIGZyb20gRWxlY3Ryb25cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwTWFpbkxpc3RlbmVycygpOiB2b2lkIHtcclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX05FVywgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIMaSLlByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICBhd2FpdCBuZXdQcm9qZWN0KCk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUFJPSkVDVF9TQVZFLCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgaWYgKGF3YWl0IHNhdmVQcm9qZWN0KCkpXHJcbiAgICAgICAgICBQYWdlLnNldERlZmF1bHRQcm9qZWN0KCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX0xPQUQsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBsZXQgdXJsOiBVUkwgPSBhd2FpdCBwcm9tcHRMb2FkUHJvamVjdCgpO1xyXG4gICAgICAgIGlmICghdXJsKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGF3YWl0IFBhZ2UubG9hZFByb2plY3QodXJsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0dSQVBIX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEdyYXBoLCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsUHJvamVjdCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9IRUxQX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEhlbHAsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUVVJVCwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2Uuc2V0RGVmYXVsdFByb2plY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0FOSU1BVElPTl9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxBbmltYXRpb24sIG51bGwpO1xyXG4gICAgICAgIC8vIGxldCBwYW5lbDogUGFuZWwgPSBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlUGFuZWxGcm9tVGVtcGxhdGUobmV3IFZpZXdBbmltYXRpb25UZW1wbGF0ZSgpLCBcIkFuaW1hdGlvbiBQYW5lbFwiKTtcclxuICAgICAgICAvLyBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuYWRkUGFuZWwocGFuZWwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfUEFSVElDTEVfU1lTVEVNX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbFBhcnRpY2xlU3lzdGVtLCBudWxsKTtcclxuICAgICAgICAvLyBsZXQgcGFuZWw6IFBhbmVsID0gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmNyZWF0ZVBhbmVsRnJvbVRlbXBsYXRlKG5ldyBWaWV3QW5pbWF0aW9uVGVtcGxhdGUoKSwgXCJBbmltYXRpb24gUGFuZWxcIik7XHJcbiAgICAgICAgLy8gUGFuZWxNYW5hZ2VyLmluc3RhbmNlLmFkZFBhbmVsKHBhbmVsKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmdW5jdGlvbiB3ZWxjb21lKGNvbnRhaW5lcjogR29sZGVuTGF5b3V0LkNvbnRhaW5lciwgc3RhdGU6IE9iamVjdCk6IHZvaWQge1xyXG4gIC8vICAgY29udGFpbmVyLmdldEVsZW1lbnQoKS5odG1sKFwiPGRpdj5XZWxjb21lPC9kaXY+XCIpO1xyXG4gIC8vIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICDGki5TZXJpYWxpemVyLnJlZ2lzdGVyTmFtZXNwYWNlKEZ1ZGdlKTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFByb2plY3QgZXh0ZW5kcyDGki5NdXRhYmxlIHsgLy8gVE9ETzogcmVwbGFjZSB3aXRoIHNlcmlsaXphYmxlXHJcbiAgICAvLyBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiTmV3UHJvamVjdFwiO1xyXG4gICAgcHVibGljIGJhc2U6IFVSTDtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGZpbGVJbmRleDogc3RyaW5nID0gXCJpbmRleC5odG1sXCI7XHJcbiAgICBwdWJsaWMgZmlsZUludGVybmFsOiBzdHJpbmcgPSBcIkludGVybmFsLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlSW50ZXJuYWxGb2xkZXI6IHN0cmluZyA9IFwiSW50ZXJuYWxGb2xkZXIuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVTY3JpcHQ6IHN0cmluZyA9IFwiU2NyaXB0L0J1aWxkL1NjcmlwdC5qc1wiO1xyXG4gICAgcHVibGljIGZpbGVTZXR0aW5nczogc3RyaW5nID0gXCJzZXR0aW5ncy5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZVN0eWxlczogc3RyaW5nID0gXCJzdHlsZXMuY3NzXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBncmFwaEF1dG9WaWV3OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLy8gcHJpdmF0ZSBpbmNsdWRlQXV0b1ZpZXdTY3JpcHQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICNyZXNvdXJjZUZvbGRlcjogUmVzb3VyY2VGb2xkZXI7XHJcbiAgICAjZG9jdW1lbnQ6IERvY3VtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYmFzZTogVVJMKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuYmFzZSA9IF9iYXNlO1xyXG4gICAgICB0aGlzLm5hbWUgPSBfYmFzZS50b1N0cmluZygpLnNwbGl0KFwiL1wiKS5zbGljZSgtMiwgLTEpWzBdO1xyXG4gICAgICB0aGlzLmZpbGVJbmRleCA9IF9iYXNlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpLnBvcCgpIHx8IHRoaXMuZmlsZUluZGV4O1xyXG5cclxuICAgICAgxpIuUHJvamVjdC5jbGVhcigpO1xyXG4gICAgICDGki5Qcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuR1JBUEhfTVVUQVRFRCxcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gUGFnZS5icm9hZGNhc3QobmV3IEVkaXRvckV2ZW50KEVWRU5UX0VESVRPUi5VUERBVEUpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VGb2xkZXIoKTogUmVzb3VyY2VGb2xkZXIge1xyXG4gICAgICBpZiAoIXRoaXMuI3Jlc291cmNlRm9sZGVyKVxyXG4gICAgICAgIHRoaXMuI3Jlc291cmNlRm9sZGVyID0gbmV3IFJlc291cmNlRm9sZGVyKFwiUmVzb3VyY2VzXCIpO1xyXG4gICAgICByZXR1cm4gdGhpcy4jcmVzb3VyY2VGb2xkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gxpJ1aS5EaWFsb2cucHJvbXB0KHByb2plY3QsIGZhbHNlLCBcIlJldmlldyBwcm9qZWN0IHNldHRpbmdzXCIsIFwiQWRqdXN0IHNldHRpbmdzIGFuZCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG5cclxuICAgICAgxpJ1aS5EaWFsb2cuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSDGknVpLkNvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLCDGknVpLkRpYWxvZy5kb20sIHRoaXMuZ2V0TXV0YXRvcigpKTtcclxuICAgICAgICB0aGlzLm11dGF0ZShtdXRhdG9yKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgICBjb25zb2xlLmxvZyhtdXRhdG9yLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGxvYWQoX2h0bWxDb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IG5ldyDGki5QaHlzaWNzKCk7XHJcbiAgICAgIGNvbnN0IHBhcnNlcjogRE9NUGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgICB0aGlzLiNkb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoX2h0bWxDb250ZW50LCBcInRleHQvaHRtbFwiKTtcclxuICAgICAgY29uc3QgaGVhZDogSFRNTEhlYWRFbGVtZW50ID0gdGhpcy4jZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIik7XHJcblxyXG4gICAgICB0aGlzLmxvYWRGb250cyhoZWFkKTtcclxuXHJcbiAgICAgIGNvbnN0IHNjcmlwdHM6IE5vZGVMaXN0T2Y8SFRNTFNjcmlwdEVsZW1lbnQ+ID0gaGVhZC5xdWVyeVNlbGVjdG9yQWxsKFwic2NyaXB0XCIpO1xyXG4gICAgICBmb3IgKGxldCBzY3JpcHQgb2Ygc2NyaXB0cykge1xyXG4gICAgICAgIGlmIChzY3JpcHQuZ2V0QXR0cmlidXRlKFwiZWRpdG9yXCIpID09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xyXG4gICAgICAgICAgxpIuRGVidWcuZnVkZ2UoXCJMb2FkIHNjcmlwdDogXCIsIHVybCk7XHJcbiAgICAgICAgICBhd2FpdCDGki5Qcm9qZWN0LmxvYWRTY3JpcHQobmV3IFVSTCh1cmwsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXBvbmVudFNjcmlwdHNcIiwgxpIuUHJvamVjdC5nZXRDb21wb25lbnRTY3JpcHRzKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJTY3JpcHQgTmFtZXNwYWNlc1wiLCDGki5Qcm9qZWN0LnNjcmlwdE5hbWVzcGFjZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzb3VyY2VMaW5rOiBIVE1MTGlua0VsZW1lbnQgPSBoZWFkLnF1ZXJ5U2VsZWN0b3IoXCJsaW5rW3R5cGU9cmVzb3VyY2VzXVwiKTtcclxuICAgICAgbGV0IHJlc291cmNlRmlsZTogc3RyaW5nID0gcmVzb3VyY2VMaW5rLmdldEF0dHJpYnV0ZShcInNyY1wiKTtcclxuICAgICAgcHJvamVjdC5maWxlSW50ZXJuYWwgPSByZXNvdXJjZUZpbGU7XHJcbiAgICAgIMaSLlByb2plY3QuYmFzZVVSTCA9IHRoaXMuYmFzZTtcclxuICAgICAgbGV0IHJlY29uc3RydWN0aW9uOiDGki5SZXNvdXJjZXMgPSBhd2FpdCDGki5Qcm9qZWN0LmxvYWRSZXNvdXJjZXMobmV3IFVSTChyZXNvdXJjZUZpbGUsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICDGki5EZWJ1Zy5ncm91cENvbGxhcHNlZChcIkRlc2VyaWFsaXplZFwiKTtcclxuICAgICAgxpIuRGVidWcuaW5mbyhyZWNvbnN0cnVjdGlvbik7XHJcbiAgICAgIMaSLkRlYnVnLmdyb3VwRW5kKCk7XHJcblxyXG4gICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTsgLy8gcmVtb3ZlIHBvdGVudGlhbCByaWdpZGJvZGllc1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNvdXJjZUZvbGRlckNvbnRlbnQ6IHN0cmluZyA9IGF3YWl0IChhd2FpdCBmZXRjaChuZXcgVVJMKHRoaXMuZmlsZUludGVybmFsRm9sZGVyLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpKS50ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgcmVzb3VyY2VGb2xkZXI6IMaSLlNlcmlhbGl6YWJsZSA9IGF3YWl0IMaSLlNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoxpIuU2VyaWFsaXplci5wYXJzZShyZXNvdXJjZUZvbGRlckNvbnRlbnQpKTtcclxuICAgICAgICBpZiAocmVzb3VyY2VGb2xkZXIgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHRoaXMuI3Jlc291cmNlRm9sZGVyID0gcmVzb3VyY2VGb2xkZXI7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLndhcm4oYEZhaWxlZCB0byBsb2FkICcke3RoaXMuZmlsZUludGVybmFsRm9sZGVyfScuIEEgbmV3IHJlc291cmNlIGZvbGRlciB3YXMgY3JlYXRlZCBhbmQgd2lsbCBiZSBzYXZlZC5gLCBfZXJyb3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc2V0dGluZ3M6IEhUTUxNZXRhRWxlbWVudCA9IGhlYWQucXVlcnlTZWxlY3RvcihcIm1ldGFbdHlwZT1zZXR0aW5nc11cIik7XHJcbiAgICAgIGxldCBwcm9qZWN0U2V0dGluZ3M6IHN0cmluZyA9IHNldHRpbmdzPy5nZXRBdHRyaWJ1dGUoXCJwcm9qZWN0XCIpO1xyXG4gICAgICBwcm9qZWN0U2V0dGluZ3MgPSBwcm9qZWN0U2V0dGluZ3M/LnJlcGxhY2UoLycvZywgXCJcXFwiXCIpO1xyXG4gICAgICBhd2FpdCBwcm9qZWN0Lm11dGF0ZShKU09OLnBhcnNlKHByb2plY3RTZXR0aW5ncyB8fCBcInt9XCIpKTtcclxuXHJcbiAgICAgIGxldCBjb25maWc6IExheW91dENvbmZpZztcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzZXR0aW5nc0NvbnRlbnQ6IHN0cmluZyA9IGF3YWl0IChhd2FpdCBmZXRjaChuZXcgVVJMKHRoaXMuZmlsZVNldHRpbmdzLCB0aGlzLmJhc2UpLnRvU3RyaW5nKCkpKS50ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgcGFuZWxTZXR0aW5nczogxpIuU2VyaWFsaXphdGlvbiA9IMaSLlNlcmlhbGl6ZXIucGFyc2Uoc2V0dGluZ3NDb250ZW50KTtcclxuICAgICAgICBjb25maWcgPSBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5MYXlvdXRDb25maWcuZnJvbVJlc29sdmVkKHBhbmVsU2V0dGluZ3MubGF5b3V0KTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgRmFpbGVkIHRvIGxvYWQgJyR7dGhpcy5maWxlU2V0dGluZ3N9Jy4gQSBuZXcgc2V0dGluZ3MgZmlsZSB3YXMgY3JlYXRlZCBhbmQgd2lsbCBiZSBzYXZlZC5gLCBfZXJyb3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBQYWdlLmxvYWRMYXlvdXQoY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvamVjdEpTT04oKTogc3RyaW5nIHtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb25PZlJlc291cmNlcyA9IMaSLlByb2plY3Quc2VyaWFsaXplKCk7XHJcbiAgICAgIGxldCBqc29uOiBzdHJpbmcgPSDGki5TZXJpYWxpemVyLnN0cmluZ2lmeShzZXJpYWxpemF0aW9uKTtcclxuICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJlc291cmNlRm9sZGVySlNPTigpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gxpIuU2VyaWFsaXplci5zdHJpbmdpZnkoxpIuU2VyaWFsaXplci5zZXJpYWxpemUodGhpcy5yZXNvdXJjZUZvbGRlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZXR0aW5nc0pTT04oKTogc3RyaW5nIHtcclxuICAgICAgbGV0IHNldHRpbmdzOiDGki5TZXJpYWxpemF0aW9uID0ge307XHJcbiAgICAgIHNldHRpbmdzLmxheW91dCA9IFBhZ2UuZ2V0TGF5b3V0KCk7XHJcblxyXG4gICAgICByZXR1cm4gxpIuU2VyaWFsaXplci5zdHJpbmdpZnkoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0Q1NTKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgY29udGVudCArPSBcImh0bWwsIGJvZHkge1xcbiAgcGFkZGluZzogMHB4O1xcbiAgbWFyZ2luOiAwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuXCI7XHJcbiAgICAgIGNvbnRlbnQgKz0gXCJkaWFsb2cgeyBcXG4gIHRleHQtYWxpZ246IGNlbnRlcjsgXFxufVxcblxcblwiO1xyXG4gICAgICBjb250ZW50ICs9IFwiY2FudmFzLmZ1bGxzY3JlZW4geyBcXG4gIHdpZHRoOiAxMDB2dzsgXFxuICBoZWlnaHQ6IDEwMHZoOyBcXG59XCI7XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvamVjdEhUTUwoX3RpdGxlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICBpZiAoIXRoaXMuI2RvY3VtZW50KVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVByb2plY3RIVE1MKF90aXRsZSk7XHJcblxyXG4gICAgICB0aGlzLiNkb2N1bWVudC50aXRsZSA9IF90aXRsZTtcclxuXHJcbiAgICAgIGxldCBzZXR0aW5nczogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWV0YVwiKTtcclxuICAgICAgc2V0dGluZ3Muc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInNldHRpbmdzXCIpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJhdXRvdmlld1wiLCB0aGlzLmdyYXBoQXV0b1ZpZXcpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJwcm9qZWN0XCIsIHRoaXMuc2V0dGluZ3NTdHJpbmdpZnkoKSk7XHJcbiAgICAgIHRoaXMuI2RvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihcIm1ldGFbdHlwZT1zZXR0aW5nc11cIikucmVwbGFjZVdpdGgoc2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gbGV0IGF1dG9WaWV3U2NyaXB0OiBIVE1MU2NyaXB0RWxlbWVudCA9IHRoaXMuI2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRbbmFtZT1hdXRvVmlld11cIik7XHJcbiAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVBdXRvVmlld1NjcmlwdCkge1xyXG4gICAgICAvLyAgIGlmICghYXV0b1ZpZXdTY3JpcHQpXHJcbiAgICAgIC8vICAgICB0aGlzLiNkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuZ2V0QXV0b1ZpZXdTY3JpcHQoKSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gZWxzZVxyXG4gICAgICAvLyAgIGlmIChhdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICAgIHRoaXMuI2RvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoYXV0b1ZpZXdTY3JpcHQpO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5SFRNTCh0aGlzLiNkb2N1bWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhfbXV0YXRvcjogxpIuTXV0YXRvcik6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyB7XHJcbiAgICAgIGxldCB0eXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gc3VwZXIuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKF9tdXRhdG9yKTtcclxuICAgICAgaWYgKHR5cGVzLmdyYXBoQXV0b1ZpZXcpXHJcbiAgICAgICAgdHlwZXMuZ3JhcGhBdXRvVmlldyA9IHRoaXMuZ2V0R3JhcGhzKCk7XHJcbiAgICAgIHJldHVybiB0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVkdWNlTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuYmFzZTtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbmRleDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbnRlcm5hbDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVJbnRlcm5hbEZvbGRlcjtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTY3JpcHQ7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlU2V0dGluZ3M7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5maWxlU3R5bGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0R3JhcGhzKCk6IE9iamVjdCB7XHJcbiAgICAgIGxldCBncmFwaHM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSDGki5Qcm9qZWN0LmdldFJlc291cmNlc0J5VHlwZSjGki5HcmFwaCk7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBncmFwaCBvZiBncmFwaHMpIHtcclxuICAgICAgICByZXN1bHRbZ3JhcGgubmFtZV0gPSBncmFwaC5pZFJlc291cmNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9qZWN0SFRNTChfdGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBodG1sOiBEb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChfdGl0bGUpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcIm1ldGFcIiwgeyBjaGFyc2V0OiBcInV0Zi04XCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibGlua1wiLCB7IHJlbDogXCJzdHlsZXNoZWV0XCIsIGhyZWY6IHRoaXMuZmlsZVN0eWxlcyB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJFZGl0b3Igc2V0dGluZ3Mgb2YgdGhpcyBwcm9qZWN0XCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcIm1ldGFcIiwge1xyXG4gICAgICAgIHR5cGU6IFwic2V0dGluZ3NcIiwgYXV0b3ZpZXc6IHRoaXMuZ3JhcGhBdXRvVmlldywgcHJvamVjdDogdGhpcy5zZXR0aW5nc1N0cmluZ2lmeSgpXHJcbiAgICAgIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkFjdGl2YXRlIHRoZSBmb2xsb3dpbmcgbGluZSB0byBpbmNsdWRlIHRoZSBGVURHRS12ZXJzaW9uIG9mIE9pbW8tUGh5c2ljcy4gWW91IG1heSB3YW50IHRvIGRvd25sb2FkIGEgbG9jYWwgY29weSB0byB3b3JrIG9mZmxpbmUgYW5kIGJlIGluZGVwZW5kZW50IGZyb20gZnV0dXJlIGNoYW5nZXMhXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vT2ltb1BoeXNpY3MuanNcIj48L3NjcmlwdD5gKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIEZVREdFLiBZb3UgbWF5IHdhbnQgdG8gZG93bmxvYWQgbG9jYWwgY29waWVzIHRvIHdvcmsgb2ZmbGluZSBhbmQgYmUgaW5kZXBlbmRlbnQgZnJvbSBmdXR1cmUgY2hhbmdlcyEgRGV2ZWxvcGVycyB3b3JraW5nIG9uIEZVREdFIGl0c2VsZiBtYXkgd2FudCB0byBjcmVhdGUgc3ltbGlua3NcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogXCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9GdWRnZUFpZC5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxpbmsgaW50ZXJuYWwgcmVzb3VyY2VzLiBUaGUgZWRpdG9yIG9ubHkgbG9hZHMgdGhlIGZpcnN0LCBidXQgYXQgcnVudGltZSwgbXVsdGlwbGUgZmlsZXMgY2FuIGNvbnRyaWJ1dGVcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibGlua1wiLCB7IHR5cGU6IFwicmVzb3VyY2VzXCIsIHNyYzogdGhpcy5maWxlSW50ZXJuYWwgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBjdXN0b20gc2NyaXB0c1wiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IHRoaXMuZmlsZVNjcmlwdCwgZWRpdG9yOiBcInRydWVcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIC8vIGlmICh0aGlzLmluY2x1ZGVBdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5nZXRBdXRvVmlld1NjcmlwdCgpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgQXV0b3ZpZXcgc2NyaXB0XCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogXCJBdXRvdmlldy5qc1wiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkRpYWxvZyBzaG93biBhdCBzdGFydHVwIG9ubHlcIikpO1xyXG4gICAgICBsZXQgZGlhbG9nOiBIVE1MRWxlbWVudCA9IGNyZWF0ZVRhZyhcImRpYWxvZ1wiKTtcclxuICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInBcIiwge30sIFwiRlVER0UgQXV0b3ZpZXdcIikpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwiaDFcIiwge30sIFwiVGl0bGUgKHdpbGwgYmUgcmVwbGFjZWQgYnkgQXV0b3ZpZXcpXCIpKTtcclxuICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInBcIiwge30sIFwiY2xpY2sgdG8gc3RhcnRcIikpO1xyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcclxuXHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDYW52YXMgZm9yIEZVREdFIHRvIHJlbmRlciB0b1wiKSk7XHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJjYW52YXNcIiwgeyBjbGFzczogXCJmdWxsc2NyZWVuXCIgfSkpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlVGFnKF90YWc6IHN0cmluZywgX2F0dHJpYnV0ZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fSwgX2NvbnRlbnQ/OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChfdGFnKTtcclxuICAgICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gX2F0dHJpYnV0ZXMpXHJcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIF9hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pO1xyXG4gICAgICAgIGlmIChfY29udGVudClcclxuICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gX2NvbnRlbnQ7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeUhUTUwoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBnZXRBdXRvVmlld1NjcmlwdCgpOiBIVE1MU2NyaXB0RWxlbWVudCB7XHJcbiAgICAvLyAgIGxldCBjb2RlOiBzdHJpbmc7XHJcbiAgICAvLyAgIGNvZGUgPSAoZnVuY3Rpb24gKF9ncmFwaElkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vICAgICAvKipcclxuICAgIC8vICAgICAgKiBBdXRvVmlldy1TY3JpcHRcclxuICAgIC8vICAgICAgKiBMb2FkcyBhbmQgZGlzcGxheXMgdGhlIHNlbGVjdGVkIGdyYXBoIGFuZCBpbXBsZW1lbnRzIGEgYmFzaWMgb3JiaXQgY2FtZXJhXHJcbiAgICAvLyAgICAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMVxyXG4gICAgLy8gICAgICAqL1xyXG5cclxuICAgIC8vICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgaW5pdCk7XHJcblxyXG4gICAgLy8gICAgIC8vIHNob3cgZGlhbG9nIGZvciBzdGFydHVwXHJcbiAgICAvLyAgICAgbGV0IGRpYWxvZzogSFRNTERpYWxvZ0VsZW1lbnQ7XHJcbiAgICAvLyAgICAgZnVuY3Rpb24gaW5pdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgICAgICBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGlhbG9nXCIpO1xyXG4gICAgLy8gICAgICAgZGlhbG9nLnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKS50ZXh0Q29udGVudCA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgLy8gICAgICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAgICAgICAvLyBAdHMtaWduIHJlIHVudGlsIEhUTUxEaWFsb2cgaXMgaW1wbGVtZW50ZWQgYnkgYWxsIGJyb3dzZXJzIGFuZCBhdmFpbGFibGUgaW4gZG9tLmQudHNcclxuICAgIC8vICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAvLyAgICAgICAgIHN0YXJ0SW50ZXJhY3RpdmVWaWV3cG9ydCgpO1xyXG4gICAgLy8gICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgIC8vICAgICAgIGRpYWxvZy5zaG93TW9kYWwoKTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIC8vIHNldHVwIGFuZCBzdGFydCBpbnRlcmFjdGl2ZSB2aWV3cG9ydFxyXG4gICAgLy8gICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0SW50ZXJhY3RpdmVWaWV3cG9ydCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vICAgICAgIC8vIGxvYWQgcmVzb3VyY2VzIHJlZmVyZW5jZWQgaW4gdGhlIGxpbmstdGFnXHJcbiAgICAvLyAgICAgICBhd2FpdCBGdWRnZUNvcmUuUHJvamVjdC5sb2FkUmVzb3VyY2VzRnJvbUhUTUwoKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJQcm9qZWN0OlwiLCBGdWRnZUNvcmUuUHJvamVjdC5yZXNvdXJjZXMpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIHBpY2sgdGhlIGdyYXBoIHRvIHNob3dcclxuICAgIC8vICAgICAgIGxldCBncmFwaDogxpIuR3JhcGggPSA8xpIuR3JhcGg+RnVkZ2VDb3JlLlByb2plY3QucmVzb3VyY2VzW19ncmFwaElkXTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJHcmFwaDpcIiwgZ3JhcGgpO1xyXG4gICAgLy8gICAgICAgaWYgKCFncmFwaCkge1xyXG4gICAgLy8gICAgICAgICBhbGVydChcIk5vdGhpbmcgdG8gcmVuZGVyLiBDcmVhdGUgYSBncmFwaCB3aXRoIGF0IGxlYXN0IGEgbWVzaCwgbWF0ZXJpYWwgYW5kIHByb2JhYmx5IHNvbWUgbGlnaHRcIik7XHJcbiAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgIC8vICAgICAgIH1cclxuXHJcbiAgICAvLyAgICAgICAvLyBzZXR1cCB0aGUgdmlld3BvcnRcclxuICAgIC8vICAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyBGdWRnZUNvcmUuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAvLyAgICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIik7XHJcbiAgICAvLyAgICAgICBsZXQgdmlld3BvcnQ6IMaSLlZpZXdwb3J0ID0gbmV3IEZ1ZGdlQ29yZS5WaWV3cG9ydCgpO1xyXG4gICAgLy8gICAgICAgdmlld3BvcnQuaW5pdGlhbGl6ZShcIkludGVyYWN0aXZlVmlld3BvcnRcIiwgZ3JhcGgsIGNtcENhbWVyYSwgY2FudmFzKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5EZWJ1Zy5sb2coXCJWaWV3cG9ydDpcIiwgdmlld3BvcnQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIGhpZGUgdGhlIGN1cnNvciB3aGVuIGludGVyYWN0aW5nLCBhbHNvIHN1cHByZXNzaW5nIHJpZ2h0LWNsaWNrIG1lbnVcclxuICAgIC8vICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNhbnZhcy5yZXF1ZXN0UG9pbnRlckxvY2spO1xyXG4gICAgLy8gICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uICgpOiB2b2lkIHsgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7IH0pO1xyXG5cclxuICAgIC8vICAgICAgIC8vIG1ha2UgdGhlIGNhbWVyYSBpbnRlcmFjdGl2ZSAoY29tcGxleCBtZXRob2QgaW4gRnVkZ2VBaWQpXHJcbiAgICAvLyAgICAgICBsZXQgY2FtZXJhT3JiaXQ6IEZ1ZGdlQWlkLkNhbWVyYU9yYml0ID0gRnVkZ2VBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHZpZXdwb3J0KTtcclxuXHJcbiAgICAvLyAgICAgICAvLyBzZXR1cCBhdWRpb1xyXG4gICAgLy8gICAgICAgbGV0IGNtcExpc3RlbmVyOiDGki5Db21wb25lbnRBdWRpb0xpc3RlbmVyID0gbmV3IMaSLkNvbXBvbmVudEF1ZGlvTGlzdGVuZXIoKTtcclxuICAgIC8vICAgICAgIGNtcENhbWVyYS5ub2RlLmFkZENvbXBvbmVudChjbXBMaXN0ZW5lcik7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQubGlzdGVuV2l0aChjbXBMaXN0ZW5lcik7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQubGlzdGVuVG8oZ3JhcGgpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIkF1ZGlvOlwiLCBGdWRnZUNvcmUuQXVkaW9NYW5hZ2VyLmRlZmF1bHQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIGRyYXcgdmlld3BvcnQgb25jZSBmb3IgaW1tZWRpYXRlIGZlZWRiYWNrXHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuUmVuZGVyLnByZXBhcmUoY2FtZXJhT3JiaXQpO1xyXG4gICAgLy8gICAgICAgdmlld3BvcnQuZHJhdygpO1xyXG4gICAgLy8gICAgICAgY2FudmFzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiaW50ZXJhY3RpdmVWaWV3cG9ydFN0YXJ0ZWRcIiwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHZpZXdwb3J0IH0pKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgIH0pLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgLy8gICBjb2RlID0gXCIoXCIgKyBjb2RlICsgYCkoZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVthdXRvVmlld11cIikuZ2V0QXR0cmlidXRlKFwiYXV0b1ZpZXdcIikpO1xcbmA7XHJcbiAgICAvLyAgIGxldCBzY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgIC8vICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJhdXRvVmlld1wiKTtcclxuICAgIC8vICAgc2NyaXB0LnRleHRDb250ZW50ID0gY29kZTtcclxuICAgIC8vICAgcmV0dXJuIHNjcmlwdDtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHRpbmdzU3RyaW5naWZ5KCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gcHJvamVjdC5nZXRNdXRhdG9yKHRydWUpO1xyXG4gICAgICBsZXQgc2V0dGluZ3M6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG11dGF0b3IpO1xyXG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLnJlcGxhY2UoL1wiL2csIFwiJ1wiKTtcclxuICAgICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RyaW5naWZ5SFRNTChfaHRtbDogRG9jdW1lbnQpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgcmVzdWx0OiBzdHJpbmcgPSAobmV3IFhNTFNlcmlhbGl6ZXIoKSkuc2VyaWFsaXplVG9TdHJpbmcoX2h0bWwpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvPjwvZywgXCI+XFxuPFwiKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLzwhLS1DUkxGLS0+L2csIFwiXCIpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXCI+XFxuPFxcL3NjcmlwdC9nLCBgXCI+PC9zY3JpcHRgKTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1xcbio8XFwvYm9keT4vZywgXCJcXG48XFwvYm9keT5cIik7IC8vIHJlbW92ZSBsaW5lIGJyZWFrcyBhZGRlZCBieSBzZXJpYWxpemVUb1N0cmluZyBiZWZvcmUgY2xvc2luZyBib2R5LXRhZ1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgbG9hZEZvbnRzKF9oZWFkOiBIVE1MSGVhZEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgLy8gY29sbGVjdCBhbGwgZm9udHMgZnJvbSBfaGVhZCBhbmQgYWRkIHRoZW0gdG8gdGhlIGhlYWQgb2YgdGhlIGVkaXRvcnMgZG9jdW1lbnQgc28gdGhhdCB0aGV5IGFyZSBhdmFpbGFibGUgZm9yIGNvbXBvbmVudCB0ZXh0XHJcbiAgICAgIGNvbnN0IGZvbnRzOiBIVE1MU3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgY29uc3QgY3NzTGlua3M6IE5vZGVMaXN0T2Y8SFRNTExpbmtFbGVtZW50PiA9IF9oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpO1xyXG4gICAgICBjb25zdCBjc3NTdHlsZXM6IE5vZGVMaXN0T2Y8SFRNTFN0eWxlRWxlbWVudD4gPSBfaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpO1xyXG4gICAgICBjb25zdCBjc3NSdWxlczogQ1NTUnVsZVtdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBsaW5rIG9mIGNzc0xpbmtzKSB7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gbmV3IFVSTChsaW5rLmdldEF0dHJpYnV0ZShcImhyZWZcIiksIHRoaXMuYmFzZSkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgY3NzVGV4dDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKHVybCkpLnRleHQoKTsgLy8gVE9ETzogdXNlIEZpbGVJT1xyXG4gICAgICAgIGNzc1J1bGVzLnB1c2goLi4uZ2V0UnVsZXMoY3NzVGV4dCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBzdHlsZSBvZiBjc3NTdHlsZXMpXHJcbiAgICAgICAgY3NzUnVsZXMucHVzaCguLi5nZXRSdWxlcyhzdHlsZS5pbm5lckhUTUwpKTtcclxuXHJcbiAgICAgIGZvciAobGV0IHJ1bGUgb2YgY3NzUnVsZXMpXHJcbiAgICAgICAgaWYgKHJ1bGUgaW5zdGFuY2VvZiBDU1NGb250RmFjZVJ1bGUpXHJcbiAgICAgICAgICBmb250cy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlLmNzc1RleHQpKTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZm9udHMpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0UnVsZXMoX3RleHQ6IHN0cmluZyk6IENTU1J1bGVMaXN0IHtcclxuICAgICAgICBsZXQgc3R5bGVTaGVldDogQ1NTU3R5bGVTaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XHJcbiAgICAgICAgc3R5bGVTaGVldC5yZXBsYWNlU3luYyhfdGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlU2hlZXQuY3NzUnVsZXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlckFuaW1hdGlvbiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9DT0xPUlM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcIlJlZFwiLFxyXG4gICAgICBcIkxpbWVcIixcclxuICAgICAgXCJCbHVlXCIsXHJcbiAgICAgIFwiQ3lhblwiLFxyXG4gICAgICBcIk1hZ2VudGFcIixcclxuICAgICAgXCJZZWxsb3dcIixcclxuICAgICAgXCJTYWxtb25cIixcclxuICAgICAgXCJMaWdodEdyZWVuXCIsXHJcbiAgICAgIFwiQ29ybmZsb3dlckJsdWVcIlxyXG4gICAgXTtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiDGki5BbmltYXRpb247XHJcbiAgICBwcml2YXRlIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHZpZXc6IFZpZXdBbmltYXRpb247XHJcbiAgICBwcml2YXRlIHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW107XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hbmltYXRpb246IMaSLkFuaW1hdGlvbiwgX2RvbTogSFRNTEVsZW1lbnQsIF92aWV3OiBWaWV3QW5pbWF0aW9uKSB7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgdGhpcy5kb20gPSBfZG9tO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnZpZXcgPSBfdmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgY29sb3JJbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgbGV0IGtleVNlbGVjdGVkOiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnZpZXcua2V5U2VsZWN0ZWQ7XHJcblxyXG4gICAgICB1cGRhdGVSZWN1cnNpdmUodGhpcy5kb20sIF9tdXRhdG9yLCB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUsIF90aW1lKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVJlY3Vyc2l2ZShfZG9tOiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IsIF9hbmltYXRpb25TdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblN0cnVjdHVyZSwgX3RpbWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudDogxpJ1aS5DdXN0b21FbGVtZW50ID0gPMaSdWkuQ3VzdG9tRWxlbWVudD7GknVpLkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb20sIGtleSk7XHJcbiAgICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCB2YWx1ZTogxpIuR2VuZXJhbCA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgICAgICBsZXQgc3RydWN0dXJlT3JTZXF1ZW5jZTogT2JqZWN0ID0gX2FuaW1hdGlvblN0cnVjdHVyZVtrZXldO1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50ICYmIHN0cnVjdHVyZU9yU2VxdWVuY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgbGV0IGtleTogxpIuQW5pbWF0aW9uS2V5ID0gc3RydWN0dXJlT3JTZXF1ZW5jZS5maW5kS2V5KF90aW1lKTtcclxuICAgICAgICAgICAgaWYgKGtleSkgey8vIGtleSBmb3VuZCBhdCBleGFjdGx5IHRoZSBnaXZlbiB0aW1lLCB0YWtlIGl0cyB2YWx1ZVxyXG4gICAgICAgICAgICAgIHZhbHVlID0ga2V5LnZhbHVlO1xyXG4gICAgICAgICAgICAgIGlmIChrZXkgPT0ga2V5U2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwiLS1jb2xvci1hbmltYXRpb24tcHJvcGVydHlcIiwgZ2V0TmV4dENvbG9yKCkpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwiYW5pbWF0aW9uU2VxdWVuY2VcIiwgc3RydWN0dXJlT3JTZXF1ZW5jZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1cGRhdGVSZWN1cnNpdmUoZWxlbWVudCwgdmFsdWUsIDzGki5BbmltYXRpb25TdHJ1Y3R1cmU+c3RydWN0dXJlT3JTZXF1ZW5jZSwgX3RpbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0TmV4dENvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbG9yOiBzdHJpbmcgPSBDb250cm9sbGVyQW5pbWF0aW9uLlBST1BFUlRZX0NPTE9SU1tjb2xvckluZGV4XTtcclxuICAgICAgICBjb2xvckluZGV4ID0gKGNvbG9ySW5kZXggKyAxKSAlIENvbnRyb2xsZXJBbmltYXRpb24uUFJPUEVSVFlfQ09MT1JTLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBtb2RpZnkgb3IgYWRkIGtleVxyXG4gICAgcHVibGljIHVwZGF0ZVNlcXVlbmNlKF90aW1lOiBudW1iZXIsIF9lbGVtZW50OiDGknVpLkN1c3RvbUVsZW1lbnQsIF9hZGQ6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gUmVmbGVjdC5nZXQoX2VsZW1lbnQsIFwiYW5pbWF0aW9uU2VxdWVuY2VcIik7XHJcbiAgICAgIGlmICghc2VxdWVuY2UpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHNlcXVlbmNlLmZpbmRLZXkoX3RpbWUpO1xyXG4gICAgICBpZiAoIWtleSkge1xyXG4gICAgICAgIGlmIChfYWRkKSB7XHJcbiAgICAgICAgICBrZXkgPSBuZXcgxpIuQW5pbWF0aW9uS2V5KF90aW1lLCA8bnVtYmVyPl9lbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgICAgIHNlcXVlbmNlLmFkZEtleShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlXHJcbiAgICAgICAgc2VxdWVuY2UubW9kaWZ5S2V5KGtleSwgbnVsbCwgPG51bWJlcj5fZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIHRoaXMudmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiBrZXkgfSB9KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5leHRLZXkoX3RpbWU6IG51bWJlciwgX2RpcmVjdGlvbjogXCJmb3J3YXJkXCIgfCBcImJhY2t3YXJkXCIpOiBudW1iZXIge1xyXG4gICAgICBsZXQgbmV4dEtleTogxpIuQW5pbWF0aW9uS2V5ID0gdGhpcy5zZXF1ZW5jZXNcclxuICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgIC5zb3J0KF9kaXJlY3Rpb24gPT0gXCJmb3J3YXJkXCIgJiYgKChfYSwgX2IpID0+IF9hLnRpbWUgLSBfYi50aW1lKSB8fCBfZGlyZWN0aW9uID09IFwiYmFja3dhcmRcIiAmJiAoKF9hLCBfYikgPT4gX2IudGltZSAtIF9hLnRpbWUpKVxyXG4gICAgICAgIC5maW5kKF9rZXkgPT4gX2RpcmVjdGlvbiA9PSBcImZvcndhcmRcIiAmJiBfa2V5LnRpbWUgPiBfdGltZSB8fCBfZGlyZWN0aW9uID09IFwiYmFja3dhcmRcIiAmJiBfa2V5LnRpbWUgPCBfdGltZSk7XHJcbiAgICAgIGlmIChuZXh0S2V5KVxyXG4gICAgICAgIHJldHVybiBuZXh0S2V5LnRpbWU7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gX3RpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFByb3BlcnR5KF9wYXRoOiBzdHJpbmdbXSwgX25vZGU6IMaSLk5vZGUsIF90aW1lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgfCDGki5BbmltYXRpb25TdHJ1Y3R1cmUgPSB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmU7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBfcGF0aC5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBfcGF0aFtpXTtcclxuICAgICAgICBpZiAoIShrZXkgaW4gc3RydWN0dXJlKSlcclxuICAgICAgICAgIHN0cnVjdHVyZVtrZXldID0ge307XHJcbiAgICAgICAgc3RydWN0dXJlID0gc3RydWN0dXJlW2tleV07XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IG5ldyDGki5BbmltYXRpb25TZXF1ZW5jZSgpO1xyXG4gICAgICBzZXF1ZW5jZS5hZGRLZXkobmV3IMaSLkFuaW1hdGlvbktleShfdGltZSwgMCkpO1xyXG4gICAgICBzdHJ1Y3R1cmVbX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV1dID0gc2VxdWVuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVByb3BlcnR5KF9lbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMuZG9tLmNvbnRhaW5zKF9lbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IF9lbGVtZW50O1xyXG4gICAgICB3aGlsZSAoZWxlbWVudCAhPT0gdGhpcy5kb20pIHtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCB8fCBlbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgcGF0aC51bnNoaWZ0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRlbGV0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFNlcXVlbmNlcyhfc2VsZWN0ZWRQcm9wZXJ0eT86IEhUTUxFbGVtZW50KTogVmlld0FuaW1hdGlvblNlcXVlbmNlW10ge1xyXG4gICAgICBsZXQgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSA9IFtdO1xyXG4gICAgICBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUodGhpcy5kb20sIHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSwgc2VxdWVuY2VzLCBfc2VsZWN0ZWRQcm9wZXJ0eSA9PSBudWxsKTtcclxuICAgICAgcmV0dXJuIHNlcXVlbmNlcztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZShfZG9tOiBIVE1MRWxlbWVudCwgX2FuaW1hdGlvblN0cnVjdHVyZTogxpIuQW5pbWF0aW9uU3RydWN0dXJlLCBfc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSwgX2lzU2VsZWN0ZWREZXNjZW5kYW50OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX2FuaW1hdGlvblN0cnVjdHVyZSkge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gxpJ1aS5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tLCBrZXkpO1xyXG4gICAgICAgICAgbGV0IGlzU2VsZWN0ZWREZXNjZW5kYW50OiBib29sZWFuID0gX2lzU2VsZWN0ZWREZXNjZW5kYW50IHx8IGVsZW1lbnQgPT0gX3NlbGVjdGVkUHJvcGVydHk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgc2VxdWVuY2U6IE9iamVjdCA9IF9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XTtcclxuICAgICAgICAgIGlmIChzZXF1ZW5jZSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlICYmIGlzU2VsZWN0ZWREZXNjZW5kYW50KSB7XHJcbiAgICAgICAgICAgIF9zZXF1ZW5jZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgY29sb3I6IGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYW5pbWF0aW9uLXByb3BlcnR5XCIpLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHNlcXVlbmNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKGVsZW1lbnQsIDzGki5BbmltYXRpb25TdHJ1Y3R1cmU+X2FuaW1hdGlvblN0cnVjdHVyZVtrZXldLCBfc2VxdWVuY2VzLCBpc1NlbGVjdGVkRGVzY2VuZGFudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVQYXRoKF9wYXRoOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IF9wYXRoLmxlbmd0aCAtIDE7IGkrKylcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlW19wYXRoW2ldXTtcclxuICAgICAgZGVsZXRlIHZhbHVlW19wYXRoW19wYXRoLmxlbmd0aCAtIDFdXTtcclxuXHJcbiAgICAgIGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUodGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUoX29iamVjdDogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfb2JqZWN0KSB7XHJcbiAgICAgICAgICBpZiAoX29iamVjdFtrZXldIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gZGVsZXRlRW1wdHlQYXRoc1JlY3Vyc2l2ZShfb2JqZWN0W2tleV0pO1xyXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBkZWxldGUgX29iamVjdFtrZXldO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX29iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX29iamVjdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkNMSUNLOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIGlmICghKF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgfHwgIXRoaXMuYW5pbWF0aW9uIHx8IF9ldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSBfZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgfHwgdGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5EZXRhaWxzKVxyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRTZXF1ZW5jZXModGFyZ2V0KTtcclxuICAgICAgICAgIGVsc2UgaWYgKHRhcmdldCA9PSB0aGlzLmRvbSlcclxuICAgICAgICAgICAgdGhpcy5zZXF1ZW5jZXMgPSB0aGlzLmdldFNlbGVjdGVkU2VxdWVuY2VzKCk7XHJcblxyXG4gICAgICAgICAgdGhpcy52aWV3LmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuc2VxdWVuY2VzIH0gfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHZpZXcncyBzdGF0ZS4gRHVyaW5nIHJlY29uc3RydWN0aW9uLCB2aWV3cyByZWNlaXZlIGEgbWVyZ2VkIHN0YXRlIG9iamVjdCB0aGF0IGNvbWJpbmVzIHRoZSBzdGF0ZXMgb2YgYm90aCB0aGVpciBwYW5lbCBhbmQgdGhlIHZpZXcgaXRzZWxmLlxyXG4gICAqIEVuc3VyZSB1bmlxdWUgcHJvcGVydHkgbmFtZXMgdG8gYXZvaWQgY29uZmxpY3RzLlxyXG4gICAqL1xyXG4gIGV4cG9ydCB0eXBlIFZpZXdTdGF0ZSA9IMaSLlNlcmlhbGl6YXRpb247XHJcblxyXG4gIHR5cGUgVmlld3MgPSB7IFtpZDogc3RyaW5nXTogVmlldyB9O1xyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBbW1ZpZXddXXMgdG8gc3VwcG9ydCBnZW5lcmljIGZ1bmN0aW9uYWxpdHlcclxuICAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlldyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB2aWV3czogVmlld3MgPSB7fTtcclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnU6IEVsZWN0cm9uLk1lbnU7XHJcbiAgICAjY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXI7XHJcbiAgICAjaWQ6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICB0aGlzLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICAvLyB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiO1xyXG4gICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJ2aWV3XCIsIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XHJcblxyXG4gICAgICAvL19jb250YWluZXIuZ2V0RWxlbWVudCgpLmFwcGVuZCh0aGlzLmRvbSk7IC8vb2xkXHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lciA9IF9jb250YWluZXI7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLnN0YXRlUmVxdWVzdEV2ZW50ID0gdGhpcy5nZXRTdGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIub24oXCJkZXN0cm95XCIsICgpID0+IHtcclxuICAgICAgICBkZWxldGUgVmlldy52aWV3c1t0aGlzLiNpZF07XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ0xPU0UsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2spO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51ID0gdGhpcy5nZXRDb250ZXh0TWVudSh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFVF9QUk9KRUNULCB0aGlzLmhuZEV2ZW50Q29tbW9uKTtcclxuXHJcbiAgICAgIHRoaXMuI2lkID0gVmlldy5yZWdpc3RlclZpZXdGb3JEcmFnRHJvcCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFZpZXdTb3VyY2UoX2V2ZW50OiBEcmFnRXZlbnQpOiBWaWV3IHtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIpXHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKVxyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZS5zdGFydHNXaXRoKFwic291cmNldmlld1wiKSlcclxuICAgICAgICAgICAgcmV0dXJuIFZpZXcudmlld3NbaXRlbS50eXBlLnNwbGl0KFwiOlwiKS5wb3AoKV07XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyVmlld0ZvckRyYWdEcm9wKF90aGlzOiBWaWV3KTogbnVtYmVyIHtcclxuICAgICAgVmlldy52aWV3c1tWaWV3LmlkQ291bnRdID0gX3RoaXM7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyYWcgc3RhcnRzLCBhZGQgaWRlbnRpZmllciB0byB0aGUgZXZlbnQgaW4gYSB3YXkgdGhhdCBhbGxvd3MgZHJhZ292ZXIgdG8gcHJvY2VzcyB0aGUgc291cmVcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX1NUQVJULCAoX2V2ZW50OiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiU291cmNlVmlldzpcIiArIF90aGlzLiNpZC50b1N0cmluZygpLCBcInR5cGVzSGFja1wiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyYWdnaW5nIG92ZXIgYSB2aWV3LCBnZXQgdGhlIG9yaWdpbmFsIHNvdXJjZSB2aWV3IGZvciBkcmFnZ2luZyBhbmQgY2FsbCBobmREcmFnT3ZlclxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfT1ZFUiwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcbiAgICAgICAgX3RoaXMuaG5kRHJhZ092ZXIoX2V2ZW50LCB2aWV3U291cmNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBkcmFnIG92ZXIgZHVyaW5nIGNhcHR1cmUgcGhhc2UsIGFsbG93cyB2aWV3cyB0byBwcmV2ZW50IGV2ZW50IHJlYWNoaW5nIHRoZSBhY3R1YWwgdGFyZ2V0XHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19PVkVSLCBfZXZlbnQgPT4gX3RoaXMuaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpLCB0cnVlKTtcclxuXHJcbiAgICAgIC8vIHdoZW4gZHJvcHBpbmcgaW50byBhIHZpZXcsIGdldCB0aGUgb3JpZ2luYWwgc291cmNlIHZpZXcgZm9yIGRyYWdnaW5nIGFuZCBjYWxsIGhuZERyb3BcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgxpJ1aS5FVkVOVC5EUk9QLFxyXG4gICAgICAgIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuICAgICAgICAgIF90aGlzLmhuZERyb3AoX2V2ZW50LCB2aWV3U291cmNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhbHNlKTtcclxuXHJcbiAgICAgIC8vIGRyb3AgZHVyaW5nIGNhcHR1cmUgcGhhc2UsIGFsbG93cyB2aWV3cyBtYW5pcHVsYXRlIHRoZSBkcm9wIGRhdGEgYmVmb3JlIHRoZSBhY3R1YWwgdGFyZ2V0IGlzIHJlYWNoZWRcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUk9QLCBfZXZlbnQgPT4gX3RoaXMuaG5kRHJvcENhcHR1cmUoX2V2ZW50LCBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSksIHRydWUpO1xyXG5cclxuICAgICAgcmV0dXJuIFZpZXcuaWRDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgaWQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIGAke3RoaXMuI2lkfV8ke3RoaXMuY29uc3RydWN0b3IubmFtZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUaXRsZShfdGl0bGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuc2V0VGl0bGUoX3RpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IE9iamVjdFtdIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwYXRjaChfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfaW5pdC5kZXRhaWwgPSBfaW5pdC5kZXRhaWwgfHwge307XHJcbiAgICAgIF9pbml0LmRldGFpbC52aWV3ID0gX2luaXQuZGV0YWlsLnZpZXcgfHwgdGhpcztcclxuICAgICAgdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgRWRpdG9yRXZlbnQoX3R5cGUsIF9pbml0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BhdGNoVG9QYXJlbnQoX3R5cGU6IEVWRU5UX0VESVRPUiwgX2luaXQ6IEN1c3RvbUV2ZW50SW5pdDxFdmVudERldGFpbD4pOiB2b2lkIHtcclxuICAgICAgX2luaXQuZGV0YWlsID0gX2luaXQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBfaW5pdC5idWJibGVzID0gdHJ1ZTtcclxuICAgICAgX2luaXQuZGV0YWlsLnZpZXcgPSBfaW5pdC5kZXRhaWwudmlldyB8fCB0aGlzO1xyXG4gICAgICB0aGlzLmRvbS5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBDb250ZXh0TWVudTogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBFdmVudHNcclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3BDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX3NvdXJjZSwgX2V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnRDb21tb24gPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgIC8vICAgY2FzZSBFVkVOVF9FRElUT1IuU0VUX1BST0pFQ1Q6XHJcbiAgICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51ID0gdGhpcy5nZXRDb250ZXh0TWVudSh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCB0aGUgZXh0ZXJuYWwgcmVzb3VyY2VzXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdFeHRlcm5hbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLkN1c3RvbVRyZWU8RGlyZWN0b3J5RW50cnk+O1xyXG5cclxuICAgICNleHBhbmRlZDogc3RyaW5nW107IC8vIGNhY2hlIHN0YXRlIGZyb20gY29uc3RydWN0b3JcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQcm9qZWN0KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nID0gbmV3IFVSTChcIi5cIiwgxpIuUHJvamVjdC5iYXNlVVJMKS5wYXRobmFtZTtcclxuICAgICAgaWYgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PSBcIldpbjMyXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09IFwiV2luNjRcIikge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTsgLy8gc3RyaXAgbGVhZGluZyBzbGFzaFxyXG4gICAgICB9XHJcbiAgICAgIGxldCByb290OiBEaXJlY3RvcnlFbnRyeSA9IERpcmVjdG9yeUVudHJ5LmNyZWF0ZVJvb3QocGF0aCk7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLkN1c3RvbVRyZWU8RGlyZWN0b3J5RW50cnk+KG5ldyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSgpLCByb290KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy50cmVlLmdldEl0ZW1zKClbMF0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBgRHJhZyAmIGRyb3AgZXh0ZXJuYWwgaW1hZ2UsIGF1ZGlvZmlsZSBldGMuIHRvIHRoZSBcIkludGVybmFsXCIsIHRvIGNyZWF0ZSBhIEZVREdFLXJlc291cmNlYDtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZCh0aGlzLiNleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEpICAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoaXMgaXMgZXZlciB0aGUgY2FzZT9cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIC8vIG5vdGhpbmcgYWN0dWFsbHkgc2VsZWN0ZWQuLi5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk9QRU46XHJcbiAgICAgICAgICB0aGlzLnNldFByb2plY3QoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKGl0ZW0uZGF0YS5wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBleHBhbmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiBEaXJlY3RvcnlFbnRyeVtdW10gPSBfcGF0aHMubWFwKF9wYXRoID0+IG5ldyBEaXJlY3RvcnlFbnRyeShcIlwiLCBfcGF0aCwgbnVsbCwgbnVsbCkuZ2V0UGF0aCgpKTtcclxuICAgICAgdGhpcy50cmVlLmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3SW50ZXJuYWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgZ2x0ZkltcG9ydFNldHRpbmdzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHsgLy8gVE9ETzogc2F2ZSB0aGVzZSBzZXR0aW5ncz9cclxuICAgICAgW8aSLkdyYXBoLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuQW5pbWF0aW9uLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuTWF0ZXJpYWwubmFtZV06IGZhbHNlLFxyXG4gICAgICBbxpIuTWVzaC5uYW1lXTogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgLy8gVE9ETzogZWl0aGVyIHJlbW92ZSBWaWV3SW50ZXJuYWxUYWJsZSBvciB1bmlmeSBjb21tb24gZnVuY3Rpb25hbGl0eSB3aXRoIFZpZXdJbnRlcm5hbEZvbGRlciBpbnRvIFZpZXdJbnRlcm5hbC4uLlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheXMgdGhlIGludGVybmFsIHJlc291cmNlcyBhcyBhIGZvbGRlciB0cmVlLlxyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwIHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDI0IFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxGb2xkZXIgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLkN1c3RvbVRyZWU8UmVzb3VyY2VFbnRyeT47XHJcblxyXG4gICAgI2V4cGFuZGVkOiBzdHJpbmdbXTsgLy8gY2FjaGUgc3RhdGUgZnJvbSBjb25zdHJ1Y3RvclxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZE9wZW4pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZENyZWF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29udHJvbGxlcigpOiBDb250cm9sbGVyVHJlZVJlc291cmNlIHtcclxuICAgICAgcmV0dXJuIDxDb250cm9sbGVyVHJlZVJlc291cmNlPnRoaXMudHJlZS5jb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VGb2xkZXIoKTogUmVzb3VyY2VGb2xkZXIge1xyXG4gICAgICByZXR1cm4gcHJvamVjdC5yZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5maWx0ZXIoX2VsZW1lbnQgPT4gIShfZWxlbWVudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIDzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPnRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLmZpbHRlcihfc291cmNlID0+ICEoX3NvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBGb2xkZXJcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9NRVNIKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogYENyZWF0ZSAke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRlbGV0ZVwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IFJlc291cmNlRW50cnkgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuXHJcbiAgICAgIGlmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSB7XHJcbiAgICAgICAgaWYgKCgoYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKSkubGVuZ3RoID4gMCkpXHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKGZvY3VzIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCByZXNvdXJjZTogUmVzb3VyY2VFbnRyeTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2VGb2xkZXIoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSDpcclxuICAgICAgICAgIHJlc291cmNlID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1Q6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbcmVzb3VyY2VdLCBmb2N1cyk7XHJcbiAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKHJlc291cmNlKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoaXRlbSAhPSB0aGlzLmRvbSAmJiAhKGl0ZW0gaW5zdGFuY2VvZiDGknVpLkN1c3RvbVRyZWVJdGVtKSlcclxuICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgaWYgKGl0ZW0gPT0gdGhpcy5kb20pIHtcclxuICAgICAgICBpdGVtID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICAgIGl0ZW0uZm9jdXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tVHJlZUl0ZW0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuaXRlbXMuZm9yRWFjaChfaXRlbSA9PiBfaXRlbS52aXNpYmxlID0gdHJ1ZSk7XHJcblxyXG4gICAgICBpZiAoIShpdGVtLmRhdGEgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVPcHRpb25zOiBDT05URVhUTUVOVVtdID0gW0NPTlRFWFRNRU5VLkNSRUFURV9GT0xERVIsIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCwgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCwgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVF07XHJcbiAgICAgICAgY3JlYXRlT3B0aW9ucy5mb3JFYWNoKF9pZCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoX2lkKSkudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS5kYXRhID09IHRoaXMucmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSkpLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcyB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgIGZvciAoY29uc3Qgc291cmNlIG9mIF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpKSB7XHJcbiAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLk5vZGUpIHtcclxuICAgICAgICAgIHJlc291cmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKHNvdXJjZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuQVVESU86XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBNSU1FLklNQUdFOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuTUVTSDpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2goYXdhaXQgbmV3IMaSLk1lc2hPQkooKS5sb2FkKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuR0xURjpcclxuICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hpY2ggcmVzb3VyY2VzIHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSlcclxuICAgICAgICAgICAgICByZXNvdXJjZXMucHVzaCguLi5hd2FpdCBsb2FkZXIubG9hZFJlc291cmNlczzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPijGklt0eXBlXSkpO1xyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHJlc291cmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSdWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKCFpbnB1dClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZE9wZW4gPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLkN1c3RvbVRyZWU8UmVzb3VyY2VFbnRyeT4obmV3IENvbnRyb2xsZXJUcmVlUmVzb3VyY2UoKSwgdGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgdG8gY3JlYXRlIG5ldyByZXNvdXJjZS5cXG7il48gU2VsZWN0IG9yIGRyYWcgcmVzb3VyY2UuXCI7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcbiAgICAgIHRoaXMuaG5kQ3JlYXRlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy4jZXhwYW5kZWQpXHJcbiAgICAgICAgdGhpcy5leHBhbmQodGhpcy4jZXhwYW5kZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENyZWF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gYWRkIG5ldyByZXNvdXJjZXMgdG8gcm9vdCBmb2xkZXJcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiDGki5Qcm9qZWN0LnJlc291cmNlcykge1xyXG4gICAgICAgIGxldCByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UgPSDGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXTtcclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VGb2xkZXIuY29udGFpbnMocmVzb3VyY2UpKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKFtyZXNvdXJjZV0sIHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaG5kVXBkYXRlKCk7XHJcbiAgICAgIGxldCByb290SXRlbTogxpJ1aS5DdXN0b21UcmVlSXRlbTxSZXNvdXJjZUVudHJ5PiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZSh0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgaWYgKCFyb290SXRlbS5leHBhbmRlZClcclxuICAgICAgICByb290SXRlbS5leHBhbmQodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyByZW1vdmUgcmVzb3VyY2VzIHRoYXQgYXJlIG5vIGxvbmdlciByZWdpc3RlcmVkIGluIHRoZSBwcm9qZWN0XHJcbiAgICAgIGZvciAoY29uc3QgZGVzY2VuZGFudCBvZiB0aGlzLnJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgIGlmICghKGRlc2NlbmRhbnQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikgJiYgIcaSLlByb2plY3QucmVzb3VyY2VzW2Rlc2NlbmRhbnQuaWRSZXNvdXJjZV0pXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIucmVtb3ZlKGRlc2NlbmRhbnQpO1xyXG5cclxuICAgICAgdGhpcy5obmRVcGRhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRVcGRhdGUgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudHJlZS5yZWZyZXNoKCk7XHJcbiAgICAgIE9iamVjdC52YWx1ZXMoxpIuUHJvamVjdC5yZXNvdXJjZXMpXHJcbiAgICAgICAgLmZpbHRlcihfcmVzb3VyY2UgPT4gKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9yZXNvdXJjZSkuc3RhdHVzID09IMaSLlJFU09VUkNFX1NUQVRVUy5FUlJPUilcclxuICAgICAgICAubWFwKF9yZXNvdXJjZSA9PiB0aGlzLmNvbnRyb2xsZXIuZ2V0UGF0aChfcmVzb3VyY2UpKVxyXG4gICAgICAgIC5mb3JFYWNoKF9wYXRoID0+IHRoaXMudHJlZS5zaG93KF9wYXRoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbD8uc2VuZGVyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogX2V2ZW50LmRldGFpbCB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kKF9wYXRoczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGF0aHM6IFJlc291cmNlRW50cnlbXVtdID0gX3BhdGhzXHJcbiAgICAgICAgLm1hcChfcGF0aCA9PiBfcGF0aFxyXG4gICAgICAgICAgLnNwbGl0KFwiL1wiKVxyXG4gICAgICAgICAgLnNsaWNlKDEpIC8vIHJlbW92ZSByb290IGFzIGl0IGlzIGFkZGVkIGFzIGZpcnN0IGVsZW1lbnQgaW4gcmVkdWNlXHJcbiAgICAgICAgICAucmVkdWNlPFJlc291cmNlRm9sZGVyW10+KChfcGF0aCwgX2luZGV4KSA9PiBbLi4uX3BhdGgsIF9wYXRoW19wYXRoLmxlbmd0aCAtIDFdPy5lbnRyaWVzPy5bX2luZGV4XV0sIFt0aGlzLnJlc291cmNlRm9sZGVyXSkpXHJcbiAgICAgICAgLmZpbHRlcihfcGF0aCA9PiAhX3BhdGguc29tZShfZW50cnkgPT4gIV9lbnRyeSkpOyAvLyBmaWx0ZXIgb3V0IGludmFsaWQgcGF0aHNcclxuICAgICAgdGhpcy50cmVlLmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHBhbmRlZCgpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGNvbnN0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMudHJlZSkge1xyXG4gICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgZXhwYW5kZWQucHVzaCh0aGlzLmdldFBhdGgoaXRlbS5kYXRhKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGV4cGFuZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UGF0aChfZW50cnk6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmdldFBhdGgoX2VudHJ5KS5tYXAoX2VudHJ5ID0+IF9lbnRyeS5yZXNvdXJjZVBhcmVudD8uZW50cmllcy5pbmRleE9mKF9lbnRyeSkpLmpvaW4oXCIvXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL1ZpZXcvVmlldy50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbEZvbGRlci50c1wiLz5cclxuXHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBpbnRlcmZhY2UgRHJhZ0Ryb3BGaWx0ZXIge1xyXG4gICAgb25LZXlBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcbiAgICBvblR5cGVBdHRyaWJ1dGU/OiBzdHJpbmc7XHJcbiAgICBmcm9tVmlld3M/OiAodHlwZW9mIFZpZXcpW107XHJcbiAgICBvblR5cGU/OiBGdW5jdGlvbjtcclxuICAgIG9mVHlwZT86IEZ1bmN0aW9uO1xyXG4gICAgZHJvcEVmZmVjdDogXCJjb3B5XCIgfCBcImxpbmtcIiB8IFwibW92ZVwiIHwgXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBsZXQgZmlsdGVyOiB7IFtuYW1lOiBzdHJpbmddOiBEcmFnRHJvcEZpbHRlciB9ID0ge1xyXG4gICAgVXJsT25UZXh0dXJlOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiVGV4dHVyZUltYWdlXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBVcmxPbk1lc2hPQko6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJNZXNoT0JKXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH0sXHJcbiAgICBVcmxPbkF1ZGlvOiB7IGZyb21WaWV3czogW1ZpZXdFeHRlcm5hbF0sIG9uS2V5QXR0cmlidXRlOiBcInVybFwiLCBvblR5cGVBdHRyaWJ1dGU6IFwiQXVkaW9cIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uTWVzaEdMVEY6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJNZXNoR0xURlwiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9XHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJEZXRhaWwgZXh0ZW5kcyDGklVpLkNvbnRyb2xsZXIge1xyXG4gICAgI3ZpZXc6IFZpZXc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlLCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF92aWV3OiBWaWV3KSB7XHJcbiAgICAgIHN1cGVyKF9tdXRhYmxlLCBfZG9tRWxlbWVudCk7XHJcbiAgICAgIHRoaXMuI3ZpZXcgPSBfdmlldztcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5JTlNFUlQsIHRoaXMuaG5kSW5zZXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiSU5TRVJUIGF0IENvbnRyb2xsZXJEZXRhaWxcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9ldmVudC5kZXRhaWwpO1xyXG4gICAgICBsZXQgbXV0YWJsZTogxpIuTXV0YWJsZSA9IHRoaXMubXV0YWJsZVtfZXZlbnQuZGV0YWlsLmdldEF0dHJpYnV0ZShcImtleVwiKV07XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGFibGUudHlwZSk7XHJcbiAgICAgIGlmIChtdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5KVxyXG4gICAgICAgIG11dGFibGUucHVzaChuZXcgbXV0YWJsZS50eXBlKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGklVpLkVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHRoaXMgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB1cmwgb24gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPblRleHR1cmUsIGNoZWNrTWltZVR5cGUoTUlNRS5JTUFHRSkpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBtZXNob2JqXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaE9CSiwgY2hlY2tNaW1lVHlwZShNSU1FLk1FU0gpKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gYXVkaW9cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25BdWRpbywgY2hlY2tNaW1lVHlwZShNSU1FLkFVRElPKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIG1lc2hnbHRmXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaEdMVEYsIGNoZWNrTWltZVR5cGUoTUlNRS5HTFRGKSkpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCB7IG11dGFibGUsIGtleSB9ID0gdGhpcy5nZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudCk7XHJcbiAgICAgIGxldCBtZXRhVHlwZXM6IMaSLk1ldGFBdHRyaWJ1dGVUeXBlcyA9ICg8xpIuTXV0YWJsZT5tdXRhYmxlKS5nZXRNZXRhQXR0cmlidXRlVHlwZXM/LigpID8/IHt9O1xyXG4gICAgICBsZXQgbWV0YVR5cGU6IEZ1bmN0aW9uID0gbWV0YVR5cGVzW2tleV07XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgaWYgKCFtZXRhVHlwZSB8fCAobWV0YVR5cGUgJiYgdHlwZW9mIG1ldGFUeXBlID09IFwiZnVuY3Rpb25cIiAmJiAhKHNvdXJjZXNbMF0gaW5zdGFuY2VvZiBtZXRhVHlwZSkpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tNaW1lVHlwZShfbWltZTogTUlNRSk6IChfc291cmNlczogT2JqZWN0W10pID0+IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAoX3NvdXJjZXM6IE9iamVjdFtdKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICAgcmV0dXJuIChzb3VyY2VzLmxlbmd0aCA9PSAxICYmIHNvdXJjZXNbMF0uZ2V0TWltZVR5cGUoKSA9PSBfbWltZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHNldEV4dGVybmFsTGluazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9IChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IDxEaXJlY3RvcnlFbnRyeVtdPl9zb3VyY2VzO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS52YWx1ZSA9IHNvdXJjZXNbMF0ucGF0aFJlbGF0aXZlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlT25JbnB1dChfZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPblRleHR1cmUsIHNldEV4dGVybmFsTGluaykpIHJldHVybjtcclxuICAgICAgLy8gdGV4dHVyZVxyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbk1lc2hPQkosIHNldEV4dGVybmFsTGluaykpIHJldHVybjtcclxuICAgICAgLy8gYXVkaW9cclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25BdWRpbywgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGxldCB7IG11dGFibGUsIGtleSB9ID0gdGhpcy5nZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudCk7XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgbXV0YWJsZVtrZXldID0gc291cmNlc1swXTtcclxuXHJcbiAgICAgIHRoaXMuI3ZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJEcmFnRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX2ZpbHRlcjogRHJhZ0Ryb3BGaWx0ZXIsIF9jYWxsYmFjazogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiA9ICgpID0+IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IHR5cGVFbGVtZW50OiBzdHJpbmcgPSB0YXJnZXQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiBzdHJpbmcgPSB0aGlzLmdldEFuY2VzdG9yV2l0aFR5cGUodGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG5cclxuICAgICAgaWYgKF9maWx0ZXIub25LZXlBdHRyaWJ1dGUgJiYgdHlwZUVsZW1lbnQgIT0gX2ZpbHRlci5vbktleUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGVBdHRyaWJ1dGUgJiYgdHlwZUNvbXBvbmVudCAhPSBfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoX2ZpbHRlci5vblR5cGUgJiYgISh0aGlzLm11dGFibGUgaW5zdGFuY2VvZiBfZmlsdGVyLm9uVHlwZSkpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCB2aWV3U291cmNlOiBWaWV3ID0gVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCk7XHJcblxyXG4gICAgICBpZiAoIV9maWx0ZXIuZnJvbVZpZXdzPy5maW5kKChfdmlldykgPT4gdmlld1NvdXJjZSBpbnN0YW5jZW9mIF92aWV3KSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICBsZXQgc291cmNlczogT2JqZWN0W10gPSB2aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBpZiAoIShzb3VyY2VzWzBdIGluc3RhbmNlb2YgX2ZpbHRlci5vZlR5cGUpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghX2NhbGxiYWNrKHNvdXJjZXMpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBbmNlc3RvcldpdGhUeXBlKF90YXJnZXQ6IEV2ZW50VGFyZ2V0KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X3RhcmdldDtcclxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgdHlwZTogc3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIGlmICh0eXBlKVxyXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUYXJnZXRNdXRhYmxlQW5kS2V5KF9ldmVudDogRXZlbnQpOiB7IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47IGtleTogc3RyaW5nIH0ge1xyXG4gICAgICBsZXQgcGF0aDogxpIuR2VuZXJhbFtdID0gX2V2ZW50LmNvbXBvc2VkUGF0aCgpO1xyXG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBwYXRoLmluZGV4T2YodGhpcy5kb21FbGVtZW50KSk7XHJcbiAgICAgIHBhdGggPSBwYXRoLmZpbHRlcihfZWxlbWVudCA9PiBfZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIChfZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKSk7XHJcbiAgICAgIHBhdGgucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4gPSB0aGlzLm11dGFibGU7XHJcbiAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IHBhdGgubWFwKF9lbGVtZW50ID0+IF9lbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7IGkrKylcclxuICAgICAgICBtdXRhYmxlID0gbXV0YWJsZVtrZXlzW2ldXTtcclxuXHJcbiAgICAgIHJldHVybiB7IG11dGFibGUsIGtleToga2V5c1trZXlzLmxlbmd0aCAtIDFdIH07XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFkOiDGknVpLlRBQkxFW10gPSBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiB0cnVlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJUeXBlXCIsIGtleTogXCJ0eXBlXCIsIHNvcnRhYmxlOiB0cnVlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIklkXCIsIGtleTogXCJpZFJlc291cmNlXCIsIHNvcnRhYmxlOiBmYWxzZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlUmVzb3VyY2UuaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TGFiZWwoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgcmVuYW1lKF9vYmplY3Q6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJDaGVjayByZW5hbWVcIiwgX29iamVjdC5uYW1lLCBfbmV3KTtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9vYmplY3QubmFtZSAhPSBfbmV3O1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX29iamVjdC5uYW1lID0gX25ldzsgLy8gbXVzdCByZW5hbWUgYmVmb3JlIGxvYWRpbmcsIFRPRE86IFdIWSBpcyBpdCB0aGF0IHRoZSByZW5hbWluZyBpcyBzdXBwb3NlZCB0byBiZSBoYW5kbGVkIGJ5IHRoZSBhY3R1YWwgdGFibGU/Pz9cclxuICAgICAgICBhd2FpdCAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X29iamVjdCkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvcHkoX29yaWdpbmFsczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSk6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9mb2N1c3NlZCwgdGhpcy5zZWxlY3Rpb24pO1xyXG4gICAgICAvLyB0aGlzLnNlbGVjdGlvbiA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kYWJsZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSB0aGlzLnNlbGVjdGlvbi5jb25jYXQoW10pOyAvL19mb2N1c3NlZCk7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uczogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25TdHJpbmdzOiBNYXA8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIHN0cmluZz4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCB1c2FnZXM6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBleHBlbmRhYmxlIG9mIGV4cGVuZGFibGVzKSB7XHJcbiAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBleHBlbmRhYmxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgIGlmIChzZXJpYWxpemF0aW9uU3RyaW5ncy5nZXQocmVzb3VyY2UpLmluZGV4T2YoZXhwZW5kYWJsZS5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhd2FpdCBvcGVuRGlhbG9nKCkpIHtcclxuICAgICAgICBsZXQgZGVsZXRlZDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHVzYWdlIGluIHVzYWdlcylcclxuICAgICAgICAgIGlmICh1c2FnZXNbdXNhZ2VdLmxlbmd0aCA9PSAwKSB7IC8vIGRlbGV0ZSBvbmx5IHVudXNlZFxyXG4gICAgICAgICAgICBkZWxldGVkLnB1c2goxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKMaSLlByb2plY3QucmVzb3VyY2VzW3VzYWdlXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQodXNhZ2VzLCB0cnVlLCBcIlJldmlldyByZWZlcmVuY2VzLCBkZWxldGUgZGVwZW5kZW5kIHJlc291cmNlcyBmaXJzdCBpZiBhcHBsaWNhYmxlXCIsIFwiVG8gZGVsZXRlIHVudXNlZCByZXNvdXJjZXMsIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgX2I6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBTY3JpcHRJbmZvIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3VwZXJDbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIHNjcmlwdDogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgaXNDb21wb25lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudFNjcmlwdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihfc2NyaXB0OiBGdW5jdGlvbiwgX25hbWVzcGFjZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuc2NyaXB0ID0gX3NjcmlwdDtcclxuICAgICAgdGhpcy5uYW1lID0gX3NjcmlwdC5uYW1lO1xyXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IF9uYW1lc3BhY2U7XHJcbiAgICAgIGxldCBjaGFpbjogRnVuY3Rpb24gPSBfc2NyaXB0W1wiX19wcm90b19fXCJdO1xyXG4gICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBjaGFpbi5uYW1lO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudCA9IHRoaXMuaXNDb21wb25lbnQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRcIik7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBvbmVudFNjcmlwdCA9IHRoaXMuaXNDb21wb25lbnRTY3JpcHQgfHwgKGNoYWluLm5hbWUgPT0gXCJDb21wb25lbnRTY3JpcHRcIik7XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbltcIl9fcHJvdG9fX1wiXTtcclxuICAgICAgfSB3aGlsZSAoY2hhaW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVNjcmlwdCBleHRlbmRzIMaSdWkuVGFibGVDb250cm9sbGVyPFNjcmlwdEluZm8+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVNjcmlwdC5nZXRIZWFkKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICBsZXQgaGVhZDogxpJ1aS5UQUJMRVtdID0gW107XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIk5hbWVcIiwga2V5OiBcIm5hbWVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiU3VwZXJcIiwga2V5OiBcInN1cGVyQ2xhc3NcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZXNwYWNlXCIsIGtleTogXCJuYW1lc3BhY2VcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgcmV0dXJuIGhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlYWQoKTogxpJ1aS5UQUJMRVtdIHtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXJUYWJsZVNjcmlwdC5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiBTY3JpcHRJbmZvKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogU2NyaXB0SW5mbywgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGRlbGV0ZShfZm9jdXNzZWQ6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiBTY3JpcHRJbmZvW10pOiBQcm9taXNlPFNjcmlwdEluZm9bXT4geyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc29ydChfZGF0YTogU2NyaXB0SW5mb1tdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKF9hOiBTY3JpcHRJbmZvLCBfYjogU2NyaXB0SW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIF9kaXJlY3Rpb24gKiAoX2FbX2tleV0gPT0gX2JbX2tleV0gPyAwIDogKF9hW19rZXldID4gX2JbX2tleV0gPyAxIDogLTEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2RhdGEuc29ydChjb21wYXJlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSBleHRlbmRzIMaSVWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8RGlyZWN0b3J5RW50cnk+IHtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gX2VudHJ5Lm5hbWU7XHJcbiAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSwgX2VsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLndhcm4oYENvdWxkIG5vdCByZW5hbWUgZmlsZSAnJHtfZW50cnkubmFtZX0nIHRvICcke19lbGVtZW50LnZhbHVlfScuYCwgX2Vycm9yKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IERpcmVjdG9yeUVudHJ5KTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeS5pc0RpcmVjdG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5LmdldERpcmVjdG9yeUNvbnRlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXF1YWxzKF9hOiBEaXJlY3RvcnlFbnRyeSwgX2I6IERpcmVjdG9yeUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfYS5wYXRoUmVsYXRpdmUgPT0gX2IucGF0aFJlbGF0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBEaXJlY3RvcnlFbnRyeVtdKTogUHJvbWlzZTxEaXJlY3RvcnlFbnRyeVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kOiBEaXJlY3RvcnlFbnRyeVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3Vzc2VkO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLnNlbGVjdGlvbiB8fCBleHBlbmQpIHtcclxuICAgICAgICBlbnRyeS5kZWxldGUoKTtcclxuICAgICAgICBkZWxldGVkLnB1c2goZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9lbnRyaWVzOiBEaXJlY3RvcnlFbnRyeVtdLCBfdGFyZ2V0OiBEaXJlY3RvcnlFbnRyeSk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICBsZXQgbW92ZTogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfZW50cmllcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBfdGFyZ2V0LmFkZEVudHJ5KGVudHJ5KTtcclxuICAgICAgICAgIGVudHJ5LmRlbGV0ZSgpO1xyXG4gICAgICAgICAgbW92ZS5wdXNoKGVudHJ5KTtcclxuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICAgIMaSLkRlYnVnLndhcm4oYENvdWxkIG5vdCBhZGQgZmlsZSAnJHtlbnRyeS5uYW1lfScgdG8gJyR7X3RhcmdldC5uYW1lfScuYCwgX2Vycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogRGlyZWN0b3J5RW50cnlbXSk6IFByb21pc2U8RGlyZWN0b3J5RW50cnlbXT4ge1xyXG4gICAgICAvLyBjb3BpZXMgY2FuIG5vdCBiZSBjcmVhdGVkIGF0IHRoaXMgcG9pbnQsIGJ1dCB3aGVuIGNvcHlpbmcgdGhlIGZpbGVzLiBTZWUgYWRkQ2hpbGRyZW5cclxuICAgICAgcmV0dXJuIF9vcmlnaW5hbHM7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZUhpZXJhcmNoeSBleHRlbmRzIMaSVWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8xpIuTm9kZT4ge1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9vYmplY3Q6IMaSLk5vZGUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfb2JqZWN0Lm5hbWU7XHJcbiAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cmlidXRlcyhfbm9kZTogxpIuTm9kZSk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBhdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtfbm9kZS5pc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJdO1xyXG4gICAgICBpZiAoX25vZGUgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcIkdyYXBoSW5zdGFuY2VcIik7XHJcbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfbm9kZTogxpIuTm9kZSwgX2VsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICBsZXQgcmVuYW1lOiBib29sZWFuID0gX25vZGUubmFtZSAhPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgaWYgKHJlbmFtZSkge1xyXG4gICAgICAgIF9ub2RlLm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgICBhd2FpdCAoPMaSLkdyYXBoR0xURj5fbm9kZSkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9ub2RlOiDGki5Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfbm9kZS5nZXRDaGlsZHJlbigpLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENoaWxkcmVuKF9ub2RlOiDGki5Ob2RlKTogxpIuTm9kZVtdIHtcclxuICAgICAgcmV0dXJuIF9ub2RlLmdldENoaWxkcmVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IMaSLk5vZGVbXSk6IFByb21pc2U8xpIuTm9kZVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6IMaSLk5vZGVbXSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA+IDAgPyB0aGlzLnNlbGVjdGlvbiA6IF9mb2N1c3NlZDtcclxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBleHBlbmQpXHJcbiAgICAgICAgaWYgKG5vZGUuZ2V0UGFyZW50KCkpIHtcclxuICAgICAgICAgIG5vZGUuZ2V0UGFyZW50KCkucmVtb3ZlQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IMaSLk5vZGVbXSwgX3RhcmdldDogxpIuTm9kZSwgX2luZGV4PzogbnVtYmVyKTogxpIuTm9kZVtdIHtcclxuICAgICAgLy8gZGlzYWxsb3cgZHJvcCBmb3Igc291cmNlcyBiZWluZyBhbmNlc3RvciB0byB0YXJnZXRcclxuICAgICAgbGV0IG1vdmU6IMaSLk5vZGVbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKCFfdGFyZ2V0LmlzRGVzY2VuZGFudE9mKGNoaWxkKSlcclxuICAgICAgICAgIG1vdmUucHVzaChjaGlsZCk7XHJcblxyXG4gICAgICBtb3ZlLmZvckVhY2goKF9ub2RlLCBfaU1vdmUpID0+IF90YXJnZXQuYWRkQ2hpbGQoX25vZGUsIF9pbmRleCA9PSB1bmRlZmluZWQgPyBfaW5kZXggOiBfaW5kZXggKyBfaU1vdmUpKTtcclxuICAgICAgLy8gZm9yIChsZXQgbm9kZSBvZiBtb3ZlKVxyXG4gICAgICAvLyAgIF90YXJnZXQuYWRkQ2hpbGQobm9kZSwgX2lUYXJnZXQpO1xyXG5cclxuICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNvcHkoX29yaWdpbmFsczogxpIuTm9kZVtdKTogUHJvbWlzZTzGki5Ob2RlW10+IHtcclxuICAgICAgLy8gdHJ5IHRvIGNyZWF0ZSBjb3BpZXMgYW5kIHJldHVybiB0aGVtIGZvciBwYXN0ZSBvcGVyYXRpb25cclxuICAgICAgbGV0IGNvcGllczogxpIuTm9kZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IG9yaWdpbmFsIG9mIF9vcmlnaW5hbHMpIHtcclxuICAgICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbiA9IMaSLlNlcmlhbGl6ZXIuc2VyaWFsaXplKG9yaWdpbmFsKTtcclxuICAgICAgICBsZXQgY29weTogxpIuTm9kZSA9IDzGki5Ob2RlPmF3YWl0IMaSLlNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoc2VyaWFsaXphdGlvbik7XHJcbiAgICAgICAgY29waWVzLnB1c2goY29weSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvcGllcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2FuQWRkQ2hpbGRyZW4oX3NvdXJjZXM6IMaSLk5vZGVbXSwgX3RhcmdldDogxpIuTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAoX3NvdXJjZXMubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgcmV0dXJuIF9zb3VyY2VzLmV2ZXJ5KF9zb3VyY2UgPT4gY2hlY2tHcmFwaERyb3AoX3NvdXJjZSwgX3RhcmdldCkpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tHcmFwaERyb3AoX3NvdXJjZTogxpIuTm9kZSwgX3RhcmdldDogxpIuTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBpZFNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBfc291cmNlLmdldEl0ZXJhdG9yKCkpXHJcbiAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgICAgIGlkU291cmNlcy5wdXNoKG5vZGUuaWRTb3VyY2UpO1xyXG4gICAgICAgICAgZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgICBpZFNvdXJjZXMucHVzaChub2RlLmlkUmVzb3VyY2UpO1xyXG5cclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICBpZiAoX3RhcmdldCBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgICAgICBpZiAoaWRTb3VyY2VzLmluZGV4T2YoX3RhcmdldC5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIGlmIChfdGFyZ2V0IGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICAgICAgaWYgKGlkU291cmNlcy5pbmRleE9mKF90YXJnZXQuaWRTb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0LmdldFBhcmVudCgpO1xyXG4gICAgICAgIH0gd2hpbGUgKF90YXJnZXQpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBjb25zdCBlbnVtIElEIHtcclxuICAgIE5BTUUgPSBcIm5hbWVcIixcclxuICAgIEZVTkNUSU9OID0gXCJmdW5jdGlvblwiLFxyXG4gICAgVkFMVUUgPSBcInZhbHVlXCIsXHJcbiAgICBUUkFOU0ZPUk1BVElPTiA9IFwidHJhbnNmb3JtYXRpb25cIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlUGFydGljbGVTeXN0ZW0gZXh0ZW5kcyDGknVpLkN1c3RvbVRyZWVDb250cm9sbGVyPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXTsgdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICBwdWJsaWMgY2hpbGRUb1BhcmVudDogTWFwPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3UGFydGljbGVTeXN0ZW07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtLCBfdmlldzogVmlld1BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLnZpZXcgPSBfdmlldztcclxuICAgICAgdGhpcy5jb3B5UGFzdGUgPSBDb250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtLmNvcHlQYXN0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBsZXQgcGFyZW50RGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIcaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpICYmICHGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBsZXQgc3Bhbk5hbWU6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5OYW1lLmlubmVyVGV4dCA9IHBhcmVudERhdGEgPyBrZXkgOiDGki5QYXJ0aWNsZVN5c3RlbS5uYW1lO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbk5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyZW50RGF0YSAmJiBwYXJlbnREYXRhID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIC8vIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2tleV07XHJcbiAgICAgICAgaW5wdXQuaWQgPSBJRC5OQU1FO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpIHtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgICBzZWxlY3QuaWQgPSBJRC5GVU5DVElPTjtcclxuICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgT2JqZWN0LnZhbHVlcyjGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04pKSB7XHJcbiAgICAgICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBlbnRyeS50ZXh0ID0gbmFtZTtcclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IF9kYXRhLmZ1bmN0aW9uO1xyXG4gICAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgICAvLyBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpbnB1dC5pZCA9IElELlZBTFVFO1xyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvZGUoX2RhdGEpKSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEuY29kZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibGlzdFwiLCBcInZhcmlhYmxlc1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIH0gZWxzZSBpZiAoxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgIHNlbGVjdC5pZCA9IElELlRSQU5TRk9STUFUSU9OO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBbxpIuTWF0cml4NHg0LnByb3RvdHlwZS50cmFuc2xhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5yb3RhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5zY2FsZS5uYW1lXSkge1xyXG4gICAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgICAgZW50cnkudmFsdWUgPSBrZXk7XHJcbiAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gX2RhdGEudHJhbnNmb3JtYXRpb247XHJcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cmlidXRlcyhfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBhdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpIHx8IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInZhcmlhYmxlXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChfZGF0YS5mdW5jdGlvbik7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEuY29sb3IpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29sb3JcIik7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInRyYW5zZm9ybWF0aW9uXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29kZVwiKTtcclxuXHJcbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IGlucHV0QXNOdW1iZXI6IG51bWJlciA9IE51bWJlci5wYXJzZUZsb2F0KF9lbGVtZW50LnZhbHVlKTtcclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5OQU1FICYmIMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoX2VsZW1lbnQudmFsdWUpKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVNbX2VsZW1lbnQudmFsdWVdKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBpcyBhIHByZWRlZmluZWQgdmFyaWFibGUgYW5kIGNhbiBub3QgYmUgcmVkZWNsYXJlZC4gUHJlZGVmaW5lZCB2YXJpYWJsZXM6IFske09iamVjdC5rZXlzKMaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFUykuam9pbihcIiwgXCIpfV1gKTtcclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIMaSdWkuV2FybmluZy5kaXNwbGF5KGVycm9ycywgXCJVbmFibGUgdG8gcmVuYW1lXCIsIFwiUGxlYXNlIHJlc29sdmUgdGhlIGVycm9ycyBhbmQgdHJ5IGFnYWluXCIgKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmRhdGEudmFyaWFibGVzLmluZGV4T2YoX2RhdGEpO1xyXG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lc1tpbmRleF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShuYW1lLCBfZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5GVU5DVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS5mdW5jdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04+X2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5UUkFOU0ZPUk1BVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS50cmFuc2Zvcm1hdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXCJ0cmFuc2Zvcm1hdGlvblwiXT5fZWxlbWVudC52YWx1ZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpKSkge1xyXG4gICAgICAgIGxldCBpbnB1dDogc3RyaW5nIHwgbnVtYmVyID0gTnVtYmVyLmlzTmFOKGlucHV0QXNOdW1iZXIpID8gX2VsZW1lbnQudmFsdWUgOiBpbnB1dEFzTnVtYmVyO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIiAmJiAhxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTW2lucHV0XSAmJiB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyAmJiAhdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoaW5wdXQpKSBcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBfZGF0YS52YWx1ZSA9IGlucHV0O1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkpIHtcclxuICAgICAgICBfZGF0YS5jb2RlID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbihfZGF0YSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgY2hpbGRyZW46IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSA9IFtdO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0gxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YTtcclxuICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAga2V5cyA9IFZpZXdQYXJ0aWNsZVN5c3RlbS5QUk9QRVJUWV9LRVlTLmZpbHRlcihfa2V5ID0+IGtleXMuaW5jbHVkZXMoX2tleSkpO1xyXG5cclxuICAgICAga2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IGRhdGFbX2tleV07XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oY2hpbGQpIHx8IHR5cGVvZiBjaGlsZCA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YVtfa2V5XSwgX2RhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIHJldHVybiBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c2VkOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSk6IFByb21pc2U8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNlZDtcclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBleHBlbmQpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWxldGVEYXRhKGRhdGEpKVxyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdLCBfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfYXQ/OiBudW1iZXIpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBsZXQgbW92ZTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdID0gW107XHJcbiAgICAgIGxldCBjb250YWluZXI6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXTtcclxuXHJcbiAgICAgIGlmICgoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX3RhcmdldCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX3RhcmdldCkpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkpXHJcbiAgICAgICAgY29udGFpbmVyID0gX3RhcmdldC5wYXJhbWV0ZXJzO1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4TG9jYWwgfHwgX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4V29ybGQpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXT5fdGFyZ2V0O1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEudmFyaWFibGVzIHx8IF90YXJnZXQgPT0gdGhpcy5kYXRhLmNvbG9yKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbltdPl90YXJnZXQ7XHJcblxyXG4gICAgICBpZiAoIWNvbnRhaW5lcikgXHJcbiAgICAgICAgcmV0dXJuIG1vdmU7XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250YWluZXIpKVxyXG4gICAgICAgIGZvciAobGV0IGRhdGEgb2YgX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGNvbnRhaW5lci5pbmRleE9mKGRhdGEpOyAvLyBfYXQgbmVlZHMgdG8gYmUgY29ycmVjdGVkIGlmIHdlIGFyZSBtb3Zpbmcgd2l0aGluIHNhbWUgcGFyZW50XHJcbiAgICAgICAgICBsZXQgaGFzUGFyZW50OiBib29sZWFuID0gdGhpcy5jaGlsZFRvUGFyZW50LmhhcyhkYXRhKTtcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lcz8uW2luZGV4XTtcclxuXHJcbiAgICAgICAgICBpZiAoaGFzUGFyZW50ICYmICF0aGlzLmRlbGV0ZURhdGEoZGF0YSkpIFxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBpZiAoIWhhc1BhcmVudClcclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cclxuICAgICAgICAgIG1vdmUucHVzaChkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YSwgX3RhcmdldCk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSAmJiBfYXQgPiBpbmRleClcclxuICAgICAgICAgICAgX2F0IC09IDE7XHJcblxyXG4gICAgICAgICAgaWYgKF9hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMucHVzaChuYW1lIHx8IHRoaXMuZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250YWluZXIuc3BsaWNlKF9hdCArIF9jaGlsZHJlbi5pbmRleE9mKGRhdGEpLCAwLCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnNwbGljZShfYXQgKyBfY2hpbGRyZW4uaW5kZXhPZihkYXRhKSwgMCwgbmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10pOiBQcm9taXNlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXT4ge1xyXG4gICAgICBsZXQgY29waWVzOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSA9IFtdO1xyXG4gICAgICBpZiAoX29yaWdpbmFscy5ldmVyeShfb3JpZ2luYWwgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfb3JpZ2luYWwpKSB8fCBfb3JpZ2luYWxzLmV2ZXJ5KF9vcmlnaW5hbCA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfb3JpZ2luYWwpKSlcclxuICAgICAgICBfb3JpZ2luYWxzLmZvckVhY2goX29yaWdpbmFsID0+IGNvcGllcy5wdXNoKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX29yaWdpbmFsKSkpKTtcclxuXHJcbiAgICAgIHJldHVybiBjb3BpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG92ZXJyaWRlIGRyYWdnYWJsZShfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF90YXJnZXQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gXCJuZXdWYXJpYWJsZVwiO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDE7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xyXG4gICAgICAgIG5hbWUgPSBcIm5ld1ZhcmlhYmxlXCIgKyBjb3VudDtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0S2V5KF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogc3RyaW5nIHsgXHJcbiAgICAgIGxldCBwYXJlbnQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKSB8fCB7fTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKHBhcmVudCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24ocGFyZW50KSlcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyYW1ldGVycztcclxuXHJcbiAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJlbnQpLmZpbmQoX2VudHJ5ID0+IF9lbnRyeVsxXSA9PSBfZGF0YSk/LnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHBhcmVudDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24ocGFyZW50KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihwYXJlbnQpKVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJhbWV0ZXJzO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50KSkge1xyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KGtleSk7XHJcbiAgICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWxldGUgcGFyZW50W2tleV07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5kZWxldGUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmFtZVZhcmlhYmxlKF9uYW1lOiBzdHJpbmcsIF9uZXc6IHN0cmluZywgX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmRhdGEpOiB2b2lkIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSAmJiBfZGF0YS52YWx1ZSA9PSBfbmFtZSkge1xyXG4gICAgICAgIF9kYXRhLnZhbHVlID0gX25ldztcclxuICAgICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBkZXRhaWw6IHsgZGF0YTogX2RhdGEgfSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBzdWJEYXRhIG9mIE9iamVjdC52YWx1ZXMoXCJwYXJhbWV0ZXJzXCIgaW4gX2RhdGEgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGEpKVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViRGF0YSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShfbmFtZSwgX25ldywgc3ViRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCB0eXBlIFJlc291cmNlRW50cnkgPSBSZXNvdXJjZUZpbGUgfCBSZXNvdXJjZUZvbGRlcjtcclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZUZpbGUgZXh0ZW5kcyDGki5TZXJpYWxpemFibGVSZXNvdXJjZSB7XHJcbiAgICByZXNvdXJjZVBhcmVudD86IFJlc291cmNlRm9sZGVyOyAvLyBkYW5nZXJvdXMgYXMgYSBTZXJpYWxpemFibGVSZXNvdXJjZSBtdXN0IG5vdCBoYXZlIGEgcHJvcGVydHkgd2l0aCB0aGlzIG5hbWUgaXRzZWxmXHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgUmVzb3VyY2VGb2xkZXIgaW1wbGVtZW50cyDGki5TZXJpYWxpemFibGUge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyByZXNvdXJjZVBhcmVudDogUmVzb3VyY2VGb2xkZXI7XHJcbiAgICBwdWJsaWMgZW50cmllczogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nID0gXCJGb2xkZXJcIjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZyA9IFwiTmV3IEZvbGRlclwiKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb3IgYW55IG9mIGl0cyBkZXNjZW5kYW50cyBjb250YWluIHRoZSBnaXZlbiByZXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zKF9yZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBib29sZWFuIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5lbnRyaWVzKSBcclxuICAgICAgICBpZiAoZW50cnkgPT0gX3Jlc291cmNlIHx8IGVudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgJiYgZW50cnkuY29udGFpbnMoX3Jlc291cmNlKSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXJpYWxpemUoKTogxpIuU2VyaWFsaXphdGlvbiB7XHJcbiAgICAgIGxldCBzZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uID0geyBuYW1lOiB0aGlzLm5hbWUsIGVudHJpZXM6IFtdIH07XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykge1xyXG4gICAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgc2VyaWFsaXphdGlvbi5lbnRyaWVzLnB1c2goZW50cnkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uZW50cmllcy5wdXNoKHsgaWRSZXNvdXJjZTogZW50cnkuaWRSZXNvdXJjZSB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VyaWFsaXphdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVzZXJpYWxpemUoX3NlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfc2VyaWFsaXphdGlvbi5uYW1lO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeVNlcmlhbGl6YXRpb24gb2YgX3NlcmlhbGl6YXRpb24uZW50cmllcyA/PyBfc2VyaWFsaXphdGlvbi5jaGlsZHJlbikgeyAvLyByZW1vdmUgXCI/PyBfc2VyaWFsaXphdGlvbi5jaGlsZHJlblwiIGFmdGVyIGEgd2hpbGVcclxuICAgICAgICBsZXQgZW50cnk6IFJlc291cmNlRW50cnk7XHJcbiAgICAgICAgaWYgKFwiaWRSZXNvdXJjZVwiIGluIGVudHJ5U2VyaWFsaXphdGlvbilcclxuICAgICAgICAgIGVudHJ5ID0gYXdhaXQgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShlbnRyeVNlcmlhbGl6YXRpb24uaWRSZXNvdXJjZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZW50cnkgPSA8UmVzb3VyY2VGb2xkZXI+YXdhaXQgbmV3IFJlc291cmNlRm9sZGVyKCkuZGVzZXJpYWxpemUoZW50cnlTZXJpYWxpemF0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICB0aGlzLmVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICBlbnRyeS5yZXNvdXJjZVBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxSZXNvdXJjZUVudHJ5PiB7XHJcbiAgICAgIHlpZWxkIHRoaXM7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuZW50cmllcykge1xyXG4gICAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgeWllbGQqIGVudHJ5O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHlpZWxkIGVudHJ5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVSZXNvdXJjZSBleHRlbmRzIMaSdWkuQ3VzdG9tVHJlZUNvbnRyb2xsZXI8UmVzb3VyY2VFbnRyeT4ge1xyXG4gICAgcHVibGljIGNyZWF0ZUNvbnRlbnQoX29iamVjdDogUmVzb3VyY2VFbnRyeSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IF9vYmplY3QubmFtZTtcclxuXHJcbiAgICAgIGlmICghKF9vYmplY3QgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJpY29uXCIsIF9vYmplY3QudHlwZSk7XHJcblxyXG4gICAgICAgIGlmICgoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X29iamVjdCkuc3RhdHVzID09IMaSLlJFU09VUkNFX1NUQVRVUy5FUlJPUikge1xyXG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xyXG4gICAgICAgICAgaW5wdXQudGl0bGUgPSBcIkZhaWxlZCB0byBsb2FkIHJlc291cmNlIGZyb20gZmlsZS4gQ2hlY2sgdGhlIGNvbnNvbGUgZm9yIGRldGFpbHMuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX29iamVjdDogUmVzb3VyY2VFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZW50cnk6IFJlc291cmNlRW50cnksIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9lbnRyeS5uYW1lICE9IF9lbGVtZW50LnZhbHVlO1xyXG4gICAgICBpZiAocmVuYW1lKSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgICBhd2FpdCAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X2VudHJ5KS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciAmJiBfZW50cnkuZW50cmllcy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZW50cnk6IFJlc291cmNlRW50cnkpOiBSZXNvdXJjZUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgPyBfZW50cnkuZW50cmllcyA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfc291cmNlczogUmVzb3VyY2VFbnRyeVtdLCBfdGFyZ2V0OiBSZXNvdXJjZUVudHJ5LCBfaW5kZXg/OiBudW1iZXIpOiBSZXNvdXJjZUVudHJ5W10ge1xyXG4gICAgICBpZiAoIShfdGFyZ2V0IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGxldCBtb3ZlOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgc291cmNlIG9mIF9zb3VyY2VzKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleDogbnVtYmVyID0gX3RhcmdldC5lbnRyaWVzLmluZGV4T2Yoc291cmNlKTsgLy8gX2luZGV4IG5lZWRzIHRvIGJlIGNvcnJlY3RlZCBpZiB3ZSBhcmUgbW92aW5nIHdpdGhpbiBzYW1lIHBhcmVudFxyXG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAtMSAmJiBfaW5kZXggPiBjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgICBfaW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoc291cmNlKTtcclxuICAgICAgICBzb3VyY2UucmVzb3VyY2VQYXJlbnQgPSBfdGFyZ2V0O1xyXG4gICAgICAgIG1vdmUucHVzaChzb3VyY2UpO1xyXG5cclxuICAgICAgICBpZiAoX2luZGV4ID09IG51bGwpXHJcbiAgICAgICAgICBfdGFyZ2V0LmVudHJpZXMucHVzaChzb3VyY2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF90YXJnZXQuZW50cmllcy5zcGxpY2UoX2luZGV4ICsgX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpLCAwLCBzb3VyY2UpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBSZXNvdXJjZUVudHJ5W10pOiBQcm9taXNlPFJlc291cmNlRW50cnlbXT4ge1xyXG4gICAgICAvLyBUT0RPOiBhZGQgZGVsZXRlIHNlbGVjdGlvbiBpc250ZWFkIG9mIF9mb2N1c3NlZD8gV2h5IGRvZXNuJ3QgdGhlIFRyZWUgY2xhc3MgaGFuZGxlIHRoaXM/XHJcbiAgICAgIGxldCBpUm9vdDogbnVtYmVyID0gX2ZvY3Vzc2VkLmluZGV4T2YocHJvamVjdC5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIGlmIChpUm9vdCA+IC0xKVxyXG4gICAgICAgIF9mb2N1c3NlZC5zcGxpY2UoaVJvb3QsIDEpO1xyXG5cclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIHNlcmlhbGl6YXRpb25zKVxyXG4gICAgICAgIHNlcmlhbGl6YXRpb25TdHJpbmdzLnNldCjGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXSwgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbnNbaWRSZXNvdXJjZV0pKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgX2ZvY3Vzc2VkKSB7XHJcbiAgICAgICAgaWYgKGV4cGVuZGFibGUgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgICAgbGV0IHVzYWdlOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleHBlbmRhYmxlLmVudHJpZXMpXHJcbiAgICAgICAgICAgIHVzYWdlLnB1c2goZW50cnkubmFtZSk7XHJcblxyXG4gICAgICAgICAgdXNhZ2VzW19mb2N1c3NlZC5pbmRleE9mKGV4cGVuZGFibGUpICsgXCIgXCIgKyBleHBlbmRhYmxlLm5hbWVdID0gdXNhZ2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZS5pZFJlc291cmNlICE9IGV4cGVuZGFibGUuaWRSZXNvdXJjZSlcclxuICAgICAgICAgICAgICBpZiAoc2VyaWFsaXphdGlvblN0cmluZ3MuZ2V0KHJlc291cmNlKS5pbmRleE9mKGV4cGVuZGFibGUuaWRSZXNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICAgIHVzYWdlc1tleHBlbmRhYmxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2ZvY3Vzc2VkLmxlbmd0aCA+IDAgJiYgYXdhaXQgb3BlbkRpYWxvZygpKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZWQ6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIF9mb2N1c3NlZCkge1xyXG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nID0gc2VsZWN0ZWQgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlciA/IHRoaXMuc2VsZWN0aW9uLmluZGV4T2Yoc2VsZWN0ZWQpICsgXCIgXCIgKyBzZWxlY3RlZC5uYW1lIDogc2VsZWN0ZWQuaWRSZXNvdXJjZTtcclxuICAgICAgICAgIGlmICh1c2FnZXNba2V5XS5sZW5ndGggPT0gMCkgIC8vIGRlbGV0ZSBvbmx5IHVudXNlZFxyXG4gICAgICAgICAgICBkZWxldGVkLnB1c2goc2VsZWN0ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcmVzb3VyY2Ugb2YgZGVsZXRlZCkge1xyXG4gICAgICAgICAgaWYgKCEocmVzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpXHJcbiAgICAgICAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5yZW1vdmUocmVzb3VyY2UpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKHRoaXMuc2VsZWN0aW9uLmluZGV4T2YocmVzb3VyY2UpLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBhc3luYyBmdW5jdGlvbiBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGJvb2xlYW4+ID0gxpJ1aS5EaWFsb2cucHJvbXB0KHVzYWdlcywgdHJ1ZSwgXCJSZXZpZXcgcmVmZXJlbmNlcywgZGVsZXRlIGRlcGVuZGVuZCByZXNvdXJjZXMgZmlyc3QgaWYgYXBwbGljYWJsZVwiLCBcIlRvIGRlbGV0ZSB1bnVzZWQgcmVzb3VyY2VzLCBwcmVzcyBPS1wiLCBcIk9LXCIsIFwiQ2FuY2VsXCIpO1xyXG5cclxuICAgICAgICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiBSZXNvdXJjZUVudHJ5W10pOiBQcm9taXNlPFJlc291cmNlRW50cnlbXT4ge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhdGgoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgbGV0IHBhdGg6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudDogUmVzb3VyY2VFbnRyeSA9IF9yZXNvdXJjZTtcclxuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcclxuICAgICAgICBwYXRoLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmVzb3VyY2VQYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogdm9pZCB7XHJcbiAgICAgIGxldCBwYXJlbnQ6IFJlc291cmNlRm9sZGVyID0gX3Jlc291cmNlLnJlc291cmNlUGFyZW50O1xyXG4gICAgICBpZiAoIXBhcmVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHBhcmVudC5lbnRyaWVzLmluZGV4T2YoX3Jlc291cmNlKTtcclxuICAgICAgcGFyZW50LmVudHJpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1ZpZXcudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgW1tQYW5lbF1dcyBhZ2dyZWdhdGluZyBbW1ZpZXddXXNcclxuICAgKiBTdWJjbGFzc2VzIGFyZSBwcmVzZXRzIGZvciBjb21tb24gcGFuZWxzLiBBIHVzZXIgbWlnaHQgYWRkIG9yIGRlbGV0ZSBbW1ZpZXddXXMgYXQgcnVudGltZVxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICAvLyBUT0RPOiBjbGFzcyBtaWdodCBiZWNvbWUgYSBjdXN0b21jb21wb25lbnQgZm9yIEhUTUwhID0gdGhpcy5kb21cclxuXHJcbiAgLy8gZXh0ZW5kcyB2aWV3IHZvcnLDvGJlcmdlaGVuZCBlbnRmZXJudFxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYW5lbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJvdGVjdGVkIGdvbGRlbkxheW91dDogR29sZGVuTGF5b3V0O1xyXG4gICAgcHJvdGVjdGVkIHZpZXdzOiBWaWV3W10gPSBbXTtcclxuICAgIC8vcHVibGljIGRvbTsgLy8gbXVzcyB2aWVsbGVpY2h0IHdlZ1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9wYW5lbFN0YXRlOiBWaWV3U3RhdGUsIF92aWV3Q29uc3RydWN0b3JzPzogeyBbbmFtZTogc3RyaW5nXTogbmV3ICguLi5hcmdzOiDGki5HZW5lcmFsKSA9PiBWaWV3IH0sIF9yb290SXRlbUNvbmZpZz86IFJvd09yQ29sdW1uSXRlbUNvbmZpZykge1xyXG4gICAgICBfY29udGFpbmVyLm9uKFwiZGVzdHJveVwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC5kZXN0cm95KCkpOyAvLyBkZXN0cm95IGZyb20gaW5zaWRlIG91dFxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfcGFuZWxTdGF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcInZpZXdcIik7XHJcbiAgICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZShcInBhbmVsXCIsIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IExheW91dENvbmZpZyA9IHtcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgIHBvcG91dDogZmFsc2UsXHJcbiAgICAgICAgICBtYXhpbWlzZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJvb3Q6IF9yb290SXRlbUNvbmZpZ1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQgPSBuZXcgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuR29sZGVuTGF5b3V0KHRoaXMuZG9tKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIF92aWV3Q29uc3RydWN0b3JzKVxyXG4gICAgICAgIHRoaXMuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50RmFjdG9yeUZ1bmN0aW9uKGtleSwgKF9jb250YWluZXIsIF92aWV3U3RhdGU6IFZpZXdTdGF0ZSkgPT4gbmV3IF92aWV3Q29uc3RydWN0b3JzW2tleV0oX2NvbnRhaW5lciwgeyAuLi5fcGFuZWxTdGF0ZSwgLi4uX3ZpZXdTdGF0ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dC5vbihcInN0YXRlQ2hhbmdlZFwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC51cGRhdGVSb290U2l6ZSgpKTtcclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQub24oXCJpdGVtQ3JlYXRlZFwiLCB0aGlzLmFkZFZpZXdDb21wb25lbnQpO1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQubG9hZExheW91dChfcGFuZWxTdGF0ZVtcImxheW91dFwiXSA/IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQoX3BhbmVsU3RhdGVbXCJsYXlvdXRcIl0pIDogY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU2VuZCBjdXN0b20gY29waWVzIG9mIHRoZSBnaXZlbiBldmVudCB0byB0aGUgdmlld3MgKi9cclxuICAgIHB1YmxpYyBicm9hZGNhc3QgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IF9ldmVudC5kZXRhaWwgfHwge307XHJcbiAgICAgIGxldCB0YXJnZXQ6IFZpZXcgPSBkZXRhaWwudmlldztcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IHRoaXM7XHJcbiAgICAgIGZvciAobGV0IHZpZXcgb2YgdGhpcy52aWV3cylcclxuICAgICAgICBpZiAodmlldyAhPSB0YXJnZXQpIC8vIGRvbid0IHNlbmQgYmFjayB0byBvcmlnaW5hbCB0YXJnZXQgdmlld1xyXG4gICAgICAgICAgdmlldy5kaXNwYXRjaCg8RVZFTlRfRURJVE9SPl9ldmVudC50eXBlLCB7IGRldGFpbDogZGV0YWlsIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImxheW91dFwiXSA9IHRoaXMuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkVmlld0NvbXBvbmVudCA9IChfZXZlbnQ6IEV2ZW50RW1pdHRlci5CdWJibGluZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGFkanVzdG1lbnMgZm9yIEdvbGRlbkxheW91dCAyXHJcbiAgICAgIGxldCB0YXJnZXQ6IENvbXBvbmVudEl0ZW0gPSBfZXZlbnQudGFyZ2V0IGFzIENvbXBvbmVudEl0ZW07XHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Db21wb25lbnRJdGVtKSB7XHJcbiAgICAgICAgdGhpcy52aWV3cy5wdXNoKDxWaWV3PnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUT0RPOiBhZGRcclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxBbmltYXRpb24gZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5BTklNQVRJT05dOiBWaWV3QW5pbWF0aW9uLFxyXG4gICAgICAgIFtWSUVXLkFOSU1BVElPTl9TSEVFVF06IFZpZXdBbmltYXRpb25TaGVldFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJQcm9wZXJ0aWVzXCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OX1NIRUVUXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkFuaW1hdGlvbiB8IFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGl0ZXJhdGUgb3ZlciB2aWV3cyBhbmQgY29sbGVjdCB0aGVpciBzdGF0ZXMgZm9yIHJlY29uc3RydWN0aW9uXHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbj8ubmFtZTtcclxuICAgICAgICAgIGlmIChuYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlKFwiQW5pbWF0aW9uIHwgXCIgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgZ3JhcGggYW5kIG9mZmVycyBtZWFucyBmb3IgbWFuaXB1bGF0aW9uXHJcbiAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxHcmFwaCBleHRlbmRzIFBhbmVsIHtcclxuICAgICNncmFwaDogxpIuR3JhcGg7XHJcbiAgICAjbm9kZTogxpIuTm9kZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5SRU5ERVJdOiBWaWV3UmVuZGVyLFxyXG4gICAgICAgIFtWSUVXLkNPTVBPTkVOVFNdOiBWaWV3Q29tcG9uZW50cyxcclxuICAgICAgICBbVklFVy5ISUVSQVJDSFldOiBWaWV3SGllcmFyY2h5XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgICAgICB0aXRsZTogXCJSZW5kZXJcIlxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkhJRVJBUkNIWSxcclxuICAgICAgICAgICAgdGl0bGU6IFwiSGllcmFyY2h5XCJcclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5DT01QT05FTlRTLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJDb21wb25lbnRzXCJcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkdyYXBoXCIpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLnJlc3RvcmVHcmFwaCgpLnRoZW4oX2dyYXBoID0+IHtcclxuICAgICAgICBpZiAoX2dyYXBoKSB7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBfZ3JhcGgsIG5vZGU6IHRoaXMucmVzdG9yZU5vZGUoX2dyYXBoKSB9IH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSkge1xyXG4gICAgICAgICAgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShfc3RhdGVbXCJncmFwaFwiXSkudGhlbigoX2dyYXBoOiDGki5HcmFwaCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlOiDGki5Ob2RlID0gX3N0YXRlW1wibm9kZVwiXSAmJiDGki5Ob2RlLkZJTkQoX2dyYXBoLCBfc3RhdGVbXCJub2RlXCJdKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogX2dyYXBoLCBub2RlOiBub2RlIH0gfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIGlmICh0aGlzLiNncmFwaClcclxuICAgICAgICBzdGF0ZVtcImdyYXBoXCJdID0gdGhpcy4jZ3JhcGguaWRSZXNvdXJjZTtcclxuICAgICAgaWYgKHRoaXMuI25vZGUpXHJcbiAgICAgICAgc3RhdGVbXCJub2RlXCJdID0gxpIuTm9kZS5QQVRIX0ZST01fVE8odGhpcy4jZ3JhcGgsIHRoaXMuI25vZGUpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy52aWV3cy5maW5kKF92aWV3ID0+IF92aWV3IGluc3RhbmNlb2YgVmlld1JlbmRlcikuZG9tLmNvbnRhaW5zKDxOb2RlPl9ldmVudC50YXJnZXQpKSAvLyBhY2NlcHQgZHJvcCBvbmx5IGZyb20gcmVuZGVyIHZpZXdcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IHNvdXJjZSwgbm9kZTogdGhpcy5yZXN0b3JlTm9kZShzb3VyY2UpIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOiAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoZXNlIHR3byBzaG91bGQgYmUgc3RvcHBlZCBhc3dlbGxcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBjb25zdCBncmFwaDogxpIuR3JhcGggPSBkZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgICBpZiAoZ3JhcGggJiYgZ3JhcGggIT0gdGhpcy4jZ3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUdyYXBoKGdyYXBoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtncmFwaC50eXBlfSB8ICR7Z3JhcGgubmFtZX1gKTtcclxuICAgICAgICAgICAgdGhpcy4jZ3JhcGggPSBncmFwaDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IG5vZGU6IMaSLk5vZGUgPSBkZXRhaWwubm9kZTtcclxuICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgIT0gdGhpcy4jbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0aGlzLiNncmFwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuI25vZGUgPSBub2RlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBpZiAoZGV0YWlsLnZpZXcgIT0gdGhpcylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlR3JhcGgodGhpcy4jZ3JhcGgpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoICYmIHRoaXMuI25vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKHRoaXMuI2dyYXBoLCB0aGlzLiNub2RlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoLCBfc2VsZWN0ZWQ6IMaSLk5vZGUpOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWAsIMaSLk5vZGUuUEFUSF9GUk9NX1RPKF9ncmFwaCwgX3NlbGVjdGVkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoKTogxpIuTm9kZSB7XHJcbiAgICAgIGxldCBzZWxlY3RlZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWApO1xyXG4gICAgICByZXR1cm4gc2VsZWN0ZWQgJiYgxpIuTm9kZS5GSU5EKF9ncmFwaCwgc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmVHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgX2dyYXBoLmlkUmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVzdG9yZUdyYXBoKCk6IFByb21pc2U8xpIuR3JhcGg+IHtcclxuICAgICAgbGV0IGlkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuaWQpO1xyXG4gICAgICByZXR1cm4gaWQgJiYgPFByb21pc2U8xpIuR3JhcGg+PsaSLlByb2plY3QuZ2V0UmVzb3VyY2UoaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgaGVscCBhbmQgZG9jdW1lbnRhdGlvblxyXG4gICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjFcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbEhlbHAgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiSGVscFwiKTtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5kb20pO1xyXG4gICAgICAvLyBUT0RPOiBpZnJhbWUgc2FuZGJveCBkaXNhbGxvd3MgdXNlIG9mIHNjcmlwdHMsIHJlbW92ZSBvciByZXBsYWNlIHdpdGggb2JqZWN0IGlmIG5lY2Vzc2FyeVxyXG4gICAgICAvLyB0aGlzLmRvbS5pbm5lckhUTUwgPSBgPGlmcmFtZSBzcmM9XCJIZWxwLmh0bWxcIiBzYW5kYm94PjwvaWZyYW1lPmA7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IGA8b2JqZWN0IGRhdGE9XCJIZWxwLmh0bWxcIj48L29iamVjdD5gO1xyXG5cclxuICAgICAgLy8gY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgIC8vICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgLy8gICBpc0Nsb3NhYmxlOiB0cnVlLFxyXG4gICAgICAvLyAgIGNvbnRlbnQ6IFtcclxuICAgICAgLy8gICAgIHtcclxuICAgICAgLy8gICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgLy8gICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgIC8vICAgICAgIGNvbXBvbmVudFN0YXRlOiBfc3RhdGUsXHJcbiAgICAgIC8vICAgICAgIHRpdGxlOiBcIlJlbmRlclwiXHJcbiAgICAgIC8vICAgICB9XHJcbiAgICAgIC8vICAgXVxyXG4gICAgICAvLyB9O1xyXG5cclxuICAgICAgLy8gdGhpcy5nb2xkZW5MYXlvdXQuYWRkSXRlbUF0TG9jYXRpb24oY29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRPRE86IGFkZFxyXG4gICAqIEBhdXRob3JzIEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbFBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUEFSVElDTEVfU1lTVEVNLFxyXG4gICAgICAgICAgdGl0bGU6IMaSLlBhcnRpY2xlU3lzdGVtLm5hbWVcclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCB7IFtWSUVXLlBBUlRJQ0xFX1NZU1RFTV06IFZpZXdQYXJ0aWNsZVN5c3RlbSB9LCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKMaSLlBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgLy8gVE9ETzogaXRlcmF0ZSBvdmVyIHZpZXdzIGFuZCBjb2xsZWN0IHRoZWlyIHN0YXRlcyBmb3IgcmVjb25zdHJ1Y3Rpb25cclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheSB0aGUgcHJvamVjdCBzdHJ1Y3R1cmUgYW5kIG9mZmVyIGZ1bmN0aW9ucyBmb3IgY3JlYXRpb24sIGRlbGV0aW9uIGFuZCBhZGp1c3RtZW50IG9mIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwLSAyMDIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsUHJvamVjdCBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cnVjdG9ycyA9IHsgLyogZXNsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gICAgICAgIFtWSUVXLklOVEVSTkFMX1RBQkxFXTogVmlld0ludGVybmFsVGFibGUsXHJcbiAgICAgICAgW1ZJRVcuSU5URVJOQUxfRk9MREVSXTogVmlld0ludGVybmFsRm9sZGVyLFxyXG4gICAgICAgIFtWSUVXLkVYVEVSTkFMXTogVmlld0V4dGVybmFsLFxyXG4gICAgICAgIFtWSUVXLlBST1BFUlRJRVNdOiBWaWV3UHJvcGVydGllcyxcclxuICAgICAgICBbVklFVy5QUkVWSUVXXTogVmlld1ByZXZpZXcsXHJcbiAgICAgICAgW1ZJRVcuU0NSSVBUXTogVmlld1NjcmlwdFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJPUEVSVElFUyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJFVklFVyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJldmlld1wiXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5FWFRFUk5BTCxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJFeHRlcm5hbFwiXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuU0NSSVBULFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIlNjcmlwdFwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RhY2tcIixcclxuICAgICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSU5URVJOQUxfRk9MREVSLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmFsXCJcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5JTlRFUk5BTF9UQUJMRSxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJUYWJsZVwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpOyAvLyBUT0RPOiBleHBsYWluIHVzZSBvZiBkb2N1bWVudCAvLyByZW1vdmVkIGJlYWNhdXNlIHRoaXMga2VlcHMgdGhlIHBhbmVscyBhbGl2ZSBldmVuIHdoZW4gY2xvc2VkXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIlByb2plY3QgfCBcIiArIHByb2plY3QubmFtZSk7XHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KG5ldyBFZGl0b3JFdmVudChFVkVOVF9FRElUT1IuT1BFTiwge30pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5VUERBVEUgJiYgX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLkNSRUFURSAmJiBfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuREVMRVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5NT0RJRlkpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiUHJvamVjdCB8IFwiICsgcHJvamVjdC5uYW1lKTsgLy93aHkgaGVyZSBhbmQgZXZlcnl0aW1lP1xyXG4gICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5TRUxFQ1QpIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhIHBhcnRpY2xlIHN5c3RlbSBhdHRhY2hlZCB0byBhIG5vZGUuXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9LRVlTOiAoa2V5b2YgxpIuUGFydGljbGVEYXRhLlN5c3RlbSlbXSA9IFtcInZhcmlhYmxlc1wiLCBcIm10eExvY2FsXCIsIFwibXR4V29ybGRcIiwgXCJjb2xvclwiXTtcclxuXHJcbiAgICBwcml2YXRlIGNtcFBhcnRpY2xlU3lzdGVtOiDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHRvb2xiYXJJbnRlcnZhbElkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRpbWVTY2FsZVBsYXk6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuQ3VzdG9tVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPjtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgZXJyb3JzOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB2YXJpYWJsZXM6IEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0obnVsbCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGZvY3VzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgbGV0IHBvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSkpO1xyXG4gICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgaXRlbS5zdWJtZW51Lml0ZW1zLmZvckVhY2goX3N1Ykl0ZW0gPT4gX3N1Ykl0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgICBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZU1xyXG4gICAgICAgICAgLmZpbHRlcihfdmFsdWUgPT4gIU9iamVjdC5rZXlzKGZvY3VzKS5pbmNsdWRlcyhfdmFsdWUpKVxyXG4gICAgICAgICAgLmZvckVhY2goX2xhYmVsID0+IGl0ZW0uc3VibWVudS5pdGVtcy5maW5kKF9pdGVtID0+IF9pdGVtLmxhYmVsID09IF9sYWJlbCkudmlzaWJsZSA9IHRydWUpO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS52YXJpYWJsZXMgfHwgZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTikpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS5tdHhMb2NhbCB8fCBmb2N1cyA9PSB0aGlzLmRhdGEubXR4V29ybGQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgIT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9wdXApXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUztcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgUHJvcGVydHlcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSksXHJcbiAgICAgICAgc3VibWVudTogZ2VuZXJhdGVTdWJNZW51KG9wdGlvbnMsIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIFZhbHVlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIEZ1bmN0aW9uXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIENvZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBUcmFuc2Zvcm1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSxcclxuICAgICAgICBzdWJtZW51OiBnZW5lcmF0ZVN1Yk1lbnUoW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0sIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdWJNZW51KF9vcHRpb25zOiBzdHJpbmdbXSwgX2lkOiBzdHJpbmcsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIF9vcHRpb25zLmZvckVhY2goX29wdGlvbiA9PiB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBfb3B0aW9uLCBpZDogX2lkLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAgICAgc3VibWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdWJtZW51O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBmb2N1czogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZTtcclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFk6XHJcbiAgICAgICAgICBjaGlsZCA9IFtdO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IHZhbHVlOiAxIH07XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT046XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgZnVuY3Rpb246IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTi5BRERJVElPTiwgcGFyYW1ldGVyczogW10gfTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IGNvZGU6IFwiMVwiIH07XHJcblxyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpXHJcbiAgICAgICAgICAgIGZvY3VzLnBhcmFtZXRlcnMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvY3VzW19pdGVtLmxhYmVsXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICBpZiAoX2l0ZW0ubGFiZWwgPT0gXCJ2YXJpYWJsZXNcIilcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZXMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5wdXNoKHRoaXMuY29udHJvbGxlci5nZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuY29sb3IucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGlsZFRvUGFyZW50LnNldChjaGlsZCwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OOlxyXG4gICAgICAgICAgY2hpbGQgPSB7IHRyYW5zZm9ybWF0aW9uOiA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2l0ZW0ubGFiZWwsIHBhcmFtZXRlcnM6IFtdIH07XHJcbiAgICAgICAgICAoPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltdPmZvY3VzKS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hpbGRUb1BhcmVudC5zZXQoY2hpbGQsIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBOlxyXG4gICAgICAgICAgbGV0IHJlbW92ZTogxpIuU2VyaWFsaXphdGlvbltdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5kZWxldGUocmVtb3ZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSk/LnBhcnRpY2xlU3lzdGVtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtID0gPMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtPig8xpIuTm9kZT5fdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXSkuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFBhcnRpY2xlU3lzdGVtKTtcclxuICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGU7XHJcbiAgICAgIHRoaXMuc2V0VGltZSgwKTtcclxuICAgICAgdGhpcy5zZXRQYXJ0aWNsZVN5c3RlbSh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnBhcnRpY2xlU3lzdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnRvb2xiYXJJbnRlcnZhbElkKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgICAgICB0aGlzLmVuYWJsZVNhdmUodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMCAmJiBfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuUyAmJiBfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgxpJ1aS5XYXJuaW5nLmRpc3BsYXkodGhpcy5lcnJvcnMubWFwKChbX2RhdGEsIF9lcnJvcl0pID0+IF9lcnJvciksIFwiVW5hYmxlIHRvIHNhdmVcIiwgYFByb2plY3QgY2FuJ3QgYmUgc2F2ZWQgd2hpbGUgaGF2aW5nIHVucmVzb2x2ZWQgZXJyb3JzYCwgXCJPS1wiKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShfZXZlbnQuZGV0YWlsLmRhdGEpPy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ1JFQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkRST1A6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkNVVDogLy8gVE9ETzogY3VzdG9tcyB0cmVlcyBjdXQgaXMgYXN5bmMsIHRoaXMgc2hvdWxkIGhhcHBlbiBhZnRlciBjdXQgaXMgZmluaXNoZWRcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hWYXJpYWJsZXMoKTtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgICAgbGV0IGludmFsaWQ6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gdGhpcy52YWxpZGF0ZURhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoX2Vycm9yID0+ICFpbnZhbGlkLmluY2x1ZGVzKF9lcnJvcikpXHJcbiAgICAgICAgICAgIC5tYXAoKFtfZGF0YV0pID0+IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSkpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKF9pdGVtID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIV9pdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgX2l0ZW0uY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIik7XHJcbiAgICAgICAgICAgICAgX2l0ZW0udGl0bGUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzID0gaW52YWxpZDtcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCAmJiBfZXZlbnQudHlwZSAhPSDGknVpLkVWRU5ULkVYUEFORCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLmRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpOyAvLyBvdXIgd29ya2luZyBjb3B5IHNob3VsZCBvbmx5IGJlIHVzZWQgaWYgaXQgaXMgdmFsaWQgXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5mb3JFYWNoKChbX2RhdGEsIF9lcnJvcl0pID0+IHtcclxuICAgICAgICAgICAgICBsZXQgaXRlbTogxpJ1aS5DdXN0b21UcmVlSXRlbTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZShfZGF0YSk7XHJcbiAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKTtcclxuICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gX2Vycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZW5hYmxlU2F2ZSh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiB0b29sYmFyXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRvb2xiYXIoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudG9vbGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMudG9vbGJhci5pZCA9IFwidG9vbGJhclwiO1xyXG4gICAgICB0aGlzLnRvb2xiYXIudGl0bGUgPSBcIuKXjyBDb250cm9sIHRoZSBwbGF5YmFjayBvZiB0aGUgc2VsZWN0ZWQgcGFydGljbGUgc3lzdGVtXFxu4pePIFJpZ2h0IGNsaWNrIHJlbmRlciB2aWV3IHRvIGFjdGl2YXRlIGNvbnRpbm91cyByZW5kZXJpbmdcIjtcclxuXHJcbiAgICAgIGxldCBidXR0b25zOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGJ1dHRvbnMuaWQgPSBcImJ1dHRvbnNcIjtcclxuICAgICAgW1wiYmFja3dhcmRcIiwgXCJwbGF5XCIsIFwiZm9yd2FyZFwiXVxyXG4gICAgICAgIC5tYXAoX2lkID0+IHtcclxuICAgICAgICAgIGxldCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5pZCA9IF9pZDtcclxuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uSWNvblwiKTtcclxuICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGltZVNjYWxlOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZTtcclxuICAgICAgICAgICAgc3dpdGNoICgoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuaWQpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwiYmFja3dhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSAtPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlID0gdGhpcy50aW1lU2NhbGVQbGF5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSB0aW1lU2NhbGU7XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcImZvcndhcmRcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSArPSAwLjI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGUpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IGJ1dHRvbnMuYXBwZW5kQ2hpbGQoX2J1dHRvbikpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNjYWxlU3RlcHBlcjogxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlciA9IG5ldyDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKHsga2V5OiBcInRpbWVTY2FsZVwiLCBsYWJlbDogXCJ0aW1lU2NhbGVcIiB9KTtcclxuICAgICAgdGltZVNjYWxlU3RlcHBlci5pZCA9IFwidGltZXNjYWxlXCI7XHJcbiAgICAgIHRpbWVTY2FsZVN0ZXBwZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWVTY2FsZSh0aW1lU2NhbGVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTY2FsZVN0ZXBwZXIpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTdGVwcGVyOiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyID0gbmV3IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIoeyBrZXk6IFwidGltZVwiLCBsYWJlbDogXCJ0aW1lXCIsIHZhbHVlOiBcIjBcIiB9KTtcclxuICAgICAgdGltZVN0ZXBwZXIuaWQgPSBcInRpbWVcIjtcclxuICAgICAgdGltZVN0ZXBwZXIudGl0bGUgPSBcIlRoZSB0aW1lIChpbiBzZWNvbmRzKSBvZiB0aGUgcGFydGljbGUgc3lzdGVtXCI7XHJcbiAgICAgIHRpbWVTdGVwcGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWVTdGVwcGVyLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTdGVwcGVyKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU2xpZGVyU3RlcHM6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGltZVNsaWRlclN0ZXBzLmlkID0gXCJ0aW1lc2xpZGVyc3RlcHNcIjtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXJTdGVwcyk7XHJcblxyXG4gICAgICBsZXQgdGltZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGltZVNsaWRlci5pZCA9IFwidGltZXNsaWRlclwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgdGltZVNsaWRlci5tYXggPSBcIjFcIjtcclxuICAgICAgdGltZVNsaWRlci5zdGVwID0gXCJhbnlcIjtcclxuICAgICAgdGltZVNsaWRlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZShwYXJzZUZsb2F0KHRpbWVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKHRpbWVTbGlkZXIpO1xyXG5cclxuICAgICAgdGhpcy50b29sYmFySW50ZXJ2YWxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY21wUGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICAgIGxldCB0aW1lSW5TZWNvbmRzOiBudW1iZXIgPSB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWUgLyAxMDAwO1xyXG4gICAgICAgICAgdGltZVNjYWxlU3RlcHBlci5zZXRNdXRhdG9yVmFsdWUodGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGUpO1xyXG4gICAgICAgICAgdGltZVN0ZXBwZXIuc2V0TXV0YXRvclZhbHVlKHRpbWVJblNlY29uZHMpO1xyXG5cclxuICAgICAgICAgIGxldCBkdXJhdGlvbjogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS5kdXJhdGlvbiAvIDEwMDA7XHJcbiAgICAgICAgICBpZiAocGFyc2VGbG9hdCh0aW1lU2xpZGVyLm1heCkgIT0gZHVyYXRpb24gKiAxLjEpIHsgLy8gdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAgICAgICAgdGltZVNsaWRlci5tYXggPSAoZHVyYXRpb24gKiAxLjEpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRpbWVTbGlkZXJTdGVwcy5pbm5lckhUTUwgPSBbMCwgMC4yNSwgMC41LCAwLjc1LCAxXVxyXG4gICAgICAgICAgICAgIC5tYXAoX2ZhY3RvciA9PiBkdXJhdGlvbiAqIF9mYWN0b3IpXHJcbiAgICAgICAgICAgICAgLm1hcChfdmFsdWUgPT4gYDxzcGFuIGRhdGEtbGFiZWw9XCIke192YWx1ZS50b0ZpeGVkKDIpfVwiPjwvc3Bhbj5gKS5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGltZVNsaWRlci52YWx1ZSA9IHRpbWVJblNlY29uZHMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUaW1lKF90aW1lSW5TZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZXRUaW1lU2NhbGUoMCk7XHJcbiAgICAgIHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZSA9IF90aW1lSW5TZWNvbmRzICogMTAwMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFRpbWVTY2FsZShfdGltZVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX3RpbWVTY2FsZSA9IHBhcnNlRmxvYXQoX3RpbWVTY2FsZS50b0ZpeGVkKDE1KSk7IC8vIHJvdW5kIHNvIGZvcndhcmQgYW5kIGJhY2t3YXJkIGJ1dHRvbiBkb24ndCBtaXNzIHplcm9cclxuICAgICAgaWYgKF90aW1lU2NhbGUgIT0gMClcclxuICAgICAgICB0aGlzLnRpbWVTY2FsZVBsYXkgPSBfdGltZVNjYWxlO1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWVTY2FsZSA9IF90aW1lU2NhbGU7XHJcblxyXG4gICAgICBsZXQgcGxheUJ1dHRvbjogRWxlbWVudCA9IHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BsYXlcIikgfHwgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIik7XHJcbiAgICAgIHBsYXlCdXR0b24uaWQgPSBfdGltZVNjYWxlID09IDAgPyBcInBsYXlcIiA6IFwicGF1c2VcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHNldFBhcnRpY2xlU3lzdGVtKF9wYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0pOiB2b2lkIHtcclxuICAgICAgaWYgKCFfcGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMudHJlZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgcGFydGljbGUgc3lzdGVtIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IF9wYXJ0aWNsZVN5c3RlbTtcclxuICAgICAgdGhpcy5kYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShfcGFydGljbGVTeXN0ZW0uZGF0YSkpOyAvLyB3ZSB3aWxsIHdvcmsgd2l0aCBhIGNvcHlcclxuICAgICAgdGhpcy5zZXRUaXRsZSh0aGlzLnBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKTtcclxuICAgICAgdGhpcy52YXJpYWJsZXMuaWQgPSBcInZhcmlhYmxlc1wiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZhcmlhYmxlcyk7XHJcbiAgICAgIHRoaXMucmVmcmVzaFZhcmlhYmxlcygpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbSh0aGlzLmRhdGEsIHRoaXMpO1xyXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgxpJ1aS5DdXN0b21UcmVlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+KHRoaXMuY29udHJvbGxlciwgdGhpcy5kYXRhKTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ1VULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5QQVNURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGDil48gUmlnaHQgY2xpY2sgb24gXCIke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9XCIgdG8gYWRkIHByb3BlcnRpZXMuXFxu4pePIFJpZ2h0IGNsaWNrIG9uIHByb3BlcnRpZXMgdG8gYWRkIHRyYW5zZm9ybWF0aW9ucy9leHByZXNzaW9ucy5cXG7il48gUmlnaHQgY2xpY2sgb24gdHJhbnNmb3JtYXRpb25zL2V4cHJlc3Npb25zIHRvIGFkZCBleHByZXNzaW9ucy5cXG7il48gVXNlIENvcHkvQ3V0L1Bhc3RlIHRvIGR1cGxpY2F0ZSBkYXRhLmA7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IHRoaXMuZG9tLnRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10ge1xyXG4gICAgICBsZXQgaW52YWxpZDogW8aSLlBhcnRpY2xlRGF0YS5FeHByZXNzaW9uLCBzdHJpbmddW10gPSBbXTtcclxuICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gaW52YWxpZDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVjdXJzaXZlKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfcGF0aDogc3RyaW5nW10gPSBbXSk6IHZvaWQge1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICAgIGxldCBtaW5QYXJhbWV0ZXJzOiBudW1iZXIgPSDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT05fTUlOSU1VTV9QQVJBTUVURVJTW19kYXRhLmZ1bmN0aW9uXTtcclxuICAgICAgICAgIGlmIChfZGF0YS5wYXJhbWV0ZXJzLmxlbmd0aCA8IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTl9NSU5JTVVNX1BBUkFNRVRFUlNbX2RhdGEuZnVuY3Rpb25dKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvcjogc3RyaW5nID0gYFwiJHtfcGF0aC5qb2luKFwiL1wiKX0vJHtfZGF0YS5mdW5jdGlvbn1cIiBuZWVkcyBhdCBsZWFzdCAke21pblBhcmFtZXRlcnN9IHBhcmFtZXRlcnNgO1xyXG4gICAgICAgICAgICBpbnZhbGlkLnB1c2goW19kYXRhLCBlcnJvcl0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpID8gX2RhdGEucGFyYW1ldGVycyA6IF9kYXRhKS5mb3JFYWNoKChbX2tleSwgX3ZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBfdmFsdWUgPT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgdmFsaWRhdGVSZWN1cnNpdmUoX3ZhbHVlLCBfcGF0aC5jb25jYXQoX2tleSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVTYXZlKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICByZW1vdGUuTWVudS5nZXRBcHBsaWNhdGlvbk1lbnUoKS5nZXRNZW51SXRlbUJ5SWQoTUVOVS5QUk9KRUNUX1NBVkUpLmVuYWJsZWQgPSBfb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWZyZXNoVmFyaWFibGVzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVMpO1xyXG4gICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlcylcclxuICAgICAgICBvcHRpb25zLnB1c2goLi4udGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMpO1xyXG4gICAgICB0aGlzLnZhcmlhYmxlcy5pbm5lckhUTUwgPSBvcHRpb25zLm1hcChfbmFtZSA9PiBgPG9wdGlvbiB2YWx1ZT1cIiR7X25hbWV9XCI+YCkuam9pbihcIlwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCB0aGUgYW5pbWF0YWJsZSBwcm9wZXJ0aWVzIG9mIGEgbm9kZSB3aXRoIGFuIGF0dGFjaGVkIGNvbXBvbmVudCBhbmltYXRpb24uXHJcbiAgICogQGF1dGhvcnMgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKb25hcyBQbG90emt5LCBIRlUsIDIwMjIgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwdWJsaWMga2V5U2VsZWN0ZWQ6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgbm9kZTogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgY21wQW5pbWF0b3I6IMaSLkNvbXBvbmVudEFuaW1hdG9yO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlckFuaW1hdGlvbjtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBmcmFtZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgdGltZTogxpIuVGltZSA9IG5ldyDGki5UaW1lKCk7XHJcbiAgICBwcml2YXRlIGlkSW50ZXJ2YWw6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldEFuaW1hdGlvbihudWxsKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULklOUFVULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkZPQ1VTX0lOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkgfHwgIShzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlKSB8fCAhc291cmNlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogPMaSLk5vZGU+c291cmNlIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoaXMubm9kZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgICAgbGFiZWw6IFwiQWRkIFByb3BlcnR5XCIsXHJcbiAgICAgICAgICBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KHRoaXMubm9kZSwgcGF0aCwgX2NhbGxiYWNrKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZSBQcm9wZXJ0eVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QUk9QRVJUWSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDb252ZXJ0IHRvIEFuaW1hdGlvblwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNPTlZFUlRfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiQ1wiIH0pO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZOlxyXG4gICAgICAgICAgLy8gZGVmaW5lZCBpbiBnZXRNdXRhdG9yU3VibWVudSwgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSB3YXkgdG8ga2VlcCB0aGUgcGF0aCBhc3NvY2lhdGVkIHdpdGggdGhlIG1lbnUgaXRlbSwgYXR0YWNoaW5nIGFueXRoaW5nIHRvIGl0ZW1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX1BST1BFUlRZOlxyXG4gICAgICAgICAgaWYgKCEoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRlbGV0ZVByb3BlcnR5KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DT05WRVJUX0FOSU1BVElPTjpcclxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNwcml0ZSkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbi5jb252ZXJ0VG9BbmltYXRpb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYW5pbWF0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm9kZVN1Ym1lbnUoX25vZGU6IMaSLk5vZGUsIF9wYXRoOiBzdHJpbmdbXSwgX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgZm9yIChjb25zdCBjb21wb25lbnRDbGFzcyBvZiDGki5Db21wb25lbnQuc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIF9ub2RlLmdldENvbXBvbmVudHMoY29tcG9uZW50Q2xhc3MpLmZvckVhY2goKF9jb21wb25lbnQsIF9pbmRleCkgPT4geyAvLyB3ZSBuZWVkIHRvIGdldCB0aGUgYXR0YWNoZWQgY29tcG9ubmVudHMgYXMgYXJyYXkgc28gd2UgY2FuIHJlY29uc3R1Y3QgdGhlaXIgcGF0aFxyXG4gICAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICAgIHBhdGgucHVzaChfY29tcG9uZW50LnR5cGUpO1xyXG4gICAgICAgICAgcGF0aC5wdXNoKF9pbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX2NvbXBvbmVudC5nZXRNdXRhdG9yRm9yQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAobXV0YXRvciAmJiBPYmplY3Qua2V5cyhtdXRhdG9yKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgICAgeyBsYWJlbDogX2NvbXBvbmVudC50eXBlLCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KG11dGF0b3IsIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBfbm9kZS5nZXRDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChcImNoaWxkcmVuXCIpO1xyXG4gICAgICAgIHBhdGgucHVzaChjaGlsZC5uYW1lKTtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICB7IGxhYmVsOiBjaGlsZC5uYW1lLCBzdWJtZW51OiB0aGlzLmdldE5vZGVTdWJtZW51KGNoaWxkLCBwYXRoLCBfY2FsbGJhY2spIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfcGF0aDogc3RyaW5nW10sIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gT2JqZWN0LmFzc2lnbihbXSwgX3BhdGgpO1xyXG4gICAgICAgIHBhdGgucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKF9tdXRhdG9yW3Byb3BlcnR5XT8uY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHsgbGFiZWw6IHByb3BlcnR5LCBzdWJtZW51OiB0aGlzLmdldE11dGF0b3JTdWJtZW51KF9tdXRhdG9yW3Byb3BlcnR5XSwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiBwcm9wZXJ0eSwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUFJPUEVSVFkpLCBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZFByb3BlcnR5KHBhdGgsIHRoaXMubm9kZSwgdGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUb29sYmFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRvb2xiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuaWQgPSBcInRvb2xiYXJcIjtcclxuXHJcbiAgICAgIFtcInByZXZpb3VzXCIsIFwicGxheVwiLCBcIm5leHRcIl1cclxuICAgICAgICAubWFwKF9pZCA9PiB7XHJcbiAgICAgICAgICBsZXQgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICBidXR0b24uaWQgPSBfaWQ7XHJcbiAgICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidXR0b25JY29uXCI7XHJcbiAgICAgICAgICBidXR0b24ub25jbGljayA9IHRoaXMuaG5kVG9vbGJhckNsaWNrO1xyXG4gICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKF9idXR0b24gPT4gdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKF9idXR0b24pKTtcclxuXHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQubWluID0gXCIwXCI7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC5pZCA9IFwiZnJhbWVpbnB1dFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChfZXZlbnQ6IElucHV0RXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IE51bWJlci5wYXJzZUludCh0aGlzLmZyYW1lSW5wdXQudmFsdWUpICogMTAwMCAvIHRoaXMuYW5pbWF0aW9uLmZwcztcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aGlzLmZyYW1lSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVNlbGVjdGVkID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLm5vZGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuY21wQW5pbWF0b3IgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudEFuaW1hdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbXBBbmltYXRvcj8uYW5pbWF0aW9uICE9IHRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5tdXRhYmxlIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW5pbWF0b3IpIHtcclxuICAgICAgICAgICAgLy8gc3dpdGNoZWQgYW5pbWF0aW9uIGluIGEgQ29tcG9uZW50QW5pbWF0b3JcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZSA9PSBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSlcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IG5vZGU6IF9ldmVudC5kZXRhaWwubXV0YWJsZS5ub2RlIH0gfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb24gfHwgX2V2ZW50LmRldGFpbC52aWV3IGluc3RhbmNlb2YgVmlld0FuaW1hdGlvblNoZWV0KSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldClcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG5cclxuICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuZnJhbWVJbnB1dC52YWx1ZSA9IChNYXRoLnRydW5jKHRoaXMucGxheWJhY2tUaW1lIC8gMTAwMCAqIHRoaXMuYW5pbWF0aW9uLmZwcykpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICBsZXQgbm9kZU11dGF0b3I6IMaSLk11dGF0b3IgPSB0aGlzLmNtcEFuaW1hdG9yPy51cGRhdGVBbmltYXRpb24odGhpcy5wbGF5YmFja1RpbWUpIHx8IHt9O1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyPy51cGRhdGUobm9kZU11dGF0b3IsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5JTlBVVDpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuRk9DVVNfSU46XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudERpZ2l0KVxyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci51cGRhdGVTZXF1ZW5jZSh0aGlzLnBsYXliYWNrVGltZSwgdGFyZ2V0LCBfZXZlbnQudHlwZSA9PSDGknVpLkVWRU5ULklOUFVUKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRBbmltYXRpb24oX2FuaW1hdGlvbjogxpIuQW5pbWF0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmIChfYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5TGlzdCgpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiRHJvcCBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBhbmltYXRpb24gaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnR5TGlzdCgpOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5hbmltYXRpb24uZ2V0U3RhdGUodGhpcy5wbGF5YmFja1RpbWUsIDAsIHRoaXMuY21wQW5pbWF0b3IucXVhbnRpemF0aW9uKSB8fCB7fTtcclxuXHJcbiAgICAgIGxldCBuZXdQcm9wZXJ0eUxpc3Q6IEhUTUxEaXZFbGVtZW50ID0gxpJ1aS5HZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3Iobm9kZU11dGF0b3IpO1xyXG4gICAgICBpZiAodGhpcy5kb20uY29udGFpbnModGhpcy5wcm9wZXJ0eUxpc3QpKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlcGxhY2VDaGlsZChuZXdQcm9wZXJ0eUxpc3QsIHRoaXMucHJvcGVydHlMaXN0KTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld1Byb3BlcnR5TGlzdCk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0ID0gbmV3UHJvcGVydHlMaXN0O1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5pZCA9IFwicHJvcGVydHlsaXN0XCI7XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlckFuaW1hdGlvbih0aGlzLmFuaW1hdGlvbiwgdGhpcy5wcm9wZXJ0eUxpc3QsIHRoaXMpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlKG5vZGVNdXRhdG9yKTtcclxuICAgICAgLy8gxpJ1aS1FVkVOVCBtdXN0IG5vdCBiZSBkaXNwYXRjaGVkIVxyXG4gICAgICAvLyB0aGlzLmRvbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCjGknVpLkVWRU5ULkNMSUNLKSk7XHJcbiAgICAgIHRoaXMucHJvcGVydHlMaXN0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5UX0VESVRPUi5NT0RJRlkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5wbGF5YmFja1RpbWUgfSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvb2xiYXJDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAodGFyZ2V0LmlkKSB7XHJcbiAgICAgICAgY2FzZSBcInByZXZpb3VzXCI6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuY29udHJvbGxlci5uZXh0S2V5KHRoaXMucGxheWJhY2tUaW1lLCBcImJhY2t3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheVwiOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5pZCA9IFwicGF1c2VcIjtcclxuICAgICAgICAgICAgdGhpcy50aW1lLnNldCh0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnRpbWUuZ2V0KCkgJSB0aGlzLmFuaW1hdGlvbi50b3RhbFRpbWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBhdXNlXCI6XHJcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwibmV4dFwiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJmb3J3YXJkXCIpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhdXNlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pZEludGVydmFsID09IG51bGwpIHJldHVybjtcclxuICAgICAgdGhpcy50b29sYmFyLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2VcIikuaWQgPSBcInBsYXlcIjtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZW51bSBTSEVFVF9NT0RFIHtcclxuICAgIERPUEUgPSBcIkRvcGVzaGVldFwiLFxyXG4gICAgQ1VSVkVTID0gXCJDdXJ2ZXNcIlxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBWaWV3QW5pbWF0aW9uU2VxdWVuY2Uge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uU2VxdWVuY2U7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgaW50ZXJmYWNlIFZpZXdBbmltYXRpb25LZXkge1xyXG4gICAgZGF0YTogxpIuQW5pbWF0aW9uS2V5O1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJrZXlcIjtcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uRXZlbnQgeyAvLyBsYWJlbHMgYW5kIGV2ZW50cyBhcmUgaW1wbGVtZW50ZWQgYWxtb3N0IHRoZSBzYW1lIHdheVxyXG4gICAgZGF0YTogc3RyaW5nO1xyXG4gICAgcGF0aDJEOiBQYXRoMkQ7XHJcbiAgICB0eXBlOiBcImV2ZW50XCIgfCBcImxhYmVsXCI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWaWV3IGFuZCBlZGl0IGFuaW1hdGlvbiBzZXF1ZW5jZXMsIGFuaW1hdGlvbiBrZXlzIGFuZCBjdXJ2ZXMgY29ubmVjdGluZyB0aGVtLlxyXG4gICAqIEBhdXRob3JzIEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdBbmltYXRpb25TaGVldCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgS0VZX1NJWkU6IG51bWJlciA9IDY7IC8vIHdpZHRoIGFuZCBoZWlnaHQgaW4gcHhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRJTUVMSU5FX0hFSUdIVDogbnVtYmVyID0gMzAuNTsgLy8gaW4gcHgsIGtlZXAgLjUgYXQgZW5kIGZvciBvZGQgbGluZSB3aWR0aFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVZFTlRTX0hFSUdIVDogbnVtYmVyID0gMzA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTQ0FMRV9XSURUSDogbnVtYmVyID0gNDA7IC8vIGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQSVhFTF9QRVJfTUlMTElTRUNPTkQ6IG51bWJlciA9IDE7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX1ZBTFVFOiBudW1iZXIgPSAxMDA7IC8vIGF0IHNjYWxpbmcgMVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTUlOSU1VTV9QSVhFTF9QRVJfU1RFUDogbnVtYmVyID0gNjA7IC8vIGF0IGFueSBzY2FsaW5nLCBmb3IgYm90aCB4IGFuZCB5XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF9BTklNQVRJT05fTEVOR1RIOiBudW1iZXIgPSAxMDAwOyAvLyBpbiBtaWxpc2Vjb25kcywgdXNlZCB3aGVuIGFuaW1hdGlvbiBsZW5ndGggaXMgZmFsc3lcclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBwbGF5YmFja1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHByaXZhdGUgY3JjMjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgcHJpdmF0ZSBldmVudElucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgcHJpdmF0ZSBzY3JvbGxDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQm9keTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcHJpdmF0ZSBtdHhXb3JsZFRvU2NyZWVuOiDGki5NYXRyaXgzeDMgPSBuZXcgxpIuTWF0cml4M3gzKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZEtleTogVmlld0FuaW1hdGlvbktleTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50O1xyXG4gICAgcHJpdmF0ZSBrZXlzOiBWaWV3QW5pbWF0aW9uS2V5W10gPSBbXTtcclxuICAgIHByaXZhdGUgc2VxdWVuY2VzOiBWaWV3QW5pbWF0aW9uU2VxdWVuY2VbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBldmVudHM6IFZpZXdBbmltYXRpb25FdmVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHNsb3BlSG9va3M6IFBhdGgyRFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBkb2N1bWVudFN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcclxuXHJcbiAgICBwcml2YXRlIHBvc1BhblN0YXJ0OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoKTtcclxuICAgIHByaXZhdGUgcG9zUmlnaHRDbGljazogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcblxyXG4gICAgI21vZGU6IFNIRUVUX01PREU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIC8vIG1heWJlIHVzZSB0aGlzIHNvbHV0aW9uIGZvciBhbGwgdmlld3M/XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5pbnNldCA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUucGFkZGluZyA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5tYXJnaW4gPSBcIjAuNWVtXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuXHJcbiAgICAgIHRoaXMubW9kZSA9IFNIRUVUX01PREUuRE9QRTtcclxuXHJcbiAgICAgIF9jb250YWluZXIub24oXCJyZXNpemVcIiwgKCkgPT4gdGhpcy5kcmF3KHRydWUpKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudVNoZWV0KTtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcblxyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLm92ZXJmbG93WCA9IFwic2Nyb2xsXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJpbnN0YW50XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcmRvd24gPSB0aGlzLmhuZFBvaW50ZXJEb3duO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJ1cCA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJsZWF2ZSA9IHRoaXMuaG5kUG9pbnRlclVwO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbndoZWVsID0gdGhpcy5obmRXaGVlbDtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxDb250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxCb2R5LnN0eWxlLmhlaWdodCA9IFwiMXB4XCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQm9keSk7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5ldmVudElucHV0Lm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwiZXZlbnRcIikge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmV2ZW50c1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5yZW1vdmVFdmVudCh0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudCh0aGlzLmV2ZW50SW5wdXQudmFsdWUsIHRpbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuZXZlbnRJbnB1dC52YWx1ZV0gPSB0aW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSA9IHRoaXMuZXZlbnRJbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5ldmVudElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBtb2RlKCk6IFNIRUVUX01PREUge1xyXG4gICAgICByZXR1cm4gdGhpcy4jbW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBtb2RlKF9tb2RlOiBTSEVFVF9NT0RFKSB7XHJcbiAgICAgIHRoaXMuI21vZGUgPSBfbW9kZTtcclxuICAgICAgdGhpcy5zZXRUaXRsZShfbW9kZSk7XHJcbiAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51U2hlZXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAmJiB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA8IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCkgeyAvLyBjbGljayBvbiBldmVudHNcclxuICAgICAgICBsZXQgZGVsZXRlRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmIChkZWxldGVFdmVudCkge1xyXG4gICAgICAgICAgaWYgKGRlbGV0ZUV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkRlbGV0ZSBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldEV2ZW50XCIsIGRlbGV0ZUV2ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgTGFiZWxcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChcIkFkZCBFdmVudFwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiLCB0aGlzLnNjcmVlblRvVGltZSh0aGlzLnBvc1JpZ2h0Q2xpY2sueCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wb3NSaWdodENsaWNrLnkgPiBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gdGhpcy5rZXlzLmZpbmQoX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgdGhpcy5wb3NSaWdodENsaWNrLngsIHRoaXMucG9zUmlnaHRDbGljay55KSk7XHJcbiAgICAgICAgaWYgKHRhcmdldEtleSkge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgS2V5XCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIiwgdGFyZ2V0S2V5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU0hFRVRfTU9ERS5ET1BFKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuRE9QRTtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuQ1VSVkVTKS52aXNpYmxlID0gdGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShfZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG5cclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkRPUEUsIGxhYmVsOiBTSEVFVF9NT0RFLkRPUEUsIGNsaWNrOiAoKSA9PiB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEUgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBTSEVFVF9NT0RFLkNVUlZFUywgbGFiZWw6IFNIRUVUX01PREUuQ1VSVkVTLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5DVVJWRVMgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkFkZCBFdmVudFwiLCBsYWJlbDogXCJBZGQgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEV2ZW50XCIsIGxhYmVsOiBcIkRlbGV0ZSBFdmVudFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgTGFiZWxcIiwgbGFiZWw6IFwiQWRkIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBMYWJlbFwiLCBsYWJlbDogXCJEZWxldGUgTGFiZWxcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiRGVsZXRlIEtleVwiLCBsYWJlbDogXCJEZWxldGUgS2V5XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBjaG9pY2U6IHN0cmluZyA9IF9pdGVtLmlkO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRLZXlcIik7XHJcbiAgICAgIGxldCB0YXJnZXRFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiKTtcclxuICAgICAgbGV0IHRhcmdldFRpbWU6IG51bWJlciA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0VGltZVwiKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBcIkFkZCBFdmVudFwiOlxyXG4gICAgICAgICAgbGV0IGV2ZW50TmFtZTogc3RyaW5nID0gYCR7dGhpcy5hbmltYXRpb24ubmFtZX1FdmVudCR7T2JqZWN0LmtleXModGhpcy5hbmltYXRpb24uZXZlbnRzKS5sZW5ndGh9YDtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KGV2ZW50TmFtZSwgdGFyZ2V0VGltZSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGV2ZW50TmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBFdmVudFwiOlxyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGFyZ2V0RXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBZGQgTGFiZWxcIjpcclxuICAgICAgICAgIGxldCBsYWJlbE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9TGFiZWwke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxOYW1lXSA9IHRhcmdldFRpbWU7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB7IGRhdGE6IGxhYmVsTmFtZSwgcGF0aDJEOiBudWxsLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBMYWJlbFwiOlxyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0YXJnZXRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRlbGV0ZSBLZXlcIjpcclxuICAgICAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSB0aGlzLnNlcXVlbmNlcy5maW5kKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkuaW5jbHVkZXModGFyZ2V0S2V5LmRhdGEpKS5kYXRhO1xyXG4gICAgICAgICAgaWYgKHNlcXVlbmNlLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgxpIuRGVidWcud2FybihcIk9ubHkgb25lIGtleSBsZWZ0IGluIHNlcXVlbmNlLiBEZWxldGUgcHJvcGVydHkgaW5zdGVhZC5cIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VxdWVuY2UucmVtb3ZlS2V5KHRhcmdldEtleS5kYXRhKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiBkcmF3aW5nXHJcbiAgICBwcml2YXRlIGRyYXcoX3Njcm9sbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kb20uY2xpZW50V2lkdGg7XHJcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuZG9tLmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgubWluKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCwgdHJhbnNsYXRpb24ueCk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uO1xyXG5cclxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUtleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaW1lbGluZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0V2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd1NjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Q3VydmVzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3S2V5cygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd0hpZ2hsaWdodCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX3Njcm9sbCkge1xyXG4gICAgICAgIGxldCBsZWZ0V2lkdGg6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSDtcclxuICAgICAgICBsZXQgc2NyZWVuV2lkdGg6IG51bWJlciA9IHRoaXMuY2FudmFzLndpZHRoICsgbGVmdFdpZHRoO1xyXG4gICAgICAgIGxldCBhbmltYXRpb25XaWR0aDogbnVtYmVyID0gdGhpcy5hbmltYXRpb24/LnRvdGFsVGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggKiAyO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS53aWR0aCA9IGAke01hdGgubWF4KGFuaW1hdGlvbldpZHRoLCBzY3JlZW5XaWR0aCl9cHhgO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbExlZnQgPSBsZWZ0V2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5cygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5rZXlzID0gdGhpcy5zZXF1ZW5jZXMuZmxhdE1hcCgoX3NlcXVlbmNlLCBfaVNlcXVlbmNlKSA9PlxyXG4gICAgICAgIF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5tYXAoKF9rZXkpID0+IHtcclxuICAgICAgICAgIGxldCB2aWV3S2V5OiBWaWV3QW5pbWF0aW9uS2V5ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiBfa2V5LFxyXG4gICAgICAgICAgICBjb2xvcjogX3NlcXVlbmNlLmNvbG9yLFxyXG4gICAgICAgICAgICBwYXRoMkQ6IHRoaXMuZ2VuZXJhdGVLZXkoXHJcbiAgICAgICAgICAgICAgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQoX2tleS50aW1lLCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMgPyBfa2V5LnZhbHVlIDogX2lTZXF1ZW5jZSAqIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDQpLFxyXG4gICAgICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkVcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgdHlwZTogXCJrZXlcIlxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiB2aWV3S2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICApKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkS2V5KVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVLZXkoX3Bvc2l0aW9uOiDGki5WZWN0b3IyLCBfdzogbnVtYmVyLCBfaDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8oX3Bvc2l0aW9uLnggLSBfdywgX3Bvc2l0aW9uLnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCwgX3Bvc2l0aW9uLnkgKyBfaCk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54ICsgX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55IC0gX2gpO1xyXG4gICAgICBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdUaW1lbGluZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBsZXQgYW5pbWF0aW9uU3RhcnQ6IG51bWJlciA9IE1hdGgubWluKC4uLnRoaXMua2V5cy5tYXAoX2tleSA9PiBfa2V5LmRhdGEudGltZSkpICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54O1xyXG4gICAgICBsZXQgYW5pbWF0aW9uRW5kOiBudW1iZXIgPSBNYXRoLm1heCguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjIpXCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChhbmltYXRpb25TdGFydCwgMCwgYW5pbWF0aW9uRW5kIC0gYW5pbWF0aW9uU3RhcnQsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICBsZXQgZnBzOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIGxldCBwaXhlbFBlckZyYW1lOiBudW1iZXIgPSAoMTAwMCAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpIC8gZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJTdGVwOiBudW1iZXIgPSBwaXhlbFBlckZyYW1lICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueDtcclxuICAgICAgbGV0IGZyYW1lc1BlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIGRvIHRoaXMgd2l0aCBPKDEpO1xyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDMsIDIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAyO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgZnJhbWVzUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc3ViU3RlcHM6IG51bWJlciA9IDA7XHJcbiAgICAgIGxldCBoaWdoU3RlcHM6IG51bWJlciA9IDA7IC8vIGV2ZXJ5IG50aCBzdGVwIHdpbGwgYmUgaGlnaGVyXHJcbiAgICAgIGlmIChmcmFtZXNQZXJTdGVwICE9IDEpIHtcclxuICAgICAgICBpZiAoZnJhbWVzUGVyU3RlcCA9PSA1KSB7XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3aXRjaCAoaU11bHRpcGxpZXJzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAzO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA1O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDk7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMjtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBncmlkTGluZXM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgbGV0IHRpbWVTdGVwczogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgdGhpcy5jcmMyLnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICB0aGlzLmNyYzIuZm9udCA9IHRoaXMuZG9jdW1lbnRTdHlsZS5mb250O1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMud2lkdGggLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB4U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KTtcclxuICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gMjApO1xyXG4gICAgICAgIGdyaWRMaW5lcy5tb3ZlVG8oeFN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcbiAgICAgICAgZ3JpZExpbmVzLmxpbmVUbyh4U3RlcCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgdGltZTogbnVtYmVyID0gaVN0ZXAgKiBmcmFtZXNQZXJTdGVwIC8gZnBzO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIGAke3RpbWUudG9GaXhlZCgyKX1gLFxyXG4gICAgICAgICAgeFN0ZXAgKyAzLFxyXG4gICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeFN1YlN0ZXA6IG51bWJlciA9IHhTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubW92ZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgICAgIHRpbWVTdGVwcy5saW5lVG8oeFN1YlN0ZXAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAoaVN1YlN0ZXAgJSBoaWdoU3RlcHMgPT0gMCA/IDEyIDogOCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSh0aW1lU3RlcHMpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKGdyaWRMaW5lcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3RXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICBsZXQgdG90YWxIZWlnaHQ6IG51bWJlciA9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVDtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIDAuNSwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIHRvdGFsSGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdO1xyXG4gICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGxhYmVsIGluIHRoaXMuYW5pbWF0aW9uLmxhYmVscykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5sYWJlbHNbbGFiZWxdKTtcclxuICAgICAgICBsZXQgdmlld0xhYmVsOiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGxhYmVsLCBwYXRoMkQ6IGdlbmVyYXRlTGFiZWwoeCksIHR5cGU6IFwibGFiZWxcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0xhYmVsKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdMYWJlbC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IGluIHRoaXMuYW5pbWF0aW9uLmV2ZW50cykge1xyXG4gICAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLmFuaW1hdGlvbi5ldmVudHNbZXZlbnRdKTtcclxuICAgICAgICBsZXQgdmlld0V2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPSB7IGRhdGE6IGV2ZW50LCBwYXRoMkQ6IGdlbmVyYXRlRXZlbnQoeCksIHR5cGU6IFwiZXZlbnRcIiB9O1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2godmlld0V2ZW50KTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKHZpZXdFdmVudC5wYXRoMkQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkRXZlbnQgPSB0aGlzLmV2ZW50cy5maW5kKF9ldmVudCA9PiBfZXZlbnQuZGF0YSA9PSB0aGlzLnNlbGVjdGVkRXZlbnQ/LmRhdGEpO1xyXG4gICAgICB0aGlzLmV2ZW50SW5wdXQuaGlkZGVuID0gdGhpcy5zZWxlY3RlZEV2ZW50ID09IG51bGw7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkRXZlbnQucGF0aDJEKTtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUubGVmdCA9IGAkeyh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIgPyB0aGlzLmFuaW1hdGlvbi5ldmVudHMgOiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCArIDEyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQuY2xhc3NOYW1lID0gdGhpcy5zZWxlY3RlZEV2ZW50LnR5cGU7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwibGFiZWxcIilcclxuICAgICAgICAvLyAgIHRoaXMuZXZlbnRJbnB1dC5zdHlsZS50b3AgPSBgJHtWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUfXB4YDtcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUIC8gMiAtIDJ9cHhgO1xyXG4gICAgICAgIHRoaXMuZXZlbnRJbnB1dC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuc2F2ZSgpO1xyXG4gICAgICB0aGlzLmNyYzIucmVjdCgwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIuY2xpcCgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVFdmVudChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMTApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSAxNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICAvLyBwYXRoLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZUxhYmVsKF94OiBudW1iZXIpOiBQYXRoMkQge1xyXG4gICAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEO1xyXG4gICAgICAgIHBhdGgubW92ZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDI2KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMjApO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDE0KTtcclxuICAgICAgICAvLyBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1NjYWxlKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY2VudGVyOiBudW1iZXIgPSB0aGlzLnJvdW5kKHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lVG8odGhpcy5jYW52YXMud2lkdGgsIGNlbnRlcik7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gLXRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnk7XHJcbiAgICAgIGxldCB2YWx1ZVBlclN0ZXA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICBsZXQgbXVsdGlwbGllcnM6IG51bWJlcltdID0gWzIsIDVdO1xyXG4gICAgICBsZXQgaU11bHRpcGxpZXJzOiBudW1iZXIgPSAwO1xyXG4gICAgICB3aGlsZSAocGl4ZWxQZXJTdGVwIDwgVmlld0FuaW1hdGlvblNoZWV0Lk1JTklNVU1fUElYRUxfUEVSX1NURVApIHtcclxuICAgICAgICBpTXVsdGlwbGllcnMgPSAoaU11bHRpcGxpZXJzICsgMSkgJSBtdWx0aXBsaWVycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IG11bHRpcGxpZXJzW2lNdWx0aXBsaWVyc107XHJcbiAgICAgICAgcGl4ZWxQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgdmFsdWVQZXJTdGVwICo9IG11bHRpcGxpZXI7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHN1YlN0ZXBzID0gNDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcblxyXG4gICAgICBsZXQgc3RlcHM6IG51bWJlciA9IDEgKyB0aGlzLmNhbnZhcy5oZWlnaHQgLyBwaXhlbFBlclN0ZXA7XHJcbiAgICAgIGxldCBzdGVwT2Zmc2V0OiBudW1iZXIgPSBNYXRoLmZsb29yKC10aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSAvIHBpeGVsUGVyU3RlcCk7XHJcbiAgICAgIGZvciAobGV0IGlTdGVwOiBudW1iZXIgPSBzdGVwT2Zmc2V0OyBpU3RlcCA8IHN0ZXBzICsgc3RlcE9mZnNldDsgaVN0ZXArKykge1xyXG4gICAgICAgIGxldCB5U3RlcDogbnVtYmVyID0gdGhpcy5yb3VuZChpU3RlcCAqIHBpeGVsUGVyU3RlcCArIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi55KTtcclxuICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3RlcCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmxpbmVUbyhWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEggLSA1LCB5U3RlcCk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSAtaVN0ZXAgKiB2YWx1ZVBlclN0ZXA7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxUZXh0KFxyXG4gICAgICAgICAgdmFsdWVQZXJTdGVwID49IDEgPyB2YWx1ZS50b0ZpeGVkKDApIDogdmFsdWUudG9GaXhlZCgxKSxcclxuICAgICAgICAgIDMzLFxyXG4gICAgICAgICAgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgbGV0IHBpeGVsUGVyU3ViU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJTdGVwIC8gKHN1YlN0ZXBzICsgMSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVN1YlN0ZXA6IG51bWJlciA9IDE7IGlTdWJTdGVwIDwgc3ViU3RlcHMgKyAxOyBpU3ViU3RlcCsrKSB7XHJcbiAgICAgICAgICBsZXQgeVN1YlN0ZXA6IG51bWJlciA9IHlTdGVwICsgTWF0aC5yb3VuZChpU3ViU3RlcCAqIHBpeGVsUGVyU3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubW92ZVRvKDAsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBhZGQgY29ycmVjdCBkcmF3aW5nIGZvciBjb25zdGFudC9zdGVwIGludGVycG9sYXRlZCBrZXlzXHJcbiAgICBwcml2YXRlIGRyYXdDdXJ2ZXMoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qgc2VxdWVuY2Ugb2YgdGhpcy5zZXF1ZW5jZXMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSBzZXF1ZW5jZS5jb2xvcjtcclxuICAgICAgICBzZXF1ZW5jZS5kYXRhLmdldEtleXMoKVxyXG4gICAgICAgICAgLm1hcCgoX2tleSwgX2luZGV4LCBfa2V5cykgPT4gW19rZXksIF9rZXlzW19pbmRleCArIDFdXSlcclxuICAgICAgICAgIC5maWx0ZXIoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBfa2V5U3RhcnQgJiYgX2tleUVuZClcclxuICAgICAgICAgIC5tYXAoKFtfa2V5U3RhcnQsIF9rZXlFbmRdKSA9PiBnZXRCZXppZXJQb2ludHMoX2tleVN0YXJ0LmZ1bmN0aW9uT3V0LCBfa2V5U3RhcnQsIF9rZXlFbmQpKVxyXG4gICAgICAgICAgLmZvckVhY2goKF9iZXppZXJQb2ludHMpID0+IHtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiBfcG9pbnQudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbikpO1xyXG4gICAgICAgICAgICBsZXQgY3VydmU6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgICAgICAgY3VydmUubW92ZVRvKF9iZXppZXJQb2ludHNbMF0ueCwgX2JlemllclBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgY3VydmUuYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzFdLngsIF9iZXppZXJQb2ludHNbMV0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzJdLngsIF9iZXppZXJQb2ludHNbMl0ueSxcclxuICAgICAgICAgICAgICBfYmV6aWVyUG9pbnRzWzNdLngsIF9iZXppZXJQb2ludHNbM10ueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKGN1cnZlKTtcclxuICAgICAgICAgICAgX2JlemllclBvaW50cy5mb3JFYWNoKF9wb2ludCA9PiDGki5SZWN5Y2xlci5zdG9yZShfcG9pbnQpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRCZXppZXJQb2ludHMoX2FuaW1hdGlvbkZ1bmN0aW9uOiDGki5BbmltYXRpb25GdW5jdGlvbiwgX2tleVN0YXJ0OiDGki5BbmltYXRpb25LZXksIF9rZXlFbmQ6IMaSLkFuaW1hdGlvbktleSk6IMaSLlZlY3RvcjJbXSB7XHJcbiAgICAgICAgbGV0IHBhcmFtZXRlcnM6IHsgYTogbnVtYmVyOyBiOiBudW1iZXI7IGM6IG51bWJlcjsgZDogbnVtYmVyIH0gPSBfYW5pbWF0aW9uRnVuY3Rpb24uZ2V0UGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNvbnN0IHBvbGFyRm9ybTogKHU6IG51bWJlciwgdjogbnVtYmVyLCB3OiBudW1iZXIpID0+IG51bWJlciA9IChfdSwgX3YsIF93KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmEgKiBfdSAqIF92ICogX3cgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmIgKiAoKF92ICogX3cgKyBfdyAqIF91ICsgX3UgKiBfdikgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuYyAqICgoX3UgKyBfdiArIF93KSAvIDMpICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5kXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHhTdGFydDogbnVtYmVyID0gX2tleVN0YXJ0LnRpbWU7XHJcbiAgICAgICAgbGV0IHhFbmQ6IG51bWJlciA9IF9rZXlFbmQudGltZTtcclxuICAgICAgICBsZXQgb2Zmc2V0VGltZUVuZDogbnVtYmVyID0geEVuZCAtIHhTdGFydDtcclxuXHJcbiAgICAgICAgbGV0IHBvaW50czogxpIuVmVjdG9yMltdID0gbmV3IEFycmF5KDQpLmZpbGwoMCkubWFwKCgpID0+IMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSk7XHJcbiAgICAgICAgcG9pbnRzWzBdLnNldCh4U3RhcnQsIHBvbGFyRm9ybSgwLCAwLCAwKSk7XHJcbiAgICAgICAgcG9pbnRzWzFdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMSAvIDMsIHBvbGFyRm9ybSgwLCAwLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzJdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kICogMiAvIDMsIHBvbGFyRm9ybSgwLCBvZmZzZXRUaW1lRW5kLCBvZmZzZXRUaW1lRW5kKSk7XHJcbiAgICAgICAgcG9pbnRzWzNdLnNldCh4U3RhcnQgKyBvZmZzZXRUaW1lRW5kLCBwb2xhckZvcm0ob2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3S2V5cygpOiB2b2lkIHtcclxuICAgICAgLy8gZHJhdyB1bnNlbGVjdGVkIGtleXNcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDQ7XHJcbiAgICAgIHRoaXMua2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGlmIChfa2V5ID09IHRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IF9rZXkuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShfa2V5LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwoX2tleS5wYXRoMkQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYXcgc2VsZWN0ZWQga2V5XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuc2VsZWN0ZWRLZXkuY29sb3I7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbCh0aGlzLnNlbGVjdGVkS2V5LnBhdGgyRCk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNsb3BlIGhvb2tzXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgIT0gU0hFRVRfTU9ERS5DVVJWRVMpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuY3JjMi5zdHJva2VTdHlsZTtcclxuXHJcbiAgICAgIGxldCBbbGVmdCwgcmlnaHRdID0gW8aSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKSwgxpIuUmVjeWNsZXIuZ2V0KMaSLlZlY3RvcjIpXTtcclxuICAgICAgbGVmdC5zZXQoLTUwLCAwKTtcclxuICAgICAgcmlnaHQuc2V0KDUwLCAwKTtcclxuXHJcbiAgICAgIGxldCBhbmdsZVNsb3BlU2NyZWVuOiBudW1iZXIgPSBNYXRoLmF0YW4odGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gKiAodGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpKSAqICgxODAgLyBNYXRoLlBJKTsgLy8gaW4gZGVncmVlXHJcbiAgICAgIGxldCBtdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MyA9IMaSLk1hdHJpeDN4My5JREVOVElUWSgpO1xyXG4gICAgICBtdHhUcmFuc2Zvcm0udHJhbnNsYXRlKHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnJvdGF0ZShhbmdsZVNsb3BlU2NyZWVuKTtcclxuICAgICAgbGVmdC50cmFuc2Zvcm0obXR4VHJhbnNmb3JtKTtcclxuICAgICAgcmlnaHQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcblxyXG4gICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xyXG4gICAgICBwYXRoLm1vdmVUbyhsZWZ0LngsIGxlZnQueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKHJpZ2h0LngsIHJpZ2h0LnkpO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHBhdGgpO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MgPSBbdGhpcy5nZW5lcmF0ZUtleShsZWZ0LCA1LCA1KSwgdGhpcy5nZW5lcmF0ZUtleShyaWdodCwgNSwgNSldO1xyXG4gICAgICB0aGlzLnNsb3BlSG9va3MuZm9yRWFjaChfaG9vayA9PiB0aGlzLmNyYzIuZmlsbChfaG9vaykpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobGVmdCk7XHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHJpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdDdXJzb3IoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5yZXN0b3JlKCk7XHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSB0aGlzLnRpbWVUb1NjcmVlbih0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgIGxldCBjdXJzb3I6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgY3Vyc29yLm1vdmVUbyh4LCAwKTtcclxuICAgICAgY3Vyc29yLmxpbmVUbyh4LCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXNpZ25hbFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0hpZ2hsaWdodCgpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcG9zU2NyZWVuOiDGki5WZWN0b3IyID0gdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSk7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItaGlnaGxpZ2h0XCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiNjZcIjtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgMCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlICs9IFwiMjZcIjtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBwb3NTY3JlZW4ueCwgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFKTtcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFJlY3QocG9zU2NyZWVuLnggLSBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgLyAyLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgcG9zU2NyZWVuLnkgLSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZXZlbnQgaGFuZGxpbmdcclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyA9PSB0aGlzKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbjtcclxuICAgICAgICAgICAgLy8gdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsICgpID0+IHRoaXMucmVzZXRWaWV3KTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFZpZXcoKTsgdGhpcy5hbmltYXRlKCk7IHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSB0aGlzLmtleXMuZmluZChfa2V5ID0+IF9rZXkuZGF0YSA9PSBfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gX2V2ZW50LmRldGFpbC5kYXRhO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IGZpbmRPYmplY3Q6IChfb2JqZWN0OiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50KSA9PiBib29sZWFuID0gX29iamVjdCA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfb2JqZWN0LnBhdGgyRCwgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQuYnV0dG9ucykge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIGlmIChfZXZlbnQub2Zmc2V0WSA+ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuY2xpZW50SGVpZ2h0KSAvLyBjbGlja2VkIG9uIHNjcm9sbCBiYXJcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB0aGlzLmhuZFNjcm9sbDtcclxuICAgICAgICAgIGVsc2UgaWYgKF9ldmVudC5vZmZzZXRZIDw9IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpIHtcclxuICAgICAgICAgICAgdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lKF9ldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlVGltZWxpbmU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2xvcGVIb29rcy5zb21lKF9ob29rID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9ob29rLCBfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVNsb3BlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBWaWV3QW5pbWF0aW9uS2V5IHwgVmlld0FuaW1hdGlvbkV2ZW50ID1cclxuICAgICAgICAgICAgICB0aGlzLmtleXMuZmluZChmaW5kT2JqZWN0KSB8fFxyXG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmZpbmQoZmluZE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEtleSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IG51bGwgfSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHN3aXRjaCAoc2VsZWN0ZWQudHlwZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJsYWJlbFwiOlxyXG4gICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdFdmVudDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJrZXlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB0aGlzLmhuZFBvaW50ZXJNb3ZlRHJhZ0tleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5zZWxlY3RlZEtleS5kYXRhIH0gfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMucG9zUmlnaHRDbGljay54ID0gX2V2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueSA9IF9ldmVudC5vZmZzZXRZO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgdGhpcy5wb3NQYW5TdGFydCA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVBhbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlck1vdmVUaW1lbGluZSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNjcmVlblRvVGltZShfZXZlbnQub2Zmc2V0WCk7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlU2xvcGUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB2Y3REZWx0YTogxpIuVmVjdG9yMiA9IMaSLlZlY3RvcjIuRElGRkVSRU5DRShuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpLCB0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIHZjdERlbHRhLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuU0NBTElORyjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pLnNjYWxpbmcpKTtcclxuICAgICAgbGV0IHNsb3BlOiBudW1iZXIgPSB2Y3REZWx0YS55IC8gdmN0RGVsdGEueDtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlSW4gPSBzbG9wZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnNsb3BlT3V0ID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlUGFuID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UodGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy5wb3NQYW5TdGFydCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFKVxyXG4gICAgICAgIHRyYW5zbGF0aW9uLnkgPSAwO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0tleSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgbGV0IHBpeGVsUGVyRnJhbWU6IG51bWJlciA9IDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1heCgwLCB0cmFuc2xhdGlvbi54KTtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IE1hdGgucm91bmQodHJhbnNsYXRpb24ueCAvIHBpeGVsUGVyRnJhbWUpICogcGl4ZWxQZXJGcmFtZTtcclxuXHJcbiAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YTtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IHRoaXMuc2VxdWVuY2VzLmZpbmQoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKS5pbmNsdWRlcyhrZXkpKS5kYXRhO1xyXG4gICAgICBzZXF1ZW5jZS5tb2RpZnlLZXkoa2V5LCB0cmFuc2xhdGlvbi54LCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFIHx8IF9ldmVudC5zaGlmdEtleSA/IG51bGwgOiB0cmFuc2xhdGlvbi55KTtcclxuICAgICAgdGhpcy5hbmltYXRpb24uY2FsY3VsYXRlVG90YWxUaW1lKCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0ga2V5LnRpbWU7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlRHJhZ0V2ZW50ID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdGltZTogbnVtYmVyID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiKVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnNldEV2ZW50KHRoaXMuc2VsZWN0ZWRFdmVudC5kYXRhLCB0aW1lKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gPSB0aW1lO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwpXHJcbiAgICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25zY3JvbGwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9ucG9pbnRlcm1vdmUgPSB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMCkgcmV0dXJuO1xyXG4gICAgICBsZXQgem9vbUZhY3RvcjogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyAxLjA1IDogMC45NTtcclxuICAgICAgbGV0IHBvc0N1cnNvcldvcmxkOiDGki5WZWN0b3IyID0gdGhpcy5zY3JlZW5Ub1dvcmxkUG9pbnQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgIGxldCB4OiBudW1iZXIgPSBfZXZlbnQuc2hpZnRLZXkgPyAxIDogem9vbUZhY3RvcjtcclxuICAgICAgbGV0IHk6IG51bWJlciA9IF9ldmVudC5jdHJsS2V5IHx8IHRoaXMubW9kZSA9PSBTSEVFVF9NT0RFLkRPUEUgPyAxIDogem9vbUZhY3RvcjtcclxuXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGUocG9zQ3Vyc29yV29ybGQpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGUobmV3IMaSLlZlY3RvcjIoeCwgeSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKMaSLlZlY3RvcjIuU0NBTEUocG9zQ3Vyc29yV29ybGQsIC0xKSk7XHJcblxyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kU2Nyb2xsID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbjtcclxuICAgICAgdHJhbnNsYXRpb24ueCA9IC10aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnBsYXliYWNrVGltZSB9IH0pO1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSByZXNldFZpZXcoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5yZXNldCgpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfTUlMTElTRUNPTkQpOyAvLyBhcHBseSBzY2FsaW5nXHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVgoKHRoaXMuY2FudmFzLndpZHRoIC0gMiAqIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCkgLyAoKHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgfHwgVmlld0FuaW1hdGlvblNoZWV0LlNUQU5EQVJEX0FOSU1BVElPTl9MRU5HVEgpKSk7XHJcbiAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVYKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCk7XHJcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5DVVJWRVMpIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVZKC0xKTsgLy8gZmxpcCB5XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWShWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG5cclxuICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgICAuZmxhdE1hcChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpKVxyXG4gICAgICAgICAgLm1hcChfa2V5ID0+IF9rZXkudmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gdmFsdWVzLnJlZHVjZSgoX2EsIF9iKSA9PiBNYXRoLm1pbihfYSwgX2IpKTsgLy8gaW4gd29ybGQgc3BhY2VcclxuICAgICAgICAgIGxldCBtYXg6IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5tYXgoX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgdmlld0hlaWdodDogbnVtYmVyID0gKHRoaXMuY2FudmFzLmhlaWdodCAtIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7IC8vIGluIHB4XHJcbiAgICAgICAgICBpZiAobWluICE9IG1heClcclxuICAgICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSh2aWV3SGVpZ2h0IC8gKCgobWF4IC0gbWluKSAqIFZpZXdBbmltYXRpb25TaGVldC5QSVhFTF9QRVJfVkFMVUUpICogMS4yKSk7XHJcbiAgICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWSh2aWV3SGVpZ2h0IC0gbWluICogdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxpbmcueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGVZKFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAqIDIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1dvcmxkUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSjGki5NYXRyaXgzeDMuSU5WRVJTRSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHdvcmxkVG9TY3JlZW5Qb2ludChfeDogbnVtYmVyLCBfeTogbnVtYmVyKTogxpIuVmVjdG9yMiB7XHJcbiAgICAgIGxldCB2ZWN0b3I6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfeCwgX3kpO1xyXG4gICAgICB2ZWN0b3IudHJhbnNmb3JtKHRoaXMubXR4V29ybGRUb1NjcmVlbik7XHJcbiAgICAgIHZlY3Rvci54ID0gdGhpcy5yb3VuZCh2ZWN0b3IueCk7XHJcbiAgICAgIHZlY3Rvci55ID0gdGhpcy5yb3VuZCh2ZWN0b3IueSk7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY3JlZW5Ub1RpbWUoX3g6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIGxldCBwbGF5YmFja1RpbWU6IG51bWJlciA9IE1hdGgubWF4KDAsIChfeCAtIHRoaXMubXR4V29ybGRUb1NjcmVlbi50cmFuc2xhdGlvbi54KSAvIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLngpO1xyXG4gICAgICByZXR1cm4gcGxheWJhY2tUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZVRvU2NyZWVuKF90aW1lOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3VuZChfdGltZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByb3VuZChfdmFsdWU6IG51bWJlcik6IG51bWJlciB7IC8vIHRoaXMgaXMgbmVlZGVkIGZvciBsaW5lcyB0byBiZSBkaXNwbGF5ZWQgY3Jpc3Agb24gdGhlIGNhbnZhc1xyXG4gICAgICBpZiAoTWF0aC50cnVuYyh0aGlzLmNyYzIubGluZVdpZHRoKSAlIDIgPT0gMClcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpOyAvLyBldmVuIGxpbmUgd2lkdGhcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKF92YWx1ZSkgKyAwLjU7IC8vIG9kZCBsaW5lIHdpZHRoXHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gTUVOVSB7XHJcbiAgICBDT01QT05FTlRNRU5VID0gXCJBZGQgQ29tcG9uZW50c1wiXHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBleGFtaW4gcHJvYmxlbSB3aXRoIMaSLk1hdGVyaWFsIHdoZW4gdXNpbmcgXCJ0eXBlb2YgxpIuTXV0YWJsZVwiIGFzIGtleSB0byB0aGUgbWFwXHJcbiAgbGV0IHJlc291cmNlVG9Db21wb25lbnQ6IE1hcDxGdW5jdGlvbiwgdHlwZW9mIMaSLkNvbXBvbmVudD4gPSBuZXcgTWFwPEZ1bmN0aW9uLCB0eXBlb2YgxpIuQ29tcG9uZW50PihbXHJcbiAgICBbxpIuQXVkaW8sIMaSLkNvbXBvbmVudEF1ZGlvXSxcclxuICAgIFvGki5NYXRlcmlhbCwgxpIuQ29tcG9uZW50TWF0ZXJpYWxdLFxyXG4gICAgW8aSLk1lc2gsIMaSLkNvbXBvbmVudE1lc2hdLFxyXG4gICAgW8aSLkFuaW1hdGlvbiwgxpIuQ29tcG9uZW50QW5pbWF0b3JdLFxyXG4gICAgW8aSLlBhcnRpY2xlU3lzdGVtLCDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbV1cclxuICBdKTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbGwgY29tcG9uZW50cyBhdHRhY2hlZCB0byBhIG5vZGVcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdDb21wb25lbnRzIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIGV4cGFuZGVkOiB7IFt0eXBlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7IENvbXBvbmVudFRyYW5zZm9ybTogdHJ1ZSB9O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZDogc3RyaW5nID0gXCJDb21wb25lbnRUcmFuc2Zvcm1cIjtcclxuICAgIHByaXZhdGUgZHJhZzogxpIuQ29tcG9uZW50Q2FtZXJhO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgdGhpcy5obmRUcmFuc2Zvcm0pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkVYUEFORCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT0xMQVBTRSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQsIHRydWUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IMaSLkNvbXBvbmVudENhbWVyYVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZHJhZyA/IFt0aGlzLmRyYWddIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0NPTVBPTkVOVCwgxpIuQ29tcG9uZW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBKb2ludFwiLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5BRERfSk9JTlQsIMaSLkpvaW50LCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBDb21wb25lbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0pPSU5ULCDGki5Kb2ludCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgQ29tcG9uZW50XCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX0NPTVBPTkVOVCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBDb250ZXh0TWVudS5hcHBlbmRDb3B5UGFzdGUobWVudSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfWApO1xyXG4gICAgICBsZXQgaVN1YmNsYXNzOiBudW1iZXIgPSBfaXRlbVtcImlTdWJjbGFzc1wiXTtcclxuICAgICAgbGV0IGNvbXBvbmVudDogdHlwZW9mIMaSLkNvbXBvbmVudDtcclxuXHJcbiAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuQ29tcG9uZW50LnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX0pPSU5UOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gxpIuSm9pbnQuc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfQ09NUE9ORU5UOlxyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkJPRFlcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50LnRhZ05hbWUpO1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KGVsZW1lbnQsIFwiY29udHJvbGxlclwiKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIkRFVEFJTFNcIiAmJiBjb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7IGRldGFpbDogeyBtdXRhYmxlOiA8xpIuTXV0YWJsZT5jb250cm9sbGVyLmdldE11dGFibGUoKSB9IH0pO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjb21wb25lbnQpIC8vIGV4cGVyaW1lbnRhbCBmaXggZm9yIHRoZSBzcG9yYWRpYyBcImNvbXBvbmVudCBpcyBub3QgYSBjb25zdHJ1Y3RvclwiIGJ1Z1xyXG4gICAgICAgIGNvbXBvbmVudCA9IMaSW19pdGVtLmxhYmVsXTtcclxuXHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICBsZXQgY21wTmV3OiDGki5Db21wb25lbnQgPSBuZXcgY29tcG9uZW50KCk7XHJcbiAgICAgIGlmICgoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5IHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFZSRGV2aWNlIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFdhbGtlcikgJiYgIXRoaXMubm9kZS5jbXBUcmFuc2Zvcm0pIHtcclxuICAgICAgICBhbGVydChgVG8gYXR0YWNoIGEgJHtjbXBOZXcudHlwZX0sIGZpcnN0IGF0dGFjaCBhICR7xpIuQ29tcG9uZW50VHJhbnNmb3JtLm5hbWV9LmApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50R3JhcGhGaWx0ZXIgJiYgISh0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaCB8fCB0aGlzLm5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKSkge1xyXG4gICAgICAgIGFsZXJ0KGBBdHRhY2ggJHvGki5Db21wb25lbnRHcmFwaEZpbHRlci5uYW1lfSBvbmx5IHRvICR7xpIuR3JhcGgubmFtZX0gb3IgJHvGki5HcmFwaEluc3RhbmNlLm5hbWV9c2ApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGb2cgfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50QW1iaWVudE9jY2x1c2lvbiB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRCbG9vbSkge1xyXG4gICAgICAgIGxldCBjYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50Q2FtZXJhKSA/PyB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFZSRGV2aWNlKTtcclxuICAgICAgICBpZiAoIWNhbWVyYSkge1xyXG4gICAgICAgICAgYWxlcnQoYFRvIGF0dGFjaCBhICR7Y21wTmV3LnR5cGV9LCBmaXJzdCBhdHRhY2ggYSAke8aSLkNvbXBvbmVudENhbWVyYS5uYW1lfSBvciAke8aSLkNvbXBvbmVudFZSRGV2aWNlLm5hbWV9LmApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGNtcE5ldy50eXBlLCBjbXBOZXcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLm5vZGUgfSB9KTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLm5vZGUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBpZiAodGhpcy5kb20gIT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdTY3JpcHQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBpZiAoIXNvdXJjZS5pc0NvbXBvbmVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZmluZENvbXBvbmVudFR5cGUoc291cmNlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgLy8gICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMucHJvdGVjdEdyYXBoSW5zdGFuY2UoKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKSkge1xyXG4gICAgICAgIGxldCBjbXBOZXc6IMaSLkNvbXBvbmVudCA9IHRoaXMuY3JlYXRlQ29tcG9uZW50KHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudChjbXBOZXcpO1xyXG4gICAgICAgIHRoaXMuZXhwYW5kZWRbY21wTmV3LnR5cGVdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByb3RlY3RHcmFwaEluc3RhbmNlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAvLyBpbmhpYml0IHN0cnVjdHVyYWwgY2hhbmdlcyB0byBhIEdyYXBoSW5zdGFuY2VcclxuICAgICAgbGV0IGNoZWNrOiDGki5Ob2RlID0gdGhpcy5ub2RlO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgaWYgKGNoZWNrIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSkge1xyXG4gICAgICAgICAgYWxlcnQoYEVkaXQgdGhlIGdyYXBoIFwiJHtjaGVjay5uYW1lfVwiIHRvIG1ha2UgY2hhbmdlcyB0byBpdHMgc3RydWN0dXJlIGFuZCB0aGVuIHJlbG9hZCB0aGUgcHJvamVjdGApO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoZWNrID0gY2hlY2suZ2V0UGFyZW50KCk7XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgY250RW1wdHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIkRyb3AgaW50ZXJuYWwgcmVzb3VyY2VzIG9yIHVzZSByaWdodCBjbGljayB0byBjcmVhdGUgbmV3IGNvbXBvbmVudHNcIjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5ub2RlIHx8ICEodGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuTm9kZSkpIHsgIC8vIFRPRE86IGV4YW1pbmUsIGlmIGFueXRoaW5nIG90aGVyIHRoYW4gbm9kZSBjYW4gYXBwZWFyIGhlcmUuLi5cclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLmRvbS50aXRsZSA9IFwiU2VsZWN0IG5vZGUgdG8gZWRpdCBjb21wb25lbnRzXCI7XHJcbiAgICAgICAgY250RW1wdHkudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgY29tcG9uZW50c1wiO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiQ29tcG9uZW50cyB8IFwiICsgdGhpcy5ub2RlLm5hbWUpO1xyXG5cclxuICAgICAgbGV0IGNvbXBvbmVudHM6IMaSLkNvbXBvbmVudFtdID0gdGhpcy5ub2RlLmdldEFsbENvbXBvbmVudHMoKTtcclxuICAgICAgaWYgKCFjb21wb25lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChjbnRFbXB0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgY29tcG9uZW50cykge1xyXG4gICAgICAgIGxldCBkZXRhaWxzOiDGklVpLkRldGFpbHMgPSDGklVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoY29tcG9uZW50KTtcclxuICAgICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IG5ldyBDb250cm9sbGVyRGV0YWlsKGNvbXBvbmVudCwgZGV0YWlscywgdGhpcyk7XHJcbiAgICAgICAgUmVmbGVjdC5zZXQoZGV0YWlscywgXCJjb250cm9sbGVyXCIsIGNvbnRyb2xsZXIpOyAvLyBpbnNlcnQgYSBsaW5rIGJhY2sgdG8gdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICBkZXRhaWxzLmV4cGFuZCh0aGlzLmV4cGFuZGVkW2NvbXBvbmVudC50eXBlXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kKGRldGFpbHMpO1xyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRDYW1lcmEpIHtcclxuICAgICAgICAgIGRldGFpbHMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIGRldGFpbHMuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoX2V2ZW50OiBFdmVudCkgPT4geyB0aGlzLmRyYWcgPSA8xpIuQ29tcG9uZW50Q2FtZXJhPmNvbXBvbmVudDsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRSaWdpZGJvZHkpIHtcclxuICAgICAgICAgIGxldCBwaXZvdDogSFRNTEVsZW1lbnQgPSBjb250cm9sbGVyLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltrZXk9J210eFBpdm90J1wiKTtcclxuICAgICAgICAgIGxldCBvcGFjaXR5OiBzdHJpbmcgPSBwaXZvdC5zdHlsZS5vcGFjaXR5O1xyXG4gICAgICAgICAgc2V0UGl2b3RPcGFjaXR5KG51bGwpO1xyXG4gICAgICAgICAgY29udHJvbGxlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5NVVRBVEUsIHNldFBpdm90T3BhY2l0eSk7XHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRQaXZvdE9wYWNpdHkoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb246IMaSLkJPRFlfSU5JVCA9IGNvbnRyb2xsZXIuZ2V0TXV0YXRvcih7IGluaXRpYWxpemF0aW9uOiAwIH0pLmluaXRpYWxpemF0aW9uO1xyXG4gICAgICAgICAgICBwaXZvdC5zdHlsZS5vcGFjaXR5ID0gaW5pdGlhbGl6YXRpb24gPT0gxpIuQk9EWV9JTklULlRPX1BJVk9UID8gb3BhY2l0eSA6IFwiMC4zXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiDGki5Db21wb25lbnRGYWNlQ2FtZXJhKSB7XHJcbiAgICAgICAgICBsZXQgdXA6IEhUTUxFbGVtZW50ID0gY29udHJvbGxlci5kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJba2V5PSd1cCdcIik7XHJcbiAgICAgICAgICBsZXQgb3BhY2l0eTogc3RyaW5nID0gdXAuc3R5bGUub3BhY2l0eTtcclxuICAgICAgICAgIHNldFVwT3BhY2l0eShudWxsKTtcclxuICAgICAgICAgIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCBzZXRVcE9wYWNpdHkpO1xyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0VXBPcGFjaXR5KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IHVwTG9jYWw6IGJvb2xlYW4gPSBjb250cm9sbGVyLmdldE11dGF0b3IoeyB1cExvY2FsOiB0cnVlIH0pLnVwTG9jYWw7XHJcbiAgICAgICAgICAgIHVwLnN0eWxlLm9wYWNpdHkgPSAhdXBMb2NhbCA/IG9wYWNpdHkgOiBcIjAuM1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGV0YWlscy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgPT0gdGhpcy5zZWxlY3RlZClcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KGRldGFpbHMsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlIHx8IF9ldmVudC5kZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGxldCBjb21wb25lbnQ6IMaSLkNvbXBvbmVudCA9IDzGki5Db21wb25lbnQ+X2V2ZW50LmRldGFpbC5tdXRhYmxlO1xyXG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuS0VZX0RPV046XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkNMSUNLOlxyXG4gICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5TUEFDRSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0OiDGklVpLkRldGFpbHMgPSA8xpJVaS5EZXRhaWxzPl9ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT0gXCJTVU1NQVJZXCIpXHJcbiAgICAgICAgICAgIHRhcmdldCA9IDzGklVpLkRldGFpbHM+dGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTERldGFpbHNFbGVtZW50IHx8ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbS5yZXBsYWNlQ2hpbGQodGFyZ2V0LCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgfHwgdGhpcy5nZXRTZWxlY3RlZCgpICE9IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChfZTogdW5rbm93bikgeyAvKiAqLyB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuRVhQQU5EOlxyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5DT0xMQVBTRTpcclxuICAgICAgICAgIHRoaXMuZXhwYW5kZWRbKDzGklVpLkRldGFpbHM+X2V2ZW50LnRhcmdldCkuZ2V0QXR0cmlidXRlKFwidHlwZVwiKV0gPSAoX2V2ZW50LnR5cGUgPT0gxpJVaS5FVkVOVC5FWFBBTkQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIGxldCBjbXBSaWdpZGJvZHk6IMaSLkNvbXBvbmVudFJpZ2lkYm9keSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50UmlnaWRib2R5KTtcclxuICAgICAgICAgIGlmIChjbXBSaWdpZGJvZHkpIFxyXG4gICAgICAgICAgICBjbXBSaWdpZGJvZHkuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgLy8gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiB0aGlzLm5vZGUgfSB9KTsgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyB3YXMgbmVjZXNzYXJ5LCBFVkVOVF9FRElUT1IuVVBEQVRFIGdldHMgYnJvYWRjYXN0ZWQgYnkgcHJvamVjdCBvbiDGki5FVkVOVC5HUkFQSF9NVVRBVEVELCBzbyB0aGlzIHdhcyBjYXVzaW5nIGEgZG91YmxlIGJyb2FkY2FzdCBvZiBFVkVOVF9FRElUT1IuVVBEQVRFIHRvIEFMTCB2aWV3cyBvbiBhbnkgY2hhbmdlIHRvIGFueSBjb21wb25lbnRcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpJVaS5FVkVOVC5SRUFSUkFOR0VfQVJSQVk6IC8vIG5vIGxpc3RlbmVyIGZvciB0aGlzIGV2ZW50XHJcbiAgICAgICAgLy8gICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUcmFuc2Zvcm0gPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZ2V0U2VsZWN0ZWQoKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlckRldGFpbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZ2V0U2VsZWN0ZWQoKSwgXCJjb250cm9sbGVyXCIpO1xyXG4gICAgICBsZXQgY29tcG9uZW50OiDGki5Db21wb25lbnQgPSA8xpIuQ29tcG9uZW50PmNvbnRyb2xsZXIuZ2V0TXV0YWJsZSgpO1xyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXg0eDQgPSBSZWZsZWN0LmdldChjb21wb25lbnQsIFwibXR4TG9jYWxcIikgfHwgUmVmbGVjdC5nZXQoY29tcG9uZW50LCBcIm10eFBpdm90XCIpO1xyXG4gICAgICBpZiAoIW10eFRyYW5zZm9ybSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZHRsOiDGki5HZW5lcmFsID0gX2V2ZW50LmRldGFpbC50cmFuc2Zvcm07XHJcbiAgICAgIGxldCBtdHhDYW1lcmE6IMaSLk1hdHJpeDR4NCA9ICg8xpIuQ29tcG9uZW50Q2FtZXJhPmR0bC5jYW1lcmEpLm5vZGUubXR4V29ybGQ7XHJcbiAgICAgIGxldCBkaXN0YW5jZTogbnVtYmVyID0gbXR4Q2FtZXJhLmdldFRyYW5zbGF0aW9uVG8odGhpcy5ub2RlLm10eFdvcmxkKS5tYWduaXR1ZGU7XHJcbiAgICAgIGlmIChkdGwudHJhbnNmb3JtID09IFRSQU5TRk9STS5ST1RBVEUpXHJcbiAgICAgICAgW2R0bC54LCBkdGwueV0gPSBbZHRsLnksIGR0bC54XTtcclxuXHJcbiAgICAgIGxldCB2YWx1ZTogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKCk7XHJcbiAgICAgIHZhbHVlLnggPSAoZHRsLnJlc3RyaWN0aW9uID09IFwieFwiID8gIWR0bC5pbnZlcnRlZCA6IGR0bC5pbnZlcnRlZCkgPyBkdGwueCA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueSA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ5XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/IC1kdGwueSA6IHVuZGVmaW5lZDtcclxuICAgICAgdmFsdWUueiA9IChkdGwucmVzdHJpY3Rpb24gPT0gXCJ6XCIgPyAhZHRsLmludmVydGVkIDogZHRsLmludmVydGVkKSA/XHJcbiAgICAgICAgKCh2YWx1ZS54ID09IHVuZGVmaW5lZCkgPyAtZHRsLnkgOiBkdGwueCkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUubWFwKChfYzogbnVtYmVyKSA9PiBfYyB8fCAwKTtcclxuXHJcbiAgICAgIGlmIChtdHhUcmFuc2Zvcm0gaW5zdGFuY2VvZiDGki5NYXRyaXg0eDQpXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0zKGR0bC50cmFuc2Zvcm0sIHZhbHVlLCBtdHhUcmFuc2Zvcm0sIGRpc3RhbmNlKTtcclxuICAgICAgaWYgKG10eFRyYW5zZm9ybSBpbnN0YW5jZW9mIMaSLk1hdHJpeDN4MylcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybTIoZHRsLnRyYW5zZm9ybSwgdmFsdWUudG9WZWN0b3IyKCksIG10eFRyYW5zZm9ybSwgMSk7XHJcblxyXG4gICAgICBjb21wb25lbnQubXV0YXRlKGNvbXBvbmVudC5nZXRNdXRhdG9yKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTMoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjMsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDR4NCwgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgbGV0IHJvdGF0aW9uOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgIHJvdGF0aW9uLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yU2NhbGluZzogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yU2NhbGluZyk7XHJcbiAgICAgICAgICBsZXQgc2NhbGluZzogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0uc2NhbGluZztcclxuICAgICAgICAgIHNjYWxpbmcuYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnNjYWxpbmcgPSBzY2FsaW5nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybTIoX3RyYW5zZm9ybTogVFJBTlNGT1JNLCBfdmFsdWU6IMaSLlZlY3RvcjIsIF9tdHhUcmFuc2Zvcm06IMaSLk1hdHJpeDN4MywgX2Rpc3RhbmNlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfdHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JUcmFuc2xhdGlvbiAqIF9kaXN0YW5jZSk7XHJcbiAgICAgICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24uYWRkKF92YWx1ZSk7XHJcbiAgICAgICAgICBfbXR4VHJhbnNmb3JtLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgICBsZXQgZmFjdG9yUm90YXRpb246IG51bWJlciA9IDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yUm90YXRpb24pO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5yb3RhdGlvbiArPSBfdmFsdWUueDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclNjYWxpbmc6IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclNjYWxpbmcpO1xyXG4gICAgICAgICAgbGV0IHNjYWxpbmc6IMaSLlZlY3RvcjIgPSBfbXR4VHJhbnNmb3JtLnNjYWxpbmc7XHJcbiAgICAgICAgICBzY2FsaW5nLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3QoX2RldGFpbHM6IMaSVWkuRGV0YWlscywgX2ZvY3VzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmRvbS5jaGlsZHJlbilcclxuICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIF9kZXRhaWxzLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZCA9IF9kZXRhaWxzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgaWYgKF9mb2N1cylcclxuICAgICAgICBfZGV0YWlscy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWQoKTogxpJVaS5EZXRhaWxzIHtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5kb20uY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpKVxyXG4gICAgICAgICAgcmV0dXJuIDzGklVpLkRldGFpbHM+Y2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnQoX3Jlc291cmNlOiBPYmplY3QpOiDGki5Db21wb25lbnQge1xyXG4gICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICBpZiAoX3Jlc291cmNlLmlzQ29tcG9uZW50KVxyXG4gICAgICAgICAgcmV0dXJuIG5ldyAoPMaSLkdlbmVyYWw+X3Jlc291cmNlLnNjcmlwdCkoKTtcclxuXHJcbiAgICAgIGxldCB0eXBlQ29tcG9uZW50OiB0eXBlb2YgxpIuQ29tcG9uZW50ID0gdGhpcy5maW5kQ29tcG9uZW50VHlwZShfcmVzb3VyY2UpO1xyXG4gICAgICByZXR1cm4gbmV3ICg8xpIuR2VuZXJhbD50eXBlQ29tcG9uZW50KShfcmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmluZENvbXBvbmVudFR5cGUoX3Jlc291cmNlOiBPYmplY3QpOiB0eXBlb2YgxpIuQ29tcG9uZW50IHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgcmVzb3VyY2VUb0NvbXBvbmVudClcclxuICAgICAgICBpZiAoX3Jlc291cmNlIGluc3RhbmNlb2YgZW50cnlbMF0pXHJcbiAgICAgICAgICByZXR1cm4gZW50cnlbMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBzdG9yZVNlbGVjdGVkKCk6IHZvaWQge1xyXG4gICAgLy8gICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBoaWVyYXJjaHkgb2YgYSBncmFwaCBhcyB0cmVlLWNvbnRyb2xcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0hpZXJhcmNoeSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBncmFwaDogxpIuR3JhcGg7XHJcbiAgICBwcml2YXRlIHRyZWU6IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPjtcclxuICAgIHByaXZhdGUgc2VsZWN0aW9uUHJldmlvdXM6IMaSLk5vZGVbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gYSBzZWxlY3QgZXZlbnQgd2lsbCBiZSByZWNpdmVkIGZyb20gdGhlIHBhbmVsIGR1cmluZyByZWNvbnN0cnVjdGlvbiBzbyB3ZSBvbmx5IG5lZWQgdG8gcHJlcGFyZSBvdXIgc3RvcmFnZSBoZXJlXHJcbiAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSAmJiBfc3RhdGVbXCJleHBhbmRlZFwiXSAmJiAhdGhpcy5yZXN0b3JlRXhwYW5kZWQoX3N0YXRlW1wiZ3JhcGhcIl0pKVxyXG4gICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZChfc3RhdGVbXCJncmFwaFwiXSwgX3N0YXRlW1wiZXhwYW5kZWRcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IHNlbGVjdGlvbigpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIGlmICghX2dyYXBoKSB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JhcGggJiYgdGhpcy50cmVlKVxyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmFwaClcclxuICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQodGhpcy5ncmFwaC5pZFJlc291cmNlLCB0aGlzLmdldEV4cGFuZGVkKCkpO1xyXG5cclxuICAgICAgdGhpcy5ncmFwaCA9IF9ncmFwaDtcclxuICAgICAgLy8gdGhpcy5zZWxlY3RlZE5vZGUgPSBudWxsO1xyXG5cclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSVWkuQ3VzdG9tVHJlZTzGki5Ob2RlPihuZXcgQ29udHJvbGxlclRyZWVIaWVyYXJjaHkoKSwgdGhpcy5ncmFwaCk7XHJcbiAgICAgIC8vIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuREVMRVRFLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZFRyZWVFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgb24gZXhpc3Rpbmcgbm9kZSB0byBjcmVhdGUgY2hpbGQgbm9kZS5cXG7il48gVXNlIENvcHkvUGFzdGUgdG8gZHVwbGljYXRlIG5vZGVzLlwiO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgb3IgZHVwbGljYXRlLlwiO1xyXG5cclxuICAgICAgbGV0IGV4cGFuZGVkOiBzdHJpbmdbXSA9IHRoaXMucmVzdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSk7XHJcbiAgICAgIGlmIChleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZChleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5Ob2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47IC8vIGNvbnRpbnVlIHdpdGggc3RhbmRhcmQgdHJlZSBiZWhhdmlvdXJcclxuXHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRyZWUpXHJcbiAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkuZmlsdGVyKChfc291cmNlKTogX3NvdXJjZSBpcyDGki5HcmFwaCA9PiBfc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjsgLy8gY29udGludWUgd2l0aCBzdGFuZGFyZCB0cmVlIGJlaGF2aW91clxyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaW5zdGFuY2VzOiDGki5HcmFwaEluc3RhbmNlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZ3JhcGggb2YgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcylcclxuICAgICAgICBpZiAoZ3JhcGggaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIGluc3RhbmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QuY3JlYXRlR3JhcGhJbnN0YW5jZShncmFwaCkpO1xyXG5cclxuICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IGluc3RhbmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSVWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIE5vZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIk5cIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGUtIC8gQWN2dGl2YXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUNUSVZBVEVfTk9ERSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkFcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX05PREUpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGZvY3VzOiDGki5Ob2RlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKE51bWJlcihfaXRlbS5pZCkpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9OT0RFOlxyXG4gICAgICAgICAgbGV0IGNoaWxkOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJOZXcgTm9kZVwiKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbY2hpbGRdLCBmb2N1cyk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFDVElWQVRFX05PREU6XHJcbiAgICAgICAgICBmb2N1cy5hY3RpdmF0ZSghZm9jdXMuaXNBY3RpdmUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9OT0RFOlxyXG4gICAgICAgICAgLy8gZm9jdXMuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgaWYgKCFmb2N1cylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIGZvY3VzLmdldFBhcmVudCgpLnJlbW92ZUNoaWxkKGZvY3VzKTtcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5ncmFwaCk7XHJcbiAgICAgICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZXhwYW5kZWRcIl0gPSB0aGlzLmdldEV4cGFuZGVkKCk7XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gRXZlbnRIYW5kbGVyc1xyXG4gICAgcHJpdmF0ZSBobmRUcmVlRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiDGki5HcmFwaCkge1xyXG4gICAgICAgICAgICAvLyBfZXZlbnQuZGV0YWlsLmRhdGEubmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuU0VMRUNUOlxyXG4gICAgICAgICAgLy9vbmx5IGRpc3BhdGNoIHRoZSBldmVudCB0byBmb2N1cyB0aGUgbm9kZSwgaWYgdGhlIG5vZGUgaXMgaW4gdGhlIGN1cnJlbnQgYW5kIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gIFxyXG4gICAgICAgICAgbGV0IG5vZGU6IMaSLk5vZGUgPSBfZXZlbnQuZGV0YWlsW1wiZGF0YVwiXTtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByZXZpb3VzLmluY2x1ZGVzKG5vZGUpICYmIHRoaXMuc2VsZWN0aW9uLmluY2x1ZGVzKG5vZGUpKVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5GT0NVUywgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogbm9kZSwgdmlldzogdGhpcyB9IH0pO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25QcmV2aW91cyA9IHRoaXMuc2VsZWN0aW9uLnNsaWNlKDApO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IG5vZGU6IG5vZGUsIHZpZXc6IHRoaXMgfSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZ3JhcGgpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGgoX2V2ZW50LmRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5zaG93KF9ldmVudC5kZXRhaWwubm9kZS5nZXRQYXRoKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuY29udHJvbGxlci5zZWxlY3Rpb24gPSBbX2V2ZW50LmRldGFpbC5ub2RlXTtcclxuICAgICAgICAgICAgdGhpcy50cmVlLmRpc3BsYXlTZWxlY3Rpb24odGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25QcmV2aW91cyA9IHRoaXMuc2VsZWN0aW9uLnNsaWNlKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCAmJiBfZXZlbnQuZGV0YWlsLmRhdGEgPT0gdGhpcy5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy50cmVlLmZpbmRJdGVtKHRoaXMuZ3JhcGgpPy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBpZiAodGhpcy5ncmFwaClcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSwgdGhpcy5nZXRFeHBhbmRlZCgpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgc3RvcmVFeHBhbmRlZChfaWRHcmFwaDogc3RyaW5nLCBfZXhwYW5kZWQ6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5pZH1fJHtfaWRHcmFwaH1gLCBKU09OLnN0cmluZ2lmeShfZXhwYW5kZWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc3RvcmVFeHBhbmRlZChfaWRHcmFwaDogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICBsZXQgc3RvcmVkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuaWR9XyR7X2lkR3JhcGh9YCk7XHJcbiAgICAgIHJldHVybiBzdG9yZWQgJiYgSlNPTi5wYXJzZShzdG9yZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RXhwYW5kZWQoKTogc3RyaW5nW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlPy5nZXRFeHBhbmRlZCgpLm1hcChfaXRlbSA9PiDGki5Ob2RlLlBBVEhfRlJPTV9UTyh0aGlzLmdyYXBoLCBfaXRlbS5kYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogxpIuTm9kZVtdW10gPSBfcGF0aHNcclxuICAgICAgICAubWFwKF9wYXRoID0+IMaSLk5vZGUuRklORDzGki5Ob2RlPih0aGlzLmdyYXBoLCBfcGF0aCkpXHJcbiAgICAgICAgLmZpbHRlcihfbm9kZSA9PiBfbm9kZSlcclxuICAgICAgICAubWFwKF9ub2RlID0+IF9ub2RlLmdldFBhdGgoKSk7XHJcblxyXG4gICAgICB0aGlzLnRyZWU/LmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIGltcG9ydCDGkkFpZCA9IEZ1ZGdlQWlkO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSByZW5kZXJpbmcgb2YgYSBncmFwaCBpbiBhIHZpZXdwb3J0IHdpdGggYW4gaW5kZXBlbmRlbnQgY2FtZXJhXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UmVuZGVyIGV4dGVuZHMgVmlldyB7XHJcbiAgICBwcml2YXRlIGNtck9yYml0OiDGkkFpZC5DYW1lcmFPcmJpdDtcclxuICAgIHByaXZhdGUgdmlld3BvcnQ6IMaSLlZpZXdwb3J0O1xyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBncmFwaDogxpIuR3JhcGg7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG5vZGVMaWdodDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiSWxsdW1pbmF0aW9uXCIpOyAvLyBrZWVwcyBsaWdodCBjb21wb25lbnRzIGZvciBkYXJrIGdyYXBoc1xyXG4gICAgcHJpdmF0ZSByZWRyYXdJZDogbnVtYmVyO1xyXG4gICAgI3BvaW50ZXJNb3ZlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuXHJcbiAgICAgIGxldCB0aXRsZTogc3RyaW5nID0gXCLil48gRHJvcCBhIGdyYXBoIGZyb20gXFxcIkludGVybmFsXFxcIiBoZXJlLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBVc2UgbW91c2VidXR0b25zIGFuZCBjdHJsLSwgc2hpZnQtIG9yIGFsdC1rZXkgdG8gbmF2aWdhdGUgZWRpdG9yIGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gRHJvcCBjYW1lcmEgY29tcG9uZW50IGhlcmUgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIE1hbmlwdWxhdGUgdHJhbnNmb3JtYXRpb25zIGluIHRoaXMgdmlldzpcXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gQ2xpY2sgdG8gc2VsZWN0IG5vZGUsIHJpZ2h0Y2xpY2sgdG8gc2VsZWN0IHRyYW5zZm9ybWF0aW9ucy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gU2VsZWN0IGNvbXBvbmVudCB0byBtYW5pcHVsYXRlIGluIHZpZXcgQ29tcG9uZW50cy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gSG9sZCBYLCBZIG9yIFogYW5kIG1vdmUgbW91c2UgdG8gdHJhbnNmb3JtLiBBZGQgc2hpZnQta2V5IHRvIGludmVydCByZXN0cmljdGlvbi5cXG5cIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSB0aXRsZTtcclxuICAgICAgdGhpcy5kb20udGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkZPQ1VTLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlcik7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4gdGhpcy4jcG9pbnRlck1vdmVkID0gZmFsc2UpOyAvLyByZXNldCBwb2ludGVyIG1vdmVcclxuXHJcbiAgICAgIGlmIChfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl0pIHtcclxuICAgICAgICBsZXQgZ2l6bW9zRmlsdGVyOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoX3N0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdKTtcclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBnaXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICBpZiAodGhpcy5naXptb3NGaWx0ZXIuaGFzKGtleSkpXHJcbiAgICAgICAgICAgIHRoaXMuZ2l6bW9zRmlsdGVyLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IGdpem1vc0ZpbHRlcigpOiBNYXA8c3RyaW5nLCBib29sZWFuPiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdwb3J0Py5naXptb3NGaWx0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiVHJhbnNsYXRlXCIsIGlkOiBUUkFOU0ZPUk0uVFJBTlNMQVRFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJUXCIgOiBcIlRcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUm90YXRlXCIsIGlkOiBUUkFOU0ZPUk0uUk9UQVRFLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJSXCIgOiBcIlJcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiU2NhbGVcIiwgaWQ6IFRSQU5TRk9STS5TQ0FMRSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IHByb2Nlc3MucGxhdGZvcm0gPT0gXCJkYXJ3aW5cIiA/IFwiRVwiIDogXCJFXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiUGh5c2ljcyBEZWJ1Z1wiLCBzdWJtZW51OiBbXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJOb25lXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMF0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJDb2xsaWRlcnNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVsxXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVycyBhbmQgSm9pbnRzIChEZWZhdWx0KVwiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzJdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQm91bmRpbmcgQm94ZXNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVszXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbnRhY3RzXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbNF0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJPbmx5IFBoeXNpY3NcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs1XSksIGNsaWNrOiBfY2FsbGJhY2sgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJPcnRob2dyYXBoaWMgQ2FtZXJhXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuT1JUSEdSQVBISUNfQ0FNRVJBKSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcImRhcndpblwiID8gXCJPXCIgOiBcIk9cIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIlJlbmRlciBDb250aW51b3VzbHlcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKSwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7X2l0ZW0uaWR9YCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9pdGVtLmlkKSB7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uVFJBTlNMQVRFOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlJPVEFURTpcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5TQ0FMRTpcclxuICAgICAgICAgIFBhZ2Uuc2V0VHJhbnNmb3JtKF9pdGVtLmlkKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuTk9ORV06XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5DT0xMSURFUlNdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUl06XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5CT1VORElOR19CT1hFU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5DT05UQUNUU106XHJcbiAgICAgICAgY2FzZSDGki5QSFlTSUNTX0RFQlVHTU9ERVvGki5QSFlTSUNTX0RFQlVHTU9ERS5QSFlTSUNfT0JKRUNUU19PTkxZXTpcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQucGh5c2ljc0RlYnVnTW9kZSA9IMaSLlBIWVNJQ1NfREVCVUdNT0RFW19pdGVtLmlkXTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpOlxyXG4gICAgICAgICAgdGhpcy5zZXRDYW1lcmFPcnRob2dyYXBoaWMoX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKTpcclxuICAgICAgICAgIHRoaXMuc2V0UmVuZGVyQ29udGlub3VzbHkoX2l0ZW0uY2hlY2tlZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmdpem1vc0ZpbHRlci5oYXMoX2l0ZW0uaWQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLmdpem1vc0ZpbHRlci5zZXQoX2l0ZW0uaWQsIF9pdGVtLmNoZWNrZWQpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICghdGhpcy4jcG9pbnRlck1vdmVkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBbZmlsdGVyLCBhY3RpdmVdIG9mIHRoaXMuZ2l6bW9zRmlsdGVyKVxyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoZmlsdGVyKS5jaGVja2VkID0gYWN0aXZlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiNwb2ludGVyTW92ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3Q29tcG9uZW50cykpIHsgLy8gYWxsb3cgZHJvcHBpbmcgY2FtZXJhY29tcG9uZW50IHRvIHNlZSB0aHJvdWdoIHRoYXQgY2FtZXJhIChhdCB0aGlzIHRpbWUsIHRoZSBvbmx5IGRyYWdnYWJsZSlcclxuICAgICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdJbnRlcm5hbCkpIC8vIGFsbG93IGRyb3BwaW5nIGEgZ3JhcGhcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgICAgaWYgKCEoc291cmNlIGluc3RhbmNlb2YgxpIuR3JhcGgpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgbGV0IHNvdXJjZTogT2JqZWN0ID0gX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF07XHJcbiAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiDGki5Db21wb25lbnRDYW1lcmEpIHtcclxuICAgICAgICAvLyB0aGlzLnNldENhbWVyYU9ydGhvZ3JhcGhpYyhmYWxzZSk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICDGkkFpZC5hZGRTdGFuZGFyZExpZ2h0Q29tcG9uZW50cyh0aGlzLm5vZGVMaWdodCk7XHJcblxyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIHRoaXMuY2FudmFzID0gxpJBaWQuQ2FudmFzLmNyZWF0ZSh0cnVlLCDGkkFpZC5JTUFHRV9SRU5ERVJJTkcuUElYRUxBVEVEKTtcclxuICAgICAgbGV0IGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSBcIjBweFwiO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuXHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgLy8gYWRkIGRlZmF1bHQgdmFsdWVzIGZvciB2aWV3IHJlbmRlciBnaXptb3NcclxuICAgICAgdGhpcy5naXptb3NGaWx0ZXIuc2V0KEdJWk1PUy5UUkFOU0ZPUk0sIHRydWUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmluaXRpYWxpemUoXCJWaWV3Tm9kZV9WaWV3cG9ydFwiLCB0aGlzLmdyYXBoLCBjbXBDYW1lcmEsIHRoaXMuY2FudmFzKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLmNtck9yYml0ID0gRnVkZ2VBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHRoaXMudmlld3BvcnQsIGZhbHNlKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7IC8qIHZpZXcgc2hvdWxkIGxvYWQgZXZlbiBpZiByZW5kZXJpbmcgZmFpbHMuLi4gKi8gfTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUjtcclxuICAgICAgdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX1NUQVJULCB0aGlzLmhuZFByZXBhcmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5kcmF3VHJhbnNsYXRpb24pO1xyXG5cclxuICAgICAgdGhpcy5zZXRHcmFwaChudWxsKTtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmFjdGl2ZVZpZXdwb3J0KTtcclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBpY2tcIiwgdGhpcy5obmRQaWNrKTtcclxuXHJcbiAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9uc1tdID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgW2ZpbHRlcl0gb2YgdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgc3VibWVudS5wdXNoKHsgbGFiZWw6IGZpbHRlciwgaWQ6IGZpbHRlciwgdHlwZTogXCJjaGVja2JveFwiLCBjbGljazogdGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykgfSk7XHJcblxyXG4gICAgICB0aGlzLmNvbnRleHRNZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJHaXptb3NcIiwgc3VibWVudTogc3VibWVudVxyXG4gICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRHcmFwaChfbm9kZTogxpIuR3JhcGgpOiB2b2lkIHtcclxuICAgICAgaWYgKCFfbm9kZSkge1xyXG4gICAgICAgIHRoaXMuZ3JhcGggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJEcm9wIGEgZ3JhcGggaGVyZSB0byBlZGl0XCI7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5ncmFwaCkge1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmdyYXBoID0gX25vZGU7XHJcblxyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTtcclxuICAgICAgdGhpcy5ncmFwaC5icm9hZGNhc3RFdmVudChuZXcgRXZlbnQoxpIuRVZFTlQuRElTQ09OTkVDVF9KT0lOVCkpO1xyXG4gICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUjtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2godGhpcy5ncmFwaCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuZ3JhcGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Q2FtZXJhT3J0aG9ncmFwaGljKF9vbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIGlmIChfb24pIHtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmNtcENhbWVyYS5wcm9qZWN0Q2VudHJhbCgyLCAxLCDGki5GSUVMRF9PRl9WSUVXLkRJQUdPTkFMLCAxMCwgMjAwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwMDtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmRpc3RhbmNlICo9IDUwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDEsIDQ1LCDGki5GSUVMRF9PRl9WSUVXLkRJQUdPTkFMLCAwLjAxLCAxMDAwKTtcclxuICAgICAgICB0aGlzLmNtck9yYml0Lm1heERpc3RhbmNlID0gMTAwMDtcclxuICAgICAgICB0aGlzLmNtck9yYml0LmRpc3RhbmNlIC89IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpKS5jaGVja2VkID0gX29uO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFByZXBhcmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc3dpdGNoTGlnaHQ6IEV2ZW50TGlzdGVuZXIgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCBsaWdodHNQcmVzZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgxpIuUmVuZGVyLmxpZ2h0cy5mb3JFYWNoKChfYXJyYXk6IMaSLlJlY3ljYWJsZUFycmF5PMaSLkNvbXBvbmVudExpZ2h0PikgPT4gbGlnaHRzUHJlc2VudCB8fD0gX2FycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7bGlnaHRzUHJlc2VudCA/IFwiUkVOREVSXCIgOiBcIlJlbmRlclwifSB8ICR7dGhpcy5ncmFwaC5uYW1lfWApO1xyXG4gICAgICAgIGlmICghbGlnaHRzUHJlc2VudClcclxuICAgICAgICAgIMaSLlJlbmRlci5hZGRMaWdodHModGhpcy5ub2RlTGlnaHQuZ2V0Q29tcG9uZW50cyjGki5Db21wb25lbnRMaWdodCkpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGgucmVtb3ZlRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5SRU5ERVJfUFJFUEFSRV9FTkQsIHN3aXRjaExpZ2h0KTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5ncmFwaC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSA8RXZlbnREZXRhaWw+X2V2ZW50LmRldGFpbDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChkZXRhaWwuZ3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaChkZXRhaWwuZ3JhcGgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5GT0NVUywgeyBidWJibGVzOiBmYWxzZSwgZGV0YWlsOiB7IG5vZGU6IGRldGFpbC5ub2RlIHx8IHRoaXMuZ3JhcGggfSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChkZXRhaWwubm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBkZXRhaWwubm9kZTtcclxuICAgICAgICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NTZWxlY3RlZCA9IFt0aGlzLm5vZGVdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuRk9DVVM6XHJcbiAgICAgICAgICB0aGlzLmNtck9yYml0Lm10eExvY2FsLnRyYW5zbGF0aW9uID0gZGV0YWlsLm5vZGUubXR4V29ybGQudHJhbnNsYXRpb247XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5kcmF3VHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICBpZiAoIXRoaXMudmlld3BvcnQuY2FtZXJhLmlzQWN0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUGljayA9IChfZXZlbnQ6IEVkaXRvckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBwaWNrZWQ6IMaSLk5vZGUgPSBfZXZlbnQuZGV0YWlsLm5vZGU7XHJcblxyXG4gICAgICAvL1RPRE86IHdhdGNoIG91dCwgdHdvIHNlbGVjdHNcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiBwaWNrZWQgfSB9KTtcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJVaS5FVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHBpY2tlZCB9IH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhbmltYXRlID0gKF9lOiBFdmVudCkgPT4ge1xyXG4gICAgLy8gICB0aGlzLnZpZXdwb3J0LnNldEdyYXBoKHRoaXMuZ3JhcGgpO1xyXG4gICAgLy8gICBpZiAodGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0ID4gMCAmJiB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCA+IDApXHJcbiAgICAvLyAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCB8fD0gKF9ldmVudC5tb3ZlbWVudFggIT0gMCB8fCBfZXZlbnQubW92ZW1lbnRZICE9IDApO1xyXG5cclxuICAgICAgdGhpcy5kb20uZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgcmVzdHJpY3Rpb246IHN0cmluZztcclxuICAgICAgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5YXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInhcIjtcclxuICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlldKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwielwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWl0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ5XCI7XHJcblxyXG4gICAgICBpZiAoIXJlc3RyaWN0aW9uKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogUGFnZS5tb2RlVHJhbnNmb3JtLCByZXN0cmljdGlvbjogcmVzdHJpY3Rpb24sIHg6IF9ldmVudC5tb3ZlbWVudFgsIHk6IF9ldmVudC5tb3ZlbWVudFksIGNhbWVyYTogdGhpcy52aWV3cG9ydC5jYW1lcmEsIGludmVydGVkOiBfZXZlbnQuc2hpZnRLZXlcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IHRyYW5zZm9ybTogZGF0YSB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwge30pO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGFjdGl2ZVZpZXdwb3J0ID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICBfZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLmdyYXBoKTtcclxuICAgICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShmYWxzZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcihfZXJyb3IpO1xyXG4gICAgICAgIC8vbm9wXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRSZW5kZXJDb250aW5vdXNseShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMucmVkcmF3SWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICB9LCAxMDAwIC8gMzApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMucmVkcmF3SWQpO1xyXG4gICAgICAgIHRoaXMucmVkcmF3SWQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5SRU5ERVJfQ09OVElOVU9VU0xZKSkuY2hlY2tlZCA9IF9vbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdUcmFuc2xhdGlvbiA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLm5vZGUgfHwgIXRoaXMuZ2l6bW9zRmlsdGVyLmdldChHSVpNT1MuVFJBTlNGT1JNKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBzY2FsaW5nOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5PTkUoxpIuVmVjdG9yMy5ESUZGRVJFTkNFKMaSLkdpem1vcy5jYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMubm9kZS5tdHhXb3JsZC50cmFuc2xhdGlvbikubWFnbml0dWRlICogMC4xKTtcclxuICAgICAgY29uc3Qgb3JpZ2luOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAgIGNvbnN0IHZjdFg6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlgoMSk7XHJcbiAgICAgIGNvbnN0IHZjdFk6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlkoMSk7XHJcbiAgICAgIGNvbnN0IHZjdFo6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlooMSk7XHJcbiAgICAgIGxldCBtdHhXb3JsZDogxpIuTWF0cml4NHg0ID0gdGhpcy5ub2RlLm10eFdvcmxkLmNsb25lO1xyXG4gICAgICBtdHhXb3JsZC5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgbGV0IGNvbG9yOiDGki5Db2xvciA9IMaSLkNvbG9yLkNTUyhcInJlZFwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RYXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuICAgICAgY29sb3Iuc2V0Q1NTKFwibGltZVwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RZXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuICAgICAgY29sb3Iuc2V0Q1NTKFwiYmx1ZVwiKTtcclxuICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhbb3JpZ2luLCB2Y3RaXSwgbXR4V29ybGQsIGNvbG9yKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlTXVsdGlwbGUodmN0WCwgdmN0WSwgdmN0Wiwgb3JpZ2luLCBtdHhXb3JsZCwgY29sb3IsIHNjYWxpbmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImdpem1vc0ZpbHRlclwiXSA9IEFycmF5LmZyb20odGhpcy5naXptb3NGaWx0ZXIuZW50cmllcygpKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgbGV0IHR5cGVzT2ZSZXNvdXJjZXM6IMaSLkdlbmVyYWxbXSA9IFtcclxuICAgIMaSLk1lc2hcclxuICBdO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBpbnRlcm5hbCByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0ludGVybmFsVGFibGUgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVEVTVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmhuZEtleWJvYXJkRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsaXN0UmVzb3VyY2VzKCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+KG5ldyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSgpLCBPYmplY3QudmFsdWVzKMaSLlByb2plY3QucmVzb3VyY2VzKSwgXCJ0eXBlXCIpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayB0byBjcmVhdGUgbmV3IHJlc291cmNlLlxcbuKXjyBTZWxlY3Qgb3IgZHJhZyByZXNvdXJjZS5cIjtcclxuICAgICAgdGhpcy50YWJsZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyAgRHJhZyB0byBcXFwiUHJvcGVydGllc1xcXCIgb3IgXFxcIkNvbXBvbmVudHNcXFwiIHRvIHVzZSBpZiBhcHBsaWNhYmxlLlwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgdHIgb2YgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpIHtcclxuICAgICAgICBsZXQgdGRzOiBOb2RlTGlzdE9mPEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IHRyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZFwiKTtcclxuICAgICAgICBpZiAoIXRkcy5sZW5ndGgpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB0ZHNbMV0uY2xhc3NMaXN0LmFkZChcImljb25cIik7XHJcbiAgICAgICAgdGRzWzFdLnNldEF0dHJpYnV0ZShcImljb25cIiwgKDxIVE1MSW5wdXRFbGVtZW50PnRkc1sxXS5jaGlsZHJlblswXSkudmFsdWUpO1xyXG4gICAgICAgIGlmICh0ciBpbnN0YW5jZW9mIMaSdWkuVGFibGVJdGVtICYmICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD50ci5kYXRhKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKSB7XHJcbiAgICAgICAgICB0ci5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB0ci50aXRsZSA9IFwiRmFpbGVkIHRvIGxvYWQgcmVzb3VyY2UgZnJvbSBmaWxlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IHRoaXMgaXMgYSBwcmVwYXJhdGlvbiBmb3Igc3luY2luZyBhIGdyYXBoIHdpdGggaXRzIGluc3RhbmNlcyBhZnRlciBzdHJ1Y3R1cmFsIGNoYW5nZXNcclxuICAgIC8vIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgcm93OiBIVE1MVGFibGVSb3dFbGVtZW50ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoKF9lbGVtZW50KSA9PiAoPEhUTUxFbGVtZW50Pl9lbGVtZW50KS50YWdOYW1lID09IFwiVFJcIik7XHJcbiAgICAvLyAgIGlmIChyb3cpXHJcbiAgICAvLyAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSkuZW5hYmxlZCA9IChyb3cuZ2V0QXR0cmlidXRlKFwiaWNvblwiKSA9PSBcIkdyYXBoXCIpO1xyXG4gICAgLy8gICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDcmVhdGUgR3JhcGhcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfR1JBUEgpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJHXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNZXNoXCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9NRVNILCDGki5NZXNoLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWF0ZXJpYWxcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgxpIuQW5pbWF0aW9uLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uU3ByaXRlLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1QpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIFJlc291cmNlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiU3luYyBJbnN0YW5jZXNcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5TWU5DX0lOU1RBTkNFUyksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIlNcIiB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG5cclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAgIGxldCBpU3ViY2xhc3M6IG51bWJlciA9IF9pdGVtW1wiaVN1YmNsYXNzXCJdO1xyXG4gICAgICBpZiAoIWlTdWJjbGFzcyAmJiAoY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NRVNIIHx8IGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJGdW5reSBFbGVjdHJvbi1FcnJvci4uLiBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICAvL1RPRE86IGRpc3BhdGNoIENSRUFURSBpbnN0ZWFkIG9mIE1PRElGWSFcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NRVNIOlxyXG4gICAgICAgICAgbGV0IHR5cGVNZXNoOiB0eXBlb2YgxpIuTWVzaCA9IMaSLk1lc2guc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBsZXQgbWVzaE5ldzogxpIuTWVzaCA9IG5ldyB0eXBlTWVzaCgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG1lc2hOZXcsIG1lc2hOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUw6XHJcbiAgICAgICAgICBsZXQgdHlwZVNoYWRlcjogdHlwZW9mIMaSLlNoYWRlciA9IMaSLlNoYWRlci5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgbXRyTmV3OiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbCh0eXBlU2hhZGVyLm5hbWUsIHR5cGVTaGFkZXIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG10ck5ldywgbXRyTmV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIOlxyXG4gICAgICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKG5ldyDGki5Ob2RlKFwiTmV3R3JhcGhcIikpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGdyYXBoLCBncmFwaCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSBuZXcgdHlwZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGFuaW1hdGlvbiwgYW5pbWF0aW9uKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVDpcclxuICAgICAgICAgIGxldCBwYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0gPSBuZXcgxpIuUGFydGljbGVTeXN0ZW0oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNSRUFURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgdGhpcy50YWJsZS5zZWxlY3RJbnRlcnZhbChwYXJ0aWNsZVN5c3RlbSwgcGFydGljbGVTeXN0ZW0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0U6XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuZGVsZXRlKFt0aGlzLnRhYmxlLmdldEZvY3Vzc2VkKCldKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIGlmICh0aGlzLmRvbSAhPSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gIVtNSU1FLkFVRElPLCBNSU1FLklNQUdFLCBNSU1FLk1FU0gsIE1JTUUuR0xURl0uaW5jbHVkZXMoX3NvdXJjZS5nZXRNaW1lVHlwZSgpKSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpXHJcbiAgICAgICAgLy8gICBpZiAoc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5BVURJTyAmJiBzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLklNQUdFICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuTUVTSClcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiDGki5Ob2RlW10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcykge1xyXG4gICAgICAgICAgYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgoc291cmNlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5BVURJTzpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuQXVkaW8oc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1JTUUuSU1BR0U6XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cobmV3IMaSLlRleHR1cmVJbWFnZShzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5NRVNIOlxyXG4gICAgICAgICAgICAgIMaSLkRlYnVnLmxvZyhhd2FpdCBuZXcgxpIuTWVzaE9CSigpLmxvYWQoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlXHJcbiAgICAgICAgICAgICAgTUlNRS5HTFRGOlxyXG4gICAgICAgICAgICAgIGxldCBsb2FkZXI6IMaSLkdMVEZMb2FkZXIgPSBhd2FpdCDGki5HTFRGTG9hZGVyLkxPQUQoc291cmNlLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hhdCB0byBpbXBvcnQgZnJvbSAnJHtsb2FkZXIubmFtZX0nYCwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncykgaWYgKFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3NbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXNvdXJjZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSBhd2FpdCBsb2FkZXIubG9hZFJlc291cmNlcyjGklt0eXBlXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiByZXNvdXJjZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCHGki5Qcm9qZWN0LnJlc291cmNlc1tyZXNvdXJjZS5pZFJlc291cmNlXSlcclxuICAgICAgICAgICAgICAgICAgICDGki5Qcm9qZWN0LnJlZ2lzdGVyKHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBsZXQgY2VsbDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCIuc2VsZWN0ZWRcIik7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoIWlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DUkVBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbD8uc2VuZGVyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDogLy8gVE9ETzogaXMgdGhpcyByZWFjaGFibGU/IElzIGl0IHN0aWxsIG5lZWRlZD9cclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhc3luYyBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cclxuXHJcbiAgICAvLyAgIC8vIMaSdWkuRGlhbG9nLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgLy8gICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgLy8gICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3Ioc2V0dGluZ3MsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgLy8gICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICB9IGVsc2VcclxuICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhtdXRhdG9yLCB0aGlzKTtcclxuICAgIC8vIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByZXZpZXcgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJldmlldyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXRyU3RhbmRhcmQ6IMaSLk1hdGVyaWFsID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVzaFN0YW5kYXJkOiDGki5NZXNoID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNZXNoKCk7XHJcbiAgICBwcml2YXRlIHJlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSB8IERpcmVjdG9yeUVudHJ5IHwgUmVzb3VyY2VGb2xkZXIgfCBGdW5jdGlvbjtcclxuICAgIHByaXZhdGUgdmlld3BvcnQ6IMaSLlZpZXdwb3J0O1xyXG4gICAgcHJpdmF0ZSBjbXJPcmJpdDogxpJBaWQuQ2FtZXJhT3JiaXQ7XHJcbiAgICBwcml2YXRlIHByZXZpZXdOb2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBtdHhJbWFnZTogxpIuTWF0cml4M3gzID0gxpIuTWF0cml4M3gzLklERU5USVRZKCk7XHJcbiAgICBwcml2YXRlIHRpbWVvdXREZWZlcjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBjcmVhdGUgdmlld3BvcnQgZm9yIDNELXJlc291cmNlc1xyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC50cmFuc2xhdGUobmV3IMaSLlZlY3RvcjMoMSwgMiwgMSkpO1xyXG4gICAgICAvLyBjbXBDYW1lcmEucGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuICAgICAgY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDEsIDQ1KTtcclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gbmV3IMaSLlZpZXdwb3J0KCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlByZXZpZXdcIiwgbnVsbCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgICAvLyDGki5SZW5kZXJXZWJHTC5zZXRDYW52YXNTaXplKDEsIDEpO1xyXG4gICAgICB0aGlzLmNtck9yYml0ID0gxpJBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHRoaXMudmlld3BvcnQsIGZhbHNlKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZSA9IHRoaXMuY3JlYXRlU3RhbmRhcmRHcmFwaCgpO1xyXG5cclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpOiDGki5NYXRlcmlhbCB7XHJcbiAgICAgIGxldCBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBuZXcgxpIuTWF0ZXJpYWwoXCJTdGFuZGFyZE1hdGVyaWFsXCIsIMaSLlNoYWRlckZsYXQsIG5ldyDGki5Db2F0UmVtaXNzaXZlKMaSLkNvbG9yLkNTUyhcIndoaXRlXCIpKSk7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtdHJTdGFuZGFyZCk7XHJcbiAgICAgIHJldHVybiBtdHJTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1lc2goKTogxpIuTWVzaCB7XHJcbiAgICAgIGxldCBtZXNoU3RhbmRhcmQ6IMaSLk1lc2hTcGhlcmUgPSBuZXcgxpIuTWVzaFNwaGVyZShcIlNwaGVyZVwiLCAyMCwgMTIpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIobWVzaFN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG1lc2hTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiSWxsdW1pbmF0ZSBHcmFwaFwiLCBpZDogQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV0sIGNoZWNrZWQ6IHRydWUsIHR5cGU6IFwiY2hlY2tib3hcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7X2l0ZW0uaWR9YCk7XHJcblxyXG4gICAgICAvLyBzd2l0Y2ggKF9pdGVtLmlkKSB7XHJcbiAgICAgIC8vIGNhc2UgQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV06XHJcbiAgICAgIC8vICAgdGhpcy5pbGx1bWluYXRlR3JhcGgoKTtcclxuICAgICAgLy8gICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRNb3VzZSA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKFwiZGl2I2ltYWdlXCIpO1xyXG4gICAgICBpZiAoIWRpdilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5idXR0b25zICE9IDIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWChfZXZlbnQubW92ZW1lbnRYKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWShfZXZlbnQubW92ZW1lbnRZKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ3aGVlbFwiOlxyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKFxyXG4gICAgICAgICAgICBfZXZlbnQub2Zmc2V0WCAtIHRoaXMuZG9tLmNsaWVudFdpZHRoLCBfZXZlbnQub2Zmc2V0WSAtIHRoaXMuZG9tLmNsaWVudEhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgbGV0IHpvb206IG51bWJlciA9IE1hdGguZXhwKC1fZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvZmZzZXQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnNjYWxlWCh6b29tKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVZKHpvb20pO1xyXG4gICAgICAgICAgb2Zmc2V0LnNjYWxlKHpvb20gLSAxKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWCgtb2Zmc2V0LngpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKC1vZmZzZXQueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFRyYW5zZm9ybShfZGl2OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdHJhbnNmb3JtOiBGbG9hdDMyQXJyYXkgPSB0aGlzLm10eEltYWdlLmdldCgpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbig1LCA2KTtcclxuICAgICAgdHJhbnNmb3JtID0gdHJhbnNmb3JtLmNvcHlXaXRoaW4oMiwgMyk7XHJcbiAgICAgIF9kaXYuc3R5bGUudHJhbnNmb3JtID0gYG1hdHJpeCgke3RyYW5zZm9ybS5zbGljZSgwLCA2KS5qb2luKCl9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgaWYgKCF0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJTZWxlY3QgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgcmVzb3VyY2UgdG8gcHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcmV2aWV3XCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSB0aGlzLnJlc291cmNlLnR5cGUgfHwgXCJGdW5jdGlvblwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLk1lc2gpXHJcbiAgICAgICAgdHlwZSA9IFwiTWVzaFwiO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgIGxldCBwcmV2aWV3T2JqZWN0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3T2JqZWN0XCIpO1xyXG4gICAgICBsZXQgcHJldmlldzogSFRNTEVsZW1lbnQ7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJGdW5jdGlvblwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlU2NyaXB0UHJldmlldyg8RnVuY3Rpb24+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRmlsZVwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlRmlsZVByZXZpZXcoPERpcmVjdG9yeUVudHJ5PnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgaWYgKHByZXZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHByZXZpZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1lc2hcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNZXNoKDzGki5NZXNoPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbChWaWV3UHJldmlldy5tdHJTdGFuZGFyZCkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNYXRlcmlhbFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goVmlld1ByZXZpZXcubWVzaFN0YW5kYXJkKSk7XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwoPMaSLk1hdGVyaWFsPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHRoaXMucmVzZXRDYW1lcmEoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiR3JhcGhcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYXBwZW5kQ2hpbGQoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgbGlnaHRzUHJlc2VudCA9IGZhbHNlO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLmxpZ2h0cy5mb3JFYWNoKChfYXJyYXk6IMaSLlJlY3ljYWJsZUFycmF5PMaSLkNvbXBvbmVudExpZ2h0PikgPT4gbGlnaHRzUHJlc2VudCB8fD0gX2FycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgdGhpcy5pbGx1bWluYXRlKCFsaWdodHNQcmVzZW50KTtcclxuICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7bGlnaHRzUHJlc2VudCA/IFwiUFJFVklFV1wiIDogXCJQcmV2aWV3XCJ9IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKDzGki5HcmFwaD50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsIChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmZXIoKCkgPT4gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRleHR1cmVJbWFnZVwiOlxyXG4gICAgICAgIGNhc2UgXCJBbmltYXRpb25TcHJpdGVcIjpcclxuICAgICAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGRpdi5pZCA9IFwiaW1hZ2VcIjtcclxuICAgICAgICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodHlwZSA9PSBcIlRleHR1cmVJbWFnZVwiKSB7XHJcbiAgICAgICAgICAgIGltZyA9ICg8xpIuVGV4dHVyZUltYWdlPnRoaXMucmVzb3VyY2UpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25TcHJpdGU6IMaSLkFuaW1hdGlvblNwcml0ZSA9IDzGki5BbmltYXRpb25TcHJpdGU+dGhpcy5yZXNvdXJjZTtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+YW5pbWF0aW9uU3ByaXRlLnRleHR1cmUpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uczogxpIuVmVjdG9yMltdID0gYW5pbWF0aW9uU3ByaXRlLmdldFBvc2l0aW9ucygpO1xyXG4gICAgICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IGFuaW1hdGlvblNwcml0ZS5nZXRNdXRhdG9yKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBvc2l0aW9uIG9mIHBvc2l0aW9ucykge1xyXG4gICAgICAgICAgICAgIGxldCByZWN0OiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgICByZWN0LmNsYXNzTmFtZSA9IFwicmVjdFNwcml0ZVwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUubGVmdCA9IHBvc2l0aW9uLnggKyAxICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUudG9wID0gcG9zaXRpb24ueSArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS53aWR0aCA9IG11dGF0b3Iuc2l6ZS54IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLmhlaWdodCA9IG11dGF0b3Iuc2l6ZS55IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkF1ZGlvXCI6XHJcbiAgICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KCg8xpIuQXVkaW8+dGhpcy5yZXNvdXJjZSkucGF0aC50b1N0cmluZygpLCBcIlwiLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KGVudHJ5KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OiBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShgUHJldmlldyB8ICR7dGhpcy5yZXNvdXJjZS5uYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhbmRhcmRHcmFwaCgpOiDGki5Ob2RlIHtcclxuICAgICAgbGV0IGdyYXBoOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3U2NlbmVcIik7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuc2V0QnJhbmNoKGdyYXBoKTtcclxuXHJcbiAgICAgIGxldCBub2RlTGlnaHQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdJbGx1bWluYXRpb25cIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKG5vZGVMaWdodCk7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKG5vZGVMaWdodCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcblxyXG4gICAgICBsZXQgcHJldmlld05vZGU6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdOb2RlXCIpO1xyXG4gICAgICBncmFwaC5hZGRDaGlsZChwcmV2aWV3Tm9kZSk7XHJcbiAgICAgIHJldHVybiBwcmV2aWV3Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFZpZXdPYmplY3QoX25vZGU6IMaSLk5vZGUsIF9ncmFwaElsbHVtaW5hdGlvbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5hZGRDaGlsZChfbm9kZSk7XHJcbiAgICAgIHRoaXMuaWxsdW1pbmF0ZSh0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy52aWV3cG9ydC5jYW52YXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaWxsdW1pbmF0ZShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk/LmdldENoaWxkcmVuQnlOYW1lKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKVswXTtcclxuICAgICAgbm9kZUxpZ2h0LmFjdGl2YXRlKF9vbik7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVGaWxlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgbWltZTogTUlNRSA9IF9lbnRyeS5nZXRNaW1lVHlwZSgpO1xyXG4gICAgICBzd2l0Y2ggKG1pbWUpIHtcclxuICAgICAgICBjYXNlIE1JTUUuVEVYVDogcmV0dXJuIHRoaXMuY3JlYXRlVGV4dFByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgICBjYXNlIE1JTUUuQVVESU86IHJldHVybiB0aGlzLmNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5JTUFHRTogcmV0dXJuIHRoaXMuY3JlYXRlSW1hZ2VQcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0UHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIHByZS50ZXh0Q29udGVudCA9IF9lbnRyeS5nZXRGaWxlQ29udGVudCgpO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgIGltZy5zcmMgPSBfZW50cnkucGF0aDtcclxuICAgICAgaW1nLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIGJsYWNrXCI7XHJcbiAgICAgIHJldHVybiBpbWc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgYXVkaW86IEhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgIGF1ZGlvLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgIGF1ZGlvLmNvbnRyb2xzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGF1ZGlvO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY3JpcHRQcmV2aWV3KF9zY3JpcHQ6IEZ1bmN0aW9uKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIGxldCBjb2RlOiBzdHJpbmcgPSBfc2NyaXB0LnRvU3RyaW5nKCk7XHJcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoXCIgICAgXCIsIFwiIFwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gY29kZTtcclxuICAgICAgcmV0dXJuIHByZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICAvLyBpZiAoW8aSLkF1ZGlvLCDGki5UZXh0dXJlLCDGki5BbmltYXRpb25TcHJpdGVdLnNvbWUoKF90eXBlKSA9PiB0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgX3R5cGUpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkF1ZGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5UZXh0dXJlIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TcHJpdGUpXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuZGV0YWlsKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgZWxzZSBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YS5zY3JpcHQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSBfZXZlbnQuZGV0YWlsLmRhdGE7XHJcblxyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5yZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldENhbWVyYSgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKGJyYW5jaCk7XHJcbiAgICAgIGxldCByOiBudW1iZXIgPSBicmFuY2gucmFkaXVzO1xyXG5cclxuICAgICAgdGhpcy5jbXJPcmJpdC5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IMaSLlZlY3RvcjMuWkVSTygpO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblggPSAtMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQucm90YXRpb25ZID0gMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgPSByICogMztcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5jbXJPcmJpdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcjogdW5rbm93bikge1xyXG4gICAgICAgIC8vbm9wXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBkZWZlcihfZnVuY3Rpb246IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVvdXREZWZlcilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMudGltZW91dERlZmVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIF9mdW5jdGlvbigpO1xyXG4gICAgICAgIHRoaXMudGltZW91dERlZmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBwcm9wZXJ0aWVzIG9mIGEgcmVzb3VyY2VcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1Byb3BlcnRpZXMgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzb3VyY2UpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250ZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9wZXJ0aWVzIHwgXCIgKyB0aGlzLnJlc291cmNlLm5hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSkge1xyXG4gICAgICAgICAgbGV0IGZpZWxkc2V0OiDGknVpLkRldGFpbHMgPSDGknVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUodGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsZXQgdWlNdXRhYmxlOiBDb250cm9sbGVyRGV0YWlsID0gbmV3IENvbnRyb2xsZXJEZXRhaWwodGhpcy5yZXNvdXJjZSwgZmllbGRzZXQsIHRoaXMpO1xyXG4gICAgICAgICAgY29udGVudCA9IHVpTXV0YWJsZS5kb21FbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIERpcmVjdG9yeUVudHJ5ICYmIHRoaXMucmVzb3VyY2Uuc3RhdHMpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiU2l6ZTogXCIgKyAodGhpcy5yZXNvdXJjZS5zdGF0c1tcInNpemVcIl0gLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS2lCPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiQ3JlYXRlZDogXCIgKyB0aGlzLnJlc291cmNlLnN0YXRzW1wiYmlydGh0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBcIk1vZGlmaWVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJjdGltZVwiXS50b0xvY2FsZVN0cmluZygpICsgXCI8YnIvPlwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSB7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IHRoaXMucmVzb3VyY2UudG9IaWVyYXJjaHlTdHJpbmcoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5yZXNvdXJjZS5zY3JpcHQpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gdGhpcy5yZXNvdXJjZS5zY3JpcHRba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICB2YWx1ZSA9IFwiQXJyYXkoXCIgKyB2YWx1ZS5sZW5ndGggKyBcIilcIjtcclxuICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0ga2V5ICsgXCI6IFwiICsgdmFsdWUgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpIHtcclxuICAgICAgICAgIGxldCBlbnRyaWVzOiB7IFtuYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLnJlc291cmNlLmVudHJpZXMpIHtcclxuICAgICAgICAgICAgZW50cmllc1tlbnRyeS50eXBlXSA9IChlbnRyaWVzW2VudHJ5LnR5cGVdID8/IDApICsgMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gYEVudHJpZXM6ICR7dGhpcy5yZXNvdXJjZS5lbnRyaWVzLmxlbmd0aH08YnIvPmA7XHJcbiAgICAgICAgICBmb3IgKGxldCB0eXBlIGluIGVudHJpZXMpXHJcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IGAke3R5cGV9OiAke2VudHJpZXNbdHlwZV19PGJyLz5gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiUHJvcGVydGllc1wiKTtcclxuICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IFwiU2VsZWN0IGFuIGludGVybmFsIG9yIGV4dGVybmFsIHJlc291cmNlIHRvIGV4YW1pbmUgcHJvcGVydGllc1wiO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZChjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLnJlc291cmNlID0gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPihfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIHNjcmlwdHMgbG9hZGVkXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMC0yM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3U2NyaXB0IGV4dGVuZHMgVmlldyB7XHJcbiAgICAvLyBUT0RPOiBjb25zaWRlciBzY3JpcHQgbmFtZXNwYWNlcyDGki5TY3JpcHROYW1lc3BhY2VzIHRvIGZpbmQgYWxsIHNjcmlwdHMgbm90IGp1c3QgQ29tcG9uZW50U2NyaXB0c1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTxTY3JpcHRJbmZvPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RTY3JpcHRzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGBEcmFnICYgZHJvcCBzY3JpcHRzIG9uIFwiQ29tcG9uZW50c1wiYDtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgbGV0IHNjcmlwdGluZm9zOiBTY3JpcHRJbmZvW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgbmFtZXNwYWNlIGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcykge1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4IGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdKSB7XHJcbiAgICAgICAgICBsZXQgc2NyaXB0OiBGdW5jdGlvbiA9IMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdW2luZGV4XTtcclxuICAgICAgICAgIGlmIChzY3JpcHQubmFtZSlcclxuICAgICAgICAgICAgc2NyaXB0aW5mb3MucHVzaChuZXcgU2NyaXB0SW5mbyhzY3JpcHQsIG5hbWVzcGFjZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8U2NyaXB0SW5mbz4obmV3IENvbnRyb2xsZXJUYWJsZVNjcmlwdCgpLCBzY3JpcHRpbmZvcyk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogU2NyaXB0SW5mb1tdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBTY3JpcHRJbmZvW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIC8vIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgIC8vICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgLy8gICByZXR1cm4gbWVudTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmRldGFpbC5kYXRhKVxyXG4gICAgICAgICAgICB0aGlzLmxpc3RTY3JpcHRzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iXX0=