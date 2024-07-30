var RaySceneVR;
(function (RaySceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(RaySceneVR); // Register the namespace to FUDGE for serialization
    class GrabbableObject extends f.ComponentScript {
        constructor() {
            super();
            // Register the script as component for use in the editor via drag&drop
            this.isGrabbed = false;
        }
    }
    RaySceneVR.GrabbableObject = GrabbableObject;
})(RaySceneVR || (RaySceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhYmJhYmxlT2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiR3JhYmJhYmxlT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsVUFBVSxDQVduQjtBQVhELFdBQVUsVUFBVTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFFLG9EQUFvRDtJQUVwRyxNQUFhLGVBQWdCLFNBQVEsQ0FBQyxDQUFDLGVBQWU7UUFHbEQ7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUhaLHVFQUF1RTtZQUNoRSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBR2xDLENBQUM7S0FDSjtJQU5ZLDBCQUFlLGtCQU0zQixDQUFBO0FBQ0wsQ0FBQyxFQVhTLFVBQVUsS0FBVixVQUFVLFFBV25CIn0=