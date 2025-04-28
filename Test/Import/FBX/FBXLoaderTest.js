var SkeletonTest;
(function (SkeletonTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.1;
    let cntMouseX = new ƒ.Control("MouseX", speedCameraRotation);
    let cntMouseY = new ƒ.Control("MouseY", speedCameraRotation);
    window.addEventListener("load", init);
    async function init() {
        const loader = await ƒ.FBXLoader.LOAD("./animated_arm.fbx");
        // test loading a mesh
        // console.log(await loader.getMesh(0));
        // load scene
        const graph = await loader.getScene(0);
        console.log(graph);
        // camera setup
        const cmpCamera = new ƒ.ComponentCamera();
        camera = new ƒAid.CameraOrbit(cmpCamera, 15, 80, 1, 20);
        camera.axisRotateX.addControl(cntMouseY);
        camera.axisRotateY.addControl(cntMouseX);
        cmpCamera.clrBackground.setHex("4472C4FF");
        graph.addChild(camera);
        // camera.mtxLocal.translateY(100);
        // let skeleton: ƒ.Node = scene;
        // for (const node of scene)
        //   if (node != scene && node.name == "Skeleton0")
        //     skeleton = node;
        // const meshBone: ƒ.Mesh = new ƒ.MeshRotation(
        //   "bone",
        //   [
        //     new ƒ.Vector2(0, 5),
        //     new ƒ.Vector2(1, 0),
        //     new ƒ.Vector2(0, 0)
        //   ],
        //   3
        // );
        // const materialBone: ƒ.Material = new ƒ.Material("bone", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        // for (const bone of skeleton) {
        //   if (bone != skeleton) {
        //     bone.addComponent(new ƒ.ComponentMesh(meshBone));
        //     bone.addComponent(new ƒ.ComponentMaterial(materialBone));
        //     if (bone.getChild(0) /*&& bone.getChild(0).mtxLocal.translation.y >
        //         Math.abs(bone.getChild(0).mtxLocal.translation.x) + Math.abs(bone.getChild(0).mtxLocal.translation.z)*/)
        //       bone.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(bone.getChild(0).mtxLocal.translation.y);
        //   }
        // }
        // for (const node of scene) {
        //   const cmpMaterial: ƒ.ComponentMaterial = node.getComponent(ƒ.ComponentMaterial);
        //   if (cmpMaterial && cmpMaterial.material.name != "bone")
        //     cmpMaterial.activate(false);
        // }
        // test loading all documents and objects
        // loader.fbx.documents.forEach(_document => _document.load());
        // loader.fbx.objects.all.forEach(_object => _object.load());
        // console.log(loader.nodes);
        // console.log(loader.fbx);
        // setup light
        const cmpLightDirectional = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.DIRECTIONAL, new ƒ.Color(0.5, 0.5, 0.5));
        // cmpLightDirectional.mtxPivot.rotateY(180);
        graph.addComponent(cmpLightDirectional);
        const cmpLightAmbient = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.AMBIENT, new ƒ.Color(0.5, 0.5, 0.5));
        graph.addComponent(cmpLightAmbient);
        const viewport = new ƒ.Viewport();
        const canvas = document.querySelector("canvas");
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.canvas.addEventListener("pointermove", hndPointerMove);
        viewport.canvas.addEventListener("wheel", hndWheelMove);
        canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        let timeSpan = document.querySelector('span[is=ui-time]');
        let gPressed = false;
        let iShader = 0;
        const shaders = [ƒ.ShaderFlatSkin, ƒ.ShaderGouraudSkin, ƒ.ShaderPhongSkin];
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            cmpLightDirectional.mtxPivot.rotation = new ƒ.Vector3(0, camera.rotationY + 180, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.P]))
                ƒ.Time.game.setScale(0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
                ƒ.Time.game.setScale(0.1);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
                ƒ.Time.game.setScale(1);
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
            let cmpAnimation = graph.getComponent(ƒ.ComponentAnimation);
            if (cmpAnimation)
                timeSpan.get = () => cmpAnimation.time.toFixed(0);
            viewport.draw();
            viewport.draw();
        }
    }
    function hndPointerMove(_event) {
        if (!_event.buttons)
            return;
        cntMouseX.setInput(-_event.movementX);
        cntMouseY.setInput(-_event.movementY);
    }
    function hndWheelMove(_event) {
        camera.distance += _event.deltaY * speedCameraTranslation;
    }
})(SkeletonTest || (SkeletonTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRkJYTG9hZGVyVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkZCWExvYWRlclRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxZQUFZLENBK0hyQjtBQS9IRCxXQUFVLFlBQVk7SUFDcEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUV2QixJQUFJLE1BQXdCLENBQUM7SUFDN0IsSUFBSSxtQkFBbUIsR0FBVyxHQUFHLENBQUM7SUFDdEMsSUFBSSxzQkFBc0IsR0FBVyxHQUFHLENBQUM7SUFDekMsSUFBSSxTQUFTLEdBQWMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hFLElBQUksU0FBUyxHQUFjLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUV4RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLEtBQUssVUFBVSxJQUFJO1FBQ2pCLE1BQU0sTUFBTSxHQUFnQixNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFekUsc0JBQXNCO1FBQ3RCLHdDQUF3QztRQUV4QyxhQUFhO1FBQ2IsTUFBTSxLQUFLLEdBQVcsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsZUFBZTtRQUNmLE1BQU0sU0FBUyxHQUFzQixJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM3RCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RCxNQUFNLENB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