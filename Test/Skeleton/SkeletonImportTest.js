var SkeletonTest;
(function (SkeletonTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        let graph = ƒ.Project.resources[graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        // cmpCamera.clrBackground = ƒ.Color.CSS("SKYBLUE");
        let canvas = document.querySelector("canvas");
        SkeletonTest.viewport = new ƒ.Viewport();
        SkeletonTest.viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", SkeletonTest.viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
        canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in ƒAid)
        ƒAid.Viewport.expandCameraToInteractiveOrbit(SkeletonTest.viewport);
        graph.addChild(new ƒ.Node("placeholder"));
        let timeSpan = document.querySelector('span[is="ui-time"]');
        timeSpan.get = () => {
            let cmpAnimation = SkeletonTest.loaded?.getComponent(ƒ.ComponentAnimation);
            return cmpAnimation ? cmpAnimation.time.toFixed(0) : "0";
        };
        let gPressed = false;
        let iShader = 0;
        const shaders = [ƒ.ShaderFlatSkin, ƒ.ShaderGouraudSkin, ƒ.ShaderPhongSkin];
        let cmpLightDirectional = graph.getChildrenByName("Light")[0]?.getComponents(ƒ.ComponentLight)?.find((_cmp) => _cmp.lightType == ƒ.LIGHT_TYPE.DIRECTIONAL);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            cmpLightDirectional.mtxPivot.rotation = new ƒ.Vector3(cmpCamera.mtxWorld.rotation.x, cmpCamera.mtxWorld.rotation.y, 0);
            const setShader = _shader => {
                for (const node of graph) {
                    if (node.getComponent(ƒ.ComponentMaterial))
                        node.getComponent(ƒ.ComponentMaterial).material.setShader(_shader);
                }
            };
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G])) {
                if (!gPressed) {
                    gPressed = true;
                    setShader(shaders[iShader = (iShader + 1) % shaders.length]);
                }
            }
            else
                gPressed = false;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H]))
                setShader(ƒ.ShaderPhong);
            SkeletonTest.viewport.draw();
        }
        document.addEventListener("keydown", hndKeydown);
        function hndKeydown(_event) {
            switch (_event.code) {
                case ƒ.KEYBOARD_CODE.SPACE:
                    SkeletonTest.cmpAnimation?.jumpTo(0);
                    break;
                case ƒ.KEYBOARD_CODE.P:
                    ƒ.Time.game.setScale(ƒ.Time.game.getScale() == 0 ? 1 : 0);
                    break;
                case ƒ.KEYBOARD_CODE.D:
                    SkeletonTest.cmpAnimation?.jumpTo(SkeletonTest.cmpAnimation.time + 50);
                    break;
                case ƒ.KEYBOARD_CODE.A:
                    SkeletonTest.cmpAnimation?.jumpTo(SkeletonTest.cmpAnimation.time - 50);
                    break;
                case ƒ.KEYBOARD_CODE.W:
                    ƒ.Time.game.setScale(ƒ.Time.game.getScale() * 2);
                    break;
                case ƒ.KEYBOARD_CODE.S:
                    ƒ.Time.game.setScale(ƒ.Time.game.getScale() / 2);
                    break;
                case ƒ.KEYBOARD_CODE.L:
                    console.log(SkeletonTest.loaded.getChild(0)?.mtxWorld.toString());
                    break;
            }
        }
        SkeletonTest.slcFile = document.getElementById("file");
        SkeletonTest.slcAmount = document.getElementById("amount");
        const selectedFile = parseInt(sessionStorage.getItem('selectedFile'));
        if (selectedFile != undefined)
            SkeletonTest.slcFile.selectedIndex = selectedFile;
        const selectedAmount = parseInt(sessionStorage.getItem('selectedAmount'));
        if (selectedAmount != undefined)
            SkeletonTest.slcAmount.selectedIndex = selectedAmount;
        load();
    }
})(SkeletonTest || (SkeletonTest = {}));
async function load() {
    // load scene
    SkeletonTest.loader = await FudgeCore.GLTFLoader.LOAD(SkeletonTest.slcFile.value);
    const amount = parseInt(SkeletonTest.slcAmount.value);
    if (amount == 1) {
        SkeletonTest.loaded = await SkeletonTest.loader.getGraph();
        let animation = await SkeletonTest.loader.getAnimation(0);
        FudgeCore.Project.register(animation);
        if (animation && !SkeletonTest.loaded.getComponent(FudgeCore.ComponentAnimation))
            SkeletonTest.loaded.addComponent(new FudgeCore.ComponentAnimation(animation));
    }
    else {
        SkeletonTest.loaded = new FudgeCore.Node("Scene");
        for (let i = 0; i < amount; i++) {
            let graph = await SkeletonTest.loader.getGraph();
            FudgeCore.Project.register(graph);
            let instance = await FudgeCore.Project.createGraphInstance(graph);
            let animation = await SkeletonTest.loader.getAnimation(0);
            if (animation && !instance.getComponent(FudgeCore.ComponentAnimation))
                instance.addComponent(new FudgeCore.ComponentAnimation(animation));
            instance.addComponent(new FudgeCore.ComponentTransform());
            instance.name = "instance" + i;
            instance.mtxLocal.translateX((i * 2 - (amount - 1)) * 1.5);
            SkeletonTest.loaded.addChild(instance);
        }
    }
    SkeletonTest.cmpAnimation = SkeletonTest.loaded?.getComponent(FudgeCore.ComponentAnimation);
    // SkeletonTest.loaded.name = "loaded";
    // loaded.getComponent(FudgeCore.ComponentAnimation)?.activate(false);
    let root = SkeletonTest.viewport.getBranch();
    let loaded = root.getChildrenByName("Scene")[0];
    if (loaded)
        root.replaceChild(loaded, SkeletonTest.loaded);
    else
        root.appendChild(SkeletonTest.loaded);
    FudgeCore.Debug.log("Loader:", SkeletonTest.loader);
    FudgeCore.Debug.log("Loaded:", SkeletonTest.loaded);
    // To store the selected option in sessionStorage
    sessionStorage.setItem('selectedFile', SkeletonTest.slcFile.selectedIndex.toString());
    sessionStorage.setItem('selectedAmount', SkeletonTest.slcAmount.selectedIndex.toString());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tlbGV0b25JbXBvcnRUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2tlbGV0b25JbXBvcnRUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsWUFBWSxDQWtIckI7QUFsSEQsV0FBVSxZQUFZO0lBQ3BCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQVF0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixJQUFJLE9BQU8sR0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3Riw0Q0FBNEM7UUFDNUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MseUJBQXlCO1FBQ3pCLElBQUksS0FBSyxHQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1gsS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUM7WUFDbEcsT0FBTztRQUNULENBQUM7UUFDRCxxQkFBcUI7UUFDckIsSUFBSSxTQUFTLEdBQXNCLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNELG9EQUFvRDtRQUNwRCxJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxhQUFBLFFB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