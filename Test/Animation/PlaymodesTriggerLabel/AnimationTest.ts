namespace AnimatorControleTest {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  window.addEventListener("DOMContentLoaded", init);

  let node: ƒ.Node;
  let root: ƒ.Node;
  let viewport: ƒ.Viewport;



  function init(): void {
    root = new ƒ.Node("Root");
    node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
    root.appendChild(node);
    viewport = ƒAid.Viewport.create(root);
    viewport.draw();

    let select: HTMLSelectElement = document.querySelector('select[name="mode"]');
    for (let mode in ƒ.ANIMATION_PLAYMODE) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = mode;
      option.text = mode;
      select.appendChild(option);
    }

    select = document.querySelector('select[name="quantization"]');
    for (let mode in ƒ.ANIMATION_QUANTIZATION) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = mode;
      option.text = mode;
      select.appendChild(option);
    }

    initAnim();
    document.body.addEventListener("change", initAnim);
    (<HTMLInputElement>document.querySelector("button[id=jump]")).addEventListener("click", jump);
    function jump(_event: Event): void {
      console.log("Jump");
      let cmpAnimation: ƒ.ComponentAnimation = node.getComponent(ƒ.ComponentAnimation);
      cmpAnimation.jumpToLabel("jump");
    }

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }


  function initAnim(): void {
    console.log("%cStart over", "color: red;");
    let form: HTMLFormElement = document.forms[0];
    let formData: FormData = new FormData(document.forms[0]);
    let time0: number = parseInt((<HTMLInputElement>form.querySelector("input[name=time0]")).value);
    let time1: number = parseInt((<HTMLInputElement>form.querySelector("input[name=time1]")).value);
    let value0: number = parseInt((<HTMLInputElement>form.querySelector("input[name=value0]")).value);
    let value1: number = parseInt((<HTMLInputElement>form.querySelector("input[name=value1]")).value);

    let animseq: ƒ.AnimationSequence<number> = new ƒ.AnimationSequence([new ƒ.AnimationKey(time0, value0), new ƒ.AnimationKey(time1, value1)], Number);

    let animStructure: ƒ.AnimationStructure = {
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


    let fpsInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("input[name=fps]"));
    let fps: number = parseInt(fpsInput.value);

    let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, fps);
    animation.setEvent("event", parseInt((<HTMLInputElement>form.querySelector("input[name=event]")).value));
    animation.labels["jump"] = parseInt((<HTMLInputElement>form.querySelector("input[name=label]")).value);

    let playmode: string = String(formData.get("mode"));
    let quantization: string = String(formData.get("quantization"));

    let cmpAnimation: ƒ.ComponentAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE[playmode], ƒ.ANIMATION_QUANTIZATION[quantization]);
    cmpAnimation.scale = 1;
    cmpAnimation.addEventListener("event", (_event: Event) => {
      let time: number = (<ƒ.ComponentAnimation>_event.target).time;
      console.log(`Event fired at ${time}`, _event);
    });


    if (node.getComponent(ƒ.ComponentAnimation)) {
      node.removeComponent(node.getComponent(ƒ.ComponentAnimation));
    }


    node.addComponent(cmpAnimation);
    cmpAnimation.activate(true);

    console.log("Component", cmpAnimation);
  }

  function update(): void {
    viewport.draw();
  }
}