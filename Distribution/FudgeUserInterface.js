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
            /** [[FudgeCore.Mutator]] used to store the data types of the mutator attributes*/
            this.mutatorTypes = null;
            this.mutateOnInput = async (_event) => {
                let path = [];
                for (let target of _event.composedPath()) {
                    if (target == this.domElement)
                        break;
                    let key = target.getAttribute("key");
                    if (key)
                        path.push(key);
                }
                path.reverse();
                // get current mutator and save for undo
                let mutator = this.mutable.getMutator();
                FudgeUserInterface.History.save("mutate", this.mutable, ƒ.Mutable.getMutatorFromPath(mutator, path));
                // get current mutator from interface for mutation  
                this.mutator = this.getMutator();
                await this.mutable.mutate(ƒ.Mutable.getMutatorFromPath(this.mutator, path));
                _event.stopPropagation();
                this.domElement.dispatchEvent(new Event("mutate" /* EVENT.MUTATE */, { bubbles: true }));
            };
            this.rearrangeArray = async (_event) => {
                let sequence = _event.detail.sequence;
                let path = [];
                let details = _event.target;
                let mutable;
                { // find the MutableArray connected to this DetailsArray
                    let element = details;
                    while (element != this.domElement) {
                        if (element.getAttribute("key"))
                            path.push(element.getAttribute("key"));
                        element = element.parentElement;
                    }
                    // console.log(path);
                    mutable = this.mutable;
                    for (let key of path)
                        mutable = Reflect.get(mutable, key);
                }
                // rearrange that mutable
                mutable.rearrange(sequence);
                await this.mutable.mutate(this.mutable.getMutator());
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
            // TODO: examine if this.mutator should also be addressed in some way...
            let mutator = _mutator || _mutable.getMutatorForUserInterface();
            // TODO: Mutator type now only used for enums. Examine if there is another way
            let mutatorTypes = _types || _mutable.getMutatorAttributeTypes(mutator);
            for (let key in mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (element == null)
                    continue;
                if (element instanceof FudgeUserInterface.CustomElement)
                    mutator[key] = element.getMutatorValue();
                else if (element instanceof HTMLInputElement)
                    mutator[key] = element.value;
                else if (mutatorTypes[key] instanceof Object)
                    // TODO: setting a value of the dom element doesn't make sense... examine what this line was supposed to do. Assumably enums
                    mutator[key] = element.value;
                else {
                    let subMutator = Reflect.get(mutator, key);
                    let subMutable;
                    subMutable = Reflect.get(_mutable, key);
                    if (subMutable instanceof ƒ.MutableArray || subMutable instanceof ƒ.Mutable)
                        mutator[key] = this.getMutator(subMutable, element, subMutator); //, subTypes);
                }
            }
            return mutator;
        }
        /**
         * Recursive method taking the [[ƒ.Mutator]] of a [[ƒ.Mutable]] and updating the UI-domElement accordingly.
         * If an additional [[ƒ.Mutator]] is passed, its values are used instead of those of the [[ƒ.Mutable]].
         */
        static updateUserInterface(_mutable, _domElement, _mutator) {
            let mutator = _mutator || _mutable.getMutatorForUserInterface();
            let mutatorTypes = _mutable.getMutatorAttributeTypes(mutator);
            for (let key in mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (!element)
                    continue;
                let value = mutator[key];
                if (element instanceof FudgeUserInterface.CustomElement && element != document.activeElement)
                    element.setMutatorValue(value);
                else if (mutatorTypes[key] instanceof Object)
                    element.setMutatorValue(value);
                else {
                    let subMutable = Reflect.get(_mutable, key);
                    if (subMutable instanceof ƒ.MutableArray || subMutable instanceof ƒ.Mutable)
                        this.updateUserInterface(subMutable, element, mutator[key]);
                    else
                        //element.setMutatorValue(value);
                        Reflect.set(element, "value", value);
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
        // public static findChildElementByKey(_domElement: HTMLElement, _key: string): HTMLElement {
        //   return _domElement.querySelector(`:scope > [key="${_key}"]`) ?? _domElement.querySelector(`:scope > * > [key="${_key}"]`);
        // }
        /**
         * Performs a breadth-first search on the given _domElement for an element with the given key.
         */
        // public static findChildElementByKey(_domElement: HTMLElement, _key: string): HTMLElement {
        //   let queue: HTMLElement[] = [_domElement];
        //   while (queue.length > 0) {
        //     let element: HTMLElement = queue.shift();
        //     if (element.matches(`[key="${_key}"]`))
        //       return element;
        //     queue.push(...<HTMLElement[]>Array.from(element.children));
        //   }
        //   return null;
        // }
        getMutator(_mutator, _types) {
            // TODO: should get Mutator for UI or work with this.mutator (examine)
            this.mutable.updateMutator(this.mutator);
            return Controller.getMutator(this.mutable, this.domElement, _mutator, _types);
        }
        updateUserInterface() {
            Controller.updateUserInterface(this.mutable, this.domElement);
        }
        setMutable(_mutable) {
            this.mutable = _mutable;
            this.mutator = _mutable.getMutatorForUserInterface();
            if (_mutable instanceof ƒ.Mutable)
                this.mutatorTypes = _mutable.getMutatorAttributeTypes(this.mutator);
        }
        getMutable() {
            return this.mutable;
        }
        startRefresh() {
            window.clearInterval(this.idInterval);
            this.idInterval = window.setInterval(this.refresh, this.timeUpdate);
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
            let mutator = _mutator || _mutable.getMutatorForUserInterface();
            let mutatorTypes = _mutable.getMutatorAttributeTypes(mutator);
            let div = document.createElement("div");
            for (let key in mutatorTypes) {
                let type = mutatorTypes[key];
                let value = mutator[key];
                let element = Generator.createMutatorElement(key, type, value);
                if (!element) {
                    let subMutable = Reflect.get(_mutable, key);
                    element = Generator.createDetailsFromMutable(subMutable, key, value);
                }
                if (!element && type)
                    element = new FudgeUserInterface.CustomElementOutput({ key: key, label: key, type: type.toString(), value: value?.toString(), placeholder: `Drop your ${type} here...` });
                if (!element) { // undefined values without a type can't be displayed
                    console.warn("No interface created for ", _mutable.constructor.name, key);
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
                let value = Reflect.get(_mutator, key);
                // if (value === undefined) // at this time (1/23) adding a property to an animation in the editor creates an empty keys list...
                // {
                //   div.appendChild(this.createMutatorElement(key, Object, {})); 
                //   continue;
                // }
                if (value instanceof Object) {
                    // let details: Details = Generator.createDetails(key, "Details");
                    let details = new FudgeUserInterface.Details(key, "Details");
                    details.setContent(Generator.createInterfaceFromMutator(value));
                    div.appendChild(details);
                }
                else
                    div.appendChild(this.createMutatorElement(key, value.constructor.name, value));
            }
            return div;
        }
        /**
         * Create a specific CustomElement for the given data, using _key as identification
         */
        static createMutatorElement(_key, _type, _value) {
            let element;
            try {
                if (_type instanceof Object) {
                    let elementType = FudgeUserInterface.CustomElement.get("Object");
                    // @ts-ignore: instantiate abstract class
                    element = new elementType({ key: _key, label: _key, value: _value.toString() }, _type);
                }
                else if (_value instanceof ƒ.MutableArray) { // TODO: delete?
                    console.log("MutableArray");
                    // insert Array-Controller!
                }
                else {
                    let elementType = FudgeUserInterface.CustomElement.get(_type);
                    if (!elementType)
                        return element;
                    // @ts-ignore: instantiate abstract class
                    element = new elementType({ key: _key, label: _key, value: _value?.toString() });
                }
            }
            catch (_error) {
                ƒ.Debug.fudge(_error);
            }
            return element;
        }
        /**
         * TODO: refactor for enums
         */
        static createDropdown(_name, _content, _value, _parent, _cssClass) {
            let dropdown = document.createElement("select");
            dropdown.name = _name;
            for (let value in _content) {
                let entry = document.createElement("option");
                entry.text = value;
                entry.value = value;
                if (value.toUpperCase() == _value.toUpperCase()) {
                    entry.selected = true;
                }
                dropdown.add(entry);
            }
            _parent.appendChild(dropdown);
            return dropdown;
        }
    }
    FudgeUserInterface.Generator = Generator;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    class History {
        static #steps = [];
        static async save(_action, _owner, _owned) {
            History.#steps.push([_action, _owner, _owned]);
            this.undoLog();
        }
        ;
        static async undo() {
            let step = History.#steps.pop();
            if (step) {
                let action = step[0];
                let owner = step[1];
                if (owner instanceof ƒ.Node) {
                    console.log(action, "Owner is node", owner);
                }
                else if (owner instanceof ƒ.Project) {
                    console.log(action, "Owner is project", owner);
                }
                else {
                    await owner.mutate(step[1]);
                    if (owner instanceof ƒ.ComponentRigidbody) {
                        owner.isInitialized = false;
                        owner.mutate({}); // just to dispatch mutation event again
                    }
                }
            }
        }
        static undoLog() {
            console.group("History");
            History.#steps.forEach(_step => console.log(_step[0], _step[1].constructor.name, _step[2] instanceof ƒ.Mutable || _step[2] instanceof ƒ.Node ?
                _step[2].constructor.name :
                _step[2]));
            console.groupEnd();
        }
        ;
        /**
         * In case the order of the last two steps needs to be changed, use this method
         */
        static swap() {
            let stepLast = History.#steps.pop();
            let stepPrev = History.#steps.pop();
            History.#steps.push(stepLast);
            History.#steps.push(stepPrev);
            this.undoLog();
        }
    }
    FudgeUserInterface.History = History;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Handles the mapping of CustomElements to their HTML-Tags via customElement.define
     * and to the data types and [[FudgeCore.Mutable]]s they render an interface for.
     */
    class CustomElement extends HTMLElement {
        static { this.mapObjectToCustomElement = new Map(); }
        static { this.idCounter = 0; }
        constructor(_attributes) {
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
                CustomElement.map(_typeObject.name, _typeCustomElement);
        }
        /**
         * Retrieve the element representing the given data type (if registered)
         */
        static get(_type) {
            let element = CustomElement.mapObjectToCustomElement.get(_type);
            if (typeof (element) == "string")
                element = customElements.get(element);
            return element;
        }
        static map(_type, _typeCustomElement) {
            ƒ.Debug.fudge("Map", _type, _typeCustomElement.name);
            CustomElement.mapObjectToCustomElement.set(_type, _typeCustomElement);
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
            return this.color.getMutatorForUserInterface();
        }
        /**
         * Sets the values of color picker and slider
         */
        setMutatorValue(_value) {
            this.color.mutate(_value);
            let hex = this.color.getHex();
            this.querySelector("input[type=color").value = "#" + hex.substr(0, 6);
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
                    console.log(`Couldn't find ${key} in`, this);
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
                console.log(value, this.value);
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
                        console.log("INSERT at Details");
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
                console.log("hndInsert");
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
                console.log(child.tabIndex);
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
                            ƒ.Debug.info(_e);
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
    // TODO: duplicated code in Table and Tree, may be optimized...
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
                console.log(_event);
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
                // let relatedTarget: EventTarget = _event.relatedTarget;
                // if (relatedTarget instanceof HTMLElement && !this.contains(relatedTarget) && !this.contains(relatedTarget.offsetParent)) // offset parent is for weird (invisible) divs which are placed over input elements and trigger leave events... 
                //   this.controller.dragDropIndicator.remove();
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
                console.log(_event);
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
                        this.addChildren(objects, target.data);
                        this.parentElement.dispatchEvent(new Event("paste" /* EVENT.PASTE */, { bubbles: true }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ29udHJvbGxlci9IaXN0b3J5LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE91dHB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RhdGFDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EZXRhaWxzLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EZXRhaWxzQXJyYXkudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RpYWxvZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvTXVsdGlMZXZlbE1lbnUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1dhcm5pbmcudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUNvbnRyb2xsZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlTGlzdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvRXZlbnQvRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFB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WixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQztLQTBKRjtJQS9UWSwyQkFBUSxXQStUcEIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLENBQUMsRUF6VVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXlVM0IiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBDb21tb24gY2xpcGJvYXJkcyBmb3IgYWxsIGRyYWctZHJvcCBhbmQgY29weS1wYXN0ZSBvcGVyYXRpb25zIGhhcHBlbmluZyBpbiB0aGUgdXNlciBpbnRlcmZhY2VcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDI0XHJcbiAgICovXHJcblxyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBleHBvcnQgdHlwZSBDbGlwT3BlcmF0aW9uID0gRVZFTlQuQ09QWSB8IEVWRU5ULkNVVDtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENsaXBib2FyZCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRyYWdEcm9wOiBDbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHlQYXN0ZTogQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgpO1xyXG4gICAgcHVibGljIG9iamVjdHM6IMaSLkdlbmVyYWxbXSA9IFtdO1xyXG4gICAgcHVibGljIG9wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0PFQ+KCk6IFRbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm9iamVjdHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0KF9vYmplY3RzOiBPYmplY3RbXSwgX29wZXJhdGlvbj86IENsaXBPcGVyYXRpb24pOiB2b2lkIHtcclxuICAgICAgdGhpcy5vYmplY3RzID0gX29iamVjdHMuc2xpY2UoKTtcclxuICAgICAgdGhpcy5vcGVyYXRpb24gPSBfb3BlcmF0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyAvIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiLz4gLy8gVE9ETzogbm93IHRoYXQgd2UgdXNlIHBhY2thZ2UgcmVmZXJlbmNlcyBpbiB0aGUgdHNjb25maWcsIHRoaXMgZmlsZSBpcyBvYnNvbGV0ZSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29ubmVjdHMgYSBbW011dGFibGVdXSB0byBhIERPTS1FbGVtZW50IGFuZCBzeW5jaHJvbml6ZXMgdGhhdCBtdXRhYmxlIHdpdGggdGhlIG11dGF0b3Igc3RvcmVkIHdpdGhpbi5cclxuICAgKiBVcGRhdGVzIHRoZSBtdXRhYmxlIG9uIGludGVyYWN0aW9uIHdpdGggdGhlIGVsZW1lbnQgYW5kIHRoZSBlbGVtZW50IGluIHRpbWUgaW50ZXJ2YWxzLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgIC8vIFRPRE86IGV4YW1pbmUgdGhlIHVzZSBvZiB0aGUgYXR0cmlidXRlIGtleSB2cyBuYW1lLiBLZXkgc2lnbmFscyB0aGUgdXNlIGJ5IEZVREdFIHdoaWxlIG5hbWUgaXMgc3RhbmRhcmQgYW5kIHN1cHBvcnRlZCBieSBmb3Jtc1xyXG4gICAgcHVibGljIGRvbUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHRpbWVVcGRhdGU6IG51bWJlciA9IDE5MDtcclxuICAgIC8qKiBSZWZlcmVyZW5jZSB0byB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHRoaXMgdWkgcmVmZXJzIHRvICovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBjb252ZXkgZGF0YSB0byBhbmQgZnJvbSB0aGUgbXV0YWJsZSovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRvcjogxpIuTXV0YXRvcjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBzdG9yZSB0aGUgZGF0YSB0eXBlcyBvZiB0aGUgbXV0YXRvciBhdHRyaWJ1dGVzKi9cclxuICAgIHByb3RlY3RlZCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3IgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgaWRJbnRlcnZhbDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudCA9IF9kb21FbGVtZW50O1xyXG4gICAgICB0aGlzLnNldE11dGFibGUoX211dGFibGUpO1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lLCBpZiB0aGlzIHNob3VsZCByZWdpc3RlciB0byBvbmUgY29tbW9uIGludGVydmFsLCBpbnN0ZWFkIG9mIGVhY2ggaW5zdGFsbGluZyBpdHMgb3duLlxyXG4gICAgICB0aGlzLnN0YXJ0UmVmcmVzaCgpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgdGhpcy5tdXRhdGVPbklucHV0KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVBUlJBTkdFX0FSUkFZLCB0aGlzLnJlYXJyYW5nZUFycmF5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIGFuIGV4aXN0aW5nIFtbxpIuTXV0YXRvcl1dIGFzIGEgdGVtcGxhdGUgXHJcbiAgICAgKiBhbmQgdXBkYXRpbmcgaXRzIHZhbHVlcyB3aXRoIHRob3NlIGZvdW5kIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50LiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVNdXRhdG9yKF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKF9tdXRhdG9yW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGVsZW1lbnQsIF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gX211dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgYSBbW8aSLk11dGFibGVdXSBhcyBhIHRlbXBsYXRlIHRvIGNyZWF0ZSBhIFtbxpIuTXV0YXRvcl1dIG9yIHVwZGF0ZSB0aGUgZ2l2ZW4gW1vGki5NdXRhdG9yXV0gXHJcbiAgICAgKiB3aXRoIHRoZSB2YWx1ZXMgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNdXRhdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lIGlmIHRoaXMubXV0YXRvciBzaG91bGQgYWxzbyBiZSBhZGRyZXNzZWQgaW4gc29tZSB3YXkuLi5cclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAvLyBUT0RPOiBNdXRhdG9yIHR5cGUgbm93IG9ubHkgdXNlZCBmb3IgZW51bXMuIEV4YW1pbmUgaWYgdGhlcmUgaXMgYW5vdGhlciB3YXlcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX3R5cGVzIHx8IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSAoPEN1c3RvbUVsZW1lbnQ+ZWxlbWVudCkuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgLy8gVE9ETzogc2V0dGluZyBhIHZhbHVlIG9mIHRoZSBkb20gZWxlbWVudCBkb2Vzbid0IG1ha2Ugc2Vuc2UuLi4gZXhhbWluZSB3aGF0IHRoaXMgbGluZSB3YXMgc3VwcG9zZWQgdG8gZG8uIEFzc3VtYWJseSBlbnVtc1xyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gKDxIVE1MU2VsZWN0RWxlbWVudD5lbGVtZW50KS52YWx1ZTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhdG9yOiDGki5NdXRhdG9yID0gUmVmbGVjdC5nZXQobXV0YXRvciwga2V5KTtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlO1xyXG4gICAgICAgICAgc3ViTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIG11dGF0b3Jba2V5XSA9IHRoaXMuZ2V0TXV0YXRvcihzdWJNdXRhYmxlLCBlbGVtZW50LCBzdWJNdXRhdG9yKTsgLy8sIHN1YlR5cGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgW1vGki5NdXRhdG9yXV0gb2YgYSBbW8aSLk11dGFibGVdXSBhbmQgdXBkYXRpbmcgdGhlIFVJLWRvbUVsZW1lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgKiBJZiBhbiBhZGRpdGlvbmFsIFtbxpIuTXV0YXRvcl1dIGlzIHBhc3NlZCwgaXRzIHZhbHVlcyBhcmUgdXNlZCBpbnN0ZWFkIG9mIHRob3NlIG9mIHRoZSBbW8aSLk11dGFibGVdXS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVVc2VySW50ZXJmYWNlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGxldCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGUgPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmIChzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5IHx8IHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2Uoc3ViTXV0YWJsZSwgZWxlbWVudCwgbXV0YXRvcltrZXldKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgLy9lbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwidmFsdWVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPCAyKVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50c1swXTtcclxuXHJcbiAgICAgIGxldCBzaG9ydGVzdFBhdGg6IG51bWJlciA9IEluZmluaXR5O1xyXG4gICAgICBsZXQgY2xvc2VzdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBwYXJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDsgcGFyZW50RWxlbWVudCAhPSBfZG9tRWxlbWVudDsgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgaWYgKGNvdW50IDwgc2hvcnRlc3RQYXRoKSB7XHJcbiAgICAgICAgICBjbG9zZXN0RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBzaG9ydGVzdFBhdGggPSBjb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjbG9zZXN0RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIC8vICAgcmV0dXJuIF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYDpzY29wZSA+IFtrZXk9XCIke19rZXl9XCJdYCkgPz8gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihgOnNjb3BlID4gKiA+IFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIG9uIHRoZSBnaXZlbiBfZG9tRWxlbWVudCBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gICBsZXQgcXVldWU6IEhUTUxFbGVtZW50W10gPSBbX2RvbUVsZW1lbnRdO1xyXG4gICAgLy8gICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAvLyAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhgW2tleT1cIiR7X2tleX1cIl1gKSlcclxuICAgIC8vICAgICAgIHJldHVybiBlbGVtZW50O1xyXG5cclxuICAgIC8vICAgICBxdWV1ZS5wdXNoKC4uLjxIVE1MRWxlbWVudFtdPkFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbikpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yKF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICAvLyBUT0RPOiBzaG91bGQgZ2V0IE11dGF0b3IgZm9yIFVJIG9yIHdvcmsgd2l0aCB0aGlzLm11dGF0b3IgKGV4YW1pbmUpXHJcbiAgICAgIHRoaXMubXV0YWJsZS51cGRhdGVNdXRhdG9yKHRoaXMubXV0YXRvcik7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyLmdldE11dGF0b3IodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQsIF9tdXRhdG9yLCBfdHlwZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICBDb250cm9sbGVyLnVwZGF0ZVVzZXJJbnRlcmZhY2UodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXV0YWJsZSA9IF9tdXRhYmxlO1xyXG4gICAgICB0aGlzLm11dGF0b3IgPSBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIHRoaXMubXV0YXRvclR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKHRoaXMubXV0YXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGFibGUoKTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11dGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0UmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucmVmcmVzaCwgdGhpcy50aW1lVXBkYXRlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJvdGVjdGVkIG11dGF0ZU9uSW5wdXQgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIF9ldmVudC5jb21wb3NlZFBhdGgoKSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gdGhpcy5kb21FbGVtZW50KVxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+dGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGtleSlcclxuICAgICAgICAgIHBhdGgucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIHBhdGgucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgLy8gZ2V0IGN1cnJlbnQgbXV0YXRvciBhbmQgc2F2ZSBmb3IgdW5kb1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHRoaXMubXV0YWJsZS5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIEhpc3Rvcnkuc2F2ZShcIm11dGF0ZVwiLCB0aGlzLm11dGFibGUsIMaSLk11dGFibGUuZ2V0TXV0YXRvckZyb21QYXRoKG11dGF0b3IsIHBhdGgpKTtcclxuXHJcbiAgICAgIC8vIGdldCBjdXJyZW50IG11dGF0b3IgZnJvbSBpbnRlcmZhY2UgZm9yIG11dGF0aW9uICBcclxuICAgICAgdGhpcy5tdXRhdG9yID0gdGhpcy5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUoxpIuTXV0YWJsZS5nZXRNdXRhdG9yRnJvbVBhdGgodGhpcy5tdXRhdG9yLCBwYXRoKSk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFycmFuZ2VBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnNlcXVlbmNlO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHNBcnJheSA9IDxEZXRhaWxzQXJyYXk+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47XHJcblxyXG4gICAgICB7IC8vIGZpbmQgdGhlIE11dGFibGVBcnJheSBjb25uZWN0ZWQgdG8gdGhpcyBEZXRhaWxzQXJyYXlcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkZXRhaWxzO1xyXG4gICAgICAgIHdoaWxlIChlbGVtZW50ICE9IHRoaXMuZG9tRWxlbWVudCkge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKVxyXG4gICAgICAgICAgICBwYXRoLnB1c2goZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgbXV0YWJsZSA9IHRoaXMubXV0YWJsZTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgcGF0aClcclxuICAgICAgICAgIG11dGFibGUgPSBSZWZsZWN0LmdldChtdXRhYmxlLCBrZXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZWFycmFuZ2UgdGhhdCBtdXRhYmxlXHJcbiAgICAgICg8xpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+Pjx1bmtub3duPm11dGFibGUpLnJlYXJyYW5nZShzZXF1ZW5jZSk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUodGhpcy5tdXRhYmxlLmdldE11dGF0b3IoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWZyZXNoID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5kb21FbGVtZW50KSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIGdlbmVyYXRpbmcgVUktZG9tRWxlbWVudHMgZnJvbSB0aGUgaW5mb3JtYXRpb24gZm91bmQgaW4gW1vGki5NdXRhYmxlXV1zIGFuZCBbW8aSLk11dGF0b3JdXXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFtbQ29udHJvbGxlcl1dIGZyb20gYSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV0gd2l0aCBleHBhbmRhYmxlIGRldGFpbHMgb3IgYSBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ29udHJvbGxlcihfbXV0YWJsZTogxpIuTXV0YWJsZSwgX25hbWU/OiBzdHJpbmcpOiBDb250cm9sbGVyIHtcclxuICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihfbXV0YWJsZSwgR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZSwgX25hbWUpKTtcclxuICAgICAgY29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGV4dGVuZGFibGUgZGV0YWlscyBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbmFtZT86IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogRGV0YWlscyB8IERldGFpbHNBcnJheSB7XHJcbiAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfbmFtZSB8fCBfbXV0YWJsZS5jb25zdHJ1Y3Rvci5uYW1lO1xyXG5cclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHMgfCBEZXRhaWxzQXJyYXk7XHJcbiAgICAgIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShuYW1lKTtcclxuICAgICAgZWxzZSBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIGRldGFpbHMgPSBuZXcgRGV0YWlscyhuYW1lLCBfbXV0YWJsZS50eXBlKTtcclxuICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGRldGFpbHMuc2V0Q29udGVudChHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGUsIF9tdXRhdG9yKSk7XHJcbiAgICAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGl2LUVsZW1lbnRzIGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMobXV0YXRvcik7XHJcbiAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yVHlwZXMpIHtcclxuICAgICAgICBsZXQgdHlwZTogT2JqZWN0ID0gbXV0YXRvclR5cGVzW2tleV07XHJcbiAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBtdXRhdG9yW2tleV07XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZU11dGF0b3JFbGVtZW50KGtleSwgdHlwZSwgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+ID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBlbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShzdWJNdXRhYmxlLCBrZXksIDzGki5NdXRhdG9yPnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCAmJiB0eXBlKVxyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50T3V0cHV0KHsga2V5OiBrZXksIGxhYmVsOiBrZXksIHR5cGU6IHR5cGUudG9TdHJpbmcoKSwgdmFsdWU6IHZhbHVlPy50b1N0cmluZygpLCBwbGFjZWhvbGRlcjogYERyb3AgeW91ciAke3R5cGV9IGhlcmUuLi5gIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHsgLy8gdW5kZWZpbmVkIHZhbHVlcyB3aXRob3V0IGEgdHlwZSBjYW4ndCBiZSBkaXNwbGF5ZWRcclxuICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGludGVyZmFjZSBjcmVhdGVkIGZvciBcIiwgX211dGFibGUuY29uc3RydWN0b3IubmFtZSwga2V5KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudCBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gXHJcbiAgICAgKiBEb2VzIG5vdCBzdXBwb3J0IG5lc3RlZCBtdXRhdG9ycyFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvciB8IE9iamVjdCk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IFJlZmxlY3QuZ2V0KF9tdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgIC8vIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSAvLyBhdCB0aGlzIHRpbWUgKDEvMjMpIGFkZGluZyBhIHByb3BlcnR5IHRvIGFuIGFuaW1hdGlvbiBpbiB0aGUgZWRpdG9yIGNyZWF0ZXMgYW4gZW1wdHkga2V5cyBsaXN0Li4uXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCBPYmplY3QsIHt9KSk7IFxyXG4gICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgLy8gbGV0IGRldGFpbHM6IERldGFpbHMgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlscyhrZXksIFwiRGV0YWlsc1wiKTtcclxuICAgICAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksICg8T2JqZWN0PnZhbHVlKS5jb25zdHJ1Y3Rvci5uYW1lLCB2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcGVjaWZpYyBDdXN0b21FbGVtZW50IGZvciB0aGUgZ2l2ZW4gZGF0YSwgdXNpbmcgX2tleSBhcyBpZGVudGlmaWNhdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZU11dGF0b3JFbGVtZW50KF9rZXk6IHN0cmluZywgX3R5cGU6IE9iamVjdCB8IHN0cmluZywgX3ZhbHVlOiBPYmplY3QpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoX3R5cGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50VHlwZTogdHlwZW9mIEN1c3RvbUVsZW1lbnQgPSBDdXN0b21FbGVtZW50LmdldChcIk9iamVjdFwiKTtcclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGluc3RhbnRpYXRlIGFic3RyYWN0IGNsYXNzXHJcbiAgICAgICAgICBlbGVtZW50ID0gbmV3IGVsZW1lbnRUeXBlKHsga2V5OiBfa2V5LCBsYWJlbDogX2tleSwgdmFsdWU6IF92YWx1ZS50b1N0cmluZygpIH0sIF90eXBlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF92YWx1ZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSkgeyAvLyBUT0RPOiBkZWxldGU/XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk11dGFibGVBcnJheVwiKTtcclxuICAgICAgICAgIC8vIGluc2VydCBBcnJheS1Db250cm9sbGVyIVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy5mdWRnZShfZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVE9ETzogcmVmYWN0b3IgZm9yIGVudW1zIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURyb3Bkb3duKF9uYW1lOiBzdHJpbmcsIF9jb250ZW50OiBPYmplY3QsIF92YWx1ZTogc3RyaW5nLCBfcGFyZW50OiBIVE1MRWxlbWVudCwgX2Nzc0NsYXNzPzogc3RyaW5nKTogSFRNTFNlbGVjdEVsZW1lbnQge1xyXG4gICAgICBsZXQgZHJvcGRvd246IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZHJvcGRvd24ubmFtZSA9IF9uYW1lO1xyXG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiBfY29udGVudCkge1xyXG4gICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnRleHQgPSB2YWx1ZTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09IF92YWx1ZS50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyb3Bkb3duLmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgX3BhcmVudC5hcHBlbmRDaGlsZChkcm9wZG93bik7XHJcbiAgICAgIHJldHVybiBkcm9wZG93bjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHMoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoX2tleSk7XHJcbiAgICAvLyAgIC8vIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzQXJyYXkoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShfa2V5KTtcclxuICAgIC8vICAgZGV0YWlscy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2tleSk7XHJcbiAgICAvLyAgIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IHR5cGUgdW5kb093bmVyID0gxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiB8IMaSLk5vZGUgfCDGki5Qcm9qZWN0O1xyXG4gIGV4cG9ydCB0eXBlIHVuZG9Pd25lZCA9IMaSLk11dGF0b3IgfCDGki5Ob2RlIHwgxpIuQ29tcG9uZW50IHwgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U7XHJcbiAgZXhwb3J0IHR5cGUgdW5kb0FjdGlvbiA9IFwibXV0YXRlXCIgfCBcImFkZFwiIHwgXCJyZW1vdmVcIjtcclxuICBleHBvcnQgdHlwZSB1bmRvU3RlcCA9IFt1bmRvQWN0aW9uLCB1bmRvT3duZXIsIHVuZG9Pd25lZF07XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBIaXN0b3J5IHtcclxuICAgIHN0YXRpYyAjc3RlcHM6IHVuZG9TdGVwW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHNhdmUoX2FjdGlvbjogdW5kb0FjdGlvbiwgX293bmVyOiB1bmRvT3duZXIsIF9vd25lZDogdW5kb093bmVkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIEhpc3RvcnkuI3N0ZXBzLnB1c2goW19hY3Rpb24sIF9vd25lciwgX293bmVkXSk7XHJcbiAgICAgIHRoaXMudW5kb0xvZygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHVuZG8oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIGxldCBzdGVwOiB1bmRvU3RlcCA9IEhpc3RvcnkuI3N0ZXBzLnBvcCgpO1xyXG4gICAgICBpZiAoc3RlcCkge1xyXG4gICAgICAgIGxldCBhY3Rpb246IHVuZG9BY3Rpb24gPSBzdGVwWzBdO1xyXG4gICAgICAgIGxldCBvd25lcjogdW5kb093bmVyID0gc3RlcFsxXTtcclxuICAgICAgICBpZiAob3duZXIgaW5zdGFuY2VvZiDGki5Ob2RlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhhY3Rpb24sIFwiT3duZXIgaXMgbm9kZVwiLCBvd25lcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvd25lciBpbnN0YW5jZW9mIMaSLlByb2plY3QpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGFjdGlvbiwgXCJPd25lciBpcyBwcm9qZWN0XCIsIG93bmVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYXdhaXQgb3duZXIubXV0YXRlKHN0ZXBbMV0pO1xyXG4gICAgICAgICAgaWYgKG93bmVyIGluc3RhbmNlb2YgxpIuQ29tcG9uZW50UmlnaWRib2R5KSB7XHJcbiAgICAgICAgICAgIG93bmVyLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3duZXIubXV0YXRlKHt9KTsgLy8ganVzdCB0byBkaXNwYXRjaCBtdXRhdGlvbiBldmVudCBhZ2FpblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdW5kb0xvZygpOiB2b2lkIHtcclxuICAgICAgY29uc29sZS5ncm91cChcIkhpc3RvcnlcIik7XHJcbiAgICAgIEhpc3RvcnkuI3N0ZXBzLmZvckVhY2goX3N0ZXAgPT5cclxuICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgIF9zdGVwWzBdLFxyXG4gICAgICAgICAgX3N0ZXBbMV0uY29uc3RydWN0b3IubmFtZSxcclxuICAgICAgICAgIF9zdGVwWzJdIGluc3RhbmNlb2YgxpIuTXV0YWJsZSB8fCBfc3RlcFsyXSBpbnN0YW5jZW9mIMaSLk5vZGUgP1xyXG4gICAgICAgICAgICBfc3RlcFsyXS5jb25zdHJ1Y3Rvci5uYW1lIDpcclxuICAgICAgICAgICAgX3N0ZXBbMl1cclxuICAgICAgICApKTtcclxuICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluIGNhc2UgdGhlIG9yZGVyIG9mIHRoZSBsYXN0IHR3byBzdGVwcyBuZWVkcyB0byBiZSBjaGFuZ2VkLCB1c2UgdGhpcyBtZXRob2RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzd2FwKCk6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcExhc3Q6dW5kb1N0ZXAgPSBIaXN0b3J5LiNzdGVwcy5wb3AoKTtcclxuICAgICAgbGV0IHN0ZXBQcmV2OnVuZG9TdGVwID0gSGlzdG9yeS4jc3RlcHMucG9wKCk7XHJcbiAgICAgIEhpc3RvcnkuI3N0ZXBzLnB1c2goc3RlcExhc3QpO1xyXG4gICAgICBIaXN0b3J5LiNzdGVwcy5wdXNoKHN0ZXBQcmV2KTtcclxuICAgICAgdGhpcy51bmRvTG9nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdHJ1Y3R1cmUgZm9yIHRoZSBhdHRyaWJ1dGVzIHRvIHNldCBpbiBhIEN1c3RvbUVsZW1lbnQuXHJcbiAgICoga2V5IChtYXliZSByZW5hbWUgdG8gYG5hbWVgKSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgbWF0Y2ggdGhlIGtleSBvZiBhIG11dGF0b3IgaWYgdXNlZCBpbiBjb25qdW5jdGlvblxyXG4gICAqIGxhYmVsIGlzIHJlY29tbWVuZGVkIGZvciBsYWJlbGxlZCBlbGVtZW50cywga2V5IGlzIHVzZWQgaWYgbm90IGdpdmVuLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMge1xyXG4gICAgW25hbWU6IHN0cmluZ106IHN0cmluZztcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgbGFiZWw/OiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBtYXBwaW5nIG9mIEN1c3RvbUVsZW1lbnRzIHRvIHRoZWlyIEhUTUwtVGFncyB2aWEgY3VzdG9tRWxlbWVudC5kZWZpbmVcclxuICAgKiBhbmQgdG8gdGhlIGRhdGEgdHlwZXMgYW5kIFtbRnVkZ2VDb3JlLk11dGFibGVdXXMgdGhleSByZW5kZXIgYW4gaW50ZXJmYWNlIGZvci4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRhZzogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwT2JqZWN0VG9DdXN0b21FbGVtZW50OiBNYXA8c3RyaW5nLCB0eXBlb2YgQ3VzdG9tRWxlbWVudD4gPSBuZXcgTWFwKCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMpXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBfYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgaWYgKF9hdHRyaWJ1dGVzW25hbWVdICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgX2F0dHJpYnV0ZXNbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIGFuIGlkIHRvIHVzZSBmb3IgY2hpbGRyZW4gb2YgdGhpcyBlbGVtZW50LCBuZWVkZWQgZS5nLiBmb3Igc3RhbmRhcmQgaW50ZXJhY3Rpb24gd2l0aCB0aGUgbGFiZWxcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBnZXQgbmV4dElkKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIsaSXCIgKyBDdXN0b21FbGVtZW50LmlkQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgbWFwIHRoZSBnaXZlbiBlbGVtZW50IHR5cGUgdG8gdGhlIGdpdmVuIHRhZyBhbmQgdGhlIGdpdmVuIHR5cGUgb2YgZGF0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWc6IHN0cmluZywgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCwgX3R5cGVPYmplY3Q/OiB0eXBlb2YgT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF90YWcsIF9jbGFzcyk7XHJcbiAgICAgIF90eXBlQ3VzdG9tRWxlbWVudC50YWcgPSBfdGFnO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShfdGFnLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgaWYgKF90eXBlT2JqZWN0KVxyXG4gICAgICAgIEN1c3RvbUVsZW1lbnQubWFwKF90eXBlT2JqZWN0Lm5hbWUsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGdpdmVuIGRhdGEgdHlwZSAoaWYgcmVnaXN0ZXJlZClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoX3R5cGU6IHN0cmluZyk6IHR5cGVvZiBDdXN0b21FbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnQ6IHN0cmluZyB8IHR5cGVvZiBDdXN0b21FbGVtZW50IHwgQ3VzdG9tRWxlbWVudENvbnN0cnVjdG9yID0gQ3VzdG9tRWxlbWVudC5tYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgaWYgKHR5cGVvZiAoZWxlbWVudCkgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICBlbGVtZW50ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW1lbnQpO1xyXG4gICAgICByZXR1cm4gPHR5cGVvZiBDdXN0b21FbGVtZW50PmVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwKF90eXBlOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoXCJNYXBcIiwgX3R5cGUsIF90eXBlQ3VzdG9tRWxlbWVudC5uYW1lKTtcclxuICAgICAgQ3VzdG9tRWxlbWVudC5tYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQuc2V0KF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBrZXkgKG5hbWUpIG9mIHRoZSBhdHRyaWJ1dGUgdGhpcyBlbGVtZW50IHJlcHJlc2VudHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBrZXkoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbGFiZWwtZWxlbWVudCBhcyBjaGlsZCB0byB0aGlzIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFwcGVuZExhYmVsKCk6IEhUTUxMYWJlbEVsZW1lbnQge1xyXG4gICAgICBsZXQgdGV4dDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKCF0ZXh0KVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TGFiZWwoX2xhYmVsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IF9sYWJlbDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCB1c2luZyBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgUmVmbGVjdC5zZXQodGhpcywgXCJ2YWx1ZVwiLCBfdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBXb3JrYXJvdW5kIHJlY29ubmVjdGlvbiBvZiBjbG9uZSAqL1xyXG4gICAgcHVibGljIGNsb25lTm9kZShfZGVlcDogYm9vbGVhbik6IE5vZGUge1xyXG4gICAgICBsZXQgbGFiZWw6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICBsZXQgY2xvbmU6IEN1c3RvbUVsZW1lbnQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsYWJlbCA/IHsgbGFiZWw6IGxhYmVsIH0gOiBudWxsKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjbG9uZSk7XHJcbiAgICAgIGNsb25lLnNldE11dGF0b3JWYWx1ZSh0aGlzLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgZm9yIChsZXQgYXR0cmlidXRlIG9mIHRoaXMuYXR0cmlidXRlcylcclxuICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XHJcbiAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRNdXRhdG9yVmFsdWUoKTogT2JqZWN0O1xyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgY2hlY2tib3ggd2l0aCBhIGxhYmVsIHRvIGl0XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRCb29sZWFuIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWJvb2xlYW5cIiwgQ3VzdG9tRWxlbWVudEJvb2xlYW4sIEJvb2xlYW4pO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gVE9ETzogZGVsZXRlIHRhYmluZGV4IGZyb20gY2hlY2tib3ggYW5kIGdldCBzcGFjZS1rZXkgb24gdGhpc1xyXG4gICAgICAvLyB0aGlzLnRhYkluZGV4ID0gMDtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgaW5wdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgaW5wdXQuY2hlY2tlZCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgPT0gXCJ0cnVlXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpLmh0bWxGb3IgPSBpbnB1dC5pZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveCBhcyBib29sZWFuIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLmNoZWNrZWQgPSBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIEEgY29sb3IgcGlja2VyIHdpdGggYSBsYWJlbCB0byBpdCBhbmQgYSBzbGlkZXIgZm9yIG9wYWNpdHlcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudENvbG9yIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWNvbG9yXCIsIEN1c3RvbUVsZW1lbnRDb2xvciwgxpIuQ29sb3IpO1xyXG4gICAgcHVibGljIGNvbG9yOiDGki5Db2xvciA9IG5ldyDGki5Db2xvcigpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgcGlja2VyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBwaWNrZXIudHlwZSA9IFwiY29sb3JcIjtcclxuXHJcbiAgICAgIHBpY2tlci50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocGlja2VyKTtcclxuXHJcbiAgICAgIGxldCBzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHNsaWRlci50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgICBzbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICAgIHNsaWRlci5tYXggPSBcIjFcIjtcclxuICAgICAgc2xpZGVyLnN0ZXAgPSBcIjAuMDFcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG4gICAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlcyBvZiBwaWNrZXIgYW5kIHNsaWRlciBhcyDGki5NdXRhdG9yXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBoZXg6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZTtcclxuICAgICAgbGV0IGFscGhhOiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWU7XHJcbiAgICAgIHRoaXMuY29sb3Iuc2V0SGV4KGhleC5zdWJzdHIoMSwgNikgKyBcImZmXCIpO1xyXG4gICAgICB0aGlzLmNvbG9yLmEgPSBwYXJzZUZsb2F0KGFscGhhKTtcclxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdmFsdWVzIG9mIGNvbG9yIHBpY2tlciBhbmQgc2xpZGVyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29sb3IubXV0YXRlKF92YWx1ZSk7XHJcbiAgICAgIGxldCBoZXg6IHN0cmluZyA9IHRoaXMuY29sb3IuZ2V0SGV4KCk7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZSA9IFwiI1wiICsgaGV4LnN1YnN0cigwLCA2KTtcclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlID0gdGhpcy5jb2xvci5hLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaG5kV2hlZWwoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCk7XHJcbiAgICAgIGlmIChzbGlkZXIgIT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZTogbnVtYmVyID0gTnVtYmVyKHNsaWRlci52YWx1ZSk7XHJcbiAgICAgIHNsaWRlci52YWx1ZSA9IFN0cmluZyhjdXJyZW50VmFsdWUgLSBfZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgIHNsaWRlci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBSZXByZXNlbnRzIGEgc2luZ2xlIGRpZ2l0IG51bWJlciB0byBiZSB1c2VkIGluIGdyb3VwcyB0byByZXByZXNlbnQgYSBtdWx0aWRpZ2l0IHZhbHVlLlxyXG4gICAqIElzIHRhYmJhYmxlIGFuZCBpbi0vZGVjcmVhc2VzIHByZXZpb3VzIHNpYmxpbmcgd2hlbiBmbG93aW5nIG92ZXIvdW5kZXIuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnREaWdpdCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtZGlnaXRcIiwgQ3VzdG9tRWxlbWVudERpZ2l0KTtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKF92YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIF92YWx1ZSA9IE1hdGgudHJ1bmMoX3ZhbHVlKTtcclxuICAgICAgaWYgKF92YWx1ZSA+IDkgfHwgX3ZhbHVlIDwgMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMudGV4dENvbnRlbnQgPSBfdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnRleHRDb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IC0xO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgYWRkKF9hZGRlbmQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBfYWRkZW5kID0gTWF0aC50cnVuYyhfYWRkZW5kKTtcclxuICAgICAgaWYgKF9hZGRlbmQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2FkZGVuZCA+IDApIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA8IDkpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlKys7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcHJldjogQ3VzdG9tRWxlbWVudERpZ2l0ID0gPEN1c3RvbUVsZW1lbnREaWdpdD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoIShwcmV2ICYmIHByZXYgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50RGlnaXQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBwcmV2LmFkZCgxKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA+IDApXHJcbiAgICAgICAgICB0aGlzLnZhbHVlLS07XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcHJldjogQ3VzdG9tRWxlbWVudERpZ2l0ID0gPEN1c3RvbUVsZW1lbnREaWdpdD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoIShwcmV2ICYmIHByZXYgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50RGlnaXQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBwcmV2LmFkZCgtMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gOTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudC50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBDdXN0b21FbGVtZW50IGZyb20gYW4gSFRNTC1UZW1wbGF0ZS1UYWdcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmcmFnbWVudDogTWFwPHN0cmluZywgRG9jdW1lbnRGcmFnbWVudD4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJvd3NlcyB0aHJvdWdoIHRoZSB0ZW1wbGF0ZXMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQgYW5kIHJlZ2lzdGVycyB0aGUgb25lIGRlZmluaW5nIHRoZSBnaXZlbiB0YWduYW1lLlxyXG4gICAgICogVG8gYmUgY2FsbGVkIGZyb20gYSBzY3JpcHQgdGFnIGltcGxlbWVudGVkIHdpdGggdGhlIHRlbXBsYXRlIGluIEhUTUwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZ05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCB0ZW1wbGF0ZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGVtcGxhdGVcIikpIHtcclxuICAgICAgICBpZiAodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5sb2NhbE5hbWUgPT0gX3RhZ05hbWUpIHtcclxuICAgICAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiUmVnaXN0ZXJcIiwgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuc2V0KF90YWdOYW1lLCB0ZW1wbGF0ZS5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IGluIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxJbnB1dEVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiW2tleVwiKTtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXl9XCJdYCk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYENvdWxkbid0IGZpbmQgJHtrZXl9IGluYCwgdGhpcyk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUoX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZWxlbWVudC52YWx1ZSA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lLCB0aGUgZWxlbWVudCBnZXRzIGNvbnN0cnVjdGVkIGFzIGEgZGVlcCBjbG9uZSBvZiB0aGUgdGVtcGxhdGUuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGxldCBmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCA9IEN1c3RvbUVsZW1lbnRUZW1wbGF0ZS5mcmFnbWVudC5nZXQoUmVmbGVjdC5nZXQodGhpcy5jb25zdHJ1Y3RvciwgXCJ0YWdcIikpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZnJhZ21lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG4gICAgICBsZXQgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB0aGlzLnN0eWxlO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBjb250ZW50LnN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUuc2V0UHJvcGVydHkoZW50cnksIFJlZmxlY3QuZ2V0KGNvbnRlbnQuc3R5bGUsIGVudHJ5KSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY29udGVudC5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXgzeDMgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHsgdHJhbnNsYXRpb246IHt9LCBzY2FsaW5nOiB7fSwgcm90YXRpb246IDAgfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuXHJcbiAgICAgIG11dGF0b3JbXCJyb3RhdGlvblwiXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKF9tdXRhdG9yW1wicm90YXRpb25cIl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnRUZW1wbGF0ZS50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE1hdHJpeDR4NCBleHRlbmRzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBPYmplY3Qge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgcm90YXRpb246IHt9LCBzY2FsaW5nOiB7fSB9O1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgKDzGki5NdXRhdG9yPm11dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJNYXRyaXggQ2FsbGJhY2tcIik7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCB0ZXh0IGlucHV0IGZpZWxkIHdpdGggYSBsYWJlbCB0byBpdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE91dHB1dCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1vdXRwdXRcIiwgQ3VzdG9tRWxlbWVudE91dHB1dCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm91dHB1dFwiKTtcclxuICAgICAgb3V0cHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQob3V0cHV0KTtcclxuICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUodGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogRnVkZ2VDb3JlLkdlbmVyYWwpOiB2b2lkIHtcclxuICAgICAgbGV0IG91dHB1dDogSFRNTE91dHB1dEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJvdXRwdXRcIik7XHJcbiAgICAgIG91dHB1dC52YWx1ZSA9IF92YWx1ZSA/PyB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgICBpZiAoX3ZhbHVlKVxyXG4gICAgICAgIG91dHB1dC5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LmFkZChcInBsYWNlaG9sZGVyXCIpO1xyXG5cclxuICAgICAgLy8gdGhpcy5xdWVyeVNlbGVjdG9yKFwib3V0cHV0XCIpLnZhbHVlID0gX3ZhbHVlID8/IHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBkcm9wZG93biBtZW51IHRvIGRpc3BsYXkgZW51bXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFNlbGVjdCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zZWxlY3RcIiwgQ3VzdG9tRWxlbWVudFNlbGVjdCwgT2JqZWN0KTtcclxuICAgIHB1YmxpYyBjb250ZW50OiBPYmplY3Q7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcywgX2NvbnRlbnQ6IE9iamVjdCA9IHt9KSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZyB8IG51bWJlciA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwga2V5KTtcclxuICAgICAgICBpZiAoUmVmbGVjdC5oYXModGhpcy5jb250ZW50LCB2YWx1ZSkgJiYgUmVmbGVjdC5nZXQodGhpcy5jb250ZW50LCB2YWx1ZSkgIT09IGtleSkgLy8gZmlsdGVyIG51bWJlciBrZXlzIG91dCBvZiBzaW1wbGUgZW51bSBcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnRleHQgPSBrZXk7XHJcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB0eXBlb2YgdmFsdWUpO1xyXG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKTtcclxuICAgICAgICBpZiAoZW50cnkudmFsdWUgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xyXG4gICAgICAgICAgZW50cnkuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICBzZWxlY3QudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB8IG51bWJlciB7XHJcbiAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpO1xyXG4gICAgICBsZXQgdHlwZTogc3RyaW5nID0gc2VsZWN0Lm9wdGlvbnNbc2VsZWN0LnNlbGVjdGVkSW5kZXhdPy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpIHx8IFwic3RyaW5nXCI7XHJcbiAgICAgIHJldHVybiB0eXBlID09IFwibnVtYmVyXCIgPyBwYXJzZUZsb2F0KHNlbGVjdC52YWx1ZSkgOiBzZWxlY3QudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIikudmFsdWUgPSBfdmFsdWU7XHJcbiAgICAgIC8vIHRoaXMudmFsdWUgPSBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBBbiBpbnRlcmFjdGl2ZSBudW1iZXIgc3RlcHBlciB3aXRoIGV4cG9uZW50aWFsIGRpc3BsYXkgYW5kIGNvbXBsZXggaGFuZGxpbmcgdXNpbmcga2V5Ym9hcmQgYW5kIG1vdXNlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTdGVwcGVyIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXN0ZXBwZXJcIiwgQ3VzdG9tRWxlbWVudFN0ZXBwZXIsIE51bWJlcik7XHJcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMgJiYgX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSlcclxuICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdChfYXR0cmlidXRlc1tcInZhbHVlXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4geyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IH0pO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcblxyXG4gICAgICBsZXQgc2lnbjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIHNpZ24udGV4dENvbnRlbnQgPSBcIitcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzaWduKTtcclxuICAgICAgZm9yIChsZXQgZXhwOiBudW1iZXIgPSAyOyBleHAgPiAtNDsgZXhwLS0pIHtcclxuICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IG5ldyBDdXN0b21FbGVtZW50RGlnaXQoKTtcclxuICAgICAgICBkaWdpdC5zZXRBdHRyaWJ1dGUoXCJleHBcIiwgZXhwLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZGlnaXQpO1xyXG4gICAgICAgIGlmIChleHAgPT0gMClcclxuICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICs9IFwiLlwiO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MICs9IFwiZVwiO1xyXG5cclxuICAgICAgbGV0IGV4cDogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIGV4cC50ZXh0Q29udGVudCA9IFwiKzBcIjtcclxuICAgICAgZXhwLnRhYkluZGV4ID0gLTE7XHJcbiAgICAgIGV4cC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiZXhwXCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGV4cCk7XHJcblxyXG5cclxuICAgICAgLy8gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kSW5wdXQpO1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkJMVVIsIHRoaXMuaG5kSW5wdXQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlLS9BY3RpdmF0ZXMgdGFiYmluZyBmb3IgdGhlIGlubmVyIGRpZ2l0c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGVJbm5lclRhYnMoX29uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gX29uID8gMCA6IC0xO1xyXG5cclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG4gICAgICBzcGFuc1sxXS50YWJJbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgbGV0IGRpZ2l0czogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50RGlnaXQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIik7XHJcbiAgICAgIGZvciAobGV0IGRpZ2l0IG9mIGRpZ2l0cylcclxuICAgICAgICBkaWdpdC50YWJJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMvQ2xvc2VzIGEgc3RhbmRhcmQgbnVtYmVyIGlucHV0IGZvciB0eXBpbmcgdGhlIHZhbHVlIGF0IG9uY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9wZW5JbnB1dChfb3BlbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKF9vcGVuKSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgaXRzIHZhbHVlIGFuZCBkaXNwbGF5cyBpdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmFsdWUgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgXHJcbiAgICAgIHRoaXMudmFsdWUgPSBfdmFsdWU7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgbWFudGlzc2EgYW5kIGV4cG9uZW50IHNlcGFyYXRlbHkgYXMgYW4gYXJyYXkgb2YgdHdvIG1lbWJlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTogbnVtYmVyW10ge1xyXG4gICAgICBsZXQgcHJlYzogc3RyaW5nID0gdGhpcy52YWx1ZS50b0V4cG9uZW50aWFsKDYpO1xyXG4gICAgICBsZXQgZXhwOiBudW1iZXIgPSBwYXJzZUludChwcmVjLnNwbGl0KFwiZVwiKVsxXSk7XHJcbiAgICAgIGxldCBleHAzOiBudW1iZXIgPSBNYXRoLnRydW5jKGV4cCAvIDMpO1xyXG4gICAgICBsZXQgbWFudGlzc2E6IG51bWJlciA9IHRoaXMudmFsdWUgLyBNYXRoLnBvdygxMCwgZXhwMyAqIDMpO1xyXG4gICAgICBtYW50aXNzYSA9IE1hdGgucm91bmQobWFudGlzc2EgKiAxMDAwKSAvIDEwMDA7XHJcbiAgICAgIHJldHVybiBbbWFudGlzc2EsIGV4cDMgKiAzXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGlzIHZhbHVlIGFzIGEgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBdOiBudW1iZXJbXSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG4gICAgICBsZXQgcHJlZml4TWFudGlzc2E6IHN0cmluZyA9IChtYW50aXNzYSA8IDApID8gXCJcIiA6IFwiK1wiO1xyXG4gICAgICBsZXQgcHJlZml4RXhwOiBzdHJpbmcgPSAoZXhwIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIHJldHVybiBwcmVmaXhNYW50aXNzYSArIG1hbnRpc3NhLnRvRml4ZWQoMykgKyBcImVcIiArIHByZWZpeEV4cCArIGV4cDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlzIHRoaXMgdmFsdWUgYnkgc2V0dGluZyB0aGUgY29udGVudHMgb2YgdGhlIGRpZ2l0cyBhbmQgdGhlIGV4cG9uZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZGlzcGxheSgpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZ2l0czogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50RGlnaXQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIik7XHJcbiAgICAgIGxldCBzcGFuczogTm9kZUxpc3RPZjxIVE1MU3BhbkVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuXHJcbiAgICAgIGlmICghaXNGaW5pdGUodGhpcy52YWx1ZSkpIHtcclxuICAgICAgICBmb3IgKGxldCBwb3M6IG51bWJlciA9IDA7IHBvcyA8IGRpZ2l0cy5sZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IGRpZ2l0c1s1IC0gcG9zXTtcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiICDiiJ4gICBcIls1IC0gcG9zXTtcclxuICAgICAgICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gXCIgIFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IHN0cmluZ1tdID0gdGhpcy50b1N0cmluZygpLnNwbGl0KFwiZVwiKTtcclxuICAgICAgc3BhbnNbMF0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlIDwgMCA/IFwiLVwiIDogXCIrXCI7XHJcbiAgICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gZXhwO1xyXG5cclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgIG1hbnRpc3NhID0gbWFudGlzc2EucmVwbGFjZShcIi5cIiwgXCJcIik7XHJcbiAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IGRpZ2l0c1s1IC0gcG9zXTtcclxuICAgICAgICBpZiAocG9zIDwgbWFudGlzc2EubGVuZ3RoKSB7XHJcbiAgICAgICAgICBsZXQgY2hhcjogc3RyaW5nID0gbWFudGlzc2EuY2hhckF0KG1hbnRpc3NhLmxlbmd0aCAtIDEgLSBwb3MpO1xyXG4gICAgICAgICAgZGlnaXQudGV4dENvbnRlbnQgPSBjaGFyO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCImbmJzcDtcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGtleWJvYXJkIGlucHV0IG9uIHRoaXMgZWxlbWVudCBhbmQgaXRzIGRpZ2l0c1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGFjdGl2ZTogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGxldCBudW1FbnRlcmVkOiBudW1iZXIgPSBfZXZlbnQua2V5LmNoYXJDb2RlQXQoMCkgLSA0ODtcclxuXHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIC8vIGlmIGZvY3VzIGlzIG9uIHN0ZXBwZXIsIGVudGVyIGl0IGFuZCBmb2N1cyBkaWdpdFxyXG4gICAgICBpZiAoYWN0aXZlID09IHRoaXMpIHtcclxuICAgICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRU5URVI6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnModHJ1ZSk7XHJcbiAgICAgICAgICAgICg8SFRNTEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIilbMl0pLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgobnVtRW50ZXJlZCA+PSAwICYmIG51bUVudGVyZWQgPD0gOSkgfHwgX2V2ZW50LmtleSA9PSBcIi1cIiB8fCBfZXZlbnQua2V5ID09IFwiK1wiKSB7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgIC8vIF9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpbnB1dCBmaWVsZCBvdmVybGF5IGlzIGFjdGl2ZVxyXG4gICAgICBpZiAoYWN0aXZlLmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGlmIChfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUiB8fCBfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKSB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gTnVtYmVyKCg8SFRNTElucHV0RWxlbWVudD5hY3RpdmUpLnZhbHVlKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobnVtRW50ZXJlZCA+PSAwICYmIG51bUVudGVyZWQgPD0gOSkge1xyXG4gICAgICAgIGxldCBkaWZmZXJlbmNlOiBudW1iZXIgPSBudW1FbnRlcmVkIC0gTnVtYmVyKGFjdGl2ZS50ZXh0Q29udGVudCkgKiAodGhpcy52YWx1ZSA8IDAgPyAtMSA6IDEpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZChkaWZmZXJlbmNlKTtcclxuXHJcbiAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmFjdGl2ZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmtleSA9PSBcIi1cIiB8fCBfZXZlbnQua2V5ID09IFwiK1wiKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IChfZXZlbnQua2V5ID09IFwiLVwiID8gLTEgOiAxKSAqIE1hdGguYWJzKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5UQUJVTEFUT1IpXHJcbiAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoLTEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZCgrMSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICAoPEhUTUxFbGVtZW50PmFjdGl2ZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmFjdGl2ZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVI6XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFdoZWVsID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgY2hhbmdlOiBudW1iZXIgPSBfZXZlbnQuZGVsdGFZIDwgMCA/ICsxIDogLTE7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZChjaGFuZ2UpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5vcGVuSW5wdXQoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgY2hhbmdlRGlnaXRGb2N1c3NlZChfYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZ2l0OiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMgfHwgIXRoaXMuY29udGFpbnMoZGlnaXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9hbW91bnQgPSBNYXRoLnJvdW5kKF9hbW91bnQpO1xyXG4gICAgICBpZiAoX2Ftb3VudCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJbbmFtZT1leHBdXCIpKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy52YWx1ZSk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSB0aGlzLnZhbHVlICogTWF0aC5wb3coMTAsIF9hbW91bnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUodmFsdWUpKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOyBcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBleHBEaWdpdDogbnVtYmVyID0gcGFyc2VJbnQoZGlnaXQuZ2V0QXR0cmlidXRlKFwiZXhwXCIpKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZSAobWFudGlzc2Egbm90IHVzZWQpXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cFZhbHVlXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuXHJcbiAgICAgIGxldCBwcmV2OiBudW1iZXIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlICs9IF9hbW91bnQgKiBNYXRoLnBvdygxMCwgZXhwRGlnaXQgKyBleHBWYWx1ZSk7XHJcbiAgICAgIC8vIHdvcmthcm91bmQgcHJlY2lzaW9uIHByb2JsZW1zIG9mIGphdmFzY3JpcHRcclxuICAgICAgaWYgKE1hdGguYWJzKHByZXYgLyB0aGlzLnZhbHVlKSA+IDEwMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcblxyXG5cclxuICAgICAgbGV0IGV4cE5ldzogbnVtYmVyO1xyXG4gICAgICBbbWFudGlzc2EsIGV4cE5ld10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobWFudGlzc2EpO1xyXG4gICAgICB0aGlzLnNoaWZ0Rm9jdXMoZXhwTmV3IC0gZXhwVmFsdWUpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNoaWZ0Rm9jdXMoX25EaWdpdHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc2hpZnRGb2N1czogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChfbkRpZ2l0cykge1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspXHJcbiAgICAgICAgICBpZiAoX25EaWdpdHMgPiAwKVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+c2hpZnRGb2N1cykuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50VGV4dElucHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXRleHRpbnB1dFwiLCBDdXN0b21FbGVtZW50VGV4dElucHV0LCBTdHJpbmcpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBCYXNlY2xhc3MgZm9yIGNvbXBsZXggdWktY29udHJvbGxlcnMgaGFuZGxpbmcgZGF0YSBpbiB0YWJsZXMsIHRyZWVzIG9yIG90aGVyIHN0cnVjdHVyZXMgICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIHNlbGVjdGVkIG9iamVjdHMuIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIHNlbGVjdGlvbiBzaG91bGQgYWxzbyBvcGVyYXRlIG91dHNpZGUgb2YgdGFibGUgKi9cclxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFRbXSA9IFtdO1xyXG4gICAgXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0YWJsZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBUYWJsZUl0ZW1zfSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZXhwZW5kYWJsZXMgVGhlIGV4cGVuZGFibGUgb2JqZWN0cyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZXhwZW5kYWJsZXM6IFRbXSk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIHJldHVybiBfZXhwZW5kYWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgaXRlbXMgdG8gdGhlIGNsaXBib2FyZCBmb3IgY29weSAmIHBhc3RlICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBjb3BpZWQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eSxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcmVmZXJyZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogVFtdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPyB0aGlzLnNlbGVjdGlvbiA6IFtfZm9jdXNdO1xyXG4gICAgICBDbGlwYm9hcmQuY29weVBhc3RlLnNldChpdGVtcywgX29wZXJhdGlvbik7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBvYmplY3RzIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGNvcHkgJiBwYXN0ZSBhbmQgZGVsZXRlIHRoZW0gZnJvbSB0aGlzIGNvbnRyb2xsZXIgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgY3V0IGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIHdob2xlIHNlbGVjdGlvbiBnZXRzIHJlZmVycmVkIGFuZCBkZWxldGVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjdXQoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLmNvcHkoX2ZvY3VzLCBfb3BlcmF0aW9uKTtcclxuICAgICAgaXRlbXMgPSBhd2FpdCB0aGlzLmRlbGV0ZShpdGVtcyk7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0YWJsZSAgIFxyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiBpZiB0aGUgY29weVBhc3RlIGNsaXBib2FyZCB3YXMgZmlsbGVkIHVzaW5nIGNvcHksIHJldHVybiBhbiBhcnJheSBvZiBjbG9uZXMsXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGNvbnRlbnQgb2YgdGhlIGNsaXBib2FyZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgcGFzdGUoKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5jb3B5UGFzdGUuZ2V0KCk7XHJcbiAgICAgIGlmIChDbGlwYm9hcmQuY29weVBhc3RlLm9wZXJhdGlvbiA9PSBcImNvcHlcIilcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbG9uZShvYmplY3RzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIG9iamVjdHMgdG8gdGhlIGNsaXBib2FyZCBmb3IgZHJhZyAmIGRyb3AgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgZHJhZ2dlZCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyByZWZlcnJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ1N0YXJ0KF9mb2N1czogVCk6IHZvaWQge1xyXG4gICAgICAvLyBpZiB0aGUgZm9jdXNzZWQgaXRlbSBpcyBpbiB0aGUgc2VsZWN0aW9uLCBkcmFnIHRoZSB3aG9sZSBzZWxlY3Rpb25cclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKF9mb2N1cykgPCAwID8gW19mb2N1c10gOiB0aGlzLnNlbGVjdGlvbjtcclxuICAgICAgQ2xpcGJvYXJkLmRyYWdEcm9wLnNldChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGFsbG93ZWQgZHJhZ0Ryb3AtZWZmZWN0ICBcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogY2hlY2sgdGhlIGN0cmxLZXkgZm9yIFwiY29weVwiIGFuZCBzaGlmdEtleSBmb3IgXCJsaW5rXCIsIG90aGVyd2lzZSByZXR1cm4gXCJtb3ZlXCIgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQpOiBEUk9QRUZGRUNUIHtcclxuICAgICAgbGV0IGRyb3BFZmZlY3Q6IERST1BFRkZFQ1QgPSBcIm1vdmVcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIHJldHVybiBkcm9wRWZmZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHJpZXZlIG9iamVjdHMgZnJvbSB0aGUgY2xpcGJvYXJkLCBwcm9jZXNzIGFuZCByZXR1cm4gdGhlbSB0byBhZGQgdG8gdGhlIHRyZWUuXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IGlmIHtAbGluazogZHJhZ092ZXJ9IHlpZWxkcyBcImNvcHlcIiwgcmV0dXJuIGFuIGFycmF5IG9mIGNsb25lcyBvZiB0aGUgb2JqZWN0cyBpbixcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY29udGVudCBvZiB0aGUgZHJhZ0Ryb3AtY2xpcGJvYXJkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBvYmplY3RzOiBUW10gPSBDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KCk7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdPdmVyKF9ldmVudCkgPT0gXCJjb3B5XCIpXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xvbmUob2JqZWN0cyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBDbG9uZSBvYmplY3RzIGFuZCByZXR1cm4gYW4gYXJyYXkgd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBjbG9uZXNcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogdXNlIE9iamVjdC5jcmVhdGUgdG8gY2xvbmUgdGhlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGNsb25lKF9vYmplY3RzOiBUW10pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICByZXR1cm4gX29iamVjdHMubWFwKF9vYmplY3QgPT4gT2JqZWN0LmNyZWF0ZSg8T2JqZWN0Pl9vYmplY3QpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlscyBleHRlbmRzIEhUTUxEZXRhaWxzRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZyA9IFwiXCIsIF90eXBlOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBjaGFuZ2luZyBhbmltYXRpb24gc3RydWN0dXJlIHRvIGxvb2sgbW9yZSBsaWtlIGEgbXV0YXRvclxyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImtleVwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgbGV0IGxibFN1bW1hcnk6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XHJcbiAgICAgIGxibFN1bW1hcnkudGV4dENvbnRlbnQgPSBfbGVnZW5kO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxibFN1bW1hcnkpO1xyXG5cclxuICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19TRVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVE9HR0xFLCB0aGlzLmhuZFRvZ2dsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgLy8gcmV0dXJuIHRoaXMuZXhwYW5kZXIuY2hlY2tlZDtcclxuICAgICAgcmV0dXJuIHRoaXMub3BlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZXBsYWNlQ2hpbGQoX2NvbnRlbnQsIHRoaXMuY29udGVudCk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAvLyB0aGlzLmV4cGFuZGVyLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLm9wZW4gPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhuZFRvZ2dsZShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvZ2dsZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuaXNFeHBhbmRlZCA/IEVWRU5ULkVYUEFORCA6IEVWRU5ULkNPTExBUFNFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXRzOiBOb2RlTGlzdE9mPEhUTUxEZXRhaWxzRWxlbWVudD4gPSBwcmV2aW91cy5xdWVyeVNlbGVjdG9yQWxsKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IHNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgICBkbyB7IC8vIGZvY3VzIHRoZSBsYXN0IHZpc2libGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZXRzWy0taV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9IHdoaWxlICghc2V0c1tpXS5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1NFVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAvLyBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5JTlNFUlQsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgIG5leHQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgbmV4dCA9IDxIVE1MRWxlbWVudD5uZXh0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgfSB3aGlsZSAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpO1xyXG5cclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAvLyBuZXh0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzID0gPEhUTUxFbGVtZW50PnByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICB9IHdoaWxlIChwcmV2aW91cyAmJiAhKHByZXZpb3VzIGluc3RhbmNlb2YgRGV0YWlscykpO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2aW91cylcclxuICAgICAgICAgICAgaWYgKCg8RGV0YWlscz5wcmV2aW91cykuaXNFeHBhbmRlZClcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfU0VULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBUT0RPOiB1c2UgQ3VzdG9tRWxlbWVudC5yZWdpc3Rlcj9cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1kZXRhaWxzXCIsIERldGFpbHMsIHsgZXh0ZW5kczogXCJkZXRhaWxzXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlsc0FycmF5IGV4dGVuZHMgRGV0YWlscyB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZykge1xyXG4gICAgICBzdXBlcihfbGVnZW5kLCBcIkFycmF5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb250ZW50KF9jb250ZW50OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5zZXRDb250ZW50KF9jb250ZW50KTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KSB7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhjaGlsZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcigpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3JbXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBtdXRhdG9yLnB1c2goY2hpbGQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkRXZlbnRMaXN0ZW5lcnMoX2NoaWxkOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBfY2hpbGQuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnU3RhcnQpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyb3ApO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXlTcGVjaWFsKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5TRVJULCB0aGlzLmhuZEluc2VydCk7XHJcbiAgICAgIF9jaGlsZC50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFycmFuZ2UoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgICBzZXF1ZW5jZS5wdXNoKHBhcnNlSW50KGNoaWxkLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZXRGb2N1cyhfZm9jdXMpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFQVJSQU5HRV9BUlJBWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsga2V5OiB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgc2VxdWVuY2U6IHNlcXVlbmNlIH0gfSkpO1xyXG5cclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxDdXN0b21FbGVtZW50Pikge1xyXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShcImtleVwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBpZiAoY2hpbGQuc2V0TGFiZWwpXHJcbiAgICAgICAgICBjaGlsZC5zZXRMYWJlbChjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjaGlsZC50YWJJbmRleCk7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRGb2N1cyhfZm9jdXM6IG51bWJlciA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICBpZiAoX2ZvY3VzID09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9mb2N1cyA9IE1hdGgubWF4KDAsIE1hdGgubWluKF9mb2N1cywgdGhpcy5jb250ZW50LmNoaWxkcmVuLmxlbmd0aCAtIDEpKTtcclxuICAgICAgbGV0IGNoaWxkOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLmNvbnRlbnQuY2hpbGRyZW5bX2ZvY3VzXTtcclxuICAgICAgY2hpbGQ/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnU3RhcnQgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gX2V2ZW50LnByZXZlbnREZWZhdWx0OyBcclxuICAgICAgbGV0IGtleURyYWc6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5kZXhcIiwga2V5RHJhZyk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImtleTpcIiArIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpLCBcImtleVwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9ldmVudC5kYXRhVHJhbnNmZXIuaXRlbXMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGxhYmVsOiBzdHJpbmc7XHJcbiAgICAgICAgW2tleSwgbGFiZWxdID0gaXRlbS50eXBlLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICBpZiAoa2V5ID09IFwia2V5XCIgJiYgbGFiZWwgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpIHtcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobGFiZWwgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgbGV0IGRyb3A6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICBsZXQga2V5RHJvcDogc3RyaW5nID0gZHJvcC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSBfZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbmRleFwiKTtcclxuICAgICAgbGV0IGRyYWc6IEhUTUxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXlEcmFnfVwiXWApO1xyXG4gICAgICBsZXQgbGFiZWxEcmFnOiBzdHJpbmcgPSBkcmFnLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cclxuICAgICAgbGV0IHBvc2l0aW9uOiBJbnNlcnRQb3NpdGlvbiA9IGtleURyYWcgPiBrZXlEcm9wID8gXCJiZWZvcmViZWdpblwiIDogXCJhZnRlcmVuZFwiO1xyXG4gICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgZHJhZyA9IDxIVE1MRWxlbWVudD5kcmFnLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgZHJhZy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBsYWJlbERyYWcpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcmFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJhZyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkcm9wLmluc2VydEFkamFjZW50RWxlbWVudChwb3NpdGlvbiwgZHJhZyk7XHJcblxyXG4gICAgICB0aGlzLnJlYXJyYW5nZSgpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGRyYWcpO1xyXG4gICAgICBkcmFnLmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiaG5kSW5zZXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleVNwZWNpYWwgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgIC8vIG9ubHkgd29yayBvbiBpdGVtcyBvZiBsaXN0LCBub3QgdGhlaXIgY2hpbGRyZW5cclxuICAgICAgaWYgKCg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkgIT0gaXRlbSAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IG51bWJlciA9IHBhcnNlSW50KGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICBsZXQgc2libGluZzogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgaW5zZXJ0OiBIVE1MRWxlbWVudCA9IGl0ZW07XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAvLyAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzQXJyYXlcIik7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGb2N1cygtLWZvY3VzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGluc2VydCA9IDxIVE1MRWxlbWVudD5pdGVtLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgaW5zZXJ0LnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGluc2VydCk7XHJcbiAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgc2libGluZyA9IDxIVE1MRWxlbWVudD5pdGVtLnByZXZpb3VzU2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWJlZ2luXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgtLWZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoKytmb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgrK2ZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudCkge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVpLWxpc3RcIiwgRGV0YWlsc0FycmF5LCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIG9yIG5vbi1tb2RhbCBkaWFsb2cgd2l0aCBhbiBpbnRlcmZhY2UgZm9yIHRoZSBnaXZlbiBtdXRhdG9yLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBEaWFsb2cge1xyXG4gICAgcHVibGljIHN0YXRpYyBkb206IEhUTUxEaWFsb2dFbGVtZW50O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9tcHQgdGhlIGRpYWxvZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgY2FsbCB0byBhY3Rpb24gYW5kIGxhYmVscyBmb3IgdGhlIGNhbmNlbC0gYW5kIG9rLWJ1dHRvblxyXG4gICAgICogVXNlIGBhd2FpdGAgb24gY2FsbCwgdG8gY29udGludWUgYWZ0ZXIgdGhlIHVzZXIgaGFzIHByZXNzZWQgb25lIG9mIHRoZSBidXR0b25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHByb21wdChfZGF0YTogxpIuTXV0YWJsZSB8IMaSLk11dGF0b3IgfCBPYmplY3QsIF9tb2RhbDogYm9vbGVhbiA9IHRydWUsIF9oZWFkOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF9jYWxsVG9BY3Rpb246IHN0cmluZyA9IFwiSW5zdHJ1Y3Rpb25cIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIsIF9jYW5jZWw6IHN0cmluZyA9IFwiQ2FuY2VsXCIpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgRGlhbG9nLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoRGlhbG9nLmRvbSk7XHJcbiAgICAgIERpYWxvZy5kb20uaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZCArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgaWYgKF9kYXRhIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9kYXRhKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX2RhdGEpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIERpYWxvZy5kb20uYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX2NhbGxUb0FjdGlvbiArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuQ2FuY2VsOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bkNhbmNlbC5pbm5lckhUTUwgPSBfY2FuY2VsO1xyXG4gICAgICBpZiAoX2NhbmNlbCAhPSBcIlwiKVxyXG4gICAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5DYW5jZWwpO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIGlmIChfbW9kYWwpXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgRGlhbG9nLmRvbS5zaG93TW9kYWwoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvdygpO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChfcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCBobmRCdXR0b246IChfZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGJ0bkNhbmNlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGJ0bk9rLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBobmRCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gYnRuT2spXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGNvbnRlbnQsIF9kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcclxuICAgICAgICAgICAgICDGki5EZWJ1Zy5pbmZvKF9lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBEaWFsb2cuZG9tLmNsb3NlKCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICAgICAgX3Jlc29sdmUoX2V2ZW50LnRhcmdldCA9PSBidG5Payk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCBobmRCdXR0b24pO1xyXG4gICAgICAgIGJ0bk9rLmZvY3VzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIDxzZWxlY3Q+PG9wdGlvbj5IYWxsbzwvb3B0aW9uPjwvc2VsZWN0PlxyXG4gICAqL1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE11bHRpTGV2ZWxNZW51TWFuYWdlciB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBidWlsZEZyb21TaWduYXR1cmUoX3NpZ25hdHVyZTogc3RyaW5nLCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCB7fTtcclxuICAgICAgbGV0IHNpZ25hdHVyZUxldmVsczogc3RyaW5nW10gPSBfc2lnbmF0dXJlLnNwbGl0KFwiLlwiKTtcclxuICAgICAgaWYgKHNpZ25hdHVyZUxldmVscy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgbGV0IHN1YlNpZ25hdHVyZTogc3RyaW5nID0gc2lnbmF0dXJlTGV2ZWxzWzFdO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDI7IGkgPCBzaWduYXR1cmVMZXZlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHN1YlNpZ25hdHVyZSA9IHN1YlNpZ25hdHVyZSArIFwiLlwiICsgc2lnbmF0dXJlTGV2ZWxzW2ldO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICBtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gPSB0aGlzLmJ1aWxkRnJvbVNpZ25hdHVyZShzdWJTaWduYXR1cmUsIDzGki5NdXRhdG9yPm11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gc2lnbmF0dXJlTGV2ZWxzWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIHdhcm5pbmcuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFdhcm5pbmcge1xyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5IGEgd2FybmluZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgd2FybmluZyB0ZXh0IGFuZCBvayBidXR0ZW4gdGV4dC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkaXNwbGF5KF9lcnJvcnM6IHN0cmluZ1tdID0gW10sIF9oZWFkbGluZTogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfd2FybmluZzogc3RyaW5nID0gXCJXYXJuaW5nXCIsIF9vazogc3RyaW5nID0gXCJPS1wiKTogdm9pZCB7XHJcbiAgICAgIGxldCB3YXJuaW5nOiBIVE1MRGlhbG9nRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod2FybmluZyk7XHJcbiAgICAgIHdhcm5pbmcuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZGxpbmUgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIGNvbnRlbnQuaW5uZXJUZXh0ID0gX2Vycm9ycy5qb2luKFwiXFxuXCIpO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF93YXJuaW5nICsgXCI8L3A+XCI7XHJcbiAgICAgIGxldCBidG5PazogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5Pay5pbm5lckhUTUwgPSBfb2s7XHJcbiAgICAgIGJ0bk9rLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgd2FybmluZy5jbG9zZSgpO1xyXG4gICAgICAgIHdhcm5pbmcucmVtb3ZlKCk7XHJcbiAgICAgIH07XHJcbiAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5Payk7XHJcbiAgICAgIHdhcm5pbmcuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIHdhcm5pbmcuc2hvd01vZGFsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8vIFRPRE86IGR1cGxpY2F0ZWQgY29kZSBpbiBUYWJsZSBhbmQgVHJlZSwgbWF5IGJlIG9wdGltaXplZC4uLlxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFRBQkxFIHtcclxuICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGVkaXRhYmxlOiBib29sZWFuO1xyXG4gICAgc29ydGFibGU6IGJvb2xlYW47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYW5hZ2VzIGEgc29ydGFibGUgdGFibGUgb2YgZGF0YSBnaXZlbiBhcyBzaW1wbGUgYXJyYXkgb2YgZmxhdCBvYmplY3RzICAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIEtleTAgIEtleTEgS2V5MlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZUVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuICAgIHB1YmxpYyBkYXRhOiBUW107XHJcbiAgICBwdWJsaWMgYXR0SWNvbjogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVFtdLCBfYXR0SWNvbj86IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIHRoaXMuYXR0SWNvbiA9IF9hdHRJY29uO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwic29ydGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TT1JULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZFNvcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TRUxFQ1RfQUxMLCB0aGlzLnNlbGVjdEFsbCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSB0YWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIGxldCBoZWFkOiBUQUJMRVtdID0gdGhpcy5jb250cm9sbGVyLmdldEhlYWQoKTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVIZWFkKGhlYWQpKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBkYXRhLCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGluIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUYWJsZUl0ZW08VD5bXSA9IDxUYWJsZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxUYWJsZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwodGhpcy5kYXRhWzBdLCB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aC0xXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YVN0YXJ0KVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YUVuZClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gZW5kKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhKTtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVIZWFkKF9oZWFkSW5mbzogVEFCTEVbXSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgICBsZXQgdHI6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9oZWFkSW5mbykge1xyXG4gICAgICAgIGxldCB0aDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIik7XHJcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBlbnRyeS5sYWJlbDtcclxuICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5LnNvcnRhYmxlKSB7XHJcbiAgICAgICAgICB0aC5hcHBlbmRDaGlsZCh0aGlzLmdldFNvcnRCdXR0b25zKCkpO1xyXG4gICAgICAgICAgdGguYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgRVZFTlQuQ0hBTkdFLFxyXG4gICAgICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gdGguZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU09SVCwgeyBkZXRhaWw6IF9ldmVudC50YXJnZXQsIGJ1YmJsZXM6IHRydWUgfSkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U29ydEJ1dHRvbnMoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcmVzdWx0OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBmb3IgKGxldCBkaXJlY3Rpb24gb2YgW1widXBcIiwgXCJkb3duXCJdKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICBidXR0b24ubmFtZSA9IFwic29ydFwiO1xyXG4gICAgICAgIGJ1dHRvbi52YWx1ZSA9IGRpcmVjdGlvbjtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU29ydChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC5kZXRhaWwpLnZhbHVlO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IGRpcmVjdGlvbjogbnVtYmVyID0gKHZhbHVlID09IFwidXBcIikgPyAxIDogLTE7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zb3J0KHRoaXMuZGF0YSwga2V5LCBkaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU2VsZWN0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGV0YWlsOiB7IGRhdGE6IE9iamVjdDsgaW50ZXJ2YWw6IGJvb2xlYW47IGFkZGl0aXZlOiBib29sZWFuIH0gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsO1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uaW5kZXhPZig8VD5kZXRhaWwuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGV0YWlsLmludGVydmFsKSB7XHJcbiAgICAgICAgbGV0IGRhdGFTdGFydDogVCA9IDxUPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgbGV0IGRhdGFFbmQ6IFQgPSA8VD5kZXRhaWwuZGF0YTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChkYXRhU3RhcnQsIGRhdGFFbmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID49IDAgJiYgZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5wdXNoKDxUPmRldGFpbC5kYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUYWJsZUl0ZW08VD4gPSA8VGFibGVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW3RhcmdldC5kYXRhXSk7XHJcbiAgICAgIGlmIChkZWxldGVkLmxlbmd0aClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogQ2xpcGJvYXJkRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DVVQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuY3V0KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgaWYgKGN1dC5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gYXN5bmMgKF9ldmVudDogRHJhZ0V2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5SZWZsZWN0LmdldChfZXZlbnQsIFwiaXRlbVwiKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX1NUQVJUOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnU3RhcnQoaXRlbS5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19PVkVSOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJPUDpcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZHJvcChfZXZlbnQpO1xyXG4gICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBvYmplY3QsIHRoaXMuYXR0SWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLXNvcnRhYmxlXCIsIFRhYmxlLCB7IGV4dGVuZHM6IFwidGFibGVcIiB9KTtcclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9EYXRhQ29udHJvbGxlci50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEgW1tUYWJsZV1dIHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIFtbVGFibGVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUYWJsZUNvbnRyb2xsZXI8VD4gZXh0ZW5kcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICBcclxuICAgIC8qKiBSZXRyaWV2ZSBhIHN0cmluZyB0byBjcmVhdGUgYSBsYWJlbCBmb3IgdGhlIHRhYmxlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgKGFwcGVhcnMgbm90IHRvIGJlIGNhbGxlZCB5ZXQpICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldExhYmVsKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFJldHVybiBmYWxzZSBpZiByZW5hbWluZyBvZiBvYmplY3QgaXMgbm90IHBvc3NpYmlsZSwgb3IgdHJ1ZSBpZiB0aGUgb2JqZWN0IHdhcyByZW5hbWVkICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuYW1lKF9vYmplY3Q6IFQsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj47XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBUQUJMRS1vYmplY3RzIGRlc2NyaWJpbmcgdGhlIGhlYWQtdGl0bGVzIGFuZCBhY2NvcmRpbmcgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0SGVhZCgpOiBUQUJMRVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU29ydCBkYXRhIGJ5IGdpdmVuIGtleSBhbmQgZGlyZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzb3J0KF9kYXRhOiBUW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZDtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB0ci1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSBbW1RhYmxlXV1cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGVJdGVtPFQgZXh0ZW5kcyBPYmplY3Q+IGV4dGVuZHMgSFRNTFRhYmxlUm93RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgZGF0YTogVCA9IG51bGw7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCwgX2F0dEljb246IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGxheSA9IHRoaXMuY29udHJvbGxlci5nZXRMYWJlbChfZGF0YSk7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCksIF9hdHRJY29uKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVVBEQVRFLCB0aGlzLmhuZFVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSBbW0NTU19DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgW1tFVkVOVC5TRUxFQ1RdXSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKF9maWx0ZXI6IFRBQkxFW10sIF9hdHRJY29uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2ZpbHRlcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIGVudHJ5LmtleSk7XHJcbiAgICAgICAgbGV0IGljb246IHN0cmluZyA9IDxzdHJpbmc+UmVmbGVjdC5nZXQodGhpcy5kYXRhLCBfYXR0SWNvbik7XHJcbiAgICAgICAgbGV0IHRkOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gIWVudHJ5LmVkaXRhYmxlO1xyXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImtleVwiLCBlbnRyeS5rZXkpO1xyXG5cclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICBpZiAoaWNvbilcclxuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBpY29uKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0RXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgdGFyZ2V0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgLy8gbGV0IGtleTogc3RyaW5nID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgLy8gbGV0IHByZXZpb3VzVmFsdWU6IMaSLkdlbmVyYWwgPSBSZWZsZWN0LmdldCh0aGlzLmRhdGEsIGtleSk7XHJcblxyXG4gICAgICBpZiAoYXdhaXQgdGhpcy5jb250cm9sbGVyLnJlbmFtZSh0aGlzLmRhdGEsIHRhcmdldC52YWx1ZSkpIHtcclxuICAgICAgICAvLyBSZWZsZWN0LnNldCh0aGlzLmRhdGEsIGtleSwgdGFyZ2V0LnZhbHVlKTsgLy8gd2h5IHNob3VsZG4ndCB0aGUgY29udHJvbGxlciBkbyB0aGlzP1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzcGF0Y2ggUmVuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVNDQVBFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkM6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ09QWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5WOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlg6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ1VULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBzdG9yZSB0aGUgZHJhZ2dlZCBpdGVtIGluIHRoZSBldmVudCBmb3IgZnVydGhlciBwcm9jZXNzaW5nIGluIHRhYmxlXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG4gIH1cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1pdGVtXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+VGFibGVJdGVtLCB7IGV4dGVuZHM6IFwidHJcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiB7QGxpbmsgVHJlZUl0ZW19cyB0byByZXByZXNlbnQgYSBicmFuY2ggaW4gYSB0cmVlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWVMaXN0PFQ+IGV4dGVuZHMgSFRNTFVMaXN0RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPiwgX2l0ZW1zOiBUcmVlSXRlbTxUPltdID0gW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoX2l0ZW1zKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyb3ApO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidHJlZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aHMgdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aHMgaW5jbHVkZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfcGF0aHM6IFRbXVtdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IHBhdGggb2YgX3BhdGhzKVxyXG4gICAgICAgIHRoaXMuc2hvdyhwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGggdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aCBpbmNsdWRlcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3coX3BhdGg6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgY3VycmVudFRyZWU6IFRyZWVMaXN0PFQ+ID0gdGhpcztcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgX3BhdGgpIHtcclxuICAgICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSBjdXJyZW50VHJlZS5maW5kSXRlbShkYXRhKTtcclxuICAgICAgICBpZiAoIWl0ZW0pXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICAgIGN1cnJlbnRUcmVlID0gaXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdHJ1Y3R1cmVzIHRoZSBsaXN0IHRvIHN5bmMgd2l0aCB0aGUgZ2l2ZW4gbGlzdC4gXHJcbiAgICAgKiB7QGxpbmsgVHJlZUl0ZW19cyByZWZlcmVuY2luZyB0aGUgc2FtZSBvYmplY3QgcmVtYWluIGluIHRoZSBsaXN0LCBuZXcgaXRlbXMgZ2V0IGFkZGVkIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlLCBvYnNvbGV0ZSBvbmVzIGFyZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIF90cmVlIEEgbGlzdCB0byBzeW5jIHRoaXMgd2l0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdHJ1Y3R1cmUoX3RyZWU6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF90cmVlLmdldEl0ZW1zKCkpIHtcclxuICAgICAgICBsZXQgZm91bmQ6IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kSXRlbShpdGVtLmRhdGEpO1xyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgZm91bmQucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGZvdW5kLmhhc0NoaWxkcmVuID0gaXRlbS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgIGlmICghZm91bmQuaGFzQ2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGZvdW5kLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbih0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHtAbGluayBUcmVlSXRlbX0gb2YgdGhpcyBsaXN0IHJlZmVyZW5jaW5nIHRoZSBnaXZlbiBvYmplY3Qgb3IgbnVsbCwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kSXRlbShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKCg8VHJlZUl0ZW08VD4+aXRlbSkuZGF0YSwgX2RhdGEpKVxyXG4gICAgICAgICAgcmV0dXJuIDxUcmVlSXRlbTxUPj5pdGVtO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiB7QGxpbmsgVHJlZUl0ZW19cyBhdCB0aGUgZW5kIG9mIHRoaXMgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkSXRlbXMoX2l0ZW1zOiBUcmVlSXRlbTxUPltdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2l0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCBvZiB0aGlzIGxpc3QgYXMgYXJyYXkgb2Yge0BsaW5rIFRyZWVJdGVtfXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEl0ZW1zKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5maWx0ZXIoX2NoaWxkID0+IF9jaGlsZCBpbnN0YW5jZW9mIFRyZWVJdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBfZGF0YVN0YXJ0KSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFFbmQpKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBlbmQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoaXRlbXNbMF0uZGF0YSwgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0uZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShfZGF0YTogVFtdKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUcmVlSXRlbTxUPltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSkge1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoX2RhdGEsIGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFsbCBleHBhbmRlZCB7QGxpbmsgVHJlZUl0ZW19cyB0aGF0IGFyZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXhwYW5kZWQoKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiBbLi4udGhpc10uZmlsdGVyKF9pdGVtID0+IF9pdGVtLmV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFRyZWVJdGVtPFQ+PiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB5aWVsZCBpdGVtc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuaGFzKF9ldmVudCwgXCJpbmRleFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0OiBUID0gKDxUcmVlSXRlbTxUPj50aGlzLnBhcmVudEVsZW1lbnQpLmRhdGE7XHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpbmRleFwiLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IuaXNDb25uZWN0ZWQgP1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuaW5kZXhPZih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpIDpcclxuICAgICAgICBudWxsKTtcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcInBhcmVudFwiLCB0YXJnZXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXQ6IFQgPSAoPFRyZWVJdGVtPFQ+PnRoaXMucGFyZW50RWxlbWVudCkuZGF0YTtcclxuICAgICAgaWYgKHRhcmdldCA9PSBudWxsIHx8ICF0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0YXJnZXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdGFyZ2V0SXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoX3RhcmdldCA9PiBfdGFyZ2V0IGluc3RhbmNlb2YgVHJlZUl0ZW0pO1xyXG4gICAgICAgIGlmICh0aGlzLmdldEl0ZW1zKCkuaW5jbHVkZXModGFyZ2V0SXRlbSkpIHtcclxuICAgICAgICAgIGxldCByZWN0OiBET01SZWN0ID0gdGFyZ2V0SXRlbS5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgbGV0IGFkZEJlZm9yZTogYm9vbGVhbiA9IF9ldmVudC5jbGllbnRZIDwgcmVjdC50b3AgKyByZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBsZXQgc2libGluZzogRWxlbWVudCA9IGFkZEJlZm9yZSA/IHRhcmdldEl0ZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA6IHRhcmdldEl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHNpYmxpbmcgIT0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKVxyXG4gICAgICAgICAgICBpZiAoYWRkQmVmb3JlKVxyXG4gICAgICAgICAgICAgIHRhcmdldEl0ZW0uYmVmb3JlKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmFmdGVyKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZS1saXN0XCIsIFRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIlRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBleHBvcnQgZW51bSBDU1NfQ0xBU1Mge1xyXG4gICAgU0VMRUNURUQgPSBcInNlbGVjdGVkXCIsXHJcbiAgICBJTkFDVElWRSA9IFwiaW5hY3RpdmVcIlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHtAbGluayBUcmVlTGlzdH0gdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIGEgdHJlZSBjb250cm9sICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogdHJlZSA8dWw+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiDilJQgdHJlZUxpc3QgPHVsPlxyXG4gICAqIOKUgiAgIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCICAg4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlPFQ+IGV4dGVuZHMgVHJlZUxpc3Q8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9yb290OiBUKSB7XHJcbiAgICAgIHN1cGVyKF9jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGxldCByb290OiBUcmVlSXRlbTxUPiA9IG5ldyBUcmVlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIF9yb290KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyb290KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXhwYW5kKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0xFQVZFLCB0aGlzLmhuZERyYWdMZWF2ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXMgb3IgbnVsbCBpZiBub25lIGlzIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCB0aGUgd2hvbGUgdHJlZSB0byBzeW5jaHJvbml6ZSB3aXRoIHRoZSBkYXRhIHRoZSB0cmVlIGlzIGJhc2VkIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcykge1xyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpKTtcclxuICAgICAgICBpdGVtLmdldEJyYW5jaCgpLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oaXRlbS5kYXRhKSlcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gY2hpbGRyZW4gdG8gdGhlIGdpdmVuIHRhcmdldCBhdCB0aGUgZ2l2ZW4gaW5kZXguIElmIG5vIGluZGV4IGlzIGdpdmVuLCB0aGUgY2hpbGRyZW4gYXJlIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihfY2hpbGRyZW4sIF90YXJnZXQsIF9pbmRleCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogVCA9IHRoaXMuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgLy8gVE9ETzogZG9uJ3QsIHdoZW4gY29weWluZyBvciBjb21pbmcgZnJvbSBhbm90aGVyIHNvdXJjZVxyXG4gICAgICB0aGlzLmRlbGV0ZShtb3ZlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXREYXRhOiBUID0gPFQ+X3RhcmdldDtcclxuICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kVmlzaWJsZSh0YXJnZXREYXRhKTtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKHRhcmdldERhdGEpKTtcclxuICAgICAgbGV0IG9sZDogVHJlZUxpc3Q8VD4gPSB0YXJnZXRJdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB0YXJnZXRJdGVtLmhhc0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgaWYgKG9sZClcclxuICAgICAgICBvbGQucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRhcmdldEl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5maW5kVmlzaWJsZShmb2N1cyk/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFeHBhbmQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGNoaWxkcmVuOiBUW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKTtcclxuICAgICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKGNoaWxkcmVuKTtcclxuICAgICAgaXRlbS5zZXRCcmFuY2goYnJhbmNoKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQnJhbmNoKF9kYXRhOiBUW10pOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gbmV3IFRyZWVMaXN0PFQ+KHRoaXMuY29udHJvbGxlciwgW10pO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfZGF0YSkge1xyXG4gICAgICAgIGJyYW5jaC5hZGRJdGVtcyhbbmV3IFRyZWVJdGVtKHRoaXMuY29udHJvbGxlciwgY2hpbGQpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJyYW5jaDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSBhc3luYyAoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG4gICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfU1RBUlQ6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdTdGFydChpdGVtLmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX09WRVI6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ092ZXIoX2V2ZW50KTtcclxuICAgICAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUk9QOlxyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kcm9wKF9ldmVudCk7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpbmRleFwiKTtcclxuICAgICAgICAgIGxldCBwYXJlbnQ6IFQgPSBSZWZsZWN0LmdldChfZXZlbnQsIFwicGFyZW50XCIpO1xyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbihvYmplY3RzLCBpbmRleCA9PSBudWxsID8gaXRlbS5kYXRhIDogcGFyZW50LCBpbmRleCk7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdMZWF2ZSA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBsZXQgcmVsYXRlZFRhcmdldDogRXZlbnRUYXJnZXQgPSBfZXZlbnQucmVsYXRlZFRhcmdldDtcclxuICAgICAgLy8gaWYgKHJlbGF0ZWRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0KSAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0Lm9mZnNldFBhcmVudCkpIC8vIG9mZnNldCBwYXJlbnQgaXMgZm9yIHdlaXJkIChpbnZpc2libGUpIGRpdnMgd2hpY2ggYXJlIHBsYWNlZCBvdmVyIGlucHV0IGVsZW1lbnRzIGFuZCB0cmlnZ2VyIGxlYXZlIGV2ZW50cy4uLiBcclxuICAgICAgLy8gICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVtb3ZlOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZShyZW1vdmUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEVzY2FwZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDb3B5UGFzdGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmN1dCh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIC8vIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4ob2JqZWN0cywgdGFyZ2V0LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgVHJlZSwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vRGF0YUNvbnRyb2xsZXIudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIHtAbGluayBUcmVlfSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSB7QGxpbmsgVHJlZX0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJlZUNvbnRyb2xsZXI8VD4gZXh0ZW5kcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogVXNlZCBieSB0aGUgdHJlZSB0byBpbmRpY2F0ZSB0aGUgZHJvcCBwb3NpdGlvbiB3aGlsZSBkcmFnZ2luZyAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wSW5kaWNhdG9yOiBIVE1MSFJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpO1xyXG5cclxuICAgIC8qKiBPdmVycmlkZSB0byBlbmFibGUgdHJlZSBpdGVtcyB0byBiZSBzb3J0YWJsZSBieSB0aGUgdXNlciB2aWEgZHJhZy1hbmQtZHJvcC4gRGVmYXVsdCBpcyB0cnVlLiAqL1xyXG4gICAgcHVibGljIHNvcnRhYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGRyYWdnYWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ2dhYmxlKF9vYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdHdvIG9iamVjdHMgb2YgYXJlIGVxdWFsLiBEZWZhdWx0IGlzIF9hID09IF9iLiBPdmVycmlkZSBmb3IgbW9yZSBjb21wbGV4IGNvbXBhcmlzb25zLiBcclxuICAgICAqIFVzZWZ1bCB3aGVuIHRoZSB1bmRlcmx5aW5nIGRhdGEgaXMgdm9sYXRpbGUgYW5kIGNoYW5nZXMgaWRlbnRpdHkgd2hpbGUgc3RheWluZyB0aGUgc2FtZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyhfYTogVCwgX2I6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hID09IF9iO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgYWRkYWJsZSB0byBvdGhlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgLyoqIENyZWF0ZSBhbiBIVE1MRWxlbWVudCBmb3IgdGhlIHRyZWUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdC4gZS5nLiBhbiBIVE1MSW5wdXRFbGVtZW50ICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlQ29udGVudChfb2JqZWN0OiBUKTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgbGlzdCBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IGZvciBmdXJ0aGVyIHN0eWxpbmcgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBQcm9jZXNzIHRoZSBwcm9wb3NlZCBuZXcgdmFsdWUuIFRoZSBpZCBvZiB0aGUgaHRtbCBlbGVtZW50IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugb2NjdXJlZCBpcyBwYXNzZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWYWx1ZShfb2JqZWN0OiBULCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBoYXMgY2hpbGRyZW4gdGhhdCBtdXN0IGJlIHNob3duIHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBoYXNDaGlsZHJlbihfb2JqZWN0OiBUKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRoZSBvYmplY3QncyBjaGlsZHJlbiB0byBzaG93IHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDaGlsZHJlbihfb2JqZWN0OiBUKTogVFtdO1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogVFtdO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiBsaS1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSB7QGxpbmsgVHJlZUxpc3R9IHdpdGggYSBjaGVja2JveCBhbmQgdXNlciBkZWZpbmVkIGlucHV0IGVsZW1lbnRzIGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnT3Zlcik7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnRHJvcCk7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZFJlbW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUsIHdoZW4gdGhpcyBpdGVtIGhhcyBhIHZpc2libGUgY2hlY2tib3ggaW4gZnJvbnQgdG8gZXhwYW5kIHRoZSBzdWJzZXF1ZW50IGJyYW5jaCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3Mgb3IgaGlkZXMgdGhlIGNoZWNrYm94IGZvciBleHBhbmRpbmcgdGhlIHN1YnNlcXVlbnQgYnJhbmNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgaGFzQ2hpbGRyZW4oX2hhczogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgPSBfaGFzID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgcmVwcmVzZW50aW5nIHRoZSBhdHRhY2hlZCB7QGxpbmsgZGF0YX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjb250ZW50KCk6IEhUTUxGaWVsZFNldEVsZW1lbnQge1xyXG4gICAgICByZXR1cm4gdGhpcy4jY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGlzIGl0ZW0gaXMgZXhwYW5kZWQsIHNob3dpbmcgaXQncyBjaGlsZHJlbiwgb3IgY2xvc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEJyYW5jaCgpICYmIHRoaXMuY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy4jY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIuY3JlYXRlQ29udGVudCh0aGlzLmRhdGEpKTtcclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmllcyB0byBleHBhbmRpbmcgdGhlIHtAbGluayBUcmVlTGlzdH0gb2YgY2hpbGRyZW4sIGJ5IGRpc3BhdGNoaW5nIHtAbGluayBFVkVOVC5FWFBBTkR9LlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQge0BsaW5rIFRyZWVMaXN0fSBhbmQgYWRkIGl0IGFzIGJyYW5jaCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcblxyXG4gICAgICBpZiAoX2V4cGFuZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVYUEFORCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuXHJcbiAgICAgIHRoaXMuY2hlY2tib3guY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgICAgLy8gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIHtAbGluayBUcmVlTGlzdH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEJyYW5jaChfYnJhbmNoOiBUcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG4gICAgICBpZiAoX2JyYW5jaClcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKF9icmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJyYW5jaCgpOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIHJldHVybiA8VHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUge0BsaW5rIEVWRU5ULlNFTEVDVH0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBmcm9tIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUJyYW5jaCgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmdldEJyYW5jaCgpO1xyXG4gICAgICBpZiAoIWJyYW5jaClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5jaGVja2JveC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY2hlY2tib3gpO1xyXG4gICAgICB0aGlzLiNjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuI2NvbnRlbnQpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLiNjb250ZW50LmRpc2FibGVkKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRVNDIHx8IF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRU5URVIpXHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICF0aGlzLmV4cGFuZGVkKVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5leHBhbmRlZClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy4jY29udGVudC5lbGVtZW50cy5pdGVtKDApO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGJsQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoX2V2ZW50LnBhZ2VYLCBfZXZlbnQucGFnZVkpOyAvLyBkaXNhYmxlZCBlbGVtZW50cyBkb24ndCBkaXNwYXRjaCBjbGljayBldmVudHMsIGdldCB0aGUgZWxlbWVudCBtYW51YWxseVxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdGFyZ2V0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuc2V0VmFsdWUodGhpcy5kYXRhLCB0YXJnZXQpO1xyXG5cclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUk9QKVxyXG4gICAgICAvLyAgIGRlYnVnZ2VyO1xyXG4gICAgICBpZiAoUmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBzdG9yZSB0aGUgZHJhZ2dlZCBpdGVtIGluIHRoZSBldmVudCBmb3IgZnVydGhlciBwcm9jZXNzaW5nIGluIHRhYmxlXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRoaXMuI2NvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpIHx8ICF0aGlzLmNvbnRyb2xsZXIuc29ydGFibGUpIHtcclxuICAgICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuICAgICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJBR19PVkVSKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0aGlzLmRhdGEpKSB7XHJcbiAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB0aGUgdmlld3MgbWlnaHQgbmVlZCB0byBrbm93IGFib3V0IHRoaXMgZXZlbnRcclxuICAgICAgLy8gaWYgKF9ldmVudC5jdXJyZW50VGFyZ2V0ID09IF9ldmVudC50YXJnZXQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJsaS10cmVlLWl0ZW1cIiwgVHJlZUl0ZW0sIHsgZXh0ZW5kczogXCJsaVwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIGV4cG9ydCB0eXBlIERST1BFRkZFQ1QgPSBcIm5vbmVcIiB8IFwiY29weVwiIHwgXCJsaW5rXCIgfCBcIm1vdmVcIjtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGVudW0gRVZFTlQge1xyXG4gICAgQ0xJQ0sgPSBcImNsaWNrXCIsXHJcbiAgICBET1VCTEVfQ0xJQ0sgPSBcImRibGNsaWNrXCIsXHJcbiAgICBLRVlfRE9XTiA9IFwia2V5ZG93blwiLFxyXG4gICAgRFJBR19TVEFSVCA9IFwiZHJhZ3N0YXJ0XCIsXHJcbiAgICBEUkFHX0VOVEVSID0gXCJkcmFnZW50ZXJcIixcclxuICAgIERSQUdfT1ZFUiA9IFwiZHJhZ292ZXJcIixcclxuICAgIERSQUdfTEVBVkUgPSBcImRyYWdsZWF2ZVwiLFxyXG4gICAgRFJPUCA9IFwiZHJvcFwiLFxyXG4gICAgUE9JTlRFUl9VUCA9IFwicG9pbnRlcnVwXCIsXHJcbiAgICBXSEVFTCA9IFwid2hlZWxcIixcclxuICAgIEZPQ1VTX05FWFQgPSBcImZvY3VzTmV4dFwiLFxyXG4gICAgRk9DVVNfUFJFVklPVVMgPSBcImZvY3VzUHJldmlvdXNcIixcclxuICAgIEZPQ1VTX0lOID0gXCJmb2N1c2luXCIsXHJcbiAgICBGT0NVU19PVVQgPSBcImZvY3Vzb3V0XCIsXHJcbiAgICBGT0NVU19TRVQgPSBcImZvY3VzU2V0XCIsXHJcbiAgICBCTFVSID0gXCJibHVyXCIsXHJcbiAgICBDSEFOR0UgPSBcImNoYW5nZVwiLFxyXG4gICAgREVMRVRFID0gXCJkZWxldGVcIixcclxuICAgIFJFTkFNRSA9IFwicmVuYW1lXCIsXHJcbiAgICBTRUxFQ1QgPSBcIml0ZW1zZWxlY3RcIixcclxuICAgIEVTQ0FQRSA9IFwiZXNjYXBlXCIsXHJcbiAgICBDT1BZID0gXCJjb3B5XCIsXHJcbiAgICBDVVQgPSBcImN1dFwiLFxyXG4gICAgUEFTVEUgPSBcInBhc3RlXCIsXHJcbiAgICBTT1JUID0gXCJzb3J0XCIsXHJcbiAgICBDT05URVhUTUVOVSA9IFwiY29udGV4dG1lbnVcIixcclxuICAgIE1VVEFURSA9IFwibXV0YXRlXCIsXHJcbiAgICBSRU1PVkVfQ0hJTEQgPSBcInJlbW92ZUNoaWxkXCIsXHJcbiAgICBDT0xMQVBTRSA9IFwiY29sbGFwc2VcIixcclxuICAgIEVYUEFORCA9IFwiZXhwYW5kXCIsXHJcbiAgICBJTlBVVCA9IFwiaW5wdXRcIixcclxuICAgIFJFQVJSQU5HRV9BUlJBWSA9IFwicmVhcnJhbmdlQXJyYXlcIixcclxuICAgIFRPR0dMRSA9IFwidG9nZ2xlXCIsXHJcbiAgICBQT0lOVEVSX01PVkUgPSBcInBvaW50ZXJtb3ZlXCIsXHJcbiAgICBJTlNFUlQgPSBcImluc2VydFwiLFxyXG4gICAgU0VMRUNUX0FMTCA9IFwic2VsZWN0QWxsXCJcclxuICB9XHJcbn0iXX0=