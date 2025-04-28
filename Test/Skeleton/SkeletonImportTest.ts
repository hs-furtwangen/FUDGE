namespace SkeletonTest {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  window.addEventListener("load", init);
  export let viewport: ƒ.Viewport;
  export let loader: ƒ.GLTFLoader;
  export let loaded: ƒ.Node;
  export let cmpAnimation: ƒ.ComponentAnimation;
  export let slcFile: HTMLSelectElement;
  export let slcAmount: HTMLSelectElement;

  async function init(): Promise<void> {
    let graphId: string = document.head.querySelector("meta[autoView]").getAttribute("autoView");
    // load resources referenced in the link-tag
    await ƒ.Project.loadResourcesFromHTML();
    ƒ.Debug.log("Project:", ƒ.Project.resources);
    // pick the graph to show
    let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphId];
    ƒ.Debug.log("Graph:", graph);
    if (!graph) {
      alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
      return;
    }
    // setup the viewport
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    // cmpCamera.clrBackground = ƒ.Color.CSS("SKYBLUE");
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
    ƒ.Debug.log("Viewport:", viewport);
    // hide the cursor when interacting, also suppressing right-click menu
    canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
    canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
    // make the camera interactive (complex method in ƒAid)
    ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);

    graph.addChild(new ƒ.Node("placeholder"));

    let timeSpan: UI.Time = document.querySelector('span[is="ui-time"]');
    timeSpan.get = () => {
      let cmpAnimation: ƒ.ComponentAnimation = loaded?.getComponent(ƒ.ComponentAnimation);
      return cmpAnimation ? cmpAnimation.time.toFixed(0) : "0";
    };

    let gPressed: boolean = false;
    let iShader: number = 0;
    const shaders: typeof ƒ.Shader[] = [ƒ.ShaderFlatSkin, ƒ.ShaderGouraudSkin, ƒ.ShaderPhongSkin];

    let cmpLightDirectional: ƒ.ComponentLight = graph.getChildrenByName("Light")[0]?.getComponents(ƒ.ComponentLight)?.find((_cmp: ƒ.ComponentLight) => _cmp.lightType == ƒ.LIGHT_TYPE.DIRECTIONAL);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();

    function update(_event: Event): void {
      cmpLightDirectional.mtxPivot.rotation = new ƒ.Vector3(cmpCamera.mtxWorld.rotation.x, cmpCamera.mtxWorld.rotation.y, 0);

      const setShader: (_shader: typeof ƒ.Shader) => void = _shader => {
        for (const node of graph) {
          if (node.getComponent(ƒ.ComponentMaterial))
            node.getComponent(ƒ.ComponentMaterial).material.setShader(_shader);
        }
      };
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G])) {
        if (!gPressed) {
          gPressed = true;
          setShader(shaders[iShader = (iShader + 1) % shaders.length]);
        }
      } else
        gPressed = false;
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H])) setShader(ƒ.ShaderPhong);

      viewport.draw();
    }

    document.addEventListener("keydown", hndKeydown);

    function hndKeydown(_event: KeyboardEvent): void {
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.SPACE:
          cmpAnimation?.jumpTo(0);
          break;
        case ƒ.KEYBOARD_CODE.P:
          ƒ.Time.game.setScale(ƒ.Time.game.getScale() == 0 ? 1 : 0);
          break;
        case ƒ.KEYBOARD_CODE.D:
          cmpAnimation?.jumpTo(cmpAnimation.time + 50);
          break;
        case ƒ.KEYBOARD_CODE.A:
          cmpAnimation?.jumpTo(cmpAnimation.time - 50);
          break;
        case ƒ.KEYBOARD_CODE.W:
          ƒ.Time.game.setScale(ƒ.Time.game.getScale() * 2);
          break;
        case ƒ.KEYBOARD_CODE.S:
          ƒ.Time.game.setScale(ƒ.Time.game.getScale() / 2);
          break;
        case ƒ.KEYBOARD_CODE.L:
          console.log(loaded.getChild(0)?.mtxWorld.toString());
          break;
      }
    }


    slcFile = document.getElementById("file") as HTMLSelectElement;
    slcAmount = document.getElementById("amount") as HTMLSelectElement;
    const selectedFile: number = parseInt(sessionStorage.getItem('selectedFile'));
    if (selectedFile != undefined)
      slcFile.selectedIndex = selectedFile;
    const selectedAmount: number = parseInt(sessionStorage.getItem('selectedAmount'));
    if (selectedAmount != undefined)
      slcAmount.selectedIndex = selectedAmount;
    load();
  }
}


async function load(): Promise<void> {
  // load scene
  SkeletonTest.loader = await FudgeCore.GLTFLoader.LOAD(SkeletonTest.slcFile.value);

  const amount: number = parseInt(SkeletonTest.slcAmount.value);
  if (amount == 1) {
    SkeletonTest.loaded = await SkeletonTest.loader.getGraph();
    let animation: FudgeCore.Animation = await SkeletonTest.loader.getAnimation(0);
    FudgeCore.Project.register(animation);
    if (animation && !SkeletonTest.loaded.getComponent(FudgeCore.ComponentAnimation))
      SkeletonTest.loaded.addComponent(new FudgeCore.ComponentAnimation(animation));
  } else {
    SkeletonTest.loaded = new FudgeCore.Node("Scene");
    for (let i: number = 0; i < amount; i++) {
      let graph: FudgeCore.Graph = <FudgeCore.Graph>await SkeletonTest.loader.getGraph();
      FudgeCore.Project.register(graph);
      let instance: FudgeCore.GraphInstance = await FudgeCore.Project.createGraphInstance(graph);
      let animation: FudgeCore.Animation = await SkeletonTest.loader.getAnimation(0);
      if (animation && !instance.getComponent(FudgeCore.ComponentAnimation))
        instance.addComponent(new FudgeCore.ComponentAnimation(animation));
      instance.addComponent(new FudgeCore.ComponentTransform());
      instance.name = "instance" + i;
      instance.mtxLocal.translateX((i * 2 - (amount - 1)) * 1.5);
      SkeletonTest.loaded.addChild(instance);
    }
  }

  SkeletonTest.cmpAnimation = SkeletonTest.loaded?.getComponent(FudgeCore.ComponentAnimation);
  // SkeletonTest.loaded.name = "loaded";
  // loaded.getComponent(FudgeCore.ComponentAnimation)?.activate(false);
  let root: FudgeCore.Node = SkeletonTest.viewport.getBranch();
  let loaded: FudgeCore.Node = root.getChildrenByName("Scene")[0];
  if (loaded)
    root.replaceChild(loaded, SkeletonTest.loaded);
  else
    root.appendChild(SkeletonTest.loaded);

  FudgeCore.Debug.log("Loader:", SkeletonTest.loader);
  FudgeCore.Debug.log("Loaded:", SkeletonTest.loaded);

  // To store the selected option in sessionStorage
  sessionStorage.setItem('selectedFile', SkeletonTest.slcFile.selectedIndex.toString());
  sessionStorage.setItem('selectedAmount', SkeletonTest.slcAmount.selectedIndex.toString());
}