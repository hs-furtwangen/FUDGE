var Graph;
(function (Graph) {
    var ƒ = FudgeCore;
    class AnimateSatellite extends ƒ.ComponentScript {
        // tpo: test performance optimization
        static { this.mtxRotY = ƒ.Matrix4x4.ROTATION_Y(1); }
        static { this.mtxRotX = ƒ.Matrix4x4.ROTATION_X(5); }
        constructor() {
            super();
            this.hndAddComponent = (_event) => {
                this.node.addEventListener("startSatellite", this.start, true);
            };
            this.hndRemoveComponent = (_event) => {
                this.node.removeEventListener("startSatellite", this.start);
                ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            };
            this.start = (_event) => {
                this.mtxLocal = this.node.mtxLocal;
                this.mtxPivot = this.node.getComponent(ƒ.ComponentMesh).mtxPivot;
                this.mtxPivot.translateZ(-0.5);
                this.mtxPivot.scale(ƒ.Vector3.ONE(0.2));
                this.mtxLocal.rotateY(Math.random() * 360);
                ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            };
            this.update = (_event) => {
                // tpo: test performance optimization
                // this.mtxLocal.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxLocal, AnimateSatellite.mtxRotY));
                // this.mtxPivot.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxPivot, AnimateSatellite.mtxRotX));
                // :tpo
                this.mtxLocal.rotateY(1);
                this.mtxPivot.rotateX(5);
            };
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndAddComponent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndRemoveComponent);
        }
    }
    Graph.AnimateSatellite = AnimateSatellite;
})(Graph || (Graph = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0ZVNhdGVsbGl0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFuaW1hdGVTYXRlbGxpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBOENkO0FBOUNELFdBQVUsS0FBSztJQUNYLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFhLGdCQUFpQixTQUFRLENBQUMsQ0FBQyxlQUFlO1FBQ25ELHFDQUFxQztpQkFDdEIsWUFBTyxHQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQUFBekMsQ0FBMEM7aUJBQ2pELFlBQU8sR0FBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEFBQXpDLENBQTBDO1FBS2hFO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFLWixvQkFBZSxHQUFHLENBQUMsTUFBYSxFQUFFLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUE7WUFFRCx1QkFBa0IsR0FBRyxDQUFDLE1BQWEsRUFBRSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsdUNBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUE7WUFFTSxVQUFLLEdBQUcsQ0FBQyxNQUFhLEVBQUUsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBcUIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBRSxDQUFDLFFBQVEsQ0FBQztnQkFFcEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUUzQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQTtZQUVNLFdBQU0sR0FBRyxDQUFDLE1BQWEsRUFBRSxFQUFFO2dCQUM5QixxQ0FBcUM7Z0JBQ3JDLDBGQUEwRjtnQkFDMUYsMEZBQTBGO2dCQUMxRixPQUFPO2dCQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUE7WUEvQkcsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBd0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxnQkFBZ0IsbURBQTJCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdFLENBQUM7O0lBWlEsc0JBQWdCLG1CQTBDNUIsQ0FBQTtBQUNMLENBQUMsRUE5Q1MsS0FBSyxLQUFMLEtBQUssUUE4Q2QifQ==