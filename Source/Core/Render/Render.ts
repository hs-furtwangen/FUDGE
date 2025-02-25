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

    private static readonly prepareEvent: ({ currentTarget: Event["currentTarget"] } & Event) = (() => { // reuse the same event for all dispatches
      let event: Event = new Event(EVENT.RENDER_PREPARE);
      Object.defineProperty(event, "eventPhase", { writable: true, value: Event.AT_TARGET });
      Object.defineProperty(event, "currentTarget", { writable: true });
      return event;
    })();

    /**
     * Recursively iterates over the branch starting with the node given, recalculates all world transforms, 
     * collects all lights and feeds all shaders used in the graph with these lights. Sorts nodes for different
     * render passes.
     * @param _recalculate - set true to force recalculation of all world transforms in the given branch, even if their local transforms haven't changed
     */
    @PerformanceMonitor.measure("Render.prepare")
    public static prepare(_branch: Node, _options: RenderPrepareOptions = {}, _mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY(), _recalculate: boolean = false): void {
      PerformanceMonitor.startMeasure("Render.prepare pre");
      Render.timestampUpdate = performance.now();
      Render.nodesSimple.reset();
      Render.nodesAlpha.reset();
      Render.nodesPhysics.reset();
      Render.componentsPick.reset();
      Render.componentsSkeleton.reset();

      Render.lights.forEach(_array => _array.reset());
      Node.resetRenderData();
      Coat.resetRenderData();

      _branch.dispatchEvent(new Event(EVENT.RENDER_PREPARE_START));
      PerformanceMonitor.endMeasure("Render.prepare pre");

      PerformanceMonitor.startMeasure("Render.prepare prepareBranch");
      this.prepareBranch(_branch, _options, _mtxWorld, _recalculate);
      PerformanceMonitor.endMeasure("Render.prepare prepareBranch");

      PerformanceMonitor.startMeasure("Render.prepare post");
      _branch.dispatchEvent(new Event(EVENT.RENDER_PREPARE_END));
      for (const cmpSkeleton of Render.componentsSkeleton) 
        cmpSkeleton.updateRenderBuffer();
      

      Node.updateRenderbuffer();
      Coat.updateRenderbuffer();

      Render.bufferLights(Render.lights);
      PerformanceMonitor.endMeasure("Render.prepare post");
    }

    public static addLights(_cmpLights: ComponentLight[]): void {
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
    @PerformanceMonitor.measure("Render.draw")
    public static draw(_cmpCamera: ComponentCamera): void {
      for (let node of Render.nodesAlpha)
        Reflect.set(node, "zCamera", _cmpCamera.pointWorldToClip(node.getComponent(ComponentMesh).mtxWorld.translation).z);

      const sorted: Node[] = Render.nodesAlpha.getSorted((_a: Node, _b: Node) => Reflect.get(_b, "zCamera") - Reflect.get(_a, "zCamera"));

      Render.drawNodes(Render.nodesSimple, sorted, _cmpCamera);
    }

    private static prepareBranch(_branch: Node, _options: RenderPrepareOptions, _mtxWorld: Matrix4x4, _recalculate: boolean): void {
      if (!_branch.isActive)
        return; // don't add branch to render list if not active

      _branch.nNodesInBranch = 1;
      _branch.radius = 0;

      // PerformanceMonitor.startMeasure("Render.prepareBranch dispatch prepare");
      // Reflect.set(Render.prepareEvent, "currentTarget", _branch);
      Render.prepareEvent.currentTarget = _branch;
      _branch.dispatchPreparedEventToTargetOnly(Render.prepareEvent);
      // PerformanceMonitor.endMeasure("Render.prepareBranch dispatch prepare");

      _branch.timestampUpdate = Render.timestampUpdate;

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpTransform");
      const cmpTransform: ComponentTransform = _branch.getComponent(ComponentTransform);
      if (cmpTransform?.isActive) {
        if ((_recalculate ||= cmpTransform.mtxLocal.modified)) {
          // PerformanceMonitor.startMeasure("Render.prepareBranch mtxWorld * mtxLocal");
          Matrix4x4.PRODUCT(_mtxWorld, cmpTransform.mtxLocal, _branch.mtxWorld);
          // PerformanceMonitor.endMeasure("Render.prepareBranch mtxWorld * mtxLocal");
          cmpTransform.mtxLocal.modified = false;
        }
      } else
        _branch.mtxWorld.copy(_mtxWorld); // overwrite readonly mtxWorld of the current node
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
      const cmpLights: ComponentLight[] = _branch.getComponents(ComponentLight);
      Render.addLights(cmpLights);
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpLight");

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpMesh cmpMaterial");
      const cmpMesh: ComponentMesh = _branch.getComponent(ComponentMesh);
      const cmpMaterial: ComponentMaterial = _branch.getComponent(ComponentMaterial);
      if (cmpMesh?.isActive && cmpMaterial?.isActive) {
        if (cmpMesh.mtxPivot.modified || _branch.mtxWorld.modified) {
          // PerformanceMonitor.startMeasure("Render.prepareBranch mtxWorld * mtxPivot");
          Matrix4x4.PRODUCT(_branch.mtxWorld, cmpMesh.mtxPivot, cmpMesh.mtxWorld);
          // PerformanceMonitor.endMeasure("Render.prepareBranch mtxWorld * mtxPivot");
          cmpMesh.mtxPivot.modified = false;
          _branch.mtxWorld.modified = false;
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

      // PerformanceMonitor.startMeasure("Render.prepareBranch cmpSkeleton");
      const cmpSkeletons: ComponentSkeleton[] = _branch.getComponents(ComponentSkeleton);
      for (let cmpSkeleton of cmpSkeletons)
        if (cmpSkeleton?.isActive)
          Render.componentsSkeleton.push(cmpSkeleton);
      // PerformanceMonitor.endMeasure("Render.prepareBranch cmpSkeleton");

      for (let child of _branch.getChildren()) {
        Render.prepareBranch(child, _options, _branch.mtxWorld, _recalculate);
        _branch.nNodesInBranch += child.nNodesInBranch;

        // PerformanceMonitor.startMeasure("Render.prepareBranch touch children");
        // let cmpMeshChild: ComponentMesh = child.getComponent(ComponentMesh);
        // let position: Vector3 = cmpMeshChild ? cmpMeshChild.mtxWorld.translation : child.mtxWorld.translation;
        // // position = position.clone;
        // _branch.radius = Math.max(_branch.radius, position.getDistance(_branch.mtxWorld.translation) + child.radius);
        // // Recycler.store(position);
        // PerformanceMonitor.endMeasure("Render.prepareBranch touch children");
      }

      // PerformanceMonitor.startMeasure("Render.prepareBranch touch parent");
      let parent: Node = _branch.getParent();
      if (parent) {
        // parent.nNodesInBranch += _branch.nNodesInBranch;
        let position: Vector3 = cmpMesh?.mtxWorld.translation ?? _branch.mtxWorld.translation;
        parent.radius = Math.max(parent.radius, position.getDistance(parent.mtxWorld.translation) + _branch.radius);
      }
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
