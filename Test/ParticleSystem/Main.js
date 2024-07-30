var ParticleSystemTest;
(function (ParticleSystemTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(ParticleSystemTest);
    let viewport;
    window.addEventListener("load", init);
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        await ƒ.Project.loadResourcesFromHTML();
        let graph = ƒ.Project.resources[graphId];
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.dispatchEvent(new CustomEvent("start"));
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        function update(_event) {
            viewport.draw();
        }
    }
    class ParticleSystemController extends ƒ.ComponentScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(ParticleSystemController); }
        #cmpParticleSystem;
        constructor() {
            super();
            this.dependencyNames = "";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        ƒ.Loop.addEventListener("start", this.start);
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.start = (_event) => {
                this.#cmpParticleSystem = this.node.getComponent(ƒ.ComponentParticleSystem);
                let activation = document.getElementById(this.node.name.toLocaleLowerCase());
                let size = document.getElementById(this.node.name.toLocaleLowerCase() + "size");
                activation.checked = this.node.isActive;
                size.value = this.#cmpParticleSystem.size.toString();
                activation.onchange = (_event) => {
                    this.node.activate(activation.checked);
                    size.hidden = !activation.checked;
                    this.dependencies.forEach(_node => _node.activate(activation.checked));
                };
                size.onchange = (_event) => {
                    this.#cmpParticleSystem.size = size.valueAsNumber;
                };
                activation.dispatchEvent(new Event("change"));
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        get dependencies() {
            let dependencies = [];
            let root = this.node?.getAncestor();
            if (!root)
                return dependencies;
            for (let name of this.dependencyNames.split(", ")) {
                let dependency;
                for (let descendant of root) {
                    if (descendant.name == name) {
                        dependency = descendant;
                        break;
                    }
                }
                if (dependency)
                    dependencies.push(dependency);
            }
            return dependencies;
        }
    }
    ParticleSystemTest.ParticleSystemController = ParticleSystemController;
})(ParticleSystemTest || (ParticleSystemTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxrQkFBa0IsQ0FtSDNCO0FBbkhELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXRELElBQUksUUFBb0IsQ0FBQztJQUN6QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXRDLEtBQUssVUFBVSxJQUFJO1FBQ2pCLElBQUksT0FBTyxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksS0FBSyxHQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1QsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixJQUFJLFNBQVMsR0FBc0IsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0QsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLFFBQVEsQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxD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