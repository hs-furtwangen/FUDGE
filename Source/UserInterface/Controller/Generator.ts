namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Static class generating UI-domElements from the information found in mutables and mutators
   */
  export class Generator {
    /**
     * Creates a [[Controller]] from a [[FudgeCore.Mutable]] with expandable details or a list
     */
    public static createController(_mutable: object, _name?: string): Controller {
      let controller: Controller = new Controller(_mutable, Generator.createDetailsFromMutable(_mutable, _name));
      controller.updateUserInterface();
      return controller;
    }

    /**
     * Create extendable details for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createDetailsFromMutable(_mutable: object, _name?: string, _mutator?: ƒ.Mutator, _type?: Function | Record<string, unknown>, _optionsGetter?: ƒ.MutatorOptionsGetter): Details | DetailsArray {
      let name: string = _name || _mutable.constructor.name;

      let details: Details | DetailsArray;
      if (Array.isArray(_mutable))
        details = new DetailsArray(name, _mutable.length);
      else if (ƒ.isMutable(_mutable))
        details = new Details(name, _mutable.type);
      else return null;

      details.setContent(Generator.createInterfaceFromMutable(_mutable, _mutator, _type, _optionsGetter));
      return details;
    }

    /**
     * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createInterfaceFromMutable(_mutable: object, _mutator?: ƒ.Mutator, _containerType?: Function | Record<string, unknown>, _containerOptionsGetter?: ƒ.MutatorOptionsGetter): HTMLDivElement {
      let mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable)
      let mutatorTypes: ƒ.MutatorTypes = ƒ.Mutable.getTypes(_mutable, mutator);
      let mutatorOptions: ƒ.MutatorOptions = ƒ.Metadata.options(_mutable);
      let div: HTMLDivElement = document.createElement("div");

      for (let key in mutator) {
        let type: Function | Record<string, unknown> = mutatorTypes[key] ?? _containerType;
        let optionsGetter: ƒ.MutatorOptionsGetter = mutatorOptions[key] ?? _containerOptionsGetter;
        let mutant: unknown = Reflect.get(_mutable, key);
        if (mutant == undefined && optionsGetter == undefined) { // try initialize value
          try {
            const value: unknown = new (<ƒ.General>type)();
            Reflect.set(_mutable, key, value);
          } catch {
            console.warn("No initial value set for", _mutable.constructor.name, key);
          }

        }

        let value: unknown = mutator[key];
        let isArray: boolean = Array.isArray(mutant);
        let element: HTMLElement;

        if (!isArray)
          element = Generator.createMutatorElement(key, type, value);

        if (!element && optionsGetter)
          element = new CustomElementComboSelect({ key: key, label: key, type: (<Function>type).name }, _mutable, optionsGetter);

        if (!element)
          element = Generator.createDetailsFromMutable(<object>mutant, key, <ƒ.Mutator>value, type, optionsGetter);

        if (!element) { // undefined values without a type can't be displayed
          console.warn("No interface created for", _mutable.constructor.name, key);
          continue;
        }

        div.appendChild(element);
      }
      return div;
    }

    /**
     * Create a div-Element containing the interface for the [[FudgeCore.Mutator]] 
     * Does not support nested mutators!
     */
    public static createInterfaceFromMutator(_mutator: ƒ.Mutator): HTMLDivElement {
      let div: HTMLDivElement = document.createElement("div");
      for (let key in _mutator) {
        let value: unknown = _mutator[key];
        if (value instanceof Object) {
          let details: Details = new Details(key, "Details");
          details.setContent(Generator.createInterfaceFromMutator(value));
          div.appendChild(details);
        } else
          div.appendChild(this.createMutatorElement(key, value.constructor, value));
      }

      return div;
    }

    /**
     * Create a specific CustomElement for the given data. Returns undefined if no element is {@link CustomElement.register registered} for the given type.
     */
    public static createMutatorElement(_key: string, _type: Function | object, _value: Object): CustomElement | undefined {
      let element: CustomElement;
      let elementType: new (..._args: ConstructorParameters<typeof CustomElement>) => CustomElement;
      try {
        if (typeof _type == "function") {
          elementType = CustomElement.get(_type);
          if (elementType)
            element = new elementType({ key: _key, label: _key, value: _value?.toString() });
        } else if (typeof _type == "object") {
          elementType = CustomElement.get(Object);
          element = new elementType({ key: _key, label: _key, value: _value?.toString() }, _type);
        }
      } catch (_error) {
        ƒ.Debug.fudge(_error);
      }

      return element;
    }
  }
}