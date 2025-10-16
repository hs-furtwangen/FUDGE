namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Connects a mutable object to a DOM-Element and synchronizes that mutable with the mutator stored within.
   * Updates the mutable on interaction with the element and the element in time intervals.
   */
  export class Controller {
    public static readonly signatures: WeakMap<HTMLElement, string> = new WeakMap();

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
      this.domElement.addEventListener(EVENT.RESTRUCTURE_ARRAY, this.resizeArray);
      this.domElement.addEventListener(EVENT.REFRESH_OPTIONS, this.refreshOptions);
      this.domElement.addEventListener(EVENT.SET_VALUE, this.setValue);
      this.domElement.addEventListener(EVENT.INITIALIZE_VALUE, this.initializeValue);

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
          if (ƒ.isMutable(mutant) || Array.isArray(mutant))
            mutator[key] = this.getMutator(mutant, element, mutator[key]);
        }
      }

      return mutator;
    }

    /**
     * Recursive method taking the mutator of a mutable and updating the UI-domElement accordingly.
     * If an additional mutator is passed, its values are used instead of those of the mutable.
     */
    public static updateUserInterface(_mutable: object, _domElement: HTMLElement, _mutator?: ƒ.Mutator, _parentMutable?: object, _parentKey?: string): void {
      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);

      if ((_domElement instanceof Details))
        Controller.updateUserInterfaceStructure(_mutable, _domElement, mutator, _parentMutable, _parentKey);

      for (const key in mutator) {
        const element: CustomElement = <CustomElement>Controller.findChildElementByKey(_domElement, key);
        if (!element)
          continue;

        const mutant: unknown = Reflect.get(_mutable, key);
        const value: ƒ.General = mutator[key];

        if (element instanceof CustomElement && element != document.activeElement)
          element.setMutatorValue(value);
        else {
          if (ƒ.isMutable(mutant) || Array.isArray(mutant))
            this.updateUserInterface(mutant, element, mutator[key], _mutable, key);
        }
      }
    }

    /**
     * Ensures that a {@link Details} element matches the structure of the given {@link FudgeCore.Mutator}.
     * Performs a shallow **structural integrity check** by comparing the element’s cached {@link Controller.createSignature signature} with the mutator’s signature.
     * If they differ, the element’s content is rebuilt to reflect the new structure.
     * @param _mutable - The original mutable object represented in the UI.
     * @param _details - The {@link Details} element displaying the data.
     * @param _mutator - The mutator object describing the current structure and values.
     * @param _parentMutable - *(Optional)* The parent mutable object if nested.
     * @param _parentKey - *(Optional)* The key referencing this mutable within its parent.
     */
    public static updateUserInterfaceStructure(_mutable: object, _details: Details, _mutator: ƒ.Mutator, _parentMutable?: object, _parentKey?: string): void {
      const mutatorSignature: string = Controller.createSignature(_mutator);
      const elementSignature: string = Controller.signatures.get(_details);

      if (elementSignature == undefined) {
        Controller.signatures.set(_details, mutatorSignature);
      } else if (mutatorSignature !== elementSignature) {
        let content: HTMLDivElement;

        if (Array.isArray(_mutable))
          content = Generator.createInterfaceFromArray(_mutable, _mutator, _parentMutable, _parentKey);
        else
          content = Generator.createInterfaceFromMutable(_mutable, _mutator);

        _details.setContent(content);
        Controller.signatures.set(_details, mutatorSignature);
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

    public static initializeValue(_mutable: object, _key: string | number, _type: Function | Record<string, unknown>): void {
      const type: Function | Record<string, unknown> = _type ?? ƒ.Metadata.types(_mutable)[_key];
      let value: unknown;

      if (type == Number)
        value = 0;
      else if (type == String)
        value = "";
      else if (type == Boolean)
        value = true;
      else if (typeof type == "object")
        value = type[Object.getOwnPropertyNames(type).find(_name => !/^\d+$/.test(_name))]; // for enum get the first non numeric key
      else if (typeof type == "function")
        value = Reflect.construct(type, []);

      Reflect.set(_mutable, _key, value);
    }

    /**
     * Creates a shallow **structural signature** string for the given object.
     * The signature encodes each {@link Object.getOwnPropertyNames own property name} and its corresponding `typeof value`.
     * Unlike the normal `typeof` behavior, when a property value is `null`, the signature will contain `undefined` instead of `object`.
     * 
     * @example
     * ```ts
     * Controller.createSignature({ x: 1, y: 2 });
     * // → "x:number|y:number"
     * 
     * Controller.createSignature({ color: { r: 1 } });
     * // → "color:object"
     * 
     * Controller.createSignature({ ref: null });
     * // → "ref:undefined"
     * ```    
     */
    public static createSignature(_object: Record<string, unknown>): string {
      const keys: string[] = Object.getOwnPropertyNames(_object);
      const signature: string[] = new Array(keys.length);

      for (let i: number = 0; i < keys.length; i++) {
        const key: string = keys[i];
        const value: unknown = _object[key];
        const type: string = value == null ? "undefined" : typeof value;

        signature[i] = `${key}:${type}`;
      }

      return signature.join("|");
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

    protected resizeArray = async (_event: Event): Promise<void> => {
      const target: EventTarget = _event.target;
      if (!(target instanceof DetailsArray))
        return;

      const length: number = (<CustomEvent>_event).detail.length;
      const path: string[] = this.getMutatorPath(_event);
      const current: unknown[] = this.getTarget(path);

      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 4, mutable: this.mutable, mutator: <ƒ.AtomicMutator>{ path: path, value: current.concat() } } }));

      const incoming: unknown[] = current.concat();
      incoming.length = length;
      for (let i: number = current.length; i < length; i++)
        incoming[i] = null;

      current.splice(0, current.length, ...incoming);

      await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.getMutator(this.mutable));
    };

    protected setValue = (_event: Event): void => {
      const path: string[] = this.getMutatorPath(_event);
      const mutable: object = this.getTarget(path.toSpliced(path.length - 1));
      const key: string = path[path.length - 1];

      const current: unknown = Reflect.get(mutable, key);

      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 3, mutable: this.mutable, mutator: <ƒ.AtomicMutator>{ path: path, value: current } } }));

      const incoming: unknown = (<CustomEvent>_event).detail.value;
      Reflect.set(mutable, key, incoming);
    };

    protected initializeValue = (_event: Event): void => {
      const path: string[] = this.getMutatorPath(_event);
      const mutable: object = this.getTarget(path.toSpliced(path.length - 1));
      const key: string = path[path.length - 1];

      let parent: object;
      let parentKey: string;
      if (!ƒ.isMutable(mutable)) { // must be a collection type, adjust to parent mutable
        parent = this.getTarget(path.toSpliced(path.length - 2));
        parentKey = path[path.length - 2];
      }

      const current: unknown = Reflect.get(mutable, key);

      this.domElement.dispatchEvent(new CustomEvent(EVENT.SAVE_HISTORY, { bubbles: true, detail: { history: 3, mutable: this.mutable, mutator: <ƒ.AtomicMutator>{ path: path, value: current } } }));

      const mutatorTypes: ƒ.MutatorTypes = ƒ.Mutable.getTypes(parent ?? mutable, ƒ.Mutable.getMutator(parent ?? mutable));
      const mutatorCollectionTypes: ƒ.MutatorCollectionTypes = ƒ.Metadata.collectionTypes(mutable);
      const type: Function | Record<string, unknown> =mutatorCollectionTypes[key] ?? mutatorTypes[parentKey ?? key];

      Controller.initializeValue(mutable, key, type);
    };

    protected refreshOptions = (_event: Event): void => {
      const target: EventTarget = _event.target;
      if (!(target instanceof CustomElementComboSelect))
        return;

      const path: string[] = this.getMutatorPath(_event);
      let mutable: unknown = this.getTarget(path.toSpliced(path.length - 1));
      let key: string = path[path.length - 1];
      if (!ƒ.isMutable(mutable)) { // must be a collection type, adjust to parent mutable
        mutable = this.getTarget(path.toSpliced(path.length - 2));
        key = path[path.length - 2];
      }

      const mutatorOptions: ƒ.MutatorOptions = ƒ.Metadata.options(mutable);

      const options: Record<string, unknown> = mutatorOptions[key].call(mutable, key);
      target.options = options;
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