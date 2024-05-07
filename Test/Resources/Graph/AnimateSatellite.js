var Graph;
(function (Graph) {
    var ƒ = FudgeCore;
    class AnimateSatellite extends ƒ.ComponentScript {
        // tpo: test performance optimization
        static mtxRotY = ƒ.Matrix4x4.ROTATION_Y(1);
        static mtxRotX = ƒ.Matrix4x4.ROTATION_X(5);
        // :tpo
        mtxLocal;
        mtxPivot;
        constructor() {
            super();
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndAddComponent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndRemoveComponent);
        }
        hndAddComponent = (_event) => {
            this.node.addEventListener("startSatellite", this.start, true);
        };
        hndRemoveComponent = (_event) => {
            this.node.removeEventListener("startSatellite", this.start);
            ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        };
        start = (_event) => {
            this.mtxLocal = this.node.mtxLocal;
            this.mtxPivot = this.node.getComponent(ƒ.ComponentMesh).mtxPivot;
            this.mtxPivot.translateZ(-0.5);
            this.mtxPivot.scale(ƒ.Vector3.ONE(0.2));
            this.mtxLocal.rotateY(Math.random() * 360);
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            // tpo: test performance optimization
            // this.mtxLocal.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxLocal, AnimateSatellite.mtxRotY));
            // this.mtxPivot.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxPivot, AnimateSatellite.mtxRotX));
            // :tpo
            this.mtxLocal.rotateY(1);
            this.mtxPivot.rotateX(5);
        };
    }
    Graph.AnimateSatellite = AnimateSatellite;
})(Graph || (Graph = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0ZVNhdGVsbGl0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFuaW1hdGVTYXRlbGxpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBOENkO0FBOUNELFdBQVUsS0FBSztJQUNYLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFhLGdCQUFpQixTQUFRLENBQUMsQ0FBQyxlQUFlO1FBQ25ELHFDQUFxQztRQUM3QixNQUFNLENBQUMsT0FBTyxHQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsT0FBTyxHQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxPQUFPO1FBQ0MsUUFBUSxDQUFjO1FBQ3RCLFFBQVEsQ0FBYztRQUU5QjtZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBd0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxnQkFBZ0IsbURBQTJCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCxlQUFlLEdBQUcsQ0FBQyxNQUFhLEVBQUUsRUFBRTtZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFBO1FBRUQsa0JBQWtCLEdBQUcsQ0FBQyxNQUFhLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQix1Q0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQTtRQUVNLEtBQUssR0FBRyxDQUFDLE1BQWEsRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBcUIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBRSxDQUFDLFFBQVEsQ0FBQztZQUVwRixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRTNDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLHVDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFBO1FBRU0sTUFBTSxHQUFHLENBQUMsTUFBYSxFQUFFLEVBQUU7WUFDOUIscUNBQXFDO1lBQ3JDLDBGQUEwRjtZQUMxRiwwRkFBMEY7WUFDMUYsT0FBTztZQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQTs7SUF6Q1Esc0JBQWdCLG1CQTBDNUIsQ0FBQTtBQUNMLENBQUMsRUE5Q1MsS0FBSyxLQUFMLEtBQUssUUE4Q2QifQ==