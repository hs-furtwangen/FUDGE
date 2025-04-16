namespace FudgeCore {
  export type MapLightTypeToLightList = Map<TypeOfLight, RecycableArray<ComponentLight>>;

  export interface RenderPrepareOptions {
    ignorePhysics?: boolean;
  }

  /**
   * The main interface to the render engine, here WebGL (see superclass {@link RenderWebGL} and the RenderInjectors
   */
  export abstract class Render extends RenderWebGL {
    public static rectClip: Rectangle = new Rectangle(-1, 1, 2, -2);
    public static pickBuffer: Int32Array;   // TODO: research if picking should be optimized using radius picking to filter
    public static readonly nodesPhysics: RecycableArray<Node> = new RecycableArray();
    public static readonly componentsPick: RecycableArray<ComponentPick> = new RecycableArray();
    public static readonly lights: MapLightTypeToLightList = new Map();
    private static readonly nodesSimple: RecycableArray<Node> = new RecycableArray();
    private static readonly nodesAlpha: RecycableArray<Node> = new RecycableArray();
    private static readonly componentsSkeleton: RecycableArray<ComponentSkeleton> = new RecycableArray();
    private static timestampUpdate: number;

    // cache events to avoid frequent recycling
    static readonly #eventPrepare: RecyclableEvent = RecyclableEvent.GET(EVENT.RENDER_PREPARE);
    static readonly #eventPrepareStart: RecyclableEvent = RecyclableEvent.GET(EVENT.RENDER_PREPARE_START);
    static readonly #eventPrepareEnd: RecyclableEvent = RecyclableEvent.GET(EVENT.RENDER_PREPARE_END);

    static readonly #defaultRootNode: Node = new Node("Root");
    static readonly #defaultOptions: RenderPrepareOptions = {};

    static readonly #mapNodeToParent: WeakMap<Node, Node> = new WeakMap<Node, Node>();

    /**
     * Recursively iterates over the branch starting with the node given, recalculates all world transforms, 
     * collects all lights and feeds all shaders used in the graph with these lights. Sorts nodes for different
     * render passes.
     * @param _recalculate - set true to force recalculation of all world transforms in the given branch, even if their local transforms haven't changed
     */
    public static prepare(_branch: Node, _options: RenderPrepareOptions = Render.#defaultOptions, _parent: Node = Render.#defaultRootNode, _recalculate: boolean = false): void {
      Render.timestampUpdate = performance.now();
      Render.nodesSimple.reset();
      Render.nodesAlpha.reset();
      Render.nodesPhysics.reset();
      Render.componentsPick.reset();
      Render.componentsSkeleton.reset();

      Render.lights.forEach(_array => _array.reset());
      Node.resetRenderData();
      Coat.resetRenderData();

      _branch.dispatchEvent(Render.#eventPrepareStart);
      this.prepareBranch(_branch, _options, _parent, _recalculate);
      _branch.dispatchEvent(Render.#eventPrepareEnd);

      for (const cmpSkeleton of Render.componentsSkeleton)
        cmpSkeleton.updateRenderBuffer();
      Node.updateRenderbuffer();
      Coat.updateRenderbuffer();

      Render.bufferLights(Render.lights); // TODO: buffer lights directly instead of collectiung them?
    }

    public static addLights(_cmpLights: readonly ComponentLight[]): void {
      for (let cmpLight of _cmpLights) {
        if (!cmpLight.isActive)
          continue;

        let type: TypeOfLight = cmpLight.light.getType();
        let lightsOfType: RecycableArray<ComponentLight> = Render.lights.get(type);
        if (!lightsOfType) {
          lightsOfType = new RecycableArray<ComponentLight>();
          Render.lights.set(type, lightsOfType);
        }
        lightsOfType.push(cmpLight);
      }
    }

    /**
     * Used with a {@link Picker}-camera, this method renders one pixel with picking information 
     * for each node in the line of sight and return that as an unsorted {@link Pick}-array
     */
    public static pick(_nodes: Node[], _cmpCamera: ComponentCamera): Pick[] { // TODO: see if third parameter _world?: Matrix4x4 would be usefull
      return Render.pickFrom(_nodes, _cmpCamera, super.pick);
    }

    /**
     * Draws the scene from the point of view of the given camera
     */
    public static draw(_cmpCamera: ComponentCamera): void {
      // TODO: sort nodes alpha in place, don't create new arrays
      for (let node of Render.nodesAlpha)
        Reflect.set(node, "zCamera", _cmpCamera.pointWorldToClip(node.getComponent(ComponentMesh).mtxWorld.translation).z);

      const sorted: Node[] = Render.nodesAlpha.getSorted((_a: Node, _b: Node) => Reflect.get(_b, "zCamera") - Reflect.get(_a, "zCamera"));

      Render.drawNodes(Render.nodesSimple, sorted, _cmpCamera);
    }

    // TODO: replace _mtxWorld with _parent? That way we can detect recalculation of sub-branches that changed their parent, also no need for getParent calls.
    private static prepareBranch(_branch: Node, _options: RenderPrepareOptions, _parent: Node, _recalculate: boolean): void {
      if (!_branch.isActive)
        return; // don't add branch to render list if not active

      _branch.nNodesInBranch = 1;
      _branch.radius = 0;

      // PerformanceMonitor.startMeasure("Render.prepareBranch dispatch prepare");
      _branch.dispatchEventToTargetOnly(Render.#eventPrepare);
      // PerformanceMonitor.endMeasure("Render.prepareBranch dispatch prepare");

      _branch.timestampUpdate = Render.timestampUpdate;

      const mtxWorldParent: Matrix4x4 = _parent.mtxWorld;
      const mtxWorldBranch: Matrix4x4 = _branch.mtxWorld;

      let previousParent: Node = Render.#mapNodeToParent.get(_branch);
      if (_parent != previousParent) {
        Render.#mapNodeToParent.set(_branch, _parent);
        _recalculate = true;
      }

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpTransform");
      const cmpTransform: ComponentTransform = _branch.getComponent(ComponentTransform);
      if (cmpTransform?.isActive) {
        if ((_recalculate ||= cmpTransform.mtxLocal.modified)) {
          Matrix4x4.PRODUCT(mtxWorldParent, cmpTransform.mtxLocal, mtxWorldBranch);
          cmpTransform.mtxLocal.modified = false;
        }
      } else
        mtxWorldBranch.copy(mtxWorldParent); // overwrite readonly mtxWorld of the current node
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpTransform");

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpRigidbody");
      const cmpRigidbody: ComponentRigidbody = _branch.getComponent(ComponentRigidbody);
      if (cmpRigidbody?.isActive) { //TODO: support de-/activation throughout
        Render.nodesPhysics.push(_branch); // add this node to physics list
        if (!_options?.ignorePhysics)
          this.transformByPhysics(_branch, cmpRigidbody);
      }
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpRigidbody");

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpPick");
      const cmpPick: ComponentPick = _branch.getComponent(ComponentPick);
      if (cmpPick?.isActive) {
        Render.componentsPick.push(cmpPick); // add this component to pick list
      }
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpPick");

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpLight");
      const cmpLights: readonly ComponentLight[] = _branch.getComponents(ComponentLight);
      Render.addLights(cmpLights);
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpLight");

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpMesh cmpMaterial");
      const cmpMesh: ComponentMesh = _branch.getComponent(ComponentMesh);
      const cmpMaterial: ComponentMaterial = _branch.getComponent(ComponentMaterial);
      if (cmpMesh?.isActive && cmpMaterial?.isActive) {
        if (cmpMesh.mtxPivot.modified || _recalculate) {
          Matrix4x4.PRODUCT(mtxWorldBranch, cmpMesh.mtxPivot, cmpMesh.mtxWorld);
          cmpMesh.mtxPivot.modified = false;
        }

        let cmpFaceCamera: ComponentFaceCamera = _branch.getComponent(ComponentFaceCamera);
        let cmpParticleSystem: ComponentParticleSystem = _branch.getComponent(ComponentParticleSystem);
        _branch.updateRenderData(cmpMesh, cmpMaterial, cmpFaceCamera, cmpParticleSystem);

        _branch.radius = cmpMesh.radius;
        if (cmpMaterial.sortForAlpha || _branch.getComponent(ComponentText)) // always sort text for alpha
          Render.nodesAlpha.push(_branch); // add this node to render list
        else
          Render.nodesSimple.push(_branch); // add this node to render list

        let material: Material = cmpMaterial.material;
        if (material?.timestampUpdate < Render.timestampUpdate) {
          material.timestampUpdate = Render.timestampUpdate;
          material.coat.updateRenderData();
        }
      }
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpMesh cmpMaterial");

      const cmpCamera: ComponentCamera = _branch.getComponent(ComponentCamera);
      if (cmpCamera && cmpCamera.isActive && (cmpCamera.mtxPivot.modified || _recalculate)) {
        Matrix4x4.PRODUCT(mtxWorldBranch, cmpCamera.mtxPivot, cmpCamera.mtxWorld);
        cmpCamera.mtxPivot.modified = false;
      }

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpSkeleton");
      const cmpSkeletons: readonly ComponentSkeleton[] = _branch.getComponents(ComponentSkeleton);
      for (let cmpSkeleton of cmpSkeletons)
        if (cmpSkeleton?.isActive)
          Render.componentsSkeleton.push(cmpSkeleton);
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpSkeleton");

      for (let child of _branch.getChildren()) {
        Render.prepareBranch(child, _options, _branch, _recalculate);
        _branch.nNodesInBranch += child.nNodesInBranch;

        // PerformanceMonitor.startMeasure("Render.prepareBranch touch children");
        // let cmpMeshChild: ComponentMesh = child.getComponent(ComponentMesh);
        // let position: Vector3 = cmpMeshChild ? cmpMeshChild.mtxWorld.translation : child.mtxWorld.translation;
        // // position = position.clone;
        // _branch.radius = Math.max(_branch.radius, position.getDistance(mtxWorld.translation) + child.radius);
        // // Recycler.store(position);
        // PerformanceMonitor.endMeasure("Render.prepareBranch touch children");
      }

      // PerformanceMonitor.startMeasure("Render.prepareBranch touch parent");

      // parent.nNodesInBranch += _branch.nNodesInBranch;
      let position: Vector3 = cmpMesh?.mtxWorld.translation ?? mtxWorldBranch.translation;
      _parent.radius = Math.max(_parent.radius, position.getDistance(_parent.mtxWorld.translation) + _branch.radius);

      // PerformanceMonitor.endMeasure("Render.prepareBranch touch parent");
    }

    private static transformByPhysics(_node: Node, _cmpRigidbody: ComponentRigidbody): void {
      if (!_cmpRigidbody.isInitialized) // || Project.mode == MODE.EDITOR)
        _cmpRigidbody.initialize();

      if (!Physics.getBodyList().length)
        return;

      if (!_node.mtxLocal) {
        throw (new Error("ComponentRigidbody requires ComponentTransform at the same Node"));
      }

      // _cmpRigidbody.checkCollisionEvents();

      if (_cmpRigidbody.typeBody == BODY_TYPE.KINEMATIC || Project.mode == MODE.EDITOR) { //Case of Kinematic Rigidbody
        let mtxPivotWorld: Matrix4x4 = Matrix4x4.PRODUCT(_node.mtxWorld, _cmpRigidbody.mtxPivotUnscaled);
        _cmpRigidbody.setPosition(mtxPivotWorld.translation);
        _cmpRigidbody.setRotation(mtxPivotWorld.rotation);
        Recycler.store(mtxPivotWorld);
        return;
      }

      let mtxWorld: Matrix4x4 = Matrix4x4.COMPOSITION(_cmpRigidbody.getPosition(), _cmpRigidbody.getRotation());
      mtxWorld.multiply(_cmpRigidbody.mtxPivotInverse);
      _node.mtxWorld.translation = mtxWorld.translation;
      _node.mtxWorld.rotation = mtxWorld.rotation;
      let parent: Node = _node.getParent();
      let mtxLocal: Matrix4x4 = parent ?
        Matrix4x4.RELATIVE(_node.mtxWorld, parent.mtxWorld, parent.mtxWorldInverse) :
        _node.mtxWorld.clone;
      _node.mtxLocal.copy(mtxLocal);
      Recycler.store(mtxWorld);
      Recycler.store(mtxLocal);
    }
  }
}
