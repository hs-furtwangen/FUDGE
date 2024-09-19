namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  export type undoOwner = ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> | ƒ.Node | ƒ.Project;
  export type undoOwned = ƒ.Mutator | ƒ.Node | ƒ.Component | ƒ.SerializableResource;
  export type undoAction = "mutate" | "add" | "remove";
  export type undoStep = [undoAction, undoOwner, undoOwned];

  export class History {
    static #steps: undoStep[] = [];

    public static async save(_action: undoAction, _owner: undoOwner, _owned: undoOwned): Promise<void> {
      History.#steps.push([_action, _owner, _owned]);
      this.undoLog();
    };

    public static async undo(): Promise<void> {
      let step: undoStep = History.#steps.pop();
      if (step) {
        let action: undoAction = step[0];
        let owner: undoOwner = step[1];
        if (owner instanceof ƒ.Node) {
          console.log(action, "Owner is node", owner);
        } else if (owner instanceof ƒ.Project) {
          console.log(action, "Owner is project", owner);
        } else {
          await owner.mutate(step[1]);
          if (owner instanceof ƒ.ComponentRigidbody) {
            owner.isInitialized = false;
            owner.mutate({}); // just to dispatch mutation event again
          }
        }
      }
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
      let stepLast:undoStep = History.#steps.pop();
      let stepPrev:undoStep = History.#steps.pop();
      History.#steps.push(stepLast);
      History.#steps.push(stepPrev);
      this.undoLog();
    }
  }
}