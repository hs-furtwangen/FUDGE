namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class ControllerTreeHierarchy extends ƒui.TreeController<ƒ.Node> {

    public createContent(_object: ƒ.Node): HTMLElement {
      let input: HTMLInputElement = document.createElement("input");
      if (_object instanceof ƒ.GraphInstance)
        ƒ.Project.getResource(_object.idSource).then(_graph => {
          _object.name = _graph.name;
          input.value = _graph.name;
          input.disabled = true;
          input.readOnly = true;
        });
      input.value = _object.name;
      return input;
    }

    public getAttributes(_node: ƒ.Node): string {
      let attributes: string[] = [_node.isActive ? "active" : "inactive"];
      if (_node instanceof ƒ.GraphInstance)
        attributes.push("GraphInstance");
      return attributes.join(" ");
    }

    public async setValue(_node: ƒ.Node, _element: HTMLInputElement | HTMLSelectElement): Promise<boolean> {
      let rename: boolean = _node.name != _element.value;
      if (rename) {
        let instance: ƒ.GraphInstance = inGraphInstance(_node);
        if (instance) {
          ƒui.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `Edit the graph "${instance.name}" to rename nodes, save and reload the project<br>Press OK to continue`, "OK", "");
          return false;
        }
        _node.name = _element.value;
        await (<ƒ.GraphGLTF>_node).load?.();
      }

      return rename;
    }

    public hasChildren(_node: ƒ.Node): boolean {
      return _node.getChildren().length > 0;
    }

    public getChildren(_node: ƒ.Node): readonly ƒ.Node[] {
      return _node.getChildren();
    }

    // always clone for now. TODO: may be optimized
    public async paste(): Promise<ƒ.Node[]> {
      let objects: ƒ.Node[] = await super.paste();
      return await this.clone(objects);
    }

    public dragOver(_event: DragEvent): ƒui.DROPEFFECT {
      let dropEffect: ƒui.DROPEFFECT = super.dragOver(_event);
      if (View.getViewSource(_event) instanceof ViewInternal)
        dropEffect = "link";
      else
        dropEffect = dropEffect == "copy" ? "copy" : "move";
      return dropEffect;
    }

    public async drop(_event: DragEvent): Promise<ƒ.Node[]> {
      if (View.getViewSource(_event) instanceof ViewInternal) {
        let objects: ƒ.Node[] = ƒui.Clipboard.dragDrop.get();
        return await this.clone(objects);
      }
      return await super.drop(_event);
    }

    public async delete(_focussed: ƒ.Node[]): Promise<ƒ.Node[]> {
      // delete selection independend of focussed item
      let deleted: ƒ.Node[] = [];
      let expend: ƒ.Node[] = this.selection.length > 0 ? this.selection : _focussed;

      for (let node of expend) {
        let instance: ƒ.GraphInstance = inGraphInstance(node);
        if (instance) {
          ƒui.Dialog.prompt(null, true, `A <i>graph instance</i> gets recreated from the original graph`, `Edit the graph "${instance.name}" to delete "${node.name}", save and reload the project<br>Press OK to continue`, "OK", "");
          return [];
        }
      }
      for (let node of expend)
        if (node.getParent()) {
          node.getParent().removeChild(node);
          deleted.push(node);
        }

      this.selection.splice(0);
      return deleted;
    }

    public addChildren(_children: ƒ.Node[], _target: ƒ.Node, _index?: number): ƒ.Node[] {
      // disallow drop for sources being ancestor to target
      let move: ƒ.Node[] = [];
      for (let child of _children)
        if (!_target.isDescendantOf(child))
          move.push(child);

      move.forEach((_node, _iMove) => _target.addChild(_node, _index == undefined ? _index : _index + _iMove));
      // for (let node of move)
      //   _target.addChild(node, _iTarget);

      return move;
    }

    public async clone(_originals: ƒ.Node[]): Promise<ƒ.Node[]> {
      // try to create copies and return them for paste operation
      let clones: ƒ.Node[] = [];
      for (let original of _originals) {
        if (original instanceof ƒ.Graph)
          clones.push(await ƒ.Project.createGraphInstance(original));
        else {
          let serialization: ƒ.Serialization = ƒ.Serializer.serialize(original);
          let copy: ƒ.Node = <ƒ.Node>await ƒ.Serializer.deserialize(serialization);
          clones.push(copy);
        }
      }
      return clones;
    }

    public canAddChildren(_sources: ƒ.Node[], _target: ƒ.Node): boolean {
      if (_sources.length == 0)
        return false;

      if (!(_sources.every(_source => _source instanceof ƒ.Node)))
        return false;

      return _sources.every(_source => checkGraphDrop(_source, _target));

      function checkGraphDrop(_source: ƒ.Node, _target: ƒ.Node): boolean {
        let idSources: string[] = [];
        for (let node of _source.getIterator())
          if (node instanceof ƒ.GraphInstance)
            idSources.push(node.idSource);
          else if (node instanceof ƒ.Graph)
            idSources.push(node.idResource);

        do {
          if (_target instanceof ƒ.Graph)
            if (idSources.indexOf(_target.idResource) > -1)
              return false;
          if (_target instanceof ƒ.GraphInstance)
            if (idSources.indexOf(_target.idSource) > -1)
              return false;

          _target = _target.getParent();
        } while (_target);

        return true;
      }
    }
  }
}