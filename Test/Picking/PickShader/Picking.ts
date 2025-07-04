namespace Picking {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  import ƒAid = FudgeAid;

  window.addEventListener("load", start);
  let cmpCamera: ƒ.ComponentCamera;
  let viewport: ƒ.Viewport;
  let mouse: ƒ.Vector2 = new ƒ.Vector2();

  let cursor: ƒAid.Node = new ƒAid.Node(
    "Cursor",
    ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(0.05)),
    new ƒ.Material("Cursor", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("darkgray"))),
    new ƒ.MeshSphere("Cursor", 5, 5)
  );

  class Data extends ƒ.Mutable {
    public red: number = 100;
    public green: number = 100;
    public blue: number = 100;
    public yellow: number = 100;
    public cursor: number = 100;
    protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
  }
  let data: Data = new Data();
  let uiController: ƒUi.Controller;

  async function start(_event: Event): Promise<void> {
    ƒ.Debug.fudge("Start Picking");

    let domHud: HTMLDivElement = document.querySelector("div#ui");
    uiController = new ƒUi.Controller(data, domHud);

    await FudgeCore.Project.loadResourcesFromHTML();
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    canvas.addEventListener("mousemove", setCursorPosition);

    // pick the graph to show
    let graph: ƒ.Graph = <ƒ.Graph>await ƒ.Project.getResource("Graph|2021-02-03T16:20:47.935Z|07303");
    graph.appendChild(cursor);

    // setup the viewport
    cmpCamera = new ƒ.ComponentCamera();
    Reflect.set(cmpCamera, "far", 7.3);

    cmpCamera.mtxPivot.translateX(0.3);
    cmpCamera.mtxPivot.translateZ(2.1);

    cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    viewport.draw();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);


    function update(_event: Event): void {
      viewport.draw();
      pick();
    }
  }

  function pick(): void {
    cursor.getComponent(ƒ.ComponentMesh).activate(false);
    let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, mouse);
    cursor.getComponent(ƒ.ComponentMesh).activate(true);
    picks.sort((_a: ƒ.Pick, _b: ƒ.Pick) => _a.zBuffer > _b.zBuffer ? 1 : -1);
    for (let hit of picks) {
      data[hit.node.name] = hit.zBuffer;
    }
    if (picks.length) {
      let pick: ƒ.Pick = picks[0];
      cursor.mtxLocal.translation = pick.posWorld;
      // console.log(pick.normal.toString());
    }
  }

  function setCursorPosition(_event: MouseEvent): void {
    mouse = new ƒ.Vector2(_event.clientX, _event.clientY);
  }

}