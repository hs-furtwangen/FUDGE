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
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
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
        let cmpLightDirectional = graph.getChildrenByName("Light")[0]?.getComponents(ƒ.ComponentLight)?.find((_cmp) => _cmp.light instanceof ƒ.LightDirectional);
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