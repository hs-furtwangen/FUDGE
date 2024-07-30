var PhysicsVR;
(function (PhysicsVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(PhysicsVR); // Register the namespace to FUDGE for serialization
    class Sword extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Sword); }
        // Properties may be mutated by users in the editor via the automatically created user interface
        static { this.speed = 15; }
        constructor() {
            super();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
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
            this.onColiisionEnter = (_event) => {
                if (_event.cmpRigidbody.node.name == "CubeInstance") {
                    if (_event.cmpRigidbody.node) {
                        _event.cmpRigidbody.node.getComponent(PhysicsVR.Translator).hasHitted = true;
                        _event.cmpRigidbody.setVelocity(f.Vector3.DIFFERENCE(_event.cmpRigidbody.mtxPivot.translation, this.node.mtxLocal.translation));
                        _event.cmpRigidbody.effectGravity = 1;
                        this.removeHittedObject(_event.cmpRigidbody.node);
                    }
                }
            };
            this.removeHittedObject = async (_objectHit) => {
                await f.Time.game.delay(1250);
                PhysicsVR.cubeContainer.removeChild(_objectHit);
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
    PhysicsVR.Sword = Sword;
})(PhysicsVR || (PhysicsVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLFNBQVMsQ0F5RGxCO0FBekRELFdBQVUsU0FBUztJQUNqQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLG9EQUFvRDtJQUVuRyxNQUFhLEtBQU0sU0FBUSxDQUFDLENBQUMsZUFBZTtRQUMxQyx1RUFBdUU7aUJBQ2hELGNBQVMsR0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxBQUE5QyxDQUErQztRQUMvRSxnR0FBZ0c7aUJBQ2xGLFVBQUssR0FBVyxFQUFFLEFBQWIsQ0FBYztRQUVqQztZQUNFLEtBQUssRUFBRSxDQUFDO1lBYVYsaUVBQWlFO1lBQzFELGFBQVEsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN4QyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEI7d0JBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsZ0JBQWdCLG1FQUFrQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFHdEgsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsbUJBQW1CLDZDQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9ELElBQUksQ0FBQyxtQkFBbUIsbURBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEUsTUFBTTtvQkFDUjt3QkFDRSxnSEFBZ0g7d0JBQ2hILE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQTtZQUNPLHFCQUFnQixHQUFHLENBQUMsTUFBc0IsRUFBUSxFQUFFO2dCQUMxRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDcEQsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUM3QixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBQSxVQUFVLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUNuRSxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDaEksTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEQsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFBO1lBQ08sdUJBQWtCLEdBQUcsS0FBSyxFQUFFLFVBQWtCLEVBQWlCLEVBQUU7Z0JBRXZFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM5QixVQUFBLGFBQWEsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFBO1lBMUNDLHFDQUFxQztZQUNyQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDakMsT0FBTztZQUVULGlFQUFpRTtZQUNqRSxJQUFJLENBQUMsZ0JBQWdCLDZDQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixtREFBMkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxnQkFBZ0IscURBQTRCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRSxDQUFDOztJQWxCVSxlQUFLLFFBb0RqQixDQUFBO0FBQ0gsQ0FBQyxFQXpEUyxTQUFTLEtBQVQsU0FBUyxRQXlEbEIifQ==