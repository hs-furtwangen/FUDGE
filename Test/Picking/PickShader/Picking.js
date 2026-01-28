var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var Picking;
(function (Picking) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    var ƒAid = FudgeAid;
    window.addEventListener("load", start);
    let cmpCamera;
    let viewport;
    let mouse = new ƒ.Vector2();
    let cursor = new ƒAid.Node("Cursor", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(0.05)), new ƒ.Material("Cursor", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("darkgray"))), new ƒ.MeshSphere("Cursor", 5, 5));
    let Data = (() => {
        let _classSuper = ƒ.Mutable;
        let _red_decorators;
        let _red_initializers = [];
        let _red_extraInitializers = [];
        let _green_decorators;
        let _green_initializers = [];
        let _green_extraInitializers = [];
        let _blue_decorators;
        let _blue_initializers = [];
        let _blue_extraInitializers = [];
        let _yellow_decorators;
        let _yellow_initializers = [];
        let _yellow_extraInitializers = [];
        let _cursor_decorators;
        let _cursor_initializers = [];
        let _cursor_extraInitializers = [];
        return class Data extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _red_decorators = [ƒ.mutate(Number)];
                _green_decorators = [ƒ.mutate(Number)];
                _blue_decorators = [ƒ.mutate(Number)];
                _yellow_decorators = [ƒ.mutate(Number)];
                _cursor_decorators = [ƒ.mutate(Number)];
                __esDecorate(null, null, _red_decorators, { kind: "field", name: "red", static: false, private: false, access: { has: obj => "red" in obj, get: obj => obj.red, set: (obj, value) => { obj.red = value; } }, metadata: _metadata }, _red_initializers, _red_extraInitializers);
                __esDecorate(null, null, _green_decorators, { kind: "field", name: "green", static: false, private: false, access: { has: obj => "green" in obj, get: obj => obj.green, set: (obj, value) => { obj.green = value; } }, metadata: _metadata }, _green_initializers, _green_extraInitializers);
                __esDecorate(null, null, _blue_decorators, { kind: "field", name: "blue", static: false, private: false, access: { has: obj => "blue" in obj, get: obj => obj.blue, set: (obj, value) => { obj.blue = value; } }, metadata: _metadata }, _blue_initializers, _blue_extraInitializers);
                __esDecorate(null, null, _yellow_decorators, { kind: "field", name: "yellow", static: false, private: false, access: { has: obj => "yellow" in obj, get: obj => obj.yellow, set: (obj, value) => { obj.yellow = value; } }, metadata: _metadata }, _yellow_initializers, _yellow_extraInitializers);
                __esDecorate(null, null, _cursor_decorators, { kind: "field", name: "cursor", static: false, private: false, access: { has: obj => "cursor" in obj, get: obj => obj.cursor, set: (obj, value) => { obj.cursor = value; } }, metadata: _metadata }, _cursor_initializers, _cursor_extraInitializers);
                if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            reduceMutator(_mutator) { }
            constructor() {
                super(...arguments);
                this.red = __runInitializers(this, _red_initializers, 1);
                this.green = (__runInitializers(this, _red_extraInitializers), __runInitializers(this, _green_initializers, 1));
                this.blue = (__runInitializers(this, _green_extraInitializers), __runInitializers(this, _blue_initializers, 1));
                this.yellow = (__runInitializers(this, _blue_extraInitializers), __runInitializers(this, _yellow_initializers, 1));
                this.cursor = (__runInitializers(this, _yellow_extraInitializers), __runInitializers(this, _cursor_initializers, 1));
                __runInitializers(this, _cursor_extraInitializers);
            }
        };
    })();
    let data = new Data();
    let uiController;
    async function start(_event) {
        ƒ.Debug.fudge("Start Picking");
        let domHud = document.querySelector("div#ui");
        const details = ƒUi.Generator.createDetailsFromMutable(data);
        uiController = new ƒUi.Controller(data, details);
        domHud.appendChild(details);
        await FudgeCore.Project.loadResourcesFromHTML();
        let canvas = document.querySelector("canvas");
        canvas.addEventListener("mousemove", setCursorPosition);
        // pick the graph to show
        let graph = await ƒ.Project.getResource("Graph|2021-02-03T16:20:47.935Z|07303");
        graph.appendChild(cursor);
        // setup the viewport
        cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.near = 1;
        cmpCamera.far = 7.3;
        cmpCamera.mtxPivot.translateX(0.3);
        cmpCamera.mtxPivot.translateZ(2.1);
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
        function update(_event) {
            viewport.draw();
            pick();
        }
    }
    function pick() {
        cursor.getComponent(ƒ.ComponentMesh).activate(false);
        let picks = ƒ.Picker.pickViewport(viewport, mouse);
        cursor.getComponent(ƒ.ComponentMesh).activate(true);
        picks.sort((_a, _b) => _a.zBuffer > _b.zBuffer ? 1 : -1);
        for (let hit of picks) {
            data[hit.node.name] = hit.zBuffer;
        }
        if (picks.length) {
            let pick = picks[0];
            cursor.mtxLocal.translation = pick.posWorld;
            // console.log(pick.normal.toString());
        }
    }
    function setCursorPosition(_event) {
        mouse = new ƒ.Vector2(_event.clientX, _event.clientY);
    }
})(Picking || (Picking = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlja2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBpY2tpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQVUsT0FBTyxDQTRGaEI7QUE1RkQsV0FBVSxPQUFPO0lBQ2YsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQU8sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBQ2hDLElBQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUV2QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLElBQUksU0FBNEIsQ0FBQztJQUNqQyxJQUFJLFFBQW9CLENBQUM7SUFDekIsSUFBSSxLQUFLLEdBQWMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFdkMsSUFBSSxNQUFNLEdBQWMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUNuQyxRQUFRLEVBQ1IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDeEMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQ2pGLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNqQyxDQUFDO1FBRUksSUFBSTswQkFBUyxDQUFDLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7OztxQkFBdEIsSUFBSyxTQUFRLFdBQVM7OzttQ0FDekIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7cUNBRWhCLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO29DQUVo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