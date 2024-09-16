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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE91dHB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RhdGFDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EZXRhaWxzLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EZXRhaWxzQXJyYXkudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RpYWxvZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvTXVsdGlMZXZlbE1lbnUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1dhcm5pbmcudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUNvbnRyb2xsZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlTGlzdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvRXZlbnQvRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsa0JBQWtCLENBNEIzQjtBQTVCRCxXQUFVLGtCQUFrQjtJQUMxQjs7O09B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Q0FBQyxFQXpVUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBeVUzQiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIENvbW1vbiBjbGlwYm9hcmRzIGZvciBhbGwgZHJhZy1kcm9wIGFuZCBjb3B5LXBhc3RlIG9wZXJhdGlvbnMgaGFwcGVuaW5nIGluIHRoZSB1c2VyIGludGVyZmFjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjRcclxuICAgKi9cclxuXHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGV4cG9ydCB0eXBlIENsaXBPcGVyYXRpb24gPSBFVkVOVC5DT1BZIHwgRVZFTlQuQ1VUO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ2xpcGJvYXJkIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZHJhZ0Ryb3A6IENsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgY29weVBhc3RlOiBDbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCk7XHJcbiAgICBwdWJsaWMgb2JqZWN0czogxpIuR2VuZXJhbFtdID0gW107XHJcbiAgICBwdWJsaWMgb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBnZXQ8VD4oKTogVFtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQoX29iamVjdHM6IE9iamVjdFtdLCBfb3BlcmF0aW9uPzogQ2xpcE9wZXJhdGlvbik6IHZvaWQge1xyXG4gICAgICB0aGlzLm9iamVjdHMgPSBfb2JqZWN0cy5zbGljZSgpO1xyXG4gICAgICB0aGlzLm9wZXJhdGlvbiA9IF9vcGVyYXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIC8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5kLnRzXCIvPiAvLyBUT0RPOiBub3cgdGhhdCB3ZSB1c2UgcGFja2FnZSByZWZlcmVuY2VzIGluIHRoZSB0c2NvbmZpZywgdGhpcyBmaWxlIGlzIG9ic29sZXRlIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBDb25uZWN0cyBhIFtbTXV0YWJsZV1dIHRvIGEgRE9NLUVsZW1lbnQgYW5kIHN5bmNocm9uaXplcyB0aGF0IG11dGFibGUgd2l0aCB0aGUgbXV0YXRvciBzdG9yZWQgd2l0aGluLlxyXG4gICAqIFVwZGF0ZXMgdGhlIG11dGFibGUgb24gaW50ZXJhY3Rpb24gd2l0aCB0aGUgZWxlbWVudCBhbmQgdGhlIGVsZW1lbnQgaW4gdGltZSBpbnRlcnZhbHMuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gICAgLy8gVE9ETzogZXhhbWluZSB0aGUgdXNlIG9mIHRoZSBhdHRyaWJ1dGUga2V5IHZzIG5hbWUuIEtleSBzaWduYWxzIHRoZSB1c2UgYnkgRlVER0Ugd2hpbGUgbmFtZSBpcyBzdGFuZGFyZCBhbmQgc3VwcG9ydGVkIGJ5IGZvcm1zXHJcbiAgICBwdWJsaWMgZG9tRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgdGltZVVwZGF0ZTogbnVtYmVyID0gMTkwO1xyXG4gICAgLyoqIFJlZmVyZXJlbmNlIHRvIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV0gdGhpcyB1aSByZWZlcnMgdG8gKi9cclxuICAgIHByb3RlY3RlZCBtdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+O1xyXG4gICAgLyoqIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSB1c2VkIHRvIGNvbnZleSBkYXRhIHRvIGFuZCBmcm9tIHRoZSBtdXRhYmxlKi9cclxuICAgIHByb3RlY3RlZCBtdXRhdG9yOiDGki5NdXRhdG9yO1xyXG4gICAgLyoqIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSB1c2VkIHRvIHN0b3JlIHRoZSBkYXRhIHR5cGVzIG9mIHRoZSBtdXRhdG9yIGF0dHJpYnV0ZXMqL1xyXG4gICAgcHJvdGVjdGVkIG11dGF0b3JUeXBlczogxpIuTXV0YXRvciA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBpZEludGVydmFsOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5kb21FbGVtZW50ID0gX2RvbUVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuc2V0TXV0YWJsZShfbXV0YWJsZSk7XHJcbiAgICAgIC8vIFRPRE86IGV4YW1pbmUsIGlmIHRoaXMgc2hvdWxkIHJlZ2lzdGVyIHRvIG9uZSBjb21tb24gaW50ZXJ2YWwsIGluc3RlYWQgb2YgZWFjaCBpbnN0YWxsaW5nIGl0cyBvd24uXHJcbiAgICAgIHRoaXMuc3RhcnRSZWZyZXNoKCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCB0aGlzLm11dGF0ZU9uSW5wdXQpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHRoaXMucmVhcnJhbmdlQXJyYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCB0YWtpbmcgYW4gZXhpc3RpbmcgW1vGki5NdXRhdG9yXV0gYXMgYSB0ZW1wbGF0ZSBcclxuICAgICAqIGFuZCB1cGRhdGluZyBpdHMgdmFsdWVzIHdpdGggdGhvc2UgZm91bmQgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnQuIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZU11dGF0b3IoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcjogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoX211dGF0b3Jba2V5XSBpbnN0YW5jZW9mIE9iamVjdClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBDb250cm9sbGVyLnVwZGF0ZU11dGF0b3IoZWxlbWVudCwgX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBfbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBhIFtbxpIuTXV0YWJsZV1dIGFzIGEgdGVtcGxhdGUgdG8gY3JlYXRlIGEgW1vGki5NdXRhdG9yXV0gb3IgdXBkYXRlIHRoZSBnaXZlbiBbW8aSLk11dGF0b3JdXSBcclxuICAgICAqIHdpdGggdGhlIHZhbHVlcyBpbiB0aGUgZ2l2ZW4gVUktZG9tRWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE11dGF0b3IoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIC8vIFRPRE86IGV4YW1pbmUgaWYgdGhpcy5tdXRhdG9yIHNob3VsZCBhbHNvIGJlIGFkZHJlc3NlZCBpbiBzb21lIHdheS4uLlxyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIC8vIFRPRE86IE11dGF0b3IgdHlwZSBub3cgb25seSB1c2VkIGZvciBlbnVtcy4gRXhhbWluZSBpZiB0aGVyZSBpcyBhbm90aGVyIHdheVxyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBfdHlwZXMgfHwgX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBDb250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9ICg8Q3VzdG9tRWxlbWVudD5lbGVtZW50KS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgZWxzZSBpZiAobXV0YXRvclR5cGVzW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICAvLyBUT0RPOiBzZXR0aW5nIGEgdmFsdWUgb2YgdGhlIGRvbSBlbGVtZW50IGRvZXNuJ3QgbWFrZSBzZW5zZS4uLiBleGFtaW5lIHdoYXQgdGhpcyBsaW5lIHdhcyBzdXBwb3NlZCB0byBkby4gQXNzdW1hYmx5IGVudW1zXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSAoPEhUTUxTZWxlY3RFbGVtZW50PmVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGF0b3I6IMaSLk11dGF0b3IgPSBSZWZsZWN0LmdldChtdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGU7XHJcbiAgICAgICAgICBzdWJNdXRhYmxlID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBpZiAoc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSB8fCBzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICAgICAgbXV0YXRvcltrZXldID0gdGhpcy5nZXRNdXRhdG9yKHN1Yk11dGFibGUsIGVsZW1lbnQsIHN1Yk11dGF0b3IpOyAvLywgc3ViVHlwZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBbW8aSLk11dGF0b3JdXSBvZiBhIFtbxpIuTXV0YWJsZV1dIGFuZCB1cGRhdGluZyB0aGUgVUktZG9tRWxlbWVudCBhY2NvcmRpbmdseS5cclxuICAgICAqIElmIGFuIGFkZGl0aW9uYWwgW1vGki5NdXRhdG9yXV0gaXMgcGFzc2VkLCBpdHMgdmFsdWVzIGFyZSB1c2VkIGluc3RlYWQgb2YgdGhvc2Ugb2YgdGhlIFtbxpIuTXV0YWJsZV1dLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogQ3VzdG9tRWxlbWVudCA9IDxDdXN0b21FbGVtZW50PkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSBtdXRhdG9yW2tleV07XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudCAmJiBlbGVtZW50ICE9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWxzZSBpZiAobXV0YXRvclR5cGVzW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YWJsZTogxpIuTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZShzdWJNdXRhYmxlLCBlbGVtZW50LCBtdXRhdG9yW2tleV0pO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAvL2VsZW1lbnQuc2V0TXV0YXRvclZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgUmVmbGVjdC5zZXQoZWxlbWVudCwgXCJ2YWx1ZVwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIG9uIHRoZSBnaXZlbiBfZG9tRWxlbWVudCBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2tleT1cIiR7X2tleX1cIl1gKTtcclxuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA8IDIpXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzWzBdO1xyXG5cclxuICAgICAgbGV0IHNob3J0ZXN0UGF0aDogbnVtYmVyID0gSW5maW5pdHk7XHJcbiAgICAgIGxldCBjbG9zZXN0RWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IHBhcmVudEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50OyBwYXJlbnRFbGVtZW50ICE9IF9kb21FbGVtZW50OyBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICBpZiAoY291bnQgPCBzaG9ydGVzdFBhdGgpIHtcclxuICAgICAgICAgIGNsb3Nlc3RFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IGNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNsb3Nlc3RFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gICByZXR1cm4gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihgOnNjb3BlID4gW2tleT1cIiR7X2tleX1cIl1gKSA/PyBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiAqID4gW2tleT1cIiR7X2tleX1cIl1gKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgYnJlYWR0aC1maXJzdCBzZWFyY2ggb24gdGhlIGdpdmVuIF9kb21FbGVtZW50IGZvciBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGtleS5cclxuICAgICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyAgIGxldCBxdWV1ZTogSFRNTEVsZW1lbnRbXSA9IFtfZG9tRWxlbWVudF07XHJcbiAgICAvLyAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gcXVldWUuc2hpZnQoKTtcclxuICAgIC8vICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKGBba2V5PVwiJHtfa2V5fVwiXWApKVxyXG4gICAgLy8gICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcblxyXG4gICAgLy8gICAgIHF1ZXVlLnB1c2goLi4uPEhUTUxFbGVtZW50W10+QXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIC8vIFRPRE86IHNob3VsZCBnZXQgTXV0YXRvciBmb3IgVUkgb3Igd29yayB3aXRoIHRoaXMubXV0YXRvciAoZXhhbWluZSlcclxuICAgICAgdGhpcy5tdXRhYmxlLnVwZGF0ZU11dGF0b3IodGhpcy5tdXRhdG9yKTtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCwgX211dGF0b3IsIF90eXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIENvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSh0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5tdXRhYmxlID0gX211dGFibGU7XHJcbiAgICAgIHRoaXMubXV0YXRvciA9IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgdGhpcy5tdXRhdG9yVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXModGhpcy5tdXRhdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YWJsZSgpOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubXV0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5yZWZyZXNoLCB0aGlzLnRpbWVVcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtdXRhdGVPbklucHV0ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiBfZXZlbnQuY29tcG9zZWRQYXRoKCkpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IHRoaXMuZG9tRWxlbWVudClcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50PnRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChrZXkpXHJcbiAgICAgICAgICBwYXRoLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgICBwYXRoLnJldmVyc2UoKTtcclxuICAgICAgdGhpcy5tdXRhdG9yID0gdGhpcy5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUoxpIuTXV0YWJsZS5nZXRNdXRhdG9yRnJvbVBhdGgodGhpcy5tdXRhdG9yLCBwYXRoKSk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFycmFuZ2VBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnNlcXVlbmNlO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHNBcnJheSA9IDxEZXRhaWxzQXJyYXk+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47XHJcblxyXG4gICAgICB7IC8vIGZpbmQgdGhlIE11dGFibGVBcnJheSBjb25uZWN0ZWQgdG8gdGhpcyBEZXRhaWxzQXJyYXlcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkZXRhaWxzO1xyXG4gICAgICAgIHdoaWxlIChlbGVtZW50ICE9IHRoaXMuZG9tRWxlbWVudCkge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKVxyXG4gICAgICAgICAgICBwYXRoLnB1c2goZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgbXV0YWJsZSA9IHRoaXMubXV0YWJsZTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgcGF0aClcclxuICAgICAgICAgIG11dGFibGUgPSBSZWZsZWN0LmdldChtdXRhYmxlLCBrZXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZWFycmFuZ2UgdGhhdCBtdXRhYmxlXHJcbiAgICAgICg8xpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+Pjx1bmtub3duPm11dGFibGUpLnJlYXJyYW5nZShzZXF1ZW5jZSk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUodGhpcy5tdXRhYmxlLmdldE11dGF0b3IoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWZyZXNoID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5kb21FbGVtZW50KSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIGdlbmVyYXRpbmcgVUktZG9tRWxlbWVudHMgZnJvbSB0aGUgaW5mb3JtYXRpb24gZm91bmQgaW4gW1vGki5NdXRhYmxlXV1zIGFuZCBbW8aSLk11dGF0b3JdXXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFtbQ29udHJvbGxlcl1dIGZyb20gYSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV0gd2l0aCBleHBhbmRhYmxlIGRldGFpbHMgb3IgYSBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ29udHJvbGxlcihfbXV0YWJsZTogxpIuTXV0YWJsZSwgX25hbWU/OiBzdHJpbmcpOiBDb250cm9sbGVyIHtcclxuICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihfbXV0YWJsZSwgR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZSwgX25hbWUpKTtcclxuICAgICAgY29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGV4dGVuZGFibGUgZGV0YWlscyBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbmFtZT86IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogRGV0YWlscyB8IERldGFpbHNBcnJheSB7XHJcbiAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfbmFtZSB8fCBfbXV0YWJsZS5jb25zdHJ1Y3Rvci5uYW1lO1xyXG5cclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHMgfCBEZXRhaWxzQXJyYXk7XHJcbiAgICAgIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShuYW1lKTtcclxuICAgICAgZWxzZSBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIGRldGFpbHMgPSBuZXcgRGV0YWlscyhuYW1lLCBfbXV0YWJsZS50eXBlKTtcclxuICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGRldGFpbHMuc2V0Q29udGVudChHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGUsIF9tdXRhdG9yKSk7XHJcbiAgICAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGl2LUVsZW1lbnRzIGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMobXV0YXRvcik7XHJcbiAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yVHlwZXMpIHtcclxuICAgICAgICBsZXQgdHlwZTogT2JqZWN0ID0gbXV0YXRvclR5cGVzW2tleV07XHJcbiAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBtdXRhdG9yW2tleV07XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZU11dGF0b3JFbGVtZW50KGtleSwgdHlwZSwgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+ID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBlbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShzdWJNdXRhYmxlLCBrZXksIDzGki5NdXRhdG9yPnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCAmJiB0eXBlKVxyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50T3V0cHV0KHsga2V5OiBrZXksIGxhYmVsOiBrZXksIHR5cGU6IHR5cGUudG9TdHJpbmcoKSwgdmFsdWU6IHZhbHVlPy50b1N0cmluZygpLCBwbGFjZWhvbGRlcjogYERyb3AgeW91ciAke3R5cGV9IGhlcmUuLi5gIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHsgLy8gdW5kZWZpbmVkIHZhbHVlcyB3aXRob3V0IGEgdHlwZSBjYW4ndCBiZSBkaXNwbGF5ZWRcclxuICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGludGVyZmFjZSBjcmVhdGVkIGZvciBcIiwgX211dGFibGUuY29uc3RydWN0b3IubmFtZSwga2V5KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudCBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gXHJcbiAgICAgKiBEb2VzIG5vdCBzdXBwb3J0IG5lc3RlZCBtdXRhdG9ycyFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvciB8IE9iamVjdCk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IFJlZmxlY3QuZ2V0KF9tdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgIC8vIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSAvLyBhdCB0aGlzIHRpbWUgKDEvMjMpIGFkZGluZyBhIHByb3BlcnR5IHRvIGFuIGFuaW1hdGlvbiBpbiB0aGUgZWRpdG9yIGNyZWF0ZXMgYW4gZW1wdHkga2V5cyBsaXN0Li4uXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCBPYmplY3QsIHt9KSk7IFxyXG4gICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgLy8gbGV0IGRldGFpbHM6IERldGFpbHMgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlscyhrZXksIFwiRGV0YWlsc1wiKTtcclxuICAgICAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksICg8T2JqZWN0PnZhbHVlKS5jb25zdHJ1Y3Rvci5uYW1lLCB2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcGVjaWZpYyBDdXN0b21FbGVtZW50IGZvciB0aGUgZ2l2ZW4gZGF0YSwgdXNpbmcgX2tleSBhcyBpZGVudGlmaWNhdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZU11dGF0b3JFbGVtZW50KF9rZXk6IHN0cmluZywgX3R5cGU6IE9iamVjdCB8IHN0cmluZywgX3ZhbHVlOiBPYmplY3QpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoX3R5cGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50VHlwZTogdHlwZW9mIEN1c3RvbUVsZW1lbnQgPSBDdXN0b21FbGVtZW50LmdldChcIk9iamVjdFwiKTtcclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGluc3RhbnRpYXRlIGFic3RyYWN0IGNsYXNzXHJcbiAgICAgICAgICBlbGVtZW50ID0gbmV3IGVsZW1lbnRUeXBlKHsga2V5OiBfa2V5LCBsYWJlbDogX2tleSwgdmFsdWU6IF92YWx1ZS50b1N0cmluZygpIH0sIF90eXBlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF92YWx1ZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSkgeyAvLyBUT0RPOiBkZWxldGU/XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk11dGFibGVBcnJheVwiKTtcclxuICAgICAgICAgIC8vIGluc2VydCBBcnJheS1Db250cm9sbGVyIVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy5mdWRnZShfZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVE9ETzogcmVmYWN0b3IgZm9yIGVudW1zIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURyb3Bkb3duKF9uYW1lOiBzdHJpbmcsIF9jb250ZW50OiBPYmplY3QsIF92YWx1ZTogc3RyaW5nLCBfcGFyZW50OiBIVE1MRWxlbWVudCwgX2Nzc0NsYXNzPzogc3RyaW5nKTogSFRNTFNlbGVjdEVsZW1lbnQge1xyXG4gICAgICBsZXQgZHJvcGRvd246IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZHJvcGRvd24ubmFtZSA9IF9uYW1lO1xyXG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiBfY29udGVudCkge1xyXG4gICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnRleHQgPSB2YWx1ZTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09IF92YWx1ZS50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyb3Bkb3duLmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgX3BhcmVudC5hcHBlbmRDaGlsZChkcm9wZG93bik7XHJcbiAgICAgIHJldHVybiBkcm9wZG93bjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHMoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoX2tleSk7XHJcbiAgICAvLyAgIC8vIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzQXJyYXkoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShfa2V5KTtcclxuICAgIC8vICAgZGV0YWlscy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2tleSk7XHJcbiAgICAvLyAgIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RydWN0dXJlIGZvciB0aGUgYXR0cmlidXRlcyB0byBzZXQgaW4gYSBDdXN0b21FbGVtZW50LlxyXG4gICAqIGtleSAobWF5YmUgcmVuYW1lIHRvIGBuYW1lYCkgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IG1hdGNoIHRoZSBrZXkgb2YgYSBtdXRhdG9yIGlmIHVzZWQgaW4gY29uanVuY3Rpb25cclxuICAgKiBsYWJlbCBpcyByZWNvbW1lbmRlZCBmb3IgbGFiZWxsZWQgZWxlbWVudHMsIGtleSBpcyB1c2VkIGlmIG5vdCBnaXZlbi5cclxuICAgKi9cclxuICBleHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzIHtcclxuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGxhYmVsPzogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgbWFwcGluZyBvZiBDdXN0b21FbGVtZW50cyB0byB0aGVpciBIVE1MLVRhZ3MgdmlhIGN1c3RvbUVsZW1lbnQuZGVmaW5lXHJcbiAgICogYW5kIHRvIHRoZSBkYXRhIHR5cGVzIGFuZCBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1zIHRoZXkgcmVuZGVyIGFuIGludGVyZmFjZSBmb3IuIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyB0YWc6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIG1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudDogTWFwPHN0cmluZywgdHlwZW9mIEN1c3RvbUVsZW1lbnQ+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gX2F0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgIGlmIChfYXR0cmlidXRlc1tuYW1lXSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIF9hdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBhbiBpZCB0byB1c2UgZm9yIGNoaWxkcmVuIG9mIHRoaXMgZWxlbWVudCwgbmVlZGVkIGUuZy4gZm9yIHN0YW5kYXJkIGludGVyYWN0aW9uIHdpdGggdGhlIGxhYmVsXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgZ2V0IG5leHRJZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCLGklwiICsgQ3VzdG9tRWxlbWVudC5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG1hcCB0aGUgZ2l2ZW4gZWxlbWVudCB0eXBlIHRvIHRoZSBnaXZlbiB0YWcgYW5kIHRoZSBnaXZlbiB0eXBlIG9mIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQsIF90eXBlT2JqZWN0PzogdHlwZW9mIE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfdGFnLCBfY2xhc3MpO1xyXG4gICAgICBfdHlwZUN1c3RvbUVsZW1lbnQudGFnID0gX3RhZztcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoX3RhZywgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuXHJcbiAgICAgIGlmIChfdHlwZU9iamVjdClcclxuICAgICAgICBDdXN0b21FbGVtZW50Lm1hcChfdHlwZU9iamVjdC5uYW1lLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiBkYXRhIHR5cGUgKGlmIHJlZ2lzdGVyZWQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KF90eXBlOiBzdHJpbmcpOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBzdHJpbmcgfCB0eXBlb2YgQ3VzdG9tRWxlbWVudCB8IEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3RvciA9IEN1c3RvbUVsZW1lbnQubWFwT2JqZWN0VG9DdXN0b21FbGVtZW50LmdldChfdHlwZSk7XHJcbiAgICAgIGlmICh0eXBlb2YgKGVsZW1lbnQpID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgZWxlbWVudCA9IGN1c3RvbUVsZW1lbnRzLmdldChlbGVtZW50KTtcclxuICAgICAgcmV0dXJuIDx0eXBlb2YgQ3VzdG9tRWxlbWVudD5lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG1hcChfdHlwZTogc3RyaW5nLCBfdHlwZUN1c3RvbUVsZW1lbnQ6IHR5cGVvZiBDdXN0b21FbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiTWFwXCIsIF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQubmFtZSk7XHJcbiAgICAgIEN1c3RvbUVsZW1lbnQubWFwT2JqZWN0VG9DdXN0b21FbGVtZW50LnNldChfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUga2V5IChuYW1lKSBvZiB0aGUgYXR0cmlidXRlIHRoaXMgZWxlbWVudCByZXByZXNlbnRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQga2V5KCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGxhYmVsLWVsZW1lbnQgYXMgY2hpbGQgdG8gdGhpcyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBlbmRMYWJlbCgpOiBIVE1MTGFiZWxFbGVtZW50IHtcclxuICAgICAgbGV0IHRleHQ6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldExhYmVsKF9sYWJlbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBpZiAobGFiZWwpXHJcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSBfbGFiZWw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgdXNpbmcgYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIFJlZmxlY3Quc2V0KHRoaXMsIFwidmFsdWVcIiwgX3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogV29ya2Fyb3VuZCByZWNvbm5lY3Rpb24gb2YgY2xvbmUgKi9cclxuICAgIHB1YmxpYyBjbG9uZU5vZGUoX2RlZXA6IGJvb2xlYW4pOiBOb2RlIHtcclxuICAgICAgbGV0IGxhYmVsOiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IGNsb25lOiBDdXN0b21FbGVtZW50ID0gbmV3IHRoaXMuY29uc3RydWN0b3IobGFiZWwgPyB7IGxhYmVsOiBsYWJlbCB9IDogbnVsbCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xvbmUpO1xyXG4gICAgICBjbG9uZS5zZXRNdXRhdG9yVmFsdWUodGhpcy5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBvZiB0aGlzLmF0dHJpYnV0ZXMpXHJcbiAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xyXG4gICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHBpY2tlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgcGlja2VyLnR5cGUgPSBcImNvbG9yXCI7XHJcblxyXG4gICAgICBwaWNrZXIudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHBpY2tlcik7XHJcblxyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICBzbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHNsaWRlci5zdGVwID0gXCIwLjAxXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuICAgICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgb2YgcGlja2VyIGFuZCBzbGlkZXIgYXMgxpIuTXV0YXRvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWU7XHJcbiAgICAgIGxldCBhbHBoYTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbG9yLnNldEhleChoZXguc3Vic3RyKDEsIDYpICsgXCJmZlwiKTtcclxuICAgICAgdGhpcy5jb2xvci5hID0gcGFyc2VGbG9hdChhbHBoYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBjb2xvciBwaWNrZXIgYW5kIHNsaWRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbG9yLm11dGF0ZShfdmFsdWUpO1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSB0aGlzLmNvbG9yLmdldEhleCgpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWUgPSBcIiNcIiArIGhleC5zdWJzdHIoMCwgNik7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPXJhbmdlXCIpKS52YWx1ZSA9IHRoaXMuY29sb3IuYS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5KF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhuZFdoZWVsKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpO1xyXG4gICAgICBpZiAoc2xpZGVyICE9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgIGxldCBjdXJyZW50VmFsdWU6IG51bWJlciA9IE51bWJlcihzbGlkZXIudmFsdWUpO1xyXG4gICAgICBzbGlkZXIudmFsdWUgPSBTdHJpbmcoY3VycmVudFZhbHVlIC0gX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBzbGlkZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogUmVwcmVzZW50cyBhIHNpbmdsZSBkaWdpdCBudW1iZXIgdG8gYmUgdXNlZCBpbiBncm91cHMgdG8gcmVwcmVzZW50IGEgbXVsdGlkaWdpdCB2YWx1ZS5cclxuICAgKiBJcyB0YWJiYWJsZSBhbmQgaW4tL2RlY3JlYXNlcyBwcmV2aW91cyBzaWJsaW5nIHdoZW4gZmxvd2luZyBvdmVyL3VuZGVyLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50RGlnaXQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWRpZ2l0XCIsIEN1c3RvbUVsZW1lbnREaWdpdCk7XHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB2YWx1ZShfdmFsdWU6IG51bWJlcikge1xyXG4gICAgICBfdmFsdWUgPSBNYXRoLnRydW5jKF92YWx1ZSk7XHJcbiAgICAgIGlmIChfdmFsdWUgPiA5IHx8IF92YWx1ZSA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnRleHRDb250ZW50ID0gX3ZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy50ZXh0Q29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGFkZChfYWRkZW5kOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX2FkZGVuZCA9IE1hdGgudHJ1bmMoX2FkZGVuZCk7XHJcbiAgICAgIGlmIChfYWRkZW5kID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9hZGRlbmQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPCA5KVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSsrO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPiAwKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZS0tO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoLTEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnQudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgQ3VzdG9tRWxlbWVudCBmcm9tIGFuIEhUTUwtVGVtcGxhdGUtVGFnXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJhZ21lbnQ6IE1hcDxzdHJpbmcsIERvY3VtZW50RnJhZ21lbnQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJyb3dzZXMgdGhyb3VnaCB0aGUgdGVtcGxhdGVzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZCByZWdpc3RlcnMgdGhlIG9uZSBkZWZpbmluZyB0aGUgZ2l2ZW4gdGFnbmFtZS5cclxuICAgICAqIFRvIGJlIGNhbGxlZCBmcm9tIGEgc2NyaXB0IHRhZyBpbXBsZW1lbnRlZCB3aXRoIHRoZSB0ZW1wbGF0ZSBpbiBIVE1MLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWdOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgdGVtcGxhdGUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRlbXBsYXRlXCIpKSB7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQubG9jYWxOYW1lID09IF90YWdOYW1lKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIlJlZ2lzdGVyXCIsIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LnNldChfdGFnTmFtZSwgdGVtcGxhdGUuY29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0ge307XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcIltrZXlcIik7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5fVwiXWApO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZG4ndCBmaW5kICR7a2V5fSBpbmAsIHRoaXMpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZSwgdGhlIGVsZW1lbnQgZ2V0cyBjb25zdHJ1Y3RlZCBhcyBhIGRlZXAgY2xvbmUgb2YgdGhlIHRlbXBsYXRlLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgPSBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuZ2V0KFJlZmxlY3QuZ2V0KHRoaXMuY29uc3RydWN0b3IsIFwidGFnXCIpKTtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmZyYWdtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuICAgICAgbGV0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gdGhpcy5zdHlsZTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgY29udGVudC5zdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KGVudHJ5LCBSZWZsZWN0LmdldChjb250ZW50LnN0eWxlLCBlbnRyeSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNvbnRlbnQuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4M3gzIGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgc2NhbGluZzoge30sIHJvdGF0aW9uOiAwIH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcblxyXG4gICAgICBtdXRhdG9yW1wicm90YXRpb25cIl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcihfbXV0YXRvcltcInJvdGF0aW9uXCJdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXg0eDQgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHJvdGF0aW9uOiB7fSwgc2NhbGluZzoge30gfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgdGV4dCBpbnB1dCBmaWVsZCB3aXRoIGEgbGFiZWwgdG8gaXQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRPdXRwdXQgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utb3V0cHV0XCIsIEN1c3RvbUVsZW1lbnRPdXRwdXQpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvdXRwdXRcIik7XHJcbiAgICAgIG91dHB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKG91dHB1dCk7XHJcbiAgICAgIHRoaXMuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IEZ1ZGdlQ29yZS5HZW5lcmFsKTogdm9pZCB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgaWYgKF92YWx1ZSlcclxuICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlclwiKTtcclxuXHJcbiAgICAgIC8vIHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKS52YWx1ZSA9IF92YWx1ZSA/PyB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgZHJvcGRvd24gbWVudSB0byBkaXNwbGF5IGVudW1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTZWxlY3QgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRTZWxlY3QsIE9iamVjdCk7XHJcbiAgICBwdWJsaWMgY29udGVudDogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIF9jb250ZW50OiBPYmplY3QgPSB7fSkge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRoaXMuY29udGVudCwgdmFsdWUpICYmIFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwgdmFsdWUpICE9PSBrZXkpIC8vIGZpbHRlciBudW1iZXIga2V5cyBvdXQgb2Ygc2ltcGxlIGVudW0gXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZW9mIHZhbHVlKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICAgICAgaWYgKGVudHJ5LnZhbHVlID09IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcclxuICAgICAgICAgIGVudHJ5LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZWN0LnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XT8uZ2V0QXR0cmlidXRlKFwidHlwZVwiKSB8fCBcInN0cmluZ1wiO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PSBcIm51bWJlclwiID8gcGFyc2VGbG9hdChzZWxlY3QudmFsdWUpIDogc2VsZWN0LnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICAvLyB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gaW50ZXJhY3RpdmUgbnVtYmVyIHN0ZXBwZXIgd2l0aCBleHBvbmVudGlhbCBkaXNwbGF5IGFuZCBjb21wbGV4IGhhbmRsaW5nIHVzaW5nIGtleWJvYXJkIGFuZCBtb3VzZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U3RlcHBlciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zdGVwcGVyXCIsIEN1c3RvbUVsZW1lbnRTdGVwcGVyLCBOdW1iZXIpO1xyXG4gICAgcHVibGljIHZhbHVlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzICYmIF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnNlRmxvYXQoX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgaW5wdXQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHsgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyB9KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG5cclxuICAgICAgbGV0IHNpZ246IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBzaWduLnRleHRDb250ZW50ID0gXCIrXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2lnbik7XHJcbiAgICAgIGZvciAobGV0IGV4cDogbnVtYmVyID0gMjsgZXhwID4gLTQ7IGV4cC0tKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBuZXcgQ3VzdG9tRWxlbWVudERpZ2l0KCk7XHJcbiAgICAgICAgZGlnaXQuc2V0QXR0cmlidXRlKFwiZXhwXCIsIGV4cC50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGRpZ2l0KTtcclxuICAgICAgICBpZiAoZXhwID09IDApXHJcbiAgICAgICAgICB0aGlzLmlubmVySFRNTCArPSBcIi5cIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlubmVySFRNTCArPSBcImVcIjtcclxuXHJcbiAgICAgIGxldCBleHA6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBleHAudGV4dENvbnRlbnQgPSBcIiswXCI7XHJcbiAgICAgIGV4cC50YWJJbmRleCA9IC0xO1xyXG4gICAgICBleHAuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImV4cFwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChleHApO1xyXG5cclxuXHJcbiAgICAgIC8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkJMVVIsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULldIRUVMLCB0aGlzLmhuZFdoZWVsKTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZS0vQWN0aXZhdGVzIHRhYmJpbmcgZm9yIHRoZSBpbm5lciBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFjdGl2YXRlSW5uZXJUYWJzKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IF9vbiA/IDAgOiAtMTtcclxuXHJcbiAgICAgIGxldCBzcGFuczogTm9kZUxpc3RPZjxIVE1MU3BhbkVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuICAgICAgc3BhbnNbMV0udGFiSW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBmb3IgKGxldCBkaWdpdCBvZiBkaWdpdHMpXHJcbiAgICAgICAgZGlnaXQudGFiSW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wZW5zL0Nsb3NlcyBhIHN0YW5kYXJkIG51bWJlciBpbnB1dCBmb3IgdHlwaW5nIHRoZSB2YWx1ZSBhdCBvbmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcGVuSW5wdXQoX29wZW46IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmIChfb3Blbikge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGl0cyB2YWx1ZSBhbmQgZGlzcGxheXMgaXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZhbHVlID09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIG1hbnRpc3NhIGFuZCBleHBvbmVudCBzZXBhcmF0ZWx5IGFzIGFuIGFycmF5IG9mIHR3byBtZW1iZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNYW50aXNzYUFuZEV4cG9uZW50KCk6IG51bWJlcltdIHtcclxuICAgICAgbGV0IHByZWM6IHN0cmluZyA9IHRoaXMudmFsdWUudG9FeHBvbmVudGlhbCg2KTtcclxuICAgICAgbGV0IGV4cDogbnVtYmVyID0gcGFyc2VJbnQocHJlYy5zcGxpdChcImVcIilbMV0pO1xyXG4gICAgICBsZXQgZXhwMzogbnVtYmVyID0gTWF0aC50cnVuYyhleHAgLyAzKTtcclxuICAgICAgbGV0IG1hbnRpc3NhOiBudW1iZXIgPSB0aGlzLnZhbHVlIC8gTWF0aC5wb3coMTAsIGV4cDMgKiAzKTtcclxuICAgICAgbWFudGlzc2EgPSBNYXRoLnJvdW5kKG1hbnRpc3NhICogMTAwMCkgLyAxMDAwO1xyXG4gICAgICByZXR1cm4gW21hbnRpc3NhLCBleHAzICogM107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhpcyB2YWx1ZSBhcyBhIHN0cmluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgbGV0IHByZWZpeE1hbnRpc3NhOiBzdHJpbmcgPSAobWFudGlzc2EgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgbGV0IHByZWZpeEV4cDogc3RyaW5nID0gKGV4cCA8IDApID8gXCJcIiA6IFwiK1wiO1xyXG4gICAgICByZXR1cm4gcHJlZml4TWFudGlzc2EgKyBtYW50aXNzYS50b0ZpeGVkKDMpICsgXCJlXCIgKyBwcmVmaXhFeHAgKyBleHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5cyB0aGlzIHZhbHVlIGJ5IHNldHRpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWdpdHMgYW5kIHRoZSBleHBvbmVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcblxyXG4gICAgICBpZiAoIWlzRmluaXRlKHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiAg4oieICAgXCJbNSAtIHBvc107XHJcbiAgICAgICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiICBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBdOiBzdHJpbmdbXSA9IHRoaXMudG9TdHJpbmcoKS5zcGxpdChcImVcIik7XHJcbiAgICAgIHNwYW5zWzBdLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZSA8IDAgPyBcIi1cIiA6IFwiK1wiO1xyXG4gICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IGV4cDtcclxuXHJcbiAgICAgIG1hbnRpc3NhID0gbWFudGlzc2Euc3Vic3RyaW5nKDEpO1xyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xyXG4gICAgICBmb3IgKGxldCBwb3M6IG51bWJlciA9IDA7IHBvcyA8IGRpZ2l0cy5sZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgaWYgKHBvcyA8IG1hbnRpc3NhLmxlbmd0aCkge1xyXG4gICAgICAgICAgbGV0IGNoYXI6IHN0cmluZyA9IG1hbnRpc3NhLmNoYXJBdChtYW50aXNzYS5sZW5ndGggLSAxIC0gcG9zKTtcclxuICAgICAgICAgIGRpZ2l0LnRleHRDb250ZW50ID0gY2hhcjtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiJm5ic3A7XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBrZXlib2FyZCBpbnB1dCBvbiB0aGlzIGVsZW1lbnQgYW5kIGl0cyBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBhY3RpdmU6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBsZXQgbnVtRW50ZXJlZDogbnVtYmVyID0gX2V2ZW50LmtleS5jaGFyQ29kZUF0KDApIC0gNDg7XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyBpZiBmb2N1cyBpcyBvbiBzdGVwcGVyLCBlbnRlciBpdCBhbmQgZm9jdXMgZGlnaXRcclxuICAgICAgaWYgKGFjdGl2ZSA9PSB0aGlzKSB7XHJcbiAgICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKHRydWUpO1xyXG4gICAgICAgICAgICAoPEhUTUxFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpWzJdKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHx8IF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaW5wdXQgZmllbGQgb3ZlcmxheSBpcyBhY3RpdmVcclxuICAgICAgaWYgKGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUikge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IE51bWJlcigoPEhUTUxJbnB1dEVsZW1lbnQ+YWN0aXZlKS52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHtcclxuICAgICAgICBsZXQgZGlmZmVyZW5jZTogbnVtYmVyID0gbnVtRW50ZXJlZCAtIE51bWJlcihhY3RpdmUudGV4dENvbnRlbnQpICogKHRoaXMudmFsdWUgPCAwID8gLTEgOiAxKTtcclxuICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoZGlmZmVyZW5jZSk7XHJcblxyXG4gICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSAoX2V2ZW50LmtleSA9PSBcIi1cIiA/IC0xIDogMSkgKiBNYXRoLmFicyh0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKVxyXG4gICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKC0xKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoKzEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgKDxIVE1MRWxlbWVudD5hY3RpdmUucHJldmlvdXNFbGVtZW50U2libGluZykuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbCA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGNoYW5nZTogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyArMSA6IC0xO1xyXG4gICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoY2hhbmdlKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZURpZ2l0Rm9jdXNzZWQoX2Ftb3VudDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdDogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzIHx8ICF0aGlzLmNvbnRhaW5zKGRpZ2l0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfYW1vdW50ID0gTWF0aC5yb3VuZChfYW1vdW50KTtcclxuICAgICAgaWYgKF9hbW91bnQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiW25hbWU9ZXhwXVwiKSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZSAqIE1hdGgucG93KDEwLCBfYW1vdW50KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKHZhbHVlKSlcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTsgXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZXhwRGlnaXQ6IG51bWJlciA9IHBhcnNlSW50KGRpZ2l0LmdldEF0dHJpYnV0ZShcImV4cFwiKSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmUgKG1hbnRpc3NhIG5vdCB1c2VkKVxyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBWYWx1ZV06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcblxyXG4gICAgICBsZXQgcHJldjogbnVtYmVyID0gdGhpcy52YWx1ZTtcclxuICAgICAgdGhpcy52YWx1ZSArPSBfYW1vdW50ICogTWF0aC5wb3coMTAsIGV4cERpZ2l0ICsgZXhwVmFsdWUpO1xyXG4gICAgICAvLyB3b3JrYXJvdW5kIHByZWNpc2lvbiBwcm9ibGVtcyBvZiBqYXZhc2NyaXB0XHJcbiAgICAgIGlmIChNYXRoLmFicyhwcmV2IC8gdGhpcy52YWx1ZSkgPiAxMDAwKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG5cclxuXHJcbiAgICAgIGxldCBleHBOZXc6IG51bWJlcjtcclxuICAgICAgW21hbnRpc3NhLCBleHBOZXddID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1hbnRpc3NhKTtcclxuICAgICAgdGhpcy5zaGlmdEZvY3VzKGV4cE5ldyAtIGV4cFZhbHVlKTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaGlmdEZvY3VzKF9uRGlnaXRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IHNoaWZ0Rm9jdXM6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoX25EaWdpdHMpIHtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgMzsgaSsrKVxyXG4gICAgICAgICAgaWYgKF9uRGlnaXRzID4gMClcclxuICAgICAgICAgICAgc2hpZnRGb2N1cyA9IHNoaWZ0Rm9jdXMubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgICAgICAoPEhUTUxFbGVtZW50PnNoaWZ0Rm9jdXMpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCB0ZXh0IGlucHV0IGZpZWxkIHdpdGggYSBsYWJlbCB0byBpdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFRleHRJbnB1dCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS10ZXh0aW5wdXRcIiwgQ3VzdG9tRWxlbWVudFRleHRJbnB1dCwgU3RyaW5nKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG4gICAgICBcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQmFzZWNsYXNzIGZvciBjb21wbGV4IHVpLWNvbnRyb2xsZXJzIGhhbmRsaW5nIGRhdGEgaW4gdGFibGVzLCB0cmVlcyBvciBvdGhlciBzdHJ1Y3R1cmVzICAgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIERhdGFDb250cm9sbGVyPFQ+IHtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBzZWxlY3RlZCBvYmplY3RzLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBzZWxlY3Rpb24gc2hvdWxkIGFsc28gb3BlcmF0ZSBvdXRzaWRlIG9mIHRhYmxlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIFxyXG4gICAgLyoqIFxyXG4gICAgICogUmVtb3ZlIHRoZSBvYmplY3RzIHRvIGJlIGRlbGV0ZWQsIGUuZy4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLCBmcm9tIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgdGFibGUgcmVmZXJzIHRvIGFuZCBcclxuICAgICAqIHJldHVybiBhIGxpc3Qgb2YgdGhvc2Ugb2JqZWN0cyBpbiBvcmRlciBmb3IgdGhlIGFjY29yZGluZyB7QGxpbmsgVGFibGVJdGVtc30gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2V4cGVuZGFibGVzIFRoZSBleHBlbmRhYmxlIG9iamVjdHMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2V4cGVuZGFibGVzOiBUW10pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICByZXR1cm4gX2V4cGVuZGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIGl0ZW1zIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGNvcHkgJiBwYXN0ZSAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgaXRlbSBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgY29waWVkIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHJlZmVycmVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb3B5KF9mb2N1czogVCwgX29wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbik6IFRbXSB7XHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID8gdGhpcy5zZWxlY3Rpb24gOiBbX2ZvY3VzXTtcclxuICAgICAgQ2xpcGJvYXJkLmNvcHlQYXN0ZS5zZXQoaXRlbXMsIF9vcGVyYXRpb24pO1xyXG4gICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgb2JqZWN0cyB0byB0aGUgY2xpcGJvYXJkIGZvciBjb3B5ICYgcGFzdGUgYW5kIGRlbGV0ZSB0aGVtIGZyb20gdGhpcyBjb250cm9sbGVyICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIHRoYXQgaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGN1dCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSB3aG9sZSBzZWxlY3Rpb24gZ2V0cyByZWZlcnJlZCBhbmQgZGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgY3V0KF9mb2N1czogVCwgX29wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbik6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5jb3B5KF9mb2N1cywgX29wZXJhdGlvbik7XHJcbiAgICAgIGl0ZW1zID0gYXdhaXQgdGhpcy5kZWxldGUoaXRlbXMpO1xyXG4gICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0cmlldmUgb2JqZWN0cyBmcm9tIHRoZSBjbGlwYm9hcmQsIHByb2Nlc3MgYW5kIHJldHVybiB0aGVtIHRvIGFkZCB0byB0aGUgdGFibGUgICBcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogaWYgdGhlIGNvcHlQYXN0ZSBjbGlwYm9hcmQgd2FzIGZpbGxlZCB1c2luZyBjb3B5LCByZXR1cm4gYW4gYXJyYXkgb2YgY2xvbmVzLFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjb250ZW50IG9mIHRoZSBjbGlwYm9hcmRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIHBhc3RlKCk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBvYmplY3RzOiBUW10gPSBDbGlwYm9hcmQuY29weVBhc3RlLmdldCgpO1xyXG4gICAgICBpZiAoQ2xpcGJvYXJkLmNvcHlQYXN0ZS5vcGVyYXRpb24gPT0gXCJjb3B5XCIpXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xvbmUob2JqZWN0cyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBvYmplY3RzIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGRyYWcgJiBkcm9wICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIHRoYXQgaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGRyYWdnZWQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eSxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcmVmZXJyZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYWdTdGFydChfZm9jdXM6IFQpOiB2b2lkIHtcclxuICAgICAgLy8gaWYgdGhlIGZvY3Vzc2VkIGl0ZW0gaXMgaW4gdGhlIHNlbGVjdGlvbiwgZHJhZyB0aGUgd2hvbGUgc2VsZWN0aW9uXHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5zZWxlY3Rpb24uaW5kZXhPZihfZm9jdXMpIDwgMCA/IFtfZm9jdXNdIDogdGhpcy5zZWxlY3Rpb247XHJcbiAgICAgIENsaXBib2FyZC5kcmFnRHJvcC5zZXQoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhbGxvd2VkIGRyYWdEcm9wLWVmZmVjdCAgXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IGNoZWNrIHRoZSBjdHJsS2V5IGZvciBcImNvcHlcIiBhbmQgc2hpZnRLZXkgZm9yIFwibGlua1wiLCBvdGhlcndpc2UgcmV0dXJuIFwibW92ZVwiICBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYWdPdmVyKF9ldmVudDogRHJhZ0V2ZW50KTogRFJPUEVGRkVDVCB7XHJcbiAgICAgIGxldCBkcm9wRWZmZWN0OiBEUk9QRUZGRUNUID0gXCJtb3ZlXCI7XHJcbiAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICBkcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICByZXR1cm4gZHJvcEVmZmVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0cmVlLlxyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiBpZiB7QGxpbms6IGRyYWdPdmVyfSB5aWVsZHMgXCJjb3B5XCIsIHJldHVybiBhbiBhcnJheSBvZiBjbG9uZXMgb2YgdGhlIG9iamVjdHMgaW4sXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGNvbnRlbnQgb2YgdGhlIGRyYWdEcm9wLWNsaXBib2FyZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGRyb3AoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICBsZXQgb2JqZWN0czogVFtdID0gQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpO1xyXG4gICAgICBpZiAodGhpcy5kcmFnT3ZlcihfZXZlbnQpID09IFwiY29weVwiKVxyXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNsb25lKG9iamVjdHMpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogQ2xvbmUgb2JqZWN0cyBhbmQgcmV0dXJuIGFuIGFycmF5IHdpdGggcmVmZXJlbmNlcyB0byB0aGUgY2xvbmVzXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IHVzZSBPYmplY3QuY3JlYXRlIHRvIGNsb25lIHRoZSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjbG9uZShfb2JqZWN0czogVFtdKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgcmV0dXJuIF9vYmplY3RzLm1hcChfb2JqZWN0ID0+IE9iamVjdC5jcmVhdGUoPE9iamVjdD5fb2JqZWN0KSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHMgZXh0ZW5kcyBIVE1MRGV0YWlsc0VsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcgPSBcIlwiLCBfdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgY2hhbmdpbmcgYW5pbWF0aW9uIHN0cnVjdHVyZSB0byBsb29rIG1vcmUgbGlrZSBhIG11dGF0b3JcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAgIHRoaXMub3BlbiA9IHRydWU7XHJcbiAgICAgIGxldCBsYmxTdW1tYXJ5OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xyXG4gICAgICBsYmxTdW1tYXJ5LnRleHRDb250ZW50ID0gX2xlZ2VuZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChsYmxTdW1tYXJ5KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfU0VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRPR0dMRSwgdGhpcy5obmRUb2dnbGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIC8vIHJldHVybiB0aGlzLmV4cGFuZGVyLmNoZWNrZWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRlbnQoX2NvbnRlbnQ6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVwbGFjZUNoaWxkKF9jb250ZW50LCB0aGlzLmNvbnRlbnQpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgLy8gdGhpcy5leHBhbmRlci5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5vcGVuID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5obmRUb2dnbGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb2dnbGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50KVxyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0aGlzLmlzRXhwYW5kZWQgPyBFVkVOVC5FWFBBTkQgOiBFVkVOVC5DT0xMQVBTRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAocHJldmlvdXMgJiYgcHJldmlvdXMudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBsZXQgc2V0czogTm9kZUxpc3RPZjxIVE1MRGV0YWlsc0VsZW1lbnQ+ID0gcHJldmlvdXMucXVlcnlTZWxlY3RvckFsbChcImRldGFpbHNcIik7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSBzZXRzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgICAgZG8geyAvLyBmb2N1cyB0aGUgbGFzdCB2aXNpYmxlIHNldFxyXG4gICAgICAgICAgICAgICAgc2V0c1stLWldLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgfSB3aGlsZSAoIXNldHNbaV0ub2Zmc2V0UGFyZW50KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19TRVQ6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnRhcmdldCAhPSB0aGlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgLy8gbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuSU5TRVJUOlxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc1wiKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuSU5TRVJULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICghdGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICBuZXh0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgIG5leHQgPSA8SFRNTEVsZW1lbnQ+bmV4dC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKG5leHQgJiYgbmV4dC50YWJJbmRleCA+IC0xKTtcclxuXHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgLy8gbmV4dC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGxldCBwcmV2aW91czogSFRNTEVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBwcmV2aW91cyA9IDxIVE1MRWxlbWVudD5wcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgfSB3aGlsZSAocHJldmlvdXMgJiYgIShwcmV2aW91cyBpbnN0YW5jZW9mIERldGFpbHMpKTtcclxuXHJcbiAgICAgICAgICBpZiAocHJldmlvdXMpXHJcbiAgICAgICAgICAgIGlmICgoPERldGFpbHM+cHJldmlvdXMpLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1NFVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgLy8gVE9ETzogdXNlIEN1c3RvbUVsZW1lbnQucmVnaXN0ZXI/XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktZGV0YWlsc1wiLCBEZXRhaWxzLCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHNBcnJheSBleHRlbmRzIERldGFpbHMge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX2xlZ2VuZCwgXCJBcnJheVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuc2V0Q29udGVudChfY29udGVudCk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgbXV0YXRvci5wdXNoKGNoaWxkLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50TGlzdGVuZXJzKF9jaGlsZDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgX2NoaWxkLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5U3BlY2lhbCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgICBfY2hpbGQudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhcnJhbmdlKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc2VxdWVuY2UucHVzaChwYXJzZUludChjaGlsZC5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0Rm9jdXMoX2ZvY3VzKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGtleTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIHNlcXVlbmNlOiBzZXF1ZW5jZSB9IH0pKTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnNldExhYmVsKVxyXG4gICAgICAgICAgY2hpbGQuc2V0TGFiZWwoY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hpbGQudGFiSW5kZXgpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9jdXMoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgaWYgKF9mb2N1cyA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZm9jdXMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihfZm9jdXMsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBjaGlsZDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb250ZW50LmNoaWxkcmVuW19mb2N1c107XHJcbiAgICAgIGNoaWxkPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdDsgXHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluZGV4XCIsIGtleURyYWcpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJrZXk6XCIgKyB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgXCJrZXlcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIFtrZXksIGxhYmVsXSA9IGl0ZW0udHlwZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgaWYgKGtleSA9PSBcImtleVwiICYmIGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKSB7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIGxldCBkcm9wOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgbGV0IGtleURyb3A6IHN0cmluZyA9IGRyb3AuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5kZXhcIik7XHJcbiAgICAgIGxldCBkcmFnOiBIVE1MRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5RHJhZ31cIl1gKTtcclxuICAgICAgbGV0IGxhYmVsRHJhZzogc3RyaW5nID0gZHJhZy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHJcbiAgICAgIGxldCBwb3NpdGlvbjogSW5zZXJ0UG9zaXRpb24gPSBrZXlEcmFnID4ga2V5RHJvcCA/IFwiYmVmb3JlYmVnaW5cIiA6IFwiYWZ0ZXJlbmRcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyYWcgPSA8SFRNTEVsZW1lbnQ+ZHJhZy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIGRyYWcuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgbGFiZWxEcmFnKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWcpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZHJvcC5pbnNlcnRBZGphY2VudEVsZW1lbnQocG9zaXRpb24sIGRyYWcpO1xyXG5cclxuICAgICAgdGhpcy5yZWFycmFuZ2UoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhkcmFnKTtcclxuICAgICAgZHJhZy5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnNlcnQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImhuZEluc2VydFwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlTcGVjaWFsID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgaXRlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAvLyBvbmx5IHdvcmsgb24gaXRlbXMgb2YgbGlzdCwgbm90IHRoZWlyIGNoaWxkcmVuXHJcbiAgICAgIGlmICgoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpICE9IGl0ZW0gJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBudW1iZXIgPSBwYXJzZUludChpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgbGV0IHNpYmxpbmc6IEhUTUxFbGVtZW50ID0gaXRlbTtcclxuICAgICAgbGV0IGluc2VydDogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKGZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgLy8gICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc0FycmF5XCIpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoLS1mb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmViZWdpblwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoLS1mb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmFsdEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEZvY3VzKCsrZm9jdXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgaW5zZXJ0ID0gPEhUTUxFbGVtZW50Pml0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBpbnNlcnQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoaW5zZXJ0KTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzaWJsaW5nID0gPEhUTUxFbGVtZW50Pml0ZW0ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoKytmb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpIHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1saXN0XCIsIERldGFpbHNBcnJheSwgeyBleHRlbmRzOiBcImRldGFpbHNcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCBvciBub24tbW9kYWwgZGlhbG9nIHdpdGggYW4gaW50ZXJmYWNlIGZvciB0aGUgZ2l2ZW4gbXV0YXRvci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZG9tOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0IHRoZSBkaWFsb2cgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIGNhbGwgdG8gYWN0aW9uIGFuZCBsYWJlbHMgZm9yIHRoZSBjYW5jZWwtIGFuZCBvay1idXR0b25cclxuICAgICAqIFVzZSBgYXdhaXRgIG9uIGNhbGwsIHRvIGNvbnRpbnVlIGFmdGVyIHRoZSB1c2VyIGhhcyBwcmVzc2VkIG9uZSBvZiB0aGUgYnV0dG9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwcm9tcHQoX2RhdGE6IMaSLk11dGFibGUgfCDGki5NdXRhdG9yIHwgT2JqZWN0LCBfbW9kYWw6IGJvb2xlYW4gPSB0cnVlLCBfaGVhZDogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfY2FsbFRvQWN0aW9uOiBzdHJpbmcgPSBcIkluc3RydWN0aW9uXCIsIF9vazogc3RyaW5nID0gXCJPS1wiLCBfY2FuY2VsOiBzdHJpbmcgPSBcIkNhbmNlbFwiKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIERpYWxvZy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICBEaWFsb2cuZG9tLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWQgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgIGlmIChfZGF0YSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfZGF0YSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9kYXRhKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF9jYWxsVG9BY3Rpb24gKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bkNhbmNlbDogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5DYW5jZWwuaW5uZXJIVE1MID0gX2NhbmNlbDtcclxuICAgICAgaWYgKF9jYW5jZWwgIT0gXCJcIilcclxuICAgICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuQ2FuY2VsKTtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgRGlhbG9nLmRvbS5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICBpZiAoX21vZGFsKVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvd01vZGFsKCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBEaWFsb2cuZG9tLnNob3coKTtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoX3Jlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgaG5kQnV0dG9uOiAoX2V2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBidG5DYW5jZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgICBidG5Pay5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IGJ0bk9rKVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihjb250ZW50LCBfZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lKSB7XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcuaW5mbyhfZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgRGlhbG9nLmRvbS5jbG9zZSgpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChEaWFsb2cuZG9tKTtcclxuICAgICAgICAgIF9yZXNvbHZlKF9ldmVudC50YXJnZXQgPT0gYnRuT2spO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgYnRuT2suYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5mb2N1cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiA8c2VsZWN0PjxvcHRpb24+SGFsbG88L29wdGlvbj48L3NlbGVjdD5cclxuICAgKi9cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBNdWx0aUxldmVsTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYnVpbGRGcm9tU2lnbmF0dXJlKF9zaWduYXR1cmU6IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwge307XHJcbiAgICAgIGxldCBzaWduYXR1cmVMZXZlbHM6IHN0cmluZ1tdID0gX3NpZ25hdHVyZS5zcGxpdChcIi5cIik7XHJcbiAgICAgIGlmIChzaWduYXR1cmVMZXZlbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGxldCBzdWJTaWduYXR1cmU6IHN0cmluZyA9IHNpZ25hdHVyZUxldmVsc1sxXTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAyOyBpIDwgc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzdWJTaWduYXR1cmUgPSBzdWJTaWduYXR1cmUgKyBcIi5cIiArIHNpZ25hdHVyZUxldmVsc1tpXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlLCA8xpIuTXV0YXRvcj5tdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHNpZ25hdHVyZUxldmVsc1swXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCB3YXJuaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBXYXJuaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBhIHdhcm5pbmcgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIHdhcm5pbmcgdGV4dCBhbmQgb2sgYnV0dGVuIHRleHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheShfZXJyb3JzOiBzdHJpbmdbXSA9IFtdLCBfaGVhZGxpbmU6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX3dhcm5pbmc6IHN0cmluZyA9IFwiV2FybmluZ1wiLCBfb2s6IHN0cmluZyA9IFwiT0tcIik6IHZvaWQge1xyXG4gICAgICBsZXQgd2FybmluZzogSFRNTERpYWxvZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdhcm5pbmcpO1xyXG4gICAgICB3YXJuaW5nLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWRsaW5lICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBjb250ZW50LmlubmVyVGV4dCA9IF9lcnJvcnMuam9pbihcIlxcblwiKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfd2FybmluZyArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBidG5Pay5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdhcm5pbmcuY2xvc2UoKTtcclxuICAgICAgICB3YXJuaW5nLnJlbW92ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB3YXJuaW5nLnNob3dNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvLyBUT0RPOiBkdXBsaWNhdGVkIGNvZGUgaW4gVGFibGUgYW5kIFRyZWUsIG1heSBiZSBvcHRpbWl6ZWQuLi5cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBUQUJMRSB7XHJcbiAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIHNvcnRhYmxlOiBib29sZWFuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFuYWdlcyBhIHNvcnRhYmxlIHRhYmxlIG9mIGRhdGEgZ2l2ZW4gYXMgc2ltcGxlIGFycmF5IG9mIGZsYXQgb2JqZWN0cyAgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiBLZXkwICBLZXkxIEtleTJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGU8VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcbiAgICBwdWJsaWMgZGF0YTogVFtdO1xyXG4gICAgcHVibGljIGF0dEljb246IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFRbXSwgX2F0dEljb24/OiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLmF0dEljb24gPSBfYXR0SWNvbjtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInNvcnRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU09SVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRTb3J0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNUX0FMTCwgdGhpcy5zZWxlY3RBbGwpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIHRoaXMuZGF0YSkge1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgZGF0YSwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VGFibGVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0QWxsKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnNlbGVjdEludGVydmFsKHRoaXMuZGF0YVswXSwgdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGgtMV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFTdGFydClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFFbmQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IGVuZClcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YSk7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSGVhZChfaGVhZEluZm86IFRBQkxFW10pOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgICAgbGV0IHRyOiBIVE1MVGFibGVSb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfaGVhZEluZm8pIHtcclxuICAgICAgICBsZXQgdGg6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG4gICAgICAgIHRoLnRleHRDb250ZW50ID0gZW50cnkubGFiZWw7XHJcbiAgICAgICAgdGguc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeS5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgdGguYXBwZW5kQ2hpbGQodGhpcy5nZXRTb3J0QnV0dG9ucygpKTtcclxuICAgICAgICAgIHRoLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgIEVWRU5ULkNIQU5HRSxcclxuICAgICAgICAgICAgKF9ldmVudDogRXZlbnQpID0+IHRoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNPUlQsIHsgZGV0YWlsOiBfZXZlbnQudGFyZ2V0LCBidWJibGVzOiB0cnVlIH0pKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNvcnRCdXR0b25zKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IHJlc3VsdDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIG9mIFtcInVwXCIsIFwiZG93blwiXSkge1xyXG4gICAgICAgIGxldCBidXR0b246IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYnV0dG9uLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcInNvcnRcIjtcclxuICAgICAgICBidXR0b24udmFsdWUgPSBkaXJlY3Rpb247XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNvcnQoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQuZGV0YWlsKS52YWx1ZTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBkaXJlY3Rpb246IG51bWJlciA9ICh2YWx1ZSA9PSBcInVwXCIpID8gMSA6IC0xO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc29ydCh0aGlzLmRhdGEsIGtleSwgZGlyZWN0aW9uKTtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmN1dCh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGlmIChjdXQubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnBhc3RlKCk7XHJcbiAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2Ygb2JqZWN0cykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTogVGFibGVJdGVtPFQ+ID0gbmV3IFRhYmxlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIG9iamVjdCwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IGFzeW5jIChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+UmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19TVEFSVDpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiYWxsXCI7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ1N0YXJ0KGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfT1ZFUjpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IHRoaXMuY29udHJvbGxlci5kcmFnT3ZlcihfZXZlbnQpO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRST1A6XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRyb3AoX2V2ZW50KTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRhYmxlSXRlbTxUPltdID0gPFRhYmxlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUYWJsZUl0ZW08VD4gPSA8VGFibGVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkgJiYgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5sZW5ndGggPT0gMClcclxuICAgICAgICB0YXJnZXQuc2VsZWN0KHRydWUpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGlmICgrK2luZGV4IDwgaXRlbXMubGVuZ3RoKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBpZiAoLS1pbmRleCA+PSAwKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnNlbGVjdCh0cnVlKTtcclxuICAgICAgZWxzZSBpZiAoIV9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1zb3J0YWJsZVwiLCBUYWJsZSwgeyBleHRlbmRzOiBcInRhYmxlXCIgfSk7XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vRGF0YUNvbnRyb2xsZXIudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIFtbVGFibGVdXSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSBbW1RhYmxlXV0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVGFibGVDb250cm9sbGVyPFQ+IGV4dGVuZHMgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0YWJsZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IChhcHBlYXJzIG5vdCB0byBiZSBjYWxsZWQgeWV0KSAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRMYWJlbChfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gZmFsc2UgaWYgcmVuYW1pbmcgb2Ygb2JqZWN0IGlzIG5vdCBwb3NzaWJpbGUsIG9yIHRydWUgaWYgdGhlIG9iamVjdCB3YXMgcmVuYW1lZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmFtZShfb2JqZWN0OiBULCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgVEFCTEUtb2JqZWN0cyBkZXNjcmliaW5nIHRoZSBoZWFkLXRpdGxlcyBhbmQgYWNjb3JkaW5nIHByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEhlYWQoKTogVEFCTEVbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvcnQgZGF0YSBieSBnaXZlbiBrZXkgYW5kIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc29ydChfZGF0YTogVFtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQ7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdHItZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEgW1tUYWJsZV1dXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRhYmxlSXRlbTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQsIF9hdHRJY29uOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyB0aGlzLmRpc3BsYXkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoX2RhdGEpO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSh0aGlzLmNvbnRyb2xsZXIuZ2V0SGVhZCgpLCBfYXR0SWNvbik7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0YWJsZVwiO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG5cclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlVQREFURSwgdGhpcy5obmRVcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUgW1tDU1NfQ0xBU1MuU0VMRUNURURdXSB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZChfb246IGJvb2xlYW4pIHtcclxuICAgICAgaWYgKF9vbilcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBbW1RSRUVfQ0xBU1NFUy5TRUxFQ1RFRF1dIGlzIGF0dGFjaGVkIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgdGhlIFtbRVZFTlQuU0VMRUNUXV0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZShfZmlsdGVyOiBUQUJMRVtdLCBfYXR0SWNvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9maWx0ZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZyA9IDxzdHJpbmc+UmVmbGVjdC5nZXQodGhpcy5kYXRhLCBlbnRyeS5rZXkpO1xyXG4gICAgICAgIGxldCBpY29uOiBzdHJpbmcgPSA8c3RyaW5nPlJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwgX2F0dEljb24pO1xyXG4gICAgICAgIGxldCB0ZDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XHJcbiAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9ICFlbnRyeS5lZGl0YWJsZTtcclxuICAgICAgICBpbnB1dC5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRJbnB1dEV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRPVUJMRV9DTElDSywgdGhpcy5obmRJbnB1dEV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgICB0ZC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgaWYgKGljb24pXHJcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImljb25cIiwgaWNvbik7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHRhcmdldC5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgIC8vIGxldCBrZXk6IHN0cmluZyA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIC8vIGxldCBwcmV2aW91c1ZhbHVlOiDGki5HZW5lcmFsID0gUmVmbGVjdC5nZXQodGhpcy5kYXRhLCBrZXkpO1xyXG5cclxuICAgICAgaWYgKGF3YWl0IHRoaXMuY29udHJvbGxlci5yZW5hbWUodGhpcy5kYXRhLCB0YXJnZXQudmFsdWUpKSB7XHJcbiAgICAgICAgLy8gUmVmbGVjdC5zZXQodGhpcy5kYXRhLCBrZXksIHRhcmdldC52YWx1ZSk7IC8vIHdoeSBzaG91bGRuJ3QgdGhlIGNvbnRyb2xsZXIgZG8gdGhpcz9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc3BhdGNoIFJlbmFtZVwiKTtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCAhPSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gc3RvcmUgdGhlIGRyYWdnZWQgaXRlbSBpbiB0aGUgZXZlbnQgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZyBpbiB0YWJsZVxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiaXRlbVwiLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidGFibGUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRhYmxlSXRlbSwgeyBleHRlbmRzOiBcInRyXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHVsLWVsZW1lbnQgdGhhdCBrZWVwcyBhIGxpc3Qgb2Yge0BsaW5rIFRyZWVJdGVtfXMgdG8gcmVwcmVzZW50IGEgYnJhbmNoIGluIGEgdHJlZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlTGlzdDxUPiBleHRlbmRzIEhUTUxVTGlzdEVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9pdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKF9pdGVtcyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRyZWVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGhzIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGhzIGluY2x1ZGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX3BhdGhzOiBUW11bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBwYXRoIG9mIF9wYXRocylcclxuICAgICAgICB0aGlzLnNob3cocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRoIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGggaW5jbHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KF9wYXRoOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGN1cnJlbnRUcmVlOiBUcmVlTGlzdDxUPiA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIF9wYXRoKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gY3VycmVudFRyZWUuZmluZEl0ZW0oZGF0YSk7XHJcbiAgICAgICAgaWYgKCFpdGVtKVxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICoge0BsaW5rIFRyZWVJdGVtfXMgcmVmZXJlbmNpbmcgdGhlIHNhbWUgb2JqZWN0IHJlbWFpbiBpbiB0aGUgbGlzdCwgbmV3IGl0ZW1zIGdldCBhZGRlZCBpbiB0aGUgb3JkZXIgb2YgYXBwZWFyYW5jZSwgb2Jzb2xldGUgb25lcyBhcmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSBfdHJlZSBBIGxpc3QgdG8gc3luYyB0aGlzIHdpdGhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3RydWN0dXJlKF90cmVlOiBUcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfdHJlZS5nZXRJdGVtcygpKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZEl0ZW0oaXRlbS5kYXRhKTtcclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgIGZvdW5kLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBmb3VuZC5oYXNDaGlsZHJlbiA9IGl0ZW0uaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICBpZiAoIWZvdW5kLmhhc0NoaWxkcmVuKVxyXG4gICAgICAgICAgICBmb3VuZC5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgaXRlbXMucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVHJlZUl0ZW19IG9mIHRoaXMgbGlzdCByZWZlcmVuY2luZyB0aGUgZ2l2ZW4gb2JqZWN0IG9yIG51bGwsIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmluZEl0ZW0oX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscygoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEsIF9kYXRhKSlcclxuICAgICAgICAgIHJldHVybiA8VHJlZUl0ZW08VD4+aXRlbTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4ge0BsaW5rIFRyZWVJdGVtfXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIHtAbGluayBUcmVlSXRlbX1zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRJdGVtcygpOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuZmlsdGVyKF9jaGlsZCA9PiBfY2hpbGQgaW5zdGFuY2VvZiBUcmVlSXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFTdGFydCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhRW5kKSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgZW5kKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShfZGF0YTogVFtdKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUcmVlSXRlbTxUPltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSkge1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoX2RhdGEsIGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFsbCBleHBhbmRlZCB7QGxpbmsgVHJlZUl0ZW19cyB0aGF0IGFyZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXhwYW5kZWQoKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiBbLi4udGhpc10uZmlsdGVyKF9pdGVtID0+IF9pdGVtLmV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFRyZWVJdGVtPFQ+PiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB5aWVsZCBpdGVtc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuaGFzKF9ldmVudCwgXCJpbmRleFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0OiBUID0gKDxUcmVlSXRlbTxUPj50aGlzLnBhcmVudEVsZW1lbnQpLmRhdGE7XHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpbmRleFwiLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IuaXNDb25uZWN0ZWQgP1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuaW5kZXhPZih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpIDpcclxuICAgICAgICBudWxsKTtcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcInBhcmVudFwiLCB0YXJnZXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXQ6IFQgPSAoPFRyZWVJdGVtPFQ+PnRoaXMucGFyZW50RWxlbWVudCkuZGF0YTtcclxuICAgICAgaWYgKHRhcmdldCA9PSBudWxsIHx8ICF0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0YXJnZXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdGFyZ2V0SXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoX3RhcmdldCA9PiBfdGFyZ2V0IGluc3RhbmNlb2YgVHJlZUl0ZW0pO1xyXG4gICAgICAgIGlmICh0aGlzLmdldEl0ZW1zKCkuaW5jbHVkZXModGFyZ2V0SXRlbSkpIHtcclxuICAgICAgICAgIGxldCByZWN0OiBET01SZWN0ID0gdGFyZ2V0SXRlbS5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgbGV0IGFkZEJlZm9yZTogYm9vbGVhbiA9IF9ldmVudC5jbGllbnRZIDwgcmVjdC50b3AgKyByZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBsZXQgc2libGluZzogRWxlbWVudCA9IGFkZEJlZm9yZSA/IHRhcmdldEl0ZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA6IHRhcmdldEl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHNpYmxpbmcgIT0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKVxyXG4gICAgICAgICAgICBpZiAoYWRkQmVmb3JlKVxyXG4gICAgICAgICAgICAgIHRhcmdldEl0ZW0uYmVmb3JlKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmFmdGVyKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZS1saXN0XCIsIFRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIlRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBleHBvcnQgZW51bSBDU1NfQ0xBU1Mge1xyXG4gICAgU0VMRUNURUQgPSBcInNlbGVjdGVkXCIsXHJcbiAgICBJTkFDVElWRSA9IFwiaW5hY3RpdmVcIlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHtAbGluayBUcmVlTGlzdH0gdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIGEgdHJlZSBjb250cm9sICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogdHJlZSA8dWw+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiDilJQgdHJlZUxpc3QgPHVsPlxyXG4gICAqIOKUgiAgIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCICAg4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlPFQ+IGV4dGVuZHMgVHJlZUxpc3Q8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9yb290OiBUKSB7XHJcbiAgICAgIHN1cGVyKF9jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGxldCByb290OiBUcmVlSXRlbTxUPiA9IG5ldyBUcmVlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIF9yb290KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyb290KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXhwYW5kKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0xFQVZFLCB0aGlzLmhuZERyYWdMZWF2ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXMgb3IgbnVsbCBpZiBub25lIGlzIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCB0aGUgd2hvbGUgdHJlZSB0byBzeW5jaHJvbml6ZSB3aXRoIHRoZSBkYXRhIHRoZSB0cmVlIGlzIGJhc2VkIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcykge1xyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpKTtcclxuICAgICAgICBpdGVtLmdldEJyYW5jaCgpLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oaXRlbS5kYXRhKSlcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gY2hpbGRyZW4gdG8gdGhlIGdpdmVuIHRhcmdldCBhdCB0aGUgZ2l2ZW4gaW5kZXguIElmIG5vIGluZGV4IGlzIGdpdmVuLCB0aGUgY2hpbGRyZW4gYXJlIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihfY2hpbGRyZW4sIF90YXJnZXQsIF9pbmRleCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogVCA9IHRoaXMuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgLy8gVE9ETzogZG9uJ3QsIHdoZW4gY29weWluZyBvciBjb21pbmcgZnJvbSBhbm90aGVyIHNvdXJjZVxyXG4gICAgICB0aGlzLmRlbGV0ZShtb3ZlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXREYXRhOiBUID0gPFQ+X3RhcmdldDtcclxuICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kVmlzaWJsZSh0YXJnZXREYXRhKTtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKHRhcmdldERhdGEpKTtcclxuICAgICAgbGV0IG9sZDogVHJlZUxpc3Q8VD4gPSB0YXJnZXRJdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB0YXJnZXRJdGVtLmhhc0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgaWYgKG9sZClcclxuICAgICAgICBvbGQucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRhcmdldEl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5maW5kVmlzaWJsZShmb2N1cyk/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFeHBhbmQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGNoaWxkcmVuOiBUW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKTtcclxuICAgICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKGNoaWxkcmVuKTtcclxuICAgICAgaXRlbS5zZXRCcmFuY2goYnJhbmNoKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQnJhbmNoKF9kYXRhOiBUW10pOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gbmV3IFRyZWVMaXN0PFQ+KHRoaXMuY29udHJvbGxlciwgW10pO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfZGF0YSkge1xyXG4gICAgICAgIGJyYW5jaC5hZGRJdGVtcyhbbmV3IFRyZWVJdGVtKHRoaXMuY29udHJvbGxlciwgY2hpbGQpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJyYW5jaDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSBhc3luYyAoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG4gICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfU1RBUlQ6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdTdGFydChpdGVtLmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX09WRVI6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ092ZXIoX2V2ZW50KTtcclxuICAgICAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUk9QOlxyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kcm9wKF9ldmVudCk7XHJcbiAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpbmRleFwiKTtcclxuICAgICAgICAgIGxldCBwYXJlbnQ6IFQgPSBSZWZsZWN0LmdldChfZXZlbnQsIFwicGFyZW50XCIpO1xyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbihvYmplY3RzLCBpbmRleCA9PSBudWxsID8gaXRlbS5kYXRhIDogcGFyZW50LCBpbmRleCk7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdMZWF2ZSA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBsZXQgcmVsYXRlZFRhcmdldDogRXZlbnRUYXJnZXQgPSBfZXZlbnQucmVsYXRlZFRhcmdldDtcclxuICAgICAgLy8gaWYgKHJlbGF0ZWRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0KSAmJiAhdGhpcy5jb250YWlucyhyZWxhdGVkVGFyZ2V0Lm9mZnNldFBhcmVudCkpIC8vIG9mZnNldCBwYXJlbnQgaXMgZm9yIHdlaXJkIChpbnZpc2libGUpIGRpdnMgd2hpY2ggYXJlIHBsYWNlZCBvdmVyIGlucHV0IGVsZW1lbnRzIGFuZCB0cmlnZ2VyIGxlYXZlIGV2ZW50cy4uLiBcclxuICAgICAgLy8gICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmVtb3ZlOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZShyZW1vdmUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEVzY2FwZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDb3B5UGFzdGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhfZXZlbnQpO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmN1dCh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIC8vIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4ob2JqZWN0cywgdGFyZ2V0LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgVHJlZSwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vRGF0YUNvbnRyb2xsZXIudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIHtAbGluayBUcmVlfSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSB7QGxpbmsgVHJlZX0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJlZUNvbnRyb2xsZXI8VD4gZXh0ZW5kcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogVXNlZCBieSB0aGUgdHJlZSB0byBpbmRpY2F0ZSB0aGUgZHJvcCBwb3NpdGlvbiB3aGlsZSBkcmFnZ2luZyAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wSW5kaWNhdG9yOiBIVE1MSFJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpO1xyXG5cclxuICAgIC8qKiBPdmVycmlkZSB0byBlbmFibGUgdHJlZSBpdGVtcyB0byBiZSBzb3J0YWJsZSBieSB0aGUgdXNlciB2aWEgZHJhZy1hbmQtZHJvcC4gRGVmYXVsdCBpcyB0cnVlLiAqL1xyXG4gICAgcHVibGljIHNvcnRhYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGRyYWdnYWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ2dhYmxlKF9vYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdHdvIG9iamVjdHMgb2YgYXJlIGVxdWFsLiBEZWZhdWx0IGlzIF9hID09IF9iLiBPdmVycmlkZSBmb3IgbW9yZSBjb21wbGV4IGNvbXBhcmlzb25zLiBcclxuICAgICAqIFVzZWZ1bCB3aGVuIHRoZSB1bmRlcmx5aW5nIGRhdGEgaXMgdm9sYXRpbGUgYW5kIGNoYW5nZXMgaWRlbnRpdHkgd2hpbGUgc3RheWluZyB0aGUgc2FtZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyhfYTogVCwgX2I6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hID09IF9iO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgYWRkYWJsZSB0byBvdGhlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgLyoqIENyZWF0ZSBhbiBIVE1MRWxlbWVudCBmb3IgdGhlIHRyZWUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdC4gZS5nLiBhbiBIVE1MSW5wdXRFbGVtZW50ICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlQ29udGVudChfb2JqZWN0OiBUKTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgbGlzdCBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IGZvciBmdXJ0aGVyIHN0eWxpbmcgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBQcm9jZXNzIHRoZSBwcm9wb3NlZCBuZXcgdmFsdWUuIFRoZSBpZCBvZiB0aGUgaHRtbCBlbGVtZW50IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugb2NjdXJlZCBpcyBwYXNzZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWYWx1ZShfb2JqZWN0OiBULCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBoYXMgY2hpbGRyZW4gdGhhdCBtdXN0IGJlIHNob3duIHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBoYXNDaGlsZHJlbihfb2JqZWN0OiBUKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRoZSBvYmplY3QncyBjaGlsZHJlbiB0byBzaG93IHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDaGlsZHJlbihfb2JqZWN0OiBUKTogVFtdO1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogVFtdO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiBsaS1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSB7QGxpbmsgVHJlZUxpc3R9IHdpdGggYSBjaGVja2JveCBhbmQgdXNlciBkZWZpbmVkIGlucHV0IGVsZW1lbnRzIGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnT3Zlcik7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnRHJvcCk7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZFJlbW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUsIHdoZW4gdGhpcyBpdGVtIGhhcyBhIHZpc2libGUgY2hlY2tib3ggaW4gZnJvbnQgdG8gZXhwYW5kIHRoZSBzdWJzZXF1ZW50IGJyYW5jaCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3Mgb3IgaGlkZXMgdGhlIGNoZWNrYm94IGZvciBleHBhbmRpbmcgdGhlIHN1YnNlcXVlbnQgYnJhbmNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgaGFzQ2hpbGRyZW4oX2hhczogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgPSBfaGFzID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgcmVwcmVzZW50aW5nIHRoZSBhdHRhY2hlZCB7QGxpbmsgZGF0YX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjb250ZW50KCk6IEhUTUxGaWVsZFNldEVsZW1lbnQge1xyXG4gICAgICByZXR1cm4gdGhpcy4jY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGlzIGl0ZW0gaXMgZXhwYW5kZWQsIHNob3dpbmcgaXQncyBjaGlsZHJlbiwgb3IgY2xvc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEJyYW5jaCgpICYmIHRoaXMuY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy4jY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIuY3JlYXRlQ29udGVudCh0aGlzLmRhdGEpKTtcclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmllcyB0byBleHBhbmRpbmcgdGhlIHtAbGluayBUcmVlTGlzdH0gb2YgY2hpbGRyZW4sIGJ5IGRpc3BhdGNoaW5nIHtAbGluayBFVkVOVC5FWFBBTkR9LlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQge0BsaW5rIFRyZWVMaXN0fSBhbmQgYWRkIGl0IGFzIGJyYW5jaCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcblxyXG4gICAgICBpZiAoX2V4cGFuZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVYUEFORCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuXHJcbiAgICAgIHRoaXMuY2hlY2tib3guY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgICAgLy8gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIHtAbGluayBUcmVlTGlzdH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEJyYW5jaChfYnJhbmNoOiBUcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG4gICAgICBpZiAoX2JyYW5jaClcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKF9icmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJyYW5jaCgpOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIHJldHVybiA8VHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUge0BsaW5rIEVWRU5ULlNFTEVDVH0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBmcm9tIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUJyYW5jaCgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmdldEJyYW5jaCgpO1xyXG4gICAgICBpZiAoIWJyYW5jaClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5jaGVja2JveC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY2hlY2tib3gpO1xyXG4gICAgICB0aGlzLiNjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuI2NvbnRlbnQpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLiNjb250ZW50LmRpc2FibGVkKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRVNDIHx8IF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRU5URVIpXHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICF0aGlzLmV4cGFuZGVkKVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5leHBhbmRlZClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy4jY29udGVudC5lbGVtZW50cy5pdGVtKDApO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGJsQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoX2V2ZW50LnBhZ2VYLCBfZXZlbnQucGFnZVkpOyAvLyBkaXNhYmxlZCBlbGVtZW50cyBkb24ndCBkaXNwYXRjaCBjbGljayBldmVudHMsIGdldCB0aGUgZWxlbWVudCBtYW51YWxseVxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdGFyZ2V0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuc2V0VmFsdWUodGhpcy5kYXRhLCB0YXJnZXQpO1xyXG5cclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUk9QKVxyXG4gICAgICAvLyAgIGRlYnVnZ2VyO1xyXG4gICAgICBpZiAoUmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBzdG9yZSB0aGUgZHJhZ2dlZCBpdGVtIGluIHRoZSBldmVudCBmb3IgZnVydGhlciBwcm9jZXNzaW5nIGluIHRhYmxlXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRoaXMuI2NvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpIHx8ICF0aGlzLmNvbnRyb2xsZXIuc29ydGFibGUpIHtcclxuICAgICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuICAgICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJBR19PVkVSKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0aGlzLmRhdGEpKSB7XHJcbiAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB0aGUgdmlld3MgbWlnaHQgbmVlZCB0byBrbm93IGFib3V0IHRoaXMgZXZlbnRcclxuICAgICAgLy8gaWYgKF9ldmVudC5jdXJyZW50VGFyZ2V0ID09IF9ldmVudC50YXJnZXQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJsaS10cmVlLWl0ZW1cIiwgVHJlZUl0ZW0sIHsgZXh0ZW5kczogXCJsaVwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIGV4cG9ydCB0eXBlIERST1BFRkZFQ1QgPSBcIm5vbmVcIiB8IFwiY29weVwiIHwgXCJsaW5rXCIgfCBcIm1vdmVcIjtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGVudW0gRVZFTlQge1xyXG4gICAgQ0xJQ0sgPSBcImNsaWNrXCIsXHJcbiAgICBET1VCTEVfQ0xJQ0sgPSBcImRibGNsaWNrXCIsXHJcbiAgICBLRVlfRE9XTiA9IFwia2V5ZG93blwiLFxyXG4gICAgRFJBR19TVEFSVCA9IFwiZHJhZ3N0YXJ0XCIsXHJcbiAgICBEUkFHX0VOVEVSID0gXCJkcmFnZW50ZXJcIixcclxuICAgIERSQUdfT1ZFUiA9IFwiZHJhZ292ZXJcIixcclxuICAgIERSQUdfTEVBVkUgPSBcImRyYWdsZWF2ZVwiLFxyXG4gICAgRFJPUCA9IFwiZHJvcFwiLFxyXG4gICAgUE9JTlRFUl9VUCA9IFwicG9pbnRlcnVwXCIsXHJcbiAgICBXSEVFTCA9IFwid2hlZWxcIixcclxuICAgIEZPQ1VTX05FWFQgPSBcImZvY3VzTmV4dFwiLFxyXG4gICAgRk9DVVNfUFJFVklPVVMgPSBcImZvY3VzUHJldmlvdXNcIixcclxuICAgIEZPQ1VTX0lOID0gXCJmb2N1c2luXCIsXHJcbiAgICBGT0NVU19PVVQgPSBcImZvY3Vzb3V0XCIsXHJcbiAgICBGT0NVU19TRVQgPSBcImZvY3VzU2V0XCIsXHJcbiAgICBCTFVSID0gXCJibHVyXCIsXHJcbiAgICBDSEFOR0UgPSBcImNoYW5nZVwiLFxyXG4gICAgREVMRVRFID0gXCJkZWxldGVcIixcclxuICAgIFJFTkFNRSA9IFwicmVuYW1lXCIsXHJcbiAgICBTRUxFQ1QgPSBcIml0ZW1zZWxlY3RcIixcclxuICAgIEVTQ0FQRSA9IFwiZXNjYXBlXCIsXHJcbiAgICBDT1BZID0gXCJjb3B5XCIsXHJcbiAgICBDVVQgPSBcImN1dFwiLFxyXG4gICAgUEFTVEUgPSBcInBhc3RlXCIsXHJcbiAgICBTT1JUID0gXCJzb3J0XCIsXHJcbiAgICBDT05URVhUTUVOVSA9IFwiY29udGV4dG1lbnVcIixcclxuICAgIE1VVEFURSA9IFwibXV0YXRlXCIsXHJcbiAgICBSRU1PVkVfQ0hJTEQgPSBcInJlbW92ZUNoaWxkXCIsXHJcbiAgICBDT0xMQVBTRSA9IFwiY29sbGFwc2VcIixcclxuICAgIEVYUEFORCA9IFwiZXhwYW5kXCIsXHJcbiAgICBJTlBVVCA9IFwiaW5wdXRcIixcclxuICAgIFJFQVJSQU5HRV9BUlJBWSA9IFwicmVhcnJhbmdlQXJyYXlcIixcclxuICAgIFRPR0dMRSA9IFwidG9nZ2xlXCIsXHJcbiAgICBQT0lOVEVSX01PVkUgPSBcInBvaW50ZXJtb3ZlXCIsXHJcbiAgICBJTlNFUlQgPSBcImluc2VydFwiLFxyXG4gICAgU0VMRUNUX0FMTCA9IFwic2VsZWN0QWxsXCJcclxuICB9XHJcbn0iXX0=