namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class ControllerTableResource extends ƒui.TableController<ƒ.SerializableResource> {
    private static head: ƒui.TABLE[] = ControllerTableResource.getHead();

    private static getHead(): ƒui.TABLE[] {
      let head: ƒui.TABLE[] = [];
      head.push({ label: "Name", key: "name", sortable: true, editable: true });
      head.push({ label: "Type", key: "type", sortable: true, editable: false });
      head.push({ label: "Id", key: "idResource", sortable: false, editable: false });
      return head;
    }

    public getHead(): ƒui.TABLE[] {
      return ControllerTableResource.head;
    }

    public getLabel(_object: ƒ.SerializableResource): string {
      return "";
    }

    public async rename(_object: ƒ.SerializableResource, _new: string): Promise<boolean> {
      // console.log("Check rename", _object.name, _new);
      let rename: boolean = _object.name != _new;
      if (rename) {
        _object.name = _new; // must rename before loading, TODO: WHY is it that the renaming is supposed to be handled by the actual table???
        await (<ƒ.SerializableResourceExternal>_object).load?.();
      }

      return rename;
    }

    public async paste(): Promise<ƒ.SerializableResource[]> {
      let objects: ƒ.SerializableResource[] = await super.paste();
      for (let object of objects)
        History.save(HISTORY.ADD, ƒ.Project, object);
      document.dispatchEvent(new CustomEvent(EVENT_EDITOR.CREATE, { detail: { sender: History } }));
      return objects;
    }

    public dragOver(_event: DragEvent): ƒui.DROPEFFECT {
      let dropEffect: ƒui.DROPEFFECT = super.dragOver(_event);
      if (dropEffect == "link")
        dropEffect = "copy";
      return dropEffect;
    }

    public async clone(_originals: ƒ.SerializableResource[]): Promise<ƒ.SerializableResource[]> {
      let clones: ƒ.SerializableResource[] = [];
      for (let resource of _originals)
        clones.push(await ƒ.Project.cloneResource(resource));
      return clones;
    }

    public async delete(_focussed: ƒ.SerializableResource[]): Promise<ƒ.SerializableResource[]> {
      // ƒ.Debug.info(_focussed, this.selection);
      // this.selection = [];
      let expendables: ƒ.SerializableResource[] = this.selection.slice(); //_focussed);
      if (expendables.length == 0)
        expendables = _focussed.slice();
      let serializations: ƒ.SerializationOfResources = ƒ.Project.serialize();
      let serializationStrings: Map<ƒ.SerializableResource, string> = new Map();
      let usages: ƒ.Mutator = {};
      let dependency: Map<ƒ.SerializableResource, ƒ.SerializableResource[]> = new Map();
      for (let idResource in serializations)
        serializationStrings.set(ƒ.Project.resources[idResource], JSON.stringify(serializations[idResource]));

      for (let expendable of expendables) {
        let depend: ƒ.SerializableResource[] = [];
        for (let resource of serializationStrings.keys())
          if (resource.idResource != expendable.idResource)
            if (serializationStrings.get(resource).indexOf(expendable.idResource) > -1)
              depend.push(resource);
        dependency.set(expendable, depend);
      }

      for (let expendable of expendables) {
        let usage: string[] = usages[expendables.indexOf(expendable) + ". " + expendable.name + " " + expendable.type] = [];
        for (let dependend of dependency.get(expendable))
          usage.push(". " + dependend.name + " " + dependend.idResource);
      }

      if (await openDialog()) {
        let deleted: ƒ.SerializableResource[] = [];
        for (const expendable of expendables) {
          if (dependency.get(expendable).length == 0) {
            deleted.push(expendable);
            ƒ.Project.deregister(ƒ.Project.resources[expendable.idResource]);
            History.save(HISTORY.REMOVE, ƒ.Project, expendable);
          }
        }
        return deleted;
      }

      async function openDialog(): Promise<boolean> {
        let promise: Promise<boolean> = ƒui.Dialog.prompt(usages, true, "Review references, delete dependend resources first if applicable", "To delete unused resources, press OK", "OK", "Cancel");

        if (await promise) {
          return true;
        } else
          return false;
      }
      return [];
    }


    public sort(_data: ƒ.SerializableResource[], _key: string, _direction: number): void {
      function compare(_a: ƒ.SerializableResource, _b: ƒ.SerializableResource): number {
        return _direction * (_a[_key] == _b[_key] ? 0 : (_a[_key] > _b[_key] ? 1 : -1));
      }

      _data.sort(compare);
    }
  }
}