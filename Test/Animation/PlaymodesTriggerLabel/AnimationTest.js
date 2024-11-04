var AnimatorControleTest;
(function (AnimatorControleTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("DOMContentLoaded", init);
    let node;
    let root;
    let viewport;
    function init() {
        root = new ƒ.Node("Root");
        node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
        root.appendChild(node);
        viewport = ƒAid.Viewport.create(root);
        viewport.draw();
        let select = document.querySelector('select[name="mode"]');
        for (let mode in ƒ.ANIMATION_PLAYMODE) {
            let option = document.createElement('option');
            option.value = mode;
            option.text = mode;
            select.appendChild(option);
        }
        select = document.querySelector('select[name="quantization"]');
        for (let mode in ƒ.ANIMATION_QUANTIZATION) {
            let option = document.createElement('option');
            option.value = mode;
            option.text = mode;
            select.appendChild(option);
        }
        initAnim();
        document.body.addEventListener("change", initAnim);
        document.querySelector("button[id=jump]").addEventListener("click", jump);
        function jump(_event) {
            console.log("Jump");
            let cmpAnimation = node.getComponent(ƒ.ComponentAnimation);
            cmpAnimation.jumpToLabel("jump");
        }
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function initAnim() {
        console.log("%cStart over", "color: red;");
        let form = document.forms[0];
        let formData = new FormData(document.forms[0]);
        let time0 = parseInt(form.querySelector("input[name=time0]").value);
        let time1 = parseInt(form.querySelector("input[name=time1]").value);
        let value0 = parseInt(form.querySelector("input[name=value0]").value);
        let value1 = parseInt(form.querySelector("input[name=value1]").value);
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(time0, value0));
        animseq.addKey(new ƒ.AnimationKey(time1, value1));
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
        let fpsInput = document.querySelector("input[name=fps]");
        let fps = parseInt(fpsInput.value);
        let animation = new ƒ.Animation("testAnimation", animStructure, fps);
        animation.setEvent("event", parseInt(form.querySelector("input[name=event]").value));
        animation.labels["jump"] = parseInt(form.querySelector("input[name=label]").value);
        let playmode = String(formData.get("mode"));
        let quantization = String(formData.get("quantization"));
        let cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE[playmode], ƒ.ANIMATION_QUANTIZATION[quantization]);
        cmpAnimation.scale = 1;
        cmpAnimation.addEventListener("event", (_event) => {
            let time = _event.target.time;
            console.log(`Event fired at ${time}`, _event);
        });
        if (node.getComponent(ƒ.ComponentAnimation)) {
            node.removeComponent(node.getComponent(ƒ.ComponentAnimation));
        }
        node.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        console.log("Component", cmpAnimation);
    }
    function update() {
        viewport.draw();
    }
})(AnimatorControleTest || (AnimatorControleTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0aW9uVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFuaW1hdGlvblRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxvQkFBb0IsQ0E2RzdCO0FBN0dELFdBQVUsb0JBQW9CO0lBQzVCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFDdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWxELElBQUksSUFBWSxDQUFDO0lBQ2pCLElBQUksSUFBWSxDQUFDO0lBQ2pCLElBQUksUUFBb0IsQ0FBQztJQUl6QixTQUFTLElBQUk7UUFDWCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuSixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEIsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM5RSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3RDLElBQUksTUFBTSxHQUFzQixRQUFRLENB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