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
    public static createDetailsFromMutable(_mutable: object, _name?: string, _mutator?: ƒ.Mutator): Details {
      if (!ƒ.isMutable(_mutable))
        return null;

      let name: string = _name || _mutable.constructor.name;
      let details: Details = new Details(name, _mutable.type);
      details.setContent(Generator.createInterfaceFromMutable(_mutable, _mutator));
      return details;
    }


    public static createDetailsFromArray(_mutable: object, _name: string, _mutator: ƒ.Mutator, _parentMutable: object, _parentKey: string): DetailsArray {
      if (!Array.isArray(_mutable))
        return null;

      let details: DetailsArray = new DetailsArray(_name);
      details.setContent(Generator.createInterfaceFromArray(_mutable, _mutator, _parentMutable, _parentKey));
      return details;
    }

    /**
     * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createInterfaceFromMutable(_mutable: object, _mutator?: ƒ.Mutator): HTMLDivElement {
      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
      const types: ƒ.MutatorAttributeTypes = ƒ.Mutable.getTypes(_mutable, mutator);
      const descriptors: ƒ.MetaPropertyDescriptors = ƒ.Metadata.getPropertyDescriptors(_mutable);

      const div: HTMLDivElement = document.createElement("div");

      for (const key in mutator) {
        const descriptor: ƒ.MetaPropertyDescriptor = descriptors[key];
        const element: HTMLElement = Generator.createInterfaceElement(_mutable, mutator, key, types[key], descriptor.getCreateOptions, descriptor.getAssignOptions);
        if (!element)
          continue;

        div.appendChild(element);
      }

      return div;
    }

    public static createInterfaceFromArray(_mutable: object, _mutator: ƒ.Mutator, _parentMutable: object, _parentKey: string): HTMLDivElement {
      const descriptor: ƒ.MetaPropertyDescriptor = ƒ.Metadata.getPropertyDescriptor(_parentMutable, _parentKey).valueDescriptor;

      const type: Function | Record<string, unknown> = descriptor.type;
      const getCreateOptions: ƒ.PropertyCreateOptionsGetter = descriptor.getCreateOptions;
      const getAssignOptions: ƒ.PropertyAssignOptionsGetter = descriptor.getAssignOptions;

      const div: HTMLDivElement = document.createElement("div");

      for (const key in _mutator) {
        const element: HTMLElement = Generator.createInterfaceElement(_mutable, _mutator, key, type, getCreateOptions, getAssignOptions, _parentMutable, _parentKey);
        if (!element)
          continue;

        div.appendChild(element);
      }
      return div;
    }

    public static createInterfaceElement(_mutable: object, _mutator: ƒ.Mutator, _key: string, _type: Function | Record<string, unknown>, _getCreateOptions?: ƒ.PropertyCreateOptionsGetter, _getAssignOptions?: ƒ.PropertyAssignOptionsGetter, _parentMutable?: object, _parentKey?: string): HTMLElement {
      const mutant: unknown = Reflect.get(_mutable, _key);
      const value: unknown = Reflect.get(_mutator, _key);
      const type: string = typeof _type == "function" ? _type.name : "Enum";
      const isArray: boolean = Array.isArray(mutant);

      let element: HTMLElement;

      if (isArray)
        element = Generator.createDetailsFromArray(<object>mutant, _key, <ƒ.Mutator>value, _parentMutable ?? _mutable, _parentKey ?? _key);

      if (!element)
        element = Generator.createMutatorElement(_key, _type, value);

      if (!element)
        element = Generator.createDetailsFromMutable(<object>mutant, _key, <ƒ.Mutator>value);

      if (!element && mutant == null) {
        const mutable: object = _parentMutable ?? _mutable;
        const key: string = _parentKey ?? _key;
        element = new CustomElementInitializer({ key: _key, label: _key, type: type }, _getCreateOptions?.call(mutable, key), _getAssignOptions?.call(mutable, key));
      }

      if (!element && _getAssignOptions)
        element = new CustomElementComboSelect({ key: _key, label: _key, type: (<Function>_type).name, action: "assign" }, value, _getAssignOptions.call(_parentMutable ?? _mutable, _parentKey ?? _key));

      if (!element)
        element = new CustomElementOutput({ key: _key, label: _key, type: type, value: value?.toString() });

      if (!element) { // undefined values without a type can't be displayed
        console.warn("No interface created for", _mutable.constructor.name, _key);
        return null;
      }

      if (_getCreateOptions && !isArray)
        element.setAttribute("creatable", "");

      if (_getAssignOptions && !isArray)
        element.setAttribute("assignable", "");

      return element;
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
    public static createMutatorElement(_key: string, _type: Function | object, _value: unknown): CustomElement | undefined {
      let element: CustomElement;
      let elementType: new (..._args: ConstructorParameters<typeof CustomElement>) => CustomElement;
      const type: string = typeof _type == "function" ? _type.name : "Enum";

      if (_value == null)
        return null;

      try {
        if (typeof _type == "function") {
          elementType = CustomElement.get(_type);
          if (elementType)
            element = new elementType({ key: _key, label: _key, type: type, value: _value?.toString() });
        } else if (typeof _type == "object") {
          elementType = CustomElement.get(Object);
          element = new elementType({ key: _key, label: _key, type: type, value: _value?.toString() }, _type);
        }
      } catch (_error) {
        ƒ.Debug.fudge(_error);
      }

      return element;
    }
  }
}