namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export type ResourceEntry = ƒ.SerializableResource | ResourceFolder;

  export class ResourceFolder implements ƒ.Serializable {
    public name: string;
    public entries: ResourceEntry[] = [];
    public readonly type: string = "Folder";

    public constructor(_name: string = "New Folder") {
      this.name = _name;
    }

    /**
     * Returns true if this or any of its descendants contain the given resource.
     */
    public contains(_resource: ƒ.SerializableResource): boolean {
      for (let entry of this.entries)
        if (entry == _resource || entry instanceof ResourceFolder && entry.contains(_resource))
          return true;

      return false;
    }

    /** 
     * Returns the parent folder of the given resource
     */
    public getParent(_of: ResourceEntry): ResourceFolder {
      for (let entry of this.entries) {
        if (entry == _of) 
          return this;
        
        if (entry instanceof ResourceFolder) {
          let parent: ResourceFolder = entry.getParent(_of);
          if (parent) 
            return parent;
        }
      }

      return null;
    }

    /**
     * Returns the path to the given resource starting at this
     */
    public getPath(_to: ResourceEntry): ResourceEntry[] {
      let path: ResourceEntry[] = []; 
      let entry: ResourceEntry = _to;
      while (entry) {
        path.push(entry);
        entry = this.getParent(entry); // this is rather costly now, if it becomes a problem, don't use getParent
      }
      path.reverse();
      return path;
    }

    public serialize(): ƒ.Serialization {
      let serialization: ƒ.Serialization = { name: this.name, entries: [] };
      for (let entry of this.entries) {
        if (entry instanceof ResourceFolder)
          serialization.entries.push(entry.serialize());
        else
          serialization.entries.push({ idResource: entry.idResource });
      }
      return serialization;
    }

    public async deserialize(_serialization: ƒ.Serialization): Promise<ƒ.Serializable> {
      this.name = _serialization.name;
      for (let entrySerialization of _serialization.entries ?? _serialization.children) { // remove "?? _serialization.children" after a while
        let entry: ResourceEntry;
        if ("idResource" in entrySerialization)
          entry = await ƒ.Project.getResource(entrySerialization.idResource);
        else
          entry = <ResourceFolder>await new ResourceFolder().deserialize(entrySerialization);

        if (entry) 
          this.entries.push(entry);
      }
      return this;
    }

    public *[Symbol.iterator](): IterableIterator<ResourceEntry> {
      yield this;
      for (let entry of this.entries) {
        if (entry instanceof ResourceFolder)
          yield* entry;
        else
          yield entry;
      }
    }
  }

  export class ControllerTreeResource extends ƒui.TreeController<ResourceEntry> {
    public createContent(_object: ResourceEntry): HTMLElement {
      let input: HTMLInputElement = document.createElement("input");
      input.value = _object.name;
      input.setAttribute("icon", _object.type);

      if (!(_object instanceof ResourceFolder)) {
        if ((<ƒ.SerializableResourceExternal>_object).status == ƒ.RESOURCE_STATUS.ERROR) {
          input.classList.add("error");
          input.title = "Failed to load resource from file. Check the console for details.";
        }
      }

      return input;
    }

    public getAttributes(_object: ResourceEntry): string {
      return "";
    }

    public async setValue(_entry: ResourceEntry, _element: HTMLInputElement | HTMLSelectElement): Promise<boolean> {
      let rename: boolean = _entry.name != _element.value;
      if (rename) {
        _entry.name = _element.value;
        await (<ƒ.SerializableResourceExternal>_entry).load?.();
      }

      return rename;
    }

    public hasChildren(_entry: ResourceEntry): boolean {
      return _entry instanceof ResourceFolder && _entry.entries.length > 0;
    }

    public getChildren(_entry: ResourceEntry): ResourceEntry[] {
      return _entry instanceof ResourceFolder ? _entry.entries : [];
    }

    public addChildren(_sources: ResourceEntry[], _target: ResourceEntry, _index?: number): ResourceEntry[] {
      if (!(_target instanceof ResourceFolder))
        return [];

      let move: ResourceEntry[] = [];
      for (let source of _sources) {
        let currentIndex: number = _target.entries.indexOf(source); // _index needs to be corrected if we are moving within same parent
        if (currentIndex > -1 && _index > currentIndex)
          _index -= 1;

        this.remove(source);
        move.push(source);

        if (_index == null)
          _target.entries.push(source);
        else
          _target.entries.splice(_index + _sources.indexOf(source), 0, source);
      }
      return move;
    }

    public async delete(_focussed: ResourceEntry[]): Promise<ResourceEntry[]> {
      // TODO: add delete selection instead of _focussed? Why doesn't the Tree class handle this? -> delete might be used in other context...

      let expendables: ResourceEntry[] = this.selection.slice();
      if (expendables.length == 0)
        expendables = _focussed.slice();

      let iRoot: number = expendables.indexOf(project.resourceFolder);
      if (iRoot > -1)
        expendables.splice(iRoot, 1);

      let serializations: ƒ.SerializationOfResources = ƒ.Project.serialize();
      let serializationStrings: Map<ƒ.SerializableResource, string> = new Map();
      let usages: ƒ.Mutator = {};
      let dependency: Map<ResourceEntry, ResourceEntry[]> = new Map();
      for (let idResource in serializations)
        serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));

      for (let expendable of expendables) {
        if (expendable instanceof ResourceFolder)
          dependency.set(expendable, expendable.entries);
        else {
          let depend: ResourceEntry[] = [];
          for (let resource of serializationStrings.keys())
            if (resource.idResource != expendable.idResource)
              if (serializationStrings.get(resource).indexOf(expendable.idResource) > -1)
                depend.push(resource);
          dependency.set(expendable, depend);
        }
      }

      for (let expendable of expendables) {
        let usage: string[] = usages[expendables.indexOf(expendable) + ". " + expendable.name + " " + expendable.type] = [];
        for (let dependend of dependency.get(expendable))
          if (expendable instanceof ResourceFolder) {
            if (dependend instanceof ResourceFolder)
              usage.push(". " + dependend.name + " " + dependend.type);
            else
              usage.push(". " + dependend.name + " " + dependend.idResource);
          } else
            usage.push(". " + dependend.name + " " + (<ƒ.SerializableResource>dependend).idResource);
      }


      if (expendables.length > 0 && await openDialog()) {
        let deleted: ResourceEntry[] = [];

        for (const expendable of expendables) {
          if (dependency.get(expendable).length == 0)
            deleted.push(expendable);
        }

        for (let resource of deleted) {
          if (!(resource instanceof ResourceFolder))
            ƒ.Project.deregister(resource);

          this.remove(resource);
          this.selection.splice(this.selection.indexOf(resource), 1);

          History.save(HISTORY.REMOVE, ƒ.Project, resource);
        }

        return deleted;
      }

      return [];

      async function openDialog(): Promise<boolean> {
        let promise: Promise<boolean> = ƒui.Dialog.prompt(usages, true, "Review references, delete dependend resources first if applicable", "To delete unused resources, press OK", "OK", "Cancel");

        if (await promise) {
          return true;
        } else
          return false;
      }
    }


    public async paste(): Promise<ResourceEntry[]> {
      let objects: ResourceEntry[] = await super.paste();
      for (let object of objects)
        History.save(HISTORY.ADD, ƒ.Project, object);
      document.dispatchEvent(new CustomEvent(EVENT_EDITOR.CREATE, { detail: { sender: History } }));
      return objects;
    }

    public dragOver(_event: DragEvent): ƒui.DROPEFFECT {
      let dropEffect: ƒui.DROPEFFECT = super.dragOver(_event);
      if (View.getViewSource(_event) instanceof ViewExternal) {
        dropEffect = "link";
      } else if (dropEffect == "link")
        dropEffect = "copy";
      return dropEffect;
    }

    public async clone(_originals: ResourceEntry[]): Promise<ResourceEntry[]> {
      let clones: ResourceEntry[] = [];
      for (let resource of _originals)
        if (!(resource instanceof ResourceFolder))
          clones.push(await ƒ.Project.cloneResource(resource));
      return clones;
    }

    public getPath(_resource: ResourceEntry): ResourceEntry[] {
      return project.resourceFolder.getPath(_resource);
    }

    public getParent(_resource: ResourceEntry): ResourceFolder {
      return project.resourceFolder.getParent(_resource);;
    }

    public remove(_resource: ResourceEntry): void {
      let parent: ResourceFolder = project.resourceFolder.getParent(_resource);
      if (!parent)
        return;

      let index: number = parent.entries.indexOf(_resource);
      parent.entries.splice(index, 1);
    }
  }
}