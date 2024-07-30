var AudioSceneVR;
(function (AudioSceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(AudioSceneVR); // Register the namespace to FUDGE for serialization
    class Translator extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Translator); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start();
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
            this.hasToTurn = false;
            this.isTranslating = false;
            this.update = (_event) => {
                if (this.isTranslating) {
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x < 8.1 && !this.hasToTurn) {
                        this.node.mtxLocal.translateX(0.01);
                        if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x > 8)
                            this.hasToTurn = true;
                    }
                    else if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x > -8.1 && this.hasToTurn) {
                        this.node.mtxLocal.translateX(-0.01);
                        if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x < -8)
                            this.hasToTurn = false;
                    }
                }
            };
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    AudioSceneVR.Translator = Translator;
})(AudioSceneVR || (AudioSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxZQUFZLENBMkRyQjtBQTNERCxXQUFVLFlBQVk7SUFDcEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBRSxvREFBb0Q7SUFFdEcsTUFBYSxVQUFXLFNBQVEsQ0FBQyxDQUFDLGVBQWU7UUFDL0MsdUVBQXVFO2lCQUNoRCxjQUFTLEdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQUFBbkQsQ0FBb0Q7UUFLcEY7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQUxWLGdHQUFnRztZQUN6RixZQUFPLEdBQVcsaUNBQWlDLENBQUM7WUFnQjNELGlFQUFpRTtZQUMxRCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDeEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLHVDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBR2YsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsbUJBQW1CLDZDQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9ELElBQUksQ0FBQyxtQkFBbUIsbURBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEUsTUFBTTtvQkFDUjt3QkFDRSxnSEFBZ0g7d0JBQ2hILE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQTtZQUNPLGNBQVMsR0FBWSxLQUFLLENBQUM7WUFDNUIsa0JBQWEsR0FBWSxLQUFLLENBQUM7WUFDOUIsV0FBTSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3ZDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNwQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUM7NEJBQ3pFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUMxQixDQUFDO3lCQUNJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN0RyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzFFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUMzQixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDLENBQUE7WUEzQ0MscUNBQXFDO1lBQ3JDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUNqQyxPQUFPO1lBRVQsaUVBQWlFO1lBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsNkNBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZ0JBQWdCLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLGdCQUFnQixxREFBNEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7O0lBbEJVLHVCQUFVLGFBc0R0QixDQUFBO0FBQ0gsQ0FBQyxFQTNEUyxZQUFZLEtBQVosWUFBWSxRQTJEckIifQ==