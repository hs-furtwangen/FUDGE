namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Static class generating UI-domElements from the information found in [[ƒ.Mutable]]s and [[ƒ.Mutator]]s
   */
  export class Generator {
    /**
     * Creates a [[Controller]] from a [[FudgeCore.Mutable]] with expandable details or a list
     */
    public static createController(_mutable: ƒ.Mutable, _name?: string): Controller {
      let controller: Controller = new Controller(_mutable, Generator.createDetailsFromMutable(_mutable, _name));
      controller.updateUserInterface();
      return controller;
    }

    /**
     * Create extendable details for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createDetailsFromMutable(_mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>, _name?: string, _mutator?: ƒ.Mutator): Details | DetailsArray {
      let name: string = _name || _mutable.constructor.name;

      let details: Details | DetailsArray;
      if (_mutable instanceof ƒ.MutableArray)
        details = new DetailsArray(name);
      else if (_mutable instanceof ƒ.Mutable)
        details = new Details(name, _mutable.type);
      else return null;

      details.setContent(Generator.createInterfaceFromMutable(_mutable, _mutator));
      return details;
    }

    /**
     * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createInterfaceFromMutable(_mutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable>, _mutator?: ƒ.Mutator): HTMLDivElement {
      let mutator: ƒ.Mutator = _mutator || _mutable.getMutatorForUserInterface();
      let mutatorTypes: ƒ.MutatorAttributeTypes = _mutable.getMutatorAttributeTypes(mutator);
      let mutatorReferences: ƒ.MutatorReferences = ƒ.getMutatorReferences(_mutable);
      let div: HTMLDivElement = document.createElement("div");

      for (let key in mutatorTypes) {
        let type: Object | string = mutatorTypes[key];
        let value: Object = mutator[key];
        let element: HTMLElement = Generator.createMutatorElement(key, type, value);

        if (!element && mutatorReferences[key]) // the new way
          element = new CustomElementReference({ key: key, label: key, type: type.toString() }, _mutable, mutatorReferences[key]);

        if (!element) {
          let subMutable: ƒ.Mutable | ƒ.MutableArray<ƒ.Mutable> = Reflect.get(_mutable, key);
          element = Generator.createDetailsFromMutable(subMutable, key, <ƒ.Mutator>value);
        }

        if (!element && type) // the old way... remove
          element = new CustomElementOutput({ key: key, label: key, type: type.toString(), value: value?.toString(), placeholder: `Drop your ${type} here...` });

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
        let value: Object = _mutator[key];
        if (value instanceof Object) {
          let details: Details = new Details(key, "Details");
          details.setContent(Generator.createInterfaceFromMutator(value));
          div.appendChild(details);
        } else
          div.appendChild(this.createMutatorElement(key, (<Object>value).constructor.name, value));
      }

      return div;
    }

    /**
     * Create a specific CustomElement for the given data. Returns undefined if no element is {@link CustomElement.register registered} for the given type.
     */
    public static createMutatorElement(_key: string, _type: Object | string, _value: Object): CustomElement | undefined {
      let element: CustomElement;
      let elementType: new (..._args: ConstructorParameters<typeof CustomElement>) => CustomElement;
      try {
        if (_type instanceof Object) {
          elementType = CustomElement.get("Object");
          element = new elementType({ key: _key, label: _key, value: _value?.toString() }, _type);
        } else {
          elementType = CustomElement.get(_type);
          if (elementType)
            element = new elementType({ key: _key, label: _key, value: _value?.toString() });
        }
      } catch (_error) {
        ƒ.Debug.fudge(_error);
      }

      return element;
    }
  }
}