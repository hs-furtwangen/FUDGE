"use strict";
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Common clipboards for all drag-drop and copy-paste operations happening in the user interface
     * @author Jirka Dell'Oro-Friedl, HFU, 2024
     */
    class Clipboard {
        constructor() {
            this.objects = [];
        }
        static { this.dragDrop = new Clipboard(); }
        static { this.copyPaste = new Clipboard(); }
        get() {
            return this.objects;
        }
        clear() {
            this.objects = [];
        }
        set(_objects, _operation) {
            this.objects = _objects.slice();
            this.operation = _operation;
        }
    }
    FudgeUserInterface.Clipboard = Clipboard;
})(FudgeUserInterface || (FudgeUserInterface = {}));
// / <reference path="../../Distribution/FudgeCore.d.ts"/> // TODO: now that we use package references in the tsconfig, this file is obsolete
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Connects a [[Mutable]] to a DOM-Element and synchronizes that mutable with the mutator stored within.
     * Updates the mutable on interaction with the element and the element in time intervals.
     */
    class Controller {
        constructor(_mutable, _domElement) {
            this.timeUpdate = 190;
            this.mutateOnInput = async (_event) => {
                let path = this.getMutatorPath(_event);
                // get current mutator and save for undo
                let mutator = this.mutable.getMutator(true);
                // ƒ.Debug.info(mutator);
                this.domElement.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 0, mutable: this.mutable, mutator: ƒ.Mutator.fromPath(mutator, path) } }));
                // get current mutator from interface for mutation   
                mutator = this.getMutator();
                await this.mutable.mutate(ƒ.Mutator.fromPath(mutator, path));
                _event.stopPropagation();
                this.domElement.dispatchEvent(new Event("mutate" /* EVENT.MUTATE */, { bubbles: true }));
            };
            this.rearrangeArray = async (_event) => {
                let sequence = _event.detail.sequence;
                let path = this.getMutatorPath(_event);
                let target = this.getTarget(path);
                // rearrange that mutable
                target.rearrange(sequence);
                await this.mutable.mutate(this.mutable.getMutator()); // TODO: rearrangement is not a mutation so dispatching this mutate is irritating...
            };
            this.refresh = (_event) => {
                if (document.body.contains(this.domElement)) {
                    this.updateUserInterface();
                    return;
                }
                window.clearInterval(this.idInterval);
            };
            this.domElement = _domElement;
            this.setMutable(_mutable);
            // TODO: examine, if this should register to one common interval, instead of each installing its own.
            this.startRefresh();
            this.domElement.addEventListener("input" /* EVENT.INPUT */, this.mutateOnInput);
            this.domElement.addEventListener("rearrangeArray" /* EVENT.REARRANGE_ARRAY */, this.rearrangeArray);
            // this.domElement.addEventListener(EVENT.SET_VALUE, this.setValue);
        }
        /**
         * Recursive method taking an existing [[ƒ.Mutator]] as a template
         * and updating its values with those found in the given UI-domElement.
         */
        static updateMutator(_domElement, _mutator) {
            for (let key in _mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (element == null)
                    continue;
                if (element instanceof FudgeUserInterface.CustomElement)
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
        static getMutator(_mutable, _domElement, _mutator, _types) {
            let mutator = _mutator || _mutable.getMutator(true);
            for (let key in mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (element == null)
                    continue;
                if (element instanceof FudgeUserInterface.CustomElement)
                    mutator[key] = element.getMutatorValue();
                else {
                    const subMutable = Reflect.get(_mutable, key);
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
        static updateUserInterface(_mutable, _domElement, _mutator) {
            let mutator = _mutator || _mutable.getMutator(true);
            for (let key in mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (!element)
                    continue;
                let value = mutator[key];
                if (element instanceof FudgeUserInterface.CustomElement && element != document.activeElement)
                    element.setMutatorValue(value);
                else {
                    const subMutable = Reflect.get(_mutable, key);
                    if (subMutable instanceof ƒ.MutableArray || subMutable instanceof ƒ.Mutable)
                        this.updateUserInterface(subMutable, element, mutator[key]);
                }
            }
        }
        /**
         * Performs a breadth-first search on the given _domElement for an element with the given key.
         */
        static findChildElementByKey(_domElement, _key) {
            let elements = _domElement.querySelectorAll(`[key="${_key}"]`);
            if (elements.length < 2)
                return elements[0];
            let shortestPath = Infinity;
            let closestElement = null;
            for (let element of elements) {
                let count = 0;
                for (let parentElement = element.parentElement; parentElement != _domElement; parentElement = parentElement.parentElement)
                    count++;
                if (count < shortestPath) {
                    closestElement = element;
                    shortestPath = count;
                }
            }
            return closestElement;
        }
        getMutator(_mutator, _types) {
            return Controller.getMutator(this.mutable, this.domElement, _mutator, _types);
        }
        updateUserInterface() {
            Controller.updateUserInterface(this.mutable, this.domElement);
        }
        getMutable() {
            return this.mutable;
        }
        setMutable(_mutable) {
            this.mutable = _mutable;
        }
        startRefresh() {
            window.clearInterval(this.idInterval);
            this.idInterval = window.setInterval(this.refresh, this.timeUpdate);
        }
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
        getMutatorPath(_event) {
            const path = [];
            for (const target of _event.composedPath()) {
                if (target == this.domElement)
                    break;
                const key = target.getAttribute("key");
                if (key)
                    path.push(key);
            }
            return path.reverse();
        }
        getTarget(_path) {
            let target = this.mutable;
            for (let key of _path)
                target = Reflect.get(target, key);
            return target;
        }
    }
    FudgeUserInterface.Controller = Controller;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Static class generating UI-domElements from the information found in [[ƒ.Mutable]]s and [[ƒ.Mutator]]s
     */
    class Generator {
        /**
         * Creates a [[Controller]] from a [[FudgeCore.Mutable]] with expandable details or a list
         */
        static createController(_mutable, _name) {
            let controller = new FudgeUserInterface.Controller(_mutable, Generator.createDetailsFromMutable(_mutable, _name));
            controller.updateUserInterface();
            return controller;
        }
        /**
         * Create extendable details for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
         */
        static createDetailsFromMutable(_mutable, _name, _mutator) {
            let name = _name || _mutable.constructor.name;
            let details;
            if (_mutable instanceof ƒ.MutableArray)
                details = new FudgeUserInterface.DetailsArray(name);
            else if (_mutable instanceof ƒ.Mutable)
                details = new FudgeUserInterface.Details(name, _mutable.type);
            else
                return null;
            details.setContent(Generator.createInterfaceFromMutable(_mutable, _mutator));
            return details;
        }
        /**
         * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
         */
        static createInterfaceFromMutable(_mutable, _mutator) {
            let mutator = _mutator || _mutable.getMutator(true);
            let mutatorTypes = ƒ.Mutator.getTypes(_mutable, mutator);
            let mutatorOptions = ƒ.Mutator.options(_mutable);
            let div = document.createElement("div");
            for (let key in mutator) {
                let value = mutator[key];
                let type = mutatorTypes[key];
                let element = Generator.createMutatorElement(key, type, value);
                if (!element && mutatorOptions[key])
                    element = new FudgeUserInterface.CustomElementComboSelect({ key: key, label: key, type: type.name }, _mutable, mutatorOptions[key]);
                if (!element) {
                    let subMutable = Reflect.get(_mutable, key);
                    element = Generator.createDetailsFromMutable(subMutable, key, value);
                }
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
        static createInterfaceFromMutator(_mutator) {
            let div = document.createElement("div");
            for (let key in _mutator) {
                let value = _mutator[key];
                if (value instanceof Object) {
                    let details = new FudgeUserInterface.Details(key, "Details");
                    details.setContent(Generator.createInterfaceFromMutator(value));
                    div.appendChild(details);
                }
                else
                    div.appendChild(this.createMutatorElement(key, value.constructor, value));
            }
            return div;
        }
        /**
         * Create a specific CustomElement for the given data. Returns undefined if no element is {@link CustomElement.register registered} for the given type.
         */
        static createMutatorElement(_key, _type, _value) {
            let element;
            let elementType;
            try {
                if (typeof _type == "function") {
                    elementType = FudgeUserInterface.CustomElement.get(_type);
                    if (elementType)
                        element = new elementType({ key: _key, label: _key, value: _value?.toString() });
                }
                else if (typeof _type == "object") {
                    elementType = FudgeUserInterface.CustomElement.get(Object);
                    element = new elementType({ key: _key, label: _key, value: _value?.toString() }, _type);
                }
            }
            catch (_error) {
                ƒ.Debug.fudge(_error);
            }
            return element;
        }
    }
    FudgeUserInterface.Generator = Generator;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Handles the mapping of CustomElements to their HTML-Tags via customElement.define
     * and to the data types and [[FudgeCore.Mutable]]s they render an interface for.
     */
    class CustomElement extends HTMLElement {
        static { this.mapTypeToCustomElement = new Map(); }
        static { this.idCounter = 0; }
        constructor(_attributes, ..._args) {
            super();
            this.initialized = false;
            if (_attributes)
                for (let name in _attributes) {
                    if (_attributes[name] != undefined)
                        this.setAttribute(name, _attributes[name]);
                }
        }
        /**
         * Retrieve an id to use for children of this element, needed e.g. for standard interaction with the label
         */
        static get nextId() {
            return "ƒ" + CustomElement.idCounter++;
        }
        /**
         * Register map the given element type to the given tag and the given type of data
         */
        static register(_tag, _typeCustomElement, _typeObject) {
            // console.log(_tag, _class);
            _typeCustomElement.tag = _tag;
            // @ts-ignore
            customElements.define(_tag, _typeCustomElement);
            if (_typeObject)
                CustomElement.map(_typeObject, _typeCustomElement);
        }
        /**
         * Retrieve the element representing the given data type (if registered)
         */
        static get(_type) {
            let element = CustomElement.mapTypeToCustomElement.get(_type);
            return element;
        }
        static map(_type, _typeCustomElement) {
            ƒ.Debug.fudge("Map", _type, _typeCustomElement.name);
            CustomElement.mapTypeToCustomElement.set(_type, _typeCustomElement);
        }
        /**
         * Return the key (name) of the attribute this element represents
         */
        get key() {
            return this.getAttribute("key");
        }
        /**
         * Add a label-element as child to this element
         */
        appendLabel() {
            let text = this.getAttribute("label");
            if (!text)
                return null;
            let label = document.createElement("label");
            label.textContent = text;
            this.appendChild(label);
            return label;
        }
        setLabel(_label) {
            let label = this.querySelector("label");
            if (label)
                label.textContent = _label;
        }
        /**
         * Set the value of this element using a format compatible with [[FudgeCore.Mutator]]
         */
        setMutatorValue(_value) {
            Reflect.set(this, "value", _value);
        }
        /** Workaround reconnection of clone */
        cloneNode(_deep) {
            let label = this.getAttribute("label");
            //@ts-ignore
            let clone = new this.constructor(label ? { label: label } : null);
            document.body.appendChild(clone);
            clone.setMutatorValue(this.getMutatorValue());
            for (let attribute of this.attributes)
                clone.setAttribute(attribute.name, attribute.value);
            return clone;
        }
    }
    FudgeUserInterface.CustomElement = CustomElement;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * A standard checkbox with a label to it
     */
    class CustomElementBoolean extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-boolean", CustomElementBoolean, Boolean); }
        constructor(_attributes) {
            super(_attributes);
            if (!_attributes.label)
                this.setAttribute("label", _attributes.key);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            // TODO: delete tabindex from checkbox and get space-key on this
            // this.tabIndex = 0;
            let input = document.createElement("input");
            input.type = "checkbox";
            input.id = FudgeUserInterface.CustomElement.nextId;
            input.checked = this.getAttribute("value") == "true";
            this.appendChild(input);
            this.appendLabel().htmlFor = input.id;
        }
        /**
         * Retrieves the status of the checkbox as boolean value
         */
        getMutatorValue() {
            return this.querySelector("input").checked;
        }
        /**
         * Sets the status of the checkbox
         */
        setMutatorValue(_value) {
            this.querySelector("input").checked = _value;
        }
    }
    FudgeUserInterface.CustomElementBoolean = CustomElementBoolean;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * A color picker with a label to it and a slider for opacity
     */
    class CustomElementColor extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-color", CustomElementColor, ƒ.Color); }
        constructor(_attributes) {
            super(_attributes);
            this.color = new ƒ.Color();
            if (!_attributes.label)
                this.setAttribute("label", _attributes.key);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            let picker = document.createElement("input");
            picker.type = "color";
            picker.tabIndex = 0;
            this.appendChild(picker);
            let slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "1";
            slider.step = "0.01";
            this.appendChild(slider);
            slider.addEventListener("wheel" /* EVENT.WHEEL */, this.hndWheel);
        }
        /**
         * Retrieves the values of picker and slider as ƒ.Mutator
         */
        getMutatorValue() {
            let hex = this.querySelector("input[type=color").value;
            let alpha = this.querySelector("input[type=range").value;
            this.color.setHex(hex.substr(1, 6) + "ff");
            this.color.a = parseFloat(alpha);
            return this.color.getMutator(true);
        }
        /**
         * Sets the values of color picker and slider
         */
        setMutatorValue(_value) {
            this.color.mutate(_value);
            let hex = this.color.toHex();
            this.querySelector("input[type=color").value = "#" + hex.slice(0, 6);
            this.querySelector("input[type=range").value = this.color.a.toString();
        }
        hndKey(_event) {
            _event.stopPropagation();
        }
        hndWheel(_event) {
            let slider = _event.target;
            if (slider != document.activeElement)
                return;
            _event.stopPropagation();
            _event.preventDefault();
            // console.log(_event.deltaY / 1000);
            let currentValue = Number(slider.value);
            slider.value = String(currentValue - _event.deltaY / 1000);
            slider.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
        }
    }
    FudgeUserInterface.CustomElementColor = CustomElementColor;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    class CustomElementComboSelect extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-comboselect", CustomElementComboSelect); }
        // this breaches the separation of concerns of view and controller, but it is very handy if the custom element reference can get its options by itself.
        #mutable;
        #getOptions;
        constructor(_attributes, _mutable, _get) {
            super(_attributes);
            this.hndClick = (_event) => {
                const input = this.querySelector("input");
                input.value = "";
                const button = this.querySelector("button");
                button.hidden = true;
                this.dispatchEvent(new Event("change" /* EVENT.CHANGE */, { bubbles: true }));
            };
            this.hndFocus = (_event) => {
                const datalist = this.querySelector("datalist");
                datalist.innerHTML = ""; // clear previous entries
                const options = this.getOptions();
                for (const key in options) {
                    const entry = document.createElement("option");
                    entry.value = key;
                    datalist.appendChild(entry);
                }
            };
            this.hndInput = (_event) => {
                const button = this.querySelector("button");
                button.hidden = !_event.target.value;
                _event.stopPropagation(); // prevent bubbling of input event to controller TODO: only stop propagation if input originates from button or the combo select input
            };
            this.hndChange = async (_event) => {
                const input = this.querySelector("input");
                const options = this.getOptions();
                const key = this.getAttribute("key");
                const incoming = options[input.value];
                const current = Reflect.get(this.#mutable, key);
                if (incoming == current)
                    return;
                this.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 3, mutable: this.#mutable, mutator: { [key]: current } } }));
                Reflect.set(this.#mutable, key, incoming);
            };
            this.#mutable = _mutable;
            this.#getOptions = _get;
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            let datalist = document.createElement("datalist");
            datalist.id = FudgeUserInterface.CustomElement.nextId.toString();
            this.appendChild(datalist);
            let input = document.createElement("input");
            input.setAttribute("list", datalist.id);
            input.placeholder = `${this.getAttribute("type")}...`;
            input.spellcheck = false;
            input.onfocus = this.hndFocus;
            input.oninput = this.hndInput;
            input.onkeyup = this.hndKey;
            this.appendChild(input);
            let button = document.createElement("button");
            button.onclick = this.hndClick;
            button.hidden = true;
            this.appendChild(button);
            this.onchange = this.hndChange;
            this.setMutatorValue(Reflect.get(this.#mutable, this.getAttribute("key")));
        }
        getMutatorValue() {
            const input = this.querySelector("input");
            const options = this.getOptions();
            return options[input.value];
        }
        setMutatorValue(_value) {
            const input = this.querySelector("input");
            if (input == document.activeElement)
                return;
            const value = _value ? _value.name ?? _value.toString() : "";
            const button = this.querySelector("button");
            button.hidden = !value;
            input.value = value;
        }
        hndKey(_event) {
            _event.stopPropagation();
        }
        ;
        getOptions() {
            return this.#getOptions.call(this.#mutable, this.getAttribute("key"));
        }
    }
    FudgeUserInterface.CustomElementComboSelect = CustomElementComboSelect;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Represents a single digit number to be used in groups to represent a multidigit value.
     * Is tabbable and in-/decreases previous sibling when flowing over/under.
     */
    class CustomElementDigit extends HTMLElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-digit", CustomElementDigit); }
        constructor() {
            super();
            this.initialized = false;
        }
        set value(_value) {
            _value = Math.trunc(_value);
            if (_value > 9 || _value < 0)
                return;
            this.textContent = _value.toString();
        }
        get value() {
            return parseInt(this.textContent);
        }
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.value = 0;
            this.tabIndex = -1;
        }
        add(_addend) {
            _addend = Math.trunc(_addend);
            if (_addend == 0)
                return;
            if (_addend > 0) {
                if (this.value < 9)
                    this.value++;
                else {
                    let prev = this.previousElementSibling;
                    if (!(prev && prev instanceof CustomElementDigit))
                        return;
                    prev.add(1);
                    this.value = 0;
                }
            }
            else {
                if (this.value > 0)
                    this.value--;
                else {
                    let prev = this.previousElementSibling;
                    if (!(prev && prev instanceof CustomElementDigit))
                        return;
                    prev.add(-1);
                    this.value = 9;
                }
            }
        }
    }
    FudgeUserInterface.CustomElementDigit = CustomElementDigit;
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="CustomElement.ts"/>
var FudgeUserInterface;
///<reference path="CustomElement.ts"/>
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Creates a CustomElement from an HTML-Template-Tag
     */
    class CustomElementTemplate extends FudgeUserInterface.CustomElement {
        static { this.fragment = new Map(); }
        constructor(_attributes) {
            super(_attributes);
        }
        /**
         * Browses through the templates in the current document and registers the one defining the given tagname.
         * To be called from a script tag implemented with the template in HTML.
         */
        static register(_tagName) {
            for (let template of document.querySelectorAll("template")) {
                if (template.content.firstElementChild.localName == _tagName) {
                    ƒ.Debug.fudge("Register", template.content.children[0]);
                    CustomElementTemplate.fragment.set(_tagName, template.content);
                }
            }
        }
        /**
         * Get the value of this element in a format compatible with [[FudgeCore.Mutator]]
         */
        getMutatorValue() {
            let mutator = {};
            let elements = this.querySelectorAll("[key");
            for (let element of elements) {
                let key = element.getAttribute("key");
                if (element instanceof FudgeUserInterface.CustomElement)
                    mutator[key] = element.getMutatorValue();
                else
                    mutator[key] = element.value;
            }
            return mutator;
        }
        setMutatorValue(_mutator) {
            for (let key in _mutator) {
                let element = this.querySelector(`[key="${key}"]`);
                if (!element)
                    ƒ.Debug.log(`Couldn't find ${key} in`, this);
                if (element instanceof FudgeUserInterface.CustomElement)
                    element.setMutatorValue(_mutator[key]);
                else
                    element.value = _mutator[key];
            }
        }
        /**
         * When connected the first time, the element gets constructed as a deep clone of the template.
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            let fragment = CustomElementTemplate.fragment.get(Reflect.get(this.constructor, "tag"));
            let content = fragment.firstElementChild;
            let style = this.style;
            for (let entry of content.style) {
                style.setProperty(entry, Reflect.get(content.style, entry));
            }
            for (let child of content.childNodes) {
                this.appendChild(child.cloneNode(true));
            }
            let label = this.querySelector("label");
            if (label)
                label.textContent = this.getAttribute("label");
        }
    }
    FudgeUserInterface.CustomElementTemplate = CustomElementTemplate;
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="CustomElementTemplate.ts"/>
var FudgeUserInterface;
///<reference path="CustomElementTemplate.ts"/>
(function (FudgeUserInterface) {
    class CustomElementMatrix3x3 extends FudgeUserInterface.CustomElementTemplate {
        getMutatorValue() {
            let steppers = this.querySelectorAll("fudge-stepper");
            let mutator = { translation: {}, scaling: {}, rotation: 0 };
            let count = 0;
            for (let vector of ["translation", "scaling"])
                for (let dimension of ["x", "y"])
                    mutator[vector][dimension] = steppers[count++].getMutatorValue();
            mutator["rotation"] = steppers[count++].getMutatorValue();
            return mutator;
        }
        setMutatorValue(_mutator) {
            let steppers = this.querySelectorAll("fudge-stepper");
            let count = 0;
            for (let vector of ["translation", "scaling"])
                for (let dimension of ["x", "y"])
                    steppers[count++].setMutatorValue(Number(_mutator[vector][dimension]));
            steppers[count++].setMutatorValue(Number(_mutator["rotation"]));
        }
        connectedCallback() {
            super.connectedCallback();
            // console.log("Matrix Callback");
            let label = this.querySelector("label");
            label.textContent = this.getAttribute("label");
        }
    }
    FudgeUserInterface.CustomElementMatrix3x3 = CustomElementMatrix3x3;
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="CustomElementTemplate.ts"/>
var FudgeUserInterface;
///<reference path="CustomElementTemplate.ts"/>
(function (FudgeUserInterface) {
    class CustomElementMatrix4x4 extends FudgeUserInterface.CustomElementTemplate {
        getMutatorValue() {
            let steppers = this.querySelectorAll("fudge-stepper");
            let mutator = { translation: {}, rotation: {}, scaling: {} };
            let count = 0;
            for (let vector of ["translation", "rotation", "scaling"])
                for (let dimension of ["x", "y", "z"])
                    mutator[vector][dimension] = steppers[count++].getMutatorValue();
            return mutator;
        }
        setMutatorValue(_mutator) {
            let steppers = this.querySelectorAll("fudge-stepper");
            let count = 0;
            for (let vector of ["translation", "rotation", "scaling"])
                for (let dimension of ["x", "y", "z"])
                    steppers[count++].setMutatorValue(Number(_mutator[vector][dimension]));
        }
        connectedCallback() {
            super.connectedCallback();
            // console.log("Matrix Callback");
            let label = this.querySelector("label");
            label.textContent = this.getAttribute("label");
        }
    }
    FudgeUserInterface.CustomElementMatrix4x4 = CustomElementMatrix4x4;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * A standard text input field with a label to it.
     */
    class CustomElementOutput extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-output", CustomElementOutput); }
        constructor(_attributes) {
            super(_attributes);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            let output = document.createElement("output");
            output.id = FudgeUserInterface.CustomElement.nextId;
            this.appendChild(output);
            this.setMutatorValue(this.getAttribute("value"));
        }
        /**
         * Retrieves the content of the input element
         */
        getMutatorValue() {
            return null;
        }
        /**
         * Sets the content of the input element
         */
        setMutatorValue(_value) {
            let output = this.querySelector("output");
            output.value = _value ?? this.getAttribute("placeholder");
            if (_value)
                output.classList.remove("placeholder");
            else
                output.classList.add("placeholder");
            // this.querySelector("output").value = _value ?? this.getAttribute("placeholder");
        }
    }
    FudgeUserInterface.CustomElementOutput = CustomElementOutput;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * A dropdown menu to display enums
     */
    class CustomElementSelect extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-select", CustomElementSelect, Object); }
        constructor(_attributes, _content = {}) {
            super(_attributes);
            if (!_attributes.label)
                this.setAttribute("label", _attributes.key);
            this.content = _content;
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            let select = document.createElement("select");
            for (let key in this.content) {
                let value = Reflect.get(this.content, key);
                if (Reflect.has(this.content, value) && Reflect.get(this.content, value) !== key) // filter number keys out of simple enum 
                    continue;
                let entry = document.createElement("option");
                entry.text = key;
                entry.setAttribute("type", typeof value);
                entry.value = value.toString();
                // console.log(this.getAttribute("value"));
                if (entry.value == this.getAttribute("value")) {
                    entry.selected = true;
                }
                select.add(entry);
            }
            select.tabIndex = 0;
            this.appendChild(select);
        }
        /**
         * Retrieves the status of the checkbox as boolean value
         */
        getMutatorValue() {
            let select = this.querySelector("select");
            let type = select.options[select.selectedIndex]?.getAttribute("type") || "string";
            return type == "number" ? parseFloat(select.value) : select.value;
        }
        /**
         * Sets the status of the checkbox
         */
        setMutatorValue(_value) {
            this.querySelector("select").value = _value;
            // this.value = _value;
        }
    }
    FudgeUserInterface.CustomElementSelect = CustomElementSelect;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * An interactive number stepper with exponential display and complex handling using keyboard and mouse
     */
    class CustomElementStepper extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-stepper", CustomElementStepper, Number); }
        constructor(_attributes) {
            super(_attributes);
            this.value = 0;
            /**
             * Handle keyboard input on this element and its digits
             */
            this.hndKey = (_event) => {
                let active = document.activeElement;
                let numEntered = _event.key.charCodeAt(0) - 48;
                _event.stopPropagation();
                // if focus is on stepper, enter it and focus digit
                if (active == this) {
                    switch (_event.code) {
                        case ƒ.KEYBOARD_CODE.ENTER:
                        case ƒ.KEYBOARD_CODE.NUMPAD_ENTER:
                        case ƒ.KEYBOARD_CODE.SPACE:
                        case ƒ.KEYBOARD_CODE.ARROW_UP:
                        case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                            this.activateInnerTabs(true);
                            this.querySelectorAll("fudge-digit")[2].focus();
                            break;
                        case ƒ.KEYBOARD_CODE.F2:
                            this.openInput(true);
                            break;
                    }
                    if ((numEntered >= 0 && numEntered <= 9) || _event.key == "-" || _event.key == "+") {
                        this.openInput(true);
                        this.querySelector("input").value = "";
                        // _event.stopImmediatePropagation();
                    }
                    return;
                }
                // input field overlay is active
                if (active.getAttribute("type") == "number") {
                    if (_event.key == ƒ.KEYBOARD_CODE.ENTER || _event.key == ƒ.KEYBOARD_CODE.NUMPAD_ENTER || _event.key == ƒ.KEYBOARD_CODE.TABULATOR) {
                        this.value = Number(active.value);
                        this.display();
                        this.openInput(false);
                        this.focus();
                        this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
                    }
                    return;
                }
                if (numEntered >= 0 && numEntered <= 9) {
                    let difference = numEntered - Number(active.textContent) * (this.value < 0 ? -1 : 1);
                    this.changeDigitFocussed(difference);
                    let next = active.nextElementSibling;
                    if (next)
                        next.focus();
                    this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
                    return;
                }
                if (_event.key == "-" || _event.key == "+") {
                    this.value = (_event.key == "-" ? -1 : 1) * Math.abs(this.value);
                    this.display();
                    this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
                    return;
                }
                if (_event.code != ƒ.KEYBOARD_CODE.TABULATOR)
                    _event.preventDefault();
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                        this.changeDigitFocussed(-1);
                        this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_UP:
                        this.changeDigitFocussed(+1);
                        this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                        active.previousElementSibling.focus();
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                        let next = active.nextElementSibling;
                        if (next)
                            next.focus();
                        break;
                    case ƒ.KEYBOARD_CODE.ENTER:
                    case ƒ.KEYBOARD_CODE.NUMPAD_ENTER:
                    case ƒ.KEYBOARD_CODE.ESC:
                        this.activateInnerTabs(false);
                        this.focus();
                        break;
                    case ƒ.KEYBOARD_CODE.F2:
                        this.activateInnerTabs(false);
                        this.openInput(true);
                        break;
                    default:
                        break;
                }
            };
            this.hndWheel = (_event) => {
                _event.stopPropagation();
                _event.preventDefault();
                let change = _event.deltaY < 0 ? +1 : -1;
                this.changeDigitFocussed(change);
                this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
            };
            this.hndInput = (_event) => {
                this.openInput(false);
            };
            this.hndFocus = (_event) => {
                if (this.contains(document.activeElement))
                    return;
                this.activateInnerTabs(false);
            };
            if (_attributes && _attributes["value"])
                this.value = parseFloat(_attributes["value"]);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.tabIndex = 0;
            this.appendLabel();
            let input = document.createElement("input");
            input.type = "number";
            input.style.position = "absolute";
            input.style.display = "none";
            input.addEventListener("input" /* EVENT.INPUT */, (_event) => { _event.stopPropagation(); });
            this.appendChild(input);
            let sign = document.createElement("span");
            sign.textContent = "+";
            this.appendChild(sign);
            for (let exp = 2; exp > -4; exp--) {
                let digit = new FudgeUserInterface.CustomElementDigit();
                digit.setAttribute("exp", exp.toString());
                this.appendChild(digit);
                if (exp == 0)
                    this.innerHTML += ".";
            }
            this.innerHTML += "e";
            let exp = document.createElement("span");
            exp.textContent = "+0";
            exp.tabIndex = -1;
            exp.setAttribute("name", "exp");
            this.appendChild(exp);
            // input.addEventListener(EVENT.CHANGE, this.hndInput);
            input.addEventListener("blur" /* EVENT.BLUR */, this.hndInput);
            this.addEventListener("blur" /* EVENT.BLUR */, this.hndFocus);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            this.addEventListener("wheel" /* EVENT.WHEEL */, this.hndWheel);
            this.display();
        }
        /**
         * De-/Activates tabbing for the inner digits
         */
        activateInnerTabs(_on) {
            let index = _on ? 0 : -1;
            let spans = this.querySelectorAll("span");
            spans[1].tabIndex = index;
            let digits = this.querySelectorAll("fudge-digit");
            for (let digit of digits)
                digit.tabIndex = index;
        }
        /**
         * Opens/Closes a standard number input for typing the value at once
         */
        openInput(_open) {
            let input = this.querySelector("input");
            if (_open) {
                input.style.display = "inline";
                input.value = this.value.toString();
                input.focus();
            }
            else {
                input.style.display = "none";
            }
        }
        /**
         * Retrieve the value of this
         */
        getMutatorValue() {
            return this.value;
        }
        /**
         * Sets its value and displays it
         */
        setMutatorValue(_value) {
            if (_value == undefined)
                return;
            this.value = _value;
            this.display();
        }
        /**
         * Retrieve mantissa and exponent separately as an array of two members
         */
        getMantissaAndExponent() {
            let prec = this.value.toExponential(6);
            let exp = parseInt(prec.split("e")[1]);
            let exp3 = Math.trunc(exp / 3);
            let mantissa = this.value / Math.pow(10, exp3 * 3);
            mantissa = Math.round(mantissa * 1000) / 1000;
            return [mantissa, exp3 * 3];
        }
        /**
         * Retrieves this value as a string
         */
        toString() {
            let [mantissa, exp] = this.getMantissaAndExponent();
            let prefixMantissa = (mantissa < 0) ? "" : "+";
            let prefixExp = (exp < 0) ? "" : "+";
            return prefixMantissa + mantissa.toFixed(3) + "e" + prefixExp + exp;
        }
        /**
         * Displays this value by setting the contents of the digits and the exponent
         */
        display() {
            let digits = this.querySelectorAll("fudge-digit");
            let spans = this.querySelectorAll("span");
            if (!isFinite(this.value)) {
                for (let pos = 0; pos < digits.length; pos++) {
                    let digit = digits[5 - pos];
                    digit.innerHTML = "  ∞   "[5 - pos];
                    spans[1].textContent = "  ";
                }
                return;
            }
            let [mantissa, exp] = this.toString().split("e");
            spans[0].textContent = this.value < 0 ? "-" : "+";
            spans[1].textContent = exp;
            mantissa = mantissa.substring(1);
            mantissa = mantissa.replace(".", "");
            for (let pos = 0; pos < digits.length; pos++) {
                let digit = digits[5 - pos];
                if (pos < mantissa.length) {
                    let char = mantissa.charAt(mantissa.length - 1 - pos);
                    digit.textContent = char;
                }
                else
                    digit.innerHTML = "&nbsp;";
            }
        }
        changeDigitFocussed(_amount) {
            let digit = document.activeElement;
            if (digit == this || !this.contains(digit))
                return;
            _amount = Math.round(_amount);
            if (_amount == 0)
                return;
            if (digit == this.querySelector("[name=exp]")) {
                // console.log(this.value);
                let value = this.value * Math.pow(10, _amount);
                ƒ.Debug.log(value, this.value);
                if (isFinite(value))
                    this.value = value;
                this.display();
                return;
            }
            let expDigit = parseInt(digit.getAttribute("exp"));
            // @ts-ignore (mantissa not used)
            let [mantissa, expValue] = this.getMantissaAndExponent();
            let prev = this.value;
            this.value += _amount * Math.pow(10, expDigit + expValue);
            // workaround precision problems of javascript
            if (Math.abs(prev / this.value) > 1000)
                this.value = 0;
            let expNew;
            [mantissa, expNew] = this.getMantissaAndExponent();
            // console.log(mantissa);
            this.shiftFocus(expNew - expValue);
            this.display();
        }
        shiftFocus(_nDigits) {
            let shiftFocus = document.activeElement;
            if (_nDigits) {
                for (let i = 0; i < 3; i++)
                    if (_nDigits > 0)
                        shiftFocus = shiftFocus.nextElementSibling;
                    else
                        shiftFocus = shiftFocus.previousElementSibling;
                shiftFocus.focus();
            }
        }
    }
    FudgeUserInterface.CustomElementStepper = CustomElementStepper;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * A standard text input field with a label to it.
     */
    class CustomElementTextInput extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-textinput", CustomElementTextInput, String); }
        constructor(_attributes) {
            super(_attributes);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            let input = document.createElement("input");
            input.id = FudgeUserInterface.CustomElement.nextId;
            input.value = this.getAttribute("value");
            this.appendChild(input);
        }
        /**
         * Retrieves the content of the input element
         */
        getMutatorValue() {
            return this.querySelector("input").value;
        }
        /**
         * Sets the content of the input element
         */
        setMutatorValue(_value) {
            this.querySelector("input").value = _value;
        }
    }
    FudgeUserInterface.CustomElementTextInput = CustomElementTextInput;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Baseclass for complex ui-controllers handling data in tables, trees or other structures
     */
    class DataController {
        constructor() {
            /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of table */
            this.selection = [];
        }
        /**
         * Remove the objects to be deleted, e.g. the current selection, from the data structure the table refers to and
         * return a list of those objects in order for the according {@link TableItems} to be deleted also
         * @param _expendables The expendable objects
         */
        async delete(_expendables) {
            return _expendables;
        }
        /**
         * Refer items to the clipboard for copy & paste
         * @param _focus The item has the focus and that will be copied if the selection is empty,
         * otherwise the current selection is referred
         */
        copy(_focus, _operation) {
            let items = this.selection.length ? this.selection : [_focus];
            FudgeUserInterface.Clipboard.copyPaste.set(items, _operation);
            return items;
        }
        /**
         * Refer objects to the clipboard for copy & paste and delete them from this controller
         * @param _focus The item that has the focus and that will be cut if the selection is empty,
         * otherwise the whole selection gets referred and deleted
         */
        async cut(_focus, _operation) {
            let items = this.copy(_focus, _operation);
            items = await this.delete(items);
            return items;
        }
        /**
         * Retrieve objects from the clipboard, process and return them to add to the table
         * Standard behaviour: if the copyPaste clipboard was filled using copy, return an array of clones,
         * otherwise the content of the clipboard
         */
        async paste() {
            let objects = FudgeUserInterface.Clipboard.copyPaste.get();
            if (FudgeUserInterface.Clipboard.copyPaste.operation == "copy")
                return await this.clone(objects);
            else
                return objects;
        }
        /**
         * Refer objects to the clipboard for drag & drop
         * @param _focus The item that has the focus and that will be dragged if the selection is empty,
         * otherwise the current selection is referred
         */
        dragStart(_focus) {
            // if the focussed item is in the selection, drag the whole selection
            let items = this.selection.indexOf(_focus) < 0 ? [_focus] : this.selection;
            FudgeUserInterface.Clipboard.dragDrop.set(items);
        }
        /**
         * Return allowed dragDrop-effect
         * Standard behaviour: check the ctrlKey for "copy" and shiftKey for "link", otherwise return "move"
         */
        dragOver(_event) {
            let dropEffect = "move";
            if (_event.ctrlKey)
                dropEffect = "copy";
            if (_event.shiftKey)
                dropEffect = "link";
            return dropEffect;
        }
        /**
         * Retrieve objects from the clipboard, process and return them to add to the tree.
         * Standard behaviour: if {@link: dragOver} yields "copy", return an array of clones of the objects in,
         * otherwise the content of the dragDrop-clipboard.
         */
        async drop(_event) {
            let objects = FudgeUserInterface.Clipboard.dragDrop.get();
            if (this.dragOver(_event) == "copy")
                return await this.clone(objects);
            else
                return objects;
        }
        /**
         * Clone objects and return an array with references to the clones
         * Standard behaviour: use Object.create to clone the objects
         */
        async clone(_objects) {
            return _objects.map(_object => Object.create(_object));
        }
    }
    FudgeUserInterface.DataController = DataController;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    class Details extends HTMLDetailsElement {
        constructor(_legend = "", _type) {
            super();
            this.hndToggle = (_event) => {
                if (_event)
                    _event.stopPropagation();
                this.dispatchEvent(new Event(this.isExpanded ? "expand" /* EVENT.EXPAND */ : "collapse" /* EVENT.COLLAPSE */, { bubbles: true }));
            };
            this.hndFocus = (_event) => {
                switch (_event.type) {
                    case "focusNext" /* EVENT.FOCUS_NEXT */:
                        let next = this.nextElementSibling;
                        if (next && next.tabIndex > -1) {
                            next.focus();
                            _event.stopPropagation();
                        }
                        break;
                    case "focusPrevious" /* EVENT.FOCUS_PREVIOUS */:
                        let previous = this.previousElementSibling;
                        if (previous && previous.tabIndex > -1) {
                            let sets = previous.querySelectorAll("details");
                            let i = sets.length;
                            if (i)
                                do { // focus the last visible set
                                    sets[--i].focus();
                                } while (!sets[i].offsetParent);
                            else
                                previous.focus();
                            _event.stopPropagation();
                        }
                        break;
                    case "focusSet" /* EVENT.FOCUS_SET */:
                        if (_event.target != this) {
                            this.focus();
                            _event.stopPropagation();
                        }
                        break;
                }
            };
            this.hndKey = (_event) => {
                let passEvent = false;
                // let target: HTMLElement = <HTMLElement>_event.target;
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.INSERT:
                        ƒ.Debug.log("INSERT at Details");
                        this.dispatchEvent(new CustomEvent("insert" /* EVENT.INSERT */, { bubbles: true, detail: this }));
                        break;
                    case ƒ.KEYBOARD_CODE.DELETE:
                        passEvent = true;
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                        if (!this.isExpanded) {
                            this.expand(true);
                            break;
                        }
                    case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                        let next = this;
                        if (this.isExpanded)
                            next = this.querySelector("details");
                        else
                            do {
                                next = next.nextElementSibling;
                            } while (next && next.tabIndex > -1);
                        if (next)
                            next.focus();
                        // next.dispatchEvent(new KeyboardEvent(EVENT_TREE.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        else
                            this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                        if (this.isExpanded) {
                            this.expand(false);
                            break;
                        }
                    case ƒ.KEYBOARD_CODE.ARROW_UP:
                        let previous = this;
                        do {
                            previous = previous.previousElementSibling;
                        } while (previous && !(previous instanceof Details));
                        if (previous)
                            if (previous.isExpanded)
                                this.dispatchEvent(new KeyboardEvent("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                            else
                                previous.focus();
                        else
                            this.parentElement.dispatchEvent(new KeyboardEvent("focusSet" /* EVENT.FOCUS_SET */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                }
                if (!passEvent)
                    _event.stopPropagation();
            };
            // TODO: check if this should be removed after changing animation structure to look more like a mutator
            this.setAttribute("key", _legend);
            this.setAttribute("label", _legend);
            this.setAttribute("type", _type);
            this.open = true;
            let lblSummary = document.createElement("summary");
            lblSummary.textContent = _legend;
            this.appendChild(lblSummary);
            this.content = document.createElement("div");
            this.appendChild(this.content);
            this.tabIndex = 0;
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            this.addEventListener("focusNext" /* EVENT.FOCUS_NEXT */, this.hndFocus);
            this.addEventListener("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, this.hndFocus);
            this.addEventListener("focusSet" /* EVENT.FOCUS_SET */, this.hndFocus);
            this.addEventListener("toggle" /* EVENT.TOGGLE */, this.hndToggle);
        }
        get isExpanded() {
            // return this.expander.checked;
            return this.open;
        }
        setContent(_content) {
            this.replaceChild(_content, this.content);
            this.content = _content;
        }
        expand(_expand) {
            // this.expander.checked = _expand;
            this.open = _expand;
            this.hndToggle(null);
        }
    }
    FudgeUserInterface.Details = Details;
    // TODO: use CustomElement.register?
    customElements.define("ui-details", Details, { extends: "details" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    class DetailsArray extends FudgeUserInterface.Details {
        constructor(_legend) {
            super(_legend, "Array");
            this.hndDragStart = (_event) => {
                // _event.preventDefault; 
                let keyDrag = _event.currentTarget.getAttribute("key");
                _event.dataTransfer.setData("index", keyDrag);
                _event.dataTransfer.setData("key:" + this.getAttribute("key"), "key");
            };
            this.hndDragOver = (_event) => {
                _event.preventDefault();
                _event.dataTransfer.dropEffect = "none";
                for (let item of _event.dataTransfer.items) {
                    let key;
                    let label;
                    [key, label] = item.type.split(":");
                    if (key == "key" && label == this.getAttribute("key")) {
                        _event.dataTransfer.dropEffect = "move";
                        if (_event.ctrlKey)
                            _event.dataTransfer.dropEffect = "copy";
                        if (_event.shiftKey)
                            _event.dataTransfer.dropEffect = "link";
                        // console.log(label == this.getAttribute("key"));
                    }
                }
            };
            this.hndDrop = (_event) => {
                // console.log(_event);
                let drop = _event.currentTarget;
                let keyDrop = drop.getAttribute("key");
                let keyDrag = _event.dataTransfer.getData("index");
                let drag = this.querySelector(`[key="${keyDrag}"]`);
                let labelDrag = drag.getAttribute("label");
                let position = keyDrag > keyDrop ? "beforebegin" : "afterend";
                if (_event.ctrlKey)
                    drag = drag.cloneNode(true);
                drag.setAttribute("label", labelDrag);
                if (_event.shiftKey)
                    drag.parentNode.removeChild(drag);
                else
                    drop.insertAdjacentElement(position, drag);
                this.rearrange();
                this.addEventListeners(drag);
                drag.focus();
            };
            this.hndInsert = (_event) => {
                ƒ.Debug.fudge("hndInsert");
            };
            this.hndKeySpecial = (_event) => {
                let item = _event.currentTarget;
                // only work on items of list, not their children
                if (_event.target != item && _event.code != ƒ.KEYBOARD_CODE.DELETE)
                    return;
                let focus = parseInt(item.getAttribute("label"));
                let sibling = item;
                let insert = item;
                let passEvent = false;
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.DELETE:
                        item.parentNode.removeChild(item);
                        this.rearrange(focus);
                        break;
                    // case ƒ.KEYBOARD_CODE.INSERT:
                    //   passEvent = true;
                    //   console.log("INSERT at DetailsArray");
                    //   break;
                    case ƒ.KEYBOARD_CODE.ARROW_UP:
                        if (!_event.altKey) {
                            this.setFocus(--focus);
                            break;
                        }
                        if (_event.shiftKey) {
                            insert = item.cloneNode(true);
                            insert.setAttribute("label", item.getAttribute("label"));
                            this.addEventListeners(insert);
                        }
                        else
                            sibling = item.previousSibling;
                        if (sibling)
                            sibling.insertAdjacentElement("beforebegin", insert);
                        this.rearrange(--focus);
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                        if (!_event.altKey) {
                            this.setFocus(++focus);
                            break;
                        }
                        if (_event.shiftKey) {
                            insert = item.cloneNode(true);
                            insert.setAttribute("label", item.getAttribute("label"));
                            this.addEventListeners(insert);
                        }
                        else
                            sibling = item.nextSibling;
                        if (sibling)
                            sibling.insertAdjacentElement("afterend", insert);
                        this.rearrange(++focus);
                        break;
                    default:
                        passEvent = true;
                }
                if (!passEvent) {
                    _event.stopPropagation();
                }
            };
        }
        setContent(_content) {
            super.setContent(_content);
            for (let child of this.content.children) {
                this.addEventListeners(child);
            }
        }
        getMutator() {
            let mutator = [];
            for (let child of this.content.children) {
                mutator.push(child.getMutatorValue());
            }
            return mutator;
        }
        addEventListeners(_child) {
            _child.draggable = true;
            _child.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragStart);
            _child.addEventListener("drop" /* EVENT.DROP */, this.hndDrop);
            _child.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
            _child.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKeySpecial);
            _child.addEventListener("insert" /* EVENT.INSERT */, this.hndInsert);
            _child.tabIndex = 0;
        }
        rearrange(_focus = undefined) {
            let sequence = [];
            for (let child of this.content.children) {
                sequence.push(parseInt(child.getAttribute("label")));
            }
            this.setFocus(_focus);
            this.dispatchEvent(new CustomEvent("rearrangeArray" /* EVENT.REARRANGE_ARRAY */, { bubbles: true, detail: { key: this.getAttribute("key"), sequence: sequence } }));
            let count = 0;
            for (let child of this.content.children) {
                child.setAttribute("label", count.toString());
                child.setAttribute("key", count.toString());
                if (child.setLabel)
                    child.setLabel(count.toString());
                ƒ.Debug.fudge(child.tabIndex);
                count++;
            }
            this.dispatchEvent(new Event("mutate" /* EVENT.MUTATE */, { bubbles: true }));
        }
        setFocus(_focus = undefined) {
            if (_focus == undefined)
                return;
            _focus = Math.max(0, Math.min(_focus, this.content.children.length - 1));
            let child = this.content.children[_focus];
            child?.focus();
        }
    }
    FudgeUserInterface.DetailsArray = DetailsArray;
    customElements.define("ui-list", DetailsArray, { extends: "details" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Static class to display a modal or non-modal dialog with an interface for the given mutator.
     */
    class Dialog {
        /**
         * Prompt the dialog to the user with the given headline, call to action and labels for the cancel- and ok-button
         * Use `await` on call, to continue after the user has pressed one of the buttons.
         */
        static async prompt(_data, _modal = true, _head = "Headline", _callToAction = "Instruction", _ok = "OK", _cancel = "Cancel") {
            Dialog.dom = document.createElement("dialog");
            document.body.appendChild(Dialog.dom);
            Dialog.dom.innerHTML = "<h1>" + _head + "</h1>";
            let content;
            if (_data instanceof ƒ.Mutable)
                content = FudgeUserInterface.Generator.createInterfaceFromMutable(_data);
            else
                content = FudgeUserInterface.Generator.createInterfaceFromMutator(_data);
            content.id = "content";
            Dialog.dom.appendChild(content);
            let footer = document.createElement("footer");
            footer.innerHTML = "<p>" + _callToAction + "</p>";
            let btnCancel = document.createElement("button");
            btnCancel.innerHTML = _cancel;
            if (_cancel != "")
                footer.appendChild(btnCancel);
            let btnOk = document.createElement("button");
            btnOk.innerHTML = _ok;
            footer.appendChild(btnOk);
            Dialog.dom.appendChild(footer);
            if (_modal)
                //@ts-ignore
                Dialog.dom.showModal();
            else
                //@ts-ignore
                Dialog.dom.show();
            return new Promise((_resolve) => {
                let hndButton = (_event) => {
                    btnCancel.removeEventListener("click", hndButton);
                    btnOk.removeEventListener("click", hndButton);
                    if (_event.target == btnOk)
                        try {
                            FudgeUserInterface.Controller.updateMutator(content, _data);
                        }
                        catch (_e) {
                            ƒ.Debug.warn(_e);
                        }
                    //@ts-ignore
                    Dialog.dom.close();
                    document.body.removeChild(Dialog.dom);
                    _resolve(_event.target == btnOk);
                };
                btnCancel.addEventListener("click" /* EVENT.CLICK */, hndButton);
                btnOk.addEventListener("click" /* EVENT.CLICK */, hndButton);
                btnOk.focus();
            });
        }
    }
    FudgeUserInterface.Dialog = Dialog;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    class MultiLevelMenuManager {
        static buildFromSignature(_signature, _mutator) {
            let mutator = _mutator || {};
            let signatureLevels = _signature.split(".");
            if (signatureLevels.length > 1) {
                let subSignature = signatureLevels[1];
                for (let i = 2; i < signatureLevels.length; i++) {
                    subSignature = subSignature + "." + signatureLevels[i];
                }
                if (mutator[signatureLevels[0]] != null) {
                    mutator[signatureLevels[0]] = this.buildFromSignature(subSignature, mutator[signatureLevels[0]]);
                }
                else {
                    mutator[signatureLevels[0]] = this.buildFromSignature(subSignature);
                }
            }
            else {
                mutator[signatureLevels[0]] = signatureLevels[0];
            }
            return mutator;
        }
    }
    FudgeUserInterface.MultiLevelMenuManager = MultiLevelMenuManager;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Static class to display a modal warning.
     */
    class Warning {
        /**
         * Display a warning to the user with the given headline, warning text and ok butten text.
         */
        static display(_errors = [], _headline = "Headline", _warning = "Warning", _ok = "OK") {
            let warning = document.createElement("dialog");
            document.body.appendChild(warning);
            warning.innerHTML = "<h1>" + _headline + "</h1>";
            let content = document.createElement("div");
            content.id = "content";
            content.innerText = _errors.join("\n");
            warning.appendChild(content);
            let footer = document.createElement("footer");
            footer.innerHTML = "<p>" + _warning + "</p>";
            let btnOk = document.createElement("button");
            btnOk.innerHTML = _ok;
            btnOk.onclick = () => {
                //@ts-ignore
                warning.close();
                warning.remove();
            };
            footer.appendChild(btnOk);
            warning.appendChild(footer);
            //@ts-ignore
            warning.showModal();
        }
    }
    FudgeUserInterface.Warning = Warning;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Manages a sortable table of data given as simple array of flat objects
     * ```text
     * Key0  Key1 Key2
     * ```
     */
    class Table extends HTMLTableElement {
        constructor(_controller, _data, _attIcon) {
            super();
            this.hndDelete = async (_event) => {
                let target = _event.target;
                _event.stopPropagation();
                let deleted = await this.controller.delete([target.data]);
                if (deleted.length)
                    this.dispatchEvent(new Event("removeChild" /* EVENT.REMOVE_CHILD */, { bubbles: true }));
            };
            this.hndEscape = (_event) => {
                this.clearSelection();
            };
            this.hndCopyPaste = async (_event) => {
                ƒ.Debug.fudge(_event);
                // _event.stopPropagation();
                switch (_event.type) {
                    case "copy" /* EVENT.COPY */:
                        this.controller.copy(this.getFocussed(), _event.type);
                        break;
                    case "cut" /* EVENT.CUT */:
                        _event.stopPropagation();
                        let cut = await this.controller.cut(this.getFocussed(), _event.type);
                        if (cut.length)
                            this.dispatchEvent(new Event("removeChild" /* EVENT.REMOVE_CHILD */, { bubbles: true }));
                        break;
                    case "paste" /* EVENT.PASTE */:
                        _event.stopPropagation();
                        let objects = await this.controller.paste();
                        for (let object of objects) {
                            let item = new FudgeUserInterface.TableItem(this.controller, object, this.attIcon);
                            this.appendChild(item);
                            this.parentElement.dispatchEvent(new Event("paste" /* EVENT.PASTE */, { bubbles: true }));
                        }
                        break;
                }
            };
            this.hndDragDrop = async (_event) => {
                let item = Reflect.get(_event, "item");
                _event.dataTransfer.dropEffect = "none";
                switch (_event.type) {
                    case "dragstart" /* EVENT.DRAG_START */:
                        _event.dataTransfer.effectAllowed = "all";
                        this.controller.dragStart(item.data);
                        break;
                    case "dragover" /* EVENT.DRAG_OVER */:
                        _event.dataTransfer.dropEffect = this.controller.dragOver(_event);
                        // _event.preventDefault();
                        break;
                    case "drop" /* EVENT.DROP */:
                        let objects = await this.controller.drop(_event);
                        for (let object of objects) {
                            let item = new FudgeUserInterface.TableItem(this.controller, object, this.attIcon);
                            this.appendChild(item);
                        }
                        break;
                }
            };
            this.hndFocus = (_event) => {
                _event.stopPropagation();
                let items = Array.from(this.querySelectorAll("tr"));
                let target = _event.target;
                let index = items.indexOf(target);
                if (index < 0)
                    return;
                if (_event.shiftKey && this.controller.selection.length == 0)
                    target.select(true);
                switch (_event.type) {
                    case "focusNext" /* EVENT.FOCUS_NEXT */:
                        if (++index < items.length)
                            items[index].focus();
                        break;
                    case "focusPrevious" /* EVENT.FOCUS_PREVIOUS */:
                        if (--index >= 0)
                            items[index].focus();
                        break;
                    default:
                        break;
                }
                if (_event.shiftKey)
                    document.activeElement.select(true);
                else if (!_event.ctrlKey)
                    this.clearSelection();
            };
            this.controller = _controller;
            this.data = _data;
            this.attIcon = _attIcon;
            this.create();
            this.className = "sortable";
            this.addEventListener("sort" /* EVENT.SORT */, this.hndSort);
            this.addEventListener("itemselect" /* EVENT.SELECT */, this.hndSelect);
            this.addEventListener("selectAll" /* EVENT.SELECT_ALL */, this.selectAll);
            this.addEventListener("focusNext" /* EVENT.FOCUS_NEXT */, this.hndFocus);
            this.addEventListener("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, this.hndFocus);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste);
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragDrop);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDragDrop);
        }
        /**
         * Create the table
         */
        create() {
            this.innerHTML = "";
            let head = this.controller.getHead();
            this.appendChild(this.createHead(head));
            for (let data of this.data) {
                let item = new FudgeUserInterface.TableItem(this.controller, data, this.attIcon);
                this.appendChild(item);
            }
        }
        /**
         * Clear the current selection
         */
        clearSelection() {
            this.controller.selection.splice(0);
            this.displaySelection(this.controller.selection);
        }
        /**
         * Return the object in focus
         */
        getFocussed() {
            let items = Array.from(this.querySelectorAll("tr"));
            let found = items.indexOf(document.activeElement);
            if (found > -1)
                return items[found].data;
            return null;
        }
        selectAll() {
            this.selectInterval(this.data[0], this.data[this.data.length - 1]);
        }
        selectInterval(_dataStart, _dataEnd) {
            let items = this.querySelectorAll("tr");
            let selecting = false;
            let end = null;
            for (let item of items) {
                if (!selecting) {
                    selecting = true;
                    if (item.data == _dataStart)
                        end = _dataEnd;
                    else if (item.data == _dataEnd)
                        end = _dataStart;
                    else
                        selecting = false;
                }
                if (selecting) {
                    item.select(true, false);
                    if (item.data == end)
                        break;
                }
            }
        }
        displaySelection(_data) {
            // console.log(_data);
            let items = this.querySelectorAll("tr");
            for (let item of items)
                item.selected = (_data != null && _data.indexOf(item.data) > -1);
        }
        createHead(_headInfo) {
            let tr = document.createElement("tr");
            for (let entry of _headInfo) {
                let th = document.createElement("th");
                th.textContent = entry.label;
                th.setAttribute("key", entry.key);
                if (entry.sortable) {
                    th.appendChild(this.getSortButtons());
                    th.addEventListener("change" /* EVENT.CHANGE */, (_event) => th.dispatchEvent(new CustomEvent("sort" /* EVENT.SORT */, { detail: _event.target, bubbles: true })));
                }
                tr.appendChild(th);
            }
            return tr;
        }
        getSortButtons() {
            let result = document.createElement("span");
            for (let direction of ["up", "down"]) {
                let button = document.createElement("input");
                button.type = "radio";
                button.name = "sort";
                button.value = direction;
                result.appendChild(button);
            }
            return result;
        }
        hndSort(_event) {
            let value = _event.detail.value;
            let key = _event.target.getAttribute("key");
            let direction = (value == "up") ? 1 : -1;
            this.controller.sort(this.data, key, direction);
            this.create();
        }
        hndSelect(_event) {
            // _event.stopPropagation();
            let detail = _event.detail;
            let index = this.controller.selection.indexOf(detail.data);
            if (detail.interval) {
                let dataStart = this.controller.selection[0];
                let dataEnd = detail.data;
                this.clearSelection();
                this.selectInterval(dataStart, dataEnd);
                return;
            }
            if (index >= 0 && detail.additive)
                this.controller.selection.splice(index, 1);
            else {
                if (!detail.additive)
                    this.clearSelection();
                this.controller.selection.push(detail.data);
            }
            this.displaySelection(this.controller.selection);
        }
    }
    FudgeUserInterface.Table = Table;
    customElements.define("table-sortable", Table, { extends: "table" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="../DataController.ts"/>
var FudgeUserInterface;
///<reference path="../DataController.ts"/>
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a [[Table]] to display and manipulate it.
     * The [[Table]] doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class TableController extends FudgeUserInterface.DataController {
    }
    FudgeUserInterface.TableController = TableController;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Extension of tr-element that represents an object in a [[Table]]
     */
    class TableItem extends HTMLTableRowElement {
        constructor(_controller, _data, _attIcon) {
            super();
            this.data = null;
            this.hndInputEvent = (_event) => {
                if (_event instanceof KeyboardEvent && _event.code != ƒ.KEYBOARD_CODE.F2)
                    return;
                let input = _event.target;
                input.readOnly = false;
                input.focus();
            };
            this.hndChange = async (_event) => {
                this.focus();
                let target = _event.target;
                target.readOnly = true;
                // let key: string = target.getAttribute("key");
                // let previousValue: ƒ.General = Reflect.get(this.data, key);
                if (await this.controller.rename(this.data, target.value)) {
                    // Reflect.set(this.data, key, target.value); // why shouldn't the controller do this?
                    // console.log("Dispatch Rename");
                    this.parentElement.dispatchEvent(new CustomEvent("rename" /* EVENT.RENAME */, { bubbles: true, detail: { data: this.data } }));
                }
                return;
            };
            this.hndKey = (_event) => {
                _event.stopPropagation();
                if (_event.target != this)
                    return;
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                        this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_UP:
                        this.dispatchEvent(new KeyboardEvent("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.SPACE:
                        this.select(_event.ctrlKey, _event.shiftKey);
                        break;
                    case ƒ.KEYBOARD_CODE.ESC:
                        this.dispatchEvent(new Event("escape" /* EVENT.ESCAPE */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.DELETE:
                        this.dispatchEvent(new Event("delete" /* EVENT.DELETE */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.C:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("copy" /* EVENT.COPY */, { bubbles: true }));
                        }
                        break;
                    case ƒ.KEYBOARD_CODE.V:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("paste" /* EVENT.PASTE */, { bubbles: true }));
                        }
                        break;
                    case ƒ.KEYBOARD_CODE.X:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("cut" /* EVENT.CUT */, { bubbles: true }));
                        }
                        break;
                }
            };
            this.hndDragDrop = (_event) => {
                // store the dragged item in the event for further processing in table
                Reflect.set(_event, "item", this);
            };
            this.hndPointerUp = (_event) => {
                _event.stopPropagation();
                this.focus();
                this.select(_event.ctrlKey, _event.shiftKey);
            };
            this.controller = _controller;
            this.data = _data;
            // this.display = this.controller.getLabel(_data);
            // TODO: handle cssClasses
            this.create(this.controller.getHead(), _attIcon);
            this.className = "table";
            this.addEventListener("pointerup" /* EVENT.POINTER_UP */, this.hndPointerUp);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            this.draggable = true;
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragDrop);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDragDrop);
            // this.addEventListener(EVENT.UPDATE, this.hndUpdate);
        }
        /**
         * Returns attaches or detaches the [[CSS_CLASS.SELECTED]] to this item
         */
        set selected(_on) {
            if (_on)
                this.classList.add(FudgeUserInterface.CSS_CLASS.SELECTED);
            else
                this.classList.remove(FudgeUserInterface.CSS_CLASS.SELECTED);
        }
        /**
         * Returns true if the [[TREE_CLASSES.SELECTED]] is attached to this item
         */
        get selected() {
            return this.classList.contains(FudgeUserInterface.CSS_CLASS.SELECTED);
        }
        /**
         * Dispatches the [[EVENT.SELECT]] event
         * @param _additive For multiple selection (+Ctrl)
         * @param _interval For selection over interval (+Shift)
         */
        select(_additive, _interval = false) {
            let event = new CustomEvent("itemselect" /* EVENT.SELECT */, { bubbles: true, detail: { data: this.data, additive: _additive, interval: _interval } });
            this.dispatchEvent(event);
        }
        create(_filter, _attIcon) {
            for (let entry of _filter) {
                let value = Reflect.get(this.data, entry.key);
                let icon = Reflect.get(this.data, _attIcon);
                let td = document.createElement("td");
                let input = document.createElement("input");
                input.type = "text";
                input.disabled = !entry.editable;
                input.readOnly = true;
                input.value = value;
                input.setAttribute("key", entry.key);
                input.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndInputEvent);
                input.addEventListener("dblclick" /* EVENT.DOUBLE_CLICK */, this.hndInputEvent);
                input.addEventListener("focusout" /* EVENT.FOCUS_OUT */, this.hndChange);
                td.appendChild(input);
                this.appendChild(td);
                if (icon)
                    this.setAttribute("icon", icon);
            }
            this.tabIndex = 0;
        }
    }
    FudgeUserInterface.TableItem = TableItem;
    customElements.define("table-item", TableItem, { extends: "tr" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Extension of ul-element that keeps a list of {@link TreeItem}s to represent a branch in a tree
     */
    class TreeList extends HTMLUListElement {
        constructor(_controller, _items = []) {
            super();
            this.hndDrop = (_event) => {
                if (Reflect.has(_event, "index"))
                    return;
                let target = this.parentElement.data;
                Reflect.set(_event, "index", this.controller.dragDropIndicator.isConnected ?
                    Array.from(this.children).indexOf(this.controller.dragDropIndicator) :
                    null);
                Reflect.set(_event, "parent", target);
            };
            this.hndDragOver = (_event) => {
                if (Reflect.get(_event, "dragProcessed"))
                    return;
                Reflect.set(_event, "dragProcessed", true);
                let target = this.parentElement.data;
                if (target == null || !this.controller.canAddChildren(FudgeUserInterface.Clipboard.dragDrop.get(), target))
                    return;
                _event.preventDefault();
                _event.dataTransfer.dropEffect = "move";
                if (_event.target == this)
                    this.controller.dragDropIndicator.remove();
                else {
                    let targetItem = _event.composedPath().find(_target => _target instanceof FudgeUserInterface.TreeItem);
                    if (this.getItems().includes(targetItem)) {
                        let rect = targetItem.content.getBoundingClientRect();
                        let addBefore = _event.clientY < rect.top + rect.height / 2;
                        let sibling = addBefore ? targetItem.previousElementSibling : targetItem.nextElementSibling;
                        if (sibling != this.controller.dragDropIndicator)
                            if (addBefore)
                                targetItem.before(this.controller.dragDropIndicator);
                            else
                                targetItem.after(this.controller.dragDropIndicator);
                    }
                }
            };
            this.controller = _controller;
            this.addItems(_items);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDrop);
            this.className = "tree";
        }
        /**
         * Expands the tree along the given paths to show the objects the paths include.
         */
        expand(_paths) {
            for (let path of _paths)
                this.show(path);
        }
        /**
         * Expands the tree along the given path to show the objects the path includes.
         */
        show(_path) {
            let currentTree = this;
            for (let data of _path) {
                let item = currentTree.findItem(data);
                if (!item)
                    break;
                if (!item.expanded)
                    item.expand(true);
                currentTree = item.getBranch();
            }
        }
        /**
         * Restructures the list to sync with the given list.
         * {@link TreeItem}s referencing the same object remain in the list, new items get added in the order of appearance, obsolete ones are deleted.
         * @param _tree A list to sync this with
         */
        restructure(_tree) {
            let items = [];
            for (let item of _tree.getItems()) {
                let found = this.findItem(item.data);
                if (found) {
                    found.refreshContent();
                    found.hasChildren = item.hasChildren;
                    if (!found.hasChildren)
                        found.expand(false);
                    items.push(found);
                }
                else
                    items.push(item);
            }
            this.innerHTML = "";
            this.addItems(items);
            this.displaySelection(this.controller.selection);
        }
        /**
         * Returns the {@link TreeItem} of this list referencing the given object or null, if not found
         */
        findItem(_data) {
            for (let item of this.children)
                if (this.controller.equals(item.data, _data))
                    return item;
            return null;
        }
        /**
         * Adds the given {@link TreeItem}s at the end of this list
         */
        addItems(_items) {
            for (let item of _items) {
                this.appendChild(item);
            }
        }
        /**
         * Returns the content of this list as array of {@link TreeItem}s
         */
        getItems() {
            return Array.from(this.children).filter(_child => _child instanceof FudgeUserInterface.TreeItem);
        }
        displaySelection(_data) {
            let items = this.querySelectorAll("li");
            for (let item of items)
                item.selected = (_data != null && _data.indexOf(item.data) > -1);
        }
        selectInterval(_dataStart, _dataEnd) {
            let items = this.querySelectorAll("li");
            let selecting = false;
            let end = null;
            for (let item of items) {
                if (!selecting) {
                    selecting = true;
                    if (this.controller.equals(item.data, _dataStart))
                        end = _dataEnd;
                    else if (this.controller.equals(item.data, _dataEnd))
                        end = _dataStart;
                    else
                        selecting = false;
                }
                if (selecting) {
                    item.select(true, false);
                    if (this.controller.equals(item.data, end))
                        break;
                }
            }
        }
        selectAll() {
            let items = this.querySelectorAll("li");
            this.selectInterval(items[0].data, items[items.length - 1].data);
        }
        delete(_data) {
            let items = this.querySelectorAll("li");
            let deleted = [];
            for (let item of items)
                if (_data.indexOf(item.data) > -1) {
                    item.dispatchEvent(new Event("removeChild" /* EVENT.REMOVE_CHILD */, { bubbles: true }));
                    deleted.push(item.parentNode.removeChild(item));
                }
            return deleted;
        }
        findVisible(_data) {
            let items = this.querySelectorAll("li");
            for (let item of items)
                if (this.controller.equals(_data, item.data))
                    return item;
            return null;
        }
        /**
         * Returns all expanded {@link TreeItem}s that are a descendant of this list.
         */
        getExpanded() {
            return [...this].filter(_item => _item.expanded);
        }
        *[Symbol.iterator]() {
            let items = this.querySelectorAll("li");
            for (let i = 0; i < items.length; i++)
                yield items[i];
        }
    }
    FudgeUserInterface.TreeList = TreeList;
    customElements.define("ul-tree-list", TreeList, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="TreeList.ts"/>
var FudgeUserInterface;
///<reference path="TreeList.ts"/>
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    let CSS_CLASS;
    (function (CSS_CLASS) {
        CSS_CLASS["SELECTED"] = "selected";
        CSS_CLASS["INACTIVE"] = "inactive";
    })(CSS_CLASS = FudgeUserInterface.CSS_CLASS || (FudgeUserInterface.CSS_CLASS = {}));
    /**
     * Extension of {@link TreeList} that represents the root of a tree control
     * ```text
     * tree <ul>
     * ├ treeItem <li>
     * ├ treeItem <li>
     * │ └ treeList <ul>
     * │   ├ treeItem <li>
     * │   └ treeItem <li>
     * └ treeItem <li>
     * ```
     */
    class Tree extends FudgeUserInterface.TreeList {
        constructor(_controller, _root) {
            super(_controller, []);
            this.hndDragDrop = async (_event) => {
                let item = Reflect.get(_event, "item");
                // _event.dataTransfer.dropEffect = "none";
                switch (_event.type) {
                    case "dragstart" /* EVENT.DRAG_START */:
                        _event.dataTransfer.effectAllowed = "all";
                        this.controller.dragStart(item.data);
                        break;
                    case "dragover" /* EVENT.DRAG_OVER */:
                        _event.dataTransfer.dropEffect = this.controller.dragOver(_event);
                        // _event.preventDefault();
                        break;
                    case "drop" /* EVENT.DROP */:
                        let objects = await this.controller.drop(_event);
                        let index = Reflect.get(_event, "index");
                        let parent = Reflect.get(_event, "parent");
                        this.addChildren(objects, index == null ? item.data : parent, index);
                        this.controller.dragDropIndicator.remove();
                        break;
                }
            };
            this.hndDragLeave = (_event) => {
                let relatedTarget = _event.relatedTarget;
                if (relatedTarget instanceof HTMLElement && !this.contains(relatedTarget) && !this.contains(relatedTarget.offsetParent)) // offset parent is for weird (invisible) divs which are placed over input elements and trigger leave events... 
                    this.controller.dragDropIndicator.remove();
            };
            this.hndDelete = async (_event) => {
                let target = _event.target;
                _event.stopPropagation();
                let remove = await this.controller.delete([target.data]);
                this.delete(remove);
            };
            this.hndEscape = (_event) => {
                this.clearSelection();
            };
            this.hndCopyPaste = async (_event) => {
                ƒ.Debug.fudge(_event);
                // _event.stopPropagation();
                let target = _event.target;
                switch (_event.type) {
                    case "copy" /* EVENT.COPY */:
                        this.controller.copy(this.getFocussed(), _event.type);
                        break;
                    case "cut" /* EVENT.CUT */:
                        let cut = await this.controller.cut(this.getFocussed(), _event.type);
                        // let cut: T[] = await this.controller.delete(this.controller.selection);
                        this.delete(cut);
                        break;
                    case "paste" /* EVENT.PASTE */:
                        _event.stopPropagation();
                        let objects = await this.controller.paste();
                        if (this.controller.canAddChildren(objects, target.data)) {
                            this.addChildren(objects, target.data);
                            this.parentElement.dispatchEvent(new Event("paste" /* EVENT.PASTE */, { bubbles: true }));
                        }
                        break;
                }
            };
            this.hndFocus = (_event) => {
                _event.stopPropagation();
                let items = Array.from(this.querySelectorAll("li"));
                let target = _event.target;
                let index = items.indexOf(target);
                if (index < 0)
                    return;
                if (_event.shiftKey && this.controller.selection.length == 0)
                    target.select(true);
                switch (_event.type) {
                    case "focusNext" /* EVENT.FOCUS_NEXT */:
                        if (++index < items.length)
                            items[index].focus();
                        break;
                    case "focusPrevious" /* EVENT.FOCUS_PREVIOUS */:
                        if (--index >= 0)
                            items[index].focus();
                        break;
                    default:
                        break;
                }
                if (_event.shiftKey)
                    document.activeElement.select(true);
                else if (!_event.ctrlKey)
                    this.clearSelection();
            };
            let root = new FudgeUserInterface.TreeItem(this.controller, _root);
            this.appendChild(root);
            this.addEventListener("expand" /* EVENT.EXPAND */, this.hndExpand);
            this.addEventListener("itemselect" /* EVENT.SELECT */, this.hndSelect);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDragDrop);
            this.addEventListener("dragleave" /* EVENT.DRAG_LEAVE */, this.hndDragLeave);
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragDrop);
            // @ts-ignore
            this.addEventListener("focusNext" /* EVENT.FOCUS_NEXT */, this.hndFocus);
            // @ts-ignore
            this.addEventListener("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, this.hndFocus);
        }
        /**
         * Clear the current selection
         */
        clearSelection() {
            this.controller.selection.splice(0);
            this.displaySelection(this.controller.selection);
        }
        /**
         * Return the object in focus or null if none is focussed
         */
        getFocussed() {
            let items = Array.from(this.querySelectorAll("li"));
            let found = items.indexOf(document.activeElement);
            if (found > -1)
                return items[found].data;
            return null;
        }
        /**
         * Refresh the whole tree to synchronize with the data the tree is based on
         */
        refresh() {
            for (const item of this) {
                if (!item.expanded)
                    continue;
                let branch = this.createBranch(this.controller.getChildren(item.data));
                item.getBranch().restructure(branch);
                if (!this.controller.hasChildren(item.data))
                    item.expand(false);
            }
        }
        /**
         * Adds the given children to the given target at the given index. If no index is given, the children are appended at the end of the list.
         */
        addChildren(_children, _target, _index) {
            // if drop target included in children -> refuse
            if (_children.indexOf(_target) > -1)
                return;
            // add only the objects the addChildren-method of the controller returns
            let move = this.controller.addChildren(_children, _target, _index);
            if (!move || move.length == 0)
                return;
            let focus = this.getFocussed();
            // TODO: don't, when copying or coming from another source
            this.delete(move);
            let targetData = _target;
            let targetItem = this.findVisible(targetData);
            let branch = this.createBranch(this.controller.getChildren(targetData));
            let old = targetItem.getBranch();
            targetItem.hasChildren = true;
            if (old)
                old.restructure(branch);
            else
                targetItem.expand(true);
            this.findVisible(focus)?.focus();
        }
        hndExpand(_event) {
            let item = _event.target;
            let children = this.controller.getChildren(item.data);
            if (!children || children.length == 0)
                return;
            let branch = this.createBranch(children);
            item.setBranch(branch);
            this.displaySelection(this.controller.selection);
        }
        createBranch(_data) {
            let branch = new FudgeUserInterface.TreeList(this.controller, []);
            for (let child of _data) {
                branch.addItems([new FudgeUserInterface.TreeItem(this.controller, child)]);
            }
            return branch;
        }
        // Callback / Eventhandler in Tree
        hndSelect(_event) {
            // _event.stopPropagation();
            let detail = _event.detail;
            let index = this.controller.selection.indexOf(detail.data);
            if (detail.interval) {
                let dataStart = this.controller.selection[0];
                let dataEnd = detail.data;
                this.clearSelection();
                this.selectInterval(dataStart, dataEnd);
                return;
            }
            if (index >= 0 && detail.additive)
                this.controller.selection.splice(index, 1);
            else {
                if (!detail.additive)
                    this.clearSelection();
                this.controller.selection.push(detail.data);
            }
            this.displaySelection(this.controller.selection);
        }
    }
    FudgeUserInterface.Tree = Tree;
    customElements.define("ul-tree", Tree, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="../DataController.ts"/>
var FudgeUserInterface;
///<reference path="../DataController.ts"/>
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a {@link Tree} to display and manipulate it.
     * The {@link Tree} doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class TreeController extends FudgeUserInterface.DataController {
        constructor() {
            super(...arguments);
            /** Used by the tree to indicate the drop position while dragging */
            this.dragDropIndicator = document.createElement("hr");
            /** Override to enable tree items to be sortable by the user via drag-and-drop. Default is true. */
            this.sortable = true;
        }
        /**
         * Override if some objects should not be draggable
         */
        draggable(_object) {
            return true;
        }
        /**
         * Checks if two objects of are equal. Default is _a == _b. Override for more complex comparisons.
         * Useful when the underlying data is volatile and changes identity while staying the same.
         */
        equals(_a, _b) {
            return _a == _b;
        }
        /**
         * Override if some objects should not be addable to others
         */
        canAddChildren(_sources, _target) {
            return true;
        }
    }
    FudgeUserInterface.TreeController = TreeController;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Extension of li-element that represents an object in a {@link TreeList} with a checkbox and user defined input elements as content.
     * Additionally, may hold an instance of {@link TreeList} as branch to display children of the corresponding object.
     */
    class TreeItem extends HTMLLIElement {
        #content;
        constructor(_controller, _data) {
            super();
            this.classes = [];
            this.data = null;
            this.hndFocus = (_event) => {
                _event.stopPropagation();
                if (_event.target == this.checkbox)
                    return;
                if (_event.target == this)
                    return;
                this.#content.disabled = true;
            };
            this.hndKey = (_event) => {
                _event.stopPropagation();
                if (!this.#content.disabled) {
                    if (_event.code == ƒ.KEYBOARD_CODE.ESC || _event.code == ƒ.KEYBOARD_CODE.ENTER)
                        this.focus();
                    return;
                }
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                        if (this.hasChildren && !this.expanded)
                            this.expand(true);
                        else
                            this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                        if (this.expanded)
                            this.expand(false);
                        else
                            this.dispatchEvent(new KeyboardEvent("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                        this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_UP:
                        this.dispatchEvent(new KeyboardEvent("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.F2:
                        const element = this.#content.elements.item(0);
                        if (!element)
                            break;
                        this.#content.disabled = false;
                        element.focus();
                        break;
                    case ƒ.KEYBOARD_CODE.SPACE:
                        this.select(_event.ctrlKey, _event.shiftKey);
                        break;
                    case ƒ.KEYBOARD_CODE.ESC:
                        this.dispatchEvent(new Event("escape" /* EVENT.ESCAPE */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.DELETE:
                        this.dispatchEvent(new Event("delete" /* EVENT.DELETE */, { bubbles: true }));
                        break;
                    case ƒ.KEYBOARD_CODE.C:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("copy" /* EVENT.COPY */, { bubbles: true }));
                        }
                        break;
                    case ƒ.KEYBOARD_CODE.V:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("paste" /* EVENT.PASTE */, { bubbles: true }));
                        }
                        break;
                    case ƒ.KEYBOARD_CODE.X:
                        if (_event.ctrlKey || _event.metaKey) {
                            _event.preventDefault();
                            this.dispatchEvent(new Event("cut" /* EVENT.CUT */, { bubbles: true }));
                        }
                        break;
                }
            };
            this.hndDblClick = (_event) => {
                _event.stopPropagation();
                if (_event.target == this.checkbox)
                    return;
                this.#content.disabled = false;
                const element = document.elementFromPoint(_event.pageX, _event.pageY); // disabled elements don't dispatch click events, get the element manually
                if (!element)
                    return;
                element.focus();
            };
            this.hndChange = async (_event) => {
                let target = _event.target;
                _event.stopPropagation();
                if (target instanceof HTMLInputElement && target.type == "checkbox") {
                    this.expand(target.checked);
                    return;
                }
                let renamed = await this.controller.setValue(this.data, target);
                this.refreshContent();
                this.refreshAttributes();
                if (renamed)
                    this.dispatchEvent(new CustomEvent("rename" /* EVENT.RENAME */, { bubbles: true, detail: { data: this.data } }));
            };
            this.hndDragDrop = (_event) => {
                // if (_event.type == EVENT.DROP)
                //   debugger;
                if (Reflect.get(_event, "item"))
                    return;
                // store the dragged item in the event for further processing in table
                Reflect.set(_event, "item", this);
            };
            this.hndDragOver = (_event) => {
                if (Reflect.get(_event, "dragProcessed"))
                    return;
                let rect = this.#content.getBoundingClientRect();
                let upper = rect.top + rect.height * (1 / 4);
                let lower = rect.top + rect.height * (3 / 4);
                let offset = _event.clientY;
                if (this.parentElement instanceof FudgeUserInterface.Tree || (offset > upper && (offset < lower || this.checkbox.checked)) || !this.controller.sortable) {
                    Reflect.set(_event, "dragProcessed", true);
                    if (_event.type == "dragover" /* EVENT.DRAG_OVER */)
                        this.controller.dragDropIndicator.remove();
                    if (this.controller.canAddChildren(FudgeUserInterface.Clipboard.dragDrop.get(), this.data)) {
                        _event.preventDefault();
                        _event.dataTransfer.dropEffect = "move";
                    }
                }
            };
            this.hndPointerUp = (_event) => {
                _event.stopPropagation();
                if (_event.target == this.checkbox)
                    return;
                this.select(_event.ctrlKey, _event.shiftKey);
            };
            this.hndRemove = (_event) => {
                // the views might need to know about this event
                // if (_event.currentTarget == _event.target)
                //   return;
                // _event.stopPropagation();
                this.hasChildren = this.controller.hasChildren(this.data);
            };
            this.controller = _controller;
            this.data = _data;
            // TODO: handle cssClasses
            this.create();
            this.hasChildren = this.controller.hasChildren(_data);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            this.addEventListener("dblclick" /* EVENT.DOUBLE_CLICK */, this.hndDblClick);
            this.addEventListener("focusout" /* EVENT.FOCUS_OUT */, this.hndFocus);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            // this.addEventListener(EVENT_TREE.FOCUS_NEXT, this.hndFocus);
            // this.addEventListener(EVENT_TREE.FOCUS_PREVIOUS, this.hndFocus);
            this.draggable = this.controller.draggable(_data);
            // this.addEventListener(EVENT.DRAG_START, this.hndDragStart);
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
            this.addEventListener("dragenter" /* EVENT.DRAG_ENTER */, this.hndDragOver); // this prevents cursor from flickering
            this.addEventListener("dragenter" /* EVENT.DRAG_ENTER */, this.hndDragDrop); // this prevents cursor from flickering
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragDrop);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDragDrop);
            this.addEventListener("pointerup" /* EVENT.POINTER_UP */, this.hndPointerUp);
            this.addEventListener("removeChild" /* EVENT.REMOVE_CHILD */, this.hndRemove);
        }
        /**
         * Returns true, when this item has a visible checkbox in front to expand the subsequent branch
         */
        get hasChildren() {
            return this.checkbox.style.visibility != "hidden";
        }
        /**
         * Shows or hides the checkbox for expanding the subsequent branch
         */
        set hasChildren(_has) {
            this.checkbox.style.visibility = _has ? "visible" : "hidden";
        }
        /**
         * Returns true if the {@link CSS_CLASS.SELECTED} is attached to this item
         */
        get selected() {
            return this.classList.contains(FudgeUserInterface.CSS_CLASS.SELECTED);
        }
        /**
         * Attaches or detaches the {@link CSS_CLASS.SELECTED} to this item
         */
        set selected(_on) {
            if (_on)
                this.classList.add(FudgeUserInterface.CSS_CLASS.SELECTED);
            else
                this.classList.remove(FudgeUserInterface.CSS_CLASS.SELECTED);
        }
        /**
         * Returns the content representing the attached {@link data}
         */
        get content() {
            return this.#content;
        }
        /**
         * Returns whether this item is expanded, showing it's children, or closed
         */
        get expanded() {
            return this.getBranch() && this.checkbox.checked;
        }
        refreshAttributes() {
            this.setAttribute("attributes", this.controller.getAttributes(this.data));
        }
        refreshContent() {
            this.#content.innerHTML = "";
            this.#content.appendChild(this.controller.createContent(this.data));
            this.#content.disabled = true;
            for (const descendant of this.#content.querySelectorAll("[title]"))
                this.title += descendant.title + "\n";
        }
        /**
         * Tries to expanding the {@link TreeList} of children, by dispatching {@link EVENT.EXPAND}.
         * The user of the tree needs to add an event listener to the tree
         * in order to create that {@link TreeList} and add it as branch to this item
         */
        expand(_expand) {
            this.removeBranch();
            if (_expand)
                this.dispatchEvent(new Event("expand" /* EVENT.EXPAND */, { bubbles: true }));
            this.checkbox.checked = _expand;
            this.hasChildren = this.controller.hasChildren(this.data);
            // (<HTMLInputElement>this.querySelector("input[type='checkbox']")).checked = _expand;
        }
        /**
         * Returns a list of all data referenced by the items succeeding this
         */
        getVisibleData() {
            let list = this.querySelectorAll("li");
            let data = [];
            for (let item of list)
                data.push(item.data);
            return data;
        }
        /**
         * Sets the branch of children of this item. The branch must be a previously compiled {@link TreeList}
         */
        setBranch(_branch) {
            this.removeBranch();
            if (_branch)
                this.appendChild(_branch);
        }
        /**
         * Returns the branch of children of this item.
         */
        getBranch() {
            return this.querySelector("ul");
        }
        /**
         * Dispatches the {@link EVENT.SELECT} event
         * @param _additive For multiple selection (+Ctrl)
         * @param _interval For selection over interval (+Shift)
         */
        select(_additive, _interval = false) {
            let event = new CustomEvent("itemselect" /* EVENT.SELECT */, { bubbles: true, detail: { data: this.data, additive: _additive, interval: _interval } });
            this.dispatchEvent(event);
        }
        /**
         * Removes the branch of children from this item
         */
        removeBranch() {
            let branch = this.getBranch();
            if (!branch)
                return;
            this.removeChild(branch);
        }
        create() {
            this.checkbox = document.createElement("input");
            this.checkbox.type = "checkbox";
            this.appendChild(this.checkbox);
            this.#content = document.createElement("fieldset");
            this.appendChild(this.#content);
            this.refreshContent();
            this.refreshAttributes();
            this.tabIndex = 0;
        }
    }
    FudgeUserInterface.TreeItem = TreeItem;
    customElements.define("li-tree-item", TreeItem, { extends: "li" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Q29tYm9TZWxlY3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnREaWdpdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50TWF0cml4M3gzLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50TWF0cml4NHg0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50T3V0cHV0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50U2VsZWN0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50U3RlcHBlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFRleHRJbnB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGF0YUNvbnRyb2xsZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHNBcnJheS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGlhbG9nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9NdWx0aUxldmVsTWVudS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvV2FybmluZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVMaXN0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUNvbnRyb2xsZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9FdmVudC9FdmVudC50cyJdLCJuYW1lcyI6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UUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pKLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ssWUFBWTtZQUNsQixJQUFJLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNO2dCQUNULE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFTyxNQUFNO1lBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7S0EwSkY7SUFqVVksMkJBQVEsV0FpVXBCLENBQUE7SUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyRSxDQUFDLEVBM1VTLGtCQUFrQixLQUFsQixrQkFBa0IsUUEyVTNCIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQ29tbW9uIGNsaXBib2FyZHMgZm9yIGFsbCBkcmFnLWRyb3AgYW5kIGNvcHktcGFzdGUgb3BlcmF0aW9ucyBoYXBwZW5pbmcgaW4gdGhlIHVzZXIgaW50ZXJmYWNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgZXhwb3J0IHR5cGUgQ2xpcE9wZXJhdGlvbiA9IEVWRU5ULkNPUFkgfCBFVkVOVC5DVVQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDbGlwYm9hcmQge1xyXG4gICAgcHVibGljIHN0YXRpYyBkcmFnRHJvcDogQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5UGFzdGU6IENsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoKTtcclxuICAgIHB1YmxpYyBvYmplY3RzOiDGki5HZW5lcmFsW10gPSBbXTtcclxuICAgIHB1YmxpYyBvcGVyYXRpb246IENsaXBPcGVyYXRpb247XHJcblxyXG4gICAgcHVibGljIGdldDxUPigpOiBUW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vYmplY3RzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldChfb2JqZWN0czogT2JqZWN0W10sIF9vcGVyYXRpb24/OiBDbGlwT3BlcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgIHRoaXMub2JqZWN0cyA9IF9vYmplY3RzLnNsaWNlKCk7XHJcbiAgICAgIHRoaXMub3BlcmF0aW9uID0gX29wZXJhdGlvbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIi8+IC8vIFRPRE86IG5vdyB0aGF0IHdlIHVzZSBwYWNrYWdlIHJlZmVyZW5jZXMgaW4gdGhlIHRzY29uZmlnLCB0aGlzIGZpbGUgaXMgb2Jzb2xldGUiLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbm5lY3RzIGEgW1tNdXRhYmxlXV0gdG8gYSBET00tRWxlbWVudCBhbmQgc3luY2hyb25pemVzIHRoYXQgbXV0YWJsZSB3aXRoIHRoZSBtdXRhdG9yIHN0b3JlZCB3aXRoaW4uXHJcbiAgICogVXBkYXRlcyB0aGUgbXV0YWJsZSBvbiBpbnRlcmFjdGlvbiB3aXRoIHRoZSBlbGVtZW50IGFuZCB0aGUgZWxlbWVudCBpbiB0aW1lIGludGVydmFscy5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgICAvLyBUT0RPOiBleGFtaW5lIHRoZSB1c2Ugb2YgdGhlIGF0dHJpYnV0ZSBrZXkgdnMgbmFtZS4gS2V5IHNpZ25hbHMgdGhlIHVzZSBieSBGVURHRSB3aGlsZSBuYW1lIGlzIHN0YW5kYXJkIGFuZCBzdXBwb3J0ZWQgYnkgZm9ybXNcclxuICAgIHB1YmxpYyBkb21FbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCB0aW1lVXBkYXRlOiBudW1iZXIgPSAxOTA7XHJcbiAgICBwcm90ZWN0ZWQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjtcclxuXHJcbiAgICBwcml2YXRlIGlkSW50ZXJ2YWw6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQgPSBfZG9tRWxlbWVudDtcclxuICAgICAgdGhpcy5zZXRNdXRhYmxlKF9tdXRhYmxlKTtcclxuICAgICAgLy8gVE9ETzogZXhhbWluZSwgaWYgdGhpcyBzaG91bGQgcmVnaXN0ZXIgdG8gb25lIGNvbW1vbiBpbnRlcnZhbCwgaW5zdGVhZCBvZiBlYWNoIGluc3RhbGxpbmcgaXRzIG93bi5cclxuICAgICAgdGhpcy5zdGFydFJlZnJlc2goKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIHRoaXMubXV0YXRlT25JbnB1dCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFQVJSQU5HRV9BUlJBWSwgdGhpcy5yZWFycmFuZ2VBcnJheSk7XHJcbiAgICAgIC8vIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFVF9WQUxVRSwgdGhpcy5zZXRWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyBhbiBleGlzdGluZyBbW8aSLk11dGF0b3JdXSBhcyBhIHRlbXBsYXRlIFxyXG4gICAgICogYW5kIHVwZGF0aW5nIGl0cyB2YWx1ZXMgd2l0aCB0aG9zZSBmb3VuZCBpbiB0aGUgZ2l2ZW4gVUktZG9tRWxlbWVudC4gXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlTXV0YXRvcihfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yOiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+Q29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlIGlmIChfbXV0YXRvcltrZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihlbGVtZW50LCBfbXV0YXRvcltrZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIF9tdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCB0YWtpbmcgdGhlIGEgW1vGki5NdXRhYmxlXV0gYXMgYSB0ZW1wbGF0ZSB0byBjcmVhdGUgYSBbW8aSLk11dGF0b3JdXSBvciB1cGRhdGUgdGhlIGdpdmVuIFtbxpIuTXV0YXRvcl1dIFxyXG4gICAgICogd2l0aCB0aGUgdmFsdWVzIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TXV0YXRvcihfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheSwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yKHRydWUpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBDb250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBpZiAoc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSB8fCBzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICAgICAgbXV0YXRvcltrZXldID0gdGhpcy5nZXRNdXRhdG9yKHN1Yk11dGFibGUsIGVsZW1lbnQsIG11dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBbW8aSLk11dGF0b3JdXSBvZiBhIFtbxpIuTXV0YWJsZV1dIGFuZCB1cGRhdGluZyB0aGUgVUktZG9tRWxlbWVudCBhY2NvcmRpbmdseS5cclxuICAgICAqIElmIGFuIGFkZGl0aW9uYWwgW1vGki5NdXRhdG9yXV0gaXMgcGFzc2VkLCBpdHMgdmFsdWVzIGFyZSB1c2VkIGluc3RlYWQgb2YgdGhvc2Ugb2YgdGhlIFtbxpIuTXV0YWJsZV1dLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvcih0cnVlKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgc3ViTXV0YWJsZTogxpIuTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZShzdWJNdXRhYmxlLCBlbGVtZW50LCBtdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPCAyKVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50c1swXTtcclxuXHJcbiAgICAgIGxldCBzaG9ydGVzdFBhdGg6IG51bWJlciA9IEluZmluaXR5O1xyXG4gICAgICBsZXQgY2xvc2VzdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBwYXJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDsgcGFyZW50RWxlbWVudCAhPSBfZG9tRWxlbWVudDsgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgaWYgKGNvdW50IDwgc2hvcnRlc3RQYXRoKSB7XHJcbiAgICAgICAgICBjbG9zZXN0RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBzaG9ydGVzdFBhdGggPSBjb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjbG9zZXN0RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcihfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCwgX211dGF0b3IsIF90eXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIENvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSh0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGFibGUoKTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11dGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5tdXRhYmxlID0gX211dGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0UmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucmVmcmVzaCwgdGhpcy50aW1lVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRlT25JbnB1dCA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IHRoaXMuZ2V0TXV0YXRvclBhdGgoX2V2ZW50KTtcclxuICAgICAgLy8gZ2V0IGN1cnJlbnQgbXV0YXRvciBhbmQgc2F2ZSBmb3IgdW5kb1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMubXV0YWJsZS5nZXRNdXRhdG9yKHRydWUpO1xyXG4gICAgICAvLyDGki5EZWJ1Zy5pbmZvKG11dGF0b3IpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0FWRV9ISVNUT1JZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBoaXN0b3J5OiAwLCBtdXRhYmxlOiB0aGlzLm11dGFibGUsIG11dGF0b3I6IMaSLk11dGF0b3IuZnJvbVBhdGgobXV0YXRvciwgcGF0aCkgfSB9KSk7XHJcblxyXG4gICAgICAvLyBnZXQgY3VycmVudCBtdXRhdG9yIGZyb20gaW50ZXJmYWNlIGZvciBtdXRhdGlvbiAgIFxyXG4gICAgICBtdXRhdG9yID0gdGhpcy5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUoxpIuTXV0YXRvci5mcm9tUGF0aChtdXRhdG9yLCBwYXRoKSk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFycmFuZ2VBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnNlcXVlbmNlO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4gPSB0aGlzLmdldFRhcmdldChwYXRoKTtcclxuXHJcbiAgICAgIC8vIHJlYXJyYW5nZSB0aGF0IG11dGFibGVcclxuICAgICAgKDzGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4+PHVua25vd24+dGFyZ2V0KS5yZWFycmFuZ2Uoc2VxdWVuY2UpO1xyXG4gICAgICBhd2FpdCB0aGlzLm11dGFibGUubXV0YXRlKHRoaXMubXV0YWJsZS5nZXRNdXRhdG9yKCkpOyAvLyBUT0RPOiByZWFycmFuZ2VtZW50IGlzIG5vdCBhIG11dGF0aW9uIHNvIGRpc3BhdGNoaW5nIHRoaXMgbXV0YXRlIGlzIGlycml0YXRpbmcuLi5cclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlZnJlc2ggPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmRvbUVsZW1lbnQpKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcm90ZWN0ZWQgc2V0VmFsdWUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBjb25zdCBwYXRoOiBzdHJpbmdbXSA9IHRoaXMuZ2V0TXV0YXRvclBhdGgoX2V2ZW50KTtcclxuICAgIC8vICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XHJcbiAgICAvLyAgIGNvbnN0IHRhcmdldDogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgudG9TcGxpY2VkKHBhdGgubGVuZ3RoIC0gMSkpO1xyXG4gICAgLy8gICBjb25zdCBpbnB1dDogc3RyaW5nID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5pbnB1dDtcclxuXHJcbiAgICAvLyAgIGNvbnN0IG11dGF0b3JPcHRpb25zOiDGki5NdXRhdG9yT3B0aW9ucyA9IMaSLk11dGF0b3Iub3B0aW9ucyh0YXJnZXQpO1xyXG4gICAgLy8gICBjb25zdCBnZXRPcHRpb25zOiAodGhpczogb2JqZWN0LCBfa2V5OiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0gbXV0YXRvck9wdGlvbnNba2V5XTtcclxuXHJcbiAgICAvLyAgIGlmICghZ2V0T3B0aW9ucylcclxuICAgIC8vICAgICByZXR1cm47XHJcblxyXG4gICAgLy8gICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IGdldE9wdGlvbnMuY2FsbCh0YXJnZXQsIGtleSk7XHJcblxyXG4gICAgLy8gICBjb25zdCBpbmNvbWluZzogdW5rbm93biA9IG9wdGlvbnNbaW5wdXRdO1xyXG4gICAgLy8gICBjb25zdCBjdXJyZW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xyXG5cclxuICAgIC8vICAgaWYgKGluY29taW5nID09IGN1cnJlbnQpXHJcbiAgICAvLyAgICAgcmV0dXJuO1xyXG5cclxuICAgIC8vICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNBVkVfSElTVE9SWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgaGlzdG9yeTogMywgbXV0YWJsZTogdGFyZ2V0LCBtdXRhdG9yOiB7IFtrZXldOiBjdXJyZW50IH0gfSB9KSk7XHJcblxyXG4gICAgLy8gICBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgaW5jb21pbmcpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICAvLyBwcm90ZWN0ZWQgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIC8vICAgY29uc3QgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcblxyXG4gICAgLy8gICAvLyBnZXQgY3VycmVudCBzdGF0ZSBmb3IgdW5kb1xyXG4gICAgLy8gICBjb25zdCBtdXRhdG9yOiDGki5NdXRhdG9yID0gdGhpcy5tdXRhYmxlLmdldE11dGF0b3IoKTtcclxuICAgIC8vICAgY29uc3QgY3VycmVudDogxpIuTXV0YXRvciA9IMaSLk11dGF0b3IuZnJvbVBhdGgobXV0YXRvciwgcGF0aCk7XHJcblxyXG4gICAgLy8gICAvLyBnZXQgaW5jb21pbmcgc3RhdGUgZnJvbSBpbnRlcmZhY2UgZm9yIG11dGF0aW9uXHJcbiAgICAvLyAgIGNvbnN0IGluY29taW5nOiDGki5NdXRhdG9yID0gQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMubXV0YWJsZSwgdGhpcy5kb21FbGVtZW50LCDGki5NdXRhdG9yLmNsb25lKGN1cnJlbnQpKTtcclxuXHJcbiAgICAvLyAgIC8vIGNvbXBhcmUgdGhlIGFjdHVhbCBtdXRhdGlvblxyXG4gICAgLy8gICBsZXQgYTogxpIuR2VuZXJhbCA9IGN1cnJlbnQ7XHJcbiAgICAvLyAgIGxldCBiOiDGki5HZW5lcmFsID0gaW5jb21pbmc7XHJcbiAgICAvLyAgIGZvciAoY29uc3Qga2V5IG9mIHBhdGgpIHtcclxuICAgIC8vICAgICBhID0gYVtrZXldO1xyXG4gICAgLy8gICAgIGIgPSBiW2tleV07XHJcbiAgICAvLyAgIH1cclxuXHJcbiAgICAvLyAgIGlmIChhID09IGIpXHJcbiAgICAvLyAgICAgcmV0dXJuO1xyXG5cclxuICAgIC8vICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNBVkVfSElTVE9SWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbXV0YWJsZTogdGhpcy5tdXRhYmxlLCBtdXRhdG9yOiBjdXJyZW50IH0gfSkpO1xyXG4gICAgLy8gICBhd2FpdCB0aGlzLm11dGFibGUubXV0YXRlKGluY29taW5nKTtcclxuICAgIC8vICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIC8vICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULk1VVEFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIC8vIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRNdXRhdG9yUGF0aChfZXZlbnQ6IEV2ZW50KTogc3RyaW5nW10ge1xyXG4gICAgICBjb25zdCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBfZXZlbnQuY29tcG9zZWRQYXRoKCkpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IHRoaXMuZG9tRWxlbWVudClcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+dGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGtleSlcclxuICAgICAgICAgIHBhdGgucHVzaChrZXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUYXJnZXQ8VCA9IHVua25vd24+KF9wYXRoOiBzdHJpbmdbXSk6IFQge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBvYmplY3QgPSB0aGlzLm11dGFibGU7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgb2YgX3BhdGgpXHJcbiAgICAgICAgdGFyZ2V0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xyXG5cclxuICAgICAgcmV0dXJuIDxUPnRhcmdldDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyBnZW5lcmF0aW5nIFVJLWRvbUVsZW1lbnRzIGZyb20gdGhlIGluZm9ybWF0aW9uIGZvdW5kIGluIFtbxpIuTXV0YWJsZV1dcyBhbmQgW1vGki5NdXRhdG9yXV1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBbW0NvbnRyb2xsZXJdXSBmcm9tIGEgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHdpdGggZXhwYW5kYWJsZSBkZXRhaWxzIG9yIGEgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvbnRyb2xsZXIoX211dGFibGU6IMaSLk11dGFibGUsIF9uYW1lPzogc3RyaW5nKTogQ29udHJvbGxlciB7XHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoX211dGFibGUsIEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoX211dGFibGUsIF9uYW1lKSk7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBleHRlbmRhYmxlIGRldGFpbHMgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX25hbWU/OiBzdHJpbmcsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IERldGFpbHMgfCBEZXRhaWxzQXJyYXkge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gX25hbWUgfHwgX211dGFibGUuY29uc3RydWN0b3IubmFtZTtcclxuXHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzIHwgRGV0YWlsc0FycmF5O1xyXG4gICAgICBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgZGV0YWlscyA9IG5ldyBEZXRhaWxzQXJyYXkobmFtZSk7XHJcbiAgICAgIGVsc2UgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHMobmFtZSwgX211dGFibGUudHlwZSk7XHJcbiAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlLCBfbXV0YXRvcikpO1xyXG4gICAgICByZXR1cm4gZGV0YWlscztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50cyBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvcih0cnVlKTtcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvclR5cGVzID0gxpIuTXV0YXRvci5nZXRUeXBlcyhfbXV0YWJsZSwgbXV0YXRvcik7XHJcbiAgICAgIGxldCBtdXRhdG9yT3B0aW9uczogxpIuTXV0YXRvck9wdGlvbnMgPSDGki5NdXRhdG9yLm9wdGlvbnMoX211dGFibGUpO1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gbXV0YXRvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogdW5rbm93biA9IG11dGF0b3Jba2V5XTtcclxuICAgICAgICBsZXQgdHlwZTogRnVuY3Rpb24gfCBvYmplY3QgPSBtdXRhdG9yVHlwZXNba2V5XTtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCB0eXBlLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCAmJiBtdXRhdG9yT3B0aW9uc1trZXldKVxyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50Q29tYm9TZWxlY3QoeyBrZXk6IGtleSwgbGFiZWw6IGtleSwgdHlwZTogKDxGdW5jdGlvbj50eXBlKS5uYW1lIH0sIF9tdXRhYmxlLCBtdXRhdG9yT3B0aW9uc1trZXldKTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoc3ViTXV0YWJsZSwga2V5LCA8xpIuTXV0YXRvcj52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHsgLy8gdW5kZWZpbmVkIHZhbHVlcyB3aXRob3V0IGEgdHlwZSBjYW4ndCBiZSBkaXNwbGF5ZWRcclxuICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGludGVyZmFjZSBjcmVhdGVkIGZvclwiLCBfbXV0YWJsZS5jb25zdHJ1Y3Rvci5uYW1lLCBrZXkpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50IGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBcclxuICAgICAqIERvZXMgbm90IHN1cHBvcnQgbmVzdGVkIG11dGF0b3JzIVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogdW5rbm93biA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKGtleSwgXCJEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCB2YWx1ZS5jb25zdHJ1Y3RvciwgdmFsdWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHNwZWNpZmljIEN1c3RvbUVsZW1lbnQgZm9yIHRoZSBnaXZlbiBkYXRhLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBlbGVtZW50IGlzIHtAbGluayBDdXN0b21FbGVtZW50LnJlZ2lzdGVyIHJlZ2lzdGVyZWR9IGZvciB0aGUgZ2l2ZW4gdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5OiBzdHJpbmcsIF90eXBlOiBGdW5jdGlvbiB8IG9iamVjdCwgX3ZhbHVlOiBPYmplY3QpOiBDdXN0b21FbGVtZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQ7XHJcbiAgICAgIGxldCBlbGVtZW50VHlwZTogbmV3ICguLi5fYXJnczogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBDdXN0b21FbGVtZW50PikgPT4gQ3VzdG9tRWxlbWVudDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAodHlwZW9mIF90eXBlID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgZWxlbWVudFR5cGUgPSBDdXN0b21FbGVtZW50LmdldChfdHlwZSk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudFR5cGUpXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBuZXcgZWxlbWVudFR5cGUoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5LCB2YWx1ZTogX3ZhbHVlPy50b1N0cmluZygpIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIF90eXBlID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgIGVsZW1lbnRUeXBlID0gQ3VzdG9tRWxlbWVudC5nZXQoT2JqZWN0KTtcclxuICAgICAgICAgIGVsZW1lbnQgPSBuZXcgZWxlbWVudFR5cGUoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5LCB2YWx1ZTogX3ZhbHVlPy50b1N0cmluZygpIH0sIF90eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLmZ1ZGdlKF9lcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RydWN0dXJlIGZvciB0aGUgYXR0cmlidXRlcyB0byBzZXQgaW4gYSBDdXN0b21FbGVtZW50LlxyXG4gICAqIGtleSAobWF5YmUgcmVuYW1lIHRvIGBuYW1lYCkgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IG1hdGNoIHRoZSBrZXkgb2YgYSBtdXRhdG9yIGlmIHVzZWQgaW4gY29uanVuY3Rpb25cclxuICAgKiBsYWJlbCBpcyByZWNvbW1lbmRlZCBmb3IgbGFiZWxsZWQgZWxlbWVudHMsIGtleSBpcyB1c2VkIGlmIG5vdCBnaXZlbi5cclxuICAgKi9cclxuICBleHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzIHtcclxuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGxhYmVsPzogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgbWFwcGluZyBvZiBDdXN0b21FbGVtZW50cyB0byB0aGVpciBIVE1MLVRhZ3MgdmlhIGN1c3RvbUVsZW1lbnQuZGVmaW5lXHJcbiAgICogYW5kIHRvIHRoZSBkYXRhIHR5cGVzIGFuZCBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1zIHRoZXkgcmVuZGVyIGFuIGludGVyZmFjZSBmb3IuIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyB0YWc6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIG1hcFR5cGVUb0N1c3RvbUVsZW1lbnQ6IE1hcDxGdW5jdGlvbiwgdHlwZW9mIEN1c3RvbUVsZW1lbnQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzLCAuLi5fYXJnczogdW5rbm93bltdKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcylcclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIF9hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICBpZiAoX2F0dHJpYnV0ZXNbbmFtZV0gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBfYXR0cmlidXRlc1tuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgYW4gaWQgdG8gdXNlIGZvciBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnQsIG5lZWRlZCBlLmcuIGZvciBzdGFuZGFyZCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGdldCBuZXh0SWQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwixpJcIiArIEN1c3RvbUVsZW1lbnQuaWRDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBtYXAgdGhlIGdpdmVuIGVsZW1lbnQgdHlwZSB0byB0aGUgZ2l2ZW4gdGFnIGFuZCB0aGUgZ2l2ZW4gdHlwZSBvZiBkYXRhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZzogc3RyaW5nLCBfdHlwZUN1c3RvbUVsZW1lbnQ6IHR5cGVvZiBDdXN0b21FbGVtZW50LCBfdHlwZU9iamVjdD86IHR5cGVvZiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX3RhZywgX2NsYXNzKTtcclxuICAgICAgX3R5cGVDdXN0b21FbGVtZW50LnRhZyA9IF90YWc7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKF90YWcsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcblxyXG4gICAgICBpZiAoX3R5cGVPYmplY3QpXHJcbiAgICAgICAgQ3VzdG9tRWxlbWVudC5tYXAoX3R5cGVPYmplY3QsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGdpdmVuIGRhdGEgdHlwZSAoaWYgcmVnaXN0ZXJlZClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoX3R5cGU6IEZ1bmN0aW9uKTogdHlwZW9mIEN1c3RvbUVsZW1lbnQgJiAobmV3ICguLi5fYXJnczogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBDdXN0b21FbGVtZW50PikgPT4gQ3VzdG9tRWxlbWVudCkge1xyXG4gICAgICBsZXQgZWxlbWVudDogc3RyaW5nIHwgdHlwZW9mIEN1c3RvbUVsZW1lbnQgfCBDdXN0b21FbGVtZW50Q29uc3RydWN0b3IgPSBDdXN0b21FbGVtZW50Lm1hcFR5cGVUb0N1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgcmV0dXJuIDx0eXBlb2YgQ3VzdG9tRWxlbWVudCAmIChuZXcgKC4uLl9hcmdzOiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIEN1c3RvbUVsZW1lbnQ+KSA9PiBDdXN0b21FbGVtZW50KT5lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG1hcChfdHlwZTogRnVuY3Rpb24sIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoXCJNYXBcIiwgX3R5cGUsIF90eXBlQ3VzdG9tRWxlbWVudC5uYW1lKTtcclxuICAgICAgQ3VzdG9tRWxlbWVudC5tYXBUeXBlVG9DdXN0b21FbGVtZW50LnNldChfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUga2V5IChuYW1lKSBvZiB0aGUgYXR0cmlidXRlIHRoaXMgZWxlbWVudCByZXByZXNlbnRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQga2V5KCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGxhYmVsLWVsZW1lbnQgYXMgY2hpbGQgdG8gdGhpcyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBlbmRMYWJlbCgpOiBIVE1MTGFiZWxFbGVtZW50IHtcclxuICAgICAgbGV0IHRleHQ6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldExhYmVsKF9sYWJlbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBpZiAobGFiZWwpXHJcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSBfbGFiZWw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgdXNpbmcgYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIFJlZmxlY3Quc2V0KHRoaXMsIFwidmFsdWVcIiwgX3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogV29ya2Fyb3VuZCByZWNvbm5lY3Rpb24gb2YgY2xvbmUgKi9cclxuICAgIHB1YmxpYyBjbG9uZU5vZGUoX2RlZXA6IGJvb2xlYW4pOiBOb2RlIHtcclxuICAgICAgbGV0IGxhYmVsOiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IGNsb25lOiBDdXN0b21FbGVtZW50ID0gbmV3IHRoaXMuY29uc3RydWN0b3IobGFiZWwgPyB7IGxhYmVsOiBsYWJlbCB9IDogbnVsbCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xvbmUpO1xyXG4gICAgICBjbG9uZS5zZXRNdXRhdG9yVmFsdWUodGhpcy5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBvZiB0aGlzLmF0dHJpYnV0ZXMpXHJcbiAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xyXG4gICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHBpY2tlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgcGlja2VyLnR5cGUgPSBcImNvbG9yXCI7XHJcblxyXG4gICAgICBwaWNrZXIudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHBpY2tlcik7XHJcblxyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICBzbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHNsaWRlci5zdGVwID0gXCIwLjAxXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuICAgICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgb2YgcGlja2VyIGFuZCBzbGlkZXIgYXMgxpIuTXV0YXRvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWU7XHJcbiAgICAgIGxldCBhbHBoYTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbG9yLnNldEhleChoZXguc3Vic3RyKDEsIDYpICsgXCJmZlwiKTtcclxuICAgICAgdGhpcy5jb2xvci5hID0gcGFyc2VGbG9hdChhbHBoYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yLmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBjb2xvciBwaWNrZXIgYW5kIHNsaWRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbG9yLm11dGF0ZShfdmFsdWUpO1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSB0aGlzLmNvbG9yLnRvSGV4KCk7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZSA9IFwiI1wiICsgaGV4LnNsaWNlKDAsIDYpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWUgPSB0aGlzLmNvbG9yLmEudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleShfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KTtcclxuICAgICAgaWYgKHNsaWRlciAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoc2xpZGVyLnZhbHVlKTtcclxuICAgICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSAtIF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgc2xpZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudENvbWJvU2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWNvbWJvc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRDb21ib1NlbGVjdCk7XHJcblxyXG4gICAgLy8gdGhpcyBicmVhY2hlcyB0aGUgc2VwYXJhdGlvbiBvZiBjb25jZXJucyBvZiB2aWV3IGFuZCBjb250cm9sbGVyLCBidXQgaXQgaXMgdmVyeSBoYW5keSBpZiB0aGUgY3VzdG9tIGVsZW1lbnQgcmVmZXJlbmNlIGNhbiBnZXQgaXRzIG9wdGlvbnMgYnkgaXRzZWxmLlxyXG4gICAgI211dGFibGU6IG9iamVjdDtcclxuICAgICNnZXRPcHRpb25zOiAodGhpczogb2JqZWN0LCBfa2V5OiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIF9tdXRhYmxlOiBvYmplY3QsIF9nZXQ6ICh0aGlzOiBvYmplY3QsIF9rZXk6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICB0aGlzLiNtdXRhYmxlID0gX211dGFibGU7XHJcbiAgICAgIHRoaXMuI2dldE9wdGlvbnMgPSBfZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgZGF0YWxpc3Q6IEhUTUxEYXRhTGlzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGF0YWxpc3RcIik7XHJcbiAgICAgIGRhdGFsaXN0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChkYXRhbGlzdCk7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImxpc3RcIiwgZGF0YWxpc3QuaWQpO1xyXG4gICAgICBpbnB1dC5wbGFjZWhvbGRlciA9IGAke3RoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKX0uLi5gO1xyXG4gICAgICBpbnB1dC5zcGVsbGNoZWNrID0gZmFsc2U7XHJcbiAgICAgIGlucHV0Lm9uZm9jdXMgPSB0aGlzLmhuZEZvY3VzO1xyXG4gICAgICBpbnB1dC5vbmlucHV0ID0gdGhpcy5obmRJbnB1dDtcclxuICAgICAgaW5wdXQub25rZXl1cCA9IHRoaXMuaG5kS2V5O1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIGxldCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnV0dG9uLm9uY2xpY2sgPSB0aGlzLmhuZENsaWNrO1xyXG4gICAgICBidXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChidXR0b24pO1xyXG5cclxuICAgICAgdGhpcy5vbmNoYW5nZSA9IHRoaXMuaG5kQ2hhbmdlO1xyXG5cclxuICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUoUmVmbGVjdC5nZXQodGhpcy4jbXV0YWJsZSwgdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHVua25vd24ge1xyXG4gICAgICBjb25zdCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHRoaXMuZ2V0T3B0aW9ucygpO1xyXG4gICAgICByZXR1cm4gb3B0aW9uc1tpbnB1dC52YWx1ZV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHsgbmFtZT86IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmIChpbnB1dCA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBfdmFsdWUgPyBfdmFsdWUubmFtZSA/PyBfdmFsdWUudG9TdHJpbmcoKSA6IFwiXCI7XHJcblxyXG4gICAgICBjb25zdCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xyXG4gICAgICBidXR0b24uaGlkZGVuID0gIXZhbHVlO1xyXG5cclxuICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZENsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICAgIGJ1dHRvbi5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNIQU5HRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgZGF0YWxpc3Q6IEhUTUxEYXRhTGlzdEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJkYXRhbGlzdFwiKTtcclxuICAgICAgZGF0YWxpc3QuaW5uZXJIVE1MID0gXCJcIjsgLy8gY2xlYXIgcHJldmlvdXMgZW50cmllc1xyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHRoaXMuZ2V0T3B0aW9ucygpO1xyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IGtleTtcclxuICAgICAgICBkYXRhbGlzdC5hcHBlbmRDaGlsZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICAgIGJ1dHRvbi5oaWRkZW4gPSAhKF9ldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy8gcHJldmVudCBidWJibGluZyBvZiBpbnB1dCBldmVudCB0byBjb250cm9sbGVyIFRPRE86IG9ubHkgc3RvcCBwcm9wYWdhdGlvbiBpZiBpbnB1dCBvcmlnaW5hdGVzIGZyb20gYnV0dG9uIG9yIHRoZSBjb21ibyBzZWxlY3QgaW5wdXRcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHRoaXMuZ2V0T3B0aW9ucygpO1xyXG4gICAgICBjb25zdCBrZXk6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBjb25zdCBpbmNvbWluZzogdW5rbm93biA9IG9wdGlvbnNbaW5wdXQudmFsdWVdO1xyXG4gICAgICBjb25zdCBjdXJyZW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQodGhpcy4jbXV0YWJsZSwga2V5KTtcclxuXHJcbiAgICAgIGlmIChpbmNvbWluZyA9PSBjdXJyZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0FWRV9ISVNUT1JZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBoaXN0b3J5OiAzLCBtdXRhYmxlOiB0aGlzLiNtdXRhYmxlLCBtdXRhdG9yOiB7IFtrZXldOiBjdXJyZW50IH0gfSB9KSk7XHJcblxyXG4gICAgICBSZWZsZWN0LnNldCh0aGlzLiNtdXRhYmxlLCBrZXksIGluY29taW5nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPcHRpb25zKCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuI2dldE9wdGlvbnMuY2FsbCh0aGlzLiNtdXRhYmxlLCB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogUmVwcmVzZW50cyBhIHNpbmdsZSBkaWdpdCBudW1iZXIgdG8gYmUgdXNlZCBpbiBncm91cHMgdG8gcmVwcmVzZW50IGEgbXVsdGlkaWdpdCB2YWx1ZS5cclxuICAgKiBJcyB0YWJiYWJsZSBhbmQgaW4tL2RlY3JlYXNlcyBwcmV2aW91cyBzaWJsaW5nIHdoZW4gZmxvd2luZyBvdmVyL3VuZGVyLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50RGlnaXQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWRpZ2l0XCIsIEN1c3RvbUVsZW1lbnREaWdpdCk7XHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB2YWx1ZShfdmFsdWU6IG51bWJlcikge1xyXG4gICAgICBfdmFsdWUgPSBNYXRoLnRydW5jKF92YWx1ZSk7XHJcbiAgICAgIGlmIChfdmFsdWUgPiA5IHx8IF92YWx1ZSA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnRleHRDb250ZW50ID0gX3ZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy50ZXh0Q29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGFkZChfYWRkZW5kOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX2FkZGVuZCA9IE1hdGgudHJ1bmMoX2FkZGVuZCk7XHJcbiAgICAgIGlmIChfYWRkZW5kID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9hZGRlbmQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPCA5KVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSsrO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPiAwKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZS0tO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoLTEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnQudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgQ3VzdG9tRWxlbWVudCBmcm9tIGFuIEhUTUwtVGVtcGxhdGUtVGFnXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJhZ21lbnQ6IE1hcDxzdHJpbmcsIERvY3VtZW50RnJhZ21lbnQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJyb3dzZXMgdGhyb3VnaCB0aGUgdGVtcGxhdGVzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZCByZWdpc3RlcnMgdGhlIG9uZSBkZWZpbmluZyB0aGUgZ2l2ZW4gdGFnbmFtZS5cclxuICAgICAqIFRvIGJlIGNhbGxlZCBmcm9tIGEgc2NyaXB0IHRhZyBpbXBsZW1lbnRlZCB3aXRoIHRoZSB0ZW1wbGF0ZSBpbiBIVE1MLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWdOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgdGVtcGxhdGUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRlbXBsYXRlXCIpKSB7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQubG9jYWxOYW1lID09IF90YWdOYW1lKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIlJlZ2lzdGVyXCIsIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LnNldChfdGFnTmFtZSwgdGVtcGxhdGUuY29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0ge307XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcIltrZXlcIik7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5fVwiXWApO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIMaSLkRlYnVnLmxvZyhgQ291bGRuJ3QgZmluZCAke2tleX0gaW5gLCB0aGlzKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZShfbXV0YXRvcltrZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlbGVtZW50LnZhbHVlID0gX211dGF0b3Jba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWUsIHRoZSBlbGVtZW50IGdldHMgY29uc3RydWN0ZWQgYXMgYSBkZWVwIGNsb25lIG9mIHRoZSB0ZW1wbGF0ZS5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgbGV0IGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50ID0gQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LmdldChSZWZsZWN0LmdldCh0aGlzLmNvbnN0cnVjdG9yLCBcInRhZ1wiKSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5mcmFnbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcbiAgICAgIGxldCBzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IHRoaXMuc3R5bGU7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIGNvbnRlbnQuc3R5bGUpIHtcclxuICAgICAgICBzdHlsZS5zZXRQcm9wZXJ0eShlbnRyeSwgUmVmbGVjdC5nZXQoY29udGVudC5zdHlsZSwgZW50cnkpKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBjb250ZW50LmNoaWxkTm9kZXMpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGNoaWxkLmNsb25lTm9kZSh0cnVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBpZiAobGFiZWwpXHJcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnRUZW1wbGF0ZS50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE1hdHJpeDN4MyBleHRlbmRzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHNjYWxpbmc6IHt9LCByb3RhdGlvbjogMCB9O1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCJdKVxyXG4gICAgICAgICAgKDzGki5NdXRhdG9yPm11dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG5cclxuICAgICAgbXV0YXRvcltcInJvdGF0aW9uXCJdID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKCg8xpIuTXV0YXRvcj5fbXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dKSk7XHJcbiAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoX211dGF0b3JbXCJyb3RhdGlvblwiXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJNYXRyaXggQ2FsbGJhY2tcIik7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4NHg0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHsgdHJhbnNsYXRpb246IHt9LCByb3RhdGlvbjoge30sIHNjYWxpbmc6IHt9IH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwicm90YXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwicm90YXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0pXHJcbiAgICAgICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKCg8xpIuTXV0YXRvcj5fbXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50T3V0cHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLW91dHB1dFwiLCBDdXN0b21FbGVtZW50T3V0cHV0KTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IG91dHB1dDogSFRNTE91dHB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChvdXRwdXQpO1xyXG4gICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBGdWRnZUNvcmUuR2VuZXJhbCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKTtcclxuICAgICAgb3V0cHV0LnZhbHVlID0gX3ZhbHVlID8/IHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgIGlmIChfdmFsdWUpXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG91dHB1dC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXJcIik7XHJcblxyXG4gICAgICAvLyB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJvdXRwdXRcIikudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIGRyb3Bkb3duIG1lbnUgdG8gZGlzcGxheSBlbnVtc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXNlbGVjdFwiLCBDdXN0b21FbGVtZW50U2VsZWN0LCBPYmplY3QpO1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IE9iamVjdDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzLCBfY29udGVudDogT2JqZWN0ID0ge30pIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgICAgdGhpcy5jb250ZW50ID0gX2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuY29udGVudCkge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0aGlzLmNvbnRlbnQsIHZhbHVlKSAmJiBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIHZhbHVlKSAhPT0ga2V5KSAvLyBmaWx0ZXIgbnVtYmVyIGtleXMgb3V0IG9mIHNpbXBsZSBlbnVtIFxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgZW50cnkudGV4dCA9IGtleTtcclxuICAgICAgICBlbnRyeS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGVvZiB2YWx1ZSk7XHJcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgICAgIGlmIChlbnRyeS52YWx1ZSA9PSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdC5hZGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGVjdC50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveCBhcyBib29sZWFuIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIik7XHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBzZWxlY3Qub3B0aW9uc1tzZWxlY3Quc2VsZWN0ZWRJbmRleF0/LmdldEF0dHJpYnV0ZShcInR5cGVcIikgfHwgXCJzdHJpbmdcIjtcclxuICAgICAgcmV0dXJuIHR5cGUgPT0gXCJudW1iZXJcIiA/IHBhcnNlRmxvYXQoc2VsZWN0LnZhbHVlKSA6IHNlbGVjdC52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgLy8gdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIGludGVyYWN0aXZlIG51bWJlciBzdGVwcGVyIHdpdGggZXhwb25lbnRpYWwgZGlzcGxheSBhbmQgY29tcGxleCBoYW5kbGluZyB1c2luZyBrZXlib2FyZCBhbmQgbW91c2VcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFN0ZXBwZXIgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc3RlcHBlclwiLCBDdXN0b21FbGVtZW50U3RlcHBlciwgTnVtYmVyKTtcclxuICAgIHB1YmxpYyB2YWx1ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcyAmJiBfYXR0cmlidXRlc1tcInZhbHVlXCJdKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7IF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuXHJcbiAgICAgIGxldCBzaWduOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgc2lnbi50ZXh0Q29udGVudCA9IFwiK1wiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNpZ24pO1xyXG4gICAgICBmb3IgKGxldCBleHA6IG51bWJlciA9IDI7IGV4cCA+IC00OyBleHAtLSkge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gbmV3IEN1c3RvbUVsZW1lbnREaWdpdCgpO1xyXG4gICAgICAgIGRpZ2l0LnNldEF0dHJpYnV0ZShcImV4cFwiLCBleHAudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkaWdpdCk7XHJcbiAgICAgICAgaWYgKGV4cCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCIuXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCJlXCI7XHJcblxyXG4gICAgICBsZXQgZXhwOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZXhwLnRleHRDb250ZW50ID0gXCIrMFwiO1xyXG4gICAgICBleHAudGFiSW5kZXggPSAtMTtcclxuICAgICAgZXhwLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJleHBcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZXhwKTtcclxuXHJcblxyXG4gICAgICAvLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGUtL0FjdGl2YXRlcyB0YWJiaW5nIGZvciB0aGUgaW5uZXIgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZUlubmVyVGFicyhfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBfb24gPyAwIDogLTE7XHJcblxyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICAgIHNwYW5zWzFdLnRhYkluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgZm9yIChsZXQgZGlnaXQgb2YgZGlnaXRzKVxyXG4gICAgICAgIGRpZ2l0LnRhYkluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVucy9DbG9zZXMgYSBzdGFuZGFyZCBudW1iZXIgaW5wdXQgZm9yIHR5cGluZyB0aGUgdmFsdWUgYXQgb25jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb3BlbklucHV0KF9vcGVuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoX29wZW4pIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BsYXlzIGl0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKF92YWx1ZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBcclxuICAgICAgdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBtYW50aXNzYSBhbmQgZXhwb25lbnQgc2VwYXJhdGVseSBhcyBhbiBhcnJheSBvZiB0d28gbWVtYmVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpOiBudW1iZXJbXSB7XHJcbiAgICAgIGxldCBwcmVjOiBzdHJpbmcgPSB0aGlzLnZhbHVlLnRvRXhwb25lbnRpYWwoNik7XHJcbiAgICAgIGxldCBleHA6IG51bWJlciA9IHBhcnNlSW50KHByZWMuc3BsaXQoXCJlXCIpWzFdKTtcclxuICAgICAgbGV0IGV4cDM6IG51bWJlciA9IE1hdGgudHJ1bmMoZXhwIC8gMyk7XHJcbiAgICAgIGxldCBtYW50aXNzYTogbnVtYmVyID0gdGhpcy52YWx1ZSAvIE1hdGgucG93KDEwLCBleHAzICogMyk7XHJcbiAgICAgIG1hbnRpc3NhID0gTWF0aC5yb3VuZChtYW50aXNzYSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgcmV0dXJuIFttYW50aXNzYSwgZXhwMyAqIDNdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoaXMgdmFsdWUgYXMgYSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIGxldCBwcmVmaXhNYW50aXNzYTogc3RyaW5nID0gKG1hbnRpc3NhIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIGxldCBwcmVmaXhFeHA6IHN0cmluZyA9IChleHAgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgcmV0dXJuIHByZWZpeE1hbnRpc3NhICsgbWFudGlzc2EudG9GaXhlZCgzKSArIFwiZVwiICsgcHJlZml4RXhwICsgZXhwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheXMgdGhpcyB2YWx1ZSBieSBzZXR0aW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZGlnaXRzIGFuZCB0aGUgZXhwb25lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCIgIOKIniAgIFwiWzUgLSBwb3NdO1xyXG4gICAgICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBcIiAgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogc3RyaW5nW10gPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCJlXCIpO1xyXG4gICAgICBzcGFuc1swXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWUgPCAwID8gXCItXCIgOiBcIitcIjtcclxuICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBleHA7XHJcblxyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnN1YnN0cmluZygxKTtcclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5yZXBsYWNlKFwiLlwiLCBcIlwiKTtcclxuICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgIGlmIChwb3MgPCBtYW50aXNzYS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxldCBjaGFyOiBzdHJpbmcgPSBtYW50aXNzYS5jaGFyQXQobWFudGlzc2EubGVuZ3RoIC0gMSAtIHBvcyk7XHJcbiAgICAgICAgICBkaWdpdC50ZXh0Q29udGVudCA9IGNoYXI7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiZuYnNwO1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUga2V5Ym9hcmQgaW5wdXQgb24gdGhpcyBlbGVtZW50IGFuZCBpdHMgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgYWN0aXZlOiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgbGV0IG51bUVudGVyZWQ6IG51bWJlciA9IF9ldmVudC5rZXkuY2hhckNvZGVBdCgwKSAtIDQ4O1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgLy8gaWYgZm9jdXMgaXMgb24gc3RlcHBlciwgZW50ZXIgaXQgYW5kIGZvY3VzIGRpZ2l0XHJcbiAgICAgIGlmIChhY3RpdmUgPT0gdGhpcykge1xyXG4gICAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVI6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyh0cnVlKTtcclxuICAgICAgICAgICAgKDxIVE1MRWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKVsyXSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB8fCBfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlucHV0IGZpZWxkIG92ZXJsYXkgaXMgYWN0aXZlXHJcbiAgICAgIGlmIChhY3RpdmUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5FTlRFUiB8fCBfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5UQUJVTEFUT1IpIHtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBOdW1iZXIoKDxIVE1MSW5wdXRFbGVtZW50PmFjdGl2ZSkudmFsdWUpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB7XHJcbiAgICAgICAgbGV0IGRpZmZlcmVuY2U6IG51bWJlciA9IG51bUVudGVyZWQgLSBOdW1iZXIoYWN0aXZlLnRleHRDb250ZW50KSAqICh0aGlzLnZhbHVlIDwgMCA/IC0xIDogMSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGRpZmZlcmVuY2UpO1xyXG5cclxuICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gKF9ldmVudC5rZXkgPT0gXCItXCIgPyAtMSA6IDEpICogTWF0aC5hYnModGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUilcclxuICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZCgtMSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKCsxKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgICg8SFRNTEVsZW1lbnQ+YWN0aXZlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRU5URVI6XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBjaGFuZ2U6IG51bWJlciA9IF9ldmVudC5kZWx0YVkgPCAwID8gKzEgOiAtMTtcclxuICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGNoYW5nZSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEaWdpdEZvY3Vzc2VkKF9hbW91bnQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcyB8fCAhdGhpcy5jb250YWlucyhkaWdpdCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2Ftb3VudCA9IE1hdGgucm91bmQoX2Ftb3VudCk7XHJcbiAgICAgIGlmIChfYW1vdW50ID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMucXVlcnlTZWxlY3RvcihcIltuYW1lPWV4cF1cIikpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnZhbHVlKTtcclxuICAgICAgICBsZXQgdmFsdWU6IG51bWJlciA9IHRoaXMudmFsdWUgKiBNYXRoLnBvdygxMCwgX2Ftb3VudCk7XHJcbiAgICAgICAgxpIuRGVidWcubG9nKHZhbHVlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUodmFsdWUpKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOyBcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBleHBEaWdpdDogbnVtYmVyID0gcGFyc2VJbnQoZGlnaXQuZ2V0QXR0cmlidXRlKFwiZXhwXCIpKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZSAobWFudGlzc2Egbm90IHVzZWQpXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cFZhbHVlXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuXHJcbiAgICAgIGxldCBwcmV2OiBudW1iZXIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlICs9IF9hbW91bnQgKiBNYXRoLnBvdygxMCwgZXhwRGlnaXQgKyBleHBWYWx1ZSk7XHJcbiAgICAgIC8vIHdvcmthcm91bmQgcHJlY2lzaW9uIHByb2JsZW1zIG9mIGphdmFzY3JpcHRcclxuICAgICAgaWYgKE1hdGguYWJzKHByZXYgLyB0aGlzLnZhbHVlKSA+IDEwMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcblxyXG5cclxuICAgICAgbGV0IGV4cE5ldzogbnVtYmVyO1xyXG4gICAgICBbbWFudGlzc2EsIGV4cE5ld10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobWFudGlzc2EpO1xyXG4gICAgICB0aGlzLnNoaWZ0Rm9jdXMoZXhwTmV3IC0gZXhwVmFsdWUpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNoaWZ0Rm9jdXMoX25EaWdpdHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc2hpZnRGb2N1czogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChfbkRpZ2l0cykge1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspXHJcbiAgICAgICAgICBpZiAoX25EaWdpdHMgPiAwKVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+c2hpZnRGb2N1cykuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50VGV4dElucHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXRleHRpbnB1dFwiLCBDdXN0b21FbGVtZW50VGV4dElucHV0LCBTdHJpbmcpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBCYXNlY2xhc3MgZm9yIGNvbXBsZXggdWktY29udHJvbGxlcnMgaGFuZGxpbmcgZGF0YSBpbiB0YWJsZXMsIHRyZWVzIG9yIG90aGVyIHN0cnVjdHVyZXMgICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIHNlbGVjdGVkIG9iamVjdHMuIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIHNlbGVjdGlvbiBzaG91bGQgYWxzbyBvcGVyYXRlIG91dHNpZGUgb2YgdGFibGUgKi9cclxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFRbXSA9IFtdO1xyXG4gICAgXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0YWJsZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBUYWJsZUl0ZW1zfSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZXhwZW5kYWJsZXMgVGhlIGV4cGVuZGFibGUgb2JqZWN0cyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZXhwZW5kYWJsZXM6IFRbXSk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIHJldHVybiBfZXhwZW5kYWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgaXRlbXMgdG8gdGhlIGNsaXBib2FyZCBmb3IgY29weSAmIHBhc3RlICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBjb3BpZWQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eSxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcmVmZXJyZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogVFtdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPyB0aGlzLnNlbGVjdGlvbiA6IFtfZm9jdXNdO1xyXG4gICAgICBDbGlwYm9hcmQuY29weVBhc3RlLnNldChpdGVtcywgX29wZXJhdGlvbik7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBvYmplY3RzIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGNvcHkgJiBwYXN0ZSBhbmQgZGVsZXRlIHRoZW0gZnJvbSB0aGlzIGNvbnRyb2xsZXIgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgY3V0IGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIHdob2xlIHNlbGVjdGlvbiBnZXRzIHJlZmVycmVkIGFuZCBkZWxldGVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjdXQoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLmNvcHkoX2ZvY3VzLCBfb3BlcmF0aW9uKTtcclxuICAgICAgaXRlbXMgPSBhd2FpdCB0aGlzLmRlbGV0ZShpdGVtcyk7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0YWJsZSAgIFxyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiBpZiB0aGUgY29weVBhc3RlIGNsaXBib2FyZCB3YXMgZmlsbGVkIHVzaW5nIGNvcHksIHJldHVybiBhbiBhcnJheSBvZiBjbG9uZXMsXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGNvbnRlbnQgb2YgdGhlIGNsaXBib2FyZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgcGFzdGUoKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5jb3B5UGFzdGUuZ2V0KCk7XHJcbiAgICAgIGlmIChDbGlwYm9hcmQuY29weVBhc3RlLm9wZXJhdGlvbiA9PSBcImNvcHlcIilcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbG9uZShvYmplY3RzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIG9iamVjdHMgdG8gdGhlIGNsaXBib2FyZCBmb3IgZHJhZyAmIGRyb3AgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgZHJhZ2dlZCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyByZWZlcnJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ1N0YXJ0KF9mb2N1czogVCk6IHZvaWQge1xyXG4gICAgICAvLyBpZiB0aGUgZm9jdXNzZWQgaXRlbSBpcyBpbiB0aGUgc2VsZWN0aW9uLCBkcmFnIHRoZSB3aG9sZSBzZWxlY3Rpb25cclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKF9mb2N1cykgPCAwID8gW19mb2N1c10gOiB0aGlzLnNlbGVjdGlvbjtcclxuICAgICAgQ2xpcGJvYXJkLmRyYWdEcm9wLnNldChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGFsbG93ZWQgZHJhZ0Ryb3AtZWZmZWN0ICBcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogY2hlY2sgdGhlIGN0cmxLZXkgZm9yIFwiY29weVwiIGFuZCBzaGlmdEtleSBmb3IgXCJsaW5rXCIsIG90aGVyd2lzZSByZXR1cm4gXCJtb3ZlXCIgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQpOiBEUk9QRUZGRUNUIHtcclxuICAgICAgbGV0IGRyb3BFZmZlY3Q6IERST1BFRkZFQ1QgPSBcIm1vdmVcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIHJldHVybiBkcm9wRWZmZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHJpZXZlIG9iamVjdHMgZnJvbSB0aGUgY2xpcGJvYXJkLCBwcm9jZXNzIGFuZCByZXR1cm4gdGhlbSB0byBhZGQgdG8gdGhlIHRyZWUuXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IGlmIHtAbGluazogZHJhZ092ZXJ9IHlpZWxkcyBcImNvcHlcIiwgcmV0dXJuIGFuIGFycmF5IG9mIGNsb25lcyBvZiB0aGUgb2JqZWN0cyBpbixcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY29udGVudCBvZiB0aGUgZHJhZ0Ryb3AtY2xpcGJvYXJkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBvYmplY3RzOiBUW10gPSBDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KCk7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdPdmVyKF9ldmVudCkgPT0gXCJjb3B5XCIpXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xvbmUob2JqZWN0cyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBDbG9uZSBvYmplY3RzIGFuZCByZXR1cm4gYW4gYXJyYXkgd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBjbG9uZXNcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogdXNlIE9iamVjdC5jcmVhdGUgdG8gY2xvbmUgdGhlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGNsb25lKF9vYmplY3RzOiBUW10pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICByZXR1cm4gX29iamVjdHMubWFwKF9vYmplY3QgPT4gT2JqZWN0LmNyZWF0ZSg8T2JqZWN0Pl9vYmplY3QpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlscyBleHRlbmRzIEhUTUxEZXRhaWxzRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZyA9IFwiXCIsIF90eXBlOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBjaGFuZ2luZyBhbmltYXRpb24gc3RydWN0dXJlIHRvIGxvb2sgbW9yZSBsaWtlIGEgbXV0YXRvclxyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImtleVwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgbGV0IGxibFN1bW1hcnk6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XHJcbiAgICAgIGxibFN1bW1hcnkudGV4dENvbnRlbnQgPSBfbGVnZW5kO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxibFN1bW1hcnkpO1xyXG5cclxuICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19TRVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVE9HR0xFLCB0aGlzLmhuZFRvZ2dsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgLy8gcmV0dXJuIHRoaXMuZXhwYW5kZXIuY2hlY2tlZDtcclxuICAgICAgcmV0dXJuIHRoaXMub3BlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZXBsYWNlQ2hpbGQoX2NvbnRlbnQsIHRoaXMuY29udGVudCk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAvLyB0aGlzLmV4cGFuZGVyLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLm9wZW4gPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhuZFRvZ2dsZShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvZ2dsZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuaXNFeHBhbmRlZCA/IEVWRU5ULkVYUEFORCA6IEVWRU5ULkNPTExBUFNFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXRzOiBOb2RlTGlzdE9mPEhUTUxEZXRhaWxzRWxlbWVudD4gPSBwcmV2aW91cy5xdWVyeVNlbGVjdG9yQWxsKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IHNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgICBkbyB7IC8vIGZvY3VzIHRoZSBsYXN0IHZpc2libGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZXRzWy0taV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9IHdoaWxlICghc2V0c1tpXS5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1NFVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAvLyBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgICDGki5EZWJ1Zy5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc1wiKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuSU5TRVJULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICghdGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICBuZXh0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgIG5leHQgPSA8SFRNTEVsZW1lbnQ+bmV4dC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKG5leHQgJiYgbmV4dC50YWJJbmRleCA+IC0xKTtcclxuXHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgLy8gbmV4dC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGxldCBwcmV2aW91czogSFRNTEVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBwcmV2aW91cyA9IDxIVE1MRWxlbWVudD5wcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgfSB3aGlsZSAocHJldmlvdXMgJiYgIShwcmV2aW91cyBpbnN0YW5jZW9mIERldGFpbHMpKTtcclxuXHJcbiAgICAgICAgICBpZiAocHJldmlvdXMpXHJcbiAgICAgICAgICAgIGlmICgoPERldGFpbHM+cHJldmlvdXMpLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1NFVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgLy8gVE9ETzogdXNlIEN1c3RvbUVsZW1lbnQucmVnaXN0ZXI/XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktZGV0YWlsc1wiLCBEZXRhaWxzLCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHNBcnJheSBleHRlbmRzIERldGFpbHMge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX2xlZ2VuZCwgXCJBcnJheVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuc2V0Q29udGVudChfY29udGVudCk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgbXV0YXRvci5wdXNoKGNoaWxkLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50TGlzdGVuZXJzKF9jaGlsZDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgX2NoaWxkLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5U3BlY2lhbCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgICBfY2hpbGQudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhcnJhbmdlKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc2VxdWVuY2UucHVzaChwYXJzZUludChjaGlsZC5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0Rm9jdXMoX2ZvY3VzKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGtleTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIHNlcXVlbmNlOiBzZXF1ZW5jZSB9IH0pKTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnNldExhYmVsKVxyXG4gICAgICAgICAgY2hpbGQuc2V0TGFiZWwoY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoY2hpbGQudGFiSW5kZXgpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9jdXMoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgaWYgKF9mb2N1cyA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZm9jdXMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihfZm9jdXMsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBjaGlsZDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb250ZW50LmNoaWxkcmVuW19mb2N1c107XHJcbiAgICAgIGNoaWxkPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdDsgXHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluZGV4XCIsIGtleURyYWcpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJrZXk6XCIgKyB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgXCJrZXlcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIFtrZXksIGxhYmVsXSA9IGl0ZW0udHlwZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgaWYgKGtleSA9PSBcImtleVwiICYmIGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKSB7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIGxldCBkcm9wOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgbGV0IGtleURyb3A6IHN0cmluZyA9IGRyb3AuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5kZXhcIik7XHJcbiAgICAgIGxldCBkcmFnOiBIVE1MRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5RHJhZ31cIl1gKTtcclxuICAgICAgbGV0IGxhYmVsRHJhZzogc3RyaW5nID0gZHJhZy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHJcbiAgICAgIGxldCBwb3NpdGlvbjogSW5zZXJ0UG9zaXRpb24gPSBrZXlEcmFnID4ga2V5RHJvcCA/IFwiYmVmb3JlYmVnaW5cIiA6IFwiYWZ0ZXJlbmRcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyYWcgPSA8SFRNTEVsZW1lbnQ+ZHJhZy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIGRyYWcuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgbGFiZWxEcmFnKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWcpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZHJvcC5pbnNlcnRBZGphY2VudEVsZW1lbnQocG9zaXRpb24sIGRyYWcpO1xyXG5cclxuICAgICAgdGhpcy5yZWFycmFuZ2UoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhkcmFnKTtcclxuICAgICAgZHJhZy5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnNlcnQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShcImhuZEluc2VydFwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlTcGVjaWFsID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgaXRlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAvLyBvbmx5IHdvcmsgb24gaXRlbXMgb2YgbGlzdCwgbm90IHRoZWlyIGNoaWxkcmVuXHJcbiAgICAgIGlmICgoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpICE9IGl0ZW0gJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBudW1iZXIgPSBwYXJzZUludChpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgbGV0IHNpYmxpbmc6IEhUTUxFbGVtZW50ID0gaXRlbTtcclxuICAgICAgbGV0IGluc2VydDogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKGZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgLy8gICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc0FycmF5XCIpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoLS1mb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmViZWdpblwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoLS1mb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmFsdEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEZvY3VzKCsrZm9jdXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgaW5zZXJ0ID0gPEhUTUxFbGVtZW50Pml0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBpbnNlcnQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoaW5zZXJ0KTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzaWJsaW5nID0gPEhUTUxFbGVtZW50Pml0ZW0ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoKytmb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpIHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1saXN0XCIsIERldGFpbHNBcnJheSwgeyBleHRlbmRzOiBcImRldGFpbHNcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCBvciBub24tbW9kYWwgZGlhbG9nIHdpdGggYW4gaW50ZXJmYWNlIGZvciB0aGUgZ2l2ZW4gbXV0YXRvci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZG9tOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0IHRoZSBkaWFsb2cgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIGNhbGwgdG8gYWN0aW9uIGFuZCBsYWJlbHMgZm9yIHRoZSBjYW5jZWwtIGFuZCBvay1idXR0b25cclxuICAgICAqIFVzZSBgYXdhaXRgIG9uIGNhbGwsIHRvIGNvbnRpbnVlIGFmdGVyIHRoZSB1c2VyIGhhcyBwcmVzc2VkIG9uZSBvZiB0aGUgYnV0dG9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwcm9tcHQoX2RhdGE6IMaSLk11dGFibGUgfCDGki5NdXRhdG9yIHwgT2JqZWN0LCBfbW9kYWw6IGJvb2xlYW4gPSB0cnVlLCBfaGVhZDogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfY2FsbFRvQWN0aW9uOiBzdHJpbmcgPSBcIkluc3RydWN0aW9uXCIsIF9vazogc3RyaW5nID0gXCJPS1wiLCBfY2FuY2VsOiBzdHJpbmcgPSBcIkNhbmNlbFwiKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIERpYWxvZy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICBEaWFsb2cuZG9tLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWQgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgIGlmIChfZGF0YSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfZGF0YSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9kYXRhKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF9jYWxsVG9BY3Rpb24gKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bkNhbmNlbDogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5DYW5jZWwuaW5uZXJIVE1MID0gX2NhbmNlbDtcclxuICAgICAgaWYgKF9jYW5jZWwgIT0gXCJcIilcclxuICAgICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuQ2FuY2VsKTtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgRGlhbG9nLmRvbS5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICBpZiAoX21vZGFsKVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvd01vZGFsKCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBEaWFsb2cuZG9tLnNob3coKTtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoX3Jlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgaG5kQnV0dG9uOiAoX2V2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBidG5DYW5jZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgICBidG5Pay5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IGJ0bk9rKVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihjb250ZW50LCBfZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lKSB7XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcud2FybihfZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgRGlhbG9nLmRvbS5jbG9zZSgpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChEaWFsb2cuZG9tKTtcclxuICAgICAgICAgIF9yZXNvbHZlKF9ldmVudC50YXJnZXQgPT0gYnRuT2spO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgYnRuT2suYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5mb2N1cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiA8c2VsZWN0PjxvcHRpb24+SGFsbG88L29wdGlvbj48L3NlbGVjdD5cclxuICAgKi9cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBNdWx0aUxldmVsTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYnVpbGRGcm9tU2lnbmF0dXJlKF9zaWduYXR1cmU6IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwge307XHJcbiAgICAgIGxldCBzaWduYXR1cmVMZXZlbHM6IHN0cmluZ1tdID0gX3NpZ25hdHVyZS5zcGxpdChcIi5cIik7XHJcbiAgICAgIGlmIChzaWduYXR1cmVMZXZlbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGxldCBzdWJTaWduYXR1cmU6IHN0cmluZyA9IHNpZ25hdHVyZUxldmVsc1sxXTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAyOyBpIDwgc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzdWJTaWduYXR1cmUgPSBzdWJTaWduYXR1cmUgKyBcIi5cIiArIHNpZ25hdHVyZUxldmVsc1tpXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlLCA8xpIuTXV0YXRvcj5tdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHNpZ25hdHVyZUxldmVsc1swXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCB3YXJuaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBXYXJuaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBhIHdhcm5pbmcgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIHdhcm5pbmcgdGV4dCBhbmQgb2sgYnV0dGVuIHRleHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheShfZXJyb3JzOiBzdHJpbmdbXSA9IFtdLCBfaGVhZGxpbmU6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX3dhcm5pbmc6IHN0cmluZyA9IFwiV2FybmluZ1wiLCBfb2s6IHN0cmluZyA9IFwiT0tcIik6IHZvaWQge1xyXG4gICAgICBsZXQgd2FybmluZzogSFRNTERpYWxvZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdhcm5pbmcpO1xyXG4gICAgICB3YXJuaW5nLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWRsaW5lICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBjb250ZW50LmlubmVyVGV4dCA9IF9lcnJvcnMuam9pbihcIlxcblwiKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfd2FybmluZyArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBidG5Pay5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdhcm5pbmcuY2xvc2UoKTtcclxuICAgICAgICB3YXJuaW5nLnJlbW92ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB3YXJuaW5nLnNob3dNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLy8gVE9ETzogZHVwbGljYXRlZCBjb2RlIGluIFRhYmxlIGFuZCBUcmVlLCBtYXkgYmUgb3B0aW1pemVkLi4uXHJcblxyXG4gIGV4cG9ydCBpbnRlcmZhY2UgVEFCTEUge1xyXG4gICAgbGFiZWw6IHN0cmluZztcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgZWRpdGFibGU6IGJvb2xlYW47XHJcbiAgICBzb3J0YWJsZTogYm9vbGVhbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hbmFnZXMgYSBzb3J0YWJsZSB0YWJsZSBvZiBkYXRhIGdpdmVuIGFzIHNpbXBsZSBhcnJheSBvZiBmbGF0IG9iamVjdHMgICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogS2V5MCAgS2V5MSBLZXkyXHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRhYmxlPFQgZXh0ZW5kcyBPYmplY3Q+IGV4dGVuZHMgSFRNTFRhYmxlRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+O1xyXG4gICAgcHVibGljIGRhdGE6IFRbXTtcclxuICAgIHB1YmxpYyBhdHRJY29uOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBUW10sIF9hdHRJY29uPzogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy5hdHRJY29uID0gX2F0dEljb247XHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJzb3J0YWJsZVwiO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNPUlQsIDxFdmVudExpc3RlbmVyPnRoaXMuaG5kU29ydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TRUxFQ1QsIHRoaXMuaG5kU2VsZWN0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVF9BTEwsIHRoaXMuc2VsZWN0QWxsKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIDxFdmVudExpc3RlbmVyPnRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIDxFdmVudExpc3RlbmVyPnRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ERUxFVEUsIHRoaXMuaG5kRGVsZXRlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DVVQsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBBU1RFLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIHRhYmxlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgbGV0IGhlYWQ6IFRBQkxFW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0SGVhZCgpO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUhlYWQoaGVhZCkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiB0aGlzLmRhdGEpIHtcclxuICAgICAgICBsZXQgaXRlbTogVGFibGVJdGVtPFQ+ID0gbmV3IFRhYmxlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIGRhdGEsIHRoaXMuYXR0SWNvbik7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEZvY3Vzc2VkKCk6IFQge1xyXG4gICAgICBsZXQgaXRlbXM6IFRhYmxlSXRlbTxUPltdID0gPFRhYmxlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpO1xyXG4gICAgICBsZXQgZm91bmQ6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YoPFRhYmxlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgaWYgKGZvdW5kID4gLTEpXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zW2ZvdW5kXS5kYXRhO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbCh0aGlzLmRhdGFbMF0sIHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoLTFdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IF9kYXRhU3RhcnQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAoaXRlbS5kYXRhID09IF9kYXRhRW5kKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBlbmQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwbGF5U2VsZWN0aW9uKF9kYXRhOiBUW10pOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2RhdGEpO1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUhlYWQoX2hlYWRJbmZvOiBUQUJMRVtdKTogSFRNTFRhYmxlUm93RWxlbWVudCB7XHJcbiAgICAgIGxldCB0cjogSFRNTFRhYmxlUm93RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2hlYWRJbmZvKSB7XHJcbiAgICAgICAgbGV0IHRoOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiKTtcclxuICAgICAgICB0aC50ZXh0Q29udGVudCA9IGVudHJ5LmxhYmVsO1xyXG4gICAgICAgIHRoLnNldEF0dHJpYnV0ZShcImtleVwiLCBlbnRyeS5rZXkpO1xyXG5cclxuICAgICAgICBpZiAoZW50cnkuc29ydGFibGUpIHtcclxuICAgICAgICAgIHRoLmFwcGVuZENoaWxkKHRoaXMuZ2V0U29ydEJ1dHRvbnMoKSk7XHJcbiAgICAgICAgICB0aC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICBFVkVOVC5DSEFOR0UsXHJcbiAgICAgICAgICAgIChfZXZlbnQ6IEV2ZW50KSA9PiB0aC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TT1JULCB7IGRldGFpbDogX2V2ZW50LnRhcmdldCwgYnViYmxlczogdHJ1ZSB9KSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyLmFwcGVuZENoaWxkKHRoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTb3J0QnV0dG9ucygpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCByZXN1bHQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBvZiBbXCJ1cFwiLCBcImRvd25cIl0pIHtcclxuICAgICAgICBsZXQgYnV0dG9uOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGJ1dHRvbi50eXBlID0gXCJyYWRpb1wiO1xyXG4gICAgICAgIGJ1dHRvbi5uYW1lID0gXCJzb3J0XCI7XHJcbiAgICAgICAgYnV0dG9uLnZhbHVlID0gZGlyZWN0aW9uO1xyXG4gICAgICAgIHJlc3VsdC5hcHBlbmRDaGlsZChidXR0b24pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRTb3J0KF9ldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LmRldGFpbCkudmFsdWU7XHJcbiAgICAgIGxldCBrZXk6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQgZGlyZWN0aW9uOiBudW1iZXIgPSAodmFsdWUgPT0gXCJ1cFwiKSA/IDEgOiAtMTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNvcnQodGhpcy5kYXRhLCBrZXksIGRpcmVjdGlvbik7XHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRTZWxlY3QoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZXRhaWw6IHsgZGF0YTogT2JqZWN0OyBpbnRlcnZhbDogYm9vbGVhbjsgYWRkaXRpdmU6IGJvb2xlYW4gfSA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWw7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5pbmRleE9mKDxUPmRldGFpbC5kYXRhKTtcclxuXHJcbiAgICAgIGlmIChkZXRhaWwuaW50ZXJ2YWwpIHtcclxuICAgICAgICBsZXQgZGF0YVN0YXJ0OiBUID0gPFQ+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvblswXTtcclxuICAgICAgICBsZXQgZGF0YUVuZDogVCA9IDxUPmRldGFpbC5kYXRhO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICB0aGlzLnNlbGVjdEludGVydmFsKGRhdGFTdGFydCwgZGF0YUVuZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5kZXggPj0gMCAmJiBkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpZiAoIWRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnB1c2goPFQ+ZGV0YWlsLmRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGVsZXRlZDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuICAgICAgaWYgKGRlbGV0ZWQubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEVzY2FwZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDb3B5UGFzdGUgPSBhc3luYyAoX2V2ZW50OiBDbGlwYm9hcmRFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DT1BZOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHkodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkNVVDpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jdXQodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICBpZiAoY3V0Lmxlbmd0aClcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5wYXN0ZSgpO1xyXG4gICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBvYmplY3QsIHRoaXMuYXR0SWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSBhc3luYyAoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfU1RBUlQ6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdTdGFydChpdGVtLmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX09WRVI6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ092ZXIoX2V2ZW50KTtcclxuICAgICAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUk9QOlxyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kcm9wKF9ldmVudCk7XHJcbiAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2Ygb2JqZWN0cykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTogVGFibGVJdGVtPFQ+ID0gbmV3IFRhYmxlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIG9iamVjdCwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGl0ZW1zOiBUYWJsZUl0ZW08VD5bXSA9IDxUYWJsZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YodGFyZ2V0KTtcclxuICAgICAgaWYgKGluZGV4IDwgMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5ICYmIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ubGVuZ3RoID09IDApXHJcbiAgICAgICAgdGFyZ2V0LnNlbGVjdCh0cnVlKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBpZiAoKytpbmRleCA8IGl0ZW1zLmxlbmd0aClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgaWYgKC0taW5kZXggPj0gMClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgKDxUcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KS5zZWxlY3QodHJ1ZSk7XHJcbiAgICAgIGVsc2UgaWYgKCFfZXZlbnQuY3RybEtleSlcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidGFibGUtc29ydGFibGVcIiwgVGFibGUsIHsgZXh0ZW5kczogXCJ0YWJsZVwiIH0pO1xyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0RhdGFDb250cm9sbGVyLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RhYmxlXV0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUgW1tUYWJsZV1dIGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRhYmxlQ29udHJvbGxlcjxUPiBleHRlbmRzIERhdGFDb250cm9sbGVyPFQ+IHtcclxuICAgIFxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3RyaW5nIHRvIGNyZWF0ZSBhIGxhYmVsIGZvciB0aGUgdGFibGUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCAoYXBwZWFycyBub3QgdG8gYmUgY2FsbGVkIHlldCkgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TGFiZWwoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUmV0dXJuIGZhbHNlIGlmIHJlbmFtaW5nIG9mIG9iamVjdCBpcyBub3QgcG9zc2liaWxlLCBvciB0cnVlIGlmIHRoZSBvYmplY3Qgd2FzIHJlbmFtZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5hbWUoX29iamVjdDogVCwgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIFRBQkxFLW9iamVjdHMgZGVzY3JpYmluZyB0aGUgaGVhZC10aXRsZXMgYW5kIGFjY29yZGluZyBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRIZWFkKCk6IFRBQkxFW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0IGRhdGEgYnkgZ2l2ZW4ga2V5IGFuZCBkaXJlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNvcnQoX2RhdGE6IFRbXSwgX2tleTogc3RyaW5nLCBfZGlyZWN0aW9uOiBudW1iZXIpOiB2b2lkO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHRyLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVGFibGVdXVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZUl0ZW08VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgIHB1YmxpYyBkYXRhOiBUID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBULCBfYXR0SWNvbjogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUodGhpcy5jb250cm9sbGVyLmdldEhlYWQoKSwgX2F0dEljb24pO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QT0lOVEVSX1VQLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbQ1NTX0NMQVNTLlNFTEVDVEVEXV0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgW1tUUkVFX0NMQVNTRVMuU0VMRUNURURdXSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoX2ZpbHRlcjogVEFCTEVbXSwgX2F0dEljb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfZmlsdGVyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSA8c3RyaW5nPlJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwgZW50cnkua2V5KTtcclxuICAgICAgICBsZXQgaWNvbjogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIF9hdHRJY29uKTtcclxuICAgICAgICBsZXQgdGQ6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSAhZW50cnkuZWRpdGFibGU7XHJcbiAgICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgdGQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgIGlmIChpY29uKVxyXG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJpY29uXCIsIGljb24pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXRFdmVudCA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuRjIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB0YXJnZXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAvLyBsZXQga2V5OiBzdHJpbmcgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAvLyBsZXQgcHJldmlvdXNWYWx1ZTogxpIuR2VuZXJhbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwga2V5KTtcclxuXHJcbiAgICAgIGlmIChhd2FpdCB0aGlzLmNvbnRyb2xsZXIucmVuYW1lKHRoaXMuZGF0YSwgdGFyZ2V0LnZhbHVlKSkge1xyXG4gICAgICAgIC8vIFJlZmxlY3Quc2V0KHRoaXMuZGF0YSwga2V5LCB0YXJnZXQudmFsdWUpOyAvLyB3aHkgc2hvdWxkbid0IHRoZSBjb250cm9sbGVyIGRvIHRoaXM/XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNwYXRjaCBSZW5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHN0b3JlIHRoZSBkcmFnZ2VkIGl0ZW0gaW4gdGhlIGV2ZW50IGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcgaW4gdGFibGVcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcIml0ZW1cIiwgdGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLWl0ZW1cIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5UYWJsZUl0ZW0sIHsgZXh0ZW5kczogXCJ0clwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB1bC1lbGVtZW50IHRoYXQga2VlcHMgYSBsaXN0IG9mIHtAbGluayBUcmVlSXRlbX1zIHRvIHJlcHJlc2VudCBhIGJyYW5jaCBpbiBhIHRyZWVcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUxpc3Q8VD4gZXh0ZW5kcyBIVE1MVUxpc3RFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhfaXRlbXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCk7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRocyB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRocyBpbmNsdWRlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9wYXRoczogVFtdW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgcGF0aCBvZiBfcGF0aHMpXHJcbiAgICAgICAgdGhpcy5zaG93KHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aCB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRoIGluY2x1ZGVzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvdyhfcGF0aDogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBjdXJyZW50VHJlZTogVHJlZUxpc3Q8VD4gPSB0aGlzO1xyXG5cclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBfcGF0aCkge1xyXG4gICAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IGN1cnJlbnRUcmVlLmZpbmRJdGVtKGRhdGEpO1xyXG4gICAgICAgIGlmICghaXRlbSlcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBpZiAoIWl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBpdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgICAgY3VycmVudFRyZWUgPSBpdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0cnVjdHVyZXMgdGhlIGxpc3QgdG8gc3luYyB3aXRoIHRoZSBnaXZlbiBsaXN0LiBcclxuICAgICAqIHtAbGluayBUcmVlSXRlbX1zIHJlZmVyZW5jaW5nIHRoZSBzYW1lIG9iamVjdCByZW1haW4gaW4gdGhlIGxpc3QsIG5ldyBpdGVtcyBnZXQgYWRkZWQgaW4gdGhlIG9yZGVyIG9mIGFwcGVhcmFuY2UsIG9ic29sZXRlIG9uZXMgYXJlIGRlbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0gX3RyZWUgQSBsaXN0IHRvIHN5bmMgdGhpcyB3aXRoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN0cnVjdHVyZShfdHJlZTogVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX3RyZWUuZ2V0SXRlbXMoKSkge1xyXG4gICAgICAgIGxldCBmb3VuZDogVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRJdGVtKGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICBmb3VuZC5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgZm91bmQuaGFzQ2hpbGRyZW4gPSBpdGVtLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgICAgaWYgKCFmb3VuZC5oYXNDaGlsZHJlbilcclxuICAgICAgICAgICAgZm91bmQuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgIGl0ZW1zLnB1c2goZm91bmQpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUge0BsaW5rIFRyZWVJdGVtfSBvZiB0aGlzIGxpc3QgcmVmZXJlbmNpbmcgdGhlIGdpdmVuIG9iamVjdCBvciBudWxsLCBpZiBub3QgZm91bmRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZpbmRJdGVtKF9kYXRhOiBUKTogVHJlZUl0ZW08VD4ge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhLCBfZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+Pml0ZW07XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGdpdmVuIHtAbGluayBUcmVlSXRlbX1zIGF0IHRoZSBlbmQgb2YgdGhpcyBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRJdGVtcyhfaXRlbXM6IFRyZWVJdGVtPFQ+W10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfaXRlbXMpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb250ZW50IG9mIHRoaXMgbGlzdCBhcyBhcnJheSBvZiB7QGxpbmsgVHJlZUl0ZW19c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SXRlbXMoKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmZpbHRlcihfY2hpbGQgPT4gX2NoaWxkIGluc3RhbmNlb2YgVHJlZUl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwbGF5U2VsZWN0aW9uKF9kYXRhOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhU3RhcnQpKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBfZGF0YUVuZCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIGVuZCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChpdGVtc1swXS5kYXRhLCBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKF9kYXRhOiBUW10pOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKSB7XHJcbiAgICAgICAgICBpdGVtLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChpdGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kVmlzaWJsZShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhfZGF0YSwgaXRlbS5kYXRhKSlcclxuICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYWxsIGV4cGFuZGVkIHtAbGluayBUcmVlSXRlbX1zIHRoYXQgYXJlIGEgZGVzY2VuZGFudCBvZiB0aGlzIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRFeHBhbmRlZCgpOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIFsuLi50aGlzXS5maWx0ZXIoX2l0ZW0gPT4gX2l0ZW0uZXhwYW5kZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VHJlZUl0ZW08VD4+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHlpZWxkIGl0ZW1zW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoUmVmbGVjdC5oYXMoX2V2ZW50LCBcImluZGV4XCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCB0YXJnZXQ6IFQgPSAoPFRyZWVJdGVtPFQ+PnRoaXMucGFyZW50RWxlbWVudCkuZGF0YTtcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcImluZGV4XCIsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5pc0Nvbm5lY3RlZCA/XHJcbiAgICAgICAgQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5pbmRleE9mKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcikgOlxyXG4gICAgICAgIG51bGwpO1xyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwicGFyZW50XCIsIHRhcmdldCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIsIHRydWUpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldDogVCA9ICg8VHJlZUl0ZW08VD4+dGhpcy5wYXJlbnRFbGVtZW50KS5kYXRhO1xyXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgIXRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbihDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KCksIHRhcmdldCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcylcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0YXJnZXRJdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZChfdGFyZ2V0ID0+IF90YXJnZXQgaW5zdGFuY2VvZiBUcmVlSXRlbSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0SXRlbXMoKS5pbmNsdWRlcyh0YXJnZXRJdGVtKSkge1xyXG4gICAgICAgICAgbGV0IHJlY3Q6IERPTVJlY3QgPSB0YXJnZXRJdGVtLmNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICBsZXQgYWRkQmVmb3JlOiBib29sZWFuID0gX2V2ZW50LmNsaWVudFkgPCByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgIGxldCBzaWJsaW5nOiBFbGVtZW50ID0gYWRkQmVmb3JlID8gdGFyZ2V0SXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDogdGFyZ2V0SXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZyAhPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpXHJcbiAgICAgICAgICAgIGlmIChhZGRCZWZvcmUpXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5iZWZvcmUodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHRhcmdldEl0ZW0uYWZ0ZXIodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC10cmVlLWxpc3RcIiwgVHJlZUxpc3QsIHsgZXh0ZW5kczogXCJ1bFwiIH0pO1xyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiVHJlZUxpc3QudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgZW51bSBDU1NfQ0xBU1Mge1xyXG4gICAgU0VMRUNURUQgPSBcInNlbGVjdGVkXCIsXHJcbiAgICBJTkFDVElWRSA9IFwiaW5hY3RpdmVcIlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHtAbGluayBUcmVlTGlzdH0gdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIGEgdHJlZSBjb250cm9sICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogdHJlZSA8dWw+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiDilJQgdHJlZUxpc3QgPHVsPlxyXG4gICAqIOKUgiAgIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCICAg4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlPFQ+IGV4dGVuZHMgVHJlZUxpc3Q8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9yb290OiBUKSB7XHJcbiAgICAgIHN1cGVyKF9jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGxldCByb290OiBUcmVlSXRlbTxUPiA9IG5ldyBUcmVlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIF9yb290KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyb290KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXhwYW5kKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0xFQVZFLCB0aGlzLmhuZERyYWdMZWF2ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXMgb3IgbnVsbCBpZiBub25lIGlzIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCB0aGUgd2hvbGUgdHJlZSB0byBzeW5jaHJvbml6ZSB3aXRoIHRoZSBkYXRhIHRoZSB0cmVlIGlzIGJhc2VkIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcykge1xyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpKTtcclxuICAgICAgICBpdGVtLmdldEJyYW5jaCgpLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oaXRlbS5kYXRhKSlcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gY2hpbGRyZW4gdG8gdGhlIGdpdmVuIHRhcmdldCBhdCB0aGUgZ2l2ZW4gaW5kZXguIElmIG5vIGluZGV4IGlzIGdpdmVuLCB0aGUgY2hpbGRyZW4gYXJlIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihfY2hpbGRyZW4sIF90YXJnZXQsIF9pbmRleCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogVCA9IHRoaXMuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgLy8gVE9ETzogZG9uJ3QsIHdoZW4gY29weWluZyBvciBjb21pbmcgZnJvbSBhbm90aGVyIHNvdXJjZVxyXG4gICAgICB0aGlzLmRlbGV0ZShtb3ZlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXREYXRhOiBUID0gPFQ+X3RhcmdldDtcclxuICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kVmlzaWJsZSh0YXJnZXREYXRhKTtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKHRhcmdldERhdGEpKTtcclxuICAgICAgbGV0IG9sZDogVHJlZUxpc3Q8VD4gPSB0YXJnZXRJdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB0YXJnZXRJdGVtLmhhc0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgaWYgKG9sZClcclxuICAgICAgICBvbGQucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRhcmdldEl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5maW5kVmlzaWJsZShmb2N1cyk/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFeHBhbmQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGNoaWxkcmVuOiByZWFkb25seSBUW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKTtcclxuICAgICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKGNoaWxkcmVuKTtcclxuICAgICAgaXRlbS5zZXRCcmFuY2goYnJhbmNoKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQnJhbmNoKF9kYXRhOiByZWFkb25seSBUW10pOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gbmV3IFRyZWVMaXN0PFQ+KHRoaXMuY29udHJvbGxlciwgW10pO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfZGF0YSkge1xyXG4gICAgICAgIGJyYW5jaC5hZGRJdGVtcyhbbmV3IFRyZWVJdGVtKHRoaXMuY29udHJvbGxlciwgY2hpbGQpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJyYW5jaDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSBhc3luYyAoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG4gICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfU1RBUlQ6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdTdGFydChpdGVtLmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX09WRVI6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ092ZXIoX2V2ZW50KTtcclxuICAgICAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUk9QOlxyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kcm9wKF9ldmVudCk7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpbmRleFwiKTtcclxuICAgICAgICAgIGxldCBwYXJlbnQ6IFQgPSBSZWZsZWN0LmdldChfZXZlbnQsIFwicGFyZW50XCIpO1xyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbihvYmplY3RzLCBpbmRleCA9PSBudWxsID8gaXRlbS5kYXRhIDogcGFyZW50LCBpbmRleCk7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdMZWF2ZSA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgcmVsYXRlZFRhcmdldDogRXZlbnRUYXJnZXQgPSBfZXZlbnQucmVsYXRlZFRhcmdldDtcclxuICAgICAgaWYgKHJlbGF0ZWRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0KSAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0Lm9mZnNldFBhcmVudCkpIC8vIG9mZnNldCBwYXJlbnQgaXMgZm9yIHdlaXJkIChpbnZpc2libGUpIGRpdnMgd2hpY2ggYXJlIHBsYWNlZCBvdmVyIGlucHV0IGVsZW1lbnRzIGFuZCB0cmlnZ2VyIGxlYXZlIGV2ZW50cy4uLiBcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVtb3ZlOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZShyZW1vdmUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEVzY2FwZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDb3B5UGFzdGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmN1dCh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIC8vIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4ob2JqZWN0cywgdGFyZ2V0LmRhdGEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4ob2JqZWN0cywgdGFyZ2V0LmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YodGFyZ2V0KTtcclxuICAgICAgaWYgKGluZGV4IDwgMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5ICYmIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ubGVuZ3RoID09IDApXHJcbiAgICAgICAgdGFyZ2V0LnNlbGVjdCh0cnVlKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBpZiAoKytpbmRleCA8IGl0ZW1zLmxlbmd0aClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgaWYgKC0taW5kZXggPj0gMClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgKDxUcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KS5zZWxlY3QodHJ1ZSk7XHJcbiAgICAgIGVsc2UgaWYgKCFfZXZlbnQuY3RybEtleSlcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZVwiLCBUcmVlLCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9EYXRhQ29udHJvbGxlci50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEge0BsaW5rIFRyZWV9IHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIHtAbGluayBUcmVlfSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmVlQ29udHJvbGxlcjxUPiBleHRlbmRzIERhdGFDb250cm9sbGVyPFQ+IHtcclxuICAgIC8qKiBVc2VkIGJ5IHRoZSB0cmVlIHRvIGluZGljYXRlIHRoZSBkcm9wIHBvc2l0aW9uIHdoaWxlIGRyYWdnaW5nICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3BJbmRpY2F0b3I6IEhUTUxIUkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIik7XHJcblxyXG4gICAgLyoqIE92ZXJyaWRlIHRvIGVuYWJsZSB0cmVlIGl0ZW1zIHRvIGJlIHNvcnRhYmxlIGJ5IHRoZSB1c2VyIHZpYSBkcmFnLWFuZC1kcm9wLiBEZWZhdWx0IGlzIHRydWUuICovXHJcbiAgICBwdWJsaWMgc29ydGFibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgZHJhZ2dhYmxlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkcmFnZ2FibGUoX29iamVjdDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiB0d28gb2JqZWN0cyBvZiBhcmUgZXF1YWwuIERlZmF1bHQgaXMgX2EgPT0gX2IuIE92ZXJyaWRlIGZvciBtb3JlIGNvbXBsZXggY29tcGFyaXNvbnMuIFxyXG4gICAgICogVXNlZnVsIHdoZW4gdGhlIHVuZGVybHlpbmcgZGF0YSBpcyB2b2xhdGlsZSBhbmQgY2hhbmdlcyBpZGVudGl0eSB3aGlsZSBzdGF5aW5nIHRoZSBzYW1lLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzKF9hOiBULCBfYjogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2EgPT0gX2I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdmVycmlkZSBpZiBzb21lIG9iamVjdHMgc2hvdWxkIG5vdCBiZSBhZGRhYmxlIHRvIG90aGVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2FuQWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgXHJcbiAgICAvKiogQ3JlYXRlIGFuIEhUTUxFbGVtZW50IGZvciB0aGUgdHJlZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0LiBlLmcuIGFuIEhUTUxJbnB1dEVsZW1lbnQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFQpOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBsaXN0IGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgZm9yIGZ1cnRoZXIgc3R5bGluZyAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFByb2Nlc3MgdGhlIHByb3Bvc2VkIG5ldyB2YWx1ZS4gVGhlIGlkIG9mIHRoZSBodG1sIGVsZW1lbnQgb24gd2hpY2ggdGhlIGNoYW5nZSBvY2N1cmVkIGlzIHBhc3NlZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldFZhbHVlKF9vYmplY3Q6IFQsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGhhcyBjaGlsZHJlbiB0aGF0IG11c3QgYmUgc2hvd24gd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGhhc0NoaWxkcmVuKF9vYmplY3Q6IFQpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdGhlIG9iamVjdCdzIGNoaWxkcmVuIHRvIHNob3cgd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENoaWxkcmVuKF9vYmplY3Q6IFQpOiByZWFkb25seSBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUHJvY2VzcyB0aGUgbGlzdCBvZiBzb3VyY2Ugb2JqZWN0cyB0byBiZSBhZGRlZEFzQ2hpbGRyZW4gd2hlbiBkcm9wcGluZyBvciBwYXN0aW5nIG9udG8gdGhlIHRhcmdldCBpdGVtL29iamVjdCwgXHJcbiAgICAgKiByZXR1cm4gdGhlIGxpc3Qgb2Ygb2JqZWN0cyB0aGF0IHNob3VsZCB2aXNpYmx5IGJlY29tZSB0aGUgY2hpbGRyZW4gb2YgdGhlIHRhcmdldCBpdGVtL29iamVjdCBcclxuICAgICAqIEBwYXJhbSBfY2hpbGRyZW4gQSBsaXN0IG9mIG9iamVjdHMgdGhlIHRyZWUgdHJpZXMgdG8gYWRkIHRvIHRoZSBfdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0gX3RhcmdldCBUaGUgb2JqZWN0IHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW0gdGhlIGRyb3Agb2NjdXJzIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBhZGRDaGlsZHJlbihfc291cmNlczogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiBUW107XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIGxpLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIHtAbGluayBUcmVlTGlzdH0gd2l0aCBhIGNoZWNrYm94IGFuZCB1c2VyIGRlZmluZWQgaW5wdXQgZWxlbWVudHMgYXMgY29udGVudC5cclxuICAgKiBBZGRpdGlvbmFsbHksIG1heSBob2xkIGFuIGluc3RhbmNlIG9mIHtAbGluayBUcmVlTGlzdH0gYXMgYnJhbmNoIHRvIGRpc3BsYXkgY2hpbGRyZW4gb2YgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlSXRlbTxUPiBleHRlbmRzIEhUTUxMSUVsZW1lbnQge1xyXG4gICAgcHVibGljIGNsYXNzZXM6IENTU19DTEFTU1tdID0gW107XHJcbiAgICBwdWJsaWMgZGF0YTogVCA9IG51bGw7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja2JveDogSFRNTElucHV0RWxlbWVudDtcclxuICAgICNjb250ZW50OiBIVE1MRmllbGRTZXRFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBUKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihfZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kRGJsQ2xpY2spO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRoaXMuY29udHJvbGxlci5kcmFnZ2FibGUoX2RhdGEpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnU3RhcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0VOVEVSLCB0aGlzLmhuZERyYWdPdmVyKTsgLy8gdGhpcyBwcmV2ZW50cyBjdXJzb3IgZnJvbSBmbGlja2VyaW5nXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0VOVEVSLCB0aGlzLmhuZERyYWdEcm9wKTsgLy8gdGhpcyBwcmV2ZW50cyBjdXJzb3IgZnJvbSBmbGlja2VyaW5nXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QT0lOVEVSX1VQLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRU1PVkVfQ0hJTEQsIHRoaXMuaG5kUmVtb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSwgd2hlbiB0aGlzIGl0ZW0gaGFzIGEgdmlzaWJsZSBjaGVja2JveCBpbiBmcm9udCB0byBleHBhbmQgdGhlIHN1YnNlcXVlbnQgYnJhbmNoIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ICE9IFwiaGlkZGVuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93cyBvciBoaWRlcyB0aGUgY2hlY2tib3ggZm9yIGV4cGFuZGluZyB0aGUgc3Vic2VxdWVudCBicmFuY2hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBoYXNDaGlsZHJlbihfaGFzOiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSA9IF9oYXMgPyBcInZpc2libGVcIiA6IFwiaGlkZGVuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHtAbGluayBDU1NfQ0xBU1MuU0VMRUNURUR9IGlzIGF0dGFjaGVkIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZChfb246IGJvb2xlYW4pIHtcclxuICAgICAgaWYgKF9vbilcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCByZXByZXNlbnRpbmcgdGhlIGF0dGFjaGVkIHtAbGluayBkYXRhfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGNvbnRlbnQoKTogSFRNTEZpZWxkU2V0RWxlbWVudCB7XHJcbiAgICAgIHJldHVybiB0aGlzLiNjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgaXRlbSBpcyBleHBhbmRlZCwgc2hvd2luZyBpdCdzIGNoaWxkcmVuLCBvciBjbG9zZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QnJhbmNoKCkgJiYgdGhpcy5jaGVja2JveC5jaGVja2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoQXR0cmlidXRlcygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJhdHRyaWJ1dGVzXCIsIHRoaXMuY29udHJvbGxlci5nZXRBdHRyaWJ1dGVzKHRoaXMuZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy4jY29udGVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLiNjb250ZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5jcmVhdGVDb250ZW50KHRoaXMuZGF0YSkpO1xyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgZm9yIChjb25zdCBkZXNjZW5kYW50IG9mIDxOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj50aGlzLiNjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbdGl0bGVdXCIpKSBcclxuICAgICAgICB0aGlzLnRpdGxlICs9IGRlc2NlbmRhbnQudGl0bGUgKyBcIlxcblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZXMgdG8gZXhwYW5kaW5nIHRoZSB7QGxpbmsgVHJlZUxpc3R9IG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyB7QGxpbmsgRVZFTlQuRVhQQU5EfS5cclxuICAgICAqIFRoZSB1c2VyIG9mIHRoZSB0cmVlIG5lZWRzIHRvIGFkZCBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgdHJlZSBcclxuICAgICAqIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGF0IHtAbGluayBUcmVlTGlzdH0gYW5kIGFkZCBpdCBhcyBicmFuY2ggdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG5cclxuICAgICAgaWYgKF9leHBhbmQpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FWFBBTkQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmNoZWNrYm94LmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICAgIC8vICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpKS5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBkYXRhIHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW1zIHN1Y2NlZWRpbmcgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VmlzaWJsZURhdGEoKTogVFtdIHtcclxuICAgICAgbGV0IGxpc3Q6IE5vZGVMaXN0T2Y8SFRNTExJRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRhdGE6IFRbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpXHJcbiAgICAgICAgZGF0YS5wdXNoKCg8VHJlZUl0ZW08VD4+aXRlbSkuZGF0YSk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS4gVGhlIGJyYW5jaCBtdXN0IGJlIGEgcHJldmlvdXNseSBjb21waWxlZCB7QGxpbmsgVHJlZUxpc3R9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRCcmFuY2goX2JyYW5jaDogVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuICAgICAgaWYgKF9icmFuY2gpXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChfYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBvZiB0aGlzIGl0ZW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCcmFuY2goKTogVHJlZUxpc3Q8VD4ge1xyXG4gICAgICByZXR1cm4gPFRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgdGhlIHtAbGluayBFVkVOVC5TRUxFQ1R9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5nZXRCcmFuY2goKTtcclxuICAgICAgaWYgKCFicmFuY2gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnJlbW92ZUNoaWxkKGJyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuICAgICAgdGhpcy4jY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLiNjb250ZW50KTtcclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICghdGhpcy4jY29udGVudC5kaXNhYmxlZCkge1xyXG4gICAgICAgIGlmIChfZXZlbnQuY29kZSA9PSDGki5LRVlCT0FSRF9DT0RFLkVTQyB8fCBfZXZlbnQuY29kZSA9PSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSKVxyXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5oYXNDaGlsZHJlbiAmJiAhdGhpcy5leHBhbmRlZClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuZXhwYW5kZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMuI2NvbnRlbnQuZWxlbWVudHMuaXRlbSgwKTtcclxuICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERibENsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KF9ldmVudC5wYWdlWCwgX2V2ZW50LnBhZ2VZKTsgLy8gZGlzYWJsZWQgZWxlbWVudHMgZG9uJ3QgZGlzcGF0Y2ggY2xpY2sgZXZlbnRzLCBnZXQgdGhlIGVsZW1lbnQgbWFudWFsbHlcclxuICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIHRhcmdldC50eXBlID09IFwiY2hlY2tib3hcIikge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kKHRhcmdldC5jaGVja2VkKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCByZW5hbWVkOiBib29sZWFuID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnNldFZhbHVlKHRoaXMuZGF0YSwgdGFyZ2V0KTtcclxuXHJcbiAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG5cclxuICAgICAgaWYgKHJlbmFtZWQpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJPUClcclxuICAgICAgLy8gICBkZWJ1Z2dlcjtcclxuICAgICAgaWYgKFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgLy8gc3RvcmUgdGhlIGRyYWdnZWQgaXRlbSBpbiB0aGUgZXZlbnQgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZyBpbiB0YWJsZVxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiaXRlbVwiLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoUmVmbGVjdC5nZXQoX2V2ZW50LCBcImRyYWdQcm9jZXNzZWRcIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHJlY3Q6IERPTVJlY3QgPSB0aGlzLiNjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICBsZXQgdXBwZXI6IG51bWJlciA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKiAoMSAvIDQpO1xyXG4gICAgICBsZXQgbG93ZXI6IG51bWJlciA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKiAoMyAvIDQpO1xyXG4gICAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSBfZXZlbnQuY2xpZW50WTtcclxuICAgICAgaWYgKHRoaXMucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIFRyZWUgfHwgKG9mZnNldCA+IHVwcGVyICYmIChvZmZzZXQgPCBsb3dlciB8fCB0aGlzLmNoZWNrYm94LmNoZWNrZWQpKSB8fCAhdGhpcy5jb250cm9sbGVyLnNvcnRhYmxlKSB7XHJcbiAgICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcImRyYWdQcm9jZXNzZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgaWYgKF9ldmVudC50eXBlID09IEVWRU5ULkRSQUdfT1ZFUilcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmNhbkFkZENoaWxkcmVuKENsaXBib2FyZC5kcmFnRHJvcC5nZXQoKSwgdGhpcy5kYXRhKSkge1xyXG4gICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUmVtb3ZlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhlIHZpZXdzIG1pZ2h0IG5lZWQgdG8ga25vdyBhYm91dCB0aGlzIGV2ZW50XHJcbiAgICAgIC8vIGlmIChfZXZlbnQuY3VycmVudFRhcmdldCA9PSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAvLyAgIHJldHVybjtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibGktdHJlZS1pdGVtXCIsIFRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICBleHBvcnQgdHlwZSBEUk9QRUZGRUNUID0gXCJub25lXCIgfCBcImNvcHlcIiB8IFwibGlua1wiIHwgXCJtb3ZlXCI7XHJcblxyXG4gIGV4cG9ydCBjb25zdCBlbnVtIEVWRU5UIHtcclxuICAgIENMSUNLID0gXCJjbGlja1wiLFxyXG4gICAgRE9VQkxFX0NMSUNLID0gXCJkYmxjbGlja1wiLFxyXG4gICAgS0VZX0RPV04gPSBcImtleWRvd25cIixcclxuICAgIERSQUdfU1RBUlQgPSBcImRyYWdzdGFydFwiLFxyXG4gICAgRFJBR19FTlRFUiA9IFwiZHJhZ2VudGVyXCIsXHJcbiAgICBEUkFHX09WRVIgPSBcImRyYWdvdmVyXCIsXHJcbiAgICBEUkFHX0xFQVZFID0gXCJkcmFnbGVhdmVcIixcclxuICAgIERST1AgPSBcImRyb3BcIixcclxuICAgIFBPSU5URVJfVVAgPSBcInBvaW50ZXJ1cFwiLFxyXG4gICAgV0hFRUwgPSBcIndoZWVsXCIsXHJcbiAgICBGT0NVU19ORVhUID0gXCJmb2N1c05leHRcIixcclxuICAgIEZPQ1VTX1BSRVZJT1VTID0gXCJmb2N1c1ByZXZpb3VzXCIsXHJcbiAgICBGT0NVU19JTiA9IFwiZm9jdXNpblwiLFxyXG4gICAgRk9DVVNfT1VUID0gXCJmb2N1c291dFwiLFxyXG4gICAgRk9DVVNfU0VUID0gXCJmb2N1c1NldFwiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBUT0dHTEUgPSBcInRvZ2dsZVwiLFxyXG4gICAgUE9JTlRFUl9NT1ZFID0gXCJwb2ludGVybW92ZVwiLFxyXG4gICAgSU5TRVJUID0gXCJpbnNlcnRcIixcclxuICAgIFNFTEVDVF9BTEwgPSBcInNlbGVjdEFsbFwiLFxyXG4gICAgU0FWRV9ISVNUT1JZID0gXCJzYXZlSGlzdG9yeVwiXHJcbiAgfVxyXG59Il19