var RaySceneVR;
(function (RaySceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(RaySceneVR); // Register the namespace to FUDGE for serialization
    class RayHelper extends f.ComponentScript {
        constructor(_xrViewport, _controller, _lengthRay, _cubeContainer) {
            super();
            // Register the script as component for use in the editor via drag&drop
            //  public static readonly iSubclass: number = f.Component.registerSubclass(RayHelper);
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.xrViewport = null;
            this.pick = null;
            this.ray = null;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
                        this.xrViewport.session.addEventListener("squeeze", this.onSqueeze);
                        this.xrViewport.session.addEventListener("selectstart", this.onSelectStart);
                        this.xrViewport.session.addEventListener("selectend", this.onSelectEnd);
                        break;
                    case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.computeRay = () => {
                if (!this.hasObject) {
                    this.node.getComponent(f.ComponentTransform).mtxLocal = this.controller.cmpTransform.mtxLocal;
                    let forward;
                    forward = f.Vector3.Z();
                    forward.transform(this.node.mtxWorld, false);
                    this.ray = new f.Ray(f.Vector3.SCALE(new f.Vector3(forward.x, forward.y, forward.z), -1000), this.node.mtxLocal.translation, 0.1);
                    if (!this.pick) {
                        this.node.getComponent(f.ComponentMesh).mtxPivot.scaling = new f.Vector3(0.025, this.maxLength, 0.025);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.translation = new f.Vector3(0, 0, -this.maxLength / 2 + 0.2);
                        this.node.getComponent(f.ComponentMaterial).clrPrimary = new f.Color(100, 100, 100, 0.5);
                    }
                    else {
                        let distance = f.Vector3.DIFFERENCE(this.pick.mtxLocal.translation, this.controller.cmpTransform.mtxLocal.translation);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.scaling = new f.Vector3(0.025, distance.magnitude, 0.025);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.translation = new f.Vector3(0, 0, -distance.magnitude / 2 + 0.2);
                        this.node.getComponent(f.ComponentMaterial).clrPrimary = this.pick.getComponent(f.ComponentMaterial).clrPrimary;
                        this.node.getComponent(f.ComponentMaterial).clrPrimary.a = 0.5;
                    }
                    let picker = f.Picker.pickRay(this.pickableObjects, this.ray, 0, 1);
                    picker.sort((a, b) => a.zBuffer < b.zBuffer ? -1 : 1);
                    if (picker.length > 0) {
                        this.pick = picker[0].node;
                    }
                    else
                        this.pick = null;
                }
            };
            this.hasObject = false;
            this.lastPosCntrl = f.Vector3.ZERO();
            this.update = () => {
                if (this.xrViewport.session) {
                    this.computeRay();
                    if (this.hasObject) {
                        let interpolatedDiff = f.Vector3.DIFFERENCE(this.lastPosCntrl, this.controller.cmpTransform.mtxLocal.translation).z;
                        if (this.lastPosCntrl.z < 0)
                            this.pick.mtxLocal.translation = new f.Vector3(0, 0, -this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.y + (interpolatedDiff * 25));
                        else
                            this.pick.mtxLocal.translation = new f.Vector3(0, 0, -this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.y + (-interpolatedDiff * 25));
                        this.pick.mtxLocal.rotation = this.controller.cmpTransform.mtxLocal.rotation;
                    }
                }
            };
            this.onSqueeze = (_event) => {
                if (this.pick) {
                    this.xrViewport.vrDevice.translation = this.pick.getComponent(f.ComponentTransform).mtxLocal.translation;
                }
            };
            this.onSelectStart = (_event) => {
                if (this.pick && !this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed) {
                    this.node.addChild(this.pick);
                    this.lastPosCntrl = this.controller.cmpTransform.mtxLocal.translation;
                    this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed = true;
                    this.hasObject = true;
                }
            };
            this.onSelectEnd = (_event) => {
                if (this.pick) {
                    this.hasObject = false;
                    this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed = false;
                    this.cubeContainer.addChild(this.pick);
                    this.pick.mtxLocal.translation = new f.Vector3(this.pick.mtxWorld.translation.x, this.pick.mtxWorld.translation.y, this.pick.mtxWorld.translation.z);
                    this.pick.mtxLocal.rotation = new f.Vector3(this.pick.mtxWorld.rotation.x, this.pick.mtxWorld.rotation.y, this.pick.mtxWorld.rotation.z);
                }
            };
            this.xrViewport = _xrViewport;
            this.controller = _controller;
            this.maxLength = _lengthRay;
            this.cubeContainer = _cubeContainer;
            this.pickableObjects = _cubeContainer.getChildren();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    RaySceneVR.RayHelper = RayHelper;
})(RaySceneVR || (RaySceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUmF5SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsVUFBVSxDQWdJbkI7QUFoSUQsV0FBVSxVQUFVO0lBQ2hCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsb0RBQW9EO0lBRXBHLE1BQWEsU0FBVSxTQUFRLENBQUMsQ0FBQyxlQUFlO1FBWTVDLFlBQVksV0FBeUIsRUFBRSxXQUEyQixFQUFFLFVBQWtCLEVBQUUsY0FBc0I7WUFDMUcsS0FBSyxFQUFFLENBQUM7WUFaWix1RUFBdUU7WUFDdkUsdUZBQXVGO1lBRXZGLGdHQUFnRztZQUN4RixlQUFVLEdBQWlCLElBQUksQ0FBQztZQUtoQyxTQUFJLEdBQVcsSUFBSSxDQUFDO1lBQ3BCLFFBQUcsR0FBVSxJQUFJLENBQUM7WUFrQjFCLGlFQUFpRTtZQUMxRCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDdEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2xCO3dCQUNJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLHVDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3BFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQzVFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFn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