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
        TRANSFORM["NONE"] = "none";
        TRANSFORM["TRANSLATE"] = "translate";
        TRANSFORM["ROTATE"] = "rotate";
        TRANSFORM["SCALE"] = "scale";
        TRANSFORM["WORLD"] = "world";
        TRANSFORM["LOCAL"] = "local";
    })(TRANSFORM = Fudge.TRANSFORM || (Fudge.TRANSFORM = {}));
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
            "red",
            "limegreen",
            "blue",
            "cyan",
            "magenta",
            "yellow",
            "salmon",
            "lightgreen",
            "cornflowerblue"
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
            // when drag enter a view, get the original source view for dragging and call hndDragEnter
            _this.dom.addEventListener("dragenter" /* ƒui.EVENT.DRAG_ENTER */, (_event) => {
                _event.stopPropagation();
                _this.hndDragEnter(_event, View.getViewSource(_event));
            });
            // when dragging over a view, get the original source view for dragging and call hndDragOver
            _this.dom.addEventListener("dragover" /* ƒui.EVENT.DRAG_OVER */, (_event) => {
                _event.stopPropagation();
                _this.hndDragOver(_event, View.getViewSource(_event));
            });
            // drag over during capture phase, allows views to prevent event reaching the actual target
            _this.dom.addEventListener("dragover" /* ƒui.EVENT.DRAG_OVER */, _event => _this.hndDragOverCapture(_event, View.getViewSource(_event)), true);
            // when dropping into a view, get the original source view for dragging and call hndDrop
            _this.dom.addEventListener("drop" /* ƒui.EVENT.DROP */, (_event) => {
                // _event.stopPropagation();
                _this.hndDrop(_event, View.getViewSource(_event));
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
        hndDragEnter(_event, _source) {
            // _event.dataTransfer.dropEffect = "link";
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
            this.tree = new ƒui.Tree(new Fudge.ControllerTreeDirectory(), root);
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
            while (item != this.dom && !(item instanceof ƒui.TreeItem))
                item = item.parentElement;
            if (item == this.dom) {
                item = this.tree.findVisible(this.resourceFolder);
                item.focus();
            }
            if (!(item instanceof ƒui.TreeItem))
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
            this.tree = new ƒui.Tree(new Fudge.ControllerTreeResource(), this.resourceFolder);
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
            const files = []; // collect files that are no longer registered in the project
            for (const descendant of this.resourceFolder)
                if (!(descendant instanceof Fudge.ResourceFolder) && !ƒ.Project.resources[descendant.idResource])
                    files.push(descendant);
            for (const file of files) // remove them 
                this.controller.remove(file);
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
    class ControllerTreeDirectory extends ƒUi.TreeController {
        sortable = false;
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
        canAddChildren(_sources, _target) {
            return _target.isDirectory;
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
    class ControllerTreeHierarchy extends ƒUi.TreeController {
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
    class ControllerTreeParticleSystem extends ƒui.TreeController {
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
    class ControllerTreeResource extends ƒui.TreeController {
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
            // TODO: Maybe the tree controller should provide the selected entries?
            let expend = this.selection.length > 0 ? this.selection : _focussed;
            let iRoot = expend.indexOf(Fudge.project.resourceFolder);
            if (iRoot > -1)
                expend.splice(iRoot, 1);
            let files = new Set();
            let folders = new Set();
            for (let expendable of expend)
                this.collectEntries(expendable, files, folders);
            let serializations = ƒ.Project.serialize();
            let serializationStrings = new Map();
            let usages = {};
            for (let idResource in serializations)
                serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));
            for (let file of files) {
                usages[file.idResource] = [];
                for (let resource of serializationStrings.keys())
                    if (resource.idResource != file.idResource)
                        if (serializationStrings.get(resource).indexOf(file.idResource) > -1)
                            usages[file.idResource].push(resource.name + " " + resource.type);
            }
            if (expend.length > 0 && await openDialog()) {
                let deletedFiles = [];
                for (let selected of files)
                    if (usages[selected.idResource].length == 0) // delete only unused
                        deletedFiles.push(selected);
                for (let resource of deletedFiles) {
                    ƒ.Project.deregister(resource);
                    this.remove(resource);
                    this.selection.splice(this.selection.indexOf(resource), 1);
                }
                let deletedFolders = [];
                for (let folder of folders)
                    this.deleteFolders(folder, deletedFolders);
                return [...deletedFiles, ...deletedFolders];
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
        collectEntries(_entry, _files, _folders) {
            if (_entry instanceof ResourceFolder) {
                for (let entry of _entry.entries)
                    this.collectEntries(entry, _files, _folders);
                _folders.add(_entry);
            }
            else {
                _files.add(_entry);
            }
        }
        deleteFolders(_folder, _deleted) {
            for (let entry of _folder.entries)
                if (entry instanceof ResourceFolder)
                    this.deleteFolders(entry, _deleted);
            if (_folder.entries.length == 0) {
                this.remove(_folder);
                this.selection.splice(this.selection.indexOf(_folder), 1);
                _deleted.push(_folder);
            }
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
        hndDragEnter(_event, _source) {
            this.hndDragOver(_event, _source);
        }
        hndDragOver(_event, _viewSource) {
            _event.stopPropagation();
            if (_viewSource != this)
                _event.dataTransfer.dropEffect = "none";
            let source = _viewSource.getDragDropSources()[0];
            let isParticleSystem = _viewSource instanceof Fudge.ViewHierarchy && source instanceof ƒ.Node && source.getComponent(ƒ.ComponentParticleSystem)?.particleSystem != null && !this.tree?.contains(_event.target);
            if (!isParticleSystem)
                return;
            _event.dataTransfer.dropEffect = "link";
            _event.preventDefault();
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
            this.tree = new ƒui.Tree(this.controller, this.data);
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
            this.tree = new ƒUi.Tree(new Fudge.ControllerTreeHierarchy(), this.graph);
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
        transformator;
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
            this.dom.addEventListener("keydown" /* ƒUi.EVENT.KEY_DOWN */, this.hndKey);
            this.dom.addEventListener("contextmenu" /* ƒUi.EVENT.CONTEXTMENU */, this.openContextMenu);
            this.dom.addEventListener("pointermove", this.hndPointer);
            this.dom.addEventListener("mousedown", () => this.#pointerMoved = false); // reset pointer move
            if (_state["gizmosFilter"]) {
                let gizmosFilter = _state["gizmosFilter"];
                for (const gizmo in gizmosFilter) // validate the saved state
                    if (gizmo in this.gizmosFilter)
                        this.gizmosFilter[gizmo] = gizmosFilter[gizmo];
            }
            if (_state["renderContinuously"])
                this.setRenderContinously(_state["renderContinuously"]);
        }
        get gizmosFilter() {
            return this.viewport?.gizmosFilter;
        }
        //#region  ContextMenu
        getContextMenu(_callback) {
            const menu = new Fudge.remote.Menu();
            let item;
            item = new Fudge.remote.MenuItem({
                label: "Transform", submenu: [
                    { label: "None", id: Fudge.TRANSFORM.NONE, type: "radio", click: _callback, accelerator: "Q" },
                    { label: "Translate", id: Fudge.TRANSFORM.TRANSLATE, type: "radio", click: _callback, accelerator: "W" },
                    { label: "Rotate", id: Fudge.TRANSFORM.ROTATE, type: "radio", click: _callback, accelerator: "E" },
                    { label: "Scale", id: Fudge.TRANSFORM.SCALE, type: "radio", click: _callback, accelerator: "R" },
                    { type: "separator" },
                    { label: "World", id: Fudge.TRANSFORM.WORLD, type: "radio", click: _callback, accelerator: "G" },
                    { label: "Local", id: Fudge.TRANSFORM.LOCAL, type: "radio", click: _callback, accelerator: "G" }
                ]
            });
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
                case Fudge.TRANSFORM.NONE:
                case Fudge.TRANSFORM.TRANSLATE:
                case Fudge.TRANSFORM.ROTATE:
                case Fudge.TRANSFORM.SCALE:
                    Fudge.Page.setTransform(_item.id);
                    this.transformator.mode = _item.id;
                    this.redraw();
                    break;
                case Fudge.TRANSFORM.WORLD:
                case Fudge.TRANSFORM.LOCAL:
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
                case String(Fudge.CONTEXTMENU.ORTHGRAPHIC_CAMERA):
                    this.setCameraOrthographic(_item.checked);
                    break;
                case String(Fudge.CONTEXTMENU.RENDER_CONTINUOUSLY):
                    this.setRenderContinously(_item.checked);
                    break;
                default:
                    if (!(_item.id in this.gizmosFilter))
                        break;
                    this.gizmosFilter[_item.id] = _item.checked;
                    this.redraw();
                    break;
            }
        }
        openContextMenu = (_event) => {
            if (!this.#pointerMoved) {
                for (const gizmo in this.gizmosFilter)
                    this.contextMenu.getMenuItemById(gizmo).checked = this.gizmosFilter[gizmo];
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
        getState() {
            let state = super.getState();
            state["gizmosFilter"] = this.gizmosFilter;
            state["renderContinuously"] = this.contextMenu.getMenuItemById(String(Fudge.CONTEXTMENU.RENDER_CONTINUOUSLY)).checked;
            return state;
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
            this.viewport.initialize("ViewNode_Viewport", null, cmpCamera, this.canvas);
            const redraw = () => { if (this.redrawId == undefined && this.graph)
                this.redraw(); };
            const translateOnPick = () => this.transformator.selected == null;
            this.cmrOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(this.viewport, false, undefined, undefined, undefined, redraw, translateOnPick);
            this.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
            this.viewport.addEventListener("renderPrepareStart" /* ƒ.EVENT.RENDER_PREPARE_START */, this.hndPrepare);
            this.setGraph(null);
            this.transformator = new ƒAid.Transformator(this.viewport);
            this.canvas.addEventListener("pointerdown", this.activeViewport);
            this.canvas.addEventListener("pick", this.hndPick);
            let submenu = [];
            for (const gizmo in this.gizmosFilter)
                submenu.push({ label: gizmo, id: gizmo, type: "checkbox", click: this.contextMenuCallback.bind(this) });
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
            this.transformator.mtxLocal = null;
            this.transformator.mtxWorld = null;
            this.transformator.clearUndo();
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
                        this.transformator.mtxLocal = this.node.mtxLocal;
                        this.transformator.mtxWorld = this.node.mtxWorld;
                        this.viewport.gizmosSelected = [this.node];
                    }
                    break;
                case Fudge.EVENT_EDITOR.FOCUS:
                    this.cmrOrbit.mtxLocal.translation = detail.node.mtxWorld.translation;
                    ƒ.Render.prepare(this.cmrOrbit);
                    break;
                case Fudge.EVENT_EDITOR.CLOSE:
                    this.setRenderContinously(false);
                    this.viewport.gizmosSelected = null;
                    break;
                case Fudge.EVENT_EDITOR.UPDATE:
                    if (!this.viewport.camera.isActive)
                        this.viewport.camera = this.cmrOrbit.cmpCamera;
            }
            this.redraw();
        };
        hndKey = (_event) => {
            switch (_event.code) {
                case ƒ.KEYBOARD_CODE.Q:
                    this.contextMenu.getMenuItemById(Fudge.TRANSFORM.NONE).click();
                    break;
                case ƒ.KEYBOARD_CODE.W:
                    this.contextMenu.getMenuItemById(Fudge.TRANSFORM.TRANSLATE).click();
                    break;
                case ƒ.KEYBOARD_CODE.E:
                    this.contextMenu.getMenuItemById(Fudge.TRANSFORM.ROTATE).click();
                    break;
                case ƒ.KEYBOARD_CODE.R:
                    this.contextMenu.getMenuItemById(Fudge.TRANSFORM.SCALE).click();
                    break;
                case ƒ.KEYBOARD_CODE.G:
                    this.contextMenu.getMenuItemById(this.transformator.space == Fudge.TRANSFORM.LOCAL ? Fudge.TRANSFORM.WORLD : Fudge.TRANSFORM.LOCAL).click();
                    break;
                case ƒ.KEYBOARD_CODE.Y:
                    if (_event.ctrlKey) {
                        this.transformator.undo();
                        break;
                    }
            }
        };
        hndPick = (_event) => {
            if (this.transformator.selected)
                return;
            let pick = _event.detail;
            //TODO: watch out, two selects
            this.dispatch(Fudge.EVENT_EDITOR.SELECT, { bubbles: true, detail: { node: pick.node } });
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
                ƒ.Debug.error(_error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udGV4dE1lbnUudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvRGVmaW5pdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9EaXJlY3RvcnlFbnRyeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9FdmVudC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9GaWxlSU8udHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvUGFnZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Qcm9qZWN0LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXcudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdFeHRlcm5hbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlckRldGFpbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUYWJsZVJlc291cmNlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRhYmxlU2NyaXB0cy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9Db250cm9sbGVyL0NvbnRyb2xsZXJUcmVlRGlyZWN0b3J5LnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVIaWVyYXJjaHkudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvQ29udHJvbGxlci9Db250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL0NvbnRyb2xsZXIvQ29udHJvbGxlclRyZWVSZXNvdXJjZS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEFuaW1hdGlvbi50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbEdyYXBoLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsSGVscC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9QYW5lbC9QYW5lbFBhcnRpY2xlU3lzdGVtLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1BhbmVsL1BhbmVsUHJvamVjdC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1ZpZXdQYXJ0aWNsZVN5c3RlbS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0FuaW1hdGlvbi9WaWV3QW5pbWF0aW9uLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvQW5pbWF0aW9uL1ZpZXdBbmltYXRpb25TaGVldC50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdDb21wb25lbnRzLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvR3JhcGgvVmlld0hpZXJhcmNoeS50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L0dyYXBoL1ZpZXdSZW5kZXIudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdJbnRlcm5hbFRhYmxlLnRzIiwiLi4vLi4vU291cmNlL0Z1ZGdlL1ZpZXcvUHJvamVjdC9WaWV3UHJldmlldy50cyIsIi4uLy4uL1NvdXJjZS9GdWRnZS9WaWV3L1Byb2plY3QvVmlld1Byb3BlcnRpZXMudHMiLCIuLi8uLi9Tb3VyY2UvRnVkZ2UvVmlldy9Qcm9qZWN0L1ZpZXdTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBaUNkO0FBakNELFdBQVUsS0FBSztJQUNiLG1DQUFtQztJQUNuQyx3QkFBd0I7SUFTeEIsTUFBYSxXQUFXO1FBQ2YsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFvQjtZQUNoRCxLQUFL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RSxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3RILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsSUFB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QUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3RGLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3ZGLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDeEQsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUUzQyxJQUFJLFlBQVksWUFBWSxDQUFDLENBQUMsU0FBUztnQkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEUsSUFBSSxZQUFZLFlBQVksQ0FBQyxDQUFDLFNBQVM7Z0JBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXJFLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO1FBRU0sVUFBVSxDQUFDLFVBQXFCLEVBQUUsTUFBaUIsRUFBRSxhQUEwQixFQUFFLFNBQWlCO1lBQ3hHLFFBQVEsVUFBVSxFQUFFLENBQUM7Z0JBQ25CLEtBQUssTUFBQSxTQUFTLENBQUMsU0FBUztvQkFDdEIsSUFBSSxpQkFBaUIsR0FBVyxLQUFLLENBQUMsQ0FBQyxnQ0FBZ0M7b0JBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLENBQUM7b0JBQzVDLElBQUksV0FBVyxHQUFjLGFBQWEsQ0FBQyxXQUFXLENBQUM7b0JBQ3ZELFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3hCLGFBQWEsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUN4QyxNQUFNO2dCQUNSLEtBQUssTUFBQSxTQUFTLENBQUMsTUFBTTtvQkFDbkIsSUFBSSxjQUFjLEdBQVcsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO29CQUNoRSxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM3QixJQUFJLFFBQVEsR0FBYyxhQUFhLENBQUMsUUFBUSxDQUFDO29CQUNqRCxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNyQixhQUFhLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDbEMsTUFBTTtnQkFDUixLQUFLLE1BQUEsU0FBUyxDQUFDLEtBQUs7b0JBQ2xCLElBQUksYUFBYSxHQUFXLEtBQUssQ0FBQyxDQUFDLGdDQUFnQztvQkFDbkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxPQUFPLEdBQWMsYUFBYSxDQUFDLE9BQU8sQ0FBQztvQkFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEIsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ2hDLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQztRQUVPLFVBQVUsQ0FBQyxVQUFxQixFQUFFLE1BQWlCLEVBQUUsYUFBMEIsRUFBRSxTQUFpQjtZQUN4RyxRQUFRLFVBQVUsRUFBRSxDQUFDO2dCQUNuQixLQUFLLE1BQUEsU0FBUyxDQUFDLFNBQVM7b0JBQ3RCLElBQUksaUJBQWlCLEdBQVcsS0FBSyxDQUFDLENBQUMsZ0NBQWdDO29CQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLFdBQVcsR0FBYyxhQUFhLENBQUMsV0FBVyxDQUFDO29CQUN2RCxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN4QixhQUFhLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztvQkFDeEMsTUFBTTtnQkFDUixLQUFLLE1BQUEsU0FBUyxDQUFDLE1BQU07b0JBQ25CLElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztvQkFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDN0IsYUFBYSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNO2dCQUNSLEtBQUssTUFBQSxTQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxhQUFhLEdBQVcsS0FBSyxDQUFDLENBQUMsZ0NBQWdDO29CQUNuRSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM1QixJQUFJLE9BQU8sR0FBYyxhQUFhLENBQUMsT0FBTyxDQUFDO29CQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQixhQUFhLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztvQkFDaEMsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDO1FBRU8sTUFBTSxDQUFDLFFBQXFCLEVBQUUsU0FBa0IsSUFBSTtZQUMxRCxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUTtnQkFDakMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLElBQUksTUFBTTtnQkFDUixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVPLFdBQVc7WUFDakIsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQ2pDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO29CQUN0QyxPQUFvQixLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUVPLGVBQWUsQ0FBQyxTQUFpQjtZQUN2QyxJQUFJLFNBQVMsWUFBWSxNQUFBLFVBQVU7Z0JBQ2pDLElBQUksU0FBUyxDQUFDLFdBQVc7b0JBQ3ZCLE9BQU8sSUFBZ0IsU0FBUyxDQUFDLE1BQU8sRUFBRSxDQUFDO1lBRS9DLElBQUksYUFBYSxHQUF1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUUsT0FBTyxJQUFnQixhQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVPLGlCQUFpQixDQUFDLFNBQWlCO1lBQ3pDLEtBQUssSUFBSSxLQUFLLElBQUksbUJBQW1CO2dCQUNuQyxJQUFJLFNBQVMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMvQixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixDQUFDO0tBS0Y7SUEvWFksb0JBQWMsaUJBK1gxQixDQUFBO0FBQ0gsQ0FBQyxFQXJaUyxLQUFLLEtBQUwsS0FBSyxRQXFaZDtBQ3JaRCxJQUFVLEtBQUssQ0FvTmQ7QUFwTkQsV0FBVSxLQUFLO0lBQ2IsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQU8sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBRWhDOzs7T0FHRztJQUNILE1BQWEsYUFBYyxTQUFRLE1BQUEsSUFBSTtRQUM3QixLQUFLLENBQVU7UUFDZixJQUFJLENBQW1CO1FBQ3ZCLGlCQUFpQixHQUFhLEVBQUUsQ0FBQztRQUV6QyxZQUFtQixVQUE4QixFQUFFLE1BQWlCO1lBQ2xFLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwQixJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5RCxrSEFBa0g7WUFDbEgsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxJQUFZLFNBQVM7WUFDbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDeEMsQ0FBQztRQUVNLFFBQVEsQ0FBQyxNQUFlO1lBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUV4QixJQUFJLElBQUksQ0FBQyxLQUFLO2dCQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFaEUsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDcEIsNEJBQTRCO1lBRTVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFTLElBQUksTUFBQSx1QkFBdUIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RSxzRUFBc0U7WUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0Isc0NBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixrQ0FBbUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLGtDQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsNENBQXdCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsNEZBQTRGLENBQUM7WUFDOUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsbUNBQW1DLENBQUM7WUFFdEQsSUFBSSxRQUFRLEdBQWEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksUUFBUTtnQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFTSxrQkFBa0I7WUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQy9DLENBQUM7UUFFUyxrQkFBa0IsQ0FBQyxNQUFpQixFQUFFLFdBQWlCO1lBQy9ELElBQUksV0FBVyxJQUFJLElBQUk7Z0JBQ3JCLE9BQU8sQ0FBQyx3Q0FBd0M7WUFFbEQsSUFBSSxXQUFXLFlBQVksTUFBQSxZQUFZLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxJQUFJLENBQUMsSUFBSTtvQkFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBc0IsRUFBRSxDQUFDLE9BQU8sWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9JLE9BQU87WUFDVCxDQUFDO1lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRVMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFpQixFQUFFLFdBQWlCO1lBQ2pFLElBQUksV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJO2dCQUNuRCxPQUFPLENBQUMsd0NBQXdDO1lBRWxELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN6QixJQUFJLFNBQVMsR0FBc0IsRUFBRSxDQUFDO1lBQ3RDLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU87Z0JBQ3JELElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxLQUFLO29CQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw4QkFBaUIsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFFRCxzQkFBc0I7UUFDWixjQUFjLENBQUMsU0FBOEI7WUFDckQsTUFBTSxJQUFJLEdBQWtCLElBQUksTUFBQSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUF1QixDQUFDO1lBRTVCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFBLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3pILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRVMsbUJBQW1CLENBQUMsS0FBd0IsRUFBRSxPQUErQixFQUFFLE1BQXNCO1lBQzdHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixNQUFBLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELElBQUksS0FBSyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFNUMsUUFBUSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLEtBQUssTUFBQSxXQUFXLENBQUMsUUFBUTtvQkFDdkIsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDckMsTUFBTTtnQkFDUixLQUFLLE1BQUEsV0FBVyxDQUFDLGFBQWE7b0JBQzVCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ3RELE1BQU07Z0JBQ1IsS0FBSyxNQUFBLFdBQVcsQ0FBQyxXQUFXO29CQUMxQix5QkFBeUI7b0JBQ3pCLElBQUksQ0FBQyxLQUFLO3dCQUNSLE9BQU87b0JBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxNQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN2RCxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUN0RCxNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUM7UUFDRCxZQUFZO1FBRUYsUUFBUTtZQUNoQixJQUFJLEtBQUssR0FBYyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCx1QkFBdUI7UUFDZixZQUFZLEdBQUcsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDbkQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCO29CQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ3RELE1BQU07Z0JBQ1I7b0JBQ0UsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQzFDLHFFQUFxRTt3QkFDckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDeEQsQ0FBQztvQkFDRCxNQUFNO2dCQUNSO29CQUNFLHVHQUF1RztvQkFDdkcsSUFBSSxJQUFJLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDM0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuRixNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVNLFFBQVEsR0FBRyxDQUFDLE1BQW1CLEVBQVEsRUFBRTtZQUMvQyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNO29CQUN0QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSzt3QkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7d0JBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsQ0FBQztvQkFDRCxNQUFNO2dCQUNSLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTTtvQkFDdEIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFBLFlBQVksSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFDaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDO29CQUNuRCxNQUFNO2dCQUNSLEtBQUssTUFBQSxZQUFZLENBQUMsS0FBSztvQkFDckIsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFDWixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7UUFDSCxDQUFDLENBQUM7UUFDRixZQUFZO1FBRUosYUFBYSxDQUFDLFFBQWdCLEVBQUUsU0FBbUI7WUFDekQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFFTyxlQUFlLENBQUMsUUFBZ0I7WUFDdEMsSUFBSSxNQUFNLEdBQVcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0RSxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFTyxXQUFXO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVGLENBQUM7UUFFTyxNQUFNLENBQUMsTUFBZ0I7WUFDN0IsTUFBTSxLQUFLLEdBQWUsTUFBTTtpQkFDN0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO2lCQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Y7SUEzTVksbUJBQWEsZ0JBMk16QixDQUFBO0FBQ0gsQ0FBQyxFQXBOUyxLQUFLLEtBQUwsS0FBSyxRQW9OZDtBQ3BORCxJQUFVLEtBQUssQ0F1WmQ7QUF2WkQsV0FBVSxLQUFLO0lBQ2IsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLElBQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUV2Qjs7O09BR0c7SUFDSCxNQUFhLFVBQVcsU0FBUSxNQUFBLElBQUk7UUFDMUIsUUFBUSxDQUFtQjtRQUMzQixRQUFRLENBQWE7UUFDckIsTUFBTSxDQUFvQjtRQUMxQixLQUFLLENBQVU7UUFDZixJQUFJLENBQVM7UUFDYixTQUFTLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMseUNBQXlDO1FBQ3pGLFFBQVEsQ0FBUztRQUVqQixhQUFhLENBQXFCO1FBRTFDLGFBQWEsR0FBWSxLQUFLLENBQUM7UUFFL0IsWUFBbUIsVUFBOEIsRUFBRSxNQUFpQjtZQUNsRSxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTFCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRTNCLElBQUksS0FBSyxHQUFXLDBDQUEwQyxDQUFDO1lBQy9ELEtBQUssSUFBSSw4RUFBOEUsQ0FBQztZQUN4RixLQUFLLElBQUksNERBQTRELENBQUM7WUFDdEUsS0FBSyxJQUFJLDhDQUE4QyxDQUFDO1lBQ3hELEtBQUssSUFBSSxtRUFBbUUsQ0FBQztZQUM3RSxLQUFLLElBQUksMERBQTBELENBQUM7WUFDcEUsS0FBSyxJQUFJLHdGQUF3RixDQUFDO1lBQ2xHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFdEIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixxQ0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLDRDQUF3QixJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7WUFFL0YsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxZQUFZLEdBQStCLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDdEUsS0FBSyxNQUFNLEtBQUssSUFBSSxZQUFZLEVBQUUsMkJBQTJCO29CQUMzRCxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsWUFBWTt3QkFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELElBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDO2dCQUM5QixJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQsSUFBWSxZQUFZO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUM7UUFDckMsQ0FBQztRQUVELHNCQUFzQjtRQUNaLGNBQWMsQ0FBQyxTQUE4QjtZQUNyRCxNQUFNLElBQUksR0FBa0IsSUFBSSxNQUFBLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QyxJQUFJLElBQXVCLENBQUM7WUFFNUIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRTtvQkFDM0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFBLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQ3hGLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsTUFBQSxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO29CQUNsRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQUEsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRTtvQkFDNUYsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQzFGLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtvQkFDckIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQzFGLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBQSxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO2lCQUMzRjthQUNGLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRTtvQkFDL0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtvQkFDekUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtvQkFDOUUsRUFBRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO29CQUNuRyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7b0JBQ25GLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7b0JBQzdFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7aUJBQ2xGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFBLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM5SSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVTLG1CQUFtQixDQUFDLEtBQXdCLEVBQUUsT0FBK0IsRUFBRSxNQUFzQjtZQUM3RyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFaEQsUUFBUSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pCLEtBQUssTUFBQSxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNwQixLQUFLLE1BQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQztnQkFDekIsS0FBSyxNQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLEtBQUssTUFBQSxTQUFTLENBQUMsS0FBSztvQkFDbEIsTUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLE1BQU07Z0JBQ1IsS0FBSyxNQUFBLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JCLEtBQUssTUFBQSxTQUFTLENBQUMsS0FBSztvQkFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDcEMsTUFBTTtnQkFDUixLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25ELEtBQUssQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEQsS0FBSyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ2xFLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDN0QsS0FBSyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUM7b0JBQy9ELElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLE1BQU07Z0JBQ1IsS0FBSyxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsa0JBQWtCLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzFDLE1BQU07Z0JBQ1IsS0FBSyxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsbUJBQW1CLENBQUM7b0JBQzFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLE1BQU07Z0JBQ1I7b0JBQ0UsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDO3dCQUNsQyxNQUFNO29CQUVSLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQzVDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUM7UUFFUyxlQUFlLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZO29CQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQixDQUFDO1lBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQyxDQUFDO1FBQ0YsWUFBWTtRQUVGLFdBQVcsQ0FBQyxNQUFpQixFQUFFLFdBQWlCO1lBQ3hELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUV4QyxJQUFJLENBQUMsQ0FBQyxXQUFXLFlBQVksTUFBQSxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsK0ZBQStGO2dCQUM3SSxJQUFJLENBQUMsQ0FBQyxXQUFXLFlBQVksTUFBQSxZQUFZLENBQUMsRUFBRSx5QkFBeUI7b0JBQ25FLE9BQU87Z0JBRVQsSUFBSSxNQUFNLEdBQVcsV0FBVyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUM5QixPQUFPO1lBQ1gsQ0FBQztZQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUN4QyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFFUyxPQUFPLENBQUMsTUFBaUIsRUFBRSxXQUFpQjtZQUNwRCxJQUFJLE1BQU0sR0FBVyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLE1BQU0sWUFBWSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3hDLHFDQUFxQztnQkFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUM5QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixPQUFPO1lBQ1QsQ0FBQztRQUNILENBQUM7UUFFUyxRQUFRO1lBQ2hCLElBQUksS0FBSyxHQUFjLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUMxQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNoSCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFTyxtQkFBbUI7WUFDekIsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVoRCxJQUFJLFNBQVMsR0FBc0IsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RSxJQUFJLFNBQVMsR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5RCxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQ25DLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1RSxNQUFNLE1BQU0sR0FBRyxHQUFTLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLO2dCQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNLGVBQWUsR0FBRyxHQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7WUFFM0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQztZQUN6RSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQiwwREFBK0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTlFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkQsSUFBSSxPQUFPLEdBQTBDLEVBQUUsQ0FBQztZQUN4RCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZO2dCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUMxQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPO2FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUVPLFFBQVEsQ0FBQyxLQUFjO1lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsMkJBQTJCLENBQUM7Z0JBQ2pELE9BQU87WUFDVCxDQUFDO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLE1BQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEtBQUssa0RBQTBCLENBQUMsQ0FBQztZQUMvRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDO1lBQ3pFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTyxxQkFBcUIsQ0FBQyxNQUFlLEtBQUs7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDL0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQy9CLENBQUM7aUJBQU0sQ0FBQztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQy9CLENBQUM7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDdkYsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBRU8sVUFBVSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7WUFDM0MsSUFBSSxXQUFXLEdBQWtCLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3ZELElBQUksYUFBYSxHQUFZLEtBQUssQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBMEMsRUFBRSxFQUFFLENBQUMsYUFBYSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsSUFBSSxDQUFDLGFBQWE7b0JBQ2hCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixzREFBNkIsV0FBVyxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0Isc0RBQTZCLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQztRQUVNLFFBQVEsR0FBRyxDQUFDLE1BQW1CLEVBQVEsRUFBRTtZQUMvQyxJQUFJLE1BQU0sR0FBNkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNyRCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNO29CQUN0QixJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBQSxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyRyxDQUFDO29CQUNELElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFFakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLENBQUM7b0JBQ0QsTUFBTTtnQkFDUixLQUFLLE1BQUEsWUFBWSxDQUFDLEtBQUs7b0JBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7b0JBQ3RFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsTUFBTTtnQkFDUixLQUFLLE1BQUEsWUFBWSxDQUFDLEtBQUs7b0JBQ3JCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUNwQyxNQUFNO2dCQUNSLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTTtvQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVE7d0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3JELENBQUM7WUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRU0sTUFBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO1lBQy9DLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBQSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3pELE1BQU07Z0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLE1BQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUM5RCxNQUFNO2dCQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDM0QsTUFBTTtnQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBQSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQzFELE1BQU07Z0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLE1BQUEsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBQSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFBLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDMUgsTUFBTTtnQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQzFCLE1BQU07b0JBQ1IsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUM7UUFFTSxPQUFPLEdBQUcsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDOUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVE7Z0JBQzdCLE9BQU87WUFFVCxJQUFJLElBQUksR0FBbUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUV6Qyw4QkFBOEI7WUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLDBHQUEwRztRQUM1RyxDQUFDLENBQUM7UUFFRixxQ0FBcUM7UUFDckMsd0NBQXdDO1FBQ3hDLHFFQUFxRTtRQUNyRSw0QkFBNEI7UUFDNUIsSUFBSTtRQUVJLFVBQVUsR0FBRyxDQUFDLE1BQW9CLEVBQVEsRUFBRTtZQUNsRCxJQUFJLENBQUMsYUFBYSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV4RSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksV0FBbUIsQ0FBQztZQUV4QixJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbEYsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDaEIsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELFdBQVcsR0FBRyxHQUFHLENBQUM7aUJBQ2YsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELFdBQVcsR0FBRyxHQUFHLENBQUM7aUJBQ2YsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELFdBQVcsR0FBRyxHQUFHLENBQUM7WUFFcEIsSUFBSSxDQUFDLFdBQVc7Z0JBQ2QsT0FBTztZQUVULElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNqQyxJQUFJLElBQUksR0FBVztnQkFDakIsU0FBUyxFQUFFLE1BQUEsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7YUFDM0osQ0FBQztZQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRU0sY0FBYyxHQUFHLENBQUMsTUFBa0IsRUFBUSxFQUFFO1lBQ3BELENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLE1BQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQyxDQUFDO1FBRU0sTUFBTSxHQUFHLEdBQVMsRUFBRTtZQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUM7Z0JBQ2xGLE9BQU87WUFDVCxJQUFJLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsTUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixDQUFDO1lBQUMsT0FBTyxNQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIseUJBQXlCO2dCQUN6QixLQUFLO1lBQ1AsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVNLG9CQUFvQixDQUFDLEdBQVk7WUFDdkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDUixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFO29CQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDaEIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQzFGLENBQUM7S0FDRjtJQTdZWSxnQkFBVSxhQTZZdEIsQ0FBQTtBQUNILENBQUMsRUF2WlMsS0FBSyxLQUFMLEtBQUssUUF1WmQ7QUN2WkQsSUFBVSxLQUFLLENBcVNkO0FBclNELFdBQVUsS0FBSztJQUNiLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztJQUVyQixzQkFBZ0IsR0FBZ0I7UUFDekMsQ0FBQyxDQUFDLElBQUk7S0FDUCxDQUFDO0lBRUY7OztPQUdHO0lBQ0gsTUFBYSxpQkFBa0IsU0FBUSxNQUFBLFlBQVk7UUFDekMsS0FBSyxDQUFvQztRQUVqRCxZQUFtQixVQUE4QixFQUFFLE1BQWlCO1lBQ2xFLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5RCxpRUFBaUU7WUFDakUsK0RBQStEO1lBQy9ELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLGtDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0Isc0NBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQiw2Q0FBeUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLGtDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsNENBQXdCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRU0sYUFBYTtZQUNsQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQXlCLElBQUksTUFBQSx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5SCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsbUVBQW1FLENBQUM7WUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsdUdBQXVHLENBQUM7WUFFM0gsS0FBSyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2pELElBQUksR0FBRyxHQUFxQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTTtvQkFDYixTQUFTO2dCQUNYLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBcUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUUsSUFBSSxFQUFFLFlBQVksR0FBRyxDQUFDLFNBQVMsSUFBcUMsRUFBRSxDQUFDLElBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDL0csRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzFCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsa0VBQWtFLENBQUM7b0JBQzlFLE1BQU07Z0JBQ1IsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRU0sWUFBWTtZQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUN6QyxDQUFDO1FBRU0sa0JBQWtCO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNoRCxDQUFDO1FBRUQsOEZBQThGO1FBQzlGLHlEQUF5RDtRQUN6RCwySUFBMkk7UUFDM0ksYUFBYTtRQUNiLDRIQUE0SDtRQUM1SCw4QkFBOEI7UUFDOUIsSUFBSTtRQUVKLHVCQUF1QjtRQUNiLGNBQWMsQ0FBQyxTQUE4QjtZQUNyRCxNQUFNLElBQUksR0FBa0IsSUFBSSxNQUFBLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QyxJQUFJLElBQXVCLENBQUM7WUFHNUIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDaEksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxhQUFhO2dCQUNwQixPQUFPLEVBQUUsTUFBQSxXQUFXLENBQUMsZUFBZSxDQUFDLE1BQUEsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQzthQUNqRixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxCLElBQUksR0FBRyxJQUFJLE1BQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDekIsS0FBSyxFQUFFLGlCQUFpQjtnQkFDeEIsT0FBTyxFQUFFLE1BQUEsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFBLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7YUFDdkYsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCLE9BQU8sRUFBRSxNQUFBLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBQSxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7YUFDM0YsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUdsQixtSUFBbUk7WUFDbkkscUJBQXFCO1lBRXJCLHlJQUF5STtZQUN6SSxxQkFBcUI7WUFFckIsSUFBSSxHQUFHLElBQUksTUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDM0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixJQUFJLEdBQUcsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFBLFdBQVcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsdUlBQXVJO1lBQ3ZJLHFCQUFxQjtZQUdyQixxQ0FBcUM7WUFDckMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRVMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQXdCLEVBQUUsT0FBK0IsRUFBRSxNQUFzQjtZQUNuSCxJQUFJLE1BQU0sR0FBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsTUFBQSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxhQUFhLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDOUUsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxNQUFNLElBQUksTUFBQSxXQUFXLENBQUMsV0FBVyxJQUFJLE1BQU0sSUFBSSxNQUFBLFdBQVcsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO2dCQUMvRixLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztnQkFDbEQsT0FBTztZQUNULENBQUM7WUFFRCxRQUFRLE1BQU0sRUFBRSxDQUFDO2dCQUNmLDBDQUEwQztnQkFDMUMsS0FBSyxNQUFBLFdBQVcsQ0FBQyxXQUFXO29CQUMxQixJQUFJLFFBQVEsR0FBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzNELFlBQVk7b0JBQ1osSUFBSSxPQUFPLEdBQVcsSUFBSSxRQUFRLEVBQUUsQ0FBQztvQkFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM1QyxNQUFNO2dCQUNSLEtBQUssTUFBQSxXQUFXLENBQUMsZUFBZTtvQkFDOUIsSUFBSSxVQUFVLEdBQW9CLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNqRSxJQUFJLE1BQU0sR0FBZSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUMxQyxNQUFNO2dCQUNSLEtBQUssTUFBQSxXQUFXLENBQUMsWUFBWTtvQkFDM0IsSUFBSSxLQUFLLEdBQVksTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxNQUFNO2dCQUNSLEtBQUssTUFBQSxXQUFXLENBQUMsZ0JBQWdCO29CQUMvQixJQUFJLGFBQWEsR0FBdUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzFFLElBQUksU0FBUyxHQUFnQixJQUFJLGFBQWEsRUFBRSxDQUFDO29CQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ2hELE1BQU07Z0JBQ1IsS0FBSyxNQUFBLFdBQVcsQ0FBQyxzQkFBc0I7b0JBQ3JDLElBQUksY0FBYyxHQUFxQixJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUMxRCxNQUFNO2dCQUNSLEtBQUssTUFBQSxXQUFXLENBQUMsZUFBZTtvQkFDOUIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDO1FBQ0QsWUFBWTtRQUVGLFdBQVcsQ0FBQyxNQUFpQixFQUFFLFdBQWlCO1lBQ3hELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUN4QyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU07Z0JBQzNCLE9BQU87WUFFVCxJQUFJLENBQUMsQ0FBQyxXQUFXLFlBQVksTUFBQSxZQUFZLElBQUksV0FBVyxZQUFZLE1BQUEsYUFBYSxDQUFDO2dCQUNoRixPQUFPO1lBRVQsSUFBSSxXQUFXLFlBQVksTUFBQSxZQUFZLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxPQUFPLEdBQXFCLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNqRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQUEsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO29CQUMxRyxPQUFPO2dCQUNULDhCQUE4QjtnQkFDOUIsdUhBQXVIO2dCQUN2SCxjQUFjO1lBQ2hCLENBQUM7WUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDeEMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRVMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFpQixFQUFFLFdBQWlCO1lBQzFELElBQUksV0FBVyxZQUFZLE1BQUEsYUFBYSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksT0FBTyxHQUFhLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN6RCxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUMzQixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDaEQsQ0FBQztZQUNILENBQUM7aUJBQU0sSUFBSSxXQUFXLFlBQVksTUFBQSxZQUFZLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxPQUFPLEdBQXFCLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNqRSxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUMzQixRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO3dCQUM3QixLQUFLLE1BQUEsSUFBSSxDQUFDLEtBQUs7NEJBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQzlDLE1BQU07d0JBQ1IsS0FBSyxNQUFBLElBQUksQ0FBQyxLQUFLOzRCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNyRCxNQUFNO3dCQUNSLEtBQUssTUFBQSxJQUFJLENBQUMsSUFBSTs0QkFDWixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDN0QsTUFBTTt3QkFDUixLQUNFLE1BQUEsSUFBSSxDQUFDLElBQUk7NEJBQ1QsSUFBSSxNQUFNLEdBQWlCLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUN4RSxJQUFJLElBQUksR0FBWSxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQUEsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBRSwrQkFBK0IsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLDhCQUE4QixFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDbkwsSUFBSSxDQUFDLElBQUk7Z0NBQ1AsTUFBTTs0QkFFUixLQUFLLElBQUksSUFBSSxJQUFJLE1BQUEsWUFBWSxDQUFDLGtCQUFrQjtnQ0FBRSxJQUFJLE1BQUEsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0NBQzVGLElBQUksU0FBUyxHQUE2QixNQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0NBQzlFLEtBQUssSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFLENBQUM7d0NBQy9CLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDOzRDQUMzQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQ0FDakMsQ0FBQztnQ0FDSCxDQUFDOzRCQUVELE1BQU07b0JBQ1YsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVPLGdCQUFnQixHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO1lBQ3pELElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ25DLE9BQU87WUFFVCwwRUFBMEU7WUFDMUUsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxLQUFLO2dCQUNSLE9BQU87WUFFVCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRU0sUUFBUSxHQUFHLENBQUMsTUFBbUIsRUFBUSxFQUFFO1lBQy9DLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwQixLQUFLLE1BQUEsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDdkIsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ3pCLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUN6QixLQUFLLE1BQUEsWUFBWSxDQUFDLE1BQU07b0JBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU07Z0JBQ3ZCLE9BQU87WUFFVCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEI7b0JBQ0UsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvQyxNQUFNO2dCQUNSO29CQUNFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakQsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsK0NBQStDO29CQUN2RSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JCLE1BQU07Z0JBQ1I7b0JBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQ3JGLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDO0tBbUJIO0lBeFJZLHVCQUFpQixvQkF3UjdCLENBQUE7QUFDSCxDQUFDLEVBclNTLEtBQUssS0FBTCxLQUFLLFFBcVNkO0FDclNELElBQVUsS0FBSyxDQTRVZDtBQTVVRCxXQUFVLEtBQUs7SUFDYixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBRXZCOzs7T0FHRztJQUNILE1BQWEsV0FBWSxTQUFRLE1BQUEsSUFBSTtRQUMzQixNQUFNLENBQUMsV0FBVyxHQUFlLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxZQUFZLEdBQVcsV0FBVyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDL0QsUUFBUSxDQUFzRTtRQUM5RSxRQUFRLENBQWE7UUFDckIsUUFBUSxDQUFtQjtRQUMzQixXQUFXLENBQVM7UUFDcEIsUUFBUSxHQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9DLFlBQVksQ0FBUztRQUU3QixZQUFtQixVQUE4QixFQUFFLE1BQWlCO1lBQ2xFLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFMUIsbUNBQW1DO1lBQ25DLElBQUksU0FBUyxHQUFzQixJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMzRCxxREFBcUQ7WUFDckQsNENBQTRDO1lBQzVDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLElBQUksTUFBTSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdELHFDQUFxQztZQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRTlDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVuQixVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLDRDQUF3QixJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRU8sTUFBTSxDQUFDLHNCQUFzQjtZQUNuQyxJQUFJLFdBQVcsR0FBZSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFILENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUM7UUFFTyxNQUFNLENBQUMsa0JBQWtCO1lBQy9CLElBQUksWUFBWSxHQUFpQixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuQyxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBRUQsdUJBQXVCO1FBQ2IsY0FBYyxDQUFDLFNBQThCO1lBQ3JELE1BQU0sSUFBSSxHQUFrQixJQUFJLE1BQUEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlDLElBQUksSUFBdUIsQ0FBQztZQUU1Qix5SkFBeUo7WUFDekoscUJBQXFCO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVTLG1CQUFtQixDQUFDLEtBQXdCLEVBQUUsT0FBK0IsRUFBRSxNQUFzQjtZQUM3RyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFaEQsc0JBQXNCO1lBQ3RCLDRDQUE0QztZQUM1Qyw0QkFBNEI7WUFDNUIsV0FBVztZQUNYLElBQUk7UUFDTixDQUFDO1FBQ0QsWUFBWTtRQUVKLFFBQVEsR0FBRyxDQUFDLE1BQWtCLEVBQVEsRUFBRTtZQUM5QyxJQUFJLEdBQUcsR0FBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEdBQUc7Z0JBQ04sT0FBTztZQUNULE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxXQUFXO29CQUNkLElBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDO3dCQUNyQixPQUFPO29CQUNULElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUMzQyxNQUFNO2dCQUNSLEtBQUssT0FBTztvQkFDVixJQUFJLE1BQU0sR0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQ25DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckYsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ25ELGtDQUFrQztvQkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxNQUFNO1lBQ1YsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDO1FBRU0sWUFBWSxDQUFDLElBQW9CO1lBQ3ZDLElBQUksU0FBUyxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2xELFNBQVMsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1FBQ25FLENBQUM7UUFFTyxXQUFXO1lBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxvREFBb0QsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekIsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLGFBQWEsR0FBWSxJQUFJLENBQUM7WUFFbEMsWUFBWTtZQUNaLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQztZQUNwRCxJQUFJLElBQUksQ0FBQyxRQUFRLFlBQVksQ0FBQyxDQUFDLElBQUk7Z0JBQ2pDLElBQUksR0FBRyxNQUFNLENBQUM7WUFFaEIscUJBQXFCO1lBQ3JCLElBQUksYUFBYSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RCxJQUFJLE9BQW9CLENBQUM7WUFDekIsUUFBUSxJQUFJLEVBQUUsQ0FBQztnQkFDYixLQUFLLFVBQVU7b0JBQ2IsT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzVELElBQUksT0FBTzt3QkFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDaEMsTUFBTTtnQkFDUixLQUFLLE1BQU07b0JBQ1QsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRSxJQUFJLE9BQU87d0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hDLE1BQU07Z0JBQ1IsS0FBSyxNQUFNO29CQUNULGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN2RSxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxNQUFNO2dCQUNSLEtBQUssVUFBVTtvQkFDYixhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDMUUsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBYSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDL0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2QsTUFBTTtnQkFDUixLQUFLLE9BQU87b0JBQ1YsYUFBYSxDQUFDLFdBQVcsQ0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2xELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDekMsYUFBYSxHQUFHLEtBQUssQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBMEMsRUFBRSxFQUFFLENBQUMsYUFBYSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzdHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUNsRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRWQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsTUFBQSxJQUFJLENBQUMsVUFBVSxDQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbEMsYUFBYSxDQUFDLGdCQUFnQixnQ0FBaUIsQ0FBQyxNQUFhLEVBQUUsRUFBRTt3QkFDL0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzFFLENBQUMsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxNQUFNO2dCQUNSLEtBQUssY0FBYyxDQUFDO2dCQUNwQixLQUFLLGlCQUFpQjtvQkFDcEIsSUFBSSxHQUFHLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hELEdBQUcsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO29CQUNqQixJQUFJLEdBQXFCLENBQUM7b0JBQzFCLElBQUksSUFBSSxJQUFJLGNBQWMsRUFBRSxDQUFDO3dCQUMzQixHQUFHLEdBQW9CLElBQUksQ0FBQyxRQUFTLENBQUMsS0FBSyxDQUFDO3dCQUM1QyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixDQUFDO3lCQUFNLENBQUM7d0JBQ04sSUFBSSxlQUFlLEdBQXlDLElBQUksQ0FBQyxRQUFRLENBQUM7d0JBQzFFLEdBQUcsR0FBb0IsZUFBZSxDQUFDLE9BQVEsQ0FBQyxLQUFLLENBQUM7d0JBQ3RELEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3JCLElBQUksU0FBUyxHQUFnQixlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQzVELElBQUksT0FBTyxHQUFjLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDdEQsS0FBSyxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQzs0QkFDL0IsSUFBSSxJQUFJLEdBQW9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQzNELElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDOzRCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7NEJBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDOUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQztvQkFDSCxDQUFDO29CQUNELElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixNQUFNO2dCQUNSLEtBQUssT0FBTztvQkFDVixJQUFJLEtBQUssR0FBbUIsSUFBSSxNQUFBLGNBQWMsQ0FBVyxJQUFJLENBQUMsUUFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN6RyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckQsTUFBTTtnQkFDUixPQUFPLENBQUMsQ0FBQyxNQUFNO1lBQ2pCLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFTyxtQkFBbUI7WUFDekIsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9CLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFELEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFM0MsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUIsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztRQUVPLGFBQWEsQ0FBQyxLQUFhLEVBQUUscUJBQThCLEtBQUs7WUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRU8sVUFBVSxDQUFDLEdBQVk7WUFDN0IsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9GLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLENBQUM7UUFFTyxpQkFBaUIsQ0FBQyxNQUFzQjtZQUM5QyxJQUFJLElBQUksR0FBUyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEMsUUFBUSxJQUFJLEVBQUUsQ0FBQztnQkFDYixLQUFLLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RCxLQUFLLE1BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4RCxLQUFLLE1BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFTyxpQkFBaUIsQ0FBQyxNQUFzQjtZQUM5QyxJQUFJLEdBQUcsR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMxQyxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDTyxrQkFBa0IsQ0FBQyxNQUFzQjtZQUMvQyxJQUFJLEdBQUcsR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRCxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUM7WUFDckMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ08sa0JBQWtCLENBQUMsTUFBc0I7WUFDL0MsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNiLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNPLG1CQUFtQixDQUFDLE9BQWlCO1lBQzNDLElBQUksR0FBRyxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELElBQUksSUFBSSxHQUFXLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBRU8sUUFBUSxHQUFHLENBQUMsTUFBbUIsRUFBUSxFQUFFO1lBQy9DLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwQixLQUFLLE1BQUEsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDekIsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNO29CQUN0QixpR0FBaUc7b0JBQ2pHLElBQUksSUFBSSxDQUFDLFFBQVEsWUFBWSxDQUFDLENBQUMsS0FBSzt3QkFDbEMsSUFBSSxDQUFDLFFBQVEsWUFBWSxDQUFDLENBQUMsT0FBTzt3QkFDbEMsSUFBSSxDQUFDLFFBQVEsWUFBWSxDQUFDLENBQUMsZUFBZTt3QkFDMUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2QsTUFBTTtnQkFDUjtvQkFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07d0JBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO3lCQUN2QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxZQUFZLE1BQUEsVUFBVTt3QkFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O3dCQUUxQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUVyQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRU0sV0FBVztZQUNqQixJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQy9DLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFFOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRU8sTUFBTSxHQUFHLEdBQVMsRUFBRTtZQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUM7Z0JBQ2xGLE9BQU87WUFDVCxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsUUFBUSxZQUFZLENBQUMsQ0FBQyxLQUFLO29CQUNsQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxNQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxPQUFPLE1BQWUsRUFBRSxDQUFDO2dCQUN6QixLQUFLO1lBQ1AsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVNLEtBQUssQ0FBQyxTQUFtQjtZQUMvQixJQUFJLElBQUksQ0FBQyxZQUFZO2dCQUNuQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDekMsU0FBUyxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7WUFDaEMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQzs7SUFqVVUsaUJBQVcsY0FrVXZCLENBQUE7QUFDSCxDQUFDLEVBNVVTLEtBQUssS0FBTCxLQUFLLFFBNFVkO0FDNVVELElBQVUsS0FBSyxDQXNGZDtBQXRGRCxXQUFVLEtBQUs7SUFDYixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxHQUFHLEdBQUcsa0JBQWtCLENBQUM7SUFFaEM7OztPQUdHO0lBQ0gsTUFBYSxjQUFlLFNBQVEsTUFBQSxJQUFJO1FBQzlCLFFBQVEsQ0FBeUI7UUFFekMsWUFBbUIsVUFBOEIsRUFBRSxNQUFpQjtZQUNsRSxLQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVuQixJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixrQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQUEsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRU8sV0FBVztZQUNqQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUFDLENBQUM7WUFDdkUsOEJBQThCO1lBQzlCLElBQUksT0FBTyxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUNwQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxJQUFJLENBQUMsUUFBUSxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxRQUFRLEdBQWdCLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsRixJQUFJLFNBQVMsR0FBcUIsSUFBSSxNQUFBLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN0RixPQUFPLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDakMsQ0FBQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLFlBQVksTUFBQSxjQUFjLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDMUUsT0FBTyxDQUFDLFNBQVMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO29CQUM5RixPQUFPLENBQUMsU0FBUyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxPQUFPLENBQUM7b0JBQy9GLE9BQU8sQ0FBQyxTQUFTLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLE9BQU8sQ0FBQztnQkFDOUYsQ0FBQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUM1QyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDeEQsQ0FBQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLFlBQVksTUFBQSxVQUFVLEVBQUUsQ0FBQztvQkFDL0MsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUNyQyxJQUFJLEtBQUssR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDakQsSUFBSSxLQUFLLFlBQVksUUFBUTs0QkFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBQ3JCLElBQUksS0FBSyxZQUFZLEtBQUs7NEJBQ3hCLEtBQUssR0FBRyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7d0JBQ3hDLE9BQU8sQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO29CQUNwRCxDQUFDO2dCQUNILENBQUM7cUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxZQUFZLE1BQUEsY0FBYyxFQUFFLENBQUM7b0JBQ25ELElBQUksT0FBTyxHQUErQixFQUFFLENBQUM7b0JBQzdDLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2RCxDQUFDO29CQUNELE9BQU8sQ0FBQyxTQUFTLEdBQUcsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQztvQkFDcEUsS0FBSyxJQUFJLElBQUksSUFBSSxPQUFPO3dCQUN0QixPQUFPLENBQUMsU0FBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUMxRCxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsK0RBQStELENBQUM7WUFDdEYsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFTyxRQUFRLEdBQUcsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDL0MsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUN6QixLQUFLLE1BQUEsWUFBWSxDQUFDLE1BQU07b0JBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQTJCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNSLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTTtvQkFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNSO29CQUNFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQy9DLE1BQU07Z0JBQ1IsS0FBSyxNQUFBLFlBQVksQ0FBQyxNQUFNO29CQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLE9BQU87Z0JBQ1Q7b0JBQ0UsTUFBTTtZQUNWLENBQUM7WUFDRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO0tBQ0g7SUE3RVksb0JBQWMsaUJBNkUxQixDQUFBO0FBQ0gsQ0FBQyxFQXRGUyxLQUFLLEtBQUwsS0FBSyxRQXNGZDtBQ3RGRCxJQUFVLEtBQUssQ0FpRWQ7QUFqRUQsV0FBVSxLQUFLO0lBQ2IsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQU8sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBRWhDOzs7T0FHRztJQUNILE1BQWEsVUFBVyxTQUFRLE1BQUEsSUFBSTtRQUNsQyxvR0FBb0c7UUFDNUYsS0FBSyxDQUF3QjtRQUVyQyxZQUFtQixVQUE4QixFQUFFLE1BQWlCO1lBQ2xFLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFBLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBQSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5RCxpRUFBaUU7WUFDakUsaUVBQWlFO1FBQ25FLENBQUM7UUFFTSxXQUFXO1lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLHFDQUFxQyxDQUFDO1lBQ3ZELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7Z0JBQUMsQ0FBQztZQUN2RSxJQUFJLFdBQVcsR0FBaUIsRUFBRSxDQUFDO1lBQ25DLEtBQUssSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNqRCxLQUFLLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztvQkFDeEQsSUFBSSxNQUFNLEdBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxNQUFNLENBQUMsSUFBSTt3QkFDYixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksTUFBQSxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELENBQUM7WUFDSCxDQUFDO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQWEsSUFBSSxNQUFBLHFCQUFxQixFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFTSxZQUFZO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1FBQ3pDLENBQUM7UUFFTSxrQkFBa0I7WUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2hELENBQUM7UUFFRCx1QkFBdUI7UUFDdkIsNEVBQTRFO1FBQzVFLG1EQUFtRDtRQUNuRCxpQkFBaUI7UUFDakIsSUFBSTtRQUVKLDJIQUEySDtRQUMzSCxtRkFBbUY7UUFDbkYsSUFBSTtRQUNKLFlBQVk7UUFFSixRQUFRLEdBQUcsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDL0MsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLEtBQUssTUFBQSxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUN6QixLQUFLLE1BQUEsWUFBWSxDQUFDLElBQUk7b0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUk7d0JBQ3JCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDckIsTUFBTTtZQUNWLENBQUM7UUFDSCxDQUFDLENBQUM7S0FDSDtJQXhEWSxnQkFBVSxhQXdEdEIsQ0FBQTtBQUNILENBQUMsRUFqRVMsS0FBSyxLQUFMLEtBQUssUUFpRWQiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIC8vIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG4gIC8vIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgQ29udGV4dE1lbnVDYWxsYmFjayA9IChtZW51SXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIGJyb3dzZXJXaW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIGV2ZW50OiBFbGVjdHJvbi5LZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICB0eXBlIFN1YmNsYXNzPFQ+ID0ge1xyXG4gICAgc3ViY2xhc3NlczogVFtdXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRDb3B5UGFzdGUoX21lbnU6IEVsZWN0cm9uLk1lbnUpOiB2b2lkIHtcclxuICAgICAgX21lbnUuYXBwZW5kKG5ldyByZW1vdGUuTWVudUl0ZW0oeyByb2xlOiBcImNvcHlcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJjdXRcIiB9KSk7XHJcbiAgICAgIF9tZW51LmFwcGVuZChuZXcgcmVtb3RlLk1lbnVJdGVtKHsgcm9sZTogXCJwYXN0ZVwiIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTdWJjbGFzc01lbnU8VCBleHRlbmRzIFN1YmNsYXNzPFQ+PihfaWQ6IENPTlRFWFRNRU5VLCBfY2xhc3M6IFQsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAobGV0IGlTdWJjbGFzcyBpbiBfY2xhc3Muc3ViY2xhc3Nlcykge1xyXG4gICAgICAgIGxldCBzdWJjbGFzczogVCA9IF9jbGFzcy5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbShcclxuICAgICAgICAgIHsgbGFiZWw6IHN1YmNsYXNzLm5hbWUsIGlkOiBTdHJpbmcoX2lkKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpdGVtLm92ZXJyaWRlUHJvcGVydHkoXCJpU3ViY2xhc3NcIiwgaVN1YmNsYXNzKTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGV4cG9ydCBlbnVtIENPTlRFWFRNRU5VIHtcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICBBRERfTk9ERSxcclxuICAgIEFDVElWQVRFX05PREUsXHJcbiAgICBERUxFVEVfTk9ERSxcclxuICAgIEFERF9DT01QT05FTlQsXHJcbiAgICBERUxFVEVfQ09NUE9ORU5ULFxyXG4gICAgQUREX0NPTVBPTkVOVF9TQ1JJUFQsXHJcbiAgICBFRElULFxyXG4gICAgQ1JFQVRFX0ZPTERFUixcclxuICAgIENSRUFURV9NRVNILFxyXG4gICAgQ1JFQVRFX01BVEVSSUFMLFxyXG4gICAgQ1JFQVRFX0dSQVBILFxyXG4gICAgQ1JFQVRFX0FOSU1BVElPTixcclxuICAgIENSRUFURV9QQVJUSUNMRV9FRkZFQ1QsXHJcbiAgICBTWU5DX0lOU1RBTkNFUyxcclxuICAgIFJFTU9WRV9DT01QT05FTlQsXHJcbiAgICBBRERfSk9JTlQsXHJcbiAgICBERUxFVEVfUkVTT1VSQ0UsXHJcbiAgICBPUlRIR1JBUEhJQ19DQU1FUkEsXHJcbiAgICBSRU5ERVJfQ09OVElOVU9VU0xZLFxyXG4gICAgQUREX1BST1BFUlRZLFxyXG4gICAgREVMRVRFX1BST1BFUlRZLFxyXG4gICAgQ09OVkVSVF9BTklNQVRJT04sXHJcbiAgICBBRERfUEFSVElDTEVfUFJPUEVSVFksXHJcbiAgICBBRERfUEFSVElDTEVfRlVOQ1RJT04sXHJcbiAgICBBRERfUEFSVElDTEVfQ09OU1RBTlQsXHJcbiAgICBBRERfUEFSVElDTEVfQ09ERSxcclxuICAgIEFERF9QQVJUSUNMRV9UUkFOU0ZPUk1BVElPTixcclxuICAgIERFTEVURV9QQVJUSUNMRV9EQVRBXHJcbiAgfVxyXG5cclxuXHJcbiAgZXhwb3J0IGVudW0gTUVOVSB7XHJcbiAgICBRVUlUID0gXCJxdWl0XCIsXHJcbiAgICBQUk9KRUNUX05FVyA9IFwicHJvamVjdE5ld1wiLFxyXG4gICAgUFJPSkVDVF9TQVZFID0gXCJwcm9qZWN0U2F2ZVwiLFxyXG4gICAgUFJPSkVDVF9MT0FEID0gXCJwcm9qZWN0TG9hZFwiLFxyXG4gICAgREVWVE9PTFNfT1BFTiA9IFwiZGV2dG9vbHNPcGVuXCIsXHJcbiAgICBQQU5FTF9HUkFQSF9PUEVOID0gXCJwYW5lbEdyYXBoT3BlblwiLFxyXG4gICAgUEFORUxfQU5JTUFUSU9OX09QRU4gPSBcInBhbmVsQW5pbWF0aW9uT3BlblwiLFxyXG4gICAgUEFORUxfUFJPSkVDVF9PUEVOID0gXCJwYW5lbFByb2plY3RPcGVuXCIsXHJcbiAgICBQQU5FTF9IRUxQX09QRU4gPSBcInBhbmVsSGVscE9wZW5cIixcclxuICAgIFBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOID0gXCJwYW5lbFBhcnRpY2xlU3lzdGVtT3BlblwiLFxyXG4gICAgRlVMTFNDUkVFTiA9IFwiZnVsbHNjcmVlblwiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBQQU5FTCB7XHJcbiAgICBHUkFQSCA9IFwiUGFuZWxHcmFwaFwiLFxyXG4gICAgUFJPSkVDVCA9IFwiUGFuZWxQcm9qZWN0XCIsXHJcbiAgICBIRUxQID0gXCJQYW5lbEhlbHBcIixcclxuICAgIEFOSU1BVElPTiA9IFwiUGFuZWxBbmltYXRpb25cIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiUGFuZWxQYXJ0aWNsZVN5c3RlbVwiXHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGVudW0gVklFVyB7XHJcbiAgICBISUVSQVJDSFkgPSBcIlZpZXdIaWVyYXJjaHlcIixcclxuICAgIEFOSU1BVElPTiA9IFwiVmlld0FuaW1hdGlvblwiLFxyXG4gICAgQU5JTUFUSU9OX1NIRUVUID0gXCJWaWV3QW5pbWF0aW9uU2hlZXRcIixcclxuICAgIFJFTkRFUiA9IFwiVmlld1JlbmRlclwiLFxyXG4gICAgQ09NUE9ORU5UUyA9IFwiVmlld0NvbXBvbmVudHNcIixcclxuICAgIENBTUVSQSA9IFwiVmlld0NhbWVyYVwiLFxyXG4gICAgSU5URVJOQUxfVEFCTEUgPSBcIlZpZXdJbnRlcm5hbFRhYmxlXCIsXHJcbiAgICBJTlRFUk5BTF9GT0xERVIgPSBcIlZpZXdJbnRlcm5hbEZvbGRlclwiLFxyXG4gICAgRVhURVJOQUwgPSBcIlZpZXdFeHRlcm5hbFwiLFxyXG4gICAgUFJPUEVSVElFUyA9IFwiVmlld1Byb3BlcnRpZXNcIixcclxuICAgIFBSRVZJRVcgPSBcIlZpZXdQcmV2aWV3XCIsXHJcbiAgICBTQ1JJUFQgPSBcIlZpZXdTY3JpcHRcIixcclxuICAgIFBBUlRJQ0xFX1NZU1RFTSA9IFwiVmlld1BhcnRpY2xlU3lzdGVtXCJcclxuICAgIC8vIFNLRVRDSCA9IFZpZXdTa2V0Y2gsXHJcbiAgICAvLyBNRVNIID0gVmlld01lc2gsXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZW51bSBUUkFOU0ZPUk0ge1xyXG4gICAgTk9ORSA9IFwibm9uZVwiLFxyXG4gICAgVFJBTlNMQVRFID0gXCJ0cmFuc2xhdGVcIixcclxuICAgIFJPVEFURSA9IFwicm90YXRlXCIsXHJcbiAgICBTQ0FMRSA9IFwic2NhbGVcIixcclxuICAgIFdPUkxEID0gXCJ3b3JsZFwiLFxyXG4gICAgTE9DQUwgPSBcImxvY2FsXCJcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG5cclxuICBleHBvcnQgZW51bSBNSU1FIHtcclxuICAgIFRFWFQgPSBcInRleHRcIixcclxuICAgIEFVRElPID0gXCJhdWRpb1wiLFxyXG4gICAgSU1BR0UgPSBcImltYWdlXCIsXHJcbiAgICBNRVNIID0gXCJtZXNoXCIsXHJcbiAgICBHTFRGID0gXCJnbHRmXCIsXHJcbiAgICBVTktOT1dOID0gXCJ1bmtub3duXCJcclxuICB9XHJcblxyXG4gIGxldCBtaW1lOiBNYXA8TUlNRSwgc3RyaW5nW10+ID0gbmV3IE1hcChbXHJcbiAgICBbTUlNRS5URVhULCBbXCJ0c1wiLCBcImpzb25cIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCIsIFwianNcIiwgXCJ0eHRcIl1dLFxyXG4gICAgW01JTUUuTUVTSCwgW1wib2JqXCJdXSxcclxuICAgIFtNSU1FLkFVRElPLCBbXCJtcDNcIiwgXCJ3YXZcIiwgXCJvZ2dcIl1dLFxyXG4gICAgW01JTUUuSU1BR0UsIFtcInBuZ1wiLCBcImpwZ1wiLCBcImpwZWdcIiwgXCJ0aWZcIiwgXCJ0Z2FcIiwgXCJnaWZcIl1dLFxyXG4gICAgW01JTUUuR0xURiwgW1wiZ2x0ZlwiLCBcImdsYlwiXV1cclxuICBdKTtcclxuXHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBjb25zdCBwOiB0eXBlb2YgaW1wb3J0KFwicGF0aFwiKSA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG4gIHR5cGUgRGlyZW50ID0gaW1wb3J0KFwiZnNcIikuRGlyZW50O1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGlyZWN0b3J5RW50cnkge1xyXG4gICAgcHVibGljIHBhdGg6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXRoUmVsYXRpdmU6IHN0cmluZztcclxuICAgIHB1YmxpYyBkaXJlbnQ6IERpcmVudDtcclxuICAgIHB1YmxpYyBzdGF0czogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfcGF0aDogc3RyaW5nLCBfcGF0aFJlbGF0aXZlOiBzdHJpbmcsIF9kaXJlbnQ6IERpcmVudCwgX3N0YXRzOiBPYmplY3QpIHtcclxuICAgICAgdGhpcy5wYXRoID0gcC5ub3JtYWxpemUoX3BhdGgpO1xyXG4gICAgICB0aGlzLnBhdGhSZWxhdGl2ZSA9IHAubm9ybWFsaXplKF9wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB0aGlzLmRpcmVudCA9IF9kaXJlbnQ7XHJcbiAgICAgIHRoaXMuc3RhdHMgPSBfc3RhdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVSb290KF9wYXRoOiBzdHJpbmcpOiBEaXJlY3RvcnlFbnRyeSB7XHJcbiAgICAgIGxldCBkaXJlbnQ6IERpcmVudCA9IG5ldyBmcy5EaXJlbnQoKTtcclxuICAgICAgZGlyZW50Lm5hbWUgPSBwLmJhc2VuYW1lKF9wYXRoKTtcclxuICAgICAgZGlyZW50LmlzRGlyZWN0b3J5ID0gKCkgPT4gdHJ1ZTtcclxuICAgICAgcmV0dXJuIG5ldyBEaXJlY3RvcnlFbnRyeShfcGF0aCwgXCJcIiwgZGlyZW50LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZW50Lm5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IG5hbWUoX25hbWU6IHN0cmluZykge1xyXG4gICAgICBsZXQgbmV3UGF0aDogc3RyaW5nID0gcC5qb2luKHAuZGlybmFtZSh0aGlzLnBhdGgpLCBfbmFtZSk7XHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKG5ld1BhdGgpKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgYWxyZWFkeSBhIGZpbGUgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgJyR7X25hbWV9Jy4gU3BlY2lmeSBhIGRpZmZlcmVudCBuYW1lLmApO1xyXG4gICAgICBmcy5yZW5hbWVTeW5jKHRoaXMucGF0aCwgbmV3UGF0aCk7XHJcbiAgICAgIHRoaXMucGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgIHRoaXMuZGlyZW50Lm5hbWUgPSBfbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRGlyZWN0b3J5KCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlbnQuaXNEaXJlY3RvcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJlY3RvcnkgPyBcIkRpcmVjdG9yeVwiIDogXCJGaWxlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgZnMucm1TeW5jKHRoaXMucGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERpcmVjdG9yeUNvbnRlbnQoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCBkaXJlbnRzOiBEaXJlbnRbXSA9IGZzLnJlYWRkaXJTeW5jKHRoaXMucGF0aCwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgY29udGVudDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBkaXJlbnQgb2YgZGlyZW50cykge1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBwLmpvaW4odGhpcy5wYXRoLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHBhdGhSZWxhdGl2ZTogc3RyaW5nID0gcC5qb2luKHRoaXMucGF0aFJlbGF0aXZlLCBkaXJlbnQubmFtZSk7XHJcbiAgICAgICAgbGV0IHN0YXRzOiBPYmplY3QgPSBmcy5zdGF0U3luYyhwYXRoKTtcclxuICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KHBhdGgsIHBhdGhSZWxhdGl2ZSwgZGlyZW50LCBzdGF0cyk7XHJcbiAgICAgICAgY29udGVudC5wdXNoKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RmlsZUNvbnRlbnQoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLnBhdGgsIFwidXRmOFwiKTtcclxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEVudHJ5KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiB2b2lkIHtcclxuICAgICAgZnMuY29weUZpbGVTeW5jKF9lbnRyeS5wYXRoLCBwLmpvaW4odGhpcy5wYXRoLCBfZW50cnkubmFtZSksIGZzLmNvbnN0YW50cy5DT1BZRklMRV9FWENMKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TWltZVR5cGUoKTogTUlNRSB7XHJcbiAgICAgIGxldCBleHRlbnNpb246IHN0cmluZyA9IHRoaXMubmFtZS5zcGxpdChcIi5cIikucG9wKCk7XHJcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgbWltZSkge1xyXG4gICAgICAgIGlmICh0eXBlWzFdLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xKVxyXG4gICAgICAgICAgcmV0dXJuIHR5cGVbMF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1JTUUuVU5LTk9XTjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBwYXRoIG9mIERpcmVjdG9yeUVudHJpZXMgc3RhcnRpbmcgYXQgdGhlIHJvb3QgYW5kIGVuZGluZyBhdCB0aGlzIERpcmVjdG9yeUVudHJ5LiBcclxuICAgICAqIFRoZSBlbnRyaWVzIGluIHRoZSByZXR1cm5lZCBwYXRoIE9OTFkgaGF2ZSB0aGVpciByZWxhdGl2ZSBwYXRoIHNldC4gVGhpcyBpcyBzb2xlbHkgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3NlcyBpbiB7QGxpbmsgVmlld0V4dGVybmFsfXMgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFBhdGgoKTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIGxldCB0cmFjZTogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudFBhdGg6IHN0cmluZyA9IHRoaXMucGF0aFJlbGF0aXZlO1xyXG4gICAgICB3aGlsZSAoY3VycmVudFBhdGggIT0gdHJhY2VbdHJhY2UubGVuZ3RoIC0gMV0/LnBhdGhSZWxhdGl2ZSkge1xyXG4gICAgICAgIHRyYWNlLnB1c2gobmV3IERpcmVjdG9yeUVudHJ5KFwiXCIsIGN1cnJlbnRQYXRoLCBudWxsLCBudWxsKSk7XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBwLmRpcm5hbWUoY3VycmVudFBhdGgpO1xyXG4gICAgICB9O1xyXG4gICAgICB0cmFjZS5yZXZlcnNlKCk7XHJcbiAgICAgIHJldHVybiB0cmFjZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgZW51bSBFVkVOVF9FRElUT1Ige1xyXG4gICAgLyoqIEFuIGVudGl0eSBnZXRzIGNyZWF0ZWQsIGlzIG5vdCBkaXNwYXRjaGVkIHNvIGZhciAqL1xyXG4gICAgQ1JFQVRFID0gXCJFRElUT1JfQ1JFQVRFXCIsXHJcbiAgICAvKiogQW4gZW50aXR5IGdldHMgc2VsZWN0ZWQgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byBzd2l0Y2ggY29udGVudHMgaW4gdGhlIHZpZXdzICovXHJcbiAgICBTRUxFQ1QgPSBcIkVESVRPUl9TRUxFQ1RcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBtb2RpZmllZCBzdHJ1Y3R1cmFsbHkgYW5kIGl0IGlzIG5lY2Vzc2FyeSB0byB1cGRhdGUgdmlld3MgKi9cclxuICAgIE1PRElGWSA9IFwiRURJVE9SX01PRElGWVwiLFxyXG4gICAgLyoqIFZhbHVlcyBvZiBhbiBlbnRpdHkgY2hhbmdlIGFuZCBpdCBpcyBuZWNlc3NhcnkgdG8gdXBkYXRlIHZpZXdzICovXHJcbiAgICBVUERBVEUgPSBcIkVESVRPUl9VUERBVEVcIixcclxuICAgIC8qKiBBbiBlbnRpdHkgZ2V0cyBkZWxldGVkICovXHJcbiAgICBERUxFVEUgPSBcIkVESVRPUl9ERUxFVEVcIixcclxuICAgIC8qKiBBIHZpZXcgb3IgcGFuZWwgY2xvc2VzICovXHJcbiAgICBDTE9TRSA9IFwiRURJVE9SX0NMT1NFXCIsXHJcbiAgICAvKiogQSB2aWV3IG9yIHBhbmVsIG9wZW5zICovXHJcbiAgICBPUEVOID0gXCJFRElUT1JfT1BFTlwiXHJcbiAgICAvKiogQSB0cmFuc2Zvcm0gbWF0cml4IGdldHMgYWRqdXN0ZWQgaW50ZXJhY3RpdmVseSAqLyxcclxuICAgIFRSQU5TRk9STSA9IFwiRURJVE9SX1RSQU5TRk9STVwiLFxyXG4gICAgLyoqIEFuIGVudGl0eSByZWNpZXZlcyBmb2N1cyBhbmQgY2FuIGJlIG1hbmlwdWxhdGVkIHVzaW5nIHRoZSBrZXlib2FyZCAqL1xyXG4gICAgRk9DVVMgPSBcIkVESVRPUl9GT0NVU1wiXHJcbiAgfVxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIEV2ZW50RGV0YWlsIHtcclxuICAgIHZpZXc/OiBWaWV3O1xyXG4gICAgc2VuZGVyPzogUGFuZWwgfCBQYWdlO1xyXG4gICAgbm9kZT86IMaSLk5vZGU7XHJcbiAgICBncmFwaD86IMaSLkdyYXBoO1xyXG4gICAgcmVzb3VyY2U/OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZTtcclxuICAgIG11dGFibGU/OiDGki5NdXRhYmxlO1xyXG4gICAgdHJhbnNmb3JtPzogT2JqZWN0O1xyXG4gICAgZGF0YT86IMaSLkdlbmVyYWw7XHJcbiAgICAvLyBwYXRoPzogVmlld1tdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIEN1c3RvbUV2ZW50IHRoYXQgc3VwcG9ydHMgYSBkZXRhaWwgZmllbGQgd2l0aCB0aGUgdHlwZSBFdmVudERldGFpbFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBFZGl0b3JFdmVudCBleHRlbmRzIEN1c3RvbUV2ZW50PEV2ZW50RGV0YWlsPiB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BhdGNoKF90YXJnZXQ6IEV2ZW50VGFyZ2V0LCBfdHlwZTogRVZFTlRfRURJVE9SLCBfaW5pdDogQ3VzdG9tRXZlbnRJbml0PEV2ZW50RGV0YWlsPik6IHZvaWQge1xyXG4gICAgICBfdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKSA9IHJlcXVpcmUoXCJmc1wiKTtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgZXhwb3J0IGxldCB3YXRjaGVyOiBpbXBvcnQoXCJmc1wiKS5GU1dhdGNoZXI7XHJcblxyXG4gIGludGVyZmFjZSBDb3B5TGlzdCB7XHJcbiAgICBbc3JjOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbmV3UHJvamVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBmaWxlbmFtZTogc3RyaW5nIHwgc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHByb3BlcnRpZXM6IFtcIm9wZW5EaXJlY3RvcnlcIiwgXCJjcmVhdGVEaXJlY3RvcnlcIl0sIHRpdGxlOiBcIlNlbGVjdC9DcmVhdGUgYSBmb2xkZXIgdG8gc2F2ZSB0aGUgcHJvamVjdCB0by4gVGhlIGZvbGRlcm5hbWUgYmVjb21lcyB0aGUgbmFtZSBvZiB5b3VyIHByb2plY3RcIiwgYnV0dG9uTGFiZWw6IFwiU2F2ZSBQcm9qZWN0XCJcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghZmlsZW5hbWUpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBsZXQgYmFzZTogVVJMID0gbmV3IFVSTChuZXcgVVJMKFwiZmlsZTovL1wiICsgZmlsZW5hbWVbMF0pLnRvU3RyaW5nKCkgKyBcIi9cIik7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBhdGhcIiwgYmFzZS50b1N0cmluZygpKTtcclxuICAgICAgXHJcbiAgICBwcm9qZWN0ID0gbmV3IFByb2plY3QoYmFzZSk7XHJcblxyXG4gICAgYXdhaXQgc2F2ZVByb2plY3QodHJ1ZSk7XHJcblxyXG4gICAgbGV0IMaSUGF0aDogVVJMID0gbmV3IFVSTChcIi4uLy4uL1wiLCBsb2NhdGlvbi5ocmVmKTtcclxuICAgIGNvbnNvbGUubG9nKMaSUGF0aCk7XHJcblxyXG4gICAgZnMuY29weUZpbGVTeW5jKG5ldyBVUkwoXCJFZGl0b3IvU291cmNlL1RlbXBsYXRlLy5naXRpZ25vcmUudHh0XCIsIMaSUGF0aCksIG5ldyBVUkwoXCIuZ2l0aWdub3JlXCIsIGJhc2UpKTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L1NvdXJjZVwiLCBiYXNlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICBmcy5ta2RpclN5bmMobmV3IFVSTChcIlNjcmlwdC9Tb3VyY2UvQHR5cGVzXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgIGZzLm1rZGlyU3luYyhuZXcgVVJMKFwiU2NyaXB0L0J1aWxkXCIsIGJhc2UpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBsZXQgY29weVRlbXBsYXRlczogQ29weUxpc3QgPSB7XHJcbiAgICAgIFwiQ3VzdG9tQ29tcG9uZW50U2NyaXB0LnR4dFwiOiBcIlNvdXJjZS9DdXN0b21Db21wb25lbnRTY3JpcHQudHNcIixcclxuICAgICAgXCJNYWluLnR4dFwiOiBcIlNvdXJjZS9NYWluLnRzXCIsXHJcbiAgICAgIFwidHNjb25maWcudHh0XCI6IFwiU291cmNlL3RzY29uZmlnLmpzb25cIixcclxuICAgICAgXCJTY3JpcHQudHh0XCI6IFwiIEJ1aWxkL1NjcmlwdC5qc1wiLFxyXG4gICAgICBcIkF1dG92aWV3LmpzXCI6IFwiLi4vQXV0b3ZpZXcuanNcIlxyXG4gICAgfTtcclxuICAgIGNvcHlGaWxlcyhjb3B5VGVtcGxhdGVzLCBuZXcgVVJMKFwiRWRpdG9yL1NvdXJjZS9UZW1wbGF0ZS9cIiwgxpJQYXRoKSwgbmV3IFVSTChcIlNjcmlwdC9cIiwgYmFzZSkpO1xyXG5cclxuICAgIGxldCBkZWZpbml0aW9uOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIik7XHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKG5ldyBVUkwoXCJTY3JpcHQvU291cmNlL0B0eXBlcy9GdWRnZUNvcmUuZC50c1wiLCBiYXNlKSwgYXdhaXQgZGVmaW5pdGlvbi50ZXh0KCkpO1xyXG5cclxuICAgIGF3YWl0IGxvYWRQcm9qZWN0KG5ldyBVUkwocHJvamVjdC5maWxlSW5kZXgsIHByb2plY3QuYmFzZSkpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29weUZpbGVzKF9saXN0OiBDb3B5TGlzdCwgX3NyY1BhdGg6IFVSTCwgX2Rlc3RQYXRoOiBVUkwpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IGNvcHkgaW4gX2xpc3QpIHtcclxuICAgICAgbGV0IHNyYzogVVJMID0gbmV3IFVSTChjb3B5LCBfc3JjUGF0aCk7XHJcbiAgICAgIGxldCBkZXN0OiBVUkwgPSBuZXcgVVJMKF9saXN0W2NvcHldLCBfZGVzdFBhdGgpO1xyXG4gICAgICBmcy5jb3B5RmlsZVN5bmMoc3JjLCBkZXN0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlUHJvamVjdChfbmV3OiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGlmICghcHJvamVjdClcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIGlmICghYXdhaXQgcHJvamVjdC5vcGVuRGlhbG9nKCkpXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB1bndhdGNoRm9sZGVyKCk7XHJcblxyXG4gICAgbGV0IGJhc2U6IFVSTCA9IHByb2plY3QuYmFzZTtcclxuXHJcbiAgICBpZiAoX25ldykge1xyXG4gICAgICBsZXQgY3NzRmlsZU5hbWU6IFVSTCA9IG5ldyBVUkwocHJvamVjdC5maWxlU3R5bGVzLCBiYXNlKTtcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhjc3NGaWxlTmFtZSwgcHJvamVjdC5nZXRQcm9qZWN0Q1NTKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sOiBzdHJpbmcgPSBwcm9qZWN0LmdldFByb2plY3RIVE1MKHByb2plY3QubmFtZSk7XHJcbiAgICBsZXQgaHRtbEZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUluZGV4LCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoaHRtbEZpbGVOYW1lLCBodG1sKTtcclxuXHJcbiAgICBsZXQganNvbkZpbGVOYW1lOiBVUkwgPSBuZXcgVVJMKHByb2plY3QuZmlsZUludGVybmFsLCBiYXNlKTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoanNvbkZpbGVOYW1lLCBwcm9qZWN0LmdldFByb2plY3RKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlSW50ZXJuYWxGb2xkZXIsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCkpO1xyXG5cclxuICAgIGpzb25GaWxlTmFtZSA9IG5ldyBVUkwocHJvamVjdC5maWxlU2V0dGluZ3MsIGJhc2UpO1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhqc29uRmlsZU5hbWUsIHByb2plY3QuZ2V0U2V0dGluZ3NKU09OKCkpO1xyXG5cclxuICAgIHdhdGNoRm9sZGVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9tcHRMb2FkUHJvamVjdCgpOiBQcm9taXNlPFVSTD4ge1xyXG4gICAgbGV0IGZpbGVuYW1lczogc3RyaW5nW10gPSByZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nU3luYyhudWxsLCB7XHJcbiAgICAgIHRpdGxlOiBcIkxvYWQgUHJvamVjdFwiLCBidXR0b25MYWJlbDogXCJMb2FkIFByb2plY3RcIiwgcHJvcGVydGllczogW1wib3BlbkZpbGVcIl0sXHJcbiAgICAgIGZpbHRlcnM6IFt7IG5hbWU6IFwiSFRNTC1GaWxlXCIsIGV4dGVuc2lvbnM6IFtcImh0bWxcIiwgXCJodG1cIl0gfV1cclxuICAgIH0pO1xyXG4gICAgaWYgKCFmaWxlbmFtZXMpXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBVUkwoXCJmaWxlOi8vXCIgKyBmaWxlbmFtZXNbMF0pO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGh0bWxDb250ZW50OiBzdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoX3VybCwgeyBlbmNvZGluZzogXCJ1dGYtOFwiIH0pO1xyXG4gICAgxpIuRGVidWcuZ3JvdXBDb2xsYXBzZWQoXCJGaWxlIGNvbnRlbnRcIik7XHJcbiAgICDGki5EZWJ1Zy5pbmZvKGh0bWxDb250ZW50KTtcclxuICAgIMaSLkRlYnVnLmdyb3VwRW5kKCk7XHJcblxyXG4gICAgdW53YXRjaEZvbGRlcigpO1xyXG5cclxuICAgIHByb2plY3QgPSBuZXcgUHJvamVjdChfdXJsKTtcclxuICAgIGF3YWl0IHByb2plY3QubG9hZChodG1sQ29udGVudCk7XHJcblxyXG4gICAgd2F0Y2hGb2xkZXIoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHdhdGNoRm9sZGVyKCk6IHZvaWQge1xyXG4gICAgbGV0IGRpcjogVVJMID0gbmV3IFVSTChcIi5cIiwgcHJvamVjdC5iYXNlKTtcclxuICAgIHdhdGNoZXIgPSBmcy53YXRjaChkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0sIGhuZEZpbGVDaGFuZ2UpO1xyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGhuZEZpbGVDaGFuZ2UoX2V2ZW50OiBzdHJpbmcsIF9maWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfZmlsZW5hbWUgPT0gcHJvamVjdC5maWxlSW5kZXggfHwgX2ZpbGVuYW1lID09IHByb2plY3QuZmlsZUludGVybmFsIHx8IF9maWxlbmFtZSA9PSBwcm9qZWN0LmZpbGVTY3JpcHQpIHtcclxuICAgICAgICB1bndhdGNoRm9sZGVyKCk7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQobnVsbCwgZmFsc2UsIFwiSW1wb3J0YW50IGZpbGUgY2hhbmdlXCIsIFwiUmVsb2FkIHByb2plY3Q/XCIsIFwiUmVsb2FkXCIsIFwiQ2FuY2VsXCIpO1xyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICBhd2FpdCBsb2FkUHJvamVjdChwcm9qZWN0LmJhc2UpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgd2F0Y2hlciA9IGZzLndhdGNoKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSwgaG5kRmlsZUNoYW5nZSk7XHJcbiAgICAgIH1cclxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlRfRURJVE9SLk1PRElGWSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVud2F0Y2hGb2xkZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXdhdGNoZXIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHdhdGNoZXIudW5yZWYoKTtcclxuICAgIHdhdGNoZXIuY2xvc2UoKTtcclxuICB9XHJcbn1cclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgdHlwZXM9XCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24vRWxlY3Ryb25cIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIkRlZmluaXRpb24udHNcIi8+XHJcblxyXG5uYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvLyBpbXBvcnQgxpJhaWQgPSBGdWRnZUFpZDtcclxuICAvLyBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGlwY1JlbmRlcmVyOiBFbGVjdHJvbi5JcGNSZW5kZXJlciA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKS5pcGNSZW5kZXJlcjsgLy8gUmVwbGFjZSB3aXRoOlxyXG4gIGV4cG9ydCBjb25zdCByZW1vdGU6IHR5cGVvZiBpbXBvcnQoXCJAZWxlY3Ryb24vcmVtb3RlXCIpID0gcmVxdWlyZShcIkBlbGVjdHJvbi9yZW1vdGVcIik7XHJcblxyXG4gIGV4cG9ydCBsZXQgcHJvamVjdDogUHJvamVjdDsgLy8gPSBuZXcgUHJvamVjdCgpO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdXBwZXJtb3N0IGNvbnRhaW5lciBmb3IgYWxsIHBhbmVscyBjb250cm9sbGluZyBkYXRhIGZsb3cgYmV0d2Vlbi4gXHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhZ2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBnb2xkZW5MYXlvdXRNb2R1bGU6IMaSLkdlbmVyYWwgPSAoZ2xvYmFsVGhpcyBhcyDGki5HZW5lcmFsKS5nb2xkZW5MYXlvdXQ7ICAvLyDGki5HZW5lcmFsIGlzIHN5bm9ueW0gZm9yIGFueS4uLiBoYWNrIHRvIGdldCBHb2xkZW5MYXlvdXQgdG8gd29ya1xyXG4gICAgcHVibGljIHN0YXRpYyBtb2RlVHJhbnNmb3JtOiBUUkFOU0ZPUk0gPSBUUkFOU0ZPUk0uVFJBTlNMQVRFO1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ29sZGVuTGF5b3V0OiBHb2xkZW5MYXlvdXQ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwYW5lbHM6IFBhbmVsW10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhdGljIHBoeXNpY3M6IHsgW2lkR3JhcGg6IHN0cmluZ106IMaSLlBoeXNpY3MgfSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdFByb2plY3QoKTogdm9pZCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU2V0IGRlZmF1bHQgcHJvamVjdCBpbiBsb2NhbCBzdG9yYWdlXCIsIHByb2plY3QpO1xyXG4gICAgICBpZiAocHJvamVjdClcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2plY3RcIiwgcHJvamVjdC5iYXNlLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TGF5b3V0KCk6IFJlc29sdmVkTGF5b3V0Q29uZmlnIHtcclxuICAgICAgcmV0dXJuIFBhZ2UuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRMYXlvdXQoX2xheW91dD86IExheW91dENvbmZpZyk6IHZvaWQge1xyXG4gICAgICBfbGF5b3V0ID8/PSB7XHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICBwb3BvdXQ6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290OiB7XHJcbiAgICAgICAgICB0eXBlOiBcInJvd1wiLFxyXG4gICAgICAgICAgaXNDbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICBjb250ZW50OiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmxvYWRMYXlvdXQoX2xheW91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRUcmFuc2Zvcm0oX21vZGU6IFRSQU5TRk9STSk6IHZvaWQge1xyXG4gICAgICBQYWdlLm1vZGVUcmFuc2Zvcm0gPSBfbW9kZTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYFRyYW5zZm9ybSBtb2RlOiAke19tb2RlfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGh5c2ljcyhfZ3JhcGg6IMaSLkdyYXBoKTogxpIuUGh5c2ljcyB7XHJcbiAgICAgIHJldHVybiBQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdIHx8IChQYWdlLnBoeXNpY3NbX2dyYXBoLmlkUmVzb3VyY2VdID0gbmV3IMaSLlBoeXNpY3MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsbGVkIGJ5IHdpbmRvd3MgbG9hZC1saXN0ZW5lclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIC8vIMaSLkRlYnVnLnNldEZpbHRlcijGki5EZWJ1Z0NvbnNvbGUsIMaSLkRFQlVHX0ZJTFRFUi5BTEwgfCDGki5ERUJVR19GSUxURVIuU09VUkNFKTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWxTdG9yYWdlXCIsIGxvY2FsU3RvcmFnZSk7XHJcblxyXG4gICAgICBQYWdlLnNldHVwR29sZGVuTGF5b3V0KCk7XHJcbiAgICAgIMaSLlByb2plY3QubW9kZSA9IMaSLk1PREUuRURJVE9SO1xyXG5cclxuICAgICAgUGFnZS5zZXR1cE1haW5MaXN0ZW5lcnMoKTtcclxuICAgICAgUGFnZS5zZXR1cFBhZ2VMaXN0ZW5lcnMoKTtcclxuICAgICAgLy8gZm9yIHRlc3Rpbmc6XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4pO1xyXG4gICAgICAvLyBpcGNSZW5kZXJlci5lbWl0KE1FTlUuUEFORUxfR1JBUEhfT1BFTik7XHJcbiAgICAgIC8vIGlwY1JlbmRlcmVyLmVtaXQoTUVOVS5QUk9KRUNUX0xPQUQpO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IGZhbHNlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX0dSQVBIX09QRU4sIG9uOiBmYWxzZSB9KTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9IRUxQX09QRU4sIG9uOiB0cnVlIH0pO1xyXG5cclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5wcm9qZWN0KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkIHByb2plY3QgcmVmZXJlbmNlZCBpbiBsb2NhbCBzdG9yYWdlXCIsIGxvY2FsU3RvcmFnZS5wcm9qZWN0KTtcclxuICAgICAgICBhd2FpdCBQYWdlLmxvYWRQcm9qZWN0KG5ldyBVUkwobG9jYWxTdG9yYWdlLnByb2plY3QpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHNldHVwR29sZGVuTGF5b3V0KCk6IHZvaWQge1xyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dCA9IG5ldyBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Hb2xkZW5MYXlvdXQoKTsgLy8gR29sZGVuTGF5b3V0IDIgYXMgVU1ELU1vZHVsZVxyXG4gICAgICBQYWdlLmdvbGRlbkxheW91dC5vbihcIml0ZW1DcmVhdGVkXCIsIFBhZ2UuaG5kUGFuZWxDcmVhdGVkKTtcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuUFJPSkVDVCwgUGFuZWxQcm9qZWN0KTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5HUkFQSCwgUGFuZWxHcmFwaCk7XHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50Q29uc3RydWN0b3IoUEFORUwuSEVMUCwgUGFuZWxIZWxwKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5BTklNQVRJT04sIFBhbmVsQW5pbWF0aW9uKTtcclxuICAgICAgUGFnZS5nb2xkZW5MYXlvdXQucmVnaXN0ZXJDb21wb25lbnRDb25zdHJ1Y3RvcihQQU5FTC5QQVJUSUNMRV9TWVNURU0sIFBhbmVsUGFydGljbGVTeXN0ZW0pO1xyXG5cclxuICAgICAgUGFnZS5sb2FkTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkKF9wYW5lbDogdHlwZW9mIFBhbmVsLCBfc3RhdGU/OiBKc29uVmFsdWUpOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGFuZWxDb25maWc6IENvbXBvbmVudEl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICBjb21wb25lbnRUeXBlOiBfcGFuZWwubmFtZSxcclxuICAgICAgICBjb21wb25lbnRTdGF0ZTogX3N0YXRlLFxyXG4gICAgICAgIHRpdGxlOiBcIlBhbmVsXCIsXHJcbiAgICAgICAgaWQ6IFBhZ2UuZ2VuZXJhdGVJRChfcGFuZWwubmFtZSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIGlmICghUGFnZS5nb2xkZW5MYXlvdXQucm9vdEl0ZW0pICAvLyB3b3JrYXJvdW5kIGJlY2F1c2UgZ29sZGVuIExheW91dCBsb3NlcyByb290SXRlbS4uLlxyXG4gICAgICAvLyAgIFBhZ2UubG9hZExheW91dCgpOyAvLyBUT0RPOiB0aGVzZSB0d28gbGluZXMgYXBwZWFyIHRvIGJlIG9ic29sZXRlLCB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXRcclxuXHJcbiAgICAgIFBhZ2UuZ29sZGVuTGF5b3V0LmFkZEl0ZW1BdExvY2F0aW9uKHBhbmVsQ29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmluZChfdHlwZTogdHlwZW9mIFBhbmVsKTogUGFuZWxbXSB7XHJcbiAgICAgIGxldCByZXN1bHQ6IFBhbmVsW10gPSBbXTtcclxuICAgICAgcmVzdWx0ID0gUGFnZS5wYW5lbHMuZmlsdGVyKF9wYW5lbCA9PiBfcGFuZWwgaW5zdGFuY2VvZiBfdHlwZSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVJRChfbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgIHdoaWxlICh0aGlzLmdvbGRlbkxheW91dC5maW5kRmlyc3RDb21wb25lbnRJdGVtQnlJZChfbmFtZSArIGkpKVxyXG4gICAgICAgIGkrKztcclxuICAgICAgcmV0dXJuIF9uYW1lICsgaTsgLy8gX25hbWUgKyBQYWdlLmlkQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBQYWdlLUV2ZW50cyBmcm9tIERPTVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBQYWdlTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIFBhZ2UuaG5kRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlRSQU5TRk9STSwgUGFnZS5obmRFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBQYWdlLmhuZEtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNlbmQgY3VzdG9tIGNvcGllcyBvZiB0aGUgZ2l2ZW4gZXZlbnQgdG8gdGhlIHBhbmVscyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJvYWRjYXN0KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBsZXQgc2VuZGVyOiBQYW5lbCB8IFBhZ2UgPSBkZXRhaWw/LnNlbmRlcjtcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IFBhZ2U7XHJcbiAgICAgIGZvciAobGV0IHBhbmVsIG9mIFBhZ2UucGFuZWxzKSB7XHJcbiAgICAgICAgaWYgKHBhbmVsICE9IHNlbmRlcikgLy8gZG9uJ3Qgc2VuZCBiYWNrIHRvIG9yaWdpbmFsIHNlbmRlclxyXG4gICAgICAgICAgcGFuZWwuZGlzcGF0Y2goPEVWRU5UX0VESVRPUj5fZXZlbnQudHlwZSwgeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlQ6XHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShUUkFOU0ZPUk0uVFJBTlNMQVRFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5SOlxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlJPVEFURSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRTpcclxuICAgICAgICAgIC8vIFRPRE86IGRvbid0IHN3aXRjaCB0byBzY2FsZSBtb2RlIHdoZW4gdXNpbmcgZmx5LWNhbWVyYSBhbmQgcHJlc3NpbmcgRVxyXG4gICAgICAgICAgUGFnZS5zZXRUcmFuc2Zvcm0oVFJBTlNGT1JNLlNDQUxFKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhuZEV2ZW50KF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkIHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgbGV0IHZpZXc6IFZpZXcgPSBfZXZlbnQuZGV0YWlsLnZpZXc7XHJcbiAgICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIFBhbmVsKVxyXG4gICAgICAgICAgICBQYWdlLnBhbmVscy5zcGxpY2UoUGFnZS5wYW5lbHMuaW5kZXhPZih2aWV3KSwgMSk7XHJcblxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbG9zZWRcIiwgdmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgUGFnZS5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBobmRQYW5lbENyZWF0ZWQgPSAoX2V2ZW50OiBFdmVudEVtaXR0ZXIuQnViYmxpbmdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDb21wb25lbnRJdGVtID0gX2V2ZW50LnRhcmdldCBhcyBDb21wb25lbnRJdGVtO1xyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuQ29tcG9uZW50SXRlbSkge1xyXG4gICAgICAgIFBhZ2UucGFuZWxzLnB1c2goPFBhbmVsPnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGxvYWRQcm9qZWN0KF91cmw6IFVSTCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBhd2FpdCBsb2FkUHJvamVjdChfdXJsKTtcclxuICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QUk9KRUNUX1NBVkUsIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BST0pFQ1RfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBBTkVMX1BBUlRJQ0xFX1NZU1RFTV9PUEVOLCBvbjogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gTWFpbi1FdmVudHMgZnJvbSBFbGVjdHJvblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2V0dXBNYWluTGlzdGVuZXJzKCk6IHZvaWQge1xyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTkVXLCBhc3luYyAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgxpIuUHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgIGF3YWl0IG5ld1Byb2plY3QoKTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiZW5hYmxlTWVudUl0ZW1cIiwgeyBpdGVtOiBGdWRnZS5NRU5VLlBST0pFQ1RfU0FWRSwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QUk9KRUNUX09QRU4sIG9uOiB0cnVlIH0pO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJlbmFibGVNZW51SXRlbVwiLCB7IGl0ZW06IEZ1ZGdlLk1FTlUuUEFORUxfR1JBUEhfT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9BTklNQVRJT05fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcImVuYWJsZU1lbnVJdGVtXCIsIHsgaXRlbTogRnVkZ2UuTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgb246IHRydWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QUk9KRUNUX1NBVkUsIGFzeW5jIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBpZiAoYXdhaXQgc2F2ZVByb2plY3QoKSlcclxuICAgICAgICAgIFBhZ2Uuc2V0RGVmYXVsdFByb2plY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBST0pFQ1RfTE9BRCwgYXN5bmMgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIGxldCB1cmw6IFVSTCA9IGF3YWl0IHByb21wdExvYWRQcm9qZWN0KCk7XHJcbiAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgYXdhaXQgUGFnZS5sb2FkUHJvamVjdCh1cmwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfR1JBUEhfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsR3JhcGgsIG51bGwpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfUFJPSkVDVF9PUEVOLCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5hZGQoUGFuZWxQcm9qZWN0LCBudWxsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGNSZW5kZXJlci5vbihNRU5VLlBBTkVMX0hFTFBfT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsSGVscCwgbnVsbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5RVUlULCAoX2V2ZW50OiBFbGVjdHJvbi5JcGNSZW5kZXJlckV2ZW50LCBfYXJnczogdW5rbm93bltdKSA9PiB7XHJcbiAgICAgICAgUGFnZS5zZXREZWZhdWx0UHJvamVjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlwY1JlbmRlcmVyLm9uKE1FTlUuUEFORUxfQU5JTUFUSU9OX09QRU4sIChfZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIF9hcmdzOiB1bmtub3duW10pID0+IHtcclxuICAgICAgICBQYWdlLmFkZChQYW5lbEFuaW1hdGlvbiwgbnVsbCk7XHJcbiAgICAgICAgLy8gbGV0IHBhbmVsOiBQYW5lbCA9IFBhbmVsTWFuYWdlci5pbnN0YW5jZS5jcmVhdGVQYW5lbEZyb21UZW1wbGF0ZShuZXcgVmlld0FuaW1hdGlvblRlbXBsYXRlKCksIFwiQW5pbWF0aW9uIFBhbmVsXCIpO1xyXG4gICAgICAgIC8vIFBhbmVsTWFuYWdlci5pbnN0YW5jZS5hZGRQYW5lbChwYW5lbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXBjUmVuZGVyZXIub24oTUVOVS5QQU5FTF9QQVJUSUNMRV9TWVNURU1fT1BFTiwgKF9ldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgX2FyZ3M6IHVua25vd25bXSkgPT4ge1xyXG4gICAgICAgIFBhZ2UuYWRkKFBhbmVsUGFydGljbGVTeXN0ZW0sIG51bGwpO1xyXG4gICAgICAgIC8vIGxldCBwYW5lbDogUGFuZWwgPSBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuY3JlYXRlUGFuZWxGcm9tVGVtcGxhdGUobmV3IFZpZXdBbmltYXRpb25UZW1wbGF0ZSgpLCBcIkFuaW1hdGlvbiBQYW5lbFwiKTtcclxuICAgICAgICAvLyBQYW5lbE1hbmFnZXIuaW5zdGFuY2UuYWRkUGFuZWwocGFuZWwpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZ1bmN0aW9uIHdlbGNvbWUoY29udGFpbmVyOiBHb2xkZW5MYXlvdXQuQ29udGFpbmVyLCBzdGF0ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgLy8gICBjb250YWluZXIuZ2V0RWxlbWVudCgpLmh0bWwoXCI8ZGl2PldlbGNvbWU8L2Rpdj5cIik7XHJcbiAgLy8gfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIMaSLlNlcmlhbGl6ZXIucmVnaXN0ZXJOYW1lc3BhY2UoRnVkZ2UpO1xyXG5cclxuICBleHBvcnQgY2xhc3MgUHJvamVjdCBleHRlbmRzIMaSLk11dGFibGUgeyAvLyBUT0RPOiByZXBsYWNlIHdpdGggc2VyaWxpemFibGVcclxuICAgIC8vIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJOZXdQcm9qZWN0XCI7XHJcbiAgICBwdWJsaWMgYmFzZTogVVJMO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgZmlsZUluZGV4OiBzdHJpbmcgPSBcImluZGV4Lmh0bWxcIjtcclxuICAgIHB1YmxpYyBmaWxlSW50ZXJuYWw6IHN0cmluZyA9IFwiSW50ZXJuYWwuanNvblwiO1xyXG4gICAgcHVibGljIGZpbGVJbnRlcm5hbEZvbGRlcjogc3RyaW5nID0gXCJJbnRlcm5hbEZvbGRlci5qc29uXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNjcmlwdDogc3RyaW5nID0gXCJTY3JpcHQvQnVpbGQvU2NyaXB0LmpzXCI7XHJcbiAgICBwdWJsaWMgZmlsZVNldHRpbmdzOiBzdHJpbmcgPSBcInNldHRpbmdzLmpzb25cIjtcclxuICAgIHB1YmxpYyBmaWxlU3R5bGVzOiBzdHJpbmcgPSBcInN0eWxlcy5jc3NcIjtcclxuXHJcbiAgICBwcml2YXRlIGdyYXBoQXV0b1ZpZXc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvLyBwcml2YXRlIGluY2x1ZGVBdXRvVmlld1NjcmlwdDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgI3Jlc291cmNlRm9sZGVyOiBSZXNvdXJjZUZvbGRlcjtcclxuICAgICNkb2N1bWVudDogRG9jdW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9iYXNlOiBVUkwpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5iYXNlID0gX2Jhc2U7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9iYXNlLnRvU3RyaW5nKCkuc3BsaXQoXCIvXCIpLnNsaWNlKC0yLCAtMSlbMF07XHJcbiAgICAgIHRoaXMuZmlsZUluZGV4ID0gX2Jhc2UudG9TdHJpbmcoKS5zcGxpdChcIi9cIikucG9wKCkgfHwgdGhpcy5maWxlSW5kZXg7XHJcblxyXG4gICAgICDGki5Qcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgIMaSLlByb2plY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5HUkFQSF9NVVRBVEVELFxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIChfZXZlbnQ6IEV2ZW50KSA9PiBQYWdlLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlVQREFURSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByZXNvdXJjZUZvbGRlcigpOiBSZXNvdXJjZUZvbGRlciB7XHJcbiAgICAgIGlmICghdGhpcy4jcmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSBuZXcgUmVzb3VyY2VGb2xkZXIoXCJSZXNvdXJjZXNcIik7XHJcbiAgICAgIHJldHVybiB0aGlzLiNyZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQocHJvamVjdCwgZmFsc2UsIFwiUmV2aWV3IHByb2plY3Qgc2V0dGluZ3NcIiwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICDGknVpLkRpYWxvZy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhuZENoYW5nZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3IodGhpcywgxpJ1aS5EaWFsb2cuZG9tLCB0aGlzLmdldE11dGF0b3IoKSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG11dGF0b3IsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgbG9hZChfaHRtbENvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gbmV3IMaSLlBoeXNpY3MoKTtcclxuICAgICAgY29uc3QgcGFyc2VyOiBET01QYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgIHRoaXMuI2RvY3VtZW50ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhfaHRtbENvbnRlbnQsIFwidGV4dC9odG1sXCIpO1xyXG4gICAgICBjb25zdCBoZWFkOiBIVE1MSGVhZEVsZW1lbnQgPSB0aGlzLiNkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKTtcclxuXHJcbiAgICAgIHRoaXMubG9hZEZvbnRzKGhlYWQpO1xyXG5cclxuICAgICAgY29uc3Qgc2NyaXB0czogTm9kZUxpc3RPZjxIVE1MU2NyaXB0RWxlbWVudD4gPSBoZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzY3JpcHRcIik7XHJcbiAgICAgIGZvciAobGV0IHNjcmlwdCBvZiBzY3JpcHRzKSB7XHJcbiAgICAgICAgaWYgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJlZGl0b3JcIikgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIkxvYWQgc2NyaXB0OiBcIiwgdXJsKTtcclxuICAgICAgICAgIGF3YWl0IMaSLlByb2plY3QubG9hZFNjcmlwdChuZXcgVVJMKHVybCwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcG9uZW50U2NyaXB0c1wiLCDGki5Qcm9qZWN0LmdldENvbXBvbmVudFNjcmlwdHMoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjcmlwdCBOYW1lc3BhY2VzXCIsIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXNvdXJjZUxpbms6IEhUTUxMaW5rRWxlbWVudCA9IGhlYWQucXVlcnlTZWxlY3RvcihcImxpbmtbdHlwZT1yZXNvdXJjZXNdXCIpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VGaWxlOiBzdHJpbmcgPSByZXNvdXJjZUxpbmsuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xyXG4gICAgICBwcm9qZWN0LmZpbGVJbnRlcm5hbCA9IHJlc291cmNlRmlsZTtcclxuICAgICAgxpIuUHJvamVjdC5iYXNlVVJMID0gdGhpcy5iYXNlO1xyXG4gICAgICBsZXQgcmVjb25zdHJ1Y3Rpb246IMaSLlJlc291cmNlcyA9IGF3YWl0IMaSLlByb2plY3QubG9hZFJlc291cmNlcyhuZXcgVVJMKHJlc291cmNlRmlsZSwgdGhpcy5iYXNlKS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIMaSLkRlYnVnLmdyb3VwQ29sbGFwc2VkKFwiRGVzZXJpYWxpemVkXCIpO1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKHJlY29uc3RydWN0aW9uKTtcclxuICAgICAgxpIuRGVidWcuZ3JvdXBFbmQoKTtcclxuXHJcbiAgICAgIMaSLlBoeXNpY3MuY2xlYW51cCgpOyAvLyByZW1vdmUgcG90ZW50aWFsIHJpZ2lkYm9kaWVzXHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc291cmNlRm9sZGVyQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlSW50ZXJuYWxGb2xkZXIsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCByZXNvdXJjZUZvbGRlcjogxpIuU2VyaWFsaXphYmxlID0gYXdhaXQgxpIuU2VyaWFsaXplci5kZXNlcmlhbGl6ZSjGki5TZXJpYWxpemVyLnBhcnNlKHJlc291cmNlRm9sZGVyQ29udGVudCkpO1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUZvbGRlciBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgdGhpcy4jcmVzb3VyY2VGb2xkZXIgPSByZXNvdXJjZUZvbGRlcjtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgRmFpbGVkIHRvIGxvYWQgJyR7dGhpcy5maWxlSW50ZXJuYWxGb2xkZXJ9Jy4gQSBuZXcgcmVzb3VyY2UgZm9sZGVyIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBzZXR0aW5nczogSFRNTE1ldGFFbGVtZW50ID0gaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKTtcclxuICAgICAgbGV0IHByb2plY3RTZXR0aW5nczogc3RyaW5nID0gc2V0dGluZ3M/LmdldEF0dHJpYnV0ZShcInByb2plY3RcIik7XHJcbiAgICAgIHByb2plY3RTZXR0aW5ncyA9IHByb2plY3RTZXR0aW5ncz8ucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XHJcbiAgICAgIGF3YWl0IHByb2plY3QubXV0YXRlKEpTT04ucGFyc2UocHJvamVjdFNldHRpbmdzIHx8IFwie31cIikpO1xyXG5cclxuICAgICAgbGV0IGNvbmZpZzogTGF5b3V0Q29uZmlnO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzQ29udGVudDogc3RyaW5nID0gYXdhaXQgKGF3YWl0IGZldGNoKG5ldyBVUkwodGhpcy5maWxlU2V0dGluZ3MsIHRoaXMuYmFzZSkudG9TdHJpbmcoKSkpLnRleHQoKTtcclxuICAgICAgICBjb25zdCBwYW5lbFNldHRpbmdzOiDGki5TZXJpYWxpemF0aW9uID0gxpIuU2VyaWFsaXplci5wYXJzZShzZXR0aW5nc0NvbnRlbnQpO1xyXG4gICAgICAgIGNvbmZpZyA9IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQocGFuZWxTZXR0aW5ncy5sYXlvdXQpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy53YXJuKGBGYWlsZWQgdG8gbG9hZCAnJHt0aGlzLmZpbGVTZXR0aW5nc30nLiBBIG5ldyBzZXR0aW5ncyBmaWxlIHdhcyBjcmVhdGVkIGFuZCB3aWxsIGJlIHNhdmVkLmAsIF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFBhZ2UubG9hZExheW91dChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbk9mUmVzb3VyY2VzID0gxpIuUHJvamVjdC5zZXJpYWxpemUoKTtcclxuICAgICAgbGV0IGpzb246IHN0cmluZyA9IMaSLlNlcmlhbGl6ZXIuc3RyaW5naWZ5KHNlcmlhbGl6YXRpb24pO1xyXG4gICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VGb2xkZXJKU09OKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeSjGki5TZXJpYWxpemVyLnNlcmlhbGl6ZSh0aGlzLnJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNldHRpbmdzSlNPTigpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgc2V0dGluZ3M6IMaSLlNlcmlhbGl6YXRpb24gPSB7fTtcclxuICAgICAgc2V0dGluZ3MubGF5b3V0ID0gUGFnZS5nZXRMYXlvdXQoKTtcclxuXHJcbiAgICAgIHJldHVybiDGki5TZXJpYWxpemVyLnN0cmluZ2lmeShzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByb2plY3RDU1MoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICBjb250ZW50ICs9IFwiaHRtbCwgYm9keSB7XFxuICBwYWRkaW5nOiAwcHg7XFxuICBtYXJnaW46IDBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG5cIjtcclxuICAgICAgY29udGVudCArPSBcImRpYWxvZyB7IFxcbiAgdGV4dC1hbGlnbjogY2VudGVyOyBcXG59XFxuXFxuXCI7XHJcbiAgICAgIGNvbnRlbnQgKz0gXCJjYW52YXMuZnVsbHNjcmVlbiB7IFxcbiAgd2lkdGg6IDEwMHZ3OyBcXG4gIGhlaWdodDogMTAwdmg7IFxcbn1cIjtcclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm9qZWN0SFRNTChfdGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGlmICghdGhpcy4jZG9jdW1lbnQpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvamVjdEhUTUwoX3RpdGxlKTtcclxuXHJcbiAgICAgIHRoaXMuI2RvY3VtZW50LnRpdGxlID0gX3RpdGxlO1xyXG5cclxuICAgICAgbGV0IHNldHRpbmdzOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpO1xyXG4gICAgICBzZXR0aW5ncy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwic2V0dGluZ3NcIik7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcImF1dG92aWV3XCIsIHRoaXMuZ3JhcGhBdXRvVmlldyk7XHJcbiAgICAgIHNldHRpbmdzLnNldEF0dHJpYnV0ZShcInByb2plY3RcIiwgdGhpcy5zZXR0aW5nc1N0cmluZ2lmeSgpKTtcclxuICAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVt0eXBlPXNldHRpbmdzXVwiKS5yZXBsYWNlV2l0aChzZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBsZXQgYXV0b1ZpZXdTY3JpcHQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gdGhpcy4jZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNjcmlwdFtuYW1lPWF1dG9WaWV3XVwiKTtcclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KSB7XHJcbiAgICAgIC8vICAgaWYgKCFhdXRvVmlld1NjcmlwdClcclxuICAgICAgLy8gICAgIHRoaXMuI2RvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5nZXRBdXRvVmlld1NjcmlwdCgpKTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBlbHNlXHJcbiAgICAgIC8vICAgaWYgKGF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgICAgdGhpcy4jZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChhdXRvVmlld1NjcmlwdCk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlIVE1MKHRoaXMuI2RvY3VtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzIHtcclxuICAgICAgbGV0IHR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBzdXBlci5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMoX211dGF0b3IpO1xyXG4gICAgICBpZiAodHlwZXMuZ3JhcGhBdXRvVmlldylcclxuICAgICAgICB0eXBlcy5ncmFwaEF1dG9WaWV3ID0gdGhpcy5nZXRHcmFwaHMoKTtcclxuICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWR1Y2VNdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGRlbGV0ZSBfbXV0YXRvci5iYXNlO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUluZGV4O1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZUludGVybmFsRm9sZGVyO1xyXG4gICAgICBkZWxldGUgX211dGF0b3IuZmlsZVNjcmlwdDtcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTZXR0aW5ncztcclxuICAgICAgZGVsZXRlIF9tdXRhdG9yLmZpbGVTdHlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRHcmFwaHMoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IGdyYXBoczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IMaSLlByb2plY3QuZ2V0UmVzb3VyY2VzQnlUeXBlKMaSLkdyYXBoKTtcclxuICAgICAgbGV0IHJlc3VsdDogT2JqZWN0ID0ge307XHJcbiAgICAgIGZvciAobGV0IGdyYXBoIG9mIGdyYXBocykge1xyXG4gICAgICAgIHJlc3VsdFtncmFwaC5uYW1lXSA9IGdyYXBoLmlkUmVzb3VyY2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVByb2plY3RIVE1MKF90aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgbGV0IGh0bWw6IERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KF90aXRsZSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7IGNoYXJzZXQ6IFwidXRmLThcIiB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgcmVsOiBcInN0eWxlc2hlZXRcIiwgaHJlZjogdGhpcy5maWxlU3R5bGVzIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkVkaXRvciBzZXR0aW5ncyBvZiB0aGlzIHByb2plY3RcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwibWV0YVwiLCB7XHJcbiAgICAgICAgdHlwZTogXCJzZXR0aW5nc1wiLCBhdXRvdmlldzogdGhpcy5ncmFwaEF1dG9WaWV3LCBwcm9qZWN0OiB0aGlzLnNldHRpbmdzU3RyaW5naWZ5KClcclxuICAgICAgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQWN0aXZhdGUgdGhlIGZvbGxvd2luZyBsaW5lIHRvIGluY2x1ZGUgdGhlIEZVREdFLXZlcnNpb24gb2YgT2ltby1QaHlzaWNzLiBZb3UgbWF5IHdhbnQgdG8gZG93bmxvYWQgYSBsb2NhbCBjb3B5IHRvIHdvcmsgb2ZmbGluZSBhbmQgYmUgaW5kZXBlbmRlbnQgZnJvbSBmdXR1cmUgY2hhbmdlcyFcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KGA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJodHRwczovL2hzLWZ1cnR3YW5nZW4uZ2l0aHViLmlvL0ZVREdFL0Rpc3RyaWJ1dGlvbi9PaW1vUGh5c2ljcy5qc1wiPjwvc2NyaXB0PmApKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkxvYWQgRlVER0UuIFlvdSBtYXkgd2FudCB0byBkb3dubG9hZCBsb2NhbCBjb3BpZXMgdG8gd29yayBvZmZsaW5lIGFuZCBiZSBpbmRlcGVuZGVudCBmcm9tIGZ1dHVyZSBjaGFuZ2VzISBEZXZlbG9wZXJzIHdvcmtpbmcgb24gRlVER0UgaXRzZWxmIG1heSB3YW50IHRvIGNyZWF0ZSBzeW1saW5rc1wiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJzY3JpcHRcIiwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IFwiaHR0cHM6Ly9ocy1mdXJ0d2FuZ2VuLmdpdGh1Yi5pby9GVURHRS9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcImh0dHBzOi8vaHMtZnVydHdhbmdlbi5naXRodWIuaW8vRlVER0UvRGlzdHJpYnV0aW9uL0Z1ZGdlQWlkLmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTGluayBpbnRlcm5hbCByZXNvdXJjZXMuIFRoZSBlZGl0b3Igb25seSBsb2FkcyB0aGUgZmlyc3QsIGJ1dCBhdCBydW50aW1lLCBtdWx0aXBsZSBmaWxlcyBjYW4gY29udHJpYnV0ZVwiKSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJsaW5rXCIsIHsgdHlwZTogXCJyZXNvdXJjZXNcIiwgc3JjOiB0aGlzLmZpbGVJbnRlcm5hbCB9KSk7XHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJDUkxGXCIpKTtcclxuXHJcbiAgICAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZChodG1sLmNyZWF0ZUNvbW1lbnQoXCJMb2FkIGN1c3RvbSBzY3JpcHRzXCIpKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcInNjcmlwdFwiLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogdGhpcy5maWxlU2NyaXB0LCBlZGl0b3I6IFwidHJ1ZVwiIH0pKTtcclxuICAgICAgaHRtbC5oZWFkLmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNSTEZcIikpO1xyXG5cclxuICAgICAgLy8gaWYgKHRoaXMuaW5jbHVkZUF1dG9WaWV3U2NyaXB0KVxyXG4gICAgICAvLyAgIGh0bWwuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLmdldEF1dG9WaWV3U2NyaXB0KCkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiTG9hZCBBdXRvdmlldyBzY3JpcHRcIikpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwic2NyaXB0XCIsIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiBcIkF1dG92aWV3LmpzXCIgfSkpO1xyXG4gICAgICBodG1sLmhlYWQuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiQ1JMRlwiKSk7XHJcblxyXG4gICAgICBodG1sLmJvZHkuYXBwZW5kQ2hpbGQoaHRtbC5jcmVhdGVDb21tZW50KFwiRGlhbG9nIHNob3duIGF0IHN0YXJ0dXAgb25seVwiKSk7XHJcbiAgICAgIGxldCBkaWFsb2c6IEhUTUxFbGVtZW50ID0gY3JlYXRlVGFnKFwiZGlhbG9nXCIpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJGVURHRSBBdXRvdmlld1wiKSk7XHJcbiAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjcmVhdGVUYWcoXCJoMVwiLCB7fSwgXCJUaXRsZSAod2lsbCBiZSByZXBsYWNlZCBieSBBdXRvdmlldylcIikpO1xyXG4gICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY3JlYXRlVGFnKFwicFwiLCB7fSwgXCJjbGljayB0byBzdGFydFwiKSk7XHJcbiAgICAgIGh0bWwuYm9keS5hcHBlbmRDaGlsZChkaWFsb2cpO1xyXG5cclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGh0bWwuY3JlYXRlQ29tbWVudChcIkNhbnZhcyBmb3IgRlVER0UgdG8gcmVuZGVyIHRvXCIpKTtcclxuICAgICAgaHRtbC5ib2R5LmFwcGVuZENoaWxkKGNyZWF0ZVRhZyhcImNhbnZhc1wiLCB7IGNsYXNzOiBcImZ1bGxzY3JlZW5cIiB9KSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVUYWcoX3RhZzogc3RyaW5nLCBfYXR0cmlidXRlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9LCBfY29udGVudD86IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KF90YWcpO1xyXG4gICAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBpbiBfYXR0cmlidXRlcylcclxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgX2F0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XHJcbiAgICAgICAgaWYgKF9jb250ZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBfY29udGVudDtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5SFRNTChodG1sKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGdldEF1dG9WaWV3U2NyaXB0KCk6IEhUTUxTY3JpcHRFbGVtZW50IHtcclxuICAgIC8vICAgbGV0IGNvZGU6IHN0cmluZztcclxuICAgIC8vICAgY29kZSA9IChmdW5jdGlvbiAoX2dyYXBoSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gICAgIC8qKlxyXG4gICAgLy8gICAgICAqIEF1dG9WaWV3LVNjcmlwdFxyXG4gICAgLy8gICAgICAqIExvYWRzIGFuZCBkaXNwbGF5cyB0aGUgc2VsZWN0ZWQgZ3JhcGggYW5kIGltcGxlbWVudHMgYSBiYXNpYyBvcmJpdCBjYW1lcmFcclxuICAgIC8vICAgICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIxXHJcbiAgICAvLyAgICAgICovXHJcblxyXG4gICAgLy8gICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBpbml0KTtcclxuXHJcbiAgICAvLyAgICAgLy8gc2hvdyBkaWFsb2cgZm9yIHN0YXJ0dXBcclxuICAgIC8vICAgICBsZXQgZGlhbG9nOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8vICAgICBmdW5jdGlvbiBpbml0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgICAgIGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaWFsb2dcIik7XHJcbiAgICAvLyAgICAgICBkaWFsb2cucXVlcnlTZWxlY3RvcihcImgxXCIpLnRleHRDb250ZW50ID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAvLyAgICAgICBkaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgICAgICAgIC8vIEB0cy1pZ24gcmUgdW50aWwgSFRNTERpYWxvZyBpcyBpbXBsZW1lbnRlZCBieSBhbGwgYnJvd3NlcnMgYW5kIGF2YWlsYWJsZSBpbiBkb20uZC50c1xyXG4gICAgLy8gICAgICAgICBkaWFsb2cuY2xvc2UoKTtcclxuICAgIC8vICAgICAgICAgc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB9KTtcclxuICAgIC8vICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgLy8gICAgICAgZGlhbG9nLnNob3dNb2RhbCgpO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgLy8gc2V0dXAgYW5kIHN0YXJ0IGludGVyYWN0aXZlIHZpZXdwb3J0XHJcbiAgICAvLyAgICAgYXN5bmMgZnVuY3Rpb24gc3RhcnRJbnRlcmFjdGl2ZVZpZXdwb3J0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gICAgICAgLy8gbG9hZCByZXNvdXJjZXMgcmVmZXJlbmNlZCBpbiB0aGUgbGluay10YWdcclxuICAgIC8vICAgICAgIGF3YWl0IEZ1ZGdlQ29yZS5Qcm9qZWN0LmxvYWRSZXNvdXJjZXNGcm9tSFRNTCgpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlByb2plY3Q6XCIsIEZ1ZGdlQ29yZS5Qcm9qZWN0LnJlc291cmNlcyk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gcGljayB0aGUgZ3JhcGggdG8gc2hvd1xyXG4gICAgLy8gICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IDzGki5HcmFwaD5GdWRnZUNvcmUuUHJvamVjdC5yZXNvdXJjZXNbX2dyYXBoSWRdO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIkdyYXBoOlwiLCBncmFwaCk7XHJcbiAgICAvLyAgICAgICBpZiAoIWdyYXBoKSB7XHJcbiAgICAvLyAgICAgICAgIGFsZXJ0KFwiTm90aGluZyB0byByZW5kZXIuIENyZWF0ZSBhIGdyYXBoIHdpdGggYXQgbGVhc3QgYSBtZXNoLCBtYXRlcmlhbCBhbmQgcHJvYmFibHkgc29tZSBsaWdodFwiKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIHRoZSB2aWV3cG9ydFxyXG4gICAgLy8gICAgICAgbGV0IGNtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gbmV3IEZ1ZGdlQ29yZS5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgIC8vICAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImNhbnZhc1wiKTtcclxuICAgIC8vICAgICAgIGxldCB2aWV3cG9ydDogxpIuVmlld3BvcnQgPSBuZXcgRnVkZ2VDb3JlLlZpZXdwb3J0KCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5pbml0aWFsaXplKFwiSW50ZXJhY3RpdmVWaWV3cG9ydFwiLCBncmFwaCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgLy8gICAgICAgRnVkZ2VDb3JlLkRlYnVnLmxvZyhcIlZpZXdwb3J0OlwiLCB2aWV3cG9ydCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gaGlkZSB0aGUgY3Vyc29yIHdoZW4gaW50ZXJhY3RpbmcsIGFsc28gc3VwcHJlc3NpbmcgcmlnaHQtY2xpY2sgbWVudVxyXG4gICAgLy8gICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jayk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24gKCk6IHZvaWQgeyBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTsgfSk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gbWFrZSB0aGUgY2FtZXJhIGludGVyYWN0aXZlIChjb21wbGV4IG1ldGhvZCBpbiBGdWRnZUFpZClcclxuICAgIC8vICAgICAgIGxldCBjYW1lcmFPcmJpdDogRnVkZ2VBaWQuQ2FtZXJhT3JiaXQgPSBGdWRnZUFpZC5WaWV3cG9ydC5leHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQodmlld3BvcnQpO1xyXG5cclxuICAgIC8vICAgICAgIC8vIHNldHVwIGF1ZGlvXHJcbiAgICAvLyAgICAgICBsZXQgY21wTGlzdGVuZXI6IMaSLkNvbXBvbmVudEF1ZGlvTGlzdGVuZXIgPSBuZXcgxpIuQ29tcG9uZW50QXVkaW9MaXN0ZW5lcigpO1xyXG4gICAgLy8gICAgICAgY21wQ2FtZXJhLm5vZGUuYWRkQ29tcG9uZW50KGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5XaXRoKGNtcExpc3RlbmVyKTtcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdC5saXN0ZW5UbyhncmFwaCk7XHJcbiAgICAvLyAgICAgICBGdWRnZUNvcmUuRGVidWcubG9nKFwiQXVkaW86XCIsIEZ1ZGdlQ29yZS5BdWRpb01hbmFnZXIuZGVmYXVsdCk7XHJcblxyXG4gICAgLy8gICAgICAgLy8gZHJhdyB2aWV3cG9ydCBvbmNlIGZvciBpbW1lZGlhdGUgZmVlZGJhY2tcclxuICAgIC8vICAgICAgIEZ1ZGdlQ29yZS5SZW5kZXIucHJlcGFyZShjYW1lcmFPcmJpdCk7XHJcbiAgICAvLyAgICAgICB2aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyAgICAgICBjYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJpbnRlcmFjdGl2ZVZpZXdwb3J0U3RhcnRlZFwiLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdmlld3BvcnQgfSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfSkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAvLyAgIGNvZGUgPSBcIihcIiArIGNvZGUgKyBgKShkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW2F1dG9WaWV3XVwiKS5nZXRBdHRyaWJ1dGUoXCJhdXRvVmlld1wiKSk7XFxuYDtcclxuICAgIC8vICAgbGV0IHNjcmlwdDogSFRNTFNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgLy8gICBzY3JpcHQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImF1dG9WaWV3XCIpO1xyXG4gICAgLy8gICBzY3JpcHQudGV4dENvbnRlbnQgPSBjb2RlO1xyXG4gICAgLy8gICByZXR1cm4gc2NyaXB0O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dGluZ3NTdHJpbmdpZnkoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBwcm9qZWN0LmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICAgIGxldCBzZXR0aW5nczogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobXV0YXRvcik7XHJcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MucmVwbGFjZSgvXCIvZywgXCInXCIpO1xyXG4gICAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHJpbmdpZnlIVE1MKF9odG1sOiBEb2N1bWVudCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9IChuZXcgWE1MU2VyaWFsaXplcigpKS5zZXJpYWxpemVUb1N0cmluZyhfaHRtbCk7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8+PC9nLCBcIj5cXG48XCIpO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvPCEtLUNSTEYtLT4vZywgXCJcIik7XHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cIj5cXG48XFwvc2NyaXB0L2csIGBcIj48L3NjcmlwdGApO1xyXG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFxuKjxcXC9ib2R5Pi9nLCBcIlxcbjxcXC9ib2R5PlwiKTsgLy8gcmVtb3ZlIGxpbmUgYnJlYWtzIGFkZGVkIGJ5IHNlcmlhbGl6ZVRvU3RyaW5nIGJlZm9yZSBjbG9zaW5nIGJvZHktdGFnXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkRm9udHMoX2hlYWQ6IEhUTUxIZWFkRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAvLyBjb2xsZWN0IGFsbCBmb250cyBmcm9tIF9oZWFkIGFuZCBhZGQgdGhlbSB0byB0aGUgaGVhZCBvZiB0aGUgZWRpdG9ycyBkb2N1bWVudCBzbyB0aGF0IHRoZXkgYXJlIGF2YWlsYWJsZSBmb3IgY29tcG9uZW50IHRleHRcclxuICAgICAgY29uc3QgZm9udHM6IEhUTUxTdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICBjb25zdCBjc3NMaW5rczogTm9kZUxpc3RPZjxIVE1MTGlua0VsZW1lbnQ+ID0gX2hlYWQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyk7XHJcbiAgICAgIGNvbnN0IGNzc1N0eWxlczogTm9kZUxpc3RPZjxIVE1MU3R5bGVFbGVtZW50PiA9IF9oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJyk7XHJcbiAgICAgIGNvbnN0IGNzc1J1bGVzOiBDU1NSdWxlW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGxpbmsgb2YgY3NzTGlua3MpIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBuZXcgVVJMKGxpbmsuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSwgdGhpcy5iYXNlKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBjc3NUZXh0OiBzdHJpbmcgPSBhd2FpdCAoYXdhaXQgZmV0Y2godXJsKSkudGV4dCgpOyAvLyBUT0RPOiB1c2UgRmlsZUlPXHJcbiAgICAgICAgY3NzUnVsZXMucHVzaCguLi5nZXRSdWxlcyhjc3NUZXh0KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IHN0eWxlIG9mIGNzc1N0eWxlcylcclxuICAgICAgICBjc3NSdWxlcy5wdXNoKC4uLmdldFJ1bGVzKHN0eWxlLmlubmVySFRNTCkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgcnVsZSBvZiBjc3NSdWxlcylcclxuICAgICAgICBpZiAocnVsZSBpbnN0YW5jZW9mIENTU0ZvbnRGYWNlUnVsZSlcclxuICAgICAgICAgIGZvbnRzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUuY3NzVGV4dCkpO1xyXG5cclxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChmb250cyk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRSdWxlcyhfdGV4dDogc3RyaW5nKTogQ1NTUnVsZUxpc3Qge1xyXG4gICAgICAgIGxldCBzdHlsZVNoZWV0OiBDU1NTdHlsZVNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcclxuICAgICAgICBzdHlsZVNoZWV0LnJlcGxhY2VTeW5jKF90ZXh0KTtcclxuICAgICAgICByZXR1cm4gc3R5bGVTaGVldC5jc3NSdWxlcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyQW5pbWF0aW9uIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBST1BFUlRZX0NPTE9SUzogc3RyaW5nW10gPSBbXHJcbiAgICAgIFwicmVkXCIsXHJcbiAgICAgIFwibGltZWdyZWVuXCIsXHJcbiAgICAgIFwiYmx1ZVwiLFxyXG4gICAgICBcImN5YW5cIixcclxuICAgICAgXCJtYWdlbnRhXCIsXHJcbiAgICAgIFwieWVsbG93XCIsXHJcbiAgICAgIFwic2FsbW9uXCIsXHJcbiAgICAgIFwibGlnaHRncmVlblwiLFxyXG4gICAgICBcImNvcm5mbG93ZXJibHVlXCJcclxuICAgIF07XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3QW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBzZXF1ZW5jZXM6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYW5pbWF0aW9uOiDGki5BbmltYXRpb24sIF9kb206IEhUTUxFbGVtZW50LCBfdmlldzogVmlld0FuaW1hdGlvbikge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgIHRoaXMuZG9tID0gX2RvbTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNMSUNLLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy52aWV3ID0gX3ZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShfbXV0YXRvcjogxpIuTXV0YXRvciwgX3RpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IGNvbG9ySW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgIGxldCBrZXlTZWxlY3RlZDogxpIuQW5pbWF0aW9uS2V5ID0gdGhpcy52aWV3LmtleVNlbGVjdGVkO1xyXG5cclxuICAgICAgdXBkYXRlUmVjdXJzaXZlKHRoaXMuZG9tLCBfbXV0YXRvciwgdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlLCBfdGltZSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVSZWN1cnNpdmUoX2RvbTogSFRNTEVsZW1lbnQsIF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfYW5pbWF0aW9uU3RydWN0dXJlOiDGki5BbmltYXRpb25TdHJ1Y3R1cmUsIF90aW1lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnQ6IMaSdWkuQ3VzdG9tRWxlbWVudCA9IDzGknVpLkN1c3RvbUVsZW1lbnQ+xpJ1aS5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICAgICAgbGV0IHN0cnVjdHVyZU9yU2VxdWVuY2U6IE9iamVjdCA9IF9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuQ3VzdG9tRWxlbWVudCAmJiBzdHJ1Y3R1cmVPclNlcXVlbmNlIGluc3RhbmNlb2YgxpIuQW5pbWF0aW9uU2VxdWVuY2UpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGxldCBrZXk6IMaSLkFuaW1hdGlvbktleSA9IHN0cnVjdHVyZU9yU2VxdWVuY2UuZmluZEtleShfdGltZSk7XHJcbiAgICAgICAgICAgIGlmIChrZXkpIHsvLyBrZXkgZm91bmQgYXQgZXhhY3RseSB0aGUgZ2l2ZW4gdGltZSwgdGFrZSBpdHMgdmFsdWVcclxuICAgICAgICAgICAgICB2YWx1ZSA9IGtleS52YWx1ZTtcclxuICAgICAgICAgICAgICBpZiAoa2V5ID09IGtleVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tY29sb3ItYW5pbWF0aW9uLXByb3BlcnR5XCIsIGdldE5leHRDb2xvcigpKTtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBSZWZsZWN0LnNldChlbGVtZW50LCBcImFuaW1hdGlvblNlcXVlbmNlXCIsIHN0cnVjdHVyZU9yU2VxdWVuY2UpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXBkYXRlUmVjdXJzaXZlKGVsZW1lbnQsIHZhbHVlLCA8xpIuQW5pbWF0aW9uU3RydWN0dXJlPnN0cnVjdHVyZU9yU2VxdWVuY2UsIF90aW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldE5leHRDb2xvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBjb2xvcjogc3RyaW5nID0gQ29udHJvbGxlckFuaW1hdGlvbi5QUk9QRVJUWV9DT0xPUlNbY29sb3JJbmRleF07XHJcbiAgICAgICAgY29sb3JJbmRleCA9IChjb2xvckluZGV4ICsgMSkgJSBDb250cm9sbGVyQW5pbWF0aW9uLlBST1BFUlRZX0NPTE9SUy5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbW9kaWZ5IG9yIGFkZCBrZXlcclxuICAgIHB1YmxpYyB1cGRhdGVTZXF1ZW5jZShfdGltZTogbnVtYmVyLCBfZWxlbWVudDogxpJ1aS5DdXN0b21FbGVtZW50LCBfYWRkOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiDGki5BbmltYXRpb25TZXF1ZW5jZSA9IFJlZmxlY3QuZ2V0KF9lbGVtZW50LCBcImFuaW1hdGlvblNlcXVlbmNlXCIpO1xyXG4gICAgICBpZiAoIXNlcXVlbmNlKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSBzZXF1ZW5jZS5maW5kS2V5KF90aW1lKTtcclxuICAgICAgaWYgKCFrZXkpIHtcclxuICAgICAgICBpZiAoX2FkZCkge1xyXG4gICAgICAgICAga2V5ID0gbmV3IMaSLkFuaW1hdGlvbktleShfdGltZSwgPG51bWJlcj5fZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgICAgICBzZXF1ZW5jZS5hZGRLZXkoa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZVxyXG4gICAgICAgIHNlcXVlbmNlLm1vZGlmeUtleShrZXksIG51bGwsIDxudW1iZXI+X2VsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YToga2V5IH0gfSk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uLmNhbGN1bGF0ZVRvdGFsVGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0S2V5KF90aW1lOiBudW1iZXIsIF9kaXJlY3Rpb246IFwiZm9yd2FyZFwiIHwgXCJiYWNrd2FyZFwiKTogbnVtYmVyIHtcclxuICAgICAgbGV0IG5leHRLZXk6IMaSLkFuaW1hdGlvbktleSA9IHRoaXMuc2VxdWVuY2VzXHJcbiAgICAgICAgLmZsYXRNYXAoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKSlcclxuICAgICAgICAuc29ydChfZGlyZWN0aW9uID09IFwiZm9yd2FyZFwiICYmICgoX2EsIF9iKSA9PiBfYS50aW1lIC0gX2IudGltZSkgfHwgX2RpcmVjdGlvbiA9PSBcImJhY2t3YXJkXCIgJiYgKChfYSwgX2IpID0+IF9iLnRpbWUgLSBfYS50aW1lKSlcclxuICAgICAgICAuZmluZChfa2V5ID0+IF9kaXJlY3Rpb24gPT0gXCJmb3J3YXJkXCIgJiYgX2tleS50aW1lID4gX3RpbWUgfHwgX2RpcmVjdGlvbiA9PSBcImJhY2t3YXJkXCIgJiYgX2tleS50aW1lIDwgX3RpbWUpO1xyXG4gICAgICBpZiAobmV4dEtleSlcclxuICAgICAgICByZXR1cm4gbmV4dEtleS50aW1lO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIF90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQcm9wZXJ0eShfcGF0aDogc3RyaW5nW10sIF9ub2RlOiDGki5Ob2RlLCBfdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblNlcXVlbmNlIHwgxpIuQW5pbWF0aW9uU3RydWN0dXJlID0gdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RydWN0dXJlO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgX3BhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gX3BhdGhbaV07XHJcbiAgICAgICAgaWYgKCEoa2V5IGluIHN0cnVjdHVyZSkpXHJcbiAgICAgICAgICBzdHJ1Y3R1cmVba2V5XSA9IHt9O1xyXG4gICAgICAgIHN0cnVjdHVyZSA9IHN0cnVjdHVyZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSBuZXcgxpIuQW5pbWF0aW9uU2VxdWVuY2UoKTtcclxuICAgICAgc2VxdWVuY2UuYWRkS2V5KG5ldyDGki5BbmltYXRpb25LZXkoX3RpbWUsIDApKTtcclxuICAgICAgc3RydWN0dXJlW19wYXRoW19wYXRoLmxlbmd0aCAtIDFdXSA9IHNlcXVlbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVQcm9wZXJ0eShfZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLmRvbS5jb250YWlucyhfZWxlbWVudCkpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBfZWxlbWVudDtcclxuICAgICAgd2hpbGUgKGVsZW1lbnQgIT09IHRoaXMuZG9tKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgIHBhdGgudW5zaGlmdChlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kZWxldGVQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWRTZXF1ZW5jZXMoX3NlbGVjdGVkUHJvcGVydHk/OiBIVE1MRWxlbWVudCk6IFZpZXdBbmltYXRpb25TZXF1ZW5jZVtdIHtcclxuICAgICAgbGV0IHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10gPSBbXTtcclxuICAgICAgY29sbGVjdFNlbGVjdGVkU2VxdWVuY2VzUmVjdXJzaXZlKHRoaXMuZG9tLCB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmUsIHNlcXVlbmNlcywgX3NlbGVjdGVkUHJvcGVydHkgPT0gbnVsbCk7XHJcbiAgICAgIHJldHVybiBzZXF1ZW5jZXM7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb2xsZWN0U2VsZWN0ZWRTZXF1ZW5jZXNSZWN1cnNpdmUoX2RvbTogSFRNTEVsZW1lbnQsIF9hbmltYXRpb25TdHJ1Y3R1cmU6IMaSLkFuaW1hdGlvblN0cnVjdHVyZSwgX3NlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10sIF9pc1NlbGVjdGVkRGVzY2VuZGFudDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9hbmltYXRpb25TdHJ1Y3R1cmUpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IMaSdWkuQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbSwga2V5KTtcclxuICAgICAgICAgIGxldCBpc1NlbGVjdGVkRGVzY2VuZGFudDogYm9vbGVhbiA9IF9pc1NlbGVjdGVkRGVzY2VuZGFudCB8fCBlbGVtZW50ID09IF9zZWxlY3RlZFByb3BlcnR5O1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgbGV0IHNlcXVlbmNlOiBPYmplY3QgPSBfYW5pbWF0aW9uU3RydWN0dXJlW2tleV07XHJcbiAgICAgICAgICBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TZXF1ZW5jZSAmJiBpc1NlbGVjdGVkRGVzY2VuZGFudCkge1xyXG4gICAgICAgICAgICBfc2VxdWVuY2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWFuaW1hdGlvbi1wcm9wZXJ0eVwiKSxcclxuICAgICAgICAgICAgICBkYXRhOiBzZXF1ZW5jZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbGxlY3RTZWxlY3RlZFNlcXVlbmNlc1JlY3Vyc2l2ZShlbGVtZW50LCA8xpIuQW5pbWF0aW9uU3RydWN0dXJlPl9hbmltYXRpb25TdHJ1Y3R1cmVba2V5XSwgX3NlcXVlbmNlcywgaXNTZWxlY3RlZERlc2NlbmRhbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVsZXRlUGF0aChfcGF0aDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSB0aGlzLmFuaW1hdGlvbi5hbmltYXRpb25TdHJ1Y3R1cmU7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBfcGF0aC5sZW5ndGggLSAxOyBpKyspXHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVtfcGF0aFtpXV07XHJcbiAgICAgIGRlbGV0ZSB2YWx1ZVtfcGF0aFtfcGF0aC5sZW5ndGggLSAxXV07XHJcblxyXG4gICAgICBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKHRoaXMuYW5pbWF0aW9uLmFuaW1hdGlvblN0cnVjdHVyZSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBkZWxldGVFbXB0eVBhdGhzUmVjdXJzaXZlKF9vYmplY3Q6IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX29iamVjdCkge1xyXG4gICAgICAgICAgaWYgKF9vYmplY3Rba2V5XSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvblNlcXVlbmNlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IGRlbGV0ZUVtcHR5UGF0aHNSZWN1cnNpdmUoX29iamVjdFtrZXldKTtcclxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgZGVsZXRlIF9vYmplY3Rba2V5XTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF9vYmplY3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIF9vYmplY3Q7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5DTElDSzpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8ICF0aGlzLmFuaW1hdGlvbiB8fCBfZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGxldCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gX2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50IHx8IHRhcmdldCBpbnN0YW5jZW9mIMaSdWkuRGV0YWlscylcclxuICAgICAgICAgICAgdGhpcy5zZXF1ZW5jZXMgPSB0aGlzLmdldFNlbGVjdGVkU2VxdWVuY2VzKHRhcmdldCk7XHJcbiAgICAgICAgICBlbHNlIGlmICh0YXJnZXQgPT0gdGhpcy5kb20pXHJcbiAgICAgICAgICAgIHRoaXMuc2VxdWVuY2VzID0gdGhpcy5nZXRTZWxlY3RlZFNlcXVlbmNlcygpO1xyXG5cclxuICAgICAgICAgIHRoaXMudmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLnNlcXVlbmNlcyB9IH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB2aWV3J3Mgc3RhdGUuIER1cmluZyByZWNvbnN0cnVjdGlvbiwgdmlld3MgcmVjZWl2ZSBhIG1lcmdlZCBzdGF0ZSBvYmplY3QgdGhhdCBjb21iaW5lcyB0aGUgc3RhdGVzIG9mIGJvdGggdGhlaXIgcGFuZWwgYW5kIHRoZSB2aWV3IGl0c2VsZi5cclxuICAgKiBFbnN1cmUgdW5pcXVlIHByb3BlcnR5IG5hbWVzIHRvIGF2b2lkIGNvbmZsaWN0cy5cclxuICAgKi9cclxuICBleHBvcnQgdHlwZSBWaWV3U3RhdGUgPSDGki5TZXJpYWxpemF0aW9uO1xyXG5cclxuICB0eXBlIFZpZXdzID0geyBbaWQ6IHN0cmluZ106IFZpZXcgfTtcclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgW1tWaWV3XV1zIHRvIHN1cHBvcnQgZ2VuZXJpYyBmdW5jdGlvbmFsaXR5XHJcbiAgICogQGF1dGhvcnMgTW9uaWthIEdhbGtld2l0c2NoLCBIRlUsIDIwMTkgfCBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdmlld3M6IFZpZXdzID0ge307XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51OiBFbGVjdHJvbi5NZW51O1xyXG4gICAgI2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyO1xyXG4gICAgI2lkOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgdGhpcy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgLy8gdGhpcy5kb20uc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIjtcclxuICAgICAgdGhpcy5kb20uc2V0QXR0cmlidXRlKFwidmlld1wiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG5cclxuICAgICAgLy9fY29udGFpbmVyLmdldEVsZW1lbnQoKS5hcHBlbmQodGhpcy5kb20pOyAvL29sZFxyXG4gICAgICB0aGlzLiNjb250YWluZXIgPSBfY29udGFpbmVyO1xyXG4gICAgICB0aGlzLiNjb250YWluZXIuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XHJcbiAgICAgIHRoaXMuI2NvbnRhaW5lci5zdGF0ZVJlcXVlc3RFdmVudCA9IHRoaXMuZ2V0U3RhdGUuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLm9uKFwiZGVzdHJveVwiLCAoKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIFZpZXcudmlld3NbdGhpcy4jaWRdO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNMT1NFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jb250ZXh0TWVudUNhbGxiYWNrKTtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudSA9IHRoaXMuZ2V0Q29udGV4dE1lbnUodGhpcy5jb250ZXh0TWVudUNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAvLyB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRVRfUFJPSkVDVCwgdGhpcy5obmRFdmVudENvbW1vbik7XHJcblxyXG4gICAgICB0aGlzLiNpZCA9IFZpZXcucmVnaXN0ZXJWaWV3Rm9yRHJhZ0Ryb3AodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRWaWV3U291cmNlKF9ldmVudDogRHJhZ0V2ZW50KTogVmlldyB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGF0YVRyYW5zZmVyKVxyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2V2ZW50LmRhdGFUcmFuc2Zlci5pdGVtcylcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUuc3RhcnRzV2l0aChcInNvdXJjZXZpZXdcIikpXHJcbiAgICAgICAgICAgIHJldHVybiBWaWV3LnZpZXdzW2l0ZW0udHlwZS5zcGxpdChcIjpcIikucG9wKCldO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWdpc3RlclZpZXdGb3JEcmFnRHJvcChfdGhpczogVmlldyk6IG51bWJlciB7XHJcbiAgICAgIFZpZXcudmlld3NbVmlldy5pZENvdW50XSA9IF90aGlzO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcmFnIHN0YXJ0cywgYWRkIGlkZW50aWZpZXIgdG8gdGhlIGV2ZW50IGluIGEgd2F5IHRoYXQgYWxsb3dzIGRyYWdvdmVyIHRvIHByb2Nlc3MgdGhlIHNvdXJlXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19TVEFSVCwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcIlNvdXJjZVZpZXc6XCIgKyBfdGhpcy4jaWQudG9TdHJpbmcoKSwgXCJ0eXBlc0hhY2tcIik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcmFnIGVudGVyIGEgdmlldywgZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgdmlldyBmb3IgZHJhZ2dpbmcgYW5kIGNhbGwgaG5kRHJhZ0VudGVyXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJBR19FTlRFUiwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIF90aGlzLmhuZERyYWdFbnRlcihfZXZlbnQsIFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyB3aGVuIGRyYWdnaW5nIG92ZXIgYSB2aWV3LCBnZXQgdGhlIG9yaWdpbmFsIHNvdXJjZSB2aWV3IGZvciBkcmFnZ2luZyBhbmQgY2FsbCBobmREcmFnT3ZlclxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRSQUdfT1ZFUiwgKF9ldmVudDogRHJhZ0V2ZW50KSA9PiB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIF90aGlzLmhuZERyYWdPdmVyKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGRyYWcgb3ZlciBkdXJpbmcgY2FwdHVyZSBwaGFzZSwgYWxsb3dzIHZpZXdzIHRvIHByZXZlbnQgZXZlbnQgcmVhY2hpbmcgdGhlIGFjdHVhbCB0YXJnZXRcclxuICAgICAgX3RoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUkFHX09WRVIsIF9ldmVudCA9PiBfdGhpcy5obmREcmFnT3ZlckNhcHR1cmUoX2V2ZW50LCBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KSksIHRydWUpO1xyXG5cclxuICAgICAgLy8gd2hlbiBkcm9wcGluZyBpbnRvIGEgdmlldywgZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgdmlldyBmb3IgZHJhZ2dpbmcgYW5kIGNhbGwgaG5kRHJvcFxyXG4gICAgICBfdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkRST1AsIChfZXZlbnQ6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBfdGhpcy5obmREcm9wKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpO1xyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAvLyBkcm9wIGR1cmluZyBjYXB0dXJlIHBoYXNlLCBhbGxvd3Mgdmlld3MgbWFuaXB1bGF0ZSB0aGUgZHJvcCBkYXRhIGJlZm9yZSB0aGUgYWN0dWFsIHRhcmdldCBpcyByZWFjaGVkXHJcbiAgICAgIF90aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuRFJPUCwgX2V2ZW50ID0+IF90aGlzLmhuZERyb3BDYXB0dXJlKF9ldmVudCwgVmlldy5nZXRWaWV3U291cmNlKF9ldmVudCkpLCB0cnVlKTtcclxuXHJcbiAgICAgIHJldHVybiBWaWV3LmlkQ291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGlkKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBgJHt0aGlzLiNpZH1fJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VGl0bGUoX3RpdGxlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy4jY29udGFpbmVyLnNldFRpdGxlKF90aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBPYmplY3RbXSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGF0Y2goX3R5cGU6IEVWRU5UX0VESVRPUiwgX2luaXQ6IEN1c3RvbUV2ZW50SW5pdDxFdmVudERldGFpbD4pOiB2b2lkIHtcclxuICAgICAgX2luaXQuZGV0YWlsID0gX2luaXQuZGV0YWlsIHx8IHt9O1xyXG4gICAgICBfaW5pdC5kZXRhaWwudmlldyA9IF9pbml0LmRldGFpbC52aWV3IHx8IHRoaXM7XHJcbiAgICAgIHRoaXMuZG9tLmRpc3BhdGNoRXZlbnQobmV3IEVkaXRvckV2ZW50KF90eXBlLCBfaW5pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwYXRjaFRvUGFyZW50KF90eXBlOiBFVkVOVF9FRElUT1IsIF9pbml0OiBDdXN0b21FdmVudEluaXQ8RXZlbnREZXRhaWw+KTogdm9pZCB7XHJcbiAgICAgIF9pbml0LmRldGFpbCA9IF9pbml0LmRldGFpbCB8fCB7fTtcclxuICAgICAgX2luaXQuYnViYmxlcyA9IHRydWU7XHJcbiAgICAgIF9pbml0LmRldGFpbC52aWV3ID0gX2luaXQuZGV0YWlsLnZpZXcgfHwgdGhpcztcclxuICAgICAgdGhpcy5kb20ucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFZGl0b3JFdmVudChfdHlwZSwgX2luaXQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gIENvbnRleHRNZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgQ29udGV4dE1lbnU6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gRXZlbnRzXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9zb3VyY2UsIF9ldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnRW50ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF9zb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnRDb21tb24gPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgIC8vICAgY2FzZSBFVkVOVF9FRElUT1IuU0VUX1BST0pFQ1Q6XHJcbiAgICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51ID0gdGhpcy5nZXRDb250ZXh0TWVudSh0aGlzLmNvbnRleHRNZW51Q2FsbGJhY2suYmluZCh0aGlzKSk7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCB0aGUgZXh0ZXJuYWwgcmVzb3VyY2VzXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdFeHRlcm5hbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLlRyZWU8RGlyZWN0b3J5RW50cnk+O1xyXG5cclxuICAgICNleHBhbmRlZDogc3RyaW5nW107IC8vIGNhY2hlIHN0YXRlIGZyb20gY29uc3RydWN0b3JcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQcm9qZWN0KCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nID0gbmV3IFVSTChcIi5cIiwgxpIuUHJvamVjdC5iYXNlVVJMKS5wYXRobmFtZTtcclxuICAgICAgaWYgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PSBcIldpbjMyXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09IFwiV2luNjRcIikge1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTsgLy8gc3RyaXAgbGVhZGluZyBzbGFzaFxyXG4gICAgICB9XHJcbiAgICAgIGxldCByb290OiBEaXJlY3RvcnlFbnRyeSA9IERpcmVjdG9yeUVudHJ5LmNyZWF0ZVJvb3QocGF0aCk7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLlRyZWU8RGlyZWN0b3J5RW50cnk+KG5ldyBDb250cm9sbGVyVHJlZURpcmVjdG9yeSgpLCByb290KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy50cmVlLmdldEl0ZW1zKClbMF0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBgRHJhZyAmIGRyb3AgZXh0ZXJuYWwgaW1hZ2UsIGF1ZGlvZmlsZSBldGMuIHRvIHRoZSBcIkludGVybmFsXCIsIHRvIGNyZWF0ZSBhIEZVREdFLXJlc291cmNlYDtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNleHBhbmRlZClcclxuICAgICAgICB0aGlzLmV4cGFuZCh0aGlzLiNleHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk6IERpcmVjdG9yeUVudHJ5W10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEpICAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoaXMgaXMgZXZlciB0aGUgY2FzZT9cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIC8vIG5vdGhpbmcgYWN0dWFsbHkgc2VsZWN0ZWQuLi5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk9QRU46XHJcbiAgICAgICAgICB0aGlzLnNldFByb2plY3QoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMudHJlZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKGl0ZW0uZGF0YS5wYXRoUmVsYXRpdmUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBleHBhbmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZChfcGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHBhdGhzOiBEaXJlY3RvcnlFbnRyeVtdW10gPSBfcGF0aHMubWFwKF9wYXRoID0+IG5ldyBEaXJlY3RvcnlFbnRyeShcIlwiLCBfcGF0aCwgbnVsbCwgbnVsbCkuZ2V0UGF0aCgpKTtcclxuICAgICAgdGhpcy50cmVlLmV4cGFuZChwYXRocyk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3SW50ZXJuYWwgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgZ2x0ZkltcG9ydFNldHRpbmdzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHsgLy8gVE9ETzogc2F2ZSB0aGVzZSBzZXR0aW5ncz9cclxuICAgICAgW8aSLkdyYXBoLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuQW5pbWF0aW9uLm5hbWVdOiB0cnVlLFxyXG4gICAgICBbxpIuTWF0ZXJpYWwubmFtZV06IGZhbHNlLFxyXG4gICAgICBbxpIuTWVzaC5uYW1lXTogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgLy8gVE9ETzogZWl0aGVyIHJlbW92ZSBWaWV3SW50ZXJuYWxUYWJsZSBvciB1bmlmeSBjb21tb24gZnVuY3Rpb25hbGl0eSB3aXRoIFZpZXdJbnRlcm5hbEZvbGRlciBpbnRvIFZpZXdJbnRlcm5hbC4uLlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheXMgdGhlIGludGVybmFsIHJlc291cmNlcyBhcyBhIGZvbGRlciB0cmVlLlxyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwIHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDI0IFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3SW50ZXJuYWxGb2xkZXIgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGknVpLlRyZWU8UmVzb3VyY2VFbnRyeT47XHJcblxyXG4gICAgI2V4cGFuZGVkOiBzdHJpbmdbXTsgLy8gY2FjaGUgc3RhdGUgZnJvbSBjb25zdHJ1Y3RvclxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5PUEVOLCB0aGlzLmhuZE9wZW4pO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ1JFQVRFLCB0aGlzLmhuZENyZWF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuaG5kS2V5Ym9hcmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLiNleHBhbmRlZCA9IF9zdGF0ZVtcImV4cGFuZGVkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29udHJvbGxlcigpOiBDb250cm9sbGVyVHJlZVJlc291cmNlIHtcclxuICAgICAgcmV0dXJuIDxDb250cm9sbGVyVHJlZVJlc291cmNlPnRoaXMudHJlZS5jb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VGb2xkZXIoKTogUmVzb3VyY2VGb2xkZXIge1xyXG4gICAgICByZXR1cm4gcHJvamVjdC5yZXNvdXJjZUZvbGRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2VsZWN0aW9uKCk6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10ge1xyXG4gICAgICByZXR1cm4gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5maWx0ZXIoX2VsZW1lbnQgPT4gIShfZWxlbWVudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIDzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPnRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLmZpbHRlcihfc291cmNlID0+ICEoX3NvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBpcyBhIHByZXBhcmF0aW9uIGZvciBzeW5jaW5nIGEgZ3JhcGggd2l0aCBpdHMgaW5zdGFuY2VzIGFmdGVyIHN0cnVjdHVyYWwgY2hhbmdlc1xyXG4gICAgLy8gcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIGxldCByb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSA8SFRNTFRhYmxlUm93RWxlbWVudD5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZCgoX2VsZW1lbnQpID0+ICg8SFRNTEVsZW1lbnQ+X2VsZW1lbnQpLnRhZ05hbWUgPT0gXCJUUlwiKTtcclxuICAgIC8vICAgaWYgKHJvdylcclxuICAgIC8vICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuU1lOQ19JTlNUQU5DRVMpKS5lbmFibGVkID0gKHJvdy5nZXRBdHRyaWJ1dGUoXCJpY29uXCIpID09IFwiR3JhcGhcIik7XHJcbiAgICAvLyAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBGb2xkZXJcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkNyZWF0ZSBHcmFwaFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkdcIiB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIE1lc2hcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9NRVNIKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIMaSLk1lc2gsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNYXRlcmlhbFwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMKSxcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT04pLFxyXG4gICAgICAgIHN1Ym1lbnU6IENvbnRleHRNZW51LmdldFN1YmNsYXNzTWVudShDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OLCDGki5BbmltYXRpb24sIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogYENyZWF0ZSAke8aSLlBhcnRpY2xlU3lzdGVtLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfUEFSVElDTEVfRUZGRUNUKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkRlbGV0ZVwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBsZXQgY2hvaWNlOiBDT05URVhUTUVOVSA9IE51bWJlcihfaXRlbS5pZCk7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKGBNZW51U2VsZWN0IHwgaWQ6ICR7Q09OVEVYVE1FTlVbX2l0ZW0uaWRdfSB8IGV2ZW50OiAke19ldmVudH1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGlmICghaVN1YmNsYXNzICYmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0ggfHwgY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCkpIHtcclxuICAgICAgICBhbGVydChcIkZ1bmt5IEVsZWN0cm9uLUVycm9yLi4uIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IFJlc291cmNlRW50cnkgPSB0aGlzLnRyZWUuZ2V0Rm9jdXNzZWQoKTtcclxuXHJcbiAgICAgIGlmIChjaG9pY2UgPT0gQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSB7XHJcbiAgICAgICAgaWYgKCgoYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKSkubGVuZ3RoID4gMCkpXHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKGZvY3VzIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCByZXNvdXJjZTogUmVzb3VyY2VFbnRyeTtcclxuXHJcbiAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfRk9MREVSOlxyXG4gICAgICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2VGb2xkZXIoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0g6XHJcbiAgICAgICAgICBsZXQgdHlwZU1lc2g6IHR5cGVvZiDGki5NZXNoID0gxpIuTWVzaC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IHR5cGVNZXNoKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTDpcclxuICAgICAgICAgIGxldCB0eXBlU2hhZGVyOiB0eXBlb2YgxpIuU2hhZGVyID0gxpIuU2hhZGVyLnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIHJlc291cmNlID0gbmV3IMaSLk1hdGVyaWFsKHR5cGVTaGFkZXIubmFtZSwgdHlwZVNoYWRlcik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSDpcclxuICAgICAgICAgIHJlc291cmNlID0gYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgobmV3IMaSLk5vZGUoXCJOZXdHcmFwaFwiKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyB0eXBlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1Q6XHJcbiAgICAgICAgICByZXNvdXJjZSA9IG5ldyDGki5QYXJ0aWNsZVN5c3RlbSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkNSRUFURSwge30pO1xyXG4gICAgICAgIHRoaXMudHJlZS5hZGRDaGlsZHJlbihbcmVzb3VyY2VdLCBmb2N1cyk7XHJcbiAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKHJlc291cmNlKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoaXRlbSAhPSB0aGlzLmRvbSAmJiAhKGl0ZW0gaW5zdGFuY2VvZiDGknVpLlRyZWVJdGVtKSlcclxuICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgaWYgKGl0ZW0gPT0gdGhpcy5kb20pIHtcclxuICAgICAgICBpdGVtID0gdGhpcy50cmVlLmZpbmRWaXNpYmxlKHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICAgIGl0ZW0uZm9jdXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIMaSdWkuVHJlZUl0ZW0pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUuaXRlbXMuZm9yRWFjaChfaXRlbSA9PiBfaXRlbS52aXNpYmxlID0gdHJ1ZSk7XHJcblxyXG4gICAgICBpZiAoIShpdGVtLmRhdGEgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVPcHRpb25zOiBDT05URVhUTUVOVVtdID0gW0NPTlRFWFRNRU5VLkNSRUFURV9GT0xERVIsIENPTlRFWFRNRU5VLkNSRUFURV9HUkFQSCwgQ09OVEVYVE1FTlUuQ1JFQVRFX01FU0gsIENPTlRFWFRNRU5VLkNSRUFURV9NQVRFUklBTCwgQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVF07XHJcbiAgICAgICAgY3JlYXRlT3B0aW9ucy5mb3JFYWNoKF9pZCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoX2lkKSkudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS5kYXRhID09IHRoaXMucmVzb3VyY2VGb2xkZXIpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9SRVNPVVJDRSkpLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMuY29udGV4dE1lbnUucG9wdXAoKTtcclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXJDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcyB8fCBfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gW01JTUUuQVVESU8sIE1JTUUuSU1BR0UsIE1JTUUuTUVTSCwgTUlNRS5HTFRGXS5pbmNsdWRlcyhfc291cmNlLmdldE1pbWVUeXBlKCkpKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcENhcHR1cmUoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGlmIChfdmlld1NvdXJjZSA9PSB0aGlzIHx8IF9ldmVudC50YXJnZXQgPT0gdGhpcy50cmVlKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgIGZvciAoY29uc3Qgc291cmNlIG9mIF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpKSB7XHJcbiAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLk5vZGUpIHtcclxuICAgICAgICAgIHJlc291cmNlcy5wdXNoKGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKHNvdXJjZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuQVVESU86XHJcbiAgICAgICAgICAgIHJlc291cmNlcy5wdXNoKG5ldyDGki5BdWRpbyhzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBNSU1FLklNQUdFOlxyXG4gICAgICAgICAgICByZXNvdXJjZXMucHVzaChuZXcgxpIuVGV4dHVyZUltYWdlKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuTUVTSDpcclxuICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2goYXdhaXQgbmV3IMaSLk1lc2hPQkooKS5sb2FkKHNvdXJjZS5wYXRoUmVsYXRpdmUpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIE1JTUUuR0xURjpcclxuICAgICAgICAgICAgbGV0IGxvYWRlcjogxpIuR0xURkxvYWRlciA9IGF3YWl0IMaSLkdMVEZMb2FkZXIuTE9BRChzb3VyY2UucGF0aFJlbGF0aXZlKTtcclxuICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hpY2ggcmVzb3VyY2VzIHRvIGltcG9ydCBmcm9tICcke2xvYWRlci5uYW1lfSdgLCBcIkFkanVzdCBzZXR0aW5ncyBhbmQgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBpbiBWaWV3SW50ZXJuYWwuZ2x0ZkltcG9ydFNldHRpbmdzKSBpZiAoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5nc1t0eXBlXSlcclxuICAgICAgICAgICAgICByZXNvdXJjZXMucHVzaCguLi5hd2FpdCBsb2FkZXIubG9hZFJlc291cmNlczzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPijGklt0eXBlXSkpO1xyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHJlc291cmNlcztcclxuICAgICAgdGhpcy50cmVlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KMaSdWkuRVZFTlQuRFJPUCwgeyBidWJibGVzOiBmYWxzZSB9KSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKCFpbnB1dClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZE9wZW4gPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGknVpLlRyZWU8UmVzb3VyY2VFbnRyeT4obmV3IENvbnRyb2xsZXJUcmVlUmVzb3VyY2UoKSwgdGhpcy5yZXNvdXJjZUZvbGRlcik7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudHJlZSk7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCLil48gUmlnaHQgY2xpY2sgdG8gY3JlYXRlIG5ldyByZXNvdXJjZS5cXG7il48gU2VsZWN0IG9yIGRyYWcgcmVzb3VyY2UuXCI7XHJcbiAgICAgIHRoaXMudHJlZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyBEcmFnIHRvIFxcXCJQcm9wZXJ0aWVzXFxcIiBvciBcXFwiQ29tcG9uZW50c1xcXCIgdG8gdXNlIGlmIGFwcGxpY2FibGUuXCI7XHJcbiAgICAgIHRoaXMuaG5kQ3JlYXRlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy4jZXhwYW5kZWQpXHJcbiAgICAgICAgdGhpcy5leHBhbmQodGhpcy4jZXhwYW5kZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENyZWF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgLy8gYWRkIG5ldyByZXNvdXJjZXMgdG8gcm9vdCBmb2xkZXJcclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiDGki5Qcm9qZWN0LnJlc291cmNlcykge1xyXG4gICAgICAgIGxldCByZXNvdXJjZTogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UgPSDGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXTtcclxuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VGb2xkZXIuY29udGFpbnMocmVzb3VyY2UpKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKFtyZXNvdXJjZV0sIHRoaXMucmVzb3VyY2VGb2xkZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaG5kVXBkYXRlKCk7XHJcbiAgICAgIGxldCByb290SXRlbTogxpJ1aS5UcmVlSXRlbTxSZXNvdXJjZUVudHJ5PiA9IHRoaXMudHJlZS5maW5kVmlzaWJsZSh0aGlzLnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgaWYgKCFyb290SXRlbS5leHBhbmRlZClcclxuICAgICAgICByb290SXRlbS5leHBhbmQodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBmaWxlczogUmVzb3VyY2VGaWxlW10gPSBbXTsgLy8gY29sbGVjdCBmaWxlcyB0aGF0IGFyZSBubyBsb25nZXIgcmVnaXN0ZXJlZCBpbiB0aGUgcHJvamVjdFxyXG4gICAgICBmb3IgKGNvbnN0IGRlc2NlbmRhbnQgb2YgdGhpcy5yZXNvdXJjZUZvbGRlcikgXHJcbiAgICAgICAgaWYgKCEoZGVzY2VuZGFudCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSAmJiAhxpIuUHJvamVjdC5yZXNvdXJjZXNbZGVzY2VuZGFudC5pZFJlc291cmNlXSlcclxuICAgICAgICAgIGZpbGVzLnB1c2goZGVzY2VuZGFudCk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIC8vIHJlbW92ZSB0aGVtIFxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5yZW1vdmUoZmlsZSk7XHJcblxyXG4gICAgICB0aGlzLmhuZFVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFVwZGF0ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy50cmVlLnJlZnJlc2goKTtcclxuICAgICAgT2JqZWN0LnZhbHVlcyjGki5Qcm9qZWN0LnJlc291cmNlcylcclxuICAgICAgICAuZmlsdGVyKF9yZXNvdXJjZSA9PiAoPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlRXh0ZXJuYWw+X3Jlc291cmNlKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKVxyXG4gICAgICAgIC5tYXAoX3Jlc291cmNlID0+IHRoaXMuY29udHJvbGxlci5nZXRQYXRoKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgLmZvckVhY2goX3BhdGggPT4gdGhpcy50cmVlLnNob3coX3BhdGgpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQuZGV0YWlsPy5zZW5kZXIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLk1PRElGWSwge30pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTU9WRV9DSElMRDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuUkVOQU1FOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBleHBhbmQoX3BhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBjb25zdCBwYXRoczogUmVzb3VyY2VFbnRyeVtdW10gPSBfcGF0aHNcclxuICAgICAgICAubWFwKF9wYXRoID0+IF9wYXRoXHJcbiAgICAgICAgICAuc3BsaXQoXCIvXCIpXHJcbiAgICAgICAgICAuc2xpY2UoMSkgLy8gcmVtb3ZlIHJvb3QgYXMgaXQgaXMgYWRkZWQgYXMgZmlyc3QgZWxlbWVudCBpbiByZWR1Y2VcclxuICAgICAgICAgIC5yZWR1Y2U8UmVzb3VyY2VGb2xkZXJbXT4oKF9wYXRoLCBfaW5kZXgpID0+IFsuLi5fcGF0aCwgX3BhdGhbX3BhdGgubGVuZ3RoIC0gMV0/LmVudHJpZXM/LltfaW5kZXhdXSwgW3RoaXMucmVzb3VyY2VGb2xkZXJdKSlcclxuICAgICAgICAuZmlsdGVyKF9wYXRoID0+ICFfcGF0aC5zb21lKF9lbnRyeSA9PiAhX2VudHJ5KSk7IC8vIGZpbHRlciBvdXQgaW52YWxpZCBwYXRoc1xyXG4gICAgICB0aGlzLnRyZWUuZXhwYW5kKHBhdGhzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQ6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy50cmVlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBleHBhbmRlZC5wdXNoKHRoaXMuZ2V0UGF0aChpdGVtLmRhdGEpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZXhwYW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQYXRoKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuZ2V0UGF0aChfZW50cnkpLm1hcChfZW50cnkgPT4gX2VudHJ5LnJlc291cmNlUGFyZW50Py5lbnRyaWVzLmluZGV4T2YoX2VudHJ5KSkuam9pbihcIi9cIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vVmlldy9WaWV3LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0V4dGVybmFsLnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1Byb2plY3QvVmlld0ludGVybmFsRm9sZGVyLnRzXCIvPlxyXG5cclxubmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGludGVyZmFjZSBEcmFnRHJvcEZpbHRlciB7XHJcbiAgICBvbktleUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIG9uVHlwZUF0dHJpYnV0ZT86IHN0cmluZztcclxuICAgIGZyb21WaWV3cz86ICh0eXBlb2YgVmlldylbXTtcclxuICAgIG9uVHlwZT86IEZ1bmN0aW9uO1xyXG4gICAgb2ZUeXBlPzogRnVuY3Rpb247XHJcbiAgICBkcm9wRWZmZWN0OiBcImNvcHlcIiB8IFwibGlua1wiIHwgXCJtb3ZlXCIgfCBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGxldCBmaWx0ZXI6IHsgW25hbWU6IHN0cmluZ106IERyYWdEcm9wRmlsdGVyIH0gPSB7XHJcbiAgICBVcmxPblRleHR1cmU6IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJUZXh0dXJlSW1hZ2VcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uTWVzaE9CSjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hPQkpcIiwgb2ZUeXBlOiBEaXJlY3RvcnlFbnRyeSwgZHJvcEVmZmVjdDogXCJsaW5rXCIgfSxcclxuICAgIFVybE9uQXVkaW86IHsgZnJvbVZpZXdzOiBbVmlld0V4dGVybmFsXSwgb25LZXlBdHRyaWJ1dGU6IFwidXJsXCIsIG9uVHlwZUF0dHJpYnV0ZTogXCJBdWRpb1wiLCBvZlR5cGU6IERpcmVjdG9yeUVudHJ5LCBkcm9wRWZmZWN0OiBcImxpbmtcIiB9LFxyXG4gICAgVXJsT25NZXNoR0xURjogeyBmcm9tVmlld3M6IFtWaWV3RXh0ZXJuYWxdLCBvbktleUF0dHJpYnV0ZTogXCJ1cmxcIiwgb25UeXBlQXR0cmlidXRlOiBcIk1lc2hHTFRGXCIsIG9mVHlwZTogRGlyZWN0b3J5RW50cnksIGRyb3BFZmZlY3Q6IFwibGlua1wiIH1cclxuICB9O1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlckRldGFpbCBleHRlbmRzIMaSVWkuQ29udHJvbGxlciB7XHJcbiAgICAjdmlldzogVmlldztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX211dGFibGU6IMaSLk11dGFibGUsIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX3ZpZXc6IFZpZXcpIHtcclxuICAgICAgc3VwZXIoX211dGFibGUsIF9kb21FbGVtZW50KTtcclxuICAgICAgdGhpcy4jdmlldyA9IF92aWV3O1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5zZXJ0ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgQ29udHJvbGxlckRldGFpbFwiKTtcclxuICAgICAgY29uc29sZS5sb2coX2V2ZW50LmRldGFpbCk7XHJcbiAgICAgIGxldCBtdXRhYmxlOiDGki5NdXRhYmxlID0gdGhpcy5tdXRhYmxlW19ldmVudC5kZXRhaWwuZ2V0QXR0cmlidXRlKFwia2V5XCIpXTtcclxuICAgICAgY29uc29sZS5sb2cobXV0YWJsZS50eXBlKTtcclxuICAgICAgaWYgKG11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgbXV0YWJsZS5wdXNoKG5ldyBtdXRhYmxlLnR5cGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KMaSVWkuRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHVybCBvbiB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgY2hlY2tNaW1lVHlwZShNSU1FLklNQUdFKSkpIHJldHVybjtcclxuICAgICAgLy8gdXJsIG9uIG1lc2hvYmpcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoT0JKLCBjaGVja01pbWVUeXBlKE1JTUUuTUVTSCkpKSByZXR1cm47XHJcbiAgICAgIC8vIHVybCBvbiBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBjaGVja01pbWVUeXBlKE1JTUUuQVVESU8pKSkgcmV0dXJuO1xyXG4gICAgICAvLyB1cmwgb24gbWVzaGdsdGZcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyRHJhZ0Ryb3AoX2V2ZW50LCBmaWx0ZXIuVXJsT25NZXNoR0xURiwgY2hlY2tNaW1lVHlwZShNSU1FLkdMVEYpKSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHsgbXV0YWJsZSwga2V5IH0gPSB0aGlzLmdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50KTtcclxuICAgICAgbGV0IG1ldGFUeXBlczogxpIuTWV0YUF0dHJpYnV0ZVR5cGVzID0gKDzGki5NdXRhYmxlPm11dGFibGUpLmdldE1ldGFBdHRyaWJ1dGVUeXBlcz8uKCkgPz8ge307XHJcbiAgICAgIGxldCBtZXRhVHlwZTogRnVuY3Rpb24gPSBtZXRhVHlwZXNba2V5XTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBpZiAoIW1ldGFUeXBlIHx8IChtZXRhVHlwZSAmJiB0eXBlb2YgbWV0YVR5cGUgPT0gXCJmdW5jdGlvblwiICYmICEoc291cmNlc1swXSBpbnN0YW5jZW9mIG1ldGFUeXBlKSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja01pbWVUeXBlKF9taW1lOiBNSU1FKTogKF9zb3VyY2VzOiBPYmplY3RbXSkgPT4gYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIChfc291cmNlczogT2JqZWN0W10pOiBib29sZWFuID0+IHtcclxuICAgICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgICByZXR1cm4gKHNvdXJjZXMubGVuZ3RoID09IDEgJiYgc291cmNlc1swXS5nZXRNaW1lVHlwZSgpID09IF9taW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc2V0RXh0ZXJuYWxMaW5rOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKF9zb3VyY2VzOiBPYmplY3RbXSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiBEaXJlY3RvcnlFbnRyeVtdID0gPERpcmVjdG9yeUVudHJ5W10+X3NvdXJjZXM7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLnZhbHVlID0gc291cmNlc1swXS5wYXRoUmVsYXRpdmU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGVPbklucHV0KF9ldmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uVGV4dHVyZSwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyB0ZXh0dXJlXHJcbiAgICAgIGlmICh0aGlzLmZpbHRlckRyYWdEcm9wKF9ldmVudCwgZmlsdGVyLlVybE9uTWVzaE9CSiwgc2V0RXh0ZXJuYWxMaW5rKSkgcmV0dXJuO1xyXG4gICAgICAvLyBhdWRpb1xyXG4gICAgICBpZiAodGhpcy5maWx0ZXJEcmFnRHJvcChfZXZlbnQsIGZpbHRlci5VcmxPbkF1ZGlvLCBzZXRFeHRlcm5hbExpbmspKSByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgbGV0IHsgbXV0YWJsZSwga2V5IH0gPSB0aGlzLmdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50KTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IFZpZXcuZ2V0Vmlld1NvdXJjZShfZXZlbnQpLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICBtdXRhYmxlW2tleV0gPSBzb3VyY2VzWzBdO1xyXG5cclxuICAgICAgdGhpcy4jdmlldy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGZpbHRlckRyYWdEcm9wKF9ldmVudDogRHJhZ0V2ZW50LCBfZmlsdGVyOiBEcmFnRHJvcEZpbHRlciwgX2NhbGxiYWNrOiAoX3NvdXJjZXM6IE9iamVjdFtdKSA9PiBib29sZWFuID0gKCkgPT4gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgdHlwZUVsZW1lbnQ6IHN0cmluZyA9IHRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IHR5cGVDb21wb25lbnQ6IHN0cmluZyA9IHRoaXMuZ2V0QW5jZXN0b3JXaXRoVHlwZSh0YXJnZXQpLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcblxyXG4gICAgICBpZiAoX2ZpbHRlci5vbktleUF0dHJpYnV0ZSAmJiB0eXBlRWxlbWVudCAhPSBfZmlsdGVyLm9uS2V5QXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZUF0dHJpYnV0ZSAmJiB0eXBlQ29tcG9uZW50ICE9IF9maWx0ZXIub25UeXBlQXR0cmlidXRlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmIChfZmlsdGVyLm9uVHlwZSAmJiAhKHRoaXMubXV0YWJsZSBpbnN0YW5jZW9mIF9maWx0ZXIub25UeXBlKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHZpZXdTb3VyY2U6IFZpZXcgPSBWaWV3LmdldFZpZXdTb3VyY2UoX2V2ZW50KTtcclxuXHJcbiAgICAgIGlmICghX2ZpbHRlci5mcm9tVmlld3M/LmZpbmQoKF92aWV3KSA9PiB2aWV3U291cmNlIGluc3RhbmNlb2YgX3ZpZXcpKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBzb3VyY2VzOiBPYmplY3RbXSA9IHZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCk7XHJcbiAgICAgIGlmICghKHNvdXJjZXNbMF0gaW5zdGFuY2VvZiBfZmlsdGVyLm9mVHlwZSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgaWYgKCFfY2FsbGJhY2soc291cmNlcykpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEFuY2VzdG9yV2l0aFR5cGUoX3RhcmdldDogRXZlbnRUYXJnZXQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fdGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgaWYgKHR5cGUpXHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRhcmdldE11dGFibGVBbmRLZXkoX2V2ZW50OiBFdmVudCk6IHsgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjsga2V5OiBzdHJpbmcgfSB7XHJcbiAgICAgIGxldCBwYXRoOiDGki5HZW5lcmFsW10gPSBfZXZlbnQuY29tcG9zZWRQYXRoKCk7XHJcbiAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIHBhdGguaW5kZXhPZih0aGlzLmRvbUVsZW1lbnQpKTtcclxuICAgICAgcGF0aCA9IHBhdGguZmlsdGVyKF9lbGVtZW50ID0+IF9lbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgKF9lbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikpKTtcclxuICAgICAgcGF0aC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICBsZXQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IHRoaXMubXV0YWJsZTtcclxuICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gcGF0aC5tYXAoX2VsZW1lbnQgPT4gX2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGtleXMubGVuZ3RoIC0gMTsgaSsrKVxyXG4gICAgICAgIG11dGFibGUgPSBtdXRhYmxlW2tleXNbaV1dO1xyXG5cclxuICAgICAgcmV0dXJuIHsgbXV0YWJsZSwga2V5OiBrZXlzW2tleXMubGVuZ3RoIC0gMV0gfTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUYWJsZVJlc291cmNlIGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYWQ6IMaSdWkuVEFCTEVbXSA9IENvbnRyb2xsZXJUYWJsZVJlc291cmNlLmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IHRydWUgfSk7XHJcbiAgICAgIGhlYWQucHVzaCh7IGxhYmVsOiBcIlR5cGVcIiwga2V5OiBcInR5cGVcIiwgc29ydGFibGU6IHRydWUsIGVkaXRhYmxlOiBmYWxzZSB9KTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiSWRcIiwga2V5OiBcImlkUmVzb3VyY2VcIiwgc29ydGFibGU6IGZhbHNlLCBlZGl0YWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIHJldHVybiBoZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyVGFibGVSZXNvdXJjZS5oZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbChfb2JqZWN0OiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyByZW5hbWUoX29iamVjdDogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNrIHJlbmFtZVwiLCBfb2JqZWN0Lm5hbWUsIF9uZXcpO1xyXG4gICAgICBsZXQgcmVuYW1lOiBib29sZWFuID0gX29iamVjdC5uYW1lICE9IF9uZXc7XHJcbiAgICAgIGlmIChyZW5hbWUpIHtcclxuICAgICAgICBfb2JqZWN0Lm5hbWUgPSBfbmV3OyAvLyBtdXN0IHJlbmFtZSBiZWZvcmUgbG9hZGluZywgVE9ETzogV0hZIGlzIGl0IHRoYXQgdGhlIHJlbmFtaW5nIGlzIHN1cHBvc2VkIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGFjdHVhbCB0YWJsZT8/P1xyXG4gICAgICAgIGF3YWl0ICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD5fb2JqZWN0KS5sb2FkPy4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weShfb3JpZ2luYWxzOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10+IHtcclxuICAgICAgY29uc29sZS5sb2coX2ZvY3Vzc2VkLCB0aGlzLnNlbGVjdGlvbik7XHJcbiAgICAgIC8vIHRoaXMuc2VsZWN0aW9uID0gW107XHJcbiAgICAgIGxldCBleHBlbmRhYmxlczogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2VbXSA9IHRoaXMuc2VsZWN0aW9uLmNvbmNhdChbXSk7IC8vX2ZvY3Vzc2VkKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBmb3IgKGxldCBpZFJlc291cmNlIGluIHNlcmlhbGl6YXRpb25zKVxyXG4gICAgICAgIHNlcmlhbGl6YXRpb25TdHJpbmdzLnNldCjGki5Qcm9qZWN0LnJlc291cmNlc1tpZFJlc291cmNlXSwgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphdGlvbnNbaWRSZXNvdXJjZV0pKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgZXhwZW5kYWJsZXMpIHtcclxuICAgICAgICB1c2FnZXNbZXhwZW5kYWJsZS5pZFJlc291cmNlXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJlc291cmNlIG9mIHNlcmlhbGl6YXRpb25TdHJpbmdzLmtleXMoKSlcclxuICAgICAgICAgIGlmIChyZXNvdXJjZS5pZFJlc291cmNlICE9IGV4cGVuZGFibGUuaWRSZXNvdXJjZSlcclxuICAgICAgICAgICAgaWYgKHNlcmlhbGl6YXRpb25TdHJpbmdzLmdldChyZXNvdXJjZSkuaW5kZXhPZihleHBlbmRhYmxlLmlkUmVzb3VyY2UpID4gLTEpXHJcbiAgICAgICAgICAgICAgdXNhZ2VzW2V4cGVuZGFibGUuaWRSZXNvdXJjZV0ucHVzaChyZXNvdXJjZS5uYW1lICsgXCIgXCIgKyByZXNvdXJjZS50eXBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGF3YWl0IG9wZW5EaWFsb2coKSkge1xyXG4gICAgICAgIGxldCBkZWxldGVkOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgdXNhZ2UgaW4gdXNhZ2VzKVxyXG4gICAgICAgICAgaWYgKHVzYWdlc1t1c2FnZV0ubGVuZ3RoID09IDApIHsgLy8gZGVsZXRlIG9ubHkgdW51c2VkXHJcbiAgICAgICAgICAgIGRlbGV0ZWQucHVzaCjGki5Qcm9qZWN0LnJlc291cmNlc1t1c2FnZV0pO1xyXG4gICAgICAgICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIoxpIuUHJvamVjdC5yZXNvdXJjZXNbdXNhZ2VdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXN5bmMgZnVuY3Rpb24gb3BlbkRpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxib29sZWFuPiA9IMaSdWkuRGlhbG9nLnByb21wdCh1c2FnZXMsIHRydWUsIFwiUmV2aWV3IHJlZmVyZW5jZXMsIGRlbGV0ZSBkZXBlbmRlbmQgcmVzb3VyY2VzIGZpcnN0IGlmIGFwcGxpY2FibGVcIiwgXCJUbyBkZWxldGUgdW51c2VkIHJlc291cmNlcywgcHJlc3MgT0tcIiwgXCJPS1wiLCBcIkNhbmNlbFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGF3YWl0IHByb21pc2UpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHNvcnQoX2RhdGE6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlLCBfYjogxpIuU2VyaWFsaXphYmxlUmVzb3VyY2UpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBfZGlyZWN0aW9uICogKF9hW19rZXldID09IF9iW19rZXldID8gMCA6IChfYVtfa2V5XSA+IF9iW19rZXldID8gMSA6IC0xKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9kYXRhLnNvcnQoY29tcGFyZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFNjcmlwdEluZm8ge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBuYW1lc3BhY2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdXBlckNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2NyaXB0OiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBpc0NvbXBvbmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ29tcG9uZW50U2NyaXB0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9zY3JpcHQ6IEZ1bmN0aW9uLCBfbmFtZXNwYWNlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5zY3JpcHQgPSBfc2NyaXB0O1xyXG4gICAgICB0aGlzLm5hbWUgPSBfc2NyaXB0Lm5hbWU7XHJcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gX25hbWVzcGFjZTtcclxuICAgICAgbGV0IGNoYWluOiBGdW5jdGlvbiA9IF9zY3JpcHRbXCJfX3Byb3RvX19cIl07XHJcbiAgICAgIHRoaXMuc3VwZXJDbGFzcyA9IGNoYWluLm5hbWU7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50ID0gdGhpcy5pc0NvbXBvbmVudCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFwiKTtcclxuICAgICAgICB0aGlzLmlzQ29tcG9uZW50U2NyaXB0ID0gdGhpcy5pc0NvbXBvbmVudFNjcmlwdCB8fCAoY2hhaW4ubmFtZSA9PSBcIkNvbXBvbmVudFNjcmlwdFwiKTtcclxuICAgICAgICBjaGFpbiA9IGNoYWluW1wiX19wcm90b19fXCJdO1xyXG4gICAgICB9IHdoaWxlIChjaGFpbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRhYmxlU2NyaXB0IGV4dGVuZHMgxpJ1aS5UYWJsZUNvbnRyb2xsZXI8U2NyaXB0SW5mbz4ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhZDogxpJ1aS5UQUJMRVtdID0gQ29udHJvbGxlclRhYmxlU2NyaXB0LmdldEhlYWQoKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRIZWFkKCk6IMaSdWkuVEFCTEVbXSB7XHJcbiAgICAgIGxldCBoZWFkOiDGknVpLlRBQkxFW10gPSBbXTtcclxuICAgICAgaGVhZC5wdXNoKHsgbGFiZWw6IFwiTmFtZVwiLCBrZXk6IFwibmFtZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJTdXBlclwiLCBrZXk6IFwic3VwZXJDbGFzc1wiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICBoZWFkLnB1c2goeyBsYWJlbDogXCJOYW1lc3BhY2VcIiwga2V5OiBcIm5hbWVzcGFjZVwiLCBzb3J0YWJsZTogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH0pO1xyXG4gICAgICByZXR1cm4gaGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVhZCgpOiDGknVpLlRBQkxFW10ge1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlclRhYmxlU2NyaXB0LmhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExhYmVsKF9vYmplY3Q6IFNjcmlwdEluZm8pOiBzdHJpbmcgeyByZXR1cm4gXCJcIjsgfVxyXG4gICAgcHVibGljIGFzeW5jIHJlbmFtZShfb2JqZWN0OiBTY3JpcHRJbmZvLCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZGVsZXRlKF9mb2N1c3NlZDogU2NyaXB0SW5mb1tdKTogUHJvbWlzZTxTY3JpcHRJbmZvW10+IHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHB1YmxpYyBjb3B5KF9vcmlnaW5hbHM6IFNjcmlwdEluZm9bXSk6IFByb21pc2U8U2NyaXB0SW5mb1tdPiB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzb3J0KF9kYXRhOiBTY3JpcHRJbmZvW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoX2E6IFNjcmlwdEluZm8sIF9iOiBTY3JpcHRJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gX2RpcmVjdGlvbiAqIChfYVtfa2V5XSA9PSBfYltfa2V5XSA/IDAgOiAoX2FbX2tleV0gPiBfYltfa2V5XSA/IDEgOiAtMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZGF0YS5zb3J0KGNvbXBhcmUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcblxyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlRGlyZWN0b3J5IGV4dGVuZHMgxpJVaS5UcmVlQ29udHJvbGxlcjxEaXJlY3RvcnlFbnRyeT4ge1xyXG5cclxuICAgIHB1YmxpYyBzb3J0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9lbnRyeTogRGlyZWN0b3J5RW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfZW50cnkubmFtZTtcclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZXRWYWx1ZShfZW50cnk6IERpcmVjdG9yeUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgX2VudHJ5Lm5hbWUgPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcud2FybihgQ291bGQgbm90IHJlbmFtZSBmaWxlICcke19lbnRyeS5uYW1lfScgdG8gJyR7X2VsZW1lbnQudmFsdWV9Jy5gLCBfZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX29iamVjdDogRGlyZWN0b3J5RW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5LmlzRGlyZWN0b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogRGlyZWN0b3J5RW50cnlbXSB7XHJcbiAgICAgIHJldHVybiBfZW50cnkuZ2V0RGlyZWN0b3J5Q29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbHMoX2E6IERpcmVjdG9yeUVudHJ5LCBfYjogRGlyZWN0b3J5RW50cnkpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hLnBhdGhSZWxhdGl2ZSA9PSBfYi5wYXRoUmVsYXRpdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZm9jdXNzZWQ6IERpcmVjdG9yeUVudHJ5W10pOiBQcm9taXNlPERpcmVjdG9yeUVudHJ5W10+IHtcclxuICAgICAgLy8gZGVsZXRlIHNlbGVjdGlvbiBpbmRlcGVuZGVuZCBvZiBmb2N1c3NlZCBpdGVtXHJcbiAgICAgIGxldCBkZWxldGVkOiBEaXJlY3RvcnlFbnRyeVtdID0gW107XHJcbiAgICAgIGxldCBleHBlbmQ6IERpcmVjdG9yeUVudHJ5W10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNzZWQ7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHRoaXMuc2VsZWN0aW9uIHx8IGV4cGVuZCkge1xyXG4gICAgICAgIGVudHJ5LmRlbGV0ZSgpO1xyXG4gICAgICAgIGRlbGV0ZWQucHVzaChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2FuQWRkQ2hpbGRyZW4oX3NvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10sIF90YXJnZXQ6IERpcmVjdG9yeUVudHJ5KTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfdGFyZ2V0LmlzRGlyZWN0b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfZW50cmllczogRGlyZWN0b3J5RW50cnlbXSwgX3RhcmdldDogRGlyZWN0b3J5RW50cnkpOiBEaXJlY3RvcnlFbnRyeVtdIHtcclxuICAgICAgbGV0IG1vdmU6IERpcmVjdG9yeUVudHJ5W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2VudHJpZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgX3RhcmdldC5hZGRFbnRyeShlbnRyeSk7XHJcbiAgICAgICAgICBlbnRyeS5kZWxldGUoKTtcclxuICAgICAgICAgIG1vdmUucHVzaChlbnRyeSk7XHJcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy53YXJuKGBDb3VsZCBub3QgYWRkIGZpbGUgJyR7ZW50cnkubmFtZX0nIHRvICcke190YXJnZXQubmFtZX0nLmAsIF9lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IERpcmVjdG9yeUVudHJ5W10pOiBQcm9taXNlPERpcmVjdG9yeUVudHJ5W10+IHtcclxuICAgICAgLy8gY29waWVzIGNhbiBub3QgYmUgY3JlYXRlZCBhdCB0aGlzIHBvaW50LCBidXQgd2hlbiBjb3B5aW5nIHRoZSBmaWxlcy4gU2VlIGFkZENoaWxkcmVuXHJcbiAgICAgIHJldHVybiBfb3JpZ2luYWxzO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlclRyZWVIaWVyYXJjaHkgZXh0ZW5kcyDGklVpLlRyZWVDb250cm9sbGVyPMaSLk5vZGU+IHtcclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfb2JqZWN0OiDGki5Ob2RlKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gX29iamVjdC5uYW1lO1xyXG4gICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHJpYnV0ZXMoX25vZGU6IMaSLk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgYXR0cmlidXRlczogc3RyaW5nW10gPSBbX25vZGUuaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiXTtcclxuICAgICAgaWYgKF9ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSlcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goXCJHcmFwaEluc3RhbmNlXCIpO1xyXG4gICAgICByZXR1cm4gYXR0cmlidXRlcy5qb2luKFwiIFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX25vZGU6IMaSLk5vZGUsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IHJlbmFtZTogYm9vbGVhbiA9IF9ub2RlLm5hbWUgIT0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgIGlmIChyZW5hbWUpIHtcclxuICAgICAgICBfbm9kZS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgYXdhaXQgKDzGki5HcmFwaEdMVEY+X25vZGUpLmxvYWQ/LigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbihfbm9kZTogxpIuTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX25vZGUuZ2V0Q2hpbGRyZW4oKS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbihfbm9kZTogxpIuTm9kZSk6IMaSLk5vZGVbXSB7XHJcbiAgICAgIHJldHVybiBfbm9kZS5nZXRDaGlsZHJlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiDGki5Ob2RlW10pOiBQcm9taXNlPMaSLk5vZGVbXT4ge1xyXG4gICAgICAvLyBkZWxldGUgc2VsZWN0aW9uIGluZGVwZW5kZW5kIG9mIGZvY3Vzc2VkIGl0ZW1cclxuICAgICAgbGV0IGRlbGV0ZWQ6IMaSLk5vZGVbXSA9IFtdO1xyXG4gICAgICBsZXQgZXhwZW5kOiDGki5Ob2RlW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNzZWQ7XHJcbiAgICAgIGZvciAobGV0IG5vZGUgb2YgZXhwZW5kKVxyXG4gICAgICAgIGlmIChub2RlLmdldFBhcmVudCgpKSB7XHJcbiAgICAgICAgICBub2RlLmdldFBhcmVudCgpLnJlbW92ZUNoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2NoaWxkcmVuOiDGki5Ob2RlW10sIF90YXJnZXQ6IMaSLk5vZGUsIF9pbmRleD86IG51bWJlcik6IMaSLk5vZGVbXSB7XHJcbiAgICAgIC8vIGRpc2FsbG93IGRyb3AgZm9yIHNvdXJjZXMgYmVpbmcgYW5jZXN0b3IgdG8gdGFyZ2V0XHJcbiAgICAgIGxldCBtb3ZlOiDGki5Ob2RlW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgX2NoaWxkcmVuKVxyXG4gICAgICAgIGlmICghX3RhcmdldC5pc0Rlc2NlbmRhbnRPZihjaGlsZCkpXHJcbiAgICAgICAgICBtb3ZlLnB1c2goY2hpbGQpO1xyXG5cclxuICAgICAgbW92ZS5mb3JFYWNoKChfbm9kZSwgX2lNb3ZlKSA9PiBfdGFyZ2V0LmFkZENoaWxkKF9ub2RlLCBfaW5kZXggPT0gdW5kZWZpbmVkID8gX2luZGV4IDogX2luZGV4ICsgX2lNb3ZlKSk7XHJcbiAgICAgIC8vIGZvciAobGV0IG5vZGUgb2YgbW92ZSlcclxuICAgICAgLy8gICBfdGFyZ2V0LmFkZENoaWxkKG5vZGUsIF9pVGFyZ2V0KTtcclxuXHJcbiAgICAgIHJldHVybiBtb3ZlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBjb3B5KF9vcmlnaW5hbHM6IMaSLk5vZGVbXSk6IFByb21pc2U8xpIuTm9kZVtdPiB7XHJcbiAgICAgIC8vIHRyeSB0byBjcmVhdGUgY29waWVzIGFuZCByZXR1cm4gdGhlbSBmb3IgcGFzdGUgb3BlcmF0aW9uXHJcbiAgICAgIGxldCBjb3BpZXM6IMaSLk5vZGVbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBvcmlnaW5hbCBvZiBfb3JpZ2luYWxzKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24gPSDGki5TZXJpYWxpemVyLnNlcmlhbGl6ZShvcmlnaW5hbCk7XHJcbiAgICAgICAgbGV0IGNvcHk6IMaSLk5vZGUgPSA8xpIuTm9kZT5hd2FpdCDGki5TZXJpYWxpemVyLmRlc2VyaWFsaXplKHNlcmlhbGl6YXRpb24pO1xyXG4gICAgICAgIGNvcGllcy5wdXNoKGNvcHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb3BpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiDGki5Ob2RlW10sIF90YXJnZXQ6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKF9zb3VyY2VzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBfc291cmNlcy5ldmVyeShfc291cmNlID0+IGNoZWNrR3JhcGhEcm9wKF9zb3VyY2UsIF90YXJnZXQpKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrR3JhcGhEcm9wKF9zb3VyY2U6IMaSLk5vZGUsIF90YXJnZXQ6IMaSLk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgaWRTb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IG5vZGUgb2YgX3NvdXJjZS5nZXRJdGVyYXRvcigpKVxyXG4gICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaEluc3RhbmNlKVxyXG4gICAgICAgICAgICBpZFNvdXJjZXMucHVzaChub2RlLmlkU291cmNlKTtcclxuICAgICAgICAgIGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgICAgaWRTb3VyY2VzLnB1c2gobm9kZS5pZFJlc291cmNlKTtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgaWYgKF90YXJnZXQgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgICAgaWYgKGlkU291cmNlcy5pbmRleE9mKF90YXJnZXQuaWRSZXNvdXJjZSkgPiAtMSlcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoX3RhcmdldCBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpXHJcbiAgICAgICAgICAgIGlmIChpZFNvdXJjZXMuaW5kZXhPZihfdGFyZ2V0LmlkU291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICBfdGFyZ2V0ID0gX3RhcmdldC5nZXRQYXJlbnQoKTtcclxuICAgICAgICB9IHdoaWxlIChfdGFyZ2V0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgY29uc3QgZW51bSBJRCB7XHJcbiAgICBOQU1FID0gXCJuYW1lXCIsXHJcbiAgICBGVU5DVElPTiA9IFwiZnVuY3Rpb25cIixcclxuICAgIFZBTFVFID0gXCJ2YWx1ZVwiLFxyXG4gICAgVFJBTlNGT1JNQVRJT04gPSBcInRyYW5zZm9ybWF0aW9uXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyVHJlZVBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgxpJ1aS5UcmVlQ29udHJvbGxlcjzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPiB7XHJcbiAgICBwdWJsaWMgY2hpbGRUb1BhcmVudDogTWFwPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmU+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3UGFydGljbGVTeXN0ZW07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtLCBfdmlldzogVmlld1BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLnZpZXcgPSBfdmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29udGVudChfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBsZXQgcGFyZW50RGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIcaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpICYmICHGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBsZXQgc3Bhbk5hbWU6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5OYW1lLmlubmVyVGV4dCA9IHBhcmVudERhdGEgPyBrZXkgOiDGki5QYXJ0aWNsZVN5c3RlbS5uYW1lO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbk5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyZW50RGF0YSAmJiBwYXJlbnREYXRhID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIC8vIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzW2tleV07XHJcbiAgICAgICAgaW5wdXQuaWQgPSBJRC5OQU1FO1xyXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpIHtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgICBzZWxlY3QuaWQgPSBJRC5GVU5DVElPTjtcclxuICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgT2JqZWN0LnZhbHVlcyjGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04pKSB7XHJcbiAgICAgICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBlbnRyeS50ZXh0ID0gbmFtZTtcclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IF9kYXRhLmZ1bmN0aW9uO1xyXG4gICAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgICAvLyBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpbnB1dC5pZCA9IElELlZBTFVFO1xyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvZGUoX2RhdGEpKSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEuY29kZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gX2RhdGEudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibGlzdFwiLCBcInZhcmlhYmxlc1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIH0gZWxzZSBpZiAoxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICAgIHNlbGVjdC5pZCA9IElELlRSQU5TRk9STUFUSU9OO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBbxpIuTWF0cml4NHg0LnByb3RvdHlwZS50cmFuc2xhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5yb3RhdGUubmFtZSwgxpIuTWF0cml4NHg0LnByb3RvdHlwZS5zY2FsZS5uYW1lXSkge1xyXG4gICAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgICAgZW50cnkudmFsdWUgPSBrZXk7XHJcbiAgICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gX2RhdGEudHJhbnNmb3JtYXRpb247XHJcbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cmlidXRlcyhfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBhdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzVmFyaWFibGUoX2RhdGEpIHx8IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpID09IHRoaXMuZGF0YS52YXJpYWJsZXMpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInZhcmlhYmxlXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKVxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChfZGF0YS5mdW5jdGlvbik7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEuY29sb3IpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29sb3JcIik7XHJcbiAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIFxyXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChcInRyYW5zZm9ybWF0aW9uXCIpO1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29kZShfZGF0YSkpXHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKFwiY29kZVwiKTtcclxuXHJcbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgbGV0IGlucHV0QXNOdW1iZXI6IG51bWJlciA9IE51bWJlci5wYXJzZUZsb2F0KF9lbGVtZW50LnZhbHVlKTtcclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5OQU1FICYmIMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oX2RhdGEpKSB7XHJcbiAgICAgICAgbGV0IGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoX2VsZW1lbnQudmFsdWUpKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgICAgIGlmICjGki5QYXJ0aWNsZURhdGEuUFJFREVGSU5FRF9WQVJJQUJMRVNbX2VsZW1lbnQudmFsdWVdKVxyXG4gICAgICAgICAgZXJyb3JzLnB1c2goYHZhcmlhYmxlIFwiJHtfZWxlbWVudH1cIiBpcyBhIHByZWRlZmluZWQgdmFyaWFibGUgYW5kIGNhbiBub3QgYmUgcmVkZWNsYXJlZC4gUHJlZGVmaW5lZCB2YXJpYWJsZXM6IFske09iamVjdC5rZXlzKMaSLlBhcnRpY2xlRGF0YS5QUkVERUZJTkVEX1ZBUklBQkxFUykuam9pbihcIiwgXCIpfV1gKTtcclxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIMaSdWkuV2FybmluZy5kaXNwbGF5KGVycm9ycywgXCJVbmFibGUgdG8gcmVuYW1lXCIsIFwiUGxlYXNlIHJlc29sdmUgdGhlIGVycm9ycyBhbmQgdHJ5IGFnYWluXCIgKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmRhdGEudmFyaWFibGVzLmluZGV4T2YoX2RhdGEpO1xyXG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lc1tpbmRleF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXNbaW5kZXhdID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShuYW1lLCBfZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5GVU5DVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNGdW5jdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS5mdW5jdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT04+X2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZWxlbWVudC5pZCA9PSBJRC5UUkFOU0ZPUk1BVElPTiAmJiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpIHtcclxuICAgICAgICBfZGF0YS50cmFuc2Zvcm1hdGlvbiA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXCJ0cmFuc2Zvcm1hdGlvblwiXT5fZWxlbWVudC52YWx1ZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkgfHwgxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpKSkge1xyXG4gICAgICAgIGxldCBpbnB1dDogc3RyaW5nIHwgbnVtYmVyID0gTnVtYmVyLmlzTmFOKGlucHV0QXNOdW1iZXIpID8gX2VsZW1lbnQudmFsdWUgOiBpbnB1dEFzTnVtYmVyO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIiAmJiAhxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTW2lucHV0XSAmJiB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyAmJiAhdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuaW5jbHVkZXMoaW5wdXQpKSBcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBfZGF0YS52YWx1ZSA9IGlucHV0O1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9lbGVtZW50LmlkID09IElELlZBTFVFICYmICjGki5QYXJ0aWNsZURhdGEuaXNDb2RlKF9kYXRhKSkpIHtcclxuICAgICAgICBfZGF0YS5jb2RlID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiBib29sZWFuIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0NvbnN0YW50KF9kYXRhKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNWYXJpYWJsZShfZGF0YSkpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZHJlbihfZGF0YSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzQ29uc3RhbnQoX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgY2hpbGRyZW46IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXSA9IFtdO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0gxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF9kYXRhKSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YTtcclxuICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAga2V5cyA9IFZpZXdQYXJ0aWNsZVN5c3RlbS5QUk9QRVJUWV9LRVlTLmZpbHRlcihfa2V5ID0+IGtleXMuaW5jbHVkZXMoX2tleSkpO1xyXG5cclxuICAgICAga2V5cy5mb3JFYWNoKF9rZXkgPT4ge1xyXG4gICAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IGRhdGFbX2tleV07XHJcbiAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0V4cHJlc3Npb24oY2hpbGQpIHx8IHR5cGVvZiBjaGlsZCA9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YVtfa2V5XSwgX2RhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIHJldHVybiBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c2VkOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSk6IFByb21pc2U8xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdPiB7XHJcbiAgICAgIC8vIGRlbGV0ZSBzZWxlY3Rpb24gaW5kZXBlbmRlbmQgb2YgZm9jdXNzZWQgaXRlbVxyXG4gICAgICBsZXQgZGVsZXRlZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSBbXTtcclxuICAgICAgbGV0IGV4cGVuZDogKMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUpW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3Rpb24gOiBfZm9jdXNlZDtcclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBleHBlbmQpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWxldGVEYXRhKGRhdGEpKVxyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdLCBfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlLCBfYXQ/OiBudW1iZXIpOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10ge1xyXG4gICAgICBsZXQgbW92ZTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZVtdID0gW107XHJcbiAgICAgIGxldCBjb250YWluZXI6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXTtcclxuXHJcbiAgICAgIGlmICgoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX3RhcmdldCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24oX3RhcmdldCkpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF9kYXRhKSkpXHJcbiAgICAgICAgY29udGFpbmVyID0gX3RhcmdldC5wYXJhbWV0ZXJzO1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4TG9jYWwgfHwgX3RhcmdldCA9PSB0aGlzLmRhdGEubXR4V29ybGQpICYmIF9jaGlsZHJlbi5ldmVyeShfZGF0YSA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuVHJhbnNmb3JtYXRpb25bXT5fdGFyZ2V0O1xyXG4gICAgICBlbHNlIGlmICgoX3RhcmdldCA9PSB0aGlzLmRhdGEudmFyaWFibGVzIHx8IF90YXJnZXQgPT0gdGhpcy5kYXRhLmNvbG9yKSAmJiBfY2hpbGRyZW4uZXZlcnkoX2RhdGEgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfZGF0YSkpKVxyXG4gICAgICAgIGNvbnRhaW5lciA9IDzGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbltdPl90YXJnZXQ7XHJcblxyXG4gICAgICBpZiAoIWNvbnRhaW5lcikgXHJcbiAgICAgICAgcmV0dXJuIG1vdmU7XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250YWluZXIpKVxyXG4gICAgICAgIGZvciAobGV0IGRhdGEgb2YgX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGNvbnRhaW5lci5pbmRleE9mKGRhdGEpOyAvLyBfYXQgbmVlZHMgdG8gYmUgY29ycmVjdGVkIGlmIHdlIGFyZSBtb3Zpbmcgd2l0aGluIHNhbWUgcGFyZW50XHJcbiAgICAgICAgICBsZXQgaGFzUGFyZW50OiBib29sZWFuID0gdGhpcy5jaGlsZFRvUGFyZW50LmhhcyhkYXRhKTtcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSB0aGlzLmRhdGEudmFyaWFibGVOYW1lcz8uW2luZGV4XTtcclxuXHJcbiAgICAgICAgICBpZiAoaGFzUGFyZW50ICYmICF0aGlzLmRlbGV0ZURhdGEoZGF0YSkpIFxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICBpZiAoIWhhc1BhcmVudClcclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cclxuICAgICAgICAgIG1vdmUucHVzaChkYXRhKTtcclxuICAgICAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5zZXQoZGF0YSwgX3RhcmdldCk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSAmJiBfYXQgPiBpbmRleClcclxuICAgICAgICAgICAgX2F0IC09IDE7XHJcblxyXG4gICAgICAgICAgaWYgKF9hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyID09IHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMucHVzaChuYW1lIHx8IHRoaXMuZ2VuZXJhdGVOZXdWYXJpYWJsZU5hbWUoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250YWluZXIuc3BsaWNlKF9hdCArIF9jaGlsZHJlbi5pbmRleE9mKGRhdGEpLCAwLCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZU5hbWVzLnNwbGljZShfYXQgKyBfY2hpbGRyZW4uaW5kZXhPZihkYXRhKSwgMCwgbmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlW10pOiBQcm9taXNlPMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmVbXT4ge1xyXG4gICAgICBsZXQgY29waWVzOiAoxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSlbXSA9IFtdO1xyXG4gICAgICBpZiAoX29yaWdpbmFscy5ldmVyeShfb3JpZ2luYWwgPT4gxpIuUGFydGljbGVEYXRhLmlzRXhwcmVzc2lvbihfb3JpZ2luYWwpKSB8fCBfb3JpZ2luYWxzLmV2ZXJ5KF9vcmlnaW5hbCA9PiDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihfb3JpZ2luYWwpKSlcclxuICAgICAgICBfb3JpZ2luYWxzLmZvckVhY2goX29yaWdpbmFsID0+IGNvcGllcy5wdXNoKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX29yaWdpbmFsKSkpKTtcclxuXHJcbiAgICAgIHJldHVybiBjb3BpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG92ZXJyaWRlIGRyYWdnYWJsZShfdGFyZ2V0OiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiDGki5QYXJ0aWNsZURhdGEuaXNFeHByZXNzaW9uKF90YXJnZXQpIHx8IMaSLlBhcnRpY2xlRGF0YS5pc1RyYW5zZm9ybWF0aW9uKF90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gXCJuZXdWYXJpYWJsZVwiO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDE7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xyXG4gICAgICAgIG5hbWUgPSBcIm5ld1ZhcmlhYmxlXCIgKyBjb3VudDtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0S2V5KF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogc3RyaW5nIHsgXHJcbiAgICAgIGxldCBwYXJlbnQ6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmNoaWxkVG9QYXJlbnQuZ2V0KF9kYXRhKSB8fCB7fTtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKHBhcmVudCkgfHwgxpIuUGFydGljbGVEYXRhLmlzVHJhbnNmb3JtYXRpb24ocGFyZW50KSlcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyYW1ldGVycztcclxuXHJcbiAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJlbnQpLmZpbmQoX2VudHJ5ID0+IF9lbnRyeVsxXSA9PSBfZGF0YSk/LnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVEYXRhKF9kYXRhOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChfZGF0YSA9PSB0aGlzLmRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgbGV0IHBhcmVudDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMuY2hpbGRUb1BhcmVudC5nZXQoX2RhdGEpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSB0aGlzLmdldEtleShfZGF0YSk7XHJcblxyXG4gICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24ocGFyZW50KSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihwYXJlbnQpKVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJhbWV0ZXJzO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50KSkge1xyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KGtleSk7XHJcbiAgICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PSB0aGlzLmRhdGEudmFyaWFibGVzKVxyXG4gICAgICAgICAgdGhpcy5kYXRhLnZhcmlhYmxlTmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWxldGUgcGFyZW50W2tleV07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuY2hpbGRUb1BhcmVudC5kZWxldGUoX2RhdGEpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmFtZVZhcmlhYmxlKF9uYW1lOiBzdHJpbmcsIF9uZXc6IHN0cmluZywgX2RhdGE6IMaSLlBhcnRpY2xlRGF0YS5SZWN1cnNpdmUgPSB0aGlzLmRhdGEpOiB2b2lkIHtcclxuICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc1ZhcmlhYmxlKF9kYXRhKSAmJiBfZGF0YS52YWx1ZSA9PSBfbmFtZSkge1xyXG4gICAgICAgIF9kYXRhLnZhbHVlID0gX25ldztcclxuICAgICAgICB0aGlzLnZpZXcuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBkZXRhaWw6IHsgZGF0YTogX2RhdGEgfSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBzdWJEYXRhIG9mIE9iamVjdC52YWx1ZXMoXCJwYXJhbWV0ZXJzXCIgaW4gX2RhdGEgPyBfZGF0YS5wYXJhbWV0ZXJzIDogX2RhdGEpKVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViRGF0YSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgdGhpcy5yZW5hbWVWYXJpYWJsZShfbmFtZSwgX25ldywgc3ViRGF0YSk7XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgUmVzb3VyY2VFbnRyeSA9IFJlc291cmNlRmlsZSB8IFJlc291cmNlRm9sZGVyO1xyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFJlc291cmNlRmlsZSBleHRlbmRzIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlIHtcclxuICAgIHJlc291cmNlUGFyZW50PzogUmVzb3VyY2VGb2xkZXI7IC8vIGRhbmdlcm91cyBhcyBhIFNlcmlhbGl6YWJsZVJlc291cmNlIG11c3Qgbm90IGhhdmUgYSBwcm9wZXJ0eSB3aXRoIHRoaXMgbmFtZSBpdHNlbGZcclxuICB9XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBSZXNvdXJjZUZvbGRlciBpbXBsZW1lbnRzIMaSLlNlcmlhbGl6YWJsZSB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlc291cmNlUGFyZW50OiBSZXNvdXJjZUZvbGRlcjtcclxuICAgIHB1YmxpYyBlbnRyaWVzOiBSZXNvdXJjZUVudHJ5W10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmcgPSBcIkZvbGRlclwiO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nID0gXCJOZXcgRm9sZGVyXCIpIHtcclxuICAgICAgdGhpcy5uYW1lID0gX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvciBhbnkgb2YgaXRzIGRlc2NlbmRhbnRzIGNvbnRhaW4gdGhlIGdpdmVuIHJlc291cmNlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnMoX3Jlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSk6IGJvb2xlYW4ge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpXHJcbiAgICAgICAgaWYgKGVudHJ5ID09IF9yZXNvdXJjZSB8fCBlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyICYmIGVudHJ5LmNvbnRhaW5zKF9yZXNvdXJjZSkpXHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplKCk6IMaSLlNlcmlhbGl6YXRpb24ge1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbiA9IHsgbmFtZTogdGhpcy5uYW1lLCBlbnRyaWVzOiBbXSB9O1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uZW50cmllcy5wdXNoKGVudHJ5LnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzZXJpYWxpemF0aW9uLmVudHJpZXMucHVzaCh7IGlkUmVzb3VyY2U6IGVudHJ5LmlkUmVzb3VyY2UgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlcmlhbGl6YXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGU+IHtcclxuICAgICAgdGhpcy5uYW1lID0gX3NlcmlhbGl6YXRpb24ubmFtZTtcclxuICAgICAgZm9yIChsZXQgZW50cnlTZXJpYWxpemF0aW9uIG9mIF9zZXJpYWxpemF0aW9uLmVudHJpZXMgPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW4pIHsgLy8gcmVtb3ZlIFwiPz8gX3NlcmlhbGl6YXRpb24uY2hpbGRyZW5cIiBhZnRlciBhIHdoaWxlXHJcbiAgICAgICAgbGV0IGVudHJ5OiBSZXNvdXJjZUVudHJ5O1xyXG4gICAgICAgIGlmIChcImlkUmVzb3VyY2VcIiBpbiBlbnRyeVNlcmlhbGl6YXRpb24pXHJcbiAgICAgICAgICBlbnRyeSA9IGF3YWl0IMaSLlByb2plY3QuZ2V0UmVzb3VyY2UoZW50cnlTZXJpYWxpemF0aW9uLmlkUmVzb3VyY2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVudHJ5ID0gPFJlc291cmNlRm9sZGVyPmF3YWl0IG5ldyBSZXNvdXJjZUZvbGRlcigpLmRlc2VyaWFsaXplKGVudHJ5U2VyaWFsaXphdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgdGhpcy5lbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgZW50cnkucmVzb3VyY2VQYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8UmVzb3VyY2VFbnRyeT4ge1xyXG4gICAgICB5aWVsZCB0aGlzO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcilcclxuICAgICAgICAgIHlpZWxkKiBlbnRyeTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB5aWVsZCBlbnRyeTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJUcmVlUmVzb3VyY2UgZXh0ZW5kcyDGknVpLlRyZWVDb250cm9sbGVyPFJlc291cmNlRW50cnk+IHtcclxuICAgIHB1YmxpYyBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudmFsdWUgPSBfb2JqZWN0Lm5hbWU7XHJcblxyXG4gICAgICBpZiAoIShfb2JqZWN0IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpKSB7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBfb2JqZWN0LnR5cGUpO1xyXG5cclxuICAgICAgICBpZiAoKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9vYmplY3QpLnN0YXR1cyA9PSDGki5SRVNPVVJDRV9TVEFUVVMuRVJST1IpIHtcclxuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgIGlucHV0LnRpdGxlID0gXCJGYWlsZWQgdG8gbG9hZCByZXNvdXJjZSBmcm9tIGZpbGUuIENoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFJlc291cmNlRW50cnkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2V0VmFsdWUoX2VudHJ5OiBSZXNvdXJjZUVudHJ5LCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIGxldCByZW5hbWU6IGJvb2xlYW4gPSBfZW50cnkubmFtZSAhPSBfZWxlbWVudC52YWx1ZTtcclxuICAgICAgaWYgKHJlbmFtZSkge1xyXG4gICAgICAgIF9lbnRyeS5uYW1lID0gX2VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgYXdhaXQgKDzGki5TZXJpYWxpemFibGVSZXNvdXJjZUV4dGVybmFsPl9lbnRyeSkubG9hZD8uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZW5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NoaWxkcmVuKF9lbnRyeTogUmVzb3VyY2VFbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2VudHJ5IGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIgJiYgX2VudHJ5LmVudHJpZXMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oX2VudHJ5OiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgcmV0dXJuIF9lbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyID8gX2VudHJ5LmVudHJpZXMgOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFJlc291cmNlRW50cnlbXSwgX3RhcmdldDogUmVzb3VyY2VFbnRyeSwgX2luZGV4PzogbnVtYmVyKTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgaWYgKCEoX3RhcmdldCBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKSlcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBsZXQgbW92ZTogUmVzb3VyY2VFbnRyeVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBfc291cmNlcykge1xyXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXg6IG51bWJlciA9IF90YXJnZXQuZW50cmllcy5pbmRleE9mKHNvdXJjZSk7IC8vIF9pbmRleCBuZWVkcyB0byBiZSBjb3JyZWN0ZWQgaWYgd2UgYXJlIG1vdmluZyB3aXRoaW4gc2FtZSBwYXJlbnRcclxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEgJiYgX2luZGV4ID4gY3VycmVudEluZGV4KVxyXG4gICAgICAgICAgX2luZGV4IC09IDE7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKHNvdXJjZSk7XHJcbiAgICAgICAgc291cmNlLnJlc291cmNlUGFyZW50ID0gX3RhcmdldDtcclxuICAgICAgICBtb3ZlLnB1c2goc291cmNlKTtcclxuXHJcbiAgICAgICAgaWYgKF9pbmRleCA9PSBudWxsKVxyXG4gICAgICAgICAgX3RhcmdldC5lbnRyaWVzLnB1c2goc291cmNlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBfdGFyZ2V0LmVudHJpZXMuc3BsaWNlKF9pbmRleCArIF9zb3VyY2VzLmluZGV4T2Yoc291cmNlKSwgMCwgc291cmNlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9mb2N1c3NlZDogUmVzb3VyY2VFbnRyeVtdKTogUHJvbWlzZTxSZXNvdXJjZUVudHJ5W10+IHtcclxuICAgICAgLy8gVE9ETzogTWF5YmUgdGhlIHRyZWUgY29udHJvbGxlciBzaG91bGQgcHJvdmlkZSB0aGUgc2VsZWN0ZWQgZW50cmllcz9cclxuICAgICAgbGV0IGV4cGVuZDogUmVzb3VyY2VFbnRyeVtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uIDogX2ZvY3Vzc2VkO1xyXG5cclxuICAgICAgbGV0IGlSb290OiBudW1iZXIgPSBleHBlbmQuaW5kZXhPZihwcm9qZWN0LnJlc291cmNlRm9sZGVyKTtcclxuICAgICAgaWYgKGlSb290ID4gLTEpXHJcbiAgICAgICAgZXhwZW5kLnNwbGljZShpUm9vdCwgMSk7XHJcblxyXG4gICAgICBsZXQgZmlsZXM6IFNldDxSZXNvdXJjZUZpbGU+ID0gbmV3IFNldCgpO1xyXG4gICAgICBsZXQgZm9sZGVyczogU2V0PFJlc291cmNlRm9sZGVyPiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGV4cGVuZGFibGUgb2YgZXhwZW5kKVxyXG4gICAgICAgIHRoaXMuY29sbGVjdEVudHJpZXMoZXhwZW5kYWJsZSwgZmlsZXMsIGZvbGRlcnMpO1xyXG5cclxuICAgICAgbGV0IHNlcmlhbGl6YXRpb25zOiDGki5TZXJpYWxpemF0aW9uT2ZSZXNvdXJjZXMgPSDGki5Qcm9qZWN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICBsZXQgc2VyaWFsaXphdGlvblN0cmluZ3M6IE1hcDzGki5TZXJpYWxpemFibGVSZXNvdXJjZSwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHVzYWdlczogxpIuTXV0YXRvciA9IHt9O1xyXG5cclxuICAgICAgZm9yIChsZXQgaWRSZXNvdXJjZSBpbiBzZXJpYWxpemF0aW9ucylcclxuICAgICAgICBzZXJpYWxpemF0aW9uU3RyaW5ncy5zZXQoxpIuUHJvamVjdC5yZXNvdXJjZXNbaWRSZXNvdXJjZV0sIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YXRpb25zW2lkUmVzb3VyY2VdKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgICAgdXNhZ2VzW2ZpbGUuaWRSZXNvdXJjZV0gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBzZXJpYWxpemF0aW9uU3RyaW5ncy5rZXlzKCkpXHJcbiAgICAgICAgICBpZiAocmVzb3VyY2UuaWRSZXNvdXJjZSAhPSBmaWxlLmlkUmVzb3VyY2UpXHJcbiAgICAgICAgICAgIGlmIChzZXJpYWxpemF0aW9uU3RyaW5ncy5nZXQocmVzb3VyY2UpLmluZGV4T2YoZmlsZS5pZFJlc291cmNlKSA+IC0xKVxyXG4gICAgICAgICAgICAgIHVzYWdlc1tmaWxlLmlkUmVzb3VyY2VdLnB1c2gocmVzb3VyY2UubmFtZSArIFwiIFwiICsgcmVzb3VyY2UudHlwZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChleHBlbmQubGVuZ3RoID4gMCAmJiBhd2FpdCBvcGVuRGlhbG9nKCkpIHtcclxuICAgICAgICBsZXQgZGVsZXRlZEZpbGVzOiBSZXNvdXJjZUZpbGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBzZWxlY3RlZCBvZiBmaWxlcylcclxuICAgICAgICAgIGlmICh1c2FnZXNbc2VsZWN0ZWQuaWRSZXNvdXJjZV0ubGVuZ3RoID09IDApICAvLyBkZWxldGUgb25seSB1bnVzZWRcclxuICAgICAgICAgICAgZGVsZXRlZEZpbGVzLnB1c2goc2VsZWN0ZWQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiBkZWxldGVkRmlsZXMpIHtcclxuICAgICAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihyZXNvdXJjZSk7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZShyZXNvdXJjZSk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UodGhpcy5zZWxlY3Rpb24uaW5kZXhPZihyZXNvdXJjZSksIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlbGV0ZWRGb2xkZXJzOiBSZXNvdXJjZUZvbGRlcltdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgZm9sZGVyIG9mIGZvbGRlcnMpXHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZUZvbGRlcnMoZm9sZGVyLCBkZWxldGVkRm9sZGVycyk7XHJcblxyXG4gICAgICAgIHJldHVybiBbLi4uZGVsZXRlZEZpbGVzLCAuLi5kZWxldGVkRm9sZGVyc107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wZW5EaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8Ym9vbGVhbj4gPSDGknVpLkRpYWxvZy5wcm9tcHQodXNhZ2VzLCB0cnVlLCBcIlJldmlldyByZWZlcmVuY2VzLCBkZWxldGUgZGVwZW5kZW5kIHJlc291cmNlcyBmaXJzdCBpZiBhcHBsaWNhYmxlXCIsIFwiVG8gZGVsZXRlIHVudXNlZCByZXNvdXJjZXMsIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcblxyXG4gICAgICAgIGlmIChhd2FpdCBwcm9taXNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgY29weShfb3JpZ2luYWxzOiBSZXNvdXJjZUVudHJ5W10pOiBQcm9taXNlPFJlc291cmNlRW50cnlbXT4ge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhdGgoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogUmVzb3VyY2VFbnRyeVtdIHtcclxuICAgICAgbGV0IHBhdGg6IFJlc291cmNlRW50cnlbXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudDogUmVzb3VyY2VFbnRyeSA9IF9yZXNvdXJjZTtcclxuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcclxuICAgICAgICBwYXRoLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmVzb3VyY2VQYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoX3Jlc291cmNlOiBSZXNvdXJjZUVudHJ5KTogdm9pZCB7XHJcbiAgICAgIGxldCBwYXJlbnQ6IFJlc291cmNlRm9sZGVyID0gX3Jlc291cmNlLnJlc291cmNlUGFyZW50O1xyXG4gICAgICBpZiAoIXBhcmVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHBhcmVudC5lbnRyaWVzLmluZGV4T2YoX3Jlc291cmNlKTtcclxuICAgICAgcGFyZW50LmVudHJpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0RW50cmllcyhfZW50cnk6IFJlc291cmNlRW50cnksIF9maWxlczogU2V0PFJlc291cmNlRmlsZT4sIF9mb2xkZXJzOiBTZXQ8UmVzb3VyY2VGb2xkZXI+KTogdm9pZCB7XHJcbiAgICAgIGlmIChfZW50cnkgaW5zdGFuY2VvZiBSZXNvdXJjZUZvbGRlcikge1xyXG4gICAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9lbnRyeS5lbnRyaWVzKSBcclxuICAgICAgICAgIHRoaXMuY29sbGVjdEVudHJpZXMoZW50cnksIF9maWxlcywgX2ZvbGRlcnMpO1xyXG4gICAgICAgIF9mb2xkZXJzLmFkZChfZW50cnkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIF9maWxlcy5hZGQoX2VudHJ5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVsZXRlRm9sZGVycyhfZm9sZGVyOiBSZXNvdXJjZUZvbGRlciwgX2RlbGV0ZWQ6IFJlc291cmNlRm9sZGVyW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2ZvbGRlci5lbnRyaWVzKVxyXG4gICAgICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFJlc291cmNlRm9sZGVyKVxyXG4gICAgICAgICAgdGhpcy5kZWxldGVGb2xkZXJzKGVudHJ5LCBfZGVsZXRlZCk7XHJcblxyXG4gICAgICBpZiAoX2ZvbGRlci5lbnRyaWVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUoX2ZvbGRlcik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24uc3BsaWNlKHRoaXMuc2VsZWN0aW9uLmluZGV4T2YoX2ZvbGRlciksIDEpO1xyXG4gICAgICAgIF9kZWxldGVkLnB1c2goX2ZvbGRlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9WaWV3L1ZpZXcudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgW1tQYW5lbF1dcyBhZ2dyZWdhdGluZyBbW1ZpZXddXXNcclxuICAgKiBTdWJjbGFzc2VzIGFyZSBwcmVzZXRzIGZvciBjb21tb24gcGFuZWxzLiBBIHVzZXIgbWlnaHQgYWRkIG9yIGRlbGV0ZSBbW1ZpZXddXXMgYXQgcnVudGltZVxyXG4gICAqIEBhdXRob3JzIE1vbmlrYSBHYWxrZXdpdHNjaCwgSEZVLCAyMDE5IHwgTHVrYXMgU2NoZXVlcmxlLCBIRlUsIDIwMTkgfCBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICAvLyBUT0RPOiBjbGFzcyBtaWdodCBiZWNvbWUgYSBjdXN0b21jb21wb25lbnQgZm9yIEhUTUwhID0gdGhpcy5kb21cclxuXHJcbiAgLy8gZXh0ZW5kcyB2aWV3IHZvcnLDvGJlcmdlaGVuZCBlbnRmZXJudFxyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYW5lbCBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJvdGVjdGVkIGdvbGRlbkxheW91dDogR29sZGVuTGF5b3V0O1xyXG4gICAgcHJvdGVjdGVkIHZpZXdzOiBWaWV3W10gPSBbXTtcclxuICAgIC8vcHVibGljIGRvbTsgLy8gbXVzcyB2aWVsbGVpY2h0IHdlZ1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9wYW5lbFN0YXRlOiBWaWV3U3RhdGUsIF92aWV3Q29uc3RydWN0b3JzPzogeyBbbmFtZTogc3RyaW5nXTogbmV3ICguLi5hcmdzOiDGki5HZW5lcmFsKSA9PiBWaWV3IH0sIF9yb290SXRlbUNvbmZpZz86IFJvd09yQ29sdW1uSXRlbUNvbmZpZykge1xyXG4gICAgICBfY29udGFpbmVyLm9uKFwiZGVzdHJveVwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC5kZXN0cm95KCkpOyAvLyBkZXN0cm95IGZyb20gaW5zaWRlIG91dFxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfcGFuZWxTdGF0ZSk7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcInZpZXdcIik7XHJcbiAgICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZShcInBhbmVsXCIsIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IExheW91dENvbmZpZyA9IHtcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgIHBvcG91dDogZmFsc2UsXHJcbiAgICAgICAgICBtYXhpbWlzZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJvb3Q6IF9yb290SXRlbUNvbmZpZ1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQgPSBuZXcgUGFnZS5nb2xkZW5MYXlvdXRNb2R1bGUuR29sZGVuTGF5b3V0KHRoaXMuZG9tKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIF92aWV3Q29uc3RydWN0b3JzKVxyXG4gICAgICAgIHRoaXMuZ29sZGVuTGF5b3V0LnJlZ2lzdGVyQ29tcG9uZW50RmFjdG9yeUZ1bmN0aW9uKGtleSwgKF9jb250YWluZXIsIF92aWV3U3RhdGU6IFZpZXdTdGF0ZSkgPT4gbmV3IF92aWV3Q29uc3RydWN0b3JzW2tleV0oX2NvbnRhaW5lciwgeyAuLi5fcGFuZWxTdGF0ZSwgLi4uX3ZpZXdTdGF0ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmdvbGRlbkxheW91dC5vbihcInN0YXRlQ2hhbmdlZFwiLCAoKSA9PiB0aGlzLmdvbGRlbkxheW91dC51cGRhdGVSb290U2l6ZSgpKTtcclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQub24oXCJpdGVtQ3JlYXRlZFwiLCB0aGlzLmFkZFZpZXdDb21wb25lbnQpO1xyXG5cclxuICAgICAgdGhpcy5nb2xkZW5MYXlvdXQubG9hZExheW91dChfcGFuZWxTdGF0ZVtcImxheW91dFwiXSA/IFBhZ2UuZ29sZGVuTGF5b3V0TW9kdWxlLkxheW91dENvbmZpZy5mcm9tUmVzb2x2ZWQoX3BhbmVsU3RhdGVbXCJsYXlvdXRcIl0pIDogY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU2VuZCBjdXN0b20gY29waWVzIG9mIHRoZSBnaXZlbiBldmVudCB0byB0aGUgdmlld3MgKi9cclxuICAgIHB1YmxpYyBicm9hZGNhc3QgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IF9ldmVudC5kZXRhaWwgfHwge307XHJcbiAgICAgIGxldCB0YXJnZXQ6IFZpZXcgPSBkZXRhaWwudmlldztcclxuICAgICAgZGV0YWlsLnNlbmRlciA9IHRoaXM7XHJcbiAgICAgIGZvciAobGV0IHZpZXcgb2YgdGhpcy52aWV3cylcclxuICAgICAgICBpZiAodmlldyAhPSB0YXJnZXQpIC8vIGRvbid0IHNlbmQgYmFjayB0byBvcmlnaW5hbCB0YXJnZXQgdmlld1xyXG4gICAgICAgICAgdmlldy5kaXNwYXRjaCg8RVZFTlRfRURJVE9SPl9ldmVudC50eXBlLCB7IGRldGFpbDogZGV0YWlsIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImxheW91dFwiXSA9IHRoaXMuZ29sZGVuTGF5b3V0LnNhdmVMYXlvdXQoKTtcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkVmlld0NvbXBvbmVudCA9IChfZXZlbnQ6IEV2ZW50RW1pdHRlci5CdWJibGluZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGFkanVzdG1lbnMgZm9yIEdvbGRlbkxheW91dCAyXHJcbiAgICAgIGxldCB0YXJnZXQ6IENvbXBvbmVudEl0ZW0gPSBfZXZlbnQudGFyZ2V0IGFzIENvbXBvbmVudEl0ZW07XHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQYWdlLmdvbGRlbkxheW91dE1vZHVsZS5Db21wb25lbnRJdGVtKSB7XHJcbiAgICAgICAgdGhpcy52aWV3cy5wdXNoKDxWaWV3PnRhcmdldC5jb21wb25lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBUT0RPOiBhZGRcclxuICAgKiBAYXV0aG9ycyBKb25hcyBQbG90emt5LCBIRlUsIDIwMjJcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxBbmltYXRpb24gZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5BTklNQVRJT05dOiBWaWV3QW5pbWF0aW9uLFxyXG4gICAgICAgIFtWSUVXLkFOSU1BVElPTl9TSEVFVF06IFZpZXdBbmltYXRpb25TaGVldFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJQcm9wZXJ0aWVzXCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuQU5JTUFUSU9OX1NIRUVUXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCBjb25zdHJ1Y3RvcnMsIGNvbmZpZyk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkFuaW1hdGlvbiB8IFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0U3RhdGUoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGl0ZXJhdGUgb3ZlciB2aWV3cyBhbmQgY29sbGVjdCB0aGVpciBzdGF0ZXMgZm9yIHJlY29uc3RydWN0aW9uXHJcbiAgICAvLyAgIHJldHVybiB7fTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gYXN5bmMgKF9ldmVudDogRWRpdG9yRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfZXZlbnQuZGV0YWlsLm5vZGU/LmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik/LmFuaW1hdGlvbj8ubmFtZTtcclxuICAgICAgICAgIGlmIChuYW1lKVxyXG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlKFwiQW5pbWF0aW9uIHwgXCIgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5icm9hZGNhc3QoX2V2ZW50KTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgZ3JhcGggYW5kIG9mZmVycyBtZWFucyBmb3IgbWFuaXB1bGF0aW9uXHJcbiAgKiBAYXV0aG9ycyBNb25pa2EgR2Fsa2V3aXRzY2gsIEhGVSwgMjAxOSB8IEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwXHJcbiAgKi9cclxuICBleHBvcnQgY2xhc3MgUGFuZWxHcmFwaCBleHRlbmRzIFBhbmVsIHtcclxuICAgICNncmFwaDogxpIuR3JhcGg7XHJcbiAgICAjbm9kZTogxpIuTm9kZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgKi9cclxuICAgICAgICBbVklFVy5SRU5ERVJdOiBWaWV3UmVuZGVyLFxyXG4gICAgICAgIFtWSUVXLkNPTVBPTkVOVFNdOiBWaWV3Q29tcG9uZW50cyxcclxuICAgICAgICBbVklFVy5ISUVSQVJDSFldOiBWaWV3SGllcmFyY2h5XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjb25maWc6IFJvd09yQ29sdW1uSXRlbUNvbmZpZyA9IHtcclxuICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgICAgICB0aXRsZTogXCJSZW5kZXJcIlxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnRUeXBlOiBWSUVXLkhJRVJBUkNIWSxcclxuICAgICAgICAgICAgdGl0bGU6IFwiSGllcmFyY2h5XCJcclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5DT01QT05FTlRTLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJDb21wb25lbnRzXCJcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSwgY29uc3RydWN0b3JzLCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkdyYXBoXCIpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuRk9DVVMsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DTE9TRSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLnJlc3RvcmVHcmFwaCgpLnRoZW4oX2dyYXBoID0+IHtcclxuICAgICAgICBpZiAoX2dyYXBoKSB7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgZGV0YWlsOiB7IGdyYXBoOiBfZ3JhcGgsIG5vZGU6IHRoaXMucmVzdG9yZU5vZGUoX2dyYXBoKSB9IH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmIChfc3RhdGVbXCJncmFwaFwiXSkge1xyXG4gICAgICAgICAgxpIuUHJvamVjdC5nZXRSZXNvdXJjZShfc3RhdGVbXCJncmFwaFwiXSkudGhlbigoX2dyYXBoOiDGki5HcmFwaCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlOiDGki5Ob2RlID0gX3N0YXRlW1wibm9kZVwiXSAmJiDGki5Ob2RlLkZJTkQoX2dyYXBoLCBfc3RhdGVbXCJub2RlXCJdKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBncmFwaDogX2dyYXBoLCBub2RlOiBub2RlIH0gfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIGlmICh0aGlzLiNncmFwaClcclxuICAgICAgICBzdGF0ZVtcImdyYXBoXCJdID0gdGhpcy4jZ3JhcGguaWRSZXNvdXJjZTtcclxuICAgICAgaWYgKHRoaXMuI25vZGUpXHJcbiAgICAgICAgc3RhdGVbXCJub2RlXCJdID0gxpIuTm9kZS5QQVRIX0ZST01fVE8odGhpcy4jZ3JhcGgsIHRoaXMuI25vZGUpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy52aWV3cy5maW5kKF92aWV3ID0+IF92aWV3IGluc3RhbmNlb2YgVmlld1JlbmRlcikuZG9tLmNvbnRhaW5zKDxOb2RlPl9ldmVudC50YXJnZXQpKSAvLyBhY2NlcHQgZHJvcCBvbmx5IGZyb20gcmVuZGVyIHZpZXdcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgc291cmNlOiBPYmplY3QgPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKVswXTtcclxuICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IHsgZ3JhcGg6IHNvdXJjZSwgbm9kZTogdGhpcy5yZXN0b3JlTm9kZShzb3VyY2UpIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGRldGFpbDogRXZlbnREZXRhaWwgPSBfZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOiAvLyBUT0RPOiBpbnNwZWN0IGlmIHRoZXNlIHR3byBzaG91bGQgYmUgc3RvcHBlZCBhc3dlbGxcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5TRUxFQ1Q6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBjb25zdCBncmFwaDogxpIuR3JhcGggPSBkZXRhaWwuZ3JhcGg7XHJcbiAgICAgICAgICBpZiAoZ3JhcGggJiYgZ3JhcGggIT0gdGhpcy4jZ3JhcGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUdyYXBoKGdyYXBoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtncmFwaC50eXBlfSB8ICR7Z3JhcGgubmFtZX1gKTtcclxuICAgICAgICAgICAgdGhpcy4jZ3JhcGggPSBncmFwaDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IG5vZGU6IMaSLk5vZGUgPSBkZXRhaWwubm9kZTtcclxuICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgIT0gdGhpcy4jbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0aGlzLiNncmFwaCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuI25vZGUgPSBub2RlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuQ0xPU0U6XHJcbiAgICAgICAgICBpZiAoZGV0YWlsLnZpZXcgIT0gdGhpcylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlR3JhcGgodGhpcy4jZ3JhcGgpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2dyYXBoICYmIHRoaXMuI25vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKHRoaXMuI2dyYXBoLCB0aGlzLiNub2RlKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoLCBfc2VsZWN0ZWQ6IMaSLk5vZGUpOiB2b2lkIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWAsIMaSLk5vZGUuUEFUSF9GUk9NX1RPKF9ncmFwaCwgX3NlbGVjdGVkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlTm9kZShfZ3JhcGg6IMaSLkdyYXBoKTogxpIuTm9kZSB7XHJcbiAgICAgIGxldCBzZWxlY3RlZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShgJHt0aGlzLmlkfV8ke19ncmFwaC5pZFJlc291cmNlfWApO1xyXG4gICAgICByZXR1cm4gc2VsZWN0ZWQgJiYgxpIuTm9kZS5GSU5EKF9ncmFwaCwgc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmVHcmFwaChfZ3JhcGg6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgX2dyYXBoLmlkUmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVzdG9yZUdyYXBoKCk6IFByb21pc2U8xpIuR3JhcGg+IHtcclxuICAgICAgbGV0IGlkOiBzdHJpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuaWQpO1xyXG4gICAgICByZXR1cm4gaWQgJiYgPFByb21pc2U8xpIuR3JhcGg+PsaSLlByb2plY3QuZ2V0UmVzb3VyY2UoaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAqIFNob3dzIGEgaGVscCBhbmQgZG9jdW1lbnRhdGlvblxyXG4gICogQGF1dGhvcnMgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjFcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbEhlbHAgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiSGVscFwiKTtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5kb20pO1xyXG4gICAgICAvLyBUT0RPOiBpZnJhbWUgc2FuZGJveCBkaXNhbGxvd3MgdXNlIG9mIHNjcmlwdHMsIHJlbW92ZSBvciByZXBsYWNlIHdpdGggb2JqZWN0IGlmIG5lY2Vzc2FyeVxyXG4gICAgICAvLyB0aGlzLmRvbS5pbm5lckhUTUwgPSBgPGlmcmFtZSBzcmM9XCJIZWxwLmh0bWxcIiBzYW5kYm94PjwvaWZyYW1lPmA7XHJcbiAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IGA8b2JqZWN0IGRhdGE9XCJIZWxwLmh0bWxcIj48L29iamVjdD5gO1xyXG5cclxuICAgICAgLy8gY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgIC8vICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgLy8gICBpc0Nsb3NhYmxlOiB0cnVlLFxyXG4gICAgICAvLyAgIGNvbnRlbnQ6IFtcclxuICAgICAgLy8gICAgIHtcclxuICAgICAgLy8gICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgLy8gICAgICAgY29tcG9uZW50VHlwZTogVklFVy5SRU5ERVIsXHJcbiAgICAgIC8vICAgICAgIGNvbXBvbmVudFN0YXRlOiBfc3RhdGUsXHJcbiAgICAgIC8vICAgICAgIHRpdGxlOiBcIlJlbmRlclwiXHJcbiAgICAgIC8vICAgICB9XHJcbiAgICAgIC8vICAgXVxyXG4gICAgICAvLyB9O1xyXG5cclxuICAgICAgLy8gdGhpcy5nb2xkZW5MYXlvdXQuYWRkSXRlbUF0TG9jYXRpb24oY29uZmlnLCBbeyB0eXBlSWQ6IExheW91dE1hbmFnZXIuTG9jYXRpb25TZWxlY3Rvci5UeXBlSWQuUm9vdCB9XSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldFN0YXRlKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xyXG4gICAgLy8gICByZXR1cm4ge307XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRPRE86IGFkZFxyXG4gICAqIEBhdXRob3JzIEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBQYW5lbFBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcclxuICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUEFSVElDTEVfU1lTVEVNLFxyXG4gICAgICAgICAgdGl0bGU6IMaSLlBhcnRpY2xlU3lzdGVtLm5hbWVcclxuICAgICAgICB9XVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlLCB7IFtWSUVXLlBBUlRJQ0xFX1NZU1RFTV06IFZpZXdQYXJ0aWNsZVN5c3RlbSB9LCBjb25maWcpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKMaSLlBhcnRpY2xlU3lzdGVtLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRTdGF0ZSgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcclxuICAgIC8vICAgLy8gVE9ETzogaXRlcmF0ZSBvdmVyIHZpZXdzIGFuZCBjb2xsZWN0IHRoZWlyIHN0YXRlcyBmb3IgcmVjb25zdHJ1Y3Rpb25cclxuICAgIC8vICAgcmV0dXJuIHt9O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSBhc3luYyAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheSB0aGUgcHJvamVjdCBzdHJ1Y3R1cmUgYW5kIG9mZmVyIGZ1bmN0aW9ucyBmb3IgY3JlYXRpb24sIGRlbGV0aW9uIGFuZCBhZGp1c3RtZW50IG9mIHJlc291cmNlc1xyXG4gICAqIEBhdXRob3JzIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwLSAyMDIzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFBhbmVsUHJvamVjdCBleHRlbmRzIFBhbmVsIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cnVjdG9ycyA9IHsgLyogZXNsaW50LWRpc2FibGUtbGluZSAqL1xyXG4gICAgICAgIFtWSUVXLklOVEVSTkFMX1RBQkxFXTogVmlld0ludGVybmFsVGFibGUsXHJcbiAgICAgICAgW1ZJRVcuSU5URVJOQUxfRk9MREVSXTogVmlld0ludGVybmFsRm9sZGVyLFxyXG4gICAgICAgIFtWSUVXLkVYVEVSTkFMXTogVmlld0V4dGVybmFsLFxyXG4gICAgICAgIFtWSUVXLlBST1BFUlRJRVNdOiBWaWV3UHJvcGVydGllcyxcclxuICAgICAgICBbVklFVy5QUkVWSUVXXTogVmlld1ByZXZpZXcsXHJcbiAgICAgICAgW1ZJRVcuU0NSSVBUXTogVmlld1NjcmlwdFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY29uZmlnOiBSb3dPckNvbHVtbkl0ZW1Db25maWcgPSB7XHJcbiAgICAgICAgdHlwZTogXCJjb2x1bW5cIixcclxuICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgdHlwZTogXCJyb3dcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJPUEVSVElFUyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvcGVydGllc1wiXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuUFJFVklFVyxcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJldmlld1wiXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHR5cGU6IFwicm93XCIsXHJcbiAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNvbHVtblwiLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbe1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5FWFRFUk5BTCxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJFeHRlcm5hbFwiXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuU0NSSVBULFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIlNjcmlwdFwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic3RhY2tcIixcclxuICAgICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxyXG4gICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IFZJRVcuSU5URVJOQUxfRk9MREVSLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmFsXCJcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogVklFVy5JTlRFUk5BTF9UQUJMRSxcclxuICAgICAgICAgICAgICB0aXRsZTogXCJUYWJsZVwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUsIGNvbnN0cnVjdG9ycywgY29uZmlnKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpOyAvLyBUT0RPOiBleHBsYWluIHVzZSBvZiBkb2N1bWVudCAvLyByZW1vdmVkIGJlYWNhdXNlIHRoaXMga2VlcHMgdGhlIHBhbmVscyBhbGl2ZSBldmVuIHdoZW4gY2xvc2VkXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIlByb2plY3QgfCBcIiArIHByb2plY3QubmFtZSk7XHJcbiAgICAgIHRoaXMuYnJvYWRjYXN0KG5ldyBFZGl0b3JFdmVudChFVkVOVF9FRElUT1IuT1BFTiwge30pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5VUERBVEUgJiYgX2V2ZW50LnR5cGUgIT0gRVZFTlRfRURJVE9SLkNSRUFURSAmJiBfZXZlbnQudHlwZSAhPSBFVkVOVF9FRElUT1IuREVMRVRFICYmIF9ldmVudC50eXBlICE9IEVWRU5UX0VESVRPUi5NT0RJRlkpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLnNldFRpdGxlKFwiUHJvamVjdCB8IFwiICsgcHJvamVjdC5uYW1lKTsgLy93aHkgaGVyZSBhbmQgZXZlcnl0aW1lP1xyXG4gICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5TRUxFQ1QpIHtcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChuZXcgRWRpdG9yRXZlbnQoRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBkZXRhaWw6IF9ldmVudC5kZXRhaWwgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmJyb2FkY2FzdChfZXZlbnQpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJ1aSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhIHBhcnRpY2xlIHN5c3RlbSBhdHRhY2hlZCB0byBhIG5vZGUuXHJcbiAgICogQGF1dGhvcnMgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdQYXJ0aWNsZVN5c3RlbSBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9QRVJUWV9LRVlTOiAoa2V5b2YgxpIuUGFydGljbGVEYXRhLlN5c3RlbSlbXSA9IFtcInZhcmlhYmxlc1wiLCBcIm10eExvY2FsXCIsIFwibXR4V29ybGRcIiwgXCJjb2xvclwiXTtcclxuXHJcbiAgICBwcml2YXRlIGNtcFBhcnRpY2xlU3lzdGVtOiDGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHJpdmF0ZSBkYXRhOiDGki5QYXJ0aWNsZURhdGEuU3lzdGVtO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHRvb2xiYXJJbnRlcnZhbElkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRpbWVTY2FsZVBsYXk6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHRyZWU6IMaSdWkuVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPjtcclxuICAgIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlclRyZWVQYXJ0aWNsZVN5c3RlbTtcclxuICAgIHByaXZhdGUgZXJyb3JzOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB2YXJpYWJsZXM6IEhUTUxEYXRhTGlzdEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5jcmVhdGVUb29sYmFyKCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0obnVsbCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNSRUFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24gY29udGV4dCBtZW51XHJcbiAgICBwcm90ZWN0ZWQgb3BlbkNvbnRleHRNZW51ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGZvY3VzOiDGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlID0gdGhpcy50cmVlLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51Lml0ZW1zLmZvckVhY2goX2l0ZW0gPT4gX2l0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgbGV0IHBvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtID0gdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSkpO1xyXG4gICAgICAgIGl0ZW0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgaXRlbS5zdWJtZW51Lml0ZW1zLmZvckVhY2goX3N1Ykl0ZW0gPT4gX3N1Ykl0ZW0udmlzaWJsZSA9IGZhbHNlKTtcclxuICAgICAgICBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZU1xyXG4gICAgICAgICAgLmZpbHRlcihfdmFsdWUgPT4gIU9iamVjdC5rZXlzKGZvY3VzKS5pbmNsdWRlcyhfdmFsdWUpKVxyXG4gICAgICAgICAgLmZvckVhY2goX2xhYmVsID0+IGl0ZW0uc3VibWVudS5pdGVtcy5maW5kKF9pdGVtID0+IF9pdGVtLmxhYmVsID09IF9sYWJlbCkudmlzaWJsZSA9IHRydWUpO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS52YXJpYWJsZXMgfHwgZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yIHx8IMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9GVU5DVElPTikpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSkpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHBvcHVwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZvY3VzID09IHRoaXMuZGF0YS5tdHhMb2NhbCB8fCBmb2N1cyA9PSB0aGlzLmRhdGEubXR4V29ybGQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9jdXMgIT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSkudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcG9wdXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocG9wdXApXHJcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3B1cCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICBsZXQgb3B0aW9uczogc3RyaW5nW10gPSBWaWV3UGFydGljbGVTeXN0ZW0uUFJPUEVSVFlfS0VZUztcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgUHJvcGVydHlcIixcclxuICAgICAgICBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9QUk9QRVJUWSksXHJcbiAgICAgICAgc3VibWVudTogZ2VuZXJhdGVTdWJNZW51KG9wdGlvbnMsIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFkpLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIFZhbHVlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIEZ1bmN0aW9uXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0ZVTkNUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQWRkIENvZGVcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfQ09ERSksIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkFkZCBUcmFuc2Zvcm1hdGlvblwiLFxyXG4gICAgICAgIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OKSxcclxuICAgICAgICBzdWJtZW51OiBnZW5lcmF0ZVN1Yk1lbnUoW8aSLk1hdHJpeDR4NC5wcm90b3R5cGUudHJhbnNsYXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUucm90YXRlLm5hbWUsIMaSLk1hdHJpeDR4NC5wcm90b3R5cGUuc2NhbGUubmFtZV0sIFN0cmluZyhDT05URVhUTUVOVS5BRERfUEFSVElDTEVfVFJBTlNGT1JNQVRJT04pLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTdWJNZW51KF9vcHRpb25zOiBzdHJpbmdbXSwgX2lkOiBzdHJpbmcsIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIF9vcHRpb25zLmZvckVhY2goX29wdGlvbiA9PiB7XHJcbiAgICAgICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBfb3B0aW9uLCBpZDogX2lkLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICAgICAgc3VibWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdWJtZW51O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBmb2N1czogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICBpZiAoIWZvY3VzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjaGlsZDogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZTtcclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfUFJPUEVSVFk6XHJcbiAgICAgICAgICBjaGlsZCA9IFtdO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX0NPTlNUQU5UOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IHZhbHVlOiAxIH07XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfUEFSVElDTEVfRlVOQ1RJT046XHJcbiAgICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBjaGlsZCA9IHsgZnVuY3Rpb246IMaSLlBhcnRpY2xlRGF0YS5GVU5DVElPTi5BRERJVElPTiwgcGFyYW1ldGVyczogW10gfTtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QQVJUSUNMRV9DT0RFOlxyXG4gICAgICAgICAgaWYgKCFjaGlsZClcclxuICAgICAgICAgICAgY2hpbGQgPSB7IGNvZGU6IFwiMVwiIH07XHJcblxyXG4gICAgICAgICAgaWYgKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKGZvY3VzKSB8fCDGki5QYXJ0aWNsZURhdGEuaXNUcmFuc2Zvcm1hdGlvbihmb2N1cykpXHJcbiAgICAgICAgICAgIGZvY3VzLnBhcmFtZXRlcnMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvY3VzW19pdGVtLmxhYmVsXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICBpZiAoX2l0ZW0ubGFiZWwgPT0gXCJ2YXJpYWJsZXNcIilcclxuICAgICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChmb2N1cyA9PSB0aGlzLmRhdGEudmFyaWFibGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YXJpYWJsZXMucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFyaWFibGVOYW1lcy5wdXNoKHRoaXMuY29udHJvbGxlci5nZW5lcmF0ZU5ld1ZhcmlhYmxlTmFtZSgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZm9jdXMgPT0gdGhpcy5kYXRhLmNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuY29sb3IucHVzaCg8xpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24+Y2hpbGQpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGlsZFRvUGFyZW50LnNldChjaGlsZCwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGZvY3VzKS5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoY2hpbGQpLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5DUkVBVEUsIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX1BBUlRJQ0xFX1RSQU5TRk9STUFUSU9OOlxyXG4gICAgICAgICAgY2hpbGQgPSB7IHRyYW5zZm9ybWF0aW9uOiA8xpIuUGFydGljbGVEYXRhLlRyYW5zZm9ybWF0aW9uW1widHJhbnNmb3JtYXRpb25cIl0+X2l0ZW0ubGFiZWwsIHBhcmFtZXRlcnM6IFtdIH07XHJcbiAgICAgICAgICAoPMaSLlBhcnRpY2xlRGF0YS5UcmFuc2Zvcm1hdGlvbltdPmZvY3VzKS5wdXNoKGNoaWxkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hpbGRUb1BhcmVudC5zZXQoY2hpbGQsIGZvY3VzKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QQVJUSUNMRV9EQVRBOlxyXG4gICAgICAgICAgbGV0IHJlbW92ZTogxpIuU2VyaWFsaXphdGlvbltdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbZm9jdXNdKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5kZWxldGUocmVtb3ZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuREVMRVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ0VudGVyKF9ldmVudDogRHJhZ0V2ZW50LCBfc291cmNlOiBWaWV3KTogdm9pZCB7IC8vIHByZXZlbnRzIGRyb3BFZmZlY3QgZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmhuZERyYWdPdmVyKF9ldmVudCwgX3NvdXJjZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgIT0gdGhpcylcclxuICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgXHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBsZXQgaXNQYXJ0aWNsZVN5c3RlbTogYm9vbGVhbiA9IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSAmJiBzb3VyY2UgaW5zdGFuY2VvZiDGki5Ob2RlICYmIHNvdXJjZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW0pPy5wYXJ0aWNsZVN5c3RlbSAhPSBudWxsICYmICF0aGlzLnRyZWU/LmNvbnRhaW5zKDxOb2RlPl9ldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKCFpc1BhcnRpY2xlU3lzdGVtKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbSA9IDzGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbT4oPMaSLk5vZGU+X3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKClbMF0pLmdldENvbXBvbmVudCjGki5Db21wb25lbnRQYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICAgIHRoaXMudGltZVNjYWxlUGxheSA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlO1xyXG4gICAgICB0aGlzLnNldFRpbWUoMCk7XHJcbiAgICAgIHRoaXMuc2V0UGFydGljbGVTeXN0ZW0odGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS5wYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IGFzeW5jIChfZXZlbnQ6IEVkaXRvckV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy50b29sYmFySW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbmFibGVTYXZlKHRydWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULktFWV9ET1dOOlxyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDAgJiYgX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSA9PSDGki5LRVlCT0FSRF9DT0RFLlMgJiYgX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgICAgIMaSdWkuV2FybmluZy5kaXNwbGF5KHRoaXMuZXJyb3JzLm1hcCgoW19kYXRhLCBfZXJyb3JdKSA9PiBfZXJyb3IpLCBcIlVuYWJsZSB0byBzYXZlXCIsIGBQcm9qZWN0IGNhbid0IGJlIHNhdmVkIHdoaWxlIGhhdmluZyB1bnJlc29sdmVkIGVycm9yc2AsIFwiT0tcIik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnRyZWUuZmluZFZpc2libGUoX2V2ZW50LmRldGFpbC5kYXRhKT8ucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNSRUFURTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5ERUxFVEU6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuREVMRVRFOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5EUk9QOlxyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5DVVQ6IC8vIFRPRE86IGN1c3RvbXMgdHJlZXMgY3V0IGlzIGFzeW5jLCB0aGlzIHNob3VsZCBoYXBwZW4gYWZ0ZXIgY3V0IGlzIGZpbmlzaGVkXHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoVmFyaWFibGVzKCk7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkVYUEFORDpcclxuICAgICAgICAgIGxldCBpbnZhbGlkOiBbxpIuUGFydGljbGVEYXRhLkV4cHJlc3Npb24sIHN0cmluZ11bXSA9IHRoaXMudmFsaWRhdGVEYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmVycm9yc1xyXG4gICAgICAgICAgICAuZmlsdGVyKF9lcnJvciA9PiAhaW52YWxpZC5pbmNsdWRlcyhfZXJyb3IpKVxyXG4gICAgICAgICAgICAubWFwKChbX2RhdGFdKSA9PiB0aGlzLnRyZWUuZmluZFZpc2libGUoX2RhdGEpKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChfaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFfaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIF9pdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YXJuaW5nXCIpO1xyXG4gICAgICAgICAgICAgIF9pdGVtLnRpdGxlID0gXCJcIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycyA9IGludmFsaWQ7XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDAgJiYgX2V2ZW50LnR5cGUgIT0gxpJ1aS5FVkVOVC5FWFBBTkQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS5kYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTsgLy8gb3VyIHdvcmtpbmcgY29weSBzaG91bGQgb25seSBiZSB1c2VkIGlmIGl0IGlzIHZhbGlkIFxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMuZm9yRWFjaCgoW19kYXRhLCBfZXJyb3JdKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGl0ZW06IMaSdWkuVHJlZUl0ZW08xpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZT4gPSB0aGlzLnRyZWUuZmluZFZpc2libGUoX2RhdGEpO1xyXG4gICAgICAgICAgICAgIGlmICghaXRlbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIik7XHJcbiAgICAgICAgICAgICAgaXRlbS50aXRsZSA9IF9lcnJvcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmVuYWJsZVNhdmUodGhpcy5lcnJvcnMubGVuZ3RoID09IDApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gdG9vbGJhclxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUb29sYmFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRvb2xiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuaWQgPSBcInRvb2xiYXJcIjtcclxuICAgICAgdGhpcy50b29sYmFyLnRpdGxlID0gXCLil48gQ29udHJvbCB0aGUgcGxheWJhY2sgb2YgdGhlIHNlbGVjdGVkIHBhcnRpY2xlIHN5c3RlbVxcbuKXjyBSaWdodCBjbGljayByZW5kZXIgdmlldyB0byBhY3RpdmF0ZSBjb250aW5vdXMgcmVuZGVyaW5nXCI7XHJcblxyXG4gICAgICBsZXQgYnV0dG9uczogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBidXR0b25zLmlkID0gXCJidXR0b25zXCI7XHJcbiAgICAgIFtcImJhY2t3YXJkXCIsIFwicGxheVwiLCBcImZvcndhcmRcIl1cclxuICAgICAgICAubWFwKF9pZCA9PiB7XHJcbiAgICAgICAgICBsZXQgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICBidXR0b24uaWQgPSBfaWQ7XHJcbiAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImJ1dHRvbkljb25cIik7XHJcbiAgICAgICAgICBidXR0b24ub25jbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRpbWVTY2FsZTogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpLmlkKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSBcImJhY2t3YXJkXCI6XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgLT0gMC4yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSBcInBsYXlcIjpcclxuICAgICAgICAgICAgICAgIHRpbWVTY2FsZSA9IHRoaXMudGltZVNjYWxlUGxheTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJwYXVzZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gdGltZVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgdGltZVNjYWxlID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgXCJmb3J3YXJkXCI6XHJcbiAgICAgICAgICAgICAgICB0aW1lU2NhbGUgKz0gMC4yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRUaW1lU2NhbGUodGltZVNjYWxlKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZvckVhY2goX2J1dHRvbiA9PiBidXR0b25zLmFwcGVuZENoaWxkKF9idXR0b24pKTtcclxuICAgICAgdGhpcy50b29sYmFyLmFwcGVuZENoaWxkKGJ1dHRvbnMpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTY2FsZVN0ZXBwZXI6IMaSdWkuQ3VzdG9tRWxlbWVudFN0ZXBwZXIgPSBuZXcgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcih7IGtleTogXCJ0aW1lU2NhbGVcIiwgbGFiZWw6IFwidGltZVNjYWxlXCIgfSk7XHJcbiAgICAgIHRpbWVTY2FsZVN0ZXBwZXIuaWQgPSBcInRpbWVzY2FsZVwiO1xyXG4gICAgICB0aW1lU2NhbGVTdGVwcGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRUaW1lU2NhbGUodGltZVNjYWxlU3RlcHBlci5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2NhbGVTdGVwcGVyKTtcclxuXHJcbiAgICAgIGxldCB0aW1lU3RlcHBlcjogxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlciA9IG5ldyDGknVpLkN1c3RvbUVsZW1lbnRTdGVwcGVyKHsga2V5OiBcInRpbWVcIiwgbGFiZWw6IFwidGltZVwiLCB2YWx1ZTogXCIwXCIgfSk7XHJcbiAgICAgIHRpbWVTdGVwcGVyLmlkID0gXCJ0aW1lXCI7XHJcbiAgICAgIHRpbWVTdGVwcGVyLnRpdGxlID0gXCJUaGUgdGltZSAoaW4gc2Vjb25kcykgb2YgdGhlIHBhcnRpY2xlIHN5c3RlbVwiO1xyXG4gICAgICB0aW1lU3RlcHBlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZSh0aW1lU3RlcHBlci5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU3RlcHBlcik7XHJcblxyXG4gICAgICBsZXQgdGltZVNsaWRlclN0ZXBzOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRpbWVTbGlkZXJTdGVwcy5pZCA9IFwidGltZXNsaWRlcnN0ZXBzXCI7XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2xpZGVyU3RlcHMpO1xyXG5cclxuICAgICAgbGV0IHRpbWVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRpbWVTbGlkZXIuaWQgPSBcInRpbWVzbGlkZXJcIjtcclxuICAgICAgdGltZVNsaWRlci50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgICB0aW1lU2xpZGVyLnZhbHVlID0gXCIwXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHRpbWVTbGlkZXIuc3RlcCA9IFwiYW55XCI7XHJcbiAgICAgIHRpbWVTbGlkZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNldFRpbWUocGFyc2VGbG9hdCh0aW1lU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZCh0aW1lU2xpZGVyKTtcclxuXHJcbiAgICAgIHRoaXMudG9vbGJhckludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNtcFBhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgICBsZXQgdGltZUluU2Vjb25kczogbnVtYmVyID0gdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lIC8gMTAwMDtcclxuICAgICAgICAgIHRpbWVTY2FsZVN0ZXBwZXIuc2V0TXV0YXRvclZhbHVlKHRoaXMuY21wUGFydGljbGVTeXN0ZW0udGltZVNjYWxlKTtcclxuICAgICAgICAgIHRpbWVTdGVwcGVyLnNldE11dGF0b3JWYWx1ZSh0aW1lSW5TZWNvbmRzKTtcclxuXHJcbiAgICAgICAgICBsZXQgZHVyYXRpb246IG51bWJlciA9IHRoaXMuY21wUGFydGljbGVTeXN0ZW0uZHVyYXRpb24gLyAxMDAwO1xyXG4gICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGltZVNsaWRlci5tYXgpICE9IGR1cmF0aW9uICogMS4xKSB7IC8vIHZhbHVlIGhhcyBjaGFuZ2VkXHJcbiAgICAgICAgICAgIHRpbWVTbGlkZXIubWF4ID0gKGR1cmF0aW9uICogMS4xKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB0aW1lU2xpZGVyU3RlcHMuaW5uZXJIVE1MID0gWzAsIDAuMjUsIDAuNSwgMC43NSwgMV1cclxuICAgICAgICAgICAgICAubWFwKF9mYWN0b3IgPT4gZHVyYXRpb24gKiBfZmFjdG9yKVxyXG4gICAgICAgICAgICAgIC5tYXAoX3ZhbHVlID0+IGA8c3BhbiBkYXRhLWxhYmVsPVwiJHtfdmFsdWUudG9GaXhlZCgyKX1cIj48L3NwYW4+YCkuam9pbihcIlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRpbWVTbGlkZXIudmFsdWUgPSB0aW1lSW5TZWNvbmRzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwIC8gMzApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VGltZShfdGltZUluU2Vjb25kczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0VGltZVNjYWxlKDApO1xyXG4gICAgICB0aGlzLmNtcFBhcnRpY2xlU3lzdGVtLnRpbWUgPSBfdGltZUluU2Vjb25kcyAqIDEwMDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUaW1lU2NhbGUoX3RpbWVTY2FsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIF90aW1lU2NhbGUgPSBwYXJzZUZsb2F0KF90aW1lU2NhbGUudG9GaXhlZCgxNSkpOyAvLyByb3VuZCBzbyBmb3J3YXJkIGFuZCBiYWNrd2FyZCBidXR0b24gZG9uJ3QgbWlzcyB6ZXJvXHJcbiAgICAgIGlmIChfdGltZVNjYWxlICE9IDApXHJcbiAgICAgICAgdGhpcy50aW1lU2NhbGVQbGF5ID0gX3RpbWVTY2FsZTtcclxuICAgICAgdGhpcy5jbXBQYXJ0aWNsZVN5c3RlbS50aW1lU2NhbGUgPSBfdGltZVNjYWxlO1xyXG5cclxuICAgICAgbGV0IHBsYXlCdXR0b246IEVsZW1lbnQgPSB0aGlzLnRvb2xiYXIucXVlcnlTZWxlY3RvcihcIiNwbGF5XCIpIHx8IHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BhdXNlXCIpO1xyXG4gICAgICBwbGF5QnV0dG9uLmlkID0gX3RpbWVTY2FsZSA9PSAwID8gXCJwbGF5XCIgOiBcInBhdXNlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBzZXRQYXJ0aWNsZVN5c3RlbShfcGFydGljbGVTeXN0ZW06IMaSLlBhcnRpY2xlU3lzdGVtKTogdm9pZCB7XHJcbiAgICAgIGlmICghX3BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnRyZWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJEcm9wIGEgbm9kZSB3aXRoIGFuIGF0dGFjaGVkIHBhcnRpY2xlIHN5c3RlbSBoZXJlIHRvIGVkaXRcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBfcGFydGljbGVTeXN0ZW07XHJcbiAgICAgIHRoaXMuZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX3BhcnRpY2xlU3lzdGVtLmRhdGEpKTsgLy8gd2Ugd2lsbCB3b3JrIHdpdGggYSBjb3B5XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUodGhpcy5wYXJ0aWNsZVN5c3RlbS5uYW1lKTtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy52YXJpYWJsZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGF0YWxpc3RcIik7XHJcbiAgICAgIHRoaXMudmFyaWFibGVzLmlkID0gXCJ2YXJpYWJsZXNcIjtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy52YXJpYWJsZXMpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hWYXJpYWJsZXMoKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50b29sYmFyKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJUcmVlUGFydGljbGVTeXN0ZW0odGhpcy5kYXRhLCB0aGlzKTtcclxuICAgICAgdGhpcy50cmVlID0gbmV3IMaSdWkuVHJlZTzGki5QYXJ0aWNsZURhdGEuUmVjdXJzaXZlPih0aGlzLmNvbnRyb2xsZXIsIHRoaXMuZGF0YSk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUkVOQU1FLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5EUk9QLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy50cmVlLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNVVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuUEFTVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkVYUEFORCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMudHJlZS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50cmVlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBg4pePIFJpZ2h0IGNsaWNrIG9uIFwiJHvGki5QYXJ0aWNsZVN5c3RlbS5uYW1lfVwiIHRvIGFkZCBwcm9wZXJ0aWVzLlxcbuKXjyBSaWdodCBjbGljayBvbiBwcm9wZXJ0aWVzIHRvIGFkZCB0cmFuc2Zvcm1hdGlvbnMvZXhwcmVzc2lvbnMuXFxu4pePIFJpZ2h0IGNsaWNrIG9uIHRyYW5zZm9ybWF0aW9ucy9leHByZXNzaW9ucyB0byBhZGQgZXhwcmVzc2lvbnMuXFxu4pePIFVzZSBDb3B5L0N1dC9QYXN0ZSB0byBkdXBsaWNhdGUgZGF0YS5gO1xyXG4gICAgICB0aGlzLnRyZWUudGl0bGUgPSB0aGlzLmRvbS50aXRsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlRGF0YShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSk6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdIHtcclxuICAgICAgbGV0IGludmFsaWQ6IFvGki5QYXJ0aWNsZURhdGEuRXhwcmVzc2lvbiwgc3RyaW5nXVtdID0gW107XHJcbiAgICAgIHZhbGlkYXRlUmVjdXJzaXZlKF9kYXRhKTtcclxuICAgICAgcmV0dXJuIGludmFsaWQ7XHJcblxyXG4gICAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlY3Vyc2l2ZShfZGF0YTogxpIuUGFydGljbGVEYXRhLlJlY3Vyc2l2ZSwgX3BhdGg6IHN0cmluZ1tdID0gW10pOiB2b2lkIHtcclxuICAgICAgICBpZiAoxpIuUGFydGljbGVEYXRhLmlzRnVuY3Rpb24oX2RhdGEpKSB7XHJcbiAgICAgICAgICBsZXQgbWluUGFyYW1ldGVyczogbnVtYmVyID0gxpIuUGFydGljbGVEYXRhLkZVTkNUSU9OX01JTklNVU1fUEFSQU1FVEVSU1tfZGF0YS5mdW5jdGlvbl07XHJcbiAgICAgICAgICBpZiAoX2RhdGEucGFyYW1ldGVycy5sZW5ndGggPCDGki5QYXJ0aWNsZURhdGEuRlVOQ1RJT05fTUlOSU1VTV9QQVJBTUVURVJTW19kYXRhLmZ1bmN0aW9uXSkge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3I6IHN0cmluZyA9IGBcIiR7X3BhdGguam9pbihcIi9cIil9LyR7X2RhdGEuZnVuY3Rpb259XCIgbmVlZHMgYXQgbGVhc3QgJHttaW5QYXJhbWV0ZXJzfSBwYXJhbWV0ZXJzYDtcclxuICAgICAgICAgICAgaW52YWxpZC5wdXNoKFtfZGF0YSwgZXJyb3JdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKMaSLlBhcnRpY2xlRGF0YS5pc0Z1bmN0aW9uKF9kYXRhKSA/IF9kYXRhLnBhcmFtZXRlcnMgOiBfZGF0YSkuZm9yRWFjaCgoW19rZXksIF92YWx1ZV0pID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgX3ZhbHVlID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIHZhbGlkYXRlUmVjdXJzaXZlKF92YWx1ZSwgX3BhdGguY29uY2F0KF9rZXkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW5hYmxlU2F2ZShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgcmVtb3RlLk1lbnUuZ2V0QXBwbGljYXRpb25NZW51KCkuZ2V0TWVudUl0ZW1CeUlkKE1FTlUuUFJPSkVDVF9TQVZFKS5lbmFibGVkID0gX29uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaFZhcmlhYmxlcygpOiB2b2lkIHtcclxuICAgICAgbGV0IG9wdGlvbnM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoxpIuUGFydGljbGVEYXRhLlBSRURFRklORURfVkFSSUFCTEVTKTtcclxuICAgICAgaWYgKHRoaXMuZGF0YS52YXJpYWJsZXMpXHJcbiAgICAgICAgb3B0aW9ucy5wdXNoKC4uLnRoaXMuZGF0YS52YXJpYWJsZU5hbWVzKTtcclxuICAgICAgdGhpcy52YXJpYWJsZXMuaW5uZXJIVE1MID0gb3B0aW9ucy5tYXAoX25hbWUgPT4gYDxvcHRpb24gdmFsdWU9XCIke19uYW1lfVwiPmApLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgYW5kIGVkaXQgdGhlIGFuaW1hdGFibGUgcHJvcGVydGllcyBvZiBhIG5vZGUgd2l0aCBhbiBhdHRhY2hlZCBjb21wb25lbnQgYW5pbWF0aW9uLlxyXG4gICAqIEBhdXRob3JzIEx1a2FzIFNjaGV1ZXJsZSwgSEZVLCAyMDE5IHwgSm9uYXMgUGxvdHpreSwgSEZVLCAyMDIyIHwgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0FuaW1hdGlvbiBleHRlbmRzIFZpZXcge1xyXG4gICAgcHVibGljIGtleVNlbGVjdGVkOiDGki5BbmltYXRpb25LZXk7XHJcbiAgICBwcml2YXRlIG5vZGU6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIGNtcEFuaW1hdG9yOiDGki5Db21wb25lbnRBbmltYXRvcjtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiDGki5BbmltYXRpb247XHJcbiAgICBwcml2YXRlIHBsYXliYWNrVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHByb3BlcnR5TGlzdDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNvbnRyb2xsZXI6IENvbnRyb2xsZXJBbmltYXRpb247XHJcblxyXG4gICAgcHJpdmF0ZSB0b29sYmFyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgZnJhbWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHRpbWU6IMaSLlRpbWUgPSBuZXcgxpIuVGltZSgpO1xyXG4gICAgcHJpdmF0ZSBpZEludGVydmFsOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuICAgICAgdGhpcy5zZXRBbmltYXRpb24obnVsbCk7XHJcbiAgICAgIHRoaXMuY3JlYXRlVG9vbGJhcigpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuREVMRVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5JTlBVVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5GT0NVU19JTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBpZiAoIShfdmlld1NvdXJjZSBpbnN0YW5jZW9mIFZpZXdIaWVyYXJjaHkpIHx8ICEoc291cmNlIGluc3RhbmNlb2YgxpIuTm9kZSkgfHwgIXNvdXJjZS5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb24pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IDzGki5Ob2RlPnNvdXJjZSB9IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBjb250ZXh0IG1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm5vZGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICAgIGxhYmVsOiBcIkFkZCBQcm9wZXJ0eVwiLFxyXG4gICAgICAgICAgc3VibWVudTogdGhpcy5nZXROb2RlU3VibWVudSh0aGlzLm5vZGUsIHBhdGgsIF9jYWxsYmFjaylcclxuICAgICAgICB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJEZWxldGUgUHJvcGVydHlcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5ERUxFVEVfUFJPUEVSVFkpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiQ29udmVydCB0byBBbmltYXRpb25cIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DT05WRVJUX0FOSU1BVElPTiksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkNcIiB9KTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBjaG9pY2U6IENPTlRFWFRNRU5VID0gTnVtYmVyKF9pdGVtLmlkKTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9QUk9QRVJUWTpcclxuICAgICAgICAgIC8vIGRlZmluZWQgaW4gZ2V0TXV0YXRvclN1Ym1lbnUsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG9ubHkgd2F5IHRvIGtlZXAgdGhlIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoZSBtZW51IGl0ZW0sIGF0dGFjaGluZyBhbnl0aGluZyB0byBpdGVtXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkRFTEVURV9QUk9QRVJUWTpcclxuICAgICAgICAgIGlmICghKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHJldHVybjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kZWxldGVQcm9wZXJ0eShkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaXN0KCk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ09OVkVSVF9BTklNQVRJT046XHJcbiAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gaW5zdGFuY2VvZiDGki5BbmltYXRpb25TcHJpdGUpIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbjogxpIuQW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb24uY29udmVydFRvQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuaW1hdGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE5vZGVTdWJtZW51KF9ub2RlOiDGki5Ob2RlLCBfcGF0aDogc3RyaW5nW10sIF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGZvciAoY29uc3QgY29tcG9uZW50Q2xhc3Mgb2YgxpIuQ29tcG9uZW50LnN1YmNsYXNzZXMpIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBfbm9kZS5nZXRDb21wb25lbnRzKGNvbXBvbmVudENsYXNzKS5mb3JFYWNoKChfY29tcG9uZW50LCBfaW5kZXgpID0+IHsgLy8gd2UgbmVlZCB0byBnZXQgdGhlIGF0dGFjaGVkIGNvbXBvbm5lbnRzIGFzIGFycmF5IHNvIHdlIGNhbiByZWNvbnN0dWN0IHRoZWlyIHBhdGhcclxuICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICAgIHBhdGgucHVzaChcImNvbXBvbmVudHNcIik7XHJcbiAgICAgICAgICBwYXRoLnB1c2goX2NvbXBvbmVudC50eXBlKTtcclxuICAgICAgICAgIHBhdGgucHVzaChfaW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9jb21wb25lbnQuZ2V0TXV0YXRvckZvckFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgaWYgKG11dGF0b3IgJiYgT2JqZWN0LmtleXMobXV0YXRvcikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgICAgIHsgbGFiZWw6IF9jb21wb25lbnQudHlwZSwgc3VibWVudTogdGhpcy5nZXRNdXRhdG9yU3VibWVudShtdXRhdG9yLCBwYXRoLCBfY2FsbGJhY2spIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgX25vZGUuZ2V0Q2hpbGRyZW4oKSkge1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICBwYXRoLnB1c2goXCJjaGlsZHJlblwiKTtcclxuICAgICAgICBwYXRoLnB1c2goY2hpbGQubmFtZSk7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgeyBsYWJlbDogY2hpbGQubmFtZSwgc3VibWVudTogdGhpcy5nZXROb2RlU3VibWVudShjaGlsZCwgcGF0aCwgX2NhbGxiYWNrKSB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRNdXRhdG9yU3VibWVudShfbXV0YXRvcjogxpIuTXV0YXRvciwgX3BhdGg6IHN0cmluZ1tdLCBfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEVsZWN0cm9uLk1lbnVJdGVtO1xyXG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIF9wYXRoKTtcclxuICAgICAgICBwYXRoLnB1c2gocHJvcGVydHkpO1xyXG4gICAgICAgIGlmIChfbXV0YXRvcltwcm9wZXJ0eV0/LmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcclxuICAgICAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKFxyXG4gICAgICAgICAgICB7IGxhYmVsOiBwcm9wZXJ0eSwgc3VibWVudTogdGhpcy5nZXRNdXRhdG9yU3VibWVudShfbXV0YXRvcltwcm9wZXJ0eV0sIHBhdGgsIF9jYWxsYmFjaykgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBsYWJlbDogcHJvcGVydHksIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX1BST1BFUlRZKSwgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hZGRQcm9wZXJ0eShwYXRoLCB0aGlzLm5vZGUsIHRoaXMucGxheWJhY2tUaW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVG9vbGJhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy50b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy50b29sYmFyLmlkID0gXCJ0b29sYmFyXCI7XHJcblxyXG4gICAgICBbXCJwcmV2aW91c1wiLCBcInBsYXlcIiwgXCJuZXh0XCJdXHJcbiAgICAgICAgLm1hcChfaWQgPT4ge1xyXG4gICAgICAgICAgbGV0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgYnV0dG9uLmlkID0gX2lkO1xyXG4gICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IFwiYnV0dG9uSWNvblwiO1xyXG4gICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSB0aGlzLmhuZFRvb2xiYXJDbGljaztcclxuICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaChfYnV0dG9uID0+IHRoaXMudG9vbGJhci5hcHBlbmRDaGlsZChfYnV0dG9uKSk7XHJcblxyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuZnJhbWVJbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0Lm1pbiA9IFwiMFwiO1xyXG4gICAgICB0aGlzLmZyYW1lSW5wdXQuaWQgPSBcImZyYW1laW5wdXRcIjtcclxuICAgICAgdGhpcy5mcmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoX2V2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSBOdW1iZXIucGFyc2VJbnQodGhpcy5mcmFtZUlucHV0LnZhbHVlKSAqIDEwMDAgLyB0aGlzLmFuaW1hdGlvbi5mcHM7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRvb2xiYXIuYXBwZW5kQ2hpbGQodGhpcy5mcmFtZUlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgaW5zdGFuY2VvZiDGki5BbmltYXRpb25LZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTZWxlY3RlZCA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gX2V2ZW50LmRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNtcEFuaW1hdG9yID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRBbmltYXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUgPSB0aGlzLmdldENvbnRleHRNZW51KHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY21wQW5pbWF0b3I/LmFuaW1hdGlvbiAhPSB0aGlzLmFuaW1hdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbih0aGlzLmNtcEFuaW1hdG9yPy5hbmltYXRpb24pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuTU9ESUZZOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubXV0YWJsZSBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEFuaW1hdG9yKSB7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaGVkIGFuaW1hdGlvbiBpbiBhIENvbXBvbmVudEFuaW1hdG9yXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgPT0gX2V2ZW50LmRldGFpbC5tdXRhYmxlLm5vZGUpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBub2RlOiBfZXZlbnQuZGV0YWlsLm11dGFibGUubm9kZSB9IH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIShfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uIHx8IF9ldmVudC5kZXRhaWwudmlldyBpbnN0YW5jZW9mIFZpZXdBbmltYXRpb25TaGVldCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3QW5pbWF0aW9uU2hlZXQpXHJcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuXHJcbiAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLmZyYW1lSW5wdXQudmFsdWUgPSAoTWF0aC50cnVuYyh0aGlzLnBsYXliYWNrVGltZSAvIDEwMDAgKiB0aGlzLmFuaW1hdGlvbi5mcHMpKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgbGV0IG5vZGVNdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5jbXBBbmltYXRvcj8udXBkYXRlQW5pbWF0aW9uKHRoaXMucGxheWJhY2tUaW1lKSB8fCB7fTtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlcj8udXBkYXRlKG5vZGVNdXRhdG9yLCB0aGlzLnBsYXliYWNrVGltZSk7XHJcbiAgICAgICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuSU5QVVQ6XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULkZPQ1VTX0lOOlxyXG4gICAgICAgICAgbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiDGknVpLkN1c3RvbUVsZW1lbnREaWdpdClcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgxpJ1aS5DdXN0b21FbGVtZW50U3RlcHBlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIudXBkYXRlU2VxdWVuY2UodGhpcy5wbGF5YmFja1RpbWUsIHRhcmdldCwgX2V2ZW50LnR5cGUgPT0gxpJ1aS5FVkVOVC5JTlBVVCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc2V0QW5pbWF0aW9uKF9hbmltYXRpb246IMaSLkFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICBpZiAoX2FuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpc3QoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIkRyb3AgYSBub2RlIHdpdGggYW4gYXR0YWNoZWQgYW5pbWF0aW9uIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eUxpc3QoKTogdm9pZCB7XHJcbiAgICAgIGxldCBub2RlTXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMuYW5pbWF0aW9uLmdldFN0YXRlKHRoaXMucGxheWJhY2tUaW1lLCAwLCB0aGlzLmNtcEFuaW1hdG9yLnF1YW50aXphdGlvbikgfHwge307XHJcblxyXG4gICAgICBsZXQgbmV3UHJvcGVydHlMaXN0OiBIVE1MRGl2RWxlbWVudCA9IMaSdWkuR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKG5vZGVNdXRhdG9yKTtcclxuICAgICAgaWYgKHRoaXMuZG9tLmNvbnRhaW5zKHRoaXMucHJvcGVydHlMaXN0KSlcclxuICAgICAgICB0aGlzLmRvbS5yZXBsYWNlQ2hpbGQobmV3UHJvcGVydHlMaXN0LCB0aGlzLnByb3BlcnR5TGlzdCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdQcm9wZXJ0eUxpc3QpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdCA9IG5ld1Byb3BlcnR5TGlzdDtcclxuICAgICAgdGhpcy5wcm9wZXJ0eUxpc3QuaWQgPSBcInByb3BlcnR5bGlzdFwiO1xyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJBbmltYXRpb24odGhpcy5hbmltYXRpb24sIHRoaXMucHJvcGVydHlMaXN0LCB0aGlzKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnVwZGF0ZShub2RlTXV0YXRvcik7XHJcbiAgICAgIC8vIMaSdWktRVZFTlQgbXVzdCBub3QgYmUgZGlzcGF0Y2hlZCFcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJ1aS5FVkVOVC5DTElDSykpO1xyXG4gICAgICB0aGlzLnByb3BlcnR5TGlzdC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVF9FRElUT1IuTU9ESUZZKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMucGxheWJhY2tUaW1lIH0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb29sYmFyQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKHRhcmdldC5pZCkge1xyXG4gICAgICAgIGNhc2UgXCJwcmV2aW91c1wiOlxyXG4gICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLmNvbnRyb2xsZXIubmV4dEtleSh0aGlzLnBsYXliYWNrVGltZSwgXCJiYWNrd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXlcIjpcclxuICAgICAgICAgIGlmICh0aGlzLmlkSW50ZXJ2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0YXJnZXQuaWQgPSBcInBhdXNlXCI7XHJcbiAgICAgICAgICAgIHRoaXMudGltZS5zZXQodGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy50aW1lLmdldCgpICUgdGhpcy5hbmltYXRpb24udG90YWxUaW1lO1xyXG4gICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDAwIC8gdGhpcy5hbmltYXRpb24uZnBzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJwYXVzZVwiOlxyXG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm5leHRcIjpcclxuICAgICAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5jb250cm9sbGVyLm5leHRLZXkodGhpcy5wbGF5YmFja1RpbWUsIFwiZm9yd2FyZFwiKTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYXVzZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaWRJbnRlcnZhbCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgIHRoaXMudG9vbGJhci5xdWVyeVNlbGVjdG9yKFwiI3BhdXNlXCIpLmlkID0gXCJwbGF5XCI7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIGVudW0gU0hFRVRfTU9ERSB7XHJcbiAgICBET1BFID0gXCJEb3Blc2hlZXRcIixcclxuICAgIENVUlZFUyA9IFwiQ3VydmVzXCJcclxuICB9XHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgVmlld0FuaW1hdGlvblNlcXVlbmNlIHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvblNlcXVlbmNlO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBWaWV3QW5pbWF0aW9uS2V5IHtcclxuICAgIGRhdGE6IMaSLkFuaW1hdGlvbktleTtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBwYXRoMkQ6IFBhdGgyRDtcclxuICAgIHR5cGU6IFwia2V5XCI7XHJcbiAgfVxyXG5cclxuICBpbnRlcmZhY2UgVmlld0FuaW1hdGlvbkV2ZW50IHsgLy8gbGFiZWxzIGFuZCBldmVudHMgYXJlIGltcGxlbWVudGVkIGFsbW9zdCB0aGUgc2FtZSB3YXlcclxuICAgIGRhdGE6IHN0cmluZztcclxuICAgIHBhdGgyRDogUGF0aDJEO1xyXG4gICAgdHlwZTogXCJldmVudFwiIHwgXCJsYWJlbFwiO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyBhbmQgZWRpdCBhbmltYXRpb24gc2VxdWVuY2VzLCBhbmltYXRpb24ga2V5cyBhbmQgY3VydmVzIGNvbm5lY3RpbmcgdGhlbS5cclxuICAgKiBAYXV0aG9ycyBMdWthcyBTY2hldWVybGUsIEhGVSwgMjAxOSB8IEpvbmFzIFBsb3R6a3ksIEhGVSwgMjAyMlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3QW5pbWF0aW9uU2hlZXQgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEtFWV9TSVpFOiBudW1iZXIgPSA2OyAvLyB3aWR0aCBhbmQgaGVpZ2h0IGluIHB4XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUSU1FTElORV9IRUlHSFQ6IG51bWJlciA9IDMwLjU7IC8vIGluIHB4LCBrZWVwIC41IGF0IGVuZCBmb3Igb2RkIGxpbmUgd2lkdGhcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVWRU5UU19IRUlHSFQ6IG51bWJlciA9IDMwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU0NBTEVfV0lEVEg6IG51bWJlciA9IDQwOyAvLyBpbiBweFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUElYRUxfUEVSX01JTExJU0VDT05EOiBudW1iZXIgPSAxOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBJWEVMX1BFUl9WQUxVRTogbnVtYmVyID0gMTAwOyAvLyBhdCBzY2FsaW5nIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IE1JTklNVU1fUElYRUxfUEVSX1NURVA6IG51bWJlciA9IDYwOyAvLyBhdCBhbnkgc2NhbGluZywgZm9yIGJvdGggeCBhbmQgeVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU1RBTkRBUkRfQU5JTUFUSU9OX0xFTkdUSDogbnVtYmVyID0gMTAwMDsgLy8gaW4gbWlsaXNlY29uZHMsIHVzZWQgd2hlbiBhbmltYXRpb24gbGVuZ3RoIGlzIGZhbHN5XHJcblxyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IMaSLkFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgcGxheWJhY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICBwcml2YXRlIGNyYzI6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHByaXZhdGUgZXZlbnRJbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHByaXZhdGUgc2Nyb2xsQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwcml2YXRlIHNjcm9sbEJvZHk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHByaXZhdGUgbXR4V29ybGRUb1NjcmVlbjogxpIuTWF0cml4M3gzID0gbmV3IMaSLk1hdHJpeDN4MygpO1xyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRLZXk6IFZpZXdBbmltYXRpb25LZXk7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkRXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudDtcclxuICAgIHByaXZhdGUga2V5czogVmlld0FuaW1hdGlvbktleVtdID0gW107XHJcbiAgICBwcml2YXRlIHNlcXVlbmNlczogVmlld0FuaW1hdGlvblNlcXVlbmNlW10gPSBbXTtcclxuICAgIHByaXZhdGUgZXZlbnRzOiBWaWV3QW5pbWF0aW9uRXZlbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzbG9wZUhvb2tzOiBQYXRoMkRbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgZG9jdW1lbnRTdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NQYW5TdGFydDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKCk7XHJcbiAgICBwcml2YXRlIHBvc1JpZ2h0Q2xpY2s6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMigpO1xyXG5cclxuICAgICNtb2RlOiBTSEVFVF9NT0RFO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBtYXliZSB1c2UgdGhpcyBzb2x1dGlvbiBmb3IgYWxsIHZpZXdzP1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaW5zZXQgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICAgIHRoaXMuZG9tLnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcclxuICAgICAgdGhpcy5kb20uc3R5bGUubWFyZ2luID0gXCIwLjVlbVwiO1xyXG4gICAgICB0aGlzLmRvbS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcblxyXG4gICAgICB0aGlzLm1vZGUgPSBTSEVFVF9NT0RFLkRPUEU7XHJcblxyXG4gICAgICBfY29udGFpbmVyLm9uKFwicmVzaXplXCIsICgpID0+IHRoaXMuZHJhdyh0cnVlKSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnVTaGVldCk7XHJcblxyXG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1ggPSBcInNjcm9sbFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiaW5zdGFudFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJkb3duID0gdGhpcy5obmRQb2ludGVyRG93bjtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVydXAgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybGVhdmUgPSB0aGlzLmhuZFBvaW50ZXJVcDtcclxuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub253aGVlbCA9IHRoaXMuaG5kV2hlZWw7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQ29udGFpbmVyKTtcclxuXHJcbiAgICAgIHRoaXMuc2Nyb2xsQm9keS5zdHlsZS5oZWlnaHQgPSBcIjFweFwiO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbEJvZHkpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudElucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRJbnB1dC5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImV2ZW50XCIpIHtcclxuICAgICAgICAgIGxldCB0aW1lOiBudW1iZXIgPSB0aGlzLmFuaW1hdGlvbi5ldmVudHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ucmVtb3ZlRXZlbnQodGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24uc2V0RXZlbnQodGhpcy5ldmVudElucHV0LnZhbHVlLCB0aW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV07XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5hbmltYXRpb24ubGFiZWxzW3RoaXMuc2VsZWN0ZWRFdmVudC5kYXRhXTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmxhYmVsc1t0aGlzLmV2ZW50SW5wdXQudmFsdWVdID0gdGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGEgPSB0aGlzLmV2ZW50SW5wdXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZXZlbnRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgbW9kZSgpOiBTSEVFVF9NT0RFIHtcclxuICAgICAgcmV0dXJuIHRoaXMuI21vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgbW9kZShfbW9kZTogU0hFRVRfTU9ERSkge1xyXG4gICAgICB0aGlzLiNtb2RlID0gX21vZGU7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoX21vZGUpO1xyXG4gICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIGNvbnRleHQgbWVudVxyXG4gICAgcHJvdGVjdGVkIG9wZW5Db250ZXh0TWVudVNoZWV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5pdGVtcy5mb3JFYWNoKF9pdGVtID0+IF9pdGVtLnZpc2libGUgPSBmYWxzZSk7XHJcbiAgICAgIGlmICh0aGlzLnBvc1JpZ2h0Q2xpY2sueSA+IFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgJiYgdGhpcy5wb3NSaWdodENsaWNrLnkgPCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpIHsgLy8gY2xpY2sgb24gZXZlbnRzXHJcbiAgICAgICAgbGV0IGRlbGV0ZUV2ZW50OiBWaWV3QW5pbWF0aW9uRXZlbnQgPVxyXG4gICAgICAgICAgdGhpcy5ldmVudHMuZmluZChfb2JqZWN0ID0+IHRoaXMuY3JjMi5pc1BvaW50SW5QYXRoKF9vYmplY3QucGF0aDJELCB0aGlzLnBvc1JpZ2h0Q2xpY2sueCwgdGhpcy5wb3NSaWdodENsaWNrLnkpKTtcclxuICAgICAgICBpZiAoZGVsZXRlRXZlbnQpIHtcclxuICAgICAgICAgIGlmIChkZWxldGVFdmVudC50eXBlID09IFwiZXZlbnRcIilcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJEZWxldGUgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgUmVmbGVjdC5zZXQodGhpcy5jb250ZXh0TWVudSwgXCJ0YXJnZXRFdmVudFwiLCBkZWxldGVFdmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiQWRkIExhYmVsXCIpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoXCJBZGQgRXZlbnRcIikudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBSZWZsZWN0LnNldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIiwgdGhpcy5zY3JlZW5Ub1RpbWUodGhpcy5wb3NSaWdodENsaWNrLngpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucG9zUmlnaHRDbGljay55ID4gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IHRoaXMua2V5cy5maW5kKF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIHRoaXMucG9zUmlnaHRDbGljay54LCB0aGlzLnBvc1JpZ2h0Q2xpY2sueSkpO1xyXG4gICAgICAgIGlmICh0YXJnZXRLZXkpIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFwiRGVsZXRlIEtleVwiKS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIFJlZmxlY3Quc2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIsIHRhcmdldEtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0TWVudUl0ZW1CeUlkKFNIRUVUX01PREUuRE9QRSkudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkRPUEU7XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChTSEVFVF9NT0RFLkNVUlZFUykudmlzaWJsZSA9IHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoX2V2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29udGV4dE1lbnUoX2NhbGxiYWNrOiBDb250ZXh0TWVudUNhbGxiYWNrKTogRWxlY3Ryb24uTWVudSB7XHJcbiAgICAgIGNvbnN0IG1lbnU6IEVsZWN0cm9uLk1lbnUgPSBuZXcgcmVtb3RlLk1lbnUoKTtcclxuXHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5ET1BFLCBsYWJlbDogU0hFRVRfTU9ERS5ET1BFLCBjbGljazogKCkgPT4gdGhpcy5tb2RlID0gU0hFRVRfTU9ERS5ET1BFIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogU0hFRVRfTU9ERS5DVVJWRVMsIGxhYmVsOiBTSEVFVF9NT0RFLkNVUlZFUywgY2xpY2s6ICgpID0+IHRoaXMubW9kZSA9IFNIRUVUX01PREUuQ1VSVkVTIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJBZGQgRXZlbnRcIiwgbGFiZWw6IFwiQWRkIEV2ZW50XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBFdmVudFwiLCBsYWJlbDogXCJEZWxldGUgRXZlbnRcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgaWQ6IFwiQWRkIExhYmVsXCIsIGxhYmVsOiBcIkFkZCBMYWJlbFwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBpZDogXCJEZWxldGUgTGFiZWxcIiwgbGFiZWw6IFwiRGVsZXRlIExhYmVsXCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGlkOiBcIkRlbGV0ZSBLZXlcIiwgbGFiZWw6IFwiRGVsZXRlIEtleVwiLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgY2hvaWNlOiBzdHJpbmcgPSBfaXRlbS5pZDtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG5cclxuICAgICAgbGV0IHRhcmdldEtleTogVmlld0FuaW1hdGlvbktleSA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0S2V5XCIpO1xyXG4gICAgICBsZXQgdGFyZ2V0RXZlbnQ6IFZpZXdBbmltYXRpb25FdmVudCA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGV4dE1lbnUsIFwidGFyZ2V0RXZlbnRcIik7XHJcbiAgICAgIGxldCB0YXJnZXRUaW1lOiBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRleHRNZW51LCBcInRhcmdldFRpbWVcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgIGNhc2UgXCJBZGQgRXZlbnRcIjpcclxuICAgICAgICAgIGxldCBldmVudE5hbWU6IHN0cmluZyA9IGAke3RoaXMuYW5pbWF0aW9uLm5hbWV9RXZlbnQke09iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9uLmV2ZW50cykubGVuZ3RofWA7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudChldmVudE5hbWUsIHRhcmdldFRpbWUpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBldmVudE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJldmVudFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgRXZlbnRcIjpcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50KHRhcmdldEV2ZW50LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQWRkIExhYmVsXCI6XHJcbiAgICAgICAgICBsZXQgbGFiZWxOYW1lOiBzdHJpbmcgPSBgJHt0aGlzLmFuaW1hdGlvbi5uYW1lfUxhYmVsJHtPYmplY3Qua2V5cyh0aGlzLmFuaW1hdGlvbi5ldmVudHMpLmxlbmd0aH1gO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsTmFtZV0gPSB0YXJnZXRUaW1lO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0geyBkYXRhOiBsYWJlbE5hbWUsIHBhdGgyRDogbnVsbCwgdHlwZTogXCJsYWJlbFwiIH07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgTGFiZWxcIjpcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGFyZ2V0RXZlbnQuZGF0YV07XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEZWxldGUgS2V5XCI6XHJcbiAgICAgICAgICBsZXQgc2VxdWVuY2U6IMaSLkFuaW1hdGlvblNlcXVlbmNlID0gdGhpcy5zZXF1ZW5jZXMuZmluZChfc2VxdWVuY2UgPT4gX3NlcXVlbmNlLmRhdGEuZ2V0S2V5cygpLmluY2x1ZGVzKHRhcmdldEtleS5kYXRhKSkuZGF0YTtcclxuICAgICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIMaSLkRlYnVnLndhcm4oXCJPbmx5IG9uZSBrZXkgbGVmdCBpbiBzZXF1ZW5jZS4gRGVsZXRlIHByb3BlcnR5IGluc3RlYWQuXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlcXVlbmNlLnJlbW92ZUtleSh0YXJnZXRLZXkuZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24gZHJhd2luZ1xyXG4gICAgcHJpdmF0ZSBkcmF3KF9zY3JvbGw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuZG9tLmNsaWVudFdpZHRoO1xyXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRvbS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb247XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLm1pbihWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgsIHRyYW5zbGF0aW9uLngpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVLZXlzKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGltZWxpbmUoKTtcclxuICAgICAgICB0aGlzLmRyYXdFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmRyYXdTY2FsZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0N1cnZlcygpO1xyXG4gICAgICAgIHRoaXMuZHJhd0tleXMoKTtcclxuICAgICAgICB0aGlzLmRyYXdDdXJzb3IoKTtcclxuICAgICAgICB0aGlzLmRyYXdIaWdobGlnaHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9zY3JvbGwpIHtcclxuICAgICAgICBsZXQgbGVmdFdpZHRoOiBudW1iZXIgPSAtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEg7XHJcbiAgICAgICAgbGV0IHNjcmVlbldpZHRoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy53aWR0aCArIGxlZnRXaWR0aDtcclxuICAgICAgICBsZXQgYW5pbWF0aW9uV2lkdGg6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uPy50b3RhbFRpbWUgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIICogMjtcclxuICAgICAgICB0aGlzLnNjcm9sbEJvZHkuc3R5bGUud2lkdGggPSBgJHtNYXRoLm1heChhbmltYXRpb25XaWR0aCwgc2NyZWVuV2lkdGgpfXB4YDtcclxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gbGVmdFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUtleXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMua2V5cyA9IHRoaXMuc2VxdWVuY2VzLmZsYXRNYXAoKF9zZXF1ZW5jZSwgX2lTZXF1ZW5jZSkgPT5cclxuICAgICAgICBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkubWFwKChfa2V5KSA9PiB7XHJcbiAgICAgICAgICBsZXQgdmlld0tleTogVmlld0FuaW1hdGlvbktleSA9IHtcclxuICAgICAgICAgICAgZGF0YTogX2tleSxcclxuICAgICAgICAgICAgY29sb3I6IF9zZXF1ZW5jZS5jb2xvcixcclxuICAgICAgICAgICAgcGF0aDJEOiB0aGlzLmdlbmVyYXRlS2V5KFxyXG4gICAgICAgICAgICAgIHRoaXMud29ybGRUb1NjcmVlblBvaW50KF9rZXkudGltZSwgdGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTID8gX2tleS52YWx1ZSA6IF9pU2VxdWVuY2UgKiBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgKiA0KSxcclxuICAgICAgICAgICAgICBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsXHJcbiAgICAgICAgICAgICAgVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIHR5cGU6IFwia2V5XCJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gdmlld0tleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEtleSlcclxuICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEtleS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlS2V5KF9wb3NpdGlvbjogxpIuVmVjdG9yMiwgX3c6IG51bWJlciwgX2g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgIGxldCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIHBhdGgubW92ZVRvKF9wb3NpdGlvbi54IC0gX3csIF9wb3NpdGlvbi55KTtcclxuICAgICAgcGF0aC5saW5lVG8oX3Bvc2l0aW9uLngsIF9wb3NpdGlvbi55ICsgX2gpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhfcG9zaXRpb24ueCArIF93LCBfcG9zaXRpb24ueSk7XHJcbiAgICAgIHBhdGgubGluZVRvKF9wb3NpdGlvbi54LCBfcG9zaXRpb24ueSAtIF9oKTtcclxuICAgICAgcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3VGltZWxpbmUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItYmFja2dyb3VuZC1tYWluXCIpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQpO1xyXG5cclxuICAgICAgbGV0IGFuaW1hdGlvblN0YXJ0OiBudW1iZXIgPSBNYXRoLm1pbiguLi50aGlzLmtleXMubWFwKF9rZXkgPT4gX2tleS5kYXRhLnRpbWUpKSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnggKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueDtcclxuICAgICAgbGV0IGFuaW1hdGlvbkVuZDogbnVtYmVyID0gTWF0aC5tYXgoLi4udGhpcy5rZXlzLm1hcChfa2V5ID0+IF9rZXkuZGF0YS50aW1lKSkgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLng7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAxMDAsIDI1NSwgMC4yKVwiO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFJlY3QoYW5pbWF0aW9uU3RhcnQsIDAsIGFuaW1hdGlvbkVuZCAtIGFuaW1hdGlvblN0YXJ0LCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVUbyh0aGlzLmNhbnZhcy53aWR0aCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgbGV0IGZwczogbnVtYmVyID0gdGhpcy5hbmltYXRpb24uZnBzO1xyXG4gICAgICBsZXQgcGl4ZWxQZXJGcmFtZTogbnVtYmVyID0gKDEwMDAgKiBWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX01JTExJU0VDT05EKSAvIGZwcztcclxuICAgICAgbGV0IHBpeGVsUGVyU3RlcDogbnVtYmVyID0gcGl4ZWxQZXJGcmFtZSAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLng7XHJcbiAgICAgIGxldCBmcmFtZXNQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgLy8gVE9ETzogZmluZCBhIHdheSB0byBkbyB0aGlzIHdpdGggTygxKTtcclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCAzLCAyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMjtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIGZyYW1lc1BlclN0ZXAgKj0gbXVsdGlwbGllcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHN1YlN0ZXBzOiBudW1iZXIgPSAwO1xyXG4gICAgICBsZXQgaGlnaFN0ZXBzOiBudW1iZXIgPSAwOyAvLyBldmVyeSBudGggc3RlcCB3aWxsIGJlIGhpZ2hlclxyXG4gICAgICBpZiAoZnJhbWVzUGVyU3RlcCAhPSAxKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lc1BlclN0ZXAgPT0gNSkge1xyXG4gICAgICAgICAgc3ViU3RlcHMgPSA0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKGlNdWx0aXBsaWVycykge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICBzdWJTdGVwcyA9IDU7XHJcbiAgICAgICAgICAgICAgaGlnaFN0ZXBzID0gMztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgIHN1YlN0ZXBzID0gNTtcclxuICAgICAgICAgICAgICBoaWdoU3RlcHMgPSAyO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgc3ViU3RlcHMgPSA5O1xyXG4gICAgICAgICAgICAgIGhpZ2hTdGVwcyA9IDI7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZ3JpZExpbmVzOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGxldCB0aW1lU3RlcHM6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgICAgdGhpcy5jcmMyLmZvbnQgPSB0aGlzLmRvY3VtZW50U3R5bGUuZm9udDtcclxuXHJcbiAgICAgIGxldCBzdGVwczogbnVtYmVyID0gMSArIHRoaXMuY2FudmFzLndpZHRoIC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeFN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgdGltZVN0ZXBzLmxpbmVUbyh4U3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIDIwKTtcclxuICAgICAgICBncmlkTGluZXMubW92ZVRvKHhTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpO1xyXG4gICAgICAgIGdyaWRMaW5lcy5saW5lVG8oeFN0ZXAsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpbWU6IG51bWJlciA9IGlTdGVwICogZnJhbWVzUGVyU3RlcCAvIGZwcztcclxuICAgICAgICB0aGlzLmNyYzIuZmlsbFRleHQoXHJcbiAgICAgICAgICBgJHt0aW1lLnRvRml4ZWQoMil9YCxcclxuICAgICAgICAgIHhTdGVwICsgMyxcclxuICAgICAgICAgIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgLSAyMCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHhTdWJTdGVwOiBudW1iZXIgPSB4U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGltZVN0ZXBzLm1vdmVUbyh4U3ViU3RlcCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcbiAgICAgICAgICB0aW1lU3RlcHMubGluZVRvKHhTdWJTdGVwLCBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gKGlTdWJTdGVwICUgaGlnaFN0ZXBzID09IDAgPyAxMiA6IDgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UodGltZVN0ZXBzKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShncmlkTGluZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0V2ZW50cygpOiB2b2lkIHtcclxuICAgICAgbGV0IHRvdGFsSGVpZ2h0OiBudW1iZXIgPSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQ7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWJhY2tncm91bmQtbWFpblwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIFZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyAwLjUsIHRoaXMuY2FudmFzLndpZHRoLCBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCk7XHJcblxyXG4gICAgICB0aGlzLmNyYzIuYmVnaW5QYXRoKCk7XHJcbiAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgdG90YWxIZWlnaHQpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCB0b3RhbEhlaWdodCk7XHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSAxO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZSgpO1xyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG5cclxuICAgICAgdGhpcy5ldmVudHMgPSBbXTtcclxuICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbikgcmV0dXJuO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBsYWJlbCBpbiB0aGlzLmFuaW1hdGlvbi5sYWJlbHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24ubGFiZWxzW2xhYmVsXSk7XHJcbiAgICAgICAgbGV0IHZpZXdMYWJlbDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBsYWJlbCwgcGF0aDJEOiBnZW5lcmF0ZUxhYmVsKHgpLCB0eXBlOiBcImxhYmVsXCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdMYWJlbCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3TGFiZWwucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBldmVudCBpbiB0aGlzLmFuaW1hdGlvbi5ldmVudHMpIHtcclxuICAgICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5hbmltYXRpb24uZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgbGV0IHZpZXdFdmVudDogVmlld0FuaW1hdGlvbkV2ZW50ID0geyBkYXRhOiBldmVudCwgcGF0aDJEOiBnZW5lcmF0ZUV2ZW50KHgpLCB0eXBlOiBcImV2ZW50XCIgfTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHZpZXdFdmVudCk7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZSh2aWV3RXZlbnQucGF0aDJEKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gdGhpcy5ldmVudHMuZmluZChfZXZlbnQgPT4gX2V2ZW50LmRhdGEgPT0gdGhpcy5zZWxlY3RlZEV2ZW50Py5kYXRhKTtcclxuICAgICAgdGhpcy5ldmVudElucHV0LmhpZGRlbiA9IHRoaXMuc2VsZWN0ZWRFdmVudCA9PSBudWxsO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEV2ZW50LnBhdGgyRCk7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LnN0eWxlLmxlZnQgPSBgJHsodGhpcy5zZWxlY3RlZEV2ZW50LnR5cGUgPT0gXCJldmVudFwiID8gdGhpcy5hbmltYXRpb24uZXZlbnRzIDogdGhpcy5hbmltYXRpb24ubGFiZWxzKVt0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YV0gKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnggKyAxMn1weGA7XHJcbiAgICAgICAgdGhpcy5ldmVudElucHV0LmNsYXNzTmFtZSA9IHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlO1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnNlbGVjdGVkRXZlbnQudHlwZSA9PSBcImxhYmVsXCIpXHJcbiAgICAgICAgLy8gICB0aGlzLmV2ZW50SW5wdXQuc3R5bGUudG9wID0gYCR7Vmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVH1weGA7XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vICAgdGhpcy5ldmVudElucHV0LnN0eWxlLnRvcCA9IGAke1ZpZXdBbmltYXRpb25TaGVldC5USU1FTElORV9IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuRVZFTlRTX0hFSUdIVCAvIDIgLSAyfXB4YDtcclxuICAgICAgICB0aGlzLmV2ZW50SW5wdXQudmFsdWUgPSB0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLnNhdmUoKTtcclxuICAgICAgdGhpcy5jcmMyLnJlY3QoMCwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmNsaXAoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlRXZlbnQoX3g6IG51bWJlcik6IFBhdGgyRCB7XHJcbiAgICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQ7XHJcbiAgICAgICAgcGF0aC5tb3ZlVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDQpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94LCB0b3RhbEhlaWdodCAtIDEwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCArIDgsIHRvdGFsSGVpZ2h0IC0gMTYpO1xyXG4gICAgICAgIHBhdGgubGluZVRvKF94ICsgOCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgLy8gcGF0aC5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVMYWJlbChfeDogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgICAgICBsZXQgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRDtcclxuICAgICAgICBwYXRoLm1vdmVUbyhfeCwgdG90YWxIZWlnaHQgLSA0KTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAyNik7XHJcbiAgICAgICAgcGF0aC5saW5lVG8oX3ggKyA4LCB0b3RhbEhlaWdodCAtIDIwKTtcclxuICAgICAgICBwYXRoLmxpbmVUbyhfeCwgdG90YWxIZWlnaHQgLSAxNCk7XHJcbiAgICAgICAgLy8gcGF0aC5saW5lVG8oX3gsIHRvdGFsSGVpZ2h0IC0gMjYpO1xyXG4gICAgICAgIC8vIHBhdGguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdTY2FsZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMubW9kZSAhPSBTSEVFVF9NT0RFLkNVUlZFUykgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNlbnRlcjogbnVtYmVyID0gdGhpcy5yb3VuZCh0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgIHRoaXMuY3JjMi5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVRvKHRoaXMuY2FudmFzLndpZHRoLCBjZW50ZXIpO1xyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoKTtcclxuXHJcbiAgICAgIGxldCBwaXhlbFBlclN0ZXA6IG51bWJlciA9IC10aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy55O1xyXG4gICAgICBsZXQgdmFsdWVQZXJTdGVwOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgbGV0IG11bHRpcGxpZXJzOiBudW1iZXJbXSA9IFsyLCA1XTtcclxuICAgICAgbGV0IGlNdWx0aXBsaWVyczogbnVtYmVyID0gMDtcclxuICAgICAgd2hpbGUgKHBpeGVsUGVyU3RlcCA8IFZpZXdBbmltYXRpb25TaGVldC5NSU5JTVVNX1BJWEVMX1BFUl9TVEVQKSB7XHJcbiAgICAgICAgaU11bHRpcGxpZXJzID0gKGlNdWx0aXBsaWVycyArIDEpICUgbXVsdGlwbGllcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtdWx0aXBsaWVyOiBudW1iZXIgPSBtdWx0aXBsaWVyc1tpTXVsdGlwbGllcnNdO1xyXG4gICAgICAgIHBpeGVsUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgIHZhbHVlUGVyU3RlcCAqPSBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdWJTdGVwczogbnVtYmVyID0gMDtcclxuICAgICAgc3dpdGNoIChpTXVsdGlwbGllcnMpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDE7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBzdWJTdGVwcyA9IDQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xyXG4gICAgICB0aGlzLmNyYzIudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG5cclxuICAgICAgbGV0IHN0ZXBzOiBudW1iZXIgPSAxICsgdGhpcy5jYW52YXMuaGVpZ2h0IC8gcGl4ZWxQZXJTdGVwO1xyXG4gICAgICBsZXQgc3RlcE9mZnNldDogbnVtYmVyID0gTWF0aC5mbG9vcigtdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLnkgLyBwaXhlbFBlclN0ZXApO1xyXG4gICAgICBmb3IgKGxldCBpU3RlcDogbnVtYmVyID0gc3RlcE9mZnNldDsgaVN0ZXAgPCBzdGVwcyArIHN0ZXBPZmZzZXQ7IGlTdGVwKyspIHtcclxuICAgICAgICBsZXQgeVN0ZXA6IG51bWJlciA9IHRoaXMucm91bmQoaVN0ZXAgKiBwaXhlbFBlclN0ZXAgKyB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5tb3ZlVG8oMCwgeVN0ZXApO1xyXG4gICAgICAgIHRoaXMuY3JjMi5saW5lVG8oVmlld0FuaW1hdGlvblNoZWV0LlNDQUxFX1dJRFRIIC0gNSwgeVN0ZXApO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gLWlTdGVwICogdmFsdWVQZXJTdGVwO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsVGV4dChcclxuICAgICAgICAgIHZhbHVlUGVyU3RlcCA+PSAxID8gdmFsdWUudG9GaXhlZCgwKSA6IHZhbHVlLnRvRml4ZWQoMSksXHJcbiAgICAgICAgICAzMyxcclxuICAgICAgICAgIHlTdGVwKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlU3R5bGUgPSB0aGlzLmRvY3VtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tY29sb3ItdGV4dFwiKTtcclxuICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGxldCBwaXhlbFBlclN1YlN0ZXA6IG51bWJlciA9IHBpeGVsUGVyU3RlcCAvIChzdWJTdGVwcyArIDEpO1xyXG4gICAgICAgIGZvciAobGV0IGlTdWJTdGVwOiBudW1iZXIgPSAxOyBpU3ViU3RlcCA8IHN1YlN0ZXBzICsgMTsgaVN1YlN0ZXArKykge1xyXG4gICAgICAgICAgbGV0IHlTdWJTdGVwOiBudW1iZXIgPSB5U3RlcCArIE1hdGgucm91bmQoaVN1YlN0ZXAgKiBwaXhlbFBlclN1YlN0ZXApO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgdGhpcy5jcmMyLm1vdmVUbygwLCB5U3ViU3RlcCk7XHJcbiAgICAgICAgICB0aGlzLmNyYzIubGluZVRvKFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSCAtIDUsIHlTdWJTdGVwKTtcclxuICAgICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1iYWNrZ3JvdW5kLW1haW5cIik7XHJcbiAgICAgICAgICB0aGlzLmNyYzIuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETzogYWRkIGNvcnJlY3QgZHJhd2luZyBmb3IgY29uc3RhbnQvc3RlcCBpbnRlcnBvbGF0ZWQga2V5c1xyXG4gICAgcHJpdmF0ZSBkcmF3Q3VydmVzKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHNlcXVlbmNlIG9mIHRoaXMuc2VxdWVuY2VzKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gc2VxdWVuY2UuY29sb3I7XHJcbiAgICAgICAgc2VxdWVuY2UuZGF0YS5nZXRLZXlzKClcclxuICAgICAgICAgIC5tYXAoKF9rZXksIF9pbmRleCwgX2tleXMpID0+IFtfa2V5LCBfa2V5c1tfaW5kZXggKyAxXV0pXHJcbiAgICAgICAgICAuZmlsdGVyKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gX2tleVN0YXJ0ICYmIF9rZXlFbmQpXHJcbiAgICAgICAgICAubWFwKChbX2tleVN0YXJ0LCBfa2V5RW5kXSkgPT4gZ2V0QmV6aWVyUG9pbnRzKF9rZXlTdGFydC5mdW5jdGlvbk91dCwgX2tleVN0YXJ0LCBfa2V5RW5kKSlcclxuICAgICAgICAgIC5mb3JFYWNoKChfYmV6aWVyUG9pbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gX3BvaW50LnRyYW5zZm9ybSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pKTtcclxuICAgICAgICAgICAgbGV0IGN1cnZlOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgICAgICAgIGN1cnZlLm1vdmVUbyhfYmV6aWVyUG9pbnRzWzBdLngsIF9iZXppZXJQb2ludHNbMF0ueSk7XHJcbiAgICAgICAgICAgIGN1cnZlLmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1sxXS54LCBfYmV6aWVyUG9pbnRzWzFdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1syXS54LCBfYmV6aWVyUG9pbnRzWzJdLnksXHJcbiAgICAgICAgICAgICAgX2JlemllclBvaW50c1szXS54LCBfYmV6aWVyUG9pbnRzWzNdLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5jcmMyLnN0cm9rZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIF9iZXppZXJQb2ludHMuZm9yRWFjaChfcG9pbnQgPT4gxpIuUmVjeWNsZXIuc3RvcmUoX3BvaW50KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0QmV6aWVyUG9pbnRzKF9hbmltYXRpb25GdW5jdGlvbjogxpIuQW5pbWF0aW9uRnVuY3Rpb24sIF9rZXlTdGFydDogxpIuQW5pbWF0aW9uS2V5LCBfa2V5RW5kOiDGki5BbmltYXRpb25LZXkpOiDGki5WZWN0b3IyW10ge1xyXG4gICAgICAgIGxldCBwYXJhbWV0ZXJzOiB7IGE6IG51bWJlcjsgYjogbnVtYmVyOyBjOiBudW1iZXI7IGQ6IG51bWJlciB9ID0gX2FuaW1hdGlvbkZ1bmN0aW9uLmdldFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjb25zdCBwb2xhckZvcm06ICh1OiBudW1iZXIsIHY6IG51bWJlciwgdzogbnVtYmVyKSA9PiBudW1iZXIgPSAoX3UsIF92LCBfdykgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5hICogX3UgKiBfdiAqIF93ICtcclxuICAgICAgICAgICAgcGFyYW1ldGVycy5iICogKChfdiAqIF93ICsgX3cgKiBfdSArIF91ICogX3YpIC8gMykgK1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmMgKiAoKF91ICsgX3YgKyBfdykgLyAzKSArXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuZFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCB4U3RhcnQ6IG51bWJlciA9IF9rZXlTdGFydC50aW1lO1xyXG4gICAgICAgIGxldCB4RW5kOiBudW1iZXIgPSBfa2V5RW5kLnRpbWU7XHJcbiAgICAgICAgbGV0IG9mZnNldFRpbWVFbmQ6IG51bWJlciA9IHhFbmQgLSB4U3RhcnQ7XHJcblxyXG4gICAgICAgIGxldCBwb2ludHM6IMaSLlZlY3RvcjJbXSA9IG5ldyBBcnJheSg0KS5maWxsKDApLm1hcCgoKSA9PiDGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMikpO1xyXG4gICAgICAgIHBvaW50c1swXS5zZXQoeFN0YXJ0LCBwb2xhckZvcm0oMCwgMCwgMCkpO1xyXG4gICAgICAgIHBvaW50c1sxXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDEgLyAzLCBwb2xhckZvcm0oMCwgMCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1syXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCAqIDIgLyAzLCBwb2xhckZvcm0oMCwgb2Zmc2V0VGltZUVuZCwgb2Zmc2V0VGltZUVuZCkpO1xyXG4gICAgICAgIHBvaW50c1szXS5zZXQoeFN0YXJ0ICsgb2Zmc2V0VGltZUVuZCwgcG9sYXJGb3JtKG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQsIG9mZnNldFRpbWVFbmQpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0tleXMoKTogdm9pZCB7XHJcbiAgICAgIC8vIGRyYXcgdW5zZWxlY3RlZCBrZXlzXHJcbiAgICAgIHRoaXMuY3JjMi5saW5lV2lkdGggPSA0O1xyXG4gICAgICB0aGlzLmtleXMuZm9yRWFjaChfa2V5ID0+IHtcclxuICAgICAgICBpZiAoX2tleSA9PSB0aGlzLnNlbGVjdGVkS2V5KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci10ZXh0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSBfa2V5LmNvbG9yO1xyXG4gICAgICAgIHRoaXMuY3JjMi5zdHJva2UoX2tleS5wYXRoMkQpO1xyXG4gICAgICAgIHRoaXMuY3JjMi5maWxsKF9rZXkucGF0aDJEKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBkcmF3IHNlbGVjdGVkIGtleVxyXG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRLZXkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLnNlbGVjdGVkS2V5LmNvbG9yO1xyXG4gICAgICB0aGlzLmNyYzIuc3Ryb2tlKHRoaXMuc2VsZWN0ZWRLZXkucGF0aDJEKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGwodGhpcy5zZWxlY3RlZEtleS5wYXRoMkQpO1xyXG5cclxuICAgICAgLy8gZHJhdyBzbG9wZSBob29rc1xyXG4gICAgICBpZiAodGhpcy5tb2RlICE9IFNIRUVUX01PREUuQ1VSVkVTKSByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNyYzIubGluZVdpZHRoID0gMTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZVN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLXRleHRcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsU3R5bGUgPSB0aGlzLmNyYzIuc3Ryb2tlU3R5bGU7XHJcblxyXG4gICAgICBsZXQgW2xlZnQsIHJpZ2h0XSA9IFvGki5SZWN5Y2xlci5nZXQoxpIuVmVjdG9yMiksIMaSLlJlY3ljbGVyLmdldCjGki5WZWN0b3IyKV07XHJcbiAgICAgIGxlZnQuc2V0KC01MCwgMCk7XHJcbiAgICAgIHJpZ2h0LnNldCg1MCwgMCk7XHJcblxyXG4gICAgICBsZXQgYW5nbGVTbG9wZVNjcmVlbjogbnVtYmVyID0gTWF0aC5hdGFuKHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZUluICogKHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnkgLyB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54KSkgKiAoMTgwIC8gTWF0aC5QSSk7IC8vIGluIGRlZ3JlZVxyXG4gICAgICBsZXQgbXR4VHJhbnNmb3JtOiDGki5NYXRyaXgzeDMgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgICAgbXR4VHJhbnNmb3JtLnRyYW5zbGF0ZSh0aGlzLndvcmxkVG9TY3JlZW5Qb2ludCh0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZSwgdGhpcy5zZWxlY3RlZEtleS5kYXRhLnZhbHVlKSk7XHJcbiAgICAgIG10eFRyYW5zZm9ybS5yb3RhdGUoYW5nbGVTbG9wZVNjcmVlbik7XHJcbiAgICAgIGxlZnQudHJhbnNmb3JtKG10eFRyYW5zZm9ybSk7XHJcbiAgICAgIHJpZ2h0LnRyYW5zZm9ybShtdHhUcmFuc2Zvcm0pO1xyXG5cclxuICAgICAgbGV0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcclxuICAgICAgcGF0aC5tb3ZlVG8obGVmdC54LCBsZWZ0LnkpO1xyXG4gICAgICBwYXRoLmxpbmVUbyhyaWdodC54LCByaWdodC55KTtcclxuICAgICAgdGhpcy5jcmMyLnN0cm9rZShwYXRoKTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzID0gW3RoaXMuZ2VuZXJhdGVLZXkobGVmdCwgNSwgNSksIHRoaXMuZ2VuZXJhdGVLZXkocmlnaHQsIDUsIDUpXTtcclxuICAgICAgdGhpcy5zbG9wZUhvb2tzLmZvckVhY2goX2hvb2sgPT4gdGhpcy5jcmMyLmZpbGwoX2hvb2spKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKGxlZnQpO1xyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShyaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3Q3Vyc29yKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNyYzIucmVzdG9yZSgpO1xyXG4gICAgICBsZXQgeDogbnVtYmVyID0gdGhpcy50aW1lVG9TY3JlZW4odGhpcy5wbGF5YmFja1RpbWUpO1xyXG4gICAgICBsZXQgY3Vyc29yOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XHJcbiAgICAgIGN1cnNvci5tb3ZlVG8oeCwgMCk7XHJcbiAgICAgIGN1cnNvci5saW5lVG8oeCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jcmMyLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2VTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1zaWduYWxcIik7XHJcbiAgICAgIHRoaXMuY3JjMi5zdHJva2UoY3Vyc29yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdIaWdobGlnaHQoKTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEtleSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHBvc1NjcmVlbjogxpIuVmVjdG9yMiA9IHRoaXMud29ybGRUb1NjcmVlblBvaW50KHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS50aW1lLCB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudmFsdWUpO1xyXG4gICAgICB0aGlzLmNyYzIuZmlsbFN0eWxlID0gdGhpcy5kb2N1bWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbG9yLWhpZ2hsaWdodFwiKTtcclxuICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjY2XCI7XHJcbiAgICAgIHRoaXMuY3JjMi5maWxsUmVjdChwb3NTY3JlZW4ueCAtIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSAvIDIsIDAsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTKSB7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSA9IHRoaXMuZG9jdW1lbnRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1oaWdobGlnaHRcIik7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxTdHlsZSArPSBcIjI2XCI7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KDAsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgcG9zU2NyZWVuLngsIFZpZXdBbmltYXRpb25TaGVldC5LRVlfU0laRSk7XHJcbiAgICAgICAgdGhpcy5jcmMyLmZpbGxSZWN0KHBvc1NjcmVlbi54IC0gVmlld0FuaW1hdGlvblNoZWV0LktFWV9TSVpFIC8gMiwgVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCArIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hULCBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUsIHBvc1NjcmVlbi55IC0gVmlld0FuaW1hdGlvblNoZWV0LlRJTUVMSU5FX0hFSUdIVCAtIFZpZXdBbmltYXRpb25TaGVldC5FVkVOVFNfSEVJR0hUKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGV2ZW50IGhhbmRsaW5nXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgPT0gdGhpcylcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubm9kZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2V2ZW50LmRldGFpbC5ub2RlPy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50QW5pbWF0b3IpPy5hbmltYXRpb247XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYW5pbWF0aW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuTVVUQVRFLCAoKSA9PiB0aGlzLnJlc2V0Vmlldyk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uPy5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULk1VVEFURSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzZXRWaWV3KCk7IHRoaXMuYW5pbWF0ZSgpOyB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VmlldygpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcodHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwuZGF0YSBpbnN0YW5jZW9mIMaSLkFuaW1hdGlvbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gdGhpcy5rZXlzLmZpbmQoX2tleSA9PiBfa2V5LmRhdGEgPT0gX2V2ZW50LmRldGFpbC5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlcXVlbmNlcyA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLnBsYXliYWNrVGltZSA9IF9ldmVudC5kZXRhaWwuZGF0YTtcclxuICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJEb3duID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLmNhbnZhcy5mb2N1cygpO1xyXG4gICAgICBjb25zdCBmaW5kT2JqZWN0OiAoX29iamVjdDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCkgPT4gYm9vbGVhbiA9IF9vYmplY3QgPT4gdGhpcy5jcmMyLmlzUG9pbnRJblBhdGgoX29iamVjdC5wYXRoMkQsIF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmJ1dHRvbnMpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50Lm9mZnNldFkgPiAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmNsaWVudEhlaWdodCkgLy8gY2xpY2tlZCBvbiBzY3JvbGwgYmFyXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsID0gdGhpcy5obmRTY3JvbGw7XHJcbiAgICAgICAgICBlbHNlIGlmIChfZXZlbnQub2Zmc2V0WSA8PSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG5kUG9pbnRlck1vdmVUaW1lbGluZShfZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZVRpbWVsaW5lO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNsb3BlSG9va3Muc29tZShfaG9vayA9PiB0aGlzLmNyYzIuaXNQb2ludEluUGF0aChfaG9vaywgX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVTbG9wZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogVmlld0FuaW1hdGlvbktleSB8IFZpZXdBbmltYXRpb25FdmVudCA9XHJcbiAgICAgICAgICAgICAgdGhpcy5rZXlzLmZpbmQoZmluZE9iamVjdCkgfHxcclxuICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5maW5kKGZpbmRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRLZXkgPSBudWxsO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiBudWxsIH0gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBzd2l0Y2ggKHNlbGVjdGVkLnR5cGUpIHtcclxuICAgICAgICAgICAgICBjYXNlIFwibGFiZWxcIjpcclxuICAgICAgICAgICAgICBjYXNlIFwiZXZlbnRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVEcmFnRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIFwia2V5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkS2V5ID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdGhpcy5obmRQb2ludGVyTW92ZURyYWdLZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuc2VsZWN0ZWRLZXkuZGF0YSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5YmFja1RpbWUgPSB0aGlzLnNlbGVjdGVkS2V5LmRhdGEudGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnBvc1JpZ2h0Q2xpY2sueCA9IF9ldmVudC5vZmZzZXRYO1xyXG4gICAgICAgICAgdGhpcy5wb3NSaWdodENsaWNrLnkgPSBfZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMucG9zUGFuU3RhcnQgPSB0aGlzLnNjcmVlblRvV29ybGRQb2ludChfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIub25wb2ludGVybW92ZSA9IHRoaXMuaG5kUG9pbnRlck1vdmVQYW47XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJNb3ZlVGltZWxpbmUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMucGxheWJhY2tUaW1lID0gdGhpcy5zY3JlZW5Ub1RpbWUoX2V2ZW50Lm9mZnNldFgpO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZVNsb3BlID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdmN0RGVsdGE6IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLkRJRkZFUkVOQ0UobmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKSwgdGhpcy53b3JsZFRvU2NyZWVuUG9pbnQodGhpcy5zZWxlY3RlZEtleS5kYXRhLnRpbWUsIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS52YWx1ZSkpO1xyXG4gICAgICB2Y3REZWx0YS50cmFuc2Zvcm0oxpIuTWF0cml4M3gzLlNDQUxJTkcoxpIuTWF0cml4M3gzLklOVkVSU0UodGhpcy5tdHhXb3JsZFRvU2NyZWVuKS5zY2FsaW5nKSk7XHJcbiAgICAgIGxldCBzbG9wZTogbnVtYmVyID0gdmN0RGVsdGEueSAvIHZjdERlbHRhLng7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZUluID0gc2xvcGU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRLZXkuZGF0YS5zbG9wZU91dCA9IHNsb3BlO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZVBhbiA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gxpIuVmVjdG9yMi5ESUZGRVJFTkNFKHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSksIHRoaXMucG9zUGFuU3RhcnQpO1xyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuRE9QRSlcclxuICAgICAgICB0cmFuc2xhdGlvbi55ID0gMDtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZSh0cmFuc2xhdGlvbik7XHJcbiAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZURyYWdLZXkgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMiA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIGxldCBwaXhlbFBlckZyYW1lOiBudW1iZXIgPSAxMDAwIC8gdGhpcy5hbmltYXRpb24uZnBzO1xyXG4gICAgICB0cmFuc2xhdGlvbi54ID0gTWF0aC5tYXgoMCwgdHJhbnNsYXRpb24ueCk7XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSBNYXRoLnJvdW5kKHRyYW5zbGF0aW9uLnggLyBwaXhlbFBlckZyYW1lKSAqIHBpeGVsUGVyRnJhbWU7XHJcblxyXG4gICAgICBsZXQga2V5OiDGki5BbmltYXRpb25LZXkgPSB0aGlzLnNlbGVjdGVkS2V5LmRhdGE7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogxpIuQW5pbWF0aW9uU2VxdWVuY2UgPSB0aGlzLnNlcXVlbmNlcy5maW5kKF9zZXF1ZW5jZSA9PiBfc2VxdWVuY2UuZGF0YS5nZXRLZXlzKCkuaW5jbHVkZXMoa2V5KSkuZGF0YTtcclxuICAgICAgc2VxdWVuY2UubW9kaWZ5S2V5KGtleSwgdHJhbnNsYXRpb24ueCwgdGhpcy5tb2RlID09IFNIRUVUX01PREUuRE9QRSB8fCBfZXZlbnQuc2hpZnRLZXkgPyBudWxsIDogdHJhbnNsYXRpb24ueSk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uLmNhbGN1bGF0ZVRvdGFsVGltZSgpO1xyXG4gICAgICB0aGlzLnBsYXliYWNrVGltZSA9IGtleS50aW1lO1xyXG4gICAgICB0aGlzLmFuaW1hdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZURyYWdFdmVudCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IHRpbWU6IG51bWJlciA9IHRoaXMuc2NyZWVuVG9UaW1lKF9ldmVudC5vZmZzZXRYKTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFdmVudC50eXBlID09IFwiZXZlbnRcIilcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zZXRFdmVudCh0aGlzLnNlbGVjdGVkRXZlbnQuZGF0YSwgdGltZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5sYWJlbHNbdGhpcy5zZWxlY3RlZEV2ZW50LmRhdGFdID0gdGltZTtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsKVxyXG4gICAgICAgIHRoaXMuZHJhdyh0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLm9uc2Nyb2xsID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5vbnBvaW50ZXJtb3ZlID0gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFdoZWVsID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKF9ldmVudC5idXR0b25zICE9IDApIHJldHVybjtcclxuICAgICAgbGV0IHpvb21GYWN0b3I6IG51bWJlciA9IF9ldmVudC5kZWx0YVkgPCAwID8gMS4wNSA6IDAuOTU7XHJcbiAgICAgIGxldCBwb3NDdXJzb3JXb3JsZDogxpIuVmVjdG9yMiA9IHRoaXMuc2NyZWVuVG9Xb3JsZFBvaW50KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcblxyXG4gICAgICBsZXQgeDogbnVtYmVyID0gX2V2ZW50LnNoaWZ0S2V5ID8gMSA6IHpvb21GYWN0b3I7XHJcbiAgICAgIGxldCB5OiBudW1iZXIgPSBfZXZlbnQuY3RybEtleSB8fCB0aGlzLm1vZGUgPT0gU0hFRVRfTU9ERS5ET1BFID8gMSA6IHpvb21GYWN0b3I7XHJcblxyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlKHBvc0N1cnNvcldvcmxkKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlKG5ldyDGki5WZWN0b3IyKHgsIHkpKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZSjGki5WZWN0b3IyLlNDQUxFKHBvc0N1cnNvcldvcmxkLCAtMSkpO1xyXG5cclxuICAgICAgdGhpcy5kcmF3KHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFNjcm9sbCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjIgPSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb247XHJcbiAgICAgIHRyYW5zbGF0aW9uLnggPSAtdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCArIFZpZXdBbmltYXRpb25TaGVldC5TQ0FMRV9XSURUSDtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb247XHJcbiAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGFuaW1hdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5wbGF5YmFja1RpbWUgfSB9KTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByaXZhdGUgcmVzZXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4ucmVzZXQoKTtcclxuICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWChWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX01JTExJU0VDT05EKTsgLy8gYXBwbHkgc2NhbGluZ1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGVYKCh0aGlzLmNhbnZhcy53aWR0aCAtIDIgKiBWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgpIC8gKCh0aGlzLmFuaW1hdGlvbj8udG90YWxUaW1lIHx8IFZpZXdBbmltYXRpb25TaGVldC5TVEFOREFSRF9BTklNQVRJT05fTEVOR1RIKSkpO1xyXG4gICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWChWaWV3QW5pbWF0aW9uU2hlZXQuU0NBTEVfV0lEVEgpO1xyXG4gICAgICBpZiAodGhpcy5tb2RlID09IFNIRUVUX01PREUuQ1VSVkVTKSB7XHJcbiAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnNjYWxlWSgtMSk7IC8vIGZsaXAgeVxyXG4gICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVkoVmlld0FuaW1hdGlvblNoZWV0LlBJWEVMX1BFUl9WQUxVRSk7IC8vIGFwcGx5IHNjYWxpbmdcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlczogbnVtYmVyW10gPSB0aGlzLnNlcXVlbmNlc1xyXG4gICAgICAgICAgLmZsYXRNYXAoX3NlcXVlbmNlID0+IF9zZXF1ZW5jZS5kYXRhLmdldEtleXMoKSlcclxuICAgICAgICAgIC5tYXAoX2tleSA9PiBfa2V5LnZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgIGxldCBtaW46IG51bWJlciA9IHZhbHVlcy5yZWR1Y2UoKF9hLCBfYikgPT4gTWF0aC5taW4oX2EsIF9iKSk7IC8vIGluIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICBsZXQgbWF4OiBudW1iZXIgPSB2YWx1ZXMucmVkdWNlKChfYSwgX2IpID0+IE1hdGgubWF4KF9hLCBfYikpOyAvLyBpbiB3b3JsZCBzcGFjZVxyXG4gICAgICAgICAgbGV0IHZpZXdIZWlnaHQ6IG51bWJlciA9ICh0aGlzLmNhbnZhcy5oZWlnaHQgLSBWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUIC0gVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQpOyAvLyBpbiBweFxyXG4gICAgICAgICAgaWYgKG1pbiAhPSBtYXgpXHJcbiAgICAgICAgICAgIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsZVkodmlld0hlaWdodCAvICgoKG1heCAtIG1pbikgKiBWaWV3QW5pbWF0aW9uU2hlZXQuUElYRUxfUEVSX1ZBTFVFKSAqIDEuMikpO1xyXG4gICAgICAgICAgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0ZVkodmlld0hlaWdodCAtIG1pbiAqIHRoaXMubXR4V29ybGRUb1NjcmVlbi5zY2FsaW5nLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRlWShWaWV3QW5pbWF0aW9uU2hlZXQuVElNRUxJTkVfSEVJR0hUICsgVmlld0FuaW1hdGlvblNoZWV0LkVWRU5UU19IRUlHSFQgKyBWaWV3QW5pbWF0aW9uU2hlZXQuS0VZX1NJWkUgKiAyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NyZWVuVG9Xb3JsZFBvaW50KF94OiBudW1iZXIsIF95OiBudW1iZXIpOiDGki5WZWN0b3IyIHtcclxuICAgICAgbGV0IHZlY3RvcjogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKF94LCBfeSk7XHJcbiAgICAgIHZlY3Rvci50cmFuc2Zvcm0oxpIuTWF0cml4M3gzLklOVkVSU0UodGhpcy5tdHhXb3JsZFRvU2NyZWVuKSk7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB3b3JsZFRvU2NyZWVuUG9pbnQoX3g6IG51bWJlciwgX3k6IG51bWJlcik6IMaSLlZlY3RvcjIge1xyXG4gICAgICBsZXQgdmVjdG9yOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX3gsIF95KTtcclxuICAgICAgdmVjdG9yLnRyYW5zZm9ybSh0aGlzLm10eFdvcmxkVG9TY3JlZW4pO1xyXG4gICAgICB2ZWN0b3IueCA9IHRoaXMucm91bmQodmVjdG9yLngpO1xyXG4gICAgICB2ZWN0b3IueSA9IHRoaXMucm91bmQodmVjdG9yLnkpO1xyXG4gICAgICByZXR1cm4gdmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NyZWVuVG9UaW1lKF94OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICBsZXQgcGxheWJhY2tUaW1lOiBudW1iZXIgPSBNYXRoLm1heCgwLCAoX3ggLSB0aGlzLm10eFdvcmxkVG9TY3JlZW4udHJhbnNsYXRpb24ueCkgLyB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54KTtcclxuICAgICAgcmV0dXJuIHBsYXliYWNrVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRpbWVUb1NjcmVlbihfdGltZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm91bmQoX3RpbWUgKiB0aGlzLm10eFdvcmxkVG9TY3JlZW4uc2NhbGluZy54ICsgdGhpcy5tdHhXb3JsZFRvU2NyZWVuLnRyYW5zbGF0aW9uLngpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcm91bmQoX3ZhbHVlOiBudW1iZXIpOiBudW1iZXIgeyAvLyB0aGlzIGlzIG5lZWRlZCBmb3IgbGluZXMgdG8gYmUgZGlzcGxheWVkIGNyaXNwIG9uIHRoZSBjYW52YXNcclxuICAgICAgaWYgKE1hdGgudHJ1bmModGhpcy5jcmMyLmxpbmVXaWR0aCkgJSAyID09IDApXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoX3ZhbHVlKTsgLy8gZXZlbiBsaW5lIHdpZHRoXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpICsgMC41OyAvLyBvZGQgbGluZSB3aWR0aFxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGklVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBlbnVtIE1FTlUge1xyXG4gICAgQ09NUE9ORU5UTUVOVSA9IFwiQWRkIENvbXBvbmVudHNcIlxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogZXhhbWluIHByb2JsZW0gd2l0aCDGki5NYXRlcmlhbCB3aGVuIHVzaW5nIFwidHlwZW9mIMaSLk11dGFibGVcIiBhcyBrZXkgdG8gdGhlIG1hcFxyXG4gIGxldCByZXNvdXJjZVRvQ29tcG9uZW50OiBNYXA8RnVuY3Rpb24sIHR5cGVvZiDGki5Db21wb25lbnQ+ID0gbmV3IE1hcDxGdW5jdGlvbiwgdHlwZW9mIMaSLkNvbXBvbmVudD4oW1xyXG4gICAgW8aSLkF1ZGlvLCDGki5Db21wb25lbnRBdWRpb10sXHJcbiAgICBbxpIuTWF0ZXJpYWwsIMaSLkNvbXBvbmVudE1hdGVyaWFsXSxcclxuICAgIFvGki5NZXNoLCDGki5Db21wb25lbnRNZXNoXSxcclxuICAgIFvGki5BbmltYXRpb24sIMaSLkNvbXBvbmVudEFuaW1hdG9yXSxcclxuICAgIFvGki5QYXJ0aWNsZVN5c3RlbSwgxpIuQ29tcG9uZW50UGFydGljbGVTeXN0ZW1dXHJcbiAgXSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIFZpZXcgYWxsIGNvbXBvbmVudHMgYXR0YWNoZWQgdG8gYSBub2RlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3Q29tcG9uZW50cyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBub2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBleHBhbmRlZDogeyBbdHlwZTogc3RyaW5nXTogYm9vbGVhbiB9ID0geyBDb21wb25lbnRUcmFuc2Zvcm06IHRydWUgfTtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWQ6IHN0cmluZyA9IFwiQ29tcG9uZW50VHJhbnNmb3JtXCI7XHJcbiAgICBwcml2YXRlIGRyYWc6IMaSLkNvbXBvbmVudENhbWVyYTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG4gICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHRoaXMuaG5kVHJhbnNmb3JtKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09MTEFQU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNMSUNLLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEV2ZW50LCB0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULk1VVEFURSwgdGhpcy5obmRFdmVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5Db21wb25lbnRDYW1lcmFbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRyYWcgPyBbdGhpcy5kcmFnXSA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgQ29tcG9uZW50XCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkFERF9DT01QT05FTlQsIMaSLkNvbXBvbmVudCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJBZGQgSm9pbnRcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQUREX0pPSU5ULCDGki5Kb2ludCwgX2NhbGxiYWNrKVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJEZWxldGUgQ29tcG9uZW50XCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkFERF9KT0lOVCwgxpIuSm9pbnQsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIENvbXBvbmVudFwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9DT01QT05FTlQpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJEXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuaW5mbyhgTWVudVNlbGVjdDogSXRlbS1pZD0ke0NPTlRFWFRNRU5VW19pdGVtLmlkXX1gKTtcclxuICAgICAgbGV0IGlTdWJjbGFzczogbnVtYmVyID0gX2l0ZW1bXCJpU3ViY2xhc3NcIl07XHJcbiAgICAgIGxldCBjb21wb25lbnQ6IHR5cGVvZiDGki5Db21wb25lbnQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5wcm90ZWN0R3JhcGhJbnN0YW5jZSgpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoTnVtYmVyKF9pdGVtLmlkKSkge1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQUREX0NPTVBPTkVOVDpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IMaSLkNvbXBvbmVudC5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkFERF9KT0lOVDpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IMaSLkpvaW50LnN1YmNsYXNzZXNbaVN1YmNsYXNzXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuREVMRVRFX0NPTVBPTkVOVDpcclxuICAgICAgICAgIGxldCBlbGVtZW50OiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gXCJCT0RZXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudC50YWdOYW1lKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXJEZXRhaWwgPSBSZWZsZWN0LmdldChlbGVtZW50LCBcImNvbnRyb2xsZXJcIik7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gXCJERVRBSUxTXCIgJiYgY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBkZXRhaWw6IHsgbXV0YWJsZTogPMaSLk11dGFibGU+Y29udHJvbGxlci5nZXRNdXRhYmxlKCkgfSB9KTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgfSB3aGlsZSAoZWxlbWVudCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY29tcG9uZW50KSAvLyBleHBlcmltZW50YWwgZml4IGZvciB0aGUgc3BvcmFkaWMgXCJjb21wb25lbnQgaXMgbm90IGEgY29uc3RydWN0b3JcIiBidWdcclxuICAgICAgICBjb21wb25lbnQgPSDGkltfaXRlbS5sYWJlbF07XHJcblxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IGNtcE5ldzogxpIuQ29tcG9uZW50ID0gbmV3IGNvbXBvbmVudCgpO1xyXG4gICAgICBpZiAoKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudFJpZ2lkYm9keSB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRWUkRldmljZSB8fCBjbXBOZXcgaW5zdGFuY2VvZiDGki5Db21wb25lbnRXYWxrZXIpICYmICF0aGlzLm5vZGUuY21wVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgYWxlcnQoYFRvIGF0dGFjaCBhICR7Y21wTmV3LnR5cGV9LCBmaXJzdCBhdHRhY2ggYSAke8aSLkNvbXBvbmVudFRyYW5zZm9ybS5uYW1lfS5gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEdyYXBoRmlsdGVyICYmICEodGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGggfHwgdGhpcy5ub2RlIGluc3RhbmNlb2YgxpIuR3JhcGhJbnN0YW5jZSkpIHtcclxuICAgICAgICBhbGVydChgQXR0YWNoICR7xpIuQ29tcG9uZW50R3JhcGhGaWx0ZXIubmFtZX0gb25seSB0byAke8aSLkdyYXBoLm5hbWV9IG9yICR7xpIuR3JhcGhJbnN0YW5jZS5uYW1lfXNgKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm5vZGUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50Rm9nIHx8IGNtcE5ldyBpbnN0YW5jZW9mIMaSLkNvbXBvbmVudEFtYmllbnRPY2NsdXNpb24gfHwgY21wTmV3IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50Qmxvb20pIHtcclxuICAgICAgICBsZXQgY2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudENhbWVyYSkgPz8gdGhpcy5ub2RlLmdldENvbXBvbmVudCjGki5Db21wb25lbnRWUkRldmljZSk7XHJcbiAgICAgICAgaWYgKCFjYW1lcmEpIHtcclxuICAgICAgICAgIGFsZXJ0KGBUbyBhdHRhY2ggYSAke2NtcE5ldy50eXBlfSwgZmlyc3QgYXR0YWNoIGEgJHvGki5Db21wb25lbnRDYW1lcmEubmFtZX0gb3IgJHvGki5Db21wb25lbnRWUkRldmljZS5uYW1lfS5gKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgxpIuRGVidWcuaW5mbyhjbXBOZXcudHlwZSwgY21wTmV3KTtcclxuXHJcbiAgICAgIHRoaXMubm9kZS5hZGRDb21wb25lbnQoY21wTmV3KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5ub2RlIH0gfSk7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgaG5kRHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy5ub2RlKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgaWYgKHRoaXMuZG9tICE9IF9ldmVudC50YXJnZXQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwgfHwgX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3U2NyaXB0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2NyaXB0SW5mbykge1xyXG4gICAgICAgICAgaWYgKCFzb3VyY2UuaXNDb21wb25lbnQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmZpbmRDb21wb25lbnRUeXBlKHNvdXJjZSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnByb3RlY3RHcmFwaEluc3RhbmNlKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgX3ZpZXdTb3VyY2UuZ2V0RHJhZ0Ryb3BTb3VyY2VzKCkpIHtcclxuICAgICAgICBsZXQgY21wTmV3OiDGki5Db21wb25lbnQgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudChzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDb21wb25lbnQoY21wTmV3KTtcclxuICAgICAgICB0aGlzLmV4cGFuZGVkW2NtcE5ldy50eXBlXSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuTU9ESUZZLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm90ZWN0R3JhcGhJbnN0YW5jZSgpOiBib29sZWFuIHtcclxuICAgICAgLy8gaW5oaWJpdCBzdHJ1Y3R1cmFsIGNoYW5nZXMgdG8gYSBHcmFwaEluc3RhbmNlXHJcbiAgICAgIGxldCBjaGVjazogxpIuTm9kZSA9IHRoaXMubm9kZTtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIGlmIChjaGVjayBpbnN0YW5jZW9mIMaSLkdyYXBoSW5zdGFuY2UpIHtcclxuICAgICAgICAgIGFsZXJ0KGBFZGl0IHRoZSBncmFwaCBcIiR7Y2hlY2submFtZX1cIiB0byBtYWtlIGNoYW5nZXMgdG8gaXRzIHN0cnVjdHVyZSBhbmQgdGhlbiByZWxvYWQgdGhlIHByb2plY3RgKTtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGVjayA9IGNoZWNrLmdldFBhcmVudCgpO1xyXG4gICAgICB9IHdoaWxlIChjaGVjayk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgbGV0IGNudEVtcHR5OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNudEVtcHR5LnRleHRDb250ZW50ID0gXCJEcm9wIGludGVybmFsIHJlc291cmNlcyBvciB1c2UgcmlnaHQgY2xpY2sgdG8gY3JlYXRlIG5ldyBjb21wb25lbnRzXCI7XHJcbiAgICAgIHRoaXMuZG9tLnRpdGxlID0gXCJEcm9wIGludGVybmFsIHJlc291cmNlcyBvciB1c2UgcmlnaHQgY2xpY2sgdG8gY3JlYXRlIG5ldyBjb21wb25lbnRzXCI7XHJcblxyXG4gICAgICBpZiAoIXRoaXMubm9kZSB8fCAhKHRoaXMubm9kZSBpbnN0YW5jZW9mIMaSLk5vZGUpKSB7ICAvLyBUT0RPOiBleGFtaW5lLCBpZiBhbnl0aGluZyBvdGhlciB0aGFuIG5vZGUgY2FuIGFwcGVhciBoZXJlLi4uXHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIkNvbXBvbmVudHNcIik7XHJcbiAgICAgICAgdGhpcy5kb20udGl0bGUgPSBcIlNlbGVjdCBub2RlIHRvIGVkaXQgY29tcG9uZW50c1wiO1xyXG4gICAgICAgIGNudEVtcHR5LnRleHRDb250ZW50ID0gXCJTZWxlY3Qgbm9kZSB0byBlZGl0IGNvbXBvbmVudHNcIjtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmQoY250RW1wdHkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShcIkNvbXBvbmVudHMgfCBcIiArIHRoaXMubm9kZS5uYW1lKTtcclxuXHJcbiAgICAgIGxldCBjb21wb25lbnRzOiDGki5Db21wb25lbnRbXSA9IHRoaXMubm9kZS5nZXRBbGxDb21wb25lbnRzKCk7XHJcbiAgICAgIGlmICghY29tcG9uZW50cy5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmQoY250RW1wdHkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIGNvbXBvbmVudHMpIHtcclxuICAgICAgICBsZXQgZGV0YWlsczogxpJVaS5EZXRhaWxzID0gxpJVaS5HZW5lcmF0b3IuY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKGNvbXBvbmVudCk7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXJEZXRhaWwgPSBuZXcgQ29udHJvbGxlckRldGFpbChjb21wb25lbnQsIGRldGFpbHMsIHRoaXMpO1xyXG4gICAgICAgIFJlZmxlY3Quc2V0KGRldGFpbHMsIFwiY29udHJvbGxlclwiLCBjb250cm9sbGVyKTsgLy8gaW5zZXJ0IGEgbGluayBiYWNrIHRvIHRoZSBjb250cm9sbGVyXHJcbiAgICAgICAgZGV0YWlscy5leHBhbmQodGhpcy5leHBhbmRlZFtjb21wb25lbnQudHlwZV0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZChkZXRhaWxzKTtcclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50Q2FtZXJhKSB7XHJcbiAgICAgICAgICBkZXRhaWxzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICBkZXRhaWxzLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgKF9ldmVudDogRXZlbnQpID0+IHsgdGhpcy5kcmFnID0gPMaSLkNvbXBvbmVudENhbWVyYT5jb21wb25lbnQ7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5KSB7XHJcbiAgICAgICAgICBsZXQgcGl2b3Q6IEhUTUxFbGVtZW50ID0gY29udHJvbGxlci5kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJba2V5PSdtdHhQaXZvdCdcIik7XHJcbiAgICAgICAgICBsZXQgb3BhY2l0eTogc3RyaW5nID0gcGl2b3Quc3R5bGUub3BhY2l0eTtcclxuICAgICAgICAgIHNldFBpdm90T3BhY2l0eShudWxsKTtcclxuICAgICAgICAgIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuTVVUQVRFLCBzZXRQaXZvdE9wYWNpdHkpO1xyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UGl2b3RPcGFjaXR5KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGluaXRpYWxpemF0aW9uOiDGki5CT0RZX0lOSVQgPSBjb250cm9sbGVyLmdldE11dGF0b3IoeyBpbml0aWFsaXphdGlvbjogMCB9KS5pbml0aWFsaXphdGlvbjtcclxuICAgICAgICAgICAgcGl2b3Quc3R5bGUub3BhY2l0eSA9IGluaXRpYWxpemF0aW9uID09IMaSLkJPRFlfSU5JVC5UT19QSVZPVCA/IG9wYWNpdHkgOiBcIjAuM1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgxpIuQ29tcG9uZW50RmFjZUNhbWVyYSkge1xyXG4gICAgICAgICAgbGV0IHVwOiBIVE1MRWxlbWVudCA9IGNvbnRyb2xsZXIuZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2tleT0ndXAnXCIpO1xyXG4gICAgICAgICAgbGV0IG9wYWNpdHk6IHN0cmluZyA9IHVwLnN0eWxlLm9wYWNpdHk7XHJcbiAgICAgICAgICBzZXRVcE9wYWNpdHkobnVsbCk7XHJcbiAgICAgICAgICBjb250cm9sbGVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULk1VVEFURSwgc2V0VXBPcGFjaXR5KTtcclxuICAgICAgICAgIGZ1bmN0aW9uIHNldFVwT3BhY2l0eShfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB1cExvY2FsOiBib29sZWFuID0gY29udHJvbGxlci5nZXRNdXRhdG9yKHsgdXBMb2NhbDogdHJ1ZSB9KS51cExvY2FsO1xyXG4gICAgICAgICAgICB1cC5zdHlsZS5vcGFjaXR5ID0gIXVwTG9jYWwgPyBvcGFjaXR5IDogXCIwLjNcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRldGFpbHMuZ2V0QXR0cmlidXRlKFwia2V5XCIpID09IHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChkZXRhaWxzLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIHRoaXMubm9kZSA9IF9ldmVudC5kZXRhaWwubm9kZSB8fCBfZXZlbnQuZGV0YWlsLmdyYXBoO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgICBpZiAodGhpcy5wcm90ZWN0R3JhcGhJbnN0YW5jZSgpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBsZXQgY29tcG9uZW50OiDGki5Db21wb25lbnQgPSA8xpIuQ29tcG9uZW50Pl9ldmVudC5kZXRhaWwubXV0YWJsZTtcclxuICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULktFWV9ET1dOOlxyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5DTElDSzpcclxuICAgICAgICAgIGlmIChfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuU1BBQ0UpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgbGV0IHRhcmdldDogxpJVaS5EZXRhaWxzID0gPMaSVWkuRGV0YWlscz5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHRhcmdldC50YWdOYW1lID09IFwiU1VNTUFSWVwiKVxyXG4gICAgICAgICAgICB0YXJnZXQgPSA8xpJVaS5EZXRhaWxzPnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKCEoX2V2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxEZXRhaWxzRWxlbWVudCB8fCAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kb20ucmVwbGFjZUNoaWxkKHRhcmdldCwgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIGlmIChfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50IHx8IHRoaXMuZ2V0U2VsZWN0ZWQoKSAhPSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3QodGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBjYXRjaCAoX2U6IHVua25vd24pIHsgLyogKi8gfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULkVYUEFORDpcclxuICAgICAgICBjYXNlIMaSVWkuRVZFTlQuQ09MTEFQU0U6XHJcbiAgICAgICAgICB0aGlzLmV4cGFuZGVkWyg8xpJVaS5EZXRhaWxzPl9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcInR5cGVcIildID0gKF9ldmVudC50eXBlID09IMaSVWkuRVZFTlQuRVhQQU5EKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5NVVRBVEU6XHJcbiAgICAgICAgICBsZXQgY21wUmlnaWRib2R5OiDGki5Db21wb25lbnRSaWdpZGJvZHkgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudFJpZ2lkYm9keSk7XHJcbiAgICAgICAgICBpZiAoY21wUmlnaWRib2R5KSBcclxuICAgICAgICAgICAgY21wUmlnaWRib2R5LmluaXRpYWxpemUoKTtcclxuICAgICAgICAgIC8vIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbm9kZTogdGhpcy5ub2RlIH0gfSk7IC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgd2FzIG5lY2Vzc2FyeSwgRVZFTlRfRURJVE9SLlVQREFURSBnZXRzIGJyb2FkY2FzdGVkIGJ5IHByb2plY3Qgb24gxpIuRVZFTlQuR1JBUEhfTVVUQVRFRCwgc28gdGhpcyB3YXMgY2F1c2luZyBhIGRvdWJsZSBicm9hZGNhc3Qgb2YgRVZFTlRfRURJVE9SLlVQREFURSB0byBBTEwgdmlld3Mgb24gYW55IGNoYW5nZSB0byBhbnkgY29tcG9uZW50XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyBjYXNlIMaSVWkuRVZFTlQuUkVBUlJBTkdFX0FSUkFZOiAvLyBubyBsaXN0ZW5lciBmb3IgdGhpcyBldmVudFxyXG4gICAgICAgIC8vICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kVHJhbnNmb3JtID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmdldFNlbGVjdGVkKCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXJEZXRhaWwgPSBSZWZsZWN0LmdldCh0aGlzLmdldFNlbGVjdGVkKCksIFwiY29udHJvbGxlclwiKTtcclxuICAgICAgbGV0IGNvbXBvbmVudDogxpIuQ29tcG9uZW50ID0gPMaSLkNvbXBvbmVudD5jb250cm9sbGVyLmdldE11dGFibGUoKTtcclxuICAgICAgbGV0IG10eFRyYW5zZm9ybTogxpIuTWF0cml4NHg0ID0gUmVmbGVjdC5nZXQoY29tcG9uZW50LCBcIm10eExvY2FsXCIpIHx8IFJlZmxlY3QuZ2V0KGNvbXBvbmVudCwgXCJtdHhQaXZvdFwiKTtcclxuICAgICAgaWYgKCFtdHhUcmFuc2Zvcm0pXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGR0bDogxpIuR2VuZXJhbCA9IF9ldmVudC5kZXRhaWwudHJhbnNmb3JtO1xyXG4gICAgICBsZXQgbXR4Q2FtZXJhOiDGki5NYXRyaXg0eDQgPSAoPMaSLkNvbXBvbmVudENhbWVyYT5kdGwuY2FtZXJhKS5ub2RlLm10eFdvcmxkO1xyXG4gICAgICBsZXQgZGlzdGFuY2U6IG51bWJlciA9IG10eENhbWVyYS5nZXRUcmFuc2xhdGlvblRvKHRoaXMubm9kZS5tdHhXb3JsZCkubWFnbml0dWRlO1xyXG4gICAgICBpZiAoZHRsLnRyYW5zZm9ybSA9PSBUUkFOU0ZPUk0uUk9UQVRFKVxyXG4gICAgICAgIFtkdGwueCwgZHRsLnldID0gW2R0bC55LCBkdGwueF07XHJcblxyXG4gICAgICBsZXQgdmFsdWU6IMaSLlZlY3RvcjMgPSBuZXcgxpIuVmVjdG9yMygpO1xyXG4gICAgICB2YWx1ZS54ID0gKGR0bC5yZXN0cmljdGlvbiA9PSBcInhcIiA/ICFkdGwuaW52ZXJ0ZWQgOiBkdGwuaW52ZXJ0ZWQpID8gZHRsLnggOiB1bmRlZmluZWQ7XHJcbiAgICAgIHZhbHVlLnkgPSAoZHRsLnJlc3RyaWN0aW9uID09IFwieVwiID8gIWR0bC5pbnZlcnRlZCA6IGR0bC5pbnZlcnRlZCkgPyAtZHRsLnkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIHZhbHVlLnogPSAoZHRsLnJlc3RyaWN0aW9uID09IFwielwiID8gIWR0bC5pbnZlcnRlZCA6IGR0bC5pbnZlcnRlZCkgP1xyXG4gICAgICAgICgodmFsdWUueCA9PSB1bmRlZmluZWQpID8gLWR0bC55IDogZHRsLngpIDogdW5kZWZpbmVkO1xyXG4gICAgICB2YWx1ZSA9IHZhbHVlLm1hcCgoX2M6IG51bWJlcikgPT4gX2MgfHwgMCk7XHJcblxyXG4gICAgICBpZiAobXR4VHJhbnNmb3JtIGluc3RhbmNlb2YgxpIuTWF0cml4NHg0KVxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtMyhkdGwudHJhbnNmb3JtLCB2YWx1ZSwgbXR4VHJhbnNmb3JtLCBkaXN0YW5jZSk7XHJcbiAgICAgIGlmIChtdHhUcmFuc2Zvcm0gaW5zdGFuY2VvZiDGki5NYXRyaXgzeDMpXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0yKGR0bC50cmFuc2Zvcm0sIHZhbHVlLnRvVmVjdG9yMigpLCBtdHhUcmFuc2Zvcm0sIDEpO1xyXG5cclxuICAgICAgY29tcG9uZW50Lm11dGF0ZShjb21wb25lbnQuZ2V0TXV0YXRvcigpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm0zKF90cmFuc2Zvcm06IFRSQU5TRk9STSwgX3ZhbHVlOiDGki5WZWN0b3IzLCBfbXR4VHJhbnNmb3JtOiDGki5NYXRyaXg0eDQsIF9kaXN0YW5jZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHN3aXRjaCAoX3RyYW5zZm9ybSkge1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlRSQU5TTEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JUcmFuc2xhdGlvbjogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yVHJhbnNsYXRpb24gKiBfZGlzdGFuY2UpO1xyXG4gICAgICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IzID0gX210eFRyYW5zZm9ybS50cmFuc2xhdGlvbjtcclxuICAgICAgICAgIHRyYW5zbGF0aW9uLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uUk9UQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclJvdGF0aW9uOiBudW1iZXIgPSAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclJvdGF0aW9uKTtcclxuICAgICAgICAgIGxldCByb3RhdGlvbjogxpIuVmVjdG9yMyA9IF9tdHhUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICByb3RhdGlvbi5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0ucm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlNDQUxFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclNjYWxpbmc6IG51bWJlciA9IDAuMDAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclNjYWxpbmcpO1xyXG4gICAgICAgICAgbGV0IHNjYWxpbmc6IMaSLlZlY3RvcjMgPSBfbXR4VHJhbnNmb3JtLnNjYWxpbmc7XHJcbiAgICAgICAgICBzY2FsaW5nLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS5zY2FsaW5nID0gc2NhbGluZztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm0yKF90cmFuc2Zvcm06IFRSQU5TRk9STSwgX3ZhbHVlOiDGki5WZWN0b3IyLCBfbXR4VHJhbnNmb3JtOiDGki5NYXRyaXgzeDMsIF9kaXN0YW5jZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHN3aXRjaCAoX3RyYW5zZm9ybSkge1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlRSQU5TTEFURTpcclxuICAgICAgICAgIGxldCBmYWN0b3JUcmFuc2xhdGlvbjogbnVtYmVyID0gMC4wMDE7IC8vIFRPRE86IGVsaW1pbmF0ZSBtYWdpYyBudW1iZXJzXHJcbiAgICAgICAgICBfdmFsdWUuc2NhbGUoZmFjdG9yVHJhbnNsYXRpb24gKiBfZGlzdGFuY2UpO1xyXG4gICAgICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IyID0gX210eFRyYW5zZm9ybS50cmFuc2xhdGlvbjtcclxuICAgICAgICAgIHRyYW5zbGF0aW9uLmFkZChfdmFsdWUpO1xyXG4gICAgICAgICAgX210eFRyYW5zZm9ybS50cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uUk9UQVRFOlxyXG4gICAgICAgICAgbGV0IGZhY3RvclJvdGF0aW9uOiBudW1iZXIgPSAxOyAvLyBUT0RPOiBlbGltaW5hdGUgbWFnaWMgbnVtYmVyc1xyXG4gICAgICAgICAgX3ZhbHVlLnNjYWxlKGZhY3RvclJvdGF0aW9uKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0ucm90YXRpb24gKz0gX3ZhbHVlLng7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5TQ0FMRTpcclxuICAgICAgICAgIGxldCBmYWN0b3JTY2FsaW5nOiBudW1iZXIgPSAwLjAwMTsgLy8gVE9ETzogZWxpbWluYXRlIG1hZ2ljIG51bWJlcnNcclxuICAgICAgICAgIF92YWx1ZS5zY2FsZShmYWN0b3JTY2FsaW5nKTtcclxuICAgICAgICAgIGxldCBzY2FsaW5nOiDGki5WZWN0b3IyID0gX210eFRyYW5zZm9ybS5zY2FsaW5nO1xyXG4gICAgICAgICAgc2NhbGluZy5hZGQoX3ZhbHVlKTtcclxuICAgICAgICAgIF9tdHhUcmFuc2Zvcm0uc2NhbGluZyA9IHNjYWxpbmc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0KF9kZXRhaWxzOiDGklVpLkRldGFpbHMsIF9mb2N1czogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5kb20uY2hpbGRyZW4pXHJcbiAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICBfZGV0YWlscy5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBfZGV0YWlscy5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGlmIChfZm9jdXMpXHJcbiAgICAgICAgX2RldGFpbHMuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdGVkKCk6IMaSVWkuRGV0YWlscyB7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZG9tLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoXCJzZWxlY3RlZFwiKSlcclxuICAgICAgICAgIHJldHVybiA8xpJVaS5EZXRhaWxzPmNoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50KF9yZXNvdXJjZTogT2JqZWN0KTogxpIuQ29tcG9uZW50IHtcclxuICAgICAgaWYgKF9yZXNvdXJjZSBpbnN0YW5jZW9mIFNjcmlwdEluZm8pXHJcbiAgICAgICAgaWYgKF9yZXNvdXJjZS5pc0NvbXBvbmVudClcclxuICAgICAgICAgIHJldHVybiBuZXcgKDzGki5HZW5lcmFsPl9yZXNvdXJjZS5zY3JpcHQpKCk7XHJcblxyXG4gICAgICBsZXQgdHlwZUNvbXBvbmVudDogdHlwZW9mIMaSLkNvbXBvbmVudCA9IHRoaXMuZmluZENvbXBvbmVudFR5cGUoX3Jlc291cmNlKTtcclxuICAgICAgcmV0dXJuIG5ldyAoPMaSLkdlbmVyYWw+dHlwZUNvbXBvbmVudCkoX3Jlc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmRDb21wb25lbnRUeXBlKF9yZXNvdXJjZTogT2JqZWN0KTogdHlwZW9mIMaSLkNvbXBvbmVudCB7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIHJlc291cmNlVG9Db21wb25lbnQpXHJcbiAgICAgICAgaWYgKF9yZXNvdXJjZSBpbnN0YW5jZW9mIGVudHJ5WzBdKVxyXG4gICAgICAgICAgcmV0dXJuIGVudHJ5WzFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgc3RvcmVTZWxlY3RlZCgpOiB2b2lkIHtcclxuICAgIC8vICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgIC8vIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyB0aGUgaGllcmFyY2h5IG9mIGEgZ3JhcGggYXMgdHJlZS1jb250cm9sXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMCAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdIaWVyYXJjaHkgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgZ3JhcGg6IMaSLkdyYXBoO1xyXG4gICAgcHJpdmF0ZSB0cmVlOiDGklVpLlRyZWU8xpIuTm9kZT47XHJcbiAgICBwcml2YXRlIHNlbGVjdGlvblByZXZpb3VzOiDGki5Ob2RlW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5zZXRHcmFwaChudWxsKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkNMT1NFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuXHJcbiAgICAgIC8vIGEgc2VsZWN0IGV2ZW50IHdpbGwgYmUgcmVjaXZlZCBmcm9tIHRoZSBwYW5lbCBkdXJpbmcgcmVjb25zdHJ1Y3Rpb24gc28gd2Ugb25seSBuZWVkIHRvIHByZXBhcmUgb3VyIHN0b3JhZ2UgaGVyZVxyXG4gICAgICBpZiAoX3N0YXRlW1wiZ3JhcGhcIl0gJiYgX3N0YXRlW1wiZXhwYW5kZWRcIl0gJiYgIXRoaXMucmVzdG9yZUV4cGFuZGVkKF9zdGF0ZVtcImdyYXBoXCJdKSlcclxuICAgICAgICB0aGlzLnN0b3JlRXhwYW5kZWQoX3N0YXRlW1wiZ3JhcGhcIl0sIF9zdGF0ZVtcImV4cGFuZGVkXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBzZWxlY3Rpb24oKTogxpIuTm9kZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0R3JhcGgoX2dyYXBoOiDGki5HcmFwaCk6IHZvaWQge1xyXG4gICAgICBpZiAoIV9ncmFwaCkge1xyXG4gICAgICAgIHRoaXMuZ3JhcGggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmdyYXBoICYmIHRoaXMudHJlZSlcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JhcGgpXHJcbiAgICAgICAgdGhpcy5zdG9yZUV4cGFuZGVkKHRoaXMuZ3JhcGguaWRSZXNvdXJjZSwgdGhpcy5nZXRFeHBhbmRlZCgpKTtcclxuXHJcbiAgICAgIHRoaXMuZ3JhcGggPSBfZ3JhcGg7XHJcbiAgICAgIC8vIHRoaXMuc2VsZWN0ZWROb2RlID0gbnVsbDtcclxuXHJcbiAgICAgIHRoaXMudHJlZSA9IG5ldyDGklVpLlRyZWU8xpIuTm9kZT4obmV3IENvbnRyb2xsZXJUcmVlSGllcmFyY2h5KCksIHRoaXMuZ3JhcGgpO1xyXG4gICAgICAvLyB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRUcmVlRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULlNFTEVDVCwgdGhpcy5obmRUcmVlRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkRFTEVURSwgdGhpcy5obmRUcmVlRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULlJFTkFNRSwgdGhpcy5obmRUcmVlRXZlbnQpO1xyXG4gICAgICB0aGlzLnRyZWUuYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZCh0aGlzLnRyZWUpO1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IFwi4pePIFJpZ2h0IGNsaWNrIG9uIGV4aXN0aW5nIG5vZGUgdG8gY3JlYXRlIGNoaWxkIG5vZGUuXFxu4pePIFVzZSBDb3B5L1Bhc3RlIHRvIGR1cGxpY2F0ZSBub2Rlcy5cIjtcclxuICAgICAgdGhpcy50cmVlLnRpdGxlID0gXCJTZWxlY3Qgbm9kZSB0byBlZGl0IG9yIGR1cGxpY2F0ZS5cIjtcclxuXHJcbiAgICAgIGxldCBleHBhbmRlZDogc3RyaW5nW10gPSB0aGlzLnJlc3RvcmVFeHBhbmRlZCh0aGlzLmdyYXBoLmlkUmVzb3VyY2UpO1xyXG4gICAgICBpZiAoZXhwYW5kZWQpXHJcbiAgICAgICAgdGhpcy5leHBhbmQoZXhwYW5kZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREcmFnRHJvcFNvdXJjZXMoKTogxpIuTm9kZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyQ2FwdHVyZShfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgaWYgKF92aWV3U291cmNlID09IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuOyAvLyBjb250aW51ZSB3aXRoIHN0YW5kYXJkIHRyZWUgYmVoYXZpb3VyXHJcblxyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwpIHtcclxuICAgICAgICBpZiAodGhpcy50cmVlKVxyXG4gICAgICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpLmZpbHRlcigoX3NvdXJjZSk6IF9zb3VyY2UgaXMgxpIuR3JhcGggPT4gX3NvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGhuZERyb3BDYXB0dXJlKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICBpZiAoX3ZpZXdTb3VyY2UgPT0gdGhpcyB8fCBfZXZlbnQudGFyZ2V0ID09IHRoaXMudHJlZSlcclxuICAgICAgICByZXR1cm47IC8vIGNvbnRpbnVlIHdpdGggc3RhbmRhcmQgdHJlZSBiZWhhdmlvdXJcclxuXHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGluc3RhbmNlczogxpIuR3JhcGhJbnN0YW5jZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGdyYXBoIG9mIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMpXHJcbiAgICAgICAgaWYgKGdyYXBoIGluc3RhbmNlb2YgxpIuR3JhcGgpXHJcbiAgICAgICAgICBpbnN0YW5jZXMucHVzaChhd2FpdCDGki5Qcm9qZWN0LmNyZWF0ZUdyYXBoSW5zdGFuY2UoZ3JhcGgpKTtcclxuXHJcbiAgICAgIHRoaXMudHJlZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBpbnN0YW5jZXM7XHJcbiAgICAgIHRoaXMudHJlZS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCjGklVpLkVWRU5ULkRST1AsIHsgYnViYmxlczogZmFsc2UgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkFkZCBOb2RlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuQUREX05PREUpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJOXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlLSAvIEFjdnRpdmF0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkFDVElWQVRFX05PREUpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJBXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIkRlbGV0ZVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkRFTEVURV9OT0RFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiRFwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtDT05URVhUTUVOVVtfaXRlbS5pZF19YCk7XHJcbiAgICAgIGxldCBmb2N1czogxpIuTm9kZSA9IHRoaXMudHJlZS5nZXRGb2N1c3NlZCgpO1xyXG5cclxuICAgICAgc3dpdGNoIChOdW1iZXIoX2l0ZW0uaWQpKSB7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BRERfTk9ERTpcclxuICAgICAgICAgIGxldCBjaGlsZDogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKFwiTmV3IE5vZGVcIik7XHJcbiAgICAgICAgICB0aGlzLnRyZWUuYWRkQ2hpbGRyZW4oW2NoaWxkXSwgZm9jdXMpO1xyXG4gICAgICAgICAgdGhpcy50cmVlLmZpbmRWaXNpYmxlKGNoaWxkKS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5BQ1RJVkFURV9OT0RFOlxyXG4gICAgICAgICAgZm9jdXMuYWN0aXZhdGUoIWZvY3VzLmlzQWN0aXZlKTtcclxuICAgICAgICAgIHRoaXMudHJlZS5maW5kVmlzaWJsZShmb2N1cykucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLk1PRElGWSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfTk9ERTpcclxuICAgICAgICAgIC8vIGZvY3VzLmFkZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgIGlmICghZm9jdXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHRoaXMudHJlZS5kZWxldGUoW2ZvY3VzXSk7XHJcbiAgICAgICAgICBmb2N1cy5nZXRQYXJlbnQoKS5yZW1vdmVDaGlsZChmb2N1cyk7XHJcbiAgICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICAgICAgxpIuUGh5c2ljcy5jbGVhbnVwKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKTogVmlld1N0YXRlIHtcclxuICAgICAgbGV0IHN0YXRlOiBWaWV3U3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xyXG4gICAgICBzdGF0ZVtcImV4cGFuZGVkXCJdID0gdGhpcy5nZXRFeHBhbmRlZCgpO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jcmVnaW9uIEV2ZW50SGFuZGxlcnNcclxuICAgIHByaXZhdGUgaG5kVHJlZUV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoKEVWRU5UX0VESVRPUi5NT0RJRlksIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJVaS5FVkVOVC5SRU5BTUU6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgxpIuR3JhcGgpIHtcclxuICAgICAgICAgICAgLy8gX2V2ZW50LmRldGFpbC5kYXRhLm5hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLlVQREFURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGklVpLkVWRU5ULlNFTEVDVDpcclxuICAgICAgICAgIC8vb25seSBkaXNwYXRjaCB0aGUgZXZlbnQgdG8gZm9jdXMgdGhlIG5vZGUsIGlmIHRoZSBub2RlIGlzIGluIHRoZSBjdXJyZW50IGFuZCB0aGUgcHJldmlvdXMgc2VsZWN0aW9uICBcclxuICAgICAgICAgIGxldCBub2RlOiDGki5Ob2RlID0gX2V2ZW50LmRldGFpbFtcImRhdGFcIl07XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25QcmV2aW91cy5pbmNsdWRlcyhub2RlKSAmJiB0aGlzLnNlbGVjdGlvbi5pbmNsdWRlcyhub2RlKSlcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuRk9DVVMsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IG5vZGU6IG5vZGUsIHZpZXc6IHRoaXMgfSB9KTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUHJldmlvdXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGRldGFpbDogeyBub2RlOiBub2RlLCB2aWV3OiB0aGlzIH0gfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLmdyYXBoKVxyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKF9ldmVudC5kZXRhaWwuZ3JhcGgpO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC5kZXRhaWwubm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRyZWUuc2hvdyhfZXZlbnQuZGV0YWlsLm5vZGUuZ2V0UGF0aCgpKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlLmNvbnRyb2xsZXIuc2VsZWN0aW9uID0gW19ldmVudC5kZXRhaWwubm9kZV07XHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5kaXNwbGF5U2VsZWN0aW9uKHRoaXMudHJlZS5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUHJldmlvdXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlVQREFURTpcclxuICAgICAgICAgIGlmIChfZXZlbnQuZGV0YWlsLnZpZXcgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwgJiYgX2V2ZW50LmRldGFpbC5kYXRhID09IHRoaXMuZ3JhcGgpXHJcbiAgICAgICAgICAgIHRoaXMudHJlZS5maW5kSXRlbSh0aGlzLmdyYXBoKT8ucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkNMT1NFOlxyXG4gICAgICAgICAgaWYgKHRoaXMuZ3JhcGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVFeHBhbmRlZCh0aGlzLmdyYXBoLmlkUmVzb3VyY2UsIHRoaXMuZ2V0RXhwYW5kZWQoKSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBwcml2YXRlIHN0b3JlRXhwYW5kZWQoX2lkR3JhcGg6IHN0cmluZywgX2V4cGFuZGVkOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaWR9XyR7X2lkR3JhcGh9YCwgSlNPTi5zdHJpbmdpZnkoX2V4cGFuZGVkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlRXhwYW5kZWQoX2lkR3JhcGg6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgbGV0IHN0b3JlZDogc3RyaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShgJHt0aGlzLmlkfV8ke19pZEdyYXBofWApO1xyXG4gICAgICByZXR1cm4gc3RvcmVkICYmIEpTT04ucGFyc2Uoc3RvcmVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEV4cGFuZGVkKCk6IHN0cmluZ1tdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZT8uZ2V0RXhwYW5kZWQoKS5tYXAoX2l0ZW0gPT4gxpIuTm9kZS5QQVRIX0ZST01fVE8odGhpcy5ncmFwaCwgX2l0ZW0uZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kKF9wYXRoczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgY29uc3QgcGF0aHM6IMaSLk5vZGVbXVtdID0gX3BhdGhzXHJcbiAgICAgICAgLm1hcChfcGF0aCA9PiDGki5Ob2RlLkZJTkQ8xpIuTm9kZT4odGhpcy5ncmFwaCwgX3BhdGgpKVxyXG4gICAgICAgIC5maWx0ZXIoX25vZGUgPT4gX25vZGUpXHJcbiAgICAgICAgLm1hcChfbm9kZSA9PiBfbm9kZS5nZXRQYXRoKCkpO1xyXG5cclxuICAgICAgdGhpcy50cmVlPy5leHBhbmQocGF0aHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBpbXBvcnQgxpJVaSA9IEZ1ZGdlVXNlckludGVyZmFjZTtcclxuICBpbXBvcnQgxpJBaWQgPSBGdWRnZUFpZDtcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyB0aGUgcmVuZGVyaW5nIG9mIGEgZ3JhcGggaW4gYSB2aWV3cG9ydCB3aXRoIGFuIGluZGVwZW5kZW50IGNhbWVyYVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1JlbmRlciBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBjbXJPcmJpdDogxpJBaWQuQ2FtZXJhT3JiaXQ7XHJcbiAgICBwcml2YXRlIHZpZXdwb3J0OiDGki5WaWV3cG9ydDtcclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgZ3JhcGg6IMaSLkdyYXBoO1xyXG4gICAgcHJpdmF0ZSBub2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBub2RlTGlnaHQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIklsbHVtaW5hdGlvblwiKTsgLy8ga2VlcHMgbGlnaHQgY29tcG9uZW50cyBmb3IgZGFyayBncmFwaHNcclxuICAgIHByaXZhdGUgcmVkcmF3SWQ6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybWF0b3I6IMaSQWlkLlRyYW5zZm9ybWF0b3I7XHJcblxyXG4gICAgI3BvaW50ZXJNb3ZlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuXHJcbiAgICAgIGxldCB0aXRsZTogc3RyaW5nID0gXCLil48gRHJvcCBhIGdyYXBoIGZyb20gXFxcIkludGVybmFsXFxcIiBoZXJlLlxcblwiO1xyXG4gICAgICB0aXRsZSArPSBcIuKXjyBVc2UgbW91c2VidXR0b25zIGFuZCBjdHJsLSwgc2hpZnQtIG9yIGFsdC1rZXkgdG8gbmF2aWdhdGUgZWRpdG9yIGNhbWVyYS5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCLil48gRHJvcCBjYW1lcmEgY29tcG9uZW50IGhlcmUgdG8gc2VlIHRocm91Z2ggdGhhdCBjYW1lcmEuXFxuXCI7XHJcbiAgICAgIHRpdGxlICs9IFwi4pePIE1hbmlwdWxhdGUgdHJhbnNmb3JtYXRpb25zIGluIHRoaXMgdmlldzpcXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gQ2xpY2sgdG8gc2VsZWN0IG5vZGUsIHJpZ2h0Y2xpY2sgdG8gc2VsZWN0IHRyYW5zZm9ybWF0aW9ucy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gU2VsZWN0IGNvbXBvbmVudCB0byBtYW5pcHVsYXRlIGluIHZpZXcgQ29tcG9uZW50cy5cXG5cIjtcclxuICAgICAgdGl0bGUgKz0gXCIgIC0gSG9sZCBYLCBZIG9yIFogYW5kIG1vdmUgbW91c2UgdG8gdHJhbnNmb3JtLiBBZGQgc2hpZnQta2V5IHRvIGludmVydCByZXN0cmljdGlvbi5cXG5cIjtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSB0aXRsZTtcclxuICAgICAgdGhpcy5kb20udGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkZPQ1VTLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVVBEQVRFLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuQ0xPU0UsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSVWkuRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGklVpLkVWRU5ULkNPTlRFWFRNRU5VLCB0aGlzLm9wZW5Db250ZXh0TWVudSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLmhuZFBvaW50ZXIpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsICgpID0+IHRoaXMuI3BvaW50ZXJNb3ZlZCA9IGZhbHNlKTsgLy8gcmVzZXQgcG9pbnRlciBtb3ZlXHJcblxyXG4gICAgICBpZiAoX3N0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdKSB7XHJcbiAgICAgICAgbGV0IGdpem1vc0ZpbHRlcjogxpIuVmlld3BvcnRbXCJnaXptb3NGaWx0ZXJcIl0gPSBfc3RhdGVbXCJnaXptb3NGaWx0ZXJcIl07XHJcbiAgICAgICAgZm9yIChjb25zdCBnaXptbyBpbiBnaXptb3NGaWx0ZXIpIC8vIHZhbGlkYXRlIHRoZSBzYXZlZCBzdGF0ZVxyXG4gICAgICAgICAgaWYgKGdpem1vIGluIHRoaXMuZ2l6bW9zRmlsdGVyKVxyXG4gICAgICAgICAgICB0aGlzLmdpem1vc0ZpbHRlcltnaXptb10gPSBnaXptb3NGaWx0ZXJbZ2l6bW9dO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX3N0YXRlW1wicmVuZGVyQ29udGludW91c2x5XCJdKVxyXG4gICAgICAgIHRoaXMuc2V0UmVuZGVyQ29udGlub3VzbHkoX3N0YXRlW1wicmVuZGVyQ29udGludW91c2x5XCJdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBnaXptb3NGaWx0ZXIoKTogxpIuVmlld3BvcnRbXCJnaXptb3NGaWx0ZXJcIl0ge1xyXG4gICAgICByZXR1cm4gdGhpcy52aWV3cG9ydD8uZ2l6bW9zRmlsdGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiVHJhbnNmb3JtXCIsIHN1Ym1lbnU6IFtcclxuICAgICAgICAgIHsgbGFiZWw6IFwiTm9uZVwiLCBpZDogVFJBTlNGT1JNLk5PTkUsIHR5cGU6IFwicmFkaW9cIiwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiUVwiIH0sXHJcbiAgICAgICAgICB7IGxhYmVsOiBcIlRyYW5zbGF0ZVwiLCBpZDogVFJBTlNGT1JNLlRSQU5TTEFURSwgdHlwZTogXCJyYWRpb1wiLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJXXCIgfSxcclxuICAgICAgICAgIHsgbGFiZWw6IFwiUm90YXRlXCIsIGlkOiBUUkFOU0ZPUk0uUk9UQVRFLCB0eXBlOiBcInJhZGlvXCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIkVcIiB9LFxyXG4gICAgICAgICAgeyBsYWJlbDogXCJTY2FsZVwiLCBpZDogVFJBTlNGT1JNLlNDQUxFLCB0eXBlOiBcInJhZGlvXCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIlJcIiB9LFxyXG4gICAgICAgICAgeyB0eXBlOiBcInNlcGFyYXRvclwiIH0sXHJcbiAgICAgICAgICB7IGxhYmVsOiBcIldvcmxkXCIsIGlkOiBUUkFOU0ZPUk0uV09STEQsIHR5cGU6IFwicmFkaW9cIiwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiR1wiIH0sXHJcbiAgICAgICAgICB7IGxhYmVsOiBcIkxvY2FsXCIsIGlkOiBUUkFOU0ZPUk0uTE9DQUwsIHR5cGU6IFwicmFkaW9cIiwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiR1wiIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJQaHlzaWNzIERlYnVnXCIsIHN1Ym1lbnU6IFtcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk5vbmVcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVswXSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIkNvbGxpZGVyc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzFdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29sbGlkZXJzIGFuZCBKb2ludHMgKERlZmF1bHQpXCIsIGlkOiBTdHJpbmcoxpIuUEhZU0lDU19ERUJVR01PREVbMl0pLCBjbGljazogX2NhbGxiYWNrIH0sXHJcbiAgICAgICAgICB7IFwibGFiZWxcIjogXCJCb3VuZGluZyBCb3hlc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzNdKSwgY2xpY2s6IF9jYWxsYmFjayB9LFxyXG4gICAgICAgICAgeyBcImxhYmVsXCI6IFwiQ29udGFjdHNcIiwgaWQ6IFN0cmluZyjGki5QSFlTSUNTX0RFQlVHTU9ERVs0XSksIGNsaWNrOiBfY2FsbGJhY2sgfSxcclxuICAgICAgICAgIHsgXCJsYWJlbFwiOiBcIk9ubHkgUGh5c2ljc1wiLCBpZDogU3RyaW5nKMaSLlBIWVNJQ1NfREVCVUdNT0RFWzVdKSwgY2xpY2s6IF9jYWxsYmFjayB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgICAgbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBcIk9ydGhvZ3JhcGhpYyBDYW1lcmFcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5PUlRIR1JBUEhJQ19DQU1FUkEpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCIgPyBcIk9cIiA6IFwiT1wiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiUmVuZGVyIENvbnRpbnVvdXNseVwiLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpLCB0eXBlOiBcImNoZWNrYm94XCIsIGNsaWNrOiBfY2FsbGJhY2sgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgcmV0dXJuIG1lbnU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnRleHRNZW51Q2FsbGJhY2soX2l0ZW06IEVsZWN0cm9uLk1lbnVJdGVtLCBfd2luZG93OiBFbGVjdHJvbi5Ccm93c2VyV2luZG93LCBfZXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmluZm8oYE1lbnVTZWxlY3Q6IEl0ZW0taWQ9JHtfaXRlbS5pZH1gKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2l0ZW0uaWQpIHtcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5OT05FOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLlRSQU5TTEFURTpcclxuICAgICAgICBjYXNlIFRSQU5TRk9STS5ST1RBVEU6XHJcbiAgICAgICAgY2FzZSBUUkFOU0ZPUk0uU0NBTEU6XHJcbiAgICAgICAgICBQYWdlLnNldFRyYW5zZm9ybShfaXRlbS5pZCk7XHJcbiAgICAgICAgICB0aGlzLnRyYW5zZm9ybWF0b3IubW9kZSA9IF9pdGVtLmlkO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLldPUkxEOlxyXG4gICAgICAgIGNhc2UgVFJBTlNGT1JNLkxPQ0FMOlxyXG4gICAgICAgICAgdGhpcy50cmFuc2Zvcm1hdG9yLnNwYWNlID0gX2l0ZW0uaWQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLk5PTkVdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuQ09MTElERVJTXTpcclxuICAgICAgICBjYXNlIMaSLlBIWVNJQ1NfREVCVUdNT0RFW8aSLlBIWVNJQ1NfREVCVUdNT0RFLkpPSU5UU19BTkRfQ09MTElERVJdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuQk9VTkRJTkdfQk9YRVNdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuQ09OVEFDVFNdOlxyXG4gICAgICAgIGNhc2UgxpIuUEhZU0lDU19ERUJVR01PREVbxpIuUEhZU0lDU19ERUJVR01PREUuUEhZU0lDX09CSkVDVFNfT05MWV06XHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERVtfaXRlbS5pZF07XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBTdHJpbmcoQ09OVEVYVE1FTlUuT1JUSEdSQVBISUNfQ0FNRVJBKTpcclxuICAgICAgICAgIHRoaXMuc2V0Q2FtZXJhT3J0aG9ncmFwaGljKF9pdGVtLmNoZWNrZWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBTdHJpbmcoQ09OVEVYVE1FTlUuUkVOREVSX0NPTlRJTlVPVVNMWSk6XHJcbiAgICAgICAgICB0aGlzLnNldFJlbmRlckNvbnRpbm91c2x5KF9pdGVtLmNoZWNrZWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGlmICghKF9pdGVtLmlkIGluIHRoaXMuZ2l6bW9zRmlsdGVyKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgdGhpcy5naXptb3NGaWx0ZXJbX2l0ZW0uaWRdID0gX2l0ZW0uY2hlY2tlZDtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuI3BvaW50ZXJNb3ZlZCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgZ2l6bW8gaW4gdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChnaXptbykuY2hlY2tlZCA9IHRoaXMuZ2l6bW9zRmlsdGVyW2dpem1vXTtcclxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4jcG9pbnRlck1vdmVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50LCBfdmlld1NvdXJjZTogVmlldyk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0NvbXBvbmVudHMpKSB7IC8vIGFsbG93IGRyb3BwaW5nIGNhbWVyYWNvbXBvbmVudCB0byBzZWUgdGhyb3VnaCB0aGF0IGNhbWVyYSAoYXQgdGhpcyB0aW1lLCB0aGUgb25seSBkcmFnZ2FibGUpXHJcbiAgICAgICAgaWYgKCEoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3SW50ZXJuYWwpKSAvLyBhbGxvdyBkcm9wcGluZyBhIGdyYXBoXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICAgIGlmICghKHNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhuZERyb3AoX2V2ZW50OiBEcmFnRXZlbnQsIF92aWV3U291cmNlOiBWaWV3KTogdm9pZCB7XHJcbiAgICAgIGxldCBzb3VyY2U6IE9iamVjdCA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpWzBdO1xyXG4gICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50Q2FtZXJhKSB7XHJcbiAgICAgICAgLy8gdGhpcy5zZXRDYW1lcmFPcnRob2dyYXBoaWMoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpOiBWaWV3U3RhdGUge1xyXG4gICAgICBsZXQgc3RhdGU6IFZpZXdTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XHJcbiAgICAgIHN0YXRlW1wiZ2l6bW9zRmlsdGVyXCJdID0gdGhpcy5naXptb3NGaWx0ZXI7XHJcbiAgICAgIHN0YXRlW1wicmVuZGVyQ29udGludW91c2x5XCJdID0gdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpKS5jaGVja2VkO1xyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICDGkkFpZC5hZGRTdGFuZGFyZExpZ2h0Q29tcG9uZW50cyh0aGlzLm5vZGVMaWdodCk7XHJcblxyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIHRoaXMuY2FudmFzID0gxpJBaWQuQ2FudmFzLmNyZWF0ZSh0cnVlLCDGkkFpZC5JTUFHRV9SRU5ERVJJTkcuUElYRUxBVEVEKTtcclxuICAgICAgbGV0IGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSBcIjBweFwiO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuXHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgLy8gYWRkIGRlZmF1bHQgdmFsdWVzIGZvciB2aWV3IHJlbmRlciBnaXptb3NcclxuICAgICAgdGhpcy52aWV3cG9ydC5pbml0aWFsaXplKFwiVmlld05vZGVfVmlld3BvcnRcIiwgbnVsbCwgY21wQ2FtZXJhLCB0aGlzLmNhbnZhcyk7XHJcbiAgICAgIGNvbnN0IHJlZHJhdyA9ICgpOiB2b2lkID0+IHsgaWYgKHRoaXMucmVkcmF3SWQgPT0gdW5kZWZpbmVkICYmIHRoaXMuZ3JhcGgpIHRoaXMucmVkcmF3KCk7IH07XHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZU9uUGljayA9ICgpOiBib29sZWFuID0+IHRoaXMudHJhbnNmb3JtYXRvci5zZWxlY3RlZCA9PSBudWxsO1xyXG5cclxuICAgICAgdGhpcy5jbXJPcmJpdCA9IEZ1ZGdlQWlkLlZpZXdwb3J0LmV4cGFuZENhbWVyYVRvSW50ZXJhY3RpdmVPcmJpdCh0aGlzLnZpZXdwb3J0LCBmYWxzZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgcmVkcmF3LCB0cmFuc2xhdGVPblBpY2spO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnBoeXNpY3NEZWJ1Z01vZGUgPSDGki5QSFlTSUNTX0RFQlVHTU9ERS5KT0lOVFNfQU5EX0NPTExJREVSO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfU1RBUlQsIHRoaXMuaG5kUHJlcGFyZSk7XHJcblxyXG4gICAgICB0aGlzLnNldEdyYXBoKG51bGwpO1xyXG5cclxuICAgICAgdGhpcy50cmFuc2Zvcm1hdG9yID0gbmV3IMaSQWlkLlRyYW5zZm9ybWF0b3IodGhpcy52aWV3cG9ydCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmFjdGl2ZVZpZXdwb3J0KTtcclxuICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBpY2tcIiwgdGhpcy5obmRQaWNrKTtcclxuXHJcbiAgICAgIGxldCBzdWJtZW51OiBFbGVjdHJvbi5NZW51SXRlbUNvbnN0cnVjdG9yT3B0aW9uc1tdID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgZ2l6bW8gaW4gdGhpcy5naXptb3NGaWx0ZXIpXHJcbiAgICAgICAgc3VibWVudS5wdXNoKHsgbGFiZWw6IGdpem1vLCBpZDogZ2l6bW8sIHR5cGU6IFwiY2hlY2tib3hcIiwgY2xpY2s6IHRoaXMuY29udGV4dE1lbnVDYWxsYmFjay5iaW5kKHRoaXMpIH0pO1xyXG5cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5hcHBlbmQobmV3IHJlbW90ZS5NZW51SXRlbSh7XHJcbiAgICAgICAgbGFiZWw6IFwiR2l6bW9zXCIsIHN1Ym1lbnU6IHN1Ym1lbnVcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0R3JhcGgoX25vZGU6IMaSLkdyYXBoKTogdm9pZCB7XHJcbiAgICAgIGlmICghX25vZGUpIHtcclxuICAgICAgICB0aGlzLmdyYXBoID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZG9tLmlubmVySFRNTCA9IFwiRHJvcCBhIGdyYXBoIGhlcmUgdG8gZWRpdFwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXRoaXMuZ3JhcGgpIHtcclxuICAgICAgICB0aGlzLmRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5ncmFwaCA9IF9ub2RlO1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICDGki5QaHlzaWNzLmNsZWFudXAoKTtcclxuICAgICAgdGhpcy5ncmFwaC5icm9hZGNhc3RFdmVudChuZXcgRXZlbnQoxpIuRVZFTlQuRElTQ09OTkVDVF9KT0lOVCkpO1xyXG4gICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5waHlzaWNzRGVidWdNb2RlID0gxpIuUEhZU0lDU19ERUJVR01PREUuSk9JTlRTX0FORF9DT0xMSURFUjtcclxuICAgICAgdGhpcy52aWV3cG9ydC5zZXRCcmFuY2godGhpcy5ncmFwaCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FtZXJhID0gdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmE7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtYXRvci5tdHhMb2NhbCA9IG51bGw7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtYXRvci5tdHhXb3JsZCA9IG51bGw7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtYXRvci5jbGVhclVuZG8oKTtcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5ncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDYW1lcmFPcnRob2dyYXBoaWMoX29uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW1lcmEgPSB0aGlzLmNtck9yYml0LmNtcENhbWVyYTtcclxuICAgICAgaWYgKF9vbikge1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDIsIDEsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDEwLCAyMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5tYXhEaXN0YW5jZSA9IDEwMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgKj0gNTA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbXJPcmJpdC5jbXBDYW1lcmEucHJvamVjdENlbnRyYWwoMSwgNDUsIMaSLkZJRUxEX09GX1ZJRVcuRElBR09OQUwsIDAuMDEsIDEwMDApO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQubWF4RGlzdGFuY2UgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgLz0gNTA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLk9SVEhHUkFQSElDX0NBTUVSQSkpLmNoZWNrZWQgPSBfb247XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKHRoaXMuY21yT3JiaXQpO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUHJlcGFyZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBzd2l0Y2hMaWdodDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICDGki5SZW5kZXIubGlnaHRzLmZvckVhY2goKF9hcnJheTogxpIuUmVjeWNhYmxlQXJyYXk8xpIuQ29tcG9uZW50TGlnaHQ+KSA9PiBsaWdodHNQcmVzZW50IHx8PSBfYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZShgJHtsaWdodHNQcmVzZW50ID8gXCJSRU5ERVJcIiA6IFwiUmVuZGVyXCJ9IHwgJHt0aGlzLmdyYXBoLm5hbWV9YCk7XHJcbiAgICAgICAgaWYgKCFsaWdodHNQcmVzZW50KVxyXG4gICAgICAgICAgxpIuUmVuZGVyLmFkZExpZ2h0cyh0aGlzLm5vZGVMaWdodC5nZXRDb21wb25lbnRzKMaSLkNvbXBvbmVudExpZ2h0KSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9QUkVQQVJFX0VORCwgc3dpdGNoTGlnaHQpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmdyYXBoLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX1BSRVBBUkVfRU5ELCBzd2l0Y2hMaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBFZGl0b3JFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgZGV0YWlsOiBFdmVudERldGFpbCA9IDxFdmVudERldGFpbD5fZXZlbnQuZGV0YWlsO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuU0VMRUNUOlxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ncmFwaCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoKGRldGFpbC5ncmFwaCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkZPQ1VTLCB7IGJ1YmJsZXM6IGZhbHNlLCBkZXRhaWw6IHsgbm9kZTogZGV0YWlsLm5vZGUgfHwgdGhpcy5ncmFwaCB9IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRldGFpbC5ub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IGRldGFpbC5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybWF0b3IubXR4TG9jYWwgPSB0aGlzLm5vZGUubXR4TG9jYWw7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtYXRvci5tdHhXb3JsZCA9IHRoaXMubm9kZS5tdHhXb3JsZDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnQuZ2l6bW9zU2VsZWN0ZWQgPSBbdGhpcy5ub2RlXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkZPQ1VTOlxyXG4gICAgICAgICAgdGhpcy5jbXJPcmJpdC5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IGRldGFpbC5ub2RlLm10eFdvcmxkLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5jbXJPcmJpdCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DTE9TRTpcclxuICAgICAgICAgIHRoaXMuc2V0UmVuZGVyQ29udGlub3VzbHkoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy52aWV3cG9ydC5naXptb3NTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICBpZiAoIXRoaXMudmlld3BvcnQuY2FtZXJhLmlzQWN0aXZlKVxyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbWVyYSA9IHRoaXMuY21yT3JiaXQuY21wQ2FtZXJhO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlE6XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZChUUkFOU0ZPUk0uTk9ORSkuY2xpY2soKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5XOlxyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoVFJBTlNGT1JNLlRSQU5TTEFURSkuY2xpY2soKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FOlxyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoVFJBTlNGT1JNLlJPVEFURSkuY2xpY2soKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5SOlxyXG4gICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoVFJBTlNGT1JNLlNDQUxFKS5jbGljaygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkc6XHJcbiAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldE1lbnVJdGVtQnlJZCh0aGlzLnRyYW5zZm9ybWF0b3Iuc3BhY2UgPT0gVFJBTlNGT1JNLkxPQ0FMID8gVFJBTlNGT1JNLldPUkxEIDogVFJBTlNGT1JNLkxPQ0FMKS5jbGljaygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlk6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1hdG9yLnVuZG8oKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQaWNrID0gKF9ldmVudDogRWRpdG9yRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMudHJhbnNmb3JtYXRvci5zZWxlY3RlZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcGljazogxpIuUGljayA9IDzGki5QaWNrPl9ldmVudC5kZXRhaWw7XHJcblxyXG4gICAgICAvL1RPRE86IHdhdGNoIG91dCwgdHdvIHNlbGVjdHNcclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBub2RlOiBwaWNrLm5vZGUgfSB9KTtcclxuICAgICAgLy8gdGhpcy5kb20uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoxpJVaS5FVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHBpY2tlZCB9IH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhbmltYXRlID0gKF9lOiBFdmVudCkgPT4ge1xyXG4gICAgLy8gICB0aGlzLnZpZXdwb3J0LnNldEdyYXBoKHRoaXMuZ3JhcGgpO1xyXG4gICAgLy8gICBpZiAodGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0ID4gMCAmJiB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCA+IDApXHJcbiAgICAvLyAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuI3BvaW50ZXJNb3ZlZCB8fD0gKF9ldmVudC5tb3ZlbWVudFggIT0gMCB8fCBfZXZlbnQubW92ZW1lbnRZICE9IDApO1xyXG5cclxuICAgICAgdGhpcy5kb20uZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xyXG4gICAgICBsZXQgcmVzdHJpY3Rpb246IHN0cmluZztcclxuXHJcbiAgICAgIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuQ1RSTF9MRUZULCDGki5LRVlCT0FSRF9DT0RFLkNUUkxfUklHSFRdKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IG51bGw7XHJcbiAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5YXSkpXHJcbiAgICAgICAgcmVzdHJpY3Rpb24gPSBcInhcIjtcclxuICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlldKSlcclxuICAgICAgICByZXN0cmljdGlvbiA9IFwielwiO1xyXG4gICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuWl0pKVxyXG4gICAgICAgIHJlc3RyaWN0aW9uID0gXCJ5XCI7XHJcblxyXG4gICAgICBpZiAoIXJlc3RyaWN0aW9uKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY2FudmFzLnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICBsZXQgZGF0YTogT2JqZWN0ID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogUGFnZS5tb2RlVHJhbnNmb3JtLCByZXN0cmljdGlvbjogcmVzdHJpY3Rpb24sIHg6IF9ldmVudC5tb3ZlbWVudFgsIHk6IF9ldmVudC5tb3ZlbWVudFksIGNhbWVyYTogdGhpcy52aWV3cG9ydC5jYW1lcmEsIGludmVydGVkOiBfZXZlbnQuc2hpZnRLZXlcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5UUkFOU0ZPUk0sIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IHRyYW5zZm9ybTogZGF0YSB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLlVQREFURSwge30pO1xyXG4gICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGFjdGl2ZVZpZXdwb3J0ID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKHRoaXMuZ3JhcGgpO1xyXG4gICAgICBfZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgxpIuUGh5c2ljcy5hY3RpdmVJbnN0YW5jZSA9IFBhZ2UuZ2V0UGh5c2ljcyh0aGlzLmdyYXBoKTtcclxuICAgICAgICDGki5QaHlzaWNzLmNvbm5lY3RKb2ludHMoKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yOiB1bmtub3duKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSZW5kZXJDb250aW5vdXNseShmYWxzZSk7XHJcbiAgICAgICAgxpIuRGVidWcuZXJyb3IoX2Vycm9yKTtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKF9lcnJvcik7XHJcbiAgICAgICAgLy9ub3BcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFJlbmRlckNvbnRpbm91c2x5KF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBpZiAoX29uKSB7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIH0sIDEwMDAgLyAzMCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWRyYXdJZCk7XHJcbiAgICAgICAgdGhpcy5yZWRyYXdJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlJFTkRFUl9DT05USU5VT1VTTFkpKS5jaGVja2VkID0gX29uO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICBleHBvcnQgbGV0IHR5cGVzT2ZSZXNvdXJjZXM6IMaSLkdlbmVyYWxbXSA9IFtcclxuICAgIMaSLk1lc2hcclxuICBdO1xyXG5cclxuICAvKipcclxuICAgKiBMaXN0IHRoZSBpbnRlcm5hbCByZXNvdXJjZXNcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld0ludGVybmFsVGFibGUgZXh0ZW5kcyBWaWV3SW50ZXJuYWwge1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTzGki5TZXJpYWxpemFibGVSZXNvdXJjZT47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250YWluZXI6IENvbXBvbmVudENvbnRhaW5lciwgX3N0YXRlOiBWaWV3U3RhdGUpIHtcclxuICAgICAgc3VwZXIoX2NvbnRhaW5lciwgX3N0YXRlKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk9QRU4sIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5DUkVBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuTU9ESUZZLCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgLy8gdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuVEVTVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuU0VMRUNULCB0aGlzLmhuZEV2ZW50KTtcclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcijGknVpLkVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5SRU5BTUUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ09OVEVYVE1FTlUsIHRoaXMub3BlbkNvbnRleHRNZW51KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmhuZEtleWJvYXJkRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsaXN0UmVzb3VyY2VzKCk6IHZvaWQge1xyXG4gICAgICB3aGlsZSAodGhpcy5kb20ubGFzdENoaWxkICYmIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmxhc3RDaGlsZCkpO1xyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+KG5ldyBDb250cm9sbGVyVGFibGVSZXNvdXJjZSgpLCBPYmplY3QudmFsdWVzKMaSLlByb2plY3QucmVzb3VyY2VzKSwgXCJ0eXBlXCIpO1xyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgICAgdGhpcy5kb20udGl0bGUgPSBcIuKXjyBSaWdodCBjbGljayB0byBjcmVhdGUgbmV3IHJlc291cmNlLlxcbuKXjyBTZWxlY3Qgb3IgZHJhZyByZXNvdXJjZS5cIjtcclxuICAgICAgdGhpcy50YWJsZS50aXRsZSA9IFwi4pePIFNlbGVjdCB0byBlZGl0IGluIFxcXCJQcm9wZXJ0aWVzXFxcIlxcbuKXjyAgRHJhZyB0byBcXFwiUHJvcGVydGllc1xcXCIgb3IgXFxcIkNvbXBvbmVudHNcXFwiIHRvIHVzZSBpZiBhcHBsaWNhYmxlLlwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgdHIgb2YgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpIHtcclxuICAgICAgICBsZXQgdGRzOiBOb2RlTGlzdE9mPEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IHRyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZFwiKTtcclxuICAgICAgICBpZiAoIXRkcy5sZW5ndGgpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB0ZHNbMV0uY2xhc3NMaXN0LmFkZChcImljb25cIik7XHJcbiAgICAgICAgdGRzWzFdLnNldEF0dHJpYnV0ZShcImljb25cIiwgKDxIVE1MSW5wdXRFbGVtZW50PnRkc1sxXS5jaGlsZHJlblswXSkudmFsdWUpO1xyXG4gICAgICAgIGlmICh0ciBpbnN0YW5jZW9mIMaSdWkuVGFibGVJdGVtICYmICg8xpIuU2VyaWFsaXphYmxlUmVzb3VyY2VFeHRlcm5hbD50ci5kYXRhKS5zdGF0dXMgPT0gxpIuUkVTT1VSQ0VfU1RBVFVTLkVSUk9SKSB7XHJcbiAgICAgICAgICB0ci5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB0ci50aXRsZSA9IFwiRmFpbGVkIHRvIGxvYWQgcmVzb3VyY2UgZnJvbSBmaWxlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbGVjdGlvbigpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZVtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IHRoaXMgaXMgYSBwcmVwYXJhdGlvbiBmb3Igc3luY2luZyBhIGdyYXBoIHdpdGggaXRzIGluc3RhbmNlcyBhZnRlciBzdHJ1Y3R1cmFsIGNoYW5nZXNcclxuICAgIC8vIHByb3RlY3RlZCBvcGVuQ29udGV4dE1lbnUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgcm93OiBIVE1MVGFibGVSb3dFbGVtZW50ID0gPEhUTUxUYWJsZVJvd0VsZW1lbnQ+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoKF9lbGVtZW50KSA9PiAoPEhUTUxFbGVtZW50Pl9lbGVtZW50KS50YWdOYW1lID09IFwiVFJcIik7XHJcbiAgICAvLyAgIGlmIChyb3cpXHJcbiAgICAvLyAgICAgdGhpcy5jb250ZXh0TWVudS5nZXRNZW51SXRlbUJ5SWQoU3RyaW5nKENPTlRFWFRNRU5VLlNZTkNfSU5TVEFOQ0VTKSkuZW5hYmxlZCA9IChyb3cuZ2V0QXR0cmlidXRlKFwiaWNvblwiKSA9PSBcIkdyYXBoXCIpO1xyXG4gICAgLy8gICB0aGlzLmNvbnRleHRNZW51LnBvcHVwKCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgICBsZXQgaXRlbTogRWxlY3Ryb24uTWVudUl0ZW07XHJcblxyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oeyBsYWJlbDogXCJDcmVhdGUgR3JhcGhcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfR1JBUEgpLCBjbGljazogX2NhbGxiYWNrLCBhY2NlbGVyYXRvcjogXCJHXCIgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBNZXNoXCIsXHJcbiAgICAgICAgc3VibWVudTogQ29udGV4dE1lbnUuZ2V0U3ViY2xhc3NNZW51KENPTlRFWFRNRU5VLkNSRUFURV9NRVNILCDGki5NZXNoLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHtcclxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgTWF0ZXJpYWxcIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX01BVEVSSUFMLCDGki5TaGFkZXIsIF9jYWxsYmFjaylcclxuICAgICAgfSk7XHJcbiAgICAgIG1lbnUuYXBwZW5kKGl0ZW0pO1xyXG5cclxuICAgICAgaXRlbSA9IG5ldyByZW1vdGUuTWVudUl0ZW0oe1xyXG4gICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBBbmltYXRpb25cIixcclxuICAgICAgICBzdWJtZW51OiBDb250ZXh0TWVudS5nZXRTdWJjbGFzc01lbnUoQ09OVEVYVE1FTlUuQ1JFQVRFX0FOSU1BVElPTiwgxpIuQW5pbWF0aW9uLCBfY2FsbGJhY2spXHJcbiAgICAgIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICAvLyBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuQW5pbWF0aW9uU3ByaXRlLm5hbWV9YCwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5DUkVBVEVfQU5JTUFUSU9OKSwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG4gICAgICBpdGVtID0gbmV3IHJlbW90ZS5NZW51SXRlbSh7IGxhYmVsOiBgQ3JlYXRlICR7xpIuUGFydGljbGVTeXN0ZW0ubmFtZX1gLCBpZDogU3RyaW5nKENPTlRFWFRNRU5VLkNSRUFURV9QQVJUSUNMRV9FRkZFQ1QpLCBjbGljazogX2NhbGxiYWNrIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiRGVsZXRlIFJlc291cmNlXCIsIGlkOiBTdHJpbmcoQ09OVEVYVE1FTlUuREVMRVRFX1JFU09VUkNFKSwgY2xpY2s6IF9jYWxsYmFjaywgYWNjZWxlcmF0b3I6IFwiUlwiIH0pO1xyXG4gICAgICBtZW51LmFwcGVuZChpdGVtKTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiU3luYyBJbnN0YW5jZXNcIiwgaWQ6IFN0cmluZyhDT05URVhUTUVOVS5TWU5DX0lOU1RBTkNFUyksIGNsaWNrOiBfY2FsbGJhY2ssIGFjY2VsZXJhdG9yOiBcIlNcIiB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcblxyXG5cclxuICAgICAgLy8gQ29udGV4dE1lbnUuYXBwZW5kQ29weVBhc3RlKG1lbnUpO1xyXG4gICAgICByZXR1cm4gbWVudTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgbGV0IGNob2ljZTogQ09OVEVYVE1FTlUgPSBOdW1iZXIoX2l0ZW0uaWQpO1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShgTWVudVNlbGVjdCB8IGlkOiAke0NPTlRFWFRNRU5VW19pdGVtLmlkXX0gfCBldmVudDogJHtfZXZlbnR9YCk7XHJcbiAgICAgIGxldCBpU3ViY2xhc3M6IG51bWJlciA9IF9pdGVtW1wiaVN1YmNsYXNzXCJdO1xyXG4gICAgICBpZiAoIWlTdWJjbGFzcyAmJiAoY2hvaWNlID09IENPTlRFWFRNRU5VLkNSRUFURV9NRVNIIHx8IGNob2ljZSA9PSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUwpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJGdW5reSBFbGVjdHJvbi1FcnJvci4uLiBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChjaG9pY2UpIHtcclxuICAgICAgICAvL1RPRE86IGRpc3BhdGNoIENSRUFURSBpbnN0ZWFkIG9mIE1PRElGWSFcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9NRVNIOlxyXG4gICAgICAgICAgbGV0IHR5cGVNZXNoOiB0eXBlb2YgxpIuTWVzaCA9IMaSLk1lc2guc3ViY2xhc3Nlc1tpU3ViY2xhc3NdO1xyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBsZXQgbWVzaE5ldzogxpIuTWVzaCA9IG5ldyB0eXBlTWVzaCgpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG1lc2hOZXcsIG1lc2hOZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5DUkVBVEVfTUFURVJJQUw6XHJcbiAgICAgICAgICBsZXQgdHlwZVNoYWRlcjogdHlwZW9mIMaSLlNoYWRlciA9IMaSLlNoYWRlci5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgbXRyTmV3OiDGki5NYXRlcmlhbCA9IG5ldyDGki5NYXRlcmlhbCh0eXBlU2hhZGVyLm5hbWUsIHR5cGVTaGFkZXIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKG10ck5ldywgbXRyTmV3KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX0dSQVBIOlxyXG4gICAgICAgICAgbGV0IGdyYXBoOiDGki5HcmFwaCA9IGF3YWl0IMaSLlByb2plY3QucmVnaXN0ZXJBc0dyYXBoKG5ldyDGki5Ob2RlKFwiTmV3R3JhcGhcIikpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGdyYXBoLCBncmFwaCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENPTlRFWFRNRU5VLkNSRUFURV9BTklNQVRJT046XHJcbiAgICAgICAgICBsZXQgdHlwZUFuaW1hdGlvbjogdHlwZW9mIMaSLkFuaW1hdGlvbiA9IMaSLkFuaW1hdGlvbi5zdWJjbGFzc2VzW2lTdWJjbGFzc107XHJcbiAgICAgICAgICBsZXQgYW5pbWF0aW9uOiDGki5BbmltYXRpb24gPSBuZXcgdHlwZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdEludGVydmFsKGFuaW1hdGlvbiwgYW5pbWF0aW9uKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ09OVEVYVE1FTlUuQ1JFQVRFX1BBUlRJQ0xFX0VGRkVDVDpcclxuICAgICAgICAgIGxldCBwYXJ0aWNsZVN5c3RlbTogxpIuUGFydGljbGVTeXN0ZW0gPSBuZXcgxpIuUGFydGljbGVTeXN0ZW0oKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkNSRUFURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgdGhpcy50YWJsZS5zZWxlY3RJbnRlcnZhbChwYXJ0aWNsZVN5c3RlbSwgcGFydGljbGVTeXN0ZW0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDT05URVhUTUVOVS5ERUxFVEVfUkVTT1VSQ0U6XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnRhYmxlLmNvbnRyb2xsZXIuZGVsZXRlKFt0aGlzLnRhYmxlLmdldEZvY3Vzc2VkKCldKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2goRVZFTlRfRURJVE9SLkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIHByb3RlY3RlZCBobmREcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcbiAgICAgIGlmICh0aGlzLmRvbSAhPSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsIHx8IF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0V4dGVybmFsKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZXM6IERpcmVjdG9yeUVudHJ5W10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBpZiAoc291cmNlcy5zb21lKF9zb3VyY2UgPT4gIVtNSU1FLkFVRElPLCBNSU1FLklNQUdFLCBNSU1FLk1FU0gsIE1JTUUuR0xURl0uaW5jbHVkZXMoX3NvdXJjZS5nZXRNaW1lVHlwZSgpKSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpXHJcbiAgICAgICAgLy8gICBpZiAoc291cmNlLmdldE1pbWVUeXBlKCkgIT0gTUlNRS5BVURJTyAmJiBzb3VyY2UuZ2V0TWltZVR5cGUoKSAhPSBNSU1FLklNQUdFICYmIHNvdXJjZS5nZXRNaW1lVHlwZSgpICE9IE1JTUUuTUVTSClcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYXN5bmMgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCwgX3ZpZXdTb3VyY2U6IFZpZXcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKF92aWV3U291cmNlIGluc3RhbmNlb2YgVmlld0hpZXJhcmNoeSkge1xyXG4gICAgICAgIGxldCBzb3VyY2VzOiDGki5Ob2RlW10gPSBfdmlld1NvdXJjZS5nZXREcmFnRHJvcFNvdXJjZXMoKTtcclxuICAgICAgICBmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcykge1xyXG4gICAgICAgICAgYXdhaXQgxpIuUHJvamVjdC5yZWdpc3RlckFzR3JhcGgoc291cmNlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoX3ZpZXdTb3VyY2UgaW5zdGFuY2VvZiBWaWV3RXh0ZXJuYWwpIHtcclxuICAgICAgICBsZXQgc291cmNlczogRGlyZWN0b3J5RW50cnlbXSA9IF92aWV3U291cmNlLmdldERyYWdEcm9wU291cmNlcygpO1xyXG4gICAgICAgIGZvciAobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHNvdXJjZS5nZXRNaW1lVHlwZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5BVURJTzpcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgxpIuQXVkaW8oc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE1JTUUuSU1BR0U6XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cobmV3IMaSLlRleHR1cmVJbWFnZShzb3VyY2UucGF0aFJlbGF0aXZlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTUlNRS5NRVNIOlxyXG4gICAgICAgICAgICAgIMaSLkRlYnVnLmxvZyhhd2FpdCBuZXcgxpIuTWVzaE9CSigpLmxvYWQoc291cmNlLnBhdGhSZWxhdGl2ZSkpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlXHJcbiAgICAgICAgICAgICAgTUlNRS5HTFRGOlxyXG4gICAgICAgICAgICAgIGxldCBsb2FkZXI6IMaSLkdMVEZMb2FkZXIgPSBhd2FpdCDGki5HTFRGTG9hZGVyLkxPQUQoc291cmNlLnBhdGhSZWxhdGl2ZSk7XHJcbiAgICAgICAgICAgICAgbGV0IGxvYWQ6IGJvb2xlYW4gPSBhd2FpdCDGknVpLkRpYWxvZy5wcm9tcHQoVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncywgZmFsc2UsIGBTZWxlY3Qgd2hhdCB0byBpbXBvcnQgZnJvbSAnJHtsb2FkZXIubmFtZX0nYCwgXCJBZGp1c3Qgc2V0dGluZ3MgYW5kIHByZXNzIE9LXCIsIFwiT0tcIiwgXCJDYW5jZWxcIik7XHJcbiAgICAgICAgICAgICAgaWYgKCFsb2FkKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IHR5cGUgaW4gVmlld0ludGVybmFsLmdsdGZJbXBvcnRTZXR0aW5ncykgaWYgKFZpZXdJbnRlcm5hbC5nbHRmSW1wb3J0U2V0dGluZ3NbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXNvdXJjZXM6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlW10gPSBhd2FpdCBsb2FkZXIubG9hZFJlc291cmNlcyjGklt0eXBlXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZSBvZiByZXNvdXJjZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCHGki5Qcm9qZWN0LnJlc291cmNlc1tyZXNvdXJjZS5pZFJlc291cmNlXSlcclxuICAgICAgICAgICAgICAgICAgICDGki5Qcm9qZWN0LnJlZ2lzdGVyKHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuQ1JFQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlib2FyZEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBsZXQgY2VsbDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCIuc2VsZWN0ZWRcIik7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoIWlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXZlbnQgPSAoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5DUkVBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmRldGFpbD8uc2VuZGVyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIMaSdWkuRVZFTlQuTVVUQVRFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5NT0RJRlksIHt9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpJ1aS5FVkVOVC5SRU1PVkVfQ0hJTEQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoVG9QYXJlbnQoRVZFTlRfRURJVE9SLkRFTEVURSwge30pO1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDogLy8gVE9ETzogaXMgdGhpcyByZWFjaGFibGU/IElzIGl0IHN0aWxsIG5lZWRlZD9cclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULlJFTkFNRTpcclxuICAgICAgICAgIHRoaXMubGlzdFJlc291cmNlcygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFRvUGFyZW50KEVWRU5UX0VESVRPUi5VUERBVEUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBfZXZlbnQuZGV0YWlsIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBhc3luYyBvcGVuRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cclxuXHJcbiAgICAvLyAgIC8vIMaSdWkuRGlhbG9nLmRvbS5hZGRFdmVudExpc3RlbmVyKMaSdWkuRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgLy8gICBpZiAoYXdhaXQgcHJvbWlzZSkge1xyXG4gICAgLy8gICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpJ1aS5Db250cm9sbGVyLmdldE11dGF0b3Ioc2V0dGluZ3MsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICAgIHRoaXMubXV0YXRlKG11dGF0b3IpO1xyXG4gICAgLy8gICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICB9IGVsc2VcclxuICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSdWkuQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMsIMaSdWkuRGlhbG9nLmRvbSwgdGhpcy5nZXRNdXRhdG9yKCkpO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhtdXRhdG9yLCB0aGlzKTtcclxuICAgIC8vIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSVWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcbiAgaW1wb3J0IMaSQWlkID0gRnVkZ2VBaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByZXZpZXcgYSByZXNvdXJjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3UHJldmlldyBleHRlbmRzIFZpZXcge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXRyU3RhbmRhcmQ6IMaSLk1hdGVyaWFsID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVzaFN0YW5kYXJkOiDGki5NZXNoID0gVmlld1ByZXZpZXcuY3JlYXRlU3RhbmRhcmRNZXNoKCk7XHJcbiAgICBwcml2YXRlIHJlc291cmNlOiDGki5TZXJpYWxpemFibGVSZXNvdXJjZSB8IERpcmVjdG9yeUVudHJ5IHwgUmVzb3VyY2VGb2xkZXIgfCBGdW5jdGlvbjtcclxuICAgIHByaXZhdGUgdmlld3BvcnQ6IMaSLlZpZXdwb3J0O1xyXG4gICAgcHJpdmF0ZSBjbXJPcmJpdDogxpJBaWQuQ2FtZXJhT3JiaXQ7XHJcbiAgICBwcml2YXRlIHByZXZpZXdOb2RlOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBtdHhJbWFnZTogxpIuTWF0cml4M3gzID0gxpIuTWF0cml4M3gzLklERU5USVRZKCk7XHJcbiAgICBwcml2YXRlIHRpbWVvdXREZWZlcjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcblxyXG4gICAgICAvLyBjcmVhdGUgdmlld3BvcnQgZm9yIDNELXJlc291cmNlc1xyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIC8vIGNtcENhbWVyYS5waXZvdC50cmFuc2xhdGUobmV3IMaSLlZlY3RvcjMoMSwgMiwgMSkpO1xyXG4gICAgICAvLyBjbXBDYW1lcmEucGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuICAgICAgY21wQ2FtZXJhLnByb2plY3RDZW50cmFsKDEsIDQ1KTtcclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSDGkkFpZC5DYW52YXMuY3JlYXRlKHRydWUsIMaSQWlkLklNQUdFX1JFTkRFUklORy5QSVhFTEFURUQpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gbmV3IMaSLlZpZXdwb3J0KCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuaW5pdGlhbGl6ZShcIlByZXZpZXdcIiwgbnVsbCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgICAvLyDGki5SZW5kZXJXZWJHTC5zZXRDYW52YXNTaXplKDEsIDEpO1xyXG4gICAgICB0aGlzLmNtck9yYml0ID0gxpJBaWQuVmlld3BvcnQuZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KHRoaXMudmlld3BvcnQsIGZhbHNlKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZSA9IHRoaXMuY3JlYXRlU3RhbmRhcmRHcmFwaCgpO1xyXG5cclxuICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG5cclxuICAgICAgX2NvbnRhaW5lci5vbihcInJlc2l6ZVwiLCB0aGlzLnJlZHJhdyk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLkRFTEVURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJVaS5FVkVOVC5DT05URVhUTUVOVSwgdGhpcy5vcGVuQ29udGV4dE1lbnUpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5obmRNb3VzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlU3RhbmRhcmRNYXRlcmlhbCgpOiDGki5NYXRlcmlhbCB7XHJcbiAgICAgIGxldCBtdHJTdGFuZGFyZDogxpIuTWF0ZXJpYWwgPSBuZXcgxpIuTWF0ZXJpYWwoXCJTdGFuZGFyZE1hdGVyaWFsXCIsIMaSLlNoYWRlckZsYXQsIG5ldyDGki5Db2F0UmVtaXNzaXZlKMaSLkNvbG9yLkNTUyhcIndoaXRlXCIpKSk7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtdHJTdGFuZGFyZCk7XHJcbiAgICAgIHJldHVybiBtdHJTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTdGFuZGFyZE1lc2goKTogxpIuTWVzaCB7XHJcbiAgICAgIGxldCBtZXNoU3RhbmRhcmQ6IMaSLk1lc2hTcGhlcmUgPSBuZXcgxpIuTWVzaFNwaGVyZShcIlNwaGVyZVwiLCAyMCwgMTIpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIobWVzaFN0YW5kYXJkKTtcclxuICAgICAgcmV0dXJuIG1lc2hTdGFuZGFyZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uICBDb250ZXh0TWVudVxyXG4gICAgcHJvdGVjdGVkIGdldENvbnRleHRNZW51KF9jYWxsYmFjazogQ29udGV4dE1lbnVDYWxsYmFjayk6IEVsZWN0cm9uLk1lbnUge1xyXG4gICAgICBjb25zdCBtZW51OiBFbGVjdHJvbi5NZW51ID0gbmV3IHJlbW90ZS5NZW51KCk7XHJcbiAgICAgIGxldCBpdGVtOiBFbGVjdHJvbi5NZW51SXRlbTtcclxuXHJcbiAgICAgIC8vIGl0ZW0gPSBuZXcgcmVtb3RlLk1lbnVJdGVtKHsgbGFiZWw6IFwiSWxsdW1pbmF0ZSBHcmFwaFwiLCBpZDogQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV0sIGNoZWNrZWQ6IHRydWUsIHR5cGU6IFwiY2hlY2tib3hcIiwgY2xpY2s6IF9jYWxsYmFjayB9KTtcclxuICAgICAgLy8gbWVudS5hcHBlbmQoaXRlbSk7XHJcbiAgICAgIHJldHVybiBtZW51O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb250ZXh0TWVudUNhbGxiYWNrKF9pdGVtOiBFbGVjdHJvbi5NZW51SXRlbSwgX3dpbmRvdzogRWxlY3Ryb24uQnJvd3NlcldpbmRvdywgX2V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5pbmZvKGBNZW51U2VsZWN0OiBJdGVtLWlkPSR7X2l0ZW0uaWR9YCk7XHJcblxyXG4gICAgICAvLyBzd2l0Y2ggKF9pdGVtLmlkKSB7XHJcbiAgICAgIC8vIGNhc2UgQ09OVEVYVE1FTlVbQ09OVEVYVE1FTlUuSUxMVU1JTkFURV06XHJcbiAgICAgIC8vICAgdGhpcy5pbGx1bWluYXRlR3JhcGgoKTtcclxuICAgICAgLy8gICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRNb3VzZSA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKFwiZGl2I2ltYWdlXCIpO1xyXG4gICAgICBpZiAoIWRpdilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5idXR0b25zICE9IDIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWChfZXZlbnQubW92ZW1lbnRYKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWShfZXZlbnQubW92ZW1lbnRZKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ3aGVlbFwiOlxyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKFxyXG4gICAgICAgICAgICBfZXZlbnQub2Zmc2V0WCAtIHRoaXMuZG9tLmNsaWVudFdpZHRoLCBfZXZlbnQub2Zmc2V0WSAtIHRoaXMuZG9tLmNsaWVudEhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgbGV0IHpvb206IG51bWJlciA9IE1hdGguZXhwKC1fZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvZmZzZXQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLm10eEltYWdlLnNjYWxlWCh6b29tKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2Uuc2NhbGVZKHpvb20pO1xyXG4gICAgICAgICAgb2Zmc2V0LnNjYWxlKHpvb20gLSAxKTtcclxuICAgICAgICAgIHRoaXMubXR4SW1hZ2UudHJhbnNsYXRlWCgtb2Zmc2V0LngpO1xyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS50cmFuc2xhdGVZKC1vZmZzZXQueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHNldFRyYW5zZm9ybShfZGl2OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdHJhbnNmb3JtOiBGbG9hdDMyQXJyYXkgPSB0aGlzLm10eEltYWdlLmdldCgpO1xyXG4gICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0uY29weVdpdGhpbig1LCA2KTtcclxuICAgICAgdHJhbnNmb3JtID0gdHJhbnNmb3JtLmNvcHlXaXRoaW4oMiwgMyk7XHJcbiAgICAgIF9kaXYuc3R5bGUudHJhbnNmb3JtID0gYG1hdHJpeCgke3RyYW5zZm9ybS5zbGljZSgwLCA2KS5qb2luKCl9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgaWYgKCF0aGlzLnJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5kb20uaW5uZXJIVE1MID0gXCJTZWxlY3QgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgcmVzb3VyY2UgdG8gcHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcmV2aWV3XCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxpZ2h0c1ByZXNlbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSB0aGlzLnJlc291cmNlLnR5cGUgfHwgXCJGdW5jdGlvblwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLk1lc2gpXHJcbiAgICAgICAgdHlwZSA9IFwiTWVzaFwiO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgIGxldCBwcmV2aWV3T2JqZWN0OiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3T2JqZWN0XCIpO1xyXG4gICAgICBsZXQgcHJldmlldzogSFRNTEVsZW1lbnQ7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJGdW5jdGlvblwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlU2NyaXB0UHJldmlldyg8RnVuY3Rpb24+dGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBpZiAocHJldmlldylcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQocHJldmlldyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRmlsZVwiOlxyXG4gICAgICAgICAgcHJldmlldyA9IHRoaXMuY3JlYXRlRmlsZVByZXZpZXcoPERpcmVjdG9yeUVudHJ5PnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgaWYgKHByZXZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHByZXZpZXcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIk1lc2hcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNZXNoKDzGki5NZXNoPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbChWaWV3UHJldmlldy5tdHJTdGFuZGFyZCkpO1xyXG4gICAgICAgICAgdGhpcy5zZXRWaWV3T2JqZWN0KHByZXZpZXdPYmplY3QpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldENhbWVyYSgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNYXRlcmlhbFwiOlxyXG4gICAgICAgICAgcHJldmlld09iamVjdC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goVmlld1ByZXZpZXcubWVzaFN0YW5kYXJkKSk7XHJcbiAgICAgICAgICBwcmV2aWV3T2JqZWN0LmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwoPMaSLk1hdGVyaWFsPnRoaXMucmVzb3VyY2UpKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHRoaXMucmVzZXRDYW1lcmEoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiR3JhcGhcIjpcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYXBwZW5kQ2hpbGQoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUoPMaSLkdyYXBoPnRoaXMucmVzb3VyY2UpO1xyXG4gICAgICAgICAgbGlnaHRzUHJlc2VudCA9IGZhbHNlO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLmxpZ2h0cy5mb3JFYWNoKChfYXJyYXk6IMaSLlJlY3ljYWJsZUFycmF5PMaSLkNvbXBvbmVudExpZ2h0PikgPT4gbGlnaHRzUHJlc2VudCB8fD0gX2FycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgdGhpcy5pbGx1bWluYXRlKCFsaWdodHNQcmVzZW50KTtcclxuICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7bGlnaHRzUHJlc2VudCA/IFwiUFJFVklFV1wiIDogXCJQcmV2aWV3XCJ9IHwgJHt0aGlzLnJlc291cmNlLm5hbWV9YCk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICDGki5QaHlzaWNzLmFjdGl2ZUluc3RhbmNlID0gUGFnZS5nZXRQaHlzaWNzKDzGki5HcmFwaD50aGlzLnJlc291cmNlKTtcclxuICAgICAgICAgIHRoaXMuc2V0Vmlld09iamVjdChwcmV2aWV3T2JqZWN0KTtcclxuICAgICAgICAgIHByZXZpZXdPYmplY3QuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVC5NVVRBVEUsIChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmZXIoKCkgPT4gdGhpcy5kaXNwYXRjaChFVkVOVF9FRElUT1IuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRleHR1cmVJbWFnZVwiOlxyXG4gICAgICAgIGNhc2UgXCJBbmltYXRpb25TcHJpdGVcIjpcclxuICAgICAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGRpdi5pZCA9IFwiaW1hZ2VcIjtcclxuICAgICAgICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAodHlwZSA9PSBcIlRleHR1cmVJbWFnZVwiKSB7XHJcbiAgICAgICAgICAgIGltZyA9ICg8xpIuVGV4dHVyZUltYWdlPnRoaXMucmVzb3VyY2UpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25TcHJpdGU6IMaSLkFuaW1hdGlvblNwcml0ZSA9IDzGki5BbmltYXRpb25TcHJpdGU+dGhpcy5yZXNvdXJjZTtcclxuICAgICAgICAgICAgaW1nID0gKDzGki5UZXh0dXJlSW1hZ2U+YW5pbWF0aW9uU3ByaXRlLnRleHR1cmUpLmltYWdlO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uczogxpIuVmVjdG9yMltdID0gYW5pbWF0aW9uU3ByaXRlLmdldFBvc2l0aW9ucygpO1xyXG4gICAgICAgICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IGFuaW1hdGlvblNwcml0ZS5nZXRNdXRhdG9yKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBvc2l0aW9uIG9mIHBvc2l0aW9ucykge1xyXG4gICAgICAgICAgICAgIGxldCByZWN0OiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgICByZWN0LmNsYXNzTmFtZSA9IFwicmVjdFNwcml0ZVwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUubGVmdCA9IHBvc2l0aW9uLnggKyAxICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgIHJlY3Quc3R5bGUudG9wID0gcG9zaXRpb24ueSArIDEgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgcmVjdC5zdHlsZS53aWR0aCA9IG11dGF0b3Iuc2l6ZS54IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICByZWN0LnN0eWxlLmhlaWdodCA9IG11dGF0b3Iuc2l6ZS55IC0gMiArIFwicHhcIjtcclxuICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybShkaXYpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkF1ZGlvXCI6XHJcbiAgICAgICAgICBsZXQgZW50cnk6IERpcmVjdG9yeUVudHJ5ID0gbmV3IERpcmVjdG9yeUVudHJ5KCg8xpIuQXVkaW8+dGhpcy5yZXNvdXJjZSkucGF0aC50b1N0cmluZygpLCBcIlwiLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQXVkaW9QcmV2aWV3KGVudHJ5KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OiBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUaXRsZShgUHJldmlldyB8ICR7dGhpcy5yZXNvdXJjZS5uYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhbmRhcmRHcmFwaCgpOiDGki5Ob2RlIHtcclxuICAgICAgbGV0IGdyYXBoOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoXCJQcmV2aWV3U2NlbmVcIik7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuc2V0QnJhbmNoKGdyYXBoKTtcclxuXHJcbiAgICAgIGxldCBub2RlTGlnaHQ6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdJbGx1bWluYXRpb25cIik7XHJcbiAgICAgIGdyYXBoLmFkZENoaWxkKG5vZGVMaWdodCk7XHJcbiAgICAgIMaSQWlkLmFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKG5vZGVMaWdodCk7XHJcblxyXG4gICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLnZpZXdwb3J0LmNhbnZhcyk7XHJcblxyXG4gICAgICBsZXQgcHJldmlld05vZGU6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShcIlByZXZpZXdOb2RlXCIpO1xyXG4gICAgICBncmFwaC5hZGRDaGlsZChwcmV2aWV3Tm9kZSk7XHJcbiAgICAgIHJldHVybiBwcmV2aWV3Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFZpZXdPYmplY3QoX25vZGU6IMaSLk5vZGUsIF9ncmFwaElsbHVtaW5hdGlvbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgdGhpcy5wcmV2aWV3Tm9kZS5hZGRDaGlsZChfbm9kZSk7XHJcbiAgICAgIHRoaXMuaWxsdW1pbmF0ZSh0cnVlKTtcclxuICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy52aWV3cG9ydC5jYW52YXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaWxsdW1pbmF0ZShfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IG5vZGVMaWdodDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk/LmdldENoaWxkcmVuQnlOYW1lKFwiUHJldmlld0lsbHVtaW5hdGlvblwiKVswXTtcclxuICAgICAgbm9kZUxpZ2h0LmFjdGl2YXRlKF9vbik7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVGaWxlUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgbWltZTogTUlNRSA9IF9lbnRyeS5nZXRNaW1lVHlwZSgpO1xyXG4gICAgICBzd2l0Y2ggKG1pbWUpIHtcclxuICAgICAgICBjYXNlIE1JTUUuVEVYVDogcmV0dXJuIHRoaXMuY3JlYXRlVGV4dFByZXZpZXcoX2VudHJ5KTtcclxuICAgICAgICBjYXNlIE1JTUUuQVVESU86IHJldHVybiB0aGlzLmNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnkpO1xyXG4gICAgICAgIGNhc2UgTUlNRS5JTUFHRTogcmV0dXJuIHRoaXMuY3JlYXRlSW1hZ2VQcmV2aWV3KF9lbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUZXh0UHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIHByZS50ZXh0Q29udGVudCA9IF9lbnRyeS5nZXRGaWxlQ29udGVudCgpO1xyXG4gICAgICByZXR1cm4gcHJlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbWFnZVByZXZpZXcoX2VudHJ5OiBEaXJlY3RvcnlFbnRyeSk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgIGltZy5zcmMgPSBfZW50cnkucGF0aDtcclxuICAgICAgaW1nLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIGJsYWNrXCI7XHJcbiAgICAgIHJldHVybiBpbWc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUF1ZGlvUHJldmlldyhfZW50cnk6IERpcmVjdG9yeUVudHJ5KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgYXVkaW86IEhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgIGF1ZGlvLnNyYyA9IF9lbnRyeS5wYXRoO1xyXG4gICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgIGF1ZGlvLmNvbnRyb2xzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGF1ZGlvO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY3JpcHRQcmV2aWV3KF9zY3JpcHQ6IEZ1bmN0aW9uKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcHJlOiBIVE1MUHJlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbiAgICAgIGxldCBjb2RlOiBzdHJpbmcgPSBfc2NyaXB0LnRvU3RyaW5nKCk7XHJcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoXCIgICAgXCIsIFwiIFwiKTtcclxuICAgICAgcHJlLnRleHRDb250ZW50ID0gY29kZTtcclxuICAgICAgcmV0dXJuIHByZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLk1PRElGWTpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgICAvLyBpZiAoW8aSLkF1ZGlvLCDGki5UZXh0dXJlLCDGki5BbmltYXRpb25TcHJpdGVdLnNvbWUoKF90eXBlKSA9PiB0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgX3R5cGUpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkF1ZGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5UZXh0dXJlIHx8XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5BbmltYXRpb25TcHJpdGUpXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuICAgICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuZGV0YWlsKVxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgZWxzZSBpZiAoX2V2ZW50LmRldGFpbC5kYXRhIGluc3RhbmNlb2YgU2NyaXB0SW5mbylcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IF9ldmVudC5kZXRhaWwuZGF0YS5zY3JpcHQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSBfZXZlbnQuZGV0YWlsLmRhdGE7XHJcblxyXG4gICAgICAgICAgdGhpcy5tdHhJbWFnZS5yZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldENhbWVyYSgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogxpIuTm9kZSA9IHRoaXMudmlld3BvcnQuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIMaSLlJlbmRlci5wcmVwYXJlKGJyYW5jaCk7XHJcbiAgICAgIGxldCByOiBudW1iZXIgPSBicmFuY2gucmFkaXVzO1xyXG5cclxuICAgICAgdGhpcy5jbXJPcmJpdC5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IMaSLlZlY3RvcjMuWkVSTygpO1xyXG4gICAgICDGki5SZW5kZXIucHJlcGFyZSh0aGlzLmNtck9yYml0KTtcclxuICAgICAgdGhpcy5jbXJPcmJpdC5yb3RhdGlvblggPSAtMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQucm90YXRpb25ZID0gMzA7XHJcbiAgICAgIHRoaXMuY21yT3JiaXQuZGlzdGFuY2UgPSByICogMztcclxuICAgICAgxpIuUmVuZGVyLnByZXBhcmUodGhpcy5jbXJPcmJpdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMCB8fCB0aGlzLnZpZXdwb3J0LmNhbnZhcy5jbGllbnRIZWlnaHQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiDGki5HcmFwaClcclxuICAgICAgICAgIMaSLlBoeXNpY3MuYWN0aXZlSW5zdGFuY2UgPSBQYWdlLmdldFBoeXNpY3ModGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcjogdW5rbm93bikge1xyXG4gICAgICAgIC8vbm9wXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBkZWZlcihfZnVuY3Rpb246IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVvdXREZWZlcilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMudGltZW91dERlZmVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIF9mdW5jdGlvbigpO1xyXG4gICAgICAgIHRoaXMudGltZW91dERlZmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGltcG9ydCDGknVpID0gRnVkZ2VVc2VySW50ZXJmYWNlO1xyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHRoZSBwcm9wZXJ0aWVzIG9mIGEgcmVzb3VyY2VcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDIwICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVmlld1Byb3BlcnRpZXMgZXh0ZW5kcyBWaWV3IHtcclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IMaSLlNlcmlhbGl6YWJsZVJlc291cmNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udGFpbmVyOiBDb21wb25lbnRDb250YWluZXIsIF9zdGF0ZTogVmlld1N0YXRlKSB7XHJcbiAgICAgIHN1cGVyKF9jb250YWluZXIsIF9zdGF0ZSk7XHJcbiAgICAgIHRoaXMuZmlsbENvbnRlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoxpJ1aS5FVkVOVC5NVVRBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5TRUxFQ1QsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5NT0RJRlksIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5ERUxFVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKEVWRU5UX0VESVRPUi5VUERBVEUsIHRoaXMuaG5kRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHdoaWxlICh0aGlzLmRvbS5sYXN0Q2hpbGQgJiYgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20ubGFzdENoaWxkKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzb3VyY2UpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250ZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG4gICAgICBpZiAodGhpcy5yZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJQcm9wZXJ0aWVzIHwgXCIgKyB0aGlzLnJlc291cmNlLm5hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSkge1xyXG4gICAgICAgICAgbGV0IGZpZWxkc2V0OiDGknVpLkRldGFpbHMgPSDGknVpLkdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUodGhpcy5yZXNvdXJjZSk7XHJcbiAgICAgICAgICBsZXQgdWlNdXRhYmxlOiBDb250cm9sbGVyRGV0YWlsID0gbmV3IENvbnRyb2xsZXJEZXRhaWwodGhpcy5yZXNvdXJjZSwgZmllbGRzZXQsIHRoaXMpO1xyXG4gICAgICAgICAgY29udGVudCA9IHVpTXV0YWJsZS5kb21FbGVtZW50O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIERpcmVjdG9yeUVudHJ5ICYmIHRoaXMucmVzb3VyY2Uuc3RhdHMpIHtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiU2l6ZTogXCIgKyAodGhpcy5yZXNvdXJjZS5zdGF0c1tcInNpemVcIl0gLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS2lCPGJyLz5cIjtcclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IFwiQ3JlYXRlZDogXCIgKyB0aGlzLnJlc291cmNlLnN0YXRzW1wiYmlydGh0aW1lXCJdLnRvTG9jYWxlU3RyaW5nKCkgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCArPSBcIk1vZGlmaWVkOiBcIiArIHRoaXMucmVzb3VyY2Uuc3RhdHNbXCJjdGltZVwiXS50b0xvY2FsZVN0cmluZygpICsgXCI8YnIvPlwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvdXJjZSBpbnN0YW5jZW9mIMaSLkdyYXBoKSB7XHJcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IHRoaXMucmVzb3VyY2UudG9IaWVyYXJjaHlTdHJpbmcoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgaW5zdGFuY2VvZiBTY3JpcHRJbmZvKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5yZXNvdXJjZS5zY3JpcHQpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gdGhpcy5yZXNvdXJjZS5zY3JpcHRba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICB2YWx1ZSA9IFwiQXJyYXkoXCIgKyB2YWx1ZS5sZW5ndGggKyBcIilcIjtcclxuICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgKz0ga2V5ICsgXCI6IFwiICsgdmFsdWUgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2VGb2xkZXIpIHtcclxuICAgICAgICAgIGxldCBlbnRyaWVzOiB7IFtuYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLnJlc291cmNlLmVudHJpZXMpIHtcclxuICAgICAgICAgICAgZW50cmllc1tlbnRyeS50eXBlXSA9IChlbnRyaWVzW2VudHJ5LnR5cGVdID8/IDApICsgMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gYEVudHJpZXM6ICR7dGhpcy5yZXNvdXJjZS5lbnRyaWVzLmxlbmd0aH08YnIvPmA7XHJcbiAgICAgICAgICBmb3IgKGxldCB0eXBlIGluIGVudHJpZXMpXHJcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IGAke3R5cGV9OiAke2VudHJpZXNbdHlwZV19PGJyLz5gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFRpdGxlKFwiUHJvcGVydGllc1wiKTtcclxuICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IFwiU2VsZWN0IGFuIGludGVybmFsIG9yIGV4dGVybmFsIHJlc291cmNlIHRvIGV4YW1pbmUgcHJvcGVydGllc1wiO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZChjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV2ZW50ID0gKF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlRfRURJVE9SLlNFTEVDVDpcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLnJlc291cmNlID0gPMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPihfZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuVVBEQVRFOlxyXG4gICAgICAgICAgdGhpcy5maWxsQ29udGVudCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGknVpLkVWRU5ULk1VVEFURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hUb1BhcmVudChFVkVOVF9FRElUT1IuVVBEQVRFLCB7fSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5NT0RJRlk6XHJcbiAgICAgICAgICB0aGlzLmZpbGxDb250ZW50KCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgaW1wb3J0IMaSdWkgPSBGdWRnZVVzZXJJbnRlcmZhY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIHNjcmlwdHMgbG9hZGVkXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyMC0yM1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBWaWV3U2NyaXB0IGV4dGVuZHMgVmlldyB7XHJcbiAgICAvLyBUT0RPOiBjb25zaWRlciBzY3JpcHQgbmFtZXNwYWNlcyDGki5TY3JpcHROYW1lc3BhY2VzIHRvIGZpbmQgYWxsIHNjcmlwdHMgbm90IGp1c3QgQ29tcG9uZW50U2NyaXB0c1xyXG4gICAgcHJpdmF0ZSB0YWJsZTogxpJ1aS5UYWJsZTxTY3JpcHRJbmZvPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRhaW5lcjogQ29tcG9uZW50Q29udGFpbmVyLCBfc3RhdGU6IFZpZXdTdGF0ZSkge1xyXG4gICAgICBzdXBlcihfY29udGFpbmVyLCBfc3RhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9FRElUT1IuT1BFTiwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlVQREFURSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLlNFTEVDVCwgdGhpcy5obmRFdmVudCk7XHJcbiAgICAgIC8vIHRoaXMuZG9tLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfRURJVE9SLk1PRElGWSwgdGhpcy5obmRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpc3RTY3JpcHRzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmRvbS50aXRsZSA9IGBEcmFnICYgZHJvcCBzY3JpcHRzIG9uIFwiQ29tcG9uZW50c1wiYDtcclxuICAgICAgd2hpbGUgKHRoaXMuZG9tLmxhc3RDaGlsZCAmJiB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5sYXN0Q2hpbGQpKTtcclxuICAgICAgbGV0IHNjcmlwdGluZm9zOiBTY3JpcHRJbmZvW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgbmFtZXNwYWNlIGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlcykge1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4IGluIMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdKSB7XHJcbiAgICAgICAgICBsZXQgc2NyaXB0OiBGdW5jdGlvbiA9IMaSLlByb2plY3Quc2NyaXB0TmFtZXNwYWNlc1tuYW1lc3BhY2VdW2luZGV4XTtcclxuICAgICAgICAgIGlmIChzY3JpcHQubmFtZSlcclxuICAgICAgICAgICAgc2NyaXB0aW5mb3MucHVzaChuZXcgU2NyaXB0SW5mbyhzY3JpcHQsIG5hbWVzcGFjZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYmxlID0gbmV3IMaSdWkuVGFibGU8U2NyaXB0SW5mbz4obmV3IENvbnRyb2xsZXJUYWJsZVNjcmlwdCgpLCBzY3JpcHRpbmZvcyk7XHJcbiAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZWxlY3Rpb24oKTogU2NyaXB0SW5mb1tdIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGFibGUuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERyYWdEcm9wU291cmNlcygpOiBTY3JpcHRJbmZvW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy50YWJsZS5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiAgQ29udGV4dE1lbnVcclxuICAgIC8vIHByb3RlY3RlZCBnZXRDb250ZXh0TWVudShfY2FsbGJhY2s6IENvbnRleHRNZW51Q2FsbGJhY2spOiBFbGVjdHJvbi5NZW51IHtcclxuICAgIC8vICAgY29uc3QgbWVudTogRWxlY3Ryb24uTWVudSA9IG5ldyByZW1vdGUuTWVudSgpO1xyXG4gICAgLy8gICByZXR1cm4gbWVudTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcm90ZWN0ZWQgY29udGV4dE1lbnVDYWxsYmFjayhfaXRlbTogRWxlY3Ryb24uTWVudUl0ZW0sIF93aW5kb3c6IEVsZWN0cm9uLkJyb3dzZXJXaW5kb3csIF9ldmVudDogRWxlY3Ryb24uRXZlbnQpOiB2b2lkIHtcclxuICAgIC8vICAgxpIuRGVidWcuZnVkZ2UoYE1lbnVTZWxlY3QgfCBpZDogJHtDT05URVhUTUVOVVtfaXRlbS5pZF19IHwgZXZlbnQ6ICR7X2V2ZW50fWApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgcHJpdmF0ZSBobmRFdmVudCA9IChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5UX0VESVRPUi5VUERBVEU6XHJcbiAgICAgICAgY2FzZSBFVkVOVF9FRElUT1IuT1BFTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmRldGFpbC5kYXRhKVxyXG4gICAgICAgICAgICB0aGlzLmxpc3RTY3JpcHRzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn0iXX0=