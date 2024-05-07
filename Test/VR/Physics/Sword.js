var PhysicsVR;
(function (PhysicsVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(PhysicsVR); // Register the namespace to FUDGE for serialization
    class Sword extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Sword);
        // Properties may be mutated by users in the editor via the automatically created user interface
        static speed = 15;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.onColiisionEnter);
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
        onColiisionEnter = (_event) => {
            if (_event.cmpRigidbody.node.name == "CubeInstance") {
                if (_event.cmpRigidbody.node) {
                    _event.cmpRigidbody.node.getComponent(PhysicsVR.Translator).hasHitted = true;
                    _event.cmpRigidbody.setVelocity(f.Vector3.DIFFERENCE(_event.cmpRigidbody.mtxPivot.translation, this.node.mtxLocal.translation));
                    _event.cmpRigidbody.effectGravity = 1;
                    this.removeHittedObject(_event.cmpRigidbody.node);
                }
            }
        };
        removeHittedObject = async (_objectHit) => {
            await f.Time.game.delay(1250);
            PhysicsVR.cubeContainer.removeChild(_objectHit);
        };
    }
    PhysicsVR.Sword = Sword;
})(PhysicsVR || (PhysicsVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLFNBQVMsQ0F5RGxCO0FBekRELFdBQVUsU0FBUztJQUNqQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLG9EQUFvRDtJQUVuRyxNQUFhLEtBQU0sU0FBUSxDQUFDLENBQUMsZUFBZTtRQUMxQyx1RUFBdUU7UUFDaEUsTUFBTSxDQUFVLFNBQVMsR0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9FLGdHQUFnRztRQUN6RixNQUFNLENBQUMsS0FBSyxHQUFXLEVBQUUsQ0FBQztRQUVqQztZQUNFLEtBQUssRUFBRSxDQUFDO1lBRVIscUNBQXFDO1lBQ3JDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUNqQyxPQUFPO1lBRVQsaUVBQWlFO1lBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsNkNBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZ0JBQWdCLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLGdCQUFnQixxREFBNEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxFLENBQUM7UUFFRCxpRUFBaUU7UUFDMUQsUUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7WUFDeEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCO29CQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixtRUFBa0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBR3RILE1BQU07Z0JBQ1I7b0JBQ0UsSUFBSSxDQUFDLG1CQUFtQiw2Q0FBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsbUJBQW1CLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2xFLE1BQU07Z0JBQ1I7b0JBQ0UsZ0hBQWdIO29CQUNoSCxNQUFNO1lBQ1YsQ0FBQztRQUNILENBQUMsQ0FBQTtRQUNPLGdCQUFnQixHQUFHLENBQUMsTUFBc0IsRUFBUSxFQUFFO1lBQzFELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFBLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ25FLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNoSSxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQTtRQUNPLGtCQUFrQixHQUFHLEtBQUssRUFBRSxVQUFrQixFQUFpQixFQUFFO1lBRXZFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLFVBQUEsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUE7O0lBbkRVLGVBQUssUUFvRGpCLENBQUE7QUFDSCxDQUFDLEVBekRTLFNBQVMsS0FBVCxTQUFTLFFBeURsQiJ9