namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Connects a [[Mutable]] to a DOM-Element and synchronizes that mutable with the mutator stored within.
   * Updates the mutable on interaction with the element and the element in time intervals.
   */
  export class Controller {
    // TODO: examine the use of the attribute key vs name. Key signals the use by FUDGE while name is standard and supported by forms
    public domElement: HTMLElement;
    protected timeUpdate: number = 190;
    protected mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>;

    private idInterval: number;

    public constructor(_mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>, _domElement: HTMLElement) {
      this.domElement = _domElement;
      this.setMutable(_mutable);
      // TODO: examine, if this should register to one common interval, instead of each installing its own.
      this.startRefresh();
      this.domElement.addEventListener(EVENT.INPUT, this.mutateOnInput);
      this.domElement.addEventListener(EVENT.REARRANGE_ARRAY, this.rearrangeArray);
      // this.domElement.addEventListener(EVENT.SET_VALUE, this.setValue);
    }

    /**
     * Recursive method taking an existing [[ƒ.Mutator]] as a template 
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
     * Recursive method taking the a [[ƒ.Mutable]] as a template to create a [[ƒ.Mutator]] or update the given [[ƒ.Mutator]] 
     * with the values in the given UI-domElement
     */
    public static getMutator(_mutable: ƒ.Mutable | ƒ.MutableArray, _domElement: HTMLElement, _mutator?: ƒ.Mutator, _types?: ƒ.Mutator): ƒ.Mutator {
      let mutator: ƒ.Mutator = _mutator || _mutable.getMutator(true);

      for (let key in mutator) {
        let element: HTMLElement = Controller.findChildElementByKey(_domElement, key);
        if (element == null)
          continue;

        if (element instanceof CustomElement)
          mutator[key] = element.getMutatorValue();
        else {
          const subMutable: ƒ.Mutable = Reflect.get(_mutable, key);
          if (subMutable instanceof ƒ.MutableArray || subMutable instanceof ƒ.Mutable)
            mutator[key] = this.getMutator(subMutable, element, mutator[key]);
        }
      }

      return mutator;
    }

    /**
     * Recursive method taking the [[ƒ.Mutator]] of a [[ƒ.Mutable]] and updating the UI-domElement accordingly.
     * If an additional [[ƒ.Mutator]] is passed, its values are used instead of those of the [[ƒ.Mutable]].
     */
    public static updateUserInterface(_mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>, _domElement: HTMLElement, _mutator?: ƒ.Mutator): void {
      let mutator: ƒ.Mutator = _mutator || _mutable.getMutator(true);

      for (let key in mutator) {
        let element: CustomElement = <CustomElement>Controller.findChildElementByKey(_domElement, key);
        if (!element)
          continue;

        let value: ƒ.General = mutator[key];

        if (element instanceof CustomElement && element != document.activeElement)
          element.setMutatorValue(value);
        else {
          const subMutable: ƒ.Mutable = Reflect.get(_mutable, key);
          if (subMutable instanceof ƒ.MutableArray || subMutable instanceof ƒ.Mutable)
            this.updateUserInterface(subMutable, element, mutator[key]);
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

    public getMutable(): ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> {
      return this.mutable;
    }

    public setMutable(_mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>): void {
      this.mutable = _mutable;
    }

    public startRefresh(): void {
      window.clearInterval(this.idInterval);
      this.idInterval = window.setInterval(this.refresh, this.timeUpdate);
    }

    protected mutateOnInput = async (_event: Event): Promise<void> => {
      let path: string[] = this.getMutatorPath(_event);
      // get current mutator and save for undo
      let mutator: ƒ.Mutator = this.mutable.getMutator(true);
      // ƒ.Debug.info(mutator);
      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 0, mutable: this.mutable, mutator: ƒ.Mutator.fromPath(mutator, path) } }));

      // get current mutator from interface for mutation   
      mutator = this.getMutator();
      await this.mutable.mutate(ƒ.Mutator.fromPath(mutator, path));
      _event.stopPropagation();

      this.domElement.dispatchEvent(new Event(EVENT.MUTATE, { bubbles: true }));
    };

    protected rearrangeArray = async (_event: Event): Promise<void> => {
      let sequence: number[] = (<CustomEvent>_event).detail.sequence;
      let path: string[] = this.getMutatorPath(_event);
      let target: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> = this.getTarget(path);

      // rearrange that mutable
      (<ƒ.MutableArray<ƒ.Mutable>><unknown>target).rearrange(sequence);
      await this.mutable.mutate(this.mutable.getMutator()); // TODO: rearrangement is not a mutation so dispatching this mutate is irritating...
    };

    protected refresh = (_event: Event): void => {
      if (document.body.contains(this.domElement)) {
        this.updateUserInterface();
        return;
      }

      window.clearInterval(this.idInterval);
    };

    // protected setValue = (_event: Event): void => {
    //   const path: string[] = this.getMutatorPath(_event);
    //   const key: string = path[path.length - 1];
    //   const target: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> = this.getTarget(path.toSpliced(path.length - 1));
    //   const input: string = (<CustomEvent>_event).detail.input;

    //   const mutatorOptions: ƒ.MutatorOptions = ƒ.Mutator.options(target);
    //   const getOptions: (this: object, _key: string) => Record<string, unknown> = mutatorOptions[key];

    //   if (!getOptions)
    //     return;

    //   const options: Record<string, unknown> = getOptions.call(target, key);

    //   const incoming: unknown = options[input];
    //   const current: unknown = Reflect.get(target, key);

    //   if (incoming == current)
    //     return;

    //   this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 3, mutable: target, mutator: { [key]: current } } }));

    //   Reflect.set(target, key, incoming);
    // };

    // protected hndChange = async (_event: Event): Promise<void> => {
    //   const path: string[] = this.getMutatorPath(_event);

    //   // get current state for undo
    //   const mutator: ƒ.Mutator = this.mutable.getMutator();
    //   const current: ƒ.Mutator = ƒ.Mutator.fromPath(mutator, path);

    //   // get incoming state from interface for mutation
    //   const incoming: ƒ.Mutator = Controller.getMutator(this.mutable, this.domElement, ƒ.Mutator.clone(current));

    //   // compare the actual mutation
    //   let a: ƒ.General = current;
    //   let b: ƒ.General = incoming;
    //   for (const key of path) {
    //     a = a[key];
    //     b = b[key];
    //   }

    //   if (a == b)
    //     return;

    //   this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { mutable: this.mutable, mutator: current } }));
    //   await this.mutable.mutate(incoming);
    //   _event.stopPropagation();

    //   this.domElement.dispatchEvent(new Event(EVENT.MUTATE, { bubbles: true }));
    // };

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