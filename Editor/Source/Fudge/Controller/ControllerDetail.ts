///<reference path="../View/View.ts"/>
///<reference path="../View/Project/ViewExternal.ts"/>
///<reference path="../View/Project/ViewInternalFolder.ts"/>

namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  interface DragDropFilter {
    onKeyAttribute?: string;
    onTypeAttribute?: string;
    fromViews?: (typeof View)[];
    onType?: Function;
    ofType?: Function;
    dropEffect: "copy" | "link" | "move" | "none";
  }

  let filter: { [name: string]: DragDropFilter } = {
    UrlOnTexture: { fromViews: [ViewExternal], onKeyAttribute: "url", onTypeAttribute: "TextureImage", ofType: DirectoryEntry, dropEffect: "link" },
    UrlOnMeshOBJ: { fromViews: [ViewExternal], onKeyAttribute: "url", onTypeAttribute: "MeshOBJ", ofType: DirectoryEntry, dropEffect: "link" },
    UrlOnAudio: { fromViews: [ViewExternal], onKeyAttribute: "url", onTypeAttribute: "Audio", ofType: DirectoryEntry, dropEffect: "link" },
    UrlOnMeshGLTF: { fromViews: [ViewExternal], onKeyAttribute: "url", onTypeAttribute: "MeshGLTF", ofType: DirectoryEntry, dropEffect: "link" }
  };

  export class ControllerDetail extends ƒui.Controller {
    #view: View;

    public constructor(_mutable: ƒ.Mutable, _domElement: HTMLElement, _view: View) {
      super(_mutable, _domElement);
      this.#view = _view;
      this.domElement.addEventListener(ƒui.EVENT.DRAG_OVER, this.hndDragOver);
      this.domElement.addEventListener(ƒui.EVENT.DRAG_ENTER, this.hndDragOver);
      this.domElement.addEventListener(ƒui.EVENT.DROP, this.hndDrop);
      // this.domElement.addEventListener(ƒui.EVENT.MUTATE, this.hndMutate, true);
      this.domElement.addEventListener(ƒui.EVENT.KEY_DOWN, this.hndKey);
      this.domElement.addEventListener(ƒui.EVENT.INSERT, this.hndInsert);
    }

    private hndInsert = (_event: CustomEvent): void => {
      ƒ.Debug.log("INSERT at ControllerDetail");
      ƒ.Debug.log(_event.detail);
      let mutable: ƒ.Mutable = this.mutable[_event.detail.getAttribute("key")];
      ƒ.Debug.log(mutable.type);
      if (mutable instanceof ƒ.MutableArray)
        mutable.push(new mutable.type());
    };

    private hndKey = (_event: KeyboardEvent): void => {
      _event.stopPropagation();
      switch (_event.code) {
        case ƒ.KEYBOARD_CODE.DELETE:
          this.domElement.dispatchEvent(new CustomEvent(ƒui.EVENT.DELETE, { bubbles: true, detail: this }));
          break;
      }
    };

    private hndDragOver = (_event: DragEvent): void => {
      // url on texture
      if (this.filterDragDrop(_event, filter.UrlOnTexture, checkMimeType(MIME.IMAGE))) return;
      // url on meshobj
      if (this.filterDragDrop(_event, filter.UrlOnMeshOBJ, checkMimeType(MIME.MESH))) return;
      // url on audio
      if (this.filterDragDrop(_event, filter.UrlOnAudio, checkMimeType(MIME.AUDIO))) return;
      // url on meshgltf
      if (this.filterDragDrop(_event, filter.UrlOnMeshGLTF, checkMimeType(MIME.GLTF))) return;

      let { mutable, key } = this.getTargetMutableAndKey(_event);
      let metaTypes: ƒ.MetaAttributeTypes = (<ƒ.Mutable>mutable).getMetaAttributeTypes?.() ?? {};
      let metaType: Object | Function = metaTypes[key];
      // console.log(key, metaTypes, metaType);

      let sources: Object[] = ƒui.Clipboard.dragDrop.get();
      if (!metaType || (metaType && typeof metaType == "function" && !(sources[0] instanceof metaType)))
        return;

      _event.dataTransfer.dropEffect = "link";
      _event.preventDefault();
      _event.stopPropagation();

      function checkMimeType(_mime: MIME): (_sources: Object[]) => boolean {
        return (_sources: Object[]): boolean => {
          let sources: DirectoryEntry[] = <DirectoryEntry[]>_sources;
          return (sources.length == 1 && sources[0].getMimeType() == _mime);
        };
      }
    };

    private hndMutate = async (_event: DragEvent): Promise<void> => {
      // console.log("BEFORE", this);
      History.save(HISTORY.MUTATE, this.mutable, this.mutable.getMutator());
    };

    private hndDrop = async (_event: DragEvent): Promise<void> => {
      let setExternalLink: (_sources: Object[]) => boolean = (_sources: Object[]): boolean => {
        let sources: DirectoryEntry[] = <DirectoryEntry[]>_sources;
        (<HTMLInputElement>_event.target).value = sources[0].pathRelative;
        this.mutateOnInput(_event);
        return true;
      };

      // texture
      if (this.filterDragDrop(_event, filter.UrlOnTexture, setExternalLink)) return;
      // texture
      if (this.filterDragDrop(_event, filter.UrlOnMeshOBJ, setExternalLink)) return;
      // audio
      if (this.filterDragDrop(_event, filter.UrlOnAudio, setExternalLink)) return;

      _event.preventDefault();
      _event.stopPropagation();

      let { mutable, key } = this.getTargetMutableAndKey(_event);

      if (this.#view != View.getViewSource(_event)) {
        let sources: Object[] = ƒui.Clipboard.dragDrop.get();
        History.save(HISTORY.LINK, mutable, { [key]: mutable[key] });
        mutable[key] = sources[0];
      }

      this.#view.dispatch(EVENT_EDITOR.MODIFY, { bubbles: true });
    };


    private filterDragDrop(_event: DragEvent, _filter: DragDropFilter, _callback: (_sources: Object[]) => boolean = () => true): boolean {
      let target: HTMLElement = <HTMLElement>_event.target;
      let typeElement: string = target.parentElement.getAttribute("key");
      let typeComponent: string = this.getAncestorWithType(target).getAttribute("type");

      if (_filter.onKeyAttribute && typeElement != _filter.onKeyAttribute) return false;
      if (_filter.onTypeAttribute && typeComponent != _filter.onTypeAttribute) return false;
      if (_filter.onType && !(this.mutable instanceof _filter.onType)) return false;

      let viewSource: View = View.getViewSource(_event);

      if (!_filter.fromViews?.find((_view) => viewSource instanceof _view))
        return false;

      let sources: Object[] = ƒui.Clipboard.dragDrop.get();
      if (!(sources[0] instanceof _filter.ofType))
        return false;

      if (!_callback(sources))
        return false;

      _event.dataTransfer.dropEffect = "link";
      _event.preventDefault();
      _event.stopPropagation();

      return true;
    }

    private getAncestorWithType(_target: EventTarget): HTMLElement {
      let element: HTMLElement = <HTMLElement>_target;
      while (element) {
        let type: string = element.getAttribute("type");
        if (type)
          return element;
        element = element.parentElement;
      }

      return null;
    }

    private getTargetMutableAndKey(_event: Event): { mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>; key: string } {
      let path: ƒ.General[] = _event.composedPath();
      path = path.slice(0, path.indexOf(this.domElement));
      path = path.filter(_element => _element instanceof HTMLElement && (_element.getAttribute("type")));
      path.reverse();

      let mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> = this.mutable;
      let keys: string[] = path.map(_element => _element.getAttribute("key"));
      for (let i: number = 0; i < keys.length - 1; i++)
        mutable = mutable[keys[i]];

      return { mutable, key: keys[keys.length - 1] };
    }
  }
}