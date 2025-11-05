namespace FudgeUserInterface {
  import ƒ = FudgeCore;

  /**
   * Static class generating UI-domElements from the information found in mutables and mutators
   */
  export class Generator {

    /**
     * Create extendable details for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createDetailsFromMutable(_mutable: object, _name?: string, _mutator?: ƒ.Mutator): Details {
      if (!ƒ.isMutable(_mutable))
        return null;

      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
      const name: string = _name || _mutable.constructor.name;
      const details: Details = new Details(name, _mutable.type);
      details.setContent(Generator.createInterfaceFromMutable(_mutable, mutator));

      Controller.signatures.set(details, Controller.createSignature(mutator));

      return details;
    }


    public static createDetailsFromArray(_mutable: object, _name: string, _mutator: ƒ.Mutator, _parentMutable: object, _parentKey: string): DetailsArray {
      if (!Array.isArray(_mutable))
        return null;

      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
      const details: DetailsArray = new DetailsArray(_name);
      details.setContent(Generator.createInterfaceFromArray(_mutable, mutator, _parentMutable, _parentKey));

      Controller.signatures.set(details, Controller.createSignature(mutator));

      return details;
    }

    /**
     * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
     */
    public static createInterfaceFromMutable(_mutable: object, _mutator?: ƒ.Mutator): HTMLDivElement {
      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
      const types: ƒ.MutatorAttributeTypes = ƒ.Mutable.getMutatorTypes(_mutable, mutator);
      const descriptors: ƒ.MetaPropertyDescriptors = ƒ.Metadata.getPropertyDescriptors(_mutable);
      const div: HTMLDivElement = document.createElement("div");

      for (const key in mutator) {
        const element: HTMLElement = Generator.createInterfaceElement(_mutable, mutator, key, types[key], descriptors[key]);
        if (!element)
          continue;

        div.appendChild(element);
      }

      return div;
    }

    public static createInterfaceFromArray(_mutable: object, _mutator: ƒ.Mutator, _parentMutable: object, _parentKey: string): HTMLDivElement {
      const mutator: ƒ.Mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
      const types: ƒ.MutatorAttributeTypes = ƒ.Mutable.getMutatorTypes(_mutable, mutator);
      const descriptor: ƒ.MetaPropertyDescriptor = ƒ.Metadata.getPropertyDescriptor(_parentMutable, _parentKey).valueDescriptor;
      const div: HTMLDivElement = document.createElement("div");

      for (const key in mutator) {
        const element: HTMLElement = Generator.createInterfaceElement(_mutable, mutator, key, types[key], descriptor, _parentMutable, _parentKey);
        if (!element)
          continue;

        div.appendChild(element);
      }
      return div;
    }

    public static createInterfaceElement(_mutable: object, _mutator: ƒ.Mutator, _key: string, _type: Function | Record<string, unknown>, _descriptor?: ƒ.MetaPropertyDescriptor, _parentMutable?: object, _parentKey?: string): HTMLElement {
      const mutant: unknown = Reflect.get(_mutable, _key);
      const value: unknown = Reflect.get(_mutator, _key);
      const type: Function | Record<string, unknown> = _descriptor?.type ?? _type;
      const typeName: string = typeof type == "function" ? type.name : "Enum";
      const isArray: boolean = Array.isArray(mutant);

      let element: HTMLElement;

      if (isArray)
        element = Generator.createDetailsFromArray(<object>mutant, _key, <ƒ.Mutator>value, _parentMutable ?? _mutable, _parentKey ?? _key);

      if (!element)
        element = Generator.createMutatorElement(_key, type, value);

      if (!element)
        element = Generator.createDetailsFromMutable(<object>mutant, _key, <ƒ.Mutator>value);

      if (!element && _descriptor.getAssignOptions && !_descriptor.getCreateOptions) {
        element = new CustomElementComboSelect({ key: _key, label: _key, type: typeName, action: "assign", placeholder: `${typeName}...` }, value, _descriptor.getAssignOptions.call(_parentMutable ?? _mutable, _parentKey ?? _key));
      }

      if (!element && mutant == null)
        element = new CustomElementInitializer({ key: _key, label: _key, type: typeName }, _descriptor);

      if (!element)
        element = new CustomElementOutput({ key: _key, label: _key, type: typeName, value: value?.toString() });

      if (!element) { // undefined values without a type can't be displayed
        console.warn("No interface created for", _mutable.constructor.name, _key);
        return null;
      }

      if (element) {
        element.classList.add("property");

        const menu: Menu = Generator.createInterfaceElementMenu(typeName, !!_descriptor.getCreateOptions, !!_descriptor.getAssignOptions, _descriptor.kind != "function", !(element instanceof CustomElementInitializer));
        if (element instanceof Details || element instanceof DetailsArray)
          element.summary.appendChild(menu);
        else
          element.prepend(menu);
      }

      return element;
    }

    public static createInterfaceElementMenu(_type: string, _createOptions: boolean, _assignOptions: boolean, _creatable: boolean, _clearable: boolean): Menu {
      const menu: Menu = new Menu("");
      menu.classList.add("property-menu");
      menu.btnToggle.classList.add("btn-subtle", "icon", "actions", "before");

      if (_createOptions) {
        const menuCreate: Menu = new Menu("New...");
        menuCreate.btnToggle.classList.add("menu-item", "icon", "construct", "before");
        menuCreate.btnToggle.title = `Create a new ${_type}`;
        menu.addItem(menuCreate);

        const selectCreate: CustomElementComboSelect = new CustomElementComboSelect({ key: "", type: _type, action: "create", placeholder: `🔍︎ Select type...` });
        selectCreate.removeAttribute("key");
        selectCreate.addEventListener(EVENT.CHANGE, _event => {
          selectCreate.setValue("");
          menu.close();
        });
        menuCreate.addItem(selectCreate);
      } else if (_creatable) {
        const btnCreate: HTMLButtonElement = document.createElement("button");
        btnCreate.classList.add("menu-item", "icon", "construct", "before");
        btnCreate.innerText = "New...";
        btnCreate.title = `Create a new ${_type}`;
        menu.addItem(btnCreate);

        btnCreate.addEventListener(EVENT.CLICK, _event => {
          menu.close();
          btnCreate.dispatchEvent(new Event(EVENT.CREATE_VALUE, { bubbles: true }));
        });
      }

      if (_assignOptions) {
        const menuAssign: Menu = new Menu("Assign...")
        menuAssign.btnToggle.classList.add("menu-item", "icon", "assign", "before");
        menuAssign.btnToggle.title = `Assign an existing ${_type}`;
        menu.addItem(menuAssign);

        const selectAssign: CustomElementComboSelect = new CustomElementComboSelect({ key: "", type: _type, action: "assign", placeholder: `🔍︎ Select ${_type}...` });
        selectAssign.removeAttribute("key");
        selectAssign.addEventListener(EVENT.CHANGE, _event => {
          menu.close();
          selectAssign.setValue("");
        });
        menuAssign.addItem(selectAssign);
      }

      if (_clearable) {
        const btnClear: HTMLButtonElement = document.createElement("button");
        btnClear.classList.add("menu-item", "icon", "clear", "before");
        btnClear.innerText = "Clear";
        btnClear.title = `Set to <undefined>`;
        menu.addItem(btnClear);

        btnClear.addEventListener(EVENT.CLICK, _event => {
          btnClear.dispatchEvent(new CustomEvent(EVENT.SET_VALUE, { bubbles: true, detail: { value: undefined } }));
          menu.close();
        });
      }

      // if (_deletable) {
      //   const btnDelete: HTMLButtonElement = document.createElement("button");
      //   btnDelete.classList.add("menu-item", "icon", "delete", "before");
      //   btnDelete.innerText = "Delete";
      //   btnDelete.title = `Remove element from its container`;
      //   menu.addItem(btnDelete);

      //   btnDelete.addEventListener(EVENT.CLICK, _event => {
      //     btnDelete.dispatchEvent(new CustomEvent(EVENT.SET_VALUE, { bubbles: true, detail: { value: undefined } }));
      //     menu.close();
      //   });
      // }

      menu.addEventListener(EVENT.CHANGE, _event => {
        menu.close();
      });

      return menu;
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