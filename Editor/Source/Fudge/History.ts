namespace Fudge {
  import ƒ = FudgeCore;

  export type historySource = ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> | ƒ.Node | ƒ.Project;
  export type historyTarget = ƒ.Mutator | ƒ.Node | ƒ.Component | ƒ.SerializableResource;
  export enum HISTORY { MUTATE, ADD, REMOVE };
  type undoStep = [HISTORY, historySource, historyTarget];
  enum DO { UN, RE };

  export class History {
    static #steps: undoStep[] = [];
    static #block: boolean = false;
    static #pointer: number = 0;

    public static async save(_action: HISTORY, _owner: historySource, _owned: historyTarget): Promise<void> {
      if (History.#block) // block recording, especially when undoing
        return;

      if (History.#pointer < History.#steps.length) // undos were processed, pointer doesn't point to end of history
        History.#steps.splice(History.#pointer);

      History.#steps.push([_action, _owner, _owned]);
      History.#pointer = History.#steps.length;
      this.undoLog();
    };
    public static async redo(): Promise<void> {
      if (History.#pointer == 0) // no actions saved in list or and of list reached
        return;

      History.#pointer = Math.min(History.#pointer + 1, History.#steps.length);
    }

    public static async undo(): Promise<void> {
      History.#pointer--;
      if (History.#pointer < 0) {
        History.#pointer = 0;
        return;
      }

      let step: undoStep = History.#steps[this.#pointer];
      if (!step)
        return;

      History.#block = true;
      try {
        let [action, source, target] = step;
        if (source instanceof ƒ.Node) {
          History.processNode(DO.UN, action, source, target);
        } else if (source == ƒ.Project) {
          if (action == HISTORY.ADD) {
            ƒ.Project.deregister(<ƒ.SerializableResource>target);
            document.dispatchEvent(new CustomEvent(EVENT_EDITOR.DELETE, { detail: { sender: History } }));
          }
          if (action == HISTORY.REMOVE) {
            ƒ.Project.resources[(<ƒ.SerializableResource>target).idResource] = <ƒ.SerializableResource>target;
            document.dispatchEvent(new CustomEvent(EVENT_EDITOR.CREATE, { detail: { sender: History } }));
          }

          document.dispatchEvent(new CustomEvent(EVENT_EDITOR.SELECT, {
            detail: { node: target instanceof ƒ.Node && action == HISTORY.REMOVE ? target : source }
          }));
        } else {
          await (<ƒ.Mutable | ƒ.MutableArray<ƒ.General>>source).mutate(target);
          if (source instanceof ƒ.ComponentRigidbody) {
            source.isInitialized = false;
            await source.mutate({}); // just to dispatch mutation event again
          }
        }
      } catch (_a) {
        ƒ.Debug.error(_a);
      }
      History.#block = false;
    }
    public static processNode(_do: DO, _action: HISTORY, _source: ƒ.Node, _target: historyTarget): void {
      let f: ƒ.General = {};
      if (_target instanceof ƒ.Node) {
        f = {
          [HISTORY.REMOVE]: (_o: ƒ.Node) => _source.removeChild(_o),
          [HISTORY.ADD]: (_o: ƒ.Node) => _source.addChild(_o)
        };
      }
      if (_target instanceof ƒ.Component) {
        f = {
          [HISTORY.REMOVE]: (_o: ƒ.Component) => _source.removeComponent(_o),
          [HISTORY.ADD]: (_o: ƒ.Component) => _source.addComponent(_o)
        };
      }
      let action: HISTORY = _action;
      if (_do == DO.UN) // reverse action
        action = action == HISTORY.ADD ? HISTORY.REMOVE : HISTORY.ADD;
      f[action](_target);

      document.dispatchEvent(new CustomEvent(EVENT_EDITOR.SELECT, {
        detail: { node: _target instanceof ƒ.Node && _action == HISTORY.REMOVE ? _target : _source }
      }));
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