namespace Fudge {
  import ƒ = FudgeCore;

  /**
   * Static class to record the history of manipulations of various entities. Enables undo and redo.
   * A manipulation is recorded as a step with the action taken, the source, which is the entity affected, 
   * and the target, which is the entity being removed or added or a {@link Mutator} describing the manipulation. 
   * @author Jirka Dell'Oro-Friedl, HFU, 2024  
   */

  export type historySource = ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> | ƒ.Node | ƒ.Project;
  export type historyTarget = ƒ.Mutator | ƒ.Node | ƒ.Component | ƒ.SerializableResource;
  export enum HISTORY { MUTATE, ADD, REMOVE };
  type historyStep = [HISTORY, historySource, historyTarget];
  enum DO { UN, RE };

  export class History {
    static #steps: historyStep[] = [];
    static #block: boolean = false;
    static #pointer: number = 0;

    /**
     * Record a step to the history
     */
    public static async save(_action: HISTORY, _source: historySource, _target: historyTarget): Promise<void> {
      if (History.#block) // block recording, especially when undoing
        return;

      if (History.#pointer < History.#steps.length) // undos were processed, pointer doesn't point to end of history
        History.#steps.splice(History.#pointer);

      History.#steps.push([_action, _source, _target]);
      History.#pointer = History.#steps.length;

      History.print();
    };

    /**
     * Redo the step the pointer currently points to. No redo is availabe if the pointer points beyond the end of the history.
     */
    public static async redo(): Promise<void> {
      if (History.#pointer == History.#steps.length) // pointer beyond end of list, no further redos available
        return;

      let step: historyStep = History.#steps[this.#pointer];
      if (!step)
        return;

      
      History.#block = true;
      let [action, source, target] = step;

      if (source instanceof ƒ.Node)
        History.processNode(DO.RE, action, source, target);

      History.#pointer++;
      History.print();
      
      History.#block = false;
    }

    /**
     * Move the pointer back by one step and undo that step. No redo is availabe if the pointer is at the start of the history.
     */
    public static async undo(): Promise<void> {
      if (History.#pointer == 0) // pointer at the start of the list, no further undos available
        return;
      History.#pointer--;

      let step: historyStep = History.#steps[this.#pointer];
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
      History.print();
    }

    /**
     * Process structural changes on a {@link ƒ.Node} or {@link ƒ.Graph}, specifically adding or removing 
     * other {@link ƒ.Node}s or {@link ƒ.Component}s
     */
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

    public static print(): void {
      console.group("History");
      console.log("Pointer: ", History.#pointer);
      History.#steps.forEach((_step, _i) =>
        console.log(
          History.#pointer - 1 == _i ? "->" : "",
          HISTORY[_step[0]],
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
      let stepLast: historyStep = History.#steps.pop();
      let stepPrev: historyStep = History.#steps.pop();
      History.#steps.push(stepLast);
      History.#steps.push(stepPrev);
      this.print();
    }
  }
}