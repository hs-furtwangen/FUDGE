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
    @ƒ.mutate(Number)
    public red: number = 1;
    @ƒ.mutate(Number)
    public green: number = 1;
    @ƒ.mutate(Number)
    public blue: number = 1;
    @ƒ.mutate(Number)
    public yellow: number = 1;
    @ƒ.mutate(Number)
    public cursor: number = 1;
    protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
  }
  let data: Data = new Data();
  let uiController: ƒUi.Controller;

  async function start(_event: Event): Promise<void> {
    ƒ.Debug.fudge("Start Picking");

    let domHud: HTMLDivElement = document.querySelector("div#ui");
    const details: HTMLDetailsElement = ƒUi.Generator.createDetailsFromMutable(data);
    uiController = new ƒUi.Controller(data, details);
    domHud.appendChild(details);

    await FudgeCore.Project.loadResourcesFromHTML();
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    canvas.addEventListener("mousemove", setCursorPosition);

    // pick the graph to show
    let graph: ƒ.Graph = <ƒ.Graph>await ƒ.Project.getResource("Graph|2021-02-03T16:20:47.935Z|07303");
    graph.appendChild(cursor);

    // setup the viewport
    cmpCamera = new ƒ.ComponentCamera();
    cmpCamera.near = 1;
    cmpCamera.far = 7.3;

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