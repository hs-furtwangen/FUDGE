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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tlbGV0b25JbXBvcnRUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2tlbGV0b25JbXBvcnRUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsWUFBWSxDQWdIckI7QUFoSEQsV0FBVSxZQUFZO0lBQ3BCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQVF0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixJQUFJLE9BQU8sR0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3Riw0Q0FBNEM7UUFDNUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MseUJBQXlCO1FBQ3pCLElBQUksS0FBSyxHQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1gsS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUM7WUFDbEcsT0FBTztRQUNULENBQUM7UUFDRCxxQkFBcUI7UUFDckIsSUFBSSxTQUFTLEdBQXNCLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNELG9EQUFvRDtRQUNwRCxJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxhQUFBLFFB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