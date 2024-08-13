var ControllerSceneVR;
(function (ControllerSceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(ControllerSceneVR); // Register the namespace to FUDGE for serialization
    class Controller extends f.ComponentScript {
        constructor(_xrViewport, _controller) {
            super();
            this.xrViewport = null;
            this.aButton = null;
            this.bButton = null;
            this.trigger = null;
            this.select = null;
            this.joyStick = null;
            this.oldaButton = null;
            this.oldbButton = null;
            this.oldtrigger = null;
            this.oldselect = null;
            this.oldjoyStick = null;
            this.mappedButtons = {};
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        this.initController();
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
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
            this.initController = () => {
                this.joyStick = this.node.getChildrenByName("Joystick")[0].getChild(0).getComponent(f.ComponentMesh);
                this.oldjoyStick = this.joyStick.mtxPivot.translation.clone;
                this.aButton = this.node.getChildrenByName("AButton")[0].getComponent(f.ComponentMesh);
                this.oldaButton = this.aButton.mtxPivot.translation.clone;
                this.bButton = this.node.getChildrenByName("BButton")[0].getComponent(f.ComponentMesh);
                this.oldbButton = this.bButton.mtxPivot.translation.clone;
                this.trigger = this.node.getChildrenByName("Trigger")[0].getComponent(f.ComponentMesh);
                this.oldtrigger = this.trigger.mtxPivot.translation.clone;
                this.select = this.node.getChildrenByName("Select")[0].getComponent(f.ComponentMesh);
                this.oldselect = this.select.mtxPivot.translation.clone;
            };
            this.updateController = () => {
                this.node.getComponent(f.ComponentTransform).mtxLocal = this.controller.cmpTransform.mtxLocal;
                this.joyStick.mtxPivot.rotation = new f.Vector3(this.controller.thumbstickX * 25, 0, this.controller.thumbstickY * 25);
                if (this.mappedButtons["select"].pressed)
                    this.select.mtxPivot.translation = new f.Vector3(this.select.mtxPivot.translation.x, this.select.mtxPivot.translation.y, this.oldselect.z + 0.007);
                else
                    this.select.mtxPivot.translation = new f.Vector3(this.select.mtxPivot.translation.x, this.select.mtxPivot.translation.y, this.oldselect.z);
                if (this.mappedButtons["trigger"].pressed)
                    this.trigger.mtxPivot.translation = new f.Vector3(this.trigger.mtxPivot.translation.x, this.trigger.mtxPivot.translation.y, this.oldtrigger.z + 0.008);
                else
                    this.trigger.mtxPivot.translation = new f.Vector3(this.trigger.mtxPivot.translation.x, this.trigger.mtxPivot.translation.y, this.oldtrigger.z);
                if (this.mappedButtons["A"].pressed)
                    this.aButton.mtxPivot.translation = new f.Vector3(this.aButton.mtxPivot.translation.x, this.oldaButton.y - 0.0075, this.aButton.mtxPivot.translation.z);
                else
                    this.aButton.mtxPivot.translation = new f.Vector3(this.aButton.mtxPivot.translation.x, this.oldaButton.y, this.aButton.mtxPivot.translation.z);
                if (this.mappedButtons["B"].pressed)
                    this.bButton.mtxPivot.translation = new f.Vector3(this.bButton.mtxPivot.translation.x, this.oldbButton.y - 0.0075, this.bButton.mtxPivot.translation.z);
                else
                    this.bButton.mtxPivot.translation = new f.Vector3(this.bButton.mtxPivot.translation.x, this.oldbButton.y, this.bButton.mtxPivot.translation.z);
                if (this.mappedButtons["thumbStick"].pressed)
                    this.joyStick.mtxPivot.translation = new f.Vector3(this.joyStick.mtxPivot.translation.x, this.oldjoyStick.y - 0.0075, this.joyStick.mtxPivot.translation.z);
                else
                    this.joyStick.mtxPivot.translation = new f.Vector3(this.joyStick.mtxPivot.translation.x, this.oldjoyStick.y, this.joyStick.mtxPivot.translation.z);
            };
            this.update = () => {
                if (this.xrViewport.session) {
                    try {
                        if (this.mappedButtons["select"])
                            this.updateController();
                        if (!this.mappedButtons["select"])
                            for (let i = 0; i <= 5; i++) {
                                switch (i) {
                                    case (0):
                                        this.mappedButtons["select"] = this.controller.gamePad.buttons[0];
                                        break;
                                    case (1):
                                        this.mappedButtons["trigger"] = this.controller.gamePad.buttons[1];
                                        break;
                                    case (3):
                                        this.mappedButtons["thumbStick"] = this.controller.gamePad.buttons[3];
                                        break;
                                    case (4):
                                        this.mappedButtons["A"] = this.controller.gamePad.buttons[4];
                                        break;
                                    case (5):
                                        this.mappedButtons["B"] = this.controller.gamePad.buttons[5];
                                        break;
                                }
                            }
                    }
                    catch (error) {
                        f.Debug.error("Mapped Buttons are not initialized correctly!");
                    }
                }
            };
            this.xrViewport = _xrViewport;
            this.controller = _controller;
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    ControllerSceneVR.Controller = Controller;
})(ControllerSceneVR || (ControllerSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxpQkFBaUIsQ0FnSDFCO0FBaEhELFdBQVUsaUJBQWlCO0lBQ3ZCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBRSxvREFBb0Q7SUFFM0csTUFBYSxVQUFXLFNBQVEsQ0FBQyxDQUFDLGVBQWU7UUFpQjdDLFlBQVksV0FBeUIsRUFBRSxXQUEyQjtZQUM5RCxLQUFLLEVBQUUsQ0FBQztZQWpCSixlQUFVLEdBQWlCLElBQUksQ0FBQztZQUdoQyxZQUFPLEdBQW9CLElBQUksQ0FBQztZQUNoQyxZQUFPLEdBQW9CLElBQUksQ0FBQztZQUNoQyxZQUFPLEdBQW9CLElBQUksQ0FBQztZQUNoQyxXQUFNLEdBQW9CLElBQUksQ0FBQztZQUMvQixhQUFRLEdBQW9CLElBQUksQ0FBQztZQUVqQyxlQUFVLEdBQWMsSUFBSSxDQUFDO1lBQzdCLGVBQVUsR0FBYyxJQUFJLENBQUM7WUFDN0IsZUFBVSxHQUFjLElBQUksQ0FBQztZQUM3QixjQUFTLEdBQWMsSUFBSSxDQUFDO1lBQzVCLGdCQUFXLEdBQWMsSUFBSSxDQUFDO1lBQzlCLGtCQUFhLEdBQXFDLEVBQUUsQ0FBQztZQWdCN0QsaUVBQWlFO1lBQzFELGFBQVEsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN0QyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEI7d0JBQ0ksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUV0QixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6RCxNQUFNO29CQUNWO3dCQUNJLElBQUksQ0FBQyxtQkFBbUIsNkNBQXdCLElBQUksQ0FBQyxR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