namespace AnimatorComponentTest {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  window.addEventListener("DOMContentLoaded", init);
  let viewport: ƒ.Viewport;

  function init(): void {
    let root: ƒ.Node = new ƒ.Node("Root");
    viewport = ƒAid.Viewport.create(root);
    document.body.addEventListener("change", createTest);
    createTest();
  }


  async function createTest(): Promise<void> {
    console.log("%cStart over", "color: red;");
    let root: ƒ.Node = new ƒ.Node("Root");
    let node: ƒ.Node;
    node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("Texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
    root.appendChild(node);
    viewport.setBranch(root);
    viewport.draw();

    let animseq: ƒ.AnimationSequence<number> = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 0), new ƒ.AnimationKey(5000, 45)], Number);

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
    
    let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, 1);
    animation.labels["test"] = 2000;
    animation.setEvent("event", 3000);


    let cmpAnimation: ƒ.ComponentAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_QUANTIZATION.CONTINOUS);
    cmpAnimation.scale = 2;

    // #region serialisation
    console.groupCollapsed("Animation");
    let serialisation: ƒ.Serialization = animation.serialize();
    console.log("Animation", ƒ.Serializer.stringify(serialisation));
    console.groupEnd();

    console.groupCollapsed("Serialization");
    console.log(cmpAnimation);
    serialisation = cmpAnimation.serialize();
    let txtOriginal: string = ƒ.Serializer.stringify(serialisation);
    console.log("ComponentAnimation original", txtOriginal);
    console.groupEnd();

    console.groupCollapsed("Reconstruction");
    let cmpAnimationReconstructed: ƒ.ComponentAnimation = new ƒ.ComponentAnimation();
    await cmpAnimationReconstructed.deserialize(serialisation);
    // console.log(cmpAnimationReconstructed);
    serialisation = cmpAnimationReconstructed.serialize();
    let txtReconstruction: string = ƒ.Serializer.stringify(serialisation);
    console.log(txtReconstruction);
    console.groupEnd();
    // #endregion
    if (txtOriginal == txtReconstruction)
      console.log("Serialization strings of original and reconstruction match");
    else
      console.error("Serialization strings of original and reconstruction don't match");

    let formdata: FormData = new FormData(document.forms[0]);
    if (formdata.get("use") == "reconstruction")
      cmpAnimation = cmpAnimationReconstructed;

    cmpAnimation.addEventListener("event", hndlEv);
    if (formdata.get("jump"))
      cmpAnimation.addEventListener("event", (_event: Event) => cmpAnimation.jumpTo(animation.labels["test"]));

    node.addComponent(cmpAnimation);
    cmpAnimation.activate(true);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, frame);
    ƒ.Loop.start();

    if (formdata.get("destroy") == "detach")
      console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => node.removeComponent(cmpAnimation)));
    if (formdata.get("destroy") == "remove")
      console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => root.removeChild(node)));
  }

  function frame(): void {
    viewport.draw();
  }

  function hndlEv(_e: Event): void {
    console.log("Event handled", _e);
  }
}