namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Connects a mutable object to a DOM-Element and synchronizes that mutable with the mutator stored within.
   * Updates the mutable on interaction with the element and the element in time intervals.
   */
  export class Controller {
    // TODO: examine the use of the attribute key vs name. Key signals the use by FUDGE while name is standard and supported by forms
    public domElement: HTMLElement;
    protected timeUpdate: number = 190;
    protected mutable: object;

    private idInterval: number;

    public constructor(_mutable: object, _domElement: HTMLElement) {
      this.domElement = _domElement;
      this.setMutable(_mutable);
      // TODO: examine, if this should register to one common interval, instead of each installing its own.
      this.startRefresh();
      this.domElement.addEventListener(EVENT.INPUT, this.mutateOnInput);
      this.domElement.addEventListener(EVENT.REARRANGE_ARRAY, this.rearrangeArray);
      this.domElement.addEventListener(EVENT.RESIZE_ARRAY, this.restructureArray);

      // this.domElement.addEventListener(EVENT.SET_VALUE, this.setValue);
    }

    /**
     * Recursive method taking an existing mutator as a template 
     * and updating its values with those found in the given UI-domElement. 
     */
    public static updateMutator(_domElement: HTMLElement, _mutator: ƒ.Mutator): ƒ.Mutator {
      for (let key in _mutator) {
        let element: HTMLInputElement = <HTMLInputElement>Controller.findChildElementByKey(_domElement, key);
        if (element == null)
          continue;

        if (element instanceof CustomElement)
          _mutator[key] = element.getMutatorValue();
        else if (_mutator[key] instanceof Object)
          _mutator[key] = Controller.updateMutator(element, _mutator[key]);
        else
          _mutator[key] = element.value;
      }

      return _mutator;
    }

    /**
     * Recursive method taking the a mutable as a template to create a mutator or update the given mutator.
     * with the values in the given UI-domElement
     */
    public static getMutator(_mutable: object, _domElement: HTMLElement, _mutator?: ƒ.Mutator, _types?: ƒ.Mutator): ƒ.Mutator {
      let mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);

      for (let key in mutator) {
        let element: HTMLElement = Controller.findChildElementByKey(_domElement, key);
        if (element == null)
          continue;

        if (element instanceof CustomElement)
          mutator[key] = element.getMutatorValue();
        else {
          const mutant: unknown = Reflect.get(_mutable, key);
          if (ƒ.isMutable(mutant))
            mutator[key] = this.getMutator(mutant, element, mutator[key]);
        }
      }

      return mutator;
    }

    /**
     * Recursive method taking the mutator of a mutable and updating the UI-domElement accordingly.
     * If an additional mutator is passed, its values are used instead of those of the mutable.
     */
    public static updateUserInterface(_mutable: object, _domElement: HTMLElement, _mutator?: ƒ.Mutator): void {
      let mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);

      for (let key in mutator) {
        let element: CustomElement = <CustomElement>Controller.findChildElementByKey(_domElement, key);
        if (!element)
          continue;

        let value: ƒ.General = mutator[key];

        if (element instanceof CustomElement && element != document.activeElement)
          element.setMutatorValue(value);
        else {
          const mutant: unknown = Reflect.get(_mutable, key);
          if (ƒ.isMutable(mutant))
            this.updateUserInterface(mutant, element, mutator[key]);
        }
      }
    }

    /**
     * Performs a breadth-first search on the given _domElement for an element with the given key.
     */
    public static findChildElementByKey(_domElement: HTMLElement, _key: string): HTMLElement {
      let elements: NodeListOf<HTMLElement> = _domElement.querySelectorAll(`[key="${_key}"]`);
      if (elements.length < 2)
        return elements[0];

      let shortestPath: number = Infinity;
      let closestElement: HTMLElement = null;
      for (let element of elements) {
        let count: number = 0;
        for (let parentElement: HTMLElement = element.parentElement; parentElement != _domElement; parentElement = parentElement.parentElement)
          count++;
        if (count < shortestPath) {
          closestElement = element;
          shortestPath = count;
        }
      }

      return closestElement;
    }

    public getMutator(_mutator?: ƒ.Mutator, _types?: ƒ.Mutator): ƒ.Mutator {
      return Controller.getMutator(this.mutable, this.domElement, _mutator, _types);
    }

    public updateUserInterface(): void {
      Controller.updateUserInterface(this.mutable, this.domElement);
    }

    public getMutable(): object {
      return this.mutable;
    }

    public setMutable(_mutable: object): void {
      this.mutable = _mutable;
    }

    public startRefresh(): void {
      window.clearInterval(this.idInterval);
      this.idInterval = window.setInterval(this.refresh, this.timeUpdate);
    }

    protected mutateOnInput = async (_event: Event): Promise<void> => {
      let path: string[] = this.getMutatorPath(_event);

      // get current mutator and save for undo
      let mutator: ƒ.Mutator = ƒ.Mutable.getMutator(this.mutable);
      // ƒ.Debug.info(mutator);
      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 0, mutable: this.mutable, mutator: ƒ.Mutable.cloneMutatorFromPath(mutator, path) } }));

      // get current mutator from interface for mutation   
      mutator = this.getMutator();
      await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.cloneMutatorFromPath(mutator, path));
      _event.stopPropagation();

      this.domElement.dispatchEvent(new Event(EVENT.MUTATE, { bubbles: true }));
    };

    protected rearrangeArray = async (_event: Event): Promise<void> => {
      let sequence: number[] = (<CustomEvent>_event).detail.sequence;
      let path: string[] = this.getMutatorPath(_event);
      let target: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> = this.getTarget(path);

      // rearrange that mutable
      (<ƒ.MutableArray<ƒ.Mutable>><unknown>target).rearrange(sequence);
      await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.getMutator(this.mutable)); // TODO: rearrangement is not a mutation so dispatching this mutate is irritating...
    };

    protected restructureArray = async (_event: Event): Promise<void> => {
      const length: number = (<CustomEvent>_event).detail.length;
      const path: string[] = this.getMutatorPath(_event);

      const current: unknown[] = this.getTarget(path);

      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 4, mutable: this.mutable, mutator: <ƒ.AtomicMutator>{ path: path, value: current.concat() } } }));

      const incoming: unknown[] = current.concat();
      incoming.length = length;
      for (let i: number = current.length; i < length; i++)
        incoming[i] = null;

      current.splice(0, current.length, ...incoming);

      const target: EventTarget = _event.target;
      if (!(target instanceof DetailsArray))
        return;

      const mutable: ƒ.IMutable = this.getTarget(path.toSpliced(path.length - 1));
      const key: string = path[path.length - 1];
      const mutator: ƒ.Mutator = ƒ.Mutable.getMutator(mutable);
      const mutatorTypes: ƒ.MutatorTypes = ƒ.Mutable.getTypes(mutable, mutator);
      const mutatorOptions: ƒ.MutatorOptions = ƒ.Metadata.options(mutable);
      target.setContent(Generator.createInterfaceFromMutable(current, mutator[key], mutatorTypes[key], mutatorOptions[key]));

      await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.getMutator(this.mutable));
    };

    protected refresh = (_event: Event): void => {
      if (document.body.contains(this.domElement)) {
        this.updateUserInterface();
        return;
      }

      window.clearInterval(this.idInterval);
    };

    private getMutatorPath(_event: Event): string[] {
      const path: string[] = [];
      for (const target of _event.composedPath()) {
        if (target == this.domElement)
          break;

        const key: string = (<HTMLElement>target).getAttribute("key");
        if (key)
          path.push(key);
      }

      return path.reverse();
    }

    private getTarget<T = unknown>(_path: string[]): T {
      let target: object = this.mutable;

      for (let key of _path)
        target = Reflect.get(target, key);

      return <T>target;
    }
  }
}