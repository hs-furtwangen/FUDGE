var PhysicsVR;
(function (PhysicsVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(PhysicsVR); // Register the namespace to FUDGE for serialization
    class Translator extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Translator); }
        // Properties may be mutated by users in the editor via the automatically created user interface
        static { this.speed = 25; }
        constructor() {
            super();
            this.hasHitted = false;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST, 60);
                        this.addVel();
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
            this.addVel = () => {
                this.node.getComponent(f.ComponentRigidbody).addVelocity(f.Vector3.Z(-Translator.speed));
            };
            this.randomRot = f.Random.default.getRange(-0.5, 0.5);
            this.update = (_event) => {
                if (!this.hasHitted) {
                    this.node.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.X(-0.5));
                    this.node.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.Z(this.randomRot));
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.z > 70 && this.node)
                        PhysicsVR.cubeContainer.removeChild(this.node);
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
    PhysicsVR.Translator = Translator;
})(PhysicsVR || (PhysicsVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxTQUFTLENBeURsQjtBQXpERCxXQUFVLFNBQVM7SUFDakIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxvREFBb0Q7SUFFbkcsTUFBYSxVQUFXLFNBQVEsQ0FBQyxDQUFDLGVBQWU7UUFDL0MsdUVBQXVFO2lCQUNoRCxjQUFTLEdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQUFBbkQsQ0FBb0Q7UUFDcEYsZ0dBQWdHO2lCQUNsRixVQUFLLEdBQVcsRUFBRSxBQUFiLENBQWM7UUFFakM7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQUZILGNBQVMsR0FBWSxLQUFLLENBQUM7WUFlbEMsaUVBQWlFO1lBQzFELGFBQVEsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN4QyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEI7d0JBQ0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsdUNBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDekQsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzVDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFFZCxNQUFNO29CQUNSO3dCQUNFLElBQUksQ0FBQyxtQkFBbUIsNkNBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0QsSUFBSSxDQUFDLG1CQUFtQixtREFBMkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNsRSxNQUFNO29CQUNSO3dCQUNFLGdIQUFnSDt3QkFDaEgsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFBO1lBQ08sV0FBTSxHQUFHLEdBQVMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFM0YsQ0FBQyxDQUFBO1lBQ08sY0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqRCxXQUFNLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtvQkFDMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNyRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSTt3QkFDdkYsVUFBQSxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQztZQUVILENBQUMsQ0FBQTtZQTFDQyxxQ0FBcUM7WUFDckMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ2pDLE9BQU87WUFFVCxpRUFBaUU7WUFDakUsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsbURBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsZ0JBQWdCLHFEQUE0QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEUsQ0FBQzs7SUFsQlUsb0JBQVUsYUFvRHRCLENBQUE7QUFDSCxDQUFDLEVBekRTLFNBQVMsS0FBVCxTQUFTLFFBeURsQiJ9