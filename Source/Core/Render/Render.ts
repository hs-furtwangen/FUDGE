namespace FudgeCore {
  export type MapLightTypeToLightList = Map<LIGHT_TYPE, RecycableArray<ComponentLight>>;

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
    static readonly #eventPrepare: RecyclableEvent = RecyclableEvent.get(EVENT.RENDER_PREPARE);
    static readonly #eventPrepareStart: RecyclableEvent = RecyclableEvent.get(EVENT.RENDER_PREPARE_START);
    static readonly #eventPrepareEnd: RecyclableEvent = RecyclableEvent.get(EVENT.RENDER_PREPARE_END);

    static readonly #defaultRootNode: Node = new Node("Root");
    static readonly #defaultOptions: RenderPrepareOptions = {};

    static readonly #mapNodeToParent: WeakMap<Node, Node> = new WeakMap<Node, Node>();

    /**
     * Recursively iterates over the branch starting with the node given, recalculates all world transforms, 
     * collects all lights and feeds the renderbuffers with the neccessary node and component data to draw a frame. Sorts nodes for different
     * render passes.
     * @param _recalculate - set true to force recalculation of all world transforms in the given branch, even if their local transforms haven't changed
     */
    public static prepare(_branch: Node, _options: RenderPrepareOptions = Render.#defaultOptions, _recalculate: boolean = false): void {
      Render.timestampUpdate = performance.now();
      Render.nodesSimple.reset();
      Render.nodesAlpha.reset();
      Render.nodesPhysics.reset();
      Render.componentsPick.reset();
      Render.componentsSkeleton.reset();

      for (const cmpLights of Render.lights.values())
        cmpLights.reset();

      Node.resetRenderData();
      Coat.resetRenderData();

      _branch.dispatchEvent(Render.#eventPrepareStart);
      this.prepareBranch(_branch, _options, _branch.getParent() ?? Render.#defaultRootNode, _recalculate);
      _branch.dispatchEvent(Render.#eventPrepareEnd);

      for (const cmpSkeleton of Render.componentsSkeleton)
        cmpSkeleton.updateRenderBuffer();
      Node.updateRenderbuffer();
      Coat.updateRenderbuffer();
      ComponentLight.updateRenderbuffer(Render.lights);
    }

    public static addLights(_cmpLights: readonly ComponentLight[]): void {
      for (let cmpLight of _cmpLights) {
        if (!cmpLight.isActive)
          continue;

        let type: LIGHT_TYPE = cmpLight.lightType;
        let lightsOfType: RecycableArray<ComponentLight> = Render.lights.get(type);
        if (!lightsOfType) {
          lightsOfType = new RecycableArray<ComponentLight>();
          Render.lights.set(type, lightsOfType);
        }
        lightsOfType.push(cmpLight);
      }
    }

    /**
     * Draws the scene from the point of view of the given camera
     */
    public static draw(_cmpCamera: ComponentCamera): void {
      let nodesAlpha: Node[];
      if (Render.nodesAlpha.length > 0) { // TODO: avoid object and function creation in loop
        for (let node of Render.nodesAlpha)
          Reflect.set(node, "zCamera", _cmpCamera.pointWorldToClip(node.getComponent(ComponentMesh).mtxWorld.translation).z);

        nodesAlpha = Render.nodesAlpha.getSorted((_a: Node, _b: Node) => Reflect.get(_b, "zCamera") - Reflect.get(_a, "zCamera"));
      }

      Render.drawNodes(Render.nodesSimple, nodesAlpha ?? Render.nodesAlpha, _cmpCamera);
    }

    private static prepareBranch(_branch: Node, _options: RenderPrepareOptions, _parent: Node, _recalculate: boolean): void {
      if (!_branch.isActive)
        return; // don't add branch to render list if not active

      _branch.nNodesInBranch = 1;
      _branch.radius = 0;
      _branch.timestampUpdate = Render.timestampUpdate;
      _branch.dispatchEventToTargetOnly(Render.#eventPrepare); // TODO: try to handle more component logic via events

      const mtxWorldParent: Matrix4x4 = _parent.mtxWorld;
      const mtxWorldBranch: Matrix4x4 = _branch.mtxWorld;

      let previousParent: Node = Render.#mapNodeToParent.get(_branch);
      if (_parent != previousParent) {
        Render.#mapNodeToParent.set(_branch, _parent);
        _recalculate = true;
      }

      const cmpTransform: ComponentTransform = _branch.getComponent(ComponentTransform);
      if (cmpTransform?.isActive) {
        const mtxLocal: Matrix4x4 = cmpTransform.mtxLocal;
        if ((_recalculate ||= mtxLocal.modified)) {
          Matrix4x4.PRODUCT(mtxWorldParent, mtxLocal, mtxWorldBranch);
          mtxLocal.modified = false;
        }
      } else
        mtxWorldBranch.copy(mtxWorldParent); // overwrite readonly mtxWorld of the current node

      const cmpRigidbody: ComponentRigidbody = _branch.getComponent(ComponentRigidbody);
      if (cmpRigidbody?.isActive) { //TODO: support de-/activation throughout
        Render.nodesPhysics.push(_branch); // add this node to physics list
        if (!_options?.ignorePhysics)
          this.transformByPhysics(_branch, cmpRigidbody);
      }

      const cmpPick: ComponentPick = _branch.getComponent(ComponentPick);
      if (cmpPick?.isActive) {
        Render.componentsPick.push(cmpPick); // add this component to pick list
      }

      const cmpLights: readonly ComponentLight[] = _branch.getComponents(ComponentLight);
      Render.addLights(cmpLights);

      const cmpMesh: ComponentMesh = _branch.getComponent(ComponentMesh);
      const cmpMaterial: ComponentMaterial = _branch.getComponent(ComponentMaterial);
      if (cmpMesh?.isActive && cmpMaterial?.isActive) {
        if (cmpMesh.mtxPivot.modified || _recalculate) {
          Matrix4x4.PRODUCT(mtxWorldBranch, cmpMesh.mtxPivot, cmpMesh.mtxWorld);
          cmpMesh.mtxPivot.modified = false;
        }

        const cmpFaceCamera: ComponentFaceCamera = _branch.getComponent(ComponentFaceCamera);
        const cmpParticleSystem: ComponentParticleSystem = _branch.getComponent(ComponentParticleSystem);
        _branch.updateRenderData(cmpMesh, cmpMaterial, cmpFaceCamera, cmpParticleSystem);

        _branch.radius = cmpMesh.radius;
        if (cmpMaterial.sortForAlpha || _branch.getComponent(ComponentText)) // always sort text for alpha
          Render.nodesAlpha.push(_branch); // add this node to render list
        else
          Render.nodesSimple.push(_branch); // add this node to render list

        const material: Material = cmpMaterial.material;
        if (material?.timestampUpdate < Render.timestampUpdate) {
          material.timestampUpdate = Render.timestampUpdate;
          material.coat.updateRenderData();
        }
      }

      const cmpCamera: ComponentCamera = _branch.getComponent(ComponentCamera) ?? _branch.getComponent(ComponentVRDevice); // checking for both of these is rather slow, maybe only update used cameras after all?
      if (cmpCamera && cmpCamera.isActive && (cmpCamera.mtxPivot.modified || _recalculate)) {
        Matrix4x4.PRODUCT(mtxWorldBranch, cmpCamera.mtxPivot, cmpCamera.mtxWorld);
        cmpCamera.mtxPivot.modified = false;
      }

      const cmpSkeletons: readonly ComponentSkeleton[] = _branch.getComponents(ComponentSkeleton);
      for (let cmpSkeleton of cmpSkeletons)
        if (cmpSkeleton?.isActive)
          Render.componentsSkeleton.push(cmpSkeleton);

      for (let child of _branch.getChildren()) {
        Render.prepareBranch(child, _options, _branch, _recalculate);

        _branch.nNodesInBranch += child.nNodesInBranch;
        _branch.radius = Math.max(
          _branch.radius,
          (child.getComponent(ComponentMesh)?.mtxWorld.translation ?? child.mtxWorld.translation).getDistance(mtxWorldBranch.translation) + child.radius
        );
      }
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
