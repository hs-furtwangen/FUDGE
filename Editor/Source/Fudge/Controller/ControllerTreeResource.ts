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

      if (!(_object instanceof ResourceFolder)) {
        input.setAttribute("icon", _object.type);

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
      // TODO: Maybe the tree controller should provide the selected entries?
      let expend: ResourceEntry[] = this.selection.length > 0 ? this.selection : _focussed;

      let iRoot: number = expend.indexOf(project.resourceFolder);
      if (iRoot > -1)
        expend.splice(iRoot, 1);

      let files: Set<ResourceFile> = new Set();
      let folders: Set<ResourceFolder> = new Set();

      for (let expendable of expend)
        this.collectEntries(expendable, files, folders);

      let serializations: ƒ.SerializationOfResources = ƒ.Project.serialize();
      let serializationStrings: Map<ƒ.SerializableResource, string> = new Map();
      let usages: ƒ.Mutator = {};

      for (let idResource in serializations)
        serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));

      for (let file of files) {
        usages[file.idResource] = [];
        for (let resource of serializationStrings.keys())
          if (resource.idResource != file.idResource)
            if (serializationStrings.get(resource).indexOf(file.idResource) > -1)
              usages[file.idResource].push(resource.name + " " + resource.type);
      }

      if (expend.length > 0 && await openDialog()) {
        let deletedFiles: ResourceFile[] = [];

        for (let selected of files)
          if (usages[selected.idResource].length == 0)  // delete only unused
            deletedFiles.push(selected);

        for (let resource of deletedFiles) {
          ƒ.Project.deregister(resource);
          this.remove(resource);
          this.selection.splice(this.selection.indexOf(resource), 1);
        }

        let deletedFolders: ResourceFolder[] = [];
        for (let folder of folders)
          this.deleteFolders(folder, deletedFolders);

        return [...deletedFiles, ...deletedFolders];
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


    public async copy(_originals: ResourceEntry[]): Promise<ResourceEntry[]> {
      return [];
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


    private collectEntries(_entry: ResourceEntry, _files: Set<ResourceFile>, _folders: Set<ResourceFolder>): void {
      if (_entry instanceof ResourceFolder) {
        for (let entry of _entry.entries) 
          this.collectEntries(entry, _files, _folders);
        _folders.add(_entry);
      } else {
        _files.add(_entry);
      }
    }

    private deleteFolders(_folder: ResourceFolder, _deleted: ResourceFolder[]): void {
      for (let entry of _folder.entries)
        if (entry instanceof ResourceFolder)
          this.deleteFolders(entry, _deleted);

      if (_folder.entries.length == 0) {
        this.remove(_folder);
        this.selection.splice(this.selection.indexOf(_folder), 1);
        _deleted.push(_folder);
      }
    }
  }
}