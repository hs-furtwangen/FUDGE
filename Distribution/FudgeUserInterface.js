"use strict";
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
                    if (subMutable instanceof ƒ.Mutable)
                        element = Generator.createDetailsFromMutable(subMutable, key, value);
                }
                if (!element && type)
                    element = new FudgeUserInterface.CustomElementOutput({ key: key, label: key, type: type.toString(), value: value?.toString(), placeholder: `Drop your ${type} here...` });
                if (!element) // undefined values without a type can't be displayed
                    continue;
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
                console.log(keyDrag);
            };
            this.hndDragOver = (_event) => {
                _event.preventDefault();
                if (_event.ctrlKey)
                    _event.dataTransfer.dropEffect = "copy";
                if (_event.shiftKey)
                    _event.dataTransfer.dropEffect = "link";
            };
            this.hndDrop = (_event) => {
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
    /**
     * Extension of ul-element that keeps a list of {@link CustomTreeItem}s to represent a branch in a tree
     */
    class CustomTreeList extends HTMLUListElement {
        constructor(_controller, _items = []) {
            super();
            this.hndDragOver = (_event) => {
                _event.stopPropagation();
                let target = this.parentElement.data;
                if (target == null || !this.controller.canAddChildren(this.controller.dragDrop.sources, target))
                    return;
                _event.preventDefault();
                _event.dataTransfer.dropEffect = "move";
                if (_event.target == this)
                    this.controller.dragDropIndicator.remove();
                else {
                    let targetItem = _event.composedPath().find(_target => _target instanceof FudgeUserInterface.CustomTreeItem);
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
                this.controller.dragDrop.at = this.controller.dragDropIndicator.isConnected ?
                    Array.from(this.children).indexOf(this.controller.dragDropIndicator) :
                    this.controller.dragDrop.at = null;
                this.controller.dragDrop.target = target;
            };
            this.controller = _controller;
            this.addItems(_items);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
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
         * {@link CustomTreeItem}s referencing the same object remain in the list, new items get added in the order of appearance, obsolete ones are deleted.
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
         * Returns the {@link CustomTreeItem} of this list referencing the given object or null, if not found
         */
        findItem(_data) {
            for (let item of this.children)
                if (this.controller.equals(item.data, _data))
                    return item;
            return null;
        }
        /**
         * Adds the given {@link CustomTreeItem}s at the end of this list
         */
        addItems(_items) {
            for (let item of _items) {
                this.appendChild(item);
            }
        }
        /**
         * Returns the content of this list as array of {@link CustomTreeItem}s
         */
        getItems() {
            return Array.from(this.children).filter(_child => _child instanceof FudgeUserInterface.CustomTreeItem);
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
         * Returns all expanded {@link CustomTreeItem}s that are a descendant of this list.
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
    FudgeUserInterface.CustomTreeList = CustomTreeList;
    customElements.define("ul-custom-tree-list", CustomTreeList, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
///<reference path="CustomTreeList.ts"/>
var FudgeUserInterface;
///<reference path="CustomTreeList.ts"/>
(function (FudgeUserInterface) {
    /**
     * Extension of {@link CustomTreeList} that represents the root of a tree control
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
    class CustomTree extends FudgeUserInterface.CustomTreeList {
        constructor(_controller, _root) {
            super(_controller, []);
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
                // console.log(_event);
                _event.stopPropagation();
                let target = _event.target;
                switch (_event.type) {
                    case "copy" /* EVENT.COPY */:
                        this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
                        break;
                    case "paste" /* EVENT.PASTE */:
                        this.addChildren(this.controller.copyPaste.sources, target.data);
                        break;
                    case "cut" /* EVENT.CUT */:
                        this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
                        let cut = await this.controller.delete(this.controller.selection);
                        this.delete(cut);
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
            let root = new FudgeUserInterface.CustomTreeItem(this.controller, _root);
            this.appendChild(root);
            this.addEventListener("expand" /* EVENT.EXPAND */, this.hndExpand);
            this.addEventListener("itemselect" /* EVENT.SELECT */, this.hndSelect);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDrop, true);
            this.addEventListener("dragleave" /* EVENT.DRAG_LEAVE */, this.hndDragLeave);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste);
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
            let branch = new FudgeUserInterface.CustomTreeList(this.controller, []);
            for (let child of _data) {
                branch.addItems([new FudgeUserInterface.CustomTreeItem(this.controller, child)]);
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
        hndDrop(_event) {
            this.addChildren(this.controller.dragDrop.sources, this.controller.dragDrop.target, this.controller.dragDrop.at);
            this.controller.dragDrop.sources = [];
            this.controller.dragDropIndicator.remove();
        }
    }
    FudgeUserInterface.CustomTree = CustomTree;
    customElements.define("ul-custom-tree", CustomTree, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a {@link CustomTree} to display and manipulate it.
     * The {@link CustomTree} doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class CustomTreeController {
        constructor() {
            /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
            this.selection = [];
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.dragDrop = { sources: [], target: null };
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.copyPaste = { sources: [], target: null };
            /** Used by the tree to indicate the drop position while dragging */
            this.dragDropIndicator = document.createElement("hr");
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
    FudgeUserInterface.CustomTreeController = CustomTreeController;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Extension of li-element that represents an object in a {@link CustomTreeList} with a checkbox and an HTMLElement as content.
     * Additionally, may hold an instance of {@link CustomTreeList} as branch to display children of the corresponding object.
     */
    class CustomTreeItem extends HTMLLIElement {
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
                if (!this.#content.disabled)
                    return;
                let content = this.querySelector("ul");
                switch (_event.code) {
                    // TODO: repair arrow key navigation
                    case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                        if (this.hasChildren && !content)
                            this.expand(true);
                        else
                            this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                        if (content)
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
                        element?.focus();
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
            this.hndDragStart = (_event) => {
                // _event.stopPropagation();
                if (_event.dataTransfer.getData("dragstart"))
                    return;
                this.controller.dragDrop.sources = [];
                if (this.selected)
                    this.controller.dragDrop.sources = this.controller.selection;
                else
                    this.controller.dragDrop.sources = [this.data];
                _event.dataTransfer.effectAllowed = "all";
                _event.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
                this.controller.dragDrop.target = null;
                // mark as already processed by this tree item to ignore it in further propagation through the tree
                _event.dataTransfer.setData("dragstart", "dragstart");
            };
            this.hndDrag = (_event) => {
                let rect = this.#content.getBoundingClientRect();
                let upper = rect.top + rect.height * (1 / 4);
                let lower = rect.top + rect.height * (3 / 4);
                let offset = _event.clientY;
                if (this.parentElement instanceof FudgeUserInterface.CustomTree || (offset > upper && (offset < lower || this.checkbox.checked))) {
                    _event.stopPropagation();
                    if (_event.type == "dragover" /* EVENT.DRAG_OVER */)
                        this.controller.dragDropIndicator.remove();
                    if (this.controller.canAddChildren(this.controller.dragDrop.sources, this.data)) {
                        _event.preventDefault();
                        _event.dataTransfer.dropEffect = "move";
                        this.controller.dragDrop.at = null;
                        this.controller.dragDrop.target = this.data;
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
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragStart);
            this.addEventListener("dragenter" /* EVENT.DRAG_ENTER */, this.hndDrag); // this prevents cursor from flickering
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDrag);
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
         * Tries to expanding the {@link CustomTreeList} of children, by dispatching {@link EVENT.EXPAND}.
         * The user of the tree needs to add an event listener to the tree
         * in order to create that {@link CustomTreeList} and add it as branch to this item
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
         * Sets the branch of children of this item. The branch must be a previously compiled {@link CustomTreeList}
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
            let content = this.getBranch();
            if (!content)
                return;
            this.removeChild(content);
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
    FudgeUserInterface.CustomTreeItem = CustomTreeItem;
    customElements.define("li-custom-tree-item", CustomTreeItem, { extends: "li" });
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
        constructor(_controller, _data, _icon) {
            super();
            // private hndDrop(_event: DragEvent): void {
            //   // _event.stopPropagation();
            //   // this.addChildren(this.controller.dragDrop.sources, this.controller.dragDrop.target);
            // }
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
            // private hndCopyPaste = async (_event: Event): Promise<void> => {
            //   // // console.log(_event);
            //   // _event.stopPropagation();
            //   // let target: TreeItem<T> = <TreeItem<T>>_event.target;
            //   // switch (_event.type) {
            //   //   case EVENT_TREE.COPY:
            //   //     this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
            //   //     break;
            //   //   case EVENT_TREE.PASTE:
            //   //     this.addChildren(this.controller.copyPaste.sources, target.data);
            //   //     break;
            //   //   case EVENT_TREE.CUT:
            //   //     this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
            //   //     let cut: T[] = this.controller.delete(this.controller.selection);
            //   //     this.delete(cut);
            //   //     break;
            //   // }
            // }
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
            this.icon = _icon;
            this.create();
            this.className = "sortable";
            this.addEventListener("sort" /* EVENT.SORT */, this.hndSort);
            this.addEventListener("itemselect" /* EVENT.SELECT */, this.hndSelect);
            this.addEventListener("focusNext" /* EVENT.FOCUS_NEXT */, this.hndFocus);
            this.addEventListener("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, this.hndFocus);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            // this.addEventListener(EVENT_TABLE.CHANGE, this.hndSort);
            // this.addEventListener(EVENT.CHANGE, this.hndChange);
            // this.addEventListener(EVENT_TREE.DROP, this.hndDrop);
            // this.addEventListener(EVENT_TREE.COPY, this.hndCopyPaste);
            // this.addEventListener(EVENT_TREE.PASTE, this.hndCopyPaste);
            // this.addEventListener(EVENT_TREE.CUT, this.hndCopyPaste);
        }
        /**
         * Create the table
         */
        create() {
            this.innerHTML = "";
            let head = this.controller.getHead();
            this.appendChild(this.createHead(head));
            for (let row of this.data) {
                // tr = this.createRow(row, head);
                let item = new FudgeUserInterface.TableItem(this.controller, row);
                // TODO: see if icon consideration should move to TableItem
                if (this.icon)
                    item.setAttribute("icon", Reflect.get(row, this.icon));
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
            // console.log(_dataStart, _dataEnd);
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
        // private hndEvent(_event: Event): void {
        //   console.log(_event.currentTarget);
        //   switch (_event.type) {
        //     case EVENT.CLICK:
        //       let event: CustomEvent = new CustomEvent(EVENT.SELECT, { bubbles: true });
        //       this.dispatchEvent(event);
        //   }
        // }
        // private hndRename(_event: Event): void {
        //   // let item: TreeItem<T> = <TreeItem<T>>(<HTMLInputElement>_event.target).parentNode;
        //   // let renamed: boolean = this.controller.rename(item.data, item.getLabel());
        //   // if (renamed)
        //   //   item.setLabel(this.controller.getLabel(item.data));
        // }
        // private hndChange = (_event: Event): void => {
        //   let target: HTMLInputElement = <HTMLInputElement>_event.target;
        //   console.log(_event);
        //   _event.stopPropagation();
        //   target.dispatchEvent(new CustomEvent(EVENT.RENAME, { bubbles: true, detail: {data: this.data} }));
        // };
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
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a [[Table]] to display and manipulate it.
     * The [[Table]] doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class TableController {
        constructor() {
            /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of table */
            this.selection = [];
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
            this.dragDrop = { sources: [], target: null };
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
            this.copyPaste = { sources: [], target: null };
        }
        async delete(_focussed) { return _focussed; }
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
        constructor(_controller, _data) {
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
                // if (!this.label.disabled)
                //   return;
                // let content: TreeList<T> = <TreeList<T>>this.querySelector("ul");
                switch (_event.code) {
                    // case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                    //   this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_NEXT, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                    //   break;
                    // case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                    //   this.dispatchEvent(new KeyboardEvent(EVENT.FOCUS_PREVIOUS, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                    //   break;
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
            this.hndDragStart = (_event) => {
                // _event.stopPropagation();
                this.controller.dragDrop.sources = [];
                if (this.selected)
                    this.controller.dragDrop.sources = this.controller.selection;
                else
                    this.controller.dragDrop.sources = [this.data];
                _event.dataTransfer.effectAllowed = "all";
            };
            this.hndDragOver = (_event) => {
                // _event.stopPropagation();
                _event.preventDefault();
                this.controller.dragDrop.target = this.data;
                // _event.dataTransfer.dropEffect = "link";
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
            this.create(this.controller.getHead());
            this.className = "table";
            this.addEventListener("pointerup" /* EVENT.POINTER_UP */, this.hndPointerUp);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            // this.addEventListener(EVENT.DOUBLE_CLICK, this.hndDblClick);
            // this.addEventListener(EVENT_TREE.FOCUS_NEXT, this.hndFocus);
            // this.addEventListener(EVENT_TREE.FOCUS_PREVIOUS, this.hndFocus);
            this.draggable = true;
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragStart);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
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
        create(_filter) {
            for (let entry of _filter) {
                let value = Reflect.get(this.data, entry.key);
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
    * Extension of ul-element that keeps a list of [[TreeItem]]s to represent a branch in a tree
    */
    class TreeList extends HTMLUListElement {
        constructor(_items = []) {
            super();
            this.addItems(_items);
            this.className = "tree";
        }
        /**
         * Expands the tree along the given path to show the objects the path includes
         * @param _path An array of objects starting with one being contained in this treelist and following the correct hierarchy of successors
         * @param _focus If true (default) the last object found in the tree gets the focus
         */
        show(_path, _focus = true) {
            let currentTree = this;
            for (let data of _path) {
                let item = currentTree.findItem(data);
                item.focus();
                let content = item.getBranch();
                if (!content) {
                    item.expand(true);
                    content = item.getBranch();
                }
                currentTree = content;
            }
        }
        /**
         * Restructures the list to sync with the given list.
         * [[TreeItem]]s referencing the same object remain in the list, new items get added in the order of appearance, obsolete ones are deleted.
         * @param _tree A list to sync this with
         */
        restructure(_tree) {
            let items = [];
            for (let item of _tree.getItems()) {
                let found = this.findItem(item.data);
                if (found) {
                    found.setLabel(item.display);
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
        }
        /**
         * Returns the [[TreeItem]] of this list referencing the given object or null, if not found
         */
        findItem(_data) {
            for (let item of this.children)
                if (item.data == _data)
                    return item;
            return null;
        }
        /**
         * Adds the given [[TreeItem]]s at the end of this list
         */
        addItems(_items) {
            for (let item of _items) {
                this.appendChild(item);
            }
        }
        /**
         * Returns the content of this list as array of [[TreeItem]]s
         */
        getItems() {
            return this.children;
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
        delete(_data) {
            let items = this.querySelectorAll("li");
            let deleted = [];
            for (let item of items)
                if (_data.indexOf(item.data) > -1) {
                    // item.dispatchEvent(new Event(EVENT.UPDATE, { bubbles: true }));
                    item.dispatchEvent(new Event("removeChild" /* EVENT.REMOVE_CHILD */, { bubbles: true }));
                    deleted.push(item.parentNode.removeChild(item));
                }
            return deleted;
        }
        findVisible(_data) {
            let items = this.querySelectorAll("li");
            for (let item of items)
                if (_data == item.data)
                    return item;
            return null;
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
     * Extension of [[TreeList]] that represents the root of a tree control
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
            super([]);
            this.hndDelete = (_event) => {
                let target = _event.target;
                _event.stopPropagation();
                let remove = this.controller.delete([target.data]);
                this.delete(remove);
            };
            this.hndEscape = (_event) => {
                this.clearSelection();
            };
            this.hndCopyPaste = async (_event) => {
                // console.log(_event);
                _event.stopPropagation();
                let target = _event.target;
                switch (_event.type) {
                    case "copy" /* EVENT.COPY */:
                        this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
                        break;
                    case "paste" /* EVENT.PASTE */:
                        this.addChildren(this.controller.copyPaste.sources, target.data);
                        break;
                    case "cut" /* EVENT.CUT */:
                        this.controller.copyPaste.sources = await this.controller.copy([...this.controller.selection]);
                        let cut = this.controller.delete(this.controller.selection);
                        this.delete(cut);
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
            this.controller = _controller;
            let root = new FudgeUserInterface.TreeItem(this.controller, _root);
            this.appendChild(root);
            this.addEventListener("expand" /* EVENT.EXPAND */, this.hndExpand);
            this.addEventListener("rename" /* EVENT.RENAME */, this.hndRename);
            this.addEventListener("itemselect" /* EVENT.SELECT */, this.hndSelect);
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDrop, true);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste);
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
         * Return the object in focus
         */
        getFocussed() {
            let items = Array.from(this.querySelectorAll("li"));
            let found = items.indexOf(document.activeElement);
            if (found > -1)
                return items[found].data;
            return null;
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
            let branch = new FudgeUserInterface.TreeList([]);
            for (let child of _data) {
                branch.addItems([new FudgeUserInterface.TreeItem(this.controller, child)]);
            }
            return branch;
        }
        hndRename(_event) {
            let item = _event.target.parentNode;
            let renamed = this.controller.rename(item.data, item.getLabel());
            if (renamed)
                item.setLabel(this.controller.getLabel(item.data));
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
        hndDrop(_event) {
            // _event.stopPropagation();
            // console.log(_event.dataTransfer);
            this.addChildren(this.controller.dragDrop.sources, this.controller.dragDrop.target);
        }
        addChildren(_children, _target) {
            // if drop target included in children -> refuse
            if (_children.indexOf(_target) > -1)
                return;
            // add only the objects the addChildren-method of the controller returns
            let move = this.controller.addChildren(_children, _target);
            if (!move || move.length == 0)
                return;
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
            _children = [];
            _target = null;
        }
    }
    FudgeUserInterface.Tree = Tree;
    customElements.define("ul-tree", Tree, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a [[Tree]] to display and manipulate it.
     * The [[Tree]] doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class TreeController {
        constructor() {
            /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
            this.selection = [];
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.dragDrop = { sources: [], target: null };
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.copyPaste = { sources: [], target: null };
            // public abstract hndDragOver = (_event: DragEvent): void => {
            //   _event.stopPropagation();
            //   _event.preventDefault();
            //   this.dragDrop.target = (<TreeItem<T>>_event.currentTarget).data;
            //   console.log(_event.currentTarget);
            //   _event.dataTransfer.dropEffect = "move";
            // }
        }
    }
    FudgeUserInterface.TreeController = TreeController;
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    var ƒ = FudgeCore;
    /**
     * Extension of li-element that represents an object in a [[TreeList]] with a checkbox and a textinput as content.
     * Additionally, may hold an instance of [[TreeList]] as branch to display children of the corresponding object.
     */
    class TreeItem extends HTMLLIElement {
        constructor(_controller, _data) {
            super();
            this.display = "TreeItem";
            this.classes = [];
            this.data = null;
            this.hndFocus = (_event) => {
                if (_event.target == this.label)
                    this.label.disabled = true;
            };
            this.hndKey = (_event) => {
                _event.stopPropagation();
                if (!this.label.disabled)
                    return;
                let content = this.querySelector("ul");
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                        if (this.hasChildren && !content)
                            this.expand(true);
                        else
                            this.dispatchEvent(new KeyboardEvent("focusNext" /* EVENT.FOCUS_NEXT */, { bubbles: true, shiftKey: _event.shiftKey, ctrlKey: _event.ctrlKey }));
                        break;
                    case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                        if (content)
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
                        this.startTypingLabel();
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
                if (_event.target != this.checkbox)
                    this.startTypingLabel();
            };
            this.hndChange = (_event) => {
                let target = _event.target;
                let item = target.parentElement;
                _event.stopPropagation();
                switch (target.type) {
                    case "checkbox":
                        this.expand(target.checked);
                        break;
                    case "text":
                        target.disabled = true;
                        item.focus();
                        target.dispatchEvent(new CustomEvent("rename" /* EVENT.RENAME */, { bubbles: true, detail: { data: this.data } }));
                        break;
                    case "default":
                        // console.log(target);
                        break;
                }
            };
            this.hndDragStart = (_event) => {
                // _event.stopPropagation();
                if (_event.dataTransfer.getData("dragstart"))
                    return;
                this.controller.dragDrop.sources = [];
                if (this.selected)
                    this.controller.dragDrop.sources = this.controller.selection;
                else
                    this.controller.dragDrop.sources = [this.data];
                _event.dataTransfer.effectAllowed = "all";
                this.controller.dragDrop.target = null;
                // mark as already processed by this tree item to ignore it in further propagation through the tree
                _event.dataTransfer.setData("dragstart", this.label.value);
            };
            this.hndDragOver = (_event) => {
                // this.controller.hndDragOver(_event);
                if (Reflect.get(_event, "dragoverDone"))
                    return;
                Reflect.set(_event, "dragoverDone", true);
                // _event.stopPropagation();
                _event.preventDefault();
                this.controller.dragDrop.target = this.data;
                _event.dataTransfer.dropEffect = "move";
            };
            this.hndPointerUp = (_event) => {
                _event.stopPropagation();
                if (_event.target == this.checkbox)
                    return;
                this.select(_event.ctrlKey, _event.shiftKey);
            };
            this.hndRemove = (_event) => {
                if (_event.currentTarget == _event.target)
                    return;
                _event.stopPropagation();
                this.hasChildren = this.controller.hasChildren(this.data);
            };
            this.controller = _controller;
            this.data = _data;
            this.display = this.controller.getLabel(_data);
            // TODO: handle cssClasses
            this.create();
            this.hasChildren = this.controller.hasChildren(_data);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            this.addEventListener("dblclick" /* EVENT.DOUBLE_CLICK */, this.hndDblClick);
            this.addEventListener("focusout" /* EVENT.FOCUS_OUT */, this.hndFocus);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            // this.addEventListener(EVENT_TREE.FOCUS_NEXT, this.hndFocus);
            // this.addEventListener(EVENT_TREE.FOCUS_PREVIOUS, this.hndFocus);
            this.draggable = true;
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragStart);
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
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
         * Returns attaches or detaches the [[TREE_CLASS.SELECTED]] to this item
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
         * Set the label text to show
         */
        setLabel(_text) {
            this.label.value = _text;
        }
        /**
         * Get the label text shown
         */
        getLabel() {
            return this.label.value;
        }
        /**
         * Get the label text shown
         */
        refreshAttributes() {
            this.setAttribute("attributes", this.controller.getAttributes(this.data));
        }
        /**
         * Tries to expanding the [[TreeList]] of children, by dispatching [[EVENT.EXPAND]].
         * The user of the tree needs to add an event listener to the tree
         * in order to create that [[TreeList]] and add it as branch to this item
         */
        expand(_expand) {
            this.removeBranch();
            if (_expand)
                this.dispatchEvent(new Event("expand" /* EVENT.EXPAND */, { bubbles: true }));
            this.querySelector("input[type='checkbox']").checked = _expand;
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
         * Sets the branch of children of this item. The branch must be a previously compiled [[TreeList]]
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
         * Dispatches the [[EVENT.SELECT]] event
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
            let content = this.getBranch();
            if (!content)
                return;
            this.removeChild(content);
        }
        create() {
            this.checkbox = document.createElement("input");
            this.checkbox.type = "checkbox";
            this.appendChild(this.checkbox);
            this.label = document.createElement("input");
            this.label.type = "text";
            this.label.disabled = true;
            this.label.value = this.display;
            this.appendChild(this.label);
            this.refreshAttributes();
            this.tabIndex = 0;
        }
        startTypingLabel() {
            this.label.disabled = false;
            this.label.focus();
        }
    }
    FudgeUserInterface.TreeItem = TreeItem;
    customElements.define("li-tree-item", TreeItem, { extends: "li" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE91dHB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHNBcnJheS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGlhbG9nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9NdWx0aUxldmVsTWVudS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvV2FybmluZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlTGlzdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUxpc3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0V2ZW50L0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw2SUFBNkk7QUNBN0ksSUFBVSxrQkFBa0IsQ0F1TzNCO0FBdk9ELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7O09BR0c7SUFDSCxNQUFhLFVBQVU7UUFhckIsWUFBbUIsUUFBK0MsRUFBRSxXQUF3QjtZQVZsRixlQUFVLEdBQVcsR0FBRyxDQUFDO1lBS25DLGtGQUFrRjtZQUN4RSxpQkFBWSxHQUFjLElBQUksQ0FBQztZQXFLL0Isa0JBQWEsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUMvRCxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7b0JBQ3pDLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVO3dCQUMzQixNQUFNO29CQUVSLElBQUksR0FBRyxHQUF5QixNQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxJQUFJLEdBQUc7d0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2pDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUM7WUFFUSxtQkFBYyxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQ2hFLElBQUksUUFBUSxHQUEyQixNQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDL0QsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO2dCQUN4QixJQUFJLE9BQU8sR0FBK0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDeEQsSUFBSSxPQUE4QyxDQUFDO2dCQUVuRCxDQUFDLENBQUMsdURBQXVEO29CQUN2RCxJQUFJLE9BQU8sR0FBZ0IsT0FBTyxDQUFDO29CQUNuQyxPQUFPLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7NEJBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDbEMsQ0FBQztvQkFDRCxxQkFBcUI7b0JBQ3JCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUN2QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUk7d0JBQ2xCLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFRCx5QkFBeUI7Z0JBQ1ksT0FBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUM7WUFFUSxZQUFPLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzNCLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFoTkEsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQixxR0FBcUc7WUFDckcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQiwrQ0FBd0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRDs7O1dBR0c7UUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQXdCLEVBQUUsUUFBbUI7WUFDdkUsS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxPQUFPLEdBQXVDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JHLElBQUksT0FBTyxJQUFJLElBQUk7b0JBQ2pCLFNBQVM7Z0JBRVgsSUFBSSxPQUFPLFlBQVksbUJBQUEsYUFBYTtvQkFDbEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztxQkFDdkMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksTUFBTTtvQkFDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFFakUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDbEMsQ0FBQztZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFFRDs7O1dBR0c7UUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQStDLEVBQUUsV0FBd0IsRUFBRSxRQUFvQixFQUFFLE1BQWtCO1lBQzFJLHdFQUF3RTtZQUN4RSxJQUFJLE9BQU8sR0FBYyxRQUFRLElBQUksUUFBUSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDM0UsOEVBQThFO1lBQzlFLElBQUksWUFBWSxHQUE0QixNQUFNLElBQUksUUFBUSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpHLEtBQUssSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksT0FBTyxHQUFnQixVQUFVLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLE9BQU8sSUFBSSxJQUFJO29CQUNqQixTQUFTO2dCQUVYLElBQUksT0FBTyxZQUFZLG1CQUFBLGFBQWE7b0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBbUIsT0FBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO3FCQUN2RCxJQUFJLE9BQU8sWUFBWSxnQkFBZ0I7b0JBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUMxQixJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsWUFBWSxNQUFNO29CQUMxQyw0SEFBNEg7b0JBQzVILE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBdUIsT0FBUSxDQUFDLEtBQUssQ0FBQztxQkFDL0MsQ0FBQztvQkFDSixJQUFJLFVBQVUsR0FBYyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxVQUFxQixDQUFDO29CQUMxQixVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3hDLElBQUksVUFBVSxZQUFZLENBQUMsQ0FBQyxZQUFZLElBQUksVUFBVSxZQUFZLENBQUMsQ0FBQyxPQUFPO3dCQUN6RSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsY0FBYztnQkFDbkYsQ0FBQztZQUNILENBQUM7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQStDLEVBQUUsV0FBd0IsRUFBRSxRQUFvQjtZQUMvSCxJQUFJLE9BQU8sR0FBYyxRQUFRLElBQUksUUFBUSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDM0UsSUFBSSxZQUFZLEdBQTRCLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV2RixLQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN4QixJQUFJLE9BQU8sR0FBaUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0YsSUFBSSxDQUFDLE9BQU87b0JBQ1YsU0FBUztnQkFFWCxJQUFJLEtBQUssR0FBYyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXBDLElBQUksT0FBTyxZQUFZLG1CQUFBLGFBQWEsSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLGFBQWE7b0JBQ3ZFLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzVCLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxZQUFZLE1BQU07b0JBQzFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzVCLENBQUM7b0JBQ0osSUFBSSxVQUFVLEdBQWMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELElBQUksVUFBVSxZQUFZLENBQUMsQ0FBQyxZQUFZLElBQUksVUFBVSxZQUFZLENBQUMsQ0FBQyxPQUFPO3dCQUN6RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7d0JBRTVELGlDQUFpQzt3QkFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxXQUF3QixFQUFFLElBQVk7WUFDeEUsSUFBSSxRQUFRLEdBQTRCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUM7WUFDeEYsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3JCLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJCLElBQUksWUFBWSxHQUFXLFFBQVEsQ0FBQztZQUNwQyxJQUFJLGNBQWMsR0FBZ0IsSUFBSSxDQUFDO1lBQ3ZDLEtBQUssSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQzdCLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxJQUFJLGFBQWEsR0FBZ0IsT0FBTyxDQUFDLGFBQWEsRUFBRSxhQUFhLElBQUksV0FBVyxFQUFFLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYTtvQkFDcEksS0FBSyxFQUFFLENBQUM7Z0JBQ1YsSUFBSSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7b0JBQ3pCLGNBQWMsR0FBRyxPQUFPLENBQUM7b0JBQ3pCLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLENBQUM7WUFDSCxDQUFDO1lBRUQsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQztRQUVELDZGQUE2RjtRQUM3RiwrSEFBK0g7UUFDL0gsSUFBSTtRQUVKOztXQUVHO1FBQ0gsNkZBQTZGO1FBQzdGLDhDQUE4QztRQUM5QywrQkFBK0I7UUFDL0IsZ0RBQWdEO1FBQ2hELDhDQUE4QztRQUM5Qyx3QkFBd0I7UUFFeEIsa0VBQWtFO1FBQ2xFLE1BQU07UUFDTixpQkFBaUI7UUFDakIsSUFBSTtRQUVHLFVBQVUsQ0FBQyxRQUFvQixFQUFFLE1BQWtCO1lBQ3hELHNFQUFzRTtZQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUVNLG1CQUFtQjtZQUN4QixVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVNLFVBQVUsQ0FBQyxRQUErQztZQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQ3JELElBQUksUUFBUSxZQUFZLENBQUMsQ0FBQyxPQUFPO2dCQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVNLFVBQVU7WUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQztRQUVNLFlBQVk7WUFDakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7S0FtREY7SUEvTlksNkJBQVUsYUErTnRCLENBQUE7QUFDSCxDQUFDLEVBdk9TLGtCQUFrQixLQUFsQixrQkFBa0IsUUF1TzNCO0FDdk9ELElBQVUsa0JBQWtCLENBZ0ozQjtBQWhKRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7O09BRUc7SUFDSCxNQUFhLFNBQVM7UUFDcEI7O1dBRUc7UUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBbUIsRUFBRSxLQUFjO1lBQ2hFLElBQUksVUFBVSxHQUFlLElBQUksbUJBQUEsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDM0csVUFBVSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDakMsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQStDLEVBQUUsS0FBYyxFQUFFLFFBQW9CO1lBQzFILElBQUksSUFBSSxHQUFXLEtBQUssSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUV0RCxJQUFJLE9BQStCLENBQUM7WUFDcEMsSUFBSSxRQUFRLFlBQVksQ0FBQyxDQUFDLFlBQVk7Z0JBQ3BDLE9BQU8sR0FBRyxJQUFJLG1CQUFBLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDOUIsSUFBSSxRQUFRLFlBQVksQ0FBQyxDQUFDLE9BQU87Z0JBQ3BDLE9BQU8sR0FBRyxJQUFJLG1CQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFDeEMsT0FBTyxJQUFJLENBQUM7WUFFakIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0UsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTSxDQUFDLDBCQUEwQixDQUFDLFFBQStDLEVBQUUsUUFBb0I7WUFDNUcsSUFBSSxPQUFPLEdBQWMsUUFBUSxJQUFJLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQzNFLElBQUksWUFBWSxHQUE0QixRQUFRLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkYsSUFBSSxHQUFHLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEQsS0FBSyxJQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxJQUFJLEdBQVcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLEtBQUssR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksT0FBTyxHQUFnQixTQUFTLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFNUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNiLElBQUksVUFBVSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLFVBQVUsWUFBWSxDQUFDLENBQUMsT0FBTzt3QkFDakMsT0FBTyxHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFhLEtBQUssQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUVELElBQUksQ0FBQyxPQUFPLElBQUksSUFBSTtvQkFDbEIsT0FBTyxHQUFHLElBQUksbUJBQUEsbUJBQW1CLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxhQUFhLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFFekosSUFBSSxDQUFDLE9BQU8sRUFBRSxxREFBcUQ7b0JBQ2pFLFNBQVM7Z0JBRVgsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixDQUFDO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLDBCQUEwQixDQUFDLFFBQTRCO1lBQ25FLElBQUksR0FBRyxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksS0FBSyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxnSUFBZ0k7Z0JBQ2hJLElBQUk7Z0JBQ0osa0VBQWtFO2dCQUNsRSxjQUFjO2dCQUNkLElBQUk7Z0JBQ0osSUFBSSxLQUFLLFlBQVksTUFBTSxFQUFFLENBQUM7b0JBQzVCLGtFQUFrRTtvQkFDbEUsSUFBSSxPQUFPLEdBQVksSUFBSSxtQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNuRCxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQixDQUFDOztvQkFDQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQVcsS0FBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3RixDQUFDO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBWSxFQUFFLEtBQXNCLEVBQUUsTUFBYztZQUNyRixJQUFJLE9BQW9CLENBQUM7WUFDekIsSUFBSSxDQUFDO2dCQUNILElBQUksS0FBSyxZQUFZLE1BQU0sRUFBRSxDQUFDO29CQUM1QixJQUFJLFdBQVcsR0FBeUIsbUJBQUEsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEUseUNBQXlDO29CQUN6QyxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN6RixDQUFDO3FCQUFNLElBQUksTUFBTSxZQUFZLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtvQkFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDNUIsMkJBQTJCO2dCQUM3QixDQUFDO3FCQUFNLENBQUM7b0JBQ04sSUFBSSxXQUFXLEdBQXlCLG1CQUFBLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxXQUFXO3dCQUNkLE9BQU8sT0FBTyxDQUFDO29CQUNqQix5Q0FBeUM7b0JBQ3pDLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbkYsQ0FBQztZQUNILENBQUM7WUFBQyxPQUFPLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsT0FBb0IsRUFBRSxTQUFrQjtZQUNwSCxJQUFJLFFBQVEsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuRSxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN0QixLQUFLLElBQUksS0FBSyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUMzQixJQUFJLEtBQUssR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEUsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztvQkFDaEQsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQ0QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQ0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBYUY7SUF6SVksNEJBQVMsWUF5SXJCLENBQUE7QUFDSCxDQUFDLEVBaEpTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFnSjNCO0FDaEpELElBQVUsa0JBQWtCLENBc0gzQjtBQXRIRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFhckI7OztPQUdHO0lBQ0gsTUFBc0IsYUFBYyxTQUFRLFdBQVc7aUJBRXRDLDZCQUF3QixHQUFzQyxJQUFJLEdBQUcsRUFBRSxBQUEvQyxDQUFnRDtpQkFDeEUsY0FBUyxHQUFXLENBQUMsQUFBWixDQUFhO1FBR3JDLFlBQW1CLFdBQXFDO1lBQ3RELEtBQUssRUFBRSxDQUFDO1lBSEEsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFJckMsSUFBSSxXQUFXO2dCQUNiLEtBQUssSUFBSSxJQUFJLElBQUksV0FBVyxFQUFFLENBQUM7b0JBQzdCLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVM7d0JBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO1FBQ0wsQ0FBQztRQUVEOztXQUVHO1FBQ08sTUFBTSxLQUFLLE1BQU07WUFDekIsT0FBTyxHQUFHLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pDLENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWSxFQUFFLGtCQUF3QyxFQUFFLFdBQTJCO1lBQ3hHLDZCQUE2QjtZQUM3QixrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQzlCLGFBQWE7WUFDYixjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRWhELElBQUksV0FBVztnQkFDYixhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQWE7WUFDN0IsSUFBSSxPQUFPLEdBQTZELGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUgsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUTtnQkFDOUIsT0FBTyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsT0FBNkIsT0FBTyxDQUFDO1FBQ3ZDLENBQUM7UUFFTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQWEsRUFBRSxrQkFBd0M7WUFDeEUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxhQUFhLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsR0FBRztZQUNaLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxXQUFXO1lBQ2hCLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLElBQUk7Z0JBQ1AsT0FBTyxJQUFJLENBQUM7WUFDZCxJQUFJLEtBQUssR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5RCxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVNLFFBQVEsQ0FBQyxNQUFjO1lBQzVCLElBQUksS0FBSyxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELElBQUksS0FBSztnQkFDUCxLQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUMvQixDQUFDO1FBT0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBYztZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVELHVDQUF1QztRQUNoQyxTQUFTLENBQUMsS0FBYztZQUM3QixJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLFlBQVk7WUFDWixJQUFJLEtBQUssR0FBa0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pGLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDOUMsS0FBSyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFDbkMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7O0lBbEdtQixnQ0FBYSxnQkFtR2xDLENBQUE7QUFDSCxDQUFDLEVBdEhTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFzSDNCO0FDdEhELElBQVUsa0JBQWtCLENBK0MzQjtBQS9DRCxXQUFVLGtCQUFrQjtJQUMxQjs7T0FFRztJQUNILE1BQWEsb0JBQXFCLFNBQVEsbUJBQUEsYUFBYTtRQUNyRCxhQUFhO2lCQUNFLGtCQUFhLEdBQVMsbUJBQUEsYUFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUcsWUFBWSxXQUFvQztZQUM5QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLO2dCQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsaUJBQWlCO1lBQ2YsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFDbEIsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLGdFQUFnRTtZQUNoRSxxQkFBcUI7WUFFckIsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDeEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBQSxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUM7WUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksZUFBZTtZQUNwQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzdDLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFlO1lBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUMvQyxDQUFDOztJQXpDVSx1Q0FBb0IsdUJBMENoQyxDQUFBO0FBQ0gsQ0FBQyxFQS9DUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBK0MzQjtBQy9DRCxJQUFVLGtCQUFrQixDQThFM0I7QUE5RUQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCOztPQUVHO0lBQ0gsTUFBYSxrQkFBbUIsU0FBUSxtQkFBQSxhQUFhO1FBQ25ELGFBQWE7aUJBQ0Usa0JBQWEsR0FBUyxtQkFBQSxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQTNFLENBQTRFO1FBR3hHLFlBQVksV0FBb0M7WUFDOUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBSGQsVUFBSyxHQUFZLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBSXBDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztnQkFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTlDLElBQUksQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxpQkFBaUI7WUFDZixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRW5CLElBQUksTUFBTSxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBRXRCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFekIsSUFBSSxNQUFNLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDdEIsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDakIsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDakIsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxlQUFlO1lBQ3BCLElBQUksR0FBRyxHQUE4QixJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFFLENBQUMsS0FBSyxDQUFDO1lBQ25GLElBQUksS0FBSyxHQUE4QixJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3JGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNqRCxDQUFDO1FBQ0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBaUI7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdGLENBQUM7UUFFTyxNQUFNLENBQUMsTUFBcUI7WUFDbEMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFDTyxRQUFRLENBQUMsTUFBa0I7WUFDakMsSUFBSSxNQUFNLEdBQXdDLE1BQU0sQ0FBQyxNQUFPLENBQUM7WUFDakUsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLGFBQWE7Z0JBQ2xDLE9BQU87WUFDVCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLHFDQUFxQztZQUNyQyxJQUFJLFlBQVksR0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDOztJQXZFVSxxQ0FBa0IscUJBd0U5QixDQUFBO0FBQ0gsQ0FBQyxFQTlFUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBOEUzQjtBQzlFRCxJQUFVLGtCQUFrQixDQWdFM0I7QUFoRUQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBQ0gsTUFBYSxrQkFBbUIsU0FBUSxXQUFXO1FBQ2pELGFBQWE7aUJBQ0Usa0JBQWEsR0FBUyxtQkFBQSxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxBQUFsRSxDQUFtRTtRQUcvRjtZQUNFLEtBQUssRUFBRSxDQUFDO1lBSEEsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFJdkMsQ0FBQztRQUVELElBQVcsS0FBSyxDQUFDLE1BQWM7WUFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDO2dCQUMxQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUVELElBQVcsS0FBSztZQUNkLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsaUJBQWlCO1lBQ2YsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFDbEIsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBR00sR0FBRyxDQUFDLE9BQWU7WUFDeEIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxPQUFPO1lBRVQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ1YsQ0FBQztvQkFDSixJQUFJLElBQUksR0FBMkMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO29CQUMvRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxZQUFZLGtCQUFrQixDQUFDO3dCQUMvQyxPQUFPO29CQUNULElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7WUFDSCxDQUFDO2lCQUNJLENBQUM7Z0JBQ0osSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDVixDQUFDO29CQUNKLElBQUksSUFBSSxHQUEyQyxJQUFJLENBQUMsc0JBQXNCLENBQUM7b0JBQy9FLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksa0JBQWtCLENBQUM7d0JBQy9DLE9BQU87b0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7O0lBekRVLHFDQUFrQixxQkEwRDlCLENBQUE7QUFDSCxDQUFDLEVBaEVTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFnRTNCO0FDaEVELHVDQUF1QztBQUN2QyxJQUFVLGtCQUFrQixDQTZFM0I7QUE5RUQsdUNBQXVDO0FBQ3ZDLFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQjs7T0FFRztJQUNILE1BQXNCLHFCQUFzQixTQUFRLG1CQUFBLGFBQWE7aUJBQ2hELGFBQVEsR0FBa0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVuRSxZQUFZLFdBQXFDO1lBQy9DLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFnQjtZQUNyQyxLQUFLLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUMzRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxJQUFJLFFBQVEsRUFBRSxDQUFDO29CQUM3RCxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEQscUJBQXFCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLGVBQWU7WUFDcEIsSUFBSSxPQUFPLEdBQWMsRUFBRSxDQUFDO1lBQzVCLElBQUksUUFBUSxHQUFpQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0UsS0FBSyxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxHQUFHLEdBQVcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxPQUFPLFlBQVksbUJBQUEsYUFBYTtvQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7b0JBRXpDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2pDLENBQUM7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRU0sZUFBZSxDQUFDLFFBQW1CO1lBQ3hDLEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksT0FBTyxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDckUsSUFBSSxDQUFDLE9BQU87b0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLElBQUksT0FBTyxZQUFZLG1CQUFBLGFBQWE7b0JBQ2xDLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O29CQUV2QyxPQUFPLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0gsQ0FBQztRQUVEOztXQUVHO1FBQ08saUJBQWlCO1lBQ3pCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLFFBQVEsR0FBcUIscUJBQXFCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxRyxJQUFJLE9BQU8sR0FBNkIsUUFBUSxDQUFDLGlCQUFpQixDQUFDO1lBRW5FLElBQUksS0FBSyxHQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzVDLEtBQUssSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNoQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5RCxDQUFDO1lBQ0QsS0FBSyxJQUFJLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxJQUFJLEtBQUs7Z0JBQ1AsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELENBQUM7O0lBdEVtQix3Q0FBcUIsd0JBdUUxQyxDQUFBO0FBQ0gsQ0FBQyxFQTdFUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBNkUzQjtBQzlFRCwrQ0FBK0M7QUFDL0MsSUFBVSxrQkFBa0IsQ0FpQzNCO0FBbENELCtDQUErQztBQUMvQyxXQUFVLGtCQUFrQjtJQUcxQixNQUFhLHNCQUF1QixTQUFRLG1CQUFBLHFCQUFxQjtRQUV4RCxlQUFlO1lBQ3BCLElBQUksUUFBUSxHQUFxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEYsSUFBSSxPQUFPLEdBQWMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3ZFLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixLQUFLLElBQUksTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQztnQkFDM0MsS0FBSyxJQUFJLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7b0JBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUVsRixPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUQsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVNLGVBQWUsQ0FBQyxRQUFtQjtZQUN4QyxJQUFJLFFBQVEsR0FBcUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixLQUFLLElBQUksTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQztnQkFDM0MsS0FBSyxJQUFJLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7b0JBQzlCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQWEsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVTLGlCQUFpQjtZQUN6QixLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMxQixrQ0FBa0M7WUFDbEMsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FDRjtJQTdCWSx5Q0FBc0IseUJBNkJsQyxDQUFBO0FBQ0gsQ0FBQyxFQWpDUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBaUMzQjtBQ2xDRCwrQ0FBK0M7QUFDL0MsSUFBVSxrQkFBa0IsQ0E4QjNCO0FBL0JELCtDQUErQztBQUMvQyxXQUFVLGtCQUFrQjtJQUcxQixNQUFhLHNCQUF1QixTQUFRLG1CQUFBLHFCQUFxQjtRQUV4RCxlQUFlO1lBQ3BCLElBQUksUUFBUSxHQUFxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEYsSUFBSSxPQUFPLEdBQWMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hFLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixLQUFLLElBQUksTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUM7Z0JBQ3ZELEtBQUssSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2xGLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTSxlQUFlLENBQUMsUUFBbUI7WUFDeEMsSUFBSSxRQUFRLEdBQXFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDO2dCQUN2RCxLQUFLLElBQUksU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7b0JBQ25DLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQWEsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRVMsaUJBQWlCO1lBQ3pCLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzFCLGtDQUFrQztZQUNsQyxJQUFJLEtBQUssR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUNGO0lBMUJZLHlDQUFzQix5QkEwQmxDLENBQUE7QUFDSCxDQUFDLEVBOUJTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE4QjNCO0FDL0JELElBQVUsa0JBQWtCLENBZ0QzQjtBQWhERCxXQUFVLGtCQUFrQjtJQUMxQjs7T0FFRztJQUNILE1BQWEsbUJBQW9CLFNBQVEsbUJBQUEsYUFBYTtRQUNwRCxhQUFhO2lCQUNFLGtCQUFhLEdBQVMsbUJBQUEsYUFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUVqRyxZQUFtQixXQUFvQztZQUNyRCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLEVBQUUsR0FBRyxtQkFBQSxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksZUFBZTtZQUNwQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUF5QjtZQUM5QyxJQUFJLE1BQU0sR0FBc0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzFELElBQUksTUFBTTtnQkFDUixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Z0JBRXZDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXRDLG1GQUFtRjtRQUNyRixDQUFDOztJQTFDVSxzQ0FBbUIsc0JBMkMvQixDQUFBO0FBQ0gsQ0FBQyxFQWhEUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBZ0QzQjtBQ2hERCxJQUFVLGtCQUFrQixDQTZEM0I7QUE3REQsV0FBVSxrQkFBa0I7SUFDMUI7O09BRUc7SUFDSCxNQUFhLG1CQUFvQixTQUFRLG1CQUFBLGFBQWE7UUFDcEQsYUFBYTtpQkFDRSxrQkFBYSxHQUFTLG1CQUFBLGFBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBR3pHLFlBQW1CLFdBQW9DLEVBQUUsV0FBbUIsRUFBRTtZQUM1RSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLO2dCQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDMUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakUsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzdCLElBQUksS0FBSyxHQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUseUNBQXlDO29CQUN6SCxTQUFTO2dCQUNYLElBQUksS0FBSyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztnQkFDakIsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQztnQkFDekMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQy9CLDJDQUEyQztnQkFDM0MsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxlQUFlO1lBQ3BCLElBQUksTUFBTSxHQUFzQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksSUFBSSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUM7WUFDMUYsT0FBTyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BFLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFjO1lBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUM1Qyx1QkFBdUI7UUFDekIsQ0FBQzs7SUF2RFUsc0NBQW1CLHNCQXdEL0IsQ0FBQTtBQUNILENBQUMsRUE3RFMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTZEM0I7QUM3REQsSUFBVSxrQkFBa0IsQ0EwVTNCO0FBMVVELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7T0FFRztJQUNILE1BQWEsb0JBQXFCLFNBQVEsbUJBQUEsYUFBYTtRQUNyRCxhQUFhO2lCQUNFLGtCQUFhLEdBQVMsbUJBQUEsYUFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLEFBQTlFLENBQStFO1FBRzNHLFlBQW1CLFdBQXFDO1lBQ3RELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUhkLFVBQUssR0FBVyxDQUFDLENBQUM7WUEwSnpCOztlQUVHO1lBQ0ssV0FBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUMvQyxJQUFJLE1BQU0sR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDO2dCQUM3QyxJQUFJLFVBQVUsR0FBVyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBRXZELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFekIsbURBQW1EO2dCQUNuRCxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDbkIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3BCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7d0JBQzNCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7d0JBQ2xDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7d0JBQzNCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7d0JBQzlCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVOzRCQUM3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUMvRCxNQUFNO3dCQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFOzRCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNyQixNQUFNO29CQUNWLENBQUM7b0JBQ0QsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7d0JBQ25GLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzt3QkFDdkMscUNBQXFDO29CQUN2QyxDQUFDO29CQUNELE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxnQ0FBZ0M7Z0JBQ2hDLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztvQkFDNUMsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqSSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBb0IsTUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEUsQ0FBQztvQkFDRCxPQUFPO2dCQUNULENBQUM7Z0JBRUQsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxVQUFVLEdBQVcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3RixJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRXJDLElBQUksSUFBSSxHQUE2QixNQUFNLENBQUMsa0JBQWtCLENBQUM7b0JBQy9ELElBQUksSUFBSTt3QkFDTixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRWYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssNEJBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5RCxPQUFPO2dCQUNULENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDOUQsT0FBTztnQkFDVCxDQUFDO2dCQUVELElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVM7b0JBQzFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFMUIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUM3QixJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssNEJBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM5RCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRO3dCQUMzQixJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssNEJBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM5RCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUNmLE1BQU0sQ0FBQyxzQkFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDckQsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVzt3QkFDOUIsSUFBSSxJQUFJLEdBQTZCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDL0QsSUFBSSxJQUFJOzRCQUNOLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7b0JBQzNCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7b0JBQ2xDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHO3dCQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3JCLE1BQU07b0JBQ1I7d0JBQ0UsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBa0IsRUFBUSxFQUFFO2dCQUM5QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29CQUN2QyxPQUFPO2dCQUVULElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUM7WUF6UUEsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUVsQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7WUFDdEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUM3QixLQUFLLENBQUMsZ0JBQWdCLDRCQUFjLENBQUMsTUFBYSxFQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBR3hCLElBQUksSUFBSSxHQUFvQixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsS0FBSyxJQUFJLEdBQUcsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUF1QixJQUFJLG1CQUFBLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3pELEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNWLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDO1lBQzFCLENBQUM7WUFDRCxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztZQUV0QixJQUFJLEdBQUcsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRCxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN2QixHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHdEIsdURBQXVEO1lBQ3ZELEtBQUssQ0FBQyxnQkFBZ0IsMEJBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxnQkFBZ0IsMEJBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCLENBQUMsR0FBWTtZQUNuQyxJQUFJLEtBQUssR0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakMsSUFBSSxLQUFLLEdBQWdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUUxQixJQUFJLE1BQU0sR0FBbUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xGLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTTtnQkFDdEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQztRQUVEOztXQUVHO1FBQ0ksU0FBUyxDQUFDLEtBQWM7WUFDN0IsSUFBSSxLQUFLLEdBQXVDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUUsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLENBQUM7aUJBQU0sQ0FBQztnQkFDTixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLGVBQWU7WUFDcEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFjO1lBQ25DLElBQUksTUFBTSxJQUFJLFNBQVM7Z0JBQ3JCLE9BQU87WUFFVCxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksc0JBQXNCO1lBQzNCLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksR0FBRyxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0QsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM5QyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxRQUFRO1lBQ2IsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBYSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5RCxJQUFJLGNBQWMsR0FBVyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDdkQsSUFBSSxTQUFTLEdBQVcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQzdDLE9BQU8sY0FBYyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDdEUsQ0FBQztRQUVEOztXQUVHO1FBQ0ssT0FBTztZQUNiLElBQUksTUFBTSxHQUFtQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEYsSUFBSSxLQUFLLEdBQWdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUMxQixLQUFLLElBQUksR0FBRyxHQUFXLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO29CQUNyRCxJQUFJLEtBQUssR0FBdUIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDaEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQWEsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNsRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUUzQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsS0FBSyxJQUFJLEdBQUcsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDckQsSUFBSSxLQUFLLEdBQXVCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2hELElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxJQUFJLEdBQVcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDOUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUM7O29CQUNDLEtBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDO1FBdUhPLG1CQUFtQixDQUFDLE9BQWU7WUFDekMsSUFBSSxLQUFLLEdBQVksUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUM1QyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDeEMsT0FBTztZQUVULE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLElBQUksT0FBTyxJQUFJLENBQUM7Z0JBQ2QsT0FBTztZQUVULElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztnQkFDOUMsMkJBQTJCO2dCQUMzQixJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZixPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksUUFBUSxHQUFXLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDM0QsaUNBQWlDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQWEsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFFbkUsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDMUQsOENBQThDO1lBQzlDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUk7Z0JBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBR2pCLElBQUksTUFBYyxDQUFDO1lBQ25CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ25ELHlCQUF5QjtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUVPLFVBQVUsQ0FBQyxRQUFnQjtZQUNqQyxJQUFJLFVBQVUsR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQ2pELElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ2hDLElBQUksUUFBUSxHQUFHLENBQUM7d0JBQ2QsVUFBVSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQzs7d0JBRTNDLFVBQVUsR0FBRyxVQUFVLENBQUMsc0JBQXNCLENBQUM7Z0JBRXJDLFVBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQzs7SUFsVVUsdUNBQW9CLHVCQW1VaEMsQ0FBQTtBQUNILENBQUMsRUExVVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTBVM0I7QUMxVUQsSUFBVSxrQkFBa0IsQ0F5QzNCO0FBekNELFdBQVUsa0JBQWtCO0lBQzFCOztPQUVHO0lBQ0gsTUFBYSxzQkFBdUIsU0FBUSxtQkFBQSxhQUFhO1FBQ3ZELGFBQWE7aUJBQ0Usa0JBQWEsR0FBUyxtQkFBQSxhQUFhLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9HLFlBQW1CLFdBQW9DO1lBQ3JELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxpQkFBaUI7WUFDdEIsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFDbEIsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVuQixJQUFJLEtBQUssR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5RCxLQUFLLENBQUMsRUFBRSxHQUFHLG1CQUFBLGFBQWEsQ0FBQyxNQUFNLENBQUM7WUFDaEMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksZUFBZTtZQUNwQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzNDLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFjO1lBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUM3QyxDQUFDOztJQW5DVSx5Q0FBc0IseUJBb0NsQyxDQUFBO0FBQ0gsQ0FBQyxFQXpDUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBeUMzQjtBQ3pDRCxJQUFVLGtCQUFrQixDQWdKM0I7QUFoSkQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLE1BQWEsT0FBUSxTQUFRLGtCQUFrQjtRQUc3QyxZQUFtQixVQUFrQixFQUFFLEVBQUUsS0FBYTtZQUNwRCxLQUFLLEVBQUUsQ0FBQztZQXNDRixjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxNQUFNO29CQUNSLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsNkJBQWMsQ0FBQyxnQ0FBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDLENBQUE7WUFFTyxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDekMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksSUFBSSxHQUE2QixJQUFJLENBQUMsa0JBQWtCLENBQUM7d0JBQzdELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs0QkFDL0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUNiLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3QkFDM0IsQ0FBQzt3QkFDRCxNQUFNO29CQUNSO3dCQUNFLElBQUksUUFBUSxHQUE2QixJQUFJLENBQUMsc0JBQXNCLENBQUM7d0JBQ3JFLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs0QkFDdkMsSUFBSSxJQUFJLEdBQW1DLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDaEYsSUFBSSxDQUFDLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDNUIsSUFBSSxDQUFDO2dDQUNILEdBQUcsQ0FBQyxDQUFDLDZCQUE2QjtvQ0FDaEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBQ3BCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7O2dDQUVoQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBR25CLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3QkFDM0IsQ0FBQzt3QkFDRCxNQUFNO29CQUNSO3dCQUNFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUNiLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3QkFDM0IsQ0FBQzt3QkFDRCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUE7WUFFTyxXQUFNLEdBQUcsQ0FBQyxNQUFxQixFQUFRLEVBQUU7Z0JBQy9DLElBQUksU0FBUyxHQUFZLEtBQUssQ0FBQztnQkFDL0Isd0RBQXdEO2dCQUV4RCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25GLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLFNBQVMsR0FBRyxJQUFJLENBQUM7d0JBQ2pCLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVc7d0JBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7NEJBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2xCLE1BQU07d0JBQ1IsQ0FBQztvQkFDSCxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxJQUFJLEdBQWdCLElBQUksQ0FBQzt3QkFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVTs0QkFDakIsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7OzRCQUVyQyxHQUFHLENBQUM7Z0NBQ0YsSUFBSSxHQUFnQixJQUFJLENBQUMsa0JBQWtCLENBQUM7NEJBQzlDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFFdkMsSUFBSSxJQUFJOzRCQUNOLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZix1SUFBdUk7OzRCQUVySSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxxQ0FBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqSSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUM3QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs0QkFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDbkIsTUFBTTt3QkFDUixDQUFDO29CQUNILEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRO3dCQUMzQixJQUFJLFFBQVEsR0FBZ0IsSUFBSSxDQUFDO3dCQUNqQyxHQUFHLENBQUM7NEJBQ0YsUUFBUSxHQUFnQixRQUFRLENBQUMsc0JBQXNCLENBQUM7d0JBQzFELENBQUMsUUFBUSxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSxPQUFPLENBQUMsRUFBRTt3QkFFckQsSUFBSSxRQUFROzRCQUNWLElBQWMsUUFBUyxDQUFDLFVBQVU7Z0NBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLDZDQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2dDQUVuSSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7OzRCQUVuQixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsbUNBQWtCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUksTUFBTTtnQkFDVixDQUFDO2dCQUVELElBQUksQ0FBQyxTQUFTO29CQUNaLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7WUFwSUMsdUdBQXVHO1lBQ3ZHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksVUFBVSxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLFVBQVUsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBdUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBR0QsSUFBVyxVQUFVO1lBQ25CLGdDQUFnQztZQUNoQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUVNLFVBQVUsQ0FBQyxRQUF3QjtZQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDMUIsQ0FBQztRQUVNLE1BQU0sQ0FBQyxPQUFnQjtZQUM1QixtQ0FBbUM7WUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDO0tBa0dGO0lBMUlZLDBCQUFPLFVBMEluQixDQUFBO0lBQ0Qsb0NBQW9DO0lBQ3BDLGNBQWMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLENBQUMsRUFoSlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQWdKM0I7QUNoSkQsSUFBVSxrQkFBa0IsQ0F3SzNCO0FBeEtELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFhLFlBQWEsU0FBUSxtQkFBQSxPQUFPO1FBRXZDLFlBQW1CLE9BQWU7WUFDaEMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQTBEbEIsaUJBQVksR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDakQsMEJBQTBCO2dCQUMxQixJQUFJLE9BQU8sR0FBeUIsTUFBTSxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlFLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUM7WUFFTSxnQkFBVyxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNoRCxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksTUFBTSxDQUFDLE9BQU87b0JBQ2hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztnQkFDMUMsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDakIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1lBQzVDLENBQUMsQ0FBQztZQUVNLFlBQU8sR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDNUMsSUFBSSxJQUFJLEdBQTZCLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQzFELElBQUksT0FBTyxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9DLElBQUksT0FBTyxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLElBQUksR0FBZ0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLE9BQU8sSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRW5ELElBQUksUUFBUSxHQUFtQixPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFDOUUsSUFBSSxNQUFNLENBQUMsT0FBTztvQkFDaEIsSUFBSSxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFdEMsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O29CQUVsQyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDO1lBR00sY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1lBRU0sa0JBQWEsR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDdEQsSUFBSSxJQUFJLEdBQTZCLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBRTFELGlEQUFpRDtnQkFDakQsSUFBa0IsTUFBTSxDQUFDLE1BQU8sSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07b0JBQy9FLE9BQU87Z0JBRVQsSUFBSSxLQUFLLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekQsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQztnQkFDaEMsSUFBSSxNQUFNLEdBQWdCLElBQUksQ0FBQztnQkFDL0IsSUFBSSxTQUFTLEdBQVksS0FBSyxDQUFDO2dCQUUvQixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QixNQUFNO29CQUNSLCtCQUErQjtvQkFDL0Isc0JBQXNCO29CQUN0QiwyQ0FBMkM7b0JBQzNDLFdBQVc7b0JBQ1gsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVE7d0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7NEJBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDdkIsTUFBTTt3QkFDUixDQUFDO3dCQUNELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNwQixNQUFNLEdBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFDekQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNqQyxDQUFDOzs0QkFDQyxPQUFPLEdBQWdCLElBQUksQ0FBQyxlQUFlLENBQUM7d0JBQzlDLElBQUksT0FBTzs0QkFDVCxPQUFPLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3hCLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7NEJBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDdkIsTUFBTTt3QkFDUixDQUFDO3dCQUNELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNwQixNQUFNLEdBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFDekQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNqQyxDQUFDOzs0QkFDQyxPQUFPLEdBQWdCLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQzFDLElBQUksT0FBTzs0QkFDVCxPQUFPLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3hCLE1BQU07b0JBQ1I7d0JBQ0UsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2YsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUMzQixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1FBN0pGLENBQUM7UUFFTSxVQUFVLENBQUMsUUFBd0I7WUFDeEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBeUMsRUFBRSxDQUFDO2dCQUN6RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNILENBQUM7UUFFTSxVQUFVO1lBQ2YsSUFBSSxPQUFPLEdBQWdCLEVBQUUsQ0FBQztZQUU5QixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBMkMsRUFBRSxDQUFDO2dCQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRU8saUJBQWlCLENBQUMsTUFBbUI7WUFDM0MsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDeEIsTUFBTSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzdELE1BQU0sQ0FBQyxnQkFBZ0IsMEJBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDNUQsTUFBTSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUVPLFNBQVMsQ0FBQyxTQUFpQixTQUFTO1lBQzFDLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztZQUM1QixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLCtDQUF3QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdJLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBMkMsRUFBRSxDQUFDO2dCQUMzRSxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQ2hCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUM7WUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVPLFFBQVEsQ0FBQyxTQUFpQixTQUFTO1lBQ3pDLElBQUksTUFBTSxJQUFJLFNBQVM7Z0JBQ3JCLE9BQU87WUFDVCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsSUFBSSxLQUFLLEdBQTZCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNqQixDQUFDO0tBdUdGO0lBbEtZLCtCQUFZLGVBa0t4QixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDekUsQ0FBQyxFQXhLUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBd0szQjtBQ3hLRCxJQUFVLGtCQUFrQixDQThEM0I7QUE5REQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCOztPQUVHO0lBQ0gsTUFBYSxNQUFNO1FBRWpCOzs7V0FHRztRQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXFDLEVBQUUsU0FBa0IsSUFBSSxFQUFFLFFBQWdCLFVBQVUsRUFBRSxnQkFBd0IsYUFBYSxFQUFFLE1BQWMsSUFBSSxFQUFFLFVBQWtCLFFBQVE7WUFDek0sTUFBTSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUVoRCxJQUFJLE9BQXVCLENBQUM7WUFDNUIsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLE9BQU87Z0JBQzVCLE9BQU8sR0FBRyxtQkFBQSxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUV0RCxPQUFPLEdBQUcsbUJBQUEsU0FBUyxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELE9BQU8sQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWhDLElBQUksTUFBTSxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxHQUFHLGFBQWEsR0FBRyxNQUFNLENBQUM7WUFDbEQsSUFBSSxTQUFTLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsU0FBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDaEMsSUFBSSxPQUFPLElBQUksRUFBRTtnQkFDZixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLElBQUksS0FBSyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNO2dCQUNSLFlBQVk7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Z0JBRXZCLFlBQVk7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVwQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzlCLElBQUksU0FBUyxHQUE0QixDQUFDLE1BQWEsRUFBRSxFQUFFO29CQUN6RCxTQUFTLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNsRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUM5QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSzt3QkFDeEIsSUFBSSxDQUFDOzRCQUNILG1CQUFBLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMzQyxDQUFDO3dCQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7NEJBQ1osQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ25CLENBQUM7b0JBQ0gsWUFBWTtvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUM7Z0JBQ0YsU0FBUyxDQUFDLGdCQUFnQiw0QkFBYyxTQUFTLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxDQUFDLGdCQUFnQiw0QkFBYyxTQUFTLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQXZEWSx5QkFBTSxTQXVEbEIsQ0FBQTtBQUNILENBQUMsRUE5RFMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQThEM0I7QUM5REQsSUFBVSxrQkFBa0IsQ0E4QjNCO0FBOUJELFdBQVUsa0JBQWtCO0lBTXhCLE1BQWEscUJBQXFCO1FBRXZCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFrQixFQUFFLFFBQW9CO1lBQ3JFLElBQUksT0FBTyxHQUFjLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDeEMsSUFBSSxlQUFlLEdBQWEsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0RCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzdCLElBQUksWUFBWSxHQUFXLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDdEQsWUFBWSxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUzRCxDQUFDO2dCQUNELElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUN0QyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBYSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEgsQ0FBQztxQkFDSSxDQUFDO29CQUNGLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hFLENBQUM7WUFDTCxDQUFDO2lCQUNJLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztLQUNKO0lBdkJZLHdDQUFxQix3QkF1QmpDLENBQUE7QUFDTCxDQUFDLEVBOUJTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE4QjNCO0FDOUJELElBQVUsa0JBQWtCLENBa0MzQjtBQWxDRCxXQUFVLGtCQUFrQjtJQUUxQjs7T0FFRztJQUNILE1BQWEsT0FBTztRQUNsQjs7V0FFRztRQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBb0IsRUFBRSxFQUFFLFlBQW9CLFVBQVUsRUFBRSxXQUFtQixTQUFTLEVBQUUsTUFBYyxJQUFJO1lBQzVILElBQUksT0FBTyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFFakQsSUFBSSxPQUFPLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUQsT0FBTyxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7WUFDdkIsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFN0IsSUFBSSxNQUFNLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztZQUM3QyxJQUFJLEtBQUssR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUN0QixLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDbkIsWUFBWTtnQkFDWixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUM7WUFDRixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsWUFBWTtZQUNaLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQ0Y7SUE1QlksMEJBQU8sVUE0Qm5CLENBQUE7QUFDSCxDQUFDLEVBbENTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFrQzNCO0FDbENELElBQVUsa0JBQWtCLENBNEwzQjtBQTVMRCxXQUFVLGtCQUFrQjtJQUUxQjs7T0FFRztJQUNILE1BQWEsY0FBa0IsU0FBUSxnQkFBZ0I7UUFHckQsWUFBbUIsV0FBb0MsRUFBRSxTQUE4QixFQUFFO1lBQ3ZGLEtBQUssRUFBRSxDQUFDO1lBa0pGLGdCQUFXLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2hELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEdBQTBCLElBQUksQ0FBQyxhQUFjLENBQUMsSUFBSSxDQUFDO2dCQUM3RCxJQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO29CQUM3RixPQUFPO2dCQUVULE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUV4QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDeEMsQ0FBQztvQkFDSixJQUFJLFVBQVUsR0FBeUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sWUFBWSxtQkFBQSxjQUFjLENBQUMsQ0FBQztvQkFDaEksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7d0JBQ3pDLElBQUksSUFBSSxHQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt3QkFDL0QsSUFBSSxTQUFTLEdBQVksTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUNyRSxJQUFJLE9BQU8sR0FBWSxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO3dCQUNyRyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQjs0QkFDOUMsSUFBSSxTQUFTO2dDQUNYLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztnQ0FFckQsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQzFELENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDM0UsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzNDLENBQUMsQ0FBQztZQTlLQSxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUMxQixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxNQUFNLENBQUMsTUFBYTtZQUN6QixLQUFLLElBQUksSUFBSSxJQUFJLE1BQU07Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksSUFBSSxDQUFDLEtBQVU7WUFDcEIsSUFBSSxXQUFXLEdBQXNCLElBQUksQ0FBQztZQUUxQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUN2QixJQUFJLElBQUksR0FBc0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLElBQUk7b0JBQ1AsTUFBTTtnQkFFUixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXBCLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakMsQ0FBQztRQUNILENBQUM7UUFFRDs7OztXQUlHO1FBQ0ksV0FBVyxDQUFDLEtBQXdCO1lBQ3pDLElBQUksS0FBSyxHQUF3QixFQUFFLENBQUM7WUFDcEMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxLQUFLLEdBQXNCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNWLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdkIsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7d0JBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7O29CQUNDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLEtBQVE7WUFDdEIsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFDNUIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBcUIsSUFBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQy9ELE9BQTBCLElBQUksQ0FBQztZQUVuQyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVEsQ0FBQyxNQUEyQjtZQUN6QyxLQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxRQUFRO1lBQ2IsT0FBNEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxZQUFZLG1CQUFBLGNBQWMsQ0FBQyxDQUFDO1FBQzNHLENBQUM7UUFFTSxnQkFBZ0IsQ0FBQyxLQUFVO1lBQ2hDLElBQUksS0FBSyxHQUFpRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEcsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFTSxjQUFjLENBQUMsVUFBYSxFQUFFLFFBQVc7WUFDOUMsSUFBSSxLQUFLLEdBQWlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RyxJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO3dCQUMvQyxHQUFHLEdBQUcsUUFBUSxDQUFDO3lCQUNaLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7d0JBQ2xELEdBQUcsR0FBRyxVQUFVLENBQUM7O3dCQUVqQixTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixDQUFDO2dCQUNELElBQUksU0FBUyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7d0JBQ3hDLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTSxDQUFDLEtBQVU7WUFDdEIsSUFBSSxLQUFLLEdBQWlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RyxJQUFJLE9BQU8sR0FBd0IsRUFBRSxDQUFDO1lBRXRDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyx5Q0FBcUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUM7WUFFSCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRU0sV0FBVyxDQUFDLEtBQVE7WUFDekIsSUFBSSxLQUFLLEdBQWlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUs7Z0JBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzFDLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksV0FBVztZQUNoQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVNLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3ZCLElBQUksS0FBSyxHQUFpRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEcsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO2dCQUMzQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDO0tBZ0NGO0lBcExZLGlDQUFjLGlCQW9MMUIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEYsQ0FBQyxFQTVMUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBNEwzQjtBQzVMRCx3Q0FBd0M7QUFDeEMsSUFBVSxrQkFBa0IsQ0E2TjNCO0FBOU5ELHdDQUF3QztBQUN4QyxXQUFVLGtCQUFrQjtJQUUxQjs7Ozs7Ozs7Ozs7T0FXRztJQUNILE1BQWEsVUFBYyxTQUFRLG1CQUFBLGNBQWlCO1FBRWxELFlBQW1CLFdBQW9DLEVBQUUsS0FBUTtZQUMvRCxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBd0lqQixpQkFBWSxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNqRCxJQUFJLGFBQWEsR0FBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDdEQsSUFBSSxhQUFhLFlBQVksV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLGdIQUFnSDtvQkFDdk8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQyxDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtnQkFDekQsSUFBSSxNQUFNLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEdBQVEsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQztZQUVNLGNBQVMsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBRU0saUJBQVksR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUM1RCx1QkFBdUI7Z0JBQ3ZCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pFLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUMvRixNQUFNO29CQUNSO3dCQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakUsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUMvRixJQUFJLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBNkMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUYsSUFBSSxNQUFNLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pFLElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLENBQUM7b0JBQ1gsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNOzRCQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3ZCLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDOzRCQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxNQUFNO2dCQUNWLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDRyxRQUFRLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO29CQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBdk1BLElBQUksSUFBSSxHQUFzQixJQUFJLG1CQUFBLGNBQWMsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkIsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixrQ0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDBCQUFhLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLHdCQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwRCxhQUFhO1lBQ2IsSUFBSSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELGFBQWE7WUFDYixJQUFJLENBQUMsZ0JBQWdCLDZDQUF1QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYztZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksV0FBVztZQUNoQixJQUFJLEtBQUssR0FBNkMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLEtBQUssR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFvQixRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0UsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUzQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLE9BQU87WUFDWixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2hCLFNBQVM7Z0JBRVgsSUFBSSxNQUFNLEdBQXNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxXQUFXLENBQUMsU0FBYyxFQUFFLE9BQVUsRUFBRSxNQUFlO1lBQzVELGdEQUFnRDtZQUNoRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPO1lBRVQsd0VBQXdFO1lBQ3hFLElBQUksSUFBSSxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQzNCLE9BQU87WUFFVCxJQUFJLEtBQUssR0FBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEMsMERBQTBEO1lBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxVQUFVLEdBQVMsT0FBTyxDQUFDO1lBQy9CLElBQUksVUFBVSxHQUFzQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWpFLElBQUksTUFBTSxHQUFzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxHQUFHLEdBQXNCLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwRCxVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLEdBQUc7Z0JBQ0wsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Z0JBRXhCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQyxDQUFDO1FBRU8sU0FBUyxDQUFDLE1BQWE7WUFDN0IsSUFBSSxJQUFJLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDL0QsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNuQyxPQUFPO1lBRVQsSUFBSSxNQUFNLEdBQXNCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRU8sWUFBWSxDQUFDLEtBQVU7WUFDN0IsSUFBSSxNQUFNLEdBQXNCLElBQUksbUJBQUEsY0FBYyxDQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0UsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksbUJBQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQsa0NBQWtDO1FBQzFCLFNBQVMsQ0FBQyxNQUFhO1lBQzdCLDRCQUE0QjtZQUM1QixJQUFJLE1BQU0sR0FBeUUsTUFBTyxDQUFDLE1BQU0sQ0FBQztZQUNsRyxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRFLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQixJQUFJLFNBQVMsR0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxPQUFPLEdBQVMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEMsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVE7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO29CQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFTyxPQUFPLENBQUMsTUFBaUI7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pILElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU3QyxDQUFDO0tBbUVGO0lBNU1ZLDZCQUFVLGFBNE10QixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBcUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUcsQ0FBQyxFQTdOUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBNk4zQjtBQzlORCxJQUFVLGtCQUFrQixDQTBFM0I7QUExRUQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBQ0gsTUFBc0Isb0JBQW9CO1FBQTFDO1lBQ0Usd0lBQXdJO1lBQ2pJLGNBQVMsR0FBUSxFQUFFLENBQUM7WUFDM0IsZ0tBQWdLO1lBQ3pKLGFBQVEsR0FBNkMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMxRixnS0FBZ0s7WUFDekosY0FBUyxHQUFnQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBRTlFLG9FQUFvRTtZQUM3RCxzQkFBaUIsR0FBa0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQTJEekUsQ0FBQztRQXpEQzs7V0FFRztRQUNJLFNBQVMsQ0FBQyxPQUFVO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOzs7V0FHRztRQUNJLE1BQU0sQ0FBQyxFQUFLLEVBQUUsRUFBSztZQUN4QixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYyxDQUFDLFFBQWEsRUFBRSxPQUFVO1lBQzdDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQXFDRjtJQXBFcUIsdUNBQW9CLHVCQW9FekMsQ0FBQTtBQUNILENBQUMsRUExRVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTBFM0I7QUMxRUQsSUFBVSxrQkFBa0IsQ0F5VTNCO0FBelVELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7O09BR0c7SUFDSCxNQUFhLGNBQWtCLFNBQVEsYUFBYTtRQU1sRCxRQUFRLENBQXNCO1FBRTlCLFlBQW1CLFdBQW9DLEVBQUUsS0FBUTtZQUMvRCxLQUFLLEVBQUUsQ0FBQztZQVJILFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1lBQzFCLFNBQUksR0FBTSxJQUFJLENBQUM7WUErSmQsYUFBUSxHQUFHLENBQUMsTUFBa0IsRUFBUSxFQUFFO2dCQUM5QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXpCLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDaEMsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDdkIsT0FBTztnQkFFVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEMsQ0FBQyxDQUFDO1lBRU0sV0FBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUMvQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVE7b0JBQ3pCLE9BQU87Z0JBRVQsSUFBSSxPQUFPLEdBQXlDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdFLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixvQ0FBb0M7b0JBQ3BDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXO3dCQUM5QixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPOzRCQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzs0QkFFbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEscUNBQW1CLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakksTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxPQUFPOzRCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OzRCQUVuQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSw2Q0FBdUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNySSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxxQ0FBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvSCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRO3dCQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSw2Q0FBdUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuSSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUNyQixNQUFNLE9BQU8sR0FBNkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6RSxJQUFJLENBQUMsT0FBTzs0QkFDVixNQUFNO3dCQUVSLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzt3QkFDL0IsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUNqQixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLO3dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHO3dCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSywwQkFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyx3QkFBWSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzlELENBQUM7d0JBQ0QsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sZ0JBQVcsR0FBRyxDQUFDLE1BQWtCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2hDLE9BQU87Z0JBRVQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUMvQixNQUFNLE9BQU8sR0FBNkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsMEVBQTBFO2dCQUMzSyxJQUFJLENBQUMsT0FBTztvQkFDVixPQUFPO2dCQUVULE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtnQkFDekQsSUFBSSxNQUFNLEdBQStFLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFekIsSUFBSSxNQUFNLFlBQVksZ0JBQWdCLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVCLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxJQUFJLE9BQU8sR0FBWSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXpFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBRXpCLElBQUksT0FBTztvQkFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RyxDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNqRCw0QkFBNEI7Z0JBQzVCLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO29CQUMxQyxPQUFPO2dCQUVULElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDOztvQkFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUV2QyxtR0FBbUc7Z0JBQ25HLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUM7WUFFTSxZQUFPLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQzVDLElBQUksSUFBSSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDMUQsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSxtQkFBQSxVQUFVLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDOUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUN6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLG9DQUFtQjt3QkFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDN0MsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQ2hGLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDeEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO3dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO3dCQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDOUMsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0saUJBQVksR0FBRyxDQUFDLE1BQW9CLEVBQVEsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2hDLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsZ0RBQWdEO2dCQUNoRCw2Q0FBNkM7Z0JBQzdDLFlBQVk7Z0JBQ1osNEJBQTRCO2dCQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUM7WUFwVEEsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixzQ0FBcUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsK0RBQStEO1lBQy9ELG1FQUFtRTtZQUVuRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyx1Q0FBdUM7WUFDOUYsSUFBSSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLHlDQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxXQUFXO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztRQUNwRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFdBQVcsQ0FBQyxJQUFhO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQy9ELENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUTtZQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVEsQ0FBQyxHQUFZO1lBQzlCLElBQUksR0FBRztnQkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O2dCQUV2QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxPQUFPO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVE7WUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDbkQsQ0FBQztRQUVNLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRU0sY0FBYztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0ksTUFBTSxDQUFDLE9BQWdCO1lBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixJQUFJLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRCxzRkFBc0Y7UUFDeEYsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYztZQUNuQixJQUFJLElBQUksR0FBOEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xFLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztZQUNuQixLQUFLLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQXFCLElBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLFNBQVMsQ0FBQyxPQUEwQjtZQUN6QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxPQUFPO2dCQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksU0FBUztZQUNkLE9BQTBCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUdEOzs7O1dBSUc7UUFDSSxNQUFNLENBQUMsU0FBa0IsRUFBRSxZQUFxQixLQUFLO1lBQzFELElBQUksS0FBSyxHQUFnQixJQUFJLFdBQVcsa0NBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7V0FFRztRQUNLLFlBQVk7WUFDbEIsSUFBSSxPQUFPLEdBQXNCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsT0FBTztnQkFDVixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRU8sTUFBTTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNwQixDQUFDO0tBZ0tGO0lBL1RZLGlDQUFjLGlCQStUMUIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQXFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILENBQUMsRUF6VVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXlVM0I7QUN6VUQsSUFBVSxrQkFBa0IsQ0EyUTNCO0FBM1FELFdBQVUsa0JBQWtCO0lBRTFCLCtEQUErRDtJQVMvRDs7Ozs7T0FLRztJQUNILE1BQWEsS0FBd0IsU0FBUSxnQkFBZ0I7UUFLM0QsWUFBbUIsV0FBK0IsRUFBRSxLQUFVLEVBQUUsS0FBYztZQUM1RSxLQUFLLEVBQUUsQ0FBQztZQWdMViw2Q0FBNkM7WUFDN0MsaUNBQWlDO1lBQ2pDLDRGQUE0RjtZQUM1RixJQUFJO1lBRUksY0FBUyxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQ3pELElBQUksTUFBTSxHQUErQixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN2RCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksT0FBTyxHQUFRLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUsseUNBQXFCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQztZQUVGLG1FQUFtRTtZQUNuRSwrQkFBK0I7WUFDL0IsaUNBQWlDO1lBQ2pDLDZEQUE2RDtZQUM3RCw4QkFBOEI7WUFDOUIsK0JBQStCO1lBQy9CLDJHQUEyRztZQUMzRyxrQkFBa0I7WUFDbEIsZ0NBQWdDO1lBQ2hDLDZFQUE2RTtZQUM3RSxrQkFBa0I7WUFDbEIsOEJBQThCO1lBQzlCLDJHQUEyRztZQUMzRyw2RUFBNkU7WUFDN0UsNkJBQTZCO1lBQzdCLGtCQUFrQjtZQUNsQixTQUFTO1lBQ1QsSUFBSTtZQUVJLGFBQVEsR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBbUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxNQUFNLEdBQStCLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZELElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLENBQUM7b0JBQ1gsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNOzRCQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3ZCLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDOzRCQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxNQUFNO2dCQUNWLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDSCxRQUFRLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO29CQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBL09BLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBRTVCLElBQUksQ0FBQyxnQkFBZ0IsMEJBQTRCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsZ0JBQWdCLGtDQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLHFDQUFrQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBc0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxnQkFBZ0IsOEJBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQkFBZ0IsOEJBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELDJEQUEyRDtZQUMzRCx1REFBdUQ7WUFDdkQsd0RBQXdEO1lBQ3hELDZEQUE2RDtZQUM3RCw4REFBOEQ7WUFDOUQsNERBQTREO1FBQzlELENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU07WUFDWCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLElBQUksR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRTlDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXhDLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMxQixrQ0FBa0M7Z0JBQ2xDLElBQUksSUFBSSxHQUFpQixJQUFJLG1CQUFBLFNBQVMsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRSwyREFBMkQ7Z0JBQzNELElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQVUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLGNBQWM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRDs7V0FFRztRQUNJLFdBQVc7WUFDaEIsSUFBSSxLQUFLLEdBQW1DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEYsSUFBSSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBZSxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDeEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUzQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFTSxjQUFjLENBQUMsVUFBYSxFQUFFLFFBQVc7WUFDOUMsSUFBSSxLQUFLLEdBQXVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RixJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVTt3QkFDekIsR0FBRyxHQUFHLFFBQVEsQ0FBQzt5QkFDWixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDNUIsR0FBRyxHQUFHLFVBQVUsQ0FBQzs7d0JBRWpCLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7d0JBQ2xCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUM7WUFDRCxxQ0FBcUM7UUFDdkMsQ0FBQztRQUVNLGdCQUFnQixDQUFDLEtBQVU7WUFDaEMsc0JBQXNCO1lBQ3RCLElBQUksS0FBSyxHQUF1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUYsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFTyxVQUFVLENBQUMsU0FBa0I7WUFDbkMsSUFBSSxFQUFFLEdBQXdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0QsS0FBSyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLEdBQStCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xFLEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDN0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsRUFBRSxDQUFDLGdCQUFnQiw4QkFFakIsQ0FBQyxNQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLDBCQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDM0csQ0FBQztnQkFDSixDQUFDO2dCQUNELEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVPLGNBQWM7WUFDcEIsSUFBSSxNQUFNLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekQsS0FBSyxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLE1BQU0sR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0QsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixNQUFNLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVPLE9BQU8sQ0FBQyxNQUFtQjtZQUNqQyxJQUFJLEtBQUssR0FBOEIsTUFBTSxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUM7WUFDNUQsSUFBSSxHQUFHLEdBQXlCLE1BQU0sQ0FBQyxNQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25FLElBQUksU0FBUyxHQUFXLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBRUQsMENBQTBDO1FBQzFDLHVDQUF1QztRQUN2QywyQkFBMkI7UUFDM0Isd0JBQXdCO1FBQ3hCLG1GQUFtRjtRQUNuRixtQ0FBbUM7UUFDbkMsTUFBTTtRQUNOLElBQUk7UUFFSiwyQ0FBMkM7UUFDM0MsMEZBQTBGO1FBQzFGLGtGQUFrRjtRQUNsRixvQkFBb0I7UUFDcEIsNkRBQTZEO1FBQzdELElBQUk7UUFFSixpREFBaUQ7UUFDakQsb0VBQW9FO1FBQ3BFLHlCQUF5QjtRQUN6Qiw4QkFBOEI7UUFDOUIsdUdBQXVHO1FBQ3ZHLEtBQUs7UUFFRyxTQUFTLENBQUMsTUFBYTtZQUM3Qiw0QkFBNEI7WUFDNUIsSUFBSSxNQUFNLEdBQXlFLE1BQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEcsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0RSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxTQUFTLEdBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksT0FBTyxHQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3hDLE9BQU87WUFDVCxDQUFDO1lBRUQsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRO2dCQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN4QyxDQUFDO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtvQkFDbEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBbUVGO0lBdlBZLHdCQUFLLFFBdVBqQixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RSxDQUFDLEVBM1FTLGtCQUFrQixLQUFsQixrQkFBa0IsUUEyUTNCO0FDM1FELElBQVUsa0JBQWtCLENBcUMzQjtBQXJDRCxXQUFVLGtCQUFrQjtJQUMxQjs7O09BR0c7SUFDSCxNQUFzQixlQUFlO1FBQXJDO1lBQ0UseUlBQXlJO1lBQ2xJLGNBQVMsR0FBUSxFQUFFLENBQUM7WUFDM0IsaUtBQWlLO1lBQzFKLGFBQVEsR0FBZ0MsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM3RSxpS0FBaUs7WUFDMUosY0FBUyxHQUFnQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBeUJoRixDQUFDO1FBakJRLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBYyxJQUFrQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FpQnhFO0lBL0JxQixrQ0FBZSxrQkErQnBDLENBQUE7QUFDSCxDQUFDLEVBckNTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFxQzNCO0FDckNELElBQVUsa0JBQWtCLENBbUwzQjtBQW5MRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckI7O09BRUc7SUFDSCxNQUFhLFNBQTRCLFNBQVEsbUJBQW1CO1FBSWxFLFlBQW1CLFdBQStCLEVBQUUsS0FBUTtZQUMxRCxLQUFLLEVBQUUsQ0FBQztZQUpILFNBQUksR0FBTSxJQUFJLENBQUM7WUEwRWQsa0JBQWEsR0FBRyxDQUFDLE1BQWtDLEVBQVEsRUFBRTtnQkFDbkUsSUFBSSxNQUFNLFlBQVksYUFBYSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUN0RSxPQUFPO2dCQUVULElBQUksS0FBSyxHQUF1QyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM5RCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDdkIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQztZQUVNLGNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUN6RCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxNQUFNLEdBQXVDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQy9ELE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixnREFBZ0Q7Z0JBQ2hELDhEQUE4RDtnQkFFOUQsSUFBSSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQzFELHNGQUFzRjtvQkFDdEYsa0NBQWtDO29CQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xILENBQUM7Z0JBQ0QsT0FBTztZQUNULENBQUMsQ0FBQztZQUVNLFdBQU0sR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDL0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDdkIsT0FBTztnQkFDVCw0QkFBNEI7Z0JBQzVCLFlBQVk7Z0JBQ1osb0VBQW9FO2dCQUVwRSxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsb0NBQW9DO29CQUNwQyxvSUFBb0k7b0JBQ3BJLFdBQVc7b0JBQ1gsbUNBQW1DO29CQUNuQyx3SUFBd0k7b0JBQ3hJLFdBQVc7b0JBQ1gsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLHFDQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ILE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVE7d0JBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLDZDQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25JLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUs7d0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzdDLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUc7d0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTTt3QkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDBCQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsQ0FBQzt3QkFDRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsQ0FBQzt3QkFDRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHdCQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUQsQ0FBQzt3QkFDRCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUE7WUFFTyxpQkFBWSxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNqRCw0QkFBNEI7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDOztvQkFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDNUMsQ0FBQyxDQUFBO1lBRU8sZ0JBQVcsR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDaEQsNEJBQTRCO2dCQUM1QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM1QywyQ0FBMkM7WUFDN0MsQ0FBQyxDQUFBO1lBRU8saUJBQVksR0FBRyxDQUFDLE1BQW9CLEVBQVEsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUE7WUFyS0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsa0RBQWtEO1lBQ2xELDBCQUEwQjtZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUV6QixJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixpQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxnQkFBZ0IsOEJBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELCtEQUErRDtZQUMvRCwrREFBK0Q7WUFDL0QsbUVBQW1FO1lBRW5FLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLG1DQUFrQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFekQsdURBQXVEO1FBQ3pELENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUSxDQUFDLEdBQVk7WUFDOUIsSUFBSSxHQUFHO2dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Z0JBRXZDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVE7WUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSSxNQUFNLENBQUMsU0FBa0IsRUFBRSxZQUFxQixLQUFLO1lBQzFELElBQUksS0FBSyxHQUFnQixJQUFJLFdBQVcsa0NBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFTyxNQUFNLENBQUMsT0FBZ0I7WUFDN0IsS0FBSyxJQUFJLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxLQUFLLEdBQW1CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlELElBQUksRUFBRSxHQUF5QixRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLEtBQUssR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUNqQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDdEIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFckMsS0FBSyxDQUFDLGdCQUFnQixpQ0FBaUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzRCxLQUFLLENBQUMsZ0JBQWdCLHNDQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQy9ELEtBQUssQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFeEQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQztLQW1HRjtJQTVLWSw0QkFBUyxZQTRLckIsQ0FBQTtJQUNELGNBQWMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFxQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN2RyxDQUFDLEVBbkxTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFtTDNCO0FDbkxELElBQVUsa0JBQWtCLENBd0kzQjtBQXhJRCxXQUFVLGtCQUFrQjtJQUUxQjs7TUFFRTtJQUNGLE1BQWEsUUFBWSxTQUFRLGdCQUFnQjtRQUUvQyxZQUFtQixTQUF3QixFQUFFO1lBQzNDLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUMxQixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNJLElBQUksQ0FBQyxLQUFVLEVBQUUsU0FBa0IsSUFBSTtZQUM1QyxJQUFJLFdBQVcsR0FBZ0IsSUFBSSxDQUFDO1lBRXBDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksSUFBSSxHQUFnQixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0QsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSSxXQUFXLENBQUMsS0FBa0I7WUFDbkMsSUFBSSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztZQUM5QixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLEtBQUssR0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO3dCQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixDQUFDOztvQkFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVEsQ0FBQyxLQUFRO1lBQ3RCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQzVCLElBQWtCLElBQUssQ0FBQyxJQUFJLElBQUksS0FBSztvQkFDbkMsT0FBb0IsSUFBSSxDQUFDO1lBRTdCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLE1BQXFCO1lBQ25DLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVE7WUFDYixPQUErQixJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9DLENBQUM7UUFFTSxnQkFBZ0IsQ0FBQyxLQUFVO1lBQ2hDLElBQUksS0FBSyxHQUFxRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUYsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFTSxjQUFjLENBQUMsVUFBYSxFQUFFLFFBQVc7WUFDOUMsSUFBSSxLQUFLLEdBQXFELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVTt3QkFDekIsR0FBRyxHQUFHLFFBQVEsQ0FBQzt5QkFDWixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDNUIsR0FBRyxHQUFHLFVBQVUsQ0FBQzs7d0JBRWpCLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7d0JBQ2xCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTSxDQUFDLEtBQVU7WUFDdEIsSUFBSSxLQUFLLEdBQXFELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLE9BQU8sR0FBa0IsRUFBRSxDQUFDO1lBRWhDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNsQyxrRUFBa0U7b0JBQ2xFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHlDQUFxQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTSxXQUFXLENBQUMsS0FBUTtZQUN6QixJQUFJLEtBQUssR0FBcUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFGLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUNGO0lBL0hZLDJCQUFRLFdBK0hwQixDQUFBO0lBR0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDckUsQ0FBQyxFQXhJUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBd0kzQjtBQ3hJRCxrQ0FBa0M7QUFDbEMsSUFBVSxrQkFBa0IsQ0FrTjNCO0FBbk5ELGtDQUFrQztBQUNsQyxXQUFVLGtCQUFrQjtJQUMxQixJQUFZLFNBR1g7SUFIRCxXQUFZLFNBQVM7UUFDbkIsa0NBQXFCLENBQUE7UUFDckIsa0NBQXFCLENBQUE7SUFDdkIsQ0FBQyxFQUhXLFNBQVMsR0FBVCw0QkFBUyxLQUFULDRCQUFTLFFBR3BCO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxNQUFhLElBQVEsU0FBUSxtQkFBQSxRQUFXO1FBR3RDLFlBQVksV0FBOEIsRUFBRSxLQUFRO1lBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQTZISixjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxNQUFNLEdBQTZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQztZQUVNLGlCQUFZLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtnQkFDNUQsdUJBQXVCO2dCQUN2QixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksTUFBTSxHQUE2QixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEI7d0JBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDL0YsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2pFLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDL0YsSUFBSSxHQUFHLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUNqRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksS0FBSyxHQUFpQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixJQUFJLE1BQU0sR0FBNkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDckQsSUFBSSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxLQUFLLEdBQUcsQ0FBQztvQkFDWCxPQUFPO2dCQUVULElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU07NEJBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUM7NEJBQ2QsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUN2QixNQUFNO29CQUNSO3dCQUNFLE1BQU07Z0JBQ1YsQ0FBQztnQkFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRO29CQUNILFFBQVEsQ0FBQyxhQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87b0JBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUM7WUF2TEEsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQWdCLElBQUksbUJBQUEsUUFBUSxDQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QixJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLGtDQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDBCQUFhLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGdCQUFnQiw0QkFBYyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGdCQUFnQix3QkFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEQsYUFBYTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RCxhQUFhO1lBQ2IsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBdUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRDs7V0FFRztRQUNJLGNBQWM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRDs7V0FFRztRQUNJLFdBQVc7WUFDaEIsSUFBSSxLQUFLLEdBQWlDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBYyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdkUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUzQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFTyxTQUFTLENBQUMsTUFBYTtZQUM3QixJQUFJLElBQUksR0FBNkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNuRCxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQ25DLE9BQU87WUFFVCxJQUFJLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFTyxZQUFZLENBQUMsS0FBVTtZQUM3QixJQUFJLE1BQU0sR0FBZ0IsSUFBSSxtQkFBQSxRQUFRLENBQUksRUFBRSxDQUFDLENBQUM7WUFDOUMsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksbUJBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRU8sU0FBUyxDQUFDLE1BQWE7WUFDN0IsSUFBSSxJQUFJLEdBQWdELE1BQU0sQ0FBQyxNQUFPLENBQUMsVUFBVSxDQUFDO1lBQ2xGLElBQUksT0FBTyxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUUsSUFBSSxPQUFPO2dCQUNULElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVELGtDQUFrQztRQUMxQixTQUFTLENBQUMsTUFBYTtZQUM3Qiw0QkFBNEI7WUFDNUIsSUFBSSxNQUFNLEdBQXlFLE1BQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEcsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0RSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxTQUFTLEdBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksT0FBTyxHQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3hDLE9BQU87WUFDVCxDQUFDO1lBRUQsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRO2dCQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN4QyxDQUFDO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtvQkFDbEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRU8sT0FBTyxDQUFDLE1BQWlCO1lBQy9CLDRCQUE0QjtZQUM1QixvQ0FBb0M7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVPLFdBQVcsQ0FBQyxTQUFjLEVBQUUsT0FBVTtZQUM1QyxnREFBZ0Q7WUFDaEQsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsT0FBTztZQUVULHdFQUF3RTtZQUN4RSxJQUFJLElBQUksR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBTSxTQUFTLEVBQUssT0FBTyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQzNCLE9BQU87WUFFVCwwREFBMEQ7WUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixJQUFJLFVBQVUsR0FBUyxPQUFPLENBQUM7WUFDL0IsSUFBSSxVQUFVLEdBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0QsSUFBSSxNQUFNLEdBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyRixJQUFJLEdBQUcsR0FBZ0IsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzlDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksR0FBRztnQkFDTCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztnQkFFeEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxQixTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ2YsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNqQixDQUFDO0tBOERGO0lBN0xZLHVCQUFJLE9BNkxoQixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQXFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQy9GLENBQUMsRUFsTlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQWtOM0I7QUNuTkQsSUFBVSxrQkFBa0IsQ0F3RDNCO0FBeERELFdBQVUsa0JBQWtCO0lBQzFCOzs7T0FHRztJQUNILE1BQXNCLGNBQWM7UUFBcEM7WUFDRSx3SUFBd0k7WUFDakksY0FBUyxHQUFRLEVBQUUsQ0FBQztZQUMzQixnS0FBZ0s7WUFDekosYUFBUSxHQUFnQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQzdFLGdLQUFnSztZQUN6SixjQUFTLEdBQWdDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFxQzlFLCtEQUErRDtZQUMvRCw4QkFBOEI7WUFDOUIsNkJBQTZCO1lBQzdCLHFFQUFxRTtZQUNyRSx1Q0FBdUM7WUFDdkMsNkNBQTZDO1lBQzdDLElBQUk7UUFDTixDQUFDO0tBQUE7SUFsRHFCLGlDQUFjLGlCQWtEbkMsQ0FBQTtBQUNILENBQUMsRUF4RFMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXdEM0I7QUN4REQsSUFBVSxrQkFBa0IsQ0FzVDNCO0FBdFRELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7O09BR0c7SUFDSCxNQUFhLFFBQVksU0FBUSxhQUFhO1FBUzVDLFlBQW1CLFdBQThCLEVBQUUsS0FBUTtZQUN6RCxLQUFLLEVBQUUsQ0FBQztZQVRILFlBQU8sR0FBVyxVQUFVLENBQUM7WUFDN0IsWUFBTyxHQUFnQixFQUFFLENBQUM7WUFDMUIsU0FBSSxHQUFNLElBQUksQ0FBQztZQWlLZCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDekMsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLO29CQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQyxDQUFDO1lBRU0sV0FBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUMvQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7b0JBQ3RCLE9BQU87Z0JBQ1QsSUFBSSxPQUFPLEdBQTZCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpFLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVzt3QkFDOUIsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTzs0QkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7NEJBRWxCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLHFDQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2pJLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksT0FBTzs0QkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs0QkFFbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsNkNBQXVCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckksTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEscUNBQW1CLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0gsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUTt3QkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsNkNBQXVCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDbkksTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7d0JBQ3hCLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUs7d0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzdDLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUc7d0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTTt3QkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDBCQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsQ0FBQzt3QkFDRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsQ0FBQzt3QkFDRCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNyQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHdCQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUQsQ0FBQzt3QkFDRCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUM7WUFPTSxnQkFBVyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzVDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRO29CQUNoQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxNQUFNLEdBQXVDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQy9ELElBQUksSUFBSSxHQUFpQyxNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUM5RCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXpCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixLQUFLLFVBQVU7d0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzVCLE1BQU07b0JBQ1IsS0FBSyxNQUFNO3dCQUNULE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO3dCQUN2QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BHLE1BQU07b0JBQ1IsS0FBSyxTQUFTO3dCQUNaLHVCQUF1Qjt3QkFDdkIsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0saUJBQVksR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDakQsNEJBQTRCO2dCQUM1QixJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztvQkFDMUMsT0FBTztnQkFFVCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRO29CQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzs7b0JBRTdELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUV2QyxtR0FBbUc7Z0JBQ25HLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQztZQUVNLGdCQUFXLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2hELHVDQUF1QztnQkFDdkMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUM7b0JBQ3JDLE9BQU87Z0JBRVQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxQyw0QkFBNEI7Z0JBQzVCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUMxQyxDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLENBQUMsTUFBb0IsRUFBUSxFQUFFO2dCQUNwRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDaEMsT0FBTztnQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQztZQUVNLGNBQVMsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUMxQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLE1BQU07b0JBQ3ZDLE9BQU87Z0JBQ1QsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUM7WUFoU0EsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQywwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV0RCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLHNDQUFxQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCwrREFBK0Q7WUFDL0QsbUVBQW1FO1lBRW5FLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLG1DQUFrQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IseUNBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFdBQVc7WUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDO1FBQ3BELENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsV0FBVyxDQUFDLElBQWE7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDL0QsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxRQUFRLENBQUMsR0FBWTtZQUM5QixJQUFJLEdBQUc7Z0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztnQkFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUTtZQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxRQUFRLENBQUMsS0FBYTtZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUTtZQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFFRDs7OztXQUlHO1FBQ0ksTUFBTSxDQUFDLE9BQWdCO1lBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixJQUFJLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTlDLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3JGLENBQUM7UUFFRDs7V0FFRztRQUNJLGNBQWM7WUFDbkIsSUFBSSxJQUFJLEdBQThCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRSxJQUFJLElBQUksR0FBUSxFQUFFLENBQUM7WUFDbkIsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJO2dCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFlLElBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLFNBQVMsQ0FBQyxPQUFvQjtZQUNuQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxPQUFPO2dCQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksU0FBUztZQUNkLE9BQW9CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUdEOzs7O1dBSUc7UUFDSSxNQUFNLENBQUMsU0FBa0IsRUFBRSxZQUFxQixLQUFLO1lBQzFELElBQUksS0FBSyxHQUFnQixJQUFJLFdBQVcsa0NBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7V0FFRztRQUNLLFlBQVk7WUFDbEIsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsT0FBTztnQkFDVixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRU8sTUFBTTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBa0VPLGdCQUFnQjtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixDQUFDO0tBc0VGO0lBNVNZLDJCQUFRLFdBNFNwQixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQXFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hHLENBQUMsRUF0VFMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXNUM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiLz4gLy8gVE9ETzogbm93IHRoYXQgd2UgdXNlIHBhY2thZ2UgcmVmZXJlbmNlcyBpbiB0aGUgdHNjb25maWcsIHRoaXMgZmlsZSBpcyBvYnNvbGV0ZSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29ubmVjdHMgYSBbW011dGFibGVdXSB0byBhIERPTS1FbGVtZW50IGFuZCBzeW5jaHJvbml6ZXMgdGhhdCBtdXRhYmxlIHdpdGggdGhlIG11dGF0b3Igc3RvcmVkIHdpdGhpbi5cclxuICAgKiBVcGRhdGVzIHRoZSBtdXRhYmxlIG9uIGludGVyYWN0aW9uIHdpdGggdGhlIGVsZW1lbnQgYW5kIHRoZSBlbGVtZW50IGluIHRpbWUgaW50ZXJ2YWxzLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgIC8vIFRPRE86IGV4YW1pbmUgdGhlIHVzZSBvZiB0aGUgYXR0cmlidXRlIGtleSB2cyBuYW1lLiBLZXkgc2lnbmFscyB0aGUgdXNlIGJ5IEZVREdFIHdoaWxlIG5hbWUgaXMgc3RhbmRhcmQgYW5kIHN1cHBvcnRlZCBieSBmb3Jtc1xyXG4gICAgcHVibGljIGRvbUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHRpbWVVcGRhdGU6IG51bWJlciA9IDE5MDtcclxuICAgIC8qKiBSZWZlcmVyZW5jZSB0byB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHRoaXMgdWkgcmVmZXJzIHRvICovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBjb252ZXkgZGF0YSB0byBhbmQgZnJvbSB0aGUgbXV0YWJsZSovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRvcjogxpIuTXV0YXRvcjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBzdG9yZSB0aGUgZGF0YSB0eXBlcyBvZiB0aGUgbXV0YXRvciBhdHRyaWJ1dGVzKi9cclxuICAgIHByb3RlY3RlZCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3IgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgaWRJbnRlcnZhbDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudCA9IF9kb21FbGVtZW50O1xyXG4gICAgICB0aGlzLnNldE11dGFibGUoX211dGFibGUpO1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lLCBpZiB0aGlzIHNob3VsZCByZWdpc3RlciB0byBvbmUgY29tbW9uIGludGVydmFsLCBpbnN0ZWFkIG9mIGVhY2ggaW5zdGFsbGluZyBpdHMgb3duLlxyXG4gICAgICB0aGlzLnN0YXJ0UmVmcmVzaCgpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgdGhpcy5tdXRhdGVPbklucHV0KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVBUlJBTkdFX0FSUkFZLCB0aGlzLnJlYXJyYW5nZUFycmF5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIGFuIGV4aXN0aW5nIFtbxpIuTXV0YXRvcl1dIGFzIGEgdGVtcGxhdGUgXHJcbiAgICAgKiBhbmQgdXBkYXRpbmcgaXRzIHZhbHVlcyB3aXRoIHRob3NlIGZvdW5kIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50LiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVNdXRhdG9yKF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKF9tdXRhdG9yW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGVsZW1lbnQsIF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gX211dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgYSBbW8aSLk11dGFibGVdXSBhcyBhIHRlbXBsYXRlIHRvIGNyZWF0ZSBhIFtbxpIuTXV0YXRvcl1dIG9yIHVwZGF0ZSB0aGUgZ2l2ZW4gW1vGki5NdXRhdG9yXV0gXHJcbiAgICAgKiB3aXRoIHRoZSB2YWx1ZXMgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNdXRhdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lIGlmIHRoaXMubXV0YXRvciBzaG91bGQgYWxzbyBiZSBhZGRyZXNzZWQgaW4gc29tZSB3YXkuLi5cclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAvLyBUT0RPOiBNdXRhdG9yIHR5cGUgbm93IG9ubHkgdXNlZCBmb3IgZW51bXMuIEV4YW1pbmUgaWYgdGhlcmUgaXMgYW5vdGhlciB3YXlcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX3R5cGVzIHx8IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSAoPEN1c3RvbUVsZW1lbnQ+ZWxlbWVudCkuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgLy8gVE9ETzogc2V0dGluZyBhIHZhbHVlIG9mIHRoZSBkb20gZWxlbWVudCBkb2Vzbid0IG1ha2Ugc2Vuc2UuLi4gZXhhbWluZSB3aGF0IHRoaXMgbGluZSB3YXMgc3VwcG9zZWQgdG8gZG8uIEFzc3VtYWJseSBlbnVtc1xyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gKDxIVE1MU2VsZWN0RWxlbWVudD5lbGVtZW50KS52YWx1ZTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhdG9yOiDGki5NdXRhdG9yID0gUmVmbGVjdC5nZXQobXV0YXRvciwga2V5KTtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlO1xyXG4gICAgICAgICAgc3ViTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIG11dGF0b3Jba2V5XSA9IHRoaXMuZ2V0TXV0YXRvcihzdWJNdXRhYmxlLCBlbGVtZW50LCBzdWJNdXRhdG9yKTsgLy8sIHN1YlR5cGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgW1vGki5NdXRhdG9yXV0gb2YgYSBbW8aSLk11dGFibGVdXSBhbmQgdXBkYXRpbmcgdGhlIFVJLWRvbUVsZW1lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgKiBJZiBhbiBhZGRpdGlvbmFsIFtbxpIuTXV0YXRvcl1dIGlzIHBhc3NlZCwgaXRzIHZhbHVlcyBhcmUgdXNlZCBpbnN0ZWFkIG9mIHRob3NlIG9mIHRoZSBbW8aSLk11dGFibGVdXS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVVc2VySW50ZXJmYWNlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGxldCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGUgPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmIChzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5IHx8IHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2Uoc3ViTXV0YWJsZSwgZWxlbWVudCwgbXV0YXRvcltrZXldKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgLy9lbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwidmFsdWVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgYnJlYWR0aC1maXJzdCBzZWFyY2ggb24gdGhlIGdpdmVuIF9kb21FbGVtZW50IGZvciBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGtleS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGBba2V5PVwiJHtfa2V5fVwiXWApO1xyXG4gICAgICBpZiAoZWxlbWVudHMubGVuZ3RoIDwgMilcclxuICAgICAgICByZXR1cm4gZWxlbWVudHNbMF07XHJcblxyXG4gICAgICBsZXQgc2hvcnRlc3RQYXRoOiBudW1iZXIgPSBJbmZpbml0eTtcclxuICAgICAgbGV0IGNsb3Nlc3RFbGVtZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcGFyZW50RWxlbWVudDogSFRNTEVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7IHBhcmVudEVsZW1lbnQgIT0gX2RvbUVsZW1lbnQ7IHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIGlmIChjb3VudCA8IHNob3J0ZXN0UGF0aCkge1xyXG4gICAgICAgICAgY2xvc2VzdEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgc2hvcnRlc3RQYXRoID0gY291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY2xvc2VzdEVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyAgIHJldHVybiBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiBba2V5PVwiJHtfa2V5fVwiXWApID8/IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYDpzY29wZSA+ICogPiBba2V5PVwiJHtfa2V5fVwiXWApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIC8vICAgbGV0IHF1ZXVlOiBIVE1MRWxlbWVudFtdID0gW19kb21FbGVtZW50XTtcclxuICAgIC8vICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuICAgIC8vICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBxdWV1ZS5zaGlmdCgpO1xyXG4gICAgLy8gICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoYFtrZXk9XCIke19rZXl9XCJdYCkpXHJcbiAgICAvLyAgICAgICByZXR1cm4gZWxlbWVudDtcclxuXHJcbiAgICAvLyAgICAgcXVldWUucHVzaCguLi48SFRNTEVsZW1lbnRbXT5BcnJheS5mcm9tKGVsZW1lbnQuY2hpbGRyZW4pKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcihfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgLy8gVE9ETzogc2hvdWxkIGdldCBNdXRhdG9yIGZvciBVSSBvciB3b3JrIHdpdGggdGhpcy5tdXRhdG9yIChleGFtaW5lKVxyXG4gICAgICB0aGlzLm11dGFibGUudXBkYXRlTXV0YXRvcih0aGlzLm11dGF0b3IpO1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMubXV0YWJsZSwgdGhpcy5kb21FbGVtZW50LCBfbXV0YXRvciwgX3R5cGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlVXNlckludGVyZmFjZSgpOiB2b2lkIHtcclxuICAgICAgQ29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKHRoaXMubXV0YWJsZSwgdGhpcy5kb21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPik6IHZvaWQge1xyXG4gICAgICB0aGlzLm11dGFibGUgPSBfbXV0YWJsZTtcclxuICAgICAgdGhpcy5tdXRhdG9yID0gX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICB0aGlzLm11dGF0b3JUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyh0aGlzLm11dGF0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhYmxlKCk6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5tdXRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnJlZnJlc2gsIHRoaXMudGltZVVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG11dGF0ZU9uSW5wdXQgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIF9ldmVudC5jb21wb3NlZFBhdGgoKSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gdGhpcy5kb21FbGVtZW50KVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoa2V5KVxyXG4gICAgICAgICAgcGF0aC5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgcGF0aC5yZXZlcnNlKCk7XHJcbiAgICAgIHRoaXMubXV0YXRvciA9IHRoaXMuZ2V0TXV0YXRvcigpOyBcclxuICAgICAgYXdhaXQgdGhpcy5tdXRhYmxlLm11dGF0ZSjGki5NdXRhYmxlLmdldE11dGF0b3JGcm9tUGF0aCh0aGlzLm11dGF0b3IsIHBhdGgpKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULk1VVEFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYXJyYW5nZUFycmF5ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiBudW1iZXJbXSA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwuc2VxdWVuY2U7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBsZXQgZGV0YWlsczogRGV0YWlsc0FycmF5ID0gPERldGFpbHNBcnJheT5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjtcclxuXHJcbiAgICAgIHsgLy8gZmluZCB0aGUgTXV0YWJsZUFycmF5IGNvbm5lY3RlZCB0byB0aGlzIERldGFpbHNBcnJheVxyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRldGFpbHM7XHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQgIT0gdGhpcy5kb21FbGVtZW50KSB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpXHJcbiAgICAgICAgICAgIHBhdGgucHVzaChlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcclxuICAgICAgICBtdXRhYmxlID0gdGhpcy5tdXRhYmxlO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBwYXRoKVxyXG4gICAgICAgICAgbXV0YWJsZSA9IFJlZmxlY3QuZ2V0KG11dGFibGUsIGtleSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJlYXJyYW5nZSB0aGF0IG11dGFibGVcclxuICAgICAgKDzGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4+PHVua25vd24+bXV0YWJsZSkucmVhcnJhbmdlKHNlcXVlbmNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlZnJlc2ggPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmRvbUVsZW1lbnQpKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgZ2VuZXJhdGluZyBVSS1kb21FbGVtZW50cyBmcm9tIHRoZSBpbmZvcm1hdGlvbiBmb3VuZCBpbiBbW8aSLk11dGFibGVdXXMgYW5kIFtbxpIuTXV0YXRvcl1dc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBHZW5lcmF0b3Ige1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgW1tDb250cm9sbGVyXV0gZnJvbSBhIFtbRnVkZ2VDb3JlLk11dGFibGVdXSB3aXRoIGV4cGFuZGFibGUgZGV0YWlscyBvciBhIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVDb250cm9sbGVyKF9tdXRhYmxlOiDGki5NdXRhYmxlLCBfbmFtZT86IHN0cmluZyk6IENvbnRyb2xsZXIge1xyXG4gICAgICBsZXQgY29udHJvbGxlcjogQ29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKF9tdXRhYmxlLCBHZW5lcmF0b3IuY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKF9tdXRhYmxlLCBfbmFtZSkpO1xyXG4gICAgICBjb250cm9sbGVyLnVwZGF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgZXh0ZW5kYWJsZSBkZXRhaWxzIGZvciB0aGUgW1tGdWRnZUNvcmUuTXV0YXRvcl1dIG9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9uYW1lPzogc3RyaW5nLCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBEZXRhaWxzIHwgRGV0YWlsc0FycmF5IHtcclxuICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IF9uYW1lIHx8IF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWU7XHJcblxyXG4gICAgICBsZXQgZGV0YWlsczogRGV0YWlscyB8IERldGFpbHNBcnJheTtcclxuICAgICAgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5KVxyXG4gICAgICAgIGRldGFpbHMgPSBuZXcgRGV0YWlsc0FycmF5KG5hbWUpO1xyXG4gICAgICBlbHNlIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgZGV0YWlscyA9IG5ldyBEZXRhaWxzKG5hbWUsIF9tdXRhYmxlLnR5cGUpO1xyXG4gICAgICBlbHNlIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfbXV0YWJsZSwgX211dGF0b3IpKTtcclxuICAgICAgcmV0dXJuIGRldGFpbHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudHMgY29udGFpbmluZyB0aGUgaW50ZXJmYWNlIGZvciB0aGUgW1tGdWRnZUNvcmUuTXV0YXRvcl1dIG9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX211dGF0b3I/OiDGki5NdXRhdG9yKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGxldCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3JUeXBlcykge1xyXG4gICAgICAgIGxldCB0eXBlOiBPYmplY3QgPSBtdXRhdG9yVHlwZXNba2V5XTtcclxuICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IG11dGF0b3Jba2V5XTtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCB0eXBlLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCkge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IE9iamVjdCA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShzdWJNdXRhYmxlLCBrZXksIDzGki5NdXRhdG9yPnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCAmJiB0eXBlKSBcclxuICAgICAgICAgIGVsZW1lbnQgPSBuZXcgQ3VzdG9tRWxlbWVudE91dHB1dCh7IGtleToga2V5LCBsYWJlbDoga2V5LCB0eXBlOiB0eXBlLnRvU3RyaW5nKCksIHZhbHVlOiB2YWx1ZT8udG9TdHJpbmcoKSwgcGxhY2Vob2xkZXI6IGBEcm9wIHlvdXIgJHt0eXBlfSBoZXJlLi4uYCB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSAvLyB1bmRlZmluZWQgdmFsdWVzIHdpdGhvdXQgYSB0eXBlIGNhbid0IGJlIGRpc3BsYXllZFxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGl2LUVsZW1lbnQgY29udGFpbmluZyB0aGUgaW50ZXJmYWNlIGZvciB0aGUgW1tGdWRnZUNvcmUuTXV0YXRvcl1dIFxyXG4gICAgICogRG9lcyBub3Qgc3VwcG9ydCBuZXN0ZWQgbXV0YXRvcnMhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX211dGF0b3I6IMaSLk11dGF0b3IgfCBPYmplY3QpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBSZWZsZWN0LmdldChfbXV0YXRvciwga2V5KTtcclxuICAgICAgICAvLyBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgLy8gYXQgdGhpcyB0aW1lICgxLzIzKSBhZGRpbmcgYSBwcm9wZXJ0eSB0byBhbiBhbmltYXRpb24gaW4gdGhlIGVkaXRvciBjcmVhdGVzIGFuIGVtcHR5IGtleXMgbGlzdC4uLlxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZU11dGF0b3JFbGVtZW50KGtleSwgT2JqZWN0LCB7fSkpOyBcclxuICAgICAgICAvLyAgIGNvbnRpbnVlO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIC8vIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKGtleSwgXCJEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCAoPE9iamVjdD52YWx1ZSkuY29uc3RydWN0b3IubmFtZSwgdmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgc3BlY2lmaWMgQ3VzdG9tRWxlbWVudCBmb3IgdGhlIGdpdmVuIGRhdGEsIHVzaW5nIF9rZXkgYXMgaWRlbnRpZmljYXRpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5OiBzdHJpbmcsIF90eXBlOiBPYmplY3QgfCBzdHJpbmcsIF92YWx1ZTogT2JqZWN0KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKF90eXBlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoXCJPYmplY3RcIik7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWUudG9TdHJpbmcoKSB9LCBfdHlwZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfdmFsdWUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpIHsgLy8gVE9ETzogZGVsZXRlP1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJNdXRhYmxlQXJyYXlcIik7XHJcbiAgICAgICAgICAvLyBpbnNlcnQgQXJyYXktQ29udHJvbGxlciFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnRUeXBlOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCA9IEN1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgICAgIGlmICghZWxlbWVudFR5cGUpXHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogaW5zdGFudGlhdGUgYWJzdHJhY3QgY2xhc3NcclxuICAgICAgICAgIGVsZW1lbnQgPSBuZXcgZWxlbWVudFR5cGUoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5LCB2YWx1ZTogX3ZhbHVlPy50b1N0cmluZygpIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoX2Vycm9yKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRPRE86IHJlZmFjdG9yIGZvciBlbnVtcyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVEcm9wZG93bihfbmFtZTogc3RyaW5nLCBfY29udGVudDogT2JqZWN0LCBfdmFsdWU6IHN0cmluZywgX3BhcmVudDogSFRNTEVsZW1lbnQsIF9jc3NDbGFzcz86IHN0cmluZyk6IEhUTUxTZWxlY3RFbGVtZW50IHtcclxuICAgICAgbGV0IGRyb3Bkb3duOiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgIGRyb3Bkb3duLm5hbWUgPSBfbmFtZTtcclxuICAgICAgZm9yIChsZXQgdmFsdWUgaW4gX2NvbnRlbnQpIHtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9VcHBlckNhc2UoKSA9PSBfdmFsdWUudG9VcHBlckNhc2UoKSkge1xyXG4gICAgICAgICAgZW50cnkuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkcm9wZG93bi5hZGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIF9wYXJlbnQuYXBwZW5kQ2hpbGQoZHJvcGRvd24pO1xyXG4gICAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzKF9rZXk6IHN0cmluZywgX3R5cGU6IHN0cmluZyk6IERldGFpbHMge1xyXG4gICAgLy8gICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKF9rZXkpO1xyXG4gICAgLy8gICAvLyBkZXRhaWxzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgLy8gICByZXR1cm4gZGV0YWlscztcclxuICAgIC8vIH1cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0FycmF5KF9rZXk6IHN0cmluZywgX3R5cGU6IHN0cmluZyk6IERldGFpbHMge1xyXG4gICAgLy8gICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzQXJyYXkoX2tleSk7XHJcbiAgICAvLyAgIGRldGFpbHMuc2V0QXR0cmlidXRlKFwia2V5XCIsIF9rZXkpO1xyXG4gICAgLy8gICBkZXRhaWxzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgLy8gICByZXR1cm4gZGV0YWlscztcclxuICAgIC8vIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0cnVjdHVyZSBmb3IgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IGluIGEgQ3VzdG9tRWxlbWVudC5cclxuICAgKiBrZXkgKG1heWJlIHJlbmFtZSB0byBgbmFtZWApIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBtYXRjaCB0aGUga2V5IG9mIGEgbXV0YXRvciBpZiB1c2VkIGluIGNvbmp1bmN0aW9uXHJcbiAgICogbGFiZWwgaXMgcmVjb21tZW5kZWQgZm9yIGxhYmVsbGVkIGVsZW1lbnRzLCBrZXkgaXMgdXNlZCBpZiBub3QgZ2l2ZW4uXHJcbiAgICovXHJcbiAgZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50QXR0cmlidXRlcyB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBsYWJlbD86IHN0cmluZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgdGhlIG1hcHBpbmcgb2YgQ3VzdG9tRWxlbWVudHMgdG8gdGhlaXIgSFRNTC1UYWdzIHZpYSBjdXN0b21FbGVtZW50LmRlZmluZVxyXG4gICAqIGFuZCB0byB0aGUgZGF0YSB0eXBlcyBhbmQgW1tGdWRnZUNvcmUuTXV0YWJsZV1dcyB0aGV5IHJlbmRlciBhbiBpbnRlcmZhY2UgZm9yLiBcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ3VzdG9tRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgdGFnOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQ6IE1hcDxzdHJpbmcsIHR5cGVvZiBDdXN0b21FbGVtZW50PiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcylcclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIF9hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICBpZiAoX2F0dHJpYnV0ZXNbbmFtZV0gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBfYXR0cmlidXRlc1tuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgYW4gaWQgdG8gdXNlIGZvciBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnQsIG5lZWRlZCBlLmcuIGZvciBzdGFuZGFyZCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGdldCBuZXh0SWQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwixpJcIiArIEN1c3RvbUVsZW1lbnQuaWRDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBtYXAgdGhlIGdpdmVuIGVsZW1lbnQgdHlwZSB0byB0aGUgZ2l2ZW4gdGFnIGFuZCB0aGUgZ2l2ZW4gdHlwZSBvZiBkYXRhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZzogc3RyaW5nLCBfdHlwZUN1c3RvbUVsZW1lbnQ6IHR5cGVvZiBDdXN0b21FbGVtZW50LCBfdHlwZU9iamVjdD86IHR5cGVvZiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX3RhZywgX2NsYXNzKTtcclxuICAgICAgX3R5cGVDdXN0b21FbGVtZW50LnRhZyA9IF90YWc7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKF90YWcsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcblxyXG4gICAgICBpZiAoX3R5cGVPYmplY3QpXHJcbiAgICAgICAgQ3VzdG9tRWxlbWVudC5tYXAoX3R5cGVPYmplY3QubmFtZSwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gZGF0YSB0eXBlIChpZiByZWdpc3RlcmVkKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChfdHlwZTogc3RyaW5nKTogdHlwZW9mIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogc3RyaW5nIHwgdHlwZW9mIEN1c3RvbUVsZW1lbnQgfCBDdXN0b21FbGVtZW50Q29uc3RydWN0b3IgPSBDdXN0b21FbGVtZW50Lm1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICBpZiAodHlwZW9mIChlbGVtZW50KSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgIGVsZW1lbnQgPSBjdXN0b21FbGVtZW50cy5nZXQoZWxlbWVudCk7XHJcbiAgICAgIHJldHVybiA8dHlwZW9mIEN1c3RvbUVsZW1lbnQ+ZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBtYXAoX3R5cGU6IHN0cmluZywgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShcIk1hcFwiLCBfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50Lm5hbWUpO1xyXG4gICAgICBDdXN0b21FbGVtZW50Lm1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudC5zZXQoX3R5cGUsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIGtleSAobmFtZSkgb2YgdGhlIGF0dHJpYnV0ZSB0aGlzIGVsZW1lbnQgcmVwcmVzZW50c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGtleSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBsYWJlbC1lbGVtZW50IGFzIGNoaWxkIHRvIHRoaXMgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5kTGFiZWwoKTogSFRNTExhYmVsRWxlbWVudCB7XHJcbiAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRMYWJlbChfbGFiZWw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gX2xhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IHVzaW5nIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICBSZWZsZWN0LnNldCh0aGlzLCBcInZhbHVlXCIsIF92YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFdvcmthcm91bmQgcmVjb25uZWN0aW9uIG9mIGNsb25lICovXHJcbiAgICBwdWJsaWMgY2xvbmVOb2RlKF9kZWVwOiBib29sZWFuKTogTm9kZSB7XHJcbiAgICAgIGxldCBsYWJlbDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCBjbG9uZTogQ3VzdG9tRWxlbWVudCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxhYmVsID8geyBsYWJlbDogbGFiZWwgfSA6IG51bGwpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgY2xvbmUuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgb2YgdGhpcy5hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgY2hlY2tib3ggd2l0aCBhIGxhYmVsIHRvIGl0XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRCb29sZWFuIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWJvb2xlYW5cIiwgQ3VzdG9tRWxlbWVudEJvb2xlYW4sIEJvb2xlYW4pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBwaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHBpY2tlci50eXBlID0gXCJjb2xvclwiO1xyXG5cclxuICAgICAgcGlja2VyLnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChwaWNrZXIpO1xyXG5cclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgc2xpZGVyLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICAgIHNsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgc2xpZGVyLm1heCA9IFwiMVwiO1xyXG4gICAgICBzbGlkZXIuc3RlcCA9IFwiMC4wMVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcbiAgICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKEVWRU5ULldIRUVMLCB0aGlzLmhuZFdoZWVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgdmFsdWVzIG9mIHBpY2tlciBhbmQgc2xpZGVyIGFzIMaSLk11dGF0b3JcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IGhleDogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9Y29sb3JcIikpLnZhbHVlO1xyXG4gICAgICBsZXQgYWxwaGE6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPXJhbmdlXCIpKS52YWx1ZTtcclxuICAgICAgdGhpcy5jb2xvci5zZXRIZXgoaGV4LnN1YnN0cigxLCA2KSArIFwiZmZcIik7XHJcbiAgICAgIHRoaXMuY29sb3IuYSA9IHBhcnNlRmxvYXQoYWxwaGEpO1xyXG4gICAgICByZXR1cm4gdGhpcy5jb2xvci5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgY29sb3IgcGlja2VyIGFuZCBzbGlkZXJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb2xvci5tdXRhdGUoX3ZhbHVlKTtcclxuICAgICAgbGV0IGhleDogc3RyaW5nID0gdGhpcy5jb2xvci5nZXRIZXgoKTtcclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9Y29sb3JcIikpLnZhbHVlID0gXCIjXCIgKyBoZXguc3Vic3RyKDAsIDYpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWUgPSB0aGlzLmNvbG9yLmEudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleShfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KTtcclxuICAgICAgaWYgKHNsaWRlciAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoc2xpZGVyLnZhbHVlKTtcclxuICAgICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSAtIF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgc2xpZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFJlcHJlc2VudHMgYSBzaW5nbGUgZGlnaXQgbnVtYmVyIHRvIGJlIHVzZWQgaW4gZ3JvdXBzIHRvIHJlcHJlc2VudCBhIG11bHRpZGlnaXQgdmFsdWUuXHJcbiAgICogSXMgdGFiYmFibGUgYW5kIGluLS9kZWNyZWFzZXMgcHJldmlvdXMgc2libGluZyB3aGVuIGZsb3dpbmcgb3Zlci91bmRlci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudERpZ2l0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1kaWdpdFwiLCBDdXN0b21FbGVtZW50RGlnaXQpO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB2YWx1ZShfdmFsdWU6IG51bWJlcikge1xyXG4gICAgICBfdmFsdWUgPSBNYXRoLnRydW5jKF92YWx1ZSk7XHJcbiAgICAgIGlmIChfdmFsdWUgPiA5IHx8IF92YWx1ZSA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnRleHRDb250ZW50ID0gX3ZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy50ZXh0Q29udGVudCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGFkZChfYWRkZW5kOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX2FkZGVuZCA9IE1hdGgudHJ1bmMoX2FkZGVuZCk7XHJcbiAgICAgIGlmIChfYWRkZW5kID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9hZGRlbmQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPCA5KVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSsrO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPiAwKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZS0tO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoLTEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnQudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgQ3VzdG9tRWxlbWVudCBmcm9tIGFuIEhUTUwtVGVtcGxhdGUtVGFnXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJhZ21lbnQ6IE1hcDxzdHJpbmcsIERvY3VtZW50RnJhZ21lbnQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJvd3NlcyB0aHJvdWdoIHRoZSB0ZW1wbGF0ZXMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQgYW5kIHJlZ2lzdGVycyB0aGUgb25lIGRlZmluaW5nIHRoZSBnaXZlbiB0YWduYW1lLlxyXG4gICAgICogVG8gYmUgY2FsbGVkIGZyb20gYSBzY3JpcHQgdGFnIGltcGxlbWVudGVkIHdpdGggdGhlIHRlbXBsYXRlIGluIEhUTUwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZ05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCB0ZW1wbGF0ZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGVtcGxhdGVcIikpIHtcclxuICAgICAgICBpZiAodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5sb2NhbE5hbWUgPT0gX3RhZ05hbWUpIHtcclxuICAgICAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiUmVnaXN0ZXJcIiwgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuc2V0KF90YWdOYW1lLCB0ZW1wbGF0ZS5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IGluIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxJbnB1dEVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiW2tleVwiKTtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXl9XCJdYCk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgY29uc29sZS5sb2coYENvdWxkbid0IGZpbmQgJHtrZXl9IGluYCwgdGhpcyk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUoX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZWxlbWVudC52YWx1ZSA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lLCB0aGUgZWxlbWVudCBnZXRzIGNvbnN0cnVjdGVkIGFzIGEgZGVlcCBjbG9uZSBvZiB0aGUgdGVtcGxhdGUuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGxldCBmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCA9IEN1c3RvbUVsZW1lbnRUZW1wbGF0ZS5mcmFnbWVudC5nZXQoUmVmbGVjdC5nZXQodGhpcy5jb25zdHJ1Y3RvciwgXCJ0YWdcIikpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZnJhZ21lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG4gICAgICBsZXQgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB0aGlzLnN0eWxlO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBjb250ZW50LnN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUuc2V0UHJvcGVydHkoZW50cnksIFJlZmxlY3QuZ2V0KGNvbnRlbnQuc3R5bGUsIGVudHJ5KSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY29udGVudC5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXgzeDMgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHsgdHJhbnNsYXRpb246IHt9LCBzY2FsaW5nOiB7fSwgcm90YXRpb246IDAgfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuXHJcbiAgICAgIG11dGF0b3JbXCJyb3RhdGlvblwiXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKF9tdXRhdG9yW1wicm90YXRpb25cIl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnRUZW1wbGF0ZS50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE1hdHJpeDR4NCBleHRlbmRzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBPYmplY3Qge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgcm90YXRpb246IHt9LCBzY2FsaW5nOiB7fSB9O1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgKDzGki5NdXRhdG9yPm11dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJNYXRyaXggQ2FsbGJhY2tcIik7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCB0ZXh0IGlucHV0IGZpZWxkIHdpdGggYSBsYWJlbCB0byBpdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE91dHB1dCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1vdXRwdXRcIiwgQ3VzdG9tRWxlbWVudE91dHB1dCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm91dHB1dFwiKTtcclxuICAgICAgb3V0cHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQob3V0cHV0KTtcclxuICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUodGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogRnVkZ2VDb3JlLkdlbmVyYWwpOiB2b2lkIHtcclxuICAgICAgbGV0IG91dHB1dDogSFRNTE91dHB1dEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJvdXRwdXRcIik7XHJcbiAgICAgIG91dHB1dC52YWx1ZSA9IF92YWx1ZSA/PyB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgICBpZiAoX3ZhbHVlKVxyXG4gICAgICAgIG91dHB1dC5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LmFkZChcInBsYWNlaG9sZGVyXCIpO1xyXG5cclxuICAgICAgLy8gdGhpcy5xdWVyeVNlbGVjdG9yKFwib3V0cHV0XCIpLnZhbHVlID0gX3ZhbHVlID8/IHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBkcm9wZG93biBtZW51IHRvIGRpc3BsYXkgZW51bXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFNlbGVjdCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zZWxlY3RcIiwgQ3VzdG9tRWxlbWVudFNlbGVjdCwgT2JqZWN0KTtcclxuICAgIHB1YmxpYyBjb250ZW50OiBPYmplY3Q7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcywgX2NvbnRlbnQ6IE9iamVjdCA9IHt9KSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZyB8IG51bWJlciA9IFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwga2V5KTtcclxuICAgICAgICBpZiAoUmVmbGVjdC5oYXModGhpcy5jb250ZW50LCB2YWx1ZSkgJiYgUmVmbGVjdC5nZXQodGhpcy5jb250ZW50LCB2YWx1ZSkgIT09IGtleSkgLy8gZmlsdGVyIG51bWJlciBrZXlzIG91dCBvZiBzaW1wbGUgZW51bSBcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnRleHQgPSBrZXk7XHJcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB0eXBlb2YgdmFsdWUpO1xyXG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKTtcclxuICAgICAgICBpZiAoZW50cnkudmFsdWUgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xyXG4gICAgICAgICAgZW50cnkuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3QuYWRkKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICBzZWxlY3QudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB8IG51bWJlciB7XHJcbiAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpO1xyXG4gICAgICBsZXQgdHlwZTogc3RyaW5nID0gc2VsZWN0Lm9wdGlvbnNbc2VsZWN0LnNlbGVjdGVkSW5kZXhdPy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpIHx8IFwic3RyaW5nXCI7XHJcbiAgICAgIHJldHVybiB0eXBlID09IFwibnVtYmVyXCIgPyBwYXJzZUZsb2F0KHNlbGVjdC52YWx1ZSkgOiBzZWxlY3QudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIikudmFsdWUgPSBfdmFsdWU7XHJcbiAgICAgIC8vIHRoaXMudmFsdWUgPSBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBBbiBpbnRlcmFjdGl2ZSBudW1iZXIgc3RlcHBlciB3aXRoIGV4cG9uZW50aWFsIGRpc3BsYXkgYW5kIGNvbXBsZXggaGFuZGxpbmcgdXNpbmcga2V5Ym9hcmQgYW5kIG1vdXNlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTdGVwcGVyIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXN0ZXBwZXJcIiwgQ3VzdG9tRWxlbWVudFN0ZXBwZXIsIE51bWJlcik7XHJcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMgJiYgX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSlcclxuICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdChfYXR0cmlidXRlc1tcInZhbHVlXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4geyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IH0pO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcblxyXG4gICAgICBsZXQgc2lnbjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIHNpZ24udGV4dENvbnRlbnQgPSBcIitcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzaWduKTtcclxuICAgICAgZm9yIChsZXQgZXhwOiBudW1iZXIgPSAyOyBleHAgPiAtNDsgZXhwLS0pIHtcclxuICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IG5ldyBDdXN0b21FbGVtZW50RGlnaXQoKTtcclxuICAgICAgICBkaWdpdC5zZXRBdHRyaWJ1dGUoXCJleHBcIiwgZXhwLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZGlnaXQpO1xyXG4gICAgICAgIGlmIChleHAgPT0gMClcclxuICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICs9IFwiLlwiO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MICs9IFwiZVwiO1xyXG5cclxuICAgICAgbGV0IGV4cDogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIGV4cC50ZXh0Q29udGVudCA9IFwiKzBcIjtcclxuICAgICAgZXhwLnRhYkluZGV4ID0gLTE7XHJcbiAgICAgIGV4cC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiZXhwXCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGV4cCk7XHJcblxyXG5cclxuICAgICAgLy8gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kSW5wdXQpO1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkJMVVIsIHRoaXMuaG5kSW5wdXQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlLS9BY3RpdmF0ZXMgdGFiYmluZyBmb3IgdGhlIGlubmVyIGRpZ2l0c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGVJbm5lclRhYnMoX29uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gX29uID8gMCA6IC0xO1xyXG5cclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG4gICAgICBzcGFuc1sxXS50YWJJbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgbGV0IGRpZ2l0czogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50RGlnaXQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIik7XHJcbiAgICAgIGZvciAobGV0IGRpZ2l0IG9mIGRpZ2l0cylcclxuICAgICAgICBkaWdpdC50YWJJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMvQ2xvc2VzIGEgc3RhbmRhcmQgbnVtYmVyIGlucHV0IGZvciB0eXBpbmcgdGhlIHZhbHVlIGF0IG9uY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9wZW5JbnB1dChfb3BlbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKF9vcGVuKSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgaXRzIHZhbHVlIGFuZCBkaXNwbGF5cyBpdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGlmIChfdmFsdWUgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgXHJcbiAgICAgIHRoaXMudmFsdWUgPSBfdmFsdWU7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgbWFudGlzc2EgYW5kIGV4cG9uZW50IHNlcGFyYXRlbHkgYXMgYW4gYXJyYXkgb2YgdHdvIG1lbWJlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTogbnVtYmVyW10ge1xyXG4gICAgICBsZXQgcHJlYzogc3RyaW5nID0gdGhpcy52YWx1ZS50b0V4cG9uZW50aWFsKDYpO1xyXG4gICAgICBsZXQgZXhwOiBudW1iZXIgPSBwYXJzZUludChwcmVjLnNwbGl0KFwiZVwiKVsxXSk7XHJcbiAgICAgIGxldCBleHAzOiBudW1iZXIgPSBNYXRoLnRydW5jKGV4cCAvIDMpO1xyXG4gICAgICBsZXQgbWFudGlzc2E6IG51bWJlciA9IHRoaXMudmFsdWUgLyBNYXRoLnBvdygxMCwgZXhwMyAqIDMpO1xyXG4gICAgICBtYW50aXNzYSA9IE1hdGgucm91bmQobWFudGlzc2EgKiAxMDAwKSAvIDEwMDA7XHJcbiAgICAgIHJldHVybiBbbWFudGlzc2EsIGV4cDMgKiAzXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGlzIHZhbHVlIGFzIGEgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBdOiBudW1iZXJbXSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG4gICAgICBsZXQgcHJlZml4TWFudGlzc2E6IHN0cmluZyA9IChtYW50aXNzYSA8IDApID8gXCJcIiA6IFwiK1wiO1xyXG4gICAgICBsZXQgcHJlZml4RXhwOiBzdHJpbmcgPSAoZXhwIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIHJldHVybiBwcmVmaXhNYW50aXNzYSArIG1hbnRpc3NhLnRvRml4ZWQoMykgKyBcImVcIiArIHByZWZpeEV4cCArIGV4cDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlzIHRoaXMgdmFsdWUgYnkgc2V0dGluZyB0aGUgY29udGVudHMgb2YgdGhlIGRpZ2l0cyBhbmQgdGhlIGV4cG9uZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZGlzcGxheSgpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZ2l0czogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50RGlnaXQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIik7XHJcbiAgICAgIGxldCBzcGFuczogTm9kZUxpc3RPZjxIVE1MU3BhbkVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuXHJcbiAgICAgIGlmICghaXNGaW5pdGUodGhpcy52YWx1ZSkpIHtcclxuICAgICAgICBmb3IgKGxldCBwb3M6IG51bWJlciA9IDA7IHBvcyA8IGRpZ2l0cy5sZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IGRpZ2l0c1s1IC0gcG9zXTtcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiICDiiJ4gICBcIls1IC0gcG9zXTtcclxuICAgICAgICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gXCIgIFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IHN0cmluZ1tdID0gdGhpcy50b1N0cmluZygpLnNwbGl0KFwiZVwiKTtcclxuICAgICAgc3BhbnNbMF0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlIDwgMCA/IFwiLVwiIDogXCIrXCI7XHJcbiAgICAgIHNwYW5zWzFdLnRleHRDb250ZW50ID0gZXhwO1xyXG5cclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgIG1hbnRpc3NhID0gbWFudGlzc2EucmVwbGFjZShcIi5cIiwgXCJcIik7XHJcbiAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICBsZXQgZGlnaXQ6IEN1c3RvbUVsZW1lbnREaWdpdCA9IGRpZ2l0c1s1IC0gcG9zXTtcclxuICAgICAgICBpZiAocG9zIDwgbWFudGlzc2EubGVuZ3RoKSB7XHJcbiAgICAgICAgICBsZXQgY2hhcjogc3RyaW5nID0gbWFudGlzc2EuY2hhckF0KG1hbnRpc3NhLmxlbmd0aCAtIDEgLSBwb3MpO1xyXG4gICAgICAgICAgZGlnaXQudGV4dENvbnRlbnQgPSBjaGFyO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCImbmJzcDtcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFuZGxlIGtleWJvYXJkIGlucHV0IG9uIHRoaXMgZWxlbWVudCBhbmQgaXRzIGRpZ2l0c1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGFjdGl2ZTogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGxldCBudW1FbnRlcmVkOiBudW1iZXIgPSBfZXZlbnQua2V5LmNoYXJDb2RlQXQoMCkgLSA0ODtcclxuXHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIC8vIGlmIGZvY3VzIGlzIG9uIHN0ZXBwZXIsIGVudGVyIGl0IGFuZCBmb2N1cyBkaWdpdFxyXG4gICAgICBpZiAoYWN0aXZlID09IHRoaXMpIHtcclxuICAgICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRU5URVI6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnModHJ1ZSk7XHJcbiAgICAgICAgICAgICg8SFRNTEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2UtZGlnaXRcIilbMl0pLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgobnVtRW50ZXJlZCA+PSAwICYmIG51bUVudGVyZWQgPD0gOSkgfHwgX2V2ZW50LmtleSA9PSBcIi1cIiB8fCBfZXZlbnQua2V5ID09IFwiK1wiKSB7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgIC8vIF9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpbnB1dCBmaWVsZCBvdmVybGF5IGlzIGFjdGl2ZVxyXG4gICAgICBpZiAoYWN0aXZlLmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGlmIChfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUiB8fCBfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKSB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gTnVtYmVyKCg8SFRNTElucHV0RWxlbWVudD5hY3RpdmUpLnZhbHVlKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobnVtRW50ZXJlZCA+PSAwICYmIG51bUVudGVyZWQgPD0gOSkge1xyXG4gICAgICAgIGxldCBkaWZmZXJlbmNlOiBudW1iZXIgPSBudW1FbnRlcmVkIC0gTnVtYmVyKGFjdGl2ZS50ZXh0Q29udGVudCkgKiAodGhpcy52YWx1ZSA8IDAgPyAtMSA6IDEpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZChkaWZmZXJlbmNlKTtcclxuXHJcbiAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmFjdGl2ZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmtleSA9PSBcIi1cIiB8fCBfZXZlbnQua2V5ID09IFwiK1wiKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IChfZXZlbnQua2V5ID09IFwiLVwiID8gLTEgOiAxKSAqIE1hdGguYWJzKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5UQUJVTEFUT1IpXHJcbiAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoLTEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZCgrMSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICAoPEhUTUxFbGVtZW50PmFjdGl2ZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmFjdGl2ZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVI6XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dCh0cnVlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFdoZWVsID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgY2hhbmdlOiBudW1iZXIgPSBfZXZlbnQuZGVsdGFZIDwgMCA/ICsxIDogLTE7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZChjaGFuZ2UpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5vcGVuSW5wdXQoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgY2hhbmdlRGlnaXRGb2N1c3NlZChfYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZ2l0OiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMgfHwgIXRoaXMuY29udGFpbnMoZGlnaXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9hbW91bnQgPSBNYXRoLnJvdW5kKF9hbW91bnQpO1xyXG4gICAgICBpZiAoX2Ftb3VudCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJbbmFtZT1leHBdXCIpKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy52YWx1ZSk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSB0aGlzLnZhbHVlICogTWF0aC5wb3coMTAsIF9hbW91bnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUodmFsdWUpKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOyBcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBleHBEaWdpdDogbnVtYmVyID0gcGFyc2VJbnQoZGlnaXQuZ2V0QXR0cmlidXRlKFwiZXhwXCIpKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZSAobWFudGlzc2Egbm90IHVzZWQpXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cFZhbHVlXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuXHJcbiAgICAgIGxldCBwcmV2OiBudW1iZXIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlICs9IF9hbW91bnQgKiBNYXRoLnBvdygxMCwgZXhwRGlnaXQgKyBleHBWYWx1ZSk7XHJcbiAgICAgIC8vIHdvcmthcm91bmQgcHJlY2lzaW9uIHByb2JsZW1zIG9mIGphdmFzY3JpcHRcclxuICAgICAgaWYgKE1hdGguYWJzKHByZXYgLyB0aGlzLnZhbHVlKSA+IDEwMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcblxyXG5cclxuICAgICAgbGV0IGV4cE5ldzogbnVtYmVyO1xyXG4gICAgICBbbWFudGlzc2EsIGV4cE5ld10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobWFudGlzc2EpO1xyXG4gICAgICB0aGlzLnNoaWZ0Rm9jdXMoZXhwTmV3IC0gZXhwVmFsdWUpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNoaWZ0Rm9jdXMoX25EaWdpdHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc2hpZnRGb2N1czogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChfbkRpZ2l0cykge1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspXHJcbiAgICAgICAgICBpZiAoX25EaWdpdHMgPiAwKVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+c2hpZnRGb2N1cykuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50VGV4dElucHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXRleHRpbnB1dFwiLCBDdXN0b21FbGVtZW50VGV4dElucHV0LCBTdHJpbmcpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBEZXRhaWxzIGV4dGVuZHMgSFRNTERldGFpbHNFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2xlZ2VuZDogc3RyaW5nID0gXCJcIiwgX3R5cGU6IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSByZW1vdmVkIGFmdGVyIGNoYW5naW5nIGFuaW1hdGlvbiBzdHJ1Y3R1cmUgdG8gbG9vayBtb3JlIGxpa2UgYSBtdXRhdG9yXHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwia2V5XCIsIF9sZWdlbmQpO1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9sZWdlbmQpO1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgICB0aGlzLm9wZW4gPSB0cnVlO1xyXG4gICAgICBsZXQgbGJsU3VtbWFyeTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcclxuICAgICAgbGJsU3VtbWFyeS50ZXh0Q29udGVudCA9IF9sZWdlbmQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobGJsU3VtbWFyeSk7XHJcblxyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGVudCk7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1NFVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UT0dHTEUsIHRoaXMuaG5kVG9nZ2xlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGdldCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAvLyByZXR1cm4gdGhpcy5leHBhbmRlci5jaGVja2VkO1xyXG4gICAgICByZXR1cm4gdGhpcy5vcGVuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb250ZW50KF9jb250ZW50OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlcGxhY2VDaGlsZChfY29udGVudCwgdGhpcy5jb250ZW50KTtcclxuICAgICAgdGhpcy5jb250ZW50ID0gX2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIC8vIHRoaXMuZXhwYW5kZXIuY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMub3BlbiA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaG5kVG9nZ2xlKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kVG9nZ2xlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQodGhpcy5pc0V4cGFuZGVkID8gRVZFTlQuRVhQQU5EIDogRVZFTlQuQ09MTEFQU0UsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAocHJldmlvdXMgJiYgcHJldmlvdXMudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBsZXQgc2V0czogTm9kZUxpc3RPZjxIVE1MRGV0YWlsc0VsZW1lbnQ+ID0gcHJldmlvdXMucXVlcnlTZWxlY3RvckFsbChcImRldGFpbHNcIik7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSBzZXRzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgICAgZG8geyAvLyBmb2N1cyB0aGUgbGFzdCB2aXNpYmxlIHNldFxyXG4gICAgICAgICAgICAgICAgc2V0c1stLWldLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgfSB3aGlsZSAoIXNldHNbaV0ub2Zmc2V0UGFyZW50KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19TRVQ6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnRhcmdldCAhPSB0aGlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAvLyBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5JTlNFUlQsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgIG5leHQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgbmV4dCA9IDxIVE1MRWxlbWVudD5uZXh0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgfSB3aGlsZSAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpO1xyXG5cclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAvLyBuZXh0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzID0gPEhUTUxFbGVtZW50PnByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICB9IHdoaWxlIChwcmV2aW91cyAmJiAhKHByZXZpb3VzIGluc3RhbmNlb2YgRGV0YWlscykpO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2aW91cylcclxuICAgICAgICAgICAgaWYgKCg8RGV0YWlscz5wcmV2aW91cykuaXNFeHBhbmRlZClcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfU0VULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIFRPRE86IHVzZSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyP1xyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVpLWRldGFpbHNcIiwgRGV0YWlscywgeyBleHRlbmRzOiBcImRldGFpbHNcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBEZXRhaWxzQXJyYXkgZXh0ZW5kcyBEZXRhaWxzIHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2xlZ2VuZDogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKF9sZWdlbmQsIFwiQXJyYXlcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRlbnQoX2NvbnRlbnQ6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLnNldENvbnRlbnQoX2NvbnRlbnQpO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4pIHtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGNoaWxkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvcltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxDdXN0b21FbGVtZW50Pikge1xyXG4gICAgICAgIG11dGF0b3IucHVzaChjaGlsZC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRFdmVudExpc3RlbmVycyhfY2hpbGQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIF9jaGlsZC5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleVNwZWNpYWwpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlNFUlQsIHRoaXMuaG5kSW5zZXJ0KTtcclxuICAgICAgX2NoaWxkLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYXJyYW5nZShfZm9jdXM6IG51bWJlciA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IG51bWJlcltdID0gW107XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbikge1xyXG4gICAgICAgIHNlcXVlbmNlLnB1c2gocGFyc2VJbnQoY2hpbGQuZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNldEZvY3VzKF9mb2N1cyk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVBUlJBTkdFX0FSUkFZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBrZXk6IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpLCBzZXF1ZW5jZTogc2VxdWVuY2UgfSB9KSk7XHJcblxyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFwia2V5XCIsIGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGlmIChjaGlsZC5zZXRMYWJlbClcclxuICAgICAgICAgIGNoaWxkLnNldExhYmVsKGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNoaWxkLnRhYkluZGV4KTtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULk1VVEFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZvY3VzKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGlmIChfZm9jdXMgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2ZvY3VzID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oX2ZvY3VzLCB0aGlzLmNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMSkpO1xyXG4gICAgICBsZXQgY2hpbGQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMuY29udGVudC5jaGlsZHJlbltfZm9jdXNdO1xyXG4gICAgICBjaGlsZD8uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdTdGFydCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQ7IFxyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbmRleFwiLCBrZXlEcmFnKTtcclxuICAgICAgY29uc29sZS5sb2coa2V5RHJhZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBkcm9wOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgbGV0IGtleURyb3A6IHN0cmluZyA9IGRyb3AuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5kZXhcIik7XHJcbiAgICAgIGxldCBkcmFnOiBIVE1MRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5RHJhZ31cIl1gKTtcclxuICAgICAgbGV0IGxhYmVsRHJhZzogc3RyaW5nID0gZHJhZy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHJcbiAgICAgIGxldCBwb3NpdGlvbjogSW5zZXJ0UG9zaXRpb24gPSBrZXlEcmFnID4ga2V5RHJvcCA/IFwiYmVmb3JlYmVnaW5cIiA6IFwiYWZ0ZXJlbmRcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyYWcgPSA8SFRNTEVsZW1lbnQ+ZHJhZy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIGRyYWcuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgbGFiZWxEcmFnKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWcpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZHJvcC5pbnNlcnRBZGphY2VudEVsZW1lbnQocG9zaXRpb24sIGRyYWcpO1xyXG5cclxuICAgICAgdGhpcy5yZWFycmFuZ2UoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhkcmFnKTtcclxuICAgICAgZHJhZy5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnNlcnQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImhuZEluc2VydFwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlTcGVjaWFsID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgaXRlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAvLyBvbmx5IHdvcmsgb24gaXRlbXMgb2YgbGlzdCwgbm90IHRoZWlyIGNoaWxkcmVuXHJcbiAgICAgIGlmICgoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpICE9IGl0ZW0gJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBudW1iZXIgPSBwYXJzZUludChpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgbGV0IHNpYmxpbmc6IEhUTUxFbGVtZW50ID0gaXRlbTtcclxuICAgICAgbGV0IGluc2VydDogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKGZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgLy8gICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc0FycmF5XCIpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoLS1mb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmViZWdpblwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoLS1mb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmFsdEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEZvY3VzKCsrZm9jdXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgaW5zZXJ0ID0gPEhUTUxFbGVtZW50Pml0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBpbnNlcnQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoaW5zZXJ0KTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzaWJsaW5nID0gPEhUTUxFbGVtZW50Pml0ZW0ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoKytmb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpIHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1saXN0XCIsIERldGFpbHNBcnJheSwgeyBleHRlbmRzOiBcImRldGFpbHNcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCBvciBub24tbW9kYWwgZGlhbG9nIHdpdGggYW4gaW50ZXJmYWNlIGZvciB0aGUgZ2l2ZW4gbXV0YXRvci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZG9tOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0IHRoZSBkaWFsb2cgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIGNhbGwgdG8gYWN0aW9uIGFuZCBsYWJlbHMgZm9yIHRoZSBjYW5jZWwtIGFuZCBvay1idXR0b25cclxuICAgICAqIFVzZSBgYXdhaXRgIG9uIGNhbGwsIHRvIGNvbnRpbnVlIGFmdGVyIHRoZSB1c2VyIGhhcyBwcmVzc2VkIG9uZSBvZiB0aGUgYnV0dG9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwcm9tcHQoX2RhdGE6IMaSLk11dGFibGUgfCDGki5NdXRhdG9yIHwgT2JqZWN0LCBfbW9kYWw6IGJvb2xlYW4gPSB0cnVlLCBfaGVhZDogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfY2FsbFRvQWN0aW9uOiBzdHJpbmcgPSBcIkluc3RydWN0aW9uXCIsIF9vazogc3RyaW5nID0gXCJPS1wiLCBfY2FuY2VsOiBzdHJpbmcgPSBcIkNhbmNlbFwiKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIERpYWxvZy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICBEaWFsb2cuZG9tLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWQgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgIGlmIChfZGF0YSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfZGF0YSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9kYXRhKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF9jYWxsVG9BY3Rpb24gKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bkNhbmNlbDogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5DYW5jZWwuaW5uZXJIVE1MID0gX2NhbmNlbDtcclxuICAgIGlmIChfY2FuY2VsICE9IFwiXCIpXHJcbiAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5DYW5jZWwpO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIGlmIChfbW9kYWwpXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgRGlhbG9nLmRvbS5zaG93TW9kYWwoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvdygpO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChfcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCBobmRCdXR0b246IChfZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGJ0bkNhbmNlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGJ0bk9rLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBobmRCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gYnRuT2spXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGNvbnRlbnQsIF9kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcclxuICAgICAgICAgICAgICDGki5EZWJ1Zy5pbmZvKF9lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBEaWFsb2cuZG9tLmNsb3NlKCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICAgICAgX3Jlc29sdmUoX2V2ZW50LnRhcmdldCA9PSBidG5Payk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCBobmRCdXR0b24pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAgIC8qKlxyXG4gICAgICogPHNlbGVjdD48b3B0aW9uPkhhbGxvPC9vcHRpb24+PC9zZWxlY3Q+XHJcbiAgICAgKi9cclxuICAgIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTXVsdGlMZXZlbE1lbnVNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBidWlsZEZyb21TaWduYXR1cmUoX3NpZ25hdHVyZTogc3RyaW5nLCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCB7fTtcclxuICAgICAgICAgICAgbGV0IHNpZ25hdHVyZUxldmVsczogc3RyaW5nW10gPSBfc2lnbmF0dXJlLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgaWYgKHNpZ25hdHVyZUxldmVscy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3ViU2lnbmF0dXJlOiBzdHJpbmcgPSBzaWduYXR1cmVMZXZlbHNbMV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAyOyBpIDwgc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ViU2lnbmF0dXJlID0gc3ViU2lnbmF0dXJlICsgXCIuXCIgKyBzaWduYXR1cmVMZXZlbHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlLCA8xpIuTXV0YXRvcj5tdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHNpZ25hdHVyZUxldmVsc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCB3YXJuaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBXYXJuaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBhIHdhcm5pbmcgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIHdhcm5pbmcgdGV4dCBhbmQgb2sgYnV0dGVuIHRleHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheShfZXJyb3JzOiBzdHJpbmdbXSA9IFtdLCBfaGVhZGxpbmU6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX3dhcm5pbmc6IHN0cmluZyA9IFwiV2FybmluZ1wiLCBfb2s6IHN0cmluZyA9IFwiT0tcIik6IHZvaWQge1xyXG4gICAgICBsZXQgd2FybmluZzogSFRNTERpYWxvZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdhcm5pbmcpO1xyXG4gICAgICB3YXJuaW5nLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWRsaW5lICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBjb250ZW50LmlubmVyVGV4dCA9IF9lcnJvcnMuam9pbihcIlxcblwiKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfd2FybmluZyArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBidG5Pay5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdhcm5pbmcuY2xvc2UoKTtcclxuICAgICAgICB3YXJuaW5nLnJlbW92ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB3YXJuaW5nLnNob3dNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19cyB0byByZXByZXNlbnQgYSBicmFuY2ggaW4gYSB0cmVlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbVRyZWVMaXN0PFQ+IGV4dGVuZHMgSFRNTFVMaXN0RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogQ3VzdG9tVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBDdXN0b21UcmVlQ29udHJvbGxlcjxUPiwgX2l0ZW1zOiBDdXN0b21UcmVlSXRlbTxUPltdID0gW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoX2l0ZW1zKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRocyB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRocyBpbmNsdWRlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9wYXRoczogVFtdW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgcGF0aCBvZiBfcGF0aHMpXHJcbiAgICAgICAgdGhpcy5zaG93KHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aCB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRoIGluY2x1ZGVzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvdyhfcGF0aDogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBjdXJyZW50VHJlZTogQ3VzdG9tVHJlZUxpc3Q8VD4gPSB0aGlzO1xyXG5cclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBfcGF0aCkge1xyXG4gICAgICAgIGxldCBpdGVtOiBDdXN0b21UcmVlSXRlbTxUPiA9IGN1cnJlbnRUcmVlLmZpbmRJdGVtKGRhdGEpO1xyXG4gICAgICAgIGlmICghaXRlbSlcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICoge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgcmVmZXJlbmNpbmcgdGhlIHNhbWUgb2JqZWN0IHJlbWFpbiBpbiB0aGUgbGlzdCwgbmV3IGl0ZW1zIGdldCBhZGRlZCBpbiB0aGUgb3JkZXIgb2YgYXBwZWFyYW5jZSwgb2Jzb2xldGUgb25lcyBhcmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSBfdHJlZSBBIGxpc3QgdG8gc3luYyB0aGlzIHdpdGhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3RydWN0dXJlKF90cmVlOiBDdXN0b21UcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfdHJlZS5nZXRJdGVtcygpKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kOiBDdXN0b21UcmVlSXRlbTxUPiA9IHRoaXMuZmluZEl0ZW0oaXRlbS5kYXRhKTtcclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgIGZvdW5kLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBmb3VuZC5oYXNDaGlsZHJlbiA9IGl0ZW0uaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICBpZiAoIWZvdW5kLmhhc0NoaWxkcmVuKVxyXG4gICAgICAgICAgICBmb3VuZC5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgaXRlbXMucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19IG9mIHRoaXMgbGlzdCByZWZlcmVuY2luZyB0aGUgZ2l2ZW4gb2JqZWN0IG9yIG51bGwsIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmluZEl0ZW0oX2RhdGE6IFQpOiBDdXN0b21UcmVlSXRlbTxUPiB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscygoPEN1c3RvbVRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEsIF9kYXRhKSlcclxuICAgICAgICAgIHJldHVybiA8Q3VzdG9tVHJlZUl0ZW08VD4+aXRlbTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4ge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogQ3VzdG9tVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIHtAbGluayBDdXN0b21UcmVlSXRlbX1zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRJdGVtcygpOiBDdXN0b21UcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIDxDdXN0b21UcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuZmlsdGVyKF9jaGlsZCA9PiBfY2hpbGQgaW5zdGFuY2VvZiBDdXN0b21UcmVlSXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFTdGFydCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhRW5kKSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgZW5kKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShfZGF0YTogVFtdKTogQ3VzdG9tVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkZWxldGVkOiBDdXN0b21UcmVlSXRlbTxUPltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSkge1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBDdXN0b21UcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoX2RhdGEsIGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFsbCBleHBhbmRlZCB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19cyB0aGF0IGFyZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXhwYW5kZWQoKTogQ3VzdG9tVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiBbLi4udGhpc10uZmlsdGVyKF9pdGVtID0+IF9pdGVtLmV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPEN1c3RvbVRyZWVJdGVtPFQ+PiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB5aWVsZCBpdGVtc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVCA9ICg8Q3VzdG9tVHJlZUl0ZW08VD4+dGhpcy5wYXJlbnRFbGVtZW50KS5kYXRhO1xyXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgIXRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcywgdGFyZ2V0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEl0ZW06IEN1c3RvbVRyZWVJdGVtPFQ+ID0gPEN1c3RvbVRyZWVJdGVtPFQ+Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKF90YXJnZXQgPT4gX3RhcmdldCBpbnN0YW5jZW9mIEN1c3RvbVRyZWVJdGVtKTtcclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmluY2x1ZGVzKHRhcmdldEl0ZW0pKSB7XHJcbiAgICAgICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRhcmdldEl0ZW0uY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgIGxldCBhZGRCZWZvcmU6IGJvb2xlYW4gPSBfZXZlbnQuY2xpZW50WSA8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgbGV0IHNpYmxpbmc6IEVsZW1lbnQgPSBhZGRCZWZvcmUgPyB0YXJnZXRJdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiB0YXJnZXRJdGVtLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nICE9IHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcilcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSlcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmJlZm9yZSh0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5hZnRlcih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLmlzQ29ubmVjdGVkID9cclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmluZGV4T2YodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKSA6XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gbnVsbDtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IHRhcmdldDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC1jdXN0b20tdHJlZS1saXN0XCIsIEN1c3RvbVRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbVRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHtAbGluayBDdXN0b21UcmVlTGlzdH0gdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIGEgdHJlZSBjb250cm9sICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogdHJlZSA8dWw+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiDilJQgdHJlZUxpc3QgPHVsPlxyXG4gICAqIOKUgiAgIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCICAg4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21UcmVlPFQ+IGV4dGVuZHMgQ3VzdG9tVHJlZUxpc3Q8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogQ3VzdG9tVHJlZUNvbnRyb2xsZXI8VD4sIF9yb290OiBUKSB7XHJcbiAgICAgIHN1cGVyKF9jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGxldCByb290OiBDdXN0b21UcmVlSXRlbTxUPiA9IG5ldyBDdXN0b21UcmVlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIF9yb290KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyb290KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXhwYW5kKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wLCB0cnVlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfTEVBVkUsIHRoaXMuaG5kRHJhZ0xlYXZlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1cyBvciBudWxsIGlmIG5vbmUgaXMgZm9jdXNzZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEZvY3Vzc2VkKCk6IFQge1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSA8Q3VzdG9tVHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxDdXN0b21UcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgaWYgKGZvdW5kID4gLTEpXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zW2ZvdW5kXS5kYXRhO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIHRoZSB3aG9sZSB0cmVlIHRvIHN5bmNocm9uaXplIHdpdGggdGhlIGRhdGEgdGhlIHRyZWUgaXMgYmFzZWQgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKGl0ZW0uZGF0YSkpO1xyXG4gICAgICAgIGl0ZW0uZ2V0QnJhbmNoKCkucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihpdGVtLmRhdGEpKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBjaGlsZHJlbiB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGF0IHRoZSBnaXZlbiBpbmRleC4gSWYgbm8gaW5kZXggaXMgZ2l2ZW4sIHRoZSBjaGlsZHJlbiBhcmUgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgLy8gaWYgZHJvcCB0YXJnZXQgaW5jbHVkZWQgaW4gY2hpbGRyZW4gLT4gcmVmdXNlXHJcbiAgICAgIGlmIChfY2hpbGRyZW4uaW5kZXhPZihfdGFyZ2V0KSA+IC0xKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGFkZCBvbmx5IHRoZSBvYmplY3RzIHRoZSBhZGRDaGlsZHJlbi1tZXRob2Qgb2YgdGhlIGNvbnRyb2xsZXIgcmV0dXJuc1xyXG4gICAgICBsZXQgbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKF9jaGlsZHJlbiwgX3RhcmdldCwgX2luZGV4KTtcclxuICAgICAgaWYgKCFtb3ZlIHx8IG1vdmUubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBUID0gdGhpcy5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICAvLyBUT0RPOiBkb24ndCwgd2hlbiBjb3B5aW5nIG9yIGNvbWluZyBmcm9tIGFub3RoZXIgc291cmNlXHJcbiAgICAgIHRoaXMuZGVsZXRlKG1vdmUpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldERhdGE6IFQgPSA8VD5fdGFyZ2V0O1xyXG4gICAgICBsZXQgdGFyZ2V0SXRlbTogQ3VzdG9tVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRWaXNpYmxlKHRhcmdldERhdGEpO1xyXG5cclxuICAgICAgbGV0IGJyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSB0aGlzLmNyZWF0ZUJyYW5jaCh0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4odGFyZ2V0RGF0YSkpO1xyXG4gICAgICBsZXQgb2xkOiBDdXN0b21UcmVlTGlzdDxUPiA9IHRhcmdldEl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIHRhcmdldEl0ZW0uaGFzQ2hpbGRyZW4gPSB0cnVlO1xyXG4gICAgICBpZiAob2xkKVxyXG4gICAgICAgIG9sZC5yZXN0cnVjdHVyZShicmFuY2gpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGFyZ2V0SXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmZpbmRWaXNpYmxlKGZvY3VzKT8uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCcmFuY2goX2RhdGE6IFRbXSk6IEN1c3RvbVRyZWVMaXN0PFQ+IHtcclxuICAgICAgbGV0IGJyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSBuZXcgQ3VzdG9tVHJlZUxpc3Q8VD4odGhpcy5jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgQ3VzdG9tVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGxiYWNrIC8gRXZlbnRoYW5kbGVyIGluIFRyZWVcclxuICAgIHByaXZhdGUgaG5kU2VsZWN0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGV0YWlsOiB7IGRhdGE6IE9iamVjdDsgaW50ZXJ2YWw6IGJvb2xlYW47IGFkZGl0aXZlOiBib29sZWFuIH0gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsO1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uaW5kZXhPZig8VD5kZXRhaWwuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGV0YWlsLmludGVydmFsKSB7XHJcbiAgICAgICAgbGV0IGRhdGFTdGFydDogVCA9IDxUPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgbGV0IGRhdGFFbmQ6IFQgPSA8VD5kZXRhaWwuZGF0YTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChkYXRhU3RhcnQsIGRhdGFFbmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID49IDAgJiYgZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5wdXNoKDxUPmRldGFpbC5kYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gW107XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnTGVhdmUgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlbGF0ZWRUYXJnZXQ6IEV2ZW50VGFyZ2V0ID0gX2V2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcbiAgICAgIGlmIChyZWxhdGVkVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldCkgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldC5vZmZzZXRQYXJlbnQpKSAvLyBvZmZzZXQgcGFyZW50IGlzIGZvciB3ZWlyZCAoaW52aXNpYmxlKSBkaXZzIHdoaWNoIGFyZSBwbGFjZWQgb3ZlciBpbnB1dCBlbGVtZW50cyBhbmQgdHJpZ2dlciBsZWF2ZSBldmVudHMuLi4gXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEN1c3RvbVRyZWVJdGVtPFQ+ID0gPEN1c3RvbVRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuICAgICAgdGhpcy5kZWxldGUocmVtb3ZlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DT1BZOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcywgdGFyZ2V0LmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DVVQ6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weVBhc3RlLnNvdXJjZXMgPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuY29weShbLi4udGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbl0pO1xyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZSh0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlKGN1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogQ3VzdG9tVHJlZUl0ZW08VD5bXSA9IDxDdXN0b21UcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YodGFyZ2V0KTtcclxuICAgICAgaWYgKGluZGV4IDwgMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5ICYmIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ubGVuZ3RoID09IDApXHJcbiAgICAgICAgdGFyZ2V0LnNlbGVjdCh0cnVlKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBpZiAoKytpbmRleCA8IGl0ZW1zLmxlbmd0aClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgaWYgKC0taW5kZXggPj0gMClcclxuICAgICAgICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgKDxDdXN0b21UcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KS5zZWxlY3QodHJ1ZSk7XHJcbiAgICAgIGVsc2UgaWYgKCFfZXZlbnQuY3RybEtleSlcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtY3VzdG9tLXRyZWVcIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5DdXN0b21UcmVlLCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSB7QGxpbmsgQ3VzdG9tVHJlZX0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUge0BsaW5rIEN1c3RvbVRyZWV9IGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+IHtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBzZWxlY3RlZCBvYmplY3RzLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBzZWxlY3Rpb24gc2hvdWxkIGFsc28gb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFRbXSA9IFtdO1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIG9iamVjdHMgYmVpbmcgZHJhZ2dlZCwgYW5kIG9iamVjdHMgdG8gZHJvcCBvbi4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgZHJhZyZkcm9wIHNob3VsZCBvcGVyYXRlIG91dHNpZGUgb2YgdHJlZSAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wOiB7IHNvdXJjZXM6IFRbXTsgdGFyZ2V0OiBUOyBhdD86IG51bWJlciB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IFRbXTsgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICAvKiogVXNlZCBieSB0aGUgdHJlZSB0byBpbmRpY2F0ZSB0aGUgZHJvcCBwb3NpdGlvbiB3aGlsZSBkcmFnZ2luZyAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wSW5kaWNhdG9yOiBIVE1MSFJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgZHJhZ2dhYmxlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkcmFnZ2FibGUoX29iamVjdDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiB0d28gb2JqZWN0cyBvZiBhcmUgZXF1YWwuIERlZmF1bHQgaXMgX2EgPT0gX2IuIE92ZXJyaWRlIGZvciBtb3JlIGNvbXBsZXggY29tcGFyaXNvbnMuIFxyXG4gICAgICogVXNlZnVsIHdoZW4gdGhlIHVuZGVybHlpbmcgZGF0YSBpcyB2b2xhdGlsZSBhbmQgY2hhbmdlcyBpZGVudGl0eSB3aGlsZSBzdGF5aW5nIHRoZSBzYW1lLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzKF9hOiBULCBfYjogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2EgPT0gX2I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdmVycmlkZSBpZiBzb21lIG9iamVjdHMgc2hvdWxkIG5vdCBiZSBhZGRhYmxlIHRvIG90aGVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2FuQWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQ3JlYXRlIGFuIEhUTUxFbGVtZW50IGZvciB0aGUgdHJlZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0LiBlLmcuIGFuIEhUTUxJbnB1dEVsZW1lbnQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFQpOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBsaXN0IGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgZm9yIGZ1cnRoZXIgc3R5bGluZyAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFByb2Nlc3MgdGhlIHByb3Bvc2VkIG5ldyB2YWx1ZS4gVGhlIGlkIG9mIHRoZSBodG1sIGVsZW1lbnQgb24gd2hpY2ggdGhlIGNoYW5nZSBvY2N1cmVkIGlzIHBhc3NlZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldFZhbHVlKF9vYmplY3Q6IFQsIF9lbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGhhcyBjaGlsZHJlbiB0aGF0IG11c3QgYmUgc2hvd24gd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGhhc0NoaWxkcmVuKF9vYmplY3Q6IFQpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdGhlIG9iamVjdCdzIGNoaWxkcmVuIHRvIHNob3cgd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENoaWxkcmVuKF9vYmplY3Q6IFQpOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUHJvY2VzcyB0aGUgbGlzdCBvZiBzb3VyY2Ugb2JqZWN0cyB0byBiZSBhZGRlZEFzQ2hpbGRyZW4gd2hlbiBkcm9wcGluZyBvciBwYXN0aW5nIG9udG8gdGhlIHRhcmdldCBpdGVtL29iamVjdCwgXHJcbiAgICAgKiByZXR1cm4gdGhlIGxpc3Qgb2Ygb2JqZWN0cyB0aGF0IHNob3VsZCB2aXNpYmx5IGJlY29tZSB0aGUgY2hpbGRyZW4gb2YgdGhlIHRhcmdldCBpdGVtL29iamVjdCBcclxuICAgICAqIEBwYXJhbSBfY2hpbGRyZW4gQSBsaXN0IG9mIG9iamVjdHMgdGhlIHRyZWUgdHJpZXMgdG8gYWRkIHRvIHRoZSBfdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0gX3RhcmdldCBUaGUgb2JqZWN0IHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW0gdGhlIGRyb3Agb2NjdXJzIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBhZGRDaGlsZHJlbihfc291cmNlczogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVtb3ZlIHRoZSBvYmplY3RzIHRvIGJlIGRlbGV0ZWQsIGUuZy4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLCBmcm9tIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgdHJlZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBDdXN0b21UcmVlSXRlbX0gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3Vzc2VkIFRoZSBvYmplY3QgY3VycmVudGx5IGhhdmluZyBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVsZXRlKF9mb2N1c3NlZDogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgY29waWVzIG9mIHRoZSBvYmplY3RzIGdpdmVuIGZvciBjb3B5ICYgcGFzdGVcclxuICAgICAqIEBwYXJhbSBfZm9jdXNzZWQgVGhlIG9iamVjdCBjdXJyZW50bHkgaGF2aW5nIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCAvKiBhc3luYyAqLyBjb3B5KF9vcmlnaW5hbHM6IFRbXSk6IFByb21pc2U8VFtdPjtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgbGktZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEge0BsaW5rIEN1c3RvbVRyZWVMaXN0fSB3aXRoIGEgY2hlY2tib3ggYW5kIGFuIEhUTUxFbGVtZW50IGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZyk7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWcpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZFJlbW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUsIHdoZW4gdGhpcyBpdGVtIGhhcyBhIHZpc2libGUgY2hlY2tib3ggaW4gZnJvbnQgdG8gZXhwYW5kIHRoZSBzdWJzZXF1ZW50IGJyYW5jaCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3Mgb3IgaGlkZXMgdGhlIGNoZWNrYm94IGZvciBleHBhbmRpbmcgdGhlIHN1YnNlcXVlbnQgYnJhbmNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgaGFzQ2hpbGRyZW4oX2hhczogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgPSBfaGFzID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgcmVwcmVzZW50aW5nIHRoZSBhdHRhY2hlZCB7QGxpbmsgZGF0YX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjb250ZW50KCk6IEhUTUxGaWVsZFNldEVsZW1lbnQge1xyXG4gICAgICByZXR1cm4gdGhpcy4jY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGlzIGl0ZW0gaXMgZXhwYW5kZWQsIHNob3dpbmcgaXQncyBjaGlsZHJlbiwgb3IgY2xvc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEJyYW5jaCgpICYmIHRoaXMuY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy4jY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIuY3JlYXRlQ29udGVudCh0aGlzLmRhdGEpKTtcclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmllcyB0byBleHBhbmRpbmcgdGhlIHtAbGluayBDdXN0b21UcmVlTGlzdH0gb2YgY2hpbGRyZW4sIGJ5IGRpc3BhdGNoaW5nIHtAbGluayBFVkVOVC5FWFBBTkR9LlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQge0BsaW5rIEN1c3RvbVRyZWVMaXN0fSBhbmQgYWRkIGl0IGFzIGJyYW5jaCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcblxyXG4gICAgICBpZiAoX2V4cGFuZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVYUEFORCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuXHJcbiAgICAgIHRoaXMuY2hlY2tib3guY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgICAgLy8gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxDdXN0b21UcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIHtAbGluayBDdXN0b21UcmVlTGlzdH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEJyYW5jaChfYnJhbmNoOiBDdXN0b21UcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG4gICAgICBpZiAoX2JyYW5jaClcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKF9icmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJyYW5jaCgpOiBDdXN0b21UcmVlTGlzdDxUPiB7XHJcbiAgICAgIHJldHVybiA8Q3VzdG9tVHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUge0BsaW5rIEVWRU5ULlNFTEVDVH0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBmcm9tIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUJyYW5jaCgpOiB2b2lkIHtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5nZXRCcmFuY2goKTtcclxuICAgICAgaWYgKCFjb250ZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5yZW1vdmVDaGlsZChjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5jaGVja2JveC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY2hlY2tib3gpO1xyXG4gICAgICB0aGlzLiNjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuI2NvbnRlbnQpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoIXRoaXMuI2NvbnRlbnQuZGlzYWJsZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gPEN1c3RvbVRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIC8vIFRPRE86IHJlcGFpciBhcnJvdyBrZXkgbmF2aWdhdGlvblxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICFjb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAoY29udGVudClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy4jY29udGVudC5lbGVtZW50cy5pdGVtKDApO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBlbGVtZW50Py5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERibENsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KF9ldmVudC5wYWdlWCwgX2V2ZW50LnBhZ2VZKTsgLy8gZGlzYWJsZWQgZWxlbWVudHMgZG9uJ3QgZGlzcGF0Y2ggY2xpY2sgZXZlbnRzLCBnZXQgdGhlIGVsZW1lbnQgbWFudWFsbHlcclxuICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIHRhcmdldC50eXBlID09IFwiY2hlY2tib3hcIikge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kKHRhcmdldC5jaGVja2VkKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCByZW5hbWVkOiBib29sZWFuID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnNldFZhbHVlKHRoaXMuZGF0YSwgdGFyZ2V0KTtcclxuXHJcbiAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG5cclxuICAgICAgaWYgKHJlbmFtZWQpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnU3RhcnQgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ3N0YXJ0XCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gW107XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbjtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gW3RoaXMuZGF0YV07XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiYWxsXCI7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksIDAsIDApO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIG1hcmsgYXMgYWxyZWFkeSBwcm9jZXNzZWQgYnkgdGhpcyB0cmVlIGl0ZW0gdG8gaWdub3JlIGl0IGluIGZ1cnRoZXIgcHJvcGFnYXRpb24gdGhyb3VnaCB0aGUgdHJlZVxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJkcmFnc3RhcnRcIiwgXCJkcmFnc3RhcnRcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZyA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRoaXMuI2NvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpKSB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUkFHX09WRVIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcywgdGhpcy5kYXRhKSkge1xyXG4gICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB0aGUgdmlld3MgbWlnaHQgbmVlZCB0byBrbm93IGFib3V0IHRoaXMgZXZlbnRcclxuICAgICAgLy8gaWYgKF9ldmVudC5jdXJyZW50VGFyZ2V0ID09IF9ldmVudC50YXJnZXQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJsaS1jdXN0b20tdHJlZS1pdGVtXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+Q3VzdG9tVHJlZUl0ZW0sIHsgZXh0ZW5kczogXCJsaVwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8vIFRPRE86IGR1cGxpY2F0ZWQgY29kZSBpbiBUYWJsZSBhbmQgVHJlZSwgbWF5IGJlIG9wdGltaXplZC4uLlxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFRBQkxFIHtcclxuICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGVkaXRhYmxlOiBib29sZWFuO1xyXG4gICAgc29ydGFibGU6IGJvb2xlYW47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYW5hZ2VzIGEgc29ydGFibGUgdGFibGUgb2YgZGF0YSBnaXZlbiBhcyBzaW1wbGUgYXJyYXkgb2YgZmxhdCBvYmplY3RzICAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIEtleTAgIEtleTEgS2V5MlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZUVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuICAgIHB1YmxpYyBkYXRhOiBUW107XHJcbiAgICBwdWJsaWMgaWNvbjogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVFtdLCBfaWNvbj86IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIHRoaXMuaWNvbiA9IF9pY29uO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwic29ydGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TT1JULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZFNvcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UQUJMRS5DSEFOR0UsIHRoaXMuaG5kU29ydCk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5DVVQsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgLy8gdHIgPSB0aGlzLmNyZWF0ZVJvdyhyb3csIGhlYWQpO1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgcm93KTtcclxuICAgICAgICAvLyBUT0RPOiBzZWUgaWYgaWNvbiBjb25zaWRlcmF0aW9uIHNob3VsZCBtb3ZlIHRvIFRhYmxlSXRlbVxyXG4gICAgICAgIGlmICh0aGlzLmljb24pXHJcbiAgICAgICAgICBpdGVtLnNldEF0dHJpYnV0ZShcImljb25cIiwgPHN0cmluZz5SZWZsZWN0LmdldChyb3csIHRoaXMuaWNvbikpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGluIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUYWJsZUl0ZW08VD5bXSA9IDxUYWJsZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxUYWJsZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFTdGFydClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFFbmQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IGVuZClcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhU3RhcnQsIF9kYXRhRW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhKTtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVIZWFkKF9oZWFkSW5mbzogVEFCTEVbXSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgICBsZXQgdHI6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9oZWFkSW5mbykge1xyXG4gICAgICAgIGxldCB0aDogSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIik7XHJcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBlbnRyeS5sYWJlbDtcclxuICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5LnNvcnRhYmxlKSB7XHJcbiAgICAgICAgICB0aC5hcHBlbmRDaGlsZCh0aGlzLmdldFNvcnRCdXR0b25zKCkpO1xyXG4gICAgICAgICAgdGguYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgRVZFTlQuQ0hBTkdFLFxyXG4gICAgICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gdGguZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU09SVCwgeyBkZXRhaWw6IF9ldmVudC50YXJnZXQsIGJ1YmJsZXM6IHRydWUgfSkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U29ydEJ1dHRvbnMoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcmVzdWx0OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBmb3IgKGxldCBkaXJlY3Rpb24gb2YgW1widXBcIiwgXCJkb3duXCJdKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICBidXR0b24ubmFtZSA9IFwic29ydFwiO1xyXG4gICAgICAgIGJ1dHRvbi52YWx1ZSA9IGRpcmVjdGlvbjtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU29ydChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC5kZXRhaWwpLnZhbHVlO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IGRpcmVjdGlvbjogbnVtYmVyID0gKHZhbHVlID09IFwidXBcIikgPyAxIDogLTE7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zb3J0KHRoaXMuZGF0YSwga2V5LCBkaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRXZlbnQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhfZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAvLyAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgIC8vICAgICBjYXNlIEVWRU5ULkNMSUNLOlxyXG4gICAgLy8gICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIC8vICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZFJlbmFtZShfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgIC8vIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj4oPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkucGFyZW50Tm9kZTtcclxuICAgIC8vICAgLy8gbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSB0aGlzLmNvbnRyb2xsZXIucmVuYW1lKGl0ZW0uZGF0YSwgaXRlbS5nZXRMYWJlbCgpKTtcclxuICAgIC8vICAgLy8gaWYgKHJlbmFtZWQpXHJcbiAgICAvLyAgIC8vICAgaXRlbS5zZXRMYWJlbCh0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoaXRlbS5kYXRhKSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgIC8vICAgY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgIC8vICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgLy8gICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDoge2RhdGE6IHRoaXMuZGF0YX0gfSkpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIC8vIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAvLyAgIC8vIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAvLyAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vICAgLy8gbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgIC8vICAgLy8gc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgLy8gICAvLyAgIGNhc2UgRVZFTlRfVFJFRS5DT1BZOlxyXG4gICAgLy8gICAvLyAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgIC8vICAgLy8gICAgIGJyZWFrO1xyXG4gICAgLy8gICAvLyAgIGNhc2UgRVZFTlRfVFJFRS5QQVNURTpcclxuICAgIC8vICAgLy8gICAgIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzLCB0YXJnZXQuZGF0YSk7XHJcbiAgICAvLyAgIC8vICAgICBicmVhaztcclxuICAgIC8vICAgLy8gICBjYXNlIEVWRU5UX1RSRUUuQ1VUOlxyXG4gICAgLy8gICAvLyAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgIC8vICAgLy8gICAgIGxldCBjdXQ6IFRbXSA9IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAvLyAgIC8vICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgLy8gICAvLyAgICAgYnJlYWs7XHJcbiAgICAvLyAgIC8vIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLXNvcnRhYmxlXCIsIFRhYmxlLCB7IGV4dGVuZHM6IFwidGFibGVcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RhYmxlXV0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUgW1tUYWJsZV1dIGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRhYmxlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIHNlbGVjdGlvbjogVFtdID0gW107XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRhYmxlICovXHJcbiAgICBwdWJsaWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0YWJsZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IChhcHBlYXJzIG5vdCB0byBiZSBjYWxsZWQgeWV0KSAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRMYWJlbChfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gZmFsc2UgaWYgcmVuYW1pbmcgb2Ygb2JqZWN0IGlzIG5vdCBwb3NzaWJpbGUsIG9yIHRydWUgaWYgdGhlIG9iamVjdCB3YXMgcmVuYW1lZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmFtZShfb2JqZWN0OiBULCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBUW10pOiBQcm9taXNlPFRbXT4geyByZXR1cm4gX2ZvY3Vzc2VkOyB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZVxyXG4gICAgICogQHBhcmFtIF9mb2N1c3NlZCBUaGUgb2JqZWN0IGN1cnJlbnRseSBoYXZpbmcgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNvcHkoX29yaWdpbmFsczogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgVEFCTEUtb2JqZWN0cyBkZXNjcmliaW5nIHRoZSBoZWFkLXRpdGxlcyBhbmQgYWNjb3JkaW5nIHByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEhlYWQoKTogVEFCTEVbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvcnQgZGF0YSBieSBnaXZlbiBrZXkgYW5kIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc29ydChfZGF0YTogVFtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQ7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdHItZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEgW1tUYWJsZV1dXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRhYmxlSXRlbTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyB0aGlzLmRpc3BsYXkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoX2RhdGEpO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSh0aGlzLmNvbnRyb2xsZXIuZ2V0SGVhZCgpKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcblxyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVVBEQVRFLCB0aGlzLmhuZFVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSBbW0NTU19DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgW1tFVkVOVC5TRUxFQ1RdXSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKF9maWx0ZXI6IFRBQkxFW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2ZpbHRlcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIGVudHJ5LmtleSk7XHJcbiAgICAgICAgbGV0IHRkOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gIWVudHJ5LmVkaXRhYmxlO1xyXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImtleVwiLCBlbnRyeS5rZXkpO1xyXG5cclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0RXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgdGFyZ2V0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgLy8gbGV0IGtleTogc3RyaW5nID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgLy8gbGV0IHByZXZpb3VzVmFsdWU6IMaSLkdlbmVyYWwgPSBSZWZsZWN0LmdldCh0aGlzLmRhdGEsIGtleSk7XHJcblxyXG4gICAgICBpZiAoYXdhaXQgdGhpcy5jb250cm9sbGVyLnJlbmFtZSh0aGlzLmRhdGEsIHRhcmdldC52YWx1ZSkpIHtcclxuICAgICAgICAvLyBSZWZsZWN0LnNldCh0aGlzLmRhdGEsIGtleSwgdGFyZ2V0LnZhbHVlKTsgLy8gd2h5IHNob3VsZG4ndCB0aGUgY29udHJvbGxlciBkbyB0aGlzP1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzcGF0Y2ggUmVuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBpZiAoIXRoaXMubGFiZWwuZGlzYWJsZWQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBsZXQgY29udGVudDogVHJlZUxpc3Q8VD4gPSA8VHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgIC8vICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgLy8gICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbXTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbdGhpcy5kYXRhXTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0aGlzLmRhdGE7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidGFibGUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRhYmxlSXRlbSwgeyBleHRlbmRzOiBcInRyXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiBbW1RyZWVJdGVtXV1zIHRvIHJlcHJlc2VudCBhIGJyYW5jaCBpbiBhIHRyZWVcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlTGlzdDxUPiBleHRlbmRzIEhUTUxVTGlzdEVsZW1lbnQge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKF9pdGVtcyk7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRoIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGggaW5jbHVkZXNcclxuICAgICAqIEBwYXJhbSBfcGF0aCBBbiBhcnJheSBvZiBvYmplY3RzIHN0YXJ0aW5nIHdpdGggb25lIGJlaW5nIGNvbnRhaW5lZCBpbiB0aGlzIHRyZWVsaXN0IGFuZCBmb2xsb3dpbmcgdGhlIGNvcnJlY3QgaGllcmFyY2h5IG9mIHN1Y2Nlc3NvcnNcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgSWYgdHJ1ZSAoZGVmYXVsdCkgdGhlIGxhc3Qgb2JqZWN0IGZvdW5kIGluIHRoZSB0cmVlIGdldHMgdGhlIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KF9wYXRoOiBUW10sIF9mb2N1czogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgbGV0IGN1cnJlbnRUcmVlOiBUcmVlTGlzdDxUPiA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIF9wYXRoKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gY3VycmVudFRyZWUuZmluZEl0ZW0oZGF0YSk7XHJcbiAgICAgICAgaXRlbS5mb2N1cygpO1xyXG4gICAgICAgIGxldCBjb250ZW50OiBUcmVlTGlzdDxUPiA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgICAgaWYgKCFjb250ZW50KSB7XHJcbiAgICAgICAgICBpdGVtLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGNvbnRlbnQgPSBpdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGNvbnRlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICogW1tUcmVlSXRlbV1dcyByZWZlcmVuY2luZyB0aGUgc2FtZSBvYmplY3QgcmVtYWluIGluIHRoZSBsaXN0LCBuZXcgaXRlbXMgZ2V0IGFkZGVkIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlLCBvYnNvbGV0ZSBvbmVzIGFyZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIF90cmVlIEEgbGlzdCB0byBzeW5jIHRoaXMgd2l0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdHJ1Y3R1cmUoX3RyZWU6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF90cmVlLmdldEl0ZW1zKCkpIHtcclxuICAgICAgICBsZXQgZm91bmQ6IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kSXRlbShpdGVtLmRhdGEpO1xyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgZm91bmQuc2V0TGFiZWwoaXRlbS5kaXNwbGF5KTtcclxuICAgICAgICAgIGZvdW5kLmhhc0NoaWxkcmVuID0gaXRlbS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgIGlmICghZm91bmQuaGFzQ2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGZvdW5kLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBbW1RyZWVJdGVtXV0gb2YgdGhpcyBsaXN0IHJlZmVyZW5jaW5nIHRoZSBnaXZlbiBvYmplY3Qgb3IgbnVsbCwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kSXRlbShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmICgoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEgPT0gX2RhdGEpXHJcbiAgICAgICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+Pml0ZW07XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGdpdmVuIFtbVHJlZUl0ZW1dXXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIFtbVHJlZUl0ZW1dXXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEl0ZW1zKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+W10+PHVua25vd24+dGhpcy5jaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YVN0YXJ0KVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YUVuZClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gZW5kKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKF9kYXRhOiBUW10pOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKSB7XHJcbiAgICAgICAgICAvLyBpdGVtLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlVQREFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGl0ZW0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRWaXNpYmxlKF9kYXRhOiBUKTogVHJlZUl0ZW08VD4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YSA9PSBpdGVtLmRhdGEpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZS1saXN0XCIsIFRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIlRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBleHBvcnQgZW51bSBDU1NfQ0xBU1Mge1xyXG4gICAgU0VMRUNURUQgPSBcInNlbGVjdGVkXCIsXHJcbiAgICBJTkFDVElWRSA9IFwiaW5hY3RpdmVcIlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIFtbVHJlZUxpc3RdXSB0aGF0IHJlcHJlc2VudHMgdGhlIHJvb3Qgb2YgYSB0cmVlIGNvbnRyb2wgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiB0cmVlIDx1bD5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCIOKUlCB0cmVlTGlzdCA8dWw+XHJcbiAgICog4pSCICAg4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIgICDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWU8VD4gZXh0ZW5kcyBUcmVlTGlzdDxUPiB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfcm9vdDogVCkge1xyXG4gICAgICBzdXBlcihbXSk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICBsZXQgcm9vdDogVHJlZUl0ZW08VD4gPSBuZXcgVHJlZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBfcm9vdCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV4cGFuZCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRU5BTUUsIHRoaXMuaG5kUmVuYW1lKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wLCB0cnVlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgZm91bmQ6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUJyYW5jaChfZGF0YTogVFtdKTogVHJlZUxpc3Q8VD4ge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IG5ldyBUcmVlTGlzdDxUPihbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUmVuYW1lKF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pig8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS5wYXJlbnROb2RlO1xyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IHRoaXMuY29udHJvbGxlci5yZW5hbWUoaXRlbS5kYXRhLCBpdGVtLmdldExhYmVsKCkpO1xyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICBpdGVtLnNldExhYmVsKHRoaXMuY29udHJvbGxlci5nZXRMYWJlbChpdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudC5kYXRhVHJhbnNmZXIpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBUKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbig8VFtdPl9jaGlsZHJlbiwgPFQ+X3RhcmdldCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRvbid0LCB3aGVuIGNvcHlpbmcgb3IgY29taW5nIGZyb20gYW5vdGhlciBzb3VyY2VcclxuICAgICAgdGhpcy5kZWxldGUobW92ZSk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0RGF0YTogVCA9IDxUPl90YXJnZXQ7XHJcbiAgICAgIGxldCB0YXJnZXRJdGVtOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZFZpc2libGUodGFyZ2V0RGF0YSk7XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbih0YXJnZXREYXRhKSk7XHJcbiAgICAgIGxldCBvbGQ6IFRyZWVMaXN0PFQ+ID0gdGFyZ2V0SXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgdGFyZ2V0SXRlbS5oYXNDaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgIGlmIChvbGQpXHJcbiAgICAgICAgb2xkLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0YXJnZXRJdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgIF9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICBfdGFyZ2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuXHJcbiAgICAgIHRoaXMuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcyA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jb3B5KFsuLi50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuY29weVBhc3RlLnNvdXJjZXMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5UcmVlLCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RyZWVdXSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSBbW1RyZWVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmVlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcDogeyBzb3VyY2VzOiBUW10sIHRhcmdldDogVCB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0cmVlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TGFiZWwoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBsaXN0IGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgZm9yIGZ1cnRoZXIgc3R5bGluZyAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFJldHVybiBmYWxzZSB0byBkaXNhbGxvdyByZW5hbWluZyB0aGUgaXRlbS9vYmplY3QsIG9yIHByb2Nlc3NlcyB0aGUgcHJvcG9zZWQgbmV3IGxhYmVsICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuYW1lKF9vYmplY3Q6IFQsIF9uZXc6IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaGFzIGNoaWxkcmVuIHRoYXQgbXVzdCBiZSBzaG93biB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaGFzQ2hpbGRyZW4oX29iamVjdDogVCk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0aGUgb2JqZWN0J3MgY2hpbGRyZW4gdG8gc2hvdyB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q2hpbGRyZW4oX29iamVjdDogVCk6IFRbXTtcclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCk6IFRbXTtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0cmVlIHJlZmVycyB0byBhbmQgXHJcbiAgICAgKiByZXR1cm4gYSBsaXN0IG9mIHRob3NlIG9iamVjdHMgaW4gb3JkZXIgZm9yIHRoZSBhY2NvcmRpbmcgW1tUcmVlSXRlbXNdXSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXNzZWQgVGhlIG9iamVjdCBjdXJyZW50bHkgaGF2aW5nIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZWxldGUoX2ZvY3Vzc2VkOiBUW10pOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZVxyXG4gICAgICogQHBhcmFtIF9mb2N1c3NlZCBUaGUgb2JqZWN0IGN1cnJlbnRseSBoYXZpbmcgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNvcHkoX29yaWdpbmFsczogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8vIHB1YmxpYyBhYnN0cmFjdCBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICB0aGlzLmRyYWdEcm9wLnRhcmdldCA9ICg8VHJlZUl0ZW08VD4+X2V2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGE7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKF9ldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIGxpLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVHJlZUxpc3RdXSB3aXRoIGEgY2hlY2tib3ggYW5kIGEgdGV4dGlucHV0IGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiBbW1RyZWVMaXN0XV0gYXMgYnJhbmNoIHRvIGRpc3BsYXkgY2hpbGRyZW4gb2YgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlSXRlbTxUPiBleHRlbmRzIEhUTUxMSUVsZW1lbnQge1xyXG4gICAgcHVibGljIGRpc3BsYXk6IHN0cmluZyA9IFwiVHJlZUl0ZW1cIjtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGxhYmVsOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBUKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihfZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kRGJsQ2xpY2spO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRSZW1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlLCB3aGVuIHRoaXMgaXRlbSBoYXMgYSB2aXNpYmxlIGNoZWNrYm94IGluIGZyb250IHRvIGV4cGFuZCB0aGUgc3Vic2VxdWVudCBicmFuY2ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBjaGVja2JveCBmb3IgZXhwYW5kaW5nIHRoZSBzdWJzZXF1ZW50IGJyYW5jaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGhhc0NoaWxkcmVuKF9oYXM6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ID0gX2hhcyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbVFJFRV9DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBsYWJlbCB0ZXh0IHRvIHNob3dcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldExhYmVsKF90ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IF90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBsYWJlbCB0ZXh0IHNob3duXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMYWJlbCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5sYWJlbC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGFiZWwgdGV4dCBzaG93blxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWVzIHRvIGV4cGFuZGluZyB0aGUgW1tUcmVlTGlzdF1dIG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyBbW0VWRU5ULkVYUEFORF1dLlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQgW1tUcmVlTGlzdF1dIGFuZCBhZGQgaXQgYXMgYnJhbmNoIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuXHJcbiAgICAgIGlmIChfZXhwYW5kKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVhQQU5ELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG5cclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIFtbVHJlZUxpc3RdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QnJhbmNoKF9icmFuY2g6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcbiAgICAgIGlmIChfYnJhbmNoKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoX2JyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QnJhbmNoKCk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgcmV0dXJuIDxUcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBUcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghY29udGVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuXHJcbiAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMubGFiZWwudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IHRoaXMuZGlzcGxheTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuXHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5sYWJlbClcclxuICAgICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKCF0aGlzLmxhYmVsLmRpc2FibGVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgbGV0IGNvbnRlbnQ6IFRyZWVMaXN0PFQ+ID0gPFRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICFjb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAoY29udGVudClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgdGhpcy5zdGFydFR5cGluZ0xhYmVsKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhcnRUeXBpbmdMYWJlbCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxhYmVsLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICB0aGlzLnN0YXJ0VHlwaW5nTGFiZWwoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxMSUVsZW1lbnQgPSA8SFRNTExJRWxlbWVudD50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc3dpdGNoICh0YXJnZXQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxyXG4gICAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpdGVtLmZvY3VzKCk7XHJcbiAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZGVmYXVsdFwiOlxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIG1hcmsgYXMgYWxyZWFkeSBwcm9jZXNzZWQgYnkgdGhpcyB0cmVlIGl0ZW0gdG8gaWdub3JlIGl0IGluIGZ1cnRoZXIgcHJvcGFnYXRpb24gdGhyb3VnaCB0aGUgdHJlZVxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJkcmFnc3RhcnRcIiwgdGhpcy5sYWJlbC52YWx1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhpcy5jb250cm9sbGVyLmhuZERyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ292ZXJEb25lXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnb3ZlckRvbmVcIiwgdHJ1ZSk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0aGlzLmRhdGE7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmN1cnJlbnRUYXJnZXQgPT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImxpLXRyZWUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGV4cG9ydCBjb25zdCBlbnVtIEVWRU5UIHtcclxuICAgIENMSUNLID0gXCJjbGlja1wiLFxyXG4gICAgRE9VQkxFX0NMSUNLID0gXCJkYmxjbGlja1wiLFxyXG4gICAgS0VZX0RPV04gPSBcImtleWRvd25cIixcclxuICAgIERSQUdfU1RBUlQgPSBcImRyYWdzdGFydFwiLFxyXG4gICAgRFJBR19FTlRFUiA9IFwiZHJhZ2VudGVyXCIsXHJcbiAgICBEUkFHX09WRVIgPSBcImRyYWdvdmVyXCIsXHJcbiAgICBEUkFHX0xFQVZFID0gXCJkcmFnbGVhdmVcIixcclxuICAgIERST1AgPSBcImRyb3BcIixcclxuICAgIFBPSU5URVJfVVAgPSBcInBvaW50ZXJ1cFwiLFxyXG4gICAgV0hFRUwgPSBcIndoZWVsXCIsXHJcbiAgICBGT0NVU19ORVhUID0gXCJmb2N1c05leHRcIixcclxuICAgIEZPQ1VTX1BSRVZJT1VTID0gXCJmb2N1c1ByZXZpb3VzXCIsXHJcbiAgICBGT0NVU19JTiA9IFwiZm9jdXNpblwiLFxyXG4gICAgRk9DVVNfT1VUID0gXCJmb2N1c291dFwiLFxyXG4gICAgRk9DVVNfU0VUID0gXCJmb2N1c1NldFwiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBUT0dHTEUgPSBcInRvZ2dsZVwiLFxyXG4gICAgUE9JTlRFUl9NT1ZFID0gXCJwb2ludGVybW92ZVwiLFxyXG4gICAgSU5TRVJUID0gXCJpbnNlcnRcIlxyXG4gIH1cclxufSJdfQ==