var AnimatorComponentTest;
(function (AnimatorComponentTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("DOMContentLoaded", init);
    let viewport;
    function init() {
        let root = new ƒ.Node("Root");
        viewport = ƒAid.Viewport.create(root);
        document.body.addEventListener("change", createTest);
        createTest();
    }
    async function createTest() {
        console.log("%cStart over", "color: red;");
        let root = new ƒ.Node("Root");
        let node;
        node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("Texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
        root.appendChild(node);
        viewport.setBranch(root);
        viewport.draw();
        let animseq = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 0), new ƒ.AnimationKey(5000, 45)], Number);
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        mtxLocal: {
                            rotation: {
                                x: animseq,
                                y: animseq
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("testAnimation", animStructure, 1);
        animation.labels["test"] = 2000;
        animation.setEvent("event", 3000);
        let cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_QUANTIZATION.CONTINOUS);
        cmpAnimation.scale = 2;
        // #region serialisation
        console.groupCollapsed("Animation");
        let serialisation = animation.serialize();
        console.log("Animation", ƒ.Serializer.stringify(serialisation));
        console.groupEnd();
        console.groupCollapsed("Serialization");
        console.log(cmpAnimation);
        serialisation = cmpAnimation.serialize();
        let txtOriginal = ƒ.Serializer.stringify(serialisation);
        console.log("ComponentAnimation original", txtOriginal);
        console.groupEnd();
        console.groupCollapsed("Reconstruction");
        let cmpAnimationReconstructed = new ƒ.ComponentAnimation();
        await cmpAnimationReconstructed.deserialize(serialisation);
        // console.log(cmpAnimationReconstructed);
        serialisation = cmpAnimationReconstructed.serialize();
        let txtReconstruction = ƒ.Serializer.stringify(serialisation);
        console.log(txtReconstruction);
        console.groupEnd();
        // #endregion
        if (txtOriginal == txtReconstruction)
            console.log("Serialization strings of original and reconstruction match");
        else
            console.error("Serialization strings of original and reconstruction don't match");
        let formdata = new FormData(document.forms[0]);
        if (formdata.get("use") == "reconstruction")
            cmpAnimation = cmpAnimationReconstructed;
        cmpAnimation.addEventListener("event", hndlEv);
        if (formdata.get("jump"))
            cmpAnimation.addEventListener("event", (_event) => cmpAnimation.jumpTo(animation.labels["test"]));
        node.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, frame);
        ƒ.Loop.start();
        if (formdata.get("destroy") == "detach")
            console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => node.removeComponent(cmpAnimation)));
        if (formdata.get("destroy") == "remove")
            console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => root.removeChild(node)));
    }
    function frame() {
        viewport.draw();
    }
    function hndlEv(_e) {
        console.log("Event handled", _e);
    }
})(AnimatorComponentTest || (AnimatorComponentTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0b3JDb21wb25lbnRUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQW5pbWF0b3JDb21wb25lbnRUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUscUJBQXFCLENBc0c5QjtBQXRHRCxXQUFVLHFCQUFxQjtJQUM3QixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxJQUFJLFFBQW9CLENBQUM7SUFFekIsU0FBUyxJQUFJO1FBQ1gsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNyRCxVQUFVLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFHRCxLQUFLLFVBQVUsVUFBVTtRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxJQUFZLENBQUM7UUFDakIsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENB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