namespace FudgeCore {
  export interface MapClassToComponents {
    [className: string]: Component[];
  }

  /**
   * Represents a node in the scenetree.
   * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Graph
   */
  export class Node extends EventTargetUnified implements Serializable {
    public name: string; // The name to call this node by.
    public readonly mtxWorld: Matrix4x4 = Matrix4x4.IDENTITY();
    public timestampUpdate: number = 0;
    /** The number of nodes of the whole branch including this node and all successors */
    public nNodesInBranch: number = 0;
    /** The radius of the bounding sphere in world dimensions enclosing the geometry of this node and all successors in the branch */
    public radius: number = 0;

    private parent: Node | null = null; // The parent of this node.
    private children: Node[] = []; // array of child nodes appended to this node.
    private components: MapClassToComponents = {};
    // private tags: string[] = []; // Names of tags that are attached to this node. (TODO: As of yet no functionality)
    // private layers: string[] = []; // Names of the layers this node is on. (TODO: As of yet no functionality)
    private active: boolean = true;
    #listeners: MapEventTypeToListeners = {};
    #captures: MapEventTypeToListeners = {};

    #mtxWorldInverseUpdated: number;
    #mtxWorldInverse: Matrix4x4;

    /**
     * Creates a new node with a name and initializes all attributes
     */
    public constructor(_name: string) {
      super();
      this.name = _name;
    }

    /**
     * Return the mutator-like path string to get from one node to another or null if no path is found e.g.:
     * ```typescript
     * "node/parent/children/1/components/ComponentSkeleton/0"
     * ```
     */
    public static PATH_FROM_TO(_from: Node | Component, _to: Node | Component): string | null {
      const from: Node = _from instanceof Component ? _from.node : _from;
      const to: Node = _to instanceof Component ? _to.node : _to;
      if (!from || !to)
        return null;

      // find paths to lowest common ancestor
      let pathFrom: Node[] = from.getPath();
      let pathTo: Node[] = to.getPath();
      let ancestor: Node = null;
      while (pathFrom.length && pathTo.length && pathFrom[0] == pathTo[0]) {
        ancestor = pathFrom.shift();
        pathTo.shift();
      }
      pathTo.unshift(ancestor);

      if (!ancestor)
        return null;

      // create relative path
      let pathToAncestor: string[] = pathFrom.map(_node => "parent"); // TODO: use "keyof Node" as type
      let pathFromAncestor: string[] = pathTo
        .flatMap((_node, _index, _array) => ["children", _node.findChild(_array[_index + 1]).toString()])
        .slice(0, -2);

      if (_from instanceof Component)
        pathToAncestor.unshift("node");
      if (_to instanceof Component)
        pathFromAncestor.push("components", _to.type, to.components[_to.type].indexOf(_to).toString());

      return pathToAncestor.concat(pathFromAncestor).join("/"); // TODO: or maybe validate this string with node and component objects?
    }

    /**
     * Return the {@link Node} or {@link Component} found at the given path starting from the given node or undefined if not found
     */
    public static FIND<T = Node | Component>(_from: Node | Component, _path: string): T {
      if (_path == "")
        return <T>_from;

      let path: string[] = _path.split("/");
      let to: General = _from;

      while (path.length && to)
        to = Reflect.get(to, path.shift());

      return to;
    }

    /** @internal reroute to {@link RenderManagerNode.resetRenderData} */
    @RenderManagerNode.decorate
    public static resetRenderData(): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerNode.updateRenderbuffer} */
    @RenderManagerNode.decorate
    public static updateRenderbuffer(): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerNode.updateRenderData} */
    @RenderManagerNode.decorate
    protected static updateRenderData(_node: Node, _cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial, _cmpFaceCamera: ComponentFaceCamera, _cmpParticleSystem: ComponentParticleSystem): void { /* injected */ };

    /** @internal reroute to {@link RenderManagerNode.useRenderData} */
    @RenderManagerNode.decorate
    protected static useRenderData(_node: Node, _mtxWorldOverride?: Matrix4x4): void { /* injected */ };

    public get isActive(): boolean {
      return this.active;
    }

    /**
     * Shortcut to retrieve this nodes {@link ComponentTransform}
     */
    public get cmpTransform(): ComponentTransform {
      return <ComponentTransform>this.getComponent(ComponentTransform);
    }

    /**
     * Shortcut to retrieve the local {@link Matrix4x4} attached to this nodes {@link ComponentTransform}  
     * Fails if no {@link ComponentTransform} is attached
     */
    public get mtxLocal(): Matrix4x4 {
      return this.cmpTransform?.mtxLocal;
    }

    public get mtxWorldInverse(): Matrix4x4 {
      if (this.#mtxWorldInverseUpdated != this.timestampUpdate)
        this.#mtxWorldInverse = Matrix4x4.INVERSE(this.mtxWorld);

      this.#mtxWorldInverseUpdated = this.timestampUpdate;
      return this.#mtxWorldInverse;
    }

    /**
     * Returns the number of children attached to this
     */
    public get nChildren(): number {
      return this.children.length;
    }

    /**
     * Generator yielding the node and all decendants in the graph below for iteration
     * Inactive nodes and their descendants can be filtered
     */
    public * getIterator(_active: boolean = false): IterableIterator<Node> {
      if (!_active || this.isActive) {
        yield this;
        for (let child of this.children)
          yield* child.getIterator(_active);
      }
    }

    /**
     * Returns an iterator over this node and all its descendants in the graph below
     */
    public [Symbol.iterator](): IterableIterator<Node> {
      return this.getIterator();
    }

    /** Called by the render system during {@link Render.prepare}. Override this to provide the render system with additional render data. */
    public updateRenderData(_cmpMesh: ComponentMesh, _cmpMaterial: ComponentMaterial, _cmpFaceCamera: ComponentFaceCamera, _cmpParticleSystem: ComponentParticleSystem): void {
      Node.updateRenderData(this, _cmpMesh, _cmpMaterial, _cmpFaceCamera, _cmpParticleSystem);
    };

    /** Called by the render system during {@link Render.draw}. Override this to provide the render system with additional render data. */
    public useRenderData(_mtxWorldOverride?: Matrix4x4): void {
      Node.useRenderData(this, _mtxWorldOverride);
    };

    /**
     * De- / Activate this node. Inactive nodes will not be processed by the renderer.
     */
    public activate(_on: boolean): void {
      this.active = _on;
      this.dispatchEvent(new Event(_on ? EVENT.NODE_ACTIVATE : EVENT.NODE_DEACTIVATE, { bubbles: true }));
      this.broadcastEvent(new Event(_on ? EVENT.NODE_ACTIVATE : EVENT.NODE_DEACTIVATE));
    }

    // #region Scenetree
    /**
     * Returns a reference to this nodes parent node
     */
    public getParent(): Node | null {
      return this.parent;
    }

    /**
     * Traces back the ancestors of this node and returns the first.
     */
    public getAncestor(): Node | null {
      let ancestor: Node = this;
      while (ancestor.getParent())
        ancestor = ancestor.getParent();
      return ancestor;
    }

    /**
     * Traces the hierarchy upwards to the root and returns the path from the root to this node.
     */
    public getPath(_out: Node[] = [], _offset: number = 0): Node[] {
      let ancestor: Node = this;
      _out[_offset] = ancestor;
      while ((ancestor = ancestor.getParent()))
        _out[++_offset] = ancestor;
      return _out.reverse();
    }

    /**
     * Returns child at the given index in the list of children
     */
    public getChild(_index: number): Node {
      return this.children[_index];
    }

    /**
     * Returns the readonly list of children. Create a copy to modify it.
     */
    public getChildren(): readonly Node[] {
      return this.children;
    }

    /**
     * Returns the first child with the supplied name. 
     */
    public getChildByName(_name: string): Node {
      for (let i: number = 0; i < this.children.length; i++) { // no garbage creation
        if (this.children[i].name == _name)
          return this.children[i];
      }
      return null;
    }

    /**
     * Returns an array of references to childnodes with the supplied name. 
     */
    public getChildrenByName(_name: string): Node[] {
      let found: Node[] = [];
      found = this.children.filter((_node: Node) => _node.name == _name);
      return found;
    }

    /**
     * Returns the first descendant with the supplied name. Depth first search.
     */
    public getDescendantByName(_name: string): Node {
      for (let i: number = 0; i < this.children.length; i++) { // no garbage creation
        let child: Node = this.children[i];
        if (child.name == _name)
          return child;
        
        let descendant: Node = child.getDescendantByName(_name);
        if (descendant)
          return descendant;
      }

      return null;
    }

    /**
     * Simply calls {@link addChild}. This reference is here solely because appendChild is the equivalent method in DOM.
     * See and preferably use {@link addChild}
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public readonly appendChild: (_child: Node) => void = this.addChild;


    /**
     * Adds the given reference to a node to the list of children, if not already in
     * @throws Error when trying to add an ancestor of this 
     */
    public addChild(_child: Node): void;
    /**
     * Adds the given reference to a node to the list of children at the given index. If it is already a child, it is moved to the new position.
     */
    public addChild(_child: Node, _index: number): void;
    public addChild(_child: Node, _index?: number): void {
      if (this.children.includes(_child) && _index == undefined)
        // _node is already a child of this
        return;

      let inAudioGraph: boolean = false;
      let graphListened: Node = AudioManager.default.getGraphListeningTo();
      let ancestor: Node = this;
      while (ancestor) {
        ancestor.timestampUpdate = 0;
        inAudioGraph = inAudioGraph || (ancestor == graphListened);
        if (ancestor == _child)
          throw (new Error("Cyclic reference prohibited in node hierarchy, ancestors must not be added as children"));
        else
          ancestor = ancestor.parent;
      }

      let previousParent: Node = _child.parent;
      if (previousParent == this && _index > previousParent.findChild(_child))
        _index--;

      if (previousParent)
        previousParent.removeChild(_child);

      this.children.splice(_index ?? this.children.length, 0, _child);
      _child.parent = this;
      _child.dispatchEvent(new Event(EVENT.CHILD_APPEND, { bubbles: true }));
      if (inAudioGraph)
        _child.broadcastEvent(new Event(EVENT_AUDIO.CHILD_APPEND));
    }

    /**
     * Removes the reference to the give node from the list of children
     */
    public removeChild(_child: Node): void {
      let found: number = this.findChild(_child);
      if (found < 0)
        return;

      _child.dispatchEvent(new Event(EVENT.CHILD_REMOVE, { bubbles: true }));
      _child.broadcastEvent(new Event(EVENT.NODE_DEACTIVATE));
      if (this.isDescendantOf(AudioManager.default.getGraphListeningTo()))
        _child.broadcastEvent(new Event(EVENT_AUDIO.CHILD_REMOVE));
      this.children.splice(found, 1);
      _child.parent = null;
    }

    /**
     * Removes all references in the list of children
     */
    public removeAllChildren(): void {
      while (this.children.length)
        this.removeChild(this.children[0]);
    }

    /**
     * Returns the position of the node in the list of children or -1 if not found
     */
    public findChild(_search: Node): number {
      return this.children.indexOf(_search);
    }

    /**
     * Replaces a child node with another, preserving the position in the list of children
     */
    public replaceChild(_replace: Node, _with: Node): boolean {
      let found: number = this.findChild(_replace);
      if (found < 0)
        return false;

      _with.getParent()?.removeChild(_with);
      this.removeChild(_replace);

      this.addChild(_with, found);

      return true;
    }

    /**
     * Returns true if the given timestamp matches the last update timestamp this node underwent, else false
     */
    public isUpdated(_timestampUpdate: number): boolean {
      return (this.timestampUpdate == _timestampUpdate);
    }

    /** 
     * Returns true if this node is a descendant of the given node, directly or indirectly, else false
     */
    public isDescendantOf(_ancestor: Node): boolean {
      let node: Node = this;
      while (node && node != _ancestor)
        node = node.parent;
      return (node != null);
    }

    /**
     * Applies a Mutator from {@link Animation} to all its components and transfers it to its children.
     */
    public applyAnimation(_mutator: Mutator): void {
      if (_mutator.components) {
        for (const componentType in _mutator.components) {
          let componentsOfType: Component[] = this.components[componentType];
          let mutatorsForType: Mutator[] = _mutator.components[componentType];
          for (let i: number = 0; i < componentsOfType.length; i++)
            componentsOfType[i].mutate(mutatorsForType[i], null, false);
        }
      }

      if (_mutator.children)
        for (const childName in _mutator.children)
          this.getChildByName(childName).applyAnimation(_mutator.children[childName]);
    }
    // #endregion

    // #region Components
    /**
     * Returns a list of all components attached to this node, independent of type. 
     */
    public getAllComponents(): Component[] { // TODO: rework this
      let all: Component[] = [];
      for (let type in this.components) {
        all = all.concat(this.components[type]);
      }
      return all;
    }

    /**
     * Returns the list of components of the given class attached to this node. If no components of this type are attached, an empty array is returned.
     * @returns A **readonly** array of components.
     */
    public getComponents<T extends Component>(_class: new () => T): readonly T[] {
      return <T[]>(this.components[_class.name] ??= []);
    }

    /**
     * Returns the first component found of the given class attached this node or null, if list is empty or doesn't exist
     */
    public getComponent<T extends Component>(_class: new () => T): T {
      return <T>this.components[_class.name]?.[0];
    }

    /**
     * Attach the given component to this node. Identical to {@link addComponent}
     */
    public attach(_component: Component): void {
      this.addComponent(_component);
    }

    /**
     * Attach the given component to this node
     */
    public addComponent(_component: Component): void {
      if (_component.node == this)
        return;
      let cmpList: Component[] = this.components[_component.type];
      if (cmpList === undefined)
        this.components[_component.type] = [_component];
      else if (cmpList.length && _component.isSingleton)
        throw new Error(`Component ${_component.type} is marked singleton and can't be attached, no more than one allowed`);
      else
        cmpList.push(_component);

      _component.attachToNode(this);
      _component.dispatchEvent(new Event(EVENT.COMPONENT_ADD));
      this.dispatchEventToTargetOnly(new CustomEvent(EVENT.COMPONENT_ADD, { detail: _component })); // TODO: see if this is be feasable
    }

    /**
     * Detach the given component from this node. Identical to {@link removeComponent}
     */
    public detach(_component: Component): void {
      this.removeComponent(_component);
    }

    /**
     * Removes all components of the given class attached to this node.
     */
    public removeComponents(_class: new () => Component): void {
      for (const component of this.getComponents(_class))
        this.removeComponent(component);
    }

    /** 
     * Removes the given component from the node, if it was attached, and sets its parent to null. 
     */
    public removeComponent(_component: Component): void {
      try {
        let componentsOfType: Component[] = this.components[_component.type];
        let foundAt: number = componentsOfType.indexOf(_component);
        if (foundAt < 0)
          return;
        _component.dispatchEvent(new Event(EVENT.COMPONENT_REMOVE));
        this.dispatchEventToTargetOnly(new CustomEvent(EVENT.COMPONENT_REMOVE, { detail: _component })); // TODO: see if this would be feasable
        componentsOfType.splice(foundAt, 1);
        _component.attachToNode(null);
      } catch (_error) {
        throw new Error(`Unable to remove component '${_component}'in node named '${this.name}'`);
      }
    }
    // #endregion

    // #region Serialization
    public serialize(): Serialization {
      let serialization: Serialization = {
        name: this.name,
        active: this.active
      };

      let components: Serialization = {};
      for (let type in this.components) {
        if (this.components[type].length == 0)
          continue;

        components[type] = [];
        for (let component of this.components[type]) {
          // components[type].push(component.serialize());
          components[type].push(Serializer.serialize(component));
        }
      }
      serialization["components"] = components;

      let children: Serialization[] = [];
      for (let child of this.children) {
        children.push(Serializer.serialize(child));
      }
      serialization["children"] = children;

      this.dispatchEvent(new Event(EVENT.NODE_SERIALIZED));
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      this.name = _serialization.name;
      // this.parent = is set when the nodes are added

      // deserialize components first so scripts can react to children being appended
      for (let type in _serialization.components) {
        for (let serializedComponent of _serialization.components[type]) {
          let deserializedComponent: Component = <Component>await Serializer.deserialize(serializedComponent);
          this.addComponent(deserializedComponent);
        }
      }

      if (_serialization.children)
        for (let serializedChild of _serialization.children) {
          let deserializedChild: Node = <Node>await Serializer.deserialize(serializedChild);
          this.appendChild(deserializedChild);
        }

      this.dispatchEvent(new Event(EVENT.NODE_DESERIALIZED));
      for (let component of this.getAllComponents())
        component.dispatchEvent(new Event(EVENT.NODE_DESERIALIZED));

      // TODO: consider if this is a good idea
      // const hndGraphDeserialized: EventListenerUnified = () => {
      //   for (let component of this.getAllComponents())
      //     component.dispatchEvent(new Event(EVENT.GRAPH_DESERIALIZED, { bubbles: false }));
      //   this.removeEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
      //   this.removeEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);
      // };
      // this.addEventListener(EVENT.GRAPH_DESERIALIZED, hndGraphDeserialized, true);
      // this.addEventListener(EVENT.GRAPH_INSTANTIATED, hndGraphDeserialized, true);

      this.activate(_serialization.active);
      return this;
    }
    // #endregion

    public toString(): string {
      return this.name;
    }

    /**
     * Creates a string as representation of this node and its descendants
     */
    public toHierarchyString(_node: Node = null, _level: number = 0): string {
      // TODO: refactor for better readability
      if (!_node)
        _node = this;

      let prefix: string = "+".repeat(_level);

      let output: string = prefix + " " + _node.name + " | ";
      for (let type in _node.components)
        output += _node.components[type].length + " " + type.split("Component").pop() + ", ";
      output = output.slice(0, -2) + "</br>";
      for (let child of _node.children) {
        output += this.toHierarchyString(child, _level + 1);
      }
      return output;
    }

    // #region Events
    /**
     * Adds an event listener to the node. The given handler will be called when a matching event is passed to the node.
     * Deviating from the standard EventTarget, here the _handler must be a function and _capture is the only option.
     */
    public addEventListener(_type: EVENT | string, _handler: EventListenerUnified, _capture: boolean /*| AddEventListenerOptions*/ = false): void {
      const listListeners: MapEventTypeToListeners = _capture ? this.#captures : this.#listeners;
      const listenersForType: Set<EventListenerUnified> = listListeners[_type] ??= new Set();
      listenersForType.add(_handler);
    }

    /**
     * Removes an event listener from the node. The signature must match the one used with addEventListener
     */
    public removeEventListener(_type: EVENT | string, _handler: EventListenerUnified, _capture: boolean /*| AddEventListenerOptions*/ = false): void {
      const listenersForType: Set<EventListenerUnified> = _capture ? this.#captures[_type] : this.#listeners[_type];
      if (!listenersForType)
        return;

      listenersForType.delete(_handler);
    }

    /**
     * Dispatches a synthetic event to target. This implementation always returns true (standard: return true only if either event's cancelable attribute value is false or its preventDefault() method was not invoked)
     * The event travels into the hierarchy to this node dispatching the event, invoking matching handlers of the nodes ancestors listening to the capture phase, 
     * than the matching handler of the target node in the target phase, and back out of the hierarchy in the bubbling phase, invoking appropriate handlers of the anvestors
     */
    public dispatchEvent(_event: Event): boolean {
      if (_event instanceof RecyclableEvent) {
        _event.setTarget(this);

        // update path
        const path: Node[] = <Node[]>_event.path;
        path.length = 0;
        this.getPath(path).reverse();

        // capture phase
        _event.setEventPhase(Event.CAPTURING_PHASE);
        for (let i: number = path.length - 1; i >= 1; i--) {
          let ancestor: Node = path[i];
          _event.setCurrentTarget(ancestor);
          this.callListeners(ancestor.#captures[_event.type], _event);
        }

        // target phase
        _event.setEventPhase(Event.AT_TARGET);
        _event.setCurrentTarget(this);
        this.callListeners(this.#captures[_event.type], _event);
        this.callListeners(this.#listeners[_event.type], _event);

        // bubble phase
        if (!_event.bubbles)
          return true;

        _event.setEventPhase(Event.BUBBLING_PHASE);
        for (let i: number = 1; i < path.length; i++) {
          let ancestor: Node = path[i];
          _event.setCurrentTarget(ancestor);
          this.callListeners(ancestor.#listeners[_event.type], _event);
        }
      } else {
        let ancestors: Node[] = [];
        let upcoming: Node = this;
        // overwrite event target
        Object.defineProperty(_event, "target", { writable: true, value: this });
        // TODO: consider using Reflect instead of Object throughout. See also Render and Mutable...
        while (upcoming.parent)
          ancestors.push(upcoming = upcoming.parent);
        Object.defineProperty(_event, "path", { writable: true, value: new Array<Node>(this, ...ancestors) });

        // capture phase
        Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
        for (let i: number = ancestors.length - 1; i >= 0; i--) {
          let ancestor: Node = ancestors[i];
          Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
          this.callListeners(ancestor.#captures[_event.type], _event);
        }

        // target phase
        Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.AT_TARGET });
        Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
        this.callListeners(this.#captures[_event.type], _event);
        this.callListeners(this.#listeners[_event.type], _event);

        if (!_event.bubbles)
          return true;

        // bubble phase
        Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.BUBBLING_PHASE });
        for (let i: number = 0; i < ancestors.length; i++) {
          let ancestor: Node = ancestors[i];
          Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
          this.callListeners(ancestor.#listeners[_event.type], _event);
        }
      }

      return true; //TODO: return a meaningful value, see documentation of dispatch event
    }

    /**
     * Dispatches a synthetic event to target without travelling through the graph hierarchy neither during capture nor bubbling phase
     */
    public dispatchEventToTargetOnly(_event: Event): boolean {
      if (_event instanceof RecyclableEvent) {
        _event.setCurrentTarget(this);
        _event.setEventPhase(Event.AT_TARGET);
      } else {
        Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.AT_TARGET });
        Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
      }

      this.callListeners(this.#listeners[_event.type], _event); // TODO: examine if this should go to the captures instead of the listeners
      return true;
    }

    /**
     * Broadcasts a synthetic event to this node and from there to all nodes deeper in the hierarchy,
     * invoking matching handlers of the nodes listening to the capture phase. Watch performance when there are many nodes involved
     */
    public broadcastEvent(_event: Event): void {
      if (_event instanceof RecyclableEvent) {
        _event.setCurrentTarget(this);
        _event.setEventPhase(Event.CAPTURING_PHASE);
      } else {
        // overwrite event target and phase
        Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
        Object.defineProperty(_event, "target", { writable: true, value: this });
      }

      this.broadcastEventRecursive(_event);
    }

    private broadcastEventRecursive(_event: Event): void {
      if (_event instanceof RecyclableEvent)
        _event.setEventPhase(Event.CAPTURING_PHASE);
      else
        Object.defineProperty(_event, "currentTarget", { writable: true, value: this });

      this.callListeners(this.#captures[_event.type], _event);

      // same for children
      for (let child of this.children) {
        child.broadcastEventRecursive(_event);
      }
    }

    /**
     * Calls the listeners with the given event. The listeners are called in the order they were added. Handles listeners removing themselves or other listeners from the list during execution.
     */
    private callListeners(_listeners: Set<EventListenerUnified>, _event: Event): void {
      if (!_listeners || _listeners.size == 0)
        return;

      for (const handler of _listeners) {
        // @ts-ignore
        handler(_event);
      }
    }
    // #endregion
  }
}