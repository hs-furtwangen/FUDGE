var PostprocessingTest;
(function (PostprocessingTest) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    let viewport;
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        let graph = ƒ.Project.resources[graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        // canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in ƒAid)
        ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        let cmpAmbientOcclusion = new ƒ.ComponentAmbientOcclusion();
        cmpAmbientOcclusion.activate(false);
        cmpCamera.node.addComponent(cmpAmbientOcclusion);
        let cmpBloom = new ƒ.ComponentBloom();
        cmpBloom.activate(false);
        cmpCamera.node.addComponent(cmpBloom);
        let cmpFog = new ƒ.ComponentFog();
        cmpFog.activate(false);
        cmpCamera.node.addComponent(cmpFog);
        let ui = document.getElementById("ui");
        let uiAmbientOcclusion = ƒui.Generator.createDetailsFromMutable(cmpAmbientOcclusion);
        new ƒui.Controller(cmpAmbientOcclusion, uiAmbientOcclusion);
        ui.appendChild(uiAmbientOcclusion);
        let uiBloom = ƒui.Generator.createDetailsFromMutable(cmpBloom);
        new ƒui.Controller(cmpBloom, uiBloom);
        ui.appendChild(uiBloom);
        let uiFog = ƒui.Generator.createDetailsFromMutable(cmpFog);
        new ƒui.Controller(cmpFog, uiFog);
        ui.appendChild(uiFog);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            viewport.draw();
        }
    }
})(PostprocessingTest || (PostprocessingTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxrQkFBa0IsQ0FrRTNCO0FBbEVELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztJQUNoQyxJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxJQUFJLFFBQW9CLENBQUM7SUFFekIsS0FBSyxVQUFVLElBQUk7UUFDakIsSUFBSSxPQUFPLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0YsNENBQTRDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLHlCQUF5QjtRQUN6QixJQUFJLEtBQUssR0FBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDVCxDQUFDO1FBQ0QscUJBQXFCO1FBQ3JCLElBQUksU0FBUyxHQUFzQixJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUUzRCxJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMs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