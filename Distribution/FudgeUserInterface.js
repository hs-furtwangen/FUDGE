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
        // TODO: examine the use of the attribute key vs name. Key signals the use by FUDGE while name is standard and supported by forms
        domElement;
        timeUpdate = 190;
        /** Refererence to the [[FudgeCore.Mutable]] this ui refers to */
        mutable;
        /** [[FudgeCore.Mutator]] used to convey data to and from the mutable*/
        mutator;
        /** [[FudgeCore.Mutator]] used to store the data types of the mutator attributes*/
        mutatorTypes = null;
        idInterval;
        constructor(_mutable, _domElement) {
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
                    return mutator;
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
            let mutatorTypes = {};
            if (_mutable instanceof ƒ.Mutable)
                mutatorTypes = _mutable.getMutatorAttributeTypes(mutator);
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
        mutateOnInput = async (_event) => {
            this.mutator = this.getMutator();
            await this.mutable.mutate(this.mutator);
            _event.stopPropagation();
            this.domElement.dispatchEvent(new Event("mutate" /* EVENT.MUTATE */, { bubbles: true }));
        };
        rearrangeArray = async (_event) => {
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
        refresh = (_event) => {
            if (document.body.contains(this.domElement)) {
                this.updateUserInterface();
                return;
            }
            window.clearInterval(this.idInterval);
        };
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
                    let subMutable;
                    subMutable = Reflect.get(_mutable, key);
                    element = Generator.createDetailsFromMutable(subMutable, key, mutator[key]);
                    if (!element)
                        //Idea: Display an enumerated select here
                        element = new FudgeUserInterface.CustomElementTextInput({ key: key, label: key, value: type ? type.toString() : "?" });
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
                    element = new elementType({ key: _key, label: _key, value: _value.toString() });
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
        static tag;
        static mapObjectToCustomElement = new Map();
        static idCounter = 0;
        initialized = false;
        constructor(_attributes) {
            super();
            if (_attributes)
                for (let name in _attributes) {
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
        static customElement = FudgeUserInterface.CustomElement.register("fudge-boolean", CustomElementBoolean, Boolean);
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
        static customElement = FudgeUserInterface.CustomElement.register("fudge-color", CustomElementColor, ƒ.Color);
        color = new ƒ.Color();
        constructor(_attributes) {
            super(_attributes);
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
        static customElement = FudgeUserInterface.CustomElement.register("fudge-digit", CustomElementDigit);
        initialized = false;
        constructor() {
            super();
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
        static fragment = new Map();
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
     * A dropdown menu to display enums
     */
    class CustomElementSelect extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static customElement = FudgeUserInterface.CustomElement.register("fudge-select", CustomElementSelect, Object);
        content;
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
        static customElement = FudgeUserInterface.CustomElement.register("fudge-stepper", CustomElementStepper, Number);
        value = 0;
        constructor(_attributes) {
            super(_attributes);
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
        /**
         * Handle keyboard input on this element and its digits
         */
        hndKey = (_event) => {
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
        hndWheel = (_event) => {
            _event.stopPropagation();
            _event.preventDefault();
            let change = _event.deltaY < 0 ? +1 : -1;
            this.changeDigitFocussed(change);
            this.dispatchEvent(new Event("input" /* EVENT.INPUT */, { bubbles: true }));
        };
        hndInput = (_event) => {
            this.openInput(false);
        };
        hndFocus = (_event) => {
            if (this.contains(document.activeElement))
                return;
            this.activateInnerTabs(false);
        };
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
        static customElement = FudgeUserInterface.CustomElement.register("fudge-textinput", CustomElementTextInput, String);
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
        content;
        constructor(_legend = "", _type) {
            super();
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
        hndToggle = (_event) => {
            if (_event)
                _event.stopPropagation();
            this.dispatchEvent(new Event(this.isExpanded ? "expand" /* EVENT.EXPAND */ : "collapse" /* EVENT.COLLAPSE */, { bubbles: true }));
        };
        hndFocus = (_event) => {
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
        hndKey = (_event) => {
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
        hndDragStart = (_event) => {
            // _event.preventDefault; 
            let keyDrag = _event.currentTarget.getAttribute("key");
            _event.dataTransfer.setData("index", keyDrag);
            console.log(keyDrag);
        };
        hndDragOver = (_event) => {
            _event.preventDefault();
            if (_event.ctrlKey)
                _event.dataTransfer.dropEffect = "copy";
            if (_event.shiftKey)
                _event.dataTransfer.dropEffect = "link";
        };
        hndDrop = (_event) => {
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
        hndInsert = (_event) => {
            console.log("hndInsert");
        };
        hndKeySpecial = (_event) => {
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
        static dom;
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
        controller;
        constructor(_controller, _items = []) {
            super();
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
        hndDragOver = (_event) => {
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
        hndDragLeave = (_event) => {
            let relatedTarget = _event.relatedTarget;
            if (relatedTarget instanceof HTMLElement && !this.contains(relatedTarget) && !this.contains(relatedTarget.offsetParent)) // offset parent is for weird (invisible) divs which are placed over input elements and trigger leave events... 
                this.controller.dragDropIndicator.remove();
        };
        hndDelete = async (_event) => {
            let target = _event.target;
            _event.stopPropagation();
            let remove = await this.controller.delete([target.data]);
            this.delete(remove);
        };
        hndEscape = (_event) => {
            this.clearSelection();
        };
        hndCopyPaste = async (_event) => {
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
        hndFocus = (_event) => {
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
        /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
        selection = [];
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
        dragDrop = { sources: [], target: null };
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
        copyPaste = { sources: [], target: null };
        /** Used by the tree to indicate the drop position while dragging */
        dragDropIndicator = document.createElement("hr");
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
        classes = [];
        data = null;
        controller;
        checkbox;
        #content;
        constructor(_controller, _data) {
            super();
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
         * Set the content representing the attached {@link data}
         */
        set content(_content) {
            if (this.contains(this.#content))
                this.replaceChild(_content, this.#content);
            else
                this.appendChild(_content);
            this.#content = _content;
            this.#content.onsubmit = (_event) => {
                _event.preventDefault();
                return false;
            };
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
            this.content = this.controller.createContent(this.data);
            this.content.disabled = true;
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
            this.refreshContent();
            this.refreshAttributes();
            this.tabIndex = 0;
        }
        hndFocus = (_event) => {
            _event.stopPropagation();
            if (_event.target == this.checkbox)
                return;
            if (_event.target == this)
                return;
            this.content.disabled = true;
        };
        hndKey = (_event) => {
            _event.stopPropagation();
            if (!this.content.disabled)
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
                    const element = this.content.elements.item(0);
                    if (!element)
                        break;
                    this.content.disabled = false;
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
        hndDblClick = (_event) => {
            _event.stopPropagation();
            if (_event.target == this.checkbox)
                return;
            this.content.disabled = false;
            const element = document.elementFromPoint(_event.pageX, _event.pageY); // disabled elements don't dispatch click events, get the element manually
            if (!element)
                return;
            element.focus();
        };
        hndChange = async (_event) => {
            let target = _event.target;
            _event.stopPropagation();
            if (target instanceof HTMLInputElement && target.type == "checkbox") {
                this.expand(target.checked);
                return;
            }
            let renamed = await this.controller.setValue(this.data, target.value, target.id);
            this.refreshContent();
            this.refreshAttributes();
            if (renamed)
                this.dispatchEvent(new CustomEvent("rename" /* EVENT.RENAME */, { bubbles: true, detail: { data: this.data } }));
        };
        hndDragStart = (_event) => {
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
        hndDrag = (_event) => {
            let rect = this.content.getBoundingClientRect();
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
        hndPointerUp = (_event) => {
            _event.stopPropagation();
            if (_event.target == this.checkbox)
                return;
            this.select(_event.ctrlKey, _event.shiftKey);
        };
        hndRemove = (_event) => {
            // the views might need to know about this event
            // if (_event.currentTarget == _event.target)
            //   return;
            // _event.stopPropagation();
            this.hasChildren = this.controller.hasChildren(this.data);
        };
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
        controller;
        data;
        icon;
        constructor(_controller, _data, _icon) {
            super();
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
        // private hndDrop(_event: DragEvent): void {
        //   // _event.stopPropagation();
        //   // this.addChildren(this.controller.dragDrop.sources, this.controller.dragDrop.target);
        // }
        hndDelete = async (_event) => {
            let target = _event.target;
            _event.stopPropagation();
            let deleted = await this.controller.delete([target.data]);
            if (deleted.length)
                this.dispatchEvent(new Event("removeChild" /* EVENT.REMOVE_CHILD */, { bubbles: true }));
        };
        hndEscape = (_event) => {
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
        hndFocus = (_event) => {
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
        /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of table */
        selection = [];
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
        dragDrop = { sources: [], target: null };
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
        copyPaste = { sources: [], target: null };
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
        data = null;
        controller;
        constructor(_controller, _data) {
            super();
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
        hndInputEvent = (_event) => {
            if (_event instanceof KeyboardEvent && _event.code != ƒ.KEYBOARD_CODE.F2)
                return;
            let input = _event.target;
            input.readOnly = false;
            input.focus();
        };
        hndChange = async (_event) => {
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
        hndKey = (_event) => {
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
        hndDragStart = (_event) => {
            // _event.stopPropagation();
            this.controller.dragDrop.sources = [];
            if (this.selected)
                this.controller.dragDrop.sources = this.controller.selection;
            else
                this.controller.dragDrop.sources = [this.data];
            _event.dataTransfer.effectAllowed = "all";
        };
        hndDragOver = (_event) => {
            // _event.stopPropagation();
            _event.preventDefault();
            this.controller.dragDrop.target = this.data;
            // _event.dataTransfer.dropEffect = "link";
        };
        hndPointerUp = (_event) => {
            _event.stopPropagation();
            this.focus();
            this.select(_event.ctrlKey, _event.shiftKey);
        };
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
        controller;
        constructor(_controller, _root) {
            super([]);
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
        hndDelete = (_event) => {
            let target = _event.target;
            _event.stopPropagation();
            let remove = this.controller.delete([target.data]);
            this.delete(remove);
        };
        hndEscape = (_event) => {
            this.clearSelection();
        };
        hndCopyPaste = async (_event) => {
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
        hndFocus = (_event) => {
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
        /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
        selection = [];
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
        dragDrop = { sources: [], target: null };
        /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
        copyPaste = { sources: [], target: null };
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
        display = "TreeItem";
        classes = [];
        data = null;
        controller;
        checkbox;
        label;
        constructor(_controller, _data) {
            super();
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
        hndFocus = (_event) => {
            if (_event.target == this.label)
                this.label.disabled = true;
        };
        hndKey = (_event) => {
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
        startTypingLabel() {
            this.label.disabled = false;
            this.label.focus();
        }
        hndDblClick = (_event) => {
            _event.stopPropagation();
            if (_event.target != this.checkbox)
                this.startTypingLabel();
        };
        hndChange = (_event) => {
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
        hndDragStart = (_event) => {
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
        hndDragOver = (_event) => {
            // this.controller.hndDragOver(_event);
            if (Reflect.get(_event, "dragoverDone"))
                return;
            Reflect.set(_event, "dragoverDone", true);
            // _event.stopPropagation();
            _event.preventDefault();
            this.controller.dragDrop.target = this.data;
            _event.dataTransfer.dropEffect = "move";
        };
        hndPointerUp = (_event) => {
            _event.stopPropagation();
            if (_event.target == this.checkbox)
                return;
            this.select(_event.ctrlKey, _event.shiftKey);
        };
        hndRemove = (_event) => {
            if (_event.currentTarget == _event.target)
                return;
            _event.stopPropagation();
            this.hasChildren = this.controller.hasChildren(this.data);
        };
    }
    FudgeUserInterface.TreeItem = TreeItem;
    customElements.define("li-tree-item", TreeItem, { extends: "li" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHNBcnJheS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGlhbG9nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9NdWx0aUxldmVsTWVudS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvV2FybmluZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlTGlzdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUxpc3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlSXRlbS50cyIs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RSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsNEJBQTRCO1lBQzVCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDMUMsQ0FBQyxDQUFDO1FBRU0sWUFBWSxHQUFHLENBQUMsTUFBb0IsRUFBUSxFQUFFO1lBQ3BELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQ2hDLE9BQU87WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQztRQUVNLFNBQVMsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO1lBQzFDLElBQUksTUFBTSxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsTUFBTTtnQkFDdkMsT0FBTztZQUNULE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUM7S0FDSDtJQTVTWSwyQkFBUSxXQTRTcEIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFxQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4RyxDQUFDLEVBdFRTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFzVDNCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIi8+IC8vIFRPRE86IG5vdyB0aGF0IHdlIHVzZSBwYWNrYWdlIHJlZmVyZW5jZXMgaW4gdGhlIHRzY29uZmlnLCB0aGlzIGZpbGUgaXMgb2Jzb2xldGUiLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbm5lY3RzIGEgW1tNdXRhYmxlXV0gdG8gYSBET00tRWxlbWVudCBhbmQgc3luY2hyb25pemVzIHRoYXQgbXV0YWJsZSB3aXRoIHRoZSBtdXRhdG9yIHN0b3JlZCB3aXRoaW4uXHJcbiAgICogVXBkYXRlcyB0aGUgbXV0YWJsZSBvbiBpbnRlcmFjdGlvbiB3aXRoIHRoZSBlbGVtZW50IGFuZCB0aGUgZWxlbWVudCBpbiB0aW1lIGludGVydmFscy5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgICAvLyBUT0RPOiBleGFtaW5lIHRoZSB1c2Ugb2YgdGhlIGF0dHJpYnV0ZSBrZXkgdnMgbmFtZS4gS2V5IHNpZ25hbHMgdGhlIHVzZSBieSBGVURHRSB3aGlsZSBuYW1lIGlzIHN0YW5kYXJkIGFuZCBzdXBwb3J0ZWQgYnkgZm9ybXNcclxuICAgIHB1YmxpYyBkb21FbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCB0aW1lVXBkYXRlOiBudW1iZXIgPSAxOTA7XHJcbiAgICAvKiogUmVmZXJlcmVuY2UgdG8gdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXSB0aGlzIHVpIHJlZmVycyB0byAqL1xyXG4gICAgcHJvdGVjdGVkIG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47XHJcbiAgICAvKiogW1tGdWRnZUNvcmUuTXV0YXRvcl1dIHVzZWQgdG8gY29udmV5IGRhdGEgdG8gYW5kIGZyb20gdGhlIG11dGFibGUqL1xyXG4gICAgcHJvdGVjdGVkIG11dGF0b3I6IMaSLk11dGF0b3I7XHJcbiAgICAvKiogW1tGdWRnZUNvcmUuTXV0YXRvcl1dIHVzZWQgdG8gc3RvcmUgdGhlIGRhdGEgdHlwZXMgb2YgdGhlIG11dGF0b3IgYXR0cmlidXRlcyovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIGlkSW50ZXJ2YWw6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQgPSBfZG9tRWxlbWVudDtcclxuICAgICAgdGhpcy5zZXRNdXRhYmxlKF9tdXRhYmxlKTtcclxuICAgICAgLy8gVE9ETzogZXhhbWluZSwgaWYgdGhpcyBzaG91bGQgcmVnaXN0ZXIgdG8gb25lIGNvbW1vbiBpbnRlcnZhbCwgaW5zdGVhZCBvZiBlYWNoIGluc3RhbGxpbmcgaXRzIG93bi5cclxuICAgICAgdGhpcy5zdGFydFJlZnJlc2goKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIHRoaXMubXV0YXRlT25JbnB1dCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFQVJSQU5HRV9BUlJBWSwgdGhpcy5yZWFycmFuZ2VBcnJheSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyBhbiBleGlzdGluZyBbW8aSLk11dGF0b3JdXSBhcyBhIHRlbXBsYXRlIFxyXG4gICAgICogYW5kIHVwZGF0aW5nIGl0cyB2YWx1ZXMgd2l0aCB0aG9zZSBmb3VuZCBpbiB0aGUgZ2l2ZW4gVUktZG9tRWxlbWVudC4gXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlTXV0YXRvcihfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yOiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+Q29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlIGlmIChfbXV0YXRvcltrZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihlbGVtZW50LCBfbXV0YXRvcltrZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIF9tdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCB0YWtpbmcgdGhlIGEgW1vGki5NdXRhYmxlXV0gYXMgYSB0ZW1wbGF0ZSB0byBjcmVhdGUgYSBbW8aSLk11dGF0b3JdXSBvciB1cGRhdGUgdGhlIGdpdmVuIFtbxpIuTXV0YXRvcl1dIFxyXG4gICAgICogd2l0aCB0aGUgdmFsdWVzIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TXV0YXRvcihfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgLy8gVE9ETzogZXhhbWluZSBpZiB0aGlzLm11dGF0b3Igc2hvdWxkIGFsc28gYmUgYWRkcmVzc2VkIGluIHNvbWUgd2F5Li4uXHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgLy8gVE9ETzogTXV0YXRvciB0eXBlIG5vdyBvbmx5IHVzZWQgZm9yIGVudW1zLiBFeGFtaW5lIGlmIHRoZXJlIGlzIGFub3RoZXIgd2F5XHJcbiAgICAgIGxldCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IF90eXBlcyB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMobXV0YXRvcik7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IENvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICByZXR1cm4gbXV0YXRvcjtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gKDxDdXN0b21FbGVtZW50PmVsZW1lbnQpLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgICBlbHNlIGlmIChtdXRhdG9yVHlwZXNba2V5XSBpbnN0YW5jZW9mIE9iamVjdClcclxuICAgICAgICAgIC8vIFRPRE86IHNldHRpbmcgYSB2YWx1ZSBvZiB0aGUgZG9tIGVsZW1lbnQgZG9lc24ndCBtYWtlIHNlbnNlLi4uIGV4YW1pbmUgd2hhdCB0aGlzIGxpbmUgd2FzIHN1cHBvc2VkIHRvIGRvLiBBc3N1bWFibHkgZW51bXNcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9ICg8SFRNTFNlbGVjdEVsZW1lbnQ+ZWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YXRvcjogxpIuTXV0YXRvciA9IFJlZmxlY3QuZ2V0KG11dGF0b3IsIGtleSk7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YWJsZTogxpIuTXV0YWJsZTtcclxuICAgICAgICAgIHN1Yk11dGFibGUgPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmIChzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5IHx8IHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICBtdXRhdG9yW2tleV0gPSB0aGlzLmdldE11dGF0b3Ioc3ViTXV0YWJsZSwgZWxlbWVudCwgc3ViTXV0YXRvcik7IC8vLCBzdWJUeXBlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCB0YWtpbmcgdGhlIFtbxpIuTXV0YXRvcl1dIG9mIGEgW1vGki5NdXRhYmxlXV0gYW5kIHVwZGF0aW5nIHRoZSBVSS1kb21FbGVtZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICogSWYgYW4gYWRkaXRpb25hbCBbW8aSLk11dGF0b3JdXSBpcyBwYXNzZWQsIGl0cyB2YWx1ZXMgYXJlIHVzZWQgaW5zdGVhZCBvZiB0aG9zZSBvZiB0aGUgW1vGki5NdXRhYmxlXV0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVXNlckludGVyZmFjZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSB7fTtcclxuICAgICAgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBtdXRhdG9yVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMobXV0YXRvcik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGUgPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmIChzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5IHx8IHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2Uoc3ViTXV0YWJsZSwgZWxlbWVudCwgbXV0YXRvcltrZXldKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgLy9lbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwidmFsdWVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgYnJlYWR0aC1maXJzdCBzZWFyY2ggb24gdGhlIGdpdmVuIF9kb21FbGVtZW50IGZvciBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGtleS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGBba2V5PVwiJHtfa2V5fVwiXWApO1xyXG4gICAgICBpZiAoZWxlbWVudHMubGVuZ3RoIDwgMilcclxuICAgICAgICByZXR1cm4gZWxlbWVudHNbMF07XHJcblxyXG4gICAgICBsZXQgc2hvcnRlc3RQYXRoOiBudW1iZXIgPSBJbmZpbml0eTtcclxuICAgICAgbGV0IGNsb3Nlc3RFbGVtZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcGFyZW50RWxlbWVudDogSFRNTEVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7IHBhcmVudEVsZW1lbnQgIT0gX2RvbUVsZW1lbnQ7IHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpXHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIGlmIChjb3VudCA8IHNob3J0ZXN0UGF0aCkge1xyXG4gICAgICAgICAgY2xvc2VzdEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgc2hvcnRlc3RQYXRoID0gY291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY2xvc2VzdEVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyAgIHJldHVybiBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiBba2V5PVwiJHtfa2V5fVwiXWApID8/IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYDpzY29wZSA+ICogPiBba2V5PVwiJHtfa2V5fVwiXWApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIC8vICAgbGV0IHF1ZXVlOiBIVE1MRWxlbWVudFtdID0gW19kb21FbGVtZW50XTtcclxuICAgIC8vICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuICAgIC8vICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBxdWV1ZS5zaGlmdCgpO1xyXG4gICAgLy8gICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoYFtrZXk9XCIke19rZXl9XCJdYCkpXHJcbiAgICAvLyAgICAgICByZXR1cm4gZWxlbWVudDtcclxuXHJcbiAgICAvLyAgICAgcXVldWUucHVzaCguLi48SFRNTEVsZW1lbnRbXT5BcnJheS5mcm9tKGVsZW1lbnQuY2hpbGRyZW4pKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICByZXR1cm4gbnVsbDtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcihfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgLy8gVE9ETzogc2hvdWxkIGdldCBNdXRhdG9yIGZvciBVSSBvciB3b3JrIHdpdGggdGhpcy5tdXRhdG9yIChleGFtaW5lKVxyXG4gICAgICB0aGlzLm11dGFibGUudXBkYXRlTXV0YXRvcih0aGlzLm11dGF0b3IpO1xyXG4gICAgICByZXR1cm4gQ29udHJvbGxlci5nZXRNdXRhdG9yKHRoaXMubXV0YWJsZSwgdGhpcy5kb21FbGVtZW50LCBfbXV0YXRvciwgX3R5cGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlVXNlckludGVyZmFjZSgpOiB2b2lkIHtcclxuICAgICAgQ29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKHRoaXMubXV0YWJsZSwgdGhpcy5kb21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPik6IHZvaWQge1xyXG4gICAgICB0aGlzLm11dGFibGUgPSBfbXV0YWJsZTtcclxuICAgICAgdGhpcy5tdXRhdG9yID0gX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICB0aGlzLm11dGF0b3JUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyh0aGlzLm11dGF0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhYmxlKCk6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5tdXRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnJlZnJlc2gsIHRoaXMudGltZVVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG11dGF0ZU9uSW5wdXQgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLm11dGF0b3IgPSB0aGlzLmdldE11dGF0b3IoKTtcclxuICAgICAgYXdhaXQgdGhpcy5tdXRhYmxlLm11dGF0ZSh0aGlzLm11dGF0b3IpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhcnJhbmdlQXJyYXkgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IG51bWJlcltdID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5zZXF1ZW5jZTtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzQXJyYXkgPSA8RGV0YWlsc0FycmF5Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBtdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+O1xyXG5cclxuICAgICAgeyAvLyBmaW5kIHRoZSBNdXRhYmxlQXJyYXkgY29ubmVjdGVkIHRvIHRoaXMgRGV0YWlsc0FycmF5XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZGV0YWlscztcclxuICAgICAgICB3aGlsZSAoZWxlbWVudCAhPSB0aGlzLmRvbUVsZW1lbnQpIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSlcclxuICAgICAgICAgICAgcGF0aC5wdXNoKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgICAgIG11dGFibGUgPSB0aGlzLm11dGFibGU7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHBhdGgpXHJcbiAgICAgICAgICBtdXRhYmxlID0gUmVmbGVjdC5nZXQobXV0YWJsZSwga2V5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmVhcnJhbmdlIHRoYXQgbXV0YWJsZVxyXG4gICAgICAoPMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPj48dW5rbm93bj5tdXRhYmxlKS5yZWFycmFuZ2Uoc2VxdWVuY2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZG9tRWxlbWVudCkpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyBnZW5lcmF0aW5nIFVJLWRvbUVsZW1lbnRzIGZyb20gdGhlIGluZm9ybWF0aW9uIGZvdW5kIGluIFtbxpIuTXV0YWJsZV1dcyBhbmQgW1vGki5NdXRhdG9yXV1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBbW0NvbnRyb2xsZXJdXSBmcm9tIGEgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHdpdGggZXhwYW5kYWJsZSBkZXRhaWxzIG9yIGEgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvbnRyb2xsZXIoX211dGFibGU6IMaSLk11dGFibGUsIF9uYW1lPzogc3RyaW5nKTogQ29udHJvbGxlciB7XHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoX211dGFibGUsIEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoX211dGFibGUsIF9uYW1lKSk7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBleHRlbmRhYmxlIGRldGFpbHMgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX25hbWU/OiBzdHJpbmcsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IERldGFpbHMgfCBEZXRhaWxzQXJyYXkge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gX25hbWUgfHwgX211dGFibGUuY29uc3RydWN0b3IubmFtZTtcclxuXHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzIHwgRGV0YWlsc0FycmF5O1xyXG4gICAgICBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgZGV0YWlscyA9IG5ldyBEZXRhaWxzQXJyYXkobmFtZSk7XHJcbiAgICAgIGVsc2UgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHMobmFtZSwgX211dGFibGUudHlwZSk7XHJcbiAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlLCBfbXV0YXRvcikpO1xyXG4gICAgICByZXR1cm4gZGV0YWlscztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50cyBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gbXV0YXRvclR5cGVzKSB7XHJcbiAgICAgICAgbGV0IHR5cGU6IE9iamVjdCA9IG11dGF0b3JUeXBlc1trZXldO1xyXG4gICAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gbXV0YXRvcltrZXldO1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksIHR5cGUsIHZhbHVlKTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlO1xyXG4gICAgICAgICAgc3ViTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoc3ViTXV0YWJsZSwga2V5LCA8xpIuTXV0YXRvcj5tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICAvL0lkZWE6IERpc3BsYXkgYW4gZW51bWVyYXRlZCBzZWxlY3QgaGVyZVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gbmV3IEN1c3RvbUVsZW1lbnRUZXh0SW5wdXQoeyBrZXk6IGtleSwgbGFiZWw6IGtleSwgdmFsdWU6IHR5cGUgPyB0eXBlLnRvU3RyaW5nKCkgOiBcIj9cIiB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudCBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gXHJcbiAgICAgKiBEb2VzIG5vdCBzdXBwb3J0IG5lc3RlZCBtdXRhdG9ycyFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvciB8IE9iamVjdCk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IFJlZmxlY3QuZ2V0KF9tdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgIC8vIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSAvLyBhdCB0aGlzIHRpbWUgKDEvMjMpIGFkZGluZyBhIHByb3BlcnR5IHRvIGFuIGFuaW1hdGlvbiBpbiB0aGUgZWRpdG9yIGNyZWF0ZXMgYW4gZW1wdHkga2V5cyBsaXN0Li4uXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCBPYmplY3QsIHt9KSk7IFxyXG4gICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgLy8gbGV0IGRldGFpbHM6IERldGFpbHMgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlscyhrZXksIFwiRGV0YWlsc1wiKTtcclxuICAgICAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksICg8T2JqZWN0PnZhbHVlKS5jb25zdHJ1Y3Rvci5uYW1lLCB2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcGVjaWZpYyBDdXN0b21FbGVtZW50IGZvciB0aGUgZ2l2ZW4gZGF0YSwgdXNpbmcgX2tleSBhcyBpZGVudGlmaWNhdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZU11dGF0b3JFbGVtZW50KF9rZXk6IHN0cmluZywgX3R5cGU6IE9iamVjdCB8IHN0cmluZywgX3ZhbHVlOiBPYmplY3QpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoX3R5cGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50VHlwZTogdHlwZW9mIEN1c3RvbUVsZW1lbnQgPSBDdXN0b21FbGVtZW50LmdldChcIk9iamVjdFwiKTtcclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGluc3RhbnRpYXRlIGFic3RyYWN0IGNsYXNzXHJcbiAgICAgICAgICBlbGVtZW50ID0gbmV3IGVsZW1lbnRUeXBlKHsga2V5OiBfa2V5LCBsYWJlbDogX2tleSwgdmFsdWU6IF92YWx1ZS50b1N0cmluZygpIH0sIF90eXBlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF92YWx1ZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSkgeyAvLyBUT0RPOiBkZWxldGU/XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk11dGFibGVBcnJheVwiKTtcclxuICAgICAgICAgIC8vIGluc2VydCBBcnJheS1Db250cm9sbGVyIVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWUudG9TdHJpbmcoKSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIMaSLkRlYnVnLmZ1ZGdlKF9lcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUT0RPOiByZWZhY3RvciBmb3IgZW51bXMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRHJvcGRvd24oX25hbWU6IHN0cmluZywgX2NvbnRlbnQ6IE9iamVjdCwgX3ZhbHVlOiBzdHJpbmcsIF9wYXJlbnQ6IEhUTUxFbGVtZW50LCBfY3NzQ2xhc3M/OiBzdHJpbmcpOiBIVE1MU2VsZWN0RWxlbWVudCB7XHJcbiAgICAgIGxldCBkcm9wZG93bjogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICBkcm9wZG93bi5uYW1lID0gX25hbWU7XHJcbiAgICAgIGZvciAobGV0IHZhbHVlIGluIF9jb250ZW50KSB7XHJcbiAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgZW50cnkudGV4dCA9IHZhbHVlO1xyXG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLnRvVXBwZXJDYXNlKCkgPT0gX3ZhbHVlLnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAgIGVudHJ5LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZHJvcGRvd24uYWRkKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgICBfcGFyZW50LmFwcGVuZENoaWxkKGRyb3Bkb3duKTtcclxuICAgICAgcmV0dXJuIGRyb3Bkb3duO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlscyhfa2V5OiBzdHJpbmcsIF90eXBlOiBzdHJpbmcpOiBEZXRhaWxzIHtcclxuICAgIC8vICAgbGV0IGRldGFpbHM6IERldGFpbHMgPSBuZXcgRGV0YWlscyhfa2V5KTtcclxuICAgIC8vICAgLy8gZGV0YWlscy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgIC8vICAgcmV0dXJuIGRldGFpbHM7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNBcnJheShfa2V5OiBzdHJpbmcsIF90eXBlOiBzdHJpbmcpOiBEZXRhaWxzIHtcclxuICAgIC8vICAgbGV0IGRldGFpbHM6IERldGFpbHMgPSBuZXcgRGV0YWlsc0FycmF5KF9rZXkpO1xyXG4gICAgLy8gICBkZXRhaWxzLnNldEF0dHJpYnV0ZShcImtleVwiLCBfa2V5KTtcclxuICAgIC8vICAgZGV0YWlscy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgIC8vICAgcmV0dXJuIGRldGFpbHM7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdHJ1Y3R1cmUgZm9yIHRoZSBhdHRyaWJ1dGVzIHRvIHNldCBpbiBhIEN1c3RvbUVsZW1lbnQuXHJcbiAgICoga2V5IChtYXliZSByZW5hbWUgdG8gYG5hbWVgKSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgbWF0Y2ggdGhlIGtleSBvZiBhIG11dGF0b3IgaWYgdXNlZCBpbiBjb25qdW5jdGlvblxyXG4gICAqIGxhYmVsIGlzIHJlY29tbWVuZGVkIGZvciBsYWJlbGxlZCBlbGVtZW50cywga2V5IGlzIHVzZWQgaWYgbm90IGdpdmVuLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMge1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBsYWJlbD86IHN0cmluZztcclxuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBtYXBwaW5nIG9mIEN1c3RvbUVsZW1lbnRzIHRvIHRoZWlyIEhUTUwtVGFncyB2aWEgY3VzdG9tRWxlbWVudC5kZWZpbmVcclxuICAgKiBhbmQgdG8gdGhlIGRhdGEgdHlwZXMgYW5kIFtbRnVkZ2VDb3JlLk11dGFibGVdXXMgdGhleSByZW5kZXIgYW4gaW50ZXJmYWNlIGZvci4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRhZzogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwT2JqZWN0VG9DdXN0b21FbGVtZW50OiBNYXA8c3RyaW5nLCB0eXBlb2YgQ3VzdG9tRWxlbWVudD4gPSBuZXcgTWFwKCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMpXHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBfYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgX2F0dHJpYnV0ZXNbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIGFuIGlkIHRvIHVzZSBmb3IgY2hpbGRyZW4gb2YgdGhpcyBlbGVtZW50LCBuZWVkZWQgZS5nLiBmb3Igc3RhbmRhcmQgaW50ZXJhY3Rpb24gd2l0aCB0aGUgbGFiZWxcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBnZXQgbmV4dElkKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIsaSXCIgKyBDdXN0b21FbGVtZW50LmlkQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgbWFwIHRoZSBnaXZlbiBlbGVtZW50IHR5cGUgdG8gdGhlIGdpdmVuIHRhZyBhbmQgdGhlIGdpdmVuIHR5cGUgb2YgZGF0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWc6IHN0cmluZywgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCwgX3R5cGVPYmplY3Q/OiB0eXBlb2YgT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF90YWcsIF9jbGFzcyk7XHJcbiAgICAgIF90eXBlQ3VzdG9tRWxlbWVudC50YWcgPSBfdGFnO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShfdGFnLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgaWYgKF90eXBlT2JqZWN0KVxyXG4gICAgICAgIEN1c3RvbUVsZW1lbnQubWFwKF90eXBlT2JqZWN0Lm5hbWUsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGdpdmVuIGRhdGEgdHlwZSAoaWYgcmVnaXN0ZXJlZClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQoX3R5cGU6IHN0cmluZyk6IHR5cGVvZiBDdXN0b21FbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnQ6IHN0cmluZyB8IHR5cGVvZiBDdXN0b21FbGVtZW50IHwgQ3VzdG9tRWxlbWVudENvbnN0cnVjdG9yID0gQ3VzdG9tRWxlbWVudC5tYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgaWYgKHR5cGVvZiAoZWxlbWVudCkgPT0gXCJzdHJpbmdcIilcclxuICAgICAgICBlbGVtZW50ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW1lbnQpO1xyXG4gICAgICByZXR1cm4gPHR5cGVvZiBDdXN0b21FbGVtZW50PmVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwKF90eXBlOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoXCJNYXBcIiwgX3R5cGUsIF90eXBlQ3VzdG9tRWxlbWVudC5uYW1lKTtcclxuICAgICAgQ3VzdG9tRWxlbWVudC5tYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQuc2V0KF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBrZXkgKG5hbWUpIG9mIHRoZSBhdHRyaWJ1dGUgdGhpcyBlbGVtZW50IHJlcHJlc2VudHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBrZXkoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbGFiZWwtZWxlbWVudCBhcyBjaGlsZCB0byB0aGlzIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFwcGVuZExhYmVsKCk6IEhUTUxMYWJlbEVsZW1lbnQge1xyXG4gICAgICBsZXQgdGV4dDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKCF0ZXh0KVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TGFiZWwoX2xhYmVsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IF9sYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IGluIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldE11dGF0b3JWYWx1ZSgpOiBPYmplY3Q7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCB1c2luZyBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgUmVmbGVjdC5zZXQodGhpcywgXCJ2YWx1ZVwiLCBfdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBXb3JrYXJvdW5kIHJlY29ubmVjdGlvbiBvZiBjbG9uZSAqL1xyXG4gICAgcHVibGljIGNsb25lTm9kZShfZGVlcDogYm9vbGVhbik6IE5vZGUge1xyXG4gICAgICBsZXQgbGFiZWw6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICBsZXQgY2xvbmU6IEN1c3RvbUVsZW1lbnQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsYWJlbCA/IHsgbGFiZWw6IGxhYmVsIH0gOiBudWxsKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjbG9uZSk7XHJcbiAgICAgIGNsb25lLnNldE11dGF0b3JWYWx1ZSh0aGlzLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgZm9yIChsZXQgYXR0cmlidXRlIG9mIHRoaXMuYXR0cmlidXRlcylcclxuICAgICAgICBjbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XHJcbiAgICAgIHJldHVybiBjbG9uZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAvLyBUT0RPOiBkZWxldGUgdGFiaW5kZXggZnJvbSBjaGVja2JveCBhbmQgZ2V0IHNwYWNlLWtleSBvbiB0aGlzXHJcbiAgICAgIC8vIHRoaXMudGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICBpbnB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICBpbnB1dC5jaGVja2VkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA9PSBcInRydWVcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCkuaHRtbEZvciA9IGlucHV0LmlkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLmNoZWNrZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZCA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogQSBjb2xvciBwaWNrZXIgd2l0aCBhIGxhYmVsIHRvIGl0IGFuZCBhIHNsaWRlciBmb3Igb3BhY2l0eVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Q29sb3IgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtY29sb3JcIiwgQ3VzdG9tRWxlbWVudENvbG9yLCDGki5Db2xvcik7XHJcbiAgICBwdWJsaWMgY29sb3I6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgcGlja2VyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBwaWNrZXIudHlwZSA9IFwiY29sb3JcIjtcclxuXHJcbiAgICAgIHBpY2tlci50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocGlja2VyKTtcclxuXHJcbiAgICAgIGxldCBzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHNsaWRlci50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgICBzbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICAgIHNsaWRlci5tYXggPSBcIjFcIjtcclxuICAgICAgc2xpZGVyLnN0ZXAgPSBcIjAuMDFcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG4gICAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlcyBvZiBwaWNrZXIgYW5kIHNsaWRlciBhcyDGki5NdXRhdG9yXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBoZXg6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZTtcclxuICAgICAgbGV0IGFscGhhOiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWU7XHJcbiAgICAgIHRoaXMuY29sb3Iuc2V0SGV4KGhleC5zdWJzdHIoMSwgNikgKyBcImZmXCIpO1xyXG4gICAgICB0aGlzLmNvbG9yLmEgPSBwYXJzZUZsb2F0KGFscGhhKTtcclxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdmFsdWVzIG9mIGNvbG9yIHBpY2tlciBhbmQgc2xpZGVyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29sb3IubXV0YXRlKF92YWx1ZSk7XHJcbiAgICAgIGxldCBoZXg6IHN0cmluZyA9IHRoaXMuY29sb3IuZ2V0SGV4KCk7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZSA9IFwiI1wiICsgaGV4LnN1YnN0cigwLCA2KTtcclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlID0gdGhpcy5jb2xvci5hLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaG5kV2hlZWwoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCk7XHJcbiAgICAgIGlmIChzbGlkZXIgIT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgbGV0IGN1cnJlbnRWYWx1ZTogbnVtYmVyID0gTnVtYmVyKHNsaWRlci52YWx1ZSk7XHJcbiAgICAgIHNsaWRlci52YWx1ZSA9IFN0cmluZyhjdXJyZW50VmFsdWUgLSBfZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgIHNsaWRlci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBSZXByZXNlbnRzIGEgc2luZ2xlIGRpZ2l0IG51bWJlciB0byBiZSB1c2VkIGluIGdyb3VwcyB0byByZXByZXNlbnQgYSBtdWx0aWRpZ2l0IHZhbHVlLlxyXG4gICAqIElzIHRhYmJhYmxlIGFuZCBpbi0vZGVjcmVhc2VzIHByZXZpb3VzIHNpYmxpbmcgd2hlbiBmbG93aW5nIG92ZXIvdW5kZXIuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnREaWdpdCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtZGlnaXRcIiwgQ3VzdG9tRWxlbWVudERpZ2l0KTtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUoX3ZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgX3ZhbHVlID0gTWF0aC50cnVuYyhfdmFsdWUpO1xyXG4gICAgICBpZiAoX3ZhbHVlID4gOSB8fCBfdmFsdWUgPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IF92YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMudGV4dENvbnRlbnQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gLTE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGQoX2FkZGVuZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIF9hZGRlbmQgPSBNYXRoLnRydW5jKF9hZGRlbmQpO1xyXG4gICAgICBpZiAoX2FkZGVuZCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfYWRkZW5kID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlIDwgOSlcclxuICAgICAgICAgIHRoaXMudmFsdWUrKztcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKDEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlID4gMClcclxuICAgICAgICAgIHRoaXMudmFsdWUtLTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKC0xKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSA5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIEN1c3RvbUVsZW1lbnQgZnJvbSBhbiBIVE1MLVRlbXBsYXRlLVRhZ1xyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50VGVtcGxhdGUgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZyYWdtZW50OiBNYXA8c3RyaW5nLCBEb2N1bWVudEZyYWdtZW50PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJyb3dzZXMgdGhyb3VnaCB0aGUgdGVtcGxhdGVzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZCByZWdpc3RlcnMgdGhlIG9uZSBkZWZpbmluZyB0aGUgZ2l2ZW4gdGFnbmFtZS5cclxuICAgICAqIFRvIGJlIGNhbGxlZCBmcm9tIGEgc2NyaXB0IHRhZyBpbXBsZW1lbnRlZCB3aXRoIHRoZSB0ZW1wbGF0ZSBpbiBIVE1MLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWdOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgdGVtcGxhdGUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRlbXBsYXRlXCIpKSB7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQubG9jYWxOYW1lID09IF90YWdOYW1lKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIlJlZ2lzdGVyXCIsIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LnNldChfdGFnTmFtZSwgdGVtcGxhdGUuY29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0ge307XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcIltrZXlcIik7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5fVwiXWApO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZG4ndCBmaW5kICR7a2V5fSBpbmAsIHRoaXMpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZSwgdGhlIGVsZW1lbnQgZ2V0cyBjb25zdHJ1Y3RlZCBhcyBhIGRlZXAgY2xvbmUgb2YgdGhlIHRlbXBsYXRlLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgPSBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuZ2V0KFJlZmxlY3QuZ2V0KHRoaXMuY29uc3RydWN0b3IsIFwidGFnXCIpKTtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmZyYWdtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuICAgICAgbGV0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gdGhpcy5zdHlsZTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgY29udGVudC5zdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KGVudHJ5LCBSZWZsZWN0LmdldChjb250ZW50LnN0eWxlLCBlbnRyeSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNvbnRlbnQuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4M3gzIGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgc2NhbGluZzoge30sIHJvdGF0aW9uOiAwIH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcblxyXG4gICAgICBtdXRhdG9yW1wicm90YXRpb25cIl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcihfbXV0YXRvcltcInJvdGF0aW9uXCJdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXg0eDQgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHJvdGF0aW9uOiB7fSwgc2NhbGluZzoge30gfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgZHJvcGRvd24gbWVudSB0byBkaXNwbGF5IGVudW1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTZWxlY3QgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRTZWxlY3QsIE9iamVjdCk7XHJcbiAgICBwdWJsaWMgY29udGVudDogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIF9jb250ZW50OiBPYmplY3QgPSB7fSkge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRoaXMuY29udGVudCwgdmFsdWUpICYmIFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwgdmFsdWUpICE9PSBrZXkpIC8vIGZpbHRlciBudW1iZXIga2V5cyBvdXQgb2Ygc2ltcGxlIGVudW0gXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZW9mIHZhbHVlKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICAgICAgaWYgKGVudHJ5LnZhbHVlID09IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcclxuICAgICAgICAgIGVudHJ5LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZWN0LnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XT8uZ2V0QXR0cmlidXRlKFwidHlwZVwiKSB8fCBcInN0cmluZ1wiO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PSBcIm51bWJlclwiID8gcGFyc2VGbG9hdChzZWxlY3QudmFsdWUpIDogc2VsZWN0LnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICAvLyB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gaW50ZXJhY3RpdmUgbnVtYmVyIHN0ZXBwZXIgd2l0aCBleHBvbmVudGlhbCBkaXNwbGF5IGFuZCBjb21wbGV4IGhhbmRsaW5nIHVzaW5nIGtleWJvYXJkIGFuZCBtb3VzZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U3RlcHBlciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zdGVwcGVyXCIsIEN1c3RvbUVsZW1lbnRTdGVwcGVyLCBOdW1iZXIpO1xyXG4gICAgcHVibGljIHZhbHVlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMgJiYgX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSlcclxuICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdChfYXR0cmlidXRlc1tcInZhbHVlXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7IF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuXHJcbiAgICAgIGxldCBzaWduOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgc2lnbi50ZXh0Q29udGVudCA9IFwiK1wiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNpZ24pO1xyXG4gICAgICBmb3IgKGxldCBleHA6IG51bWJlciA9IDI7IGV4cCA+IC00OyBleHAtLSkge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gbmV3IEN1c3RvbUVsZW1lbnREaWdpdCgpO1xyXG4gICAgICAgIGRpZ2l0LnNldEF0dHJpYnV0ZShcImV4cFwiLCBleHAudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkaWdpdCk7XHJcbiAgICAgICAgaWYgKGV4cCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCIuXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCJlXCI7XHJcblxyXG4gICAgICBsZXQgZXhwOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZXhwLnRleHRDb250ZW50ID0gXCIrMFwiO1xyXG4gICAgICBleHAudGFiSW5kZXggPSAtMTtcclxuICAgICAgZXhwLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJleHBcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZXhwKTtcclxuXHJcblxyXG4gICAgICAvLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGUtL0FjdGl2YXRlcyB0YWJiaW5nIGZvciB0aGUgaW5uZXIgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZUlubmVyVGFicyhfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBfb24gPyAwIDogLTE7XHJcblxyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICAgIHNwYW5zWzFdLnRhYkluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgZm9yIChsZXQgZGlnaXQgb2YgZGlnaXRzKVxyXG4gICAgICAgIGRpZ2l0LnRhYkluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVucy9DbG9zZXMgYSBzdGFuZGFyZCBudW1iZXIgaW5wdXQgZm9yIHR5cGluZyB0aGUgdmFsdWUgYXQgb25jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb3BlbklucHV0KF9vcGVuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoX29wZW4pIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BsYXlzIGl0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBtYW50aXNzYSBhbmQgZXhwb25lbnQgc2VwYXJhdGVseSBhcyBhbiBhcnJheSBvZiB0d28gbWVtYmVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpOiBudW1iZXJbXSB7XHJcbiAgICAgIGxldCBwcmVjOiBzdHJpbmcgPSB0aGlzLnZhbHVlLnRvRXhwb25lbnRpYWwoNik7XHJcbiAgICAgIGxldCBleHA6IG51bWJlciA9IHBhcnNlSW50KHByZWMuc3BsaXQoXCJlXCIpWzFdKTtcclxuICAgICAgbGV0IGV4cDM6IG51bWJlciA9IE1hdGgudHJ1bmMoZXhwIC8gMyk7XHJcbiAgICAgIGxldCBtYW50aXNzYTogbnVtYmVyID0gdGhpcy52YWx1ZSAvIE1hdGgucG93KDEwLCBleHAzICogMyk7XHJcbiAgICAgIG1hbnRpc3NhID0gTWF0aC5yb3VuZChtYW50aXNzYSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgcmV0dXJuIFttYW50aXNzYSwgZXhwMyAqIDNdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoaXMgdmFsdWUgYXMgYSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIGxldCBwcmVmaXhNYW50aXNzYTogc3RyaW5nID0gKG1hbnRpc3NhIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIGxldCBwcmVmaXhFeHA6IHN0cmluZyA9IChleHAgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgcmV0dXJuIHByZWZpeE1hbnRpc3NhICsgbWFudGlzc2EudG9GaXhlZCgzKSArIFwiZVwiICsgcHJlZml4RXhwICsgZXhwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheXMgdGhpcyB2YWx1ZSBieSBzZXR0aW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZGlnaXRzIGFuZCB0aGUgZXhwb25lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCIgIOKIniAgIFwiWzUgLSBwb3NdO1xyXG4gICAgICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBcIiAgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogc3RyaW5nW10gPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCJlXCIpO1xyXG4gICAgICBzcGFuc1swXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWUgPCAwID8gXCItXCIgOiBcIitcIjtcclxuICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBleHA7XHJcblxyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnN1YnN0cmluZygxKTtcclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5yZXBsYWNlKFwiLlwiLCBcIlwiKTtcclxuICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgIGlmIChwb3MgPCBtYW50aXNzYS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxldCBjaGFyOiBzdHJpbmcgPSBtYW50aXNzYS5jaGFyQXQobWFudGlzc2EubGVuZ3RoIC0gMSAtIHBvcyk7XHJcbiAgICAgICAgICBkaWdpdC50ZXh0Q29udGVudCA9IGNoYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiJm5ic3A7XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBrZXlib2FyZCBpbnB1dCBvbiB0aGlzIGVsZW1lbnQgYW5kIGl0cyBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBhY3RpdmU6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBsZXQgbnVtRW50ZXJlZDogbnVtYmVyID0gX2V2ZW50LmtleS5jaGFyQ29kZUF0KDApIC0gNDg7XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyBpZiBmb2N1cyBpcyBvbiBzdGVwcGVyLCBlbnRlciBpdCBhbmQgZm9jdXMgZGlnaXRcclxuICAgICAgaWYgKGFjdGl2ZSA9PSB0aGlzKSB7XHJcbiAgICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKHRydWUpO1xyXG4gICAgICAgICAgICAoPEhUTUxFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpWzJdKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHx8IF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaW5wdXQgZmllbGQgb3ZlcmxheSBpcyBhY3RpdmVcclxuICAgICAgaWYgKGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUikge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IE51bWJlcigoPEhUTUxJbnB1dEVsZW1lbnQ+YWN0aXZlKS52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHtcclxuICAgICAgICBsZXQgZGlmZmVyZW5jZTogbnVtYmVyID0gbnVtRW50ZXJlZCAtIE51bWJlcihhY3RpdmUudGV4dENvbnRlbnQpICogKHRoaXMudmFsdWUgPCAwID8gLTEgOiAxKTtcclxuICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoZGlmZmVyZW5jZSk7XHJcblxyXG4gICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSAoX2V2ZW50LmtleSA9PSBcIi1cIiA/IC0xIDogMSkgKiBNYXRoLmFicyh0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKVxyXG4gICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKC0xKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoKzEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgKDxIVE1MRWxlbWVudD5hY3RpdmUucHJldmlvdXNFbGVtZW50U2libGluZykuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFdoZWVsID0gKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgY2hhbmdlOiBudW1iZXIgPSBfZXZlbnQuZGVsdGFZIDwgMCA/ICsxIDogLTE7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZChjaGFuZ2UpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hhbmdlRGlnaXRGb2N1c3NlZChfYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZ2l0OiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMgfHwgIXRoaXMuY29udGFpbnMoZGlnaXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9hbW91bnQgPSBNYXRoLnJvdW5kKF9hbW91bnQpO1xyXG4gICAgICBpZiAoX2Ftb3VudCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJbbmFtZT1leHBdXCIpKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy52YWx1ZSk7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSB0aGlzLnZhbHVlICogTWF0aC5wb3coMTAsIF9hbW91bnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUodmFsdWUpKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOyBcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBleHBEaWdpdDogbnVtYmVyID0gcGFyc2VJbnQoZGlnaXQuZ2V0QXR0cmlidXRlKFwiZXhwXCIpKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZSAobWFudGlzc2Egbm90IHVzZWQpXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cFZhbHVlXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuXHJcbiAgICAgIGxldCBwcmV2OiBudW1iZXIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlICs9IF9hbW91bnQgKiBNYXRoLnBvdygxMCwgZXhwRGlnaXQgKyBleHBWYWx1ZSk7XHJcbiAgICAgIC8vIHdvcmthcm91bmQgcHJlY2lzaW9uIHByb2JsZW1zIG9mIGphdmFzY3JpcHRcclxuICAgICAgaWYgKE1hdGguYWJzKHByZXYgLyB0aGlzLnZhbHVlKSA+IDEwMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcblxyXG5cclxuICAgICAgbGV0IGV4cE5ldzogbnVtYmVyO1xyXG4gICAgICBbbWFudGlzc2EsIGV4cE5ld10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobWFudGlzc2EpO1xyXG4gICAgICB0aGlzLnNoaWZ0Rm9jdXMoZXhwTmV3IC0gZXhwVmFsdWUpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNoaWZ0Rm9jdXMoX25EaWdpdHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc2hpZnRGb2N1czogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChfbkRpZ2l0cykge1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspXHJcbiAgICAgICAgICBpZiAoX25EaWdpdHMgPiAwKVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+c2hpZnRGb2N1cykuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50VGV4dElucHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXRleHRpbnB1dFwiLCBDdXN0b21FbGVtZW50VGV4dElucHV0LCBTdHJpbmcpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG4gICAgICBcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHMgZXh0ZW5kcyBIVE1MRGV0YWlsc0VsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcgPSBcIlwiLCBfdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgY2hhbmdpbmcgYW5pbWF0aW9uIHN0cnVjdHVyZSB0byBsb29rIG1vcmUgbGlrZSBhIG11dGF0b3JcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAgIHRoaXMub3BlbiA9IHRydWU7XHJcbiAgICAgIGxldCBsYmxTdW1tYXJ5OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xyXG4gICAgICBsYmxTdW1tYXJ5LnRleHRDb250ZW50ID0gX2xlZ2VuZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChsYmxTdW1tYXJ5KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfU0VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRPR0dMRSwgdGhpcy5obmRUb2dnbGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIC8vIHJldHVybiB0aGlzLmV4cGFuZGVyLmNoZWNrZWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRlbnQoX2NvbnRlbnQ6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVwbGFjZUNoaWxkKF9jb250ZW50LCB0aGlzLmNvbnRlbnQpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgLy8gdGhpcy5leHBhbmRlci5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5vcGVuID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5obmRUb2dnbGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb2dnbGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50KVxyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0aGlzLmlzRXhwYW5kZWQgPyBFVkVOVC5FWFBBTkQgOiBFVkVOVC5DT0xMQVBTRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXRzOiBOb2RlTGlzdE9mPEhUTUxEZXRhaWxzRWxlbWVudD4gPSBwcmV2aW91cy5xdWVyeVNlbGVjdG9yQWxsKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IHNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgICBkbyB7IC8vIGZvY3VzIHRoZSBsYXN0IHZpc2libGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZXRzWy0taV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9IHdoaWxlICghc2V0c1tpXS5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1NFVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIC8vIGxldCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU5TRVJUIGF0IERldGFpbHNcIik7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULklOU0VSVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHRoaXMgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBpZiAoIXRoaXMuaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZClcclxuICAgICAgICAgICAgbmV4dCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImRldGFpbHNcIik7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICBuZXh0ID0gPEhUTUxFbGVtZW50Pm5leHQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICB9IHdoaWxlIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSk7XHJcblxyXG4gICAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgIC8vIG5leHQuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVF9UUkVFLkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgIGlmICh0aGlzLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgcHJldmlvdXMgPSA8SFRNTEVsZW1lbnQ+cHJldmlvdXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIH0gd2hpbGUgKHByZXZpb3VzICYmICEocHJldmlvdXMgaW5zdGFuY2VvZiBEZXRhaWxzKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHByZXZpb3VzKVxyXG4gICAgICAgICAgICBpZiAoKDxEZXRhaWxzPnByZXZpb3VzKS5pc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBwcmV2aW91cy5mb2N1cygpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19TRVQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcGFzc0V2ZW50KVxyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gVE9ETzogdXNlIEN1c3RvbUVsZW1lbnQucmVnaXN0ZXI/XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktZGV0YWlsc1wiLCBEZXRhaWxzLCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHNBcnJheSBleHRlbmRzIERldGFpbHMge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX2xlZ2VuZCwgXCJBcnJheVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuc2V0Q29udGVudChfY29udGVudCk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgbXV0YXRvci5wdXNoKGNoaWxkLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50TGlzdGVuZXJzKF9jaGlsZDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgX2NoaWxkLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5U3BlY2lhbCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgICBfY2hpbGQudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhcnJhbmdlKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc2VxdWVuY2UucHVzaChwYXJzZUludChjaGlsZC5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0Rm9jdXMoX2ZvY3VzKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGtleTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIHNlcXVlbmNlOiBzZXF1ZW5jZSB9IH0pKTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnNldExhYmVsKVxyXG4gICAgICAgICAgY2hpbGQuc2V0TGFiZWwoY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hpbGQudGFiSW5kZXgpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9jdXMoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgaWYgKF9mb2N1cyA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZm9jdXMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihfZm9jdXMsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBjaGlsZDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb250ZW50LmNoaWxkcmVuW19mb2N1c107XHJcbiAgICAgIGNoaWxkPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdDsgXHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluZGV4XCIsIGtleURyYWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyhrZXlEcmFnKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGRyb3A6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICBsZXQga2V5RHJvcDogc3RyaW5nID0gZHJvcC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSBfZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbmRleFwiKTtcclxuICAgICAgbGV0IGRyYWc6IEhUTUxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXlEcmFnfVwiXWApO1xyXG4gICAgICBsZXQgbGFiZWxEcmFnOiBzdHJpbmcgPSBkcmFnLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cclxuICAgICAgbGV0IHBvc2l0aW9uOiBJbnNlcnRQb3NpdGlvbiA9IGtleURyYWcgPiBrZXlEcm9wID8gXCJiZWZvcmViZWdpblwiIDogXCJhZnRlcmVuZFwiO1xyXG4gICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgZHJhZyA9IDxIVE1MRWxlbWVudD5kcmFnLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgZHJhZy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBsYWJlbERyYWcpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcmFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJhZyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkcm9wLmluc2VydEFkamFjZW50RWxlbWVudChwb3NpdGlvbiwgZHJhZyk7XHJcblxyXG4gICAgICB0aGlzLnJlYXJyYW5nZSgpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGRyYWcpO1xyXG4gICAgICBkcmFnLmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiaG5kSW5zZXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleVNwZWNpYWwgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgIC8vIG9ubHkgd29yayBvbiBpdGVtcyBvZiBsaXN0LCBub3QgdGhlaXIgY2hpbGRyZW5cclxuICAgICAgaWYgKCg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkgIT0gaXRlbSAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IG51bWJlciA9IHBhcnNlSW50KGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICBsZXQgc2libGluZzogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgaW5zZXJ0OiBIVE1MRWxlbWVudCA9IGl0ZW07XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAvLyAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzQXJyYXlcIik7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGb2N1cygtLWZvY3VzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGluc2VydCA9IDxIVE1MRWxlbWVudD5pdGVtLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgaW5zZXJ0LnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGluc2VydCk7XHJcbiAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgc2libGluZyA9IDxIVE1MRWxlbWVudD5pdGVtLnByZXZpb3VzU2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWJlZ2luXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgtLWZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoKytmb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgrK2ZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudCkge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVpLWxpc3RcIiwgRGV0YWlsc0FycmF5LCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIG9yIG5vbi1tb2RhbCBkaWFsb2cgd2l0aCBhbiBpbnRlcmZhY2UgZm9yIHRoZSBnaXZlbiBtdXRhdG9yLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBEaWFsb2cge1xyXG4gICAgcHVibGljIHN0YXRpYyBkb206IEhUTUxEaWFsb2dFbGVtZW50O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9tcHQgdGhlIGRpYWxvZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgY2FsbCB0byBhY3Rpb24gYW5kIGxhYmVscyBmb3IgdGhlIGNhbmNlbC0gYW5kIG9rLWJ1dHRvblxyXG4gICAgICogVXNlIGBhd2FpdGAgb24gY2FsbCwgdG8gY29udGludWUgYWZ0ZXIgdGhlIHVzZXIgaGFzIHByZXNzZWQgb25lIG9mIHRoZSBidXR0b25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHByb21wdChfZGF0YTogxpIuTXV0YWJsZSB8IMaSLk11dGF0b3IgfCBPYmplY3QsIF9tb2RhbDogYm9vbGVhbiA9IHRydWUsIF9oZWFkOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF9jYWxsVG9BY3Rpb246IHN0cmluZyA9IFwiSW5zdHJ1Y3Rpb25cIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIsIF9jYW5jZWw6IHN0cmluZyA9IFwiQ2FuY2VsXCIpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgRGlhbG9nLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoRGlhbG9nLmRvbSk7XHJcbiAgICAgIERpYWxvZy5kb20uaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZCArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgaWYgKF9kYXRhIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9kYXRhKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX2RhdGEpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIERpYWxvZy5kb20uYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX2NhbGxUb0FjdGlvbiArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuQ2FuY2VsOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bkNhbmNlbC5pbm5lckhUTUwgPSBfY2FuY2VsO1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuQ2FuY2VsKTtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgRGlhbG9nLmRvbS5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICBpZiAoX21vZGFsKVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvd01vZGFsKCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBEaWFsb2cuZG9tLnNob3coKTtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoX3Jlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgaG5kQnV0dG9uOiAoX2V2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBidG5DYW5jZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgICBidG5Pay5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IGJ0bk9rKVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihjb250ZW50LCBfZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lKSB7XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcuaW5mbyhfZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgRGlhbG9nLmRvbS5jbG9zZSgpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChEaWFsb2cuZG9tKTtcclxuICAgICAgICAgIF9yZXNvbHZlKF9ldmVudC50YXJnZXQgPT0gYnRuT2spO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgYnRuT2suYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgICAvKipcclxuICAgICAqIDxzZWxlY3Q+PG9wdGlvbj5IYWxsbzwvb3B0aW9uPjwvc2VsZWN0PlxyXG4gICAgICovXHJcbiAgICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE11bHRpTGV2ZWxNZW51TWFuYWdlciB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYnVpbGRGcm9tU2lnbmF0dXJlKF9zaWduYXR1cmU6IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgICAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwge307XHJcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmVMZXZlbHM6IHN0cmluZ1tdID0gX3NpZ25hdHVyZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIGlmIChzaWduYXR1cmVMZXZlbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN1YlNpZ25hdHVyZTogc3RyaW5nID0gc2lnbmF0dXJlTGV2ZWxzWzFdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMjsgaSA8IHNpZ25hdHVyZUxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YlNpZ25hdHVyZSA9IHN1YlNpZ25hdHVyZSArIFwiLlwiICsgc2lnbmF0dXJlTGV2ZWxzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSwgPMaSLk11dGF0b3I+bXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gPSBzaWduYXR1cmVMZXZlbHNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyB0byBkaXNwbGF5IGEgbW9kYWwgd2FybmluZy5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgV2FybmluZyB7XHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgYSB3YXJuaW5nIHRvIHRoZSB1c2VyIHdpdGggdGhlIGdpdmVuIGhlYWRsaW5lLCB3YXJuaW5nIHRleHQgYW5kIG9rIGJ1dHRlbiB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BsYXkoX2Vycm9yczogc3RyaW5nW10gPSBbXSwgX2hlYWRsaW5lOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF93YXJuaW5nOiBzdHJpbmcgPSBcIldhcm5pbmdcIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIpOiB2b2lkIHtcclxuICAgICAgbGV0IHdhcm5pbmc6IEhUTUxEaWFsb2dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpYWxvZ1wiKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3YXJuaW5nKTtcclxuICAgICAgd2FybmluZy5pbm5lckhUTUwgPSBcIjxoMT5cIiArIF9oZWFkbGluZSArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRlbnQuaWQgPSBcImNvbnRlbnRcIjtcclxuICAgICAgY29udGVudC5pbm5lclRleHQgPSBfZXJyb3JzLmpvaW4oXCJcXG5cIik7XHJcbiAgICAgIHdhcm5pbmcuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX3dhcm5pbmcgKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgYnRuT2sub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB3YXJuaW5nLmNsb3NlKCk7XHJcbiAgICAgICAgd2FybmluZy5yZW1vdmUoKTtcclxuICAgICAgfTtcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgd2FybmluZy5zaG93TW9kYWwoKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHVsLWVsZW1lbnQgdGhhdCBrZWVwcyBhIGxpc3Qgb2Yge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgdG8gcmVwcmVzZW50IGEgYnJhbmNoIGluIGEgdHJlZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21UcmVlTGlzdDxUPiBleHRlbmRzIEhUTUxVTGlzdEVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogQ3VzdG9tVHJlZUNvbnRyb2xsZXI8VD4sIF9pdGVtczogQ3VzdG9tVHJlZUl0ZW08VD5bXSA9IFtdKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKF9pdGVtcyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidHJlZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aHMgdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aHMgaW5jbHVkZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfcGF0aHM6IFRbXVtdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IHBhdGggb2YgX3BhdGhzKVxyXG4gICAgICAgIHRoaXMuc2hvdyhwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGggdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aCBpbmNsdWRlcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3coX3BhdGg6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgY3VycmVudFRyZWU6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcztcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgX3BhdGgpIHtcclxuICAgICAgICBsZXQgaXRlbTogQ3VzdG9tVHJlZUl0ZW08VD4gPSBjdXJyZW50VHJlZS5maW5kSXRlbShkYXRhKTtcclxuICAgICAgICBpZiAoIWl0ZW0pXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIWl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBpdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgICAgY3VycmVudFRyZWUgPSBpdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0cnVjdHVyZXMgdGhlIGxpc3QgdG8gc3luYyB3aXRoIHRoZSBnaXZlbiBsaXN0LiBcclxuICAgICAqIHtAbGluayBDdXN0b21UcmVlSXRlbX1zIHJlZmVyZW5jaW5nIHRoZSBzYW1lIG9iamVjdCByZW1haW4gaW4gdGhlIGxpc3QsIG5ldyBpdGVtcyBnZXQgYWRkZWQgaW4gdGhlIG9yZGVyIG9mIGFwcGVhcmFuY2UsIG9ic29sZXRlIG9uZXMgYXJlIGRlbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0gX3RyZWUgQSBsaXN0IHRvIHN5bmMgdGhpcyB3aXRoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN0cnVjdHVyZShfdHJlZTogQ3VzdG9tVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBDdXN0b21UcmVlSXRlbTxUPltdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX3RyZWUuZ2V0SXRlbXMoKSkge1xyXG4gICAgICAgIGxldCBmb3VuZDogQ3VzdG9tVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRJdGVtKGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICBmb3VuZC5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICAgICAgZm91bmQuaGFzQ2hpbGRyZW4gPSBpdGVtLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgICAgaWYgKCFmb3VuZC5oYXNDaGlsZHJlbilcclxuICAgICAgICAgICAgZm91bmQuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgIGl0ZW1zLnB1c2goZm91bmQpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUge0BsaW5rIEN1c3RvbVRyZWVJdGVtfSBvZiB0aGlzIGxpc3QgcmVmZXJlbmNpbmcgdGhlIGdpdmVuIG9iamVjdCBvciBudWxsLCBpZiBub3QgZm91bmRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZpbmRJdGVtKF9kYXRhOiBUKTogQ3VzdG9tVHJlZUl0ZW08VD4ge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoKDxDdXN0b21UcmVlSXRlbTxUPj5pdGVtKS5kYXRhLCBfZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gPEN1c3RvbVRyZWVJdGVtPFQ+Pml0ZW07XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGdpdmVuIHtAbGluayBDdXN0b21UcmVlSXRlbX1zIGF0IHRoZSBlbmQgb2YgdGhpcyBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRJdGVtcyhfaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfaXRlbXMpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb250ZW50IG9mIHRoaXMgbGlzdCBhcyBhcnJheSBvZiB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SXRlbXMoKTogQ3VzdG9tVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiA8Q3VzdG9tVHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmZpbHRlcihfY2hpbGQgPT4gX2NoaWxkIGluc3RhbmNlb2YgQ3VzdG9tVHJlZUl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwbGF5U2VsZWN0aW9uKF9kYXRhOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPEN1c3RvbVRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPEN1c3RvbVRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhU3RhcnQpKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBfZGF0YUVuZCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIGVuZCkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGUoX2RhdGE6IFRbXSk6IEN1c3RvbVRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGVsZXRlZDogQ3VzdG9tVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpZiAoX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpIHtcclxuICAgICAgICAgIGl0ZW0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRWaXNpYmxlKF9kYXRhOiBUKTogQ3VzdG9tVHJlZUl0ZW08VD4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKF9kYXRhLCBpdGVtLmRhdGEpKVxyXG4gICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbGwgZXhwYW5kZWQge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgdGhhdCBhcmUgYSBkZXNjZW5kYW50IG9mIHRoaXMgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEV4cGFuZGVkKCk6IEN1c3RvbVRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gWy4uLnRoaXNdLmZpbHRlcihfaXRlbSA9PiBfaXRlbS5leHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxDdXN0b21UcmVlSXRlbTxUPj4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgeWllbGQgaXRlbXNbaV07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFQgPSAoPEN1c3RvbVRyZWVJdGVtPFQ+PnRoaXMucGFyZW50RWxlbWVudCkuZGF0YTtcclxuICAgICAgaWYgKHRhcmdldCA9PSBudWxsIHx8ICF0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRhcmdldCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcylcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0YXJnZXRJdGVtOiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQuY29tcG9zZWRQYXRoKCkuZmluZChfdGFyZ2V0ID0+IF90YXJnZXQgaW5zdGFuY2VvZiBDdXN0b21UcmVlSXRlbSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0SXRlbXMoKS5pbmNsdWRlcyh0YXJnZXRJdGVtKSkge1xyXG4gICAgICAgICAgbGV0IHJlY3Q6IERPTVJlY3QgPSB0YXJnZXRJdGVtLmNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICBsZXQgYWRkQmVmb3JlOiBib29sZWFuID0gX2V2ZW50LmNsaWVudFkgPCByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgIGxldCBzaWJsaW5nOiBFbGVtZW50ID0gYWRkQmVmb3JlID8gdGFyZ2V0SXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDogdGFyZ2V0SXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZyAhPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpXHJcbiAgICAgICAgICAgIGlmIChhZGRCZWZvcmUpXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5iZWZvcmUodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHRhcmdldEl0ZW0uYWZ0ZXIodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCA9IHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5pc0Nvbm5lY3RlZCA/XHJcbiAgICAgICAgQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5pbmRleE9mKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcikgOlxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCA9IG51bGw7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtY3VzdG9tLXRyZWUtbGlzdFwiLCBDdXN0b21UcmVlTGlzdCwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21UcmVlTGlzdC50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9IHRoYXQgcmVwcmVzZW50cyB0aGUgcm9vdCBvZiBhIHRyZWUgY29udHJvbCAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIHRyZWUgPHVsPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIg4pSUIHRyZWVMaXN0IDx1bD5cclxuICAgKiDilIIgICDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiAgIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tVHJlZTxUPiBleHRlbmRzIEN1c3RvbVRyZWVMaXN0PFQ+IHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+LCBfcm9vdDogVCkge1xyXG4gICAgICBzdXBlcihfY29udHJvbGxlciwgW10pO1xyXG4gICAgICBsZXQgcm9vdDogQ3VzdG9tVHJlZUl0ZW08VD4gPSBuZXcgQ3VzdG9tVHJlZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBfcm9vdCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV4cGFuZCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TRUxFQ1QsIHRoaXMuaG5kU2VsZWN0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0xFQVZFLCB0aGlzLmhuZERyYWdMZWF2ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ERUxFVEUsIHRoaXMuaG5kRGVsZXRlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXMgb3IgbnVsbCBpZiBub25lIGlzIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBDdXN0b21UcmVlSXRlbTxUPltdID0gPEN1c3RvbVRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8Q3VzdG9tVHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCB0aGUgd2hvbGUgdHJlZSB0byBzeW5jaHJvbml6ZSB3aXRoIHRoZSBkYXRhIHRoZSB0cmVlIGlzIGJhc2VkIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcykge1xyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgYnJhbmNoOiBDdXN0b21UcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpKTtcclxuICAgICAgICBpdGVtLmdldEJyYW5jaCgpLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oaXRlbS5kYXRhKSlcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gY2hpbGRyZW4gdG8gdGhlIGdpdmVuIHRhcmdldCBhdCB0aGUgZ2l2ZW4gaW5kZXguIElmIG5vIGluZGV4IGlzIGdpdmVuLCB0aGUgY2hpbGRyZW4gYXJlIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihfY2hpbGRyZW4sIF90YXJnZXQsIF9pbmRleCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogVCA9IHRoaXMuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgLy8gVE9ETzogZG9uJ3QsIHdoZW4gY29weWluZyBvciBjb21pbmcgZnJvbSBhbm90aGVyIHNvdXJjZVxyXG4gICAgICB0aGlzLmRlbGV0ZShtb3ZlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXREYXRhOiBUID0gPFQ+X3RhcmdldDtcclxuICAgICAgbGV0IHRhcmdldEl0ZW06IEN1c3RvbVRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kVmlzaWJsZSh0YXJnZXREYXRhKTtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKHRhcmdldERhdGEpKTtcclxuICAgICAgbGV0IG9sZDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSB0YXJnZXRJdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB0YXJnZXRJdGVtLmhhc0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgaWYgKG9sZClcclxuICAgICAgICBvbGQucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRhcmdldEl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5maW5kVmlzaWJsZShmb2N1cyk/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFeHBhbmQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbTogQ3VzdG9tVHJlZUl0ZW08VD4gPSA8Q3VzdG9tVHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGNoaWxkcmVuOiBUW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKTtcclxuICAgICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBDdXN0b21UcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKGNoaWxkcmVuKTtcclxuICAgICAgaXRlbS5zZXRCcmFuY2goYnJhbmNoKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQnJhbmNoKF9kYXRhOiBUW10pOiBDdXN0b21UcmVlTGlzdDxUPiB7XHJcbiAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gbmV3IEN1c3RvbVRyZWVMaXN0PFQ+KHRoaXMuY29udHJvbGxlciwgW10pO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfZGF0YSkge1xyXG4gICAgICAgIGJyYW5jaC5hZGRJdGVtcyhbbmV3IEN1c3RvbVRyZWVJdGVtKHRoaXMuY29udHJvbGxlciwgY2hpbGQpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJyYW5jaDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0LCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AuYXQpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0xlYXZlID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCByZWxhdGVkVGFyZ2V0OiBFdmVudFRhcmdldCA9IF9ldmVudC5yZWxhdGVkVGFyZ2V0O1xyXG4gICAgICBpZiAocmVsYXRlZFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICF0aGlzLmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQpICYmICF0aGlzLmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQub2Zmc2V0UGFyZW50KSkgLy8gb2Zmc2V0IHBhcmVudCBpcyBmb3Igd2VpcmQgKGludmlzaWJsZSkgZGl2cyB3aGljaCBhcmUgcGxhY2VkIG92ZXIgaW5wdXQgZWxlbWVudHMgYW5kIHRyaWdnZXIgbGVhdmUgZXZlbnRzLi4uIFxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCByZW1vdmU6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW3RhcmdldC5kYXRhXSk7XHJcbiAgICAgIHRoaXMuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogQ3VzdG9tVHJlZUl0ZW08VD4gPSA8Q3VzdG9tVHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcyA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jb3B5KFsuLi50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuY29weVBhc3RlLnNvdXJjZXMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSA8Q3VzdG9tVHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogQ3VzdG9tVHJlZUl0ZW08VD4gPSA8Q3VzdG9tVHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8Q3VzdG9tVHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLWN1c3RvbS10cmVlXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+Q3VzdG9tVHJlZSwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEge0BsaW5rIEN1c3RvbVRyZWV9IHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIHtAbGluayBDdXN0b21UcmVlfSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21UcmVlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcDogeyBzb3VyY2VzOiBUW107IHRhcmdldDogVDsgYXQ/OiBudW1iZXIgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIG9iamVjdHMgYmVpbmcgZHJhZ2dlZCwgYW5kIG9iamVjdHMgdG8gZHJvcCBvbi4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgZHJhZyZkcm9wIHNob3VsZCBvcGVyYXRlIG91dHNpZGUgb2YgdHJlZSAqL1xyXG4gICAgcHVibGljIGNvcHlQYXN0ZTogeyBzb3VyY2VzOiBUW107IHRhcmdldDogVCB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcblxyXG4gICAgLyoqIFVzZWQgYnkgdGhlIHRyZWUgdG8gaW5kaWNhdGUgdGhlIGRyb3AgcG9zaXRpb24gd2hpbGUgZHJhZ2dpbmcgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcEluZGljYXRvcjogSFRNTEhSRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoclwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGRyYWdnYWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ2dhYmxlKF9vYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdHdvIG9iamVjdHMgb2YgYXJlIGVxdWFsLiBEZWZhdWx0IGlzIF9hID09IF9iLiBPdmVycmlkZSBmb3IgbW9yZSBjb21wbGV4IGNvbXBhcmlzb25zLiBcclxuICAgICAqIFVzZWZ1bCB3aGVuIHRoZSB1bmRlcmx5aW5nIGRhdGEgaXMgdm9sYXRpbGUgYW5kIGNoYW5nZXMgaWRlbnRpdHkgd2hpbGUgc3RheWluZyB0aGUgc2FtZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyhfYTogVCwgX2I6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hID09IF9iO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgYWRkYWJsZSB0byBvdGhlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIENyZWF0ZSBhbiBIVE1MRm9ybUVsZW1lbnQgZm9yIHRoZSB0cmVlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjcmVhdGVDb250ZW50KF9vYmplY3Q6IFQpOiBIVE1MRmllbGRTZXRFbGVtZW50O1xyXG5cclxuICAgIC8qKiBSZXRyaWV2ZSBhIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2YgYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIGxpc3QgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCBmb3IgZnVydGhlciBzdHlsaW5nICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEF0dHJpYnV0ZXMoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUHJvY2VzcyB0aGUgcHJvcG9zZWQgbmV3IHZhbHVlLiBUaGUgaWQgb2YgdGhlIGh0bWwgZWxlbWVudCBvbiB3aGljaCB0aGUgY2hhbmdlIG9jY3VyZWQgaXMgcGFzc2VkICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0VmFsdWUoX29iamVjdDogVCwgX25ldzogc3RyaW5nLCBfaWQ/OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGhhcyBjaGlsZHJlbiB0aGF0IG11c3QgYmUgc2hvd24gd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGhhc0NoaWxkcmVuKF9vYmplY3Q6IFQpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdGhlIG9iamVjdCdzIGNoaWxkcmVuIHRvIHNob3cgd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENoaWxkcmVuKF9vYmplY3Q6IFQpOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUHJvY2VzcyB0aGUgbGlzdCBvZiBzb3VyY2Ugb2JqZWN0cyB0byBiZSBhZGRlZEFzQ2hpbGRyZW4gd2hlbiBkcm9wcGluZyBvciBwYXN0aW5nIG9udG8gdGhlIHRhcmdldCBpdGVtL29iamVjdCwgXHJcbiAgICAgKiByZXR1cm4gdGhlIGxpc3Qgb2Ygb2JqZWN0cyB0aGF0IHNob3VsZCB2aXNpYmx5IGJlY29tZSB0aGUgY2hpbGRyZW4gb2YgdGhlIHRhcmdldCBpdGVtL29iamVjdCBcclxuICAgICAqIEBwYXJhbSBfY2hpbGRyZW4gQSBsaXN0IG9mIG9iamVjdHMgdGhlIHRyZWUgdHJpZXMgdG8gYWRkIHRvIHRoZSBfdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0gX3RhcmdldCBUaGUgb2JqZWN0IHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW0gdGhlIGRyb3Agb2NjdXJzIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBhZGRDaGlsZHJlbihfc291cmNlczogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVtb3ZlIHRoZSBvYmplY3RzIHRvIGJlIGRlbGV0ZWQsIGUuZy4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLCBmcm9tIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgdHJlZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBDdXN0b21UcmVlSXRlbX0gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3Vzc2VkIFRoZSBvYmplY3QgY3VycmVudGx5IGhhdmluZyBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVsZXRlKF9mb2N1c3NlZDogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgY29waWVzIG9mIHRoZSBvYmplY3RzIGdpdmVuIGZvciBjb3B5ICYgcGFzdGVcclxuICAgICAqIEBwYXJhbSBfZm9jdXNzZWQgVGhlIG9iamVjdCBjdXJyZW50bHkgaGF2aW5nIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCAvKiBhc3luYyAqLyBjb3B5KF9vcmlnaW5hbHM6IFRbXSk6IFByb21pc2U8VFtdPjtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgbGktZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEge0BsaW5rIEN1c3RvbVRyZWVMaXN0fSB3aXRoIGEgY2hlY2tib3ggYW5kIGFuIEhUTUxFbGVtZW50IGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IEN1c3RvbVRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZyk7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWcpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZFJlbW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUsIHdoZW4gdGhpcyBpdGVtIGhhcyBhIHZpc2libGUgY2hlY2tib3ggaW4gZnJvbnQgdG8gZXhwYW5kIHRoZSBzdWJzZXF1ZW50IGJyYW5jaCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3Mgb3IgaGlkZXMgdGhlIGNoZWNrYm94IGZvciBleHBhbmRpbmcgdGhlIHN1YnNlcXVlbnQgYnJhbmNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgaGFzQ2hpbGRyZW4oX2hhczogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgPSBfaGFzID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgcmVwcmVzZW50aW5nIHRoZSBhdHRhY2hlZCB7QGxpbmsgZGF0YX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjb250ZW50KCk6IEhUTUxGaWVsZFNldEVsZW1lbnQge1xyXG4gICAgICByZXR1cm4gdGhpcy4jY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgY29udGVudCByZXByZXNlbnRpbmcgdGhlIGF0dGFjaGVkIHtAbGluayBkYXRhfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGNvbnRlbnQoX2NvbnRlbnQ6IEhUTUxGaWVsZFNldEVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuY29udGFpbnModGhpcy4jY29udGVudCkpXHJcbiAgICAgICAgdGhpcy5yZXBsYWNlQ2hpbGQoX2NvbnRlbnQsIHRoaXMuI2NvbnRlbnQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChfY29udGVudCk7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBfY29udGVudDtcclxuICAgICAgdGhpcy4jY29udGVudC5vbnN1Ym1pdCA9IChfZXZlbnQpID0+IHtcclxuICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhpcyBpdGVtIGlzIGV4cGFuZGVkLCBzaG93aW5nIGl0J3MgY2hpbGRyZW4sIG9yIGNsb3NlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRCcmFuY2goKSAmJiB0aGlzLmNoZWNrYm94LmNoZWNrZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImF0dHJpYnV0ZXNcIiwgdGhpcy5jb250cm9sbGVyLmdldEF0dHJpYnV0ZXModGhpcy5kYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRyb2xsZXIuY3JlYXRlQ29udGVudCh0aGlzLmRhdGEpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZXMgdG8gZXhwYW5kaW5nIHRoZSB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9IG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyB7QGxpbmsgRVZFTlQuRVhQQU5EfS5cclxuICAgICAqIFRoZSB1c2VyIG9mIHRoZSB0cmVlIG5lZWRzIHRvIGFkZCBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgdHJlZSBcclxuICAgICAqIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGF0IHtAbGluayBDdXN0b21UcmVlTGlzdH0gYW5kIGFkZCBpdCBhcyBicmFuY2ggdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG5cclxuICAgICAgaWYgKF9leHBhbmQpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FWFBBTkQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmNoZWNrYm94LmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICAgIC8vICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpKS5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBkYXRhIHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW1zIHN1Y2NlZWRpbmcgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VmlzaWJsZURhdGEoKTogVFtdIHtcclxuICAgICAgbGV0IGxpc3Q6IE5vZGVMaXN0T2Y8SFRNTExJRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRhdGE6IFRbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpXHJcbiAgICAgICAgZGF0YS5wdXNoKCg8Q3VzdG9tVHJlZUl0ZW08VD4+aXRlbSkuZGF0YSk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS4gVGhlIGJyYW5jaCBtdXN0IGJlIGEgcHJldmlvdXNseSBjb21waWxlZCB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRCcmFuY2goX2JyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuICAgICAgaWYgKF9icmFuY2gpXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChfYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBvZiB0aGlzIGl0ZW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCcmFuY2goKTogQ3VzdG9tVHJlZUxpc3Q8VD4ge1xyXG4gICAgICByZXR1cm4gPEN1c3RvbVRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgdGhlIHtAbGluayBFVkVOVC5TRUxFQ1R9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBDdXN0b21UcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghY29udGVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoIXRoaXMuY29udGVudC5kaXNhYmxlZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY29udGVudDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSA8Q3VzdG9tVHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgLy8gVE9ETzogcmVwYWlyIGFycm93IGtleSBuYXZpZ2F0aW9uXHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaGFzQ2hpbGRyZW4gJiYgIWNvbnRlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgIGlmIChjb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLmNvbnRlbnQuZWxlbWVudHMuaXRlbSgwKTtcclxuICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBlbGVtZW50Py5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERibENsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoX2V2ZW50LnBhZ2VYLCBfZXZlbnQucGFnZVkpOyAvLyBkaXNhYmxlZCBlbGVtZW50cyBkb24ndCBkaXNwYXRjaCBjbGljayBldmVudHMsIGdldCB0aGUgZWxlbWVudCBtYW51YWxseVxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdGFyZ2V0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuc2V0VmFsdWUodGhpcy5kYXRhLCB0YXJnZXQudmFsdWUsIHRhcmdldC5pZCk7XHJcblxyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIGlmIChyZW5hbWVkKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLCAwLCAwKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAvLyBtYXJrIGFzIGFscmVhZHkgcHJvY2Vzc2VkIGJ5IHRoaXMgdHJlZSBpdGVtIHRvIGlnbm9yZSBpdCBpbiBmdXJ0aGVyIHByb3BhZ2F0aW9uIHRocm91Z2ggdGhlIHRyZWVcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ3N0YXJ0XCIsIFwiZHJhZ3N0YXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWcgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlY3Q6IERPTVJlY3QgPSB0aGlzLmNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpKSB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUkFHX09WRVIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcywgdGhpcy5kYXRhKSkge1xyXG4gICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB0aGUgdmlld3MgbWlnaHQgbmVlZCB0byBrbm93IGFib3V0IHRoaXMgZXZlbnRcclxuICAgICAgLy8gaWYgKF9ldmVudC5jdXJyZW50VGFyZ2V0ID09IF9ldmVudC50YXJnZXQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJsaS1jdXN0b20tdHJlZS1pdGVtXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+Q3VzdG9tVHJlZUl0ZW0sIHsgZXh0ZW5kczogXCJsaVwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8vIFRPRE86IGR1cGxpY2F0ZWQgY29kZSBpbiBUYWJsZSBhbmQgVHJlZSwgbWF5IGJlIG9wdGltaXplZC4uLlxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFRBQkxFIHtcclxuICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGVkaXRhYmxlOiBib29sZWFuO1xyXG4gICAgc29ydGFibGU6IGJvb2xlYW47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYW5hZ2VzIGEgc29ydGFibGUgdGFibGUgb2YgZGF0YSBnaXZlbiBhcyBzaW1wbGUgYXJyYXkgb2YgZmxhdCBvYmplY3RzICAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIEtleTAgIEtleTEgS2V5MlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZUVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuICAgIHB1YmxpYyBkYXRhOiBUW107XHJcbiAgICBwdWJsaWMgaWNvbjogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVFtdLCBfaWNvbj86IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIHRoaXMuaWNvbiA9IF9pY29uO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwic29ydGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TT1JULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZFNvcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UQUJMRS5DSEFOR0UsIHRoaXMuaG5kU29ydCk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5DVVQsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgLy8gdHIgPSB0aGlzLmNyZWF0ZVJvdyhyb3csIGhlYWQpO1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgcm93KTtcclxuICAgICAgICAvLyBUT0RPOiBzZWUgaWYgaWNvbiBjb25zaWRlcmF0aW9uIHNob3VsZCBtb3ZlIHRvIFRhYmxlSXRlbVxyXG4gICAgICAgIGlmICh0aGlzLmljb24pXHJcbiAgICAgICAgICBpdGVtLnNldEF0dHJpYnV0ZShcImljb25cIiwgPHN0cmluZz5SZWZsZWN0LmdldChyb3csIHRoaXMuaWNvbikpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGluIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUYWJsZUl0ZW08VD5bXSA9IDxUYWJsZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxUYWJsZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFTdGFydClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFFbmQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IGVuZClcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhU3RhcnQsIF9kYXRhRW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhKTtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVIZWFkKF9oZWFkSW5mbzogVEFCTEVbXSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgICBsZXQgdHI6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9oZWFkSW5mbykge1xyXG4gICAgICAgIGxldCB0aDogSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIik7XHJcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBlbnRyeS5sYWJlbDtcclxuICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5LnNvcnRhYmxlKSB7XHJcbiAgICAgICAgICB0aC5hcHBlbmRDaGlsZCh0aGlzLmdldFNvcnRCdXR0b25zKCkpO1xyXG4gICAgICAgICAgdGguYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgRVZFTlQuQ0hBTkdFLFxyXG4gICAgICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gdGguZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU09SVCwgeyBkZXRhaWw6IF9ldmVudC50YXJnZXQsIGJ1YmJsZXM6IHRydWUgfSkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U29ydEJ1dHRvbnMoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcmVzdWx0OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBmb3IgKGxldCBkaXJlY3Rpb24gb2YgW1widXBcIiwgXCJkb3duXCJdKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICBidXR0b24ubmFtZSA9IFwic29ydFwiO1xyXG4gICAgICAgIGJ1dHRvbi52YWx1ZSA9IGRpcmVjdGlvbjtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU29ydChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC5kZXRhaWwpLnZhbHVlO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IGRpcmVjdGlvbjogbnVtYmVyID0gKHZhbHVlID09IFwidXBcIikgPyAxIDogLTE7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zb3J0KHRoaXMuZGF0YSwga2V5LCBkaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRXZlbnQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhfZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAvLyAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgIC8vICAgICBjYXNlIEVWRU5ULkNMSUNLOlxyXG4gICAgLy8gICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSB9KTtcclxuICAgIC8vICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZFJlbmFtZShfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyAgIC8vIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj4oPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkucGFyZW50Tm9kZTtcclxuICAgIC8vICAgLy8gbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSB0aGlzLmNvbnRyb2xsZXIucmVuYW1lKGl0ZW0uZGF0YSwgaXRlbS5nZXRMYWJlbCgpKTtcclxuICAgIC8vICAgLy8gaWYgKHJlbmFtZWQpXHJcbiAgICAvLyAgIC8vICAgaXRlbS5zZXRMYWJlbCh0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoaXRlbS5kYXRhKSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgIC8vICAgY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgIC8vICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgLy8gICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDoge2RhdGE6IHRoaXMuZGF0YX0gfSkpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIC8vIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAvLyAgIC8vIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAvLyAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vICAgLy8gbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgIC8vICAgLy8gc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgLy8gICAvLyAgIGNhc2UgRVZFTlRfVFJFRS5DT1BZOlxyXG4gICAgLy8gICAvLyAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgIC8vICAgLy8gICAgIGJyZWFrO1xyXG4gICAgLy8gICAvLyAgIGNhc2UgRVZFTlRfVFJFRS5QQVNURTpcclxuICAgIC8vICAgLy8gICAgIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzLCB0YXJnZXQuZGF0YSk7XHJcbiAgICAvLyAgIC8vICAgICBicmVhaztcclxuICAgIC8vICAgLy8gICBjYXNlIEVWRU5UX1RSRUUuQ1VUOlxyXG4gICAgLy8gICAvLyAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgIC8vICAgLy8gICAgIGxldCBjdXQ6IFRbXSA9IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAvLyAgIC8vICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgLy8gICAvLyAgICAgYnJlYWs7XHJcbiAgICAvLyAgIC8vIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLXNvcnRhYmxlXCIsIFRhYmxlLCB7IGV4dGVuZHM6IFwidGFibGVcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RhYmxlXV0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUgW1tUYWJsZV1dIGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRhYmxlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIHNlbGVjdGlvbjogVFtdID0gW107XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRhYmxlICovXHJcbiAgICBwdWJsaWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0YWJsZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IChhcHBlYXJzIG5vdCB0byBiZSBjYWxsZWQgeWV0KSAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRMYWJlbChfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gZmFsc2UgaWYgcmVuYW1pbmcgb2Ygb2JqZWN0IGlzIG5vdCBwb3NzaWJpbGUsIG9yIHRydWUgaWYgdGhlIG9iamVjdCB3YXMgcmVuYW1lZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmFtZShfb2JqZWN0OiBULCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2ZvY3Vzc2VkOiBUW10pOiBQcm9taXNlPFRbXT4geyByZXR1cm4gX2ZvY3Vzc2VkOyB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZVxyXG4gICAgICogQHBhcmFtIF9mb2N1c3NlZCBUaGUgb2JqZWN0IGN1cnJlbnRseSBoYXZpbmcgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNvcHkoX29yaWdpbmFsczogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgVEFCTEUtb2JqZWN0cyBkZXNjcmliaW5nIHRoZSBoZWFkLXRpdGxlcyBhbmQgYWNjb3JkaW5nIHByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEhlYWQoKTogVEFCTEVbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvcnQgZGF0YSBieSBnaXZlbiBrZXkgYW5kIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc29ydChfZGF0YTogVFtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQ7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdHItZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEgW1tUYWJsZV1dXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRhYmxlSXRlbTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyB0aGlzLmRpc3BsYXkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoX2RhdGEpO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSh0aGlzLmNvbnRyb2xsZXIuZ2V0SGVhZCgpKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcblxyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVVBEQVRFLCB0aGlzLmhuZFVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSBbW0NTU19DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgW1tFVkVOVC5TRUxFQ1RdXSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKF9maWx0ZXI6IFRBQkxFW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2ZpbHRlcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIGVudHJ5LmtleSk7XHJcbiAgICAgICAgbGV0IHRkOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gIWVudHJ5LmVkaXRhYmxlO1xyXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImtleVwiLCBlbnRyeS5rZXkpO1xyXG5cclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0RXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgdGFyZ2V0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgLy8gbGV0IGtleTogc3RyaW5nID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgLy8gbGV0IHByZXZpb3VzVmFsdWU6IMaSLkdlbmVyYWwgPSBSZWZsZWN0LmdldCh0aGlzLmRhdGEsIGtleSk7XHJcblxyXG4gICAgICBpZiAoYXdhaXQgdGhpcy5jb250cm9sbGVyLnJlbmFtZSh0aGlzLmRhdGEsIHRhcmdldC52YWx1ZSkpIHtcclxuICAgICAgICAvLyBSZWZsZWN0LnNldCh0aGlzLmRhdGEsIGtleSwgdGFyZ2V0LnZhbHVlKTsgLy8gd2h5IHNob3VsZG4ndCB0aGUgY29udHJvbGxlciBkbyB0aGlzP1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzcGF0Y2ggUmVuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBpZiAoIXRoaXMubGFiZWwuZGlzYWJsZWQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBsZXQgY29udGVudDogVHJlZUxpc3Q8VD4gPSA8VHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgIC8vICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgLy8gICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbXTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbdGhpcy5kYXRhXTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0aGlzLmRhdGE7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidGFibGUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRhYmxlSXRlbSwgeyBleHRlbmRzOiBcInRyXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiBbW1RyZWVJdGVtXV1zIHRvIHJlcHJlc2VudCBhIGJyYW5jaCBpbiBhIHRyZWVcclxuICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlTGlzdDxUPiBleHRlbmRzIEhUTUxVTGlzdEVsZW1lbnQge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKF9pdGVtcyk7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRoIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGggaW5jbHVkZXNcclxuICAgICAqIEBwYXJhbSBfcGF0aCBBbiBhcnJheSBvZiBvYmplY3RzIHN0YXJ0aW5nIHdpdGggb25lIGJlaW5nIGNvbnRhaW5lZCBpbiB0aGlzIHRyZWVsaXN0IGFuZCBmb2xsb3dpbmcgdGhlIGNvcnJlY3QgaGllcmFyY2h5IG9mIHN1Y2Nlc3NvcnNcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgSWYgdHJ1ZSAoZGVmYXVsdCkgdGhlIGxhc3Qgb2JqZWN0IGZvdW5kIGluIHRoZSB0cmVlIGdldHMgdGhlIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KF9wYXRoOiBUW10sIF9mb2N1czogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgbGV0IGN1cnJlbnRUcmVlOiBUcmVlTGlzdDxUPiA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIF9wYXRoKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gY3VycmVudFRyZWUuZmluZEl0ZW0oZGF0YSk7XHJcbiAgICAgICAgaXRlbS5mb2N1cygpO1xyXG4gICAgICAgIGxldCBjb250ZW50OiBUcmVlTGlzdDxUPiA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgICAgaWYgKCFjb250ZW50KSB7XHJcbiAgICAgICAgICBpdGVtLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGNvbnRlbnQgPSBpdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGNvbnRlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICogW1tUcmVlSXRlbV1dcyByZWZlcmVuY2luZyB0aGUgc2FtZSBvYmplY3QgcmVtYWluIGluIHRoZSBsaXN0LCBuZXcgaXRlbXMgZ2V0IGFkZGVkIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlLCBvYnNvbGV0ZSBvbmVzIGFyZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIF90cmVlIEEgbGlzdCB0byBzeW5jIHRoaXMgd2l0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdHJ1Y3R1cmUoX3RyZWU6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF90cmVlLmdldEl0ZW1zKCkpIHtcclxuICAgICAgICBsZXQgZm91bmQ6IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kSXRlbShpdGVtLmRhdGEpO1xyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgZm91bmQuc2V0TGFiZWwoaXRlbS5kaXNwbGF5KTtcclxuICAgICAgICAgIGZvdW5kLmhhc0NoaWxkcmVuID0gaXRlbS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgIGlmICghZm91bmQuaGFzQ2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGZvdW5kLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBbW1RyZWVJdGVtXV0gb2YgdGhpcyBsaXN0IHJlZmVyZW5jaW5nIHRoZSBnaXZlbiBvYmplY3Qgb3IgbnVsbCwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kSXRlbShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmICgoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEgPT0gX2RhdGEpXHJcbiAgICAgICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+Pml0ZW07XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGdpdmVuIFtbVHJlZUl0ZW1dXXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIFtbVHJlZUl0ZW1dXXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEl0ZW1zKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+W10+PHVua25vd24+dGhpcy5jaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YVN0YXJ0KVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YUVuZClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gZW5kKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKF9kYXRhOiBUW10pOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKSB7XHJcbiAgICAgICAgICAvLyBpdGVtLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlVQREFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGl0ZW0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRWaXNpYmxlKF9kYXRhOiBUKTogVHJlZUl0ZW08VD4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YSA9PSBpdGVtLmRhdGEpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZS1saXN0XCIsIFRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIlRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBleHBvcnQgZW51bSBDU1NfQ0xBU1Mge1xyXG4gICAgU0VMRUNURUQgPSBcInNlbGVjdGVkXCIsXHJcbiAgICBJTkFDVElWRSA9IFwiaW5hY3RpdmVcIlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIFtbVHJlZUxpc3RdXSB0aGF0IHJlcHJlc2VudHMgdGhlIHJvb3Qgb2YgYSB0cmVlIGNvbnRyb2wgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiB0cmVlIDx1bD5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCIOKUlCB0cmVlTGlzdCA8dWw+XHJcbiAgICog4pSCICAg4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIgICDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWU8VD4gZXh0ZW5kcyBUcmVlTGlzdDxUPiB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfcm9vdDogVCkge1xyXG4gICAgICBzdXBlcihbXSk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICBsZXQgcm9vdDogVHJlZUl0ZW08VD4gPSBuZXcgVHJlZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBfcm9vdCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV4cGFuZCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRU5BTUUsIHRoaXMuaG5kUmVuYW1lKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wLCB0cnVlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgZm91bmQ6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUJyYW5jaChfZGF0YTogVFtdKTogVHJlZUxpc3Q8VD4ge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IG5ldyBUcmVlTGlzdDxUPihbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUmVuYW1lKF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pig8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS5wYXJlbnROb2RlO1xyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IHRoaXMuY29udHJvbGxlci5yZW5hbWUoaXRlbS5kYXRhLCBpdGVtLmdldExhYmVsKCkpO1xyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICBpdGVtLnNldExhYmVsKHRoaXMuY29udHJvbGxlci5nZXRMYWJlbChpdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudC5kYXRhVHJhbnNmZXIpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBUKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbig8VFtdPl9jaGlsZHJlbiwgPFQ+X3RhcmdldCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRvbid0LCB3aGVuIGNvcHlpbmcgb3IgY29taW5nIGZyb20gYW5vdGhlciBzb3VyY2VcclxuICAgICAgdGhpcy5kZWxldGUobW92ZSk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0RGF0YTogVCA9IDxUPl90YXJnZXQ7XHJcbiAgICAgIGxldCB0YXJnZXRJdGVtOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZFZpc2libGUodGFyZ2V0RGF0YSk7XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbih0YXJnZXREYXRhKSk7XHJcbiAgICAgIGxldCBvbGQ6IFRyZWVMaXN0PFQ+ID0gdGFyZ2V0SXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgdGFyZ2V0SXRlbS5oYXNDaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgIGlmIChvbGQpXHJcbiAgICAgICAgb2xkLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0YXJnZXRJdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgIF9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICBfdGFyZ2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuXHJcbiAgICAgIHRoaXMuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcyA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jb3B5KFsuLi50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuY29weVBhc3RlLnNvdXJjZXMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5UcmVlLCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RyZWVdXSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSBbW1RyZWVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmVlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcDogeyBzb3VyY2VzOiBUW10sIHRhcmdldDogVCB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgY29weVBhc3RlOiB7IHNvdXJjZXM6IFRbXSwgdGFyZ2V0OiBUIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0cmVlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TGFiZWwoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUmV0cmlldmUgYSBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBsaXN0IGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgZm9yIGZ1cnRoZXIgc3R5bGluZyAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRBdHRyaWJ1dGVzKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFJldHVybiBmYWxzZSB0byBkaXNhbGxvdyByZW5hbWluZyB0aGUgaXRlbS9vYmplY3QsIG9yIHByb2Nlc3NlcyB0aGUgcHJvcG9zZWQgbmV3IGxhYmVsICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuYW1lKF9vYmplY3Q6IFQsIF9uZXc6IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaGFzIGNoaWxkcmVuIHRoYXQgbXVzdCBiZSBzaG93biB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaGFzQ2hpbGRyZW4oX29iamVjdDogVCk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0aGUgb2JqZWN0J3MgY2hpbGRyZW4gdG8gc2hvdyB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q2hpbGRyZW4oX29iamVjdDogVCk6IFRbXTtcclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCk6IFRbXTtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0cmVlIHJlZmVycyB0byBhbmQgXHJcbiAgICAgKiByZXR1cm4gYSBsaXN0IG9mIHRob3NlIG9iamVjdHMgaW4gb3JkZXIgZm9yIHRoZSBhY2NvcmRpbmcgW1tUcmVlSXRlbXNdXSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXNzZWQgVGhlIG9iamVjdCBjdXJyZW50bHkgaGF2aW5nIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZWxldGUoX2ZvY3Vzc2VkOiBUW10pOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZVxyXG4gICAgICogQHBhcmFtIF9mb2N1c3NlZCBUaGUgb2JqZWN0IGN1cnJlbnRseSBoYXZpbmcgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNvcHkoX29yaWdpbmFsczogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8vIHB1YmxpYyBhYnN0cmFjdCBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICB0aGlzLmRyYWdEcm9wLnRhcmdldCA9ICg8VHJlZUl0ZW08VD4+X2V2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGE7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKF9ldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIGxpLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVHJlZUxpc3RdXSB3aXRoIGEgY2hlY2tib3ggYW5kIGEgdGV4dGlucHV0IGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiBbW1RyZWVMaXN0XV0gYXMgYnJhbmNoIHRvIGRpc3BsYXkgY2hpbGRyZW4gb2YgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlSXRlbTxUPiBleHRlbmRzIEhUTUxMSUVsZW1lbnQge1xyXG4gICAgcHVibGljIGRpc3BsYXk6IHN0cmluZyA9IFwiVHJlZUl0ZW1cIjtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGxhYmVsOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBUKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihfZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kRGJsQ2xpY2spO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRSZW1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlLCB3aGVuIHRoaXMgaXRlbSBoYXMgYSB2aXNpYmxlIGNoZWNrYm94IGluIGZyb250IHRvIGV4cGFuZCB0aGUgc3Vic2VxdWVudCBicmFuY2ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBjaGVja2JveCBmb3IgZXhwYW5kaW5nIHRoZSBzdWJzZXF1ZW50IGJyYW5jaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGhhc0NoaWxkcmVuKF9oYXM6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ID0gX2hhcyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbVFJFRV9DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBsYWJlbCB0ZXh0IHRvIHNob3dcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldExhYmVsKF90ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IF90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBsYWJlbCB0ZXh0IHNob3duXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMYWJlbCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5sYWJlbC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGFiZWwgdGV4dCBzaG93blxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWVzIHRvIGV4cGFuZGluZyB0aGUgW1tUcmVlTGlzdF1dIG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyBbW0VWRU5ULkVYUEFORF1dLlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQgW1tUcmVlTGlzdF1dIGFuZCBhZGQgaXQgYXMgYnJhbmNoIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuXHJcbiAgICAgIGlmIChfZXhwYW5kKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVhQQU5ELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG5cclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIFtbVHJlZUxpc3RdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QnJhbmNoKF9icmFuY2g6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcbiAgICAgIGlmIChfYnJhbmNoKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoX2JyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QnJhbmNoKCk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgcmV0dXJuIDxUcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBUcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghY29udGVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuXHJcbiAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMubGFiZWwudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IHRoaXMuZGlzcGxheTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuXHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5sYWJlbClcclxuICAgICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKCF0aGlzLmxhYmVsLmRpc2FibGVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgbGV0IGNvbnRlbnQ6IFRyZWVMaXN0PFQ+ID0gPFRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICFjb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAoY29udGVudClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgdGhpcy5zdGFydFR5cGluZ0xhYmVsKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhcnRUeXBpbmdMYWJlbCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxhYmVsLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICB0aGlzLnN0YXJ0VHlwaW5nTGFiZWwoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxMSUVsZW1lbnQgPSA8SFRNTExJRWxlbWVudD50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc3dpdGNoICh0YXJnZXQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxyXG4gICAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpdGVtLmZvY3VzKCk7XHJcbiAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZGVmYXVsdFwiOlxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIG1hcmsgYXMgYWxyZWFkeSBwcm9jZXNzZWQgYnkgdGhpcyB0cmVlIGl0ZW0gdG8gaWdub3JlIGl0IGluIGZ1cnRoZXIgcHJvcGFnYXRpb24gdGhyb3VnaCB0aGUgdHJlZVxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJkcmFnc3RhcnRcIiwgdGhpcy5sYWJlbC52YWx1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhpcy5jb250cm9sbGVyLmhuZERyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ292ZXJEb25lXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnb3ZlckRvbmVcIiwgdHJ1ZSk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0aGlzLmRhdGE7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmN1cnJlbnRUYXJnZXQgPT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImxpLXRyZWUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGV4cG9ydCBjb25zdCBlbnVtIEVWRU5UIHtcclxuICAgIENMSUNLID0gXCJjbGlja1wiLFxyXG4gICAgRE9VQkxFX0NMSUNLID0gXCJkYmxjbGlja1wiLFxyXG4gICAgS0VZX0RPV04gPSBcImtleWRvd25cIixcclxuICAgIERSQUdfU1RBUlQgPSBcImRyYWdzdGFydFwiLFxyXG4gICAgRFJBR19FTlRFUiA9IFwiZHJhZ2VudGVyXCIsXHJcbiAgICBEUkFHX09WRVIgPSBcImRyYWdvdmVyXCIsXHJcbiAgICBEUkFHX0xFQVZFID0gXCJkcmFnbGVhdmVcIixcclxuICAgIERST1AgPSBcImRyb3BcIixcclxuICAgIFBPSU5URVJfVVAgPSBcInBvaW50ZXJ1cFwiLFxyXG4gICAgV0hFRUwgPSBcIndoZWVsXCIsXHJcbiAgICBGT0NVU19ORVhUID0gXCJmb2N1c05leHRcIixcclxuICAgIEZPQ1VTX1BSRVZJT1VTID0gXCJmb2N1c1ByZXZpb3VzXCIsXHJcbiAgICBGT0NVU19JTiA9IFwiZm9jdXNpblwiLFxyXG4gICAgRk9DVVNfT1VUID0gXCJmb2N1c291dFwiLFxyXG4gICAgRk9DVVNfU0VUID0gXCJmb2N1c1NldFwiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBUT0dHTEUgPSBcInRvZ2dsZVwiLFxyXG4gICAgUE9JTlRFUl9NT1ZFID0gXCJwb2ludGVybW92ZVwiLFxyXG4gICAgSU5TRVJUID0gXCJpbnNlcnRcIlxyXG4gIH1cclxufSJdfQ==