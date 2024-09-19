namespace Fudge {
  import ƒ = FudgeCore;

  export type undoOwner = ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> | ƒ.Node | ƒ.Project;
  export type undoOwned = ƒ.Mutator | ƒ.Node | ƒ.Component | ƒ.SerializableResource;
  export type undoAction = "mutate" | "add" | "remove";
  export type undoStep = [undoAction, undoOwner, undoOwned];

  export class History {
    static #steps: undoStep[] = [];
    static #block: boolean = false;

    public static async save(_action: undoAction, _owner: undoOwner, _owned: undoOwned): Promise<void> {
      if (History.#block) // block recording, especially when undoing
        return;
      History.#steps.push([_action, _owner, _owned]);
      this.undoLog();
    };

    public static async undo(): Promise<void> {
      let step: undoStep = History.#steps.pop();
      if (!step)
        return;

      History.#block = true;
      try {
        let [action, owner, owned] = step;
        if (owner instanceof ƒ.Node) {
          let f: ƒ.General = {};
          if (owned instanceof ƒ.Node) {
            f = { "add": (_o: ƒ.Node) => owner.removeChild(_o), "remove": (_o: ƒ.Node) => owner.addChild(_o) };
          }
          if (owned instanceof ƒ.Component) {
            f = { "add": (_o: ƒ.Component) => owner.removeComponent(_o), "remove": (_o: ƒ.Component) => owner.addComponent(_o) };
          }
          f[action](owned);
          document.dispatchEvent(new CustomEvent(EVENT_EDITOR.SELECT, {
            detail: { node: owned instanceof ƒ.Node && action == "remove" ? owned : owner }
          }));
        } else if (owner instanceof ƒ.Project) {
          console.log(action, "Owner is project", owner);
        } else {
          await owner.mutate(owned);
          if (owner instanceof ƒ.ComponentRigidbody) {
            owner.isInitialized = false;
            await owner.mutate({}); // just to dispatch mutation event again
          }
        }
      } catch (_a) {
        ƒ.Debug.error(_a);
      }
      History.#block = false;
    }

    public static undoLog(): void {
      console.group("History");
      History.#steps.forEach(_step =>
        console.log(
          _step[0],
          _step[1].constructor.name,
          _step[2] instanceof ƒ.Mutable || _step[2] instanceof ƒ.Node ?
            _step[2].constructor.name :
            _step[2]
        ));
      console.groupEnd();
    };

    /**
     * In case the order of the last two steps needs to be changed, use this method
     */
    public static swap(): void {
      let stepLast: undoStep = History.#steps.pop();
      let stepPrev: undoStep = History.#steps.pop();
      History.#steps.push(stepLast);
      History.#steps.push(stepPrev);
      this.undoLog();
    }
  }
}