namespace FudgeUserInterface {
  /**
   * Common clipboards for all drag-drop and copy-paste operations happening in the user interface
   * @author Jirka Dell'Oro-Friedl, HFU, 2024
   */

  import ƒ = FudgeCore;
  export type ClipOperation = EVENT.COPY | EVENT.CUT;

  export class Clipboard {
    public static dragDrop: Clipboard = new Clipboard();
    public static copyPaste: Clipboard = new Clipboard();
    public objects: ƒ.General[] = [];
    public operation: ClipOperation;

    public get<T>(): T[] {
      return this.objects;
    }

    public clear(): void {
      this.objects = [];
    }

    public set(_objects: Object[], _operation?: ClipOperation): void {
      this.objects = _objects.slice();
      this.operation = _operation;
    }
  }
}
