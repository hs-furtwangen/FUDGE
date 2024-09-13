namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export type ResourceEntry = ResourceFile | ResourceFolder;

  export interface ResourceFile extends ƒ.SerializableResource {
    resourceParent?: ResourceFolder; // dangerous as a SerializableResource must not have a property with this name itself
  }

  export class ResourceFolder implements ƒ.Serializable {
    public name: string;
    public resourceParent: ResourceFolder;
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

        if (entry) {
          this.entries.push(entry);
          entry.resourceParent = this;
        }
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
        source.resourceParent = _target;
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
            usage.push(". " + dependend.name + " " + (<ResourceFile>dependend).idResource);
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

    /** 
     * Retrieve objects from the clipboard, process and return them to add to the table   
     */
    public async paste(_class: new () => ResourceEntry = null): Promise<ResourceEntry[]> {
      let objects: ResourceEntry[] = await super.paste();
      return this.clone(objects);
    }

    public async clone(_originals: ResourceEntry[]): Promise<ResourceEntry[]> {
      let clones: ResourceEntry[] = [];
      for (let resource of _originals)
        if (!(resource instanceof ResourceFolder))
          clones.push(await ƒ.Project.cloneResource(resource));
      return clones;
    }

    public getPath(_resource: ResourceEntry): ResourceEntry[] {
      let path: ResourceEntry[] = [];
      let current: ResourceEntry = _resource;
      while (current) {
        path.push(current);
        current = current.resourceParent;
      }
      return path.reverse();
    }

    public remove(_resource: ResourceEntry): void {
      let parent: ResourceFolder = _resource.resourceParent;
      if (!parent)
        return;

      let index: number = parent.entries.indexOf(_resource);
      parent.entries.splice(index, 1);
    }
  }
}